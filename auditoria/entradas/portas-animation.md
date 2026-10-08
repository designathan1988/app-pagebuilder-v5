# Portas de comando do domínio animation

Fonte: `manifest/commands/animation.json`. Um bloco por porta.

## ENT-P-animation-0001 — animation.create pela porta animation.create#timeline-new-animation
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:36` `"kind": "panel-control",`
- **Comando:** animation.create
- **Porta:** `manifest/commands/animation.json:35` `"id": "timeline-new-animation",`
- **Tratador:** `src/app/commands.ts:192` `'animation.create': createAnimationCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0001.md`
- **Requisitos:** REQ-0101

## ENT-P-animation-0002 — animation.rename pela porta animation.rename#timeline-animation-name-field
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:99` `"kind": "panel-control",`
- **Comando:** animation.rename
- **Porta:** `manifest/commands/animation.json:98` `"id": "timeline-animation-name-field",`
- **Tratador:** `src/app/commands.ts:193` `'animation.rename': renameAnimationCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0002.md`
- **Requisitos:** REQ-0102

## ENT-P-animation-0003 — animation.delete pela porta animation.delete#timeline-animation-delete
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:155` `"kind": "panel-control",`
- **Comando:** animation.delete
- **Porta:** `manifest/commands/animation.json:154` `"id": "timeline-animation-delete",`
- **Tratador:** `src/app/commands.ts:194` `'animation.delete': deleteAnimationCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0003.md`
- **Requisitos:** REQ-0103

## ENT-P-animation-0004 — animation.addKeyframe pela porta animation.addKeyframe#timeline-add-keyframe
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:218` `"kind": "panel-control",`
- **Comando:** animation.addKeyframe
- **Porta:** `manifest/commands/animation.json:217` `"id": "timeline-add-keyframe",`
- **Tratador:** `src/app/commands.ts:195` `'animation.addKeyframe': addKeyframeCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0004.md`
- **Requisitos:** REQ-0104

## ENT-P-animation-0005 — animation.moveKeyframe pela porta animation.moveKeyframe#panel-drag-keyframe-track
- **Tipo:** comando-porta panel-drag `manifest/commands/animation.json:291` `"kind": "panel-drag",`
- **Comando:** animation.moveKeyframe
- **Porta:** `manifest/commands/animation.json:290` `"id": "panel-drag-keyframe-track",`
- **Gatilho:** `manifest/commands/animation.json:293` `"source": "keyframe",` `manifest/commands/animation.json:294` `"zone": "track",` `manifest/commands/animation.json:295` `"gesture": "keyframe-drag",`
- **Tratador:** `src/app/commands.ts:196` `'animation.moveKeyframe': moveKeyframeCommand,`
- **Início:** `src/editor/input/pointer/panels.ts:86` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, offset, distance: at.x - startX } as never);`
- **Fluxo:** `fluxos/ENT-P-animation-0005.md`
- **Requisitos:** REQ-0105

## ENT-P-animation-0006 — animation.setKeyframeEasing pela porta animation.setKeyframeEasing#timeline-keyframe-easing
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:352` `"kind": "panel-control",`
- **Comando:** animation.setKeyframeEasing
- **Porta:** `manifest/commands/animation.json:351` `"id": "timeline-keyframe-easing",`
- **Tratador:** `src/app/commands.ts:197` `'animation.setKeyframeEasing': setKeyframeEasingCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0006.md`
- **Requisitos:** REQ-0106

## ENT-P-animation-0007 — animation.deleteKeyframe pela porta animation.deleteKeyframe#timeline-keyframe-delete
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:420` `"kind": "panel-control",`
- **Comando:** animation.deleteKeyframe
- **Porta:** `manifest/commands/animation.json:419` `"id": "timeline-keyframe-delete",`
- **Tratador:** `src/app/commands.ts:198` `'animation.deleteKeyframe': deleteKeyframeCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0007.md`
- **Requisitos:** REQ-0107

## ENT-P-animation-0008 — animation.deleteKeyframe pela porta animation.deleteKeyframe#key-delete-in-timeline
- **Tipo:** comando-porta shortcut `manifest/commands/animation.json:446` `"kind": "shortcut",`
- **Comando:** animation.deleteKeyframe
- **Porta:** `manifest/commands/animation.json:445` `"id": "key-delete-in-timeline",`
- **Gatilho:** `manifest/commands/animation.json:448` `"chord": "Delete",`
- **Tratador:** `src/app/commands.ts:198` `'animation.deleteKeyframe': deleteKeyframeCommand,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Fluxo:** `fluxos/ENT-P-animation-0008.md`
- **Requisitos:** REQ-0107

## ENT-P-animation-0009 — animation.setSettings pela porta animation.setSettings#timeline-setting-duration
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:515` `"kind": "panel-control",`
- **Comando:** animation.setSettings
- **Porta:** `manifest/commands/animation.json:514` `"id": "timeline-setting-duration",`
- **Tratador:** `src/app/commands.ts:199` `'animation.setSettings': setAnimationSettingsCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0009.md`
- **Requisitos:** REQ-0108

## ENT-P-animation-0010 — animation.setSettings pela porta animation.setSettings#timeline-setting-delay
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:550` `"kind": "panel-control",`
- **Comando:** animation.setSettings
- **Porta:** `manifest/commands/animation.json:549` `"id": "timeline-setting-delay",`
- **Tratador:** `src/app/commands.ts:199` `'animation.setSettings': setAnimationSettingsCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0010.md`
- **Requisitos:** REQ-0108

## ENT-P-animation-0011 — animation.setSettings pela porta animation.setSettings#timeline-setting-iterations
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:585` `"kind": "panel-control",`
- **Comando:** animation.setSettings
- **Porta:** `manifest/commands/animation.json:584` `"id": "timeline-setting-iterations",`
- **Tratador:** `src/app/commands.ts:199` `'animation.setSettings': setAnimationSettingsCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0011.md`
- **Requisitos:** REQ-0108

## ENT-P-animation-0012 — animation.setSettings pela porta animation.setSettings#timeline-setting-direction
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:620` `"kind": "panel-control",`
- **Comando:** animation.setSettings
- **Porta:** `manifest/commands/animation.json:619` `"id": "timeline-setting-direction",`
- **Tratador:** `src/app/commands.ts:199` `'animation.setSettings': setAnimationSettingsCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0012.md`
- **Requisitos:** REQ-0108

## ENT-P-animation-0013 — animation.setSettings pela porta animation.setSettings#timeline-setting-fill
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:655` `"kind": "panel-control",`
- **Comando:** animation.setSettings
- **Porta:** `manifest/commands/animation.json:654` `"id": "timeline-setting-fill",`
- **Tratador:** `src/app/commands.ts:199` `'animation.setSettings': setAnimationSettingsCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0013.md`
- **Requisitos:** REQ-0108

## ENT-P-animation-0014 — animation.setSettings pela porta animation.setSettings#timeline-setting-timing
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:690` `"kind": "panel-control",`
- **Comando:** animation.setSettings
- **Porta:** `manifest/commands/animation.json:689` `"id": "timeline-setting-timing",`
- **Tratador:** `src/app/commands.ts:199` `'animation.setSettings': setAnimationSettingsCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0014.md`
- **Requisitos:** REQ-0108

## ENT-P-animation-0015 — animation.setSettings pela porta animation.setSettings#timeline-setting-play-state
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:725` `"kind": "panel-control",`
- **Comando:** animation.setSettings
- **Porta:** `manifest/commands/animation.json:724` `"id": "timeline-setting-play-state",`
- **Tratador:** `src/app/commands.ts:199` `'animation.setSettings': setAnimationSettingsCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0015.md`
- **Requisitos:** REQ-0108

## ENT-P-animation-0016 — timeline.show pela porta timeline.show#timeline-animation-row
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:784` `"kind": "panel-control",`
- **Comando:** timeline.show
- **Porta:** `manifest/commands/animation.json:783` `"id": "timeline-animation-row",`
- **Tratador:** `src/app/commands.ts:201` `'timeline.show': showAnimationCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0016.md`
- **Requisitos:** REQ-0109

## ENT-P-animation-0017 — timeline.setPlayhead pela porta timeline.setPlayhead#panel-drag-playhead-ruler
- **Tipo:** comando-porta panel-drag `manifest/commands/animation.json:839` `"kind": "panel-drag",`
- **Comando:** timeline.setPlayhead
- **Porta:** `manifest/commands/animation.json:838` `"id": "panel-drag-playhead-ruler",`
- **Gatilho:** `manifest/commands/animation.json:841` `"source": "playhead",` `manifest/commands/animation.json:842` `"zone": "ruler",` `manifest/commands/animation.json:843` `"gesture": "playhead-drag",`
- **Tratador:** `src/app/commands.ts:200` `'timeline.setPlayhead': setPlayheadCommand,`
- **Início:** `src/editor/input/pointer/panels.ts:78` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, time, distance: at.x - startX } as never);`
- **Fluxo:** `fluxos/ENT-P-animation-0017.md`
- **Requisitos:** REQ-0110

## ENT-P-animation-0018 — timeline.play pela porta timeline.play#timeline-play
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:877` `"kind": "panel-control",`
- **Comando:** timeline.play
- **Porta:** `manifest/commands/animation.json:876` `"id": "timeline-play",`
- **Tratador:** `src/app/commands.ts:202` `'timeline.play': playCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0018.md`
- **Requisitos:** REQ-0111

## ENT-P-animation-0019 — timeline.pause pela porta timeline.pause#timeline-pause
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:921` `"kind": "panel-control",`
- **Comando:** timeline.pause
- **Porta:** `manifest/commands/animation.json:920` `"id": "timeline-pause",`
- **Tratador:** `src/app/commands.ts:203` `'timeline.pause': pauseCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0019.md`
- **Requisitos:** REQ-0112

## ENT-P-animation-0020 — timeline.stop pela porta timeline.stop#timeline-stop
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:965` `"kind": "panel-control",`
- **Comando:** timeline.stop
- **Porta:** `manifest/commands/animation.json:964` `"id": "timeline-stop",`
- **Tratador:** `src/app/commands.ts:204` `'timeline.stop': stopCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0020.md`
- **Requisitos:** REQ-0113

## ENT-P-animation-0021 — timeline.toggleLoop pela porta timeline.toggleLoop#timeline-loop
- **Tipo:** comando-porta panel-control `manifest/commands/animation.json:1009` `"kind": "panel-control",`
- **Comando:** timeline.toggleLoop
- **Porta:** `manifest/commands/animation.json:1008` `"id": "timeline-loop",`
- **Tratador:** `src/app/commands.ts:205` `'timeline.toggleLoop': toggleLoopCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Fluxo:** `fluxos/ENT-P-animation-0021.md`
- **Requisitos:** REQ-0114
