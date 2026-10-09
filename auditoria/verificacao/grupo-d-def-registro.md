# Verificação — grupo D: defeitos de registro da auditoria (sem código da aplicação)

Verificador: subagente da verificação integral de 2026-10-09. Registros: DEF-0002, DEF-0003, DEF-0004, DEF-0005, DEF-0006, DEF-0007, DEF-0008, DEF-0286, DEF-0289, DEF-0501, DEF-0502, DEF-0503, DEF-0504, DEF-0505, DEF-0506, DEF-0507; e a conferência dos campos de todo `DEF-` de `auditoria/defeitos.md`.

## Método e limite
- A pasta `auditoria/` entrou no git de uma vez no commit `253b9a36` (2026-10-08, "Mecanismos de detecção e defeitos da fase 8 (etapas 1 a 3)", 11.478 arquivos). `git log -S '<DEF-id>' -- auditoria/defeitos.md` devolve esse commit para os 16 registros do grupo: todas as correções foram feitas antes de a auditoria ser versionada, e o git não guarda o estado anterior de nenhum fluxo, par ou matriz. O estado "antes" vem só dos pares arquivados em `.cache/audit/orfaos/` (187 arquivos, fora do git) e da lista `.cache/dbg/grupo1.json`.
- Não rodei `check.mjs` nem nenhum script de `tools/audit/`. As conferências foram feitas com Grep, Read e dois scripts Node no scratchpad, que só leem arquivos:
  - `cites.mjs`: para cada `` `caminho:LINHA` `trecho` `` das seções do grupo em `defeitos.md`, compara o trecho com a linha atual do arquivo.
  - `pares.mjs`: lê `auditoria/matriz.md` (os grupos e a lista de pares de cada item) e confere, para cada arquivo de `auditoria/interacoes/`, que o par existe na matriz e que o cabeçalho do arquivo (`**Escritor:** GRE-… (nome)` e `**Leitor:** GRL-… (nome)`) dá os mesmos ids e nomes que a matriz.
- Resultado global de `pares.mjs`: `{ pares: 8292, arquivos: 8293, semArquivo: 0, arquivoSemPar: 1 }` — o arquivo sem par é `interacoes/PROCEDIMENTO.md`; nenhum par da matriz sem arquivo. Os 7 "divergentes" que o script listou são de itens fora do grupo (EST-L09a-005, -006, -018, -019, -054, cujo nome de grupo tem parênteses que a expressão do script corta, e EST-L01-037 -24/-45, cujo cabeçalho tem outra forma); nenhum é de um item deste grupo.

## DEF-0002 — ids de medição repetidos entre áreas
- **Veredito:** parcial.
- **Provas:**
  - As duas citações do registro conferem: `auditoria/fluxos/ENT-L05b-0029.md:44` `- MED-0105 — a largura medida do submenu, a caixa do item e o tamanho da janela, de que cada reposicionamento do observador depende.` e `auditoria/fluxos/ENT-L07-0073.md:52` `- MED-0012 — a caixa do elemento na tela, de que a revelação (ENT-L07-0072) depende; valor a medir na Fase 6.`
  - Os 14 registros novos existem: `auditoria/medicoes/MED-0103.md` a `MED-0116.md`, cada um com o seu `.mjs`.
  - Cada registro antigo diz para onde foi a parte que saiu, com a marca "(DEF-0002)": `auditoria/medicoes/MED-0010.md:5` `A parte da captura, ENT-L06-0039, está em MED-0116 (DEF-0002).`, `auditoria/medicoes/MED-0010.md:6` `A parte do menu da barra (File), ENT-L05b-0027, está em MED-0103 (DEF-0002).`, e uma linha igual em MED-0011 a MED-0019 (para MED-0104 a MED-0112) e em MED-0036, MED-0037 e MED-0038 (para MED-0113, MED-0114 e MED-0115) — 14 remissões, uma por registro novo.
  - Nos 15 fluxos re-rastreados, o id antigo não aparece mais e o novo aparece (contagem por `grep -c`): ENT-L06-0039 (MED-0010: 0; MED-0116 nos passos 6 e 7), ENT-L05b-0027 (0; MED-0103 na linha 50), ENT-L05b-0028 (0; MED-0104), ENT-L05b-0029 (0; MED-0105), ENT-L05b-0031 (0; MED-0106), ENT-L05b-0035 (0; MED-0107), ENT-L05b-0042 (0; MED-0108), ENT-L05b-0043 (0; MED-0109), ENT-L05b-0044 (0; MED-0110), ENT-L05b-0049 (0; MED-0111), ENT-L05b-0050 (0; MED-0112), ENT-L08-0006 e ENT-L08-0008 (MED-0036: 0; MED-0113), ENT-L08-0013 (MED-0037: 0; MED-0114), ENT-L08-0021 (MED-0038: 0; MED-0115).
- **Achados:**
  - **O efeito descrito continua em 7 ids que a correção não cobriu.** Agrupando todo `MED-nnnn` citado em `auditoria/fluxos/` pela área do fluxo que o cita, sete ids são citados por fluxos de mais de uma área para valores diferentes: MED-0031 (L07, L08, L09a, L09b, L10a), MED-0032 (L08, L09a, L09b, L10a), MED-0033 (L08, L09a, L09b, L10a), MED-0034 (L08, L09a, L09b), MED-0035 (L08, L09a, L09b), MED-0041 (L09a, L09b) e MED-0042 (L09a, L09b). Os próprios registros o dizem: `auditoria/medicoes/MED-0031.md:1` `# MED-0031 — quatro grandezas distintas citadas sob este id` e `auditoria/medicoes/MED-0031.md:3` `O id `MED-0031` é citado por fluxos de quatro áreas para quatro valores diferentes. Como o registro é um por id, os` (o registro junta o `prefers-reduced-motion` de `start.ts:55`, a caixa do quadro de `frame.tsx:224`, o foco de `breakpoints-dialog.tsx:180` e a caixa do pai em `overlay.tsx:94`). MED-0041 é a largura das linhas da árvore de arquivos (ENT-L09b-0047) e é também citado por ENT-L09a-0085 a ENT-L09a-0088 para os valores de `computedValues` em `src/editor/shell/field.tsx:151` e `:249`; MED-0042 é a rolagem da árvore de Camadas (ENT-L09b-0058) e é também citado por ENT-L09a-0123 e ENT-L09a-0124 para `computedValues` em `src/editor/shell/field.tsx:1487` e `:1489`. Os dois registros anotam o caso como "Id compartilhado" (`auditoria/medicoes/MED-0041.md:10`, `auditoria/medicoes/MED-0042.md:11`) e não medem o valor da L09a. Efeito concreto: quem segue a medição citada por ENT-L09a-0085 (`MED-0041`) chega a um registro sobre a largura do nome na árvore de arquivos, não ao valor que o passo usa; é o "um mesmo `MED-nnnn` cobre valores de áreas diferentes" do próprio DEF-0002. Nenhuma decisão em `auditoria/decisoes.md` aceita o id compartilhado (busca por `MED-003`, `MED-004`, "id compartilhado" e "grandezas distintas" sem resultado).
  - Por isso o "Alcance" (`os fluxos que citam os ids repetidos`) e a afirmação de que "cada valor medido passa a ter o seu id" não conferem para esses 7 ids; a parte que a "Correção" enumera (os 14 registros) confere.
  - O Detector diz que a conferência é "o C5 do verificador com 0 pendências". Lido sem rodar, o C5 não confere id repetido entre áreas: a única regra dele sobre medições é `tools/audit/check.mjs:353` `        if (!/MED-\d+/.test(meds)) pend.push({ where: f, why: 'passo usa API calculada pelo navegador sem MED-' });` — exige que exista algum `MED-` na seção de medições de um fluxo cujo passo usa uma API do navegador, e não olha a que área o id pertence. Um C5 com 0 pendências é compatível com os 7 ids acima; ele não é detector deste defeito. A "Verificação" (`check.mjs --so C2,C5,C7` — 0 pendências) não foi reproduzida, por proibição.



## Prova comum aos nove registros de EST-L01-030 (DEF-0003, DEF-0004, DEF-0501 a DEF-0507)
Os nove registros descrevem a mesma correção em grupos de leitores diferentes de EST-L01-030: a marca `[lê: EST-L01-030 via F]` tirada dos fluxos, o grupo de leitores apagado da matriz, os 20 pares dele arquivados em `.cache/audit/orfaos/` e os pares seguintes renumerados. Conferido assim:
- **A marca saiu.** `grep -rF "EST-L01-030 via F]"` em `fluxos/`, `interacoes/`, `estado/`, `estado.md` e `matriz.md`, para F = `UNDOABLE`, `isIds`, `predicate.test`, `probeOf`, `readAddress`, `readBehaviour`, `readCopied`, `readInteraction`, `readTimeline`: 0 ocorrências em todos.
- **A linha citada continua no passo, sem marca.** Nos 30 arquivos de `.cache/dbg/grupo1.json` (que conta `UNDOABLE: 15, isIds: 1, predicate.test: 5, probeOf: 1, readAddress: 2, readBehaviour: 1, readCopied: 1, readInteraction: 2, readTimeline: 2`, soma 30), a linha está lá e nenhuma marca `[lê:` ou `[escreve:` a acompanha. Exemplo: `auditoria/fluxos/ENT-P-selection-0002.md:13`, o passo 8 que cita `src/editor/store.ts:234` e diz "lê do manifesto se o comando muda o documento; os comandos de seleção não são desfazíveis, então `changesDocument` é falso", sem marca. Duas exceções de forma: em `TRC-motion.setEffectOption.md` a linha que fica é a 22 do trecho (`src/core/elements/address.ts:44`, a declaração de `readAddress`), e em `TRC-motion.update.md` é a 25 (`src/core/motion/commands.ts:240` `  const read = readInteraction(next);`), e não as linhas `background-image.ts:60` e `commands.ts:151` que as Causas de DEF-0503 e DEF-0506 dizem que os dois trechos marcavam; as duas sem marca.
- **As leituras reais do documento ficaram.** Os trechos ainda marcam a leitura de EST-L01-030 onde o documento é lido: `TRC-motion.setBehaviour` (via `behavioursOf`, `primaryNode`, `lockedRefusal`), `TRC-motion.update` (via `motionsOf`, `primaryNode`), `TRC-motion.addAction` (via `timelineNamed`, `findTimeline`), `TRC-motion.pasteKeyframes` (via `actionOf`, `timelineNamed`).
- **Os nove grupos saíram da matriz e os pares foram arquivados.** `.cache/audit/orfaos/` tem 20 pares (GRE-EST-L01-030-01 a -20) de cada um dos grupos GRL-EST-L01-030-02, -97, -157, -160, -164, -165, -166, -167 e -168 (180 arquivos), e o cabeçalho de cada um nomeia o leitor do registro: `-02 (UNDOABLE)`, `-97 (isIds)`, `-157 (predicate.test)`, `-160 (probeOf)`, `-164 (readAddress)`, `-165 (readBehaviour)`, `-166 (readCopied)`, `-167 (readInteraction)`, `-168 (readTimeline)`, com as entradas cobertas iguais às da lista de cada registro. Na `auditoria/matriz.md` de hoje, nenhum grupo de leitores de EST-L01-030 tem esses nomes.
- **A renumeração fecha.** A seção EST-L01-030 da matriz tem 20 grupos de escritores e 244 de leitores, ids GRL-EST-L01-030-01 a -244 sem buraco, e 4.880 pares (20 × 244); `auditoria/interacoes/` tem 4.880 arquivos `EST-L01-030__*`. Recalculei a matriz a partir das marcas dos fluxos com a regra de `marksOf` e `computeMatrix` (`tools/audit/lib.mjs:255` e `:262`, lida e reimplementada no scratchpad, sem rodar o script do projeto: um grupo por função, numerados na ordem de `sort()`, como `tools/audit/check.mjs:404`): para EST-L01-030 a matriz calculada e a declarada coincidem em ids, nomes e entradas cobertas — `{ divergencias: 0, parFaltaNaMatriz: 0, parSobraNaMatriz: 0, parSemArquivo: 0, casosAusentes: 0 }`. O cabeçalho de cada um dos 4.880 arquivos dá o mesmo id e a mesma função que a matriz (por exemplo `GRL-EST-L01-030-02 (actionIds)`, `-97 (isRefusal)`, `-157 (publish)`, `-160 (readValue)`, `-168 (regionOf)`), e todos têm os casos `C1 final`, `C2 intermediário`, `C3 em curso` e `C4 desmontagem` que o C6 exige (`tools/audit/check.mjs:395`).
- **Não verificável:** "com o conteúdo inalterado" dos pares renomeados — o estado anterior não está no git (a auditoria entrou toda em `253b9a36`). As "Verificações" (`check.mjs --so C6`, `renumerar.mjs --seco`) não foram reproduzidas, por proibição. A contagem "8.292 pares" confere com a matriz de hoje (8.292 pares, 0 sem arquivo).

## DEF-0003 — leitura de EST-L01-030 marcada numa linha que lê o manifesto
- **Veredito:** confirmado.
- **Provas:** prova comum acima. A linha lê o mapa do manifesto: `src/editor/store.ts:234` `      const changesDocument = UNDOABLE.get(id) === true;` e `src/editor/store.ts:185` `const UNDOABLE = new Map(manifest.commands.map((c) => [c.id as CommandId, c.history.undoable] as const));`. A marca saiu das 15 ocorrências (os 15 fluxos ENT-P-selection da lista; em 6 deles a linha aparece duas vezes, nos passos e nos ramos), e a linha ficou sem marca nos 15. `auditoria/estado/L01.md` não cita `UNDOABLE` (0 ocorrências) e `auditoria/estado.md:3110` continua a dar a linha como ocorrência excluída ("mapa constante derivado do manifesto na carga do módulo").
- **Achados:** nenhum. A citação `auditoria/fluxos/ENT-P-selection-0002.md:13` da Causa é um pedaço da linha 13, não a linha inteira; o pedaço está na linha 13 de hoje.

## DEF-0004 — leitura de EST-L01-030 marcada numa linha que lê um argumento do comando
- **Veredito:** confirmado.
- **Provas:** prova comum acima. `src/editor/motion/state.ts:139` `  const pickedActions = isIds(actions) ? actions : placedAction;` e `src/editor/motion/state.ts:124` `const isIds = (value: unknown): value is string[] => Array.isArray(value) && value.every((one) => typeof one === 'string');` — `isIds` só testa a forma do argumento. `auditoria/fluxos/trechos/TRC-motion.select.md` cita a linha (linhas 17 e 29 do trecho) sem marca; GRL-EST-L01-030-97 é hoje `isRefusal`; os 20 pares de `isIds` estão em `.cache/audit/orfaos/`.
- **Achados:** nenhum.

## DEF-0501 — leitura de EST-L01-030 marcada num predicado que não lê o documento
- **Veredito:** confirmado.
- **Provas:** prova comum acima. Os cinco comandos usam o predicado `always`: em `manifest/commands/structure.json` (a partir da linha 1931), `hand.aimNext`, `hand.aimPrevious`, `hand.climb`, `hand.descend` e `hand.drop` têm `"availability": {"predicate":"always","refusalKey":null}` (lido com um script Node), e `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — a função não recebe nem lê o `state`. A tabela de predicados da aplicação usa esse `always` (`src/app/commands.ts:7` importa `always` de `registry.ts`; `src/app/commands.ts:516` o põe na tabela). A linha `src/core/store/store.ts:416` `    if (predicate && !predicate.test(state, layeredNow(at), args)) {` fica na linha 8 dos cinco trechos `TRC-hand.*`, sem marca.
- **Achados:** nenhum.

## DEF-0502 — leitura de EST-L01-030 marcada numa linha que lê a tabela do manifesto
- **Veredito:** confirmado.
- **Provas:** prova comum acima. `src/core/design/site-colours.ts:152` `  const probe = probeOf(context, COLOUR_KIND);`; o corpo de `probeOf` (`src/core/design/tokens.ts:166` a `:170`) lê só `context.rules.propertyFacts`: `src/core/design/tokens.ts:168` `  if (rules.propertyFacts.has(kind)) return kind;`. A linha fica em `TRC-design.replaceColour.md:17`, sem marca.
- **Achados:** nenhum.

## DEF-0503 — leitura de EST-L01-030 marcada numa linha que lê um argumento de endereço
- **Veredito:** confirmado.
- **Provas:** prova comum acima. `src/core/style/background-image.ts:60` `      const read = readAddress(address);`, com `address` vindo do argumento (`src/core/style/background-image.ts:57` `    const address = imageAddress(value);`, depois da recusa de um `value` que não é texto); o corpo de `readAddress` (`src/core/elements/address.ts:44` em diante) só trata a cadeia: `src/core/elements/address.ts:45` `  const value = typed.trim();`. A linha fica em `TRC-style.setBackgroundImage.md:21`, sem marca.
- **Achados:** a Causa diz que `TRC-motion.setEffectOption.md` também marcava a linha `background-image.ts:60`; esse trecho de hoje cita `src/core/elements/address.ts:44` (linha 22 do trecho), e o comando chama `readAddress` noutro ponto (`src/core/motion/commands.ts:459` `    const address = readAddress(effect.address);`). Qual linha o trecho marcava antes não é verificável (o par arquivado `.cache/audit/orfaos/EST-L01-030__GRE-EST-L01-030-01__GRL-EST-L01-030-164.md:14` só descreve `background-image.ts:60`). Sem efeito na matriz: nenhuma das duas linhas tem marca hoje.

## DEF-0504 — leitura de EST-L01-030 marcada numa linha que lê um registo montado dos argumentos
- **Veredito:** parcial — a correção (marca, grupo, pares, renumeração) confere; a descrição da origem do valor lido, não.
- **Provas:** prova comum acima. `src/core/motion/commands.ts:788` `  const read = readBehaviour(wanted);`; `readBehaviour` (`src/core/motion/read.ts:474`) só lê o valor recebido: `src/core/motion/read.ts:476` `  const held = reader.record(value, '', ['kind', 'amount', 'axis', 'reverse']);`. A linha fica em `TRC-motion.setBehaviour.md:23`, sem marca, como a regra das marcas pede (`auditoria/decisoes.md:67`: a marca nomeia a função que, na linha citada, lê a parte do estado).
- **Achados:** a Causa diz que `wanted` é "montado a partir dos argumentos do comando", e a Correção, que "a linha lê o manifesto ou os argumentos do comando". O registo é montado também do documento: `src/core/motion/commands.ts:786` `  const base = behavioursOf(found.node).find((one) => one.kind === kind) ?? BEHAVIOUR_DEFAULTS[kind];` e `src/core/motion/commands.ts:787` `  const wanted: Behaviour = { ...base, ...(amount === undefined ? {} : { amount }), ...(axis === undefined ? {} : { axis }) };` — `found.node` é o nó do documento. A conclusão (a linha não lê EST-L01-030) continua certa pela DCS-008, porque `readBehaviour` lê uma cópia local, e a leitura real do documento está marcada no trecho (`[lê: EST-L01-030 via behavioursOf]`). Efeito: só no texto do registro, nenhum na matriz.

## DEF-0505 — leitura de EST-L01-030 marcada numa linha que lê o argumento da área de transferência
- **Veredito:** confirmado.
- **Provas:** prova comum acima. `src/core/motion/commands.ts:667` `  const copied = readCopied(keyframes);`, com `keyframes` vindo dos argumentos do tratador (`src/core/motion/commands.ts:661` `export const pasteKeyframesCommand = registerHandler('motion.pasteKeyframes', (context, { timeline, action, at, keyframes }): Outcome<never> => {`); `readCopied` (`src/core/motion/commands.ts:651` a `:659`) só confere a forma da lista: `src/core/motion/commands.ts:652` `  if (!Array.isArray(value)) return null;`. A linha fica em `TRC-motion.pasteKeyframes.md:15`, sem marca.
- **Achados:** nenhum.

## DEF-0506 — leitura de EST-L01-030 marcada numa linha que lê um registo montado dos argumentos
- **Veredito:** parcial — a correção confere; a descrição de onde a leitura estava e de onde o valor vem, não.
- **Provas:** prova comum acima. `src/core/motion/commands.ts:151` `  const read = readInteraction(interaction);`; `readInteraction` (`src/core/motion/read.ts:438`) só lê o valor recebido: `src/core/motion/read.ts:440` `  const held = reader.record(value, '', ['id', 'trigger', 'timeline', 'control', 'leave', 'scope', 'once', 'delay', 'breakpoints', 'reducedMotion', 'scrollStart', 'scrollEnd']);`. A linha fica em `TRC-motion.add.md:26`; em `TRC-motion.update.md:25` fica a chamada do outro tratador; as duas sem marca.
- **Achados:** a Causa diz que os dois trechos marcavam `commands.ts:151` e que o registo é "montado a partir dos argumentos do comando". No `motion.update` a chamada é outra linha e o valor vem do documento: `src/core/motion/commands.ts:234` `  const held = motionsOf(found.node)[interaction];`, `src/core/motion/commands.ts:238` `  const next = updatedInteraction(context, found.node, held, field, value);` e `src/core/motion/commands.ts:240` `  const read = readInteraction(next);`. No `motion.add`, o nome da timeline do registo pode vir do documento (`src/core/motion/commands.ts:139` `    name = timelineNameFor(context.state.document, found.node, kind);`). A conclusão (a linha não lê EST-L01-030, pela DCS-008) continua certa, e os trechos marcam a leitura real (`via motionsOf`, `via primaryNode`). Efeito: só no texto do registro.

## DEF-0507 — leitura de EST-L01-030 marcada numa linha que lê a timeline montada pela chamada
- **Veredito:** parcial — a correção confere; a frase da Correção sobre o que a linha lê, não.
- **Provas:** prova comum acima. `src/core/motion/commands.ts:101` `function commitTimeline(index: number, next: MotionTimeline, said: Message, value: unknown = null): Outcome<never> {` e a chamada da linha seguinte, `src/core/motion/commands.ts:102` `  const read = readTimeline(next);`; `readTimeline` (`src/core/motion/read.ts:391`) só lê o valor recebido: `src/core/motion/read.ts:393` `  const held = reader.record(value, '', ['id', 'name', 'actions', 'markers']);`. A linha fica em `TRC-motion.addAction.md:21` e `TRC-motion.removeActions.md:20`, sem marca.
- **Achados:** a Correção repete o texto dos outros oito, "a linha lê o manifesto ou os argumentos do comando"; a linha lê `next`, uma timeline que o tratador deriva do documento (no `motion.addAction`, `src/core/motion/commands.ts:312` `  return commitTimeline(found.index, addAction(found.timeline, action), message('status.motion.actionAdded', { name: { key: effectLabel(kind) }, timeline: found.timeline.name }));`, com `found.timeline` lido do documento por `timelineNamed`). A Causa ("lê a timeline `next` que a chamada lhe passa") está certa; a frase da Correção, não. A linha citada como marcada é a declaração da função (`:101`), não a da chamada (`:102`). Sem efeito na matriz.

## DEF-0005 — escrita de EST-L05a-044 marcada numa linha que só percorre os ouvintes
- **Veredito:** confirmado.
- **Provas:**
  - O código: `src/editor/persistence/tab-guard.ts:15` `    listeners.add(listener);` (dentro de `tabRole.subscribe`) escreve o conjunto; `src/editor/persistence/tab-guard.ts:22` `  for (const listener of [...listeners]) listener();` (dentro de `setRole`) só o percorre.
  - ENT-L05a-0105 marca a leitura: na linha 10 do fluxo, o passo 5 cita `tab-guard.ts:22` com "(DEF-0005). [lê: EST-L05a-044 via setRole]"; a seção de estado (linha 20) diz `- lê: EST-L05a-043 (via setRole), EST-L05a-044 (via setRole)`.
  - ENT-L09b-0075 marca a escrita: a linha 9 do fluxo cita `tab-guard.ts:15` com `[escreve: EST-L05a-044 via subscribe]`, e a seção de estado (linha 22) cita o DEF-0005.
  - A matriz: `GRE-EST-L05a-044-01: subscribe — cobre ENT-L09b-0075` e `GRL-EST-L05a-044-01: setRole — cobre ENT-L05a-0006, ENT-L05a-0105`; o par tem `Escritor: GRE-EST-L05a-044-01 (subscribe)` e os quatro casos; o par antigo está em `.cache/audit/orfaos/` com `Escritor: GRE-EST-L05a-044-01 (setRole): ENT-L05a-0105`. Matriz recalculada das marcas igual à declarada.
  - `auditoria/estado/L05a.md` lista a escrita certa (`tab-guard.ts:15` via `tabRole.subscribe`) e a leitura certa (`tab-guard.ts:22` via `setRole`).
- **Achados:** nenhum. A citação `auditoria/fluxos/ENT-L05a-0105.md:5` da Causa é da versão do fluxo anterior à correção; hoje a linha é a 10.

## DEF-0006 — escrita de EST-L06-014 marcada numa linha que despacha o comando
- **Veredito:** confirmado.
- **Provas:**
  - O código: a ref é `src/editor/data/controls.tsx:53` `  const field = useRef<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>(null);`, lida no efeito (`src/editor/data/controls.tsx:58` `    if (field.current !== null && (menu || document.activeElement !== field.current)) field.current.value = value;`) e no envio (`src/editor/data/controls.tsx:94` `        if (field.current !== null) keep(field.current.value);`); `DoorForm` (a partir de `src/editor/data/controls.tsx:104`) não tem a ref.
  - Nos fluxos ENT-L06-0058, -0059, -0060 e -0062 não há marca de EST-L06-014; em ENT-L06-0061 só `[lê: EST-L06-014 via field.current]`; a linha `controls.tsx:27` continua nos cinco, sem marca. ENT-L06-0057 tem `[lê: EST-L06-014 via field.current]`.
  - A matriz: `- **Escritores:** nenhum`, `GRL-EST-L06-014-01: field.current — cobre ENT-L06-0057, ENT-L06-0061`, `- **Pares:**` vazio; os dois pares do grupo `dispatch` estão em `.cache/audit/orfaos/`. Matriz recalculada igual à declarada.
  - `auditoria/estado/L06.md` lista como escritores as três ligações `ref={field}` (linhas 75, 83 e 85) e como leitores as linhas 58 e 94.
- **Achados:** o Detector cita "a matriz recalculada (8.290 pares)"; a matriz de hoje tem 8.292 pares (contagem envelhecida por correções posteriores, como a do DEF-0007, que trocou um par por dois).

## DEF-0007 — leitura de EST-L07-006 marcada numa linha que lê a ref do próprio quadro
- **Veredito:** confirmado.
- **Provas:**
  - O código: `src/editor/canvas/frame.tsx:65` `    const frame = iframe.current;` e `src/editor/canvas/frame.tsx:42` `  const iframe = useRef<HTMLIFrameElement>(null);`; `canvasFrame` aparece 0 vezes em `src/editor/canvas/frame.tsx`; EST-L07-006 é `src/editor/canvas/coordinates.ts:639` `let current: HTMLIFrameElement | null = null;`.
  - As marcas: ENT-L07-0036 (2), ENT-L07-0049 (1) e ENT-L07-0053 (1) têm `[lê: EST-L07-017 via frame]`; nenhum fluxo tem `EST-L07-006 via frame]`.
  - A matriz: EST-L07-006 tem os leitores `canvasDocument`, `canvasFrame`, `nodeBox` e `pageAnimating` (-01 a -04, renumerados; `frame` não está); EST-L07-017 tem `GRL-EST-L07-017-01: frame — cobre ENT-L07-0036, ENT-L07-0049, ENT-L07-0053` e os pares `EST-L07-017__GRE-EST-L07-017-01__GRL-EST-L07-017-01` (CanvasFrame) e `EST-L07-017__GRE-EST-L07-017-02__GRL-EST-L07-017-01` (useLayoutEffect), com arquivo e os quatro casos. O par antigo está em `.cache/audit/orfaos/EST-L07-006__GRE-EST-L07-006-01__GRL-EST-L07-006-03.md` (`Leitor: GRL-EST-L07-006-03 (frame)`). Matriz recalculada igual à declarada nos dois itens.
  - EST-L07-017 em `auditoria/estado/L07.md` é o estado local do `CanvasFrame`, com a ref `iframe` entre as refs da forma.
- **Achados:** nenhum.

## DEF-0008 — EST-L09a-158 une um escritor e um leitor de valores distintos
- **Veredito:** confirmado.
- **Provas:**
  - O código: `src/editor/shell/inspector.tsx:370` `  const [query, setQuery] = useState('');` (em `AddProperty`), escrito em `src/editor/shell/inspector.tsx:432` `            onChange={(event) => setQuery(event.currentTarget.value)}` e lido em `src/editor/shell/inspector.tsx:409` `            return words.includes(query.trim().toLowerCase());`; `src/editor/shell/inspector.tsx:315` `  const query = useEditorState((s) => inspectorSearchOf(s.ui));` lê a busca da store.
  - ENT-L09a-0181 marca a linha 315 como `[lê: EST-L01-037 via useEditorState]` (linha 12 do fluxo); o grupo `GRL-EST-L01-037-72: useEditorState` cobre ENT-L09a-0181. ENT-L09a-0185 tem `[escreve: EST-L09a-158 via AddProperty]` e `[lê: EST-L09a-158 via AddProperty]` (a leitura no ramo R1, que cita `value={query}` da linha 431 e o filtro da linha 409); só esse fluxo marca EST-L09a-158.
  - A matriz: `GRE-EST-L09a-158-01: AddProperty` e `GRL-EST-L09a-158-01: AddProperty`, o par com arquivo e os quatro casos; o par antigo em `.cache/audit/orfaos/` tem `Leitor: GRL-EST-L09a-158-01 (PropertySearch): ENT-L09a-0181`. Matriz recalculada igual à declarada (EST-L09a-158 e EST-L01-037: 0 divergências; os 2.175 pares de EST-L01-037 com arquivo).
- **Achados:** a seção de estado de ENT-L09a-0185 diz `- escreve: EST-L09a-158 (via setQuery)` (`auditoria/fluxos/ENT-L09a-0185.md:16`), e a marca do passo diz `via AddProperty`; a matriz segue a marca. Divergência de texto dentro do fluxo, sem efeito na matriz.

## DEF-0286 — EST-L09b-058 une um escritor e um leitor de elementos distintos
- **Veredito:** confirmado.
- **Provas:**
  - O código: `src/editor/shell/variables.tsx:74` `      name?.scrollIntoView({ block: 'nearest' });` rola o painel das variáveis; `src/editor/shell/sidebar/layers.tsx:472` `    const measure = () => setWindow({ top: el.scrollTop, height: el.clientHeight });` mede o rolador de Camadas.
  - O passo 7 de ENT-L09b-0083 (linha 13 do fluxo) cita a linha 74 sem marca e explica: rola o painel das variáveis, "que nenhum item do inventário guarda; a rolagem de EST-L09b-058 é a da árvore de Camadas, que esta linha não move (DEF-0286)". A seção de estado tem só EST-L09b-057; o resultado fala do rolador do painel.
  - A matriz: só `GRE-EST-L09b-058-01: el.scrollTop — cobre ENT-L09b-0064, ENT-L09b-0065` e `GRL-EST-L09b-058-01`, um par; o par do grupo `scrollIntoView` está em `.cache/audit/orfaos/EST-L09b-058__GRE-EST-L09b-058-02__GRL-EST-L09b-058-01.md`. Matriz recalculada igual à declarada.
- **Achados:** a seção de fronteiras do mesmo fluxo ainda lista o item: `auditoria/fluxos/ENT-L09b-0083.md:23` termina com "no intervalo podem rodar as entradas que escrevem o documento; estado: EST-L09b-057, EST-L09b-058." Pela própria correção, o quadro não toca EST-L09b-058. Resto de texto numa seção que o registro não diz ter re-rastreado (ele cita passo 7, estado e resultado); não é marca e não entra na matriz.

## DEF-0289 — leitura de EST-L10a-012 marcada numa linha que lê o tamanho-base da tela
- **Veredito:** confirmado.
- **Provas:**
  - O código: `src/modules/layout-composer/ui/overlay.tsx:70` `  const base = useEditorState((s) => activeBreakpoint(s).base);`, `src/modules/layout-composer/ui/overlay.tsx:71` `  const [measured, setMeasured] = useState<Readonly<Record<string, Measured>> | null>(null);` e, em `placedAt`, `src/modules/layout-composer/ui/overlay.tsx:128` `    if (measured === null) return at(b);`.
  - ENT-L10a-0003: o passo 8 (linha 13 do fluxo) cita a linha 100 sem marca de EST-L10a-012 e diz que `base` é o tamanho-base lido do estado do editor; a leitura real está no resultado (linha 35 do fluxo, com a citação de `overlay.tsx:128` e `[lê: EST-L10a-012 via placedAt]`); a seção de estado diz `EST-L10a-012 (via placedAt)`.
  - A matriz: `GRE-EST-L10a-012-01: o efeito de medição` e `GRL-EST-L10a-012-01: placedAt`; o par com arquivo e os quatro casos, `Leitor: GRL-EST-L10a-012-01 (placedAt)`; o par antigo em `.cache/audit/orfaos/` tem `Leitor: GRL-EST-L10a-012-01 (base)`. Matriz recalculada igual à declarada. O DEF-0512, que o registro diz ter sido achado nesse rastreamento, existe em `auditoria/defeitos.md`.
- **Achados:** nenhum.

## Campos de todo `DEF-` de `auditoria/defeitos.md`
**Os campos exigidos.** `auditoria/defeitos.md` não traz cabeçalho com o modelo; o modelo é o de `auditoria/plano-execucao.md` (seção D.9, linhas 735 a 744: Status, Citação, Causa, Efeito, Alcance, Itens de estado tocados, Correção "obrigatório se corrigido", Re-rastreados "obrigatório se corrigido", Verificação), com a conferência C8 (`auditoria/plano-execucao.md:898` a `:907`; no código, `tools/audit/check.mjs:428` exige Citação, Causa, Efeito e Alcance não vazios, `:431` a citação em Correção e `:432` o campo Re-rastreados para todo corrigido). O `CLAUDE.md` (seção 2, passo 3) exige que todo defeito corrigido ganhe um mutante no catálogo: daí o campo Detector, com o mutante quando o defeito é de código.

**Contagem.** 33 blocos `## DEF-`, 33 ids distintos, todos com `Status: corrigido`; todo `DEF-` citado em `auditoria/` (fluxos, pares, medições, registros) é um desses 33. Todos têm Status, Citação, Causa, Efeito, Alcance, Correção com citação `caminho:linha`, Detector e Verificação.

**Os que não têm algum campo:**
| DEF | Falta | Observação |
|---|---|---|
| DEF-0514 | Itens de estado tocados | defeito de código; mutantes M52 a M54 |
| DEF-0515 | Itens de estado tocados | defeito de código; mutantes M55, M56 |
| DEF-0516 | Itens de estado tocados; Re-rastreados | defeito de código; mutantes M57, M58. A Verificação diz "M57, M58 e M59 acusados", e o Detector não diz o que é o M59 |
| DEF-0517 | Itens de estado tocados; Re-rastreados | defeito de código; mutante M65 |
| DEF-0518 | Itens de estado tocados; Re-rastreados | código de `src/manifest/check/`; mutante M67 |
| DEF-0519 | Itens de estado tocados; Re-rastreados; mutante próprio | mensagem de `src/i18n/locales/en.json`; o Detector diz "Não há mutante para esta correção" e cita o M68, que é o mutante do detector (MEC-20), não o desta correção |
| DEF-0520 | Itens de estado tocados; Re-rastreados; mutante | mensagem de `src/i18n/locales/en.json`; o Detector não cita mutante |
| DEF-0521 | Itens de estado tocados; Re-rastreados; mutante | correção só em `tests/e2e/` (sem código da aplicação); o detector é o próprio lote Playwright |
| DEF-0522 | Itens de estado tocados; Re-rastreados; mutante | defeito de código (`src/editor/canvas/quick-panel.tsx`); o Detector diz "Não há mutante no catálogo" e dá o motivo (só o navegador mede), o que o `CLAUDE.md` não excetua |
| DEF-0523 | Itens de estado tocados; Re-rastreados; mutante | correção só em `tests/e2e/`; o detector é o próprio caso |

Os 16 defeitos de registro deste grupo (DEF-0002 a DEF-0008, DEF-0286, DEF-0289, DEF-0501 a DEF-0507) não têm mutante e o dizem no Detector ("defeito de registro, sem código da aplicação: a regra de mutante não se aplica"); não entram na lista. DEF-0001 e DEF-0508 a DEF-0513 têm todos os campos e mutante.

## Resumo
| ID | Veredito | Achado principal |
|---|---|---|
| DEF-0002 | parcial | Os 14 registros MED-0103 a MED-0116 foram separados e os 15 fluxos citam o id novo; mas 7 ids (MED-0031 a MED-0035, MED-0041, MED-0042) continuam citados por fluxos de áreas diferentes para valores diferentes, e o C5 citado como detector não confere a área do id (`tools/audit/check.mjs:353`). |
| DEF-0003 | confirmado | Marca `via UNDOABLE` fora dos 15 fluxos, grupo fora da matriz, 20 pares arquivados, renumeração de EST-L01-030 consistente (244 leitores, 4.880 pares com arquivo). |
| DEF-0004 | confirmado | Marca `via isIds` fora, linha sem marca em TRC-motion.select, 20 pares arquivados. |
| DEF-0005 | confirmado | Escrita marcada em `listeners.add` (ENT-L09b-0075), leitura em `setRole` (ENT-L05a-0105), par refeito com o escritor `subscribe`. |
| DEF-0006 | confirmado | Marcas de `dispatch` e das linhas `onChange`/`onBlur` fora; EST-L06-014 sem escritor e sem par; contagem "8.290 pares" envelhecida (hoje 8.292). |
| DEF-0007 | confirmado | Marcas trocadas para EST-L07-017 via frame; dois pares novos com arquivo; par antigo arquivado. |
| DEF-0008 | confirmado | Linha 315 marcada como EST-L01-037; leitor real `AddProperty`; a seção de estado de ENT-L09a-0185 diz "via setQuery" contra a marca "via AddProperty". |
| DEF-0286 | confirmado | Marca do `scrollIntoView` fora e par arquivado; a seção de fronteiras de ENT-L09b-0083 (linha 23) ainda lista EST-L09b-058. |
| DEF-0289 | confirmado | Linha 100 sem marca; leitura real `placedAt` (linha 128) marcada; par refeito. |
| DEF-0501 | confirmado | Os cinco comandos `hand.*` usam `always` (`() => true`); marca fora dos cinco trechos. |
| DEF-0502 | confirmado | `probeOf` lê só `rules.propertyFacts`; marca fora. |
| DEF-0503 | confirmado | `readAddress` lê só a cadeia; marca fora; em TRC-motion.setEffectOption a linha que fica é `address.ts:44`, não `background-image.ts:60` como a Causa diz. |
| DEF-0504 | parcial | Correção confere; `wanted` não é montado só dos argumentos: vem também de `behavioursOf(found.node)` (`commands.ts:786`). |
| DEF-0505 | confirmado | `readCopied` lê só o argumento `keyframes`; marca fora. |
| DEF-0506 | parcial | Correção confere; no `motion.update` a chamada é `commands.ts:240` com `next` derivado do documento (`motionsOf(found.node)`), não `commands.ts:151` com argumentos. |
| DEF-0507 | parcial | Correção confere; a frase "lê o manifesto ou os argumentos" não vale: `next` é derivado do documento pelo tratador. |
| Campos de `defeitos.md` | — | 33 DEF, todos corrigidos; sem "Itens de estado tocados": DEF-0514 a DEF-0523; sem "Re-rastreados": DEF-0516 a DEF-0523; sem mutante próprio: DEF-0519, DEF-0520, DEF-0521, DEF-0522, DEF-0523. |
