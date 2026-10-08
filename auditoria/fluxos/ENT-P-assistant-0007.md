# ENT-P-assistant-0007 — assistant.send pela porta assistant.send#assistant-send

Fluxo de porta do domínio `assistant`. Rastreia o caminho próprio da porta — o botão "Enviar" do rodapé da conversa, desenhado por `DoorControl` — até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-assistant.send`, que segue daqui.

## Passos
1. `src/editor/assistant/surface.tsx:15` `    <footer>{door('assistant-input', { value: draft, disabled: busy })}{door('assistant-reference', { disabled: busy })}{busy ? door('assistant-cancel', {}) : door('assistant-send', { disabled: !configured || !draft.trim() })}</footer>` — o painel pede o controle "Enviar" quando o assistente não está ocupado.
2. `src/editor/assistant/panel.tsx:67` `return <DoorControl entry={entry} ready={props.disabled !== true} />;` — o desenhador devolve o `DoorControl` para esta porta.
3. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle roda `door.run`; o `pointerRuns` lido em `src/editor/doors/door.tsx:264` `const pointerRuns = pressedByPointer(entry);` é falso, porque `pressedByPointer` só é verdadeiro para um controle cujo `drawnAs` é `item` (`src/editor/input/pointer/common.ts:299`).
4. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — comando não construído ou indisponível não roda (o botão "Enviar" fica indisponível sem chave, conexão ou texto).
5. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos da porta (o manifesto não fixa nenhum, `manifest/commands/assistant.json:367` `"args": {}`).
6. `src/editor/doors/door.tsx:107` `const file = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'file' && !arg.optional && !(name in given))?.[0];` — o comando não declara argumento `file`, então ele é `undefined`.
7. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem arquivo, o caminho segue para a linha seguinte.
8. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção à store do editor. O `dispatch` é ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
9. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
10. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — `assistant.send` não é desfazível (`manifest/commands/assistant.json:340` `"undoable": false`).
11. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [lê: EST-L05a-038 via o dispatch da store do editor]
12. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
13. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo chama o `run`.
14. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` busca o tratador do id na tabela.
15. `src/app/commands.ts:183` `'assistant.send': sendAssistant,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-assistant.send`).

## Ramos
- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — botão indisponível (sem chave, conexão ou texto) não roda; disponível segue.
- R2 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não pede arquivo, então este lado é o tomado.
- R3 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho vai direto à store do núcleo; com um gesto aberto e um comando que não muda o documento, ele iria por `src/editor/store.ts:227` `else if (!changesDocument) result = open.dispatch(id, args);`.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — o id `assistant.send` tem tratador na tabela.

## Fronteiras assíncronas
- nenhuma no caminho da porta — de `src/editor/doors/door.tsx:285` a `src/app/commands.ts:183` o caminho é síncrono; o turno que o tratador dispara roda depois, no trecho `TRC-assistant.send` (a assinatura da store em `src/editor/assistant/controller.ts:222`).

## Estado
- lê: EST-L05a-038 (via o dispatch da store do editor)
- escreve: nenhum no caminho da porta; as escritas de EST-L06-050, EST-L06-004, EST-L06-005, EST-L06-008, EST-L06-009 e EST-L06-013 entram no trecho `TRC-assistant.send`

## Resultado
- **Estado final:** EST-L06-050 em V4 (turno em curso, `busy` e o pedido `send`), pelo trecho `TRC-assistant.send` (`src/editor/assistant/state.ts:58`).
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel a cada relatório do turno.
- **DOM do editor:** o rodapé troca Enviar pelo botão Parar enquanto o turno corre, pelo trecho.
- **DOM do canvas:** as alterações do turno passam pelos comandos reais num grupo de desfazer próprio, pelo trecho.

## Regras
- G1: n/a — o comando não grava no documento nesta entrada: `manifest/commands/assistant.json:340` `"undoable": false`
- G2: n/a — o comando não altera o documento nem o estado antes de rodar: `manifest/commands/assistant.json:340` `"undoable": false`
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando) e o tratador único decide; as duas portas chegam ao mesmo tratador (`manifest/commands/assistant.json:344` `"id": "assistant-send",` e `manifest/commands/assistant.json:370` `"id": "send-key",`).
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:349` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o caminho da porta não desenha painel nem barra: `src/editor/doors/door.tsx:144`.
- G6: n/a — o caminho da porta não escreve a seleção: `src/editor/doors/door.tsx:144`.
- G7: n/a — o documento não muda na própria entrada: `src/core/store/store.ts:321` `if (next.document !== before.document) {` só avisa os ouvintes quando o documento muda.
- INT: n/a — a própria entrada não toca o documento: `manifest/commands/assistant.json:340` `"undoable": false`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:285` e `src/app/commands.ts:183`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-assistant.send
- **Argumentos enviados:** nenhum — a porta não envia valor; o texto vem do campo `assistant-input` já no estado (`src/editor/doors/door.tsx:144` entrega só o id do comando).
- nenhum — o trecho não lista ramo que dependa dos argumentos (`auditoria/fluxos/trechos/TRC-assistant.send.md` `**Ramos que dependem dos argumentos:** nenhum`), então os ramos do trecho (`busy`, chave, conexão, entrada vazia) dependem do estado, não do que a porta envia.
