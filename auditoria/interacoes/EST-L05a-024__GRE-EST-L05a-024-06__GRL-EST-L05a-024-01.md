# EST-L05a-024 × GRE-EST-L05a-024-06 → GRL-EST-L05a-024-01
- **Estado:** EST-L05a-024
- **Escritor:** GRE-EST-L05a-024-06 (views.holdAlt): ENT-L05a-0029, ENT-L05a-0030
- **Leitor:** GRL-EST-L05a-024-01 (get): ENT-L05a-0020
## Estados deixados por A
- **V1 o valor inicial da célula `measuring`.** `src/editor/input/pointer/views.ts:89` `let value = first;` — a célula nasce com o valor inicial (`false`, `src/editor/input/pointer/views.ts:118` `const measuring = published(false);`).
- **V2 o valor publicado pelo grupo.** `src/editor/input/keymap.ts:410` `if (event.key === ALT) views.holdAlt(true);` — `onKeyDown` liga a medição enquanto o Alt está seguro; `src/editor/input/keymap.ts:539` `if (event.key === ALT) views.holdAlt(false);` — `onKeyUp` desliga-a (fluxos ENT-L05a-0029 e ENT-L05a-0030). A produtora que guarda o valor é `src/editor/input/pointer/views.ts:99` `value = next;`.
- **V3 a publicação notifica os ouvintes.** `src/editor/input/pointer/views.ts:100` `for (const listener of [...listeners]) listener();`.
- **V4 o mesmo valor não notifica.** `src/editor/input/pointer/views.ts:98` `if (same(next, value)) return;`.
## Casos
### C1 final
- O escritor já terminou e deixou a célula publicada: `src/editor/input/keymap.ts:539` `if (event.key === ALT) views.holdAlt(false);`.
- O leitor é o `get` da célula publicada, que lê o item em `src/editor/input/pointer/views.ts:92` `get: () => value,` e devolve o valor guardado.
- ok — o leitor lê o estado de medição que o escritor deixou.
### C2 intermediário
- O estado intermediário é o Alt segurado a meio de um gesto: `src/editor/input/keymap.ts:410` `if (event.key === ALT) views.holdAlt(true);` guarda o valor em `src/editor/input/pointer/views.ts:99` `value = next;`.
- O leitor lê `src/editor/input/pointer/views.ts:92` `get: () => value,` e devolve o valor, que a vista `duplicating` usa em `src/editor/input/pointer/common.ts:67` `return { get: () => DUPLICATE_DRAG !== null && DUPLICATE_KEY === 'Alt' && altHeld(), subscribe: measuring.subscribe };`.
- ok — o leitor lê o Alt segurado a meio do gesto.
### C3 em curso
- Os ouvintes da célula correm em `src/editor/input/pointer/views.ts:100` `for (const listener of [...listeners]) listener();`, depois de o valor ser guardado em `src/editor/input/pointer/views.ts:99` `value = next;`; um ouvinte que leia pelo `get` vê o valor novo.
- ok — o leitor chamado no meio da publicação vê o valor novo.
### C4 desmontagem
- n/a — a célula publicada não tem remoção: vive nas visões da store (`src/editor/input/pointer/views.ts:221` `const VIEWS = new WeakMap<object, PointerViews>();`); quem se desinscreve é o ouvinte, em `src/editor/input/pointer/views.ts:95` `return () => listeners.delete(listener);`.
## Resultado
- O leitor devolve o valor guardado na célula publicada: `src/editor/input/pointer/views.ts:92` `get: () => value,`.
