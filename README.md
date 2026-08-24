# Du bist was du isst

Public food-evaluation matrix. The production app lives in [`web/`](web/).

Quantity without bioavailability is noise. Plant categories are never collapsed into a vegetable average.

```bash
cd web
npm ci
npm run dev    # http://localhost:3000
npm test
```

See [`web/README.md`](web/README.md) for the schema, scoring rules, and source protocol.

The original Notes demo remains under `src/` / `public/` for environment smoke tests. [`bulwark/`](bulwark/) is a separate prototype.

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
