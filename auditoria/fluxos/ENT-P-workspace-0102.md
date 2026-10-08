# ENT-P-workspace-0102 — codePanel.downloadPane pela porta codePanel.downloadPane#code-panel-download

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3280` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:3279` `"id": "code-panel-download",`
- **Tratador:** `src/app/commands.ts:509` `'codePanel.downloadPane': downloadPane,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:92` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:509` `'codePanel.downloadPane': downloadPane,` — a tabela liga o id ao tratador; o trecho TRC-codePanel.downloadPane começa aqui

## Ramos
- R1 `src/editor/code-panel/code-panel.ts:162` `if (shown === null || shown.text === null) return { kind: 'refused', message: message('status.codePanel.noText', { path: shown?.path ?? '' }) };` — sem arquivo mostrado ou sem texto legível: recusa nomeando o caminho; com texto: segue para o passo 7.

## Fronteiras assíncronas
- `src/editor/download.ts:13` `setTimeout(() => URL.revokeObjectURL(url), 0);` — o endereço do objeto é liberado no quadro de tempo seguinte; no intervalo, nenhuma entrada roda sobre o documento (o arquivo já foi entregue).

## Estado
- lê: EST-L01-030 (documento), EST-L01-037 (`ui`: o arquivo mostrado e o seu texto), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-033 (a mensagem da barra de estado).

## Resultado
- **Estado final:** EST-L01-033 com a mensagem "descarregado" (`src/editor/code-panel/code-panel.ts:163`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a barra de estado.
- **DOM do editor:** a barra de estado diz que o arquivo foi descarregado (`src/editor/code-panel/code-panel.ts:163`).
- **DOM do canvas:** nada muda; o navegador guarda o arquivo por um link que ele mesmo clica (`src/editor/download.ts:11` `link.click();`).

## Regras
- G1: n/a — o comando não escreve no documento, só entrega um arquivo à porta de descarga (`src/editor/code-panel/code-panel.ts:163`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/code-panel/code-panel.ts:160` `export const downloadPane = registerHandler<'codePanel.downloadPane', EditorUi>('codePanel.downloadPane', ({ state, rules }) => {` — a única porta (o botão Descarregar do painel) chega ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/code-panel/code-panel.ts:163`).
- G5: n/a — o encaixe do painel de código é medido na Fase 6 (`src/editor/code-panel/code-panel.ts:163`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/code-panel/code-panel.ts:163`).

## Limpeza
- o endereço do objeto é liberado no próprio temporizador `src/editor/download.ts:13` `setTimeout(() => URL.revokeObjectURL(url), 0);`; o link criado não é anexado à página nem recebe ouvinte, sem remoção pendente.

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.

## Ramos do trecho
- **Trecho:** TRC-codePanel.downloadPane
- **Argumentos enviados:** a porta não envia argumento
- R1 `src/editor/code-panel/code-panel.ts:162` `if (shown === null || shown.text === null) return { kind: 'refused', message: message('status.codePanel.noText', { path: shown?.path ?? '' }) };` — sem arquivo mostrado ou sem texto legível o caminho passa pelo lado da recusa; com texto, pelo lado que entrega o arquivo.
