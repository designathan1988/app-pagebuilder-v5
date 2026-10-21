// Configuration for the investigation's proofs of concept. Runs only the *.poc.ts files in this folder, with the same
// wiring, language and browser ports the project's unit tests use (vitest.config.ts), and without a module cache: the
// plugin below swaps a passage of a module when POC_MUTANT names a mutant, and a module kept in the cache would come
// out without the swap.
import { defineConfig } from 'vitest/config';
import { MUTANTS } from './c7-historico/mutants.ts';

const chosen = process.env.POC_MUTANT ?? '';

export default defineConfig({
  plugins: [
    {
      name: 'poc-mutant',
      enforce: 'pre',
      transform(code, id) {
        if (chosen === '') return undefined;
        const mutant = MUTANTS.find((m) => m.id === chosen);
        if (mutant === undefined) throw new Error(`unknown mutant: ${chosen}`);
        const file = (id.replaceAll('\\', '/').split('?')[0] ?? '');
        if (!file.endsWith(`/${mutant.file}`)) return undefined;
        const times = code.split(mutant.from).length - 1;
        if (times !== 1) throw new Error(`mutant ${mutant.id}: the passage appears ${times} times in ${mutant.file}`);
        // the module reports that it loaded with the swap: a mutant whose module did not load does not count as a survivor
        return `${code.replace(mutant.from, mutant.to)}\n(globalThis as Record<string, unknown>).__pocMutantApplied = '${mutant.id}';\n`;
      },
    },
  ],
  test: {
    include: ['auditoria/investigacao/poc/**/*.poc.ts'],
    environment: 'node',
    setupFiles: ['tools/test/setup-language.ts', 'tools/test/setup-browser.ts', 'tools/test/setup-wiring.ts'],
    fsModuleCache: false,
    maxWorkers: 1,
    testTimeout: 600_000,
  },
});
