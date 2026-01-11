"use strict";
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory())
            files.push(...walk(full));
        else if (e.isFile() && full.endsWith(".ts"))
            files.push(full);
    }
    return files;
}
function normalizeWhitespace(s) {
    return s.replace(/\s+/g, " ").trim();
}
function extractServicesFromFile(absPath, relPath) {
    const src = fs.readFileSync(absPath, "utf8");
    // Detect exported classes: export class X { ... }
    const classRegex = /export\s+class\s+([A-Za-z0-9_]+)\s*\{/g;
    const services = [];
    let m;
    while ((m = classRegex.exec(src)) !== null) {
        const className = m[1];
        // Slice from class start to end of file (approx)
        const startIdx = m.index;
        const classBody = src.slice(startIdx);
        // Constructor signature (first "constructor(" ... ")")
        const ctorMatch = classBody.match(/constructor\s*\(([\s\S]*?)\)\s*\{/);
        const constructorSig = ctorMatch
            ? `constructor(${normalizeWhitespace(ctorMatch[1])})`
            : null;
        // Public async methods: public async name(...) : ReturnType
        // Also accept "async name(" without explicit public (many codebases do this)
        const methods = [];
        // 1) explicit "public async"
        const pubAsyncRegex = /public\s+async\s+([A-Za-z0-9_]+)\s*\(([\s\S]*?)\)\s*:\s*([A-Za-z0-9_<>,\[\]\s|]+)\s*\{/g;
        let pm;
        while ((pm = pubAsyncRegex.exec(classBody)) !== null) {
            const name = pm[1];
            const args = normalizeWhitespace(pm[2]);
            const ret = normalizeWhitespace(pm[3]);
            methods.push(`async ${name}(${args}): ${ret}`);
        }
        // 2) "async name(...): ReturnType" (no public)
        const asyncRegex = /(^|\n)\s*async\s+([A-Za-z0-9_]+)\s*\(([\s\S]*?)\)\s*:\s*([A-Za-z0-9_<>,\[\]\s|]+)\s*\{/g;
        let am;
        while ((am = asyncRegex.exec(classBody)) !== null) {
            const name = am[2];
            const args = normalizeWhitespace(am[3]);
            const ret = normalizeWhitespace(am[4]);
            // Avoid duplicates if already captured by "public async"
            const sig = `async ${name}(${args}): ${ret}`;
            if (!methods.includes(sig))
                methods.push(sig);
        }
        // Heuristic: keep methods in file order
        services.push({
            relPath,
            className,
            constructorSig,
            publicAsyncMethods: methods,
        });
    }
    return services;
}
function mdEscape(s) {
    return s.replace(/`/g, "\\`");
}
function main() {
    const repoRoot = process.cwd();
    const servicesDir = path.join(repoRoot, "src", "services");
    if (!fs.existsSync(servicesDir)) {
        console.error(`No existe: ${servicesDir}`);
        process.exit(1);
    }
    const files = walk(servicesDir).sort();
    const docs = [];
    for (const abs of files) {
        const rel = path.relative(repoRoot, abs).replace(/\\/g, "/");
        docs.push(...extractServicesFromFile(abs, rel));
    }
    // Sort by path then class
    docs.sort((a, b) => a.relPath.localeCompare(b.relPath) || a.className.localeCompare(b.className));
    const out = [];
    out.push(`# LATENTE — API de Servicios (generado desde código)`);
    out.push(``);
    out.push(`Generado: ${new Date().toISOString()}`);
    out.push(`Fuente de verdad: \`src/services/**\``);
    out.push(``);
    out.push(`Este documento se genera automáticamente para evitar desalineación entre documentación y repo.`);
    out.push(``);
    for (const d of docs) {
        out.push(`## ${mdEscape(d.className)}`);
        out.push(`**Ruta:** \`${mdEscape(d.relPath)}\``);
        out.push(``);
        out.push(`**Constructor**`);
        out.push(``);
        out.push("```ts");
        out.push(d.constructorSig ? d.constructorSig : "// (sin constructor explícito)");
        out.push("```");
        out.push(``);
        out.push(`**Métodos async (públicos / principales detectados)**`);
        out.push(``);
        out.push("```ts");
        if (d.publicAsyncMethods.length === 0) {
            out.push("// (no se detectaron métodos async con retorno tipado en este fichero)");
        }
        else {
            for (const sig of d.publicAsyncMethods)
                out.push(sig);
        }
        out.push("```");
        out.push(``);
    }
    const docsDir = path.join(repoRoot, "docs");
    if (!fs.existsSync(docsDir))
        fs.mkdirSync(docsDir, { recursive: true });
    const outPath = path.join(docsDir, "api_servicios.md");
    fs.writeFileSync(outPath, out.join("\n"), "utf8");
    console.log(`OK: generado ${path.relative(repoRoot, outPath).replace(/\\/g, "/")}`);
    console.log(`Servicios detectados: ${docs.length}`);
}
main();
//# sourceMappingURL=generateApiServicios.js.map