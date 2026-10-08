# TRC-page.setSetting

- **Chamada:** `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,`
- **Argumentos:** o tratador recebe `HandlerContext<EditorUi>` e os argumentos `{ setting, value }` (`manifest/commands/page.json:76` `"setting": {`, tipo `attribute`, e `manifest/commands/page.json:81` `"value": {`, tipo `json`); as portas inspector-page-* (campos da aba Settings) enviam `setting` (o atributo da página) e `value` (o texto digitado).
- **Ramos que dependem dos argumentos:** R2 (`setting` que não é atributo de configuração da página lança), R3 (`value` verdadeiro ou falso para a configuração de liga/desliga), R6–R7 (URLs: `pageCanonical`, `pageOgImage`, `pageFavicon` leem o endereço), R8 (`setting` escolhe o `valueType`: keyword `pageDirection`, text `pageTitle`/`pageLanguage`/`pageHtmlClasses`/`pageDescription`/`pageOgTitle`, url e path-list `pageScripts`).

## Passos

1. `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,` — a tabela liga o id ao tratador.
2. `src/editor/shell/field.tsx:1665` `return filled === undefined ? null : { args: { [named]: attribute, ...forNode }, filled, stored, suggestions: keywordsOf(attribute) };` — o campo monta os argumentos: `named` é o argumento de tipo `attribute` (`setting`) e `filled` o outro (`value`).
3. `src/editor/shell/field.tsx:1768` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(command, { ...args, [filled]: text });` — a porta entrega a intenção.
4. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — o despacho da store do editor entra aqui.
5. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — o comando é undoável (`manifest/commands/page.json:98` `"undoable": true,`), `changesDocument` é verdadeiro.
6. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand]
7. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho segue para a store do núcleo.
8. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
9. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run] [lê: EST-L01-037 via run]
10. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — o argumento `setting` é lido contra os atributos do modelo (`src/core/store/args.ts:48` `return typeof value === 'string' && rules.attributeValues.has(value) ? 'fits' : 'invalid';`); um atributo que o modelo não tem é `status.args.invalid`.
11. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado `always` passa.
12. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
13. `src/core/page/settings.ts:66` `export const setPageSettingCommand = registerHandler('page.setSetting', ({ state, rules }, { setting, value }) => {` — o tratador.
14. `src/core/page/settings.ts:67` `const at = openedPage(state);` — [lê: EST-L01-030 via openedPage] [lê: EST-L01-037 via openedPage]
15. `src/core/page/settings.ts:68` `const page = state.document.pages[at];` — [lê: EST-L01-030 via handlerContext]
16. `src/core/page/settings.ts:69` `const rule = rules.attributeValues.get(setting);` — [lê: EST-L01-030 via handlerContext]
17. `src/core/page/settings.ts:71` `if (page === undefined) throw new Error('page.setSetting: the document has no page');` — R1.
18. `src/core/page/settings.ts:72` `if (rule === undefined || !isPageSetting(rules.attributes.get(setting), rules.root.type)) throw new Error(` — R2.
19. `src/core/page/settings.ts:26` `export function isPageSetting(appliesTo: readonly string[] | 'all' | undefined, rootType: string): boolean {` — a configuração é da página quando o atributo vale só para o tipo do topo.
20. `src/core/page/settings.ts:73` `const name = { key: rule.labelKey };`
21. `src/core/page/settings.ts:74` `const path = ['pages', at, 'tree', 'attributes', setting];` — o caminho fixo do documento.
22. `src/core/page/settings.ts:75` `const stored = page.tree.attributes[setting];` — [lê: EST-L01-030 via handlerContext]
23. `src/core/page/settings.ts:78` `if (rule.valueType === 'boolean') {` — R3.
24. `src/core/page/settings.ts:79` `if (typeof value !== 'boolean') throw new Error('page.setSetting: an on/off setting takes true or false');` — R3a.
25. `src/core/page/settings.ts:81` `if ((stored === true) === value) return { kind: 'change', message: said };` — R3b.
26. `src/core/page/settings.ts:82` `return { kind: 'change', patches: [value ? { op: 'add', path, value: true } : { op: 'remove', path }], message: said };` — o patch do liga/desliga.
27. `src/core/page/settings.ts:84` `if (typeof value !== 'string') throw new Error('page.setSetting: the value is not a string');` — R4.
28. `src/core/page/settings.ts:85` `const typed = value.trim();` — [lê: EST-L01-030 via handlerContext]
29. `src/core/page/settings.ts:86` `if (typed === '') {` — R5.
30. `src/core/page/settings.ts:88` `return stored === undefined ? { kind: 'change', message: removed } : { kind: 'change', patches: [{ op: 'remove', path }], message: removed };` — R5a.
31. `src/core/page/settings.ts:92` `const address = rule.valueType === 'url' ? readAddress(typed) : null;` — R6.
32. `src/core/elements/address.ts:44` `export function readAddress(typed: string): Address {` — a regra única do endereço.
33. `src/core/elements/address.ts:53` `if (scheme !== 'mailto' && scheme !== 'tel' && /\s/.test(value)) return refused(value, message('status.url.malformed', { url: value }));` — R6a, endereço com espaço.
34. `src/core/elements/address.ts:71` `if (!value.includes('/') && !value.includes('.')) return refused(value, message('status.url.malformed', { url: value }));` — R6b, palavra sem caminho.
35. `src/core/elements/address.ts:72` `return { ok: true, value };` — endereço aceito.
36. `src/core/page/settings.ts:93` `if (address !== null && !address.ok) return { kind: 'refused', message: address.refusal };` — R7.
37. `src/core/page/settings.ts:94` `const kept = keptValue(setting, rule, typed);` — o valor que a configuração guarda.
38. `src/core/page/settings.ts:36` `function keptValue(setting: string, rule: AttributeRules, typed: string): string | null {` — R8.
39. `src/core/page/settings.ts:37` `switch (rule.valueType) {` — o `valueType` do `setting` escolhe o ramo.
40. `src/core/page/settings.ts:40` `return rule.keywords.includes(keyword) ? keyword : null;` — R8b, palavra-chave.
41. `src/core/page/settings.ts:43` `return rule.html === LANGUAGE && !languageTagAllowed(typed) ? null : typed;` — R8a, texto; chama a regra do idioma.
42. `src/core/text/language-tag.ts:9` `export function languageTagAllowed(value: string): boolean {` — a regra única do idioma.
43. `src/core/text/language-tag.ts:11` `if (/^x-(?:[A-Za-z0-9]{1,8})(?:-[A-Za-z0-9]{1,8})*$/i.test(value)) return true;` — R8a-i, marca de uso privado.
44. `src/core/text/language-tag.ts:14` `return canonical !== undefined && LANGUAGE_NAMES.of(canonical) !== undefined;` — R8a-ii, idioma que o ICU conhece.
45. `src/core/page/settings.ts:48` `return read.ok ? read.value : null;` — R8c, endereço guardado.
46. `src/core/page/settings.ts:55` `if (parts.length === 0) return null;` — R8d, lista de caminhos vazia.
47. `src/core/page/settings.ts:58` `if (bad !== undefined && !bad.ok) return null;` — R8e, um caminho recusado.
48. `src/core/page/settings.ts:59` `return read.map((one) => (one.ok ? one.value : '')).join(' ');` — a lista guardada com um espaço entre os caminhos.
49. `src/core/page/settings.ts:95` `if (kept === null) return { kind: 'refused', message: message('status.page.settingInvalid', { setting: name, value: typed }) };` — R9.
50. `src/core/page/settings.ts:97` `if (stored === kept) return { kind: 'change', message: set };` — R10.
51. `src/core/page/settings.ts:98` `return { kind: 'change', patches: [{ op: stored === undefined ? 'add' : 'replace', path, value: kept }], message: set };` — o patch do valor.
52. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — [escreve: EST-L01-030 via applyPatches]
53. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — [escreve: EST-L01-031 via run]
54. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run]
55. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
56. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
57. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
58. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/page/settings.ts:71` `if (page === undefined) throw new Error('page.setSetting: the document has no page');` — documento sem a página aberta: lança; com página: segue.
- R2 `src/core/page/settings.ts:72` `if (rule === undefined || !isPageSetting(rules.attributes.get(setting), rules.root.type)) throw new Error(` — `setting` sem regra ou que não vale só para o tipo do topo: lança; configuração da página: segue.
- R3 `src/core/page/settings.ts:78` `if (rule.valueType === 'boolean') {` — valor de liga/desliga: ramo booleano (R3a, R3b); outro tipo: segue para a linha 84.
- R3a `src/core/page/settings.ts:79` `if (typeof value !== 'boolean') throw new Error('page.setSetting: an on/off setting takes true or false');` — `value` que não é verdadeiro nem falso: lança; booleano: segue.
- R3b `src/core/page/settings.ts:81` `if ((stored === true) === value) return { kind: 'change', message: said };` — o estado guardado já é o pedido: devolve só a mensagem; diferente: a linha 82 emite o patch de acrescentar ou tirar.
- R4 `src/core/page/settings.ts:84` `if (typeof value !== 'string') throw new Error('page.setSetting: the value is not a string');` — `value` que não é texto: lança; texto: segue.
- R5 `src/core/page/settings.ts:86` `if (typed === '') {` — texto vazio tira a configuração (R5a); com conteúdo: segue.
- R5a `src/core/page/settings.ts:88` `return stored === undefined ? { kind: 'change', message: removed } : { kind: 'change', patches: [{ op: 'remove', path }], message: removed };` — nada guardado: devolve só a mensagem; guardado: o patch tira o atributo.
- R6 `src/core/page/settings.ts:92` `const address = rule.valueType === 'url' ? readAddress(typed) : null;` — tipo `url`: lê o endereço (R6a, R6b); outro: `address` nulo.
- R6a `src/core/elements/address.ts:53` `if (scheme !== 'mailto' && scheme !== 'tel' && /\s/.test(value)) return refused(value, message('status.url.malformed', { url: value }));` — endereço web com espaço: recusa `status.url.malformed`; sem espaço: segue.
- R6b `src/core/elements/address.ts:71` `if (!value.includes('/') && !value.includes('.')) return refused(value, message('status.url.malformed', { url: value }));` — palavra sem caminho nem ponto: recusa `status.url.malformed`; caminho: a linha 72 aceita.
- R7 `src/core/page/settings.ts:93` `if (address !== null && !address.ok) return { kind: 'refused', message: address.refusal };` — endereço recusado: `refused` com o motivo da regra do endereço; aceito: segue.
- R8 `src/core/page/settings.ts:37` `switch (rule.valueType) {` — o `valueType` de `setting` escolhe: keyword (R8b), text (R8a), url (R8c), path-list (R8d, R8e); um tipo que nenhum recurso escreve cai no `default` (`src/core/page/settings.ts:61` `default:`).
- R8a `src/core/page/settings.ts:43` `return rule.html === LANGUAGE && !languageTagAllowed(typed) ? null : typed;` — texto do atributo `lang` que a regra do idioma não aceita: nulo; outro texto: o próprio texto.
- R8a-i `src/core/text/language-tag.ts:11` `if (/^x-(?:[A-Za-z0-9]{1,8})(?:-[A-Za-z0-9]{1,8})*$/i.test(value)) return true;` — marca de uso privado `x-…`: aceita; senão segue para a linha 14.
- R8a-ii `src/core/text/language-tag.ts:14` `return canonical !== undefined && LANGUAGE_NAMES.of(canonical) !== undefined;` — idioma que o ICU conhece: aceita; senão `false`.
- R8b `src/core/page/settings.ts:40` `return rule.keywords.includes(keyword) ? keyword : null;` — palavra-chave da lista: a palavra em minúsculas; fora da lista: nulo.
- R8c `src/core/page/settings.ts:48` `return read.ok ? read.value : null;` — endereço aceito: o valor normalizado; recusado: nulo.
- R8d `src/core/page/settings.ts:55` `if (parts.length === 0) return null;` — lista sem nenhum caminho: nulo; com caminhos: segue.
- R8e `src/core/page/settings.ts:58` `if (bad !== undefined && !bad.ok) return null;` — um caminho recusado: nulo; nenhum: a linha 59 junta a lista.
- R9 `src/core/page/settings.ts:95` `if (kept === null) return { kind: 'refused', message: message('status.page.settingInvalid', { setting: name, value: typed }) };` — valor que a configuração não guarda: recusa `status.page.settingInvalid`; guardável: segue.
- R10 `src/core/page/settings.ts:97` `if (stored === kept) return { kind: 'change', message: set };` — o valor guardado já é o novo: registra nada (`manifest/commands/page.json:102` `"noChange": "no-entry"`); diferente: a linha 98 emite o patch.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/page/settings.ts:66` `export const setPageSettingCommand = registerHandler('page.setSetting', ({ state, rules }, { setting, value }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (a página aberta, o atributo guardado no topo, as regras do modelo, via openedPage, handlerContext), EST-L01-037 (a página aberta em `ui.page`, via openedPage, handlerContext), EST-L05a-001 (a digitação pendente de um campo).
- escreve: EST-L01-030 (os atributos do topo da página: `document.pages[at].tree.attributes[setting]`, via applyPatches, publish), EST-L01-033 (a mensagem, via publish).

## Resultado

- **Estado final:** EST-L01-030 — `pages[at].tree.attributes[setting]` ganha, muda ou perde o valor (`src/core/page/settings.ts:98`, `src/core/page/settings.ts:82`, `src/core/page/settings.ts:88`) e EST-L01-033 com a mensagem `status.page.settingSet`, `status.page.settingRemoved`, `status.page.settingOn` ou `status.page.settingOff`.
- **Re-renderizado:** os assinantes de documento são chamados primeiro (`src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`) e depois todos os assinantes da store (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status mostra a mensagem (`src/editor/shell/status-bar.tsx:37` `const message = useEditorState((s) => s.message);`) e o campo passa a mostrar o valor guardado.
- **DOM do canvas:** o renderizador aplica os patches (`src/editor/canvas/frame.tsx:81` `renderer.apply(change.before, change.after, change.patches);`) e escreve os atributos HTML do topo da página no `<html>` (`src/editor/canvas/render/render.ts:739` `writeAttributes(this.target.documentElement, page);`).

## Regras

- G1: n/a — o comando escreve um caminho fixo do documento (`src/core/page/settings.ts:74` `const path = ['pages', at, 'tree', 'attributes', setting];`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — com `changesDocument` verdadeiro a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,` — as dez portas inspector-page-* chegam ao mesmo tratador e cada uma envia só a intenção (`setting` e `value`).
- G4: n/a — o comando muda o documento; não desenha nada sobre o canvas (`src/core/page/settings.ts:98`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/page/settings.ts:98`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção não é tocada pelo comando e vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/page/settings.ts:98`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento novo é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/page/settings.ts:66`).

## Medições

- nenhuma
