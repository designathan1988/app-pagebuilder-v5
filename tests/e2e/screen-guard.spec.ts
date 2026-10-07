// The screen guard's own proof (tests/support/screen-guard.ts, DEC-74): on a page made of each defect it names and,
// beside each, the same thing drawn right, it finds every defect and nothing else — so a test that passes under the
// guard passes because its screen holds, not because the guard is blind.
import { expect, test } from '../support/test.ts';
import { screenFindings } from '../support/screen-guard.ts';

const PAGE = `
<style>
  body { margin: 0; font: 13px/16px sans-serif; }
  .box { position: absolute; }
  .clip { width: 60px; overflow: hidden; white-space: nowrap; }
  .ellipsis { width: 60px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .narrow { width: 50px; }
  button { font: inherit; }
</style>
<div class="box clip" style="left: 10px; top: 10px" id="cut">A name far too long</div>
<div class="box clip" style="left: 10px; top: 40px" id="fits">Short</div>
<div class="box ellipsis" style="left: 10px; top: 70px" id="cut-ellipsis">Another name too long</div>
<div class="box ellipsis" style="left: 10px; top: 100px" title="A named text too long" id="named">A named text too long</div>
<input class="box" role="spinbutton" style="left: 10px; top: 130px; width: 40px" value="12000px" id="cut-value">
<input class="box" style="left: 10px; top: 160px; width: 40px" value="https://example.com/a/rather/long/address.html" id="address">
<label class="box narrow" style="left: 200px; top: 10px" id="wrapped">Two words name</label>
<label class="box" style="left: 200px; top: 60px" id="one-line">One line</label>
<button class="box" style="left: 300px; top: 10px" id="covered">Press me</button>
<div class="box" style="left: 295px; top: 5px; width: 120px; height: 40px; background: #eee" id="cover"></div>
<button class="box" style="left: 300px; top: 80px" id="free">Free</button>
<button class="box" style="left: -40px; top: 220px" id="off">Outside</button>
<div role="menu" class="box" style="left: 300px; top: 130px; width: 120px; height: 40px; background: #ddd"></div>
<button class="box" style="left: 310px; top: 140px" id="under-menu">Under a menu</button>
<div class="box" style="left: 10px; top: 260px; width: 6px; height: 120px" id="strip-holder">
  <button style="position: absolute; inset: 0; padding: 0" id="strip" aria-label="strip"></button>
</div>
<div class="box" style="left: 4px; top: 260px; width: 18px; height: 120px; background: #ccc"></div>
<div class="box" style="left: 100px; top: 260px; width: 300px; height: 8px">
  <button style="position: absolute; inset: 0; padding: 0" id="grip" aria-label="grip"></button>
</div>
<div class="box" style="left: 240px; top: 252px; width: 24px; height: 24px; background: #888"></div>
`;

test('the screen guard finds each defect it names and nothing drawn right', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.setContent(PAGE);
  const found = await page.evaluate(screenFindings, { english: null, allowed: [] });
  // a text cut with no ellipsis, one cut with an ellipsis and its whole text nowhere, a number cut in its field (an
  // address in a text field scrolls as typed text does)
  expect(found.filter((f) => f.kind === 'cut').map((f) => f.text)).toEqual(['A name far too long', 'Another name too long', '12000px']);
  // a name drawn on two lines
  expect(found.filter((f) => f.kind === 'wrapped').map((f) => f.text)).toEqual(['Two words name']);
  // a button under a box that is not a layer, and a strip wholly under another control; a long grip with one control
  // over its middle still takes presses, and a button under an open menu is covered on purpose
  expect(found.filter((f) => f.kind === 'covered').map((f) => f.text.split(' under ')[0])).toEqual(['Press me', 'strip']);
  // a control past the window's edge
  expect(found.filter((f) => f.kind === 'off-window').map((f) => f.text)).toEqual(['Outside']);
});

test('the screen guard reads an English text in a Portuguese interface', async ({ page }) => {
  await page.setContent('<p>Abrir</p><span>Open file</span>');
  const found = await page.evaluate(screenFindings, { english: ['Open file'], allowed: [] });
  expect(found.map((f) => [f.kind, f.text])).toEqual([['english', 'Open file']]);
  // an exception names the elements it covers, with its reason in screen-guard-allowed.ts
  const kept = await page.evaluate(screenFindings, { english: ['Open file'], allowed: [{ kind: 'english', selector: 'span' }] });
  expect(kept).toEqual([]);
});

test('the screen guard reads a modal dialog and a shield over the window as covering on purpose', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  // a dialog marked modal (WAI-ARIA: what lies outside it is inert), its shield fixed over the whole window, a button
  // under the shield and one inside the dialog under a box that is no layer
  await page.setContent(`
    <button style="position: absolute; left: 10px; top: 10px">Behind</button>
    <div style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.3)">
      <div role="dialog" aria-modal="true" style="position: absolute; left: 200px; top: 200px; width: 300px; height: 200px; background: #fff">
        <button style="position: absolute; left: 20px; top: 20px" id="inside">Inside</button>
        <div style="position: absolute; left: 10px; top: 10px; width: 120px; height: 40px; background: #eee"></div>
      </div>
    </div>`);
  const found = await page.evaluate(screenFindings, { english: null, allowed: [] });
  expect(found.filter((f) => f.kind === 'covered').map((f) => f.text.split(' under ')[0])).toEqual(['Inside']);
  // a shield over the window without a modal dialog covers on purpose too
  await page.setContent(`<button style="position: absolute; left: 10px; top: 10px">Behind</button><div style="position: fixed; inset: 0"></div>`);
  expect(await page.evaluate(screenFindings, { english: null, allowed: [] })).toEqual([]);
});

test("the screen guard leaves the project's own words to the person", async ({ page }) => {
  await page.setContent('<span>Home</span><span>Open file</span>');
  const found = await page.evaluate(screenFindings, { english: ['Home', 'Open file'], allowed: [], project: ['Home'] });
  expect(found.map((f) => [f.kind, f.text])).toEqual([['english', 'Open file']]);
});

test('the screen guard reads only what a person sees: no transparent text, no text kept for screen readers', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  // a field's own text made transparent under the face that shows its value, and a name clipped to nothing for
  // screen readers (the compact breakpoint tab's "base")
  await page.setContent(`
    <span style="position: absolute; left: 10px; top: 10px; width: 30px">
      <input style="width: 28px; color: transparent; font: 13px monospace" value="1200px">
    </span>
    <span style="position: absolute; left: 10px; top: 60px; width: 20px; padding: 0 6px; border: 1px solid; overflow: hidden; white-space: nowrap; clip-path: inset(50%)">base layer</span>`);
  expect(await page.evaluate(screenFindings, { english: null, allowed: [] })).toEqual([]);
});

// Each family of defect the guard names, planted beside a twin drawn right (or covered on purpose): the guard must find
// every planted defect (recall) and nothing in the twins (precision), on the editor's real window sizes and in both of
// its languages' lengths.
interface Planted {
  readonly name: string;
  readonly html: string;
  // the findings expected, as "kind: text" (empty: a twin drawn right)
  readonly finds: readonly string[];
  readonly allowed?: readonly { readonly kind: string; readonly selector: string; readonly by?: string }[];
  readonly english?: readonly string[];
}
const PLANTED: readonly Planted[] = [
  { name: 'a text clipped with no ellipsis', html: '<div style="width:60px;overflow:hidden;white-space:nowrap">Exportar o projeto inteiro</div>', finds: ['cut: Exportar o projeto inteiro'] },
  { name: 'a text that fits its box', html: '<div style="width:300px;overflow:hidden;white-space:nowrap">Exportar</div>', finds: [] },
  { name: 'an ellipsis with its whole text nowhere', html: '<div style="width:60px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">Mostrar, esconder ou alternar</div>', finds: ['cut: Mostrar, esconder ou alternar'] },
  { name: "an ellipsis inside a zone of a control whose name holds the whole text", html: '<button title="Mostrar, esconder ou alternar em 0 s" style="width:80px;padding:0"><span data-door="drag-zone"><span style="display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">Mostrar, esconder ou alternar</span></span></button>', finds: [] },
  { name: 'a text taller than the box that clips it', html: '<p style="width:120px;height:16px;overflow:hidden;font:13px/16px sans-serif">Uma explicação longa que não cabe em uma linha só</p>', finds: ['cut: Uma explicação longa que não cabe em uma linha só'] },
  { name: 'a one-line name broken on two lines', html: '<button style="width:70px;font:13px sans-serif">Páginas feitas depois</button>', finds: ['wrapped: Páginas feitas depois'] },
  { name: 'a one-line name on one line', html: '<button style="font:13px sans-serif;white-space:nowrap">Páginas feitas depois</button>', finds: [] },
  { name: 'a control past the window', html: '<button style="position:absolute;left:1250px;top:10px;width:80px">Concluído</button>', finds: ['off-window: Concluído'] },
  { name: 'a control under a box drawn above it', html: '<button style="position:absolute;left:10px;top:10px;width:80px">Aplicar</button><div style="position:absolute;left:5px;top:5px;width:100px;height:40px;z-index:2;background:#ddd"></div>', finds: ['covered: Aplicar'] },
  { name: 'a control under an invisible control that takes its presses', html: '<button style="position:absolute;left:10px;top:10px;width:80px">Salvar</button><button aria-label="nada" style="position:absolute;left:5px;top:5px;width:100px;height:40px;opacity:0">x</button>', finds: ['covered: Salvar'] },
  { name: 'a control under an open menu, covered on purpose', html: '<button style="position:absolute;left:10px;top:10px;width:80px">Salvar</button><div role="menu" style="position:absolute;left:5px;top:5px;width:100px;height:40px;background:#eee"></div>', finds: [] },
  {
    name: 'a control under another of its kind the exceptions allow',
    html: '<button class="stop" aria-label="Parada 1" style="position:absolute;left:10px;top:10px;width:20px;height:20px"></button><button class="stop" aria-label="Parada 2" style="position:absolute;left:10px;top:10px;width:20px;height:20px"></button>',
    finds: [],
    allowed: [{ kind: 'covered', selector: '.stop', by: '.stop' }],
  },
  {
    name: 'a control the exceptions allow under another kind, which they do not',
    html: '<button class="stop" aria-label="Parada 1" style="position:absolute;left:10px;top:10px;width:20px;height:20px"></button><div style="position:absolute;left:5px;top:5px;width:40px;height:40px;z-index:2;background:#ddd"></div>',
    finds: ['covered: Parada 1'],
    allowed: [{ kind: 'covered', selector: '.stop', by: '.stop' }],
  },
  {
    name: 'a text cut in a list scrolled away from it',
    html: '<div style="height:40px;overflow:auto"><div style="height:200px"></div><div style="width:60px;overflow:hidden;white-space:nowrap">Exportar o projeto inteiro</div></div>',
    finds: ['cut: Exportar o projeto inteiro'],
  },
  {
    name: 'a text cut where a box clips it away for good',
    html: '<div style="height:40px;overflow:hidden"><div style="height:200px"></div><div style="width:60px;overflow:hidden;white-space:nowrap">Exportar o projeto inteiro</div></div>',
    finds: [],
  },
  // a panel that scrolls down holds its content across (the Inspector's measured copy widened it by 45 px, D1); a
  // copy measured in a box of no size that clips it adds nothing, as the Inspector's does now
  {
    name: 'a panel that scrolls down and sideways',
    html: '<div aria-label="Painel" style="width:120px;height:60px;overflow-y:auto"><div style="width:240px;height:200px"></div></div>',
    finds: ['sideways: Painel'],
  },
  {
    name: 'a panel that scrolls down whose wider content lies hidden past its side',
    html: '<div aria-label="Painel" style="width:120px;height:60px;overflow-y:auto;overflow-x:hidden;position:relative"><div style="height:200px"></div><span style="position:absolute;top:0;left:0;width:240px;height:10px;visibility:hidden"></span></div>',
    finds: ['sideways: Painel'],
  },
  { name: 'a panel that scrolls down holding its content across', html: '<div aria-label="Painel" style="width:120px;height:60px;overflow-y:auto"><div style="height:200px"></div></div>', finds: [] },
  {
    name: 'a panel that scrolls down with a copy measured in a box of no size that clips it',
    html: '<div aria-label="Painel" style="width:120px;height:60px;overflow-y:auto;position:relative"><div style="height:200px"></div><span style="position:absolute;top:0;left:0;width:0;height:0;overflow:hidden;contain:strict"><span style="position:absolute;top:0;left:0;width:240px;height:10px;visibility:hidden"></span></span></div>',
    finds: [],
  },
  { name: 'an English text left in the Portuguese editor', html: '<span>Abrir</span><button>Export project</button>', finds: ['english: Export project'], english: ['Export project'] },
  { name: 'a Portuguese editor with its own words', html: '<span>Abrir</span><button>Exportar projeto</button>', finds: [], english: ['Export project'] },
];

test('the screen guard finds every planted defect and nothing in its twins drawn right', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  let truePositives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;
  const misses: string[] = [];
  for (const planted of PLANTED) {
    await page.setContent(`<body style="margin:0;font:13px/16px sans-serif">${planted.html}</body>`);
    const found = (await page.evaluate(screenFindings, { english: planted.english ?? null, allowed: planted.allowed ?? [] })).map((f) => `${f.kind}: ${f.text.split(' under ')[0]}`);
    for (const one of found) {
      if (planted.finds.includes(one)) truePositives += 1;
      else {
        falsePositives += 1;
        misses.push(`${planted.name}: found ${one}`);
      }
    }
    for (const one of planted.finds) {
      if (found.includes(one)) continue;
      falseNegatives += 1;
      misses.push(`${planted.name}: missed ${one}`);
    }
  }
  expect(misses).toEqual([]);
  // precision and recall over the catalogue: every defect found, nothing else
  expect({ precision: truePositives / (truePositives + falsePositives), recall: truePositives / (truePositives + falseNegatives) }).toEqual({ precision: 1, recall: 1 });
});
