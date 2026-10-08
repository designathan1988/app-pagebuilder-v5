# TRC-motion.deleteKeyframes
- **Chamada:** `src/app/commands.ts:288` `'motion.deleteKeyframes': deleteKeyframesCommand,`
- **Argumentos:** `{ readonly timeline?: string; readonly keyframes?: readonly KeyframeRef[]; readonly at?: number; readonly property?: string; readonly keyframeAt?: number }`; `timeline` é a timeline e `keyframes` (ou `at`/`property`/`keyframeAt`) nomeia os quadros-chave. A porta panel-control `timeline-motion-keyframes-delete` não declara argumento próprio (`manifest/commands/motion.json:2970` `"id": "timeline-motion-keyframes-delete",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (`keyframes`/`at`/`property`/`keyframeAt`)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:2954` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:642` `export const deleteKeyframesCommand = registerHandler('motion.deleteKeyframes', (context, { timeline, keyframes, at, property, keyframeAt }): Outcome<never> => {` — o tratador recebe os cinco campos.
4. `src/core/motion/commands.ts:643` `  const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
5. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
6. `src/core/motion/commands.ts:644` `  if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
7. `src/core/motion/commands.ts:645` `  const refs = keyframeRefs(found.timeline, { keyframes, at, property, keyframeAt });` — os quadros-chave pela lista, senão pelo lugar. [lê: EST-L01-030 via keyframeRefs]
8. `src/core/motion/commands.ts:543` `function keyframeRefs(timeline: MotionTimeline, given: { readonly keyframes?: unknown; readonly at?: number | undefined; readonly property?: string | undefined; readonly keyframeAt?: number | undefined }): KeyframeRef[] | null {` — a lista de referências, senão a do lugar. [lê: EST-L01-030 via keyframeRefs]
9. `src/core/motion/commands.ts:646` `  if (refs === null || refs.length === 0) return { kind: 'change' };` — sem quadros-chave nomeados: alteração vazia (R2). [nada muda]
10. `src/core/motion/commands.ts:647` `  const next = deleteKeyframes(found.timeline, refs);` — a timeline sem os quadros-chave. [escreve: EST-L01-030 via run]
11. `src/core/motion/timeline.ts:211` `export function deleteKeyframes(timeline: MotionTimeline, refs: readonly KeyframeRef[]): MotionTimeline {` — tira os quadros-chave; uma trilha que fica sem nenhum sai. [lê: EST-L01-030 via deleteKeyframes]
12. `src/core/motion/commands.ts:648` `  return commitTimeline(found.index, next, message('status.motion.keyframesDeleted', { timeline: found.timeline.name }));` — a timeline inteira é lida antes de virar correção. [escreve: EST-L01-030 via run]
13. `src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };` — a correção substitui a timeline no índice. [escreve: EST-L01-030 via run]
14. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
15. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
16. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
17. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
18. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:644` `  if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 7.
- R2: `src/core/motion/commands.ts:646` `  if (refs === null || refs.length === 0) return { kind: 'change' };` — sem `keyframes` válidas nem `at`/`property`/`keyframeAt` que nomeiem quadro-chave: nada muda; nomeados seguem ao passo 10.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:642`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:172` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** a timeline perde os quadros-chave nomeados; o documento muda (passo 14), o histórico ganha um passo (passo 15) e a mensagem é `status.motion.keyframesDeleted` (passo 12).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha as trilhas sem os quadros-chave e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:648`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/motion/commands.ts:642`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:2970` `"id": "timeline-motion-keyframes-delete",`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:648`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:2970` `"id": "timeline-motion-keyframes-delete",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
