// A boolean attribute of elements.json the HTML writes by a word, not by its presence: an ARIA state (aria-hidden) is
// no boolean attribute of HTML, its value is the word true or false and an empty value is not true (WAI-ARIA,
// aria-hidden; MDN, aria-hidden, Values). The model keeps it as the other booleans, true or absent; the output writes
// it as "true" (core/render/output.ts) and the importer reads it by its word (core/import/import.ts), one rule for
// both directions (DEF-0551).
export const writtenByWord = (html: string): boolean => html.startsWith('aria-');

// The values of a word state that leave it off, as Chrome reads them (measured with the accessibility tree of the
// DevTools protocol: "", "false", "FALSE" and "undefined" leave the element exposed; " false ", "true", "yes" and "1"
// hide it): compared ASCII case-insensitively, the spaces kept.
const OFF_WORDS = ['', 'false', 'undefined'];

// What the model keeps for a boolean attribute read from HTML: true, or null for absent. A boolean attribute of HTML
// is on by its presence, whatever its value; a word state is on unless its value is one of the words that leave it off.
export const booleanFromHtml = (html: string, value: string): true | null => (!writtenByWord(html) || !OFF_WORDS.includes(value.replace(/[A-Z]/g, (letter) => letter.toLowerCase())) ? true : null);
