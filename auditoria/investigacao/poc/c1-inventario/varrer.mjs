// Prova de conceito C1: inventário estático dos elementos interativos da interface, com a API do compilador do
// TypeScript instalado (6.0.3), e o confronto com o manifesto: cada elemento interativo desenhado em JSX é uma porta
// do manifesto (data-door), um controle local declarado (data-local, manifest/layout.json), parte de uma porta (está
// dentro de um elemento com data-door), recebe atributos espalhados (o que eles trazem só a execução diz) ou não tem
// marca nenhuma — o candidato a "controle que existe na interface e não está no manifesto".
// Uso: node auditoria/investigacao/poc/c1-inventario/varrer.mjs
import console from 'node:console';
import { performance } from 'node:perf_hooks';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const SAIDA = 'auditoria/investigacao/poc/c1-inventario/resultados.txt';
const TAGS = new Set(['button', 'input', 'select', 'textarea', 'a', 'summary', 'option']);
const PAPEIS = new Set(['button', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'tab', 'option', 'slider', 'spinbutton', 'checkbox', 'switch', 'treeitem', 'combobox', 'radio', 'link', 'gridcell', 'separator']);
const EVENTOS = /^on(Click|DoubleClick|PointerDown|PointerUp|MouseDown|KeyDown|KeyUp|Change|Input|Wheel|ContextMenu|Submit|DragStart|Drop|Focus|Blur)$/;

const t0 = performance.now();
const arquivos = [];
const andar = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.posix.join(d, e.name);
    if (e.isDirectory()) andar(p);
    else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) arquivos.push(p);
  }
};
andar('src');

const itens = [];
const imperativos = [];
for (const arquivo of arquivos) {
  const texto = fs.readFileSync(arquivo, 'utf8');
  const fonte = ts.createSourceFile(arquivo, texto, ts.ScriptTarget.Latest, true, arquivo.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const linha = (no) => fonte.getLineAndCharacterOfPosition(no.getStart(fonte)).line + 1;
  // um descendente que é porta: um elemento com data-door ou um componente cujo nome diz Door (DoorControl, DoorButton)
  const envolvePorta = (no) => {
    let achou = false;
    const ver = (n) => {
      if (achou) return;
      if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
        const t = n.tagName.getText(fonte);
        if (/Door/.test(t) || n.attributes.properties.some((a) => ts.isJsxAttribute(a) && a.name.getText(fonte) === 'data-door')) achou = true;
      }
      ts.forEachChild(n, ver);
    };
    ts.forEachChild(no, ver);
    return achou;
  };
  const visitar = (no, dentroDePorta) => {
    let porta = dentroDePorta;
    if (ts.isJsxElement(no) || ts.isJsxSelfClosingElement(no)) {
      const abertura = ts.isJsxElement(no) ? no.openingElement : no;
      const tag = abertura.tagName.getText(fonte);
      const atributos = abertura.attributes.properties;
      const nomes = atributos.filter(ts.isJsxAttribute).map((a) => a.name.getText(fonte));
      const espalhado = atributos.some(ts.isJsxSpreadAttribute);
      const papel = atributos.filter(ts.isJsxAttribute).find((a) => a.name.getText(fonte) === 'role');
      const valorPapel = papel?.initializer && ts.isStringLiteral(papel.initializer) ? papel.initializer.text : null;
      const intrinseco = /^[a-z]/.test(tag);
      const eventos = nomes.filter((n) => EVENTOS.test(n));
      const interativo = intrinseco && (TAGS.has(tag) || eventos.length > 0 || (valorPapel !== null && PAPEIS.has(valorPapel)) || nomes.includes('tabIndex') || nomes.includes('contentEditable'));
      const temPorta = nomes.includes('data-door');
      if (interativo) {
        const classe = temPorta ? 'porta' : nomes.includes('data-local') ? 'local' : dentroDePorta ? 'dentro de porta' : espalhado ? 'atributos espalhados' : ts.isJsxElement(no) && envolvePorta(no) ? 'envolve porta' : 'sem marca';
        itens.push({ arquivo, linha: linha(abertura), tag, papel: valorPapel, eventos, classe });
      } else if (!intrinseco && eventos.length > 0) {
        itens.push({ arquivo, linha: linha(abertura), tag, papel: null, eventos, classe: 'componente com tratador' });
      }
      if (temPorta) porta = true;
    }
    if (ts.isCallExpression(no)) {
      const chamada = no.expression.getText(fonte);
      if (/\.createElement$/.test(chamada) && no.arguments[0] && ts.isStringLiteral(no.arguments[0]) && TAGS.has(no.arguments[0].text)) imperativos.push({ arquivo, linha: linha(no), o: `createElement('${no.arguments[0].text}')` });
      if (/\.addEventListener$/.test(chamada)) imperativos.push({ arquivo, linha: linha(no), o: 'addEventListener' });
    }
    ts.forEachChild(no, (filho) => visitar(filho, porta));
  };
  visitar(fonte, false);
}
const ms = performance.now() - t0;

const conta = (lista, chave) => Object.entries(lista.reduce((a, x) => ({ ...a, [x[chave]]: (a[x[chave]] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);
const semMarca = itens.filter((i) => i.classe === 'sem marca');
const linhas = [
  `arquivos lidos: ${arquivos.length}; tempo: ${ms.toFixed(0)} ms (TypeScript ${ts.version})`,
  `elementos JSX interativos e componentes com tratador: ${itens.length}`,
  ...conta(itens, 'classe').map(([c, n]) => `  ${c}: ${n}`),
  `chamadas imperativas: ${imperativos.length}`,
  ...conta(imperativos, 'o').map(([c, n]) => `  ${c}: ${n}`),
  '',
  'sem marca, por arquivo:',
  ...conta(semMarca, 'arquivo').map(([c, n]) => `  ${c}: ${n}`),
  '',
  'sem marca, um por linha (arquivo, linha, tag, papel, tratadores):',
  ...semMarca.map((i) => `  ${i.arquivo} linha ${i.linha} <${i.tag}> ${i.papel ?? '-'} ${i.eventos.join(',') || '-'}`),
];
fs.writeFileSync(SAIDA, `${linhas.join('\n')}\n`);
console.log(linhas.slice(0, 40).join('\n'));
