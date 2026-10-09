// tools/ui-fit/measure.spec.ts alone, with the build, the server, the browser and the screen condition the project's
// configuration gives it. It is written out here instead of reusing that configuration because two of its settings are
// bound to the project's own directory: the status reporter's path and the directory the server's command runs in (a
// configuration file's own directory, by default). Run: npm run ui-fit:measure, and with the Windows condition
// E2E_SCROLLBARS=shown E2E_SCALE=1.25 npm run ui-fit:measure, and with the pt-BR condition
// UI_FIT_CONDITION=ptbr E2E_SCROLLBARS=shown E2E_SCALE=1.25 npm run ui-fit:measure.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';
import { CHANNEL, REDUCED_MOTION, VIEWPORT } from '../runner/environment.ts';

const PORT = process.env.E2E_PORT ?? '5310';
const BASE_URL = `http://localhost:${PORT}`;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export default defineConfig({
  testDir: '.',
  testMatch: 'measure.spec.ts',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  expect: { timeout: 5_000 },
  use: {
    baseURL: BASE_URL,
    channel: CHANNEL,
    reducedMotion: REDUCED_MOTION,
    // the condition of a measurement: the project's screen in English, or (UI_FIT_CONDITION=ptbr) the 1280×720
    // screen in pt-BR of CLAUDE.md, section 8 (DEF-0573: it was never measured)
    viewport: process.env.UI_FIT_CONDITION === 'ptbr' ? { width: 1280, height: 720 } : VIEWPORT,
    locale: process.env.UI_FIT_CONDITION === 'ptbr' ? 'pt-BR' : 'en-US',
    actionTimeout: 5_000,
    navigationTimeout: 15_000,
    ...(process.env.E2E_SCROLLBARS === 'shown' ? { launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } } : {}),
    ...(process.env.E2E_SCALE !== undefined && process.env.E2E_SCALE !== '' ? { deviceScaleFactor: Number(process.env.E2E_SCALE) } : {}),
  },
  webServer: {
    command: 'npm run build && npm run build:proofs && npm run preview',
    url: BASE_URL,
    cwd: ROOT,
    env: { PORT, E2E_BUILD: '1' },
    reuseExistingServer: process.env.E2E_SERVER === 'running',
    timeout: 240_000,
  },
});
