# Portas de comando — domínio history

Fonte: `manifest/commands/history.json`. Uma porta por bloco, na ordem do manifesto.

## ENT-P-history-0001 — history.undo pela porta key-ctrl-z-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/history.json:22` `"kind": "shortcut",`
- **Comando:** history.undo
- **Porta:** `manifest/commands/history.json:21` `"id": "key-ctrl-z-in-global",`
- **Gatilho:** `manifest/commands/history.json:24` `"chord": "Ctrl+Z",`
- **Tratador:** `src/app/commands.ts:332` `'history.undo': undoCommand,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-history-0001.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1401

## ENT-P-history-0002 — history.undo pela porta toolbar-top-bar
- **Tipo:** comando-porta toolbar `manifest/commands/history.json:42` `"kind": "toolbar",`
- **Comando:** history.undo
- **Porta:** `manifest/commands/history.json:41` `"id": "toolbar-top-bar",`
- **Tratador:** `src/app/commands.ts:332` `'history.undo': undoCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-history-0002.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1401

## ENT-P-history-0003 — history.undo pela porta toast-undo
- **Tipo:** comando-porta panel-control `manifest/commands/history.json:64` `"kind": "panel-control",`
- **Comando:** history.undo
- **Porta:** `manifest/commands/history.json:63` `"id": "toast-undo",`
- **Tratador:** `src/app/commands.ts:332` `'history.undo': undoCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-history-0003.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1401

## ENT-P-history-0004 — history.undo pela porta menu-edit
- **Tipo:** comando-porta menu `manifest/commands/history.json:90` `"kind": "menu",`
- **Comando:** history.undo
- **Porta:** `manifest/commands/history.json:89` `"id": "menu-edit",`
- **Tratador:** `src/app/commands.ts:332` `'history.undo': undoCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-history-0004.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1401

## ENT-P-history-0005 — history.undo pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/history.json:112` `"kind": "command-bar",`
- **Comando:** history.undo
- **Porta:** `manifest/commands/history.json:111` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:332` `'history.undo': undoCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-history-0005.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1401

## ENT-P-history-0006 — history.redo pela porta key-ctrl-shift-z-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/history.json:151` `"kind": "shortcut",`
- **Comando:** history.redo
- **Porta:** `manifest/commands/history.json:150` `"id": "key-ctrl-shift-z-in-global",`
- **Gatilho:** `manifest/commands/history.json:153` `"chord": "Ctrl+Shift+Z",`
- **Tratador:** `src/app/commands.ts:333` `'history.redo': redoCommand,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-history-0006.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1402

## ENT-P-history-0007 — history.redo pela porta key-ctrl-y-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/history.json:171` `"kind": "shortcut",`
- **Comando:** history.redo
- **Porta:** `manifest/commands/history.json:170` `"id": "key-ctrl-y-in-global",`
- **Gatilho:** `manifest/commands/history.json:173` `"chord": "Ctrl+Y",`
- **Tratador:** `src/app/commands.ts:333` `'history.redo': redoCommand,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-history-0007.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1402

## ENT-P-history-0008 — history.redo pela porta toolbar-top-bar
- **Tipo:** comando-porta toolbar `manifest/commands/history.json:191` `"kind": "toolbar",`
- **Comando:** history.redo
- **Porta:** `manifest/commands/history.json:190` `"id": "toolbar-top-bar",`
- **Tratador:** `src/app/commands.ts:333` `'history.redo': redoCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-history-0008.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1402

## ENT-P-history-0009 — history.redo pela porta menu-edit
- **Tipo:** comando-porta menu `manifest/commands/history.json:213` `"kind": "menu",`
- **Comando:** history.redo
- **Porta:** `manifest/commands/history.json:212` `"id": "menu-edit",`
- **Tratador:** `src/app/commands.ts:333` `'history.redo': redoCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-history-0009.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1402

## ENT-P-history-0010 — history.redo pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/history.json:235` `"kind": "command-bar",`
- **Comando:** history.redo
- **Porta:** `manifest/commands/history.json:234` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:333` `'history.redo': redoCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-history-0010.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1402
