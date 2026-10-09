// The check of the interface's text against the column it is drawn in (the investigation's C4, option A, with the
// declared widths of option C and the measured widths of option D): for every door of the manifest whose control draws
// its label, the widest of the label in pt-BR, in English and in the pseudo-expansion has to fit the width of the
// region the door is placed in, with 1 px of slack. The width of a label comes from the face itself (font.ts, no
// browser); the column comes from the token `src/ui/tokens.css` names when the region's width is fixed, and from
// manifest/generated/ui-widths.json (tools/ui-fit/measure.ts, one measurement per region in both screen conditions)
// when it is fluid.
import fs from 'node:fs';
import { textWidth, uiFont, type Weight } from './font.ts';
import { commandsFileSchema } from '../../src/manifest/schema.ts';
import { loadManifest } from '../manifest/load.ts';
import { mutatedSource } from '../runner/mutants.ts';

// The regions whose column is a token of src/ui/tokens.css. Only the tokens that are the width of the region itself:
// a height (--size-dock-strip, --size-top-bar), a minimum or a maximum is not a column, so those regions are measured.
const FIXED_COLUMNS: readonly { readonly region: RegExp; readonly token: string }[] = [
  { region: /^(inspector-[a-z-]+|forms-settings)$/, token: '--size-inspector' },
  { region: /^(explorer-[a-z-]+|layers-tree|insert|styles|data-[a-z-]+|assistant-panel|layout-composer-panel)$/, token: '--size-sidebar' },
  { region: /^menu:/, token: '--size-menu-min' },
  { region: /^command-palette$/, token: '--size-palette' },
  { region: /^code-view$/, token: '--size-code-pane' },
  { region: /^right-dock$/, token: '--size-right-dock' },
  { region: /^panel-window$/, token: '--size-panel-window-width' },
];

// The regions whose column the browser measured (tools/ui-fit/measure.ts): the file holds one entry per region and per
// screen condition; the check reads the narrowest, the column that can appear.
export const UI_WIDTHS = 'manifest/generated/ui-widths.json';

export interface Measured {
  readonly [region: string]: { readonly [condition: string]: { readonly width: number; readonly fontSize: number; readonly fontWeight: number } };
}

export interface Finding {
  readonly region: string;
  readonly ref: string;
  readonly labelKey: string;
  readonly text: string;
  readonly need: number;
  readonly column: number;
  readonly slack: number;
}

// The English text with the vowels accented and the ends marked, extended to 140 % of its length: the headroom a
// translation into a longer language takes (the investigation's C4 cites the W3C table of text expansion, 130 % to
// 300 % by length; 140 % is the value this check holds every label to).
export function pseudoExpansion(text: string): string {
  const accented = text.replace(/[aeiou]/g, (c) => 'áéíóú'['aeiou'.indexOf(c)] ?? c);
  return `【${accented.padEnd(Math.round(text.length * 1.4), '·')}】`;
}

function tokenPixels(css: string): Map<string, number> {
  const out = new Map<string, number>();
  for (const match of css.matchAll(/--([a-z0-9-]+):\s*([0-9.]+)px;/g)) out.set(match[1] ?? '', Number(match[2]));
  return out;
}

interface Labels {
  readonly ptBR: Readonly<Record<string, unknown>>;
  readonly en: Readonly<Record<string, unknown>>;
}
const textOf = (catalogue: Readonly<Record<string, unknown>>, key: string): string => {
  const held = catalogue[key];
  return typeof held === 'string' ? held : '';
};

export interface DoorLabel {
  readonly ref: string;
  readonly region: string;
  readonly labelKey: string;
}

// Every door of the manifest whose control draws its label, with the region it is placed in: the label is faceLabelKey
// when the drawing shows the shorter text, labelKey itself otherwise. A door drawn as an icon button carries its label
// as the accessible name and the tooltip, and the page draws no text for it, so its label has no column.
export function drawnLabels(files: Readonly<Record<string, unknown>>): DoorLabel[] {
  const out: DoorLabel[] = [];
  for (const [file, json] of Object.entries(files)) {
    if (!file.startsWith('commands/')) continue;
    const parsed = commandsFileSchema.safeParse(json);
    if (!parsed.success) continue;
    for (const command of parsed.data.commands)
      for (const door of command.entryPoints) {
        if (door.placement === 'none' || door.placement === 'unplaced') continue;
        const drawnAs = 'drawnAs' in door ? door.drawnAs : null;
        if (drawnAs === 'icon-button') continue;
        const face = door.faceLabelKey;
        out.push({ ref: `${command.id}#${door.id}`, region: door.placement.region, labelKey: face ?? door.labelKey });
      }
  }
  return out;
}

function fixedToken(region: string): string | null {
  for (const entry of FIXED_COLUMNS) if (entry.region.test(region)) return entry.token;
  return null;
}

export interface UiFitInput {
  readonly tokens: ReadonlyMap<string, number>;
  readonly measured: Measured | null;
  readonly labels: readonly DoorLabel[];
  readonly catalogue: Labels;
}

export function uiFitFindings(input: UiFitInput): Finding[] {
  const fonts = new Map<Weight, ReturnType<typeof uiFont>>();
  const findings: Finding[] = [];
  for (const door of input.labels) {
    const ptBR = textOf(input.catalogue.ptBR, door.labelKey);
    const en = textOf(input.catalogue.en, door.labelKey);
    if (ptBR === '' && en === '') continue;
    const variants = [ptBR, en, en === '' ? '' : pseudoExpansion(en)].filter((text) => text !== '');
    const token = fixedToken(door.region);
    const cells = input.measured?.[door.region];
    const sizes = cells === undefined ? [] : Object.values(cells);
    let column: number;
    let fontSize: number;
    let fontWeight: number;
    if (token !== null) {
      const width = input.tokens.get(token.slice(2));
      if (width === undefined) continue;
      column = width;
      fontSize = sizes.length === 0 ? 12 : Math.min(...sizes.map((s) => s.fontSize));
      fontWeight = sizes.length === 0 ? 600 : Math.min(...sizes.map((s) => s.fontWeight));
    } else if (sizes.length > 0) {
      column = Math.min(...sizes.map((s) => s.width));
      fontSize = Math.min(...sizes.map((s) => s.fontSize));
      fontWeight = Math.min(...sizes.map((s) => s.fontWeight));
    } else {
      continue;
    }
    const weight: Weight = fontWeight >= 500 ? 600 : 400;
    let held = fonts.get(weight);
    if (held === undefined) {
      held = uiFont(weight);
      fonts.set(weight, held);
    }
    let need = 0;
    let worst = '';
    for (const variant of variants) {
      const width = textWidth(held, variant, fontSize);
      if (width > need) {
        need = width;
        worst = variant;
      }
    }
    if (need + 1 > column) findings.push({ region: door.region, ref: door.ref, labelKey: door.labelKey, text: worst, need, column, slack: column - need });
  }
  return findings;
}

// The check against the disk: the tokens of src/ui/tokens.css (the mutant's passage swapped when one is under run), the
// measured widths of manifest/generated/ui-widths.json, the doors of the manifest and the two catalogues.
export function uiFitFindingsFromDisk(root = ''): Finding[] {
  const at = (file: string) => `${root}${file}`;
  const css = mutatedSource('src/ui/tokens.css', fs.readFileSync(at('src/ui/tokens.css'), 'utf8'));
  const widthsFile = at(UI_WIDTHS);
  const measured = fs.existsSync(widthsFile) ? (JSON.parse(fs.readFileSync(widthsFile, 'utf8')) as { regions?: Measured }).regions ?? null : null;
  const loaded = loadManifest();
  const catalogue = loaded.input.catalogues as Record<string, Readonly<Record<string, unknown>>>;
  return uiFitFindings({
    tokens: tokenPixels(css),
    measured,
    labels: drawnLabels(loaded.input.files),
    catalogue: { ptBR: catalogue['pt-BR'] ?? {}, en: catalogue['en'] ?? {} },
  });
}
