// scripts/cli/ui.ts
import readline from "node:readline";

export type MenuItem = { key: string; label: string };

export function createUi() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function ask(prompt: string): Promise<string> {
    return new Promise((resolve) => rl.question(prompt, resolve));
  }

  function title(text: string) {
    console.log(`\n=== ${text} ===`);
  }

  function info(text: string) {
    console.log(text);
  }

  function warn(text: string) {
    console.log(`WARN: ${text}`);
  }

  function error(text: string) {
    console.log(`ERROR: ${text}`);
  }

  function json(obj: unknown) {
    console.dir(obj, { depth: null });
  }

  async function menu(titleText: string, items: MenuItem[]): Promise<string> {
    title(titleText);
    for (const it of items) {
      console.log(`${it.key}) ${it.label}`);
    }
    const choice = (await ask("> ")).trim();
    return choice;
  }

  async function confirm(prompt = "¿Confirmas esta acción? (y/N): "): Promise<boolean> {
    const ans = (await ask(prompt)).trim().toLowerCase();
    return ans === "y";
  }

  function close() {
    rl.close();
  }

  return { ask, title, info, warn, error, json, menu, confirm, close };
}