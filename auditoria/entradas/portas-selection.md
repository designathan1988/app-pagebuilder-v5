# Portas de comando do domínio selection

Fonte: `manifest/commands/selection.json`. Um bloco por porta, na ordem do manifesto. O tratador de cada comando de teclado é despachado pelo keymap (`src/editor/input/keymap.ts`); o de cada porta de canvas, pelo dono do ponteiro (`src/editor/input/pointer/`); o de cada controle desenhado, pelo desenho da porta (`src/editor/doors/door.tsx`); o das linhas de Camadas, pelos tratadores próprios da barra lateral (`src/editor/shell/sidebar/layers.tsx`).

## ENT-P-selection-0001 — selection.select pela porta canvas-click-element-or-page
- **Tipo:** comando-porta canvas-click `manifest/commands/selection.json:28` `"kind": "canvas-click",`
- **Comando:** selection.select
- **Porta:** `manifest/commands/selection.json:27` `"id": "canvas-click-element-or-page",`
- **Gatilho:** `manifest/commands/selection.json:34` `"gesture": "canvas-click",`
- **Tratador:** `src/app/commands.ts:353` `'selection.select': selectCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`
- **Fluxo:** `fluxos/ENT-P-selection-0001.md`
- **Requisitos:** REQ-2101

## ENT-P-selection-0002 — selection.select pela porta layers-row
- **Tipo:** comando-porta panel-control `manifest/commands/selection.json:50` `"kind": "panel-control",`
- **Comando:** selection.select
- **Porta:** `manifest/commands/selection.json:49` `"id": "layers-row",`
- **Gatilho:** `manifest/commands/selection.json:57` `"gesture": "layers-row-click",`
- **Tratador:** `src/app/commands.ts:353` `'selection.select': selectCommand,`
- **Início:** `src/editor/shell/sidebar/layers.tsx:258` `else door.run();`
- **Fluxo:** `fluxos/ENT-P-selection-0002.md`
- **Requisitos:** REQ-2101

## ENT-P-selection-0003 — selection.select pela porta key-enter-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/selection.json:76` `"kind": "shortcut",`
- **Comando:** selection.select
- **Porta:** `manifest/commands/selection.json:75` `"id": "key-enter-in-layers-tree",`
- **Gatilho:** `manifest/commands/selection.json:78` `"chord": "Enter",`
- **Tratador:** `src/app/commands.ts:353` `'selection.select': selectCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-selection-0003.md`
- **Requisitos:** REQ-2101

## ENT-P-selection-0004 — selection.select pela porta status-bar-breadcrumb-item
- **Tipo:** comando-porta panel-control `manifest/commands/selection.json:96` `"kind": "panel-control",`
- **Comando:** selection.select
- **Porta:** `manifest/commands/selection.json:95` `"id": "status-bar-breadcrumb-item",`
- **Tratador:** `src/app/commands.ts:353` `'selection.select': selectCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-selection-0004.md`
- **Requisitos:** REQ-2101

## ENT-P-selection-0005 — selection.select pela porta checks-issue
- **Tipo:** comando-porta panel-control `manifest/commands/selection.json:122` `"kind": "panel-control",`
- **Comando:** selection.select
- **Porta:** `manifest/commands/selection.json:121` `"id": "checks-issue",`
- **Tratador:** `src/app/commands.ts:353` `'selection.select': selectCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-selection-0005.md`
- **Requisitos:** REQ-2101

## ENT-P-selection-0006 — selection.select pela porta code-panel-html-line
- **Tipo:** comando-porta panel-control `manifest/commands/selection.json:148` `"kind": "panel-control",`
- **Comando:** selection.select
- **Porta:** `manifest/commands/selection.json:147` `"id": "code-panel-html-line",`
- **Tratador:** `src/app/commands.ts:353` `'selection.select': selectCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-selection-0006.md`
- **Requisitos:** REQ-2101

## ENT-P-selection-0007 — selection.select pela porta command-bar-select-layer
- **Tipo:** comando-porta command-bar `manifest/commands/selection.json:174` `"kind": "command-bar",`
- **Comando:** selection.select
- **Porta:** `manifest/commands/selection.json:173` `"id": "command-bar-select-layer",`
- **Tratador:** `src/app/commands.ts:353` `'selection.select': selectCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-selection-0007.md`
- **Requisitos:** REQ-2101

## ENT-P-selection-0008 — selection.clear pela porta key-escape-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/selection.json:215` `"kind": "shortcut",`
- **Comando:** selection.clear
- **Porta:** `manifest/commands/selection.json:214` `"id": "key-escape-in-canvas",`
- **Gatilho:** `manifest/commands/selection.json:217` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:354` `'selection.clear': clearSelectionCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-selection-0008.md`
- **Requisitos:** REQ-2102

## ENT-P-selection-0009 — selection.clear pela porta canvas-click-stage-outside-page
- **Tipo:** comando-porta canvas-click `manifest/commands/selection.json:235` `"kind": "canvas-click",`
- **Comando:** selection.clear
- **Porta:** `manifest/commands/selection.json:234` `"id": "canvas-click-stage-outside-page",`
- **Gatilho:** `manifest/commands/selection.json:241` `"gesture": "canvas-click",`
- **Tratador:** `src/app/commands.ts:354` `'selection.clear': clearSelectionCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`
- **Fluxo:** `fluxos/ENT-P-selection-0009.md`
- **Requisitos:** REQ-2102

## ENT-P-selection-0010 — selection.clear pela porta menu-edit
- **Tipo:** comando-porta menu `manifest/commands/selection.json:257` `"kind": "menu",`
- **Comando:** selection.clear
- **Porta:** `manifest/commands/selection.json:256` `"id": "menu-edit",`
- **Tratador:** `src/app/commands.ts:354` `'selection.clear': clearSelectionCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-selection-0010.md`
- **Requisitos:** REQ-2102

## ENT-P-selection-0011 — selection.clear pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/selection.json:279` `"kind": "command-bar",`
- **Comando:** selection.clear
- **Porta:** `manifest/commands/selection.json:278` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:354` `'selection.clear': clearSelectionCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-selection-0011.md`
- **Requisitos:** REQ-2102

## ENT-P-selection-0012 — selection.add pela porta canvas-click-element-shift
- **Tipo:** comando-porta canvas-click `manifest/commands/selection.json:324` `"kind": "canvas-click",`
- **Comando:** selection.add
- **Porta:** `manifest/commands/selection.json:323` `"id": "canvas-click-element-shift",`
- **Gatilho:** `manifest/commands/selection.json:330` `"gesture": "canvas-click",`
- **Tratador:** `src/app/commands.ts:355` `'selection.add': addCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`
- **Fluxo:** `fluxos/ENT-P-selection-0012.md`
- **Requisitos:** REQ-2103

## ENT-P-selection-0013 — selection.range pela porta layers-row-shift
- **Tipo:** comando-porta panel-control `manifest/commands/selection.json:370` `"kind": "panel-control",`
- **Comando:** selection.range
- **Porta:** `manifest/commands/selection.json:369` `"id": "layers-row-shift",`
- **Gatilho:** `manifest/commands/selection.json:377` `"gesture": "layers-row-click",`
- **Tratador:** `src/app/commands.ts:356` `'selection.range': rangeCommand,`
- **Início:** `src/editor/shell/sidebar/layers.tsx:262` `if (entry) (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, target: node.id });`
- **Fluxo:** `fluxos/ENT-P-selection-0013.md`
- **Requisitos:** REQ-2104

## ENT-P-selection-0014 — selection.toggle pela porta canvas-click-element-ctrl
- **Tipo:** comando-porta canvas-click `manifest/commands/selection.json:420` `"kind": "canvas-click",`
- **Comando:** selection.toggle
- **Porta:** `manifest/commands/selection.json:419` `"id": "canvas-click-element-ctrl",`
- **Gatilho:** `manifest/commands/selection.json:426` `"gesture": "canvas-click",`
- **Tratador:** `src/app/commands.ts:357` `'selection.toggle': toggleCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`
- **Fluxo:** `fluxos/ENT-P-selection-0014.md`
- **Requisitos:** REQ-2105

## ENT-P-selection-0015 — selection.toggle pela porta layers-row-ctrl
- **Tipo:** comando-porta panel-control `manifest/commands/selection.json:442` `"kind": "panel-control",`
- **Comando:** selection.toggle
- **Porta:** `manifest/commands/selection.json:441` `"id": "layers-row-ctrl",`
- **Gatilho:** `manifest/commands/selection.json:449` `"gesture": "layers-row-click",`
- **Tratador:** `src/app/commands.ts:357` `'selection.toggle': toggleCommand,`
- **Início:** `src/editor/shell/sidebar/layers.tsx:262` `if (entry) (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, target: node.id });`
- **Fluxo:** `fluxos/ENT-P-selection-0015.md`
- **Requisitos:** REQ-2105

## ENT-P-selection-0016 — selection.walkNextSibling pela porta key-arrow-right-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/selection.json:488` `"kind": "shortcut",`
- **Comando:** selection.walkNextSibling
- **Porta:** `manifest/commands/selection.json:487` `"id": "key-arrow-right-in-canvas",`
- **Gatilho:** `manifest/commands/selection.json:490` `"chord": "ArrowRight",`
- **Tratador:** `src/app/commands.ts:358` `'selection.walkNextSibling': walkNextSiblingCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-selection-0016.md`
- **Requisitos:** REQ-2106

## ENT-P-selection-0017 — selection.walkPreviousSibling pela porta key-arrow-left-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/selection.json:528` `"kind": "shortcut",`
- **Comando:** selection.walkPreviousSibling
- **Porta:** `manifest/commands/selection.json:527` `"id": "key-arrow-left-in-canvas",`
- **Gatilho:** `manifest/commands/selection.json:530` `"chord": "ArrowLeft",`
- **Tratador:** `src/app/commands.ts:359` `'selection.walkPreviousSibling': walkPreviousSiblingCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-selection-0017.md`
- **Requisitos:** REQ-2107

## ENT-P-selection-0018 — selection.walkParent pela porta key-arrow-up-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/selection.json:568` `"kind": "shortcut",`
- **Comando:** selection.walkParent
- **Porta:** `manifest/commands/selection.json:567` `"id": "key-arrow-up-in-canvas",`
- **Gatilho:** `manifest/commands/selection.json:570` `"chord": "ArrowUp",`
- **Tratador:** `src/app/commands.ts:360` `'selection.walkParent': walkParentCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-selection-0018.md`
- **Requisitos:** REQ-2108

## ENT-P-selection-0019 — selection.walkFirstChild pela porta key-arrow-down-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/selection.json:608` `"kind": "shortcut",`
- **Comando:** selection.walkFirstChild
- **Porta:** `manifest/commands/selection.json:607` `"id": "key-arrow-down-in-canvas",`
- **Gatilho:** `manifest/commands/selection.json:610` `"chord": "ArrowDown",`
- **Tratador:** `src/app/commands.ts:361` `'selection.walkFirstChild': walkFirstChildCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-selection-0019.md`
- **Requisitos:** REQ-2109

## ENT-P-selection-0020 — selection.selectAllInContainer pela porta key-ctrl-a-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/selection.json:646` `"kind": "shortcut",`
- **Comando:** selection.selectAllInContainer
- **Porta:** `manifest/commands/selection.json:645` `"id": "key-ctrl-a-in-canvas",`
- **Gatilho:** `manifest/commands/selection.json:648` `"chord": "Ctrl+A",`
- **Tratador:** `src/app/commands.ts:362` `'selection.selectAllInContainer': selectAllInContainerCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-selection-0020.md`
- **Requisitos:** REQ-2110

## ENT-P-selection-0021 — selection.selectAllInContainer pela porta key-ctrl-a-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/selection.json:666` `"kind": "shortcut",`
- **Comando:** selection.selectAllInContainer
- **Porta:** `manifest/commands/selection.json:665` `"id": "key-ctrl-a-in-global",`
- **Gatilho:** `manifest/commands/selection.json:668` `"chord": "Ctrl+A",`
- **Tratador:** `src/app/commands.ts:362` `'selection.selectAllInContainer': selectAllInContainerCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-selection-0021.md`
- **Requisitos:** REQ-2110

## ENT-P-selection-0022 — selection.selectAllInContainer pela porta menu-edit
- **Tipo:** comando-porta menu `manifest/commands/selection.json:686` `"kind": "menu",`
- **Comando:** selection.selectAllInContainer
- **Porta:** `manifest/commands/selection.json:685` `"id": "menu-edit",`
- **Tratador:** `src/app/commands.ts:362` `'selection.selectAllInContainer': selectAllInContainerCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-selection-0022.md`
- **Requisitos:** REQ-2110

## ENT-P-selection-0023 — selection.selectAllInContainer pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/selection.json:708` `"kind": "command-bar",`
- **Comando:** selection.selectAllInContainer
- **Porta:** `manifest/commands/selection.json:707` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:362` `'selection.selectAllInContainer': selectAllInContainerCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-selection-0023.md`
- **Requisitos:** REQ-2110

## ENT-P-selection-0024 — selection.marquee pela porta canvas-drag-empty-area-page-or-container
- **Tipo:** comando-porta canvas-drag `manifest/commands/selection.json:772` `"kind": "canvas-drag",`
- **Comando:** selection.marquee
- **Porta:** `manifest/commands/selection.json:771` `"id": "canvas-drag-empty-area-page-or-container",`
- **Gatilho:** `manifest/commands/selection.json:774` `"source": "empty-area",` `manifest/commands/selection.json:775` `"zone": "page-or-container",` `manifest/commands/selection.json:776` `"gesture": "marquee",`
- **Tratador:** `src/app/commands.ts:363` `'selection.marquee': marqueeCommand,`
- **Início:** `src/editor/input/pointer/drag.ts:36` `shared.open.dispatch(ps.marquee.entry.command.id as CommandId, { ...argsFor(ps.marquee.entry, ps.marquee.press, NOT_PICKING), rect, mode: ps.marquee.mode, ...(leavesNow(altHeld) ? { leaves: true } : {}) } as never);`
- **Fluxo:** `fluxos/ENT-P-selection-0024.md`
- **Requisitos:** REQ-2111

## ENT-P-selection-0025 — selection.marquee pela porta canvas-drag-shift-on-element
- **Tipo:** comando-porta canvas-drag `manifest/commands/selection.json:792` `"kind": "canvas-drag",`
- **Comando:** selection.marquee
- **Porta:** `manifest/commands/selection.json:791` `"id": "canvas-drag-shift-on-element",`
- **Gatilho:** `manifest/commands/selection.json:794` `"source": "element",` `manifest/commands/selection.json:795` `"zone": "element",` `manifest/commands/selection.json:796` `"gesture": "marquee",`
- **Tratador:** `src/app/commands.ts:363` `'selection.marquee': marqueeCommand,`
- **Início:** `src/editor/input/pointer/drag.ts:36` `shared.open.dispatch(ps.marquee.entry.command.id as CommandId, { ...argsFor(ps.marquee.entry, ps.marquee.press, NOT_PICKING), rect, mode: ps.marquee.mode, ...(leavesNow(altHeld) ? { leaves: true } : {}) } as never);`
- **Fluxo:** `fluxos/ENT-P-selection-0025.md`
- **Requisitos:** REQ-2111

## ENT-P-selection-0026 — contextMenu.open pela porta canvas-right-click-element-or-page
- **Tipo:** comando-porta canvas-click `manifest/commands/selection.json:836` `"kind": "canvas-click",`
- **Comando:** contextMenu.open
- **Porta:** `manifest/commands/selection.json:835` `"id": "canvas-right-click-element-or-page",`
- **Gatilho:** `manifest/commands/selection.json:842` `"gesture": "canvas-click",`
- **Tratador:** `src/app/commands.ts:364` `'contextMenu.open': contextMenuOpen,`
- **Início:** `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`
- **Fluxo:** `fluxos/ENT-P-selection-0026.md`
- **Requisitos:** REQ-2112

## ENT-P-selection-0027 — contextMenu.open pela porta layers-row-secondary-click
- **Tipo:** comando-porta panel-control `manifest/commands/selection.json:858` `"kind": "panel-control",`
- **Comando:** contextMenu.open
- **Porta:** `manifest/commands/selection.json:857` `"id": "layers-row-secondary-click",`
- **Tratador:** `src/app/commands.ts:364` `'contextMenu.open': contextMenuOpen,`
- **Início:** `src/editor/shell/sidebar/layers.tsx:272` `secondary.run();`
- **Fluxo:** `fluxos/ENT-P-selection-0027.md`
- **Requisitos:** REQ-2112

## ENT-P-selection-0028 — contextMenu.open pela porta quick-panel-more-actions
- **Tipo:** comando-porta quick-panel `manifest/commands/selection.json:885` `"kind": "quick-panel",`
- **Comando:** contextMenu.open
- **Porta:** `manifest/commands/selection.json:884` `"id": "quick-panel-more-actions",`
- **Tratador:** `src/app/commands.ts:364` `'contextMenu.open': contextMenuOpen,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-selection-0028.md`
- **Requisitos:** REQ-2112
