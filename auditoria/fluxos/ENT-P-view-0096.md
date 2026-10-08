# ENT-P-view-0096

- **Comando:** snap.setSettings
- **Porta:** `manifest/commands/view.json:2943` `"id": "snap-settings-apply",`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:475` `'snap.setSettings': setSnapSettings,`

## Passos

1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta aciona o comando, com o objeto `given` montado a partir dos argumentos dela e dos que o controle acrescenta
2. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos que ela envia
3. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o despacho é o da store do editor
4. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — o `dispatch` da store do editor
5. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — se o comando grava no documento, pela tabela do manifesto
6. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store guarda a digitação pendente antes do comando, no contexto em que foi feita [lê: EST-L05a-001 via beforeCommand] [escreve: EST-L05a-001 via keepTyping]
7. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho passa à store do núcleo
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo entra no `run`
9. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` resolve o id na entrada da tabela de comandos
10. `src/app/commands.ts:475` `'snap.setSettings': setSnapSettings,` — a entrada da tabela onde o id nomeia o tratador (a Chamada do trecho)

## Ramos

- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — o comando não construído ou o predicado da porta recusando agora: o clique não corre nada; construído e disponível, o caminho segue para `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- R2 `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — um controle cujos apertos o dono do ponteiro corre só se aciona na ativação sem aperto; qualquer outro corre no clique.
- R3 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho passa à store do núcleo; com um gesto aberto e um comando que não muda o documento, vai pelo gesto `src/editor/store.ts:227` `else if (!changesDocument) result = open.dispatch(id, args);`; mudando o documento, espera o gesto fechar `src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`.
- R4 `src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {` — a digitação pendente: sem digitação, devolve nada `src/editor/input/pending.ts:78` `if (typing === null) return undefined;`; sendo o comando do próprio campo, devolve o contexto da digitação `src/editor/input/pending.ts:79` `if (typing.owns(id, (args ?? {}) as Readonly<Record<string, unknown>>)) return typing.context;`; com o foco no campo e um comando que não muda o documento, deixa a digitação como está `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`; em qualquer outra, guarda-a antes `src/editor/input/pending.ts:82` `keepTyping();`.

## Fronteiras assíncronas

- nenhuma: o caminho da porta é síncrono; a única chamada com fronteira é a do próprio tratador, que a store corre no mesmo despacho e que o trecho já rastreia.

## Estado

- lê: EST-L05a-001
- escreve: EST-L05a-001

## Resultado

- **Estado final:** o comando é entregue ao tratador na tabela `src/app/commands.ts:475` `'snap.setSettings': setSnapSettings,`; o estado que ele escreve está no trecho `fluxos/trechos/TRC-snap.setSettings.md`.
- **Re-renderizado:** nada muda neste fluxo; quando o tratador publica, a store avisa os seus assinantes `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** o diálogo de ajustes do encaixe mostra o que está em vigor; a porta só corre o comando.
- **DOM do canvas:** nada muda neste fluxo: a porta não monta remendo algum; o documento só muda quando o tratador publica `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Regras

- G1: n/a — o fluxo de porta para na chamada do tratador `src/app/commands.ts:475` `'snap.setSettings': setSnapSettings,`; a gravação no contexto em que a digitação começou é do tratador e está no trecho.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `src/editor/input/pending.ts:82` `keepTyping();` guarda a digitação pendente antes do comando, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — a única porta de snap.setSettings chega à tabela `src/app/commands.ts:475` `'snap.setSettings': setSnapSettings,` e envia só a intenção, sem decidir por conta própria.
- G4: n/a — a porta não desenha elemento algum sobre o canvas; `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` não toca o DOM.
- G5: n/a — a porta não desenha nem mede painel, barra ou rótulo; `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` só despacha o comando.
- G6: n/a — a porta não escreve a seleção; o resultado do tratador não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — a porta não muda o documento; `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` só entrega o comando.
- INT: n/a — a porta não escreve no documento; a integridade é do tratador, rastreada no trecho `fluxos/trechos/TRC-snap.setSettings.md`.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste fluxo; `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` não abre nenhum, e não há remoção a citar.

## Medições

- nenhuma: os passos citados não leem nem calculam valor que só o navegador calcula; a posição do ponteiro, quando há uma, é medida pelo dono do ponteiro, fora deste rastreamento.

## Ramos do trecho

- **Trecho:** TRC-snap.setSettings
- **Argumentos enviados:** nenhum campo nomeado `manifest/commands/view.json:2966` `"args": {}`; o diálogo acrescenta `targets` e `distance`
- R3 `src/editor/view/snap.ts:61` `if (!Array.isArray(targets) || targets.some((t) => typeof t !== 'string' || !SNAP_TARGETS.includes(t))) throw new Error(`snap.setSettings: targets is a list of ${SNAP_TARGETS.join(', ')}`);` — `targets` que o diálogo manda: uma lista de ids que o encaixe oferece; o lado do lançamento não é tomado e o caminho segue para `src/editor/view/snap.ts:62` `if (!withinRange(distance)) return { kind: 'refused', message: message('status.snap.distanceRange') };`.
- R4 `src/editor/view/snap.ts:62` `if (!withinRange(distance)) return { kind: 'refused', message: message('status.snap.distanceRange') };` — `distance` que o diálogo manda: fora do alcance, o comando é recusado com `status.snap.distanceRange`; dentro dele, o caminho segue para `src/editor/view/snap.ts:64` `const byDefault = distance === SNAP_DISTANCE && kept.length === SNAP_TARGETS.length;`.
- R5 `src/editor/view/snap.ts:64` `const byDefault = distance === SNAP_DISTANCE && kept.length === SNAP_TARGETS.length;` — os `targets` e a `distance` que o diálogo manda: sendo os valores de origem, as preferências ficam sem `snapSettings`; fora deles, guardam a lista e a distância.
