# EST-L09b-002 × GRE-EST-L09b-002-03 → GRL-EST-L09b-002-01
- **Estado:** EST-L09b-002
- **Escritor:** GRE-EST-L09b-002-03 (useOutsideLayer): ENT-L09b-0005
- **Leitor:** GRL-EST-L09b-002-01 (layersOf): ENT-L09b-0003, ENT-L09b-0005
## Estados deixados por A
O item é o mapa `LAYERS` (`src/editor/shell/outside-layer.ts:14` `const LAYERS = new WeakMap<EditorStore, Set<Layer>>();`), o conjunto de camadas abertas por editor. Os três grupos de escritores gravam-no por funções distintas.

- **V1 sem chave para o editor.** `src/editor/shell/outside-layer.ts:14` `const LAYERS = new WeakMap<EditorStore, Set<Layer>>();` — antes da primeira camada do editor.
- **V3 chave criada com o conjunto.** `src/editor/shell/outside-layer.ts:26` `LAYERS.set(store, own);` — `layersOf` guarda o conjunto daquele editor (GRE-EST-L09b-002-02).
- **V3 camada inscrita.** `src/editor/shell/outside-layer.ts:52` `layers.add(layer);` — `useOutsideLayer` acrescenta a camada aberta (GRE-EST-L09b-002-03).
- **V2 conjunto vazio.** `src/editor/shell/outside-layer.ts:54` `layers.delete(layer);` — a remoção tira a camada; sendo a última, a chave fica com o conjunto vazio (GRE-EST-L09b-002-01).
- **Intermediário: inexistente.** cada escrita é uma instrução síncrona única (`src/editor/shell/outside-layer.ts:52` `layers.add(layer);`); não há meio de gesto, de grupo nem de sequência.
- **Recusa: sem estado.** nenhum dos escritores julga valor (`src/editor/shell/outside-layer.ts:16` `let layers = LAYERS.get(store);`).
- **Desmontagem.** `src/editor/shell/outside-layer.ts:54` `layers.delete(layer);` é a escrita da desmontagem; a chave e o conjunto sobrevivem até ao fim da página (`src/editor/shell/outside-layer.ts:14` `const LAYERS = new WeakMap<EditorStore, Set<Layer>>();`).

## Casos
### C1 final
O escritor já terminou: a inscrição acrescentou a camada em `src/editor/shell/outside-layer.ts:52` `layers.add(layer);`. O leitor `layersOf` lê o mapa em `src/editor/shell/outside-layer.ts:16` `let layers = LAYERS.get(store);` e devolve o conjunto, agora com a camada aberta. ok — `src/editor/shell/outside-layer.ts:16` `let layers = LAYERS.get(store);`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: a escrita `src/editor/shell/outside-layer.ts:52` `layers.add(layer);` é uma instrução síncrona única, e nenhum meio de gesto, de grupo ou de sequência a interrompe.

### C3 em curso
n/a — o leitor `layersOf` corre no layout effect logo antes da inscrição (`src/editor/shell/outside-layer.ts:51` `const layers = layersOf(store);`) e devolve o conjunto lido em `src/editor/shell/outside-layer.ts:16` `let layers = LAYERS.get(store);`; não há assinatura nem espera entre a leitura e a escrita.

### C4 desmontagem
ok — a limpeza do efeito tira a camada que a inscrição acrescentou, em `src/editor/shell/outside-layer.ts:54` `layers.delete(layer);`; o leitor seguinte lê o conjunto já sem ela em `src/editor/shell/outside-layer.ts:16` `let layers = LAYERS.get(store);`.

## Resultado
O leitor `layersOf` devolve o conjunto de camadas daquele editor, para a inscrição da pressão fora e a da camada: `src/editor/shell/outside-layer.ts:16` `let layers = LAYERS.get(store);`.
