# ENT-P-design-system-0018 — components.closePrompt pela porta key-escape-in-component-prompt

Fluxo de porta do domínio `design-system`. Rastreia o caminho próprio da porta — de `src/editor/input/keymap.ts:531` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-components.closePrompt`, que segue daqui.

## Passos
1. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a tecla do acorde `Escape` no contexto `component-prompt` roda o comando que a ligação resolve; como `components.closePrompt` não toma argumento do tipo `clipboard`, a guarda é verdadeira e o despacho acontece já.
2. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — o despacho desta tecla é o da store do editor: sem gesto de ponteiro e sem ser uma tecla digitada do canvas, os dois primeiros membros são nulos e `dispatch` é `store.dispatch`.
3. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o comando segue para o `dispatch` da store do núcleo.
6. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — `run` procura o tratador do comando na tabela da fiação.
9. `src/app/commands.ts:235` `'components.closePrompt': closeComponentPrompt,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-components.closePrompt`).

## Ramos
- R1 `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — com um gesto de ponteiro aberto o despacho seria o do gesto; com uma tecla digitada do canvas (`typedKey`), o da rajada; nenhum dos dois vale para o `Escape` (o contexto `component-prompt` não está em `CHOSEN_CONTEXTS` e não há gesto aberto), então o despacho é `store.dispatch`.
- R2 `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — o comando desta porta não declara argumento do tipo `clipboard`, então `clipboard` é `undefined` e o caminho segue para a linha 531.
- R3 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o comando roda já pelo `dispatch` do núcleo; com um gesto aberto e um comando que não muda o documento, rodaria pelo gesto (`src/editor/store.ts:227` `else if (!changesDocument) result = open.dispatch(id, args);`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono de `src/editor/input/keymap.ts:531` a `src/app/commands.ts:235`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand)
- escreve: EST-L05a-001 (a digitação pendente é gravada antes, dentro de `beforeCommand`, quando o comando muda o documento)

## Resultado
- **Estado final:** `ui.componentPrompt` fica nulo (`src/editor/shell/component-prompt.ts:22` `state.ui.componentPrompt === null ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, componentPrompt: null } },`); o comando não é desfazível.
- **Re-renderizado:** os assinantes ouvem `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`.
- **DOM do editor:** o painel do prompt de componente fecha.
- **DOM do canvas:** nada muda (o documento não é tocado).

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta entrega o contexto da digitação à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando, consultada dentro de `beforeCommand`.
- G3: ok `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — o Esc do prompt manda só a intenção; esta porta e o botão de fechar chegam ao mesmo tratador.
- G4: n/a — a porta é uma tecla, não um ponto do canvas `manifest/commands/design-system.json:919` `"kind": "shortcut",`.
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/input/keymap.ts:531` e `src/app/commands.ts:235`; o ouvinte de teclado é criado por `installKeymap` (`src/editor/input/keymap.ts:586` `target.addEventListener('keydown', onKeyDown);`) e a instalação devolve a remoção (`src/editor/input/keymap.ts:591` `target.removeEventListener('keydown', onKeyDown);`), fora do caminho desta porta.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-components.closePrompt
- **Argumentos enviados:** `{}` — a porta não envia campo nomeado: o comando não toma argumentos (`manifest/commands/design-system.json:880` `"args": {},`) e a tecla não acrescenta nada.
- nenhum ramo do trecho depende dos argumentos: o trecho o registra (`auditoria/fluxos/trechos/TRC-components.closePrompt.md:4` `- **Ramos que dependem dos argumentos:** nenhum — o comando não toma argumentos.`); o `ui.componentPrompt` decide o ramo.
