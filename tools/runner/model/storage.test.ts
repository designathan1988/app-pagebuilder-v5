// What is saved, against corruption and migration (the investigation's C8: "persistence: corruption and migration",
// without a browser). Two readers take a saved project — the file a person opens (src/core/project/archive.ts
// readProject) and the autosaved work restored at start (src/editor/persistence/autosave.ts restoredWork), the second
// reading through the first — and both go through the document's format chain (src/core/document/migrations.ts). The
// rules: whatever arrives, the reader returns a document the model accepts or a refusal with words, never a throw and
// never a half-read document; the chain carries every older version forward to this app's, and refuses a newer one and
// a step it does not have instead of guessing.
import fc from 'fast-check';
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DOCUMENT_VERSION, type DocumentJson } from '../../../src/core/document/model.ts';
import { migrateDocument } from '../../../src/core/document/migrations.ts';
import { validateDocument } from '../../../src/core/document/validate.ts';
import { projectFileText, readProject } from '../../../src/core/project/archive.ts';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import type { CommandId } from '../../../src/generated/ids.ts';
import { restoredWork, type SavedWork } from '../../../src/editor/persistence/autosave.ts';
import { createEditorStore, MODEL_RULES, type EditorStore } from '../../../src/editor/store.ts';
import { fixture } from './harness.ts';
import { lexerCss } from '../css-lexer-port.ts';

const at = (version: number): Record<string, unknown> => ({ ...(fixture('aurora') as unknown as Record<string, unknown>), version });
const problemsOf = (document: DocumentJson): readonly string[] => validateDocument(document, [], MODEL_RULES).map((one) => `${one.path}: ${one.message}`);

describe('what is saved, against corruption and migration', () => {
  it('readProject never throws and only returns a document the model accepts', () => {
    const broken: string[] = [];
    fc.assert(
      fc.property(fc.anything(), (value) => {
        let read: ReturnType<typeof readProject>;
        try {
          read = readProject(value, MODEL_RULES);
        } catch (error) {
          broken.push(`threw with ${JSON.stringify(value)?.slice(0, 60) ?? String(value)}: ${(error as Error).message.slice(0, 60)}`);
          return;
        }
        if ('document' in read) {
          const problems = problemsOf(read.document);
          if (problems.length > 0) broken.push(`accepted a document the model refuses: ${problems[0] ?? ''}`);
        } else if (typeof read.refused?.key !== 'string') {
          broken.push('refused without saying why');
        }
      }),
      { seed: 20261008, numRuns: 400 },
    );
    expect(broken.slice(0, 8), 'reads that threw or accepted what the model refuses').toEqual([]);
  });

  it('a corrupted project is refused with words, and does not crash the reader', () => {
    const page = (fixture('aurora') as unknown as { pages: unknown[] }).pages[0];
    const cases: readonly { readonly what: string; readonly value: unknown }[] = [
      { what: 'no version', value: { pages: [] } },
      { what: 'a non-integer version', value: { version: 2.5, pages: [] } },
      { what: 'version 0', value: { version: 0, pages: [] } },
      { what: 'no pages', value: { version: DOCUMENT_VERSION } },
      { what: 'pages that are not a list', value: { version: DOCUMENT_VERSION, pages: 'x' } },
      { what: 'a page without a tree', value: { version: DOCUMENT_VERSION, pages: [{ id: 'p', name: 'Home', file: 'index.html' }] } },
      { what: 'a tree that is not a node', value: { version: DOCUMENT_VERSION, pages: [{ ...(page as object), tree: 'x' }] } },
      { what: 'a repeated id', value: { version: DOCUMENT_VERSION, pages: [{ ...(page as object), tree: { ...((page as { tree: Record<string, unknown> }).tree), children: [{ id: (page as { tree: { id: string } }).tree.id, type: 'container', children: [] }] } }] } },
      { what: 'a node without a type', value: { version: DOCUMENT_VERSION, pages: [{ ...(page as object), tree: { id: 'a', children: [] } }] } },
      { what: 'a node with only id, attributes and children', value: { version: DOCUMENT_VERSION, pages: [{ ...(page as object), tree: { id: 'a', attributes: {}, children: [{ id: 'b', attributes: {}, children: [] }] } }] } },
      { what: 'a child that is not a node', value: { version: DOCUMENT_VERSION, pages: [{ ...(page as object), tree: { ...((page as { tree: Record<string, unknown> }).tree), children: ['x'] } }] } },
    ];
    const kept: string[] = [];
    for (const one of cases) {
      const read = readProject(one.value, MODEL_RULES);
      if (!('refused' in read)) kept.push(`${one.what} was accepted`);
      else if (typeof read.refused.key !== 'string') kept.push(`${one.what} was refused without words`);
    }
    expect(kept).toEqual([]);
  });

  it('the migration chain covers every version up to the current one, and refuses where there is no step', () => {
    const current = migrateDocument(at(DOCUMENT_VERSION));
    expect(current.ok, 'the document of the current version is read as it is').toBe(true);
    for (let version = 1; version < DOCUMENT_VERSION; version += 1) {
      const migrated = migrateDocument(at(version));
      expect(migrated.ok, `version ${version} is carried forward`).toBe(true);
      if (migrated.ok) {
        expect((migrated.document as { version: number }).version, `version ${version} reaches the current one`).toBe(DOCUMENT_VERSION);
        // carried forward, it is a document the model still accepts
        expect(problemsOf(migrated.document as DocumentJson), `version ${version} migrated is accepted by the model`).toEqual([]);
      }
    }
    expect(migrateDocument(at(DOCUMENT_VERSION + 1)), 'a newer version is refused and not guessed').toEqual({ ok: false, reason: 'newer', version: DOCUMENT_VERSION + 1 });
    expect(migrateDocument(at(1), []), 'a missing step is refused as such').toEqual({ ok: false, reason: 'no-step', version: 1 });
    for (const junk of [null, undefined, 3, 'x', [], true, {}]) expect(migrateDocument(junk).ok, `${String(junk)} is not a document`).toBe(false);
  });

  it('migrating twice gives the same document', () => {
    const once = migrateDocument(at(1));
    expect(once.ok).toBe(true);
    if (!once.ok) return;
    const twice = migrateDocument(once.document);
    expect(twice.ok).toBe(true);
    if (twice.ok) expect(JSON.stringify(twice.document)).toBe(JSON.stringify(once.document));
  });

  it('corrupted saved work does not restore, and what restores the model accepts', () => {
    const document = fixture('aurora');
    const cases: readonly SavedWork[] = [
      { revision: 1, format: 1, document: null, selection: [] },
      { revision: 1, format: 1, document: {}, selection: [] },
      { revision: 1, format: 1, document: { version: DOCUMENT_VERSION }, selection: [] },
      { revision: 1, format: 1, document: { version: DOCUMENT_VERSION + 1, pages: [] }, selection: [] },
      { revision: 1, format: 1, document, selection: 'not a selection' },
      { revision: 1, format: 1, document, selection: ['node that does not exist'] },
      { revision: 1, format: 1, document, selection: [] },
    ];
    const broken: string[] = [];
    for (const one of cases) {
      let restored: ReturnType<typeof restoredWork>;
      try {
        restored = restoredWork(one, MODEL_RULES);
      } catch (error) {
        broken.push(`restoredWork threw: ${(error as Error).message.slice(0, 60)}`);
        continue;
      }
      if (restored === null) continue;
      const problems = problemsOf(restored.document);
      if (problems.length > 0) broken.push(`restored a document the model refuses: ${problems[0] ?? ''}`);
      const selection = validateDocument(restored.document, restored.selection, MODEL_RULES);
      if (selection.length > 0) broken.push(`restored a selection the model refuses: ${selection[0]?.path ?? ''}`);
    }
    // a corrupted document does not restore; the good one does
    expect(restoredWork({ revision: 1, format: 1, document: null, selection: [] }, MODEL_RULES)).toBeNull();
    expect(restoredWork(undefined, MODEL_RULES)).toBeNull();
    expect(restoredWork({ revision: 1, format: DOCUMENT_VERSION, document, selection: ['node that does not exist'] }, MODEL_RULES)?.selection).toEqual([]);
    expect(broken, 'saved work that crashed or restored what the model refuses').toEqual([]);
  });
});

// DCS-001: the saved JSON is the same byte for byte after save, open and save. Every document fixture of the manifest
// and the aurora fixture after a run of real edits, saved by File › Save project through the store (the archive the
// downloads port receives), opened by File › Open project and saved again (DEF-0568: no detector held the rule).
describe('the round-trip serialization (DCS-001)', () => {
  const memory = (): { read(): string | null; write(text: string): void } => ({ read: () => null, write: () => undefined });
  const storeWith = (document: DocumentJson, delivered: Uint8Array[]): EditorStore =>
    createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(1_000_000), ids: sequentialIds('rt'), restored: { document, selection: [] }, ports: { css: lexerCss, readOnly: () => false, downloads: { deliver: (file: { bytes: Uint8Array }) => void delivered.push(file.bytes) } as never }, freeze: true });
  const run = (store: EditorStore, id: string, args: unknown) => (store.dispatch as (i: CommandId, a: unknown) => { status: string })(id as CommandId, args);
  async function savedText(store: EditorStore, delivered: Uint8Array[]): Promise<string> {
    const before = delivered.length;
    run(store, 'project.save', {});
    const bytes = delivered[before];
    if (bytes === undefined) throw new Error('project.save delivered no archive');
    return projectFileText(bytes);
  }
  async function roundTrip(document: DocumentJson, edit: (store: EditorStore) => void = () => undefined): Promise<string | null> {
    const delivered: Uint8Array[] = [];
    const store = storeWith(document, delivered);
    edit(store);
    const first = await savedText(store, delivered);
    const opened = storeWith(fixture('aurora'), delivered);
    const result = run(opened, 'project.open', { file: first });
    if (result.status === 'confirm') opened.answer(true);
    if (opened.getState().refused === true) return `open refused: ${opened.getState().message?.key ?? ''}`;
    const second = await savedText(opened, delivered);
    return first === second ? null : `the bytes changed (${String(first.length)} and ${String(second.length)} characters, first difference at ${String([...first].findIndex((char, i) => char !== second[i]))})`;
  }

  it('every fixture document saved, opened and saved again gives the same project.json', async () => {
    const files = fs.readdirSync('manifest/features/fixtures').filter((name) => name.endsWith('.json'));
    expect(files.length, 'the manifest fixtures').toBeGreaterThan(30);
    const found: string[] = [];
    let documents = 0;
    for (const name of files) {
      const parsed = JSON.parse(fs.readFileSync(`manifest/features/fixtures/${name}`, 'utf8')) as unknown;
      const read = readProject(parsed, MODEL_RULES);
      if (!('document' in read)) continue;
      documents += 1;
      // a file of this version is the document as it was saved (the reader leaves it as it is); an older one, migrated
      const current = (parsed as { version?: unknown }).version === DOCUMENT_VERSION;
      const broken = await roundTrip(current ? (parsed as DocumentJson) : read.document);
      if (broken !== null) found.push(`${name}: ${broken}`);
    }
    expect(documents, 'fixtures that are documents').toBeGreaterThan(20);
    expect(found, 'documents whose project.json changes on the round trip').toEqual([]);
  });

  it('the document after real edits saved, opened and saved again gives the same project.json', async () => {
    const statuses: string[] = [];
    const broken = await roundTrip(fixture('aurora'), (store) => {
      const tree = store.getState().document.pages[0]?.tree;
      const target = tree?.children[0]?.id;
      run(store, 'selection.select', { target });
      for (const [id, args] of [['style.set', { property: 'width', value: '320px' }], ['style.set', { property: 'opacity', value: '0.5' }], ['classes.create', { name: 'ida-volta' }], ['animation.create', { name: 'Entrada' }], ['element.setAttribute', { attribute: 'ariaHidden', value: true }], ['element.duplicate', {}]] as const) statuses.push(`${id}: ${run(store, id, args).status}`);
    });
    expect(statuses.filter((one) => !one.endsWith(': done')), 'the edits ran').toEqual([]);
    expect(broken, 'the project.json after the edits').toBeNull();
  });
});
