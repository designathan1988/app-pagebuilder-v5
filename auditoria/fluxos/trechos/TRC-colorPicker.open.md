# TRC-colorPicker.open
- **Chamada:** `src/app/commands.ts:401` `'colorPicker.open': openColorPicker,`
- **Argumentos:** `{ property }` — a propriedade cuja cor o seletor abre.
- **Ramos que dependem dos argumentos:** R1 (a seleção sem um elemento).

## Passos
1. `src/app/commands.ts:401` `'colorPicker.open': openColorPicker,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:415` `const predicate = predicates[command.availability.predicate as keyof PredicateTable<Ui>];` — a disponibilidade (`editableSelection`) é conferida antes do tratador.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
7. `src/editor/inspector/color-picker.ts:38` `const primary = state.selection[0] === undefined ? null : locate(state.document, state.selection[0]);` — o elemento primário é achado [lê: EST-L01-030 via locate] [lê: EST-L01-031 via locate].
8. `src/editor/inspector/color-picker.ts:40` `const format = state.ui.colorPicker?.format ?? 'hsb';` — o formato mostrado agora é mantido [lê: EST-L01-037 via handlerContext].
9. `src/editor/inspector/color-picker.ts:41` `return { kind: 'change', ui: { ...state.ui, colorPicker: { property, previous: storedValue(primary.node, property, rules) ?? '', format } } };` — o seletor abre com o valor que o elemento tem [escreve: EST-L01-037 via run].
10. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
11. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
12. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish].
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados; entre eles o dono do ponteiro abre a sessão do seletor [lê: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/inspector/color-picker.ts:39` `if (primary === null) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem um elemento primário: recusa; com um: segue para o passo 8.

## Fronteiras assíncronas
- ao ver `ui.colorPicker` não nulo, o dono do ponteiro abre a sessão (um gesto) num assinante da store: `src/editor/input/pointer/tools.ts:21` `shared.session = store.gesture();` — a sessão dura até o seletor fechar, e cada parte do seletor escreve por ela.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, run, locate, commit), EST-L01-031 (a seleção, via locate, commit), EST-L01-037 (o estado do editor, via run, handlerContext, publish), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (o estado do editor, via run, publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.colorPicker` nomeando a propriedade, o valor anterior e o formato (`src/editor/inspector/color-picker.ts:41`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o seletor e abrem a sessão.
- **DOM do editor:** o seletor de cor abre sobre o painel, com os seus canais (`src/editor/inspector/color-picker.ts:41`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/inspector/color-picker.ts:41`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/inspector/color-picker.ts:37` `export const openColorPicker = registerHandler<'colorPicker.open', EditorUi>('colorPicker.open', ({ state, rules }, { property }) => {` — a única porta (a amostra de cor de um campo) chega ao mesmo tratador com só `property`.
- G4: n/a — o comando muda estado; o seletor abre sobre o painel e o cobrimento no ponto da ação é medido na Fase 6 (`src/editor/inspector/color-picker.ts:41`).
- G5: n/a — o encaixe do seletor é medido na Fase 6 (`src/editor/inspector/color-picker.ts:41`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/inspector/color-picker.ts:41`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/inspector/color-picker.ts:38`); a sessão do ponteiro que o assinante abre é fechada quando o seletor fecha (`src/editor/input/pointer/tools.ts:39` `if (applied) closing.commit();`).

## Medições
- a medir na Fase 6: o encaixe do seletor aberto sobre o painel, nas duas telas (famílias `cut`, `off-window`, `covered`, `english`).
