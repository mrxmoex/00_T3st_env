import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

let server;
let baseUrl;

before(async () => {
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => {
  server?.close();
});

test("health endpoint reports ok", async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "ok");
});

test("notes start empty", async () => {
  const res = await fetch(`${baseUrl}/api/notes`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), []);
});

test("create, list, and delete a note end to end", async () => {
  const createRes = await fetch(`${baseUrl}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "buy milk" }),
  });
  assert.equal(createRes.status, 201);
  const created = await createRes.json();
  assert.equal(created.text, "buy milk");
  assert.ok(created.id > 0);

  const listRes = await fetch(`${baseUrl}/api/notes`);
  const notes = await listRes.json();
  assert.equal(notes.length, 1);
  assert.equal(notes[0].text, "buy milk");

  const delRes = await fetch(`${baseUrl}/api/notes/${created.id}`, {
    method: "DELETE",
  });
  assert.equal(delRes.status, 200);

  const afterRes = await fetch(`${baseUrl}/api/notes`);
  assert.deepEqual(await afterRes.json(), []);
});

test("rejects an empty note", async () => {
  const res = await fetch(`${baseUrl}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "   " }),
  });
  assert.equal(res.status, 400);
});
