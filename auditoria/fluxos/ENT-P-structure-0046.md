# ENT-P-structure-0046 — element.duplicate pela porta key-ctrl-d-in-global
## Passos
1. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta key-ctrl-d-in-global despacha o comando e os argumentos quando não há área de transferência — o Início da porta.
2. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto aberto e sem sequência de teclas, `dispatch` é o `store.dispatch` da store do editor.
3. `src/editor/input/keymap.ts:526` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — o `given` junta os argumentos do campo focado e os do manifesto da porta: nada — a intenção vazia.
4. `src/editor/input/keymap.ts:527` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — sem gesto de tecla, `args` é o `given`.
5. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor envolve o despacho (`gestureSafe`).
6. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes e o contexto de edição é capturado. [lê: EST-L05a-001 via beforeCommand]
7. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai direto à store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-031 via dispatch] [escreve: EST-L01-033 via dispatch]
8. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
9. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — chama a regra única de execução.
10. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
11. `src/app/commands.ts:379` `'element.duplicate': duplicateCommand,` — a linha da Chamada do trecho: o tratador do comando.
## Ramos
- R1 `src/editor/input/keymap.ts:487` `if (!binding) return;` — a tecla não tem vínculo no contexto do foco: nada roda; com vínculo: segue.
- R2 `src/editor/input/keymap.ts:505` `if (!shortcutRunsNow(binding)) return;` — o comando não está construído ou a feature não o introduz: a porta não roda; senão: segue.
- R3 `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — o comando toma a área de transferência: espera a leitura (`src/editor/input/keymap.ts:532` `else if (gesture === null) void readClipboard().then((content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`); não a tomando: despacha direto (esta porta).
## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`); nenhum `await`, timer, quadro ou ouvinte é criado no trecho desta porta.
## Estado
- lê: EST-L01-030 (o documento, via dispatch), EST-L01-031 (a seleção, via dispatch), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-030 (o documento, via dispatch), EST-L01-031 (a seleção, via dispatch), EST-L01-033 (a mensagem, via dispatch)
## Resultado
- **Estado final:** EST-L01-030 com uma cópia depois de cada raiz (`src/core/structure/duplicate.ts:97` `.map(({ root, copy }) => ({ op: 'add', path: [...root.path.slice(0, -1), root.index + 1], value: copy }));`), EST-L01-031 com a seleção nas cópias (`src/core/structure/duplicate.ts:104` `const selection = [primary.copy.id, ...copies.filter((c) => c !== primary).map((c) => c.copy.id)];`) e EST-L01-033 com a mensagem de `src/core/structure/duplicate.ts:109` `message: copies.length === 1 ? message('status.duplicated', { name: primary.root.node.name, copy: primary.copy.name }) : message('status.duplicatedMany', { count: copies.length }),`.
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas ganha as linhas das cópias.
- **DOM do canvas:** as cópias entram pela lista de remendos que `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` publica.
## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do despacho.
- G3: ok `src/app/commands.ts:379` `'element.duplicate': duplicateCommand,` — um só tratador; esta porta manda só a intenção e chega à mesma linha da Chamada do trecho.
- G4: n/a — o caminho da porta e o tratador não desenham sobre o canvas (`src/app/commands.ts:379` `'element.duplicate': duplicateCommand,`).
- G5: n/a — o caminho da porta e o tratador não medem nem desenham painel ou barra (`src/app/commands.ts:379` `'element.duplicate': duplicateCommand,`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`
## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
## Ramos do trecho
- **Trecho:** TRC-element.duplicate
- **Argumentos enviados:** nenhum campo — o tipo é `Record<string, never>`
- nenhum — o trecho `TRC-element.duplicate` não lista ramo que dependa dos argumentos (`manifest/commands/structure.json:1348` `"args": {},`); esta porta manda a intenção vazia.
