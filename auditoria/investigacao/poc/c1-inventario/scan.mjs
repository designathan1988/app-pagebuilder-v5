// Proof of concept C1: static inventory of the interface's interactive elements, using the compiler API of the
// installed TypeScript (6.0.3), checked against the manifest: each interactive element drawn in JSX is a manifest door
// (data-door), a declared local control (data-local, manifest/layout.json), part of a door (it sits inside an element
// with data-door), receives spread attributes (only runtime tells what they carry) or has no mark at all — the
// candidate for "a control that exists in the interface and is not in the manifest".
// Usage: node auditoria/investigacao/poc/c1-inventario/scan.mjs
import console from 'node:console';
import { performance } from 'node:perf_hooks';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const OUTPUT = 'auditoria/investigacao/poc/c1-inventario/resultados.txt';
const TAGS = new Set(['button', 'input', 'select', 'textarea', 'a', 'summary', 'option']);
const ROLES = new Set(['button', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'tab', 'option', 'slider', 'spinbutton', 'checkbox', 'switch', 'treeitem', 'combobox', 'radio', 'link', 'gridcell', 'separator']);
const EVENTS = /^on(Click|DoubleClick|PointerDown|PointerUp|MouseDown|KeyDown|KeyUp|Change|Input|Wheel|ContextMenu|Submit|DragStart|Drop|Focus|Blur)$/;

const t0 = performance.now();
const files = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.posix.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) files.push(p);
  }
};
walk('src');

const items = [];
const imperative = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const line = (node) => source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
  // a descendant that is a door: an element with data-door or a component whose name says Door (DoorControl, DoorButton)
  const wrapsDoor = (node) => {
    let found = false;
    const look = (n) => {
      if (found) return;
      if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
        const t = n.tagName.getText(source);
        if (/Door/.test(t) || n.attributes.properties.some((a) => ts.isJsxAttribute(a) && a.name.getText(source) === 'data-door')) found = true;
      }
      ts.forEachChild(n, look);
    };
    ts.forEachChild(node, look);
    return found;
  };
  const visit = (node, insideDoor) => {
    let door = insideDoor;
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node;
      const tag = opening.tagName.getText(source);
      const attributes = opening.attributes.properties;
      const names = attributes.filter(ts.isJsxAttribute).map((a) => a.name.getText(source));
      const spread = attributes.some(ts.isJsxSpreadAttribute);
      const role = attributes.filter(ts.isJsxAttribute).find((a) => a.name.getText(source) === 'role');
      const roleValue = role?.initializer && ts.isStringLiteral(role.initializer) ? role.initializer.text : null;
      const intrinsic = /^[a-z]/.test(tag);
      const events = names.filter((n) => EVENTS.test(n));
      const interactive = intrinsic && (TAGS.has(tag) || events.length > 0 || (roleValue !== null && ROLES.has(roleValue)) || names.includes('tabIndex') || names.includes('contentEditable'));
      const hasDoor = names.includes('data-door');
      if (interactive) {
        const kind = hasDoor ? 'door' : names.includes('data-local') ? 'local' : insideDoor ? 'inside a door' : spread ? 'spread attributes' : ts.isJsxElement(node) && wrapsDoor(node) ? 'wraps a door' : 'no mark';
        items.push({ file, line: line(opening), tag, role: roleValue, events, kind });
      } else if (!intrinsic && events.length > 0) {
        items.push({ file, line: line(opening), tag, role: null, events, kind: 'component with handler' });
      }
      if (hasDoor) door = true;
    }
    if (ts.isCallExpression(node)) {
      const call = node.expression.getText(source);
      if (/\.createElement$/.test(call) && node.arguments[0] && ts.isStringLiteral(node.arguments[0]) && TAGS.has(node.arguments[0].text)) imperative.push({ file, line: line(node), what: `createElement('${node.arguments[0].text}')` });
      if (/\.addEventListener$/.test(call)) imperative.push({ file, line: line(node), what: 'addEventListener' });
    }
    ts.forEachChild(node, (child) => visit(child, door));
  };
  visit(source, false);
}
const ms = performance.now() - t0;

const count = (list, key) => Object.entries(list.reduce((a, x) => ({ ...a, [x[key]]: (a[x[key]] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);
const unmarked = items.filter((i) => i.kind === 'no mark');
const lines = [
  `files read: ${files.length}; time: ${ms.toFixed(0)} ms (TypeScript ${ts.version})`,
  `interactive JSX elements and components with handlers: ${items.length}`,
  ...count(items, 'kind').map(([c, n]) => `  ${c}: ${n}`),
  `imperative calls: ${imperative.length}`,
  ...count(imperative, 'what').map(([c, n]) => `  ${c}: ${n}`),
  '',
  'no mark, by file:',
  ...count(unmarked, 'file').map(([c, n]) => `  ${c}: ${n}`),
  '',
  'no mark, one per line (file, line, tag, role, handlers):',
  ...unmarked.map((i) => `  ${i.file} line ${i.line} <${i.tag}> ${i.role ?? '-'} ${i.events.join(',') || '-'}`),
];
fs.writeFileSync(OUTPUT, `${lines.join('\n')}\n`);
console.log(lines.slice(0, 40).join('\n'));
