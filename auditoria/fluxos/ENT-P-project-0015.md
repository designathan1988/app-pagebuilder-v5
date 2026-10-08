# ENT-P-project-0015 — project.importHtml pela porta project.importHtml#destination-inside

Fluxo de porta do domínio `project`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-project.importHtml`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o botão "inside" do diálogo de importação chama o `dispatch` da store do editor com o id do comando e os argumentos; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos fixos da porta `{ destination: 'inside', files: [] }` (`manifest/commands/project.json:544` `"args": {`) mais o `target` que o diálogo passa quando há uma só seleção (`src/editor/shell/html-import.tsx:29`) entram em `given`.
3. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
4. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — `project.importHtml` tem `"undoable": true` (`manifest/commands/project.json:418` `"undoable": true,`), então `changesDocument` é `true`.
5. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado e o contexto é tomado. [lê: EST-L05a-001 via beforeCommand]
6. `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
7. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
9. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
10. `src/app/commands.ts:351` `'project.importHtml': choosingImport(importHtmlCommand),` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-project.importHtml`).

## Ramos
- R1 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — a porta fixa `files: []` no manifesto, então `files` já está em `given` e o ramo dos arquivos não é tomado; o comando não tem argumento `file`, então `file` é `undefined` e o caminho segue para a linha 144.
- R2 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo, o lado tomado por esta porta; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/editor/store.ts:233` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:351`; a leitura dos arquivos já entrou no estado do editor antes de o diálogo abrir, e nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-project.importHtml`

## Resultado
- **Estado final:** EST-L01-030, EST-L01-031, EST-L01-033, EST-L01-034 e EST-L01-035 — no ramo `change` o documento ganha os patches do destino e a seleção passa a ser a do destino (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`); nos ramos `confirm` e `refused` só a confirmação pendente ou a mensagem e a recusa são escritas (`src/core/store/store.ts:446`, `src/core/store/store.ts:451`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de páginas do explorador deriva do documento e realça a aberta (`src/editor/shell/sidebar/explorer.tsx:66` `const shown = useEditorState((s) => pageShown(s)?.tree.id === page.tree.id);`).
- **DOM do canvas:** o quadro mostra a página aberta com os elementos importados (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o comando é desfazível, então `changesDocument` é verdadeiro e a digitação pendente é gravada no contexto da digitação antes, entregue à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar, e um comando que muda o documento grava a digitação antes.
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando e o destino `inside`) e o tratador único `src/app/commands.ts:351` `'project.importHtml': choosingImport(importHtmlCommand),` decide.
- G4: n/a — a porta é o botão da escolha de destino, não um ponto do canvas (`manifest/commands/project.json:522` `"kind": "panel-control",`).
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção nova do destino vem da store, sem cópia local.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:351`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-project.importHtml
- **Argumentos enviados:** `{ destination: 'inside', files: [], target? }` — o manifesto fixa `destination` e `files` (`manifest/commands/project.json:545` `"destination": "inside",`; `manifest/commands/project.json:546` `"files": []`) e o diálogo passa `target` quando há uma só seleção (`src/editor/shell/html-import.tsx:29` `<DoorControl entry={entry} args={target === undefined ? {} : { target }} {...(destination === 'page' ? { className: 'door--primary' } : {})} />`).
- R1 `src/editor/import/html-import.ts:10` `if (args.destination === undefined && importPageFiles(args.files).length > 0 && !args.files.some(f => f.error)) {` — `destination` é `'inside'` (não `undefined`), então o teste é falso, o diálogo de destinos não reabre e o caminho segue ao tratador do núcleo (`src/editor/import/html-import.ts:13` `const outcome = owner.run(context, { ...args, files });`).
- R3 `src/core/import/import.ts:1798` `if (destination === 'replace' && confirmed !== true) return { kind: 'confirm' as const };` — `destination` é `'inside'`, então o teste é falso e o caminho não toma o lado `confirm`.
- R5 `src/core/import/import.ts:1800` `const replacing = destination === 'replace' || (destination === 'page' && pristine);` — `destination` é `'inside'`: o segundo membro é falso, então `replacing` é falso e o lugar é o pedido.
