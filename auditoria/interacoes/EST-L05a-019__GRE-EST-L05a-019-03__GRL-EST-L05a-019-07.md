# EST-L05a-019 × GRE-EST-L05a-019-03 → GRL-EST-L05a-019-07
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-03 (followPicker): ENT-L05a-0031, ENT-L05a-0059
- **Leitor:** GRL-EST-L05a-019-07 (wait): ENT-L05a-0060, ENT-L05a-0061
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 a sessão do seletor aberta.** `src/editor/input/pointer/tools.ts:21` `      shared.session = store.gesture();` e `src/editor/input/pointer/tools.ts:22` `      shared.open = shared.session;` — a sessão abre quando o seletor de cor abre (ENT-L05a-0031).
- **V3 a sessão e o gesto largados, com o fim guardado.** `src/editor/input/pointer/tools.ts:33` `    shared.session = null;`, `src/editor/input/pointer/tools.ts:34` `    shared.open = null;` e `src/editor/input/pointer/tools.ts:36` `    shared.pendingPickerEnd = () => {` — o fim do seletor guarda o commit ou o cancel para a microtarefa (ENT-L05a-0059).
- **Sem estado de recusa.** `src/editor/input/pointer/tools.ts:30` `    if (!ended && !escaped) return;` — sem o seletor fechado nem o Escape, a sessão continua e nada é largado.

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
