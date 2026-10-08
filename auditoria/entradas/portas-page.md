# Portas de comando — domínio page

Fonte: `manifest/commands/page.json`. Uma porta por bloco, na ordem do manifesto.

## ENT-P-page-0001 — page.openProperties pela porta page.openProperties#inspector-page-properties-button
- **Tipo:** comando-porta panel-control `manifest/commands/page.json:22` `"kind": "panel-control",`
- **Comando:** page.openProperties
- **Porta:** `manifest/commands/page.json:21` `"id": "inspector-page-properties-button",`
- **Tratador:** `src/app/commands.ts:341` `'page.openProperties': openPageProperties,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-page-0001.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1901

## ENT-P-page-0002 — page.openProperties pela porta page.openProperties#command-bar
- **Tipo:** comando-porta command-bar `manifest/commands/page.json:48` `"kind": "command-bar",`
- **Comando:** page.openProperties
- **Porta:** `manifest/commands/page.json:47` `"id": "command-bar",`
- **Tratador:** `src/app/commands.ts:341` `'page.openProperties': openPageProperties,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-page-0002.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1901

## ENT-P-page-0003 — page.setSetting pela porta page.setSetting#inspector-page-title
- **Tipo:** comando-porta inspector-field `manifest/commands/page.json:107` `"kind": "inspector-field",`
- **Comando:** page.setSetting
- **Porta:** `manifest/commands/page.json:106` `"id": "inspector-page-title",`
- **Tratador:** `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-page-0003.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1902

## ENT-P-page-0004 — page.setSetting pela porta page.setSetting#inspector-page-language
- **Tipo:** comando-porta inspector-field `manifest/commands/page.json:133` `"kind": "inspector-field",`
- **Comando:** page.setSetting
- **Porta:** `manifest/commands/page.json:132` `"id": "inspector-page-language",`
- **Tratador:** `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-page-0004.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1902

## ENT-P-page-0005 — page.setSetting pela porta page.setSetting#inspector-page-direction
- **Tipo:** comando-porta inspector-field `manifest/commands/page.json:159` `"kind": "inspector-field",`
- **Comando:** page.setSetting
- **Porta:** `manifest/commands/page.json:158` `"id": "inspector-page-direction",`
- **Tratador:** `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-page-0005.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1902

## ENT-P-page-0006 — page.setSetting pela porta page.setSetting#inspector-page-html-classes
- **Tipo:** comando-porta inspector-field `manifest/commands/page.json:185` `"kind": "inspector-field",`
- **Comando:** page.setSetting
- **Porta:** `manifest/commands/page.json:184` `"id": "inspector-page-html-classes",`
- **Tratador:** `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-page-0006.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1902

## ENT-P-page-0007 — page.setSetting pela porta page.setSetting#inspector-page-description
- **Tipo:** comando-porta inspector-field `manifest/commands/page.json:211` `"kind": "inspector-field",`
- **Comando:** page.setSetting
- **Porta:** `manifest/commands/page.json:210` `"id": "inspector-page-description",`
- **Tratador:** `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-page-0007.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1902

## ENT-P-page-0008 — page.setSetting pela porta page.setSetting#inspector-page-canonical
- **Tipo:** comando-porta inspector-field `manifest/commands/page.json:237` `"kind": "inspector-field",`
- **Comando:** page.setSetting
- **Porta:** `manifest/commands/page.json:236` `"id": "inspector-page-canonical",`
- **Tratador:** `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-page-0008.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1902

## ENT-P-page-0009 — page.setSetting pela porta page.setSetting#inspector-page-og-title
- **Tipo:** comando-porta inspector-field `manifest/commands/page.json:263` `"kind": "inspector-field",`
- **Comando:** page.setSetting
- **Porta:** `manifest/commands/page.json:262` `"id": "inspector-page-og-title",`
- **Tratador:** `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-page-0009.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1902

## ENT-P-page-0010 — page.setSetting pela porta page.setSetting#inspector-page-og-image
- **Tipo:** comando-porta inspector-field `manifest/commands/page.json:289` `"kind": "inspector-field",`
- **Comando:** page.setSetting
- **Porta:** `manifest/commands/page.json:288` `"id": "inspector-page-og-image",`
- **Tratador:** `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-page-0010.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1902

## ENT-P-page-0011 — page.setSetting pela porta page.setSetting#inspector-page-favicon
- **Tipo:** comando-porta inspector-field `manifest/commands/page.json:315` `"kind": "inspector-field",`
- **Comando:** page.setSetting
- **Porta:** `manifest/commands/page.json:314` `"id": "inspector-page-favicon",`
- **Tratador:** `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-page-0011.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1902

## ENT-P-page-0012 — page.setSetting pela porta page.setSetting#inspector-page-scripts
- **Tipo:** comando-porta inspector-field `manifest/commands/page.json:341` `"kind": "inspector-field",`
- **Comando:** page.setSetting
- **Porta:** `manifest/commands/page.json:340` `"id": "inspector-page-scripts",`
- **Tratador:** `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-page-0012.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1902
