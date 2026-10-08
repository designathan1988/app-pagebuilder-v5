# ENT-P-project-0023 — project.captureUrl pela porta project.captureUrl#capture-url-run

Fluxo de porta do domínio `project`. Rastreia o caminho próprio da porta — de `src/editor/shell/capture-url.tsx:37` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-project.captureUrl`, que segue daqui.

## Passos
1. `src/editor/shell/capture-url.tsx:31` `const submit = (event: FormEvent<HTMLFormElement>) => {` — o envio do formulário do diálogo (o botão Capture) começa o caminho.
2. `src/editor/shell/capture-url.tsx:32` `event.preventDefault();` — o envio não recarrega a página.
3. `src/editor/shell/capture-url.tsx:33` `if (!door.available) return;` — com a porta indisponível nada é despachado.
4. `src/editor/shell/capture-url.tsx:34` `const form = new FormData(event.currentTarget);` — os valores dos campos do formulário.
5. `src/editor/shell/capture-url.tsx:35` `const typed = String(form.get('url') ?? '');` — o endereço digitado no campo do diálogo. [lê: EST-L09a-018 via submit]
6. `src/editor/shell/capture-url.tsx:36` `const count = String(form.get('pages') ?? '').trim();` — quantas páginas seguir no campo. [lê: EST-L09a-019 via submit]
7. `src/editor/shell/capture-url.tsx:37` `afterGesture(store, () => (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(run.command.id as CommandId, { ...run.door.args, url: typed, pages: count === '' ? 1 : Number(count) }));` — a linha de Início: o botão pede a `afterGesture` que rode o despacho (com `url` e `pages`) quando nenhum gesto estiver aberto.
8. `src/editor/input/pointer/common.ts:384` `export function afterGesture(store: EditorStore, run: () => void): void {` — a função que adia o despacho.
9. `src/editor/input/pointer/common.ts:385` `const shared = sharedOf(store);` — lê-se o estado do ponteiro da store. [lê: EST-L05a-019 via sharedOf]
10. `src/editor/input/pointer/common.ts:386` `if (shared.open === null) {` — sem gesto de ponteiro aberto, o caminho segue para rodar o despacho agora.
11. `src/editor/input/pointer/common.ts:387` `run();` — roda a função da linha de Início, que chama o `dispatch` da store do editor.
12. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
13. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `project.captureUrl` tem `"undoable": false` (`manifest/commands/project.json:824` `"undoable": false`), então `changesDocument` é `false`.
14. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
15. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
16. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
17. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
18. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
19. `src/app/commands.ts:216` `'project.captureUrl': captureUrlCommand,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-project.captureUrl`).

## Ramos
- R1 `src/editor/shell/capture-url.tsx:33` `if (!door.available) return;` — porta indisponível (a feature não construída): nada é despachado; disponível: o caminho segue.
- R2 `src/editor/input/pointer/common.ts:386` `if (shared.open === null) {` — sem gesto de ponteiro aberto, o despacho roda agora (linha 405); com um gesto aberto, ele espera num quadro (`src/editor/input/pointer/common.ts:390` `const wait = () => (shared.open === null ? run() : requestAnimationFrame(wait));`).
- R3 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto na store do editor, o despacho vai direto à store do núcleo, o lado tomado por esta porta; com um gesto aberto e um comando que não muda o documento, ele roda pelo gesto (`src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`).
- R4 `src/editor/store.ts:246` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- `src/editor/input/pointer/common.ts:390` `const wait = () => (shared.open === null ? run() : requestAnimationFrame(wait));` — quando um gesto de ponteiro está aberto, o despacho espera num quadro que se repete até o gesto fechar; a entrada que retoma é o fim do gesto, e o estado da aplicação segue com o gesto (EST-L05a-019) até então.
- `src/editor/input/pointer/common.ts:391` `requestAnimationFrame(wait);` — o pedido do primeiro quadro da espera; o estado da aplicação não muda enquanto ele espera.
- no ramo sem gesto aberto (o tomado por esta porta) não há espera: o despacho é síncrono da linha de Início a `src/app/commands.ts:216`.

## Estado
- lê: EST-L09a-018 (via submit), EST-L09a-019 (via submit), EST-L05a-019 (via sharedOf), EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-project.captureUrl`

## Resultado
- **Estado final:** EST-L01-033, EST-L01-035 e EST-L01-037 — no ramo `change` o estado do editor perde `ui.dialog` e ganha `ui.capture` com o endereço, a contagem e as páginas (`src/editor/import/capture.ts:54` `return { kind: 'change', ui: { ...ui, capture: { url: address, count: (state.ui.capture?.count ?? 0) + 1, pages } }, message: message('status.capture.running', { url: address }) };`); nos ramos de recusa só a mensagem e a recusa são escritas (`src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o diálogo de captura fecha e o painel de captura lê `ui.capture` pelo caminho da store (`src/editor/store.ts:275` `return useSyncExternalStore(store.subscribe, () => select(store.getState()));`).
- **DOM do canvas:** nada muda — o documento não é tocado (`src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).

## Regras
- G1: n/a — o comando grava o estado do editor, sem gravar estilo nem valor de camada (`src/editor/import/capture.ts:54` `return { kind: 'change', ui: { ...ui, capture: { url: address, count: (state.ui.capture?.count ?? 0) + 1, pages } }, message: message('status.capture.running', { url: address }) };`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar.
- G3: ok `src/editor/shell/capture-url.tsx:37` `afterGesture(store, () => (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(run.command.id as CommandId, { ...run.door.args, url: typed, pages: count === '' ? 1 : Number(count) }));` — a porta envia só a intenção (o id do comando, o endereço e as páginas) e o tratador único `src/app/commands.ts:216` `'project.captureUrl': captureUrlCommand,` decide.
- G4: n/a — a porta é o botão do diálogo de captura, não um ponto do canvas (`manifest/commands/project.json:829` `"kind": "panel-control",`).
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/shell/capture-url.tsx:37` `afterGesture(store, () => (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(run.command.id as CommandId, { ...run.door.args, url: typed, pages: count === '' ? 1 : Number(count) }));`.
- G6: n/a — o comando não escreve a seleção; ela fica como a store a tem `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o documento não é alterado; a comparação do DOM do canvas é medida fora desta porta (`src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta; o quadro de `afterGesture`, quando um gesto está aberto, deixa de ser pedido assim que o gesto fecha (`src/editor/input/pointer/common.ts:390` `const wait = () => (shared.open === null ? run() : requestAnimationFrame(wait));`), sem timer a cancelar.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-project.captureUrl
- **Argumentos enviados:** `{ url, pages }` — `url` é o texto do campo (`src/editor/shell/capture-url.tsx:35` `const typed = String(form.get('url') ?? '');`) e `pages` é `1` quando o campo está vazio, senão o número digitado (`src/editor/shell/capture-url.tsx:37` `afterGesture(store, () => (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(run.command.id as CommandId, { ...run.door.args, url: typed, pages: count === '' ? 1 : Number(count) }));`).
- R1 `src/editor/import/capture.ts:50` `if (address === null) return { kind: 'refused', message: message('status.capture.invalidUrl', { url: url.trim() }) };` — o endereço digitado passa por `captureAddress` (`src/editor/import/capture.ts:34` `export function captureAddress(typed: string): string | null {`): um endereço http ou https segue; um texto que não é endereço toma o lado da recusa.
- R2 `src/editor/import/capture.ts:51` `if (!Number.isInteger(pages) || pages < 1 || pages > MOST_PAGES) return { kind: 'refused', message: message('status.capture.badPages', { pages: String(pages) }) };` — `pages` desta porta é `1` (campo vazio) ou o inteiro digitado (`src/editor/shell/capture-url.tsx:37`): dentro de 1 a 30 segue; fora da faixa toma o lado da recusa (`src/editor/import/capture.ts:31` `const MOST_PAGES = 30;`).
