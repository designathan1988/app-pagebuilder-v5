# ENT-P-nodes-0012 — element.toggleLock pela porta element.toggleLock#command-bar

Fluxo de porta do domínio `nodes`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-element.toggleLock`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o `run` do controle da barra de comandos despacha o id do comando e a intenção (o Início da porta).
2. `src/editor/shell/command-bar.tsx:275` `<DoorControl entry={e.entry} args={e.args} label={e.label} className="command-bar__entry" tabbable={false} icon={icon ?? null}>` — a entrada desenha um `DoorControl` com os argumentos da entrada; para uma entrada de comando, `e.args` é o objeto vazio (`src/editor/shell/command-bar.tsx:131` `return [{ entry, args: {}, label: t(entry.door.labelKey as MessageId, labelParamsOf(entry, state)), key: entryKey(entry, {}) }];`).
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos do manifesto da porta mais os que a barra acrescenta (nenhum, para esta entrada).
4. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
5. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não pede arquivo, pasta nem área de transferência, então a chamada é direta.
6. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
7. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `element.toggleLock` é undoable (`manifest/commands/nodes.json:280` `"undoable": true`), então `changesDocument` é verdadeiro.
8. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
10. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
11. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
12. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
13. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
14. `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,` — a linha da Chamada do trecho: o tratador único do comando.

## Ramos
- R1 `src/editor/shell/command-bar.tsx:62` `const runs = (entry: (typeof BAR_DOORS)[number], args: Readonly<Record<string, unknown>>) => isDoorBuilt(entry) && appliesNow(entry, args, store);` — a entrada só é oferecida quando o comando corre agora; com algo selecionado, `targetOrSelection` sem argumento segura e a entrada aparece.
- R2 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — indisponível, o controle não despacha; disponível, segue.
- R3 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo ou área de transferência, a chamada é direta; com um deles a porta leria o arquivo antes (não é o caso desta porta).
- R4 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, entraria na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/shell/command-bar.tsx:275` `<DoorControl entry={e.entry} args={e.args} label={e.label} className="command-bar__entry" tabbable={false} icon={icon ?? null}>` a `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`; nenhum passo cita await, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-element.toggleLock`

## Resultado
- **Estado final:** EST-L01-030 — o flag `locked` do nó ganha `true` ou some pelo trecho `TRC-element.toggleLock` (`src/core/nodes/flags.ts:109` `if (at.node[flag] === true) return { kind: 'change', patches: [{ op: 'remove', path }], message: message(off, { name }) };`).
- **Re-renderizado:** todo assinante da store é chamado pelo trecho (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de comandos fecha e a linha de Camadas do nó ganha ou solta a marca do trancado (`src/editor/shell/sidebar/layers.tsx:284` `node.locked === true ? ' row--locked' : ''`).
- **DOM do canvas:** nada muda — o renderizador marca só o nó oculto (`src/editor/canvas/render/render.ts:708` `if (node.hidden === true) wanted.set(HIDDEN_ATTRIBUTE, '');`).

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto da digitação é capturado aqui e entregue à store do núcleo em `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta chega à tabela `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,` e envia só a intenção.
- G4: n/a — a entrada é desenhada na barra de comandos, fora do canvas; nada do editor cobre o ponto da ação no canvas (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não desenha painel nem barra; só despacha o comando (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G6: n/a — a porta não escreve a seleção (`src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/shell/command-bar.tsx:275` `<DoorControl entry={e.entry} args={e.args} label={e.label} className="command-bar__entry" tabbable={false} icon={icon ?? null}>` e `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-element.toggleLock
- **Argumentos enviados:** nenhum — a porta entrega o objeto vazio (`manifest/commands/nodes.json:374` `"args": {}`), o mesmo que o comando carrega na entrada da barra.
- R1 `src/core/nodes/flags.ts:101` `const id = typeof target === 'string' ? (target as NodeId) : selection[0];` — esta porta não manda `target`, então o caminho passa pelo lado do primeiro selecionado, e não pelo do nó nomeado.
