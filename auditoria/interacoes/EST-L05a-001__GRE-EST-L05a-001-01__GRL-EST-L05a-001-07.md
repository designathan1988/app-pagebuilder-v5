# EST-L05a-001 × GRE-EST-L05a-001-01 → GRL-EST-L05a-001-07
- **Estado:** EST-L05a-001
- **Escritor:** GRE-EST-L05a-001-01 (gesture): ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082, ENT-P-view-0087, ENT-P-view-0103
- **Leitor:** GRL-EST-L05a-001-07 (useDoor): ENT-L05b-0026
## Estados deixados por A
- **V-gravada-ao-abrir-gesto.** `src/editor/store.ts:205` `      keepTyping();` — a abertura do gesto grava a digitação pendente antes de o gesto servir.
- **V-antes-da-medida.** `src/editor/input/pointer/events.ts:58` `    keepTypingBefore(event.target);` — a pressão grava a digitação antes de medir a caixa da seleção.
- **V-sem-digitacao.** `src/editor/input/pending.ts:46` `  if (typing === null) return;` — sem digitação pendente nada é gravado.

## Casos
### C1 final
- O escritor terminou: a digitação pendente, se havia, foi gravada (`src/editor/input/pending.ts:48` `  typing.keep();`).
- O leitor chega no desenho de um item de menu: `src/editor/doors/menu.tsx:38` `  const door = useDoor(entry, {}, undefined, true, keysIn);` — o estado da porta.
- A leitura passa por `useEditorState` e, ao correr, pelo despacho: `src/editor/doors/door.tsx:78` `  const available = useEditorState((s) => built && (predicate?.test(s, layeredRules(s), runArgs) ?? true));` e `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- ok — a porta mostra o estado atual e, ao correr, o despacho grava a digitação pendente pelo `beforeCommand`.
### C2 intermediário
- n/a — a digitação é gravada numa chamada só (`src/editor/input/pending.ts:47` `  held = null;`).
### C3 em curso
- O leitor pode ser chamado no meio de uma publicação: `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`, depois de `src/core/store/store.ts:320` `    state = next;`.
- ok — no meio do escritor o leitor lê o estado já fixado.
### C4 desmontagem
- O componente desmonta e o React tira a assinatura: `src/core/store/store.ts:756` `      return () => listeners.delete(listener);`.
- ok — depois da desmontagem o leitor deixa de ler o estado (`src/editor/doors/door.tsx:66` `export function useDoor(entry: DoorEntry, args: Readonly<Record<string, unknown>> = {}, labelled?: string, ready = true, keysIn: KeyContextId = 'global'): DoorState {`).

## Resultado
- O leitor mostra se a porta está atual e disponível e, ao correr, o despacho grava a digitação pendente: `src/editor/doors/door.tsx:78` `  const available = useEditorState((s) => built && (predicate?.test(s, layeredRules(s), runArgs) ?? true));`.
