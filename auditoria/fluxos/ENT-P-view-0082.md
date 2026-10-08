# ENT-P-view-0082

- **Comando:** guides.move
- **Porta:** `manifest/commands/view.json:2483` `"id": "canvas-drag-guide-page",`
- **Gatilho:** `manifest/commands/view.json:2486` `"source": "guide",` ; `manifest/commands/view.json:2487` `"zone": "page",` ; `manifest/commands/view.json:2488` `"gesture": "guide-drag",`
- **Início:** `src/editor/input/pointer/events.ts:345` `} else if (ps.guiding.guide !== null && GUIDE_MOVE !== null) ps.guiding.gesture.dispatch(GUIDE_MOVE.command.id as CommandId, { ...GUIDE_MOVE.door.args, guide: ps.guiding.guide, at } as never);`
- **Tratador:** `src/app/commands.ts:470` `'guides.move': moveGuideCommand,`

## Passos

1. `src/editor/input/pointer/events.ts:345` `} else if (ps.guiding.guide !== null && GUIDE_MOVE !== null) ps.guiding.gesture.dispatch(GUIDE_MOVE.command.id as CommandId, { ...GUIDE_MOVE.door.args, guide: ps.guiding.guide, at } as never);` — o arraste no canvas despacha o comando pelo gesto, com os argumentos [lê: EST-L05a-034 via onMove]
2. `src/editor/input/pointer/events.ts:340` `const at = Math.max(0, Math.round(ps.guiding.axis === 'horizontal' ? point.y : point.x));` — a posição `at`, em px da página
3. `src/editor/input/pointer/events.ts:327` `ps.guiding.gesture = store.gesture();` — o gesto do arraste foi aberto com a store, ao passar o limiar [escreve: EST-L05a-034 via onMove]
4. `src/editor/store.ts:217` `keepTyping();` — a abertura do gesto guarda a digitação pendente [escreve: EST-L05a-001 via gesture]
5. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o `dispatch` do gesto da store do editor
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto da store do núcleo entra no `run` com o gesto aberto
7. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` resolve o id na entrada da tabela de comandos
8. `src/app/commands.ts:470` `'guides.move': moveGuideCommand,` — a entrada da tabela onde o id nomeia o tratador (a Chamada do trecho)

## Ramos

- R1 `src/editor/input/pointer/events.ts:325` `if (ps.guiding.gesture === null) {` — antes de passar o limiar, o gesto do arraste é aberto `src/editor/input/pointer/events.ts:327` `ps.guiding.gesture = store.gesture();`; depois, ele é usado.
- R2 `src/editor/input/pointer/events.ts:338` `if (onOwnRuler) return;` — sobre a própria régua, o arraste volta sem despachar; fora dela, calcula a posição e despacha.
- R3 `src/editor/input/pointer/events.ts:342` `if (ps.guiding.guide === null && create) {` — sem guia segurada, o arraste cria uma guia `src/editor/input/pointer/events.ts:343` `ps.guiding.gesture.dispatch(create.command.id as CommandId, { ...create.door.args, axis: ps.guiding.axis, at } as never);`; com uma guia segurada, move-a `src/editor/input/pointer/events.ts:345` `} else if (ps.guiding.guide !== null && GUIDE_MOVE !== null) ps.guiding.gesture.dispatch(GUIDE_MOVE.command.id as CommandId, { ...GUIDE_MOVE.door.args, guide: ps.guiding.guide, at } as never);`.
- R4 `src/editor/input/pointer/events.ts:484` `if (gesture === null) return;` — o arraste que nunca passou o limiar não tem gesto: volta sem despachar; com gesto, o caminho segue.
- R5 `src/editor/input/pointer/events.ts:491` `if (dropped && guide !== null && GUIDE_DELETE !== null) gesture.dispatch(GUIDE_DELETE.command.id as CommandId, { ...GUIDE_DELETE.door.args, guide } as never);` — largada sobre a própria régua com uma guia segurada: o arraste apaga-a; largada fora dela, o gesto só fecha `src/editor/input/pointer/events.ts:492` `gesture.commit();`.

## Fronteiras assíncronas

- nenhuma: o caminho da porta é síncrono; a única chamada com fronteira é a do próprio tratador, que a store corre no mesmo despacho e que o trecho já rastreia.

## Estado

- lê: EST-L05a-034
- escreve: EST-L05a-001

## Resultado

- **Estado final:** o comando é entregue ao tratador na tabela `src/app/commands.ts:470` `'guides.move': moveGuideCommand,`; o estado que ele escreve está no trecho `fluxos/trechos/TRC-guides.move.md`.
- **Re-renderizado:** nada muda neste fluxo; quando o tratador publica, a store avisa os seus assinantes `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a guia não é desenhada por esta porta; só despacha o comando.
- **DOM do canvas:** nada muda neste fluxo: a porta não monta remendo algum; o documento só muda quando o tratador publica `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Regras

- G1: n/a — o fluxo de porta para na chamada do tratador `src/app/commands.ts:470` `'guides.move': moveGuideCommand,`; a gravação no contexto em que a digitação começou é do tratador e está no trecho.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `src/editor/input/pending.ts:82` `keepTyping();` guarda a digitação pendente antes do comando, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as 5 portas de guides.move chegam à mesma tabela `src/app/commands.ts:470` `'guides.move': moveGuideCommand,` e enviam só a intenção.
- G4: n/a — a porta não desenha elemento algum sobre o canvas; `src/editor/input/pointer/events.ts:345` `} else if (ps.guiding.guide !== null && GUIDE_MOVE !== null) ps.guiding.gesture.dispatch(GUIDE_MOVE.command.id as CommandId, { ...GUIDE_MOVE.door.args, guide: ps.guiding.guide, at } as never);` não toca o DOM.
- G5: n/a — a porta não desenha nem mede painel, barra ou rótulo; `src/editor/input/pointer/events.ts:345` `} else if (ps.guiding.guide !== null && GUIDE_MOVE !== null) ps.guiding.gesture.dispatch(GUIDE_MOVE.command.id as CommandId, { ...GUIDE_MOVE.door.args, guide: ps.guiding.guide, at } as never);` só despacha o comando.
- G6: n/a — a porta não escreve a seleção; o resultado do tratador não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — a porta não muda o documento; `src/editor/input/pointer/events.ts:345` `} else if (ps.guiding.guide !== null && GUIDE_MOVE !== null) ps.guiding.gesture.dispatch(GUIDE_MOVE.command.id as CommandId, { ...GUIDE_MOVE.door.args, guide: ps.guiding.guide, at } as never);` só entrega o comando.
- INT: n/a — a porta não escreve no documento; a integridade é do tratador, rastreada no trecho `fluxos/trechos/TRC-guides.move.md`.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste fluxo; `src/editor/input/pointer/events.ts:345` `} else if (ps.guiding.guide !== null && GUIDE_MOVE !== null) ps.guiding.gesture.dispatch(GUIDE_MOVE.command.id as CommandId, { ...GUIDE_MOVE.door.args, guide: ps.guiding.guide, at } as never);` não abre nenhum, e não há remoção a citar.

## Medições

- nenhuma: os passos citados não leem nem calculam valor que só o navegador calcula; a posição do ponteiro, quando há uma, é medida pelo dono do ponteiro, fora deste rastreamento.

## Ramos do trecho

- **Trecho:** TRC-guides.move
- **Argumentos enviados:** `guide` = o id da guia segurada e `at` = a posição do arraste em px da página; os do manifesto da porta são vazios: nenhum campo nomeado `manifest/commands/view.json:2500` `"args": {}`
- R3 `src/core/page/guides.ts:59` `if (held === null) return stale;` — esta porta envia `guide` = o id da guia segurada `src/editor/input/pointer/events.ts:345` `} else if (ps.guiding.guide !== null && GUIDE_MOVE !== null) ps.guiding.gesture.dispatch(GUIDE_MOVE.command.id as CommandId, { ...GUIDE_MOVE.door.args, guide: ps.guiding.guide, at } as never);`; existindo na página, o lado `stale` não é tomado e o caminho segue para `src/core/page/guides.ts:61` `if (at === undefined && (delta === undefined || (along !== undefined && along !== alongOf(held)))) return { kind: 'change' };`.
- R4 `src/core/page/guides.ts:61` `if (at === undefined && (delta === undefined || (along !== undefined && along !== alongOf(held)))) return { kind: 'change' };` — esta porta envia `at` como um número `src/editor/input/pointer/events.ts:340` `const at = Math.max(0, Math.round(ps.guiding.axis === 'horizontal' ? point.y : point.x));`; com `at` presente, a condição é falsa e o caminho segue para `src/core/page/guides.ts:62` `if (held.locked === true) return { kind: 'refused', message: message('status.guides.locked') };`.
