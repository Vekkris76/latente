"use strict";
/**
 * Runner CLI para Ingesta de Eventos
 *
 * Uso: npx ts-node src/cli/ingest_event.ts --user u1
 * Lee JSON por stdin
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const EventIngestionService_1 = require("../services/events/EventIngestionService");
const EventRepository_1 = require("../repositories/EventRepository");
const AbstractEventValidator_1 = require("../validation/AbstractEventValidator");
const fs = __importStar(require("fs"));
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
    const eventRepo = new EventRepository_1.EventRepository();
    const validator = new AbstractEventValidator_1.AbstractEventValidator();
    const service = new EventIngestionService_1.EventIngestionService(eventRepo, validator);
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
    }
    catch (error) {
        console.error(`ERROR: ${error.message}`);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=ingest_event.js.map