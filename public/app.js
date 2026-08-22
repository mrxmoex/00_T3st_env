const list = document.getElementById("note-list");
const form = document.getElementById("note-form");
const input = document.getElementById("note-input");
const addButton = document.getElementById("add-button");
const searchInput = document.getElementById("search-input");
const errorBox = document.getElementById("error");
const errorText = document.getElementById("error-text");
const errorDismiss = document.getElementById("error-dismiss");
const statusLine = document.getElementById("status");

const SEARCH_DEBOUNCE_MS = 200;

let notes = [];
let query = "";
let editingId = null;
let loading = false;
let searchTimer = null;

async function api(path, options) {
  const response = await fetch(path, options);
  if (!response.ok) {
    let message = `request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body?.error) {
        message = body.error;
      }
    } catch {
      // Response had no JSON body; the status-based message stands.
    }
    throw new Error(message);
  }
  return response.json();
}

function showError(message) {
  errorText.textContent = message;
  errorBox.hidden = false;
}

function clearError() {
  errorBox.hidden = true;
  errorText.textContent = "";
}

function formatTimestamps(note) {
  const created = new Date(note.createdAt).toLocaleString();
  if (note.updatedAt && note.updatedAt !== note.createdAt) {
    return `${created} · edited ${new Date(note.updatedAt).toLocaleString()}`;
  }
  return created;
}

function updateStatus() {
  if (loading) {
    statusLine.textContent = "Loading…";
    return;
  }
  const noun = notes.length === 1 ? "note" : "notes";
  statusLine.textContent = query
    ? `${notes.length} matching ${noun}`
    : `${notes.length} ${noun}`;
}

function button(label, className, onClick) {
  const element = document.createElement("button");
  element.type = "button";
  element.textContent = label;
  if (className) {
    element.className = className;
  }
  element.addEventListener("click", onClick);
  return element;
}

function renderNote(note) {
  const item = document.createElement("li");

  const body = document.createElement("div");
  body.className = "body";
  const text = document.createElement("div");
  text.className = "text";
  text.textContent = note.text;
  const time = document.createElement("time");
  time.dateTime = note.updatedAt ?? note.createdAt;
  time.textContent = formatTimestamps(note);
  body.append(text, time);

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(
    button("Edit", null, () => startEditing(note.id)),
    button("Delete", null, () => deleteNote(note.id)),
  );

  item.append(body, actions);
  return item;
}

function renderEditor(note) {
  const item = document.createElement("li");

  const body = document.createElement("div");
  body.className = "body";
  const field = document.createElement("input");
  field.type = "text";
  field.className = "edit-input";
  field.id = "edit-input";
  field.maxLength = 10000;
  field.value = note.text;
  body.append(field);

  const save = () => saveEdit(note.id, field.value);
  field.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      save();
    } else if (event.key === "Escape") {
      event.preventDefault();
      stopEditing();
    }
  });

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(button("Save", "primary", save), button("Cancel", null, stopEditing));

  item.append(body, actions);
  return item;
}

function render() {
  list.replaceChildren();

  if (!notes.length) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = query
      ? `No notes match “${query}”.`
      : "No notes yet. Add one above.";
    list.append(empty);
  } else {
    for (const note of notes) {
      list.append(note.id === editingId ? renderEditor(note) : renderNote(note));
    }
  }

  updateStatus();
}

async function refresh() {
  loading = true;
  list.setAttribute("aria-busy", "true");
  updateStatus();
  try {
    notes = await api(`/api/notes?q=${encodeURIComponent(query)}`);
    clearError();
  } catch (error) {
    showError(`Could not load notes: ${error.message}`);
  } finally {
    loading = false;
    list.setAttribute("aria-busy", "false");
    render();
  }
}

function startEditing(id) {
  editingId = id;
  render();
  const field = document.getElementById("edit-input");
  field?.focus();
  field?.select();
}

function stopEditing() {
  editingId = null;
  render();
}

async function saveEdit(id, value) {
  const text = value.trim();
  if (!text) {
    showError("A note cannot be empty.");
    return;
  }
  try {
    await api(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    editingId = null;
    await refresh();
  } catch (error) {
    showError(`Could not save the note: ${error.message}`);
  }
}

async function deleteNote(id) {
  try {
    await api(`/api/notes/${id}`, { method: "DELETE" });
    if (editingId === id) {
      editingId = null;
    }
    await refresh();
  } catch (error) {
    showError(`Could not delete the note: ${error.message}`);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    return;
  }
  addButton.disabled = true;
  try {
    await api("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    input.value = "";
    await refresh();
  } catch (error) {
    showError(`Could not add the note: ${error.message}`);
  } finally {
    addButton.disabled = false;
    input.focus();
  }
});

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    query = searchInput.value.trim();
    editingId = null;
    refresh();
  }, SEARCH_DEBOUNCE_MS);
});

errorDismiss.addEventListener("click", clearError);

refresh();
