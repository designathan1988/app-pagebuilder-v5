# ENT-P-design-system-0013 — inspector.setStyleTarget pela porta inspector-class-bar-target

Fluxo de porta do domínio `design-system`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-inspector.setStyleTarget`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — o controle desenhado chama o `dispatch` da store do editor com o id do comando e os argumentos; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:95` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — lê-se da tabela `UNDOABLE` (do manifesto) se o comando muda o documento; `inspector.setStyleTarget` é desfazível, então `changesDocument` é `true`.
4. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:236` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
6. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
9. `src/app/commands.ts:232` `'inspector.setStyleTarget': setStyleTarget,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-inspector.setStyleTarget`).

## Ramos
- R1 `src/editor/doors/door.tsx:144` `if (file === undefined) {` — o comando desta porta não declara argumento do tipo `file`, `files` nem `clipboard`, então `file` é `undefined` e o caminho segue para a linha 144.
- R2 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/editor/store.ts:247` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:232`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-inspector.setStyleTarget`

## Resultado
- **Estado final:** o `ui.styleTarget` fica com a classe escolhida ou sai (`src/editor/inspector/style-target.ts:44` `return { kind: 'change', ui: name === null ? rest : { ...rest, styleTarget: name } };`); quando a classe faltava e todos a listam, uma definição vazia entra (`src/editor/inspector/style-target.ts:39` `return { kind: 'change', patches: missingClassDefinitions(state.document, [className]), ui: { ...rest, styleTarget: className }, message: message('status.classes.registered', { name: className }) };`).
- **Re-renderizado:** os assinantes ouvem `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`.
- **DOM do editor:** a barra de alvo do inspector marca o chip Elemento ou o chip da classe.
- **DOM do canvas:** nada muda (o comando não muda estilos nem a geometria da página).

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar.
- G3: ok `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta envia só a intenção e o tratador único decide.
- G4: n/a — a porta é um chip da barra de seleção do inspector, não um ponto do canvas `manifest/commands/design-system.json:720` `"kind": "panel-control",`.
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:232`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-inspector.setStyleTarget
- **Argumentos enviados:** `{ target, className }` — o elemento ou a classe; esta porta envia `target` com `element` no chip Elemento ou `class` com `className` no chip de uma classe (`src/editor/shell/class-bar.tsx:73` `args={{ target: ELEMENT }}`, e no chip da classe `args={{ target: CLASS, className: name }}`).
- R1 `src/editor/inspector/style-target.ts:36` `if (target !== ELEMENT && className !== undefined && !classesOf(state.document).some((styleClass) => styleClass.name === className)) {` — no chip Elemento o `target` é `element` e o caminho segue para o passo 13; no chip de uma classe o `className` existe no projeto, então o caminho segue para o passo 13.
- R2 `src/editor/inspector/style-target.ts:38` `if (selected.length > 0 && selected.every((node) => node !== undefined && node.classes.includes(className)))` — o `className` desta porta vem de uma classe que todo selecionado lista (`shared`), então o caminho registra a definição que faltar e escolhe o alvo.
- R3 `src/editor/inspector/style-target.ts:43` `if (name === (state.ui.styleTarget ?? null)) return { kind: 'change' };` — no chip já marcado o alvo novo é o atual e nada muda; num chip diferente, o caminho escreve o `ui`.
