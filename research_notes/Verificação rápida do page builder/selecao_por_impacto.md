# Test impact analysis and selective test execution (running only the tests a change can affect)

Research date: 2026-10-21. Sources were fetched on that date. Vendor numbers are marked as vendor claims.

## 1. Industrial results: Meta, Google, Microsoft, Launchable, Datadog, Develocity

### Takeaway
Measured industrial selection runs between a third and a half of the dependency-selected tests. Missed failures cost between 0% and 5% of individual test failures, and less than 0.1% of faulty changes. Every system adds a safety net: retries to remove flaky failures, always-run sets, falling back to a full run on unknown files, and periodic or post-merge full runs. ML vendors (Launchable, Develocity) report larger savings, but those figures are marketing claims calibrated per project.

### Cited Findings
**Meta / Facebook, Predictive Test Selection (Machalica, Samylkin, Porth, Chandra; arXiv v1 Oct 2018, v2 May 2019; ICSE-SEIP 2019)**
- Deployed in production, it halved the total infrastructure cost of testing changes. It still reports over 95% of individual test failures and over 99.9% of faulty changes. — [arXiv 1810.05286](https://arxiv.org/abs/1810.05286)
- It selects fewer than a third of the tests that build-dependency selection would select (SelectionRate < 0.33 at TestRecall > 0.95 and ChangeRecall > 0.999). Almost 99.9% of the tests selected by build dependencies pass. — [arXiv PDF](https://arxiv.org/pdf/1810.05286)
- The paper defines two metrics. Test recall is the share of individual failures caught. Change recall is the share of faulty changes with at least one failure caught. The authors say the change recall "typically" matters most. — [arXiv PDF](https://arxiv.org/pdf/1810.05286)
- Faulty changes the selection misses are caught later, in the "stabilization" stage. The authors say more faults are found there for other reasons than because selection missed them. — [arXiv PDF](https://arxiv.org/pdf/1810.05286)
- Flakiness:
  - Failures are retried aggressively. A failure counts as real only when every attempt failed.
  - Flaked tests outnumbered real failures by about 4 to 1.
  - A model trained without this de-flaking looked like it reached recall ≈0.9 at a 15% selection rate. Its real recall was ≈0.7, so it would miss three times as many failures as expected.
  - Source: [arXiv PDF](https://arxiv.org/pdf/1810.05286)
- The model is a gradient-boosted decision tree, retrained regularly on recent results. Build-dependency selection exercised up to a quarter of all tests per mobile change. PTS runs "a third" of the transitively dependent tests and catches >99.9% of regressions before trunk. The infrastructure efficiency doubled. — [Meta Engineering blog, 2018-11-21](https://engineering.fb.com/2018/11/21/developer-tools/predictive-test-selection/)

**Google TAP (Memon et al., "Taming Google-Scale Continuous Testing", ICSE-SEIP 2017)**
- Scale: on an average day, TAP runs 13K projects, 800K builds and 150M test runs. Affected sets come from reverse dependencies on changed files and reach 1.6M–4.2M tests per milestone. Delays reached up to 9 h. — [paper PDF](https://huang.isis.vanderbilt.edu/cs8395-f23/paper/google-testing-icse-seip-17.pdf)
- Of 5.5M affected test targets studied (500K CLs, Feb–Mar 2016), only 63K ever failed. 91.3% passed at least once and never failed. Only 1.23% found a real breakage or fix once flakes were removed. More than 99% of the test runs pass or flake. — [same](https://huang.isis.vanderbilt.edu/cs8395-f23/paper/google-testing-icse-seip-17.pdf)
- The paper limited runs by dependency-graph distance (MinDist) from the changed file:
  - MinDist ≤ 10 ran 61% of targets and saved 42% of resources.
  - MinDist ≤ 6 ran 50% of targets and saved 55% of resources.
  - Neither simulation missed a single breakage or fix.
  - Source: [same](https://huang.isis.vanderbilt.edu/cs8395-f23/paper/google-testing-icse-seip-17.pdf)
- Other risk signals were strong. Files changed often or by many authors are much more likely to break; one example in the paper is 97% likely when 15 developers edited the file in 30 days. The authors argue for rerunning such changes sooner or more completely. — [same](https://huang.isis.vanderbilt.edu/cs8395-f23/paper/google-testing-icse-seip-17.pdf)
- Related: "Assessing Transition-based Test Selection Algorithms at Google" (ICSE-SEIP 2019) restates that testing every commit with all impacted tests is too slow and too costly at Google's scale. — [Google Research](https://research.google/pubs/pub48335/)

**Microsoft, Azure Pipelines Test Impact Analysis (VSTest v2)**
- How it works:
  - It selects impacted tests, previously failing tests and newly added tests.
  - It has a "safe fallback": a change TIA can't reason about (for example HTML or CSS, or an unknown file type) runs all tests.
  - A full run can be set to recur periodically, and the docs recommend that setting.
  - A build variable (`DisableTestImpactAnalysis`) forces a full run.
  - Source: [Microsoft Learn (page updated 2026-05-07)](https://learn.microsoft.com/en-us/azure/devops/pipelines/test/test-impact-analysis)
- Scope:
  - Managed .NET only, with tests and app on a single machine. Multi-machine setups, .NET Core and data-driven tests are not supported.
  - JS and other languages need a hand-written dependency map in XML (`TIA.UserMapFile`), which the docs say "can even be approximate".
  - Source: [Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/pipelines/test/test-impact-analysis)
- Recommended validation: run the TIA selection (T1) and then the full suite (T2) in sequence, and check both report the same failures. — [Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/pipelines/test/test-impact-analysis)
- The page publishes no saved-time or missed-failure numbers.

**Launchable, ML predictive selection (vendor claims)**
- "Run 20% of the tests and achieve 90% confidence." Launchable defines confidence as catching about 9 in 10 failing runs, so 90% confidence is not a guarantee. "Up to 90%" time savings is an upper bound. — [Launchable: what is PTS](https://launchableinc.com/what-is-predictive-test-selection); [confidence curve docs](https://help.launchableinc.com/features/predictive-test-selection/requesting-and-running-a-subset-of-tests/choosing-a-subset-optimization-target/how-a-confidence-curve-is-generated/); [blog](https://launchableinc.com/blog/the-right-tests-for-a-code-change-with-test-impact-analysis)
- An "observation mode" lets a team compare predicted subsets against real full runs before rolling selection out. — [Launchable changelog](https://changelog.launchableinc.com/announcements/observe-predictive-test-selection-behavior-before-you-roll-out-launchable)

**Datadog Test Impact Analysis (formerly Intelligent Test Runner)**
- It maps each test to the repo files it covers (per-test code coverage) and skips tests whose covered files did not change. It can reuse results from earlier commits. A change to a "tracked file" (for example a dependency manifest) runs all tests. Tests marked "unskippable" always run. Coverage is collected only when it pays off. — [Datadog how it works](https://docs.datadoghq.com/tests/test_impact_analysis/how_it_works/)
- JS support: Jest ≥24.8, Mocha ≥5.2, Cucumber ≥7, Cypress ≥6.7 (the app must be instrumented and expose `window.__coverage__`) and Vitest ≥1.6. Playwright is not listed. Vitest browser mode, watch mode and typecheck runs are not supported. — [Datadog JS setup](https://docs.datadoghq.com/tests/test_impact_analysis/setup/javascript/)
- No public skip or miss rates were found.

**Gradle Develocity Predictive Test Selection**
- The model learns from Build Scan history (code changes plus test outcomes) and partner data.
- Some tests are always selected: new, changed, recently failed or flaky ones.
- Three profiles trade savings against coverage: Conservative, Standard and Fast.
- It is "calibrated to catch over 99% of non-flaky test task/goal failures".
- It needs 14 days of history and ≥50 executions before it predicts.
- `REMAINING_TESTS` mode is for nightly or pre-release runs of the skipped tests; `RELEVANT_TESTS` is for pre-merge.
- `@MustRun` and include patterns protect critical tests.
- If the server is unreachable, PTS turns off and all tests run.
- A simulator replays history to estimate the % of failures predicted.
- Source: [Develocity PTS manual](https://docs.develocity.ai/predictive-test-selection)
- Vendor-reported savings: "35–70% of test time for most builds", "up to 90%". At Jamf, a DPE talk reported −36% unit and −39% integration test time. At Netflix, 107 days of test time were saved in the first month. — [Gradle](https://gradle.com/gradle-enterprise-solutions/predictive-test-selection/); [DPE speakers](https://dpe.org/speakers2023/brian-stewart/), [DPE session](https://dpe.org/sessions/roberto-perez-alcolea/how-improving-the-testing-experience-goes-beyond-quality-a-developer-productivity-point-of-view/)

### Inferences
- The Meta and Google numbers come from monorepos with millions of tests, where almost every test passes. The economics differ in a single-repo app with hundreds of tests: run cost is lower, and per-file dependency fan-out is higher (a central store touches everything). Expect smaller relative savings from the graph alone.
- Every production system keeps a full-run backstop: Meta's stabilization stage, Google's milestones, Microsoft's periodic runs, Develocity's REMAINING_TESTS. None relies on selection alone.
- Meta's de-flaking result is directly relevant. Without retries to separate flaky failures, the measured recall can be very misleading.

### Gaps
- Google publishes no current (2024–2026) TAP selection rates. The 2017 numbers are a simulation, not production.
- Datadog and Microsoft TIA publish no measured skip or miss rates.
- The Launchable and Develocity numbers have no independent check.

## 2. JS/TS tooling: how each works and its blind spots

### Takeaway
Vitest, Jest and Playwright `--only-changed` select tests through the static import graph from the test file, at file level. Nx and Turborepo select whole packages. Static graphs miss dynamic imports, files read through `fs`, configuration and anything an e2e test reaches through the browser rather than an import. Vitest ≥5.0.4 can record runtime dependencies (`experimental.recordDependencies`), which closes the dynamic-import gap. All tools need explicit "force full run" triggers.

### Cited Findings
**Vitest**
- `vitest related <files>` runs only tests that cover the given source files. It works with static imports but not dynamic ones. Use `--run` in lint-staged so it exits. `--changed [since]` runs tests "affected by the changed files" since the given commit or branch. — [Vitest CLI](https://vitest.dev/guide/cli)
- `forceRerunTriggers` defaults to `['**/package.json', '**/vitest.config.*', '**/vite.config.*']`. When one of these appears in the git diff under `--changed`, the whole suite runs. The docs suggest it for dependencies Vite can't see in the module graph (for example tests that call CLI commands). — [Vitest forceRerunTriggers](https://vitest.dev/config/forcereruntriggers)
- `experimental.recordDependencies`, added in 5.0.4 and off by default:
  - **What it records:** every file each test loaded during a real run. That includes dynamic imports that ran, setup files, mocks, snapshot files and plugin watch files. It stores them in `dependencies.json` in Vite's cacheDir. `--changed` and `related` then use the record instead of the static graph.
  - **When it misses:**
    - files read through `fs` (fixtures);
    - externalized modules;
    - imports hidden behind a `vi.mock` factory;
    - dynamic imports in code the test never ran;
    - a new import committed before the record is refreshed.
  - **When everything runs:**
    - a test with no record runs every time (new tests, browser pool, typecheck pool);
    - a change to global setup, config or `.env` runs every test;
    - Node without `module.registerHooks` writes no records, so everything runs.
  - **No false skips from sharing:** with `isolate: false`, selection can only over-select.
  - Source: [Vitest experimental config](https://vitest.dev/config/experimental)
- `coverage.changed` limits coverage reporting to changed files and inherits from `--changed`. — [Vitest CLI](https://vitest.dev/guide/cli)

**Jest**
- `--findRelatedTests <files>`, `--onlyChanged/-o`, `--changedSince <ref>`, `--lastCommit` and `--changedFilesWithAncestor` exist. `-o` works only in git or hg repos and "requires a static dependency graph (ie. no dynamic requires)". `--watch` runs `-o` by default. — [Jest CLI](https://jestjs.io/docs/cli)

**Playwright**
- `--only-changed [ref]` was added in v1.46. It runs test files changed since the last commit or since a ref, plus test files that import a changed file. With no argument it uses uncommitted changes. It "only supports Git". — [Playwright release notes](https://playwright.dev/docs/release-notes); [Playwright CLI](https://playwright.dev/docs/test-cli)
- `--last-failed` reruns only the failures, with the path set by `--last-failed-file`. — [Playwright CLI](https://playwright.dev/docs/test-cli)

**Nx / Turborepo (package-level)**
- `nx affected` takes changed files from git, maps them to projects through the project graph, and adds dependent projects. It works at project level by default; `NX_LEGACY_AFFECTED=false` switches to task-level selection from task inputs. Any lock-file change marks every project affected by default (`projectsAffectedByDependencyUpdates`). CI should compare against the last successful commit on main with `fetch-depth: 0`. — [Nx affected](https://nx.dev/ci/features/affected)
- `turbo run --affected` equals `--filter=...[main...HEAD]` and works at package level by default. Task-level selection needs `futureFlags.affectedUsingTaskInputs`. A checkout that is too shallow makes "all packages considered changed". Root files such as `.env` go in `globalDependencies`. — [Turborepo run reference](https://turborepo.dev/docs/reference/run)

### Inferences
- In a single-package app like this repo, Nx and Turborepo add nothing: one package means that package is always "affected". File-level graph tools (Vitest) are the relevant layer.
- **Static graph vs this repo.** Several blind spots matter here:
  - **JSON and i18n files:** `en.json` and `pt-BR.json` are caught only if a test imports them, directly or through a module. Generated files (`tools/gen/generate.ts`) are missed if tests read them through `fs`.
  - **CSS:** imported CSS joins the Vite graph, but layout bugs show up only in browser tests, which Vitest's graph does not connect to.
  - **Config:** `vite.config`, `vitest.config` and `package.json` are in the default `forceRerunTriggers`, but `playwright.config.ts`, `tsconfig` and the lint config are not.
  - **Detectors that read source as text:** detectors under `tools/runner/model/` that read `src/` through `fs` or `glob` are invisible to the import graph. Inferred from Vitest's statement that `fs` reads are not recorded.
- Playwright `--only-changed` follows imports of the test file only. A typical e2e spec drives the built app through a URL and imports no app source, so a change in `src/editor/...` would select no e2e specs. This is inferred from the documented behavior; I found no official statement that names this limitation.

### Gaps
- I found no official Vitest docs on whether `--changed` follows CSS or JSON imports in the static graph. It probably does through Vite's module graph, but this is not confirmed.
- Wallaby (continuous, coverage-based runner) was not researched within the call budget.
- I found no official Playwright doc listing the limits of `--only-changed`.

## 3. Mapping browser/e2e tests to source code

### Takeaway
There are two working approaches. One reads the bundler module graph, as Chromatic TurboSnap does for Storybook stories. The other records per-test runtime coverage, as Datadog does with Cypress plus `window.__coverage__`, or as a custom Playwright V8-coverage map would. For Playwright, no ready-made affected-test selector was found. Teams build one from per-test coverage plus a git diff, or use a hand-written mapping, which Microsoft TIA also supports.

### Cited Findings
- Chromatic TurboSnap combines git history with the Webpack or Vite dependency graph to find affected stories. It captures only those stories and copies baselines for the rest.
  - **Full re-capture triggers:**
    - Storybook config changes;
    - any file imported by `preview.js`;
    - the static dir;
    - `--externals` files;
    - `package.json` changes without a valid lockfile.
  - **Bypassing the graph:**
    - `untraced` lets a team exclude files, but only "after confirming its changes cannot affect rendering";
    - even a comment added to an imported CSS file triggers capture.
  - **Billing:** copied snapshots bill at 0.2.
  - **Graph weaknesses:** circular dependencies hide the true consequences of a change; rebases and squashes break the link to the baseline build.
  - Sources: [Chromatic TurboSnap docs](https://www.chromatic.com/docs/turbosnap/); [search summary of dependency tracing](https://bbc.chromatic.com/docs/turbosnap/dependency-tracing)
- Per-test V8 coverage in Playwright: `@bgotink/playwright-coverage` uses page fixtures to record V8 JS coverage and attaches it to each test without instrumentation. It is described as very experimental, and Chrome's V8 coverage is Chromium-only. — [bgotink/playwright-coverage](https://github.com/bgotink/playwright-coverage); [mxschmitt dev.to](https://dev.to/mxschmitt/tracking-frontend-coverage-of-your-e2e-tests-with-playwright-5126)
- Datadog's per-test coverage for Cypress requires the app to be instrumented. Playwright is not supported. — [Datadog JS setup](https://docs.datadoghq.com/tests/test_impact_analysis/setup/javascript/)
- Microsoft TIA accepts a custom test-to-dependency map, and the map "can even be approximate", to cover JS or multi-machine cases. — [Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/pipelines/test/test-impact-analysis)

### Inferences
Inferred approach for this repo (TS + Vite + Vitest + Playwright):
- **Unit and detector layer:** use `vitest --changed origin/<base>` or `vitest related`, with `experimental.recordDependencies` if Vitest ≥5.0.4 is installed. Extend `forceRerunTriggers` with:
  - `playwright.config.ts`
  - `tsconfig*.json`
  - `src/i18n/locales/*.json` (if tests read them through `fs`)
  - the mutant catalog
  - the generator outputs
- **E2E layer:**
  1. Record a map per spec. Use `page.coverage.startJSCoverage()` (Chromium) in the shared fixture `tests/support/test.ts`, resolve the URLs to `src/` files through the Vite dev server or source maps, and write `spec → [src files]`. CSS needs `startCSSCoverage` or a rule that a CSS change in a component folder selects that folder's specs.
  2. Select specs whose files intersect `git diff --name-only <base>`.
  3. Escalate to all specs on changes in global CSS or tokens, the i18n JSON, configs, `package.json` or the lockfile, the shared fixtures in `tests/support/`, or an unmapped file. This mirrors Microsoft's "unknown file → run all" rule.
- **Stale maps:** a coverage map goes stale as code changes. Like Vitest's recorder, regenerate it on every full run, and always run new or changed spec files.

### Gaps
- I found no published measurement (time saved, misses) for coverage-based Playwright e2e selection in a Vite app.
- How well TurboSnap's Vite-graph approach transfers to Playwright specs is inferred, not documented.

## 4. Academic RTS: safety and time savings

### Takeaway
Dynamic file-level RTS (Ekstazi) cut end-to-end test time by 32% on average (54% on long suites) across 32 projects, and is considered safe under its assumptions. Static class-level RTS (STARTS) is comparable in time but can be unsafe. Reflection was the only observed cause, and the reflection-aware fixes cost a lot. Coarse file-level dependencies plus a safe fallback win in practice over fine-grained precision.

### Cited Findings
- Ekstazi (Gligoric, Eloussi, Marinov; ISSTA 2015, Distinguished Paper) tracks dynamic file dependencies per test class. On 615 revisions of 32 projects (~5M LOC), it reduced end-to-end time by 32% on average and by 54% for long-running suites. It beat finer-grained RTS on end-to-end time even though it selected more tests. — [Ekstazi abstract](https://users.ece.utexas.edu/~gligoric/papers/abstracts/GligoricETAL15Ekstazi.txt); [Gligoric PhD](https://users.ece.utexas.edu/~gligoric/papers/Gligoric15PhD.pdf)
- Ekstazi#, the .NET port, reduced regression test time by 43.70% on open-source projects. — [Ekstazi# abstract](https://users.ece.utexas.edu/~gligoric/papers/abstracts/VasicETAL17EkstaziSharp.txt)
- Legunsen et al. (FSE 2016) compared static class- and method-level RTS with Ekstazi on 985 revisions of 22 projects. Class-level static RTS was comparable to Ekstazi. "Safe" means selecting every test that may be affected. — [paper PDF](https://mir.cs.illinois.edu/~marinov/publications/LegunsenETAL16StaticRTS.pdf); [abstract](https://archive.cps-vo.org/node/35355)
- Reflection-Aware Static RTS (Shi et al., OOPSLA 2019) found static RTS can be unsafe, missing tests that dynamic RTS selects. Reflection was the only cause observed. Reflection-aware variants improve safety at "very high costs". A hybrid static-dynamic technique runs at 75.8% of RetestAll time but can still be unsafe when tests depend on execution order. — [SPLASH 2019](https://2019.splashcon.org/details/splash-2019-oopsla/68/Reflection-Aware-Static-Regression-Test-Selection)

### Inferences
- In JS/TS, the analogue of Java reflection is dynamic `import()`, string-built paths, `fs` reads, and DOM or CSS coupling through the browser. These are exactly where static graph selection (Vitest, Jest, Playwright `--only-changed`) is unsafe, and where runtime recording (Vitest recordDependencies, per-test coverage) helps.
- Ekstazi's result suggests coarse file-level granularity is the right choice for this repo. Finer-grained (function-level) analysis rarely pays for its overhead.

### Gaps
- I did not re-verify per-project numbers in the full ISSTA paper; the figures come from abstracts.
- I found no academic RTS study specific to JS/TS front-ends or browser e2e tests.

## 5. Pitfalls: false negatives, flaky tests, when to escalate to a full run

### Takeaway
The main risks:
- dependencies the selector can't see (config, assets, `fs`, runtime-only imports);
- stale maps;
- a bad git base (shallow clones, rebases);
- flaky failures that corrupt both selection and its evaluation.

Every mature system runs everything on unknown or global files. It always runs new, changed, recently failed and flaky tests, and keeps a scheduled or pre-release full run to measure and catch misses.

### Cited Findings
- Unknown or unsupported file type → run all tests (Microsoft TIA, e.g. HTML/CSS). Periodic full runs are recommended. Validate with selected-then-full runs. — [Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/pipelines/test/test-impact-analysis)
- A change to tracked files (manifests) runs all tests. Unskippable tests are protected. — [Datadog](https://docs.datadoghq.com/tests/test_impact_analysis/how_it_works/)
- Always selected: new, changed, recently failed and flaky tests. Skipped tests run later in REMAINING_TESTS (nightly or pre-release). A test that depends on an unselected test fails. Coverage drops under selection, so measure it only on full runs. Infra failures look like misses and should be filtered out. — [Develocity](https://docs.develocity.ai/predictive-test-selection)
- Shallow clones make Turborepo treat everything as changed; Nx needs `fetch-depth: 0` and the last green main commit as base. — [Turborepo](https://turborepo.dev/docs/reference/run); [Nx](https://nx.dev/ci/features/affected)
- Rebases, squashes and force pushes break TurboSnap's baseline link, and circular dependencies hide the consequences of a change. — [Chromatic search summary](https://bbc.chromatic.com/docs/turbosnap/dependency-tracing)
- Vitest's recorded dependencies go stale when an import is committed before the next run. Mocks and uncalled dynamic imports are not recorded. — [Vitest experimental](https://vitest.dev/config/experimental)
- Jest `-o` needs a static graph (no dynamic requires). — [Jest CLI](https://jestjs.io/docs/cli)
- A model trained without de-flaking overstated its recall (0.9 measured vs 0.7 real at a 15% selection rate). — [Meta paper](https://arxiv.org/pdf/1810.05286)
- Google could not use the heuristic "rerun tests that failed recently": it would mostly rerun flaky tests. — [Google TAP paper](https://huang.isis.vanderbilt.edu/cs8395-f23/paper/google-testing-icse-seip-17.pdf)
- Static RTS is unsafe under reflection and under test-order dependencies. — [OOPSLA 2019](https://2019.splashcon.org/details/splash-2019-oopsla/68/Reflection-Aware-Static-Regression-Test-Selection)

### Inferences
Inferred escalation policy for this repo:
- **Run everything when:**
  - a non-TS/JS file outside the mapped set changed;
  - config, the lockfile, `package.json`, the shared test fixtures or the mutant catalog changed;
  - the diff is large (many files or a central module such as a store);
  - the base commit can't be resolved.
- **Always include:** new or changed specs, plus the last failures (`--last-failed`).
- **Keep the full run:** once per stage, as the backstop. It also measures the selection's miss rate: compare the selected run against the full run on the same commit, as Microsoft recommends.
- **Flaky tests:** a test that fails only under load should be retried before it counts as a miss. Otherwise the selection's measured safety rate is noise. This matches the project rule about busy-machine failures.

### Gaps
- I found no published false-negative rate for Vitest `--changed`, Jest `-o` or Playwright `--only-changed` in real projects.
