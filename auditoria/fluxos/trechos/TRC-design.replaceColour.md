# TRC-design.replaceColour
- **Chamada:** `src/app/commands.ts:215` `'design.replaceColour': replaceColourCommand,`
- **Argumentos:** `{ colour: string, value: string }` — `colour` é a cor em uso e `value` o valor novo (`manifest/commands/design-system.json:1280` `"colour": {`). Os dois obrigatórios.
- **Ramos que dependem dos argumentos:** R1 e R2 (o `colour` decide R1 e R3; o `value` decide R2).

## Passos
1. `src/app/commands.ts:215` `'design.replaceColour': replaceColourCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/site-colours.ts:146` `export const replaceColourCommand = registerHandler('design.replaceColour', (context, { colour, value }): Outcome<never> => {` — o tratador recebe o contexto e os dois argumentos.
7. `src/core/design/site-colours.ts:147` `const from = knownColour(context, colour);` — a cor é reduzida à sua grafia uma, se estiver em uso [lê: EST-L01-030 via knownColour].
8. `src/core/design/site-colours.ts:140` `function knownColour<Ui>(context: HandlerContext<Ui>, typed: string): string | null {` — `knownColour` lê as cores do site e confere a grafia.
9. `src/core/design/site-colours.ts:109` `export function siteColoursOf(document: DocumentJson): readonly SiteColour[] {` — `siteColoursOf` reúne cada cor em uso e quantos valores a nomeiam.
10. `src/core/design/site-colours.ts:149` `const next = value.trim();` — o valor novo é aparado.
11. `src/core/design/site-colours.ts:152` `const probe = probeOf(context, COLOUR_KIND);` — a propriedade que lê o tipo cor é achada.
12. `src/core/design/site-colours.ts:153` `const read = probe === null ? null : readValue(context, probe, next);` — o valor novo é lido como o campo de cor lê.
13. `src/core/design/site-colours.ts:155` `const written = read.css;` — o CSS escrito.
14. `src/core/design/site-colours.ts:157` `const patches = replacing(context.state.document, from, written);` — os patches trocam a cor em cada valor que a nomeia [lê: EST-L01-030 via replacing].
15. `src/core/design/site-colours.ts:132` `function replacing(document: DocumentJson, colour: string, next: string, whole = false): readonly Patch[] {` — `replacing` percorre os valores de estilo do projeto.
16. `src/core/design/site-colours.ts:158` `const locked = lockedBy(context.state.document, patches);` — um elemento trancado que os patches mudariam recusa [lê: EST-L01-030 via lockedBy].
17. `src/core/design/site-colours.ts:160` `return { kind: 'change', patches, message: message('status.siteColours.replaced', { colour: from, value: written, count: patches.length }) };` — o tratador devolve os patches e a mensagem.
18. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
19. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
20. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/site-colours.ts:148` `if (from === null) return { kind: 'refused', message: message('status.siteColours.notUsed', { colour }) };` — cor que o site não usa: recusa `status.siteColours.notUsed`; usada: segue.
- R2 `src/core/design/site-colours.ts:154` `if (read === null) return { kind: 'refused', message: message('status.siteColours.invalid', { value: next }) };` — valor que o campo de cor não lê: recusa `status.siteColours.invalid`; lível: segue.
- R3 `src/core/design/site-colours.ts:156` `if (colourKey(written) === from) return { kind: 'change' };` — valor novo igual à cor atual: `change` sem patch; diferente: segue.
- R4 `src/core/design/site-colours.ts:159` `if (locked !== null) return { kind: 'refused', message: locked };` — um elemento que os patches mudariam trancado: recusa `status.locked.edit`; livres: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/site-colours.ts:146`); `readValue` (`src/core/design/site-colours.ts:153`) é síncrono.

## Estado
- Lê: EST-L01-030 (documento: os valores de estilo das páginas, classes e componentes), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento: cada valor que nomeia a cor), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** cada valor que nomeia a cor passa a nomear o valor novo (`src/core/design/site-colours.ts:157`); a mensagem é `status.siteColours.replaced`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel de site colours reflete a troca.
- **DOM do canvas:** o canvas redesenha o documento com a cor nova onde a antiga estava.

## Regras
- G1: n/a — o comando escreve caminhos fixos do documento (`src/core/design/site-colours.ts:136`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:215` `'design.replaceColour': replaceColourCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/site-colours.ts:160`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/site-colours.ts:160`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/site-colours.ts:146`).

## Medições
- nenhuma
