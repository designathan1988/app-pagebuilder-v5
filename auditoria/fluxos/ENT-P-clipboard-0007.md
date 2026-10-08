# ENT-P-clipboard-0007 — clipboard.paste pela porta menu-edit

Fluxo de porta do domínio `clipboard`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:111` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-clipboard.paste`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:111` `void readClipboard().then((content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));` — a porta lê a área de transferência e, quando a leitura resolve, chama `dispatch` com o conteúdo no argumento; é o Início da porta.
2. `src/editor/doors/door.tsx:109` `const clipboard = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in given))?.[0];` — o nome do argumento que espera a área de transferência: `clipboard`.
3. `src/editor/clipboard.ts:63` `export async function readClipboard(): Promise<ClipboardContent> {` — o leitor único da área de transferência.
4. `src/editor/clipboard.ts:64` `const read = await systemClipboard();` — espera a leitura do sistema.
5. `src/editor/clipboard.ts:38` `async function systemClipboard(): Promise<ClipboardContent> {` — a leitura do sistema.
6. `src/editor/clipboard.ts:41` `items = await navigator.clipboard.read();` — o navegador entrega a área de transferência.
7. `src/editor/clipboard.ts:65` `if (read.status === 'read' && (read.text !== null || read.html !== null)) return read;` — havendo conteúdo do sistema, ele é o resultado.
8. `src/editor/clipboard.ts:66` `if (own === null) return read;` — sem conteúdo do sistema e sem cópia própria, vale a leitura do sistema. [lê: EST-L05b-001 via readClipboard]
9. `src/editor/clipboard.ts:67` `return { status: 'read', html: null, text: own, markup: null };` — com cópia própria, ela é o resultado. [lê: EST-L05b-001 via readClipboard]
10. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` que a retomada chama é o da store do editor.
11. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
12. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `clipboard.paste` é reversível no manifesto, então `changesDocument` é verdadeiro.
13. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando. [lê: EST-L05a-001 via beforeCommand]
14. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — o alvo da digitação pendente. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
15. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-031 via dispatch]
16. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
17. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
18. `src/core/store/store.ts:399` `const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {` — a função que roda um comando.
19. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
20. `src/app/commands.ts:207` `'clipboard.paste': pasteCommand,` — a linha que despacha o comando ao tratador (a Chamada do trecho `TRC-clipboard.paste`).

## Ramos
- R1 `src/editor/doors/door.tsx:110` `if (clipboard !== undefined) {` — `clipboard.paste` tem um argumento do tipo `clipboard`, então `clipboard` não é `undefined` e o caminho entra neste ramo; um comando sem esse argumento desceria para o despacho direto.
- R2 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando desta porta não pede arquivo, então este ramo não é alcançado a partir daqui.
- R3 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo; com um gesto aberto, `clipboard.paste` é reversível, então entraria na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — o id é um comando do manifesto, então a tabela devolve a entrada `src/app/commands.ts:207` `'clipboard.paste': pasteCommand,`.

## Fronteiras assíncronas
- `src/editor/doors/door.tsx:111` `void readClipboard().then((content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));` — a porta lê a área de transferência e retoma no `.then` com o conteúdo; no intervalo podem rodar as retomadas da promessa da leitura; o estado da aplicação segue EST-L01-030.
- `src/editor/clipboard.ts:64` `const read = await systemClipboard();` — a espera da leitura do sistema; no intervalo podem rodar a retomada `ENT-L05b-0007`, a entrega da área de transferência `ENT-L05b-0004`, a leitura da parte HTML `ENT-L05b-0005`, a da parte de texto simples `ENT-L05b-0006` e a do conteúdo de uma parte `ENT-L05b-0003`; o estado é EST-L01-030, e a cópia própria EST-L05b-001 é lida nos passos 8 e 9.
- `src/editor/clipboard.ts:41` `items = await navigator.clipboard.read();` — a espera de o navegador entregar a área de transferência; no intervalo pode rodar `ENT-L05b-0004`; o estado é EST-L01-030.

## Estado
- lê: EST-L05a-001, EST-L01-031, EST-L01-037, EST-L05b-001
- escreve: EST-L01-030, EST-L01-031

## Resultado
- **Estado final:** inalterado por esta porta antes do despacho; a leitura da área de transferência lê a cópia própria EST-L05b-001 e o comando é entregue ao tratador `src/app/commands.ts:207` `'clipboard.paste': pasteCommand,`; o estado que ele escreve está no trecho `fluxos/trechos/TRC-clipboard.paste.md`.
- **Re-renderizado:** nada muda nesta porta; quem avisa os assinantes é o trecho `TRC-clipboard.paste`.
- **DOM do editor:** nada muda neste caminho `src/editor/doors/door.tsx:111` `void readClipboard().then((content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));`.
- **DOM do canvas:** nada muda neste caminho.

## Regras
- G1: n/a — a porta não grava no documento nem num contexto de edição; o contexto é capturado em `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando.
- G3: ok — a porta chega à tabela `src/app/commands.ts:207` `'clipboard.paste': pasteCommand,` e envia só a intenção, o conteúdo lido no argumento.
- G4: n/a — a porta não desenha elemento sobre o canvas `src/editor/doors/door.tsx:111` `void readClipboard().then((content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));`.
- G5: n/a — a porta é um item do menu Editar, desenhado na própria camada; ela não mede nem cobre o canvas `src/editor/doors/door.tsx:111` `void readClipboard().then((content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));`.
- G6: n/a — a porta não escreve a seleção; o trecho `TRC-clipboard.paste` escreve a seleção pela store.
- G7: n/a — a porta não muda o documento; só entrega o comando `src/app/commands.ts:207` `'clipboard.paste': pasteCommand,`.
- INT: n/a — a porta não escreve no documento; a integridade é do trecho `fluxos/trechos/TRC-clipboard.paste.md`.

## Limpeza
- nenhum ouvinte, timer ou observador é criado neste caminho; `src/editor/doors/door.tsx:111` `void readClipboard().then((content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));` só cria uma promessa, que o próprio `.then` encerra, e não há remoção a citar.

## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-clipboard.paste
- **Argumentos enviados:** um campo, `clipboard` — o conteúdo lido por `readClipboard` (`ClipboardContent`), do tipo `src/generated/commands.ts:77` `"clipboard.paste": { readonly clipboard: ClipboardContent };`; a porta `menu-edit` também declara `manifest/commands/clipboard.json:205` `"args": {}`, então o campo vem só da leitura.
- R1 `src/core/clipboard/clipboard.ts:219` `if (clipboard === undefined) {` — esta porta sempre envia um valor (o conteúdo lido), então o caminho não passa pela execução sem leitura.
- R2 `src/core/clipboard/clipboard.ts:225` `if (content.status === 'denied') return { kind: 'refused', message: message('status.clipboard.denied') };` — quando o navegador nega a leitura (`src/editor/clipboard.ts:43` `if (error instanceof DOMException && error.name === 'NotAllowedError') return { status: 'denied' };`), o valor desta porta leva o caminho à recusa; legível, segue.
- R3 `src/core/clipboard/clipboard.ts:236` `if (copied !== null) {` — quando o texto do valor está no formato de elementos do editor (copiado dentro do editor), o caminho passa por aqui; outro texto, pelo ramo de HTML ou de texto simples.
- R4 `src/core/clipboard/clipboard.ts:248` `if (markup !== null && markup.trim() !== '') {` — quando o valor traz markup de HTML lido de fora, o caminho passa pelo importador; senão, com texto simples não vazio, vira Parágrafos; senão, `status.paste.empty`.
