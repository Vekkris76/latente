import pool from '../../src/infrastructure/database/client';
import { PROPOSAL_TTL_HOURS } from '../../src/config/decisions';

async function runPurge() {
  const client = await pool.connect();
  try {
    console.log('Iniciando job de purga...');

    // 1. AbstractEvents (> 4 semanas)
    const eventsRes = await client.query("DELETE FROM abstract_events WHERE created_at < NOW() - INTERVAL '4 weeks'");
    console.log(`AbstractEvents purgados: ${eventsRes.rowCount}`);

    // 2. Patterns expirados (> 4 semanas)
    const patternsRes = await client.query("DELETE FROM patterns WHERE pattern_status = 'expired' AND detected_at < NOW() - INTERVAL '4 weeks'");
    console.log(`Patterns purgados: ${patternsRes.rowCount}`);

    // 3. CoPresences no propuestas (> 7 días) o declinadas/expiradas (> 24h)
    const cpRes = await client.query(`
      DELETE FROM latent_copresences 
      WHERE (status = 'detected' AND detected_at < NOW() - INTERVAL '7 days')
      OR (status IN ('declined', 'expired') AND detected_at < NOW() - INTERVAL '24 hours')
    `);
    console.log(`CoPresences purgadas: ${cpRes.rowCount}`);

    // 4. SyncWindows (Proposals) expiradas por TTL o declinadas (> 24h)
    const windowsRes = await client.query(`
      DELETE FROM sync_windows 
      WHERE (window_status = 'pending' AND created_at < NOW() - INTERVAL '${PROPOSAL_TTL_HOURS} hours')
      OR (window_status IN ('declined', 'expired') AND created_at < NOW() - INTERVAL '24 hours')
    `);
    console.log(`SyncWindows purgadas: ${windowsRes.rowCount}`);

    // 5. Recognitions unilaterales (> 24h desde fin de ventana)
    // Nota: Se purgan si la ventana asociada ya terminó hace más de 24h y no hubo mutualidad
    const recognitionsRes = await client.query(`
      DELETE FROM recognitions 
      WHERE active_window_id IN (
        SELECT id FROM active_windows WHERE end_time < NOW() - INTERVAL '24 hours'
      )
      AND active_window_id NOT IN (
        SELECT active_window_id FROM recognitions GROUP BY active_window_id HAVING COUNT(*) > 1
      )
    `);
    console.log(`Recognitions unilaterales purgados: ${recognitionsRes.rowCount}`);

    // 6. Revelation Messages (Conversaciones expiradas)
    const messagesRes = await client.query(`
      DELETE FROM conversation_messages 
      WHERE revelation_id IN (
        SELECT id FROM revelations WHERE expires_at < NOW()
      )
    `);
    console.log(`Mensajes de conversaciones expiradas purgados: ${messagesRes.rowCount}`);

    // 7. Marcar Revelations como expiradas
    const revelationsUpdateRes = await client.query(`
      UPDATE revelations SET status = 'expired' WHERE expires_at < NOW() AND status = 'active'
    `);
    console.log(`Revelations marcadas como expiradas: ${revelationsUpdateRes.rowCount}`);

    console.log('Job de purga finalizado con éxito.');
  } catch (err) {
    console.error('Error en job de purga:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

runPurge().catch(console.error);
