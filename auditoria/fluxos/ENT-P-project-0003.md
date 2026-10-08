# ENT-P-project-0003 — project.restoreVersion pela porta project.restoreVersion#recovery-dialog-restore

Fluxo de porta do domínio `project`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-project.restoreVersion`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o botão Restore do diálogo de recuperação chama o `dispatch` da store do editor com o id do comando e os argumentos; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — o argumento `version` que o diálogo passa por `args` (`src/editor/shell/recovery.tsx:40` `args={{ version: String(v.revision) }}`) entra em `given`.
3. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
4. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `project.restoreVersion` tem `"undoable": false` (`manifest/commands/project.json:90` `"undoable": false`), então `changesDocument` é `false`.
5. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
6. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
7. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
9. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
10. `src/app/commands.ts:344` `'project.restoreVersion': restoreVersion,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-project.restoreVersion`).

## Ramos
- R1 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando declara só o argumento `version` (`manifest/commands/project.json:75` `"version": {`), que já está em `given`, então nenhum argumento `file`, `files` ou `clipboard` é lido no despacho e `file` é `undefined`; o caminho segue para a linha 144.
- R2 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo, o lado tomado por esta porta; com um gesto aberto e um comando que não muda o documento, ele roda pelo gesto (`src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`).
- R3 `src/editor/store.ts:246` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:344`; a leitura da versão salva acontece dentro do tratador, que não abre timer, quadro nem ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-project.restoreVersion`

## Resultado
- **Estado final:** EST-L01-030, EST-L01-031, EST-L01-032, EST-L01-033 e EST-L01-035 — no ramo `load` o documento passa a ser o da versão restaurada e a seleção e o histórico começam vazios (`src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);`); no ramo `refused` só a mensagem e a recusa são escritas (`src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de páginas do explorador deriva do documento e realça a aberta (`src/editor/shell/sidebar/explorer.tsx:66` `const shown = useEditorState((s) => pageShown(s)?.tree.id === page.tree.id);`).
- **DOM do canvas:** o quadro passa a mostrar a página do documento restaurado (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar.
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando e o argumento `version`) e o tratador único `src/app/commands.ts:344` `'project.restoreVersion': restoreVersion,` decide.
- G4: n/a — a porta é o botão do diálogo de recuperação, não um ponto do canvas (`manifest/commands/project.json:95` `"kind": "panel-control",`).
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G6: n/a — o caminho da porta não escreve a seleção; ela fica como a store a tem `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:344`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-project.restoreVersion
- **Argumentos enviados:** `{ version }` — `version` é a revisão da versão salva, entregue como texto (`src/editor/shell/recovery.tsx:40` `args={{ version: String(v.revision) }}`).
- R1 `src/core/project/recovery.ts:10` `if (saved === undefined) throw new Error(` — `version` é uma das revisões que o diálogo lista (a lista é `ui.recovery`, `src/editor/shell/recovery.tsx:25` `const versions = useEditorState((s) => s.ui.recovery);`), então `saved` não é `undefined` e o caminho segue; uma revisão sem versão salva lançaria e a store recolheria a falha (`src/core/store/store.ts:436` `const failed = message('status.change.failed', { command: nameOf(command) });`).
- R2 `src/core/project/recovery.ts:12` `if ('refused' in read) return { kind: 'refused' as const, message: read.refused };` — o documento de uma versão salva passa pela mesma validação do leitor único (`src/core/project/archive.ts:28` `if (first !== undefined) return invalid(`); aceito, o caminho segue pelo lado `load` (`src/core/project/archive.ts:29` `return { document };`); um documento que a validação apontasse tomaria o lado da recusa.
