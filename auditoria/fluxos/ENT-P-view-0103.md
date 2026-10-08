# ENT-P-view-0103

- **Comando:** view.resizeViewport
- **Porta:** `manifest/commands/view.json:3199` `"id": "panel-drag-frame-edge",`
- **Gatilho:** `manifest/commands/view.json:3202` `"source": "frame-edge",` ; `manifest/commands/view.json:3203` `"zone": "canvas-stage",` ; `manifest/commands/view.json:3204` `"gesture": "frame-resize",`
- **Início:** `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);`
- **Tratador:** `src/app/commands.ts:448` `'view.resizeViewport': resizeViewport,`

## Passos

1. `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);` — o arraste da borda do quadro despacha o comando pelo gesto, com o tamanho do quadro no início e a distância [lê: EST-L05a-034 via resize]
2. `src/editor/input/pointer/resize.ts:21` `const distance = axis === 'x' ? Math.round(at.x - start.x) : Math.round(at.y - start.y);` — a distância do arraste, no eixo horizontal ou vertical
3. `src/editor/input/pointer/resize.ts:23` `shared.open = store.gesture();` — o gesto novo, aberto com a store [escreve: EST-L05a-019 via resize]
4. `src/editor/input/pointer/resize.ts:22` `shared.open?.cancel();` — o gesto anterior é cancelado antes de o novo abrir
5. `src/editor/store.ts:216` `keepTyping();` — a abertura do gesto guarda a digitação pendente [escreve: EST-L05a-001 via gesture]
6. `src/editor/store.ts:221` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o `dispatch` do gesto da store do editor
7. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto da store do núcleo entra no `run` com o gesto aberto
8. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` resolve o id na entrada da tabela de comandos
9. `src/app/commands.ts:448` `'view.resizeViewport': resizeViewport,` — a entrada da tabela onde o id nomeia o tratador (a Chamada do trecho)

## Ramos

- R1 `src/editor/input/pointer/resize.ts:18` `if (ps.splitting === null) return;` — sem splitter apertado, a função volta; com ele, o caminho segue para `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);`.
- R2 `src/editor/input/pointer/resize.ts:22` `shared.open?.cancel();` — com um gesto já aberto, ele é cancelado antes de o novo abrir `src/editor/input/pointer/resize.ts:23` `shared.open = store.gesture();`.

## Fronteiras assíncronas

- nenhuma: o caminho da porta é síncrono; a única chamada com fronteira é a do próprio tratador, que a store corre no mesmo despacho e que o trecho já rastreia.

## Estado

- lê: EST-L05a-034
- escreve: EST-L05a-019, EST-L05a-001

## Resultado

- **Estado final:** o comando é entregue ao tratador na tabela `src/app/commands.ts:448` `'view.resizeViewport': resizeViewport,`; o estado que ele escreve está no trecho `fluxos/trechos/TRC-view.resizeViewport.md`.
- **Re-renderizado:** nada muda neste fluxo; quando o tratador publica, a store avisa os seus assinantes `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a alça da borda do quadro aparece como está; a porta só corre o comando.
- **DOM do canvas:** nada muda neste fluxo: a porta não monta remendo algum; o documento só muda quando o tratador publica `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Regras

- G1: n/a — o fluxo de porta para na chamada do tratador `src/app/commands.ts:448` `'view.resizeViewport': resizeViewport,`; a gravação no contexto em que a digitação começou é do tratador e está no trecho.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `src/editor/input/pending.ts:82` `keepTyping();` guarda a digitação pendente antes do comando, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — a única porta de view.resizeViewport chega à tabela `src/app/commands.ts:448` `'view.resizeViewport': resizeViewport,` e envia só a intenção, sem decidir por conta própria.
- G4: n/a — a porta não desenha elemento algum sobre o canvas; `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);` não toca o DOM.
- G5: n/a — a porta não desenha nem mede painel, barra ou rótulo; `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);` só despacha o comando.
- G6: n/a — a porta não escreve a seleção; o resultado do tratador não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — a porta não muda o documento; `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);` só entrega o comando.
- INT: n/a — a porta não escreve no documento; a integridade é do tratador, rastreada no trecho `fluxos/trechos/TRC-view.resizeViewport.md`.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste fluxo; `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);` não abre nenhum, e não há remoção a citar.

## Medições

- nenhuma: os passos citados não leem nem calculam valor que só o navegador calcula; a posição do ponteiro, quando há uma, é medida pelo dono do ponteiro, fora deste rastreamento.

## Ramos do trecho

- **Trecho:** TRC-view.resizeViewport
- **Argumentos enviados:** o manifesto da porta é vazio nenhum campo nomeado `manifest/commands/view.json:3216` `"args": {}`; o arraste envia `size` = a largura do quadro no início `src/editor/input/pointer/resize.ts:19` `const { press, start, from } = ps.splitting;` e `distance` = o deslocamento no eixo `src/editor/input/pointer/resize.ts:21` `const distance = axis === 'x' ? Math.round(at.x - start.x) : Math.round(at.y - start.y);`
- R4 `src/editor/view/frame-edge.ts:15` `const width = Math.round((size ?? viewportWidth(state)) + (2 * distance) / (zoom > 0 ? zoom : 1));` — esta porta envia `size` = a largura do quadro no início do arraste `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);`; com `size` presente, a largura parte dele (o lado da largura mostrada não é tomado).
