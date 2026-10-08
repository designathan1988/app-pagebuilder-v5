# EST-L05a-034 × GRE-EST-L05a-034-05 → GRL-EST-L05a-034-13
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-05 (o ouvinte): ENT-L05a-0034, ENT-L05a-0035, ENT-L05a-0036, ENT-L05a-0037
- **Leitor:** GRL-EST-L05a-034-13 (resize): ENT-P-view-0103
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
- Lê o splitter em `src/editor/input/pointer/resize.ts:18` `if (ps.splitting === null) return;`: sem splitter aberto nada corre.
- Com splitter, despacha o comando com o tamanho do início e a distância (`src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);`).
- ok — o leitor lê o splitter deixado e corre o comando.

### C2 intermediário
- n/a — o caminho decide pelo splitter deixado (`src/editor/input/pointer/resize.ts:18` `if (ps.splitting === null) return;`).

### C3 em curso
- n/a — o resize corre a partir do pointermove, fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointermove que chama o resize (`src/editor/input/pointer.ts:236` `target.removeEventListener('pointermove', p.onMove, true);`).
- ok — depois da desmontagem o splitter guardado deixa de ser lido.

## Resultado
- O leitor despacha o comando do splitter com o tamanho do início e a distância do ponteiro: `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);`.
