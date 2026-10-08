# ENT-P-animation-0008 — animation.deleteKeyframe pela porta animation.deleteKeyframe#key-delete-in-timeline

Fluxo de porta do domínio `animation`. Rastreia o caminho próprio da porta — de `src/editor/input/keymap.ts:531` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-animation.deleteKeyframe`. A `Chamada` do trecho nomeia a outra porta do comando, a panel-control, em `src/editor/doors/door.tsx:144`; esta porta de tecla entra no trecho pela linha `src/editor/input/keymap.ts:531`, que o passo 3 do trecho cita.

## Passos
1. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a tecla Delete no contexto `timeline` vincula a porta `key-delete-in-timeline` e despacha o comando e os argumentos (o Início da porta).
2. `src/editor/input/keymap.ts:487` `if (!binding) return;` — a tecla tem de ter vínculo no contexto do foco.
3. `src/editor/input/keymap.ts:505` `if (!shortcutRunsNow(binding)) return;` — a porta roda quando o comando está construído e a feature o introduz.
4. `src/editor/input/keymap.ts:514` `focusedArgs(event.target, binding);` — o controle focado (a linha do quadro-chave) dá os argumentos que ele representa: `animation` e `keyframe`.
5. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto aberto e sem sequência de teclas, `dispatch` é o `store.dispatch` da store do editor.
6. `src/editor/input/keymap.ts:526` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — o `given` junta os argumentos do controle focado e os do manifesto da porta.
7. `src/editor/input/keymap.ts:527` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — sem gesto de tecla, `args` é o `given`.
8. `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — o comando não toma a área de transferência, então `clipboard` é `undefined`.
9. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
10. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — lê da tabela `UNDOABLE` se o comando muda o documento; `animation.deleteKeyframe` é desfazível (`manifest/commands/animation.json:411` `"undoable": true,`), então `changesDocument` é `true`.
11. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
12. `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState]
13. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai à store do núcleo.
14. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
15. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — chama a regra única de execução.
16. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
17. `src/app/commands.ts:198` `'animation.deleteKeyframe': deleteKeyframeCommand,` — a linha que despacha o comando ao tratador (a mesma da porta panel-control do comando).

## Ramos
- R1 `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — o comando não toma a área de transferência, então `clipboard` é `undefined` e o caminho segue para a linha 531; um comando que a toma esperaria a leitura (`src/editor/input/keymap.ts:532` `else if (gesture === null) void readClipboard().then((content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`).
- R2 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o despacho vai direto à store do núcleo (o lado desta porta); com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/editor/store.ts:233` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/input/keymap.ts:531` a `src/app/commands.ts:198`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L01-031 (a seleção, via getState), EST-L01-037 (o estado do editor, via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-animation.deleteKeyframe`

## Resultado
- **Estado final:** EST-L01-030 com o quadro-chave apagado, pelo trecho `TRC-animation.deleteKeyframe`; uma digitação pendente de outro alvo é gravada antes (R3).
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra a mensagem do ramo, pelo trecho `TRC-animation.deleteKeyframe`.
- **DOM do canvas:** o quadro redesenha a folha `@keyframes` pelo mesmo aviso de documento em `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar, e um comando que muda o documento grava a digitação antes.
- G3: ok `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — esta porta de tecla e a porta do botão chegam ao mesmo tratador (`src/app/commands.ts:198` `'animation.deleteKeyframe': deleteKeyframeCommand,`), ambas com a mesma intenção (a animação e o quadro-chave), uma pela tecla Delete e outra pelo botão.
- G4: n/a — a porta é uma tecla, não um ponto do canvas (`manifest/commands/animation.json:446` `"kind": "shortcut",`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/input/keymap.ts:531` e `src/app/commands.ts:198`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-animation.deleteKeyframe
- **Argumentos enviados:** `{ animation, keyframe }` — `animation` e `keyframe` vêm do controle focado, a linha do quadro-chave (`focusedArgs`); o manifesto fixa `args: {}` na porta (`manifest/commands/animation.json:462` `"args": {}`).
- R2 `src/core/animation/animation.ts:318` `if (!held.keyframes.some((k) => k.offset === keyframe)) return { kind: 'change' };` — o deslocamento que o controle focado representa vai em `keyframe`; sem esse quadro-chave na animação, o caminho para com `change` vazio; com ele segue.
