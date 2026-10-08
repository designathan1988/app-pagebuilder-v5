# TRC-text.selectAll
- **Chamada:** `src/app/commands.ts:438` `'text.selectAll': selectAllText,`
- **Argumentos:** o comando não declara argumentos (`manifest/commands/text.json:573` `"args": {},`); o tratador recebe só o contexto (`HandlerContext`), com o estado.
- **Ramos que dependem dos argumentos:** nenhum — o comando não tem argumentos.

## Passos
1. `src/app/commands.ts:438` `'text.selectAll': selectAllText,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é gravada ou respondida antes de o comando rodar.
3. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — [lê: EST-L01-030 via argumentRefusal] os argumentos são lidos contra o manifesto.
4. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador.
5. `src/editor/canvas/text-edit.ts:127` `export const selectAllText = registerHandler<'text.selectAll', EditorUi>('text.selectAll', ({ state }) => {` — o tratador.
6. `src/editor/canvas/text-edit.ts:128` `if (state.ui.textEdit.node === null) return { kind: 'change' };` — [lê: EST-L01-037 via handlerContext] R1.
7. `src/editor/canvas/text-edit.ts:129` `return { kind: 'change', ui: withEdit(state.ui, { ...state.ui.textEdit, selectAlls: state.ui.textEdit.selectAlls + 1 }) };` — [escreve: EST-L01-037 via run] a contagem de seleções totais sobe.
8. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run] o estado do editor novo entra na mudança.
9. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a contagem nova conta como mudança (em R1 nada muda).
10. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish] publica.
11. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-037 via publish] os assinantes são chamados.

## Ramos
- R1 `src/editor/canvas/text-edit.ts:128` `if (state.ui.textEdit.node === null) return { kind: 'change' };` — nenhum texto editado: `change` sem estado nem mensagem (nada muda); um texto editado: a contagem `selectAlls` sobe (passo 7). A seleção de elementos (`state.selection`) fica como está.

## Fronteiras assíncronas
- nenhuma — o tratador de `src/editor/canvas/text-edit.ts:127` é síncrono e devolve o resultado na chamada.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-033 (a mensagem, via publish), EST-L01-037 (o estado do editor, via run, publish)

## Resultado
- **Estado final:** EST-L01-037 com `ui.textEdit.selectAlls` uma unidade maior por `src/editor/canvas/text-edit.ts:129` `return { kind: 'change', ui: withEdit(state.ui, { ...state.ui.textEdit, selectAlls: state.ui.textEdit.selectAlls + 1 }) };`; em R1 o estado fica como estava.
- **Re-renderizado:** todo assinante da store (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** nada muda — o trecho não escreve mensagem nem prompt.
- **DOM do canvas:** todo o texto editado vira a seleção de texto da página (`src/editor/canvas/frame.tsx:142` `renderer.selectEditedText();`), no ramo do `selectAlls` novo (`src/editor/canvas/frame.tsx:140` `if (edit.selectAlls !== selectAlls) {`).

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:129` `return { kind: 'change', ui: withEdit(state.ui, { ...state.ui.textEdit, selectAlls: state.ui.textEdit.selectAlls + 1 }) };`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada ou respondida antes (`src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/canvas/text-edit.ts:127` `export const selectAllText = registerHandler<'text.selectAll', EditorUi>('text.selectAll', ({ state }) => {` — o único tratador; a porta do manifesto (Ctrl+A no texto editando) chama a mesma linha `src/app/commands.ts:438` `'text.selectAll': selectAllText,`.
- G4: n/a — o tratador muda o estado do editor e não desenha nada sobre o canvas `src/editor/canvas/text-edit.ts:129`.
- G5: n/a — o trecho não desenha painel nem barra `src/editor/canvas/text-edit.ts:129`; as famílias de defeito de painel são medidas na Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção de elementos vem da store, sem cópia local; a seleção de texto é do documento do quadro.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador `src/editor/canvas/text-edit.ts:127`.

## Medições
- nenhuma — nenhum passo usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco.
