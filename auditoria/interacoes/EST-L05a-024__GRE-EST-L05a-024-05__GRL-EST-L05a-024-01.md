# EST-L05a-024 × GRE-EST-L05a-024-05 → GRL-EST-L05a-024-01
- **Estado:** EST-L05a-024
- **Escritor:** GRE-EST-L05a-024-05 (setMenuOver): ENT-L05a-0053
- **Leitor:** GRL-EST-L05a-024-01 (get): ENT-L05a-0020
## Estados deixados por A
- **V1 o valor inicial da célula `menuOver`.** `src/editor/input/pointer/views.ts:89` `let value = first;` — a célula nasce com o valor inicial (`null`).
- **V2 o valor publicado pelo grupo.** `src/editor/input/pointer/events.ts:269` `if (menuUnder === null) setMenuOver(null);` e `src/editor/input/pointer/events.ts:270` `else ps.menuDwell = setTimeout(() => setMenuOver(menuUnder), MENU_HOVER_SWITCH);` — `onMove` publica o botão de menu de aplicação sob o ponteiro, ou nulo (fluxo ENT-L05a-0053); a produtora que guarda o valor é `src/editor/input/pointer/views.ts:99` `value = next;`.
- **V3 a publicação notifica os ouvintes.** `src/editor/input/pointer/views.ts:100` `for (const listener of [...listeners]) listener();`.
- **V4 o mesmo valor não notifica.** `src/editor/input/pointer/views.ts:98` `if (same(next, value)) return;`.
## Casos
### C1 final
- O escritor já terminou e deixou a célula publicada: `src/editor/input/pointer/events.ts:269` `if (menuUnder === null) setMenuOver(null);`.
- O leitor é o `get` da célula publicada, que lê o item em `src/editor/input/pointer/views.ts:92` `get: () => value,` e devolve o valor guardado.
- ok — o leitor lê o botão de menu publicado que o escritor deixou.
### C2 intermediário
- O estado intermediário é o botão publicado depois do tempo de permanência do ponteiro, guardado em `src/editor/input/pointer/views.ts:99` `value = next;` (o `setMenuOver` do temporizador de `src/editor/input/pointer/events.ts:270` `else ps.menuDwell = setTimeout(() => setMenuOver(menuUnder), MENU_HOVER_SWITCH);`).
- O leitor lê `src/editor/input/pointer/views.ts:92` `get: () => value,` e devolve esse botão, que a barra de menus usa para trocar o menu aberto.
- ok — o leitor lê o botão publicado a meio da permanência do ponteiro.
### C3 em curso
- Os ouvintes da célula correm em `src/editor/input/pointer/views.ts:100` `for (const listener of [...listeners]) listener();`, depois de o valor ser guardado em `src/editor/input/pointer/views.ts:99` `value = next;`; um ouvinte que leia pelo `get` vê o valor novo.
- ok — o leitor chamado no meio da publicação vê o botão novo.
### C4 desmontagem
- n/a — a célula publicada não tem remoção: vive nas visões da store (`src/editor/input/pointer/views.ts:221` `const VIEWS = new WeakMap<object, PointerViews>();`); quem se desinscreve é o ouvinte, em `src/editor/input/pointer/views.ts:95` `return () => listeners.delete(listener);`.
## Resultado
- O leitor devolve o botão de menu guardado na célula publicada: `src/editor/input/pointer/views.ts:92` `get: () => value,`.
