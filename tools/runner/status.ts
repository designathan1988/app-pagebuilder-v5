// The derived status: a Playwright reporter that, after a run, derives each feature's status from the results of its
// scenario tests — passes (every test of every scenario and door passed, or was left out because the fast runner
// proved it on these inputs: balance.ts), fails, or cannot run (it is registered as built, but a scenario of it cannot
// run: the census names why). A registered feature that fails or cannot run fails the whole run. It always says how
// many browser runs the fast runner's record left out, or why it left out none — never silently.
import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { PROVEN_HEADLESS, runRecord } from './balance.ts';
import { FEATURES, blockers, registered } from './scenarios.ts';

export default class StatusReporter implements Reporter {
  private readonly results = new Map<string, { passed: number; failed: number }>();
  private provenHeadless = 0;

  onTestEnd(test: TestCase, result: TestResult): void {
    const feature = test.annotations.find((a) => a.type === 'feature')?.description;
    if (feature === undefined) return;
    const counts = this.results.get(feature) ?? { passed: 0, failed: 0 };
    // a scenario test passes only by passing: a skipped one proves nothing, but for a run the fast runner passed on
    // this very tree, which the browser runner left out (balance.ts)
    const proven = result.status === 'skipped' && test.annotations.some((a) => a.type === PROVEN_HEADLESS);
    if (proven) this.provenHeadless += 1;
    if (result.status === 'passed' || proven) counts.passed += 1;
    else counts.failed += 1;
    this.results.set(feature, counts);
  }

  // async: Playwright takes a new overall status only from a promise
  async onEnd(result: FullResult): Promise<{ status?: FullResult['status'] } | undefined> {
    if (this.results.size === 0) return undefined;
    const tooth = (process.env.TOOTH_COMMANDS ?? '') !== '' || (process.env.TOOTH_MODULE ?? '') !== '';
    const off = tooth ? 'the tooth proof runs every test whole' : process.env.E2E_BALANCE === '0' ? 'E2E_BALANCE=0 asks for every run whole' : null;
    const record = runRecord();
    const none = off ?? (record.proven === null ? record.why : 'no run of this selection was proven');
    console.log(this.provenHeadless > 0 ? `\nfast runner: ${this.provenHeadless} scenario runs left out, proven on these inputs` : `\nfast runner: no scenario run left out, every run whole (${none})`);
    const lines: string[] = [];
    let broken = 0;
    let passing = 0;
    for (const f of FEATURES.filter(registered)) {
      const blocked = blockers(f);
      const counts = this.results.get(f.id);
      if (blocked.length > 0) {
        broken += 1;
        lines.push(`  ${f.id}: cannot run (${blocked.join('; ')})`);
      } else if (counts !== undefined && counts.failed > 0) {
        broken += 1;
        lines.push(`  ${f.id}: fails (${counts.passed} of ${counts.passed + counts.failed} tests)`);
      } else if (counts !== undefined) passing += 1;
    }
    console.log(`features: ${passing} pass, ${broken} fail or cannot run, ${FEATURES.filter(registered).length - passing - broken} not run in this selection`);
    for (const line of lines) console.log(line);
    return broken > 0 && result.status === 'passed' ? { status: 'failed' } : undefined;
  }
}
