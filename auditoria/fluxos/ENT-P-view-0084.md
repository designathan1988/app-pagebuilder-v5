# ENT-P-view-0084

- **Comando:** guides.move
- **Porta:** `manifest/commands/view.json:2526` `"id": "key-arrow-down-in-guide",`
- **Gatilho:** `manifest/commands/view.json:2529` `"chord": "ArrowDown",`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Tratador:** `src/app/commands.ts:470` `'guides.move': moveGuideCommand,`

## Passos

1. `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a tecla despacha o comando ligado ao acorde, com os argumentos montados
2. `src/editor/input/keymap.ts:531` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — o comando não toma o que a área de transferência guarda: o despacho não a espera
3. `src/editor/input/keymap.ts:526` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — qual despacho corre o comando: o do gesto, o da rajada de letras ou o da store
4. `src/editor/input/keymap.ts:528` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — os argumentos, passados pelo passo do gesto quando a porta tem um
5. `src/editor/input/keymap.ts:527` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — `given`: os argumentos do controle focado sobre os da porta
6. `src/editor/input/keymap.ts:509` `const own = gesture` — o que a tecla envia vem do controle focado
7. `src/editor/input/keymap.ts:515` `: focusedArgs(event.target, binding);` — a guia focada entrega o que ela representa
8. `src/editor/input/keymap.ts:188` `if (entry.door.kind === 'shortcut' && control.getAttribute('data-key-context') === entry.door.context) return Object.fromEntries(Object.entries(stands).filter(([name]) => name in entry.command.args));` — a guia focada é o próprio contexto da tecla, então ela entrega o seu id, filtrado pelos argumentos do comando
9. `src/editor/input/keymap.ts:274` `return { ...args, ...Object.fromEntries(rule.args.filter((name) => typeof args[name] === 'number').map((name) => [name, (args[name] as number) * step])) };` — a direção da porta é multiplicada pelo passo da tecla
10. `src/editor/input/keymap.ts:239` `'guide-keys': { step: numberConstant('guides.keyStep'), shiftStep: numberConstant('guides.keyShiftStep'), args: ['delta'] },` — a tabela dos passos da tecla guide-keys: multiplica o delta por guides.keyStep
11. `src/editor/input/keymap.ts:477` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — o acorde liga a porta no contexto
12. `src/editor/input/keymap.ts:506` `if (!shortcutRunsNow(binding)) return;` — a porta corre quando o seu comando está construído e a funcionalidade o introduz
13. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — o `dispatch` da store do editor
14. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — se o comando grava no documento, pela tabela do manifesto
15. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store guarda a digitação pendente antes do comando, no contexto em que foi feita [lê: EST-L05a-001 via beforeCommand] [escreve: EST-L05a-001 via keepTyping]
16. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho passa à store do núcleo
17. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo entra no `run`
18. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` resolve o id na entrada da tabela de comandos
19. `src/app/commands.ts:470` `'guides.move': moveGuideCommand,` — a entrada da tabela onde o id nomeia o tratador (a Chamada do trecho)

## Ramos

- R1 `src/editor/input/keymap.ts:488` `if (!binding) return;` — uma tecla que nenhum acorde liga não corre nada; ligada, o caminho segue para `src/editor/input/keymap.ts:506` `if (!shortcutRunsNow(binding)) return;`.
- R2 `src/editor/input/keymap.ts:506` `if (!shortcutRunsNow(binding)) return;` — o comando não construído ou fora da funcionalidade: a tecla não corre; construído e na funcionalidade, segue para `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`.
- R3 `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` — nenhum argumento do tipo área de transferência: o despacho é imediato; havendo um, espera a leitura `src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`.
- R4 `src/editor/input/keymap.ts:526` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — qual despacho: o do gesto aberto, o da rajada de letras ou o da store do editor.
- R5 `src/editor/input/keymap.ts:188` `if (entry.door.kind === 'shortcut' && control.getAttribute('data-key-context') === entry.door.context) return Object.fromEntries(Object.entries(stands).filter(([name]) => name in entry.command.args));` — o controle focado é o próprio contexto da tecla (uma guia focada): entrega o seu id filtrado pelos argumentos do comando; outro controle entrega o que representa.
- R6 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho passa à store do núcleo; com um gesto aberto e um comando que não muda o documento, vai pelo gesto `src/editor/store.ts:241` `result = inGesture(id, () => gesture.dispatch(id, args));`.
- R7 `src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {` — a digitação pendente: sem digitação, devolve nada `src/editor/input/pending.ts:78` `if (typing === null) return undefined;`; sendo o comando do próprio campo, devolve o contexto da digitação `src/editor/input/pending.ts:79` `if (typing.owns(id, (args ?? {}) as Readonly<Record<string, unknown>>)) return typing.context;`; guarda-a antes nas demais `src/editor/input/pending.ts:82` `keepTyping();`.

## Fronteiras assíncronas

- nenhuma: o caminho da porta é síncrono; a única chamada com fronteira é a do próprio tratador, que a store corre no mesmo despacho e que o trecho já rastreia.

## Estado

- lê: EST-L05a-001
- escreve: EST-L05a-001

## Resultado

- **Estado final:** o comando é entregue ao tratador na tabela `src/app/commands.ts:470` `'guides.move': moveGuideCommand,`; o estado que ele escreve está no trecho `fluxos/trechos/TRC-guides.move.md`.
- **Re-renderizado:** nada muda neste fluxo; quando o tratador publica, a store avisa os seus assinantes `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a tecla não desenha nada no editor; só despacha o comando.
- **DOM do canvas:** nada muda neste fluxo: a porta não monta remendo algum; o documento só muda quando o tratador publica `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Regras

- G1: n/a — o fluxo de porta para na chamada do tratador `src/app/commands.ts:470` `'guides.move': moveGuideCommand,`; a gravação no contexto em que a digitação começou é do tratador e está no trecho.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `src/editor/input/pending.ts:82` `keepTyping();` guarda a digitação pendente antes do comando, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as 5 portas de guides.move chegam à mesma tabela `src/app/commands.ts:470` `'guides.move': moveGuideCommand,` e enviam só a intenção.
- G4: n/a — a porta não desenha elemento algum sobre o canvas; `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` não toca o DOM.
- G5: n/a — a porta não desenha nem mede painel, barra ou rótulo; `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` só despacha o comando.
- G6: n/a — a porta não escreve a seleção; o resultado do tratador não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — a porta não muda o documento; `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` só entrega o comando.
- INT: n/a — a porta não escreve no documento; a integridade é do tratador, rastreada no trecho `fluxos/trechos/TRC-guides.move.md`.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste fluxo; `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` não abre nenhum, e não há remoção a citar.

## Medições

- nenhuma: os passos citados não leem nem calculam valor que só o navegador calcula; a posição do ponteiro, quando há uma, é medida pelo dono do ponteiro, fora deste rastreamento.

## Ramos do trecho

- **Trecho:** TRC-guides.move
- **Argumentos enviados:** `delta` = 1 `manifest/commands/view.json:2544` `"delta": 1,` e `along` = "vertical" `manifest/commands/view.json:2545` `"along": "vertical"`, multiplicados pelo passo da tecla; `guide` = o id da guia focada, que o controle entrega `src/editor/input/keymap.ts:188` `if (entry.door.kind === 'shortcut' && control.getAttribute('data-key-context') === entry.door.context) return Object.fromEntries(Object.entries(stands).filter(([name]) => name in entry.command.args));`
- R3 `src/core/page/guides.ts:59` `if (held === null) return stale;` — esta porta envia `guide` = o id da guia focada `src/editor/input/keymap.ts:188` `if (entry.door.kind === 'shortcut' && control.getAttribute('data-key-context') === entry.door.context) return Object.fromEntries(Object.entries(stands).filter(([name]) => name in entry.command.args));`; existindo na página, o lado `stale` não é tomado e o caminho segue para `src/core/page/guides.ts:61` `if (at === undefined && (delta === undefined || (along !== undefined && along !== alongOf(held)))) return { kind: 'change' };`.
- R4 `src/core/page/guides.ts:61` `if (at === undefined && (delta === undefined || (along !== undefined && along !== alongOf(held)))) return { kind: 'change' };` — esta porta envia `delta` 1 e `along` "vertical" `manifest/commands/view.json:2545`, sem `at`; o eixo de movimento da guia é o perpendicular `src/core/page/guides.ts:54` `const alongOf = (guide: Guide): Guide['axis'] => (guide.axis === 'horizontal' ? 'vertical' : 'horizontal');`, e o ramo que devolve `change` sem remendo só é tomado quando o `along` da tecla não é esse eixo.
