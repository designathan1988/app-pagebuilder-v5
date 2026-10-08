# ENT-P-style-0337

Porta `handle-divider` do comando `element.setDivider` (tipo comando-porta canvas-handle). O trecho do comando é `TRC-element.setDivider`.

## Passos
1. `src/editor/input/pointer/events.ts:314` `ps.spacing.gesture.dispatch(ps.spacing.entry.command.id as CommandId, { ...ps.spacing.entry.door.args, ...ps.spacing.args, [ps.spacing.valueArg]: `${value}px` } as never);` — a faixa de espaçamento despacha `element.setDivider` com o valor em px.
2. `src/editor/input/pointer/events.ts:280` `ps.spacing.gesture = store.gesture();` — o gesto usado foi aberto na store do editor.
3. `src/editor/store.ts:205` `keepTyping();` — a digitação pendente de um campo é gravada ao abrir o gesto [lê: EST-L05a-001 via keepTyping].
4. `src/editor/store.ts:210` `dispatch: (id, args) => gesture.dispatch(id, args),` — o gesto do editor encaminha o despacho ao gesto da store do núcleo.
5. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto do núcleo recebe o despacho.
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto entra em `run`.
7. `src/core/store/store.ts:400` `const entry = table[id];` — o tratador é achado na tabela de comandos pelo id.
8. `src/app/commands.ts:394` `'element.setDivider': setDividerCommand,` — a linha da tabela liga o id ao tratador (a Chamada do trecho).

## Ramos
- `src/editor/store.ts:206` `if (store.commandGroupOpen()) return { dispatch: (id, args) => store.dispatch(id, args), commit: () => undefined, cancel: () => undefined };` — com um grupo de comandos aberto, o gesto encaminha ao `dispatch` da store; sem ele, abre um gesto próprio do núcleo.
- `src/core/store/store.ts:403` `if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();` — grupo aberto num comando desfazível: recusa; sem grupo: segue.
- `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — comando construído segue; não construído devolve `not-available-yet`.

## Fronteiras assíncronas
- nenhuma — o caminho do despacho até a linha da tabela não tem `await`, timer nem ouvinte (a porta dispara de um evento já recebido).

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles` dos dois filhos), EST-L01-032 (histórica), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** os dois filhos da fronteira ficam com a fração da sala como `flex-grow` e base 0 (`src/core/style/divider.ts:74`); os patches entram no gesto do arraste (`src/core/store/store.ts:534`) e o gesto grava um passo de desfazer ao fechar. A mensagem é `status.divider` com as porcentagens.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem.
- **DOM do canvas:** o iframe desenha os dois filhos na proporção nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/divider.ts:75` `    patches.push(...writeDeclarations(where.node, where.path, rules.base, values));`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:394` `'element.setDivider': setDividerCommand,` — a alça entrega só a intenção (a fronteira e a largura) ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/divider.ts:75`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/divider.ts:75`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/divider.ts:47`).

## Medições
- nenhuma — as caixas dos filhos vêm da porta Layout (`src/core/style/divider.ts:57` `  const left = layout.box(before.id as NodeId);`), fora do trecho; nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-element.setDivider
- **Argumentos enviados:** { index: <a fronteira arrastada>, value: <a largura pedida em px>, grow: "flex-grow", basis: "flex-basis", view: "display", axis: "flex-direction" }
- R3 `src/core/style/divider.ts:54` `if (before === undefined || after === undefined) return { kind: 'refused', message: message('status.divider.unavailable', { name: at.node.name }) };` — o `index` da fronteira arrastada sem os dois vizinhos recusa `status.divider.unavailable`; com eles segue.
- R5 `src/core/style/divider.ts:64` `if (!Number.isFinite(asked)) return { kind: 'refused', message: message('status.value.invalid', { value }) };` — o `value` (a largura pedida em px) que não é número recusa `status.value.invalid`; número segue.
