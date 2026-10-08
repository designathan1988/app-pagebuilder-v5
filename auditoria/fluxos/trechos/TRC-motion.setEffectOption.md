# TRC-motion.setEffectOption
- **Chamada:** `src/app/commands.ts:273` `'motion.setEffectOption': setEffectOptionCommand,`
- **Argumentos:** `{ readonly timeline?: string; readonly action?: string; readonly at?: number; readonly option?: string; readonly value?: unknown }`; `timeline` é a timeline, `action`/`at` a ação por id ou lugar, `option` a opção do efeito e `value` o que o campo entrega. A porta panel-control `timeline-motion-effect-option` não declara argumento próprio (`manifest/commands/motion.json:1682` `"id": "timeline-motion-effect-option",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (`action`/`at`), R3 (`option`), R4 (`option`/`value`)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:1662` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:437` `export const setEffectOptionCommand = registerHandler('motion.setEffectOption', (context, { timeline, action, at, option, value }): Outcome<never> => {` — o tratador recebe os cinco campos.
4. `src/core/motion/commands.ts:438` `  const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
5. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
6. `src/core/motion/commands.ts:439` `  if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
7. `src/core/motion/commands.ts:440` `  const held = actionOf(found.timeline, action, at);` — a ação pelo id, senão pelo lugar. [lê: EST-L01-030 via actionOf]
8. `src/core/motion/commands.ts:441` `  if (held === null) return { kind: 'change' };` — ação não encontrada: alteração vazia (R2). [nada muda]
9. `src/core/motion/commands.ts:442` `  if (!(option in held.effect) && !OPTIONAL_OPTIONS.has(option)) return { kind: 'refused', message: message('status.motion.notAnOption', { name: { key: effectLabel(held.effect.kind) } }) };` — opção que o efeito não tem recusa `status.motion.notAnOption` (R3). [nada muda]
10. `src/core/motion/commands.ts:444` `  if (EFFECT_BOOLEANS.has(option)) read = readBoolean(value);` — uma opção booleana é lida como booleana; as demais pelos caminhos seguintes (R4).
11. `src/core/motion/commands.ts:445` `  else if (isNumber(held.effect, option)) read = value === '' ? undefined : readNumber(value);` — uma opção numérica é lida como número; vazia a tira.
12. `src/core/motion/commands.ts:450` `  if (read === null && option !== 'value') return invalid(value);` — opção ilegível vira `status.motion.invalid` (R4).
13. `src/core/motion/commands.ts:452` `  const effect: Record<string, unknown> = read === undefined ? Object.fromEntries(Object.entries(held.effect).filter(([name]) => name !== option)) : { ...held.effect, [option]: read };` — o efeito sem a opção, ou com ela escrita. [nada muda]
14. `src/core/motion/commands.ts:455` `    if (effect.timeline === found.timeline.name || findTimeline(context.state.document, effect.timeline) === null) return { kind: 'refused', message: message('status.motion.notFound', { name: effect.timeline }) };` — um efeito `timeline` que controla a si mesmo, ou um nome que o projeto não tem, recusa. [lê: EST-L01-030 via findTimeline]
15. `src/core/motion/commands.ts:460` `    if (!address.ok) return { kind: 'refused', message: address.refusal };` — um endereço de efeito `navigate` que não passa na regra de endereço recusa (R5).
16. `src/core/elements/address.ts:44` `export function readAddress(typed: string): Address {` — a regra única de endereço.
17. `src/core/motion/commands.ts:464` `  if (effect.kind === 'navigate' && (effect.to === 'back' || effect.to === 'forward')) delete effect.address;` — ir para trás ou à frente não nomeia endereço; as demais normalizações seguem (`src/core/motion/commands.ts:468` `  if (effect.kind === 'slide' && effect.operation !== 'go') delete effect.index;`).
18. `src/core/motion/commands.ts:470` `  const next: TimelineAction = { ...held, effect: effect as unknown as Effect };` — a ação com o efeito novo. [nada muda]
19. `src/core/motion/commands.ts:471` `  if (JSON.stringify(next) === JSON.stringify(held)) return { kind: 'change' };` — valor que não muda o efeito: alteração vazia (R5). [nada muda]
20. `src/core/motion/commands.ts:472` `  return commitTimeline(found.index, replaceAction(found.timeline, held.id, () => next), message('status.motion.actionUpdated', { name: { key: effectLabel(held.effect.kind) }, timeline: found.timeline.name }), value);` — a timeline inteira é lida e a ação trocada. [escreve: EST-L01-030 via run]
21. `src/core/motion/timeline.ts:46` `export function replaceAction(timeline: MotionTimeline, id: string, change: (action: TimelineAction) => TimelineAction): MotionTimeline {` — troca só a ação do id. [lê: EST-L01-030 via replaceAction]
22. `src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };` — a correção substitui a timeline no índice. [escreve: EST-L01-030 via run]
23. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
24. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
25. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
26. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
27. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:439` `  if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 7.
- R2: `src/core/motion/commands.ts:441` `  if (held === null) return { kind: 'change' };` — `action`/`at` que não nomeiam ação: nada muda; nomeada segue ao passo 9.
- R3: `src/core/motion/commands.ts:442` `  if (!(option in held.effect) && !OPTIONAL_OPTIONS.has(option)) return { kind: 'refused', message: message('status.motion.notAnOption', { name: { key: effectLabel(held.effect.kind) } }) };` — `option` que o efeito não tem recusa `status.motion.notAnOption`; reconhecida (fixa ou opcional, `src/core/motion/commands.ts:476` `const OPTIONAL_OPTIONS = new Set(['time', 'index', 'address', 'text', 'detail', 'from', 'to']);`) segue ao passo 10.
- R4: `src/core/motion/commands.ts:450` `  if (read === null && option !== 'value') return invalid(value);` — `value` que a opção não lê vira `status.motion.invalid`; legível segue ao passo 13.
- R5: `src/core/motion/commands.ts:471` `  if (JSON.stringify(next) === JSON.stringify(held)) return { kind: 'change' };` — valor que não muda o efeito: nada muda; mudado segue ao passo 20.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:437`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** uma opção do efeito da ação muda (ou sai); o documento muda (passo 23), o histórico ganha um passo (passo 24) e a mensagem é `status.motion.actionUpdated` (passo 20).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha o campo da opção e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:472`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador lê o argumento `value` do campo, não o rascunho pendente (`src/core/motion/commands.ts:437`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:1682` `"id": "timeline-motion-effect-option",`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:472`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:1682` `"id": "timeline-motion-effect-option",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
