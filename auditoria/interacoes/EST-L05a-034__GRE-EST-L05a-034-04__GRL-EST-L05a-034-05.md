# EST-L05a-034 × GRE-EST-L05a-034-04 → GRL-EST-L05a-034-05
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-04 (o callback): ENT-L05a-0052
- **Leitor:** GRL-EST-L05a-034-05 (onDoubleClick): ENT-L05a-0041
## Estados deixados por A
- **V-com-o-intervalo.** `src/editor/input/pointer/events.ts:92` `hold.timer = window.setInterval(() => repeat(held), REPEAT_INTERVAL);` — a repetição passa a guardar o intervalo que a repete.
- **V-para.** `src/editor/input/pointer/events.ts:90` `if (ps.repeating !== hold) return;` — se a repetição já não é a mesma, o callback para sem escrever.
- **Sem recusa.** O callback só corre o passo do controlo (`src/editor/input/pointer/events.ts:91` `repeat(held);`).
- **Sem intermediário.** Uma só instrução escreve o temporizador (`src/editor/input/pointer/events.ts:92` `hold.timer = window.setInterval(() => repeat(held), REPEAT_INTERVAL);`).
## Casos
### C1 final
- Lê a máquina em `src/editor/input/pointer/events.ts:38` `if (ps.machine.phase !== 'idle' || shared.open !== null || event.button !== 0) return;`: só com a máquina ociosa, sem gesto aberto e no botão primário segue.
- Abre um gesto e despacha a porta do duplo clique (`src/editor/input/pointer/events.ts:43` `const gesture = store.gesture();`).
- ok — com a máquina ociosa, o leitor corre o comando do duplo clique.

### C2 intermediário
- n/a — o caminho decide pela máquina deixada (`src/editor/input/pointer/events.ts:38` `if (ps.machine.phase !== 'idle' || shared.open !== null || event.button !== 0) return;`) e não por um meio.

### C3 em curso
- n/a — o duplo clique corre no seu próprio evento, fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de dblclick (`src/editor/input/pointer.ts:235` `target.removeEventListener('dblclick', p.onDoubleClick, true);`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor reconhece a máquina ociosa e corre o comando do duplo clique num gesto: `src/editor/input/pointer/events.ts:43` `const gesture = store.gesture();`.
