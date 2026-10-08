# TRC-animation.setKeyframeEasing
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ readonly animation: string; readonly keyframe: number; readonly easing: string }`; a porta panel-control `timeline-keyframe-easing` não declara argumentos próprios (`manifest/commands/animation.json:381` `          "args": {}`) e o campo do painel acrescenta a animação, o quadro-chave e o texto digitado.
- **Ramos que dependem dos argumentos:** R3 (texto que não é valor da propriedade), R4 (valor igual ao atual)

## Passos
1. `src/app/commands.ts:197` `  'animation.setKeyframeEasing': setKeyframeEasingCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/animation/animation.ts:296` `export const setKeyframeEasingCommand = registerHandler('animation.setKeyframeEasing', (context, { animation, keyframe, easing }): Outcome<never> => {` — o tratador é registrado; o manifesto pede o predicado `always` (`manifest/commands/animation.json:334` `        "predicate": "always",`). [nada muda]
3. `src/core/animation/animation.ts:297` `  const found = targetNode(context);` — resolve o elemento único da seleção. [lê: EST-L01-031 via targetNode] [lê: EST-L01-030 via targetNode]
4. `src/core/animation/animation.ts:298` `  const held = found === null ? null : named(found.node, animation);` — procura a animação pelo nome no nó. [lê: EST-L01-030 via named]
5. `src/core/animation/animation.ts:299` `  if (found === null || held === null) return { kind: 'change' };` — sem elemento ou sem a animação, nada muda (R1). [nada muda]
6. `src/core/animation/animation.ts:300` `  const key = held.keyframes.find((k) => k.offset === keyframe);` — o quadro-chave pelo deslocamento. [lê: EST-L01-030 via handlerContext]
7. `src/core/animation/animation.ts:301` `  if (key === undefined) return { kind: 'change' };` — sem o quadro-chave, nada muda (R2). [nada muda]
8. `src/core/animation/animation.ts:302` `  const property = offeredProperty(EASING_CONTROL);` — a propriedade que o campo oferece (`animation-timing-function`). [nada muda]
9. `src/core/style/set.ts:235` `export function readValue<Ui>(context: HandlerContext<Ui>, property: string, typedText: string): ReadValue | null {` — `readValue` lê o texto pelo código da propriedade (`src/core/animation/animation.ts:304` `  const read = typed === '' || property === null ? null : readValue(context, property, typed);`). [lê: EST-L01-030 via readValue]
10. `src/core/animation/animation.ts:305` `  if (typed !== '' && read === null) return { kind: 'refused', message: message('status.animation.invalidSetting', { setting: { key: 'timeline.setting.timing' }, value: typed }) };` — texto que a propriedade não toma é recusado (R3). [lê: EST-L01-030 via handlerContext]
11. `src/core/animation/animation.ts:306` `  const value = read === null ? '' : read.css;` — o valor guardado é o texto CSS (vazio quando o campo foi esvaziado). [nada muda]
12. `src/core/animation/animation.ts:307` `  if (value === key.easing) return { kind: 'change' };` — valor igual ao atual não é mudança (R4). [nada muda]
13. `src/core/animation/animation.ts:308` `  const locked = lockedRefusal(context, found.node);` — elemento travado, ou dentro de um, recusa (R5). [lê: EST-L01-030 via lockedRefusal]
14. `src/core/animation/animation.ts:310` `  const keyframes = held.keyframes.map((k) => (k.offset === keyframe ? { ...k, easing: value } : k));` — o quadro-chave com a função de temporização nova. [nada muda]
15. `src/core/animation/animation.ts:311` `  return { kind: 'change', patches: writeAnimations(found, replaceAnimation(found.node, animation, { ...held, keyframes })), message: message('status.animation.easingSet', { name: animation, offset: String(keyframe), value: value === '' ? { key: 'timeline.easingDefault' } : value }) };` — o resultado leva a substituição do nó e a mensagem. [escreve: EST-L01-030 via run]
16. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — o `run` da store executa o tratador. [lê: EST-L01-030 via run]
17. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a substituição é aplicada ao documento. [escreve: EST-L01-030 via run]
18. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o comando é desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
19. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit]
20. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit]
21. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish]

## Ramos
- R1: `src/core/animation/animation.ts:299` `  if (found === null || held === null) return { kind: 'change' };` — sem elemento selecionado ou sem a animação: resultado vazio; com ambos segue ao passo 6.
- R2: `src/core/animation/animation.ts:301` `  if (key === undefined) return { kind: 'change' };` — sem o quadro-chave do deslocamento pedido: resultado vazio; com ele segue ao passo 8.
- R3: `src/core/animation/animation.ts:305` `  if (typed !== '' && read === null) return { kind: 'refused', message: message('status.animation.invalidSetting', { setting: { key: 'timeline.setting.timing' }, value: typed }) };` — o texto que a propriedade não toma é recusado (`status.animation.invalidSetting`); um texto vazio ou aceito segue ao passo 11.
- R4: `src/core/animation/animation.ts:307` `  if (value === key.easing) return { kind: 'change' };` — o valor igual ao atual não muda nada; diferente segue ao passo 13.
- R5: `src/core/animation/animation.ts:309` `  if (locked !== null) return { kind: 'refused', message: locked };` — com trava o resultado é a recusa `status.locked.edit`; sem trava segue ao passo 14.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/animation/animation.ts:296`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await, timer nem quadro entre a leitura e a gravação.

## Estado
- Lê: EST-L01-031 (`state.selection`), EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** o quadro-chave do deslocamento pedido passa a guardar a função de temporização nova (ou vazio, quando o campo foi esvaziado); o documento muda (passo 17), o histórico ganha um passo (passo 18) e a mensagem é `status.animation.easingSet` (passo 15).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha o campo de temporização do quadro e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha a folha `@keyframes` com a temporização nova.

## Regras
- G1: n/a — o tratador grava as animações do próprio nó (passo 15), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador recebe `easing` já formado e não lê o rascunho do campo (`src/core/animation/animation.ts:296` `export const setKeyframeEasingCommand = registerHandler('animation.setKeyframeEasing', (context, { animation, keyframe, easing }): Outcome<never> => {`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/animation.json:351` `          "id": "timeline-keyframe-easing",`).
- G4: n/a — o tratador só devolve correções e mensagem (passo 15); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/animation.json:365` `            "region": "dock-timeline",`).
- G6: n/a — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a alteração substitui o nó inteiro (`src/core/animation/animation.ts:215` `  { op: 'replace', path: [...found.path], value: withAnimations(found.node, animations) },`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
