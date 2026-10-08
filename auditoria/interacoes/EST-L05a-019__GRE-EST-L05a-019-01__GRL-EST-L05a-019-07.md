# EST-L05a-019 × GRE-EST-L05a-019-01 → GRL-EST-L05a-019-07
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-01 (dropTool): ENT-L05a-0033
- **Leitor:** GRL-EST-L05a-019-07 (wait): ENT-L05a-0060, ENT-L05a-0061
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `open` de volta a nulo.** `src/editor/input/pointer/tools.ts:14` `    if (shared.open === gesture) shared.open = null;` — `dropTool` larga o gesto aberto da ferramenta quando era o dela e cancela a sessão logo a seguir (`src/editor/input/pointer/tools.ts:15` `    session.cancel();`); é a escrita da ENT-L05a-0033.
- **Sem estado de recusa.** `src/editor/input/pointer/tools.ts:11` `    if (ps.tooling === null) return;` — sem ferramenta a segurar a sessão, `dropTool` não escreve o item.

## Casos
### C1 final
- Chega depois de o escritor ter escrito o item e lê-o em `src/editor/input/pointer/common.ts:408` `  const wait = () => (shared.open === null ? run() : requestAnimationFrame(wait));`: com o gesto já fechado (`open` nulo) corre `run` sem esperar.
- ok — o leitor lê o gesto fechado e corre o despacho.
### C2 intermediário
- A meio de um gesto o item guarda o gesto aberto; o leitor lê `src/editor/input/pointer/common.ts:408` `  const wait = () => (shared.open === null ? run() : requestAnimationFrame(wait));` e, com `open` não nulo, pede o quadro seguinte.
- ok — o leitor lê o gesto de meio de espera e pede o próximo quadro.
### C3 em curso
- A leitura em `src/editor/input/pointer/common.ts:408` `  const wait = () => (shared.open === null ? run() : requestAnimationFrame(wait));` corre em cada quadro enquanto o escritor troca o item; a leitura é de um valor inteiro.
- ok — a leitura em curso vê o valor inteiro.
### C4 desmontagem
- n/a — o leitor não é ouvinte nem assinatura: é um quadro repetido que termina quando `shared.open` fica nulo (`src/editor/input/pointer/common.ts:408` `  const wait = () => (shared.open === null ? run() : requestAnimationFrame(wait));`); não há inscrição a remover.

## Resultado
- O leitor espera o gesto fechar para correr o despacho: `src/editor/input/pointer/common.ts:408` `  const wait = () => (shared.open === null ? run() : requestAnimationFrame(wait));`.
