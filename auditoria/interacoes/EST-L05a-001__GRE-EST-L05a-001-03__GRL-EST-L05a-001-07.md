# EST-L05a-001 × GRE-EST-L05a-001-03 → GRL-EST-L05a-001-07
- **Estado:** EST-L05a-001
- **Escritor:** GRE-EST-L05a-001-03 (keepTyping): ENT-P-layout-composer-0007, ENT-P-layout-composer-0008, ENT-P-layout-composer-0009, ENT-P-layout-composer-0010, ENT-P-layout-composer-0011, ENT-P-layout-composer-0012, ENT-P-layout-composer-0013, ENT-P-layout-composer-0014, ENT-P-layout-composer-0015, ENT-P-layout-composer-0018, ENT-P-layout-composer-0019, ENT-P-view-0001, ENT-P-view-0002, ENT-P-view-0003, ENT-P-view-0004, ENT-P-view-0005, ENT-P-view-0006, ENT-P-view-0007, ENT-P-view-0008, ENT-P-view-0009, ENT-P-view-0010, ENT-P-view-0011, ENT-P-view-0012, ENT-P-view-0013, ENT-P-view-0014, ENT-P-view-0015, ENT-P-view-0016, ENT-P-view-0017, ENT-P-view-0018, ENT-P-view-0019, ENT-P-view-0020, ENT-P-view-0021, ENT-P-view-0022, ENT-P-view-0023, ENT-P-view-0024, ENT-P-view-0025, ENT-P-view-0026, ENT-P-view-0027, ENT-P-view-0028, ENT-P-view-0029, ENT-P-view-0030, ENT-P-view-0031, ENT-P-view-0032, ENT-P-view-0033, ENT-P-view-0034, ENT-P-view-0035, ENT-P-view-0036, ENT-P-view-0037, ENT-P-view-0038, ENT-P-view-0039, ENT-P-view-0040, ENT-P-view-0041, ENT-P-view-0042, ENT-P-view-0043, ENT-P-view-0044, ENT-P-view-0045, ENT-P-view-0046, ENT-P-view-0047, ENT-P-view-0048, ENT-P-view-0049, ENT-P-view-0050, ENT-P-view-0051, ENT-P-view-0052, ENT-P-view-0053, ENT-P-view-0054, ENT-P-view-0055, ENT-P-view-0056, ENT-P-view-0057, ENT-P-view-0058, ENT-P-view-0059, ENT-P-view-0060, ENT-P-view-0061, ENT-P-view-0062, ENT-P-view-0063, ENT-P-view-0064, ENT-P-view-0065, ENT-P-view-0066, ENT-P-view-0067, ENT-P-view-0068, ENT-P-view-0069, ENT-P-view-0070, ENT-P-view-0071, ENT-P-view-0072, ENT-P-view-0073, ENT-P-view-0074, ENT-P-view-0075, ENT-P-view-0076, ENT-P-view-0077, ENT-P-view-0078, ENT-P-view-0081, ENT-P-view-0083, ENT-P-view-0084, ENT-P-view-0085, ENT-P-view-0086, ENT-P-view-0088, ENT-P-view-0089, ENT-P-view-0090, ENT-P-view-0091, ENT-P-view-0092, ENT-P-view-0093, ENT-P-view-0094, ENT-P-view-0095, ENT-P-view-0096, ENT-P-view-0097, ENT-P-view-0098, ENT-P-view-0099, ENT-P-view-0100, ENT-P-view-0101, ENT-P-view-0102, ENT-P-view-0104, ENT-P-view-0105, ENT-P-view-0106
- **Leitor:** GRL-EST-L05a-001-07 (useDoor): ENT-L05b-0026
## Estados deixados por A
- **V-gravada.** `src/editor/input/pending.ts:47` `  held = null;` — a digitação pendente é solta do registo e o campo a grava.
- **V-sem-digitacao.** `src/editor/input/pending.ts:46` `  if (typing === null) return;` — sem digitação pendente nada é gravado.
- **V-do-gesto.** `src/editor/store.ts:217` `      keepTyping();` — a abertura de um gesto grava a digitação pendente pelo mesmo ponto.

## Casos
### C1 final
- O escritor terminou: a digitação pendente, se havia, foi gravada (`src/editor/input/pending.ts:48` `  typing.keep();`).
- O leitor chega no desenho de um item de menu: `src/editor/doors/menu.tsx:38` `  const door = useDoor(entry, {}, undefined, true, keysIn);` — o estado da porta.
- A leitura passa por `useEditorState` e, ao correr, pelo despacho: `src/editor/doors/door.tsx:79` `  const available = useEditorState((s) => built && (predicate?.test(s, layeredRules(s), runArgs) ?? true));` e `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- ok — a porta mostra o estado atual e, ao correr, o despacho grava a digitação pendente pelo `beforeCommand`.
### C2 intermediário
- n/a — a digitação é gravada numa chamada só (`src/editor/input/pending.ts:47` `  held = null;`).
### C3 em curso
- O leitor pode ser chamado no meio de uma publicação: `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`, depois de `src/core/store/store.ts:320` `    state = next;`.
- ok — no meio do escritor o leitor lê o estado já fixado.
### C4 desmontagem
- O componente desmonta e o React tira a assinatura: `src/core/store/store.ts:756` `      return () => listeners.delete(listener);`.
- ok — depois da desmontagem o leitor deixa de ler o estado (`src/editor/doors/door.tsx:67` `export function useDoor(entry: DoorEntry, args: Readonly<Record<string, unknown>> = {}, labelled?: string, ready = true, keysIn: KeyContextId = 'global'): DoorState {`).

## Resultado
- O leitor mostra se a porta está atual e disponível e, ao correr, o despacho grava a digitação pendente: `src/editor/doors/door.tsx:79` `  const available = useEditorState((s) => built && (predicate?.test(s, layeredRules(s), runArgs) ?? true));`.
