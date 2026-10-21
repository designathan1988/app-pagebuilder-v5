# How real visual and document editors verify changes quickly

Notes gathered 2026-10-21. About 18 tool calls. Some primary sources (Figma, Notion, Webflow) published little on editor testing, and the Gaps sections say so.

## 1. How do commercial editors (Figma, Notion, Webflow, Framer, Builder.io, Linear, Canva) verify their editors?

### Takeaway
Figma's documented system is a performance guardrail: a real browser with a real GPU runs on every pull request, with a 10-minute budget. Real-laptop runs are kept for precision and bisecting. Notion buys a recorded-session visual-replay tool instead of hand-writing E2E tests. I found no engineering write-ups on editor testing from Webflow, Framer, Builder.io, Linear or Canva.

### Cited Findings
- **Figma "Keeping Figma Fast" (2023-08-29):**
  - Headless Chromium runs on GPU-enabled VMs on every pull request. It drives full end-to-end scenarios in the browser and is meant to catch large regressions.
  - A small lab of real laptops, including older and low-end machines, is used on demand for bisecting subtle regressions and for day-over-day comparison.
  - Scenarios are of two kinds: local edits and simulated multiplayer changes.
  - Each run produces an HTML report and a CPU profile.
  - — [Figma blog](https://www.figma.com/blog/keeping-figma-fast/)
- **Figma numbers** — [Figma blog](https://www.figma.com/blog/keeping-figma-fast/):
  - The guardrail check must finish in under 10 minutes. It gets there by running dozens of stress scenarios in parallel.
  - Running real hardware on every PR would have needed about 100 identical runners at peak.
  - The VMs use a 20% pass margin because virtualized hardware is noisy.
  - The system went live in October 2022 after about 6 months of work.
  - Example scenarios: thousands of layers edited by 50 multiplayer users, a FigJam file with 5,000 comment pins, and 100 multiplayer editors.
- **Figma lessons:**
  - Cloud VMs reliably catch only large regressions.
  - Testing end to end in the browser, rather than compiled components alone, caught WebGL, CSS layout and React hook problems.
  - An innocent-looking CSS change to a sticky-note animation slowed Safari compositing, and the tests caught it before release.
  - Disabled tests create blind spots.
  - The tests needed upkeep because of flakiness during setup.
  - — [Figma blog](https://www.figma.com/blog/keeping-figma-fast/)
- **Figma Slides:** A podcast episode on Figma Slides lists an "all flags on, all flags off" testing approach and "vibe testing" among its topics. The episode page gives no details. — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/building-figma-slides-with-noah-finer)
- **Figma Fuzzmap:**
  - A former Figma engineer, Jonathan Chan, built "Fuzzmap", which applies AFL-style coverage-guided fuzzing to React front ends to stress-test a UI hands-free. It needed hacks to instrument React and to visualize state machines.
  - At one point Figma's E2E tests ran on a MacBook in a janitor's closet.
  - Source date: 2026-03-25. The page gives no bug counts or speed figures.
  - — [Antithesis BugBash podcast](https://antithesis.com/bugbash/podcast/the-dollar-bet-that-fuzzed-figma/)
- **Figma Client Platform team:** A job posting says the team builds automated client testing and observability frameworks, plus performance benchmarks (CPU, memory, FPS). — [job posting](https://workingnomads.com/jobs/software-engineer-client-platform-figma)
- **Notion (vendor case study, no date):**
  - Notion has more than 400 engineers and a codebase about 13 years old.
  - "A single component can render differently in 10-20 contexts", which made traditional testing "nearly impossible."
  - Building an in-house E2E framework "would've taken multiple quarters."
  - With Meticulous, a tool that records sessions and replays them as screenshot diffs, Notion reports 5-10 bugs caught per week, about 70% coverage of critical frontend functionality, a 30% cut in test-maintenance effort, and about 5 hours saved per engineer per week.
  - Monthly volume: 312,930 flows, 25,342 test runs and 237,596,310 screenshots.
  - These are vendor marketing numbers.
  - — [Meticulous case study](https://www.meticulous.ai/cases/notion)
- **General context:** Spotify's engineering blog says "end to end tests are flaky by nature. Write fewer of them." — [Spotify Engineering, 2019](https://engineering.atspotify.com/2019/11/test-flakiness-methods-for-identifying-and-dealing-with-flaky-tests/)

### Inferences
- Figma splits its checks. A fast, noisy check on every PR has a fixed time budget and a large tolerance. Precise checks on real hardware run on demand or for bisecting. The per-PR check was sized to its budget (dozens of scenarios in parallel, under 10 minutes), not the other way round.
- Notion and Figma (through Fuzzmap) both moved away from hand-written E2E scripts toward generated exploration: recorded user sessions, or coverage-guided fuzzing.

### Gaps
- I found no engineering write-up on editor testing from Webflow, Framer, Builder.io, Linear or Canva. Searches returned only third-party tutorials.
- No source covers Figma's multiplayer correctness testing (as opposed to performance) or rendering pixel tests.
- The Notion figures come only from the vendor. I found no Notion engineering post on the subject.

## 2. How do open-source editors test (Lexical, tldraw, Excalidraw, ProseMirror, VS Code, others)?

### Takeaway
They share a pyramid. Most coverage comes from fast headless tests that drive the editor through an API or simulated pointer and keyboard helpers (jsdom with Vitest or Mocha). A smaller layer runs in a real browser for input and selection, and a thin E2E layer drives the full app. Lexical states the unit suite takes about 20 seconds and keeps one regression test per reported bug.

### Cited Findings
- **Lexical test tiers:**
  - Unit tests run in jsdom with Vitest. They cover most of the API, and the full suite finishes in about 20 seconds.
  - jsdom cannot handle contentEditable, so unit tests use the selection API and commands instead of simulated keystrokes. They can still cover Enter, Tab and arrow commands.
  - Property-based tests use `@lexical/fast-check`, which generates values from each node's serialization schema "to catch bugs that hand-picked defaults would hide."
  - "Browser tests" use Vitest browser mode backed by Playwright, so a real contentEditable covers input, IME and selection. Chromium is the default.
  - E2E tests use Playwright on the full playground in Chromium, Firefox and WebKit, through the UI only. They live in `e2e/` for feature coverage and `regression/` for one test per reported bug.
  - PRs with failing tests are not merged.
  - — [Lexical docs, Testing](https://lexical.dev/docs/testing)
- **Lexical scripts:**
  - Vitest projects: `test-unit`, `test-browser`, `test-integration` and `bench`.
  - Playwright scripts form a matrix of browser × mode: chromium/firefox/webkit × plain, rich, `collab` and `collab-v2`, plus `prod` variants that run against the production build.
  - The collab variants start a `y-websocket` server alongside the tests.
  - There are no scripts named fuzz.
  - — [lexical package.json](https://raw.githubusercontent.com/facebook/lexical/main/package.json)
- **Lexical contributing guide:** The local server must be running for E2E tests. `pnpm run test-e2e-chromium` runs Chromium only. — [Lexical CONTRIBUTING](https://github.com/facebook/lexical/blob/main/CONTRIBUTING.md)
- **tldraw:**
  - Unit and integration tests use Vitest.
  - Integration tests use `TestEditor`, which includes the default shapes and tools. A new instance is created in `beforeEach` and disposed in `afterEach`.
  - It exposes simulated pointer methods such as `editor.pointerDown(x, y)` and `pointerMove`.
  - Core geometry and editor tests live in `packages/editor`. Tests that need the shapes live in `packages/tldraw`.
  - — [tldraw "write-unit-tests" skill, third-party mirror](https://mcpservers.org/th/agent-skills/tldraw/write-unit-tests). This is not the official repo, so verify before relying on it.
  - tldraw does not accept external contributions. — [tldraw CONTRIBUTING](https://raw.githubusercontent.com/tldraw/tldraw/main/CONTRIBUTING.md)
- **Excalidraw:**
  - `packages/excalidraw/tests` holds roughly 70 test files, each named after a feature or interaction (selection, move, rotate, flip, clipboard, history, export, regressionTests, arrowBinding, and others).
  - It also has a `__snapshots__` folder, `helpers`, `fixtures` and `test-utils.ts`.
  - — [GitHub, excalidraw tests](https://github.com/excalidraw/excalidraw/tree/master/packages/excalidraw/tests)
- **ProseMirror:** The 2015 design post on collaborative editing describes step rebasing and mapping but says nothing about how they are tested. — [Marijn Haverbeke, 2015-07-28](https://marijnhaverbeke.nl/blog/collaborative-editing.html)
- **VS Code test layers:**
  - Unit tests (`*.test.ts`) use Mocha with sinon and assert, and run in browser, Electron or Node depending on layering.
  - Integration tests (`*.integrationTest.ts`) cover real external APIs that are slower or more failure-prone.
  - Extension tests run against the built-in extensions.
  - Smoke tests are E2E in a real editor.
  - `ensureNoDisposablesAreLeakedInTestSuite()` finds bugs in both tests and code.
  - `assertSnapshot` writes a snapshot that is verified by hand on the first run.
  - — [VS Code wiki, Writing Tests](https://github.com/microsoft/vscode/wiki/Writing-Tests)
- **Ant Design** uses jest-puppeteer screenshots of each component demo, compared against baselines. — [Ant Design blog](https://ant.design/docs/blog/visual-regression.md)

### Inferences
- The common pattern is a test harness that holds the real editor model plus simulated input: tldraw `TestEditor`, Excalidraw `API`/`mouse`/`Keyboard`/`UI`, Lexical in jsdom. This exercises command handlers and state without a browser, in seconds. A real browser is used only for what jsdom cannot do (contentEditable, IME, layout, GPU).
- Lexical's matrix suggests running a reduced set per change and the full matrix in CI. I did not see the workflow file confirming which runs when.

### Gaps
- I did not read CI workflow files for these projects, so I have no CI durations except Lexical's unit suite (about 20 s) and Figma's budget (under 10 min).
- I did not find test counts for tldraw, Slate, GrapesJS, Craft.js, Puck, CodeMirror, Quill or TipTap. Those repos were not inspected within the call budget.
- I did not confirm whether ProseMirror has randomized tests. It is known to have unit tests on model and transform, but I have no source for that here.
- I did not verify whether Lexical has a dedicated collab fuzzer. The package.json has no fuzz script, and its collab coverage is the E2E matrix with `y-websocket`.

## 3. How do they test undo/redo, selection, serialization round-trip, and editor-vs-export consistency?

### Takeaway
Excalidraw's `history.test.tsx` is the clearest public example. It drives real actions through helpers and asserts on stack depth, element and state fields, and a snapshot checkpoint after every test. Multiplayer is simulated by injecting remote changes that are not recorded in history. Serialization is covered by schema-driven property tests (Lexical) and snapshot tests (Excalidraw restore, VS Code).

### Cited Findings
- **Excalidraw history tests — structure and helpers:**
  - `describe("history")` has a singleplayer group (about 26 tests) and a multiplayer group (about 13), plus binding tests. I read only 100k of the file's 171k characters, so counts are approximate.
  - The helpers are `API` (createElement, updateScene, getUndoStack/getRedoStack, executeAction), `Keyboard` (undo/redo, withModifierKeys), `UI` (clickTool, clickOnTestId) and `mouse` (downAt/moveTo/upAt, select, doubleClickOn).
  - — [excalidraw history.test.tsx](https://raw.githubusercontent.com/excalidraw/excalidraw/master/packages/excalidraw/tests/history.test.tsx)
- **Excalidraw history tests — assertions:**
  - Undo and redo stack lengths are checked after every action, including no-op cases where nothing should be recorded.
  - Element fields are checked with `objectContaining` (isDeleted, colors, points, groupIds, bindings).
  - App state is checked for selection, editingGroupId and selectedGroupIds.
  - An `afterEach` checkpoint snapshots render counts, filtered appState, element counts and per-element snapshots. Nondeterministic fields (`seed`, `versionNonce`) are stripped before the snapshot.
  - Remote edits are injected with `API.updateScene(..., CaptureUpdateAction.NEVER)`. The tests check that undo skips invisible changes, respects remote deletions and rebases onto remote edits.
  - — [excalidraw history.test.tsx](https://raw.githubusercontent.com/excalidraw/excalidraw/master/packages/excalidraw/tests/history.test.tsx)
- **Excalidraw restore:** A commit "add unit tests for restore.ts (#3679)" added snapshot tests of the restore/deserialization path. I saw it on a third-party mirror only. — [mirror commit](https://gitea.maison43.duckdns.org/gilles/excalidraw/src/commit/b595d3fcbab1735da07f683bf3f7f1d5c3a5e5f1)
- **Lexical serialization:** `@lexical/fast-check` generates node values from the serialization schema to catch bugs that hand-picked defaults hide. — [Lexical docs](https://lexical.dev/docs/testing)
- **Selection:** Lexical tests selection in jsdom through the selection API and commands. Real-browser selection is tested in the browser and E2E tiers. — [Lexical docs](https://lexical.dev/docs/testing)
- **Snapshots:** Vitest snapshots are stored in `__snapshots__`. A mismatch should be reviewed, not blindly updated with `-u`. — [Vitest docs](https://vitest.dev/guide/snapshot)

### Inferences
- Excalidraw's `afterEach` checkpoint gives a cheap global invariant check after every test, which turns each feature test into a history and integrity test as well.
- Simulating remote or external writes that must not enter history is how undo correctness is tested without a real multiplayer server.

### Gaps
- I found no public source on how any of these editors test editor-vs-export rendering consistency. Excalidraw has an `export.test.tsx`, but I did not read its contents.
- I found no sourced description of an "incremental render equals a fresh render" check in any editor.

## 4. Which approaches catch the most bugs per second, and which were abandoned as slow or flaky?

### Takeaway
Explicit statements are rare. The sources that exist favor fast headless model and harness tests for the bulk of coverage, regression tests named per bug, and a time-boxed in-browser check. Noisy or flaky layers are kept narrow, given tolerances, or replaced by generated tests.

### Cited Findings
- Lexical keeps most coverage in jsdom unit tests (about 20 s for the full suite) and uses a real browser only for what jsdom cannot do. — [Lexical docs](https://lexical.dev/docs/testing)
- Lexical says schema-generated property tests catch bugs that hand-picked values hide. — [Lexical docs](https://lexical.dev/docs/testing)
- Figma:
  - Cloud VMs are noisy and catch only large regressions, so a 20% margin is applied there and precise measurement moved to real hardware on demand.
  - The per-PR budget is under 10 minutes.
  - End-to-end browser runs caught classes of bugs (WebGL, CSS, React hooks) that component-level tests missed.
  - — [Figma blog](https://www.figma.com/blog/keeping-figma-fast/)
- Notion found that hand-built E2E for a UI with 10-20 render contexts per component was impractical. It moved to auto-generated visual replay and reports 5-10 bugs per week (vendor data). — [Meticulous](https://www.meticulous.ai/cases/notion)
- Figma's front-end work led to coverage-guided UI fuzzing (Fuzzmap) as a hands-free alternative to scripted E2E. — [Antithesis podcast, 2026-03](https://antithesis.com/bugbash/podcast/the-dollar-bet-that-fuzzed-figma/)
- VS Code's leak checker in every suite "can expose bugs in both tests and the code under test", which makes it a cheap, global invariant. — [VS Code wiki](https://github.com/microsoft/vscode/wiki/Writing-Tests)
- Spotify: E2E tests are flaky by nature, so write fewer of them. — [Spotify Engineering](https://engineering.atspotify.com/2019/11/test-flakiness-methods-for-identifying-and-dealing-with-flaky-tests/)
- Octomind attributes many flaky tests to fixed sleeps instead of waiting for readiness. — [Octomind](https://octomind.dev/blog/did-you-break-your-code-or-is-the-test-flaky)

### Inferences
- The common shape across the sources has five parts:
  1. Headless tests over the real editor plus simulated input, taking seconds and run per change.
  2. Global invariants checked automatically after each test (Excalidraw checkpoint, VS Code disposables).
  3. One regression test per reported bug (Lexical `regression/`).
  4. A small real-browser layer for input, layout and GPU, with a time budget.
  5. Generated or exploratory tests (property-based, fuzzing, recorded replays) to find what scripts miss.
- Full cross-browser and production-build matrices (Lexical prod/collab variants) look like CI-only layers, not the per-change loop.

### Gaps
- I found no source with quantitative "bugs per second" comparisons between test layers.
- I found no explicit public post-mortem of an editor team abandoning a test layer for being slow or flaky. Figma's 20% margin and the move to real hardware for precision is the closest.
