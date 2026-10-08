# Portas de comando do domínio geometry

Fonte: `manifest/commands/geometry.json`. Um bloco por porta, na ordem do manifesto: 58 portas de oito comandos. O campo Gatilho cita os campos `chord`, `source`, `zone` e `gesture` que a porta declara, na ordem do manifesto, e some quando a porta não declara gatilho. As portas de teclado entram pelo keymap; os controles desenhados, pelo `src/editor/doors/door.tsx`; as alças de redimensionamento e o arraste livre, pelo dono do ponteiro.

## ENT-P-geometry-0001 — position.setMode pela porta position.setMode#inspector-position
- **Tipo:** comando-porta inspector-field `manifest/commands/geometry.json:48` `"kind": "inspector-field",`
- **Comando:** position.setMode
- **Porta:** `manifest/commands/geometry.json:47` `"id": "inspector-position",`
- **Tratador:** `src/app/commands.ts:324` `'position.setMode': setPositionModeCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0001.md`
- **Requisitos:** REQ-1301

## ENT-P-geometry-0002 — position.setMode pela porta position.setMode#command-bar-set-property
- **Tipo:** comando-porta command-bar `manifest/commands/geometry.json:81` `"kind": "command-bar",`
- **Comando:** position.setMode
- **Porta:** `manifest/commands/geometry.json:80` `"id": "command-bar-set-property",`
- **Tratador:** `src/app/commands.ts:324` `'position.setMode': setPositionModeCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0002.md`
- **Requisitos:** REQ-1301

## ENT-P-geometry-0003 — geometry.resize pela porta geometry.resize#handle-resize-n
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:166` `"kind": "canvas-handle",`
- **Comando:** geometry.resize
- **Porta:** `manifest/commands/geometry.json:165` `"id": "handle-resize-n",`
- **Gatilho:** `manifest/commands/geometry.json:169` `"gesture": "resize",`
- **Tratador:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Início:** `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);`
- **Fluxo:** `fluxos/ENT-P-geometry-0003.md`
- **Requisitos:** REQ-1302

## ENT-P-geometry-0004 — geometry.resize pela porta geometry.resize#handle-resize-ne
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:189` `"kind": "canvas-handle",`
- **Comando:** geometry.resize
- **Porta:** `manifest/commands/geometry.json:188` `"id": "handle-resize-ne",`
- **Gatilho:** `manifest/commands/geometry.json:192` `"gesture": "resize",`
- **Tratador:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Início:** `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);`
- **Fluxo:** `fluxos/ENT-P-geometry-0004.md`
- **Requisitos:** REQ-1302

## ENT-P-geometry-0005 — geometry.resize pela porta geometry.resize#handle-resize-e
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:213` `"kind": "canvas-handle",`
- **Comando:** geometry.resize
- **Porta:** `manifest/commands/geometry.json:212` `"id": "handle-resize-e",`
- **Gatilho:** `manifest/commands/geometry.json:216` `"gesture": "resize",`
- **Tratador:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Início:** `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);`
- **Fluxo:** `fluxos/ENT-P-geometry-0005.md`
- **Requisitos:** REQ-1302

## ENT-P-geometry-0006 — geometry.resize pela porta geometry.resize#handle-resize-se
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:234` `"kind": "canvas-handle",`
- **Comando:** geometry.resize
- **Porta:** `manifest/commands/geometry.json:233` `"id": "handle-resize-se",`
- **Gatilho:** `manifest/commands/geometry.json:237` `"gesture": "resize",`
- **Tratador:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Início:** `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);`
- **Fluxo:** `fluxos/ENT-P-geometry-0006.md`
- **Requisitos:** REQ-1302

## ENT-P-geometry-0007 — geometry.resize pela porta geometry.resize#handle-resize-s
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:256` `"kind": "canvas-handle",`
- **Comando:** geometry.resize
- **Porta:** `manifest/commands/geometry.json:255` `"id": "handle-resize-s",`
- **Gatilho:** `manifest/commands/geometry.json:259` `"gesture": "resize",`
- **Tratador:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Início:** `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);`
- **Fluxo:** `fluxos/ENT-P-geometry-0007.md`
- **Requisitos:** REQ-1302

## ENT-P-geometry-0008 — geometry.resize pela porta geometry.resize#handle-resize-sw
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:277` `"kind": "canvas-handle",`
- **Comando:** geometry.resize
- **Porta:** `manifest/commands/geometry.json:276` `"id": "handle-resize-sw",`
- **Gatilho:** `manifest/commands/geometry.json:280` `"gesture": "resize",`
- **Tratador:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Início:** `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);`
- **Fluxo:** `fluxos/ENT-P-geometry-0008.md`
- **Requisitos:** REQ-1302

## ENT-P-geometry-0009 — geometry.resize pela porta geometry.resize#handle-resize-w
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:300` `"kind": "canvas-handle",`
- **Comando:** geometry.resize
- **Porta:** `manifest/commands/geometry.json:299` `"id": "handle-resize-w",`
- **Gatilho:** `manifest/commands/geometry.json:303` `"gesture": "resize",`
- **Tratador:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Início:** `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);`
- **Fluxo:** `fluxos/ENT-P-geometry-0009.md`
- **Requisitos:** REQ-1302

## ENT-P-geometry-0010 — geometry.resize pela porta geometry.resize#handle-resize-nw
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:323` `"kind": "canvas-handle",`
- **Comando:** geometry.resize
- **Porta:** `manifest/commands/geometry.json:322` `"id": "handle-resize-nw",`
- **Gatilho:** `manifest/commands/geometry.json:326` `"gesture": "resize",`
- **Tratador:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Início:** `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);`
- **Fluxo:** `fluxos/ENT-P-geometry-0010.md`
- **Requisitos:** REQ-1302

## ENT-P-geometry-0011 — geometry.resize pela porta geometry.resize#handle-resize-edge-n
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:349` `"kind": "canvas-handle",`
- **Comando:** geometry.resize
- **Porta:** `manifest/commands/geometry.json:348` `"id": "handle-resize-edge-n",`
- **Gatilho:** `manifest/commands/geometry.json:352` `"gesture": "resize",`
- **Tratador:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Início:** `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);`
- **Fluxo:** `fluxos/ENT-P-geometry-0011.md`
- **Requisitos:** REQ-1302

## ENT-P-geometry-0012 — geometry.resize pela porta geometry.resize#handle-resize-edge-e
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:372` `"kind": "canvas-handle",`
- **Comando:** geometry.resize
- **Porta:** `manifest/commands/geometry.json:371` `"id": "handle-resize-edge-e",`
- **Gatilho:** `manifest/commands/geometry.json:375` `"gesture": "resize",`
- **Tratador:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Início:** `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);`
- **Fluxo:** `fluxos/ENT-P-geometry-0012.md`
- **Requisitos:** REQ-1302

## ENT-P-geometry-0013 — geometry.resize pela porta geometry.resize#handle-resize-edge-s
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:393` `"kind": "canvas-handle",`
- **Comando:** geometry.resize
- **Porta:** `manifest/commands/geometry.json:392` `"id": "handle-resize-edge-s",`
- **Gatilho:** `manifest/commands/geometry.json:396` `"gesture": "resize",`
- **Tratador:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Início:** `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);`
- **Fluxo:** `fluxos/ENT-P-geometry-0013.md`
- **Requisitos:** REQ-1302

## ENT-P-geometry-0014 — geometry.resize pela porta geometry.resize#handle-resize-edge-w
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:414` `"kind": "canvas-handle",`
- **Comando:** geometry.resize
- **Porta:** `manifest/commands/geometry.json:413` `"id": "handle-resize-edge-w",`
- **Gatilho:** `manifest/commands/geometry.json:417` `"gesture": "resize",`
- **Tratador:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Início:** `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);`
- **Fluxo:** `fluxos/ENT-P-geometry-0014.md`
- **Requisitos:** REQ-1302

## ENT-P-geometry-0015 — position.move pela porta position.move#canvas-drag-positioned-element-containing-block
- **Tipo:** comando-porta canvas-drag `manifest/commands/geometry.json:483` `"kind": "canvas-drag",`
- **Comando:** position.move
- **Porta:** `manifest/commands/geometry.json:482` `"id": "canvas-drag-positioned-element-containing-block",`
- **Gatilho:** `manifest/commands/geometry.json:485` `"source": "positioned-element",` `manifest/commands/geometry.json:486` `"zone": "containing-block",` `manifest/commands/geometry.json:487` `"gesture": "free-drag",`
- **Tratador:** `src/app/commands.ts:326` `'position.move': movePositionedCommand,`
- **Início:** `src/editor/input/pointer/resize.ts:73` `shared.open.dispatch(FREE_DRAG.command.id as CommandId, { ...FREE_DRAG.door.args, dx, dy } as never);`
- **Fluxo:** `fluxos/ENT-P-geometry-0015.md`
- **Requisitos:** REQ-1303

## ENT-P-geometry-0016 — position.move pela porta position.move#key-arrow-left-in-canvas-positioned
- **Tipo:** comando-porta shortcut `manifest/commands/geometry.json:503` `"kind": "shortcut",`
- **Comando:** position.move
- **Porta:** `manifest/commands/geometry.json:502` `"id": "key-arrow-left-in-canvas-positioned",`
- **Gatilho:** `manifest/commands/geometry.json:505` `"chord": "ArrowLeft",` `manifest/commands/geometry.json:507` `"gesture": "nudge-keys",`
- **Tratador:** `src/app/commands.ts:326` `'position.move': movePositionedCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-geometry-0016.md`
- **Requisitos:** REQ-1303

## ENT-P-geometry-0017 — position.move pela porta position.move#key-arrow-right-in-canvas-positioned
- **Tipo:** comando-porta shortcut `manifest/commands/geometry.json:526` `"kind": "shortcut",`
- **Comando:** position.move
- **Porta:** `manifest/commands/geometry.json:525` `"id": "key-arrow-right-in-canvas-positioned",`
- **Gatilho:** `manifest/commands/geometry.json:528` `"chord": "ArrowRight",` `manifest/commands/geometry.json:530` `"gesture": "nudge-keys",`
- **Tratador:** `src/app/commands.ts:326` `'position.move': movePositionedCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-geometry-0017.md`
- **Requisitos:** REQ-1303

## ENT-P-geometry-0018 — position.move pela porta position.move#key-arrow-up-in-canvas-positioned
- **Tipo:** comando-porta shortcut `manifest/commands/geometry.json:549` `"kind": "shortcut",`
- **Comando:** position.move
- **Porta:** `manifest/commands/geometry.json:548` `"id": "key-arrow-up-in-canvas-positioned",`
- **Gatilho:** `manifest/commands/geometry.json:551` `"chord": "ArrowUp",` `manifest/commands/geometry.json:553` `"gesture": "nudge-keys",`
- **Tratador:** `src/app/commands.ts:326` `'position.move': movePositionedCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-geometry-0018.md`
- **Requisitos:** REQ-1303

## ENT-P-geometry-0019 — position.move pela porta position.move#key-arrow-down-in-canvas-positioned
- **Tipo:** comando-porta shortcut `manifest/commands/geometry.json:572` `"kind": "shortcut",`
- **Comando:** position.move
- **Porta:** `manifest/commands/geometry.json:571` `"id": "key-arrow-down-in-canvas-positioned",`
- **Gatilho:** `manifest/commands/geometry.json:574` `"chord": "ArrowDown",` `manifest/commands/geometry.json:576` `"gesture": "nudge-keys",`
- **Tratador:** `src/app/commands.ts:326` `'position.move': movePositionedCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-geometry-0019.md`
- **Requisitos:** REQ-1303

## ENT-P-geometry-0020 — position.setAnchors pela porta position.setAnchors#key-alt-shift-arrow-left-in-canvas-positioned
- **Tipo:** comando-porta shortcut `manifest/commands/geometry.json:643` `"kind": "shortcut",`
- **Comando:** position.setAnchors
- **Porta:** `manifest/commands/geometry.json:642` `"id": "key-alt-shift-arrow-left-in-canvas-positioned",`
- **Gatilho:** `manifest/commands/geometry.json:645` `"chord": "Alt+Shift+ArrowLeft",`
- **Tratador:** `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-geometry-0020.md`
- **Requisitos:** REQ-1304

## ENT-P-geometry-0021 — position.setAnchors pela porta position.setAnchors#key-alt-shift-arrow-right-in-canvas-positioned
- **Tipo:** comando-porta shortcut `manifest/commands/geometry.json:670` `"kind": "shortcut",`
- **Comando:** position.setAnchors
- **Porta:** `manifest/commands/geometry.json:669` `"id": "key-alt-shift-arrow-right-in-canvas-positioned",`
- **Gatilho:** `manifest/commands/geometry.json:672` `"chord": "Alt+Shift+ArrowRight",`
- **Tratador:** `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-geometry-0021.md`
- **Requisitos:** REQ-1304

## ENT-P-geometry-0022 — position.setAnchors pela porta position.setAnchors#key-alt-shift-arrow-up-in-canvas-positioned
- **Tipo:** comando-porta shortcut `manifest/commands/geometry.json:697` `"kind": "shortcut",`
- **Comando:** position.setAnchors
- **Porta:** `manifest/commands/geometry.json:696` `"id": "key-alt-shift-arrow-up-in-canvas-positioned",`
- **Gatilho:** `manifest/commands/geometry.json:699` `"chord": "Alt+Shift+ArrowUp",`
- **Tratador:** `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-geometry-0022.md`
- **Requisitos:** REQ-1304

## ENT-P-geometry-0023 — position.setAnchors pela porta position.setAnchors#key-alt-shift-arrow-down-in-canvas-positioned
- **Tipo:** comando-porta shortcut `manifest/commands/geometry.json:724` `"kind": "shortcut",`
- **Comando:** position.setAnchors
- **Porta:** `manifest/commands/geometry.json:723` `"id": "key-alt-shift-arrow-down-in-canvas-positioned",`
- **Gatilho:** `manifest/commands/geometry.json:726` `"chord": "Alt+Shift+ArrowDown",`
- **Tratador:** `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-geometry-0023.md`
- **Requisitos:** REQ-1304

## ENT-P-geometry-0024 — position.setAnchors pela porta position.setAnchors#handle-anchor-left
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:751` `"kind": "canvas-handle",`
- **Comando:** position.setAnchors
- **Porta:** `manifest/commands/geometry.json:750` `"id": "handle-anchor-left",`
- **Gatilho:** `manifest/commands/geometry.json:754` `"gesture": "anchor-tab",`
- **Tratador:** `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0024.md`
- **Requisitos:** REQ-1304

## ENT-P-geometry-0025 — position.setAnchors pela porta position.setAnchors#handle-anchor-right
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:777` `"kind": "canvas-handle",`
- **Comando:** position.setAnchors
- **Porta:** `manifest/commands/geometry.json:776` `"id": "handle-anchor-right",`
- **Gatilho:** `manifest/commands/geometry.json:780` `"gesture": "anchor-tab",`
- **Tratador:** `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0025.md`
- **Requisitos:** REQ-1304

## ENT-P-geometry-0026 — position.setAnchors pela porta position.setAnchors#handle-anchor-top
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:803` `"kind": "canvas-handle",`
- **Comando:** position.setAnchors
- **Porta:** `manifest/commands/geometry.json:802` `"id": "handle-anchor-top",`
- **Gatilho:** `manifest/commands/geometry.json:806` `"gesture": "anchor-tab",`
- **Tratador:** `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0026.md`
- **Requisitos:** REQ-1304

## ENT-P-geometry-0027 — position.setAnchors pela porta position.setAnchors#handle-anchor-bottom
- **Tipo:** comando-porta canvas-handle `manifest/commands/geometry.json:829` `"kind": "canvas-handle",`
- **Comando:** position.setAnchors
- **Porta:** `manifest/commands/geometry.json:828` `"id": "handle-anchor-bottom",`
- **Gatilho:** `manifest/commands/geometry.json:832` `"gesture": "anchor-tab",`
- **Tratador:** `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0027.md`
- **Requisitos:** REQ-1304

## ENT-P-geometry-0028 — position.setAnchors pela porta position.setAnchors#inspector-anchor-control
- **Tipo:** comando-porta panel-control `manifest/commands/geometry.json:855` `"kind": "panel-control",`
- **Comando:** position.setAnchors
- **Porta:** `manifest/commands/geometry.json:854` `"id": "inspector-anchor-control",`
- **Tratador:** `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0028.md`
- **Requisitos:** REQ-1304

## ENT-P-geometry-0029 — position.align pela porta position.align#quick-panel-align-left
- **Tipo:** comando-porta quick-panel `manifest/commands/geometry.json:929` `"kind": "quick-panel",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:928` `"id": "quick-panel-align-left",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0029.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0030 — position.align pela porta position.align#menu-arrange-left
- **Tipo:** comando-porta menu `manifest/commands/geometry.json:954` `"kind": "menu",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:953` `"id": "menu-arrange-left",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0030.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0031 — position.align pela porta position.align#command-bar-left
- **Tipo:** comando-porta command-bar `manifest/commands/geometry.json:978` `"kind": "command-bar",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:977` `"id": "command-bar-left",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0031.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0032 — position.align pela porta position.align#quick-panel-align-horizontal-center
- **Tipo:** comando-porta quick-panel `manifest/commands/geometry.json:1001` `"kind": "quick-panel",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1000` `"id": "quick-panel-align-horizontal-center",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0032.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0033 — position.align pela porta position.align#menu-arrange-horizontal-center
- **Tipo:** comando-porta menu `manifest/commands/geometry.json:1026` `"kind": "menu",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1025` `"id": "menu-arrange-horizontal-center",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0033.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0034 — position.align pela porta position.align#command-bar-horizontal-center
- **Tipo:** comando-porta command-bar `manifest/commands/geometry.json:1050` `"kind": "command-bar",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1049` `"id": "command-bar-horizontal-center",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0034.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0035 — position.align pela porta position.align#quick-panel-align-right
- **Tipo:** comando-porta quick-panel `manifest/commands/geometry.json:1073` `"kind": "quick-panel",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1072` `"id": "quick-panel-align-right",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0035.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0036 — position.align pela porta position.align#menu-arrange-right
- **Tipo:** comando-porta menu `manifest/commands/geometry.json:1098` `"kind": "menu",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1097` `"id": "menu-arrange-right",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0036.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0037 — position.align pela porta position.align#command-bar-right
- **Tipo:** comando-porta command-bar `manifest/commands/geometry.json:1122` `"kind": "command-bar",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1121` `"id": "command-bar-right",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0037.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0038 — position.align pela porta position.align#quick-panel-align-top
- **Tipo:** comando-porta quick-panel `manifest/commands/geometry.json:1145` `"kind": "quick-panel",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1144` `"id": "quick-panel-align-top",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0038.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0039 — position.align pela porta position.align#menu-arrange-top
- **Tipo:** comando-porta menu `manifest/commands/geometry.json:1170` `"kind": "menu",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1169` `"id": "menu-arrange-top",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0039.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0040 — position.align pela porta position.align#command-bar-top
- **Tipo:** comando-porta command-bar `manifest/commands/geometry.json:1194` `"kind": "command-bar",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1193` `"id": "command-bar-top",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0040.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0041 — position.align pela porta position.align#quick-panel-align-vertical-center
- **Tipo:** comando-porta quick-panel `manifest/commands/geometry.json:1217` `"kind": "quick-panel",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1216` `"id": "quick-panel-align-vertical-center",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0041.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0042 — position.align pela porta position.align#menu-arrange-vertical-center
- **Tipo:** comando-porta menu `manifest/commands/geometry.json:1242` `"kind": "menu",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1241` `"id": "menu-arrange-vertical-center",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0042.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0043 — position.align pela porta position.align#command-bar-vertical-center
- **Tipo:** comando-porta command-bar `manifest/commands/geometry.json:1266` `"kind": "command-bar",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1265` `"id": "command-bar-vertical-center",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0043.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0044 — position.align pela porta position.align#quick-panel-align-bottom
- **Tipo:** comando-porta quick-panel `manifest/commands/geometry.json:1289` `"kind": "quick-panel",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1288` `"id": "quick-panel-align-bottom",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0044.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0045 — position.align pela porta position.align#menu-arrange-bottom
- **Tipo:** comando-porta menu `manifest/commands/geometry.json:1314` `"kind": "menu",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1313` `"id": "menu-arrange-bottom",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0045.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0046 — position.align pela porta position.align#command-bar-bottom
- **Tipo:** comando-porta command-bar `manifest/commands/geometry.json:1338` `"kind": "command-bar",`
- **Comando:** position.align
- **Porta:** `manifest/commands/geometry.json:1337` `"id": "command-bar-bottom",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0046.md`
- **Requisitos:** REQ-1305

## ENT-P-geometry-0047 — position.distribute pela porta position.distribute#quick-panel-distribute-horizontal
- **Tipo:** comando-porta quick-panel `manifest/commands/geometry.json:1395` `"kind": "quick-panel",`
- **Comando:** position.distribute
- **Porta:** `manifest/commands/geometry.json:1394` `"id": "quick-panel-distribute-horizontal",`
- **Tratador:** `src/app/commands.ts:329` `'position.distribute': distributeCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0047.md`
- **Requisitos:** REQ-1306

## ENT-P-geometry-0048 — position.distribute pela porta position.distribute#menu-arrange-horizontal
- **Tipo:** comando-porta menu `manifest/commands/geometry.json:1420` `"kind": "menu",`
- **Comando:** position.distribute
- **Porta:** `manifest/commands/geometry.json:1419` `"id": "menu-arrange-horizontal",`
- **Tratador:** `src/app/commands.ts:329` `'position.distribute': distributeCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0048.md`
- **Requisitos:** REQ-1306

## ENT-P-geometry-0049 — position.distribute pela porta position.distribute#command-bar-horizontal
- **Tipo:** comando-porta command-bar `manifest/commands/geometry.json:1444` `"kind": "command-bar",`
- **Comando:** position.distribute
- **Porta:** `manifest/commands/geometry.json:1443` `"id": "command-bar-horizontal",`
- **Tratador:** `src/app/commands.ts:329` `'position.distribute': distributeCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0049.md`
- **Requisitos:** REQ-1306

## ENT-P-geometry-0050 — position.distribute pela porta position.distribute#quick-panel-distribute-vertical
- **Tipo:** comando-porta quick-panel `manifest/commands/geometry.json:1467` `"kind": "quick-panel",`
- **Comando:** position.distribute
- **Porta:** `manifest/commands/geometry.json:1466` `"id": "quick-panel-distribute-vertical",`
- **Tratador:** `src/app/commands.ts:329` `'position.distribute': distributeCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0050.md`
- **Requisitos:** REQ-1306

## ENT-P-geometry-0051 — position.distribute pela porta position.distribute#menu-arrange-vertical
- **Tipo:** comando-porta menu `manifest/commands/geometry.json:1492` `"kind": "menu",`
- **Comando:** position.distribute
- **Porta:** `manifest/commands/geometry.json:1491` `"id": "menu-arrange-vertical",`
- **Tratador:** `src/app/commands.ts:329` `'position.distribute': distributeCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0051.md`
- **Requisitos:** REQ-1306

## ENT-P-geometry-0052 — position.distribute pela porta position.distribute#command-bar-vertical
- **Tipo:** comando-porta command-bar `manifest/commands/geometry.json:1516` `"kind": "command-bar",`
- **Comando:** position.distribute
- **Porta:** `manifest/commands/geometry.json:1515` `"id": "command-bar-vertical",`
- **Tratador:** `src/app/commands.ts:329` `'position.distribute': distributeCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0052.md`
- **Requisitos:** REQ-1306

## ENT-P-geometry-0053 — handle.step pela porta handle.step#key-arrow-right-in-canvas-handle
- **Tipo:** comando-porta shortcut `manifest/commands/geometry.json:1575` `"kind": "shortcut",`
- **Comando:** handle.step
- **Porta:** `manifest/commands/geometry.json:1574` `"id": "key-arrow-right-in-canvas-handle",`
- **Gatilho:** `manifest/commands/geometry.json:1577` `"chord": "ArrowRight",` `manifest/commands/geometry.json:1579` `"gesture": "handle-keys",`
- **Tratador:** `src/app/commands.ts:330` `'handle.step': stepHandle,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-geometry-0053.md`
- **Requisitos:** REQ-1307

## ENT-P-geometry-0054 — handle.step pela porta handle.step#key-arrow-up-in-canvas-handle
- **Tipo:** comando-porta shortcut `manifest/commands/geometry.json:1597` `"kind": "shortcut",`
- **Comando:** handle.step
- **Porta:** `manifest/commands/geometry.json:1596` `"id": "key-arrow-up-in-canvas-handle",`
- **Gatilho:** `manifest/commands/geometry.json:1599` `"chord": "ArrowUp",` `manifest/commands/geometry.json:1601` `"gesture": "handle-keys",`
- **Tratador:** `src/app/commands.ts:330` `'handle.step': stepHandle,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-geometry-0054.md`
- **Requisitos:** REQ-1307

## ENT-P-geometry-0055 — handle.step pela porta handle.step#key-arrow-left-in-canvas-handle
- **Tipo:** comando-porta shortcut `manifest/commands/geometry.json:1619` `"kind": "shortcut",`
- **Comando:** handle.step
- **Porta:** `manifest/commands/geometry.json:1618` `"id": "key-arrow-left-in-canvas-handle",`
- **Gatilho:** `manifest/commands/geometry.json:1621` `"chord": "ArrowLeft",` `manifest/commands/geometry.json:1623` `"gesture": "handle-keys",`
- **Tratador:** `src/app/commands.ts:330` `'handle.step': stepHandle,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-geometry-0055.md`
- **Requisitos:** REQ-1307

## ENT-P-geometry-0056 — handle.step pela porta handle.step#key-arrow-down-in-canvas-handle
- **Tipo:** comando-porta shortcut `manifest/commands/geometry.json:1641` `"kind": "shortcut",`
- **Comando:** handle.step
- **Porta:** `manifest/commands/geometry.json:1640` `"id": "key-arrow-down-in-canvas-handle",`
- **Gatilho:** `manifest/commands/geometry.json:1643` `"chord": "ArrowDown",` `manifest/commands/geometry.json:1645` `"gesture": "handle-keys",`
- **Tratador:** `src/app/commands.ts:330` `'handle.step': stepHandle,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-geometry-0056.md`
- **Requisitos:** REQ-1307

## ENT-P-geometry-0057 — canvas.setEditMode pela porta canvas.setEditMode#quick-panel-edit-on-canvas
- **Tipo:** comando-porta quick-panel `manifest/commands/geometry.json:1698` `"kind": "quick-panel",`
- **Comando:** canvas.setEditMode
- **Porta:** `manifest/commands/geometry.json:1697` `"id": "quick-panel-edit-on-canvas",`
- **Tratador:** `src/app/commands.ts:331` `'canvas.setEditMode': setEditMode,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-geometry-0057.md`
- **Requisitos:** REQ-1308

## ENT-P-geometry-0058 — canvas.setEditMode pela porta canvas.setEditMode#key-escape-in-canvas-edit-mode
- **Tipo:** comando-porta shortcut `manifest/commands/geometry.json:1721` `"kind": "shortcut",`
- **Comando:** canvas.setEditMode
- **Porta:** `manifest/commands/geometry.json:1720` `"id": "key-escape-in-canvas-edit-mode",`
- **Gatilho:** `manifest/commands/geometry.json:1723` `"chord": "Escape",`
- **Tratador:** `src/app/commands.ts:331` `'canvas.setEditMode': setEditMode,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-geometry-0058.md`
- **Requisitos:** REQ-1308
