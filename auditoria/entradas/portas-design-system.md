## ENT-P-design-system-0001 — colors.saveSwatch pela porta color-picker-save-current
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:32` `"kind": "panel-control",`
- **Comando:** colors.saveSwatch
- **Porta:** `manifest/commands/design-system.json:31` `"id": "color-picker-save-current",`
- **Tratador:** `src/app/commands.ts:211` `'colors.saveSwatch': saveSwatchCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0001.md`
- **Requisitos:** REQ-0801

## ENT-P-design-system-0002 — colors.removeSwatch pela porta color-picker-swatch-remove
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:86` `"kind": "panel-control",`
- **Comando:** colors.removeSwatch
- **Porta:** `manifest/commands/design-system.json:85` `"id": "color-picker-swatch-remove",`
- **Tratador:** `src/app/commands.ts:212` `'colors.removeSwatch': removeSwatchCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0002.md`
- **Requisitos:** REQ-0802

## ENT-P-design-system-0003 — tokens.create pela porta variables-add
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:158` `"kind": "panel-control",`
- **Comando:** tokens.create
- **Porta:** `manifest/commands/design-system.json:157` `"id": "variables-add",`
- **Tratador:** `src/app/commands.ts:213` `'tokens.create': createToken,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0003.md`
- **Requisitos:** REQ-0803

## ENT-P-design-system-0004 — tokens.update pela porta variables-value-field
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:220` `"kind": "panel-control",`
- **Comando:** tokens.update
- **Porta:** `manifest/commands/design-system.json:219` `"id": "variables-value-field",`
- **Tratador:** `src/app/commands.ts:214` `'tokens.update': updateToken,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0004.md`
- **Requisitos:** REQ-0804

## ENT-P-design-system-0005 — tokens.rename pela porta variables-name-field
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:283` `"kind": "panel-control",`
- **Comando:** tokens.rename
- **Porta:** `manifest/commands/design-system.json:282` `"id": "variables-name-field",`
- **Tratador:** `src/app/commands.ts:225` `'tokens.rename': renameToken,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0005.md`
- **Requisitos:** REQ-0805

## ENT-P-design-system-0006 — tokens.delete pela porta variables-delete
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:341` `"kind": "panel-control",`
- **Comando:** tokens.delete
- **Porta:** `manifest/commands/design-system.json:340` `"id": "variables-delete",`
- **Tratador:** `src/app/commands.ts:226` `'tokens.delete': deleteToken,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0006.md`
- **Requisitos:** REQ-0806

## ENT-P-design-system-0007 — classes.create pela porta inspector-class-save-as
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:399` `"kind": "panel-control",`
- **Comando:** classes.create
- **Porta:** `manifest/commands/design-system.json:398` `"id": "inspector-class-save-as",`
- **Tratador:** `src/app/commands.ts:227` `'classes.create': createClassCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0007.md`
- **Requisitos:** REQ-0807

## ENT-P-design-system-0008 — classes.apply pela porta inspector-class-add
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:456` `"kind": "panel-control",`
- **Comando:** classes.apply
- **Porta:** `manifest/commands/design-system.json:455` `"id": "inspector-class-add",`
- **Tratador:** `src/app/commands.ts:228` `'classes.apply': applyClassCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0008.md`
- **Requisitos:** REQ-0808

## ENT-P-design-system-0009 — classes.apply pela porta command-bar-apply-class
- **Tipo:** comando-porta command-bar `manifest/commands/design-system.json:482` `"kind": "command-bar",`
- **Comando:** classes.apply
- **Porta:** `manifest/commands/design-system.json:481` `"id": "command-bar-apply-class",`
- **Tratador:** `src/app/commands.ts:228` `'classes.apply': applyClassCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0009.md`
- **Requisitos:** REQ-0808

## ENT-P-design-system-0010 — classes.detach pela porta inspector-class-remove
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:535` `"kind": "panel-control",`
- **Comando:** classes.detach
- **Porta:** `manifest/commands/design-system.json:534` `"id": "inspector-class-remove",`
- **Tratador:** `src/app/commands.ts:229` `'classes.detach': detachClassCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0010.md`
- **Requisitos:** REQ-0809

## ENT-P-design-system-0011 — classes.rename pela porta styles-class-rename
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:598` `"kind": "panel-control",`
- **Comando:** classes.rename
- **Porta:** `manifest/commands/design-system.json:597` `"id": "styles-class-rename",`
- **Tratador:** `src/app/commands.ts:230` `'classes.rename': renameClassCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0011.md`
- **Requisitos:** REQ-0810

## ENT-P-design-system-0012 — classes.delete pela porta styles-class-delete
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:658` `"kind": "panel-control",`
- **Comando:** classes.delete
- **Porta:** `manifest/commands/design-system.json:657` `"id": "styles-class-delete",`
- **Tratador:** `src/app/commands.ts:231` `'classes.delete': deleteClassCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0012.md`
- **Requisitos:** REQ-0811

## ENT-P-design-system-0013 — inspector.setStyleTarget pela porta inspector-class-bar-target
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:720` `"kind": "panel-control",`
- **Comando:** inspector.setStyleTarget
- **Porta:** `manifest/commands/design-system.json:719` `"id": "inspector-class-bar-target",`
- **Tratador:** `src/app/commands.ts:232` `'inspector.setStyleTarget': setStyleTarget,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0013.md`
- **Requisitos:** REQ-0812

## ENT-P-design-system-0014 — components.startCreate pela porta context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/design-system.json:775` `"kind": "context-menu",`
- **Comando:** components.startCreate
- **Porta:** `manifest/commands/design-system.json:774` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:234` `'components.startCreate': openComponentPrompt,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0014.md`
- **Requisitos:** REQ-0813

## ENT-P-design-system-0015 — components.startCreate pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/design-system.json:795` `"kind": "command-bar",`
- **Comando:** components.startCreate
- **Porta:** `manifest/commands/design-system.json:794` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:234` `'components.startCreate': openComponentPrompt,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0015.md`
- **Requisitos:** REQ-0813

## ENT-P-design-system-0016 — components.create pela porta prompt-name
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:849` `"kind": "panel-control",`
- **Comando:** components.create
- **Porta:** `manifest/commands/design-system.json:848` `"id": "prompt-name",`
- **Tratador:** `src/app/commands.ts:233` `'components.create': createComponentCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0016.md`
- **Requisitos:** REQ-0814

## ENT-P-design-system-0017 — components.closePrompt pela porta close
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:893` `"kind": "panel-control",`
- **Comando:** components.closePrompt
- **Porta:** `manifest/commands/design-system.json:892` `"id": "close",`
- **Tratador:** `src/app/commands.ts:235` `'components.closePrompt': closeComponentPrompt,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0017.md`
- **Requisitos:** REQ-0815

## ENT-P-design-system-0018 — components.closePrompt pela porta key-escape-in-component-prompt
- **Tipo:** comando-porta shortcut `manifest/commands/design-system.json:919` `"kind": "shortcut",`
- **Comando:** components.closePrompt
- **Porta:** `manifest/commands/design-system.json:918` `"id": "key-escape-in-component-prompt",`
- **Gatilho:** `manifest/commands/design-system.json:921` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:235` `'components.closePrompt': closeComponentPrompt,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-design-system-0018.md`
- **Requisitos:** REQ-0815

## ENT-P-design-system-0019 — components.insertInstance pela porta elements-component-tile
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:988` `"kind": "panel-control",`
- **Comando:** components.insertInstance
- **Porta:** `manifest/commands/design-system.json:987` `"id": "elements-component-tile",`
- **Tratador:** `src/app/commands.ts:236` `'components.insertInstance': insertInstanceCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0019.md`
- **Requisitos:** REQ-0816

## ENT-P-design-system-0020 — components.insertInstance pela porta canvas-drag-component-tile-drop-proposal
- **Tipo:** comando-porta canvas-drag `manifest/commands/design-system.json:1014` `"kind": "canvas-drag",`
- **Comando:** components.insertInstance
- **Porta:** `manifest/commands/design-system.json:1013` `"id": "canvas-drag-component-tile-drop-proposal",`
- **Gatilho:** `manifest/commands/design-system.json:1016` `"source": "component-tile",` ; `manifest/commands/design-system.json:1017` `"zone": "drop-proposal",` ; `manifest/commands/design-system.json:1018` `"gesture": "palette-drag",`
- **Tratador:** `src/app/commands.ts:236` `'components.insertInstance': insertInstanceCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:219` `closing?.dispatch(dropDoorOf.command.id, { ...dropDoorOf.door.args, ...press.args, parent: dropped.parent, index: dropped.index } as never);`
- **Fluxo:** `fluxos/ENT-P-design-system-0020.md`
- **Requisitos:** REQ-0816

## ENT-P-design-system-0021 — components.detach pela porta context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/design-system.json:1056` `"kind": "context-menu",`
- **Comando:** components.detach
- **Porta:** `manifest/commands/design-system.json:1055` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:237` `'components.detach': detachInstanceCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0021.md`
- **Requisitos:** REQ-0817

## ENT-P-design-system-0022 — components.detach pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/design-system.json:1076` `"kind": "command-bar",`
- **Comando:** components.detach
- **Porta:** `manifest/commands/design-system.json:1075` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:237` `'components.detach': detachInstanceCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0022.md`
- **Requisitos:** REQ-0817

## ENT-P-design-system-0023 — components.repeat pela porta key-ctrl-shift-d-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/design-system.json:1132` `"kind": "shortcut",`
- **Comando:** components.repeat
- **Porta:** `manifest/commands/design-system.json:1131` `"id": "key-ctrl-shift-d-in-global",`
- **Gatilho:** `manifest/commands/design-system.json:1134` `"chord": "Ctrl+Shift+D",`
- **Tratador:** `src/app/commands.ts:238` `'components.repeat': repeatCommand,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-design-system-0023.md`
- **Requisitos:** REQ-0818

## ENT-P-design-system-0024 — components.repeat pela porta context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/design-system.json:1152` `"kind": "context-menu",`
- **Comando:** components.repeat
- **Porta:** `manifest/commands/design-system.json:1151` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:238` `'components.repeat': repeatCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0024.md`
- **Requisitos:** REQ-0818

## ENT-P-design-system-0025 — components.repeat pela porta menu-arrange
- **Tipo:** comando-porta menu `manifest/commands/design-system.json:1172` `"kind": "menu",`
- **Comando:** components.repeat
- **Porta:** `manifest/commands/design-system.json:1171` `"id": "menu-arrange",`
- **Tratador:** `src/app/commands.ts:238` `'components.repeat': repeatCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0025.md`
- **Requisitos:** REQ-0818

## ENT-P-design-system-0026 — components.repeat pela porta command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/design-system.json:1194` `"kind": "command-bar",`
- **Comando:** components.repeat
- **Porta:** `manifest/commands/design-system.json:1193` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:238` `'components.repeat': repeatCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0026.md`
- **Requisitos:** REQ-0818

## ENT-P-design-system-0027 — components.fillFromData pela porta explorer-fill-from-data
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:1248` `"kind": "panel-control",`
- **Comando:** components.fillFromData
- **Porta:** `manifest/commands/design-system.json:1247` `"id": "explorer-fill-from-data",`
- **Tratador:** `src/app/commands.ts:239` `'components.fillFromData': fillFromDataCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0027.md`
- **Requisitos:** REQ-0819

## ENT-P-design-system-0028 — design.replaceColour pela porta styles-site-colour-replace
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:1310` `"kind": "panel-control",`
- **Comando:** design.replaceColour
- **Porta:** `manifest/commands/design-system.json:1309` `"id": "styles-site-colour-replace",`
- **Tratador:** `src/app/commands.ts:215` `'design.replaceColour': replaceColourCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0028.md`
- **Requisitos:** REQ-0820

## ENT-P-design-system-0029 — design.colourToVariable pela porta styles-site-colour-variable
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:1373` `"kind": "panel-control",`
- **Comando:** design.colourToVariable
- **Porta:** `manifest/commands/design-system.json:1372` `"id": "styles-site-colour-variable",`
- **Tratador:** `src/app/commands.ts:224` `'design.colourToVariable': colourToVariableCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0029.md`
- **Requisitos:** REQ-0821

## ENT-P-design-system-0030 — classes.moveInto pela porta inspector-class-move-into
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:1432` `"kind": "panel-control",`
- **Comando:** classes.moveInto
- **Porta:** `manifest/commands/design-system.json:1431` `"id": "inspector-class-move-into",`
- **Tratador:** `src/app/commands.ts:222` `'classes.moveInto': moveIntoClassCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0030.md`
- **Requisitos:** REQ-0822

## ENT-P-design-system-0031 — classes.applyToSimilar pela porta `inspector-class-apply-similar`
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:1499` `"kind": "panel-control",`
- **Comando:** classes.applyToSimilar
- **Porta:** `manifest/commands/design-system.json:1498` `"id": "inspector-class-apply-similar",`
- **Tratador:** `src/app/commands.ts:223` `'classes.applyToSimilar': applyToSimilarCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0031.md`
- **Requisitos:** REQ-0823

## ENT-P-design-system-0032 — classes.applyToSimilar pela porta inspector-class-apply-project
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:1527` `"kind": "panel-control",`
- **Comando:** classes.applyToSimilar
- **Porta:** `manifest/commands/design-system.json:1526` `"id": "inspector-class-apply-project",`
- **Tratador:** `src/app/commands.ts:223` `'classes.applyToSimilar': applyToSimilarCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0032.md`
- **Requisitos:** REQ-0823

## ENT-P-design-system-0033 — design.applySuggestion pela porta styles-suggestion-apply
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:1594` `"kind": "panel-control",`
- **Comando:** design.applySuggestion
- **Porta:** `manifest/commands/design-system.json:1593` `"id": "styles-suggestion-apply",`
- **Tratador:** `src/app/commands.ts:221` `'design.applySuggestion': applySuggestionCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0033.md`
- **Requisitos:** REQ-0824

## ENT-P-design-system-0034 — components.updateFromInstance pela porta context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/design-system.json:1642` `"kind": "context-menu",`
- **Comando:** components.updateFromInstance
- **Porta:** `manifest/commands/design-system.json:1641` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:219` `'components.updateFromInstance': updateFromInstanceCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0034.md`
- **Requisitos:** REQ-0825

## ENT-P-design-system-0035 — components.setVariant pela porta inspector-component-variant
- **Tipo:** comando-porta panel-control `manifest/commands/design-system.json:1693` `"kind": "panel-control",`
- **Comando:** components.setVariant
- **Porta:** `manifest/commands/design-system.json:1692` `"id": "inspector-component-variant",`
- **Tratador:** `src/app/commands.ts:220` `'components.setVariant': setVariantCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-design-system-0035.md`
- **Requisitos:** REQ-0826
