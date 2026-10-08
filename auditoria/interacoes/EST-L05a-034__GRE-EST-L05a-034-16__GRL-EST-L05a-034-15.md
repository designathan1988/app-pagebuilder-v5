# EST-L05a-034 × GRE-EST-L05a-034-16 → GRL-EST-L05a-034-15
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-16 (stopRepeating): ENT-L05a-0043, ENT-L05a-0044, ENT-L05a-0048
- **Leitor:** GRL-EST-L05a-034-15 (run): ENT-P-events-0008, ENT-P-motion-0041
## Estados deixados por A
- **V-sem-repetição.** `src/editor/input/pointer/panels.ts:33` `ps.repeating = null;` — larga a repetição guardada.
- **V-intacto.** `src/editor/input/pointer/panels.ts:30` `if (ps.repeating === null) return;` — sem repetição o caminho para sem escrever.
- **Sem recusa.** O caminho não despacha comando.
- **Sem intermediário.** `src/editor/input/pointer/panels.ts:33` `ps.repeating = null;` é uma só instrução.
## Casos
### C1 final
- Lê a escolha guardada em `src/editor/input/pointer/effects.ts:253` `ps.pickAfter = null;` e despacha-a (`src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`).
- ok — o leitor lê a escolha deixada e corre o comando dela.

### C2 intermediário
- n/a — o run reage ao efeito da máquina, quando o escritor já completou a instrução (`src/editor/input/pointer/effects.ts:60` `if (pickingDoor !== null) ps.pickAfter = { entry: pickingDoor, args: argsFor(pickingDoor, press, picking) };`).

### C3 em curso
- O run do fim do gesto despacha pelo gesto (`src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`); a store avisa os assinantes dentro desse despacho, e a máquina já foi largada antes (`src/editor/input/pointer/effects.ts:169` `ps.dragging = null;`).
- ok — a leitura em curso vê a sessão com a máquina já largada.

### C4 desmontagem
- O cancelamento do dono leva a máquina a ociosa (`src/editor/input/pointer/effects.ts:294` `ps.machine = IDLE;`) e retira a escolha (`src/editor/input/pointer/effects.ts:253` `ps.pickAfter = null;`).
- ok — depois da desmontagem não fica escolha por despachar.

## Resultado
- O leitor retira a escolha guardada e corre o comando dela: `src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`.
