# Portas de comando — domínio events

## ENT-P-events-0001 — interactions.add pela porta inspector-interaction-add
- **Tipo:** comando-porta panel-control `manifest/commands/events.json:64` `"kind": "panel-control",`
- **Comando:** interactions.add
- **Porta:** `manifest/commands/events.json:63` `"id": "inspector-interaction-add",`
- **Tratador:** `src/app/commands.ts:261` `'interactions.add': addInteractionCommand,`
- **Início:** `src/editor/shell/interactions.tsx:195` `(store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(ADD.command.id as CommandId, { ...ADD.door.args });`
- **Fluxo:** fluxos/ENT-P-events-0001.md
- **Requisitos:** REQ-1001

## ENT-P-events-0002 — interactions.update pela porta inspector-interaction-trigger
- **Tipo:** comando-porta panel-control `manifest/commands/events.json:141` `"kind": "panel-control",`
- **Comando:** interactions.update
- **Porta:** `manifest/commands/events.json:140` `"id": "inspector-interaction-trigger",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Início:** `src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`
- **Fluxo:** fluxos/ENT-P-events-0002.md
- **Requisitos:** REQ-1002

## ENT-P-events-0003 — interactions.update pela porta inspector-interaction-action
- **Tipo:** comando-porta panel-control `manifest/commands/events.json:169` `"kind": "panel-control",`
- **Comando:** interactions.update
- **Porta:** `manifest/commands/events.json:168` `"id": "inspector-interaction-action",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Início:** `src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`
- **Fluxo:** fluxos/ENT-P-events-0003.md
- **Requisitos:** REQ-1002

## ENT-P-events-0004 — interactions.update pela porta inspector-interaction-target
- **Tipo:** comando-porta panel-control `manifest/commands/events.json:197` `"kind": "panel-control",`
- **Comando:** interactions.update
- **Porta:** `manifest/commands/events.json:196` `"id": "inspector-interaction-target",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Início:** `src/editor/shell/panel-field.tsx:172` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** fluxos/ENT-P-events-0004.md
- **Requisitos:** REQ-1002

## ENT-P-events-0005 — interactions.update pela porta inspector-interaction-value
- **Tipo:** comando-porta panel-control `manifest/commands/events.json:228` `"kind": "panel-control",`
- **Comando:** interactions.update
- **Porta:** `manifest/commands/events.json:227` `"id": "inspector-interaction-value",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Início:** `src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`
- **Fluxo:** fluxos/ENT-P-events-0005.md
- **Requisitos:** REQ-1002

## ENT-P-events-0006 — interactions.update pela porta inspector-interaction-options
- **Tipo:** comando-porta panel-control `manifest/commands/events.json:256` `"kind": "panel-control",`
- **Comando:** interactions.update
- **Porta:** `manifest/commands/events.json:255` `"id": "inspector-interaction-options",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Início:** `src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`
- **Fluxo:** fluxos/ENT-P-events-0006.md
- **Requisitos:** REQ-1002

## ENT-P-events-0007 — interactions.update pela porta inspector-interaction-scope
- **Tipo:** comando-porta panel-control `manifest/commands/events.json:284` `"kind": "panel-control",`
- **Comando:** interactions.update
- **Porta:** `manifest/commands/events.json:283` `"id": "inspector-interaction-scope",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Início:** `src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`
- **Fluxo:** fluxos/ENT-P-events-0007.md
- **Requisitos:** REQ-1002

## ENT-P-events-0008 — interactions.update pela porta canvas-click-pick-target
- **Tipo:** comando-porta canvas-click `manifest/commands/events.json:312` `"kind": "canvas-click",`
- **Comando:** interactions.update
- **Porta:** `manifest/commands/events.json:311` `"id": "canvas-click-pick-target",`
- **Gatilho:** `manifest/commands/events.json:318` `"gesture": "pick-target",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Início:** `src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`
- **Fluxo:** fluxos/ENT-P-events-0008.md
- **Requisitos:** REQ-1002

## ENT-P-events-0009 — interactions.update pela porta layers-row-pick-target
- **Tipo:** comando-porta panel-control `manifest/commands/events.json:336` `"kind": "panel-control",`
- **Comando:** interactions.update
- **Porta:** `manifest/commands/events.json:335` `"id": "layers-row-pick-target",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Início:** `src/editor/shell/sidebar/layers.tsx:361` `onClick={() => (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, interaction: picking, changes: { target: node.id } })}`
- **Fluxo:** fluxos/ENT-P-events-0009.md
- **Requisitos:** REQ-1002

## ENT-P-events-0010 — interactions.update pela porta inspector-interaction-new-tab
- **Tipo:** comando-porta panel-control `manifest/commands/events.json:364` `"kind": "panel-control",`
- **Comando:** interactions.update
- **Porta:** `manifest/commands/events.json:363` `"id": "inspector-interaction-new-tab",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Início:** `src/editor/shell/panel-field.tsx:172` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** fluxos/ENT-P-events-0010.md
- **Requisitos:** REQ-1002

## ENT-P-events-0011 — interactions.remove pela porta inspector-interaction-remove
- **Tipo:** comando-porta panel-control `manifest/commands/events.json:422` `"kind": "panel-control",`
- **Comando:** interactions.remove
- **Porta:** `manifest/commands/events.json:421` `"id": "inspector-interaction-remove",`
- **Tratador:** `src/app/commands.ts:263` `'interactions.remove': removeInteractionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:172` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** fluxos/ENT-P-events-0011.md
- **Requisitos:** REQ-1003
