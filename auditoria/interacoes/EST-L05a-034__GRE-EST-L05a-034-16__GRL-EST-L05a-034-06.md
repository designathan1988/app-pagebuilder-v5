# EST-L05a-034 × GRE-EST-L05a-034-16 → GRL-EST-L05a-034-06
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-16 (stopRepeating): ENT-L05a-0043, ENT-L05a-0044, ENT-L05a-0048
- **Leitor:** GRL-EST-L05a-034-06 (onDown): ENT-L05a-0040
## Estados deixados por A
- **V-sem-repetição.** `src/editor/input/pointer/panels.ts:33` `ps.repeating = null;` — larga a repetição guardada.
- **V-intacto.** `src/editor/input/pointer/panels.ts:30` `if (ps.repeating === null) return;` — sem repetição o caminho para sem escrever.
- **Sem recusa.** O caminho não despacha comando.
- **Sem intermediário.** `src/editor/input/pointer/panels.ts:33` `ps.repeating = null;` é uma só instrução.
## Casos
### C1 final
- Lê a máquina em `src/editor/input/pointer/events.ts:51` `const lost = ps.machine.phase !== 'idle' && step(ps.machine, { type: 'down', pointer: event.pointerId, at: { x: event.clientX, y: event.clientY }, press: { on: 'stage' } }).effect === 'restart';`: com a fase em `idle`, o `&&` para antes do `step` e `lost` fica falso; a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` decide só pelos outros termos, e as leituras de `ps.machine.phase === 'idle'` (`src/editor/input/pointer/events.ts:64` `ps.machine.phase === 'idle' && shared.open === null`) seguem verdadeiras.
- O escritor larga a repetição (`src/editor/input/pointer/panels.ts:33` `ps.repeating = null;`) e não escreve a máquina; o toque da repetição devolveu antes do `step` do fim do `onDown` (`src/editor/input/pointer/events.ts:94` `return;`), então a máquina está em `idle`.
- ok — depois de a repetição parar, o toque novo lê a máquina ociosa.

### C2 intermediário
- n/a — o escritor é uma só instrução (`src/editor/input/pointer/panels.ts:33` `ps.repeating = null;`); não há estado intermediário.

### C3 em curso
- O leitor chama o escritor dentro do próprio toque: a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` chama `p.onCancel()`, que chama `p.stopRepeating()` (`src/editor/input/pointer/events.ts:547` `p.stopRepeating();`); o toque continua depois do retorno com `ps.repeating` nulo e a máquina em `idle` (`src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;`).
- ok — a repetição para antes de o toque novo ler a máquina.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointerdown (`src/editor/input/pointer.ts:234` `target.removeEventListener('pointerdown', p.onDown, true);`) depois de `src/editor/input/pointer.ts:220` `p.onCancel();` ter parado a repetição.
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor para a repetição pelo cancelamento da condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` e segue desde `idle`.
