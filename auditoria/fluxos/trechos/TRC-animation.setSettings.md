# TRC-animation.setSettings
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ readonly animation: string; readonly setting: "duration" | "delay" | "iterations" | "direction" | "fill" | "timing" | "play-state"; readonly value: string }`; as sete portas panel-control `setting-*` declaram cada uma o seu `setting` (`manifest/commands/animation.json:545` `            "setting": "duration"`, e as demais) e o painel acrescenta a animação mostrada e o texto digitado (`value`).
- **Ramos que dependem dos argumentos:** R2 (setting sem porta), R3 (texto que não é valor da propriedade), R4 (valor igual ao atual)

## Passos
1. `src/app/commands.ts:199` `  'animation.setSettings': setAnimationSettingsCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/animation/animation.ts:332` `export const setAnimationSettingsCommand = registerHandler('animation.setSettings', (context, { animation, setting, value }): Outcome<never> => {` — o tratador é registrado; o manifesto pede o predicado `always` (`manifest/commands/animation.json:497` `        "predicate": "always",`). [nada muda]
3. `src/core/animation/animation.ts:333` `  const found = targetNode(context);` — resolve o elemento único da seleção. [lê: EST-L01-031 via targetNode] [lê: EST-L01-030 via targetNode]
4. `src/core/animation/animation.ts:334` `  const held = found === null ? null : named(found.node, animation);` — procura a animação pelo nome no nó. [lê: EST-L01-030 via named]
5. `src/core/animation/animation.ts:335` `  if (found === null || held === null) return { kind: 'change' };` — sem elemento ou sem a animação, nada muda (R1). [nada muda]
6. `src/core/animation/animation.ts:336` `  const property = settingProperty(setting);` — a propriedade CSS que o ajuste escreve, pela porta que o desenha; `settingProperty` está em `src/core/animation/animation.ts:50` `export function settingProperty(setting: string): string | null {`. [nada muda]
7. `src/core/animation/animation.ts:337` `  if (property === null || !(SETTINGS as readonly string[]).includes(setting)) return { kind: 'refused', message: message('status.animation.invalidSetting', { setting: setting as MessageId, value }) };` — ajuste sem porta é recusado (R2); `SETTINGS` é a lista do manifesto (`src/core/animation/animation.ts:46` `export const SETTINGS: readonly string[] = SETTING_DOORS.map(({ setting }) => setting);`). [lê: EST-L01-030 via handlerContext]
8. `src/core/style/set.ts:235` `export function readValue<Ui>(context: HandlerContext<Ui>, property: string, typedText: string): ReadValue | null {` — `readValue` lê o texto pelo código da propriedade (`src/core/animation/animation.ts:338` `  const read = readValue(context, property, value);`). [lê: EST-L01-030 via readValue]
9. `src/core/animation/animation.ts:339` `  if (read === null) return { kind: 'refused', message: message('status.animation.invalidSetting', { setting: { key: settingLabel(setting) }, value: value.trim() }) };` — texto que a propriedade não toma é recusado (R3). [lê: EST-L01-030 via handlerContext]
10. `src/core/animation/animation.ts:340` `  if (held.settings[setting] === read.css) return { kind: 'change' };` — valor igual ao atual não é mudança (R4). [lê: EST-L01-030 via handlerContext]
11. `src/core/animation/animation.ts:341` `  const locked = lockedRefusal(context, found.node);` — elemento travado, ou dentro de um, recusa (R5). [lê: EST-L01-030 via lockedRefusal]
12. `src/core/animation/animation.ts:343` `  const next: Animation = { ...held, settings: { ...held.settings, [setting]: read.css } };` — a animação com o ajuste novo. [nada muda]
13. `src/core/animation/animation.ts:344` `  return { kind: 'change', patches: writeAnimations(found, replaceAnimation(found.node, animation, next)), message: message('status.animation.settingSet', { setting: { key: settingLabel(setting) }, name: animation, value: read.css }) };` — o resultado leva a substituição do nó e a mensagem. [escreve: EST-L01-030 via run]
14. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — o `run` da store executa o tratador. [lê: EST-L01-030 via run]
15. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a substituição é aplicada ao documento. [escreve: EST-L01-030 via run]
16. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o comando é desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
17. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit]
18. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit]
19. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish]

## Ramos
- R1: `src/core/animation/animation.ts:335` `  if (found === null || held === null) return { kind: 'change' };` — sem elemento selecionado ou sem a animação: resultado vazio; com ambos segue ao passo 6.
- R2: `src/core/animation/animation.ts:337` `  if (property === null || !(SETTINGS as readonly string[]).includes(setting)) return { kind: 'refused', message: message('status.animation.invalidSetting', { setting: setting as MessageId, value }) };` — um `setting` que nenhuma porta desenha é recusado (`status.animation.invalidSetting`); um ajuste do manifesto segue ao passo 8.
- R3: `src/core/animation/animation.ts:339` `  if (read === null) return { kind: 'refused', message: message('status.animation.invalidSetting', { setting: { key: settingLabel(setting) }, value: value.trim() }) };` — o texto que a propriedade não toma é recusado; um texto aceito segue ao passo 10.
- R4: `src/core/animation/animation.ts:340` `  if (held.settings[setting] === read.css) return { kind: 'change' };` — o valor igual ao atual não muda nada; diferente segue ao passo 11.
- R5: `src/core/animation/animation.ts:342` `  if (locked !== null) return { kind: 'refused', message: locked };` — com trava o resultado é a recusa `status.locked.edit`; sem trava segue ao passo 12.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/animation/animation.ts:332`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; os despachos em `src/editor/doors/door.tsx:144` não interpõem await, timer nem quadro entre a leitura e a gravação.

## Estado
- Lê: EST-L01-031 (`state.selection`), EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** o ajuste `setting` da animação passa a guardar `read.css`; o documento muda (passo 15), o histórico ganha um passo (passo 16) e a mensagem é `status.animation.settingSet` (passo 13).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha o campo do ajuste e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha a lista de propriedades da animação do nó.

## Regras
- G1: n/a — o tratador grava as animações do próprio nó (passo 13), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador recebe `value` já formado e não lê o rascunho do campo (`src/core/animation/animation.ts:332` `export const setAnimationSettingsCommand = registerHandler('animation.setSettings', (context, { animation, setting, value }): Outcome<never> => {`).
- G3: ok — as sete portas de `animation.setSettings` chegam ao mesmo tratador (`src/app/commands.ts:199` `  'animation.setSettings': setAnimationSettingsCommand,`), cada uma com o seu `setting` declarado na porta (`manifest/commands/animation.json:545` `            "setting": "duration"`) e o mesmo caminho de leitura e gravação.
- G4: n/a — o tratador só devolve correções e mensagem (passo 13); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; as portas vivem na colocação do painel (`manifest/commands/animation.json:528` `            "region": "dock-timeline",`).
- G6: n/a — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a alteração substitui o nó inteiro (`src/core/animation/animation.ts:215` `  { op: 'replace', path: [...found.path], value: withAnimations(found.node, animations) },`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
