# Portas do domínio clipboard

## ENT-P-clipboard-0001 — clipboard.copy pela porta key-ctrl-c-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/clipboard.json:25` `"kind": "shortcut",`
- **Comando:** clipboard.copy
- **Porta:** `manifest/commands/clipboard.json:24` `"id": "key-ctrl-c-in-global",`
- **Gatilho:** `manifest/commands/clipboard.json:27` `"chord": "Ctrl+C",`
- **Tratador:** `src/app/commands.ts:206` `'clipboard.copy': copyCommand,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-clipboard-0001.md`
- **Requisitos:** REQ-0601

## ENT-P-clipboard-0002 — clipboard.copy pela porta context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/clipboard.json:45` `"kind": "context-menu",`
- **Comando:** clipboard.copy
- **Porta:** `manifest/commands/clipboard.json:44` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:206` `'clipboard.copy': copyCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-clipboard-0002.md`
- **Requisitos:** REQ-0601

## ENT-P-clipboard-0003 — clipboard.copy pela porta menu-edit
- **Tipo:** comando-porta menu `manifest/commands/clipboard.json:65` `"kind": "menu",`
- **Comando:** clipboard.copy
- **Porta:** `manifest/commands/clipboard.json:64` `"id": "menu-edit",`
- **Tratador:** `src/app/commands.ts:206` `'clipboard.copy': copyCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-clipboard-0003.md`
- **Requisitos:** REQ-0601

## ENT-P-clipboard-0004 — clipboard.copy pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/clipboard.json:87` `"kind": "command-bar",`
- **Comando:** clipboard.copy
- **Porta:** `manifest/commands/clipboard.json:86` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:206` `'clipboard.copy': copyCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-clipboard-0004.md`
- **Requisitos:** REQ-0601

## ENT-P-clipboard-0005 — clipboard.paste pela porta key-ctrl-v-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/clipboard.json:147` `"kind": "shortcut",`
- **Comando:** clipboard.paste
- **Porta:** `manifest/commands/clipboard.json:146` `"id": "key-ctrl-v-in-global",`
- **Gatilho:** `manifest/commands/clipboard.json:149` `"chord": "Ctrl+V",`
- **Tratador:** `src/app/commands.ts:207` `'clipboard.paste': pasteCommand,`
- **Início:** `src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`
- **Fluxo:** `fluxos/ENT-P-clipboard-0005.md`
- **Requisitos:** REQ-0602

## ENT-P-clipboard-0006 — clipboard.paste pela porta context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/clipboard.json:167` `"kind": "context-menu",`
- **Comando:** clipboard.paste
- **Porta:** `manifest/commands/clipboard.json:166` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:207` `'clipboard.paste': pasteCommand,`
- **Início:** `src/editor/doors/door.tsx:112` `afterRead(store, readClipboard(), (content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));`
- **Fluxo:** `fluxos/ENT-P-clipboard-0006.md`
- **Requisitos:** REQ-0602

## ENT-P-clipboard-0007 — clipboard.paste pela porta menu-edit
- **Tipo:** comando-porta menu `manifest/commands/clipboard.json:187` `"kind": "menu",`
- **Comando:** clipboard.paste
- **Porta:** `manifest/commands/clipboard.json:186` `"id": "menu-edit",`
- **Tratador:** `src/app/commands.ts:207` `'clipboard.paste': pasteCommand,`
- **Início:** `src/editor/doors/door.tsx:112` `afterRead(store, readClipboard(), (content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));`
- **Fluxo:** `fluxos/ENT-P-clipboard-0007.md`
- **Requisitos:** REQ-0602

## ENT-P-clipboard-0008 — clipboard.paste pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/clipboard.json:209` `"kind": "command-bar",`
- **Comando:** clipboard.paste
- **Porta:** `manifest/commands/clipboard.json:208` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:207` `'clipboard.paste': pasteCommand,`
- **Início:** `src/editor/doors/door.tsx:112` `afterRead(store, readClipboard(), (content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));`
- **Fluxo:** `fluxos/ENT-P-clipboard-0008.md`
- **Requisitos:** REQ-0602

## ENT-P-clipboard-0009 — clipboard.cut pela porta key-ctrl-x-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/clipboard.json:255` `"kind": "shortcut",`
- **Comando:** clipboard.cut
- **Porta:** `manifest/commands/clipboard.json:254` `"id": "key-ctrl-x-in-global",`
- **Gatilho:** `manifest/commands/clipboard.json:257` `"chord": "Ctrl+X",`
- **Tratador:** `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-clipboard-0009.md`
- **Requisitos:** REQ-0603

## ENT-P-clipboard-0010 — clipboard.cut pela porta context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/clipboard.json:275` `"kind": "context-menu",`
- **Comando:** clipboard.cut
- **Porta:** `manifest/commands/clipboard.json:274` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-clipboard-0010.md`
- **Requisitos:** REQ-0603

## ENT-P-clipboard-0011 — clipboard.cut pela porta menu-edit
- **Tipo:** comando-porta menu `manifest/commands/clipboard.json:295` `"kind": "menu",`
- **Comando:** clipboard.cut
- **Porta:** `manifest/commands/clipboard.json:294` `"id": "menu-edit",`
- **Tratador:** `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-clipboard-0011.md`
- **Requisitos:** REQ-0603

## ENT-P-clipboard-0012 — clipboard.cut pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/clipboard.json:317` `"kind": "command-bar",`
- **Comando:** clipboard.cut
- **Porta:** `manifest/commands/clipboard.json:316` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-clipboard-0012.md`
- **Requisitos:** REQ-0603

## ENT-P-clipboard-0013 — clipboard.copyStyle pela porta key-ctrl-alt-c-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/clipboard.json:358` `"kind": "shortcut",`
- **Comando:** clipboard.copyStyle
- **Porta:** `manifest/commands/clipboard.json:357` `"id": "key-ctrl-alt-c-in-global",`
- **Gatilho:** `manifest/commands/clipboard.json:360` `"chord": "Ctrl+Alt+C",`
- **Tratador:** `src/app/commands.ts:209` `'clipboard.copyStyle': copyStyleCommand,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-clipboard-0013.md`
- **Requisitos:** REQ-0604

## ENT-P-clipboard-0014 — clipboard.copyStyle pela porta context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/clipboard.json:378` `"kind": "context-menu",`
- **Comando:** clipboard.copyStyle
- **Porta:** `manifest/commands/clipboard.json:377` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:209` `'clipboard.copyStyle': copyStyleCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-clipboard-0014.md`
- **Requisitos:** REQ-0604

## ENT-P-clipboard-0015 — clipboard.copyStyle pela porta menu-edit
- **Tipo:** comando-porta menu `manifest/commands/clipboard.json:398` `"kind": "menu",`
- **Comando:** clipboard.copyStyle
- **Porta:** `manifest/commands/clipboard.json:397` `"id": "menu-edit",`
- **Tratador:** `src/app/commands.ts:209` `'clipboard.copyStyle': copyStyleCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-clipboard-0015.md`
- **Requisitos:** REQ-0604

## ENT-P-clipboard-0016 — clipboard.copyStyle pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/clipboard.json:420` `"kind": "command-bar",`
- **Comando:** clipboard.copyStyle
- **Porta:** `manifest/commands/clipboard.json:419` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:209` `'clipboard.copyStyle': copyStyleCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-clipboard-0016.md`
- **Requisitos:** REQ-0604

## ENT-P-clipboard-0017 — clipboard.pasteStyle pela porta key-ctrl-alt-v-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/clipboard.json:474` `"kind": "shortcut",`
- **Comando:** clipboard.pasteStyle
- **Porta:** `manifest/commands/clipboard.json:473` `"id": "key-ctrl-alt-v-in-global",`
- **Gatilho:** `manifest/commands/clipboard.json:476` `"chord": "Ctrl+Alt+V",`
- **Tratador:** `src/app/commands.ts:210` `'clipboard.pasteStyle': pasteStyleCommand,`
- **Início:** `src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`
- **Fluxo:** `fluxos/ENT-P-clipboard-0017.md`
- **Requisitos:** REQ-0605

## ENT-P-clipboard-0018 — clipboard.pasteStyle pela porta context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/clipboard.json:494` `"kind": "context-menu",`
- **Comando:** clipboard.pasteStyle
- **Porta:** `manifest/commands/clipboard.json:493` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:210` `'clipboard.pasteStyle': pasteStyleCommand,`
- **Início:** `src/editor/doors/door.tsx:112` `afterRead(store, readClipboard(), (content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));`
- **Fluxo:** `fluxos/ENT-P-clipboard-0018.md`
- **Requisitos:** REQ-0605

## ENT-P-clipboard-0019 — clipboard.pasteStyle pela porta menu-edit
- **Tipo:** comando-porta menu `manifest/commands/clipboard.json:514` `"kind": "menu",`
- **Comando:** clipboard.pasteStyle
- **Porta:** `manifest/commands/clipboard.json:513` `"id": "menu-edit",`
- **Tratador:** `src/app/commands.ts:210` `'clipboard.pasteStyle': pasteStyleCommand,`
- **Início:** `src/editor/doors/door.tsx:112` `afterRead(store, readClipboard(), (content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));`
- **Fluxo:** `fluxos/ENT-P-clipboard-0019.md`
- **Requisitos:** REQ-0605

## ENT-P-clipboard-0020 — clipboard.pasteStyle pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/clipboard.json:536` `"kind": "command-bar",`
- **Comando:** clipboard.pasteStyle
- **Porta:** `manifest/commands/clipboard.json:535` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:210` `'clipboard.pasteStyle': pasteStyleCommand,`
- **Início:** `src/editor/doors/door.tsx:112` `afterRead(store, readClipboard(), (content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));`
- **Fluxo:** `fluxos/ENT-P-clipboard-0020.md`
- **Requisitos:** REQ-0605
