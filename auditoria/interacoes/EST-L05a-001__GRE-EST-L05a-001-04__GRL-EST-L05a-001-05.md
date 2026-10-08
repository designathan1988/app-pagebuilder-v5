# EST-L05a-001 × GRE-EST-L05a-001-04 → GRL-EST-L05a-001-05
- **Estado:** EST-L05a-001
- **Escritor:** GRE-EST-L05a-001-04 (releaseTyping): ENT-L09a-0129, ENT-L09a-0131, ENT-L09a-0132, ENT-L09a-0133, ENT-L09a-0134
- **Leitor:** GRL-EST-L05a-001-05 (keepTypingBefore): ENT-L05a-0040
## Estados deixados por A
- **V-solta.** `src/editor/input/pending.ts:37` `  if (held?.field === field) held = null;` — a digitação do campo dado volta a `null`.
- **V-ao-voltar-ao-mostrado.** `src/editor/shell/field.tsx:1781` `      if (element.value === typing.shown) releaseTyping(element);` — texto de volta ao mostrado solta a digitação.
- **V-ao-restaurar.** `src/editor/shell/field.tsx:1739` `    releaseTyping(element);` — restaurar o campo solta a digitação pendente.
- **V-de-outro-campo-fica.** `src/editor/input/pending.ts:37` `  if (held?.field === field) held = null;` — campo diferente: a digitação pendente continua.

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
