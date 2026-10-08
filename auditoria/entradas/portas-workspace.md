# Portas de comando do domínio workspace

Fonte: `manifest/commands/workspace.json`. Um bloco por porta, na ordem do manifesto. O tratador de cada comando de teclado é despachado pelo keymap (`src/editor/input/keymap.ts`); o de cada controle desenhado, pelo desenho da porta (`src/editor/doors/door.tsx`); o de cada porta de canvas, pelo dono do ponteiro (`src/editor/input/pointer/`).


## ENT-P-workspace-0001 — workspace.setPanelOpen pela porta workspace.setPanelOpen#menu-view-elements
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:59` `"kind": "menu",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:58` `"id": "menu-view-elements",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0001.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0002 — workspace.setPanelOpen pela porta workspace.setPanelOpen#menu-view-layers
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:84` `"kind": "menu",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:83` `"id": "menu-view-layers",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0002.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0003 — workspace.setPanelOpen pela porta workspace.setPanelOpen#menu-view-inspector
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:109` `"kind": "menu",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:108` `"id": "menu-view-inspector",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0003.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0004 — workspace.setPanelOpen pela porta workspace.setPanelOpen#menu-view-explorer
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:134` `"kind": "menu",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:133` `"id": "menu-view-explorer",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0004.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0005 — workspace.setPanelOpen pela porta workspace.setPanelOpen#menu-view-timeline
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:159` `"kind": "menu",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:158` `"id": "menu-view-timeline",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0005.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0006 — workspace.setPanelOpen pela porta workspace.setPanelOpen#menu-view-motion
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:184` `"kind": "menu",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:183` `"id": "menu-view-motion",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0006.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0007 — workspace.setPanelOpen pela porta workspace.setPanelOpen#menu-view-variables
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:209` `"kind": "menu",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:208` `"id": "menu-view-variables",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0007.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0008 — workspace.setPanelOpen pela porta workspace.setPanelOpen#menu-view-checks
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:234` `"kind": "menu",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:233` `"id": "menu-view-checks",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0008.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0009 — workspace.setPanelOpen pela porta workspace.setPanelOpen#menu-view-workbench
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:259` `"kind": "menu",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:258` `"id": "menu-view-workbench",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0009.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0010 — workspace.setPanelOpen pela porta workspace.setPanelOpen#menu-view-canvas-tools
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:284` `"kind": "menu",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:283` `"id": "menu-view-canvas-tools",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0010.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0011 — workspace.setPanelOpen pela porta workspace.setPanelOpen#toolbar-canvas-toolbar-canvas-tools
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:309` `"kind": "toolbar",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:308` `"id": "toolbar-canvas-toolbar-canvas-tools",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0011.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0012 — workspace.setPanelOpen pela porta workspace.setPanelOpen#toolbar-activity-bar-explorer
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:334` `"kind": "toolbar",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:333` `"id": "toolbar-activity-bar-explorer",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0012.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0013 — workspace.setPanelOpen pela porta workspace.setPanelOpen#toolbar-activity-bar-insert
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:360` `"kind": "toolbar",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:359` `"id": "toolbar-activity-bar-insert",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0013.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0014 — workspace.setPanelOpen pela porta workspace.setPanelOpen#toolbar-activity-bar-styles
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:386` `"kind": "toolbar",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:385` `"id": "toolbar-activity-bar-styles",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0014.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0015 — workspace.setPanelOpen pela porta workspace.setPanelOpen#toolbar-layers-header-toggle
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:412` `"kind": "toolbar",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:411` `"id": "toolbar-layers-header-toggle",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0015.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0016 — workspace.setPanelOpen pela porta workspace.setPanelOpen#panel-header-close
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:437` `"kind": "panel-control",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:436` `"id": "panel-header-close",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0016.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0017 — workspace.setPanelOpen pela porta workspace.setPanelOpen#command-bar-open-panel
- **Tipo:** comando-porta command-bar `manifest/commands/workspace.json:465` `"kind": "command-bar",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:464` `"id": "command-bar-open-panel",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0017.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0018 — workspace.setPanelOpen pela porta workspace.setPanelOpen#menu-help-shortcuts
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:489` `"kind": "menu",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:488` `"id": "menu-help-shortcuts",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0018.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0019 — workspace.setPanelOpen pela porta workspace.setPanelOpen#workbench-tab-close
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:514` `"kind": "panel-control",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:513` `"id": "workbench-tab-close",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0019.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0020 — workspace.setPanelOpen pela porta workspace.setPanelOpen#dock-strip-timeline
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:542` `"kind": "toolbar",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:541` `"id": "dock-strip-timeline",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0020.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0021 — workspace.setPanelOpen pela porta workspace.setPanelOpen#dock-strip-motion
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:567` `"kind": "toolbar",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:566` `"id": "dock-strip-motion",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0021.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0022 — workspace.setPanelOpen pela porta workspace.setPanelOpen#dock-strip-checks
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:592` `"kind": "toolbar",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:591` `"id": "dock-strip-checks",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0022.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0023 — workspace.setPanelOpen pela porta workspace.setPanelOpen#toolbar-activity-bar-assistant
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:617` `"kind": "toolbar",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:616` `"id": "toolbar-activity-bar-assistant",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0023.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0024 — workspace.setPanelOpen pela porta workspace.setPanelOpen#toolbar-activity-bar-layout-composer
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:642` `"kind": "menu",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:641` `"id": "toolbar-activity-bar-layout-composer",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0024.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0025 — workspace.setPanelOpen pela porta workspace.setPanelOpen#toolbar-activity-bar-data
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:667` `"kind": "toolbar",`
- **Comando:** workspace.setPanelOpen
- **Porta:** `manifest/commands/workspace.json:666` `"id": "toolbar-activity-bar-data",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0025.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6201

## ENT-P-workspace-0026 — workspace.toggleLeftDock pela porta workspace.toggleLeftDock#key-ctrl-b-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:711` `"kind": "shortcut",`
- **Comando:** workspace.toggleLeftDock
- **Porta:** `manifest/commands/workspace.json:710` `"id": "key-ctrl-b-in-global",`
- **Gatilho:** `manifest/commands/workspace.json:713` `"chord": "Ctrl+B",`
- **Tratador:** `src/app/commands.ts:478` `'workspace.toggleLeftDock': toggleLeftDock,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0026.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6202

## ENT-P-workspace-0027 — workspace.toggleLeftDock pela porta workspace.toggleLeftDock#key-ctrl-b-in-field
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:731` `"kind": "shortcut",`
- **Comando:** workspace.toggleLeftDock
- **Porta:** `manifest/commands/workspace.json:730` `"id": "key-ctrl-b-in-field",`
- **Gatilho:** `manifest/commands/workspace.json:733` `"chord": "Ctrl+B",`
- **Tratador:** `src/app/commands.ts:478` `'workspace.toggleLeftDock': toggleLeftDock,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0027.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6202

## ENT-P-workspace-0028 — workspace.toggleLeftDock pela porta workspace.toggleLeftDock#menu-view
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:751` `"kind": "menu",`
- **Comando:** workspace.toggleLeftDock
- **Porta:** `manifest/commands/workspace.json:750` `"id": "menu-view",`
- **Tratador:** `src/app/commands.ts:478` `'workspace.toggleLeftDock': toggleLeftDock,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0028.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6202

## ENT-P-workspace-0029 — workspace.toggleInspector pela porta workspace.toggleInspector#key-ctrl-alt-b-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:791` `"kind": "shortcut",`
- **Comando:** workspace.toggleInspector
- **Porta:** `manifest/commands/workspace.json:790` `"id": "key-ctrl-alt-b-in-global",`
- **Gatilho:** `manifest/commands/workspace.json:793` `"chord": "Ctrl+Alt+B",`
- **Tratador:** `src/app/commands.ts:479` `'workspace.toggleInspector': toggleInspector,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0029.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6203

## ENT-P-workspace-0030 — workspace.toggleInspector pela porta workspace.toggleInspector#key-ctrl-alt-b-in-field
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:811` `"kind": "shortcut",`
- **Comando:** workspace.toggleInspector
- **Porta:** `manifest/commands/workspace.json:810` `"id": "key-ctrl-alt-b-in-field",`
- **Gatilho:** `manifest/commands/workspace.json:813` `"chord": "Ctrl+Alt+B",`
- **Tratador:** `src/app/commands.ts:479` `'workspace.toggleInspector': toggleInspector,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0030.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6203

## ENT-P-workspace-0031 — workspace.toggleInspector pela porta workspace.toggleInspector#menu-view
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:831` `"kind": "menu",`
- **Comando:** workspace.toggleInspector
- **Porta:** `manifest/commands/workspace.json:830` `"id": "menu-view",`
- **Tratador:** `src/app/commands.ts:479` `'workspace.toggleInspector': toggleInspector,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0031.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6203

## ENT-P-workspace-0032 — workspace.collapseDocks pela porta workspace.collapseDocks#key-ctrl-backslash-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:871` `"kind": "shortcut",`
- **Comando:** workspace.collapseDocks
- **Porta:** `manifest/commands/workspace.json:870` `"id": "key-ctrl-backslash-in-global",`
- **Gatilho:** `manifest/commands/workspace.json:873` `"chord": "Ctrl+\\",`
- **Tratador:** `src/app/commands.ts:480` `'workspace.collapseDocks': collapseDocks,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0032.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6204

## ENT-P-workspace-0033 — workspace.collapseDocks pela porta workspace.collapseDocks#key-ctrl-backslash-in-field
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:891` `"kind": "shortcut",`
- **Comando:** workspace.collapseDocks
- **Porta:** `manifest/commands/workspace.json:890` `"id": "key-ctrl-backslash-in-field",`
- **Gatilho:** `manifest/commands/workspace.json:893` `"chord": "Ctrl+\\",`
- **Tratador:** `src/app/commands.ts:480` `'workspace.collapseDocks': collapseDocks,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0033.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6204

## ENT-P-workspace-0034 — workspace.collapseDocks pela porta workspace.collapseDocks#menu-view
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:911` `"kind": "menu",`
- **Comando:** workspace.collapseDocks
- **Porta:** `manifest/commands/workspace.json:910` `"id": "menu-view",`
- **Tratador:** `src/app/commands.ts:480` `'workspace.collapseDocks': collapseDocks,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0034.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6204

## ENT-P-workspace-0035 — workspace.toggleDeveloperTools pela porta workspace.toggleDeveloperTools#menu-view
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:951` `"kind": "menu",`
- **Comando:** workspace.toggleDeveloperTools
- **Porta:** `manifest/commands/workspace.json:950` `"id": "menu-view",`
- **Tratador:** `src/app/commands.ts:481` `'workspace.toggleDeveloperTools': toggleDeveloperTools,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0035.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6205

## ENT-P-workspace-0036 — workspace.reset pela porta workspace.reset#menu-view
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:991` `"kind": "menu",`
- **Comando:** workspace.reset
- **Porta:** `manifest/commands/workspace.json:990` `"id": "menu-view",`
- **Tratador:** `src/app/commands.ts:482` `'workspace.reset': resetWorkspace,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0036.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6206

## ENT-P-workspace-0037 — workspace.reset pela porta workspace.reset#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/workspace.json:1013` `"kind": "command-bar",`
- **Comando:** workspace.reset
- **Porta:** `manifest/commands/workspace.json:1012` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:482` `'workspace.reset': resetWorkspace,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0037.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6206

## ENT-P-workspace-0038 — workspace.setWorkbenchState pela porta workspace.setWorkbenchState#toolbar-workbench-strip-toggle
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:1064` `"kind": "toolbar",`
- **Comando:** workspace.setWorkbenchState
- **Porta:** `manifest/commands/workspace.json:1063` `"id": "toolbar-workbench-strip-toggle",`
- **Tratador:** `src/app/commands.ts:483` `'workspace.setWorkbenchState': setWorkbenchState,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0038.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6207

## ENT-P-workspace-0039 — workspace.setWorkbenchState pela porta workspace.setWorkbenchState#toolbar-workbench-strip-maximize
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:1088` `"kind": "toolbar",`
- **Comando:** workspace.setWorkbenchState
- **Porta:** `manifest/commands/workspace.json:1087` `"id": "toolbar-workbench-strip-maximize",`
- **Tratador:** `src/app/commands.ts:483` `'workspace.setWorkbenchState': setWorkbenchState,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0039.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6207

## ENT-P-workspace-0040 — workspace.setActiveTab pela porta workspace.setActiveTab#inspector-tab-style
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:1142` `"kind": "panel-control",`
- **Comando:** workspace.setActiveTab
- **Porta:** `manifest/commands/workspace.json:1141` `"id": "inspector-tab-style",`
- **Tratador:** `src/app/commands.ts:484` `'workspace.setActiveTab': setActiveTab,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0040.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6208

## ENT-P-workspace-0041 — workspace.setActiveTab pela porta workspace.setActiveTab#inspector-tab-settings
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:1171` `"kind": "panel-control",`
- **Comando:** workspace.setActiveTab
- **Porta:** `manifest/commands/workspace.json:1170` `"id": "inspector-tab-settings",`
- **Tratador:** `src/app/commands.ts:484` `'workspace.setActiveTab': setActiveTab,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0041.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6208

## ENT-P-workspace-0042 — workspace.setActiveTab pela porta workspace.setActiveTab#inspector-tab-interactions
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:1200` `"kind": "panel-control",`
- **Comando:** workspace.setActiveTab
- **Porta:** `manifest/commands/workspace.json:1199` `"id": "inspector-tab-interactions",`
- **Tratador:** `src/app/commands.ts:484` `'workspace.setActiveTab': setActiveTab,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0042.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6208

## ENT-P-workspace-0043 — workspace.setActiveTab pela porta workspace.setActiveTab#tab-strip-tab
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:1229` `"kind": "panel-control",`
- **Comando:** workspace.setActiveTab
- **Porta:** `manifest/commands/workspace.json:1228` `"id": "tab-strip-tab",`
- **Tratador:** `src/app/commands.ts:484` `'workspace.setActiveTab': setActiveTab,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0043.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6208

## ENT-P-workspace-0044 — workspace.setActiveTab pela porta workspace.setActiveTab#sidebar-tab
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:1255` `"kind": "panel-control",`
- **Comando:** workspace.setActiveTab
- **Porta:** `manifest/commands/workspace.json:1254` `"id": "sidebar-tab",`
- **Tratador:** `src/app/commands.ts:484` `'workspace.setActiveTab': setActiveTab,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0044.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6208

## ENT-P-workspace-0045 — workspace.resizeSplitter pela porta workspace.resizeSplitter#panel-drag-splitter-workspace
- **Tipo:** comando-porta panel-drag `manifest/commands/workspace.json:1328` `"kind": "panel-drag",`
- **Comando:** workspace.resizeSplitter
- **Porta:** `manifest/commands/workspace.json:1327` `"id": "panel-drag-splitter-workspace",`
- **Gatilho:** `manifest/commands/workspace.json:1330` `"source": "splitter",` `manifest/commands/workspace.json:1331` `"zone": "workspace",` `manifest/commands/workspace.json:1332` `"gesture": "splitter-drag",`
- **Tratador:** `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,`
- **Início:** `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);`
- **Fluxo:** `fluxos/ENT-P-workspace-0045.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6209

## ENT-P-workspace-0046 — workspace.resizeSplitter pela porta workspace.resizeSplitter#key-arrow-left-in-splitter
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:1348` `"kind": "shortcut",`
- **Comando:** workspace.resizeSplitter
- **Porta:** `manifest/commands/workspace.json:1347` `"id": "key-arrow-left-in-splitter",`
- **Gatilho:** `manifest/commands/workspace.json:1350` `"chord": "ArrowLeft",`
- **Tratador:** `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0046.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6209

## ENT-P-workspace-0047 — workspace.resizeSplitter pela porta workspace.resizeSplitter#key-arrow-right-in-splitter
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:1370` `"kind": "shortcut",`
- **Comando:** workspace.resizeSplitter
- **Porta:** `manifest/commands/workspace.json:1369` `"id": "key-arrow-right-in-splitter",`
- **Gatilho:** `manifest/commands/workspace.json:1372` `"chord": "ArrowRight",`
- **Tratador:** `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0047.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6209

## ENT-P-workspace-0048 — workspace.resizeSplitter pela porta workspace.resizeSplitter#key-arrow-up-in-splitter
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:1392` `"kind": "shortcut",`
- **Comando:** workspace.resizeSplitter
- **Porta:** `manifest/commands/workspace.json:1391` `"id": "key-arrow-up-in-splitter",`
- **Gatilho:** `manifest/commands/workspace.json:1394` `"chord": "ArrowUp",`
- **Tratador:** `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0048.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6209

## ENT-P-workspace-0049 — workspace.resizeSplitter pela porta workspace.resizeSplitter#key-arrow-down-in-splitter
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:1414` `"kind": "shortcut",`
- **Comando:** workspace.resizeSplitter
- **Porta:** `manifest/commands/workspace.json:1413` `"id": "key-arrow-down-in-splitter",`
- **Gatilho:** `manifest/commands/workspace.json:1416` `"chord": "ArrowDown",`
- **Tratador:** `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0049.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6209

## ENT-P-workspace-0050 — workspace.resizeSplitter pela porta workspace.resizeSplitter#menu-view-sidebar-wider
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:1436` `"kind": "menu",`
- **Comando:** workspace.resizeSplitter
- **Porta:** `manifest/commands/workspace.json:1435` `"id": "menu-view-sidebar-wider",`
- **Tratador:** `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0050.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6209

## ENT-P-workspace-0051 — workspace.resizeSplitter pela porta workspace.resizeSplitter#menu-view-sidebar-narrower
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:1461` `"kind": "menu",`
- **Comando:** workspace.resizeSplitter
- **Porta:** `manifest/commands/workspace.json:1460` `"id": "menu-view-sidebar-narrower",`
- **Tratador:** `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0051.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6209

## ENT-P-workspace-0052 — workspace.resizeSplitter pela porta workspace.resizeSplitter#menu-view-inspector-wider
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:1486` `"kind": "menu",`
- **Comando:** workspace.resizeSplitter
- **Porta:** `manifest/commands/workspace.json:1485` `"id": "menu-view-inspector-wider",`
- **Tratador:** `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0052.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6209

## ENT-P-workspace-0053 — workspace.resizeSplitter pela porta workspace.resizeSplitter#menu-view-inspector-narrower
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:1511` `"kind": "menu",`
- **Comando:** workspace.resizeSplitter
- **Porta:** `manifest/commands/workspace.json:1510` `"id": "menu-view-inspector-narrower",`
- **Tratador:** `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0053.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6209

## ENT-P-workspace-0054 — workspace.resizeSplitter pela porta workspace.resizeSplitter#menu-view-layers-taller
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:1536` `"kind": "menu",`
- **Comando:** workspace.resizeSplitter
- **Porta:** `manifest/commands/workspace.json:1535` `"id": "menu-view-layers-taller",`
- **Tratador:** `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0054.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6209

## ENT-P-workspace-0055 — workspace.resizeSplitter pela porta workspace.resizeSplitter#menu-view-layers-shorter
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:1561` `"kind": "menu",`
- **Comando:** workspace.resizeSplitter
- **Porta:** `manifest/commands/workspace.json:1560` `"id": "menu-view-layers-shorter",`
- **Tratador:** `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0055.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6209

## ENT-P-workspace-0056 — workspace.movePanel pela porta workspace.movePanel#panel-drag-panel-header-canvas
- **Tipo:** comando-porta panel-drag `manifest/commands/workspace.json:1637` `"kind": "panel-drag",`
- **Comando:** workspace.movePanel
- **Porta:** `manifest/commands/workspace.json:1636` `"id": "panel-drag-panel-header-canvas",`
- **Gatilho:** `manifest/commands/workspace.json:1639` `"source": "panel-header",` `manifest/commands/workspace.json:1640` `"zone": "canvas",` `manifest/commands/workspace.json:1641` `"gesture": "panel-drag",`
- **Tratador:** `src/app/commands.ts:486` `'workspace.movePanel': movePanel,`
- **Início:** `src/editor/input/pointer/effects.ts:186` `if (place.door !== null) closing?.dispatch(place.door.command.id as CommandId, { ...place.door.door.args, panel: dragging.press.panel, ...place.args } as never);`
- **Fluxo:** `fluxos/ENT-P-workspace-0056.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6210

## ENT-P-workspace-0057 — workspace.movePanel pela porta workspace.movePanel#panel-drag-panel-header-left-edge
- **Tipo:** comando-porta panel-drag `manifest/commands/workspace.json:1659` `"kind": "panel-drag",`
- **Comando:** workspace.movePanel
- **Porta:** `manifest/commands/workspace.json:1658` `"id": "panel-drag-panel-header-left-edge",`
- **Gatilho:** `manifest/commands/workspace.json:1661` `"source": "panel-header",` `manifest/commands/workspace.json:1662` `"zone": "left-edge",` `manifest/commands/workspace.json:1663` `"gesture": "panel-drag",`
- **Tratador:** `src/app/commands.ts:486` `'workspace.movePanel': movePanel,`
- **Início:** `src/editor/input/pointer/effects.ts:186` `if (place.door !== null) closing?.dispatch(place.door.command.id as CommandId, { ...place.door.door.args, panel: dragging.press.panel, ...place.args } as never);`
- **Fluxo:** `fluxos/ENT-P-workspace-0057.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6210

## ENT-P-workspace-0058 — workspace.movePanel pela porta workspace.movePanel#panel-drag-panel-header-right-edge
- **Tipo:** comando-porta panel-drag `manifest/commands/workspace.json:1681` `"kind": "panel-drag",`
- **Comando:** workspace.movePanel
- **Porta:** `manifest/commands/workspace.json:1680` `"id": "panel-drag-panel-header-right-edge",`
- **Gatilho:** `manifest/commands/workspace.json:1683` `"source": "panel-header",` `manifest/commands/workspace.json:1684` `"zone": "right-edge",` `manifest/commands/workspace.json:1685` `"gesture": "panel-drag",`
- **Tratador:** `src/app/commands.ts:486` `'workspace.movePanel': movePanel,`
- **Início:** `src/editor/input/pointer/effects.ts:186` `if (place.door !== null) closing?.dispatch(place.door.command.id as CommandId, { ...place.door.door.args, panel: dragging.press.panel, ...place.args } as never);`
- **Fluxo:** `fluxos/ENT-P-workspace-0058.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6210

## ENT-P-workspace-0059 — workspace.movePanel pela porta workspace.movePanel#panel-drag-floating-header-anywhere
- **Tipo:** comando-porta panel-drag `manifest/commands/workspace.json:1703` `"kind": "panel-drag",`
- **Comando:** workspace.movePanel
- **Porta:** `manifest/commands/workspace.json:1702` `"id": "panel-drag-floating-header-anywhere",`
- **Gatilho:** `manifest/commands/workspace.json:1705` `"source": "floating-header",` `manifest/commands/workspace.json:1706` `"zone": "anywhere",` `manifest/commands/workspace.json:1707` `"gesture": "panel-drag",`
- **Tratador:** `src/app/commands.ts:486` `'workspace.movePanel': movePanel,`
- **Início:** `src/editor/input/pointer/effects.ts:186` `if (place.door !== null) closing?.dispatch(place.door.command.id as CommandId, { ...place.door.door.args, panel: dragging.press.panel, ...place.args } as never);`
- **Fluxo:** `fluxos/ENT-P-workspace-0059.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6210

## ENT-P-workspace-0060 — workspace.movePanel pela porta workspace.movePanel#panel-drag-panel-header-panel-upper-part
- **Tipo:** comando-porta panel-drag `manifest/commands/workspace.json:1725` `"kind": "panel-drag",`
- **Comando:** workspace.movePanel
- **Porta:** `manifest/commands/workspace.json:1724` `"id": "panel-drag-panel-header-panel-upper-part",`
- **Gatilho:** `manifest/commands/workspace.json:1727` `"source": "panel-header",` `manifest/commands/workspace.json:1728` `"zone": "panel-upper-part",` `manifest/commands/workspace.json:1729` `"gesture": "panel-drag",`
- **Tratador:** `src/app/commands.ts:486` `'workspace.movePanel': movePanel,`
- **Início:** `src/editor/input/pointer/effects.ts:186` `if (place.door !== null) closing?.dispatch(place.door.command.id as CommandId, { ...place.door.door.args, panel: dragging.press.panel, ...place.args } as never);`
- **Fluxo:** `fluxos/ENT-P-workspace-0060.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6210

## ENT-P-workspace-0061 — workspace.movePanel pela porta workspace.movePanel#panel-drag-panel-header-panel-lower-part
- **Tipo:** comando-porta panel-drag `manifest/commands/workspace.json:1747` `"kind": "panel-drag",`
- **Comando:** workspace.movePanel
- **Porta:** `manifest/commands/workspace.json:1746` `"id": "panel-drag-panel-header-panel-lower-part",`
- **Gatilho:** `manifest/commands/workspace.json:1749` `"source": "panel-header",` `manifest/commands/workspace.json:1750` `"zone": "panel-lower-part",` `manifest/commands/workspace.json:1751` `"gesture": "panel-drag",`
- **Tratador:** `src/app/commands.ts:486` `'workspace.movePanel': movePanel,`
- **Início:** `src/editor/input/pointer/effects.ts:186` `if (place.door !== null) closing?.dispatch(place.door.command.id as CommandId, { ...place.door.door.args, panel: dragging.press.panel, ...place.args } as never);`
- **Fluxo:** `fluxos/ENT-P-workspace-0061.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6210

## ENT-P-workspace-0062 — workspace.movePanel pela porta workspace.movePanel#panel-header-dock
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:1769` `"kind": "panel-control",`
- **Comando:** workspace.movePanel
- **Porta:** `manifest/commands/workspace.json:1768` `"id": "panel-header-dock",`
- **Tratador:** `src/app/commands.ts:486` `'workspace.movePanel': movePanel,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0062.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6210

## ENT-P-workspace-0063 — quickPanel.setOffset pela porta quickPanel.setOffset#panel-drag-quick-panel-grip-canvas
- **Tipo:** comando-porta panel-drag `manifest/commands/workspace.json:1831` `"kind": "panel-drag",`
- **Comando:** quickPanel.setOffset
- **Porta:** `manifest/commands/workspace.json:1830` `"id": "panel-drag-quick-panel-grip-canvas",`
- **Gatilho:** `manifest/commands/workspace.json:1833` `"source": "quick-panel-grip",` `manifest/commands/workspace.json:1834` `"zone": "canvas",` `manifest/commands/workspace.json:1835` `"gesture": "quick-panel-grip",`
- **Tratador:** `src/app/commands.ts:487` `'quickPanel.setOffset': setOffset,`
- **Início:** `src/editor/input/pointer/panels.ts:54` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, offset: { x: press.base.x + at.x - start.x, y: press.base.y + at.y - start.y }, distance: at.x - start.x } as never);`
- **Fluxo:** `fluxos/ENT-P-workspace-0063.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6211

## ENT-P-workspace-0064 — preferences.setLanguage pela porta preferences.setLanguage#menu-language-pt-br
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:1878` `"kind": "menu",`
- **Comando:** preferences.setLanguage
- **Porta:** `manifest/commands/workspace.json:1877` `"id": "menu-language-pt-br",`
- **Tratador:** `src/app/commands.ts:489` `'preferences.setLanguage': setLanguage,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0064.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6212

## ENT-P-workspace-0065 — preferences.setLanguage pela porta preferences.setLanguage#menu-language-en
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:1902` `"kind": "menu",`
- **Comando:** preferences.setLanguage
- **Porta:** `manifest/commands/workspace.json:1901` `"id": "menu-language-en",`
- **Tratador:** `src/app/commands.ts:489` `'preferences.setLanguage': setLanguage,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0065.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6212

## ENT-P-workspace-0066 — preferences.setTheme pela porta preferences.setTheme#menu-theme-light
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:1954` `"kind": "menu",`
- **Comando:** preferences.setTheme
- **Porta:** `manifest/commands/workspace.json:1953` `"id": "menu-theme-light",`
- **Tratador:** `src/app/commands.ts:490` `'preferences.setTheme': setTheme,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0066.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6213

## ENT-P-workspace-0067 — preferences.setTheme pela porta preferences.setTheme#menu-theme-dark
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:1978` `"kind": "menu",`
- **Comando:** preferences.setTheme
- **Porta:** `manifest/commands/workspace.json:1977` `"id": "menu-theme-dark",`
- **Tratador:** `src/app/commands.ts:490` `'preferences.setTheme': setTheme,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0067.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6213

## ENT-P-workspace-0068 — preferences.setTheme pela porta preferences.setTheme#menu-theme-system
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:2002` `"kind": "menu",`
- **Comando:** preferences.setTheme
- **Porta:** `manifest/commands/workspace.json:2001` `"id": "menu-theme-system",`
- **Tratador:** `src/app/commands.ts:490` `'preferences.setTheme': setTheme,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0068.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6213

## ENT-P-workspace-0069 — commandBar.open pela porta commandBar.open#key-ctrl-k-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:2044` `"kind": "shortcut",`
- **Comando:** commandBar.open
- **Porta:** `manifest/commands/workspace.json:2043` `"id": "key-ctrl-k-in-global",`
- **Gatilho:** `manifest/commands/workspace.json:2046` `"chord": "Ctrl+K",`
- **Tratador:** `src/app/commands.ts:491` `'commandBar.open': openCommandBar,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0069.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6214

## ENT-P-workspace-0070 — commandBar.open pela porta commandBar.open#key-ctrl-shift-k-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:2064` `"kind": "shortcut",`
- **Comando:** commandBar.open
- **Porta:** `manifest/commands/workspace.json:2063` `"id": "key-ctrl-shift-k-in-global",`
- **Gatilho:** `manifest/commands/workspace.json:2066` `"chord": "Ctrl+Shift+K",`
- **Tratador:** `src/app/commands.ts:491` `'commandBar.open': openCommandBar,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0070.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6214

## ENT-P-workspace-0071 — commandBar.open pela porta commandBar.open#key-ctrl-shift-k-in-text-editing
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:2084` `"kind": "shortcut",`
- **Comando:** commandBar.open
- **Porta:** `manifest/commands/workspace.json:2083` `"id": "key-ctrl-shift-k-in-text-editing",`
- **Gatilho:** `manifest/commands/workspace.json:2086` `"chord": "Ctrl+Shift+K",`
- **Tratador:** `src/app/commands.ts:491` `'commandBar.open': openCommandBar,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0071.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6214

## ENT-P-workspace-0072 — commandBar.open pela porta commandBar.open#toolbar-top-bar-search
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:2104` `"kind": "toolbar",`
- **Comando:** commandBar.open
- **Porta:** `manifest/commands/workspace.json:2103` `"id": "toolbar-top-bar-search",`
- **Tratador:** `src/app/commands.ts:491` `'commandBar.open': openCommandBar,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0072.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6214

## ENT-P-workspace-0073 — commandBar.open pela porta commandBar.open#menu-file
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:2126` `"kind": "menu",`
- **Comando:** commandBar.open
- **Porta:** `manifest/commands/workspace.json:2125` `"id": "menu-file",`
- **Tratador:** `src/app/commands.ts:491` `'commandBar.open': openCommandBar,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0073.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6214

## ENT-P-workspace-0074 — palette.toggleGroup pela porta palette.toggleGroup#elements-group-header
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2172` `"kind": "panel-control",`
- **Comando:** palette.toggleGroup
- **Porta:** `manifest/commands/workspace.json:2171` `"id": "elements-group-header",`
- **Tratador:** `src/app/commands.ts:492` `'palette.toggleGroup': toggleGroup,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0074.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6215

## ENT-P-workspace-0075 — palette.setDensity pela porta palette.setDensity#elements-density-list
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2227` `"kind": "panel-control",`
- **Comando:** palette.setDensity
- **Porta:** `manifest/commands/workspace.json:2226` `"id": "elements-density-list",`
- **Tratador:** `src/app/commands.ts:493` `'palette.setDensity': setDensity,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0075.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6216

## ENT-P-workspace-0076 — palette.setDensity pela porta palette.setDensity#elements-density-two-columns
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2255` `"kind": "panel-control",`
- **Comando:** palette.setDensity
- **Porta:** `manifest/commands/workspace.json:2254` `"id": "elements-density-two-columns",`
- **Tratador:** `src/app/commands.ts:493` `'palette.setDensity': setDensity,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0076.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6216

## ENT-P-workspace-0077 — palette.setDensity pela porta palette.setDensity#elements-density-three-columns
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2283` `"kind": "panel-control",`
- **Comando:** palette.setDensity
- **Porta:** `manifest/commands/workspace.json:2282` `"id": "elements-density-three-columns",`
- **Tratador:** `src/app/commands.ts:493` `'palette.setDensity': setDensity,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0077.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6216

## ENT-P-workspace-0078 — palette.setDensity pela porta palette.setDensity#elements-density-icons
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2311` `"kind": "panel-control",`
- **Comando:** palette.setDensity
- **Porta:** `manifest/commands/workspace.json:2310` `"id": "elements-density-icons",`
- **Tratador:** `src/app/commands.ts:493` `'palette.setDensity': setDensity,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0078.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6216

## ENT-P-workspace-0079 — layers.setExpanded pela porta layers.setExpanded#layers-caret
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2372` `"kind": "panel-control",`
- **Comando:** layers.setExpanded
- **Porta:** `manifest/commands/workspace.json:2371` `"id": "layers-caret",`
- **Tratador:** `src/app/commands.ts:494` `'layers.setExpanded': setExpanded,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0079.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6217

## ENT-P-workspace-0080 — layers.setExpanded pela porta layers.setExpanded#layers-drag-layers-row-collapsed-row-dwell
- **Tipo:** comando-porta layers-drag `manifest/commands/workspace.json:2400` `"kind": "layers-drag",`
- **Comando:** layers.setExpanded
- **Porta:** `manifest/commands/workspace.json:2399` `"id": "layers-drag-layers-row-collapsed-row-dwell",`
- **Gatilho:** `manifest/commands/workspace.json:2402` `"source": "layers-row",` `manifest/commands/workspace.json:2403` `"zone": "collapsed-row-dwell",` `manifest/commands/workspace.json:2404` `"gesture": "layers-drag",`
- **Tratador:** `src/app/commands.ts:494` `'layers.setExpanded': setExpanded,`
- **Início:** `src/editor/input/pointer/drag.ts:189` `shared.open?.dispatch(dwell.command.id as CommandId, { ...dwell.door.args, target: folded } as never);`
- **Fluxo:** `fluxos/ENT-P-workspace-0080.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6217

## ENT-P-workspace-0081 — layers.collapseAll pela porta layers.collapseAll#toolbar-layers-header-collapse-all
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:2440` `"kind": "toolbar",`
- **Comando:** layers.collapseAll
- **Porta:** `manifest/commands/workspace.json:2439` `"id": "toolbar-layers-header-collapse-all",`
- **Tratador:** `src/app/commands.ts:495` `'layers.collapseAll': collapseAll,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0081.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6218

## ENT-P-workspace-0082 — layers.expandAll pela porta layers.expandAll#toolbar-layers-header-expand-all
- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:2480` `"kind": "toolbar",`
- **Comando:** layers.expandAll
- **Porta:** `manifest/commands/workspace.json:2479` `"id": "toolbar-layers-header-expand-all",`
- **Tratador:** `src/app/commands.ts:496` `'layers.expandAll': expandAll,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0082.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6219

## ENT-P-workspace-0083 — layers.expandOrFocusChild pela porta layers.expandOrFocusChild#key-arrow-right-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:2526` `"kind": "shortcut",`
- **Comando:** layers.expandOrFocusChild
- **Porta:** `manifest/commands/workspace.json:2525` `"id": "key-arrow-right-in-layers-tree",`
- **Gatilho:** `manifest/commands/workspace.json:2528` `"chord": "ArrowRight",`
- **Tratador:** `src/app/commands.ts:497` `'layers.expandOrFocusChild': expandOrFocusChild,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0083.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6220

## ENT-P-workspace-0084 — layers.collapseOrFocusParent pela porta layers.collapseOrFocusParent#key-arrow-left-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:2570` `"kind": "shortcut",`
- **Comando:** layers.collapseOrFocusParent
- **Porta:** `manifest/commands/workspace.json:2569` `"id": "key-arrow-left-in-layers-tree",`
- **Gatilho:** `manifest/commands/workspace.json:2572` `"chord": "ArrowLeft",`
- **Tratador:** `src/app/commands.ts:498` `'layers.collapseOrFocusParent': collapseOrFocusParent,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0084.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6221

## ENT-P-workspace-0085 — layers.setRowDetails pela porta layers.setRowDetails#menu-layers-row-details-tag
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:2624` `"kind": "menu",`
- **Comando:** layers.setRowDetails
- **Porta:** `manifest/commands/workspace.json:2623` `"id": "menu-layers-row-details-tag",`
- **Tratador:** `src/app/commands.ts:499` `'layers.setRowDetails': setRowDetails,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0085.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6222

## ENT-P-workspace-0086 — layers.setRowDetails pela porta layers.setRowDetails#menu-layers-row-details-id
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:2648` `"kind": "menu",`
- **Comando:** layers.setRowDetails
- **Porta:** `manifest/commands/workspace.json:2647` `"id": "menu-layers-row-details-id",`
- **Tratador:** `src/app/commands.ts:499` `'layers.setRowDetails': setRowDetails,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0086.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6222

## ENT-P-workspace-0087 — layers.setRowDetails pela porta layers.setRowDetails#menu-layers-row-details-classes
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:2672` `"kind": "menu",`
- **Comando:** layers.setRowDetails
- **Porta:** `manifest/commands/workspace.json:2671` `"id": "menu-layers-row-details-classes",`
- **Tratador:** `src/app/commands.ts:499` `'layers.setRowDetails': setRowDetails,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0087.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6222

## ENT-P-workspace-0088 — layers.setRowDetails pela porta layers.setRowDetails#menu-layers-row-details-attributes
- **Tipo:** comando-porta menu `manifest/commands/workspace.json:2696` `"kind": "menu",`
- **Comando:** layers.setRowDetails
- **Porta:** `manifest/commands/workspace.json:2695` `"id": "menu-layers-row-details-attributes",`
- **Tratador:** `src/app/commands.ts:499` `'layers.setRowDetails': setRowDetails,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0088.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6222

## ENT-P-workspace-0089 — layers.search pela porta layers.search#layers-search-field
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2744` `"kind": "panel-control",`
- **Comando:** layers.search
- **Porta:** `manifest/commands/workspace.json:2743` `"id": "layers-search-field",`
- **Tratador:** `src/app/commands.ts:500` `'layers.search': search,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0089.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6223

## ENT-P-workspace-0090 — inspector.toggleSection pela porta inspector.toggleSection#inspector-section-header
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2795` `"kind": "panel-control",`
- **Comando:** inspector.toggleSection
- **Porta:** `manifest/commands/workspace.json:2794` `"id": "inspector-section-header",`
- **Tratador:** `src/app/commands.ts:501` `'inspector.toggleSection': toggleSection,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0090.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6224

## ENT-P-workspace-0091 — inspector.toggleRow pela porta inspector.toggleRow#inspector-row-disclosure
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2846` `"kind": "panel-control",`
- **Comando:** inspector.toggleRow
- **Porta:** `manifest/commands/workspace.json:2845` `"id": "inspector-row-disclosure",`
- **Tratador:** `src/app/commands.ts:502` `'inspector.toggleRow': toggleRow,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0091.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6225

## ENT-P-workspace-0092 — inspector.setMode pela porta inspector.setMode#inspector-mode-essentials
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2899` `"kind": "panel-control",`
- **Comando:** inspector.setMode
- **Porta:** `manifest/commands/workspace.json:2898` `"id": "inspector-mode-essentials",`
- **Tratador:** `src/app/commands.ts:503` `'inspector.setMode': setMode,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0092.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6226

## ENT-P-workspace-0093 — inspector.setMode pela porta inspector.setMode#inspector-mode-all
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2927` `"kind": "panel-control",`
- **Comando:** inspector.setMode
- **Porta:** `manifest/commands/workspace.json:2926` `"id": "inspector-mode-all",`
- **Tratador:** `src/app/commands.ts:503` `'inspector.setMode': setMode,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0093.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6226

## ENT-P-workspace-0094 — inspector.reveal pela porta inspector.reveal#inspector-add-property-item
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2985` `"kind": "panel-control",`
- **Comando:** inspector.reveal
- **Porta:** `manifest/commands/workspace.json:2984` `"id": "inspector-add-property-item",`
- **Tratador:** `src/app/commands.ts:504` `'inspector.reveal': revealField,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0094.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6227

## ENT-P-workspace-0095 — inspector.reveal pela porta inspector.reveal#command-bar-edit-property
- **Tipo:** comando-porta command-bar `manifest/commands/workspace.json:3011` `"kind": "command-bar",`
- **Comando:** inspector.reveal
- **Porta:** `manifest/commands/workspace.json:3010` `"id": "command-bar-edit-property",`
- **Tratador:** `src/app/commands.ts:504` `'inspector.reveal': revealField,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0095.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6227

## ENT-P-workspace-0096 — inspector.reveal pela porta inspector.reveal#canvas-double-click-form-control
- **Tipo:** comando-porta canvas-click `manifest/commands/workspace.json:3032` `"kind": "canvas-click",`
- **Comando:** inspector.reveal
- **Porta:** `manifest/commands/workspace.json:3031` `"id": "canvas-double-click-form-control",`
- **Gatilho:** `manifest/commands/workspace.json:3038` `"gesture": "canvas-click",`
- **Tratador:** `src/app/commands.ts:504` `'inspector.reveal': revealField,`
- **Início:** `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`
- **Fluxo:** `fluxos/ENT-P-workspace-0096.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6227

## ENT-P-workspace-0097 — inspector.search pela porta inspector.search#inspector-search-field
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3080` `"kind": "panel-control",`
- **Comando:** inspector.search
- **Porta:** `manifest/commands/workspace.json:3079` `"id": "inspector-search-field",`
- **Tratador:** `src/app/commands.ts:506` `'inspector.search': searchInspector,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0097.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6228

## ENT-P-workspace-0098 — codePanel.setPane pela porta codePanel.setPane#code-panel-tab-html
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3134` `"kind": "panel-control",`
- **Comando:** codePanel.setPane
- **Porta:** `manifest/commands/workspace.json:3133` `"id": "code-panel-tab-html",`
- **Tratador:** `src/app/commands.ts:507` `'codePanel.setPane': setPane,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0098.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6229

## ENT-P-workspace-0099 — codePanel.setPane pela porta codePanel.setPane#code-panel-tab-css
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3162` `"kind": "panel-control",`
- **Comando:** codePanel.setPane
- **Porta:** `manifest/commands/workspace.json:3161` `"id": "code-panel-tab-css",`
- **Tratador:** `src/app/commands.ts:507` `'codePanel.setPane': setPane,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0099.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6229

## ENT-P-workspace-0100 — codePanel.setPane pela porta codePanel.setPane#code-panel-tab-js
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3190` `"kind": "panel-control",`
- **Comando:** codePanel.setPane
- **Porta:** `manifest/commands/workspace.json:3189` `"id": "code-panel-tab-js",`
- **Tratador:** `src/app/commands.ts:507` `'codePanel.setPane': setPane,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0100.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6229

## ENT-P-workspace-0101 — codePanel.copyPane pela porta codePanel.copyPane#code-panel-copy
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3236` `"kind": "panel-control",`
- **Comando:** codePanel.copyPane
- **Porta:** `manifest/commands/workspace.json:3235` `"id": "code-panel-copy",`
- **Tratador:** `src/app/commands.ts:508` `'codePanel.copyPane': copyPane,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0101.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6230

## ENT-P-workspace-0102 — codePanel.downloadPane pela porta codePanel.downloadPane#code-panel-download
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3280` `"kind": "panel-control",`
- **Comando:** codePanel.downloadPane
- **Porta:** `manifest/commands/workspace.json:3279` `"id": "code-panel-download",`
- **Tratador:** `src/app/commands.ts:509` `'codePanel.downloadPane': downloadPane,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0102.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6231

## ENT-P-workspace-0103 — colorPicker.open pela porta colorPicker.open#field-color-swatch
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3332` `"kind": "panel-control",`
- **Comando:** colorPicker.open
- **Porta:** `manifest/commands/workspace.json:3347` `"id": "field-color-swatch",`
- **Tratador:** `src/app/commands.ts:401` `'colorPicker.open': openColorPicker,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0103.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6232

## ENT-P-workspace-0104 — colorPicker.setFormat pela porta colorPicker.setFormat#color-picker-format-hsb
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3388` `"kind": "panel-control",`
- **Comando:** colorPicker.setFormat
- **Porta:** `manifest/commands/workspace.json:3405` `"id": "color-picker-format-hsb",`
- **Tratador:** `src/app/commands.ts:402` `'colorPicker.setFormat': setColorFormat,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0104.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6233

## ENT-P-workspace-0105 — colorPicker.setFormat pela porta colorPicker.setFormat#color-picker-format-rgb
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3416` `"kind": "panel-control",`
- **Comando:** colorPicker.setFormat
- **Porta:** `manifest/commands/workspace.json:3433` `"id": "color-picker-format-rgb",`
- **Tratador:** `src/app/commands.ts:402` `'colorPicker.setFormat': setColorFormat,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0105.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6233

## ENT-P-workspace-0106 — colorPicker.setFormat pela porta colorPicker.setFormat#color-picker-format-hex
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3444` `"kind": "panel-control",`
- **Comando:** colorPicker.setFormat
- **Porta:** `manifest/commands/workspace.json:3461` `"id": "color-picker-format-hex",`
- **Tratador:** `src/app/commands.ts:402` `'colorPicker.setFormat': setColorFormat,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0106.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6233

## ENT-P-workspace-0107 — colorPicker.setFormat pela porta colorPicker.setFormat#color-picker-format-oklch
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3472` `"kind": "panel-control",`
- **Comando:** colorPicker.setFormat
- **Porta:** `manifest/commands/workspace.json:3489` `"id": "color-picker-format-oklch",`
- **Tratador:** `src/app/commands.ts:402` `'colorPicker.setFormat': setColorFormat,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0107.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6233

## ENT-P-workspace-0108 — colorPicker.setFormat pela porta colorPicker.setFormat#color-picker-format-oklab
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3500` `"kind": "panel-control",`
- **Comando:** colorPicker.setFormat
- **Porta:** `manifest/commands/workspace.json:3517` `"id": "color-picker-format-oklab",`
- **Tratador:** `src/app/commands.ts:402` `'colorPicker.setFormat': setColorFormat,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0108.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6233

## ENT-P-workspace-0109 — colorPicker.setChannel pela porta colorPicker.setChannel#color-picker-channel
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3589` `"kind": "panel-control",`
- **Comando:** colorPicker.setChannel
- **Porta:** `manifest/commands/workspace.json:3604` `"id": "color-picker-channel",`
- **Tratador:** `src/app/commands.ts:403` `'colorPicker.setChannel': setColorChannel,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0109.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6234

## ENT-P-workspace-0110 — colorPicker.cancel pela porta colorPicker.cancel#color-picker-cancel
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3633` `"kind": "panel-control",`
- **Comando:** colorPicker.cancel
- **Porta:** `manifest/commands/workspace.json:3648` `"id": "color-picker-cancel",`
- **Tratador:** `src/app/commands.ts:405` `'colorPicker.cancel': cancelColorPicker,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0110.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6235

## ENT-P-workspace-0111 — colorPicker.apply pela porta colorPicker.apply#color-picker-apply
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3677` `"kind": "panel-control",`
- **Comando:** colorPicker.apply
- **Porta:** `manifest/commands/workspace.json:3692` `"id": "color-picker-apply",`
- **Tratador:** `src/app/commands.ts:404` `'colorPicker.apply': applyColorPicker,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0111.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6236

## ENT-P-workspace-0112 — quickPanel.setOpen pela porta quickPanel.setOpen#chip
- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3735` `"kind": "panel-control",`
- **Comando:** quickPanel.setOpen
- **Porta:** `manifest/commands/workspace.json:3734` `"id": "chip",`
- **Tratador:** `src/app/commands.ts:488` `'quickPanel.setOpen': setOpen,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-workspace-0112.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6237

## ENT-P-workspace-0113 — quickPanel.setOpen pela porta quickPanel.setOpen#key-ctrl-shift-q-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:3763` `"kind": "shortcut",`
- **Comando:** quickPanel.setOpen
- **Porta:** `manifest/commands/workspace.json:3762` `"id": "key-ctrl-shift-q-in-global",`
- **Gatilho:** `manifest/commands/workspace.json:3764` `"chord": "Ctrl+Shift+Q",`
- **Tratador:** `src/app/commands.ts:488` `'quickPanel.setOpen': setOpen,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0113.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6237

## ENT-P-workspace-0114 — quickPanel.setOpen pela porta quickPanel.setOpen#key-escape-in-quick-panel
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:3785` `"kind": "shortcut",`
- **Comando:** quickPanel.setOpen
- **Porta:** `manifest/commands/workspace.json:3784` `"id": "key-escape-in-quick-panel",`
- **Gatilho:** `manifest/commands/workspace.json:3786` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:488` `'quickPanel.setOpen': setOpen,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0114.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6237

## ENT-P-workspace-0115 — quickPanel.setOpen pela porta quickPanel.setOpen#key-ctrl-shift-q-in-quick-panel
- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:3807` `"kind": "shortcut",`
- **Comando:** quickPanel.setOpen
- **Porta:** `manifest/commands/workspace.json:3806` `"id": "key-ctrl-shift-q-in-quick-panel",`
- **Gatilho:** `manifest/commands/workspace.json:3808` `"chord": "Ctrl+Shift+Q",`
- **Tratador:** `src/app/commands.ts:488` `'quickPanel.setOpen': setOpen,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-workspace-0115.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-6237
