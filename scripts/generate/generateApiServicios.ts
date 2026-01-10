import * as fs from "fs";
import * as path from "path";

type ServiceDoc = {
  relPath: string;
  className: string;
  constructorSig: string | null;
  publicAsyncMethods: string[];
};

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else if (e.isFile() && full.endsWith(".ts")) files.push(full);
  }
  return files;
}

function normalizeWhitespace(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function extractServicesFromFile(absPath: string, relPath: string): ServiceDoc[] {
  const src = fs.readFileSync(absPath, "utf8");

  // Detect exported classes: export class X { ... }
  const classRegex = /export\s+class\s+([A-Za-z0-9_]+)\s*\{/g;
  const services: ServiceDoc[] = [];

  let m: RegExpExecArray | null;
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
    const methods: string[] = [];

    // 1) explicit "public async"
    const pubAsyncRegex = /public\s+async\s+([A-Za-z0-9_]+)\s*\(([\s\S]*?)\)\s*:\s*([A-Za-z0-9_<>,\[\]\s|]+)\s*\{/g;
    let pm: RegExpExecArray | null;
    while ((pm = pubAsyncRegex.exec(classBody)) !== null) {
      const name = pm[1];
      const args = normalizeWhitespace(pm[2]);
      const ret = normalizeWhitespace(pm[3]);
      methods.push(`async ${name}(${args}): ${ret}`);
    }

    // 2) "async name(...): ReturnType" (no public)
    const asyncRegex = /(^|\n)\s*async\s+([A-Za-z0-9_]+)\s*\(([\s\S]*?)\)\s*:\s*([A-Za-z0-9_<>,\[\]\s|]+)\s*\{/g;
    let am: RegExpExecArray | null;
    while ((am = asyncRegex.exec(classBody)) !== null) {
      const name = am[2];
      const args = normalizeWhitespace(am[3]);
      const ret = normalizeWhitespace(am[4]);
      // Avoid duplicates if already captured by "public async"
      const sig = `async ${name}(${args}): ${ret}`;
      if (!methods.includes(sig)) methods.push(sig);
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

function mdEscape(s: string) {
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
  const docs: ServiceDoc[] = [];

  for (const abs of files) {
    const rel = path.relative(repoRoot, abs).replace(/\\/g, "/");
    docs.push(...extractServicesFromFile(abs, rel));
  }

  // Sort by path then class
  docs.sort((a, b) => a.relPath.localeCompare(b.relPath) || a.className.localeCompare(b.className));

  const out: string[] = [];
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
    } else {
      for (const sig of d.publicAsyncMethods) out.push(sig);
    }
    out.push("```");
    out.push(``);
  }

  const docsDir = path.join(repoRoot, "docs");
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

  const outPath = path.join(docsDir, "api_servicios.md");
  fs.writeFileSync(outPath, out.join("\n"), "utf8");

  console.log(`OK: generado ${path.relative(repoRoot, outPath).replace(/\\/g, "/")}`);
  console.log(`Servicios detectados: ${docs.length}`);
}

main();