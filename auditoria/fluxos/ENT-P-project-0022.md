# ENT-P-project-0022 — project.setCodeLanguage pela porta project.setCodeLanguage#inspector-code-language

Fluxo de porta do domínio `project`. Rastreia o caminho próprio da porta — de `src/editor/shell/panel-field.tsx:79` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-project.setCodeLanguage`, que segue daqui.

## Passos
1. `src/editor/shell/panel-field.tsx:82` `const keep = (event: FormEvent) => {` — o envio do formulário do campo (Enter) começa a guardar o texto digitado.
2. `src/editor/shell/panel-field.tsx:83` `event.preventDefault();` — o envio do formulário não recarrega a página.
3. `src/editor/shell/panel-field.tsx:85` `if (!edited) return;` — sem digitação nova desde o último valor mostrado, nada é guardado. [lê: EST-L09b-005 via keep]
4. `src/editor/shell/panel-field.tsx:86` `setEdited(false);` — o campo volta a mostrar o valor do documento. [escreve: EST-L09b-005 via setEdited]
5. `src/editor/shell/panel-field.tsx:87` `runWith(accept === undefined ? draft : accept(draft));` — o texto digitado (o rascunho, já passado pelo aceite da porta) entra em `runWith`. [lê: EST-L09b-004 via keep]
6. `src/editor/shell/panel-field.tsx:77` `const argument = textArgument(entry, args);` — o argumento livre da porta (`language`), o único que nem a porta nem o desenho dão.
7. `src/editor/shell/panel-field.tsx:78` `if (argument === null || chosen === value) return;` — sem argumento livre, ou texto igual ao mostrado, nada é despachado.
8. `src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });` — a linha de Início: o campo despacha `project.setCodeLanguage` com os argumentos da porta, os do desenho e o texto em `language`.
9. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-036 via gestureSafe]
10. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — `project.setCodeLanguage` tem `"undoable": true` (`manifest/commands/project.json:762` `"undoable": true,`), então `changesDocument` é `true`.
11. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado e o contexto é tomado. [lê: EST-L05a-001 via beforeCommand]
12. `src/editor/store.ts:236` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
13. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
14. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
15. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
16. `src/app/commands.ts:348` `'project.setCodeLanguage': setCodeLanguage,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-project.setCodeLanguage`).

## Ramos
- R1 `src/editor/shell/panel-field.tsx:85` `if (!edited) return;` — sem digitação nova, nada é guardado nem despachado; com digitação, o caminho segue.
- R2 `src/editor/shell/panel-field.tsx:78` `if (argument === null || chosen === value) return;` — sem argumento livre, ou texto igual ao mostrado, nada é despachado; com argumento e texto novo, o caminho segue ao passo 8.
- R3 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo, o lado tomado por esta porta; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R4 `src/editor/store.ts:247` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos, de `src/editor/shell/panel-field.tsx:79` a `src/app/commands.ts:348`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L09b-004 (o rascunho, via keep), EST-L09b-005 (via keep), EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: EST-L09b-005 (via setEdited, na linha 86); a gravação do documento entra no trecho `TRC-project.setCodeLanguage`

## Resultado
- **Estado final:** EST-L01-030, EST-L01-031, EST-L01-032 e EST-L01-033 — com patch, `document.codeLanguage` passa à etiqueta digitada e a seleção e o histórico seguem os do comando (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`); no ramo R2 sem patch, só a mensagem (ou nada) muda. O campo volta a mostrar o valor do documento (`src/editor/shell/panel-field.tsx:106` `value={edited ? draft : display === undefined || value === '' ? value : display(value)}`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o campo de idioma do código do inspector deriva do documento e volta a mostrar o valor novo.
- **DOM do canvas:** nada muda — o comando não altera a estrutura das páginas (`src/core/project/language.ts:27` `const patches = projectLanguagePatches(document, document.language ?? typed, typed).filter((patch) => patch.path[0] !== 'language');`).

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o comando é desfazível, então `changesDocument` é verdadeiro e o caminho toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar.
- G3: ok `src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });` — a porta envia só a intenção (o id do comando e a etiqueta digitada) e o tratador único `src/app/commands.ts:348` `'project.setCodeLanguage': setCodeLanguage,` decide.
- G4: n/a — a porta é o campo do inspector, não um ponto do canvas (`manifest/commands/project.json:771` `"kind": "panel-control",`).
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/shell/panel-field.tsx:79` e `src/app/commands.ts:348`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-project.setCodeLanguage
- **Argumentos enviados:** `{ language }` — `language` é o texto digitado no campo do inspector, enviado como texto (`src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`).
- R1 `src/core/project/language.ts:25` `if (!languageTagAllowed(typed)) return refused(typed);` — o texto digitado passa por `languageTagAllowed` (`src/core/text/language-tag.ts:9` `export function languageTagAllowed(value: string): boolean {`): uma etiqueta válida segue; um texto que não é etiqueta toma o lado da recusa (`src/core/project/language.ts:13` `const refused = (value: string) => ({ kind: 'refused' as const, message: message('status.project.languageInvalid', { value }) });`).
- R2 `src/core/project/language.ts:27` `const patches = projectLanguagePatches(document, document.language ?? typed, typed).filter((patch) => patch.path[0] !== 'language');` — quando a etiqueta digitada é a que o documento já guarda, `projectLanguagePatches` não emite patch para ela (`src/core/export/authoring.ts:14` `return held===value?[]:[{op:held===undefined?'add' as const:'replace' as const,path:[key],value}];`) e o caminho segue sem gravação (`src/core/project/language.ts:28` `return { kind: 'change', patches, ...(patches.length === 0 ? {} : { message: message('status.project.codeLanguageSet', { language: typed }) }) };`); uma etiqueta nova emite um patch.
