# ENT-P-workspace-0066 — preferences.setTheme pela porta preferences.setTheme#menu-theme-light

- **Tipo:** comando-porta menu `manifest/commands/workspace.json:1954` `"kind": "menu",`
- **Porta:** `manifest/commands/workspace.json:1953` `"id": "menu-theme-light",`
- **Tratador:** `src/app/commands.ts:490` `'preferences.setTheme': setTheme,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/menu.tsx:54` `onClick={() => {` — o clique do item do menu roda a porta (o menu fecha antes)
2. `src/editor/doors/menu.tsx:59` `door.run();` — a porta é rodada
3. `src/editor/doors/door.tsx:92` `const run = () => {` — a porta abre o seu `run`
4. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:490` `'preferences.setTheme': setTheme,` — a tabela liga o id ao tratador; o trecho TRC-preferences.setTheme começa aqui

## Ramos
- R1 `src/editor/preferences/preferences.ts:38` `if (state.ui.preferences.theme === args.theme) return { kind: 'change' };` — o tema já é o pedido: mudança vazia, sem tocar `ui`; diferente segue para o passo 7.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/preferences/preferences.ts:35` `export const setTheme: RegisteredHandler<'preferences.setTheme', EditorUi> = registerHandler(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.preferences.theme`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.preferences.theme`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.preferences.theme` no tema escolhido (`src/editor/preferences/preferences.ts:39`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a interface no tema novo.
- **DOM do editor:** as cores da casca seguem o tema escolhido (`src/editor/preferences/preferences.ts:39`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/preferences/preferences.ts:39`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/preferences/preferences.ts:35` `export const setTheme: RegisteredHandler<'preferences.setTheme', EditorUi> = registerHandler(` — as três portas (menu Tema: claro, escuro, sistema) chegam ao mesmo tratador com só `theme`.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/preferences/preferences.ts:39`).
- G5: n/a — o encaixe dos painéis no tema novo é medido na Fase 6 (`src/editor/preferences/preferences.ts:39`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/preferences/preferences.ts:39`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/preferences/preferences.ts:38`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.

## Ramos do trecho
- **Trecho:** TRC-preferences.setTheme
- **Argumentos enviados:** o manifesto declara `theme` `light`
- R1 `src/editor/preferences/preferences.ts:38` `if (state.ui.preferences.theme === args.theme) return { kind: 'change' };` — esta porta envia `theme` `light`: com o tema mostrado já `light` o caminho passa pelo lado da mudança vazia; diferente, pelo lado que grava.
