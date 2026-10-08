# Portas do domínio focus

## ENT-P-focus-0001 — focus.next pela porta key-arrow-down-in-menu
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:22` `"kind": "shortcut",`
- **Comando:** focus.next
- **Porta:** `manifest/commands/focus.json:21` `"id": "key-arrow-down-in-menu",`
- **Gatilho:** `manifest/commands/focus.json:24` `"chord": "ArrowDown",`
- **Tratador:** `src/app/commands.ts:312` `'focus.next': focusNext,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0001.md`
- **Requisitos:** REQ-1201

## ENT-P-focus-0002 — focus.next pela porta key-arrow-down-in-command-bar
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:42` `"kind": "shortcut",`
- **Comando:** focus.next
- **Porta:** `manifest/commands/focus.json:41` `"id": "key-arrow-down-in-command-bar",`
- **Gatilho:** `manifest/commands/focus.json:44` `"chord": "ArrowDown",`
- **Tratador:** `src/app/commands.ts:312` `'focus.next': focusNext,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0002.md`
- **Requisitos:** REQ-1201

## ENT-P-focus-0003 — focus.next pela porta key-arrow-down-in-field-suggestions
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:62` `"kind": "shortcut",`
- **Comando:** focus.next
- **Porta:** `manifest/commands/focus.json:61` `"id": "key-arrow-down-in-field-suggestions",`
- **Gatilho:** `manifest/commands/focus.json:64` `"chord": "ArrowDown",`
- **Tratador:** `src/app/commands.ts:312` `'focus.next': focusNext,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0003.md`
- **Requisitos:** REQ-1201

## ENT-P-focus-0004 — focus.next pela porta key-arrow-down-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:82` `"kind": "shortcut",`
- **Comando:** focus.next
- **Porta:** `manifest/commands/focus.json:81` `"id": "key-arrow-down-in-layers-tree",`
- **Gatilho:** `manifest/commands/focus.json:84` `"chord": "ArrowDown",`
- **Tratador:** `src/app/commands.ts:312` `'focus.next': focusNext,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0004.md`
- **Requisitos:** REQ-1201

## ENT-P-focus-0005 — focus.next pela porta key-arrow-right-in-tab-strip
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:102` `"kind": "shortcut",`
- **Comando:** focus.next
- **Porta:** `manifest/commands/focus.json:101` `"id": "key-arrow-right-in-tab-strip",`
- **Gatilho:** `manifest/commands/focus.json:104` `"chord": "ArrowRight",`
- **Tratador:** `src/app/commands.ts:312` `'focus.next': focusNext,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0005.md`
- **Requisitos:** REQ-1201

## ENT-P-focus-0006 — focus.next pela porta key-arrow-down-in-tab-strip
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:122` `"kind": "shortcut",`
- **Comando:** focus.next
- **Porta:** `manifest/commands/focus.json:121` `"id": "key-arrow-down-in-tab-strip",`
- **Gatilho:** `manifest/commands/focus.json:124` `"chord": "ArrowDown",`
- **Tratador:** `src/app/commands.ts:312` `'focus.next': focusNext,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0006.md`
- **Requisitos:** REQ-1201

## ENT-P-focus-0007 — focus.next pela porta key-arrow-right-in-toolbar
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:142` `"kind": "shortcut",`
- **Comando:** focus.next
- **Porta:** `manifest/commands/focus.json:141` `"id": "key-arrow-right-in-toolbar",`
- **Gatilho:** `manifest/commands/focus.json:144` `"chord": "ArrowRight",`
- **Tratador:** `src/app/commands.ts:312` `'focus.next': focusNext,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0007.md`
- **Requisitos:** REQ-1201

## ENT-P-focus-0008 — focus.next pela porta key-arrow-down-in-toolbar
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:162` `"kind": "shortcut",`
- **Comando:** focus.next
- **Porta:** `manifest/commands/focus.json:161` `"id": "key-arrow-down-in-toolbar",`
- **Gatilho:** `manifest/commands/focus.json:164` `"chord": "ArrowDown",`
- **Tratador:** `src/app/commands.ts:312` `'focus.next': focusNext,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0008.md`
- **Requisitos:** REQ-1201

## ENT-P-focus-0009 — focus.next pela porta key-arrow-right-in-palette
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:182` `"kind": "shortcut",`
- **Comando:** focus.next
- **Porta:** `manifest/commands/focus.json:181` `"id": "key-arrow-right-in-palette",`
- **Gatilho:** `manifest/commands/focus.json:184` `"chord": "ArrowRight",`
- **Tratador:** `src/app/commands.ts:312` `'focus.next': focusNext,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0009.md`
- **Requisitos:** REQ-1201

## ENT-P-focus-0010 — focus.next pela porta key-arrow-down-in-palette
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:202` `"kind": "shortcut",`
- **Comando:** focus.next
- **Porta:** `manifest/commands/focus.json:201` `"id": "key-arrow-down-in-palette",`
- **Gatilho:** `manifest/commands/focus.json:204` `"chord": "ArrowDown",`
- **Tratador:** `src/app/commands.ts:312` `'focus.next': focusNext,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0010.md`
- **Requisitos:** REQ-1201

## ENT-P-focus-0011 — focus.menuBar pela porta key-f10-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:240` `"kind": "shortcut",`
- **Comando:** focus.menuBar
- **Porta:** `manifest/commands/focus.json:239` `"id": "key-f10-in-global",`
- **Gatilho:** `manifest/commands/focus.json:242` `"chord": "F10",`
- **Tratador:** `src/app/commands.ts:313` `'focus.menuBar': focusMenuBar,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0011.md`
- **Requisitos:** REQ-1202

## ENT-P-focus-0012 — focus.nextMenu pela porta key-arrow-right-in-menu
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:278` `"kind": "shortcut",`
- **Comando:** focus.nextMenu
- **Porta:** `manifest/commands/focus.json:277` `"id": "key-arrow-right-in-menu",`
- **Gatilho:** `manifest/commands/focus.json:280` `"chord": "ArrowRight",`
- **Tratador:** `src/app/commands.ts:314` `'focus.nextMenu': focusNextMenu,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0012.md`
- **Requisitos:** REQ-1203

## ENT-P-focus-0013 — focus.previousMenu pela porta key-arrow-left-in-menu
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:316` `"kind": "shortcut",`
- **Comando:** focus.previousMenu
- **Porta:** `manifest/commands/focus.json:315` `"id": "key-arrow-left-in-menu",`
- **Gatilho:** `manifest/commands/focus.json:318` `"chord": "ArrowLeft",`
- **Tratador:** `src/app/commands.ts:315` `'focus.previousMenu': focusPreviousMenu,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0013.md`
- **Requisitos:** REQ-1204

## ENT-P-focus-0014 — focus.previous pela porta key-arrow-up-in-menu
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:354` `"kind": "shortcut",`
- **Comando:** focus.previous
- **Porta:** `manifest/commands/focus.json:353` `"id": "key-arrow-up-in-menu",`
- **Gatilho:** `manifest/commands/focus.json:356` `"chord": "ArrowUp",`
- **Tratador:** `src/app/commands.ts:316` `'focus.previous': focusPrevious,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0014.md`
- **Requisitos:** REQ-1205

## ENT-P-focus-0015 — focus.previous pela porta key-arrow-up-in-command-bar
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:374` `"kind": "shortcut",`
- **Comando:** focus.previous
- **Porta:** `manifest/commands/focus.json:373` `"id": "key-arrow-up-in-command-bar",`
- **Gatilho:** `manifest/commands/focus.json:376` `"chord": "ArrowUp",`
- **Tratador:** `src/app/commands.ts:316` `'focus.previous': focusPrevious,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0015.md`
- **Requisitos:** REQ-1205

## ENT-P-focus-0016 — focus.previous pela porta key-arrow-up-in-field-suggestions
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:394` `"kind": "shortcut",`
- **Comando:** focus.previous
- **Porta:** `manifest/commands/focus.json:393` `"id": "key-arrow-up-in-field-suggestions",`
- **Gatilho:** `manifest/commands/focus.json:396` `"chord": "ArrowUp",`
- **Tratador:** `src/app/commands.ts:316` `'focus.previous': focusPrevious,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0016.md`
- **Requisitos:** REQ-1205

## ENT-P-focus-0017 — focus.previous pela porta key-arrow-up-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:414` `"kind": "shortcut",`
- **Comando:** focus.previous
- **Porta:** `manifest/commands/focus.json:413` `"id": "key-arrow-up-in-layers-tree",`
- **Gatilho:** `manifest/commands/focus.json:416` `"chord": "ArrowUp",`
- **Tratador:** `src/app/commands.ts:316` `'focus.previous': focusPrevious,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0017.md`
- **Requisitos:** REQ-1205

## ENT-P-focus-0018 — focus.previous pela porta key-arrow-left-in-tab-strip
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:434` `"kind": "shortcut",`
- **Comando:** focus.previous
- **Porta:** `manifest/commands/focus.json:433` `"id": "key-arrow-left-in-tab-strip",`
- **Gatilho:** `manifest/commands/focus.json:436` `"chord": "ArrowLeft",`
- **Tratador:** `src/app/commands.ts:316` `'focus.previous': focusPrevious,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0018.md`
- **Requisitos:** REQ-1205

## ENT-P-focus-0019 — focus.previous pela porta key-arrow-up-in-tab-strip
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:454` `"kind": "shortcut",`
- **Comando:** focus.previous
- **Porta:** `manifest/commands/focus.json:453` `"id": "key-arrow-up-in-tab-strip",`
- **Gatilho:** `manifest/commands/focus.json:456` `"chord": "ArrowUp",`
- **Tratador:** `src/app/commands.ts:316` `'focus.previous': focusPrevious,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0019.md`
- **Requisitos:** REQ-1205

## ENT-P-focus-0020 — focus.previous pela porta key-arrow-left-in-toolbar
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:474` `"kind": "shortcut",`
- **Comando:** focus.previous
- **Porta:** `manifest/commands/focus.json:473` `"id": "key-arrow-left-in-toolbar",`
- **Gatilho:** `manifest/commands/focus.json:476` `"chord": "ArrowLeft",`
- **Tratador:** `src/app/commands.ts:316` `'focus.previous': focusPrevious,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0020.md`
- **Requisitos:** REQ-1205

## ENT-P-focus-0021 — focus.previous pela porta key-arrow-up-in-toolbar
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:494` `"kind": "shortcut",`
- **Comando:** focus.previous
- **Porta:** `manifest/commands/focus.json:493` `"id": "key-arrow-up-in-toolbar",`
- **Gatilho:** `manifest/commands/focus.json:496` `"chord": "ArrowUp",`
- **Tratador:** `src/app/commands.ts:316` `'focus.previous': focusPrevious,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0021.md`
- **Requisitos:** REQ-1205

## ENT-P-focus-0022 — focus.previous pela porta key-arrow-left-in-palette
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:514` `"kind": "shortcut",`
- **Comando:** focus.previous
- **Porta:** `manifest/commands/focus.json:513` `"id": "key-arrow-left-in-palette",`
- **Gatilho:** `manifest/commands/focus.json:516` `"chord": "ArrowLeft",`
- **Tratador:** `src/app/commands.ts:316` `'focus.previous': focusPrevious,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0022.md`
- **Requisitos:** REQ-1205

## ENT-P-focus-0023 — focus.previous pela porta key-arrow-up-in-palette
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:534` `"kind": "shortcut",`
- **Comando:** focus.previous
- **Porta:** `manifest/commands/focus.json:533` `"id": "key-arrow-up-in-palette",`
- **Gatilho:** `manifest/commands/focus.json:536` `"chord": "ArrowUp",`
- **Tratador:** `src/app/commands.ts:316` `'focus.previous': focusPrevious,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0023.md`
- **Requisitos:** REQ-1205

## ENT-P-focus-0024 — focus.first pela porta key-home-in-menu
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:572` `"kind": "shortcut",`
- **Comando:** focus.first
- **Porta:** `manifest/commands/focus.json:571` `"id": "key-home-in-menu",`
- **Gatilho:** `manifest/commands/focus.json:574` `"chord": "Home",`
- **Tratador:** `src/app/commands.ts:317` `'focus.first': focusFirst,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0024.md`
- **Requisitos:** REQ-1206

## ENT-P-focus-0025 — focus.first pela porta key-home-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:592` `"kind": "shortcut",`
- **Comando:** focus.first
- **Porta:** `manifest/commands/focus.json:591` `"id": "key-home-in-layers-tree",`
- **Gatilho:** `manifest/commands/focus.json:594` `"chord": "Home",`
- **Tratador:** `src/app/commands.ts:317` `'focus.first': focusFirst,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0025.md`
- **Requisitos:** REQ-1206

## ENT-P-focus-0026 — focus.first pela porta key-home-in-tab-strip
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:612` `"kind": "shortcut",`
- **Comando:** focus.first
- **Porta:** `manifest/commands/focus.json:611` `"id": "key-home-in-tab-strip",`
- **Gatilho:** `manifest/commands/focus.json:614` `"chord": "Home",`
- **Tratador:** `src/app/commands.ts:317` `'focus.first': focusFirst,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0026.md`
- **Requisitos:** REQ-1206

## ENT-P-focus-0027 — focus.first pela porta key-home-in-toolbar
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:632` `"kind": "shortcut",`
- **Comando:** focus.first
- **Porta:** `manifest/commands/focus.json:631` `"id": "key-home-in-toolbar",`
- **Gatilho:** `manifest/commands/focus.json:634` `"chord": "Home",`
- **Tratador:** `src/app/commands.ts:317` `'focus.first': focusFirst,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0027.md`
- **Requisitos:** REQ-1206

## ENT-P-focus-0028 — focus.first pela porta key-home-in-palette
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:652` `"kind": "shortcut",`
- **Comando:** focus.first
- **Porta:** `manifest/commands/focus.json:651` `"id": "key-home-in-palette",`
- **Gatilho:** `manifest/commands/focus.json:654` `"chord": "Home",`
- **Tratador:** `src/app/commands.ts:317` `'focus.first': focusFirst,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0028.md`
- **Requisitos:** REQ-1206

## ENT-P-focus-0029 — focus.last pela porta key-end-in-menu
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:690` `"kind": "shortcut",`
- **Comando:** focus.last
- **Porta:** `manifest/commands/focus.json:689` `"id": "key-end-in-menu",`
- **Gatilho:** `manifest/commands/focus.json:692` `"chord": "End",`
- **Tratador:** `src/app/commands.ts:318` `'focus.last': focusLast,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0029.md`
- **Requisitos:** REQ-1207

## ENT-P-focus-0030 — focus.last pela porta key-end-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:710` `"kind": "shortcut",`
- **Comando:** focus.last
- **Porta:** `manifest/commands/focus.json:709` `"id": "key-end-in-layers-tree",`
- **Gatilho:** `manifest/commands/focus.json:712` `"chord": "End",`
- **Tratador:** `src/app/commands.ts:318` `'focus.last': focusLast,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0030.md`
- **Requisitos:** REQ-1207

## ENT-P-focus-0031 — focus.last pela porta key-end-in-tab-strip
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:730` `"kind": "shortcut",`
- **Comando:** focus.last
- **Porta:** `manifest/commands/focus.json:729` `"id": "key-end-in-tab-strip",`
- **Gatilho:** `manifest/commands/focus.json:732` `"chord": "End",`
- **Tratador:** `src/app/commands.ts:318` `'focus.last': focusLast,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0031.md`
- **Requisitos:** REQ-1207

## ENT-P-focus-0032 — focus.last pela porta key-end-in-toolbar
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:750` `"kind": "shortcut",`
- **Comando:** focus.last
- **Porta:** `manifest/commands/focus.json:749` `"id": "key-end-in-toolbar",`
- **Gatilho:** `manifest/commands/focus.json:752` `"chord": "End",`
- **Tratador:** `src/app/commands.ts:318` `'focus.last': focusLast,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0032.md`
- **Requisitos:** REQ-1207

## ENT-P-focus-0033 — focus.last pela porta key-end-in-palette
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:770` `"kind": "shortcut",`
- **Comando:** focus.last
- **Porta:** `manifest/commands/focus.json:769` `"id": "key-end-in-palette",`
- **Gatilho:** `manifest/commands/focus.json:772` `"chord": "End",`
- **Tratador:** `src/app/commands.ts:318` `'focus.last': focusLast,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0033.md`
- **Requisitos:** REQ-1207

## ENT-P-focus-0034 — focus.activate pela porta key-enter-in-menu
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:808` `"kind": "shortcut",`
- **Comando:** focus.activate
- **Porta:** `manifest/commands/focus.json:807` `"id": "key-enter-in-menu",`
- **Gatilho:** `manifest/commands/focus.json:810` `"chord": "Enter",`
- **Tratador:** `src/app/commands.ts:319` `'focus.activate': focusActivate,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0034.md`
- **Requisitos:** REQ-1208

## ENT-P-focus-0035 — focus.activate pela porta key-enter-in-command-bar
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:828` `"kind": "shortcut",`
- **Comando:** focus.activate
- **Porta:** `manifest/commands/focus.json:827` `"id": "key-enter-in-command-bar",`
- **Gatilho:** `manifest/commands/focus.json:830` `"chord": "Enter",`
- **Tratador:** `src/app/commands.ts:319` `'focus.activate': focusActivate,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0035.md`
- **Requisitos:** REQ-1208

## ENT-P-focus-0036 — focus.activate pela porta key-enter-in-field-suggestions
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:848` `"kind": "shortcut",`
- **Comando:** focus.activate
- **Porta:** `manifest/commands/focus.json:847` `"id": "key-enter-in-field-suggestions",`
- **Gatilho:** `manifest/commands/focus.json:850` `"chord": "Enter",`
- **Tratador:** `src/app/commands.ts:319` `'focus.activate': focusActivate,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0036.md`
- **Requisitos:** REQ-1208

## ENT-P-focus-0037 — focus.activate pela porta key-enter-in-tab-strip
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:868` `"kind": "shortcut",`
- **Comando:** focus.activate
- **Porta:** `manifest/commands/focus.json:867` `"id": "key-enter-in-tab-strip",`
- **Gatilho:** `manifest/commands/focus.json:870` `"chord": "Enter",`
- **Tratador:** `src/app/commands.ts:319` `'focus.activate': focusActivate,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0037.md`
- **Requisitos:** REQ-1208

## ENT-P-focus-0038 — focus.activate pela porta key-space-in-tab-strip
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:888` `"kind": "shortcut",`
- **Comando:** focus.activate
- **Porta:** `manifest/commands/focus.json:887` `"id": "key-space-in-tab-strip",`
- **Gatilho:** `manifest/commands/focus.json:890` `"chord": "Space",`
- **Tratador:** `src/app/commands.ts:319` `'focus.activate': focusActivate,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0038.md`
- **Requisitos:** REQ-1208

## ENT-P-focus-0039 — focus.activate pela porta key-enter-in-toolbar
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:908` `"kind": "shortcut",`
- **Comando:** focus.activate
- **Porta:** `manifest/commands/focus.json:907` `"id": "key-enter-in-toolbar",`
- **Gatilho:** `manifest/commands/focus.json:910` `"chord": "Enter",`
- **Tratador:** `src/app/commands.ts:319` `'focus.activate': focusActivate,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0039.md`
- **Requisitos:** REQ-1208

## ENT-P-focus-0040 — focus.activate pela porta key-space-in-toolbar
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:928` `"kind": "shortcut",`
- **Comando:** focus.activate
- **Porta:** `manifest/commands/focus.json:927` `"id": "key-space-in-toolbar",`
- **Gatilho:** `manifest/commands/focus.json:930` `"chord": "Space",`
- **Tratador:** `src/app/commands.ts:319` `'focus.activate': focusActivate,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0040.md`
- **Requisitos:** REQ-1208

## ENT-P-focus-0041 — focus.nextRegion pela porta key-f6-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:966` `"kind": "shortcut",`
- **Comando:** focus.nextRegion
- **Porta:** `manifest/commands/focus.json:965` `"id": "key-f6-in-global",`
- **Gatilho:** `manifest/commands/focus.json:968` `"chord": "F6",`
- **Tratador:** `src/app/commands.ts:320` `'focus.nextRegion': focusNextRegion,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0041.md`
- **Requisitos:** REQ-1209

## ENT-P-focus-0042 — focus.nextRegion pela porta key-f6-in-field
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:986` `"kind": "shortcut",`
- **Comando:** focus.nextRegion
- **Porta:** `manifest/commands/focus.json:985` `"id": "key-f6-in-field",`
- **Gatilho:** `manifest/commands/focus.json:988` `"chord": "F6",`
- **Tratador:** `src/app/commands.ts:320` `'focus.nextRegion': focusNextRegion,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0042.md`
- **Requisitos:** REQ-1209

## ENT-P-focus-0043 — focus.previousRegion pela porta key-shift-f6-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:1024` `"kind": "shortcut",`
- **Comando:** focus.previousRegion
- **Porta:** `manifest/commands/focus.json:1023` `"id": "key-shift-f6-in-global",`
- **Gatilho:** `manifest/commands/focus.json:1026` `"chord": "Shift+F6",`
- **Tratador:** `src/app/commands.ts:321` `'focus.previousRegion': focusPreviousRegion,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0043.md`
- **Requisitos:** REQ-1210

## ENT-P-focus-0044 — focus.previousRegion pela porta key-shift-f6-in-field
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:1044` `"kind": "shortcut",`
- **Comando:** focus.previousRegion
- **Porta:** `manifest/commands/focus.json:1043` `"id": "key-shift-f6-in-field",`
- **Gatilho:** `manifest/commands/focus.json:1046` `"chord": "Shift+F6",`
- **Tratador:** `src/app/commands.ts:321` `'focus.previousRegion': focusPreviousRegion,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0044.md`
- **Requisitos:** REQ-1210

## ENT-P-focus-0045 — focus.canvas pela porta key-escape-in-layers-tree
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:1082` `"kind": "shortcut",`
- **Comando:** focus.canvas
- **Porta:** `manifest/commands/focus.json:1081` `"id": "key-escape-in-layers-tree",`
- **Gatilho:** `manifest/commands/focus.json:1084` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:322` `'focus.canvas': focusCanvas,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0045.md`
- **Requisitos:** REQ-1211

## ENT-P-focus-0046 — focus.canvas pela porta key-escape-in-palette
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:1102` `"kind": "shortcut",`
- **Comando:** focus.canvas
- **Porta:** `manifest/commands/focus.json:1101` `"id": "key-escape-in-palette",`
- **Gatilho:** `manifest/commands/focus.json:1104` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:322` `'focus.canvas': focusCanvas,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0046.md`
- **Requisitos:** REQ-1211

## ENT-P-focus-0047 — focus.canvas pela porta key-escape-in-tab-strip
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:1122` `"kind": "shortcut",`
- **Comando:** focus.canvas
- **Porta:** `manifest/commands/focus.json:1121` `"id": "key-escape-in-tab-strip",`
- **Gatilho:** `manifest/commands/focus.json:1124` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:322` `'focus.canvas': focusCanvas,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0047.md`
- **Requisitos:** REQ-1211

## ENT-P-focus-0048 — focus.canvas pela porta key-escape-in-toolbar
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:1142` `"kind": "shortcut",`
- **Comando:** focus.canvas
- **Porta:** `manifest/commands/focus.json:1141` `"id": "key-escape-in-toolbar",`
- **Gatilho:** `manifest/commands/focus.json:1144` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:322` `'focus.canvas': focusCanvas,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0048.md`
- **Requisitos:** REQ-1211

## ENT-P-focus-0049 — focus.canvas pela porta key-escape-in-splitter
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:1162` `"kind": "shortcut",`
- **Comando:** focus.canvas
- **Porta:** `manifest/commands/focus.json:1161` `"id": "key-escape-in-splitter",`
- **Gatilho:** `manifest/commands/focus.json:1164` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:322` `'focus.canvas': focusCanvas,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0049.md`
- **Requisitos:** REQ-1211

## ENT-P-focus-0050 — ui.dismiss pela porta key-escape-in-menu
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:1200` `"kind": "shortcut",`
- **Comando:** ui.dismiss
- **Porta:** `manifest/commands/focus.json:1199` `"id": "key-escape-in-menu",`
- **Gatilho:** `manifest/commands/focus.json:1202` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:323` `'ui.dismiss': dismiss,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0050.md`
- **Requisitos:** REQ-1212

## ENT-P-focus-0051 — ui.dismiss pela porta overlay-backdrop
- **Tipo:** comando-porta panel-control `manifest/commands/focus.json:1220` `"kind": "panel-control",`
- **Comando:** ui.dismiss
- **Porta:** `manifest/commands/focus.json:1219` `"id": "overlay-backdrop",`
- **Tratador:** `src/app/commands.ts:323` `'ui.dismiss': dismiss,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-focus-0051.md`
- **Requisitos:** REQ-1212

## ENT-P-focus-0052 — ui.dismiss pela porta key-escape-in-command-bar
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:1246` `"kind": "shortcut",`
- **Comando:** ui.dismiss
- **Porta:** `manifest/commands/focus.json:1245` `"id": "key-escape-in-command-bar",`
- **Gatilho:** `manifest/commands/focus.json:1248` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:323` `'ui.dismiss': dismiss,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0052.md`
- **Requisitos:** REQ-1212

## ENT-P-focus-0053 — ui.dismiss pela porta key-escape-in-field-suggestions
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:1266` `"kind": "shortcut",`
- **Comando:** ui.dismiss
- **Porta:** `manifest/commands/focus.json:1265` `"id": "key-escape-in-field-suggestions",`
- **Gatilho:** `manifest/commands/focus.json:1268` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:323` `'ui.dismiss': dismiss,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0053.md`
- **Requisitos:** REQ-1212

## ENT-P-focus-0054 — ui.dismiss pela porta key-escape-in-dialog
- **Tipo:** comando-porta shortcut `manifest/commands/focus.json:1286` `"kind": "shortcut",`
- **Comando:** ui.dismiss
- **Porta:** `manifest/commands/focus.json:1285` `"id": "key-escape-in-dialog",`
- **Gatilho:** `manifest/commands/focus.json:1288` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:323` `'ui.dismiss': dismiss,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-focus-0054.md`
- **Requisitos:** REQ-1212

## ENT-P-focus-0055 — ui.dismiss pela porta dialog-close
- **Tipo:** comando-porta panel-control `manifest/commands/focus.json:1306` `"kind": "panel-control",`
- **Comando:** ui.dismiss
- **Porta:** `manifest/commands/focus.json:1305` `"id": "dialog-close",`
- **Tratador:** `src/app/commands.ts:323` `'ui.dismiss': dismiss,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-focus-0055.md`
- **Requisitos:** REQ-1212
