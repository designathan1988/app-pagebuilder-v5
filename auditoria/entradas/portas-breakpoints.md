# Portas de comando — domínio breakpoints

Fonte: `manifest/commands/breakpoints.json`. Uma porta por bloco, na ordem do manifesto.

## ENT-P-breakpoints-0001 — breakpoints.add pela porta menu-view-add-breakpoint-here
- **Tipo:** comando-porta menu `manifest/commands/breakpoints.json:41` `"kind": "menu",`
- **Comando:** breakpoints.add
- **Porta:** `manifest/commands/breakpoints.json:40` `"id": "menu-view-add-breakpoint-here",`
- **Tratador:** `src/app/commands.ts:451` `'breakpoints.add': addBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-breakpoints-0001.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0301

## ENT-P-breakpoints-0002 — breakpoints.add pela porta breakpoints-dialog-add
- **Tipo:** comando-porta panel-control `manifest/commands/breakpoints.json:63` `"kind": "panel-control",`
- **Comando:** breakpoints.add
- **Porta:** `manifest/commands/breakpoints.json:62` `"id": "breakpoints-dialog-add",`
- **Tratador:** `src/app/commands.ts:451` `'breakpoints.add': addBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-breakpoints-0002.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0301

## ENT-P-breakpoints-0003 — breakpoints.rename pela porta breakpoints-dialog-name
- **Tipo:** comando-porta panel-control `manifest/commands/breakpoints.json:126` `"kind": "panel-control",`
- **Comando:** breakpoints.rename
- **Porta:** `manifest/commands/breakpoints.json:125` `"id": "breakpoints-dialog-name",`
- **Tratador:** `src/app/commands.ts:452` `'breakpoints.rename': renameBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-breakpoints-0003.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0302

## ENT-P-breakpoints-0004 — breakpoints.setWidth pela porta breakpoints-dialog-width
- **Tipo:** comando-porta panel-control `manifest/commands/breakpoints.json:188` `"kind": "panel-control",`
- **Comando:** breakpoints.setWidth
- **Porta:** `manifest/commands/breakpoints.json:187` `"id": "breakpoints-dialog-width",`
- **Tratador:** `src/app/commands.ts:453` `'breakpoints.setWidth': setBreakpointWidth,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-breakpoints-0004.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0303

## ENT-P-breakpoints-0005 — breakpoints.remove pela porta breakpoints-dialog-remove
- **Tipo:** comando-porta panel-control `manifest/commands/breakpoints.json:256` `"kind": "panel-control",`
- **Comando:** breakpoints.remove
- **Porta:** `manifest/commands/breakpoints.json:255` `"id": "breakpoints-dialog-remove",`
- **Tratador:** `src/app/commands.ts:454` `'breakpoints.remove': removeBreakpoint,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-breakpoints-0005.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-0304
