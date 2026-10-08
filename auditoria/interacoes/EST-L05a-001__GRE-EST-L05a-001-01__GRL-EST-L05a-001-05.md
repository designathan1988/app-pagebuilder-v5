# EST-L05a-001 × GRE-EST-L05a-001-01 → GRL-EST-L05a-001-05
- **Estado:** EST-L05a-001
- **Escritor:** GRE-EST-L05a-001-01 (gesture): ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082, ENT-P-view-0087, ENT-P-view-0103
- **Leitor:** GRL-EST-L05a-001-05 (keepTypingBefore): ENT-L05a-0040
## Estados deixados por A
- **V-gravada-ao-abrir-gesto.** `src/editor/store.ts:205` `      keepTyping();` — a abertura do gesto grava a digitação pendente antes de o gesto servir.
- **V-antes-da-medida.** `src/editor/input/pointer/events.ts:58` `    keepTypingBefore(event.target);` — a pressão grava a digitação antes de medir a caixa da seleção.
- **V-sem-digitacao.** `src/editor/input/pending.ts:46` `  if (typing === null) return;` — sem digitação pendente nada é gravado.

## Casos
### C1 final
- O escritor terminou: a digitação pendente, se havia, foi gravada (`src/editor/input/pending.ts:48` `  typing.keep();`).
- O leitor chega no começo de cada pressão: `src/editor/input/pointer/events.ts:58` `    keepTypingBefore(event.target);` — grava a digitação pendente antes de a pressão medir.
- ok — a pressão sobre o próprio campo não grava (`src/editor/input/pending.ts:68` `  if (target instanceof Node && within(typing, target)) return;`).
### C2 intermediário
- n/a — a gravação é uma chamada só (`src/editor/input/pending.ts:65` `export function keepTypingBefore(target: EventTarget | null): void {`).
### C3 em curso
- O leitor corre no primeiro toque, antes de a pressão medir: `src/editor/input/pointer/events.ts:58` `    keepTypingBefore(event.target);`.
- ok — o leitor lê o registo antes de a pressão agir.
### C4 desmontagem
- n/a — a leitura é de uma função pura (`src/editor/input/pending.ts:65` `export function keepTypingBefore(target: EventTarget | null): void {`).

## Resultado
- O leitor grava a digitação pendente antes de a pressão medir ou correr algo: `src/editor/input/pointer/events.ts:58` `    keepTypingBefore(event.target);`.
