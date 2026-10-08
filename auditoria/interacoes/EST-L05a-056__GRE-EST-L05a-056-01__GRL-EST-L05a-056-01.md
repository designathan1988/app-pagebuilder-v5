# EST-L05a-056 × GRE-EST-L05a-056-01 → GRL-EST-L05a-056-01
- **Estado:** EST-L05a-056
- **Escritor:** GRE-EST-L05a-056-01 (persist): ENT-L10a-0011
- **Leitor:** GRL-EST-L05a-056-01 (startDrafts): ENT-L05a-0010
## Estados deixados por A
- **Final — o rascunho serializado em JSON, sob a chave `editing-draft`:** `src/editor/persistence/drafts.ts:67` `    else window.sessionStorage.setItem(KEY, JSON.stringify(next));`
- **Final — a chave removida, quando o rascunho se resolve:** `src/editor/persistence/drafts.ts:66` `    if (next === null) window.sessionStorage.removeItem(KEY);`
- **Intermediário — o rascunho de campo e o de canvas, os dois valores que a chave guarda, entre a escrita e a limpeza:** `src/editor/persistence/drafts.ts:63` `function persist(next: Draft | null): void {`
- **Desmontagem — a chave fica no armazenamento de sessão:** a limpeza de `startDrafts` não a remove (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `startDrafts` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:159` `    const parsed = schema.safeParse(JSON.parse(window.sessionStorage.getItem(KEY) ?? 'null'));`; em seguida valida o esquema, a revisão e a seleção em `src/editor/persistence/drafts.ts:160` `  if (parsed.success && canWrite() && parsed.data.revision === revision() && JSON.stringify(parsed.data.selection) === JSON.stringify(owner.getState().selection)) held = parsed.data;`.
- Fecho: ok — `src/editor/persistence/drafts.ts:159` `    const parsed = schema.safeParse(JSON.parse(window.sessionStorage.getItem(KEY) ?? 'null'));`
### C2 intermediário
- O leitor chega com o texto de uma gravação anterior, recusado por esquema, revisão ou seleção diferentes, na leitura de `src/editor/persistence/drafts.ts:159` `    const parsed = schema.safeParse(JSON.parse(window.sessionStorage.getItem(KEY) ?? 'null'));` e na aceitação guardada de `src/editor/persistence/drafts.ts:160` `  if (parsed.success && canWrite() && parsed.data.revision === revision() && JSON.stringify(parsed.data.selection) === JSON.stringify(owner.getState().selection)) held = parsed.data;`.
- Fecho: ok — `src/editor/persistence/drafts.ts:160` `  if (parsed.success && canWrite() && parsed.data.revision === revision() && JSON.stringify(parsed.data.selection) === JSON.stringify(owner.getState().selection)) held = parsed.data;`
### C3 em curso
- O leitor corre no arranque, síncrono; a escrita de `persist` corre na digitação e nenhuma das duas cruza a outra (`src/editor/persistence/drafts.ts:159` `    const parsed = schema.safeParse(JSON.parse(window.sessionStorage.getItem(KEY) ?? 'null'));`).
- Fecho: n/a — o leitor lê uma vez no arranque (`src/editor/persistence/drafts.ts:159` `    const parsed = schema.safeParse(JSON.parse(window.sessionStorage.getItem(KEY) ?? 'null'));`)
### C4 desmontagem
- Depois de a aba desmontar, a chave fica no armazenamento de sessão (`src/editor/persistence/drafts.ts:67` `    else window.sessionStorage.setItem(KEY, JSON.stringify(next));`); o leitor do arranque seguinte volta a lê-la em `src/editor/persistence/drafts.ts:159` `    const parsed = schema.safeParse(JSON.parse(window.sessionStorage.getItem(KEY) ?? 'null'));`.
- Fecho: ok — `src/editor/persistence/drafts.ts:159` `    const parsed = schema.safeParse(JSON.parse(window.sessionStorage.getItem(KEY) ?? 'null'));`
## Resultado
- O leitor aceita o rascunho espelhado só quando o esquema, a revisão e a seleção conferem, e põe-no em memória: `src/editor/persistence/drafts.ts:160` `  if (parsed.success && canWrite() && parsed.data.revision === revision() && JSON.stringify(parsed.data.selection) === JSON.stringify(owner.getState().selection)) held = parsed.data;`
