# ENT-P-breakpoints-0003 — breakpoints.rename pela porta breakpoints-dialog-name

Fluxo de porta do domínio `breakpoints`. Rastreia o caminho próprio da porta — de `src/editor/shell/breakpoints-dialog.tsx:187` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-breakpoints.rename`, que segue daqui. A porta é o campo de nome da linha da tabela, que grava pela submissão do próprio formulário e não por um controle desenhado `src/editor/shell/breakpoints-dialog.tsx:195` `keep(input.current?.value ?? '');`.

## Passos
1. `src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });` — a gravação do campo despacha o id do comando e os argumentos: o ponto de quebra da linha e o valor digitado no campo (o nome).
2. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `breakpoints.rename` é desfazível (`manifest/commands/breakpoints.json:117` `"undoable": true,`), então `changesDocument` é `true`.
4. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
6. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-030 via dispatch]
7. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id (`src/app/commands.ts:452` `'breakpoints.rename': renameBreakpoint,`).
10. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos declarados são conferidos antes do tratador. [lê: EST-L01-030 via argumentRefusal]
11. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-breakpoints.rename`).

## Ramos
- R1 `src/editor/shell/breakpoints-dialog.tsx:184` `if (!field.available || typed.trim() === shown) return;` — disponível e com o texto diferente do mostrado: o campo grava; indisponível ou com o mesmo texto: nada é despachado.
- R2 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, ele entraria na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — o id de `breakpoint` precisa ser da tabela do projeto (`src/core/store/args.ts:44` `return typeof value === 'string' && rules.breakpoints.has(value) ? 'fits' : 'invalid';`): dentro dela o caminho segue ao tratador; fora dela o despacho para na recusa.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/shell/breakpoints-dialog.tsx:187` a `src/core/store/store.ts:413`; nenhum passo cita `await`, timer, quadro ou ouvinte. A submissão e a saída do campo chamam `keep` de forma síncrona `src/editor/shell/breakpoints-dialog.tsx:183` `const keep = (typed: string) => {`.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L01-030 (via argumentRefusal), EST-L01-031 (via getState e editedKey), EST-L01-037 (via getState e editedKey)
- escreve: EST-L01-030 (a gravação efetiva entra no trecho `TRC-breakpoints.rename`)

## Resultado
- **Estado final:** inalterado por esta porta; o tratador do trecho `TRC-breakpoints.rename` grava a tabela com o nome novo.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-breakpoints.rename`.
- **DOM do editor:** nada muda por esta porta `src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar, e um comando que muda o documento grava a digitação antes.
- G3: ok `src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });` — a porta envia só a intenção (o id, o ponto de quebra e o nome) e o tratador único decide.
- G4: n/a — a porta é um campo do diálogo de breakpoints, não um ponto do canvas (`manifest/commands/breakpoints.json:126` `"kind": "panel-control",`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/shell/breakpoints-dialog.tsx:187` e `src/core/store/store.ts:413`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-breakpoints.rename
- **Argumentos enviados:** `{ breakpoint, name }` — o campo da linha despacha o ponto de quebra dela e o texto digitado (`src/editor/shell/breakpoints-dialog.tsx:187` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, breakpoint: breakpoint.id, [arg]: value });`), com `arg` sendo o nome (`src/editor/shell/breakpoints-dialog.tsx:29` `const keptArg = (entry: DoorEntry): string => Object.keys(entry.command.args).find((name) => entry.command.args[name]?.type !== 'breakpoint') ?? '';`).
- R1 `src/editor/view/breakpoint-table.ts:37` `const held = breakpointById(state.document, breakpoint);` — o lado falso: `breakpoint` é o id da linha da tabela, então `held` existe.
- R2 `src/editor/view/breakpoint-table.ts:39` `const table = renamedTable(breakpointsOf(state.document), breakpoint, typeof name === 'string' ? name : '', (key) => words(key));` — o lado verdadeiro: `name` é o texto digitado, uma cadeia de caracteres.
- R4 `src/core/document/breakpoints.ts:103` `if (typed === '') return refuse('nameEmpty');` — depende de `name`: vazio recusa `nameEmpty`; com texto segue.
- R5 `src/core/document/breakpoints.ts:104` `if (table.some((b) => b.id !== id && breakpointName(b, words).toLocaleLowerCase() === typed.toLocaleLowerCase())) return refuse('nameTaken', { name: typed });` — depende de `name` e do documento: um nome já mostrado por outro ponto de quebra recusa `nameTaken`; livre segue.
