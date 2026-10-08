# ENT-P-breakpoints-0004 — breakpoints.setWidth pela porta breakpoints-dialog-width

Fluxo de porta do domínio `breakpoints`. Rastreia o caminho próprio da porta — de `src/editor/shell/breakpoints-dialog.tsx:187` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-breakpoints.setWidth`, que segue daqui. A porta é o campo de largura da linha da tabela, que grava pela submissão do próprio formulário e não por um controle desenhado `src/editor/shell/breakpoints-dialog.tsx:195` `keep(input.current?.value ?? '');`.

## Passos
1. `src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });` — a gravação do campo despacha o id do comando e os argumentos: o ponto de quebra da linha e o número do campo (a largura).
2. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — `breakpoints.setWidth` é desfazível (`manifest/commands/breakpoints.json:179` `"undoable": true,`), então `changesDocument` é `true`.
4. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:236` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
6. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-037 via dispatch]
7. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id (`src/app/commands.ts:453` `'breakpoints.setWidth': setBreakpointWidth,`).
10. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos declarados são conferidos antes do tratador. [lê: EST-L01-030 via argumentRefusal]
11. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-breakpoints.setWidth`).

## Ramos
- R1 `src/editor/shell/breakpoints-dialog.tsx:184` `if (!field.available || typed.trim() === shown) return;` — disponível e com o texto diferente do mostrado: o campo grava; indisponível ou com o mesmo texto: nada é despachado.
- R2 `src/editor/shell/breakpoints-dialog.tsx:185` `const value = numeric ? (typed.trim() === '' ? Number.NaN : Number(typed)) : typed;` — este campo é numérico, então o valor dispachado é `Number` do texto digitado, ou `Number.NaN` quando o campo fica vazio.
- R3 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, ele entraria na fila `waiting` (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R4 `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — o id de `breakpoint` precisa ser da tabela do projeto (`src/core/store/args.ts:44` `return typeof value === 'string' && rules.breakpoints.has(value) ? 'fits' : 'invalid';`) e `width` precisa ser um número finito (`src/core/store/args.ts:37` `if (typeof value !== 'number' || !finite(value)) return 'invalid';`): dentro da declaração o caminho segue; fora dela o despacho para na recusa.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/shell/breakpoints-dialog.tsx:187` a `src/core/store/store.ts:413`; nenhum passo cita `await`, timer, quadro ou ouvinte. A submissão e a saída do campo chamam `keep` de forma síncrona `src/editor/shell/breakpoints-dialog.tsx:183` `const keep = (typed: string) => {`.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L01-030 (via argumentRefusal), EST-L01-031 (via getState e editedKey), EST-L01-037 (via getState e editedKey)
- escreve: EST-L01-030, EST-L01-037 (a gravação efetiva entra no trecho `TRC-breakpoints.setWidth`)

## Resultado
- **Estado final:** inalterado por esta porta; o tratador do trecho `TRC-breakpoints.setWidth` grava a tabela com a largura nova.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-breakpoints.setWidth`.
- **DOM do editor:** nada muda por esta porta `src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar, e um comando que muda o documento grava a digitação antes.
- G3: ok `src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });` — a porta envia só a intenção (o id, o ponto de quebra e a largura) e o tratador único decide.
- G4: n/a — a porta é um campo do diálogo de breakpoints, não um ponto do canvas (`manifest/commands/breakpoints.json:188` `"kind": "panel-control",`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/shell/breakpoints-dialog.tsx:187` e `src/core/store/store.ts:413`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-breakpoints.setWidth
- **Argumentos enviados:** `{ breakpoint, width }` — o campo da linha despacha o ponto de quebra dela e o número digitado (`src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });`), com `arg` sendo a largura e `value` o número do campo (`src/editor/shell/breakpoints-dialog.tsx:185` `const value = numeric ? (typed.trim() === '' ? Number.NaN : Number(typed)) : typed;`).
- R1 `src/editor/view/breakpoint-table.ts:47` `const held = breakpointById(state.document, breakpoint);` — o lado falso: `breakpoint` é o id da linha da tabela, então `held` existe.
- R2 `src/editor/view/breakpoint-table.ts:50` `if (rounded === held.width) return { kind: 'change' };` — depende de `width`: arredondada igual à largura atual, nada é gravado; diferente, segue para `resizedTable`.
- R3 `src/core/document/breakpoints.ts:115` `if (!Number.isInteger(width) || width < min || width > max) return refuse('widthOrder', { name: breakpointWords(held), min, max });` — depende de `width` e do documento (o intervalo entre os vizinhos): fora da ordem recusa `widthOrder`; dentro segue para a tabela nova.
