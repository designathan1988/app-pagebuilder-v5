# EST-L05a-001 × GRE-EST-L05a-001-04 → GRL-EST-L05a-001-07
- **Estado:** EST-L05a-001
- **Escritor:** GRE-EST-L05a-001-04 (releaseTyping): ENT-L09a-0129, ENT-L09a-0131, ENT-L09a-0132, ENT-L09a-0133, ENT-L09a-0134
- **Leitor:** GRL-EST-L05a-001-07 (useDoor): ENT-L05b-0026
## Estados deixados por A
- **V-solta.** `src/editor/input/pending.ts:37` `  if (held?.field === field) held = null;` — a digitação do campo dado volta a `null`.
- **V-ao-voltar-ao-mostrado.** `src/editor/shell/field.tsx:1781` `      if (element.value === typing.shown) releaseTyping(element);` — texto de volta ao mostrado solta a digitação.
- **V-ao-restaurar.** `src/editor/shell/field.tsx:1739` `    releaseTyping(element);` — restaurar o campo solta a digitação pendente.
- **V-de-outro-campo-fica.** `src/editor/input/pending.ts:37` `  if (held?.field === field) held = null;` — campo diferente: a digitação pendente continua.

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
