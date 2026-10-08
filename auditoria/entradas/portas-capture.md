# Portas de comando do domínio capture

Fonte: `manifest/commands/capture.json`. Um bloco por porta.

## ENT-P-capture-0001 — capture.edit pela porta capture.edit#captured-value
- **Tipo:** comando-porta panel-control `manifest/commands/capture.json:67` `"kind": "panel-control",`
- **Comando:** capture.edit
- **Porta:** `manifest/commands/capture.json:66` `"id": "captured-value",`
- **Tratador:** `src/app/commands.ts:217` `'capture.edit': editCaptureCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-capture-0001.md`
- **Requisitos:** REQ-0401

## ENT-P-capture-0002 — capture.edit pela porta capture.edit#captured-apply
- **Tipo:** comando-porta panel-control `manifest/commands/capture.json:93` `"kind": "panel-control",`
- **Comando:** capture.edit
- **Porta:** `manifest/commands/capture.json:92` `"id": "captured-apply",`
- **Tratador:** `src/app/commands.ts:217` `'capture.edit': editCaptureCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-capture-0002.md`
- **Requisitos:** REQ-0401

## ENT-P-capture-0003 — capture.edit pela porta capture.edit#key-enter-in-captured-value
- **Tipo:** comando-porta shortcut `manifest/commands/capture.json:119` `"kind": "shortcut",`
- **Comando:** capture.edit
- **Porta:** `manifest/commands/capture.json:118` `"id": "key-enter-in-captured-value",`
- **Gatilho:** `manifest/commands/capture.json:121` `"chord": "Enter",`
- **Tratador:** `src/app/commands.ts:217` `'capture.edit': editCaptureCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-capture-0003.md`
- **Requisitos:** REQ-0401

## ENT-P-capture-0004 — capture.select pela porta capture.select#captured-inspector-node
- **Tipo:** comando-porta panel-control `manifest/commands/capture.json:165` `"kind": "panel-control",`
- **Comando:** capture.select
- **Porta:** `manifest/commands/capture.json:164` `"id": "captured-inspector-node",`
- **Tratador:** `src/app/commands.ts:218` `'capture.select': selectCapturedCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-capture-0004.md`
- **Requisitos:** REQ-0402

## ENT-P-capture-0005 — capture.select pela porta capture.select#canvas-click-captured-element
- **Tipo:** comando-porta canvas-click `manifest/commands/capture.json:191` `"kind": "canvas-click",`
- **Comando:** capture.select
- **Porta:** `manifest/commands/capture.json:190` `"id": "canvas-click-captured-element",`
- **Gatilho:** `manifest/commands/capture.json:197` `"gesture": "canvas-click",`
- **Tratador:** `src/app/commands.ts:218` `'capture.select': selectCapturedCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`
- **Fluxo:** `fluxos/ENT-P-capture-0005.md`
- **Requisitos:** REQ-0402
