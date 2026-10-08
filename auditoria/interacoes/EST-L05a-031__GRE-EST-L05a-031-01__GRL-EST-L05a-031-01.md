# EST-L05a-031 × GRE-EST-L05a-031-01 → GRL-EST-L05a-031-01
- **Estado:** EST-L05a-031
- **Escritor:** GRE-EST-L05a-031-01 (setPressing): ENT-L05a-0040, ENT-L05a-0043, ENT-L05a-0044, ENT-L05a-0048
- **Leitor:** GRL-EST-L05a-031-01 (pointerPressing): ENT-L05a-0045
## Estados deixados por A
- **V1 falso.** `src/editor/input/pointer/views.ts:146` `let pressing = false;` — nenhum botão pressionado; é o valor da criação.
- **V2 verdadeiro.** `src/editor/input/pointer/views.ts:184` `pressing = down;` — setPressing(true) marca o botão pressionado no início de cada pressão (`src/editor/input/pointer/events.ts:59` `setPressing(true);`).
- **V1 de novo.** `src/editor/input/pointer/views.ts:184` `pressing = down;` — setPressing(false) desmarca-o na libertação (`src/editor/input/pointer/events.ts:433` `setPressing(false);`) e no cancelamento (`src/editor/input/pointer/events.ts:544` `setPressing(false);`).
- **V3 preso.** `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` — uma pressão anterior que ficou sem libertação termina em p.onCancel(), que desmarca (`src/editor/input/pointer/events.ts:544` `setPressing(false);`).
- **Sem intermediário.** `src/editor/input/pointer/views.ts:184` `pressing = down;` é uma só instrução; nenhum gesto, grupo ou sequência escreve este item.
- **Sem recusa.** Nenhuma destas linhas depende da recusa de um comando.

## Casos
### C1 final
- O escritor terminou; o leitor lê o valor em `src/editor/input/pointer/views.ts:182` `pointerPressing: (): boolean => pressing,`.
- ok — o leitor lê o valor booleano que o escritor deixou.

### C2 intermediário
- n/a — `src/editor/input/pointer/views.ts:184` `pressing = down;` é uma só instrução, sem meio.

### C3 em curso
- n/a — o leitor é chamado num evento de ponteiro, fora da execução do escritor (`src/editor/input/pointer/events.ts:558` `if (pointerPressing()) p.onCancel();`).

### C4 desmontagem
- O desmonte do dono do ponteiro cancela o gesto (`src/editor/input/pointer.ts:220` `p.onCancel();`) e desmarca a pressão (`src/editor/input/pointer/events.ts:544` `setPressing(false);`).
- ok — depois da desmontagem o valor volta a falso.

## Resultado
- O leitor usa o valor para só cancelar o gesto quando o botão ainda está pressionado: `src/editor/input/pointer/events.ts:558` `if (pointerPressing()) p.onCancel();`.
