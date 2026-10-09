# Grupo J — G3, G6, G7 e integridade do documento (verificação de 2026-10-09)

Verificador: Claude (subagente). Código lido na árvore de trabalho do ramo `estrutura/edicao-e-espaco` (último commit `ae24ee7e`).
Sondas de leitura gravadas só no scratchpad (`scratchpad/probe/integridade.probe.ts`, configuração própria `vt.config.mjs` com a raiz no projeto), nunca no projeto.

Comandos rodados:
- `npx vitest run --config tools/runner/model/vitest.config.ts tools/runner/model/structure.test.ts tools/runner/model/history.test.ts tools/runner/model/pages.test.ts tools/runner/model/text.test.ts tools/runner/model/style.test.ts` → `Test Files 5 passed (5)`, `Tests 7 passed (7)`, saída 0.
- O mesmo com `render.test.ts` e `--reporter=verbose` → `Test Files 6 passed (6)`, `Tests 8 passed (8)`.
- `npx vitest run src/core/document src/core/history` → `Test Files 7 passed (7)`, `Tests 41 passed (41)`, saída 0.
- Resumos em `.cache/model/<grupo>.json` (sem mutante): structure 150 execuções, 3778 passos, 347 desfazer; history 150, 5180 passos, 321 fusões; pages 150, 3711 passos, 244 aberturas de projeto; text 150, 3558 passos; style 150, 3928 passos, 57 fusões. Nenhum `failure`.

## INT — Integridade do documento

- **Veredito:** parcial.

### Provas

**Toda escrita passa pelo validador antes de ser publicada.** O único estado do documento vive em `createStore`; todo `publish` de estado novo recebe o resultado de `commit`, e `commit` roda o validador:
- `src/core/store/store.ts:272` `const commit = (next: StoreState<Ui>, source: string): StoreState<Ui> => {`
- `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`
- `src/core/store/store.ts:279` `const kept: StoreState<Ui> = { ...state, message: breach, refused: true };` — estado inválido nunca entra; o anterior fica.
- `src/core/store/store.ts:283` `throw new InvalidStateError(source, problems);` — em desenvolvimento e testes (`freeze`) a falha é ruidosa.
- Caminhos conferidos um a um: comando comum (`store.ts:551` `const committed = commit(next, id);`), desfazer/refazer (`store.ts:484` `publish(commit({ ...state, ...restored, ui, message: ...`), carga de projeto (`store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, ...`), fim de gesto (`store.ts:745` `publish(commit({ ...state, history: record(before.history, tx, null) }, current.command));`), gesto cancelado (`store.ts:750`), grupo de comandos (`store.ts:619`, `store.ts:651`), sequência cancelada (`store.ts:678`). Os dois `publish(state)` sem `commit` (`store.ts:332` e `store.ts:728`) republicam o estado já validado.
- A store do editor não guarda documento próprio: `src/editor/store.ts:202` `const safe: EditorStore = {` só embrulha `dispatch`, `gesture`, `sequence`, `commandGroup` e `answer` da store do núcleo. O comando que muda o documento durante um gesto aberto espera numa fila e roda depois pelo `store.dispatch` normal: `src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`.
- Abrir arquivo valida antes da carga: `src/core/project/archive.ts:26` `const first = validateDocument(document, [], rules)[0];`.

**O que o validador confere** (`src/core/document/validate.ts`):
- Esquema de cada nó: tipo (`:562`), tag (`:567`), nome (`:566`), atributos e onde valem (`:630`–`:640`), estilos (`:657`), texto conforme o conteúdo (`:660`–`:661`), filhos só em quem tem filhos (`:677` `if (element.content !== 'children' && node.children.length > 0) bad(...`).
- IDs únicos em páginas e componentes: `validate.ts:343` `if (first !== undefined) bad(path, \`id "${id}" is already used at ${first}\`);`.
- Seleção só com nós existentes e sem repetição: `validate.ts:466` e `validate.ts:467`.
- Referências quebradas: `validate.ts:491` `for (const orphan of orphanReferences(doc)) {`; instâncias de componentes (`validate.ts:505`), interações (`validate.ts:484`), dados e movimento (`validate.ts:371`, `validate.ts:475`). Órfão de árvore não existe por construção: o nó só existe dentro de `children` do pai.
- Raiz da página: `validate.ts:443` e `validate.ts:565` `if (!root && node.type === rules.root.type) bad(...`.

**Pilha de desfazer/refazer:** em desenvolvimento e testes cada publicação passa por `historyBreaches` (`src/editor/store.ts:154` `...(import.meta.env.DEV ? { invariants: historyBreaches } : {}),`; `src/core/store/store.ts:315` `const breaches = options.invariants?.(before, next, patches) ?? [];`), que exige que a entrada nova mude o documento, que seus patches refaçam o que os inversos desfazem e que o refazer esvazie (`src/core/history/invariants.ts:43`–`:45`). O modelo dos detectores confere de fora a mesma coisa e "desfazer tudo volta ao início, refazer tudo volta ao fim" (`tools/runner/model/harness.ts:571` e `:573`). Os detectores rodaram sem falha (contagens acima).

**Serialização ida-e-volta (DCS-001, byte a byte).** Salvar escreve `src/core/project/archive.ts:41` `const document = new TextEncoder().encode(\`${JSON.stringify(state.document, null, 2)}\n\`);`; abrir faz `JSON.parse` → `migrateDocument` (identidade na versão atual: `src/core/document/migrations.ts:53` `while (at < current) {` não roda) → validação → carga. Sonda no scratchpad: para cada uma das 48 fixtures de `manifest/features/fixtures/`, abrir → salvar → abrir o texto salvo → salvar de novo, comparando os dois `project.json`: as 48 deram `idêntico` (ex.: `canonical idêntico 113376 113376`).

### Achados

1. **As regras de aninhamento não são conferidas depois de cada escrita.** O validador não lê o modelo de conteúdo; o próprio arquivo o declara: `src/core/document/validate.ts:6` `// checks it once nesting-grammar completes it.` — `rules.contentModel` aparece em `validate.ts` só na declaração do tipo (`:122`) e na montagem (`:195`). O aninhamento é conferido comando a comando por `placementRefusal` (`src/core/elements/content-model.ts:253`), que cada comando de inserir/mover/colar/envolver chama por conta própria. Efeito confirmado pela sonda (`validateDocument` e `readProject` sobre a fixture `aurora` com um nó a mais na raiz):
   - `<li>` dentro de `<div>` → `problemas= 0`, `readProject= aceito`;
   - `<a>` dentro de `<a>` → `problemas= 0`, `aceito`;
   - `<form>` dentro de `<form>` → `problemas= 0`, `aceito`;
   - `<tr>` direto em `<section>` → `problemas= 0`, `aceito`.
   Entrada: Arquivo › Abrir com um `project.json` assim → o projeto abre e a exportação escreve HTML com o aninhamento que o editor recusa nos próprios comandos.
2. **Um comando escreve aninhamento proibido sem ser recusado.** `element.setAttribute` não pergunta à regra única (lido `src/core/elements/attributes.ts`; não há chamada a `placementRefusal` nem a `interactiveInsideRefusal`). Sonda: um `<video>` sem `controls` dentro de um `<a href>` (aceito: vídeo sem `controls` não é interativo), selecionar o vídeo e despachar `element.setAttribute { attribute: 'controls', value: true }` → `done controls= true`. No mesmo estado, a regra única recusa: `placementRefusal(video com controls → a com href)= {"key":"status.refused.interactiveInside",...}`. Como o validador não lê o aninhamento (achado 1), o estado é aceito e publicado. Entrada → resultado: ligar "Controles" num vídeo dentro de um bloco-link → documento com conteúdo interativo dentro de `<a>`, que a inserção do mesmo vídeo já com controles teria recusado. É também uma quebra de G3 (seção G3): duas portas que chegam ao mesmo estado final dão resultados diferentes.
3. **A ida-e-volta byte a byte não tem detector.** Nenhum detector de `tools/runner/model/` nem teste de `src/core/document` ou `src/core/history` salva, abre e salva comparando bytes (busca por `project.save`/`saveProject` em `src` e `tests` só acha o handler, o registro e testes e2e). A propriedade confere hoje pela sonda; nada a impede de regredir sem aviso.
4. **A pilha de desfazer só é conferida em desenvolvimento e testes.** `src/editor/store.ts:154` liga `historyBreaches` só com `import.meta.env.DEV`. Isso é o que o comentário de `src/core/history/invariants.ts:1`–`:4` declara; registro como limite da prova, não como defeito.

**Os detectores de integridade acusam o que dizem acusar** (mutantes do catálogo `tools/runner/mutants.ts`, só com `structure.test.ts`):
- `BUILDER_MUTANT=M22` (validador aceita ids repetidos) → `× a integridade do documento: um id usado duas vezes é recusado...`, `Tests 1 failed | 1 passed (2)`.
- `BUILDER_MUTANT=M23` (`applyPatches` aceita índice além do fim) → mesmo teste falha, `1 failed | 1 passed (2)`.
- `BUILDER_MUTANT=M07` (inversos na ordem errada) → `× os comandos de estrutura seguem o modelo do manifesto`, `1 failed | 1 passed (2)`.
- Sem mutante: os dois testes passam (comando do início).
- Observação: com M22 o modelo de comandos de estrutura continua passando; só o teste direto do validador acusa. Nenhum comando de estrutura do modelo gera id repetido, então a prova de "IDs únicos depois de cada escrita" é a validação em `commit`, não o modelo.

## G6 — A store é a fonte única da seleção

- **Veredito:** parcial.

### Provas

- A seleção só existe em `StoreState.selection` (`src/core/store/store.ts:29` `readonly selection: Selection;`) e só muda pelo resultado de um comando (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`), pelo desfazer/refazer (`src/core/history/history.ts:58` `selection: tx.selectionBefore,` e `:69`), pela carga (`store.ts:489`) e pelos cancelamentos (`store.ts:619`, `store.ts:750`). Todas passam por `commit`, que confere que a seleção só nomeia nós existentes (`src/core/document/validate.ts:466`).
- Busca por `selection:` em `src/editor`, `src/core` e `src/modules` fora de testes: toda escrita é campo `selection` de um `Outcome` de tratador registrado (ex.: `src/core/selection/selection.ts:34` `return { kind: 'change', selection: [target], message: message('status.selected', { name: found.node.name }) };`, `src/editor/menus/context-menu.ts:32`, `src/editor/inspector/page-properties.ts:27`). As ocorrências em `src/editor/canvas/grid-edit.ts:86`, `src/editor/checks/fix.ts:27` e `src/core/motion/commands.ts:771` montam um estado temporário para chamar outro tratador dentro do mesmo comando; nada é guardado.
- Camadas deriva da store: `src/editor/shell/sidebar/layers.tsx:229` `const selected = useEditorState((s) => s.selection.includes(node.id));`, `:234` e `:494`; os únicos `useState` do arquivo são `open` (`:131`) e a janela de rolagem (`:468`).
- O canvas deriva da store: `src/editor/canvas/chrome.tsx:1044` `const selection = useEditorState((s) => s.selection);`, `src/editor/canvas/side-frame.tsx:30`, `src/editor/canvas/rulers.tsx:43`, `src/editor/canvas/grid-editor.tsx:26`.
- Os `useState` que guardam ids (`src/editor/shell/field.tsx:241`, `src/editor/canvas/edit-handles.tsx:100`, `:127`, `src/editor/shell/field.tsx:145`) são caches de medição chaveados pela seleção lida da store e descartados quando ela muda: `src/editor/shell/field.tsx:265` `const page = read !== null && read.selection === selection ? (JSON.parse(read.text) as (Record<string, string> | null)[]) : [];`.
- A store do editor declara a regra: `src/editor/store.ts:3` `// ... no document, selection or editor state lives in useState.`

### Achados

1. **Uma segunda seleção, `ui.capturedNode`, nunca é limpa.** É escrita só por `capture.select` (`src/editor/capture/selection.ts:11` `return { kind: 'change', ui: { ...state.ui, capturedNode: target }, selection: [], message: message('status.selected', { name }) };`); a busca por `capturedNode` em `src` acha só esse escritor e os leitores (`src/editor/canvas/chrome.tsx:592`, `src/editor/shell/captured-inspector.tsx:99`). Nenhum comando nem `followSelection` (`src/editor/store.ts:158`–`:163`) a apaga. Rastreio de código:
   - `selection.select` devolve só `selection` (`src/core/selection/selection.ts:34`), e `page.openProperties` mantém `state.ui` inteiro (`src/editor/inspector/page-properties.ts:27` `ui: withInspectorTab(withInspector(state.ui, true), settingsTab(rules))`) → numa página capturada, depois de escolher um nó capturado e abrir as propriedades da página, `state.selection = [raiz]` e `ui.capturedNode = <nó capturado>` ao mesmo tempo; o canvas desenha as duas seleções (`chrome.tsx:592` lê `capturedNode` sem olhar `selection`) e o inspetor de captura marca o nó capturado.
   - A carga de outro projeto mantém `ui` (`src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY,`) → `capturedNode` sobrevive à troca de projeto.
   - Efeito na tela não medido (Playwright proibido nesta verificação); o estado duplo está confirmado pelo código.
   - `auditoria/estado.md` não registra `capturedNode` (busca sem resultado), embora G6 peça que nenhuma cópia de seleção exista ali.
2. **A prévia guarda uma cópia da seleção em `ui.preview.selection`** (`src/editor/view/preview.ts:13` `ui: { ...state.ui, preview: { selection: state.selection } }`) e a devolve na saída (`preview.ts:21` `selection: held.selection`). Se o documento perder um desses nós durante a prévia, a saída produz uma seleção inválida que `commit` recusa (em produção o estado fica preso na prévia com `status.change.invalid`; em desenvolvimento lança). Não verificado: não achei porta que mude o documento durante a prévia (o teclado usa o contexto `preview`, `src/editor/input/keymap.ts:458`), e sem navegador não dá para confirmar as portas assíncronas (leitura de arquivo que termina durante a prévia).

## G7 — O render incremental é igual ao render do zero; editor e exportação coincidem

- **Veredito:** não confere.

### Provas

**Onde ficam os dois caminhos.** Um só renderizador do canvas, `PageRenderer` (`src/editor/canvas/render/render.ts:241` `export class PageRenderer {`):
- do zero: `src/editor/canvas/render/render.ts:546` `mount(doc: DocumentJson): void {`, chamado ao abrir o quadro e quando o ramo incremental desiste;
- incremental: `src/editor/canvas/render/render.ts:610` `apply(before: DocumentJson, after: DocumentJson, patches: readonly Patch[]): void {`, ligado a cada mudança do documento em `src/editor/canvas/frame.tsx:81` `renderer.apply(change.before, change.after, change.patches);`. O quadro só remonta quando muda o que o efeito lista: `src/editor/canvas/frame.tsx:206` `}, [store, screen, width, page]);`.

**Ramos por tipo de mudança** (`touchOf`, `render.ts:183`–`:210`; `apply`, `render.ts:610`–`:671`):
- texto, atributo, classe, tag, oculto: `{ kind: 'element' }` → só o próprio nó é vestido de novo (`render.ts:658` `if (node) this.redress(node);`); tag nova troca o elemento e mantém os filhos (`render.ts:767`–`:775`).
- estilo: `{ kind: 'styles' }` → `render.ts:667` `if (node) this.writeStyle(node);`.
- inserção, remoção, movimento: `{ kind: 'children' }` → reconciliação por id; o nó movido igual ao que a página mostra mantém o elemento (`render.ts:646` `if (current && deepEqual(current, written)) continue;`).
- troca de página, página inserida antes, árvore substituída, id ou tipo trocado: `render.ts:636` `if (touch.kind === 'page') return this.mount(after);`; a troca da página aberta remonta pelo efeito (`frame.tsx:206`, dependência `page`).
- breakpoint: a tabela do projeto mudada remonta (`render.ts:616` `if (before.breakpoints !== after.breakpoints) return this.mount(after);`); trocar o breakpoint mostrado muda `screen`/`width` e remonta pelo efeito.
- campos de topo: `tokens`, `classes` e `files` reescrevem as folhas próprias (`render.ts:622`–`:626`); **todo outro campo de topo não toca a página**: `render.ts:185` `if (path[0] !== 'pages') return { kind: 'none' };`.

**O teste unitário do renderizador** (`src/editor/canvas/render/render.test.ts`) compara incremental × do zero para estilos, texto, atributos, classes, tag, ordem de filhos, subárvore inserida/removida/substituída, desfazer e páginas. A comparação (`canonical`, `render.test.ts:58`–`:67`) olha só o `<body>` e as folhas `data-node-style`; não olha os atributos do `<html>` nem as outras folhas do `<head>`.

**A conferência e2e** (`tests/e2e/lote-visual.spec.ts`, não rodada: Playwright proibido nesta verificação) roda cada comando desfazível uma vez sobre `aurora`, com a seleção em `n-hero` e os argumentos da porta, e compara o `<body>` do canvas com o de um recarregamento: `tests/e2e/lote-visual.spec.ts:166` `page.frameLocator('.frame__page').locator('body').evaluate((body, marks) => {`. Não olha o `<html>`, e cada comando roda num só estado.

### Achados

Sonda no scratchpad (`render.probe.ts`): monta `before`, aplica os patches por `apply`, monta `after` do zero num documento novo e compara os atributos do `<html>` e o `<body>` serializados. As três entradas abaixo dão documentos válidos (`validação do depois: ok`) e DOMs diferentes.

1. **Idioma do projeto.** `project.setLanguage` grava em `['language']` (`src/core/project/language.ts:19` `const patches = projectLanguagePatches(document, typed, document.codeLanguage ?? DEFAULT_CODE_LANGUAGE).filter((patch) => patch.path[0] !== 'codeLanguage');`; o patch tem `path:[key]`, `src/core/export/authoring.ts:14`). `touchOf` devolve `none` para esse caminho (`render.ts:185`), e o `lang` do `<html>` vem de `src/core/render/output.ts:219` `if (root) page.set('lang', pageLanguage(page.get('lang'), context.language));` com `language: this.doc?.language` (`render.ts:715`). Sonda: incremental `<html lang=en>`, do zero `<html lang=pt-BR>`. Entrada → resultado: trocar o idioma do projeto → o canvas continua no idioma anterior até um remonte; a exportação usa o novo (`src/core/export/export.ts:254` `lang: pageLanguage(page.tree.attributes['pageLanguage' as keyof DocNode['attributes']], document.language),`).
2. **Botão movido para dentro (ou para fora) de um `<form>`.** O `type` de um `<button>` sem tipo próprio depende de estar num formulário: `src/core/export/names.ts:247` `return typeof own === 'string' && ['button', 'submit', 'reset'].includes(own) ? own : inForm || associated ? 'submit' : 'button';`, lido em `dress` por `formNodes(this.doc).has(node.id)` (`render.ts:715`). O movimento mantém o elemento sem vesti-lo de novo (`render.ts:646`). Sonda: incremental `<button data-node=b type=button>`, do zero `type=submit`. Entrada → resultado: arrastar um botão para dentro de um formulário (`element.moveTo` adiciona o nó como está: `src/core/structure/move.ts:122` `patches.push({ op: 'add', path: [...target.path, 'children', start + i], value: at.node });`) → o canvas desenha `type="button"`; a exportação escreve `submit` (`export.ts:292`, o mesmo `elementAttributes` com `inForm`).
3. **Referência cujo alvo muda de `id`.** O canvas escreve um `href="#<nó>"` com o atributo `id` do alvo (`src/core/files/values.ts:41` `if (isReference(name, value)) return resolvedReference(document, value);`; `src/core/elements/references.ts:26` `const id = target.attributes.id;`). `element.setId` só reescreve as referências que guardavam o id antigo como texto (`src/core/elements/attributes.ts:171` `if ((fragment ? reference.value.slice(1) : reference.value) !== old) return [];`); a que guarda o id do nó não recebe patch e o link não é vestido de novo. Sonda: incremental `<a data-node=l href=#topo>`, do zero `href=#inicio`. Entrada → resultado: um link para a seção Hero e mudar o ID HTML do Hero de `topo` para `inicio` → o link do canvas aponta para `#topo`, que não existe mais.
4. **A lista fechada de DCS-002 não cobre o que o renderizador marca.** A lista citada como a de DCS-002 é `EDITOR_ATTRIBUTES` (`src/core/document/validate.ts:519`, 7 nomes), copiada à mão em `tests/e2e/lote-visual.spec.ts:26`. O renderizador põe no canvas, fora dela: `data-embed-frame` (`render.ts:79`), `data-svg-markup` (`render.ts:115`), `data-builder-capture` e `data-capture-class` (`render.ts:735`, `:737`), `sandbox` em todo `<iframe>` (`render.ts:726` `if (tag === 'iframe') wanted.set('sandbox', '');`), `open` em `<details>`/`<dialog>` revelados (`render.ts:727`), o `src` de marcador em `<img>` sem fonte (`render.ts:728`), a retirada de `autoplay` (`render.ts:723` `wanted.delete('autoplay');`), `contenteditable` durante a edição (`render.ts:711`) e os endereços como object URL (`render.ts:267`). `render.ts` não importa nem declara a lista. Pelo critério de DCS-002 (a), canvas e exportação diferem por marcas que nenhuma lista fechada no código declara.
5. **A comparação canvas × exportação não é de DOM.** O teste e2e compara 22 propriedades calculadas por elemento (`tests/e2e/lote-visual.spec.ts:255` `const PROPERTIES = ['display', 'position', ...`), não o DOM menos a lista fechada que DCS-002 (a) define.
6. **O serializador não é o mesmo.** Canvas e exportação compartilham `elementAttributes`, `nodeCss` e `classesCss` (`src/core/export/export.ts:36` `import { classesCss, elementAttributes, fileUrlsIn, mediaQuery, nodeCss, writesNode } from '../render/output.ts';`), mas cada um tem o seu escritor de elementos: o canvas monta DOM com seletores `[data-node]` e uma folha por nó (`render.ts:871`–`:886`); a exportação escreve texto HTML com classes geradas (`export.ts:304` `const block = nodeCss(node, \`.${generated}\`, output, 'block', null, animationListDeclarations(plain));`). O canvas resolve `vh` contra a tela do breakpoint (`render.ts:262`–`:264`); a exportação mantém a unidade.

## G3 — Todas as portas de um comando dão o mesmo resultado no mesmo estado

- **Veredito:** parcial.

### Método

Script no scratchpad (`eps.mjs`) listou, de `manifest/commands/*.json`, os 184 comandos com mais de uma porta e os tipos de cada porta. Em seguida, cada tipo de porta foi rastreado até o `dispatch`, e para os comandos de campo numérico, seleção, inserção, movimento e estilo foi conferido se a porta só envia a intenção.

### Provas — os despachantes genéricos (convergem por construção)

- **Botão, menu, barra, paleta de comandos, menu de contexto, controle de painel** (`useDoor`): `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` e `door.tsx:145` `dispatch(entry.command.id, given);` — os argumentos do manifesto mais o que o controle representa (o nó da linha). Arquivo, área de transferência e pasta são lidos antes e entregues como argumento (`door.tsx:97`–`:150`); nada é calculado.
- **Tecla** (`keymap.ts`): `src/editor/input/keymap.ts:527` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);`; o texto do campo focado entra como o argumento de texto do comando (`keymap.ts:200` `return field !== null && into !== undefined ? { ...own, [into]: field.value } : own;`).
- **Clique no canvas**: `src/editor/input/pointer/press.ts:84` `return entry.door.adapter.selection === 'target' && (press.on === 'node' || press.on === 'captured') ? { ...entry.door.args, target: press.node } : { ...entry.door.args };` — só o alvo da pressão.
- Assim convergem no mesmo tratador, sem decisão na porta: `selection.select` (clique no canvas, linha de Camadas, tecla, paleta), `selection.clear`, `selection.toggle`, `selection.selectAllInContainer`, `element.insert` (clique no ladrilho e Enter/Espaço: o ladrilho entrega o `entry`; o tratador escolhe o lugar), `element.delete`, `element.duplicate`, `element.moveUp`/`moveDown`, `element.wrap*`, `element.unwrap`, `element.promote`, `element.nestIntoPrevious`, `clipboard.*`, `history.undo`/`redo`, `position.align`/`distribute`, `element.swapDirection`, `element.stackOnPhone`, `element.organize`, `style.resetAll`. `element.moveTo` (arraste no canvas, arraste em Camadas, tecla) e o soltar de `element.insert` entregam `parent`/`index` do ponto de soltura (`src/editor/input/pointer/effects.ts:237` `closing?.dispatch(door.command.id, { ...door.door.args, parent: dropped.parent, index: dropped.index } as never);`), e a regra de onde pode ficar está no tratador (`placementRefusal`).

### Provas — o passo do campo numérico (o exemplo da regra)

- O tratador decide: `src/editor/inspector/number-field.ts:83` `const delta = (size === 'page' ? PAGE_STEP : STEP) * factorOf(modifier) * (direction === 'up' ? 1 : -1);` e o ponto de partida de um campo vazio em `startOf` (`number-field.ts:56` `if (value.trim() !== '') return value;`, `:61` `return found === null ? '' : (storedValue(found.node, property, context.rules) ?? context.layout.computed(id as NodeId, property) ?? '');`). O porto de leitura existe no editor: `src/editor/canvas/coordinates.ts:417` `computed(id, property) {`.
- As quatro portas de `field.step` só mandam texto, direção e tecla:
  - roda: `src/editor/shell/field.tsx:133` `(store.dispatch as Dispatch)(door.command.id as CommandId, { ...door.door.args, property, value: element.value, ...(modifier === undefined ? {} : { modifier }) });`
  - botões: `src/editor/shell/field.tsx:324` `(store.dispatch as Dispatch)(entry.command.id, { ...entry.door.args, property, value: input.current?.value ?? '', ...held });`
  - teclas (setas, PageUp/PageDown): `keymap.ts:200` com `value: field.value`; o `modifier` vem de `heldKeyBindingIn`.
- `field.scrub` manda o texto lido na pressão e a distância: `src/editor/input/pointer/common.ts:506` `value: input?.value ?? ''` e `src/editor/input/pointer/panels.ts:137` `{ ...press.entry.door.args, ...press.args, value: press.value, distance: at.x - startX, ... }`.

### Achados — portas que decidem por conta própria

1. **A tecla aplica o passo de `position.move` e de `guides.move`.** `src/editor/input/keymap.ts:274` `return { ...args, ...Object.fromEntries(rule.args.filter((name) => typeof args[name] === 'number').map((name) => [name, (args[name] as number) * step])) };`, com o passo e o passo com Shift lidos na porta (`keymap.ts:238` `[NUDGE_GESTURE]: { step: numberConstant('nudge.step'), shiftStep: numberConstant('nudge.shiftStep'), args: ['dx', 'dy'] },` e `:239` para `guide-keys`). O tratador recebe pixels prontos (`src/core/geometry/position.ts:106` `registerHandler('position.move', (context, { dx, dy }) => {`); o comentário de `src/core/page/guides.ts:6` registra a divisão: `and down, a vertical one left and right; the keymap has made Shift's step the larger one); a locked guide refuses`. É o contrário de `field.step`, onde o passo e o Shift ficam no tratador. Efeito: nenhuma divergência hoje, porque só a tecla manda direção a esses comandos; uma segunda porta de direção (um botão de empurrar) teria de repetir o passo.
2. **As alças do canvas calculam o valor final, arredondam, limitam e aplicam modificadores.**
   - espaçamento: `src/editor/input/pointer/events.ts:296` `const bounded = (value: number) => (ps.spacing?.min === null || ps.spacing === null ? value : Math.max(ps.spacing.min, value));` e `:297` `const value = bounded(Math.round(ps.spacing.start + travel));`; Shift (os quatro lados) e Alt (o lado oposto) são resolvidos na porta em vários `dispatch` (`events.ts:306`–`:317`).
   - sombra: `events.ts:289` arredonda X/Y e limita o desfoque a zero (`Math.max(0, Math.round(ps.spacing.start + dx / ps.spacing.zoom))`).
   - rotação: `events.ts:358` `const angle = event.shiftKey ? Math.round(turned / ROTATE_SNAP) * ROTATE_SNAP : Math.round(turned);`.
   - redimensionar: ímã, proporção, centro e tamanho mínimo na porta (`events.ts:373` `const travel = p.snappedResize(ps.resizing, dx / ps.resizing.zoom, dy / ps.resizing.zoom, event.ctrlKey);`, `:374` `resizedBox(..., RESIZE_MIN)`); arraste livre com ímã na porta (`src/editor/input/pointer/resize.ts:68` `const total = { x: Math.round(travel.x + (snapped?.offset.x ?? 0)), y: Math.round(travel.y + (snapped?.offset.y ?? 0)) };`).
   - guia arrastada: `events.ts:340` `const at = Math.max(0, Math.round(...))`, repetindo o que o tratador já faz (`src/core/page/guides.ts:20` `const place = (at: number) => Math.max(0, Math.round(at));`).
   Para `style.setSpacing`, `style.setRadius`, `style.setBorder`, `style.setShadows` e `style.set` (rotação), a outra porta (campo do inspetor, painel rápido, paleta) manda o texto digitado e o tratador decide; a alça manda um valor já decidido. Divergência de resultado no mesmo estado não confirmada: as intenções diferem (texto × deslocamento do ponteiro), e sem navegador não medi um caso em que a mesma intenção chegue pelas duas.
3. **O interruptor booleano do painel rápido decide o valor e lê o estado de outro jeito que o inspetor.** Painel rápido: `src/editor/canvas/quick-panel.tsx:212` `const on = node.attributes[attribute] === true || node.attributes[attribute] === 'true';` e `quick-panel.tsx:224` `... { ...entry.door.args, target: node.id, [arg]: !on });` — a porta inverte o que leu. Inspetor: `src/editor/shell/inspector-settings.tsx:67` `const on = node.attributes[attribute] === true;` e `:86` manda o estado escolhido (`[filled]: state`). Com o atributo guardado como o texto `'true'`, o painel rápido mostra ligado e manda `false`, e o inspetor mostra desligado. Não verificado se um documento válido chega a guardar `'true'` em texto por algum comando; por arquivo aberto, o validador não o recusa (`src/core/document/validate.ts:247` `if (facts === undefined || typeof value === 'boolean') return null;` não confere o tipo booleano de um texto).
4. **O menu de unidade decide o ponto de partida de um campo vazio.** `src/editor/shell/field.tsx:415` `(store.dispatch as Dispatch)(entry.command.id, { ...entry.door.args, property, value: input.current?.value || shown, unit });` — a porta troca o texto vazio pelo valor mostrado, enquanto em `field.step` essa regra é do tratador (`startOf`). `field.setUnit` tem uma porta só, então não há divergência entre portas; com seleção múltipla de valores diferentes, `shown` é o que o campo mostra e não a regra de `startOf` (`shown.size === 1`), não verificado no navegador.

Relacionado, fora de G3 por ser entre comandos diferentes: o mesmo estado final (vídeo com `controls` dentro de `<a href>`) é recusado por `element.insert` e aceito por `element.setAttribute` (seção INT, achado 2).

## Resumo

| ID | Veredito | Achado principal |
|---|---|---|
| INT — integridade do documento | parcial | Toda escrita passa por `validateDocument` em `commit` e a ida-e-volta deu idêntica nas 48 fixtures, mas o validador não confere aninhamento (`validate.ts:6`): `<li>` em `<div>`, `<a>` em `<a>`, `<form>` em `<form>` abrem por Arquivo › Abrir, e `element.setAttribute controls` põe um vídeo interativo dentro de `<a href>`; a ida-e-volta não tem detector. |
| G6 — seleção na store | parcial | Canvas e Camadas derivam da store; `ui.capturedNode` é uma segunda seleção nunca limpa, que convive com `state.selection` e sobrevive à troca de projeto; `ui.preview.selection` guarda uma cópia (efeito não verificado). |
| G7 — incremental × do zero; editor × exportação | não confere | Três divergências medidas por sonda: idioma do projeto (`<html lang>` velho), botão movido para um `<form>` (`type=button` × `submit`), link cujo alvo muda de `id` (`href` velho); a lista fechada de DCS-002 não cobre as marcas que `render.ts` põe, e a comparação com a exportação é por 22 propriedades calculadas, não por DOM. |
| G3 — portas convergem | parcial | Os despachantes genéricos e as quatro portas de `field.step` só mandam a intenção; a tecla aplica o passo de `position.move` e `guides.move` (`keymap.ts:274`), as alças do canvas calculam, arredondam e limitam o valor, e o interruptor do painel rápido inverte o que leu com uma leitura diferente da do inspetor. |

