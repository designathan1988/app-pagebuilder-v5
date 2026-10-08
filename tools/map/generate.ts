// The behaviour map, generated from the code (the investigation's C3): manifest/generated/behavior.json holds the
// transition tables of the machines (today the gesture machine, tools/map/gesture-table.ts) with what each ignores on
// purpose, and manifest/generated/behavior.md draws them as Mermaid. Never written by hand; the diff of the two files
// is what changed in the behaviour, and tools/runner/model/machine.test.ts fails when they are behind the code.
// The machine reads the manifest through import.meta.glob, which only Vite resolves: the texts are loaded through a
// Vite server in middleware mode, without the project's configuration (whose server wants a PORT).
// Usage: node tools/map/generate.ts
import fs from 'node:fs';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, logLevel: 'silent', appType: 'custom', server: { middlewareMode: true, hmr: false, ws: false } });
try {
  const { behaviorFiles } = (await server.ssrLoadModule('/tools/map/behavior.ts')) as typeof import('./behavior.ts');
  const { json, markdown } = behaviorFiles();
  fs.mkdirSync('manifest/generated', { recursive: true });
  fs.writeFileSync('manifest/generated/behavior.json', json);
  fs.writeFileSync('manifest/generated/behavior.md', markdown);
  console.log('manifest/generated/behavior.json e behavior.md gravados');
} finally {
  await server.close();
}
