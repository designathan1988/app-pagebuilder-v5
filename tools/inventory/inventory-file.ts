// The text of manifest/generated/inventory.json, the same for its writer (tools/inventory/write.ts) and for the
// detector that compares it with the file on disk (tools/runner/model/inventory.test.ts): the features, commands and
// doors, the value fields, the parts of the core store's state, and the interactive elements with their owners. Keys
// in a fixed order, no date, no absolute path.
import { fieldContracts } from '../runner/contracts.ts';
import { generate } from './generate.ts';
import { scanSource } from './ui-scan.ts';

// the parts of the core store's state (src/core/store/store.ts StoreState; auditoria/decisoes.md, DCS-008)
const STORE_PARTS = ['document', 'selection', 'history', 'message', 'confirmation', 'refusal', 'refused', 'ui'];

export function inventoryText(): string {
  const { totals, features } = generate();
  const fields = fieldContracts().map((c) => ({ property: c.property, kind: c.kind, codec: c.codec, registered: c.registered, reachedByStyleSet: c.reachedByStyleSet, structured: c.structured }));
  const interactive = scanSource().map((i) => ({ key: i.key, tag: i.tag, role: i.role, handlers: i.handlers, owner: i.owner }));
  const owners: Record<string, number> = {};
  for (const i of interactive) owners[i.owner] = (owners[i.owner] ?? 0) + 1;
  const inventory = {
    totals: { ...totals, fields: fields.length, interactive: interactive.length },
    features: features.map((f) => ({ id: f.id, built: f.built, commands: f.commands, doors: f.doors, scenarios: f.scenarios })),
    fields,
    state: STORE_PARTS,
    interactive: { owners: Object.fromEntries(Object.entries(owners).sort()), elements: interactive },
  };
  return `${JSON.stringify(inventory, null, 2)}\n`;
}
