# Portas de comando — domínio structure

Fonte: `manifest/commands/structure.json`. Uma porta por bloco, na ordem do manifesto.

## ENT-P-structure-0001 — element.insert pela porta elements-tile
- **Tipo:** comando-porta panel-control `manifest/commands/structure.json:54` `"kind": "panel-control",`
- **Comando:** element.insert
- **Porta:** `manifest/commands/structure.json:53` `"id": "elements-tile",`
- **Tratador:** `src/app/commands.ts:365` `'element.insert': insertCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0001.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2201

## ENT-P-structure-0002 — element.insert pela porta key-enter-in-palette
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:80` `"kind": "shortcut",`
- **Comando:** element.insert
- **Porta:** `manifest/commands/structure.json:79` `"id": "key-enter-in-palette",`
- **Gatilho:** `manifest/commands/structure.json:82` `"chord": "Enter",`
- **Tratador:** `src/app/commands.ts:365` `'element.insert': insertCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0002.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2201

## ENT-P-structure-0003 — element.insert pela porta key-space-in-palette
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:100` `"kind": "shortcut",`
- **Comando:** element.insert
- **Porta:** `manifest/commands/structure.json:99` `"id": "key-space-in-palette",`
- **Gatilho:** `manifest/commands/structure.json:102` `"chord": "Space",`
- **Tratador:** `src/app/commands.ts:365` `'element.insert': insertCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0003.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2201

## ENT-P-structure-0004 — element.insert pela porta canvas-drag-palette-tile-drop-proposal
- **Tipo:** comando-porta canvas-drag `manifest/commands/structure.json:120` `"kind": "canvas-drag",`
- **Comando:** element.insert
- **Porta:** `manifest/commands/structure.json:119` `"id": "canvas-drag-palette-tile-drop-proposal",`
- **Gatilho:** `manifest/commands/structure.json:122` `"source": "palette-tile",` `manifest/commands/structure.json:123` `"zone": "drop-proposal",` `manifest/commands/structure.json:124` `"gesture": "palette-drag",`
- **Tratador:** `src/app/commands.ts:365` `'element.insert': insertCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:219` `closing?.dispatch(dropDoorOf.command.id, { ...dropDoorOf.door.args, ...press.args, parent: dropped.parent, index: dropped.index } as never);`
- **Fluxo:** `fluxos/ENT-P-structure-0004.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2201

## ENT-P-structure-0005 — element.insert pela porta command-bar-insert
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:140` `"kind": "command-bar",`
- **Comando:** element.insert
- **Porta:** `manifest/commands/structure.json:139` `"id": "command-bar-insert",`
- **Tratador:** `src/app/commands.ts:365` `'element.insert': insertCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0005.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2201

## ENT-P-structure-0006 — element.moveTo pela porta canvas-drag-canvas-element-before-after
- **Tipo:** comando-porta canvas-drag `manifest/commands/structure.json:208` `"kind": "canvas-drag",`
- **Comando:** element.moveTo
- **Porta:** `manifest/commands/structure.json:207` `"id": "canvas-drag-canvas-element-before-after",`
- **Gatilho:** `manifest/commands/structure.json:210` `"source": "canvas-element",` `manifest/commands/structure.json:211` `"zone": "before-after",` `manifest/commands/structure.json:212` `"gesture": "element-drag",`
- **Tratador:** `src/app/commands.ts:366` `'element.moveTo': moveToCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:237` `closing?.dispatch(door.command.id, { ...door.door.args, parent: dropped.parent, index: dropped.index } as never);`
- **Fluxo:** `fluxos/ENT-P-structure-0006.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2202

## ENT-P-structure-0007 — element.moveTo pela porta canvas-drag-canvas-element-inside
- **Tipo:** comando-porta canvas-drag `manifest/commands/structure.json:228` `"kind": "canvas-drag",`
- **Comando:** element.moveTo
- **Porta:** `manifest/commands/structure.json:227` `"id": "canvas-drag-canvas-element-inside",`
- **Gatilho:** `manifest/commands/structure.json:230` `"source": "canvas-element",` `manifest/commands/structure.json:231` `"zone": "inside",` `manifest/commands/structure.json:232` `"gesture": "element-drag",`
- **Tratador:** `src/app/commands.ts:366` `'element.moveTo': moveToCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:237` `closing?.dispatch(door.command.id, { ...door.door.args, parent: dropped.parent, index: dropped.index } as never);`
- **Fluxo:** `fluxos/ENT-P-structure-0007.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2202

## ENT-P-structure-0008 — element.moveTo pela porta layers-drag-layers-row-row-zones
- **Tipo:** comando-porta layers-drag `manifest/commands/structure.json:248` `"kind": "layers-drag",`
- **Comando:** element.moveTo
- **Porta:** `manifest/commands/structure.json:247` `"id": "layers-drag-layers-row-row-zones",`
- **Gatilho:** `manifest/commands/structure.json:250` `"source": "layers-row",` `manifest/commands/structure.json:251` `"zone": "row-zones",` `manifest/commands/structure.json:252` `"gesture": "layers-drag",`
- **Tratador:** `src/app/commands.ts:366` `'element.moveTo': moveToCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:237` `closing?.dispatch(door.command.id, { ...door.door.args, parent: dropped.parent, index: dropped.index } as never);`
- **Fluxo:** `fluxos/ENT-P-structure-0008.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2202

## ENT-P-structure-0009 — element.moveTo pela porta key-enter-in-hand
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:268` `"kind": "shortcut",`
- **Comando:** element.moveTo
- **Porta:** `manifest/commands/structure.json:267` `"id": "key-enter-in-hand",`
- **Gatilho:** `manifest/commands/structure.json:270` `"chord": "Enter",`
- **Tratador:** `src/app/commands.ts:366` `'element.moveTo': moveToCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0009.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2202

## ENT-P-structure-0010 — drag.levelUp pela porta key-arrow-up-in-drag
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:308` `"kind": "shortcut",`
- **Comando:** drag.levelUp
- **Porta:** `manifest/commands/structure.json:307` `"id": "key-arrow-up-in-drag",`
- **Gatilho:** `manifest/commands/structure.json:310` `"chord": "ArrowUp",`
- **Tratador:** `src/app/commands.ts:367` `'drag.levelUp': levelUp,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0010.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2203

## ENT-P-structure-0011 — drag.levelDown pela porta key-arrow-down-in-drag
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:346` `"kind": "shortcut",`
- **Comando:** drag.levelDown
- **Porta:** `manifest/commands/structure.json:345` `"id": "key-arrow-down-in-drag",`
- **Gatilho:** `manifest/commands/structure.json:348` `"chord": "ArrowDown",`
- **Tratador:** `src/app/commands.ts:368` `'drag.levelDown': levelDown,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0011.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2204

## ENT-P-structure-0012 — drag.cancel pela porta key-escape-in-drag
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:384` `"kind": "shortcut",`
- **Comando:** drag.cancel
- **Porta:** `manifest/commands/structure.json:383` `"id": "key-escape-in-drag",`
- **Gatilho:** `manifest/commands/structure.json:386` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:369` `'drag.cancel': cancelDrag,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0012.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2205

## ENT-P-structure-0013 — drag.cancel pela porta key-escape-in-color-picker
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:404` `"kind": "shortcut",`
- **Comando:** drag.cancel
- **Porta:** `manifest/commands/structure.json:403` `"id": "key-escape-in-color-picker",`
- **Gatilho:** `manifest/commands/structure.json:406` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:369` `'drag.cancel': cancelDrag,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0013.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2205

## ENT-P-structure-0014 — element.moveUp pela porta key-alt-arrow-up-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:452` `"kind": "shortcut",`
- **Comando:** element.moveUp
- **Porta:** `manifest/commands/structure.json:451` `"id": "key-alt-arrow-up-in-canvas",`
- **Gatilho:** `manifest/commands/structure.json:454` `"chord": "Alt+ArrowUp",`
- **Tratador:** `src/app/commands.ts:370` `'element.moveUp': moveUpCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0014.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2206

## ENT-P-structure-0015 — element.moveUp pela porta key-alt-arrow-up-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:472` `"kind": "shortcut",`
- **Comando:** element.moveUp
- **Porta:** `manifest/commands/structure.json:471` `"id": "key-alt-arrow-up-in-layers-tree",`
- **Gatilho:** `manifest/commands/structure.json:474` `"chord": "Alt+ArrowUp",`
- **Tratador:** `src/app/commands.ts:370` `'element.moveUp': moveUpCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0015.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2206

## ENT-P-structure-0016 — element.moveUp pela porta element.moveUp#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/structure.json:492` `"kind": "context-menu",`
- **Comando:** element.moveUp
- **Porta:** `manifest/commands/structure.json:491` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:370` `'element.moveUp': moveUpCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0016.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2206

## ENT-P-structure-0017 — element.moveUp pela porta element.moveUp#menu-arrange
- **Tipo:** comando-porta menu `manifest/commands/structure.json:512` `"kind": "menu",`
- **Comando:** element.moveUp
- **Porta:** `manifest/commands/structure.json:511` `"id": "menu-arrange",`
- **Tratador:** `src/app/commands.ts:370` `'element.moveUp': moveUpCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0017.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2206

## ENT-P-structure-0018 — element.moveUp pela porta element.moveUp#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:534` `"kind": "command-bar",`
- **Comando:** element.moveUp
- **Porta:** `manifest/commands/structure.json:533` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:370` `'element.moveUp': moveUpCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0018.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2206

## ENT-P-structure-0019 — element.moveDown pela porta key-alt-arrow-down-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:583` `"kind": "shortcut",`
- **Comando:** element.moveDown
- **Porta:** `manifest/commands/structure.json:582` `"id": "key-alt-arrow-down-in-canvas",`
- **Gatilho:** `manifest/commands/structure.json:585` `"chord": "Alt+ArrowDown",`
- **Tratador:** `src/app/commands.ts:371` `'element.moveDown': moveDownCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0019.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2207

## ENT-P-structure-0020 — element.moveDown pela porta key-alt-arrow-down-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:603` `"kind": "shortcut",`
- **Comando:** element.moveDown
- **Porta:** `manifest/commands/structure.json:602` `"id": "key-alt-arrow-down-in-layers-tree",`
- **Gatilho:** `manifest/commands/structure.json:605` `"chord": "Alt+ArrowDown",`
- **Tratador:** `src/app/commands.ts:371` `'element.moveDown': moveDownCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0020.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2207

## ENT-P-structure-0021 — element.moveDown pela porta element.moveDown#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/structure.json:623` `"kind": "context-menu",`
- **Comando:** element.moveDown
- **Porta:** `manifest/commands/structure.json:622` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:371` `'element.moveDown': moveDownCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0021.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2207

## ENT-P-structure-0022 — element.moveDown pela porta element.moveDown#menu-arrange
- **Tipo:** comando-porta menu `manifest/commands/structure.json:643` `"kind": "menu",`
- **Comando:** element.moveDown
- **Porta:** `manifest/commands/structure.json:642` `"id": "menu-arrange",`
- **Tratador:** `src/app/commands.ts:371` `'element.moveDown': moveDownCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0022.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2207

## ENT-P-structure-0023 — element.moveDown pela porta element.moveDown#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:665` `"kind": "command-bar",`
- **Comando:** element.moveDown
- **Porta:** `manifest/commands/structure.json:664` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:371` `'element.moveDown': moveDownCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0023.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2207

## ENT-P-structure-0024 — element.wrapRow pela porta key-r-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:723` `"kind": "shortcut",`
- **Comando:** element.wrapRow
- **Porta:** `manifest/commands/structure.json:722` `"id": "key-r-in-canvas",`
- **Gatilho:** `manifest/commands/structure.json:725` `"chord": "R",`
- **Tratador:** `src/app/commands.ts:372` `'element.wrapRow': wrapRowCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0024.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2208

## ENT-P-structure-0025 — element.wrapRow pela porta key-r-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:743` `"kind": "shortcut",`
- **Comando:** element.wrapRow
- **Porta:** `manifest/commands/structure.json:742` `"id": "key-r-in-layers-tree",`
- **Gatilho:** `manifest/commands/structure.json:745` `"chord": "R",`
- **Tratador:** `src/app/commands.ts:372` `'element.wrapRow': wrapRowCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0025.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2208

## ENT-P-structure-0026 — element.wrapRow pela porta element.wrapRow#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/structure.json:763` `"kind": "context-menu",`
- **Comando:** element.wrapRow
- **Porta:** `manifest/commands/structure.json:762` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:372` `'element.wrapRow': wrapRowCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0026.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2208

## ENT-P-structure-0027 — element.wrapRow pela porta element.wrapRow#menu-arrange
- **Tipo:** comando-porta menu `manifest/commands/structure.json:783` `"kind": "menu",`
- **Comando:** element.wrapRow
- **Porta:** `manifest/commands/structure.json:782` `"id": "menu-arrange",`
- **Tratador:** `src/app/commands.ts:372` `'element.wrapRow': wrapRowCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0027.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2208

## ENT-P-structure-0028 — element.wrapRow pela porta element.wrapRow#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:805` `"kind": "command-bar",`
- **Comando:** element.wrapRow
- **Porta:** `manifest/commands/structure.json:804` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:372` `'element.wrapRow': wrapRowCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0028.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2208

## ENT-P-structure-0029 — element.wrapColumn pela porta key-c-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:863` `"kind": "shortcut",`
- **Comando:** element.wrapColumn
- **Porta:** `manifest/commands/structure.json:862` `"id": "key-c-in-canvas",`
- **Gatilho:** `manifest/commands/structure.json:865` `"chord": "C",`
- **Tratador:** `src/app/commands.ts:373` `'element.wrapColumn': wrapColumnCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0029.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2209

## ENT-P-structure-0030 — element.wrapColumn pela porta key-c-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:883` `"kind": "shortcut",`
- **Comando:** element.wrapColumn
- **Porta:** `manifest/commands/structure.json:882` `"id": "key-c-in-layers-tree",`
- **Gatilho:** `manifest/commands/structure.json:885` `"chord": "C",`
- **Tratador:** `src/app/commands.ts:373` `'element.wrapColumn': wrapColumnCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0030.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2209

## ENT-P-structure-0031 — element.wrapColumn pela porta element.wrapColumn#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/structure.json:903` `"kind": "context-menu",`
- **Comando:** element.wrapColumn
- **Porta:** `manifest/commands/structure.json:902` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:373` `'element.wrapColumn': wrapColumnCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0031.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2209

## ENT-P-structure-0032 — element.wrapColumn pela porta element.wrapColumn#menu-arrange
- **Tipo:** comando-porta menu `manifest/commands/structure.json:923` `"kind": "menu",`
- **Comando:** element.wrapColumn
- **Porta:** `manifest/commands/structure.json:922` `"id": "menu-arrange",`
- **Tratador:** `src/app/commands.ts:373` `'element.wrapColumn': wrapColumnCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0032.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2209

## ENT-P-structure-0033 — element.wrapColumn pela porta element.wrapColumn#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:945` `"kind": "command-bar",`
- **Comando:** element.wrapColumn
- **Porta:** `manifest/commands/structure.json:944` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:373` `'element.wrapColumn': wrapColumnCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0033.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2209

## ENT-P-structure-0034 — element.wrapBeside pela porta canvas-drag-canvas-element-side-band
- **Tipo:** comando-porta canvas-drag `manifest/commands/structure.json:1028` `"kind": "canvas-drag",`
- **Comando:** element.wrapBeside
- **Porta:** `manifest/commands/structure.json:1027` `"id": "canvas-drag-canvas-element-side-band",`
- **Gatilho:** `manifest/commands/structure.json:1030` `"source": "canvas-element",` `manifest/commands/structure.json:1031` `"zone": "side-band",` `manifest/commands/structure.json:1032` `"gesture": "element-drag",`
- **Tratador:** `src/app/commands.ts:376` `'element.wrapBeside': wrapBesideCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:222` `closing?.dispatch(SIDE_ELEMENT.command.id, { ...SIDE_ELEMENT.door.args, target: side.offer.target, side: side.offer.side, wrapper: wrapped(side.offer.wrapper, ps.releaseModifier) } as never);`
- **Fluxo:** `fluxos/ENT-P-structure-0034.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2210

## ENT-P-structure-0035 — element.wrapBeside pela porta canvas-drag-palette-tile-side-band
- **Tipo:** comando-porta canvas-drag `manifest/commands/structure.json:1048` `"kind": "canvas-drag",`
- **Comando:** element.wrapBeside
- **Porta:** `manifest/commands/structure.json:1047` `"id": "canvas-drag-palette-tile-side-band",`
- **Gatilho:** `manifest/commands/structure.json:1050` `"source": "palette-tile",` `manifest/commands/structure.json:1051` `"zone": "side-band",` `manifest/commands/structure.json:1052` `"gesture": "palette-drag",`
- **Tratador:** `src/app/commands.ts:376` `'element.wrapBeside': wrapBesideCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:215` `else if (side !== null && sideDoorOf !== null) closing?.dispatch(`
- **Fluxo:** `fluxos/ENT-P-structure-0035.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2210

## ENT-P-structure-0036 — element.nestIntoPrevious pela porta element.nestIntoPrevious#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/structure.json:1102` `"kind": "context-menu",`
- **Comando:** element.nestIntoPrevious
- **Porta:** `manifest/commands/structure.json:1101` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:377` `'element.nestIntoPrevious': nestIntoPreviousCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0036.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2211

## ENT-P-structure-0037 — element.nestIntoPrevious pela porta key-alt-arrow-right-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:1122` `"kind": "shortcut",`
- **Comando:** element.nestIntoPrevious
- **Porta:** `manifest/commands/structure.json:1121` `"id": "key-alt-arrow-right-in-canvas",`
- **Gatilho:** `manifest/commands/structure.json:1124` `"chord": "Alt+ArrowRight",`
- **Tratador:** `src/app/commands.ts:377` `'element.nestIntoPrevious': nestIntoPreviousCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0037.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2211

## ENT-P-structure-0038 — element.nestIntoPrevious pela porta key-alt-arrow-right-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:1142` `"kind": "shortcut",`
- **Comando:** element.nestIntoPrevious
- **Porta:** `manifest/commands/structure.json:1141` `"id": "key-alt-arrow-right-in-layers-tree",`
- **Gatilho:** `manifest/commands/structure.json:1144` `"chord": "Alt+ArrowRight",`
- **Tratador:** `src/app/commands.ts:377` `'element.nestIntoPrevious': nestIntoPreviousCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0038.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2211

## ENT-P-structure-0039 — element.nestIntoPrevious pela porta element.nestIntoPrevious#menu-arrange
- **Tipo:** comando-porta menu `manifest/commands/structure.json:1162` `"kind": "menu",`
- **Comando:** element.nestIntoPrevious
- **Porta:** `manifest/commands/structure.json:1161` `"id": "menu-arrange",`
- **Tratador:** `src/app/commands.ts:377` `'element.nestIntoPrevious': nestIntoPreviousCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0039.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2211

## ENT-P-structure-0040 — element.nestIntoPrevious pela porta element.nestIntoPrevious#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:1184` `"kind": "command-bar",`
- **Comando:** element.nestIntoPrevious
- **Porta:** `manifest/commands/structure.json:1183` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:377` `'element.nestIntoPrevious': nestIntoPreviousCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0040.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2211

## ENT-P-structure-0041 — element.promote pela porta key-p-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:1240` `"kind": "shortcut",`
- **Comando:** element.promote
- **Porta:** `manifest/commands/structure.json:1239` `"id": "key-p-in-canvas",`
- **Gatilho:** `manifest/commands/structure.json:1242` `"chord": "P",`
- **Tratador:** `src/app/commands.ts:378` `'element.promote': promoteCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0041.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2212

## ENT-P-structure-0042 — element.promote pela porta key-p-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:1260` `"kind": "shortcut",`
- **Comando:** element.promote
- **Porta:** `manifest/commands/structure.json:1259` `"id": "key-p-in-layers-tree",`
- **Gatilho:** `manifest/commands/structure.json:1262` `"chord": "P",`
- **Tratador:** `src/app/commands.ts:378` `'element.promote': promoteCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0042.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2212

## ENT-P-structure-0043 — element.promote pela porta element.promote#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/structure.json:1280` `"kind": "context-menu",`
- **Comando:** element.promote
- **Porta:** `manifest/commands/structure.json:1279` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:378` `'element.promote': promoteCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0043.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2212

## ENT-P-structure-0044 — element.promote pela porta element.promote#menu-arrange
- **Tipo:** comando-porta menu `manifest/commands/structure.json:1300` `"kind": "menu",`
- **Comando:** element.promote
- **Porta:** `manifest/commands/structure.json:1299` `"id": "menu-arrange",`
- **Tratador:** `src/app/commands.ts:378` `'element.promote': promoteCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0044.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2212

## ENT-P-structure-0045 — element.promote pela porta element.promote#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:1322` `"kind": "command-bar",`
- **Comando:** element.promote
- **Porta:** `manifest/commands/structure.json:1321` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:378` `'element.promote': promoteCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0045.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2212

## ENT-P-structure-0046 — element.duplicate pela porta key-ctrl-d-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:1370` `"kind": "shortcut",`
- **Comando:** element.duplicate
- **Porta:** `manifest/commands/structure.json:1369` `"id": "key-ctrl-d-in-global",`
- **Gatilho:** `manifest/commands/structure.json:1372` `"chord": "Ctrl+D",`
- **Tratador:** `src/app/commands.ts:379` `'element.duplicate': duplicateCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0046.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2213

## ENT-P-structure-0047 — element.duplicate pela porta element.duplicate#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/structure.json:1390` `"kind": "context-menu",`
- **Comando:** element.duplicate
- **Porta:** `manifest/commands/structure.json:1389` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:379` `'element.duplicate': duplicateCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0047.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2213

## ENT-P-structure-0048 — element.duplicate pela porta element.duplicate#menu-edit
- **Tipo:** comando-porta menu `manifest/commands/structure.json:1410` `"kind": "menu",`
- **Comando:** element.duplicate
- **Porta:** `manifest/commands/structure.json:1409` `"id": "menu-edit",`
- **Tratador:** `src/app/commands.ts:379` `'element.duplicate': duplicateCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0048.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2213

## ENT-P-structure-0049 — element.duplicate pela porta element.duplicate#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:1432` `"kind": "command-bar",`
- **Comando:** element.duplicate
- **Porta:** `manifest/commands/structure.json:1431` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:379` `'element.duplicate': duplicateCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0049.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2213

## ENT-P-structure-0050 — element.duplicate pela porta canvas-drag-canvas-element-duplicate
- **Tipo:** comando-porta canvas-drag `manifest/commands/structure.json:1453` `"kind": "canvas-drag",`
- **Comando:** element.duplicate
- **Porta:** `manifest/commands/structure.json:1452` `"id": "canvas-drag-canvas-element-duplicate",`
- **Gatilho:** `manifest/commands/structure.json:1455` `"source": "canvas-element",` `manifest/commands/structure.json:1456` `"zone": "before-after",` `manifest/commands/structure.json:1457` `"gesture": "element-duplicate-drag",`
- **Tratador:** `src/app/commands.ts:379` `'element.duplicate': duplicateCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:230` `const made = closing?.dispatch(DUPLICATE_DRAG.command.id, { ...DUPLICATE_DRAG.door.args } as never);`
- **Fluxo:** `fluxos/ENT-P-structure-0050.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2213

## ENT-P-structure-0051 — element.delete pela porta key-delete-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:1499` `"kind": "shortcut",`
- **Comando:** element.delete
- **Porta:** `manifest/commands/structure.json:1498` `"id": "key-delete-in-canvas",`
- **Gatilho:** `manifest/commands/structure.json:1501` `"chord": "Delete",`
- **Tratador:** `src/app/commands.ts:380` `'element.delete': deleteCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0051.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2214

## ENT-P-structure-0052 — element.delete pela porta key-backspace-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:1519` `"kind": "shortcut",`
- **Comando:** element.delete
- **Porta:** `manifest/commands/structure.json:1518` `"id": "key-backspace-in-canvas",`
- **Gatilho:** `manifest/commands/structure.json:1521` `"chord": "Backspace",`
- **Tratador:** `src/app/commands.ts:380` `'element.delete': deleteCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0052.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2214

## ENT-P-structure-0053 — element.delete pela porta key-delete-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:1539` `"kind": "shortcut",`
- **Comando:** element.delete
- **Porta:** `manifest/commands/structure.json:1538` `"id": "key-delete-in-layers-tree",`
- **Gatilho:** `manifest/commands/structure.json:1541` `"chord": "Delete",`
- **Tratador:** `src/app/commands.ts:380` `'element.delete': deleteCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0053.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2214

## ENT-P-structure-0054 — element.delete pela porta key-backspace-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:1559` `"kind": "shortcut",`
- **Comando:** element.delete
- **Porta:** `manifest/commands/structure.json:1558` `"id": "key-backspace-in-layers-tree",`
- **Gatilho:** `manifest/commands/structure.json:1561` `"chord": "Backspace",`
- **Tratador:** `src/app/commands.ts:380` `'element.delete': deleteCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0054.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2214

## ENT-P-structure-0055 — element.delete pela porta element.delete#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/structure.json:1579` `"kind": "context-menu",`
- **Comando:** element.delete
- **Porta:** `manifest/commands/structure.json:1578` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:380` `'element.delete': deleteCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0055.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2214

## ENT-P-structure-0056 — element.delete pela porta element.delete#menu-edit
- **Tipo:** comando-porta menu `manifest/commands/structure.json:1599` `"kind": "menu",`
- **Comando:** element.delete
- **Porta:** `manifest/commands/structure.json:1598` `"id": "menu-edit",`
- **Tratador:** `src/app/commands.ts:380` `'element.delete': deleteCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0056.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2214

## ENT-P-structure-0057 — element.delete pela porta element.delete#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:1621` `"kind": "command-bar",`
- **Comando:** element.delete
- **Porta:** `manifest/commands/structure.json:1620` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:380` `'element.delete': deleteCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0057.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2214

## ENT-P-structure-0058 — element.unwrap pela porta element.unwrap#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/structure.json:1675` `"kind": "context-menu",`
- **Comando:** element.unwrap
- **Porta:** `manifest/commands/structure.json:1674` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:381` `'element.unwrap': unwrapCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0058.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2215

## ENT-P-structure-0059 — element.unwrap pela porta element.unwrap#menu-arrange
- **Tipo:** comando-porta menu `manifest/commands/structure.json:1695` `"kind": "menu",`
- **Comando:** element.unwrap
- **Porta:** `manifest/commands/structure.json:1694` `"id": "menu-arrange",`
- **Tratador:** `src/app/commands.ts:381` `'element.unwrap': unwrapCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0059.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2215

## ENT-P-structure-0060 — element.unwrap pela porta element.unwrap#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:1717` `"kind": "command-bar",`
- **Comando:** element.unwrap
- **Porta:** `manifest/commands/structure.json:1716` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:381` `'element.unwrap': unwrapCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0060.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2215

## ENT-P-structure-0061 — element.createNaturalChild pela porta element.createNaturalChild#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/structure.json:1764` `"kind": "context-menu",`
- **Comando:** element.createNaturalChild
- **Porta:** `manifest/commands/structure.json:1763` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:382` `'element.createNaturalChild': createNaturalChildCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0061.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2216

## ENT-P-structure-0062 — element.createNaturalChild pela porta element.createNaturalChild#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:1784` `"kind": "command-bar",`
- **Comando:** element.createNaturalChild
- **Porta:** `manifest/commands/structure.json:1783` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:382` `'element.createNaturalChild': createNaturalChildCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0062.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2216

## ENT-P-structure-0063 — hand.take pela porta key-m-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:1827` `"kind": "shortcut",`
- **Comando:** hand.take
- **Porta:** `manifest/commands/structure.json:1826` `"id": "key-m-in-canvas",`
- **Gatilho:** `manifest/commands/structure.json:1829` `"chord": "M",`
- **Tratador:** `src/app/commands.ts:383` `'hand.take': HAND.take,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0063.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2217

## ENT-P-structure-0064 — hand.take pela porta key-m-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:1847` `"kind": "shortcut",`
- **Comando:** hand.take
- **Porta:** `manifest/commands/structure.json:1846` `"id": "key-m-in-layers-tree",`
- **Gatilho:** `manifest/commands/structure.json:1849` `"chord": "M",`
- **Tratador:** `src/app/commands.ts:383` `'hand.take': HAND.take,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0064.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2217

## ENT-P-structure-0065 — hand.take pela porta hand.take#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/structure.json:1867` `"kind": "context-menu",`
- **Comando:** hand.take
- **Porta:** `manifest/commands/structure.json:1866` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:383` `'hand.take': HAND.take,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0065.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2217

## ENT-P-structure-0066 — hand.take pela porta hand.take#menu-arrange
- **Tipo:** comando-porta menu `manifest/commands/structure.json:1887` `"kind": "menu",`
- **Comando:** hand.take
- **Porta:** `manifest/commands/structure.json:1886` `"id": "menu-arrange",`
- **Tratador:** `src/app/commands.ts:383` `'hand.take': HAND.take,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0066.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2217

## ENT-P-structure-0067 — hand.take pela porta hand.take#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:1909` `"kind": "command-bar",`
- **Comando:** hand.take
- **Porta:** `manifest/commands/structure.json:1908` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:383` `'hand.take': HAND.take,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0067.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2217

## ENT-P-structure-0068 — hand.aimNext pela porta key-arrow-down-in-hand
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:1951` `"kind": "shortcut",`
- **Comando:** hand.aimNext
- **Porta:** `manifest/commands/structure.json:1950` `"id": "key-arrow-down-in-hand",`
- **Gatilho:** `manifest/commands/structure.json:1953` `"chord": "ArrowDown",`
- **Tratador:** `src/app/commands.ts:384` `'hand.aimNext': HAND.aimNext,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0068.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2218

## ENT-P-structure-0069 — hand.aimNext pela porta key-arrow-right-in-hand
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:1971` `"kind": "shortcut",`
- **Comando:** hand.aimNext
- **Porta:** `manifest/commands/structure.json:1970` `"id": "key-arrow-right-in-hand",`
- **Gatilho:** `manifest/commands/structure.json:1973` `"chord": "ArrowRight",`
- **Tratador:** `src/app/commands.ts:384` `'hand.aimNext': HAND.aimNext,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0069.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2218

## ENT-P-structure-0070 — hand.aimPrevious pela porta key-shift-arrow-down-in-hand
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:2012` `"kind": "shortcut",`
- **Comando:** hand.aimPrevious
- **Porta:** `manifest/commands/structure.json:2011` `"id": "key-shift-arrow-down-in-hand",`
- **Gatilho:** `manifest/commands/structure.json:2014` `"chord": "Shift+ArrowDown",`
- **Tratador:** `src/app/commands.ts:385` `'hand.aimPrevious': HAND.aimPrevious,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0070.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2219

## ENT-P-structure-0071 — hand.aimPrevious pela porta key-shift-arrow-right-in-hand
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:2032` `"kind": "shortcut",`
- **Comando:** hand.aimPrevious
- **Porta:** `manifest/commands/structure.json:2031` `"id": "key-shift-arrow-right-in-hand",`
- **Gatilho:** `manifest/commands/structure.json:2034` `"chord": "Shift+ArrowRight",`
- **Tratador:** `src/app/commands.ts:385` `'hand.aimPrevious': HAND.aimPrevious,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0071.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2219

## ENT-P-structure-0072 — hand.climb pela porta key-arrow-up-in-hand
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:2073` `"kind": "shortcut",`
- **Comando:** hand.climb
- **Porta:** `manifest/commands/structure.json:2072` `"id": "key-arrow-up-in-hand",`
- **Gatilho:** `manifest/commands/structure.json:2075` `"chord": "ArrowUp",`
- **Tratador:** `src/app/commands.ts:386` `'hand.climb': HAND.climb,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0072.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2220

## ENT-P-structure-0073 — hand.descend pela porta key-arrow-left-in-hand
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:2114` `"kind": "shortcut",`
- **Comando:** hand.descend
- **Porta:** `manifest/commands/structure.json:2113` `"id": "key-arrow-left-in-hand",`
- **Gatilho:** `manifest/commands/structure.json:2116` `"chord": "ArrowLeft",`
- **Tratador:** `src/app/commands.ts:387` `'hand.descend': HAND.descend,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0073.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2221

## ENT-P-structure-0074 — hand.drop pela porta key-escape-in-hand
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:2156` `"kind": "shortcut",`
- **Comando:** hand.drop
- **Porta:** `manifest/commands/structure.json:2155` `"id": "key-escape-in-hand",`
- **Gatilho:** `manifest/commands/structure.json:2158` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:388` `'hand.drop': HAND.drop,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0074.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2222

## ENT-P-structure-0075 — element.wrapContainer pela porta key-d-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:2213` `"kind": "shortcut",`
- **Comando:** element.wrapContainer
- **Porta:** `manifest/commands/structure.json:2212` `"id": "key-d-in-canvas",`
- **Gatilho:** `manifest/commands/structure.json:2215` `"chord": "D",`
- **Tratador:** `src/app/commands.ts:374` `'element.wrapContainer': wrapContainerCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0075.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2223

## ENT-P-structure-0076 — element.wrapContainer pela porta key-d-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:2233` `"kind": "shortcut",`
- **Comando:** element.wrapContainer
- **Porta:** `manifest/commands/structure.json:2232` `"id": "key-d-in-layers-tree",`
- **Gatilho:** `manifest/commands/structure.json:2235` `"chord": "D",`
- **Tratador:** `src/app/commands.ts:374` `'element.wrapContainer': wrapContainerCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0076.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2223

## ENT-P-structure-0077 — element.wrapContainer pela porta element.wrapContainer#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/structure.json:2253` `"kind": "context-menu",`
- **Comando:** element.wrapContainer
- **Porta:** `manifest/commands/structure.json:2252` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:374` `'element.wrapContainer': wrapContainerCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0077.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2223

## ENT-P-structure-0078 — element.wrapContainer pela porta element.wrapContainer#menu-arrange
- **Tipo:** comando-porta menu `manifest/commands/structure.json:2273` `"kind": "menu",`
- **Comando:** element.wrapContainer
- **Porta:** `manifest/commands/structure.json:2272` `"id": "menu-arrange",`
- **Tratador:** `src/app/commands.ts:374` `'element.wrapContainer': wrapContainerCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0078.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2223

## ENT-P-structure-0079 — element.wrapContainer pela porta element.wrapContainer#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:2295` `"kind": "command-bar",`
- **Comando:** element.wrapContainer
- **Porta:** `manifest/commands/structure.json:2294` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:374` `'element.wrapContainer': wrapContainerCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0079.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2223

## ENT-P-structure-0080 — element.wrapGrid pela porta key-g-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:2353` `"kind": "shortcut",`
- **Comando:** element.wrapGrid
- **Porta:** `manifest/commands/structure.json:2352` `"id": "key-g-in-canvas",`
- **Gatilho:** `manifest/commands/structure.json:2355` `"chord": "G",`
- **Tratador:** `src/app/commands.ts:375` `'element.wrapGrid': wrapGridCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0080.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2224

## ENT-P-structure-0081 — element.wrapGrid pela porta key-g-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/structure.json:2373` `"kind": "shortcut",`
- **Comando:** element.wrapGrid
- **Porta:** `manifest/commands/structure.json:2372` `"id": "key-g-in-layers-tree",`
- **Gatilho:** `manifest/commands/structure.json:2375` `"chord": "G",`
- **Tratador:** `src/app/commands.ts:375` `'element.wrapGrid': wrapGridCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-structure-0081.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2224

## ENT-P-structure-0082 — element.wrapGrid pela porta element.wrapGrid#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/structure.json:2393` `"kind": "context-menu",`
- **Comando:** element.wrapGrid
- **Porta:** `manifest/commands/structure.json:2392` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:375` `'element.wrapGrid': wrapGridCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0082.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2224

## ENT-P-structure-0083 — element.wrapGrid pela porta element.wrapGrid#menu-arrange
- **Tipo:** comando-porta menu `manifest/commands/structure.json:2413` `"kind": "menu",`
- **Comando:** element.wrapGrid
- **Porta:** `manifest/commands/structure.json:2412` `"id": "menu-arrange",`
- **Tratador:** `src/app/commands.ts:375` `'element.wrapGrid': wrapGridCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0083.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2224

## ENT-P-structure-0084 — element.wrapGrid pela porta element.wrapGrid#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/structure.json:2435` `"kind": "command-bar",`
- **Comando:** element.wrapGrid
- **Porta:** `manifest/commands/structure.json:2434` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:375` `'element.wrapGrid': wrapGridCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-structure-0084.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2224
