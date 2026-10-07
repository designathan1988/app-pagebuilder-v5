// The order browser tests are declared in, for the independence check (tools/test/independence.ts): E2E_ORDER unset
// keeps each file's own order; "reverse" turns every scope around (a file's tests and describes, each describe's own);
// "shuffle:<seed>" deals each scope in a seeded random order, the same for the same seed. A test that passes in one
// order and fails in another leans on what an earlier test left.
//
// Playwright runs a worker's tests in the order they were declared and offers no order of its own: the `test` every
// spec imports (tests/support/test.ts) holds each scope's declarations — test(), test.skip/fixme/only(title, ...),
// test.describe*(title, ...) — and declares them in the order asked once the scope ends: a describe's at the end of its
// callback, a file's in a microtask after its body (Playwright closes a file's loading a task after its import). Hooks,
// test.use and test.describe.configure apply to their scope whatever the order, and are passed on at once. A test
// declared later is located in this file (Playwright takes a test's location from its caller), so a list of tests
// (--test-list, which matches locations) is not used with an order: a share of the suite is chosen by its files and
// its tags instead (tools/test/independence.ts).

export type Order = { readonly kind: 'declared' } | { readonly kind: 'reverse' } | { readonly kind: 'shuffle'; readonly seed: number };

export function orderOf(value: string | undefined): Order {
  if (value === undefined || value === '') return { kind: 'declared' };
  if (value === 'reverse') return { kind: 'reverse' };
  const shuffle = /^shuffle:(\d+)$/.exec(value);
  if (shuffle !== null) return { kind: 'shuffle', seed: Number(shuffle[1]) };
  throw new Error(`E2E_ORDER must be "reverse" or "shuffle:<seed>", got "${value}"`);
}

// mulberry32: a small seeded generator, enough to deal a list
function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function arrange<T>(items: readonly T[], order: Order): T[] {
  if (order.kind === 'declared') return [...items];
  if (order.kind === 'reverse') return [...items].reverse();
  const next = random(order.seed);
  const dealt = [...items];
  for (let i = dealt.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [dealt[i], dealt[j]] = [dealt[j] as T, dealt[i] as T];
  }
  return dealt;
}

// the declarations a scope holds until it ends
type Declare = () => void;

// `test` declaring in `order`: itself when the order is the declared one
export function ordered<T extends object>(test: T, order: Order): T {
  if (order.kind === 'declared') return test;
  let scope: Declare[] | null = null;
  let fileScope: Declare[] = [];
  const hold = (declare: Declare) => {
    if (scope !== null) {
      scope.push(declare);
      return;
    }
    if (fileScope.length === 0) {
      queueMicrotask(() => {
        const held = fileScope;
        fileScope = [];
        for (const one of arrange(held, order)) one();
      });
    }
    fileScope.push(declare);
  };
  // a describe's callback declares its own scope, in the order asked, before it returns
  const scoped = (body: () => void) => () => {
    const outer = scope;
    scope = [];
    try {
      body();
      for (const one of arrange(scope, order)) one();
    } finally {
      scope = outer;
    }
  };
  // Playwright's own functions are bound to its test type: they are called as they are, at the scope's end
  const declaring = (target: (...args: unknown[]) => unknown, describes: boolean): ((...args: unknown[]) => unknown) =>
    new Proxy(target, {
      apply(fn, self, args: unknown[]) {
        // a title first: a declaration; else a modifier (test.skip(condition)) or a call inside a running test
        if (typeof args[0] !== 'string') return Reflect.apply(fn, self, args);
        const last = args.length - 1;
        const body = args[last];
        const passed = describes && typeof body === 'function' ? [...args.slice(0, last), scoped(body as () => void)] : args;
        hold(() => Reflect.apply(fn, self, passed));
        return undefined;
      },
      get(fn, key, receiver) {
        const value: unknown = Reflect.get(fn, key, receiver);
        // test.describe.serial, .parallel, .only, .skip, .fixme: describes as well; .configure passes on
        if (describes && typeof value === 'function' && ['serial', 'parallel', 'only', 'skip', 'fixme'].includes(String(key))) return declaring(value as (...args: unknown[]) => unknown, true);
        return value;
      },
    });
  const declares = declaring(test as unknown as (...args: unknown[]) => unknown, false);
  return new Proxy(test, {
    apply(_fn, self, args: unknown[]) {
      return Reflect.apply(declares, self, args);
    },
    get(fn, key, receiver) {
      const value: unknown = Reflect.get(fn, key, receiver);
      if (typeof value !== 'function') return value;
      if (key === 'describe') return declaring(value as (...args: unknown[]) => unknown, true);
      if (['skip', 'fixme', 'only', 'fail'].includes(String(key))) return declaring(value as (...args: unknown[]) => unknown, false);
      return value;
    },
  }) as T;
}
