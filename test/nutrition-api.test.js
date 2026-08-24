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

test("nutrition meta endpoint", async () => {
  const res = await fetch(`${baseUrl}/api/nutrition/meta`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.title, "Du bist was du isst");
  assert.ok(body.foodCount >= 5);
});

test("nutrition scores endpoint returns scored foods", async () => {
  const res = await fetch(`${baseUrl}/api/nutrition/scores`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body));
  assert.ok(body.length >= 5);
  assert.ok(body[0].scores.composite > 0);
  assert.ok(body[0].scores.tier);
});

test("vegan pattern adds flags on plants", async () => {
  const res = await fetch(`${baseUrl}/api/nutrition/scores?pattern=vegan`);
  const body = await res.json();
  const spinach = body.find((f) => f.food.id === "spinach_raw");
  assert.ok(spinach.flags.length > 0);
});
