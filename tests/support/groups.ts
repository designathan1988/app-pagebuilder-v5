// The three kinds of browser test, by spec file. Each kind has its responsibility, and the impact selector reads it
// (tools/impact/):
//   - end-to-end: a journey whose way is the behaviour — files in and out (open, save, export, import, upload), the
//     browser's storage across reloads and tabs, a server beside the editor. A fresh browser context per test (as every
//     browser test has): nothing of one journey may reach another.
//   - integration (every spec file not named below, and the scenario runs): a door of the editor in the real app, from
//     a state handed to it (tests/support/editor.ts), and what the press does and draws.
//   - render: what a surface draws in a state, read from the screen — its geometry, its words fitting, its stacking,
//     its pixels; the sweeps of the editor's screens under the responsive and language conditions. A change to a
//     stylesheet, a token or a catalogue reaches every one of them.
// The scenario runs are integration, but for the scenarios whose doors open, save or export files, keep tabs or a
// server: the scenario runner places them (tools/runner/scenarios.ts).
export const END_TO_END: ReadonlySet<string> = new Set([
  'assistant.spec.ts',
  'autosave-corruption-recovery.spec.ts',
  'autosave-crash-recovery.spec.ts',
  'autosave.spec.ts',
  'base-style.spec.ts',
  'browser-language.spec.ts',
  'capture-media.spec.ts',
  'capture-url.spec.ts',
  'corpus-reference.spec.ts',
  'draft-recovery.spec.ts',
  'export-cascade.spec.ts',
  'export-zip.spec.ts',
  'flows.spec.ts',
  'forms-runtime.spec.ts',
  'html-import-roundtrip.spec.ts',
  'import-destinations.spec.ts',
  'multi-tab-guard.spec.ts',
  'open-project.spec.ts',
  'project-save.spec.ts',
  'unsaved-work-guard.spec.ts',
]);

export const RENDER: ReadonlySet<string> = new Set([
  'accessibility-audit.spec.ts',
  'canvas-fit.spec.ts',
  'capture-url-layout.spec.ts',
  'card-labels-fit.spec.ts',
  'concept-row-heads.spec.ts',
  'css-support.spec.ts',
  'custom-fonts.spec.ts',
  'inspector-field-visuals.spec.ts',
  'inspector-text-fits.spec.ts',
  'layout-grid-overlay.spec.ts',
  'menus-fit-window.spec.ts',
  'motion-card-fits.spec.ts',
  'motion-dock-fits.spec.ts',
  'motion-dock-labels-fit.spec.ts',
  'motion-dock-row-fits.spec.ts',
  'narrow-window.spec.ts',
  'native-choices-accent.spec.ts',
  'overlay-scrollbar-width.spec.ts',
  'quick-panel-tag-fits.spec.ts',
  'render.spec.ts',
  'responsive-matrix.spec.ts',
  'screen-guard.spec.ts',
  'selection-label-contrast.spec.ts',
  'selection-label-touches.spec.ts',
  'sidebar-view-titles.spec.ts',
  'theme-switch.spec.ts',
  'timeline-bar-fits.spec.ts',
  'visual.spec.ts',
]);

export type TestKind = 'end-to-end' | 'integration' | 'render';
export const kindOf = (specFile: string): TestKind => (END_TO_END.has(specFile) ? 'end-to-end' : RENDER.has(specFile) ? 'render' : 'integration');
