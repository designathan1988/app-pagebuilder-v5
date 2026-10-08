# EST-L05a-024 × GRE-EST-L05a-024-02 → GRL-EST-L05a-024-01
- **Estado:** EST-L05a-024
- **Escritor:** GRE-EST-L05a-024-02 (setCanvasPointer): ENT-L05a-0042
- **Leitor:** GRL-EST-L05a-024-01 (get): ENT-L05a-0020
## Estados deixados por A
- **V1 o valor inicial da célula `canvasPointer`.** `src/editor/input/pointer/views.ts:89` `let value = first;` — a célula nasce com o valor inicial (`null`).
- **V2 o valor publicado pelo grupo.** `src/editor/input/pointer/events.ts:273` `setCanvasPointer(shared.overStage ? { x: event.clientX, y: event.clientY } : null);` — `onMove` publica a posição do ponteiro sobre o palco, ou nulo fora dele (fluxo ENT-L05a-0042); a produtora que guarda o valor é `src/editor/input/pointer/views.ts:99` `value = next;`.
- **V3 a publicação notifica os ouvintes.** `src/editor/input/pointer/views.ts:100` `for (const listener of [...listeners]) listener();`.
- **V4 o mesmo valor não notifica.** `src/editor/input/pointer/views.ts:98` `if (same(next, value)) return;` — a célula `canvasPointer` compara as coordenadas (`src/editor/input/pointer/views.ts:127` `const canvasPointer = published<Point | null>(null, (a, b) => a === b || (a !== null && b !== null && a.x === b.x && a.y === b.y));`).
## Casos
### C1 final
- O escritor já terminou e deixou a célula publicada: `src/editor/input/pointer/events.ts:273` `setCanvasPointer(shared.overStage ? { x: event.clientX, y: event.clientY } : null);`.
- O leitor é o `get` da célula publicada, que lê o item em `src/editor/input/pointer/views.ts:92` `get: () => value,` e devolve a posição guardada.
- ok — o leitor lê a posição publicada que o escritor deixou.
### C2 intermediário
- O estado intermediário é a posição publicada a cada movimento do ponteiro, guardada em `src/editor/input/pointer/views.ts:99` `value = next;`.
- O leitor lê `src/editor/input/pointer/views.ts:92` `get: () => value,` e devolve a posição, que a régua desenha enquanto o ponteiro se move.
- ok — o leitor lê a posição publicada a meio do movimento.
### C3 em curso
- Os ouvintes da célula correm em `src/editor/input/pointer/views.ts:100` `for (const listener of [...listeners]) listener();`, depois de a posição ser guardada em `src/editor/input/pointer/views.ts:99` `value = next;`; um ouvinte que leia pelo `get` vê a posição nova.
- ok — o leitor chamado no meio da publicação vê a posição nova.
### C4 desmontagem
- n/a — a célula publicada não tem remoção: vive nas visões da store (`src/editor/input/pointer/views.ts:221` `const VIEWS = new WeakMap<object, PointerViews>();`); quem se desinscreve é o ouvinte, em `src/editor/input/pointer/views.ts:95` `return () => listeners.delete(listener);`.
## Resultado
- O leitor devolve a posição guardada na célula publicada: `src/editor/input/pointer/views.ts:92` `get: () => value,`.
