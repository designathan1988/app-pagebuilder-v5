// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// Prova de conceito C7/C2: teste baseado em modelo (fast-check fc.commands + fc.modelRun) sobre a store real do
// editor, sem navegador. O modelo é a pilha de entradas { antes, depois } que a pessoa espera, montada a partir das
// regras do manifesto (history.coalesce, undoRestoresSelection) e do que cada passo publicou. Depois de cada passo:
//  - toda publicação que muda o documento cria uma entrada nova, ou funde com a anterior só quando o manifesto
//    permite (mesmo comando, mesmo alvo e propriedade, dentro da janela da constante, sem comando no meio);
//  - uma publicação que não muda o documento não mexe no histórico (nada fora do documento entra nele);
//  - desfazer volta exatamente ao documento e à seleção de antes da entrada; refazer, aos de depois;
//  - cada DocumentChange publicado leva `before` a `after` pelos próprios patches (o desenho incremental);
//  - a digitação pendente (src/editor/input/pending.ts) é gravada antes de qualquer comando de fora do campo;
//  - um gesto vira uma entrada no commit e nenhuma durante; cancelado, volta ao documento e à seleção de antes.
// No fim de cada sequência: desfazer tudo volta ao início, e refazer tudo volta ao fim.
import fs from 'node:fs';
import fc from 'fast-check';
import { it } from 'vitest';
import { walk, type DocumentJson, type Selection } from '../../../../src/core/document/model.ts';
import { applyPatches, deepEqual } from '../../../../src/core/history/transaction.ts';
import { manualClock, type ManualClock } from '../../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../../src/core/ports/ids.ts';
import type { DocumentChange, Gesture } from '../../../../src/core/store/store.ts';
import { createEditorStore, editContextOf, MODEL_RULES, type EditorState, type EditorStore } from '../../../../src/editor/store.ts';
import { heldTyping, holdTyping, keepTyping } from '../../../../src/editor/input/pending.ts';
import type { CommandId } from '../../../../src/generated/ids.ts';
import { manifest } from '../../../../src/manifest/runtime.ts';

const SAIDA = 'auditoria/investigacao/poc/c7-historico/resultados';
const FIXTURES = ['aurora', 'responsive-sections', 'grid-page'].filter((n) => fs.existsSync(`manifest/features/fixtures/${n}.json`));
const fixture = (name: string): DocumentJson => JSON.parse(fs.readFileSync(`manifest/features/fixtures/${name}.json`, 'utf8')) as DocumentJson;
const memoria = (): { read(): string | null; write(text: string): void } => {
  let guardado: string | null = null;
  return { read: () => guardado, write: (t) => void (guardado = t) };
};

// ------------------------------------------------------------ o que o manifesto declara do histórico
const COMANDOS = new Map(manifest.commands.map((c) => [c.id, c]));
const CONSTANTES = new Map(manifest.interactions.constants.map((c) => [c.id, c.value]));
function janelaDeFusao(id: string): number | null {
  const h = COMANDOS.get(id as CommandId)?.history as { undoable: boolean; coalesce?: 'none' | { same: string; within: string } } | undefined;
  if (h === undefined || !h.undoable || h.coalesce === undefined || h.coalesce === 'none') return null;
  const v = CONSTANTES.get(h.coalesce.within as never);
  return typeof v === 'number' ? v : null;
}
// "same: target-and-property": o alvo é o nó que os argumentos nomeiam, ou a seleção sobre a qual o comando age
const chaveDeFusao = (id: string, args: Record<string, unknown>, selecao: Selection): string =>
  JSON.stringify([id, args.target ?? args.targets ?? args.nodes ?? selecao, args.property ?? null]);

// ------------------------------------------------------------ modelo e sistema real
interface Foto { readonly document: DocumentJson; readonly selection: Selection }
interface Entrada { readonly antes: Foto; depois: Foto }
interface Modelo { passado: Entrada[]; futuro: Entrada[]; ultimaChave: string | null; ultimoInstante: number }
type Fase = 'normal' | 'gesto' | 'fim-de-gesto';
interface Real {
  readonly store: EditorStore;
  readonly relogio: ManualClock;
  publicadas: { estado: EditorState; fase: Fase }[];
  mudancas: DocumentChange[];
  fase: Fase;
  digitacao: { campo: HTMLInputElement; gravada: boolean } | null;
  ultimo: EditorState;
}
const foto = (s: EditorState): Foto => ({ document: s.document, selection: s.selection });
const nos = (s: EditorState): string[] => s.document.pages.flatMap((p) => [...walk(p.tree)].map((n) => n.id));

class Quebra extends Error {}
const exigir = (cond: boolean, texto: string): void => {
  if (!cond) throw new Quebra(texto);
};

// confere as publicações de um passo contra o modelo; `chave` e `janela` dizem se o comando do passo funde
function conferirPublicacoes(m: Modelo, r: Real, passo: { chave: string | null; janela: number | null; antesDoGesto?: Foto }): boolean {
  let anterior = r.ultimo;
  let criouOuFundiu = false;
  let gestoFechado = false;
  for (const { estado, fase } of r.publicadas) {
    const cresceu = estado.history.past.length - anterior.history.past.length;
    const mudouDoc = !deepEqual(anterior.document, estado.document);
    if (fase === 'gesto') {
      exigir(estado.history === anterior.history || deepEqual(estado.history, anterior.history), 'o histórico mudou durante um gesto aberto');
    } else if (fase === 'fim-de-gesto' && !gestoFechado && passo.antesDoGesto !== undefined) {
      gestoFechado = true;
      if (cresceu === 1) {
        exigir(estado.history.future.length === 0, 'o commit do gesto não esvaziou a pilha de refazer');
        m.passado.push({ antes: passo.antesDoGesto, depois: foto(estado) });
        m.futuro = [];
      } else if (cresceu === 0 && mudouDoc) {
        // o cancelamento volta ao estado de antes do gesto
        exigir(deepEqual(estado.document, passo.antesDoGesto.document), 'cancelar o gesto não devolveu o documento de antes');
        exigir(deepEqual(estado.selection, passo.antesDoGesto.selection), 'cancelar o gesto não devolveu a seleção de antes');
      } else {
        exigir(cresceu === 0, `o fim do gesto mexeu no histórico em ${cresceu} entradas`);
      }
    } else if (cresceu === 1) {
      exigir(mudouDoc, 'uma entrada nova entrou no histórico sem mudança no documento');
      exigir(estado.history.future.length === 0, 'uma entrada nova não esvaziou a pilha de refazer');
      m.passado.push({ antes: foto(anterior), depois: foto(estado) });
      m.futuro = [];
      criouOuFundiu = true;
    } else if (cresceu === 0 && mudouDoc) {
      const podeFundir = passo.janela !== null && passo.chave !== null && m.ultimaChave === passo.chave && r.relogio.now() - m.ultimoInstante <= passo.janela;
      exigir(podeFundir, 'o documento mudou e nenhuma entrada nova apareceu, sem fusão que o manifesto permita');
      exigir(estado.history.future.length === 0, 'a fusão não esvaziou a pilha de refazer');
      const topo = m.passado.at(-1);
      exigir(topo !== undefined, 'fusão sem entrada anterior');
      if (topo !== undefined) topo.depois = foto(estado);
      conta().fusoes += 1;
      criouOuFundiu = true;
    } else if (cresceu === 0) {
      exigir(deepEqual(estado.history, anterior.history), 'o histórico mudou sem mudança no documento');
    } else {
      exigir(false, `o histórico perdeu ${-cresceu} entradas num passo que não desfaz`);
    }
    anterior = estado;
  }
  return criouOuFundiu;
}

type Conta = { passos: number; entradasMax: number; desfeitos: number; fusoes: number; gestos: number; digitacoes: number };
const conta = (): Conta => (globalThis as Record<string, unknown>).__pocConta as Conta;
function conferirDepois(m: Modelo, r: Real): void {
  const s = r.store.getState();
  conta().passos += 1;
  conta().entradasMax = Math.max(conta().entradasMax, s.history.past.length);
  exigir(s.history.past.length === m.passado.length, `o histórico tem ${s.history.past.length} entradas e o modelo espera ${m.passado.length}`);
  exigir(s.history.future.length === m.futuro.length, `a pilha de refazer tem ${s.history.future.length} entradas e o modelo espera ${m.futuro.length}`);
  for (const c of r.mudancas) exigir(deepEqual(applyPatches(c.before, c.patches).document, c.after), 'um DocumentChange não leva before a after pelos próprios patches');
  r.mudancas = [];
  r.publicadas = [];
  r.ultimo = s;
}

// um passo que despacha um comando vindo de fora do campo que tem foco (o foco sai do campo antes)
function despachar(m: Modelo, r: Real, id: string, args: Record<string, unknown>): void {
  if (r.digitacao !== null) r.digitacao.campo.blur();
  const tinhaDigitacao = heldTyping() !== null;
  const janela = janelaDeFusao(id);
  const chave = janela === null ? null : chaveDeFusao(id, args, r.store.getState().selection);
  const resultado = (r.store.dispatch as (i: CommandId, a: unknown) => { status: string })(id as CommandId, args);
  if (resultado.status === 'confirm') r.store.answer(true);
  if (tinhaDigitacao) {
    exigir(heldTyping() === null, `a digitação pendente continuou pendente depois de ${id} vindo de fora do campo`);
    exigir(r.digitacao?.gravada === true, `a digitação pendente não foi gravada antes de ${id}`);
  }
  const fundiu = conferirPublicacoes(m, r, { chave, janela });
  m.ultimaChave = fundiu && chave !== null ? chave : null;
  if (fundiu) m.ultimoInstante = r.relogio.now();
  conferirDepois(m, r);
}

// ------------------------------------------------------------ os passos
type Passo = fc.Command<Modelo, Real>;
const PROPRIEDADES = ['width', 'height', 'opacity', 'margin-top', 'color', 'position', 'display'];
const VALORES = ['10px', '35px', '50%', 'auto', '0.5', 'red', 'absolute', 'flex', '', 'banana'];
const ENTRADAS = [...MODEL_RULES.palette.keys()].slice(0, 8);

class Selecionar implements Passo {
  constructor(readonly i: number) {}
  check = () => true;
  run(m: Modelo, r: Real) { const ns = nos(r.store.getState()); despachar(m, r, 'selection.select', { target: ns[this.i % ns.length] }); }
  toString = () => `Selecionar(${this.i})`;
}
class Adicionar implements Passo {
  constructor(readonly i: number) {}
  check = () => true;
  run(m: Modelo, r: Real) { const ns = nos(r.store.getState()); despachar(m, r, 'selection.add', { target: ns[this.i % ns.length] }); }
  toString = () => `Adicionar(${this.i})`;
}
// duas setas no mesmo campo com uma espera entre elas: a fusão depende da janela da constante
class Rajada implements Passo {
  constructor(readonly p: number, readonly ms: number) {}
  check = () => true;
  run(m: Modelo, r: Real) {
    const propriedade = PROPRIEDADES[this.p % 3];
    despachar(m, r, 'field.step', { direction: 'up', size: 'step', property: propriedade, value: '10px' });
    r.relogio.advance(this.ms);
    despachar(m, r, 'field.step', { direction: 'up', size: 'step', property: propriedade, value: '20px' });
  }
  toString = () => `Rajada(${PROPRIEDADES[this.p % 3]},${this.ms})`;
}
class Estilo implements Passo {
  constructor(readonly p: number, readonly v: number) {}
  check = () => true;
  run(m: Modelo, r: Real) { despachar(m, r, 'style.set', { property: PROPRIEDADES[this.p], value: VALORES[this.v] }); }
  toString = () => `Estilo(${PROPRIEDADES[this.p]}=${VALORES[this.v]})`;
}
class Passo1 implements Passo {
  constructor(readonly p: number, readonly v: number, readonly sobe: boolean) {}
  check = () => true;
  run(m: Modelo, r: Real) { despachar(m, r, 'field.step', { direction: this.sobe ? 'up' : 'down', size: 'step', property: PROPRIEDADES[this.p % 3], value: VALORES[this.v % 3] }); }
  toString = () => `PassoDeCampo(${PROPRIEDADES[this.p % 3]},${VALORES[this.v % 3]},${this.sobe ? 'up' : 'down'})`;
}
class Mover implements Passo {
  constructor(readonly dx: number, readonly dy: number) {}
  check = () => true;
  run(m: Modelo, r: Real) { despachar(m, r, 'position.move', { dx: this.dx, dy: this.dy }); }
  toString = () => `Mover(${this.dx},${this.dy})`;
}
class Inserir implements Passo {
  constructor(readonly e: number) {}
  check = () => ENTRADAS.length > 0;
  run(m: Modelo, r: Real) { despachar(m, r, 'element.insert', { entry: ENTRADAS[this.e % ENTRADAS.length] }); }
  toString = () => `Inserir(${ENTRADAS[this.e % ENTRADAS.length]})`;
}
class Simples implements Passo {
  constructor(readonly id: 'element.delete' | 'element.duplicate') {}
  check = () => true;
  run(m: Modelo, r: Real) { despachar(m, r, this.id, {}); }
  toString = () => this.id;
}
class Desfazer implements Passo {
  check = () => true;
  run(m: Modelo, r: Real) {
    if (r.digitacao !== null) r.digitacao.campo.blur();
    const antes = foto(r.store.getState());
    const tinhaDigitacao = heldTyping() !== null;
    r.store.dispatch('history.undo' as CommandId, {} as never);
    // a digitação gravada pelo próprio desfazer criou uma entrada: as publicações dizem qual
    const publicadas = r.publicadas;
    if (tinhaDigitacao) {
      exigir(heldTyping() === null, 'a digitação pendente continuou pendente depois do desfazer');
      const gravacao = publicadas.findIndex((p, k) => p.estado.history.past.length > (k === 0 ? r.ultimo : (publicadas[k - 1] as { estado: EditorState }).estado).history.past.length);
      if (gravacao >= 0) {
        const anterior = gravacao === 0 ? r.ultimo : (publicadas[gravacao - 1] as { estado: EditorState }).estado;
        m.passado.push({ antes: foto(anterior), depois: foto((publicadas[gravacao] as { estado: EditorState }).estado) });
        m.futuro = [];
      }
    }
    const entrada = m.passado.pop();
    const s = r.store.getState();
    if (entrada === undefined) {
      exigir(deepEqual(s.document, antes.document) && deepEqual(s.selection, antes.selection), 'desfazer sem entrada mudou o estado');
    } else {
      exigir(deepEqual(s.document, entrada.antes.document), 'desfazer não voltou ao documento de antes da entrada');
      exigir(deepEqual(s.selection, entrada.antes.selection), 'desfazer não voltou à seleção de antes da entrada');
      m.futuro.push(entrada);
      conta().desfeitos += 1;
    }
    m.ultimaChave = null;
    conferirDepois(m, r);
  }
  toString = () => 'Desfazer';
}
class Refazer implements Passo {
  check = () => true;
  run(m: Modelo, r: Real) {
    if (r.digitacao !== null) r.digitacao.campo.blur();
    const tinhaDigitacao = heldTyping() !== null;
    const antes = foto(r.store.getState());
    r.store.dispatch('history.redo' as CommandId, {} as never);
    if (tinhaDigitacao) {
      exigir(heldTyping() === null, 'a digitação pendente continuou pendente depois do refazer');
      // uma digitação gravada antes do refazer cria uma entrada e esvazia a pilha de refazer
      const s = r.store.getState();
      if (s.history.past.length > r.ultimo.history.past.length && s.history.future.length === 0 && deepEqual(s.document, r.publicadas.at(-1)?.estado.document)) {
        conferirPublicacoes(m, r, { chave: null, janela: null });
        m.ultimaChave = null;
        conferirDepois(m, r);
        return;
      }
    }
    const entrada = m.futuro.pop();
    const s = r.store.getState();
    if (entrada === undefined) {
      exigir(deepEqual(s.document, antes.document) && deepEqual(s.selection, antes.selection), 'refazer sem entrada mudou o estado');
    } else {
      exigir(deepEqual(s.document, entrada.depois.document), 'refazer não voltou ao documento de depois da entrada');
      exigir(deepEqual(s.selection, entrada.depois.selection), 'refazer não voltou à seleção de depois da entrada');
      m.passado.push(entrada);
    }
    m.ultimaChave = null;
    conferirDepois(m, r);
  }
  toString = () => 'Refazer';
}
class Esperar implements Passo {
  constructor(readonly ms: number) {}
  check = () => true;
  run(_m: Modelo, r: Real) { r.relogio.advance(this.ms); }
  toString = () => `Esperar(${this.ms})`;
}
// um campo recebe digitação que nenhum comando gravou ainda (o registro único de rascunhos)
class Digitar implements Passo {
  constructor(readonly v: number) {}
  check = () => true;
  run(m: Modelo, r: Real) {
    const regiao = document.createElement('div');
    const campo = document.createElement('input');
    regiao.append(campo);
    document.body.append(regiao);
    const contexto = editContextOf(r.store.getState());
    const valor = VALORES[this.v % 4] as string;
    const anterior = r.digitacao;
    const pendia = heldTyping() !== null;
    const registro = { campo, gravada: false };
    holdTyping({
      field: campo,
      region: regiao,
      context: contexto,
      owns: () => false,
      keep: () => {
        registro.gravada = true;
        r.store.dispatch('style.set' as CommandId, { property: 'opacity', value: valor } as never, contexto);
      },
    });
    if (anterior !== null && anterior.gravada === false && anterior !== registro) exigir(heldTyping()?.field === campo, 'o registro não guardou a digitação nova');
    if (anterior !== null && !anterior.gravada && anterior.campo !== campo) exigir(anterior.gravada, 'um campo novo descartou a digitação pendente do anterior');
    r.digitacao = registro;
    conta().digitacoes += 1;
    campo.focus();
    conferirPublicacoes(m, r, { chave: null, janela: null });
    // gravar a digitação anterior é um comando: interrompe a fusão
    if (pendia) m.ultimaChave = null;
    conferirDepois(m, r);
  }
  toString = () => `Digitar(${VALORES[this.v % 4]})`;
}
// um gesto de ponteiro com alguns style.set; `fora`: um comando que muda o documento chega de fora durante o gesto
class Gesto implements Passo {
  constructor(readonly n: number, readonly confirma: boolean, readonly fora: boolean, readonly sel: number | null = null) {}
  check = () => true;
  run(m: Modelo, r: Real) {
    if (r.digitacao !== null) r.digitacao.campo.blur();
    const pendia = heldTyping() !== null;
    const g: Gesture = r.store.gesture();
    conta().gestos += 1;
    // abrir o gesto grava a digitação pendente: conta como passo normal
    conferirPublicacoes(m, r, { chave: null, janela: null });
    const antesDoGesto = foto(r.store.getState());
    const ultimoAntes = r.store.getState();
    r.publicadas = [];
    r.ultimo = ultimoAntes;
    r.fase = 'gesto';
    // o comando de fora roda depois do gesto quando roda agora (a seleção não muda dentro do gesto)
    let duplicaRoda = this.fora && r.store.canRun('element.duplicate' as CommandId, {} as never);
    if (this.sel !== null) { const ns = nos(r.store.getState()); g.dispatch('selection.select' as CommandId, { target: ns[this.sel % ns.length] } as never); }
    for (let k = 0; k < this.n; k++) g.dispatch('style.set' as CommandId, { property: 'width', value: `${10 + k * 7}px` } as never);
    const docAntesDeFora = r.store.getState().document;
    if (this.fora) r.store.dispatch('element.duplicate' as CommandId, {} as never);
    exigir(this.fora === false || deepEqual(r.store.getState().document, docAntesDeFora), 'um comando que muda o documento rodou no meio do gesto');
    // confirmado, o comando de fora roda sobre a seleção que o gesto deixou
    if (this.confirma) duplicaRoda = this.fora && r.store.canRun('element.duplicate' as CommandId, {} as never);
    const entradaDoGesto = this.confirma && !deepEqual(r.store.getState().document, antesDoGesto.document) ? 1 : 0;
    r.fase = 'fim-de-gesto';
    if (this.confirma) g.commit(); else g.cancel();
    r.fase = 'normal';
    conferirPublicacoes(m, r, { chave: null, janela: null, antesDoGesto });
    const esperado = ultimoAntes.history.past.length + entradaDoGesto + (duplicaRoda ? 1 : 0);
    exigir(r.store.getState().history.past.length === esperado, `depois do gesto o histórico tem ${r.store.getState().history.past.length} entradas e devia ter ${esperado}`);
    // só um comando que rodou interrompe a fusão: um gesto sem comando nenhum (um toque que não fez nada) não interrompe
    if (pendia || this.n > 0 || this.fora || this.sel !== null) m.ultimaChave = null;
    conferirDepois(m, r);
  }
  toString = () => `Gesto(${this.n},${this.confirma ? 'commit' : 'cancel'}${this.fora ? ',com comando de fora' : ''}${this.sel === null ? '' : `,seleciona ${this.sel}`})`;
}

const PASSOS = [
  fc.nat(40).map((i) => new Selecionar(i)),
  fc.tuple(fc.nat(PROPRIEDADES.length - 1), fc.nat(VALORES.length - 1)).map(([p, v]) => new Estilo(p, v)),
  fc.tuple(fc.nat(5), fc.nat(5), fc.boolean()).map(([p, v, s]) => new Passo1(p, v, s)),
  fc.tuple(fc.integer({ min: -3, max: 3 }), fc.integer({ min: -3, max: 3 })).map(([x, y]) => new Mover(x, y)),
  fc.nat(20).map((e) => new Inserir(e)),
  fc.constantFrom('element.delete' as const, 'element.duplicate' as const).map((id) => new Simples(id)),
  fc.constant(null).map(() => new Desfazer()),
  fc.constant(null).map(() => new Desfazer()),
  fc.constant(null).map(() => new Refazer()),
  fc.constantFrom(0, 300, 999, 1001, 5000).map((ms) => new Esperar(ms)),
  fc.nat(9).map((v) => new Digitar(v)),
  fc.tuple(fc.integer({ min: 0, max: 3 }), fc.boolean(), fc.boolean(), fc.option(fc.nat(40))).map(([n, c, f, sel]) => new Gesto(n, c, f, sel)),
  fc.nat(40).map((i) => new Adicionar(i)),
  fc.tuple(fc.nat(5), fc.constantFrom(0, 500, 1000, 1001, 3000)).map(([p, ms]) => new Rajada(p, ms)),
];

function criarReal(nome: string): Real {
  const relogio = manualClock(1_000_000);
  const store = createEditorStore({ storage: memoria(), workspace: memoria(), clock: relogio, ids: sequentialIds('p'), restored: { document: fixture(nome), selection: [] }, ports: { readOnly: () => false, downloads: { deliver: () => undefined }, clipboard: { write: () => undefined } as never }, freeze: true });
  const real: Real = { store, relogio, publicadas: [], mudancas: [], fase: 'normal', digitacao: null, ultimo: store.getState() };
  store.subscribe(() => real.publicadas.push({ estado: store.getState(), fase: real.fase }));
  store.subscribeDocument((c) => real.mudancas.push(c));
  return real;
}

it('o histórico segue o modelo do manifesto em sequências aleatórias', () => {
  const inicio = Date.now();
  const mutante = process.env.POC_MUTANTE ?? '';
  let falha: string | null = null;
  let execucoes = 0;
  const conta = { passos: 0, entradasMax: 0, desfeitos: 0, fusoes: 0, gestos: 0, digitacoes: 0 };
  (globalThis as Record<string, unknown>).__pocConta = conta;
  try {
    fc.assert(
      fc.property(fc.constantFrom(...FIXTURES), fc.commands(PASSOS, { maxCommands: 60, size: 'large' }), (nome, passos) => {
        execucoes += 1;
        // nenhuma digitação de uma execução anterior fica pendente
        keepTyping();
        document.body.innerHTML = '';
        const real = criarReal(nome);
        const inicial = foto(real.store.getState());
        const modelo: Modelo = { passado: [], futuro: [], ultimaChave: null, ultimoInstante: 0 };
        fc.modelRun(() => ({ model: modelo, real }), passos);
        // desfazer tudo volta ao início; refazer tudo volta ao fim
        if (real.digitacao !== null) real.digitacao.campo.blur();
        if (heldTyping() !== null) new Desfazer().run(modelo, real);
        const fim = foto(real.store.getState());
        const n = real.store.getState().history.past.length;
        for (let k = 0; k < n; k++) real.store.dispatch('history.undo' as CommandId, {} as never);
        exigir(deepEqual(real.store.getState().document, inicial.document), 'desfazer tudo não voltou ao documento inicial');
        for (let k = 0; k < n; k++) real.store.dispatch('history.redo' as CommandId, {} as never);
        exigir(deepEqual(real.store.getState().document, fim.document), 'refazer tudo não voltou ao documento final');
      }),
      { seed: 20261008, numRuns: Number(process.env.POC_EXECUCOES ?? 150) },
    );
  } catch (erro) {
    const causa = erro instanceof Error && erro.cause instanceof Error ? `
Causa: ${erro.cause.message}` : '';
    falha = String(erro instanceof Error ? erro.message : erro) + causa;
  }
  fs.mkdirSync(SAIDA, { recursive: true });
  const aplicado = (globalThis as Record<string, unknown>).__pocMutanteAplicado ?? null;
  const resumo = { mutante: mutante || 'nenhum', aplicado, acusou: falha !== null, execucoes, conta, ms: Date.now() - inicio, falha: falha?.slice(0, 4000) ?? null };
  fs.writeFileSync(`${SAIDA}/${mutante || 'original'}.txt`, JSON.stringify(resumo, null, 2));
  if (falha !== null) throw new Error(falha);
});
