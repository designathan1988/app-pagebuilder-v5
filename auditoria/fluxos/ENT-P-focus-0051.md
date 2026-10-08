# ENT-P-focus-0051 — ui.dismiss pela porta overlay-backdrop

- **Comando:** ui.dismiss
- **Porta:** `manifest/commands/focus.json:1219` `"id": "overlay-backdrop",`
- **Painel:** `manifest/commands/focus.json:1224` `"panel": "overlay",`
- **Controle:** `manifest/commands/focus.json:1225` `"control": "backdrop",`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:323` `'ui.dismiss': dismiss,`
- **Trecho:** TRC-ui.dismiss

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta overlay-backdrop entrega a intenção; `given` reúne os argumentos da porta e do contexto (`src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };`) e, para ui.dismiss, é vazio.
2. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` desta porta é o da store do editor.
3. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando (G2). [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o comando segue para o `dispatch` da store do núcleo.
6. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — `run` procura o tratador do comando na tabela da fiação.
9. `src/app/commands.ts:323` `'ui.dismiss': dismiss,` — a linha da tabela liga `ui.dismiss` ao tratador `dismiss`; é por ela que o comando entra no trecho TRC-ui.dismiss.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — a porta só roda quando o comando está construído e a disponibilidade vale; senão nada acontece.
- R2 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — ui.dismiss não toma arquivo (o seu `args` é vazio), então a porta entrega `given` direto (`src/editor/doors/door.tsx:144`); um comando que tomasse arquivo pediria o arquivo ao navegador antes.
- R3 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o comando roda já pelo `dispatch` do núcleo; com um gesto aberto e um comando que não muda o documento, rodaria pelo gesto (`src/editor/store.ts:227` `else if (!changesDocument) result = open.dispatch(id, args);`).

## Fronteiras assíncronas
- nenhuma: o caminho tomado é síncrono — `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` chama o `dispatch` da store, que roda o tratador no mesmo despacho; ui.dismiss não toma arquivo nem área de transferência, e não há timer nem ouvinte nos passos.

## Estado
- lê: EST-L05a-001
- escreve: EST-L05a-001 (a digitação pendente é gravada antes, via `keepTyping` dentro de `beforeCommand`)

## Resultado
- **Estado final:** a porta entrega o comando ao tratador do trecho TRC-ui.dismiss; o estado final é o que aquele trecho registra — `ui.overlays.dismissals` em n+1 e sem `ui.dialog`, `ui.commandBar` e `ui.htmlImport` (`src/editor/menus/overlays.ts:21` `return { kind: 'change', ui: { ...rest, overlays: { dismissals: state.ui.overlays.dismissals + 1 } } };`).
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados pelo trecho (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o trecho fecha o menu aberto quando um descarte novo chega (`src/editor/doors/menu.tsx:236` `const open = grouped ? group.active === menu : openedAt !== null && openedAt === dismissals;`) e devolve o foco ao botão que o abriu (`src/editor/doors/menu.tsx:240` `if (dismissed && (document.activeElement === null || document.activeElement === document.body)) returnFocus.current?.focus();`); nenhum elemento é desenhado pelo caminho da porta.
- **DOM do canvas:** nada muda: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras
- G1: n/a — o comando não grava no documento nem num contexto de edição; o caminho da porta só entrega o comando (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando, salvo com o foco dentro do próprio campo (`src/editor/input/pending.ts:81`) ou com o comando do próprio campo (`src/editor/input/pending.ts:79`).
- G3: ok — as 6 portas de `ui.dismiss` chegam à mesma tabela (`src/app/commands.ts:323` `'ui.dismiss': dismiss,`) e mandam só a intenção; esta porta não decide por conta própria.
- G4: n/a — o caminho da porta não desenha elemento algum sobre o canvas (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não desenha nem mede painel, barra ou rótulo.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso (`src/core/store/store.ts:495`).
- INT: ok — sem `patches` o documento não é tocado (`src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`).

## Limpeza
- Nenhum ouvinte, timer ou observador é criado nos passos desta porta; não há remoção a citar.

## Medições
- nenhuma: os passos desta porta não leem nem calculam valor do navegador; o despacho e a tabela correm antes do trecho.

## Ramos do trecho
- **Trecho:** TRC-ui.dismiss
- **Argumentos enviados:** `{}` — a porta não envia campo nomeado: o `args` do comando é vazio (`manifest/commands/focus.json:1187` `"args": {},`) e a porta não acrescenta nada (`manifest/commands/focus.json:1242` `"args": {}`).
- nenhum ramo do trecho depende dos argumentos: o trecho o registra (`auditoria/fluxos/trechos/TRC-ui.dismiss.md:5` `- **Ramos que dependem dos argumentos:** nenhum`); os valores que esta porta envia deixam todos os ramos do trecho pelo mesmo lado.
