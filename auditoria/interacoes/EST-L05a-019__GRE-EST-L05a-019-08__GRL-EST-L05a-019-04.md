# EST-L05a-019 × GRE-EST-L05a-019-08 → GRL-EST-L05a-019-04
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-08 (store.gesture): ENT-P-capture-0005, ENT-P-selection-0001, ENT-P-selection-0009, ENT-P-selection-0012, ENT-P-selection-0014, ENT-P-selection-0024, ENT-P-selection-0025, ENT-P-selection-0026, ENT-P-workspace-0059, ENT-P-workspace-0060, ENT-P-workspace-0061, ENT-P-workspace-0063, ENT-P-workspace-0096
- **Leitor:** GRL-EST-L05a-019-04 (ps.keeping): ENT-P-text-0006
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/shared.ts:25` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `open` com o gesto aberto pela pressão.** `src/editor/input/pointer/effects.ts:41` `      shared.open = store.gesture();` — o efeito de pressão do ponteiro (ENT-P-capture-0005, ENT-P-selection-0001 e os demais membros); `src/editor/input/pointer/drag.ts:34` `    shared.open = store.gesture();` — cada desenho da faixa (ENT-P-selection-0024, ENT-P-selection-0025); `src/editor/input/pointer/panels.ts:53` `    shared.open = store.gesture();` — cada passo do arraste de um painel (ENT-P-workspace-0063).
- **Sem estado de recusa.** `src/editor/input/pointer/drag.ts:29` `    if (ps.marquee === null || ps.pressedAt === null || ps.pressedAt.page === null) return;` — sem a faixa em curso, o caminho não abre gesto.

## Casos
### C1 final
- n/a — a linha deste grupo lê `ps.keeping`, um campo da sessão do dono do ponteiro (EST-L05a-034; `src/editor/input/pointer/effects.ts:40` `      ps.keeping = ending && endArgs ? { entry: ending, args: endArgs } : null;`), e não um campo do estado partilhado por store deste par (`src/editor/input/pointer/shared.ts:21` `const SHARED = new WeakMap<EditorStore, PointerShared>();`): o item EST-L05a-019 não é lido em `src/editor/input/pointer/effects.ts:249` `      const kept = ps.keeping;`.
### C2 intermediário
- n/a — o grupo não lê o item do par: `src/editor/input/pointer/effects.ts:249` `      const kept = ps.keeping;` lê a sessão (EST-L05a-034), não o estado partilhado.
### C3 em curso
- n/a — idem: a leitura é de `ps.keeping` (`src/editor/input/pointer/effects.ts:249` `      const kept = ps.keeping;`), da sessão do dono, e não do item EST-L05a-019.
### C4 desmontagem
- n/a — a desmontagem larga `ps.keeping` em `src/editor/input/pointer/effects.ts:250` `      ps.keeping = null;`, da sessão do dono, sem tocar o estado partilhado do par.

## Resultado
- Este grupo não lê o item do par: lê `ps.keeping` da sessão do dono do ponteiro (EST-L05a-034) em `src/editor/input/pointer/effects.ts:249` `      const kept = ps.keeping;`.
