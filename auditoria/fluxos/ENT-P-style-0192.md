# ENT-P-style-0192

Porta `inspector-spacing-link` do comando `inspector.toggleSpacingLink` (tipo comando-porta panel-control). O trecho do comando é `TRC-inspector.toggleSpacingLink`.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta desenhada `inspector-spacing-link` despacha `inspector.toggleSpacingLink` com os argumentos do door.
2. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` chamado ali é o da store do editor.
3. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — a store do editor lê do manifesto se o comando é desfazível.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente de um campo é gravada antes da escrita [lê: EST-L05a-001 via beforeCommand].
5. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o comando segue à store do núcleo no contexto capturado.
6. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entra em `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — o tratador é achado na tabela de comandos pelo id.
9. `src/app/commands.ts:395` `'inspector.toggleSpacingLink': toggleSpacingLink,` — a linha da tabela liga o id ao tratador (a Chamada do trecho).

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
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L01-037 (`ui.styleTarget`, `ui.spacingLinks`), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-037 (`ui.spacingLinks`), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** `ui.spacingLinks[node][box]` fica com o oposto do elo anterior (`src/editor/inspector/spacing.ts:36`); o documento e a seleção não mudam (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`). A mensagem é `status.spacing.linked` ou `status.spacing.unlinked`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o botão do elo passa a marcar ligado ou desligado.
- **DOM do canvas:** nada muda — o comando não devolve patch e `src/core/store/store.ts:542` publica com a lista vazia.

## Regras
- G1: n/a — o trecho não grava no documento por um campo de digitação; escreve só o estado do editor (`src/editor/inspector/spacing.ts:36`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:395` `'inspector.toggleSpacingLink': toggleSpacingLink,` — as portas entregam a mesma caixa ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/inspector/spacing.ts:36`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/inspector/spacing.ts:36`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: n/a — o trecho não escreve no documento; só o `ui` muda (`src/editor/inspector/spacing.ts:36`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/inspector/spacing.ts:27`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-inspector.toggleSpacingLink
- **Argumentos enviados:** { box: <a caixa que o elo representa: padding ou margin> }
- R1 `src/editor/inspector/spacing.ts:21` `if (chosen !== undefined) return chosen;` — o `box` é a caixa que o elo representa; a escolha guardada da pessoa vence a leitura dos quatro lados do elemento.
