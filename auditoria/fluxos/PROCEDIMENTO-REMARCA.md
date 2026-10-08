# Procedimento da re-marcação do estado da store do núcleo (Fase 7)

O item `EST-L01-006` — o `state` da store do núcleo inteiro — foi partido nas oito partes que `src/core/store/store.ts` mantém (decisão `auditoria/decisoes.md`, DCS-008). Este procedimento re-marca os fluxos de `auditoria/fluxos/` e `auditoria/fluxos/trechos/` para que cada marca nomeie **a parte** e **a função que, na linha citada, lê ou escreve aquela parte**.

## 1. As oito partes

| id | parte | o que entra nela |
|---|---|---|
| `EST-L01-030` | o documento | `state.document`: a árvore, as páginas, os nós, os estilos, os remendos que a produzem |
| `EST-L01-031` | a seleção | `state.selection`: os ids dos nós selecionados |
| `EST-L01-032` | o histórico | `state.history`: `past`, `future`, as transações, o desfazer e o refazer |
| `EST-L01-033` | a mensagem | `state.message`: o texto da barra de status |
| `EST-L01-034` | a confirmação | `state.confirmation`: o despacho que espera a resposta da pessoa |
| `EST-L01-035` | a recusa | `state.refusal`: a recusa que o campo mostra ao lado de si |
| `EST-L01-036` | o sinal de recusa | `state.refused`: se a mensagem é uma recusa |
| `EST-L01-037` | o estado do editor | `state.ui`: os painéis, as camadas, o alvo do estilo, a quebra de linha, o estado do editor inteiro |

As partes já existentes continuam valendo: `EST-L01-002` (assinantes da store), `EST-L01-004` (`breach`), `EST-L01-010` (`lastMergeable`) e as demais.

## 2. Como escolher a parte

Abra a linha citada no passo. A parte é a que **o código daquela linha** toca:

- `state.document`, `before.document`, `next.document`, `applied.document`, `outcome.document`, um remendo (`patch`), uma página, um nó, um estilo → `EST-L01-030`.
- `state.selection`, `before.selection`, `outcome.selection`, `selection` → `EST-L01-031`.
- `state.history`, `before.history`, `record(`, `undo`, `redo`, uma transação → `EST-L01-032`.
- `state.message`, `before.message`, `outcome.message`, `message(` de um recado da barra de status → `EST-L01-033`.
- `state.confirmation` → `EST-L01-034`.
- `state.refusal`, `refusal:` de uma recusa de comando → `EST-L01-035`.
- `state.refused`, `refused:` → `EST-L01-036`.
- `state.ui`, `outcome.ui`, `before.ui`, `options.layer`, o estado do editor, um painel, as camadas, o alvo do estilo → `EST-L01-037`.

Um passo que toca mais de uma parte leva **uma marca por parte**. Uma marca a mais com a mesma função não altera a matriz (ela agrupa por função), então não deixe uma parte de fora.

## 3. Como escolher a função (`via`)

- A função é a que lê ou escreve a parte naquela linha: a função da própria linha, ou a que a linha chama e que faz o acesso.
- **O tratador do comando nunca é nomeado** (`insertCommand`, `setTextCommand`, `deleteCommand` e os demais: `auditoria/decisoes.md`, DCS-008). O tratador devolve remendos e um resultado; quem escreve o `state` é a store.
  - passo de tratador que descreve a mudança que ele prepara → a marca é de **escrita** da parte, `via run`;
  - passo de tratador que só lê o estado → a marca é de **leitura** da parte, `via` a função que ele chama ali (`placement`, `lockRefusal`, …) ou `via handlerContext`, que é quem entrega o estado a ele.
- `via` que não é nome de função (`state`, `o tratador`, `o ouvinte`, `ui`, …) é trocado pela função da linha.
- Passo que **assina** a store (`store.subscribe`, `subscribeDocument`) não lê o estado: ele escreve `EST-L01-002` (`const listeners = new Set<() => void>();`) via `subscribe` — ou `EST-L01-003` via `subscribeDocument`.

## 4. O que trocar no arquivo

1. Toda ocorrência de `EST-L01-006` — nas marcas `[lê: … via …]` e `[escreve: … via …]`, nos itens da seção `## Estado` e nas frases (por exemplo `**Estado final:** EST-L01-006 com …`) — passa a nomear a parte ou as partes.
2. Toda marca cujo `via` é um tratador ou não é função passa a nomear a função certa.
3. **Nada mais muda.** As seções obrigatórias, as citações, os ramos e os textos ficam como estão; só o id do estado e o `via` mudam.

Citação inválida e palavra proibida são recusadas pela trava na hora da gravação.

## 5. Exemplo trabalhado (`auditoria/fluxos/trechos/TRC-element.insert.md`)

Antes:

```
2. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` … [lê: EST-L01-006 via argumentRefusal]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` … [lê: EST-L01-006 via handlerContext]
4. `src/core/structure/insert.ts:217` `export const insertCommand = registerHandler('element.insert', ({ state, ids, rules, words }, { entry, parent, index }): Outcome<never> => {` … [lê: EST-L01-006 via state]
7. `src/core/structure/insert.ts:219` `const at = placement(state, state.selection, rules, parent, index, node);` … [lê: EST-L01-006 via placement]
10. `src/core/structure/insert.ts:223` `const locked = lockRefusal(state.document, receiver.id, 'status.locked.insert');` … [lê: EST-L01-006 via lockRefusal]
11. `src/core/structure/insert.ts:226` `const refused = placementRefusal(state.document, rules, receiver.id, [node]);` … [lê: EST-L01-006 via placementRefusal]
15. `src/core/structure/insert.ts:240` `patches: [...releaseReferencesPatch(state.document, leaving), { op: 'remove', path }, { op: 'add', path, value: placed }],` … [escreve: EST-L01-006 via releaseReferencesPatch]
17. `src/core/structure/insert.ts:247` `patches: [{ op: 'add', path: [...at.parent.path, 'children', at.index], value: placed }],` … [escreve: EST-L01-006 via insertCommand]
18. `src/core/structure/insert.ts:248` `selection: [node.id],` … [escreve: EST-L01-006 via insertCommand]
19. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` … [escreve: EST-L01-006 via applyPatches]
20. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` … [escreve: EST-L01-006 via run]
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` … [lê: EST-L01-006 via commit]
23. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` … [escreve: EST-L01-006 via publish]
```

Depois:

```
2. … [lê: EST-L01-030 via argumentRefusal]
3. … [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. … [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext]
7. … [lê: EST-L01-031 via placement] [lê: EST-L01-030 via placement]
10. … [lê: EST-L01-030 via lockRefusal]
11. … [lê: EST-L01-030 via placementRefusal]
15. … [escreve: EST-L01-030 via run]
17. … [escreve: EST-L01-030 via run]
18. … [escreve: EST-L01-031 via run]
19. … [escreve: EST-L01-030 via applyPatches]
20. … [escreve: EST-L01-031 via run]
21. … [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
23. … [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
```

E a seção de estado do mesmo arquivo:

Antes:

```
## Estado
- lê: EST-L01-006, EST-L05a-001
- escreve: EST-L01-006
```

Depois:

```
## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, handlerContext, placement, lockRefusal, placementRefusal), EST-L01-031 (a seleção, via handlerContext, placement, commit), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-031 (a seleção, via run), EST-L01-033 (a mensagem, via publish)
```

E a frase do resultado:

Antes: `- **Estado final:** EST-L01-006 com o nó no receptor, no índice pedido (…), a seleção no nó novo (…) e a mensagem \`status.placed\` (…).`

Depois: `- **Estado final:** EST-L01-030 com o nó no receptor, no índice pedido (…), EST-L01-031 com a seleção no nó novo (…) e EST-L01-033 com a mensagem \`status.placed\` (…).`

## 6. Fechamento de cada lote

- `node tools/audit/check.mjs --so C2,C5,C7 --resumo` sem pendências no lote.
- Zero ocorrências de `EST-L01-006` nos arquivos do lote.
- Nenhuma marca com `via` de tratador de comando.
