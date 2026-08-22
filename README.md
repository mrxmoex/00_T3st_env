# 00_T3st_env

A tiny **Notes** web app used to demonstrate a Cloud Agent development environment end to end.

Create, edit, search, and delete notes. Notes are persisted to disk, so they survive a
server restart.

Have fun 🎉

## Stack

- Node.js (>= 20) with [Express](https://expressjs.com/)
- Plain HTML/CSS/JS frontend served from `public/`
- Tests via the built-in Node test runner (`node --test`)
- Linting via [ESLint](https://eslint.org/) (flat config)

## Getting started

```bash
npm ci        # install exact dependencies from package-lock.json
npm run dev   # start the dev server with auto-reload on http://localhost:3000
```

Then open http://localhost:3000 and add a note.

## Commands

| Command        | Description                                   |
| -------------- | --------------------------------------------- |
| `npm start`    | Start the server (`src/server.js`)            |
| `npm run dev`  | Start the server with `--watch` auto-reload   |
| `npm test`     | Run the test suite (`node --test`)            |
| `npm run lint` | Lint the codebase with ESLint                 |

The server port can be overridden with the `PORT` environment variable (defaults to `3000`).

## Layout

| Path                | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `src/server.js`     | Process entry point: reads config, starts the HTTP server |
| `src/app.js`        | Express app factory and route handlers                    |
| `src/store.js`      | Note store with optional file persistence                 |
| `public/`           | Frontend markup, styles, and client script                |
| `test/`             | Node test-runner suites for the store and the API         |

## API

| Method   | Path             | Description                                        |
| -------- | ---------------- | -------------------------------------------------- |
| `GET`    | `/api/health`    | Health check                                       |
| `GET`    | `/api/notes`     | List notes, newest first; `?q=` filters by text    |
| `POST`   | `/api/notes`     | Create a note (`{text}`)                           |
| `PUT`    | `/api/notes/:id` | Replace a note's text (`{text}`)                   |
| `DELETE` | `/api/notes/:id` | Delete a note by id                                |

A note is `{ id, text, createdAt, updatedAt }`. Text is trimmed and must be non-empty
and at most 10,000 characters, otherwise the request fails with `400`.

## Storage

Notes are written to `data/notes.json` (git-ignored) so they survive a restart.

- Set `NOTES_FILE` to use a different path, or `NOTES_FILE=:memory:` to keep notes in
  memory only.
- Writes are serialized and atomic (temp file + rename), so an interrupted write cannot
  truncate the existing file.
- If the file exists but cannot be parsed, the server refuses to start rather than
  overwriting notes it could not read.

## Cloud Agent environment

`.cursor/environment.json` configures the Cloud Agent environment: `npm ci` installs
dependencies, and a `dev-server` terminal runs `npm run dev` so the app is available
while an agent works.
