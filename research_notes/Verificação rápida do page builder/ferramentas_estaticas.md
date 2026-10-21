# Fast static and unit-level checking for TS + React 19 + Vite 8 + Vitest 5 + ESLint 10 (as of 2026-10-21)

Local project context, read from the repository on 2026-10-21 (not a web source): `package.json` pins `typescript ^6.0.3`, `typescript-eslint ^8.70.1`, `eslint ^10.11.0`, `vitest ^5.0.1`, `vite ^8.3.0`, `happy-dom ^20.14.5`. `npm run typecheck` runs three sequential `tsc -p ... --noEmit --incremental` calls (app, node, core). `npm run lint` is `eslint . --max-warnings 0 --cache`. `eslint.config.js` extends `tseslint.configs.strict` (NOT a `*TypeChecked` config, no `projectService`), and loads a local plugin `tools/lint/plugin.ts` (`builder/*` rules: use-ports, pointer-owner, gesture-owner, keyboard-owner, no-manifest-id, frame-owner, no-literal-ui-string, use-tokens, interactive-owner, listener-scope) plus a CSS plugin (`@eslint/css` + `builder-css/use-tokens`). A `test:changed` script (`tools/impact/run.ts`) already exists.

## 1. TypeScript 7 (native Go compiler)

### Takeaway
TS 7.0 went GA on 2026-07-08 and type-checks 8–12x faster on full builds (up to ~17x with `--checkers 8`), with incremental, `--build` and watch all marked done; but it ships with NO programmatic API, so typescript-eslint (and anything that imports `typescript`) must stay on TS 6 until 7.1. The practical 2026 setup is dual install: TS 6 as `typescript` for tooling, TS 7 under an alias for the fast `tsc --noEmit`.

### Cited Findings
- "Announcing TypeScript 7.0", Daniel Rosenwasser, 2026-07-08. Beta 2026-04-21, RC 2026-06-18. Native port in Go, "methodically ported" with type-checking logic structurally identical to 6.0; `tsc` comes from the normal `typescript` npm package. — [TS blog (wp-json of the post)](https://devblogs.microsoft.com/typescript/wp-json/wp/v2/posts/5246); [search summary of the TS blog](https://devblogs.microsoft.com/typescript/?p=5152)
- Official benchmark, TS6 vs TS7 at default `--checkers 4`: vscode 125.7s→10.6s (11.9x); sentry 139.8s→15.7s (8.9x); bluesky 24.3s→2.8s (8.7x); playwright 12.8s→1.47s (8.7x); tldraw 11.2s→1.46s (7.7x). Memory 6–26% lower on all five. Editor time-to-first-error in a VS Code file ~17.5s→<1.3s. — [TS blog](https://devblogs.microsoft.com/typescript/wp-json/wp/v2/posts/5246)
- With `--checkers 8`: vscode 7.51s (16.7x), sentry 12.08s (11.6x), bluesky 2.01s (12.1x), playwright 1.16s (11x), tldraw 1.06s (10.6x). — [TS blog](https://devblogs.microsoft.com/typescript/wp-json/wp/v2/posts/5246)
- Parallelism flags (experimental): `--checkers` (default 4, min 1; more workers = more memory, and varying the count can occasionally surface order-dependent results), `--builders` (parallel project-reference builds under `--build`, multiplies with `--checkers`), `--singleThreaded`. — [TS blog](https://devblogs.microsoft.com/typescript/wp-json/wp/v2/posts/5246); [InfoQ, 2026-08](https://infoq.com/news/2026/08/typescript-7-released/)
- `--watch` was rebuilt on a Go port of Parcel's file watcher ("far fewer resources than polling"). — [TS blog](https://devblogs.microsoft.com/typescript/wp-json/wp/v2/posts/5246)
- microsoft/typescript-go feature table (current): Watch mode Done, Build mode / project references Done, Incremental build Done, Declaration emit Done, JSX Done, LSP "In progress (nearly all)", API "Not ready". For 7.0 RC+ the command is `tsc`, not `tsgo`; development moved to microsoft/TypeScript; repo to be archived September 2026; intentional differences in CHANGES.md. — [microsoft/typescript-go](https://github.com/microsoft/typescript-go)
- Conflict: an older snapshot of the same table (quoted by search results and a third-party analysis) listed watch as a "prototype ... no incremental rechecking. Not optimized". The current repo says Done. — [instagit analysis (secondhand)](https://instagit.com/microsoft/typescript-go/what-are-the-limitations-of-typescript-go); contradicted by [microsoft/typescript-go](https://github.com/microsoft/typescript-go)
- Independent: Better Stack timed Playwright type-check 6.26s (TS 6) vs 0.877s (TS 7 RC), ~7x. — [Better Stack](https://betterstack.com/community/guides/scaling-nodejs/typescript-7-go-rewrite/)
- Field report: Slack CI type-checking ~7.5 min → 1.25 min. — [InfoQ](https://infoq.com/news/2026/08/typescript-7-released/)
- No programmatic API in 7.0; a new, different API expected in 7.1 (releases every 3–4 months, 7.1 focused on API). Blocks typescript-eslint, ts-jest, ts-morph, webpack loaders, and Vue/Svelte/Astro/MDX/Angular template checking. — [TS blog](https://devblogs.microsoft.com/typescript/wp-json/wp/v2/posts/5246); [InfoQ](https://infoq.com/news/2026/08/typescript-7-released/); [ecorpit migration note](https://ecorpit.com/typescript-7-migration-readiness-eslint-astro-blockers-2026/)
- typescript-eslint's published peer range is `<6.1.0`; npm ERESOLVE with typescript@7; forcing it crashes in `typescript-estree`. Issue typescript-eslint#12518 (TS 7.0.2 support) closed "not planned" because the fix is on TypeScript's side (needs 7.1 API). — [dev.to](https://dev.to/dev_encyclopedia/why-your-typescript-7-upgrade-broke-eslint-ts-jest-and-ts-morph-385k)
- Migration from 6: 6.0 deprecations become hard errors in 7.0. Removed: `target: es5`, `downlevelIteration`, `moduleResolution` node/node10/classic, `module` amd/umd/systemjs/none, `baseUrl` (use `paths`), setting `esModuleInterop`/`allowSyntheticDefaultImports`/`alwaysStrict` to false, `module` keyword for namespaces, import `asserts` (use `with`), CLI file paths when a tsconfig.json is in cwd (unless `--ignoreConfig`). New defaults: `strict: true`, `module: esnext`, `target` = latest-minus-esnext, `noUncheckedSideEffectImports: true`, `libReplacement: false`, `stableTypeOrdering: true` (cannot disable), `rootDir: ./`, `types: []`. Team recommends adopting 6.0 first. — [TS blog](https://devblogs.microsoft.com/typescript/wp-json/wp/v2/posts/5246); [InfoQ](https://infoq.com/news/2026/08/typescript-7-released/)
- Official side-by-side install: `npm install -D typescript@npm:@typescript/typescript6` (gives `tsc6` and the 6.0 API to tools), plus alias `"@typescript/native": "npm:typescript@^7.0.2"` for TS7's `tsc`. — [TS blog](https://devblogs.microsoft.com/typescript/wp-json/wp/v2/posts/5246)
- Alternative community setup: keep `typescript@6.x`, add `@typescript/native-preview`, script `"typecheck:fast": "tsgo --noEmit"` as an early CI step. — [dev.to](https://dev.to/dev_encyclopedia/why-your-typescript-7-upgrade-broke-eslint-ts-jest-and-ts-morph-385k); [typescript-go README](https://github.com/microsoft/typescript-go)

### Inferences
- For this repo (TS 6.0.3, three tsconfig projects run sequentially), the cheapest big win is a TS7 alias running the same three checks; expected roughly 8–12x on full checks. Running the three as `tsc --build` over a solution tsconfig with references (or simply in parallel processes) also removes the sequential cost; `--builders` parallelizes references.
- `types` defaulting to `[]` and `rootDir ./` in TS7 can break a TS6-clean config (e.g. missing `vite/client`, `node` types); set `types` explicitly before switching. Running TS6 and TS7 checks side by side for a while catches "type printback"/ordering differences.
- typescript-eslint (used here via `tseslint.configs.strict` and `@typescript-eslint/utils` in the custom plugin) must keep resolving TS 6; the `typescript@npm:@typescript/typescript6` alias is the documented way to do that.

### Gaps
- No official numbers for TS7 incremental (`.tsbuildinfo`) rebuild time or watch recheck latency after a one-file change; only full-build numbers were found.
- No date found for typescript-eslint#12518's closure; could not confirm current peer range directly on typescript-eslint.io.

## 2. Linters: oxlint (+tsgolint), Biome, ESLint 10

### Takeaway
Oxlint is the fastest option with the most ESLint compatibility: type-aware linting (tsgolint, built on TS 7) went stable 2026-07-22 with 59/61 typescript-eslint type-aware rules at 12–18x ESLint speed, and its ESLint-compatible JS plugin API (alpha, 2026-03) can load existing custom rules at 4–100x speedups. Caveats that matter here: JS plugins cannot be type-aware, framework/custom file formats (and so likely CSS-language plugins) have limited support, and Windows has known OOM issues. Biome is fast but custom rules require GritQL rewrites. ESLint 10 itself is fast enough when untyped and cached.

### Cited Findings
- Oxlint type-aware stable (2026-07-22), Apple M4 Pro 12 cores, ESLint+typescript-eslint vs tsgolint with the same TS7-compatible project configs: vscode 83.2s vs 6.96s (12x); typescript 27.2s vs 1.94s (14x); typeorm 13.2s vs 0.75s (18x); vuejs/core 12.3s vs 0.95s (13x). — [oxc.rs blog](https://oxc.rs/blog/2026-07-22-type-aware-linting-stable)
- Coverage: tsgolint v7.0.2000 supports 59 of 61 typescript-eslint type-aware rules (alpha had 43). Versioning `v7.0.2000` = TS 7.0.2 + tsgolint patch 0; tied to a specific TS version. Config: `options.typeAware: true`, `options.typeCheck: true` (also reports TS compiler diagnostics; lint and type check share one TS program); CLI `--type-aware`, `--type-check`, `--debug timings`. — [oxc.rs blog](https://oxc.rs/blog/2026-07-22-type-aware-linting-stable); [InfoQ 2026-09](https://infoq.com/news/2026/09/tsgolint-oxlint-typescript)
- Earlier alpha (2025-12-08, M2 Max): vuejs/core 2.5s vs 20.8s (8x), outline 4.4s vs 55.1s (12x); alpha warned of OOM on very large codebases. — [oxc.rs alpha](https://oxc.rs/blog/2025-12-08-type-aware-alpha)
- Independent small-repo test: `oxlint --type-aware` ~560 ms vs `biome check` ~269 ms (different jobs; type-aware mode adds overhead). — [peterbe.com](https://www.peterbe.com/plog/benchmarking-oxlint-vs-biome)
- Oxlint JS plugins alpha (2026-03-11): Node.js repo, 6,298 files, 104 built-in + 75 JS plugin rules + 23 custom rules: ESLint 1m43s vs Oxlint 21s (4.8x). One user 16x on 2M lines with heavy JS plugin use; light plugin use up to 100x. Conformance: ESLint built-in rules 100% (33,006 tests), react-hooks incl. React Compiler rules 100% (5,007), ESLint Stylistic 99.99%, Testing Library 100%, SonarJS 99.6% (excluding type-aware). — [oxc.rs JS plugins alpha](https://oxc.rs/blog/2026-03-11-oxlint-js-plugins-alpha)
- JS plugin limits: cannot define custom type-aware rules; limited support for custom file formats (Svelte/Vue/Angular); Windows OOM is a known issue (WSL recommended); not subject to semver. Rules use ESLint `create(context)` shape, loaded via `jsPlugins` in `.oxlintrc.json`; faster `createOnce` API via `eslintCompatPlugin` from `@oxlint/plugins`; migration via `npx @oxlint/migrate eslint.config.js`; can run alongside ESLint. — [oxc.rs JS plugins alpha](https://oxc.rs/blog/2026-03-11-oxlint-js-plugins-alpha); [oxc.rs JS plugins docs](https://oxc.rs/docs/guide/usage/linter/js-plugins)
- ESLint multithread linting (`--concurrency`, since v9.34.0, Aug 2025): early testers ~1.30x, one 3.01x; advice: start at half the physical cores, prefer explicit numbers over `auto`, benchmark with hyperfine, combine with `--cache`; heavy plugin init can make many threads slower. — [ESLint blog](https://eslint.org/blog/2025/08/multithread-linting)
- v9.37.0 fixed `--cache` + `--concurrency=auto` starting threads when most results were cached; v9.39.0 merged TIMING reports across threads. — [ESLint v9.37.0](https://eslint.org/blog/2025/10/eslint-v9.37.0-released/); [ESLint v9.39.0](https://eslint.org/blog/2025/10/eslint-v9.39.0-released/)
- ESLint 10 (InfoQ, 2026-04): removed eslintrc, config lookup from each linted file's directory; no cache/threading changes reported. — [InfoQ](https://infoq.com/news/2026/04/eslint-10-release)
- typescript-eslint: ESLint `--cache` is per file and NOT safe with type-aware rules (cross-file type deps aren't tracked); recommendation is not to use `--cache` with typed linting. — [typescript-eslint FAQ](https://typescript-eslint.io/troubleshooting/faqs/eslint/)
- typescript-eslint performance: use `projectService` (solves wide-include problem); avoid `**` in legacy `project`; keep `extraFileExtensions` uniform (else full project reload); drop eslint-plugin-prettier; disable `import/named`, `import/namespace`, `import/default`, `import/no-named-as-default-member`, `import/no-unresolved`; run `import/no-cycle` etc. only in CI; avoid `@stylistic/indent`; typed lint ≈ build time; first type-aware rule seems slowest. — [typescript-eslint perf](https://typescript-eslint.io/troubleshooting/typed-linting/performance/)
- Biome v2 ("Biotype") does type-aware lint rules without the TS compiler; custom rules only via GritQL plugins, "limited in scope" (match snippets, report diagnostics), not all GritQL features supported. — [Biome v2 beta blog](https://biomejs.dev/blog/biome-v2-0-beta/); [InfoQ](https://www.infoq.com/news/2025/06/Biome-Releases-v2-Beta)
- Biome vs ESLint speed claims (10–25x) and oxlint 50–100x come from blogs with unclear methods. — [tech-insider](https://tech-insider.org/eslint-vs-biome-vs-oxlint-2026/); [reintech](https://reintech.io/blog/typescript-biome-vs-eslint-linting-formatting-comparison-2026)

### Inferences
- This repo's ESLint uses no type-aware rules, so its existing `--cache` is safe and the typescript-eslint cache warning does not apply today. Adding `--concurrency <n>` (half the physical cores) is the zero-migration step; measure with hyperfine first.
- The `builder/*` rules are ESLint-shaped JS rules, so oxlint `jsPlugins` could probably load them; the `builder-css/*` rules run on `@eslint/css`, a non-JS language, which the oxlint JS plugin docs don't cover. The low-risk hybrid: oxlint (built-ins + `builder/*` via jsPlugins) for the per-change hook, full ESLint kept as the gate per batch. On Windows, check the OOM caveat.
- Biome would require rewriting the custom rules in GritQL with less expressive power (no access to rule options like `tokens` lists); a poor fit.

### Gaps
- No published benchmark of ESLint 10 vs 9 speed or of `--concurrency` on Windows.
- Did not confirm whether oxlint JS plugins can consume rules that rely on `@typescript-eslint/utils` `RuleCreator` helpers (should be plain ESLint rule objects, but untested).

## 3. Vitest speed

### Takeaway
Vitest 5.0 (2026-09-03) is 8–53% faster than 4.1 depending on pool; the biggest levers are `happy-dom` over `jsdom`, `isolate: false` where tests tolerate shared state, `threads`/`vmThreads`, the now-default `fsModuleCache`, and `vitest related --run` / `--changed` to run only affected tests. `vitest doctor` measures alternative configs on your suite.

### Cited Findings
- Vitest 5.0 vs 4.1.10, Apple M4 10 cores, Node 24, `vitest run` median of 3: micro-utils vmThreads/jsdom 0.61→0.56s (−8%); node-library forks isolated 0.86→0.75s (−13%); deps-heavy vmThreads 1.59→0.74s (−53%); react-spa vmThreads/jsdom 1.25→1.07s (−15%); react-spa Browser Mode 2.40→2.01s (−16%); design-system 80 components vmThreads/jsdom 2.09→1.72s (−18%); barrel-hell 817 modules forks+fsModuleCache 1.33→1.08s (−18%); enterprise-monolith 1,280 modules forks 7.24→5.83s (−19%); long-haul vmForks/happy-dom 5.43→4.06s (−25%); cpu-bound threads 0.91→0.83s (−8%). Environment-dominated setups (forks + jsdom + isolation) within ±3%. — [Vitest 5 blog](https://v5.cn.vitest.dev/blog/vitest-5)
- Vitest 5 mechanisms: `fsModuleCache` stable (was experimental), `sharedViteServer` for inline projects, one round trip for warm modules, vm pools reuse compiled code and prewarm the graph, Browser Mode prebundling/prewarm. Duration line now shows phase percentages. New `vitest doctor` runs the suite under alternative configs and recommends faster options. Breaking: Node ≥22.12, Vite ≥6.4, `clearMocks: true` default, unawaited `resolves`/`rejects` fail, inline projects inherit root config. — [Vitest 5 blog](https://v5.cn.vitest.dev/blog/vitest-5); [OpenReplay](https://blog.openreplay.com/vitest-5-changes/)
- Improving-performance guide: `isolate: false` / `--no-isolate` for side-effect-free projects (per group via `projects`; not possible with `vmThreads`); default pool `forks`, try `threads`; jsdom import ~200–500 ms vs happy-dom ~90–200 ms, happy-dom cheaper in every setup; fastest is `threads` + `isolate: false`; `fsModuleCache` on by default: example >900-module file 8.75s first run → 5.90s second; `NODE_COMPILE_CACHE=<dir>` (auto-off with v8 coverage); `test.dir` to narrow discovery; sharding `--shard=1/3 --reporter=blob` + `--merge-reports` (splits files, not tests); `fileParallelism: false` can help startup in some projects. — [vitest.dev improving performance](https://vitest.dev/guide/improving-performance)
- CLI: `vitest related <files>` runs only tests covering the given source files (static imports only, not dynamic); for lint-staged pass `--run`. `--changed [since]` runs tests affected by changed files. `--passWithNoTests`, `--bail <n>`, `--no-isolate`, `--pool`. — [vitest.dev CLI](https://vitest.dev/guide/cli)
- Vitest vs Jest (secondary sources): 50k-test monorepo 38s vs 214s (5.6x); watch rerun <400 ms (Vitest 4) vs 2–3 s (Jest 30); typical 3–8x on Vite/TS projects. Methodologies weak. — [pkgpulse](https://www.pkgpulse.com/guides/vitest-vs-jest-speed-benchmarks-2026); [qaskills](https://qaskills.sh/blog/vitest-vs-jest-2026)

### Inferences
- This repo's `unit` script runs `vitest run --coverage` (v8): coverage adds cost and disables `NODE_COMPILE_CACHE`; a per-change script should drop coverage and use `vitest related --run --passWithNoTests <changed files>` or `--changed`.
- Detector tests in `tools/runner/model/` are node-environment and likely candidates for `isolate: false` + `threads` via a separate project; run `vitest doctor` to confirm instead of guessing.
- Dynamic imports are invisible to `related`; tests reached only via dynamic import need an explicit mapping (the repo's `tools/impact/run.ts` may already do this).

### Gaps
- No Vitest 5 numbers for Windows; all official numbers are Apple M4.

## 4. Keeping a per-change / pre-commit check under 30 s

### Takeaway
No rigorous hook-manager benchmark exists; the time is dominated by the tools run, not by husky vs lefthook. Use a Go-binary runner (lefthook) with parallel jobs scoped to staged files, run TS7 `tsc --noEmit` (project-wide but ~1 s class), oxlint/ESLint on staged files, and `vitest related --run`; enforce the budget with a wrapper since lefthook documents no timeout option.

### Cited Findings
- Lefthook config exposes `parallel`, `piped`, `glob`, `files`, `stage_fixed`, `fail_text`, `skip`/`only`, `priority`, `jobs`, `group`; no `timeout` option is listed. — [lefthook configuration](https://lefthook.dev/configuration/)
- Lefthook is a Go binary; Husky + lint-staged run on Node (claimed ~1,500 deps); "~10x faster" claim lacks methodology. — [pkgpulse](https://www.pkgpulse.com/guides/husky-vs-lefthook-vs-lint-staged-git-hooks-nodejs-2026); [recca0120 blog, 2026-03-08](https://recca0120.github.io/en/2026/03/08/lefthook-git-hooks/)
- Parallel jobs editing the same files race in lefthook; lint-staged has no file-level coordination either (source: competing tool hk). — [hk: why hk](https://hk.jdx.dev/why-hk)
- lint-staged stashes a backup and restores unstaged changes; v16.2.0 added `--fail-on-changes`. — [jsdocs lint-staged](https://www.jsdocs.io/package/lint-staged)
- `vitest related --run` is the documented lint-staged pattern. — [vitest.dev CLI](https://vitest.dev/guide/cli)
- ESLint advice: run expensive import rules only in CI/on push. — [typescript-eslint perf](https://typescript-eslint.io/troubleshooting/typed-linting/performance/)

### Inferences
- Budget enforcement: wrap each job in a small Node script that spawns the command, kills it and exits non-zero after N seconds (e.g. `AbortSignal.timeout` with `child_process.spawn`), printing elapsed time per step; or on POSIX use `timeout 30s`. On Windows/PowerShell Git Bash's `timeout` is available in the Bash used by Git hooks.
- Typecheck can't be scoped to staged files (TS needs the whole program); with TS7 the full check fits the budget, which is why TS7 is the key enabler.
- Keep mutually-modifying steps (`--fix`) piped, read-only checks parallel.

### Gaps
- No measured numbers for lefthook vs husky startup overhead.

## 5. Fast type-only verification of i18n keys and generated code

### Takeaway
Typed message keys (a union or nested object type derived from the base-locale JSON) are checked by the normal `tsc --noEmit`, so TS7 speeds them for free; the main cost risk is large key unions. Generating a single `.d.ts` from the JSON and checking the generator's output is up to date (`gen:check`-style) is cheaper than importing JSON into types.

### Cited Findings
- i18next pattern: augment `CustomTypeOptions` with `resources` from base-locale JSON (`as const`, `@types` folder); `i18next-resources-for-ts` generates a single resource file; v26.3.0 (May 2026) allows per-package namespace declarations merged by TS. — [i18next TypeScript docs](https://www.i18next.com/overview/typescript); [locize monorepo post](https://www.locize.com/blog/i18next-monorepo-typescript/); [locize i18next-typescript](https://locize.com/blog/i18next-typescript)
- Anecdotal: ~1 s of tsc time per 1,000 typed translation keys; a team dropped i18n typing at ~3k keys over CI memory (single M1 machine, author promotes own library). — [dev.to](https://dev.to/artalar/building-a-lightning-fast-i18n-alternative-why-i-ditched-i18next-for-native-javascript-2o06)
- `tsc --generateTrace` / `--extendedDiagnostics` to find whether key types dominate. — [i18next TypeScript docs](https://www.i18next.com/overview/typescript) (suggested as next step in search synthesis; not a direct quote)

### Inferences
- This repo already generates code from `en.json`/`pt-BR.json` (`node tools/gen/generate.ts`, `gen:check`). A flat string-literal union of keys (not deep template-literal path types) keeps checking cheap; a key-parity check between the two locales is a pure JSON diff and takes milliseconds, no TS needed.
- `gen:check` (regenerate to memory and compare) is the fastest guard for generated code; run it before tsc in the hook so a stale generated file fails in milliseconds.

### Gaps
- No authoritative benchmark of tsc cost per typed i18n key; the only number is anecdotal.
- Nothing found on TS7-specific behavior for huge literal unions.
