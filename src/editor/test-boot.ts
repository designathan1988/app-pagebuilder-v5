// The test boot: in the dev server and the e2e build only (src/main.tsx, behind __BUILDER_TEST_PORT__, which the build
// a person uses drops), a browser test hands the editor, before it starts, the project it opens and the commands that
// set the test's state up — the selection, the language, the theme, the breakpoint, the zoom. The page is opened with
// ?test-boot, and the editor fetches the boot from TEST_BOOT_URL, which the test answers (Playwright's page.route): the
// page itself is the server's own, so the browser treats it as it treats the editor a person opens. The editor runs
// them once, before its first render, through its own store: the same commands the doors run (File › Open runs
// project.open), so the state is the one the doors would reach, without their gestures when the gesture is not what the
// test proves. The gestures themselves are proven by the tests of their doors. A command the store does not run as
// asked is an incident (src/core/incidents.ts), so the test fails at its start, never later on a state it did not have.
import type { CommandId } from '../generated/ids.ts';
import { reportError } from '../core/incidents.ts';
import { openProject } from '../core/project/archive.ts';
import { resolveNode } from '../manifest/scenario.ts';
import type { EditorStore } from './store.ts';

export const TEST_BOOT_PARAM = 'test-boot';
export const TEST_BOOT_URL = '/__builderTestBoot.json';
// what the page's storage held before the editor's first statement (src/main.tsx): a test opens it in a fresh profile
export const STORED_AT_START = '__storedAtStart';

// An argument may name a node by its path of names ("/Page/Hero"), written { "$node": path }: the node is found in
// the document as it stands when the command runs (the empty project's ids are made at its start).
export const NODE_PATH = '$node';
export interface TestBootCommand {
  readonly command: string;
  readonly args: Readonly<Record<string, unknown>>;
}
export interface TestBoot {
  // the text of a project file, opened as File › Open opens it (project.open)
  readonly project?: string;
  // the commands that follow, in order
  readonly commands?: readonly TestBootCommand[];
  // the commands that read what the editor draws (a zoom keeps the canvas's place on the stage it measures): run once
  // the editor is drawn, two frames after its first render
  readonly drawn?: readonly TestBootCommand[];
}
export interface TestBootResult {
  readonly command: string;
  readonly status: string;
}

// Notes what the page's storage held when the editor starts, before it reads or writes any of it.
export function noteStoredAtStart(target: Window = window): void {
  (target as unknown as Record<string, unknown>)[STORED_AT_START] = { local: target.localStorage.length, session: target.sessionStorage.length };
}

// The boot a test hands the editor, when the page was opened with ?test-boot; the address then loses the parameter, so
// a reload starts from the saved work. A boot the test announced and did not answer is an error, never a silent start.
export async function fetchTestBoot(target: Window = window): Promise<TestBoot | null> {
  const address = new URL(target.location.href);
  if (!address.searchParams.has(TEST_BOOT_PARAM)) return null;
  address.searchParams.delete(TEST_BOOT_PARAM);
  target.history.replaceState(target.history.state, '', address.pathname + address.search + address.hash);
  const answer = await target.fetch(TEST_BOOT_URL);
  if (!answer.ok) throw new Error(`the test boot was announced, and ${TEST_BOOT_URL} answered ${answer.status}`);
  return (await answer.json()) as TestBoot;
}

// Runs the boot's project and commands on the store; what each command ended with, in order.
export function runTestBoot(store: EditorStore, boot: Pick<TestBoot, 'project' | 'commands'>): TestBootResult[] {
  const dispatch = store.dispatch as unknown as (id: CommandId, args: unknown) => { readonly status: string };
  const steps: TestBootCommand[] = [...(boot.project === undefined ? [] : [{ command: openProject.command, args: { file: boot.project } }]), ...(boot.commands ?? [])];
  const results: TestBootResult[] = [];
  for (const step of steps) {
    const args = resolvedArgs(store, step.args);
    if (typeof args === 'string') {
      results.push({ command: step.command, status: 'unresolved' });
      reportError(`the test boot's ${step.command} names no node`, args);
      continue;
    }
    const { status } = dispatch(step.command as CommandId, args);
    results.push({ command: step.command, status });
    if (status !== 'done') {
      const said = store.getState().message;
      reportError(`the test boot's ${step.command} ended ${status}`, `${JSON.stringify(step.args).slice(0, 300)}${said === null ? '' : ` — ${said.key}`}`);
    }
  }
  return results;
}

// the arguments with every node path replaced by the node's id, or why a path names no node
function resolvedArgs(store: EditorStore, args: Readonly<Record<string, unknown>>): Record<string, unknown> | string {
  const out: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(args)) {
    const path = value !== null && typeof value === 'object' && NODE_PATH in value ? (value as Record<string, unknown>)[NODE_PATH] : undefined;
    if (typeof path !== 'string') {
      out[name] = value;
      continue;
    }
    const found = resolveNode(store.getState().document, path.split('/').filter((part) => part !== ''));
    if (typeof found === 'string') return `${path}: ${found}`;
    out[name] = (found.node as { id?: unknown }).id;
  }
  return out;
}

// the frames the canvas's stage keeps one size before the drawn commands measure it, and the most frames waited
const STILL_FRAMES = 3;
const MOST_FRAMES = 120;

// Runs the boot's drawn commands once the editor is drawn, adding what each ended with to `results`: its fonts in (a
// text's width moves what the sidebar and panels leave the stage), and its stage the same size for a few frames (the
// panels laid out), so a zoom keeps the place it keeps when a person picks it from the drawn editor.
export function runDrawnTestBoot(store: EditorStore, boot: TestBoot, results: TestBootResult[], target: Window = window): void {
  const drawn = boot.drawn ?? [];
  if (drawn.length === 0) return;
  let last = '';
  let still = 0;
  let frames = 0;
  const settle = () => {
    const box = target.document.querySelector('[data-canvas-stage]')?.getBoundingClientRect();
    const size = box === undefined ? '' : `${box.left},${box.top},${box.width},${box.height}`;
    still = size !== '' && size === last ? still + 1 : 0;
    last = size;
    frames += 1;
    if (still >= STILL_FRAMES || frames >= MOST_FRAMES) results.push(...runTestBoot(store, { commands: drawn }));
    else target.requestAnimationFrame(settle);
  };
  void target.document.fonts.ready.then(() => target.requestAnimationFrame(settle));
}
