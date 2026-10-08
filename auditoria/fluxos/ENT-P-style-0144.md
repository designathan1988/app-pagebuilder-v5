# ENT-P-style-0144 — style.set#handle-column-gap-band

- **Comando:** style.set
- **Porta:** handle-column-gap-band (`manifest/commands/style.json:4653` `"id": "handle-column-gap-band",`)
- **Início:** `src/editor/input/pointer/events.ts:314` `ps.spacing.gesture.dispatch(ps.spacing.entry.command.id as CommandId`
- **Trecho:** TRC-style.set

## Passos
1. `src/editor/input/pointer/events.ts:280` `ps.spacing.gesture = store.gesture();` — o arraste da faixa abre um gesto [escreve: EST-L01-007 via gesture].
2. `src/editor/store.ts:205` `keepTyping();` — ao abrir o gesto a digitação pendente é gravada [lê: EST-L05a-001 via keepTyping].
3. `src/editor/input/pointer/events.ts:314` `ps.spacing.gesture.dispatch(ps.spacing.entry.command.id as CommandId` — o dono do ponteiro entrega a intenção (o valor em px) ao gesto [lê: EST-L01-007 via o `dispatch` do gesto].
4. `src/editor/store.ts:210` `dispatch: (id, args) => gesture.dispatch(id, args),` — o invólucro do gesto da store do editor entrega ao gesto do núcleo.
5. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto do núcleo recebe o comando.
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o comando entra em `run` com o gesto aberto.
7. `src/core/store/store.ts:400` `const entry = table[id];` — o comando é lido na tabela de comandos.
8. `src/app/commands.ts:389` `'style.set': setStyleCommand,` — a tabela liga style.set ao tratador; aqui começa o trecho TRC-style.set.

## Ramos
- `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto está aberto nesta porta (este lado); o outro lado só existiria com o gesto já fechado.
- `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — construído: segue; não construído: "ainda não disponível".
- `src/core/store/store.ts:411` `if (invalid !== null) {` — argumento que o comando não toma: recusado; tomado: segue.
- `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade editableSelection vale: segue; não vale: recusado.

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/input/pointer/events.ts:311`), sem `await`, timer nem ouvinte; o ponteiro só entrega valores a um gesto já aberto.

## Estado
- Lê: EST-L01-030 (documento), EST-L01-031 (seleção), EST-L01-007 (gesto aberto), EST-L05a-001 (digitação pendente, via keepTyping).
- Escreve: EST-L01-007 (o gesto é aberto em `src/editor/input/pointer/events.ts:277`); a escrita do documento é do trecho.

## Resultado
- **Estado final:** a porta abre um gesto e entrega o valor; a escrita do documento é a do trecho (`src/core/style/set.ts:375` `return { kind: 'change', patches, message: said };`).
- **Re-renderizado:** só a publicação do trecho re-renderiza (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** o caminho da porta desenha a faixa em arraste; a mensagem do trecho é que aparece na barra.
- **DOM do canvas:** o canvas é redesenhado pelo trecho ao vivo.

## Regras
- G1: ok `src/editor/input/pointer/events.ts:314` `ps.spacing.gesture.dispatch(ps.spacing.entry.command.id as CommandId` — a intenção leva a propriedade e o valor da faixa.
- G2: ok `src/editor/store.ts:205` `keepTyping();` — ao abrir o gesto a digitação pendente é gravada.
- G3: ok `src/app/commands.ts:389` `'style.set': setStyleCommand,` — a faixa entrega a mesma intenção (a propriedade e o valor em px) ao mesmo tratador.
- G4: n/a — o caminho da porta não cobre o canvas (`src/editor/input/pointer/events.ts:311`).
- G5: n/a — o caminho da porta não muda a geometria de painel nem de barra (`src/editor/input/pointer/events.ts:311`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção continua vindo da store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas desenha a partir do documento da store.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de publicar.

## Limpeza
- nada a remover — o gesto é aberto em `src/editor/input/pointer/events.ts:277` e fechado pelo dono do ponteiro o arraste (`src/editor/store.ts:204` `gesture: () => {`); o caminho da porta não cria ouvinte, timer nem observador.

## Medições
- nenhuma — o caminho da porta não lê dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-style.set
- **Argumentos enviados:** `property` = a propriedade da faixa (o manifesto declara `{}`); `value` = `${value}px`; `targets` = ausente neste caminho, o gesto age sobre a seleção.
- R2: `src/core/style/set.ts:400` `if (context === null) return { kind: 'change' as const };` — sem `targets`, os alvos são a seleção; com a seleção não vazia o caminho segue pelo lado "alvo restou".
- R3: `src/core/style/set.ts:407` `if (clash !== undefined) return { kind: 'refused', message: message('status.recipe.conflict', { recipe: propertyName(property, context.rules), property: propertyName(clash.property, context.rules) }) };` — a `property` da faixa procura uma receita; sem colisão o caminho segue.
- R4: `src/core/style/set.ts:383` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, context.rules), value }) };` — o `value` em px é julgado pelo codec da propriedade; não tomado, desvia para a recusa.
