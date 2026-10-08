# ENT-P-workspace-0090 — inspector.toggleSection pela porta inspector.toggleSection#inspector-section-header

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2795` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:2794` `"id": "inspector-section-header",`
- **Tratador:** `src/app/commands.ts:501` `'inspector.toggleSection': toggleSection,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:286` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:93` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:144` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:501` `'inspector.toggleSection': toggleSection,` — a tabela liga o id ao tratador; o trecho TRC-inspector.toggleSection começa aqui

## Ramos
- R1 `src/editor/inspector/sections.ts:120` `if (!isSectionId(section)) throw new Error(` — um `section` fora de `SECTION_IDS` lança (defeito da porta); uma secção válida segue.
- R2 `src/editor/inspector/sections.ts:123` `const closed = sectionClosed(state.ui, section, authoredProperties(state));` — desenhada fechada: o clique abre a secção e a põe em `expandedSections`; desenhada aberta: fecha e a põe em `collapsedSections` (`src/editor/inspector/sections.ts:131`).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/sections.ts:118` `export const toggleSection = registerHandler<'inspector.toggleSection', EditorUi>('inspector.toggleSection', ({ state }, { section }) => {`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (documento: `authoredProperties`), EST-L01-037 (`ui.preferences`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.preferences.collapsedSections`, `ui.preferences.expandedSections`).

## Resultado
- **Estado final:** EST-L01-037 com a secção em `collapsedSections` ou `expandedSections` conforme o clique (`src/editor/inspector/sections.ts:135`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o inspector.
- **DOM do editor:** a secção fecha ou abre e o cabeçalho mostra ou deixa de mostrar o resumo (`src/editor/inspector/sections.ts:135`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/inspector/sections.ts:135`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/inspector/sections.ts:118` `export const toggleSection = registerHandler<'inspector.toggleSection', EditorUi>('inspector.toggleSection', ({ state }, { section }) => {` — a única porta (o cabeçalho da secção) chega ao mesmo tratador com só `section`.
- G4: n/a — o comando muda estado; a coluna do inspector ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/inspector/sections.ts:135`).
- G5: n/a — o encaixe da secção aberta ou recolhida é medido na Fase 6 (`src/editor/inspector/sections.ts:135`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/inspector/sections.ts:135`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/inspector/sections.ts:123`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.

## Ramos do trecho
- **Trecho:** TRC-inspector.toggleSection
- **Argumentos enviados:** a porta declara `{}`; o cabeçalho da secção acrescenta `section` (o id da secção)
- R1 `src/editor/inspector/sections.ts:120` `if (!isSectionId(section)) throw new Error(`inspector.toggleSection: the inspector has no section ${section}`);` — esta porta envia `section` (a secção do cabeçalho): uma secção fora das conhecidas lança; uma válida segue.
- R2 `src/editor/inspector/sections.ts:123` `const closed = sectionClosed(state.ui, section, authoredProperties(state));` — desenhada fechada: o caminho abre a secção; desenhada aberta: fecha.
