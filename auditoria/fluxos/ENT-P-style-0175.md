# ENT-P-style-0175

Porta `inspector-padding-right-box-model` do comando `style.setSpacing` (tipo comando-porta inspector-field). O trecho do comando é `TRC-style.setSpacing`.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta desenhada `inspector-padding-right-box-model` despacha `style.setSpacing` com os argumentos do door.
2. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` chamado ali é o da store do editor.
3. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — a store do editor lê do manifesto se o comando é desfazível.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente de um campo é gravada antes da escrita [lê: EST-L05a-001 via beforeCommand].
5. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o comando segue à store do núcleo no contexto capturado.
6. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entra em `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — o tratador é achado na tabela de comandos pelo id.
9. `src/app/commands.ts:390` `'style.setSpacing': setSpacingCommand,` — a linha da tabela liga o id ao tratador (a Chamada do trecho).

## Ramos
- `src/editor/doors/door.tsx:98` `const files = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'files' && !arg.optional && !(name in given))?.[0];` — o comando não toma um argumento `files` não opcional: este ramo não é tomado.
- `src/editor/doors/door.tsx:107` `const file = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'file' && !arg.optional && !(name in given))?.[0];` — o comando não toma um argumento `file` não opcional: `file` fica indefinido.
- `src/editor/doors/door.tsx:109` `const clipboard = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in given))?.[0];` — o comando não toma a área de transferência: `clipboard` fica indefinido.
- `src/editor/doors/door.tsx:143` `if (file === undefined) {` — verdadeiro: despacha sem pedir arquivo ao navegador.
- `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto: despacha de imediato; com um gesto aberto e um comando que muda o documento, o despacho fica na fila daquele gesto.
- `src/core/store/store.ts:403` `if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();` — um grupo de comandos aberto num comando desfazível: a store recusa com a mensagem do grupo; sem grupo: segue.
- `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o comando construído segue; não construído devolve `not-available-yet`.

## Fronteiras assíncronas
- nenhuma — o caminho do despacho até a linha da tabela não tem `await`, timer nem ouvinte (a porta dispara de um evento já recebido).

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), EST-L01-032 (histórica), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** os longhands da caixa ficam com o valor lido na camada `rules.base` (`src/core/style/spacing.ts:40`), em uma transação e um passo de desfazer; a mensagem é `status.spacing.set` ou `status.style.setMany`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo da caixa passa a exibir o valor.
- **DOM do canvas:** o iframe desenha o elemento com o espaçamento novo pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/spacing.ts:37` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:390` `'style.setSpacing': setSpacingCommand,` — o campo e a faixa entregam o mesmo valor ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/spacing.ts:43`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/spacing.ts:43`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/spacing.ts:20`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-style.setSpacing
- **Argumentos enviados:** { box: "padding", sides: "right", value: <o texto do campo> }
- R1 `src/core/style/spacing.ts:27` `if (first === undefined) throw new Error(` — a porta manda `box` `padding` e `sides` `right`; um lado escreve o longhand daquele lado.
- R2 `src/core/style/spacing.ts:34` `if (box === NO_NEGATIVE && /^\s*-/.test(value) && Number.parseFloat(value) < 0) return { kind: 'refused', message: message('status.value.negativePadding') };` — a caixa é `padding`; um valor negativo recusa `status.value.negativePadding`; não negativo segue.
- R3 `src/core/style/spacing.ts:36` `if (read === null) return { kind: 'refused'` — o `value` (o texto do campo, ou os px medidos) lido pelo codec do longhand; não tomado recusa `status.value.invalid`; tomado escreve.
