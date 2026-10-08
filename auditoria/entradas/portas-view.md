# Portas do domínio view

## ENT-P-view-0001 — view.zoomIn pela porta key-ctrl-equals-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:24` `"kind": "shortcut",`
- **Comando:** view.zoomIn
- **Porta:** `manifest/commands/view.json:23` `"id": "key-ctrl-equals-in-global",`
- **Gatilho:** `manifest/commands/view.json:26` `"chord": "Ctrl+=",`
- **Tratador:** `src/app/commands.ts:439` `'view.zoomIn': zoomIn,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0001.md`
- **Requisitos:** REQ-2501

## ENT-P-view-0002 — view.zoomIn pela porta key-ctrl-plus-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:44` `"kind": "shortcut",`
- **Comando:** view.zoomIn
- **Porta:** `manifest/commands/view.json:43` `"id": "key-ctrl-plus-in-global",`
- **Gatilho:** `manifest/commands/view.json:46` `"chord": "Ctrl++",`
- **Tratador:** `src/app/commands.ts:439` `'view.zoomIn': zoomIn,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0002.md`
- **Requisitos:** REQ-2501

## ENT-P-view-0003 — view.zoomIn pela porta toolbar-status-bar-zoom-in
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:64` `"kind": "toolbar",`
- **Comando:** view.zoomIn
- **Porta:** `manifest/commands/view.json:63` `"id": "toolbar-status-bar-zoom-in",`
- **Tratador:** `src/app/commands.ts:439` `'view.zoomIn': zoomIn,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0003.md`
- **Requisitos:** REQ-2501

## ENT-P-view-0004 — view.zoomIn pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/view.json:86` `"kind": "command-bar",`
- **Comando:** view.zoomIn
- **Porta:** `manifest/commands/view.json:85` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:439` `'view.zoomIn': zoomIn,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0004.md`
- **Requisitos:** REQ-2501

## ENT-P-view-0005 — view.zoomOut pela porta key-ctrl-minus-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:127` `"kind": "shortcut",`
- **Comando:** view.zoomOut
- **Porta:** `manifest/commands/view.json:126` `"id": "key-ctrl-minus-in-global",`
- **Gatilho:** `manifest/commands/view.json:129` `"chord": "Ctrl+-",`
- **Tratador:** `src/app/commands.ts:440` `'view.zoomOut': zoomOut,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0005.md`
- **Requisitos:** REQ-2502

## ENT-P-view-0006 — view.zoomOut pela porta toolbar-status-bar-zoom-out
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:147` `"kind": "toolbar",`
- **Comando:** view.zoomOut
- **Porta:** `manifest/commands/view.json:146` `"id": "toolbar-status-bar-zoom-out",`
- **Tratador:** `src/app/commands.ts:440` `'view.zoomOut': zoomOut,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0006.md`
- **Requisitos:** REQ-2502

## ENT-P-view-0007 — view.zoomOut pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/view.json:169` `"kind": "command-bar",`
- **Comando:** view.zoomOut
- **Porta:** `manifest/commands/view.json:168` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:440` `'view.zoomOut': zoomOut,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0007.md`
- **Requisitos:** REQ-2502

## ENT-P-view-0008 — view.zoomReset pela porta key-ctrl-0-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:208` `"kind": "shortcut",`
- **Comando:** view.zoomReset
- **Porta:** `manifest/commands/view.json:207` `"id": "key-ctrl-0-in-global",`
- **Gatilho:** `manifest/commands/view.json:210` `"chord": "Ctrl+0",`
- **Tratador:** `src/app/commands.ts:441` `'view.zoomReset': zoomReset,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0008.md`
- **Requisitos:** REQ-2503

## ENT-P-view-0009 — view.zoomReset pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/view.json:228` `"kind": "command-bar",`
- **Comando:** view.zoomReset
- **Porta:** `manifest/commands/view.json:227` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:441` `'view.zoomReset': zoomReset,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0009.md`
- **Requisitos:** REQ-2503

## ENT-P-view-0010 — view.zoomTo pela porta menu-zoom-10
- **Tipo:** comando-porta menu `manifest/commands/view.json:274` `"kind": "menu",`
- **Comando:** view.zoomTo
- **Porta:** `manifest/commands/view.json:273` `"id": "menu-zoom-10",`
- **Tratador:** `src/app/commands.ts:442` `'view.zoomTo': zoomToLevel,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0010.md`
- **Requisitos:** REQ-2504

## ENT-P-view-0011 — view.zoomTo pela porta menu-zoom-25
- **Tipo:** comando-porta menu `manifest/commands/view.json:298` `"kind": "menu",`
- **Comando:** view.zoomTo
- **Porta:** `manifest/commands/view.json:297` `"id": "menu-zoom-25",`
- **Tratador:** `src/app/commands.ts:442` `'view.zoomTo': zoomToLevel,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0011.md`
- **Requisitos:** REQ-2504

## ENT-P-view-0012 — view.zoomTo pela porta menu-zoom-50
- **Tipo:** comando-porta menu `manifest/commands/view.json:322` `"kind": "menu",`
- **Comando:** view.zoomTo
- **Porta:** `manifest/commands/view.json:321` `"id": "menu-zoom-50",`
- **Tratador:** `src/app/commands.ts:442` `'view.zoomTo': zoomToLevel,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0012.md`
- **Requisitos:** REQ-2504

## ENT-P-view-0013 — view.zoomTo pela porta menu-zoom-100
- **Tipo:** comando-porta menu `manifest/commands/view.json:346` `"kind": "menu",`
- **Comando:** view.zoomTo
- **Porta:** `manifest/commands/view.json:345` `"id": "menu-zoom-100",`
- **Tratador:** `src/app/commands.ts:442` `'view.zoomTo': zoomToLevel,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0013.md`
- **Requisitos:** REQ-2504

## ENT-P-view-0014 — view.zoomTo pela porta menu-zoom-200
- **Tipo:** comando-porta menu `manifest/commands/view.json:370` `"kind": "menu",`
- **Comando:** view.zoomTo
- **Porta:** `manifest/commands/view.json:369` `"id": "menu-zoom-200",`
- **Tratador:** `src/app/commands.ts:442` `'view.zoomTo': zoomToLevel,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0014.md`
- **Requisitos:** REQ-2504

## ENT-P-view-0015 — view.zoomTo pela porta menu-zoom-400
- **Tipo:** comando-porta menu `manifest/commands/view.json:394` `"kind": "menu",`
- **Comando:** view.zoomTo
- **Porta:** `manifest/commands/view.json:393` `"id": "menu-zoom-400",`
- **Tratador:** `src/app/commands.ts:442` `'view.zoomTo': zoomToLevel,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0015.md`
- **Requisitos:** REQ-2504

## ENT-P-view-0016 — view.zoomTo pela porta menu-zoom-800
- **Tipo:** comando-porta menu `manifest/commands/view.json:418` `"kind": "menu",`
- **Comando:** view.zoomTo
- **Porta:** `manifest/commands/view.json:417` `"id": "menu-zoom-800",`
- **Tratador:** `src/app/commands.ts:442` `'view.zoomTo': zoomToLevel,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0016.md`
- **Requisitos:** REQ-2504

## ENT-P-view-0017 — view.zoomFit pela porta key-shift-1-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:460` `"kind": "shortcut",`
- **Comando:** view.zoomFit
- **Porta:** `manifest/commands/view.json:459` `"id": "key-shift-1-in-global",`
- **Gatilho:** `manifest/commands/view.json:462` `"chord": "Shift+1",`
- **Tratador:** `src/app/commands.ts:443` `'view.zoomFit': zoomFit,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0017.md`
- **Requisitos:** REQ-2505

## ENT-P-view-0018 — view.zoomFit pela porta toolbar-status-bar-fit
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:480` `"kind": "toolbar",`
- **Comando:** view.zoomFit
- **Porta:** `manifest/commands/view.json:479` `"id": "toolbar-status-bar-fit",`
- **Tratador:** `src/app/commands.ts:443` `'view.zoomFit': zoomFit,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0018.md`
- **Requisitos:** REQ-2505

## ENT-P-view-0019 — view.zoomFit pela porta menu-zoom
- **Tipo:** comando-porta menu `manifest/commands/view.json:502` `"kind": "menu",`
- **Comando:** view.zoomFit
- **Porta:** `manifest/commands/view.json:501` `"id": "menu-zoom",`
- **Tratador:** `src/app/commands.ts:443` `'view.zoomFit': zoomFit,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0019.md`
- **Requisitos:** REQ-2505

## ENT-P-view-0020 — view.zoomFit pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/view.json:524` `"kind": "command-bar",`
- **Comando:** view.zoomFit
- **Porta:** `manifest/commands/view.json:523` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:443` `'view.zoomFit': zoomFit,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0020.md`
- **Requisitos:** REQ-2505

## ENT-P-view-0021 — view.zoomAt pela porta canvas-wheel-ctrl
- **Tipo:** comando-porta canvas-wheel `manifest/commands/view.json:576` `"kind": "canvas-wheel",`
- **Comando:** view.zoomAt
- **Porta:** `manifest/commands/view.json:575` `"id": "canvas-wheel-ctrl",`
- **Gatilho:** `manifest/commands/view.json:579` `"gesture": "wheel",`
- **Tratador:** `src/app/commands.ts:444` `'view.zoomAt': zoomAt,`
- **Início:** `src/editor/input/pointer/tools.ts:57` `if ('factor' in entry.command.args) p.dispatchPan(entry, { factor: Math.exp(-dy * WHEEL_FACTOR), point: { x: event.clientX, y: event.clientY } });`
- **Fluxo:** `fluxos/ENT-P-view-0021.md`
- **Requisitos:** REQ-2506

## ENT-P-view-0022 — view.pan pela porta canvas-wheel
- **Tipo:** comando-porta canvas-wheel `manifest/commands/view.json:624` `"kind": "canvas-wheel",`
- **Comando:** view.pan
- **Porta:** `manifest/commands/view.json:623` `"id": "canvas-wheel",`
- **Gatilho:** `manifest/commands/view.json:627` `"gesture": "wheel",`
- **Tratador:** `src/app/commands.ts:445` `'view.pan': pan,`
- **Início:** `src/editor/input/pointer/tools.ts:59` `else p.dispatchPan(entry, { dx: -dx, dy: -dy });`
- **Fluxo:** `fluxos/ENT-P-view-0022.md`
- **Requisitos:** REQ-2507

## ENT-P-view-0023 — view.pan pela porta canvas-wheel-shift
- **Tipo:** comando-porta canvas-wheel `manifest/commands/view.json:643` `"kind": "canvas-wheel",`
- **Comando:** view.pan
- **Porta:** `manifest/commands/view.json:642` `"id": "canvas-wheel-shift",`
- **Gatilho:** `manifest/commands/view.json:646` `"gesture": "wheel",`
- **Tratador:** `src/app/commands.ts:445` `'view.pan': pan,`
- **Início:** `src/editor/input/pointer/tools.ts:58` `else if (modifier === 'Shift') p.dispatchPan(entry, { dx: -(dx !== 0 ? dx : dy), dy: 0 });`
- **Fluxo:** `fluxos/ENT-P-view-0023.md`
- **Requisitos:** REQ-2507

## ENT-P-view-0024 — view.pan pela porta canvas-drag-space-held-stage
- **Tipo:** comando-porta canvas-drag `manifest/commands/view.json:662` `"kind": "canvas-drag",`
- **Comando:** view.pan
- **Porta:** `manifest/commands/view.json:661` `"id": "canvas-drag-space-held-stage",`
- **Gatilho:** `manifest/commands/view.json:664` `"source": "space-held",` ; `manifest/commands/view.json:665` `"zone": "stage",` ; `manifest/commands/view.json:666` `"gesture": "space-pan",`
- **Tratador:** `src/app/commands.ts:445` `'view.pan': pan,`
- **Início:** `src/editor/input/pointer/events.ts:391` `p.dispatchPan(shared.panning.entry, { dx, dy });`
- **Fluxo:** `fluxos/ENT-P-view-0024.md`
- **Requisitos:** REQ-2507

## ENT-P-view-0025 — view.pan pela porta canvas-drag-middle-button-stage
- **Tipo:** comando-porta canvas-drag `manifest/commands/view.json:682` `"kind": "canvas-drag",`
- **Comando:** view.pan
- **Porta:** `manifest/commands/view.json:681` `"id": "canvas-drag-middle-button-stage",`
- **Gatilho:** `manifest/commands/view.json:684` `"source": "middle-button",` ; `manifest/commands/view.json:685` `"zone": "stage",` ; `manifest/commands/view.json:686` `"gesture": "space-pan",`
- **Tratador:** `src/app/commands.ts:445` `'view.pan': pan,`
- **Início:** `src/editor/input/pointer/events.ts:391` `p.dispatchPan(shared.panning.entry, { dx, dy });`
- **Fluxo:** `fluxos/ENT-P-view-0025.md`
- **Requisitos:** REQ-2507

## ENT-P-view-0026 — view.setBreakpoint pela porta toolbar-breakpoint-tabs-desktop
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:729` `"kind": "toolbar",`
- **Comando:** view.setBreakpoint
- **Porta:** `manifest/commands/view.json:728` `"id": "toolbar-breakpoint-tabs-desktop",`
- **Tratador:** `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0026.md`
- **Requisitos:** REQ-2508

## ENT-P-view-0027 — view.setBreakpoint pela porta toolbar-breakpoint-tabs-laptop
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:753` `"kind": "toolbar",`
- **Comando:** view.setBreakpoint
- **Porta:** `manifest/commands/view.json:752` `"id": "toolbar-breakpoint-tabs-laptop",`
- **Tratador:** `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0027.md`
- **Requisitos:** REQ-2508

## ENT-P-view-0028 — view.setBreakpoint pela porta toolbar-breakpoint-tabs-tablet
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:777` `"kind": "toolbar",`
- **Comando:** view.setBreakpoint
- **Porta:** `manifest/commands/view.json:776` `"id": "toolbar-breakpoint-tabs-tablet",`
- **Tratador:** `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0028.md`
- **Requisitos:** REQ-2508

## ENT-P-view-0029 — view.setBreakpoint pela porta toolbar-breakpoint-tabs-phone
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:801` `"kind": "toolbar",`
- **Comando:** view.setBreakpoint
- **Porta:** `manifest/commands/view.json:800` `"id": "toolbar-breakpoint-tabs-phone",`
- **Tratador:** `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0029.md`
- **Requisitos:** REQ-2508

## ENT-P-view-0030 — view.setBreakpoint pela porta toolbar-breakpoint-tabs-project
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:825` `"kind": "toolbar",`
- **Comando:** view.setBreakpoint
- **Porta:** `manifest/commands/view.json:824` `"id": "toolbar-breakpoint-tabs-project",`
- **Tratador:** `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0030.md`
- **Requisitos:** REQ-2508

## ENT-P-view-0031 — view.setBreakpoint pela porta toolbar-preview-bar-desktop
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:847` `"kind": "toolbar",`
- **Comando:** view.setBreakpoint
- **Porta:** `manifest/commands/view.json:846` `"id": "toolbar-preview-bar-desktop",`
- **Tratador:** `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0031.md`
- **Requisitos:** REQ-2508

## ENT-P-view-0032 — view.setBreakpoint pela porta toolbar-preview-bar-laptop
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:871` `"kind": "toolbar",`
- **Comando:** view.setBreakpoint
- **Porta:** `manifest/commands/view.json:870` `"id": "toolbar-preview-bar-laptop",`
- **Tratador:** `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0032.md`
- **Requisitos:** REQ-2508

## ENT-P-view-0033 — view.setBreakpoint pela porta toolbar-preview-bar-tablet
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:895` `"kind": "toolbar",`
- **Comando:** view.setBreakpoint
- **Porta:** `manifest/commands/view.json:894` `"id": "toolbar-preview-bar-tablet",`
- **Tratador:** `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0033.md`
- **Requisitos:** REQ-2508

## ENT-P-view-0034 — view.setBreakpoint pela porta toolbar-preview-bar-phone
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:919` `"kind": "toolbar",`
- **Comando:** view.setBreakpoint
- **Porta:** `manifest/commands/view.json:918` `"id": "toolbar-preview-bar-phone",`
- **Tratador:** `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0034.md`
- **Requisitos:** REQ-2508

## ENT-P-view-0035 — view.setBreakpoint pela porta toolbar-preview-bar-project
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:943` `"kind": "toolbar",`
- **Comando:** view.setBreakpoint
- **Porta:** `manifest/commands/view.json:942` `"id": "toolbar-preview-bar-project",`
- **Tratador:** `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0035.md`
- **Requisitos:** REQ-2508

## ENT-P-view-0036 — view.setBreakpoint pela porta side-by-side-frame
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:965` `"kind": "toolbar",`
- **Comando:** view.setBreakpoint
- **Porta:** `manifest/commands/view.json:964` `"id": "side-by-side-frame",`
- **Tratador:** `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0036.md`
- **Requisitos:** REQ-2508

## ENT-P-view-0037 — view.setEditorView pela porta toolbar-canvas-toolbar-canvas
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:1015` `"kind": "toolbar",`
- **Comando:** view.setEditorView
- **Porta:** `manifest/commands/view.json:1014` `"id": "toolbar-canvas-toolbar-canvas",`
- **Tratador:** `src/app/commands.ts:455` `'view.setEditorView': setEditorView,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0037.md`
- **Requisitos:** REQ-2509

## ENT-P-view-0038 — view.setEditorView pela porta toolbar-canvas-toolbar-split
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:1039` `"kind": "toolbar",`
- **Comando:** view.setEditorView
- **Porta:** `manifest/commands/view.json:1038` `"id": "toolbar-canvas-toolbar-split",`
- **Tratador:** `src/app/commands.ts:455` `'view.setEditorView': setEditorView,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0038.md`
- **Requisitos:** REQ-2509

## ENT-P-view-0039 — view.setEditorView pela porta toolbar-canvas-toolbar-code
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:1063` `"kind": "toolbar",`
- **Comando:** view.setEditorView
- **Porta:** `manifest/commands/view.json:1062` `"id": "toolbar-canvas-toolbar-code",`
- **Tratador:** `src/app/commands.ts:455` `'view.setEditorView': setEditorView,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0039.md`
- **Requisitos:** REQ-2509

## ENT-P-view-0040 — view.setEditorView pela porta menu-view-code
- **Tipo:** comando-porta menu `manifest/commands/view.json:1087` `"kind": "menu",`
- **Comando:** view.setEditorView
- **Porta:** `manifest/commands/view.json:1086` `"id": "menu-view-code",`
- **Tratador:** `src/app/commands.ts:455` `'view.setEditorView': setEditorView,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0040.md`
- **Requisitos:** REQ-2509

## ENT-P-view-0041 — view.setStyleState pela porta menu-style-state-base
- **Tipo:** comando-porta menu `manifest/commands/view.json:1138` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1137` `"id": "menu-style-state-base",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0041.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0042 — view.setStyleState pela porta menu-style-state-hover
- **Tipo:** comando-porta menu `manifest/commands/view.json:1162` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1161` `"id": "menu-style-state-hover",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0042.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0043 — view.setStyleState pela porta menu-style-state-focus
- **Tipo:** comando-porta menu `manifest/commands/view.json:1186` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1185` `"id": "menu-style-state-focus",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0043.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0044 — view.setStyleState pela porta menu-style-state-active
- **Tipo:** comando-porta menu `manifest/commands/view.json:1210` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1209` `"id": "menu-style-state-active",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0044.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0045 — view.setStyleState pela porta menu-style-state-disabled
- **Tipo:** comando-porta menu `manifest/commands/view.json:1234` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1233` `"id": "menu-style-state-disabled",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0045.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0046 — view.setStyleState pela porta menu-style-state-invalid
- **Tipo:** comando-porta menu `manifest/commands/view.json:1258` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1257` `"id": "menu-style-state-invalid",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0046.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0047 — view.setStyleState pela porta menu-style-state-placeholder-shown
- **Tipo:** comando-porta menu `manifest/commands/view.json:1282` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1281` `"id": "menu-style-state-placeholder-shown",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0047.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0048 — view.setStyleState pela porta menu-style-state-focus-visible
- **Tipo:** comando-porta menu `manifest/commands/view.json:1306` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1305` `"id": "menu-style-state-focus-visible",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0048.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0049 — view.setStyleState pela porta menu-style-state-visited
- **Tipo:** comando-porta menu `manifest/commands/view.json:1330` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1329` `"id": "menu-style-state-visited",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0049.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0050 — view.setStyleState pela porta menu-style-state-first-child
- **Tipo:** comando-porta menu `manifest/commands/view.json:1354` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1353` `"id": "menu-style-state-first-child",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0050.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0051 — view.setStyleState pela porta menu-style-state-last-child
- **Tipo:** comando-porta menu `manifest/commands/view.json:1378` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1377` `"id": "menu-style-state-last-child",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0051.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0052 — view.setStyleState pela porta menu-style-state-before
- **Tipo:** comando-porta menu `manifest/commands/view.json:1402` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1401` `"id": "menu-style-state-before",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0052.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0053 — view.setStyleState pela porta menu-style-state-after
- **Tipo:** comando-porta menu `manifest/commands/view.json:1426` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1425` `"id": "menu-style-state-after",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0053.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0054 — view.setStyleState pela porta menu-style-state-user-invalid
- **Tipo:** comando-porta menu `manifest/commands/view.json:1450` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1449` `"id": "menu-style-state-user-invalid",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0054.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0055 — view.setStyleState pela porta menu-style-state-user-valid
- **Tipo:** comando-porta menu `manifest/commands/view.json:1474` `"kind": "menu",`
- **Comando:** view.setStyleState
- **Porta:** `manifest/commands/view.json:1473` `"id": "menu-style-state-user-valid",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0055.md`
- **Requisitos:** REQ-2510

## ENT-P-view-0056 — view.enterPreview pela porta key-ctrl-p-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:1516` `"kind": "shortcut",`
- **Comando:** view.enterPreview
- **Porta:** `manifest/commands/view.json:1515` `"id": "key-ctrl-p-in-global",`
- **Gatilho:** `manifest/commands/view.json:1518` `"chord": "Ctrl+P",`
- **Tratador:** `src/app/commands.ts:457` `'view.enterPreview': enterPreview,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0056.md`
- **Requisitos:** REQ-2511

## ENT-P-view-0057 — view.enterPreview pela porta key-ctrl-enter-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:1536` `"kind": "shortcut",`
- **Comando:** view.enterPreview
- **Porta:** `manifest/commands/view.json:1535` `"id": "key-ctrl-enter-in-global",`
- **Gatilho:** `manifest/commands/view.json:1538` `"chord": "Ctrl+Enter",`
- **Tratador:** `src/app/commands.ts:457` `'view.enterPreview': enterPreview,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0057.md`
- **Requisitos:** REQ-2511

## ENT-P-view-0058 — view.enterPreview pela porta toolbar-top-bar-preview
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:1556` `"kind": "toolbar",`
- **Comando:** view.enterPreview
- **Porta:** `manifest/commands/view.json:1555` `"id": "toolbar-top-bar-preview",`
- **Tratador:** `src/app/commands.ts:457` `'view.enterPreview': enterPreview,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0058.md`
- **Requisitos:** REQ-2511

## ENT-P-view-0059 — view.enterPreview pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/view.json:1578` `"kind": "command-bar",`
- **Comando:** view.enterPreview
- **Porta:** `manifest/commands/view.json:1577` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:457` `'view.enterPreview': enterPreview,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0059.md`
- **Requisitos:** REQ-2511

## ENT-P-view-0060 — view.exitPreview pela porta key-escape-in-preview
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:1617` `"kind": "shortcut",`
- **Comando:** view.exitPreview
- **Porta:** `manifest/commands/view.json:1616` `"id": "key-escape-in-preview",`
- **Gatilho:** `manifest/commands/view.json:1619` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:458` `'view.exitPreview': exitPreview,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0060.md`
- **Requisitos:** REQ-2512

## ENT-P-view-0061 — view.exitPreview pela porta key-ctrl-enter-in-preview
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:1637` `"kind": "shortcut",`
- **Comando:** view.exitPreview
- **Porta:** `manifest/commands/view.json:1636` `"id": "key-ctrl-enter-in-preview",`
- **Gatilho:** `manifest/commands/view.json:1639` `"chord": "Ctrl+Enter",`
- **Tratador:** `src/app/commands.ts:458` `'view.exitPreview': exitPreview,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0061.md`
- **Requisitos:** REQ-2512

## ENT-P-view-0062 — view.exitPreview pela porta toolbar-preview-bar-exit
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:1657` `"kind": "toolbar",`
- **Comando:** view.exitPreview
- **Porta:** `manifest/commands/view.json:1656` `"id": "toolbar-preview-bar-exit",`
- **Tratador:** `src/app/commands.ts:458` `'view.exitPreview': exitPreview,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0062.md`
- **Requisitos:** REQ-2512

## ENT-P-view-0063 — view.toggleOutlines pela porta canvas-tools-outlines
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:1697` `"kind": "panel-control",`
- **Comando:** view.toggleOutlines
- **Porta:** `manifest/commands/view.json:1696` `"id": "canvas-tools-outlines",`
- **Tratador:** `src/app/commands.ts:459` `'view.toggleOutlines': toggleOutlines,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0063.md`
- **Requisitos:** REQ-2513

## ENT-P-view-0064 — view.toggleZones pela porta canvas-tools-zones
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:1741` `"kind": "panel-control",`
- **Comando:** view.toggleZones
- **Porta:** `manifest/commands/view.json:1740` `"id": "canvas-tools-zones",`
- **Tratador:** `src/app/commands.ts:460` `'view.toggleZones': toggleZones,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0064.md`
- **Requisitos:** REQ-2514

## ENT-P-view-0065 — view.toggleRulers pela porta guides-grids-rulers
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:1785` `"kind": "panel-control",`
- **Comando:** view.toggleRulers
- **Porta:** `manifest/commands/view.json:1784` `"id": "guides-grids-rulers",`
- **Tratador:** `src/app/commands.ts:461` `'view.toggleRulers': toggleRulers,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0065.md`
- **Requisitos:** REQ-2515

## ENT-P-view-0066 — view.toggleSmartGuides pela porta guides-grids-smart-guides
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:1829` `"kind": "panel-control",`
- **Comando:** view.toggleSmartGuides
- **Porta:** `manifest/commands/view.json:1828` `"id": "guides-grids-smart-guides",`
- **Tratador:** `src/app/commands.ts:462` `'view.toggleSmartGuides': toggleSmartGuides,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0066.md`
- **Requisitos:** REQ-2516

## ENT-P-view-0067 — view.toggleEqualSpacing pela porta guides-grids-equal-spacing
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:1873` `"kind": "panel-control",`
- **Comando:** view.toggleEqualSpacing
- **Porta:** `manifest/commands/view.json:1872` `"id": "guides-grids-equal-spacing",`
- **Tratador:** `src/app/commands.ts:463` `'view.toggleEqualSpacing': toggleEqualSpacing,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0067.md`
- **Requisitos:** REQ-2517

## ENT-P-view-0068 — grid.toggleColumns pela porta key-ctrl-quote-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:1921` `"kind": "shortcut",`
- **Comando:** grid.toggleColumns
- **Porta:** `manifest/commands/view.json:1920` `"id": "key-ctrl-quote-in-global",`
- **Gatilho:** `manifest/commands/view.json:1923` `"chord": "Ctrl+'",`
- **Tratador:** `src/app/commands.ts:464` `'grid.toggleColumns': toggleColumns,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0068.md`
- **Requisitos:** REQ-2518

## ENT-P-view-0069 — grid.toggleColumns pela porta canvas-tools-column-grid
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:1941` `"kind": "panel-control",`
- **Comando:** grid.toggleColumns
- **Porta:** `manifest/commands/view.json:1940` `"id": "canvas-tools-column-grid",`
- **Tratador:** `src/app/commands.ts:464` `'grid.toggleColumns': toggleColumns,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0069.md`
- **Requisitos:** REQ-2518

## ENT-P-view-0070 — grid.toggleColumns pela porta guides-grids-column-grid
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:1967` `"kind": "panel-control",`
- **Comando:** grid.toggleColumns
- **Porta:** `manifest/commands/view.json:1966` `"id": "guides-grids-column-grid",`
- **Tratador:** `src/app/commands.ts:464` `'grid.toggleColumns': toggleColumns,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0070.md`
- **Requisitos:** REQ-2518

## ENT-P-view-0071 — grid.toggleRows pela porta canvas-tools-row-grid
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:2015` `"kind": "panel-control",`
- **Comando:** grid.toggleRows
- **Porta:** `manifest/commands/view.json:2014` `"id": "canvas-tools-row-grid",`
- **Tratador:** `src/app/commands.ts:465` `'grid.toggleRows': toggleRows,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0071.md`
- **Requisitos:** REQ-2519

## ENT-P-view-0072 — grid.toggleRows pela porta guides-grids-row-grid
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:2041` `"kind": "panel-control",`
- **Comando:** grid.toggleRows
- **Porta:** `manifest/commands/view.json:2040` `"id": "guides-grids-row-grid",`
- **Tratador:** `src/app/commands.ts:465` `'grid.toggleRows': toggleRows,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0072.md`
- **Requisitos:** REQ-2519

## ENT-P-view-0073 — grid.toggleDots pela porta canvas-tools-dot-grid
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:2089` `"kind": "panel-control",`
- **Comando:** grid.toggleDots
- **Porta:** `manifest/commands/view.json:2088` `"id": "canvas-tools-dot-grid",`
- **Tratador:** `src/app/commands.ts:466` `'grid.toggleDots': toggleDots,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0073.md`
- **Requisitos:** REQ-2520

## ENT-P-view-0074 — grid.toggleDots pela porta guides-grids-dot-grid
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:2115` `"kind": "panel-control",`
- **Comando:** grid.toggleDots
- **Porta:** `manifest/commands/view.json:2114` `"id": "guides-grids-dot-grid",`
- **Tratador:** `src/app/commands.ts:466` `'grid.toggleDots': toggleDots,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0074.md`
- **Requisitos:** REQ-2520

## ENT-P-view-0075 — grid.toggleFolds pela porta guides-grids-fold-lines
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:2163` `"kind": "panel-control",`
- **Comando:** grid.toggleFolds
- **Porta:** `manifest/commands/view.json:2162` `"id": "guides-grids-fold-lines",`
- **Tratador:** `src/app/commands.ts:467` `'grid.toggleFolds': toggleFolds,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0075.md`
- **Requisitos:** REQ-2521

## ENT-P-view-0076 — grid.setSettings pela porta guides-grids-columns-settings
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:2240` `"kind": "panel-control",`
- **Comando:** grid.setSettings
- **Porta:** `manifest/commands/view.json:2239` `"id": "guides-grids-columns-settings",`
- **Tratador:** `src/app/commands.ts:468` `'grid.setSettings': setGridSettings,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0076.md`
- **Requisitos:** REQ-2522

## ENT-P-view-0077 — grid.setSettings pela porta guides-grids-rows-settings
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:2268` `"kind": "panel-control",`
- **Comando:** grid.setSettings
- **Porta:** `manifest/commands/view.json:2267` `"id": "guides-grids-rows-settings",`
- **Tratador:** `src/app/commands.ts:468` `'grid.setSettings': setGridSettings,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0077.md`
- **Requisitos:** REQ-2522

## ENT-P-view-0078 — grid.setSettings pela porta guides-grids-dots-settings
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:2296` `"kind": "panel-control",`
- **Comando:** grid.setSettings
- **Porta:** `manifest/commands/view.json:2295` `"id": "guides-grids-dots-settings",`
- **Tratador:** `src/app/commands.ts:468` `'grid.setSettings': setGridSettings,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0078.md`
- **Requisitos:** REQ-2522

## ENT-P-view-0079 — guides.create pela porta canvas-drag-top-ruler-page
- **Tipo:** comando-porta canvas-drag `manifest/commands/view.json:2362` `"kind": "canvas-drag",`
- **Comando:** guides.create
- **Porta:** `manifest/commands/view.json:2361` `"id": "canvas-drag-top-ruler-page",`
- **Gatilho:** `manifest/commands/view.json:2364` `"source": "top-ruler",` ; `manifest/commands/view.json:2365` `"zone": "page",` ; `manifest/commands/view.json:2366` `"gesture": "guide-drag",`
- **Tratador:** `src/app/commands.ts:469` `'guides.create': createGuideCommand,`
- **Início:** `src/editor/input/pointer/events.ts:343` `ps.guiding.gesture.dispatch(create.command.id as CommandId, { ...create.door.args, axis: ps.guiding.axis, at } as never);`
- **Fluxo:** `fluxos/ENT-P-view-0079.md`
- **Requisitos:** REQ-2523

## ENT-P-view-0080 — guides.create pela porta canvas-drag-left-ruler-page
- **Tipo:** comando-porta canvas-drag `manifest/commands/view.json:2382` `"kind": "canvas-drag",`
- **Comando:** guides.create
- **Porta:** `manifest/commands/view.json:2381` `"id": "canvas-drag-left-ruler-page",`
- **Gatilho:** `manifest/commands/view.json:2384` `"source": "left-ruler",` ; `manifest/commands/view.json:2385` `"zone": "page",` ; `manifest/commands/view.json:2386` `"gesture": "guide-drag",`
- **Tratador:** `src/app/commands.ts:469` `'guides.create': createGuideCommand,`
- **Início:** `src/editor/input/pointer/events.ts:343` `ps.guiding.gesture.dispatch(create.command.id as CommandId, { ...create.door.args, axis: ps.guiding.axis, at } as never);`
- **Fluxo:** `fluxos/ENT-P-view-0080.md`
- **Requisitos:** REQ-2523

## ENT-P-view-0081 — guides.create pela porta guides-grids-add-guide
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:2402` `"kind": "panel-control",`
- **Comando:** guides.create
- **Porta:** `manifest/commands/view.json:2401` `"id": "guides-grids-add-guide",`
- **Tratador:** `src/app/commands.ts:469` `'guides.create': createGuideCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0081.md`
- **Requisitos:** REQ-2523

## ENT-P-view-0082 — guides.move pela porta canvas-drag-guide-page
- **Tipo:** comando-porta canvas-drag `manifest/commands/view.json:2484` `"kind": "canvas-drag",`
- **Comando:** guides.move
- **Porta:** `manifest/commands/view.json:2483` `"id": "canvas-drag-guide-page",`
- **Gatilho:** `manifest/commands/view.json:2486` `"source": "guide",` ; `manifest/commands/view.json:2487` `"zone": "page",` ; `manifest/commands/view.json:2488` `"gesture": "guide-drag",`
- **Tratador:** `src/app/commands.ts:470` `'guides.move': moveGuideCommand,`
- **Início:** `src/editor/input/pointer/events.ts:345` `} else if (ps.guiding.guide !== null && GUIDE_MOVE !== null) ps.guiding.gesture.dispatch(GUIDE_MOVE.command.id as CommandId, { ...GUIDE_MOVE.door.args, guide: ps.guiding.guide, at } as never);`
- **Fluxo:** `fluxos/ENT-P-view-0082.md`
- **Requisitos:** REQ-2524

## ENT-P-view-0083 — guides.move pela porta key-arrow-up-in-guide
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:2504` `"kind": "shortcut",`
- **Comando:** guides.move
- **Porta:** `manifest/commands/view.json:2503` `"id": "key-arrow-up-in-guide",`
- **Gatilho:** `manifest/commands/view.json:2506` `"chord": "ArrowUp",`
- **Tratador:** `src/app/commands.ts:470` `'guides.move': moveGuideCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0083.md`
- **Requisitos:** REQ-2524

## ENT-P-view-0084 — guides.move pela porta key-arrow-down-in-guide
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:2527` `"kind": "shortcut",`
- **Comando:** guides.move
- **Porta:** `manifest/commands/view.json:2526` `"id": "key-arrow-down-in-guide",`
- **Gatilho:** `manifest/commands/view.json:2529` `"chord": "ArrowDown",`
- **Tratador:** `src/app/commands.ts:470` `'guides.move': moveGuideCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0084.md`
- **Requisitos:** REQ-2524

## ENT-P-view-0085 — guides.move pela porta key-arrow-left-in-guide
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:2550` `"kind": "shortcut",`
- **Comando:** guides.move
- **Porta:** `manifest/commands/view.json:2549` `"id": "key-arrow-left-in-guide",`
- **Gatilho:** `manifest/commands/view.json:2552` `"chord": "ArrowLeft",`
- **Tratador:** `src/app/commands.ts:470` `'guides.move': moveGuideCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0085.md`
- **Requisitos:** REQ-2524

## ENT-P-view-0086 — guides.move pela porta key-arrow-right-in-guide
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:2573` `"kind": "shortcut",`
- **Comando:** guides.move
- **Porta:** `manifest/commands/view.json:2572` `"id": "key-arrow-right-in-guide",`
- **Gatilho:** `manifest/commands/view.json:2575` `"chord": "ArrowRight",`
- **Tratador:** `src/app/commands.ts:470` `'guides.move': moveGuideCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0086.md`
- **Requisitos:** REQ-2524

## ENT-P-view-0087 — guides.delete pela porta canvas-drag-guide-own-ruler
- **Tipo:** comando-porta canvas-drag `manifest/commands/view.json:2625` `"kind": "canvas-drag",`
- **Comando:** guides.delete
- **Porta:** `manifest/commands/view.json:2624` `"id": "canvas-drag-guide-own-ruler",`
- **Gatilho:** `manifest/commands/view.json:2627` `"source": "guide",` ; `manifest/commands/view.json:2628` `"zone": "own-ruler",` ; `manifest/commands/view.json:2629` `"gesture": "guide-drag",`
- **Tratador:** `src/app/commands.ts:471` `'guides.delete': deleteGuideCommand,`
- **Início:** `src/editor/input/pointer/events.ts:491` `if (dropped && guide !== null && GUIDE_DELETE !== null) gesture.dispatch(GUIDE_DELETE.command.id as CommandId, { ...GUIDE_DELETE.door.args, guide } as never);`
- **Fluxo:** `fluxos/ENT-P-view-0087.md`
- **Requisitos:** REQ-2525

## ENT-P-view-0088 — guides.delete pela porta key-delete-in-guide
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:2645` `"kind": "shortcut",`
- **Comando:** guides.delete
- **Porta:** `manifest/commands/view.json:2644` `"id": "key-delete-in-guide",`
- **Gatilho:** `manifest/commands/view.json:2647` `"chord": "Delete",`
- **Tratador:** `src/app/commands.ts:471` `'guides.delete': deleteGuideCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0088.md`
- **Requisitos:** REQ-2525

## ENT-P-view-0089 — guides.delete pela porta key-backspace-in-guide
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:2665` `"kind": "shortcut",`
- **Comando:** guides.delete
- **Porta:** `manifest/commands/view.json:2664` `"id": "key-backspace-in-guide",`
- **Gatilho:** `manifest/commands/view.json:2667` `"chord": "Backspace",`
- **Tratador:** `src/app/commands.ts:471` `'guides.delete': deleteGuideCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0089.md`
- **Requisitos:** REQ-2525

## ENT-P-view-0090 — guides.delete pela porta guides-grids-remove-guide
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:2685` `"kind": "panel-control",`
- **Comando:** guides.delete
- **Porta:** `manifest/commands/view.json:2684` `"id": "guides-grids-remove-guide",`
- **Tratador:** `src/app/commands.ts:471` `'guides.delete': deleteGuideCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0090.md`
- **Requisitos:** REQ-2525

## ENT-P-view-0091 — guides.toggleLock pela porta key-l-in-guide
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:2740` `"kind": "shortcut",`
- **Comando:** guides.toggleLock
- **Porta:** `manifest/commands/view.json:2739` `"id": "key-l-in-guide",`
- **Gatilho:** `manifest/commands/view.json:2742` `"chord": "L",`
- **Tratador:** `src/app/commands.ts:472` `'guides.toggleLock': toggleGuideLockCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0091.md`
- **Requisitos:** REQ-2526

## ENT-P-view-0092 — guides.toggleVisible pela porta guides-grids-manual-guides
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:2778` `"kind": "panel-control",`
- **Comando:** guides.toggleVisible
- **Porta:** `manifest/commands/view.json:2777` `"id": "guides-grids-manual-guides",`
- **Tratador:** `src/app/commands.ts:473` `'guides.toggleVisible': toggleGuidesVisible,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0092.md`
- **Requisitos:** REQ-2527

## ENT-P-view-0093 — snap.setEnabled pela porta toolbar-canvas-toolbar-snap
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:2832` `"kind": "toolbar",`
- **Comando:** snap.setEnabled
- **Porta:** `manifest/commands/view.json:2831` `"id": "toolbar-canvas-toolbar-snap",`
- **Tratador:** `src/app/commands.ts:474` `'snap.setEnabled': setSnapEnabled,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0093.md`
- **Requisitos:** REQ-2528

## ENT-P-view-0094 — snap.setEnabled pela porta menu-snap-on
- **Tipo:** comando-porta menu `manifest/commands/view.json:2856` `"kind": "menu",`
- **Comando:** snap.setEnabled
- **Porta:** `manifest/commands/view.json:2855` `"id": "menu-snap-on",`
- **Tratador:** `src/app/commands.ts:474` `'snap.setEnabled': setSnapEnabled,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0094.md`
- **Requisitos:** REQ-2528

## ENT-P-view-0095 — snap.setEnabled pela porta menu-snap-off
- **Tipo:** comando-porta menu `manifest/commands/view.json:2880` `"kind": "menu",`
- **Comando:** snap.setEnabled
- **Porta:** `manifest/commands/view.json:2879` `"id": "menu-snap-off",`
- **Tratador:** `src/app/commands.ts:474` `'snap.setEnabled': setSnapEnabled,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0095.md`
- **Requisitos:** REQ-2528

## ENT-P-view-0096 — snap.setSettings pela porta snap-settings-apply
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:2944` `"kind": "panel-control",`
- **Comando:** snap.setSettings
- **Porta:** `manifest/commands/view.json:2943` `"id": "snap-settings-apply",`
- **Tratador:** `src/app/commands.ts:475` `'snap.setSettings': setSnapSettings,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0096.md`
- **Requisitos:** REQ-2529

## ENT-P-view-0097 — workspace.openDialog pela porta menu-view-guides-grids
- **Tipo:** comando-porta menu `manifest/commands/view.json:3001` `"kind": "menu",`
- **Comando:** workspace.openDialog
- **Porta:** `manifest/commands/view.json:3000` `"id": "menu-view-guides-grids",`
- **Tratador:** `src/app/commands.ts:476` `'workspace.openDialog': openDialog,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0097.md`
- **Requisitos:** REQ-2530

## ENT-P-view-0098 — workspace.openDialog pela porta menu-snap-snap-settings
- **Tipo:** comando-porta menu `manifest/commands/view.json:3025` `"kind": "menu",`
- **Comando:** workspace.openDialog
- **Porta:** `manifest/commands/view.json:3024` `"id": "menu-snap-snap-settings",`
- **Tratador:** `src/app/commands.ts:476` `'workspace.openDialog': openDialog,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0098.md`
- **Requisitos:** REQ-2530

## ENT-P-view-0099 — workspace.openDialog pela porta menu-view-breakpoints
- **Tipo:** comando-porta menu `manifest/commands/view.json:3049` `"kind": "menu",`
- **Comando:** workspace.openDialog
- **Porta:** `manifest/commands/view.json:3048` `"id": "menu-view-breakpoints",`
- **Tratador:** `src/app/commands.ts:476` `'workspace.openDialog': openDialog,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0099.md`
- **Requisitos:** REQ-2530

## ENT-P-view-0100 — workspace.openDialog pela porta context-menu-batch-rename
- **Tipo:** comando-porta context-menu `manifest/commands/view.json:3073` `"kind": "context-menu",`
- **Comando:** workspace.openDialog
- **Porta:** `manifest/commands/view.json:3072` `"id": "context-menu-batch-rename",`
- **Tratador:** `src/app/commands.ts:476` `'workspace.openDialog': openDialog,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0100.md`
- **Requisitos:** REQ-2530

## ENT-P-view-0101 — workspace.openDialog pela porta menu-file-capture-url
- **Tipo:** comando-porta menu `manifest/commands/view.json:3095` `"kind": "menu",`
- **Comando:** workspace.openDialog
- **Porta:** `manifest/commands/view.json:3094` `"id": "menu-file-capture-url",`
- **Tratador:** `src/app/commands.ts:476` `'workspace.openDialog': openDialog,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0101.md`
- **Requisitos:** REQ-2530

## ENT-P-view-0102 — view.setViewportWidth pela porta viewport-width
- **Tipo:** comando-porta panel-control `manifest/commands/view.json:3145` `"kind": "panel-control",`
- **Comando:** view.setViewportWidth
- **Porta:** `manifest/commands/view.json:3144` `"id": "viewport-width",`
- **Tratador:** `src/app/commands.ts:447` `'view.setViewportWidth': setViewportWidth,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0102.md`
- **Requisitos:** REQ-2531

## ENT-P-view-0103 — view.resizeViewport pela porta panel-drag-frame-edge
- **Tipo:** comando-porta panel-drag `manifest/commands/view.json:3200` `"kind": "panel-drag",`
- **Comando:** view.resizeViewport
- **Porta:** `manifest/commands/view.json:3199` `"id": "panel-drag-frame-edge",`
- **Gatilho:** `manifest/commands/view.json:3202` `"source": "frame-edge",` ; `manifest/commands/view.json:3203` `"zone": "canvas-stage",` ; `manifest/commands/view.json:3204` `"gesture": "frame-resize",`
- **Tratador:** `src/app/commands.ts:448` `'view.resizeViewport': resizeViewport,`
- **Início:** `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);`
- **Fluxo:** `fluxos/ENT-P-view-0103.md`
- **Requisitos:** REQ-2532

## ENT-P-view-0104 — view.toggleSideBySide pela porta menu-view-side-by-side
- **Tipo:** comando-porta menu `manifest/commands/view.json:3238` `"kind": "menu",`
- **Comando:** view.toggleSideBySide
- **Porta:** `manifest/commands/view.json:3237` `"id": "menu-view-side-by-side",`
- **Tratador:** `src/app/commands.ts:449` `'view.toggleSideBySide': toggleSideBySide,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0104.md`
- **Requisitos:** REQ-2533

## ENT-P-view-0105 — view.selectTool pela porta toolbar-canvas-toolbar-select
- **Tipo:** comando-porta toolbar `manifest/commands/view.json:3278` `"kind": "toolbar",`
- **Comando:** view.selectTool
- **Porta:** `manifest/commands/view.json:3277` `"id": "toolbar-canvas-toolbar-select",`
- **Tratador:** `src/app/commands.ts:450` `'view.selectTool': selectTool,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-view-0105.md`
- **Requisitos:** REQ-2534

## ENT-P-view-0106 — view.selectTool pela porta key-v-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/view.json:3300` `"kind": "shortcut",`
- **Comando:** view.selectTool
- **Porta:** `manifest/commands/view.json:3299` `"id": "key-v-in-global",`
- **Gatilho:** `manifest/commands/view.json:3302` `"chord": "V",`
- **Tratador:** `src/app/commands.ts:450` `'view.selectTool': selectTool,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-view-0106.md`
- **Requisitos:** REQ-2534
