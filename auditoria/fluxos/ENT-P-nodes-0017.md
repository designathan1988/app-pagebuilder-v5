# ENT-P-nodes-0017 — element.setLayerColor pela porta element.setLayerColor#layers-row-colour-dot

Fluxo de porta do domínio `nodes`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-element.setLayerColor`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o `run` do controle do ponto de cor da linha despacha o id do comando e a intenção (o Início da porta).
2. `src/editor/shell/sidebar/layers.tsx:142` `<DoorControl entry={entry} args={{ target: node.id, color: chosen ?? '' }} tabbable={false} {...(lead ? { icon: null } : {})} />` — o ponto da linha é desenhado com `{ target: node.id, color: chosen ?? '' }`, o nó da linha e a cor que ele já tem (vazia quando não tem).
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos do manifesto da porta mais os que o lugar acrescenta (`{ target: node.id, color }`).
4. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
5. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não pede arquivo, pasta nem área de transferência, então a chamada é direta.
6. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
7. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — `element.setLayerColor` é undoable (`manifest/commands/nodes.json:522` `"undoable": true`), então `changesDocument` é verdadeiro.
8. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
10. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
11. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
12. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
13. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
14. `src/app/commands.ts:340` `'element.setLayerColor': setLayerColorCommand,` — a linha da Chamada do trecho: o tratador único do comando.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — o ponto da linha carrega `{ target: node.id, color }`; o predicado do comando é `always` (`manifest/commands/nodes.json:516` `"predicate": "always",`), então a disponibilidade só depende do comando estar construído.
- R2 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo ou área de transferência, a chamada é direta; com um deles a porta leria o arquivo antes (não é o caso desta porta).
- R3 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, entraria na fila `waiting` (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R4 `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos `{ target, color }` são conferidos contra o manifesto antes de o tratador rodar; `target` e `color` são obrigatórios (`manifest/commands/nodes.json:507` `"optional": false`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/shell/sidebar/layers.tsx:142` `<DoorControl entry={entry} args={{ target: node.id, color: chosen ?? '' }} tabbable={false} {...(lead ? { icon: null } : {})} />` a `src/app/commands.ts:340` `'element.setLayerColor': setLayerColorCommand,`; nenhum passo cita await, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-element.setLayerColor`

## Resultado
- **Estado final:** EST-L01-030 — a lista `layerColors` da raiz da página ganha, troca ou perde a entrada do nó pelo trecho `TRC-element.setLayerColor` (`src/core/nodes/flags.ts:170` `return { kind: 'change', patches: [{ op: 'remove', path: list.length === 1 ? path : [...path, held] }], message: removed };`).
- **Re-renderizado:** todo assinante da store é chamado pelo trecho (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a linha de Camadas desenha a cor (`src/editor/shell/sidebar/layers.tsx:288` `'--row-colour': layerColourCss(colour)`).
- **DOM do canvas:** a moldura do canvas desenha a seleção na cor do nó (`src/editor/canvas/chrome.tsx:1130` `style={layerColour === null ? undefined : ({ '--color-layer-label': layerColourCss(layerColour) } as CSSProperties)}`).

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto da digitação é capturado aqui e entregue à store do núcleo em `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta chega à tabela `src/app/commands.ts:340` `'element.setLayerColor': setLayerColorCommand,` e envia só a intenção.
- G4: n/a — o controle é desenhado no painel Camadas, que ocupa a própria coluna; nada do editor é desenhado sobre o canvas (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não desenha painel nem barra; só despacha o comando (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G6: n/a — a porta não escreve a seleção (`src/app/commands.ts:340` `'element.setLayerColor': setLayerColorCommand,`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/app/commands.ts:340` `'element.setLayerColor': setLayerColorCommand,`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/shell/sidebar/layers.tsx:142` `<DoorControl entry={entry} args={{ target: node.id, color: chosen ?? '' }} tabbable={false} {...(lead ? { icon: null } : {})} />` e `src/app/commands.ts:340` `'element.setLayerColor': setLayerColorCommand,`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-element.setLayerColor
- **Argumentos enviados:** `{ target: node.id, color }` — `target` é o id do nó da linha e `color` é a cor que o ponto carrega; o ponto manda a cor que o nó já tem, ou vazio quando não tem (`src/editor/shell/sidebar/layers.tsx:142` `<DoorControl entry={entry} args={{ target: node.id, color: chosen ?? '' }} tabbable={false} {...(lead ? { icon: null } : {})} />`); as peças da paleta do mesmo controle mandam um valor de token (`src/editor/shell/sidebar/layers.tsx:153` `<span key={token} className="row__swatch" style={{ background: value(token) }} onClick={() => setOpen(false)}><DoorControl entry={entry} args={{ target: node.id, color: token }} tabbable={false} /></span>`) e a peça de retirar manda vazio (`src/editor/shell/sidebar/layers.tsx:146` `{chosen === undefined ? null : <span className="row__swatch row__swatch--none" onClick={() => setOpen(false)}><DoorControl entry={entry} args={{ target: node.id, color: '' }} tabbable={false} /></span>}`).
- R2 `src/core/nodes/flags.ts:158` `if (typeof color !== 'string') throw new Error('element.setLayerColor: a colour is a string');` — `color` chega como texto (a cor guardada, um valor de token ou o vazio), então o caminho não passa pelo lado do lançamento.
- R4 `src/core/nodes/flags.ts:165` `if (typed === '') {` — `color` é o que o ponto carrega; um nó sem cor faz o ponto mandar vazio e o caminho passa pelo lado de retirar, um nó com cor segue para definir.
- R7 `src/core/nodes/flags.ts:173` `if (held >= 0 && list[held]?.colour === typed) return { kind: 'change', message: said };` — o ponto manda a cor que o nó já tem, então o caminho passa por aqui (mensagem, sem patch); um valor de token diferente segue para o patch.
