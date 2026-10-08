# EST-L05a-024 × GRE-EST-L05a-024-04 → GRL-EST-L05a-024-01
- **Estado:** EST-L05a-024
- **Escritor:** GRE-EST-L05a-024-04 (setHovered): ENT-L05a-0042, ENT-L05a-0044, ENT-L05a-0048
- **Leitor:** GRL-EST-L05a-024-01 (get): ENT-L05a-0020
## Estados deixados por A
- **V1 o valor inicial da célula `hover`.** `src/editor/input/pointer/views.ts:89` `let value = first;` — a célula nasce com o valor inicial (`null`).
- **V2 o valor publicado pelo grupo.** `src/editor/input/pointer/events.ts:395` `setHovered(ps.machine.phase === 'idle' && press !== null && press !== 'elsewhere' && press.on === 'node' ? press.node : null);` — `onMove` publica o nó sob o ponteiro (fluxo ENT-L05a-0042); `src/editor/input/pointer/events.ts:552` `setHovered(null);` — `onCancel` tira o realce (fluxos ENT-L05a-0044 e ENT-L05a-0048). A produtora que guarda o valor é `src/editor/input/pointer/views.ts:99` `value = next;`.
- **V3 a publicação notifica os ouvintes.** `src/editor/input/pointer/views.ts:100` `for (const listener of [...listeners]) listener();`.
- **V4 o mesmo valor não notifica.** `src/editor/input/pointer/views.ts:98` `if (same(next, value)) return;` — publicar um valor igual ao guardado para o `set` antes de escrever.
## Casos
### C1 final
- O escritor já terminou e deixou a célula publicada: `src/editor/input/pointer/events.ts:552` `setHovered(null);`.
- O leitor é o `get` da célula publicada, que lê o item em `src/editor/input/pointer/views.ts:92` `get: () => value,` e devolve o valor guardado.
- ok — o leitor lê o realce publicado que o escritor deixou.
### C2 intermediário
- O estado intermediário é o nó publicado a cada movimento do ponteiro, guardado em `src/editor/input/pointer/views.ts:99` `value = next;`.
- O leitor lê `src/editor/input/pointer/views.ts:92` `get: () => value,` e devolve esse nó, que o cromo do canvas realça enquanto o ponteiro se move.
- ok — o leitor lê o nó publicado a meio do movimento.
### C3 em curso
- Os ouvintes da célula correm em `src/editor/input/pointer/views.ts:100` `for (const listener of [...listeners]) listener();`, depois de o valor ser guardado em `src/editor/input/pointer/views.ts:99` `value = next;`; um ouvinte que leia pelo `get` vê o valor novo.
- ok — o leitor chamado no meio da publicação vê o nó novo.
### C4 desmontagem
- n/a — a célula publicada não tem remoção: vive nas visões da store (`src/editor/input/pointer/views.ts:221` `const VIEWS = new WeakMap<object, PointerViews>();`); quem se desinscreve é o ouvinte, em `src/editor/input/pointer/views.ts:95` `return () => listeners.delete(listener);`.
## Resultado
- O leitor devolve o nó guardado na célula publicada: `src/editor/input/pointer/views.ts:92` `get: () => value,`.
