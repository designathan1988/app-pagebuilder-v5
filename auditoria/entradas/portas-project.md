# Portas de comando — domínio project

Fonte: `manifest/commands/project.json`. Uma porta por bloco, na ordem do manifesto.

## ENT-P-project-0001 — project.newBlankPage pela porta project.newBlankPage#menu-file
- **Tipo:** comando-porta menu `manifest/commands/project.json:26` `"kind": "menu",`
- **Comando:** project.newBlankPage
- **Porta:** `manifest/commands/project.json:25` `"id": "menu-file",`
- **Tratador:** `src/app/commands.ts:343` `'project.newBlankPage': newBlankPage,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-project-0001.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2001

## ENT-P-project-0002 — project.newBlankPage pela porta project.newBlankPage#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/project.json:48` `"kind": "command-bar",`
- **Comando:** project.newBlankPage
- **Porta:** `manifest/commands/project.json:47` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:343` `'project.newBlankPage': newBlankPage,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-project-0002.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2001

## ENT-P-project-0003 — project.restoreVersion pela porta project.restoreVersion#recovery-dialog-restore
- **Tipo:** comando-porta panel-control `manifest/commands/project.json:95` `"kind": "panel-control",`
- **Comando:** project.restoreVersion
- **Porta:** `manifest/commands/project.json:94` `"id": "recovery-dialog-restore",`
- **Tratador:** `src/app/commands.ts:344` `'project.restoreVersion': restoreVersion,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-project-0003.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2002

## ENT-P-project-0004 — project.takeOverEditing pela porta project.takeOverEditing#tab-guard-take-over
- **Tipo:** comando-porta panel-control `manifest/commands/project.json:139` `"kind": "panel-control",`
- **Comando:** project.takeOverEditing
- **Porta:** `manifest/commands/project.json:138` `"id": "tab-guard-take-over",`
- **Tratador:** `src/app/commands.ts:345` `'project.takeOverEditing': takeOverEditing,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-project-0004.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2003

## ENT-P-project-0005 — project.save pela porta project.save#menu-file
- **Tipo:** comando-porta menu `manifest/commands/project.json:183` `"kind": "menu",`
- **Comando:** project.save
- **Porta:** `manifest/commands/project.json:182` `"id": "menu-file",`
- **Tratador:** `src/app/commands.ts:346` `'project.save': saveProject,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-project-0005.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2004

## ENT-P-project-0006 — project.save pela porta project.save#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/project.json:205` `"kind": "command-bar",`
- **Comando:** project.save
- **Porta:** `manifest/commands/project.json:204` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:346` `'project.save': saveProject,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-project-0006.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2004

## ENT-P-project-0007 — project.open pela porta project.open#menu-file
- **Tipo:** comando-porta menu `manifest/commands/project.json:257` `"kind": "menu",`
- **Comando:** project.open
- **Porta:** `manifest/commands/project.json:256` `"id": "menu-file",`
- **Tratador:** `src/app/commands.ts:349` `'project.open': openProject,`
- **Início:** `src/editor/doors/door.tsx:151` `if (bytes !== null) dispatch(entry.command.id, { ...given, [file]: await projectFileText(bytes) });`
- **Fluxo:** `fluxos/ENT-P-project-0007.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2005

## ENT-P-project-0008 — project.open pela porta project.open#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/project.json:279` `"kind": "command-bar",`
- **Comando:** project.open
- **Porta:** `manifest/commands/project.json:278` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:349` `'project.open': openProject,`
- **Início:** `src/editor/doors/door.tsx:151` `if (bytes !== null) dispatch(entry.command.id, { ...given, [file]: await projectFileText(bytes) });`
- **Fluxo:** `fluxos/ENT-P-project-0008.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2005

## ENT-P-project-0009 — project.openFolder pela porta project.openFolder#menu-file
- **Tipo:** comando-porta menu `manifest/commands/project.json:332` `"kind": "menu",`
- **Comando:** project.openFolder
- **Porta:** `manifest/commands/project.json:331` `"id": "menu-file",`
- **Tratador:** `src/app/commands.ts:350` `'project.openFolder': openFolderCommand,`
- **Início:** `src/editor/doors/door.tsx:140` `if (chosen !== null) dispatch(entry.command.id, { ...given, [file]: chosen });`
- **Fluxo:** `fluxos/ENT-P-project-0009.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2006

## ENT-P-project-0010 — project.openFolder pela porta project.openFolder#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/project.json:355` `"kind": "command-bar",`
- **Comando:** project.openFolder
- **Porta:** `manifest/commands/project.json:354` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:350` `'project.openFolder': openFolderCommand,`
- **Início:** `src/editor/doors/door.tsx:140` `if (chosen !== null) dispatch(entry.command.id, { ...given, [file]: chosen });`
- **Fluxo:** `fluxos/ENT-P-project-0010.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2006

## ENT-P-project-0011 — project.importHtml pela porta project.importHtml#menu-file
- **Tipo:** comando-porta menu `manifest/commands/project.json:427` `"kind": "menu",`
- **Comando:** project.importHtml
- **Porta:** `manifest/commands/project.json:426` `"id": "menu-file",`
- **Tratador:** `src/app/commands.ts:351` `'project.importHtml': choosingImport(importHtmlCommand),`
- **Início:** `src/editor/doors/door.tsx:103` `dispatch(entry.command.id, { ...given, [files]: await readPickedFiles(chosen) });`
- **Fluxo:** `fluxos/ENT-P-project-0011.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2007

## ENT-P-project-0012 — project.importHtml pela porta project.importHtml#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/project.json:449` `"kind": "command-bar",`
- **Comando:** project.importHtml
- **Porta:** `manifest/commands/project.json:448` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:351` `'project.importHtml': choosingImport(importHtmlCommand),`
- **Início:** `src/editor/doors/door.tsx:103` `dispatch(entry.command.id, { ...given, [files]: await readPickedFiles(chosen) });`
- **Fluxo:** `fluxos/ENT-P-project-0012.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2007

## ENT-P-project-0013 — project.importHtml pela porta project.importHtml#menu-file-folder
- **Tipo:** comando-porta menu `manifest/commands/project.json:470` `"kind": "menu",`
- **Comando:** project.importHtml
- **Porta:** `manifest/commands/project.json:469` `"id": "menu-file-folder",`
- **Tratador:** `src/app/commands.ts:351` `'project.importHtml': choosingImport(importHtmlCommand),`
- **Início:** `src/editor/doors/door.tsx:103` `dispatch(entry.command.id, { ...given, [files]: await readPickedFiles(chosen) });`
- **Fluxo:** `fluxos/ENT-P-project-0013.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2007

## ENT-P-project-0014 — project.importHtml pela porta project.importHtml#destination-page
- **Tipo:** comando-porta panel-control `manifest/commands/project.json:493` `"kind": "panel-control",`
- **Comando:** project.importHtml
- **Porta:** `manifest/commands/project.json:492` `"id": "destination-page",`
- **Tratador:** `src/app/commands.ts:351` `'project.importHtml': choosingImport(importHtmlCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-project-0014.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2007

## ENT-P-project-0015 — project.importHtml pela porta project.importHtml#destination-inside
- **Tipo:** comando-porta panel-control `manifest/commands/project.json:522` `"kind": "panel-control",`
- **Comando:** project.importHtml
- **Porta:** `manifest/commands/project.json:521` `"id": "destination-inside",`
- **Tratador:** `src/app/commands.ts:351` `'project.importHtml': choosingImport(importHtmlCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-project-0015.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2007

## ENT-P-project-0016 — project.importHtml pela porta project.importHtml#destination-replace
- **Tipo:** comando-porta panel-control `manifest/commands/project.json:551` `"kind": "panel-control",`
- **Comando:** project.importHtml
- **Porta:** `manifest/commands/project.json:550` `"id": "destination-replace",`
- **Tratador:** `src/app/commands.ts:351` `'project.importHtml': choosingImport(importHtmlCommand),`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-project-0016.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2007

## ENT-P-project-0017 — project.export pela porta project.export#menu-file
- **Tipo:** comando-porta menu `manifest/commands/project.json:598` `"kind": "menu",`
- **Comando:** project.export
- **Porta:** `manifest/commands/project.json:597` `"id": "menu-file",`
- **Tratador:** `src/app/commands.ts:352` `'project.export': exportProject,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-project-0017.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2008

## ENT-P-project-0018 — project.export pela porta project.export#toolbar-top-bar-export
- **Tipo:** comando-porta toolbar `manifest/commands/project.json:620` `"kind": "toolbar",`
- **Comando:** project.export
- **Porta:** `manifest/commands/project.json:619` `"id": "toolbar-top-bar-export",`
- **Tratador:** `src/app/commands.ts:352` `'project.export': exportProject,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-project-0018.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2008

## ENT-P-project-0019 — project.export pela porta project.export#toolbar-preview-bar-export
- **Tipo:** comando-porta toolbar `manifest/commands/project.json:642` `"kind": "toolbar",`
- **Comando:** project.export
- **Porta:** `manifest/commands/project.json:641` `"id": "toolbar-preview-bar-export",`
- **Tratador:** `src/app/commands.ts:352` `'project.export': exportProject,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-project-0019.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2008

## ENT-P-project-0020 — project.export pela porta project.export#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/project.json:664` `"kind": "command-bar",`
- **Comando:** project.export
- **Porta:** `manifest/commands/project.json:663` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:352` `'project.export': exportProject,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-project-0020.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2008

## ENT-P-project-0021 — project.setLanguage pela porta project.setLanguage#inspector-project-language
- **Tipo:** comando-porta panel-control `manifest/commands/project.json:715` `"kind": "panel-control",`
- **Comando:** project.setLanguage
- **Porta:** `manifest/commands/project.json:714` `"id": "inspector-project-language",`
- **Tratador:** `src/app/commands.ts:347` `'project.setLanguage': setProjectLanguage,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-project-0021.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2009

## ENT-P-project-0022 — project.setCodeLanguage pela porta project.setCodeLanguage#inspector-code-language
- **Tipo:** comando-porta panel-control `manifest/commands/project.json:771` `"kind": "panel-control",`
- **Comando:** project.setCodeLanguage
- **Porta:** `manifest/commands/project.json:770` `"id": "inspector-code-language",`
- **Tratador:** `src/app/commands.ts:348` `'project.setCodeLanguage': setCodeLanguage,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-project-0022.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2010

## ENT-P-project-0023 — project.captureUrl pela porta project.captureUrl#capture-url-run
- **Tipo:** comando-porta panel-control `manifest/commands/project.json:829` `"kind": "panel-control",`
- **Comando:** project.captureUrl
- **Porta:** `manifest/commands/project.json:828` `"id": "capture-url-run",`
- **Tratador:** `src/app/commands.ts:216` `'project.captureUrl': captureUrlCommand,`
- **Início:** `src/editor/shell/capture-url.tsx:37` `afterGesture(store, () => (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(run.command.id as CommandId, { ...run.door.args, url: typed, pages: count === '' ? 1 : Number(count) }));`
- **Fluxo:** `fluxos/ENT-P-project-0023.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-2011
