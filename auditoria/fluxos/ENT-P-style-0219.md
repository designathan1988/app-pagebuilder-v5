# ENT-P-style-0219

Porta `inspector-background-image-gradient-add` do comando `style.setBackgroundImage` (tipo comando-porta inspector-field). O trecho do comando é `TRC-style.setBackgroundImage`.

## Passos
1. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta desenhada `inspector-background-image-gradient-add` despacha `style.setBackgroundImage` com os argumentos do door.
2. `src/editor/doors/door.tsx:95` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` chamado ali é o da store do editor.
3. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — a store do editor lê do manifesto se o comando é desfazível.
4. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente de um campo é gravada antes da escrita [lê: EST-L05a-001 via beforeCommand].
5. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o comando segue à store do núcleo no contexto capturado.
6. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entra em `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — o tratador é achado na tabela de comandos pelo id.
9. `src/app/commands.ts:408` `'style.setBackgroundImage': setBackgroundImageCommand,` — a linha da tabela liga o id ao tratador (a Chamada do trecho).

## Ramos
- `src/editor/doors/door.tsx:99` `const files = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'files' && !arg.optional && !(name in given))?.[0];` — o comando não toma um argumento `files` não opcional: este ramo não é tomado.
- `src/editor/doors/door.tsx:108` `const file = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'file' && !arg.optional && !(name in given))?.[0];` — o comando não toma um argumento `file` não opcional: `file` fica indefinido.
- `src/editor/doors/door.tsx:110` `const clipboard = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in given))?.[0];` — o comando não toma a área de transferência: `clipboard` fica indefinido.
- `src/editor/doors/door.tsx:144` `if (file === undefined) {` — verdadeiro: despacha sem pedir arquivo ao navegador.
- `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto: despacha de imediato; com um gesto aberto e um comando que muda o documento, o despacho fica na fila daquele gesto.
- `src/core/store/store.ts:403` `if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();` — um grupo de comandos aberto num comando desfazível: a store recusa com a mensagem do grupo; sem grupo: segue.
- `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o comando construído segue; não construído devolve `not-available-yet`.

## Fronteiras assíncronas
- nenhuma — o caminho do despacho até a linha da tabela não tem `await`, timer nem ouvinte (a porta dispara de um evento já recebido).

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L01-037 (`ui.styleTarget`), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), EST-L01-032 (histórica), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** a `background-image` do detentor fica com o valor lido na camada `rules.base` (`src/core/style/set.ts:351`), em uma transação e um passo de desfazer; a mensagem é a de `writeStyle`. O gradiente removido deixa as outras camadas; sem camada, a declaração sai.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo do endereço passa a exibir o valor.
- **DOM do canvas:** o iframe desenha o elemento com a imagem nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:408` `'style.setBackgroundImage': setBackgroundImageCommand,` — o campo, o editor de gradiente e a alça entregam a mesma intenção ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/background-image.ts:67`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/background-image.ts:67`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/background-image.ts:25`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-style.setBackgroundImage
- **Argumentos enviados:** { property: "background-image", edit: {"add":true} }
- R3 `src/core/style/background-image.ts:39` `if (rest.length === 0) return removeStyle(context, property);` — a porta manda um `edit` de gradiente; sem camada restante a declaração é removida, com camadas escreve o resto.
- R4 `src/core/style/background-image.ts:47` `if ('refused' in edited) {` — gradiente inexistente, paradas abaixo de duas ou valor não tomado recusam; editado segue.
- R5 `src/core/style/background-image.ts:56` `if (typeof value !== 'string') return { kind: 'refused', message: argumentRefused('value') };` — esta porta não manda `value` (manda `edit`): o ramo não é tomado.
- R6 `src/core/style/background-image.ts:61` `if (!read.ok) return { kind: 'refused', message: read.refusal };` — esta porta não manda endereço: o ramo não é tomado.
- R7 `src/core/style/background-image.ts:66` `if (read === null) return { kind: 'refused'` — esta porta manda `edit`, não endereço: o ramo não é tomado.
