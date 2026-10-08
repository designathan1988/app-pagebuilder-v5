# EST-L05a-034 × GRE-EST-L05a-034-05 → GRL-EST-L05a-034-02
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-05 (o ouvinte): ENT-L05a-0034, ENT-L05a-0035, ENT-L05a-0036, ENT-L05a-0037
- **Leitor:** GRL-EST-L05a-034-02 (dropTool): ENT-L05a-0033
## Estados deixados por A
- **V-sem-faixa.** `src/editor/input/pointer.ts:159` `ps.spacing = null;` — Escape durante a faixa de espaçamento larga-a.
- **V-sem-guia.** `src/editor/input/pointer.ts:168` `ps.guiding = null;` — Escape durante o arraste de guia larga-a.
- **V-sem-rotação.** `src/editor/input/pointer.ts:177` `ps.rotating = null;` — Escape durante a rotação larga-a.
- **V-sem-redimensionamento.** `src/editor/input/pointer.ts:185` `ps.resizing = null;` — Escape durante o redimensionamento larga-o.
- **V-do-redesenho.** `src/editor/input/pointer.ts:193` `p.redraw(ps.pointerAt, false);` — sem cancelamento novo, o gesto aberto é redesenhado sem publicar.
- **Sem recusa.** Cada largada depende da contagem de cancelamentos da store (`src/editor/input/pointer.ts:157` `if (ps.spacing?.gesture != null && store.getState().ui.drag.cancels !== ps.spacing.cancels) {`); a recusa de um comando não muda a sessão.
- **Sem intermediário.** Cada largada é uma só instrução (`src/editor/input/pointer.ts:159` `ps.spacing = null;`).
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
