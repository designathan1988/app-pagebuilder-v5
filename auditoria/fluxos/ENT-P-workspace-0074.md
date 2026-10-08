# ENT-P-workspace-0074 — palette.toggleGroup pela porta palette.toggleGroup#elements-group-header

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2172` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:2171` `"id": "elements-group-header",`
- **Tratador:** `src/app/commands.ts:492` `'palette.toggleGroup': toggleGroup,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:92` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:492` `'palette.toggleGroup': toggleGroup,` — a tabela liga o id ao tratador; o trecho TRC-palette.toggleGroup começa aqui

## Ramos
- nenhum — o tratador alterna o grupo na lista, sem outra decisão `src/editor/palette/palette.ts:24` `const next = collapsed.includes(group) ? collapsed.filter((g) => g !== group) : [...collapsed, group];`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/palette/palette.ts:20` `export const toggleGroup = registerHandler<'palette.toggleGroup', EditorUi>(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.preferences.collapsedGroups`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.preferences.collapsedGroups`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.preferences.collapsedGroups` com o grupo alternado (`src/editor/palette/palette.ts:27`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** o grupo do painel Insert fecha ou abre (`src/editor/palette/palette.ts:27`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/palette/palette.ts:27`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/palette/palette.ts:20` `export const toggleGroup = registerHandler<'palette.toggleGroup', EditorUi>(` — a única porta (o cabeçalho do grupo) chega ao mesmo tratador com só `group`.
- G4: n/a — o comando muda estado; o painel Insert ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/palette/palette.ts:27`).
- G5: n/a — o encaixe do painel Insert com os grupos abertos ou fechados é medido na Fase 6 (`src/editor/palette/palette.ts:27`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/palette/palette.ts:27`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/palette/palette.ts:23`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.

## Ramos do trecho
- **Trecho:** TRC-palette.toggleGroup
- **Argumentos enviados:** a porta declara `{}`; o cabeçalho do grupo acrescenta `group` (o id do grupo)
- nenhum — o trecho TRC-palette.toggleGroup não lista ramo que dependa dos argumentos; o tratador alterna o grupo `src/editor/palette/palette.ts:24` `const next = collapsed.includes(group) ? collapsed.filter((g) => g !== group) : [...collapsed, group];`.
