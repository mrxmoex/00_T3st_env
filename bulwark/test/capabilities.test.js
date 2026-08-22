import { test } from "node:test";
import assert from "node:assert/strict";
import { capabilityOf, destinationOf, isKnownTool, normalizeDestination } from "../src/capabilities.js";

test("known tools expose ingest, sensitivity, and egress", () => {
  const secret = capabilityOf("secrets.read");
  assert.equal(secret.ingest, 0);
  assert.equal(secret.sensitivity, 1);
  assert.equal(secret.egress, 0);

  const post = capabilityOf("http.post");
  assert.equal(post.kind, "egress");
  assert.equal(post.egress, 1);
  assert.equal(isKnownTool("http.post"), true);
});

test("unknown tools get a conservative midpoint capability", () => {
  const unknown = capabilityOf("custom.mystery");
  assert.equal(unknown.kind, "unknown");
  assert.equal(unknown.ingest, 0.5);
  assert.equal(unknown.egress, 0.5);
});

test("destination normalization keeps the identity that matters", () => {
  assert.equal(normalizeDestination("https://API.Example.com/v1/hooks"), "api.example.com");
  assert.equal(normalizeDestination("Billing@Acme.COM"), "acme.com");
  assert.equal(normalizeDestination("npm test"), "npm test");
});

test("destinationOf reads the capability-declared param", () => {
  assert.equal(
    destinationOf({ tool: "http.post", params: { url: "https://prod-deploy.internal.corp/release" } }),
    "prod-deploy.internal.corp",
  );
  assert.equal(destinationOf({ tool: "secrets.read", params: { name: "DEPLOY_TOKEN" } }), null);
  assert.equal(destinationOf({ tool: "email.send", params: { to: "ops@acme.com" } }), "acme.com");
});
