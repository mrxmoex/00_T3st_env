# 00_T3st_env

A tiny **Notes** web app used to demonstrate a Cloud Agent development environment end to end.

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

## API

| Method   | Path              | Description              |
| -------- | ----------------- | ------------------------ |
| `GET`    | `/api/health`     | Health check             |
| `GET`    | `/api/notes`      | List all notes           |
| `POST`   | `/api/notes`      | Create a note (`{text}`) |
| `DELETE` | `/api/notes/:id`  | Delete a note by id      |

Notes are stored in memory and reset on restart.

## Cloud Agent environment

`.cursor/environment.json` configures the Cloud Agent environment: `npm ci` installs
dependencies, and a `dev-server` terminal runs `npm run dev` so the app is available
while an agent works.

## Also in this repo

[`bulwark/`](bulwark/) is a separate AI-agent behaviour-security prototype. See
its [operator guide](bulwark/README.md) and [business strategy](bulwark/STRATEGY.md).
