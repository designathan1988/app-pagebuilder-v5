// The ESLint rules that hold the contract in code ("Lint rules of the contract"). Each rule has a
// planted violation that fails npm run verify:fast.
//
// Two plugins: `builder` lints JavaScript and TypeScript (use-ports, no-literal-ui-string, use-tokens for React style
// objects, pointer-owner, gesture-owner, frame-owner) and `builder-css` lints stylesheets with the @eslint/css
// language (use-tokens).
import { relative, resolve } from 'node:path';
import process from 'node:process';
import { isInteractive, keyOf } from '../inventory/ui-scan.ts';
import { INTERACTIVE_ALLOWED } from './interactive-allowed.ts';
import { LISTENER_ALLOWED } from './listener-allowed.ts';
import type { RuleDefinition, RuleVisitor } from '@eslint/core';
import type { CSSRuleDefinition } from '@eslint/css';
import type { TSESTree } from '@typescript-eslint/utils';
import type { Linter, Rule, SourceCode } from 'eslint';
import { COMMAND_IDS, DOOR_IDS, KEY_CONTEXT_IDS, PROPERTY_IDS } from '../../src/generated/ids.ts';
import { cssPropertyName, DEFAULT_TOKENS_FILE, numberLiteral, styleLiterals, tokenNames, type StyleLiteral } from './style-values.ts';

type Node = Rule.Node;

// A rule over the typescript-eslint AST, which has the JSX nodes that ESLint's own JavaScript types lack.
interface JsxVisitor extends RuleVisitor {
  JSXText?: (node: TSESTree.JSXText) => void;
  JSXAttribute?: (node: TSESTree.JSXAttribute) => void;
  JSXExpressionContainer?: (node: TSESTree.JSXExpressionContainer) => void;
}

type JsxRuleDefinition<MessageIds extends string, RuleOptions extends unknown[] = []> = RuleDefinition<{
  LangOptions: Linter.LanguageOptions;
  Code: SourceCode;
  RuleOptions: RuleOptions;
  Visitor: JsxVisitor;
  Node: TSESTree.Node;
  MessageIds: MessageIds;
  ExtRuleDocs: unknown;
}>;

// The last name of a member chain's object: Date for Date.now, and for globalThis.Date.now or window.Date.now.
function objectName(node: Node): string | null {
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'MemberExpression' && !node.computed && node.property.type === 'Identifier') return node.property.name;
  return null;
}

function propertyName(node: Node & { type: 'MemberExpression' }): string | null {
  if (!node.computed && node.property.type === 'Identifier') return node.property.name;
  if (node.computed && node.property.type === 'Literal' && typeof node.property.value === 'string') return node.property.value;
  return null;
}

// The reads that bypass the ports: object → property → what it gives (the time or randomness for an id).
const BYPASSES: Readonly<Record<string, Readonly<Record<string, 'time' | 'id'>>>> = {
  Date: { now: 'time' },
  performance: { now: 'time' },
  Math: { random: 'id' },
  crypto: { randomUUID: 'id', getRandomValues: 'id' },
};
// a key's entry of a table, never a member every object has (a read of `rule.constructor.name` found Object's own
// constructor and reported it as a message the rule does not have)
const entryOf = <T>(table: Readonly<Record<string, T>> | undefined, key: string): T | undefined => (table !== undefined && Object.hasOwn(table, key) ? table[key] : undefined);

// builder/use-ports: the time is read only through the Clock port and ids come only from the IdGenerator port.
// The two port modules are the only files the configuration exempts. A read is caught as a member (Date.now,
// window.performance.now), a computed member (Math['random']) or a destructuring (const { now } = Date).
const usePorts: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: { description: 'Read the time through the Clock port and take ids from the IdGenerator port' },
    messages: {
      time: '{{what}} reads the time: take a Clock (src/core/ports/clock.ts) instead.',
      id: '{{what}} makes an id: take an IdGenerator (src/core/ports/ids.ts) instead.',
    },
    schema: [],
  },
  create(context) {
    return {
      MemberExpression(node) {
        const object = objectName(node.object as Node);
        const property = propertyName(node);
        if (property === null) return;
        const kind = object !== null ? entryOf(entryOf(BYPASSES, object), property) : undefined;
        if (kind !== undefined) context.report({ node, messageId: kind, data: { what: `${object ?? ''}.${property}` } });
        // randomUUID and getRandomValues make ids whatever object they are read from
        else if (property === 'randomUUID' || property === 'getRandomValues') context.report({ node, messageId: 'id', data: { what: `crypto.${property}` } });
      },
      VariableDeclarator(node) {
        if (node.id.type !== 'ObjectPattern' || !node.init) return;
        const object = objectName(node.init as Node);
        const reads = object !== null ? entryOf(BYPASSES, object) : undefined;
        if (!reads) return;
        for (const p of node.id.properties) {
          if (p.type !== 'Property' || p.computed || p.key.type !== 'Identifier') continue;
          const kind = entryOf(reads, p.key.name);
          if (kind !== undefined) context.report({ node: p, messageId: kind, data: { what: `${object ?? ''}.${p.key.name}` } });
        }
      },
      NewExpression(node) {
        if (objectName(node.callee as Node) === 'Date' && node.arguments.length === 0) context.report({ node, messageId: 'time', data: { what: 'new Date()' } });
      },
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'Date') context.report({ node, messageId: 'time', data: { what: 'Date()' } });
      },
    };
  },
};

// The text a person reads: a letter or a digit in any script. Punctuation, symbols and spaces alone are not text.
const HAS_TEXT = /[\p{L}\p{N}]/u;

// The attributes whose value is shown or read out to the person using the interface.
const UI_TEXT_ATTRIBUTES: ReadonlySet<string> = new Set([
  'title',
  'aria-label',
  'aria-description',
  'aria-roledescription',
  'aria-placeholder',
  'aria-valuetext',
  'placeholder',
  'alt',
  'label',
]);

function shown(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

// The literal texts an expression can evaluate to: string literals, template literals and the branches of
// conditional and logical expressions. Anything else (a call to t(), an imported constant) is not a literal.
function literalTexts(expression: TSESTree.Node): Array<{ node: TSESTree.Node; text: string }> {
  switch (expression.type) {
    case 'Literal':
      return typeof expression.value === 'string' && HAS_TEXT.test(expression.value) ? [{ node: expression, text: expression.value }] : [];
    case 'TemplateLiteral': {
      const text = expression.quasis.map((quasi) => quasi.value.cooked ?? quasi.value.raw).join('…');
      return HAS_TEXT.test(text) ? [{ node: expression, text }] : [];
    }
    case 'ConditionalExpression':
      return [...literalTexts(expression.consequent), ...literalTexts(expression.alternate)];
    case 'LogicalExpression':
      return [...literalTexts(expression.left), ...literalTexts(expression.right)];
    case 'TSAsExpression':
    case 'TSSatisfiesExpression':
    case 'TSNonNullExpression':
      return literalTexts(expression.expression);
    default:
      return [];
  }
}

// builder/no-literal-ui-string: UI text comes only from t() over the i18n catalogues, never from a literal in JSX.
const noLiteralUiString: JsxRuleDefinition<'text' | 'attribute'> = {
  meta: {
    type: 'problem',
    docs: { description: 'Take every UI text from t() and the i18n catalogues, never from a literal in JSX' },
    messages: {
      text: 'The JSX text "{{text}}" is UI text written in code: add it to src/i18n/locales/en.json and pt-BR.json and render t(key) instead.',
      attribute:
        'The {{attribute}} text "{{text}}" is UI text written in code: add it to src/i18n/locales/en.json and pt-BR.json and pass t(key) instead.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXText(node) {
        if (HAS_TEXT.test(node.value)) context.report({ node, messageId: 'text', data: { text: shown(node.value) } });
      },
      JSXExpressionContainer(node) {
        if (node.parent.type !== 'JSXElement' && node.parent.type !== 'JSXFragment') return;
        for (const literal of literalTexts(node.expression)) {
          context.report({ node: literal.node, messageId: 'text', data: { text: shown(literal.text) } });
        }
      },
      JSXAttribute(node) {
        if (node.name.type !== 'JSXIdentifier' || !UI_TEXT_ATTRIBUTES.has(node.name.name) || !node.value) return;
        const attribute = node.name.name;
        const expression = node.value.type === 'JSXExpressionContainer' ? node.value.expression : node.value;
        for (const literal of literalTexts(expression)) {
          context.report({ node: literal.node, messageId: 'attribute', data: { attribute, text: shown(literal.text) } });
        }
      },
    };
  },
};

interface TokensOptions {
  tokens?: string;
}

const TOKENS_SCHEMA = [
  {
    type: 'object' as const,
    properties: { tokens: { type: 'string' as const, description: 'The generated tokens stylesheet, relative to the working directory.' } },
    additionalProperties: false,
  },
];

const STYLE_MESSAGES = {
  colour: '{{value}} is a literal colour in {{property}}: use a --color-* token of {{tokens}} (transparent and currentColor are allowed).',
  length:
    '{{value}} is a literal length in {{property}}: use a {{hint}} token of {{tokens}} (0, auto, percentages and viewport units are allowed).',
  font: '{{value}} is a literal font value in {{property}}: use a {{hint}} token of {{tokens}}.',
  layer: '{{value}} is a literal layer in {{property}}: use a --z-* token of {{tokens}} (0 to 9 order the parts of one component).',
};

function literalData(literal: Omit<StyleLiteral, 'start' | 'end'>, tokens: string): Record<string, string> {
  return { value: literal.text, property: literal.property, hint: literal.hint, tokens };
}

// The values a style property can take from a literal: the branches of conditional and logical expressions too.
function styleValueNodes(expression: TSESTree.Node): Array<TSESTree.Literal | TSESTree.TemplateLiteral> {
  switch (expression.type) {
    case 'Literal':
    case 'TemplateLiteral':
      return [expression];
    case 'ConditionalExpression':
      return [...styleValueNodes(expression.consequent), ...styleValueNodes(expression.alternate)];
    case 'LogicalExpression':
      return [...styleValueNodes(expression.left), ...styleValueNodes(expression.right)];
    case 'TSAsExpression':
    case 'TSSatisfiesExpression':
      return styleValueNodes(expression.expression);
    default:
      return [];
  }
}

function styleKey(property: TSESTree.Property): string | null {
  if (!property.computed && property.key.type === 'Identifier') return property.key.name;
  if (property.key.type === 'Literal' && typeof property.key.value === 'string') return property.key.value;
  return null;
}

// builder/use-tokens: a React style object takes its colours, spacing, sizes, radii, shadows and font values from the
// tokens, like the stylesheets. A dynamic value (a variable, a template with expressions) is not a literal; the
// literal parts of a template are still checked.
const useTokensInStyle: JsxRuleDefinition<'colour' | 'length' | 'font' | 'layer' | 'variable', [TokensOptions?]> = {
  meta: {
    type: 'problem',
    docs: { description: 'Take every colour, spacing, size, radius, shadow and font value of a style object from the tokens' },
    messages: {
      ...STYLE_MESSAGES,
      variable: 'var({{name}}) reads a custom property that neither {{tokens}} nor this style object defines: use a token of {{tokens}}.',
    },
    schema: TOKENS_SCHEMA,
  },
  create(context) {
    const tokensFile = context.options[0]?.tokens ?? DEFAULT_TOKENS_FILE;
    const tokens = tokenNames(resolve(context.cwd, tokensFile));

    function checkObject(object: TSESTree.ObjectExpression): void {
      const properties = object.properties.flatMap((property) => (property.type === 'Property' ? [property] : []));
      const own = new Set(properties.flatMap((property) => styleKey(property) ?? []).filter((key) => key.startsWith('--')));
      for (const property of properties) {
        const key = styleKey(property);
        if (key === null) continue;
        const name = cssPropertyName(key);
        for (const node of styleValueNodes(property.value)) {
          if (node.type === 'Literal' && typeof node.value === 'number') {
            const literal = numberLiteral(name, node.value);
            if (literal) context.report({ node, messageId: literal.kind === 'font' || literal.kind === 'layer' ? literal.kind : 'length', data: literalData(literal, tokensFile) });
            continue;
          }
          const dynamic = node.type === 'TemplateLiteral' && node.expressions.length > 0;
          // The expressions of a template are replaced by 0, so that `${x}px` passes and `${x}px solid red` does not.
          const text =
            node.type === 'TemplateLiteral' ? node.quasis.map((quasi) => quasi.value.cooked ?? quasi.value.raw).join('0') : typeof node.value === 'string' ? node.value : null;
          if (text === null) continue;
          for (const literal of styleLiterals(name, text)) {
            if (literal.kind === 'variable') {
              if (!dynamic && !tokens.has(literal.text) && !own.has(literal.text)) {
                context.report({ node, messageId: 'variable', data: { name: literal.text, tokens: tokensFile } });
              }
              continue;
            }
            context.report({ node, messageId: literal.kind, data: literalData(literal, tokensFile) });
          }
        }
      }
    }

    return {
      JSXAttribute(node) {
        if (node.name.type !== 'JSXIdentifier' || node.name.name !== 'style') return;
        if (node.value?.type !== 'JSXExpressionContainer' || node.value.expression.type !== 'ObjectExpression') return;
        checkObject(node.value.expression);
      },
    };
  },
};

// builder-css/use-tokens: a stylesheet takes its colours, spacing, sizes, radii, shadows and font values from the
// tokens, and reads only custom properties the tokens or the stylesheet itself define. The generated tokens file is
// the one stylesheet the configuration exempts. Descriptors of @font-face name a font, and are not checked.
const useTokensInStylesheet: CSSRuleDefinition<{
  RuleOptions: [TokensOptions?];
  MessageIds: 'colour' | 'length' | 'font' | 'layer' | 'variable';
}> = {
  meta: {
    type: 'problem',
    languages: ['css/css'],
    docs: { description: 'Take every colour, spacing, size, radius, shadow and font value of a stylesheet from the tokens' },
    messages: {
      ...STYLE_MESSAGES,
      variable: 'var({{name}}) reads a custom property that neither {{tokens}} nor this stylesheet defines: use a token of {{tokens}}.',
    },
    schema: TOKENS_SCHEMA,
  },
  create(context) {
    const { sourceCode } = context;
    const tokensFile = context.options[0]?.tokens ?? DEFAULT_TOKENS_FILE;
    const tokens = tokenNames(resolve(context.cwd, tokensFile));
    const own = new Set<string>();
    const variables: StyleLiteral[] = [];
    let fontFaces = 0;

    const locOf = (literal: StyleLiteral) => ({ start: sourceCode.getLocFromIndex(literal.start), end: sourceCode.getLocFromIndex(literal.end) });

    return {
      Atrule(node) {
        if (node.name.toLowerCase() === 'font-face') fontFaces += 1;
      },
      'Atrule:exit'(node) {
        if (node.name.toLowerCase() === 'font-face') fontFaces -= 1;
      },
      Declaration(node) {
        if (node.property.startsWith('--')) own.add(node.property);
        if (fontFaces > 0 || !node.value.loc) return;
        const { start, end } = node.value.loc;
        const text = sourceCode.text.slice(start.offset, end.offset);
        for (const literal of styleLiterals(node.property, text, start)) {
          if (literal.kind === 'variable') variables.push(literal);
          else context.report({ loc: locOf(literal), messageId: literal.kind, data: literalData(literal, tokensFile) });
        }
      },
      // A custom property may be defined after the rule that reads it, so var() is checked at the end.
      'StyleSheet:exit'() {
        for (const variable of variables) {
          if (tokens.has(variable.text) || own.has(variable.text)) continue;
          context.report({ loc: locOf(variable), messageId: 'variable', data: { name: variable.text, tokens: tokensFile } });
        }
      },
    };
  },
};

// The text of a string literal or of a template literal without expressions; null for anything else.
function staticText(node: TSESTree.Node | undefined): string | null {
  if (node?.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node?.type === 'TemplateLiteral' && node.expressions.length === 0) return node.quasis[0]?.value.cooked ?? null;
  return null;
}
const memberName = (node: TSESTree.MemberExpression): string | null =>
  !node.computed && node.property.type === 'Identifier' ? node.property.name : node.computed && node.property.type === 'Literal' && typeof node.property.value === 'string' ? node.property.value : null;

type TsVisitor = RuleVisitor & {
  Literal?: (node: TSESTree.Literal) => void;
  TemplateLiteral?: (node: TSESTree.TemplateLiteral) => void;
  CallExpression?: (node: TSESTree.CallExpression) => void;
  NewExpression?: (node: TSESTree.NewExpression) => void;
  VariableDeclarator?: (node: TSESTree.VariableDeclarator) => void;
  'Program:exit'?: () => void;
  AssignmentExpression?: (node: TSESTree.AssignmentExpression) => void;
  MemberExpression?: (node: TSESTree.MemberExpression) => void;
  ImportSpecifier?: (node: TSESTree.ImportSpecifier) => void;
  JSXAttribute?: (node: TSESTree.JSXAttribute) => void;
  JSXOpeningElement?: (node: TSESTree.JSXOpeningElement) => void;
};
type TsRuleDefinition<MessageIds extends string> = RuleDefinition<{
  LangOptions: Linter.LanguageOptions;
  Code: SourceCode;
  RuleOptions: [];
  Visitor: TsVisitor;
  Node: TSESTree.Node;
  MessageIds: MessageIds;
  ExtRuleDocs: unknown;
}>;

// builder/pointer-owner: pointer, mouse and drag input belongs to the pointer owner (src/editor/input/pointer.ts and
// the OS file drop it owns, input/file-drop.ts), the files the configuration exempts. A listener of such an event
// (addEventListener, removeEventListener, an on… property) and a React prop of one (onPointer…, onMouse…, onDrag…,
// onDrop, the pointer capture props) are refused anywhere else; a control's onClick is not a gesture on the canvas and
// stays with the control.
const POINTER_EVENT = /^(pointer|mouse|drag|drop|gotpointercapture|lostpointercapture)/i;
const POINTER_PROP = /^on(Pointer|Mouse|Drag|Drop|GotPointerCapture|LostPointerCapture)/;
const pointerOwner: TsRuleDefinition<'listener' | 'prop'> = {
  meta: {
    type: 'problem',
    docs: { description: 'Pointer, mouse and drag input is handled only by the pointer owner' },
    messages: {
      listener: '{{what}}: pointer, mouse and drag input belongs to the pointer owner (src/editor/input/pointer.ts); a control keeps only its onClick.',
      prop: '{{what}}: pointer, mouse and drag input belongs to the pointer owner (src/editor/input/pointer.ts); a control keeps only its onClick.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression') return;
        const method = memberName(node.callee);
        if (method !== 'addEventListener' && method !== 'removeEventListener') return;
        const event = staticText(node.arguments[0]);
        if (event !== null && POINTER_EVENT.test(event)) context.report({ node, messageId: 'listener', data: { what: `${method}('${event}')` } });
      },
      AssignmentExpression(node) {
        if (node.left.type !== 'MemberExpression') return;
        const property = memberName(node.left);
        if (property !== null && property.startsWith('on') && POINTER_EVENT.test(property.slice(2))) context.report({ node, messageId: 'listener', data: { what: property } });
      },
      JSXAttribute(node) {
        const name = node.name.type === 'JSXIdentifier' ? node.name.name : null;
        if (name !== null && POINTER_PROP.test(name)) context.report({ node, messageId: 'prop', data: { what: name } });
      },
    };
  },
};

// builder/gesture-owner: a gesture's transaction is opened by its door, never by a handler: store.gesture() is
// called only by the pointer owner, the one file the configuration exempts (with the store's own tests).
const gestureOwner: TsRuleDefinition<'gesture'> = {
  meta: {
    type: 'problem',
    docs: { description: 'Only the pointer owner opens a gesture transaction' },
    messages: { gesture: 'gesture() opens a gesture\'s transaction: only the doors of the pointer owner (src/editor/input/pointer.ts) open one, never a handler.' },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee;
        const name = callee.type === 'MemberExpression' ? memberName(callee) : callee.type === 'Identifier' ? callee.name : null;
        if (name === 'gesture') context.report({ node, messageId: 'gesture' });
      },
    };
  },
};

// builder/frame-owner: only the renderer (src/editor/canvas/render/render.ts, which the configuration exempts) writes
// the
// canvas iframe's DOM and CSS. The frame's document is reached (contentDocument, contentWindow, frames) only by the
// frame's readers, the canvas frame, a side frame (side-frame.tsx, spec side-by-side-view) and the coordinates module,
// which never write to a DOM or a stylesheet; every other module learns nodes and boxes from coordinates' nodeAt and
// nodeBox, never its elements (elementAt, screenBox).
const FRAME_READERS = ['src/editor/canvas/frame.tsx', 'src/editor/canvas/coordinates.ts', 'src/editor/canvas/side-frame.tsx'];
const REACH = new Set(['contentDocument', 'contentWindow', 'frames']);
const ELEMENT_GIVERS = new Set(['elementAt', 'screenBox']);
const WRITE_METHODS = new Set([
  'append',
  'appendChild',
  'prepend',
  'insertBefore',
  'insertAdjacentElement',
  'insertAdjacentHTML',
  'insertAdjacentText',
  'remove',
  'removeChild',
  'replaceChild',
  'replaceChildren',
  'replaceWith',
  'before',
  'after',
  'setAttribute',
  'setAttributeNS',
  'removeAttribute',
  'removeAttributeNS',
  'toggleAttribute',
  'setProperty',
  'removeProperty',
  'insertRule',
  'deleteRule',
  'addRule',
  'removeRule',
  'replaceSync',
  'write',
  'writeln',
  'execCommand',
  'attachShadow',
]);
const WRITE_PROPERTIES = new Set(['innerHTML', 'outerHTML', 'textContent', 'innerText', 'outerText', 'nodeValue', 'className', 'cssText', 'adoptedStyleSheets']);
const frameOwner: TsRuleDefinition<'reach' | 'write' | 'element'> = {
  meta: {
    type: 'problem',
    docs: { description: 'Only the renderer writes the canvas iframe' },
    messages: {
      reach: '{{what}} reaches the canvas iframe\'s page: only the renderer writes it and only the canvas frame and the coordinates module read it.',
      write: '{{what}} writes a DOM or a stylesheet in a reader of the canvas iframe: only the renderer (src/editor/canvas/render/render.ts) writes the page.',
      element: '{{what}} hands out the canvas page\'s elements: take a node from nodeAt or a box from nodeBox instead.',
    },
    schema: [],
  },
  create(context) {
    const file = context.filename.replaceAll('\\', '/');
    const reader = FRAME_READERS.some((f) => file.endsWith(f));
    const writesClassList = (node: TSESTree.MemberExpression) => node.object.type === 'MemberExpression' && ['classList', 'dataset', 'style'].includes(memberName(node.object) ?? '');
    return {
      MemberExpression(node) {
        const name = memberName(node);
        if (!reader && name !== null && REACH.has(name)) context.report({ node, messageId: 'reach', data: { what: name } });
      },
      ImportSpecifier(node) {
        const imported = node.imported.type === 'Identifier' ? node.imported.name : node.imported.value;
        if (!reader && ELEMENT_GIVERS.has(imported)) context.report({ node, messageId: 'element', data: { what: imported } });
      },
      CallExpression(node) {
        if (!reader || node.callee.type !== 'MemberExpression') return;
        const method = memberName(node.callee);
        if (method === null) return;
        if (WRITE_METHODS.has(method) || (writesClassList(node.callee) && ['add', 'remove', 'toggle', 'replace'].includes(method))) context.report({ node, messageId: 'write', data: { what: `${method}()` } });
      },
      AssignmentExpression(node) {
        if (!reader || node.left.type !== 'MemberExpression') return;
        const property = memberName(node.left);
        if ((property !== null && WRITE_PROPERTIES.has(property)) || writesClassList(node.left)) context.report({ node, messageId: 'write', data: { what: property ?? 'a member' } });
      },
    };
  },
};

// builder/keyboard-owner: keys belong to the keymap (src/editor/input/keymap.ts), the one file the configuration
// exempts, which runs them as the manifest's shortcut doors. A keydown, keyup or keypress listener and an onKeyDown,
// onKeyUp or onKeyPress prop are refused anywhere else; a native text field still takes its typing. A region names the
// key context the keymap runs in it (data-key-context): a name interactions.json does not declare is refused, since the
// keymap would run no key of its own there (the audit's E-09).
const KEY_EVENT = /^key(down|up|press)$/i;
const KEY_PROP = /^onKey(Down|Up|Press)(Capture)?$/;
const KEY_CONTEXTS: ReadonlySet<string> = new Set(KEY_CONTEXT_IDS);
const keyboardOwner: TsRuleDefinition<'listener' | 'prop' | 'context'> = {
  meta: {
    type: 'problem',
    docs: { description: 'Keys are handled only by the keymap' },
    messages: {
      listener: '{{what}}: keys belong to the keymap (src/editor/input/keymap.ts), which runs them as the manifest\'s shortcut doors.',
      prop: '{{what}}: keys belong to the keymap (src/editor/input/keymap.ts), which runs them as the manifest\'s shortcut doors.',
      context: 'data-key-context="{{what}}" is no key context of manifest/interactions.json: declare it there, with the keys it takes.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression') return;
        const method = memberName(node.callee);
        if (method !== 'addEventListener' && method !== 'removeEventListener') return;
        const event = staticText(node.arguments[0]);
        if (event !== null && KEY_EVENT.test(event)) context.report({ node, messageId: 'listener', data: { what: `${method}('${event}')` } });
      },
      AssignmentExpression(node) {
        if (node.left.type !== 'MemberExpression') return;
        const property = memberName(node.left);
        if (property !== null && property.startsWith('on') && KEY_EVENT.test(property.slice(2))) context.report({ node, messageId: 'listener', data: { what: property } });
      },
      JSXAttribute(node) {
        const name = node.name.type === 'JSXIdentifier' ? node.name.name : null;
        if (name !== null && KEY_PROP.test(name)) context.report({ node, messageId: 'prop', data: { what: name } });
        const value = node.value?.type === 'Literal' ? node.value.value : node.value?.type === 'JSXExpressionContainer' && node.value.expression.type === 'Literal' ? node.value.expression.value : null;
        if (name === 'data-key-context' && typeof value === 'string' && !KEY_CONTEXTS.has(value)) context.report({ node, messageId: 'context', data: { what: value } });
      },
    };
  },
};

// builder/no-manifest-id: code takes a command, a door or an edited property from the manifest's data, never from a
// text written by hand. A string literal (or a template without expressions) that is a CommandId, a DoorId or a
// PropertyId of the generated lists (src/generated/ids.ts) is refused, except as the id a handler, a predicate or a
// codec registers (the first argument of registerHandler, registerPredicate, registerCondition, registerAction or
// registerCodec, which manifest:check
// reads; a codec may share its id with the property it reads, font-weight) and in a type
// (CommandArgs['…'], checked by TypeScript against the same lists). The configuration exempts src/generated/, the
// manifest's own reader and checker (src/manifest/), the command table and the tests.
const MANIFEST_IDS = new Map<string, string>([
  ...PROPERTY_IDS.map((id) => [id, 'an edited property'] as const),
  ...COMMAND_IDS.map((id) => [id, 'a command'] as const),
  ...DOOR_IDS.map((id) => [id, 'a door'] as const),
]);
const REGISTRARS = new Set(['registerHandler', 'registerPredicate', 'registerCondition', 'registerAction', 'registerCodec']);
const noManifestId: TsRuleDefinition<'id'> = {
  meta: {
    type: 'problem',
    docs: { description: 'Manifest ids come from the manifest, never from a literal' },
    messages: { id: '"{{id}}" is {{what}} of the manifest written by hand: read it from the manifest\'s data (a door\'s drawing, its command\'s arguments, the region\'s placement).' },
    schema: [],
  },
  create(context) {
    const check = (node: TSESTree.Node, text: string) => {
      const what = MANIFEST_IDS.get(text);
      if (what === undefined) return;
      const parent = node.parent;
      if (parent?.type === 'TSLiteralType') return;
      if (parent?.type === 'CallExpression' && parent.arguments[0] === node && parent.callee.type === 'Identifier' && REGISTRARS.has(parent.callee.name)) return;
      context.report({ node, messageId: 'id', data: { id: text, what } });
    };
    return {
      Literal(node: TSESTree.Literal) {
        if (typeof node.value === 'string') check(node, node.value);
      },
      TemplateLiteral(node: TSESTree.TemplateLiteral) {
        const text = staticText(node);
        if (text !== null) check(node, text);
      },
    };
  },
};

// builder/interactive-owner: every element a person acts on has an owner (the investigation's C1, option B): a door of
// the manifest (data-door, drawn by src/editor/doors/door.tsx), a declared local control (data-local, conferred with
// manifest/layout.json), an object spread on it that holds one of those two marks (a door's attributes), an element
// inside a door, a wrapper of a door — or, for what is none of these on purpose (a focus sentinel, a dialog's
// container), an entry of tools/lint/interactive-allowed.ts with its reason. A spread is read for what it spreads (an
// object written in place, or the object literal its name is declared with), and a wrapper by its elements, never by
// its text, which a comment would fool (DEF-0553). What "interactive" is and the key that names an element are
// tools/inventory/ui-scan.ts's, so the lint and the generated inventory (manifest/generated/inventory.json) agree.
const ALLOWED_INTERACTIVE: ReadonlySet<string> = new Set(INTERACTIVE_ALLOWED.map((entry) => entry.key));
const OWNER_MARKS: ReadonlySet<string> = new Set(['data-door', 'data-local']);
const DOOR_COMPONENT = /Door/;
// the name of an object's property written as a name or a text ('data-door': …)
const propertyKey = (property: TSESTree.Property): string | null =>
  property.key.type === 'Identifier' ? property.key.name : property.key.type === 'Literal' && typeof property.key.value === 'string' ? property.key.value : null;
// whether an element below this node is drawn as a door: an element with data-door, or a component of a door
// (DoorControl, PanelDoor…); the syntax tree, never the text, so a comment counts for nothing
function holdsDoor(node: TSESTree.Node): boolean {
  if (node.type === 'JSXAttribute' && jsxName(node.name) === 'data-door') return true;
  if (node.type === 'JSXOpeningElement' && DOOR_COMPONENT.test(jsxName(node.name))) return true;
  for (const [key, value] of Object.entries(node)) {
    if (key === 'parent') continue;
    const children: unknown[] = Array.isArray(value) ? value : [value];
    for (const child of children) if (child !== null && typeof child === 'object' && 'type' in child && holdsDoor(child as TSESTree.Node)) return true;
  }
  return false;
}
const jsxName = (name: TSESTree.JSXTagNameExpression | TSESTree.JSXAttribute['name']): string =>
  name.type === 'JSXIdentifier' ? name.name : name.type === 'JSXNamespacedName' ? `${name.namespace.name}:${name.name.name}` : `${jsxName(name.object)}.${name.property.name}`;
const interactiveOwner: TsRuleDefinition<'owner'> = {
  meta: {
    type: 'problem',
    docs: { description: 'Every interactive element is a door, a declared local control, or listed with its reason' },
    messages: { owner: '<{{tag}}> is an element a person acts on that nobody owns: draw it as a door of the manifest (data-door), declare it a local control (data-local, manifest/layout.json), or list it with its reason in tools/lint/interactive-allowed.ts ({{key}}).' },
    schema: [],
  },
  create(context) {
    const file = relative(process.cwd(), context.filename).replaceAll('\\', '/');
    const seen = new Map<string, number>();
    // the object literal a spread name is declared with: the nearest block or program around the element that declares
    // the name (const shared = { … }), read upward as the element sees it
    const declaredObject = (name: string, at: TSESTree.Node): TSESTree.ObjectExpression | null => {
      // the program's parent is null at run time, whatever its type says
      for (let up: TSESTree.Node | null | undefined = at.parent; up !== null && up !== undefined; up = up.parent) {
        if (up.type !== 'BlockStatement' && up.type !== 'Program') continue;
        for (const statement of up.body) {
          if (statement.type !== 'VariableDeclaration') continue;
          const declared = statement.declarations.find((d) => d.id.type === 'Identifier' && d.id.name === name);
          if (declared !== undefined) return declared.init?.type === 'ObjectExpression' ? declared.init : null;
        }
      }
      return null;
    };
    const spreadsMark = (spread: TSESTree.JSXSpreadAttribute, at: TSESTree.Node): boolean => {
      const object = spread.argument.type === 'ObjectExpression' ? spread.argument : spread.argument.type === 'Identifier' ? declaredObject(spread.argument.name, at) : null;
      return object !== null && object.properties.some((one) => one.type === 'Property' && OWNER_MARKS.has(propertyKey(one) ?? ''));
    };
    return {
      JSXOpeningElement(node) {
        const tag = jsxName(node.name);
        const names = node.attributes.flatMap((a) => (a.type === 'JSXAttribute' ? [jsxName(a.name)] : []));
        const role = node.attributes.flatMap((a) => (a.type === 'JSXAttribute' && jsxName(a.name) === 'role' && a.value?.type === 'Literal' && typeof a.value.value === 'string' ? [a.value.value] : []))[0] ?? null;
        if (!isInteractive(tag, names, role)) return;
        const sig = `${tag}|${[...names].sort().join(',')}`;
        const nth = (seen.get(sig) ?? 0) + 1;
        seen.set(sig, nth);
        if (names.includes('data-door') || names.includes('data-local') || node.attributes.some((a) => a.type === 'JSXSpreadAttribute' && spreadsMark(a, node))) return;
        const element = node.parent;
        // the program's parent is null at run time, whatever its type says
        for (let up: TSESTree.Node | null | undefined = element.parent; up !== null && up !== undefined; up = up.parent) {
          if (up.type === 'JSXElement' && up.openingElement.attributes.some((a) => a.type === 'JSXAttribute' && jsxName(a.name) === 'data-door')) return;
        }
        if (element.type === 'JSXElement' && element.children.some((child) => holdsDoor(child))) return;
        const key = keyOf(file, tag, names, nth);
        if (!ALLOWED_INTERACTIVE.has(key)) context.report({ node, messageId: 'owner', data: { tag, key } });
      },
    };
  },
};

// builder/listener-scope: everything a file starts that outlives the call declares how it ends (the investigation's C6,
// option F): an addEventListener carries a signal or once, or the function that adds it removes it (the same type and
// the same handler, in the effect or the cleanup it returns), or it listens to an object that function creates; a
// setInterval and a ResizeObserver, MutationObserver or IntersectionObserver keep their handle, and the file closes it
// (clearInterval or clearTimeout, which clear the same list of timers, or disconnect). What ends some other way on
// purpose is listed with its reason in tools/lint/listener-allowed.ts.
const OBSERVERS = new Set(['ResizeObserver', 'MutationObserver', 'IntersectionObserver']);
const ALLOWED_LISTENERS: ReadonlySet<string> = new Set(LISTENER_ALLOWED.map((entry) => entry.key));
type Scoped = TSESTree.CallExpression | TSESTree.NewExpression;
const calleeName = (node: Scoped): string | null =>
  node.callee.type === 'Identifier' ? node.callee.name : node.callee.type === 'MemberExpression' ? memberName(node.callee) : null;
const isFunction = (node: TSESTree.Node): boolean => node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression';
// the function a node is written in, or the program
function enclosing(node: TSESTree.Node): TSESTree.Node {
  let up: TSESTree.Node | undefined = node.parent;
  while (up !== undefined && up.parent !== undefined && !isFunction(up)) up = up.parent;
  return up ?? node;
}
const within = (node: TSESTree.Node, outer: TSESTree.Node): boolean => node.range[0] >= outer.range[0] && node.range[1] <= outer.range[1];
const listenerScope: TsRuleDefinition<'listener' | 'handle'> = {
  meta: {
    type: 'problem',
    docs: { description: 'Every listener, interval and observer declares how it ends' },
    messages: {
      listener: '{{what}} is never removed: pass a signal or once, remove it in the function that adds it (its cleanup), listen to an object that function creates, or list it with its reason in tools/lint/listener-allowed.ts ({{key}}).',
      handle: '{{what}} is never closed: keep its handle and close it in this file (clearInterval, disconnect), or list it with its reason in tools/lint/listener-allowed.ts ({{key}}).',
    },
    schema: [],
  },
  create(context) {
    const file = relative(process.cwd(), context.filename).replaceAll('\\', '/');
    const text = (node: TSESTree.Node | undefined): string => (node === undefined ? '' : context.sourceCode.getText(node as never));
    const calls: Scoped[] = [];
    const declared: TSESTree.VariableDeclarator[] = [];
    const seen = new Map<string, number>();
    const keyFor = (what: string): string => {
      const nth = (seen.get(what) ?? 0) + 1;
      seen.set(what, nth);
      return `${file}|${what}|${nth}`;
    };
    const report = (node: Scoped, messageId: 'listener' | 'handle', what: string) => {
      const key = keyFor(what);
      if (!ALLOWED_LISTENERS.has(key)) context.report({ node, messageId, data: { what, key } });
    };
    // the options of an addEventListener end it when they hold a signal or once: true, written in place or in the
    // object literal their name is declared with (DEF-0554: the word once in { once: false } ended it before)
    const optionsEnd = (options: TSESTree.Node | undefined, scope: TSESTree.Node): boolean => {
      const named = options?.type === 'Identifier' ? declared.find((d) => within(d, scope) && d.id.type === 'Identifier' && d.id.name === options.name)?.init : undefined;
      const object = options?.type === 'ObjectExpression' ? options : named?.type === 'ObjectExpression' ? named : null;
      if (object === null) return false;
      return object.properties.some((one) => one.type === 'Property' && one.key.type === 'Identifier' && ((one.key.name === 'once' && one.value.type === 'Literal' && one.value.value === true) || one.key.name === 'signal'));
    };
    const listenerEnds = (add: TSESTree.CallExpression): boolean => {
      const scope = enclosing(add);
      if (optionsEnd(add.arguments[2], scope)) return true;
      const [type, handler] = [text(add.arguments[0]), text(add.arguments[1])];
      if (calls.some((c) => within(c, scope) && calleeName(c) === 'removeEventListener' && text(c.arguments[0]) === type && text(c.arguments[1]) === handler)) return true;
      // an object the function creates (new …, or what a call returns: a new element, a channel), never a name for an
      // object that outlives it (const w = window; DEF-0554)
      const target = add.callee.type === 'MemberExpression' && add.callee.object.type === 'Identifier' ? add.callee.object.name : null;
      return target !== null && declared.some((d) => within(d, scope) && d.id.type === 'Identifier' && d.id.name === target && (d.init?.type === 'NewExpression' || d.init?.type === 'CallExpression'));
    };
    // where the handle of an interval or an observer is kept: the variable or the member it is assigned to
    const keptIn = (node: Scoped): string | null => {
      const parent = node.parent;
      if (parent?.type === 'VariableDeclarator' && parent.id.type === 'Identifier') return parent.id.name;
      if (parent?.type === 'AssignmentExpression') return text(parent.left);
      return null;
    };
    // the declaration a name written at a node stands for, read upward through the blocks and the functions around it
    // as the language resolves it: a declarator, a function whose parameter it is, or null for a name declared outside
    const resolved = (at: TSESTree.Node, name: string): TSESTree.Node | null => {
      // the program's parent is null at run time, whatever its type says
      for (let up: TSESTree.Node | null | undefined = at.parent; up !== null && up !== undefined; up = up.parent) {
        const statements = up.type === 'BlockStatement' || up.type === 'Program' ? up.body : up.type === 'SwitchCase' ? up.consequent : [];
        for (const statement of statements) {
          if (statement.type !== 'VariableDeclaration') continue;
          const declared = statement.declarations.find((d) => d.id.type === 'Identifier' && d.id.name === name);
          if (declared !== undefined) return declared;
        }
        if (isFunction(up) && 'params' in up && up.params.some((p) => p.type === 'Identifier' && p.name === name)) return up;
      }
      return null;
    };
    // a handle is closed where the place it is kept in is closed (hold.timer by clearInterval(hold.timer), never by
    // clearInterval(other.timer)); a handle kept in a name of its own is closed by that name, never by another
    // function's name that reads the same (DEF-0554)
    const handleEnds = (node: Scoped, closers: readonly string[]): boolean => {
      const kept = keptIn(node);
      if (kept === null) return false;
      const own = node.parent?.type === 'VariableDeclarator' ? node.parent : null;
      return calls.some((c) => {
        const closing = c.callee.type === 'MemberExpression' && (calleeName(c) === 'disconnect' || calleeName(c) === 'unobserve') ? c.callee.object : c.arguments[0];
        if (own !== null && (closing?.type !== 'Identifier' || resolved(closing, closing.name) !== own)) return false;
        const callee = calleeName(c);
        if (callee === null || !closers.includes(callee)) return false;
        const closed = callee === 'disconnect' || callee === 'unobserve' ? (c.callee.type === 'MemberExpression' ? text(c.callee.object) : '') : text(c.arguments[0]);
        return closed === kept;
      });
    };
    return {
      CallExpression(node) {
        calls.push(node);
      },
      NewExpression(node) {
        calls.push(node);
      },
      VariableDeclarator(node) {
        declared.push(node);
      },
      'Program:exit'() {
        for (const node of calls) {
          const callee = calleeName(node);
          if (node.type === 'CallExpression' && callee === 'addEventListener' && node.callee.type === 'MemberExpression') {
            if (!listenerEnds(node)) report(node, 'listener', `${text(node.callee.object)}.addEventListener(${text(node.arguments[0])})`);
          } else if (node.type === 'CallExpression' && callee === 'setInterval') {
            if (!handleEnds(node, ['clearInterval', 'clearTimeout'])) report(node, 'handle', 'setInterval');
          } else if (node.type === 'NewExpression' && callee !== null && OBSERVERS.has(callee)) {
            if (!handleEnds(node, ['disconnect'])) report(node, 'handle', `new ${callee}`);
          }
        }
      },
    };
  },
};

const plugin = {
  meta: { name: 'builder' },
  rules: {
    'use-ports': usePorts,
    'no-literal-ui-string': noLiteralUiString,
    'use-tokens': useTokensInStyle,
    'pointer-owner': pointerOwner,
    'gesture-owner': gestureOwner,
    'frame-owner': frameOwner,
    'keyboard-owner': keyboardOwner,
    'no-manifest-id': noManifestId,
    'interactive-owner': interactiveOwner,
    'listener-scope': listenerScope,
  },
};

export const builderCss = {
  meta: { name: 'builder-css' },
  rules: { 'use-tokens': useTokensInStylesheet },
};

export default plugin;
