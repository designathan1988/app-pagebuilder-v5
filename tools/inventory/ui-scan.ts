// The interactive elements the editor draws, read from the source with the TypeScript compiler's API (the
// investigation's C1, option A; grown from auditoria/investigacao/poc/c1-inventario/varrer.mjs): every intrinsic JSX
// element a person acts on (a button, a field, a link, an element with a handler, an interactive ARIA role, a
// tabIndex) and who owns it — a door of the manifest (data-door), a declared local control (data-local), part of a
// door (inside an element that carries data-door), its attributes spread from elsewhere (only the run tells), or a
// wrapper of a door — or nobody. Each element is named by a key that does not move with the lines around it: its file,
// its tag, its attribute names and its place among the elements of that file with the same tag and attribute names.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

export type Owner = 'door' | 'local' | 'inside-door' | 'spread' | 'wraps-door' | 'none';
export interface Interactive {
  readonly file: string;
  readonly line: number;
  readonly tag: string;
  readonly role: string | null;
  readonly handlers: readonly string[];
  readonly owner: Owner;
  readonly key: string;
}

const TAGS = new Set(['button', 'input', 'select', 'textarea', 'a', 'summary', 'option']);
const ROLES = new Set(['button', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'tab', 'option', 'slider', 'spinbutton', 'checkbox', 'switch', 'treeitem', 'combobox', 'radio', 'link', 'gridcell', 'separator']);
// the same two sets for a check that reads the drawn page instead of the source (tests/e2e/lote-visual.spec.ts)
export const INTERACTIVE_TAGS = TAGS;
export const INTERACTIVE_ROLES = ROLES;
const HANDLERS = /^on(Click|DoubleClick|PointerDown|PointerUp|MouseDown|KeyDown|KeyUp|Change|Input|Wheel|ContextMenu|Submit|DragStart|Drop|Focus|Blur)$/;

// Whether an element the attribute names and role describe is one a person acts on: the rule the lint applies too
// (tools/lint/plugin.ts, builder/interactive-owner).
export function isInteractive(tag: string, names: readonly string[], role: string | null): boolean {
  return /^[a-z]/.test(tag) && (TAGS.has(tag) || names.some((n) => HANDLERS.test(n)) || (role !== null && ROLES.has(role)) || names.includes('tabIndex') || names.includes('contentEditable'));
}
export const handlersOf = (names: readonly string[]): string[] => names.filter((n) => HANDLERS.test(n));
// the key of an element: file, tag, its attribute names in order, and its place among the same in the file
export const keyOf = (file: string, tag: string, names: readonly string[], nth: number): string => `${file}|${tag}|${[...names].sort().join(',')}|${nth}`;

export function scanFile(file: string, text: string): Interactive[] {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const lineOf = (node: ts.Node) => source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
  const out: Interactive[] = [];
  const seen = new Map<string, number>();
  const wrapsDoor = (node: ts.Node): boolean => {
    let found = false;
    const look = (n: ts.Node) => {
      if (found) return;
      if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
        const tag = n.tagName.getText(source);
        if (/Door/.test(tag) || n.attributes.properties.some((a) => ts.isJsxAttribute(a) && a.name.getText(source) === 'data-door')) found = true;
      }
      ts.forEachChild(n, look);
    };
    ts.forEachChild(node, look);
    return found;
  };
  const visit = (node: ts.Node, insideDoor: boolean) => {
    let inside = insideDoor;
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node;
      const tag = opening.tagName.getText(source);
      const attributes = opening.attributes.properties;
      const names = attributes.filter(ts.isJsxAttribute).map((a) => a.name.getText(source));
      const roleAttribute = attributes.filter(ts.isJsxAttribute).find((a) => a.name.getText(source) === 'role');
      const role = roleAttribute?.initializer && ts.isStringLiteral(roleAttribute.initializer) ? roleAttribute.initializer.text : null;
      if (isInteractive(tag, names, role)) {
        const owner: Owner = names.includes('data-door') ? 'door' : names.includes('data-local') ? 'local' : insideDoor ? 'inside-door' : attributes.some(ts.isJsxSpreadAttribute) ? 'spread' : ts.isJsxElement(node) && wrapsDoor(node) ? 'wraps-door' : 'none';
        const sig = `${tag}|${[...names].sort().join(',')}`;
        const nth = (seen.get(sig) ?? 0) + 1;
        seen.set(sig, nth);
        out.push({ file, line: lineOf(opening), tag, role, handlers: handlersOf(names), owner, key: keyOf(file, tag, names, nth) });
      }
      if (names.includes('data-door')) inside = true;
    }
    ts.forEachChild(node, (child) => visit(child, inside));
  };
  visit(source, false);
  return out;
}

// every .tsx and .ts under src/, tests aside, in a fixed order; `read` gives a file's text (the inventory's detector
// reads each file with the passage of the mutant under run swapped: tools/runner/mutants.ts, mutatedSource)
export function scanSource(root = 'src', read = (file: string): string => fs.readFileSync(file, 'utf8')): Interactive[] {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = path.posix.join(dir, entry.name);
      if (entry.isDirectory()) walk(rel);
      else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) files.push(rel);
    }
  };
  walk(root);
  return files.sort().flatMap((file) => scanFile(file, read(file)));
}
