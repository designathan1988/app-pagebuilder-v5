// Roda a prova de conceito do histórico sem mutante e com cada mutante de mutantes.ts, um processo do Vitest por
// rodada, e grava a taxa de acusação e o tempo em resultados/resumo.txt.
// Uso: node auditoria/investigacao/poc/c7-historico/rodar-mutantes.mjs [execuções]
import console from 'node:console';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const PASTA = 'auditoria/investigacao/poc/c7-historico';
const execucoes = process.argv[2] ?? '300';
const fonte = fs.readFileSync(`${PASTA}/mutantes.ts`, 'utf8');
const ids = [...fonte.matchAll(/id: '(M\d+)'/g)].map((m) => m[1]);
const linhas = [];
const rodar = (mutante) => {
  const inicio = Date.now();
  const r = spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', '--config', 'auditoria/investigacao/poc/vitest.poc.config.ts'], {
    env: { ...process.env, POC_MUTANTE: mutante, POC_EXECUCOES: execucoes },
    encoding: 'utf8',
  });
  const total = Date.now() - inicio;
  const arquivo = `${PASTA}/resultados/${mutante || 'original'}.txt`;
  const resultado = fs.existsSync(arquivo) ? JSON.parse(fs.readFileSync(arquivo, 'utf8')) : null;
  return { mutante: mutante || 'original', saida: r.status, total, resultado };
};

for (const id of ['', ...ids]) {
  const arquivo = `${PASTA}/resultados/${id || 'original'}.txt`;
  if (fs.existsSync(arquivo)) fs.rmSync(arquivo);
  const { mutante, saida, total, resultado } = rodar(id);
  const aplicado = resultado?.aplicado ?? null;
  const acusou = resultado?.acusou ?? null;
  const motivo = (resultado?.falha ?? '').split('\n').find((l) => l.startsWith('Causa:')) ?? '';
  linhas.push({ mutante, saida, total, aplicado, acusou, msTeste: resultado?.ms ?? null, motivo: motivo.replace('Causa: ', '').slice(0, 160) });
  console.log(mutante, 'saída', saida, 'aplicado', aplicado, 'acusou', acusou, `${total} ms`);
}
const mutantes = linhas.filter((l) => l.mutante !== 'original');
const aplicados = mutantes.filter((l) => l.aplicado === l.mutante);
const acusados = aplicados.filter((l) => l.acusou === true);
const texto = [
  `execuções por rodada: ${execucoes}`,
  `mutantes: ${mutantes.length}; carregados com a troca: ${aplicados.length}; acusados: ${acusados.length}`,
  '',
  'mutante | saída do Vitest | troca carregada | acusado | ms do teste | ms do processo | primeira regra quebrada',
  ...linhas.map((l) => `${l.mutante} | ${l.saida} | ${l.aplicado ?? '-'} | ${l.acusou} | ${l.msTeste} | ${l.total} | ${l.motivo}`),
].join('\n');
fs.writeFileSync(`${PASTA}/resultados/resumo.txt`, `${texto}\n`);
console.log(texto);
