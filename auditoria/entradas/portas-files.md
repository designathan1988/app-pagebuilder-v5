# Portas de comando — domínio files

Fonte: `manifest/commands/files.json`. Uma porta por bloco, na ordem do manifesto. O `Início` cita a linha que despacha a porta: o keymap para uma porta `shortcut`, `src/editor/doors/door.tsx` para um controle desenhado por `DoorControl`, o componente do próprio controle quando ele desenha o campo fora de `DoorControl`, e o dono do ponteiro para as portas de arraste.

## ENT-P-files-0001 — pages.add pela porta explorer-add-page
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:34` `"kind": "panel-control",`
- **Comando:** pages.add
- **Porta:** `manifest/commands/files.json:33` `"id": "explorer-add-page",`
- **Tratador:** `src/app/commands.ts:296` `'pages.add': addPageCommand<EditorUi>(),`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0001.md
- **Requisitos:** REQ-1101

## ENT-P-files-0002 — pages.rename pela porta explorer-page-name-field
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:98` `"kind": "panel-control",`
- **Comando:** pages.rename
- **Porta:** `manifest/commands/files.json:97` `"id": "explorer-page-name-field",`
- **Tratador:** `src/app/commands.ts:297` `'pages.rename': renamePageCommand,`
- **Início:** `src/editor/shell/sidebar/explorer.tsx:84` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(PAGE_NAME.command.id as CommandId, { ...PAGE_NAME.door.args, page: page.tree.id, name });`
- **Fluxo:** fluxos/ENT-P-files-0002.md
- **Requisitos:** REQ-1102

## ENT-P-files-0003 — pages.duplicate pela porta explorer-page-duplicate
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:153` `"kind": "panel-control",`
- **Comando:** pages.duplicate
- **Porta:** `manifest/commands/files.json:152` `"id": "explorer-page-duplicate",`
- **Tratador:** `src/app/commands.ts:298` `'pages.duplicate': duplicatePageCommandFor<EditorUi>(),`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0003.md
- **Requisitos:** REQ-1103

## ENT-P-files-0004 — pages.delete pela porta explorer-page-delete
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:214` `"kind": "panel-control",`
- **Comando:** pages.delete
- **Porta:** `manifest/commands/files.json:213` `"id": "explorer-page-delete",`
- **Tratador:** `src/app/commands.ts:299` `'pages.delete': deletePageCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0004.md
- **Requisitos:** REQ-1104

## ENT-P-files-0005 — pages.switch pela porta explorer-page-row
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:265` `"kind": "panel-control",`
- **Comando:** pages.switch
- **Porta:** `manifest/commands/files.json:264` `"id": "explorer-page-row",`
- **Tratador:** `src/app/commands.ts:300` `'pages.switch': SWITCH_PAGE,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0005.md
- **Requisitos:** REQ-1105

## ENT-P-files-0006 — pages.switch pela porta file-tab
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:291` `"kind": "panel-control",`
- **Comando:** pages.switch
- **Porta:** `manifest/commands/files.json:290` `"id": "file-tab",`
- **Tratador:** `src/app/commands.ts:300` `'pages.switch': SWITCH_PAGE,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0006.md
- **Requisitos:** REQ-1105

## ENT-P-files-0007 — pages.switch pela porta toolbar-top-bar-page-switcher
- **Tipo:** comando-porta toolbar `manifest/commands/files.json:319` `"kind": "toolbar",`
- **Comando:** pages.switch
- **Porta:** `manifest/commands/files.json:318` `"id": "toolbar-top-bar-page-switcher",`
- **Tratador:** `src/app/commands.ts:300` `'pages.switch': SWITCH_PAGE,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0007.md
- **Requisitos:** REQ-1105

## ENT-P-files-0008 — pages.switch pela porta command-bar-go-to-page
- **Tipo:** comando-porta command-bar `manifest/commands/files.json:343` `"kind": "command-bar",`
- **Comando:** pages.switch
- **Porta:** `manifest/commands/files.json:342` `"id": "command-bar-go-to-page",`
- **Tratador:** `src/app/commands.ts:300` `'pages.switch': SWITCH_PAGE,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0008.md
- **Requisitos:** REQ-1105

## ENT-P-files-0009 — files.createFolder pela porta explorer-new-folder
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:398` `"kind": "panel-control",`
- **Comando:** files.createFolder
- **Porta:** `manifest/commands/files.json:397` `"id": "explorer-new-folder",`
- **Tratador:** `src/app/commands.ts:301` `'files.createFolder': createFolderCommand,`
- **Início:** `src/editor/shell/sidebar/explorer.tsx:200` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(door.command.id as CommandId, { ...door.door.args, path });`
- **Fluxo:** fluxos/ENT-P-files-0009.md
- **Requisitos:** REQ-1106

## ENT-P-files-0010 — files.createFile pela porta explorer-new-file
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:456` `"kind": "panel-control",`
- **Comando:** files.createFile
- **Porta:** `manifest/commands/files.json:455` `"id": "explorer-new-file",`
- **Tratador:** `src/app/commands.ts:302` `'files.createFile': createFileCommand,`
- **Início:** `src/editor/shell/sidebar/explorer.tsx:200` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(door.command.id as CommandId, { ...door.door.args, path });`
- **Fluxo:** fluxos/ENT-P-files-0010.md
- **Requisitos:** REQ-1107

## ENT-P-files-0011 — files.startRename pela porta explorer-file-name
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:506` `"kind": "panel-control",`
- **Comando:** files.startRename
- **Porta:** `manifest/commands/files.json:505` `"id": "explorer-file-name",`
- **Tratador:** `src/app/commands.ts:303` `'files.startRename': startRenameFile,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0011.md
- **Requisitos:** REQ-1108

## ENT-P-files-0012 — files.rename pela porta explorer-file-name-field
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:570` `"kind": "panel-control",`
- **Comando:** files.rename
- **Porta:** `manifest/commands/files.json:569` `"id": "explorer-file-name-field",`
- **Tratador:** `src/app/commands.ts:304` `'files.rename': renameFileCommand,`
- **Início:** `src/editor/shell/sidebar/explorer.tsx:243` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(doors.rename?.command.id as CommandId, { path: row.path, name: wanted });`
- **Fluxo:** fluxos/ENT-P-files-0012.md
- **Requisitos:** REQ-1109

## ENT-P-files-0013 — files.move pela porta panel-drag-explorer-row-folder
- **Tipo:** comando-porta panel-drag `manifest/commands/files.json:639` `"kind": "panel-drag",`
- **Comando:** files.move
- **Porta:** `manifest/commands/files.json:638` `"id": "panel-drag-explorer-row-folder",`
- **Gatilho:** `manifest/commands/files.json:641` `"source": "explorer-row",` `manifest/commands/files.json:642` `"zone": "folder",` `manifest/commands/files.json:643` `"gesture": "explorer-drag",`
- **Tratador:** `src/app/commands.ts:305` `'files.move': moveFileCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:193` `if (into !== null) closing?.dispatch(exploringNow.entry.command.id as CommandId, { ...exploringNow.entry.door.args, ...exploringNow.args, to: into } as never);`
- **Fluxo:** fluxos/ENT-P-files-0013.md
- **Requisitos:** REQ-1110

## ENT-P-files-0014 — files.move pela porta explorer-move-to
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:659` `"kind": "panel-control",`
- **Comando:** files.move
- **Porta:** `manifest/commands/files.json:658` `"id": "explorer-move-to",`
- **Tratador:** `src/app/commands.ts:305` `'files.move': moveFileCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0014.md
- **Requisitos:** REQ-1110

## ENT-P-files-0015 — files.move pela porta explorer-move-target
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:685` `"kind": "panel-control",`
- **Comando:** files.move
- **Porta:** `manifest/commands/files.json:684` `"id": "explorer-move-target",`
- **Tratador:** `src/app/commands.ts:305` `'files.move': moveFileCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0015.md
- **Requisitos:** REQ-1110

## ENT-P-files-0016 — files.delete pela porta explorer-delete
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:746` `"kind": "panel-control",`
- **Comando:** files.delete
- **Porta:** `manifest/commands/files.json:745` `"id": "explorer-delete",`
- **Tratador:** `src/app/commands.ts:306` `'files.delete': deleteFileCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0016.md
- **Requisitos:** REQ-1111

## ENT-P-files-0017 — files.open pela porta explorer-file-row
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:796` `"kind": "panel-control",`
- **Comando:** files.open
- **Porta:** `manifest/commands/files.json:795` `"id": "explorer-file-row",`
- **Tratador:** `src/app/commands.ts:307` `'files.open': openFile,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0017.md
- **Requisitos:** REQ-1112

## ENT-P-files-0018 — files.open pela porta file-tab
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:822` `"kind": "panel-control",`
- **Comando:** files.open
- **Porta:** `manifest/commands/files.json:821` `"id": "file-tab",`
- **Tratador:** `src/app/commands.ts:307` `'files.open': openFile,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0018.md
- **Requisitos:** REQ-1112

## ENT-P-files-0019 — files.closeTab pela porta file-tab-close
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:872` `"kind": "panel-control",`
- **Comando:** files.closeTab
- **Porta:** `manifest/commands/files.json:871` `"id": "file-tab-close",`
- **Tratador:** `src/app/commands.ts:308` `'files.closeTab': closeFileTab,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0019.md
- **Requisitos:** REQ-1113

## ENT-P-files-0020 — files.upload pela porta explorer-upload
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:934` `"kind": "panel-control",`
- **Comando:** files.upload
- **Porta:** `manifest/commands/files.json:933` `"id": "explorer-upload",`
- **Tratador:** `src/app/commands.ts:309` `'files.upload': uploadCommand,`
- **Início:** `src/editor/doors/door.tsx:131` `dispatch(entry.command.id, { ...given, [file]: records });`
- **Fluxo:** fluxos/ENT-P-files-0020.md
- **Requisitos:** REQ-1114

## ENT-P-files-0021 — files.upload pela porta panel-drag-os-file-explorer-folder
- **Tipo:** comando-porta panel-drag `manifest/commands/files.json:961` `"kind": "panel-drag",`
- **Comando:** files.upload
- **Porta:** `manifest/commands/files.json:960` `"id": "panel-drag-os-file-explorer-folder",`
- **Gatilho:** `manifest/commands/files.json:963` `"source": "os-file",` `manifest/commands/files.json:964` `"zone": "explorer-folder",` `manifest/commands/files.json:965` `"gesture": "file-drag",`
- **Tratador:** `src/app/commands.ts:309` `'files.upload': uploadCommand,`
- **Início:** `src/editor/input/file-drop.ts:74` `store.dispatch(door.command.id as never, { ...door.door.args, files: stored } as never);`
- **Fluxo:** fluxos/ENT-P-files-0021.md
- **Requisitos:** REQ-1114

## ENT-P-files-0022 — files.saveContent pela porta code-panel-save
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:1018` `"kind": "panel-control",`
- **Comando:** files.saveContent
- **Porta:** `manifest/commands/files.json:1017` `"id": "code-panel-save",`
- **Tratador:** `src/app/commands.ts:310` `'files.saveContent': saveFileContentCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** fluxos/ENT-P-files-0022.md
- **Requisitos:** REQ-1115

## ENT-P-files-0023 — files.saveContent pela porta key-ctrl-s-in-code-editor
- **Tipo:** comando-porta shortcut `manifest/commands/files.json:1047` `"kind": "shortcut",`
- **Comando:** files.saveContent
- **Porta:** `manifest/commands/files.json:1046` `"id": "key-ctrl-s-in-code-editor",`
- **Gatilho:** `manifest/commands/files.json:1049` `"chord": "Ctrl+S",`
- **Tratador:** `src/app/commands.ts:310` `'files.saveContent': saveFileContentCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** fluxos/ENT-P-files-0023.md
- **Requisitos:** REQ-1115

## ENT-P-files-0024 — files.saveContent pela porta code-panel-editor
- **Tipo:** comando-porta panel-control `manifest/commands/files.json:1070` `"kind": "panel-control",`
- **Comando:** files.saveContent
- **Porta:** `manifest/commands/files.json:1069` `"id": "code-panel-editor",`
- **Tratador:** `src/app/commands.ts:310` `'files.saveContent': saveFileContentCommand,`
- **Início:** `src/editor/shell/code-pane.tsx:146` `data-door={EDITOR_DOOR?.ref}`
- **Fluxo:** fluxos/ENT-P-files-0024.md
- **Requisitos:** REQ-1115

## ENT-P-files-0025 — assets.insertImageFile pela porta canvas-drag-os-image-file-drop-proposal
- **Tipo:** comando-porta canvas-drag `manifest/commands/files.json:1149` `"kind": "canvas-drag",`
- **Comando:** assets.insertImageFile
- **Porta:** `manifest/commands/files.json:1148` `"id": "canvas-drag-os-image-file-drop-proposal",`
- **Gatilho:** `manifest/commands/files.json:1151` `"source": "os-image-file",` `manifest/commands/files.json:1152` `"zone": "drop-proposal",` `manifest/commands/files.json:1153` `"gesture": "file-drag",`
- **Tratador:** `src/app/commands.ts:311` `'assets.insertImageFile': insertImageFileCommand,`
- **Início:** `src/editor/input/file-drop.ts:172` `store.dispatch(door.command.id, args as never);`
- **Fluxo:** fluxos/ENT-P-files-0025.md
- **Requisitos:** REQ-1116
