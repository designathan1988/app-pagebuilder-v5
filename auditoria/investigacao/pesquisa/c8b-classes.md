# C8 (parte B): classes de defeito de editores visuais web e detecção automática

Data da pesquisa e do acesso a todas as fontes: 2026-10-08.
Alvo: page builder com canvas em iframe, importação de HTML, exportação de HTML/CSS, rascunhos no navegador e autosave. Pilha: React 19.3.0, react-dom 19.3.0, TypeScript 6.0.3, Vite 8.3.0, Vitest 5.0.1, @playwright/test 1.63.0, zod 4.6.5.

Convenção do documento: o rótulo "Fato documentado" traz o que a fonte sustenta. O rótulo "Avaliação" traz a conclusão do pesquisador, que não vem da fonte. Onde uma página não trazia a informação pedida (por exemplo, tabela de compatibilidade que a captura não incluiu), o texto diz que a informação não foi verificada.

---

## 1. Segurança do HTML importado

### Fontes
| URL | Versão ou data do conteúdo | O que sustenta |
|---|---|---|
| https://github.com/cure53/DOMPurify | README cita DOMPurify v3.4.16 | Opções ALLOWED_TAGS, FORBID_ATTR, USE_PROFILES, RETURN_TRUSTED_TYPE, SAFE_FOR_XML, ganchos addHook, integração com Trusted Types, comportamento sobre SVG/MathML, esquemas de URI permitidos |
| https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API | página MDN, estado "Limited availability" em 2026-10-08 | Métodos setHTML, setHTMLUnsafe, parseHTML, parseHTMLUnsafe; configuração padrão; estado de suporte |
| https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML | página MDN, 2026-10-08 | setHTML sempre remove script, frame, iframe, embed, object, use e atributos de evento; aviso de XSS por mutação ao reserializar |
| https://developer.mozilla.org/en-US/docs/Web/API/Sanitizer | página MDN, 2026-10-08 | Métodos allowElement, removeElement, removeUnsafe, get; estado "Limited availability" |
| https://blog.openreplay.com/html-sanitizer-api-overview/ | publicado em 2026-03-19 | Firefox 148 e Chrome 146 como versões que entregam a API; recomendação de detecção de recurso com DOMPurify como reserva |
| https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API | página MDN, Baseline 2026 "Newly available" desde fevereiro de 2026 | Diretivas require-trusted-types-for e trusted-types, lista de sinks (innerHTML, srcdoc, setHTMLUnsafe, eval, script src), políticas, política default, tinyfill |
| https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP | página MDN, 2026-10-08 | Nonce por resposta, modo somente relatório, report-to com Reporting-Endpoints, Trusted Types na CSP |

### Fato documentado
- DOMPurify é um sanitizador apenas de DOM para HTML, MathML e SVG. Por padrão permite HTML, SVG e MathML; USE_PROFILES restringe os espaços de nomes e sobrescreve ALLOWED_TAGS, então os dois não se combinam.
- Nos exemplos do README, `<img src=x onerror=alert(1)//>` vira `<img src="x">` e `<svg><g/onload=alert(2)//<p>` vira `<svg><g></g></svg>`.
- A verificação de URI aceita http, https, ftp, ftps, tel, mailto, callto, sms, cid, xmpp, matrix e URLs relativas. ALLOW_UNKNOWN_PROTOCOLS começa em false. O README não afirma a palavra "javascript:" de forma explícita.
- Ganchos afterSanitize* rodam depois da validação e a saída deles não é revalidada. sanitize() não é reentrante e não deve ser chamada de dentro de um gancho.
- SAFE_FOR_XML = false só é seguro para HTML puro; trocar de true para false pode abrir XSS.
- Com RETURN_TRUSTED_TYPE verdadeiro, sanitize retorna TrustedHTML. Sem política própria, o DOMPurify cria a política interna de nome "dompurify"; uma CSP restrita que não liste esse nome bloqueia a criação.
- Sanitizer API: setHTML, ShadowRoot.setHTML e Document.parseHTML são os métodos seguros. Com a configuração padrão removem script, iframe, object, embed, frame, use e todos os atributos de evento, além de comentários e atributos data-*. Os métodos "Unsafe" aplicam apenas o sanitizador passado e usam Trusted Types.
- A MDN marca setHTML e Sanitizer como "Limited availability", fora do Baseline. A tabela de compatibilidade não veio na captura, então o estado de Safari não foi verificado. Fontes secundárias (OpenReplay, 2026-03-19) citam Firefox 148 (24 de fevereiro de 2026) e Chrome 146.
- Um sanitizador vazio, `new Sanitizer({})`, devolve configuração com comments true e listas de remoção vazias (MDN, página Sanitizer), ou seja, o sanitizador vazio não remove elementos por configuração. Só os métodos seguros impõem a remoção de itens inseguros.
- A MDN avisa que serializar o resultado com innerHTML e reanalisar em outro lugar pode reintroduzir XSS por mutação.
- Trusted Types: com require-trusted-types-for ativo, atribuir string a innerHTML lança TypeError. A lista de sinks inclui HTMLIFrameElement.srcdoc, DOMParser.parseFromString, insertAdjacentHTML, Range.createContextualFragment, eval e script.src. A diretiva trusted-types limita os nomes de política. O recurso é Baseline 2026 "Newly available".

### Classes de defeito e detecção automática
**1.1 XSS por HTML importado (script, atributos on*, URLs javascript:, SVG com script/foreignObject/use).**
- Detecção: teste de corpus de vetores (lista de cargas de XSS do OWASP ou do README do DOMPurify) importado por cada entrada do produto. A verificação roda a importação e inspeciona o DOM resultante: nenhum elemento script, nenhum atributo começando por "on", nenhum href/src/action/formaction/xlink:href com esquema javascript:, data:text/html ou vbscript:.
- Complemento no navegador: Playwright com `page.on('dialog')` e um `window.__xss` definido por carga; a falha é qualquer execução. Custo: um arquivo de teste e alguns segundos por execução; precisa de navegador para pegar execução real e mutação de parser.
- Detecta: o que o sanitizador deixa passar nos vetores do corpus. Não detecta: vetores novos que o corpus não contém, nem XSS por mutação que dependa de reserialização em outro contexto.
- Controle estático: regra do ESLint que proíbe `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML` e `document.write` fora de um módulo único (verificação sem navegador, custo de configuração baixo; não prova que o módulo único sanitiza).

**1.2 Sinks sem política (Trusted Types).**
- Detecção: servir o app de teste com cabeçalho `Content-Security-Policy: require-trusted-types-for 'script'` (primeiro em modo `Content-Security-Policy-Report-Only`) e rodar o Playwright escutando `securitypolicyviolation` e `page.on('console')`. Cada violação lista o sink que recebeu string crua.
- Navegador: sim (Chromium, Firefox 148 ou mais novo e Safari com Baseline 2026). Custo: baixo; o ganho é um mapa completo dos sinks do app e das bibliotecas.
- Detecta: toda atribuição de string a sink DOM no código executado pelo roteiro. Não detecta: caminhos que o roteiro não exercita.

**1.3 Fidelidade versus segurança no sanitizador.**
- Avaliação: o setHTML padrão remove data-*, comentários, iframe e use, o que muda o conteúdo que um editor precisa preservar. Para um importador que mantém atributos do documento, a configuração explícita do DOMPurify (lista de tags e atributos própria, gancho uponSanitizeAttribute para casos permitidos) controla o resultado; o setHTML serve apenas onde a perda de data-* e comentários é aceitável.
- Detecção: teste de ida e volta com um corpus de HTML legítimo, comparando o DOM de entrada com o de saída depois da importação e listando o que o sanitizador removeu. Sem navegador (jsdom ou o DOM do Vitest) para a lista de nós; com navegador para confirmar a renderização.

---

## 2. Iframe: sandbox, srcdoc, CSP e postMessage

### Fontes
| URL | Versão ou data do conteúdo | O que sustenta |
|---|---|---|
| https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe | página MDN, 2026-10-08 | Tokens de sandbox, aviso sobre allow-scripts com allow-same-origin, srcdoc, atributo csp, credentialless |
| https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage | página MDN, 2026-10-08 | Verificação de origin e source, targetOrigin, origem opaca, validação de sintaxe |
| https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html | sem data na página | Mensagens entre janelas, sandbox, armazenamento local |
| https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-src | página MDN, Baseline amplamente disponível desde agosto de 2016 | Diretiva frame-src, cadeia de reserva child-src e default-src, diferença para frame-ancestors |
| https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src | página MDN, 2026-10-08 | Nonce único por requisição, hashes, strict-dynamic, unsafe-inline, manipuladores inline bloqueados |
| https://w3c.github.io/webappsec-csp/ | Editor's Draft de 16 de setembro de 2026 | Item 4.2 diz que a lista de CSP do documento é herdada "following the rules of the policy container"; item 2.2 cita documentos de esquema local com origem opaca que herdaram a política |

### Fato documentado
- Sandbox vazio aplica todas as restrições; cada token levanta uma restrição (allow-scripts, allow-same-origin, allow-forms, allow-modals, allow-popups, allow-popups-to-escape-sandbox, allow-top-navigation e variantes, allow-downloads e outros).
- Com allow-scripts e allow-same-origin juntos num documento de mesma origem do pai, o documento embutido pode remover o próprio atributo sandbox, e a proteção equivale a nenhuma. Com allow-same-origin, um pai de mesma origem acessa o DOM do iframe mesmo sem allow-scripts.
- srcdoc substitui src, o documento tem localização about:srcdoc, URLs relativas resolvem contra a URL da página que embute. O exemplo da MDN combina `sandbox` e `srcdoc` para mostrar conteúdo de usuário.
- MDN para postMessage: "Failure to check the origin and possibly source properties enables cross-site scripting attacks." Usar targetOrigin específico, não "*"; responder com `event.source.postMessage(resposta, event.origin)`; validar a sintaxe de event.data; URLs data: têm origem opaca e só aceitam "*". A página não trata de iframe com sandbox; a origem "null" de documentos sem allow-same-origin é conhecimento geral, não texto da página.
- OWASP: comparar origens com igualdade exata (verificação por substring como indexOf(".owasp.org") é contornada por owasp.org.attacker.com); tratar dados de mensagem como dados, nunca como entrada de eval ou innerHTML.
- CSP: frame-src controla quais iframes a página carrega; recorre a child-src e depois default-src. Nonce deve ser gerado por requisição. Hashes não cobrem manipuladores de evento. A página de CSP da MDN não trata da herança de política em srcdoc, blob e data; a especificação CSP3 remete a regras do policy container, e o texto completo da herança (item 7.8, "CSP Inheriting to avoid bypasses") não foi lido nesta pesquisa.

### Classes de defeito e detecção automática
**2.1 Isolamento anulado (allow-scripts com allow-same-origin).**
- Detecção estática: varredura do código-fonte por `sandbox` em iframes e atributos montados por `setAttribute('sandbox'`, falhando se a lista contiver os dois tokens ao mesmo tempo para qualquer iframe que receba conteúdo importado. Sem navegador; custo de uma regra do ESLint ou de um teste Vitest sobre o DOM.
- Detecção dinâmica: Playwright importa um HTML que contém script que tenta `parent.document`, `localStorage`, `document.cookie` e remover o próprio atributo sandbox; o teste exige que nenhum acesso tenha sucesso. Navegador: sim. Custo: baixo.
- Avaliação: um canvas de editor normalmente precisa de acesso ao DOM do iframe, o que exige allow-same-origin. Nesse caso, o conteúdo importado não pode rodar script no mesmo documento; o isolamento depende de sanitização (item 1) e de ausência de allow-scripts. A fronteira entre "editar" e "executar" decide a configuração, e o teste dinâmico acima valida a escolha.

**2.2 Mensagens aceitas de origem errada.**
- Detecção estática: regra que exige, em todo `addEventListener('message'`, uma comparação com `event.source` contra a janela esperada (e `event.origin` quando a origem for conhecida), e que proíbe `postMessage(..., '*')` fora de documentos de origem opaca. Sem navegador.
- Detecção dinâmica: Playwright cria uma segunda página ou iframe estranho que envia mensagens falsas ao editor (formatos válidos e inválidos) e confere que o estado do documento não muda. Navegador: sim.
- Detecta: ausência de verificação. Não detecta: lógica de validação de payload incompleta fora do que o teste envia; por isso o payload passa por esquema zod com safeParse.

**2.3 CSP quebrada por conteúdo inline.**
- Detecção: servir o editor com CSP em modo Report-Only e coletar `securitypolicyviolation` e relatórios no Playwright. Cada violação mostra diretiva e trecho bloqueado. Navegador: sim. Custo: baixo.
- Limite: a herança da política para o iframe srcdoc não foi lida na especificação completa; o teste no navegador alvo é a fonte de verdade.

---

## 3. Persistência no navegador

### Fontes
| URL | Versão ou data do conteúdo | O que sustenta |
|---|---|---|
| https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria | página MDN, 2026-10-08 | Limites por navegador, QuotaExceededError, melhor esforço versus persistente, persist(), despejo |
| https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate | página MDN, Baseline amplamente disponível desde setembro de 2023 | quota, usage, usageDetails, imprecisão deliberada |
| https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event | página MDN, 2026-10-08 | Evento storage só dispara em outros documentos |
| https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API | página MDN, Baseline amplamente disponível desde março de 2022 | Canal entre contextos de mesma origem, clone estruturado, partição de armazenamento |
| https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API | página MDN, Baseline amplamente disponível desde março de 2022 | navigator.locks.request, modos, ifAvailable, steal, signal, vida do bloqueio |
| https://developer.mozilla.org/en-US/docs/Web/API/IDBOpenDBRequest/blocked_event | página MDN, 2026-10-08 | Evento blocked |
| https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase/versionchange_event | página MDN, 2026-10-08 | Evento versionchange |
| https://zod.dev/api | zod 4.x (página da API v4) | Chaves desconhecidas, discriminatedUnion, preprocess, codec, default, prefault, catch |
| https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution | página MDN, 2026-10-08 | Veja o item 10.6 |

### Fato documentado
- Web Storage: 5 MiB por origem para cada um de localStorage e sessionStorage. IndexedDB, Cache e OPFS dependem do navegador: Chrome e Edge até 60% do disco; Firefox o menor valor entre 10% do disco e 10 GiB por grupo (melhor esforço), até 50% do disco se persistente; Safari 14 e iOS 17 em diante cerca de 60% do disco por origem em navegador, cerca de 15% em WebViews embutidas, cerca de 1/10 da cota do pai em iframes de outra origem.
- Escrita acima da cota falha com QuotaExceededError, que a MDN manda tratar com try...catch. O despejo apaga todos os dados da origem de uma vez, por LRU, e pula origens com persistência. O Safari com prevenção de rastreamento apaga dados criados por script de origens sem interação do usuário nos últimos sete dias.
- navigator.storage.persist(): o Firefox mostra pedido de permissão; Safari e Chromium decidem sozinhos pelo histórico de interação. navigator.storage.estimate() devolve quota, usage e usageDetails aproximados, com ofuscação por segurança; lança TypeError quando o armazenamento da origem está indisponível (origem opaca ou desativada pelo usuário).
- Evento storage: dispara nas outras janelas com a mesma área de armazenamento, não na que fez a mudança. Para sessionStorage só dispara em contextos do mesmo contexto de navegação de topo. As propriedades key, oldValue, newValue e storageArea não estavam no texto capturado da página.
- BroadcastChannel exige mesma origem e mesma partição de armazenamento; mensagens usam clone estruturado; a semântica da mensagem é do app.
- Web Locks: request(nome, opções, callback) devolve promessa que resolve depois que o bloqueio é liberado; o bloqueio vale enquanto a promessa devolvida pelo callback estiver pendente. Modos exclusive (padrão) e shared. Opções ifAvailable, steal e signal. Exige contexto seguro.
- IndexedDB: blocked dispara no pedido de abertura quando outra conexão aberta impede a transação versionchange. versionchange dispara em cada conexão aberta quando outra aba pede upgrade ou deleteDatabase. A MDN mostra db.close() dentro do manipulador como forma de não bloquear o upgrade (padrão mostrado na página de blocked).
- Zod 4: z.object remove chaves desconhecidas por padrão; z.strictObject as rejeita; z.looseObject as mantém. z.discriminatedUnion escolhe esquema por chave literal (por exemplo, uma chave de versão). z.preprocess ou z.transform inicial reformata formatos antigos antes da validação. z.codec define conversão nos dois sentidos. .catch() substitui qualquer erro por um valor e pode esconder dado corrompido. .prefault() passa o valor padrão pelo esquema. Funções de refinamento e transformação não devem lançar exceção.

### Classes de defeito e detecção automática
**3.1 Corrupção (JSON parcial, escrita interrompida, valor de outra versão).**
- Detecção: teste que grava no armazenamento valores truncados, vazios, com tipos trocados e com chave `__proto__`, e exige que a carga caia num estado de recuperação definido (descarta ou isola o rascunho, registra o erro, nunca lança no boot). Com Vitest sobre o módulo de persistência: sem navegador; custo baixo. Com Playwright: grava via `page.evaluate`, recarrega e confere a interface; navegador: sim.
- Gerador de entradas: fast-check (propriedade de ida e volta e de truncamento em cada posição do JSON gravado) cobre todas as posições de corte; custo médio de escrever o gerador.
- Detecta: falha de parse, chaves ausentes, tipos errados. Não detecta: corrupção semanticamente válida que o esquema aceita (daí a validação por regras de integridade do documento depois do parse).

**3.2 Migração de esquema.**
- Padrão documentado no zod: um campo literal de versão no registro, discriminatedUnion pela versão, uma função de migração por salto de versão e validação final com o esquema atual via safeParse; .catch() fica fora do caminho de carga porque esconde corrupção.
- Detecção: congelar um arquivo de fixture por versão publicada (valor gravado de verdade) e um teste que carrega cada fixture, migra e compara com o esquema atual e com um instantâneo. Sem navegador; custo baixo por versão nova. Detecta: migração ausente ou incorreta para versões já congeladas. Não detecta: versões que nunca foram congeladas.
- Avaliação: regra de processo checável por script: todo aumento do número da versão exige uma fixture nova na mesma alteração.

**3.3 Cota e despejo.**
- Detecção: no Playwright, preencher o armazenamento até QuotaExceededError (loop de setItem com blocos) e conferir que o autosave mostra o erro ao usuário e que o estado em memória permanece. Para IndexedDB, o mesmo com a cota emulada pelo CDP no Chromium (`Storage.overrideQuotaForOrigin`). Navegador: sim (a emulação por CDP vale apenas para Chromium). Custo: médio.
- Em tempo de execução: chamar navigator.storage.estimate() na inicialização e antes de gravações grandes, e navigator.storage.persist() depois de uma interação do usuário. O resultado é aproximado por projeto; um limiar de aviso não equivale a garantia.
- Detecta: tratamento ausente do erro de cota. Não detecta: despejo real pelo navegador (não é reproduzível em teste), por isso o produto precisa de exportação explícita pelo usuário.

**3.4 Várias abas (escrita concorrente, sobrescrita de rascunho de outra aba).**
- Detecção: Playwright abre duas páginas do mesmo contexto de navegador (mesma origem), edita nas duas em ordem entrelaçada e compara o armazenamento final com a regra declarada (última escrita ganha, ou bloqueio por aba). Observação das regras do projeto: o CLAUDE.md do builder exige um editor por página na medição, e a abertura de duas páginas é feita em páginas separadas.
- Mecanismos: Web Locks para eleger a aba que grava (modo exclusive com ifAvailable); BroadcastChannel para avisar as outras abas; evento storage como reserva quando o dado vive em localStorage. Versão monotônica no registro (contador gravado junto) permite rejeitar escrita com versão menor.
- Detecta: perda de edição por sobrescrita cega. Não detecta: conflitos semânticos entre duas edições válidas (exigem política de mesclagem).

**3.5 IndexedDB: upgrade bloqueado por aba antiga.**
- Detecção: Playwright abre a aba A com a versão N do banco, abre a aba B com a versão N+1 e confere que A fecha a conexão no versionchange e que B não fica pendurada em blocked. Navegador: sim. Custo: baixo, quando o app usa IndexedDB. Se o app usa só localStorage, a classe não se aplica.

---

## 4. Área de transferência e arrastar-e-soltar

### Fontes
| URL | Versão ou data do conteúdo | O que sustenta |
|---|---|---|
| https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API | página MDN, 2026-10-08 | Requisitos de segurança e divergências entre navegadores |
| https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem | página MDN, Baseline 2024 "Newly available" desde junho de 2024 | ClipboardItem, supports(), leitura e escrita |
| https://developer.chrome.com/blog/web-custom-formats-for-the-async-clipboard-api | atualizado em 2022-08-01 | Prefixo "web " (com espaço) nos tipos MIME, Chromium 104 |
| https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event | página MDN, 2026-10-08 | clipboardData no evento paste, preventDefault, eventos sintéticos |
| https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer | página MDN, 2026-10-08 | getData, setData, items, types, files |
| https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API | página MDN, 2026-10-08 | Sequência de eventos, preventDefault em dragover, acesso ao armazenamento de dados |
| https://github.com/excalidraw/excalidraw/blob/master/packages/excalidraw/clipboard.ts | ramo master em 2026-10-08 | Serialização de elementos no clipboard do Excalidraw |
| https://github.com/tldraw/tldraw/blob/main/packages/tldraw/src/lib/ui/hooks/useClipboardEvents.ts | ramo main em 2026-10-08 | Tipos e fluxo do clipboard do tldraw |
| https://tldraw.dev/sdk-features/clipboard | documentação do SDK, 2026-10-08 | Versão 3 da carga, prioridade de colagem, ganchos de interceptação |

### Fato documentado
- Async Clipboard API exige contexto seguro e não existe em Web Workers. Pela especificação a leitura pede ativação transitória do usuário e uma ação de colar do navegador. No Chromium, leitura recusada pela especificação aciona o pedido da permissão clipboard-read; escrita exige a permissão clipboard-write ou ativação transitória. No Firefox e no Safari, leitura com ativação mostra um menu efêmero "Paste" habilitado após 1 segundo, escrita exige ativação transitória, e as permissões clipboard-read e clipboard-write não são suportadas nem planejadas. Iframes de outra origem no Chromium precisam das políticas de permissão clipboard-read e clipboard-write.
- ClipboardItem.supports(tipo) testa o suporte antes de escrever. read() devolve itens com types e getType().
- Formatos personalizados da web: prefixar o tipo MIME com "web " (com espaço), por exemplo "web image/jpeg"; Chromium 104 em desktop e móvel. O navegador não sanitiza esses formatos, o que serve a apps que sanitizam por conta própria ou que precisam de cópia idêntica. Na leitura o app procura itens cujo tipo começa com "web ". O estado em Firefox e Safari não foi verificado (um pull request do W3C citado por busca marcava WebKit e Gecko como não implementados em outubro de 2023, fonte não aberta).
- Evento paste: clipboardData.getData; preventDefault cancela a inserção padrão em área editável; eventos sintéticos de colar não alteram o documento. A página não trata de sanitização; o navegador não sanitiza o conteúdo colado para a aplicação.
- Arrastar e soltar: dragstart é o momento de escrever dados; leitura de dados vale em dragstart e drop; nos demais eventos o armazenamento fica inacessível. Sem preventDefault em dragover o drop nunca dispara. Arrastar arquivos do sistema operacional não dispara eventos da origem. A página de DataTransfer não descreve o modo protegido; a regra de que getData devolve vazio fora do drop vem do texto de arrastar e soltar acima.
- Excalidraw: copia como JSON com marca de tipo (EXPORT_DATA_TYPES.excalidrawClipboard), `elements` e `files`, gravado sob dois tipos MIME (o próprio e text/plain). Na colagem tenta `navigator.clipboard.read()`, depois `readText()`; a validação é rasa (marca de tipo e `elements` ser matriz); falha de parse devolve o texto cru. Cadeia de reserva na cópia: clipboardData.setData, depois navigator.clipboard.writeText, depois textarea oculto com execCommand("copy"). A cópia de PNG espera o blob para contornar o tempo do gesto no Safari.
- tldraw: a carga é JSON `{ type: 'application/tldraw', kind: 'content', version: 3 }`, com ativos em JSON simples e o restante comprimido com lz-string em base64, embutida num `<div data-tldraw>` dentro de text/html; text/plain leva o texto das formas (um espaço quando vazio, porque o Chrome para Android não cola text/plain vazio). A cópia usa navigator.clipboard.write com ClipboardItem de text/html e text/plain, com reserva em writeText. PNG personalizado tem prioridade na colagem. Atalhos de copiar e colar não rodam com forma em edição ou com campo focado que capture teclas.

### Classes de defeito e detecção automática
**4.1 Colagem de HTML não sanitizado.**
- Detecção: Playwright concede permissões `clipboard-read` e `clipboard-write` ao contexto (somente Chromium aceita esses nomes), escreve HTML com vetores no clipboard e dispara a colagem; o teste exige que o DOM do documento passe pelo mesmo sanitizador da importação (item 1). Para Firefox e WebKit, o teste dispara um `ClipboardEvent` sintético com `DataTransfer` montado no `page.evaluate`, o que exercita o tratador e não o fluxo nativo (evento sintético não altera conteúdo por padrão, então o tratador do app precisa ler clipboardData).
- Navegador: sim. Custo: médio (diferenças entre motores exigem dois caminhos de teste).

**4.2 Perda de fidelidade entre copiar e colar (carga própria).**
- Detecção: teste de ida e volta que serializa uma seleção no formato próprio, desserializa e compara com a seleção original, e um teste que lê a carga de uma versão antiga congelada (fixture). Validação com zod no ponto de entrada da colagem, com chave de versão, para rejeitar carga de outra origem. Sem navegador para o formato; com navegador para o fluxo copy/paste real. Custo: baixo a médio.
- Avaliação: tanto tldraw quanto Excalidraw gravam a carga também em text/plain ou text/html, o que mantém a colagem funcional em campos de texto e em navegadores sem formatos personalizados; a validação rasa do Excalidraw (marca e matriz) mostra o risco de confiar na carga sem esquema por elemento.

**4.3 Diferenças entre navegadores (permissões, ativação do usuário, tipos).**
- Detecção: rodar o mesmo teste nos três projetos do Playwright (chromium, firefox, webkit) com `ClipboardItem.supports` registrado por projeto. Navegador: sim. Custo: três vezes o tempo de uma execução. Detecta: erro de permissão e tipo não suportado. Não detecta: o menu "Paste" de Safari e Firefox em uso real, que exige gesto humano.

**4.4 Arrastar e soltar sem preventDefault ou com leitura fora do drop.**
- Detecção: Playwright `locator.dragTo` ou eventos de mouse manuais e conferência de que o drop disparou; para arquivos do sistema, `page.dispatchEvent` com `DataTransfer` criado por `evaluateHandle`. Navegador: sim. Detecta: ausência de preventDefault em dragover, leitura de dados em dragenter ou dragover (volta vazia). Não detecta: o arraste nativo entre aplicativos.
- Regra estática: busca por tratadores de dragover sem chamada a preventDefault (ESLint com regra própria). Custo: baixo.

---

## 5. Corridas do autosave

### Fontes
| URL | Versão ou data do conteúdo | O que sustenta |
|---|---|---|
| https://developer.chrome.com/docs/web-platform/page-lifecycle-api | atualizado em 2023-12-01 | Estados do ciclo de vida, hidden como último evento confiável, unload e beforeunload pouco confiáveis |
| https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event | página MDN, 2026-10-08 | visibilitychange como ponto de salvar estado |
| https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event | página MDN, 2026-10-08 | beforeunload não confiável, bfcache, registrar só com alterações não salvas |
| https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event | página MDN, 2026-10-08 | pagehide, propriedade persisted, compatível com bfcache |
| https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API | MDN, ver item 3 | Serialização de escrita entre abas |

### Fato documentado
- O ciclo de vida define seis estados: active, passive, hidden, frozen, terminated, discarded. A página trata a transição para hidden como o último evento de mudança de estado observável de modo confiável, especialmente no celular, e aconselha persistir o estado não salvo nesse momento.
- unload frequentemente não dispara (aba de celular fechada no seletor) e a presença dele pode impedir o bfcache. beforeunload pode ser ignorado durante o bfcache, o Chrome exige interação do usuário antes de dispará-lo, e no Firefox páginas com o ouvinte não entram no bfcache; a MDN manda registrá-lo apenas quando há alterações não salvas e removê-lo depois de salvar.
- pagehide é compatível com bfcache e tem a propriedade persisted. Como beforeunload e unload, pode não disparar em celular quando o usuário fecha o navegador pelo gerenciador de apps. A MDN indica visibilitychange (hidden) como melhor evento para encerrar a sessão e pagehide para detectar descarregamento.
- Em frozen, a página recomenda fechar IndexedDB, BroadcastChannel e conexões, e liberar Web Locks.

### Classes de defeito e detecção automática
**5.1 Edição pendente perdida na saída (debounce não esvaziado).**
- Detecção: Playwright digita no editor, dispara imediatamente `page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))` com `visibilityState` forçado a hidden (via `Object.defineProperty` no teste), depois fecha a página e reabre; o teste exige que o texto digitado esteja no rascunho carregado. Variantes: disparar `pagehide`, `page.close({ runBeforeUnload: true })` e `page.reload()`. Navegador: sim. Custo: baixo.
- Alternativa com relógio controlado: `page.clock.install()` e `page.clock.fastForward()` para provar que o debounce é esvaziado antes da saída e não depende do tempo real. Verifique na documentação do Playwright 1.63 a assinatura exata antes de usar (a página de clock não foi aberta nesta pesquisa).
- Detecta: debounce que só grava por tempo. Não detecta: encerramento forçado do processo (kill) e fechamento por gerenciador de apps no celular, que o navegador não anuncia à página.

**5.2 Escrita fora de ordem (resposta antiga sobrescreve versão nova).**
- Detecção: teste de propriedades sobre a fila de gravação: sequências aleatórias de edições e de atrasos simulados na camada de armazenamento (versão falsa assíncrona com latência aleatória); a invariante é que o valor final tenha a maior versão monotônica. fast-check no Vitest, sem navegador. Custo: médio para o gerador; baixo na execução.
- Avaliação: versão monotônica gravada junto com o dado permite à leitura rejeitar uma escrita atrasada e a Web Locks serializa as gravações entre abas; cada um cobre uma classe diferente (ordem na mesma aba versus concorrência entre abas).

**5.3 Salvamento durante edição não confirmada, ou beforeunload permanente.**
- Detecção: Playwright confere que o ouvinte beforeunload só existe quando há alteração pendente (teste: `page.close({ runBeforeUnload: true })` não pede confirmação quando salvo, e pede quando pendente, observado via `page.on('dialog')`). Navegador: sim. Custo: baixo.

---

## 6. Fidelidade da exportação

### Fontes
| URL | Versão ou data do conteúdo | O que sustenta |
|---|---|---|
| https://playwright.dev/docs/test-snapshots | documentação do Playwright Test, direitos de 2026; a página não informa número de versão | Fluxo de toHaveScreenshot, nomes por navegador e plataforma, update-snapshots, threshold, maxDiffPixels, stylePath, aviso sobre variação entre sistemas |
| https://playwright.dev/docs/api/class-pageassertions | documentação do Playwright, 2026-10-08 | Padrões das opções: animations "disabled", caret "hide", fullPage false, maskColor #FF00FF, threshold 0.2, scale "css" |
| https://playwright.dev/docs/api/class-page | documentação do Playwright (a página cita versões até v1.64) | page.emulateMedia com colorScheme (v1.9), forcedColors (v1.15), reducedMotion (v1.12), contrast (v1.51), media (v1.9) |
| https://html-validate.org/ | html-validate v11.16.2 | Validador HTML5 offline |
| https://html-validate.org/usage/index.html | html-validate v11.x | CLI `npm exec html-validate arquivo.html`, configuração, preset html-validate:recommended |
| https://validator.github.io/validator/ | Nu Html Checker; a página chama a versão "latest" de pronta para produção e cita 20.6.30 (30 de junho de 2020) como último número de versão | vnu.jar com Java 17 ou mais novo, servidor, Docker, npm vnu-jar |
| https://validator.github.io/validator/docs/vnu.1.html | manual do vnu, 2026-10-08 | Opções --format gnu, xml, json ou text; --errors-only; --also-check-css; --also-check-svg; --skip-non-html; --filterfile; saída com código 1 em caso de erro |

### Fato documentado
- toHaveScreenshot gera referências na primeira execução, compara nas seguintes, grava por navegador e plataforma, atualiza com `--update-snapshots`, tem threshold 0.2 por pixel e maxDiffPixels sem valor padrão; stylePath aplica CSS durante a captura; a página alerta que o desenho varia por sistema, versão, configuração e hardware, então as referências devem ser geradas no ambiente onde o teste roda. As opções maxDiffPixelRatio, animations, mask e caret vêm da página de PageAssertions (padrões acima).
- html-validate valida arquivos ou fragmentos offline; usa `html-validate:recommended` por padrão; aceita severidades por regra; a página de uso não descreve a API programática nem validação de fragmentos.
- vnu: lê arquivos, pastas e URLs; --format json produz saída legível por máquina; --errors-only suprime avisos; sai com 1 se houver erro.

### Classes de defeito e detecção automática
**6.1 Render do editor diferente do render do HTML exportado.**
- Técnica A, visual: no Playwright, abrir o canvas do editor e a página exportada (arquivo local) com o mesmo viewport, `colorScheme`, `locale`, `timezoneId` e fontes carregadas; capturar o mesmo recorte e comparar com `expect(page).toHaveScreenshot` ou comparando as duas imagens com um diferenciador de pixels. Mascarar com `mask` o que muda por natureza (marcadores do editor, alças). Navegador: sim. Custo: médio; referências dependem de sistema e navegador.
- Técnica B, estrutural: percorrer os dois DOMs em paralelo no navegador e comparar, por elemento correspondente, `getComputedStyle` para uma lista fixa de propriedades (display, position, width, height, margin, padding, font-family, font-size, line-height, color, background-color, flex e grid) e `getBoundingClientRect`. Navegador: sim (valores calculados só o navegador fornece). Custo: baixo a médio; falha com mensagem que aponta o elemento e a propriedade.
- Detecta: regra CSS que o editor aplica e a exportação omite, diferença de reset de CSS, fonte ausente, unidade convertida. Não detecta: diferença que só aparece em outro viewport ou estado (hover, foco) se o teste não os exercitar; por isso a comparação roda por breakpoint e por estado declarado no documento.

**6.2 HTML exportado inválido.**
- Técnica: html-validate no Vitest (`HtmlValidate.validateString`, API que a página de uso não documenta; confirmar na documentação do pacote) ou vnu.jar em linha de comando com `--format json --errors-only` (exige Java 17). Sem navegador. Custo: html-validate é dependência npm de baixo custo; vnu exige Java no ambiente de verificação local.
- Detecta: elementos mal aninhados, IDs duplicados, atributos inválidos, `alt` ausente. Não detecta: erro de renderização visual nem acessibilidade completa (para isso, axe-core no Playwright, fonte não aberta nesta pesquisa).

**6.3 Exportação não determinística.**
- Detecção: exportar o mesmo documento duas vezes e comparar byte a byte; exportar, importar e exportar de novo (ponto fixo). Sem navegador. Custo: baixo. Detecta: ordem instável de classes, IDs gerados aleatoriamente, carimbos de data.

---

## 7. Tratamento de erro em React 19

### Fontes
| URL | Versão ou data do conteúdo | O que sustenta |
|---|---|---|
| https://react.dev/reference/react-dom/client/createRoot | documentação react-dom 19 (a página não informa o número de versão) | Opções onCaughtError, onUncaughtError, onRecoverableError |
| https://react.dev/reference/react/Component | documentação do React 19 (a página não informa o número de versão) | Limites de erro: getDerivedStateFromError, componentDidCatch, o que não capturam |
| https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event | página MDN, 2026-10-08 | Evento error e window.onerror |
| https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event | página MDN, 2026-10-08 | Evento unhandledrejection e preventDefault |
| https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | página MDN, 2026-10-08 | Erro "ResizeObserver loop completed with undelivered notifications" |

### Fato documentado
- createRoot(container, opções) aceita três retornos de chamada, todos com a assinatura (erro, { componentStack }): onCaughtError (erro capturado por um limite de erro), onUncaughtError (erro sem limite que o capture) e onRecoverableError (erro que o React recuperou sozinho; alguns trazem error.cause). Por padrão o React registra tudo no console.
- Limites de erro (classe com getDerivedStateFromError e/ou componentDidCatch) não capturam erros de: tratadores de evento, renderização no servidor, o próprio limite, código assíncrono (setTimeout, requestAnimationFrame), com exceção do que ocorre dentro da função devolvida por startTransition do useTransition. A página não documenta uma API de reinício; a troca da prop `key` e o estado do limite são práticas comuns, não texto da página.
- window.onerror recebe cinco argumentos (message, source, lineno, colno, error) e `return true` cancela o registro padrão no console. Rejeições de promessa sem tratamento disparam unhandledrejection, e preventDefault cancela o registro padrão. O texto sobre "Script error." de scripts de outra origem sem CORS e as propriedades de PromiseRejectionEvent vêm de conhecimento geral, não do texto da página.
- ResizeObserver: a mensagem de loop ocorre quando o retorno altera o tamanho de elementos observados; o navegador entrega só as notificações mais profundas e adia as outras, disparando error no Window. A MDN indica mover a mudança para requestAnimationFrame ou parar de redimensionar quando o tamanho esperado for atingido.

### Classes de defeito e detecção automática
**7.1 Erro de render que derruba a árvore inteira.**
- Detecção: no Playwright, injetar um componente que lança no render (ponto de falha controlado por parâmetro de teste, ou uma entrada de documento corrompida) e conferir que: o limite de erro mais próximo mostra o fallback; o resto do editor segue interativo; onCaughtError foi chamado uma vez com componentStack. No Vitest com React Testing Library: sem navegador para a lógica do limite. Custo: baixo.
- Detecta: ausência de limite em torno do canvas, do inspector e das camadas. Não detecta: erros dentro de tratadores de evento (os limites não os capturam).

**7.2 Erros de tratador de evento e assíncronos fora dos limites.**
- Detecção: o teste do Playwright registra `page.on('pageerror')` e `page.on('console', tipo error)` durante cada roteiro de interação e falha se qualquer evento aparecer (cobre window.onerror e rejeições). Os roteiros do produto rodam com essa guarda ligada. Navegador: sim. Custo: baixo, e o ganho é geral porque aplica-se a todos os roteiros.
- Em produção: window.addEventListener('error') e 'unhandledrejection' encaminham para o mesmo registro que onUncaughtError e onCaughtError (um módulo único com buffer de breadcrumbs, item 8).

**7.3 Erro do ResizeObserver tratado como defeito real ou escondido.**
- Detecção: ouvinte de error que registra a mensagem de loop; no Playwright, o roteiro de redimensionar painéis e janela falha se a mensagem aparecer, o que revela o laço de layout. Navegador: sim. Custo: baixo. Avaliação: filtrar a mensagem em produção sem corrigir o laço esconde um defeito de layout; a MDN descreve o laço como causa a ser corrigida com rAF ou um tamanho esperado.

**7.4 onRecoverableError ignorado.**
- Detecção: o mesmo registro de erros passa a contar erros recuperáveis por tipo; um teste do Playwright falha se algum aparecer durante os roteiros (indicador de diferença entre HTML do servidor e do cliente ou de remontagem inesperada). Custo: baixo.

---

## 8. Diagnóstico em produção

### Fontes
| URL | Versão ou data do conteúdo | O que sustenta |
|---|---|---|
| https://developer.mozilla.org/en-US/docs/Web/API/Reporting_API | página MDN, Baseline 2026 "Newly available" desde março de 2026 | Tipos de relatório, ReportingObserver, Reporting-Endpoints |
| https://developer.mozilla.org/en-US/docs/Web/API/ReportingObserver | página MDN, Baseline 2026 "Newly available" | Construtor, types, buffered, observe, takeRecords, disconnect |
| https://docs.sentry.io/platforms/javascript/enriching-events/breadcrumbs/ | documentação do Sentry para JavaScript; a página usa o marcador de posição do nome do pacote e não informa versão | Breadcrumbs automáticos, addBreadcrumb, beforeBreadcrumb |
| https://opentelemetry.io/docs/languages/js/getting-started/browser/ | documentação do OpenTelemetry JS; sem números de versão na página | Estado experimental da instrumentação de navegador, pacotes disponíveis |
| https://vite.dev/config/build-options | documentação do Vite v8.3.3 (seletor de versão da página) | build.sourcemap: true, 'inline' ou 'hidden' |

### Fato documentado
- Reporting API: ReportingObserver(callback, { types, buffered }) com observe(), takeRecords() e disconnect(). Tipos: coep, coop, crash (não observável por JavaScript), csp-violation, deprecation, integrity-violation, intervention, permissions-policy-violation. Relatórios de servidor usam Reporting-Endpoints, `report-to` e POST com `application/reports+json`. A MDN marca ReportingObserver como menos confiável que a entrega ao servidor, porque uma falha da página pode impedir a leitura. A página de ReportingObserver só demonstra o tipo deprecation, e não afirma quais tipos o campo types aceita; a verificação por navegador é necessária.
- Sentry: breadcrumbs automáticos de cliques e teclas em elementos DOM, XHR e fetch, chamadas ao console e mudanças de localização; addBreadcrumb aceita category, message, level, type, timestamp e data; beforeBreadcrumb pode alterar ou descartar. O limite padrão de 100 breadcrumbs não consta na página e não foi verificado.
- OpenTelemetry JS no navegador é "experimental e quase não especificado" na página; pacotes citados: sdk-trace-web, instrumentation-document-load, instrumentation-user-interaction, instrumentation-xml-http-request, auto-instrumentations-web. A página não trata de erros nem de logs.
- Vite 8.3.3: build.sourcemap padrão false; 'hidden' gera o arquivo de mapa sem o comentário de referência no pacote.

### Classes de defeito e detecção automática
**8.1 Defeito sem contexto para reproduzir.**
- Técnica: um registro de breadcrumbs próprio (anel em memória, tamanho fixo) alimentado por eventos de comando, mudança de seleção, mudança de breakpoint, gravação de rascunho e erros, com tipo e carimbo; o relatório de erro anexa o anel e a versão do app. Nenhum serviço externo é obrigatório; o formato segue categoria, mensagem, nível e dados, como no addBreadcrumb do Sentry.
- Verificação automática: teste do Playwright que provoca um erro conhecido e confere que o relatório contém o anel, o componentStack e a versão. Custo: baixo.

**8.2 APIs descontinuadas e intervenções do navegador não vistas.**
- Detecção: ReportingObserver com types deprecation e intervention e buffered true, instalado no início da página de teste do Playwright; o teste falha se algum relatório chegar durante o roteiro. Navegador: sim (apoio em Chromium confirmado como Baseline 2026; verificar o suporte do tipo em Firefox e WebKit no navegador do projeto). Custo: baixo. Detecta: uso de APIs descontinuadas (por exemplo XHR síncrono) e intervenções. Não detecta: relatórios que o navegador do teste não gera.

**8.3 Violações de CSP e de Trusted Types em campo.**
- Detecção: ouvinte de securitypolicyviolation e, no servidor de relatórios do operador, o endpoint declarado em Reporting-Endpoints. Para este projeto, o escopo cobre apenas o ouvinte no cliente; o servidor de relatórios fica fora do escopo do builder.

**8.4 Pilhas ilegíveis em produção.**
- Técnica: build com mapa de fontes `hidden` no Vite (o arquivo existe, o pacote não o referencia) e resolução da pilha fora do cliente, em ferramenta de desenvolvimento. Verificação automática: teste que lê o mapa gerado e confere que uma posição conhecida do pacote aponta para o arquivo-fonte esperado (pacote source-map ou @jridgewell/trace-mapping). Sem navegador. Custo: baixo.

---

## 9. Deriva de arquitetura

### Fontes
| URL | Versão ou data do conteúdo | O que sustenta |
|---|---|---|
| https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md | dependency-cruiser; a página não informa versão | Seções forbidden, allowed, required; regra no-circular; severidades; reachable; orphan |
| https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md | dependency-cruiser 18.x (a saída de exemplo mostra 18.0.0 e a página cita 18.3.0) | CLI, tipos de saída, código de saída, baseline, TypeScript |
| https://github.com/javierbrea/eslint-plugin-boundaries | README; documentação da v7.1.0 em jsboundaries.dev | Plugin de fronteiras para ESLint |
| https://www.jsboundaries.dev/docs/rules/ | eslint-plugin-boundaries 7.1.0 | Lista de regras ativas e obsoletas |
| https://github.com/pahen/madge | madge; a página não mostra o número de versão | Detecção de ciclos, suporte a TypeScript, estado de manutenção |
| https://github.com/ts-arch/ts-arch | ts-arch (pacote npm tsarch); a página não mostra versão | Regras ao estilo ArchUnit para TypeScript |

### Fato documentado
- dependency-cruiser: regras em três seções. `forbidden` lista dependências proibidas, `allowed` lista as permitidas (o que não casa recebe `not-in-allowed`, com gravidade padrão warn, ajustável por allowedSeverity), `required` lista dependências obrigatórias. Cada regra tem `from` e `to`; path e pathNot são expressões regulares, com grupos de captura reutilizáveis ($1). A regra `no-circular` usa `"to": { "circular": true }`. Existem `orphan`, `reachable`, `dependencyTypes` (como type-only). Gravidades: error, warn, info, ignore (padrão warn).
- CLI (v18.x): `err` é o tipo de saída padrão e termina com o número de violações de gravidade error como código de saída; há `--output-type` com err-html, dot, mermaid, json e outros; `--config` carrega as regras (padrão .dependency-cruiser.js e variantes); `--init` cria a configuração inicial; `--baseline` registra violações conhecidas e `--ignore-known` as oculta; `--metrics` calcula instabilidade; para TypeScript usar `tsPreCompilationDeps` e `tsConfig` no arquivo de configuração.
- eslint-plugin-boundaries 7.1.0: regras ativas boundaries/dependencies, boundaries/no-unknown-files, boundaries/no-unknown-dependencies (antes no-unknown) e boundaries/no-ignored-dependencies (antes no-ignored). Obsoletas, ainda funcionais e a serem removidas numa próxima versão maior: element-types (apelido de dependencies), entry-point, external, no-private. Configuração flat com `boundaries/elements`.
- madge: detecta ciclos com `madge --circular` ou `.circular()`; suporte a TypeScript com opção tsConfig e detectiveOptions (skipTypeImports); o mantenedor descreve o trabalho como tempo livre.
- ts-arch: regras como `filesOfProject().inFolder("business").shouldNot().dependOnFiles().inFolder("ui")` e `beFreeOfCycles()`; exemplos com Jest; a página não menciona Vitest.

### Classes de defeito e detecção automática
**9.1 Camada que importa o que não deve (por exemplo, núcleo importando editor, canvas importando inspector).**
- Detecção: dependency-cruiser com regras `forbidden` por pasta (from/to por path) e `required` quando for o caso; execução por `npx depcruise src --config` (confirmar o comando no `--help` instalado). Código de saída diferente de zero quando houver violação com gravidade error. Sem navegador. Custo: baixo (segundos em projeto de porte médio). Detecta: importação estática e `import type` (com tsPreCompilationDeps). Não detecta: acoplamento por eventos globais, por chaves de armazenamento ou por campos da store lidos sem importação.
- Alternativa no ESLint: eslint-plugin-boundaries 7.1.0 com boundaries/dependencies, que acusa a violação dentro do editor de código e do comando `npm run lint` já existente. Avaliação: o projeto já executa o lint; a regra entra no mesmo comando sem ferramenta nova; dependency-cruiser acrescenta ciclos, órfãos e relatórios gráficos.

**9.2 Ciclos de dependência.**
- Detecção: dependency-cruiser `no-circular` (regra do próprio exemplo da documentação) ou `madge --circular`. Sem navegador. Custo: baixo. Avaliação: dependency-cruiser cobre o mesmo e também as regras do item 9.1 com uma só ferramenta; madge sozinho não aplica regras de camada.

**9.3 Arquivos fora do mapa de arquitetura (código novo sem camada).**
- Detecção: boundaries/no-unknown-files e boundaries/no-unknown-dependencies (7.1.0), ou dependency-cruiser com `allowed` (o que não casa vira `not-in-allowed`). Custo: baixo. Detecta: arquivo novo que ninguém classificou.

**9.4 Regras de arquitetura como teste (estilo ArchUnit).**
- ts-arch: suficiente em recurso, mas a página só exemplifica Jest e o CLAUDE.md do projeto proíbe criar e rodar a suíte de testes; avaliação: preferir ESLint e dependency-cruiser, que rodam como verificação estática.

**9.5 Baseline de dívida.**
- dependency-cruiser `--baseline` e `--ignore-known` (modo shrink-only) permitem adotar as regras sem corrigir todo o passivo, e falhar apenas em violação nova. Custo: baixo.

---

## 10. Outras classes de defeito de editores visuais

### Fontes
| URL | Versão ou data do conteúdo | O que sustenta |
|---|---|---|
| https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing | página MDN, Baseline 2026 "Newly available" | Item 10.1 |
| https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events | página MDN, Baseline amplamente disponível desde julho de 2020 | Item 10.2 |
| https://www.w3.org/International/articles/inline-bidi-markup/ | artigo do W3C Internationalization, sem data na captura | Item 10.3 |
| https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion | página MDN, Baseline amplamente disponível desde janeiro de 2020 | Item 10.4 |
| https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors | página MDN, 2026-10-08 | Item 10.5 |
| https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | MDN | Item 7.3 |
| https://community.owasp.org/attacks/Regular_expression_Denial_of_Service_-_ReDoS | página OWASP Community, 2026-10-08 | Item 10.6 |
| https://ota-meshi.github.io/eslint-plugin-regexp/rules/no-super-linear-backtracking.html | eslint-plugin-regexp, regra desde a v0.13.0 | Item 10.6 |
| https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution | página MDN, 2026-10-08 | Item 10.7 |
| https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse | página MDN, 2026-10-08 | Item 10.8 |
| https://playwright.dev/docs/emulation | documentação do Playwright, 2026-10-08 | Opções locale, timezoneId, colorScheme, permissions |

**10.1 Composição de texto por IME (japonês, chinês, coreano).**
- Fato: KeyboardEvent.isComposing é verdadeiro durante uma sessão de composição (de compositionstart a compositionend); a MDN manda usá-lo para ignorar atalhos e Enter durante a composição. A ordem entre compositionend e o keydown final varia por navegador (Safari historicamente dispara compositionend antes do keydown de confirmação, com isComposing falso nesse keydown; o Chromium costuma informar keyCode 229) — essa parte vem de conhecimento geral citado na resposta da página, não do texto.
- Detecção: Playwright dispara a sequência com `locator.dispatchEvent` (compositionstart, compositionupdate, keydown com isComposing, compositionend) em campo de texto e no texto de elemento editável do canvas, e confere que atalhos do editor (Enter, Delete, setas) não agem no meio da composição e que o texto final é gravado uma vez. Com o CDP do Chromium, `Input.imeSetComposition` e `Input.insertText` simulam IME real. Navegador: sim. Custo: médio. Detecta: atalho disparado no meio da composição, texto duplicado ou perdido na gravação de rascunho. Não detecta: comportamento de IMEs reais do sistema operacional.
- Relação com o requisito G2 do CLAUDE.md do projeto: o rascunho pendente de digitação precisa ser gravado também ao fim da composição.

**10.2 Ponteiro: caneta, toque, cancelamento e captura.**
- Fato: pointerType distingue mouse, pen e touch; pointercancel dispara quando o navegador assume o gesto (rolagem ou zoom); setPointerCapture reenvia eventos ao elemento mesmo fora dele e é liberado em pointerup ou pointercancel; mover o elemento no DOM exige refazer a captura; touch-action none desativa a rolagem e o zoom nativos; PointerEvent tem pressure, tiltX, tiltY e isPrimary.
- Detecção: Playwright com contexto `hasTouch: true` e emulação de dispositivo, eventos `pointerdown`, `pointermove`, `pointercancel` e `pointerup` disparados por `dispatchEvent` (PointerEvent com pointerType 'pen' e 'touch'). O teste exige que um pointercancel no meio do arraste desfaça ou conclua o gesto sem deixar estado de arraste (alça presa, gesto aberto). Para toque real, `page.touchscreen.tap` cobre só o toque simples; arraste de toque exige CDP `Input.dispatchTouchEvent`. Navegador: sim. Custo: médio.
- Detecção estática: busca por onMouse* no lugar de onPointer* e por ausência de touch-action nos elementos de arraste. Custo: baixo.
- Detecta: gesto preso após cancelamento, arraste que não funciona com caneta, rolagem do navegador roubando o gesto. Não detecta: sensibilidade real de pressão do hardware.

**10.3 Texto bidirecional e RTL.**
- Fato: o W3C recomenda `dir` no elemento envolvente de texto de direção oposta (o navegador isola o texto), `dir="auto"` para texto de direção desconhecida, `bdi` para inserção sem elemento adequado, e explica que sem isolamento a pontuação e os números vizinhos ficam fora de ordem. Os caracteres de isolamento (LRI, RLI, FSI, PDI) servem onde a marcação não é possível, como em title e valores de atributo.
- Detecção: Playwright carrega o documento com `dir="rtl"` na raiz e textos mistos (árabe, hebraico e latim com números) e roda o conjunto de medições de layout e a comparação editor versus exportação (item 6). Verificações: nomes longos de camadas e rótulos usam `dir="auto"` ou `bdi`; propriedades CSS lógicas (margin-inline-start) no lugar das físicas no CSS do editor, o que uma regra de lint do CSS (stylelint com a regra de propriedades lógicas, a verificar na documentação do pacote) cobre sem navegador. Navegador: sim para a renderização. Custo: médio.
- Detecta: rótulo com pontuação invertida, painel que não espelha, exportação que perde a direção. Não detecta: erros de moldagem de letras e ligaduras que dependem de fonte.

**10.4 Redução de movimento (prefers-reduced-motion).**
- Fato: valores no-preference e reduce; a regra de CSS dentro de `@media (prefers-reduced-motion: reduce)` substitui a animação; a MDN descreve testes pelo sistema operacional e pelo painel Rendering dos navegadores. Playwright oferece `page.emulateMedia({ reducedMotion: 'reduce' })` (opção desde a v1.12).
- Detecção: no Playwright, emular reduce, percorrer os roteiros e conferir que `document.getAnimations()` não contém animações com duração perceptível originadas do app (exceção: as essenciais, declaradas) e que transições computadas têm `transition-duration` igual a 0 ou valor curto. Navegador: sim. Custo: baixo. Detecta: animação e transição não desativadas. Não detecta: movimento essencial mal classificado (decisão de produto).
- No iframe do canvas: a preferência vale também para o documento do iframe; o HTML exportado precisa do mesmo bloco de CSS se contiver animações (comparação com o item 6 usando emulação reduce).

**10.5 Cores forçadas e alto contraste (forced-colors).**
- Fato: no modo forced-colors: active (alto contraste do Windows) o navegador impõe a paleta do usuário; color, background-color, border-color, outline-color, fill e stroke de SVG vêm do sistema; box-shadow e text-shadow viram none; background-image vira none, exceto URL. Elementos usam cores de sistema (Canvas, CanvasText, ButtonText, LinkText) pela semântica nativa, não pelo atributo ARIA role. A MDN orienta correções pontuais, por exemplo borda de 2px ButtonText no lugar de sombra, e não um tema separado. `forced-color-adjust: none` desativa a imposição por elemento.
- Detecção: Playwright `page.emulateMedia({ forcedColors: 'active' })` (opção desde a v1.15), seguido de verificação de que cada controle interativo e cada indicador de foco e seleção tem contorno ou borda visível, medida por `getComputedStyle` (border-top-width, outline-style) e por captura de tela. A documentação do Playwright adverte que a emulação muda a característica de mídia mas não garante a paleta de um tema real do Windows. Navegador: sim. Custo: baixo a médio.
- Detecta: seleção indicada apenas por sombra ou cor de fundo (desaparece), alças do canvas invisíveis. Não detecta: paleta real do sistema.

**10.6 ReDoS em analisadores com expressão regular (importação de HTML e CSS).**
- Fato: a OWASP descreve retrocesso catastrófico: o tempo cresce de modo exponencial, como em `^(a+)+$` com 16 letras a seguidas de um caractere que falha (65.536 caminhos); padrões típicos são `(a+)+$`, `([a-zA-Z]+)*$`, `(a|aa)+$`, `(a|a?)+$`. Não construir expressão regular com entrada do usuário. A regra regexp/no-super-linear-backtracking do eslint-plugin-regexp (desde a v0.13.0) acusa retrocesso exponencial ou polinomial; por padrão (`report: "certain"`) só relata quando prova um sufixo de rejeição; a própria página diz que o método é simples e não pega todos os casos; a opção "potential" relata mais casos com falsos positivos.
- Detecção: (1) lint estático com a regra acima em `report: "potential"` sobre os arquivos do importador e do analisador de CSS, sem navegador, custo baixo; (2) teste de tempo com entradas adversariais geradas (repetições longas de `<`, `"`, `;`, `{`, espaços e parênteses não fechados, 100 mil caracteres) e limite de tempo por chamada; (3) limite de tamanho e profundidade da entrada importada, imposto antes de qualquer expressão regular.
- Detecta: padrões ambíguos reais e tempo de execução alto na entrada gerada. Não detecta: padrões que a regra simples não alcança e entradas que o gerador não produz. Avaliação: usar o analisador nativo (DOMParser) em vez de expressão regular para HTML elimina a classe no caminho principal.

**10.7 Poluição de protótipo ao importar JSON.**
- Fato: em JSON, `__proto__` é um nome de propriedade comum e JSON.parse não polui; a poluição acontece quando o objeto é mesclado depois por Object.assign, laços for...in ou atribuição dinâmica `obj[a][b] = valor`. Spread `{...objeto}` não aciona o setter. Mitigações da MDN: validar com esquema (Zod ou ajv) rejeitando chaves inesperadas, rejeitar as chaves `__proto__`, `constructor` e `prototype` em atribuição dinâmica, objetos com `Object.create(null)` ou `{ __proto__: null }`, `Map` e `Set`, `Object.hasOwn()`. O Zod 4 remove chaves desconhecidas por padrão e `z.strictObject` as rejeita.
- Detecção: teste com cargas `{"__proto__":{"polluido":true}}`, `{"constructor":{"prototype":{"polluido":true}}}` em todo ponto de importação (documento, rascunho, colagem, configuração); a asserção é `({}).polluido === undefined` depois de cada importação e de cada operação de mesclagem do app. Sem navegador (Vitest) para a lógica; no navegador para o fluxo de colagem e importação. Custo: baixo. Detecta: mesclagens e atribuições dinâmicas sem proteção nos caminhos exercitados. Não detecta: bibliotecas de terceiros em caminhos que o teste não percorre. Complemento: busca estática por `Object.assign`, `for...in` e `deepMerge` próprios sobre dados importados.

**10.8 Fuso horário e localidade.**
- Fato: Date.parse interpreta data ISO sem horário como UTC e data com horário sem deslocamento como horário local; formatos fora do ISO dependem da implementação (por exemplo `1970/01/01` vale 0 no Chrome e no Firefox e NaN no Safari; `2014-02-30` vale uma data no Chrome e no Firefox e NaN no Safari). A MDN recomenda ISO com Z ou deslocamento explícito e cita a API Temporal como motivação. O Playwright aceita `locale` e `timezoneId` nas opções do contexto.
- Detecção: rodar os roteiros e os testes de ida e volta de serialização com `timezoneId` em UTC, America/Sao_Paulo, Asia/Kolkata e Pacific/Kiritimati, e com `locale` pt-BR, en-US e ar (números e separadores decimais), e exigir saída idêntica byte a byte para a parte serializada (datas gravadas em ISO com Z). Busca estática por `new Date(string)`, `Date.parse`, `toLocaleString` e `toLocaleDateString` na serialização e no HTML exportado (esses dois não podem depender da localidade). Navegador: sim para o fluxo completo; Vitest com a variável de ambiente `TZ` cobre a lógica pura. Custo: baixo.
- Detecta: carimbos que mudam com o fuso, números formatados na gravação com a localidade do usuário (vírgula decimal gravada no arquivo), análise de data que quebra no Safari. Não detecta: regras de horário de verão de fusos que o teste não inclui.

**10.9 Outras classes registradas (fontes já abertas acima ou conhecimento geral sinalizado).**
- Erros de laço do ResizeObserver: tratados no item 7.3.
- Foco e teclado: ordem de foco e armadilhas de foco são valores que o navegador calcula (consta no CLAUDE.md do projeto como medição de navegador); detecção por `page.keyboard.press('Tab')` em laço e registro de `document.activeElement` — técnica de conhecimento geral, sem fonte aberta nesta pesquisa.
- Zoom do navegador e escala do sistema: o CLAUDE.md do projeto já mede com escala 1.25; detecção por `deviceScaleFactor` do contexto do Playwright. Sem fonte aberta nesta pesquisa.

---

## Quadro-resumo (avaliação do pesquisador)

| Classe | Ferramenta principal | Navegador | Custo | Principal lacuna |
|---|---|---|---|---|
| XSS no HTML importado | Corpus de vetores no Vitest + Playwright com guarda de execução | Parcial | Baixo | Vetores fora do corpus |
| Sinks sem Trusted Types | CSP Report-Only + securitypolicyviolation | Sim | Baixo | Caminhos não exercitados |
| Sandbox anulado | Varredura estática + teste de fuga no Playwright | Parcial | Baixo | Configuração montada dinamicamente |
| postMessage sem verificação | Regra de lint + mensagens falsas no Playwright | Parcial | Baixo | Validação interna do payload |
| Corrupção de armazenamento | Vitest com truncamentos + fast-check | Não | Baixo | Dado válido porém incoerente |
| Migração de esquema | Fixtures por versão + zod safeParse | Não | Baixo por versão | Versões sem fixture |
| Cota excedida | Preenchimento no Playwright / CDP | Sim | Médio | Despejo real |
| Várias abas | Duas páginas no Playwright + Web Locks | Sim | Médio | Conflito semântico |
| Clipboard e colagem | Playwright com permissões (Chromium) e eventos sintéticos | Sim | Médio | Gesto humano do Safari e Firefox |
| Drag and drop | dragTo / dispatchEvent com DataTransfer | Sim | Médio | Arraste entre aplicativos |
| Autosave na saída | visibilitychange e pagehide forçados no Playwright | Sim | Baixo | Encerramento forçado |
| Escrita fora de ordem | fast-check sobre a fila | Não | Médio | Interação com abas |
| Fidelidade editor versus exportação | toHaveScreenshot + comparação de estilo calculado | Sim | Médio | Estados e breakpoints não exercitados |
| HTML exportado inválido | html-validate (v11.16.2) ou vnu | Não | Baixo | Acessibilidade e renderização |
| Erros de render e eventos | Guarda pageerror + onCaughtError/onUncaughtError | Sim | Baixo | Falhas silenciosas sem exceção |
| Diagnóstico em produção | Registro com breadcrumbs + ReportingObserver | Sim | Baixo | Falha que mata a página |
| Deriva de arquitetura | dependency-cruiser 18.x + eslint-plugin-boundaries 7.1.0 | Não | Baixo | Acoplamento sem importação |
| IME | Eventos de composição + CDP Input.imeSetComposition | Sim | Médio | IMEs reais |
| Ponteiro caneta e toque | PointerEvent sintético + CDP de toque | Sim | Médio | Hardware real |
| Bidi e RTL | dir=rtl com textos mistos + lint de CSS lógico | Sim | Médio | Moldagem de fonte |
| Reduced motion | emulateMedia reducedMotion + getAnimations | Sim | Baixo | Movimento essencial |
| Forced colors | emulateMedia forcedColors + estilo calculado | Sim | Baixo a médio | Paleta real do Windows |
| ReDoS | eslint-plugin-regexp + entradas adversariais | Não | Baixo | Casos além da regra simples |
| Poluição de protótipo | Cargas __proto__ e constructor + zod strict | Não | Baixo | Bibliotecas de terceiros |
| Fuso e localidade | timezoneId e locale no Playwright + varredura estática | Sim | Baixo | Fusos não incluídos |

## Lacunas desta pesquisa (não verificado)
- Estado do suporte do Safari à Sanitizer API e a setHTML: a tabela de compatibilidade da MDN não veio na captura; nenhuma fonte aberta o informa.
- Suporte de Firefox e Safari aos formatos personalizados "web " do clipboard: a fonte aberta (Chrome Developers, atualizada em 2022-08-01) cobre apenas o Chromium 104.
- Herança de CSP para documentos srcdoc dentro de iframes: o item da especificação (7.8) não foi lido; o comportamento deve ser medido no navegador alvo.
- Versões do Playwright: a documentação consultada não informa a versão; a página de API cita recursos até a v1.64, e as opções de emulateMedia usadas neste documento existem desde a v1.51 ou antes (instaladas: 1.63.0). A assinatura de page.clock não foi aberta.
- Versões atuais de madge, ts-arch, dependency-cruiser (a CLI cita 18.x) e do Sentry: as páginas abertas não informam número de versão exato, exceto os indicados nas tabelas.
- Opções exatas da API programática do html-validate (validateString) e de regras de stylelint para propriedades lógicas: não abertas.
