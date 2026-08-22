import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

export const MAX_NOTE_LENGTH = 10_000;

const FILE_FORMAT_VERSION = 1;

/**
 * Trims and validates raw note text coming from a request body.
 * Returns either `{ ok: true, text }` or `{ ok: false, error }`.
 */
export function normalizeNoteText(value) {
  if (typeof value !== "string") {
    return { ok: false, error: "text is required" };
  }
  const text = value.trim();
  if (!text) {
    return { ok: false, error: "text is required" };
  }
  if (text.length > MAX_NOTE_LENGTH) {
    return { ok: false, error: `text must be at most ${MAX_NOTE_LENGTH} characters` };
  }
  return { ok: true, text };
}

function readNotesFile(filePath) {
  const empty = { notes: [], nextId: 1 };

  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return empty;
    }
    throw error;
  }

  if (!raw.trim()) {
    return empty;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    // Refuse to start rather than silently overwriting a file we cannot read.
    throw new Error(`Notes file at ${filePath} is not valid JSON: ${error.message}`);
  }

  const notes = Array.isArray(parsed) ? parsed : parsed?.notes;
  if (!Array.isArray(notes)) {
    throw new Error(`Notes file at ${filePath} does not contain a notes array`);
  }

  const loaded = notes.map((note, index) => {
    if (!Number.isInteger(note?.id) || typeof note?.text !== "string") {
      throw new Error(`Notes file at ${filePath} has a malformed note at index ${index}`);
    }
    const createdAt = note.createdAt ?? new Date(0).toISOString();
    return {
      id: note.id,
      text: note.text,
      createdAt,
      updatedAt: note.updatedAt ?? createdAt,
    };
  });

  // Trust the stored counter over the surviving ids so that deleting the newest
  // note and restarting cannot hand its id to a different note.
  const highestId = loaded.reduce((max, note) => Math.max(max, note.id), 0);
  const storedNextId = Number.isInteger(parsed?.nextId) ? parsed.nextId : 0;
  return { notes: loaded, nextId: Math.max(storedNextId, highestId + 1) };
}

async function writeFileAtomically(filePath, contents) {
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.tmp`;
  try {
    await fsp.writeFile(tempPath, contents, "utf8");
    await fsp.rename(tempPath, filePath);
  } catch (error) {
    await fsp.rm(tempPath, { force: true });
    throw error;
  }
}

/**
 * Creates a note store. Notes are kept in memory for reads; when `filePath` is
 * provided every mutation is also flushed to disk so notes survive a restart.
 * Writes are serialized and atomic (temp file + rename) so a crash mid-write
 * cannot truncate the existing file.
 */
export function createNoteStore({ filePath = null } = {}) {
  const loaded = filePath ? readNotesFile(filePath) : { notes: [], nextId: 1 };
  const notes = loaded.notes;
  let nextId = loaded.nextId;
  let pendingWrite = Promise.resolve();

  function persist() {
    if (!filePath) {
      return Promise.resolve();
    }
    const contents = JSON.stringify({ version: FILE_FORMAT_VERSION, nextId, notes }, null, 2);
    pendingWrite = pendingWrite
      .catch(() => {})
      .then(() => writeFileAtomically(filePath, contents));
    return pendingWrite;
  }

  return {
    /** Newest first, optionally filtered by a case-insensitive substring. */
    list({ query = "" } = {}) {
      const needle = query.trim().toLowerCase();
      const matches = needle
        ? notes.filter((note) => note.text.toLowerCase().includes(needle))
        : notes.slice();
      return matches.sort((a, b) => b.id - a.id);
    },

    async create(text) {
      const now = new Date().toISOString();
      const note = { id: nextId, text, createdAt: now, updatedAt: now };
      notes.push(note);
      nextId += 1;
      try {
        await persist();
      } catch (error) {
        notes.pop();
        nextId -= 1;
        throw error;
      }
      return note;
    },

    async update(id, text) {
      const index = notes.findIndex((note) => note.id === id);
      if (index === -1) {
        return null;
      }
      const previous = notes[index];
      const updated = { ...previous, text, updatedAt: new Date().toISOString() };
      notes[index] = updated;
      try {
        await persist();
      } catch (error) {
        notes[index] = previous;
        throw error;
      }
      return updated;
    },

    async remove(id) {
      const index = notes.findIndex((note) => note.id === id);
      if (index === -1) {
        return null;
      }
      const [removed] = notes.splice(index, 1);
      try {
        await persist();
      } catch (error) {
        notes.splice(index, 0, removed);
        throw error;
      }
      return removed;
    },

    /** Resolves once every queued write has been flushed to disk. */
    flushed() {
      return pendingWrite;
    },
  };
}
