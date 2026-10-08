# Portas de comando do domínio elements

Cada bloco é uma porta (entryPoint) de um comando do domínio `elements`, lida de `manifest/commands/elements.json`.

## ENT-P-elements-0001 — element.setTag pela porta element.setTag#inspector-tag
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:42` `"kind": "inspector-field",`
- **Comando:** element.setTag
- **Porta:** `manifest/commands/elements.json:41` `"id": "inspector-tag",`
- **Tratador:** `src/app/commands.ts:240` `'element.setTag': setTagCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0001.md`
- **Requisitos:** REQ-0901

## ENT-P-elements-0002 — element.setTag pela porta element.setTag#quick-panel-tag
- **Tipo:** comando-porta quick-panel `manifest/commands/elements.json:70` `"kind": "quick-panel",`
- **Comando:** element.setTag
- **Porta:** `manifest/commands/elements.json:69` `"id": "quick-panel-tag",`
- **Tratador:** `src/app/commands.ts:240` `'element.setTag': setTagCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0002.md`
- **Requisitos:** REQ-0901

## ENT-P-elements-0003 — element.setAttribute pela porta element.setAttribute#inspector-title
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:140` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:139` `"id": "inspector-title",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0003.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0004 — element.setAttribute pela porta element.setAttribute#inspector-src
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:166` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:165` `"id": "inspector-src",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0004.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0005 — element.setAttribute pela porta element.setAttribute#inspector-alt
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:192` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:191` `"id": "inspector-alt",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0005.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0006 — element.setAttribute pela porta element.setAttribute#inspector-srcset
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:218` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:217` `"id": "inspector-srcset",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0006.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0007 — element.setAttribute pela porta element.setAttribute#inspector-media
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:244` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:243` `"id": "inspector-media",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0007.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0008 — element.setAttribute pela porta element.setAttribute#inspector-placeholder
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:270` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:269` `"id": "inspector-placeholder",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0008.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0009 — element.setAttribute pela porta element.setAttribute#inspector-value
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:296` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:295` `"id": "inspector-value",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0009.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0010 — element.setAttribute pela porta element.setAttribute#inspector-name
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:322` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:321` `"id": "inspector-name",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0010.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0011 — element.setAttribute pela porta element.setAttribute#inspector-required
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:348` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:347` `"id": "inspector-required",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0011.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0012 — element.setAttribute pela porta element.setAttribute#inspector-pattern
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:374` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:373` `"id": "inspector-pattern",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0012.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0013 — element.setAttribute pela porta element.setAttribute#inspector-min
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:400` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:399` `"id": "inspector-min",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0013.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0014 — element.setAttribute pela porta element.setAttribute#inspector-max
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:426` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:425` `"id": "inspector-max",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0014.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0015 — element.setAttribute pela porta element.setAttribute#inspector-step
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:452` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:451` `"id": "inspector-step",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0015.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0016 — element.setAttribute pela porta element.setAttribute#inspector-autocomplete
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:478` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:477` `"id": "inspector-autocomplete",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0016.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0017 — element.setAttribute pela porta element.setAttribute#inspector-disabled
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:504` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:503` `"id": "inspector-disabled",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0017.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0018 — element.setAttribute pela porta element.setAttribute#inspector-readonly
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:530` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:529` `"id": "inspector-readonly",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0018.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0019 — element.setAttribute pela porta element.setAttribute#inspector-checked
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:556` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:555` `"id": "inspector-checked",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0019.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0020 — element.setAttribute pela porta element.setAttribute#inspector-action
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:582` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:581` `"id": "inspector-action",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0020.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0021 — element.setAttribute pela porta element.setAttribute#inspector-method
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:608` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:607` `"id": "inspector-method",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0021.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0022 — element.setAttribute pela porta element.setAttribute#inspector-button-type
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:634` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:633` `"id": "inspector-button-type",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0022.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0023 — element.setAttribute pela porta element.setAttribute#inspector-rows
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:660` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:659` `"id": "inspector-rows",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0023.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0024 — element.setAttribute pela porta element.setAttribute#inspector-group-label
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:686` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:685` `"id": "inspector-group-label",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0024.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0025 — element.setAttribute pela porta element.setAttribute#inspector-selected
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:712` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:711` `"id": "inspector-selected",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0025.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0026 — element.setAttribute pela porta element.setAttribute#inspector-poster
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:738` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:737` `"id": "inspector-poster",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0026.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0027 — element.setAttribute pela porta element.setAttribute#inspector-controls
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:764` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:763` `"id": "inspector-controls",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0027.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0028 — element.setAttribute pela porta element.setAttribute#inspector-autoplay
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:790` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:789` `"id": "inspector-autoplay",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0028.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0029 — element.setAttribute pela porta element.setAttribute#inspector-loop
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:816` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:815` `"id": "inspector-loop",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0029.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0030 — element.setAttribute pela porta element.setAttribute#inspector-muted
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:842` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:841` `"id": "inspector-muted",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0030.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0031 — element.setAttribute pela porta element.setAttribute#inspector-track-kind
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:868` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:867` `"id": "inspector-track-kind",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0031.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0032 — element.setAttribute pela porta element.setAttribute#inspector-canvas-width
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:894` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:893` `"id": "inspector-canvas-width",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0032.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0033 — element.setAttribute pela porta element.setAttribute#inspector-canvas-height
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:920` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:919` `"id": "inspector-canvas-height",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0033.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0034 — element.setAttribute pela porta element.setAttribute#inspector-open
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:946` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:945` `"id": "inspector-open",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0034.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0035 — element.setAttribute pela porta element.setAttribute#asset-picker-choose
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:972` `"kind": "panel-control",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:971` `"id": "asset-picker-choose",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0035.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0036 — element.setAttribute pela porta element.setAttribute#inspector-cite
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1000` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:999` `"id": "inspector-cite",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0036.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0037 — element.setAttribute pela porta element.setAttribute#inspector-start
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1026` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1025` `"id": "inspector-start",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0037.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0038 — element.setAttribute pela porta element.setAttribute#inspector-reversed
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1052` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1051` `"id": "inspector-reversed",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0038.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0039 — element.setAttribute pela porta element.setAttribute#inspector-list-type
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1078` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1077` `"id": "inspector-list-type",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0039.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0040 — element.setAttribute pela porta element.setAttribute#inspector-scope
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1104` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1103` `"id": "inspector-scope",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0040.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0041 — element.setAttribute pela porta element.setAttribute#inspector-accept
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1130` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1129` `"id": "inspector-accept",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0041.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0042 — element.setAttribute pela porta element.setAttribute#inspector-multiple
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1156` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1155` `"id": "inspector-multiple",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0042.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0043 — element.setAttribute pela porta element.setAttribute#inspector-cols
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1182` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1181` `"id": "inspector-cols",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0043.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0044 — element.setAttribute pela porta element.setAttribute#inspector-max-length
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1208` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1207` `"id": "inspector-max-length",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0044.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0045 — element.setAttribute pela porta element.setAttribute#inspector-min-length
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1234` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1233` `"id": "inspector-min-length",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0045.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0046 — element.setAttribute pela porta element.setAttribute#inspector-low
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1260` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1259` `"id": "inspector-low",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0046.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0047 — element.setAttribute pela porta element.setAttribute#inspector-high
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1286` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1285` `"id": "inspector-high",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0047.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0048 — element.setAttribute pela porta element.setAttribute#inspector-optimum
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1312` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1311` `"id": "inspector-optimum",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0048.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0049 — element.setAttribute pela porta element.setAttribute#inspector-allow
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1338` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1337` `"id": "inspector-allow",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0049.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0050 — element.setAttribute pela porta element.setAttribute#inspector-loading
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1364` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1363` `"id": "inspector-loading",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0050.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0051 — element.setAttribute pela porta element.setAttribute#inspector-plays-inline
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1390` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1389` `"id": "inspector-plays-inline",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0051.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0052 — element.setAttribute pela porta element.setAttribute#inspector-preload
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1416` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1415` `"id": "inspector-preload",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0052.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0053 — element.setAttribute pela porta element.setAttribute#quick-panel-src
- **Tipo:** comando-porta quick-panel `manifest/commands/elements.json:1442` `"kind": "quick-panel",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1441` `"id": "quick-panel-src",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0053.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0054 — element.setAttribute pela porta element.setAttribute#quick-panel-alt
- **Tipo:** comando-porta quick-panel `manifest/commands/elements.json:1467` `"kind": "quick-panel",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1466` `"id": "quick-panel-alt",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0054.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0055 — element.setAttribute pela porta element.setAttribute#quick-panel-button-type
- **Tipo:** comando-porta quick-panel `manifest/commands/elements.json:1492` `"kind": "quick-panel",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1491` `"id": "quick-panel-button-type",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0055.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0056 — element.setAttribute pela porta element.setAttribute#inspector-role
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1517` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1516` `"id": "inspector-role",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0056.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0057 — element.setAttribute pela porta element.setAttribute#inspector-aria-label
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1543` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1542` `"id": "inspector-aria-label",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0057.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0058 — element.setAttribute pela porta element.setAttribute#inspector-aria-hidden
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1569` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1568` `"id": "inspector-aria-hidden",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0058.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0059 — element.setAttribute pela porta element.setAttribute#forms-mask-kind
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1595` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1594` `"id": "forms-mask-kind",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0059.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0060 — element.setAttribute pela porta element.setAttribute#forms-mask-preset
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1621` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1620` `"id": "forms-mask-preset",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0060.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0061 — element.setAttribute pela porta element.setAttribute#forms-mask-pattern
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1647` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1646` `"id": "forms-mask-pattern",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0061.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0062 — element.setAttribute pela porta element.setAttribute#forms-mask-alternative-pattern
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1673` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1672` `"id": "forms-mask-alternative-pattern",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0062.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0063 — element.setAttribute pela porta element.setAttribute#forms-mask-alternative-max-length
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1699` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1698` `"id": "forms-mask-alternative-max-length",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0063.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0064 — element.setAttribute pela porta element.setAttribute#forms-mask-block-pattern
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1725` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1724` `"id": "forms-mask-block-pattern",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0064.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0065 — element.setAttribute pela porta element.setAttribute#forms-mask-block-name
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1751` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1750` `"id": "forms-mask-block-name",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0065.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0066 — element.setAttribute pela porta element.setAttribute#forms-mask-locale
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1777` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1776` `"id": "forms-mask-locale",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0066.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0067 — element.setAttribute pela porta element.setAttribute#forms-mask-currency
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1803` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1802` `"id": "forms-mask-currency",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0067.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0068 — element.setAttribute pela porta element.setAttribute#forms-mask-precision
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1829` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1828` `"id": "forms-mask-precision",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0068.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0069 — element.setAttribute pela porta element.setAttribute#forms-mask-minimum
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1855` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1854` `"id": "forms-mask-minimum",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0069.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0070 — element.setAttribute pela porta element.setAttribute#forms-mask-maximum
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1881` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1880` `"id": "forms-mask-maximum",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0070.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0071 — element.setAttribute pela porta element.setAttribute#forms-mask-negative
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1907` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1906` `"id": "forms-mask-negative",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0071.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0072 — element.setAttribute pela porta element.setAttribute#forms-mask-suffix
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1933` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1932` `"id": "forms-mask-suffix",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0072.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0073 — element.setAttribute pela porta element.setAttribute#forms-mask-format
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1959` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1958` `"id": "forms-mask-format",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0073.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0074 — element.setAttribute pela porta element.setAttribute#forms-mask-autocorrect
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:1985` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:1984` `"id": "forms-mask-autocorrect",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0074.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0075 — element.setAttribute pela porta element.setAttribute#forms-mask-submit
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2011` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2010` `"id": "forms-mask-submit",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0075.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0076 — element.setAttribute pela porta element.setAttribute#forms-preview-input
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2037` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2036` `"id": "forms-preview-input",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0076.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0077 — element.setAttribute pela porta element.setAttribute#forms-when
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2063` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2062` `"id": "forms-when",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0077.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0078 — element.setAttribute pela porta element.setAttribute#forms-rules-required
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2089` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2088` `"id": "forms-rules-required",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0078.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0079 — element.setAttribute pela porta element.setAttribute#forms-rules-type
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2115` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2114` `"id": "forms-rules-type",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0079.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0080 — element.setAttribute pela porta element.setAttribute#forms-rules-pattern
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2141` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2140` `"id": "forms-rules-pattern",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0080.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0081 — element.setAttribute pela porta element.setAttribute#forms-rules-min-length
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2167` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2166` `"id": "forms-rules-min-length",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0081.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0082 — element.setAttribute pela porta element.setAttribute#forms-rules-max-length
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2193` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2192` `"id": "forms-rules-max-length",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0082.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0083 — element.setAttribute pela porta element.setAttribute#forms-rules-minimum
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2219` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2218` `"id": "forms-rules-minimum",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0083.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0084 — element.setAttribute pela porta element.setAttribute#forms-rules-maximum
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2245` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2244` `"id": "forms-rules-maximum",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0084.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0085 — element.setAttribute pela porta element.setAttribute#forms-rules-step
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2271` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2270` `"id": "forms-rules-step",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0085.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0086 — element.setAttribute pela porta element.setAttribute#forms-rules-equal-to
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2297` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2296` `"id": "forms-rules-equal-to",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0086.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0087 — element.setAttribute pela porta element.setAttribute#forms-rules-allowed
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2323` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2322` `"id": "forms-rules-allowed",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0087.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0088 — element.setAttribute pela porta element.setAttribute#forms-rules-password-enabled
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2349` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2348` `"id": "forms-rules-password-enabled",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0088.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0089 — element.setAttribute pela porta element.setAttribute#forms-rules-password-min-length
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2375` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2374` `"id": "forms-rules-password-min-length",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0089.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0090 — element.setAttribute pela porta element.setAttribute#forms-rules-password-uppercase
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2401` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2400` `"id": "forms-rules-password-uppercase",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0090.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0091 — element.setAttribute pela porta element.setAttribute#forms-rules-password-lowercase
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2427` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2426` `"id": "forms-rules-password-lowercase",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0091.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0092 — element.setAttribute pela porta element.setAttribute#forms-rules-password-digit
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2453` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2452` `"id": "forms-rules-password-digit",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0092.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0093 — element.setAttribute pela porta element.setAttribute#forms-rules-password-symbol
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2479` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2478` `"id": "forms-rules-password-symbol",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0093.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0094 — element.setAttribute pela porta element.setAttribute#forms-rules-date-minimum
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2505` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2504` `"id": "forms-rules-date-minimum",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0094.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0095 — element.setAttribute pela porta element.setAttribute#forms-rules-date-maximum
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2531` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2530` `"id": "forms-rules-date-maximum",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0095.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0096 — element.setAttribute pela porta element.setAttribute#forms-rules-file-accept
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2557` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2556` `"id": "forms-rules-file-accept",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0096.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0097 — element.setAttribute pela porta element.setAttribute#forms-rules-file-max-bytes
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2583` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2582` `"id": "forms-rules-file-max-bytes",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0097.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0098 — element.setAttribute pela porta element.setAttribute#forms-rules-file-max-total-bytes
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2609` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2608` `"id": "forms-rules-file-max-total-bytes",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0098.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0099 — element.setAttribute pela porta element.setAttribute#forms-error-id
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2635` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2634` `"id": "forms-error-id",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0099.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0100 — element.setAttribute pela porta element.setAttribute#forms-messages-locale
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2661` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2660` `"id": "forms-messages-locale",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0100.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0101 — element.setAttribute pela porta element.setAttribute#forms-address-enabled
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2687` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2686` `"id": "forms-address-enabled",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0101.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0102 — element.setAttribute pela porta element.setAttribute#forms-address-endpoint
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2713` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2712` `"id": "forms-address-endpoint",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0102.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0103 — element.setAttribute pela porta element.setAttribute#forms-address-field
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2739` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2738` `"id": "forms-address-field",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0103.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0104 — element.setAttribute pela porta element.setAttribute#forms-address-key
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2765` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2764` `"id": "forms-address-key",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0104.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0105 — element.setAttribute pela porta element.setAttribute#forms-messages-required
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2791` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2790` `"id": "forms-messages-required",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0105.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0106 — element.setAttribute pela porta element.setAttribute#forms-messages-type
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2817` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2816` `"id": "forms-messages-type",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0106.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0107 — element.setAttribute pela porta element.setAttribute#forms-messages-pattern
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2843` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2842` `"id": "forms-messages-pattern",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0107.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0108 — element.setAttribute pela porta element.setAttribute#forms-messages-too-short
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2869` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2868` `"id": "forms-messages-too-short",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0108.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0109 — element.setAttribute pela porta element.setAttribute#forms-messages-too-long
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2895` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2894` `"id": "forms-messages-too-long",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0109.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0110 — element.setAttribute pela porta element.setAttribute#forms-messages-minimum
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2921` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2920` `"id": "forms-messages-minimum",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0110.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0111 — element.setAttribute pela porta element.setAttribute#forms-messages-maximum
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2947` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2946` `"id": "forms-messages-maximum",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0111.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0112 — element.setAttribute pela porta element.setAttribute#forms-messages-step
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2973` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2972` `"id": "forms-messages-step",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0112.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0113 — element.setAttribute pela porta element.setAttribute#forms-messages-preset
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:2999` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:2998` `"id": "forms-messages-preset",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0113.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0114 — element.setAttribute pela porta element.setAttribute#forms-messages-equal-to
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3025` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3024` `"id": "forms-messages-equal-to",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0114.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0115 — element.setAttribute pela porta element.setAttribute#forms-messages-password
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3051` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3050` `"id": "forms-messages-password",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0115.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0116 — element.setAttribute pela porta element.setAttribute#forms-messages-allowed
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3077` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3076` `"id": "forms-messages-allowed",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0116.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0117 — element.setAttribute pela porta element.setAttribute#forms-messages-date-minimum
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3103` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3102` `"id": "forms-messages-date-minimum",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0117.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0118 — element.setAttribute pela porta element.setAttribute#forms-messages-date-maximum
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3129` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3128` `"id": "forms-messages-date-maximum",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0118.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0119 — element.setAttribute pela porta element.setAttribute#forms-messages-file-type
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3155` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3154` `"id": "forms-messages-file-type",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0119.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0120 — element.setAttribute pela porta element.setAttribute#forms-messages-file-size
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3181` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3180` `"id": "forms-messages-file-size",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0120.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0121 — element.setAttribute pela porta element.setAttribute#forms-messages-configuration
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3207` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3206` `"id": "forms-messages-configuration",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0121.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0122 — element.setAttribute pela porta element.setAttribute#forms-submission-destination
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3233` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3232` `"id": "forms-submission-destination",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0122.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0123 — element.setAttribute pela porta element.setAttribute#forms-submission-endpoint
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3259` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3258` `"id": "forms-submission-endpoint",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0123.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0124 — element.setAttribute pela porta element.setAttribute#forms-submission-method
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3285` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3284` `"id": "forms-submission-method",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0124.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0125 — element.setAttribute pela porta element.setAttribute#forms-submission-encoding
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3311` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3310` `"id": "forms-submission-encoding",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0125.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0126 — element.setAttribute pela porta element.setAttribute#forms-submission-success-id
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3337` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3336` `"id": "forms-submission-success-id",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0126.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0127 — element.setAttribute pela porta element.setAttribute#forms-submission-error-id
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3363` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3362` `"id": "forms-submission-error-id",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0127.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0128 — element.setAttribute pela porta element.setAttribute#forms-submission-honeypot
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3389` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3388` `"id": "forms-submission-honeypot",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0128.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0129 — element.setAttribute pela porta element.setAttribute#forms-submission-redirect
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3415` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3414` `"id": "forms-submission-redirect",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0129.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0130 — element.setAttribute pela porta element.setAttribute#forms-mask-alternative-add
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3441` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3440` `"id": "forms-mask-alternative-add",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0130.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0131 — element.setAttribute pela porta element.setAttribute#forms-mask-alternative-remove
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3467` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3466` `"id": "forms-mask-alternative-remove",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0131.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0132 — element.setAttribute pela porta element.setAttribute#forms-mask-block-add
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3493` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3492` `"id": "forms-mask-block-add",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0132.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0133 — element.setAttribute pela porta element.setAttribute#forms-mask-block-remove
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3519` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3518` `"id": "forms-mask-block-remove",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0133.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0134 — element.setAttribute pela porta element.setAttribute#forms-address-add
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3545` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3544` `"id": "forms-address-add",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0134.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0135 — element.setAttribute pela porta element.setAttribute#forms-address-remove
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3571` `"kind": "inspector-field",`
- **Comando:** element.setAttribute
- **Porta:** `manifest/commands/elements.json:3570` `"id": "forms-address-remove",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0135.md`
- **Requisitos:** REQ-0902

## ENT-P-elements-0136 — assetPicker.open pela porta assetPicker.open#field-source-choose
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:3621` `"kind": "panel-control",`
- **Comando:** assetPicker.open
- **Porta:** `manifest/commands/elements.json:3620` `"id": "field-source-choose",`
- **Tratador:** `src/app/commands.ts:399` `'assetPicker.open': openAssetPicker,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0136.md`
- **Requisitos:** REQ-0903

## ENT-P-elements-0137 — assetPicker.close pela porta assetPicker.close#asset-picker-close
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:3665` `"kind": "panel-control",`
- **Comando:** assetPicker.close
- **Porta:** `manifest/commands/elements.json:3664` `"id": "asset-picker-close",`
- **Tratador:** `src/app/commands.ts:400` `'assetPicker.close': closeAssetPicker,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0137.md`
- **Requisitos:** REQ-0904

## ENT-P-elements-0138 — assetPicker.close pela porta assetPicker.close#key-escape-in-asset-picker
- **Tipo:** comando-porta shortcut `manifest/commands/elements.json:3691` `"kind": "shortcut",`
- **Comando:** assetPicker.close
- **Porta:** `manifest/commands/elements.json:3690` `"id": "key-escape-in-asset-picker",`
- **Gatilho:** `manifest/commands/elements.json:3693` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:400` `'assetPicker.close': closeAssetPicker,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-elements-0138.md`
- **Requisitos:** REQ-0904

## ENT-P-elements-0139 — element.setId pela porta element.setId#inspector-id
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3748` `"kind": "inspector-field",`
- **Comando:** element.setId
- **Porta:** `manifest/commands/elements.json:3747` `"id": "inspector-id",`
- **Tratador:** `src/app/commands.ts:242` `'element.setId': setIdCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0139.md`
- **Requisitos:** REQ-0905

## ENT-P-elements-0140 — element.setClasses pela porta element.setClasses#inspector-classes
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3810` `"kind": "inspector-field",`
- **Comando:** element.setClasses
- **Porta:** `manifest/commands/elements.json:3809` `"id": "inspector-classes",`
- **Tratador:** `src/app/commands.ts:243` `'element.setClasses': setClassesCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0140.md`
- **Requisitos:** REQ-0906

## ENT-P-elements-0141 — element.setLink pela porta element.setLink#inspector-href
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3890` `"kind": "inspector-field",`
- **Comando:** element.setLink
- **Porta:** `manifest/commands/elements.json:3889` `"id": "inspector-href",`
- **Tratador:** `src/app/commands.ts:244` `'element.setLink': closingPicker(setLinkCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0141.md`
- **Requisitos:** REQ-0907

## ENT-P-elements-0142 — element.setLink pela porta element.setLink#inspector-new-tab
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:3916` `"kind": "inspector-field",`
- **Comando:** element.setLink
- **Porta:** `manifest/commands/elements.json:3915` `"id": "inspector-new-tab",`
- **Tratador:** `src/app/commands.ts:244` `'element.setLink': closingPicker(setLinkCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0142.md`
- **Requisitos:** REQ-0907

## ENT-P-elements-0143 — element.setLink pela porta element.setLink#quick-panel-href
- **Tipo:** comando-porta quick-panel `manifest/commands/elements.json:3942` `"kind": "quick-panel",`
- **Comando:** element.setLink
- **Porta:** `manifest/commands/elements.json:3941` `"id": "quick-panel-href",`
- **Tratador:** `src/app/commands.ts:244` `'element.setLink': closingPicker(setLinkCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0143.md`
- **Requisitos:** REQ-0907

## ENT-P-elements-0144 — element.setLink pela porta element.setLink#quick-panel-new-tab
- **Tipo:** comando-porta quick-panel `manifest/commands/elements.json:3965` `"kind": "quick-panel",`
- **Comando:** element.setLink
- **Porta:** `manifest/commands/elements.json:3964` `"id": "quick-panel-new-tab",`
- **Tratador:** `src/app/commands.ts:244` `'element.setLink': closingPicker(setLinkCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0144.md`
- **Requisitos:** REQ-0907

## ENT-P-elements-0145 — element.setLink pela porta element.setLink#link-picker-page-item
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:3988` `"kind": "panel-control",`
- **Comando:** element.setLink
- **Porta:** `manifest/commands/elements.json:3987` `"id": "link-picker-page-item",`
- **Tratador:** `src/app/commands.ts:244` `'element.setLink': closingPicker(setLinkCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0145.md`
- **Requisitos:** REQ-0907

## ENT-P-elements-0146 — element.setLink pela porta element.setLink#link-picker-anchor-item
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4014` `"kind": "panel-control",`
- **Comando:** element.setLink
- **Porta:** `manifest/commands/elements.json:4013` `"id": "link-picker-anchor-item",`
- **Tratador:** `src/app/commands.ts:244` `'element.setLink': closingPicker(setLinkCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0146.md`
- **Requisitos:** REQ-0907

## ENT-P-elements-0147 — linkPicker.open pela porta linkPicker.open#field-href-choose
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4064` `"kind": "panel-control",`
- **Comando:** linkPicker.open
- **Porta:** `manifest/commands/elements.json:4063` `"id": "field-href-choose",`
- **Tratador:** `src/app/commands.ts:396` `'linkPicker.open': openLinkPicker,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0147.md`
- **Requisitos:** REQ-0908

## ENT-P-elements-0148 — linkPicker.setKind pela porta linkPicker.setKind#link-picker-page
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4120` `"kind": "panel-control",`
- **Comando:** linkPicker.setKind
- **Porta:** `manifest/commands/elements.json:4119` `"id": "link-picker-page",`
- **Tratador:** `src/app/commands.ts:397` `'linkPicker.setKind': setLinkKind,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0148.md`
- **Requisitos:** REQ-0909

## ENT-P-elements-0149 — linkPicker.setKind pela porta linkPicker.setKind#link-picker-anchor
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4148` `"kind": "panel-control",`
- **Comando:** linkPicker.setKind
- **Porta:** `manifest/commands/elements.json:4147` `"id": "link-picker-anchor",`
- **Tratador:** `src/app/commands.ts:397` `'linkPicker.setKind': setLinkKind,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0149.md`
- **Requisitos:** REQ-0909

## ENT-P-elements-0150 — linkPicker.setKind pela porta linkPicker.setKind#link-picker-url
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4176` `"kind": "panel-control",`
- **Comando:** linkPicker.setKind
- **Porta:** `manifest/commands/elements.json:4175` `"id": "link-picker-url",`
- **Tratador:** `src/app/commands.ts:397` `'linkPicker.setKind': setLinkKind,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0150.md`
- **Requisitos:** REQ-0909

## ENT-P-elements-0151 — linkPicker.setKind pela porta linkPicker.setKind#link-picker-email
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4204` `"kind": "panel-control",`
- **Comando:** linkPicker.setKind
- **Porta:** `manifest/commands/elements.json:4203` `"id": "link-picker-email",`
- **Tratador:** `src/app/commands.ts:397` `'linkPicker.setKind': setLinkKind,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0151.md`
- **Requisitos:** REQ-0909

## ENT-P-elements-0152 — linkPicker.setKind pela porta linkPicker.setKind#link-picker-phone
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4232` `"kind": "panel-control",`
- **Comando:** linkPicker.setKind
- **Porta:** `manifest/commands/elements.json:4231` `"id": "link-picker-phone",`
- **Tratador:** `src/app/commands.ts:397` `'linkPicker.setKind': setLinkKind,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0152.md`
- **Requisitos:** REQ-0909

## ENT-P-elements-0153 — linkPicker.close pela porta linkPicker.close#link-picker-close
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4278` `"kind": "panel-control",`
- **Comando:** linkPicker.close
- **Porta:** `manifest/commands/elements.json:4277` `"id": "link-picker-close",`
- **Tratador:** `src/app/commands.ts:398` `'linkPicker.close': closeLinkPicker,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0153.md`
- **Requisitos:** REQ-0910

## ENT-P-elements-0154 — linkPicker.close pela porta linkPicker.close#key-escape-in-link-picker
- **Tipo:** comando-porta shortcut `manifest/commands/elements.json:4304` `"kind": "shortcut",`
- **Comando:** linkPicker.close
- **Porta:** `manifest/commands/elements.json:4303` `"id": "key-escape-in-link-picker",`
- **Gatilho:** `manifest/commands/elements.json:4306` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:398` `'linkPicker.close': closeLinkPicker,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-elements-0154.md`
- **Requisitos:** REQ-0910

## ENT-P-elements-0155 — element.setInputType pela porta element.setInputType#inspector-input-type
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:4356` `"kind": "inspector-field",`
- **Comando:** element.setInputType
- **Porta:** `manifest/commands/elements.json:4355` `"id": "inspector-input-type",`
- **Tratador:** `src/app/commands.ts:245` `'element.setInputType': setInputTypeCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0155.md`
- **Requisitos:** REQ-0911

## ENT-P-elements-0156 — element.setInputType pela porta element.setInputType#inspector-input-type-text-for-masks
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:4382` `"kind": "inspector-field",`
- **Comando:** element.setInputType
- **Porta:** `manifest/commands/elements.json:4381` `"id": "inspector-input-type-text-for-masks",`
- **Tratador:** `src/app/commands.ts:245` `'element.setInputType': setInputTypeCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0156.md`
- **Requisitos:** REQ-0911

## ENT-P-elements-0157 — element.setLabelTarget pela porta element.setLabelTarget#inspector-label-for
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:4442` `"kind": "inspector-field",`
- **Comando:** element.setLabelTarget
- **Porta:** `manifest/commands/elements.json:4441` `"id": "inspector-label-for",`
- **Tratador:** `src/app/commands.ts:246` `'element.setLabelTarget': setLabelTargetCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0157.md`
- **Requisitos:** REQ-0912

## ENT-P-elements-0158 — element.setCustomAttribute pela porta element.setCustomAttribute#inspector-custom-attribute-add
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4506` `"kind": "panel-control",`
- **Comando:** element.setCustomAttribute
- **Porta:** `manifest/commands/elements.json:4505` `"id": "inspector-custom-attribute-add",`
- **Tratador:** `src/app/commands.ts:247` `'element.setCustomAttribute': setCustomAttributeCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0158.md`
- **Requisitos:** REQ-0913

## ENT-P-elements-0159 — element.setCustomAttribute pela porta element.setCustomAttribute#inspector-custom-attribute-value
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4532` `"kind": "panel-control",`
- **Comando:** element.setCustomAttribute
- **Porta:** `manifest/commands/elements.json:4531` `"id": "inspector-custom-attribute-value",`
- **Tratador:** `src/app/commands.ts:247` `'element.setCustomAttribute': setCustomAttributeCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0159.md`
- **Requisitos:** REQ-0913

## ENT-P-elements-0160 — element.removeCustomAttribute pela porta element.removeCustomAttribute#inspector-custom-attribute-remove
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4588` `"kind": "panel-control",`
- **Comando:** element.removeCustomAttribute
- **Porta:** `manifest/commands/elements.json:4587` `"id": "inspector-custom-attribute-remove",`
- **Tratador:** `src/app/commands.ts:248` `'element.removeCustomAttribute': removeCustomAttributeCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0160.md`
- **Requisitos:** REQ-0914

## ENT-P-elements-0161 — element.setSvgMarkup pela porta element.setSvgMarkup#inspector-svg-markup
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:4648` `"kind": "inspector-field",`
- **Comando:** element.setSvgMarkup
- **Porta:** `manifest/commands/elements.json:4647` `"id": "inspector-svg-markup",`
- **Tratador:** `src/app/commands.ts:249` `'element.setSvgMarkup': setSvgMarkupCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0161.md`
- **Requisitos:** REQ-0915

## ENT-P-elements-0162 — element.setEmbedMarkup pela porta element.setEmbedMarkup#inspector-embed-markup
- **Tipo:** comando-porta inspector-field `manifest/commands/elements.json:4710` `"kind": "inspector-field",`
- **Comando:** element.setEmbedMarkup
- **Porta:** `manifest/commands/elements.json:4709` `"id": "inspector-embed-markup",`
- **Tratador:** `src/app/commands.ts:250` `'element.setEmbedMarkup': setEmbedMarkupCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0162.md`
- **Requisitos:** REQ-0916

## ENT-P-elements-0163 — element.applyHtml pela porta element.applyHtml#code-panel-html-apply
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4773` `"kind": "panel-control",`
- **Comando:** element.applyHtml
- **Porta:** `manifest/commands/elements.json:4772` `"id": "code-panel-html-apply",`
- **Tratador:** `src/app/commands.ts:251` `'element.applyHtml': applyHtmlCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0163.md`
- **Requisitos:** REQ-0917

## ENT-P-elements-0164 — parts.toggle pela porta parts.toggle#inspector-table-caption-toggle
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4835` `"kind": "panel-control",`
- **Comando:** parts.toggle
- **Porta:** `manifest/commands/elements.json:4834` `"id": "inspector-table-caption-toggle",`
- **Tratador:** `src/app/commands.ts:252` `'parts.toggle': togglePartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0164.md`
- **Requisitos:** REQ-0918

## ENT-P-elements-0165 — parts.toggle pela porta parts.toggle#inspector-table-head-toggle
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4863` `"kind": "panel-control",`
- **Comando:** parts.toggle
- **Porta:** `manifest/commands/elements.json:4862` `"id": "inspector-table-head-toggle",`
- **Tratador:** `src/app/commands.ts:252` `'parts.toggle': togglePartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0165.md`
- **Requisitos:** REQ-0918

## ENT-P-elements-0166 — parts.toggle pela porta parts.toggle#inspector-table-foot-toggle
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4891` `"kind": "panel-control",`
- **Comando:** parts.toggle
- **Porta:** `manifest/commands/elements.json:4890` `"id": "inspector-table-foot-toggle",`
- **Tratador:** `src/app/commands.ts:252` `'parts.toggle': togglePartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0166.md`
- **Requisitos:** REQ-0918

## ENT-P-elements-0167 — parts.add pela porta parts.add#inspector-options-editor-add-option
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4964` `"kind": "panel-control",`
- **Comando:** parts.add
- **Porta:** `manifest/commands/elements.json:4963` `"id": "inspector-options-editor-add-option",`
- **Tratador:** `src/app/commands.ts:253` `'parts.add': addPartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0167.md`
- **Requisitos:** REQ-0919

## ENT-P-elements-0168 — parts.add pela porta parts.add#inspector-options-editor-add-option-group
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:4992` `"kind": "panel-control",`
- **Comando:** parts.add
- **Porta:** `manifest/commands/elements.json:4991` `"id": "inspector-options-editor-add-option-group",`
- **Tratador:** `src/app/commands.ts:253` `'parts.add': addPartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0168.md`
- **Requisitos:** REQ-0919

## ENT-P-elements-0169 — parts.add pela porta parts.add#inspector-picture-sources-add-source
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:5020` `"kind": "panel-control",`
- **Comando:** parts.add
- **Porta:** `manifest/commands/elements.json:5019` `"id": "inspector-picture-sources-add-source",`
- **Tratador:** `src/app/commands.ts:253` `'parts.add': addPartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0169.md`
- **Requisitos:** REQ-0919

## ENT-P-elements-0170 — parts.add pela porta parts.add#inspector-media-sources-add-track
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:5048` `"kind": "panel-control",`
- **Comando:** parts.add
- **Porta:** `manifest/commands/elements.json:5047` `"id": "inspector-media-sources-add-track",`
- **Tratador:** `src/app/commands.ts:253` `'parts.add': addPartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0170.md`
- **Requisitos:** REQ-0919

## ENT-P-elements-0171 — parts.add pela porta parts.add#inspector-svg-shapes-add-rectangle
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:5076` `"kind": "panel-control",`
- **Comando:** parts.add
- **Porta:** `manifest/commands/elements.json:5075` `"id": "inspector-svg-shapes-add-rectangle",`
- **Tratador:** `src/app/commands.ts:253` `'parts.add': addPartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0171.md`
- **Requisitos:** REQ-0919

## ENT-P-elements-0172 — parts.add pela porta parts.add#inspector-svg-shapes-add-ellipse
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:5104` `"kind": "panel-control",`
- **Comando:** parts.add
- **Porta:** `manifest/commands/elements.json:5103` `"id": "inspector-svg-shapes-add-ellipse",`
- **Tratador:** `src/app/commands.ts:253` `'parts.add': addPartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0172.md`
- **Requisitos:** REQ-0919

## ENT-P-elements-0173 — parts.add pela porta parts.add#inspector-svg-shapes-add-line
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:5132` `"kind": "panel-control",`
- **Comando:** parts.add
- **Porta:** `manifest/commands/elements.json:5131` `"id": "inspector-svg-shapes-add-line",`
- **Tratador:** `src/app/commands.ts:253` `'parts.add': addPartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0173.md`
- **Requisitos:** REQ-0919

## ENT-P-elements-0174 — parts.add pela porta parts.add#inspector-media-sources-add-source
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:5160` `"kind": "panel-control",`
- **Comando:** parts.add
- **Porta:** `manifest/commands/elements.json:5159` `"id": "inspector-media-sources-add-source",`
- **Tratador:** `src/app/commands.ts:253` `'parts.add': addPartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0174.md`
- **Requisitos:** REQ-0919

## ENT-P-elements-0175 — parts.move pela porta parts.move#inspector-part-move-up
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:5223` `"kind": "panel-control",`
- **Comando:** parts.move
- **Porta:** `manifest/commands/elements.json:5222` `"id": "inspector-part-move-up",`
- **Tratador:** `src/app/commands.ts:254` `'parts.move': movePartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0175.md`
- **Requisitos:** REQ-0920

## ENT-P-elements-0176 — parts.move pela porta parts.move#inspector-part-move-down
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:5251` `"kind": "panel-control",`
- **Comando:** parts.move
- **Porta:** `manifest/commands/elements.json:5250` `"id": "inspector-part-move-down",`
- **Tratador:** `src/app/commands.ts:254` `'parts.move': movePartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0176.md`
- **Requisitos:** REQ-0920

## ENT-P-elements-0177 — parts.remove pela porta parts.remove#inspector-part-remove
- **Tipo:** comando-porta panel-control `manifest/commands/elements.json:5309` `"kind": "panel-control",`
- **Comando:** parts.remove
- **Porta:** `manifest/commands/elements.json:5308` `"id": "inspector-part-remove",`
- **Tratador:** `src/app/commands.ts:255` `'parts.remove': removePartCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0177.md`
- **Requisitos:** REQ-0921

## ENT-P-elements-0178 — table.addColumnAfter pela porta table.addColumnAfter#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/elements.json:5359` `"kind": "context-menu",`
- **Comando:** table.addColumnAfter
- **Porta:** `manifest/commands/elements.json:5358` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:256` `'table.addColumnAfter': addColumnAfterCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0178.md`
- **Requisitos:** REQ-0922

## ENT-P-elements-0179 — table.addColumnAfter pela porta table.addColumnAfter#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/elements.json:5379` `"kind": "command-bar",`
- **Comando:** table.addColumnAfter
- **Porta:** `manifest/commands/elements.json:5378` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:256` `'table.addColumnAfter': addColumnAfterCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0179.md`
- **Requisitos:** REQ-0922

## ENT-P-elements-0180 — table.addColumnEnd pela porta table.addColumnEnd#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/elements.json:5424` `"kind": "context-menu",`
- **Comando:** table.addColumnEnd
- **Porta:** `manifest/commands/elements.json:5423` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:257` `'table.addColumnEnd': addColumnEndCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0180.md`
- **Requisitos:** REQ-0923

## ENT-P-elements-0181 — table.addColumnEnd pela porta table.addColumnEnd#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/elements.json:5444` `"kind": "command-bar",`
- **Comando:** table.addColumnEnd
- **Porta:** `manifest/commands/elements.json:5443` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:257` `'table.addColumnEnd': addColumnEndCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0181.md`
- **Requisitos:** REQ-0923

## ENT-P-elements-0182 — table.removeColumn pela porta table.removeColumn#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/elements.json:5490` `"kind": "context-menu",`
- **Comando:** table.removeColumn
- **Porta:** `manifest/commands/elements.json:5489` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:258` `'table.removeColumn': removeColumnCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0182.md`
- **Requisitos:** REQ-0924

## ENT-P-elements-0183 — table.removeColumn pela porta table.removeColumn#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/elements.json:5510` `"kind": "command-bar",`
- **Comando:** table.removeColumn
- **Porta:** `manifest/commands/elements.json:5509` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:258` `'table.removeColumn': removeColumnCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0183.md`
- **Requisitos:** REQ-0924

## ENT-P-elements-0184 — table.addRowAfter pela porta table.addRowAfter#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/elements.json:5555` `"kind": "context-menu",`
- **Comando:** table.addRowAfter
- **Porta:** `manifest/commands/elements.json:5554` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:259` `'table.addRowAfter': addRowAfterCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0184.md`
- **Requisitos:** REQ-0925

## ENT-P-elements-0185 — table.addRowAfter pela porta table.addRowAfter#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/elements.json:5575` `"kind": "command-bar",`
- **Comando:** table.addRowAfter
- **Porta:** `manifest/commands/elements.json:5574` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:259` `'table.addRowAfter': addRowAfterCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0185.md`
- **Requisitos:** REQ-0925

## ENT-P-elements-0186 — table.removeRow pela porta table.removeRow#context-menu
- **Tipo:** comando-porta context-menu `manifest/commands/elements.json:5621` `"kind": "context-menu",`
- **Comando:** table.removeRow
- **Porta:** `manifest/commands/elements.json:5620` `"id": "context-menu",`
- **Tratador:** `src/app/commands.ts:260` `'table.removeRow': removeRowCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0186.md`
- **Requisitos:** REQ-0926

## ENT-P-elements-0187 — table.removeRow pela porta table.removeRow#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/elements.json:5641` `"kind": "command-bar",`
- **Comando:** table.removeRow
- **Porta:** `manifest/commands/elements.json:5640` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:260` `'table.removeRow': removeRowCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-elements-0187.md`
- **Requisitos:** REQ-0926

## Excluídos

## EXC-portas-elements-001
- **Padrão:** P-N14
- **Ocorrência:** `manifest/commands/elements.json:4143` `"kind": "page"`
- **Motivo:** valor do argumento `kind` da porta `manifest/commands/elements.json:4119` `"id": "link-picker-page",`; não é o `kind` de uma porta de comando.

## EXC-portas-elements-002
- **Padrão:** P-N14
- **Ocorrência:** `manifest/commands/elements.json:4171` `"kind": "anchor"`
- **Motivo:** valor do argumento `kind` da porta `manifest/commands/elements.json:4147` `"id": "link-picker-anchor",`; não é o `kind` de uma porta de comando.

## EXC-portas-elements-003
- **Padrão:** P-N14
- **Ocorrência:** `manifest/commands/elements.json:4199` `"kind": "url"`
- **Motivo:** valor do argumento `kind` da porta `manifest/commands/elements.json:4175` `"id": "link-picker-url",`; não é o `kind` de uma porta de comando.

## EXC-portas-elements-004
- **Padrão:** P-N14
- **Ocorrência:** `manifest/commands/elements.json:4227` `"kind": "email"`
- **Motivo:** valor do argumento `kind` da porta `manifest/commands/elements.json:4203` `"id": "link-picker-email",`; não é o `kind` de uma porta de comando.

## EXC-portas-elements-005
- **Padrão:** P-N14
- **Ocorrência:** `manifest/commands/elements.json:4255` `"kind": "phone"`
- **Motivo:** valor do argumento `kind` da porta `manifest/commands/elements.json:4231` `"id": "link-picker-phone",`; não é o `kind` de uma porta de comando.

