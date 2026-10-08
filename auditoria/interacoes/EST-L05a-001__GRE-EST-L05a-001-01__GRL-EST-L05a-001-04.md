# EST-L05a-001 × GRE-EST-L05a-001-01 → GRL-EST-L05a-001-04
- **Estado:** EST-L05a-001
- **Escritor:** GRE-EST-L05a-001-01 (gesture): ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082, ENT-P-view-0087, ENT-P-view-0103
- **Leitor:** GRL-EST-L05a-001-04 (keepTyping): ENT-P-animation-0005, ENT-P-animation-0017, ENT-P-capture-0005, ENT-P-design-system-0020, ENT-P-selection-0001, ENT-P-selection-0009, ENT-P-selection-0012, ENT-P-selection-0014, ENT-P-selection-0024, ENT-P-selection-0025, ENT-P-selection-0026, ENT-P-structure-0004, ENT-P-structure-0006, ENT-P-structure-0007, ENT-P-structure-0008, ENT-P-structure-0024, ENT-P-structure-0025, ENT-P-structure-0029, ENT-P-structure-0030, ENT-P-structure-0034, ENT-P-structure-0035, ENT-P-structure-0041, ENT-P-structure-0042, ENT-P-structure-0050, ENT-P-structure-0063, ENT-P-structure-0064, ENT-P-structure-0075, ENT-P-structure-0076, ENT-P-structure-0080, ENT-P-structure-0081, ENT-P-style-0142, ENT-P-style-0143, ENT-P-style-0144, ENT-P-style-0152, ENT-P-style-0184, ENT-P-style-0185, ENT-P-style-0186, ENT-P-style-0187, ENT-P-style-0188, ENT-P-style-0189, ENT-P-style-0190, ENT-P-style-0191, ENT-P-style-0207, ENT-P-style-0208, ENT-P-style-0209, ENT-P-style-0210, ENT-P-style-0217, ENT-P-style-0230, ENT-P-style-0256, ENT-P-style-0257, ENT-P-style-0263, ENT-P-style-0264, ENT-P-style-0265, ENT-P-style-0266, ENT-P-style-0298, ENT-P-style-0309, ENT-P-style-0314, ENT-P-style-0319, ENT-P-style-0322, ENT-P-style-0323, ENT-P-style-0332, ENT-P-style-0333, ENT-P-style-0337, ENT-P-text-0001
## Estados deixados por A
- **V-gravada-ao-abrir-gesto.** `src/editor/store.ts:217` `      keepTyping();` — a abertura do gesto grava a digitação pendente antes de o gesto servir.
- **V-antes-da-medida.** `src/editor/input/pointer/events.ts:58` `    keepTypingBefore(event.target);` — a pressão grava a digitação antes de medir a caixa da seleção.
- **V-sem-digitacao.** `src/editor/input/pending.ts:46` `  if (typing === null) return;` — sem digitação pendente nada é gravado.

## Casos
### C1 final
- O escritor terminou: a digitação pendente foi gravada e o registo voltou a nulo (`src/editor/input/pending.ts:47` `  held = null;`).
- O leitor chega quando um gesto abre: `src/editor/store.ts:217` `      keepTyping();` — o gesto lê e grava a digitação pendente antes de servir.
- ok — a digitação é gravada uma vez e o registo fica vazio.
### C2 intermediário
- n/a — a gravação é uma chamada só (`src/editor/input/pending.ts:44` `export function keepTyping(): void {`).
### C3 em curso
- O leitor corre no começo do gesto, antes de a store despachar: `src/editor/store.ts:217` `      keepTyping();`.
- ok — o leitor lê o registo antes de o comando correr.
### C4 desmontagem
- n/a — a leitura é de uma função do store do editor (`src/editor/store.ts:216` `    gesture: () => {`).

## Resultado
- O leitor grava a digitação pendente antes de o gesto servir: `src/editor/store.ts:217` `      keepTyping();`.
