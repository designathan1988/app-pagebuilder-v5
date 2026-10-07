import { describe, expect, it } from 'vitest';
import { MANIFEST_FILES } from './runtime.ts';

describe('the manifest the editor reads', () => {
  // the editor takes each file as it is (runtime.ts): parsing it by its schema must give it back unchanged — nothing
  // a parse would add or change (no default, no transform)
  it.each(MANIFEST_FILES.map((file) => [file.name, file] as const))('%s reads the same parsed by its schema or taken as it is', (_name, file) => {
    expect(file.schema.parse(file.value)).toStrictEqual(file.value);
  });

  // and the files are checked: a key its schema does not name is refused (the schemas are strict), which the manifest
  // check and this test run
  it('refuses a key no schema names', () => {
    const [first] = MANIFEST_FILES;
    if (first === undefined) throw new Error('no manifest file');
    expect(() => first.schema.parse({ ...(first.value as object), unnamed: true })).toThrow();
  });
});
