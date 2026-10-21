# Runtime verification for web apps: invariants checked while the app runs, and monitoring of real usage

(Research date: 2026-10-21. Every claim below has its source next to it. Inferences are kept separate from findings.)

## 1. Design by contract and assertions in production: evidence and cost

### Takeaway
One industrial study from Microsoft (2006) found that files with more assertions had significantly fewer faults. Two high-reliability codebases set assertion density by rule: NASA/JPL "Power of 10" and TigerBeetle each require at least two assertions per function on average. SQLite has about 6.7k asserts but turns them off in release builds, because with them on the engine runs about 3x slower. Teams therefore split checks into cheap ones that stay on in production and expensive ones that run only in development.

### Cited Findings
- **Kudrjavets, Nagappan and Ball (ISSRE 2006, MSR-TR-2006-54).** The study covered two commercial Microsoft components whose developers used assertions systematically. Files with higher assertion density had a statistically significant drop in fault density, and the assertions found a large share of the faults in the bug database. The authors also compared assertions against static analysis tools. — [Microsoft Research](https://www.microsoft.com/en-us/research/publication/assessing-the-relationship-between-software-assertions-and-code-qualityan-empirical-investigation/)
- In a Microsoft Research blog post (2009-10-07), the authors summarize the result as a negative correlation: "more assertions and code verifications means fewer bugs". Experience was a confounding factor, because the engineers who used assertions well tended to be experienced. They concluded that *mandating* assertions probably would not work and that a culture of using them is needed. The post gives no numeric coefficients. — [Exploding Software-Engineering Myths](https://www.microsoft.com/en-us/research/blog/exploding-software-engineering-myths/)
- **NASA/JPL Power of 10, rule 5 (Holzmann, 2006).** Code should average at least 2 assertions per function. Assertions must be side-effect free and boolean. A failure must trigger an explicit recovery action, such as returning an error to the caller. An assertion that a static tool can prove always true or always false violates the rule. — [Wikipedia: The Power of 10](https://en.wikipedia.org/wiki/The_Power_of_10:_Rules_for_Developing_Safety-Critical_Code)
- **TigerBeetle TIGER_STYLE.** Code must average at least two assertions per function. Assert arguments, return values, preconditions, postconditions and invariants. The policy has these parts:
  - "Pair assertions": check the same property on two different code paths, for example before writing and after reading.
  - Assert both the positive space (what is expected) and the negative space (what must not happen).
  - Split `assert(a and b)` into separate asserts.
  - Assertions "turn correctness bugs into liveness bugs" and multiply the effectiveness of fuzzing.
  - On corrupt state, the only correct reaction is to crash.
  - Assertions do not replace understanding the code. A fuzzer shows that bugs exist, not that they are absent.

  — [TIGER_STYLE.md](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md)
- **SQLite.** The core has 6,754 `assert()` calls (preconditions, postconditions, loop invariants). They are off in release builds (`NDEBUG`) and on only with `SQLITE_DEBUG`, because the engine runs about 3x slower with them on.
  - `ALWAYS(X)`/`NEVER(X)` mark defensive conditions. In release builds they pass the value through; in tests they assert. The suite runs once under each definition and the results must be identical.
  - The code has 1,184 `testcase()` calls that check, during coverage runs, that a condition was seen both true and false.
  - Test code is 590 times the library size (92,053 KSLOC against 155.8 KSLOC, as of 3.42.0, 2023). The page was updated 2026-04-21.

  — [sqlite.org/testing.html](https://www.sqlite.org/testing.html)

### Inferences
- The evidence supports high assertion density at module boundaries. For a store-based editor, the equivalent is the store's `dispatch`/commit point: check the document after every write. That turns silent corruption into an immediate, visible failure.
- SQLite's 3x slowdown shows why full checking (whole-tree invariants) belongs in dev and test builds. Cheap O(1) or O(changed nodes) checks can stay on in production and report instead of crashing. The `ALWAYS/NEVER` macros model exactly this: an assertion in tests, a value passthrough in release.
- Because of the experience confound, correlation is not causation. There is no randomized evidence.

### Gaps
- I found no numeric effect size in the Kudrjavets paper; the PDF body was not retrieved.
- I found no published measurement of what assertions cost in a JavaScript or browser app.
- TIGER_STYLE does not explicitly say whether assertions stay on in production. The crash-on-corruption stance implies they do.

## 2. Dev-mode invariant checking in frontend frameworks, stores and editors

### Takeaway
The mainstream frontend ecosystem puts its deep checks in development only: React StrictMode, Redux Toolkit's immutability and serializability middleware, and MobX's strictness flags. Production gets compact error codes. Rich-text editors (Slate, Lexical, ProseMirror) go further and enforce schema and normalization invariants at every update in both dev and production. They *repair* the document instead of only flagging it.

### Cited Findings
- **React StrictMode** runs only in development and "do[es] not impact the production build". In dev it does the following:
  - Renders components, `useState`/`useMemo`/`useReducer` initializers and updaters twice to expose impure code.
  - Runs an extra setup and cleanup cycle for every Effect and every ref callback.
  - Warns on deprecated APIs.

  It can wrap part of the tree. — [react.dev StrictMode](https://react.dev/reference/react/StrictMode)
- **Redux Toolkit `getDefaultMiddleware`.** Development gets `[actionCreatorInvariant, immutableStateInvariant, thunk, serializableStateInvariant]`; production gets only `[thunk]`.
  - The immutability check deep-compares state during and between dispatches, and throws with the key path.
  - The serializability check logs functions, Promises and Symbols found in state or actions.

  — [RTK getDefaultMiddleware](https://redux.js.org/toolkit/api/getDefaultMiddleware)
- The immutability middleware prints a warning if a check takes longer than `warnAfter` (default 32 ms). `ignoredPaths` excludes large subtrees. — [RTK immutabilityMiddleware](https://redux.js.org/toolkit/api/immutabilityMiddleware)
- **MobX flags:**
  - `enforceActions` (default `"observed"`) requires state changes to go through actions.
  - `computedRequiresReaction`, `observableRequiresReaction` and `reactionRequiresObservable` are runtime lint checks, recommended for development.
  - The docs warn that `observableRequiresReaction` is noisy under React 19.2+ dev mode.

  — [MobX configuration](https://mobx.js.org/configuration.html)
- **Immer** auto-freezes the trees that `produce` returns, so accidental mutation outside a producer is blocked. Freezing is recursive and can be costly on large data; `setAutoFreeze` toggles it. — [Immer freezing](https://immerjs.github.io/immer/freezing)
- **Slate normalization:**
  - Seven built-in constraints that cannot be turned off, for example: every element has at least one text descendant, adjacent identical text nodes merge, and nodes must be JSON-serializable.
  - Custom rules go in `editor.normalizeNode`. The pattern is one fix per pass, then return; the fix triggers another pass. A fix that does not make the node valid loops forever.
  - `Editor.withoutNormalizing` batches several transforms so they are not normalized in between.

  — [Slate normalizing](https://docs.slatejs.org/concepts/11-normalizing)
- **Lexical node transforms** run after an update and before DOM reconciliation, leaf nodes first and `RootNode` last. They repeat until a fixed point and must check preconditions so they do not dirty nodes forever. — [Lexical transforms](https://lexical.dev/docs/concepts/transforms)
- **Lexical builds.** The production build swaps full error messages for codes, and lexical.dev/docs/error decodes them. The dev build tracks extra debug info and warnings. Mutating an editor state outside an update throws in dev. — [lexical.dev error](https://lexical.dev/docs/error); [Lexical editor state (mirror)](https://mintlify.com/facebook/lexical/concepts/editor-state)
- **React's `invariant()` error-code system** (React 15.2, 2016). A build step collects invariant messages into a JSON file and rewrites production `invariant` calls to numeric IDs with a decoder URL. Dev keeps full messages. — [Introducing React's Error Code System](https://16.reactjs.org/blog/2016/07/11/introducing-reacts-error-code-system.html)

### Inferences
- The reference pattern for a React 19 + TS + Vite editor with a central store:
  - **(a)** A single `assertDocument(doc)` runs after every committed transaction in the store, gated by `import.meta.env.DEV`. It checks schema validity, unique IDs, no orphans, parent/child consistency, and serialization round-trip. This is the RTK model: deep checks in dev, a time-budget warning modeled on `warnAfter`.
  - **(b)** In production, a sampled or incremental version checks only the changed nodes and reports through `captureMessage` instead of throwing.
  - **(c)** Normalization repairs (the Slate/Lexical model) for invariants that can be fixed automatically, and each repair is *also* reported, because a repair that fires means some code path produced bad state.
- React 19 StrictMode's double invocation catches impure reducers, selectors and effects at no cost in production. It should wrap the editor root, including the iframe canvas subtree.
- The minified error code plus decoder pattern keeps production bundles small while invariant messages remain diagnosable.

### Gaps
- Zustand devtools, Vue dev warnings and ProseMirror's `Node.check()` were not verified. The ProseMirror reference page was too large to read in the relevant section.
- I did not confirm whether Slate has a documented iteration cap or Lexical a `$validate` API.

## 3. Self-checks while the app is used: dogfooding, assert-and-report, invariant telemetry

### Takeaway
Public writing about "invariant violations sent to telemetry" in editors is sparse. The concrete public patterns are:
- React and Lexical error codes.
- Figma's data-consistency checkers, which run in development and production.
- Dogfooding behind flags before a staged public rollout.
- Linear's zero-bugs policy, which is a process response to the bugs that surface.

### Cited Findings
- Figma built in-house "consistency checkers" on dbt, Snowflake and Dagster that run verification in both development and production. Per the session description, they have caught bugs and edge cases before those became incidents. These check backend data consistency, not the multiplayer client. — [dbt Summit: How Figma builds a consistent experience with confidence](https://www.getdbt.com/dbt-summit/agenda/how-figma-builds-a-consistent-experience-with-confidence)
- Figma had a 2026-03-06/07 incident in which wrong library publishes produced conflicting variant-property errors, and affected components had to be republished. It is an example of corrupted state that reaches users. — [Figma status](https://status.figma.com/incidents/m9n5ygbwl962)
- Whatnot gates releases to employees first with Statsig flags in production. One feature passed internal dogfooding but caused a significant rise in request timeouts once it reached a small beta group. Dogfooding alone missed it; staged exposure caught it. — [Statsig: Whatnot](https://statsig.com/customers/whatnot)
- Linear's "zero-bugs policy" (Artman and Roman, about 2025-09): low-priority bugs are fixed within 7 days and high-priority within 2. The post argues that fixing a bug costs the same work now or later. The initial backlog was 175 bugs, cleared in three weeks; this figure comes from a secondary summary. — [Linear blog](https://linear.app/blog/zero-bugs-policy); [secondary summary](https://www.plushcap.com/content/linear/blog/linear-why-we-committed-to-a-zero-bugs-policy)
- In Sentry, messages are not captured automatically. `captureMessage(msg, level)`, with `info` as the default level, is the manual path for non-fatal reports such as a failed assertion. — [Sentry JS usage](https://docs.sentry.io/platforms/javascript/usage/)
- Sentry's `reportingObserverIntegration` covers only the browser Reporting API types (crash, deprecation, intervention). It does not cover app invariants, which need their own capture call. — [Sentry ReportingObserver](https://docs.sentry.io/platforms/javascript/configuration/integrations/reportingobserver/)

### Inferences
- For a single-owner page builder, the closest equivalent of "assert and report" is a production invariant hook in the store. Each violation sends a fingerprinted event (invariant id plus action type plus edit context) to an error tracker or a local incident log, and a dev build throws. If the project already has an "incident feed" checked by tests, the same feed can be the production sink.
- Dogfooding (the owner building real sites) plus invariant telemetry catches state-dependent bugs that scripted tests rarely reach.

### Gaps
- I found no public Figma or Notion engineering post on client-side invariant telemetry for the editor.
- I found no public detail on how Meta reports `invariant()` failures internally. Only React's open-source error-code system is documented.
- I found no Linear or Vercel posts on staged-rollout mechanics; the search returned only vendor material.

## 4. Real-usage error monitoring and session replay: tools, metrics, overhead

### Takeaway
Sentry's model is sessions plus crash-free rates per release plus replay, and the vendors publish overhead figures:
- **Sentry:** Replay adds about 36 KB gzipped and about 15% more total blocking time in its own benchmark; LCP and CLS showed no measurable change.
- **LogRocket:** says no main-thread block longer than 5 ms.
- **Datadog:** says replay network use is under 100 kB/min.

Ad blockers can silently drop events unless traffic goes through a same-origin tunnel. Feature-flag platforms can roll back automatically on error thresholds.

### Cited Findings
- **Sentry release health:**
  - Crash-free sessions and crash-free users are tracked per release.
  - Session statuses are healthy, errored (handled errors), crashed, abnormal and unhandled (tracked separately since v25.9.0).
  - In browser JS a session starts on every page load and, in an SPA, on every navigation.
  - Adoption counts sessions and users per release over the last 24 hours.

  — [Sentry release health](https://docs.sentry.io/product/releases/health/)
- **Sentry Replay overhead benchmark** (medians, M1 MacBook Pro, 50 iterations, updated 2023-09-25), comparing no Sentry, the SDK alone, and SDK plus Replay:

  | Metric | No Sentry | SDK only | SDK + Replay |
  |---|---|---|---|
  | LCP | 1599 ms | 1546 ms | 1529 ms |
  | CLS | 0.40 | 0.40 | 0.40 |
  | FID | 1.26 ms | 1.30 ms | 1.50 ms |
  | TBT | 2622 ms | 2663 ms | 3037 ms |
  | Avg memory | 119 MB | 125 MB | 125 MB |
  | Upload | 21 B | 3.84 KB | 272.5 KB |

  The Replay bundle adds about 36 KB gzipped (SDK 7.78.0). A simpler scenario (navigating four settings pages) added about 100 ms of TBT. — [Sentry Replay performance overhead](https://docs.sentry.io/product/explore/session-replay/web/performance-overhead/)
- **LogRocket** offloads processing to a worker. Work that must run on the main thread is split so it "never block[s] it for more than 5 milliseconds". This is a vendor claim. — [LogRocket performance](https://docs.logrocket.com/docs/performance)
- **PostHog** benchmark (2022-08-31, rrweb/MutationObserver, three sites):
  - Short-term memory impact rounded to 0%.
  - MutationRecord added about 0.00043% to a heap of more than 60 MB.
  - Recording requests averaged about 2.8 KB, and the initial DOM snapshot was about 269 KB.

  — [PostHog benchmark](https://posthog.com/blog/session-recording-performance)
- **Datadog Session Replay (browser)** compresses data in a web worker; expected bandwidth is under 100 kB/min. The only published Datadog CPU and size benchmarks are for mobile: on iOS, peak CPU went from 40% to 44%. — [Datadog Session Replay browser](https://docs.datadoghq.com/product_analytics/session_replay/browser); [Datadog iOS SDK performance](https://docs.datadoghq.com/real_user_monitoring/application_monitoring/ios/sdk_performance_impact)
- **Ad blockers** can block the SDK and its endpoints, so error, session and performance data may never arrive. Per Sentry, "the endpoint blockage can only be resolved by using a tunnel". The `tunnel` option (SDK 6.7.0+), with a relative URL such as `/tunnel`, also avoids the CORS preflight. Brave blocks requests even when the user disables blocking for the site. — [Sentry JS troubleshooting](https://docs.sentry.io/platforms/javascript/troubleshooting/)
- **Guarded rollouts:**
  - LaunchDarkly Guarded Releases roll back automatically when error thresholds are crossed. — [SD Times](https://sdtimes.com/softwaredev/launchdarkly-launches-guarded-releases-to-improve-release-confidence-at-every-stage-of-application-rollouts/)
  - Rollbar and LaunchDarkly can turn flags off automatically on new or reactivated errors. — [LaunchDarkly blog](https://launchdarkly.com/blog/announcing-automated-feature-flag-triggers-with-rollbar/)
  - A typical staged rollout goes from 1–5% of users up to 100%. — [Swetrix (secondary)](https://swetrix.com/blog/feature-flags-best-practices)
- Notion runs "hundreds of tests per year" (experiments). Its monitoring is described as weekly queries and ad-hoc dashboards for page errors. This comes from a Vercel customer story, a vendor source. — [Vercel: Notion](https://vercel.com/blog/how-notion-powers-rapid-and-performant-experimentation)

### Inferences
- **Typical cost for a Vite SPA:** error tracking alone adds a few KB of upload and no measurable LCP change. Replay adds about 36 KB gzipped and noticeable extra blocking time when the DOM changes heavily.
- A visual editor that re-renders a canvas iframe mutates the DOM heavily, which is the worst case for replay. To limit the cost:
  - Sample replay sessions, or record only on error (Sentry's replay-on-error buffering exists, but I did not verify it in this research).
  - Exclude the iframe canvas from recording.
- Release health is per release, so it only works if every build carries a release id; Vite can inject one at build time.

### Gaps
- I found no official Datadog *browser* RUM CPU or bundle benchmark, and no LogRocket bundle-size number.
- Sentry's benchmark is from 2023 (SDK 7.x); current v8/v9 numbers were not found.
- I found no data on what share of events ad blockers drop.

## 5. What runtime checks and telemetry catch that tests don't, and what they miss

### Takeaway
Runtime invariants and telemetry cover the *state space real users reach*: unusual sequences, real browsers and extensions, long sessions, real data. Tests cover only the paths someone scripted. Runtime checks are blind to anything not written as an invariant, or not thrown as an error. That includes wrong-but-valid output, layout and visual defects, and lost input that throws no error. Ad blockers and sampling also leave holes. They complement a small, targeted test suite and do not replace it.

### Cited Findings
- **What they catch.** Assertions found "a large percentage of the faults" in Microsoft's bug database. — [MSR](https://www.microsoft.com/en-us/research/publication/assessing-the-relationship-between-software-assertions-and-code-qualityan-empirical-investigation/)
- **What they catch.** StrictMode exists to surface bugs "that already exist but are hard to reproduce in production", such as missing effect cleanup and impure render. — [react.dev](https://react.dev/reference/react/StrictMode)
- **What they catch.** Staged exposure caught a timeout regression that internal dogfooding missed (Whatnot). — [Statsig](https://statsig.com/customers/whatnot)
- **What they catch.** Assertions multiply fuzzing effectiveness: random or generated action sequences plus invariants find bugs without hand-written expected outputs. — [TIGER_STYLE](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md)
- **What they miss.** A fuzzer, or by extension telemetry, "can show that bugs exist but not that they are absent". — [TIGER_STYLE](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md)
- **What they miss.** Sentry captures messages only when the code calls it, so violations nobody coded are invisible. — [Sentry usage](https://docs.sentry.io/platforms/javascript/usage/)
- **What they miss.** Ad blockers can block endpoints, so data is lost silently. — [Sentry troubleshooting](https://docs.sentry.io/platforms/javascript/troubleshooting/)
- **What they miss.** A "healthy" session in Sentry means no errors. A session with silently wrong behavior counts as healthy. — [Sentry release health](https://docs.sentry.io/product/releases/health/)
- **What they miss.** A normalizer that repairs state hides the code path that produced the bad state, unless the repair itself is reported. — [Slate normalizing](https://docs.slatejs.org/concepts/11-normalizing)
- **What they miss.** SQLite still keeps a test suite 590 times its code size alongside its 6.7k asserts; assertions did not replace tests there. — [sqlite.org/testing](https://www.sqlite.org/testing.html)

### Inferences
- **Catches:** document integrity violations (orphans, duplicate IDs, broken references); bad undo/redo state; serialization that does not survive a round trip; differences between an incremental and a full render; impure reducers; and crashes in real browsers. All of these can be cheap invariants at the store commit point, plus a full-render comparison sampled in dev.
- **Misses:** layout overlap and clipping, the wrong language string, a control placed off-window, or an edit recorded in the wrong breakpoint when the result is still schema-valid. Each of these needs an explicit, domain-specific invariant (for example, "the edit context recorded equals the context captured at first keystroke") or a visual or layout check. Generic error monitoring will not see them.
- **Combination with good return on investment (inference):**
  1. Dev and test builds run a deep `assertDocument` after every commit, plus StrictMode.
  2. Production runs cheap, sampled invariants that report.
  3. Error tracking with release tags and a same-origin tunnel.
  4. Replay sampled or on error, with the canvas masked or excluded.
  5. A small set of e2e and layout specs for what invariants cannot express.
  6. Random action sequences ("monkey" fuzzing) through the store, with the invariants as the oracle. This replaces many hand-written expected-output tests.

### Gaps
- I found no empirical study that quantifies the share of defects found by production telemetry versus by tests for web SPAs.
- I found no published data on false-positive and noise rates for invariant telemetry in frontend apps.
