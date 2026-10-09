// What is saved, against corruption and migration (the investigation's C8: "persistência: corrupção e migração",
// without a browser). Two readers take a saved project — the file a person opens (src/core/project/archive.ts
// readProject) and the autosaved work restored at start (src/editor/persistence/autosave.ts restoredWork), the second
// reading through the first — and both go through the document's format chain (src/core/document/migrations.ts). The
// rules: whatever arrives, the reader returns a document the model accepts or a refusal with words, never a throw and
// never a half-read document; the chain carries every older version forward to this app's, and refuses a newer one and
// a step it does not have instead of guessing.
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { DOCUMENT_VERSION, type DocumentJson } from '../../../src/core/document/model.ts';
import { migrateDocument } from '../../../src/core/document/migrations.ts';
import { validateDocument } from '../../../src/core/document/validate.ts';
import { readProject } from '../../../src/core/project/archive.ts';
import { restoredWork, type SavedWork } from '../../../src/editor/persistence/autosave.ts';
import { MODEL_RULES } from '../../../src/editor/store.ts';
import { fixture } from './harness.ts';

const at = (version: number): Record<string, unknown> => ({ ...(fixture('aurora') as unknown as Record<string, unknown>), version });
const problemsOf = (document: DocumentJson): readonly string[] => validateDocument(document, [], MODEL_RULES).map((one) => `${one.path}: ${one.message}`);

describe('o que é salvo, contra corrupção e migração', () => {
  it('readProject nunca lança e só devolve um documento que o modelo aceita', () => {
    const broken: string[] = [];
    fc.assert(
      fc.property(fc.anything(), (value) => {
        let read: ReturnType<typeof readProject>;
        try {
          read = readProject(value, MODEL_RULES);
        } catch (error) {
          broken.push(`lançou com ${JSON.stringify(value)?.slice(0, 60) ?? String(value)}: ${(error as Error).message.slice(0, 60)}`);
          return;
        }
        if ('document' in read) {
          const problems = problemsOf(read.document);
          if (problems.length > 0) broken.push(`aceitou um documento que o modelo recusa: ${problems[0] ?? ''}`);
        } else if (typeof read.refused?.key !== 'string') {
          broken.push('recusou sem dizer por quê');
        }
      }),
      { seed: 20261008, numRuns: 400 },
    );
    expect(broken.slice(0, 8), 'leituras que lançaram ou aceitaram o que o modelo recusa').toEqual([]);
  });

  it('um projeto corrompido é recusado com palavras, e não derruba o leitor', () => {
    const page = (fixture('aurora') as unknown as { pages: unknown[] }).pages[0];
    const cases: readonly { readonly what: string; readonly value: unknown }[] = [
      { what: 'sem versão', value: { pages: [] } },
      { what: 'uma versão não inteira', value: { version: 2.5, pages: [] } },
      { what: 'a versão 0', value: { version: 0, pages: [] } },
      { what: 'sem páginas', value: { version: DOCUMENT_VERSION } },
      { what: 'páginas que não são uma lista', value: { version: DOCUMENT_VERSION, pages: 'x' } },
      { what: 'uma página sem árvore', value: { version: DOCUMENT_VERSION, pages: [{ id: 'p', name: 'Home', file: 'index.html' }] } },
      { what: 'uma árvore que não é um nó', value: { version: DOCUMENT_VERSION, pages: [{ ...(page as object), tree: 'x' }] } },
      { what: 'um id repetido', value: { version: DOCUMENT_VERSION, pages: [{ ...(page as object), tree: { ...((page as { tree: Record<string, unknown> }).tree), children: [{ id: (page as { tree: { id: string } }).tree.id, type: 'container', children: [] }] } }] } },
      { what: 'um nó sem tipo', value: { version: DOCUMENT_VERSION, pages: [{ ...(page as object), tree: { id: 'a', children: [] } }] } },
      { what: 'um nó só com id, atributos e filhos', value: { version: DOCUMENT_VERSION, pages: [{ ...(page as object), tree: { id: 'a', attributes: {}, children: [{ id: 'b', attributes: {}, children: [] }] } }] } },
      { what: 'um filho que não é um nó', value: { version: DOCUMENT_VERSION, pages: [{ ...(page as object), tree: { ...((page as { tree: Record<string, unknown> }).tree), children: ['x'] } }] } },
    ];
    const kept: string[] = [];
    for (const one of cases) {
      const read = readProject(one.value, MODEL_RULES);
      if (!('refused' in read)) kept.push(`${one.what} foi aceito`);
      else if (typeof read.refused.key !== 'string') kept.push(`${one.what} foi recusado sem palavras`);
    }
    expect(kept).toEqual([]);
  });

  it('a cadeia de migrações cobre toda versão até a atual, e a recusa onde não há degrau', () => {
    const current = migrateDocument(at(DOCUMENT_VERSION));
    expect(current.ok, 'o documento da versão de agora é lido como está').toBe(true);
    for (let version = 1; version < DOCUMENT_VERSION; version += 1) {
      const migrated = migrateDocument(at(version));
      expect(migrated.ok, `a versão ${version} é levada adiante`).toBe(true);
      if (migrated.ok) {
        expect((migrated.document as { version: number }).version, `a versão ${version} chega à atual`).toBe(DOCUMENT_VERSION);
        // carried forward, it is a document the model still accepts
        expect(problemsOf(migrated.document as DocumentJson), `a versão ${version} migrada o modelo aceita`).toEqual([]);
      }
    }
    expect(migrateDocument(at(DOCUMENT_VERSION + 1)), 'uma versão mais nova é recusada e não adivinhada').toEqual({ ok: false, reason: 'newer', version: DOCUMENT_VERSION + 1 });
    expect(migrateDocument(at(1), []), 'um degrau que falta é recusado como tal').toEqual({ ok: false, reason: 'no-step', version: 1 });
    for (const junk of [null, undefined, 3, 'x', [], true, {}]) expect(migrateDocument(junk).ok, `${String(junk)} não é um documento`).toBe(false);
  });

  it('migrar duas vezes dá o mesmo documento', () => {
    const once = migrateDocument(at(1));
    expect(once.ok).toBe(true);
    if (!once.ok) return;
    const twice = migrateDocument(once.document);
    expect(twice.ok).toBe(true);
    if (twice.ok) expect(JSON.stringify(twice.document)).toBe(JSON.stringify(once.document));
  });

  it('o trabalho salvo corrompido não restaura, e o que restaura o modelo aceita', () => {
    const document = fixture('aurora');
    const cases: readonly SavedWork[] = [
      { revision: 1, format: 1, document: null, selection: [] },
      { revision: 1, format: 1, document: {}, selection: [] },
      { revision: 1, format: 1, document: { version: DOCUMENT_VERSION }, selection: [] },
      { revision: 1, format: 1, document: { version: DOCUMENT_VERSION + 1, pages: [] }, selection: [] },
      { revision: 1, format: 1, document, selection: 'não é uma seleção' },
      { revision: 1, format: 1, document, selection: ['nó que não existe'] },
      { revision: 1, format: 1, document, selection: [] },
    ];
    const broken: string[] = [];
    for (const one of cases) {
      let restored: ReturnType<typeof restoredWork>;
      try {
        restored = restoredWork(one, MODEL_RULES);
      } catch (error) {
        broken.push(`restoredWork lançou: ${(error as Error).message.slice(0, 60)}`);
        continue;
      }
      if (restored === null) continue;
      const problems = problemsOf(restored.document);
      if (problems.length > 0) broken.push(`restaurou um documento que o modelo recusa: ${problems[0] ?? ''}`);
      const selection = validateDocument(restored.document, restored.selection, MODEL_RULES);
      if (selection.length > 0) broken.push(`restaurou uma seleção que o modelo recusa: ${selection[0]?.path ?? ''}`);
    }
    // a corrupted document does not restore; the good one does
    expect(restoredWork({ revision: 1, format: 1, document: null, selection: [] }, MODEL_RULES)).toBeNull();
    expect(restoredWork(undefined, MODEL_RULES)).toBeNull();
    expect(restoredWork({ revision: 1, format: DOCUMENT_VERSION, document, selection: ['nó que não existe'] }, MODEL_RULES)?.selection).toEqual([]);
    expect(broken, 'trabalho salvo que derrubou ou restaurou o que o modelo recusa').toEqual([]);
  });
});
