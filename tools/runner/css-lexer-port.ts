// The CSS support port the checks without a browser use (the investigation's C5, option B): whether a value is one the
// syntax browsers implement takes for the property, read by CSSTree's lexer as src/manifest/css.ts builds it, in place
// of anyCss (which takes everything), so a check without a browser refuses what the browser would refuse. A var() is
// taken, as a browser takes it when it reads the declaration; what the lexer does not model (the inside of calc(), a
// colour's channels out of range) stays the browser's to tell, in the batch that runs in it.
import type { CssSupport } from '../../src/core/ports/css.ts';
import { matchImplemented } from '../../src/manifest/css.ts';

export const lexerCss: CssSupport = {
  supports: (property, value) => /\bvar\(/i.test(value) || matchImplemented(property, value) === null,
};
