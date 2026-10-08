# EST-L05a-034 × GRE-EST-L05a-034-14 → GRL-EST-L05a-034-10
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-14 (rest): ENT-L05a-0057
- **Leitor:** GRL-EST-L05a-034-10 (onNative): ENT-L05a-0049, ENT-L05a-0050
## Estados deixados por A
- **V-intacto.** `src/editor/input/pointer/drag.ts:177` `if (ps.dragging === null) return;` — sem arraste aberto nada é escrito.
- **V-com-a-linha.** `src/editor/input/pointer/drag.ts:180` `ps.dragging.resting = folded;` — guarda a linha dobrada em que o ponteiro repousa.
- **V-do-temporizador.** `src/editor/input/pointer/drag.ts:186` `ps.unfold = setTimeout(() => {` — arma a abertura da linha com a permanência lida.
- **Sem recusa.** O caminho não despacha comando por si: a abertura corre no gesto aberto (`src/editor/input/pointer/drag.ts:189` `shared.open?.dispatch(dwell.command.id as CommandId, { ...dwell.door.args, target: folded } as never);`).
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:180` `ps.dragging.resting = folded;`).
## Casos
### C1 final
- Lê a máquina em `src/editor/input/pointer/events.ts:563` `if (ps.machine.phase !== 'idle') event.preventDefault();`: durante um gesto impede a ação por omissão do navegador.
- ok — o leitor lê a máquina deixada e bloqueia a seleção e o arraste nativos.

### C2 intermediário
- n/a — `src/editor/input/pointer/events.ts:563` `if (ps.machine.phase !== 'idle') event.preventDefault();` só compara a fase.

### C3 em curso
- n/a — o evento corre fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove os ouvintes de selectstart e dragstart (`src/editor/input/pointer.ts:243` `target.removeEventListener('selectstart', p.onNative, true);`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor impede a seleção e o arraste nativos do navegador durante um gesto: `src/editor/input/pointer/events.ts:563` `if (ps.machine.phase !== 'idle') event.preventDefault();`.
