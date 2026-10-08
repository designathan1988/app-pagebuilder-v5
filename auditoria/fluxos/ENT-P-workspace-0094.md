# ENT-P-workspace-0094 — inspector.reveal pela porta inspector.reveal#inspector-add-property-item

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2985` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:2984` `"id": "inspector-add-property-item",`
- **Tratador:** `src/app/commands.ts:504` `'inspector.reveal': revealField,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:92` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:504` `'inspector.reveal': revealField,` — a tabela liga o id ao tratador; o trecho TRC-inspector.reveal começa aqui

## Ramos
- R1 `src/editor/inspector/sections.ts:314` `if (field === undefined) return { kind: 'change' };` — sem `property` nem `attribute`: mudança vazia; com um deles, segue.
- R2 `src/editor/inspector/sections.ts:315` `const shown = withInspectorTab(withInspector(state.ui, true), attribute !== undefined ? SETTINGS_TAB : STYLE_TAB);` — com `attribute`: a aba Configurações mostra o campo; sem ele: a aba Estilo mostra o da propriedade.

## Fronteiras assíncronas
- o campo revelado toma o foco depois de o inspector desenhar; esse pedido é atendido fora do trecho (o contador em `ui.revealed`), num efeito do painel cujo instante só o navegador calcula.

## Estado
- lê: EST-L01-037 (`ui.revealed`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.panels`, `ui.layout.inspectorTab`, `ui.revealed`).

## Resultado
- **Estado final:** EST-L01-037 com o inspector aberto, a aba certa escolhida e `ui.revealed` com o campo e a contagem nova (`src/editor/inspector/sections.ts:316`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o inspector.
- **DOM do editor:** a coluna do inspector aparece na aba certa, com o campo revelado em vista (`src/editor/inspector/sections.ts:315`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/inspector/sections.ts:316`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/inspector/sections.ts:312` `export const revealField = registerHandler<'inspector.reveal', EditorUi>('inspector.reveal', ({ state }, { property, attribute }) => {` — as portas (o item Adicionar propriedade, a barra de comandos, o duplo clique num controle do canvas) chegam ao mesmo tratador com só `property` ou `attribute`.
- G4: n/a — o comando muda estado; a coluna do inspector ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/inspector/sections.ts:315`).
- G5: n/a — o encaixe do campo revelado é medido na Fase 6 (`src/editor/inspector/sections.ts:315`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/inspector/sections.ts:316`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/inspector/sections.ts:313`).

## Medições
- a medir na Fase 6: a ordem de foco ao revelar um campo (o campo revelado toma o foco depois de o inspector desenhar), que só o navegador calcula, nas duas telas.

## Ramos do trecho
- **Trecho:** TRC-inspector.reveal
- **Argumentos enviados:** a porta declara `{}`; o item acrescenta `property` (a propriedade escolhida)
- R1 `src/editor/inspector/sections.ts:314` `if (field === undefined) return { kind: 'change' };` — esta porta envia `property`: um campo a mostrar existe, o caminho segue.
- R2 `src/editor/inspector/sections.ts:315` `const shown = withInspectorTab(withInspector(state.ui, true), attribute !== undefined ? SETTINGS_TAB : STYLE_TAB);` — esta porta não envia `attribute`: o caminho revela o campo na aba Estilo.
