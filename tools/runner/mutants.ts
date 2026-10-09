// The catalogue of planted faults that proves the detectors detect (the investigation's C2, option B; grown from
// auditoria/investigacao/poc/c7-historico/mutantes.ts). Each mutant swaps one exact passage of one source file for
// another when the module loads (the Vite plugin below, active only when BUILDER_MUTANT names a mutant); the file on
// disk never changes, as with the tooth proof (tools/runner/tooth-plugin.ts). Each declares the rule it breaks, the
// detectors that reach it (the groups of tools/runner/model/) and, when it cannot be told apart from the original by
// any input the editor can produce (an equivalent mutant), why. tools/runner/mutants-run.ts runs them all and fails
// when one survives with no reason written here. A defect of phase 8 joins the catalogue with the fault that
// reproduces it, for good.
import fs from 'node:fs';
import { normalizePath, type Plugin } from 'vite';

export type Detector = 'history' | 'style' | 'structure' | 'text' | 'pages' | 'fields' | 'machine' | 'lifetime' | 'inventory' | 'lint' | 'modes' | 'races' | 'composer' | 'drafts' | 'robustness' | 'i18n' | 'import' | 'storage' | 'compat' | 'render' | 'manifest' | 'ui-fit';

export interface Mutant {
  readonly id: string;
  readonly file: string;
  // the passage swapped: it must appear exactly once in the file
  readonly from: string;
  readonly to: string;
  // the rule the mutant breaks, in words
  readonly breaks: string;
  // where the fault comes from: the proof of concept, an acceptance failure of the report (C2, C7) or a defect
  readonly source: string;
  readonly detectors: readonly Detector[];
  // why no input tells it apart from the original: it survives by right
  readonly equivalent?: string;
}

const ALL: readonly Detector[] = ['history', 'style', 'structure', 'text', 'pages', 'fields', 'machine', 'lifetime', 'inventory', 'lint', 'modes', 'races', 'composer', 'drafts', 'robustness', 'i18n', 'import', 'storage', 'compat', 'render', 'manifest', 'ui-fit'];

export const MUTANTS: readonly Mutant[] = [
  { id: 'M01', file: 'src/core/history/history.ts', from: '    selection: tx.selectionBefore,', to: '    selection: tx.selectionAfter,', breaks: 'desfazer restaura a seleção de depois do comando', source: 'prova C7', detectors: ['history'] },
  { id: 'M02', file: 'src/core/history/history.ts', from: '    selection: tx.selectionAfter,', to: '    selection: tx.selectionBefore,', breaks: 'refazer restaura a seleção de antes do comando', source: 'prova C7', detectors: ['history'] },
  { id: 'M03', file: 'src/core/history/history.ts', from: 'inverses: [...tx.inverses, ...last.inverses],', to: 'inverses: [...last.inverses, ...tx.inverses],', breaks: 'a fusão de entradas inverte a ordem dos inversos', source: 'prova C7', detectors: ['history', 'style'] },
  { id: 'M04', file: 'src/core/history/history.ts', from: 'return { past: [...history.past, tx], future: [] };', to: 'return { past: [...history.past, tx], future: history.future };', breaks: 'uma entrada nova não esvazia a pilha de refazer', source: 'prova C7', detectors: ['history'] },
  { id: 'M05', file: 'src/core/history/history.ts', from: 'tx.at - last.at <= within', to: 'true', breaks: 'a fusão ignora a janela de tempo', source: 'prova C7', detectors: ['history', 'style'] },
  { id: 'M06', file: 'src/core/history/transaction.ts', from: "inverse = exists ? { op: 'replace', path, value: old } : { op: 'remove', path };", to: "inverse = exists ? { op: 'replace', path, value: patch.value } : { op: 'remove', path };", breaks: 'o inverso de uma troca de chave guarda o valor novo', source: 'prova C7', detectors: ['history', 'style'] },
  { id: 'M07', file: 'src/core/history/transaction.ts', from: 'inverses.unshift(result.inverse);', to: 'inverses.push(result.inverse);', breaks: 'os inversos de uma transação ficam na ordem errada', source: 'prova C7', detectors: ['history', 'structure'] },
  { id: 'M08', file: 'src/core/store/store.ts', from: 'JSON.stringify(a.property ?? null)', to: 'JSON.stringify(null)', breaks: 'a chave de fusão esquece a propriedade', source: 'prova C7', detectors: ['history', 'style'] },
  { id: 'M09', file: 'src/core/store/store.ts', from: '    const previousMergeable = lastMergeable;\n    lastMergeable = null;\n', to: '    const previousMergeable = lastMergeable;\n', breaks: 'um comando no meio não interrompe a fusão', source: 'prova C7', detectors: ['history', 'style'] },
  { id: 'M10', file: 'src/core/store/store.ts', from: "outcome.kind === 'undo' ? tx.inverses : tx.patches);", to: "outcome.kind === 'undo' ? tx.patches : tx.inverses);", breaks: 'o desenho incremental recebe os patches errados no desfazer', source: 'prova C7', detectors: ['history'] },
  { id: 'M11', file: 'src/core/store/store.ts', from: "document: before.document, selection: before.selection, history: before.history }, 'a cancelled gesture')", to: "document: before.document, selection: state.selection, history: before.history }, 'a cancelled gesture')", breaks: 'cancelar um gesto não devolve a seleção', source: 'prova C7', detectors: ['history'] },
  { id: 'M12', file: 'src/core/store/store.ts', from: 'if (documentChanged && gesture === null && ownedGroup === null) {', to: 'if (documentChanged && ownedGroup === null) {', breaks: 'cada passo de um gesto vira uma entrada própria', source: 'prova C7', detectors: ['history'] },
  { id: 'M13', file: 'src/core/store/store.ts', from: 'selectionBefore: before.selection, selectionAfter: selection,', to: 'selectionBefore: selection, selectionAfter: selection,', breaks: 'a transação guarda como seleção de antes a de depois', source: 'prova C7', detectors: ['history'] },
  { id: 'M14', file: 'src/core/store/store.ts', from: 'if (documentChanged && gesture === null && ownedGroup === null) {', to: 'if (gesture === null && ownedGroup === null) {', breaks: 'uma mudança só de seleção entra no histórico', source: 'prova C7', detectors: ['history'] },
  { id: 'M15', file: 'src/core/store/store.ts', from: 'selection: [], history: EMPTY_HISTORY, message: outcome.message', to: 'selection: [], history: state.history, message: outcome.message', breaks: 'abrir outro projeto mantém o histórico do anterior', source: 'prova C7', detectors: ['pages'] },
  { id: 'M16', file: 'src/editor/store.ts', from: 'const at = context ?? beforeCommand(id, args, changesDocument);', to: 'const at = context;', breaks: 'um comando roda sem gravar antes a digitação pendente', source: 'prova C7', detectors: ['history', 'text'] },
  { id: 'M17', file: 'src/editor/input/pending.ts', from: '  if (held !== null && held.field !== typing.field) keepTyping();', to: '', breaks: 'um campo novo descarta a digitação pendente do anterior', source: 'prova C7', detectors: ['history', 'text'] },
  { id: 'M18', file: 'src/editor/store.ts', from: '      waiting.push(() => void store.dispatch(id, args, asked));', to: '', breaks: 'um comando que chega durante um gesto se perde', source: 'prova C7', detectors: ['history'] },
  {
    id: 'M19',
    file: 'src/editor/input/pending.ts',
    from: '  if (typing.owns(id, (args ?? {}) as Readonly<Record<string, unknown>>)) return typing.context;',
    to: '  if (typing.owns(id, (args ?? {}) as Readonly<Record<string, unknown>>)) return undefined;',
    breaks: 'o comando do próprio campo roda no contexto atual e não no da digitação (G1)',
    source: 'C2',
    detectors: ['style'],
    equivalent:
      'com a digitação pendente, o contexto atual é sempre o da digitação: toda troca de camada, classe, quadro-chave ou seleção passa pela store do editor, que grava a digitação na hora (src/editor/store.ts, a linha que compara editedKey antes e depois do comando; M27 acusa a falta dela), e o rascunho restaurado troca antes o breakpoint para o dele (src/editor/persistence/drafts.ts, setBreakpoint na restauração); um comando do campo nunca encontra outro contexto',
  },
  { id: 'M20', file: 'src/editor/input/pending.ts', from: '  if (target instanceof Node && within(typing, target)) return;\n  keepTyping();\n', to: '  if (target instanceof Node && within(typing, target)) return;\n', breaks: 'um toque fora do campo não grava a digitação pendente antes de agir (G2)', source: 'C2', detectors: ['history', 'text'] },
  { id: 'M21', file: 'src/editor/store.ts', from: 'styleClass: state.ui.styleTarget ?? null, keyframe: keyframeTarget(state) };', to: 'styleClass: state.ui.styleTarget ?? null };', breaks: 'o contexto da edição sai sem o quadro-chave', source: 'C2', detectors: ['style'] },
  { id: 'M22', file: 'src/core/document/validate.ts', from: '    if (first !== undefined) bad(path, `id "${id}" is already used at ${first}`);', to: '    if (first === "\\u0000") bad(path, `id "${id}" is already used at ${first}`);', breaks: 'validateDocument aceita ids repetidos', source: 'C2', detectors: ['structure'] },
  { id: 'M23', file: 'src/core/history/transaction.ts', from: "      if (index > next.length) throw new PatchError(`index ${index} is past the end at ${path.join('/')}`);\n", to: '', breaks: 'applyPatches aceita um índice além do fim', source: 'C2', detectors: ['structure'] },
  { id: 'M24', file: 'src/editor/input/pending.ts', from: '  if (!changesDocument && focused !== null && within(typing, focused)) return undefined;', to: '  if (!changesDocument) return undefined;', breaks: 'um comando de fora do campo que não muda o documento (refazer, desfazer, trocar o breakpoint) roda sem gravar a digitação pendente', source: 'C7', detectors: ['history', 'style'] },
  {
    id: 'M25',
    file: 'src/core/store/store.ts',
    from: "history: before.history, confirmation: before.confirmation ?? null }, 'a cancelled command group')",
    to: "history: before.history }, 'a cancelled command group')",
    breaks: 'cancelar um grupo de comandos não devolve a confirmação pendente',
    source: 'C7',
    detectors: ['history'],
    equivalent:
      'nenhuma confirmação muda durante um grupo: o grupo não abre com uma confirmação pendente (src/core/store/store.ts, commandGroup lança "a confirmation is waiting") e um comando que pede confirmação dentro do grupo é recusado com as palavras do grupo (groupBlocked inclui o resultado confirm), então a confirmação de antes é a mesma que o estado tem ao cancelar',
  },
  { id: 'M26', file: 'src/core/store/store.ts', from: '    let history = before.history;\n', to: '    let history = { past: before.history.past, future: [] as typeof before.history.future };\n', breaks: 'uma escrita só de state.ui esvazia a pilha de refazer', source: 'C7', detectors: ['history'] },
  { id: 'M28', file: 'src/core/history/history.ts', from: '    if (document !== undefined && deepEqual(applyPatches(document, merged.inverses).document, document)) return { past: history.past.slice(0, -1), future: [] };\n', to: '', breaks: 'uma rajada fundida que volta ao documento de antes deixa uma entrada que não muda nada', source: 'DEF-0508', detectors: ['history', 'style'] },
  { id: 'M29', file: 'src/core/store/store.ts', from: 'lastMergeable = history.past.length < before.history.past.length ? null : key;', to: 'lastMergeable = key;', breaks: 'depois de a entrada de uma rajada sair, o passo seguinte funde numa entrada mais antiga', source: 'DEF-0508', detectors: ['history', 'style'] },
  { id: 'M30', file: 'src/core/style/codecs.ts', from: "  return Object.is(rounded, -0) ? '0' : String(rounded);", to: '  return String(rounded);', breaks: 'writeNumber deixa passar -0', source: 'C5', detectors: ['fields'], equivalent: 'String de menos zero já é "0" em JavaScript (ECMAScript, Number::toString: -0 é escrito "0"; medido em Node 24: String(-0), `${-0}` e (-0).toString() dão "0"), então nenhum número escrito por writeNumber sai "-0" com ou sem a comparação Object.is; a guarda descreve a regra, e o contrato de campo confere que nenhum comprimento gravado é -0' },
  { id: 'M31', file: 'src/core/style/set.ts', from: "const decimal = /^\\s*[+-]?\\d+,\\d+\\s*[a-z%]*\\s*$/i.test(typedText) ? typedText.replace(',', '.') : typedText;", to: 'const decimal = typedText;', breaks: 'a vírgula decimal do pt-BR deixa de ser lida como ponto', source: 'C5', detectors: ['fields'] },
  { id: 'M32', file: 'src/core/style/codecs.ts', from: "      return facts.units.includes(unit) ? { kind: 'length', number: Number(plain[1]), unit } : null;", to: "      return facts.units.includes(unit) && unit !== 'em' ? { kind: 'length', number: Number(plain[1]), unit } : null;", breaks: 'uma unidade oferecida que o codec não lê', source: 'C5', detectors: ['fields'] },
  { id: 'M33', file: 'src/editor/inspector/number-field.ts', from: "  return modifier === 'Shift' ? SHIFT_FACTOR : modifier === 'Alt' ? ALT_FACTOR : 1;", to: "  return modifier === 'Shift' ? SHIFT_FACTOR * 10 : modifier === 'Alt' ? ALT_FACTOR : 1;", breaks: 'um passo de campo com Shift multiplica por 100', source: 'C5', detectors: ['fields'] },
  { id: 'M34', file: 'src/core/style/codecs.ts', from: '    positionAxis,\n', to: '', breaks: 'um codec declarado no manifesto sem registro: background-position-x e -y recusam todo valor', source: 'DEF-0509', detectors: ['fields'] },
  { id: 'M35', file: 'tools/runner/contracts.ts', from: '  return [...keys];', to: "  return [...keys, 'status.value.semPalavras'];", breaks: 'uma recusa de um comando de campo sem palavras nos catálogos', source: 'C5', detectors: ['fields'] },
  { id: 'M36', file: 'src/editor/input/pointer/machine.ts', from: "  if (event.type === 'down' && event.pointer === machine.pointer) return { machine: { phase: 'pressed', pointer: event.pointer, start: event.at, press: event.press }, effect: 'restart' };\n", to: '', breaks: 'o segundo toque do mesmo ponteiro com o gesto aberto é ignorado e o gesto fica preso', source: 'DEF-0510', detectors: ['machine'] },
  { id: 'M37', file: 'src/editor/input/pointer/machine.ts', from: "  if (machine.phase === 'pressed' && Math.hypot(event.at.x - machine.start.x, event.at.y - machine.start.y) >= dragThreshold) {", to: "  if (machine.phase === 'pressed' && Math.hypot(event.at.x - machine.start.x, event.at.y - machine.start.y) > dragThreshold) {", breaks: 'uma transição de step muda sem a tabela gerada ser atualizada (o arraste começa um pixel depois do limiar)', source: 'C3', detectors: ['machine'] },
  { id: 'M38', file: 'src/core/store/store.ts', from: '      const ui = tx.context !== undefined && options.restoreContext !== undefined ? options.restoreContext({ ...state, ...restored }, tx.context) : state.ui;', to: '      const ui = state.ui;', breaks: 'desfazer e refazer não devolvem o contexto em que a mudança foi feita', source: 'DEF-0511', detectors: ['history', 'style'] },
  { id: 'M39', file: 'src/core/store/store.ts', from: '      const context = contextAt(before, at);', to: '      const context = contextAt(before);', breaks: 'a transação grava o contexto que o editor mostra, e não o contexto em que a digitação foi gravada', source: 'DEF-0511', detectors: ['history', 'style'] },
  { id: 'M40', file: 'src/editor/view/edit-context.ts', from: '  if (context.keyframe !== null && context.keyframe !== undefined) ui = atKeyframe({ ...state, ui }, context.keyframe) ?? ui;\n', to: '', breaks: 'desfazer e refazer não devolvem o quadro-chave em que a mudança foi feita', source: 'DEF-0511', detectors: ['style'] },
  { id: 'M41', file: 'src/editor/test-boot.ts', from: '    if (frame !== null) target.cancelAnimationFrame(frame);\n', to: '', breaks: 'parar o boot de teste desenhado deixa o quadro pendente agendado', source: 'DEF-0001', detectors: ['lifetime'] },
  { id: 'M42', file: 'src/editor/test-boot.ts', from: '    if (!stopped) frame = target.requestAnimationFrame(settle);', to: '    frame = target.requestAnimationFrame(settle);', breaks: 'parado antes das fontes, o boot de teste desenhado ainda pede um quadro', source: 'DEF-0001', detectors: ['lifetime'] },
  { id: 'M27', file: 'src/editor/store.ts', from: '      if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();\n', to: '', breaks: 'um comando que muda o que o campo edita deixa a digitação pendente (G1, G2)', source: 'C2', detectors: ['style'] },
  { id: 'M43', file: 'src/editor/canvas/side-frame.tsx', from: ' data-door={entry.ref} data-args={JSON.stringify({ breakpoint: breakpoint.id })}', to: ' data-args={JSON.stringify({ breakpoint: breakpoint.id })}', breaks: 'um botão que roda um comando do manifesto sem dono: nem porta, nem controle local, nem exceção com motivo', source: 'C1', detectors: ['inventory'] },
  { id: 'M44', file: 'src/editor/shell/field-origin.tsx', from: "      document.removeEventListener('focusin', update);\n", to: '', breaks: 'um addEventListener sem remoção num efeito de componente', source: 'C6', detectors: ['lint'] },
  { id: 'M45', file: 'src/editor/doors/menu.tsx', from: '    return () => sizes.disconnect();', to: '    return () => undefined;', breaks: 'um ResizeObserver que não desconecta ao fechar o menu', source: 'C6', detectors: ['lint'] },
  { id: 'M46', file: 'src/editor/input/keymap.ts', from: '    const context = gesture?.context ?? (previewing(', to: '    const context = (previewing(', breaks: 'um menu que abre durante um arraste: com o gesto do ponteiro aberto, os atalhos globais chegam', source: 'C6', detectors: ['modes'] },
  { id: 'M47', file: 'src/editor/persistence/autosave.ts', from: "    window.clearTimeout(retry);\n    window.removeEventListener('beforeunload', guard);", to: "    window.removeEventListener('beforeunload', guard);", breaks: 'um setTimeout de autosave que sobrevive à parada: a nova tentativa fica agendada', source: 'C6', detectors: ['lifetime'] },
  { id: 'M48', file: 'src/editor/persistence/autosave.ts', from: "    pending = work;\n    setState('saving');\n    writeWhenIdle();", to: "    pending ??= work;\n    setState('saving');\n    writeWhenIdle();", breaks: 'um autosave que sobrevive à troca de projeto: o trabalho do projeto anterior fica pendente e é gravado', source: 'C6', detectors: ['lifetime'] },
  { id: 'M49', file: 'src/editor/input/after-read.ts', from: '    if (editedKey(store.getState()) !== taken) {', to: "    if (editedKey(store.getState()) === '\\u0000') {", breaks: 'o que chega tarde de uma leitura roda no contexto que mudou', source: 'DEF-0513', detectors: ['races'] },
  { id: 'M50', file: 'src/editor/input/keymap.ts', from: 'afterRead(store, readClipboard(), (content) =>', to: 'void readClipboard().then((content) =>', breaks: 'a tecla de colar despacha quando a leitura chega, sem conferir o contexto da tecla', source: 'DEF-0513', detectors: ['races'] },
  { id: 'M51', file: 'src/modules/layout-composer/ui/overlay.tsx', from: '  const [open, setOpen] = useState(composer !== null);\n  if ((composer !== null) !== open) {\n    setOpen(composer !== null);\n    if (composer === null) {\n      setBox(null);\n      setMeasured(null);\n    }\n  }\n', to: '', breaks: 'o compositor reaberto desenha o primeiro quadro com a caixa e as regiões da sessão anterior (o código de antes do DEF-0512)', source: 'DEF-0512', detectors: ['composer'] },
  { id: 'M52', file: 'src/editor/input/held-draft.ts', from: '      if (holding() !== null) keepTyping();\n', to: '', breaks: 'um campo de valor perde a digitação ao perder o foco ou ao sair (G2)', source: 'DEF-0514', detectors: ['drafts'] },
  { id: 'M53', file: 'src/editor/shell/panel-field.tsx', from: '            typed.current = event.target.value;\n            held.current?.typed();\n', to: '            typed.current = event.target.value;\n', breaks: 'o campo de painel guarda a digitação só para si, fora do registro (o código de antes do DEF-0514)', source: 'DEF-0514', detectors: ['drafts'] },
  { id: 'M54', file: 'src/editor/canvas/edit-handles.tsx', from: '        onInput={() => held.current?.typed()}\n', to: '', breaks: 'a banda digitada guarda a digitação só para si, fora do registro (o código de antes do DEF-0514)', source: 'DEF-0514', detectors: ['drafts'] },
  { id: 'M55', file: 'src/editor/shell/guides-grids.tsx', from: "    run(entry, { axis, at: typedNumber(field?.value ?? '') });", to: "    if (field !== null && field.value.trim() !== '' && Number.isFinite(Number(field.value))) run(entry, { axis, at: Number(field.value) });", breaks: 'o formulário de nova guia decide sozinho que um texto vazio ou não numérico não roda o comando (o código de antes do DEF-0515)', source: 'DEF-0515', detectors: ['drafts'] },
  { id: 'M56', file: 'src/editor/input/held-draft.ts', from: "(text.trim() === '' ? Number.NaN : Number(text))", to: '(Number(text))', breaks: 'um campo numérico vazio vira 0 e roda o comando como se a pessoa tivesse digitado 0', source: 'DEF-0515', detectors: ['drafts'] },
  { id: 'M57', file: 'src/core/style/codecs.ts', from: "    if (token === '(') {\n      if (nesting >= MAX_NESTING) return null;\n      nesting += 1;\n      const inner = sum();\n      nesting -= 1;\n", to: "    if (token === '(') {\n      const inner = sum();\n", breaks: 'a conta de números segue um aninhamento sem limite e derruba o leitor (o código de antes do DEF-0516)', source: 'DEF-0516', detectors: ['robustness'] },
  { id: 'M58', file: 'src/core/style/codecs.ts', from: "    if (token.text === '(') {\n      if (nesting >= MAX_NESTING) return null;\n      nesting += 1;\n      const inner = sum();\n      nesting -= 1;\n", to: "    if (token.text === '(') {\n      const inner = sum();\n", breaks: 'a conta de comprimentos segue um aninhamento sem limite e derruba o leitor (o código de antes do DEF-0516)', source: 'DEF-0516', detectors: ['robustness'] },
  { id: 'M59', file: 'src/core/history/transaction.ts', from: '  Object.defineProperty(container, key, { value, writable: true, enumerable: true, configurable: true });', to: '  container[key] = value;', breaks: 'uma chave __proto__ num patch escreve no protótipo em vez de ser uma chave comum do objeto', source: 'C8', detectors: ['robustness'] },
  { id: 'M60', file: 'src/core/document/captured.ts', from: "  if (name.startsWith('on') || name === 'srcdoc') return true;", to: "  if (name === 'srcdoc') return true;", breaks: 'um atributo de evento (on…) atravessa a captura de uma página', source: 'C8', detectors: ['import'] },
  { id: 'M61', file: 'src/core/elements/svg.ts', from: "      if (lower.startsWith('on') || ((LINK_ATTRIBUTES.has(lower) || ANIMATED_VALUES.has(lower)) && scripted(value))) continue;", to: "      if ((LINK_ATTRIBUTES.has(lower) || ANIMATED_VALUES.has(lower)) && scripted(value)) continue;", breaks: 'um atributo de evento (on…) atravessa o sanitizador do markup de SVG', source: 'C8', detectors: ['import'] },
  { id: 'M62', file: 'src/editor/shell/preview.tsx', from: 'sandbox="allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"', to: 'sandbox="allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox allow-same-origin"', breaks: 'o quadro da prévia junta allow-scripts com allow-same-origin, o que anula o isolamento', source: 'C8', detectors: ['compat'] },
  { id: 'M63', file: 'src/editor/shell/preview.tsx', from: '      if (event.source === null || event.source !== frame.current?.contentWindow) return;\n', to: '', breaks: 'um ouvinte de message da janela deixa de conferir a janela que enviou', source: 'C8', detectors: ['compat'] },
  { id: 'M64', file: 'src/editor/store.ts', from: '  return useSyncExternalStore(store.subscribe, () => select(store.getState()));', to: '  return useSyncExternalStore(store.subscribe, store.getState) as unknown as T;', breaks: 'a vista lê o estado inteiro em vez da fatia que mostra, e redesenha a cada publicação', source: 'C8', detectors: ['render'] },
  { id: 'M65', file: 'src/core/document/validate.ts', from: '    if (notATree.length > 0) return notATree;\n', to: '', breaks: 'uma página cuja árvore não é uma árvore de nós derruba a validação em vez de ser recusada (o código de antes do DEF-0517)', source: 'DEF-0517', detectors: ['storage'] },
  { id: 'M66', file: 'src/i18n/locales/en.json', from: '  "easing.title": "Curve",\n', to: '', breaks: 'uma chave do catálogo inglês deixa de ter par no português', source: 'C8', detectors: ['i18n'] },
  { id: 'M67', file: 'src/manifest/check/base.ts', from: "  'generated/behavior.json': { key: 'behavior', schema: generatedBehaviorSchema },\n  'generated/inventory.json': { key: 'inventory', schema: generatedInventorySchema },\n", to: '', breaks: 'a lista de arquivos do verificador deixa de conhecer os dois artefatos gerados (o código de antes do DEF-0518)', source: 'DEF-0518', detectors: ['manifest'] },
  { id: 'M68', file: 'src/ui/tokens.css', from: '--size-inspector: 336px;', to: '--size-inspector: 280px;', breaks: 'a coluna do inspector encolhe e o rótulo mais longo de uma porta não cabe (o mutante da prova do C4)', source: 'C4', detectors: ['ui-fit'] },
  { id: 'M69', file: 'src/core/render/captured.ts', from: "parent.namespace === HTML && RAW_TEXT.has(parent.tag) ? rawText(node.value, parent.tag) : escapeText(node.value)", to: "RAW_TEXT.has(parent.tag) ? node.value : escapeText(node.value)", breaks: 'o texto de um <style> é escrito cru: um </style> nele fecha o elemento e o resto vira markup que executa (o código de antes do DEF-0524)', source: 'DEF-0524', detectors: ['import'] },
  { id: 'M70', file: 'src/core/render/captured.ts', from: "`<!--${commentText(node.value)}-->`", to: "`<!--${node.value.replaceAll('-->', '--&gt;')}-->`", breaks: 'o texto de um comentário só troca -->, e um --!> fecha o comentário (o código de antes do DEF-0524)', source: 'DEF-0524', detectors: ['import'] },
  { id: 'M71', file: 'src/core/document/captured.ts', from: "  if (ANIMATED_VALUES.has(name) && attribute.value.split(';').some(runsCode)) return true;\n", to: '', breaks: 'a captura deixa uma animação escrever javascript: num vínculo (o código de antes do DEF-0525)', source: 'DEF-0525', detectors: ['import'] },
  { id: 'M72', file: 'src/core/elements/svg.ts', from: '(ANIMATED_VALUES.has(lower) && scriptedItem(value))', to: "(ANIMATED_VALUES.has(lower) && (scripted(value) || (lower === 'values' && value.split(';').some(scripted))))", breaks: 'o sanitizador do SVG divide values antes de decodificar, e um ; escrito &#59; esconde o javascript: (o código de antes do DEF-0525)', source: 'DEF-0525', detectors: ['import'] },
];

export const ALL_DETECTORS = ALL;

// The Vite plugin of the mutant BUILDER_MUTANT names: it swaps the passage when the file loads, and leaves a mark in
// .cache/mutants/<id>.applied so the run tells a mutant that loaded from one whose file no detector loaded.
export function mutantPlugin(): Plugin | null {
  const chosen = process.env.BUILDER_MUTANT ?? '';
  if (chosen === '') return null;
  const mutant = MUTANTS.find((m) => m.id === chosen);
  if (mutant === undefined) throw new Error(`unknown mutant: ${chosen}`);
  return {
    name: 'builder-mutant',
    enforce: 'pre',
    transform(code, id) {
      const file = normalizePath(id).split('?')[0] ?? '';
      if (!file.endsWith(`/${mutant.file}`)) return undefined;
      return swapped(mutant, code);
    },
  };
}

// The text of a source file a detector reads from the disk (tools/runner/model/inventory.test.ts: the interactive
// elements are read from the source, not loaded), with the passage of the mutant BUILDER_MUTANT names swapped when the
// file is the mutant's; `file` is relative to the project, with forward slashes.
export function mutatedSource(file: string, code: string): string {
  const mutant = MUTANTS.find((m) => m.id === (process.env.BUILDER_MUTANT ?? ''));
  return mutant === undefined || file !== mutant.file ? code : swapped(mutant, code);
}

// the passage swapped, once, with the mark of a mutant that loaded
function swapped(mutant: Mutant, code: string): string {
  const source = code.replace(/\r\n/g, '\n');
  const times = source.split(mutant.from).length - 1;
  if (times !== 1) throw new Error(`mutant ${mutant.id}: its passage appears ${times} times in ${mutant.file}`);
  fs.mkdirSync('.cache/mutants', { recursive: true });
  fs.writeFileSync(`.cache/mutants/${mutant.id}.applied`, mutant.file);
  return source.replace(mutant.from, () => mutant.to);
}
