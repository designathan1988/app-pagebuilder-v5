# ENT-P-geometry-0002 — position.setMode pela porta position.setMode#command-bar-set-property

## Passos
1. `src/editor/shell/command-bar.tsx:107` `return [{ entry, args: write.args, label: t(entry.door.labelKey as MessageId, { property: property.id, value: asked.value }), key: entryKey(entry, write.args) }];` — a barra de comandos oferece a entrada "set property" com os argumentos que o escritor da propriedade toma.
2. `src/editor/command-bar/command-bar.ts:228` `return { entry: bar, args: { ...args, ...value } };` — o argumento da forma do escritor é montado: `{ property, mode }` (`src/editor/command-bar/command-bar.ts:222` `if (Object.hasOwn(declared, 'property')) args.property = property.id;`).
3. `src/editor/shell/command-bar.tsx:275` `<DoorControl entry={e.entry} args={e.args} label={e.label} className="command-bar__entry" tabbable={false} icon={icon ?? null}>` — a entrada é desenhada como controle de porta.
4. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a Início: a porta entrega a intenção à store do editor; o `given` foi composto em `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` (os do manifesto sobre os do lugar). [lê: EST-L01-030 via useDoor] [lê: EST-L01-031 via useDoor]
5. `src/app/commands.ts:324` `'position.setMode': setPositionModeCommand,` — a Chamada do trecho TRC-position.setMode: a tabela liga o id ao tratador.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `if (!built || !available) return;` — o comando não está construído ou a disponibilidade não vale: nada muda; construído e disponível: segue ao passo 4.
- R2 `src/editor/doors/door.tsx:144` `if (file === undefined) {` — o comando não toma arquivo: o despacho direto no passo 4; um comando de arquivo seguiria pelos ramos de arquivo da mesma função.

## Fronteiras assíncronas
- nenhuma — o `run` da porta é síncrono para um comando sem arquivo nem área de transferência (`src/editor/doors/door.tsx:144` `if (file === undefined) {` leva direto ao passo 4).

## Estado
- Lê: EST-L01-030 (estado da store: documento, regras), EST-L01-031 (estado da store: seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), pelo tratador do trecho TRC-position.setMode.

## Resultado
- **Estado final:** o `mode` é gravado em cada elemento selecionado (`src/core/geometry/position.ts:53` `return writeStyle(context, property, read.css);`); a mensagem é a do trecho TRC-position.setMode.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem do `writeStyle` (`src/core/style/set.ts:373` `? message('status.style.set', { property: name, name: holders[0]?.name ?? primary.node.name, value: css })`).
- **DOM do canvas:** o iframe redesenha os elementos com o `mode` novo pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto da edição é captado na store; a camada escrita é a ativa (`src/core/style/set.ts:343` `const layer = { breakpoint, state: base };`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a entrada da barra despacha pela store do editor.
- G3: ok `src/app/commands.ts:324` `'position.setMode': setPositionModeCommand,` — as duas portas do comando (`inspector-position` e `command-bar-set-property`) chamam o mesmo tratador com a mesma forma `{ property, mode }`.
- G4: n/a — a barra de comandos é um painel próprio; o fluxo de porta não cobre o canvas no ponto da ação (`src/editor/doors/door.tsx:144`).
- G5: n/a — o fluxo de porta não altera a geometria de painel nem de barra (`src/editor/doors/door.tsx:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção é a da store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas é redesenhado pelo mesmo aviso.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade do documento é conferida no commit.

## Limpeza
- nada a remover — o fluxo de porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — o fluxo de porta não chama API de medida; os argumentos são texto (`src/editor/command-bar/command-bar.ts:228`).

## Ramos do trecho
- **Trecho:** TRC-position.setMode
- **Argumentos enviados:** `{ property: 'position', mode: <valor> }` — a barra nomeia a propriedade `position` pelo texto digitado e o `mode` é o valor do escritor (`src/editor/command-bar/command-bar.ts:222` `if (Object.hasOwn(declared, 'property')) args.property = property.id;`).
- R1 (a leitura do `mode` contra a propriedade): o `mode` oferecido é um dos valores legíveis (`manifest/commands/geometry.json:18` `"static",`), então o caminho passa pelo lado legível (`src/core/geometry/position.ts:30` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, context.rules), value: mode }) };` é falso).
- R2 (o `mode` decide o caminho de `static`/`relative`): o `mode` entre `static` e `relative` leva o caminho pelos insets inertes (`src/core/geometry/position.ts:33` `if (mode === 'static' || mode === 'relative') {`); qualquer outro `mode` leva ao passo direto.
