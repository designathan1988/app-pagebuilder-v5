# EST-L05a-034 × GRE-EST-L05a-034-15 → GRL-EST-L05a-034-05
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-15 (run): ENT-P-events-0008, ENT-P-motion-0041
- **Leitor:** GRL-EST-L05a-034-05 (onDoubleClick): ENT-L05a-0041
## Estados deixados por A
- **V-com-a-escolha.** `src/editor/input/pointer/effects.ts:60` `if (pickingDoor !== null) ps.pickAfter = { entry: pickingDoor, args: argsFor(pickingDoor, press, picking) };` — guarda a porta e os argumentos da escolha para o fim do gesto.
- **V-sem-arraste.** `src/editor/input/pointer/effects.ts:169` `ps.dragging = null;` — o fim do gesto larga o arraste.
- **V-sem-a-escolha.** `src/editor/input/pointer/effects.ts:253` `ps.pickAfter = null;` — no fim a escolha é retirada e despachada (`src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`).
- **Sem recusa.** A recusa do comando escolhido não muda a sessão: a escolha é retirada e despachada à mesma.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/effects.ts:169` `ps.dragging = null;`).
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
