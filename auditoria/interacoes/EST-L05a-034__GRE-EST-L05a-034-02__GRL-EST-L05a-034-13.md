# EST-L05a-034 × GRE-EST-L05a-034-02 → GRL-EST-L05a-034-13
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-02 (dropTool): ENT-L05a-0033
- **Leitor:** GRL-EST-L05a-034-13 (resize): ENT-P-view-0103
## Estados deixados por A
- **V-sem-ferramenta.** `src/editor/input/pointer/tools.ts:11` `if (ps.tooling === null) return;` — sem ferramenta o campo fica como estava.
- **V-larga-a-ferramenta.** `src/editor/input/pointer/tools.ts:13` `ps.tooling = null;` — larga a ferramenta; a sessão e o gesto dela são cancelados logo depois (`src/editor/input/pointer/tools.ts:15` `session.cancel();`).
- **Sem recusa.** O caminho não despacha comando: cancela a sessão e o gesto da ferramenta (`src/editor/input/pointer/tools.ts:16` `gesture.cancel();`).
- **Sem intermediário.** `src/editor/input/pointer/tools.ts:13` `ps.tooling = null;` é uma só instrução.
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
