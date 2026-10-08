# ENT-P-style-0154 — style.set#color-picker-previous

- **Comando:** style.set
- **Porta:** color-picker-previous (`manifest/commands/style.json:4952` `"id": "color-picker-previous",`)
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Trecho:** TRC-style.set

## Passos
1. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — a porta monta os argumentos: os do manifesto desta porta ({}) com os que o lugar acrescenta.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o controle entrega a intenção à store do editor.
3. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` chamado é o da store do editor.
4. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o comando.
5. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — style.set é desfazível no manifesto, logo o comando muda o documento.
6. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é considerada antes de rodar [lê: EST-L05a-001 via beforeCommand].
7. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, a store do núcleo recebe.
8. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o comando.
9. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o comando entra em `run` [lê: EST-L01-030 via run] [lê: EST-L01-031 via run].
10. `src/core/store/store.ts:400` `const entry = table[id];` — o comando é lido na tabela de comandos.
11. `src/app/commands.ts:389` `'style.set': setStyleCommand,` — a tabela liga style.set ao tratador; aqui começa o trecho TRC-style.set.

## Ramos
- `src/editor/doors/door.tsx:143` `if (file === undefined) {` — style.set não toma arquivo: o controle despacha na hora (este lado); um comando que nomeia um arquivo esperaria pela escolha do navegador.
- `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o comando roda agora (este lado); com um gesto aberto e mudança de documento ele espera na fila (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).
- `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — construído: segue; não construído: a porta fica "ainda não disponível".
- `src/core/store/store.ts:411` `if (invalid !== null) {` — argumento que o comando não toma: recusado; tomado: segue.
- `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade editableSelection vale: segue; não vale: o comando é recusado.

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/doors/door.tsx:144`), sem `await`, timer nem ouvinte; as entradas assíncronas do door (arquivo, área de transferência) não valem para style.set, que só toma property, value e targets.

## Estado
- Lê: EST-L01-030 (documento, via run), EST-L01-031 (seleção, via run), EST-L05a-001 (digitação pendente, via beforeCommand).
- Escreve: nenhum — a porta só entrega a intenção; a escrita do documento é do trecho.

## Resultado
- **Estado final:** a porta não altera estado sozinha; o comando roda com o contexto capturado e o resultado é o do trecho (`src/core/style/set.ts:375` `return { kind: 'change', patches, message: said };`).
- **Re-renderizado:** só a publicação do trecho re-renderiza (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** o caminho da porta não desenha nada; a mensagem do trecho é que aparece.
- **DOM do canvas:** o caminho da porta não desenha nada; o canvas é redesenhado pelo trecho.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto da edição viaja até o tratador.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes de o comando mudar o documento.
- G3: ok `src/app/commands.ts:389` `'style.set': setStyleCommand,` — toda porta entrega a mesma intenção (a propriedade e o texto) ao mesmo tratador.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/doors/door.tsx:144`).
- G5: n/a — o caminho da porta não muda a geometria de painel nem de barra (`src/editor/doors/door.tsx:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção continua vindo da store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas desenha a partir do documento da store.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de publicar.

## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — nenhum passo do caminho usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-style.set
- **Argumentos enviados:** `property` = a propriedade que o campo edita; `value` = o texto que a porta carrega; `targets` = ausente neste caminho, porque o door monta `given` sem alvos (quando um campo nomeia alvos, é pelo trecho: `src/editor/shell/field.tsx:564` `(store.dispatch as Dispatch)(command, same ? { property, value } : { property, value, targets: [...targets] }, context);`).
- R2: `src/core/style/set.ts:400` `if (context === null) return { kind: 'change' as const };` — sem `targets`, os alvos desta porta são a seleção; com a seleção não vazia (o predicado editableSelection já a exigiu) o caminho segue pelo lado "alvo restou", não pelo `change` sem efeito.
- R3: `src/core/style/set.ts:407` `if (clash !== undefined) return { kind: 'refused', message: message('status.recipe.conflict', { recipe: propertyName(property, context.rules), property: propertyName(clash.property, context.rules) }) };` — a `property` desta porta procura uma receita; sem colisão com declaração própria o caminho segue, e só a receita em conflito o desviaria.
- R4: `src/core/style/set.ts:383` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, context.rules), value }) };` — o `value` é julgado pelo codec da propriedade; texto que ela não toma desvia para a recusa status.value.invalid, texto tomado segue para a escrita.
