// What an imported page may carry (the investigation's C8: "HTML importado e XSS", without a browser): the one
// sanitiser of a captured page's attributes (src/core/document/captured.ts), the one of a pasted SVG's markup
// (src/core/elements/svg.ts) and the reader that refuses a saved capture whose attributes are unsafe, against a corpus
// of the vectors JavaScript runs by: an event attribute, an address that runs code (javascript:, hidden by case,
// whitespace or a character reference), a srcdoc, a script, a foreign object, an animation that writes a link. A save
// whose keys are __proto__ or constructor is read without a write to the prototype.
import { describe, expect, it } from 'vitest';
import { capturedProblems, unsafeCapturedAttribute, unsafeCapturedElement, type CapturedAttribute } from '../../../src/core/document/captured.ts';
import { sanitizedSvgMarkup } from '../../../src/core/elements/svg.ts';

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

  it('o sanitizador do SVG guarda o markup que não executa nada', () => {
    const read = sanitizedSvgMarkup('<g><rect x="0" y="0" width="10" height="10" fill="#f00"/><title>oi</title></g>');
    expect('markup' in read).toBe(true);
    if ('markup' in read) {
      expect(read.markup).toContain('<rect');
      expect(read.markup).toContain('fill="#f00"');
    }
  });
});
