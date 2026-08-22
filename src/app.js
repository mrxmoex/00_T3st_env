import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createNoteStore, normalizeNoteText } from "./store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Express 4 does not forward rejected promises to error middleware on its own.
const route = (handler) => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);

export function createApp({ store = createNoteStore() } = {}) {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.get("/api/notes", (req, res) => {
    const query = typeof req.query.q === "string" ? req.query.q : "";
    res.json(store.list({ query }));
  });

  app.post(
    "/api/notes",
    route(async (req, res) => {
      const result = normalizeNoteText(req.body?.text);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.status(201).json(await store.create(result.text));
    }),
  );

  app.put(
    "/api/notes/:id",
    route(async (req, res) => {
      const result = normalizeNoteText(req.body?.text);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      const updated = await store.update(Number(req.params.id), result.text);
      if (!updated) {
        res.status(404).json({ error: "note not found" });
        return;
      }
      res.json(updated);
    }),
  );

  app.delete(
    "/api/notes/:id",
    route(async (req, res) => {
      const removed = await store.remove(Number(req.params.id));
      if (!removed) {
        res.status(404).json({ error: "note not found" });
        return;
      }
      res.json(removed);
    }),
  );

  app.use(express.static(path.join(__dirname, "..", "public")));

  // Express identifies error middleware by its four-argument signature.
  app.use((error, _req, res, _next) => {
    console.error("Request failed:", error);
    res.status(500).json({ error: "could not save notes" });
  });

  return app;
}
