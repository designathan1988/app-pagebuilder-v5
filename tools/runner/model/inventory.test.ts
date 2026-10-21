// The inventory of what the application is made of (the investigation's C1, options A and F): the file
// manifest/generated/inventory.json is the one its writer gives now (tools/inventory/write.ts), every interactive
// element the editor draws has an owner (a door of the manifest, a declared local control, or an entry with its
// reason in tools/lint/interactive-allowed.ts), and every entry of that list still names an element without one. The
// source is read from the disk with the passage of the mutant under run swapped (tools/runner/mutants.ts).
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { inventoryText } from '../../inventory/inventory-file.ts';
import { scanSource } from '../../inventory/ui-scan.ts';
import { INTERACTIVE_ALLOWED } from '../../lint/interactive-allowed.ts';
import { mutatedSource } from '../mutants.ts';

describe('the application inventory', () => {
  it('manifest/generated/inventory.json is what the generator writes now', () => {
    const disk = fs.readFileSync('manifest/generated/inventory.json', 'utf8').replace(/\r\n/g, '\n');
    expect(disk === inventoryText(), 'the inventory on disk is stale: run node tools/inventory/write.ts').toBe(true);
  });

  it('every element the person acts on has an owner, and every exception still names an element without an owner', () => {
    const elements = scanSource('src', (file) => mutatedSource(file, fs.readFileSync(file, 'utf8')));
    const allowed = new Set(INTERACTIVE_ALLOWED.map((entry) => entry.key));
    const nobodys = elements.filter((element) => element.owner === 'none');
    const unowned = nobodys.filter((element) => !allowed.has(element.key)).map((element) => `${element.file}:${element.line} <${element.tag}>`);
    expect(unowned, 'elements with no door, no data-local and no exception with a reason').toEqual([]);
    const held = new Set(nobodys.map((element) => element.key));
    const stale = INTERACTIVE_ALLOWED.filter((entry) => !held.has(entry.key)).map((entry) => entry.key);
    expect(stale, 'exceptions that no longer name an element without an owner').toEqual([]);
    expect(INTERACTIVE_ALLOWED.filter((entry) => entry.reason.trim() === '').map((entry) => entry.key), 'exceptions without a reason').toEqual([]);
  });
});
