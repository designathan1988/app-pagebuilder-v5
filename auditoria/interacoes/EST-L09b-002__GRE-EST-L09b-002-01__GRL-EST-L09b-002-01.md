# EST-L09b-002 × GRE-EST-L09b-002-01 → GRL-EST-L09b-002-01
- **Estado:** EST-L09b-002
- **Escritor:** GRE-EST-L09b-002-01 (a remoção do efeito): ENT-L09b-0005
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
O escritor já terminou: a remoção tirou a camada em `src/editor/shell/outside-layer.ts:54` `layers.delete(layer);`. O leitor `layersOf` lê o conjunto em `src/editor/shell/outside-layer.ts:16` `let layers = LAYERS.get(store);` e devolve-o sem aquela camada; quando era a última, a chave fica com o conjunto vazio. ok — `src/editor/shell/outside-layer.ts:16` `let layers = LAYERS.get(store);`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: as escritas — `src/editor/shell/outside-layer.ts:52` `layers.add(layer);` e `src/editor/shell/outside-layer.ts:54` `layers.delete(layer);` — são instruções síncronas únicas, e nenhum meio de gesto, de grupo ou de sequência as interrompe.

### C3 em curso
n/a — o leitor `layersOf` corre no layout effect (`src/editor/shell/outside-layer.ts:51` `const layers = layersOf(store);`) e devolve o conjunto lido em `src/editor/shell/outside-layer.ts:16` `let layers = LAYERS.get(store);`; não há assinatura nem espera entre a leitura e as escritas.

### C4 desmontagem
ok — a desmontagem do componente corre a limpeza do efeito, que tira a camada em `src/editor/shell/outside-layer.ts:54` `layers.delete(layer);`; o leitor seguinte lê o conjunto já sem ela em `src/editor/shell/outside-layer.ts:16` `let layers = LAYERS.get(store);`.

## Resultado
O leitor `layersOf` devolve o conjunto de camadas daquele editor, para a inscrição da pressão fora e a da camada: `src/editor/shell/outside-layer.ts:16` `let layers = LAYERS.get(store);`.
