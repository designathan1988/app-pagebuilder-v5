# ENT-P-workspace-0096 — inspector.reveal pela porta inspector.reveal#canvas-double-click-form-control

- **Tipo:** comando-porta canvas-click `manifest/commands/workspace.json:3032` `"kind": "canvas-click",`
- **Porta:** `manifest/commands/workspace.json:3031` `"id": "canvas-double-click-form-control",`
- **Gatilho:** `manifest/commands/workspace.json:3038` `"gesture": "canvas-click",`
- **Tratador:** `src/app/commands.ts:504` `'inspector.reveal': revealField,`
- **Início:** `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`

## Passos
1. `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();` — o toque abre um gesto da store do editor [escreve: EST-L05a-019 via store.gesture]
2. `src/editor/input/pointer/effects.ts:47` `const entry = clickDoor(press, ps.buttons.button, ps.buttons.count, clickModifier, p.factsOf(press), picking);` — o toque resolve a porta do controle sob o ponteiro
3. `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);` — o toque roda a porta dentro do gesto
4. `src/editor/store.ts:210` `dispatch: (id, args) => gesture.dispatch(id, args),` — o gesto do editor leva a intenção ao gesto do núcleo
5. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto executa o tratador
6. `src/app/commands.ts:504` `'inspector.reveal': revealField,` — a tabela liga o id ao tratador; o trecho TRC-inspector.reveal começa aqui

## Ramos
- R1 `src/editor/inspector/sections.ts:314` `if (field === undefined) return { kind: 'change' };` — sem `property` nem `attribute`: mudança vazia; com um deles, segue.
- R2 `src/editor/inspector/sections.ts:315` `const shown = withInspectorTab(withInspector(state.ui, true), attribute !== undefined ? SETTINGS_TAB : STYLE_TAB);` — com `attribute`: a aba Configurações mostra o campo; sem ele: a aba Estilo mostra o da propriedade.

## Fronteiras assíncronas
- a porta roda no toque, um ouvinte do dono do ponteiro `src/editor/input/pointer.ts:204` `target.addEventListener('pointerdown', p.onDown, true);` (e, no duplo, `src/editor/input/pointer.ts:205` `target.addEventListener('dblclick', p.onDoubleClick, true);`); a porta roda dentro do gesto aberto no próprio toque.

## Estado
- lê: EST-L01-037 (`ui.revealed`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.panels`, `ui.layout.inspectorTab`, `ui.revealed`).
- o dono do ponteiro: EST-L05a-019 (`open`, o gesto aberto da store) — escrito ao abrir o gesto `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();`.

## Resultado
- **Estado final:** EST-L01-037 com o inspector aberto, a aba certa escolhida e `ui.revealed` com o campo e a contagem nova (`src/editor/inspector/sections.ts:316`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o inspector.
- **DOM do editor:** a coluna do inspector aparece na aba certa, com o campo revelado em vista (`src/editor/inspector/sections.ts:315`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/inspector/sections.ts:316`).
- G2: ok `src/editor/store.ts:205` `keepTyping();` — a digitação pendente é gravada quando o gesto do editor abre.
- G3: ok `src/editor/inspector/sections.ts:312` `export const revealField = registerHandler<'inspector.reveal', EditorUi>('inspector.reveal', ({ state }, { property, attribute }) => {` — as portas (o item Adicionar propriedade, a barra de comandos, o duplo clique num controle do canvas) chegam ao mesmo tratador com só `property` ou `attribute`.
- G4: n/a — o comando muda estado; a coluna do inspector ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/inspector/sections.ts:315`).
- G5: n/a — o encaixe do campo revelado é medido na Fase 6 (`src/editor/inspector/sections.ts:315`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/inspector/sections.ts:316`).

## Limpeza
- o ouvinte do dono do ponteiro é removido em `src/editor/input/pointer.ts:237` `target.removeEventListener('pointerup', p.onUp, true);`; o trecho não cria outro ouvinte, temporizador nem observador.

## Medições
- a medir na Fase 6: a ordem de foco ao revelar um campo (o campo revelado toma o foco depois de o inspector desenhar), que só o navegador calcula, nas duas telas.

## Ramos do trecho
- **Trecho:** TRC-inspector.reveal
- **Argumentos enviados:** o manifesto declara `attribute` `value`
- R1 `src/editor/inspector/sections.ts:314` `if (field === undefined) return { kind: 'change' };` — esta porta envia `attribute` (e não `property`): um campo a mostrar existe, o caminho segue.
- R2 `src/editor/inspector/sections.ts:315` `const shown = withInspectorTab(withInspector(state.ui, true), attribute !== undefined ? SETTINGS_TAB : STYLE_TAB);` — esta porta envia `attribute` `value`: o caminho revela o campo na aba Configurações.
