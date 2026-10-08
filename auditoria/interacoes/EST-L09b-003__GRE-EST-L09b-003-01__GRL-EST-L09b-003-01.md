# EST-L09b-003 × GRE-EST-L09b-003-01 → GRL-EST-L09b-003-01
- **Estado:** EST-L09b-003
- **Escritor:** GRE-EST-L09b-003-01 (o layout effect): ENT-L09b-0004
- **Leitor:** GRL-EST-L09b-003-01 (dismiss): ENT-L09b-0003
## Estados deixados por A
O item é a ref `latest` de `useOutsideLayer` (`src/editor/shell/outside-layer.ts:34` `const latest = useRef(close);`), o fechador mais recente da camada. O único membro do GRE- é o layout effect da camada (ENT-L09b-0004).

- **V1 o fechador da primeira renderização.** `src/editor/shell/outside-layer.ts:34` `const latest = useRef(close);` — o valor da criação.
- **V2 o fechador da renderização mais recente.** `src/editor/shell/outside-layer.ts:36` `latest.current = close;` — o layout effect grava o fechador a cada renderização.
- **Intermediário: inexistente.** `src/editor/shell/outside-layer.ts:36` `latest.current = close;` é uma instrução síncrona única; não há meio de gesto, de grupo nem de sequência.
- **Recusa: sem estado.** o efeito não julga valor (`src/editor/shell/outside-layer.ts:36` `latest.current = close;`).
- **Desmontagem: sem estado.** a ref é descartada com a componente (`src/editor/shell/outside-layer.ts:34` `const latest = useRef(close);`); a limpeza remove a camada do conjunto (`src/editor/shell/outside-layer.ts:54` `layers.delete(layer);`), e a pressão fora deixa de a alcançar.

## Casos
### C1 final
O escritor já terminou: o layout effect deixou `src/editor/shell/outside-layer.ts:36` `latest.current = close;`. O leitor `dismiss` lê a ref ao dispensar a camada — `src/editor/shell/outside-layer.ts:48` `latest.current();` —, chamada pelo fechador da camada na pressão fora (`src/editor/shell/outside-layer.ts:24` `for (const layer of [...own].reverse()) if (!inside.has(layer)) layer.dismiss();`). ok — `src/editor/shell/outside-layer.ts:48` `latest.current();`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: `src/editor/shell/outside-layer.ts:36` `latest.current = close;` é uma instrução síncrona única; não há meio de gesto, de grupo nem de sequência que deixe a ref a meio.

### C3 em curso
n/a — o leitor corre dentro do fechador da camada (`src/editor/shell/outside-layer.ts:47` `dismiss: () => { outside = true;`) e o escritor no layout effect; não há espera entre a leitura de `src/editor/shell/outside-layer.ts:48` `latest.current();` e a escrita.

### C4 desmontagem
n/a — a limpeza tira a camada do conjunto (`src/editor/shell/outside-layer.ts:54` `layers.delete(layer);`), de modo que a pressão fora deixa de chamar o seu fechador; a ref é descartada com a componente (`src/editor/shell/outside-layer.ts:34` `const latest = useRef(close);`).

## Resultado
O leitor chama o fechador mais recente da camada quando a pressão fora a dispensa: `src/editor/shell/outside-layer.ts:48` `latest.current();`.
