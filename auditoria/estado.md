# Estado

# Estado L01

Área L01: `src/core/store/` `src/core/history/` `src/core/commands/` `src/core/ports/` `src/core/document/` `src/core/a11y/` e os arquivos soltos de `src/core/`. O estado abaixo vem dos arquivos que o alvo `codigo` de `auditoria/padroes.json` cobre (fora de `*.test.ts` e de `src/core/testing/**`).

## EST-L01-001 — o objeto da store do núcleo
- **Declaração:** `src/core/store/store.ts:240` `export function createStore<Ui>(options: StoreOptions<Ui>): Store<Ui> {`
- **Forma:** `Store<Ui>`, o objeto que `createStore` devolve (`getState`, `dispatch`, `gesture`, `sequence`, `commandGroup`, `canRun`, `refusal`, `answer`, `notice`, `subscribe`, `subscribeDocument`), com o estado fechado na fábrica.
- **Valores possíveis:**
  - V1 nenhuma store: antes de o boot chamar `createStore`.
  - V2 a store devolvida por uma chamada, com o estado fechado que os itens EST-L01-002 a EST-L01-010 e EST-L01-030 a EST-L01-037 descrevem.
- **Escritores:**
  - `src/editor/store.ts:120` `const store = createStore<EditorUi>({` via a fábrica do editor (o boot que instala a store)
- **Leitores:**
  - `src/core/store/store.ts:603` `getState: () => state,` via `createStore` (o objeto expõe o estado fechado que ele mesmo lê)
- **Criação:** `src/core/store/store.ts:240` `export function createStore<Ui>(options: StoreOptions<Ui>): Store<Ui> {`
- **Descarte:** fim-da-página `src/core/store/store.ts:240` `export function createStore<Ui>(options: StoreOptions<Ui>): Store<Ui> {`
- **Navegador:** não

## EST-L01-002 — assinantes da store
- **Declaração:** `src/core/store/store.ts:242` `const listeners = new Set<() => void>();`
- **Forma:** `Set<() => void>`, fechado em `createStore`; cada membro é chamado a cada mudança de estado.
- **Valores possíveis:**
  - V1 vazio: nenhum assinante.
  - V2 com assinantes: cada `subscribe` acrescenta um e devolve a função que o remove.
  - V3 durante `publish`: a iteração usa a cópia `[...listeners]`, então assinar ou desassinar dentro de um ouvinte não altera a rodada em curso.
- **Escritores:**
  - `src/core/store/store.ts:755` `listeners.add(listener);` via `subscribe`
  - `src/core/store/store.ts:756` `return () => listeners.delete(listener);` via `subscribe` (a função devolvida)
- **Leitores:**
  - `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` via `publish`
  - `src/core/store/store.ts:282` `for (const listener of [...listeners]) listener();` via `commit` (estado inválido com `freeze`)
- **Criação:** `src/core/store/store.ts:242` `const listeners = new Set<() => void>();`
- **Descarte:** fim-da-página `src/core/store/store.ts:242` `const listeners = new Set<() => void>();`
- **Navegador:** não

## EST-L01-003 — assinantes de mudança do documento
- **Declaração:** `src/core/store/store.ts:243` `const documentListeners = new Set<(change: DocumentChange) => void>();`
- **Forma:** `Set<(change: DocumentChange) => void>`, fechado em `createStore`; cada membro recebe a mudança do documento antes dos demais assinantes.
- **Valores possíveis:**
  - V1 vazio: nenhum assinante de documento.
  - V2 com assinantes: cada `subscribeDocument` acrescenta um e devolve a função que o remove.
  - V3 durante `publish`: a iteração usa a cópia `[...documentListeners]` e só roda quando a referência do documento mudou.
- **Escritores:**
  - `src/core/store/store.ts:759` `documentListeners.add(listener);` via `subscribeDocument`
  - `src/core/store/store.ts:760` `return () => documentListeners.delete(listener);` via `subscribeDocument` (a função devolvida)
- **Leitores:**
  - `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` via `publish`
- **Criação:** `src/core/store/store.ts:243` `const documentListeners = new Set<(change: DocumentChange) => void>();`
- **Descarte:** fim-da-página `src/core/store/store.ts:243` `const documentListeners = new Set<(change: DocumentChange) => void>();`
- **Navegador:** não

## EST-L01-004 — a recusa do último commit (`breach`)
- **Declaração:** `src/core/store/store.ts:270` `let breach: Message | null = null;`
- **Forma:** `Message | null`, fechado em `createStore`.
- **Valores possíveis:**
  - V1 `null`: nenhuma violação de invariante no último commit.
  - V2 a mensagem de recusa: um commit cujo documento o validador recusou (sem `freeze`), que `run` lê e devolve ao pedido.
- **Escritores:**
  - `src/core/store/store.ts:278` `breach = breachMessage(source);` via `commit`
  - `src/core/store/store.ts:549` `breach = null;` via `run`
- **Leitores:**
  - `src/core/store/store.ts:271` `const breachNow = (): Message | null => breach;` via `breachNow`
  - `src/core/store/store.ts:552` `const refused = breachNow();` via `run`
- **Criação:** `src/core/store/store.ts:270` `let breach: Message | null = null;`
- **Descarte:** `src/core/store/store.ts:549` `breach = null;` (limpo quando um comando volta a rodar)
- **Navegador:** não

## EST-L01-005 — o início já passou (`started`)
- **Declaração:** `src/core/store/store.ts:289` `let started = false;`
- **Forma:** `boolean`, fechado em `createStore`.
- **Valores possíveis:**
  - V1 `false`: antes do commit do estado inicial; um estado inválido ali lança.
  - V2 `true`: depois do commit inicial, um estado inválido vira recusa (`breach`) e não lança sem `freeze`.
- **Escritores:**
  - `src/core/store/store.ts:295` `started = true;` via `createStore` (depois do commit inicial)
- **Leitores:**
  - `src/core/store/store.ts:277` `if (!started) throw new InvalidStateError(source, problems);` via `commit`
- **Criação:** `src/core/store/store.ts:289` `let started = false;`
- **Descarte:** fim-da-página `src/core/store/store.ts:289` `let started = false;`
- **Navegador:** não

## EST-L01-007 — o gesto aberto (`open`)
- **Declaração:** `src/core/store/store.ts:296` `let open: OpenGesture | null = null;`
- **Forma:** `OpenGesture | null` (estado antes, comando, patches, inversos), fechado em `createStore`.
- **Valores possíveis:**
  - V1 `null`: nenhum gesto aberto.
  - V2 o gesto aberto: entre `gesture()` e `commit()`/`cancel()`, os comandos entram nele.
- **Escritores:**
  - `src/core/store/store.ts:712` `open = current;` via `gesture`
  - `src/core/store/store.ts:715` `open = null;` via `close` (fim do gesto)
- **Leitores:**
  - `src/core/store/store.ts:604` `gestureOpen: () => open !== null,` via `createStore`
  - `src/core/store/store.ts:714` `if (open !== current) throw new Error('this gesture is closed');` via o `dispatch` do gesto
- **Criação:** `src/core/store/store.ts:296` `let open: OpenGesture | null = null;`
- **Descarte:** `src/core/store/store.ts:715` `open = null;`
- **Navegador:** não

## EST-L01-008 — o grupo de comandos aberto (`group`)
- **Declaração:** `src/core/store/store.ts:297` `let group: (OpenGesture & { readonly busy: Message; readonly mergeable: string | null }) | null = null;`
- **Forma:** o gesto aberto acrescido de `busy` e `mergeable`, ou `null`; fechado em `createStore`.
- **Valores possíveis:**
  - V1 `null`: nenhum grupo aberto.
  - V2 o grupo aberto: uma locação exclusiva; um comando desfazível de fora responde `busy`.
- **Escritores:**
  - `src/core/store/store.ts:613` `group = current;` via `commandGroup`
  - `src/core/store/store.ts:616` `group = null;` via o `cancel` do grupo
  - `src/core/store/store.ts:652` `group = null;` via o `commit` do grupo
- **Leitores:**
  - `src/core/store/store.ts:606` `commandGroupOpen: () => group !== null,` via `createStore`
  - `src/core/store/store.ts:403` `if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();` via `run`
  - `src/core/store/store.ts:584` `if (group !== null && command.history.undoable) return group.busy;` via `refusal`
- **Criação:** `src/core/store/store.ts:297` `let group: (OpenGesture & { readonly busy: Message; readonly mergeable: string | null }) | null = null;`
- **Descarte:** `src/core/store/store.ts:616` `group = null;`
- **Navegador:** não

## EST-L01-009 — a sequência de comandos aberta (`sequence`)
- **Declaração:** `src/core/store/store.ts:298` `let sequence: { readonly before: StoreState<Ui>; readonly mergeable: string | null; readonly inverses: Patch[] } | null = null;`
- **Forma:** o estado antes, a chave de coalescência e os inversos, ou `null`; fechado em `createStore`.
- **Valores possíveis:**
  - V1 `null`: nenhuma sequência aberta.
  - V2 a sequência aberta: uma sequência curta de teclado que pode ser cancelada inteira.
- **Escritores:**
  - `src/core/store/store.ts:666` `sequence = current;` via `sequence`
  - `src/core/store/store.ts:330` `sequence = null;` via `settleSequence`
  - `src/core/store/store.ts:676` `sequence = null;` via o `cancel` da sequência
- **Leitores:**
  - `src/core/store/store.ts:605` `sequenceOpen: () => sequence !== null,` via `createStore`
  - `src/core/store/store.ts:670` `if (sequence !== current) throw new Error('this command sequence is closed');` via o `dispatch` da sequência
- **Criação:** `src/core/store/store.ts:298` `let sequence: { readonly before: StoreState<Ui>; readonly mergeable: string | null; readonly inverses: Patch[] } | null = null;`
- **Descarte:** `src/core/store/store.ts:330` `sequence = null;`
- **Navegador:** não

## EST-L01-010 — a chave de coalescência do último dispatch (`lastMergeable`)
- **Declaração:** `src/core/store/store.ts:301` `let lastMergeable: string | null = null;`
- **Forma:** `string | null`, fechado em `createStore`.
- **Valores possíveis:**
  - V1 `null`: nenhuma chave fundível pendente.
  - V2 a chave do último dispatch que registrou entrada fundível.
- **Escritores:**
  - `src/core/store/store.ts:533` `lastMergeable = history.past.length < before.history.past.length ? null : key;` via `run`
  - `src/core/store/store.ts:405` `lastMergeable = null;` via `run`
  - `src/core/store/store.ts:617` `lastMergeable = current.mergeable;` via o `cancel` do grupo
  - `src/core/store/store.ts:653` `lastMergeable = null;` via o `commit` do grupo
  - `src/core/store/store.ts:677` `lastMergeable = current.mergeable;` via o `cancel` da sequência
- **Leitores:**
  - `src/core/store/store.ts:404` `const previousMergeable = lastMergeable;` via `run`
  - `src/core/store/store.ts:665` `const current = { before: state, mergeable: lastMergeable, inverses: [] as Patch[] };` via `sequence`
- **Criação:** `src/core/store/store.ts:301` `let lastMergeable: string | null = null;`
- **Descarte:** `src/core/store/store.ts:405` `lastMergeable = null;` (limpo a cada comando que roda)
- **Navegador:** não

## EST-L01-011 — classe `InvalidStateError`
- **Declaração:** `src/core/store/store.ts:79` `export class InvalidStateError extends Error {`
- **Forma:** classe de erro, com os campos `name` (`src/core/store/store.ts:80` `override name = 'InvalidStateError';`), `source` (`src/core/store/store.ts:83` `readonly source: string,`) e `problems` (`src/core/store/store.ts:84` `readonly problems: readonly Invalid[],`).
- **Valores possíveis:**
  - V1 uma instância cujo `source` nomeia o comando que produziu o estado inválido e cujo `problems` é a lista de `Invalid`.
- **Escritores:**
  - `src/core/store/store.ts:277` `if (!started) throw new InvalidStateError(source, problems);` via `commit`
  - `src/core/store/store.ts:283` `throw new InvalidStateError(source, problems);` via `commit`
- **Leitores:**
  - `src/core/store/store.ts:86` `produced an invalid state:` via o construtor de `InvalidStateError` (lê `source` e `problems`)
- **Criação:** `src/core/store/store.ts:79` `export class InvalidStateError extends Error {`
- **Descarte:** fim-da-página `src/core/store/store.ts:79` `export class InvalidStateError extends Error {`
- **Navegador:** não

## EST-L01-012 — o feed de incidentes (`feed`)
- **Declaração:** `src/core/incidents.ts:25` `let feed: readonly Incident[] = [];`
- **Forma:** `readonly Incident[]`, um anel de topo de módulo limitado a cinquenta.
- **Valores possíveis:**
  - V1 vazio: nenhum incidente.
  - V2 de um a cinquenta incidentes, o mais novo no fim.
  - V3 após `clearIncidents`: vazio de novo.
- **Escritores:**
  - `src/core/incidents.ts:29` `feed = [...feed, incident].slice(-LIMIT);` via `record`
  - `src/core/incidents.ts:57` `feed = [];` via `clearIncidents`
- **Leitores:**
  - `src/core/incidents.ts:53` `return feed;` via `incidents`
- **Criação:** `src/core/incidents.ts:25` `let feed: readonly Incident[] = [];`
- **Descarte:** fim-da-página `src/core/incidents.ts:25` `let feed: readonly Incident[] = [];`
- **Navegador:** não

## EST-L01-013 — os ouvintes do feed de incidentes
- **Declaração:** `src/core/incidents.ts:26` `const listeners = new Set<() => void>();`
- **Forma:** `Set<() => void>`, de topo de módulo.
- **Valores possíveis:**
  - V1 vazio: nenhum ouvinte.
  - V2 com ouvintes: cada `onIncident` acrescenta um e devolve a função que o remove.
- **Escritores:**
  - `src/core/incidents.ts:62` `listeners.add(listener);` via `onIncident`
  - `src/core/incidents.ts:64` `listeners.delete(listener);` via `onIncident` (a função devolvida)
- **Leitores:**
  - `src/core/incidents.ts:30` `for (const listener of [...listeners]) listener();` via `record`
  - `src/core/incidents.ts:58` `for (const listener of [...listeners]) listener();` via `clearIncidents`
- **Criação:** `src/core/incidents.ts:26` `const listeners = new Set<() => void>();`
- **Descarte:** fim-da-página `src/core/incidents.ts:26` `const listeners = new Set<() => void>();`
- **Navegador:** não

## EST-L01-014 — a tabela de features instalada (`featureTable`)
- **Declaração:** `src/core/commands/registry.ts:155` `let featureTable: FeatureTable | null = null;`
- **Forma:** `FeatureTable | null`, de topo de módulo.
- **Valores possíveis:**
  - V1 `null`: a tabela ainda não foi instalada; pedir uma feature lança.
  - V2 a tabela instalada: `installFeatureTable` a escreve uma vez, no boot.
- **Escritores:**
  - `src/core/commands/registry.ts:158` `featureTable = table;` via `installFeatureTable`
- **Leitores:**
  - `src/core/commands/registry.ts:163` `if (featureTable === null) throw new Error('the feature table is not installed (src/app/features.ts)');` via `isFeatureBuilt`
  - `src/core/commands/registry.ts:166` `const entry = (featureTable as Partial<FeatureTable>)[feature];` via `isFeatureBuilt`
- **Criação:** `src/core/commands/registry.ts:155` `let featureTable: FeatureTable | null = null;`
- **Descarte:** fim-da-página `src/core/commands/registry.ts:155` `let featureTable: FeatureTable | null = null;`
- **Navegador:** não

## EST-L01-015 — os localizadores das espécies de referência (`finders`)
- **Declaração:** `src/core/store/references.ts:13` `const finders = new Map<ReferenceKind, Finder>();`
- **Forma:** `Map<ReferenceKind, Finder>`, de topo de módulo.
- **Valores possíveis:**
  - V1 sem o tipo: `referenceFound` lança.
  - V2 com o tipo registrado pelo módulo dono: a função que encontra um nome daquele tipo.
- **Escritores:**
  - `src/core/store/references.ts:17` `finders.set(kind, finds);` via `registerReferenceKind`
- **Leitores:**
  - `src/core/store/references.ts:21` `export const referenceKindRegistered = (kind: ReferenceKind): boolean => finders.has(kind);` via `referenceKindRegistered`
  - `src/core/store/references.ts:25` `const finds = finders.get(kind);` via `referenceFound`
- **Criação:** `src/core/store/references.ts:13` `const finders = new Map<ReferenceKind, Finder>();`
- **Descarte:** fim-da-página `src/core/store/references.ts:13` `const finders = new Map<ReferenceKind, Finder>();`
- **Navegador:** não

## EST-L01-016 — os validadores de autoria por namespace (`validators`)
- **Declaração:** `src/core/document/authoring.ts:17` `const validators = new Map<string, AuthoringValidator>();`
- **Forma:** `Map<string, AuthoringValidator>`, de topo de módulo.
- **Valores possíveis:**
  - V1 sem o namespace: o valor só é checado como JSON.
  - V2 com o validador do módulo instalado, que `authoringProblems` consulta; um módulo removido o apaga.
- **Escritores:**
  - `src/core/document/authoring.ts:21` `validators.set(namespace, validator);` via `registerAuthoringValidator`
  - `src/core/document/authoring.ts:23` `if (validators.get(namespace) === validator) validators.delete(namespace);` via `registerAuthoringValidator` (a função devolvida)
- **Leitores:**
  - `src/core/document/authoring.ts:47` `const why = validators.get(namespace)?.(value) ?? null;` via `authoringProblems`
- **Criação:** `src/core/document/authoring.ts:17` `const validators = new Map<string, AuthoringValidator>();`
- **Descarte:** fim-da-página `src/core/document/authoring.ts:17` `const validators = new Map<string, AuthoringValidator>();`
- **Navegador:** não

## EST-L01-017 — o cache de modelo de saída por tabela (`outputs`)
- **Declaração:** `src/core/document/breakpoint-rules.ts:70` `const outputs = new WeakMap<readonly ProjectBreakpoint[], WeakMap<OutputModel, OutputModel>>();`
- **Forma:** `WeakMap<readonly ProjectBreakpoint[], WeakMap<OutputModel, OutputModel>>`, de topo de módulo (memoização).
- **Valores possíveis:**
  - V1 sem a tabela: nada em cache.
  - V2 com a tabela: um `WeakMap` por tabela, e o modelo derivado por modelo de entrada.
- **Escritores:**
  - `src/core/document/breakpoint-rules.ts:76` `outputs.set(table, byModel);` via `outputForTable`
- **Leitores:**
  - `src/core/document/breakpoint-rules.ts:73` `let byModel = outputs.get(table);` via `outputForTable`
- **Criação:** `src/core/document/breakpoint-rules.ts:70` `const outputs = new WeakMap<readonly ProjectBreakpoint[], WeakMap<OutputModel, OutputModel>>();`
- **Descarte:** fim-da-página `src/core/document/breakpoint-rules.ts:70` `const outputs = new WeakMap<readonly ProjectBreakpoint[], WeakMap<OutputModel, OutputModel>>();`
- **Navegador:** não

## EST-L01-018 — o cache de regras do modelo por tabela (`derived`)
- **Declaração:** `src/core/document/breakpoint-rules.ts:89` `const derived = new WeakMap<readonly ProjectBreakpoint[], WeakMap<ModelRules, ModelRules>>();`
- **Forma:** `WeakMap<readonly ProjectBreakpoint[], WeakMap<ModelRules, ModelRules>>`, de topo de módulo (memoização).
- **Valores possíveis:**
  - V1 sem a tabela: nada em cache.
  - V2 com a tabela: um `WeakMap` por tabela, e as regras derivadas por regras de entrada.
- **Escritores:**
  - `src/core/document/breakpoint-rules.ts:96` `derived.set(table, byRules);` via `rulesForDocument`
- **Leitores:**
  - `src/core/document/breakpoint-rules.ts:93` `let byRules = derived.get(table);` via `rulesForDocument`
- **Criação:** `src/core/document/breakpoint-rules.ts:89` `const derived = new WeakMap<readonly ProjectBreakpoint[], WeakMap<ModelRules, ModelRules>>();`
- **Descarte:** fim-da-página `src/core/document/breakpoint-rules.ts:89` `const derived = new WeakMap<readonly ProjectBreakpoint[], WeakMap<ModelRules, ModelRules>>();`
- **Navegador:** não

## EST-L01-019 — os namespaces aceitos na captura (`NAMESPACES`)
- **Declaração:** `src/core/document/captured.ts:79` `const NAMESPACES = new Set([HTML_NAMESPACE, 'http://www.w3.org/2000/svg', 'http://www.w3.org/1998/Math/MathML']);`
- **Forma:** `Set<string>` constante, de topo de módulo; nunca muda depois da carga.
- **Valores possíveis:**
  - V1 o conjunto fixo com os namespaces HTML, SVG e MathML.
- **Escritores:**
  - `src/core/document/captured.ts:79` `const NAMESPACES = new Set([HTML_NAMESPACE, 'http://www.w3.org/2000/svg', 'http://www.w3.org/1998/Math/MathML']);` via a avaliação do módulo
- **Leitores:**
  - `src/core/document/captured.ts:177` `NAMESPACES.has(node.namespace)` via `capturedProblems`
- **Criação:** `src/core/document/captured.ts:79` `const NAMESPACES = new Set([HTML_NAMESPACE, 'http://www.w3.org/2000/svg', 'http://www.w3.org/1998/Math/MathML']);`
- **Descarte:** fim-da-página `src/core/document/captured.ts:79` `const NAMESPACES = new Set([HTML_NAMESPACE, 'http://www.w3.org/2000/svg', 'http://www.w3.org/1998/Math/MathML']);`
- **Navegador:** não

## EST-L01-020 — os atributos de endereço da captura (`URL_ATTRIBUTES`)
- **Declaração:** `src/core/document/captured.ts:80` `const URL_ATTRIBUTES = new Set(['href', 'src', 'action', 'formaction', 'poster', 'xlink:href', 'data', 'data-capture-paint']);`
- **Forma:** `Set<string>` constante, de topo de módulo; nunca muda depois da carga.
- **Valores possíveis:**
  - V1 o conjunto fixo dos nomes de atributo cujo valor é um endereço.
- **Escritores:**
  - `src/core/document/captured.ts:80` `const URL_ATTRIBUTES = new Set(['href', 'src', 'action', 'formaction', 'poster', 'xlink:href', 'data', 'data-capture-paint']);` via a avaliação do módulo
- **Leitores:**
  - `src/core/document/captured.ts:113` `URL_ATTRIBUTES.has(name) && unsafeAddress(attribute.value` via `unsafeCapturedAttribute`
- **Criação:** `src/core/document/captured.ts:80` `const URL_ATTRIBUTES = new Set(['href', 'src', 'action', 'formaction', 'poster', 'xlink:href', 'data', 'data-capture-paint']);`
- **Descarte:** fim-da-página `src/core/document/captured.ts:80` `const URL_ATTRIBUTES = new Set(['href', 'src', 'action', 'formaction', 'poster', 'xlink:href', 'data', 'data-capture-paint']);`
- **Navegador:** não

## EST-L01-021 — o índice de nós por árvore (`INDEX`)
- **Declaração:** `src/core/document/model.ts:302` `const INDEX = new WeakMap<DocNode, { readonly page: number; readonly at: ReadonlyMap<string, Location> }>();`
- **Forma:** `WeakMap<DocNode, { page; at }>`, de topo de módulo (cache de `locate`).
- **Valores possíveis:**
  - V1 sem a árvore: nada em cache.
  - V2 com a árvore: o mapa de id para `Location` daquela árvore, naquela página.
- **Escritores:**
  - `src/core/document/model.ts:312` `INDEX.set(tree, { page, at });` via `indexOf`
- **Leitores:**
  - `src/core/document/model.ts:304` `const held = INDEX.get(tree);` via `indexOf`
- **Criação:** `src/core/document/model.ts:302` `const INDEX = new WeakMap<DocNode, { readonly page: number; readonly at: ReadonlyMap<string, Location> }>();`
- **Descarte:** fim-da-página `src/core/document/model.ts:302` `const INDEX = new WeakMap<DocNode, { readonly page: number; readonly at: ReadonlyMap<string, Location> }>();`
- **Navegador:** não

## EST-L01-022 — os atributos do editor (`EDITOR_ATTRIBUTES`)
- **Declaração:** `src/core/document/validate.ts:500` `const EDITOR_ATTRIBUTES: ReadonlySet<string> = new Set(['data-node', 'data-container', 'data-hidden', 'data-empty-text', 'data-key-context', 'data-editor-style', 'data-node-style']);`
- **Forma:** `ReadonlySet<string>` constante, de topo de módulo; nunca muda depois da carga.
- **Valores possíveis:**
  - V1 o conjunto fixo dos nomes de atributo que pertencem ao editor.
- **Escritores:**
  - `src/core/document/validate.ts:500` `const EDITOR_ATTRIBUTES: ReadonlySet<string> = new Set(['data-node', 'data-container', 'data-hidden', 'data-empty-text', 'data-key-context', 'data-editor-style', 'data-node-style']);` via a avaliação do módulo
- **Leitores:**
  - `src/core/document/validate.ts:527` `if (EDITOR_ATTRIBUTES.has(name)) return 'an attribute of the editor';` via `customAttributeRefusal`
- **Criação:** `src/core/document/validate.ts:500` `const EDITOR_ATTRIBUTES: ReadonlySet<string> = new Set(['data-node', 'data-container', 'data-hidden', 'data-empty-text', 'data-key-context', 'data-editor-style', 'data-node-style']);`
- **Descarte:** fim-da-página `src/core/document/validate.ts:500` `const EDITOR_ATTRIBUTES: ReadonlySet<string> = new Set(['data-node', 'data-container', 'data-hidden', 'data-empty-text', 'data-key-context', 'data-editor-style', 'data-node-style']);`
- **Navegador:** não

## EST-L01-023 — os atributos de endereço de HTML (`ADDRESS_ATTRIBUTES`)
- **Declaração:** `src/core/document/validate.ts:518` `const ADDRESS_ATTRIBUTES: ReadonlySet<string> = new Set(['formaction', 'action', 'href', 'src', 'xlink:href', 'data', 'poster', 'background', 'ping', 'codebase', 'cite', 'longdesc', 'manifest', 'lowsrc', 'dynsrc']);`
- **Forma:** `ReadonlySet<string>` constante, de topo de módulo; nunca muda depois da carga.
- **Valores possíveis:**
  - V1 o conjunto fixo dos nomes de atributo cujo valor é um endereço.
- **Escritores:**
  - `src/core/document/validate.ts:518` `const ADDRESS_ATTRIBUTES: ReadonlySet<string> = new Set(['formaction', 'action', 'href', 'src', 'xlink:href', 'data', 'poster', 'background', 'ping', 'codebase', 'cite', 'longdesc', 'manifest', 'lowsrc', 'dynsrc']);` via a avaliação do módulo
- **Leitores:**
  - `src/core/document/validate.ts:521` `if (!ADDRESS_ATTRIBUTES.has(name) || value.trim() === '') return null;` via `customAttributeValueRefusal`
- **Criação:** `src/core/document/validate.ts:518` `const ADDRESS_ATTRIBUTES: ReadonlySet<string> = new Set(['formaction', 'action', 'href', 'src', 'xlink:href', 'data', 'poster', 'background', 'ping', 'codebase', 'cite', 'longdesc', 'manifest', 'lowsrc', 'dynsrc']);`
- **Descarte:** fim-da-página `src/core/document/validate.ts:518` `const ADDRESS_ATTRIBUTES: ReadonlySet<string> = new Set(['formaction', 'action', 'href', 'src', 'xlink:href', 'data', 'poster', 'background', 'ping', 'codebase', 'cite', 'longdesc', 'manifest', 'lowsrc', 'dynsrc']);`
- **Navegador:** não

## EST-L01-024 — os atributos de referência em lista (`IDREF_LISTS`)
- **Declaração:** `src/core/document/clone.ts:9` `const IDREF_LISTS = new Set(['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'headers']);`
- **Forma:** `Set<string>` constante, de topo de módulo; nunca muda depois da carga.
- **Valores possíveis:**
  - V1 o conjunto fixo dos atributos cujo valor é uma lista de ids.
- **Escritores:**
  - `src/core/document/clone.ts:9` `const IDREF_LISTS = new Set(['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'headers']);` via a avaliação do módulo
- **Leitores:**
  - `src/core/document/clone.ts:80` `IDREF_LISTS.has(name) ? value.split(/\s+/).map((part) => htmlIds.get(part) ?? part).join(' ') :` via `repair`
- **Criação:** `src/core/document/clone.ts:9` `const IDREF_LISTS = new Set(['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'headers']);`
- **Descarte:** fim-da-página `src/core/document/clone.ts:9` `const IDREF_LISTS = new Set(['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'headers']);`
- **Navegador:** não

## EST-L01-025 — os atributos de referência única (`IDREF_SINGLES`)
- **Declaração:** `src/core/document/clone.ts:10` `const IDREF_SINGLES = new Set(['aria-activedescendant', 'list']);`
- **Forma:** `Set<string>` constante, de topo de módulo; nunca muda depois da carga.
- **Valores possíveis:**
  - V1 o conjunto fixo dos atributos cujo valor é um só id.
- **Escritores:**
  - `src/core/document/clone.ts:10` `const IDREF_SINGLES = new Set(['aria-activedescendant', 'list']);` via a avaliação do módulo
- **Leitores:**
  - `src/core/document/clone.ts:81` `IDREF_SINGLES.has(name) ? (htmlIds.get(value) ?? value) : value,` via `repair`
- **Criação:** `src/core/document/clone.ts:10` `const IDREF_SINGLES = new Set(['aria-activedescendant', 'list']);`
- **Descarte:** fim-da-página `src/core/document/clone.ts:10` `const IDREF_SINGLES = new Set(['aria-activedescendant', 'list']);`
- **Navegador:** não

## EST-L01-026 — classe `PatchError`
- **Declaração:** `src/core/history/transaction.ts:35` `export class PatchError extends Error {`
- **Forma:** classe de erro, com o campo `name` (`src/core/history/transaction.ts:36` `override name = 'PatchError';`).
- **Valores possíveis:**
  - V1 uma instância que diz que um patch não cabe no documento (caminho, índice ou chave).
- **Escritores:**
  - `src/core/history/transaction.ts:72` `if (path.length === 0) throw new PatchError('a patch never replaces the whole document');` via `applyOne`
  - `src/core/history/transaction.ts:76` `if (!isContainer(at)) throw new PatchError(`no container at ${path.join('/')}`);` via `applyOne`
- **Leitores:**
  - `src/core/store/store.ts:509` `error instanceof Error ? (error.stack ?? error.message) : String(error)` via `run` (o `catch` que recebe o erro de `applyPatches`)
- **Criação:** `src/core/history/transaction.ts:35` `export class PatchError extends Error {`
- **Descarte:** fim-da-página `src/core/history/transaction.ts:35` `export class PatchError extends Error {`
- **Navegador:** não

## EST-L01-027 — as portas de navegador instaladas (`installed`)
- **Declaração:** `src/core/ports/browser.ts:22` `let installed: BrowserPorts | null = null;`
- **Forma:** `BrowserPorts | null`, de topo de módulo.
- **Valores possíveis:**
  - V1 `null`: nenhuma porta instalada; `browserPorts` lança.
  - V2 as portas instaladas: `installBrowserPorts` as escreve uma vez, no boot.
- **Escritores:**
  - `src/core/ports/browser.ts:25` `installed = ports;` via `installBrowserPorts`
- **Leitores:**
  - `src/core/ports/browser.ts:29` `if (installed === null) throw new Error('the browser ports are not installed (src/editor/browser-ports.ts)');` via `browserPorts`
  - `src/core/ports/browser.ts:30` `return installed;` via `browserPorts`
- **Criação:** `src/core/ports/browser.ts:22` `let installed: BrowserPorts | null = null;`
- **Descarte:** fim-da-página `src/core/ports/browser.ts:22` `let installed: BrowserPorts | null = null;`
- **Navegador:** não

## EST-L01-028 — o tempo do relógio manual (`manualClock`)
- **Declaração:** `src/core/ports/clock.ts:19` `let time = start;`
- **Forma:** `number`, fechado na fábrica `manualClock`; o relógio devolvido o lê e o move.
- **Valores possíveis:**
  - V1 igual a `start`: antes de qualquer `advance`.
  - V2 acrescido: cada `advance` soma `ms`.
- **Escritores:**
  - `src/core/ports/clock.ts:23` `time += ms;` via o `advance` do relógio
- **Leitores:**
  - `src/core/ports/clock.ts:21` `now: () => time,` via o `now` do relógio
- **Criação:** `src/core/ports/clock.ts:19` `let time = start;`
- **Descarte:** fim-da-página `src/core/ports/clock.ts:19` `let time = start;`
- **Navegador:** não

## EST-L01-029 — o contador do gerador sequencial (`sequentialIds`)
- **Declaração:** `src/core/ports/ids.ts:19` `let n = 0;`
- **Forma:** `number`, fechado na fábrica `sequentialIds`; o gerador devolvido o incrementa.
- **Valores possíveis:**
  - V1 `0`: antes do primeiro `next`.
  - V2 acrescido: cada `next` pré-incrementa e devolve `prefixo` mais o número.
- **Escritores:**
  - `src/core/ports/ids.ts:21` `next: () =>` via o `next` do gerador (pré-incrementa `n`)
- **Leitores:**
  - `src/core/ports/ids.ts:21` `next: () =>` via o `next` do gerador
- **Criação:** `src/core/ports/ids.ts:19` `let n = 0;`
- **Descarte:** fim-da-página `src/core/ports/ids.ts:19` `let n = 0;`
- **Navegador:** não

## EST-L01-030 — o documento da store do núcleo
- **Declaração:** `src/core/store/store.ts:28` `readonly document: DocumentJson;`
- **Forma:** `DocumentJson`, campo de `StoreState<Ui>` (`src/core/store/store.ts:27` `export interface StoreState<Ui> {`), mantido no `state` fechado em `createStore`.
- **Valores possíveis:**
  - V1 o documento do projeto no estado inicial (`src/core/store/store.ts:292` `{ document: options.initial.document, selection: options.initial.selection ?? [], history: EMPTY_HISTORY, message: options.initial.message ?? null, ui: options.initial.ui },`).
  - V2 o documento que os remendos do último comando produzem (`src/core/store/store.ts:536` `document: documentChanged ? applied.document : before.document,`).
  - V3 o documento de um projeto carregado, com o histórico zerado (`src/core/store/store.ts:489` `document: outcome.document, selection: [], history: EMPTY_HISTORY`).
  - V4 o documento de antes, devolvido pelo cancelamento de um gesto, de um grupo ou de uma sequência (`src/core/store/store.ts:750` `document: before.document, selection: before.selection, history: before.history`).
- **Escritores:**
  - `src/core/store/store.ts:536` `document: documentChanged ? applied.document : before.document,` via `run`
  - `src/core/store/store.ts:489` `document: outcome.document, selection: [], history: EMPTY_HISTORY` via `run`
  - `src/core/store/store.ts:619` `document: before.document, selection: before.selection, history: before.history` via o `cancel` do grupo
  - `src/core/store/store.ts:750` `document: before.document, selection: before.selection, history: before.history` via o `cancel` do gesto
  - `src/core/store/store.ts:678` `publish(commit(current.before, 'a cancelled command sequence'), current.inverses, false);` via o `cancel` da sequência
- **Leitores:**
  - `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` via `commit`
  - `src/core/store/store.ts:352` `const project = rulesForDocument(rules, state.document);` via `layeredNow`
  - `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` via `run`
  - `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` via `run`
  - `src/core/store/store.ts:523` `const selection = followed === null ? chosen : chosen.filter((node) => locate(applied.document, node) !== null);` via `run`
  - `src/core/store/store.ts:603` `getState: () => state,` via `createStore`
- **Criação:** `src/core/store/store.ts:291` `let state = commit(`
- **Descarte:** fim-da-página `src/core/store/store.ts:291` `let state = commit(`
- **Navegador:** não

## EST-L01-031 — a seleção da store do núcleo
- **Declaração:** `src/core/store/store.ts:29` `readonly selection: Selection;`
- **Forma:** `Selection`, a lista de ids de nós selecionados, campo de `StoreState<Ui>` (`src/core/store/store.ts:27` `export interface StoreState<Ui> {`).
- **Valores possíveis:**
  - V1 vazia: o estado inicial sem seleção, ou um projeto carregado (`src/core/store/store.ts:489` `document: outcome.document, selection: [], history: EMPTY_HISTORY`).
  - V2 a seleção que o resultado do comando declara, filtrada pelos nós que o documento ainda tem (`src/core/store/store.ts:523` `const selection = followed === null ? chosen : chosen.filter((node) => locate(applied.document, node) !== null);`).
  - V3 a seleção de antes, quando o comando não declara uma nova (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`).
  - V4 a seleção de antes, devolvida pelo cancelamento de um gesto ou de um grupo (`src/core/store/store.ts:619` `document: before.document, selection: before.selection, history: before.history`).
- **Escritores:**
  - `src/core/store/store.ts:537` `selection,` via `run`
  - `src/core/store/store.ts:523` `const selection = followed === null ? chosen : chosen.filter((node) => locate(applied.document, node) !== null);` via `run`
  - `src/core/store/store.ts:489` `document: outcome.document, selection: [], history: EMPTY_HISTORY` via `run`
  - `src/core/store/store.ts:619` `document: before.document, selection: before.selection, history: before.history` via o `cancel` do grupo
  - `src/core/store/store.ts:750` `document: before.document, selection: before.selection, history: before.history` via o `cancel` do gesto
- **Leitores:**
  - `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` via `commit`
  - `src/core/store/store.ts:305` `if (options.followSelection === undefined || deepEqual(before.selection, next.selection)) return next;` via `followSelection`
  - `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` via `run`
  - `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` via `run`
  - `src/core/store/store.ts:644` `selectionAfter: state.selection,` via o `commit` do grupo
  - `src/core/store/store.ts:738` `selectionAfter: state.selection,` via o `commit` do gesto
- **Criação:** `src/core/store/store.ts:292` `{ document: options.initial.document, selection: options.initial.selection ?? [], history: EMPTY_HISTORY, message: options.initial.message ?? null, ui: options.initial.ui },`
- **Descarte:** fim-da-página `src/core/store/store.ts:291` `let state = commit(`
- **Navegador:** não

## EST-L01-032 — o histórico da store do núcleo
- **Declaração:** `src/core/store/store.ts:30` `readonly history: HistoryState;`
- **Forma:** `HistoryState`, as listas `past` e `future` de `Transaction` (`src/core/store/store.ts:16` `import { EMPTY_HISTORY, LAST_CHANGE, record, redo, redone, undo, undone, type HistoryState, type Restorable } from '../history/history.ts';`).
- **Valores possíveis:**
  - V1 `EMPTY_HISTORY`: o estado inicial (`src/core/store/store.ts:292` `{ document: options.initial.document, selection: options.initial.selection ?? [], history: EMPTY_HISTORY, message: options.initial.message ?? null, ui: options.initial.ui },`) e todo projeto carregado (`src/core/store/store.ts:489` `document: outcome.document, selection: [], history: EMPTY_HISTORY`).
  - V2 com um passo a mais: cada comando desfazível que mudou o documento fora de um gesto (`src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);`).
  - V3 com os passos de um gesto ou de um grupo, registrados de uma vez no fim (`src/core/store/store.ts:745` `publish(commit({ ...state, history: record(before.history, tx, null) }, current.command));`).
- **Escritores:**
  - `src/core/store/store.ts:538` `history,` via `run`
  - `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` via `run`
  - `src/core/store/store.ts:489` `document: outcome.document, selection: [], history: EMPTY_HISTORY` via `run`
  - `src/core/store/store.ts:651` `const next = commit({ ...state, history: tx === null ? before.history : record(before.history, tx, null) }, current.command ?? 'a command group');` via o `commit` do grupo
  - `src/core/store/store.ts:745` `publish(commit({ ...state, history: record(before.history, tx, null) }, current.command));` via o `commit` do gesto
- **Leitores:**
  - `src/core/store/store.ts:477` `const tx = outcome.kind === 'undo' ? state.history.past.at(-1) : state.history.future.at(-1);` via `run`
  - `src/core/store/store.ts:478` `const restored: Restorable | null = (outcome.kind === 'undo' ? undo : redo)(state);` via `run`
  - `src/core/store/store.ts:479` `if (restored === null || tx === undefined) return { status: 'done', changed: false };` via `run`
  - `src/core/store/store.ts:481` `const action = tx.message ?? LAST_CHANGE;` via `run`
  - `src/core/store/store.ts:524` `let history = before.history;` via `run`
- **Criação:** `src/core/store/store.ts:292` `{ document: options.initial.document, selection: options.initial.selection ?? [], history: EMPTY_HISTORY, message: options.initial.message ?? null, ui: options.initial.ui },`
- **Descarte:** fim-da-página `src/core/store/store.ts:291` `let state = commit(`
- **Navegador:** não

## EST-L01-033 — a mensagem da barra de status
- **Declaração:** `src/core/store/store.ts:32` `readonly message: Message | null;`
- **Forma:** `Message | null`, com a chave e os parâmetros do texto; é o que a barra de status mostra na região `aria-live`.
- **Valores possíveis:**
  - V1 `null`: o estado inicial sem mensagem (`src/core/store/store.ts:292` `{ document: options.initial.document, selection: options.initial.selection ?? [], history: EMPTY_HISTORY, message: options.initial.message ?? null, ui: options.initial.ui },`); ou depois de um comando que não disse nada e veio de um estado recusado (`src/core/store/store.ts:540` `message: outcome.message ?? (before.refused === true ? null : before.message),`).
  - V2 a mensagem do comando que rodou (`src/core/store/store.ts:547` `const next: StoreState<Ui> = follows === undefined ? ran : { ...ran, ui: follows.ui,`).
  - V3 a mensagem de uma recusa: a violação de invariante no `commit` (`src/core/store/store.ts:279` `const kept: StoreState<Ui> = { ...state, message: breach, refused: true };`), a da confirmação cancelada (`src/core/store/store.ts:700` `publish(commit({ ...state, confirmation: null, message: message('status.confirmation.cancelled') }, waiting.command));`) e a de um aviso (`src/core/store/store.ts:705` `publish(commit({ ...state, message: text, refused: false }, 'a notice'));`).
  - V4 a mensagem que o editor põe ao seguir a seleção (`src/core/store/store.ts:308` `const followed = { ...next, ui, ...(said === undefined ? {} : { message: said }) };`).
- **Escritores:**
  - `src/core/store/store.ts:540` `message: outcome.message ?? (before.refused === true ? null : before.message),` via `run`
  - `src/core/store/store.ts:279` `const kept: StoreState<Ui> = { ...state, message: breach, refused: true };` via `commit`
  - `src/core/store/store.ts:547` `const next: StoreState<Ui> = follows === undefined ? ran : { ...ran, ui: follows.ui,` via `run`
  - `src/core/store/store.ts:308` `const followed = { ...next, ui, ...(said === undefined ? {} : { message: said }) };` via `followSelection`
  - `src/core/store/store.ts:705` `publish(commit({ ...state, message: text, refused: false }, 'a notice'));` via `notice`
  - `src/core/store/store.ts:700` `publish(commit({ ...state, confirmation: null, message: message('status.confirmation.cancelled') }, waiting.command));` via `answer`
- **Leitores:**
  - `src/core/store/store.ts:540` `message: outcome.message ?? (before.refused === true ? null : before.message),` via `run`
  - `src/core/store/store.ts:489` `message: outcome.message ?? (state.refused === true ? null : state.message)` via `run`
  - `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` via `run`
  - `src/core/store/store.ts:649` `message: state.message !== before.message ? state.message : null` via o `commit` do grupo
  - `src/core/store/store.ts:743` `message: state.message !== before.message ? state.message : null` via o `commit` do gesto
- **Criação:** `src/core/store/store.ts:292` `{ document: options.initial.document, selection: options.initial.selection ?? [], history: EMPTY_HISTORY, message: options.initial.message ?? null, ui: options.initial.ui },`
- **Descarte:** fim-da-página `src/core/store/store.ts:291` `let state = commit(`
- **Navegador:** não

## EST-L01-034 — a confirmação pendente da store do núcleo
- **Declaração:** `src/core/store/store.ts:35` `readonly confirmation?: PendingConfirmation | null;`
- **Forma:** `PendingConfirmation | null` (`command`, `args`, `message`, `params`, `confirm`, `cancel`), o despacho que espera a resposta da pessoa.
- **Valores possíveis:**
  - V1 ausente ou `null`: nenhuma confirmação espera (`src/core/store/store.ts:541` `confirmation: before.confirmation ?? null,`).
  - V2 a confirmação: o despacho parou em `outcome.kind === 'confirm'` e espera `answer` (`src/core/store/store.ts:467` `publish(commit({ ...state, confirmation }, id));`).
- **Escritores:**
  - `src/core/store/store.ts:467` `publish(commit({ ...state, confirmation }, id));` via `run`
  - `src/core/store/store.ts:541` `confirmation: before.confirmation ?? null,` via `run`
  - `src/core/store/store.ts:697` `publish(commit({ ...state, confirmation: null }, waiting.command));` via `answer`
  - `src/core/store/store.ts:619` `confirmation: before.confirmation ?? null` via o `cancel` do grupo
- **Leitores:**
  - `src/core/store/store.ts:611` `if (state.confirmation != null) throw new Error('a confirmation is waiting');` via `commandGroup`
  - `src/core/store/store.ts:693` `const waiting = state.confirmation ?? null;` via `answer`
- **Criação:** `src/core/store/store.ts:291` `let state = commit(`
- **Descarte:** `src/core/store/store.ts:697` `publish(commit({ ...state, confirmation: null }, waiting.command));` (a resposta apaga a confirmação)
- **Navegador:** não

## EST-L01-035 — a recusa do último comando
- **Declaração:** `src/core/store/store.ts:38` `readonly refusal?: Refusal | null;`
- **Forma:** `Refusal | null` (`command`, `args`, `message`), o comando que recusou com o que lhe foi pedido, para o controle que perguntou dizer a recusa ao lado de si.
- **Valores possíveis:**
  - V1 ausente ou `null`: nenhum comando recusou desde o último que rodou (`src/core/store/store.ts:542` `refusal: null,`).
  - V2 a recusa do tratador (`src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));`).
  - V3 a recusa do que segue a mudança, antes de o documento mudar (`src/core/store/store.ts:513` `publish(commit({ ...state, message: derived.refused, refusal: { command: id, args, message: derived.refused }, refused: true }, id));`).
- **Escritores:**
  - `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));` via `run`
  - `src/core/store/store.ts:513` `publish(commit({ ...state, message: derived.refused, refusal: { command: id, args, message: derived.refused }, refused: true }, id));` via `run`
  - `src/core/store/store.ts:484` `refusal: null, refused: false` via `run`
  - `src/core/store/store.ts:542` `refusal: null,` via `run`
- **Leitores:**
  - `src/editor/inspector/attribute-feedback.ts:11` `const found = state.refusal;` via `useSettingsRefusal`
- **Criação:** `src/core/store/store.ts:291` `let state = commit(`
- **Descarte:** `src/core/store/store.ts:542` `refusal: null,` (limpa a cada comando que roda)
- **Navegador:** não

## EST-L01-036 — o sinal de recusa da store do núcleo
- **Declaração:** `src/core/store/store.ts:42` `readonly refused?: boolean;`
- **Forma:** `boolean`, campo de `StoreState<Ui>`; diz se a mensagem é uma recusa, que o próximo comando substitui pela própria ou por nenhuma.
- **Valores possíveis:**
  - V1 ausente ou `false`: a mensagem não é uma recusa (`src/core/store/store.ts:543` `refused: false,`).
  - V2 `true`: a mensagem é uma recusa (`src/core/store/store.ts:279` `const kept: StoreState<Ui> = { ...state, message: breach, refused: true };`).
- **Escritores:**
  - `src/core/store/store.ts:279` `const kept: StoreState<Ui> = { ...state, message: breach, refused: true };` via `commit`
  - `src/core/store/store.ts:472` `refused: true }, id));` via `run`
  - `src/core/store/store.ts:543` `refused: false,` via `run`
  - `src/core/store/store.ts:705` `publish(commit({ ...state, message: text, refused: false }, 'a notice'));` via `notice`
- **Leitores:**
  - `src/core/store/store.ts:540` `message: outcome.message ?? (before.refused === true ? null : before.message),` via `run`
  - `src/core/store/store.ts:489` `message: outcome.message ?? (state.refused === true ? null : state.message)` via `run`
- **Criação:** `src/core/store/store.ts:291` `let state = commit(`
- **Descarte:** `src/core/store/store.ts:543` `refused: false,` (limpo a cada comando que roda)
- **Navegador:** não

## EST-L01-037 — o estado do editor na store do núcleo
- **Declaração:** `src/core/store/store.ts:43` `readonly ui: Ui;`
- **Forma:** `Ui`, opaco para a store do núcleo (`src/core/store/store.ts:6` `// The editor state (Ui) is opaque here: the editor's handlers own it.`), produzido pelos tratadores e pelos seguidores do editor.
- **Valores possíveis:**
  - V1 o estado inicial do editor (`src/core/store/store.ts:292` `{ document: options.initial.document, selection: options.initial.selection ?? [], history: EMPTY_HISTORY, message: options.initial.message ?? null, ui: options.initial.ui },`).
  - V2 o `ui` do resultado do comando, ou o de antes quando ele não declara um (`src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,`).
  - V3 o `ui` que segue uma seleção nova (`src/core/store/store.ts:308` `const followed = { ...next, ui, ...(said === undefined ? {} : { message: said }) };`) ou um comando que rodou (`src/core/store/store.ts:547` `const next: StoreState<Ui> = follows === undefined ? ran : { ...ran, ui: follows.ui,`).
- **Escritores:**
  - `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` via `run`
  - `src/core/store/store.ts:547` `const next: StoreState<Ui> = follows === undefined ? ran : { ...ran, ui: follows.ui,` via `run`
  - `src/core/store/store.ts:308` `const followed = { ...next, ui, ...(said === undefined ? {} : { message: said }) };` via `followSelection`
- **Leitores:**
  - `src/core/store/store.ts:307` `if (ui === next.ui && said === undefined) return next;` via `followSelection`
  - `src/core/store/store.ts:355` `const picked = at?.layer ?? options.layer?.(state);` via `layeredNow`
  - `src/core/store/store.ts:371` `const ui = state.ui;` via `handlerContext`
  - `src/core/store/store.ts:379` `words: (key, params) => options.words(ui, key, params),` via `handlerContext`
  - `src/core/store/store.ts:383` `(options.styleClass?.(ui) ?? null)` via `handlerContext`
  - `src/core/store/store.ts:384` `(options.keyframe?.(state) ?? null)` via `handlerContext`
  - `src/core/store/store.ts:385` `motion: options.motion?.(state) ?? null,` via `handlerContext`
- **Criação:** `src/core/store/store.ts:292` `{ document: options.initial.document, selection: options.initial.selection ?? [], history: EMPTY_HISTORY, message: options.initial.message ?? null, ui: options.initial.ui },`
- **Descarte:** fim-da-página `src/core/store/store.ts:291` `let state = commit(`
- **Navegador:** não

## Excluídos

### EXC-L01-001
- **Padrão:** P-E03
- **Ocorrência:** `src/core/document/breakpoint-rules.ts:35` `let previous = Infinity;`
- **Motivo:** variável local de `breakpointProblems`, que morre no fim da chamada; o escopo termina em `src/core/document/breakpoint-rules.ts:66` `return issues;`.

### EXC-L01-002
- **Padrão:** P-E03
- **Ocorrência:** `src/core/document/breakpoint-rules.ts:36` `let bases = 0;`
- **Motivo:** variável local de `breakpointProblems`, que morre no fim da chamada; o escopo termina em `src/core/document/breakpoint-rules.ts:66` `return issues;`.

### EXC-L01-003
- **Padrão:** P-E03
- **Ocorrência:** `src/core/document/breakpoint-rules.ts:73` `let byModel = outputs.get(table);`
- **Motivo:** variável local de `outputForTable`, que morre no fim da chamada; o escopo termina em `src/core/document/breakpoint-rules.ts:83` `return next;`. O estado que sobrevive é o cache `outputs` (EST-L01-017).

### EXC-L01-004
- **Padrão:** P-E03
- **Ocorrência:** `src/core/document/breakpoint-rules.ts:93` `let byRules = derived.get(table);`
- **Motivo:** variável local de `rulesForDocument`, que morre no fim da chamada; o escopo termina em `src/core/document/breakpoint-rules.ts:112` `return next;`. O estado que sobrevive é o cache `derived` (EST-L01-018).

### EXC-L01-005
- **Padrão:** P-E03
- **Ocorrência:** `src/core/document/breakpoints.ts:89` `let chosen = typed !== '' ? typed : named;`
- **Motivo:** variável local de `addedTable`, que morre no fim da chamada; o escopo termina em `src/core/document/breakpoints.ts:96` `return { table: [...table, added].sort((a, b) => (a.base ? -1 : b.base ? 1 : b.width - a.width)), added };`.

### EXC-L01-006
- **Padrão:** P-E03
- **Ocorrência:** `src/core/document/breakpoints.ts:92` `${width}`
- **Motivo:** variável local de `addedTable`, que morre no fim da chamada; o escopo termina em `src/core/document/breakpoints.ts:96` `return { table: [...table, added].sort((a, b) => (a.base ? -1 : b.base ? 1 : b.width - a.width)), added };`.

### EXC-L01-007
- **Padrão:** P-E03
- **Ocorrência:** `src/core/document/breakpoints.ts:124` `let used = false;`
- **Motivo:** variável local de `documentWithout`, que morre no fim da chamada; o escopo termina em `src/core/document/breakpoints.ts:172` `return used ? refuse('usedByMotion', {}) : { document: next };`.

### EXC-L01-008
- **Padrão:** P-E03
- **Ocorrência:** `src/core/document/migrations.ts:51` `let document = parsed as Record<string, unknown>;`
- **Motivo:** variável local de `migrateDocument`, que morre no fim da chamada; o escopo termina em `src/core/document/migrations.ts:59` `return { ok: true, document: document as unknown as DocumentJson };`.

### EXC-L01-009
- **Padrão:** P-E03
- **Ocorrência:** `src/core/document/migrations.ts:52` `let at = version;`
- **Motivo:** variável local de `migrateDocument`, que morre no fim da chamada; o escopo termina em `src/core/document/migrations.ts:59` `return { ok: true, document: document as unknown as DocumentJson };`.

### EXC-L01-010
- **Padrão:** P-E03
- **Ocorrência:** `src/core/history/transaction.ts:74` `let at: unknown = root;`
- **Motivo:** variável local de `applyOne`, que morre no fim da chamada; o escopo termina em `src/core/history/transaction.ts:130` `return { root: child, inverse };`.

### EXC-L01-011
- **Padrão:** P-E03
- **Ocorrência:** `src/core/history/transaction.ts:84` `let inverse: Patch | null;`
- **Motivo:** variável local de `applyOne`, que morre no fim da chamada; o escopo termina em `src/core/history/transaction.ts:130` `return { root: child, inverse };`.

### EXC-L01-012
- **Padrão:** P-E03
- **Ocorrência:** `src/core/history/transaction.ts:122` `let child: Container = next;`
- **Motivo:** variável local de `applyOne`, que morre no fim da chamada; o escopo termina em `src/core/history/transaction.ts:130` `return { root: child, inverse };`.

### EXC-L01-013
- **Padrão:** P-E03
- **Ocorrência:** `src/core/history/transaction.ts:142` `let root: unknown = document;`
- **Motivo:** variável local de `applyPatches`, que morre no fim da chamada; o escopo termina em `src/core/history/transaction.ts:152` `return { document: root as DocumentJson, applied, inverses };`.

### EXC-L01-014
- **Padrão:** P-E11
- **Ocorrência:** `src/core/document/captured.ts:22` `readonly scrollLeft?: number;`
- **Motivo:** campo do tipo `CapturedState` que guarda as posições de rolagem salvas num pacote de captura (JSON do documento), não uma leitura da rolagem do navegador em curso; `scrollLeft` e `scrollTop` aqui têm o tipo `number` opcional (`src/core/document/captured.ts:23` `readonly scrollTop?: number;`).

### EXC-L01-015
- **Padrão:** P-E11
- **Ocorrência:** `src/core/document/captured.ts:23` `readonly scrollTop?: number;`
- **Motivo:** campo do tipo `CapturedState` que guarda as posições de rolagem salvas num pacote de captura (JSON do documento), não uma leitura da rolagem do navegador em curso.

### EXC-L01-016
- **Padrão:** P-E11
- **Ocorrência:** `src/core/document/validate.ts:499` `// (data-node, data-container, data-hidden, data-key-context, contenteditable), which the page never carries.`
- **Motivo:** a palavra aparece num comentário que lista os nomes de atributo do editor; não é uso do estado do navegador. O comentário está entre `src/core/document/validate.ts:497` `// Why a name cannot be a custom attribute (feature element-attributes-aria), or null: an attribute name of HTML (a` e `src/core/document/validate.ts:500`.

### EXC-L01-017
- **Padrão:** P-E11
- **Ocorrência:** `src/core/document/validate.ts:506` `contenteditable: 'attribute.text.label',`
- **Motivo:** a palavra é a chave `contenteditable` de `RESERVED_OWNER`, um catálogo de chave de mensagem do atributo reservado, não uma leitura do estado do navegador; o objeto termina em `src/core/document/validate.ts:507` `};`.

# Estado — L02 (núcleo: clipboard, files, geometry, nodes, page, project, selection, structure, text)

## EST-L02-001 — urls, o cache dos object URLs dos arquivos do projeto

- **Declaração:** `src/core/files/files.ts:93` `const urls = new Map<string, { readonly bytes: string; readonly url: string }>();`
- **Forma:** `Map` de texto por texto — a chave é o caminho do arquivo no projeto, o valor guarda os bytes com que o desenho foi feito e o `object URL` criado para eles.
- **Valores possíveis:**
  - V1 vazio: o valor inicial do módulo; nenhum arquivo do projeto foi desenhado ainda (`src/core/files/files.ts:93` `const urls = new Map<string, { readonly bytes: string; readonly url: string }>();`).
  - V2 com uma entrada por caminho já desenhado, guardando os bytes e o URL daquela criação (`src/core/files/files.ts:99` `urls.set(file.path, { bytes: file.bytes, url });`).
  - V3 a entrada de um caminho trocada quando os bytes do arquivo mudam, com o URL anterior revogado antes (`src/core/files/files.ts:97` `if (held !== undefined) URL.revokeObjectURL(held.url);`); a entrada de um caminho desenhado com os mesmos bytes fica como está (`src/core/files/files.ts:96` `if (held !== undefined && held.bytes === file.bytes) return held.url;`).
- **Escritores:**
  - `src/core/files/files.ts:99` `urls.set(file.path, { bytes: file.bytes, url });` via `objectUrl`
- **Leitores:**
  - `src/core/files/files.ts:95` `const held = urls.get(file.path);` via `objectUrl`
- **Criação:** `src/core/files/files.ts:93` `const urls = new Map<string, { readonly bytes: string; readonly url: string }>();`
- **Descarte:** fim-da-página `src/core/files/files.ts:93` `const urls = new Map<string, { readonly bytes: string; readonly url: string }>();`
- **Navegador:** não

## EST-L02-002 — ZERO, o conjunto dos textos que valem zero

- **Declaração:** `src/core/geometry/anchors.ts:59` `const ZERO = new Set(['0', '0px']);`
- **Forma:** `Set` de textos — os textos que contam como uma distância zero (`0`, `0px`).
- **Valores possíveis:**
  - V1 o conjunto fixo com os dois textos `0` e `0px`; nenhum outro, porque o conjunto é criado uma vez e não é mutado depois (`src/core/geometry/anchors.ts:59` `const ZERO = new Set(['0', '0px']);`).
- **Escritores:**
  - `src/core/geometry/anchors.ts:59` `const ZERO = new Set(['0', '0px']);` via inicialização do módulo
- **Leitores:**
  - `src/core/geometry/anchors.ts:75` `ZERO.has(start) && ZERO.has(end)` via `anchorsOf` (a decisão das âncoras centrais)
- **Criação:** `src/core/geometry/anchors.ts:59` `const ZERO = new Set(['0', '0px']);`
- **Descarte:** fim-da-página `src/core/geometry/anchors.ts:59` `const ZERO = new Set(['0', '0px']);`
- **Navegador:** não

## EST-L02-003 — ArchiveError, o erro de leitura de um arquivo compactado

- **Declaração:** `src/core/project/zip.ts:137` `export class ArchiveError extends Error {`
- **Forma:** classe (`extends Error`) — a instância carrega o motivo da recusa e se ela é uma recusa por limite do arquivo. Os campos da instância são `reason` (um `ArchiveReason`) e `limit` (um booleano).
- **Valores possíveis:**
  - V1 instância com `limit` `false`: um arquivo quebrado, um caminho que sai da pasta, um método de compressão desconhecido, um tamanho ou um CRC-32 que não confere (`src/core/project/zip.ts:172` `new ArchiveError(reason('archive.unsupported', { path }))`).
  - V2 instância com `limit` `true`: entradas demais, uma entrada grande demais, o total grande demais, ou a razão de inflação acima do limite (`src/core/project/zip.ts:228` `if (count > limits.entries) throw new ArchiveError(reason('archive.tooManyEntries', { count: limits.entries }), true);`).
- **Escritores:**
  - `src/core/project/zip.ts:139` `readonly reason: ArchiveReason,` via o construtor
  - `src/core/project/zip.ts:140` `readonly limit = false,` via o construtor
- **Leitores:**
  - `src/core/project/zip.ts:202` `throw error instanceof ArchiveError ? error : damaged(path);` via `inflate`
  - `src/core/project/archive.ts:55` `error instanceof ArchiveError ? error.reason : message('archive.broken')` via `projectFileText`
- **Criação:** `src/core/project/zip.ts:172` `new ArchiveError(reason('archive.unsupported', { path }))`
- **Descarte:** fim-da-página `src/core/project/zip.ts:137` `export class ArchiveError extends Error {`
- **Navegador:** não

## EST-L02-004 — produced, o contador de bytes inflados no teste do leitor de arquivos compactados

- **Declaração:** `src/core/project/zip.test.ts:26` `let produced = 0;`
- **Forma:** número — quantos bytes o inflador do navegador entregou desde o último reinício do contador.
- **Valores possíveis:**
  - V1 `0`: o valor inicial do módulo e o valor de todo reinício feito por `countInflatedBytes` antes de instalar o embrulho (`src/core/project/zip.test.ts:29` `produced = 0;`).
  - V2 o total de bytes dos pedaços entregues pelo fluxo desde o reinício, somado a cada pedaço dentro do `TransformStream` que embrulha o `DecompressionStream` de verdade (`src/core/project/zip.test.ts:39` `produced += chunk.length;`).
- **Escritores:**
  - `src/core/project/zip.test.ts:29` `produced = 0;` via `countInflatedBytes`
  - `src/core/project/zip.test.ts:39` `produced += chunk.length;` via o `transform` do `TransformStream` que `countInflatedBytes` instala
- **Leitores:**
  - `src/core/project/zip.test.ts:80` `expect(produced).toBeGreaterThan(50 * 1024);`
  - `src/core/project/zip.test.ts:95` `expect(produced).toBe(0);`
- **Criação:** `src/core/project/zip.test.ts:26` `let produced = 0;`
- **Descarte:** fim-da-página `src/core/project/zip.test.ts:26` `let produced = 0;`
- **Navegador:** não

## Exclusões

### EXC-L02-001 — variável local de `fresh`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/clipboard/clipboard.ts:132` `let name = copied.name;`
- **Motivo:** variável local da função declarada em `src/core/clipboard/clipboard.ts:131` `function fresh(copied: Copied, ids: IdGenerator, taken: Set<string>, renamed: Map<string, NodeId>): DocNode {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-002 — variável local de `pasteCommand`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/clipboard/clipboard.ts:234` `let nodes: readonly DocNode[] | null = null;`
- **Motivo:** variável local da função declarada em `src/core/clipboard/clipboard.ts:214` `export const pasteCommand = registerHandler('clipboard.paste', (context, { clipboard }): Outcome<never> => {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-003 — variável local de `pasteCommand`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/clipboard/clipboard.ts:235` `let said: Message | null = null;`
- **Motivo:** variável local da função declarada em `src/core/clipboard/clipboard.ts:214` `export const pasteCommand = registerHandler('clipboard.paste', (context, { clipboard }): Outcome<never> => {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-004 — variável local de `uploadPath`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/files/files.ts:65` `let path =`
- **Motivo:** variável local da função declarada em `src/core/files/files.ts:62` `export function uploadPath(document: DocumentJson, folder: string, name: string): string {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-005 — variável local de `recordsFor`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/files/files.ts:130` `let held = document;`
- **Motivo:** variável local da função declarada em `src/core/files/files.ts:128` `export function recordsFor(document: DocumentJson, files: readonly UploadedFile[], folder: string | undefined): ProjectFile[] {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-006 — variável local de `readUploadFile`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/files/files.ts:163` `let binary = '';`
- **Motivo:** variável local da função declarada em `src/core/files/files.ts:160` `export async function readUploadFile(file: File): Promise<UploadedFile> {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-007 — variável local de `uniqueFilePath`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/files/files.ts:270` `let candidate = path;`
- **Motivo:** variável local da função declarada em `src/core/files/files.ts:266` `export function uniqueFilePath(document: DocumentJson, path: string, reserved: ReadonlySet<string> = new Set()): string {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-008 — variável local de `relativePath`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/files/files.ts:285` `let shared = 0;`
- **Motivo:** variável local da função declarada em `src/core/files/files.ts:281` `export function relativePath(fromFile: string, toPath: string): string {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-009 — variável local de `base64Of`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/files/files.ts:531` `let binary = '';`
- **Motivo:** variável local da função declarada em `src/core/files/files.ts:529` `function base64Of(text: string): string {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-010 — variável local de `followDeclaration`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/files/references.ts:65` `let next = followCssUrls(value, rewrite);`
- **Motivo:** variável local da função declarada em `src/core/files/references.ts:64` `function followDeclaration(property: string, value: string, rewrite: PathRewrite, families: FamilyRenames): string {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-011 — variável local de `followStyles`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/files/references.ts:79` `let changed = false;`
- **Motivo:** variável local da função declarada em `src/core/files/references.ts:78` `function followStyles(styles: Styles, rewrite: PathRewrite, families: FamilyRenames): Styles {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-012 — variável local de `followNode`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/files/references.ts:98` `let attributes = node.attributes;`
- **Motivo:** variável local da função declarada em `src/core/files/references.ts:97` `function followNode(node: DocNode, rewrite: PathRewrite, families: FamilyRenames, addresses?: ReadonlySet<string>): DocNode {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-013 — variável local de `rewriteSrcsetUrls`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/files/srcset.ts:6` `let at = 0;`
- **Motivo:** variável local da função declarada em `src/core/files/srcset.ts:3` `export function rewriteSrcsetUrls(value: string, rewrite: (url: string) => string): string {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-014 — variável local de `rewriteSrcsetUrls`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/files/srcset.ts:25` `let result = value;`
- **Motivo:** variável local da função declarada em `src/core/files/srcset.ts:3` `export function rewriteSrcsetUrls(value: string, rewrite: (url: string) => string): string {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-015 — variável local de `keptSrcset`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/files/srcset.ts:35` `let at = 0;`
- **Motivo:** variável local da função declarada em `src/core/files/srcset.ts:32` `export function keptSrcset(value: string, keep: (url: string) => boolean): string {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-016 — variável local de `distributeCommand`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/geometry/align.ts:108` `let next = first.start;`
- **Motivo:** variável local da função declarada em `src/core/geometry/align.ts:91` `export const distributeCommand = registerHandler('position.distribute', (context, { axis }) => {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-017 — variável local de `movePositionedCommand`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/geometry/position.ts:114` `let shown = { x: 0, y: 0 };`
- **Motivo:** variável local da função declarada em `src/core/geometry/position.ts:106` `export const movePositionedCommand = registerHandler('position.move', (context, { dx, dy }) => {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-018 — variável local de `resizedBox`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/geometry/resize.ts:105` `let width = from.width + (east ? dx : west ? -dx : 0) * times;`
- **Motivo:** variável local da função declarada em `src/core/geometry/resize.ts:95` `export function resizedBox(from: ResizeFrom, handle: string, dx: number, dy: number, keys: { readonly aspect: boolean; readonly centre: boolean }, min: number): Record<string, string | undefined> {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-019 — variável local de `resizedBox`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/geometry/resize.ts:106` `let height = from.height + (south ? dy : north ? -dy : 0) * times;`
- **Motivo:** variável local da função declarada em `src/core/geometry/resize.ts:95` `export function resizedBox(from: ResizeFrom, handle: string, dx: number, dy: number, keys: { readonly aspect: boolean; readonly centre: boolean }, min: number): Record<string, string | undefined> {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-020 — variável local de `snapAxis`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/geometry/snap.ts:40` `let best: { readonly tier: number; readonly gap: number; readonly snap: Snap } | null = null;`
- **Motivo:** variável local da função declarada em `src/core/geometry/snap.ts:39` `export function snapAxis(edges: readonly number[], lines: readonly SnapLine[], distance: number): Snap | null {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-021 — variável local de `equalGap`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/geometry/snap.ts:110` `let best: EqualGap | null = null;`
- **Motivo:** variável local da função declarada em `src/core/geometry/snap.ts:100` `export function equalGap(axis: SnapAxis, moved: Box, siblings: readonly Box[], radius: number, overlap: number): EqualGap | null {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-022 — variável local de `nextGuideId`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/page/guides.ts:33` `let n = 1;`
- **Motivo:** variável local da função declarada em `src/core/page/guides.ts:31` `function nextGuideId(document: DocumentJson, axis: Guide['axis'], page: number): string {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-023 — variável local de `openProject`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/project/archive.ts:64` `let parsed: unknown;`
- **Motivo:** variável local da função declarada em `src/core/project/archive.ts:63` `export const openProject = registerHandler('project.open', ({ rules, state, confirmed }, args) => {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-024 — variável local de `crc32`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/project/zip.ts:25` `let c = 0xffffffff;`
- **Motivo:** variável local da função declarada em `src/core/project/zip.ts:24` `export function crc32(bytes: Uint8Array): number {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-025 — variável local de `zip`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/project/zip.ts:49` `let offset = 0;`
- **Motivo:** variável local da função declarada em `src/core/project/zip.ts:44` `export function zip(entries: readonly ZipEntry[], modified: number): Uint8Array {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-026 — variável local de `zip`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/project/zip.ts:96` `let at = 0;`
- **Motivo:** variável local da função declarada em `src/core/project/zip.ts:44` `export function zip(entries: readonly ZipEntry[], modified: number): Uint8Array {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-027 — variável local de `inflate`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/project/zip.ts:187` `let length = 0;`
- **Motivo:** variável local da função declarada em `src/core/project/zip.ts:184` `async function inflate(raw: Uint8Array, path: string, declared: number): Promise<Uint8Array> {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-028 — variável local de `inflate`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/project/zip.ts:205` `let at = 0;`
- **Motivo:** variável local da função declarada em `src/core/project/zip.ts:184` `async function inflate(raw: Uint8Array, path: string, declared: number): Promise<Uint8Array> {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-029 — variável local de `unzip`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/project/zip.ts:219` `let end = -1;`
- **Motivo:** variável local da função declarada em `src/core/project/zip.ts:217` `export async function unzip(bytes: Uint8Array, limits: ArchiveLimits = ARCHIVE_LIMITS): Promise<Map<string, Uint8Array>> {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-030 — variável local de `unzip`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/project/zip.ts:232` `let total = 0;`
- **Motivo:** variável local da função declarada em `src/core/project/zip.ts:217` `export async function unzip(bytes: Uint8Array, limits: ArchiveLimits = ARCHIVE_LIMITS): Promise<Map<string, Uint8Array>> {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-031 — variável local de `unzip`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/project/zip.ts:233` `let at = view.getUint32(end + 16, true);`
- **Motivo:** variável local da função declarada em `src/core/project/zip.ts:217` `export async function unzip(bytes: Uint8Array, limits: ArchiveLimits = ARCHIVE_LIMITS): Promise<Map<string, Uint8Array>> {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-032 — variável local de `marqueeCommand`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/selection/selection.ts:82` `let scope: DocNode;`
- **Motivo:** variável local da função declarada em `src/core/selection/selection.ts:75` `export const marqueeCommand = registerHandler('selection.marquee', ({ state, layout, rules }, { rect, mode, leaves, target }) => {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-033 — variável local de `marqueeCommand`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/selection/selection.ts:100` `let skipped = 0;`
- **Motivo:** variável local da função declarada em `src/core/selection/selection.ts:75` `export const marqueeCommand = registerHandler('selection.marquee', ({ state, layout, rules }, { rect, mode, leaves, target }) => {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-034 — variável local de `copyName`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/structure/duplicate.ts:30` `let n = numbered ? Number(tail) + 1 : 2;`
- **Motivo:** variável local da função declarada em `src/core/structure/duplicate.ts:25` `export function copyName(name: string, taken: ReadonlySet<string>): string {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-035 — variável local de `uniqueName`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/structure/insert.ts:31` `let n = 2;`
- **Motivo:** variável local da função declarada em `src/core/structure/insert.ts:27` `export function uniqueName(document: DocumentJson, base: string): string {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-036 — variável local de `moveSelectionTo`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/structure/move.ts:109` `let document = state.document;`
- **Motivo:** variável local da função declarada em `src/core/structure/move.ts:78` `export function moveSelectionTo(`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-037 — variável local de `freshName`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/structure/node-maker.ts:23` `let name = base;`
- **Motivo:** variável local da função declarada em `src/core/structure/node-maker.ts:22` `export function freshName(make: NodeMaker, base: string): string {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-038 — variável local de `wrapBesideCommand`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/structure/wrap.ts:256` `let document = state.document;`
- **Motivo:** variável local da função declarada em `src/core/structure/wrap.ts:235` `export const wrapBesideCommand = registerHandler('element.wrapBeside', ({ state, ids, rules, words }, { target, side, wrapper: kind, entry }): Outcome<never> => {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-039 — variável local de `withText`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/text/inline.ts:120` `let start = 0;`
- **Motivo:** variável local da função declarada em `src/core/text/inline.ts:117` `export function withText(runs: readonly InlineRun[], text: string): InlineRun[] {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-040 — variável local de `withText`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/text/inline.ts:122` `let end = 0;`
- **Motivo:** variável local da função declarada em `src/core/text/inline.ts:117` `export function withText(runs: readonly InlineRun[], text: string): InlineRun[] {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-041 — variável local de `parseInline`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/text/inline.ts:131` `let unsafe = false;`
- **Motivo:** variável local da função declarada em `src/core/text/inline.ts:129` `export function parseInline(value: unknown): InlineRun[] | 'unsafe' | null {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-042 — variável local de `wordAt`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/text/inline.ts:160` `let start = offset;`
- **Motivo:** variável local da função declarada em `src/core/text/inline.ts:158` `export function wordAt(text: string, offset: number): TextRange | null {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-043 — variável local de `wordAt`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/text/inline.ts:161` `let end = offset;`
- **Motivo:** variável local da função declarada em `src/core/text/inline.ts:158` `export function wordAt(text: string, offset: number): TextRange | null {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-044 — variável local de `split`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/text/inline.ts:172` `let at = 0;`
- **Motivo:** variável local da função declarada em `src/core/text/inline.ts:168` `function split(segments: readonly Segment[], range: TextRange): { before: Segment[]; inside: Segment[]; after: Segment[] } {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-045 — variável local de `marksAt`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/text/inline.ts:187` `let at = 0;`
- **Motivo:** variável local da função declarada em `src/core/text/inline.ts:186` `function marksAt(segments: readonly Segment[], index: number): Omit<Segment, 'text'> | null {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-046 — variável local de `linkAt`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/text/inline.ts:199` `let at = 0;`
- **Motivo:** variável local da função declarada em `src/core/text/inline.ts:196` `function linkAt(segments: readonly Segment[], offset: number): TextRange | null {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-047 — variável local de `linkAt`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/text/inline.ts:200` `let found: TextRange | null = null;`
- **Motivo:** variável local da função declarada em `src/core/text/inline.ts:196` `function linkAt(segments: readonly Segment[], offset: number): TextRange | null {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-048 — variável local de `applyInlineChange`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/text/inline.ts:257` `let inside: Segment[];`
- **Motivo:** variável local da função declarada em `src/core/text/inline.ts:238` `export function applyInlineChange(runs: readonly InlineRun[], range: TextRange, change: InlineChange): { runs: InlineRun[]; range: TextRange } {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-049 — variável local de `htmlSegments`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/text/inline.ts:313` `let lineStart = true;`
- **Motivo:** variável local da função declarada em `src/core/text/inline.ts:279` `function htmlSegments(nodes: readonly ClipboardNode[], model: ContentModel): Segment[] {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

### EXC-L02-050 — variável local de `htmlSegments`

- **Padrão:** P-E03
- **Ocorrência:** `src/core/text/inline.ts:314` `let pendingBreaks = 0;`
- **Motivo:** variável local da função declarada em `src/core/text/inline.ts:279` `function htmlSegments(nodes: readonly ClipboardNode[], model: ContentModel): Segment[] {`; o valor nasce e é lido dentro da chamada e não sobrevive a ela.

# L03 — estado de `src/core/style/`, `src/core/design/`, `src/core/elements/`, `src/core/forms/`

Arquivos do lote L03 (89 arquivos de `src/core/style/`, `design/`, `elements/`, `forms/`).

Os itens abaixo são as coleções de topo e a variável mutável de módulo que os arquivos levantam e leem. As exceções são as variáveis locais curtas de função que morrem no fim da chamada.

## EST-L03-001 — `REFERENCE_ATTRIBUTES` (atributos que seguram uma referência)
- **Declaração:** `src/core/elements/references.ts:50` `let REFERENCE_ATTRIBUTES = new Map<string, string>();`
- **Forma:** `Map<string, string>` — id de atributo do manifesto para o nome HTML do atributo (`for` ou `href`).
- **Valores possíveis:**
  - V1 vazio: no boot, antes de `setReferenceAttributes` ser chamado, e enquanto nenhuma entrada o preenche.
  - V2 preenchido: o mapa com os atributos de referência que o manifesto declara, depois de `setReferenceAttributes`.
- **Escritores:**
  - `src/core/elements/references.ts:50` `let REFERENCE_ATTRIBUTES = new Map<string, string>();` via avaliação do módulo (boot).
  - `src/core/elements/references.ts:66` `REFERENCE_ATTRIBUTES = new Map(entries.filter((entry) => entry.html !== null && REFERENCE_HTM.includes(entry.html)).map((entry) => [entry.id, entry.html as string]));` via `setReferenceAttributes`.
- **Leitores:**
  - `src/core/elements/references.ts:39` `const html = REFERENCE_ATTRIBUTES.get(attribute);` via `referencesOf`.
  - `src/core/elements/references.ts:55` `return REFERENCE_ATTRIBUTES.get(attribute);` via `referenceHtmlOf`.
  - `src/core/elements/references.ts:77` `if (REFERENCE_ATTRIBUTES.size === 0) return [];` via `orphanReferences`.
- **Criação:** `src/core/elements/references.ts:50` `let REFERENCE_ATTRIBUTES = new Map<string, string>();`
- **Descarte:** fim-da-página `src/core/elements/references.ts:50` `let REFERENCE_ATTRIBUTES = new Map<string, string>();`
- **Navegador:** não

## EST-L03-002 — `CONTROLS` (tipos que podem ser alvo de um rótulo)
- **Declaração:** `src/core/elements/inputs.ts:153` `const CONTROLS = new Set(['input', 'textarea', 'select', 'button', 'meter', 'progress', 'output']);`
- **Forma:** `Set<string>` — os tipos de elemento que um `label` aponta.
- **Valores possíveis:**
  - V1 o conjunto fixo com os sete tipos de controle.
- **Escritores:**
  - `src/core/elements/inputs.ts:153` `const CONTROLS = new Set(['input', 'textarea', 'select', 'button', 'meter', 'progress', 'output']);` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/elements/inputs.ts:136` `if (!CONTROLS.has(target.node.type)) return { kind: 'refused', message: message('status.label.notControl', { name: target.node.name }) };` via `setLabelTargetCommand`.
  - `src/core/elements/inputs.ts:156` `return [...allNodes(document)].filter((node) => CONTROLS.has(node.type));` via `formControls`.
- **Criação:** `src/core/elements/inputs.ts:153` `const CONTROLS = new Set(['input', 'textarea', 'select', 'button', 'meter', 'progress', 'output']);`
- **Descarte:** fim-da-página `src/core/elements/inputs.ts:153` `const CONTROLS = new Set(['input', 'textarea', 'select', 'button', 'meter', 'progress', 'output']);`
- **Navegador:** não

## EST-L03-003 — `VALUE_CONTROLS` (controles com valor editado no inspector)
- **Declaração:** `src/core/elements/inputs.ts:161` `const VALUE_CONTROLS = new Set(['input', 'textarea', 'select']);`
- **Forma:** `Set<string>` — os tipos cujo valor é editado no inspector, nunca no canvas.
- **Valores possíveis:**
  - V1 o conjunto fixo com input, textarea e select.
- **Escritores:**
  - `src/core/elements/inputs.ts:161` `const VALUE_CONTROLS = new Set(['input', 'textarea', 'select']);` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/elements/inputs.ts:164` `return found !== null && VALUE_CONTROLS.has(found.node.type);` via `isValueControl`.
- **Criação:** `src/core/elements/inputs.ts:161` `const VALUE_CONTROLS = new Set(['input', 'textarea', 'select']);`
- **Descarte:** fim-da-página `src/core/elements/inputs.ts:161` `const VALUE_CONTROLS = new Set(['input', 'textarea', 'select']);`
- **Navegador:** não

## EST-L03-004 — `SVG_ELEMENTS` (elementos que a marcação de um SVG guarda)
- **Declaração:** `src/core/elements/svg.ts:40` `const SVG_ELEMENTS = new Set(`
- **Forma:** `Set<string>` — os nomes de elemento de SVG em minúsculas, os que a marcação conserva.
- **Valores possíveis:**
  - V1 o conjunto fixo dos nomes de elemento de SVG (o índice de elementos do SVG 2, os primitivos de filtro e os de animação), em minúsculas.
- **Escritores:**
  - `src/core/elements/svg.ts:40` `const SVG_ELEMENTS = new Set(` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/elements/svg.ts:173` `if (dropping === 0 && !SVG_ELEMENTS.has(name.toLowerCase())) {` via `sanitizedSvgMarkup`.
- **Criação:** `src/core/elements/svg.ts:40` `const SVG_ELEMENTS = new Set(`
- **Descarte:** fim-da-página `src/core/elements/svg.ts:40` `const SVG_ELEMENTS = new Set(`
- **Navegador:** não

## EST-L03-005 — `LINK_ATTRIBUTES` (atributos de endereço de um SVG)
- **Declaração:** `src/core/elements/svg.ts:52` `const LINK_ATTRIBUTES = new Set(['href', 'xlink:href']);`
- **Forma:** `Set<string>` — os atributos que seguram um endereço.
- **Valores possíveis:**
  - V1 o conjunto fixo com `href` e `xlink:href`.
- **Escritores:**
  - `src/core/elements/svg.ts:52` `const LINK_ATTRIBUTES = new Set(['href', 'xlink:href']);` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/elements/svg.ts:168` `if (lower.startsWith('on') || ((LINK_ATTRIBUTES.has(lower) || ANIMATED_VALUES.has(lower)) && scripted(value))) continue;` via `sanitizedSvgMarkup`.
- **Criação:** `src/core/elements/svg.ts:52` `const LINK_ATTRIBUTES = new Set(['href', 'xlink:href']);`
- **Descarte:** fim-da-página `src/core/elements/svg.ts:52` `const LINK_ATTRIBUTES = new Set(['href', 'xlink:href']);`
- **Navegador:** não

## EST-L03-006 — `ANIMATED_VALUES` (atributos que escrevem um valor ao tocar)
- **Declaração:** `src/core/elements/svg.ts:55` `const ANIMATED_VALUES = new Set(['to', 'from', 'values', 'by']);`
- **Forma:** `Set<string>` — os atributos de um elemento de animação que escrevem um valor em tempo de execução.
- **Valores possíveis:**
  - V1 o conjunto fixo com `to`, `from`, `values` e `by`.
- **Escritores:**
  - `src/core/elements/svg.ts:55` `const ANIMATED_VALUES = new Set(['to', 'from', 'values', 'by']);` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/elements/svg.ts:168` `if (lower.startsWith('on') || ((LINK_ATTRIBUTES.has(lower) || ANIMATED_VALUES.has(lower)) && scripted(value))) continue;` via `sanitizedSvgMarkup`.
- **Criação:** `src/core/elements/svg.ts:55` `const ANIMATED_VALUES = new Set(['to', 'from', 'values', 'by']);`
- **Descarte:** fim-da-página `src/core/elements/svg.ts:55` `const ANIMATED_VALUES = new Set(['to', 'from', 'values', 'by']);`
- **Navegador:** não

## EST-L03-007 — `SANITIZED` (memória da última marcação de SVG lida)
- **Declaração:** `src/core/elements/svg.ts:212` `const SANITIZED = new Map<string, string>();`
- **Forma:** `Map<string, string>` — a marcação guardada por um nó para a marcação segura que o saneador devolve.
- **Valores possíveis:**
  - V1 vazio: no boot, e depois de ultrapassar duzentas entradas (o mapa é esvaziado).
  - V2 com uma entrada por marcação distinta já perguntada, até duzentas.
  - V3 em curso: entre o `get` que erra e o `set` que grava a marcação recém-saneada.
- **Escritores:**
  - `src/core/elements/svg.ts:221` `SANITIZED.set(held, safe);` via `svgMarkupOf`.
  - `src/core/elements/svg.ts:220` `if (SANITIZED.size > 200) SANITIZED.clear();` via `svgMarkupOf`.
- **Leitores:**
  - `src/core/elements/svg.ts:216` `const known = SANITIZED.get(held);` via `svgMarkupOf`.
- **Criação:** `src/core/elements/svg.ts:212` `const SANITIZED = new Map<string, string>();`
- **Descarte:** fim-da-página `src/core/elements/svg.ts:212` `const SANITIZED = new Map<string, string>();`
- **Navegador:** não

## EST-L03-008 — `GROUPS` (grupos de uma tabela)
- **Declaração:** `src/core/elements/table.ts:30` `const GROUPS = new Set([HEAD, BODY, FOOT]);`
- **Forma:** `Set<string>` — os tipos de elemento que são grupo de uma tabela.
- **Valores possíveis:**
  - V1 o conjunto fixo com cabeça, corpo e pé de tabela.
- **Escritores:**
  - `src/core/elements/table.ts:30` `const GROUPS = new Set([HEAD, BODY, FOOT]);` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/elements/table.ts:67` `if (cell === null || row === null || group === null || table === null || !GROUPS.has(group.node.type) || table.node.type !== TABLE) return null;` via `selectedCell`.
  - `src/core/elements/table.ts:83` `return table.node.children.flatMap((group, groupIndex) => (GROUPS.has(group.type) ? group.children.map((row, rowIndex) => ({ group, groupIndex, row, rowIndex })) : []));` via `rowsOf`.
- **Criação:** `src/core/elements/table.ts:30` `const GROUPS = new Set([HEAD, BODY, FOOT]);`
- **Descarte:** fim-da-página `src/core/elements/table.ts:30` `const GROUPS = new Set([HEAD, BODY, FOOT]);`
- **Navegador:** não

## EST-L03-009 — `CELLS` (células de uma tabela)
- **Declaração:** `src/core/elements/table.ts:31` `const CELLS = new Set([HEADER_CELL, CELL]);`
- **Forma:** `Set<string>` — os tipos de elemento que são célula de uma tabela.
- **Valores possíveis:**
  - V1 o conjunto fixo com célula de cabeçalho e célula.
- **Escritores:**
  - `src/core/elements/table.ts:31` `const CELLS = new Set([HEADER_CELL, CELL]);` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/elements/table.ts:63` `const cell = upTo(state.document, only, CELLS);` via `selectedCell`.
- **Criação:** `src/core/elements/table.ts:31` `const CELLS = new Set([HEADER_CELL, CELL]);`
- **Descarte:** fim-da-página `src/core/elements/table.ts:31` `const CELLS = new Set([HEADER_CELL, CELL]);`
- **Navegador:** não

## EST-L03-010 — `KIND_PREDICATES` (predicados que nomeiam um tipo de elemento)
- **Declaração:** `src/core/style/applies.ts:41` `const KIND_PREDICATES: ReadonlySet<string> = new Set(Object.keys(KINDS));`
- **Forma:** `ReadonlySet<string>` — os nomes dos predicados que um campo de tipo lê, tirados das chaves de `KINDS`.
- **Valores possíveis:**
  - V1 o conjunto fixo com os sete nomes de `KINDS` (table, tableOrCaption, list, media, textarea, formControl, textInput).
- **Escritores:**
  - `src/core/style/applies.ts:41` `const KIND_PREDICATES: ReadonlySet<string> = new Set(Object.keys(KINDS));` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/style/applies.ts:150` `const KIND_FILTERS: ReadonlySet<string> = new Set([...KIND_PREDICATES, 'hasBox', SVG_SHAPE]);` via `kindsOf` (monta os filtros de tipo).
- **Criação:** `src/core/style/applies.ts:41` `const KIND_PREDICATES: ReadonlySet<string> = new Set(Object.keys(KINDS));`
- **Descarte:** fim-da-página `src/core/style/applies.ts:41` `const KIND_PREDICATES: ReadonlySet<string> = new Set(Object.keys(KINDS));`
- **Navegador:** não

## EST-L03-011 — `KIND_FILTERS` (predicados que decidem o tipo de um campo)
- **Declaração:** `src/core/style/applies.ts:150` `const KIND_FILTERS: ReadonlySet<string> = new Set([...KIND_PREDICATES, 'hasBox', SVG_SHAPE]);`
- **Forma:** `ReadonlySet<string>` — os predicados de tipo, os nomes de `KIND_PREDICATES` mais `hasBox` e `svgShape`.
- **Valores possíveis:**
  - V1 o conjunto fixo com os nove nomes de predicado de tipo.
- **Escritores:**
  - `src/core/style/applies.ts:150` `const KIND_FILTERS: ReadonlySet<string> = new Set([...KIND_PREDICATES, 'hasBox', SVG_SHAPE]);` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/style/applies.ts:155` `return [...KIND_FILTERS].filter((kind) => nodes.every((node) => elementPredicate(kind, node, rules) === true));` via `kindsOf`.
  - `src/core/style/applies.ts:163` `return predicate === null || !KIND_FILTERS.has(predicate) || kinds.includes(predicate);` via `shownForKinds`.
- **Criação:** `src/core/style/applies.ts:150` `const KIND_FILTERS: ReadonlySet<string> = new Set([...KIND_PREDICATES, 'hasBox', SVG_SHAPE]);`
- **Descarte:** fim-da-página `src/core/style/applies.ts:150` `const KIND_FILTERS: ReadonlySet<string> = new Set([...KIND_PREDICATES, 'hasBox', SVG_SHAPE]);`
- **Navegador:** não

## EST-L03-012 — `CONDITIONS` (condições registradas de um acoplamento)
- **Declaração:** `src/core/style/couplings.ts:52` `const CONDITIONS: ReadonlyMap<string, RegisteredCondition> = new Map([valueIn, alwaysHolds, parentValueIn].map((c) => [c.id, c]));`
- **Forma:** `ReadonlyMap<string, RegisteredCondition>` — o id de cada condição para a condição registrada.
- **Valores possíveis:**
  - V1 o conjunto fixo com três condições registradas por `registerCondition` (valueIn, always, parentValueIn).
- **Escritores:**
  - `src/core/style/couplings.ts:52` `const CONDITIONS: ReadonlyMap<string, RegisteredCondition> = new Map([valueIn, alwaysHolds, parentValueIn].map((c) => [c.id, c]));` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/style/couplings.ts:89` `const condition = CONDITIONS.get(c.condition.predicate);` via `coupledScene`.
- **Criação:** `src/core/style/couplings.ts:52` `const CONDITIONS: ReadonlyMap<string, RegisteredCondition> = new Map([valueIn, alwaysHolds, parentValueIn].map((c) => [c.id, c]));`
- **Descarte:** fim-da-página `src/core/style/couplings.ts:52` `const CONDITIONS: ReadonlyMap<string, RegisteredCondition> = new Map([valueIn, alwaysHolds, parentValueIn].map((c) => [c.id, c]));`
- **Navegador:** não

## EST-L03-013 — `ACTIONS` (ações registradas de um acoplamento)
- **Declaração:** `src/core/style/couplings.ts:53` `const ACTIONS: ReadonlyMap<string, RegisteredAction> = new Map([setValue, swapWith, mirror, setParentValue, keepVisualPlace].map((a) => [a.id, a]));`
- **Forma:** `ReadonlyMap<string, RegisteredAction>` — o id de cada ação para a ação registrada.
- **Valores possíveis:**
  - V1 o conjunto fixo com cinco ações registradas por `registerAction` (setValue, swapWith, mirror, setParentValue, keepVisualPlace).
- **Escritores:**
  - `src/core/style/couplings.ts:53` `const ACTIONS: ReadonlyMap<string, RegisteredAction> = new Map([setValue, swapWith, mirror, setParentValue, keepVisualPlace].map((a) => [a.id, a]));` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/style/couplings.ts:90` `const action = ACTIONS.get(c.effect.action);` via `coupledScene`.
- **Criação:** `src/core/style/couplings.ts:53` `const ACTIONS: ReadonlyMap<string, RegisteredAction> = new Map([setValue, swapWith, mirror, setParentValue, keepVisualPlace].map((a) => [a.id, a]));`
- **Descarte:** fim-da-página `src/core/style/couplings.ts:53` `const ACTIONS: ReadonlyMap<string, RegisteredAction> = new Map([setValue, swapWith, mirror, setParentValue, keepVisualPlace].map((a) => [a.id, a]));`
- **Navegador:** não

## EST-L03-014 — `WORDS` (palavras que são palavra-chave de CSS)
- **Declaração:** `src/core/style/keyword-words.ts:11` `const WORDS = new Set(KEYWORD_WORDS);`
- **Forma:** `Set<string>` — as palavras-chave de CSS que o reconhecedor aceita.
- **Valores possíveis:**
  - V1 o conjunto fixo tirado de `KEYWORD_WORDS`.
- **Escritores:**
  - `src/core/style/keyword-words.ts:11` `const WORDS = new Set(KEYWORD_WORDS);` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/style/keyword-words.ts:22` `return keywords.find((keyword) => WORDS.has(keyword) && folded(words(keywordKey(keyword))) === wanted) ?? null;` via `keywordOfWord`.
- **Criação:** `src/core/style/keyword-words.ts:11` `const WORDS = new Set(KEYWORD_WORDS);`
- **Descarte:** fim-da-página `src/core/style/keyword-words.ts:11` `const WORDS = new Set(KEYWORD_WORDS);`
- **Navegador:** não

## EST-L03-015 — `CODECS` (registro dos codecs por id)
- **Declaração:** `src/core/style/codecs.ts:878` `const CODECS: ReadonlyMap<string, Codec> = new Map(`
- **Forma:** `ReadonlyMap<string, Codec>` — o id de codec para o codec registrado.
- **Valores possíveis:**
  - V1 o conjunto fixo com todos os codecs que o módulo registra, cada um pela sua lista de ids.
- **Escritores:**
  - `src/core/style/codecs.ts:878` `const CODECS: ReadonlyMap<string, Codec> = new Map(` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/style/codecs.ts:940` `return CODECS.get(id) ?? null;` via `codecOf`.
- **Criação:** `src/core/style/codecs.ts:878` `const CODECS: ReadonlyMap<string, Codec> = new Map(`
- **Descarte:** fim-da-página `src/core/style/codecs.ts:878` `const CODECS: ReadonlyMap<string, Codec> = new Map(`
- **Navegador:** não

## EST-L03-016 — `FINE_STEP_UNITS` (unidades que o campo numérico passo a décimo)
- **Declaração:** `src/core/style/codecs.ts:945` `export const FINE_STEP_UNITS: ReadonlySet<string> = new Set(['em', 'rem', 'ex', 'rex', 'ch', 'rch', 'lh', 'rlh', 'cap', 'rcap', 'ic', 'ric']);`
- **Forma:** `ReadonlySet<string>` — as unidades relativas à fonte, que um passo de campo move a décimo.
- **Valores possíveis:**
  - V1 o conjunto fixo com as doze unidades relativas à fonte.
- **Escritores:**
  - `src/core/style/codecs.ts:945` `export const FINE_STEP_UNITS: ReadonlySet<string> = new Set(['em', 'rem', 'ex', 'rex', 'ch', 'rch', 'lh', 'rlh', 'cap', 'rcap', 'ic', 'ric']);` via avaliação do módulo (boot).
- **Leitores:**
  - `src/editor/inspector/number-field.ts:75` `const next = read.value.number + delta * (FINE_STEP_UNITS.has(unit) ? FINE_STEP : 1);` via o passo do campo numérico.
- **Criação:** `src/core/style/codecs.ts:945` `export const FINE_STEP_UNITS: ReadonlySet<string> = new Set(['em', 'rem', 'ex', 'rex', 'ch', 'rch', 'lh', 'rlh', 'cap', 'rcap', 'ic', 'ric']);`
- **Descarte:** fim-da-página `src/core/style/codecs.ts:945` `export const FINE_STEP_UNITS: ReadonlySet<string> = new Set(['em', 'rem', 'ex', 'rex', 'ch', 'rch', 'lh', 'rlh', 'cap', 'rcap', 'ic', 'ric']);`
- **Navegador:** não

## EST-L03-017 — `SPREAD_CODECS` (compostos que repetem um valor por lado, canto ou eixo)
- **Declaração:** `src/core/style/set.ts:43` `const SPREAD_CODECS: ReadonlySet<string> = new Set(['box-sides', 'box-corners', 'axis-pair']);`
- **Forma:** `ReadonlySet<string>` — os ids de codec dos compostos que repetem um valor por lado, canto ou eixo.
- **Valores possíveis:**
  - V1 o conjunto fixo com box-sides, box-corners e axis-pair.
- **Escritores:**
  - `src/core/style/set.ts:43` `const SPREAD_CODECS: ReadonlySet<string> = new Set(['box-sides', 'box-corners', 'axis-pair']);` via avaliação do módulo (boot).
- **Leitores:**
  - `src/core/style/set.ts:257` `return SPREAD_CODECS.has(composite.codec) && !/\s/u.test(held.value.trim())` via `readValue`.
- **Criação:** `src/core/style/set.ts:43` `const SPREAD_CODECS: ReadonlySet<string> = new Set(['box-sides', 'box-corners', 'axis-pair']);`
- **Descarte:** fim-da-página `src/core/style/set.ts:43` `const SPREAD_CODECS: ReadonlySet<string> = new Set(['box-sides', 'box-corners', 'axis-pair']);`
- **Navegador:** não

## EST-L03-018 — `LINES` (memória da largura e do estilo de cada linha)
- **Declaração:** `src/core/style/set.ts:172` `const LINES = new WeakMap<ModelRules, ReadonlyMap<string, string>>();`
- **Forma:** `WeakMap<ModelRules, ReadonlyMap<string, string>>` — as regras do modelo para o mapa de cada propriedade de largura e a sua propriedade de estilo.
- **Valores possíveis:**
  - V1 vazio: na primeira pergunta de um conjunto de regras.
  - V2 com uma entrada por conjunto de regras já perguntado, o mapa das linhas.
  - V3 em curso: entre o `get` que erra e o `set` que grava o mapa recém-montado.
- **Escritores:**
  - `src/core/style/set.ts:178` `LINES.set(rules, map);` via `lineStyles`.
- **Leitores:**
  - `src/core/style/set.ts:174` `const known = LINES.get(rules);` via `lineStyles`.
- **Criação:** `src/core/style/set.ts:172` `const LINES = new WeakMap<ModelRules, ReadonlyMap<string, string>>();`
- **Descarte:** fim-da-página `src/core/style/set.ts:172` `const LINES = new WeakMap<ModelRules, ReadonlyMap<string, string>>();`
- **Navegador:** não

## Excluídos

### EXC-L03-001
- **Padrão:** P-E03
- **Ocorrência:** `src/core/design/classes.ts:44` `let count = 0;`
- **Motivo:** contador local de `usesOfClass`, consumido no retorno da própria chamada; `src/core/design/classes.ts:47` `}`.

### EXC-L03-002
- **Padrão:** P-E03
- **Ocorrência:** `src/core/design/components.ts:110` `let n = 2;`
- **Motivo:** contador local de `componentName`, morre no fim da chamada; `src/core/design/components.ts:113` `}`.

### EXC-L03-003
- **Padrão:** P-E03
- **Ocorrência:** `src/core/design/components.ts:168` `let definition = found.node.component === undefined ? undefined : componentsOf(state.document).find((c) => c.name === found.node.component);`
- **Motivo:** valor local do tratador `components.repeat`, lido no mesmo despacho; `src/core/design/components.ts:200` `});`.

### EXC-L03-004
- **Padrão:** P-E03
- **Ocorrência:** `src/core/design/components.ts:274` `let refusal: Message | null = null;`
- **Motivo:** recusa local de `filled`, devolvida no fim da chamada; `src/core/design/components.ts:293` `}`.

### EXC-L03-005
- **Padrão:** P-E03
- **Ocorrência:** `src/core/design/components.ts:329` `let before = found.node.name;`
- **Motivo:** nome local do tratador `components.fillFromData`, usado para numerar as cópias no mesmo despacho; `src/core/design/components.ts:342` `});`.

### EXC-L03-006
- **Padrão:** P-E03
- **Ocorrência:** `src/core/design/components.ts:399` `let count = 0;`
- **Motivo:** contador local do tratador `components.updateFromInstance`, lido no mesmo despacho; `src/core/design/components.ts:427` `});`.

### EXC-L03-007
- **Padrão:** P-E03
- **Ocorrência:** `src/core/design/data.ts:24` `let line: string[] = [];`
- **Motivo:** linha em construção dentro de `csvLines`, devolvida no fim da chamada; `src/core/design/data.ts:50` `}`.

### EXC-L03-008
- **Padrão:** P-E03
- **Ocorrência:** `src/core/design/data.ts:25` `let cellText = '';`
- **Motivo:** célula em construção dentro de `csvLines`, morre no fim da chamada; `src/core/design/data.ts:50` `}`.

### EXC-L03-009
- **Padrão:** P-E03
- **Ocorrência:** `src/core/design/data.ts:26` `let quoted = false;`
- **Motivo:** sinalizador de aspas dentro de `csvLines`, morre no fim da chamada; `src/core/design/data.ts:50` `}`.

### EXC-L03-010
- **Padrão:** P-E03
- **Ocorrência:** `src/core/design/data.ts:59` `let source: string;`
- **Motivo:** texto local de `dataRows`, atribuído e lido dentro da chamada; `src/core/design/data.ts:86` `}`.

### EXC-L03-011
- **Padrão:** P-E03
- **Ocorrência:** `src/core/design/data.ts:71` `let parsed: unknown;`
- **Motivo:** valor local de `dataRows`, atribuído e lido dentro da chamada; `src/core/design/data.ts:86` `}`.

### EXC-L03-012
- **Padrão:** P-E03
- **Ocorrência:** `src/core/design/instances.ts:30` `let node: DocNode | undefined = definition.tree;`
- **Motivo:** nó local de `componentHolders`, caminhado e devolvido no fim da chamada; `src/core/design/instances.ts:48` `}`.

### EXC-L03-013
- **Padrão:** P-E03
- **Ocorrência:** `src/core/design/instances.ts:31` `let parent: DocNode | null = null;`
- **Motivo:** pai local de `componentHolders`, morre no fim da chamada; `src/core/design/instances.ts:48` `}`.

### EXC-L03-014
- **Padrão:** P-E03
- **Ocorrência:** `src/core/elements/attributes.ts:215` `let stored: string | number | true | undefined;`
- **Motivo:** valor local do tratador `element.setAttribute`, lido no mesmo despacho; `src/core/elements/attributes.ts:264` `});`.

### EXC-L03-015
- **Padrão:** P-E03
- **Ocorrência:** `src/core/elements/content-model.ts:215` `let refusing: DocNode | null = null;`
- **Motivo:** recusa local de `interactiveInsideRefusal`, devolvida no fim da chamada; `src/core/elements/content-model.ts:224` `}`.

### EXC-L03-016
- **Padrão:** P-E03
- **Ocorrência:** `src/core/elements/inputs.ts:124` `let id = base;`
- **Motivo:** id em construção dentro de `freshId`, devolvido no fim da chamada; `src/core/elements/inputs.ts:127` `}`.

### EXC-L03-017
- **Padrão:** P-E03
- **Ocorrência:** `src/core/elements/references.ts:98` `let interactions = 0;`
- **Motivo:** contador local de `referencesTo`, somado e devolvido na mesma chamada; `src/core/elements/references.ts:101` `}`.

### EXC-L03-018
- **Padrão:** P-E03
- **Ocorrência:** `src/core/elements/svg.ts:99` `let dropping = 0;`
- **Motivo:** profundidade local do saneador `sanitizedSvgMarkup`, morre no fim da chamada; `src/core/elements/svg.ts:186` `}`.

### EXC-L03-019
- **Padrão:** P-E03
- **Ocorrência:** `src/core/elements/svg.ts:100` `let at = 0;`
- **Motivo:** posição local do saneador `sanitizedSvgMarkup`, morre no fim da chamada; `src/core/elements/svg.ts:186` `}`.

### EXC-L03-020
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/background-image.ts:30` `let text: string;`
- **Motivo:** texto local do tratador `element.setBackgroundImage`, atribuído e lido no mesmo despacho; `src/core/style/background-image.ts:68` `});`.

### EXC-L03-021
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/codecs.ts:82` `let at = 0;`
- **Motivo:** posição local do leitor `workOut`, morre no fim da chamada; `src/core/style/codecs.ts:116` `}`.

### EXC-L03-022
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/codecs.ts:129` `let at = 0;`
- **Motivo:** posição local do leitor `workOutLengths`, morre no fim da chamada; `src/core/style/codecs.ts:188` `}`.

### EXC-L03-023
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/codecs.ts:192` `let depth = 0;`
- **Motivo:** profundidade local de `balanced`, morre no fim da chamada; `src/core/style/codecs.ts:199` `}`.

### EXC-L03-024
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/codecs.ts:511` `let depth = 0;`
- **Motivo:** profundidade local de `valueWords`, morre no fim da chamada; `src/core/style/codecs.ts:523` `}`.

### EXC-L03-025
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/codecs.ts:512` `let word = '';`
- **Motivo:** palavra em construção dentro de `valueWords`, morre no fim da chamada; `src/core/style/codecs.ts:523` `}`.

### EXC-L03-026
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/codecs.ts:786` `let depth = 0;`
- **Motivo:** profundidade local de `splitOutside`, morre no fim da chamada; `src/core/style/codecs.ts:798` `}`.

### EXC-L03-027
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/codecs.ts:787` `let piece = '';`
- **Motivo:** pedaço em construção dentro de `splitOutside`, morre no fim da chamada; `src/core/style/codecs.ts:798` `}`.

### EXC-L03-028
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/color.ts:193` `let h = 0;`
- **Motivo:** matiz em construção dentro de `rgbToHsb`, devolvido no fim da chamada; `src/core/style/color.ts:200` `}`.

### EXC-L03-029
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/filter.ts:16` `let value: string | null = held ?? '';`
- **Motivo:** texto em construção dentro de `applyFunctions`, devolvido no fim da chamada; `src/core/style/filter.ts:22` `}`.

### EXC-L03-030
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/functions.ts:16` `let at = 0;`
- **Motivo:** posição local de `functionsOf`, morre no fim da chamada; `src/core/style/functions.ts:33` `}`.

### EXC-L03-031
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/gradient.ts:37` `let depth = 0;`
- **Motivo:** profundidade local de `pieces`, morre no fim da chamada; `src/core/style/gradient.ts:49` `}`.

### EXC-L03-032
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/gradient.ts:38` `let piece = '';`
- **Motivo:** pedaço em construção dentro de `pieces`, morre no fim da chamada; `src/core/style/gradient.ts:49` `}`.

### EXC-L03-033
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/gradient.ts:60` `let angle = type === 'conic' ? 180 : 180;`
- **Motivo:** ângulo local de `parseGradient`, devolvido no fim da chamada; `src/core/style/gradient.ts:75` `}`.

### EXC-L03-034
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/gradient.ts:151` `let next: Gradient = g;`
- **Motivo:** gradiente em construção dentro de `editedGradient`, devolvido no fim da chamada; `src/core/style/gradient.ts:190` `}`.

### EXC-L03-035
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/shadows.ts:61` `let word = '';`
- **Motivo:** palavra em construção dentro de `shadowLayersFromCss`, morre no fim da chamada; `src/core/style/shadows.ts:98` `}`.

### EXC-L03-036
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/shadows.ts:62` `let depth = 0;`
- **Motivo:** profundidade local de `shadowLayersFromCss`, morre no fim da chamada; `src/core/style/shadows.ts:98` `}`.

### EXC-L03-037
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/shadows.ts:127` `let next: Record<string, string | boolean> = { ...layer };`
- **Motivo:** camada em construção dentro de `editedLayers`, devolvida no fim da chamada; `src/core/style/shadows.ts:155` `}`.

### EXC-L03-038
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/tracks.ts:31` `let depth = 0;`
- **Motivo:** profundidade local de `tracksOf`, morre no fim da chamada; `src/core/style/tracks.ts:45` `}`.

### EXC-L03-039
- **Padrão:** P-E03
- **Ocorrência:** `src/core/style/tracks.ts:32` `let current = '';`
- **Motivo:** trilha em construção dentro de `tracksOf`, morre no fim da chamada; `src/core/style/tracks.ts:45` `}`.

# Estado — lote L04a

Arquivos do lote `auditoria/lotes/L04a.md`: 19 de código de produção, 24 de teste e 3 de dados JSON. Os `*.test.ts` ficam fora do alvo de padrões (`auditoria/padroes.json`, alvo `codigo`) e os três JSON são dados; nenhum deles guarda estado de aplicação. Os módulos de produção do lote (importação, exportação e renderização) não guardam variável mutável de módulo nem coleção que uma entrada escreva. O único estado de topo são conjuntos constantes, listados como itens abaixo; as demais ocorrências de padrão são exclusões.

## EST-L04a-001 — conjunto de layouts de caixa
- **Declaração:** `src/core/export/export.ts:239` `const LAYOUTS = new Set(['flex', 'inline-flex', 'grid', 'inline-grid']);`
- **Forma:** conjunto constante de nomes de exibição
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/export/export.ts:239` `const LAYOUTS = new Set(['flex', 'inline-flex', 'grid', 'inline-grid']);` via carga do módulo
- **Leitores:**
  - `src/core/export/export.ts:245` `return !(base !== undefined && LAYOUTS.has(base) && displays.every((d) => LAYOUTS.has(d as string)));` via runsOn
- **Criação:** `src/core/export/export.ts:239` `const LAYOUTS = new Set(['flex', 'inline-flex', 'grid', 'inline-grid']);`
- **Descarte:** fim-da-página `src/core/export/export.ts:239` `const LAYOUTS = new Set(['flex', 'inline-flex', 'grid', 'inline-grid']);`
- **Navegador:** não

## EST-L04a-002 — conjunto de valores nulos
- **Declaração:** `src/core/export/names.ts:140` `const NONE = new Set(['', 'none', '0', '0px']);`
- **Forma:** conjunto constante de textos
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/export/names.ts:140` `const NONE = new Set(['', 'none', '0', '0px']);` via carga do módulo
- **Leitores:**
  - `src/core/export/names.ts:141` `const present = (value: unknown): boolean => (typeof value === 'string' ? !NONE.has(value.trim()) : value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0));` via present
- **Criação:** `src/core/export/names.ts:140` `const NONE = new Set(['', 'none', '0', '0px']);`
- **Descarte:** fim-da-página `src/core/export/names.ts:140` `const NONE = new Set(['', 'none', '0', '0px']);`
- **Navegador:** não

## EST-L04a-003 — conjunto de pseudo-elementos legados
- **Declaração:** `src/core/import/selectors.ts:250` `const LEGACY_ELEMENTS: ReadonlySet<string> = new Set(['before', 'after', 'first-line', 'first-letter']);`
- **Forma:** conjunto constante de nomes
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/import/selectors.ts:250` `const LEGACY_ELEMENTS: ReadonlySet<string> = new Set(['before', 'after', 'first-line', 'first-letter']);` via carga do módulo
- **Leitores:**
  - `src/core/import/selectors.ts:304` `if (element || LEGACY_ELEMENTS.has(lowered)) types += 1;` via specificityOf
- **Criação:** `src/core/import/selectors.ts:250` `const LEGACY_ELEMENTS: ReadonlySet<string> = new Set(['before', 'after', 'first-line', 'first-letter']);`
- **Descarte:** fim-da-página `src/core/import/selectors.ts:250` `const LEGACY_ELEMENTS: ReadonlySet<string> = new Set(['before', 'after', 'first-line', 'first-letter']);`
- **Navegador:** não

## EST-L04a-004 — conjunto de pseudo-classes por argumento
- **Declaração:** `src/core/import/selectors.ts:252` `const BY_ARGUMENT: ReadonlySet<string> = new Set(['is', 'not', 'has', 'matches', '-webkit-any']);`
- **Forma:** conjunto constante de nomes
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/import/selectors.ts:252` `const BY_ARGUMENT: ReadonlySet<string> = new Set(['is', 'not', 'has', 'matches', '-webkit-any']);` via carga do módulo
- **Leitores:**
  - `src/core/import/selectors.ts:306` `else if (BY_ARGUMENT.has(lowered)) add(mostSpecific(args?.text ?? ''));` via specificityOf
- **Criação:** `src/core/import/selectors.ts:252` `const BY_ARGUMENT: ReadonlySet<string> = new Set(['is', 'not', 'has', 'matches', '-webkit-any']);`
- **Descarte:** fim-da-página `src/core/import/selectors.ts:252` `const BY_ARGUMENT: ReadonlySet<string> = new Set(['is', 'not', 'has', 'matches', '-webkit-any']);`
- **Navegador:** não

## EST-L04a-005 — conjunto de marcas de trecho
- **Declaração:** `src/core/import/import.ts:760` `const RUN_MARKS: ReadonlySet<string> = new Set(['br', 'strong', 'b', 'em', 'i']);`
- **Forma:** conjunto constante de tags
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/import/import.ts:760` `const RUN_MARKS: ReadonlySet<string> = new Set(['br', 'strong', 'b', 'em', 'i']);` via carga do módulo
- **Leitores:**
  - `src/core/import/import.ts:767` `if (RUN_MARKS.has(node.tag)) return true;` via holdsInline
- **Criação:** `src/core/import/import.ts:760` `const RUN_MARKS: ReadonlySet<string> = new Set(['br', 'strong', 'b', 'em', 'i']);`
- **Descarte:** fim-da-página `src/core/import/import.ts:760` `const RUN_MARKS: ReadonlySet<string> = new Set(['br', 'strong', 'b', 'em', 'i']);`
- **Navegador:** não

## EST-L04a-006 — conjunto de tags de partes de mídia
- **Declaração:** `src/core/render/output.ts:38` `const MEDIA_PART_TAGS = new Set(['source', 'track']);`
- **Forma:** conjunto constante de tags
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/render/output.ts:38` `const MEDIA_PART_TAGS = new Set(['source', 'track']);` via carga do módulo
- **Leitores:**
  - `src/core/render/output.ts:47` `if (!MEDIA_PART_TAGS.has(tag)) return true;` via writesNode
- **Criação:** `src/core/render/output.ts:38` `const MEDIA_PART_TAGS = new Set(['source', 'track']);`
- **Descarte:** fim-da-página `src/core/render/output.ts:38` `const MEDIA_PART_TAGS = new Set(['source', 'track']);`
- **Navegador:** não

## EST-L04a-007 — conjunto de elementos vazios
- **Declaração:** `src/core/render/captured.ts:8` `const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);`
- **Forma:** conjunto constante de tags
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/render/captured.ts:8` `const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);` via carga do módulo
- **Leitores:**
  - `src/core/render/captured.ts:188` `if (node.namespace === HTML && VOID.has(node.tag)) return open;` via capturedHtml
- **Criação:** `src/core/render/captured.ts:8` `const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);`
- **Descarte:** fim-da-página `src/core/render/captured.ts:8` `const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);`
- **Navegador:** não

## EST-L04a-008 — conjunto de texto cru
- **Declaração:** `src/core/render/captured.ts:9` `const RAW_TEXT = new Set(['style']);`
- **Forma:** conjunto constante de tags
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/render/captured.ts:9` `const RAW_TEXT = new Set(['style']);` via carga do módulo
- **Leitores:**
  - `src/core/render/captured.ts:180` `return parent !== null && RAW_TEXT.has(parent.tag) ? node.value : escapeText(node.value);` via capturedHtml
- **Criação:** `src/core/render/captured.ts:9` `const RAW_TEXT = new Set(['style']);`
- **Descarte:** fim-da-página `src/core/render/captured.ts:9` `const RAW_TEXT = new Set(['style']);`
- **Navegador:** não

## EST-L04a-009 — conjunto de conteúdo de cabeça
- **Declaração:** `src/core/render/captured.ts:13` `const HEAD_CONTENT = new Set(['base', 'basefont', 'bgsound', 'link', 'meta', 'noframes', 'noscript', 'script', 'style', 'template', 'title']);`
- **Forma:** conjunto constante de tags
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/render/captured.ts:13` `const HEAD_CONTENT = new Set(['base', 'basefont', 'bgsound', 'link', 'meta', 'noframes', 'noscript', 'script', 'style', 'template', 'title']);` via carga do módulo
- **Leitores:**
  - `src/core/render/captured.ts:184` `if (parent !== null && isElement(parent, 'head') && !HEAD_CONTENT.has(node.tag)) return '';` via capturedHtml
- **Criação:** `src/core/render/captured.ts:13` `const HEAD_CONTENT = new Set(['base', 'basefont', 'bgsound', 'link', 'meta', 'noframes', 'noscript', 'script', 'style', 'template', 'title']);`
- **Descarte:** fim-da-página `src/core/render/captured.ts:13` `const HEAD_CONTENT = new Set(['base', 'basefont', 'bgsound', 'link', 'meta', 'noframes', 'noscript', 'script', 'style', 'template', 'title']);`
- **Navegador:** não

## EST-L04a-010 — conjunto de nova linha inicial
- **Declaração:** `src/core/render/captured.ts:15` `const LEADING_NEWLINE = new Set(['pre', 'textarea', 'listing']);`
- **Forma:** conjunto constante de tags
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/render/captured.ts:15` `const LEADING_NEWLINE = new Set(['pre', 'textarea', 'listing']);` via carga do módulo
- **Leitores:**
  - `src/core/render/captured.ts:194` `const newline = node.namespace === HTML && LEADING_NEWLINE.has(node.tag) && firstText.startsWith('\n') ? '\n' : '';` via capturedHtml
- **Criação:** `src/core/render/captured.ts:15` `const LEADING_NEWLINE = new Set(['pre', 'textarea', 'listing']);`
- **Descarte:** fim-da-página `src/core/render/captured.ts:15` `const LEADING_NEWLINE = new Set(['pre', 'textarea', 'listing']);`
- **Navegador:** não

## EST-L04a-011 — conjunto de escopo de botão
- **Declaração:** `src/core/render/captured.ts:24` `const BUTTON_SCOPE = new Set(['applet', 'caption', 'html', 'table', 'td', 'th', 'marquee', 'object', 'select', 'template', 'button']);`
- **Forma:** conjunto constante de tags
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/render/captured.ts:24` `const BUTTON_SCOPE = new Set(['applet', 'caption', 'html', 'table', 'td', 'th', 'marquee', 'object', 'select', 'template', 'button']);` via carga do módulo
- **Leitores:**
  - `src/core/render/captured.ts:72` `const paragraph = nearest((one) => one.namespace === HTML && one.tag === 'p', (one) => one.namespace !== HTML || BUTTON_SCOPE.has(one.tag));` via parserRebuilt
- **Criação:** `src/core/render/captured.ts:24` `const BUTTON_SCOPE = new Set(['applet', 'caption', 'html', 'table', 'td', 'th', 'marquee', 'object', 'select', 'template', 'button']);`
- **Descarte:** fim-da-página `src/core/render/captured.ts:24` `const BUTTON_SCOPE = new Set(['applet', 'caption', 'html', 'table', 'td', 'th', 'marquee', 'object', 'select', 'template', 'button']);`
- **Navegador:** não

## EST-L04a-012 — conjunto de parada de lista
- **Declaração:** `src/core/render/captured.ts:25` `const LIST_SCOPE_STOP = new Set(['address', 'div', 'p']);`
- **Forma:** conjunto constante de tags
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/render/captured.ts:25` `const LIST_SCOPE_STOP = new Set(['address', 'div', 'p']);` via carga do módulo
- **Leitores:**
  - `src/core/render/captured.ts:78` `const open = nearest((one) => one.namespace === HTML && listLike.includes(one.tag), (one) => one.namespace !== HTML || (SPECIAL.has(one.tag) && !LIST_SCOPE_STOP.has(one.tag)));` via parserRebuilt
- **Criação:** `src/core/render/captured.ts:25` `const LIST_SCOPE_STOP = new Set(['address', 'div', 'p']);`
- **Descarte:** fim-da-página `src/core/render/captured.ts:25` `const LIST_SCOPE_STOP = new Set(['address', 'div', 'p']);`
- **Navegador:** não

## EST-L04a-013 — conjunto de fechadores de parágrafo
- **Declaração:** `src/core/render/captured.ts:26` `const P_CLOSERS = new Set(['address', 'article', 'aside', 'blockquote', 'center', 'details', 'dialog', 'dir', 'div', 'dl', 'fieldset', 'figcaption', 'figure',`
- **Forma:** conjunto constante de tags
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/render/captured.ts:26` `const P_CLOSERS = new Set(['address', 'article', 'aside', 'blockquote', 'center', 'details', 'dialog', 'dir', 'div', 'dl', 'fieldset', 'figcaption', 'figure',` via carga do módulo
- **Leitores:**
  - `src/core/render/captured.ts:71` `if (P_CLOSERS.has(node.tag)) {` via parserRebuilt
- **Criação:** `src/core/render/captured.ts:26` `const P_CLOSERS = new Set(['address', 'article', 'aside', 'blockquote', 'center', 'details', 'dialog', 'dir', 'div', 'dl', 'fieldset', 'figcaption', 'figure',`
- **Descarte:** fim-da-página `src/core/render/captured.ts:26` `const P_CLOSERS = new Set(['address', 'article', 'aside', 'blockquote', 'center', 'details', 'dialog', 'dir', 'div', 'dl', 'fieldset', 'figcaption', 'figure',`
- **Navegador:** não

## EST-L04a-014 — conjunto de elementos especiais
- **Declaração:** `src/core/render/captured.ts:29` `const SPECIAL = new Set(['address', 'applet', 'area', 'article', 'aside', 'base', 'basefont', 'bgsound', 'blockquote', 'body', 'br', 'button', 'caption', 'center',`
- **Forma:** conjunto constante de tags
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/render/captured.ts:29` `const SPECIAL = new Set(['address', 'applet', 'area', 'article', 'aside', 'base', 'basefont', 'bgsound', 'blockquote', 'body', 'br', 'button', 'caption', 'center',` via carga do módulo
- **Leitores:**
  - `src/core/render/captured.ts:78` `const open = nearest((one) => one.namespace === HTML && listLike.includes(one.tag), (one) => one.namespace !== HTML || (SPECIAL.has(one.tag) && !LIST_SCOPE_STOP.has(one.tag)));` via parserRebuilt
- **Criação:** `src/core/render/captured.ts:29` `const SPECIAL = new Set(['address', 'applet', 'area', 'article', 'aside', 'base', 'basefont', 'bgsound', 'blockquote', 'body', 'br', 'button', 'caption', 'center',`
- **Descarte:** fim-da-página `src/core/render/captured.ts:29` `const SPECIAL = new Set(['address', 'applet', 'area', 'article', 'aside', 'base', 'basefont', 'bgsound', 'blockquote', 'body', 'br', 'button', 'caption', 'center',`
- **Navegador:** não

## EST-L04a-015 — conjunto de títulos
- **Declaração:** `src/core/render/captured.ts:34` `const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);`
- **Forma:** conjunto constante de tags
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/render/captured.ts:34` `const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);` via carga do módulo
- **Leitores:**
  - `src/core/render/captured.ts:92` `if (HEADINGS.has(node.tag) && parent.namespace === HTML && HEADINGS.has(parent.tag)) mark(parent, ancestors.at(-2));` via parserRebuilt
- **Criação:** `src/core/render/captured.ts:34` `const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);`
- **Descarte:** fim-da-página `src/core/render/captured.ts:34` `const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);`
- **Navegador:** não

## EST-L04a-016 — conjunto de integração estrangeira
- **Declaração:** `src/core/render/captured.ts:50` `const INTEGRATION = new Set([`
- **Forma:** conjunto constante de pares namespace/tag
- **Valores possíveis:**
  - V1 único: o conjunto fixo criado na carga; nenhuma entrada o altera.
- **Escritores:**
  - `src/core/render/captured.ts:50` `const INTEGRATION = new Set([` via carga do módulo
- **Leitores:**
  - `src/core/render/captured.ts:98` `if (parent.namespace !== HTML && !INTEGRATION.has(` via parserRebuilt
- **Criação:** `src/core/render/captured.ts:50` `const INTEGRATION = new Set([`
- **Descarte:** fim-da-página `src/core/render/captured.ts:50` `const INTEGRATION = new Set([`
- **Navegador:** não

## Excluídos

## EXC-L04a-001
- **Padrão:** P-E03
- **Ocorrência:** `src/core/capture/edits.ts:79` `let root: CapturedElement = capture.root;`
- **Motivo:** variável local do retorno de `src/core/capture/edits.ts:74` `export const editCaptureCommand = registerHandler('capture.edit'`; some quando ele retorna e outra entrada não a lê.

## EXC-L04a-002
- **Padrão:** P-E03
- **Ocorrência:** `src/core/capture/merge.ts:102` `let i = 0;`
- **Motivo:** variável local do corpo de `src/core/capture/merge.ts:66` `function common(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-003
- **Padrão:** P-E03
- **Ocorrência:** `src/core/capture/merge.ts:103` `let j = 0;`
- **Motivo:** variável local do corpo de `src/core/capture/merge.ts:66` `function common(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-004
- **Padrão:** P-E03
- **Ocorrência:** `src/core/capture/merge.ts:120` `let i = 0;`
- **Motivo:** variável local do corpo de `src/core/capture/merge.ts:115` `function mergeList(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-005
- **Padrão:** P-E03
- **Ocorrência:** `src/core/capture/merge.ts:121` `let j = 0;`
- **Motivo:** variável local do corpo de `src/core/capture/merge.ts:115` `function mergeList(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-006
- **Padrão:** P-E03
- **Ocorrência:** `src/core/capture/merge.ts:129` `let di = 0;`
- **Motivo:** variável local do corpo de `src/core/capture/merge.ts:115` `function mergeList(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-007
- **Padrão:** P-E03
- **Ocorrência:** `src/core/capture/merge.ts:130` `let nj = 0;`
- **Motivo:** variável local do corpo de `src/core/capture/merge.ts:115` `function mergeList(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-008
- **Padrão:** P-E03
- **Ocorrência:** `src/core/export/export.ts:287` `let pageAttributes = new Map<string, string>();`
- **Motivo:** variável local do corpo de `src/core/export/export.ts:258` `function pageLines(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-009
- **Padrão:** P-E03
- **Ocorrência:** `src/core/export/export.ts:487` `let html = site.pages[pageIndex]?.html ?? '';`
- **Motivo:** variável local do corpo de `src/core/export/export.ts:483` `function previewPage(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-010
- **Padrão:** P-E03
- **Ocorrência:** `src/core/export/export.ts:512` `let css = site.css;`
- **Motivo:** variável local do corpo de `src/core/export/export.ts:483` `function previewPage(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-011
- **Padrão:** P-E03
- **Ocorrência:** `src/core/export/names.ts:217` `let last = 'alt';`
- **Motivo:** variável local do corpo de `src/core/export/names.ts:216` `function variantModifier(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-012
- **Padrão:** P-E03
- **Ocorrência:** `src/core/export/names.ts:230` `let name = base;`
- **Motivo:** variável local do corpo de `src/core/export/names.ts:229` `function stableClass(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-013
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/destinations.ts:24` `let imported = parsed;`
- **Motivo:** variável local do corpo de `src/core/import/destinations.ts:13` `function importDestination(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-014
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/destinations.ts:64` `let selection: NodeId[];`
- **Motivo:** variável local do corpo de `src/core/import/destinations.ts:13` `function importDestination(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-015
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/folder.ts:125` `let document: DocumentJson = { ...site.document, ...(files_.length === 0 ? {} : { files: files_ }) };`
- **Motivo:** variável local do corpo de `src/core/import/folder.ts:93` `function importFolder`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-016
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:97` `let binary = '';`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:96` `function base64(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-017
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:366` `let fallback: string | null = null;`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:365` `function typeOfTag(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-018
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:620` `let attributes: Record<string, unknown> = {};`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:541` `function build(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-019
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:621` `let customAttributes: Record<string, string> = {};`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:541` `function build(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-020
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:622` `let inlineStyle: string | null = null;`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:541` `function build(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-021
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:630` `let hiddenFlag = false;`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:541` `function build(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-022
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:725` `let phrasing: MarkupChild[] = [];`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:722` `function buildChildren(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-023
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:1002` `let order = 0;`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:997` `function readyRules(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-024
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:1251` `let depth = 0;`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:1249` `const listItems = `; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-025
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:1252` `let piece = '';`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:1249` `const listItems = `; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-026
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:1593` `let attributes: Record<string, unknown> = {};`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:1520` `function pageFrom(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-027
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:1594` `let customAttributes: Record<string, string> = {};`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:1520` `function pageFrom(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-028
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:1595` `let classes: readonly string[] = [];`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:1520` `function pageFrom(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-029
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:1596` `let inlineStyle: string | null = null;`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:1520` `function pageFrom(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-030
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:1685` `let elements = 0;`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:1673` `function importedSite`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-031
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:1876` `let ast: CssTreeNode;`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:1875` `function residualCss(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-032
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/import.ts:1924` `let ast: CssTreeNode;`
- **Motivo:** variável local do corpo de `src/core/import/import.ts:1923` `function byCaptureClass(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-033
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:53` `let rest = text;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:52` `function readCompound(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-034
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:54` `let tag: string | null = null;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:52` `function readCompound(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-035
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:55` `let universal = false;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:52` `function readCompound(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-036
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:57` `let id: string | null = null;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:52` `function readCompound(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-037
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:59` `let pseudo: string | null = null;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:52` `function readCompound(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-038
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:115` `let current = '';`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:109` `function readSelector(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-039
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:116` `let depth = 0;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:109` `function readSelector(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-040
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:117` `let pending: ' ' | '>' | null = null;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:109` `function readSelector(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-041
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:118` `let failed = false;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:109` `function readSelector(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-042
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:214` `let depth = 0;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:212` `function splitSelectorList(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-043
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:215` `let quote: string | null = null;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:212` `function splitSelectorList(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-044
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:216` `let current = '';`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:212` `function splitSelectorList(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-045
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:261` `let ids = 0;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:260` `function specificityOf(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-046
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:262` `let others = 0;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:260` `function specificityOf(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-047
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:263` `let types = 0;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:260` `function specificityOf(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-048
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/selectors.ts:269` `let at = 0;`
- **Motivo:** variável local do corpo de `src/core/import/selectors.ts:260` `function specificityOf(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-049
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/stylesheet.ts:49` `let piece = '';`
- **Motivo:** variável local do corpo de `src/core/import/stylesheet.ts:47` `function readDeclarations(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-050
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/stylesheet.ts:50` `let at0 = 0;`
- **Motivo:** variável local do corpo de `src/core/import/stylesheet.ts:47` `function readDeclarations(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-051
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/stylesheet.ts:51` `let depth = 0;`
- **Motivo:** variável local do corpo de `src/core/import/stylesheet.ts:47` `function readDeclarations(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-052
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/stylesheet.ts:52` `let quote: string | null = null;`
- **Motivo:** variável local do corpo de `src/core/import/stylesheet.ts:47` `function readDeclarations(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-053
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/stylesheet.ts:88` `let piece = '';`
- **Motivo:** variável local do corpo de `src/core/import/stylesheet.ts:86` `function selectorsIn(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-054
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/stylesheet.ts:89` `let depth = 0;`
- **Motivo:** variável local do corpo de `src/core/import/stylesheet.ts:86` `function selectorsIn(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-055
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/stylesheet.ts:90` `let quote: string | null = null;`
- **Motivo:** variável local do corpo de `src/core/import/stylesheet.ts:86` `function selectorsIn(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-056
- **Padrão:** P-E03
- **Ocorrência:** `src/core/import/stylesheet.ts:168` `let depth = 0;`
- **Motivo:** variável local do corpo de `src/core/import/stylesheet.ts:167` `function matchingBrace(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-057
- **Padrão:** P-E03
- **Ocorrência:** `src/core/render/clean.ts:42` `let result = [...lines];`
- **Motivo:** variável local do corpo de `src/core/render/clean.ts:41` `function compactDeclarations(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-058
- **Padrão:** P-E03
- **Ocorrência:** `src/core/render/clean.ts:185` `let context = '';`
- **Motivo:** variável local do corpo de `src/core/render/clean.ts:182` `function mergeCssLines<`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-059
- **Padrão:** P-E03
- **Ocorrência:** `src/core/render/clean.ts:186` `let opaqueDepth = 0;`
- **Motivo:** variável local do corpo de `src/core/render/clean.ts:182` `function mergeCssLines<`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-060
- **Padrão:** P-E03
- **Ocorrência:** `src/core/render/clean.ts:222` `let blockIndex = 0;`
- **Motivo:** variável local do corpo de `src/core/render/clean.ts:182` `function mergeCssLines<`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-061
- **Padrão:** P-E03
- **Ocorrência:** `src/core/render/captured.ts:344` `let html = capturedHtml(staticRoot, { marked });`
- **Motivo:** variável local do corpo de `src/core/render/captured.ts:338` `function capturedExportHtml(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-062
- **Padrão:** P-E03
- **Ocorrência:** `src/core/render/captured.ts:396` `let depth = 0;`
- **Motivo:** variável local do corpo de `src/core/render/captured.ts:395` `function formattedCapturedCss(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-063
- **Padrão:** P-E03
- **Ocorrência:** `src/core/render/captured.ts:397` `let parentheses = 0;`
- **Motivo:** variável local do corpo de `src/core/render/captured.ts:395` `function formattedCapturedCss(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-064
- **Padrão:** P-E03
- **Ocorrência:** `src/core/render/captured.ts:398` `let quote: string | null = null;`
- **Motivo:** variável local do corpo de `src/core/render/captured.ts:395` `function formattedCapturedCss(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-065
- **Padrão:** P-E03
- **Ocorrência:** `src/core/render/captured.ts:399` `let comment = false;`
- **Motivo:** variável local do corpo de `src/core/render/captured.ts:395` `function formattedCapturedCss(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-066
- **Padrão:** P-E03
- **Ocorrência:** `src/core/render/captured.ts:400` `let out = '';`
- **Motivo:** variável local do corpo de `src/core/render/captured.ts:395` `function formattedCapturedCss(`; some quando a função retorna e outra entrada não a lê.

## EXC-L04a-067
- **Padrão:** P-E11
- **Ocorrência:** `src/core/render/captured.ts:274` `if (node.state?.scrollLeft !== undefined || node.state?.scrollTop !== undefined) s[String(width)] = [node.state.scrollLeft ?? 0, node.state.scrollTop ?? 0];`
- **Motivo:** lê o campo do modelo capturado, `src/core/document/captured.ts:22` `readonly scrollLeft?: number;`, e não o estado de rolagem do navegador.

## EXC-L04a-068
- **Padrão:** P-E11
- **Ocorrência:** `src/core/render/captured.ts:316` `e2.scrollLeft=s[0];e2.scrollTop=s[1]`
- **Motivo:** texto de um script gerado por `src/core/render/captured.ts:300` `function widthScript(`; não é leitura nem escrita do estado do navegador pelo editor.

# Estado — lote L04b

Estado que os arquivos deste lote declaram e guardam. Os doze arquivos `*.test.ts` do lote ficam fora: o alvo `codigo` de `auditoria/padroes.json` os exclui, e o estado deles é andaime da suíte, não lido por comando do editor.

## EST-L04b-001 — conjunto UNSAFE_ATTRIBUTES do leitor de motion
- **Declaração:** `src/core/motion/read.ts:41` `const UNSAFE_ATTRIBUTES = new Set(['style', 'srcdoc',`
- **Forma:** `Set<string>` de módulo, criado uma vez com onze nomes de atributo que um efeito não pode escrever.
- **Valores possíveis:** V1 o conjunto criado no carregamento do módulo, com os onze nomes (style, srcdoc, src, href, action, formaction, xlink:href, data, srcset, poster, background); não há reescrita depois.
- **Escritores:** `src/core/motion/read.ts:41` `const UNSAFE_ATTRIBUTES = new Set(['style', 'srcdoc',` via inicialização do módulo (a única escrita; nada reescreve o conjunto depois).
- **Leitores:** `src/core/motion/read.ts:250` `UNSAFE_ATTRIBUTES.has(text)` via `readEffect`, no ramo `attribute`.
- **Criação:** `src/core/motion/read.ts:41` `const UNSAFE_ATTRIBUTES = new Set(['style', 'srcdoc',`
- **Descarte:** fim-da-página `src/core/motion/read.ts:41` `const UNSAFE_ATTRIBUTES = new Set(['style', 'srcdoc',`
- **Navegador:** não

## EST-L04b-002 — conjunto EFFECT_BOOLEANS das opções de efeito booleanas
- **Declaração:** `src/core/motion/commands.ts:430` `const EFFECT_BOOLEANS = new Set(['smooth', 'newTab', 'remember', 'loop']);`
- **Forma:** `Set<string>` de módulo, criado uma vez com os nomes das opções que um campo de texto entrega como booleano.
- **Valores possíveis:** V1 o conjunto criado no carregamento do módulo, com smooth, newTab, remember e loop; não há reescrita depois.
- **Escritores:** `src/core/motion/commands.ts:430` `const EFFECT_BOOLEANS = new Set(['smooth', 'newTab', 'remember', 'loop']);` via inicialização do módulo (a única escrita).
- **Leitores:** `src/core/motion/commands.ts:444` `EFFECT_BOOLEANS.has(option)` via `setEffectOptionCommand`.
- **Criação:** `src/core/motion/commands.ts:430` `const EFFECT_BOOLEANS = new Set(['smooth', 'newTab', 'remember', 'loop']);`
- **Descarte:** fim-da-página `src/core/motion/commands.ts:430` `const EFFECT_BOOLEANS = new Set(['smooth', 'newTab', 'remember', 'loop']);`
- **Navegador:** não

## EST-L04b-003 — conjunto EFFECT_NUMBERS das opções de efeito numéricas
- **Declaração:** `src/core/motion/commands.ts:431` `const EFFECT_NUMBERS = new Set(['offset', 'index', 'speed']);`
- **Forma:** `Set<string>` de módulo, criado uma vez com os nomes das opções que um campo de texto entrega como número.
- **Valores possíveis:** V1 o conjunto criado no carregamento do módulo, com offset, index e speed; não há reescrita depois.
- **Escritores:** `src/core/motion/commands.ts:431` `const EFFECT_NUMBERS = new Set(['offset', 'index', 'speed']);` via inicialização do módulo (a única escrita).
- **Leitores:** `src/core/motion/commands.ts:433` `EFFECT_NUMBERS.has(option) ||` via `isNumber`.
- **Criação:** `src/core/motion/commands.ts:431` `const EFFECT_NUMBERS = new Set(['offset', 'index', 'speed']);`
- **Descarte:** fim-da-página `src/core/motion/commands.ts:431` `const EFFECT_NUMBERS = new Set(['offset', 'index', 'speed']);`
- **Navegador:** não

## EST-L04b-004 — conjunto OPTIONAL_OPTIONS das opções presentes em algumas formas do efeito
- **Declaração:** `src/core/motion/commands.ts:476` `const OPTIONAL_OPTIONS = new Set(['time', 'index', 'address', 'text', 'detail', 'from', 'to']);`
- **Forma:** `Set<string>` de módulo, criado uma vez com os nomes das opções que só algumas formas de um efeito guardam.
- **Valores possíveis:** V1 o conjunto criado no carregamento do módulo, com time, index, address, text, detail, from e to; não há reescrita depois.
- **Escritores:** `src/core/motion/commands.ts:476` `const OPTIONAL_OPTIONS = new Set(['time', 'index', 'address', 'text', 'detail', 'from', 'to']);` via inicialização do módulo (a única escrita).
- **Leitores:** `src/core/motion/commands.ts:442` `!OPTIONAL_OPTIONS.has(option)` via `setEffectOptionCommand`.
- **Criação:** `src/core/motion/commands.ts:476` `const OPTIONAL_OPTIONS = new Set(['time', 'index', 'address', 'text', 'detail', 'from', 'to']);`
- **Descarte:** fim-da-página `src/core/motion/commands.ts:476` `const OPTIONAL_OPTIONS = new Set(['time', 'index', 'address', 'text', 'detail', 'from', 'to']);`
- **Navegador:** não

## EST-L04b-005 — conjunto DATE_FORMATS lidos como data
- **Declaração:** `src/core/data/readers.ts:159` `const DATE_FORMATS = new Set([14, 15, 16, 17, 22, 27, 30, 36, 50, 57]);`
- **Forma:** `Set<number>` de módulo, criado uma vez com os identificadores dos formatos de número que mostram uma data.
- **Valores possíveis:** V1 o conjunto criado no carregamento do módulo, com os dez identificadores; não há reescrita depois.
- **Escritores:** `src/core/data/readers.ts:159` `const DATE_FORMATS = new Set([14, 15, 16, 17, 22, 27, 30, 36, 50, 57]);` via inicialização do módulo (a única escrita).
- **Leitores:** `src/core/data/readers.ts:203` `DATE_FORMATS.has(format) ||` via `isDate`, dentro de `readSpreadsheet`.
- **Criação:** `src/core/data/readers.ts:159` `const DATE_FORMATS = new Set([14, 15, 16, 17, 22, 27, 30, 36, 50, 57]);`
- **Descarte:** fim-da-página `src/core/data/readers.ts:159` `const DATE_FORMATS = new Set([14, 15, 16, 17, 22, 27, 30, 36, 50, 57]);`
- **Navegador:** não

## EST-L04b-006 — conjunto INTERACTION_FIELDS da fronteira de confiança
- **Declaração:** `src/core/events/interaction-rule.ts:27` `const INTERACTION_FIELDS: ReadonlySet<string> = new Set(['trigger', 'action', 'target', 'className', 'animation', 'address', 'newTab', 'scope', 'once', 'delay']);`
- **Forma:** `ReadonlySet<string>` de módulo, criado uma vez com os dez campos que uma interação pode ter.
- **Valores possíveis:** V1 o conjunto criado no carregamento do módulo, com trigger, action, target, className, animation, address, newTab, scope, once e delay; não há reescrita depois.
- **Escritores:** `src/core/events/interaction-rule.ts:27` `const INTERACTION_FIELDS: ReadonlySet<string> = new Set(['trigger', 'action', 'target', 'className', 'animation', 'address', 'newTab', 'scope', 'once', 'delay']);` via inicialização do módulo (a única escrita).
- **Leitores:** `src/core/events/interaction-rule.ts:33` `!INTERACTION_FIELDS.has(key)` via `interactionProblems`.
- **Criação:** `src/core/events/interaction-rule.ts:27` `const INTERACTION_FIELDS: ReadonlySet<string> = new Set(['trigger', 'action', 'target', 'className', 'animation', 'address', 'newTab', 'scope', 'once', 'delay']);`
- **Descarte:** fim-da-página `src/core/events/interaction-rule.ts:27` `const INTERACTION_FIELDS: ReadonlySet<string> = new Set(['trigger', 'action', 'target', 'className', 'animation', 'address', 'newTab', 'scope', 'once', 'delay']);`
- **Navegador:** não

## EST-L04b-007 — conjunto ONCE_BY_NATURE dos gatilhos que já disparam uma vez
- **Declaração:** `src/core/events/interactions.ts:153` `const ONCE_BY_NATURE: ReadonlySet<string> = new Set(['scroll-into-view', 'page-load']);`
- **Forma:** `ReadonlySet<string>` de módulo, criado uma vez com os gatilhos que disparam uma vez por natureza.
- **Valores possíveis:** V1 o conjunto criado no carregamento do módulo, com scroll-into-view e page-load; não há reescrita depois.
- **Escritores:** `src/core/events/interactions.ts:153` `const ONCE_BY_NATURE: ReadonlySet<string> = new Set(['scroll-into-view', 'page-load']);` via inicialização do módulo (a única escrita).
- **Leitores:** `src/core/events/interactions.ts:154` `ONCE_BY_NATURE.has(interaction.trigger)` via `firesOnce`; `src/core/events/interactions.ts:195` `ONCE_BY_NATURE.has(interaction.trigger)` via `withOptions`.
- **Criação:** `src/core/events/interactions.ts:153` `const ONCE_BY_NATURE: ReadonlySet<string> = new Set(['scroll-into-view', 'page-load']);`
- **Descarte:** fim-da-página `src/core/events/interactions.ts:153` `const ONCE_BY_NATURE: ReadonlySet<string> = new Set(['scroll-into-view', 'page-load']);`
- **Navegador:** não

## EST-L04b-008 — instância de DataRefusal (a recusa previsível de conteúdo)
- **Declaração:** `src/core/data/collections.ts:16` `export class DataRefusal extends Error {`
- **Forma:** subclasse de `Error`; os campos de cada instância são `name` (fixo) e `refusal` (a mensagem da recusa).
- **Valores possíveis:** V1 recém-construída, com `refusal` igual à mensagem da recusa e `name` igual a DataRefusal; V2 lançada e ainda não apanhada, subindo a pilha; V3 apanhada e lida por `error.refusal` antes de ser descartada.
- **Escritores:** `src/core/data/collections.ts:17` `override name = 'DataRefusal';` via o inicializador do campo; `src/core/data/collections.ts:22` `this.refusal = refusal;` via o construtor.
- **Leitores:** `src/core/data/derive.ts:211` `if (error instanceof DataRefusal) return { refused: error.refusal };` via `deriveData`; `src/core/data/commands.ts:70` `if (error instanceof DataRefusal) return { kind: 'refused', message: error.refusal };` via `contentChange`.
- **Criação:** `src/core/data/collections.ts:26` `throw new DataRefusal(message(key, params));`
- **Descarte:** `src/core/data/derive.ts:211` `if (error instanceof DataRefusal) return { refused: error.refusal };` — a instância deixa de ser alcançável quando o `catch` responde.
- **Navegador:** não

## EST-L04b-009 — instância de Reader (a leitura estrita de motion)
- **Declaração:** `src/core/motion/read.ts:58` `class Reader {`
- **Forma:** uma instância por leitura estrita; o campo de cada instância, `issues`, acumula os problemas achados.
- **Valores possíveis:** V1 `issues` vazio (o valor lido é aceito); V2 `issues` com um ou mais problemas, cada `bad` acrescentando um; V3 lida por `result`, que devolve `ok` ou os problemas.
- **Escritores:** `src/core/motion/read.ts:61` `this.issues.push({ path, reason });` via `bad`.
- **Leitores:** `src/core/motion/read.ts:131` `return this.issues.length === 0 ? { ok: true, value } : { ok: false, issues: this.issues };` via `result`.
- **Criação:** `src/core/motion/read.ts:392` `const reader = new Reader();`
- **Descarte:** `src/core/motion/read.ts:400` `return reader.result({ id, name, actions, markers });` — a instância morre quando `readTimeline` retorna.
- **Navegador:** não

# Exclusões

## EXC-L04b-001
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/bindings.ts:97` `let next = node;`
- **Motivo:** variável local de `fillNode`, criada e descartada dentro da chamada (`src/core/data/bindings.ts:96` `function fillNode(document: DocumentJson, node: DocNode, place: Place, pages: ItemPages, context: DataContext): DocNode {`).

## EXC-L04b-002
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/collections.ts:144` `let key = base;`
- **Motivo:** variável local de `keyFor`, criada e descartada dentro da chamada (`src/core/data/collections.ts:140` `export function keyFor(label: string, taken: Iterable<string>): string {`).

## EXC-L04b-003
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/commands.ts:155` `let uses = 0;`
- **Motivo:** variável local de `usesOf`, criada e descartada dentro da chamada (`src/core/data/commands.ts:154` `function usesOf(document: DocumentJson, name: string): number {`).

## EXC-L04b-004
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/commands.ts:224` `let uses = 0;`
- **Motivo:** variável local de `fieldUses`, criada e descartada dentro da chamada (`src/core/data/commands.ts:223` `function fieldUses(document: DocumentJson, collection: string, key: string): number {`).

## EXC-L04b-005
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/materialize.ts:46` `let index = 0;`
- **Motivo:** variável local de `listChildren`, criada e descartada dentro da chamada (`src/core/data/materialize.ts:35` `function listChildren(document: DocumentJson, node: DocNode,`).

## EXC-L04b-006
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/materialize.ts:58` `let before = instances.at(-1)?.name ?? definition.name;`
- **Motivo:** variável local de `listChildren`, criada e descartada dentro da chamada (`src/core/data/materialize.ts:35` `function listChildren(document: DocumentJson, node: DocNode,`).

## EXC-L04b-007
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/materialize.ts:102` `let working: DocumentJson = {`
- **Motivo:** variável local de `materialize`, criada e descartada dentro da chamada (`src/core/data/materialize.ts:76` `export function materialize(document: DocumentJson, context: DataContext): DocumentJson {`).

## EXC-L04b-008
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/readers.ts:116` `let parsed: unknown;`
- **Motivo:** variável local de `readJson`, criada e descartada dentro da chamada (`src/core/data/readers.ts:115` `export function readJson(file: string, source: string): Sheet {`).

## EXC-L04b-009
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/readers.ts:148` `let value = 0;`
- **Motivo:** variável local de `columnIndex`, criada e descartada dentro da chamada (`src/core/data/readers.ts:145` `function columnIndex(file: string, reference: string): number {`).

## EXC-L04b-010
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/readers.ts:173` `let archive: Map<string, Uint8Array>;`
- **Motivo:** variável local de `readSpreadsheet`, criada e descartada dentro da chamada (`src/core/data/readers.ts:172` `async function readSpreadsheet(file: string, bytes: Uint8Array,`).

## EXC-L04b-011
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/regions.ts:105` `let working = document;`
- **Motivo:** variável local de `shareRegion`, criada e descartada dentro da chamada (`src/core/data/regions.ts:93` `export function shareRegion(document: DocumentJson, id: NodeId,`).

## EXC-L04b-012
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/regions.ts:106` `let name = found.node.component;`
- **Motivo:** variável local de `shareRegion`, criada e descartada dentro da chamada (`src/core/data/regions.ts:93` `export function shareRegion(document: DocumentJson, id: NodeId,`).

## EXC-L04b-013
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/regions.ts:126` `let count = 0;`
- **Motivo:** variável local de `shareRegion`, criada e descartada dentro da chamada (`src/core/data/regions.ts:93` `export function shareRegion(document: DocumentJson, id: NodeId,`).

## EXC-L04b-014
- **Padrão:** P-E03
- **Ocorrência:** `src/core/data/regions.ts:173` `let working = after;`
- **Motivo:** variável local de `syncRegions`, criada e descartada dentro da chamada (`src/core/data/regions.ts:170` `export function syncRegions(before: DocumentJson, after: DocumentJson,`).

## EXC-L04b-015
- **Padrão:** P-E03
- **Ocorrência:** `src/core/events/interactions.ts:170` `let once: boolean | undefined;`
- **Motivo:** variável local de `readOptions`, criada e descartada dentro da chamada (`src/core/events/interactions.ts:167` `export function readOptions(text: string): InteractionOptions | null {`).

## EXC-L04b-016
- **Padrão:** P-E03
- **Ocorrência:** `src/core/events/interactions.ts:171` `let delay: number | undefined;`
- **Motivo:** variável local de `readOptions`, criada e descartada dentro da chamada (`src/core/events/interactions.ts:167` `export function readOptions(text: string): InteractionOptions | null {`).

## EXC-L04b-017
- **Padrão:** P-E03
- **Ocorrência:** `src/core/events/interactions.ts:311` `let next: Interaction = held;`
- **Motivo:** variável local do tratador de `interactions.update`, criada e descartada dentro da chamada (`src/core/events/interactions.ts:298` `export function updateInteractionCommand<Ui>(make: PickMaking<Ui>):`).

## EXC-L04b-018
- **Padrão:** P-E11
- **Ocorrência:** `src/core/events/script.ts:104` `if (interaction.action === 'scroll-to') return`
- **Motivo:** a chamada de `scrollIntoView` está dentro do texto JavaScript gerado (um literal de modelo) e não é lida como valor do navegador por este módulo; nenhum valor do navegador sobrevive à chamada (`src/core/events/script.ts:89` `function actionJs(node: DocNode, interaction: Interaction, selectorOf: SelectorOf): string | null {`).

## EXC-L04b-019
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/commands.ts:133` `let name: string;`
- **Motivo:** variável local do tratador de `motion.add`, criada e descartada dentro da chamada (`src/core/motion/commands.ts:125` `export const addMotionCommand = registerHandler('motion.add',`).

## EXC-L04b-020
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/commands.ts:443` `let read: unknown = value;`
- **Motivo:** variável local do tratador de `motion.setEffectOption`, criada e descartada dentro da chamada (`src/core/motion/commands.ts:437` `export const setEffectOptionCommand = registerHandler('motion.setEffectOption',`).

## EXC-L04b-021
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/commands.ts:601` `let next: MotionTimeline;`
- **Motivo:** variável local do tratador de `motion.editKeyframe`, criada e descartada dentro da chamada (`src/core/motion/commands.ts:596` `export const editKeyframeCommand = registerHandler('motion.editKeyframe',`).

## EXC-L04b-022
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/document.ts:58` `let interactions = 0;`
- **Motivo:** variável local de `timelineUses`, criada e descartada dentro da chamada (`src/core/motion/document.ts:57` `export function timelineUses(document: DocumentJson, name: string): TimelineUses {`).

## EXC-L04b-023
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/document.ts:60` `let actions = 0;`
- **Motivo:** variável local de `timelineUses`, criada e descartada dentro da chamada (`src/core/motion/document.ts:57` `export function timelineUses(document: DocumentJson, name: string): TimelineUses {`).

## EXC-L04b-024
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/read.ts:183` `let previous = -1;`
- **Motivo:** variável local de `readKeyframes`, criada e descartada dentro da chamada (`src/core/motion/read.ts:178` `function readKeyframes(reader: Reader, value: unknown, path: string,`).

## EXC-L04b-025
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/read.ts:362` `let action: TimelineAction = { id, target, start, duration, effect };`
- **Motivo:** variável local de `readAction`, criada e descartada dentro da chamada (`src/core/motion/read.ts:351` `function readAction(reader: Reader, value: unknown, path: string,`).

## EXC-L04b-026
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/read.ts:449` `let interaction: MotionInteraction = { id, trigger, timeline, control };`
- **Motivo:** variável local de `readInteraction`, criada e descartada dentro da chamada (`src/core/motion/read.ts:438` `export function readInteraction(value: unknown): Read<MotionInteraction> {`).

## EXC-L04b-027
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/read.ts:481` `let behaviour: Behaviour = { kind, amount: reader.number(held.amount, 'amount', low, high) };`
- **Motivo:** variável local de `readBehaviour`, criada e descartada dentro da chamada (`src/core/motion/read.ts:474` `export function readBehaviour(value: unknown): Read<Behaviour> {`).

## EXC-L04b-028
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/record.ts:63` `let action = at.action;`
- **Motivo:** variável local de `recordStyleWrite`, criada e descartada dentro da chamada (`src/core/motion/record.ts:55` `export function recordStyleWrite<Ui>(context: HandlerContext<Ui>,`).

## EXC-L04b-029
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/record.ts:68` `let recorded = 0;`
- **Motivo:** variável local de `recordStyleWrite`, criada e descartada dentro da chamada (`src/core/motion/record.ts:55` `export function recordStyleWrite<Ui>(context: HandlerContext<Ui>,`).

## EXC-L04b-030
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/timeline.ts:160` `let low = -Infinity;`
- **Motivo:** variável local de `clampKeyframeDelta`, criada e descartada dentro da chamada (`src/core/motion/timeline.ts:158` `export function clampKeyframeDelta(timeline: MotionTimeline,`).

## EXC-L04b-031
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/timeline.ts:161` `let high = Infinity;`
- **Motivo:** variável local de `clampKeyframeDelta`, criada e descartada dentro da chamada (`src/core/motion/timeline.ts:158` `export function clampKeyframeDelta(timeline: MotionTimeline,`).

## EXC-L04b-032
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/timeline.ts:258` `let next = last > action.duration ? { ...action, duration: last } : action;`
- **Motivo:** variável local de `pasteKeyframes`, criada e descartada dentro da chamada (`src/core/motion/timeline.ts:252` `export function pasteKeyframes(timeline: MotionTimeline, actionId: string,`).

## EXC-L04b-033
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/view.ts:94` `let best: SnapTarget | null = null;`
- **Motivo:** variável local de `snapTime`, criada e descartada dentro da chamada (`src/core/motion/view.ts:93` `export function snapTime(time: number, targets: readonly SnapTarget[],`).

## EXC-L04b-034
- **Padrão:** P-E03
- **Ocorrência:** `src/core/motion/view.ts:95` `let distance = Infinity;`
- **Motivo:** variável local de `snapTime`, criada e descartada dentro da chamada (`src/core/motion/view.ts:93` `export function snapTime(time: number, targets: readonly SnapTarget[],`).

# Estado do lote L05a (store do editor, entrada e persistência)

Área: L05a. Arquivos cobertos: `src/app/`, `src/config/product.ts`, `src/editor/input/`, `src/editor/persistence/`, `src/editor/state.ts`, `src/editor/store.ts`, `src/editor/wiring.ts`, `src/env.d.ts`, `src/main.tsx`. Os arquivos `src/app/features.ts`, `src/app/modules.ts` e `src/app/modules-view.ts` escrevem nos registros de `src/core/commands/registry.ts` e `src/core/document/authoring.ts` (itens de outra área); os arquivos de teste do lote estão fora do alvo de código de `padroes.json`.

## EST-L05a-001 — registro da digitação pendente de um campo
- **Declaração:** `src/editor/input/pending.ts:27` `let held: Typing | null = null;`
- **Forma:** `Typing | null` (o campo, a região dele, o contexto da digitação, o predicado `owns` e a função `keep`)
- **Valores possíveis:** V1 null (nenhuma digitação pendente); V2 o `Typing` do campo digitado e não gravado; V3 o `Typing` de outro campo no instante em que `holdTyping` grava o anterior (`src/editor/input/pending.ts:31` `if (held !== null && held.field !== typing.field) keepTyping();`)
- **Escritores:** `src/editor/input/pending.ts:32` `  held = typing;` via `holdTyping`; `src/editor/input/pending.ts:37` `  if (held?.field === field) held = null;` via `releaseTyping`; `src/editor/input/pending.ts:47` `  held = null;` via `keepTyping`
- **Leitores:** `src/editor/input/pending.ts:41` `export const heldTyping = (): Typing | null => held;` via `heldTyping`; `src/editor/input/pending.ts:66` `  const typing = held;` via `keepTypingBefore`; `src/editor/input/pending.ts:77` `  const typing = held;` via `beforeCommand`
- **Criação:** `src/editor/input/pending.ts:27` `let held: Typing | null = null;`
- **Descarte:** `src/editor/input/pending.ts:47` `  held = null;`
- **Navegador:** não

## EST-L05a-002 — registro das ferramentas de ponteiro instaladas
- **Declaração:** `src/editor/input/pointer-tools.ts:66` `const tools: PointerTool[] = [];`
- **Forma:** `PointerTool[]` (lista ordenada; as ferramentas de módulos entram pela ordem de instalação)
- **Valores possíveis:** V1 vazio (nenhum módulo instalou ferramenta); V2 com a ferramenta do Layout Composer; V3 com a ferramenta removida de novo no meio da lista
- **Escritores:** `src/editor/input/pointer-tools.ts:71` `  tools.push(tool);` via `registerPointerTool`; `src/editor/input/pointer-tools.ts:74` `    if (at >= 0) tools.splice(at, 1);` via `registerPointerTool` (a função de remoção)
- **Leitores:** `src/editor/input/pointer-tools.ts:82` `  for (const tool of tools) {` via `toolPress`; `src/editor/input/pointer-tools.ts:92` `  for (const tool of tools) {` via `toolKeyContext`
- **Criação:** `src/editor/input/pointer-tools.ts:66` `const tools: PointerTool[] = [];`
- **Descarte:** `src/editor/input/pointer-tools.ts:74` `    if (at >= 0) tools.splice(at, 1);`
- **Navegador:** não

## EST-L05a-003 — letras seguradas durante um arraste
- **Declaração:** `src/editor/input/pointer-tools.ts:30` `const letters = new Set<string>();`
- **Forma:** `Set<string>` de letras em maiúscula
- **Valores possíveis:** V1 vazio; V2 com uma letra (ferramenta momentânea segurada); V3 com mais de uma letra; V4 esvaziado ao soltar a tecla, ao perder o foco da janela ou na desmontagem
- **Escritores:** `src/editor/input/pointer-tools.ts:33` `  if (down) letters.add(key.toUpperCase());` via `holdLetter`; `src/editor/input/pointer-tools.ts:34` `  else letters.delete(key.toUpperCase());` via `holdLetter`; `src/editor/input/pointer-tools.ts:37` `  letters.clear();` via `releaseLetters`
- **Leitores:** `src/editor/input/pointer-tools.ts:105` `  letters: [...letters],` via `toolPoint`
- **Criação:** `src/editor/input/pointer-tools.ts:30` `const letters = new Set<string>();`
- **Descarte:** `src/editor/input/pointer-tools.ts:37` `  letters.clear();`
- **Navegador:** não

## EST-L05a-004 — cache dos atalhos de comando por contexto
- **Declaração:** `src/editor/input/keymap.ts:95` `const HINTS = new Map<string, string | null>();`
- **Forma:** `Map<string, string | null>` com a chave `command context`
- **Valores possíveis:** V1 vazio; V2 com a chave guardada como `null` (o comando não tem atalho no contexto); V3 com o acorde guardado
- **Escritores:** `src/editor/input/keymap.ts:108` `  HINTS.set(key, found);` via `chordHint`
- **Leitores:** `src/editor/input/keymap.ts:98` `  const known = HINTS.get(key);` via `chordHint`
- **Criação:** `src/editor/input/keymap.ts:95` `const HINTS = new Map<string, string | null>();`
- **Descarte:** fim-da-página `src/editor/input/keymap.ts:95` `const HINTS = new Map<string, string | null>();`
- **Navegador:** não

## EST-L05a-005 — valor que cada campo de texto tinha ao receber o foco
- **Declaração:** `src/editor/input/keymap.ts:316` `  const focusValues = new WeakMap<EventTarget, string>();`
- **Forma:** `WeakMap<EventTarget, string>` fechado na instalação do teclado
- **Valores possíveis:** V1 sem entrada para o campo; V2 com o valor que o campo tinha ao receber o foco; V3 com o valor antigo enquanto o campo já foi esvaziado à mão
- **Escritores:** `src/editor/input/keymap.ts:551` `      focusValues.set(event.target, event.target.value);` via `onFocusIn`
- **Leitores:** `src/editor/input/keymap.ts:465` `    const untouched = field !== null && field.dataset.draft === undefined && focusValues.get(field) === field.value && (ownUndos.get(field) ?? 0) === 0;` via `onKeyDown`
- **Criação:** `src/editor/input/keymap.ts:316` `  const focusValues = new WeakMap<EventTarget, string>();`
- **Descarte:** `src/editor/input/keymap.ts:589` `  return () => {`
- **Navegador:** não

## EST-L05a-006 — contagem dos desfazeres nativos de cada campo
- **Declaração:** `src/editor/input/keymap.ts:317` `  const ownUndos = new WeakMap<EventTarget, number>();`
- **Forma:** `WeakMap<EventTarget, number>`
- **Valores possíveis:** V1 sem entrada; V2 com 0 (o campo recebeu o foco); V3 maior que 0 enquanto o campo tem um desfazer nativo pendente; V4 de volta a 0 quando o refazer nativo o consome
- **Escritores:** `src/editor/input/keymap.ts:552` `      ownUndos.set(event.target, 0);` via `onFocusIn`; `src/editor/input/keymap.ts:580` `    if (textField(event.target)) ownUndos.set(event.target, Math.max(0, (ownUndos.get(event.target) ?? 0) + (event.inputType === 'historyUndo' ? 1 : -1)));` via `onBeforeInput`
- **Leitores:** `src/editor/input/keymap.ts:465` `    const untouched = field !== null && field.dataset.draft === undefined && focusValues.get(field) === field.value && (ownUndos.get(field) ?? 0) === 0;` via `onKeyDown`
- **Criação:** `src/editor/input/keymap.ts:317` `  const ownUndos = new WeakMap<EventTarget, number>();`
- **Descarte:** `src/editor/input/keymap.ts:589` `  return () => {`
- **Navegador:** não

## EST-L05a-007 — controle que tomou o foco com o botão do ponteiro pressionado
- **Declaração:** `src/editor/input/keymap.ts:319` `  let pointerFocused: EventTarget | null = null;`
- **Forma:** `EventTarget | null`
- **Valores possíveis:** V1 null (o foco veio do teclado ou de um clique já solto); V2 o alvo do evento de foco, quando o ponteiro estava pressionado
- **Escritores:** `src/editor/input/keymap.ts:549` `    pointerFocused = views.pointerPressing() ? event.target : null;` via `onFocusIn`
- **Leitores:** `src/editor/input/keymap.ts:429` `    if (event.code === 'Space' && !FIELDS.includes(focused) && !typesText(event.target) && !spaceIsTheControls(event.target, focused, pointerFocused) && holdSpace(store, true)) {` via `onKeyDown`
- **Criação:** `src/editor/input/keymap.ts:319` `  let pointerFocused: EventTarget | null = null;`
- **Descarte:** `src/editor/input/keymap.ts:589` `  return () => {`
- **Navegador:** foco

## EST-L05a-008 — instante da última letra digitada
- **Declaração:** `src/editor/input/keymap.ts:344` `  let lastLetterAt = Number.NEGATIVE_INFINITY;`
- **Forma:** `number` (carimbo de tempo do evento)
- **Valores possíveis:** V1 `Number.NEGATIVE_INFINITY` (nenhuma rajada em curso); V2 o carimbo da última letra, enquanto a rajada de digitação corre
- **Escritores:** `src/editor/input/keymap.ts:393` `      lastLetterAt = event.timeStamp;` via `onKeyDown`; `src/editor/input/keymap.ts:370` `    lastLetterAt = Number.NEGATIVE_INFINITY;` via `endBurst`
- **Leitores:** `src/editor/input/keymap.ts:388` `    if ((!letter && event.key !== SHIFT) || (letter && event.timeStamp - lastLetterAt >= TYPING_BURST)) {` via `onKeyDown`
- **Criação:** `src/editor/input/keymap.ts:344` `  let lastLetterAt = Number.NEGATIVE_INFINITY;`
- **Descarte:** `src/editor/input/keymap.ts:589` `  return () => {`
- **Navegador:** não

## EST-L05a-009 — marca de que a rajada de letras é digitação
- **Declaração:** `src/editor/input/keymap.ts:345` `  let typing = false;`
- **Forma:** `boolean`
- **Valores possíveis:** V1 false; V2 true a partir da primeira letra que não casa atalho algum, até o fim da rajada
- **Escritores:** `src/editor/input/keymap.ts:479` `      typing = true;` via `onKeyDown`; `src/editor/input/keymap.ts:371` `    typing = false;` via `endBurst`
- **Leitores:** `src/editor/input/keymap.ts:391` `    const inBurst = letter && typing;` via `onKeyDown`
- **Criação:** `src/editor/input/keymap.ts:345` `  let typing = false;`
- **Descarte:** `src/editor/input/keymap.ts:589` `  return () => {`
- **Navegador:** não

## EST-L05a-010 — se as teclas de letra do canvas foram escolhidas
- **Declaração:** `src/editor/input/keymap.ts:351` `  let lettersChosen = true;`
- **Forma:** `boolean`
- **Valores possíveis:** V1 true (o canvas ou as Camadas foram escolhidos, ou o editor acabou de montar); V2 false quando o foco se perdeu para nenhum lugar; V3 recalculado a cada leitura de `readChoice` a partir dos contadores das visões
- **Escritores:** `src/editor/input/keymap.ts:358` `      lettersChosen = seenChoices > seenPresses || views.pressRegion() !== 'elsewhere';` via `readChoice`; `src/editor/input/keymap.ts:568` `    lettersChosen = false;` via `onFocusOut`
- **Leitores:** `src/editor/input/keymap.ts:493` `      if (!lettersChosen) {` via `onKeyDown`
- **Criação:** `src/editor/input/keymap.ts:351` `  let lettersChosen = true;`
- **Descarte:** `src/editor/input/keymap.ts:589` `  return () => {`
- **Navegador:** não

## EST-L05a-011 — contagem de pressões já vistas pelo teclado
- **Declaração:** `src/editor/input/keymap.ts:352` `  let seenPresses = views.pressCount();`
- **Forma:** `number`
- **Valores possíveis:** V1 a contagem das visões na montagem; V2 outra depois de uma pressão nova
- **Escritores:** `src/editor/input/keymap.ts:356` `      seenPresses = views.pressCount();` via `readChoice`
- **Leitores:** `src/editor/input/keymap.ts:355` `    if (views.pressCount() !== seenPresses || views.canvasChosenCount() !== seenChoices) {` via `readChoice`
- **Criação:** `src/editor/input/keymap.ts:352` `  let seenPresses = views.pressCount();`
- **Descarte:** `src/editor/input/keymap.ts:589` `  return () => {`
- **Navegador:** não

## EST-L05a-012 — contagem de escolhas do canvas pelo teclado já vistas
- **Declaração:** `src/editor/input/keymap.ts:353` `  let seenChoices = views.canvasChosenCount();`
- **Forma:** `number`
- **Valores possíveis:** V1 a contagem das visões na montagem; V2 outra depois do F6 ou de o teclado alcançar uma linha de Camadas
- **Escritores:** `src/editor/input/keymap.ts:357` `      seenChoices = views.canvasChosenCount();` via `readChoice`
- **Leitores:** `src/editor/input/keymap.ts:355` `    if (views.pressCount() !== seenPresses || views.canvasChosenCount() !== seenChoices) {` via `readChoice`
- **Criação:** `src/editor/input/keymap.ts:353` `  let seenChoices = views.canvasChosenCount();`
- **Descarte:** `src/editor/input/keymap.ts:589` `  return () => {`
- **Navegador:** não

## EST-L05a-013 — transação reversível da rajada de atalhos
- **Declaração:** `src/editor/input/keymap.ts:362` `  let burstSequence: CommandSequence | null = null;`
- **Forma:** `CommandSequence | null`
- **Valores possíveis:** V1 null; V2 a sequência aberta enquanto a rajada de letras corre e guarda os atalhos que a rajada rodou; V3 gravada ao fim da rajada; V4 cancelada quando a rajada vira digitação
- **Escritores:** `src/editor/input/keymap.ts:520` `        burstSequence = store.sequence();` via `onKeyDown`; `src/editor/input/keymap.ts:369` `    burstSequence = null;` via `endBurst`
- **Leitores:** `src/editor/input/keymap.ts:519` `      if (burstSequence?.active() !== true) {` via `onKeyDown`; `src/editor/input/keymap.ts:376` `    if (burstSequence?.cancel() === true) store.notice(message('status.keys.typedNotShortcuts', { keys: burstKeys }));` via `takeBackBurst`
- **Criação:** `src/editor/input/keymap.ts:362` `  let burstSequence: CommandSequence | null = null;`
- **Descarte:** `src/editor/input/keymap.ts:369` `    burstSequence = null;`
- **Navegador:** não

## EST-L05a-014 — temporizador do fim da rajada de digitação
- **Declaração:** `src/editor/input/keymap.ts:363` `  let burstTimer: number | undefined;`
- **Forma:** `number | undefined` (identificador de `setTimeout`)
- **Valores possíveis:** V1 `undefined` (nenhuma rajada); V2 o identificador armado pela última letra; V3 limpo por uma tecla que não é letra, por um clique ou pela desmontagem
- **Escritores:** `src/editor/input/keymap.ts:395` `      burstTimer = target.setTimeout(endBurst, TYPING_BURST);` via `onKeyDown`
- **Leitores:** `src/editor/input/keymap.ts:367` `    target.clearTimeout(burstTimer);` via `endBurst`
- **Criação:** `src/editor/input/keymap.ts:363` `  let burstTimer: number | undefined;`
- **Descarte:** `src/editor/input/keymap.ts:367` `    target.clearTimeout(burstTimer);`
- **Navegador:** não

## EST-L05a-015 — letras que a rajada já rodou
- **Declaração:** `src/editor/input/keymap.ts:364` `  let burstKeys = '';`
- **Forma:** `string`
- **Valores possíveis:** V1 vazio; V2 as letras acumuladas em maiúscula, ditas ao aviso quando a rajada se desfaz; V3 esvaziado ao fim ou ao cancelamento da rajada
- **Escritores:** `src/editor/input/keymap.ts:523` `      burstKeys += event.key.toUpperCase();` via `onKeyDown`; `src/editor/input/keymap.ts:372` `    burstKeys = '';` via `endBurst`
- **Leitores:** `src/editor/input/keymap.ts:376` `    if (burstSequence?.cancel() === true) store.notice(message('status.keys.typedNotShortcuts', { keys: burstKeys }));` via `takeBackBurst`
- **Criação:** `src/editor/input/keymap.ts:364` `  let burstKeys = '';`
- **Descarte:** `src/editor/input/keymap.ts:372` `    burstKeys = '';`
- **Navegador:** não

## EST-L05a-016 — aviso de teclas não escolhidas já dado
- **Declaração:** `src/editor/input/keymap.ts:365` `  let told = false;`
- **Forma:** `boolean`
- **Valores possíveis:** V1 false; V2 true depois de o aviso `status.keys.notChosen` ser dado uma vez na rajada
- **Escritores:** `src/editor/input/keymap.ts:496` `        told = true;` via `onKeyDown`; `src/editor/input/keymap.ts:373` `    told = false;` via `endBurst`
- **Leitores:** `src/editor/input/keymap.ts:495` `        if (!told) store.notice(message('status.keys.notChosen'));` via `onKeyDown`
- **Criação:** `src/editor/input/keymap.ts:365` `  let told = false;`
- **Descarte:** `src/editor/input/keymap.ts:373` `    told = false;`
- **Navegador:** não

## EST-L05a-017 — campo que recebeu o foco e o instante dele
- **Declaração:** `src/editor/input/select-on-focus.ts:11` `  let focused: { readonly field: HTMLInputElement; readonly at: number } | null = null;`
- **Forma:** `{ field: HTMLInputElement; at: number } | null`
- **Valores possíveis:** V1 null; V2 o campo de texto focado e o carimbo do evento de foco, até o clique seguinte
- **Escritores:** `src/editor/input/select-on-focus.ts:14` `    focused = field instanceof HTMLInputElement && field.matches(FIELDS) && isText(field) ? { field, at: event.timeStamp } : null;` via `onFocus`; `src/editor/input/select-on-focus.ts:18` `    focused = null;` via `onClick`
- **Leitores:** `src/editor/input/select-on-focus.ts:17` `    const was = focused;` via `onClick`
- **Criação:** `src/editor/input/select-on-focus.ts:11` `  let focused: { readonly field: HTMLInputElement; readonly at: number } | null = null;`
- **Descarte:** `src/editor/input/select-on-focus.ts:27` `    root.removeEventListener('click', onClick, true);`
- **Navegador:** foco

## EST-L05a-018 — marcadores de rascunho do campo (data-draft, data-draftRedo, data-shown)
- **Declaração:** `src/editor/input/drafts.ts:26` `  field.dataset.draft = typed ? DRAFT_TYPED : DRAFT_KEPT;`
- **Forma:** atributos `data-*` no elemento do campo (`data-draft` com `typed` ou `kept`, `data-draftRedo` numérico, `data-shown` com o valor gravado)
- **Valores possíveis:** V1 sem atributos (campo nunca digitado); V2 `data-draft="kept"` com o valor gravado; V3 `data-draft="typed"` com digitação não gravada; V4 `data-draftRedo` maior que 0 com um desfazer nativo pendente; V5 de volta a `kept` e `0`
- **Escritores:** `src/editor/input/drafts.ts:12` `  field.dataset.shown = value;` via `markFieldKept`; `src/editor/input/drafts.ts:13` `  field.dataset.draft = DRAFT_KEPT;` via `markFieldKept`; `src/editor/input/drafts.ts:24` `  field.dataset.draftRedo = String(inputType === 'historyUndo' ? redo + 1 : inputType === 'historyRedo' ? Math.max(0, redo - 1) : 0);` via `recordFieldInput`; `src/editor/input/drafts.ts:26` `  field.dataset.draft = typed ? DRAFT_TYPED : DRAFT_KEPT;` via `recordFieldInput`
- **Leitores:** `src/editor/input/drafts.ts:17` `export const hasDraftRedo = (field: DraftField): boolean => Number(field.dataset.draftRedo ?? 0) > 0;` via `hasDraftRedo`; `src/editor/input/drafts.ts:25` `  const typed = !inputType.startsWith('history') || field.value !== field.dataset.shown;` via `recordFieldInput`; `src/editor/input/keymap.ts:252` `  (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) && target.dataset.draft === DRAFT_KEPT && target.value === target.dataset.shown;` via `keptField`; `src/editor/persistence/drafts.ts:90` `  if (key === null || field.dataset.shown === undefined) return;` via `saveFieldDraft`
- **Criação:** `src/editor/input/drafts.ts:12` `  field.dataset.shown = value;`
- **Descarte:** fim-da-página `src/editor/input/drafts.ts:11` `export function markFieldKept(field: DraftField, value: string): void {`
- **Navegador:** não

## EST-L05a-019 — estado do ponteiro que sobrevive a um gesto, por store
- **Declaração:** `src/editor/input/pointer/shared.ts:21` `const SHARED = new WeakMap<EditorStore, PointerShared>();`
- **Forma:** `WeakMap<EditorStore, PointerShared>`: o `PointerShared` guarda `spaceDown`, `overStage`, o pan em curso (`panning`), `panDispatch`, o gesto aberto (`open`), a sessão do seletor de cor (`session`), `sessionDispatch` e `pendingPickerEnd` (`src/editor/input/pointer/shared.ts:11` `export interface PointerShared {`)
- **Valores possíveis:** V1 store sem entrada (primeira chamada de `sharedOf`); V2 o objeto com `spaceDown` falso e sem pan; V3 `spaceDown` verdadeiro e `panning` com o pan em curso; V4 `open` com um gesto aberto; V5 `session` com a sessão do seletor de cor; V6 `pendingPickerEnd` armado enquanto o seletor fecha
- **Escritores:** `src/editor/input/pointer/shared.ts:26` `    SHARED.set(store, shared);` via `sharedOf`; `src/editor/input/pointer/common.ts:264` `  shared.spaceDown = true;` via `holdSpace`; `src/editor/input/pointer/events.ts:245` `        shared.open = gesture;` via `onDown`
- **Leitores:** `src/editor/input/pointer/shared.ts:23` `  let shared = SHARED.get(store);` via `sharedOf`; `src/editor/input/pointer/common.ts:263` `  if (!shared.overStage && shared.panning === null) return false;` via `holdSpace`
- **Criação:** `src/editor/input/pointer/shared.ts:25` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };`
- **Descarte:** `src/editor/input/pointer.ts:224` `    shared.panning = null;`
- **Navegador:** não

## EST-L05a-020 — o que uma libertação de deslizador escreve, por elemento
- **Declaração:** `src/editor/input/pointer/common.ts:397` `export const SLIDER_COMMITS = new WeakMap<HTMLInputElement, (value: string) => void>();`
- **Forma:** `WeakMap<HTMLInputElement, (value: string) => void>`
- **Valores possíveis:** V1 sem entrada; V2 com a função que grava o texto do campo, registada pela campo que desenha o deslizador; V3 removida quando o campo se desmonta
- **Escritores:** `src/editor/input/pointer/common.ts:399` `  SLIDER_COMMITS.set(element, commit);` via `registerSlider`; `src/editor/input/pointer/common.ts:400` `  return () => SLIDER_COMMITS.delete(element);` via `registerSlider` (a remoção)
- **Leitores:** `src/editor/input/pointer/events.ts:75` `    const commit = event.button === 0 && event.target instanceof HTMLInputElement && event.target.type === 'range' ? (SLIDER_COMMITS.get(event.target) ?? null) : null;` via `onDown`
- **Criação:** `src/editor/input/pointer/common.ts:397` `export const SLIDER_COMMITS = new WeakMap<HTMLInputElement, (value: string) => void>();`
- **Descarte:** `src/editor/input/pointer/common.ts:400` `  return () => SLIDER_COMMITS.delete(element);`
- **Navegador:** não

## EST-L05a-021 — o passo de cada controlo que repete enquanto pressionado, por elemento
- **Declaração:** `src/editor/input/pointer/common.ts:408` `export const REPEATS = new WeakMap<HTMLElement, (modifier: string | null) => void>();`
- **Forma:** `WeakMap<HTMLElement, (modifier: string | null) => void>`
- **Valores possíveis:** V1 sem entrada; V2 com o passo registado pelo controlo; V3 removido quando o controlo se desmonta
- **Escritores:** `src/editor/input/pointer/common.ts:412` `  REPEATS.set(element, step);` via `registerRepeat`; `src/editor/input/pointer/common.ts:413` `  return () => REPEATS.delete(element);` via `registerRepeat` (a remoção)
- **Leitores:** `src/editor/input/pointer/events.ts:82` `    const repeat = repeater === null ? undefined : REPEATS.get(repeater);` via `onDown`
- **Criação:** `src/editor/input/pointer/common.ts:408` `export const REPEATS = new WeakMap<HTMLElement, (modifier: string | null) => void>();`
- **Descarte:** `src/editor/input/pointer/common.ts:413` `  return () => REPEATS.delete(element);`
- **Navegador:** não

## EST-L05a-022 — janela que tem dono do ponteiro, e de quem ela é
- **Declaração:** `src/editor/input/pointer/common.ts:544` `export const OWNERS = new WeakMap<Window, EditorStore>();`
- **Forma:** `WeakMap<Window, EditorStore>`
- **Valores possíveis:** V1 janela sem entrada (livre); V2 a janela com o store do editor instalado; V3 a janela de novo livre depois da desmontagem do dono
- **Escritores:** `src/editor/input/pointer.ts:84` `  OWNERS.set(target, store);` via `installPointer`; `src/editor/input/pointer.ts:232` `    if (OWNERS.get(target) === store) OWNERS.delete(target);` via `installPointer` (a remoção)
- **Leitores:** `src/editor/input/pointer.ts:78` `  const owner = OWNERS.get(target);` via `installPointer`
- **Criação:** `src/editor/input/pointer/common.ts:544` `export const OWNERS = new WeakMap<Window, EditorStore>();`
- **Descarte:** `src/editor/input/pointer.ts:232` `    if (OWNERS.get(target) === store) OWNERS.delete(target);`
- **Navegador:** não

## EST-L05a-023 — visões do ponteiro, por store
- **Declaração:** `src/editor/input/pointer/views.ts:221` `const VIEWS = new WeakMap<object, PointerViews>();`
- **Forma:** `WeakMap<object, PointerViews>`
- **Valores possíveis:** V1 store sem entrada; V2 o store com as visões criadas na primeira leitura
- **Escritores:** `src/editor/input/pointer/views.ts:226` `    VIEWS.set(store, views);` via `pointerViews`
- **Leitores:** `src/editor/input/pointer/views.ts:223` `  let views = VIEWS.get(store);` via `pointerViews`
- **Criação:** `src/editor/input/pointer/views.ts:221` `const VIEWS = new WeakMap<object, PointerViews>();`
- **Descarte:** fim-da-página `src/editor/input/pointer/views.ts:221` `const VIEWS = new WeakMap<object, PointerViews>();`
- **Navegador:** não

## EST-L05a-024 — células publicadas do ponteiro (valor com ouvintes)
- **Declaração:** `src/editor/input/pointer/views.ts:89` `  let value = first;`
- **Forma:** uma célula por valor publicado, com o valor e o `Set` de ouvintes; as células são `band`, `hover`, `menuOver`, `measuring`, `resizingNow`, `bandingNow`, `canvasPointer`, `guideOverRuler`, `panState`, `drag`, `lastDrop` e `ghostReturn` (`src/editor/input/pointer/views.ts:107` `  const band = published<Band | null>(null);`)
- **Valores possíveis:** V1 o valor inicial (null, false, `'idle'`); V2 o valor publicado enquanto um gesto corre; V3 o valor publicado de novo, notificando os ouvintes; V4 o mesmo valor (a publicação não notifica); V5 com ouvintes inscritos pelo cromo do canvas e pelas barras
- **Escritores:** `src/editor/input/pointer/views.ts:99` `      value = next;` via `set` de `published`
- **Leitores:** `src/editor/input/pointer/views.ts:92` `    get: () => value,` via `get` de `published`
- **Criação:** `src/editor/input/pointer/views.ts:88` `function published<T>(first: T, same: (a: T, b: T) => boolean = (a, b) => a === b): Published<T> & { readonly set: (next: T) => void } {`
- **Descarte:** fim-da-página `src/editor/input/pointer/views.ts:91` `  return {`
- **Navegador:** não

## EST-L05a-025 — ouvintes de pressão fora do alvo
- **Declaração:** `src/editor/input/pointer/views.ts:150` `  const outsidePressListeners = new Set<(target: Node) => void>();`
- **Forma:** `Set<(target: Node) => void>`
- **Valores possíveis:** V1 vazio; V2 com os ouvintes das camadas não modais inscritos; V3 esvaziado quando cada camada se desinscreve
- **Escritores:** `src/editor/input/pointer/views.ts:205` `        outsidePressListeners.add(listener);` via `outsidePress.subscribe`; `src/editor/input/pointer/views.ts:207` `          outsidePressListeners.delete(listener);` via `outsidePress.subscribe` (a remoção)
- **Leitores:** `src/editor/input/pointer/views.ts:213` `      for (const listener of outsidePressListeners) listener(target);` via `publishOutsidePress`
- **Criação:** `src/editor/input/pointer/views.ts:150` `  const outsidePressListeners = new Set<(target: Node) => void>();`
- **Descarte:** `src/editor/input/pointer/views.ts:207` `          outsidePressListeners.delete(listener);`
- **Navegador:** não

## EST-L05a-026 — onde a última pressão pousou
- **Declaração:** `src/editor/input/pointer/views.ts:136` `  let lastPress: Point | null = null;`
- **Forma:** `Point | null`
- **Valores possíveis:** V1 null; V2 o ponto da pressão, guardado antes de a pressão ser resolvida
- **Escritores:** `src/editor/input/pointer/views.ts:170` `      lastPress = at;` via `setPressPoint`
- **Leitores:** `src/editor/input/pointer/views.ts:168` `    pressPoint: (): Point | null => lastPress,` via `pressPoint`
- **Criação:** `src/editor/input/pointer/views.ts:136` `  let lastPress: Point | null = null;`
- **Descarte:** fim-da-página `src/editor/input/pointer/views.ts:136` `  let lastPress: Point | null = null;`
- **Navegador:** não

## EST-L05a-027 — região da última pressão
- **Declaração:** `src/editor/input/pointer/views.ts:140` `  let lastRegion: PressRegion = 'elsewhere';`
- **Forma:** `PressRegion` (`'canvas'`, `'layers'`, `'elsewhere'`)
- **Valores possíveis:** V1 `'elsewhere'`; V2 `'canvas'`; V3 `'layers'`
- **Escritores:** `src/editor/input/pointer/views.ts:175` `      lastRegion = region;` via `setPressRegion`
- **Leitores:** `src/editor/input/pointer/views.ts:172` `    pressRegion: (): PressRegion => lastRegion,` via `pressRegion`
- **Criação:** `src/editor/input/pointer/views.ts:140` `  let lastRegion: PressRegion = 'elsewhere';`
- **Descarte:** fim-da-página `src/editor/input/pointer/views.ts:140` `  let lastRegion: PressRegion = 'elsewhere';`
- **Navegador:** não

## EST-L05a-028 — ordem das escolhas de região
- **Declaração:** `src/editor/input/pointer/views.ts:141` `  let choiceOrder = 0;`
- **Forma:** `number`
- **Valores possíveis:** V1 0; V2 o valor de `presses` no instante de uma pressão; V3 o valor de `keyboardChoices` quando o teclado escolhe o canvas
- **Escritores:** `src/editor/input/pointer/views.ts:176` `      presses = ++choiceOrder;` via `setPressRegion`; `src/editor/input/pointer/views.ts:180` `      keyboardChoices = ++choiceOrder;` via `chooseCanvasByKeyboard`
- **Leitores:** `src/editor/input/pointer/views.ts:176` `      presses = ++choiceOrder;` via `setPressRegion`
- **Criação:** `src/editor/input/pointer/views.ts:141` `  let choiceOrder = 0;`
- **Descarte:** fim-da-página `src/editor/input/pointer/views.ts:141` `  let choiceOrder = 0;`
- **Navegador:** não

## EST-L05a-029 — número de pressões vistas
- **Declaração:** `src/editor/input/pointer/views.ts:142` `  let presses = 0;`
- **Forma:** `number`
- **Valores possíveis:** V1 0; V2 o valor da ordem da última pressão
- **Escritores:** `src/editor/input/pointer/views.ts:176` `      presses = ++choiceOrder;` via `setPressRegion`
- **Leitores:** `src/editor/input/pointer/views.ts:173` `    pressCount: (): number => presses,` via `pressCount`
- **Criação:** `src/editor/input/pointer/views.ts:142` `  let presses = 0;`
- **Descarte:** fim-da-página `src/editor/input/pointer/views.ts:142` `  let presses = 0;`
- **Navegador:** não

## EST-L05a-030 — número de escolhas do canvas pelo teclado
- **Declaração:** `src/editor/input/pointer/views.ts:143` `  let keyboardChoices = 0;`
- **Forma:** `number`
- **Valores possíveis:** V1 0; V2 o valor da ordem da última escolha pelo teclado
- **Escritores:** `src/editor/input/pointer/views.ts:180` `      keyboardChoices = ++choiceOrder;` via `chooseCanvasByKeyboard`
- **Leitores:** `src/editor/input/pointer/views.ts:178` `    canvasChosenCount: (): number => keyboardChoices,` via `canvasChosenCount`
- **Criação:** `src/editor/input/pointer/views.ts:143` `  let keyboardChoices = 0;`
- **Descarte:** fim-da-página `src/editor/input/pointer/views.ts:143` `  let keyboardChoices = 0;`
- **Navegador:** não

## EST-L05a-031 — se um botão do ponteiro está pressionado no editor
- **Declaração:** `src/editor/input/pointer/views.ts:146` `  let pressing = false;`
- **Forma:** `boolean`
- **Valores possíveis:** V1 false; V2 true do início de cada pressão até a libertação; V3 true durante o instante em que uma pressão anterior ficou sem libertação
- **Escritores:** `src/editor/input/pointer/views.ts:184` `      pressing = down;` via `setPressing`
- **Leitores:** `src/editor/input/pointer/views.ts:182` `    pointerPressing: (): boolean => pressing,` via `pointerPressing`
- **Criação:** `src/editor/input/pointer/views.ts:146` `  let pressing = false;`
- **Descarte:** fim-da-página `src/editor/input/pointer/views.ts:146` `  let pressing = false;`
- **Navegador:** não

## EST-L05a-032 — numeração dos últimos elementos soltos
- **Declaração:** `src/editor/input/pointer/views.ts:147` `  let drops = 0;`
- **Forma:** `number`
- **Valores possíveis:** V1 0; V2 incrementado a cada soltura que mudou o documento
- **Escritores:** `src/editor/input/pointer/views.ts:194` `      drops += 1;` via `setDropped`
- **Leitores:** `src/editor/input/pointer/views.ts:195` `      lastDrop.set({ id: drops, nodes });` via `setDropped`
- **Criação:** `src/editor/input/pointer/views.ts:147` `  let drops = 0;`
- **Descarte:** fim-da-página `src/editor/input/pointer/views.ts:147` `  let drops = 0;`
- **Navegador:** não

## EST-L05a-033 — numeração dos fantasmas que voltam
- **Declaração:** `src/editor/input/pointer/views.ts:148` `  let ghostReturns = 0;`
- **Forma:** `number`
- **Valores possíveis:** V1 0; V2 incrementado a cada fantasma novo (o Escape de um arraste de criação)
- **Escritores:** `src/editor/input/pointer/views.ts:200` `      if (next !== null) ghostReturns += 1;` via `setGhostReturn`
- **Leitores:** `src/editor/input/pointer/views.ts:201` `      ghostReturn.set(next === null ? null : { id: ghostReturns, ...next });` via `setGhostReturn`
- **Criação:** `src/editor/input/pointer/views.ts:148` `  let ghostReturns = 0;`
- **Descarte:** fim-da-página `src/editor/input/pointer/views.ts:148` `  let ghostReturns = 0;`
- **Navegador:** não

## EST-L05a-034 — sessão do dono do ponteiro de um editor
- **Declaração:** `src/editor/input/pointer.ts:92` `  const ps: PointerSession = {`
- **Forma:** `PointerSession` (a máquina do gesto, os botões, cada arraste em curso, os temporizadores, o seletor de cor, o pan e o ponteiro capturado; `src/editor/input/pointer/owner.ts:22` `export interface PointerSession {`)
- **Valores possíveis:** V1 ocioso, com `machine` em `idle` e os campos de arraste a null; V2 pressionado, com `machine` em `pressed` e `buttons` preenchido; V3 arrastando, com `machine` em `dragging` e um dos campos de arraste preenchido; V4 durante um gesto cancelado, com `cancelsAtOpen` comparado às cancelagens do estado; V5 com `captured` a segurar o ponteiro; V6 com `tooling` a segurar a sessão de uma ferramenta
- **Escritores:** `src/editor/input/pointer/events.ts:232` `    ps.machine = next.machine;` via `onDown`; `src/editor/input/pointer/events.ts:265` `      ps.menuResting = menuUnder;` via `onMove`; `src/editor/input/pointer/effects.ts:169` `      ps.dragging = null;` via `run`
- **Leitores:** `src/editor/input/pointer/events.ts:38` `    if (ps.machine.phase !== 'idle' || shared.open !== null || event.button !== 0) return;` via `onDoubleClick`; `src/editor/input/pointer/drag.ts:119` `    if (ps.dragging === null || !frame) return;` via `autoscroll`
- **Criação:** `src/editor/input/pointer.ts:92` `  const ps: PointerSession = {`
- **Descarte:** `src/editor/input/pointer.ts:215` `  return () => {`
- **Navegador:** não

## EST-L05a-035 — regras por camada (base, ponto de quebra, estado), memoizadas
- **Declaração:** `src/editor/store.ts:82` `const layeredByKey = new WeakMap<ModelRules, Map<string, ModelRules>>();`
- **Forma:** `WeakMap<ModelRules, Map<string, ModelRules>>`, com a chave `breakpoint|state`
- **Valores possíveis:** V1 sem entrada para o projeto; V2 o mapa do projeto com a camada pedida; V3 a camada já guardada, devolvida a partir da chave
- **Escritores:** `src/editor/store.ts:90` `    layeredByKey.set(project, byLayer);` via `layeredRules`; `src/editor/store.ts:96` `    byLayer.set(key, rules);` via `layeredRules`
- **Leitores:** `src/editor/store.ts:87` `  let byLayer = layeredByKey.get(project);` via `layeredRules`; `src/editor/store.ts:93` `  let rules = byLayer.get(key);` via `layeredRules`
- **Criação:** `src/editor/store.ts:82` `const layeredByKey = new WeakMap<ModelRules, Map<string, ModelRules>>();`
- **Descarte:** fim-da-página `src/editor/store.ts:82` `const layeredByKey = new WeakMap<ModelRules, Map<string, ModelRules>>();`
- **Navegador:** não

## EST-L05a-036 — a store do editor
- **Declaração:** `src/editor/store.ts:110` `export function createEditorStore(options: EditorStoreOptions = {}): EditorStore {`
- **Forma:** `EditorStore` (o estado do documento, da seleção e da interface, com `dispatch`, `gesture`, `sequence`, `commandGroup` e `subscribe`)
- **Valores possíveis:** V1 a store recém-criada, restaurada ou vazia; V2 a store com um gesto aberto; V3 a store com uma sequência aberta (a rajada do teclado); V4 a store com um grupo de comandos ocupado; V5 a store com uma gravação adiada em `waiting`; V6 a store em modo somente leitura (aba sem a trava de edição)
- **Escritores:** `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` via `gestureSafe`; `src/editor/store.ts:217` `      if (store.commandGroupOpen()) return { dispatch: (id, args) => store.dispatch(id, args), commit: () => undefined, cancel: () => undefined };` via `gestureSafe`
- **Leitores:** `src/editor/store.ts:235` `      const edited = heldTyping() === null ? null : editedKey(store.getState());` via `gestureSafe`; `src/editor/store.ts:275` `  return useSyncExternalStore(store.subscribe, () => select(store.getState()));` via `useEditorState`
- **Criação:** `src/editor/store.ts:120` `  const store = createStore<EditorUi>({`; `src/main.tsx:64` `const store = createEditorStore({ restored, recovery, narrow: windowIsNarrow() });`
- **Descarte:** fim-da-página `src/editor/store.ts:170` `  return gestureSafe(store);`
- **Navegador:** não

## EST-L05a-037 — contexto React da store do editor
- **Declaração:** `src/editor/store.ts:264` `export const StoreContext = createContext<EditorStore | null>(null);`
- **Forma:** `React.Context<EditorStore | null>`
- **Valores possíveis:** V1 null (nenhum provedor acima); V2 a store do editor
- **Escritores:** `src/editor/app.tsx:6` `    <StoreContext.Provider value={store}>` via o provedor montado por `App`
- **Leitores:** `src/editor/store.ts:267` `  const store = useContext(StoreContext);` via `useStore`
- **Criação:** `src/editor/store.ts:264` `export const StoreContext = createContext<EditorStore | null>(null);`
- **Descarte:** fim-da-página `src/editor/store.ts:264` `export const StoreContext = createContext<EditorStore | null>(null);`
- **Navegador:** não

## EST-L05a-038 — gesto aberto visto pela store do editor
- **Declaração:** `src/editor/store.ts:186` `  let open: Gesture | null = null;`
- **Forma:** `Gesture | null` fechado em `gestureSafe`
- **Valores possíveis:** V1 null; V2 o gesto aberto por `gesture()`, até o `commit` ou o `cancel`; V3 null de novo depois de `settle` correr as gravações adiadas
- **Escritores:** `src/editor/store.ts:219` `      open = gesture;` via `gestureSafe.gesture`; `src/editor/store.ts:189` `    open = null;` via `settle`
- **Leitores:** `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` via `gestureSafe.dispatch`
- **Criação:** `src/editor/store.ts:186` `  let open: Gesture | null = null;`
- **Descarte:** `src/editor/store.ts:189` `    open = null;`
- **Navegador:** não

## EST-L05a-039 — gravações adiadas até o gesto fechar
- **Declaração:** `src/editor/store.ts:187` `  const waiting: (() => void)[] = [];`
- **Forma:** `(() => void)[]`
- **Valores possíveis:** V1 vazio; V2 com as gravações que mudam o documento chegadas com um gesto aberto; V3 esvaziado em ordem quando o gesto fecha
- **Escritores:** `src/editor/store.ts:243` `        waiting.push(() => void store.dispatch(id, args, asked));` via `gestureSafe.dispatch`
- **Leitores:** `src/editor/store.ts:190` `    for (const run of waiting.splice(0)) run();` via `settle`
- **Criação:** `src/editor/store.ts:187` `  const waiting: (() => void)[] = [];`
- **Descarte:** `src/editor/store.ts:190` `    for (const run of waiting.splice(0)) run();`
- **Navegador:** não

## EST-L05a-040 — a composição do editor instalada
- **Declaração:** `src/editor/wiring.ts:23` `let installed: EditorWiring | null = null;`
- **Forma:** `EditorWiring | null`
- **Valores possíveis:** V1 null (antes da instalação); V2 a composição instalada por `src/main.tsx`
- **Escritores:** `src/editor/wiring.ts:26` `  installed = wiring;` via `installWiring`
- **Leitores:** `src/editor/wiring.ts:30` `  if (installed === null) throw new Error('the editor wiring is not installed (src/app/wiring.ts)');` via `wiring`; `src/editor/wiring.ts:31` `  return installed;` via `wiring`
- **Criação:** `src/editor/wiring.ts:23` `let installed: EditorWiring | null = null;`
- **Descarte:** fim-da-página `src/editor/wiring.ts:23` `let installed: EditorWiring | null = null;`
- **Navegador:** não

## EST-L05a-041 — valor lido uma vez na primeira utilização
- **Declaração:** `src/editor/wiring.ts:37` `  let value: { readonly v: T } | null = null;`
- **Forma:** `{ v: T } | null` por chamada de `onFirstUse`
- **Valores possíveis:** V1 null (ainda não perguntado); V2 a caixa com o valor lido
- **Escritores:** `src/editor/wiring.ts:38` `  return () => (value ??= { v: read() }).v;` via a função devolvida por `onFirstUse`
- **Leitores:** `src/editor/wiring.ts:38` `  return () => (value ??= { v: read() }).v;` via a função devolvida por `onFirstUse`
- **Criação:** `src/editor/wiring.ts:37` `  let value: { readonly v: T } | null = null;`
- **Descarte:** fim-da-página `src/editor/wiring.ts:37` `  let value: { readonly v: T } | null = null;`
- **Navegador:** não

## EST-L05a-042 — memorização do `duplicating` por store, no controlo
- **Declaração:** `src/editor/input/pointer/use-views.ts:21` `  const view = useMemo(() => duplicating(store), [store]);`
- **Forma:** a célula do `useMemo` do React: `{ get, subscribe }` para a store atual
- **Valores possíveis:** V1 a célula criada na montagem do controlo; V2 a célula refeita quando a store muda de identidade; V3 descartada com a desmontagem do controlo
- **Escritores:** `src/editor/input/pointer/use-views.ts:21` `  const view = useMemo(() => duplicating(store), [store]);` via `useDuplicating`
- **Leitores:** `src/editor/input/pointer/use-views.ts:22` `  return useSyncExternalStore(view.subscribe, view.get);` via `useDuplicating`
- **Criação:** `src/editor/input/pointer/use-views.ts:21` `  const view = useMemo(() => duplicating(store), [store]);`
- **Descarte:** `src/editor/input/pointer/use-views.ts:21` `  const view = useMemo(() => duplicating(store), [store]);`
- **Navegador:** não

## EST-L05a-043 — papel da aba na trava de edição
- **Declaração:** `src/editor/persistence/tab-guard.ts:9` `let role: TabRole = 'editing';`
- **Forma:** `TabRole` (`'editing'`, `'readOnly'`, `'lost'`)
- **Valores possíveis:** V1 `'editing'` (inicial, e depois da trava tomada); V2 `'readOnly'` quando outra aba segura a trava; V3 `'lost'` quando a trava foi tomada desta aba; V4 `'readOnly'` depois de a aba perder a trava
- **Escritores:** `src/editor/persistence/tab-guard.ts:21` `  role = next;` via `setRole`
- **Leitores:** `src/editor/persistence/tab-guard.ts:13` `  get: (): TabRole => role,` via `tabRole.get`; `src/editor/persistence/tab-guard.ts:24` `export const isEditing = (): boolean => role === 'editing';` via `isEditing`
- **Criação:** `src/editor/persistence/tab-guard.ts:9` `let role: TabRole = 'editing';`
- **Descarte:** fim-da-página `src/editor/persistence/tab-guard.ts:9` `let role: TabRole = 'editing';`
- **Navegador:** não

## EST-L05a-044 — ouvintes do papel da aba
- **Declaração:** `src/editor/persistence/tab-guard.ts:10` `const listeners = new Set<() => void>();`
- **Forma:** `Set<() => void>`
- **Valores possíveis:** V1 vazio; V2 com os ouvintes do aviso e do somente-leitura
- **Escritores:** `src/editor/persistence/tab-guard.ts:15` `    listeners.add(listener);` via `tabRole.subscribe`
- **Leitores:** `src/editor/persistence/tab-guard.ts:22` `  for (const listener of [...listeners]) listener();` via `setRole`
- **Criação:** `src/editor/persistence/tab-guard.ts:10` `const listeners = new Set<() => void>();`
- **Descarte:** `src/editor/persistence/tab-guard.ts:16` `    return () => listeners.delete(listener);`
- **Navegador:** não

## EST-L05a-045 — tentativas de tomar a trava de edição
- **Declaração:** `src/editor/persistence/tab-guard.ts:36` `  let tries = 0;`
- **Forma:** `number` fechado na promessa de `claimEditing`
- **Valores possíveis:** V1 0; V2 incrementado a cada tentativa enquanto a trava está com outra aba; V3 igual a `RETRIES` quando esta aba fica somente leitura; V4 interrompido quando a trava é tomada
- **Escritores:** `src/editor/persistence/tab-guard.ts:42` `            tries += 1;` via `ask`
- **Leitores:** `src/editor/persistence/tab-guard.ts:43` `            if (tries < RETRIES) {` via `ask`
- **Criação:** `src/editor/persistence/tab-guard.ts:36` `  let tries = 0;`
- **Descarte:** `src/editor/persistence/tab-guard.ts:37` `  return new Promise((resolve) => {`
- **Navegador:** não

## EST-L05a-046 — store que os rascunhos usam
- **Declaração:** `src/editor/persistence/drafts.ts:36` `let store: EditorStore | null = null;`
- **Forma:** `EditorStore | null`
- **Valores possíveis:** V1 null (nenhum trabalho de rascunho ativo); V2 a store ligada por `startDrafts`; V3 null de novo na desmontagem
- **Escritores:** `src/editor/persistence/drafts.ts:153` `  store = owner;` via `startDrafts`; `src/editor/persistence/drafts.ts:198` `    store = null;` via `startDrafts` (a limpeza)
- **Leitores:** `src/editor/persistence/drafts.ts:88` `  if (restoring || !store || !mayWrite()) return;` via `saveFieldDraft`; `src/editor/persistence/drafts.ts:137` `  const original = locate(store.getState().document, node)?.node;` via `saveCanvasDraft`
- **Criação:** `src/editor/persistence/drafts.ts:36` `let store: EditorStore | null = null;`
- **Descarte:** `src/editor/persistence/drafts.ts:198` `    store = null;`
- **Navegador:** não

## EST-L05a-047 — leitor da revisão gravada, para os rascunhos
- **Declaração:** `src/editor/persistence/drafts.ts:37` `let revision = () => 0;`
- **Forma:** `() => number`
- **Valores possíveis:** V1 a função que devolve 0 (antes de `startDrafts`); V2 `currentWorkRevision` do autosave
- **Escritores:** `src/editor/persistence/drafts.ts:154` `  revision = currentRevision;` via `startDrafts`
- **Leitores:** `src/editor/persistence/drafts.ts:74` `    version: 1 as const, revision: revision(), selection: [...(state?.selection ?? [])],` via `context`
- **Criação:** `src/editor/persistence/drafts.ts:37` `let revision = () => 0;`
- **Descarte:** fim-da-página `src/editor/persistence/drafts.ts:37` `let revision = () => 0;`
- **Navegador:** não

## EST-L05a-048 — se esta aba pode escrever rascunhos
- **Declaração:** `src/editor/persistence/drafts.ts:38` `let mayWrite = () => false;`
- **Forma:** `() => boolean`
- **Valores possíveis:** V1 a função que devolve false (antes de `startDrafts`); V2 `isEditing` da trava de abas
- **Escritores:** `src/editor/persistence/drafts.ts:155` `  mayWrite = canWrite;` via `startDrafts`
- **Leitores:** `src/editor/persistence/drafts.ts:62` `export const hasPendingDraft = (): boolean => held !== null && mayWrite();` via `hasPendingDraft`; `src/editor/persistence/drafts.ts:88` `  if (restoring || !store || !mayWrite()) return;` via `saveFieldDraft`
- **Criação:** `src/editor/persistence/drafts.ts:38` `let mayWrite = () => false;`
- **Descarte:** fim-da-página `src/editor/persistence/drafts.ts:38` `let mayWrite = () => false;`
- **Navegador:** não

## EST-L05a-049 — rascunho em memória
- **Declaração:** `src/editor/persistence/drafts.ts:39` `let held: Draft | null = null;`
- **Forma:** `Draft | null` (do campo ou do canvas, com o contexto da digitação, a revisão e a seleção)
- **Valores possíveis:** V1 null; V2 o rascunho de campo não gravado; V3 o rascunho de canvas não gravado; V4 o rascunho restaurado da sessão anterior, antes de o controlo o aplicar; V5 o rascunho de outro elemento ou de outra revisão, já invalidado
- **Escritores:** `src/editor/persistence/drafts.ts:64` `  held = next;` via `persist`; `src/editor/persistence/drafts.ts:160` `    if (parsed.success && canWrite() && parsed.data.revision === revision() && JSON.stringify(parsed.data.selection) === JSON.stringify(owner.getState().selection)) held = parsed.data;` via `startDrafts`; `src/editor/persistence/drafts.ts:156` `  held = null;` via `startDrafts`
- **Leitores:** `src/editor/persistence/drafts.ts:57` `  if (held?.kind === 'canvas') canvasCapture?.();` via `flushDraftCaret`; `src/editor/persistence/drafts.ts:62` `export const hasPendingDraft = (): boolean => held !== null && mayWrite();` via `hasPendingDraft`; `src/editor/persistence/drafts.ts:147` `  if (held?.kind !== 'canvas' || held.node !== node || !mayWrite()) return null;` via `canvasDraft`
- **Criação:** `src/editor/persistence/drafts.ts:39` `let held: Draft | null = null;`
- **Descarte:** `src/editor/persistence/drafts.ts:66` `    if (next === null) window.sessionStorage.removeItem(KEY);`
- **Navegador:** não

## EST-L05a-050 — restauração de rascunho em curso
- **Declaração:** `src/editor/persistence/drafts.ts:40` `let restoring = false;`
- **Forma:** `boolean`
- **Valores possíveis:** V1 false; V2 true enquanto `apply` põe o valor do rascunho no campo, para as gravações que o evento dispara não reescreverem o rascunho
- **Escritores:** `src/editor/persistence/drafts.ts:120` `    restoring = true;` via `apply`; `src/editor/persistence/drafts.ts:129` `    restoring = false;` via `apply`
- **Leitores:** `src/editor/persistence/drafts.ts:88` `  if (restoring || !store || !mayWrite()) return;` via `saveFieldDraft`; `src/editor/persistence/drafts.ts:136` `  if (restoring || !store || !mayWrite()) return;` via `saveCanvasDraft`
- **Criação:** `src/editor/persistence/drafts.ts:40` `let restoring = false;`
- **Descarte:** `src/editor/persistence/drafts.ts:129` `    restoring = false;`
- **Navegador:** não

## EST-L05a-051 — há rascunho à espera de ser aplicado pelo controlo
- **Declaração:** `src/editor/persistence/drafts.ts:41` `let pending = false;`
- **Forma:** `boolean`
- **Valores possíveis:** V1 false; V2 true com o rascunho restaurado à espera de o controlo o aplicar; V3 false quando a gravação ou o descarte o resolvem
- **Escritores:** `src/editor/persistence/drafts.ts:163` `    pending = true;` via `startDrafts`; `src/editor/persistence/drafts.ts:95` `  pending = false;` via `saveFieldDraft`
- **Leitores:** `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);` via `flushDraftCaret`; `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {` via `restoreFieldDraft`
- **Criação:** `src/editor/persistence/drafts.ts:41` `let pending = false;`
- **Descarte:** `src/editor/persistence/drafts.ts:95` `  pending = false;`
- **Navegador:** não

## EST-L05a-052 — captura do caret do texto editado no canvas
- **Declaração:** `src/editor/persistence/drafts.ts:42` `let canvasCapture: (() => void) | null = null;`
- **Forma:** `(() => void) | null`
- **Valores possíveis:** V1 null (nenhum texto editado a capturar); V2 a função que o editor de texto registou; V3 null de novo quando o registo é removido
- **Escritores:** `src/editor/persistence/drafts.ts:51` `  canvasCapture = capture;` via `registerDraftCapture`; `src/editor/persistence/drafts.ts:53` `    if (canvasCapture === capture) canvasCapture = null;` via `registerDraftCapture` (a remoção)
- **Leitores:** `src/editor/persistence/drafts.ts:57` `  if (held?.kind === 'canvas') canvasCapture?.();` via `flushDraftCaret`
- **Criação:** `src/editor/persistence/drafts.ts:42` `let canvasCapture: (() => void) | null = null;`
- **Descarte:** `src/editor/persistence/drafts.ts:53` `    if (canvasCapture === capture) canvasCapture = null;`
- **Navegador:** não

## EST-L05a-053 — ouvintes de rascunho pendente
- **Declaração:** `src/editor/persistence/drafts.ts:43` `const draftListeners = new Set<() => void>();`
- **Forma:** `Set<() => void>`
- **Valores possíveis:** V1 vazio; V2 com o ouvinte do autosave (uma revisão só de seleção passa a ser registada no diário quando um rascunho aparece)
- **Escritores:** `src/editor/persistence/drafts.ts:46` `  draftListeners.add(listener);` via `subscribePendingDraft`
- **Leitores:** `src/editor/persistence/drafts.ts:69` `  if (next !== null) for (const listener of [...draftListeners]) listener();` via `persist`
- **Criação:** `src/editor/persistence/drafts.ts:43` `const draftListeners = new Set<() => void>();`
- **Descarte:** `src/editor/persistence/drafts.ts:47` `  return () => draftListeners.delete(listener);`
- **Navegador:** não

## EST-L05a-054 — quadro da aplicação do rascunho de campo
- **Declaração:** `src/editor/persistence/drafts.ts:112` `  let frame = 0;`
- **Forma:** `number` (identificador de `requestAnimationFrame`)
- **Valores possíveis:** V1 0 (nenhum quadro pedido); V2 o quadro a repetir enquanto o campo está oculto ou sem caixas
- **Escritores:** `src/editor/persistence/drafts.ts:131` `  frame = requestAnimationFrame(apply);` via `apply`
- **Leitores:** `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);` via `restoreFieldDraft` (a limpeza)
- **Criação:** `src/editor/persistence/drafts.ts:112` `  let frame = 0;`
- **Descarte:** `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`
- **Navegador:** não

## EST-L05a-055 — estado visto na última notificação, para os rascunhos
- **Declaração:** `src/editor/persistence/drafts.ts:185` `  let last = owner.getState();`
- **Forma:** `EditorState`
- **Valores possíveis:** V1 o estado da store no instante em que `startDrafts` corre; V2 o estado da notificação anterior
- **Escritores:** `src/editor/persistence/drafts.ts:192` `    last = next;` via o ouvinte registado em `startDrafts`
- **Leitores:** `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {` via o ouvinte registado em `startDrafts`
- **Criação:** `src/editor/persistence/drafts.ts:185` `  let last = owner.getState();`
- **Descarte:** `src/editor/persistence/drafts.ts:195` `  return () => {`
- **Navegador:** não

## EST-L05a-056 — rascunho espelhado no armazenamento de sessão
- **Declaração:** `src/editor/persistence/drafts.ts:67` `    else window.sessionStorage.setItem(KEY, JSON.stringify(next));`
- **Forma:** a chave `editing-draft` do `sessionStorage` (`src/editor/persistence/drafts.ts:16` `const KEY = 'editing-draft';`) com o rascunho serializado em JSON
- **Valores possíveis:** V1 a chave ausente; V2 o rascunho de campo; V3 o rascunho de canvas; V4 o texto de uma gravação anterior, recusado na leitura por esquema, revisão ou seleção diferentes; V5 removida quando o rascunho é resolvido
- **Escritores:** `src/editor/persistence/drafts.ts:67` `    else window.sessionStorage.setItem(KEY, JSON.stringify(next));` via `persist`; `src/editor/persistence/drafts.ts:66` `    if (next === null) window.sessionStorage.removeItem(KEY);` via `persist`
- **Leitores:** `src/editor/persistence/drafts.ts:159` `    const parsed = schema.safeParse(JSON.parse(window.sessionStorage.getItem(KEY) ?? 'null'));` via `startDrafts`
- **Criação:** `src/editor/persistence/drafts.ts:67` `    else window.sessionStorage.setItem(KEY, JSON.stringify(next));`
- **Descarte:** `src/editor/persistence/drafts.ts:66` `    if (next === null) window.sessionStorage.removeItem(KEY);`
- **Navegador:** não

## EST-L05a-057 — revisão da última gravação
- **Declaração:** `src/editor/persistence/autosave.ts:29` `let savedRevision = 0;`
- **Forma:** `number`
- **Valores possíveis:** V1 0 (perfil novo); V2 a revisão do trabalho restaurado; V3 a revisão incrementada a cada mudança gravada
- **Escritores:** `src/editor/persistence/autosave.ts:233` `  savedRevision = revision;` via `startAutosave`; `src/editor/persistence/autosave.ts:387` `    savedRevision = revision;` via o ouvinte da store
- **Leitores:** `src/editor/persistence/autosave.ts:30` `export const currentWorkRevision = (): number => savedRevision;` via `currentWorkRevision`
- **Criação:** `src/editor/persistence/autosave.ts:29` `let savedRevision = 0;`
- **Descarte:** fim-da-página `src/editor/persistence/autosave.ts:29` `let savedRevision = 0;`
- **Navegador:** não

## EST-L05a-058 — estado de gravação do autosave
- **Declaração:** `src/editor/persistence/autosave.ts:61` `let state: SaveState = 'notSaved';`
- **Forma:** `SaveState` (`'notSaved'`, `'saving'`, `'saved'`, `'recoveryRequired'`)
- **Valores possíveis:** V1 `'notSaved'`; V2 `'saving'` com uma mudança ainda não em IndexedDB; V3 `'saved'`; V4 `'recoveryRequired'` com o trabalho guardado recusado pelo leitor; V5 `'notSaved'` com a razão da recusa
- **Escritores:** `src/editor/persistence/autosave.ts:81` `  state = next;` via `setState`
- **Leitores:** `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,` via `saveState.get`; `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;` via `guard`
- **Criação:** `src/editor/persistence/autosave.ts:61` `let state: SaveState = 'notSaved';`
- **Descarte:** fim-da-página `src/editor/persistence/autosave.ts:61` `let state: SaveState = 'notSaved';`
- **Navegador:** não

## EST-L05a-059 — razão da última recusa de gravação
- **Declaração:** `src/editor/persistence/autosave.ts:67` `let refusal: SaveRefusal | null = null;`
- **Forma:** `SaveRefusal | null` (as palavras do navegador, ou uma chave de mensagem do catálogo)
- **Valores possíveis:** V1 null; V2 o texto do navegador; V3 a chave `status.save.noDatabase`
- **Escritores:** `src/editor/persistence/autosave.ts:82` `  refusal = reason;` via `setState`
- **Leitores:** `src/editor/persistence/autosave.ts:73` `  reason: (): SaveRefusal | null => refusal,` via `saveState.reason`; `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;` via `guard`
- **Criação:** `src/editor/persistence/autosave.ts:67` `let refusal: SaveRefusal | null = null;`
- **Descarte:** fim-da-página `src/editor/persistence/autosave.ts:67` `let refusal: SaveRefusal | null = null;`
- **Navegador:** não

## EST-L05a-060 — ouvintes do estado de gravação
- **Declaração:** `src/editor/persistence/autosave.ts:68` `const listeners = new Set<() => void>();`
- **Forma:** `Set<() => void>`
- **Valores possíveis:** V1 vazio; V2 com os ouvintes da barra de status
- **Escritores:** `src/editor/persistence/autosave.ts:75` `    listeners.add(listener);` via `saveState.subscribe`
- **Leitores:** `src/editor/persistence/autosave.ts:83` `  for (const listener of [...listeners]) listener();` via `setState`
- **Criação:** `src/editor/persistence/autosave.ts:68` `const listeners = new Set<() => void>();`
- **Descarte:** `src/editor/persistence/autosave.ts:76` `    return () => listeners.delete(listener);`
- **Navegador:** não

## EST-L05a-061 — base IndexedDB do autosave, aberta uma vez
- **Declaração:** `src/editor/persistence/autosave.ts:98` `let database: Promise<IDBDatabase | null> | null = null;`
- **Forma:** `Promise<IDBDatabase | null> | null`
- **Valores possíveis:** V1 null (nenhuma abertura pedida); V2 a promessa da abertura em curso; V3 a promessa resolvida com a base, ou com null quando `indexedDB` não existe ou a abertura falha; V4 a base aberta na versão 2 com as reservas `projects` e `versions`
- **Escritores:** `src/editor/persistence/autosave.ts:99` `const db = () => (database ??= openDatabase());` via `db`; `src/editor/persistence/autosave.ts:89` `    const request = indexedDB.open(DATABASE, 2);` via `openDatabase`; `src/editor/persistence/autosave.ts:91` `      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);` via `openDatabase` (a reserva `projects`); `src/editor/persistence/autosave.ts:92` `      if (!request.result.objectStoreNames.contains(VERSIONS)) request.result.createObjectStore(VERSIONS);` via `openDatabase` (a reserva `versions`)
- **Leitores:** `src/editor/persistence/autosave.ts:99` `const db = () => (database ??= openDatabase());` via `db`; `src/editor/persistence/autosave.ts:87` `  if (typeof indexedDB === 'undefined') return Promise.resolve(null);` via `openDatabase`
- **Criação:** `src/editor/persistence/autosave.ts:98` `let database: Promise<IDBDatabase | null> | null = null;`
- **Descarte:** fim-da-página `src/editor/persistence/autosave.ts:98` `let database: Promise<IDBDatabase | null> | null = null;`
- **Navegador:** não

## EST-L05a-062 — diário do trabalho em localStorage
- **Declaração:** `src/editor/persistence/autosave.ts:143` `    const text = window.localStorage.getItem(JOURNAL);`
- **Forma:** a chave `work-journal` do `localStorage` (`src/editor/persistence/autosave.ts:58` `const JOURNAL = 'work-journal';`) com um `SavedWork` em JSON
- **Valores possíveis:** V1 a chave ausente; V2 o registo da mudança de documento à espera da gravação ociosa; V3 o registo escrito à mão com uma revisão só de seleção ligada a um rascunho; V4 removida quando IndexedDB guarda a mesma revisão; V5 movida para IndexedDB quando a cota de 5 MiB é recusada
- **Escritores:** `src/editor/persistence/autosave.ts:255` `        window.localStorage.setItem(JOURNAL, JSON.stringify(work));` via `journalNow`; menções no módulo ao diário no `localStorage`: `src/editor/persistence/autosave.ts:4`, `src/editor/persistence/autosave.ts:6`, `src/editor/persistence/autosave.ts:150`, `src/editor/persistence/autosave.ts:189`, `src/editor/persistence/autosave.ts:242`, `src/editor/persistence/autosave.ts:259`
- **Leitores:** `src/editor/persistence/autosave.ts:143` `    const text = window.localStorage.getItem(JOURNAL);` via `readJournal`
- **Criação:** `src/editor/persistence/autosave.ts:255` `        window.localStorage.setItem(JOURNAL, JSON.stringify(work));`
- **Descarte:** `src/editor/persistence/autosave.ts:320` `          if (journalled === work.revision) window.localStorage.removeItem(JOURNAL);`; `src/editor/persistence/autosave.ts:263` `          window.localStorage.removeItem(JOURNAL);`
- **Navegador:** não

## EST-L05a-063 — trabalho guardado recusado, à espera de projeto novo
- **Declaração:** `src/editor/persistence/autosave.ts:228` `  let blocked = saved !== null && saved !== undefined && !restored;`
- **Forma:** `boolean` fechado em `startAutosave`
- **Valores possíveis:** V1 true (o leitor do projeto recusou o trabalho guardado e nada é escrito); V2 false depois de um documento substituído (um arquivo aberto, uma versão restaurada, uma página em branco)
- **Escritores:** `src/editor/persistence/autosave.ts:384` `    blocked = false;` via o ouvinte da store
- **Leitores:** `src/editor/persistence/autosave.ts:235` `  setState(blocked ? 'recoveryRequired' : saved !== null && saved !== undefined ? 'saved' : 'notSaved');` via `startAutosave`; `src/editor/persistence/autosave.ts:380` `    if (blocked && !replaced) {` via o ouvinte da store
- **Criação:** `src/editor/persistence/autosave.ts:228` `  let blocked = saved !== null && saved !== undefined && !restored;`
- **Descarte:** `src/editor/persistence/autosave.ts:384` `    blocked = false;`
- **Navegador:** não

## EST-L05a-064 — trabalho feito que não pode ser escrito
- **Declaração:** `src/editor/persistence/autosave.ts:231` `  let unwritten = false;`
- **Forma:** `boolean`
- **Valores possíveis:** V1 false; V2 true depois de uma mudança chegar com a recuperação obrigatória; V3 false de novo quando um documento substituído passa a ser escrito
- **Escritores:** `src/editor/persistence/autosave.ts:381` `      unwritten = true;` via o ouvinte da store; `src/editor/persistence/autosave.ts:385` `    unwritten = false;` via o ouvinte da store
- **Leitores:** `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;` via `guard`
- **Criação:** `src/editor/persistence/autosave.ts:231` `  let unwritten = false;`
- **Descarte:** `src/editor/persistence/autosave.ts:385` `    unwritten = false;`
- **Navegador:** não

## EST-L05a-065 — revisão do trabalho em memória
- **Declaração:** `src/editor/persistence/autosave.ts:232` `  let revision = typeof saved?.revision === 'number' ? saved.revision : 0;`
- **Forma:** `number`
- **Valores possíveis:** V1 a revisão do trabalho restaurado, ou 0; V2 incrementada a cada mudança gravada
- **Escritores:** `src/editor/persistence/autosave.ts:386` `    revision += 1;` via o ouvinte da store
- **Leitores:** `src/editor/persistence/autosave.ts:388` `    const work: SavedWork = { revision, format: now.document.version, document: now.document, selection: now.selection };` via o ouvinte da store
- **Criação:** `src/editor/persistence/autosave.ts:232` `  let revision = typeof saved?.revision === 'number' ? saved.revision : 0;`
- **Descarte:** fim-da-página `src/editor/persistence/autosave.ts:232` `  let revision = typeof saved?.revision === 'number' ? saved.revision : 0;`
- **Navegador:** não

## EST-L05a-066 — último estado visto pelo autosave
- **Declaração:** `src/editor/persistence/autosave.ts:234` `  let last = store.getState();`
- **Forma:** `StoreState` da store
- **Valores possíveis:** V1 o estado da montagem do autosave; V2 o estado da última notificação tratada
- **Escritores:** `src/editor/persistence/autosave.ts:372` `      last = now;` via o ouvinte da store; `src/editor/persistence/autosave.ts:379` `    last = now;` via o ouvinte da store
- **Leitores:** `src/editor/persistence/autosave.ts:370` `    if (now.document === last.document && now.selection === last.selection) return;` via o ouvinte da store
- **Criação:** `src/editor/persistence/autosave.ts:234` `  let last = store.getState();`
- **Descarte:** fim-da-página `src/editor/persistence/autosave.ts:234` `  let last = store.getState();`
- **Navegador:** não

## EST-L05a-067 — gravação em IndexedDB em curso
- **Declaração:** `src/editor/persistence/autosave.ts:236` `  let writing = false;`
- **Forma:** `boolean`
- **Valores possíveis:** V1 false; V2 true enquanto `flush` grava
- **Escritores:** `src/editor/persistence/autosave.ts:305` `    writing = true;` via `flush`; `src/editor/persistence/autosave.ts:327` `    writing = false;` via `flush`
- **Leitores:** `src/editor/persistence/autosave.ts:285` `      if (!writing && pending !== null) void flush();` via `writeWhenIdle`; `src/editor/persistence/autosave.ts:335` `      if (!writing && pending !== null) void flush();` via o temporizador da nova tentativa
- **Criação:** `src/editor/persistence/autosave.ts:236` `  let writing = false;`
- **Descarte:** `src/editor/persistence/autosave.ts:327` `    writing = false;`
- **Navegador:** não

## EST-L05a-068 — trabalho à espera de ser gravado
- **Declaração:** `src/editor/persistence/autosave.ts:237` `  let pending: SavedWork | null = null;`
- **Forma:** `SavedWork | null`
- **Valores possíveis:** V1 null; V2 o trabalho de uma mudança nova, à espera do ocioso ou da nova tentativa; V3 o trabalho de um diário recuperado, gravado logo no início; V4 reposto pelo `flush` quando a gravação é recusada
- **Escritores:** `src/editor/persistence/autosave.ts:392` `    pending = work;` via o ouvinte da store; `src/editor/persistence/autosave.ts:313` `        pending ??= work;` via `flush`; `src/editor/persistence/autosave.ts:361` `    pending = work;` via `startAutosave`
- **Leitores:** `src/editor/persistence/autosave.ts:307` `    while (pending !== null) {` via `flush`; `src/editor/persistence/autosave.ts:285` `      if (!writing && pending !== null) void flush();` via `writeWhenIdle`; `src/editor/persistence/autosave.ts:353` `    if (document.visibilityState === 'hidden' && pending !== null) writeNow(hasPendingDraft());` via `hidden`
- **Criação:** `src/editor/persistence/autosave.ts:237` `  let pending: SavedWork | null = null;`
- **Descarte:** `src/editor/persistence/autosave.ts:309` `      pending = null;` via `flush`
- **Navegador:** não

## EST-L05a-069 — temporizador da nova tentativa de gravação
- **Declaração:** `src/editor/persistence/autosave.ts:238` `  let retry = 0;`
- **Forma:** `number` (identificador de `setTimeout`)
- **Valores possíveis:** V1 0; V2 armado depois de uma recusa, para `autosave.retryDelay`; V3 limpo no fim e na desmontagem
- **Escritores:** `src/editor/persistence/autosave.ts:334` `    retry = window.setTimeout(() => {` via `flush`
- **Leitores:** `src/editor/persistence/autosave.ts:333` `    window.clearTimeout(retry);` via `flush`; `src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);` via a limpeza de `startAutosave`
- **Criação:** `src/editor/persistence/autosave.ts:238` `  let retry = 0;`
- **Descarte:** `src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);`
- **Navegador:** não

## EST-L05a-070 — revisão que o diário guarda
- **Declaração:** `src/editor/persistence/autosave.ts:240` `  let journalled = -1;`
- **Forma:** `number`
- **Valores possíveis:** V1 -1 (nada no diário); V2 a revisão do trabalho que o diário guarda; V3 a revisão mais nova, quando o diário é regravado
- **Escritores:** `src/editor/persistence/autosave.ts:250` `      journalled = Math.max(journalled, work.revision);` via `kept`
- **Leitores:** `src/editor/persistence/autosave.ts:248` `    if (work === null || (!withSelection && !documentRevisions.has(work.revision)) || journalled >= work.revision) return;` via `journalNow`; `src/editor/persistence/autosave.ts:320` `          if (journalled === work.revision) window.localStorage.removeItem(JOURNAL);` via `flush`
- **Criação:** `src/editor/persistence/autosave.ts:240` `  let journalled = -1;`
- **Descarte:** fim-da-página `src/editor/persistence/autosave.ts:240` `  let journalled = -1;`
- **Navegador:** não

## EST-L05a-071 — identificador da gravação ociosa pedida
- **Declaração:** `src/editor/persistence/autosave.ts:241` `  let idle = 0;`
- **Forma:** `number` (identificador de `requestIdleCallback`, ou de `setTimeout`)
- **Valores possíveis:** V1 0 (nenhuma gravação ociosa pedida); V2 o identificador pedido; V3 zerado quando a gravação corre ou é antecipada
- **Escritores:** `src/editor/persistence/autosave.ts:287` `    idle = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(run, { timeout: IDLE_WAIT }) : window.setTimeout(run, 0);` via `writeWhenIdle`
- **Leitores:** `src/editor/persistence/autosave.ts:281` `    if (idle !== 0) return;` via `writeWhenIdle`; `src/editor/persistence/autosave.ts:401` `    if (idle !== 0) {` via a limpeza de `startAutosave`
- **Criação:** `src/editor/persistence/autosave.ts:241` `  let idle = 0;`
- **Descarte:** `src/editor/persistence/autosave.ts:401` `    if (idle !== 0) {`
- **Navegador:** não

## EST-L05a-072 — diário movido para IndexedDB
- **Declaração:** `src/editor/persistence/autosave.ts:244` `  let journalInDatabase = false;`
- **Forma:** `boolean`
- **Valores possíveis:** V1 false (o diário ainda vai para o `localStorage`); V2 true depois de o `localStorage` recusar o diário, quando ele passa a ser escrito em IndexedDB a cada mudança do documento
- **Escritores:** `src/editor/persistence/autosave.ts:261` `        journalInDatabase = true;` via `journalNow`
- **Leitores:** `src/editor/persistence/autosave.ts:253` `    if (!journalInDatabase) {` via `journalNow`; `src/editor/persistence/autosave.ts:396` `    if (journalInDatabase) journalNow();` via o ouvinte da store
- **Criação:** `src/editor/persistence/autosave.ts:244` `  let journalInDatabase = false;`
- **Descarte:** fim-da-página `src/editor/persistence/autosave.ts:244` `  let journalInDatabase = false;`
- **Navegador:** não

## EST-L05a-073 — revisões que mudaram o documento
- **Declaração:** `src/editor/persistence/autosave.ts:278` `  const documentRevisions = new Set<number>();`
- **Forma:** `Set<number>`
- **Valores possíveis:** V1 vazio; V2 com as revisões cujo documento está por gravar; V3 sem as revisões que o diário já guardou
- **Escritores:** `src/editor/persistence/autosave.ts:389` `    if (changedDocument) documentRevisions.add(revision);` via o ouvinte da store; `src/editor/persistence/autosave.ts:391` `    else if (pending !== null && documentRevisions.has(pending.revision)) documentRevisions.add(revision);` via o ouvinte da store
- **Leitores:** `src/editor/persistence/autosave.ts:248` `    if (work === null || (!withSelection && !documentRevisions.has(work.revision)) || journalled >= work.revision) return;` via `journalNow`; `src/editor/persistence/autosave.ts:251` `      for (const older of documentRevisions) if (older < work.revision) documentRevisions.delete(older);` via `kept`
- **Criação:** `src/editor/persistence/autosave.ts:278` `  const documentRevisions = new Set<number>();`
- **Descarte:** `src/editor/persistence/autosave.ts:251` `      for (const older of documentRevisions) if (older < work.revision) documentRevisions.delete(older);`
- **Navegador:** não

## EST-L05a-074 — elemento ativo do documento
- **Declaração:** `src/editor/input/pointer/effects.ts:274` `    const focused = target.document.activeElement;`
- **Forma:** estado do navegador: o `activeElement` do documento
- **Valores possíveis:** V1 o corpo da página (nada focado); V2 um campo do editor (o campo de um painel, a barra de comandos); V3 o texto editado em lugar no canvas (contenteditable do quadro); V4 um botão de controlo de um painel; V5 nenhum (`null`) enquanto o documento não tem foco
- **Escritores:** `src/editor/input/pointer/events.ts:144` `      guideEl.focus();` via `onDown`; `src/editor/input/pointer/events.ts:475` `      else element.focus();` via `onUp`; `src/editor/input/pointer/effects.ts:97` `        press.element.focus();` via `run`; `src/editor/persistence/drafts.ts:121` `    field.focus();` via `apply`
- **Leitores:** `src/editor/input/pointer/common.ts:424` `  const field = document.activeElement;` via `onOwnOption`; `src/editor/input/pending.ts:80` `  const focused = document.activeElement;` via `beforeCommand`; `src/editor/input/keymap.ts:576` `    if (event.target instanceof Node && event.target !== event.target.ownerDocument?.activeElement) {` via `onBeforeInput`; `src/editor/persistence/drafts.ts:58` `  const field = document.activeElement;` via `flushDraftCaret`
- **Criação:** `src/editor/input/pointer/effects.ts:97` `        press.element.focus();`
- **Descarte:** `src/editor/input/pointer/effects.ts:275` `    if (focused instanceof HTMLElement && (focused.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(focused.tagName))) focused.blur();`
- **Navegador:** foco

## EST-L05a-075 — seleção de texto do campo e do texto editado em lugar
- **Declaração:** `src/editor/input/pointer/effects.ts:275` `    if (focused instanceof HTMLElement && (focused.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(focused.tagName))) focused.blur();`
- **Forma:** estado do navegador: o intervalo de seleção do campo e o modo `contenteditable` do texto editado no canvas
- **Valores possíveis:** V1 o campo recém-focado, com a seleção vazia no fim do valor; V2 o valor inteiro selecionado pelo primeiro clique (o caráter escolhido substitui-o); V3 uma seleção feita a arrastar dentro do campo, mantida; V4 o intervalo de um rascunho restaurado; V5 o texto em lugar no canvas com `contenteditable` ligado, e o cursor dentro dele
- **Escritores:** `src/editor/input/select-on-focus.ts:21` `    if (was.field.selectionStart === was.field.selectionEnd) was.field.select();` via `onClick`; `src/editor/persistence/drafts.ts:126` `      if (draft.range) field.setSelectionRange(draft.range.start, draft.range.end);` via `apply`
- **Leitores:** `src/editor/input/pointer/common.ts:448` `  if (row && !target?.closest('button, input, textarea, [contenteditable="true"], [contenteditable="plaintext-only"]') && modifierOf(event) === null) {` via `pressAt`; `src/editor/input/pointer/effects.ts:275` `    if (focused instanceof HTMLElement && (focused.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(focused.tagName))) focused.blur();` via `leaveField`; `src/editor/input/keymap.ts:418` `    // Native buttons consume Space even when contenteditable. Insert it in the edited element's own document;` via a nota do `onKeyDown`
- **Criação:** `src/editor/input/select-on-focus.ts:21` `    if (was.field.selectionStart === was.field.selectionEnd) was.field.select();`
- **Descarte:** fim-da-página `src/editor/input/pointer/effects.ts:275` `    if (focused instanceof HTMLElement && (focused.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(focused.tagName))) focused.blur();`
- **Navegador:** seleção-de-texto

## EST-L05a-076 — rolagem da árvore de Camadas durante um arraste
- **Declaração:** `src/editor/input/pointer/drag.ts:162` `        tree.scrollTop += treeStep;`
- **Forma:** estado do navegador: o `scrollTop` do elemento `.layers-tree`
- **Valores possíveis:** V1 0 (topo); V2 a rolagem que cada quadro do autoscroll aplica enquanto o ponteiro está na faixa da árvore; V3 a rolagem que o deslocamento trouxe (a proposta é tomada de novo)
- **Escritores:** `src/editor/input/pointer/drag.ts:162` `        tree.scrollTop += treeStep;` via `autoscroll`
- **Leitores:** `src/editor/input/pointer/drag.ts:161` `        const before = tree.scrollTop;` via `autoscroll`; `src/editor/input/pointer/drag.ts:163` `        if (tree.scrollTop !== before) scrolled = true;` via `autoscroll`
- **Criação:** `src/editor/input/pointer/drag.ts:162` `        tree.scrollTop += treeStep;`
- **Descarte:** fim-da-página `src/editor/input/pointer/drag.ts:162` `        tree.scrollTop += treeStep;`
- **Navegador:** rolagem

## EST-L05a-077 — captura do ponteiro durante um gesto
- **Declaração:** `src/editor/input/pointer/effects.ts:261` `      target.document.documentElement.setPointerCapture(pointer);`
- **Forma:** estado do navegador: a captura do ponteiro no elemento raiz do documento
- **Valores possíveis:** V1 nenhum ponteiro capturado; V2 o ponteiro do gesto capturado (os movimentos e a libertação chegam onde ele for); V3 a captura perdida antes da libertação (a máquina volta a ocioso); V4 a captura cancelada junto com o gesto
- **Escritores:** `src/editor/input/pointer/effects.ts:261` `      target.document.documentElement.setPointerCapture(pointer);` via `capture`
- **Leitores:** `src/editor/input/pointer/events.ts:434` `    if (event.pointerId === ps.captured) ps.captured = null;` via `onUp`; `src/editor/input/pointer/effects.ts:267` `  const underPointer = (event: PointerEvent): EventTarget | null => (ps.captured === event.pointerId ? target.document.elementFromPoint(event.clientX, event.clientY) : event.target);` via `underPointer`; `src/editor/input/pointer/events.ts:555` `  const onLostCapture = (event: PointerEvent) => {` via `onLostCapture`
- **Criação:** `src/editor/input/pointer/effects.ts:261` `      target.document.documentElement.setPointerCapture(pointer);`
- **Descarte:** `src/editor/input/pointer/events.ts:545` `    ps.captured = null;`
- **Navegador:** captura-de-ponteiro

## Exclusões

## EXC-L05a-001
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/store.ts:87` `  let byLayer = layeredByKey.get(project);`
- **Motivo:** local de `layeredRules`, lido e devolvido dentro da própria chamada, sem closure que o guarde (`src/editor/store.ts:87` `  let byLayer = layeredByKey.get(project);`)

## EXC-L05a-002
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/store.ts:93` `  let rules = byLayer.get(key);`
- **Motivo:** local de `layeredRules`, devolvido no fim da mesma chamada (`src/editor/store.ts:98` `  return rules;`)

## EXC-L05a-003
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/store.ts:184` `const UNDOABLE = new Map(manifest.commands.map((c) => [c.id as CommandId, c.history.undoable] as const));`
- **Motivo:** mapa constante derivado do manifesto na carga do módulo; nenhuma entrada o escreve, então não há escrita a sobreviver (`src/editor/store.ts:233` `      const changesDocument = UNDOABLE.get(id) === true;`)

## EXC-L05a-004
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/input/keymap.ts:100` `  let found: string | null = null;`
- **Motivo:** local de `chordHint`, preenchido e devolvido na mesma chamada (`src/editor/input/keymap.ts:109` `  return found;`)

## EXC-L05a-005
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/input/keymap.ts:247` `const CHOSEN_CONTEXTS: ReadonlySet<string> = new Set([CANVAS_CONTEXT, LAYERS_CONTEXT]);`
- **Motivo:** conjunto constante montado da lista literal na carga do módulo; nenhuma entrada o escreve (`src/editor/input/keymap.ts:490` `    const typedKey = letter && binding.door.kind === 'shortcut' && CHOSEN_CONTEXTS.has(binding.door.context) && (focused === CANVAS_CONTEXT || focused === LAYERS_CONTEXT) && gesture === null;`)

## EXC-L05a-006
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/input/keymap.ts:258` `const TEXT_TYPES: ReadonlySet<string> = new Set(['text', 'search', 'url', 'email', 'tel', 'number', 'password']);`
- **Motivo:** conjunto constante montado da lista literal na carga do módulo; nenhuma entrada o escreve (`src/editor/input/keymap.ts:260` `  target instanceof HTMLTextAreaElement || (target instanceof HTMLInputElement && TEXT_TYPES.has(target.type));`)

## EXC-L05a-007
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/input/select-on-focus.ts:31` `const TEXT_TYPES = new Set(['text', 'search', '', 'number', 'url', 'email', 'tel']);`
- **Motivo:** conjunto constante montado da lista literal na carga do módulo; nenhuma entrada o escreve (`src/editor/input/select-on-focus.ts:32` `const isText = (field: HTMLInputElement) => TEXT_TYPES.has(field.type) && !field.readOnly;`)

## EXC-L05a-008
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/input/drop-proposals.ts:17` `export const CONTAINERS = new Set(manifest.elements.elements.filter((e) => e.content === 'children').map((e) => e.id));`
- **Motivo:** conjunto constante derivado do manifesto na carga do módulo; nenhuma entrada o escreve (`src/editor/input/pointer/drag.ts:213` `    const next = row !== null ? rowDrop(store.getState().document, (type) => CONTAINERS.has(type), ps.dragging.dragged, row.node, row.at) : creation && !onPage ? null : proposalAt(store.getState().document, ps.dragging.dragged, at);`)

## EXC-L05a-009
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/input/pointer/common.ts:96` `export const DRAG_MODIFIERS = new Set(manifest.interactions.gestures.filter((g) => ELEMENT_DRAGS.some((d) => d.door.kind === 'canvas-drag' && d.door.gesture === g.id && (d === DUPLICATE_DRAG || d === REORDER))).flatMap((g) => g.modifiers.map((m) => m.key)));`
- **Motivo:** conjunto constante derivado do manifesto na carga do módulo; nenhuma entrada o escreve (`src/editor/input/pointer/effects.ts:135` `      const plain = ps.buttons.modifier === null || DRAG_MODIFIERS.has(ps.buttons.modifier as never);`)

## EXC-L05a-010
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/input/pointer/common.ts:101` `const CLICK_KEYS = new Set((manifest.interactions.gestures.find((g) => g.id === 'canvas-click')?.modifiers ?? []).map((m) => m.key));`
- **Motivo:** conjunto constante derivado do manifesto na carga do módulo; nenhuma entrada o escreve (`src/editor/input/pointer/common.ts:102` `export const DRAG_ONLY_MODIFIERS = new Set([...DRAG_MODIFIERS].filter((key) => !CLICK_KEYS.has(key)));`)

## EXC-L05a-011
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/input/pointer/common.ts:102` `export const DRAG_ONLY_MODIFIERS = new Set([...DRAG_MODIFIERS].filter((key) => !CLICK_KEYS.has(key)));`
- **Motivo:** conjunto constante derivado dos outros dois na carga do módulo; nenhuma entrada o escreve (`src/editor/input/pointer/effects.ts:45` `      const clickModifier = ps.buttons.modifier !== null && DRAG_ONLY_MODIFIERS.has(ps.buttons.modifier as never) ? null : ps.buttons.modifier;`)

## EXC-L05a-012
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/input/pointer/common.ts:187` `const MODIFIER_MEANINGS = new Map((manifest.interactions.gestures.find((g) => g.id === 'spacing-band')?.modifiers ?? []).map((m) => [m.meaning, m.key] as const));`
- **Motivo:** mapa constante derivado do manifesto na carga do módulo; nenhuma entrada o escreve (`src/editor/input/pointer/common.ts:188` `export const ALL_SIDES_KEY = MODIFIER_MEANINGS.get('change-all-four-sides');`)

## EXC-L05a-013
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/input/pointer/shared.ts:23` `  let shared = SHARED.get(store);`
- **Motivo:** local de `sharedOf`, devolvido na mesma chamada; o objeto que ele guarda é o item EST-L05a-019 (`src/editor/input/pointer/shared.ts:28` `  return shared;`)

## EXC-L05a-014
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/input/pointer/views.ts:223` `  let views = VIEWS.get(store);`
- **Motivo:** local de `pointerViews`, devolvido na mesma chamada (`src/editor/input/pointer/views.ts:228` `  return views;`)

# Estado — L05b

Arquivos do lote L05b que ficam no alvo de código do `auditoria/padroes.json` (o alvo exclui `src/**/*.test.ts` e `src/**/*.test.tsx`): `src/editor/app.tsx`, `src/editor/browser-ports.ts`, `src/editor/clipboard.ts`, `src/editor/command-bar/command-bar.ts`, `src/editor/css-support.ts`, `src/editor/doors/current.ts`, `src/editor/doors/door.tsx`, `src/editor/doors/menu.tsx`, `src/editor/doors/placement.ts`, `src/editor/download.ts`, `src/editor/drag/drag-session.ts`, `src/editor/drag/drop.ts`, `src/editor/errors.ts`, `src/editor/focus/focus.ts`, `src/editor/host-testing.ts`, `src/editor/host.ts`, `src/editor/menus/context-menu.ts`, `src/editor/menus/overlays.ts`, `src/editor/preferences/preferences.ts`, `src/editor/preferences/said.ts`, `src/editor/project/page-follows.ts`, `src/editor/test-boot.ts`, `src/editor/test-port.ts`, `src/editor/text.ts`.

Os arquivos `src/editor/app.tsx`, `src/editor/browser-ports.ts`, `src/editor/css-support.ts`, `src/editor/doors/current.ts`, `src/editor/doors/door.tsx`, `src/editor/download.ts`, `src/editor/errors.ts`, `src/editor/host-testing.ts`, `src/editor/host.ts`, `src/editor/menus/context-menu.ts`, `src/editor/menus/overlays.ts`, `src/editor/preferences/said.ts`, `src/editor/project/page-follows.ts` e `src/editor/test-port.ts` não declaram item de estado nem ocorrência de padrão de estado.

## EST-L05b-001 — cópia própria da área de transferência do editor

- **Declaração:** `src/editor/clipboard.ts:58` `let own: string | null = null;`
- **Forma:** `string | null`: o texto que a última cópia ou corte do editor escreveu
- **Valores possíveis:**
  - V1 `null`: nenhuma cópia ou corte escreveu ainda `src/editor/clipboard.ts:58` `let own: string | null = null;`
  - V2 o texto copiado ou cortado `src/editor/clipboard.ts:79` `own = content.text;`
- **Escritores:**
  - `src/editor/clipboard.ts:79` `own = content.text;` via browserClipboard.write
- **Leitores:**
  - `src/editor/clipboard.ts:66` `if (own === null) return read;` via readClipboard
  - `src/editor/clipboard.ts:67` `return { status: 'read', html: null, text: own, markup: null };` via readClipboard
- **Criação:** `src/editor/clipboard.ts:58` `let own: string | null = null;`
- **Descarte:** fim-da-página `src/editor/clipboard.ts:58` `let own: string | null = null;`
- **Navegador:** não

## EST-L05b-002 — cache de slots por região

- **Declaração:** `src/editor/doors/placement.ts:13` `const cache = new Map<string, readonly Slot[]>();`
- **Forma:** `Map<string, readonly Slot[]>`: os portões e botões de menu de cada região, na ordem
- **Valores possíveis:**
  - V1 vazio: nenhuma região foi pedida ainda `src/editor/doors/placement.ts:13` `const cache = new Map<string, readonly Slot[]>();`
  - V2 com os slots de uma região gravados `src/editor/doors/placement.ts:22` `cache.set(region, slots);`
- **Escritores:**
  - `src/editor/doors/placement.ts:22` `cache.set(region, slots);` via slotsIn
- **Leitores:**
  - `src/editor/doors/placement.ts:17` `const cached = cache.get(region);` via slotsIn
- **Criação:** `src/editor/doors/placement.ts:13` `const cache = new Map<string, readonly Slot[]>();`
- **Descarte:** fim-da-página `src/editor/doors/placement.ts:13` `const cache = new Map<string, readonly Slot[]>();`
- **Navegador:** não

## EST-L05b-003 — ordens de quebra por menu

- **Declaração:** `src/editor/doors/menu.tsx:28` `const BREAKS = new Map<string, readonly number[]>(manifest.layout.menus.map((m) => [m.id, m.breaks ?? []] as const));`
- **Forma:** `Map<string, readonly number[]>`: para cada menu, as ordens antes das quais ele desenha uma linha
- **Valores possíveis:**
  - V1 preenchido na carga do módulo com os valores de layout.json `src/editor/doors/menu.tsx:28` `const BREAKS = new Map<string, readonly number[]>(manifest.layout.menus.map((m) => [m.id, m.breaks ?? []] as const));`
- **Escritores:**
  - `src/editor/doors/menu.tsx:28` `const BREAKS = new Map<string, readonly number[]>` via carga do módulo
- **Leitores:**
  - `src/editor/doors/menu.tsx:159` `...(BREAKS.get(menu)?.includes(slot.order) === true ?` via MenuList
- **Criação:** `src/editor/doors/menu.tsx:28` `const BREAKS = new Map<string, readonly number[]>(manifest.layout.menus.map((m) => [m.id, m.breaks ?? []] as const));`
- **Descarte:** fim-da-página `src/editor/doors/menu.tsx:28` `const BREAKS = new Map<string, readonly number[]>(manifest.layout.menus.map((m) => [m.id, m.breaks ?? []] as const));`
- **Navegador:** não

## EST-L05b-004 — referência ao elemento da lista do menu

- **Declaração:** `src/editor/doors/menu.tsx:96` `const list = useRef<HTMLDivElement>(null);`
- **Forma:** `RefObject<HTMLDivElement | null>`
- **Valores possíveis:**
  - V1 `null` antes da montagem `src/editor/doors/menu.tsx:96` `const list = useRef<HTMLDivElement>(null);`
  - V2 o elemento da lista depois da montagem `src/editor/doors/menu.tsx:149` `ref={list} style={placed}`
- **Escritores:**
  - `src/editor/doors/menu.tsx:149` `ref={list} style={placed}` via MenuList (a propriedade ref liga o elemento)
- **Leitores:**
  - `src/editor/doors/menu.tsx:103` `const own = list.current;` via MenuList
  - `src/editor/doors/menu.tsx:142` `if (focusFirst && shown) list.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus();` via MenuList
- **Criação:** `src/editor/doors/menu.tsx:96` `const list = useRef<HTMLDivElement>(null);`
- **Descarte:** `src/editor/doors/menu.tsx:283` `{layer.open ? <MenuList menu={menu} onDone={layer.close} focusFirst anchor={button} /> : null}` (a referência morre quando a lista desmonta)
- **Navegador:** não

## EST-L05b-005 — posição medida da lista do menu

- **Declaração:** `src/editor/doors/menu.tsx:100` `const [at, setAt] = useState<Placed | null>(null);`
- **Forma:** `Placed | null`
- **Valores possíveis:**
  - V1 `null` enquanto a medida do quadro ainda não chegou `src/editor/doors/menu.tsx:100` `const [at, setAt] = useState<Placed | null>(null);`
  - V2 a posição medida sob o botão `src/editor/doors/menu.tsx:108` `setAt(floatBelow(button.getBoundingClientRect(), { width, height: naturalHeight(own) }, { width: window.innerWidth, height: window.innerHeight }, edge));`
- **Escritores:**
  - `src/editor/doors/menu.tsx:108` `setAt(floatBelow(button.getBoundingClientRect(), { width, height: naturalHeight(own) }, { width: window.innerWidth, height: window.innerHeight }, edge));` via MenuList
- **Leitores:**
  - `src/editor/doors/menu.tsx:147` `at === null ? { position: 'fixed' as const, visibility: 'hidden' as const }` via MenuList
- **Criação:** `src/editor/doors/menu.tsx:100` `const [at, setAt] = useState<Placed | null>(null);`
- **Descarte:** `src/editor/doors/menu.tsx:283` `focusFirst anchor={button} /> : null}` (a posição morre quando a lista desmonta)
- **Navegador:** não

## EST-L05b-006 — posição medida do submenu

- **Declaração:** `src/editor/doors/menu.tsx:112` `const [side, setSide] = useState<Placed | null>(null);`
- **Forma:** `Placed | null`
- **Valores possíveis:**
  - V1 `null` enquanto o submenu está escondido `src/editor/doors/menu.tsx:112` `const [side, setSide] = useState<Placed | null>(null);`
  - V2 a posição ao lado do item `src/editor/doors/menu.tsx:133` `flushSync(() => setSide(floatBeside(anchor, { width, height: naturalHeight(own) }, view, edge, inset)));`
- **Escritores:**
  - `src/editor/doors/menu.tsx:133` `flushSync(() => setSide(floatBeside(anchor, { width, height: naturalHeight(own) }, view, edge, inset)));` via MenuList
- **Leitores:**
  - `src/editor/doors/menu.tsx:146` `? side === null ? undefined : { position: 'fixed' as const, ...placedStyle(side) }` via MenuList
- **Criação:** `src/editor/doors/menu.tsx:112` `const [side, setSide] = useState<Placed | null>(null);`
- **Descarte:** `src/editor/doors/menu.tsx:283` `focusFirst anchor={button} /> : null}` (morre quando a lista desmonta)
- **Navegador:** não

## EST-L05b-007 — submenu aberto

- **Declaração:** `src/editor/doors/menu.tsx:167` `const [open, setOpen] = useState(false);`
- **Forma:** `boolean`
- **Valores possíveis:**
  - V1 `false`: o submenu fechado `src/editor/doors/menu.tsx:167` `const [open, setOpen] = useState(false);`
  - V2 `true`: aberto pelo clique no item `src/editor/doors/menu.tsx:172` `onClick={() => setOpen(!open)}`
- **Escritores:**
  - `src/editor/doors/menu.tsx:172` `onClick={() => setOpen(!open)}` via SubMenu
- **Leitores:**
  - `src/editor/doors/menu.tsx:171` `menu__sub${open ? ' is-open' : ''}` via SubMenu
  - `src/editor/doors/menu.tsx:172` `aria-expanded={open}` via SubMenu
- **Criação:** `src/editor/doors/menu.tsx:167` `const [open, setOpen] = useState(false);`
- **Descarte:** `src/editor/doors/menu.tsx:160` `<SubMenu key={slot.menu} menu={slot.menu} onDone={onDone} />,` (morre quando o menu fecha e o SubMenu desmonta)
- **Navegador:** não

## EST-L05b-008 — referência ao botão que abre o submenu

- **Declaração:** `src/editor/doors/menu.tsx:169` `const item = useRef<HTMLButtonElement>(null);`
- **Forma:** `RefObject<HTMLButtonElement | null>`
- **Valores possíveis:**
  - V1 `null` antes da montagem `src/editor/doors/menu.tsx:169` `const item = useRef<HTMLButtonElement>(null);`
  - V2 o botão do item depois da montagem `src/editor/doors/menu.tsx:172` `ref={item} type="button" role="menuitem"`
- **Escritores:**
  - `src/editor/doors/menu.tsx:172` `ref={item} type="button" role="menuitem"` via SubMenu
- **Leitores:**
  - `src/editor/doors/menu.tsx:177` `<MenuList menu={menu} onDone={onDone} focusFirst={false} beside={item} />` via SubMenu
- **Criação:** `src/editor/doors/menu.tsx:169` `const item = useRef<HTMLButtonElement>(null);`
- **Descarte:** `src/editor/doors/menu.tsx:160` `<SubMenu key={slot.menu} menu={slot.menu} onDone={onDone} />,` (morre com a desmontagem do SubMenu)
- **Navegador:** não

## EST-L05b-009 — contexto do grupo de menus

- **Declaração:** `src/editor/doors/menu.tsx:205` `const MenuGroupContext = createContext<MenuGroupState | null>(null);`
- **Forma:** contexto React com `MenuGroupState | null`
- **Valores possíveis:**
  - V1 `null`: fora de um MenuGroup `src/editor/doors/menu.tsx:205` `const MenuGroupContext = createContext<MenuGroupState | null>(null);`
  - V2 o estado do grupo, com o menu ativo e o descartado `src/editor/doors/menu.tsx:227` `<MenuGroupContext.Provider value={{ active, dismissed, toggle, close: () => setOpened(null) }}>` via MenuGroup
- **Escritores:**
  - `src/editor/doors/menu.tsx:227` `<MenuGroupContext.Provider value={{ active, dismissed, toggle, close: () => setOpened(null) }}>` via MenuGroup
- **Leitores:**
  - `src/editor/doors/menu.tsx:231` `const group = useContext(MenuGroupContext);` via useMenuLayer
- **Criação:** `src/editor/doors/menu.tsx:205` `const MenuGroupContext = createContext<MenuGroupState | null>(null);`
- **Descarte:** fim-da-página `src/editor/doors/menu.tsx:205` `const MenuGroupContext = createContext<MenuGroupState | null>(null);`
- **Navegador:** não

## EST-L05b-010 — menu aberto pelo grupo

- **Declaração:** `src/editor/doors/menu.tsx:213` `const [opened, setOpened] = useState<{ readonly menu: MenuId; readonly at: number; readonly hovered?: boolean } | null>(null);`
- **Forma:** `{ menu, at, hovered? } | null`: qual menu abriu, em que número de descartes, e se abriu por passagem do ponteiro
- **Valores possíveis:**
  - V1 `null`: nenhum menu aberto `src/editor/doors/menu.tsx:213` `const [opened, setOpened] = useState<{ readonly menu: MenuId; readonly at: number; readonly hovered?: boolean } | null>(null);`
  - V2 o menu aberto com o número de descartes da abertura `src/editor/doors/menu.tsx:217` `setOpened((current) => (current?.menu === menu && current.at === dismissals ? (current.hovered === true ? { menu, at: dismissals } : null) : { menu, at: dismissals }));`
- **Escritores:**
  - `src/editor/doors/menu.tsx:217` `setOpened((current) => (current?.menu === menu && current.at === dismissals ? (current.hovered === true ? { menu, at: dismissals } : null) : { menu, at: dismissals }));` via MenuGroup
- **Leitores:**
  - `src/editor/doors/menu.tsx:214` `const active = opened !== null && opened.at === dismissals ? opened.menu : null;` via MenuGroup
- **Criação:** `src/editor/doors/menu.tsx:213` `const [opened, setOpened] = useState<{ readonly menu: MenuId; readonly at: number; readonly hovered?: boolean } | null>(null);`
- **Descarte:** `src/editor/doors/menu.tsx:209` `export function MenuGroup({ children }: { readonly children: ReactNode }) {` (morre com a desmontagem do MenuGroup)
- **Navegador:** não

## EST-L05b-011 — último menu visto sob o ponteiro

- **Declaração:** `src/editor/doors/menu.tsx:222` `const [seen, setSeen] = useState(over);`
- **Forma:** `MenuId | null`: o menu que o ponteiro apontava na renderização anterior
- **Valores possíveis:**
  - V1 o menu apontado na última renderização `src/editor/doors/menu.tsx:222` `const [seen, setSeen] = useState(over);`
  - V2 trocado quando o ponteiro muda de botão `src/editor/doors/menu.tsx:224` `setSeen(over);`
- **Escritores:**
  - `src/editor/doors/menu.tsx:224` `setSeen(over);` via MenuGroup
- **Leitores:**
  - `src/editor/doors/menu.tsx:223` `if (over !== seen) {` via MenuGroup
- **Criação:** `src/editor/doors/menu.tsx:222` `const [seen, setSeen] = useState(over);`
- **Descarte:** `src/editor/doors/menu.tsx:209` `export function MenuGroup({ children }: { readonly children: ReactNode }) {` (morre com a desmontagem do MenuGroup)
- **Navegador:** não

## EST-L05b-012 — número de descartes da abertura da camada

- **Declaração:** `src/editor/doors/menu.tsx:235` `const [openedAt, setOpenedAt] = useState<number | null>(null);`
- **Forma:** `number | null`: o número de descartes de quando a camada abriu
- **Valores possíveis:**
  - V1 `null`: camada fechada `src/editor/doors/menu.tsx:235` `const [openedAt, setOpenedAt] = useState<number | null>(null);`
  - V2 o número de descartes da abertura `src/editor/doors/menu.tsx:255` `toggle: grouped ? () => group.toggle(menu) : () => setOpenedAt(open ? null : dismissals),`
- **Escritores:**
  - `src/editor/doors/menu.tsx:247` `const close = grouped ? group.close : () => setOpenedAt(null);` via useMenuLayer
- **Leitores:**
  - `src/editor/doors/menu.tsx:236` `const open = grouped ? group.active === menu : openedAt !== null && openedAt === dismissals;` via useMenuLayer
- **Criação:** `src/editor/doors/menu.tsx:235` `const [openedAt, setOpenedAt] = useState<number | null>(null);`
- **Descarte:** `src/editor/doors/menu.tsx:230` `export function useMenuLayer(button: RefObject<HTMLButtonElement | null>, list?: RefObject<HTMLElement | null>, menu?: MenuId,` (morre com a desmontagem do componente que usa a camada)
- **Navegador:** não

## EST-L05b-013 — referência de reserva da camada

- **Declaração:** `src/editor/doors/menu.tsx:248` `const fallback = useRef<HTMLElement>(null);`
- **Forma:** `RefObject<HTMLElement | null>`
- **Valores possíveis:**
  - V1 `null`: a referência nunca é ligada a um elemento `src/editor/doors/menu.tsx:248` `const fallback = useRef<HTMLElement>(null);`
- **Escritores:**
  - `src/editor/doors/menu.tsx:248` `const fallback = useRef<HTMLElement>(null);` via useMenuLayer (o valor inicial)
- **Leitores:**
  - `src/editor/doors/menu.tsx:249` `useOutsideLayer(list ?? fallback, open && list !== undefined, () => {` via useMenuLayer
- **Criação:** `src/editor/doors/menu.tsx:248` `const fallback = useRef<HTMLElement>(null);`
- **Descarte:** `src/editor/doors/menu.tsx:230` `export function useMenuLayer(button: RefObject<HTMLButtonElement | null>, list?: RefObject<HTMLElement | null>, menu?: MenuId,` (morre com a desmontagem do componente)
- **Navegador:** não

## EST-L05b-014 — referência ao botão do menu

- **Declaração:** `src/editor/doors/menu.tsx:261` `const button = useRef<HTMLButtonElement>(null);`
- **Forma:** `RefObject<HTMLButtonElement | null>`
- **Valores possíveis:**
  - V1 `null` antes da montagem `src/editor/doors/menu.tsx:261` `const button = useRef<HTMLButtonElement>(null);`
  - V2 o botão depois da montagem `src/editor/doors/menu.tsx:269` `ref={button}`
- **Escritores:**
  - `src/editor/doors/menu.tsx:269` `ref={button}` via MenuButton
- **Leitores:**
  - `src/editor/doors/menu.tsx:262` `const layer = useMenuLayer(button, undefined, menu);` via MenuButton
- **Criação:** `src/editor/doors/menu.tsx:261` `const button = useRef<HTMLButtonElement>(null);`
- **Descarte:** `src/editor/doors/menu.tsx:260` `export function MenuButton({ menu, anchor, children, indicator = false, className }: MenuButtonProps) {` (morre com a desmontagem do botão)
- **Navegador:** não

## EST-L05b-015 — referência à lista do menu de contexto

- **Declaração:** `src/editor/doors/menu.tsx:307` `const list = useRef<HTMLDivElement>(null);`
- **Forma:** `RefObject<HTMLDivElement | null>`
- **Valores possíveis:**
  - V1 `null` antes da montagem `src/editor/doors/menu.tsx:307` `const list = useRef<HTMLDivElement>(null);`
  - V2 o elemento do menu de contexto `src/editor/doors/menu.tsx:330` `ref={list} aria-label={t('contextMenu.label')}`
- **Escritores:**
  - `src/editor/doors/menu.tsx:330` `ref={list} aria-label={t('contextMenu.label')}` via OpenContextMenu
- **Leitores:**
  - `src/editor/doors/menu.tsx:318` `const menu = list.current;` via OpenContextMenu
- **Criação:** `src/editor/doors/menu.tsx:307` `const list = useRef<HTMLDivElement>(null);`
- **Descarte:** `src/editor/doors/menu.tsx:304` `function OpenContextMenu() {` (morre com a desmontagem do menu de contexto)
- **Navegador:** não

## EST-L05b-016 — itens que aplicam do menu de contexto

- **Declaração:** `src/editor/doors/menu.tsx:312` `const items = useMemo(() => CONTEXT_ITEMS.filter((entry) => isDoorBuilt(entry) && store.canRun(entry.command.id, entry.door.args as never)), [store]);`
- **Forma:** `readonly DoorEntry[]`: os portões de contexto construídos e aplicáveis
- **Valores possíveis:**
  - V1 a lista calculada para a store atual `src/editor/doors/menu.tsx:312` `const items = useMemo(() => CONTEXT_ITEMS.filter((entry) => isDoorBuilt(entry) && store.canRun(entry.command.id, entry.door.args as never)), [store]);`
- **Escritores:**
  - `src/editor/doors/menu.tsx:312` `const items = useMemo(() => CONTEXT_ITEMS.filter((entry) => isDoorBuilt(entry) && store.canRun(entry.command.id, entry.door.args as never)), [store]);` via OpenContextMenu
- **Leitores:**
  - `src/editor/doors/menu.tsx:327` `if (items.length === 0) return null;` via OpenContextMenu
- **Criação:** `src/editor/doors/menu.tsx:312` `const items = useMemo(() => CONTEXT_ITEMS.filter((entry) => isDoorBuilt(entry) && store.canRun(entry.command.id, entry.door.args as never)), [store]);`
- **Descarte:** `src/editor/doors/menu.tsx:304` `function OpenContextMenu() {` (morre com a desmontagem do menu de contexto)
- **Navegador:** não

## EST-L05b-017 — posição medida do menu de contexto

- **Declaração:** `src/editor/doors/menu.tsx:316` `const [at, setAt] = useState<Placed>({ left: start.x, top: start.y });`
- **Forma:** `Placed`
- **Valores possíveis:**
  - V1 a posição do último aperto `src/editor/doors/menu.tsx:316` `const [at, setAt] = useState<Placed>({ left: start.x, top: start.y });`
  - V2 a posição movida para dentro da janela `src/editor/doors/menu.tsx:322` `setAt(floatBelow(pointAnchor(start.x, start.y), { width, height: naturalHeight(menu) }, { width: window.innerWidth, height: window.innerHeight }, edge));`
- **Escritores:**
  - `src/editor/doors/menu.tsx:322` `setAt(floatBelow(pointAnchor(start.x, start.y), { width, height: naturalHeight(menu) }, { width: window.innerWidth, height: window.innerHeight }, edge));` via OpenContextMenu
- **Leitores:**
  - `src/editor/doors/menu.tsx:330` `style={placedStyle(at)}` via OpenContextMenu
- **Criação:** `src/editor/doors/menu.tsx:316` `const [at, setAt] = useState<Placed>({ left: start.x, top: start.y });`
- **Descarte:** `src/editor/doors/menu.tsx:304` `function OpenContextMenu() {` (morre com a desmontagem do menu de contexto)
- **Navegador:** não

## EST-L05b-018 — foco do documento

- **Declaração:** `src/editor/focus/focus.ts:89` `const held = document.activeElement;`
- **Forma:** o elemento ativo do documento (document.activeElement), lido e movido pela navegação de foco e pelas camadas
- **Valores possíveis:**
  - V1 o corpo do documento ou nada ativo `src/editor/doors/menu.tsx:240` `document.activeElement === null || document.activeElement === document.body`
  - V2 um controle da região que recebeu o foco `src/editor/focus/focus.ts:77` `first.focus();`
- **Escritores:**
  - `src/editor/focus/focus.ts:56` `stage.focus({ preventScroll: true });` via focusRegion
  - `src/editor/focus/focus.ts:65` `row.focus();` via focusRegion
  - `src/editor/focus/focus.ts:77` `first.focus();` via focusRegion
  - `src/editor/focus/focus.ts:82` `own.focus();` via focusRegion
  - `src/editor/focus/focus.ts:90` `if (held instanceof HTMLElement && held !== document.body) held.blur();` via focusTheCanvas
  - `src/editor/doors/menu.tsx:240` `if (dismissed && (document.activeElement === null || document.activeElement === document.body)) returnFocus.current?.focus();` via useMenuLayer
- **Leitores:**
  - `src/editor/focus/focus.ts:89` `const held = document.activeElement;` via focusTheCanvas
  - `src/editor/focus/focus.ts:195` `if (region && !region.contains(document.activeElement)) focusRegion(region);` via carryOut
  - `src/editor/focus/focus.ts:253` `carryOut(store, request.move, document.activeElement);` via installFocus
- **Criação:** `src/editor/focus/focus.ts:89` `const held = document.activeElement;`
- **Descarte:** fim-da-página `src/editor/focus/focus.ts:89` `const held = document.activeElement;`
- **Navegador:** foco

## EST-L05b-019 — arraste vivo

- **Declaração:** `src/editor/drag/drag-session.ts:42` `let live: LiveDrag | null = null;`
- **Forma:** `LiveDrag | null`: o arraste que o dono do ponteiro conduz, com os nós que move e a proposta atual
- **Valores possíveis:**
  - V1 `null`: nenhum arraste vivo `src/editor/drag/drag-session.ts:42` `let live: LiveDrag | null = null;`
  - V2 o arraste iniciado sem proposta `src/editor/drag/drag-session.ts:50` `live = { id: counter, dragged, base: null };`
  - V3 o arraste com a proposta do ponteiro `src/editor/drag/drag-session.ts:53` `if (live !== null) live = { ...live, base };`
- **Escritores:**
  - `src/editor/drag/drag-session.ts:50` `live = { id: counter, dragged, base: null };` via liveDrag.begin
  - `src/editor/drag/drag-session.ts:53` `if (live !== null) live = { ...live, base };` via liveDrag.propose
  - `src/editor/drag/drag-session.ts:56` `live = null;` via liveDrag.end
- **Leitores:**
  - `src/editor/drag/drag-session.ts:47` `get: (): LiveDrag | null => live,` via liveDrag.get
  - `src/editor/drag/drag-session.ts:103` `const drag = live;` via levelUp
  - `src/editor/drag/drag-session.ts:114` `const drag = live;` via levelDown
- **Criação:** `src/editor/drag/drag-session.ts:42` `let live: LiveDrag | null = null;`
- **Descarte:** fim-da-página `src/editor/drag/drag-session.ts:42` `let live: LiveDrag | null = null;`
- **Navegador:** não

## EST-L05b-020 — número de arrastes começados

- **Declaração:** `src/editor/drag/drag-session.ts:43` `let counter = 0;`
- **Forma:** `number`
- **Valores possíveis:**
  - V1 `0`: nenhum arraste começou `src/editor/drag/drag-session.ts:43` `let counter = 0;`
  - V2 n, um a mais a cada arraste começado `src/editor/drag/drag-session.ts:49` `counter += 1;`
- **Escritores:**
  - `src/editor/drag/drag-session.ts:49` `counter += 1;` via liveDrag.begin
- **Leitores:**
  - `src/editor/drag/drag-session.ts:50` `live = { id: counter, dragged, base: null };` via liveDrag.begin
- **Criação:** `src/editor/drag/drag-session.ts:43` `let counter = 0;`
- **Descarte:** fim-da-página `src/editor/drag/drag-session.ts:43` `let counter = 0;`
- **Navegador:** não

## EST-L05b-021 — marca da última requisição de foco atendida

- **Declaração:** `src/editor/focus/focus.ts:248` `let done = store.getState().ui.focus.request?.count ?? 0;`
- **Forma:** `number`: o número da requisição de foco já levada ao DOM
- **Valores possíveis:**
  - V1 o número da requisição atendida na abertura da inscrição `src/editor/focus/focus.ts:248` `let done = store.getState().ui.focus.request?.count ?? 0;`
  - V2 o número da requisição que acabou de ser atendida `src/editor/focus/focus.ts:252` `done = request.count;`
- **Escritores:**
  - `src/editor/focus/focus.ts:252` `done = request.count;` via a inscrição criada por installFocus
- **Leitores:**
  - `src/editor/focus/focus.ts:251` `if (request === null || request.count === done) return;` via a inscrição criada por installFocus
- **Criação:** `src/editor/focus/focus.ts:248` `let done = store.getState().ui.focus.request?.count ?? 0;`
- **Descarte:** `src/editor/focus/focus.ts:247` `export function installFocus(store: EditorStore): () => void {` (a marca vive enquanto a inscrição criada ali existir)
- **Navegador:** não

## EST-L05b-022 — preferências gravadas no armazenamento local

- **Declaração:** `src/editor/preferences/preferences.ts:126` `const KEY = 'preferences';`
- **Forma:** uma string JSON guardada sob a chave preferences do armazenamento local do navegador
- **Valores possíveis:**
  - V1 ausente: a leitura devolve null `src/editor/preferences/preferences.ts:131` `return window.localStorage.getItem(KEY);`
  - V2 o texto JSON das preferências gravadas `src/editor/preferences/preferences.ts:138` `window.localStorage.setItem(KEY, text);`
- **Escritores:**
  - `src/editor/preferences/preferences.ts:138` `window.localStorage.setItem(KEY, text);` via browserStorage.write
- **Leitores:**
  - `src/editor/preferences/preferences.ts:131` `return window.localStorage.getItem(KEY);` via browserStorage.read
- **Criação:** `src/editor/preferences/preferences.ts:126` `const KEY = 'preferences';`
- **Descarte:** fim-da-página `src/editor/preferences/preferences.ts:126` `const KEY = 'preferences';`
- **Navegador:** não

## EST-L05b-023 — preferências da última leitura da store

- **Declaração:** `src/editor/preferences/preferences.ts:234` `let last = store.getState().ui.preferences;`
- **Forma:** `Preferences`
- **Valores possíveis:**
  - V1 as preferências de quando a inscrição abriu `src/editor/preferences/preferences.ts:234` `let last = store.getState().ui.preferences;`
  - V2 as preferências da leitura corrente `src/editor/preferences/preferences.ts:242` `last = now;`
- **Escritores:**
  - `src/editor/preferences/preferences.ts:242` `last = now;` via persistPreferences
- **Leitores:**
  - `src/editor/preferences/preferences.ts:240` `const changed = now !== last;` via persistPreferences
- **Criação:** `src/editor/preferences/preferences.ts:234` `let last = store.getState().ui.preferences;`
- **Descarte:** `src/editor/preferences/preferences.ts:233` `export function persistPreferences(store: Store<EditorUi>, storage: PreferenceStorage): () => void {` (vive enquanto a inscrição criada ali existir)
- **Navegador:** não

## EST-L05b-024 — documento da última leitura da store

- **Declaração:** `src/editor/preferences/preferences.ts:235` `let lastDocument = store.getState().document;`
- **Forma:** `DocumentJson`
- **Valores possíveis:**
  - V1 o documento de quando a inscrição abriu `src/editor/preferences/preferences.ts:235` `let lastDocument = store.getState().document;`
  - V2 o documento da leitura corrente `src/editor/preferences/preferences.ts:243` `lastDocument = state.document;`
- **Escritores:**
  - `src/editor/preferences/preferences.ts:243` `lastDocument = state.document;` via persistPreferences
- **Leitores:**
  - `src/editor/preferences/preferences.ts:241` `const documentChanged = state.document !== lastDocument;` via persistPreferences
- **Criação:** `src/editor/preferences/preferences.ts:235` `let lastDocument = store.getState().document;`
- **Descarte:** `src/editor/preferences/preferences.ts:233` `export function persistPreferences(store: Store<EditorUi>, storage: PreferenceStorage): () => void {` (vive enquanto a inscrição criada ali existir)
- **Navegador:** não

## EST-L05b-025 — o que o armazenamento guardava no início

- **Declaração:** `src/editor/test-boot.ts:19` `export const STORED_AT_START = '__storedAtStart';`
- **Forma:** uma propriedade da janela com as contagens do armazenamento local e do de sessão no início
- **Valores possíveis:**
  - V1 ausente: a nota ainda não foi escrita `src/editor/test-boot.ts:19` `export const STORED_AT_START = '__storedAtStart';`
  - V2 escrita com as contagens `src/editor/test-boot.ts:44` `(target as unknown as Record<string, unknown>)[STORED_AT_START] = { local: target.localStorage.length, session: target.sessionStorage.length };`
- **Escritores:**
  - `src/editor/test-boot.ts:44` `(target as unknown as Record<string, unknown>)[STORED_AT_START] = { local: target.localStorage.length, session: target.sessionStorage.length };` via noteStoredAtStart
- **Leitores:**
  - `src/editor/test-boot.test.ts:70` `expect((target as unknown as Record<string, unknown>)[STORED_AT_START]).toEqual({ local: 2, session: 0 });`
- **Criação:** `src/editor/test-boot.ts:44` `(target as unknown as Record<string, unknown>)[STORED_AT_START] = { local: target.localStorage.length, session: target.sessionStorage.length };`
- **Descarte:** fim-da-página `src/editor/test-boot.ts:19` `export const STORED_AT_START = '__storedAtStart';`
- **Navegador:** não

## EST-L05b-026 — medida do quadro anterior no boot desenhado

- **Declaração:** `src/editor/test-boot.ts:108` `let last = '';`
- **Forma:** `string`: a caixa do palco no quadro anterior, como texto
- **Valores possíveis:**
  - V1 vazio: nenhum quadro medido ainda `src/editor/test-boot.ts:108` `let last = '';`
  - V2 a medida do último quadro `src/editor/test-boot.ts:119` `last = size;`
- **Escritores:**
  - `src/editor/test-boot.ts:119` `last = size;` via settle
- **Leitores:**
  - `src/editor/test-boot.ts:118` `still = size !== '' && size === last ? still + 1 : 0;` via settle
- **Criação:** `src/editor/test-boot.ts:108` `let last = '';`
- **Descarte:** `src/editor/test-boot.ts:105` `export function runDrawnTestBoot(store: EditorStore, boot: TestBoot, results: TestBootResult[], target: Window = window): () => void {` (vive enquanto durar a chamada)
- **Navegador:** não

## EST-L05b-027 — quadros seguidos com o palco do mesmo tamanho

- **Declaração:** `src/editor/test-boot.ts:109` `let still = 0;`
- **Forma:** `number`
- **Valores possíveis:**
  - V1 `0`: o tamanho mudou, ou a medida veio vazia `src/editor/test-boot.ts:109` `let still = 0;`
  - V2 n: quantos quadros seguidos o palco repetiu o tamanho `src/editor/test-boot.ts:118` `still = size !== '' && size === last ? still + 1 : 0;`
- **Escritores:**
  - `src/editor/test-boot.ts:118` `still = size !== '' && size === last ? still + 1 : 0;` via settle
- **Leitores:**
  - `src/editor/test-boot.ts:121` `if (still >= STILL_FRAMES || frames >= MOST_FRAMES) results.push(...runTestBoot(store, { commands: drawn }));` via settle
- **Criação:** `src/editor/test-boot.ts:109` `let still = 0;`
- **Descarte:** `src/editor/test-boot.ts:105` `export function runDrawnTestBoot(store: EditorStore, boot: TestBoot, results: TestBootResult[], target: Window = window): () => void {` (vive enquanto durar a chamada)
- **Navegador:** não

## EST-L05b-028 — quadros esperados no boot desenhado

- **Declaração:** `src/editor/test-boot.ts:110` `let frames = 0;`
- **Forma:** `number`
- **Valores possíveis:**
  - V1 `0`: nenhum quadro esperado `src/editor/test-boot.ts:110` `let frames = 0;`
  - V2 n: um a mais a cada quadro `src/editor/test-boot.ts:120` `frames += 1;`
- **Escritores:**
  - `src/editor/test-boot.ts:120` `frames += 1;` via settle
- **Leitores:**
  - `src/editor/test-boot.ts:121` `if (still >= STILL_FRAMES || frames >= MOST_FRAMES) results.push(...runTestBoot(store, { commands: drawn }));` via settle
- **Criação:** `src/editor/test-boot.ts:110` `let frames = 0;`
- **Descarte:** `src/editor/test-boot.ts:105` `export function runDrawnTestBoot(store: EditorStore, boot: TestBoot, results: TestBootResult[], target: Window = window): () => void {` (vive enquanto durar a chamada)
- **Navegador:** não

## EST-L05b-029 — rotulador de valores memorizado

- **Declaração:** `src/editor/text.ts:35` `return useCallback(`
- **Forma:** a função (property, value) => string memoizada por useCallback
- **Valores possíveis:**
  - V1 a função criada na montagem `src/editor/text.ts:35` `return useCallback(`
  - V2 recriada quando o idioma muda `src/editor/text.ts:40` `[locale],`
- **Escritores:**
  - `src/editor/text.ts:35` `return useCallback(` via useValueLabel (a criação do valor memorizado)
- **Leitores:**
  - `src/editor/shell/field.tsx:608` `const valueLabel = useValueLabel();`
- **Criação:** `src/editor/text.ts:35` `return useCallback(`
- **Descarte:** `src/editor/text.ts:33` `export function useValueLabel(): (property: string, value: string) => string {` (morre com a desmontagem do componente que usa o rotulador)
- **Navegador:** não

## EST-L05b-030 — tradutor memorizado

- **Declaração:** `src/editor/text.ts:50` `return useCallback((key, params = {}) => textOf(locale, key, params), [locale]);`
- **Forma:** a função de tradução memoizada por useCallback
- **Valores possíveis:**
  - V1 a função criada na montagem `src/editor/text.ts:50` `return useCallback((key, params = {}) => textOf(locale, key, params), [locale]);`
  - V2 recriada quando o idioma muda `src/editor/text.ts:50` `[locale]);`
- **Escritores:**
  - `src/editor/text.ts:50` `return useCallback((key, params = {}) => textOf(locale, key, params), [locale]);` via useT (a criação do valor memorizado)
- **Leitores:**
  - `src/editor/doors/menu.tsx:39` `const t = useT();`
- **Criação:** `src/editor/text.ts:50` `return useCallback((key, params = {}) => textOf(locale, key, params), [locale]);`
- **Descarte:** `src/editor/text.ts:48` `export function useT(): Translate {` (morre com a desmontagem do componente que usa o tradutor)
- **Navegador:** não

## EST-L05b-031 — quadro pedido pelo boot desenhado

- **Declaração:** `src/editor/test-boot.ts:111` `let frame: number | null = null;`
- **Forma:** `number | null`: o identificador do quadro que o laço espera, ou nada
- **Valores possíveis:**
  - V1 nenhum: nada pedido, ou o quadro já chegou `src/editor/test-boot.ts:114` `frame = null;`
  - V2 o identificador do quadro pedido `src/editor/test-boot.ts:122` `else frame = target.requestAnimationFrame(settle);`
- **Escritores:**
  - `src/editor/test-boot.ts:114` `frame = null;` via settle
  - `src/editor/test-boot.ts:122` `else frame = target.requestAnimationFrame(settle);` via settle
  - `src/editor/test-boot.ts:125` `if (!stopped) frame = target.requestAnimationFrame(settle);` via a continuação das fontes
  - `src/editor/test-boot.ts:130` `frame = null;` via a parada
- **Leitores:**
  - `src/editor/test-boot.ts:129` `if (frame !== null) target.cancelAnimationFrame(frame);` via a parada
- **Criação:** `src/editor/test-boot.ts:111` `let frame: number | null = null;`
- **Descarte:** `src/editor/test-boot.ts:105` `export function runDrawnTestBoot(store: EditorStore, boot: TestBoot, results: TestBootResult[], target: Window = window): () => void {` (vive enquanto o laço ou a parada que a chamada devolve existirem; DEF-0001)
- **Navegador:** não

## EST-L05b-032 — boot desenhado parado

- **Declaração:** `src/editor/test-boot.ts:112` `let stopped = false;`
- **Forma:** `boolean`
- **Valores possíveis:**
  - V1 `false`: o laço corre `src/editor/test-boot.ts:112` `let stopped = false;`
  - V2 `true`: a parada foi chamada `src/editor/test-boot.ts:128` `stopped = true;`
- **Escritores:**
  - `src/editor/test-boot.ts:128` `stopped = true;` via a parada
- **Leitores:**
  - `src/editor/test-boot.ts:115` `if (stopped) return;` via settle
  - `src/editor/test-boot.ts:125` `if (!stopped) frame = target.requestAnimationFrame(settle);` via a continuação das fontes
- **Criação:** `src/editor/test-boot.ts:112` `let stopped = false;`
- **Descarte:** `src/editor/test-boot.ts:105` `export function runDrawnTestBoot(store: EditorStore, boot: TestBoot, results: TestBootResult[], target: Window = window): () => void {` (DEF-0001)
- **Navegador:** não

## Excluídos

## EXC-L05b-001 — itens lidos da área de transferência do sistema

- **Padrão:** P-E03
- **Ocorrência:** `src/editor/clipboard.ts:39` `let items: ClipboardItems;`
- **Motivo:** variável local de systemClipboard, preenchida com a leitura do navegador e percorrida dentro da mesma chamada, morrendo no fim dela `src/editor/clipboard.ts:41` `items = await navigator.clipboard.read();`

## EXC-L05b-002 — texto HTML acumulado da área de transferência

- **Padrão:** P-E03
- **Ocorrência:** `src/editor/clipboard.ts:46` `let html: string | null = null;`
- **Motivo:** local de systemClipboard, acumula o HTML enquanto percorre os itens e morre no fim da chamada `src/editor/clipboard.ts:49` `html ??= await textOf(item, 'text/html');`

## EXC-L05b-003 — texto simples acumulado da área de transferência

- **Padrão:** P-E03
- **Ocorrência:** `src/editor/clipboard.ts:47` `let text: string | null = null;`
- **Motivo:** local de systemClipboard, acumula o texto enquanto percorre os itens e morre no fim da chamada `src/editor/clipboard.ts:50` `text ??= await textOf(item, 'text/plain');`

## EXC-L05b-004 — pontuação da consulta na barra de comandos

- **Padrão:** P-E03
- **Ocorrência:** `src/editor/command-bar/command-bar.ts:95` `let score = 0;`
- **Motivo:** acumulador local de matchScore, somado no laço e devolvido dentro da mesma chamada `src/editor/command-bar/command-bar.ts:104` `return first !== undefined && text.startsWith(first) ? score + 1 : score;`

## EXC-L05b-005 — alvo pequeno mais próximo da proposta de descarte

- **Padrão:** P-E03
- **Ocorrência:** `src/editor/drag/drop.ts:221` `let aimed: { readonly id: NodeId; readonly box: Box; readonly distance: number } | null = null;`
- **Motivo:** local de proposeDrop, guarda o alvo mais próximo dentro do laço e é lido no mesmo passo da chamada `src/editor/drag/drop.ts:231` `if (aimed !== null) {`

## EXC-L05b-006 — ancestral interno do laço de bandas de escape

- **Padrão:** P-E03
- **Ocorrência:** `src/editor/drag/drop.ts:247` `let inner: { readonly axis: Axis; readonly start: number; readonly end: number; readonly before: number; readonly after: number } | null = null;`
- **Motivo:** local do laço de ancestrais de proposeDrop, reescrito a cada nível e perdido no fim da chamada `src/editor/drag/drop.ts:259` `inner = { axis, start, end: start + m.extent, before, after };`

## EXC-L05b-007 — comentário que nomeia o armazenamento local

- **Padrão:** P-E10
- **Ocorrência:** `src/editor/preferences/preferences.ts:120` `// Where preferences are kept between sessions; the browser's localStorage by default, a map in tests.`
- **Motivo:** a linha é um comentário que cita o armazenamento local; não lê nem grava nada do navegador `src/editor/preferences/preferences.ts:120` `// Where preferences are kept between sessions; the browser's localStorage by default, a map in tests.`

## EXC-L05b-008 — rolagem da opção ativa até a vista

- **Padrão:** P-E11
- **Ocorrência:** `src/editor/focus/focus.ts:159` `option.scrollIntoView({ block: 'nearest' });`
- **Motivo:** a chamada rola a lista do combobox para trazer a opção ativa à vista; nada nesta área lê a posição de rolagem que ela deixa `src/editor/focus/focus.ts:159` `option.scrollIntoView({ block: 'nearest' });`

## EXC-L05b-009 — estado do editor montado ao devolver o contexto de uma mudança

- **Padrão:** P-E03
- **Ocorrência:** `src/editor/view/edit-context.ts:14` `let ui = state.ui;`
- **Motivo:** acumulador local de restoreEditContext, reescrito campo a campo (breakpoint, estado, classe, quadro-chave) e devolvido no fim da mesma chamada `src/editor/view/edit-context.ts:33` `return ui;`

# Estado — lote L06

Área dos ids: `L06`. Itens `EST-L06-nnn` e exclusões `EXC-L06-nnn`.
Cada campo vai numa linha; as citações são literais do código na versão lida (SHA1 do lote).

## EST-L06-001 — estado do laço do bridge do editor
- **Declaração:** `src/editor/assistant/client.ts:6` `const socket = makeSocket(url), running = new Map<string, AbortController>();`; `src/editor/assistant/client.ts:7` `let closed = false, queue = Promise.resolve();`
- **Forma:** `{ running: Map<string, AbortController>; closed: boolean; queue: Promise<void> }` fechado na fábrica `connectEditor`
- **Valores possíveis:** V1 aberto, sem pedido em curso; V2 com pedidos registrados em `running`; V3 fechado (`closed` verdadeiro e `running` vazio)
- **Escritores:** `src/editor/assistant/client.ts:29` `running.set(id, controller);`; `src/editor/assistant/client.ts:30` `queue = queue.then(async () => {`; `src/editor/assistant/client.ts:38` `finally { running.delete(id); }`; `src/editor/assistant/client.ts:43` `closed = true;`; `src/editor/assistant/client.ts:45` `running.clear();`
- **Leitores:** `src/editor/assistant/client.ts:24` `running.get(String(message.id))?.abort();`; `src/editor/assistant/client.ts:31` `if (closed) return;`
- **Criação:** `src/editor/assistant/client.ts:6` `const socket = makeSocket(url), running = new Map<string, AbortController>();`
- **Descarte:** `src/editor/assistant/client.ts:53` `return () => {`
- **Navegador:** não

## EST-L06-002 — controlador do assistente por store
- **Declaração:** `src/editor/assistant/controller.ts:24` `const controllers = new WeakMap<EditorStore, AssistantController>();`
- **Forma:** `WeakMap<EditorStore, AssistantController>`
- **Valores possíveis:** V1 store com controlador instalado; V2 store sem entrada
- **Escritores:** `src/editor/assistant/controller.ts:209` `controllers.set(store, controller);`; `src/editor/assistant/controller.ts:206` `controllers.delete(store);`
- **Leitores:** `src/editor/assistant/controller.ts:25` `export const assistantController = (store: EditorStore): AssistantController | undefined => controllers.get(store);`; `src/editor/assistant/controller.ts:36` `if (controllers.has(store)) return () => { };`
- **Criação:** `src/editor/assistant/controller.ts:24` `const controllers = new WeakMap<EditorStore, AssistantController>();`
- **Descarte:** `fim-da-página` `src/editor/assistant/controller.ts:206` `controllers.delete(store);`
- **Navegador:** não

## EST-L06-003 — desinstalador do assistente por store
- **Declaração:** `src/editor/assistant/controller.ts:29` `const uninstallers = new WeakMap<EditorStore, () => void>();`
- **Forma:** `WeakMap<EditorStore, () => void>`
- **Valores possíveis:** V1 store com desinstalador registrado; V2 store sem entrada
- **Escritores:** `src/editor/assistant/controller.ts:234` `uninstallers.set(store, uninstall);`; `src/editor/assistant/controller.ts:32` `uninstallers.delete(store);`
- **Leitores:** `src/editor/assistant/controller.ts:31` `uninstallers.get(store)?.();`
- **Criação:** `src/editor/assistant/controller.ts:29` `const uninstallers = new WeakMap<EditorStore, () => void>();`
- **Descarte:** `fim-da-página` `src/editor/assistant/controller.ts:32` `uninstallers.delete(store);`
- **Navegador:** não

## EST-L06-004 — estado vivo da instalação do assistente
- **Declaração:** `src/editor/assistant/controller.ts:37` `let alive = true, secret = '', pairing: Pairing | null = null, disconnect: (() => void) | null = null;`; `src/editor/assistant/controller.ts:38` `let vault: CredentialVault | null = null;`; `src/editor/assistant/controller.ts:39` `let session: ReturnType<typeof createAssistantSession> | null = null;`
- **Forma:** `{ alive: boolean; secret: string; pairing: Pairing | null; disconnect: (() => void) | null; vault: CredentialVault | null; session: AssistSession | null }` fechado em `installAssistant`
- **Valores possíveis:** V1 recém-instalado (`alive` verdadeiro, `secret` vazio, `pairing`, `vault` e `session` nulos); V2 com cofre aberto; V3 com sessão criada; V4 pareado; V5 conectado (`disconnect` preenchido); V6 descartado (`alive` falso)
- **Escritores:** `src/editor/assistant/controller.ts:191` `stageKey: value => { secret = value; },`; `src/editor/assistant/controller.ts:197` `pairing = { url: candidate.url, token: candidate.token };`; `src/editor/assistant/controller.ts:167` `disconnect = close;`; `src/editor/assistant/controller.ts:79` `vault = value;`; `src/editor/assistant/controller.ts:84` `session = createAssistantSession({`; `src/editor/assistant/controller.ts:200` `alive = false;`
- **Leitores:** `src/editor/assistant/controller.ts:42` `if (alive) store.dispatch(reportAssistant.command, { value: value as unknown as JsonValue });`; `src/editor/assistant/controller.ts:128` `if (!alive) return;`; `src/editor/assistant/controller.ts:83` `if (!vault) throw new Error('assistant.storageFailed');`; `src/editor/assistant/controller.ts:117` `session?.cancel();`; `src/editor/assistant/controller.ts:122` `disconnect?.();`
- **Criação:** `src/editor/assistant/controller.ts:37` `let alive = true, secret = '', pairing: Pairing | null = null, disconnect: (() => void) | null = null;`
- **Descarte:** `src/editor/assistant/controller.ts:200` `alive = false;`
- **Navegador:** não

## EST-L06-005 — pedido e revisão do assistente
- **Declaração:** `src/editor/assistant/controller.ts:40` `let lastRequest = 0, revision = 0;`
- **Forma:** `{ lastRequest: number; revision: number }`
- **Valores possíveis:** V1 sem pedido tratado (`lastRequest` zero); V2 com o serial do último pedido tratado; V3 com a revisão do documento incrementada a cada mudança
- **Escritores:** `src/editor/assistant/controller.ts:221` `lastRequest = current.request.serial;`; `src/editor/assistant/controller.ts:211` `revision++;`
- **Leitores:** `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;`; `src/editor/assistant/controller.ts:57` `read: () => ({ document: store.getState().document, selection: store.getState().selection, revision }),`
- **Criação:** `src/editor/assistant/controller.ts:40` `let lastRequest = 0, revision = 0;`
- **Descarte:** `fim-da-página` `src/editor/assistant/controller.ts:40` `let lastRequest = 0, revision = 0;`
- **Navegador:** não

## EST-L06-006 — resposta em curso e falha do assistente
- **Declaração:** `src/editor/assistant/controller.ts:72` `let replyId: string | null = null;`; `src/editor/assistant/controller.ts:73` `let failure: MessageId | null = null;`
- **Forma:** `{ replyId: string | null; failure: MessageId | null }`
- **Valores possíveis:** V1 nenhuma resposta em curso e nenhuma falha; V2 com a entrada da resposta em curso; V3 com a falha do último turno
- **Escritores:** `src/editor/assistant/controller.ts:93` `if (replyId === null) replyId = append('assistant', text);`; `src/editor/assistant/controller.ts:102` `replyId = null;`; `src/editor/assistant/controller.ts:107` `failure = state.error;`; `src/editor/assistant/controller.ts:183` `failure = null;`
- **Leitores:** `src/editor/assistant/controller.ts:94` `else report({ entries: current.entries.map(entry => entry.id === replyId ? { ...entry, text: entry.text + text } : entry) });`; `src/editor/assistant/controller.ts:226` `notice(failure ?? key);`
- **Criação:** `src/editor/assistant/controller.ts:72` `let replyId: string | null = null;`
- **Descarte:** `fim-da-página` `src/editor/assistant/controller.ts:73` `let failure: MessageId | null = null;`
- **Navegador:** não

## EST-L06-007 — modelo do assistente em uso
- **Declaração:** `src/editor/assistant/controller.ts:114` `let model = store.getState().ui.preferences.assistantModel ?? DEFAULT_ASSISTANT_MODEL;`
- **Forma:** `string`
- **Valores possíveis:** V1 o modelo das preferências ou o padrão; V2 o modelo novo lido depois de uma mudança de preferência
- **Escritores:** `src/editor/assistant/controller.ts:217` `model = nextModel;`
- **Leitores:** `src/editor/assistant/controller.ts:216` `if (nextModel !== model && !current.busy) {`
- **Criação:** `src/editor/assistant/controller.ts:114` `let model = store.getState().ui.preferences.assistantModel ?? DEFAULT_ASSISTANT_MODEL;`
- **Descarte:** `fim-da-página` `src/editor/assistant/controller.ts:114` `let model = store.getState().ui.preferences.assistantModel ?? DEFAULT_ASSISTANT_MODEL;`
- **Navegador:** não

## EST-L06-008 — cofre de credenciais do assistente
- **Declaração:** `src/editor/assistant/credentials.ts:4` `export async function openCredentialVault(indexedDB: IDBFactory, cryptography: Pick<Crypto, 'subtle'>, nonce: () => Uint8Array<ArrayBuffer>, name = 'assistant-credentials'): Promise<CredentialVault> {`; `src/editor/assistant/credentials.ts:6` `const request = indexedDB.open(name, 1);`; `src/editor/assistant/credentials.ts:7` `request.onupgradeneeded = () => request.result.createObjectStore('secrets');`
- **Forma:** base IndexedDB `assistant-credentials` com o object store `secrets` (chave `key` e registro `credential`)
- **Valores possíveis:** V1 base recém-criada com a chave de cifra gerada; V2 sem credencial guardada (a leitura devolve nulo); V3 com a credencial cifrada; V4 sem credencial depois de `clear`
- **Escritores:** `src/editor/assistant/credentials.ts:46` `await write([['credential', { iv, encrypted }]]);`; `src/editor/assistant/credentials.ts:21` `else tx.objectStore('secrets').put(value, key);`; `src/editor/assistant/credentials.ts:20` `if (value === undefined) tx.objectStore('secrets').delete(key);`; `src/editor/assistant/credentials.ts:34` `if (request.result === undefined) store.put(selected, 'key');`
- **Leitores:** `src/editor/assistant/credentials.ts:49` `const stored = await read<{ iv: Uint8Array<ArrayBuffer>; encrypted: ArrayBuffer }>('credential');`; `src/editor/assistant/credentials.ts:50` `if (!stored) return null;`; `src/editor/assistant/controller.ts:74` `const ready = openCredentialVault(indexedDB, crypto, credentialNonce).then(value => {`
- **Criação:** `src/editor/assistant/credentials.ts:6` `const request = indexedDB.open(name, 1);`
- **Descarte:** `src/editor/assistant/credentials.ts:54` `clear: () => write([['credential', undefined]]), close: () => database.close(),`
- **Navegador:** não

## EST-L06-009 — reserva de turno do assistente
- **Declaração:** `src/editor/assistant/editor.ts:12` `let reserved: TurnTransaction | null = null, claimed = false;`
- **Forma:** `{ reserved: TurnTransaction | null; claimed: boolean }` fechado em `editorTools`
- **Valores possíveis:** V1 livre (nulo e não reclamada); V2 reservada sem reivindicação; V3 reclamada pela sessão; V4 liberada pela função devolvida
- **Escritores:** `src/editor/assistant/editor.ts:65` `reserved = current;`; `src/editor/assistant/editor.ts:66` `claimed = false;`; `src/editor/assistant/editor.ts:70` `reserved = null;`; `src/editor/assistant/editor.ts:78` `claimed = true;`
- **Leitores:** `src/editor/assistant/editor.ts:63` `if (reserved !== null) throw new Error('Assistant is busy');`; `src/editor/assistant/editor.ts:69` `if (reserved === current) {`; `src/editor/assistant/editor.ts:76` `if (reserved === null) return begin();`; `src/editor/assistant/editor.ts:77` `if (claimed) throw new Error('Assistant transaction already claimed');`
- **Criação:** `src/editor/assistant/editor.ts:12` `let reserved: TurnTransaction | null = null, claimed = false;`
- **Descarte:** `src/editor/assistant/editor.ts:70` `reserved = null;`
- **Navegador:** não

## EST-L06-010 — estado do servidor MCP
- **Declaração:** `src/editor/assistant/mcp.ts:6` `let initialized = false, negotiated = false;`; `src/editor/assistant/mcp.ts:7` `const running = new Map<string, AbortController>();`
- **Forma:** `{ initialized: boolean; negotiated: boolean; running: Map<string, AbortController> }` fechado em `createMcpHandler`
- **Valores possíveis:** V1 antes do `initialize` (ambos os sinalizadores falsos); V2 negociado; V3 inicializado; V4 com chamadas em curso em `running`
- **Escritores:** `src/editor/assistant/mcp.ts:26` `negotiated = true;`; `src/editor/assistant/mcp.ts:19` `if (negotiated) initialized = true;`; `src/editor/assistant/mcp.ts:36` `running.set(key, controller);`; `src/editor/assistant/mcp.ts:41` `finally { running.delete(key); }`
- **Leitores:** `src/editor/assistant/mcp.ts:30` `if (!initialized) return error(-32002, 'Initialize the connection first');`; `src/editor/assistant/mcp.ts:35` `if (running.has(key)) return error(-32600, 'Duplicate request id');`; `src/editor/assistant/mcp.ts:15` `running.get(JSON.stringify(params.requestId))?.abort();`
- **Criação:** `src/editor/assistant/mcp.ts:6` `let initialized = false, negotiated = false;`
- **Descarte:** `fim-da-página` `src/editor/assistant/mcp.ts:7` `const running = new Map<string, AbortController>();`
- **Navegador:** não

## EST-L06-011 — referência ao campo do assistente
- **Declaração:** `src/editor/assistant/panel.tsx:24` `const field = useRef<HTMLInputElement | HTMLTextAreaElement>(null);`
- **Forma:** `RefObject<HTMLInputElement | HTMLTextAreaElement>`
- **Valores possíveis:** V1 nulo enquanto não montado; V2 o input ou textarea montado
- **Escritores:** `src/editor/assistant/panel.tsx:41` `<textarea {...props} ref={field as React.RefObject<HTMLTextAreaElement>} rows={4} />`
- **Leitores:** `src/editor/assistant/panel.tsx:29` `if (field.current && field.current.value !== value) field.current.value = value;`; `src/editor/assistant/panel.tsx:33` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, { value: field.current.value });`
- **Criação:** `src/editor/assistant/panel.tsx:24` `const field = useRef<HTMLInputElement | HTMLTextAreaElement>(null);`
- **Descarte:** `fim-da-página` `src/editor/assistant/panel.tsx:24` `const field = useRef<HTMLInputElement | HTMLTextAreaElement>(null);`
- **Navegador:** não

## EST-L06-012 — referências ao campo da chave e ao seletor de conexão
- **Declaração:** `src/editor/assistant/panel.tsx:49` `const key = useRef<HTMLInputElement>(null), connection = useRef<HTMLInputElement>(null);`
- **Forma:** dois `RefObject<HTMLInputElement>`
- **Valores possíveis:** V1 nulos enquanto não montados; V2 os inputs montados (senha e arquivo)
- **Escritores:** `src/editor/assistant/panel.tsx:60` `<input ref={key} className="input" type="password" autoComplete="off" aria-label={t('assistant.key')} disabled={state.busy} />`; `src/editor/assistant/panel.tsx:72` `<input ref={connection} className="visually-hidden" type="file" accept="application/json,.json" tabIndex={-1} aria-hidden onChange={event => {`
- **Leitores:** `src/editor/assistant/panel.tsx:62` `assistantController(store)?.stageKey(key.current?.value ?? '');`; `src/editor/assistant/panel.tsx:63` `if (key.current) key.current.value = '';`; `src/editor/assistant/panel.tsx:66` `onClick={() => connection.current?.click()}`
- **Criação:** `src/editor/assistant/panel.tsx:49` `const key = useRef<HTMLInputElement>(null), connection = useRef<HTMLInputElement>(null);`
- **Descarte:** `fim-da-página` `src/editor/assistant/panel.tsx:49` `const key = useRef<HTMLInputElement>(null), connection = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L06-013 — conversa e turno da sessão do assistente
- **Declaração:** `src/editor/assistant/session.ts:15` `let messages: readonly ChatMessage[] = [], active: AbortController | null = null;`
- **Forma:** `{ messages: readonly ChatMessage[]; active: AbortController | null }` fechado em `createAssistantSession`
- **Valores possíveis:** V1 conversa vazia e nada em curso; V2 turno em curso (`active` preenchido); V3 conversa com o histórico do turno; V4 turno cancelado ou falhado; V5 conversa limpa
- **Escritores:** `src/editor/assistant/session.ts:30` `active = controller;`; `src/editor/assistant/session.ts:22` `messages = [];`; `src/editor/assistant/session.ts:43` `messages = result.messages;`; `src/editor/assistant/session.ts:44` `active = null;`; `src/editor/assistant/session.ts:48` `active = null;`
- **Leitores:** `src/editor/assistant/session.ts:16` `const publish = (error: SessionState['error'] = null) => ports.onState({ busy: active !== null, error, history: messages });`; `src/editor/assistant/session.ts:19` `history: () => messages,`; `src/editor/assistant/session.ts:27` `if (active) throw new Error('Assistant is busy');`
- **Criação:** `src/editor/assistant/session.ts:15` `let messages: readonly ChatMessage[] = [], active: AbortController | null = null;`
- **Descarte:** `src/editor/assistant/session.ts:55` `active?.abort(new Error('Assistant cancelled'));`
- **Navegador:** não

## EST-L06-014 — referência ao campo dos controles do painel de dados
- **Declaração:** `src/editor/data/controls.tsx:53` `const field = useRef<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>(null);`
- **Forma:** `RefObject<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>`
- **Valores possíveis:** V1 nulo enquanto não montado; V2 o controle montado (select, textarea ou input)
- **Escritores:** `src/editor/data/controls.tsx:75` `<select {...common} ref={field} onChange={(event) => keep(event.currentTarget.value)}>`; `src/editor/data/controls.tsx:83` `<textarea {...common} ref={field} rows={3} onBlur={(event) => keep(event.currentTarget.value)} />`; `src/editor/data/controls.tsx:85` `<input {...common} ref={field} type={kind === 'number' ? 'number' : 'text'} spellCheck={false} autoComplete="off" onBlur={(event) => keep(event.currentTarget.value)} />`
- **Leitores:** `src/editor/data/controls.tsx:58` `if (field.current !== null && (menu || document.activeElement !== field.current)) field.current.value = value;`; `src/editor/data/controls.tsx:94` `if (field.current !== null) keep(field.current.value);`
- **Criação:** `src/editor/data/controls.tsx:53` `const field = useRef<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>(null);`
- **Descarte:** `fim-da-página` `src/editor/data/controls.tsx:53` `const field = useRef<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>(null);`
- **Navegador:** não

## EST-L06-015 — foco e elemento ativo do documento
- **Declaração:** `src/editor/data/controls.tsx:58` `if (field.current !== null && (menu || document.activeElement !== field.current)) field.current.value = value;`
- **Forma:** elemento ativo do documento (`document.activeElement`)
- **Valores possíveis:** V1 o campo em edição; V2 o primeiro campo inválido posto em foco pelo envio do formulário; V3 nenhum elemento ativo
- **Escritores:** `src/editor/forms/runtime.ts:310` `first.focus();`
- **Leitores:** `src/editor/data/controls.tsx:58` `document.activeElement !== field.current`
- **Criação:** `src/editor/forms/runtime.ts:310` `first.focus();`
- **Descarte:** `fim-da-página` `src/editor/data/controls.tsx:58` `document.activeElement !== field.current`
- **Navegador:** foco

## EST-L06-016 — tipos de entrada que aceitam máscara
- **Declaração:** `src/editor/forms/inspector.tsx:7` `const MASKABLE: ReadonlySet<string> = new Set(['number', 'date', 'datetime-local', 'month', 'week', 'time']);`
- **Forma:** `ReadonlySet<string>`
- **Valores possíveis:** V1 o conjunto dos seis tipos de entrada que aceitam máscara
- **Escritores:** `src/editor/forms/inspector.tsx:7` `const MASKABLE: ReadonlySet<string> = new Set(['number', 'date', 'datetime-local', 'month', 'week', 'time']);` via carga do módulo
- **Leitores:** `src/editor/forms/inspector.tsx:140` `MASKABLE.has(inputTypeOf(node))`
- **Criação:** `src/editor/forms/inspector.tsx:7` `const MASKABLE: ReadonlySet<string> = new Set(['number', 'date', 'datetime-local', 'month', 'week', 'time']);`
- **Descarte:** `fim-da-página` `src/editor/forms/inspector.tsx:7` `const MASKABLE: ReadonlySet<string> = new Set(['number', 'date', 'datetime-local', 'month', 'week', 'time']);`
- **Navegador:** não

## EST-L06-017 — referência ao campo de configuração de formulário
- **Declaração:** `src/editor/forms/inspector.tsx:36` `const field = useRef<HTMLInputElement | HTMLTextAreaElement>(null);`
- **Forma:** `RefObject<HTMLInputElement | HTMLTextAreaElement>`
- **Valores possíveis:** V1 nulo enquanto não montado; V2 o input ou textarea montado
- **Escritores:** `src/editor/forms/inspector.tsx:86` `<textarea {...common} ref={field as React.RefObject<HTMLTextAreaElement>} />`; `src/editor/forms/inspector.tsx:87` `<input {...common} ref={field as React.RefObject<HTMLInputElement>} inputMode={control.kind === 'number' ? 'decimal' : undefined} list={control.options ? `${id}-options` : undefined} />`
- **Leitores:** `src/editor/forms/inspector.tsx:42` `if (field.current !== null) {`; `src/editor/forms/inspector.tsx:48` `const input = field.current;`
- **Criação:** `src/editor/forms/inspector.tsx:36` `const field = useRef<HTMLInputElement | HTMLTextAreaElement>(null);`
- **Descarte:** `fim-da-página` `src/editor/forms/inspector.tsx:36` `const field = useRef<HTMLInputElement | HTMLTextAreaElement>(null);`
- **Navegador:** não

## EST-L06-018 — escolhas de campos e elementos do painel de formulários
- **Declaração:** `src/editor/forms/inspector.tsx:106` `const choices = useMemo(() => {`
- **Forma:** memo `{ fields: { value: string; label: string }[]; elements: { value: string; label: string }[] }`
- **Valores possíveis:** V1 recalculado quando o documento ou o nó muda; V2 sem página do nó (listas vazias)
- **Escritores:** `src/editor/forms/inspector.tsx:106` `const choices = useMemo(() => {` via recomputação quando as dependências mudam
- **Leitores:** `src/editor/forms/inspector.tsx:117` `t: key => t(key as MessageId), ...choices, locales: LOCALES,`
- **Criação:** `src/editor/forms/inspector.tsx:106` `const choices = useMemo(() => {`
- **Descarte:** `fim-da-página` `src/editor/forms/inspector.tsx:113` `}, [document, node.id]);`
- **Navegador:** não

## EST-L06-019 — registro de campos e contador de erros do runtime de formulários
- **Declaração:** `src/editor/forms/runtime.ts:9` `const fieldStates = new Map<Control, { config: FieldConfig;`; `src/editor/forms/runtime.ts:10` `let serial = 0;`
- **Forma:** `{ fieldStates: Map<Control, { config: FieldConfig; touched: boolean; composing: boolean; error: HTMLElement; created: boolean; describedBy: string | null; invalid: string | null; validity: string; lookup: AbortController | null }>; serial: number }` fechado em `installFormsRuntime`
- **Valores possíveis:** V1 campo registrado e intocado; V2 tocado; V3 em composição de texto; V4 com busca de endereço em curso (`lookup` preenchido); V5 registro esvaziado na desmontagem
- **Escritores:** `src/editor/forms/runtime.ts:182` `fieldStates.set(field, { config, touched: false, composing: false, error, created: !previous, describedBy, invalid: field.getAttribute('aria-invalid'), validity: field.validationMessage, lookup: null });`; `src/editor/forms/runtime.ts:186` `if (state) state.composing = true;`; `src/editor/forms/runtime.ts:190` `if (state) state.composing = false;`; `src/editor/forms/runtime.ts:206` `if (state) state.touched = true;`; `src/editor/forms/runtime.ts:286` `state.touched = false;`; `src/editor/forms/runtime.ts:135` `state.lookup = controller;`; `src/editor/forms/runtime.ts:172` `error.id = `; `src/editor/forms/runtime.ts:375` `fieldStates.clear();`
- **Leitores:** `src/editor/forms/runtime.ts:81` `const state = fieldStates.get(field);`; `src/editor/forms/runtime.ts:101` `const state = fieldStates.get(field);`; `src/editor/forms/runtime.ts:131` `const state = fieldStates.get(field), config = state?.config.address;`; `src/editor/forms/runtime.ts:200` `const related = fieldStates.get(other);`; `src/editor/forms/runtime.ts:265` `const state = fieldStates.get(field);`
- **Criação:** `src/editor/forms/runtime.ts:9` `const fieldStates = new Map<Control, { config: FieldConfig;`
- **Descarte:** `src/editor/forms/runtime.ts:375` `fieldStates.clear();`
- **Navegador:** não

## EST-L06-020 — operações pendentes e limpadores do runtime de formulários
- **Declaração:** `src/editor/forms/runtime.ts:7` `const disposers: (() => void)[] = [];`; `src/editor/forms/runtime.ts:8` `const pending = new Set<AbortController>();`
- **Forma:** `{ disposers: (() => void)[]; pending: Set<AbortController> }`
- **Valores possíveis:** V1 nenhuma busca ou envio em curso; V2 com uma busca de endereço em curso; V3 com um envio em curso; V4 esvaziados na desmontagem
- **Escritores:** `src/editor/forms/runtime.ts:50` `disposers.push(() => node.removeEventListener(type, listener));`; `src/editor/forms/runtime.ts:224` `disposers.push(() => {`; `src/editor/forms/runtime.ts:259` `disposers.push(() => created.remove());`; `src/editor/forms/runtime.ts:136` `pending.add(controller);`; `src/editor/forms/runtime.ts:158` `} finally { pending.delete(controller); }`; `src/editor/forms/runtime.ts:324` `pending.add(controller);`; `src/editor/forms/runtime.ts:354` `finally { pending.delete(controller);`
- **Leitores:** `src/editor/forms/runtime.ts:363` `for (const controller of pending) controller.abort();`; `src/editor/forms/runtime.ts:364` `for (const dispose of disposers) dispose();`
- **Criação:** `src/editor/forms/runtime.ts:7` `const disposers: (() => void)[] = [];`
- **Descarte:** `src/editor/forms/runtime.ts:363` `for (const controller of pending) controller.abort();`
- **Navegador:** não

## EST-L06-021 — prévia digitada da máscara de campo
- **Declaração:** `src/editor/forms/settings.tsx:43` `const [trial, setTrial] = useState('');`
- **Forma:** `string`
- **Valores possíveis:** V1 vazio na montagem; V2 o texto digitado no campo de prévia
- **Escritores:** `src/editor/forms/settings.tsx:126` `field('preview.input', 'text', trial, setTrial)`
- **Leitores:** `src/editor/forms/settings.tsx:87` `const result = createFormsEngine(systemClock.now).mask(trial, mask);`
- **Criação:** `src/editor/forms/settings.tsx:43` `const [trial, setTrial] = useState('');`
- **Descarte:** `fim-da-página` `src/editor/forms/settings.tsx:43` `const [trial, setTrial] = useState('');`
- **Navegador:** não

## EST-L06-022 — idioma das mensagens de validação em edição
- **Declaração:** `src/editor/forms/settings.tsx:44` `const [locale, setLocale] = useState(ports.locales[0] ?? 'en');`
- **Forma:** `string`
- **Valores possíveis:** V1 o primeiro idioma da lista; V2 o idioma escolhido no menu
- **Escritores:** `src/editor/forms/settings.tsx:145` `field('messages.locale', 'select', locale, setLocale, ports.locales.map((value) => ({ value, label: value })))`
- **Leitores:** `src/editor/forms/settings.tsx:64` `return (by[code] ?? '') !== '' || (config.messages?.[locale]?.[code] ?? '') !== '';`; `src/editor/forms/settings.tsx:150` `const written = config.messages?.[locale]?.[code];`
- **Criação:** `src/editor/forms/settings.tsx:44` `const [locale, setLocale] = useState(ports.locales[0] ?? 'en');`
- **Descarte:** `fim-da-página` `src/editor/forms/settings.tsx:44` `const [locale, setLocale] = useState(ports.locales[0] ?? 'en');`
- **Navegador:** não

## EST-L06-023 — nome do bloco de máscara em digitação
- **Declaração:** `src/editor/forms/settings.tsx:45` `const [blockName, setBlockName] = useState('');`
- **Forma:** `string`
- **Valores possíveis:** V1 vazio na montagem; V2 o nome digitado
- **Escritores:** `src/editor/forms/settings.tsx:111` `field('mask.block.name', 'text', blockName, setBlockName)`
- **Leitores:** `src/editor/forms/settings.tsx:112` `changeMask({ blocks: { ...mask.blocks, [blockName]: '00' } })`
- **Criação:** `src/editor/forms/settings.tsx:45` `const [blockName, setBlockName] = useState('');`
- **Descarte:** `fim-da-página` `src/editor/forms/settings.tsx:45` `const [blockName, setBlockName] = useState('');`
- **Navegador:** não

## EST-L06-024 — chave do campo de endereço em digitação
- **Declaração:** `src/editor/forms/settings.tsx:46` `const [addressKey, setAddressKey] = useState('');`
- **Forma:** `string`
- **Valores possíveis:** V1 vazio na montagem; V2 a chave digitada
- **Escritores:** `src/editor/forms/settings.tsx:163` `field('address.key', 'text', addressKey, setAddressKey)`
- **Leitores:** `src/editor/forms/settings.tsx:164` `address: { ...address, fields: { ...address.fields, [addressKey]: ports.fields[0]?.value ?? '' } }`
- **Criação:** `src/editor/forms/settings.tsx:46` `const [addressKey, setAddressKey] = useState('');`
- **Descarte:** `fim-da-página` `src/editor/forms/settings.tsx:46` `const [addressKey, setAddressKey] = useState('');`
- **Navegador:** não

## EST-L06-025 — contagem do último pedido de captura tratado
- **Declaração:** `src/editor/import/capture.ts:73` `let done = store.getState().ui.capture?.count ?? 0;`
- **Forma:** `number`
- **Valores possíveis:** V1 a contagem do estado na instalação; V2 a contagem do último pedido tratado
- **Escritores:** `src/editor/import/capture.ts:100` `done = request.count;`
- **Leitores:** `src/editor/import/capture.ts:99` `if (request === undefined || request.count === done) return;`
- **Criação:** `src/editor/import/capture.ts:73` `let done = store.getState().ui.capture?.count ?? 0;`
- **Descarte:** `src/editor/import/capture.ts:105` `stop();`
- **Navegador:** não

## EST-L06-026 — captura viva
- **Declaração:** `src/editor/import/capture.ts:74` `let alive = true;`
- **Forma:** `boolean`
- **Valores possíveis:** V1 ligada; V2 desligada na desinstalação
- **Escritores:** `src/editor/import/capture.ts:104` `alive = false;`
- **Leitores:** `src/editor/import/capture.ts:81` `if (alive) store.notice(message('status.capture.noCompanion'));`; `src/editor/import/capture.ts:84` `if (!alive) return;`; `src/editor/import/capture.ts:94` `if (!alive) return;`
- **Criação:** `src/editor/import/capture.ts:74` `let alive = true;`
- **Descarte:** `src/editor/import/capture.ts:104` `alive = false;`
- **Navegador:** não

## EST-L06-027 — recusa descartada do campo de ajustes
- **Declaração:** `src/editor/inspector/attribute-feedback.ts:20` `const [dismissed, setDismissed] = useState<unknown>(null);`
- **Forma:** `unknown` (a recusa descartada) ou nulo
- **Valores possíveis:** V1 nulo (nenhuma recusa descartada); V2 a recusa descartada pelo botão
- **Escritores:** `src/editor/inspector/attribute-feedback.ts:23` `dismiss: () => setDismissed(refusal) };`
- **Leitores:** `src/editor/inspector/attribute-feedback.ts:21` `return refusal === null || refusal === dismissed`
- **Criação:** `src/editor/inspector/attribute-feedback.ts:20` `const [dismissed, setDismissed] = useState<unknown>(null);`
- **Descarte:** `fim-da-página` `src/editor/inspector/attribute-feedback.ts:20` `const [dismissed, setDismissed] = useState<unknown>(null);`
- **Navegador:** não

## EST-L06-028 — catálogo de atributos do manifesto
- **Declaração:** `src/editor/inspector/attributes.ts:8` `export const ATTRIBUTES = new Map(manifest.elements.attributes.map((attribute) => [attribute.id, attribute]));`
- **Forma:** `Map<string, AttributeFacts>`
- **Valores possíveis:** V1 o catálogo indexado por id de atributo, montado na carga do módulo
- **Escritores:** `src/editor/inspector/attributes.ts:8` `export const ATTRIBUTES = new Map(manifest.elements.attributes.map((attribute) => [attribute.id, attribute]));` via carga do módulo
- **Leitores:** `src/editor/inspector/attributes.ts:22` `const facts = ATTRIBUTES.get(attribute);`
- **Criação:** `src/editor/inspector/attributes.ts:8` `export const ATTRIBUTES = new Map(manifest.elements.attributes.map((attribute) => [attribute.id, attribute]));`
- **Descarte:** `fim-da-página` `src/editor/inspector/attributes.ts:8` `export const ATTRIBUTES = new Map(manifest.elements.attributes.map((attribute) => [attribute.id, attribute]));`
- **Navegador:** não

## EST-L06-029 — linha conceito de cada item do painel
- **Declaração:** `src/editor/inspector/concept-rows.ts:35` `const ROW_OF = new Map<string, { readonly row: ConceptRow; readonly part: 'head' | 'details' }>();`
- **Forma:** `Map<string, { row: ConceptRow; part: 'head' | 'details' }>`
- **Valores possíveis:** V1 item sem linha; V2 item no cabeçalho de uma linha; V3 item nos detalhes de uma linha
- **Escritores:** `src/editor/inspector/concept-rows.ts:37` `for (const item of row.head) ROW_OF.set(item, { row, part: 'head' });`; `src/editor/inspector/concept-rows.ts:38` `for (const item of row.details) ROW_OF.set(item, { row, part: 'details' });`
- **Leitores:** `src/editor/inspector/concept-rows.ts:41` `const ROW_OF_ITEM = (item: string) => ROW_OF.get(item) ?? null;`; `src/editor/inspector/concept-rows.ts:43` `ROW_OF.get(item) ?? null`
- **Criação:** `src/editor/inspector/concept-rows.ts:35` `const ROW_OF = new Map<string, { readonly row: ConceptRow; readonly part: 'head' | 'details' }>();`
- **Descarte:** `fim-da-página` `src/editor/inspector/concept-rows.ts:35` `const ROW_OF = new Map<string, { readonly row: ConceptRow; readonly part: 'head' | 'details' }>();`
- **Navegador:** não

## EST-L06-030 — alvos das linhas de par
- **Declaração:** `src/editor/inspector/concept-rows.ts:47` `const PAIR_TARGETS = new Map(manifest.properties.rows.map((r) => [r.id, r.fields.map((f) => f.target)] as const));`
- **Forma:** `Map<string, readonly string[]>`
- **Valores possíveis:** V1 os dois alvos de cada linha de par, por id de linha
- **Escritores:** `src/editor/inspector/concept-rows.ts:47` `const PAIR_TARGETS = new Map(manifest.properties.rows.map((r) => [r.id, r.fields.map((f) => f.target)] as const));` via carga do módulo
- **Leitores:** `src/editor/inspector/concept-rows.ts:60` `if (item.startsWith('pair:')) return (PAIR_TARGETS.get(item.slice('pair:'.length)) ?? []).flatMap((t) => editedProperties(t));`
- **Criação:** `src/editor/inspector/concept-rows.ts:47` `const PAIR_TARGETS = new Map(manifest.properties.rows.map((r) => [r.id, r.fields.map((f) => f.target)] as const));`
- **Descarte:** `fim-da-página` `src/editor/inspector/concept-rows.ts:47` `const PAIR_TARGETS = new Map(manifest.properties.rows.map((r) => [r.id, r.fields.map((f) => f.target)] as const));`
- **Navegador:** não

## EST-L06-031 — alvo de cada porta do painel
- **Declaração:** `src/editor/inspector/concept-rows.ts:48` `const TARGET_OF_DOOR = new Map(`
- **Forma:** `Map<string, string | null>`
- **Valores possíveis:** V1 a porta com a propriedade, o composto ou a receita que ela edita; V2 a porta sem alvo (nulo)
- **Escritores:** `src/editor/inspector/concept-rows.ts:48` `const TARGET_OF_DOOR = new Map(` via carga do módulo
- **Leitores:** `src/editor/inspector/concept-rows.ts:61` `const target = TARGET_OF_DOOR.get(item) ?? null;`
- **Criação:** `src/editor/inspector/concept-rows.ts:48` `const TARGET_OF_DOOR = new Map(`
- **Descarte:** `fim-da-página` `src/editor/inspector/concept-rows.ts:48` `const TARGET_OF_DOOR = new Map(`
- **Navegador:** não

## EST-L06-032 — parâmetros próprios de cada receita
- **Declaração:** `src/editor/inspector/concept-rows.ts:57` `const RECIPE_PARAMETERS = new Map(manifest.properties.recipes.map((recipe) => [recipe.id, recipe.declarations.filter((d) => d.value === null).map((d) => d.property)] as const));`
- **Forma:** `Map<string, readonly string[]>`
- **Valores possíveis:** V1 as declarações declaradas com valor nulo de cada receita, por id
- **Escritores:** `src/editor/inspector/concept-rows.ts:57` `const RECIPE_PARAMETERS = new Map(manifest.properties.recipes.map((recipe) => [recipe.id, recipe.declarations.filter((d) => d.value === null).map((d) => d.property)] as const));` via carga do módulo
- **Leitores:** `src/editor/inspector/concept-rows.ts:62` `const parameters = target === null ? undefined : RECIPE_PARAMETERS.get(target);`
- **Criação:** `src/editor/inspector/concept-rows.ts:57` `const RECIPE_PARAMETERS = new Map(manifest.properties.recipes.map((recipe) => [recipe.id, recipe.declarations.filter((d) => d.value === null).map((d) => d.property)] as const));`
- **Descarte:** `fim-da-página` `src/editor/inspector/concept-rows.ts:57` `const RECIPE_PARAMETERS = new Map(manifest.properties.recipes.map((recipe) => [recipe.id, recipe.declarations.filter((d) => d.value === null).map((d) => d.property)] as const));`
- **Navegador:** não

## EST-L06-033 — parada do gradiente em edição
- **Declaração:** `src/editor/inspector/gradient-view.ts:9` `let stop = 0;`
- **Forma:** `number`
- **Valores possíveis:** V1 zero na carga; V2 o índice da parada escolhida
- **Escritores:** `src/editor/inspector/gradient-view.ts:20` `stop = index;`
- **Leitores:** `src/editor/inspector/gradient-view.ts:17` `stop: (): number => stop,`
- **Criação:** `src/editor/inspector/gradient-view.ts:9` `let stop = 0;`
- **Descarte:** `fim-da-página` `src/editor/inspector/gradient-view.ts:9` `let stop = 0;`
- **Navegador:** não

## EST-L06-034 — ângulo guardado por tipo de gradiente
- **Declaração:** `src/editor/inspector/gradient-view.ts:10` `const angles = new Map<GradientType, number>();`
- **Forma:** `Map<GradientType, number>`
- **Valores possíveis:** V1 tipo sem ângulo guardado (usa o valor de fallback); V2 ângulo guardado do tipo
- **Escritores:** `src/editor/inspector/gradient-view.ts:27` `angles.set(type, angle);`
- **Leitores:** `src/editor/inspector/gradient-view.ts:24` `angleFor: (type: GradientType, fallback: number): number => angles.get(type) ?? fallback,`
- **Criação:** `src/editor/inspector/gradient-view.ts:10` `const angles = new Map<GradientType, number>();`
- **Descarte:** `fim-da-página` `src/editor/inspector/gradient-view.ts:10` `const angles = new Map<GradientType, number>();`
- **Navegador:** não

## EST-L06-035 — ouvintes do editor de gradiente
- **Declaração:** `src/editor/inspector/gradient-view.ts:11` `const listeners = new Set<() => void>();`
- **Forma:** `Set<() => void>`
- **Valores possíveis:** V1 sem ouvintes; V2 com os ouvintes das vistas assinadas
- **Escritores:** `src/editor/inspector/gradient-view.ts:31` `listeners.add(listener);`
- **Leitores:** `src/editor/inspector/gradient-view.ts:13` `for (const listener of [...listeners]) listener();`
- **Criação:** `src/editor/inspector/gradient-view.ts:11` `const listeners = new Set<() => void>();`
- **Descarte:** `src/editor/inspector/gradient-view.ts:32` `return () => listeners.delete(listener);`
- **Navegador:** não

## EST-L06-036 — rótulo de cada propriedade e composto
- **Declaração:** `src/editor/inspector/rows.ts:28` `const LABELS = new Map<string, MessageId>([`
- **Forma:** `Map<string, MessageId>`
- **Valores possíveis:** V1 as chaves de mensagem por id de propriedade ou composto
- **Escritores:** `src/editor/inspector/rows.ts:28` `const LABELS = new Map<string, MessageId>([` via carga do módulo
- **Leitores:** `src/editor/inspector/rows.ts:34` `const first = LABELS.get(row.fields[0]?.target ?? '');`
- **Criação:** `src/editor/inspector/rows.ts:28` `const LABELS = new Map<string, MessageId>([`
- **Descarte:** `fim-da-página` `src/editor/inspector/rows.ts:28` `const LABELS = new Map<string, MessageId>([`
- **Navegador:** não

## EST-L06-037 — grupos declarados por seção
- **Declaração:** `src/editor/inspector/rows.ts:53` `const GROUPS = new Map<string, readonly { readonly id: string; readonly labelKey: MessageId }[]>(`
- **Forma:** `Map<string, readonly { id: string; labelKey: MessageId }[]>`
- **Valores possíveis:** V1 os grupos de cada seção, na ordem declarada; V2 seção sem grupos (lista vazia)
- **Escritores:** `src/editor/inspector/rows.ts:53` `const GROUPS = new Map<string, readonly { readonly id: string; readonly labelKey: MessageId }[]>(` via carga do módulo
- **Leitores:** `src/editor/inspector/rows.ts:57` `GROUPS.get(section) ?? []`
- **Criação:** `src/editor/inspector/rows.ts:53` `const GROUPS = new Map<string, readonly { readonly id: string; readonly labelKey: MessageId }[]>(`
- **Descarte:** `fim-da-página` `src/editor/inspector/rows.ts:53` `const GROUPS = new Map<string, readonly { readonly id: string; readonly labelKey: MessageId }[]>(`
- **Navegador:** não

## EST-L06-038 — grupo de cada propriedade, composto ou receita
- **Declaração:** `src/editor/inspector/rows.ts:61` `const MEMBERS = new Map<string, string>([`
- **Forma:** `Map<string, string>`
- **Valores possíveis:** V1 o grupo por id de propriedade, composto ou receita; V2 id sem grupo
- **Escritores:** `src/editor/inspector/rows.ts:61` `const MEMBERS = new Map<string, string>([` via carga do módulo
- **Leitores:** `src/editor/inspector/rows.ts:67` `export const groupOf = (target: string): string | null => MEMBERS.get(target) ?? null;`
- **Criação:** `src/editor/inspector/rows.ts:61` `const MEMBERS = new Map<string, string>([`
- **Descarte:** `fim-da-página` `src/editor/inspector/rows.ts:61` `const MEMBERS = new Map<string, string>([`
- **Navegador:** não

## EST-L06-039 — grupo de cada porta do painel
- **Declaração:** `src/editor/inspector/rows.ts:71` `const BY_DOOR = new Map<string, string>();`
- **Forma:** `Map<string, string>`
- **Valores possíveis:** V1 a primeira propriedade, composto ou receita que lista a porta, com o grupo dela; V2 porta sem entrada
- **Escritores:** `src/editor/inspector/rows.ts:73` `for (const ref of entry.doors) if (!BY_DOOR.has(ref)) BY_DOOR.set(ref, entry.group);`
- **Leitores:** `src/editor/inspector/rows.ts:75` `export const groupOfDoor = (ref: string): string | null => BY_DOOR.get(ref) ?? null;`
- **Criação:** `src/editor/inspector/rows.ts:71` `const BY_DOOR = new Map<string, string>();`
- **Descarte:** `fim-da-página` `src/editor/inspector/rows.ts:71` `const BY_DOOR = new Map<string, string>();`
- **Navegador:** não

## EST-L06-040 — conjunto vazio de propriedades em uso
- **Declaração:** `src/editor/inspector/sections.ts:33` `const EMPTY_HELD: ReadonlySet<string> = new Set();`
- **Forma:** `ReadonlySet<string>`
- **Valores possíveis:** V1 sempre vazio, a resposta para nenhum elemento selecionado
- **Escritores:** `src/editor/inspector/sections.ts:33` `const EMPTY_HELD: ReadonlySet<string> = new Set();` via carga do módulo
- **Leitores:** `src/editor/inspector/sections.ts:115` `return node === null ? EMPTY_HELD : heldInStyles(node.styles);`
- **Criação:** `src/editor/inspector/sections.ts:33` `const EMPTY_HELD: ReadonlySet<string> = new Set();`
- **Descarte:** `fim-da-página` `src/editor/inspector/sections.ts:33` `const EMPTY_HELD: ReadonlySet<string> = new Set();`
- **Navegador:** não

## EST-L06-041 — tipos de valor do campo de cor
- **Declaração:** `src/editor/inspector/sections.ts:41` `const COLOUR_TYPES: ReadonlySet<string> = new Set(manifest.properties.properties.filter((p) => p.control === 'color-field').map((p) => p.valueType));`
- **Forma:** `ReadonlySet<string>`
- **Valores possíveis:** V1 os tipos de valor das propriedades cujo controle é o campo de cor
- **Escritores:** `src/editor/inspector/sections.ts:41` `const COLOUR_TYPES: ReadonlySet<string> = new Set(manifest.properties.properties.filter((p) => p.control === 'color-field').map((p) => p.valueType));` via carga do módulo
- **Leitores:** `src/editor/inspector/sections.ts:51` `return type !== undefined && COLOUR_TYPES.has(type);`
- **Criação:** `src/editor/inspector/sections.ts:41` `const COLOUR_TYPES: ReadonlySet<string> = new Set(manifest.properties.properties.filter((p) => p.control === 'color-field').map((p) => p.valueType));`
- **Descarte:** `fim-da-página` `src/editor/inspector/sections.ts:41` `const COLOUR_TYPES: ReadonlySet<string> = new Set(manifest.properties.properties.filter((p) => p.control === 'color-field').map((p) => p.valueType));`
- **Navegador:** não

## EST-L06-042 — propriedades e compostos essenciais
- **Declaração:** `src/editor/inspector/sections.ts:158` `const ESSENTIAL = new Set([`
- **Forma:** `Set<string>`
- **Valores possíveis:** V1 os ids das propriedades e compostos marcados como essenciais no manifesto
- **Escritores:** `src/editor/inspector/sections.ts:158` `const ESSENTIAL = new Set([` via carga do módulo
- **Leitores:** `src/editor/inspector/sections.ts:174` `export const isEssential = (target: string): boolean => ESSENTIAL.has(target) || editedProperties(target).some((p) => ESSENTIAL.has(p));`
- **Criação:** `src/editor/inspector/sections.ts:158` `const ESSENTIAL = new Set([`
- **Descarte:** `fim-da-página` `src/editor/inspector/sections.ts:158` `const ESSENTIAL = new Set([`
- **Navegador:** não

## EST-L06-043 — propriedades editadas por porta (inspector)
- **Declaração:** `src/editor/inspector/sections.ts:167` `const BY_DOOR = new Map<string, string[]>();`
- **Forma:** `Map<string, string[]>`
- **Valores possíveis:** V1 os ids de propriedade, composto e receita que cada porta edita; V2 porta sem entrada
- **Escritores:** `src/editor/inspector/sections.ts:169` `for (const ref of entry.doors) BY_DOOR.set(ref, [...(BY_DOOR.get(ref) ?? []), entry.id]);`
- **Leitores:** `src/editor/inspector/sections.ts:171` `export const editedPropertiesByDoor = (ref: string): readonly string[] | null => BY_DOOR.get(ref) ?? null;`
- **Criação:** `src/editor/inspector/sections.ts:167` `const BY_DOOR = new Map<string, string[]>();`
- **Descarte:** `fim-da-página` `src/editor/inspector/sections.ts:167` `const BY_DOOR = new Map<string, string[]>();`
- **Navegador:** não

## EST-L06-044 — longhands de cada alvo
- **Declaração:** `src/editor/inspector/sections.ts:180` `const LONGHANDS = new Map<string, readonly string[]>([`
- **Forma:** `Map<string, readonly string[]>`
- **Valores possíveis:** V1 a própria propriedade como seu único longhand; V2 os longhands do composto, na ordem dele
- **Escritores:** `src/editor/inspector/sections.ts:180` `const LONGHANDS = new Map<string, readonly string[]>([` via carga do módulo
- **Leitores:** `src/editor/inspector/sections.ts:163` `export const editedProperties = (target: string): readonly string[] => LONGHANDS.get(target) ?? [target];`; `src/editor/inspector/sections.ts:188` `const longhands = LONGHANDS.get(id);`
- **Criação:** `src/editor/inspector/sections.ts:180` `const LONGHANDS = new Map<string, readonly string[]>([`
- **Descarte:** `fim-da-página` `src/editor/inspector/sections.ts:180` `const LONGHANDS = new Map<string, readonly string[]>([`
- **Navegador:** não

## EST-L06-045 — itens lidos pelo resumo de cada seção
- **Declaração:** `src/editor/inspector/sections.ts:184` `const READS = new Map<SectionId, readonly (readonly string[])[]>(`
- **Forma:** `Map<SectionId, readonly (readonly string[])[]>`
- **Valores possíveis:** V1 os longhands de cada item nomeado pelo manifesto da seção; V2 seção sem resumo (lista vazia)
- **Escritores:** `src/editor/inspector/sections.ts:184` `const READS = new Map<SectionId, readonly (readonly string[])[]>(` via carga do módulo
- **Leitores:** `src/editor/inspector/sections.ts:197` `return (READS.get(section) ?? []).flat();`; `src/editor/inspector/sections.ts:298` `const items = (READS.get(section) ?? []).map((longhands) => longhands.map((p) => values[p] ?? ''));`
- **Criação:** `src/editor/inspector/sections.ts:184` `const READS = new Map<SectionId, readonly (readonly string[])[]>(`
- **Descarte:** `fim-da-página` `src/editor/inspector/sections.ts:184` `const READS = new Map<SectionId, readonly (readonly string[])[]>(`
- **Navegador:** não

## EST-L06-046 — valores neutros das propriedades avançadas
- **Declaração:** `src/editor/inspector/sections.ts:244` `const NEUTRAL_ADVANCED = new Set(['horizontal-tb', 'visible', 'manual']);`
- **Forma:** `Set<string>`
- **Valores possíveis:** V1 os três valores iniciais que o resumo da seção avançada deixa de fora
- **Escritores:** `src/editor/inspector/sections.ts:244` `const NEUTRAL_ADVANCED = new Set(['horizontal-tb', 'visible', 'manual']);` via carga do módulo
- **Leitores:** `src/editor/inspector/sections.ts:256` `advanced: (items, words) => joined(items.map(first).filter((value) => value !== '' && !NEUTRAL_ADVANCED.has(value)), words),`
- **Criação:** `src/editor/inspector/sections.ts:244` `const NEUTRAL_ADVANCED = new Set(['horizontal-tb', 'visible', 'manual']);`
- **Descarte:** `fim-da-página` `src/editor/inspector/sections.ts:244` `const NEUTRAL_ADVANCED = new Set(['horizontal-tb', 'visible', 'manual']);`
- **Navegador:** não

## EST-L06-047 — camada de sombra em edição
- **Declaração:** `src/editor/inspector/shadow-view.ts:5` `const chosen = new Map<string, number>();`
- **Forma:** `Map<string, number>`
- **Valores possíveis:** V1 propriedade sem camada escolhida (usa zero); V2 o índice da camada escolhida
- **Escritores:** `src/editor/inspector/shadow-view.ts:13` `chosen.set(property, index);`
- **Leitores:** `src/editor/inspector/shadow-view.ts:10` `layer: (property: string): number => chosen.get(property) ?? 0,`
- **Criação:** `src/editor/inspector/shadow-view.ts:5` `const chosen = new Map<string, number>();`
- **Descarte:** `fim-da-página` `src/editor/inspector/shadow-view.ts:5` `const chosen = new Map<string, number>();`
- **Navegador:** não

## EST-L06-048 — ouvintes do editor de sombra
- **Declaração:** `src/editor/inspector/shadow-view.ts:6` `const listeners = new Set<() => void>();`
- **Forma:** `Set<() => void>`
- **Valores possíveis:** V1 sem ouvintes; V2 com os ouvintes das vistas assinadas
- **Escritores:** `src/editor/inspector/shadow-view.ts:19` `listeners.add(listener);`
- **Leitores:** `src/editor/inspector/shadow-view.ts:15` `for (const listener of [...listeners]) listener();`
- **Criação:** `src/editor/inspector/shadow-view.ts:6` `const listeners = new Set<() => void>();`
- **Descarte:** `src/editor/inspector/shadow-view.ts:20` `return () => listeners.delete(listener);`
- **Navegador:** não

## EST-L06-049 — versão do editor de sombra
- **Declaração:** `src/editor/inspector/shadow-view.ts:7` `let version = 0;`
- **Forma:** `number`
- **Valores possíveis:** V1 zero na carga; V2 incrementado a cada troca de camada
- **Escritores:** `src/editor/inspector/shadow-view.ts:14` `version += 1;`
- **Leitores:** `src/editor/inspector/shadow-view.ts:17` `version: (): number => version,`
- **Criação:** `src/editor/inspector/shadow-view.ts:7` `let version = 0;`
- **Descarte:** `fim-da-página` `src/editor/inspector/shadow-view.ts:7` `let version = 0;`
- **Navegador:** não

## EST-L06-050 — estado do assistente na interface do editor
- **Declaração:** `src/editor/assistant/state.ts:9` `export interface AssistantState {`; `src/editor/state.ts:37` `readonly assistant?: AssistantState;`
- **Forma:** `AssistantState` (o rascunho do campo, as preferências abertas, o turno em curso, a chave guardada, a conexão, a sessão, as mensagens, a imagem de referência, o pedido pendente, o serial e as contagens de tokens), opcional no `EditorUi`
- **Valores possíveis:** V1 ausente, nenhuma conversa ainda `src/editor/assistant/state.ts:24` `export const assistantOf = (ui: EditorUi): AssistantState => ui.assistant ?? INITIAL_ASSISTANT;`; V2 o valor inicial `src/editor/assistant/state.ts:23` `const INITIAL_ASSISTANT: AssistantState = { draft: '', preferences: false, busy: false, hasKey: false, connection: 'disconnected', session: '', entries: [], reference: null, request: null, serial: 0, inputTokens: 0, outputTokens: 0 };`; V3 as preferências abertas; V4 um turno em curso (busy verdadeiro com o pedido preenchido); V5 a conexão `connecting` ou `connected`; V6 as mensagens e as contagens de tokens do turno; V7 uma imagem de referência anexada
- **Escritores:** `src/editor/assistant/state.ts:26` `export const setAssistantPreferences = registerHandler<'assistant.setPreferences', EditorUi>('assistant.setPreferences', ({ state }, { open }) => ({ kind: 'change', ui: nextUi(state.ui, { preferences: open }) }));` via setAssistantPreferences; `src/editor/assistant/state.ts:31` `return { kind: 'change', ui: { ...nextUi(state.ui, { entries: [] }), preferences: { ...state.ui.preferences, assistantModel: model } }, message: message('assistant.modelChanged') };` via setAssistantModel; `src/editor/assistant/state.ts:41` `return { kind: 'change', ui: nextUi(state.ui, { reference: { name: picked.name, type: picked.type, bytes: picked.bytes } }), message: message('assistant.referenceAdded') };` via attachAssistantReference; `src/editor/assistant/state.ts:44` `export const clearAssistantReference = registerHandler<'assistant.clearReference', EditorUi>('assistant.clearReference', ({ state }) => ({ kind: 'change', ui: nextUi(state.ui, { reference: null }) }));` via clearAssistantReference; `src/editor/assistant/state.ts:58` `return { kind: 'change', ui: request(nextUi(state.ui, { busy: true }), 'send'), message: message('assistant.started') };` via sendAssistant; `src/editor/assistant/state.ts:60` `export const cancelAssistant = registerHandler<'assistant.cancel', EditorUi>('assistant.cancel', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'cancel') }));` via cancelAssistant; `src/editor/assistant/state.ts:61` `export const connectAssistant = registerHandler<'assistant.connect', EditorUi>('assistant.connect', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'connect') }));` via connectAssistant; `src/editor/assistant/state.ts:62` `export const disconnectAssistant = registerHandler<'assistant.disconnect', EditorUi>('assistant.disconnect', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'disconnect') }));` via disconnectAssistant; `src/editor/assistant/state.ts:63` `export const saveAssistantKey = registerHandler<'assistant.saveKey', EditorUi>('assistant.saveKey', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'save-key') }));` via saveAssistantKey; `src/editor/assistant/state.ts:64` `export const deleteAssistantKey = registerHandler<'assistant.deleteKey', EditorUi>('assistant.deleteKey', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'delete-key') }));` via deleteAssistantKey; `src/editor/assistant/state.ts:65` `export const selectAssistantSession = registerHandler<'assistant.selectSession', EditorUi>('assistant.selectSession', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'select-session') }));` via selectAssistantSession; `src/editor/assistant/state.ts:68` `return { kind: 'change', ui: request(nextUi(state.ui, { entries: [], draft: '', reference: null }), 'clear-conversation') };` via clearAssistantConversation; `src/editor/assistant/state.ts:75` `return { kind: 'change', ui: nextUi(state.ui, patch) };` via reportAssistant; `src/editor/assistant/controller.ts:42` `if (alive) store.dispatch(reportAssistant.command, { value: value as unknown as JsonValue });` via report
- **Leitores:** `src/editor/assistant/state.ts:24` `export const assistantOf = (ui: EditorUi): AssistantState => ui.assistant ?? INITIAL_ASSISTANT;` via assistantOf; `src/editor/assistant/panel.tsx:47` `const state = useEditorState(state => assistantOf(state.ui));` via AssistantPanel; `src/editor/assistant/controller.ts:214` `const ui = store.getState().ui, current = assistantOf(ui);` via a assinatura da store
- **Criação:** `src/editor/assistant/state.ts:23` `const INITIAL_ASSISTANT: AssistantState = { draft: '', preferences: false, busy: false, hasKey: false, connection: 'disconnected', session: '', entries: [], reference: null, request: null, serial: 0, inputTokens: 0, outputTokens: 0 };`
- **Descarte:** fim-da-página `src/editor/assistant/state.ts:23` `const INITIAL_ASSISTANT: AssistantState = { draft: '', preferences: false, busy: false, hasKey: false, connection: 'disconnected', session: '', entries: [], reference: null, request: null, serial: 0, inputTokens: 0, outputTokens: 0 };`
- **Navegador:** não

## EST-L06-051 — modelo do assistente escolhido nas preferências
- **Declaração:** `src/editor/preferences/preferences.ts:49` `readonly assistantModel?: string;`
- **Forma:** `string | undefined` (o identificador do modelo do serviço; ausente usa `DEFAULT_ASSISTANT_MODEL`)
- **Valores possíveis:** V1 ausente `src/editor/assistant/controller.ts:114` `let model = store.getState().ui.preferences.assistantModel ?? DEFAULT_ASSISTANT_MODEL;`; V2 o identificador escolhido `src/editor/assistant/state.ts:31` `return { kind: 'change', ui: { ...nextUi(state.ui, { entries: [] }), preferences: { ...state.ui.preferences, assistantModel: model } }, message: message('assistant.modelChanged') };`
- **Escritores:** `src/editor/assistant/state.ts:31` `return { kind: 'change', ui: { ...nextUi(state.ui, { entries: [] }), preferences: { ...state.ui.preferences, assistantModel: model } }, message: message('assistant.modelChanged') };` via setAssistantModel
- **Leitores:** `src/editor/assistant/controller.ts:86` `settings: () => ({ model: store.getState().ui.preferences.assistantModel ?? DEFAULT_ASSISTANT_MODEL, maxTokens: 8192 }),` via buildSession; `src/editor/assistant/panel.tsx:48` `const model = useEditorState(state => state.ui.preferences.assistantModel ?? DEFAULT_ASSISTANT_MODEL);` via AssistantPanel; `src/editor/assistant/controller.ts:215` `const nextModel = ui.preferences.assistantModel ?? DEFAULT_ASSISTANT_MODEL;` via a assinatura da store
- **Criação:** `src/editor/assistant/state.ts:31` `return { kind: 'change', ui: { ...nextUi(state.ui, { entries: [] }), preferences: { ...state.ui.preferences, assistantModel: model } }, message: message('assistant.modelChanged') };`
- **Descarte:** fim-da-página `src/editor/preferences/preferences.ts:49` `readonly assistantModel?: string;`
- **Navegador:** não

## EXC-L06-001
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/assistant/chat.ts:10` `let transaction: TurnTransaction | undefined, inputTokens = 0, outputTokens = 0;`
- **Motivo:** variável local de `runTurn`, criada e encerrada dentro da própria chamada: a transação é confirmada em `src/editor/assistant/chat.ts:21` `transaction?.commit();` ou cancelada em `src/editor/assistant/chat.ts:38` `transaction?.cancel();` antes do retorno; nada disso é lido por outra entrada.

## EXC-L06-002
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/assistant/provider.ts:9` `let binary = '';`
- **Motivo:** acumulador local de `imageBlock`, preenchido no laço da mesma chamada e consumido no retorno em `src/editor/assistant/provider.ts:11` `data: btoa(binary) } };`.

## EXC-L06-003
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/assistant/provider.ts:23` `let stopReason = '', stopped = false, inputTokens = 0, outputTokens = 0;`
- **Motivo:** variáveis locais de `streamReply`, todas devolvidas no retorno da mesma chamada em `src/editor/assistant/provider.ts:66` `stopReason, inputTokens, outputTokens };`.

## EXC-L06-004
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/assistant/stream.ts:4` `let buffer = '', event = 'message', data: string[] = [];`
- **Motivo:** estado local do gerador `parseEvents`, recriado a cada chamada e liberado no `finally` em `src/editor/assistant/stream.ts:49` `reader.releaseLock();`.

## EXC-L06-005
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/code-panel/highlight.ts:23` `let at = 0;`
- **Motivo:** cursor local do laço de `html`, zerado na chamada e morto no retorno em `src/editor/code-panel/highlight.ts:55` `return out;`.

## EXC-L06-006
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/code-panel/highlight.ts:80` `let at = 0;`
- **Motivo:** cursor local do laço de `javascript`, zerado na chamada e morto no retorno em `src/editor/code-panel/highlight.ts:100` `return out;`.

## EXC-L06-007
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/data/state.ts:122` `let parsed: unknown;`
- **Motivo:** variável local de `handedFile`, preenchida no `try` em `src/editor/data/state.ts:124` `parsed = JSON.parse(text);` e usada só dentro da própria função.

## EXC-L06-008
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/forms/settings.tsx:85` `let preview: string;`
- **Motivo:** texto local de uma renderização de `FieldFormSettings`, recomputado a cada render em `src/editor/forms/settings.tsx:88` `preview = ` e renderizado na mesma passagem; nada sobrevive à renderização.

## EXC-L06-009
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/inspector/rows.ts:84` `let carried = 0;`
- **Motivo:** acumulador local de `orderByGroup`, usado só no `map` da mesma chamada, cujo resultado é devolvido em `src/editor/inspector/rows.ts:91` `return placed.sort((a, b) => (a.group === b.group ? a.i - b.i : a.group - b.group)).map((p) => p.entry);`.

# Estado — L07 (canvas, view, timeline e workspace)

O lote cobre `src/editor/canvas/`, `src/editor/view/`, `src/editor/timeline/` e `src/editor/workspace/`. Cada item abaixo declara onde o valor nasce, quem o escreve, quem o lê e como ele é descartado. O campo `Navegador` marca o estado que só o navegador produz (foco, seleção de texto, rolagem e documento do iframe).

## EST-L07-001 — campo digitado de uma faixa do canvas

- **Declaração:** `src/editor/canvas/band-typing.ts:8` `let open: TypedBand | null = null;`
- **Forma:** `TypedBand | null` para o campo aberto, mais `count: number` (o número da abertura) e `listeners: Set<() => void>` (os assinantes), os três fechados no módulo.
- **Valores possíveis:**
  - V1 `null`: valor inicial; nenhum campo de faixa aberto.
  - V2 um `TypedBand` (`{ ref, count }`) enquanto o campo está aberto, com `count` guardando o número da abertura (`src/editor/canvas/band-typing.ts:9` `let count = 0;`).
- **Escritores:**
  - `src/editor/canvas/band-typing.ts:22` `open = { ref, count };` via typedBand.open
  - `src/editor/canvas/band-typing.ts:21` `count += 1;` via typedBand.open
  - `src/editor/canvas/band-typing.ts:27` `open = null;` via typedBand.close
- **Leitores:**
  - `src/editor/canvas/band-typing.ts:15` `get: (): TypedBand | null => open,` via typedBand.get
  - `src/editor/canvas/edit-handles.tsx:285` `const typing = useSyncExternalStore(typedBand.subscribe, typedBand.get);` via EditHandles
  - `src/editor/canvas/edit-handles.tsx:398` `const typed = typing === null ? undefined : drawn.find((d) => d.entry.ref === typing.ref && d.opposite !== undefined);` via EditHandles
- **Criação:** `src/editor/canvas/band-typing.ts:8` `let open: TypedBand | null = null;`
- **Descarte:** fim-da-página `src/editor/canvas/band-typing.ts:10` `const listeners = new Set<() => void>();`
- **Navegador:** não

## EST-L07-002 — larguras de linha próprias do navegador (cache por tipo)

- **Declaração:** `src/editor/canvas/browser-defaults.ts:11` `const known = new Map<string, string>();`
- **Forma:** `Map<string, string>` (a largura medida por `tag type property`) mais `probes: ShadowRoot | null` (a árvore de sondagem reusada).
- **Valores possíveis:**
  - V1 vazio e `probes === null`: nenhuma sondagem feita ainda (`src/editor/canvas/browser-defaults.ts:12` `let probes: ShadowRoot | null = null;`).
  - V2 com uma entrada por tipo consultado, e `probes` apontando a árvore sombra criada (`src/editor/canvas/browser-defaults.ts:30` `probes = host.attachShadow({ mode: 'closed' });`).
- **Escritores:**
  - `src/editor/canvas/browser-defaults.ts:41` `known.set(key, value);` via browserLineWidth
  - `src/editor/canvas/browser-defaults.ts:30` `probes = host.attachShadow({ mode: 'closed' });` via browserLineWidth
- **Leitores:**
  - `src/editor/canvas/browser-defaults.ts:23` `const found = known.get(key);` via browserLineWidth
  - `src/editor/canvas/coordinates.ts:537` `return [property, declaredWidth(element, property) ?? browserLineWidth(element.localName, element.getAttribute('type'), property, style)];` via computedValues
- **Criação:** `src/editor/canvas/browser-defaults.ts:11` `const known = new Map<string, string>();`
- **Descarte:** fim-da-página `src/editor/canvas/browser-defaults.ts:11` `const known = new Map<string, string>();`
- **Navegador:** não

## EST-L07-003 — ajuste de campo do painel rápido (chip-fit)

- **Declaração:** `src/editor/canvas/chip-fit.ts:12` `const HALVES = new WeakMap<HTMLElement, number>();`
- **Forma:** `WeakMap<HTMLElement, number>` (a largura de cada campo na meia coluna, medida antes de alargar) mais a dupla `frame`/`removed` fechada em `installChipFit` (`src/editor/canvas/chip-fit.ts:51` `let frame = 0;`, `src/editor/canvas/chip-fit.ts:52` `let removed = false;`).
- **Valores possíveis:**
  - V1 vazio: nenhum campo medido ainda.
  - V2 com uma entrada por campo, gravada na primeira medição (`src/editor/canvas/chip-fit.ts:25` `if (!('wide' in field.dataset)) HALVES.set(field, field.getBoundingClientRect().width);`).
  - V3 dentro de `installChipFit`, `frame` (quadro agendado) e `removed` (remoção pedida) alternam: `frame` recebe o quadro de `soon` (`src/editor/canvas/chip-fit.ts:68` `if (frame === 0 && !removed) frame = requestAnimationFrame(judge);`) e `removed` vira `true` na remoção (`src/editor/canvas/chip-fit.ts:80` `removed = true;`).
- **Escritores:**
  - `src/editor/canvas/chip-fit.ts:25` `if (!('wide' in field.dataset)) HALVES.set(field, field.getBoundingClientRect().width);` via fitsHalf
  - `src/editor/canvas/chip-fit.ts:68` `if (frame === 0 && !removed) frame = requestAnimationFrame(judge);` via soon
  - `src/editor/canvas/chip-fit.ts:80` `removed = true;` via installChipFit (retorno de remoção)
- **Leitores:**
  - `src/editor/canvas/chip-fit.ts:26` `const half = HALVES.get(field);` via fitsHalf
  - `src/editor/canvas/chip-fit.ts:81` `if (frame !== 0) cancelAnimationFrame(frame);` via installChipFit (retorno de remoção)
- **Criação:** `src/editor/canvas/chip-fit.ts:12` `const HALVES = new WeakMap<HTMLElement, number>();`
- **Descarte:** `src/editor/canvas/chip-fit.ts:79` `return () => {` via installChipFit (o retorno desliga os observadores e cancela o quadro)
- **Navegador:** não

## EST-L07-004 — relógio de mudança da página

- **Declaração:** `src/editor/canvas/page-clock.ts:9` `let scheduled = false;`
- **Forma:** `scheduled: boolean` (um quadro já agendado), `version: number` (a versão da página) e `listeners: Set<Listener>` (os leitores do relógio).
- **Valores possíveis:**
  - V1 inicial: `scheduled === false`, `version === 0`, sem ouvintes (`src/editor/canvas/page-clock.ts:11` `let version = 0;`).
  - V2 `pageChanged` incrementa `version` e agenda um quadro, marcando `scheduled` (`src/editor/canvas/page-clock.ts:17` `version += 1;`).
  - V3 no quadro, `scheduled` volta a `false` e cada ouvinte é chamado (`src/editor/canvas/page-clock.ts:21` `scheduled = false;`).
- **Escritores:**
  - `src/editor/canvas/page-clock.ts:17` `version += 1;` via pageChanged
  - `src/editor/canvas/page-clock.ts:19` `scheduled = true;` via pageChanged
  - `src/editor/canvas/page-clock.ts:21` `scheduled = false;` via pageChanged (no quadro)
  - `src/editor/canvas/page-clock.ts:28` `listeners.add(listener);` via onPageChange
- **Leitores:**
  - `src/editor/canvas/page-clock.ts:12` `export const pageVersion = (): number => version;` via pageVersion
  - `src/editor/canvas/page-clock.ts:22` `for (const listener of [...listeners]) listener();` via pageChanged
  - `src/editor/canvas/coordinates.ts:486` `const version = pageVersion();` via contentBoxes
- **Criação:** `src/editor/canvas/page-clock.ts:9` `let scheduled = false;`
- **Descarte:** fim-da-página `src/editor/canvas/page-clock.ts:8` `const listeners = new Set<Listener>();`
- **Navegador:** não

## EST-L07-005 — linhas de encaixe publicadas (snapping)

- **Declaração:** `src/editor/canvas/snapping.ts:165` `let shown: Snapped | null = null;`
- **Forma:** `Snapped | null` (o encaixe corrente) e `listeners: Set<() => void>` (os assinantes do desenho).
- **Valores possíveis:**
  - V1 `null`: nenhum gesto encaixa.
  - V2 um `Snapped` com linha, alvos, lacunas iguais e deslocamento (`src/editor/canvas/snapping.ts:176` `shown = drawn;`).
- **Escritores:**
  - `src/editor/canvas/snapping.ts:176` `shown = drawn;` via snapShown.set
  - `src/editor/canvas/snapping.ts:170` `listeners.add(listener);` via snapShown.subscribe
- **Leitores:**
  - `src/editor/canvas/snapping.ts:168` `get: (): Snapped | null => shown,` via snapShown.get
  - `src/editor/canvas/snap-lines.tsx:31` `const snapped = useSyncExternalStore(snapShown.subscribe, snapShown.get);` via SnapLines
- **Criação:** `src/editor/canvas/snapping.ts:165` `let shown: Snapped | null = null;`
- **Descarte:** fim-da-página `src/editor/canvas/snapping.ts:166` `const listeners = new Set<() => void>();`
- **Navegador:** não

## EST-L07-006 — o iframe do canvas (documento do quadro)

- **Declaração:** `src/editor/canvas/coordinates.ts:639` `let current: HTMLIFrameElement | null = null;`
- **Forma:** `HTMLIFrameElement | null` — o quadro do canvas registrado, cujo `contentDocument`/`contentWindow` todo o editor lê.
- **Valores possíveis:**
  - V1 `null`: nenhum quadro montado (`src/editor/canvas/coordinates.ts:639` `let current: HTMLIFrameElement | null = null;`).
  - V2 o elemento do quadro, entre a montagem e a desmontagem (`src/editor/canvas/frame.tsx:208` `useEffect(() => registerFrame(iframe.current), []);`).
- **Escritores:**
  - `src/editor/canvas/coordinates.ts:642` `current = iframe;` via registerFrame
  - `src/editor/canvas/coordinates.ts:644` `if (current === iframe) current = null;` via registerFrame (retorno de remoção)
- **Leitores:**
  - `src/editor/canvas/coordinates.ts:648` `export function canvasFrame(): HTMLIFrameElement | null {` via canvasFrame
  - `src/editor/canvas/coordinates.ts:652` `export function canvasDocument(): Document | null {` via canvasDocument
  - `src/editor/canvas/screenshot.ts:9` `const page = canvasDocument();` via captureCanvasPng
- **Criação:** `src/editor/canvas/coordinates.ts:639` `let current: HTMLIFrameElement | null = null;`
- **Descarte:** `src/editor/canvas/coordinates.ts:644` `if (current === iframe) current = null;` via registerFrame (retorno de remoção)
- **Navegador:** documento-do-iframe

## EST-L07-007 — caixas de conteúdo da página (cache por versão)

- **Declaração:** `src/editor/canvas/coordinates.ts:484` `let contentRead: { readonly iframe: HTMLIFrameElement; readonly version: number; readonly boxes: readonly { x: number; y: number; width: number; height: number }[] } | null = null;`
- **Forma:** o valor memoizado da última leitura: o quadro, a versão da página e as caixas dos trechos de texto e dos elementos substituídos.
- **Valores possíveis:**
  - V1 `null`: nenhuma leitura guardada (`src/editor/canvas/coordinates.ts:484` `let contentRead: { readonly iframe: HTMLIFrameElement; readonly version: number; readonly boxes: readonly { x: number; y: number; width: number; height: number }[] } | null = null;`).
  - V2 a leitura do quadro atual na versão de agora (`src/editor/canvas/coordinates.ts:489` `contentRead = { iframe, version, boxes };`).
- **Escritores:**
  - `src/editor/canvas/coordinates.ts:489` `contentRead = { iframe, version, boxes };` via contentBoxes
- **Leitores:**
  - `src/editor/canvas/coordinates.ts:487` `if (contentRead !== null && contentRead.iframe === iframe && contentRead.version === version) return [...contentRead.boxes];` via contentBoxes
  - `src/editor/canvas/chrome.tsx:744` `const content = contentBoxes(iframe).map((b) => local(b) as Box);` via useChromeLayout
- **Criação:** `src/editor/canvas/coordinates.ts:484` `let contentRead: { readonly iframe: HTMLIFrameElement; readonly version: number; readonly boxes: readonly { x: number; y: number; width: number; height: number }[] } | null = null;`
- **Descarte:** fim-da-página `src/editor/canvas/coordinates.ts:484` `let contentRead: { readonly iframe: HTMLIFrameElement; readonly version: number; readonly boxes: readonly { x: number; y: number; width: number; height: number }[] } | null = null;`
- **Navegador:** não

## EST-L07-008 — leitor do texto editado no lugar

- **Declaração:** `src/editor/canvas/text-edit.ts:196` `let reader: (() => EditReading | null) | null = null;`
- **Forma:** `(() => EditReading | null) | null` — a função que lê o que o elemento editado no quadro segura agora.
- **Valores possíveis:**
  - V1 `null`: nenhum leitor registrado.
  - V2 a função de leitura do quadro (`src/editor/canvas/text-edit.ts:198` `reader = read;`).
  - V3 `null` de novo ao desregistrar (`src/editor/canvas/text-edit.ts:200` `if (reader === read) reader = null;`).
- **Escritores:**
  - `src/editor/canvas/text-edit.ts:198` `reader = read;` via registerEditReader
  - `src/editor/canvas/text-edit.ts:200` `if (reader === read) reader = null;` via registerEditReader (retorno de remoção)
- **Leitores:**
  - `src/editor/canvas/text-edit.ts:207` `const reading = reader?.() ?? null;` via editedLinkAddress
  - `src/editor/canvas/text-edit.ts:218` `const node = state.ui.textEdit.node;` via editArgs (usa `reader?.()` na mesma função)
- **Criação:** `src/editor/canvas/text-edit.ts:196` `let reader: (() => EditReading | null) | null = null;`
- **Descarte:** fim-da-página `src/editor/canvas/text-edit.ts:196` `let reader: (() => EditReading | null) | null = null;`
- **Navegador:** não

## EST-L07-009 — elementos e folhas renderizados pelo PageRenderer

- **Declaração:** `src/editor/canvas/render/render.ts:242` `private readonly elements = new Map<NodeId, Element>();`
- **Forma:** `Map<NodeId, Element>` (o elemento de cada nó) mais `sheets: Map<NodeId, HTMLStyleElement>` (a folha de cada nó) e `markups: WeakMap<Element, string>` (o markup de cada grupo de SVG); os três são campos da classe `src/editor/canvas/render/render.ts:241` `export class PageRenderer {`.
- **Valores possíveis:**
  - V1 vazios: antes da primeira montagem (`src/editor/canvas/render/render.ts:243` `private readonly sheets = new Map<NodeId, HTMLStyleElement>();`).
  - V2 preenchidos: durante a montagem (`src/editor/canvas/render/render.ts:602` `this.elements.set(tree.id, body);`) e a cada nó construído (`src/editor/canvas/render/render.ts:683` `this.elements.set(node.id, element);`).
  - V3 podados: ao sumirem nós (`src/editor/canvas/render/render.ts:862` `this.elements.delete(id);`).
- **Escritores:**
  - `src/editor/canvas/render/render.ts:683` `this.elements.set(node.id, element);` via build
  - `src/editor/canvas/render/render.ts:883` `this.sheets.set(node.id, sheet);` via writeStyle
  - `src/editor/canvas/render/render.ts:850` `this.markups.set(group, markup);` via drawSvgMarkup
- **Leitores:**
  - `src/editor/canvas/render/render.ts:274` `return this.elements.get(id) ?? null;` via element
  - `src/editor/canvas/render/render.ts:873` `let sheet = this.sheets.get(node.id);` via writeStyle
  - `src/editor/canvas/render/render.ts:791` `const wanted = node.children.map((child) => this.elements.get(child.id) ?? this.build(child));` via reconcile
- **Criação:** `src/editor/canvas/render/render.ts:242` `private readonly elements = new Map<NodeId, Element>();`
- **Descarte:** `src/editor/canvas/render/render.ts:864` `for (const [id, sheet] of this.sheets) {` via dropMissing (e a remoção do renderizador com o quadro)
- **Navegador:** não

## EST-L07-010 — texto editado no lugar (PageRenderer.edit)

- **Declaração:** `src/editor/canvas/render/render.ts:247` `private edit: { readonly node: NodeId; readonly context: string } | null = null;`
- **Forma:** o par do nó editado e o contexto de chaves do seu elemento, ou `null`.
- **Valores possíveis:**
  - V1 `null`: nenhum texto editado.
  - V2 o nó e o contexto do texto editado (`src/editor/canvas/render/render.ts:422` `this.edit = { node: id, context };`).
  - V3 `null` de novo, quando a edição acaba (`src/editor/canvas/render/render.ts:414` `this.edit = null;`).
- **Escritores:**
  - `src/editor/canvas/render/render.ts:422` `this.edit = { node: id, context };` via editText
  - `src/editor/canvas/render/render.ts:414` `this.edit = null;` via editText
- **Leitores:**
  - `src/editor/canvas/render/render.ts:709` `const edited = this.edit?.node === node.id ? this.edit : null;` via dress
  - `src/editor/canvas/render/render.ts:433` `const element = this.edit ? this.elements.get(this.edit.node) : undefined;` via insertLineBreak
- **Criação:** `src/editor/canvas/render/render.ts:247` `private edit: { readonly node: NodeId; readonly context: string } | null = null;`
- **Descarte:** `src/editor/canvas/render/render.ts:414` `this.edit = null;` via editText
- **Navegador:** não

## EST-L07-011 — detalhes e diálogos revelados pela seleção

- **Declaração:** `src/editor/canvas/render/render.ts:249` `private revealed = new Set<NodeId>();`
- **Forma:** `Set<NodeId>` — os `<details>`/`<dialog>` desenhados abertos por causa da seleção.
- **Valores possíveis:**
  - V1 vazio.
  - V2 o conjunto da seleção de agora (`src/editor/canvas/render/render.ts:287` `this.revealed = wanted;`).
- **Escritores:**
  - `src/editor/canvas/render/render.ts:287` `this.revealed = wanted;` via reveal
- **Leitores:**
  - `src/editor/canvas/render/render.ts:727` `if (this.revealed.has(node.id)) wanted.set('open', '');` via dress
- **Criação:** `src/editor/canvas/render/render.ts:249` `private revealed = new Set<NodeId>();`
- **Descarte:** fim-da-página `src/editor/canvas/render/render.ts:249` `private revealed = new Set<NodeId>();`
- **Navegador:** não

## EST-L07-012 — documento mostrado pelo renderizador

- **Declaração:** `src/editor/canvas/render/render.ts:253` `private doc: DocumentJson | null = null;`
- **Forma:** `DocumentJson | null` — o documento que a página mostra agora, guardado a cada escrita.
- **Valores possíveis:**
  - V1 `null`: antes da primeira escrita (`src/editor/canvas/render/render.ts:253` `private doc: DocumentJson | null = null;`).
  - V2 o documento corrente (`src/editor/canvas/render/render.ts:621` `this.doc = after;`).
- **Escritores:**
  - `src/editor/canvas/render/render.ts:621` `this.doc = after;` via apply
  - `src/editor/canvas/render/render.ts:547` `this.doc = doc;` via mount
- **Leitores:**
  - `src/editor/canvas/render/render.ts:693` `return this.doc === null ? css : fileUrlsIn(css, (address) => resolvedSource(this.doc as DocumentJson, address));` via fileCss
  - `src/editor/canvas/render/render.ts:715` `const output = elementAttributes(node, tag, root, this.model, (_name, value) => value, { language: this.doc?.language ?? 'en', inForm: this.doc !== null && formNodes(this.doc).has(node.id) });` via dress
- **Criação:** `src/editor/canvas/render/render.ts:253` `private doc: DocumentJson | null = null;`
- **Descarte:** fim-da-página `src/editor/canvas/render/render.ts:253` `private doc: DocumentJson | null = null;`
- **Navegador:** não

## EST-L07-013 — largura própria da barra de rolagem (medida uma vez)

- **Declaração:** `src/editor/canvas/render/render.ts:148` `let measuredScrollbar: number | null = null;`
- **Forma:** `number | null` — a largura da barra de rolagem do documento do editor, medida uma vez.
- **Valores possíveis:**
  - V1 `null`: medição ainda não feita.
  - V2 a largura em px (`src/editor/canvas/render/render.ts:154` `measuredScrollbar = probe.offsetWidth - probe.clientWidth;`).
- **Escritores:**
  - `src/editor/canvas/render/render.ts:154` `measuredScrollbar = probe.offsetWidth - probe.clientWidth;` via scrollbarWidth
- **Leitores:**
  - `src/editor/canvas/render/render.ts:150` `if (measuredScrollbar !== null) return measuredScrollbar;` via scrollbarWidth
  - `src/editor/canvas/render/render.ts:170` `return `html { padding-right: ${scrollbarWidth()}px; scrollbar-width: none; }\n@media (max-width: ${OVERLAY_SCROLLBAR_BELOW - 0.02}px) { html { padding-right: 0; } }\n:where(body:empty) { min-height: ${screenHeight === undefined ? '100vh' : `min(${screenHeight}px, 100vh)`}; }\n:where([${CONTAINER_ATTRIBUTE}]:empty) { min-height: ${model.emptyContainerMinHeight}px; }\n:where([${EMPTY_TEXT_ATTRIBUTE}]) { min-height: ${model.emptyTextMinHeight}px; outline: 1px dashed currentColor; outline-offset: -1px; }\n[${HIDDEN_ATTRIBUTE}] { display: none !important; }\n[${EMBED_FRAME_ATTRIBUTE}] { display: block; width: 100%; min-height: ${model.emptyContainerMinHeight}px; border: 0; pointer-events: none; }`;` via editorCss
- **Criação:** `src/editor/canvas/render/render.ts:148` `let measuredScrollbar: number | null = null;`
- **Descarte:** fim-da-página `src/editor/canvas/render/render.ts:148` `let measuredScrollbar: number | null = null;`
- **Navegador:** não

## EST-L07-014 — caches de leitura e de filhos do editor de grades

- **Declaração:** `src/editor/canvas/edit-handles.tsx:249` `const READS = new Map<string, readonly string[]>();`
- **Forma:** `READS: Map<string, readonly string[]>` (as propriedades que cada modo lê) e `IDS: Map<string, readonly string[]>` (os filhos por texto).
- **Valores possíveis:**
  - V1 vazios.
  - V2 com uma entrada por modo em `READS` (`src/editor/canvas/edit-handles.tsx:254` `READS.set(mode, list);`) e por texto de filhos em `IDS` (`src/editor/canvas/edit-handles.tsx:263` `IDS.set(text, ids);`).
- **Escritores:**
  - `src/editor/canvas/edit-handles.tsx:254` `READS.set(mode, list);` via readsOf
  - `src/editor/canvas/edit-handles.tsx:263` `IDS.set(text, ids);` via childrenOf
- **Leitores:**
  - `src/editor/canvas/edit-handles.tsx:251` `const held = READS.get(mode);` via readsOf
  - `src/editor/canvas/edit-handles.tsx:260` `const held = IDS.get(text);` via childrenOf
- **Criação:** `src/editor/canvas/edit-handles.tsx:249` `const READS = new Map<string, readonly string[]>();`
- **Descarte:** fim-da-página `src/editor/canvas/edit-handles.tsx:258` `const IDS = new Map<string, readonly string[]>();`
- **Navegador:** não

## EST-L07-015 — valores computados de um nó no editor de faixas

- **Declaração:** `src/editor/canvas/edit-handles.tsx:99` `const [read, setRead] = useState<{ readonly node: NodeId; readonly values: Readonly<Record<string, string>> | null } | null>(null);`
- **Forma:** estado local do hook `useComputed`: o nó e os valores computados das propriedades pedidas, ou `null`.
- **Valores possíveis:**
  - V1 `null`: ainda não medido, ou o nó mudou.
  - V2 os valores do nó (`src/editor/canvas/edit-handles.tsx:113` `setRead({ node, values });`).
- **Escritores:**
  - `src/editor/canvas/edit-handles.tsx:113` `setRead({ node, values });` via useComputed (laço de medição)
- **Leitores:**
  - `src/editor/canvas/edit-handles.tsx:120` `return read !== null && read.node === node ? read.values : null;` via useComputed
  - `src/editor/canvas/edit-handles.tsx:290` `if (computed === null || (doors.length === 0 && DIVIDER === undefined)) return null;` via EditHandles
  - No `TypedBand` do mesmo arquivo: `src/editor/canvas/edit-handles.tsx:228` `const input = useRef<HTMLInputElement>(null);`
- **Criação:** `src/editor/canvas/edit-handles.tsx:99` `const [read, setRead] = useState<{ readonly node: NodeId; readonly values: Readonly<Record<string, string>> | null } | null>(null);`
- **Descarte:** `src/editor/canvas/edit-handles.tsx:118` `return () => cancelAnimationFrame(request);` via useComputed (retorno do efeito)
- **Navegador:** não

## EST-L07-016 — caixas dos filhos de um nó no editor de faixas

- **Declaração:** `src/editor/canvas/edit-handles.tsx:126` `const [read, setRead] = useState<{ readonly text: string; readonly boxes: readonly Box[]; readonly ids: readonly string[] } | null>(null);`
- **Forma:** estado local do hook `useFlow`: o texto, as caixas e os ids dos filhos, ou `null`.
- **Valores possíveis:**
  - V1 `null`: ainda não medido.
  - V2 as caixas dos filhos na origem do chrome (`src/editor/canvas/edit-handles.tsx:139` `setRead((before) => (before?.text === text ? before : { text, boxes: pairs, ids: pairs.map((drawn) => drawn.id) }));`).
- **Escritores:**
  - `src/editor/canvas/edit-handles.tsx:139` `setRead((before) => (before?.text === text ? before : { text, boxes: pairs, ids: pairs.map((drawn) => drawn.id) }));` via useFlow
- **Leitores:**
  - `src/editor/canvas/edit-handles.tsx:146` `return read;` via useFlow
  - `src/editor/canvas/edit-handles.tsx:284` `const flow = useFlow(gaps || DIVIDER !== undefined ? node : null, childrenOf(childrenText), origin);` via EditHandles
- **Criação:** `src/editor/canvas/edit-handles.tsx:126` `const [read, setRead] = useState<{ readonly text: string; readonly boxes: readonly Box[]; readonly ids: readonly string[] } | null>(null);`
- **Descarte:** `src/editor/canvas/edit-handles.tsx:144` `return () => cancelAnimationFrame(request);` via useFlow (retorno do efeito)
- **Navegador:** não

## EST-L07-017 — estado local do quadro do canvas (CanvasFrame)

- **Declaração:** `src/editor/canvas/frame.tsx:39` `const view = useRef<HTMLDivElement>(null);`
- **Forma:** refs do componente (`view`, `overlay`, `iframe`, `shown`, `held`, `scrolled`) mais o estado `height: number`.
- **Valores possíveis:**
  - V1 antes da montagem: as refs em `null` e `height === 0` (`src/editor/canvas/frame.tsx:44` `const [height, setHeight] = useState(0);`).
  - V2 montado: `iframe` com o elemento, `height` com a altura medida (`src/editor/canvas/frame.tsx:58` `if (entry) setHeight(entry.contentRect.height);`).
  - V3 durante um zoom: `shown` e `held` guardam o ponto mantido (`src/editor/canvas/frame.tsx:231` `held.current = { pageY, at, zoom };`).
- **Escritores:**
  - `src/editor/canvas/frame.tsx:58` `if (entry) setHeight(entry.contentRect.height);` via ResizeObserver do quadro
  - `src/editor/canvas/frame.tsx:232` `shown.current = zoom;` via efeito de layout do zoom
  - `src/editor/canvas/frame.tsx:231` `held.current = { pageY, at, zoom };` via efeito de layout do zoom
  - `src/editor/canvas/frame.tsx:259` `scrolled.current = scroll.count;` via efeito de layout da rolagem
- **Leitores:**
  - `src/editor/canvas/frame.tsx:264` `<iframe ref={iframe} className="frame__page" srcDoc={PAGE} sandbox="allow-same-origin" tabIndex={-1} aria-hidden={editing ? undefined : true} style={{ width, height: zoom > 0 ? height / zoom : 0, zoom }} />` via CanvasFrame
  - `src/editor/canvas/frame.tsx:223` `if (!frame || shown.current === zoom) return;` via efeito de layout do zoom
  - `src/editor/canvas/frame.tsx:254` `if (frame && scroll.count !== scrolled.current) {` via efeito de layout da rolagem
  - Refs do mesmo componente: `src/editor/canvas/frame.tsx:41` `const overlay = useRef<HTMLDivElement>(null);`, `src/editor/canvas/frame.tsx:42` `const iframe = useRef<HTMLIFrameElement>(null);`, `src/editor/canvas/frame.tsx:218` `const shown = useRef(zoom);`, `src/editor/canvas/frame.tsx:219` `const held = useRef<{ readonly pageY: number; readonly at: number; readonly zoom: number } | null>(null);`, `src/editor/canvas/frame.tsx:251` `const scrolled = useRef(scroll.count);`, `src/editor/canvas/frame.tsx:51` `const frameWindow = useCallback(() => iframe.current?.contentWindow ?? null, []);`
- **Criação:** `src/editor/canvas/frame.tsx:39` `const view = useRef<HTMLDivElement>(null);`
- **Descarte:** `src/editor/canvas/frame.tsx:204` `stop();` via desmontagem do quadro
- **Navegador:** não

## EST-L07-018 — rolagem da página dentro do quadro

- **Declaração:** `src/editor/canvas/coordinates.ts:70` `return { left, top, zoom, scrollX: win.scrollX, scrollY: win.scrollY };`
- **Forma:** a rolagem da janela do quadro (`scrollX`/`scrollY` do `contentWindow`), estado só do navegador.
- **Valores possíveis:**
  - V1 no topo: `scrollY === 0`, como a página carrega.
  - V2 rolada por um gesto, um zoom que mantém um ponto ou um quadro: `view.scrollBy` e `view.scrollTo` escrevem nela (`src/editor/canvas/coordinates.ts:209` `view.scrollBy(0, screen / g.zoom);`).
- **Escritores:**
  - `src/editor/canvas/coordinates.ts:209` `view.scrollBy(0, screen / g.zoom);` via scrollPage
  - `src/editor/canvas/coordinates.ts:219` `view.scrollTo(view.scrollX, point - at / after);` via keepPagePoint
  - `src/editor/canvas/coordinates.ts:367` `iframe.contentWindow?.scrollBy(0, by);` via scrollPageBy
- **Leitores:**
  - `src/editor/canvas/coordinates.ts:218` `const point = view.scrollY + at / before;` via keepPagePoint
  - `src/editor/canvas/coordinates.ts:70` `return { left, top, zoom, scrollX: win.scrollX, scrollY: win.scrollY };` via geometryOf
  - `src/editor/canvas/frame.tsx:229` `const pageY = carried !== null && Math.abs(carried.at - at) < 0.5 ? carried.pageY : view === null ? 0 : view.scrollY + at / shown.current;` via efeito de layout do zoom
- **Criação:** `src/editor/canvas/frame.tsx:90` `target.addEventListener('scroll', pageChanged, { passive: true });` via montagem da página do quadro
- **Descarte:** `src/editor/canvas/frame.tsx:204` `stop();` via desmontagem do quadro
- **Navegador:** rolagem

## EST-L07-019 — indicador de soltura e clarão da soltura

- **Declaração:** `src/editor/canvas/chrome.tsx:408` `const [layout, setLayout] = useState<DropLayout | null>(null);`
- **Forma:** no `DropIndicator`, `DropLayout | null` (`src/editor/canvas/chrome.tsx:408` `const [layout, setLayout] = useState<DropLayout | null>(null);`) mais a proposta memoizada (`src/editor/canvas/chrome.tsx:412` `const proposal = useMemo(() => (view.proposal !== null && refusedHere ? { ...view.proposal, refused: true } : view.proposal), [view.proposal, refusedHere]);`); no `DropFlash`, `{ readonly id: number; readonly boxes: readonly Box[] } | null` (`src/editor/canvas/chrome.tsx:569` `const [boxes, setBoxes] = useState<{ readonly id: number; readonly boxes: readonly Box[] } | null>(null);`).
- **Valores possíveis:**
  - V1 `null`: nenhuma proposta em curso (`src/editor/canvas/chrome.tsx:427` `request = requestAnimationFrame(() => setLayout(null));`).
  - V2 o traçado medido (`src/editor/canvas/chrome.tsx:463` `setLayout((before) => (same(before, nextLayout) ? before : nextLayout));`).
  - V3 no `DropFlash`, as caixas dos elementos recém-soltos (`src/editor/canvas/chrome.tsx:577` `setBoxes({ id: drop.id, boxes: found });`).
- **Escritores:**
  - `src/editor/canvas/chrome.tsx:463` `setLayout((before) => (same(before, nextLayout) ? before : nextLayout));` via DropIndicator
  - `src/editor/canvas/chrome.tsx:577` `setBoxes({ id: drop.id, boxes: found });` via DropFlash
- **Leitores:**
  - `src/editor/canvas/chrome.tsx:478` `{layout ? <div className={`chrome__receiver is-${state}`} data-chrome="drop-receiver" data-state={state} style={at(layout.receiver)} /> : null}` via DropIndicator
  - `src/editor/canvas/chrome.tsx:583` `{boxes?.boxes.map((b, i) => <div key={`${boxes.id}-${i}`} className="chrome__flash" data-chrome="drop-flash" style={{ left: b.x, top: b.y, width: b.width, height: b.height, animationDuration: `${FLASH_MS}ms` }} />)}` via DropFlash
  - Refs do mesmo componente: `src/editor/canvas/chrome.tsx:406` `const layer = useRef<HTMLDivElement>(null);`, `src/editor/canvas/chrome.tsx:407` `const label = useRef<HTMLDivElement>(null);`, `src/editor/canvas/chrome.tsx:570` `const layer = useRef<HTMLDivElement>(null);`
- **Criação:** `src/editor/canvas/chrome.tsx:408` `const [layout, setLayout] = useState<DropLayout | null>(null);`
- **Descarte:** `src/editor/canvas/chrome.tsx:579` `return () => clearTimeout(done);` via DropFlash (retorno do efeito)
- **Navegador:** não

## EST-L07-020 — elemento capturado em destaque (CapturedSelection)

- **Declaração:** `src/editor/canvas/chrome.tsx:593` `const [shown, setShown] = useState<{ readonly id: string; readonly box: Box; readonly tag: string; readonly edge: number } | null>(null);`
- **Forma:** a caixa, a tag e a espessura da linha do elemento capturado, ou `null`.
- **Valores possíveis:**
  - V1 `null`: nada selecionado, ou o quadro não desenha o elemento.
  - V2 a medida corrente (`src/editor/canvas/chrome.tsx:605` `setShown((was) => {`).
- **Escritores:**
  - `src/editor/canvas/chrome.tsx:605` `setShown((was) => {` via CapturedSelection (laço de medição)
- **Leitores:**
  - `src/editor/canvas/chrome.tsx:617` `const drawn = shown !== null && shown.id === id ? shown : null;` via CapturedSelection
  - Refs do mesmo componente: `src/editor/canvas/chrome.tsx:594` `const layer = useRef<HTMLDivElement>(null);`, `src/editor/canvas/chrome.tsx:595` `const frame = useRef<HTMLDivElement>(null);`
- **Criação:** `src/editor/canvas/chrome.tsx:593` `const [shown, setShown] = useState<{ readonly id: string; readonly box: Box; readonly tag: string; readonly edge: number } | null>(null);`
- **Descarte:** `src/editor/canvas/chrome.tsx:614` `return () => cancelAnimationFrame(request);` via CapturedSelection (retorno do efeito)
- **Navegador:** não

## EST-L07-021 — fantasma em retorno (ReturningGhost)

- **Declaração:** `src/editor/canvas/chrome.tsx:641` `const [back, setBack] = useState(false);`
- **Forma:** `boolean` — se o fantasma já voltou ao ladrilho de origem.
- **Valores possíveis:**
  - V1 `false`: o fantasma está voltando.
  - V2 `true`: a animação terminou (`src/editor/canvas/chrome.tsx:656` `if (playing) setBack(true);`).
- **Escritores:**
  - `src/editor/canvas/chrome.tsx:656` `if (playing) setBack(true);` via ReturningGhost
- **Leitores:**
  - `src/editor/canvas/chrome.tsx:665` `return back ? null : <Ghost ref={ghost} inserting={view.inserting} at={view.from} refused={false} />;` via ReturningGhost
  - Ref do mesmo componente: `src/editor/canvas/chrome.tsx:640` `const ghost = useRef<HTMLDivElement>(null);`
- **Criação:** `src/editor/canvas/chrome.tsx:641` `const [back, setBack] = useState(false);`
- **Descarte:** `src/editor/canvas/chrome.tsx:662` `way.cancel();` via ReturningGhost (retorno do efeito)
- **Navegador:** não

## EST-L07-022 — traçado do chrome do canvas (useChromeLayout)

- **Declaração:** `src/editor/canvas/chrome.tsx:694` `const [layout, setLayout] = useState<Layout>(EMPTY);`
- **Forma:** `Layout` — as caixas da seleção, do hover, do rótulo, da barra de texto, as zonas de rotação, os tamanhos e as distâncias.
- **Valores possíveis:**
  - V1 `EMPTY`: nada selecionado, nada medido (`src/editor/canvas/chrome.tsx:699` `request = requestAnimationFrame(() => setLayout(EMPTY));`).
  - V2 o traçado medido (`src/editor/canvas/chrome.tsx:839` `setLayout((before) => (same(before, next) ? before : next));`).
- **Escritores:**
  - `src/editor/canvas/chrome.tsx:839` `setLayout((before) => (same(before, next) ? before : next));` via useChromeLayout
  - `src/editor/canvas/chrome.tsx:699` `request = requestAnimationFrame(() => setLayout(EMPTY));` via useChromeLayout
- **Leitores:**
  - `src/editor/canvas/chrome.tsx:878` `return layout;` via useChromeLayout
  - `src/editor/canvas/chrome.tsx:1127` `const shown = selection.length === 0 && hovered === null && drawnBand === null ? EMPTY : layout;` via CanvasChrome
- **Criação:** `src/editor/canvas/chrome.tsx:694` `const [layout, setLayout] = useState<Layout>(EMPTY);`
- **Descarte:** `src/editor/canvas/chrome.tsx:873` `cancelAnimationFrame(request);` via useChromeLayout (retorno do efeito)
- **Navegador:** não

## EST-L07-023 — origem do chrome na janela e refs do CanvasChrome

- **Declaração:** `src/editor/canvas/chrome.tsx:950` `const [origin, setOrigin] = useState({ x: 0, y: 0 });`
- **Forma:** `origin: { x, y }` na tela mais as refs `layer`, `label` e `bar` do `CanvasChrome` e os valores memoizados `targets` e `aiming`.
- **Valores possíveis:**
  - V1 `{ x: 0, y: 0 }`: antes da primeira leitura (`src/editor/canvas/chrome.tsx:950` `const [origin, setOrigin] = useState({ x: 0, y: 0 });`).
  - V2 a posição da camada (`src/editor/canvas/chrome.tsx:956` `if (box) setOrigin((was) => (was.x === box.x && was.y === box.y ? was : { x: box.x, y: box.y }));`).
- **Escritores:**
  - `src/editor/canvas/chrome.tsx:956` `if (box) setOrigin((was) => (was.x === box.x && was.y === box.y ? was : { x: box.x, y: box.y }));` via useScreenOrigin
- **Leitores:**
  - `src/editor/canvas/chrome.tsx:962` `return origin;` via useScreenOrigin
  - `src/editor/canvas/chrome.tsx:984` `const at = placed ? { left: origin.x + placed.box.x, top: origin.y + placed.box.y } : undefined;` via SelectionLabel
  - `src/editor/canvas/chrome.tsx:1050` `const targets = useMemo(() => JSON.parse(targetsText) as NodeId[], [targetsText]);` via CanvasChrome
  - Refs e memoizações do `CanvasChrome`: `src/editor/canvas/chrome.tsx:1108` `const layer = useRef<HTMLDivElement>(null);`, `src/editor/canvas/chrome.tsx:1109` `const label = useRef<HTMLDivElement>(null);`, `src/editor/canvas/chrome.tsx:1111` `const bar = useRef<HTMLDivElement>(null);`, `src/editor/canvas/chrome.tsx:1059` `const aiming = useMemo(() => (hand === null ? null : handDrop(hand)), [hand]);`
- **Criação:** `src/editor/canvas/chrome.tsx:950` `const [origin, setOrigin] = useState({ x: 0, y: 0 });`
- **Descarte:** `src/editor/canvas/chrome.tsx:960` `return () => cancelAnimationFrame(request);` via useScreenOrigin (retorno do efeito)
- **Navegador:** não

## EST-L07-024 — colocação e foco do painel rápido

- **Declaração:** `src/editor/canvas/quick-panel.tsx:369` `const [placed, setPlaced] = useState<Placed | null>(null);`
- **Forma:** `Placed | null` (a caixa e os limites do painel) mais as refs do componente (`panel`, `chip`) e as refs de controle `owed`, `lastView`, `wasPlacedOpen`, `fitFrames`, `fitFrom`, `wasOpen`, `focusDue`.
- **Valores possíveis:**
  - V1 `null`: sem medição para o elemento de agora.
  - V2 a colocação medida (`src/editor/canvas/quick-panel.tsx:452` `setPlaced((before) => (JSON.stringify(before) === JSON.stringify(next) ? before : next));`).
  - V3 com a vista devida: `owed.current` guarda `id zoom` e é pago quando o rótulo entra em vista (`src/editor/canvas/quick-panel.tsx:429` `if (seen) owed.current = null;`).
- **Escritores:**
  - `src/editor/canvas/quick-panel.tsx:452` `setPlaced((before) => (JSON.stringify(before) === JSON.stringify(next) ? before : next));` via QuickPanel (laço de medição)
  - `src/editor/canvas/quick-panel.tsx:427` `else if (view !== lastView.current) owed.current = view;` via QuickPanel
  - `src/editor/canvas/quick-panel.tsx:421` `wasPlacedOpen.current = open;` via QuickPanel
  - `src/editor/canvas/quick-panel.tsx:473` `focusDue.current = true;` via QuickPanel
- **Leitores:**
  - `src/editor/canvas/quick-panel.tsx:462` `const current = placed !== null && node !== null && placed.id === node.id && placed.open === open ? placed : null;` via QuickPanel
  - `src/editor/canvas/quick-panel.tsx:483` `first?.focus();` via QuickPanel (efeito de layout do foco)
  - `src/editor/canvas/quick-panel.tsx:532` `{CHIP_DOOR === null ? null : <Chip entry={CHIP_DOOR} open={true} measuring={measuring} buttonRef={chip} />}` via QuickPanel
  - Refs do mesmo componente: `src/editor/canvas/quick-panel.tsx:370` `const panel = useRef<HTMLDivElement>(null);`, `src/editor/canvas/quick-panel.tsx:371` `const chip = useRef<HTMLButtonElement>(null);`, `src/editor/canvas/quick-panel.tsx:377` `const owed = useRef<string | null>(null);`, `src/editor/canvas/quick-panel.tsx:378` `const lastView = useRef<string | null>(null);`, `src/editor/canvas/quick-panel.tsx:381` `const wasPlacedOpen = useRef(false);`, `src/editor/canvas/quick-panel.tsx:382` `const fitFrames = useRef(0);`, `src/editor/canvas/quick-panel.tsx:383` `const fitFrom = useRef<{ readonly left: number; readonly top: number } | null>(null);`, `src/editor/canvas/quick-panel.tsx:465` `const wasOpen = useRef(open);`, `src/editor/canvas/quick-panel.tsx:466` `const focusDue = useRef(false);`
- **Criação:** `src/editor/canvas/quick-panel.tsx:369` `const [placed, setPlaced] = useState<Placed | null>(null);`
- **Descarte:** `src/editor/canvas/quick-panel.tsx:457` `return () => cancelAnimationFrame(request);` via QuickPanel (retorno do efeito de medição)
- **Navegador:** não

## EST-L07-025 — menu de escolha do painel rápido (ChoiceMenu)

- **Declaração:** `src/editor/canvas/quick-panel.tsx:156` `const [open, setOpen] = useState(false);`
- **Forma:** `boolean` — se a lista de valores está aberta.
- **Valores possíveis:**
  - V1 `false`: a lista fechada.
  - V2 `true`: a lista aberta (`src/editor/canvas/quick-panel.tsx:169` `onClick={() => (door.available ? setOpen((was) => !was) : undefined)}`).
- **Escritores:**
  - `src/editor/canvas/quick-panel.tsx:169` `onClick={() => (door.available ? setOpen((was) => !was) : undefined)}` via ChoiceMenu
- **Leitores:**
  - `src/editor/canvas/quick-panel.tsx:174` `{open ? (` via ChoiceMenu
- **Criação:** `src/editor/canvas/quick-panel.tsx:156` `const [open, setOpen] = useState(false);`
- **Descarte:** `src/editor/canvas/quick-panel.tsx:156` `const [open, setOpen] = useState(false);` (a lista desmonta com o campo)
- **Navegador:** não

## EST-L07-026 — traçado do editor de grades (GridEditor)

- **Declaração:** `src/editor/canvas/grid-editor.tsx:29` `const [drawn, setDrawn] = useState<{ readonly tracks: readonly Box[]; readonly grid: Box; readonly itemSpan: { readonly box: Box; readonly span: number } | null; readonly zoom: number } | null>(null);`
- **Forma:** as trilhas, a caixa da grade, a caixa do item e o zoom, ou `null`.
- **Valores possíveis:**
  - V1 `null`: grade não medida.
  - V2 o traçado (`src/editor/canvas/grid-editor.tsx:58` `setDrawn((before) => (JSON.stringify(before) === JSON.stringify(next) ? before : next));`).
- **Escritores:**
  - `src/editor/canvas/grid-editor.tsx:58` `setDrawn((before) => (JSON.stringify(before) === JSON.stringify(next) ? before : next));` via GridEditor (laço de medição)
- **Leitores:**
  - `src/editor/canvas/grid-editor.tsx:64` `const active = drawn !== null && editing !== null;` via GridEditor
  - `src/editor/canvas/grid-editor.tsx:67` `{!active || drawn === null ? null : drawn.tracks.map((track, i) => (` via GridEditor
  - Ref do mesmo componente: `src/editor/canvas/grid-editor.tsx:28` `const layer = useRef<HTMLDivElement>(null);`
- **Criação:** `src/editor/canvas/grid-editor.tsx:29` `const [drawn, setDrawn] = useState<{ readonly tracks: readonly Box[]; readonly grid: Box; readonly itemSpan: { readonly box: Box; readonly span: number } | null; readonly zoom: number } | null>(null);`
- **Descarte:** `src/editor/canvas/grid-editor.tsx:62` `return () => cancelAnimationFrame(request);` via GridEditor (retorno do efeito)
- **Navegador:** não

## EST-L07-027 — caixa da página e altura do quadro (GridOverlay)

- **Declaração:** `src/editor/canvas/grid-overlay.tsx:40` `const [page, setPage] = useState<Page | null>(null);`
- **Forma:** `Page | null` (caixa, tamanho e zoom da página) mais `frameHeight: number` (`src/editor/canvas/grid-overlay.tsx:42` `const [frameHeight, setFrameHeight] = useState(0);`).
- **Valores possíveis:**
  - V1 `null` e `0`: nada medido.
  - V2 a caixa da página (`src/editor/canvas/grid-overlay.tsx:56` `setPage((before) => (same(before, next) ? before : next));`) e a altura do quadro (`src/editor/canvas/grid-overlay.tsx:52` `setFrameHeight((before) => (Math.abs(before - tall) < 0.5 ? before : tall));`).
- **Escritores:**
  - `src/editor/canvas/grid-overlay.tsx:56` `setPage((before) => (same(before, next) ? before : next));` via GridOverlay
  - `src/editor/canvas/grid-overlay.tsx:52` `setFrameHeight((before) => (Math.abs(before - tall) < 0.5 ? before : tall));` via GridOverlay
- **Leitores:**
  - `src/editor/canvas/grid-overlay.tsx:64` `const rowTops = rows && page ? rowBands(page.height / page.zoom, rowHeight, rowGutter) : [];` via GridOverlay
  - `src/editor/canvas/grid-overlay.tsx:68` `? columnBands(page.width / page.zoom, grid).map((c, i) => (` via GridOverlay
  - Ref do mesmo componente: `src/editor/canvas/grid-overlay.tsx:39` `const layer = useRef<HTMLDivElement>(null);`
- **Criação:** `src/editor/canvas/grid-overlay.tsx:40` `const [page, setPage] = useState<Page | null>(null);`
- **Descarte:** `src/editor/canvas/grid-overlay.tsx:61` `return () => cancelAnimationFrame(request);` via GridOverlay (retorno do efeito)
- **Navegador:** não

## EST-L07-028 — origem das guias na tela (Guides)

- **Declaração:** `src/editor/canvas/guides.tsx:22` `const [origin, setOrigin] = useState<{ readonly x: number; readonly y: number; readonly zoom: number } | null>(null);`
- **Forma:** `{ x, y, zoom } | null` — onde fica o ponto (0, 0) da página sobre a sobreposição, com o zoom.
- **Valores possíveis:**
  - V1 `null`: nada medido, ou sem guias.
  - V2 a origem medida (`src/editor/canvas/guides.tsx:33` `setOrigin((before) => (before !== null && before.x === next.x && before.y === next.y && before.zoom === next.zoom ? before : next));`).
- **Escritores:**
  - `src/editor/canvas/guides.tsx:33` `setOrigin((before) => (before !== null && before.x === next.x && before.y === next.y && before.zoom === next.zoom ? before : next));` via Guides (laço de medição)
- **Leitores:**
  - `src/editor/canvas/guides.tsx:40` `if (guides.length === 0 || origin === null || GUIDE_DRAG === null) return null;` via Guides
  - `src/editor/canvas/guides.tsx:45` `const at = (across ? origin.y : origin.x) + guide.at * origin.zoom;` via Guides
- **Criação:** `src/editor/canvas/guides.tsx:22` `const [origin, setOrigin] = useState<{ readonly x: number; readonly y: number; readonly zoom: number } | null>(null);`
- **Descarte:** `src/editor/canvas/guides.tsx:38` `return () => cancelAnimationFrame(request);` via Guides (retorno do efeito)
- **Navegador:** não

## EST-L07-029 — caixas dos elementos para as sobreposições de vista (ViewOverlays)

- **Declaração:** `src/editor/canvas/view-overlays.tsx:51` `const [boxes, setBoxes] = useState<readonly ElementBox[]>([]);`
- **Forma:** `readonly ElementBox[]` — caixa e espaçamento interno de cada elemento, na origem do chrome.
- **Valores possíveis:**
  - V1 vazio: nada medido.
  - V2 as caixas medidas (`src/editor/canvas/view-overlays.tsx:63` `setBoxes((before) => (same(before, next) ? before : next));`).
- **Escritores:**
  - `src/editor/canvas/view-overlays.tsx:63` `setBoxes((before) => (same(before, next) ? before : next));` via ViewOverlays (laço de medição)
- **Leitores:**
  - `src/editor/canvas/view-overlays.tsx:80` `const containers = boxes.filter((b) => CONTAINERS.has(typeOf.get(b.id) ?? ''));` via ViewOverlays
  - `src/editor/canvas/view-overlays.tsx:89` `? boxes.map((b, i) => <div key={b.id} className="chrome__outline" data-region={i === 0 ? 'canvas-outlines' : undefined} style={at(b.box)} />)` via ViewOverlays
  - Ref do mesmo componente: `src/editor/canvas/view-overlays.tsx:50` `const layer = useRef<HTMLDivElement>(null);`
- **Criação:** `src/editor/canvas/view-overlays.tsx:51` `const [boxes, setBoxes] = useState<readonly ElementBox[]>([]);`
- **Descarte:** `src/editor/canvas/view-overlays.tsx:68` `return () => cancelAnimationFrame(request);` via ViewOverlays (retorno do efeito)
- **Navegador:** não

## EST-L07-030 — traçado das linhas de encaixe (SnapLines)

- **Declaração:** `src/editor/canvas/snap-lines.tsx:33` `const [drawn, setDrawn] = useState<Drawn | null>(null);`
- **Forma:** linhas, alvos e lacunas iguais a desenhar, ou `null`.
- **Valores possíveis:**
  - V1 `null`: nada a desenhar.
  - V2 o traçado medido (`src/editor/canvas/snap-lines.tsx:35` `const request = requestAnimationFrame(() => setDrawn(measure(snapped, overlay.current, pageId)));`).
- **Escritores:**
  - `src/editor/canvas/snap-lines.tsx:35` `const request = requestAnimationFrame(() => setDrawn(measure(snapped, overlay.current, pageId)));` via SnapLines (efeito de layout)
- **Leitores:**
  - `src/editor/canvas/snap-lines.tsx:38` `if (drawn === null) return null;` via SnapLines
  - `src/editor/canvas/snap-lines.tsx:41` `{drawn.targets.map((target) => (` via SnapLines
- **Criação:** `src/editor/canvas/snap-lines.tsx:33` `const [drawn, setDrawn] = useState<Drawn | null>(null);`
- **Descarte:** `src/editor/canvas/snap-lines.tsx:36` `return () => cancelAnimationFrame(request);` via SnapLines (retorno do efeito)
- **Navegador:** não

## EST-L07-031 — medida das réguas (Rulers)

- **Declaração:** `src/editor/canvas/rulers.tsx:42` `const [measure, setMeasure] = useState<Omit<RulerMeasure, 'pointer'> | null>(null);`
- **Forma:** a medida das bandas, a origem da página, o zoom e a caixa da seleção, ou `null`.
- **Valores possíveis:**
  - V1 `null`: nada medido.
  - V2 a medida corrente (`src/editor/canvas/rulers.tsx:67` `setMeasure((before) => (same(before, next) ? before : next));`).
- **Escritores:**
  - `src/editor/canvas/rulers.tsx:67` `setMeasure((before) => (same(before, next) ? before : next));` via Rulers (laço de medição)
- **Leitores:**
  - `src/editor/canvas/rulers.tsx:75` `const marks = measure ? rulerMarks({ ...measure, pointer }) : null;` via Rulers
  - `src/editor/canvas/rulers.tsx:80` `<BandMarks band={marks?.x} axis="x" />` via Rulers
  - Refs do mesmo componente: `src/editor/canvas/rulers.tsx:40` `const top = useRef<HTMLDivElement>(null);`, `src/editor/canvas/rulers.tsx:41` `const left = useRef<HTMLDivElement>(null);`
- **Criação:** `src/editor/canvas/rulers.tsx:42` `const [measure, setMeasure] = useState<Omit<RulerMeasure, 'pointer'> | null>(null);`
- **Descarte:** `src/editor/canvas/rulers.tsx:72` `return () => cancelAnimationFrame(request);` via Rulers (retorno do efeito)
- **Navegador:** não

## EST-L07-032 — caixas das abas de âncora (AnchorTabs)

- **Declaração:** `src/editor/canvas/anchor-tabs.tsx:60` `const [placed, setPlaced] = useState<readonly Box[] | null>(null);`
- **Forma:** `readonly Box[] | null` — a caixa de cada aba, na ordem do manifesto.
- **Valores possíveis:**
  - V1 `null`: nada medido, ou sem seleção posicionada.
  - V2 as caixas medidas (`src/editor/canvas/anchor-tabs.tsx:74` `setPlaced((before) => (JSON.stringify(before) === JSON.stringify(next) ? before : next));`).
- **Escritores:**
  - `src/editor/canvas/anchor-tabs.tsx:74` `setPlaced((before) => (JSON.stringify(before) === JSON.stringify(next) ? before : next));` via AnchorTabs (laço de medição)
- **Leitores:**
  - `src/editor/canvas/anchor-tabs.tsx:81` `if (!built || id === null || placed === null) return null;` via AnchorTabs
  - `src/editor/canvas/anchor-tabs.tsx:85` `const box = placed[i];` via AnchorTabs
- **Criação:** `src/editor/canvas/anchor-tabs.tsx:60` `const [placed, setPlaced] = useState<readonly Box[] | null>(null);`
- **Descarte:** `src/editor/canvas/anchor-tabs.tsx:79` `return () => cancelAnimationFrame(request);` via AnchorTabs (retorno do efeito)
- **Navegador:** não

## EST-L07-033 — medida e renderizador do quadro lateral (SideFrame)

- **Declaração:** `src/editor/canvas/side-frame.tsx:28` `const [size, setSize] = useState({ width: 0, height: 0 });`
- **Forma:** `{ width, height }` da coluna mais `mounted: number` (as montagens) e a ref `renderer: PageRenderer | null`.
- **Valores possíveis:**
  - V1 zerado: coluna ainda não medida.
  - V2 medido (`src/editor/canvas/side-frame.tsx:36` `if (found) setSize({ width: found.contentRect.width, height: found.contentRect.height });`).
  - V3 com o renderizador montado (`src/editor/canvas/side-frame.tsx:55` `renderer.current = made;`).
- **Escritores:**
  - `src/editor/canvas/side-frame.tsx:36` `if (found) setSize({ width: found.contentRect.width, height: found.contentRect.height });` via SideFrame (ResizeObserver)
  - `src/editor/canvas/side-frame.tsx:56` `setMounted((n) => n + 1);` via SideFrame (montagem do quadro)
  - `src/editor/canvas/side-frame.tsx:55` `renderer.current = made;` via SideFrame
- **Leitores:**
  - `src/editor/canvas/side-frame.tsx:70` `renderer.current?.outline(selection === '' ? [] : (selection.split(' ') as NodeId[]), colour);` via SideFrame
  - `src/editor/canvas/side-frame.tsx:72` `const zoom = size.width > 0 ? size.width / breakpoint.width : 0;` via SideFrame
  - Refs do mesmo componente: `src/editor/canvas/side-frame.tsx:26` `const body = useRef<HTMLDivElement>(null);`, `src/editor/canvas/side-frame.tsx:27` `const iframe = useRef<HTMLIFrameElement>(null);`, `src/editor/canvas/side-frame.tsx:42` `const renderer = useRef<PageRenderer | null>(null);`, `src/editor/canvas/side-frame.tsx:44` `const [mounted, setMounted] = useState(0);`
- **Criação:** `src/editor/canvas/side-frame.tsx:28` `const [size, setSize] = useState({ width: 0, height: 0 });`
- **Descarte:** `src/editor/canvas/side-frame.tsx:64` `renderer.current = null;` via SideFrame (retorno do efeito)
- **Navegador:** não

## EST-L07-034 — endereço digitado no pedido de link (LinkPrompt)

- **Declaração:** `src/editor/canvas/text-toolbar.tsx:49` `const [address, setAddress] = useState(() => editedLinkAddress() ?? '');`
- **Forma:** `string` — o texto do campo antes de Enter.
- **Valores possíveis:**
  - V1 o endereço do link em que a seleção está, ou `''`.
  - V2 o que a pessoa digita (`src/editor/canvas/text-toolbar.tsx:78` `onChange={(event) => setAddress(event.target.value)}`).
- **Escritores:**
  - `src/editor/canvas/text-toolbar.tsx:78` `onChange={(event) => setAddress(event.target.value)}` via LinkPrompt
- **Leitores:**
  - `src/editor/canvas/text-toolbar.tsx:73` `value={address}` via LinkPrompt
  - `src/editor/canvas/text-toolbar.tsx:54` `(store.dispatch as (command: CommandId, args: unknown) => DispatchResult)(entry.command.id, { ...entry.door.args, href: address });` via LinkPrompt (resposta do formulário)
  - Ref do mesmo componente: `src/editor/canvas/text-toolbar.tsx:47` `const field = useRef<HTMLInputElement>(null);`
- **Criação:** `src/editor/canvas/text-toolbar.tsx:49` `const [address, setAddress] = useState(() => editedLinkAddress() ?? '');`
- **Descarte:** `src/editor/canvas/text-toolbar.tsx:38` `{opened !== null && LINK !== null ? <LinkPrompt key={opened.count} entry={LINK} anchor={bar} /> : null}` via TextToolbar (o campo desmonta quando o pedido fecha)
- **Navegador:** não

## EST-L07-035 — elemento do palco registrado (camera)

- **Declaração:** `src/editor/view/camera.ts:40` `let stageElement: HTMLElement | null = null;`
- **Forma:** `HTMLElement | null` — o palco que a câmera mede para Fit e para o pivô.
- **Valores possíveis:**
  - V1 `null`: nenhum palco registrado (medidas zeradas, `src/editor/view/camera.ts:48` `if (stageElement === null) return { left: 0, width: 0 };`).
  - V2 o elemento do palco (`src/editor/view/camera.ts:42` `stageElement = element;`).
- **Escritores:**
  - `src/editor/view/camera.ts:42` `stageElement = element;` via registerStage
  - `src/editor/view/camera.ts:44` `if (stageElement === element) stageElement = null;` via registerStage (retorno de remoção)
- **Leitores:**
  - `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` via measure
  - `src/editor/view/camera.ts:62` `export const zoomOf = (shown: Shown, width: number = measure().width): number => (shown.ui.preferences.zoom !== undefined ? shown.ui.preferences.zoom / 100 : fitZoom(width, viewportWidth(shown)));` via zoomOf
- **Criação:** `src/editor/view/camera.ts:40` `let stageElement: HTMLElement | null = null;`
- **Descarte:** `src/editor/view/camera.ts:44` `if (stageElement === element) stageElement = null;` via registerStage (retorno de remoção)
- **Navegador:** não

## EST-L07-036 — tamanho medido da seleção (view/selection-size.ts)

- **Declaração:** `src/editor/view/selection-size.ts:15` `const [size, setSize] = useState<ElementSize | null>(null);`
- **Forma:** `ElementSize | null` (largura e altura em px da página) em dois hooks: `usePrimarySize` (`src/editor/view/selection-size.ts:15` `const [size, setSize] = useState<ElementSize | null>(null);`) e `useSelectionSize` (`src/editor/view/selection-size.ts:36` `const [size, setSize] = useState<ElementSize | null>(null);`).
- **Valores possíveis:**
  - V1 `null`: nada selecionado (`src/editor/view/selection-size.ts:18` `setSize(null);`).
  - V2 o tamanho medido (`src/editor/view/selection-size.ts:24` `setSize((was) => (was?.width === next?.width && was?.height === next?.height ? was : next));`).
- **Escritores:**
  - `src/editor/view/selection-size.ts:24` `setSize((was) => (was?.width === next?.width && was?.height === next?.height ? was : next));` via usePrimarySize (laço de medição)
  - `src/editor/view/selection-size.ts:50` `setSize((was) => (was?.width === next?.width && was?.height === next?.height ? was : next));` via useSelectionSize (laço de medição)
- **Leitores:**
  - `src/editor/view/selection-size.ts:29` `return size;` via usePrimarySize
  - `src/editor/view/selection-size.ts:55` `return size;` via useSelectionSize
- **Criação:** `src/editor/view/selection-size.ts:15` `const [size, setSize] = useState<ElementSize | null>(null);`
- **Descarte:** `src/editor/view/selection-size.ts:27` `return () => cancelAnimationFrame(frame);` via usePrimarySize (retorno do efeito)
- **Navegador:** não

## EST-L07-037 — laço de reprodução da linha do tempo (installPlayingLoop)

- **Declaração:** `src/editor/timeline/preview.ts:65` `let frame = 0;`
- **Forma:** `frame: number` (o quadro agendado) e `last: number` (o instante da última leitura do relógio), fechados em `installPlayingLoop`.
- **Valores possíveis:**
  - V1 no início: `frame === 0`, `last` no instante da instalação (`src/editor/timeline/preview.ts:66` `let last = systemClock.now();`).
  - V2 correndo: um quadro agendado (`src/editor/timeline/preview.ts:68` `frame = window.requestAnimationFrame(tick);`).
  - V3 parado: `last` acompanha o relógio enquanto nada toca (`src/editor/timeline/preview.ts:74` `last = at;`).
- **Escritores:**
  - `src/editor/timeline/preview.ts:68` `frame = window.requestAnimationFrame(tick);` via tick
  - `src/editor/timeline/preview.ts:89` `last = at;` via tick
- **Leitores:**
  - `src/editor/timeline/preview.ts:77` `if (at - last < numberConstant('timeline.playheadTick')) return;` via tick
  - `src/editor/timeline/preview.ts:88` `let next = timeline.time + (at - last);` via tick
  - `src/editor/timeline/preview.ts:101` `return () => window.cancelAnimationFrame(frame);` via installPlayingLoop (retorno de remoção)
- **Criação:** `src/editor/timeline/preview.ts:65` `let frame = 0;`
- **Descarte:** `src/editor/timeline/preview.ts:101` `return () => window.cancelAnimationFrame(frame);` via installPlayingLoop (retorno de remoção)
- **Navegador:** não

## EST-L07-038 — campo de nome de nova animação (NewAnimation)

- **Declaração:** `src/editor/timeline/panel.tsx:53` `const [asking, setAsking] = useState(false);`
- **Forma:** `boolean` — se o campo de nome está aberto.
- **Valores possíveis:**
  - V1 `false`: o botão + desenhado.
  - V2 `true`: o campo aberto (`src/editor/timeline/panel.tsx:67` `if (ready) setAsking(true);`).
- **Escritores:**
  - `src/editor/timeline/panel.tsx:67` `if (ready) setAsking(true);` via NewAnimation
  - `src/editor/timeline/panel.tsx:75` `return <PanelField entry={NEW_ANIMATION} value="" label={t('timeline.name')} disabled={!ready} autoFocus onDone={() => setAsking(false)} />;` via NewAnimation
- **Leitores:**
  - `src/editor/timeline/panel.tsx:55` `if (!asking) {` via NewAnimation
- **Criação:** `src/editor/timeline/panel.tsx:53` `const [asking, setAsking] = useState(false);`
- **Descarte:** `src/editor/timeline/panel.tsx:53` `const [asking, setAsking] = useState(false);` (o campo desmonta com o painel)
- **Navegador:** não

## EST-L07-039 — dica de arrasto de painel (workspace/panel-drag.ts)

- **Declaração:** `src/editor/workspace/panel-drag.ts:86` `let shown: PanelHint | null = null;`
- **Forma:** `PanelHint | null` (a zona, o hospedeiro, o ponto e a caixa) mais `listeners: Set<() => void>`.
- **Valores possíveis:**
  - V1 `null`: nenhum painel arrastado.
  - V2 a dica publicada (`src/editor/workspace/panel-drag.ts:98` `shown = hint;`).
- **Escritores:**
  - `src/editor/workspace/panel-drag.ts:98` `shown = hint;` via showPanelHint
  - `src/editor/workspace/panel-drag.ts:91` `listeners.add(listener);` via panelHint.subscribe
- **Leitores:**
  - `src/editor/workspace/panel-drag.ts:89` `get: (): PanelHint | null => shown,` via panelHint.get
  - `src/editor/workspace/windows.tsx:50` `const hint = useSyncExternalStore(panelHint.subscribe, panelHint.get);` via PanelDragLayer
- **Criação:** `src/editor/workspace/panel-drag.ts:86` `let shown: PanelHint | null = null;`
- **Descarte:** fim-da-página `src/editor/workspace/panel-drag.ts:87` `const listeners = new Set<() => void>();`
- **Navegador:** não

## EST-L07-040 — estado dos painéis guardado no navegador

- **Declaração:** `src/editor/workspace/persist.ts:17` `export const browserWorkspace: WorkspaceStorage = {`
- **Forma:** o texto JSON guardado em `localStorage` sob a chave `workspace`: os painéis, o layout e a página aberta.
- **Valores possíveis:**
  - V1 sem chave: `getItem` devolve `null` (`src/editor/workspace/persist.ts:20` `return window.localStorage.getItem(KEY);`).
  - V2 o texto gravado (`src/editor/workspace/persist.ts:27` `window.localStorage.setItem(KEY, text);`).
- **Escritores:**
  - `src/editor/workspace/persist.ts:116` `storage.write(JSON.stringify({ panels: { ...ui.panels, collapsed: null }, layout: ui.layout, page: ui.page ?? null }));` via persistWorkspace
- **Leitores:**
  - `src/editor/workspace/persist.ts:98` `const stored = JSON.parse(text) as { panels?: unknown; layout?: unknown; page?: unknown };` via readWorkspace
- **Criação:** `src/editor/workspace/persist.ts:20` `return window.localStorage.getItem(KEY);`
- **Descarte:** fim-da-página `src/editor/workspace/persist.ts:27` `window.localStorage.setItem(KEY, text);`
- **Navegador:** não

## EST-L07-041 — último estado de interface gravado (persistWorkspace)

- **Declaração:** `src/editor/workspace/persist.ts:111` `let last = store.getState().ui;`
- **Forma:** o último `EditorUi` gravado, fechado em `persistWorkspace`.
- **Valores possíveis:**
  - V1 o estado no momento da instalação.
  - V2 o estado após uma mudança de painéis, layout ou página (`src/editor/workspace/persist.ts:115` `last = ui;`).
- **Escritores:**
  - `src/editor/workspace/persist.ts:115` `last = ui;` via persistWorkspace (ouvinte)
- **Leitores:**
  - `src/editor/workspace/persist.ts:114` `if (ui.panels === last.panels && ui.layout === last.layout && ui.page === last.page) return;` via persistWorkspace (ouvinte)
- **Criação:** `src/editor/workspace/persist.ts:111` `let last = store.getState().ui;`
- **Descarte:** `src/editor/workspace/persist.ts:112` `return store.subscribe(() => {` via persistWorkspace (o retorno desassina; o valor morre com ele)
- **Navegador:** não

## EST-L07-042 — tabela de corpos dos painéis (contexto React)

- **Declaração:** `src/editor/workspace/windows.tsx:20` `export const PanelBodyTable = createContext<PanelBodies>({});`
- **Forma:** contexto React `PanelBodies` — o componente que desenha cada painel.
- **Valores possíveis:**
  - V1 `{}`: o valor padrão do contexto, sem provedor.
  - V2 a tabela entregue pelo provedor, que a casca monta uma vez.
- **Escritores:**
  - `src/editor/workspace/windows.tsx:20` `export const PanelBodyTable = createContext<PanelBodies>({});` via criação do contexto (o valor padrão)
- **Leitores:**
  - `src/editor/workspace/windows.tsx:75` `const Body = useContext(PanelBodyTable)[panel];` via PanelBody
- **Criação:** `src/editor/workspace/windows.tsx:20` `export const PanelBodyTable = createContext<PanelBodies>({});`
- **Descarte:** fim-da-página `src/editor/workspace/windows.tsx:20` `export const PanelBodyTable = createContext<PanelBodies>({});`
- **Navegador:** não

## EST-L07-043 — foco do documento (elemento ativo)

- **Declaração:** `src/editor/canvas/render/render.ts:424` `(element as HTMLElement).focus({ preventScroll: true });`
- **Forma:** o foco do documento do editor e da página do quadro (`document.activeElement`), estado só do navegador.
- **Valores possíveis:**
  - V1 no corpo do editor: sem edição em curso.
  - V2 no elemento editado no quadro (`src/editor/canvas/render/render.ts:424` `(element as HTMLElement).focus({ preventScroll: true });`).
  - V3 num campo do editor, como o primeiro campo do painel rápido recém-aberto (`src/editor/canvas/quick-panel.tsx:483` `first?.focus();`).
- **Escritores:**
  - `src/editor/canvas/render/render.ts:424` `(element as HTMLElement).focus({ preventScroll: true });` via editText
  - `src/editor/canvas/quick-panel.tsx:483` `first?.focus();` via QuickPanel (efeito de layout do foco)
- **Leitores:**
  - `src/editor/canvas/chip-fit.ts:55` `const typing = document.activeElement instanceof HTMLInputElement ? document.activeElement : null;` via installChipFit
  - `src/editor/canvas/frame.tsx:131` `else if (frame.ownerDocument.activeElement === frame) frame.blur();` via followEdit
- **Criação:** `src/editor/canvas/render/render.ts:424` `(element as HTMLElement).focus({ preventScroll: true });`
- **Descarte:** `src/editor/canvas/frame.tsx:131` `else if (frame.ownerDocument.activeElement === frame) frame.blur();` via followEdit (o foco sai do quadro quando a edição acaba)
- **Navegador:** foco

## EST-L07-044 — seleção de texto da página em edição

- **Declaração:** `src/editor/canvas/render/render.ts:425` `const selection = this.target.getSelection();`
- **Forma:** a seleção do documento do quadro (`Selection`), sobre o `contenteditable` do texto editado.
- **Valores possíveis:**
  - V1 sem seleção: nenhum texto editado.
  - V2 o texto inteiro selecionado (`src/editor/canvas/render/render.ts:453` `selection.selectAllChildren(element);`).
  - V3 um intervalo de caracteres (`src/editor/canvas/render/render.ts:502` `selection.setBaseAndExtent(startNode, startOffset, endNode, endOffset);`).
- **Escritores:**
  - `src/editor/canvas/render/render.ts:426` `selection?.selectAllChildren(element);` via editText
  - `src/editor/canvas/render/render.ts:444` `selection.removeAllRanges();` via insertLineBreak
  - `src/editor/canvas/render/render.ts:502` `selection.setBaseAndExtent(startNode, startOffset, endNode, endOffset);` via focusEdited
- **Leitores:**
  - `src/editor/canvas/render/render.ts:467` `const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;` via editedContent
  - `src/editor/canvas/frame.tsx:116` `target.addEventListener('input', captureDraft);` via montagem (a gravação lê a seleção pela `editedContent`)
- **Criação:** `src/editor/canvas/render/render.ts:425` `const selection = this.target.getSelection();`
- **Descarte:** `src/editor/canvas/render/render.ts:417` `if (left && leftElement) this.dress(leftElement, left, true);` via editText (o elemento perde o `contenteditable` e a seleção acaba)
- **Navegador:** seleção-de-texto

## EXC-L07-0001
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/canvas/browser-defaults.ts:17` `const NO_LINE: ReadonlySet<string> = new Set(['none', 'hidden']);`
- **Motivo:** coleção construída uma vez com os nomes das larguras de linha que o navegador não desenha; nunca é escrita depois da criação, então não é estado que sobrevive a uma chamada.

## EXC-L07-0002
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/canvas/handles.ts:84` `const RUNS = new Map<string, (context: Parameters<typeof setStyleCommand.run>[0], args: never) => Outcome<never>>([`
- **Motivo:** tabela fixa dos comandos que handle.step executa; montada uma vez na carga do módulo e só lida, sem escrita posterior.

## EXC-L07-0003
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/canvas/coordinates.ts:526` `const NO_LINES: ReadonlyMap<string, string> = new Map();`
- **Motivo:** mapa vazio e imutável, entregue como o conjunto "nenhuma linha com largura" para computedValues; não guarda nenhum valor entre chamadas.

## EXC-L07-0004
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/canvas/chrome.tsx:125` `const PALETTE = new Map(manifest.elements.palette.flatMap((g) => g.entries.map((e) => [e.id, e] as const)));`
- **Motivo:** índice fixo das entradas da paleta, lido do manifesto na carga; só é consultado, nunca escrito.

## EXC-L07-0005
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/canvas/edit-handles.tsx:87` `const BOX_LONGHANDS: ReadonlySet<string> = new Set(COMPOSITES.filter((c) => c.control === BOX_MODEL_CONTROL).flatMap((c) => c.longhands));`
- **Motivo:** conjunto fixo das propriedades do box model, montado uma vez de properties.json; apenas consultado.

## EXC-L07-0006
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/canvas/edit-handles.tsx:89` `const BAND_LONGHANDS: ReadonlySet<string> = new Set([...BOX_LONGHANDS, ROW_GAP, COLUMN_GAP]);`
- **Motivo:** união fixa das longhands do box model com as duas do gap; montada na carga e só lida.

## EXC-L07-0007
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/canvas/quick-panel.tsx:51` `const COLOUR = new Set(manifest.properties.properties.filter((p) => p.control === 'color-field').map((p) => p.id));`
- **Motivo:** índice fixo das propriedades desenhadas como campo de cor; lido do manifesto uma vez e só consultado.

## EXC-L07-0008
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/canvas/quick-panel.tsx:54` `const FUNCTION_CONTROLS = new Set(FUNCTION_DOORS.map((d) => (d.door.kind === 'inspector-field' ? d.door.control : '')));`
- **Motivo:** conjunto fixo dos controles das funções de filtro e transformação; montado uma vez e só lido.

## EXC-L07-0009
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/canvas/quick-panel.tsx:56` `const FUNCTION_PROPERTIES = new Set(FUNCTION_DOORS.map((d) => (d.door.kind === 'inspector-field' ? d.door.property : null)));`
- **Motivo:** conjunto fixo das propriedades cujo valor é uma lista de funções (filter, transform); montado uma vez e só lido.

## EXC-L07-0010
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/canvas/quick-panel.tsx:72` `const ONE_COLUMN: ReadonlySet<string> = new Set(['settings']);`
- **Motivo:** conjunto fixo com o grupo que o painel desenha numa coluna só; literal, nunca escrito.

## EXC-L07-0011
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/canvas/view-overlays.tsx:13` `const CONTAINERS = new Set(manifest.elements.elements.filter((e) => e.content === 'children').map((e) => e.id));`
- **Motivo:** conjunto fixo dos tipos de elemento que seguram filhos; montado do manifesto na carga e só consultado.

## EXC-L07-0012
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/canvas/render/captured.ts:9` `const RESOURCE = new Set(['src', 'poster', 'data', 'xlink:href', 'data-capture-paint']);`
- **Motivo:** conjunto fixo com os nomes de atributo que carregam um recurso; literal, nunca escrito.

## EXC-L07-0013
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/canvas/text-edit.ts:57` `const TEXTUAL = new Set<string>(manifest.elements.elements.filter((e) => e.content === 'text').map((e) => e.id));`
- **Motivo:** conjunto fixo dos tipos de elemento cujo conteúdo é texto; montado do manifesto na carga e só consultado.

## EXC-L07-0014
- **Padrão:** P-E02
- **Ocorrência:** `src/editor/view/style-state.ts:48` `const ELEMENT_LABELS = new Map(manifest.elements.elements.map((e) => [e.id, e.labelKey as MessageId] as const));`
- **Motivo:** índice fixo do rótulo de cada tipo de elemento; montado do manifesto na carga e só consultado.

## EXC-L07-0015
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/canvas/coordinates.ts:266` `let at = 0;`
- **Motivo:** variável local do laço de cellSpan; morre no fim da função, sem estado entre chamadas.

## EXC-L07-0016
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/canvas/coordinates.ts:291` `let room: ResizeRoom | null = null;`
- **Motivo:** acumulador local de resizeBasis, devolvido no resultado e sem vida após a chamada.

## EXC-L07-0017
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/canvas/coordinates.ts:292` `let starts = { x: false, y: false };`
- **Motivo:** valor local de resizeBasis, montado e devolvido no fim da chamada; não sobrevive a ela.

## EXC-L07-0018
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/canvas/coordinates.ts:406` `let left = 0;`
- **Motivo:** deslocamento local do laço de trackBoxes, sem estado entre chamadas.

## EXC-L07-0019
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/canvas/coordinates.ts:579` `let best: Declared | null = null;`
- **Motivo:** acumulador local de declaredWidth (a declaração vencedora), que morre no fim da chamada.

## EXC-L07-0020
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/canvas/coordinates.ts:580` `let order = 0;`
- **Motivo:** contador local de declaredWidth para desempatar a ordem das declarações; não sobrevive à chamada.

## EXC-L07-0021
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/canvas/chrome.tsx:358` `let anchor = { reference, neighbour, placement };`
- **Motivo:** cópia local de shownAnchor, ajustada e devolvida no fim; sem estado entre chamadas.

## EXC-L07-0022
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/canvas/placement.ts:50` `let x = west ? edgeX - size : east ? edgeX : edgeX - size / 2;`
- **Motivo:** coordenada local de handleHitBox, devolvida na caixa; morre no fim da chamada.

## EXC-L07-0023
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/canvas/placement.ts:51` `let y = north ? edgeY - size : south ? edgeY : edgeY - size / 2;`
- **Motivo:** coordenada local de handleHitBox, devolvida na caixa; morre no fim da chamada.

## EXC-L07-0024
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/canvas/placement.ts:165` `let past: number | null = whole.x;`
- **Motivo:** posição local do laço de clearedLabel, que decide o lugar do rótulo e termina com a chamada.

## EXC-L07-0025
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/canvas/rulers.ts:21` `let label = STEPS.find((s) => s * zoom >= MIN_LABEL_SPACING);`
- **Motivo:** valor local de rulerSteps, devolvido no fim; não guarda estado entre chamadas.

## EXC-L07-0026
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/canvas/render/render.ts:197` `let node: DocNode | undefined = doc.pages[page]?.tree;`
- **Motivo:** percurso local da árvore em touchOf, para achar o nó de um patch; morre no fim da chamada.

## EXC-L07-0027
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/canvas/render/render.ts:198` `let at = 3;`
- **Motivo:** índice local do percurso de touchOf pela árvore; morre no fim da chamada.

## EXC-L07-0028
- **Padrão:** P-E10
- **Ocorrência:** `src/editor/workspace/persist.ts:11` `// Where the workspace is kept between sessions; the browser's localStorage by default, a map in tests`
- **Motivo:** comentário do módulo que só nomeia `localStorage`; a ocorrência de código do armazenamento está nas linhas 20 e 27, cobertas pelo item EST-L07-040.

# L08 — estado de `src/editor/motion/`

Arquivos do lote L08 (31 arquivos de `src/editor/motion/` e de `src/editor/motion/runtime/`).

Os itens abaixo são as coleções compartilhadas, a variável mutável de módulo, o estado fechado nas fábricas do tempo de execução, o estado de componente React, o do navegador e o armazenamento do navegador que os arquivos levantam e leem. As exceções são as ocorrências de padrão de estado que não são item.

## EST-L08-001 — `splits` (peças de um texto dividido, por elemento)
- **Declaração:** `src/editor/motion/runtime/split-text.ts:25` `const splits = new WeakMap<Element, { split: SplitText; by: string; users: number }>();`
- **Forma:** `WeakMap<Element, { split: SplitText; by: string; users: number }>` — o elemento dividido para as peças, o modo da divisão (`by`) e quantos usam as peças.
- **Valores possíveis:**
  - V1 sem entrada: o elemento nunca foi dividido.
  - V2 `users` 1: a primeira divisão do elemento.
  - V3 `users` maior que 1: uma segunda divisão com o mesmo modo compartilha as peças da primeira.
- **Escritores:**
  - `src/editor/motion/runtime/split-text.ts:118` `splits.set(element, { split: made, by, users: 1 });` via `split`.
  - `src/editor/motion/runtime/split-text.ts:57` `held.users += 1;` via `split`.
  - `src/editor/motion/runtime/split-text.ts:107` `splits.delete(element);` via `restore`.
- **Leitores:**
  - `src/editor/motion/runtime/split-text.ts:55` `const held = splits.get(element);` via `split`.
  - `src/editor/motion/runtime/split-text.ts:102` `const entry = splits.get(element);` via `restore`.
- **Criação:** `src/editor/motion/runtime/split-text.ts:25` `const splits = new WeakMap<Element, { split: SplitText; by: string; users: number }>();`
- **Descarte:** fim-da-página `src/editor/motion/runtime/split-text.ts:25` `const splits = new WeakMap<Element, { split: SplitText; by: string; users: number }>();`
- **Navegador:** não

## EST-L08-002 — `players` (jogadores de Lottie por alvo e arquivo)
- **Declaração:** `src/editor/motion/runtime/lottie.ts:33` `const players = new Map<Element, Map<string, LottiePlayer>>();`
- **Forma:** `Map<Element, Map<string, LottiePlayer>>` fechado em `createLottie` — cada alvo para os jogadores por arquivo.
- **Valores possíveis:**
  - V1 sem alvo: nenhuma ação de Lottie ainda pediu um jogador.
  - V2 um alvo com um jogador por arquivo (`effect.file`).
  - V3 em curso: entre o `get` que erra e o `set` que grava o jogador recém-criado por `loadAnimation`.
  - V4 esvaziado por `dispose`.
- **Escritores:**
  - `src/editor/motion/runtime/lottie.ts:54` `players.set(target, byFile);` via `playerOf`.
  - `src/editor/motion/runtime/lottie.ts:53` `byFile.set(effect.file, player);` via `playerOf`.
  - `src/editor/motion/runtime/lottie.ts:78` `players.clear();` via `dispose`.
- **Leitores:**
  - `src/editor/motion/runtime/lottie.ts:37` `const held = players.get(target)?.get(effect.file);` via `playerOf`.
  - `src/editor/motion/runtime/lottie.ts:77` `for (const byFile of players.values()) for (const player of byFile.values()) player.destroy();` via `dispose`.
- **Criação:** `src/editor/motion/runtime/lottie.ts:33` `const players = new Map<Element, Map<string, LottiePlayer>>();`
- **Descarte:** `src/editor/motion/runtime/lottie.ts:78` `players.clear();`
- **Navegador:** não

## EST-L08-003 — `missingSaid` (aviso único de jogador de Lottie ausente)
- **Declaração:** `src/editor/motion/runtime/lottie.ts:34` `let missingSaid = false;`
- **Forma:** booleano fechado em `createLottie`.
- **Valores possíveis:**
  - V1 `false`: o aviso de jogador ausente ainda não foi dado.
  - V2 `true`: o aviso já foi dado, e uma ação seguinte não o repete.
- **Escritores:**
  - `src/editor/motion/runtime/lottie.ts:42` `missingSaid = true;` via `playerOf`.
- **Leitores:**
  - `src/editor/motion/runtime/lottie.ts:41` `if (!missingSaid) kit.report({ code: 'lottie-missing', detail: effect.file });` via `playerOf`.
- **Criação:** `src/editor/motion/runtime/lottie.ts:34` `let missingSaid = false;`
- **Descarte:** fim-da-página `src/editor/motion/runtime/lottie.ts:34` `let missingSaid = false;`
- **Navegador:** não

## EST-L08-004 — `registry` (execuções de uma timeline por fonte)
- **Declaração:** `src/editor/motion/runtime/player.ts:85` `const registry = new Map<string, Map<Element, Run>>();`
- **Forma:** `Map<string, Map<Element, Run>>` fechado em `createPlayer` — cada timeline para as suas execuções por elemento-fonte.
- **Valores possíveis:**
  - V1 sem timeline: nenhuma execução foi pedida.
  - V2 uma timeline com uma execução por fonte.
  - V3 em curso: entre o `get` que erra e os `set` que gravam a execução recém-montada por `build`.
  - V4 esvaziado por `dispose`.
- **Escritores:**
  - `src/editor/motion/runtime/player.ts:576` `registry.set(name, bySource);` via `run`.
  - `src/editor/motion/runtime/player.ts:580` `bySource.set(source, made);` via `run`.
  - `src/editor/motion/runtime/player.ts:643` `registry.clear();` via `dispose`.
- **Leitores:**
  - `src/editor/motion/runtime/player.ts:575` `const bySource = registry.get(name) ?? new Map<Element, Run>();` via `run`.
  - `src/editor/motion/runtime/player.ts:638` `return [...registry.values()].flatMap((bySource) => [...bySource.values()]);` via `runs`.
- **Criação:** `src/editor/motion/runtime/player.ts:85` `const registry = new Map<string, Map<Element, Run>>();`
- **Descarte:** `src/editor/motion/runtime/player.ts:643` `registry.clear();`
- **Navegador:** não

## EST-L08-005 — `partsRegistered` (documentos que já registraram as partes de transformação)
- **Declaração:** `src/editor/motion/runtime/player.ts:86` `const partsRegistered = new WeakSet<Document>();`
- **Forma:** `WeakSet<Document>` fechado em `createPlayer` — cada documento cujas partes de transformação já foram registradas.
- **Valores possíveis:**
  - V1 sem o documento: as partes ainda não foram registradas nele.
  - V2 com o documento: o registro foi feito uma vez e não se repete (a tela reinstala o tempo de execução no mesmo documento).
- **Escritores:**
  - `src/editor/motion/runtime/player.ts:148` `partsRegistered.add(document);` via `registerParts`.
- **Leitores:**
  - `src/editor/motion/runtime/player.ts:147` `if (partsRegistered.has(document)) return;` via `registerParts`.
- **Criação:** `src/editor/motion/runtime/player.ts:86` `const partsRegistered = new WeakSet<Document>();`
- **Descarte:** fim-da-página `src/editor/motion/runtime/player.ts:86` `const partsRegistered = new WeakSet<Document>();`
- **Navegador:** não

## EST-L08-006 — `composed` (transformação composta por elemento e quem a usa)
- **Declaração:** `src/editor/motion/runtime/player.ts:87` `const composed = new Map<Element, { users: number; restore: () => void }>();`
- **Forma:** `Map<Element, { users: number; restore: () => void }>` fechado em `createPlayer` — cada elemento com a transformação composta para quantas execuções a usam e como desfazê-la.
- **Valores possíveis:**
  - V1 sem o elemento: a transformação composta nunca foi posta nele.
  - V2 uma entrada com `users` 1 e a sua restauração.
  - V3 uma entrada com `users` maior que 1: execuções que dividem a mesma transformação composta.
- **Escritores:**
  - `src/editor/motion/runtime/player.ts:173` `composed.set(element, {` via `composeParts`.
  - `src/editor/motion/runtime/player.ts:186` `composed.delete(element);` via a restauração de `composeParts`.
- **Leitores:**
  - `src/editor/motion/runtime/player.ts:164` `const held = composed.get(element);` via `composeParts`.
  - `src/editor/motion/runtime/player.ts:182` `const entry = composed.get(element);` via a restauração de `composeParts`.
- **Criação:** `src/editor/motion/runtime/player.ts:87` `const composed = new Map<Element, { users: number; restore: () => void }>();`
- **Descarte:** fim-da-página `src/editor/motion/runtime/player.ts:87` `const composed = new Map<Element, { users: number; restore: () => void }>();`
- **Navegador:** não

## EST-L08-007 — `animateMissingSaid` (aviso único de `Element.animate` ausente)
- **Declaração:** `src/editor/motion/runtime/player.ts:88` `let animateMissingSaid = false;`
- **Forma:** booleano fechado em `createPlayer`.
- **Valores possíveis:**
  - V1 `false`: o aviso de `Element.animate` ausente ainda não foi dado.
  - V2 `true`: o aviso já foi dado.
- **Escritores:**
  - `src/editor/motion/runtime/player.ts:262` `animateMissingSaid = true;` via `animate`.
- **Leitores:**
  - `src/editor/motion/runtime/player.ts:261` `if (!animateMissingSaid) kit.report({ code: 'action-failed', detail: 'Element.animate' });` via `animate`.
- **Criação:** `src/editor/motion/runtime/player.ts:88` `let animateMissingSaid = false;`
- **Descarte:** fim-da-página `src/editor/motion/runtime/player.ts:88` `let animateMissingSaid = false;`
- **Navegador:** não

## EST-L08-008 — `depth` (profundidade de controles aninhados entre timelines)
- **Declaração:** `src/editor/motion/runtime/player.ts:91` `let depth = 0;`
- **Forma:** número fechado em `createPlayer` — quantos controles de timeline estão em curso.
- **Valores possíveis:**
  - V1 0: nenhum controle em curso.
  - V2 de 1 a 7: controles aninhados em curso.
  - V3 8 (`MAX_DEPTH`): o aninhamento é recusado com um problema.
- **Escritores:**
  - `src/editor/motion/runtime/player.ts:623` `depth += 1;` via `control`.
  - `src/editor/motion/runtime/player.ts:633` `depth -= 1;` via `control`.
- **Leitores:**
  - `src/editor/motion/runtime/player.ts:619` `if (depth >= MAX_DEPTH) {` via `control`.
- **Criação:** `src/editor/motion/runtime/player.ts:91` `let depth = 0;`
- **Descarte:** fim-da-página `src/editor/motion/runtime/player.ts:91` `let depth = 0;`
- **Navegador:** não

## EST-L08-009 — o estado de uma execução de timeline (`Run`)
- **Declaração:** `src/editor/motion/runtime/player.ts:233` `let cursor = -1;`
- **Forma:** variáveis mutáveis fechadas em `build` (a fábrica de uma execução): `cursor`, `isPlaying`, `direction`, `last`, `frame`, `master`, `native`, `nativeTimeline`, `nativeRange`, `animations`, `looping`, `cues` e `cleanups`.
- **Valores possíveis:**
  - V1 `cursor` -1: antes de qualquer coisa rodar, tudo desfeito.
  - V2 `isPlaying` `true` com `frame` ligado: a execução anda, o quadro seguinte pedido.
  - V3 `isPlaying` `false` e `frame` 0: pausada ou parada.
  - V4 `direction` 1 ou -1 e `last` com a última direção.
  - V5 `native` ligado: as animações seguem a linha do tempo de rolagem, e `nativeRange` guarda o intervalo.
  - V6 em curso: entre um `cross` que dispara as pistas e o `cursor` gravado no fim dele.
- **Escritores:**
  - `src/editor/motion/runtime/player.ts:381` `cursor = to;` via `cross`.
  - `src/editor/motion/runtime/player.ts:444` `isPlaying = true;` via `play`.
  - `src/editor/motion/runtime/player.ts:430` `direction = towards;` via `play`.
  - `src/editor/motion/runtime/player.ts:431` `last = towards;` via `play`.
- **Leitores:**
  - `src/editor/motion/runtime/player.ts:553` `time: () => (cursor < 0 ? -1 : now()),` via a execução devolvida.
  - `src/editor/motion/runtime/player.ts:554` `playing: () => isPlaying,` via a execução devolvida.
- **Criação:** `src/editor/motion/runtime/player.ts:579` `const made = build(timeline, source);`
- **Descarte:** `src/editor/motion/runtime/player.ts:544` `for (const animation of all()) animation.cancel();`
- **Navegador:** não

## EST-L08-010 — `registered` (propriedades personalizadas já registradas por documento)
- **Declaração:** `src/editor/motion/runtime/actions.ts:115` `const registered = new WeakMap<Document, Set<string>>();`
- **Forma:** `WeakMap<Document, Set<string>>` fechado em `createActions` — cada documento para os nomes de propriedade personalizada que já registrou.
- **Valores possíveis:**
  - V1 sem o documento: nenhuma propriedade registrada nele.
  - V2 um documento com o conjunto dos nomes já registrados.
- **Escritores:**
  - `src/editor/motion/runtime/actions.ts:120` `registered.set(document, done);` via `register`.
- **Leitores:**
  - `src/editor/motion/runtime/actions.ts:119` `const done = registered.get(document) ?? new Set<string>();` via `register`.
- **Criação:** `src/editor/motion/runtime/actions.ts:115` `const registered = new WeakMap<Document, Set<string>>();`
- **Descarte:** fim-da-página `src/editor/motion/runtime/actions.ts:115` `const registered = new WeakMap<Document, Set<string>>();`
- **Navegador:** não

## EST-L08-011 — `exercised` (tipos de gatilho provados por um teste de comportamento)
- **Declaração:** `src/editor/motion/runtime/triggers.test.ts:9` `const exercised = new Set<string>();`
- **Forma:** `Set<string>` de módulo — os tipos de gatilho que um teste de comportamento do arquivo prende e verifica.
- **Valores possíveis:**
  - V1 vazio: no início do arquivo.
  - V2 o conjunto dos tipos já presos por `bound`, até o teste final conferir que cobre o catálogo.
- **Escritores:**
  - `src/editor/motion/runtime/triggers.test.ts:13` `exercised.add(trigger.kind);` via `bound`.
- **Leitores:**
  - `src/editor/motion/runtime/triggers.test.ts:313` `const proven = new Set(exercised);` via o teste que conferiu o catálogo.
- **Criação:** `src/editor/motion/runtime/triggers.test.ts:9` `const exercised = new Set<string>();`
- **Descarte:** fim-da-página `src/editor/motion/runtime/triggers.test.ts:9` `const exercised = new Set<string>();`
- **Navegador:** não

## EST-L08-012 — `FakeAnimation` (os campos de uma animação do relógio falso)
- **Declaração:** `src/editor/motion/runtime/fake-page.ts:9` `class FakeAnimation {`
- **Forma:** classe da página falsa; campos `currentTime`, `playbackRate`, `playState`, `timeline`, `rangeStart`, `rangeEnd`, `animationName` e `effect`, mais `target`, `keyframes` e `options`.
- **Valores possíveis:**
  - V1 no início: `currentTime` 0, `playbackRate` 1, `playState` `'running'`, `timeline` nulo, `rangeStart` e `rangeEnd` `'normal'`.
  - V2 em curso: `play` põe `'running'`, `pause` põe `'paused'`, `cancel` põe `'idle'` e `currentTime` nulo, `reverse` troca o sinal de `playbackRate`.
  - V3 avançada: `advance` move `currentTime` pelo `playbackRate` dentro do efeito.
- **Escritores:**
  - `src/editor/motion/runtime/fake-page.ts:31` `play(): void {` via `play` (põe `'running'`).
  - `src/editor/motion/runtime/fake-page.ts:37` `cancel(): void {` via `cancel` (põe `'idle'` e zera `currentTime`).
  - `src/editor/motion/runtime/fake-page.ts:48` `this.currentTime = Math.min(this.end, Math.max(0, this.currentTime + ms * this.playbackRate));` via `advance`.
- **Leitores:**
  - `src/editor/motion/runtime/fake-page.ts:78` `return animations.filter((one) => one.target === this && one.playState !== 'idle');` via `getAnimations`.
  - `src/editor/motion/runtime/fake-page.ts:105` `for (const animation of animations) animation.advance(ms);` via `tick`.
- **Criação:** `src/editor/motion/runtime/fake-page.ts:9` `class FakeAnimation {`
- **Descarte:** fim-da-página `src/editor/motion/runtime/fake-page.ts:9` `class FakeAnimation {`
- **Navegador:** não

## EST-L08-013 — o estado da página falsa (`animations`, `frames`, `nextFrame`, `reduced`)
- **Declaração:** `src/editor/motion/runtime/fake-page.ts:81` `let frames: { id: number; run: FrameRequestCallback }[] = [];`
- **Forma:** variáveis mutáveis e um arranjo fechados em `fakePage`: `animations` (o arranjo devolvido), `frames` e `nextFrame` (os quadros pedidos e o próximo id) e `reduced` (o pedido de menos movimento).
- **Valores possíveis:**
  - V1 no início: `animations` vazio, `frames` vazio, `nextFrame` 1, `reduced` `false`.
  - V2 com animações feitas e quadros pendentes.
  - V3 `reduced` `true` depois de `reduceMotion(true)`.
- **Escritores:**
  - `src/editor/motion/runtime/fake-page.ts:69` `const animations: FakeAnimation[] = [];` via `fakePage` (o arranjo cresce em `animate`).
  - `src/editor/motion/runtime/fake-page.ts:82` `let nextFrame = 1;` via `fakePage` (cresce em `requestAnimationFrame`).
  - `src/editor/motion/runtime/fake-page.ts:91` `let reduced = false;` via `fakePage` (muda em `reduceMotion`).
  - `src/editor/motion/runtime/fake-page.ts:89` `frames = frames.filter((frame) => frame.id !== id);` via `cancelAnimationFrame`.
- **Leitores:**
  - `src/editor/motion/runtime/fake-page.ts:105` `for (const animation of animations) animation.advance(ms);` via `tick`.
  - `src/editor/motion/runtime/fake-page.ts:94` `return query.includes('prefers-reduced-motion') ? reduced : false;` via `matchMedia`.
- **Criação:** `src/editor/motion/runtime/fake-page.ts:81` `let frames: { id: number; run: FrameRequestCallback }[] = [];`
- **Descarte:** fim-da-página `src/editor/motion/runtime/fake-page.ts:81` `let frames: { id: number; run: FrameRequestCallback }[] = [];`
- **Navegador:** não

## EST-L08-014 — `expanded` (o cartão de interação aberto)
- **Declaração:** `src/editor/motion/ui/interactions.tsx:76` `const [expanded, setExpanded] = useState(index === 0);`
- **Forma:** estado React (`useState`) de `Card` — o cartão está aberto.
- **Valores possíveis:**
  - V1 `true`: o primeiro cartão abre sozinho; um cartão aberto à mão.
  - V2 `false`: o cartão fica recolhido.
- **Escritores:**
  - `src/editor/motion/ui/interactions.tsx:98` `setExpanded((was) => !was)` via o botão de resumo do cartão.
- **Leitores:**
  - `src/editor/motion/ui/interactions.tsx:98` `aria-expanded={expanded}` via a renderização do cartão.
- **Criação:** `src/editor/motion/ui/interactions.tsx:76` `const [expanded, setExpanded] = useState(index === 0);`
- **Descarte:** `src/editor/motion/ui/interactions.tsx:76` `const [expanded, setExpanded] = useState(index === 0);` (o cartão desmontado perde o estado).
- **Navegador:** não

## EST-L08-015 — `asking` (o campo que pede o nome de uma timeline nova)
- **Declaração:** `src/editor/motion/ui/timeline.tsx:64` `const [asking, setAsking] = useState(false);`
- **Forma:** estado React (`useState`) de `NewTimeline` — o botão virou campo.
- **Valores possíveis:**
  - V1 `false`: o botão que pede a timeline nova.
  - V2 `true`: o campo de nome aberto.
- **Escritores:**
  - `src/editor/motion/ui/timeline.tsx:78` `if (door.available) setAsking(true);` via o clique do botão.
- **Leitores:**
  - `src/editor/motion/ui/timeline.tsx:67` `if (!asking) {` via a renderização de `NewTimeline`.
- **Criação:** `src/editor/motion/ui/timeline.tsx:64` `const [asking, setAsking] = useState(false);`
- **Descarte:** `src/editor/motion/ui/timeline.tsx:86` `return <PanelField entry={entry} value="" label={t('motion.timeline.name')} autoFocus onDone={() => setAsking(false)} />;` (o campo fechado volta ao botão).
- **Navegador:** não

## EST-L08-016 — o tema lembrado em `localStorage` (chave `builder-theme`)
- **Declaração:** `src/editor/motion/runtime/actions.ts:43` `const THEME_KEY = 'builder-theme';`
- **Forma:** `localStorage` (o navegador) — a chave `builder-theme` guarda `'light'` ou `'dark'`.
- **Valores possíveis:**
  - V1 a chave ausente: sem tema lembrado; ao escolher `'system'` ela é removida.
  - V2 `'light'` ou `'dark'`: o tema lembrado entre visitas.
- **Escritores:**
  - `src/editor/motion/runtime/actions.ts:165` `else win.localStorage.setItem(THEME_KEY, theme);` via `remember`.
  - `src/editor/motion/runtime/actions.ts:164` `if (theme === 'system') win.localStorage.removeItem(THEME_KEY);` via `remember`.
- **Leitores:**
  - `src/editor/motion/runtime/start.ts:91` `const theme = win.localStorage.getItem(THEME_KEY);` via `startMotion` (aplica o tema lembrado antes de tocar).
- **Criação:** `src/editor/motion/runtime/actions.ts:165` `else win.localStorage.setItem(THEME_KEY, theme);`
- **Descarte:** `src/editor/motion/runtime/actions.ts:164` `if (theme === 'system') win.localStorage.removeItem(THEME_KEY);`
- **Navegador:** não

## EST-L08-017 — o foco (o elemento ativo do documento)
- **Declaração:** `src/editor/motion/runtime/actions.ts:356` `if (effect.operation === 'focus') html(target).focus({ preventScroll: false });`
- **Forma:** o elemento ativo do documento (`HTMLElement | null`).
- **Valores possíveis:**
  - V1 o alvo de uma ação de foco (`focus`).
  - V2 nenhum elemento: a ação de `blur` tira o foco, e um documento sem campo focado.
- **Escritores:**
  - `src/editor/motion/runtime/actions.ts:356` `if (effect.operation === 'focus') html(target).focus({ preventScroll: false });` via a ação `focus`.
  - `src/editor/motion/runtime/actions.ts:357` `else html(target).blur();` via a ação `blur`.
- **Leitores:**
  - `src/editor/motion/runtime/behaviours.ts:109` `if (!kit.reducedMotion() && !element.matches(':hover') && !element.contains(document.activeElement)) animation?.play();` via `resume` do `marquee` (não retoma o laço com foco dentro do elemento).
- **Criação:** `src/editor/motion/runtime/actions.ts:356` `if (effect.operation === 'focus') html(target).focus({ preventScroll: false });`
- **Descarte:** fim-da-página `src/editor/motion/runtime/actions.ts:357` `else html(target).blur();`
- **Navegador:** foco

## EST-L08-018 — as posições de rolagem (página e carrossel)
- **Declaração:** `src/editor/motion/runtime/actions.ts:180` `if (effect.to === 'top') return win.scrollTo({ top: Math.max(0, effect.offset), behavior });`
- **Forma:** posição de rolagem (`scrollTop` e `scrollLeft`) do documento ou de um contêiner de slides.
- **Valores possíveis:**
  - V1 topo da página: `top` 0 mais o deslocamento.
  - V2 fim da página: `scrollHeight - innerHeight` mais o deslocamento.
  - V3 a posição de um alvo (`to: 'target'`).
  - V4 a posição de um slide escolhido no carrossel.
- **Escritores:**
  - `src/editor/motion/runtime/actions.ts:180` `if (effect.to === 'top') return win.scrollTo({ top: Math.max(0, effect.offset), behavior });` via `scroll`.
  - `src/editor/motion/runtime/actions.ts:181` `if (effect.to === 'bottom') return win.scrollTo({ top: root.scrollHeight - win.innerHeight + effect.offset, behavior });` via `scroll`.
  - `src/editor/motion/runtime/actions.ts:213` `container.scrollTo({ left: chosen.offsetLeft - container.offsetLeft, top: chosen.offsetTop - container.offsetTop, behavior });` via `slide`.
- **Leitores:**
  - `src/editor/motion/runtime/actions.ts:198` `const away = Math.abs(one.offsetLeft - container.offsetLeft - container.scrollLeft) + Math.abs(one.offsetTop - container.offsetTop - container.scrollTop);` via `nearest` do `slide`.
  - `src/editor/motion/runtime/triggers.ts:364` `const away = Math.abs(one.offsetLeft - container.offsetLeft - container.scrollLeft) + Math.abs(one.offsetTop - container.offsetTop - container.scrollTop);` via `scrollend` do gatilho `slide-change`.
  - `src/editor/motion/runtime/triggers.ts:201` `let last = win.scrollY;` via o gatilho `scroll-direction`.
- **Criação:** `src/editor/motion/runtime/actions.ts:180` `if (effect.to === 'top') return win.scrollTo({ top: Math.max(0, effect.offset), behavior });`
- **Descarte:** fim-da-página `src/editor/motion/runtime/actions.ts:180` `if (effect.to === 'top') return win.scrollTo({ top: Math.max(0, effect.offset), behavior });`
- **Navegador:** rolagem

## EST-L08-019 — `ui.motion` (o estado do painel da linha do tempo)
- **Declaração:** `src/editor/motion/state.ts:17` `export interface MotionUiState {`
- **Forma:** campo `motion` de `EditorUi` (o tipo `MotionUiState`), fechado na store do editor — a timeline mostrada, o cursor, o zoom, a rolagem dos segundos, as barras e os quadros-chave selecionados, a área de transferência, a gravação, o encaixe, a prévia e a execução.
- **Valores possíveis:**
  - V1 sem campo: o valor inicial de `initialMotionUi` (tempo 0, o zoom do manifesto, rolagem 0).
  - V2 com timeline nomeada, tempo, seleção e área de transferência gravados pelos comandos.
  - V3 `previewing` e `playing`: a prévia desenha e o cursor anda.
  - V4 `recording` e `running` ligados.
  - V5 `picking` com a timeline e a ação do próximo toque.
- **Escritores:**
  - `src/editor/motion/state.ts:42` `const withMotion = (ui: EditorUi, motion: MotionUiState): EditorUi => ({ ...ui, motion });` via os comandos que gravam o campo.
  - `src/editor/motion/state.ts:108` `return { kind: 'change', ui: withMotion(state.ui, { ...motion, time: clamped, previewing: true }) };` via `motion.setPlayhead`.
- **Leitores:**
  - `src/editor/motion/state.ts:41` `export const motionUiOf = (ui: EditorUi): MotionUiState => ui.motion ?? initialMotionUi();` via `motionUiOf`.
  - `src/editor/motion/state.ts:60` `return { playhead: motionUiOf(state.ui).time, recording: recordTarget(state) };` via `motionContext`.
- **Criação:** `src/editor/motion/state.ts:40` `const initialMotionUi = (): MotionUiState => ({ time: 0, pixelsPerSecond: numberConstant('motion.pixelsPerSecond'), scroll: 0 });`
- **Descarte:** fim-da-página `src/editor/motion/state.ts:42` `const withMotion = (ui: EditorUi, motion: MotionUiState): EditorUi => ({ ...ui, motion });`
- **Navegador:** não

## EST-L08-020 — o estado de cada comportamento instalado
- **Declaração:** `src/editor/motion/runtime/behaviours.ts:48` `let frame = 0;`
- **Forma:** variáveis mutáveis fechadas em cada instalação: o id do quadro pedido (`frame`), a animação do `marquee` (`animation`), e o alvo e a posição do seguidor do cursor (`target`, `at`) com o seu `frame`.
- **Valores possíveis:**
  - V1 `frame` 0: nenhum quadro pedido.
  - V2 `frame` com id: um quadro pedido, o cálculo já agendado.
  - V3 `animation` `null` ou uma animação rodando, pausada ou cancelada.
  - V4 em curso: entre o `pointerenter` que pausa e o `pointerleave` que retoma.
  - V5 `at` com a posição suavizada do seguidor contra `target`.
- **Escritores:**
  - `src/editor/motion/runtime/behaviours.ts:64` `if (frame === 0) frame = win.requestAnimationFrame(update);` via `schedule` do `parallax`.
  - `src/editor/motion/runtime/behaviours.ts:104` `animation = holder.animate(` via `start` do `marquee`.
  - `src/editor/motion/runtime/behaviours.ts:146` `at = { x: at.x + (target.x - at.x) * (1 - lag), y: at.y + (target.y - at.y) * (1 - lag) };` via `draw` do seguidor.
- **Leitores:**
  - `src/editor/motion/runtime/behaviours.ts:99` `animation?.cancel();` via `start` do `marquee`.
  - `src/editor/motion/runtime/behaviours.ts:148` `element.style.setProperty('translate', `${Math.round(at.x - box.width / 2)}px ${Math.round(at.y - box.height / 2)}px`);` via `draw` do seguidor.
  - `src/editor/motion/runtime/behaviours.ts:159` `win.removeEventListener('pointermove', move);` via a remoção da instalação.
- **Criação:** `src/editor/motion/runtime/behaviours.ts:48` `let frame = 0;`
- **Descarte:** `src/editor/motion/runtime/behaviours.ts:119` `return () => {` (a remoção devolvida desfaz quadros, a animação e os ouvintes).
- **Navegador:** não

## EST-L08-021 — o estado de cada vínculo de gatilho
- **Declaração:** `src/editor/motion/runtime/triggers.ts:95` `let within = false;`
- **Forma:** variáveis mutáveis fechadas em cada `bind`: `within` (`focus-within`), `queued` (`form-invalid`), `timer` e `start` (`long-press`), `inside` (rolagem para dentro ou fora), `last` e `going` (`scroll-direction`), `settle` (`resize`), `at` (`breakpoint`), `timer` e `armed` (`idle`) e `before` (`media-time`), `shown` (`slide-change`).
- **Valores possíveis:**
  - V1 o valor inicial de cada vínculo (`within` `false`, `going` `null`, `armed` `true`).
  - V2 o valor de meio do gatilho (`within` `true` com o foco dentro, `settle` com o temporizador de assentamento).
  - V3 em curso: entre um quadro e o retorno de um temporizador.
- **Escritores:**
  - `src/editor/motion/runtime/triggers.ts:133` `let queued = false;` via o gatilho `form-invalid`.
  - `src/editor/motion/runtime/triggers.ts:175` `let inside = false;` via os gatilhos `scroll-into-view` e `scroll-out-of-view`.
  - `src/editor/motion/runtime/triggers.ts:253` `let settle = 0;` via o gatilho `resize`.
  - `src/editor/motion/runtime/triggers.ts:282` `let armed = true;` via o gatilho `idle`.
  - `src/editor/motion/runtime/triggers.ts:309` `let before = element.currentTime;` via o gatilho `media-time`.
  - `src/editor/motion/runtime/triggers.ts:357` `let shown = -1;` via o gatilho `slide-change`.
- **Leitores:**
  - `src/editor/motion/runtime/triggers.ts:116` `if (isRoot && typing !== null && typing !== source && typing.matches('input, textarea, select, [contenteditable]')) return;` via o gatilho `key` (o campo que digita não dispara a tecla).
  - `src/editor/motion/runtime/triggers.ts:202` `let going: 'up' | 'down' | null = null;` via o gatilho `scroll-direction`.
  - `src/editor/motion/runtime/triggers.ts:262` `let at = kit.activeBreakpoint();` via o gatilho `breakpoint`.
- **Criação:** `src/editor/motion/runtime/triggers.ts:95` `let within = false;`
- **Descarte:** `src/editor/motion/runtime/triggers.ts:405` `return () => {` (a remoção desfaz ouvintes, observadores e temporizadores).
- **Navegador:** não

## EST-L08-022 — o estado dos vínculos e comportamentos iniciados por `startMotion`
- **Declaração:** `src/editor/motion/runtime/start.ts:79` `const disposers: (() => void)[] = [];`
- **Forma:** o arranjo `disposers` e, por vínculo, as variáveis mutáveis `fired` (já disparou) e `pending` (o temporizador do atraso).
- **Valores possíveis:**
  - V1 `fired` `false` e `pending` 0: o vínculo ainda não disparou.
  - V2 `pending` com id: um disparo atrasado agendado por `interaction.delay`.
  - V3 `fired` `true`: um vínculo com `once` já disparou e não repete.
  - V4 `disposers` vazio depois de `dispose`.
- **Escritores:**
  - `src/editor/motion/runtime/start.ts:111` `let fired = false;` via `startMotion`.
  - `src/editor/motion/runtime/start.ts:112` `let pending = 0;` via `startMotion`.
  - `src/editor/motion/runtime/start.ts:143` `disposers.push(kit.triggers.bind(interaction.trigger, source, handlers, { start, end }));` via `startMotion`.
  - `src/editor/motion/runtime/start.ts:175` `for (const dispose of disposers.splice(0).reverse()) dispose();` via `dispose`.
- **Leitores:**
  - `src/editor/motion/runtime/start.ts:120` `if (!applies() || (interaction.once === true && fired)) return;` via `fire` do vínculo.
  - `src/editor/motion/runtime/start.ts:114` `win.clearTimeout(pending);` via `later` do vínculo.
- **Criação:** `src/editor/motion/runtime/start.ts:79` `const disposers: (() => void)[] = [];`
- **Descarte:** `src/editor/motion/runtime/start.ts:175` `for (const dispose of disposers.splice(0).reverse()) dispose();`
- **Navegador:** não

## EST-L08-023 — o estado do tempo de execução no quadro da tela
- **Declaração:** `src/editor/motion/use-canvas-motion.ts:65` `let controller: MotionController | null = null;`
- **Forma:** variáveis mutáveis fechadas no efeito de `useCanvasMotion`: o controlador, o modo (`mode`), o tempo lido (`time`), o instante do quadro anterior (`last`) e o id do quadro (`tick`).
- **Valores possíveis:**
  - V1 `controller` `null`: nada rodando.
  - V2 `controller` de uma execução com `mode` `'run'` ou `'preview:<nome>'` ou `''`.
  - V3 `tick` com id: o laço do cursor pediu o quadro seguinte.
  - V4 em curso: entre o `subscribeDocument` que larga o controlador e o `queueMicrotask(restart)`.
- **Escritores:**
  - `src/editor/motion/use-canvas-motion.ts:73` `controller = start(store, frameWindow());` via `restart`.
  - `src/editor/motion/use-canvas-motion.ts:74` `mode = modeOf();` via `restart`.
  - `src/editor/motion/use-canvas-motion.ts:83` `let time = motionUiOf(store.getState().ui).time;` via `useCanvasMotion`.
  - `src/editor/motion/use-canvas-motion.ts:109` `tick = window.requestAnimationFrame(walk);` via `useCanvasMotion`.
- **Leitores:**
  - `src/editor/motion/use-canvas-motion.ts:85` `if (modeOf() !== mode) {` via `stopState`.
  - `src/editor/motion/use-canvas-motion.ts:90` `if (now !== time && mode.startsWith('preview:')) draw(store, frameWindow(), controller);` via `stopState`.
  - `src/editor/motion/use-canvas-motion.ts:100` `const elapsed = at - last;` via `walk`.
- **Criação:** `src/editor/motion/use-canvas-motion.ts:65` `let controller: MotionController | null = null;`
- **Descarte:** `src/editor/motion/use-canvas-motion.ts:110` `return () => {` (a limpeza do efeito cancela o quadro, desfaz as assinaturas e larga o controlador).
- **Navegador:** não

## EST-L08-024 — o quadro agendado de um acompanhamento de rolagem
- **Declaração:** `src/editor/motion/runtime/scroll.ts:64` `let frame = 0;`
- **Forma:** número fechado em `follow` de `createScroll` — o id do quadro pedido, para o progresso sair uma vez por quadro.
- **Valores possíveis:**
  - V1 0: nenhum quadro pedido.
  - V2 com id: um quadro pedido por uma rolagem ou um redimensionamento.
- **Escritores:**
  - `src/editor/motion/runtime/scroll.ts:70` `if (frame === 0) frame = win.requestAnimationFrame(tick);` via `schedule`.
- **Leitores:**
  - `src/editor/motion/runtime/scroll.ts:67` `onProgress(progress(kind, source, start, end));` via `tick`.
- **Criação:** `src/editor/motion/runtime/scroll.ts:64` `let frame = 0;`
- **Descarte:** `src/editor/motion/runtime/scroll.ts:78` `if (frame !== 0) win.cancelAnimationFrame(frame);` (a remoção devolvida cancela o quadro e tira os ouvintes).
- **Navegador:** não

## Excluídos

### EXC-L08-001
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/motion/runtime/triggers.ts:116` `if (isRoot && typing !== null && typing !== source && typing.matches('input, textarea, select, [contenteditable]')) return;`
- **Motivo:** o trecho é o texto de um seletor lido por `matches` para reconhecer um campo que digita, não um estado de edição guardado; `src/editor/motion/runtime/triggers.ts:117` `handlers.fire();`.

# Estado da área L09a

Estado declarado e guardado pelos arquivos de `src/editor/shell/` do lote L09a. Cada item traz a linha que o declara e as linhas que o gravam e o leem.

## EST-L09a-001 — query — asset-picker.tsx
- **Declaração:** `src/editor/shell/asset-picker.tsx:36` `const [query, setQuery] = useState('');`
- **Forma:** valor de estado do componente React (useState), gravado por setQuery
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/asset-picker.tsx:36` `const [query, setQuery] = useState('');`
  - V2 o valor depois de setQuery `src/editor/shell/asset-picker.tsx:71` `{files.length > 1 ? <input className="search" type="search" placeholder={t('assetPicker.search')} aria-label={t('assetPicker.search')} data-local="asset-search" value={query} onChange={(event) => setQuery(event.target.value)} /> : null}` via setQuery
- **Escritores:**
  - `src/editor/shell/asset-picker.tsx:71` `{files.length > 1 ? <input className="search" type="search" placeholder={t('assetPicker.search')} aria-label={t('assetPicker.search')} data-local="asset-search" value={query} onChange={(event) => setQuery(event.target.value)} /> : null}` via setQuery
- **Leitores:**
  - `src/editor/shell/asset-picker.tsx:38` `const wanted = fold(query);` via leitura de query
  - `src/editor/shell/asset-picker.tsx:40` `}, [files, query]);` via leitura de query
- **Criação:** `src/editor/shell/asset-picker.tsx:36` `const [query, setQuery] = useState('');`
- **Descarte:** quando o componente desmonta `src/editor/shell/asset-picker.tsx:36` `const [query, setQuery] = useState('');`
- **Navegador:** não

## EST-L09a-002 — panel — asset-picker.tsx
- **Declaração:** `src/editor/shell/asset-picker.tsx:41` `const panel = useRef<HTMLDivElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/asset-picker.tsx:41` `const panel = useRef<HTMLDivElement>(null);`
  - V2 o valor atribuído `src/editor/shell/asset-picker.tsx:55` `ref={panel}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/asset-picker.tsx:55` `ref={panel}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/asset-picker.tsx:48` `if (open !== null) panel.current?.focus();` via leitura da referência
- **Criação:** `src/editor/shell/asset-picker.tsx:41` `const panel = useRef<HTMLDivElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/asset-picker.tsx:41` `const panel = useRef<HTMLDivElement>(null);`
- **Navegador:** não

## EST-L09a-003 — files — asset-picker.tsx
- **Declaração:** `src/editor/shell/asset-picker.tsx:34` `const files = useMemo(() => imageFiles({ files: held } as never), [held]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/asset-picker.tsx:34` `const files = useMemo(() => imageFiles({ files: held } as never), [held]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/asset-picker.tsx:34` `const files = useMemo(() => imageFiles({ files: held } as never), [held]);`
- **Escritores:**
  - `src/editor/shell/asset-picker.tsx:34` `const files = useMemo(() => imageFiles({ files: held } as never), [held]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/asset-picker.tsx:32` `const held = useEditorState((s) => s.document.files ?? NO_FILES);` via leitura de files
  - `src/editor/shell/asset-picker.tsx:39` `return wanted === '' ? files : files.filter((file) => fold(file.path).includes(wanted));` via leitura de files
  - `src/editor/shell/asset-picker.tsx:40` `}, [files, query]);` via leitura de files
- **Criação:** `src/editor/shell/asset-picker.tsx:34` `const files = useMemo(() => imageFiles({ files: held } as never), [held]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/asset-picker.tsx:34` `const files = useMemo(() => imageFiles({ files: held } as never), [held]);`
- **Navegador:** não

## EST-L09a-004 — shown — asset-picker.tsx
- **Declaração:** `src/editor/shell/asset-picker.tsx:37` `const shown = useMemo(() => {`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/asset-picker.tsx:37` `const shown = useMemo(() => {`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/asset-picker.tsx:37` `const shown = useMemo(() => {`
- **Escritores:**
  - `src/editor/shell/asset-picker.tsx:37` `const shown = useMemo(() => {` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/asset-picker.tsx:75` `: shown.map((file) => (` via leitura de shown
- **Criação:** `src/editor/shell/asset-picker.tsx:37` `const shown = useMemo(() => {`
- **Descarte:** quando o componente desmonta `src/editor/shell/asset-picker.tsx:37` `const shown = useMemo(() => {`
- **Navegador:** não

## EST-L09a-005 — pattern — batch-rename.tsx
- **Declaração:** `src/editor/shell/batch-rename.tsx:38` `const [pattern, setPattern] = useState(START_PATTERN);`
- **Forma:** valor de estado do componente React (useState), gravado por setPattern
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/batch-rename.tsx:38` `const [pattern, setPattern] = useState(START_PATTERN);`
  - V2 o valor depois de setPattern `src/editor/shell/batch-rename.tsx:63` `<input className="input" name="pattern" spellCheck={false} value={pattern} data-autofocus data-key-context={DIALOG_KEYS} onChange={(event) => setPattern(event.target.value)} />` via setPattern
- **Escritores:**
  - `src/editor/shell/batch-rename.tsx:63` `<input className="input" name="pattern" spellCheck={false} value={pattern} data-autofocus data-key-context={DIALOG_KEYS} onChange={(event) => setPattern(event.target.value)} />` via setPattern
- **Leitores:**
  - `src/editor/shell/batch-rename.tsx:42` `return batchNames(names === '' ? [] : names.split('\n'), pattern, Number(start)).join(', ');` via leitura de pattern
  - `src/editor/shell/batch-rename.tsx:52` `const args = { ...apply.door.args, pattern: String(form.get('pattern') ?? ''), start: typed === '' ? Number.NaN : Number(typed) };` via leitura de pattern
  - `src/editor/shell/batch-rename.tsx:62` `<span className="guides-grids__label">{t('batchRename.pattern')}</span>` via leitura de pattern
- **Criação:** `src/editor/shell/batch-rename.tsx:38` `const [pattern, setPattern] = useState(START_PATTERN);`
- **Descarte:** quando o componente desmonta `src/editor/shell/batch-rename.tsx:38` `const [pattern, setPattern] = useState(START_PATTERN);`
- **Navegador:** não

## EST-L09a-006 — start — batch-rename.tsx
- **Declaração:** `src/editor/shell/batch-rename.tsx:39` `const [start, setStart] = useState('1');`
- **Forma:** valor de estado do componente React (useState), gravado por setStart
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/batch-rename.tsx:39` `const [start, setStart] = useState('1');`
  - V2 o valor depois de setStart `src/editor/shell/batch-rename.tsx:68` `<input className="input" name="start" inputMode="numeric" value={start} data-key-context={DIALOG_KEYS} onChange={(event) => setStart(event.target.value)} />` via setStart
- **Escritores:**
  - `src/editor/shell/batch-rename.tsx:68` `<input className="input" name="start" inputMode="numeric" value={start} data-key-context={DIALOG_KEYS} onChange={(event) => setStart(event.target.value)} />` via setStart
- **Leitores:**
  - `src/editor/shell/batch-rename.tsx:42` `return batchNames(names === '' ? [] : names.split('\n'), pattern, Number(start)).join(', ');` via leitura de start
  - `src/editor/shell/batch-rename.tsx:51` `const typed = String(form.get('start') ?? '').trim();` via leitura de start
  - `src/editor/shell/batch-rename.tsx:52` `const args = { ...apply.door.args, pattern: String(form.get('pattern') ?? ''), start: typed === '' ? Number.NaN : Number(typed) };` via leitura de start
- **Criação:** `src/editor/shell/batch-rename.tsx:39` `const [start, setStart] = useState('1');`
- **Descarte:** quando o componente desmonta `src/editor/shell/batch-rename.tsx:39` `const [start, setStart] = useState('1');`
- **Navegador:** não

## EST-L09a-007 — PanelBodies — bodies.ts
- **Declaração:** `src/editor/shell/bodies.ts:34` `export const PanelBodies = createContext<(panel: Panel) => boolean>(() => false);`
- **Forma:** valor de contexto React (createContext)
- **Valores possíveis:**
  - V1 preenchido na carga do módulo `src/editor/shell/bodies.ts:34` `export const PanelBodies = createContext<(panel: Panel) => boolean>(() => false);`
  - V2 lido enquanto a página viver `src/editor/shell/bodies.ts:34` `export const PanelBodies = createContext<(panel: Panel) => boolean>(() => false);`
- **Escritores:**
  - `src/editor/shell/bodies.ts:34` `export const PanelBodies = createContext<(panel: Panel) => boolean>(() => false);` via a carga do módulo
- **Leitores:**
  - `src/editor/shell/bodies.ts:34` `export const PanelBodies = createContext<(panel: Panel) => boolean>(() => false);` via a própria declaração
- **Criação:** `src/editor/shell/bodies.ts:34` `export const PanelBodies = createContext<(panel: Panel) => boolean>(() => false);`
- **Descarte:** fim-da-página `src/editor/shell/bodies.ts:34` `export const PanelBodies = createContext<(panel: Panel) => boolean>(() => false);`
- **Navegador:** não

## EST-L09a-008 — byRegion — breakpoint-tabs.tsx
- **Declaração:** `src/editor/shell/breakpoint-tabs.tsx:30` `const byRegion = new Map<RegionId, TabDoors>();`
- **Forma:** coleção compartilhada do módulo (Map/Set)
- **Valores possíveis:**
  - V1 preenchido na carga do módulo `src/editor/shell/breakpoint-tabs.tsx:30` `const byRegion = new Map<RegionId, TabDoors>();`
  - V2 lido enquanto a página viver `src/editor/shell/breakpoint-tabs.tsx:30` `const byRegion = new Map<RegionId, TabDoors>();`
- **Escritores:**
  - `src/editor/shell/breakpoint-tabs.tsx:37` `byRegion.set(region, doors);` via gravação na coleção
- **Leitores:**
  - `src/editor/shell/breakpoint-tabs.tsx:32` `const held = byRegion.get(region);` via leitura da coleção
- **Criação:** `src/editor/shell/breakpoint-tabs.tsx:30` `const byRegion = new Map<RegionId, TabDoors>();`
- **Descarte:** fim-da-página `src/editor/shell/breakpoint-tabs.tsx:30` `const byRegion = new Map<RegionId, TabDoors>();`
- **Navegador:** não

## EST-L09a-009 — trigger — breakpoints-dialog.tsx
- **Declaração:** `src/editor/shell/breakpoints-dialog.tsx:103` `const trigger = useRef<HTMLButtonElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/breakpoints-dialog.tsx:103` `const trigger = useRef<HTMLButtonElement>(null);`
  - V2 o valor atribuído `src/editor/shell/breakpoints-dialog.tsx:119` `ref={trigger}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/breakpoints-dialog.tsx:119` `ref={trigger}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/breakpoints-dialog.tsx:103` `const trigger = useRef<HTMLButtonElement>(null);` via a própria declaração
- **Criação:** `src/editor/shell/breakpoints-dialog.tsx:103` `const trigger = useRef<HTMLButtonElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/breakpoints-dialog.tsx:103` `const trigger = useRef<HTMLButtonElement>(null);`
- **Navegador:** não

## EST-L09a-010 — input — breakpoints-dialog.tsx
- **Declaração:** `src/editor/shell/breakpoints-dialog.tsx:175` `const input = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/breakpoints-dialog.tsx:175` `const input = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/breakpoints-dialog.tsx:199` `ref={input}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/breakpoints-dialog.tsx:199` `ref={input}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/breakpoints-dialog.tsx:180` `if (input.current !== null && (kept.current || document.activeElement !== input.current)) input.current.value = shown;` via leitura da referência
  - `src/editor/shell/breakpoints-dialog.tsx:195` `keep(input.current?.value ?? '');` via leitura da referência
- **Criação:** `src/editor/shell/breakpoints-dialog.tsx:175` `const input = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/breakpoints-dialog.tsx:175` `const input = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-011 — kept — breakpoints-dialog.tsx
- **Declaração:** `src/editor/shell/breakpoints-dialog.tsx:177` `const kept = useRef(false);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/breakpoints-dialog.tsx:177` `const kept = useRef(false);`
  - V2 o valor atribuído `src/editor/shell/breakpoints-dialog.tsx:181` `kept.current = false;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/breakpoints-dialog.tsx:181` `kept.current = false;` via a atribuição da referência
  - `src/editor/shell/breakpoints-dialog.tsx:186` `kept.current = true;` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/breakpoints-dialog.tsx:180` `if (input.current !== null && (kept.current || document.activeElement !== input.current)) input.current.value = shown;` via leitura da referência
- **Criação:** `src/editor/shell/breakpoints-dialog.tsx:177` `const kept = useRef(false);`
- **Descarte:** quando o componente desmonta `src/editor/shell/breakpoints-dialog.tsx:177` `const kept = useRef(false);`
- **Navegador:** não

## EST-L09a-012 — foco e elemento ativo em breakpoints-dialog.tsx
- **Declaração:** `src/editor/shell/breakpoints-dialog.tsx:180` `if (input.current !== null && (kept.current || document.activeElement !== input.current)) input.current.value = shown;`
- **Forma:** estado do navegador: foco e elemento ativo do documento
- **Valores possíveis:**
  - V1 sem toque do painel: o foco/rolagem é o de antes da montagem `src/editor/shell/breakpoints-dialog.tsx:180` `if (input.current !== null && (kept.current || document.activeElement !== input.current)) input.current.value = shown;`
  - V2 tocado: o painel lê ou move o foco/rolagem
- **Escritores:**
  - `src/editor/shell/breakpoints-dialog.tsx:180` `if (input.current !== null && (kept.current || document.activeElement !== input.current)) input.current.value = shown;` via o próprio navegador
- **Leitores:**
  - `src/editor/shell/breakpoints-dialog.tsx:180` `if (input.current !== null && (kept.current || document.activeElement !== input.current)) input.current.value = shown;` via leitura do navegador
- **Criação:** `src/editor/shell/breakpoints-dialog.tsx:180` `if (input.current !== null && (kept.current || document.activeElement !== input.current)) input.current.value = shown;`
- **Descarte:** fim-da-página `src/editor/shell/breakpoints-dialog.tsx:180` `if (input.current !== null && (kept.current || document.activeElement !== input.current)) input.current.value = shown;`
- **Navegador:** foco

## EST-L09a-013 — compact — canvas.tsx
- **Declaração:** `src/editor/shell/canvas.tsx:179` `const [compact, setCompact] = useState(false);`
- **Forma:** valor de estado do componente React (useState), gravado por setCompact
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/canvas.tsx:179` `const [compact, setCompact] = useState(false);`
  - V2 o valor depois de setCompact `src/editor/shell/canvas.tsx:190` `if (element.scrollWidth > room + 0.5) setCompact(true);` via setCompact
- **Escritores:**
  - `src/editor/shell/canvas.tsx:190` `if (element.scrollWidth > room + 0.5) setCompact(true);` via setCompact
  - `src/editor/shell/canvas.tsx:193` `setCompact(false);` via setCompact
- **Leitores:**
  - `src/editor/shell/canvas.tsx:188` `if (!compact) {` via leitura de compact
  - `src/editor/shell/canvas.tsx:195` `}, [compact, room, said, t]);` via leitura de compact
  - `src/editor/shell/canvas.tsx:197` `} data-region="canvas-breakpoints" role="tablist" style={{ marginLeft: seen.from, width: compact ? undefined : room }}>` via leitura de compact
- **Criação:** `src/editor/shell/canvas.tsx:179` `const [compact, setCompact] = useState(false);`
- **Descarte:** quando o componente desmonta `src/editor/shell/canvas.tsx:179` `const [compact, setCompact] = useState(false);`
- **Navegador:** não

## EST-L09a-014 — size — canvas.tsx
- **Declaração:** `src/editor/shell/canvas.tsx:250` `const [size, setSize] = useState({ width: 0, height: 0 });`
- **Forma:** valor de estado do componente React (useState), gravado por setSize
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/canvas.tsx:250` `const [size, setSize] = useState({ width: 0, height: 0 });`
  - V2 o valor depois de setSize `src/editor/shell/canvas.tsx:263` `setSize({ width, height });` via setSize
- **Escritores:**
  - `src/editor/shell/canvas.tsx:263` `setSize({ width, height });` via setSize
  - `src/editor/shell/canvas.tsx:265` `if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });` via setSize
- **Leitores:**
  - `src/editor/shell/canvas.tsx:56` `{PAGE_ICON !== null ? <Icon name={PAGE_ICON} size="sm" /> : null}` via leitura de size
  - `src/editor/shell/canvas.tsx:241` `<Icon name={GLYPHS.warning} size="sm" />` via leitura de size
  - `src/editor/shell/canvas.tsx:277` `const zoom = chosen !== undefined ? chosen / 100 : fitZoom(size.width, pageWidth);` via leitura de size
- **Criação:** `src/editor/shell/canvas.tsx:250` `const [size, setSize] = useState({ width: 0, height: 0 });`
- **Descarte:** quando o componente desmonta `src/editor/shell/canvas.tsx:250` `const [size, setSize] = useState({ width: 0, height: 0 });`
- **Navegador:** não

## EST-L09a-015 — row — canvas.tsx
- **Declaração:** `src/editor/shell/canvas.tsx:178` `const row = useRef<HTMLDivElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/canvas.tsx:178` `const row = useRef<HTMLDivElement>(null);`
  - V2 o valor atribuído `src/editor/shell/canvas.tsx:197` `} data-region="canvas-breakpoints" role="tablist" style={{ marginLeft: seen.from, width: compact ? undefined : room }}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/canvas.tsx:197` `} data-region="canvas-breakpoints" role="tablist" style={{ marginLeft: seen.from, width: compact ? undefined : room }}>` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/canvas.tsx:185` `const element = row.current;` via leitura da referência
- **Criação:** `src/editor/shell/canvas.tsx:178` `const row = useRef<HTMLDivElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/canvas.tsx:178` `const row = useRef<HTMLDivElement>(null);`
- **Navegador:** não

## EST-L09a-016 — whole — canvas.tsx
- **Declaração:** `src/editor/shell/canvas.tsx:180` `const whole = useRef<{ readonly words: string; readonly width: number } | null>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/canvas.tsx:180` `const whole = useRef<{ readonly words: string; readonly width: number } | null>(null);`
  - V2 o valor atribuído `src/editor/shell/canvas.tsx:189` `whole.current = { words, width: element.scrollWidth };` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/canvas.tsx:189` `whole.current = { words, width: element.scrollWidth };` via a atribuição da referência
  - `src/editor/shell/canvas.tsx:191` `} else if (whole.current === null || whole.current.words !== words || whole.current.width <= room + 0.5) {` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/canvas.tsx:180` `const whole = useRef<{ readonly words: string; readonly width: number } | null>(null);` via a própria declaração
- **Criação:** `src/editor/shell/canvas.tsx:180` `const whole = useRef<{ readonly words: string; readonly width: number } | null>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/canvas.tsx:180` `const whole = useRef<{ readonly words: string; readonly width: number } | null>(null);`
- **Navegador:** não

## EST-L09a-017 — stage — canvas.tsx
- **Declaração:** `src/editor/shell/canvas.tsx:249` `const stage = useRef<HTMLDivElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/canvas.tsx:249` `const stage = useRef<HTMLDivElement>(null);`
  - V2 o valor atribuído `src/editor/shell/canvas.tsx:301` `} ref={stage} data-canvas-stage data-region="canvas-stage">` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/canvas.tsx:301` `} ref={stage} data-canvas-stage data-region="canvas-stage">` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/canvas.tsx:257` `const element = stage.current;` via leitura da referência
  - `src/editor/shell/canvas.tsx:279` `useLayoutEffect(() => registerStage(stage.current), [stageShown]);` via leitura da referência
- **Criação:** `src/editor/shell/canvas.tsx:249` `const stage = useRef<HTMLDivElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/canvas.tsx:249` `const stage = useRef<HTMLDivElement>(null);`
- **Navegador:** não

## EST-L09a-018 — url — capture-url.tsx
- **Declaração:** `src/editor/shell/capture-url.tsx:29` `const [url, setUrl] = useState('');`
- **Forma:** valor de estado do componente React (useState), gravado por setUrl
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/capture-url.tsx:29` `const [url, setUrl] = useState('');`
  - V2 o valor depois de setUrl `src/editor/shell/capture-url.tsx:44` `<input className="input" name="url" type="text" inputMode="url" placeholder={t('capture.placeholder')} spellCheck={false} value={url} data-autofocus data-key-context={DIALOG_KEYS} onChange={(event) => setUrl(event.target.value)} />` via setUrl
- **Escritores:**
  - `src/editor/shell/capture-url.tsx:44` `<input className="input" name="url" type="text" inputMode="url" placeholder={t('capture.placeholder')} spellCheck={false} value={url} data-autofocus data-key-context={DIALOG_KEYS} onChange={(event) => setUrl(event.target.value)} />` via setUrl
- **Leitores:**
  - `src/editor/shell/capture-url.tsx:16` `const REGION = 'capture-url-dialog';` via leitura de url
  - `src/editor/shell/capture-url.tsx:17` `const DIALOG = 'capture-url';` via leitura de url
  - `src/editor/shell/capture-url.tsx:35` `const typed = String(form.get('url') ?? '');` via leitura de url
- **Criação:** `src/editor/shell/capture-url.tsx:29` `const [url, setUrl] = useState('');`
- **Descarte:** quando o componente desmonta `src/editor/shell/capture-url.tsx:29` `const [url, setUrl] = useState('');`
- **Navegador:** não

## EST-L09a-019 — pages — capture-url.tsx
- **Declaração:** `src/editor/shell/capture-url.tsx:30` `const [pages, setPages] = useState('1');`
- **Forma:** valor de estado do componente React (useState), gravado por setPages
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/capture-url.tsx:30` `const [pages, setPages] = useState('1');`
  - V2 o valor depois de setPages `src/editor/shell/capture-url.tsx:48` `<input className="input" name="pages" inputMode="numeric" value={pages} data-key-context={DIALOG_KEYS} onChange={(event) => setPages(event.target.value)} />` via setPages
- **Escritores:**
  - `src/editor/shell/capture-url.tsx:48` `<input className="input" name="pages" inputMode="numeric" value={pages} data-key-context={DIALOG_KEYS} onChange={(event) => setPages(event.target.value)} />` via setPages
- **Leitores:**
  - `src/editor/shell/capture-url.tsx:36` `const count = String(form.get('pages') ?? '').trim();` via leitura de pages
  - `src/editor/shell/capture-url.tsx:37` `afterGesture(store, () => (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(run.command.id as CommandId, { ...run.door.args, url: typed, pages: count === '' ? 1 : Number(count) }));` via leitura de pages
  - `src/editor/shell/capture-url.tsx:47` `<span className="guides-grids__label">{t('capture.pages')}</span>` via leitura de pages
- **Criação:** `src/editor/shell/capture-url.tsx:30` `const [pages, setPages] = useState('1');`
- **Descarte:** quando o componente desmonta `src/editor/shell/capture-url.tsx:30` `const [pages, setPages] = useState('1');`
- **Navegador:** não

## EST-L09a-020 — operation — captured-inspector.tsx
- **Declaração:** `src/editor/shell/captured-inspector.tsx:51` `const [operation, setOperation] = useState<'text' | 'attribute' | 'insert' | 'remove' | 'move'>(node.kind === 'text' ? 'text' : 'attribute');`
- **Forma:** valor de estado do componente React (useState), gravado por setOperation
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/captured-inspector.tsx:51` `const [operation, setOperation] = useState<'text' | 'attribute' | 'insert' | 'remove' | 'move'>(node.kind === 'text' ? 'text' : 'attribute');`
  - V2 o valor depois de setOperation `src/editor/shell/captured-inspector.tsx:65` `<select value={operation} onChange={(event) => setOperation(event.currentTarget.value as typeof operation)}>` via setOperation
- **Escritores:**
  - `src/editor/shell/captured-inspector.tsx:65` `<select value={operation} onChange={(event) => setOperation(event.currentTarget.value as typeof operation)}>` via setOperation
- **Leitores:**
  - `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };` via leitura de operation
  - `src/editor/shell/captured-inspector.tsx:64` `<label>{t('capture.editor.operation')}` via leitura de operation
  - `src/editor/shell/captured-inspector.tsx:73` `{operation === 'attribute' && <label>{t('capture.editor.attribute')}<input value={name} onChange={(event) => setName(event.currentTarget.value)} /></label>}` via leitura de operation
- **Criação:** `src/editor/shell/captured-inspector.tsx:51` `const [operation, setOperation] = useState<'text' | 'attribute' | 'insert' | 'remove' | 'move'>(node.kind === 'text' ? 'text' : 'attribute');`
- **Descarte:** quando o componente desmonta `src/editor/shell/captured-inspector.tsx:51` `const [operation, setOperation] = useState<'text' | 'attribute' | 'insert' | 'remove' | 'move'>(node.kind === 'text' ? 'text' : 'attribute');`
- **Navegador:** não

## EST-L09a-021 — name — captured-inspector.tsx
- **Declaração:** `src/editor/shell/captured-inspector.tsx:52` `const [name, setName] = useState('style');`
- **Forma:** valor de estado do componente React (useState), gravado por setName
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/captured-inspector.tsx:52` `const [name, setName] = useState('style');`
  - V2 o valor depois de setName `src/editor/shell/captured-inspector.tsx:73` `{operation === 'attribute' && <label>{t('capture.editor.attribute')}<input value={name} onChange={(event) => setName(event.currentTarget.value)} /></label>}` via setName
- **Escritores:**
  - `src/editor/shell/captured-inspector.tsx:73` `{operation === 'attribute' && <label>{t('capture.editor.attribute')}<input value={name} onChange={(event) => setName(event.currentTarget.value)} /></label>}` via setName
- **Leitores:**
  - `src/editor/shell/captured-inspector.tsx:30` `<${node.tag}${node.attributes.find((one) => one.name === 'id')?.value ?` via leitura de name
  - `src/editor/shell/captured-inspector.tsx:50` `const paintFallback = node.kind === 'element' && (node.attributes.some((one) => one.name === 'data-capture-paint') || (node.tag === 'video' && node.attributes.some((one) => one.name === 'poster')));` via leitura de name
  - `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };` via leitura de name
- **Criação:** `src/editor/shell/captured-inspector.tsx:52` `const [name, setName] = useState('style');`
- **Descarte:** quando o componente desmonta `src/editor/shell/captured-inspector.tsx:52` `const [name, setName] = useState('style');`
- **Navegador:** não

## EST-L09a-022 — value — captured-inspector.tsx
- **Declaração:** `src/editor/shell/captured-inspector.tsx:53` `const [value, setValue] = useState(node.kind === 'text' ? node.value : '');`
- **Forma:** valor de estado do componente React (useState), gravado por setValue
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/captured-inspector.tsx:53` `const [value, setValue] = useState(node.kind === 'text' ? node.value : '');`
  - V2 o valor depois de setValue `src/editor/shell/captured-inspector.tsx:74` `{['text', 'attribute', 'insert'].includes(operation) && <label>{t('capture.editor.value')}<textarea data-door={VALUE.ref} data-key-context="captured-value" data-args={JSON.stringify({ target: node.id, operation, name, parent, index })} value={value} onChange={(event) => setValue(event.currentTarget.value)} /></label>}` via setValue
- **Escritores:**
  - `src/editor/shell/captured-inspector.tsx:74` `{['text', 'attribute', 'insert'].includes(operation) && <label>{t('capture.editor.value')}<textarea data-door={VALUE.ref} data-key-context="captured-value" data-args={JSON.stringify({ target: node.id, operation, name, parent, index })} value={value} onChange={(event) => setValue(event.currentTarget.value)} /></label>}` via setValue
- **Leitores:**
  - `src/editor/shell/captured-inspector.tsx:22` `const VALUE = entry('captured-value');` via leitura de value
  - `src/editor/shell/captured-inspector.tsx:30` `<${node.tag}${node.attributes.find((one) => one.name === 'id')?.value ?` via leitura de value
  - `src/editor/shell/captured-inspector.tsx:31` `${node.kind}: ${node.value.replace(/\s+/g, ' ').slice(0, 70)}` via leitura de value
- **Criação:** `src/editor/shell/captured-inspector.tsx:53` `const [value, setValue] = useState(node.kind === 'text' ? node.value : '');`
- **Descarte:** quando o componente desmonta `src/editor/shell/captured-inspector.tsx:53` `const [value, setValue] = useState(node.kind === 'text' ? node.value : '');`
- **Navegador:** não

## EST-L09a-023 — parent — captured-inspector.tsx
- **Declaração:** `src/editor/shell/captured-inspector.tsx:54` `const [parent, setParent] = useState(node.id);`
- **Forma:** valor de estado do componente React (useState), gravado por setParent
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/captured-inspector.tsx:54` `const [parent, setParent] = useState(node.id);`
  - V2 o valor depois de setParent `src/editor/shell/captured-inspector.tsx:75` `{['insert', 'move'].includes(operation) && <label>{t('capture.editor.target')}<input value={parent} onChange={(event) => setParent(event.currentTarget.value)} /></label>}` via setParent
- **Escritores:**
  - `src/editor/shell/captured-inspector.tsx:75` `{['insert', 'move'].includes(operation) && <label>{t('capture.editor.target')}<input value={parent} onChange={(event) => setParent(event.currentTarget.value)} /></label>}` via setParent
- **Leitores:**
  - `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };` via leitura de parent
  - `src/editor/shell/captured-inspector.tsx:74` `{['text', 'attribute', 'insert'].includes(operation) && <label>{t('capture.editor.value')}<textarea data-door={VALUE.ref} data-key-context="captured-value" data-args={JSON.stringify({ target: node.id, operation, name, parent, index })} value={value} onChange={(event) => setValue(event.currentTarget.value)} /></label>}` via leitura de parent
- **Criação:** `src/editor/shell/captured-inspector.tsx:54` `const [parent, setParent] = useState(node.id);`
- **Descarte:** quando o componente desmonta `src/editor/shell/captured-inspector.tsx:54` `const [parent, setParent] = useState(node.id);`
- **Navegador:** não

## EST-L09a-024 — index — captured-inspector.tsx
- **Declaração:** `src/editor/shell/captured-inspector.tsx:55` `const [index, setIndex] = useState(0);`
- **Forma:** valor de estado do componente React (useState), gravado por setIndex
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/captured-inspector.tsx:55` `const [index, setIndex] = useState(0);`
  - V2 o valor depois de setIndex `src/editor/shell/captured-inspector.tsx:76` `{['insert', 'move'].includes(operation) && <label>{t('capture.editor.index')}<input type="number" min="0" value={index} onChange={(event) => setIndex(Number(event.currentTarget.value))} /></label>}` via setIndex
- **Escritores:**
  - `src/editor/shell/captured-inspector.tsx:76` `{['insert', 'move'].includes(operation) && <label>{t('capture.editor.index')}<input type="number" min="0" value={index} onChange={(event) => setIndex(Number(event.currentTarget.value))} /></label>}` via setIndex
- **Leitores:**
  - `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };` via leitura de index
  - `src/editor/shell/captured-inspector.tsx:74` `{['text', 'attribute', 'insert'].includes(operation) && <label>{t('capture.editor.value')}<textarea data-door={VALUE.ref} data-key-context="captured-value" data-args={JSON.stringify({ target: node.id, operation, name, parent, index })} value={value} onChange={(event) => setValue(event.currentTarget.value)} /></label>}` via leitura de index
- **Criação:** `src/editor/shell/captured-inspector.tsx:55` `const [index, setIndex] = useState(0);`
- **Descarte:** quando o componente desmonta `src/editor/shell/captured-inspector.tsx:55` `const [index, setIndex] = useState(0);`
- **Navegador:** não

## EST-L09a-025 — open — captured-inspector.tsx
- **Declaração:** `src/editor/shell/captured-inspector.tsx:82` `const [open, setOpen] = useState(false);`
- **Forma:** valor de estado do componente React (useState), gravado por setOpen
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/captured-inspector.tsx:82` `const [open, setOpen] = useState(false);`
  - V2 o valor depois de setOpen `src/editor/shell/captured-inspector.tsx:88` `return <details onToggle={(event) => setOpen(event.currentTarget.open)}>` via setOpen
- **Escritores:**
  - `src/editor/shell/captured-inspector.tsx:88` `return <details onToggle={(event) => setOpen(event.currentTarget.open)}>` via setOpen
- **Leitores:**
  - `src/editor/shell/captured-inspector.tsx:84` `if (!open) return '';` via leitura de open
  - `src/editor/shell/captured-inspector.tsx:87` `}, [file, open]);` via leitura de open
  - `src/editor/shell/captured-inspector.tsx:90` `{open && <pre className="captured-inspector__code"><code>{content}</code></pre>}` via leitura de open
- **Criação:** `src/editor/shell/captured-inspector.tsx:82` `const [open, setOpen] = useState(false);`
- **Descarte:** quando o componente desmonta `src/editor/shell/captured-inspector.tsx:82` `const [open, setOpen] = useState(false);`
- **Navegador:** não

## EST-L09a-026 — search — captured-inspector.tsx
- **Declaração:** `src/editor/shell/captured-inspector.tsx:100` `const [search, setSearch] = useState('');`
- **Forma:** valor de estado do componente React (useState), gravado por setSearch
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/captured-inspector.tsx:100` `const [search, setSearch] = useState('');`
  - V2 o valor depois de setSearch `src/editor/shell/captured-inspector.tsx:114` `<input aria-label={t('capture.editor.search')} placeholder={t('capture.editor.search')} value={search} onChange={(event) => setSearch(event.currentTarget.value)} />` via setSearch
- **Escritores:**
  - `src/editor/shell/captured-inspector.tsx:114` `<input aria-label={t('capture.editor.search')} placeholder={t('capture.editor.search')} value={search} onChange={(event) => setSearch(event.currentTarget.value)} />` via setSearch
- **Leitores:**
  - `src/editor/shell/captured-inspector.tsx:104` `const visible = search.trim() === '' ? rows.filter((one) => one.inBody && (one.node.kind === 'element' || one.node.value.trim() !== '')).slice(0, 200) : rows.filter((one) => one.label.toLowerCase().includes(search.toLowerCase())).slice(0, 200);` via leitura de search
- **Criação:** `src/editor/shell/captured-inspector.tsx:100` `const [search, setSearch] = useState('');`
- **Descarte:** quando o componente desmonta `src/editor/shell/captured-inspector.tsx:100` `const [search, setSearch] = useState('');`
- **Navegador:** não

## EST-L09a-027 — codeOpen — captured-inspector.tsx
- **Declaração:** `src/editor/shell/captured-inspector.tsx:101` `const [codeOpen, setCodeOpen] = useState(false);`
- **Forma:** valor de estado do componente React (useState), gravado por setCodeOpen
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/captured-inspector.tsx:101` `const [codeOpen, setCodeOpen] = useState(false);`
  - V2 o valor depois de setCodeOpen `src/editor/shell/captured-inspector.tsx:117` `<details onToggle={(event) => setCodeOpen(event.currentTarget.open)}>` via setCodeOpen
- **Escritores:**
  - `src/editor/shell/captured-inspector.tsx:117` `<details onToggle={(event) => setCodeOpen(event.currentTarget.open)}>` via setCodeOpen
- **Leitores:**
  - `src/editor/shell/captured-inspector.tsx:106` `const formatted = useMemo(() => codeOpen && root !== null ? formattedCapturedHtml(root) : '', [codeOpen, root]);` via leitura de codeOpen
  - `src/editor/shell/captured-inspector.tsx:119` `{codeOpen && <>` via leitura de codeOpen
- **Criação:** `src/editor/shell/captured-inspector.tsx:101` `const [codeOpen, setCodeOpen] = useState(false);`
- **Descarte:** quando o componente desmonta `src/editor/shell/captured-inspector.tsx:101` `const [codeOpen, setCodeOpen] = useState(false);`
- **Navegador:** não

## EST-L09a-028 — content — captured-inspector.tsx
- **Declaração:** `src/editor/shell/captured-inspector.tsx:83` `const content = useMemo(() => {`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/captured-inspector.tsx:83` `const content = useMemo(() => {`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/captured-inspector.tsx:83` `const content = useMemo(() => {`
- **Escritores:**
  - `src/editor/shell/captured-inspector.tsx:83` `const content = useMemo(() => {` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/captured-inspector.tsx:90` `{open && <pre className="captured-inspector__code"><code>{content}</code></pre>}` via leitura de content
- **Criação:** `src/editor/shell/captured-inspector.tsx:83` `const content = useMemo(() => {`
- **Descarte:** quando o componente desmonta `src/editor/shell/captured-inspector.tsx:83` `const content = useMemo(() => {`
- **Navegador:** não

## EST-L09a-029 — rows — captured-inspector.tsx
- **Declaração:** `src/editor/shell/captured-inspector.tsx:103` `const rows = useMemo(() => root === null ? [] : flatten(root), [root]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/captured-inspector.tsx:103` `const rows = useMemo(() => root === null ? [] : flatten(root), [root]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/captured-inspector.tsx:103` `const rows = useMemo(() => root === null ? [] : flatten(root), [root]);`
- **Escritores:**
  - `src/editor/shell/captured-inspector.tsx:103` `const rows = useMemo(() => root === null ? [] : flatten(root), [root]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/captured-inspector.tsx:27` `const rows: Row[] = [];` via leitura de rows
  - `src/editor/shell/captured-inspector.tsx:33` `rows.push({ node, depth, label, inBody: visible });` via leitura de rows
  - `src/editor/shell/captured-inspector.tsx:37` `return rows;` via leitura de rows
- **Criação:** `src/editor/shell/captured-inspector.tsx:103` `const rows = useMemo(() => root === null ? [] : flatten(root), [root]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/captured-inspector.tsx:103` `const rows = useMemo(() => root === null ? [] : flatten(root), [root]);`
- **Navegador:** não

## EST-L09a-030 — formatted — captured-inspector.tsx
- **Declaração:** `src/editor/shell/captured-inspector.tsx:106` `const formatted = useMemo(() => codeOpen && root !== null ? formattedCapturedHtml(root) : '', [codeOpen, root]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/captured-inspector.tsx:106` `const formatted = useMemo(() => codeOpen && root !== null ? formattedCapturedHtml(root) : '', [codeOpen, root]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/captured-inspector.tsx:106` `const formatted = useMemo(() => codeOpen && root !== null ? formattedCapturedHtml(root) : '', [codeOpen, root]);`
- **Escritores:**
  - `src/editor/shell/captured-inspector.tsx:106` `const formatted = useMemo(() => codeOpen && root !== null ? formattedCapturedHtml(root) : '', [codeOpen, root]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/captured-inspector.tsx:120` `<pre className="captured-inspector__code"><code>{formatted}</code></pre>` via leitura de formatted
- **Criação:** `src/editor/shell/captured-inspector.tsx:106` `const formatted = useMemo(() => codeOpen && root !== null ? formattedCapturedHtml(root) : '', [codeOpen, root]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/captured-inspector.tsx:106` `const formatted = useMemo(() => codeOpen && root !== null ? formattedCapturedHtml(root) : '', [codeOpen, root]);`
- **Navegador:** não

## EST-L09a-031 — trigger — class-bar.tsx
- **Declaração:** `src/editor/shell/class-bar.tsx:87` `const trigger = useRef<HTMLButtonElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/class-bar.tsx:87` `const trigger = useRef<HTMLButtonElement>(null);`
  - V2 o valor atribuído `src/editor/shell/class-bar.tsx:103` `ref={trigger}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/class-bar.tsx:103` `ref={trigger}` via a atribuição da referência
  - `src/editor/shell/class-bar.tsx:157` `ref={trigger}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/class-bar.tsx:87` `const trigger = useRef<HTMLButtonElement>(null);` via a própria declaração
- **Criação:** `src/editor/shell/class-bar.tsx:87` `const trigger = useRef<HTMLButtonElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/class-bar.tsx:87` `const trigger = useRef<HTMLButtonElement>(null);`
- **Navegador:** não

## EST-L09a-032 — trigger — class-bar.tsx
- **Declaração:** `src/editor/shell/class-bar.tsx:143` `const trigger = useRef<HTMLButtonElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/class-bar.tsx:143` `const trigger = useRef<HTMLButtonElement>(null);`
  - V2 o valor atribuído `src/editor/shell/class-bar.tsx:103` `ref={trigger}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/class-bar.tsx:103` `ref={trigger}` via a atribuição da referência
  - `src/editor/shell/class-bar.tsx:157` `ref={trigger}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/class-bar.tsx:143` `const trigger = useRef<HTMLButtonElement>(null);` via a própria declaração
- **Criação:** `src/editor/shell/class-bar.tsx:143` `const trigger = useRef<HTMLButtonElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/class-bar.tsx:143` `const trigger = useRef<HTMLButtonElement>(null);`
- **Navegador:** não

## EST-L09a-033 — PANE_KINDS — code-pane.tsx
- **Declaração:** `src/editor/shell/code-pane.tsx:27` `const PANE_KINDS: ReadonlySet<string> = new Set(['html', 'css', 'js']);`
- **Forma:** coleção compartilhada do módulo (Map/Set)
- **Valores possíveis:**
  - V1 preenchido na carga do módulo `src/editor/shell/code-pane.tsx:27` `const PANE_KINDS: ReadonlySet<string> = new Set(['html', 'css', 'js']);`
  - V2 lido enquanto a página viver `src/editor/shell/code-pane.tsx:27` `const PANE_KINDS: ReadonlySet<string> = new Set(['html', 'css', 'js']);`
- **Escritores:**
  - `src/editor/shell/code-pane.tsx:27` `const PANE_KINDS: ReadonlySet<string> = new Set(['html', 'css', 'js']);` via a carga do módulo
- **Leitores:**
  - `src/editor/shell/code-pane.tsx:124` `{info !== null && !PANE_KINDS.has(info.kind) ? (` via leitura da coleção
- **Criação:** `src/editor/shell/code-pane.tsx:27` `const PANE_KINDS: ReadonlySet<string> = new Set(['html', 'css', 'js']);`
- **Descarte:** fim-da-página `src/editor/shell/code-pane.tsx:27` `const PANE_KINDS: ReadonlySet<string> = new Set(['html', 'css', 'js']);`
- **Navegador:** não

## EST-L09a-034 — draft — code-pane.tsx
- **Declaração:** `src/editor/shell/code-pane.tsx:108` `const [draft, setDraft] = useState<{ readonly over: string; readonly text: string } | null>(null);`
- **Forma:** valor de estado do componente React (useState), gravado por setDraft
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/code-pane.tsx:108` `const [draft, setDraft] = useState<{ readonly over: string; readonly text: string } | null>(null);`
  - V2 o valor depois de setDraft `src/editor/shell/code-pane.tsx:153` `onChange={(event) => setDraft({ over: edited ?? '', text: event.target.value })}` via setDraft
- **Escritores:**
  - `src/editor/shell/code-pane.tsx:153` `onChange={(event) => setDraft({ over: edited ?? '', text: event.target.value })}` via setDraft
- **Leitores:**
  - `src/editor/shell/code-pane.tsx:114` `const shown = draft !== null && draft.over === edited ? draft.text : edited;` via leitura de draft
- **Criação:** `src/editor/shell/code-pane.tsx:108` `const [draft, setDraft] = useState<{ readonly over: string; readonly text: string } | null>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/code-pane.tsx:108` `const [draft, setDraft] = useState<{ readonly over: string; readonly text: string } | null>(null);`
- **Navegador:** não

## EST-L09a-035 — body — code-pane.tsx
- **Declaração:** `src/editor/shell/code-pane.tsx:92` `const body = useRef<HTMLDivElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/code-pane.tsx:92` `const body = useRef<HTMLDivElement>(null);`
  - V2 o valor atribuído `src/editor/shell/code-pane.tsx:143` `<div className="code-pane__body" ref={body}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/code-pane.tsx:143` `<div className="code-pane__body" ref={body}>` via a atribuição da referência
  - `src/editor/shell/code-pane.tsx:160` `<div className="code-pane__body" ref={body} data-code-pane tabIndex={0}>` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/code-pane.tsx:100` `const at = body.current?.querySelectorAll('.code-line')[firstMarked];` via leitura da referência
- **Criação:** `src/editor/shell/code-pane.tsx:92` `const body = useRef<HTMLDivElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/code-pane.tsx:92` `const body = useRef<HTMLDivElement>(null);`
- **Navegador:** não

## EST-L09a-036 — tokens — code-pane.tsx
- **Declaração:** `src/editor/shell/code-pane.tsx:33` `const tokens: readonly Token[] = useMemo(() => highlight(text, kind), [text, kind]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/code-pane.tsx:33` `const tokens: readonly Token[] = useMemo(() => highlight(text, kind), [text, kind]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/code-pane.tsx:33` `const tokens: readonly Token[] = useMemo(() => highlight(text, kind), [text, kind]);`
- **Escritores:**
  - `src/editor/shell/code-pane.tsx:33` `const tokens: readonly Token[] = useMemo(() => highlight(text, kind), [text, kind]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/code-pane.tsx:39` `{tokens.map((token, i) => (` via leitura de tokens
- **Criação:** `src/editor/shell/code-pane.tsx:33` `const tokens: readonly Token[] = useMemo(() => highlight(text, kind), [text, kind]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/code-pane.tsx:33` `const tokens: readonly Token[] = useMemo(() => highlight(text, kind), [text, kind]);`
- **Navegador:** não

## EST-L09a-037 — Drawn — code-pane.tsx
- **Declaração:** `src/editor/shell/code-pane.tsx:59` `const Drawn = memo(function Drawn({ lines, kind, marked, digits, mine }: { readonly lines: readonly CodeLine[]; readonly kind: PaneKind; readonly marked: readonly boolean[]; readonly digits: number; readonly mine: ReadonlySet<string> }) {`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/code-pane.tsx:59` `const Drawn = memo(function Drawn({ lines, kind, marked, digits, mine }: { readonly lines: readonly CodeLine[]; readonly kind: PaneKind; readonly marked: readonly boolean[]; readonly digits: number; readonly mine: ReadonlySet<string> }) {`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/code-pane.tsx:59` `const Drawn = memo(function Drawn({ lines, kind, marked, digits, mine }: { readonly lines: readonly CodeLine[]; readonly kind: PaneKind; readonly marked: readonly boolean[]; readonly digits: number; readonly mine: ReadonlySet<string> }) {`
- **Escritores:**
  - `src/editor/shell/code-pane.tsx:59` `const Drawn = memo(function Drawn({ lines, kind, marked, digits, mine }: { readonly lines: readonly CodeLine[]; readonly kind: PaneKind; readonly marked: readonly boolean[]; readonly digits: number; readonly mine: ReadonlySet<string> }) {` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/code-pane.tsx:161` `<Drawn lines={lines} kind={kind} marked={marked} digits={digits} mine={mine} />` via leitura de Drawn
- **Criação:** `src/editor/shell/code-pane.tsx:59` `const Drawn = memo(function Drawn({ lines, kind, marked, digits, mine }: { readonly lines: readonly CodeLine[]; readonly kind: PaneKind; readonly marked: readonly boolean[]; readonly digits: number; readonly mine: ReadonlySet<string> }) {`
- **Descarte:** quando o componente desmonta `src/editor/shell/code-pane.tsx:59` `const Drawn = memo(function Drawn({ lines, kind, marked, digits, mine }: { readonly lines: readonly CodeLine[]; readonly kind: PaneKind; readonly marked: readonly boolean[]; readonly digits: number; readonly mine: ReadonlySet<string> }) {`
- **Navegador:** não

## EST-L09a-038 — info — code-pane.tsx
- **Declaração:** `src/editor/shell/code-pane.tsx:81` `const info = useMemo(() => shownPane(ui, document, MODEL_RULES), [ui, document]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/code-pane.tsx:81` `const info = useMemo(() => shownPane(ui, document, MODEL_RULES), [ui, document]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/code-pane.tsx:81` `const info = useMemo(() => shownPane(ui, document, MODEL_RULES), [ui, document]);`
- **Escritores:**
  - `src/editor/shell/code-pane.tsx:81` `const info = useMemo(() => shownPane(ui, document, MODEL_RULES), [ui, document]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/code-pane.tsx:102` `}, [firstMarked, kind, info?.path]);` via leitura de info
  - `src/editor/shell/code-pane.tsx:112` `const fileText = info === null || info.generated ? null : info.text;` via leitura de info
  - `src/editor/shell/code-pane.tsx:124` `{info !== null && !PANE_KINDS.has(info.kind) ? (` via leitura de info
- **Criação:** `src/editor/shell/code-pane.tsx:81` `const info = useMemo(() => shownPane(ui, document, MODEL_RULES), [ui, document]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/code-pane.tsx:81` `const info = useMemo(() => shownPane(ui, document, MODEL_RULES), [ui, document]);`
- **Navegador:** não

## EST-L09a-039 — rule — code-pane.tsx
- **Declaração:** `src/editor/shell/code-pane.tsx:84` `const rule = useMemo(() => ruleText({ document, selection }, MODEL_RULES), [document, selection]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/code-pane.tsx:84` `const rule = useMemo(() => ruleText({ document, selection }, MODEL_RULES), [document, selection]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/code-pane.tsx:84` `const rule = useMemo(() => ruleText({ document, selection }, MODEL_RULES), [document, selection]);`
- **Escritores:**
  - `src/editor/shell/code-pane.tsx:84` `const rule = useMemo(() => ruleText({ document, selection }, MODEL_RULES), [document, selection]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/code-pane.tsx:113` `const edited = fileText ?? (kind === 'css' ? rule : kind === 'html' ? ownText : null);` via leitura de rule
- **Criação:** `src/editor/shell/code-pane.tsx:84` `const rule = useMemo(() => ruleText({ document, selection }, MODEL_RULES), [document, selection]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/code-pane.tsx:84` `const rule = useMemo(() => ruleText({ document, selection }, MODEL_RULES), [document, selection]);`
- **Navegador:** não

## EST-L09a-040 — file — code-pane.tsx
- **Declaração:** `src/editor/shell/code-pane.tsx:88` `const file = useMemo(() => paneLines(ui, document, MODEL_RULES), [ui, document]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/code-pane.tsx:88` `const file = useMemo(() => paneLines(ui, document, MODEL_RULES), [ui, document]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/code-pane.tsx:88` `const file = useMemo(() => paneLines(ui, document, MODEL_RULES), [ui, document]);`
- **Escritores:**
  - `src/editor/shell/code-pane.tsx:88` `const file = useMemo(() => paneLines(ui, document, MODEL_RULES), [ui, document]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/code-pane.tsx:88` `const file = useMemo(() => paneLines(ui, document, MODEL_RULES), [ui, document]);` via a própria declaração
- **Criação:** `src/editor/shell/code-pane.tsx:88` `const file = useMemo(() => paneLines(ui, document, MODEL_RULES), [ui, document]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/code-pane.tsx:88` `const file = useMemo(() => paneLines(ui, document, MODEL_RULES), [ui, document]);`
- **Navegador:** não

## EST-L09a-041 — lines — code-pane.tsx
- **Declaração:** `src/editor/shell/code-pane.tsx:89` `const lines = useMemo(() => (kind === 'css' && rule !== null ? rule.split('\n').map((text) => ({ text, node: null })) : file), [kind, rule, file]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/code-pane.tsx:89` `const lines = useMemo(() => (kind === 'css' && rule !== null ? rule.split('\n').map((text) => ({ text, node: null })) : file), [kind, rule, file]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/code-pane.tsx:89` `const lines = useMemo(() => (kind === 'css' && rule !== null ? rule.split('\n').map((text) => ({ text, node: null })) : file), [kind, rule, file]);`
- **Escritores:**
  - `src/editor/shell/code-pane.tsx:89` `const lines = useMemo(() => (kind === 'css' && rule !== null ? rule.split('\n').map((text) => ({ text, node: null })) : file), [kind, rule, file]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/code-pane.tsx:62` `{lines.map((line, i) => (` via leitura de lines
  - `src/editor/shell/code-pane.tsx:104` `const numbers = lines.length;` via leitura de lines
  - `src/editor/shell/code-pane.tsx:161` `<Drawn lines={lines} kind={kind} marked={marked} digits={digits} mine={mine} />` via leitura de lines
- **Criação:** `src/editor/shell/code-pane.tsx:89` `const lines = useMemo(() => (kind === 'css' && rule !== null ? rule.split('\n').map((text) => ({ text, node: null })) : file), [kind, rule, file]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/code-pane.tsx:89` `const lines = useMemo(() => (kind === 'css' && rule !== null ? rule.split('\n').map((text) => ({ text, node: null })) : file), [kind, rule, file]);`
- **Navegador:** não

## EST-L09a-042 — own — code-pane.tsx
- **Declaração:** `src/editor/shell/code-pane.tsx:91` `const own = useMemo(() => elementLines({ document, selection }, MODEL_RULES), [document, selection]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/code-pane.tsx:91` `const own = useMemo(() => elementLines({ document, selection }, MODEL_RULES), [document, selection]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/code-pane.tsx:91` `const own = useMemo(() => elementLines({ document, selection }, MODEL_RULES), [document, selection]);`
- **Escritores:**
  - `src/editor/shell/code-pane.tsx:91` `const own = useMemo(() => elementLines({ document, selection }, MODEL_RULES), [document, selection]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/code-pane.tsx:109` `const ownText = own === null ? null : own.map((line) => line.text).join('\n');` via leitura de own
- **Criação:** `src/editor/shell/code-pane.tsx:91` `const own = useMemo(() => elementLines({ document, selection }, MODEL_RULES), [document, selection]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/code-pane.tsx:91` `const own = useMemo(() => elementLines({ document, selection }, MODEL_RULES), [document, selection]);`
- **Navegador:** não

## EST-L09a-043 — marked — code-pane.tsx
- **Declaração:** `src/editor/shell/code-pane.tsx:96` `const marked = useMemo(() => lines.map((line) => line.node !== null && first !== null && line.node === first), [lines, first]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/code-pane.tsx:96` `const marked = useMemo(() => lines.map((line) => line.node !== null && first !== null && line.node === first), [lines, first]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/code-pane.tsx:96` `const marked = useMemo(() => lines.map((line) => line.node !== null && first !== null && line.node === first), [lines, first]);`
- **Escritores:**
  - `src/editor/shell/code-pane.tsx:96` `const marked = useMemo(() => lines.map((line) => line.node !== null && first !== null && line.node === first), [lines, first]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/code-pane.tsx:67` `<Line text={line.text} kind={kind} node={line.node} selected={marked[i] === true} number={i + 1} plain={mine.size > 0 && line.node !== null && mine.has(line.node)} />` via leitura de marked
  - `src/editor/shell/code-pane.tsx:97` `const firstMarked = marked.indexOf(true);` via leitura de marked
  - `src/editor/shell/code-pane.tsx:161` `<Drawn lines={lines} kind={kind} marked={marked} digits={digits} mine={mine} />` via leitura de marked
- **Criação:** `src/editor/shell/code-pane.tsx:96` `const marked = useMemo(() => lines.map((line) => line.node !== null && first !== null && line.node === first), [lines, first]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/code-pane.tsx:96` `const marked = useMemo(() => lines.map((line) => line.node !== null && first !== null && line.node === first), [lines, first]);`
- **Navegador:** não

## EST-L09a-044 — mine — code-pane.tsx
- **Declaração:** `src/editor/shell/code-pane.tsx:117` `const mine = useMemo(() => new Set((own ?? []).map((line) => line.node).filter((id): id is string => id !== null)), [own]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/code-pane.tsx:117` `const mine = useMemo(() => new Set((own ?? []).map((line) => line.node).filter((id): id is string => id !== null)), [own]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/code-pane.tsx:117` `const mine = useMemo(() => new Set((own ?? []).map((line) => line.node).filter((id): id is string => id !== null)), [own]);`
- **Escritores:**
  - `src/editor/shell/code-pane.tsx:117` `const mine = useMemo(() => new Set((own ?? []).map((line) => line.node).filter((id): id is string => id !== null)), [own]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/code-pane.tsx:67` `<Line text={line.text} kind={kind} node={line.node} selected={marked[i] === true} number={i + 1} plain={mine.size > 0 && line.node !== null && mine.has(line.node)} />` via leitura de mine
  - `src/editor/shell/code-pane.tsx:161` `<Drawn lines={lines} kind={kind} marked={marked} digits={digits} mine={mine} />` via leitura de mine
- **Criação:** `src/editor/shell/code-pane.tsx:117` `const mine = useMemo(() => new Set((own ?? []).map((line) => line.node).filter((id): id is string => id !== null)), [own]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/code-pane.tsx:117` `const mine = useMemo(() => new Set((own ?? []).map((line) => line.node).filter((id): id is string => id !== null)), [own]);`
- **Navegador:** não

## EST-L09a-045 — posição de rolagem em code-pane.tsx
- **Declaração:** `src/editor/shell/code-pane.tsx:101` `at?.scrollIntoView({ block: 'nearest' });`
- **Forma:** estado do navegador: posição de rolagem do painel
- **Valores possíveis:**
  - V1 sem toque do painel: o foco/rolagem é o de antes da montagem `src/editor/shell/code-pane.tsx:101` `at?.scrollIntoView({ block: 'nearest' });`
  - V2 tocado: o painel lê ou move o foco/rolagem
- **Escritores:**
  - `src/editor/shell/code-pane.tsx:101` `at?.scrollIntoView({ block: 'nearest' });` via o próprio navegador
- **Leitores:**
  - `src/editor/shell/code-pane.tsx:101` `at?.scrollIntoView({ block: 'nearest' });` via leitura do navegador
- **Criação:** `src/editor/shell/code-pane.tsx:101` `at?.scrollIntoView({ block: 'nearest' });`
- **Descarte:** fim-da-página `src/editor/shell/code-pane.tsx:101` `at?.scrollIntoView({ block: 'nearest' });`
- **Navegador:** rolagem

## EST-L09a-046 — chosenHue — color.tsx
- **Declaração:** `src/editor/shell/color.tsx:368` `const [chosenHue, setChosenHue] = useState(0);`
- **Forma:** valor de estado do componente React (useState), gravado por setChosenHue
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/color.tsx:368` `const [chosenHue, setChosenHue] = useState(0);`
  - V2 o valor depois de setChosenHue `src/editor/shell/color.tsx:459` `setChosenHue(n);` via setChosenHue
- **Escritores:**
  - `src/editor/shell/color.tsx:459` `setChosenHue(n);` via setChosenHue
- **Leitores:**
  - `src/editor/shell/color.tsx:369` `const hue = hsb.s > 0 && hsb.v > 0 ? Math.round(hsb.h) : chosenHue;` via leitura de chosenHue
- **Criação:** `src/editor/shell/color.tsx:368` `const [chosenHue, setChosenHue] = useState(0);`
- **Descarte:** quando o componente desmonta `src/editor/shell/color.tsx:368` `const [chosenHue, setChosenHue] = useState(0);`
- **Navegador:** não

## EST-L09a-047 — opened — color.tsx
- **Declaração:** `src/editor/shell/color.tsx:372` `const [opened, setOpened] = useState(() => (previous !== '' ? previous : primary === null ? '' : (computedValues(primary, properties, lineStyles(MODEL_RULES))?.[property] ?? current)));`
- **Forma:** valor de estado do componente React (useState), gravado por setOpened
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/color.tsx:372` `const [opened, setOpened] = useState(() => (previous !== '' ? previous : primary === null ? '' : (computedValues(primary, properties, lineStyles(MODEL_RULES))?.[property] ?? current)));`
  - V2 o valor depois de setOpened `src/editor/shell/color.tsx:373` `if (opened === '' && current !== '') setOpened(current);` via setOpened
- **Escritores:**
  - `src/editor/shell/color.tsx:373` `if (opened === '' && current !== '') setOpened(current);` via setOpened
- **Leitores:**
  - `src/editor/shell/color.tsx:405` `const openedColour = parseColor(opened);` via leitura de opened
  - `src/editor/shell/color.tsx:420` `style={{ '--swatch-colour': opened } as CSSProperties}` via leitura de opened
- **Criação:** `src/editor/shell/color.tsx:372` `const [opened, setOpened] = useState(() => (previous !== '' ? previous : primary === null ? '' : (computedValues(primary, properties, lineStyles(MODEL_RULES))?.[property] ?? current)));`
- **Descarte:** quando o componente desmonta `src/editor/shell/color.tsx:372` `const [opened, setOpened] = useState(() => (previous !== '' ? previous : primary === null ? '' : (computedValues(primary, properties, lineStyles(MODEL_RULES))?.[property] ?? current)));`
- **Navegador:** não

## EST-L09a-048 — input — color.tsx
- **Declaração:** `src/editor/shell/color.tsx:86` `const input = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/color.tsx:86` `const input = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/color.tsx:89` `if (input.current === null) return;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/color.tsx:89` `if (input.current === null) return;` via a atribuição da referência
  - `src/editor/shell/color.tsx:104` `ref={input}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/color.tsx:90` `input.current.value = shown;` via leitura da referência
  - `src/editor/shell/color.tsx:95` `const element = input.current;` via leitura da referência
- **Criação:** `src/editor/shell/color.tsx:86` `const input = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/color.tsx:86` `const input = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-049 — typed — color.tsx
- **Declaração:** `src/editor/shell/color.tsx:87` `const typed = useRef(false);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/color.tsx:87` `const typed = useRef(false);`
  - V2 o valor atribuído `src/editor/shell/color.tsx:91` `typed.current = false;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/color.tsx:91` `typed.current = false;` via a atribuição da referência
  - `src/editor/shell/color.tsx:97` `typed.current = false;` via a atribuição da referência
  - `src/editor/shell/color.tsx:110` `typed.current = true;` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/color.tsx:96` `if (element === null || !typed.current) return;` via leitura da referência
- **Criação:** `src/editor/shell/color.tsx:87` `const typed = useRef(false);`
- **Descarte:** quando o componente desmonta `src/editor/shell/color.tsx:87` `const typed = useRef(false);`
- **Navegador:** não

## EST-L09a-050 — popover — color.tsx
- **Declaração:** `src/editor/shell/color.tsx:328` `const popover = useRef<HTMLDivElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/color.tsx:328` `const popover = useRef<HTMLDivElement>(null);`
  - V2 o valor atribuído `src/editor/shell/color.tsx:409` `<div ref={popover} className="picker" role="dialog" tabIndex={-1} aria-label={t('colorPicker.title')} data-region="color-picker">` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/color.tsx:409` `<div ref={popover} className="picker" role="dialog" tabIndex={-1} aria-label={t('colorPicker.title')} data-region="color-picker">` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/color.tsx:330` `const element = popover.current;` via leitura da referência
  - `src/editor/shell/color.tsx:386` `popover.current?.focus();` via leitura da referência
- **Criação:** `src/editor/shell/color.tsx:328` `const popover = useRef<HTMLDivElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/color.tsx:328` `const popover = useRef<HTMLDivElement>(null);`
- **Navegador:** não

## EST-L09a-051 — variables — color.tsx
- **Declaração:** `src/editor/shell/color.tsx:279` `const variables = useMemo(() => (tokens ?? []).filter((token) => offered.includes(`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/color.tsx:279` `const variables = useMemo(() => (tokens ?? []).filter((token) => offered.includes(`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/color.tsx:279` `const variables = useMemo(() => (tokens ?? []).filter((token) => offered.includes(`
- **Escritores:**
  - `src/editor/shell/color.tsx:279` `const variables = useMemo(() => (tokens ?? []).filter((token) => offered.includes(` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/color.tsx:307` `{variablePart !== undefined && variables.length > 0 ? (` via leitura de variables
  - `src/editor/shell/color.tsx:308` `<div className="picker__row" role="group" aria-label={t('colorPicker.variables')}>` via leitura de variables
  - `src/editor/shell/color.tsx:309` `{variables.map((token) => (` via leitura de variables
- **Criação:** `src/editor/shell/color.tsx:279` `const variables = useMemo(() => (tokens ?? []).filter((token) => offered.includes(`
- **Descarte:** quando o componente desmonta `src/editor/shell/color.tsx:279` `const variables = useMemo(() => (tokens ?? []).filter((token) => offered.includes(`
- **Navegador:** não

## EST-L09a-052 — properties — color.tsx
- **Declaração:** `src/editor/shell/color.tsx:357` `const properties = useMemo(() => [property], [property]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/color.tsx:357` `const properties = useMemo(() => [property], [property]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/color.tsx:357` `const properties = useMemo(() => [property], [property]);`
- **Escritores:**
  - `src/editor/shell/color.tsx:357` `const properties = useMemo(() => [property], [property]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/color.tsx:359` `const computed = usePageValues(primary, properties)?.[property];` via leitura de properties
  - `src/editor/shell/color.tsx:372` `const [opened, setOpened] = useState(() => (previous !== '' ? previous : primary === null ? '' : (computedValues(primary, properties, lineStyles(MODEL_RULES))?.[property] ?? current)));` via leitura de properties
- **Criação:** `src/editor/shell/color.tsx:357` `const properties = useMemo(() => [property], [property]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/color.tsx:357` `const properties = useMemo(() => [property], [property]);`
- **Navegador:** não

## EST-L09a-053 — MENU_OF — command-bar.tsx
- **Declaração:** `src/editor/shell/command-bar.tsx:41` `const MENU_OF = new Map(manifest.doors.flatMap((d) => (d.door.kind === 'menu' ? [[d.command.id, menuOf(d.door.menu).labelKey] as const] : [])).reverse());`
- **Forma:** coleção compartilhada do módulo (Map/Set)
- **Valores possíveis:**
  - V1 preenchido na carga do módulo `src/editor/shell/command-bar.tsx:41` `const MENU_OF = new Map(manifest.doors.flatMap((d) => (d.door.kind === 'menu' ? [[d.command.id, menuOf(d.door.menu).labelKey] as const] : [])).reverse());`
  - V2 lido enquanto a página viver `src/editor/shell/command-bar.tsx:41` `const MENU_OF = new Map(manifest.doors.flatMap((d) => (d.door.kind === 'menu' ? [[d.command.id, menuOf(d.door.menu).labelKey] as const] : [])).reverse());`
- **Escritores:**
  - `src/editor/shell/command-bar.tsx:41` `const MENU_OF = new Map(manifest.doors.flatMap((d) => (d.door.kind === 'menu' ? [[d.command.id, menuOf(d.door.menu).labelKey] as const] : [])).reverse());` via a carga do módulo
- **Leitores:**
  - `src/editor/shell/command-bar.tsx:265` `const menu = kindOf(e.entry) === 'command' ? MENU_OF.get(e.entry.command.id) : undefined;` via leitura da coleção
- **Criação:** `src/editor/shell/command-bar.tsx:41` `const MENU_OF = new Map(manifest.doors.flatMap((d) => (d.door.kind === 'menu' ? [[d.command.id, menuOf(d.door.menu).labelKey] as const] : [])).reverse());`
- **Descarte:** fim-da-página `src/editor/shell/command-bar.tsx:41` `const MENU_OF = new Map(manifest.doors.flatMap((d) => (d.door.kind === 'menu' ? [[d.command.id, menuOf(d.door.menu).labelKey] as const] : [])).reverse());`
- **Navegador:** não

## EST-L09a-054 — query — command-bar.tsx
- **Declaração:** `src/editor/shell/command-bar.tsx:54` `const [query, setQuery] = useState('');`
- **Forma:** valor de estado do componente React (useState), gravado por setQuery
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/command-bar.tsx:54` `const [query, setQuery] = useState('');`
  - V2 o valor depois de setQuery `src/editor/shell/command-bar.tsx:186` `onChange={(event) => setQuery(event.target.value)}` via setQuery
- **Escritores:**
  - `src/editor/shell/command-bar.tsx:186` `onChange={(event) => setQuery(event.target.value)}` via setQuery
  - `src/editor/shell/command-bar.tsx:200` `${pill.prefix}${scopeOf(query).words}` via setQuery
- **Leitores:**
  - `src/editor/shell/command-bar.tsx:88` `const asked = query.trim().toLowerCase();` via leitura de query
  - `src/editor/shell/command-bar.tsx:97` `const asked = askedSet(query);` via leitura de query
  - `src/editor/shell/command-bar.tsx:133` `}, [store, drawsBody, t, locale, query]);` via leitura de query
- **Criação:** `src/editor/shell/command-bar.tsx:54` `const [query, setQuery] = useState('');`
- **Descarte:** quando o componente desmonta `src/editor/shell/command-bar.tsx:54` `const [query, setQuery] = useState('');`
- **Navegador:** não

## EST-L09a-055 — field — command-bar.tsx
- **Declaração:** `src/editor/shell/command-bar.tsx:55` `const field = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/command-bar.tsx:55` `const field = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/command-bar.tsx:173` `ref={field}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/command-bar.tsx:173` `ref={field}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/command-bar.tsx:149` `field.current?.focus();` via leitura da referência
  - `src/editor/shell/command-bar.tsx:156` `const input = field.current;` via leitura da referência
  - `src/editor/shell/command-bar.tsx:201` `field.current?.focus();` via leitura da referência
- **Criação:** `src/editor/shell/command-bar.tsx:55` `const field = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/command-bar.tsx:55` `const field = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-056 — list — command-bar.tsx
- **Declaração:** `src/editor/shell/command-bar.tsx:56` `const list = useRef<HTMLUListElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/command-bar.tsx:56` `const list = useRef<HTMLUListElement>(null);`
  - V2 o valor atribuído `src/editor/shell/command-bar.tsx:213` `<ul className="command-bar__list" role="listbox" id={LIST_ID} ref={list} aria-label={t('command.commandBar')}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/command-bar.tsx:213` `<ul className="command-bar__list" role="listbox" id={LIST_ID} ref={list} aria-label={t('command.commandBar')}>` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/command-bar.tsx:157` `const options = [...(list.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])];` via leitura da referência
- **Criação:** `src/editor/shell/command-bar.tsx:56` `const list = useRef<HTMLUListElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/command-bar.tsx:56` `const list = useRef<HTMLUListElement>(null);`
- **Navegador:** não

## EST-L09a-057 — offered — command-bar.tsx
- **Declaração:** `src/editor/shell/command-bar.tsx:60` `const offered = useMemo(() => {`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/command-bar.tsx:60` `const offered = useMemo(() => {`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/command-bar.tsx:60` `const offered = useMemo(() => {`
- **Escritores:**
  - `src/editor/shell/command-bar.tsx:60` `const offered = useMemo(() => {` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/command-bar.tsx:60` `const offered = useMemo(() => {` via a própria declaração
- **Criação:** `src/editor/shell/command-bar.tsx:60` `const offered = useMemo(() => {`
- **Descarte:** quando o componente desmonta `src/editor/shell/command-bar.tsx:60` `const offered = useMemo(() => {`
- **Navegador:** não

## EST-L09a-058 — shown — command-bar.tsx
- **Declaração:** `src/editor/shell/command-bar.tsx:134` `const shown = useMemo(() => shownEntries(query, offered, recentEntries()), [query, offered]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/command-bar.tsx:134` `const shown = useMemo(() => shownEntries(query, offered, recentEntries()), [query, offered]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/command-bar.tsx:134` `const shown = useMemo(() => shownEntries(query, offered, recentEntries()), [query, offered]);`
- **Escritores:**
  - `src/editor/shell/command-bar.tsx:134` `const shown = useMemo(() => shownEntries(query, offered, recentEntries()), [query, offered]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/command-bar.tsx:138` `if (query.trim() === '' || shown.length > 0) return null;` via leitura de shown
  - `src/editor/shell/command-bar.tsx:144` `}, [query, shown, store, t]);` via leitura de shown
  - `src/editor/shell/command-bar.tsx:159` `}, [shown]);` via leitura de shown
- **Criação:** `src/editor/shell/command-bar.tsx:134` `const shown = useMemo(() => shownEntries(query, offered, recentEntries()), [query, offered]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/command-bar.tsx:134` `const shown = useMemo(() => shownEntries(query, offered, recentEntries()), [query, offered]);`
- **Navegador:** não

## EST-L09a-059 — blocked — command-bar.tsx
- **Declaração:** `src/editor/shell/command-bar.tsx:137` `const blocked = useMemo(() => {`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/command-bar.tsx:137` `const blocked = useMemo(() => {`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/command-bar.tsx:137` `const blocked = useMemo(() => {`
- **Escritores:**
  - `src/editor/shell/command-bar.tsx:137` `const blocked = useMemo(() => {` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/command-bar.tsx:210` `{blocked === null ? t('commandBar.none', { query: query.trim() }) : t('commandBar.unavailable', { command: blocked.label, reason: blocked.reason })}` via leitura de blocked
- **Criação:** `src/editor/shell/command-bar.tsx:137` `const blocked = useMemo(() => {`
- **Descarte:** quando o componente desmonta `src/editor/shell/command-bar.tsx:137` `const blocked = useMemo(() => {`
- **Navegador:** não

## EST-L09a-060 — foco e elemento ativo em command-bar.tsx
- **Declaração:** `src/editor/shell/command-bar.tsx:148` `const before = document.activeElement instanceof HTMLElement ? document.activeElement : null;`
- **Forma:** estado do navegador: foco e elemento ativo do documento
- **Valores possíveis:**
  - V1 sem toque do painel: o foco/rolagem é o de antes da montagem `src/editor/shell/command-bar.tsx:148` `const before = document.activeElement instanceof HTMLElement ? document.activeElement : null;`
  - V2 tocado: o painel lê ou move o foco/rolagem
- **Escritores:**
  - `src/editor/shell/command-bar.tsx:149` `field.current?.focus();` via foco do navegador
- **Leitores:**
  - `src/editor/shell/command-bar.tsx:151` `if ((document.activeElement === null || document.activeElement === document.body) && before?.isConnected) before.focus();` via leitura do foco
- **Criação:** `src/editor/shell/command-bar.tsx:148` `const before = document.activeElement instanceof HTMLElement ? document.activeElement : null;`
- **Descarte:** fim-da-página `src/editor/shell/command-bar.tsx:148` `const before = document.activeElement instanceof HTMLElement ? document.activeElement : null;`
- **Navegador:** foco

## EST-L09a-061 — foco e elemento ativo em command-bar.tsx
- **Declaração:** `src/editor/shell/command-bar.tsx:151` `if ((document.activeElement === null || document.activeElement === document.body) && before?.isConnected) before.focus();`
- **Forma:** estado do navegador: foco e elemento ativo do documento
- **Valores possíveis:**
  - V1 sem toque do painel: o foco/rolagem é o de antes da montagem `src/editor/shell/command-bar.tsx:151` `if ((document.activeElement === null || document.activeElement === document.body) && before?.isConnected) before.focus();`
  - V2 tocado: o painel lê ou move o foco/rolagem
- **Escritores:**
  - `src/editor/shell/command-bar.tsx:149` `field.current?.focus();` via foco do navegador
- **Leitores:**
  - `src/editor/shell/command-bar.tsx:148` `const before = document.activeElement instanceof HTMLElement ? document.activeElement : null;` via leitura do foco
- **Criação:** `src/editor/shell/command-bar.tsx:151` `if ((document.activeElement === null || document.activeElement === document.body) && before?.isConnected) before.focus();`
- **Descarte:** fim-da-página `src/editor/shell/command-bar.tsx:151` `if ((document.activeElement === null || document.activeElement === document.body) && before?.isConnected) before.focus();`
- **Navegador:** foco

## EST-L09a-062 — field — component-prompt.tsx
- **Declaração:** `src/editor/shell/component-prompt.tsx:26` `const field = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/component-prompt.tsx:26` `const field = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/component-prompt.tsx:63` `} className="input" defaultValue={node.node.name} spellCheck={false} data-key-context="component-prompt" />` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/component-prompt.tsx:63` `} className="input" defaultValue={node.node.name} spellCheck={false} data-key-context="component-prompt" />` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/component-prompt.tsx:33` `field.current?.focus();` via leitura da referência
  - `src/editor/shell/component-prompt.tsx:34` `field.current?.select();` via leitura da referência
  - `src/editor/shell/component-prompt.tsx:58` `const value = field.current?.value ?? '';` via leitura da referência
- **Criação:** `src/editor/shell/component-prompt.tsx:26` `const field = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/component-prompt.tsx:26` `const field = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-063 — panel — component-prompt.tsx
- **Declaração:** `src/editor/shell/component-prompt.tsx:27` `const panel = useRef<HTMLDivElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/component-prompt.tsx:27` `const panel = useRef<HTMLDivElement>(null);`
  - V2 o valor atribuído `src/editor/shell/component-prompt.tsx:41` `<div ref={panel} className="picker picker--component" role="dialog" aria-label={t('components.prompt.title')} data-region="component-prompt" onClick={(event) => event.stopPropagation()}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/component-prompt.tsx:41` `<div ref={panel} className="picker picker--component" role="dialog" aria-label={t('components.prompt.title')} data-region="component-prompt" onClick={(event) => event.stopPropagation()}>` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/component-prompt.tsx:27` `const panel = useRef<HTMLDivElement>(null);` via a própria declaração
- **Criação:** `src/editor/shell/component-prompt.tsx:27` `const panel = useRef<HTMLDivElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/component-prompt.tsx:27` `const panel = useRef<HTMLDivElement>(null);`
- **Navegador:** não

## EST-L09a-064 — properties — concept-row.tsx
- **Declaração:** `src/editor/shell/concept-row.tsx:53` `const properties = useMemo(() => detailProperties(row), [row]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/concept-row.tsx:53` `const properties = useMemo(() => detailProperties(row), [row]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/concept-row.tsx:53` `const properties = useMemo(() => detailProperties(row), [row]);`
- **Escritores:**
  - `src/editor/shell/concept-row.tsx:53` `const properties = useMemo(() => detailProperties(row), [row]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/concept-row.tsx:61` `return properties` via leitura de properties
- **Criação:** `src/editor/shell/concept-row.tsx:53` `const properties = useMemo(() => detailProperties(row), [row]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/concept-row.tsx:53` `const properties = useMemo(() => detailProperties(row), [row]);`
- **Navegador:** não

## EST-L09a-065 — askedAt — confirmation.tsx
- **Declaração:** `src/editor/shell/confirmation.tsx:32` `const [askedAt] = useState(dismissals);`
- **Forma:** valor de estado do componente React (useState)
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/confirmation.tsx:32` `const [askedAt] = useState(dismissals);`
  - V2 o valor depois de uma gravação `src/editor/shell/confirmation.tsx:32` `const [askedAt] = useState(dismissals);` via o valor inicial da declaração
- **Escritores:**
  - `src/editor/shell/confirmation.tsx:32` `const [askedAt] = useState(dismissals);` via o valor inicial da declaração
- **Leitores:**
  - `src/editor/shell/confirmation.tsx:41` `if (waiting !== null && dismissals !== askedAt) store.answer(false);` via leitura de askedAt
  - `src/editor/shell/confirmation.tsx:42` `}, [waiting, dismissals, askedAt, store]);` via leitura de askedAt
- **Criação:** `src/editor/shell/confirmation.tsx:32` `const [askedAt] = useState(dismissals);`
- **Descarte:** quando o componente desmonta `src/editor/shell/confirmation.tsx:32` `const [askedAt] = useState(dismissals);`
- **Navegador:** não

## EST-L09a-066 — returnTo — confirmation.tsx
- **Declaração:** `src/editor/shell/confirmation.tsx:33` `const [returnTo] = useState<Element | null>(() => document.activeElement);`
- **Forma:** valor de estado do componente React (useState)
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/confirmation.tsx:33` `const [returnTo] = useState<Element | null>(() => document.activeElement);`
  - V2 o valor depois de uma gravação `src/editor/shell/confirmation.tsx:33` `const [returnTo] = useState<Element | null>(() => document.activeElement);` via o valor inicial da declaração
- **Escritores:**
  - `src/editor/shell/confirmation.tsx:33` `const [returnTo] = useState<Element | null>(() => document.activeElement);` via o valor inicial da declaração
- **Leitores:**
  - `src/editor/shell/confirmation.tsx:37` `if (returnTo instanceof HTMLElement && returnTo !== document.body && returnTo.isConnected) returnTo.focus();` via leitura de returnTo
  - `src/editor/shell/confirmation.tsx:39` `}, [returnTo]);` via leitura de returnTo
- **Criação:** `src/editor/shell/confirmation.tsx:33` `const [returnTo] = useState<Element | null>(() => document.activeElement);`
- **Descarte:** quando o componente desmonta `src/editor/shell/confirmation.tsx:33` `const [returnTo] = useState<Element | null>(() => document.activeElement);`
- **Navegador:** foco

## EST-L09a-067 — box — confirmation.tsx
- **Declaração:** `src/editor/shell/confirmation.tsx:29` `const box = useRef<HTMLDivElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/confirmation.tsx:29` `const box = useRef<HTMLDivElement>(null);`
  - V2 o valor atribuído `src/editor/shell/confirmation.tsx:59` `<div ref={box} className="confirmation__box" role="alertdialog" aria-modal="true" aria-labelledby="confirmation-message" data-key-context={DIALOG_KEYS}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/confirmation.tsx:59` `<div ref={box} className="confirmation__box" role="alertdialog" aria-modal="true" aria-labelledby="confirmation-message" data-key-context={DIALOG_KEYS}>` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/confirmation.tsx:52` `const buttons = [...(box.current?.querySelectorAll<HTMLElement>('button') ?? [])];` via leitura da referência
- **Criação:** `src/editor/shell/confirmation.tsx:29` `const box = useRef<HTMLDivElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/confirmation.tsx:29` `const box = useRef<HTMLDivElement>(null);`
- **Navegador:** não

## EST-L09a-068 — cancel — confirmation.tsx
- **Declaração:** `src/editor/shell/confirmation.tsx:30` `const cancel = useRef<HTMLButtonElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/confirmation.tsx:30` `const cancel = useRef<HTMLButtonElement>(null);`
  - V2 o valor atribuído `src/editor/shell/confirmation.tsx:64` `<button ref={cancel} type="button" className="door door--button" data-local="confirmation" data-confirmation="cancel" onClick={() => store.answer(false)}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/confirmation.tsx:64` `<button ref={cancel} type="button" className="door door--button" data-local="confirmation" data-confirmation="cancel" onClick={() => store.answer(false)}>` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/confirmation.tsx:35` `cancel.current?.focus();` via leitura da referência
- **Criação:** `src/editor/shell/confirmation.tsx:30` `const cancel = useRef<HTMLButtonElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/confirmation.tsx:30` `const cancel = useRef<HTMLButtonElement>(null);`
- **Navegador:** não

## EST-L09a-069 — foco e elemento ativo em confirmation.tsx
- **Declaração:** `src/editor/shell/confirmation.tsx:37` `if (returnTo instanceof HTMLElement && returnTo !== document.body && returnTo.isConnected) returnTo.focus();`
- **Forma:** estado do navegador: foco e elemento ativo do documento
- **Valores possíveis:**
  - V1 sem toque do painel: o foco/rolagem é o de antes da montagem `src/editor/shell/confirmation.tsx:37` `if (returnTo instanceof HTMLElement && returnTo !== document.body && returnTo.isConnected) returnTo.focus();`
  - V2 tocado: o painel lê ou move o foco/rolagem
- **Escritores:**
  - `src/editor/shell/confirmation.tsx:35` `cancel.current?.focus();` via foco do navegador
- **Leitores:**
  - `src/editor/shell/confirmation.tsx:33` `const [returnTo] = useState<Element | null>(() => document.activeElement);` via leitura do foco
- **Criação:** `src/editor/shell/confirmation.tsx:37` `if (returnTo instanceof HTMLElement && returnTo !== document.body && returnTo.isConnected) returnTo.focus();`
- **Descarte:** fim-da-página `src/editor/shell/confirmation.tsx:37` `if (returnTo instanceof HTMLElement && returnTo !== document.body && returnTo.isConnected) returnTo.focus();`
- **Navegador:** foco

## EST-L09a-070 — returnTo — dialog.tsx
- **Declaração:** `src/editor/shell/dialog.tsx:23` `const [returnTo] = useState<Element | null>(() => {`
- **Forma:** valor de estado do componente React (useState)
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/dialog.tsx:23` `const [returnTo] = useState<Element | null>(() => {`
  - V2 o valor depois de uma gravação `src/editor/shell/dialog.tsx:23` `const [returnTo] = useState<Element | null>(() => {` via o valor inicial da declaração
- **Escritores:**
  - `src/editor/shell/dialog.tsx:23` `const [returnTo] = useState<Element | null>(() => {` via o valor inicial da declaração
- **Leitores:**
  - `src/editor/shell/dialog.tsx:30` `if (returnTo instanceof HTMLElement && returnTo.isConnected) returnTo.focus();` via leitura de returnTo
  - `src/editor/shell/dialog.tsx:32` `}, [returnTo]);` via leitura de returnTo
- **Criação:** `src/editor/shell/dialog.tsx:23` `const [returnTo] = useState<Element | null>(() => {`
- **Descarte:** quando o componente desmonta `src/editor/shell/dialog.tsx:23` `const [returnTo] = useState<Element | null>(() => {`
- **Navegador:** não

## EST-L09a-071 — panel — dialog.tsx
- **Declaração:** `src/editor/shell/dialog.tsx:20` `const panel = useRef<HTMLDivElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/dialog.tsx:20` `const panel = useRef<HTMLDivElement>(null);`
  - V2 o valor atribuído `src/editor/shell/dialog.tsx:43` `} ref={panel} role="dialog" aria-modal="true" aria-labelledby={title} tabIndex={-1} data-region={region} data-key-context={DIALOG_KEYS}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/dialog.tsx:43` `} ref={panel} role="dialog" aria-modal="true" aria-labelledby={title} tabIndex={-1} data-region={region} data-key-context={DIALOG_KEYS}>` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/dialog.tsx:28` `panel.current?.focus();` via leitura da referência
  - `src/editor/shell/dialog.tsx:36` `const items = [...(panel.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])];` via leitura da referência
- **Criação:** `src/editor/shell/dialog.tsx:20` `const panel = useRef<HTMLDivElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/dialog.tsx:20` `const panel = useRef<HTMLDivElement>(null);`
- **Navegador:** não

## EST-L09a-072 — foco e elemento ativo em dialog.tsx
- **Declaração:** `src/editor/shell/dialog.tsx:24` `const before = document.activeElement;`
- **Forma:** estado do navegador: foco e elemento ativo do documento
- **Valores possíveis:**
  - V1 sem toque do painel: o foco/rolagem é o de antes da montagem `src/editor/shell/dialog.tsx:24` `const before = document.activeElement;`
  - V2 tocado: o painel lê ou move o foco/rolagem
- **Escritores:**
  - `src/editor/shell/dialog.tsx:28` `panel.current?.focus();` via foco do navegador
- **Leitores:**
  - `src/editor/shell/dialog.tsx:24` `const before = document.activeElement;` via leitura do navegador
- **Criação:** `src/editor/shell/dialog.tsx:24` `const before = document.activeElement;`
- **Descarte:** fim-da-página `src/editor/shell/dialog.tsx:24` `const before = document.activeElement;`
- **Navegador:** foco

## EST-L09a-073 — foco e elemento ativo em dialog.tsx
- **Declaração:** `src/editor/shell/dialog.tsx:30` `if (returnTo instanceof HTMLElement && returnTo.isConnected) returnTo.focus();`
- **Forma:** estado do navegador: foco e elemento ativo do documento
- **Valores possíveis:**
  - V1 sem toque do painel: o foco/rolagem é o de antes da montagem `src/editor/shell/dialog.tsx:30` `if (returnTo instanceof HTMLElement && returnTo.isConnected) returnTo.focus();`
  - V2 tocado: o painel lê ou move o foco/rolagem
- **Escritores:**
  - `src/editor/shell/dialog.tsx:28` `panel.current?.focus();` via foco do navegador
- **Leitores:**
  - `src/editor/shell/dialog.tsx:24` `const before = document.activeElement;` via leitura do foco
- **Criação:** `src/editor/shell/dialog.tsx:30` `if (returnTo instanceof HTMLElement && returnTo.isConnected) returnTo.focus();`
- **Descarte:** fim-da-página `src/editor/shell/dialog.tsx:30` `if (returnTo instanceof HTMLElement && returnTo.isConnected) returnTo.focus();`
- **Navegador:** foco

## EST-L09a-074 — FIXES — dock.tsx
- **Declaração:** `src/editor/shell/dock.tsx:67` `const FIXES = new Map(manifest.checks.fixes.flatMap((fix) => {`
- **Forma:** coleção compartilhada do módulo (Map/Set)
- **Valores possíveis:**
  - V1 preenchido na carga do módulo `src/editor/shell/dock.tsx:67` `const FIXES = new Map(manifest.checks.fixes.flatMap((fix) => {`
  - V2 lido enquanto a página viver `src/editor/shell/dock.tsx:67` `const FIXES = new Map(manifest.checks.fixes.flatMap((fix) => {`
- **Escritores:**
  - `src/editor/shell/dock.tsx:67` `const FIXES = new Map(manifest.checks.fixes.flatMap((fix) => {` via a carga do módulo
- **Leitores:**
  - `src/editor/shell/dock.tsx:119` `{held.some((issue) => FIXES.has(issue.rule)) ? (` via leitura da coleção
  - `src/editor/shell/dock.tsx:122` `const fix = FIXES.get(issue.rule);` via leitura da coleção
- **Criação:** `src/editor/shell/dock.tsx:67` `const FIXES = new Map(manifest.checks.fixes.flatMap((fix) => {`
- **Descarte:** fim-da-página `src/editor/shell/dock.tsx:67` `const FIXES = new Map(manifest.checks.fixes.flatMap((fix) => {`
- **Navegador:** não

## EST-L09a-075 — CATEGORY_BUILT — dock.tsx
- **Declaração:** `src/editor/shell/dock.tsx:72` `const CATEGORY_BUILT = new Map(manifest.checks.categories.map((one) => [one.id, isFeatureBuilt(one.feature as FeatureId)] as const));`
- **Forma:** coleção compartilhada do módulo (Map/Set)
- **Valores possíveis:**
  - V1 preenchido na carga do módulo `src/editor/shell/dock.tsx:72` `const CATEGORY_BUILT = new Map(manifest.checks.categories.map((one) => [one.id, isFeatureBuilt(one.feature as FeatureId)] as const));`
  - V2 lido enquanto a página viver `src/editor/shell/dock.tsx:72` `const CATEGORY_BUILT = new Map(manifest.checks.categories.map((one) => [one.id, isFeatureBuilt(one.feature as FeatureId)] as const));`
- **Escritores:**
  - `src/editor/shell/dock.tsx:72` `const CATEGORY_BUILT = new Map(manifest.checks.categories.map((one) => [one.id, isFeatureBuilt(one.feature as FeatureId)] as const));` via a carga do módulo
- **Leitores:**
  - `src/editor/shell/dock.tsx:83` `return useMemo(() => checksOf(document, manifest.interactions.checks).filter((issue) => CATEGORY_BUILT.get(issue.category) !== false), [document]);` via leitura da coleção
- **Criação:** `src/editor/shell/dock.tsx:72` `const CATEGORY_BUILT = new Map(manifest.checks.categories.map((one) => [one.id, isFeatureBuilt(one.feature as FeatureId)] as const));`
- **Descarte:** fim-da-página `src/editor/shell/dock.tsx:72` `const CATEGORY_BUILT = new Map(manifest.checks.categories.map((one) => [one.id, isFeatureBuilt(one.feature as FeatureId)] as const));`
- **Navegador:** não

## EST-L09a-076 — text — dock.tsx
- **Declaração:** `src/editor/shell/dock.tsx:49` `const text = useMemo(`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/dock.tsx:49` `const text = useMemo(`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/dock.tsx:49` `const text = useMemo(`
- **Escritores:**
  - `src/editor/shell/dock.tsx:49` `const text = useMemo(` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/dock.tsx:55` `{text}` via leitura de text
- **Criação:** `src/editor/shell/dock.tsx:49` `const text = useMemo(`
- **Descarte:** quando o componente desmonta `src/editor/shell/dock.tsx:49` `const text = useMemo(`
- **Navegador:** não

## EST-L09a-077 — valor memoizado (useMemo/memo) — dock.tsx
- **Declaração:** `src/editor/shell/dock.tsx:83` `return useMemo(() => checksOf(document, manifest.interactions.checks).filter((issue) => CATEGORY_BUILT.get(issue.category) !== false), [document]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/dock.tsx:83` `return useMemo(() => checksOf(document, manifest.interactions.checks).filter((issue) => CATEGORY_BUILT.get(issue.category) !== false), [document]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/dock.tsx:83` `return useMemo(() => checksOf(document, manifest.interactions.checks).filter((issue) => CATEGORY_BUILT.get(issue.category) !== false), [document]);`
- **Escritores:**
  - `src/editor/shell/dock.tsx:83` `return useMemo(() => checksOf(document, manifest.interactions.checks).filter((issue) => CATEGORY_BUILT.get(issue.category) !== false), [document]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/dock.tsx:83` `return useMemo(() => checksOf(document, manifest.interactions.checks).filter((issue) => CATEGORY_BUILT.get(issue.category) !== false), [document]);` via a própria declaração
- **Criação:** `src/editor/shell/dock.tsx:83` `return useMemo(() => checksOf(document, manifest.interactions.checks).filter((issue) => CATEGORY_BUILT.get(issue.category) !== false), [document]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/dock.tsx:83` `return useMemo(() => checksOf(document, manifest.interactions.checks).filter((issue) => CATEGORY_BUILT.get(issue.category) !== false), [document]);`
- **Navegador:** não

## EST-L09a-078 — points — easing-curve.tsx
- **Declaração:** `src/editor/shell/easing-curve.tsx:79` `const [points, setPoints] = useState<readonly string[]>(() => pointsOf(value).map(written));`
- **Forma:** valor de estado do componente React (useState), gravado por setPoints
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/easing-curve.tsx:79` `const [points, setPoints] = useState<readonly string[]>(() => pointsOf(value).map(written));`
  - V2 o valor depois de setPoints `src/editor/shell/easing-curve.tsx:118` `setPoints(next);` via setPoints
- **Escritores:**
  - `src/editor/shell/easing-curve.tsx:118` `setPoints(next);` via setPoints
- **Leitores:**
  - `src/editor/shell/easing-curve.tsx:49` `return parsed?.points ?? EASING.parse('ease')?.points ?? [0.25, 0.1, 0.25, 1];` via leitura de points
  - `src/editor/shell/easing-curve.tsx:80` `cubic-bezier(${points.join(', ')})` via leitura de points
  - `src/editor/shell/easing-curve.tsx:113` `value={points[i]}` via leitura de points
- **Criação:** `src/editor/shell/easing-curve.tsx:79` `const [points, setPoints] = useState<readonly string[]>(() => pointsOf(value).map(written));`
- **Descarte:** quando o componente desmonta `src/editor/shell/easing-curve.tsx:79` `const [points, setPoints] = useState<readonly string[]>(() => pointsOf(value).map(written));`
- **Navegador:** não

## EST-L09a-079 — trigger — easing-curve.tsx
- **Declaração:** `src/editor/shell/easing-curve.tsx:55` `const trigger = useRef<HTMLButtonElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/easing-curve.tsx:55` `const trigger = useRef<HTMLButtonElement>(null);`
  - V2 o valor atribuído `src/editor/shell/easing-curve.tsx:59` `<button ref={trigger} type="button" className="easing-curve__button" aria-haspopup="dialog" aria-expanded={open} title={t('easing.edit', { field: label })} aria-label={t('easing.edit', { field: label })} disabled={disabled} onClick={() => setOpen((was) => !was)}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/easing-curve.tsx:59` `<button ref={trigger} type="button" className="easing-curve__button" aria-haspopup="dialog" aria-expanded={open} title={t('easing.edit', { field: label })} aria-label={t('easing.edit', { field: label })} disabled={disabled} onClick={() => setOpen((was) => !was)}>` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/easing-curve.tsx:55` `const trigger = useRef<HTMLButtonElement>(null);` via a própria declaração
- **Criação:** `src/editor/shell/easing-curve.tsx:55` `const trigger = useRef<HTMLButtonElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/easing-curve.tsx:55` `const trigger = useRef<HTMLButtonElement>(null);`
- **Navegador:** não

## EST-L09a-080 — path — easing-curve.tsx
- **Declaração:** `src/editor/shell/easing-curve.tsx:34` `const path = useMemo(() => curvePath(EASING.parse(text), size), [text, size]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/easing-curve.tsx:34` `const path = useMemo(() => curvePath(EASING.parse(text), size), [text, size]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/easing-curve.tsx:34` `const path = useMemo(() => curvePath(EASING.parse(text), size), [text, size]);`
- **Escritores:**
  - `src/editor/shell/easing-curve.tsx:34` `const path = useMemo(() => curvePath(EASING.parse(text), size), [text, size]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/easing-curve.tsx:41` `{path === null ? null : <path className="easing-curve__line" d={path} />}` via leitura de path
- **Criação:** `src/editor/shell/easing-curve.tsx:34` `const path = useMemo(() => curvePath(EASING.parse(text), size), [text, size]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/easing-curve.tsx:34` `const path = useMemo(() => curvePath(EASING.parse(text), size), [text, size]);`
- **Navegador:** não

## EST-L09a-081 — focused — field-origin.tsx
- **Declaração:** `src/editor/shell/field-origin.tsx:23` `const [focused, setFocused] = useState(() => focusInside(ref));`
- **Forma:** valor de estado do componente React (useState), gravado por setFocused
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/field-origin.tsx:23` `const [focused, setFocused] = useState(() => focusInside(ref));`
  - V2 o valor depois de setFocused `src/editor/shell/field-origin.tsx:25` `const update = () => setFocused(focusInside(ref));` via setFocused
- **Escritores:**
  - `src/editor/shell/field-origin.tsx:25` `const update = () => setFocused(focusInside(ref));` via setFocused
- **Leitores:**
  - `src/editor/shell/field-origin.tsx:33` `return focused;` via leitura de focused
  - `src/editor/shell/field-origin.tsx:58` `const focused = useFocusWithin(entry.ref);` via leitura de focused
  - `src/editor/shell/field-origin.tsx:85` `} data-origin={kind} data-field={entry.ref}>` via leitura de focused
- **Criação:** `src/editor/shell/field-origin.tsx:23` `const [focused, setFocused] = useState(() => focusInside(ref));`
- **Descarte:** quando o componente desmonta `src/editor/shell/field-origin.tsx:23` `const [focused, setFocused] = useState(() => focusInside(ref));`
- **Navegador:** não

## EST-L09a-082 — foco e elemento ativo em field-origin.tsx
- **Declaração:** `src/editor/shell/field-origin.tsx:21` `const focusInside = (ref: string) => document.activeElement instanceof Element && document.activeElement.closest(`
- **Forma:** estado do navegador: foco e elemento ativo do documento
- **Valores possíveis:**
  - V1 sem toque do painel: o foco/rolagem é o de antes da montagem `src/editor/shell/field-origin.tsx:21` `const focusInside = (ref: string) => document.activeElement instanceof Element && document.activeElement.closest(`
  - V2 tocado: o painel lê ou move o foco/rolagem
- **Escritores:**
  - `src/editor/shell/field-origin.tsx:21` `const focusInside = (ref: string) => document.activeElement instanceof Element && document.activeElement.closest(` via o próprio navegador
- **Leitores:**
  - `src/editor/shell/field-origin.tsx:21` `const focusInside = (ref: string) => document.activeElement instanceof Element && document.activeElement.closest(` via leitura do navegador
- **Criação:** `src/editor/shell/field-origin.tsx:21` `const focusInside = (ref: string) => document.activeElement instanceof Element && document.activeElement.closest(`
- **Descarte:** fim-da-página `src/editor/shell/field-origin.tsx:21` `const focusInside = (ref: string) => document.activeElement instanceof Element && document.activeElement.closest(`
- **Navegador:** foco

## EST-L09a-083 — STEP_CONTROLS — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:85` `const STEP_CONTROLS = new Set(['step-up', 'step-down']);`
- **Forma:** coleção compartilhada do módulo (Map/Set)
- **Valores possíveis:**
  - V1 preenchido na carga do módulo `src/editor/shell/field.tsx:85` `const STEP_CONTROLS = new Set(['step-up', 'step-down']);`
  - V2 lido enquanto a página viver `src/editor/shell/field.tsx:85` `const STEP_CONTROLS = new Set(['step-up', 'step-down']);`
- **Escritores:**
  - `src/editor/shell/field.tsx:85` `const STEP_CONTROLS = new Set(['step-up', 'step-down']);` via a carga do módulo
- **Leitores:**
  - `src/editor/shell/field.tsx:693` `{PARTS.filter((part) => part.door.kind === 'panel-control' && STEP_CONTROLS.has(part.door.control)).map((part) => (` via leitura da coleção
  - `src/editor/shell/field.tsx:714` `const resets = PARTS.filter((part) => !(part.door.kind === 'panel-control' && (part.door.control === 'unit-menu' || STEP_CONTROLS.has(part.door.control)))).map((part) => {` via leitura da coleção
- **Criação:** `src/editor/shell/field.tsx:85` `const STEP_CONTROLS = new Set(['step-up', 'step-down']);`
- **Descarte:** fim-da-página `src/editor/shell/field.tsx:85` `const STEP_CONTROLS = new Set(['step-up', 'step-down']);`
- **Navegador:** não

## EST-L09a-084 — PART_CONTROLS — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:86` `const PART_CONTROLS = new Set(['unit-menu', ...STEP_CONTROLS, 'property-reset']);`
- **Forma:** coleção compartilhada do módulo (Map/Set)
- **Valores possíveis:**
  - V1 preenchido na carga do módulo `src/editor/shell/field.tsx:86` `const PART_CONTROLS = new Set(['unit-menu', ...STEP_CONTROLS, 'property-reset']);`
  - V2 lido enquanto a página viver `src/editor/shell/field.tsx:86` `const PART_CONTROLS = new Set(['unit-menu', ...STEP_CONTROLS, 'property-reset']);`
- **Escritores:**
  - `src/editor/shell/field.tsx:86` `const PART_CONTROLS = new Set(['unit-menu', ...STEP_CONTROLS, 'property-reset']);` via a carga do módulo
- **Leitores:**
  - `src/editor/shell/field.tsx:87` `const PARTS = doorSlots('field').filter((p) => p.door.kind === 'panel-control' && PART_CONTROLS.has(p.door.control));` via leitura da coleção
- **Criação:** `src/editor/shell/field.tsx:86` `const PART_CONTROLS = new Set(['unit-menu', ...STEP_CONTROLS, 'property-reset']);`
- **Descarte:** fim-da-página `src/editor/shell/field.tsx:86` `const PART_CONTROLS = new Set(['unit-menu', ...STEP_CONTROLS, 'property-reset']);`
- **Navegador:** não

## EST-L09a-085 — SUBSETS — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:503` `const SUBSETS = new Map([...manifest.properties.properties, ...manifest.properties.composites].map((p) => [p.id, p.subsets] as const));`
- **Forma:** coleção compartilhada do módulo (Map/Set)
- **Valores possíveis:**
  - V1 preenchido na carga do módulo `src/editor/shell/field.tsx:503` `const SUBSETS = new Map([...manifest.properties.properties, ...manifest.properties.composites].map((p) => [p.id, p.subsets] as const));`
  - V2 lido enquanto a página viver `src/editor/shell/field.tsx:503` `const SUBSETS = new Map([...manifest.properties.properties, ...manifest.properties.composites].map((p) => [p.id, p.subsets] as const));`
- **Escritores:**
  - `src/editor/shell/field.tsx:503` `const SUBSETS = new Map([...manifest.properties.properties, ...manifest.properties.composites].map((p) => [p.id, p.subsets] as const));` via a carga do módulo
- **Leitores:**
  - `src/editor/shell/field.tsx:507` `return SUBSETS.get(offers.property)?.find((s) => s.id === offers.presets)?.values ?? [];` via leitura da coleção
  - `src/editor/shell/field.tsx:516` `return SUBSETS.get(offers.property)?.find((s) => s.id === offers.essentials)?.values ?? null;` via leitura da coleção
- **Criação:** `src/editor/shell/field.tsx:503` `const SUBSETS = new Map([...manifest.properties.properties, ...manifest.properties.composites].map((p) => [p.id, p.subsets] as const));`
- **Descarte:** fim-da-página `src/editor/shell/field.tsx:503` `const SUBSETS = new Map([...manifest.properties.properties, ...manifest.properties.composites].map((p) => [p.id, p.subsets] as const));`
- **Navegador:** não

## EST-L09a-086 — INSPECTOR_SLIDERS — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:795` `const INSPECTOR_SLIDERS = new Map<string, SliderRange>(manifest.doors.flatMap((d) => (d.door.kind === 'inspector-field' && d.door.property !== null && d.door.slider !== undefined && d.door.slider !== null ? [[d.door.property, d.door.slider] as const] : [])));`
- **Forma:** coleção compartilhada do módulo (Map/Set)
- **Valores possíveis:**
  - V1 preenchido na carga do módulo `src/editor/shell/field.tsx:795` `const INSPECTOR_SLIDERS = new Map<string, SliderRange>(manifest.doors.flatMap((d) => (d.door.kind === 'inspector-field' && d.door.property !== null && d.door.slider !== undefined && d.door.slider !== null ? [[d.door.property, d.door.slider] as const] : [])));`
  - V2 lido enquanto a página viver `src/editor/shell/field.tsx:795` `const INSPECTOR_SLIDERS = new Map<string, SliderRange>(manifest.doors.flatMap((d) => (d.door.kind === 'inspector-field' && d.door.property !== null && d.door.slider !== undefined && d.door.slider !== null ? [[d.door.property, d.door.slider] as const] : [])));`
- **Escritores:**
  - `src/editor/shell/field.tsx:795` `const INSPECTOR_SLIDERS = new Map<string, SliderRange>(manifest.doors.flatMap((d) => (d.door.kind === 'inspector-field' && d.door.property !== null && d.door.slider !== undefined && d.door.slider !== null ? [[d.door.property, d.door.slider] as const] : [])));` via a carga do módulo
- **Leitores:**
  - `src/editor/shell/field.tsx:1000` `const readRange = sliderRange ?? INSPECTOR_SLIDERS.get(property);` via leitura da coleção
- **Criação:** `src/editor/shell/field.tsx:795` `const INSPECTOR_SLIDERS = new Map<string, SliderRange>(manifest.doors.flatMap((d) => (d.door.kind === 'inspector-field' && d.door.property !== null && d.door.slider !== undefined && d.door.slider !== null ? [[d.door.property, d.door.slider] as const] : [])));`
- **Descarte:** fim-da-página `src/editor/shell/field.tsx:795` `const INSPECTOR_SLIDERS = new Map<string, SliderRange>(manifest.doors.flatMap((d) => (d.door.kind === 'inspector-field' && d.door.property !== null && d.door.slider !== undefined && d.door.slider !== null ? [[d.door.property, d.door.slider] as const] : [])));`
- **Navegador:** não

## EST-L09a-087 — at — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:97` `const [at, setAt] = useState<Placed | null>(null);`
- **Forma:** valor de estado do componente React (useState), gravado por setAt
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/field.tsx:97` `const [at, setAt] = useState<Placed | null>(null);`
  - V2 o valor depois de setAt `src/editor/shell/field.tsx:105` `setAt(floatBelow(from, { width, height }, { width: window.innerWidth, height: window.innerHeight }, edge));` via setAt
- **Escritores:**
  - `src/editor/shell/field.tsx:105` `setAt(floatBelow(from, { width, height }, { width: window.innerWidth, height: window.innerHeight }, edge));` via setAt
- **Leitores:**
  - `src/editor/shell/field.tsx:109` `const style: CSSProperties = at === null ? { opacity: 0, left: 0, top: 0 } : { left: at.left, top: at.top };` via leitura de at
- **Criação:** `src/editor/shell/field.tsx:97` `const [at, setAt] = useState<Placed | null>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:97` `const [at, setAt] = useState<Placed | null>(null);`
- **Navegador:** não

## EST-L09a-088 — read — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:145` `const [read, setRead] = useState<{ readonly node: NodeId; readonly values: Readonly<Record<string, string>> | null } | null>(null);`
- **Forma:** valor de estado do componente React (useState), gravado por setRead
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/field.tsx:145` `const [read, setRead] = useState<{ readonly node: NodeId; readonly values: Readonly<Record<string, string>> | null } | null>(null);`
  - V2 o valor depois de setRead `src/editor/shell/field.tsx:155` `setRead({ node, values });` via setRead
- **Escritores:**
  - `src/editor/shell/field.tsx:155` `setRead({ node, values });` via setRead
  - `src/editor/shell/field.tsx:252` `setRead({ selection, text });` via setRead
  - `src/editor/shell/field.tsx:1496` `setRead({ ids, contexts });` via setRead
- **Leitores:**
  - `src/editor/shell/field.tsx:166` `return read !== null && read.node === node ? read.values : null;` via leitura de read
  - `src/editor/shell/field.tsx:265` `const page = read !== null && read.selection === selection ? (JSON.parse(read.text) as (Record<string, string> | null)[]) : [];` via leitura de read
  - `src/editor/shell/field.tsx:364` `const value = codec?.read(text, { units: offered?.units ?? [], keywords: offered?.keywords ?? [], defaultUnit: DEFAULT_UNIT }) ?? null;` via leitura de read
- **Criação:** `src/editor/shell/field.tsx:145` `const [read, setRead] = useState<{ readonly node: NodeId; readonly values: Readonly<Record<string, string>> | null } | null>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:145` `const [read, setRead] = useState<{ readonly node: NodeId; readonly values: Readonly<Record<string, string>> | null } | null>(null);`
- **Navegador:** não

## EST-L09a-089 — dismissed — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:180` `const [dismissed, setDismissed] = useState<unknown>(null);`
- **Forma:** valor de estado do componente React (useState), gravado por setDismissed
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/field.tsx:180` `const [dismissed, setDismissed] = useState<unknown>(null);`
  - V2 o valor depois de setDismissed `src/editor/shell/field.tsx:184` `return { text, dismiss: () => setDismissed(refusal) };` via setDismissed
- **Escritores:**
  - `src/editor/shell/field.tsx:184` `return { text, dismiss: () => setDismissed(refusal) };` via setDismissed
- **Leitores:**
  - `src/editor/shell/field.tsx:181` `if (refusal === null || refusal === dismissed) return { text: null, dismiss: () => undefined };` via leitura de dismissed
- **Criação:** `src/editor/shell/field.tsx:180` `const [dismissed, setDismissed] = useState<unknown>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:180` `const [dismissed, setDismissed] = useState<unknown>(null);`
- **Navegador:** não

## EST-L09a-090 — read — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:241` `const [read, setRead] = useState<{ readonly selection: readonly NodeId[]; readonly text: string } | null>(null);`
- **Forma:** valor de estado do componente React (useState), gravado por setRead
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/field.tsx:241` `const [read, setRead] = useState<{ readonly selection: readonly NodeId[]; readonly text: string } | null>(null);`
  - V2 o valor depois de setRead `src/editor/shell/field.tsx:155` `setRead({ node, values });` via setRead
- **Escritores:**
  - `src/editor/shell/field.tsx:155` `setRead({ node, values });` via setRead
  - `src/editor/shell/field.tsx:252` `setRead({ selection, text });` via setRead
  - `src/editor/shell/field.tsx:1496` `setRead({ ids, contexts });` via setRead
- **Leitores:**
  - `src/editor/shell/field.tsx:166` `return read !== null && read.node === node ? read.values : null;` via leitura de read
  - `src/editor/shell/field.tsx:265` `const page = read !== null && read.selection === selection ? (JSON.parse(read.text) as (Record<string, string> | null)[]) : [];` via leitura de read
  - `src/editor/shell/field.tsx:364` `const value = codec?.read(text, { units: offered?.units ?? [], keywords: offered?.keywords ?? [], defaultUnit: DEFAULT_UNIT }) ?? null;` via leitura de read
- **Criação:** `src/editor/shell/field.tsx:241` `const [read, setRead] = useState<{ readonly selection: readonly NodeId[]; readonly text: string } | null>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:241` `const [read, setRead] = useState<{ readonly selection: readonly NodeId[]; readonly text: string } | null>(null);`
- **Navegador:** não

## EST-L09a-091 — expanded — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:403` `const [expanded, setExpanded] = useState(false);`
- **Forma:** valor de estado do componente React (useState), gravado por setExpanded
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/field.tsx:403` `const [expanded, setExpanded] = useState(false);`
  - V2 o valor depois de setExpanded `src/editor/shell/field.tsx:489` `onClick={() => setExpanded(!expanded)}` via setExpanded
- **Escritores:**
  - `src/editor/shell/field.tsx:489` `onClick={() => setExpanded(!expanded)}` via setExpanded
- **Leitores:**
  - `src/editor/shell/field.tsx:408` `const shownUnits = expanded ? [...menu.common, ...menu.more] : menu.common;` via leitura de expanded
  - `src/editor/shell/field.tsx:427` `aria-expanded={layer.open}` via leitura de expanded
  - `src/editor/shell/field.tsx:488` `aria-label={t(expanded ? 'field.unit.fewer' : 'field.unit.more')}` via leitura de expanded
- **Criação:** `src/editor/shell/field.tsx:403` `const [expanded, setExpanded] = useState(false);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:403` `const [expanded, setExpanded] = useState(false);`
- **Navegador:** não

## EST-L09a-092 — moreValues — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:873` `const [moreValues, setMoreValues] = useState(false);`
- **Forma:** valor de estado do componente React (useState), gravado por setMoreValues
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/field.tsx:873` `const [moreValues, setMoreValues] = useState(false);`
  - V2 o valor depois de setMoreValues `src/editor/shell/field.tsx:900` `<button type="button" role="menuitem" tabIndex={-1} className="menu__item" data-menu-more="" aria-label={t(moreValues ? 'field.values.fewer' : 'field.values.more')} onClick={() => setMoreValues(!moreValues)}>` via setMoreValues
- **Escritores:**
  - `src/editor/shell/field.tsx:900` `<button type="button" role="menuitem" tabIndex={-1} className="menu__item" data-menu-more="" aria-label={t(moreValues ? 'field.values.fewer' : 'field.values.more')} onClick={() => setMoreValues(!moreValues)}>` via setMoreValues
- **Leitores:**
  - `src/editor/shell/field.tsx:875` `const menuValues = first === null ? suggestions : [...first.filter((v) => suggestions.includes(v)), ...(moreValues && !essentialsMode ? suggestions.filter((v) => !first.includes(v)) : [])];` via leitura de moreValues
  - `src/editor/shell/field.tsx:901` `<span className="menu__icon">{moreValues ? <Icon name={GLYPHS.collapsed} size="sm" /> : null}</span>` via leitura de moreValues
  - `src/editor/shell/field.tsx:902` `<span className="menu__label">{t(moreValues ? 'field.values.fewer' : 'field.values.more')}</span>` via leitura de moreValues
- **Criação:** `src/editor/shell/field.tsx:873` `const [moreValues, setMoreValues] = useState(false);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:873` `const [moreValues, setMoreValues] = useState(false);`
- **Navegador:** não

## EST-L09a-093 — fits — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1399` `const [fits, setFits] = useState(false);`
- **Forma:** valor de estado do componente React (useState), gravado por setFits
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/field.tsx:1399` `const [fits, setFits] = useState(false);`
  - V2 o valor depois de setFits `src/editor/shell/field.tsx:1410` `setFits(available > 0 && needed > 0 && needed <= available + 0.5);` via setFits
- **Escritores:**
  - `src/editor/shell/field.tsx:1410` `setFits(available > 0 && needed > 0 && needed <= available + 0.5);` via setFits
- **Leitores:**
  - `src/editor/shell/field.tsx:1276` `const fits = useFits(room, measure, worded);` via leitura de fits
  - `src/editor/shell/field.tsx:1294` `if (!fits) {` via leitura de fits
  - `src/editor/shell/field.tsx:1417` `return !worded || fits;` via leitura de fits
- **Criação:** `src/editor/shell/field.tsx:1399` `const [fits, setFits] = useState(false);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1399` `const [fits, setFits] = useState(false);`
- **Navegador:** não

## EST-L09a-094 — read — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1473` `const [read, setRead] = useState<{ readonly ids: string; readonly contexts: readonly ElementContext[] } | null>(null);`
- **Forma:** valor de estado do componente React (useState), gravado por setRead
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/field.tsx:1473` `const [read, setRead] = useState<{ readonly ids: string; readonly contexts: readonly ElementContext[] } | null>(null);`
  - V2 o valor depois de setRead `src/editor/shell/field.tsx:155` `setRead({ node, values });` via setRead
- **Escritores:**
  - `src/editor/shell/field.tsx:155` `setRead({ node, values });` via setRead
  - `src/editor/shell/field.tsx:252` `setRead({ selection, text });` via setRead
  - `src/editor/shell/field.tsx:1496` `setRead({ ids, contexts });` via setRead
- **Leitores:**
  - `src/editor/shell/field.tsx:166` `return read !== null && read.node === node ? read.values : null;` via leitura de read
  - `src/editor/shell/field.tsx:265` `const page = read !== null && read.selection === selection ? (JSON.parse(read.text) as (Record<string, string> | null)[]) : [];` via leitura de read
  - `src/editor/shell/field.tsx:364` `const value = codec?.read(text, { units: offered?.units ?? [], keywords: offered?.keywords ?? [], defaultUnit: DEFAULT_UNIT }) ?? null;` via leitura de read
- **Criação:** `src/editor/shell/field.tsx:1473` `const [read, setRead] = useState<{ readonly ids: string; readonly contexts: readonly ElementContext[] } | null>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1473` `const [read, setRead] = useState<{ readonly ids: string; readonly contexts: readonly ElementContext[] } | null>(null);`
- **Navegador:** não

## EST-L09a-095 — typed — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1723` `const [typed, setTyped] = useState(stored);`
- **Forma:** valor de estado do componente React (useState), gravado por setTyped
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/field.tsx:1723` `const [typed, setTyped] = useState(stored);`
  - V2 o valor depois de setTyped `src/editor/shell/field.tsx:1741` `setTyped(stored);` via setTyped
- **Escritores:**
  - `src/editor/shell/field.tsx:1741` `setTyped(stored);` via setTyped
  - `src/editor/shell/field.tsx:1744` `setTyped(element.value);` via setTyped
  - `src/editor/shell/field.tsx:1800` `setTyped(value);` via setTyped
- **Leitores:**
  - `src/editor/shell/field.tsx:588` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });` via leitura de typed
  - `src/editor/shell/field.tsx:611` `const said = useEditorState((s) => (draft.current.typed && s.message !== draft.current.message ? s.message ?? CLEARED_MESSAGE : null));` via leitura de typed
  - `src/editor/shell/field.tsx:624` `draft.current.typed = false;` via leitura de typed
- **Criação:** `src/editor/shell/field.tsx:1723` `const [typed, setTyped] = useState(stored);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1723` `const [typed, setTyped] = useState(stored);`
- **Navegador:** não

## EST-L09a-096 — button — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:317` `const button = useRef<HTMLButtonElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:317` `const button = useRef<HTMLButtonElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:329` `ref={button}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:329` `ref={button}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:320` `const element = button.current;` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:317` `const button = useRef<HTMLButtonElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:317` `const button = useRef<HTMLButtonElement>(null);`
- **Navegador:** não

## EST-L09a-097 — unitButton — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:399` `const unitButton = useRef<HTMLButtonElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:399` `const unitButton = useRef<HTMLButtonElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:421` `ref={unitButton}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:421` `ref={unitButton}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:399` `const unitButton = useRef<HTMLButtonElement>(null);` via a própria declaração
- **Criação:** `src/editor/shell/field.tsx:399` `const unitButton = useRef<HTMLButtonElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:399` `const unitButton = useRef<HTMLButtonElement>(null);`
- **Navegador:** não

## EST-L09a-098 — unitList — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:400` `const unitList = useRef<HTMLDivElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:400` `const unitList = useRef<HTMLDivElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:443` `unitList.current = element;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:443` `unitList.current = element;` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:400` `const unitList = useRef<HTMLDivElement>(null);` via a própria declaração
- **Criação:** `src/editor/shell/field.tsx:400` `const unitList = useRef<HTMLDivElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:400` `const unitList = useRef<HTMLDivElement>(null);`
- **Navegador:** não

## EST-L09a-099 — list — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:405` `const list = useRef<HTMLDivElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:405` `const list = useRef<HTMLDivElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:111` `<div id={id} className="menu field__menu field__menu--floating" role="menu" tabIndex={-1} ref={list} aria-label={label} data-key-context="menu" style={style}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:111` `<div id={id} className="menu field__menu field__menu--floating" role="menu" tabIndex={-1} ref={list} aria-label={label} data-key-context="menu" style={style}>` via a atribuição da referência
  - `src/editor/shell/field.tsx:442` `<div className="menu field__menu" role="menu" tabIndex={-1} ref={(element) => { list.current = element;` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:100` `const panel = list.current;` via leitura da referência
  - `src/editor/shell/field.tsx:411` `if (open) list.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus();` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:405` `const list = useRef<HTMLDivElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:405` `const list = useRef<HTMLDivElement>(null);`
- **Navegador:** não

## EST-L09a-100 — draft — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:588` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:588` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
  - V2 o valor atribuído `src/editor/shell/field.tsx:588` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });` via o valor inicial da declaração
- **Escritores:**
  - `src/editor/shell/field.tsx:588` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });` via o valor inicial da declaração
- **Leitores:**
  - `src/editor/shell/field.tsx:611` `const said = useEditorState((s) => (draft.current.typed && s.message !== draft.current.message ? s.message ?? CLEARED_MESSAGE : null));` via leitura da referência
  - `src/editor/shell/field.tsx:624` `draft.current.typed = false;` via leitura da referência
  - `src/editor/shell/field.tsx:628` `draft.current.message = store.getState().message;` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:588` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:588` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
- **Navegador:** não

## EST-L09a-101 — hold — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:589` `const hold = useRef<() => void>(() => undefined);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:589` `const hold = useRef<() => void>(() => undefined);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:645` `hold.current = () => {` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:645` `hold.current = () => {` via a atribuição da referência
  - `src/editor/shell/field.tsx:1062` `hold.current = () => {` via a atribuição da referência
  - `src/editor/shell/field.tsx:1577` `hold.current = () => {` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:630` `if (draft.current.typed) hold.current();` via leitura da referência
  - `src/editor/shell/field.tsx:655` `if (typing.typed) hold.current();` via leitura da referência
  - `src/editor/shell/field.tsx:1044` `if (draft.current.typed) hold.current();` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:589` `const hold = useRef<() => void>(() => undefined);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:589` `const hold = useRef<() => void>(() => undefined);`
- **Navegador:** não

## EST-L09a-102 — input — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:613` `const input = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:613` `const input = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:689` `<input ref={input} className="input" role="spinbutton" disabled={!available} aria-label={label} inputMode="decimal" spellCheck={false} data-key-context={NUMBER_FIELD_CONTEXT} placeholder={mixed ? t('inspector.mixedValue') : effective || undefined} aria-invalid={refused.text !== null ? true : undefined} onInput={refused.dismiss} />` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:689` `<input ref={input} className="input" role="spinbutton" disabled={!available} aria-label={label} inputMode="decimal" spellCheck={false} data-key-context={NUMBER_FIELD_CONTEXT} placeholder={mixed ? t('inspector.mixedValue') : effective || undefined} aria-invalid={refused.text !== null ? true : undefined} onInput={refused.dismiss} />` via a atribuição da referência
  - `src/editor/shell/field.tsx:1154` `<input ref={input} className="input" disabled={!available} aria-label={label} spellCheck={false} data-key-context={COMMAND_FIELD_CONTEXT} placeholder={placeholder} aria-invalid={refused.text !== null ? true : undefined} onInput={refused.dismiss} />` via a atribuição da referência
  - `src/editor/shell/field.tsx:1157` `<input key="input" ref={input} className="input" disabled={!available} aria-label={label} spellCheck={false} list={listed.length > 0 ? listId : undefined} data-key-context={NUMBER_FIELD_CONTEXT} placeholder={placeholder} aria-invalid={refused.text !== null ? true : undefined} onInput={refused.dismiss} />` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:124` `const element = input.current;` via leitura da referência
  - `src/editor/shell/field.tsx:324` `(store.dispatch as Dispatch)(entry.command.id, { ...entry.door.args, property, value: input.current?.value ?? '', ...held });` via leitura da referência
  - `src/editor/shell/field.tsx:415` `(store.dispatch as Dispatch)(entry.command.id, { ...entry.door.args, property, value: input.current?.value || shown, unit });` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:613` `const input = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:613` `const input = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-103 — cellRef — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:673` `const cellRef = useRef<HTMLSpanElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:673` `const cellRef = useRef<HTMLSpanElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:686` `<span ref={cellRef} className="input-wrap input-wrap--number" data-face="" data-origin={appearance.kind}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:686` `<span ref={cellRef} className="input-wrap input-wrap--number" data-face="" data-origin={appearance.kind}>` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:673` `const cellRef = useRef<HTMLSpanElement>(null);` via a própria declaração
- **Criação:** `src/editor/shell/field.tsx:673` `const cellRef = useRef<HTMLSpanElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:673` `const cellRef = useRef<HTMLSpanElement>(null);`
- **Navegador:** não

## EST-L09a-104 — sliderInput — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:810` `const sliderInput = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:810` `const sliderInput = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:836` `ref={sliderInput}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:836` `ref={sliderInput}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:815` `const element = sliderInput.current;` via leitura da referência
  - `src/editor/shell/field.tsx:823` `const element = sliderInput.current;` via leitura da referência
  - `src/editor/shell/field.tsx:830` `const element = sliderInput.current;` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:810` `const sliderInput = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:810` `const sliderInput = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-105 — slidUnit — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:812` `const slidUnit = useRef('');`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:812` `const slidUnit = useRef('');`
  - V2 o valor atribuído `src/editor/shell/field.tsx:817` `slidUnit.current = slid === null ? range.unit : slid.unit;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:817` `slidUnit.current = slid === null ? range.unit : slid.unit;` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:827` `${element.value}${slidUnit.current}` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:812` `const slidUnit = useRef('');`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:812` `const slidUnit = useRef('');`
- **Navegador:** não

## EST-L09a-106 — draft — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:966` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:966` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
  - V2 o valor atribuído `src/editor/shell/field.tsx:966` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });` via o valor inicial da declaração
- **Escritores:**
  - `src/editor/shell/field.tsx:966` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });` via o valor inicial da declaração
- **Leitores:**
  - `src/editor/shell/field.tsx:611` `const said = useEditorState((s) => (draft.current.typed && s.message !== draft.current.message ? s.message ?? CLEARED_MESSAGE : null));` via leitura da referência
  - `src/editor/shell/field.tsx:624` `draft.current.typed = false;` via leitura da referência
  - `src/editor/shell/field.tsx:628` `draft.current.message = store.getState().message;` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:966` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:966` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
- **Navegador:** não

## EST-L09a-107 — hold — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:967` `const hold = useRef<() => void>(() => undefined);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:967` `const hold = useRef<() => void>(() => undefined);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:645` `hold.current = () => {` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:645` `hold.current = () => {` via a atribuição da referência
  - `src/editor/shell/field.tsx:1062` `hold.current = () => {` via a atribuição da referência
  - `src/editor/shell/field.tsx:1577` `hold.current = () => {` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:630` `if (draft.current.typed) hold.current();` via leitura da referência
  - `src/editor/shell/field.tsx:655` `if (typing.typed) hold.current();` via leitura da referência
  - `src/editor/shell/field.tsx:1044` `if (draft.current.typed) hold.current();` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:967` `const hold = useRef<() => void>(() => undefined);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:967` `const hold = useRef<() => void>(() => undefined);`
- **Navegador:** não

## EST-L09a-108 — keepText — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:975` `const keepText = useRef<(text: string, targets: readonly string[], context?: EditContext) => void>(() => undefined);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:975` `const keepText = useRef<(text: string, targets: readonly string[], context?: EditContext) => void>(() => undefined);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:977` `keepText.current = (text: string, targets: readonly string[], context?: EditContext) => {` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:977` `keepText.current = (text: string, targets: readonly string[], context?: EditContext) => {` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:1060` `keepText.current(element.value, typing.targets, typing.context);` via leitura da referência
  - `src/editor/shell/field.tsx:1125` `keepText.current(element.value, draft.current.targets, draft.current.context);` via leitura da referência
  - `src/editor/shell/field.tsx:1134` `keepText.current(value, store.getState().selection);` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:975` `const keepText = useRef<(text: string, targets: readonly string[], context?: EditContext) => void>(() => undefined);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:975` `const keepText = useRef<(text: string, targets: readonly string[], context?: EditContext) => void>(() => undefined);`
- **Navegador:** não

## EST-L09a-109 — input — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:994` `const input = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:994` `const input = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:689` `<input ref={input} className="input" role="spinbutton" disabled={!available} aria-label={label} inputMode="decimal" spellCheck={false} data-key-context={NUMBER_FIELD_CONTEXT} placeholder={mixed ? t('inspector.mixedValue') : effective || undefined} aria-invalid={refused.text !== null ? true : undefined} onInput={refused.dismiss} />` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:689` `<input ref={input} className="input" role="spinbutton" disabled={!available} aria-label={label} inputMode="decimal" spellCheck={false} data-key-context={NUMBER_FIELD_CONTEXT} placeholder={mixed ? t('inspector.mixedValue') : effective || undefined} aria-invalid={refused.text !== null ? true : undefined} onInput={refused.dismiss} />` via a atribuição da referência
  - `src/editor/shell/field.tsx:1154` `<input ref={input} className="input" disabled={!available} aria-label={label} spellCheck={false} data-key-context={COMMAND_FIELD_CONTEXT} placeholder={placeholder} aria-invalid={refused.text !== null ? true : undefined} onInput={refused.dismiss} />` via a atribuição da referência
  - `src/editor/shell/field.tsx:1157` `<input key="input" ref={input} className="input" disabled={!available} aria-label={label} spellCheck={false} list={listed.length > 0 ? listId : undefined} data-key-context={NUMBER_FIELD_CONTEXT} placeholder={placeholder} aria-invalid={refused.text !== null ? true : undefined} onInput={refused.dismiss} />` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:124` `const element = input.current;` via leitura da referência
  - `src/editor/shell/field.tsx:324` `(store.dispatch as Dispatch)(entry.command.id, { ...entry.door.args, property, value: input.current?.value ?? '', ...held });` via leitura da referência
  - `src/editor/shell/field.tsx:415` `(store.dispatch as Dispatch)(entry.command.id, { ...entry.door.args, property, value: input.current?.value || shown, unit });` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:994` `const input = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:994` `const input = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-110 — valueScope — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1003` `const valueScope = useRef<HTMLSpanElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1003` `const valueScope = useRef<HTMLSpanElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1141` `<span ref={valueScope} className="input-wrap" data-face="" data-origin={appearance.kind}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:1141` `<span ref={valueScope} className="input-wrap" data-face="" data-origin={appearance.kind}>` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:1079` `const scope = valueScope.current;` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1003` `const valueScope = useRef<HTMLSpanElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1003` `const valueScope = useRef<HTMLSpanElement>(null);`
- **Navegador:** não

## EST-L09a-111 — keepPending — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1004` `const keepPending = useRef<() => void>(() => {});`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1004` `const keepPending = useRef<() => void>(() => {});`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1078` `keepPending.current = keep;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:1078` `keepPending.current = keep;` via a atribuição da referência
  - `src/editor/shell/field.tsx:1109` `keepPending.current = () => {};` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:1008` `const valuesLayer = useMenuLayer(valuesButton, valuesList, undefined, { onOutside: () => keepPending.current(), returnFocus: input });` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1004` `const keepPending = useRef<() => void>(() => {});`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1004` `const keepPending = useRef<() => void>(() => {});`
- **Navegador:** não

## EST-L09a-112 — valuesButton — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1005` `const valuesButton = useRef<HTMLButtonElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1005` `const valuesButton = useRef<HTMLButtonElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1173` `ref={valuesButton}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:1173` `ref={valuesButton}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:1080` `const inside = (target: EventTarget | null) => target === element || target === valuesButton.current || (target instanceof Node && valuesList.current?.contains(target) === true);` via leitura da referência
  - `src/editor/shell/field.tsx:1095` `if (inside(next) && !(next === valuesButton.current && !pointerViews(store).pointerPressing())) return;` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1005` `const valuesButton = useRef<HTMLButtonElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1005` `const valuesButton = useRef<HTMLButtonElement>(null);`
- **Navegador:** não

## EST-L09a-113 — valuesList — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1006` `const valuesList = useRef<HTMLDivElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1006` `const valuesList = useRef<HTMLDivElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1006` `const valuesList = useRef<HTMLDivElement>(null);` via o valor inicial da declaração
- **Escritores:**
  - `src/editor/shell/field.tsx:1006` `const valuesList = useRef<HTMLDivElement>(null);` via o valor inicial da declaração
- **Leitores:**
  - `src/editor/shell/field.tsx:1080` `const inside = (target: EventTarget | null) => target === element || target === valuesButton.current || (target instanceof Node && valuesList.current?.contains(target) === true);` via leitura da referência
  - `src/editor/shell/field.tsx:1102` `if (from instanceof Node && (scope?.contains(from) === true || valuesList.current?.contains(from) === true)) leave(event);` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1006` `const valuesList = useRef<HTMLDivElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1006` `const valuesList = useRef<HTMLDivElement>(null);`
- **Navegador:** não

## EST-L09a-114 — closeValues — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1009` `const closeValues = useRef(valuesLayer.close);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1009` `const closeValues = useRef(valuesLayer.close);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1011` `closeValues.current = valuesLayer.close;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:1011` `closeValues.current = valuesLayer.close;` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:1083` `closeValues.current();` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1009` `const closeValues = useRef(valuesLayer.close);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1009` `const closeValues = useRef(valuesLayer.close);`
- **Navegador:** não

## EST-L09a-115 — room — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1272` `const room = useRef<HTMLSpanElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1272` `const room = useRef<HTMLSpanElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1301` `<span ref={room} className="field-choice field-choice--menu menu-anchor">` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:1301` `<span ref={room} className="field-choice field-choice--menu menu-anchor">` via a atribuição da referência
  - `src/editor/shell/field.tsx:1357` `<span ref={room} className="field-choice">` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:1401` `const cell = room.current?.parentElement ?? null;` via leitura da referência
  - `src/editor/shell/field.tsx:1405` `const own = room.current;` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1272` `const room = useRef<HTMLSpanElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1272` `const room = useRef<HTMLSpanElement>(null);`
- **Navegador:** não

## EST-L09a-116 — measure — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1273` `const measure = useRef<HTMLSpanElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1273` `const measure = useRef<HTMLSpanElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1284` `<span ref={measure} className="segmented segmented--values field-choice__measure">` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:1284` `<span ref={measure} className="segmented segmented--values field-choice__measure">` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:1404` `const copy = measure.current;` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1273` `const measure = useRef<HTMLSpanElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1273` `const measure = useRef<HTMLSpanElement>(null);`
- **Navegador:** não

## EST-L09a-117 — menuButton — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1277` `const menuButton = useRef<HTMLButtonElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1277` `const menuButton = useRef<HTMLButtonElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1304` `ref={menuButton}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:1304` `ref={menuButton}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:1337` `menuButton.current?.focus();` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1277` `const menuButton = useRef<HTMLButtonElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1277` `const menuButton = useRef<HTMLButtonElement>(null);`
- **Navegador:** não

## EST-L09a-118 — menuList — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1278` `const menuList = useRef<HTMLDivElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1278` `const menuList = useRef<HTMLDivElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1324` `<div className="menu field__menu" role="menu" tabIndex={-1} ref={menuList} aria-label={label} data-key-context="menu">` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:1324` `<div className="menu field__menu" role="menu" tabIndex={-1} ref={menuList} aria-label={label} data-key-context="menu">` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:1278` `const menuList = useRef<HTMLDivElement>(null);` via a própria declaração
- **Criação:** `src/editor/shell/field.tsx:1278` `const menuList = useRef<HTMLDivElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1278` `const menuList = useRef<HTMLDivElement>(null);`
- **Navegador:** não

## EST-L09a-119 — draft — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1538` `const draft = useRef<{ typed: boolean; message: EditorState['message'] }>({ typed: false, message: store.getState().message });`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1538` `const draft = useRef<{ typed: boolean; message: EditorState['message'] }>({ typed: false, message: store.getState().message });`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1538` `const draft = useRef<{ typed: boolean; message: EditorState['message'] }>({ typed: false, message: store.getState().message });` via o valor inicial da declaração
- **Escritores:**
  - `src/editor/shell/field.tsx:1538` `const draft = useRef<{ typed: boolean; message: EditorState['message'] }>({ typed: false, message: store.getState().message });` via o valor inicial da declaração
- **Leitores:**
  - `src/editor/shell/field.tsx:611` `const said = useEditorState((s) => (draft.current.typed && s.message !== draft.current.message ? s.message ?? CLEARED_MESSAGE : null));` via leitura da referência
  - `src/editor/shell/field.tsx:624` `draft.current.typed = false;` via leitura da referência
  - `src/editor/shell/field.tsx:628` `draft.current.message = store.getState().message;` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1538` `const draft = useRef<{ typed: boolean; message: EditorState['message'] }>({ typed: false, message: store.getState().message });`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1538` `const draft = useRef<{ typed: boolean; message: EditorState['message'] }>({ typed: false, message: store.getState().message });`
- **Navegador:** não

## EST-L09a-120 — hold — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1539` `const hold = useRef<() => void>(() => undefined);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1539` `const hold = useRef<() => void>(() => undefined);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:645` `hold.current = () => {` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:645` `hold.current = () => {` via a atribuição da referência
  - `src/editor/shell/field.tsx:1062` `hold.current = () => {` via a atribuição da referência
  - `src/editor/shell/field.tsx:1577` `hold.current = () => {` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:630` `if (draft.current.typed) hold.current();` via leitura da referência
  - `src/editor/shell/field.tsx:655` `if (typing.typed) hold.current();` via leitura da referência
  - `src/editor/shell/field.tsx:1044` `if (draft.current.typed) hold.current();` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1539` `const hold = useRef<() => void>(() => undefined);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1539` `const hold = useRef<() => void>(() => undefined);`
- **Navegador:** não

## EST-L09a-121 — field — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1541` `const field = useRef<HTMLTextAreaElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1541` `const field = useRef<HTMLTextAreaElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1604` `<textarea ref={field} className="input input--area" rows={3} disabled={!door.available} aria-label={label} spellCheck={false} data-key-context={TEXT_FIELD_CONTEXT} />` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:1604` `<textarea ref={field} className="input input--area" rows={3} disabled={!door.available} aria-label={label} spellCheck={false} data-key-context={TEXT_FIELD_CONTEXT} />` via a atribuição da referência
  - `src/editor/shell/field.tsx:1797` `if (field.current === null) return;` via a atribuição da referência
  - `src/editor/shell/field.tsx:1811` `<textarea ref={field} className="input input--area" rows={4} disabled={!door.available} aria-label={label} aria-invalid={refused.text !== null} spellCheck={false} onInput={(event) => { setTyped(event.currentTarget.value);` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:1549` `const element = field.current;` via leitura da referência
  - `src/editor/shell/field.tsx:1562` `const element = field.current;` via leitura da referência
  - `src/editor/shell/field.tsx:1735` `const element = field.current;` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1541` `const field = useRef<HTMLTextAreaElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1541` `const field = useRef<HTMLTextAreaElement>(null);`
- **Navegador:** não

## EST-L09a-122 — form — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1718` `const form = useRef<HTMLFormElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1718` `const form = useRef<HTMLFormElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1808` `field-row${door.available ? '' : ' is-unavailable'}${refused.text !== null ? ' is-invalid' : ''}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:1808` `field-row${door.available ? '' : ' is-unavailable'}${refused.text !== null ? ' is-invalid' : ''}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:1753` `const row = form.current;` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1718` `const form = useRef<HTMLFormElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1718` `const form = useRef<HTMLFormElement>(null);`
- **Navegador:** não

## EST-L09a-123 — field — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1719` `const field = useRef<HTMLInputElement & HTMLTextAreaElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1719` `const field = useRef<HTMLInputElement & HTMLTextAreaElement>(null);`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1604` `<textarea ref={field} className="input input--area" rows={3} disabled={!door.available} aria-label={label} spellCheck={false} data-key-context={TEXT_FIELD_CONTEXT} />` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/field.tsx:1604` `<textarea ref={field} className="input input--area" rows={3} disabled={!door.available} aria-label={label} spellCheck={false} data-key-context={TEXT_FIELD_CONTEXT} />` via a atribuição da referência
  - `src/editor/shell/field.tsx:1797` `if (field.current === null) return;` via a atribuição da referência
  - `src/editor/shell/field.tsx:1811` `<textarea ref={field} className="input input--area" rows={4} disabled={!door.available} aria-label={label} aria-invalid={refused.text !== null} spellCheck={false} onInput={(event) => { setTyped(event.currentTarget.value);` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/field.tsx:1549` `const element = field.current;` via leitura da referência
  - `src/editor/shell/field.tsx:1562` `const element = field.current;` via leitura da referência
  - `src/editor/shell/field.tsx:1735` `const element = field.current;` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1719` `const field = useRef<HTMLInputElement & HTMLTextAreaElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1719` `const field = useRef<HTMLInputElement & HTMLTextAreaElement>(null);`
- **Navegador:** não

## EST-L09a-124 — draft — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1722` `const draft = useRef({ shown: '' });`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/field.tsx:1722` `const draft = useRef({ shown: '' });`
  - V2 o valor atribuído `src/editor/shell/field.tsx:1722` `const draft = useRef({ shown: '' });` via o valor inicial da declaração
- **Escritores:**
  - `src/editor/shell/field.tsx:1722` `const draft = useRef({ shown: '' });` via o valor inicial da declaração
- **Leitores:**
  - `src/editor/shell/field.tsx:611` `const said = useEditorState((s) => (draft.current.typed && s.message !== draft.current.message ? s.message ?? CLEARED_MESSAGE : null));` via leitura da referência
  - `src/editor/shell/field.tsx:624` `draft.current.typed = false;` via leitura da referência
  - `src/editor/shell/field.tsx:628` `draft.current.message = store.getState().message;` via leitura da referência
- **Criação:** `src/editor/shell/field.tsx:1722` `const draft = useRef({ shown: '' });`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1722` `const draft = useRef({ shown: '' });`
- **Navegador:** não

## EST-L09a-125 — valor memoizado (useMemo/memo) — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:278` `return useMemo(() => (text === '' ? [] : text.split('\n')), [text]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/field.tsx:278` `return useMemo(() => (text === '' ? [] : text.split('\n')), [text]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/field.tsx:278` `return useMemo(() => (text === '' ? [] : text.split('\n')), [text]);`
- **Escritores:**
  - `src/editor/shell/field.tsx:278` `return useMemo(() => (text === '' ? [] : text.split('\n')), [text]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/field.tsx:278` `return useMemo(() => (text === '' ? [] : text.split('\n')), [text]);` via a própria declaração
- **Criação:** `src/editor/shell/field.tsx:278` `return useMemo(() => (text === '' ? [] : text.split('\n')), [text]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:278` `return useMemo(() => (text === '' ? [] : text.split('\n')), [text]);`
- **Navegador:** não

## EST-L09a-126 — valor memoizado (useMemo/memo) — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:349` `return useMemo(() => (files ?? []).filter(isFontFile).map(familyOf), [files]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/field.tsx:349` `return useMemo(() => (files ?? []).filter(isFontFile).map(familyOf), [files]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/field.tsx:349` `return useMemo(() => (files ?? []).filter(isFontFile).map(familyOf), [files]);`
- **Escritores:**
  - `src/editor/shell/field.tsx:349` `return useMemo(() => (files ?? []).filter(isFontFile).map(familyOf), [files]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/field.tsx:349` `return useMemo(() => (files ?? []).filter(isFontFile).map(familyOf), [files]);` via a própria declaração
- **Criação:** `src/editor/shell/field.tsx:349` `return useMemo(() => (files ?? []).filter(isFontFile).map(familyOf), [files]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:349` `return useMemo(() => (files ?? []).filter(isFontFile).map(familyOf), [files]);`
- **Navegador:** não

## EST-L09a-127 — properties — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:595` `const properties = useMemo(() => [property], [property]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/field.tsx:595` `const properties = useMemo(() => [property], [property]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/field.tsx:595` `const properties = useMemo(() => [property], [property]);`
- **Escritores:**
  - `src/editor/shell/field.tsx:595` `const properties = useMemo(() => [property], [property]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/field.tsx:144` `export function usePageValues(node: NodeId | null, properties: readonly string[]): Readonly<Record<string, string>> | null {` via leitura de properties
  - `src/editor/shell/field.tsx:147` `if (node === null || properties.length === 0) return;` via leitura de properties
  - `src/editor/shell/field.tsx:151` `const values = computedValues(node, properties, lineStyles(MODEL_RULES));` via leitura de properties
- **Criação:** `src/editor/shell/field.tsx:595` `const properties = useMemo(() => [property], [property]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:595` `const properties = useMemo(() => [property], [property]);`
- **Navegador:** não

## EST-L09a-128 — parts — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:969` `const parts = useMemo(() => longhands ?? [property], [longhands, property]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/field.tsx:969` `const parts = useMemo(() => longhands ?? [property], [longhands, property]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/field.tsx:969` `const parts = useMemo(() => longhands ?? [property], [longhands, property]);`
- **Escritores:**
  - `src/editor/shell/field.tsx:969` `const parts = useMemo(() => longhands ?? [property], [longhands, property]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/field.tsx:191` `export function useEffectiveText(property: string, parts: readonly string[], own: boolean): string {` via leitura de parts
  - `src/editor/shell/field.tsx:198` `const values = parts.map((p) => shownText(node, p, layeredRules(s)));` via leitura de parts
  - `src/editor/shell/field.tsx:203` `const computed = usePageValues(own || cascaded !== undefined ? null : primary, parts);` via leitura de parts
- **Criação:** `src/editor/shell/field.tsx:969` `const parts = useMemo(() => longhands ?? [property], [longhands, property]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:969` `const parts = useMemo(() => longhands ?? [property], [longhands, property]);`
- **Navegador:** não

## EST-L09a-129 — projectFonts — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1024` `const projectFonts = useMemo(() => (fontMenu ? families : []), [fontMenu, families]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/field.tsx:1024` `const projectFonts = useMemo(() => (fontMenu ? families : []), [fontMenu, families]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/field.tsx:1024` `const projectFonts = useMemo(() => (fontMenu ? families : []), [fontMenu, families]);`
- **Escritores:**
  - `src/editor/shell/field.tsx:1024` `const projectFonts = useMemo(() => (fontMenu ? families : []), [fontMenu, families]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/field.tsx:855` `function FieldValues({ id, entry, property, label, anchor, list, suggestions, projectFonts, checked, choose }: {` via leitura de projectFonts
  - `src/editor/shell/field.tsx:863` `readonly projectFonts: readonly string[];` via leitura de projectFonts
  - `src/editor/shell/field.tsx:874` `const first = essentials === null ? null : [...projectFonts, ...essentials.filter((v) => !projectFonts.includes(v))];` via leitura de projectFonts
- **Criação:** `src/editor/shell/field.tsx:1024` `const projectFonts = useMemo(() => (fontMenu ? families : []), [fontMenu, families]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1024` `const projectFonts = useMemo(() => (fontMenu ? families : []), [fontMenu, families]);`
- **Navegador:** não

## EST-L09a-130 — suggestions — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1025` `const suggestions = useMemo(() => [...projectFonts, ...new Set([...tokenSuggestions, ...(keywords ?? []), ...presetsOf(entry)])], [projectFonts, tokenSuggestions, keywords, entry]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/field.tsx:1025` `const suggestions = useMemo(() => [...projectFonts, ...new Set([...tokenSuggestions, ...(keywords ?? []), ...presetsOf(entry)])], [projectFonts, tokenSuggestions, keywords, entry]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/field.tsx:1025` `const suggestions = useMemo(() => [...projectFonts, ...new Set([...tokenSuggestions, ...(keywords ?? []), ...presetsOf(entry)])], [projectFonts, tokenSuggestions, keywords, entry]);`
- **Escritores:**
  - `src/editor/shell/field.tsx:1025` `const suggestions = useMemo(() => [...projectFonts, ...new Set([...tokenSuggestions, ...(keywords ?? []), ...presetsOf(entry)])], [projectFonts, tokenSuggestions, keywords, entry]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/field.tsx:387` `function UnitMenu({ entry, property, shown, input, ready, suggestions }: {` via leitura de suggestions
  - `src/editor/shell/field.tsx:393` `readonly suggestions: Suggestions` via leitura de suggestions
  - `src/editor/shell/field.tsx:445` `{suggestions.values.map((value) => (` via leitura de suggestions
- **Criação:** `src/editor/shell/field.tsx:1025` `const suggestions = useMemo(() => [...projectFonts, ...new Set([...tokenSuggestions, ...(keywords ?? []), ...presetsOf(entry)])], [projectFonts, tokenSuggestions, keywords, entry]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1025` `const suggestions = useMemo(() => [...projectFonts, ...new Set([...tokenSuggestions, ...(keywords ?? []), ...presetsOf(entry)])], [projectFonts, tokenSuggestions, keywords, entry]);`
- **Navegador:** não

## EST-L09a-131 — listed — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1028` `const listed = useMemo(() => suggestions.filter((value) => !tokenSuggestions.includes(value)), [suggestions, tokenSuggestions]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/field.tsx:1028` `const listed = useMemo(() => suggestions.filter((value) => !tokenSuggestions.includes(value)), [suggestions, tokenSuggestions]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/field.tsx:1028` `const listed = useMemo(() => suggestions.filter((value) => !tokenSuggestions.includes(value)), [suggestions, tokenSuggestions]);`
- **Escritores:**
  - `src/editor/shell/field.tsx:1028` `const listed = useMemo(() => suggestions.filter((value) => !tokenSuggestions.includes(value)), [suggestions, tokenSuggestions]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/field.tsx:1157` `<input key="input" ref={input} className="input" disabled={!available} aria-label={label} spellCheck={false} list={listed.length > 0 ? listId : undefined} data-key-context={NUMBER_FIELD_CONTEXT} placeholder={placeholder} aria-invalid={refused.text !== null ? true : undefined} onInput={refused.dismiss} />` via leitura de listed
  - `src/editor/shell/field.tsx:1162` `{listed.length > 0 ? (` via leitura de listed
  - `src/editor/shell/field.tsx:1164` `{listed.map((value) => (` via leitura de listed
- **Criação:** `src/editor/shell/field.tsx:1028` `const listed = useMemo(() => suggestions.filter((value) => !tokenSuggestions.includes(value)), [suggestions, tokenSuggestions]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1028` `const listed = useMemo(() => suggestions.filter((value) => !tokenSuggestions.includes(value)), [suggestions, tokenSuggestions]);`
- **Navegador:** não

## EST-L09a-132 — properties — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1253` `const properties = useMemo(() => [property], [property]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/field.tsx:1253` `const properties = useMemo(() => [property], [property]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/field.tsx:1253` `const properties = useMemo(() => [property], [property]);`
- **Escritores:**
  - `src/editor/shell/field.tsx:1253` `const properties = useMemo(() => [property], [property]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/field.tsx:144` `export function usePageValues(node: NodeId | null, properties: readonly string[]): Readonly<Record<string, string>> | null {` via leitura de properties
  - `src/editor/shell/field.tsx:147` `if (node === null || properties.length === 0) return;` via leitura de properties
  - `src/editor/shell/field.tsx:151` `const values = computedValues(node, properties, lineStyles(MODEL_RULES));` via leitura de properties
- **Criação:** `src/editor/shell/field.tsx:1253` `const properties = useMemo(() => [property], [property]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1253` `const properties = useMemo(() => [property], [property]);`
- **Navegador:** não

## EST-L09a-133 — keptSuggestions — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1712` `const keptSuggestions = useMemo(() => (JSON.parse(projectFiles) as readonly string[]).length === 0 ? kept.suggestions : [...new Set([...kept.suggestions, ...(JSON.parse(projectFiles) as readonly string[])])], [kept.suggestions, projectFiles]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/field.tsx:1712` `const keptSuggestions = useMemo(() => (JSON.parse(projectFiles) as readonly string[]).length === 0 ? kept.suggestions : [...new Set([...kept.suggestions, ...(JSON.parse(projectFiles) as readonly string[])])], [kept.suggestions, projectFiles]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/field.tsx:1712` `const keptSuggestions = useMemo(() => (JSON.parse(projectFiles) as readonly string[]).length === 0 ? kept.suggestions : [...new Set([...kept.suggestions, ...(JSON.parse(projectFiles) as readonly string[])])], [kept.suggestions, projectFiles]);`
- **Escritores:**
  - `src/editor/shell/field.tsx:1712` `const keptSuggestions = useMemo(() => (JSON.parse(projectFiles) as readonly string[]).length === 0 ? kept.suggestions : [...new Set([...kept.suggestions, ...(JSON.parse(projectFiles) as readonly string[])])], [kept.suggestions, projectFiles]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/field.tsx:1714` `const suggestions = keptSuggestions;` via leitura de keptSuggestions
- **Criação:** `src/editor/shell/field.tsx:1712` `const keptSuggestions = useMemo(() => (JSON.parse(projectFiles) as readonly string[]).length === 0 ? kept.suggestions : [...new Set([...kept.suggestions, ...(JSON.parse(projectFiles) as readonly string[])])], [kept.suggestions, projectFiles]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1712` `const keptSuggestions = useMemo(() => (JSON.parse(projectFiles) as readonly string[]).length === 0 ? kept.suggestions : [...new Set([...kept.suggestions, ...(JSON.parse(projectFiles) as readonly string[])])], [kept.suggestions, projectFiles]);`
- **Navegador:** não

## EST-L09a-134 — args — field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1716` `const args = useMemo(() => JSON.parse(json) as Readonly<Record<string, string>>, [json]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/field.tsx:1716` `const args = useMemo(() => JSON.parse(json) as Readonly<Record<string, string>>, [json]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/field.tsx:1716` `const args = useMemo(() => JSON.parse(json) as Readonly<Record<string, string>>, [json]);`
- **Escritores:**
  - `src/editor/shell/field.tsx:1716` `const args = useMemo(() => JSON.parse(json) as Readonly<Record<string, string>>, [json]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/field.tsx:121` `const WHEEL_STEPS = manifest.doors.filter((d) => d.door.kind === 'shortcut' && typeof d.door.args.direction === 'string' && d.door.context === NUMBER_FIELD_CONTEXT && d.door.args.size === 'step');` via leitura de args
  - `src/editor/shell/field.tsx:129` `const door = WHEEL_STEPS.find((d) => d.door.args.direction === direction);` via leitura de args
  - `src/editor/shell/field.tsx:133` `(store.dispatch as Dispatch)(door.command.id as CommandId, { ...door.door.args, property, value: element.value, ...(modifier === undefined ? {} : { modifier }) });` via leitura de args
- **Criação:** `src/editor/shell/field.tsx:1716` `const args = useMemo(() => JSON.parse(json) as Readonly<Record<string, string>>, [json]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/field.tsx:1716` `const args = useMemo(() => JSON.parse(json) as Readonly<Record<string, string>>, [json]);`
- **Navegador:** não

## EST-L09a-135 — foco e elemento ativo em field.tsx
- **Declaração:** `src/editor/shell/field.tsx:127` `const direction = document.activeElement === element ? wheelStep(event) : null;`
- **Forma:** estado do navegador: foco e elemento ativo do documento
- **Valores possíveis:**
  - V1 sem toque do painel: o foco/rolagem é o de antes da montagem `src/editor/shell/field.tsx:127` `const direction = document.activeElement === element ? wheelStep(event) : null;`
  - V2 tocado: o painel lê ou move o foco/rolagem
- **Escritores:**
  - `src/editor/shell/field.tsx:411` `if (open) list.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus();` via foco do navegador
- **Leitores:**
  - `src/editor/shell/field.tsx:819` `if (document.activeElement === element) return;` via leitura do foco
  - `src/editor/shell/field.tsx:1090` `if (!inside(document.activeElement)) finish();` via leitura do foco
- **Criação:** `src/editor/shell/field.tsx:127` `const direction = document.activeElement === element ? wheelStep(event) : null;`
- **Descarte:** fim-da-página `src/editor/shell/field.tsx:127` `const direction = document.activeElement === element ? wheelStep(event) : null;`
- **Navegador:** foco

## EST-L09a-136 — foco e elemento ativo em field.tsx
- **Declaração:** `src/editor/shell/field.tsx:819` `if (document.activeElement === element) return;`
- **Forma:** estado do navegador: foco e elemento ativo do documento
- **Valores possíveis:**
  - V1 sem toque do painel: o foco/rolagem é o de antes da montagem `src/editor/shell/field.tsx:819` `if (document.activeElement === element) return;`
  - V2 tocado: o painel lê ou move o foco/rolagem
- **Escritores:**
  - `src/editor/shell/field.tsx:411` `if (open) list.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus();` via foco do navegador
- **Leitores:**
  - `src/editor/shell/field.tsx:127` `const direction = document.activeElement === element ? wheelStep(event) : null;` via leitura do foco
  - `src/editor/shell/field.tsx:1090` `if (!inside(document.activeElement)) finish();` via leitura do foco
- **Criação:** `src/editor/shell/field.tsx:819` `if (document.activeElement === element) return;`
- **Descarte:** fim-da-página `src/editor/shell/field.tsx:819` `if (document.activeElement === element) return;`
- **Navegador:** foco

## EST-L09a-137 — foco e elemento ativo em field.tsx
- **Declaração:** `src/editor/shell/field.tsx:1090` `if (!inside(document.activeElement)) finish();`
- **Forma:** estado do navegador: foco e elemento ativo do documento
- **Valores possíveis:**
  - V1 sem toque do painel: o foco/rolagem é o de antes da montagem `src/editor/shell/field.tsx:1090` `if (!inside(document.activeElement)) finish();`
  - V2 tocado: o painel lê ou move o foco/rolagem
- **Escritores:**
  - `src/editor/shell/field.tsx:411` `if (open) list.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus();` via foco do navegador
- **Leitores:**
  - `src/editor/shell/field.tsx:127` `const direction = document.activeElement === element ? wheelStep(event) : null;` via leitura do foco
  - `src/editor/shell/field.tsx:819` `if (document.activeElement === element) return;` via leitura do foco
- **Criação:** `src/editor/shell/field.tsx:1090` `if (!inside(document.activeElement)) finish();`
- **Descarte:** fim-da-página `src/editor/shell/field.tsx:1090` `if (!inside(document.activeElement)) finish();`
- **Navegador:** foco

## EST-L09a-138 — open — guides-grids.tsx
- **Declaração:** `src/editor/shell/guides-grids.tsx:72` `const [open, setOpen] = useState(false);`
- **Forma:** valor de estado do componente React (useState), gravado por setOpen
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/guides-grids.tsx:72` `const [open, setOpen] = useState(false);`
  - V2 o valor depois de setOpen `src/editor/shell/guides-grids.tsx:79` `setOpen(false);` via setOpen
- **Escritores:**
  - `src/editor/shell/guides-grids.tsx:79` `setOpen(false);` via setOpen
  - `src/editor/shell/guides-grids.tsx:93` `onClick={() => (door.available ? setOpen((was) => !was) : undefined)}` via setOpen
  - `src/editor/shell/guides-grids.tsx:100` `<input className="input" name="at" autoFocus inputMode="decimal" spellCheck={false} aria-label={t('guidesGrids.place')} placeholder={t('guidesGrids.place')} data-local="guide-place" data-key-context={DIALOG_KEYS} onBlur={() => setOpen(false)} />` via setOpen
- **Leitores:**
  - `src/editor/shell/guides-grids.tsx:90` `aria-expanded={open}` via leitura de open
  - `src/editor/shell/guides-grids.tsx:98` `{open ? (` via leitura de open
  - `src/editor/shell/guides-grids.tsx:171` `const open = useEditorState((s) => s.ui.dialog === DIALOG);` via leitura de open
- **Criação:** `src/editor/shell/guides-grids.tsx:72` `const [open, setOpen] = useState(false);`
- **Descarte:** quando o componente desmonta `src/editor/shell/guides-grids.tsx:72` `const [open, setOpen] = useState(false);`
- **Navegador:** não

## EST-L09a-139 — draft — guides-grids.tsx
- **Declaração:** `src/editor/shell/guides-grids.tsx:133` `const [draft, setDraft] = useState<string | null>(null);`
- **Forma:** valor de estado do componente React (useState), gravado por setDraft
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/guides-grids.tsx:133` `const [draft, setDraft] = useState<string | null>(null);`
  - V2 o valor depois de setDraft `src/editor/shell/guides-grids.tsx:139` `setDraft(null);` via setDraft
- **Escritores:**
  - `src/editor/shell/guides-grids.tsx:139` `setDraft(null);` via setDraft
  - `src/editor/shell/guides-grids.tsx:147` `} className="input" inputMode="decimal" spellCheck={false} disabled={!door.available} data-key-context={DIALOG_KEYS} value={draft ?? String(value)} onChange={(event) => setDraft(event.currentTarget.value)} onBlur={() => setDraft(null)} />` via setDraft
- **Leitores:**
  - `src/editor/shell/guides-grids.tsx:137` `if (draft === null) return;` via leitura de draft
  - `src/editor/shell/guides-grids.tsx:138` `const typed = Number(draft);` via leitura de draft
  - `src/editor/shell/guides-grids.tsx:140` `if (draft.trim() !== '' && Number.isFinite(typed)) run(entry, { grid, setting, value: typed });` via leitura de draft
- **Criação:** `src/editor/shell/guides-grids.tsx:133` `const [draft, setDraft] = useState<string | null>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/guides-grids.tsx:133` `const [draft, setDraft] = useState<string | null>(null);`
- **Navegador:** não

## EST-L09a-140 — choices — html-import.tsx
- **Declaração:** `src/editor/shell/html-import.tsx:16` `const choices = useRef<HTMLDivElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/html-import.tsx:16` `const choices = useRef<HTMLDivElement>(null);`
  - V2 o valor atribuído `src/editor/shell/html-import.tsx:25` `<div ref={choices} className="html-import__choices">` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/html-import.tsx:25` `<div ref={choices} className="html-import__choices">` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/html-import.tsx:18` `if (request) choices.current?.querySelector<HTMLButtonElement>('[data-import-default] button')?.focus();` via leitura da referência
- **Criação:** `src/editor/shell/html-import.tsx:16` `const choices = useRef<HTMLDivElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/html-import.tsx:16` `const choices = useRef<HTMLDivElement>(null);`
- **Navegador:** não

## EST-L09a-141 — TARGETS — inspector-controls.tsx
- **Declaração:** `src/editor/shell/inspector-controls.tsx:39` `export const TARGETS = new Map<string, Target>([`
- **Forma:** coleção compartilhada do módulo (Map/Set)
- **Valores possíveis:**
  - V1 preenchido na carga do módulo `src/editor/shell/inspector-controls.tsx:39` `export const TARGETS = new Map<string, Target>([`
  - V2 lido enquanto a página viver `src/editor/shell/inspector-controls.tsx:39` `export const TARGETS = new Map<string, Target>([`
- **Escritores:**
  - `src/editor/shell/inspector-controls.tsx:39` `export const TARGETS = new Map<string, Target>([` via a carga do módulo
- **Leitores:**
  - `src/editor/shell/inspector-controls.tsx:55` `return id !== null ? (TARGETS.get(id) ?? null) : null;` via leitura da coleção
  - `src/editor/shell/inspector-controls.tsx:123` `const named = targetOf(entry) ?? TARGETS.get(entry.door.adapter.writes[0] ?? '');` via leitura da coleção
  - `src/editor/shell/inspector-controls.tsx:531` `const label = css !== undefined ? TARGETS.get(css)?.labelKey : undefined;` via leitura da coleção
- **Criação:** `src/editor/shell/inspector-controls.tsx:39` `export const TARGETS = new Map<string, Target>([`
- **Descarte:** fim-da-página `src/editor/shell/inspector-controls.tsx:39` `export const TARGETS = new Map<string, Target>([`
- **Navegador:** não

## EST-L09a-142 — input — inspector-controls.tsx
- **Declaração:** `src/editor/shell/inspector-controls.tsx:267` `const input = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector-controls.tsx:267` `const input = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector-controls.tsx:300` `ref={input}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector-controls.tsx:300` `ref={input}` via a atribuição da referência
  - `src/editor/shell/inspector-controls.tsx:395` `ref={input}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector-controls.tsx:270` `const element = input.current;` via leitura da referência
  - `src/editor/shell/inspector-controls.tsx:274` `const element = input.current;` via leitura da referência
  - `src/editor/shell/inspector-controls.tsx:371` `const element = input.current;` via leitura da referência
- **Criação:** `src/editor/shell/inspector-controls.tsx:267` `const input = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-controls.tsx:267` `const input = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-143 — draft — inspector-controls.tsx
- **Declaração:** `src/editor/shell/inspector-controls.tsx:268` `const draft = useRef(false);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector-controls.tsx:268` `const draft = useRef(false);`
  - V2 o valor atribuído `src/editor/shell/inspector-controls.tsx:276` `draft.current = false;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector-controls.tsx:276` `draft.current = false;` via a atribuição da referência
  - `src/editor/shell/inspector-controls.tsx:309` `onInput={() => { draft.current = true; }}` via a atribuição da referência
  - `src/editor/shell/inspector-controls.tsx:377` `draft.current = false;` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector-controls.tsx:271` `if (element !== null && !draft.current) element.value = shown;` via leitura da referência
  - `src/editor/shell/inspector-controls.tsx:275` `if (element === null || !draft.current) return;` via leitura da referência
  - `src/editor/shell/inspector-controls.tsx:372` `if (element !== null && !draft.current) element.value = track;` via leitura da referência
- **Criação:** `src/editor/shell/inspector-controls.tsx:268` `const draft = useRef(false);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-controls.tsx:268` `const draft = useRef(false);`
- **Navegador:** não

## EST-L09a-144 — input — inspector-controls.tsx
- **Declaração:** `src/editor/shell/inspector-controls.tsx:368` `const input = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector-controls.tsx:368` `const input = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector-controls.tsx:300` `ref={input}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector-controls.tsx:300` `ref={input}` via a atribuição da referência
  - `src/editor/shell/inspector-controls.tsx:395` `ref={input}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector-controls.tsx:270` `const element = input.current;` via leitura da referência
  - `src/editor/shell/inspector-controls.tsx:274` `const element = input.current;` via leitura da referência
  - `src/editor/shell/inspector-controls.tsx:371` `const element = input.current;` via leitura da referência
- **Criação:** `src/editor/shell/inspector-controls.tsx:368` `const input = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-controls.tsx:368` `const input = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-145 — draft — inspector-controls.tsx
- **Declaração:** `src/editor/shell/inspector-controls.tsx:369` `const draft = useRef(false);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector-controls.tsx:369` `const draft = useRef(false);`
  - V2 o valor atribuído `src/editor/shell/inspector-controls.tsx:276` `draft.current = false;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector-controls.tsx:276` `draft.current = false;` via a atribuição da referência
  - `src/editor/shell/inspector-controls.tsx:309` `onInput={() => { draft.current = true; }}` via a atribuição da referência
  - `src/editor/shell/inspector-controls.tsx:377` `draft.current = false;` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector-controls.tsx:271` `if (element !== null && !draft.current) element.value = shown;` via leitura da referência
  - `src/editor/shell/inspector-controls.tsx:275` `if (element === null || !draft.current) return;` via leitura da referência
  - `src/editor/shell/inspector-controls.tsx:372` `if (element !== null && !draft.current) element.value = track;` via leitura da referência
- **Criação:** `src/editor/shell/inspector-controls.tsx:369` `const draft = useRef(false);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-controls.tsx:369` `const draft = useRef(false);`
- **Navegador:** não

## EST-L09a-146 — field — inspector-controls.tsx
- **Declaração:** `src/editor/shell/inspector-controls.tsx:445` `const field = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector-controls.tsx:445` `const field = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector-controls.tsx:449` `if (field.current === null) return;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector-controls.tsx:449` `if (field.current === null) return;` via a atribuição da referência
  - `src/editor/shell/inspector-controls.tsx:478` `ref={field}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector-controls.tsx:450` `field.current.value = shown;` via leitura da referência
  - `src/editor/shell/inspector-controls.tsx:454` `const element = field.current;` via leitura da referência
- **Criação:** `src/editor/shell/inspector-controls.tsx:445` `const field = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-controls.tsx:445` `const field = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-147 — typed — inspector-controls.tsx
- **Declaração:** `src/editor/shell/inspector-controls.tsx:446` `const typed = useRef(false);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector-controls.tsx:446` `const typed = useRef(false);`
  - V2 o valor atribuído `src/editor/shell/inspector-controls.tsx:451` `typed.current = false;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector-controls.tsx:451` `typed.current = false;` via a atribuição da referência
  - `src/editor/shell/inspector-controls.tsx:456` `typed.current = false;` via a atribuição da referência
  - `src/editor/shell/inspector-controls.tsx:485` `typed.current = true;` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector-controls.tsx:455` `if (element === null || !typed.current) return;` via leitura da referência
- **Criação:** `src/editor/shell/inspector-controls.tsx:446` `const typed = useRef(false);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-controls.tsx:446` `const typed = useRef(false);`
- **Navegador:** não

## EST-L09a-148 — typedName — inspector-settings.tsx
- **Declaração:** `src/editor/shell/inspector-settings.tsx:135` `const typedName = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector-settings.tsx:135` `const typedName = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector-settings.tsx:160` `<input ref={typedName} className="input" disabled={!addDoor.available} aria-label={t('inspector.customAttribute.name')} aria-invalid={refused.text !== null} placeholder={t('inspector.customAttribute.name')} spellCheck={false} data-local="custom-attribute-name" onInput={refused.dismiss} />` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector-settings.tsx:160` `<input ref={typedName} className="input" disabled={!addDoor.available} aria-label={t('inspector.customAttribute.name')} aria-invalid={refused.text !== null} placeholder={t('inspector.customAttribute.name')} spellCheck={false} data-local="custom-attribute-name" onInput={refused.dismiss} />` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector-settings.tsx:137` `if (typedName.current !== null) typedName.current.value = '';` via leitura da referência
  - `src/editor/shell/inspector-settings.tsx:141` `const field = typedName.current;` via leitura da referência
- **Criação:** `src/editor/shell/inspector-settings.tsx:135` `const typedName = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-settings.tsx:135` `const typedName = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-149 — form — inspector-settings.tsx
- **Declaração:** `src/editor/shell/inspector-settings.tsx:176` `const form = useRef<HTMLFormElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector-settings.tsx:176` `const form = useRef<HTMLFormElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector-settings.tsx:211` `} data-door={valueEntry.ref} data-args={JSON.stringify(args)} title={door.title}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector-settings.tsx:211` `} data-door={valueEntry.ref} data-args={JSON.stringify(args)} title={door.title}>` via a atribuição da referência
  - `src/editor/shell/inspector-settings.tsx:266` `field-row${door.available ? '' : ' is-unavailable'}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector-settings.tsx:186` `const row = form.current;` via leitura da referência
  - `src/editor/shell/inspector-settings.tsx:240` `const row = form.current;` via leitura da referência
- **Criação:** `src/editor/shell/inspector-settings.tsx:176` `const form = useRef<HTMLFormElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-settings.tsx:176` `const form = useRef<HTMLFormElement>(null);`
- **Navegador:** não

## EST-L09a-150 — field — inspector-settings.tsx
- **Declaração:** `src/editor/shell/inspector-settings.tsx:177` `const field = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector-settings.tsx:177` `const field = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector-settings.tsx:181` `if (field.current === null) return;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector-settings.tsx:181` `if (field.current === null) return;` via a atribuição da referência
  - `src/editor/shell/inspector-settings.tsx:213` `<input ref={field} className="input" disabled={!door.available} aria-label={name} spellCheck={false} />` via a atribuição da referência
  - `src/editor/shell/inspector-settings.tsx:268` `<input ref={field} className="input" disabled={!door.available} aria-label={label} spellCheck={false} list={listId} />` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector-settings.tsx:182` `field.current.value = value;` via leitura da referência
  - `src/editor/shell/inspector-settings.tsx:187` `const element = field.current;` via leitura da referência
  - `src/editor/shell/inspector-settings.tsx:237` `if (field.current !== null) field.current.value = current;` via leitura da referência
- **Criação:** `src/editor/shell/inspector-settings.tsx:177` `const field = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-settings.tsx:177` `const field = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-151 — shown — inspector-settings.tsx
- **Declaração:** `src/editor/shell/inspector-settings.tsx:178` `const shown = useRef(value);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector-settings.tsx:178` `const shown = useRef(value);`
  - V2 o valor atribuído `src/editor/shell/inspector-settings.tsx:183` `shown.current = value;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector-settings.tsx:183` `shown.current = value;` via a atribuição da referência
  - `src/editor/shell/inspector-settings.tsx:191` `shown.current = element.value;` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector-settings.tsx:190` `if (element.value === shown.current) return;` via leitura da referência
- **Criação:** `src/editor/shell/inspector-settings.tsx:178` `const shown = useRef(value);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-settings.tsx:178` `const shown = useRef(value);`
- **Navegador:** não

## EST-L09a-152 — form — inspector-settings.tsx
- **Declaração:** `src/editor/shell/inspector-settings.tsx:231` `const form = useRef<HTMLFormElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector-settings.tsx:231` `const form = useRef<HTMLFormElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector-settings.tsx:211` `} data-door={valueEntry.ref} data-args={JSON.stringify(args)} title={door.title}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector-settings.tsx:211` `} data-door={valueEntry.ref} data-args={JSON.stringify(args)} title={door.title}>` via a atribuição da referência
  - `src/editor/shell/inspector-settings.tsx:266` `field-row${door.available ? '' : ' is-unavailable'}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector-settings.tsx:186` `const row = form.current;` via leitura da referência
  - `src/editor/shell/inspector-settings.tsx:240` `const row = form.current;` via leitura da referência
- **Criação:** `src/editor/shell/inspector-settings.tsx:231` `const form = useRef<HTMLFormElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-settings.tsx:231` `const form = useRef<HTMLFormElement>(null);`
- **Navegador:** não

## EST-L09a-153 — field — inspector-settings.tsx
- **Declaração:** `src/editor/shell/inspector-settings.tsx:232` `const field = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector-settings.tsx:232` `const field = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector-settings.tsx:181` `if (field.current === null) return;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector-settings.tsx:181` `if (field.current === null) return;` via a atribuição da referência
  - `src/editor/shell/inspector-settings.tsx:213` `<input ref={field} className="input" disabled={!door.available} aria-label={name} spellCheck={false} />` via a atribuição da referência
  - `src/editor/shell/inspector-settings.tsx:268` `<input ref={field} className="input" disabled={!door.available} aria-label={label} spellCheck={false} list={listId} />` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector-settings.tsx:182` `field.current.value = value;` via leitura da referência
  - `src/editor/shell/inspector-settings.tsx:187` `const element = field.current;` via leitura da referência
  - `src/editor/shell/inspector-settings.tsx:237` `if (field.current !== null) field.current.value = current;` via leitura da referência
- **Criação:** `src/editor/shell/inspector-settings.tsx:232` `const field = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-settings.tsx:232` `const field = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-154 — args — inspector-settings.tsx
- **Declaração:** `src/editor/shell/inspector-settings.tsx:65` `const args = useMemo(() => JSON.parse(json) as Readonly<Record<string, string>>, [json]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/inspector-settings.tsx:65` `const args = useMemo(() => JSON.parse(json) as Readonly<Record<string, string>>, [json]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/inspector-settings.tsx:65` `const args = useMemo(() => JSON.parse(json) as Readonly<Record<string, string>>, [json]);`
- **Escritores:**
  - `src/editor/shell/inspector-settings.tsx:65` `const args = useMemo(() => JSON.parse(json) as Readonly<Record<string, string>>, [json]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/inspector-settings.tsx:32` `const ADD_PART_DOORS = doorSlots('inspector-settings').filter((d) => d.door.kind === 'panel-control' && d.door.drawnAs === 'button' && typeof d.door.args.type === 'string');` via leitura de args
  - `src/editor/shell/inspector-settings.tsx:33` `const PART_DOORS = doorSlots('inspector-settings').filter((d) => d.door.kind === 'panel-control' && d.door.drawnAs === 'icon-button' && d.command.args.target?.type === 'node');` via leitura de args
  - `src/editor/shell/inspector-settings.tsx:37` `const CUSTOM_DOORS = doorSlots('inspector-settings').filter((d) => d.door.kind === 'panel-control' && d.command.args.name?.type === 'string');` via leitura de args
- **Criação:** `src/editor/shell/inspector-settings.tsx:65` `const args = useMemo(() => JSON.parse(json) as Readonly<Record<string, string>>, [json]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-settings.tsx:65` `const args = useMemo(() => JSON.parse(json) as Readonly<Record<string, string>>, [json]);`
- **Navegador:** não

## EST-L09a-155 — args — inspector-settings.tsx
- **Declaração:** `src/editor/shell/inspector-settings.tsx:174` `const args = useMemo(() => ({ name }), [name]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/inspector-settings.tsx:174` `const args = useMemo(() => ({ name }), [name]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/inspector-settings.tsx:174` `const args = useMemo(() => ({ name }), [name]);`
- **Escritores:**
  - `src/editor/shell/inspector-settings.tsx:174` `const args = useMemo(() => ({ name }), [name]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/inspector-settings.tsx:32` `const ADD_PART_DOORS = doorSlots('inspector-settings').filter((d) => d.door.kind === 'panel-control' && d.door.drawnAs === 'button' && typeof d.door.args.type === 'string');` via leitura de args
  - `src/editor/shell/inspector-settings.tsx:33` `const PART_DOORS = doorSlots('inspector-settings').filter((d) => d.door.kind === 'panel-control' && d.door.drawnAs === 'icon-button' && d.command.args.target?.type === 'node');` via leitura de args
  - `src/editor/shell/inspector-settings.tsx:37` `const CUSTOM_DOORS = doorSlots('inspector-settings').filter((d) => d.door.kind === 'panel-control' && d.command.args.name?.type === 'string');` via leitura de args
- **Criação:** `src/editor/shell/inspector-settings.tsx:174` `const args = useMemo(() => ({ name }), [name]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-settings.tsx:174` `const args = useMemo(() => ({ name }), [name]);`
- **Navegador:** não

## EST-L09a-156 — controls — inspector-settings.tsx
- **Declaração:** `src/editor/shell/inspector-settings.tsx:227` `const controls = useMemo(() => formControls(document), [document]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/inspector-settings.tsx:227` `const controls = useMemo(() => formControls(document), [document]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/inspector-settings.tsx:227` `const controls = useMemo(() => formControls(document), [document]);`
- **Escritores:**
  - `src/editor/shell/inspector-settings.tsx:227` `const controls = useMemo(() => formControls(document), [document]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/inspector-settings.tsx:230` `const current = typeof held === 'string' ? (controls.find((c) => c.id === held)?.name ?? '') : '';` via leitura de controls
  - `src/editor/shell/inspector-settings.tsx:270` `{controls.map((c) => (` via leitura de controls
- **Criação:** `src/editor/shell/inspector-settings.tsx:227` `const controls = useMemo(() => formControls(document), [document]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector-settings.tsx:227` `const controls = useMemo(() => formControls(document), [document]);`
- **Navegador:** não

## EST-L09a-157 — foco e elemento ativo em inspector-settings.tsx
- **Declaração:** `src/editor/shell/inspector-settings.tsx:144` `field.focus();`
- **Forma:** estado do navegador: foco e elemento ativo do documento
- **Valores possíveis:**
  - V1 sem toque do painel: o foco/rolagem é o de antes da montagem `src/editor/shell/inspector-settings.tsx:144` `field.focus();`
  - V2 tocado: o painel lê ou move o foco/rolagem
- **Escritores:**
  - `src/editor/shell/inspector-settings.tsx:144` `field.focus();` via o próprio navegador
- **Leitores:**
  - `src/editor/shell/inspector-settings.tsx:144` `field.focus();` via leitura do navegador
- **Criação:** `src/editor/shell/inspector-settings.tsx:144` `field.focus();`
- **Descarte:** fim-da-página `src/editor/shell/inspector-settings.tsx:144` `field.focus();`
- **Navegador:** foco

## EST-L09a-158 — query — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:370` `const [query, setQuery] = useState('');`
- **Forma:** valor de estado do componente React (useState), gravado por setQuery
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/inspector.tsx:370` `const [query, setQuery] = useState('');`
  - V2 o valor depois de setQuery `src/editor/shell/inspector.tsx:432` `onChange={(event) => setQuery(event.currentTarget.value)}` via setQuery
- **Escritores:**
  - `src/editor/shell/inspector.tsx:432` `onChange={(event) => setQuery(event.currentTarget.value)}` via setQuery
- **Leitores:**
  - `src/editor/shell/inspector.tsx:153` `const query = useEditorState((s) => inspectorSearchOf(s.ui));` via leitura de query
  - `src/editor/shell/inspector.tsx:154` `const searching = query.trim() !== '';` via leitura de query
  - `src/editor/shell/inspector.tsx:161` `(SECTION_DOORS.get(section) ?? []).filter((d) => shownForSelection(d, kinds, contexts) && (searching ? searchMatches(query, t(fieldLabelKey(d)), cssNamesOf(d)) : mode === 'all' || shownInEssentials(d, held, revealed)));` via leitura de query
- **Criação:** `src/editor/shell/inspector.tsx:370` `const [query, setQuery] = useState('');`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:370` `const [query, setQuery] = useState('');`
- **Navegador:** não

## EST-L09a-159 — button — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:368` `const button = useRef<HTMLButtonElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector.tsx:368` `const button = useRef<HTMLButtonElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector.tsx:413` `} data-door={REVEAL.ref} data-args="{}" aria-haspopup="dialog" aria-expanded={open} aria-label={door.label} title={door.title} aria-disabled={door.available ? undefined : true} onClick={() => (door.available ? setOpen(!open) : undefined)}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector.tsx:413` `} data-door={REVEAL.ref} data-args="{}" aria-haspopup="dialog" aria-expanded={open} aria-label={door.label} title={door.title} aria-disabled={door.available ? undefined : true} onClick={() => (door.available ? setOpen(!open) : undefined)}>` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector.tsx:368` `const button = useRef<HTMLButtonElement>(null);` via a própria declaração
- **Criação:** `src/editor/shell/inspector.tsx:368` `const button = useRef<HTMLButtonElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:368` `const button = useRef<HTMLButtonElement>(null);`
- **Navegador:** não

## EST-L09a-160 — filter — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:371` `const filter = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector.tsx:371` `const filter = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector.tsx:422` `ref={filter}` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector.tsx:422` `ref={filter}` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector.tsx:384` `const input = filter.current;` via leitura da referência
- **Criação:** `src/editor/shell/inspector.tsx:371` `const filter = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:371` `const filter = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-161 — form — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:481` `const form = useRef<HTMLFormElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector.tsx:481` `const form = useRef<HTMLFormElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector.tsx:518` `} data-door={entry.ref} data-args={JSON.stringify(args)} title={door.title}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector.tsx:518` `} data-door={entry.ref} data-args={JSON.stringify(args)} title={door.title}>` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector.tsx:493` `const row = form.current;` via leitura da referência
- **Criação:** `src/editor/shell/inspector.tsx:481` `const form = useRef<HTMLFormElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:481` `const form = useRef<HTMLFormElement>(null);`
- **Navegador:** não

## EST-L09a-162 — field — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:482` `const field = useRef<HTMLInputElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector.tsx:482` `const field = useRef<HTMLInputElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector.tsx:488` `if (field.current === null) return;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector.tsx:488` `if (field.current === null) return;` via a atribuição da referência
  - `src/editor/shell/inspector.tsx:520` `<input ref={field} className="input" disabled={!door.available} aria-label={door.label} spellCheck={false} />` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector.tsx:489` `field.current.value = stored;` via leitura da referência
  - `src/editor/shell/inspector.tsx:494` `const element = field.current;` via leitura da referência
- **Criação:** `src/editor/shell/inspector.tsx:482` `const field = useRef<HTMLInputElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:482` `const field = useRef<HTMLInputElement>(null);`
- **Navegador:** não

## EST-L09a-163 — shown — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:483` `const shown = useRef('');`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector.tsx:483` `const shown = useRef('');`
  - V2 o valor atribuído `src/editor/shell/inspector.tsx:490` `shown.current = stored;` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector.tsx:490` `shown.current = stored;` via a atribuição da referência
  - `src/editor/shell/inspector.tsx:498` `shown.current = element.value;` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector.tsx:497` `if (element.value === shown.current) return;` via leitura da referência
- **Criação:** `src/editor/shell/inspector.tsx:483` `const shown = useRef('');`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:483` `const shown = useRef('');`
- **Navegador:** não

## EST-L09a-164 — group — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:544` `const group = useRef<HTMLSpanElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector.tsx:544` `const group = useRef<HTMLSpanElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector.tsx:554` `} role="group" aria-label={label} data-mixed={mixed ? '' : undefined} data-columns={MATRIX_PLACES.length}>` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector.tsx:554` `} role="group" aria-label={label} data-mixed={mixed ? '' : undefined} data-columns={MATRIX_PLACES.length}>` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector.tsx:546` `const cells = [...(group.current?.querySelectorAll<HTMLElement>('.matrix__cell') ?? [])];` via leitura da referência
- **Criação:** `src/editor/shell/inspector.tsx:544` `const group = useRef<HTMLSpanElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:544` `const group = useRef<HTMLSpanElement>(null);`
- **Navegador:** não

## EST-L09a-165 — aside — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:719` `const aside = useRef<HTMLElement>(null);`
- **Forma:** referência mutável (useRef), viva entre as renderizações
- **Valores possíveis:**
  - V1 o valor inicial da referência (null ou um valor neutro) `src/editor/shell/inspector.tsx:719` `const aside = useRef<HTMLElement>(null);`
  - V2 o valor atribuído `src/editor/shell/inspector.tsx:722` `if (captured) return <aside ref={aside} className="inspector" aria-label={t(panelName('inspector'))} data-panel-focus="inspector">` via a atribuição da referência
- **Escritores:**
  - `src/editor/shell/inspector.tsx:722` `if (captured) return <aside ref={aside} className="inspector" aria-label={t(panelName('inspector'))} data-panel-focus="inspector">` via a atribuição da referência
  - `src/editor/shell/inspector.tsx:728` `<aside ref={aside} className="inspector" aria-label={t(panelName('inspector'))} data-panel-focus="inspector">` via a atribuição da referência
- **Leitores:**
  - `src/editor/shell/inspector.tsx:720` `useEffect(() => (open && aside.current !== null ? installRowFit(aside.current) : undefined), [open]);` via leitura da referência
- **Criação:** `src/editor/shell/inspector.tsx:719` `const aside = useRef<HTMLElement>(null);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:719` `const aside = useRef<HTMLElement>(null);`
- **Navegador:** não

## EST-L09a-166 — collapsed — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:126` `const collapsed = useMemo(() => collapsedText.split(' ').filter((id) => id !== '') as readonly SectionId[], [collapsedText]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/inspector.tsx:126` `const collapsed = useMemo(() => collapsedText.split(' ').filter((id) => id !== '') as readonly SectionId[], [collapsedText]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/inspector.tsx:126` `const collapsed = useMemo(() => collapsedText.split(' ').filter((id) => id !== '') as readonly SectionId[], [collapsedText]);`
- **Escritores:**
  - `src/editor/shell/inspector.tsx:126` `const collapsed = useMemo(() => collapsedText.split(' ').filter((id) => id !== '') as readonly SectionId[], [collapsedText]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/inspector.tsx:181` `const closed = !searching && collapsed.includes(section) && !holdsRevealed;` via leitura de collapsed
- **Criação:** `src/editor/shell/inspector.tsx:126` `const collapsed = useMemo(() => collapsedText.split(' ').filter((id) => id !== '') as readonly SectionId[], [collapsedText]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:126` `const collapsed = useMemo(() => collapsedText.split(' ').filter((id) => id !== '') as readonly SectionId[], [collapsedText]);`
- **Navegador:** não

## EST-L09a-167 — rowsClosed — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:132` `const rowsClosed = useMemo(() => rowsClosedText.split(' ').filter((id) => id !== ''), [rowsClosedText]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/inspector.tsx:132` `const rowsClosed = useMemo(() => rowsClosedText.split(' ').filter((id) => id !== ''), [rowsClosedText]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/inspector.tsx:132` `const rowsClosed = useMemo(() => rowsClosedText.split(' ').filter((id) => id !== ''), [rowsClosedText]);`
- **Escritores:**
  - `src/editor/shell/inspector.tsx:132` `const rowsClosed = useMemo(() => rowsClosedText.split(' ').filter((id) => id !== ''), [rowsClosedText]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/inspector.tsx:289` `} row={row} head={head} details={details} open={!rowsClosed.includes(row.id) || holdsRevealed} />);` via leitura de rowsClosed
- **Criação:** `src/editor/shell/inspector.tsx:132` `const rowsClosed = useMemo(() => rowsClosedText.split(' ').filter((id) => id !== ''), [rowsClosedText]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:132` `const rowsClosed = useMemo(() => rowsClosedText.split(' ').filter((id) => id !== ''), [rowsClosedText]);`
- **Navegador:** não

## EST-L09a-168 — properties — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:135` `const properties = useMemo(() => collapsed.flatMap((section) => summaryProperties(section)), [collapsed]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/inspector.tsx:135` `const properties = useMemo(() => collapsed.flatMap((section) => summaryProperties(section)), [collapsed]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/inspector.tsx:135` `const properties = useMemo(() => collapsed.flatMap((section) => summaryProperties(section)), [collapsed]);`
- **Escritores:**
  - `src/editor/shell/inspector.tsx:135` `const properties = useMemo(() => collapsed.flatMap((section) => summaryProperties(section)), [collapsed]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/inspector.tsx:59` `const SECTIONS = manifest.properties.sections;` via leitura de properties
  - `src/editor/shell/inspector.tsx:136` `const values = usePageValues(only, properties);` via leitura de properties
  - `src/editor/shell/inspector.tsx:347` `const properties = target !== null ? editedProperties(target) : editedPropertiesByDoor(entry.ref);` via leitura de properties
- **Criação:** `src/editor/shell/inspector.tsx:135` `const properties = useMemo(() => collapsed.flatMap((section) => summaryProperties(section)), [collapsed]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:135` `const properties = useMemo(() => collapsed.flatMap((section) => summaryProperties(section)), [collapsed]);`
- **Navegador:** não

## EST-L09a-169 — borderValues — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:142` `const borderValues = useMemo(() => borderValuesText === null ? null : JSON.parse(borderValuesText) as Readonly<Record<string, string>>, [borderValuesText]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/inspector.tsx:142` `const borderValues = useMemo(() => borderValuesText === null ? null : JSON.parse(borderValuesText) as Readonly<Record<string, string>>, [borderValuesText]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/inspector.tsx:142` `const borderValues = useMemo(() => borderValuesText === null ? null : JSON.parse(borderValuesText) as Readonly<Record<string, string>>, [borderValuesText]);`
- **Escritores:**
  - `src/editor/shell/inspector.tsx:142` `const borderValues = useMemo(() => borderValuesText === null ? null : JSON.parse(borderValuesText) as Readonly<Record<string, string>>, [borderValuesText]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/inspector.tsx:182` `const summary = closed ? summaryOf(section, section === 'border' ? borderValues : values, t, locale) : null;` via leitura de borderValues
- **Criação:** `src/editor/shell/inspector.tsx:142` `const borderValues = useMemo(() => borderValuesText === null ? null : JSON.parse(borderValuesText) as Readonly<Record<string, string>>, [borderValuesText]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:142` `const borderValues = useMemo(() => borderValuesText === null ? null : JSON.parse(borderValuesText) as Readonly<Record<string, string>>, [borderValuesText]);`
- **Navegador:** não

## EST-L09a-170 — held — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:159` `const held = useMemo(() => new Set(heldText.split(' ').filter((property) => property !== '')), [heldText]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/inspector.tsx:159` `const held = useMemo(() => new Set(heldText.split(' ').filter((property) => property !== '')), [heldText]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/inspector.tsx:159` `const held = useMemo(() => new Set(heldText.split(' ').filter((property) => property !== '')), [heldText]);`
- **Escritores:**
  - `src/editor/shell/inspector.tsx:159` `const held = useMemo(() => new Set(heldText.split(' ').filter((property) => property !== '')), [heldText]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/inspector.tsx:121` `const held = authoredProperties(s);` via leitura de held
  - `src/editor/shell/inspector.tsx:122` `return STYLE_SECTIONS.filter((section) => sectionClosed(s.ui, section.id as SectionId, held))` via leitura de held
  - `src/editor/shell/inspector.tsx:129` `const held = authoredProperties(s);` via leitura de held
- **Criação:** `src/editor/shell/inspector.tsx:159` `const held = useMemo(() => new Set(heldText.split(' ').filter((property) => property !== '')), [heldText]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:159` `const held = useMemo(() => new Set(heldText.split(' ').filter((property) => property !== '')), [heldText]);`
- **Navegador:** não

## EST-L09a-171 — held — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:380` `const held = useMemo(() => new Set(heldText.split(' ').filter((property) => property !== '')), [heldText]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/inspector.tsx:380` `const held = useMemo(() => new Set(heldText.split(' ').filter((property) => property !== '')), [heldText]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/inspector.tsx:380` `const held = useMemo(() => new Set(heldText.split(' ').filter((property) => property !== '')), [heldText]);`
- **Escritores:**
  - `src/editor/shell/inspector.tsx:380` `const held = useMemo(() => new Set(heldText.split(' ').filter((property) => property !== '')), [heldText]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/inspector.tsx:121` `const held = authoredProperties(s);` via leitura de held
  - `src/editor/shell/inspector.tsx:122` `return STYLE_SECTIONS.filter((section) => sectionClosed(s.ui, section.id as SectionId, held))` via leitura de held
  - `src/editor/shell/inspector.tsx:129` `const held = authoredProperties(s);` via leitura de held
- **Criação:** `src/editor/shell/inspector.tsx:380` `const held = useMemo(() => new Set(heldText.split(' ').filter((property) => property !== '')), [heldText]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:380` `const held = useMemo(() => new Set(heldText.split(' ').filter((property) => property !== '')), [heldText]);`
- **Navegador:** não

## EST-L09a-172 — args — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:479` `const args = useMemo(() => ({ target: node.id }), [node.id]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/inspector.tsx:479` `const args = useMemo(() => ({ target: node.id }), [node.id]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/inspector.tsx:479` `const args = useMemo(() => ({ target: node.id }), [node.id]);`
- **Escritores:**
  - `src/editor/shell/inspector.tsx:479` `const args = useMemo(() => ({ target: node.id }), [node.id]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/inspector.tsx:203` `const axis = typeof d.door.args.property === 'string' ? d.door.args.property : null;` via leitura de args
  - `src/editor/shell/inspector.tsx:204` `const trackDoors = axis === null ? [] : TRACK_DOORS.filter((x) => x.door.args.property === axis);` via leitura de args
  - `src/editor/shell/inspector.tsx:294` `<DoorControl entry={SECTION_HEADER} args={{ section }} expanded={!closed} className="inspector-section__header">` via leitura de args
- **Criação:** `src/editor/shell/inspector.tsx:479` `const args = useMemo(() => ({ target: node.id }), [node.id]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:479` `const args = useMemo(() => ({ target: node.id }), [node.id]);`
- **Navegador:** não

## EST-L09a-173 — refusal — inspector.tsx
- **Declaração:** `src/editor/shell/inspector.tsx:642` `const refusal = useMemo(() => firstLockRefusal(document, selection, 'status.locked.edit'), [document, selection]);`
- **Forma:** cache memoizado (useMemo/memo), recalculado só quando as dependências mudam
- **Valores possíveis:**
  - V1 calculado `src/editor/shell/inspector.tsx:642` `const refusal = useMemo(() => firstLockRefusal(document, selection, 'status.locked.edit'), [document, selection]);`
  - V2 reaproveitado enquanto as dependências não mudam `src/editor/shell/inspector.tsx:642` `const refusal = useMemo(() => firstLockRefusal(document, selection, 'status.locked.edit'), [document, selection]);`
- **Escritores:**
  - `src/editor/shell/inspector.tsx:642` `const refusal = useMemo(() => firstLockRefusal(document, selection, 'status.locked.edit'), [document, selection]);` via o recálculo quando as dependências mudam
- **Leitores:**
  - `src/editor/shell/inspector.tsx:643` `if (refusal === null) return null;` via leitura de refusal
  - `src/editor/shell/inspector.tsx:646` `{messageText(locale, refusal)}` via leitura de refusal
- **Criação:** `src/editor/shell/inspector.tsx:642` `const refusal = useMemo(() => firstLockRefusal(document, selection, 'status.locked.edit'), [document, selection]);`
- **Descarte:** quando o componente desmonta `src/editor/shell/inspector.tsx:642` `const refusal = useMemo(() => firstLockRefusal(document, selection, 'status.locked.edit'), [document, selection]);`
- **Navegador:** não

## EST-L09a-174 — expanded — interactions.tsx
- **Declaração:** `src/editor/shell/interactions.tsx:105` `const [expanded, setExpanded] = useState(index === 0);`
- **Forma:** valor de estado do componente React (useState), gravado por setExpanded
- **Valores possíveis:**
  - V1 o valor inicial, na primeira renderização `src/editor/shell/interactions.tsx:105` `const [expanded, setExpanded] = useState(index === 0);`
  - V2 o valor depois de setExpanded `src/editor/shell/interactions.tsx:111` `<button className="interaction-card__summary" type="button" aria-expanded={expanded} onClick={() => setExpanded((was) => !was)}>` via setExpanded
- **Escritores:**
  - `src/editor/shell/interactions.tsx:111` `<button className="interaction-card__summary" type="button" aria-expanded={expanded} onClick={() => setExpanded((was) => !was)}>` via setExpanded
- **Leitores:**
  - `src/editor/shell/interactions.tsx:109` `interaction-card${expanded ? ' is-expanded' : ''}` via leitura de expanded
  - `src/editor/shell/interactions.tsx:118` `{expanded ? <div className="interaction-card__fields">` via leitura de expanded
  - `src/editor/shell/interactions.tsx:163` `{!expanded ? <p className="interaction-card__note">` via leitura de expanded
- **Criação:** `src/editor/shell/interactions.tsx:105` `const [expanded, setExpanded] = useState(index === 0);`
- **Descarte:** quando o componente desmonta `src/editor/shell/interactions.tsx:105` `const [expanded, setExpanded] = useState(index === 0);`
- **Navegador:** não

## Excluídos

## EXC-L09a-001
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/shell/crumb-fold.ts:15` `let used = (widths[0] ?? 0) + more;`
- **Motivo:** variável local da função de topo, criada a cada chamada e descartada no fim dela; não sobrevive à chamada nem é lida por outra entrada.

## EXC-L09a-002
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/shell/crumb-fold.ts:16` `let after = 0;`
- **Motivo:** variável local da função de topo, criada a cada chamada e descartada no fim dela; não sobrevive à chamada nem é lida por outra entrada.

## EXC-L09a-003
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/shell/interactions.tsx:174` `let count = 0;`
- **Motivo:** variável local da função de topo, criada a cada chamada e descartada no fim dela; não sobrevive à chamada nem é lida por outra entrada.

# Estado do lote L09b

Arquivos do lote L09b: as vistas e a moldura do editor (src/editor/shell/). Cada item abaixo é um valor que sobrevive à chamada que o escreveu e é lido por outra entrada.

## EST-L09b-001 — panel (referência do diálogo do seletor de link)
- **Declaração:** `src/editor/shell/link-picker.tsx:53` `const panel = useRef<HTMLDivElement>(null);`
- **Forma:** React ref (RefObject<HTMLDivElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o diálogo ser montado
  - V2 o elemento do diálogo depois de montado, enquanto o seletor está aberto
- **Escritores:**
  - `src/editor/shell/link-picker.tsx:70` `ref={panel}` via a renderização do diálogo do seletor
- **Leitores:**
  - `src/editor/shell/link-picker.tsx:54` `useOutsideLayer(panel, open !== null, () => closeLinkPicker(store));` via LinkPicker
  - `src/editor/shell/link-picker.tsx:56` `if (open !== null) panel.current?.focus();` via o efeito da abertura
- **Criação:** `src/editor/shell/link-picker.tsx:53` `const panel = useRef<HTMLDivElement>(null);`
- **Descarte:** `src/editor/shell/link-picker.tsx:53` `const panel = useRef<HTMLDivElement>(null);` (desmontagem do seletor)
- **Navegador:** não

## EST-L09b-002 — LAYERS (camadas abertas de cada editor)
- **Declaração:** `src/editor/shell/outside-layer.ts:14` `const LAYERS = new WeakMap<EditorStore, Set<Layer>>();`
- **Forma:** WeakMap<EditorStore, Set<Layer>>: um conjunto de camadas abertas por store do editor
- **Valores possíveis:**
  - V1 sem chave para o editor, antes da primeira camada
  - V2 uma chave cujo conjunto está vazio (a camada foi removida e o conjunto ficou)
  - V3 uma chave com uma ou mais camadas abertas
- **Escritores:**
  - `src/editor/shell/outside-layer.ts:26` `LAYERS.set(store, own);` via layersOf
  - `src/editor/shell/outside-layer.ts:52` `layers.add(layer);` via useOutsideLayer
  - `src/editor/shell/outside-layer.ts:54` `layers.delete(layer);` via a remoção do efeito
- **Leitores:**
  - `src/editor/shell/outside-layer.ts:16` `let layers = LAYERS.get(store);` via layersOf
  - `src/editor/shell/outside-layer.ts:51` `const layers = layersOf(store);` via useOutsideLayer
- **Criação:** `src/editor/shell/outside-layer.ts:14` `const LAYERS = new WeakMap<EditorStore, Set<Layer>>();`
- **Descarte:** fim-da-página `src/editor/shell/outside-layer.ts:14` `const LAYERS = new WeakMap<EditorStore, Set<Layer>>();`
- **Navegador:** não

## EST-L09b-003 — latest (fechador mais recente da camada)
- **Declaração:** `src/editor/shell/outside-layer.ts:34` `const latest = useRef(close);`
- **Forma:** React ref (() => void)
- **Valores possíveis:**
  - V1 o fechador da primeira renderização
  - V2 o fechador da renderização mais recente
- **Escritores:**
  - `src/editor/shell/outside-layer.ts:36` `latest.current = close;` via o layout effect
- **Leitores:**
  - `src/editor/shell/outside-layer.ts:48` `latest.current();` via dismiss
- **Criação:** `src/editor/shell/outside-layer.ts:34` `const latest = useRef(close);`
- **Descarte:** `src/editor/shell/outside-layer.ts:34` `const latest = useRef(close);` (desmontagem do componente)
- **Navegador:** não

## EST-L09b-004 — draft (texto digitado num campo de painel)
- **Declaração:** `src/editor/shell/panel-field.tsx:67` `const [draft, setDraft] = useState(value);`
- **Forma:** string
- **Valores possíveis:**
  - V1 o valor do documento na primeira renderização
  - V2 o texto digitado, ainda não guardado
  - V3 o texto esvaziado pela pessoa
- **Escritores:**
  - `src/editor/shell/panel-field.tsx:114` `setDraft(event.target.value);` via onChange
- **Leitores:**
  - `src/editor/shell/panel-field.tsx:106` `value={edited ? draft : display === undefined || value === '' ? value : display(value)}` via a renderização do input
  - `src/editor/shell/panel-field.tsx:87` `runWith(accept === undefined ? draft : accept(draft));` via keep
- **Criação:** `src/editor/shell/panel-field.tsx:67` `const [draft, setDraft] = useState(value);`
- **Descarte:** `src/editor/shell/panel-field.tsx:67` `const [draft, setDraft] = useState(value);` (desmontagem do campo)
- **Navegador:** não

## EST-L09b-005 — edited (há digitação não guardada no campo de painel)
- **Declaração:** `src/editor/shell/panel-field.tsx:68` `const [edited, setEdited] = useState(false);`
- **Forma:** boolean
- **Valores possíveis:**
  - V1 false: o campo mostra o valor do documento
  - V2 true: há digitação não guardada
- **Escritores:**
  - `src/editor/shell/panel-field.tsx:113` `setEdited(true);` via onChange
  - `src/editor/shell/panel-field.tsx:86` `setEdited(false);` via keep
  - `src/editor/shell/panel-field.tsx:117` `onBlur={() => setEdited(false)}` via a saída do campo
- **Leitores:**
  - `src/editor/shell/panel-field.tsx:106` `value={edited ? draft : display === undefined || value === '' ? value : display(value)}` via a renderização do input
  - `src/editor/shell/panel-field.tsx:85` `if (!edited) return;` via keep
- **Criação:** `src/editor/shell/panel-field.tsx:68` `const [edited, setEdited] = useState(false);`
- **Descarte:** `src/editor/shell/panel-field.tsx:68` `const [edited, setEdited] = useState(false);` (desmontagem do campo)
- **Navegador:** não

## EST-L09b-006 — input (referência do campo de painel)
- **Declaração:** `src/editor/shell/panel-field.tsx:69` `const input = useRef<HTMLInputElement>(null);`
- **Forma:** React ref (RefObject<HTMLInputElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o input ser montado
  - V2 o input da lista depois de montado
- **Escritores:**
  - `src/editor/shell/panel-field.tsx:98` `ref={input}` via a renderização do input
- **Leitores:**
  - `src/editor/shell/panel-field.tsx:71` `if (autoFocus) input.current?.focus();` via o efeito de autoFocus
- **Criação:** `src/editor/shell/panel-field.tsx:69` `const input = useRef<HTMLInputElement>(null);`
- **Descarte:** `src/editor/shell/panel-field.tsx:69` `const input = useRef<HTMLInputElement>(null);` (desmontagem do campo)
- **Navegador:** não

## EST-L09b-007 — openedAt (a abertura de uma camada sobreposta)
- **Declaração:** `src/editor/shell/popover.tsx:26` `const [openedAt, setOpenedAt] = useState<number | null>(null);`
- **Forma:** number | null: o valor de dismissals no momento da abertura
- **Valores possíveis:**
  - V1 null: fechada
  - V2 o número de dismissals com que abriu: aberta
  - V3 um número mais antigo que o dismissals atual: dispensada
- **Escritores:**
  - `src/editor/shell/popover.tsx:34` `setOpenedAt(value ? dismissals : null);` via setOpen
- **Leitores:**
  - `src/editor/shell/popover.tsx:27` `openedAt !== null && openedAt === dismissals` via usePopover
  - `src/editor/shell/popover.tsx:28` `const dismissed = openedAt !== null && !open;` via usePopover
- **Criação:** `src/editor/shell/popover.tsx:26` `const [openedAt, setOpenedAt] = useState<number | null>(null);`
- **Descarte:** `src/editor/shell/popover.tsx:26` `const [openedAt, setOpenedAt] = useState<number | null>(null);` (desmontagem do gatilho)
- **Navegador:** não

## EST-L09b-008 — own (referência da camada do popover)
- **Declaração:** `src/editor/shell/popover.tsx:62` `const own = useRef<HTMLElement | null>(null);`
- **Forma:** React ref (RefObject<HTMLElement | null>)
- **Valores possíveis:**
  - V1 null, antes de a camada ser montada
  - V2 a camada (o form ou o div) depois de montada
- **Escritores:**
  - `src/editor/shell/popover.tsx:87` `ref={own as RefObject<HTMLFormElement | null>}` via a renderização do form
  - `src/editor/shell/popover.tsx:91` `ref={own as RefObject<HTMLDivElement | null>}` via a renderização do div
- **Leitores:**
  - `src/editor/shell/popover.tsx:63` `useOutsideLayer(own, true, onDismiss, anchor);` via Popover
  - `src/editor/shell/popover.tsx:67` `const panel = own.current;` via o layout effect da colocação
  - `src/editor/shell/popover.tsx:78` `if (placed && takesFocus) own.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();` via o layout effect do foco
- **Criação:** `src/editor/shell/popover.tsx:62` `const own = useRef<HTMLElement | null>(null);`
- **Descarte:** `src/editor/shell/popover.tsx:62` `const own = useRef<HTMLElement | null>(null);` (desmontagem da camada)
- **Navegador:** não

## EST-L09b-009 — at (posição colocada do popover)
- **Declaração:** `src/editor/shell/popover.tsx:64` `const [at, setAt] = useState<Placed | null>(null);`
- **Forma:** Placed | null: esquerda, topo e altura máxima
- **Valores possíveis:**
  - V1 null: a camada ainda não foi colocada e é desenhada invisível
  - V2 a posição calculada, com a camada visível
- **Escritores:**
  - `src/editor/shell/popover.tsx:73` `setAt(floatBelow(from, { width, height }, { width: window.innerWidth, height: window.innerHeight }, edge, space));` via o layout effect da colocação
- **Leitores:**
  - `src/editor/shell/popover.tsx:76` `const placed = at !== null;` via Popover
  - `src/editor/shell/popover.tsx:80` `{ left: at.left, top: at.top }` via o estilo da camada
- **Criação:** `src/editor/shell/popover.tsx:64` `const [at, setAt] = useState<Placed | null>(null);`
- **Descarte:** `src/editor/shell/popover.tsx:64` `const [at, setAt] = useState<Placed | null>(null);` (desmontagem da camada)
- **Navegador:** não

## EST-L09b-010 — html (a página exportada do preview, memoizada)
- **Declaração:** `src/editor/shell/preview.tsx:32` `const html = useMemo(() => withKeyRelay(previewPage(document, MODEL_RULES, page, siteScripts)), [document, page]);`
- **Forma:** string: o HTML da página exportada com o relay de teclas
- **Valores possíveis:**
  - V1 o HTML calculado para o documento e a página abertos
  - V2 o HTML recalculado quando document ou a página aberta mudam
- **Escritores:**
  - `src/editor/shell/preview.tsx:32` `const html = useMemo(() => withKeyRelay(previewPage(document, MODEL_RULES, page, siteScripts)), [document, page]);` via o useMemo
- **Leitores:**
  - `src/editor/shell/preview.tsx:53` `srcDoc={html}` via a renderização do iframe do preview
- **Criação:** `src/editor/shell/preview.tsx:32` `const html = useMemo(() => withKeyRelay(previewPage(document, MODEL_RULES, page, siteScripts)), [document, page]);`
- **Descarte:** `src/editor/shell/preview.tsx:32` `const html = useMemo(() => withKeyRelay(previewPage(document, MODEL_RULES, page, siteScripts)), [document, page]);` (desmontagem do preview)
- **Navegador:** não

## EST-L09b-011 — frame (referência do iframe do preview)
- **Declaração:** `src/editor/shell/preview.tsx:33` `const frame = useRef<HTMLIFrameElement>(null);`
- **Forma:** React ref (RefObject<HTMLIFrameElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o iframe ser montado
  - V2 o iframe do preview depois de montado
- **Escritores:**
  - `src/editor/shell/preview.tsx:53` `srcDoc={html}` via a renderização do iframe que recebe a ref
- **Leitores:**
  - `src/editor/shell/preview.tsx:42` `event.source !== frame.current?.contentWindow` via o relay de teclas
- **Criação:** `src/editor/shell/preview.tsx:33` `const frame = useRef<HTMLIFrameElement>(null);`
- **Descarte:** `src/editor/shell/preview.tsx:33` `const frame = useRef<HTMLIFrameElement>(null);` (desmontagem do preview)
- **Navegador:** não

## EST-L09b-012 — RegionBoundary (o estado da barreira de região)
- **Declaração:** `src/editor/shell/region-boundary.tsx:36` `override state: State = { failed: false };`
- **Forma:** classe de componente com state { failed: boolean } e o campo unsubscribe (() => void) | null
- **Valores possíveis:**
  - V1 failed false: a barreira desenha os filhos
  - V2 failed true: a barreira desenha o fallback, depois de um erro de renderização
  - V3 com a inscrição viva na store
  - V4 com a inscrição removida, depois da desmontagem
- **Escritores:**
  - `src/editor/shell/region-boundary.tsx:40` `return { failed: true };` via getDerivedStateFromError
  - `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });` via a inscrição na store
  - `src/editor/shell/region-boundary.tsx:44` `this.unsubscribe =` via componentDidMount
- **Leitores:**
  - `src/editor/shell/region-boundary.tsx:60` `return this.state.failed ? <RegionFallback region={this.props.region} /> : this.props.children;` via render
  - `src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();` via componentWillUnmount
- **Criação:** `src/editor/shell/region-boundary.tsx:36` `override state: State = { failed: false };`
- **Descarte:** `src/editor/shell/region-boundary.tsx:50` `override componentWillUnmount(): void {` (a desmontagem da região)
- **Navegador:** não

## EST-L09b-013 — COLUMNS (larguras de coluna por linha do inspector)
- **Declaração:** `src/editor/shell/row-fit.ts:27` `const COLUMNS = new WeakMap<HTMLElement, readonly number[]>();`
- **Forma:** WeakMap<HTMLElement, readonly number[]>
- **Valores possíveis:**
  - V1 sem entrada para a linha
  - V2 a linha com as larguras de coluna lidas enquanto estava lado a lado
- **Escritores:**
  - `src/editor/shell/row-fit.ts:48` `COLUMNS.set(row, style.gridTemplateColumns.split(' ').map((track) => parseFloat(track)));` via fitsBeside
- **Leitores:**
  - `src/editor/shell/row-fit.ts:49` `const tracks = COLUMNS.get(row);` via fitsBeside
- **Criação:** `src/editor/shell/row-fit.ts:27` `const COLUMNS = new WeakMap<HTMLElement, readonly number[]>();`
- **Descarte:** fim-da-página `src/editor/shell/row-fit.ts:27` `const COLUMNS = new WeakMap<HTMLElement, readonly number[]>();`
- **Navegador:** não

## EST-L09b-014 — BESIDE_TEXT (o que um campo toma ao lado do texto)
- **Declaração:** `src/editor/shell/row-fit.ts:34` `const BESIDE_TEXT = new WeakMap<HTMLInputElement, number>();`
- **Forma:** WeakMap<HTMLInputElement, number>
- **Valores possíveis:**
  - V1 sem entrada para o campo
  - V2 o campo com o número medido enquanto ele transbordava
- **Escritores:**
  - `src/editor/shell/row-fit.ts:73` `BESIDE_TEXT.set(choice, choice.getBoundingClientRect().width + overflow - text);` via fitsBeside
- **Leitores:**
  - `src/editor/shell/row-fit.ts:74` `BESIDE_TEXT.get(choice) ?? 0` via fitsBeside
- **Criação:** `src/editor/shell/row-fit.ts:34` `const BESIDE_TEXT = new WeakMap<HTMLInputElement, number>();`
- **Descarte:** fim-da-página `src/editor/shell/row-fit.ts:34` `const BESIDE_TEXT = new WeakMap<HTMLInputElement, number>();`
- **Navegador:** não

## EST-L09b-015 — frame (o identificador do quadro pedido em row-fit)
- **Declaração:** `src/editor/shell/row-fit.ts:100` `let frame = 0;`
- **Forma:** number: o identificador do requestAnimationFrame; 0 quando não há nenhum
- **Valores possíveis:**
  - V1 0: nenhum quadro pedido
  - V2 o identificador do quadro pendente
- **Escritores:**
  - `src/editor/shell/row-fit.ts:116` `if (frame === 0 && !removed) frame = requestAnimationFrame(judge);` via soon
  - `src/editor/shell/row-fit.ts:103` `frame = 0;` via judge
- **Leitores:**
  - `src/editor/shell/row-fit.ts:116` `if (frame === 0 && !removed) frame = requestAnimationFrame(judge);` via soon
  - `src/editor/shell/row-fit.ts:129` `cancelAnimationFrame(frame);` via a remoção
- **Criação:** `src/editor/shell/row-fit.ts:100` `let frame = 0;`
- **Descarte:** `src/editor/shell/row-fit.ts:129` `cancelAnimationFrame(frame);` (a remoção de installRowFit)
- **Navegador:** não

## EST-L09b-016 — removed (a remoção de installRowFit)
- **Declaração:** `src/editor/shell/row-fit.ts:101` `let removed = false;`
- **Forma:** boolean
- **Valores possíveis:**
  - V1 false: os observadores ainda pedem quadros
  - V2 true: a remoção correu e nenhum quadro novo é pedido
- **Escritores:**
  - `src/editor/shell/row-fit.ts:101` `let removed = false;` via a criação
  - `src/editor/shell/row-fit.ts:128` `removed = true;` via a remoção
- **Leitores:**
  - `src/editor/shell/row-fit.ts:116` `if (frame === 0 && !removed) frame = requestAnimationFrame(judge);` via soon
- **Criação:** `src/editor/shell/row-fit.ts:101` `let removed = false;`
- **Descarte:** `src/editor/shell/row-fit.ts:128` `removed = true;` (a remoção de installRowFit)
- **Navegador:** não

## EST-L09b-017 — root (referência do contêiner da shell)
- **Declaração:** `src/editor/shell/shell.tsx:93` `const root = useRef<HTMLDivElement>(null);`
- **Forma:** React ref (RefObject<HTMLDivElement | null>)
- **Valores possíveis:**
  - V1 null, antes de a shell ser montada
  - V2 o div .shell depois de montado
- **Escritores:**
  - `src/editor/shell/shell.tsx:153` `ref={root}` via a renderização do contêiner
- **Leitores:**
  - `src/editor/shell/shell.tsx:95` `const container = root.current;` via usePreviewModal
- **Criação:** `src/editor/shell/shell.tsx:93` `const root = useRef<HTMLDivElement>(null);`
- **Descarte:** `src/editor/shell/shell.tsx:93` `const root = useRef<HTMLDivElement>(null);` (desmontagem da shell)
- **Navegador:** não

## EST-L09b-018 — zoom (a medida da moldura que o canvas reporta)
- **Declaração:** `src/editor/shell/shell.tsx:118` `const [zoom, setZoom] = useState(1);`
- **Forma:** number
- **Valores possíveis:**
  - V1 1, o valor inicial
  - V2 o zoom que ajusta a moldura, reportado pelo canvas
- **Escritores:**
  - `src/editor/shell/shell.tsx:152` `<ReportFitZoom.Provider value={setZoom}>` via o provedor do setter
- **Leitores:**
  - `src/editor/shell/shell.tsx:151` `<FitZoom.Provider value={zoom}>` via o provedor do valor
- **Criação:** `src/editor/shell/shell.tsx:118` `const [zoom, setZoom] = useState(1);`
- **Descarte:** `src/editor/shell/shell.tsx:118` `const [zoom, setZoom] = useState(1);` (desmontagem da shell)
- **Navegador:** não

## EST-L09b-019 — input (referência do campo de nome da página)
- **Declaração:** `src/editor/shell/sidebar/explorer.tsx:67` `const input = useRef<HTMLInputElement>(null);`
- **Forma:** React ref (RefObject<HTMLInputElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o campo ser montado
  - V2 o campo de nome da página depois de montado
- **Escritores:**
  - `src/editor/shell/sidebar/explorer.tsx:91` `ref={input}` via a renderização do campo
- **Leitores:**
  - `src/editor/shell/sidebar/explorer.tsx:70` `document.activeElement !== input.current` via o efeito que repõe o nome
  - `src/editor/shell/sidebar/explorer.tsx:78` `input.current.focus();` via o efeito da página recem-criada
- **Criação:** `src/editor/shell/sidebar/explorer.tsx:67` `const input = useRef<HTMLInputElement>(null);`
- **Descarte:** `src/editor/shell/sidebar/explorer.tsx:67` `const input = useRef<HTMLInputElement>(null);` (desmontagem da linha)
- **Navegador:** não

## EST-L09b-020 — makers (as portas do explorer-files, em Explorer)
- **Declaração:** `src/editor/shell/sidebar/explorer.tsx:119` `const makers = useMemo(() => paletteDoors('explorer-files'), []);`
- **Forma:** TreeDoors memoizado
- **Valores possíveis:**
  - V1 o conjunto das portas do explorer-files, calculado uma vez
- **Escritores:**
  - `src/editor/shell/sidebar/explorer.tsx:119` `const makers = useMemo(() => paletteDoors('explorer-files'), []);` via o useMemo
- **Leitores:**
  - `src/editor/shell/sidebar/explorer.tsx:131` `makers.newFile === undefined` via a renderização da seção de arquivos
- **Criação:** `src/editor/shell/sidebar/explorer.tsx:119` `const makers = useMemo(() => paletteDoors('explorer-files'), []);`
- **Descarte:** `src/editor/shell/sidebar/explorer.tsx:119` `const makers = useMemo(() => paletteDoors('explorer-files'), []);` (desmontagem do Explorer)
- **Navegador:** não

## EST-L09b-021 — rows (as linhas da árvore de arquivos, memoizadas)
- **Declaração:** `src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`
- **Forma:** readonly TreeRow[] memoizado
- **Valores possíveis:**
  - V1 as linhas do documento
  - V2 as linhas recalculadas quando o documento muda
- **Escritores:**
  - `src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);` via o useMemo
- **Leitores:**
  - `src/editor/shell/sidebar/explorer.tsx:165` `rows.map((row) => (` via a renderização da lista
- **Criação:** `src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`
- **Descarte:** `src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);` (desmontagem de FileRows)
- **Navegador:** não

## EST-L09b-022 — makers (as portas do explorer-files, em FileRows)
- **Declaração:** `src/editor/shell/sidebar/explorer.tsx:149` `const makers = useMemo(() => paletteDoors('explorer-files'), []);`
- **Forma:** TreeDoors memoizado
- **Valores possíveis:**
  - V1 o conjunto das portas do explorer-files, calculado uma vez
- **Escritores:**
  - `src/editor/shell/sidebar/explorer.tsx:149` `const makers = useMemo(() => paletteDoors('explorer-files'), []);` via o useMemo
- **Leitores:**
  - `src/editor/shell/sidebar/explorer.tsx:166` `doors={makers}` via a renderização de TreeRow
- **Criação:** `src/editor/shell/sidebar/explorer.tsx:149` `const makers = useMemo(() => paletteDoors('explorer-files'), []);`
- **Descarte:** `src/editor/shell/sidebar/explorer.tsx:149` `const makers = useMemo(() => paletteDoors('explorer-files'), []);` (desmontagem de FileRows)
- **Navegador:** não

## EST-L09b-023 — list (referência da lista de arquivos)
- **Declaração:** `src/editor/shell/sidebar/explorer.tsx:151` `const list = useRef<HTMLDivElement>(null);`
- **Forma:** React ref (RefObject<HTMLDivElement | null>)
- **Valores possíveis:**
  - V1 null, antes de a lista ser montada
  - V2 o contêiner das linhas depois de montado
- **Escritores:**
  - `src/editor/shell/sidebar/explorer.tsx:164` `ref={list}` via a renderização do contêiner
- **Leitores:**
  - `src/editor/shell/sidebar/explorer.tsx:153` `if (list.current !== null) fitNames(list.current);` via o layout effect
- **Criação:** `src/editor/shell/sidebar/explorer.tsx:151` `const list = useRef<HTMLDivElement>(null);`
- **Descarte:** `src/editor/shell/sidebar/explorer.tsx:151` `const list = useRef<HTMLDivElement>(null);` (desmontagem de FileRows)
- **Navegador:** não

## EST-L09b-024 — folders (as pastas de destino de uma linha, memoizadas)
- **Declaração:** `src/editor/shell/sidebar/explorer.tsx:229` `const folders = useMemo(() => (row.folder ? NO_FOLDERS : folderPaths(document).filter((one) => !pathGenerated(one))), [document, row.folder]);`
- **Forma:** readonly string[] memoizado
- **Valores possíveis:**
  - V1 NO_FOLDERS quando a linha é uma pasta
  - V2 as pastas de destino da linha, recalculadas quando o documento muda
- **Escritores:**
  - `src/editor/shell/sidebar/explorer.tsx:229` `const folders = useMemo(() => (row.folder ? NO_FOLDERS : folderPaths(document).filter((one) => !pathGenerated(one))), [document, row.folder]);` via o useMemo
- **Leitores:**
  - `src/editor/shell/sidebar/explorer.tsx:316` `folders.map((folder) => (` via a renderização das pastas de destino
- **Criação:** `src/editor/shell/sidebar/explorer.tsx:229` `const folders = useMemo(() => (row.folder ? NO_FOLDERS : folderPaths(document).filter((one) => !pathGenerated(one))), [document, row.folder]);`
- **Descarte:** `src/editor/shell/sidebar/explorer.tsx:229` `const folders = useMemo(() => (row.folder ? NO_FOLDERS : folderPaths(document).filter((one) => !pathGenerated(one))), [document, row.folder]);` (desmontagem da linha)
- **Navegador:** não

## EST-L09b-025 — moving (a lista de pastas de destino aberta numa linha)
- **Declaração:** `src/editor/shell/sidebar/explorer.tsx:230` `const [moving, setMoving] = useState(false);`
- **Forma:** boolean
- **Valores possíveis:**
  - V1 false: as pastas de destino não são desenhadas
  - V2 true: as pastas de destino são oferecidas
- **Escritores:**
  - `src/editor/shell/sidebar/explorer.tsx:308` `onClick={() => setMoving((one) => !one)}` via o botão Mover para
  - `src/editor/shell/sidebar/explorer.tsx:315` `onClick={() => setMoving(false)}` via um toque nas pastas
- **Leitores:**
  - `src/editor/shell/sidebar/explorer.tsx:314` `moving && target !== undefined` via a renderização das pastas de destino
- **Criação:** `src/editor/shell/sidebar/explorer.tsx:230` `const [moving, setMoving] = useState(false);`
- **Descarte:** `src/editor/shell/sidebar/explorer.tsx:230` `const [moving, setMoving] = useState(false);` (desmontagem da linha)
- **Navegador:** não

## EST-L09b-026 — query (o texto da busca do Insert)
- **Declaração:** `src/editor/shell/sidebar/insert.tsx:65` `const [query, setQuery] = useState('');`
- **Forma:** string
- **Valores possíveis:**
  - V1 vazio: nenhuma busca, todos os grupos como estão
  - V2 o texto digitado, que filtra os grupos
- **Escritores:**
  - `src/editor/shell/sidebar/insert.tsx:83` `onChange={(event) => setQuery(event.target.value)}` via o campo de busca
- **Leitores:**
  - `src/editor/shell/sidebar/insert.tsx:66` `const searching = query.trim() !== '';` via Insert
  - `src/editor/shell/sidebar/insert.tsx:72` `paletteRank(query,` via a ordenação das entradas
- **Criação:** `src/editor/shell/sidebar/insert.tsx:65` `const [query, setQuery] = useState('');`
- **Descarte:** `src/editor/shell/sidebar/insert.tsx:65` `const [query, setQuery] = useState('');` (desmontagem do Insert)
- **Navegador:** não

## EST-L09b-027 — input (referência do campo de nome de uma linha de Camadas)
- **Declaração:** `src/editor/shell/sidebar/layers.tsx:72` `const input = useRef<HTMLInputElement>(null);`
- **Forma:** React ref (RefObject<HTMLInputElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o campo ser montado
  - V2 o campo de renomear a linha depois de montado
- **Escritores:**
  - `src/editor/shell/sidebar/layers.tsx:88` `ref={input}` via a renderização do campo
- **Leitores:**
  - `src/editor/shell/sidebar/layers.tsx:74` `input.current?.focus();` via o efeito de montagem
  - `src/editor/shell/sidebar/layers.tsx:83` `input.current?.value ?? node.name` via keep
- **Criação:** `src/editor/shell/sidebar/layers.tsx:72` `const input = useRef<HTMLInputElement>(null);`
- **Descarte:** `src/editor/shell/sidebar/layers.tsx:72` `const input = useRef<HTMLInputElement>(null);` (desmontagem do campo)
- **Navegador:** não

## EST-L09b-028 — open (a paleta de cores de uma linha de Camadas)
- **Declaração:** `src/editor/shell/sidebar/layers.tsx:131` `const [open, setOpen] = useState(false);`
- **Forma:** boolean
- **Valores possíveis:**
  - V1 false: a paleta de cores está fechada
  - V2 true: a paleta de cores está aberta
- **Escritores:**
  - `src/editor/shell/sidebar/layers.tsx:141` `setOpen((one) => !one)` via um toque no ponto
  - `src/editor/shell/sidebar/layers.tsx:146` `onClick={() => setOpen(false)}` via um toque num colorido
- **Leitores:**
  - `src/editor/shell/sidebar/layers.tsx:140` `open ? ' is-open' : ''` via a classe da paleta
- **Criação:** `src/editor/shell/sidebar/layers.tsx:131` `const [open, setOpen] = useState(false);`
- **Descarte:** `src/editor/shell/sidebar/layers.tsx:131` `const [open, setOpen] = useState(false);` (desmontagem da linha)
- **Navegador:** não

## EST-L09b-029 — TEXT_TYPES (os tipos de elemento de conteúdo texto)
- **Declaração:** `src/editor/shell/sidebar/layers.tsx:183` `const TEXT_TYPES: ReadonlySet<string> = new Set(manifest.elements.elements.filter((e) => e.content === 'text').map((e) => e.id));`
- **Forma:** ReadonlySet<string>
- **Valores possíveis:**
  - V1 o conjunto dos tipos de elemento de conteúdo texto do manifesto
- **Escritores:**
  - `src/editor/shell/sidebar/layers.tsx:183` `const TEXT_TYPES: ReadonlySet<string> = new Set(manifest.elements.elements.filter((e) => e.content === 'text').map((e) => e.id));` via a montagem do módulo
- **Leitores:**
  - `src/editor/shell/sidebar/layers.tsx:187` `TEXT_TYPES.has(node.type)` via EmptyMark
- **Criação:** `src/editor/shell/sidebar/layers.tsx:183` `const TEXT_TYPES: ReadonlySet<string> = new Set(manifest.elements.elements.filter((e) => e.content === 'text').map((e) => e.id));`
- **Descarte:** fim-da-página `src/editor/shell/sidebar/layers.tsx:183` `const TEXT_TYPES: ReadonlySet<string> = new Set(manifest.elements.elements.filter((e) => e.content === 'text').map((e) => e.id));`
- **Navegador:** não

## EST-L09b-030 — LayersRow (o componente de linha das Camadas, memoizado)
- **Declaração:** `src/editor/shell/sidebar/layers.tsx:225` `const LayersRow = memo(function LayersRow({ node, depth, view }: { readonly node: DocNode; readonly depth: number; readonly view: SearchView | null }) {`
- **Forma:** componente memoizado por React.memo, de identidade estável
- **Valores possíveis:**
  - V1 o componente devolvido por memo, recriado só quando as suas props mudam
- **Escritores:**
  - `src/editor/shell/sidebar/layers.tsx:225` `const LayersRow = memo(function LayersRow({ node, depth, view }: { readonly node: DocNode; readonly depth: number; readonly view: SearchView | null }) {` via React.memo
- **Leitores:**
  - `src/editor/shell/sidebar/layers.tsx:409` `<LayersRow node={node} depth={depth} view={view} />` via LayerSlot
- **Criação:** `src/editor/shell/sidebar/layers.tsx:225` `const LayersRow = memo(function LayersRow({ node, depth, view }: { readonly node: DocNode; readonly depth: number; readonly view: SearchView | null }) {`
- **Descarte:** fim-da-página `src/editor/shell/sidebar/layers.tsx:225` `const LayersRow = memo(function LayersRow({ node, depth, view }: { readonly node: DocNode; readonly depth: number; readonly view: SearchView | null }) {`
- **Navegador:** não

## EST-L09b-031 — LayerSlot (o componente do lugar de uma linha, memoizado)
- **Declaração:** `src/editor/shell/sidebar/layers.tsx:406` `const LayerSlot = memo(function LayerSlot({ node, depth, index, view, insertAt }: { readonly node: DocNode; readonly depth: number; readonly index: number; readonly view: SearchView | null; readonly insertAt: InsertAt | null }) {`
- **Forma:** componente memoizado por React.memo, de identidade estável
- **Valores possíveis:**
  - V1 o componente devolvido por memo, recriado só quando as suas props mudam
- **Escritores:**
  - `src/editor/shell/sidebar/layers.tsx:406` `const LayerSlot = memo(function LayerSlot({ node, depth, index, view, insertAt }: { readonly node: DocNode; readonly depth: number; readonly index: number; readonly view: SearchView | null; readonly insertAt: InsertAt | null }) {` via React.memo
- **Leitores:**
  - `src/editor/shell/sidebar/layers.tsx:575` `<LayerSlot key={node.id} node={node} depth={depth} index={index} view={view} insertAt={insertAt} />` via a renderização do tabuleiro
- **Criação:** `src/editor/shell/sidebar/layers.tsx:406` `const LayerSlot = memo(function LayerSlot({ node, depth, index, view, insertAt }: { readonly node: DocNode; readonly depth: number; readonly index: number; readonly view: SearchView | null; readonly insertAt: InsertAt | null }) {`
- **Descarte:** fim-da-página `src/editor/shell/sidebar/layers.tsx:406` `const LayerSlot = memo(function LayerSlot({ node, depth, index, view, insertAt }: { readonly node: DocNode; readonly depth: number; readonly index: number; readonly view: SearchView | null; readonly insertAt: InsertAt | null }) {`
- **Navegador:** não

## EST-L09b-032 — view (a vista da busca da árvore, memoizada)
- **Declaração:** `src/editor/shell/sidebar/layers.tsx:457` `const view = useMemo(() => (tree ? searchView(tree, query) : null), [tree, query]);`
- **Forma:** SearchView | null memoizado
- **Valores possíveis:**
  - V1 null quando não há árvore
  - V2 a vista da busca, recalculada quando a árvore ou a busca mudam
- **Escritores:**
  - `src/editor/shell/sidebar/layers.tsx:457` `const view = useMemo(() => (tree ? searchView(tree, query) : null), [tree, query]);` via o useMemo
- **Leitores:**
  - `src/editor/shell/sidebar/layers.tsx:569` `view.matches.size === 0` via a nota de busca sem resultado
- **Criação:** `src/editor/shell/sidebar/layers.tsx:457` `const view = useMemo(() => (tree ? searchView(tree, query) : null), [tree, query]);`
- **Descarte:** `src/editor/shell/sidebar/layers.tsx:457` `const view = useMemo(() => (tree ? searchView(tree, query) : null), [tree, query]);` (desmontagem da seção)
- **Navegador:** não

## EST-L09b-033 — insertAt (onde um clique do Insert insere, memoizado)
- **Declaração:** `src/editor/shell/sidebar/layers.tsx:463` `const insertAt = useMemo(() => (said === null ? null : (JSON.parse(said) as InsertAt)), [said]);`
- **Forma:** InsertAt | null memoizado
- **Valores possíveis:**
  - V1 null quando não há destino
  - V2 o destino (o pai e o irmão anterior), recalculado quando o texto muda
- **Escritores:**
  - `src/editor/shell/sidebar/layers.tsx:463` `const insertAt = useMemo(() => (said === null ? null : (JSON.parse(said) as InsertAt)), [said]);` via o useMemo
- **Leitores:**
  - `src/editor/shell/sidebar/layers.tsx:575` `insertAt={insertAt}` via a renderização de LayerSlot
- **Criação:** `src/editor/shell/sidebar/layers.tsx:463` `const insertAt = useMemo(() => (said === null ? null : (JSON.parse(said) as InsertAt)), [said]);`
- **Descarte:** `src/editor/shell/sidebar/layers.tsx:463` `const insertAt = useMemo(() => (said === null ? null : (JSON.parse(said) as InsertAt)), [said]);` (desmontagem da seção)
- **Navegador:** não

## EST-L09b-034 — rows (as linhas que a árvore mostra, memoizadas)
- **Declaração:** `src/editor/shell/sidebar/layers.tsx:465` `const rows = useMemo(() => (tree === undefined ? [] : shownRows(tree, (id) => !collapsed.includes(id), view)), [tree, collapsed, view]);`
- **Forma:** readonly { node; depth }[] memoizado
- **Valores possíveis:**
  - V1 vazio quando não há árvore
  - V2 as linhas em ordem de desenho, recalculadas quando a árvore, o recolhido ou a vista mudam
- **Escritores:**
  - `src/editor/shell/sidebar/layers.tsx:465` `const rows = useMemo(() => (tree === undefined ? [] : shownRows(tree, (id) => !collapsed.includes(id), view)), [tree, collapsed, view]);` via o useMemo
- **Leitores:**
  - `src/editor/shell/sidebar/layers.tsx:573` `height: rows.length * ROW` via a altura do tabuleiro
- **Criação:** `src/editor/shell/sidebar/layers.tsx:465` `const rows = useMemo(() => (tree === undefined ? [] : shownRows(tree, (id) => !collapsed.includes(id), view)), [tree, collapsed, view]);`
- **Descarte:** `src/editor/shell/sidebar/layers.tsx:465` `const rows = useMemo(() => (tree === undefined ? [] : shownRows(tree, (id) => !collapsed.includes(id), view)), [tree, collapsed, view]);` (desmontagem da seção)
- **Navegador:** não

## EST-L09b-035 — scroller (referência do rolador da árvore)
- **Declaração:** `src/editor/shell/sidebar/layers.tsx:467` `const scroller = useRef<HTMLDivElement>(null);`
- **Forma:** React ref (RefObject<HTMLDivElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o rolador ser montado
  - V2 o div da árvore depois de montado
- **Escritores:**
  - `src/editor/shell/sidebar/layers.tsx:570` `ref={scroller}` via a renderização do rolador
- **Leitores:**
  - `src/editor/shell/sidebar/layers.tsx:470` `const el = scroller.current;` via o layout effect da janela
- **Criação:** `src/editor/shell/sidebar/layers.tsx:467` `const scroller = useRef<HTMLDivElement>(null);`
- **Descarte:** `src/editor/shell/sidebar/layers.tsx:467` `const scroller = useRef<HTMLDivElement>(null);` (desmontagem da seção)
- **Navegador:** não

## EST-L09b-036 — window (a janela de rolagem da árvore)
- **Declaração:** `src/editor/shell/sidebar/layers.tsx:468` `const [window, setWindow] = useState({ top: 0, height: 600 });`
- **Forma:** { top: number; height: number }: a parte da árvore que o rolador mostra
- **Valores possíveis:**
  - V1 { top: 0, height: 600 }, o inicial
  - V2 a medida do rolador (o topo rolado e a altura visível)
- **Escritores:**
  - `src/editor/shell/sidebar/layers.tsx:472` `setWindow({ top: el.scrollTop, height: el.clientHeight })` via measure
- **Leitores:**
  - `src/editor/shell/sidebar/layers.tsx:514` `Math.floor(window.top / ROW)` via first
  - `src/editor/shell/sidebar/layers.tsx:515` `(window.top + window.height) / ROW` via last
- **Criação:** `src/editor/shell/sidebar/layers.tsx:468` `const [window, setWindow] = useState({ top: 0, height: 600 });`
- **Descarte:** `src/editor/shell/sidebar/layers.tsx:468` `const [window, setWindow] = useState({ top: 0, height: 600 });` (desmontagem da seção)
- **Navegador:** não

## EST-L09b-037 — drawn (as linhas desenhadas da janela, memoizadas)
- **Declaração:** `src/editor/shell/sidebar/layers.tsx:516` `const drawn = useMemo(() => {`
- **Forma:** readonly { node; depth; index }[] memoizado
- **Valores possíveis:**
  - V1 as linhas da janela acrescidas do overscan, do topo, do fim e do stop de Tab, recalculadas quando rows, first, last ou tabStop mudam
- **Escritores:**
  - `src/editor/shell/sidebar/layers.tsx:516` `const drawn = useMemo(() => {` via o useMemo
- **Leitores:**
  - `src/editor/shell/sidebar/layers.tsx:574` `drawn.map(({ node, depth, index }) => (` via a renderização do tabuleiro
- **Criação:** `src/editor/shell/sidebar/layers.tsx:516` `const drawn = useMemo(() => {`
- **Descarte:** `src/editor/shell/sidebar/layers.tsx:516` `const drawn = useMemo(() => {` (desmontagem da seção)
- **Navegador:** não

## EST-L09b-038 — scrolledTo (o nó primário já trazido à vista)
- **Declaração:** `src/editor/shell/sidebar/layers.tsx:537` `const scrolledTo = useRef<string | null>(null);`
- **Forma:** React ref (string | null)
- **Valores possíveis:**
  - V1 null: nenhum nó foi trazido à vista ainda
  - V2 o id do nó primário já trazido à vista
- **Escritores:**
  - `src/editor/shell/sidebar/layers.tsx:542` `scrolledTo.current = primary;` via o efeito que segue a seleção
- **Leitores:**
  - `src/editor/shell/sidebar/layers.tsx:541` `scrolledTo.current === primary` via o efeito que segue a seleção
- **Criação:** `src/editor/shell/sidebar/layers.tsx:537` `const scrolledTo = useRef<string | null>(null);`
- **Descarte:** `src/editor/shell/sidebar/layers.tsx:537` `const scrolledTo = useRef<string | null>(null);` (desmontagem da seção)
- **Navegador:** não

## EST-L09b-039 — field (referência do campo de nome de classe)
- **Declaração:** `src/editor/shell/sidebar/styles.tsx:61` `const field = useRef<HTMLInputElement>(null);`
- **Forma:** React ref (RefObject<HTMLInputElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o campo ser montado
  - V2 o campo de nome da classe depois de montado
- **Escritores:**
  - `src/editor/shell/sidebar/styles.tsx:75` `ref={field}` via a renderização do campo
- **Leitores:**
  - `src/editor/shell/sidebar/styles.tsx:64` `field.current.value = name` via o efeito que repõe o nome
  - `src/editor/shell/sidebar/styles.tsx:67` `field.current?.value ?? name` via keep
- **Criação:** `src/editor/shell/sidebar/styles.tsx:61` `const field = useRef<HTMLInputElement>(null);`
- **Descarte:** `src/editor/shell/sidebar/styles.tsx:61` `const field = useRef<HTMLInputElement>(null);` (desmontagem da linha)
- **Navegador:** não

## EST-L09b-040 — FitZoom (o contexto do zoom que ajusta a moldura)
- **Declaração:** `src/editor/shell/slots.tsx:26` `export const FitZoom = createContext<number>(1);`
- **Forma:** React context (number)
- **Valores possíveis:**
  - V1 1, o valor por omissão fora do provedor
  - V2 o zoom da shell fornecido pelo provedor
- **Escritores:**
  - `src/editor/shell/shell.tsx:151` `<FitZoom.Provider value={zoom}>` via o provedor
- **Leitores:**
  - `src/editor/shell/slots.tsx:30` `return useContext(FitZoom);` via useFitZoom
  - `src/editor/shell/canvas.tsx:79` `const zoom = useFitZoom();` via CanvasColumn
- **Criação:** `src/editor/shell/slots.tsx:26` `export const FitZoom = createContext<number>(1);`
- **Descarte:** fim-da-página `src/editor/shell/slots.tsx:26` `export const FitZoom = createContext<number>(1);`
- **Navegador:** não

## EST-L09b-041 — ReportFitZoom (o contexto que reporta o zoom)
- **Declaração:** `src/editor/shell/slots.tsx:27` `export const ReportFitZoom = createContext<(zoom: number) => void>(() => undefined);`
- **Forma:** React context ((zoom: number) => void)
- **Valores possíveis:**
  - V1 a função vazia, por omissão fora do provedor
  - V2 o setter do zoom da shell
- **Escritores:**
  - `src/editor/shell/shell.tsx:152` `<ReportFitZoom.Provider value={setZoom}>` via o provedor
- **Leitores:**
  - `src/editor/shell/canvas.tsx:280` `const report = useContext(ReportFitZoom);` via CanvasColumn
- **Criação:** `src/editor/shell/slots.tsx:27` `export const ReportFitZoom = createContext<(zoom: number) => void>(() => undefined);`
- **Descarte:** fim-da-página `src/editor/shell/slots.tsx:27` `export const ReportFitZoom = createContext<(zoom: number) => void>(() => undefined);`
- **Navegador:** não

## EST-L09b-042 — held (a mensagem da barra de status durante o arraste)
- **Declaração:** `src/editor/shell/status-bar.tsx:57` `const [held, setHeld] = useState<{ words: string; message: Message | null; pinned: Message | null }>({ words: said, message, pinned: null });`
- **Forma:** { words: string; message: Message | null; pinned: Message | null }
- **Valores possíveis:**
  - V1 o inicial { words: said, message, pinned: null }
  - V2 com as palavras do drop durante o arraste
  - V3 com a mensagem fixada (pinned)
- **Escritores:**
  - `src/editor/shell/status-bar.tsx:59` `setHeld(next);` via a renderização que corrige o estado
- **Leitores:**
  - `src/editor/shell/status-bar.tsx:58` `said !== held.words` via o cálculo de next
  - `src/editor/shell/status-bar.tsx:60` `next.pinned !== null` via o cálculo do texto mostrado
- **Criação:** `src/editor/shell/status-bar.tsx:57` `const [held, setHeld] = useState<{ words: string; message: Message | null; pinned: Message | null }>({ words: said, message, pinned: null });`
- **Descarte:** `src/editor/shell/status-bar.tsx:57` `const [held, setHeld] = useState<{ words: string; message: Message | null; pinned: Message | null }>({ words: said, message, pinned: null });` (desmontagem da barra)
- **Navegador:** não

## EST-L09b-043 — nav (referência do navegador do fio de Ariadne)
- **Declaração:** `src/editor/shell/status-bar.tsx:151` `const nav = useRef<HTMLElement>(null);`
- **Forma:** React ref (RefObject<HTMLElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o nav ser montado
  - V2 o nav do fio de Ariadne depois de montado
- **Escritores:**
  - `src/editor/shell/status-bar.tsx:180` `ref={nav}` via a renderização do nav
- **Leitores:**
  - `src/editor/shell/status-bar.tsx:157` `const own = nav.current;` via o layout effect da dobra
- **Criação:** `src/editor/shell/status-bar.tsx:151` `const nav = useRef<HTMLElement>(null);`
- **Descarte:** `src/editor/shell/status-bar.tsx:151` `const nav = useRef<HTMLElement>(null);` (desmontagem do fio)
- **Navegador:** não

## EST-L09b-044 — copy (referência da cópia invisível do fio de Ariadne)
- **Declaração:** `src/editor/shell/status-bar.tsx:152` `const copy = useRef<HTMLSpanElement>(null);`
- **Forma:** React ref (RefObject<HTMLSpanElement | null>)
- **Valores possíveis:**
  - V1 null, antes de a cópia ser montada
  - V2 a cópia invisível que é medida, depois de montada
- **Escritores:**
  - `src/editor/shell/status-bar.tsx:183` `ref={copy}` via a renderização da cópia
- **Leitores:**
  - `src/editor/shell/status-bar.tsx:158` `const measured = copy.current;` via o layout effect da dobra
- **Criação:** `src/editor/shell/status-bar.tsx:152` `const copy = useRef<HTMLSpanElement>(null);`
- **Descarte:** `src/editor/shell/status-bar.tsx:152` `const copy = useRef<HTMLSpanElement>(null);` (desmontagem do fio)
- **Navegador:** não

## EST-L09b-045 — after (quantos níveis ficam depois da dobra)
- **Declaração:** `src/editor/shell/status-bar.tsx:154` `const [after, setAfter] = useState<number | null>(null);`
- **Forma:** number | null
- **Valores possíveis:**
  - V1 null: todos os níveis cabem
  - V2 o número de níveis do fim que ficam depois da dobra
- **Escritores:**
  - `src/editor/shell/status-bar.tsx:163` `setAfter(crumbsAfterFold(widths, more, own.clientWidth));` via fit
- **Leitores:**
  - `src/editor/shell/status-bar.tsx:178` `const kept = after === null ? 0 : crumbs.length - after;` via a renderização
  - `src/editor/shell/status-bar.tsx:195` `{after === null` via a escolha do desenho do fio
- **Criação:** `src/editor/shell/status-bar.tsx:154` `const [after, setAfter] = useState<number | null>(null);`
- **Descarte:** `src/editor/shell/status-bar.tsx:154` `const [after, setAfter] = useState<number | null>(null);` (desmontagem do fio)
- **Navegador:** não

## EST-L09b-046 — button (referência do botão dos níveis dobrados)
- **Declaração:** `src/editor/shell/status-bar.tsx:207` `const button = useRef<HTMLButtonElement>(null);`
- **Forma:** React ref (RefObject<HTMLButtonElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o botão ser montado
  - V2 o botão dos níveis dobrados depois de montado
- **Escritores:**
  - `src/editor/shell/status-bar.tsx:225` `ref={button}` via a renderização do botão
- **Leitores:**
  - `src/editor/shell/status-bar.tsx:209` `const layer = useMenuLayer(button, list);` via FoldedLevels
  - `src/editor/shell/status-bar.tsx:212` `const from = button.current;` via o layout effect da colocação
- **Criação:** `src/editor/shell/status-bar.tsx:207` `const button = useRef<HTMLButtonElement>(null);`
- **Descarte:** `src/editor/shell/status-bar.tsx:207` `const button = useRef<HTMLButtonElement>(null);` (desmontagem do botão)
- **Navegador:** não

## EST-L09b-047 — list (referência do menu dos níveis dobrados)
- **Declaração:** `src/editor/shell/status-bar.tsx:208` `const list = useRef<HTMLDivElement>(null);`
- **Forma:** React ref (RefObject<HTMLDivElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o menu ser montado
  - V2 o div do menu depois de montado, enquanto aberto
- **Escritores:**
  - `src/editor/shell/status-bar.tsx:229` `ref={list}` via a renderização do menu
- **Leitores:**
  - `src/editor/shell/status-bar.tsx:209` `const layer = useMenuLayer(button, list);` via FoldedLevels
  - `src/editor/shell/status-bar.tsx:213` `const own = list.current;` via o layout effect da colocação
- **Criação:** `src/editor/shell/status-bar.tsx:208` `const list = useRef<HTMLDivElement>(null);`
- **Descarte:** `src/editor/shell/status-bar.tsx:208` `const list = useRef<HTMLDivElement>(null);` (desmontagem do menu)
- **Navegador:** não

## EST-L09b-048 — at (posição colocada do menu dos níveis dobrados)
- **Declaração:** `src/editor/shell/status-bar.tsx:210` `const [at, setAt] = useState<Placed | null>(null);`
- **Forma:** Placed | null
- **Valores possíveis:**
  - V1 null: o menu é desenhado invisível
  - V2 a posição calculada
- **Escritores:**
  - `src/editor/shell/status-bar.tsx:217` `setAt(floatBelow(` via o layout effect da colocação
- **Leitores:**
  - `src/editor/shell/status-bar.tsx:220` `const placed = at === null` via a renderização do estilo
- **Criação:** `src/editor/shell/status-bar.tsx:210` `const [at, setAt] = useState<Placed | null>(null);`
- **Descarte:** `src/editor/shell/status-bar.tsx:210` `const [at, setAt] = useState<Placed | null>(null);` (desmontagem do menu)
- **Navegador:** não

## EST-L09b-049 — button (referência do botão do trocador de página)
- **Declaração:** `src/editor/shell/top-bar.tsx:24` `const button = useRef<HTMLButtonElement>(null);`
- **Forma:** React ref (RefObject<HTMLButtonElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o botão ser montado
  - V2 o botão do trocador de página depois de montado
- **Escritores:**
  - `src/editor/shell/top-bar.tsx:31` `ref={button}` via a renderização do botão
- **Leitores:**
  - `src/editor/shell/top-bar.tsx:26` `useMenuLayer(button, list)` via PageSwitcher
- **Criação:** `src/editor/shell/top-bar.tsx:24` `const button = useRef<HTMLButtonElement>(null);`
- **Descarte:** `src/editor/shell/top-bar.tsx:24` `const button = useRef<HTMLButtonElement>(null);` (desmontagem do trocador)
- **Navegador:** não

## EST-L09b-050 — list (referência do menu do trocador de página)
- **Declaração:** `src/editor/shell/top-bar.tsx:25` `const list = useRef<HTMLDivElement>(null);`
- **Forma:** React ref (RefObject<HTMLDivElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o menu ser montado
  - V2 o div do menu depois de montado, enquanto aberto
- **Escritores:**
  - `src/editor/shell/top-bar.tsx:49` `ref={list}` via a renderização do menu
- **Leitores:**
  - `src/editor/shell/top-bar.tsx:26` `useMenuLayer(button, list)` via PageSwitcher
- **Criação:** `src/editor/shell/top-bar.tsx:25` `const list = useRef<HTMLDivElement>(null);`
- **Descarte:** `src/editor/shell/top-bar.tsx:25` `const list = useRef<HTMLDivElement>(null);` (desmontagem do menu)
- **Navegador:** não

## EST-L09b-051 — BY_TARGET (as predefinições de valor por alvo)
- **Declaração:** `src/editor/shell/value-presets.tsx:30` `const BY_TARGET = new Map<string, readonly Preset[]>([...manifest.properties.properties, ...manifest.properties.composites].flatMap((target) => (target.presets === undefined ? [] : [[target.id, target.presets] as const])));`
- **Forma:** Map<string, readonly Preset[]>
- **Valores possíveis:**
  - V1 o mapa das predefinições por alvo, montado do manifesto na carga do módulo
- **Escritores:**
  - `src/editor/shell/value-presets.tsx:30` `const BY_TARGET = new Map<string, readonly Preset[]>([...manifest.properties.properties, ...manifest.properties.composites].flatMap((target) => (target.presets === undefined ? [] : [[target.id, target.presets] as const])));` via a montagem do módulo
- **Leitores:**
  - `src/editor/shell/value-presets.tsx:33` `BY_TARGET.get(target) ?? []` via valuePresetsOf
- **Criação:** `src/editor/shell/value-presets.tsx:30` `const BY_TARGET = new Map<string, readonly Preset[]>([...manifest.properties.properties, ...manifest.properties.composites].flatMap((target) => (target.presets === undefined ? [] : [[target.id, target.presets] as const])));`
- **Descarte:** fim-da-página `src/editor/shell/value-presets.tsx:30` `const BY_TARGET = new Map<string, readonly Preset[]>([...manifest.properties.properties, ...manifest.properties.composites].flatMap((target) => (target.presets === undefined ? [] : [[target.id, target.presets] as const])));`
- **Navegador:** não

## EST-L09b-052 — offered (as variáveis que o texto do campo começa)
- **Declaração:** `src/editor/shell/variable-suggestions.tsx:73` `const [offered, setOffered] = useState<{ readonly matches: readonly string[]; readonly at: number } | null>(null);`
- **Forma:** { matches: readonly string[]; at: number } | null
- **Valores possíveis:**
  - V1 null: a lista não é oferecida
  - V2 as variáveis que o texto começa e o número de dispensas em que foram oferecidas
- **Escritores:**
  - `src/editor/shell/variable-suggestions.tsx:80` `setOffered(matches.length === 0 ? null : { matches, at: store.getState().ui.overlays.dismissals });` via read
  - `src/editor/shell/variable-suggestions.tsx:82` `const leave = () => setOffered(null);` via leave
  - `src/editor/shell/variable-suggestions.tsx:101` `onDismiss={() => setOffered(null)}` via o fechar do popover
- **Leitores:**
  - `src/editor/shell/variable-suggestions.tsx:90` `const shown = offered !== null && offered.at === dismissals ? offered.matches : null;` via a renderização
- **Criação:** `src/editor/shell/variable-suggestions.tsx:73` `const [offered, setOffered] = useState<{ readonly matches: readonly string[]; readonly at: number } | null>(null);`
- **Descarte:** `src/editor/shell/variable-suggestions.tsx:73` `const [offered, setOffered] = useState<{ readonly matches: readonly string[]; readonly at: number } | null>(null);` (desmontagem do campo)
- **Navegador:** não

## EST-L09b-053 — trigger (referência do botão Nova variável)
- **Declaração:** `src/editor/shell/variables.tsx:91` `const trigger = useRef<HTMLButtonElement>(null);`
- **Forma:** React ref (RefObject<HTMLButtonElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o botão ser montado
  - V2 o botão Nova variável depois de montado
- **Escritores:**
  - `src/editor/shell/variables.tsx:97` `ref={trigger}` via a renderização do botão
- **Leitores:**
  - `src/editor/shell/variables.tsx:92` `usePopover(trigger)` via NewVariable
- **Criação:** `src/editor/shell/variables.tsx:91` `const trigger = useRef<HTMLButtonElement>(null);`
- **Descarte:** `src/editor/shell/variables.tsx:91` `const trigger = useRef<HTMLButtonElement>(null);` (desmontagem do botão)
- **Navegador:** não

## EST-L09b-054 — input (referência do campo de uma linha de variável)
- **Declaração:** `src/editor/shell/variables.tsx:128` `const input = useRef<HTMLInputElement>(null);`
- **Forma:** React ref (RefObject<HTMLInputElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o campo ser montado
  - V2 o campo da linha depois de montado
- **Escritores:**
  - `src/editor/shell/variables.tsx:144` `ref={input}` via a renderização do campo
- **Leitores:**
  - `src/editor/shell/variables.tsx:131` `input.current.value = held` via o efeito que repõe o valor
  - `src/editor/shell/variables.tsx:134` `input.current?.value ?? ''` via keep
- **Criação:** `src/editor/shell/variables.tsx:128` `const input = useRef<HTMLInputElement>(null);`
- **Descarte:** `src/editor/shell/variables.tsx:128` `const input = useRef<HTMLInputElement>(null);` (desmontagem da linha)
- **Navegador:** não

## EST-L09b-055 — input (referência do campo de uma cor do site)
- **Declaração:** `src/editor/shell/variables.tsx:187` `const input = useRef<HTMLInputElement>(null);`
- **Forma:** React ref (RefObject<HTMLInputElement | null>)
- **Valores possíveis:**
  - V1 null, antes de o campo ser montado
  - V2 o campo da cor depois de montado
- **Escritores:**
  - `src/editor/shell/variables.tsx:201` `ref={input}` via a renderização do campo
- **Leitores:**
  - `src/editor/shell/variables.tsx:190` `input.current.value = held` via o efeito que repõe o valor
  - `src/editor/shell/variables.tsx:193` `input.current?.value ?? ''` via keep
- **Criação:** `src/editor/shell/variables.tsx:187` `const input = useRef<HTMLInputElement>(null);`
- **Descarte:** `src/editor/shell/variables.tsx:187` `const input = useRef<HTMLInputElement>(null);` (desmontagem da linha)
- **Navegador:** não

## EST-L09b-056 — draft (a largura digitada no campo da moldura)
- **Declaração:** `src/editor/shell/viewport-width.tsx:15` `const [draft, setDraft] = useState<string | null>(null);`
- **Forma:** string | null
- **Valores possíveis:**
  - V1 null: o campo mostra a largura do estado
  - V2 o texto digitado, antes de Enter
- **Escritores:**
  - `src/editor/shell/viewport-width.tsx:25` `setDraft(event.currentTarget.value)` via onChange
  - `src/editor/shell/viewport-width.tsx:19` `setDraft(null);` via keep
- **Leitores:**
  - `src/editor/shell/viewport-width.tsx:17` `if (draft === null) return;` via keep
  - `src/editor/shell/viewport-width.tsx:25` `value={draft ?? String(width)}` via o valor do campo
- **Criação:** `src/editor/shell/viewport-width.tsx:15` `const [draft, setDraft] = useState<string | null>(null);`
- **Descarte:** `src/editor/shell/viewport-width.tsx:15` `const [draft, setDraft] = useState<string | null>(null);` (desmontagem do campo)
- **Navegador:** não

## EST-L09b-057 — foco e elemento ativo do documento
- **Declaração:** `src/editor/shell/outside-layer.ts:41` `const before = returnFocus?.current ?? anchor?.current ?? document.activeElement;`
- **Forma:** o elemento com foco no documento (HTMLElement | null); estado do navegador
- **Valores possíveis:**
  - V1 o campo ou o botão que a pessoa focou
  - V2 document.body, ao não haver foco de campo
  - V3 null, sem elemento ativo
- **Escritores:**
  - `src/editor/shell/outside-layer.ts:56` `restore.focus()` via o retorno do foco ao fechar a camada
  - `src/editor/shell/link-picker.tsx:56` `if (open !== null) panel.current?.focus();` via o efeito da abertura do seletor
  - `src/editor/shell/panel-field.tsx:71` `if (autoFocus) input.current?.focus();` via o efeito de autoFocus
  - `src/editor/shell/popover.tsx:78` `own.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();` via o layout effect do foco
  - `src/editor/shell/popover.tsx:30` `trigger.current?.focus();` via o retorno do foco ao gatilho
  - `src/editor/shell/shell.tsx:102` `(first ?? preview).focus();` via usePreviewModal
  - `src/editor/shell/shell.tsx:105` `wasFocused?.focus();` via o fecho do preview
  - `src/editor/shell/sidebar/explorer.tsx:78` `input.current.focus();` via o efeito da página recem-criada
  - `src/editor/shell/sidebar/explorer.tsx:107` `event.currentTarget.blur();` via o toque numa página não mostrada
  - `src/editor/shell/sidebar/layers.tsx:74` `input.current?.focus();` via o efeito de montagem do campo de renomear
  - `src/editor/shell/variables.tsx:75` `name?.focus();` via o efeito da variável recem-criada
- **Leitores:**
  - `src/editor/shell/outside-layer.ts:41` `const before = returnFocus?.current ?? anchor?.current ?? document.activeElement;` via useOutsideLayer
  - `src/editor/shell/outside-layer.ts:55` `const focused = document.activeElement;` via a remoção do efeito
  - `src/editor/shell/popover.tsx:30` `document.activeElement === null || document.activeElement === document.body` via o retorno do foco
  - `src/editor/shell/row-fit.ts:107` `document.activeElement instanceof HTMLInputElement` via judge
  - `src/editor/shell/shell.tsx:99` `const wasFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;` via usePreviewModal
  - `src/editor/shell/sidebar/explorer.tsx:70` `document.activeElement !== input.current` via o efeito que repõe o nome
- **Criação:** `src/editor/shell/panel-field.tsx:71` `if (autoFocus) input.current?.focus();`
- **Descarte:** `src/editor/shell/sidebar/explorer.tsx:107` `event.currentTarget.blur();`
- **Navegador:** foco

## EST-L09b-058 — rolagem do documento dentro dos painéis
- **Declaração:** `src/editor/shell/sidebar/layers.tsx:472` `setWindow({ top: el.scrollTop, height: el.clientHeight })`
- **Forma:** scrollTop do elemento (a posição de rolagem guardada pelo navegador); estado do navegador
- **Valores possíveis:**
  - V1 no topo (scrollTop 0)
  - V2 rolado, com a janela da árvore acompanhando
- **Escritores:**
  - `src/editor/shell/sidebar/layers.tsx:509` `el.scrollTop = Math.max(0, top - ROW)` via onFocusIn
  - `src/editor/shell/sidebar/layers.tsx:510` `el.scrollTop = top + ROW * 2 - el.clientHeight` via onFocusIn
  - `src/editor/shell/sidebar/layers.tsx:544` `el.scrollTop = top` via o efeito que segue a seleção
  - `src/editor/shell/sidebar/layers.tsx:545` `el.scrollTop = top + ROW - el.clientHeight` via o efeito que segue a seleção
  - `src/editor/shell/variables.tsx:74` `name?.scrollIntoView({ block: 'nearest' });` via o efeito da variável recem-criada
- **Leitores:**
  - `src/editor/shell/sidebar/layers.tsx:472` `setWindow({ top: el.scrollTop, height: el.clientHeight })` via measure
- **Criação:** `src/editor/shell/sidebar/layers.tsx:470` `const el = scroller.current;`
- **Descarte:** fim-da-página `src/editor/shell/sidebar/layers.tsx:470` `const el = scroller.current;`
- **Navegador:** rolagem

## EST-L09b-059 — janela do iframe do preview
- **Declaração:** `src/editor/shell/preview.tsx:42` `event.source !== frame.current?.contentWindow`
- **Forma:** a janela do iframe do preview (Window | null); estado do navegador
- **Valores possíveis:**
  - V1 null, antes de o iframe montar
  - V2 a janela do frame do preview, que um relay de teclas compara com a origem da mensagem
- **Escritores:**
  - `src/editor/shell/preview.tsx:53` `srcDoc={html}` via a renderização do iframe, que faz nascer a sua janela
- **Leitores:**
  - `src/editor/shell/preview.tsx:42` `event.source !== frame.current?.contentWindow` via o ouvinte de message do relay
- **Criação:** `src/editor/shell/preview.tsx:53` `srcDoc={html}`
- **Descarte:** `src/editor/shell/preview.tsx:33` `const frame = useRef<HTMLIFrameElement>(null);` (desmontagem do preview)
- **Navegador:** documento-do-iframe

## EXC-L09b-001
- **Padrão:** P-E03
- **Ocorrência:** `src/editor/shell/outside-layer.ts:16` `let layers = LAYERS.get(store);`
- **Motivo:** é a variável local que só guarda a referência do conjunto enquanto layersOf corre e o devolve; não sobrevive à chamada. O conjunto em si vive como valor de LAYERS, que é o item EST-L09b-002.

# Estado — lote L10a

Itens de estado levantados nos arquivos de `auditoria/lotes/L10a.md` (módulo `src/modules/layout-composer`).

## EST-L10a-001 — Vocabulário de layouts conhecidos
- **Declaração:** `src/modules/layout-composer/adapters/recover.ts:48` `const LAYOUTS = new Set(['flex', 'grid', 'block', 'inline-flex', 'inline-grid', 'flow-root']);`
- **Forma:** conjunto fixo de `string` (valores de `display` aceitos na recuperação de intenção).
- **Valores possíveis:** V1 o conjunto `{'flex','grid','block','inline-flex','inline-grid','flow-root'}`, montado uma vez na carga do módulo e nunca alterado.
- **Escritores:** `src/modules/layout-composer/adapters/recover.ts:48` `const LAYOUTS = new Set(` via carga do módulo.
- **Leitores:** `src/modules/layout-composer/adapters/recover.ts:88` `LAYOUTS.has(display)` via `recoverIntent`.
- **Criação:** `src/modules/layout-composer/adapters/recover.ts:48` `const LAYOUTS = new Set(`
- **Descarte:** fim-da-página `src/modules/layout-composer/adapters/recover.ts:48`
- **Navegador:** não

## EST-L10a-002 — Palavras reservadas de grid-area
- **Declaração:** `src/modules/layout-composer/compiler/compile.ts:180` `const AREA_KEYWORDS: ReadonlySet<string> = new Set(['auto', 'span', 'none', 'inherit', 'initial', 'unset', 'revert', 'revert-layer', 'default']);`
- **Forma:** `ReadonlySet<string>` com as palavras que `grid-area` lê como palavra-chave.
- **Valores possíveis:** V1 o conjunto fixo `{'auto','span','none','inherit','initial','unset','revert','revert-layer','default'}`, montado na carga do módulo e nunca alterado.
- **Escritores:** `src/modules/layout-composer/compiler/compile.ts:180` `const AREA_KEYWORDS: ReadonlySet<string> = new Set(` via carga do módulo.
- **Leitores:** `src/modules/layout-composer/compiler/compile.ts:481` `AREA_KEYWORDS.has(plain)` via `grid`.
- **Criação:** `src/modules/layout-composer/compiler/compile.ts:180` `const AREA_KEYWORDS: ReadonlySet<string> = new Set(`
- **Descarte:** fim-da-página `src/modules/layout-composer/compiler/compile.ts:180`
- **Navegador:** não

## EST-L10a-003 — Padrões por grafo
- **Declaração:** `src/modules/layout-composer/intent/analysis.ts:89` `const PATTERNS = new WeakMap<LayoutIntent, readonly Pattern[]>();`
- **Forma:** memoização: `WeakMap` do grafo de intenção para a lista ordenada de `Pattern`.
- **Valores possíveis:** V1 vazio (nenhum grafo lido ainda); V2 com uma entrada por grafo já computado, mantida enquanto o grafo for alcançável.
- **Escritores:** `src/modules/layout-composer/intent/analysis.ts:97` `PATTERNS.set(graph, sorted);` via `patterns`.
- **Leitores:** `src/modules/layout-composer/intent/analysis.ts:93` `const known = PATTERNS.get(graph);` via `patterns`.
- **Criação:** `src/modules/layout-composer/intent/analysis.ts:89` `const PATTERNS = new WeakMap<LayoutIntent, readonly Pattern[]>();`
- **Descarte:** fim-da-página `src/modules/layout-composer/intent/analysis.ts:89`
- **Navegador:** não

## EST-L10a-004 — Recusa de operação
- **Declaração:** `src/modules/layout-composer/intent/problems.ts:83` `export class LayoutRefusal extends Error {`
- **Forma:** classe de erro; campo `readonly problem: LayoutProblem`.
- **Valores possíveis:** V1 instância com `problem.code` igual a um `ProblemCode` e `problem.params` com os valores nomeados; V2 campo `problem` já preenchido pelo construtor.
- **Escritores:** `src/modules/layout-composer/intent/problems.ts:87` `this.problem = problem(code, params);` via o construtor.
- **Leitores:** `src/modules/layout-composer/gestures/operations.ts:504` `if (error instanceof LayoutRefusal) return { ok: false, problems: [error.problem] };` via `execute`; `src/modules/layout-composer/host/handlers.ts:368` `if (error instanceof LayoutRefusal) return refusedWith([error.problem]);` via `runBody`.
- **Criação:** `src/modules/layout-composer/intent/problems.ts:92` `throw new LayoutRefusal(code, params);` via `refuse`.
- **Descarte:** `src/modules/layout-composer/gestures/operations.ts:504` `if (error instanceof LayoutRefusal) return { ok: false, problems: [error.problem] };` (o erro morre no `catch`)
- **Navegador:** não

## EST-L10a-005 — Alças de redimensionamento por porta
- **Declaração:** `src/modules/layout-composer/interaction/place-tool.ts:24` `const RESIZE_HANDLES = new Map<string, PlaceEdges>(`
- **Forma:** `Map` do `ref` da porta para as bordas (`PlaceEdges`) que a alça move.
- **Valores possíveis:** V1 o mapa montado do manifesto: uma entrada por porta `canvas-handle` que escreve largura ou altura; nunca alterado depois da carga.
- **Escritores:** `src/modules/layout-composer/interaction/place-tool.ts:24` `const RESIZE_HANDLES = new Map<string, PlaceEdges>(` via carga do módulo.
- **Leitores:** `src/modules/layout-composer/interaction/place-tool.ts:39` `const resized = handle === null ? undefined : RESIZE_HANDLES.get(handle);` via `press`.
- **Criação:** `src/modules/layout-composer/interaction/place-tool.ts:24` `const RESIZE_HANDLES = new Map<string, PlaceEdges>(`
- **Descarte:** fim-da-página `src/modules/layout-composer/interaction/place-tool.ts:24`
- **Navegador:** não

## EST-L10a-006 — Traço em curso
- **Declaração:** `src/modules/layout-composer/interaction/preview.ts:13` `let current: StrokePreview | null = null;`
- **Forma:** `StrokePreview | null` (os pontos do traço e a leitura que a liberação faria).
- **Valores possíveis:** V1 `null` (nenhum traço); V2 objeto com `points` acumulados e `reading` enquanto o traço é arrastado; V3 `null` de novo na liberação ou no cancelamento.
- **Escritores:** `src/modules/layout-composer/interaction/preview.ts:20` `current = next;` via `preview.set`; `src/modules/layout-composer/interaction/tool.ts:87` `preview.set({ points: [...points], reading: read(` via o `move` do gesto; `src/modules/layout-composer/interaction/tool.ts:91` `preview.set(null);` e `src/modules/layout-composer/interaction/tool.ts:105` `preview.set(null);`.
- **Leitores:** `src/modules/layout-composer/interaction/preview.ts:17` `get: (): StrokePreview | null => current,` via `preview.get`; `src/modules/layout-composer/ui/overlay.tsx:84` `const held = useSyncExternalStore(preview.subscribe, preview.get);` via `LayoutOverlay`.
- **Criação:** `src/modules/layout-composer/interaction/preview.ts:13` `let current: StrokePreview | null = null;`
- **Descarte:** `src/modules/layout-composer/interaction/tool.ts:91` `preview.set(null);` (a liberação descarta o traço)
- **Navegador:** não

## EST-L10a-007 — Assinantes do traço
- **Declaração:** `src/modules/layout-composer/interaction/preview.ts:14` `const listeners = new Set<() => void>();`
- **Forma:** `Set` de funções avisadas a cada mudança do traço.
- **Valores possíveis:** V1 vazio (nenhum assinante); V2 com os assinantes vivos (o overlay assina ao montar e cancela ao desmontar).
- **Escritores:** `src/modules/layout-composer/interaction/preview.ts:24` `listeners.add(listener);` via `preview.subscribe`; `src/modules/layout-composer/interaction/preview.ts:25` `return () => listeners.delete(listener);` via o cancelamento do `preview.subscribe`.
- **Leitores:** `src/modules/layout-composer/interaction/preview.ts:21` `for (const listener of listeners) listener();` via `preview.set`.
- **Criação:** `src/modules/layout-composer/interaction/preview.ts:14` `const listeners = new Set<() => void>();`
- **Descarte:** fim-da-página `src/modules/layout-composer/interaction/preview.ts:14`
- **Navegador:** não

## EST-L10a-008 — Topologia por grafo
- **Declaração:** `src/modules/layout-composer/topology/topology.ts:47` `const cache = new WeakMap<LayoutIntent, Topology>();`
- **Forma:** memoização: `WeakMap` do grafo de intenção para a `Topology` computada.
- **Valores possíveis:** V1 vazio (nenhum grafo lido); V2 com uma entrada por grafo computado, mantida enquanto o grafo for alcançável.
- **Escritores:** `src/modules/layout-composer/topology/topology.ts:127` `cache.set(graph, result);` via `topology`.
- **Leitores:** `src/modules/layout-composer/topology/topology.ts:80` `const cached = cache.get(graph);` via `topology`.
- **Criação:** `src/modules/layout-composer/topology/topology.ts:47` `const cache = new WeakMap<LayoutIntent, Topology>();`
- **Descarte:** fim-da-página `src/modules/layout-composer/topology/topology.ts:47`
- **Navegador:** não

## EST-L10a-009 — Palavras enumeradas do rótulo
- **Declaração:** `src/modules/layout-composer/ui/overlay.tsx:32` `const WORDS = new Set(['sizing', 'semantic', 'flow']);`
- **Forma:** conjunto fixo de `string` com os nomes de parâmetro que são palavras enumeradas.
- **Valores possíveis:** V1 o conjunto `{'sizing','semantic','flow'}`, montado na carga do módulo e nunca alterado.
- **Escritores:** `src/modules/layout-composer/ui/overlay.tsx:32` `const WORDS = new Set(['sizing', 'semantic', 'flow']);` via carga do módulo.
- **Leitores:** `src/modules/layout-composer/ui/overlay.tsx:35` `WORDS.has(name)` via `useWords`.
- **Criação:** `src/modules/layout-composer/ui/overlay.tsx:32` `const WORDS = new Set(['sizing', 'semantic', 'flow']);`
- **Descarte:** fim-da-página `src/modules/layout-composer/ui/overlay.tsx:32`
- **Navegador:** não

## EST-L10a-010 — Camada do compositor
- **Declaração:** `src/modules/layout-composer/ui/overlay.tsx:67` `const layer = useRef<HTMLDivElement>(null);`
- **Forma:** referência React a `HTMLDivElement` (`layer.current` é `HTMLDivElement | null`).
- **Valores possíveis:** V1 `null` antes de o div ser montado; V2 o div da camada depois de montado, usado como origem das medições.
- **Escritores:** `src/modules/layout-composer/ui/overlay.tsx:136` `ref={layer}` via o React ao montar; `src/modules/layout-composer/ui/overlay.tsx:123` `ref={layer}` via o React no retorno oculto.
- **Leitores:** `src/modules/layout-composer/ui/overlay.tsx:94` `const origin = layer.current?.parentElement?.getBoundingClientRect();` via o efeito de medição.
- **Criação:** `src/modules/layout-composer/ui/overlay.tsx:67` `const layer = useRef<HTMLDivElement>(null);`
- **Descarte:** desmontagem do componente `src/modules/layout-composer/ui/overlay.tsx:63` `export function LayoutOverlay() {`
- **Navegador:** não

## EST-L10a-011 — Caixa do alvo composto
- **Declaração:** `src/modules/layout-composer/ui/overlay.tsx:68` `const [box, setBox] = useState<Box | null>(null);`
- **Forma:** estado React `Box | null` (a caixa do contêiner composto na camada, em px da camada).
- **Valores possíveis:** V1 `null` antes da primeira medição; V2 a caixa medida do contêiner; V3 a caixa anterior mantida quando a nova medição é igual (via `same`).
- **Escritores:** `src/modules/layout-composer/ui/overlay.tsx:97` `setBox(` via o efeito de medição (a cada quadro).; `src/modules/layout-composer/ui/overlay.tsx:79` `setBox(null);` via `LayoutOverlay` (o compositor fechado; DEF-0512)
- **Leitores:** `src/modules/layout-composer/ui/overlay.tsx:117` `const placed = box !== null;`; `src/modules/layout-composer/ui/overlay.tsx:125` `const scale = box.width / drawn.viewport.width;` via `LayoutOverlay`.
- **Criação:** `src/modules/layout-composer/ui/overlay.tsx:68` `const [box, setBox] = useState<Box | null>(null);`
- **Descarte:** desmontagem do componente `src/modules/layout-composer/ui/overlay.tsx:63` `export function LayoutOverlay() {`
- **Navegador:** não

## EST-L10a-012 — Regiões medidas pela página
- **Declaração:** `src/modules/layout-composer/ui/overlay.tsx:71` `const [measured, setMeasured] = useState<Readonly<Record<string, Measured>> | null>(null);`
- **Forma:** estado React `Record<string, Measured> | null` (as regiões onde a página as põe, por chave).
- **Valores possíveis:** V1 `null` no tamanho-base da tela; V2 o mapa de regiões medidas quando a tela é mais estreita que o desenho; V3 o mapa anterior mantido quando igual (via `same`).
- **Escritores:** `src/modules/layout-composer/ui/overlay.tsx:105` `setMeasured(` via o efeito de medição (a cada quadro).; `src/modules/layout-composer/ui/overlay.tsx:80` `setMeasured(null);` via `LayoutOverlay` (o compositor fechado; DEF-0512)
- **Leitores:** `src/modules/layout-composer/ui/overlay.tsx:128` `if (measured === null) return at(b);` via `placedAt`.
- **Criação:** `src/modules/layout-composer/ui/overlay.tsx:71` `const [measured, setMeasured] = useState<Readonly<Record<string, Measured>> | null>(null);`
- **Descarte:** desmontagem do componente `src/modules/layout-composer/ui/overlay.tsx:63` `export function LayoutOverlay() {`
- **Navegador:** não

## EST-L10a-013 — Elementos marcados do contêiner
- **Declaração:** `src/modules/layout-composer/ui/overlay.tsx:83` `const elements = useMemo(() => (container === null ? [] : markedElements(container)), [container]);`
- **Forma:** memoização: lista de pares `[chave, NodeId]` dos elementos marcados, recalculada quando `container` muda.
- **Valores possíveis:** V1 lista vazia (sem contêiner); V2 a lista dos elementos marcados do contêiner.
- **Escritores:** `src/modules/layout-composer/ui/overlay.tsx:83` `const elements = useMemo(() => (container === null ? [] : markedElements(container)), [container]);` via `LayoutOverlay` (recomputa quando `container` muda).
- **Leitores:** `src/modules/layout-composer/ui/overlay.tsx:101` `for (const [key, id] of elements) {` via o efeito de medição.
- **Criação:** `src/modules/layout-composer/ui/overlay.tsx:83` `const elements = useMemo(() => (container === null ? [] : markedElements(container)), [container]);`
- **Descarte:** desmontagem do componente `src/modules/layout-composer/ui/overlay.tsx:63` `export function LayoutOverlay() {`
- **Navegador:** não

## EST-L10a-014 — Palco do compositor
- **Declaração:** `src/modules/layout-composer/ui/overlay.tsx:116` `const stage = useRef<HTMLDivElement>(null);`
- **Forma:** referência React a `HTMLDivElement` (`stage.current` é `HTMLDivElement | null`).
- **Valores possíveis:** V1 `null` antes de o palco ser montado; V2 o div do palco depois de montado, quando recebe o foco.
- **Escritores:** `src/modules/layout-composer/ui/overlay.tsx:139` `ref={stage}` via o React ao montar.
- **Leitores:** `src/modules/layout-composer/ui/overlay.tsx:120` `stage.current?.focus({ preventScroll: true });` via o efeito que põe o foco no palco.
- **Criação:** `src/modules/layout-composer/ui/overlay.tsx:116` `const stage = useRef<HTMLDivElement>(null);`
- **Descarte:** desmontagem do componente `src/modules/layout-composer/ui/overlay.tsx:63` `export function LayoutOverlay() {`
- **Navegador:** não

## EST-L10a-015 — Cena desenhada
- **Declaração:** `src/modules/layout-composer/ui/overlay.tsx:122` `const drawn = useMemo(() => (record === null || composer === null ? null : scene(`
- **Forma:** memoização: a cena a desenhar (regiões, alças, relações) ou `null`, recalculada quando `record`, `composer` ou `held` mudam.
- **Valores possíveis:** V1 `null` (sem registro ou sem compositor); V2 a cena do grafo lido no traço em curso, ou do registro quando não há traço; V3 recalculada quando um dos três valores muda.
- **Escritores:** `src/modules/layout-composer/ui/overlay.tsx:122` `const drawn = useMemo(() => (record === null || composer === null ? null : scene(` via `LayoutOverlay` (recomputa quando a dependência muda).
- **Leitores:** `src/modules/layout-composer/ui/overlay.tsx:125` `const scale = box.width / drawn.viewport.width;` via `LayoutOverlay`.
- **Criação:** `src/modules/layout-composer/ui/overlay.tsx:122` `const drawn = useMemo(() => (record === null || composer === null ? null : scene(`
- **Descarte:** desmontagem do componente `src/modules/layout-composer/ui/overlay.tsx:63` `export function LayoutOverlay() {`
- **Navegador:** não

## EST-L10a-016 — Campo de texto do painel
- **Declaração:** `src/modules/layout-composer/ui/panel.tsx:85` `const field = useRef<HTMLInputElement>(null);`
- **Forma:** referência React a `HTMLInputElement` (`field.current` é `HTMLInputElement | null`).
- **Valores possíveis:** V1 `null` antes de o campo ser montado; V2 o input depois de montado; V3 o valor do input reescrito com o valor do documento quando este muda e o campo não tem o foco.
- **Escritores:** `src/modules/layout-composer/ui/panel.tsx:107` `ref={field}` via o React ao montar; `src/modules/layout-composer/ui/panel.tsx:90` `field.current.value = value;` via o efeito de `DoorField`.
- **Leitores:** `src/modules/layout-composer/ui/panel.tsx:89` `document.activeElement === field.current` via o efeito de `DoorField`.
- **Criação:** `src/modules/layout-composer/ui/panel.tsx:85` `const field = useRef<HTMLInputElement>(null);`
- **Descarte:** desmontagem do componente `src/modules/layout-composer/ui/panel.tsx:82` `function DoorField(`
- **Navegador:** não

## EST-L10a-017 — Imagens do projeto
- **Declaração:** `src/modules/layout-composer/ui/panel.tsx:180` `const images = useMemo(() => imageFiles({ files } as DocumentJson), [files]);`
- **Forma:** memoização: a lista de arquivos de imagem do projeto, recalculada quando `files` muda.
- **Valores possíveis:** V1 lista vazia (projeto sem imagem); V2 a lista de imagens do projeto.
- **Escritores:** `src/modules/layout-composer/ui/panel.tsx:180` `const images = useMemo(() => imageFiles({ files } as DocumentJson), [files]);` via `LayoutPanel` (recomputa quando `files` muda).
- **Leitores:** `src/modules/layout-composer/ui/panel.tsx:284` `images.length === 0` via `LayoutPanel`.
- **Criação:** `src/modules/layout-composer/ui/panel.tsx:180` `const images = useMemo(() => imageFiles({ files } as DocumentJson), [files]);`
- **Descarte:** desmontagem do componente `src/modules/layout-composer/ui/panel.tsx:171` `export function LayoutPanel(): ReactNode {`
- **Navegador:** não

## EST-L10a-018 — Foco do documento
- **Declaração:** `src/modules/layout-composer/ui/panel.tsx:89` `document.activeElement === field.current`
- **Forma:** o elemento ativo do documento (`Element | null`), do navegador.
- **Valores possíveis:** V1 o campo do painel (`DoorField`) com o foco; V2 o palco do compositor com o foco ao entrar nele; V3 nenhum dos dois.
- **Escritores:** `src/modules/layout-composer/ui/overlay.tsx:120` `stage.current?.focus({ preventScroll: true });` via o efeito que põe o foco no palco.
- **Leitores:** `src/modules/layout-composer/ui/panel.tsx:89` `document.activeElement === field.current` via o efeito de `DoorField`.
- **Criação:** `src/modules/layout-composer/ui/overlay.tsx:120` `stage.current?.focus({ preventScroll: true });`
- **Descarte:** fim-da-página `src/modules/layout-composer/ui/panel.tsx:89`
- **Navegador:** foco

## EXC-L10a-001
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/adapters/recover.ts:78` `let evidence = 0;`
- **Ocorrência:** `src/modules/layout-composer/adapters/recover.ts:79` `let held = 0;`
- **Ocorrência:** `src/modules/layout-composer/adapters/recover.ts:144` `let graph: LayoutIntent = { ...emptyIntent(viewport.width, viewport.height), viewport, regions };`
- **Motivo:** contadores e o grafo em construção são locais de `recoverIntent`: nascem e morrem dentro da chamada e não são lidos por outra entrada.

## EXC-L10a-002
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/adapters/reference.ts:55` `let best: { axis: 'x' | 'y';`
- **Ocorrência:** `src/modules/layout-composer/adapters/reference.ts:105` `let working = graph;`
- **Motivo:** variáveis locais de `strongest` e `traceRegions`: usadas só até o fim de cada chamada.

## EXC-L10a-003
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/compiler/compile.ts:101` `let stop = -Infinity;`
- **Motivo:** marcador local de `partitions`: reiniciado a cada chamada e não lido fora dela.

## EXC-L10a-004
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/constraints/solve.ts:57` `let at = (sorted[0] as Region).box[axis];`
- **Ocorrência:** `src/modules/layout-composer/constraints/solve.ts:145` `let changed = false;`
- **Ocorrência:** `src/modules/layout-composer/constraints/solve.ts:157` `let next = clampRegions(graph);`
- **Motivo:** variáveis locais do laço de resolução de restrições: pertencem a uma passada e morrem com ela.

## EXC-L10a-005
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/geometry/geometry.ts:47` `let inside = false;`
- **Ocorrência:** `src/modules/layout-composer/geometry/geometry.ts:105` `let sum = 0;`
- **Motivo:** acumuladores locais de funções geométricas: recomeçam a cada chamada.

## EXC-L10a-006
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/geometry/polygons.ts:28` `let sum = 0;`
- **Ocorrência:** `src/modules/layout-composer/geometry/polygons.ts:97` `let points = [...ring];`
- **Ocorrência:** `src/modules/layout-composer/geometry/polygons.ts:98` `let changed = true;`
- **Motivo:** acumulador e cópia de trabalho locais: existem só dentro da função que simplifica o anel.

## EXC-L10a-007
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/gestures/operations.ts:131` `let working = graph;`
- **Ocorrência:** `src/modules/layout-composer/gestures/operations.ts:161` `let working = graph;`
- **Ocorrência:** `src/modules/layout-composer/gestures/operations.ts:196` `let grew = true;`
- **Ocorrência:** `src/modules/layout-composer/gestures/operations.ts:212` `let next = graph;`
- **Motivo:** grafos de trabalho e um sinalizador locais de cada operação: o resultado é devolvido, a variável local morre.

## EXC-L10a-008
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/gestures/recognize.ts:129` `let best: number | null = null;`
- **Ocorrência:** `src/modules/layout-composer/gestures/recognize.ts:141` `let best: number | null = null;`
- **Ocorrência:** `src/modules/layout-composer/gestures/recognize.ts:390` `let right = end(b, 'x');`
- **Ocorrência:** `src/modules/layout-composer/gestures/recognize.ts:391` `let bottom = end(b, 'y');`
- **Ocorrência:** `src/modules/layout-composer/gestures/recognize.ts:513` `let mode = stroke.mode;`
- **Motivo:** melhores candidatos e limites locais da leitura do traço: calculados numa chamada e devolvidos.

## EXC-L10a-009
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/gestures/sequences.ts:22` `let farthest = 0;`
- **Ocorrência:** `src/modules/layout-composer/gestures/sequences.ts:23` `let index = 0;`
- **Motivo:** posições locais do agrupamento de um toque: reiniciadas a cada chamada.

## EXC-L10a-010
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/gestures/structural.ts:34` `let constraint: Constraint;`
- **Motivo:** variável local atribuída em dois ramos e devolvida: não sobrevive à chamada.

## EXC-L10a-011
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/host/handlers.ts:272` `let graph = intent;`
- **Ocorrência:** `src/modules/layout-composer/host/handlers.ts:379` `let next = graph;`
- **Ocorrência:** `src/modules/layout-composer/host/handlers.ts:700` `let at = first.box[axis];`
- **Motivo:** grafos de trabalho e uma posição de varredura locais de um tratador: o resultado é devolvido e a variável local morre.

## EXC-L10a-012
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/intent/ids.ts:12` `let max = 0;`
- **Motivo:** maior número visto ao gerar o próximo id, local da chamada de geração.

## EXC-L10a-013
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/intent/meaning.ts:43` `let bottom = -Infinity;`
- **Ocorrência:** `src/modules/layout-composer/intent/meaning.ts:70` `let main = false;`
- **Motivo:** limites e um sinalizador locais: recomeçam a cada chamada e não são lidos fora dela.

## EXC-L10a-014
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/intent/model.ts:181` `let added = true;`
- **Ocorrência:** `src/modules/layout-composer/intent/model.ts:195` `let depth = 0;`
- **Motivo:** sinalizador e profundidade locais de varreduras do grafo: existem só dentro da função.

## EXC-L10a-015
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/intent/templates.ts:109` `let working = graph;`
- **Ocorrência:** `src/modules/layout-composer/intent/templates.ts:127` `let constraintGraph = working;`
- **Ocorrência:** `src/modules/layout-composer/intent/templates.ts:134` `let ruleGraph = working;`
- **Ocorrência:** `src/modules/layout-composer/intent/templates.ts:190` `let graph: LayoutIntent;`
- **Motivo:** grafos de trabalho locais da montagem de um modelo: o resultado é devolvido, a variável local morre.

## EXC-L10a-016
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/responsive/continuum.ts:49` `let working = graph;`
- **Ocorrência:** `src/modules/layout-composer/responsive/continuum.ts:129` `let rule: ResponsiveRule;`
- **Ocorrência:** `src/modules/layout-composer/responsive/continuum.ts:204` `let rules = [...graph.responsive];`
- **Motivo:** grafo de trabalho, regra e cópia de regras locais da transformação contínua: morrem com a chamada.

## EXC-L10a-017
- **Padrão:** P-E03
- **Ocorrência:** `src/modules/layout-composer/host/host.test.ts:16` `let rootId = '';`
- **Ocorrência:** `src/modules/layout-composer/host/tools.test.ts:16` `let rootId = '';`
- **Motivo:** id do nó raiz local da função auxiliar de cada teste: preenchido e lido dentro dela, não é lido por outra entrada.

## EXC-L10a-018
- **Padrão:** P-E09
- **Ocorrência:** `src/modules/layout-composer/host/host.test.ts:18` `createEditorStore(`
- **Ocorrência:** `src/modules/layout-composer/host/project-breakpoints.test.ts:16` `createEditorStore(`
- **Ocorrência:** `src/modules/layout-composer/host/tools.test.ts:19` `createEditorStore(`
- **Ocorrência:** `src/modules/layout-composer/host/tools.test.ts:21` `createEditorStore(`
- **Motivo:** store criada dentro da função auxiliar de cada teste: existe enquanto o teste roda e morre no fim dele, não é estado do lote.

## EST-L10a-019 — compositor aberto, visto pela camada do canvas

- **Declaração:** `src/modules/layout-composer/ui/overlay.tsx:75` `const [open, setOpen] = useState(composer !== null);`
- **Forma:** estado React `boolean`: se o compositor estava aberto no último desenho da camada.
- **Valores possíveis:** V1 `false`: fechado; V2 `true`: aberto.
- **Escritores:** `src/modules/layout-composer/ui/overlay.tsx:77` `setOpen(composer !== null);` via `LayoutOverlay` (no desenho em que o compositor abre ou fecha; DEF-0512).
- **Leitores:** `src/modules/layout-composer/ui/overlay.tsx:76` `if ((composer !== null) !== open) {` via `LayoutOverlay`.
- **Criação:** `src/modules/layout-composer/ui/overlay.tsx:75` `const [open, setOpen] = useState(composer !== null);`
- **Descarte:** desmontagem do componente `src/modules/layout-composer/ui/overlay.tsx:63` `export function LayoutOverlay() {`
- **Navegador:** não

# Estado — L10b (verificação do manifesto, runtime, schema e ui)

## EST-L10b-001 — resultados de análise guardados por esquema e por objeto congelado

- **Declaração:** `src/manifest/check/base.ts:289` `const parsedFrozen = new WeakMap<z.ZodType, WeakMap<object, z.ZodSafeParseResult<unknown>>>();`
- **Forma:** `WeakMap<z.ZodType, WeakMap<object, z.ZodSafeParseResult<unknown>>>` — por esquema, por objeto congelado, o resultado de `safeParse` guardado.
- **Valores possíveis:**
  - V1 vazio: nenhum objeto congelado analisado ainda; o valor inicial do módulo (`src/manifest/check/base.ts:289` `const parsedFrozen = new WeakMap<z.ZodType, WeakMap<object, z.ZodSafeParseResult<unknown>>>();`).
  - V2 com uma entrada por esquema, criada na primeira análise de um objeto congelado (`src/manifest/check/base.ts:295` `parsedFrozen.set(schema, bySchema);`) e preenchida com o resultado guardado (`src/manifest/check/base.ts:300` `bySchema.set(json, result);`).
- **Escritores:**
  - `src/manifest/check/base.ts:295` `parsedFrozen.set(schema, bySchema);` via parseFile
  - `src/manifest/check/base.ts:300` `bySchema.set(json, result);` via parseFile
- **Leitores:**
  - `src/manifest/check/base.ts:292` `let bySchema = parsedFrozen.get(schema);` via parseFile
  - `src/manifest/check/base.ts:297` `let result = bySchema.get(json);` via parseFile
- **Criação:** `src/manifest/check/base.ts:289` `const parsedFrozen = new WeakMap<z.ZodType, WeakMap<object, z.ZodSafeParseResult<unknown>>>();`
- **Descarte:** fim-da-página `src/manifest/check/base.ts:289` `const parsedFrozen = new WeakMap<z.ZodType, WeakMap<object, z.ZodSafeParseResult<unknown>>>();`
- **Navegador:** não

## EST-L10b-002 — controles que apresentam uma lista de valores

- **Declaração:** `src/manifest/check/base.ts:495` `export const LIST_CONTROLS = new Set(['keyword-menu', 'keyword-buttons', 'length-field', 'font-menu']);`
- **Forma:** `Set<string>` — os quatro nomes de controle cuja oferta é uma lista de valores.
- **Valores possíveis:**
  - V1 sempre os quatro nomes citados na declaração; o conjunto é montado na inicialização do módulo e não recebe outra escrita (`src/manifest/check/base.ts:495` `export const LIST_CONTROLS = new Set(['keyword-menu', 'keyword-buttons', 'length-field', 'font-menu']);`).
- **Escritores:**
  - `src/manifest/check/base.ts:495` `export const LIST_CONTROLS = new Set(['keyword-menu', 'keyword-buttons', 'length-field', 'font-menu']);` via a inicialização do módulo (única escrita)
- **Leitores:**
  - `src/manifest/check/values.ts:28` `if (control !== undefined && LIST_CONTROLS.has(control) && (offers === null || offers.property !== target)) {` via valuesRules
- **Criação:** `src/manifest/check/base.ts:495` `export const LIST_CONTROLS = new Set(['keyword-menu', 'keyword-buttons', 'length-field', 'font-menu']);`
- **Descarte:** fim-da-página `src/manifest/check/base.ts:495` `export const LIST_CONTROLS = new Set(['keyword-menu', 'keyword-buttons', 'length-field', 'font-menu']);`
- **Navegador:** não

## EST-L10b-003 — matcher de sintaxe CSS guardado por objeto de dados gerados

- **Declaração:** `src/manifest/check/base.ts:497` `const matcherCache = new WeakMap<object, CssMatcher>();`
- **Forma:** `WeakMap<object, CssMatcher>` — por objeto de dados CSS gerados, o matcher construído por `createCssMatcher`.
- **Valores possíveis:**
  - V1 vazio: nenhum objeto de dados CSS abordado ainda.
  - V2 com uma entrada por objeto `css`, criada na primeira chamada de cssMatcher para ele (`src/manifest/check/base.ts:502` `matcherCache.set(css, matcher);`).
- **Escritores:**
  - `src/manifest/check/base.ts:502` `matcherCache.set(css, matcher);` via cssMatcher
- **Leitores:**
  - `src/manifest/check/base.ts:499` `let matcher = matcherCache.get(css);` via cssMatcher
- **Criação:** `src/manifest/check/base.ts:497` `const matcherCache = new WeakMap<object, CssMatcher>();`
- **Descarte:** fim-da-página `src/manifest/check/base.ts:497` `const matcherCache = new WeakMap<object, CssMatcher>();`
- **Navegador:** não

## EST-L10b-004 — nomes de tecla além de um único caractere

- **Declaração:** `src/manifest/chord.ts:5` `const NAMED_KEYS = new Set([`
- **Forma:** `Set<string>` — os nomes de tecla que um atalho pode nomear por extenso (Enter, Escape, F1 a F12 e os demais listados).
- **Valores possíveis:**
  - V1 sempre os nomes listados entre as linhas 5 e 9 de `src/manifest/chord.ts`; o conjunto é montado na inicialização do módulo e não recebe outra escrita (`src/manifest/chord.ts:5` `const NAMED_KEYS = new Set([`).
- **Escritores:**
  - `src/manifest/chord.ts:5` `const NAMED_KEYS = new Set([` via a inicialização do módulo (única escrita)
- **Leitores:**
  - `src/manifest/chord.ts:26` `else if (!NAMED_KEYS.has(key)) return null;` via normaliseChord
- **Criação:** `src/manifest/chord.ts:5` `const NAMED_KEYS = new Set([`
- **Descarte:** fim-da-página `src/manifest/chord.ts:5` `const NAMED_KEYS = new Set([`
- **Navegador:** não

## EST-L10b-005 — memorando do que cada sintaxe nomeia, por lexer

- **Declaração:** `src/manifest/css.ts:126` `const mentionMemo = new WeakMap<Lexer, Map<string, SyntaxMentions>>();`
- **Forma:** `WeakMap<Lexer, Map<string, SyntaxMentions>>` — por lexer, um mapa de chave de tipo ou de propriedade para o que a sintaxe dela nomeia.
- **Valores possíveis:**
  - V1 vazio: nenhum lexer analisado ainda.
  - V2 com uma entrada por lexer, criada na primeira chamada de syntaxMentions a ele (`src/manifest/css.ts:132` `mentionMemo.set(lexer, memo);`); o mapa interno recebe uma entrada por tipo e por propriedade expandidos (`src/manifest/css.ts:158` `cache.set(key, out);`).
- **Escritores:**
  - `src/manifest/css.ts:132` `mentionMemo.set(lexer, memo);` via syntaxMentions
  - `src/manifest/css.ts:158` `cache.set(key, out);` via syntaxMentions
- **Leitores:**
  - `src/manifest/css.ts:129` `let memo = mentionMemo.get(lexer);` via syntaxMentions
  - `src/manifest/css.ts:150` `const known = cache.get(key);` via syntaxMentions
- **Criação:** `src/manifest/css.ts:126` `const mentionMemo = new WeakMap<Lexer, Map<string, SyntaxMentions>>();`
- **Descarte:** fim-da-página `src/manifest/css.ts:126` `const mentionMemo = new WeakMap<Lexer, Map<string, SyntaxMentions>>();`
- **Navegador:** não

## EST-L10b-006 — manifesto lido uma vez no boot do módulo

- **Declaração:** `src/manifest/runtime.ts:97` `export const manifest: Manifest = load();`
- **Forma:** `Manifest` — o manifesto lido uma vez: `environment`, `elements`, `properties`, `interactions`, `layout`, `checks`, `html`, `commands`, `commandById`, `doors` e `doorByRef` (`src/manifest/runtime.ts:46` `export interface Manifest {`).
- **Valores possíveis:**
  - V1 construída no boot do módulo: `load()` monta o objeto a partir dos módulos JSON importados por glob ansioso (`src/manifest/runtime.ts:97` `export const manifest: Manifest = load();`); depois disso o vínculo não recebe outra escrita.
- **Escritores:**
  - `src/manifest/runtime.ts:97` `export const manifest: Manifest = load();` via a inicialização do módulo (load)
- **Leitores:**
  - `src/manifest/runtime.ts:101` `const value = manifest.interactions.constants.find((c) => c.id === id)?.value;` via numberConstant
  - `src/manifest/runtime.ts:122` `const command = manifest.commandById.get(id);` via commandOf
  - `src/manifest/runtime.ts:129` `const ELEMENT_ICONS = new Map<string, string>(manifest.elements.elements.map((e) => [e.id, e.icon]));` via a inicialização de ELEMENT_ICONS
  - `src/manifest/runtime.ts:136` `return manifest.doors` via doorsIn
  - `src/manifest/runtime.ts:151` `at = manifest.interactions.keyContexts.find((k) => k.id === at)?.inherits ?? null;` via keyContextChain
- **Criação:** `src/manifest/runtime.ts:97` `export const manifest: Manifest = load();`
- **Descarte:** fim-da-página `src/manifest/runtime.ts:97` `export const manifest: Manifest = load();`
- **Navegador:** não

## EST-L10b-007 — ícone de cada tipo de elemento, por id

- **Declaração:** `src/manifest/runtime.ts:129` `const ELEMENT_ICONS = new Map<string, string>(manifest.elements.elements.map((e) => [e.id, e.icon]));`
- **Forma:** `Map<string, string>` — id do tipo de elemento para o nome do ícone dele.
- **Valores possíveis:**
  - V1 uma entrada por elemento de `manifest.elements.elements`, montada na inicialização do módulo a partir do manifesto já lido (`src/manifest/runtime.ts:129` `const ELEMENT_ICONS = new Map<string, string>(manifest.elements.elements.map((e) => [e.id, e.icon]));`); o mapa não recebe outra escrita.
- **Escritores:**
  - `src/manifest/runtime.ts:129` `const ELEMENT_ICONS = new Map<string, string>(manifest.elements.elements.map((e) => [e.id, e.icon]));` via a inicialização do módulo (única escrita)
- **Leitores:**
  - `src/manifest/runtime.ts:131` `return ELEMENT_ICONS.get(type) ?? null;` via elementIcon
- **Criação:** `src/manifest/runtime.ts:129` `const ELEMENT_ICONS = new Map<string, string>(manifest.elements.elements.map((e) => [e.id, e.icon]));`
- **Descarte:** fim-da-página `src/manifest/runtime.ts:129` `const ELEMENT_ICONS = new Map<string, string>(manifest.elements.elements.map((e) => [e.id, e.icon]));`
- **Navegador:** não

## Excluídos

### EXC-L10b-001
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/check/base.ts:292` `let bySchema = parsedFrozen.get(schema);`
- **Motivo:** variável local de parseFile (`src/manifest/check/base.ts:290` `function parseFile(schema: z.ZodType, json: unknown): z.ZodSafeParseResult<unknown> {`): nasce e morre dentro da chamada; o dado que sobrevive fica em parsedFrozen (EST-L10b-001).

### EXC-L10b-002
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/check/base.ts:297` `let result = bySchema.get(json);`
- **Motivo:** variável local de parseFile (`src/manifest/check/base.ts:290` `function parseFile(schema: z.ZodType, json: unknown): z.ZodSafeParseResult<unknown> {`): recebe o resultado da análise e é devolvida no fim da chamada, sem sobreviver a ela.

### EXC-L10b-003
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/check/base.ts:499` `let matcher = matcherCache.get(css);`
- **Motivo:** variável local de cssMatcher (`src/manifest/check/base.ts:498` `export function cssMatcher(css: GeneratedCss): CssMatcher {`): guarda o matcher durante a chamada; o dado que sobrevive fica em matcherCache (EST-L10b-003).

### EXC-L10b-004
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/check/values.ts:20` `let keywordsLeftOut = 0;`
- **Motivo:** contador local de valuesRules (`src/manifest/check/values.ts:8` `export function valuesRules(ctx: CheckContext) {`): morre no fim da chamada; o valor sai copiado no objeto de retorno da função.

### EXC-L10b-005
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/check/values.ts:21` `let unitsLeftOut = 0;`
- **Motivo:** contador local de valuesRules (`src/manifest/check/values.ts:8` `export function valuesRules(ctx: CheckContext) {`): morre no fim da chamada; o valor sai copiado no objeto de retorno da função.

### EXC-L10b-006
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/chord.ts:13` `let key: string;`
- **Motivo:** variável local de normaliseChord (`src/manifest/chord.ts:12` `export function normaliseChord(chord: string): string | null {`): monta a tecla durante a leitura do texto e morre no fim da chamada.

### EXC-L10b-007
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/chord.ts:14` `let modifiers: string[];`
- **Motivo:** variável local de normaliseChord (`src/manifest/chord.ts:12` `export function normaliseChord(chord: string): string | null {`): monta os modificadores durante a leitura do texto e morre no fim da chamada.

### EXC-L10b-008
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/css.ts:62` `let ast;`
- **Motivo:** variável local de matchTree (`src/manifest/css.ts:61` `function matchTree(lexer: Lexer, property: string, value: string): Matched {`): guarda a árvore analisada daquele valor e morre no fim da chamada.

### EXC-L10b-009
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/css.ts:68` `let result;`
- **Motivo:** variável local de matchTree (`src/manifest/css.ts:61` `function matchTree(lexer: Lexer, property: string, value: string): Matched {`): guarda o casamento daquele valor e morre no fim da chamada.

### EXC-L10b-010
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/css.ts:129` `let memo = mentionMemo.get(lexer);`
- **Motivo:** variável local de syntaxMentions (`src/manifest/css.ts:128` `export function syntaxMentions(lexer: Lexer, property: string): SyntaxMentions {`): recebe o mapa lido de mentionMemo (EST-L10b-005) e morre no fim da chamada.

### EXC-L10b-011
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/css.ts:220` `let ast;`
- **Motivo:** variável local de valueShape (`src/manifest/css.ts:218` `export function valueShape(value: string): ValueShape {`): guarda a árvore analisada daquele valor e morre no fim da chamada.

### EXC-L10b-012
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/css.ts:232` `let count = 0;`
- **Motivo:** contador local de valueShape (`src/manifest/css.ts:218` `export function valueShape(value: string): ValueShape {`): conta os componentes da camada durante a chamada e morre no fim dela.

### EXC-L10b-013
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/runtime.ts:148` `let at: string | null = context;`
- **Motivo:** variável local de keyContextChain (`src/manifest/runtime.ts:146` `export function keyContextChain(context: KeyContextId): readonly KeyContextId[] {`): percorre a herança durante a chamada e morre no fim dela.

### EXC-L10b-014
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/scenario.ts:62` `let at: Resolved = { node: root.tree, parent: null, index: 0, page: root.i };`
- **Motivo:** variável local de resolveNode (`src/manifest/scenario.ts:55` `export function resolveNode(document: unknown, nodes: readonly string[]): Resolved | string {`): o nó corrente da caminhada morre no fim da chamada.

### EXC-L10b-015
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/scenario.ts:63` `let named =`
- **Motivo:** variável local de resolveNode (`src/manifest/scenario.ts:55` `export function resolveNode(document: unknown, nodes: readonly string[]): Resolved | string {`): o caminho já percorrido, usado nas mensagens de recusa, morre no fim da chamada.

### EXC-L10b-016
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/scenario.ts:159` `let container = node[field as string];`
- **Motivo:** variável local de applyOne (`src/manifest/scenario.ts:108` `function applyOne(doc: JsonObject, op: DiffOp): string | null {`): o cursor para o último recipiente morre no fim da chamada.

### EXC-L10b-017
- **Padrão:** P-E03
- **Ocorrência:** `src/manifest/scenario.ts:175` `let next = 0;`
- **Motivo:** contador local de withStandInIds (`src/manifest/scenario.ts:173` `export function withStandInIds(document: unknown): unknown {`): numera os ids provisórios durante a chamada e morre no fim dela.

# Estado — L10c (i18n)

## EST-L10c-001 — ouvinte de chaves traduzidas

- **Declaração:** `src/i18n/index.ts:48` `let keyListener: ((key: string) => void) | null = null;`
- **Forma:** `((key: string) => void) | null` — a função que ouve cada chave traduzida, ou `null` quando não há nenhuma.
- **Valores possíveis:**
  - V1 `null`: o valor inicial; nenhum ouvinte registrado (`src/i18n/index.ts:48` `let keyListener: ((key: string) => void) | null = null;`).
  - V2 a função ouvinte entregue por `listenToKeys`; `translate` a chama uma vez pela chave e, quando o texto tem plural, mais uma vez pela forma do plural (`src/i18n/index.ts:59` `if (form !== null) keyListener(form);`).
  - V3 `null` de novo, quando `listenToKeys(null)` desregistra o ouvinte (`src/i18n/index.ts:50` `keyListener = listener;`).
- **Escritores:**
  - `src/i18n/index.ts:50` `keyListener = listener;` via `listenToKeys`
- **Leitores:**
  - `src/i18n/index.ts:57` `if (keyListener !== null) {` via `translate`
  - `src/i18n/index.ts:58` `keyListener(key);` via `translate`
  - `src/i18n/index.ts:59` `if (form !== null) keyListener(form);` via `translate`
- **Criação:** `src/i18n/index.ts:48` `let keyListener: ((key: string) => void) | null = null;`
- **Descarte:** fim-da-página `src/i18n/index.ts:48` `let keyListener: ((key: string) => void) | null = null;`
- **Navegador:** não

# Exclusões: ocorrências de APIs do navegador

Ocorrências dos padrões de estado P-E04 e P-E11 que não são itens de estado: cada linha abaixo
consulta ou escreve o navegador no ato da chamada (o documento do quadro, a janela dele, a rolagem,
a seleção de texto), ou é um comentário, ou um texto constante, ou um campo de uma classe já
registrada.

## EXC-API-001
- **Padrão:** P-E04
- **Ocorrência:** `src/editor/shell/region-boundary.tsx:33` `export class RegionBoundary extends Component<Props, State> {`
- **Motivo:** declaração da classe da barreira de região; os campos dela (o `state.failed` e o `unsubscribe`) são o item de estado EST-L09b-012, já registrado. A linha só abre a classe, sem campo novo.

## EXC-API-002
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:63` `const win = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato da chamada (a `window` do iframe) para alcançar a rolagem da página; consulta ao navegador a cada chamada, não item guardado. O quadro registrado é o item de estado EST-L07-006.

## EXC-API-003
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:66` `if (!win || !iframe.contentDocument || !(zoom > 0) || box.width === 0) return null;`
- **Motivo:** verifica no ato a janela e o documento do quadro do canvas (a guarda de `geometryOf`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-004
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:76` `const doc = iframe.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato (o `elementAt` procura nele o elemento sob um ponto); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-005
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:96` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`innerBox`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-006
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:99` `const style = element ? iframe.contentWindow?.getComputedStyle(element) : undefined;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir o estilo computado do elemento (`innerBox`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-007
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:106` `const doc = iframe.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para decidir se um nó contém outro (`holdsNode`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-008
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:132` `const element = iframe.contentDocument?.querySelector(`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um id capturado (`capturedBox`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-009
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:141` `const doc = iframe.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para listar os nós sob um ponto (`nodesUnder`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-010
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:159` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`flowAxis`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-011
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:160` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir estilos computados (`flowAxis`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-012
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:172` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`flowReversed`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-013
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:173` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir estilos computados (`flowReversed`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-014
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:182` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`laysOut`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-015
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:183` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir o estilo computado (`laysOut`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-016
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:193` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`sideFlow`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-017
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:194` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir estilos computados (`sideFlow`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-018
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:205` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato e rola a página dela (`scrollPage`); consulta e escrita ao navegador na chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-019
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:216` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para repor a rolagem depois de um zoom (`keepPagePoint`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-020
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:247` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`elementRotation`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-021
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:248` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir o estilo computado da rotação (`elementRotation`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-022
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:282` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`resizeBasis`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-023
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:283` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir estilos computados do nó e do pai (`resizeBasis`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-024
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:345` `const page = iframe.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para percorrer os elementos desenhados (`elementBoxes`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-025
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:346` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir estilos computados de cada elemento (`elementBoxes`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-026
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:372` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`nodeBox`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-027
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:380` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`nodeSize`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-028
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:394` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`trackBoxes`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-029
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:424` `const element = iframe?.contentDocument?.querySelector(nodeSelector(id));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`pageLayout.box`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-030
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:434` `const element = iframe?.contentDocument?.querySelector(nodeSelector(id));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`pageLayout.paddingBox`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-031
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:449` `const document = current?.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para ler um tamanho de fonte (`pageLayout.fontPx`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-032
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:456` `const element = current?.contentDocument?.querySelector(nodeSelector(id));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`pageLayout.place`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-033
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:493` `const doc = iframe.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para percorrer os trechos de texto e os elementos substituídos (`readContentBoxes`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-034
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:528` `const element = current?.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`computedValues`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-035
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:653` `return current?.contentDocument ?? null;`
- **Motivo:** devolve o documento do quadro do canvas no ato (`canvasDocument`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-036
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:659` `const page = current?.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para ver se a página anima (`pageAnimating`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-037
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/frame.tsx:70` `const target = frame.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para entregá-lo ao renderizador (`CanvasFrame`, no arranque do quadro); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-038
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/frame.tsx:129` `const view = frame.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para instalar o mapa de teclas da edição em texto (`CanvasFrame.followEdit`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-039
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/frame.tsx:200` `if (frame.contentDocument?.readyState === 'complete' && frame.contentDocument.body) start();`
- **Motivo:** lê o documento do quadro do canvas no ato para ver se a página já carregou antes de arrancar (`CanvasFrame`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-040
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/frame.tsx:225` `const view = frame.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para guardar a rolagem no instante do zoom (`CanvasFrame`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-041
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/frame.tsx:235` `const inside = frame.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato, a cada quadro da espera do zoom, para repor a rolagem (`CanvasFrame`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-042
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/frame.tsx:245` `inside.scrollTo(inside.scrollX, wanted);`
- **Motivo:** escreve no ato a rolagem da página dentro do quadro do canvas (`CanvasFrame`), sem guardar o valor entre chamadas; consulta e escrita ao navegador na chamada. O quadro é o item EST-L07-006.

## EXC-API-043
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/captured.ts:64` `if (state.scrollLeft !== undefined || state.scrollTop !== undefined) scrolled.push([element, state.scrollLeft ?? 0, state.scrollTop ?? 0]);`
- **Motivo:** lê os deslocamentos guardados no estado de um elemento capturado (o campo `state` do nó capturado, dado do documento) e junta-os na lista local `scrolled`, consumida na mesma chamada de `mountCaptured`; não é item de estado do editor.

## EXC-API-044
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/captured.ts:139` `element.scrollLeft = left;`
- **Motivo:** escreve no ato o deslocamento horizontal do elemento do quadro, do estado capturado, enquanto monta a página capturada (`mountCaptured`); a lista `scrolled` morre no fim da chamada, sem vida entre chamadas.

## EXC-API-045
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/captured.ts:140` `element.scrollTop = top;`
- **Motivo:** escreve no ato o deslocamento vertical do elemento do quadro, do estado capturado, enquanto monta a página capturada (`mountCaptured`); a lista `scrolled` morre no fim da chamada, sem vida entre chamadas.

## EXC-API-046
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/inline.ts:4` `// What a contenteditable's DOM says about the runs of an inline text (split out of editor/canvas/render/render.ts,`
- **Motivo:** comentário do topo do arquivo que cita a palavra contenteditable ao explicar a origem do módulo; nenhuma chamada e nenhum valor guardado.

## EXC-API-047
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:36` `// contenteditable="plaintext-only" and data-key-context naming the key context of the edit, is focused with the caret`
- **Motivo:** comentário do topo do arquivo que cita a palavra contenteditable ao descrever a edição em texto no lugar; nenhuma chamada e nenhum valor guardado.

## EXC-API-048
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:51` `// what a contenteditable's DOM says about the runs (editor/canvas/render/inline.ts), moved out of this file`
- **Motivo:** comentário acima do import que cita a palavra contenteditable ao apontar o módulo movido; nenhuma chamada e nenhum valor guardado.

## EXC-API-049
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:77` `const EDITABLE_ATTRIBUTE = 'contenteditable';`
- **Motivo:** constante de módulo com o nome do atributo que marca o texto editado no lugar; é um texto literal, não um valor lido do navegador nem guardado entre chamadas.

## EXC-API-050
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:434` `const selection = this.target.getSelection();`
- **Motivo:** lê no ato a seleção de texto da página do quadro, para inserir a quebra de linha no ponto do cursor (`PageRenderer.insertLineBreak`); a seleção vive no navegador, não é item guardado. O texto editado é o item EST-L07-010.

## EXC-API-051
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:451` `const selection = this.target.getSelection();`
- **Motivo:** lê no ato a seleção de texto da página do quadro para selecionar todo o texto editado (`PageRenderer.selectEditedText`); a seleção vive no navegador, não é item guardado. O texto editado é o item EST-L07-010.

## EXC-API-052
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:466` `const selection = this.target.getSelection();`
- **Motivo:** lê no ato a seleção de texto da página do quadro para reduzi-la a um intervalo de caracteres (`PageRenderer.editedContent`); a seleção vive no navegador, não é item guardado. O texto editado é o item EST-L07-010.

## EXC-API-053
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:491` `const selection = this.target.getSelection();`
- **Motivo:** lê no ato a seleção de texto da página do quadro para repor o intervalo selecionado (`PageRenderer.focusEdited`); a seleção vive no navegador, não é item guardado. O texto editado é o item EST-L07-010.

## EXC-API-054
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/side-frame.tsx:50` `const target = frame.contentDocument;`
- **Motivo:** lê o documento do iframe do quadro lateral no ato para entregá-lo ao renderizador do quadro (`SideFrame`); consulta ao navegador a cada chamada, não item guardado. O quadro lateral é o item EST-L07-033.

## EXC-API-055
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/side-frame.tsx:59` `if (frame.contentDocument?.readyState === 'complete') start();`
- **Motivo:** lê o documento do iframe do quadro lateral no ato para ver se a página já carregou antes de arrancar (`SideFrame`); consulta ao navegador a cada chamada, não item guardado. O quadro lateral é o item EST-L07-033.

## EXC-API-056
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/motion/runtime/actions.ts:184` `win.scrollTo({ top: Math.max(0, box.top + win.scrollY - align + effect.offset), behavior });`
- **Motivo:** rola a janela da página no ato, ao executar a ação de rolagem do tempo de execução (`scroll`); leitura e escrita ao navegador na chamada, sem valor guardado entre chamadas.
