# TRC-motion.copyKeyframes
- **Chamada:** `src/app/commands.ts:289` `'motion.copyKeyframes': copyMotionKeyframesCommand,`
- **Argumentos:** `{}` — a porta panel-control `timeline-motion-keyframes-copy` não declara argumento (`manifest/commands/motion.json:3016` `"id": "timeline-motion-keyframes-copy",`) e o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:3004` `"predicate": "always",`), que não barra nada.
3. `src/editor/motion/state.ts:151` `export const copyMotionKeyframesCommand = registerHandler<'motion.copyKeyframes', EditorUi>('motion.copyKeyframes', ({ state }) => {` — o tratador recebe só o contexto. O histórico não é desfazível (`manifest/commands/motion.json:3012` `        "undoable": false`).
4. `src/editor/motion/state.ts:152` `  const motion = motionUiOf(state.ui);` — o estado do painel. [lê: EST-L08-019 via motionUiOf]
5. `src/editor/motion/state.ts:153` `  const name = shownTimeline(state);` — a timeline mostrada pelo painel. [lê: EST-L01-030 via shownTimeline] [lê: EST-L01-031 via shownTimeline] [lê: EST-L01-037 via shownTimeline]
6. `src/editor/motion/state.ts:47` `export function shownTimeline(state: StoreState<EditorUi>): string | null {` — a timeline nomeada, ou a primeira que o elemento toca, ou a primeira do projeto.
7. `src/editor/motion/state.ts:154` `  const found = name === null ? null : findTimeline(state.document, name);` — a timeline do documento. [lê: EST-L01-030 via findTimeline]
8. `src/editor/motion/state.ts:155` `  if (found === null || (motion.selectedKeyframes ?? []).length === 0) return { kind: 'refused', message: message('status.motion.nothingSelected') };` — sem timeline ou sem quadro-chave selecionado recusa `status.motion.nothingSelected` (R1). [nada muda]
9. `src/editor/motion/state.ts:156` `  const clipboard = copyKeyframes(found.timeline, motion.selectedKeyframes ?? []);` — os quadros-chave copiados, cada um com a propriedade, o intervalo, o valor e a aceleração. [lê: EST-L01-030 via copyKeyframes]
10. `src/core/motion/timeline.ts:233` `export function copyKeyframes(timeline: MotionTimeline, refs: readonly KeyframeRef[]): CopiedKeyframe[] {` — percorre as trilhas e guarda cada quadro-chave escolhido, com o intervalo desde o mais cedo. [lê: EST-L01-030 via copyKeyframes]
11. `src/editor/motion/state.ts:157` `  return { kind: 'change', ui: withMotion(state.ui, { ...motion, clipboard }), message: message('status.motion.copied', { count: clipboard.length }) };` — o resultado guarda os quadros-chave na área de transferência do painel e conta-os. [escreve: EST-L08-019 via withMotion]
12. `src/editor/motion/state.ts:42` `const withMotion = (ui: EditorUi, motion: MotionUiState): EditorUi => ({ ...ui, motion });` — o `ui` novo com o campo `motion` trocado.
13. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — o `ui` do resultado passa ao estado. [escreve: EST-L01-037 via run]
14. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo conta como mudança. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run] [lê: EST-L01-033 via run] [lê: EST-L01-037 via run]
15. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
16. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/editor/motion/state.ts:155` `  if (found === null || (motion.selectedKeyframes ?? []).length === 0) return { kind: 'refused', message: message('status.motion.nothingSelected') };` — sem timeline mostrada ou sem quadro-chave selecionado recusa `status.motion.nothingSelected`; com os dois segue ao passo 9.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/motion/state.ts:151`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o clique da porta panel-control (`src/editor/shell/panel-field.tsx:172` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L08-019 (`ui.motion.selectedKeyframes`).
- Escreve: EST-L08-019 (`ui.motion.clipboard`), EST-L01-037 (`state.ui`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** `ui.motion.clipboard` passa a `clipboard`; a mensagem é `status.motion.copied` com a contagem (passo 11).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`); os assinantes de documento não, porque o documento não mudou (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel passa a habilitar a cola.
- **DOM do canvas:** nada muda — o tratador não devolve correção (`src/editor/motion/state.ts:157`).

## Regras
- G1: n/a — o tratador guarda quadros-chave na área de transferência do painel (`src/editor/motion/state.ts:157`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/editor/motion/state.ts:151`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:3016` `"id": "timeline-motion-keyframes-copy",`).
- G4: n/a — o tratador só devolve o `ui` e a mensagem (`src/editor/motion/state.ts:157`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:3016` `"id": "timeline-motion-keyframes-copy",`).
- G6: ok — a seleção de elementos não muda (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o resultado não traz correção, então o documento do canvas não muda (`src/editor/motion/state.ts:157`).
- INT: n/a — o trecho não escreve no documento; devolve só o estado do editor (`src/editor/motion/state.ts:157`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
