# EST-L05a-034 × GRE-EST-L05a-034-02 → GRL-EST-L05a-034-06
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-02 (dropTool): ENT-L05a-0033
- **Leitor:** GRL-EST-L05a-034-06 (onDown): ENT-L05a-0040
## Estados deixados por A
- **V-sem-ferramenta.** `src/editor/input/pointer/tools.ts:11` `if (ps.tooling === null) return;` — sem ferramenta o campo fica como estava.
- **V-larga-a-ferramenta.** `src/editor/input/pointer/tools.ts:13` `ps.tooling = null;` — larga a ferramenta; a sessão e o gesto dela são cancelados logo depois (`src/editor/input/pointer/tools.ts:15` `session.cancel();`).
- **Sem recusa.** O caminho não despacha comando: cancela a sessão e o gesto da ferramenta (`src/editor/input/pointer/tools.ts:16` `gesture.cancel();`).
- **Sem intermediário.** `src/editor/input/pointer/tools.ts:13` `ps.tooling = null;` é uma só instrução.
## Casos
### C1 final
- Lê a máquina em `src/editor/input/pointer/events.ts:51` `const lost = ps.machine.phase !== 'idle' && step(ps.machine, { type: 'down', pointer: event.pointerId, at: { x: event.clientX, y: event.clientY }, press: { on: 'stage' } }).effect === 'restart';`: com a fase em `idle`, o `&&` para antes do `step` e `lost` fica falso; a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` decide só pelos outros termos, e as leituras de `ps.machine.phase === 'idle'` (`src/editor/input/pointer/events.ts:64` `ps.machine.phase === 'idle' && shared.open === null`) seguem verdadeiras.
- Um toque de ferramenta só começa com a máquina ociosa e devolve antes do `step` do fim do `onDown` (`src/editor/input/pointer/events.ts:64` `const tool = event.button === 0 && ps.machine.phase === 'idle'`), e o escritor deixa `ps.tooling` nulo (`src/editor/input/pointer/tools.ts:13` `ps.tooling = null;`); o termo `ps.tooling !== null` da condição fica falso.
- ok — com a máquina ociosa e sem ferramenta, o toque novo segue sem cancelamento.

### C2 intermediário
- n/a — o escritor não deixa meio: `src/editor/input/pointer/tools.ts:13` `ps.tooling = null;` é uma só instrução, e a ferramenta ainda aberta que o leitor encontra é estado do escritor `onDown` (par GRE-EST-L05a-034-08).

### C3 em curso
- O leitor chama o escritor dentro do próprio toque: a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` chama `p.onCancel()`, que chama `p.dropHandleGestures()` e este `p.dropTool()` (`src/editor/input/pointer/resize.ts:76` `p.dropTool();`); o toque continua depois do retorno e vê `ps.tooling` nulo (`src/editor/input/pointer/tools.ts:13` `ps.tooling = null;`) e a máquina em `idle` (`src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;`).
- ok — a ferramenta é largada antes de o toque novo ler a máquina nas alças.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointerdown (`src/editor/input/pointer.ts:234` `target.removeEventListener('pointerdown', p.onDown, true);`) depois de `src/editor/input/pointer.ts:220` `p.onCancel();` ter largado a ferramenta.
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor larga a ferramenta aberta pelo cancelamento da condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();`, e o toque novo segue com `ps.tooling` nulo.
