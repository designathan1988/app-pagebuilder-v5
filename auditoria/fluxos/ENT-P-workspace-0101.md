# ENT-P-workspace-0101 — codePanel.copyPane pela porta codePanel.copyPane#code-panel-copy

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3236` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:3235` `"id": "code-panel-copy",`
- **Tratador:** `src/app/commands.ts:508` `'codePanel.copyPane': copyPane,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:286` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:93` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:144` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:508` `'codePanel.copyPane': copyPane,` — a tabela liga o id ao tratador; o trecho TRC-codePanel.copyPane começa aqui

## Ramos
- R1 `src/editor/code-panel/code-panel.ts:156` `if (shown === null || shown.text === null) return { kind: 'refused', message: message('status.codePanel.noText', { path: shown?.path ?? '' }) };` — sem arquivo mostrado ou sem texto legível: recusa nomeando o caminho; com texto: segue para o passo 7.

## Fronteiras assíncronas
- a escrita no clipboard do sistema é disparada sem espera: `src/editor/clipboard.ts:83` `? navigator.clipboard.writeText(content.text)`; o editor não aguarda a promessa (o seu próprio `own` já guarda o texto).

## Estado
- lê: EST-L01-030 (documento), EST-L01-037 (`ui`: o arquivo mostrado e o seu texto), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-033 (a mensagem da barra de estado), EST-L05b-001 (a cópia própria do editor).

## Resultado
- **Estado final:** EST-L01-033 com a mensagem "copiado" (`src/editor/code-panel/code-panel.ts:157`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a barra de estado.
- **DOM do editor:** a barra de estado diz que o texto foi copiado (`src/editor/code-panel/code-panel.ts:157`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não escreve no documento, só entrega texto à área de transferência (`src/editor/code-panel/code-panel.ts:157`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/code-panel/code-panel.ts:154` `export const copyPane = registerHandler<'codePanel.copyPane', EditorUi>('codePanel.copyPane', ({ state, rules }) => {` — a única porta (o botão Copiar do painel) chega ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/code-panel/code-panel.ts:157`).
- G5: n/a — o encaixe do painel de código é medido na Fase 6 (`src/editor/code-panel/code-panel.ts:157`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/code-panel/code-panel.ts:157`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/code-panel/code-panel.ts:155`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.

## Ramos do trecho
- **Trecho:** TRC-codePanel.copyPane
- **Argumentos enviados:** a porta não envia argumento
- R1 `src/editor/code-panel/code-panel.ts:156` `if (shown === null || shown.text === null) return { kind: 'refused', message: message('status.codePanel.noText', { path: shown?.path ?? '' }) };` — sem arquivo mostrado ou sem texto legível o caminho passa pelo lado da recusa; com texto, pelo lado que copia.
