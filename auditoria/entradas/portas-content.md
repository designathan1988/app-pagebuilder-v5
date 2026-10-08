# Portas de comando — domínio content

Fonte: `manifest/commands/content.json`. Uma porta por bloco, na ordem do manifesto.

## ENT-P-content-0001 — data.select pela porta data.select#data-collection-tab
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:29` `"kind": "panel-control",`
- **Comando:** data.select
- **Porta:** `manifest/commands/content.json:28` `"id": "data-collection-tab",`
- **Tratador:** `src/app/commands.ts:152` `'data.select': selectCollection,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0001.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0701

## ENT-P-content-0002 — data.setQuery pela porta data.setQuery#data-filter-field
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:99` `"kind": "panel-control",`
- **Comando:** data.setQuery
- **Porta:** `manifest/commands/content.json:98` `"id": "data-filter-field",`
- **Tratador:** `src/app/commands.ts:153` `'data.setQuery': setQuery,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0002.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0702

## ENT-P-content-0003 — data.setQuery pela porta data.setQuery#data-filter-operator
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:127` `"kind": "panel-control",`
- **Comando:** data.setQuery
- **Porta:** `manifest/commands/content.json:126` `"id": "data-filter-operator",`
- **Tratador:** `src/app/commands.ts:153` `'data.setQuery': setQuery,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0003.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0702

## ENT-P-content-0004 — data.setQuery pela porta data.setQuery#data-filter-value
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:155` `"kind": "panel-control",`
- **Comando:** data.setQuery
- **Porta:** `manifest/commands/content.json:154` `"id": "data-filter-value",`
- **Tratador:** `src/app/commands.ts:153` `'data.setQuery': setQuery,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0004.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0702

## ENT-P-content-0005 — data.setQuery pela porta data.setQuery#data-sort-first
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:183` `"kind": "panel-control",`
- **Comando:** data.setQuery
- **Porta:** `manifest/commands/content.json:182` `"id": "data-sort-first",`
- **Tratador:** `src/app/commands.ts:153` `'data.setQuery': setQuery,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0005.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0702

## ENT-P-content-0006 — data.setQuery pela porta data.setQuery#data-sort-second
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:211` `"kind": "panel-control",`
- **Comando:** data.setQuery
- **Porta:** `manifest/commands/content.json:210` `"id": "data-sort-second",`
- **Tratador:** `src/app/commands.ts:153` `'data.setQuery': setQuery,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0006.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0702

## ENT-P-content-0007 — data.setQuery pela porta data.setQuery#data-offset
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:239` `"kind": "panel-control",`
- **Comando:** data.setQuery
- **Porta:** `manifest/commands/content.json:238` `"id": "data-offset",`
- **Tratador:** `src/app/commands.ts:153` `'data.setQuery': setQuery,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0007.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0702

## ENT-P-content-0008 — data.setQuery pela porta data.setQuery#data-limit
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:267` `"kind": "panel-control",`
- **Comando:** data.setQuery
- **Porta:** `manifest/commands/content.json:266` `"id": "data-limit",`
- **Tratador:** `src/app/commands.ts:153` `'data.setQuery': setQuery,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0008.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0702

## ENT-P-content-0009 — data.setQuery pela porta data.setQuery#data-query-clear
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:295` `"kind": "panel-control",`
- **Comando:** data.setQuery
- **Porta:** `manifest/commands/content.json:294` `"id": "data-query-clear",`
- **Tratador:** `src/app/commands.ts:153` `'data.setQuery': setQuery,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0009.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0702

## ENT-P-content-0010 — data.createCollection pela porta data.createCollection#data-new-collection
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:354` `"kind": "panel-control",`
- **Comando:** data.createCollection
- **Porta:** `manifest/commands/content.json:353` `"id": "data-new-collection",`
- **Tratador:** `src/app/commands.ts:154` `'data.createCollection': createCollectionCommand<EditorUi>(),`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0010.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0703

## ENT-P-content-0011 — data.renameCollection pela porta data.renameCollection#data-collection-name
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:417` `"kind": "panel-control",`
- **Comando:** data.renameCollection
- **Porta:** `manifest/commands/content.json:416` `"id": "data-collection-name",`
- **Tratador:** `src/app/commands.ts:155` `'data.renameCollection': renameCollectionCommand<EditorUi>(),`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0011.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0704

## ENT-P-content-0012 — data.deleteCollection pela porta data.deleteCollection#data-collection-delete
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:476` `"kind": "panel-control",`
- **Comando:** data.deleteCollection
- **Porta:** `manifest/commands/content.json:475` `"id": "data-collection-delete",`
- **Tratador:** `src/app/commands.ts:156` `'data.deleteCollection': deleteCollectionCommand<EditorUi>(),`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0012.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0705

## ENT-P-content-0013 — data.addField pela porta data.addField#data-field-add
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:547` `"kind": "panel-control",`
- **Comando:** data.addField
- **Porta:** `manifest/commands/content.json:546` `"id": "data-field-add",`
- **Tratador:** `src/app/commands.ts:157` `'data.addField': addFieldCommand<EditorUi>(),`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0013.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0706

## ENT-P-content-0014 — data.setField pela porta data.setField#data-field-label
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:636` `"kind": "panel-control",`
- **Comando:** data.setField
- **Porta:** `manifest/commands/content.json:635` `"id": "data-field-label",`
- **Tratador:** `src/app/commands.ts:158` `'data.setField': setFieldCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0014.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0707

## ENT-P-content-0015 — data.setField pela porta data.setField#data-field-type
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:662` `"kind": "panel-control",`
- **Comando:** data.setField
- **Porta:** `manifest/commands/content.json:661` `"id": "data-field-type",`
- **Tratador:** `src/app/commands.ts:158` `'data.setField': setFieldCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0015.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0707

## ENT-P-content-0016 — data.removeField pela porta data.removeField#data-field-remove
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:725` `"kind": "panel-control",`
- **Comando:** data.removeField
- **Porta:** `manifest/commands/content.json:724` `"id": "data-field-remove",`
- **Tratador:** `src/app/commands.ts:159` `'data.removeField': removeFieldCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0016.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0708

## ENT-P-content-0017 — data.addItem pela porta data.addItem#data-item-add
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:789` `"kind": "panel-control",`
- **Comando:** data.addItem
- **Porta:** `manifest/commands/content.json:788` `"id": "data-item-add",`
- **Tratador:** `src/app/commands.ts:160` `'data.addItem': addItemCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0017.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0709

## ENT-P-content-0018 — data.setCell pela porta data.setCell#data-cell
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:868` `"kind": "panel-control",`
- **Comando:** data.setCell
- **Porta:** `manifest/commands/content.json:867` `"id": "data-cell",`
- **Tratador:** `src/app/commands.ts:161` `'data.setCell': setCellCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0018.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0710

## ENT-P-content-0019 — data.deleteItems pela porta data.deleteItems#data-item-delete
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:937` `"kind": "panel-control",`
- **Comando:** data.deleteItems
- **Porta:** `manifest/commands/content.json:936` `"id": "data-item-delete",`
- **Tratador:** `src/app/commands.ts:162` `'data.deleteItems': deleteItemsCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0019.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0711

## ENT-P-content-0020 — data.moveItem pela porta data.moveItem#data-item-up
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1011` `"kind": "panel-control",`
- **Comando:** data.moveItem
- **Porta:** `manifest/commands/content.json:1010` `"id": "data-item-up",`
- **Tratador:** `src/app/commands.ts:163` `'data.moveItem': moveItemCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0020.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0712

## ENT-P-content-0021 — data.moveItem pela porta data.moveItem#data-item-down
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1037` `"kind": "panel-control",`
- **Comando:** data.moveItem
- **Porta:** `manifest/commands/content.json:1036` `"id": "data-item-down",`
- **Tratador:** `src/app/commands.ts:163` `'data.moveItem': moveItemCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0021.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0712

## ENT-P-content-0022 — data.preview pela porta data.preview#data-import
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1101` `"kind": "panel-control",`
- **Comando:** data.preview
- **Porta:** `manifest/commands/content.json:1100` `"id": "data-import",`
- **Tratador:** `src/app/commands.ts:164` `'data.preview': previewFile,`
- **Início:** `src/editor/doors/door.tsx:123` `dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });`
- **Fluxo:** `fluxos/ENT-P-content-0022.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0713

## ENT-P-content-0023 — data.previewSheet pela porta data.previewSheet#data-preview-sheet
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1152` `"kind": "panel-control",`
- **Comando:** data.previewSheet
- **Porta:** `manifest/commands/content.json:1151` `"id": "data-preview-sheet",`
- **Tratador:** `src/app/commands.ts:165` `'data.previewSheet': choosePreviewSheet,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0023.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0714

## ENT-P-content-0024 — data.previewType pela porta data.previewType#data-preview-type
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1215` `"kind": "panel-control",`
- **Comando:** data.previewType
- **Porta:** `manifest/commands/content.json:1214` `"id": "data-preview-type",`
- **Tratador:** `src/app/commands.ts:166` `'data.previewType': setPreviewType,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0024.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0715

## ENT-P-content-0025 — data.closePreview pela porta data.closePreview#data-preview-close
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1259` `"kind": "panel-control",`
- **Comando:** data.closePreview
- **Porta:** `manifest/commands/content.json:1258` `"id": "data-preview-close",`
- **Tratador:** `src/app/commands.ts:167` `'data.closePreview': closePreview,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0025.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0716

## ENT-P-content-0026 — data.importNew pela porta data.importNew#data-import-new
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1339` `"kind": "panel-control",`
- **Comando:** data.importNew
- **Porta:** `manifest/commands/content.json:1338` `"id": "data-import-new",`
- **Tratador:** `src/app/commands.ts:168` `'data.importNew': importNew,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0026.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0717

## ENT-P-content-0027 — data.importInto pela porta data.importInto#data-import-append
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1430` `"kind": "panel-control",`
- **Comando:** data.importInto
- **Porta:** `manifest/commands/content.json:1429` `"id": "data-import-append",`
- **Tratador:** `src/app/commands.ts:169` `'data.importInto': importInto,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0027.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0718

## ENT-P-content-0028 — data.importInto pela porta data.importInto#data-import-replace
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1458` `"kind": "panel-control",`
- **Comando:** data.importInto
- **Porta:** `manifest/commands/content.json:1457` `"id": "data-import-replace",`
- **Tratador:** `src/app/commands.ts:169` `'data.importInto': importInto,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0028.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0718

## ENT-P-content-0029 — data.importInto pela porta data.importInto#data-import-update
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1486` `"kind": "panel-control",`
- **Comando:** data.importInto
- **Porta:** `manifest/commands/content.json:1485` `"id": "data-import-update",`
- **Tratador:** `src/app/commands.ts:169` `'data.importInto': importInto,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0029.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0718

## ENT-P-content-0030 — data.bindElement pela porta data.bindElement#data-bind-field
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1569` `"kind": "panel-control",`
- **Comando:** data.bindElement
- **Porta:** `manifest/commands/content.json:1568` `"id": "data-bind-field",`
- **Tratador:** `src/app/commands.ts:170` `'data.bindElement': bindElementCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0030.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0719

## ENT-P-content-0031 — data.bindElement pela porta data.bindElement#panel-drag-data-column
- **Tipo:** comando-porta panel-drag `manifest/commands/content.json:1595` `"kind": "panel-drag",`
- **Comando:** data.bindElement
- **Porta:** `manifest/commands/content.json:1594` `"id": "panel-drag-data-column",`
- **Gatilho:** `manifest/commands/content.json:1599` `"gesture": "data-column-drag",`
- **Tratador:** `src/app/commands.ts:170` `'data.bindElement': bindElementCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:199` `closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);`
- **Fluxo:** `fluxos/ENT-P-content-0031.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0719

## ENT-P-content-0032 — data.fill pela porta data.fill#data-fill
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1673` `"kind": "panel-control",`
- **Comando:** data.fill
- **Porta:** `manifest/commands/content.json:1672` `"id": "data-fill",`
- **Tratador:** `src/app/commands.ts:171` `'data.fill': fillCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0032.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0720

## ENT-P-content-0033 — data.unbind pela porta data.unbind#data-unbind
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1731` `"kind": "panel-control",`
- **Comando:** data.unbind
- **Porta:** `manifest/commands/content.json:1730` `"id": "data-unbind",`
- **Tratador:** `src/app/commands.ts:172` `'data.unbind': unbindCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0033.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0721

## ENT-P-content-0034 — pages.fromNames pela porta pages.fromNames#data-pages-from-names
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1795` `"kind": "panel-control",`
- **Comando:** pages.fromNames
- **Porta:** `manifest/commands/content.json:1794` `"id": "data-pages-from-names",`
- **Tratador:** `src/app/commands.ts:173` `'pages.fromNames': pagesFromNamesCommand<EditorUi>(),`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0034.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0722

## ENT-P-content-0035 — pages.fromCollection pela porta pages.fromCollection#data-pages-from-collection
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1866` `"kind": "panel-control",`
- **Comando:** pages.fromCollection
- **Porta:** `manifest/commands/content.json:1865` `"id": "data-pages-from-collection",`
- **Tratador:** `src/app/commands.ts:174` `'pages.fromCollection': pagesFromCollectionCommand<EditorUi>(),`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0035.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0723

## ENT-P-content-0036 — regions.share pela porta regions.share#data-share
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1935` `"kind": "panel-control",`
- **Comando:** regions.share
- **Porta:** `manifest/commands/content.json:1934` `"id": "data-share",`
- **Tratador:** `src/app/commands.ts:175` `'regions.share': shareRegionCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0036.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0724

## ENT-P-content-0037 — regions.detach pela porta regions.detach#data-shared-detach
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:1993` `"kind": "panel-control",`
- **Comando:** regions.detach
- **Porta:** `manifest/commands/content.json:1992` `"id": "data-shared-detach",`
- **Tratador:** `src/app/commands.ts:176` `'regions.detach': detachRegionCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0037.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0725

## ENT-P-content-0038 — regions.stopSharing pela porta regions.stopSharing#data-shared-stop
- **Tipo:** comando-porta panel-control `manifest/commands/content.json:2050` `"kind": "panel-control",`
- **Comando:** regions.stopSharing
- **Porta:** `manifest/commands/content.json:2049` `"id": "data-shared-stop",`
- **Tratador:** `src/app/commands.ts:177` `'regions.stopSharing': stopSharingCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-content-0038.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0726
