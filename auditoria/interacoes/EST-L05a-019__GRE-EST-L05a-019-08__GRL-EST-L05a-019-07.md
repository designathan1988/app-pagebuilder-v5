# EST-L05a-019 × GRE-EST-L05a-019-08 → GRL-EST-L05a-019-07
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-08 (store.gesture): ENT-P-capture-0005, ENT-P-selection-0001, ENT-P-selection-0009, ENT-P-selection-0012, ENT-P-selection-0014, ENT-P-selection-0024, ENT-P-selection-0025, ENT-P-selection-0026, ENT-P-workspace-0059, ENT-P-workspace-0060, ENT-P-workspace-0061, ENT-P-workspace-0063, ENT-P-workspace-0096
- **Leitor:** GRL-EST-L05a-019-07 (wait): ENT-L05a-0060, ENT-L05a-0061
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `open` com o gesto aberto pela pressão.** `src/editor/input/pointer/effects.ts:41` `      shared.open = store.gesture();` — o efeito de pressão do ponteiro (ENT-P-capture-0005, ENT-P-selection-0001 e os demais membros); `src/editor/input/pointer/drag.ts:34` `    shared.open = store.gesture();` — cada desenho da faixa (ENT-P-selection-0024, ENT-P-selection-0025); `src/editor/input/pointer/panels.ts:53` `    shared.open = store.gesture();` — cada passo do arraste de um painel (ENT-P-workspace-0063).
- **Sem estado de recusa.** `src/editor/input/pointer/drag.ts:29` `    if (ps.marquee === null || ps.pressedAt === null || ps.pressedAt.page === null) return;` — sem a faixa em curso, o caminho não abre gesto.

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
