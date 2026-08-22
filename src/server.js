import { fileURLToPath } from "node:url";
import path from "node:path";
import { createApp } from "./app.js";
import { createNoteStore } from "./store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port = Number(process.env.PORT) || 3000;
const configured = process.env.NOTES_FILE ?? path.join(__dirname, "..", "data", "notes.json");
const filePath = configured === ":memory:" ? null : path.resolve(configured);

let store;
try {
  store = createNoteStore({ filePath });
} catch (error) {
  console.error(`Failed to load notes: ${error.message}`);
  console.error("Fix or remove the notes file, or set NOTES_FILE=:memory: to start empty.");
  process.exit(1);
}

createApp({ store }).listen(port, "0.0.0.0", () => {
  const location = filePath ? filePath : "memory only (not persisted)";
  console.log(`Notes app listening on http://0.0.0.0:${port}`);
  console.log(`Notes stored in ${location}`);
});
