// The shape of a tree the app reads from outside — a project file opened, the work restored at start, the elements a
// clipboard holds, a captured page — checked before anything reads it deeply: every reader of a tree walks it by
// recursion, and one that is not a tree of nodes, or that stands deeper than any page, threw instead of being refused
// (DEF-0517, DEF-0543, DEF-0544). Both checks here read without recursion, so no depth makes them throw.

// The deepest an element stands in a page: Chromium's HTML parser builds no deeper tree (kMaximumHTMLParserDOMTreeDepth
// = 512, third_party/blink/renderer/core/html/parser/html_construction_site.h), so no page a browser draws from HTML
// holds one deeper, and a file that does is no page the app could have made or captured.
export const MAX_TREE_DEPTH = 512;
// A document's JSON nests two levels for each level of its tree (a node, and the list of its children), under a few of
// its own (the document, its pages, a page, a capture): the depth a document at the deepest tree reaches, with room.
export const MAX_DOCUMENT_NESTING = 2 * MAX_TREE_DEPTH + 16;

const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value);

// Whether a parsed JSON value nests deeper than `limit` objects and arrays.
export function nestsDeeperThan(value: unknown, limit: number): boolean {
  const stack: [unknown, number][] = [[value, 0]];
  for (let next = stack.pop(); next !== undefined; next = stack.pop()) {
    const [held, depth] = next;
    if (held === null || typeof held !== 'object') continue;
    if (depth + 1 > limit) return true;
    for (const child of Array.isArray(held) ? held : Object.values(held)) stack.push([child, depth + 1]);
  }
  return false;
}

// The first place where a tree is not a tree of nodes — a node with its id, its attributes and its children — or
// stands deeper than MAX_TREE_DEPTH, with its path under `at`; null for a tree of that shape. `ids`: whether a node
// carries its id (a document's do; the elements a clipboard holds take new ids when they are pasted, and carry none).
export function treeShapeProblem(root: unknown, at: string, ids = true): { readonly path: string; readonly message: string } | null {
  const stack: [unknown, string, number][] = [[root, at, 1]];
  for (let next = stack.pop(); next !== undefined; next = stack.pop()) {
    const [node, path, depth] = next;
    if (!isRecord(node) || (ids && typeof node.id !== 'string') || !isRecord(node.attributes) || !Array.isArray(node.children)) {
      return { path, message: ids ? 'a tree is a tree of nodes, each with its id, its attributes and its children' : 'a tree is a tree of nodes, each with its attributes and its children' };
    }
    if (depth > MAX_TREE_DEPTH) return { path, message: `a tree stands no deeper than ${String(MAX_TREE_DEPTH)} elements` };
    node.children.forEach((child, index) => stack.push([child, `${path}/children/${String(index)}`, depth + 1]));
  }
  return null;
}
