// The inventory written to manifest/generated/inventory.json (the investigation's C1, option F): what the application
// is made of, in one file whose diff between two versions says what came in, went out or changed — the features with
// their commands and doors (tools/inventory/generate.ts), the value fields with their codecs
// (tools/runner/contracts.ts), the eight parts of the core store's state, and every interactive element with its owner
// (tools/inventory/ui-scan.ts).
// Keys in a fixed order, no date, no absolute path. The text is built by tools/inventory/inventory-file.ts, which the
// detector (tools/runner/model/inventory.test.ts) compares with the file on disk; the manifest is read through
// import.meta.glob, which only Vite resolves, so the text is loaded through a Vite server in middleware mode.
// Usage: node tools/inventory/write.ts
import fs from 'node:fs';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, logLevel: 'silent', appType: 'custom', server: { middlewareMode: true, hmr: false, ws: false } });
try {
  const { inventoryText } = (await server.ssrLoadModule('/tools/inventory/inventory-file.ts')) as typeof import('./inventory-file.ts');
  fs.mkdirSync('manifest/generated', { recursive: true });
  fs.writeFileSync('manifest/generated/inventory.json', inventoryText());
  console.log('manifest/generated/inventory.json gravado');
} finally {
  await server.close();
}
