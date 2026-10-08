# ENT-P-geometry-0009 — geometry.resize pela porta geometry.resize#handle-resize-w

## Passos
1. `src/editor/input/pointer/events.ts:182` `const grabbable = event.button === 0 && ps.machine.phase === 'idle' ? chromeControl({ x: event.clientX, y: event.clientY }, '[data-canvas-overlay] [data-resize-handle]', event.target) : null;` — o dono do ponteiro reconhece a alça de redimensionamento sob a pressão.
2. `src/editor/input/pointer/events.ts:201` `setResizing({ node: resized, handle: handle.getAttribute('data-resize-handle') ?? '' });` — a alça fica armada para o arraste. [lê: EST-L01-030 via store.getState] [lê: EST-L01-031 via store.getState]
3. `src/editor/input/pointer/events.ts:374` `const values = resizedBox(ps.resizing.basis, ps.resizing.handle, travel.x, travel.y, { aspect: ps.resizing.media ? !event.shiftKey : event.shiftKey, centre: event.altKey }, RESIZE_MIN);` — a caixa nova; o lado da alça `resize-w` é `w` (`src/core/geometry/resize.ts:96` `const side = handle.slice(handle.lastIndexOf('-') + 1);`), então a largura (e o `left`, se posicionado) se move.
4. `src/editor/input/pointer/events.ts:375` `const { marginLeft, marginTop, ...rest } = values;` — as margens de compensação do fluxo saem do mapa de valores.
5. `src/editor/input/pointer/events.ts:379` `const given = Object.fromEntries(Object.entries(named).filter(([, value]) => value !== undefined));` — só os valores definidos entram.
6. `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);` — a Início: o arraste entrega a intenção à store do editor, dentro de um gesto.
7. `src/app/commands.ts:325` `'geometry.resize': resizeCommand,` — a Chamada do trecho TRC-geometry.resize: a tabela liga o id ao tratador.

## Ramos
- R1 `src/editor/input/pointer/events.ts:195` `if (handle && handleEntry && basis !== null && zoom !== undefined && current !== null && handleInPlace(handle, current)) {` — a alça não está sob o elemento agora: o arraste não começa; sob: a alça é armada (passo 2).
- R2 `src/editor/input/pointer/events.ts:379` `const given = Object.fromEntries(Object.entries(named).filter(([, value]) => value !== undefined));` — valores indefinidos (a altura, o `top` e o `marginTop` que o lado `w` não move) saem; a largura e o `left`/`marginLeft` entram.

## Fronteiras assíncronas
- nenhuma — cada passo do arraste roda inteiro dentro do fluxo; o ouvinte do ponteiro que o repete existe fora dele (`src/editor/input/pointer/events.ts:377`).

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles` ou atributos de forma), pelo tratador do trecho TRC-geometry.resize.

## Resultado
- **Estado final:** a largura (e o `left`, se posicionado; ou o `margin-left`, em fluxo) é gravada em px inteiros (`src/core/geometry/resize.ts:62` `const patches = styleHolders(context, [at]).flatMap((held) => writeDeclarations(held.node, held.path, { breakpoint, state: base }, values));`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra `status.resized` (`src/core/geometry/resize.ts:59` `const said = message('status.resized', { width: size.width ?? 'auto', height: size.height ?? 'auto' });`).
- **DOM do canvas:** o iframe desenha o elemento no tamanho novo pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a camada escrita é a ativa (`src/core/geometry/resize.ts:56` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor capta o contexto no primeiro passo do arraste.
- G3: ok `src/app/commands.ts:325` `'geometry.resize': resizeCommand,` — as doze alças de redimensionamento chamam o mesmo tratador com a mesma forma de intenção.
- G4: n/a — a alça é desenhada pelo chrome do canvas (`src/editor/input/pointer/events.ts:179`).
- G5: n/a — o fluxo de porta não altera a geometria de painel nem de barra (`src/editor/input/pointer/events.ts:377`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção é a da store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas é redesenhado pelo mesmo aviso.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade do documento é conferida no commit.

## Limpeza
- nada a remover — o fluxo de porta não cria ouvinte, timer nem observador (`src/editor/input/pointer/events.ts:377`).

## Medições
- nenhuma — o fluxo de porta não chama API de medida; a caixa da forma vem do documento (`src/core/geometry/resize.ts:95`).

## Ramos do trecho
- **Trecho:** TRC-geometry.resize
- **Argumentos enviados:** `{ width, left }` para um elemento posicionado, ou `{ width, marginLeft }` para um em fluxo — o lado `w` da alça `resize-w` move a largura e o inset ou a margem esquerda (`src/core/geometry/resize.ts:132` `const marginLeft = !across || from.positioned || !starts.x || !west ? undefined : margins.left + (keys.centre ? -shiftX / 2 : shiftX);`); os valores não definidos saem em `src/editor/input/pointer/events.ts:376`.
- R2 (o prefixo `margin` do argumento): em fluxo, o argumento `marginLeft` toma o lado da margem (`src/core/geometry/resize.ts:37` `if (!property.startsWith(MARGIN_ARG)) {` é falso, e `src/core/geometry/resize.ts:44` `values[longhand] = value;`); posicionado, `width` e `left` tomam a propriedade própria (`src/core/geometry/resize.ts:38` `values[property] = value;`).
- R3 (o comprimento não é px): os valores são `Npx` (`src/core/geometry/resize.ts:124` `const px = (value: number) => `${Math.round(value)}px`;`), então o caminho passa pelo lado px (`src/core/geometry/resize.ts:33` `if (!LENGTH.test(value)) return { kind: 'refused', message: argumentRefused(property) };` é falso).
- R4 (a forma SVG): os argumentos não decidem este ramo; o tipo do nó decide (`src/core/geometry/resize.ts:48` `const from = geometry.length > 0 ? shapeBox(at.node, geometry) : null;`), então um elemento comum passa pelas declarações de estilo.
