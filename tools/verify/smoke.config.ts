// The browser layer of npm run verify (tools/verify/run.ts): a handful of the editor's core flows on the dev server,
// which starts in seconds and is reused when one is already running on the port — no build, unlike the full suite's
// playwright.config.ts. The test fixture (tests/support/test.ts) still checks every test's incident feed, console and
// screen at its end.
import { defineConfig } from '@playwright/test';
import { CHANNEL, REDUCED_MOTION } from '../runner/environment.ts';

const port = process.env.VERIFY_PORT ?? '5330';

export default defineConfig({
  testDir: '.',
  testMatch: 'smoke.spec.ts',
  fullyParallel: true,
  // the owner's machine stays usable: never more than two browsers at once
  workers: 2,
  retries: 0,
  reporter: [['list']],
  expect: { timeout: 5_000 },
  use: {
    baseURL: `http://localhost:${port}`,
    channel: CHANNEL,
    reducedMotion: REDUCED_MOTION,
    locale: 'en-US',
    trace: 'off',
    screenshot: 'only-on-failure',
    actionTimeout: 5_000,
    navigationTimeout: 15_000,
  },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js',
    // the project's root, not this config's folder
    cwd: '../..',
    url: `http://localhost:${port}`,
    env: { PORT: port },
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
