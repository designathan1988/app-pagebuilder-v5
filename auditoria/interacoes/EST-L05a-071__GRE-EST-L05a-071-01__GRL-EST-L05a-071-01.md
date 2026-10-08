# EST-L05a-071 × GRE-EST-L05a-071-01 → GRL-EST-L05a-071-01
- **Estado:** EST-L05a-071
- **Escritor:** GRE-EST-L05a-071-01 (writeWhenIdle): ENT-L05a-0093
- **Leitor:** GRL-EST-L05a-071-01 (writeWhenIdle): ENT-L05a-0093
## Estados deixados por A
- **V1 0, a criação.** `src/editor/persistence/autosave.ts:241` `  let idle = 0;` — na montagem de `startAutosave` o item é 0: nenhuma gravação ociosa pedida.
- **V2 o identificador pedido.** `src/editor/persistence/autosave.ts:287` `    idle = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(run, { timeout: IDLE_WAIT }) : window.setTimeout(run, 0);` — o pedido do momento ocioso (ou de um temporizador de zero) guarda o identificador no item.
- **V1 0 de novo, no momento ocioso.** `src/editor/persistence/autosave.ts:283` `      idle = 0;` — quando o momento chega, o caminho zera o item antes de escrever o diário e gravar; a gravação imediata também o zera (`src/editor/persistence/autosave.ts:293` `      idle = 0;`).
- **V2, o estado intermediário: o pedido por chegar.** `src/editor/persistence/autosave.ts:287` `    idle = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(run, { timeout: IDLE_WAIT }) : window.setTimeout(run, 0);` — entre o pedido e o momento ocioso o item guarda o identificador; é o estado em que o leitor que volta a pedir encontra o item não nulo.
- **Desmontagem: o item é cancelado.** `src/editor/persistence/autosave.ts:401` `    if (idle !== 0) {` — a limpeza de `startAutosave` cancela o momento pedido, mas não repõe `idle`; o item fica com o valor que tinha no fecho até o fim da página.
## Casos
### C1 final
- O escritor já terminou: depois do momento ocioso o item ficou 0 — `src/editor/persistence/autosave.ts:283` `      idle = 0;` — e o caminho escreveu o diário (`src/editor/persistence/autosave.ts:284` `      journalNow();`) e gravou o pendente (`src/editor/persistence/autosave.ts:285` `      if (!writing && pending !== null) void flush();`).
- O leitor é o mesmo `writeWhenIdle`, no pedido seguinte: lê `idle` em `src/editor/persistence/autosave.ts:281` `    if (idle !== 0) return;`.
- Com o item a 0, o leitor pede um momento novo: `src/editor/persistence/autosave.ts:287` `    idle = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(run, { timeout: IDLE_WAIT }) : window.setTimeout(run, 0);`; com um pedido já guardado, para.
- ok — o leitor lê o identificador que o escritor deixou e decide se pede um momento novo.
### C2 intermediário
- O estado intermediário é o pedido por chegar — `src/editor/persistence/autosave.ts:287` `    idle = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(run, { timeout: IDLE_WAIT }) : window.setTimeout(run, 0);` deixa o item com o identificador até o momento ocioso o zerar em `src/editor/persistence/autosave.ts:283` `      idle = 0;`.
- Um leitor que chegue nesse meio lê o item não nulo em `src/editor/persistence/autosave.ts:281` `    if (idle !== 0) return;` e para, sem pedir um segundo momento.
- ok — o leitor lê o identificador já pedido e evita um segundo pedido sobreposto.
### C3 em curso
- O leitor corre durante o momento ocioso: `run` zera o item em `src/editor/persistence/autosave.ts:283` `      idle = 0;` e chama `journalNow` e `flush`, que esperam (`src/editor/persistence/autosave.ts:310` `      failed = await writeRecord(work);`); nesse intervalo uma mudança nova pede outro momento por `src/editor/persistence/autosave.ts:394` `    writeWhenIdle();`.
- A linha do leitor lê o item nesse instante: `src/editor/persistence/autosave.ts:281` `    if (idle !== 0) return;` — o item já foi zerado no início da rodada, pelo que o leitor pede um momento novo.
- ok — a leitura em curso recebe o item como ele está; um pedido novo só se segue ao momento anterior terminar.
### C4 desmontagem
- A limpeza de `startAutosave` cancela o momento pedido: `src/editor/persistence/autosave.ts:401` `    if (idle !== 0) {` com `src/editor/persistence/autosave.ts:402` `      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle);` — depois disso o leitor não corre mais.
- O item fica com o valor que tinha; a limpeza não o repõe.
- ok — depois da desmontagem o leitor não chega, e o item fica como estava.
## Resultado
- O leitor decide se pede um momento ocioso novo, e não o pede quando já há um: `src/editor/persistence/autosave.ts:281` `    if (idle !== 0) return;`.
