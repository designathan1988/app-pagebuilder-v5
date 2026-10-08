# EST-L05a-019 × GRE-EST-L05a-019-03 → GRL-EST-L05a-019-04
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-03 (followPicker): ENT-L05a-0031, ENT-L05a-0059
- **Leitor:** GRL-EST-L05a-019-04 (ps.keeping): ENT-P-text-0006
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 a sessão do seletor aberta.** `src/editor/input/pointer/tools.ts:21` `      shared.session = store.gesture();` e `src/editor/input/pointer/tools.ts:22` `      shared.open = shared.session;` — a sessão abre quando o seletor de cor abre (ENT-L05a-0031).
- **V3 a sessão e o gesto largados, com o fim guardado.** `src/editor/input/pointer/tools.ts:33` `    shared.session = null;`, `src/editor/input/pointer/tools.ts:34` `    shared.open = null;` e `src/editor/input/pointer/tools.ts:36` `    shared.pendingPickerEnd = () => {` — o fim do seletor guarda o commit ou o cancel para a microtarefa (ENT-L05a-0059).
- **Sem estado de recusa.** `src/editor/input/pointer/tools.ts:30` `    if (!ended && !escaped) return;` — sem o seletor fechado nem o Escape, a sessão continua e nada é largado.

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
