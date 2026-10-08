# EST-L05a-001 × GRE-EST-L05a-001-02 → GRL-EST-L05a-001-05
- **Estado:** EST-L05a-001
- **Escritor:** GRE-EST-L05a-001-02 (holdTyping): ENT-L09a-0133
- **Leitor:** GRL-EST-L05a-001-05 (keepTypingBefore): ENT-L05a-0040
## Estados deixados por A
- **V-segurada.** `src/editor/shell/field.tsx:1782` `      else if (heldTyping()?.field !== element) holdTyping({ field: element, region: regionOf(element), context: editContextOf(store.getState()), owns, keep });` — o campo passa a ser a digitação pendente.
- **V-do-primeiro-gravar.** `src/editor/input/pending.ts:31` `  if (held !== null && held.field !== typing.field) keepTyping();` — outra digitação pendente é gravada antes de a nova ser segurada.

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
