import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { registerNutritionRoutes } from "./nutrition-api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-memory note store. Sufficient for a demo/sandbox environment; swap for a
// real database when persistence across restarts is required.
export function createApp() {
  const app = express();
  app.use(express.json());

  const notes = [];
  let nextId = 1;

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  registerNutritionRoutes(app);

  app.get("/api/notes", (_req, res) => {
    res.json(notes);
  });

  app.post("/api/notes", (req, res) => {
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text) {
      res.status(400).json({ error: "text is required" });
      return;
    }
    const note = { id: nextId++, text, createdAt: new Date().toISOString() };
    notes.push(note);
    res.status(201).json(note);
  });

  app.delete("/api/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = notes.findIndex((note) => note.id === id);
    if (index === -1) {
      res.status(404).json({ error: "note not found" });
      return;
    }
    const [removed] = notes.splice(index, 1);
    res.json(removed);
  });

  app.use(express.static(path.join(__dirname, "..", "public")));

  // Redirect root to nutrition app
  app.get("/", (_req, res) => {
    res.redirect("/nutrition/");
  });

  return app;
}
