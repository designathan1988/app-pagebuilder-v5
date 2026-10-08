# TRC-selection.marquee

- **Chamada:** `src/app/commands.ts:363` `  'selection.marquee': marqueeCommand,`
- **Argumentos:** o tratador recebe `HandlerContext<never>` e os argumentos `{ rect, mode, leaves, target }`, com `rect` (tipo `rect`), `mode` (enum `replace`/`add`/`toggle`), `leaves` (booleano, opcional) e `target` (tipo `node`, opcional); as duas portas (canvas-drag-empty-area-page-or-container, canvas-drag-shift-on-element) enviam o retângulo medido, o modo, e, quando a tecla de pegar folhas está presa, `leaves`.
- **Ramos que dependem dos argumentos:** R2 (`target` ausente usa o contêiner sob o ponto de partida; presente usa o pai do elemento); R3 (`leaves` verdadeiro troca a regra fina); R4 (`mode` decide o que acontece com a seleção de partida).

## Passos

1. `src/app/commands.ts:363` `  'selection.marquee': marqueeCommand,` — a tabela de comandos liga o comando ao tratador. [nada muda]
2. `src/core/store/store.ts:685` `    dispatch: (id, args, context) => {` — a porta entrega a intenção pela `dispatch` da store.
3. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via dispatch] [lê: EST-L01-031 via dispatch]
4. `src/core/store/store.ts:415` `    const predicate = predicates[command.availability.predicate as keyof PredicateTable<Ui>];` — a disponibilidade é `always`. [lê: EST-L01-030 via run]
5. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o predicado devolve verdadeiro sem ler estado.
6. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
7. `src/core/selection/selection.ts:75` `export const marqueeCommand = registerHandler('selection.marquee', ({ state, layout, rules }, { rect, mode, leaves, target }) => {` — o tratador ligado à store do editor; lê o estado, a porta de desenho do canvas e as regras do modelo.
8. `src/core/selection/selection.ts:77` `  const page = state.document.pages.find((p) => layout.box(p.tree.id) !== null);` — a página que o canvas mostra. [lê: EST-L01-030 via handlerContext]
9. `src/core/selection/selection.ts:78` `  if (!page) return { kind: 'change' };` — R1: nenhuma página desenhada, nada muda.
10. `src/core/selection/selection.ts:80` `  const band: Box = { x: Math.min(rect.x, rect.x + rect.width), y: Math.min(rect.y, rect.y + rect.height), width: Math.abs(rect.width), height: Math.abs(rect.height) };` — a faixa normalizada a partir do ponto de partida.
11. `src/core/selection/selection.ts:83` `  if (target === undefined) {` — R2: a porta da área vazia não manda alvo. [lê: EST-L01-030 via handlerContext]
12. `src/core/selection/selection.ts:86` `      const inner: DocNode | undefined = [...scope.children].reverse().find((child) => {` — R2: desce ao nó mais fundo que contém o ponto de partida.
13. `src/core/selection/selection.ts:95` `    const found = locate(state.document, target);` — R2: a porta com Shift manda o alvo. [lê: EST-L01-030 via locate]
14. `src/core/selection/selection.ts:96` `    if (found === null) throw new Error(`selection.marquee: the document has no node ${target}`);` — o alvo tem de existir no documento.
15. `src/core/selection/selection.ts:97` `    scope = found.parent ?? found.node;` — R2: a faixa trabalha sobre os irmãos do elemento.
16. `src/core/selection/selection.ts:102` `  const leftOut = (node: DocNode) => node.hidden === true || lockOver(state.document, node.id) !== null;` — R5: oculto ou bloqueado nunca é tomado. [lê: EST-L01-030 via lockOver]
17. `src/core/selection/selection.ts:103` `  if (leaves === true) {` — R3: a regra fina das folhas.
18. `src/core/selection/selection.ts:107` `      if (box !== null && (container ? holds(band, box) : touches(band, box))) {` — R3: folha que a faixa toca, contêiner só quando a faixa o contém.
19. `src/core/selection/selection.ts:117` `    scope.children.forEach((child) => {` — a regra grossa: cada filho direto do contêiner.
20. `src/core/selection/selection.ts:119` `      if (box === null || !touches(band, box)) return;` — só o que a faixa toca.
21. `src/core/selection/selection.ts:120` `      if (leftOut(child)) skipped += 1;` — o que ficou de fora é contado. [escreve: EST-L01-031 via run]
22. `src/core/selection/selection.ts:121` `      else taken.push(child);` — o tomado entra na lista. [escreve: EST-L01-031 via run]
23. `src/core/selection/selection.ts:125` `  const base = state.selection;` — a seleção de partida. [lê: EST-L01-031 via handlerContext]
24. `src/core/selection/selection.ts:127` `    mode === 'replace'` — R4: `replace` toma só o que a faixa pegou.
25. `src/core/selection/selection.ts:130` `        ? [...base, ...took.filter((id) => !base.includes(id))]` — R4: `add` põe a seleção primeiro, depois o que a faixa tomou.
26. `src/core/selection/selection.ts:131` `        : [...base.filter((id) => !took.includes(id)), ...took.filter((id) => !base.includes(id))];` — R4: `toggle` alterna.
27. `src/core/selection/selection.ts:134` `  if (skipped > 0) return { kind: 'change', selection, message: message('status.selection.skipped', { count: selection.length, skipped }) };` — R6: com bloqueados ou ocultos a barra conta.
28. `src/core/selection/selection.ts:135` `  return several(state, selection);` — R6: a barra nomeia um, conta vários ou diz que nada resta. [escreve: EST-L01-031 via several] [escreve: EST-L01-033 via several]
29. `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — [lê: EST-L01-031 via run]
30. `src/core/store/store.ts:537` `      selection,` — [escreve: EST-L01-031 via run]
31. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
32. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
33. `src/core/store/store.ts:320` `    state = next;` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
34. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-031 via publish]

## Ramos

- R1 `src/core/selection/selection.ts:78` `  if (!page) return { kind: 'change' };` — nenhuma página com caixa: o passo 9 devolve um `change` sem seleção nem mensagem; com página: segue para o passo 10.
- R2 `src/core/selection/selection.ts:83` `  if (target === undefined) {` — sem alvo (porta da área vazia): o contêiner é o nó mais fundo que contém o ponto de partida (passo 12); com alvo (porta com Shift): o contêiner é o pai do elemento (passo 15), e o alvo ausente do documento lança em `src/core/selection/selection.ts:96` `    if (found === null) throw new Error(`selection.marquee: the document has no node ${target}`);`, que o `run` apanha em `src/core/store/store.ts:435` `    } catch (error) {`.
- R3 `src/core/selection/selection.ts:103` `  if (leaves === true) {` — com `leaves`: a regra fina do passo 18 (folha que toca, contêiner que contém); sem `leaves`: a regra grossa do passo 19 (cada filho que a faixa toca).
- R4 `src/core/selection/selection.ts:127` `    mode === 'replace'` — `replace` substitui, `add` estende com a seleção primeiro (passo 25), `toggle` alterna (passo 26).
- R5 `src/core/selection/selection.ts:102` `  const leftOut = (node: DocNode) => node.hidden === true || lockOver(state.document, node.id) !== null;` — nó oculto, bloqueado ou dentro de um bloqueado nunca é tomado; o passo 21 conta os que a faixa atingiu.
- R6 `src/core/selection/selection.ts:134` `  if (skipped > 0) return { kind: 'change', selection, message: message('status.selection.skipped', { count: selection.length, skipped }) };` — com algo deixado de fora a barra conta; sem nada, o passo 28 nomeia ou conta.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/selection/selection.ts:75` `export const marqueeCommand = registerHandler('selection.marquee', ({ state, layout, rules }, { rect, mode, leaves, target }) => {`, sem `await`); o retângulo medido chega pronto na porta (`src/editor/input/pointer/drag.ts:36`).

## Estado

- lê: EST-L01-030 (o documento, via locate, lockOver, handlerContext, dispatch), EST-L01-031 (a seleção, via handlerContext, dispatch)
- escreve: EST-L01-031 (a seleção, via several, run, publish), EST-L01-033 (a mensagem, via several, run, publish)

## Resultado

- **Estado final:** EST-L01-031 — a seleção é o modo aplicado ao que a faixa tocou (`src/core/selection/selection.ts:131` `        : [...base.filter((id) => !took.includes(id)), ...took.filter((id) => !base.includes(id))];`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:767` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** as linhas tomadas em Camadas ficam realçadas (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** cada nó tomado ganha o próprio contorno e a faixa some ao findar o arraste (`src/editor/canvas/chrome.tsx:1044` `  const selection = useEditorState((s) => s.selection);`).

## Regras

- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:131` `        : [...base.filter((id) => !took.includes(id)), ...took.filter((id) => !base.includes(id))];`).
- G2: ok `src/editor/input/pending.ts:82` `  keepTyping();` — a digitação pendente é gravada antes (`src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);`).
- G3: ok `src/app/commands.ts:363` `  'selection.marquee': marqueeCommand,` — as duas portas convergem neste tratador e enviam só o retângulo e o modo (`src/editor/input/pointer/drag.ts:36` `shared.open.dispatch(ps.marquee.entry.command.id as CommandId, { ...argsFor(ps.marquee.entry, ps.marquee.press, NOT_PICKING), rect, mode: ps.marquee.mode, ...(leavesNow(altHeld) ? { leaves: true } : {}) } as never);`).
- G4: n/a — o comando muda a seleção; a faixa é do desenho do canvas, não do trecho (`src/core/selection/selection.ts:131`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:131`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/selection/selection.ts:75`).

## Medições

- nenhuma
