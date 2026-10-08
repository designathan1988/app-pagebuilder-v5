# EST-L05a-019 × GRE-EST-L05a-019-06 → GRL-EST-L05a-019-04
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-06 (onMove): ENT-L05a-0042
- **Leitor:** GRL-EST-L05a-019-04 (ps.keeping): ENT-P-text-0006
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `overStage` recalculado.** `src/editor/input/pointer/events.ts:272` `    shared.overStage = onStage(under);` — `onMove` marca se o ponteiro está sobre o palco (ENT-L05a-0042).
- **Sem estado de recusa.** `src/editor/input/pointer/events.ts:272` `    shared.overStage = onStage(under);` — a escrita é o resultado de `onStage(under)`, sem recusa.

## Casos
### C1 final
- n/a — a linha deste grupo lê `ps.keeping`, um campo da sessão do dono do ponteiro (EST-L05a-034; `src/editor/input/pointer/effects.ts:40` `      ps.keeping = ending && endArgs ? { entry: ending, args: endArgs } : null;`), e não um campo do estado partilhado por store deste par (`src/editor/input/pointer/common.ts:263` `const SHARED = new WeakMap<EditorStore, PointerShared>();`): o item EST-L05a-019 não é lido em `src/editor/input/pointer/effects.ts:249` `      const kept = ps.keeping;`.
### C2 intermediário
- n/a — o grupo não lê o item do par: `src/editor/input/pointer/effects.ts:249` `      const kept = ps.keeping;` lê a sessão (EST-L05a-034), não o estado partilhado.
### C3 em curso
- n/a — idem: a leitura é de `ps.keeping` (`src/editor/input/pointer/effects.ts:249` `      const kept = ps.keeping;`), da sessão do dono, e não do item EST-L05a-019.
### C4 desmontagem
- n/a — a desmontagem larga `ps.keeping` em `src/editor/input/pointer/effects.ts:250` `      ps.keeping = null;`, da sessão do dono, sem tocar o estado partilhado do par.

## Resultado
- Este grupo não lê o item do par: lê `ps.keeping` da sessão do dono do ponteiro (EST-L05a-034) em `src/editor/input/pointer/effects.ts:249` `      const kept = ps.keeping;`.
