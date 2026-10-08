# Portas de comando do domínio layout-composer

Cada bloco é uma porta (entryPoint) de um comando do domínio `layout-composer`, lida de `manifest/commands/layout-composer.json`. Os comandos vêm do módulo instalado, que entra na tabela do núcleo por `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`.

## ENT-P-layout-composer-0001 — layout.enter pela porta layout-compose
- **Tipo:** comando-porta toolbar `manifest/commands/layout-composer.json:38` `"kind": "toolbar",`
- **Comando:** layout.enter
- **Porta:** `manifest/commands/layout-composer.json:37` `"id": "layout-compose",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0001.md`
- **Requisitos:** REQ-1501

## ENT-P-layout-composer-0002 — layout.enter pela porta layout-compose-menu
- **Tipo:** comando-porta context-menu `manifest/commands/layout-composer.json:60` `"kind": "context-menu",`
- **Comando:** layout.enter
- **Porta:** `manifest/commands/layout-composer.json:59` `"id": "layout-compose-menu",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0002.md`
- **Requisitos:** REQ-1501

## ENT-P-layout-composer-0003 — layout.enter pela porta key-l-in-global
- **Tipo:** comando-porta shortcut `manifest/commands/layout-composer.json:80` `"kind": "shortcut",`
- **Comando:** layout.enter
- **Porta:** `manifest/commands/layout-composer.json:79` `"id": "key-l-in-global",`
- **Gatilho:** `manifest/commands/layout-composer.json:82` `"chord": "L",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0003.md`
- **Requisitos:** REQ-1501

## ENT-P-layout-composer-0004 — layout.enter pela porta toolbar-activity-bar-layout
- **Tipo:** comando-porta toolbar `manifest/commands/layout-composer.json:100` `"kind": "toolbar",`
- **Comando:** layout.enter
- **Porta:** `manifest/commands/layout-composer.json:99` `"id": "toolbar-activity-bar-layout",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0004.md`
- **Requisitos:** REQ-1501

## ENT-P-layout-composer-0005 — layout.leave pela porta layout-done
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:146` `"kind": "panel-control",`
- **Comando:** layout.leave
- **Porta:** `manifest/commands/layout-composer.json:145` `"id": "layout-done",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0005.md`
- **Requisitos:** REQ-1502

## ENT-P-layout-composer-0006 — layout.leave pela porta layout-escape
- **Tipo:** comando-porta shortcut `manifest/commands/layout-composer.json:172` `"kind": "shortcut",`
- **Comando:** layout.leave
- **Porta:** `manifest/commands/layout-composer.json:171` `"id": "layout-escape",`
- **Gatilho:** `manifest/commands/layout-composer.json:174` `"chord": "Escape",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0006.md`
- **Requisitos:** REQ-1502

## ENT-P-layout-composer-0007 — layout.stroke pela porta layout-stage
- **Tipo:** comando-porta canvas-drag `manifest/commands/layout-composer.json:248` `"kind": "canvas-drag",`
- **Comando:** layout.stroke
- **Porta:** `manifest/commands/layout-composer.json:247` `"id": "layout-stage",`
- **Gatilho:** `manifest/commands/layout-composer.json:250` `"source": "layout-stage",` `manifest/commands/layout-composer.json:251` `"zone": "layout-composition",` `manifest/commands/layout-composer.json:252` `"gesture": "layout-stroke",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/modules/layout-composer/interaction/tool.ts:102` `gesture.dispatch(STROKE as never, { mode: handle === null ? modeOf(next, composer.tool) : 'auto', points: [...points], ...(handleText === null ? {} : { handle: handleText }) } as never);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0007.md`
- **Requisitos:** REQ-1503

## ENT-P-layout-composer-0008 — layout.stroke pela porta layout-boundary
- **Tipo:** comando-porta canvas-handle `manifest/commands/layout-composer.json:268` `"kind": "canvas-handle",`
- **Comando:** layout.stroke
- **Porta:** `manifest/commands/layout-composer.json:267` `"id": "layout-boundary",`
- **Gatilho:** `manifest/commands/layout-composer.json:271` `"gesture": "layout-handle",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/modules/layout-composer/interaction/tool.ts:102` `gesture.dispatch(STROKE as never, { mode: handle === null ? modeOf(next, composer.tool) : 'auto', points: [...points], ...(handleText === null ? {} : { handle: handleText }) } as never);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0008.md`
- **Requisitos:** REQ-1503

## ENT-P-layout-composer-0009 — layout.stroke pela porta layout-gap
- **Tipo:** comando-porta canvas-handle `manifest/commands/layout-composer.json:287` `"kind": "canvas-handle",`
- **Comando:** layout.stroke
- **Porta:** `manifest/commands/layout-composer.json:286` `"id": "layout-gap",`
- **Gatilho:** `manifest/commands/layout-composer.json:290` `"gesture": "layout-handle",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/modules/layout-composer/interaction/tool.ts:102` `gesture.dispatch(STROKE as never, { mode: handle === null ? modeOf(next, composer.tool) : 'auto', points: [...points], ...(handleText === null ? {} : { handle: handleText }) } as never);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0009.md`
- **Requisitos:** REQ-1503

## ENT-P-layout-composer-0010 — layout.stroke pela porta layout-repeat
- **Tipo:** comando-porta canvas-handle `manifest/commands/layout-composer.json:306` `"kind": "canvas-handle",`
- **Comando:** layout.stroke
- **Porta:** `manifest/commands/layout-composer.json:305` `"id": "layout-repeat",`
- **Gatilho:** `manifest/commands/layout-composer.json:309` `"gesture": "layout-handle",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/modules/layout-composer/interaction/tool.ts:102` `gesture.dispatch(STROKE as never, { mode: handle === null ? modeOf(next, composer.tool) : 'auto', points: [...points], ...(handleText === null ? {} : { handle: handleText }) } as never);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0010.md`
- **Requisitos:** REQ-1503

## ENT-P-layout-composer-0011 — layout.stroke pela porta layout-vertex
- **Tipo:** comando-porta canvas-handle `manifest/commands/layout-composer.json:325` `"kind": "canvas-handle",`
- **Comando:** layout.stroke
- **Porta:** `manifest/commands/layout-composer.json:324` `"id": "layout-vertex",`
- **Gatilho:** `manifest/commands/layout-composer.json:328` `"gesture": "layout-handle",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/modules/layout-composer/interaction/tool.ts:102` `gesture.dispatch(STROKE as never, { mode: handle === null ? modeOf(next, composer.tool) : 'auto', points: [...points], ...(handleText === null ? {} : { handle: handleText }) } as never);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0011.md`
- **Requisitos:** REQ-1503

## ENT-P-layout-composer-0012 — layout.stroke pela porta layout-move
- **Tipo:** comando-porta canvas-handle `manifest/commands/layout-composer.json:344` `"kind": "canvas-handle",`
- **Comando:** layout.stroke
- **Porta:** `manifest/commands/layout-composer.json:343` `"id": "layout-move",`
- **Gatilho:** `manifest/commands/layout-composer.json:347` `"gesture": "layout-handle",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/modules/layout-composer/interaction/tool.ts:102` `gesture.dispatch(STROKE as never, { mode: handle === null ? modeOf(next, composer.tool) : 'auto', points: [...points], ...(handleText === null ? {} : { handle: handleText }) } as never);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0012.md`
- **Requisitos:** REQ-1503

## ENT-P-layout-composer-0013 — layout.select pela porta layout-region
- **Tipo:** comando-porta canvas-click `manifest/commands/layout-composer.json:403` `"kind": "canvas-click",`
- **Comando:** layout.select
- **Porta:** `manifest/commands/layout-composer.json:402` `"id": "layout-region",`
- **Gatilho:** `manifest/commands/layout-composer.json:409` `"gesture": "layout-click",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/modules/layout-composer/interaction/tool.ts:98` `gesture.dispatch(SELECT as never, { regions: picked === null ? [] : [picked], mode } as never);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0013.md`
- **Requisitos:** REQ-1504

## ENT-P-layout-composer-0014 — layout.select pela porta layout-region-add
- **Tipo:** comando-porta canvas-click `manifest/commands/layout-composer.json:427` `"kind": "canvas-click",`
- **Comando:** layout.select
- **Porta:** `manifest/commands/layout-composer.json:426` `"id": "layout-region-add",`
- **Gatilho:** `manifest/commands/layout-composer.json:433` `"gesture": "layout-click",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/modules/layout-composer/interaction/tool.ts:98` `gesture.dispatch(SELECT as never, { regions: picked === null ? [] : [picked], mode } as never);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0014.md`
- **Requisitos:** REQ-1504

## ENT-P-layout-composer-0015 — layout.select pela porta layout-region-cycle
- **Tipo:** comando-porta canvas-click `manifest/commands/layout-composer.json:451` `"kind": "canvas-click",`
- **Comando:** layout.select
- **Porta:** `manifest/commands/layout-composer.json:450` `"id": "layout-region-cycle",`
- **Gatilho:** `manifest/commands/layout-composer.json:457` `"gesture": "layout-click",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/modules/layout-composer/interaction/tool.ts:98` `gesture.dispatch(SELECT as never, { regions: picked === null ? [] : [picked], mode } as never);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0015.md`
- **Requisitos:** REQ-1504

## ENT-P-layout-composer-0016 — layout.delete pela porta layout-delete
- **Tipo:** comando-porta shortcut `manifest/commands/layout-composer.json:504` `"kind": "shortcut",`
- **Comando:** layout.delete
- **Porta:** `manifest/commands/layout-composer.json:503` `"id": "layout-delete",`
- **Gatilho:** `manifest/commands/layout-composer.json:506` `"chord": "Delete",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0016.md`
- **Requisitos:** REQ-1505

## ENT-P-layout-composer-0017 — layout.delete pela porta layout-delete-button
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:524` `"kind": "panel-control",`
- **Comando:** layout.delete
- **Porta:** `manifest/commands/layout-composer.json:523` `"id": "layout-delete-button",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0017.md`
- **Requisitos:** REQ-1505

## ENT-P-layout-composer-0018 — layout.place pela porta canvas-drag-layout-region
- **Tipo:** comando-porta canvas-drag `manifest/commands/layout-composer.json:608` `"kind": "canvas-drag",`
- **Comando:** layout.place
- **Porta:** `manifest/commands/layout-composer.json:607` `"id": "canvas-drag-layout-region",`
- **Gatilho:** `manifest/commands/layout-composer.json:610` `"source": "layout-region",` `manifest/commands/layout-composer.json:611` `"zone": "layout-place",` `manifest/commands/layout-composer.json:612` `"gesture": "layout-place",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0018.md`
- **Requisitos:** REQ-1506

## ENT-P-layout-composer-0019 — layout.place pela porta handle-layout-region-edge
- **Tipo:** comando-porta canvas-handle `manifest/commands/layout-composer.json:630` `"kind": "canvas-handle",`
- **Comando:** layout.place
- **Porta:** `manifest/commands/layout-composer.json:629` `"id": "handle-layout-region-edge",`
- **Gatilho:** `manifest/commands/layout-composer.json:633` `"gesture": "layout-place",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0019.md`
- **Requisitos:** REQ-1506

## ENT-P-layout-composer-0020 — layout.merge pela porta layout-merge-button
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:678` `"kind": "panel-control",`
- **Comando:** layout.merge
- **Porta:** `manifest/commands/layout-composer.json:677` `"id": "layout-merge-button",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0020.md`
- **Requisitos:** REQ-1507

## ENT-P-layout-composer-0021 — layout.configure pela porta layout-name
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:754` `"kind": "panel-control",`
- **Comando:** layout.configure
- **Porta:** `manifest/commands/layout-composer.json:753` `"id": "layout-name",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0021.md`
- **Requisitos:** REQ-1508

## ENT-P-layout-composer-0022 — layout.configure pela porta layout-semantic
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:782` `"kind": "panel-control",`
- **Comando:** layout.configure
- **Porta:** `manifest/commands/layout-composer.json:781` `"id": "layout-semantic",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0022.md`
- **Requisitos:** REQ-1508

## ENT-P-layout-composer-0023 — layout.configure pela porta layout-width
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:810` `"kind": "panel-control",`
- **Comando:** layout.configure
- **Porta:** `manifest/commands/layout-composer.json:809` `"id": "layout-width",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0023.md`
- **Requisitos:** REQ-1508

## ENT-P-layout-composer-0024 — layout.configure pela porta layout-height
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:838` `"kind": "panel-control",`
- **Comando:** layout.configure
- **Porta:** `manifest/commands/layout-composer.json:837` `"id": "layout-height",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0024.md`
- **Requisitos:** REQ-1508

## ENT-P-layout-composer-0025 — layout.configure pela porta layout-padding
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:866` `"kind": "panel-control",`
- **Comando:** layout.configure
- **Porta:** `manifest/commands/layout-composer.json:865` `"id": "layout-padding",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0025.md`
- **Requisitos:** REQ-1508

## ENT-P-layout-composer-0026 — layout.configure pela porta layout-spacing
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:894` `"kind": "panel-control",`
- **Comando:** layout.configure
- **Porta:** `manifest/commands/layout-composer.json:893` `"id": "layout-spacing",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0026.md`
- **Requisitos:** REQ-1508

## ENT-P-layout-composer-0027 — layout.configure pela porta layout-repeat
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:922` `"kind": "panel-control",`
- **Comando:** layout.configure
- **Porta:** `manifest/commands/layout-composer.json:921` `"id": "layout-repeat",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0027.md`
- **Requisitos:** REQ-1508

## ENT-P-layout-composer-0028 — layout.configure pela porta layout-alignment
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:950` `"kind": "panel-control",`
- **Comando:** layout.configure
- **Porta:** `manifest/commands/layout-composer.json:949` `"id": "layout-alignment",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0028.md`
- **Requisitos:** REQ-1508

## ENT-P-layout-composer-0029 — layout.configure pela porta layout-distribution
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:978` `"kind": "panel-control",`
- **Comando:** layout.configure
- **Porta:** `manifest/commands/layout-composer.json:977` `"id": "layout-distribution",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0029.md`
- **Requisitos:** REQ-1508

## ENT-P-layout-composer-0030 — layout.configure pela porta layout-equal-widths
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1006` `"kind": "panel-control",`
- **Comando:** layout.configure
- **Porta:** `manifest/commands/layout-composer.json:1005` `"id": "layout-equal-widths",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0030.md`
- **Requisitos:** REQ-1508

## ENT-P-layout-composer-0031 — layout.configure pela porta layout-equal-gaps
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1035` `"kind": "panel-control",`
- **Comando:** layout.configure
- **Porta:** `manifest/commands/layout-composer.json:1034` `"id": "layout-equal-gaps",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0031.md`
- **Requisitos:** REQ-1508

## ENT-P-layout-composer-0032 — layout.interpret pela porta layout-strategy
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1105` `"kind": "panel-control",`
- **Comando:** layout.interpret
- **Porta:** `manifest/commands/layout-composer.json:1104` `"id": "layout-strategy",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0032.md`
- **Requisitos:** REQ-1509

## ENT-P-layout-composer-0033 — layout.respond pela porta layout-stack
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1177` `"kind": "panel-control",`
- **Comando:** layout.respond
- **Porta:** `manifest/commands/layout-composer.json:1176` `"id": "layout-stack",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0033.md`
- **Requisitos:** REQ-1510

## ENT-P-layout-composer-0034 — layout.respond pela porta layout-unstack
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1205` `"kind": "panel-control",`
- **Comando:** layout.respond
- **Porta:** `manifest/commands/layout-composer.json:1204` `"id": "layout-unstack",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0034.md`
- **Requisitos:** REQ-1510

## ENT-P-layout-composer-0035 — layout.respond pela porta layout-columns
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1233` `"kind": "panel-control",`
- **Comando:** layout.respond
- **Porta:** `manifest/commands/layout-composer.json:1232` `"id": "layout-columns",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0035.md`
- **Requisitos:** REQ-1510

## ENT-P-layout-composer-0036 — layout.respond pela porta layout-hide
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1261` `"kind": "panel-control",`
- **Comando:** layout.respond
- **Porta:** `manifest/commands/layout-composer.json:1260` `"id": "layout-hide",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0036.md`
- **Requisitos:** REQ-1510

## ENT-P-layout-composer-0037 — layout.respond pela porta layout-show
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1289` `"kind": "panel-control",`
- **Comando:** layout.respond
- **Porta:** `manifest/commands/layout-composer.json:1288` `"id": "layout-show",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0037.md`
- **Requisitos:** REQ-1510

## ENT-P-layout-composer-0038 — layout.unrelate pela porta layout-unrelate
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1351` `"kind": "panel-control",`
- **Comando:** layout.unrelate
- **Porta:** `manifest/commands/layout-composer.json:1350` `"id": "layout-unrelate",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0038.md`
- **Requisitos:** REQ-1511

## ENT-P-layout-composer-0039 — layout.suggest pela porta layout-suggest
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1413` `"kind": "panel-control",`
- **Comando:** layout.suggest
- **Porta:** `manifest/commands/layout-composer.json:1412` `"id": "layout-suggest",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0039.md`
- **Requisitos:** REQ-1512

## ENT-P-layout-composer-0040 — layout.template pela porta layout-template
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1481` `"kind": "panel-control",`
- **Comando:** layout.template
- **Porta:** `manifest/commands/layout-composer.json:1480` `"id": "layout-template",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0040.md`
- **Requisitos:** REQ-1513

## ENT-P-layout-composer-0041 — layout.reference pela porta layout-reference
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1546` `"kind": "panel-control",`
- **Comando:** layout.reference
- **Porta:** `manifest/commands/layout-composer.json:1545` `"id": "layout-reference",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0041.md`
- **Requisitos:** REQ-1514

## ENT-P-layout-composer-0042 — layout.reference pela porta layout-reference-opacity
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1572` `"kind": "panel-control",`
- **Comando:** layout.reference
- **Porta:** `manifest/commands/layout-composer.json:1571` `"id": "layout-reference-opacity",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0042.md`
- **Requisitos:** REQ-1514

## ENT-P-layout-composer-0043 — layout.reference pela porta layout-reference-clear
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1598` `"kind": "panel-control",`
- **Comando:** layout.reference
- **Porta:** `manifest/commands/layout-composer.json:1597` `"id": "layout-reference-clear",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0043.md`
- **Requisitos:** REQ-1514

## ENT-P-layout-composer-0044 — layout.trace pela porta layout-trace
- **Tipo:** comando-porta panel-control `manifest/commands/layout-composer.json:1660` `"kind": "panel-control",`
- **Comando:** layout.trace
- **Porta:** `manifest/commands/layout-composer.json:1659` `"id": "layout-trace",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-layout-composer-0044.md`
- **Requisitos:** REQ-1515
