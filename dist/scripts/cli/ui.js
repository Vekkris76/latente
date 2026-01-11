"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUi = createUi;
// scripts/cli/ui.ts
const node_readline_1 = __importDefault(require("node:readline"));
function createUi() {
    const rl = node_readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    function ask(prompt) {
        return new Promise((resolve) => rl.question(prompt, resolve));
    }
    function title(text) {
        console.log(`\n=== ${text} ===`);
    }
    function info(text) {
        console.log(text);
    }
    function warn(text) {
        console.log(`WARN: ${text}`);
    }
    function error(text) {
        console.log(`ERROR: ${text}`);
    }
    function json(obj) {
        console.dir(obj, { depth: null });
    }
    async function menu(titleText, items) {
        title(titleText);
        for (const it of items) {
            console.log(`${it.key}) ${it.label}`);
        }
        const choice = (await ask("> ")).trim();
        return choice;
    }
    async function confirm(prompt = "¿Confirmas esta acción? (y/N): ") {
        const ans = (await ask(prompt)).trim().toLowerCase();
        return ans === "y";
    }
    function close() {
        rl.close();
    }
    return { ask, title, info, warn, error, json, menu, confirm, close };
}
//# sourceMappingURL=ui.js.map