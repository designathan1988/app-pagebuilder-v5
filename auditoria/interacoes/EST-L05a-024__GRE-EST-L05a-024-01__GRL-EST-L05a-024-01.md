# EST-L05a-024 × GRE-EST-L05a-024-01 → GRL-EST-L05a-024-01
- **Estado:** EST-L05a-024
- **Escritor:** GRE-EST-L05a-024-01 (setBanding): ENT-L05a-0034
- **Leitor:** GRL-EST-L05a-024-01 (get): ENT-L05a-0020
## Estados deixados por A
- **V1 o valor inicial da célula `bandingNow`.** `src/editor/input/pointer/views.ts:89` `let value = first;` — a célula nasce com o valor inicial (`null`).
- **V2 o valor publicado pelo grupo.** `src/editor/input/pointer.ts:160` `setBanding(null);` — o ouvinte de cancelamento tira a faixa publicada (fluxo ENT-L05a-0034); a produtora que guarda o valor é `src/editor/input/pointer/views.ts:99` `value = next;`.
- **V3 a publicação notifica os ouvintes.** `src/editor/input/pointer/views.ts:100` `for (const listener of [...listeners]) listener();` — só quando o valor muda.
- **V4 o mesmo valor não notifica.** `src/editor/input/pointer/views.ts:98` `if (same(next, value)) return;` — publicar um valor igual ao guardado para o `set` antes de escrever.
## Casos
### C1 final
- O escritor já terminou e deixou a célula publicada: `src/editor/input/pointer.ts:160` `setBanding(null);`.
- O leitor é o `get` da célula publicada, que lê o item em `src/editor/input/pointer/views.ts:92` `get: () => value,` e devolve o valor guardado.
- ok — o leitor lê o valor publicado que o escritor deixou.
### C2 intermediário
- O estado intermediário é o valor publicado a meio do gesto (a faixa que o arraste desenha), guardado em `src/editor/input/pointer/views.ts:99` `value = next;`.
- O leitor lê `src/editor/input/pointer/views.ts:92` `get: () => value,` e devolve esse valor, que o cromo do canvas desenha enquanto o gesto corre.
- ok — o leitor lê o valor publicado a meio do gesto.
### C3 em curso
- Os ouvintes da célula correm em `src/editor/input/pointer/views.ts:100` `for (const listener of [...listeners]) listener();`, depois de o valor ser guardado em `src/editor/input/pointer/views.ts:99` `value = next;`; um ouvinte que leia pelo `get` vê o valor novo.
- ok — o leitor chamado no meio da publicação vê o valor novo, nunca o antigo.
### C4 desmontagem
- n/a — a célula publicada não tem remoção: vive nas visões da store (`src/editor/input/pointer/views.ts:221` `const VIEWS = new WeakMap<object, PointerViews>();`); quem se desinscreve é o ouvinte, em `src/editor/input/pointer/views.ts:95` `return () => listeners.delete(listener);`.
## Resultado
- O leitor devolve o valor guardado na célula publicada: `src/editor/input/pointer/views.ts:92` `get: () => value,`.
