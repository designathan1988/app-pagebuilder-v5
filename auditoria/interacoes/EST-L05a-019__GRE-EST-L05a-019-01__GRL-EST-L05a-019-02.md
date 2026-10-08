# EST-L05a-019 × GRE-EST-L05a-019-01 → GRL-EST-L05a-019-02
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-01 (dropTool): ENT-L05a-0033
- **Leitor:** GRL-EST-L05a-019-02 (o ouvinte): ENT-L05a-0032, ENT-L05a-0038
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `open` de volta a nulo.** `src/editor/input/pointer/tools.ts:14` `    if (shared.open === gesture) shared.open = null;` — `dropTool` larga o gesto aberto da ferramenta quando era o dela e cancela a sessão logo a seguir (`src/editor/input/pointer/tools.ts:15` `    session.cancel();`); é a escrita da ENT-L05a-0033.
- **Sem estado de recusa.** `src/editor/input/pointer/tools.ts:11` `    if (ps.tooling === null) return;` — sem ferramenta a segurar a sessão, `dropTool` não escreve o item.

## Casos
### C1 final
- O leitor é o ouvinte da store inscrito em `src/editor/input/pointer.ts:149` `  const stopListening = store.subscribe(() => {`.
- Chega depois de o escritor ter escrito o item e lê-o em `src/editor/input/pointer.ts:150` `    if (shared.session !== null) return;` e em `src/editor/input/pointer.ts:191` `    if (shared.open === null) return;`: sem sessão e com um gesto aberto o caminho segue para `src/editor/input/pointer.ts:196` `    const cancelled = shared.open;`.
- ok — o leitor lê o gesto aberto e larga-o quando o Escape o cancela.
### C2 intermediário
- A meio de um gesto o item guarda o gesto aberto: `src/editor/input/pointer/events.ts:245` `        shared.open = gesture;`.
- O leitor lê `src/editor/input/pointer.ts:191` `    if (shared.open === null) return;`: a condição é falsa e ele segue até `src/editor/input/pointer.ts:196` `    const cancelled = shared.open;`.
- ok — o leitor lê o gesto de meio de gesto.
### C3 em curso
- A leitura em `src/editor/input/pointer.ts:191` `    if (shared.open === null) return;` corre no ouvinte da store enquanto o escritor larga o gesto em `src/editor/input/pointer.ts:161` `      shared.open = null;`; a leitura vê o valor inteiro.
- ok — a leitura em curso vê o valor inteiro.
### C4 desmontagem
- A desmontagem do dono do ponteiro remove a inscrição em `src/editor/input/pointer.ts:216` `    stopListening();`, e o item partilhado é largado (`src/editor/input/pointer.ts:224` `    shared.panning = null;`).
- O leitor deixa de correr com a inscrição removida.
- ok — depois de desmontado o dono, o leitor não corre.

## Resultado
- O leitor lê o gesto aberto e larga-o quando o Escape o cancela: `src/editor/input/pointer.ts:196` `    const cancelled = shared.open;`.
