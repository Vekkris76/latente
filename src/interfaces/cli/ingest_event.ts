/**
 * Runner CLI para Ingesta de Eventos
 *
 * Uso: npx ts-node src/cli/ingest_event.ts --user u1
 * Lee JSON por stdin
 */

import { EventIngestionService } from '../../application/services/events/EventIngestionService';
import { EventRepository } from '../../infrastructure/repositories/memory/EventRepository';
import { AbstractEventValidator } from '../../domain/validation/AbstractEventValidator';
import * as fs from 'fs';

async function main() {
  // 1. Parsear argumentos
  const args = process.argv.slice(2);
  const userIndex = args.indexOf('--user');
  if (userIndex === -1 || !args[userIndex + 1]) {
    console.error('Error: Se requiere --user <userId>');
    process.exit(1);
  }
  const userId = args[userIndex + 1];

  // 2. Inicializar dependencias
  const eventRepo = new EventRepository();
  const validator = new AbstractEventValidator();
  const service = new EventIngestionService(eventRepo, validator);

  // 3. Leer stdin
  try {
    const inputData = fs.readFileSync(0, 'utf-8');
    if (!inputData.trim()) {
      console.error('Error: No se recibió JSON por stdin');
      process.exit(1);
    }

    const input = JSON.parse(inputData);

    // 4. Ejecutar ingesta
    const result = await service.ingest(userId, input);

    // 5. Imprimir resultado
    console.log(`OK ${result.id}`);
  } catch (error: any) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
}

main();
