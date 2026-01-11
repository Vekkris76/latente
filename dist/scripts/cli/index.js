"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/cli/index.ts
const ui_1 = require("./ui");
const formatters_1 = require("./formatters");
// CommonJS require para no pelear con tsconfig/moduleResolution
const { createAdapter } = require("./adapter");
const { runHappyPath } = require("./flows/happyPath");
// Usuarios v1 demo
const CLI_USERS = {
    A: "userA",
    B: "userB",
};
function isNumeric(s) {
    return /^[0-9]+$/.test(s.trim());
}
function asArray(v) {
    return Array.isArray(v) ? v : [];
}
async function safeCall(ui, fn, notAvailableMsg) {
    if (!fn) {
        ui.warn(notAvailableMsg);
        return null;
    }
    try {
        return await fn();
    }
    catch (e) {
        ui.error(e?.message ?? String(e));
        return null;
    }
}
async function main() {
    const ui = (0, ui_1.createUi)();
    const adapter = createAdapter();
    let now = new Date("2026-01-10T10:00:00.000Z");
    const A = CLI_USERS.A;
    const B = CLI_USERS.B;
    // onboarding local (solo UI) para menú dinámico
    const onboard = {
        [A]: { consent: false, profile: false },
        [B]: { consent: false, profile: false },
    };
    async function pickUserId(prompt = "Usuario (A/B, Enter=A): ") {
        const who = (await ui.ask(prompt)).trim().toUpperCase();
        const userId = who === "B" ? B : A;
        ui.info(`Usuario seleccionado: ${(0, formatters_1.labelUser)(userId, A, B)}`);
        return userId;
    }
    async function headerStatus() {
        const proposals = asArray(await safeCall(ui, adapter.listProposals?.bind(adapter), "adapter.listProposals no disponible"));
        const copresences = asArray(await safeCall(ui, adapter.listCoPresences?.bind(adapter), "adapter.listCoPresences no disponible"));
        const activeA = await safeCall(ui, adapter.getActiveWindowForUser ? () => adapter.getActiveWindowForUser(A, now) : undefined, "adapter.getActiveWindowForUser no disponible");
        const activeB = await safeCall(ui, adapter.getActiveWindowForUser ? () => adapter.getActiveWindowForUser(B, now) : undefined, "adapter.getActiveWindowForUser no disponible");
        const revA = asArray(await safeCall(ui, adapter.getRevelations ? () => adapter.getRevelations(A, now) : undefined, "adapter.getRevelations no disponible"));
        const revB = asArray(await safeCall(ui, adapter.getRevelations ? () => adapter.getRevelations(B, now) : undefined, "adapter.getRevelations no disponible"));
        ui.title("LATENTE — CLI");
        ui.info([
            `NOW: ${(0, formatters_1.fmtNow)(now)}`,
            `Propuestas: ${proposals.length}`,
            `Co-presencias: ${copresences.length}`,
            `Ventana activa: A=${activeA ? "sí" : "no"} B=${activeB ? "sí" : "no"}`,
            `Revelaciones activas: A=${revA.length} B=${revB.length}`,
        ].join(" | "));
        return { proposals, copresences, activeA, activeB, revA, revB };
    }
    async function selectFromListByIndexOrId(items, input, uiName) {
        const trimmed = input.trim();
        if (!trimmed)
            return items[0] ?? null;
        if (isNumeric(trimmed)) {
            const idx = Number(trimmed) - 1;
            if (idx < 0 || idx >= items.length) {
                ui.warn(`${uiName}: índice fuera de rango.`);
                return null;
            }
            return items[idx];
        }
        const byId = items.find((x) => x?.id === trimmed);
        if (!byId)
            ui.warn(`${uiName}: id no encontrado.`);
        return byId ?? null;
    }
    while (true) {
        const st = await headerStatus();
        const onboardedA = onboard[A].consent && onboard[A].profile;
        const onboardedB = onboard[B].consent && onboard[B].profile;
        const hasProposals = st.proposals.length > 0;
        const hasAnyActiveWindow = !!st.activeA || !!st.activeB;
        const menuItems = [
            { key: "1", label: "Consentimientos (A/B)" },
            { key: "2", label: "Perfil mínimo (A/B)" },
            { key: "14", label: "Cambiar NOW (simular tiempo)" },
            ...(onboardedA && onboardedB
                ? [
                    { key: "3", label: "Ingestar eventos demo (A/B)" },
                    { key: "4", label: "Detectar patrones (A/B)" },
                    { key: "5", label: "Detectar co-presencias (A,B)" },
                    { key: "6", label: "Generar propuestas" },
                ]
                : []),
            ...(hasProposals
                ? [
                    { key: "7", label: "Aceptar/Declinar propuesta (A/B)" },
                    { key: "8", label: "Activar ventana desde propuesta" },
                ]
                : []),
            ...(hasAnyActiveWindow ? [{ key: "9", label: 'Confirmar "Creo que te he visto" (A/B)' }] : []),
            { key: "10", label: "Ver revelaciones (A/B)" },
            { key: "11", label: "Seguridad: Bloquear / Reportar" },
            { key: "12", label: "Eliminar cuenta (A/B)" },
            ...(onboardedA && onboardedB ? [{ key: "13", label: "Demo guiada (happy path automático)" }] : []),
            { key: "15", label: "Debug: listar estado repos" },
            { key: "0", label: "Salir" },
        ];
        const choice = (await ui.menu("Menú principal", menuItems)).trim().toLowerCase();
        switch (choice) {
            case "0":
                ui.info("Saliendo...");
                ui.close();
                process.exit(0);
            case "1": {
                const userId = await pickUserId();
                await safeCall(ui, adapter.setConsent ? () => adapter.setConsent(userId, { accepted: true, now }) : undefined, "adapter.setConsent no disponible. Marcando consentimiento solo en estado local.");
                onboard[userId].consent = true;
                ui.info("Consentimiento registrado (v1).");
                break;
            }
            case "2": {
                const userId = await pickUserId();
                const name = (await ui.ask("Nombre (Enter=Demo): ")).trim() || "Demo";
                const ageRaw = (await ui.ask("Edad (Enter=30): ")).trim() || "30";
                const age = Number(ageRaw);
                await safeCall(ui, adapter.setProfile ? () => adapter.setProfile(userId, { name, age, now }) : undefined, "adapter.setProfile no disponible. Marcando perfil solo en estado local.");
                onboard[userId].profile = true;
                ui.info(`Perfil mínimo guardado: name=${name}, age=${age}`);
                break;
            }
            case "3": {
                const userId = await pickUserId();
                ui.title("Ingesta eventos demo");
                const howMany = Number((await ui.ask("¿Cuántos eventos? (Enter=3): ")).trim() || "3");
                const place = (await ui.ask("place_category (Enter=cafe): ")).trim() || "cafe";
                const bucket = (await ui.ask("time_bucket (Enter=morning): ")).trim() || "morning";
                const res = (await safeCall(ui, adapter.ingestDemoEvents
                    ? () => adapter.ingestDemoEvents(userId, { count: howMany, place_category: place, time_bucket: bucket, now })
                    : undefined, "adapter.ingestDemoEvents no disponible. Intentando adapter.ingestEvent en bucle.")) ??
                    (await (async () => {
                        if (!adapter.ingestEvent) {
                            ui.warn("adapter.ingestEvent no disponible. No puedo ingestar eventos.");
                            return null;
                        }
                        const weekIds = ["2026-W01", "2026-W02", "2026-W03", "2026-W04", "2026-W05"].slice(0, Math.max(1, howMany));
                        for (const w of weekIds) {
                            await adapter.ingestEvent(userId, {
                                time_bucket: bucket,
                                place_category: place,
                                day_type: "weekday",
                                duration_bucket: "medium",
                                week_id: w,
                            });
                        }
                        return { ingested: weekIds.length };
                    })());
                ui.info("OK — Eventos ingestado(s).");
                if (res)
                    ui.json(res);
                break;
            }
            case "4": {
                const userId = await pickUserId();
                ui.title("Detectar patrones");
                const out = await safeCall(ui, adapter.detectPatternsForUser
                    ? () => adapter.detectPatternsForUser(userId)
                    : adapter.detectPatterns
                        ? () => adapter.detectPatterns(userId)
                        : undefined, "No encuentro método de detección de patrones en adapter (detectPatternsForUser/detectPatterns).");
                if (out) {
                    ui.info("OK — Patrones detectados.");
                    ui.json(out);
                }
                break;
            }
            case "5": {
                ui.title("Detectar co-presencias");
                const out = await safeCall(ui, adapter.detectCoPresences
                    ? () => adapter.detectCoPresences([A, B])
                    : adapter.detectCoPresencesForUsers
                        ? () => adapter.detectCoPresencesForUsers([A, B])
                        : undefined, "No encuentro método de detección de co-presencias en adapter.");
                if (out) {
                    ui.info("OK — Co-presencias detectadas.");
                    ui.json(out);
                }
                break;
            }
            case "6": {
                ui.title("Generar propuestas");
                const out = await safeCall(ui, adapter.generateProposals
                    ? () => adapter.generateProposals(now)
                    : adapter.generateFromCoPresences
                        ? () => adapter.generateFromCoPresences(now)
                        : undefined, "No encuentro método de generación de propuestas en adapter.");
                if (out) {
                    ui.info("OK — Propuestas generadas.");
                    ui.json(out);
                }
                break;
            }
            case "7": {
                ui.title("Aceptar / Declinar propuesta");
                const proposals = asArray(await safeCall(ui, adapter.listProposals?.bind(adapter), "adapter.listProposals no disponible"));
                if (proposals.length === 0) {
                    ui.warn("No hay propuestas.");
                    break;
                }
                ui.info("Propuestas:");
                ui.info(proposals.map((p, i) => (0, formatters_1.formatProposalLine)(p, i)).join("\n"));
                const input = await ui.ask("Selecciona propuesta (Enter=1, número o id): ");
                const selected = await selectFromListByIndexOrId(proposals, input, "Propuesta");
                if (!selected)
                    break;
                const userId = await pickUserId();
                const action = (await ui.ask("Acción (a=aceptar, d=declinar) [a]: ")).trim().toLowerCase() || "a";
                if (action === "d") {
                    const out = await safeCall(ui, adapter.declineProposal ? () => adapter.declineProposal(selected.id, userId, now) : undefined, "adapter.declineProposal no disponible.");
                    if (out)
                        ui.json(out);
                    ui.info("OK — Declinar procesado.");
                }
                else {
                    const out = await safeCall(ui, adapter.acceptProposal ? () => adapter.acceptProposal(selected.id, userId, now) : undefined, "adapter.acceptProposal no disponible.");
                    if (out)
                        ui.json(out);
                    ui.info("OK — Aceptar procesado.");
                }
                break;
            }
            case "8": {
                ui.title("Activar ventana desde propuesta");
                const proposals = asArray(await safeCall(ui, adapter.listProposals?.bind(adapter), "adapter.listProposals no disponible"));
                if (proposals.length === 0) {
                    ui.warn("No hay propuestas.");
                    break;
                }
                ui.info("Propuestas:");
                ui.info(proposals.map((p, i) => (0, formatters_1.formatProposalLine)(p, i)).join("\n"));
                const input = await ui.ask("Selecciona propuesta (Enter=1, número o id): ");
                const selected = await selectFromListByIndexOrId(proposals, input, "Propuesta");
                if (!selected)
                    break;
                const out = await safeCall(ui, adapter.activateWindowFromProposal
                    ? () => adapter.activateWindowFromProposal(selected.id, now)
                    : undefined, "No encuentro método para activar ventana desde propuesta (activateWindowFromProposal).");
                if (out) {
                    ui.info("OK — Ventana activa creada.");
                    ui.json(out);
                }
                break;
            }
            case "9": {
                ui.title('Confirmar "Creo que te he visto"');
                const userId = await pickUserId();
                const active = await safeCall(ui, adapter.getActiveWindowForUser ? () => adapter.getActiveWindowForUser(userId, now) : undefined, "adapter.getActiveWindowForUser no disponible.");
                if (!active) {
                    ui.warn("No hay ventana activa para ese usuario.");
                    break;
                }
                ui.info("Ventana activa:");
                ui.info((0, formatters_1.formatActiveWindowLine)(active));
                const out = await safeCall(ui, adapter.confirmRecognition
                    ? () => adapter.confirmRecognition(active.id, userId, now)
                    : adapter.confirm
                        ? () => adapter.confirm(active.id, userId, now)
                        : undefined, "No encuentro método para confirmar reconocimiento (confirmRecognition/confirm).");
                if (out) {
                    ui.info("OK — Confirmación registrada.");
                    ui.json(out);
                }
                break;
            }
            case "10": {
                const userId = await pickUserId();
                ui.title(`Revelaciones activas (${(0, formatters_1.labelUser)(userId, A, B)})`);
                const out = asArray(await safeCall(ui, adapter.getRevelations ? () => adapter.getRevelations(userId, now) : undefined, "adapter.getRevelations no disponible"));
                ui.info(`Revelaciones activas: ${out.length}`);
                if (out.length > 0) {
                    ui.info(out.map((r, idx) => (0, formatters_1.formatRevelationLine)(r, idx)).join("\n"));
                }
                const dump = (await ui.ask("¿Ver JSON completo? (y/N): ")).trim().toLowerCase();
                if (dump === "y")
                    ui.json(out);
                break;
            }
            case "11": {
                ui.title("Seguridad: Bloquear / Reportar");
                const userId = await pickUserId();
                const target = (await ui.ask("Target (Enter=otro usuario del demo): ")).trim() || (userId === A ? B : A);
                ui.info(`Target: ${(0, formatters_1.labelUser)(target, A, B)}`);
                const mode = (await ui.ask("Acción (b=bloquear, r=reportar) [b]: ")).trim().toLowerCase() || "b";
                const ok = await ui.confirm("¿Confirmas esta acción? (y/N): ");
                if (!ok) {
                    ui.info("Cancelado.");
                    break;
                }
                if (mode === "r") {
                    const reason = (await ui.ask("Motivo (Enter=unspecified): ")).trim() || "unspecified";
                    const out = await safeCall(ui, adapter.reportUser ? () => adapter.reportUser(userId, target, { reason, now }) : undefined, "adapter.reportUser no disponible.");
                    if (out)
                        ui.json(out);
                    ui.info("OK — Reporte registrado.");
                }
                else {
                    const out = await safeCall(ui, adapter.blockUser ? () => adapter.blockUser(userId, target, { now }) : undefined, "adapter.blockUser no disponible.");
                    if (out)
                        ui.json(out);
                    ui.info("OK — Bloqueo registrado.");
                }
                break;
            }
            case "12": {
                ui.title("Eliminar cuenta");
                const userId = await pickUserId();
                const ok = await ui.confirm("¿Eliminar cuenta y purgar datos? (y/N): ");
                if (!ok) {
                    ui.info("Cancelado.");
                    break;
                }
                const out = await safeCall(ui, adapter.deleteAccount ? () => adapter.deleteAccount(userId, { now }) : undefined, "adapter.deleteAccount no disponible.");
                if (out)
                    ui.json(out);
                ui.info("OK — Eliminación solicitada/procesada.");
                break;
            }
            case "13":
            case "d": {
                ui.title("Demo guiada (happy path)");
                if (!(onboardedA && onboardedB)) {
                    ui.info("Primero completa Consentimientos (1) y Perfil mínimo (2) para A y B.");
                    break;
                }
                ui.info("Ejecutando demo guiada...");
                const out = await safeCall(ui, () => runHappyPath(adapter, now), "runHappyPath no disponible.");
                if (out) {
                    ui.info("OK — Demo completada.");
                    ui.json(out);
                }
                ui.info("Sugerencia: entra en 'Ver revelaciones (10)'.");
                break;
            }
            case "14": {
                ui.title("Cambiar NOW");
                ui.info(`NOW actual: ${(0, formatters_1.fmtNow)(now)}`);
                const next = (await ui.ask("Nuevo NOW ISO (Enter=+24h): ")).trim();
                if (!next) {
                    now = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                    ui.info(`NOW actualizado: ${(0, formatters_1.fmtNow)(now)}`);
                    break;
                }
                const d = new Date(next);
                if (isNaN(d.getTime())) {
                    ui.warn("Fecha inválida. Ejemplo: 2026-01-12T10:00:00.000Z");
                    break;
                }
                now = d;
                ui.info(`NOW actualizado: ${(0, formatters_1.fmtNow)(now)}`);
                break;
            }
            case "15": {
                ui.title("Debug: estado repos");
                const out = await safeCall(ui, adapter.debugDump ? () => adapter.debugDump() : undefined, "adapter.debugDump no disponible.");
                if (out)
                    ui.json(out);
                break;
            }
            default:
                ui.warn("Opción no válida.");
        }
    }
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=index.js.map