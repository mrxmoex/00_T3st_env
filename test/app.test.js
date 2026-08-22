import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createApp } from "../src/app.js";
import { MAX_NOTE_LENGTH, createNoteStore } from "../src/store.js";

/** Starts the app on an ephemeral port; the server is closed when the test ends. */
async function startServer(t, { filePath = null } = {}) {
  const server = createApp({ store: createNoteStore({ filePath }) }).listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return { baseUrl: `http://127.0.0.1:${server.address().port}` };
}

/** Creates a scratch directory that is removed when the test ends. */
async function tempDir(t) {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), "notes-test-"));
  t.after(() => fsp.rm(dir, { recursive: true, force: true }));
  return dir;
}

function postNote(baseUrl, text) {
  return fetch(`${baseUrl}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

function putNote(baseUrl, id, text) {
  return fetch(`${baseUrl}/api/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

test("health endpoint reports ok", async (t) => {
  const { baseUrl } = await startServer(t);
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "ok");
});

test("notes start empty", async (t) => {
  const { baseUrl } = await startServer(t);
  const res = await fetch(`${baseUrl}/api/notes`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), []);
});

test("create, list, and delete a note end to end", async (t) => {
  const { baseUrl } = await startServer(t);

  const createRes = await postNote(baseUrl, "buy milk");
  assert.equal(createRes.status, 201);
  const created = await createRes.json();
  assert.equal(created.text, "buy milk");
  assert.ok(created.id > 0);
  assert.equal(created.updatedAt, created.createdAt);

  const notes = await (await fetch(`${baseUrl}/api/notes`)).json();
  assert.equal(notes.length, 1);
  assert.equal(notes[0].text, "buy milk");

  const delRes = await fetch(`${baseUrl}/api/notes/${created.id}`, { method: "DELETE" });
  assert.equal(delRes.status, 200);

  assert.deepEqual(await (await fetch(`${baseUrl}/api/notes`)).json(), []);
});

test("rejects an empty note", async (t) => {
  const { baseUrl } = await startServer(t);
  const res = await postNote(baseUrl, "   ");
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, "text is required");
});

test("rejects a note that is not a string", async (t) => {
  const { baseUrl } = await startServer(t);
  const res = await fetch(`${baseUrl}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: 42 }),
  });
  assert.equal(res.status, 400);
});

test("rejects a note longer than the maximum length", async (t) => {
  const { baseUrl } = await startServer(t);
  const res = await postNote(baseUrl, "x".repeat(MAX_NOTE_LENGTH + 1));
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /at most/);
});

test("lists the newest note first", async (t) => {
  const { baseUrl } = await startServer(t);
  await postNote(baseUrl, "first");
  await postNote(baseUrl, "second");
  await postNote(baseUrl, "third");

  const notes = await (await fetch(`${baseUrl}/api/notes`)).json();
  assert.deepEqual(
    notes.map((note) => note.text),
    ["third", "second", "first"],
  );
});

test("filters notes with a case-insensitive query", async (t) => {
  const { baseUrl } = await startServer(t);
  await postNote(baseUrl, "Buy Milk");
  await postNote(baseUrl, "walk the dog");

  const matches = await (await fetch(`${baseUrl}/api/notes?q=MILK`)).json();
  assert.deepEqual(
    matches.map((note) => note.text),
    ["Buy Milk"],
  );

  const misses = await (await fetch(`${baseUrl}/api/notes?q=nothing`)).json();
  assert.deepEqual(misses, []);

  const all = await (await fetch(`${baseUrl}/api/notes?q=`)).json();
  assert.equal(all.length, 2);
});

test("updates a note and records the edit time", async (t) => {
  const { baseUrl } = await startServer(t);
  const created = await (await postNote(baseUrl, "draft")).json();

  const res = await putNote(baseUrl, created.id, "  final  ");
  assert.equal(res.status, 200);
  const updated = await res.json();
  assert.equal(updated.text, "final");
  assert.equal(updated.id, created.id);
  assert.equal(updated.createdAt, created.createdAt);
  assert.ok(updated.updatedAt >= created.updatedAt);

  const notes = await (await fetch(`${baseUrl}/api/notes`)).json();
  assert.deepEqual(
    notes.map((note) => note.text),
    ["final"],
  );
});

test("rejects an empty update", async (t) => {
  const { baseUrl } = await startServer(t);
  const created = await (await postNote(baseUrl, "keep me")).json();

  const res = await putNote(baseUrl, created.id, "  ");
  assert.equal(res.status, 400);

  const notes = await (await fetch(`${baseUrl}/api/notes`)).json();
  assert.equal(notes[0].text, "keep me");
});

test("returns 404 for unknown note ids", async (t) => {
  const { baseUrl } = await startServer(t);

  const updateRes = await putNote(baseUrl, 999, "nope");
  assert.equal(updateRes.status, 404);

  const deleteRes = await fetch(`${baseUrl}/api/notes/999`, { method: "DELETE" });
  assert.equal(deleteRes.status, 404);

  const garbageRes = await fetch(`${baseUrl}/api/notes/not-a-number`, { method: "DELETE" });
  assert.equal(garbageRes.status, 404);
});

test("serves the frontend", async (t) => {
  const { baseUrl } = await startServer(t);

  const page = await fetch(`${baseUrl}/`);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /<title>Notes/);

  const script = await fetch(`${baseUrl}/app.js`);
  assert.equal(script.status, 200);
});

test("notes written through the API survive a restart", async (t) => {
  const dir = await tempDir(t);
  const filePath = path.join(dir, "notes.json");

  const first = await startServer(t, { filePath });
  await postNote(first.baseUrl, "remember me");

  const second = await startServer(t, { filePath });
  const notes = await (await fetch(`${second.baseUrl}/api/notes`)).json();
  assert.deepEqual(
    notes.map((note) => note.text),
    ["remember me"],
  );
});
