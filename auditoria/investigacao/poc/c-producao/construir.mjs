// Prova de conceito: a instrumentação atrás de import.meta.env.DEV e de uma constante do build (define) some do build
// de produção. Constrói em memória (write: false), nos modos production, development e com a constante ligada (o build
// de teste), e procura a marca da sonda em cada saída. Uso: node auditoria/investigacao/poc/c-producao/construir.mjs
import console from 'node:console';
import { performance } from 'node:perf_hooks';
import fs from 'node:fs';
import { build } from 'vite';

const RAIZ = 'auditoria/investigacao/poc/c-producao/fonte';
const linhas = [];
for (const [nome, modo, sonda] of [['produção', 'production', false], ['desenvolvimento', 'development', false], ['teste', 'production', true]]) {
  const inicio = performance.now();
  const saida = await build({
    configFile: false,
    logLevel: 'silent',
    root: RAIZ,
    mode: modo,
    define: { __SONDA__: JSON.stringify(sonda), 'import.meta.env.DEV': JSON.stringify(modo === 'development') },
    build: { write: false, minify: true, lib: { entry: 'entrada.ts', formats: ['es'], fileName: 'saida' } },
  });
  const pedacos = (Array.isArray(saida) ? saida : [saida]).flatMap((s) => s.output).filter((o) => o.type === 'chunk');
  const codigo = pedacos.map((p) => p.code).join('\n');
  linhas.push(`${nome}: ${pedacos.length} pedaço(s), ${codigo.length} bytes, marca da sonda ${codigo.includes('MARCA_DA_SONDA_DE_VERIFICACAO') ? 'PRESENTE' : 'ausente'}, ${(performance.now() - inicio).toFixed(0)} ms`);
}
fs.writeFileSync('auditoria/investigacao/poc/c-producao/resultados.txt', `${linhas.join('\n')}\n`);
console.log(linhas.join('\n'));
