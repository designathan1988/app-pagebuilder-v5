# Portas de comando — domínio motion

Fonte: `manifest/commands/motion.json`. Uma porta por bloco, na ordem do manifesto.

## ENT-P-motion-0001 — motion.add pela porta inspector-motion-add
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:86` `"kind": "panel-control",`
- **Comando:** motion.add
- **Porta:** `manifest/commands/motion.json:85` `"id": "inspector-motion-add",`
- **Tratador:** `src/app/commands.ts:264` `'motion.add': addMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0001.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1601

## ENT-P-motion-0002 — motion.update pela porta inspector-motion-trigger
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:176` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:175` `"id": "inspector-motion-trigger",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0002.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0003 — motion.update pela porta inspector-motion-timeline
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:204` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:203` `"id": "inspector-motion-timeline",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0003.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0004 — motion.update pela porta inspector-motion-control
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:232` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:231` `"id": "inspector-motion-control",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0004.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0005 — motion.update pela porta inspector-motion-leave
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:260` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:259` `"id": "inspector-motion-leave",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0005.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0006 — motion.update pela porta inspector-motion-scope
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:288` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:287` `"id": "inspector-motion-scope",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0006.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0007 — motion.update pela porta inspector-motion-once
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:316` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:315` `"id": "inspector-motion-once",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0007.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0008 — motion.update pela porta inspector-motion-delay
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:344` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:343` `"id": "inspector-motion-delay",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0008.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0009 — motion.update pela porta inspector-motion-breakpoints
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:372` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:371` `"id": "inspector-motion-breakpoints",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0009.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0010 — motion.update pela porta inspector-motion-reduced-motion
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:400` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:399` `"id": "inspector-motion-reduced-motion",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0010.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0011 — motion.update pela porta inspector-motion-key
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:428` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:427` `"id": "inspector-motion-key",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0011.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0012 — motion.update pela porta inspector-motion-threshold
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:456` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:455` `"id": "inspector-motion-threshold",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0012.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0013 — motion.update pela porta inspector-motion-milliseconds
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:484` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:483` `"id": "inspector-motion-milliseconds",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0013.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0014 — motion.update pela porta inspector-motion-direction
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:512` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:511` `"id": "inspector-motion-direction",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0014.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0015 — motion.update pela porta inspector-motion-axis
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:540` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:539` `"id": "inspector-motion-axis",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0015.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0016 — motion.update pela porta inspector-motion-breakpoint
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:568` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:567` `"id": "inspector-motion-breakpoint",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0016.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0017 — motion.update pela porta inspector-motion-seconds
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:596` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:595` `"id": "inspector-motion-seconds",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0017.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0018 — motion.update pela porta inspector-motion-state
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:624` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:623` `"id": "inspector-motion-state",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0018.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0019 — motion.update pela porta inspector-motion-event
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:652` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:651` `"id": "inspector-motion-event",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0019.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0020 — motion.update pela porta inspector-motion-scroll-start
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:680` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:679` `"id": "inspector-motion-scroll-start",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0020.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0021 — motion.update pela porta inspector-motion-scroll-end
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:708` `"kind": "panel-control",`
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:707` `"id": "inspector-motion-scroll-end",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0021.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1602

## ENT-P-motion-0022 — motion.remove pela porta inspector-motion-remove
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:766` `"kind": "panel-control",`
- **Comando:** motion.remove
- **Porta:** `manifest/commands/motion.json:765` `"id": "inspector-motion-remove",`
- **Tratador:** `src/app/commands.ts:266` `'motion.remove': removeMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0022.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1603

## ENT-P-motion-0023 — motion.createTimeline pela porta timeline-motion-new-timeline
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:823` `"kind": "panel-control",`
- **Comando:** motion.createTimeline
- **Porta:** `manifest/commands/motion.json:822` `"id": "timeline-motion-new-timeline",`
- **Tratador:** `src/app/commands.ts:267` `'motion.createTimeline': createTimelineCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0023.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1604

## ENT-P-motion-0024 — motion.renameTimeline pela porta timeline-motion-timeline-name
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:886` `"kind": "panel-control",`
- **Comando:** motion.renameTimeline
- **Porta:** `manifest/commands/motion.json:885` `"id": "timeline-motion-timeline-name",`
- **Tratador:** `src/app/commands.ts:268` `'motion.renameTimeline': renameTimelineCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0024.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1605

## ENT-P-motion-0025 — motion.deleteTimeline pela porta timeline-motion-timeline-delete
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:943` `"kind": "panel-control",`
- **Comando:** motion.deleteTimeline
- **Porta:** `manifest/commands/motion.json:942` `"id": "timeline-motion-timeline-delete",`
- **Tratador:** `src/app/commands.ts:269` `'motion.deleteTimeline': deleteTimelineCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0025.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1606

## ENT-P-motion-0026 — motion.openTimeline pela porta timeline-motion-timeline-row
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:995` `"kind": "panel-control",`
- **Comando:** motion.openTimeline
- **Porta:** `manifest/commands/motion.json:994` `"id": "timeline-motion-timeline-row",`
- **Tratador:** `src/app/commands.ts:270` `'motion.openTimeline': openTimelineCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0026.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1607

## ENT-P-motion-0027 — motion.addAction pela porta timeline-motion-add-action-after
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1091` `"kind": "panel-control",`
- **Comando:** motion.addAction
- **Porta:** `manifest/commands/motion.json:1090` `"id": "timeline-motion-add-action-after",`
- **Tratador:** `src/app/commands.ts:271` `'motion.addAction': addActionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0027.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1608

## ENT-P-motion-0028 — motion.addAction pela porta timeline-motion-add-action-with
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1119` `"kind": "panel-control",`
- **Comando:** motion.addAction
- **Porta:** `manifest/commands/motion.json:1118` `"id": "timeline-motion-add-action-with",`
- **Tratador:** `src/app/commands.ts:271` `'motion.addAction': addActionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0028.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1608

## ENT-P-motion-0029 — motion.addAction pela porta timeline-motion-add-action-at
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1147` `"kind": "panel-control",`
- **Comando:** motion.addAction
- **Porta:** `manifest/commands/motion.json:1146` `"id": "timeline-motion-add-action-at",`
- **Tratador:** `src/app/commands.ts:271` `'motion.addAction': addActionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0029.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1608

## ENT-P-motion-0030 — motion.updateAction pela porta timeline-motion-action-kind
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1239` `"kind": "panel-control",`
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1238` `"id": "timeline-motion-action-kind",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0030.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1609

## ENT-P-motion-0031 — motion.updateAction pela porta timeline-motion-action-target
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1267` `"kind": "panel-control",`
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1266` `"id": "timeline-motion-action-target",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0031.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1609

## ENT-P-motion-0032 — motion.updateAction pela porta timeline-motion-action-target-value
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1295` `"kind": "panel-control",`
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1294` `"id": "timeline-motion-action-target-value",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0032.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1609

## ENT-P-motion-0033 — motion.updateAction pela porta timeline-motion-action-start
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1323` `"kind": "panel-control",`
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1322` `"id": "timeline-motion-action-start",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0033.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1609

## ENT-P-motion-0034 — motion.updateAction pela porta timeline-motion-action-duration
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1351` `"kind": "panel-control",`
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1350` `"id": "timeline-motion-action-duration",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0034.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1609

## ENT-P-motion-0035 — motion.updateAction pela porta timeline-motion-action-easing
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1379` `"kind": "panel-control",`
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1378` `"id": "timeline-motion-action-easing",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0035.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1609

## ENT-P-motion-0036 — motion.updateAction pela porta timeline-motion-action-repeat
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1407` `"kind": "panel-control",`
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1406` `"id": "timeline-motion-action-repeat",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0036.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1609

## ENT-P-motion-0037 — motion.updateAction pela porta timeline-motion-action-stagger-each
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1435` `"kind": "panel-control",`
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1434` `"id": "timeline-motion-action-stagger-each",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0037.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1609

## ENT-P-motion-0038 — motion.updateAction pela porta timeline-motion-action-stagger-from
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1463` `"kind": "panel-control",`
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1462` `"id": "timeline-motion-action-stagger-from",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0038.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1609

## ENT-P-motion-0039 — motion.updateAction pela porta timeline-motion-action-yoyo
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1491` `"kind": "panel-control",`
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1490` `"id": "timeline-motion-action-yoyo",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0039.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1609

## ENT-P-motion-0040 — motion.updateAction pela porta timeline-motion-action-pick
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1519` `"kind": "panel-control",`
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1518` `"id": "timeline-motion-action-pick",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0040.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1609

## ENT-P-motion-0041 — motion.updateAction pela porta canvas-click-pick-motion-target
- **Tipo:** comando-porta canvas-click `manifest/commands/motion.json:1550` `"kind": "canvas-click",`
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1549` `"id": "canvas-click-pick-motion-target",`
- **Gatilho:** `manifest/commands/motion.json:1556` `"gesture": "pick-target",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`
- **Fluxo:** `fluxos/ENT-P-motion-0041.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1609

## ENT-P-motion-0042 — motion.updateAction pela porta layers-row-pick-motion-target
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1574` `"kind": "panel-control",`
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1573` `"id": "layers-row-pick-motion-target",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/shell/sidebar/layers.tsx:390` `onClick={() => (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, args)}`
- **Fluxo:** `fluxos/ENT-P-motion-0042.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1609

## ENT-P-motion-0043 — motion.setEffectOption pela porta timeline-motion-effect-option
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1683` `"kind": "panel-control",`
- **Comando:** motion.setEffectOption
- **Porta:** `manifest/commands/motion.json:1682` `"id": "timeline-motion-effect-option",`
- **Tratador:** `src/app/commands.ts:273` `'motion.setEffectOption': setEffectOptionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0043.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1610

## ENT-P-motion-0044 — motion.removeActions pela porta timeline-motion-actions-delete
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:1749` `"kind": "panel-control",`
- **Comando:** motion.removeActions
- **Porta:** `manifest/commands/motion.json:1748` `"id": "timeline-motion-actions-delete",`
- **Tratador:** `src/app/commands.ts:274` `'motion.removeActions': removeActionsCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0044.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1611

## ENT-P-motion-0045 — motion.moveActions pela porta panel-drag-motion-bar
- **Tipo:** comando-porta panel-drag `manifest/commands/motion.json:1825` `"kind": "panel-drag",`
- **Comando:** motion.moveActions
- **Porta:** `manifest/commands/motion.json:1824` `"id": "panel-drag-motion-bar",`
- **Gatilho:** `manifest/commands/motion.json:1827` `"source": "motion-bar",` `manifest/commands/motion.json:1828` `"zone": "motion-track",` `manifest/commands/motion.json:1829` `"gesture": "motion-bar-drag",`
- **Tratador:** `src/app/commands.ts:275` `'motion.moveActions': moveActionsCommand,`
- **Início:** `src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`
- **Fluxo:** `fluxos/ENT-P-motion-0045.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1612

## ENT-P-motion-0046 — motion.resizeAction pela porta panel-drag-motion-bar-start
- **Tipo:** comando-porta panel-drag `manifest/commands/motion.json:1904` `"kind": "panel-drag",`
- **Comando:** motion.resizeAction
- **Porta:** `manifest/commands/motion.json:1903` `"id": "panel-drag-motion-bar-start",`
- **Gatilho:** `manifest/commands/motion.json:1906` `"source": "motion-bar-start",` `manifest/commands/motion.json:1907` `"zone": "motion-track",` `manifest/commands/motion.json:1908` `"gesture": "motion-bar-resize",`
- **Tratador:** `src/app/commands.ts:276` `'motion.resizeAction': resizeActionCommand,`
- **Início:** `src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`
- **Fluxo:** `fluxos/ENT-P-motion-0046.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1613

## ENT-P-motion-0047 — motion.resizeAction pela porta panel-drag-motion-bar-end
- **Tipo:** comando-porta panel-drag `manifest/commands/motion.json:1926` `"kind": "panel-drag",`
- **Comando:** motion.resizeAction
- **Porta:** `manifest/commands/motion.json:1925` `"id": "panel-drag-motion-bar-end",`
- **Gatilho:** `manifest/commands/motion.json:1928` `"source": "motion-bar-end",` `manifest/commands/motion.json:1929` `"zone": "motion-track",` `manifest/commands/motion.json:1930` `"gesture": "motion-bar-resize",`
- **Tratador:** `src/app/commands.ts:276` `'motion.resizeAction': resizeActionCommand,`
- **Início:** `src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`
- **Fluxo:** `fluxos/ENT-P-motion-0047.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1613

## ENT-P-motion-0048 — motion.select pela porta timeline-motion-bar
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2002` `"kind": "panel-control",`
- **Comando:** motion.select
- **Porta:** `manifest/commands/motion.json:2001` `"id": "timeline-motion-bar",`
- **Gatilho:** `manifest/commands/motion.json:2009` `"gesture": "motion-select",`
- **Tratador:** `src/app/commands.ts:277` `'motion.select': selectMotionCommand,`
- **Início:** `src/editor/motion/ui/timeline.tsx:143` `onClick={(event: MouseEvent) => (event.shiftKey ? adding.run() : plain.run())}`
- **Fluxo:** `fluxos/ENT-P-motion-0048.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1614

## ENT-P-motion-0049 — motion.select pela porta timeline-motion-bar-add
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2028` `"kind": "panel-control",`
- **Comando:** motion.select
- **Porta:** `manifest/commands/motion.json:2027` `"id": "timeline-motion-bar-add",`
- **Gatilho:** `manifest/commands/motion.json:2035` `"gesture": "motion-select",`
- **Tratador:** `src/app/commands.ts:277` `'motion.select': selectMotionCommand,`
- **Início:** `src/editor/motion/ui/timeline.tsx:143` `onClick={(event: MouseEvent) => (event.shiftKey ? adding.run() : plain.run())}`
- **Fluxo:** `fluxos/ENT-P-motion-0049.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1614

## ENT-P-motion-0050 — motion.select pela porta timeline-motion-keyframe
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2056` `"kind": "panel-control",`
- **Comando:** motion.select
- **Porta:** `manifest/commands/motion.json:2055` `"id": "timeline-motion-keyframe",`
- **Gatilho:** `manifest/commands/motion.json:2063` `"gesture": "motion-select",`
- **Tratador:** `src/app/commands.ts:277` `'motion.select': selectMotionCommand,`
- **Início:** `src/editor/motion/ui/timeline.tsx:143` `onClick={(event: MouseEvent) => (event.shiftKey ? adding.run() : plain.run())}`
- **Fluxo:** `fluxos/ENT-P-motion-0050.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1614

## ENT-P-motion-0051 — motion.select pela porta timeline-motion-keyframe-add
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2082` `"kind": "panel-control",`
- **Comando:** motion.select
- **Porta:** `manifest/commands/motion.json:2081` `"id": "timeline-motion-keyframe-add",`
- **Gatilho:** `manifest/commands/motion.json:2089` `"gesture": "motion-select",`
- **Tratador:** `src/app/commands.ts:277` `'motion.select': selectMotionCommand,`
- **Início:** `src/editor/motion/ui/timeline.tsx:143` `onClick={(event: MouseEvent) => (event.shiftKey ? adding.run() : plain.run())}`
- **Fluxo:** `fluxos/ENT-P-motion-0051.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1614

## ENT-P-motion-0052 — motion.setPlayhead pela porta panel-drag-motion-playhead
- **Tipo:** comando-porta panel-drag `manifest/commands/motion.json:2139` `"kind": "panel-drag",`
- **Comando:** motion.setPlayhead
- **Porta:** `manifest/commands/motion.json:2138` `"id": "panel-drag-motion-playhead",`
- **Gatilho:** `manifest/commands/motion.json:2141` `"source": "motion-playhead",` `manifest/commands/motion.json:2142` `"zone": "motion-track",` `manifest/commands/motion.json:2143` `"gesture": "motion-playhead-drag",`
- **Tratador:** `src/app/commands.ts:278` `'motion.setPlayhead': setMotionPlayheadCommand,`
- **Início:** `src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`
- **Fluxo:** `fluxos/ENT-P-motion-0052.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1615

## ENT-P-motion-0053 — motion.zoomTimeline pela porta timeline-motion-zoom-in
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2188` `"kind": "panel-control",`
- **Comando:** motion.zoomTimeline
- **Porta:** `manifest/commands/motion.json:2187` `"id": "timeline-motion-zoom-in",`
- **Tratador:** `src/app/commands.ts:279` `'motion.zoomTimeline': zoomTimelineCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0053.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1616

## ENT-P-motion-0054 — motion.zoomTimeline pela porta timeline-motion-zoom-out
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2216` `"kind": "panel-control",`
- **Comando:** motion.zoomTimeline
- **Porta:** `manifest/commands/motion.json:2215` `"id": "timeline-motion-zoom-out",`
- **Tratador:** `src/app/commands.ts:279` `'motion.zoomTimeline': zoomTimelineCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0054.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1616

## ENT-P-motion-0055 — motion.toggleSnap pela porta timeline-motion-snap
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2262` `"kind": "panel-control",`
- **Comando:** motion.toggleSnap
- **Porta:** `manifest/commands/motion.json:2261` `"id": "timeline-motion-snap",`
- **Tratador:** `src/app/commands.ts:280` `'motion.toggleSnap': toggleSnapCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0055.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1617

## ENT-P-motion-0056 — motion.addMarker pela porta timeline-motion-add-marker
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2324` `"kind": "panel-control",`
- **Comando:** motion.addMarker
- **Porta:** `manifest/commands/motion.json:2323` `"id": "timeline-motion-add-marker",`
- **Tratador:** `src/app/commands.ts:281` `'motion.addMarker': addMarkerCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0056.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1618

## ENT-P-motion-0057 — motion.moveMarker pela porta panel-drag-motion-marker
- **Tipo:** comando-porta panel-drag `manifest/commands/motion.json:2400` `"kind": "panel-drag",`
- **Comando:** motion.moveMarker
- **Porta:** `manifest/commands/motion.json:2399` `"id": "panel-drag-motion-marker",`
- **Gatilho:** `manifest/commands/motion.json:2402` `"source": "motion-marker",` `manifest/commands/motion.json:2403` `"zone": "motion-track",` `manifest/commands/motion.json:2404` `"gesture": "motion-marker-drag",`
- **Tratador:** `src/app/commands.ts:282` `'motion.moveMarker': moveMarkerCommand,`
- **Início:** `src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`
- **Fluxo:** `fluxos/ENT-P-motion-0057.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1619

## ENT-P-motion-0058 — motion.renameMarker pela porta timeline-motion-marker-name
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2466` `"kind": "panel-control",`
- **Comando:** motion.renameMarker
- **Porta:** `manifest/commands/motion.json:2465` `"id": "timeline-motion-marker-name",`
- **Tratador:** `src/app/commands.ts:283` `'motion.renameMarker': renameMarkerCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0058.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1620

## ENT-P-motion-0059 — motion.removeMarker pela porta timeline-motion-marker-remove
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2532` `"kind": "panel-control",`
- **Comando:** motion.removeMarker
- **Porta:** `manifest/commands/motion.json:2531` `"id": "timeline-motion-marker-remove",`
- **Tratador:** `src/app/commands.ts:284` `'motion.removeMarker': removeMarkerCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0059.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1621

## ENT-P-motion-0060 — motion.setKeyframe pela porta timeline-motion-add-keyframe
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2611` `"kind": "panel-control",`
- **Comando:** motion.setKeyframe
- **Porta:** `manifest/commands/motion.json:2610` `"id": "timeline-motion-add-keyframe",`
- **Tratador:** `src/app/commands.ts:285` `'motion.setKeyframe': setKeyframeCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0060.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1622

## ENT-P-motion-0061 — motion.setKeyframe pela porta timeline-motion-add-property
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2637` `"kind": "panel-control",`
- **Comando:** motion.setKeyframe
- **Porta:** `manifest/commands/motion.json:2636` `"id": "timeline-motion-add-property",`
- **Tratador:** `src/app/commands.ts:285` `'motion.setKeyframe': setKeyframeCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0061.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1622

## ENT-P-motion-0062 — motion.editKeyframe pela porta timeline-motion-keyframe-value
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2729` `"kind": "panel-control",`
- **Comando:** motion.editKeyframe
- **Porta:** `manifest/commands/motion.json:2728` `"id": "timeline-motion-keyframe-value",`
- **Tratador:** `src/app/commands.ts:286` `'motion.editKeyframe': editKeyframeCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0062.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1623

## ENT-P-motion-0063 — motion.editKeyframe pela porta timeline-motion-keyframe-easing
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2757` `"kind": "panel-control",`
- **Comando:** motion.editKeyframe
- **Porta:** `manifest/commands/motion.json:2756` `"id": "timeline-motion-keyframe-easing",`
- **Tratador:** `src/app/commands.ts:286` `'motion.editKeyframe': editKeyframeCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0063.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1623

## ENT-P-motion-0064 — motion.editKeyframe pela porta timeline-motion-keyframe-time
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2785` `"kind": "panel-control",`
- **Comando:** motion.editKeyframe
- **Porta:** `manifest/commands/motion.json:2784` `"id": "timeline-motion-keyframe-time",`
- **Tratador:** `src/app/commands.ts:286` `'motion.editKeyframe': editKeyframeCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0064.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1623

## ENT-P-motion-0065 — motion.editKeyframe pela porta timeline-motion-keyframe-property
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2813` `"kind": "panel-control",`
- **Comando:** motion.editKeyframe
- **Porta:** `manifest/commands/motion.json:2812` `"id": "timeline-motion-keyframe-property",`
- **Tratador:** `src/app/commands.ts:286` `'motion.editKeyframe': editKeyframeCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0065.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1623

## ENT-P-motion-0066 — motion.moveKeyframes pela porta panel-drag-motion-keyframe
- **Tipo:** comando-porta panel-drag `manifest/commands/motion.json:2901` `"kind": "panel-drag",`
- **Comando:** motion.moveKeyframes
- **Porta:** `manifest/commands/motion.json:2900` `"id": "panel-drag-motion-keyframe",`
- **Gatilho:** `manifest/commands/motion.json:2903` `"source": "motion-keyframe",` `manifest/commands/motion.json:2904` `"zone": "motion-track",` `manifest/commands/motion.json:2905` `"gesture": "motion-keyframe-drag",`
- **Tratador:** `src/app/commands.ts:287` `'motion.moveKeyframes': moveKeyframesCommand,`
- **Início:** `src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`
- **Fluxo:** `fluxos/ENT-P-motion-0066.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1624

## ENT-P-motion-0067 — motion.deleteKeyframes pela porta timeline-motion-keyframes-delete
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:2971` `"kind": "panel-control",`
- **Comando:** motion.deleteKeyframes
- **Porta:** `manifest/commands/motion.json:2970` `"id": "timeline-motion-keyframes-delete",`
- **Tratador:** `src/app/commands.ts:288` `'motion.deleteKeyframes': deleteKeyframesCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0067.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1625

## ENT-P-motion-0068 — motion.copyKeyframes pela porta timeline-motion-keyframes-copy
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3017` `"kind": "panel-control",`
- **Comando:** motion.copyKeyframes
- **Porta:** `manifest/commands/motion.json:3016` `"id": "timeline-motion-keyframes-copy",`
- **Tratador:** `src/app/commands.ts:289` `'motion.copyKeyframes': copyMotionKeyframesCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0068.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1626

## ENT-P-motion-0069 — motion.pasteKeyframes pela porta timeline-motion-keyframes-paste
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3090` `"kind": "panel-control",`
- **Comando:** motion.pasteKeyframes
- **Porta:** `manifest/commands/motion.json:3089` `"id": "timeline-motion-keyframes-paste",`
- **Tratador:** `src/app/commands.ts:290` `'motion.pasteKeyframes': pasteKeyframesCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0069.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1627

## ENT-P-motion-0070 — motion.toggleRecord pela porta timeline-motion-record
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3136` `"kind": "panel-control",`
- **Comando:** motion.toggleRecord
- **Porta:** `manifest/commands/motion.json:3135` `"id": "timeline-motion-record",`
- **Tratador:** `src/app/commands.ts:291` `'motion.toggleRecord': toggleRecordCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0070.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1628

## ENT-P-motion-0071 — motion.preview pela porta timeline-motion-play
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3192` `"kind": "panel-control",`
- **Comando:** motion.preview
- **Porta:** `manifest/commands/motion.json:3191` `"id": "timeline-motion-play",`
- **Tratador:** `src/app/commands.ts:292` `'motion.preview': previewMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0071.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1629

## ENT-P-motion-0072 — motion.preview pela porta timeline-motion-pause
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3220` `"kind": "panel-control",`
- **Comando:** motion.preview
- **Porta:** `manifest/commands/motion.json:3219` `"id": "timeline-motion-pause",`
- **Tratador:** `src/app/commands.ts:292` `'motion.preview': previewMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0072.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1629

## ENT-P-motion-0073 — motion.preview pela porta timeline-motion-stop
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3248` `"kind": "panel-control",`
- **Comando:** motion.preview
- **Porta:** `manifest/commands/motion.json:3247` `"id": "timeline-motion-stop",`
- **Tratador:** `src/app/commands.ts:292` `'motion.preview': previewMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0073.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1629

## ENT-P-motion-0074 — motion.toggleRun pela porta menu-view-run-interactions
- **Tipo:** comando-porta menu `manifest/commands/motion.json:3294` `"kind": "menu",`
- **Comando:** motion.toggleRun
- **Porta:** `manifest/commands/motion.json:3293` `"id": "menu-view-run-interactions",`
- **Tratador:** `src/app/commands.ts:293` `'motion.toggleRun': toggleRunCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-motion-0074.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1630

## ENT-P-motion-0075 — motion.setBehaviour pela porta inspector-motion-behaviour-sticky
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3368` `"kind": "panel-control",`
- **Comando:** motion.setBehaviour
- **Porta:** `manifest/commands/motion.json:3367` `"id": "inspector-motion-behaviour-sticky",`
- **Tratador:** `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0075.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1631

## ENT-P-motion-0076 — motion.setBehaviour pela porta inspector-motion-behaviour-scroll-snap
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3399` `"kind": "panel-control",`
- **Comando:** motion.setBehaviour
- **Porta:** `manifest/commands/motion.json:3398` `"id": "inspector-motion-behaviour-scroll-snap",`
- **Tratador:** `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0076.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1631

## ENT-P-motion-0077 — motion.setBehaviour pela porta inspector-motion-behaviour-smooth-scroll
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3432` `"kind": "panel-control",`
- **Comando:** motion.setBehaviour
- **Porta:** `manifest/commands/motion.json:3431` `"id": "inspector-motion-behaviour-smooth-scroll",`
- **Tratador:** `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0077.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1631

## ENT-P-motion-0078 — motion.setBehaviour pela porta inspector-motion-behaviour-parallax
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3460` `"kind": "panel-control",`
- **Comando:** motion.setBehaviour
- **Porta:** `manifest/commands/motion.json:3459` `"id": "inspector-motion-behaviour-parallax",`
- **Tratador:** `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0078.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1631

## ENT-P-motion-0079 — motion.setBehaviour pela porta inspector-motion-behaviour-marquee
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3488` `"kind": "panel-control",`
- **Comando:** motion.setBehaviour
- **Porta:** `manifest/commands/motion.json:3487` `"id": "inspector-motion-behaviour-marquee",`
- **Tratador:** `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0079.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1631

## ENT-P-motion-0080 — motion.setBehaviour pela porta inspector-motion-behaviour-cursor-follow
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3516` `"kind": "panel-control",`
- **Comando:** motion.setBehaviour
- **Porta:** `manifest/commands/motion.json:3515` `"id": "inspector-motion-behaviour-cursor-follow",`
- **Tratador:** `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0080.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1631

## ENT-P-motion-0081 — motion.setBehaviour pela porta inspector-motion-behaviour-amount
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3544` `"kind": "panel-control",`
- **Comando:** motion.setBehaviour
- **Porta:** `manifest/commands/motion.json:3543` `"id": "inspector-motion-behaviour-amount",`
- **Tratador:** `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`
- **Fluxo:** `fluxos/ENT-P-motion-0081.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1631

## ENT-P-motion-0082 — motion.setBehaviour pela porta inspector-motion-behaviour-axis-x
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3570` `"kind": "panel-control",`
- **Comando:** motion.setBehaviour
- **Porta:** `manifest/commands/motion.json:3569` `"id": "inspector-motion-behaviour-axis-x",`
- **Tratador:** `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0082.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1631

## ENT-P-motion-0083 — motion.setBehaviour pela porta inspector-motion-behaviour-axis-y
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3598` `"kind": "panel-control",`
- **Comando:** motion.setBehaviour
- **Porta:** `manifest/commands/motion.json:3597` `"id": "inspector-motion-behaviour-axis-y",`
- **Tratador:** `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0083.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1631

## ENT-P-motion-0084 — motion.removeBehaviour pela porta inspector-motion-behaviour-remove
- **Tipo:** comando-porta panel-control `manifest/commands/motion.json:3661` `"kind": "panel-control",`
- **Comando:** motion.removeBehaviour
- **Porta:** `manifest/commands/motion.json:3660` `"id": "inspector-motion-behaviour-remove",`
- **Tratador:** `src/app/commands.ts:295` `'motion.removeBehaviour': removeBehaviourCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Fluxo:** `fluxos/ENT-P-motion-0084.md` (o arquivo entra na Fase 5)
- **Requisitos:** REQ-1632

