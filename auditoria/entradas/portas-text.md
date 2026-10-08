# Portas de comando — domínio text

Fonte: `manifest/commands/text.json`. Uma porta por bloco, na ordem do manifesto.

## ENT-P-text-0001 — text.startEdit pela porta text.startEdit#canvas-double-click-text-element
- **Tipo:** comando-porta canvas-click `manifest/commands/text.json:26` `"kind": "canvas-click",`
- **Comando:** text.startEdit
- **Porta:** `manifest/commands/text.json:25` `"id": "canvas-double-click-text-element",`
- **Gatilho:** `manifest/commands/text.json:32` `"gesture": "canvas-click",`
- **Tratador:** `src/app/commands.ts:430` `'text.startEdit': startEdit,`
- **Início:** `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`
- **Fluxo:** `fluxos/ENT-P-text-0001.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2401

## ENT-P-text-0002 — text.startEdit pela porta text.startEdit#key-enter-in-canvas
- **Tipo:** comando-porta shortcut `manifest/commands/text.json:48` `"kind": "shortcut",`
- **Comando:** text.startEdit
- **Porta:** `manifest/commands/text.json:47` `"id": "key-enter-in-canvas",`
- **Gatilho:** `manifest/commands/text.json:50` `"chord": "Enter",`
- **Tratador:** `src/app/commands.ts:430` `'text.startEdit': startEdit,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-text-0002.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2401

## ENT-P-text-0003 — text.startEdit pela porta text.startEdit#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/text.json:68` `"kind": "command-bar",`
- **Comando:** text.startEdit
- **Porta:** `manifest/commands/text.json:67` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:430` `'text.startEdit': startEdit,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-text-0003.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2401

## ENT-P-text-0004 — text.set pela porta text.set#key-enter-in-text-editing
- **Tipo:** comando-porta shortcut `manifest/commands/text.json:126` `"kind": "shortcut",`
- **Comando:** text.set
- **Porta:** `manifest/commands/text.json:125` `"id": "key-enter-in-text-editing",`
- **Gatilho:** `manifest/commands/text.json:128` `"chord": "Enter",`
- **Tratador:** `src/app/commands.ts:431` `'text.set': setTextCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-text-0004.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2402

## ENT-P-text-0005 — text.set pela porta text.set#key-escape-in-text-editing
- **Tipo:** comando-porta shortcut `manifest/commands/text.json:146` `"kind": "shortcut",`
- **Comando:** text.set
- **Porta:** `manifest/commands/text.json:145` `"id": "key-escape-in-text-editing",`
- **Gatilho:** `manifest/commands/text.json:148` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:431` `'text.set': setTextCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-text-0005.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2402

## ENT-P-text-0006 — text.set pela porta text.set#canvas-click-outside-edited-element
- **Tipo:** comando-porta canvas-click `manifest/commands/text.json:166` `"kind": "canvas-click",`
- **Comando:** text.set
- **Porta:** `manifest/commands/text.json:165` `"id": "canvas-click-outside-edited-element",`
- **Gatilho:** `manifest/commands/text.json:172` `"gesture": "canvas-click",`
- **Tratador:** `src/app/commands.ts:431` `'text.set': setTextCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:251` `if (kept) store.dispatch(kept.entry.command.id as CommandId, kept.args as never);`
- **Fluxo:** `fluxos/ENT-P-text-0006.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2402

## ENT-P-text-0007 — text.set pela porta text.set#inspector-text
- **Tipo:** comando-porta inspector-field `manifest/commands/text.json:188` `"kind": "inspector-field",`
- **Comando:** text.set
- **Porta:** `manifest/commands/text.json:187` `"id": "inspector-text",`
- **Tratador:** `src/app/commands.ts:431` `'text.set': setTextCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-text-0007.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2402

## ENT-P-text-0008 — text.set pela porta text.set#key-enter-in-element-text-field
- **Tipo:** comando-porta shortcut `manifest/commands/text.json:214` `"kind": "shortcut",`
- **Comando:** text.set
- **Porta:** `manifest/commands/text.json:213` `"id": "key-enter-in-element-text-field",`
- **Gatilho:** `manifest/commands/text.json:216` `"chord": "Enter",`
- **Tratador:** `src/app/commands.ts:431` `'text.set': setTextCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-text-0008.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2402

## ENT-P-text-0009 — text.set pela porta text.set#quick-panel-text
- **Tipo:** comando-porta quick-panel `manifest/commands/text.json:234` `"kind": "quick-panel",`
- **Comando:** text.set
- **Porta:** `manifest/commands/text.json:233` `"id": "quick-panel-text",`
- **Tratador:** `src/app/commands.ts:431` `'text.set': setTextCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-text-0009.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2402

## ENT-P-text-0010 — text.cancelEdit pela porta text.cancelEdit#key-escape-in-element-text-field
- **Tipo:** comando-porta shortcut `manifest/commands/text.json:275` `"kind": "shortcut",`
- **Comando:** text.cancelEdit
- **Porta:** `manifest/commands/text.json:274` `"id": "key-escape-in-element-text-field",`
- **Gatilho:** `manifest/commands/text.json:277` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:432` `'text.cancelEdit': cancelEdit,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-text-0010.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2403

## ENT-P-text-0011 — text.insertLineBreak pela porta text.insertLineBreak#key-shift-enter-in-text-editing
- **Tipo:** comando-porta shortcut `manifest/commands/text.json:313` `"kind": "shortcut",`
- **Comando:** text.insertLineBreak
- **Porta:** `manifest/commands/text.json:312` `"id": "key-shift-enter-in-text-editing",`
- **Gatilho:** `manifest/commands/text.json:315` `"chord": "Shift+Enter",`
- **Tratador:** `src/app/commands.ts:433` `'text.insertLineBreak': insertLineBreak,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-text-0011.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2404

## ENT-P-text-0012 — text.toggleBold pela porta text.toggleBold#key-ctrl-b-in-text-editing
- **Tipo:** comando-porta shortcut `manifest/commands/text.json:351` `"kind": "shortcut",`
- **Comando:** text.toggleBold
- **Porta:** `manifest/commands/text.json:350` `"id": "key-ctrl-b-in-text-editing",`
- **Gatilho:** `manifest/commands/text.json:353` `"chord": "Ctrl+B",`
- **Tratador:** `src/app/commands.ts:434` `'text.toggleBold': toggleBold,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-text-0012.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2405

## ENT-P-text-0013 — text.toggleBold pela porta text.toggleBold#toolbar-text-toolbar-bold
- **Tipo:** comando-porta toolbar `manifest/commands/text.json:371` `"kind": "toolbar",`
- **Comando:** text.toggleBold
- **Porta:** `manifest/commands/text.json:370` `"id": "toolbar-text-toolbar-bold",`
- **Tratador:** `src/app/commands.ts:434` `'text.toggleBold': toggleBold,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-text-0013.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2405

## ENT-P-text-0014 — text.toggleItalic pela porta text.toggleItalic#key-ctrl-i-in-text-editing
- **Tipo:** comando-porta shortcut `manifest/commands/text.json:411` `"kind": "shortcut",`
- **Comando:** text.toggleItalic
- **Porta:** `manifest/commands/text.json:410` `"id": "key-ctrl-i-in-text-editing",`
- **Gatilho:** `manifest/commands/text.json:413` `"chord": "Ctrl+I",`
- **Tratador:** `src/app/commands.ts:435` `'text.toggleItalic': toggleItalic,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-text-0014.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2406

## ENT-P-text-0015 — text.toggleItalic pela porta text.toggleItalic#toolbar-text-toolbar-italic
- **Tipo:** comando-porta toolbar `manifest/commands/text.json:431` `"kind": "toolbar",`
- **Comando:** text.toggleItalic
- **Porta:** `manifest/commands/text.json:430` `"id": "toolbar-text-toolbar-italic",`
- **Tratador:** `src/app/commands.ts:435` `'text.toggleItalic': toggleItalic,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-text-0015.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2406

## ENT-P-text-0016 — text.editLink pela porta text.editLink#key-ctrl-k-in-text-editing
- **Tipo:** comando-porta shortcut `manifest/commands/text.json:479` `"kind": "shortcut",`
- **Comando:** text.editLink
- **Porta:** `manifest/commands/text.json:478` `"id": "key-ctrl-k-in-text-editing",`
- **Gatilho:** `manifest/commands/text.json:481` `"chord": "Ctrl+K",`
- **Tratador:** `src/app/commands.ts:436` `'text.editLink': editLink,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-text-0016.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2407

## ENT-P-text-0017 — text.editLink pela porta text.editLink#toolbar-text-toolbar-link
- **Tipo:** comando-porta toolbar `manifest/commands/text.json:499` `"kind": "toolbar",`
- **Comando:** text.editLink
- **Porta:** `manifest/commands/text.json:498` `"id": "toolbar-text-toolbar-link",`
- **Tratador:** `src/app/commands.ts:436` `'text.editLink': editLink,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-text-0017.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2407

## ENT-P-text-0018 — text.paste pela porta text.paste#key-ctrl-v-in-text-editing
- **Tipo:** comando-porta shortcut `manifest/commands/text.json:548` `"kind": "shortcut",`
- **Comando:** text.paste
- **Porta:** `manifest/commands/text.json:547` `"id": "key-ctrl-v-in-text-editing",`
- **Gatilho:** `manifest/commands/text.json:550` `"chord": "Ctrl+V",`
- **Tratador:** `src/app/commands.ts:437` `'text.paste': pasteText,`
- **Início:** `src/editor/input/keymap.ts:532` `else if (gesture === null) void readClipboard().then((content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`
- **Fluxo:** `fluxos/ENT-P-text-0018.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2408

## ENT-P-text-0019 — text.selectAll pela porta text.selectAll#key-ctrl-a-in-text-editing
- **Tipo:** comando-porta shortcut `manifest/commands/text.json:586` `"kind": "shortcut",`
- **Comando:** text.selectAll
- **Porta:** `manifest/commands/text.json:585` `"id": "key-ctrl-a-in-text-editing",`
- **Gatilho:** `manifest/commands/text.json:588` `"chord": "Ctrl+A",`
- **Tratador:** `src/app/commands.ts:438` `'text.selectAll': selectAllText,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-text-0019.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2409
