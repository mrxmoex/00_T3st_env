import { test } from "node:test";
import assert from "node:assert/strict";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { MAX_NOTE_LENGTH, createNoteStore, normalizeNoteText } from "../src/store.js";

/** Creates a scratch directory that is removed when the test ends. */
async function tempDir(t) {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), "notes-test-"));
  t.after(() => fsp.rm(dir, { recursive: true, force: true }));
  return dir;
}

async function storeInTempDir(t) {
  const dir = await tempDir(t);
  const filePath = path.join(dir, "nested", "notes.json");
  return { filePath, store: createNoteStore({ filePath }) };
}

test("normalizeNoteText trims, requires content, and caps length", () => {
  assert.deepEqual(normalizeNoteText("  hi  "), { ok: true, text: "hi" });
  assert.equal(normalizeNoteText("   ").ok, false);
  assert.equal(normalizeNoteText(undefined).ok, false);
  assert.equal(normalizeNoteText(123).ok, false);
  assert.equal(normalizeNoteText("x".repeat(MAX_NOTE_LENGTH)).ok, true);
  assert.equal(normalizeNoteText("x".repeat(MAX_NOTE_LENGTH + 1)).ok, false);
});

test("an in-memory store keeps notes without touching disk", async () => {
  const store = createNoteStore();
  const note = await store.create("no file needed");
  assert.equal(store.list().length, 1);
  assert.equal(note.text, "no file needed");
});

test("a missing notes file starts empty and is created on first write", async (t) => {
  const { filePath, store } = await storeInTempDir(t);
  assert.deepEqual(store.list(), []);

  await store.create("first");

  const saved = JSON.parse(await fsp.readFile(filePath, "utf8"));
  assert.equal(saved.version, 1);
  assert.deepEqual(
    saved.notes.map((note) => note.text),
    ["first"],
  );
});

test("creates, updates, and deletes survive a reload", async (t) => {
  const { filePath, store } = await storeInTempDir(t);

  const keep = await store.create("keep");
  const edit = await store.create("edit me");
  const drop = await store.create("drop me");

  await store.update(edit.id, "edited");
  await store.remove(drop.id);

  const reloaded = createNoteStore({ filePath });
  assert.deepEqual(
    reloaded.list().map((note) => note.text),
    ["edited", "keep"],
  );

  const reloadedEdit = reloaded.list().find((note) => note.id === edit.id);
  assert.equal(reloadedEdit.createdAt, edit.createdAt);
  assert.ok(reloadedEdit.updatedAt >= reloadedEdit.createdAt);
  assert.ok(reloaded.list().every((note) => note.id !== drop.id));
  assert.equal(keep.text, "keep");
});

test("ids are never reused after a reload", async (t) => {
  const { filePath, store } = await storeInTempDir(t);
  const first = await store.create("first");
  const second = await store.create("second");
  await store.remove(second.id);

  const reloaded = createNoteStore({ filePath });
  const third = await reloaded.create("third");

  assert.ok(third.id > second.id, `expected ${third.id} to be greater than ${second.id}`);
  assert.notEqual(third.id, first.id);
});

test("concurrent writes are all persisted", async (t) => {
  const { filePath, store } = await storeInTempDir(t);

  await Promise.all(Array.from({ length: 25 }, (_, i) => store.create(`note ${i}`)));
  await store.flushed();

  const reloaded = createNoteStore({ filePath });
  const ids = reloaded.list().map((note) => note.id);
  assert.equal(ids.length, 25);
  assert.equal(new Set(ids).size, 25);
});

test("update and remove report missing notes", async (t) => {
  const { store } = await storeInTempDir(t);
  assert.equal(await store.update(404, "nope"), null);
  assert.equal(await store.remove(404), null);
});

test("list filters case-insensitively and returns newest first", async (t) => {
  const { store } = await storeInTempDir(t);
  await store.create("Alpha");
  await store.create("beta");
  await store.create("ALPHABET");

  assert.deepEqual(
    store.list().map((note) => note.text),
    ["ALPHABET", "beta", "Alpha"],
  );
  assert.deepEqual(
    store.list({ query: "alpha" }).map((note) => note.text),
    ["ALPHABET", "Alpha"],
  );
  assert.deepEqual(store.list({ query: "  " }).length, 3);
  assert.deepEqual(store.list({ query: "zzz" }), []);
});

test("a corrupt notes file fails loudly instead of being overwritten", async (t) => {
  const dir = await tempDir(t);
  const filePath = path.join(dir, "notes.json");
  await fsp.writeFile(filePath, "{ not json", "utf8");

  assert.throws(() => createNoteStore({ filePath }), /not valid JSON/);
  assert.equal(await fsp.readFile(filePath, "utf8"), "{ not json");
});

test("a notes file with a malformed entry fails loudly", async (t) => {
  const dir = await tempDir(t);
  const filePath = path.join(dir, "notes.json");
  await fsp.writeFile(filePath, JSON.stringify({ notes: [{ id: "abc" }] }), "utf8");

  assert.throws(() => createNoteStore({ filePath }), /malformed note at index 0/);
});

test("an empty notes file is treated as no notes", async (t) => {
  const dir = await tempDir(t);
  const filePath = path.join(dir, "notes.json");
  await fsp.writeFile(filePath, "  \n", "utf8");

  assert.deepEqual(createNoteStore({ filePath }).list(), []);
});
