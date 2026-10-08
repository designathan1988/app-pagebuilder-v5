# TRC-history.undo
- **Chamada:** `src/app/commands.ts:332` `'history.undo': undoCommand,`
- **Argumentos:** nenhum campo variável — o tipo é `Record<string, never>`, `src/generated/commands.ts:198` `"history.undo": Record<string, never>;`; cada porta declara os argumentos vazios (`manifest/commands/history.json:38` `"args": {}`); o tratador recebe o contexto e os argumentos vazios.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. O id do comando aponta o tratador no quadro de comandos. `src/app/commands.ts:332` `'history.undo': undoCommand,`
2. `undoCommand` é o tratador: devolve o desfecho de controle, sem ler nem escrever estado. `src/core/history/history.ts:79` `export const undoCommand = registerHandler('history.undo', () => ({ kind: 'undo' }));`
3. `registerHandler` guarda o `run` no objeto do tratador. `src/core/commands/registry.ts:122` `return current === undefined ? { command, run } : { command, run, current };`
4. O despacho da store do núcleo entra por aqui. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {`
5. `dispatch` chama `run`. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);`
6. `run` busca o tratador no quadro e a entrada do comando no manifesto. `src/core/store/store.ts:400` `const entry = table[id];`
7. O comando não é desfazível, então a locação de um grupo aberto não o segura por aqui. `src/core/store/store.ts:403` `if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();` — R1.
8. O tratador precisa estar construído. `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — R2.
9. Os argumentos que o comando não recebe são recusados antes de qualquer leitura. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` [lê: EST-L01-030 via argumentRefusal]
10. A disponibilidade do comando é o predicado do manifesto. `src/core/store/store.ts:415` `const predicate = predicates[command.availability.predicate as keyof PredicateTable<Ui>];` e `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` [lê: EST-L01-032 via canUndo] — R3.
11. `canUndo` lê a pilha de desfazer. `src/core/history/history.ts:74` `export const canUndo = registerPredicate('canUndo', (state) => state.history.past.length > 0);` [lê: EST-L01-032 via canUndo]
12. O tratador roda. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
13. `handlerContext` leva o estado ao tratador. `src/core/store/store.ts:374` `state,`
14. Um grupo aberto cujo desfecho é bloqueado devolve ocupado. `src/core/store/store.ts:444` `if (group !== null && groupBlocked(outcome, ownedGroup !== group)) return busyResult();` — R4.
15. Uma caminhada de histórico encerra a sequência de comandos aberta. `src/core/store/store.ts:446` `if (outcome.kind === 'load' || outcome.kind === 'undo' || outcome.kind === 'redo' ||` [escreve: EST-L01-009 via settleSequence]
16. Numa aba somente-leitura o desfecho de carga, confirmação ou patches é recusado; o desfazer não entra nessa lista. `src/core/store/store.ts:449` `if (options.readOnly?.() === true && (outcome.kind === 'load' || outcome.kind === 'confirm' || (outcome.kind === 'change' && (` — R5.
17. O desfecho de desfazer entra neste ramo. `src/core/store/store.ts:475` `if (outcome.kind === 'undo' || outcome.kind === 'redo') {` — R6.
18. Um gesto aberto lança. `src/core/store/store.ts:476` `if (gesture) throw new Error(` — R7.
19. A última transação da pilha é lida. `src/core/store/store.ts:477` `const tx = outcome.kind === 'undo' ? state.history.past.at(-1) : state.history.future.at(-1);` [lê: EST-L01-032 via run]
20. `undo` monta o estado de uma etapa atrás. `src/core/store/store.ts:478` `const restored: Restorable | null = (outcome.kind === 'undo' ? undo : redo)(state);`
21. `undo` lê a última transação da pilha. `src/core/history/history.ts:53` `export function undo(state: Restorable): Restorable | null {`
22. `src/core/history/history.ts:54` `const tx = state.history.past[state.history.past.length - 1];` [lê: EST-L01-032 via undo]
23. Pilha vazia: nada a devolver. `src/core/history/history.ts:55` `if (tx === undefined) return null;` — R8.
24. O documento volta pelos patches inversos. `src/core/history/history.ts:57` `document: applyPatches(state.document, tx.inverses).document,` [lê: EST-L01-030 via applyPatches]
25. `applyPatches` percorre os patches na ordem. `src/core/history/transaction.ts:141` `export function applyPatches(document: DocumentJson, patches: readonly Patch[]): Applied {`
26. `src/core/history/transaction.ts:145` `for (const patch of patches) {` [lê: EST-L01-030 via applyPatches]
27. `src/core/history/transaction.ts:146` `const result = applyOne(root, patch);`
28. `applyOne` aplica um patch e devolve o inverso. `src/core/history/transaction.ts:70` `function applyOne(root: unknown, patch: Patch): { root: unknown; inverse: Patch | null } {`
29. A seleção que o comando desfeito tinha antes volta. `src/core/history/history.ts:58` `selection: tx.selectionBefore,`
30. As pilhas se movem: a de desfazer encolhe e a transação entra na de refazer. `src/core/history/history.ts:59` `history: { past: state.history.past.slice(0, -1), future: [...state.history.future, tx] },`
31. Sem transação (ou sem restauração): nada muda. `src/core/store/store.ts:479` `if (restored === null || tx === undefined) return { status: 'done', changed: false };` — R9.
32. O passo nomeia o que desfaz: a mensagem da transação, ou a última alteração. `src/core/store/store.ts:481` `const action = tx.message ?? LAST_CHANGE;`
33. `undone` compõe a chave `status.undone`. `src/core/history/history.ts:82` `export const undone = (action: MessageParam): Message => message('status.undone', { action });`
34. O estado restaurado é validado, commitado e publicado com os patches inversos. `src/core/store/store.ts:484` `publish(commit({ ...state, ...restored, ui, message: outcome.kind === 'undo' ? undone(action) : redone(action), refusal: null, refused: false }, id), outcome.kind === 'undo' ? tx.inverses : tx.patches);` [escreve: EST-L01-030 via publish] [escreve: EST-L01-031 via publish] [escreve: EST-L01-032 via publish] [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish] O `ui` publicado é o do contexto em que a mudança foi feita: `src/core/store/store.ts:483` `const ui = tx.context !== undefined && options.restoreContext !== undefined ? options.restoreContext({ ...state, ...restored }, tx.context) : state.ui;` [lê: EST-L01-032 via run] — o editor devolve o breakpoint, o estado de estilo, a classe-alvo e, quando a mudança foi num quadro-chave, a Timeline aberta nele (`src/editor/view/edit-context.ts:13` `export function restoreEditContext(state: StoreState<EditorUi>, context: EditContext): EditorUi {`; DCS-009, DCS-016, DEF-0511).
35. `commit` valida o documento e a seleção inteiros. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
36. `publish` deixa a seleção nova seguir o estado do editor. `src/core/store/store.ts:314` `const next = follow ? followSelection(before, committed) : committed;`
37. A seleção do editor segue a nova seleção; a página de um nó selecionado abre. `src/editor/store.ts:156` `const opened = { ...state, ui: pageFollowsSelection(state) };` [escreve: EST-L01-037 via followSelection]
38. O estado passa a ser o novo. `src/core/store/store.ts:320` `state = next;` [escreve: EST-L01-030 via publish] [escreve: EST-L01-031 via publish] [escreve: EST-L01-032 via publish] [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]
39. A mudança de documento dispara só quando o documento muda. `src/core/store/store.ts:321` `if (next.document !== before.document) {` — R10.
40. Os ouvintes de mudança do documento recebem os patches. `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` [lê: EST-L01-003 via publish]
41. Todo assinante da store é chamado. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` [lê: EST-L01-002 via publish]
42. O despacho termina com mudança. `src/core/store/store.ts:485` `return { status: 'done', changed: true };`

## Ramos
- R1 `src/core/store/store.ts:403` `if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();` — o lado verdadeiro (um grupo de comandos aberto e o comando desfazível) devolve ocupado; como o manifesto declara `manifest/commands/history.json:17` `"undoable": false`, o lado é falso e o despacho segue.
- R2 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o lado verdadeiro (o tratador é `NOT_AVAILABLE_YET`) devolve indisponível; o lado falso (o tratador de `src/core/history/history.ts:73`) segue.
- R3 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o lado verdadeiro (a pilha de desfazer vazia, `src/core/history/history.ts:68`) recusa com `status.undo.nothing` (`manifest/commands/history.json:12` `"refusalKey": "status.undo.nothing"`); o lado falso (há passo a desfazer) segue.
- R4 `src/core/store/store.ts:444` `if (group !== null && groupBlocked(outcome, ownedGroup !== group)) return busyResult();` — o lado verdadeiro (grupo aberto e desfecho bloqueado, o que `src/core/store/store.ts:391` `const groupBlocked = (outcome: Outcome<Ui>, external: boolean): boolean => outcome.kind === 'load' || outcome.kind === 'undo' || outcome.kind === 'redo' || outcome.kind === 'confirm' ||` inclui para `undo`) devolve ocupado; o lado falso segue.
- R5 `src/core/store/store.ts:449` `if (options.readOnly?.() === true && (outcome.kind === 'load' || outcome.kind === 'confirm' ||` — o lado verdadeiro (aba somente-leitura com desfecho de carga, confirmação ou patches) recusa com `status.tabGuard.readOnly`; para `kind: 'undo'` o lado é falso, porque a condição só cobre `load`, `confirm` e `change` com patches.
- R6 `src/core/store/store.ts:475` `if (outcome.kind === 'undo' || outcome.kind === 'redo') {` — o lado verdadeiro (o desfecho do tratador é `undo` ou `redo`) entra no ramo do histórico; qualquer outro desfecho não entra.
- R7 `src/core/store/store.ts:476` `if (gesture) throw new Error(` — o lado verdadeiro (um gesto aberto) lança; o lado falso segue.
- R8 `src/core/history/history.ts:55` `if (tx === undefined) return null;` — o lado verdadeiro (a pilha de desfazer vazia) devolve `null`; o lado falso (há transação) monta o estado de uma etapa atrás.
- R9 `src/core/store/store.ts:479` `if (restored === null || tx === undefined) return { status: 'done', changed: false };` — o lado verdadeiro (sem transação ou sem restauração) termina sem mudança; o lado falso publica o estado restaurado.
- R10 `src/core/store/store.ts:321` `if (next.document !== before.document) {` — o lado verdadeiro (o documento restaurado difere do atual) entrega a mudança aos ouvintes de documento; o lado falso só chama os assinantes da store.
- R11 `src/core/store/store.ts:484` `outcome.kind === 'undo' ? undone(action) : redone(action)` — o lado do desfazer compõe `status.undone`; o lado do refazer compõe `status.redone`.
- R12 `src/core/store/store.ts:484` `outcome.kind === 'undo' ? tx.inverses : tx.patches` — o lado do desfazer publica os patches inversos; o lado do refazer publica os patches.

## Fronteiras assíncronas
- nenhuma — o tratador e cada função que ele chama rodam de forma síncrona: entre a chamada `src/app/commands.ts:332` `'history.undo': undoCommand,` e a volta `src/core/store/store.ts:485` `return { status: 'done', changed: true };` não há `await`, timer, quadro nem ouvinte criado; os ouvintes já registrados são chamados de forma síncrona em `src/core/store/store.ts:312`. Por isso nenhuma entrada de `auditoria/entradas.md` roda no intervalo.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L01-032 (o documento, a seleção e a pilha, por `canUndo`, `undo` e `applyPatches`), EST-L01-002 (os assinantes da store, por `publish`), EST-L01-003 (os ouvintes de mudança do documento, por `publish`).
- escreve: EST-L01-030, EST-L01-031, EST-L01-032, EST-L01-033, EST-L01-037 (o documento, a seleção e a pilha restaurados, a mensagem e o `ui` que segue a seleção), EST-L01-009 (a sequência de comandos, por `settleSequence`).

## Resultado
- **Estado final:** o documento, a seleção e a pilha ficam no estado de uma etapa atrás, e o estado carrega a mensagem `status.undone` — `src/core/store/store.ts:484` `publish(commit({ ...state, ...restored, ui, message: outcome.kind === 'undo' ? undone(action) : redone(action), refusal: null, refused: false }, id), outcome.kind === 'undo' ? tx.inverses : tx.patches);`; na pilha vazia nada muda — `src/core/store/store.ts:479` `if (restored === null || tx === undefined) return { status: 'done', changed: false };`. O editor volta ao breakpoint, ao estado, à classe e ao quadro-chave em que a mudança foi feita (DEF-0511).
- **Re-renderizado:** todo assinante da store é chamado — `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a seleção restaurada faz o editor abrir a página de um nó selecionado — `src/editor/store.ts:156` `const opened = { ...state, ui: pageFollowsSelection(state) };` — e a barra de status anuncia o que foi desfeito — `src/core/history/history.ts:82` `export const undone = (action: MessageParam): Message => message('status.undone', { action });`.
- **DOM do canvas:** o quadro aplica o documento restaurado pelos patches do desfazer — `src/editor/canvas/frame.tsx:81` `renderer.apply(change.before, change.after, change.patches);`.

## Regras
- G1: n/a — o desfazer restaura o documento, a seleção e a pilha; não captura o contexto de uma digitação nem grava numa camada de estilo `src/core/store/store.ts:478` `const restored: Restorable | null = (outcome.kind === 'undo' ? undo : redo)(state);`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — com rascunho pendente o registro grava antes (`src/editor/input/pending.ts:82` `keepTyping();`) quando a porta é de fora do campo; a tecla do campo fica nativa porque o contexto `field` do manifesto não herda `global` (`manifest/interactions.json:118` `"id": "field",`), então `Ctrl+Z` não é despachado com foco num campo de rascunho pendente.
- G3: ok `src/core/history/history.ts:79` `export const undoCommand = registerHandler('history.undo', () => ({ kind: 'undo' }));` — as cinco portas mandam só a intenção, sem argumentos (`manifest/commands/history.json:38` `"args": {}`), ao mesmo tratador.
- G4: n/a — as portas são teclas, botão da barra, botão do toast, item de menu e barra de comandos, nenhuma é um ponto do canvas `manifest/commands/history.json:42` `"kind": "toolbar",`.
- G5: n/a — o trecho não desenha painel nem barra; só publica estado `src/core/store/store.ts:461`.
- G6: ok `src/core/store/store.ts:484` `publish(commit({ ...state, ...restored, ui, message: outcome.kind === 'undo' ? undone(action) : redone(action), refusal: null, refused: false }, id), outcome.kind === 'undo' ? tx.inverses : tx.patches);` — a seleção restaurada entra na store, fonte única das vistas.
- G7: ok `src/core/store/store.ts:484` `outcome.kind === 'undo' ? tx.inverses : tx.patches` — o documento restaurado é publicado como patches (`tx.inverses`), que o quadro aplica pelo caminho incremental `src/editor/canvas/frame.tsx:81` `renderer.apply(change.before, change.after, change.patches);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção restaurados são validados antes de a store publicar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador; ele chama os ouvintes já registrados em `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` e `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Medições
- nenhuma — nenhum valor que só o navegador calcula entra no trecho; cada função do caminho lê o documento e o estado.
