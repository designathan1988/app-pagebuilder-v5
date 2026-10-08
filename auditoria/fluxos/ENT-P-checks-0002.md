# ENT-P-checks-0002 — checks.applyFix pela porta checks.applyFix#checks-fix-heading-level

Fluxo de porta do domínio `checks`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:285` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-checks.applyFix`, que segue daqui. O painel desenha este botão com `src/editor/shell/dock.tsx:123` `return fix === undefined ? null : <DoorControl key={issue.rule} entry={fix} args={{ target: issue.node, rule: issue.rule }} className="dock-checks__fix-button" />;`.

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no botão de correção executa `door.run`; estes botões não são telhas (a condição é falsa), então o ramo do clique é `door.run`.
2. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (`rule`) sobre os que o painel acrescenta (`target`).
5. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não lê arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor.
7. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
8. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `checks.applyFix` é desfazível (`manifest/commands/checks.json:47` `"undoable": true,`), então `changesDocument` é `true`.
9. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar. [lê: EST-L05a-001 via beforeCommand]
10. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
11. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-031 via dispatch] [escreve: EST-L01-037 via dispatch]
12. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
13. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
14. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id (`src/app/commands.ts:505` `'checks.applyFix': fixCheck,`).
15. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos declarados são conferidos antes do tratador. [lê: EST-L01-030 via argumentRefusal]
16. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-checks.applyFix`).

## Ramos
- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — construído e disponível: o caminho segue ao despacho; não construído ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — esta porta não manda arquivo (`file`, `files` e `clipboard` indefinidos), então o caminho toma o despacho direto; um comando que lê arquivo seguiria pelos ramos das linhas 99 a 142.
- R3 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, ele entraria na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R4 `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — argumentos dentro da declaração do manifesto: o caminho segue ao tratador; fora dela: o despacho para na recusa.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/core/store/store.ts:413`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L01-030 (via argumentRefusal), EST-L01-031 (via getState e editedKey), EST-L01-037 (via getState e editedKey)
- escreve: EST-L01-030, EST-L01-031, EST-L01-037 (a gravação efetiva entra no trecho `TRC-checks.applyFix`)

## Resultado
- **Estado final:** inalterado por esta porta; o tratador do trecho `TRC-checks.applyFix` escreve o documento ou o estado do editor.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-checks.applyFix`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar, e um comando que muda o documento grava a digitação antes.
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando e os argumentos) e o tratador único decide.
- G4: n/a — a porta é um controle do painel Checks, não um ponto do canvas (`manifest/commands/checks.json:84` `"kind": "panel-control",`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:285` e `src/core/store/store.ts:413`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-checks.applyFix
- **Argumentos enviados:** `{ target, rule }` — `target` é o nó do problema, acrescentado pelo painel (`src/editor/shell/dock.tsx:123` `return fix === undefined ? null : <DoorControl key={issue.rule} entry={fix} args={{ target: issue.node, rule: issue.rule }} className="dock-checks__fix-button" />;`); `rule` é `checks.headingLevel`, o valor que o manifesto fixa para esta porta (`manifest/commands/checks.json:107` `"rule": "checks.headingLevel"`).
- R1 `src/editor/checks/fix.ts:26` `if (issue === undefined || fix === undefined || at === null) return { kind: 'refused', message: message('status.stale') };` — o lado falso: o painel desenha o botão só para um problema que o documento tem, então `issue` e `fix` existem e `at` (o nó de `target`) existe.
- R2 `src/editor/checks/fix.ts:29` `case 'insert':` — o lado falso, porque `rule` não é `checks.formSubmit`.
- R3 `src/editor/checks/fix.ts:31` `case 'next-level': {` — o lado verdadeiro: `rule` é `checks.headingLevel`, cuja correção é `next-level`, então o caminho passa por `element.setTag`.
- R4 `src/editor/checks/fix.ts:35` `case 'reveal': {` — o lado falso, porque `rule` não é uma das regras `reveal`.
