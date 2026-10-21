// The core journeys of the editor, played on a fresh editor with real gestures (tools/ui/play.ts): open, insert, style,
// drag, undo, typing kept across context changes, breakpoints, the Portuguese editor fitting, and the export. Each
// passes when every expectation of its flow is met and the page records no incident and logs no error.
import { expect, installClock, test } from '../../tests/support/test.ts';
import { openEditor } from '../../tests/support/editor.ts';
import { FLOWS } from '../ui/flows.ts';
import { playFlow } from '../ui/play.ts';

const SMOKE_FLOWS = ['open', 'insert', 'style', 'drag', 'undo', 'typing-safety', 'breakpoints', 'pt-br-fit', 'export'];

for (const name of SMOKE_FLOWS) {
  const flow = FLOWS.find((one) => one.name === name);
  if (flow === undefined) throw new Error(`tools/verify/smoke.spec.ts: no flow named "${name}" in tools/ui/flows.ts`);
  test(`smoke: the ${flow.name} flow plays clean`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await installClock(page);
    await openEditor(page);
    expect(await playFlow(page, flow)).toEqual([]);
  });
}
