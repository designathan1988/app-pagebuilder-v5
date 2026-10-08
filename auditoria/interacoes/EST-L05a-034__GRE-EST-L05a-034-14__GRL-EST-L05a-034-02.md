# EST-L05a-034 × GRE-EST-L05a-034-14 → GRL-EST-L05a-034-02
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-14 (rest): ENT-L05a-0057
- **Leitor:** GRL-EST-L05a-034-02 (dropTool): ENT-L05a-0033
## Estados deixados por A
- **V-intacto.** `src/editor/input/pointer/drag.ts:177` `if (ps.dragging === null) return;` — sem arraste aberto nada é escrito.
- **V-com-a-linha.** `src/editor/input/pointer/drag.ts:180` `ps.dragging.resting = folded;` — guarda a linha dobrada em que o ponteiro repousa.
- **V-do-temporizador.** `src/editor/input/pointer/drag.ts:186` `ps.unfold = setTimeout(() => {` — arma a abertura da linha com a permanência lida.
- **Sem recusa.** O caminho não despacha comando por si: a abertura corre no gesto aberto (`src/editor/input/pointer/drag.ts:189` `shared.open?.dispatch(dwell.command.id as CommandId, { ...dwell.door.args, target: folded } as never);`).
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:180` `ps.dragging.resting = folded;`).
## Casos
### C1 final
- O escritor já terminou; o dropTool lê a ferramenta em `src/editor/input/pointer/tools.ts:11` `if (ps.tooling === null) return;`.
- Com ferramenta, larga-a (`src/editor/input/pointer/tools.ts:13` `ps.tooling = null;`) e cancela a sessão e o gesto (`src/editor/input/pointer/tools.ts:16` `gesture.cancel();`).
- ok — o leitor larga a ferramenta e desfaz o que ela fez.

### C2 intermediário
- n/a — o caminho reage à ferramenta deixada; a ferramenta é um só campo (`src/editor/input/pointer/tools.ts:11` `if (ps.tooling === null) return;`).

### C3 em curso
- n/a — o dropTool corre numa microtarefa (`src/editor/input/pointer.ts:153` `queueMicrotask(p.dropTool);`), fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono do ponteiro remove as assinaturas da store (`src/editor/input/pointer.ts:216` `stopListening();`) e cancela já a ferramenta (`src/editor/input/pointer.ts:220` `p.onCancel();`).
- ok — depois da desmontagem o dropTool deixa de ser agendado.

## Resultado
- O leitor larga a ferramenta e cancela a sessão e o gesto dela: `src/editor/input/pointer/tools.ts:16` `gesture.cancel();`.
