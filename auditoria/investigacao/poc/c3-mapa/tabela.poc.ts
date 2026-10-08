// Prova de conceito C3/C6: a tabela de transições da máquina de gestos (step de src/editor/input/pointer/machine.ts)
// extraída executando a própria função em todas as combinações de fase e evento, e escrita como diagrama Mermaid.
// O mapa sai do código, não de texto à mão; uma mudança em step muda a tabela, e o diff da tabela diz o que mudou.
// Também lista as combinações que step ignora em silêncio (máquina igual, efeito nulo): é ali que uma transição
// ilegal passaria sem acusação.
import fs from 'node:fs';
import { it } from 'vitest';
import { DRAG_THRESHOLD, IDLE, step, type Machine, type MachineEvent, type Press } from '../../../../src/editor/input/pointer/machine.ts';

it('a tabela de transições sai do código', () => {
  const press: Press = { on: 'stage' };
  const fases: Record<string, Machine> = {
    idle: IDLE,
    pressed: { phase: 'pressed', pointer: 1, start: { x: 0, y: 0 }, press },
    dragging: { phase: 'dragging', pointer: 1, start: { x: 0, y: 0 }, press },
  };
  const eventos: Record<string, MachineEvent> = {
    'down(p1)': { type: 'down', pointer: 1, at: { x: 0, y: 0 }, press },
    'down(p2)': { type: 'down', pointer: 2, at: { x: 0, y: 0 }, press },
    'move(p1, abaixo do limiar)': { type: 'move', pointer: 1, at: { x: DRAG_THRESHOLD - 1, y: 0 } },
    'move(p1, no limiar)': { type: 'move', pointer: 1, at: { x: DRAG_THRESHOLD, y: 0 } },
    'move(p2)': { type: 'move', pointer: 2, at: { x: 50, y: 0 } },
    'up(p1)': { type: 'up', pointer: 1 },
    'up(p2)': { type: 'up', pointer: 2 },
    cancel: { type: 'cancel' },
  };
  const linhas: string[] = ['fase | evento | fase seguinte | efeito'];
  const ignoradas: string[] = [];
  const mermaid = ['stateDiagram-v2', '  [*] --> idle'];
  for (const [fase, m] of Object.entries(fases)) {
    for (const [nome, e] of Object.entries(eventos)) {
      const r = step(m, e);
      linhas.push(`${fase} | ${nome} | ${r.machine.phase} | ${r.effect ?? '-'}`);
      if (r.machine === m && r.effect === null) ignoradas.push(`${fase} + ${nome}`);
      else mermaid.push(`  ${fase} --> ${r.machine.phase} : ${nome} / ${r.effect ?? '-'}`);
    }
  }
  const texto = [`limiar de arraste lido do manifesto: ${DRAG_THRESHOLD}px`, '', ...linhas, '', `combinações ignoradas em silêncio (${ignoradas.length}):`, ...ignoradas.map((i) => `  ${i}`), '', ...mermaid].join('\n');
  fs.writeFileSync('auditoria/investigacao/poc/c3-mapa/resultados.txt', `${texto}\n`);
});
