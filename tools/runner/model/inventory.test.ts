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

describe('o inventário da aplicação', () => {
  it('manifest/generated/inventory.json é o que o gerador escreve agora', () => {
    const disk = fs.readFileSync('manifest/generated/inventory.json', 'utf8').replace(/\r\n/g, '\n');
    expect(disk === inventoryText(), 'o inventário em disco está velho: rode node tools/inventory/write.ts').toBe(true);
  });

  it('todo elemento em que a pessoa age tem dono, e toda exceção ainda nomeia um elemento sem dono', () => {
    const elements = scanSource('src', (file) => mutatedSource(file, fs.readFileSync(file, 'utf8')));
    const allowed = new Set(INTERACTIVE_ALLOWED.map((entry) => entry.key));
    const nobodys = elements.filter((element) => element.owner === 'none');
    const unowned = nobodys.filter((element) => !allowed.has(element.key)).map((element) => `${element.file}:${element.line} <${element.tag}>`);
    expect(unowned, 'elementos sem porta, sem data-local e sem exceção com motivo').toEqual([]);
    const held = new Set(nobodys.map((element) => element.key));
    const stale = INTERACTIVE_ALLOWED.filter((entry) => !held.has(entry.key)).map((entry) => entry.key);
    expect(stale, 'exceções que não nomeiam mais um elemento sem dono').toEqual([]);
    expect(INTERACTIVE_ALLOWED.filter((entry) => entry.reason.trim() === '').map((entry) => entry.key), 'exceções sem motivo').toEqual([]);
  });
});
