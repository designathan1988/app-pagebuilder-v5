# ENT-P-geometry-0001 — position.setMode pela porta position.setMode#inspector-position

## Passos
1. `src/editor/shell/inspector-controls.tsx:188` `return <KeywordButtons entry={entry} door={door} property={entry.door.property} values={offered(entry)} icons={target.icons} label={door.label} />;` — a propriedade `position` (control `keyword-buttons`, `manifest/properties.json:1873` `"control": "keyword-buttons",`) é desenhada pelo controle de palavras-chave do inspector: a porta.
2. `src/editor/shell/field.tsx:1268` `const choose = (value: string) => {` — o botão de um valor chama `choose` com o valor escolhido.
3. `src/editor/shell/field.tsx:1269` `if (available) (store.dispatch as Dispatch)(command, { property, [valueArg]: value });` — a Início: o campo entrega a intenção direto à store do editor; a forma é `{ property, mode }`, porque o argumento além de `property` é o `mode` (`src/editor/shell/field.tsx:1267` `const valueArg = Object.keys(entry.command.args).find((name) => name !== 'property') ?? 'value';`). [lê: EST-L01-030 via useDoor] [lê: EST-L01-031 via useDoor]
4. `src/app/commands.ts:324` `'position.setMode': setPositionModeCommand,` — a Chamada do trecho TRC-position.setMode: a tabela liga o id ao tratador.

A porta do campo do inspector não passa pelo `run` do `useDoor` (o `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` do campo `position.setMode#inspector-position` não é despachado): o controle de palavras-chave despacha direto, na linha do passo 3.

## Ramos
- R1 `src/editor/shell/field.tsx:1294` `if (!fits) {` — os valores não cabem na largura do campo: um menu é desenhado (`src/editor/shell/field.tsx:1336` `choose(value);`); cabem: os botões segmentados chamam `choose` (`src/editor/shell/field.tsx:1377` `onClick={() => choose(value)}`).
- R2 `src/editor/shell/field.tsx:1269` `if (available) (store.dispatch as Dispatch)(command, { property, [valueArg]: value });` — controle indisponível (`available` falso): nada é despachado; disponível: a intenção entra na store (passo 4).

## Fronteiras assíncronas
- nenhuma — o controle do campo é síncrono (`src/editor/shell/field.tsx:1268` `const choose = (value: string) => {`) e nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- Lê: EST-L01-030 (estado da store: documento, regras), EST-L01-031 (estado da store: seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), pelo tratador do trecho TRC-position.setMode.

## Resultado
- **Estado final:** o `mode` é gravado em cada elemento selecionado (`src/core/geometry/position.ts:53` `return writeStyle(context, property, read.css);`); a mensagem é a do trecho TRC-position.setMode.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem do `writeStyle` (`src/core/style/set.ts:373` `? message('status.style.set', { property: name, name: holders[0]?.name ?? primary.node.name, value: css })`); o botão do `mode` corrente fica pressionado (`src/editor/shell/field.tsx:1368` `aria-pressed={shown === value}`).
- **DOM do canvas:** o iframe redesenha os elementos com o `mode` novo pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto da edição é captado na store; a camada escrita é a ativa (`src/core/style/set.ts:343` `const layer = { breakpoint, state: base };`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o campo entrega a intenção pela store do editor, que grava antes a digitação pendente.
- G3: ok `src/app/commands.ts:324` `'position.setMode': setPositionModeCommand,` — as duas portas do comando (`inspector-position` e `command-bar-set-property`) chamam o mesmo tratador com a mesma forma `{ property, mode }`.
- G4: n/a — a porta do campo do inspector não desenha painel nem barra sobre o canvas (`src/editor/shell/field.tsx:1269`).
- G5: n/a — o fluxo de porta não altera a geometria de painel nem de barra (`src/editor/shell/field.tsx:1269`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção é a da store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas é redesenhado pelo mesmo aviso.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade do documento é conferida no commit.

## Limpeza
- nada a remover — o fluxo de porta não cria ouvinte, timer nem observador (`src/editor/shell/field.tsx:1268`).

## Medições
- nenhuma — o fluxo de porta não chama API de medida; o valor do `mode` vem do documento (`src/editor/shell/field.tsx:1251` `return node ? storedValue(node, property, layeredRules(s)) : undefined;`).

## Ramos do trecho
- **Trecho:** TRC-position.setMode
- **Argumentos enviados:** `{ property: 'position', mode: <valor> }` — o campo nomeia a propriedade `position` (`manifest/commands/geometry.json:67` `"property": "position",`) e o `mode` é o valor cujo botão foi acionado (`src/editor/shell/field.tsx:1269`).
- R1 (a leitura do `mode` contra a propriedade): o `mode` escolhido é legível pelo codec (um dos valores `static`, `relative`, `absolute`, `fixed`, `sticky`, `manifest/commands/geometry.json:18` `"static",`), então o caminho passa pelo lado legível (`src/core/geometry/position.ts:30` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, context.rules), value: mode }) };` é falso).
- R2 (o `mode` decide o caminho de `static`/`relative`): o `mode` escolhido entre `static` e `relative` leva o caminho pelos insets inertes (`src/core/geometry/position.ts:33` `if (mode === 'static' || mode === 'relative') {`); qualquer outro `mode` leva ao passo direto.
