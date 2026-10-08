# ENT-P-workspace-0076 — palette.setDensity pela porta palette.setDensity#elements-density-two-columns

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2255` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:2254` `"id": "elements-density-two-columns",`
- **Tratador:** `src/app/commands.ts:493` `'palette.setDensity': setDensity,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:286` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:93` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:144` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:493` `'palette.setDensity': setDensity,` — a tabela liga o id ao tratador; o trecho TRC-palette.setDensity começa aqui

## Ramos
- R1 `src/editor/palette/palette.ts:36` `if (paletteDensity(state.ui) === density) return { kind: 'change' };` — a densidade já é o pedido: mudança vazia, sem tocar `ui`; diferente segue para o passo 7.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/palette/palette.ts:33` `export const setDensity: RegisteredHandler<'palette.setDensity', EditorUi> = registerHandler(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.preferences.paletteDensity`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.preferences.paletteDensity`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.preferences.paletteDensity` na densidade escolhida (`src/editor/palette/palette.ts:37`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** as lajes do painel Insert ganham a disposição escolhida (`src/editor/palette/palette.ts:37`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/palette/palette.ts:37`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/palette/palette.ts:33` `export const setDensity: RegisteredHandler<'palette.setDensity', EditorUi> = registerHandler(` — as quatro portas (lista, duas colunas, três colunas, ícones) chegam ao mesmo tratador com só `density`.
- G4: n/a — o comando muda estado; o painel Insert ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/palette/palette.ts:37`).
- G5: n/a — o encaixe do painel Insert em cada densidade é medido na Fase 6 (`src/editor/palette/palette.ts:37`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/palette/palette.ts:37`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/palette/palette.ts:36`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.

## Ramos do trecho
- **Trecho:** TRC-palette.setDensity
- **Argumentos enviados:** o manifesto declara `density` `two-columns`
- R1 `src/editor/palette/palette.ts:36` `if (paletteDensity(state.ui) === density) return { kind: 'change' };` — esta porta envia `density` `two-columns`: com a densidade mostrada já `two-columns` o caminho passa pelo lado da mudança vazia; diferente, pelo lado que grava.
