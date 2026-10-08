# ENT-P-style-0153 — style.set#key-enter-in-number-field

- **Comando:** style.set
- **Porta:** key-enter-in-number-field (`manifest/commands/style.json:4917` `"id": "key-enter-in-number-field",`)
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Trecho:** TRC-style.set

## Passos
1. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — a tecla escolhe por qual porta o comando sai; sem gesto nem rajada, é a store do editor.
2. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a tecla entrega a intenção à store do editor.
3. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o comando.
4. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — style.set é desfazível no manifesto, logo o comando muda o documento.
5. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é considerada antes de rodar [lê: EST-L05a-001 via beforeCommand]; o Enter do campo é comando do próprio campo, então roda no contexto da digitação.
6. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, a store do núcleo recebe.
7. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o comando.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o comando entra em `run` [lê: EST-L01-030 via run] [lê: EST-L01-031 via run].
9. `src/core/store/store.ts:400` `const entry = table[id];` — o comando é lido na tabela de comandos.
10. `src/app/commands.ts:389` `'style.set': setStyleCommand,` — a tabela liga style.set ao tratador; aqui começa o trecho TRC-style.set.

## Ramos
- `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — style.set não toma a área de transferência: despacha na hora (este lado); um comando de colagem esperaria pela leitura.
- `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o comando roda agora (este lado); com um gesto aberto e mudança de documento ele espera na fila (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).
- `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — construído: segue; não construído: "ainda não disponível".
- `src/core/store/store.ts:411` `if (invalid !== null) {` — argumento que o comando não toma: recusado; tomado: segue.
- `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade editableSelection vale: segue; não vale: recusado.

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/input/keymap.ts:531`), sem `await`, timer nem ouvinte; a leitura da área de transferência é o outro lado, que esta porta não toma.

## Estado
- Lê: EST-L01-030 (documento, via run), EST-L01-031 (seleção, via run), EST-L05a-001 (digitação pendente, via beforeCommand).
- Escreve: nenhum — a porta só entrega a intenção; a escrita do documento é do trecho.

## Resultado
- **Estado final:** a tecla entrega a intenção; o comando roda no contexto da digitação e o resultado é o do trecho (`src/core/style/set.ts:375` `return { kind: 'change', patches, message: said };`).
- **Re-renderizado:** só a publicação do trecho re-renderiza (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** o caminho da porta não desenha nada; a mensagem do trecho é que aparece.
- **DOM do canvas:** o caminho da porta não desenha nada; o canvas é redesenhado pelo trecho.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o Enter do campo grava no contexto em que a digitação começou.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o comando do próprio campo roda no contexto da digitação, sem forçar gravação de outra.
- G3: ok `src/app/commands.ts:389` `'style.set': setStyleCommand,` — a tecla e o botão entregam a mesma intenção (a propriedade e o texto) ao mesmo tratador.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/input/keymap.ts:531`).
- G5: n/a — o caminho da porta não muda a geometria de painel nem de barra (`src/editor/input/keymap.ts:531`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção continua vindo da store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas desenha a partir do documento da store.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de publicar.

## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/input/keymap.ts:531`).

## Medições
- nenhuma — nenhum passo do caminho usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-style.set
- **Argumentos enviados:** `property` = a propriedade do campo; `value` = o texto do campo; `targets` = ausente neste caminho, o alvo é a seleção.
- R2: `src/core/style/set.ts:400` `if (context === null) return { kind: 'change' as const };` — sem `targets`, os alvos são a seleção; com a seleção não vazia o caminho segue pelo lado "alvo restou".
- R3: `src/core/style/set.ts:407` `if (clash !== undefined) return { kind: 'refused', message: message('status.recipe.conflict', { recipe: propertyName(property, context.rules), property: propertyName(clash.property, context.rules) }) };` — a `property` do campo procura uma receita; sem colisão o caminho segue.
- R4: `src/core/style/set.ts:383` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, context.rules), value }) };` — o `value` é julgado pelo codec da propriedade; não tomado, desvia para a recusa status.value.invalid.
