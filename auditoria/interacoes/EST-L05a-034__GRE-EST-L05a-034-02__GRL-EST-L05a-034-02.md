# EST-L05a-034 × GRE-EST-L05a-034-02 → GRL-EST-L05a-034-02
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-02 (dropTool): ENT-L05a-0033
- **Leitor:** GRL-EST-L05a-034-02 (dropTool): ENT-L05a-0033
## Estados deixados por A
- **V-sem-ferramenta.** `src/editor/input/pointer/tools.ts:11` `if (ps.tooling === null) return;` — sem ferramenta o campo fica como estava.
- **V-larga-a-ferramenta.** `src/editor/input/pointer/tools.ts:13` `ps.tooling = null;` — larga a ferramenta; a sessão e o gesto dela são cancelados logo depois (`src/editor/input/pointer/tools.ts:15` `session.cancel();`).
- **Sem recusa.** O caminho não despacha comando: cancela a sessão e o gesto da ferramenta (`src/editor/input/pointer/tools.ts:16` `gesture.cancel();`).
- **Sem intermediário.** `src/editor/input/pointer/tools.ts:13` `ps.tooling = null;` é uma só instrução.
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
