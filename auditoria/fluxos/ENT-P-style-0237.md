# ENT-P-style-0237

Porta `inspector-box-shadow-shadow-add` do comando `style.setShadows` (tipo comando-porta inspector-field). O trecho do comando é `TRC-style.setShadows`.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta desenhada `inspector-box-shadow-shadow-add` despacha `style.setShadows` com os argumentos do door.
2. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` chamado ali é o da store do editor.
3. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — a store do editor lê do manifesto se o comando é desfazível.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente de um campo é gravada antes da escrita [lê: EST-L05a-001 via beforeCommand].
5. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o comando segue à store do núcleo no contexto capturado.
6. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entra em `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — o tratador é achado na tabela de comandos pelo id.
9. `src/app/commands.ts:418` `'style.setShadows': setShadowsCommand,` — a linha da tabela liga o id ao tratador (a Chamada do trecho).

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
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L01-037 (`ui.styleTarget`), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), EST-L01-032 (histórica), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** o detentor fica com as camadas da sombra escritas na camada `rules.base` (`src/core/style/set.ts:351`), guardadas como estrutura, em uma transação e um passo de desfazer; a mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o editor de sombra passa a exibir as camadas novas.
- **DOM do canvas:** o iframe desenha o elemento com a sombra nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:418` `'style.setShadows': setShadowsCommand,` — o campo, o pad e a alça entregam o mesmo `edit` ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/shadows.ts:174`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/shadows.ts:174`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/shadows.ts:157`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o `css.supports` é a porta de suporte a CSS, não uma medida do navegador.

## Ramos do trecho
- **Trecho:** TRC-style.setShadows
- **Argumentos enviados:** { property: "box-shadow", edit: {"add":true} }
- R2 `src/core/style/shadows.ts:162` `if (fields === undefined) throw new Error(` — a `property` é `box-shadow`; sem estrutura em properties.json lança o defeito, com estrutura segue.
- R3 `src/core/style/shadows.ts:164` `if (primary === null || edit === null || typeof edit !== 'object' || Array.isArray(edit)) return { kind: 'change' };` — o `edit` que esta porta manda é objeto: segue.
- R4 `src/core/style/shadows.ts:168` `const stepped = modifier === 'Shift' && given.nudge !== undefined` — esta porta não manda `nudge`: o fator não se aplica.
- R5 `src/core/style/shadows.ts:170` `if ('refused' in result) return refuse((edit as Record<string, unknown>)[result.refused]);` — camada inexistente, comprimento que não é comprimento, blur negativo ou cor vazia recusam `status.value.invalid`; editado segue.
- R6 `src/core/style/shadows.ts:173` `if (!css.supports(property, text)) return refuse((edit as ShadowEdit).color ?? text);` — camadas que o navegador não aceita recusam `status.value.invalid`; aceitas escreve.
