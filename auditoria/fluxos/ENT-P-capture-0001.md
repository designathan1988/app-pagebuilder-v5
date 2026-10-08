# ENT-P-capture-0001 — capture.edit pela porta capture.edit#captured-value

Fluxo de porta do domínio `capture`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-capture.edit`, que segue daqui. O campo da captura leva a marca da porta `src/editor/shell/captured-inspector.tsx:74` `{['text', 'attribute', 'insert'].includes(operation) && <label>{t('capture.editor.value')}<textarea data-door={VALUE.ref} data-key-context="captured-value" data-args={JSON.stringify({ target: node.id, operation, name, parent, index })} value={value} onChange={(event) => setValue(event.currentTarget.value)} /></label>}`.

## Passos
1. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — o controle desenhado pela porta entrega o id e os argumentos ao despacho da store do editor; `given` são os argumentos do manifesto da porta sobre os que o painel acrescenta.
2. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — `capture.edit` é desfazível (`manifest/commands/capture.json:58` `"undoable": true,`), então `changesDocument` é `true`.
4. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:236` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
6. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-030 via dispatch]
7. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id (`src/app/commands.ts:217` `'capture.edit': editCaptureCommand,`).
10. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos declarados são conferidos antes do tratador. [lê: EST-L01-030 via argumentRefusal]
11. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-capture.edit`).

## Ramos
- R1 `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — como `capture.edit` é desfazível, `changesDocument` é verdadeiro, e o ramo de gravação adiada da store do editor fica armado.
- R2 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, ele entraria na fila `waiting` (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — argumentos dentro da declaração do manifesto: o caminho segue ao tratador; fora dela: o despacho para na recusa.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/core/store/store.ts:413`; nenhum passo cita `await`, timer, quadro ou ouvinte. O campo desenhado da captura vive dentro do formulário `src/editor/shell/captured-inspector.tsx:62` `return <form className="captured-inspector__form" data-region="captured-edit" onSubmit={submit}>`, cuja submissão só roda num passo do próprio formulário.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L01-030 (via argumentRefusal), EST-L01-031 (via getState e editedKey), EST-L01-037 (via getState e editedKey)
- escreve: EST-L01-030 (a gravação efetiva entra no trecho `TRC-capture.edit`)

## Resultado
- **Estado final:** inalterado por esta porta; o tratador do trecho `TRC-capture.edit` troca a raiz da captura da página.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-capture.edit`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar, e um comando que muda o documento grava a digitação antes.
- G3: ok `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando e os argumentos) e o tratador único decide.
- G4: n/a — a porta é um controle do painel de captura, não um ponto do canvas (`manifest/commands/capture.json:67` `"kind": "panel-control",`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/core/store/store.ts:413`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-capture.edit
- **Argumentos enviados:** `{ target, operation, name, value, parent, index }` — o formulário da captura monta os campos (`src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };`) e a porta declara `manifest/commands/capture.json:89` `"args": {}`. Este campo só existe para as operações `text`, `attribute` e `insert` (`src/editor/shell/captured-inspector.tsx:74` `{['text', 'attribute', 'insert'].includes(operation) && <label>{t('capture.editor.value')}<textarea data-door={VALUE.ref} data-key-context="captured-value" data-args={JSON.stringify({ target: node.id, operation, name, parent, index })} value={value} onChange={(event) => setValue(event.currentTarget.value)} /></label>}`).
- R1 `src/core/capture/edits.ts:76` `if (found === null) return { kind: 'refused', message: message('status.capture.nodeMissing') };` — o lado falso: `target` é o nó escolhido (`node.id`), que a captura da página tem, então `found` existe.
- R3 `src/core/capture/edits.ts:80` `if (operation === 'text') {` — o lado verdadeiro quando a operação do formulário é `text`; falso nas outras.
- R4 `src/core/capture/edits.ts:81` `if (found.node.kind !== 'text' || typeof value !== 'string') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — depende de `value`: nó de texto com `value` textual segue; outra combinação recusa.
- R5 `src/core/capture/edits.ts:87` `} else if (operation === 'attribute') {` — o lado verdadeiro quando a operação é `attribute`; falso nas outras.
- R6 `src/core/capture/edits.ts:88` `if (found.node.kind !== 'element' || typeof name !== 'string' || !NAME.test(name) || typeof value !== 'string') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — depende de `name` e de `value`: nó elemento com `name` na gramática e `value` textual segue; outra combinação recusa.
- R7 `src/core/capture/edits.ts:89` `if (unsafeCapturedAttribute(found.node.tag, { name, value })) return { kind: 'refused', message: message('status.capture.unsafeEdit') };` — depende de `name` e de `value`: atributo executável ou endereço inseguro recusa; seguro escreve o atributo.
- R8 `src/core/capture/edits.ts:96` `} else if (operation === 'remove') {` — o lado falso, porque este campo não existe para a operação `remove`.
- R10 `src/core/capture/edits.ts:99` `} else if (operation === 'insert' || operation === 'move') {` — o lado verdadeiro quando a operação é `insert`; falso em `move` (que este campo não oferece).
- R13 `src/core/capture/edits.ts:104` `if (operation === 'move') {` — o lado falso, porque este campo não oferece a operação `move`.
- R17 `src/core/capture/edits.ts:121` `} else return { kind: 'refused', message: message('status.capture.invalidEdit') };` — o lado falso, porque a operação é sempre um dos valores do enum.
- R11 `src/core/capture/edits.ts:100` `if (typeof parent !== 'string' || typeof index !== 'number' || !Number.isInteger(index) || index < 0) return { kind: 'refused', message: message('status.capture.invalidEdit') };` — depende de `parent` e de `index`, que o formulário envia; fora dos tipos e do intervalo, recusa.
- R15 `src/core/capture/edits.ts:109` `if (typeof value !== 'string') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — depende de `value`: textual analisa em `captureTree`; não textual recusa.
- R16 `src/core/capture/edits.ts:112` `if (body === undefined || body.children.length === 0) return { kind: 'refused', message: message('status.capture.invalidEdit') };` — depende de `value`: sem corpo recusa; com filhos insere-os.
