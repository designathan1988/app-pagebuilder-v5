# ENT-P-page-0011 — page.setSetting pela porta page.setSetting#inspector-page-favicon

Fluxo de porta do domínio `page`. Rastreia o caminho próprio da porta — o campo do favicon da aba Settings do inspector — até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-page.setSetting`, que segue daqui.

O campo Início do bloco da porta (`src/editor/doors/door.tsx:144`) não é a linha que despacha esta porta: o campo do inspector é um `KeptTextField` (`src/editor/shell/inspector-settings.tsx:400`) que despacha direto em `src/editor/shell/field.tsx:1768`.

## Passos
1. `src/editor/shell/field.tsx:1768` `        (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(command, { ...args, [filled]: text });` — o campo grava o que ele mostra no argumento que lhe cabe, para o nó que ele desenha (aqui a página).
2. `src/editor/shell/field.tsx:1665` `    return filled === undefined ? null : { args: { [named]: attribute, ...forNode }, filled, stored, suggestions: keywordsOf(attribute) };` — o campo monta os argumentos: `named` é `setting` (`manifest/commands/page.json:76` `"setting": {`) e `filled` é `value` (`manifest/commands/page.json:81` `"value": {`).
3. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
4. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — `page.setSetting` é desfazível (`manifest/commands/page.json:98` `"undoable": true,`).
5. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto da edição. [lê: EST-L05a-001 via beforeCommand]
6. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [lê: EST-L05a-038 via dispatch]
7. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo chama o `run`.
9. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — o argumento `setting` é lido contra os atributos do modelo (`src/core/store/args.ts:48` `return typeof value === 'string' && rules.attributeValues.has(value) ? 'fits' : 'invalid';`); `pageFavicon` é um deles. [lê: EST-L01-030 via argumentRefusal]
10. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` busca o tratador do id na tabela.
11. `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-page.setSetting`).

## Ramos
- R1 `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — comando desfazível: a digitação pendente é gravada antes.
- R2 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o comando roda agora; com um gesto aberto e o comando desfazível, o despacho entra na fila `waiting` (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — um `setting` que o modelo não tem tomaria o lado da recusa; `pageFavicon` é um atributo do modelo.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — o id `page.setSetting` tem tratador na tabela.

## Fronteiras assíncronas
- nenhuma — o caminho de `src/editor/shell/field.tsx:1768` a `src/app/commands.ts:342` é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand), EST-L05a-038 (via dispatch), EST-L01-030 (o documento, via argumentRefusal)
- escreve: nenhum no caminho da porta; a escrita de EST-L01-030 e EST-L01-033 entra no trecho `TRC-page.setSetting`

## Resultado
- **Estado final:** EST-L01-030 e EST-L01-033 — `pages[at].tree.attributes[setting]` ganha, muda ou perde o endereço do favicon, pelo trecho `TRC-page.setSetting` (`src/core/page/settings.ts:98`); um endereço recusado deixa o documento como estava e só muda a mensagem.
- **Re-renderizado:** os assinantes de documento em `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` e depois todos os assinantes da store (`src/core/store/store.ts:314`), pelo trecho.
- **DOM do editor:** a barra de status mostra a mensagem e o campo passa a mostrar o valor guardado, pelo trecho.
- **DOM do canvas:** o renderizador aplica os patches e escreve a marca `<link rel="icon">` do topo da página, pelo trecho.

## Regras
- G1: n/a — o comando escreve um caminho fixo do documento (`src/core/page/settings.ts:74` `const path = ['pages', at, 'tree', 'attributes', setting];`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — com `changesDocument` verdadeiro a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,` — as dez portas inspector-page-* chegam ao mesmo tratador e cada uma envia só a intenção (`setting` e `value`).
- G4: n/a — o comando muda o documento; não desenha nada sobre o canvas: `src/core/page/settings.ts:98`.
- G5: n/a — o caminho da porta não desenha painel nem barra: `src/editor/shell/field.tsx:1768`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção não é tocada pelo comando e vem da store.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/page/settings.ts:98`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento novo é validado antes de publicar.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/shell/field.tsx:1768` e `src/app/commands.ts:342`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-page.setSetting
- **Argumentos enviados:** `{ setting: 'pageFavicon', value: <texto digitado> }` — o campo nomeia o atributo do seu manifesto (`manifest/commands/page.json:321` `"attribute": "pageFavicon",`) e o texto digitado preenche `value`.
- R2 `src/core/page/settings.ts:72` `if (rule === undefined || !isPageSetting(rules.attributes.get(setting), rules.root.type)) throw new Error(` — o `setting` que a porta envia é `pageFavicon`, uma configuração da página (`manifest/elements.json:2066` `"elements": [` só com `"page"`), então o caminho não passa pelo lado do lançamento.
- R3 `src/core/page/settings.ts:78` `if (rule.valueType === 'boolean') {` — `pageFavicon` é do tipo `url` (`manifest/elements.json:2064` `"valueType": "url",`), não booleano, então o caminho não passa pelo ramo booleano.
- R6–R7 `src/core/page/settings.ts:92` `const address = rule.valueType === 'url' ? readAddress(typed) : null;` — `pageFavicon` é do tipo `url`, então o caminho lê o endereço pela regra única (`src/core/elements/address.ts:44`): um endereço web com espaço toma `src/core/elements/address.ts:53` e uma palavra sem caminho nem ponto toma `src/core/elements/address.ts:71`, ambos recusando `status.url.malformed`; uma recusa para o comando em `src/core/page/settings.ts:93` `if (address !== null && !address.ok) return { kind: 'refused', message: address.refusal };`.
- R8 `src/core/page/settings.ts:37` `switch (rule.valueType) {` — `pageFavicon` cai no ramo de endereço: `src/core/page/settings.ts:48` `return read.ok ? read.value : null;` guarda o valor normalizado quando o endereço é aceito e devolve nulo quando o `keptValue` recusa.
