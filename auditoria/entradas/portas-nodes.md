# Portas de comando — domínio nodes

Fonte: `manifest/commands/nodes.json`. Uma porta por bloco, na ordem do manifesto.

## ENT-P-nodes-0001 — layers.startRename pela porta layers.startRename#key-f2-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/nodes.json:26` `"kind": "shortcut",`
- **Comando:** layers.startRename
- **Porta:** `manifest/commands/nodes.json:25` `"id": "key-f2-in-canvas",`
- **Gatilho:** `manifest/commands/nodes.json:28` `"chord": "F2",`
- **Tratador:** `src/app/commands.ts:334` `'layers.startRename': startRename,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-nodes-0001.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1801

## ENT-P-nodes-0002 — layers.startRename pela porta layers.startRename#layers-row-name
- **Tipo:** comando-porta panel-control `manifest/commands/nodes.json:46` `"kind": "panel-control",`
- **Comando:** layers.startRename
- **Porta:** `manifest/commands/nodes.json:45` `"id": "layers-row-name",`
- **Tratador:** `src/app/commands.ts:334` `'layers.startRename': startRename,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-nodes-0002.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1801

## ENT-P-nodes-0003 — layers.startRename pela porta layers.startRename#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/nodes.json:73` `"kind": "context-menu",`
- **Comando:** layers.startRename
- **Porta:** `manifest/commands/nodes.json:72` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:334` `'layers.startRename': startRename,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-nodes-0003.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1801

## ENT-P-nodes-0004 — layers.startRename pela porta layers.startRename#menu-arrange
- **Tipo:** comando-porta menu `manifest/commands/nodes.json:93` `"kind": "menu",`
- **Comando:** layers.startRename
- **Porta:** `manifest/commands/nodes.json:92` `"id": "menu-arrange",`
- **Tratador:** `src/app/commands.ts:334` `'layers.startRename': startRename,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-nodes-0004.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1801

## ENT-P-nodes-0005 — layers.startRename pela porta layers.startRename#key-f2-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/nodes.json:115` `"kind": "shortcut",`
- **Comando:** layers.startRename
- **Porta:** `manifest/commands/nodes.json:114` `"id": "key-f2-in-layers-tree",`
- **Gatilho:** `manifest/commands/nodes.json:117` `"chord": "F2",`
- **Tratador:** `src/app/commands.ts:334` `'layers.startRename': startRename,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-nodes-0005.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1801

## ENT-P-nodes-0006 — layers.startRename pela porta layers.startRename#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/nodes.json:135` `"kind": "command-bar",`
- **Comando:** layers.startRename
- **Porta:** `manifest/commands/nodes.json:134` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:334` `'layers.startRename': startRename,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-nodes-0006.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1801

## ENT-P-nodes-0007 — layers.cancelRename pela porta layers.cancelRename#key-escape-in-rename-field
- **Tipo:** comando-porta shortcut `manifest/commands/nodes.json:174` `"kind": "shortcut",`
- **Comando:** layers.cancelRename
- **Porta:** `manifest/commands/nodes.json:173` `"id": "key-escape-in-rename-field",`
- **Gatilho:** `manifest/commands/nodes.json:176` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:335` `'layers.cancelRename': cancelRename,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-nodes-0007.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1802

## ENT-P-nodes-0008 — element.rename pela porta element.rename#layers-row-name-field
- **Tipo:** comando-porta panel-control `manifest/commands/nodes.json:232` `"kind": "panel-control",`
- **Comando:** element.rename
- **Porta:** `manifest/commands/nodes.json:231` `"id": "layers-row-name-field",`
- **Tratador:** `src/app/commands.ts:336` `'element.rename': renameCommand,`
- **Início:** `src/editor/shell/sidebar/layers.tsx:79` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(LAYERS_NAME_FIELD.command.id as CommandId, { ...LAYERS_NAME_FIELD.door.args, target: node.id, name });`
- **Fluxo:** `fluxos/ENT-P-nodes-0008.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1803

## ENT-P-nodes-0009 — element.toggleLock pela porta element.toggleLock#layers-row-lock
- **Tipo:** comando-porta panel-control `manifest/commands/nodes.json:289` `"kind": "panel-control",`
- **Comando:** element.toggleLock
- **Porta:** `manifest/commands/nodes.json:288` `"id": "layers-row-lock",`
- **Tratador:** `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-nodes-0009.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1804

## ENT-P-nodes-0010 — element.toggleLock pela porta element.toggleLock#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/nodes.json:315` `"kind": "context-menu",`
- **Comando:** element.toggleLock
- **Porta:** `manifest/commands/nodes.json:314` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-nodes-0010.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1804

## ENT-P-nodes-0011 — element.toggleLock pela porta element.toggleLock#menu-element-actions
- **Tipo:** comando-porta menu `manifest/commands/nodes.json:335` `"kind": "menu",`
- **Comando:** element.toggleLock
- **Porta:** `manifest/commands/nodes.json:334` `"id": "menu-element-actions",`
- **Tratador:** `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-nodes-0011.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1804

## ENT-P-nodes-0012 — element.toggleLock pela porta element.toggleLock#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/nodes.json:357` `"kind": "command-bar",`
- **Comando:** element.toggleLock
- **Porta:** `manifest/commands/nodes.json:356` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-nodes-0012.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1804

## ENT-P-nodes-0013 — element.toggleHidden pela porta element.toggleHidden#layers-row-eye
- **Tipo:** comando-porta panel-control `manifest/commands/nodes.json:409` `"kind": "panel-control",`
- **Comando:** element.toggleHidden
- **Porta:** `manifest/commands/nodes.json:408` `"id": "layers-row-eye",`
- **Tratador:** `src/app/commands.ts:339` `'element.toggleHidden': toggleHiddenCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-nodes-0013.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1805

## ENT-P-nodes-0014 — element.toggleHidden pela porta element.toggleHidden#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/nodes.json:435` `"kind": "context-menu",`
- **Comando:** element.toggleHidden
- **Porta:** `manifest/commands/nodes.json:434` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:339` `'element.toggleHidden': toggleHiddenCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-nodes-0014.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1805

## ENT-P-nodes-0015 — element.toggleHidden pela porta element.toggleHidden#menu-element-actions
- **Tipo:** comando-porta menu `manifest/commands/nodes.json:455` `"kind": "menu",`
- **Comando:** element.toggleHidden
- **Porta:** `manifest/commands/nodes.json:454` `"id": "menu-element-actions",`
- **Tratador:** `src/app/commands.ts:339` `'element.toggleHidden': toggleHiddenCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-nodes-0015.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1805

## ENT-P-nodes-0016 — element.toggleHidden pela porta element.toggleHidden#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/nodes.json:477` `"kind": "command-bar",`
- **Comando:** element.toggleHidden
- **Porta:** `manifest/commands/nodes.json:476` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:339` `'element.toggleHidden': toggleHiddenCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-nodes-0016.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1805

## ENT-P-nodes-0017 — element.setLayerColor pela porta element.setLayerColor#layers-row-colour-dot
- **Tipo:** comando-porta panel-control `manifest/commands/nodes.json:531` `"kind": "panel-control",`
- **Comando:** element.setLayerColor
- **Porta:** `manifest/commands/nodes.json:530` `"id": "layers-row-colour-dot",`
- **Tratador:** `src/app/commands.ts:340` `'element.setLayerColor': setLayerColorCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-nodes-0017.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1806

## ENT-P-nodes-0018 — element.renameMany pela porta element.renameMany#batch-rename-apply
- **Tipo:** comando-porta panel-control `manifest/commands/nodes.json:594` `"kind": "panel-control",`
- **Comando:** element.renameMany
- **Porta:** `manifest/commands/nodes.json:593` `"id": "batch-rename-apply",`
- **Tratador:** `src/app/commands.ts:337` `'element.renameMany': renameManyCommand,`
- **Início:** `src/editor/shell/batch-rename.tsx:54` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(apply.command.id as CommandId, args);`
- **Fluxo:** `fluxos/ENT-P-nodes-0018.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1807
