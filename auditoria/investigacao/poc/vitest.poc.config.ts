// Configuração das provas de conceito da investigação. Roda só os arquivos *.poc.ts desta pasta, com a mesma
// fiação, idioma e portas de navegador que os testes unitários do projeto usam (vitest.config.ts), e sem cache de
// módulos: o plugin abaixo troca um trecho de um módulo quando POC_MUTANTE nomeia um mutante, e um módulo guardado
// no cache sairia sem a troca.
import { defineConfig } from 'vitest/config';
import { MUTANTES } from './c7-historico/mutantes.ts';

const escolhido = process.env.POC_MUTANTE ?? '';

export default defineConfig({
  plugins: [
    {
      name: 'poc-mutante',
      enforce: 'pre',
      transform(code, id) {
        if (escolhido === '') return undefined;
        const mutante = MUTANTES.find((m) => m.id === escolhido);
        if (mutante === undefined) throw new Error(`mutante desconhecido: ${escolhido}`);
        const arquivo = (id.replaceAll('\\', '/').split('?')[0] ?? '');
        if (!arquivo.endsWith(`/${mutante.arquivo}`)) return undefined;
        const vezes = code.split(mutante.de).length - 1;
        if (vezes !== 1) throw new Error(`mutante ${mutante.id}: o trecho aparece ${vezes} vezes em ${mutante.arquivo}`);
        // o módulo avisa que carregou com a troca: um mutante cujo módulo não carregou não conta como sobrevivente
        return `${code.replace(mutante.de, mutante.para)}\n(globalThis as Record<string, unknown>).__pocMutanteAplicado = '${mutante.id}';\n`;
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
