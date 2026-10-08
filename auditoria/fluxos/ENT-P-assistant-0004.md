# ENT-P-assistant-0004 — assistant.attachReference pela porta assistant.attachReference#assistant-reference

Fluxo de porta do domínio `assistant`. Rastreia o caminho próprio da porta — o botão "Adicionar imagem de referência", desenhado por `DoorControl`, que pede o arquivo ao navegador — até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-assistant.attachReference`, que segue daqui.

## Passos
1. `src/editor/assistant/surface.tsx:15` `    <footer>{door('assistant-input', { value: draft, disabled: busy })}{door('assistant-reference', { disabled: busy })}{busy ? door('assistant-cancel', {}) : door('assistant-send', { disabled: !configured || !draft.trim() })}</footer>` — o painel pede o controle "Adicionar imagem de referência".
2. `src/editor/assistant/panel.tsx:67` `return <DoorControl entry={entry} ready={props.disabled !== true} />;` — o desenhador devolve o `DoorControl` para esta porta.
3. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle roda `door.run`.
4. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — comando não construído ou indisponível não roda.
5. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos da porta (o manifesto não fixa nenhum, `manifest/commands/assistant.json:205` `"args": {}`).
6. `src/editor/doors/door.tsx:107` `const file = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'file' && !arg.optional && !(name in given))?.[0];` — o comando declara o argumento `file` (`manifest/commands/assistant.json:157` `"type": "file",`), então `file` é `'file'`.
7. `src/editor/doors/door.tsx:127` `if (file !== undefined && entry.door.adapter.fileReading === 'upload') {` — a porta lê o arquivo como registo de upload (`manifest/commands/assistant.json:203` `"fileReading": "upload"`), então este ramo é o tomado.
8. `src/editor/doors/door.tsx:128` `void chooseFiles().then(async (chosen) => {` — o escolhedor do navegador abre e a leitura segue em promessa.
9. `src/editor/doors/door.tsx:131` `dispatch(entry.command.id, { ...given, [file]: records });` — a porta entrega a intenção com a lista de registos lida (`src/editor/doors/door.tsx:130` `const records = await Promise.all(chosen.map((one) => readUploadFile(one)));`).
10. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
11. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `assistant.attachReference` não é desfazível (`manifest/commands/assistant.json:177` `"undoable": false`).
12. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [lê: EST-L05a-038 via dispatch]
13. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
14. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo chama o `run`.
15. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` busca o tratador do id na tabela.
16. `src/app/commands.ts:180` `'assistant.attachReference': attachAssistantReference,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-assistant.attachReference`).

## Ramos
- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — controle indisponível não roda; disponível segue.
- R2 `src/editor/doors/door.tsx:119` `if (file !== undefined && entry.door.adapter.fileReading === 'data') {` — a leitura desta porta não é `data` (é `upload`), então este ramo não é tomado.
- R3 `src/editor/doors/door.tsx:129` `if (chosen.length === 0) return;` — nada escolhido no seletor: o caminho para; escolhido: segue para a entrega.
- R4 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho vai direto à store do núcleo; com um gesto aberto e um comando que não muda o documento, ele iria por `src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`.

## Fronteiras assíncronas
- F1 `src/editor/doors/door.tsx:128` `void chooseFiles().then(async (chosen) => {` — a entrega não espera o seletor; entradas que podem rodar no intervalo: outra porta do painel (as demais `ENT-P-assistant-*`) e as entradas de teclado e ponteiro do editor; estado da aplicação: EST-L01-030 sem a referência ainda.
- F2 `src/editor/doors/door.tsx:130` `const records = await Promise.all(chosen.map((one) => readUploadFile(one)));` — a espera pela leitura dos bytes; entradas que podem rodar no intervalo: as demais `ENT-P-assistant-*`; estado: EST-L01-030 sem a referência ainda.

## Estado
- lê: EST-L05a-038 (via dispatch)
- escreve: nenhum no caminho da porta; a escrita de EST-L06-050 entra no trecho `TRC-assistant.attachReference`

## Resultado
- **Estado final:** EST-L06-050 com a imagem de referência, pelo trecho `TRC-assistant.attachReference` (`src/editor/assistant/state.ts:41`).
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** a prévia da imagem de referência no painel `assistant-panel`, pelo trecho.
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:177` `"undoable": false`
- G2: n/a — o comando não altera o documento nem o estado antes de rodar: `manifest/commands/assistant.json:177` `"undoable": false`
- G3: ok `src/editor/doors/door.tsx:131` `dispatch(entry.command.id, { ...given, [file]: records });` — a única porta do comando (`manifest/commands/assistant.json:181` `"id": "assistant-reference",`) entrega só a intenção (o id e a lista de registos) e o tratador único decide.
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:186` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o caminho da porta não desenha painel nem barra: `src/editor/doors/door.tsx:131`.
- G6: n/a — o caminho da porta não escreve a seleção: `src/editor/doors/door.tsx:131`.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:177` `"undoable": false`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:285` e `src/app/commands.ts:180`; o seletor de arquivo é desenhado pelo próprio `chooseFiles` (`src/editor/doors/door.tsx:183`) e nada fica por remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-assistant.attachReference
- **Argumentos enviados:** `{ file }` — a lista de registos `{ name, type, bytes }` que `chooseFiles` e `readUploadFile` leem (`src/editor/doors/door.tsx:131`); a porta passa o primeiro registo.
- R1 `src/editor/assistant/state.ts:37` `const given: unknown = typeof file === 'string' ? JSON.parse(file) : file;` — o `file` que esta porta envia é a lista já lida (não um texto), então o caminho passa pelo lado do registo já lido.
- R2 `src/editor/assistant/state.ts:42` `} catch { return { kind: 'refused', message: message('assistant.invalidImage') }; }` — o registo que a porta lê: um formato fora dos aceitos ou um tamanho fora dos limites leva à recusa `assistant.invalidImage`; um registo válido leva à mudança que grava a referência.
