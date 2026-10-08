// The runs of the model of the store (tools/runner/model/) and of the catalogue of mutants (tools/runner/mutants.ts):
// the same setup, language and browser ports the unit tests use (vitest.config.ts), with the mutant's plugin when
// BUILDER_MUTANT names one, and no module cache: a module transformed with a mutant must never be kept for a run
// without it.
import { defineConfig } from 'vitest/config';
import { mutantPlugin } from '../mutants.ts';

const plugin = mutantPlugin();

export default defineConfig({
  plugins: plugin === null ? [] : [plugin],
  test: {
    include: ['tools/runner/model/*.test.ts'],
    environment: 'node',
    setupFiles: ['tools/test/setup-language.ts', 'tools/test/setup-browser.ts', 'tools/test/setup-wiring.ts'],
    fsModuleCache: false,
    maxWorkers: 4,
    testTimeout: 600_000,
  },
});
