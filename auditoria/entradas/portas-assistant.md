# Portas de comando do domínio assistant

Fonte: `manifest/commands/assistant.json`. Um bloco por porta.

## ENT-P-assistant-0001 — assistant.setModel pela porta assistant.setModel#assistant-model
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:36` `"kind": "panel-control",`
- **Comando:** assistant.setModel
- **Porta:** `manifest/commands/assistant.json:35` `"id": "assistant-model",`
- **Tratador:** `src/app/commands.ts:178` `'assistant.setModel': setAssistantModel,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0001.md`
- **Requisitos:** REQ-0201

## ENT-P-assistant-0002 — assistant.setPreferences pela porta assistant.setPreferences#assistant-preferences
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:94` `"kind": "panel-control",`
- **Comando:** assistant.setPreferences
- **Porta:** `manifest/commands/assistant.json:93` `"id": "assistant-preferences",`
- **Tratador:** `src/app/commands.ts:179` `'assistant.setPreferences': setAssistantPreferences,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0002.md`
- **Requisitos:** REQ-0202

## ENT-P-assistant-0003 — assistant.setPreferences pela porta assistant.setPreferences#assistant-close-preferences
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:122` `"kind": "panel-control",`
- **Comando:** assistant.setPreferences
- **Porta:** `manifest/commands/assistant.json:121` `"id": "assistant-close-preferences",`
- **Tratador:** `src/app/commands.ts:179` `'assistant.setPreferences': setAssistantPreferences,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0003.md`
- **Requisitos:** REQ-0202

## ENT-P-assistant-0004 — assistant.attachReference pela porta assistant.attachReference#assistant-reference
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:182` `"kind": "panel-control",`
- **Comando:** assistant.attachReference
- **Porta:** `manifest/commands/assistant.json:181` `"id": "assistant-reference",`
- **Tratador:** `src/app/commands.ts:180` `'assistant.attachReference': attachAssistantReference,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0004.md`
- **Requisitos:** REQ-0203

## ENT-P-assistant-0005 — assistant.clearReference pela porta assistant.clearReference#assistant-clear-reference
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:235` `"kind": "panel-control",`
- **Comando:** assistant.clearReference
- **Porta:** `manifest/commands/assistant.json:234` `"id": "assistant-clear-reference",`
- **Tratador:** `src/app/commands.ts:181` `'assistant.clearReference': clearAssistantReference,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0005.md`
- **Requisitos:** REQ-0204

## ENT-P-assistant-0006 — assistant.editKey pela porta assistant.editKey#assistant-key
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:293` `"kind": "panel-control",`
- **Comando:** assistant.editKey
- **Porta:** `manifest/commands/assistant.json:292` `"id": "assistant-key",`
- **Tratador:** `src/app/commands.ts:182` `'assistant.editKey': editAssistantKey,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0006.md`
- **Requisitos:** REQ-0205

## ENT-P-assistant-0007 — assistant.send pela porta assistant.send#assistant-send
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:345` `"kind": "panel-control",`
- **Comando:** assistant.send
- **Porta:** `manifest/commands/assistant.json:344` `"id": "assistant-send",`
- **Tratador:** `src/app/commands.ts:183` `'assistant.send': sendAssistant,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0007.md`
- **Requisitos:** REQ-0206

## ENT-P-assistant-0008 — assistant.send pela porta assistant.send#send-key
- **Tipo:** comando-porta shortcut `manifest/commands/assistant.json:371` `"kind": "shortcut",`
- **Comando:** assistant.send
- **Porta:** `manifest/commands/assistant.json:370` `"id": "send-key",`
- **Gatilho:** `manifest/commands/assistant.json:386` `"chord": "Ctrl+Enter",`
- **Tratador:** `src/app/commands.ts:183` `'assistant.send': sendAssistant,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-assistant-0008.md`
- **Requisitos:** REQ-0206

## ENT-P-assistant-0009 — assistant.cancel pela porta assistant.cancel#assistant-cancel
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:417` `"kind": "panel-control",`
- **Comando:** assistant.cancel
- **Porta:** `manifest/commands/assistant.json:416` `"id": "assistant-cancel",`
- **Tratador:** `src/app/commands.ts:184` `'assistant.cancel': cancelAssistant,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0009.md`
- **Requisitos:** REQ-0207

## ENT-P-assistant-0010 — assistant.connect pela porta assistant.connect#assistant-bridge-connect
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:469` `"kind": "panel-control",`
- **Comando:** assistant.connect
- **Porta:** `manifest/commands/assistant.json:468` `"id": "assistant-bridge-connect",`
- **Tratador:** `src/app/commands.ts:185` `'assistant.connect': connectAssistant,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0010.md`
- **Requisitos:** REQ-0208

## ENT-P-assistant-0011 — assistant.disconnect pela porta assistant.disconnect#assistant-bridge-disconnect
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:521` `"kind": "panel-control",`
- **Comando:** assistant.disconnect
- **Porta:** `manifest/commands/assistant.json:520` `"id": "assistant-bridge-disconnect",`
- **Tratador:** `src/app/commands.ts:186` `'assistant.disconnect': disconnectAssistant,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0011.md`
- **Requisitos:** REQ-0209

## ENT-P-assistant-0012 — assistant.saveKey pela porta assistant.saveKey#assistant-save-key
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:573` `"kind": "panel-control",`
- **Comando:** assistant.saveKey
- **Porta:** `manifest/commands/assistant.json:572` `"id": "assistant-save-key",`
- **Tratador:** `src/app/commands.ts:187` `'assistant.saveKey': saveAssistantKey,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0012.md`
- **Requisitos:** REQ-0210

## ENT-P-assistant-0013 — assistant.deleteKey pela porta assistant.deleteKey#assistant-delete-key
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:625` `"kind": "panel-control",`
- **Comando:** assistant.deleteKey
- **Porta:** `manifest/commands/assistant.json:624` `"id": "assistant-delete-key",`
- **Tratador:** `src/app/commands.ts:188` `'assistant.deleteKey': deleteAssistantKey,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0013.md`
- **Requisitos:** REQ-0211

## ENT-P-assistant-0014 — assistant.selectSession pela porta assistant.selectSession#assistant-select-session
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:677` `"kind": "panel-control",`
- **Comando:** assistant.selectSession
- **Porta:** `manifest/commands/assistant.json:676` `"id": "assistant-select-session",`
- **Tratador:** `src/app/commands.ts:189` `'assistant.selectSession': selectAssistantSession,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0014.md`
- **Requisitos:** REQ-0212

## ENT-P-assistant-0015 — assistant.clearConversation pela porta assistant.clearConversation#assistant-clear-conversation
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:729` `"kind": "panel-control",`
- **Comando:** assistant.clearConversation
- **Porta:** `manifest/commands/assistant.json:728` `"id": "assistant-clear-conversation",`
- **Tratador:** `src/app/commands.ts:190` `'assistant.clearConversation': clearAssistantConversation,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0015.md`
- **Requisitos:** REQ-0213

## ENT-P-assistant-0016 — assistant.update pela porta assistant.update#assistant-input
- **Tipo:** comando-porta panel-control `manifest/commands/assistant.json:787` `"kind": "panel-control",`
- **Comando:** assistant.update
- **Porta:** `manifest/commands/assistant.json:786` `"id": "assistant-input",`
- **Tratador:** `src/app/commands.ts:191` `'assistant.update': reportAssistant,`
- **Início:** `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`
- **Fluxo:** `fluxos/ENT-P-assistant-0016.md`
- **Requisitos:** REQ-0214
