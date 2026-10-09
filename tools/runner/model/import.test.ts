// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// What an imported page may carry (the investigation's C8: "HTML importado e XSS", without a browser): the one
// sanitiser of a captured page's attributes (src/core/document/captured.ts), the one of a pasted SVG's markup
// (src/core/elements/svg.ts) and the reader that refuses a saved capture whose attributes are unsafe, against a corpus
// of the vectors JavaScript runs by: an event attribute, an address that runs code (javascript:, hidden by case,
// whitespace or a character reference), a srcdoc, a script, a foreign object, an animation that writes a link. A save
// whose keys are __proto__ or constructor is read without a write to the prototype.
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { capturedProblems, unsafeCapturedAttribute, unsafeCapturedElement, type CapturedAttribute, type CapturedElement } from '../../../src/core/document/captured.ts';
import { sanitizedSvgMarkup } from '../../../src/core/elements/svg.ts';
import { capturedHtml } from '../../../src/core/render/captured.ts';
import { readProject } from '../../../src/core/project/archive.ts';
import { exportPage, previewPage } from '../../../src/core/export/export.ts';
import { validateDocument } from '../../../src/core/document/validate.ts';
import { importHtmlCommand } from '../../../src/core/import/import.ts';
import { documentOf, runHandler } from '../../../src/core/testing/handlers.ts';
import type { PickedFile } from '../../../src/generated/commands.ts';
import { MODEL_RULES } from '../../../src/editor/store.ts';

const HTML = 'http://www.w3.org/1999/xhtml';
const at = (name: string, value: string): CapturedAttribute => ({ name, namespace: null, value });

// the attributes that run code, whatever their case or the whitespace, and the character references a browser decodes
// before an address runs
const DANGEROUS: readonly CapturedAttribute[] = [
  at('onclick', 'alert(1)'),
  at('ONCLICK', 'alert(1)'),
  at('onerror', 'alert(1)'),
  at('onload', 'x'),
  at('onanimationstart', 'x'),
  at('srcdoc', '<script>alert(1)</script>'),
  at('SRCDOC', 'x'),
  at('href', 'javascript:alert(1)'),
  at('href', 'JaVaScRiPt:alert(1)'),
  at('href', '  javascript:alert(1)'),
  at('href', 'java\tscript:alert(1)'),
  at('href', 'java\nscript:alert(1)'),
  at('xlink:href', 'javascript:alert(1)'),
  at('src', 'javascript:alert(1)'),
  at('action', 'javascript:alert(1)'),
  at('formaction', 'javascript:alert(1)'),
  at('poster', 'javascript:alert(1)'),
  at('data-capture-paint', 'javascript:alert(1)'),
  at('srcset', 'javascript:alert(1) 1x'),
  at('srcset', 'https://ok.invalid/a.png 1x, javascript:alert(1) 2x'),
  at('href', 'data:text/html,<script>alert(1)</script>'),
  at('src', 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='),
  at('href', 'vbscript:msgbox(1)'),
  // the values an animation writes into a link at run time (<animate>/<set>, DEF-0525): one item of the list is enough
  at('values', 'javascript:alert(1)'),
  at('values', '#a;javascript:alert(1)'),
  at('to', 'javascript:alert(1)'),
  at('from', '  JavaScript:alert(1)'),
  at('by', 'vbscript:msgbox(1)'),
];
// the attributes a page may keep, with the tag they stand on: an ordinary address, an inline image on an image, an
// anchor inside the page, and an attribute whose text merely looks like a scheme
const ALLOWED: readonly { readonly tag: string; readonly attribute: CapturedAttribute }[] = [
  { tag: 'a', attribute: at('href', 'https://example.invalid/page') },
  { tag: 'a', attribute: at('href', '#section') },
  { tag: 'a', attribute: at('href', 'mailto:someone@example.invalid') },
  { tag: 'a', attribute: at('href', 'tel:+5511999999999') },
  { tag: 'img', attribute: at('src', './img/a.png') },
  { tag: 'img', attribute: at('src', 'data:image/png;base64,iVBORw0KGgo=') },
  { tag: 'img', attribute: at('srcset', './a.png 1x, ./b.png 2x') },
  { tag: 'div', attribute: at('alt', 'javascript:alert(1)') },
  { tag: 'div', attribute: at('title', 'onclick=alert(1)') },
  { tag: 'div', attribute: at('value', 'alert(1)') },
  { tag: 'div', attribute: at('data-note', 'javascript:') },
  // an animation's ordinary values: numbers, colours, anchors
  { tag: 'animate', attribute: at('values', '0;10;0') },
  { tag: 'animate', attribute: at('values', '#a;#b') },
  { tag: 'set', attribute: at('to', 'red') },
];

describe('o que uma página importada pode carregar', () => {
  it('recusa todo atributo que executa, e guarda os que não executam', () => {
    const missed = DANGEROUS.filter((one) => !unsafeCapturedAttribute('div', one)).map((one) => `${one.name}="${one.value}"`);
    const refused = ALLOWED.filter((one) => unsafeCapturedAttribute(one.tag, one.attribute)).map((one) => `${one.tag} ${one.attribute.name}="${one.attribute.value}"`);
    expect(missed, 'atributos que executam e passariam pela captura').toEqual([]);
    expect(refused, 'atributos seguros que a captura recusaria').toEqual([]);
    // an inline image is an address only on an image: the same value on a div is not one a page may load
    expect(unsafeCapturedAttribute('div', at('src', 'data:image/png;base64,iVBORw0KGgo=')), 'data: fora de uma imagem').toBe(true);
  });

  it('deixa a referência de caractere para quem a decodifica: a captura não a lê como esquema, o SVG sim', () => {
    // A captured attribute's value is written through the DOM (captured.ts, setAttribute) and the export escapes its
    // &, so "java&#115;cript:" never decodes into a scheme there; a pasted SVG's markup is parsed as markup, where the
    // HTML parser decodes it before the address runs, so that filter has to decode it (svg.ts, decoded).
    expect(unsafeCapturedAttribute('a', at('href', 'java&#115;cript:alert(1)')), 'a captura não decodifica').toBe(false);
    expect(unsafeCapturedAttribute('a', at('href', 'javascript&colon;alert(1)')), 'a captura não decodifica').toBe(false);
    const read = sanitizedSvgMarkup('<a href="java&#115;cript:alert(1)"><rect/></a>');
    expect('markup' in read && /javascript/i.test(read.markup), 'o sanitizador do SVG decodifica e tira').toBe(false);
  });

  it('deixa de fora o script, o base e o meta de atualização, que agem na própria página', () => {
    for (const tag of ['script', 'SCRIPT', 'base', 'BASE'])
      expect(unsafeCapturedElement(tag, []), tag).toBe(true);
    expect(unsafeCapturedElement('meta', [at('http-equiv', 'refresh')])).toBe(true);
    expect(unsafeCapturedElement('meta', [at('name', 'viewport')])).toBe(false);
    expect(unsafeCapturedElement('div', []), 'um elemento comum fica').toBe(false);
  });

  it('um pacote de captura com atributo que executa é acusado com o seu caminho', () => {
    const page = { widths: [1280], root: { kind: 'element', id: 'r', namespace: HTML, tag: 'html', attributes: [], children: [{ kind: 'element', id: 'c', namespace: HTML, tag: 'img', attributes: [at('onerror', 'alert(1)')], children: [] }] } };
    const problems = capturedProblems(page);
    expect(problems.map((one) => `${one.path} ${one.message}`)).toContain('/root/children/0/attributes/0 unsafe executable attribute or URL');
    // and a page whose attributes are safe is accepted
    const safe = { widths: [1280], root: { kind: 'element', id: 'r', namespace: HTML, tag: 'html', attributes: [], children: [{ kind: 'element', id: 'c', namespace: HTML, tag: 'img', attributes: [at('src', './a.png')], children: [] }] } };
    expect(capturedProblems(safe)).toEqual([]);
  });

  it('um pacote de captura com chaves __proto__ não escreve no protótipo', () => {
    const before = Object.getOwnPropertyNames(Object.prototype).sort().join(',');
    const json = '{"widths":[1280],"root":{"kind":"element","id":"r","namespace":"' + HTML + '","__proto__":{"polluted":"yes"},"attributes":[{"name":"onclick","namespace":null,"value":"alert(1)"}],"children":[],"constructor":{"prototype":{"polluted":"yes"}}}}';
    const page = JSON.parse(json) as unknown;
    const problems = capturedProblems(page);
    expect(problems.length, 'o pacote é acusado pelo atributo, e lido sem lançar').toBeGreaterThan(0);
    expect((({}) as Record<string, unknown>).polluted, 'Object.prototype não foi poluído').toBeUndefined();
    expect(Object.getOwnPropertyNames(Object.prototype).sort().join(',')).toBe(before);
  });

  it('o sanitizador do SVG tira o script, o objeto estrangeiro, o evento e o endereço que executa', () => {
    const vectors: readonly string[] = [
      '<script>alert(1)</script>',
      '<g onclick="alert(1)"><rect/></g>',
      '<a href="javascript:alert(1)"><rect/></a>',
      '<a xlink:href="javascript:alert(1)"><rect/></a>',
      '<foreignObject><iframe src="javascript:alert(1)"/></foreignObject>',
      '<animate attributeName="href" to="javascript:alert(1)"/>',
      '<animate attributeName="href" values="javascript:alert(1)"/>',
      '<set attributeName="href" to="javascript:alert(1)"/>',
      // the ";" of the list spelled as a numeric character reference with no ";" of its own, which the HTML parser
      // still decodes before the animation runs
      '<animate attributeName="href" values="0&#59javascript:alert(1)"/>',
      '<animate attributeName="href" values="0&#x3bjavascript:alert(1)"/>',
      '<image href="javascript:alert(1)"/>',
      '<rect onclick="alert(1)"/>',
    ];
    const through: string[] = [];
    for (const vector of vectors) {
      const read = sanitizedSvgMarkup(vector);
      if ('refusal' in read) continue; // refused whole: nothing of it is kept
      const out = read.markup;
      if (/<script/i.test(out)) through.push(`${vector} manteve um <script>`);
      if (/<foreignObject/i.test(out)) through.push(`${vector} manteve um foreignObject`);
      if (/\son[a-z]+\s*=/i.test(out)) through.push(`${vector} manteve um atributo de evento`);
      if (/javascript\s*:/i.test(out)) through.push(`${vector} manteve um endereço que executa`);
    }
    expect(through, 'vetores que atravessaram o sanitizador do SVG').toEqual([]);
  });

  // What the HTML of a captured page is read back as (DEF-0524): every element that carries an event attribute, and
  // every <img>, the vectors below would make if a text closed the element it stands in.
  const executing = (html: string): string[] => {
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    return [...parsed.querySelectorAll('*')].flatMap((element) => [...element.attributes].filter((one) => one.name.toLowerCase().startsWith('on')).map((one) => `<${element.localName} ${one.name}="${one.value}">`));
  };
  const text = (id: string, value: string) => ({ kind: 'text' as const, id, value });
  const element = (id: string, tag: string, children: CapturedElement['children'], namespace = HTML): CapturedElement => ({ kind: 'element', id, namespace, tag, attributes: [], children });

  it('o HTML escrito de uma página capturada não deixa o texto de um style ou de um comentário fechar o elemento', () => {
    const SVG = 'http://www.w3.org/2000/svg';
    const root = element('r', 'html', [
      element('h', 'head', []),
      element('b', 'body', [
        element('s1', 'style', [text('t1', 'p{color:red}</style><img src=x onerror=alert(1)><style>')]),
        element('s2', 'style', [text('t2', 'p{}</STYLE ><img src=x onerror=alert(2)>')]),
        { kind: 'comment', id: 'c1', value: '--!><img src=x onerror=alert(3)>' },
        { kind: 'comment', id: 'c2', value: '><img src=x onerror=alert(4)>' },
        { kind: 'comment', id: 'c3', value: '-><img src=x onerror=alert(5)>' },
        { kind: 'comment', id: 'c4', value: 'a<!-' },
        element('v', 'svg', [element('s3', 'style', [text('t3', '<img src=x onerror=alert(6)>')], SVG)], SVG),
      ]),
    ]);
    const html = capturedHtml(root);
    expect(executing(html), 'atributos que executam no HTML escrito, relido pelo parser').toEqual([]);
    // and the style sheets keep their text: the same rules, and the vector stays text inside the sheet
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    expect(parsed.querySelectorAll('img').length, 'nenhum <img> saiu do texto').toBe(0);
    expect(parsed.querySelector('body > style')?.textContent, 'o texto da folha continua o mesmo para o CSS').toContain('p{color:red}<\\/style><img src=x onerror=alert(1)>');
  });

  it('um projeto salvo com um style que fecha o elemento é lido, e a pré-visualização não executa nada', () => {
    const project = JSON.parse(fs.readFileSync('manifest/features/fixtures/captured-mixed.json', 'utf8')) as { pages: { capture?: { root: CapturedElement } }[] };
    const index = project.pages.findIndex((page) => page.capture !== undefined);
    const body = project.pages[index]?.capture?.root.children.find((one): one is CapturedElement => one.kind === 'element' && one.tag === 'body');
    expect(body, 'a fixture tem uma página capturada com corpo').toBeDefined();
    // the parsed JSON is the project's own plain data: its children list is written in place, as a file would hold it
    (body?.children as CapturedElement['children'][number][] | undefined)?.push(element('xss-style', 'style', [text('xss-text', 'p{}</style><img src=x onerror=alert(1)><style>')]));
    const read = readProject(project, MODEL_RULES);
    expect('document' in read, 'o projeto é lido (o texto de uma folha não é atributo)').toBe(true);
    if (!('document' in read)) return;
    expect(executing(previewPage(read.document, MODEL_RULES, index)), 'atributos que executam na pré-visualização').toEqual([]);
  });

  it('o sanitizador do SVG guarda o markup que não executa nada', () => {
    const read = sanitizedSvgMarkup('<g><rect x="0" y="0" width="10" height="10" fill="#f00"/><title>oi</title></g>');
    expect('markup' in read).toBe(true);
    if ('markup' in read) {
      expect(read.markup).toContain('<rect');
      expect(read.markup).toContain('fill="#f00"');
    }
  });
});

// A boolean attribute is true or absent (src/core/elements/attributes.ts), whatever road it took: a saved document
// with its text ("true") is refused, so no reader has to guess (DEF-0550: the quick panel's switch read it as on and
// the inspector's as off); an imported page keeps a boolean of HTML by its presence and a word state (aria-hidden) by
// its word, as Chrome reads it; and the output writes a word state by its word, since aria-hidden="" hides nothing
// (DEF-0551, src/core/elements/word-states.ts).
describe('os atributos booleanos', () => {
  const opened = (value: unknown) => {
    const project = JSON.parse(fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8')) as { pages: { tree: { children: { attributes: Record<string, unknown> }[] } }[] };
    const first = project.pages[0]?.tree.children[0];
    if (first === undefined) throw new Error('a fixture aurora tem um elemento na primeira página');
    first.attributes.ariaHidden = value;
    return readProject(project, MODEL_RULES);
  };

  it('um documento salvo com o texto de um booleano é recusado, e com o booleano é lido', () => {
    expect('document' in opened(true), 'o booleano verdadeiro').toBe(true);
    for (const text of ['true', 'false', '']) expect('refused' in opened(text), `o texto "${text}"`).toBe(true);
  });

  it('a importação lê um booleano do HTML pela presença e um estado ARIA pela palavra, e a exportação o escreve pela palavra', () => {
    const html = '<!doctype html><html><body aria-hidden="true"><p id="a" aria-hidden="false">a</p><p id="b" aria-hidden="">b</p><p id="c" aria-hidden="TRUE">c</p><p id="d" aria-hidden="undefined">d</p><p id="e" aria-hidden="yes">e</p><input id="f" disabled="false"></body></html>';
    const file: PickedFile = { name: 'index.html', type: 'text/html', bytes: btoa(html) };
    const ran = runHandler(importHtmlCommand, documentOf({ pages: [] }), { files: [file] }, { confirmed: true });
    if (ran.outcome.kind !== 'change') throw new Error(JSON.stringify(ran.outcome));
    const tree = ran.document.pages[0]?.tree;
    if (tree === undefined) throw new Error('a importação fez uma página');
    expect(validateDocument(ran.document, [], MODEL_RULES), 'o documento importado é válido').toEqual([]);
    const byId = (id: string) => tree.children.find((one) => one.attributes.id === id)?.attributes;
    const kept = { body: tree.attributes.ariaHidden, a: byId('a')?.ariaHidden, b: byId('b')?.ariaHidden, c: byId('c')?.ariaHidden, d: byId('d')?.ariaHidden, e: byId('e')?.ariaHidden, f: byId('f')?.disabled };
    expect(kept, 'o que a importação guardou').toEqual({ body: true, a: undefined, b: undefined, c: true, d: undefined, e: true, f: true });
    const exported = exportPage(ran.document, 0, MODEL_RULES).html;
    expect(exported.match(/aria-hidden(="[^"]*")?/g), 'o aria-hidden escrito na exportação').toEqual(['aria-hidden="true"', 'aria-hidden="true"', 'aria-hidden="true"']);
  });
});
