# Routing

## Architecture

```
Browser ──► Traefik (:80)
                │
        ┌───────┼──────────┐
        ▼       ▼          ▼
   frontend   backend   future
   (nginx)    (:5000)   projects
```

All requests hit Traefik on port 80. Traefik routes based on `PathPrefix` and strips the prefix before forwarding to the target container. The browser's URL bar always shows the full prefixed path.

## Root compose (Traefik + sub-path routing)

| Browser URL | Traefik matches | Strips | Forwards to |
|---|---|---|---|
| `/live-documents` | `PathPrefix(/live-documents)` priority 10 | `/live-documents` | `frontend:80/` |
| `/live-documents/api/*` | `PathPrefix(/live-documents/api)` priority 20 | `/live-documents` | `backend:5000/api/*` |
| `/live-documents/hubs/*` | `PathPrefix(/live-documents/hubs)` priority 20 | `/live-documents` | `backend:5000/hubs/*` |

The higher-priority API/hubs routes (20) take precedence over the catch-all frontend route (10).

## SPA base path

Vite builds with `base` set to the sub-path so asset references (JS, CSS) use the correct URL:

- **Root compose**: `base: /live-documents/` (set via `VITE_BASE_PATH` build arg)
- **Standalone**: `base: /` (default, VITE_BASE_PATH is empty)

Without this, the HTML references assets at `/assets/foo.js` instead of `/live-documents/assets/foo.js`, and Traefik never routes them to the frontend container.

### Getting the base path into the SPA

`vite.config.ts` reads `process.env.VITE_BASE_PATH` to set `base`. During Docker builds, the `Dockerfile` accepts `ARG VITE_BASE_PATH` and exports it as `ENV VITE_BASE_PATH`. Vite's `import.meta.env.VITE_BASE_PATH` makes it available at runtime.

## Router path matching

`preact-iso`'s `<Router>` matches route paths against `window.location.pathname` (the full browser URL). Since the SPA is served at a sub-path, all Route paths and navigation calls must include the base path.

A `routes.ts` utility prepends the base path to any route string:

```ts
const BASE = import.meta.env.VITE_BASE_PATH || "/";
export function url(path: string): string {
  return `${BASE}${path.replace(/^\//, "")}`;
}
```

All route declarations, `route()` calls, `<a href>`, and `window.location.href` must use `url()`:

```tsx
// Route definitions
<Route path={`${BASE}login`} component={Login} />
<Route path={url("/login")} component={Login} />   // equivalent

// Navigation
route(url("/"));
route(url("/login"), true);      // replace navigation
route(url(`/doc/${id}`));

// Links
<a href={url("/login")}>Login</a>
<a href={url("/")} class="logo">CollabEdit</a>

// Full page redirect (logout)
window.location.href = url("/login");
```

## nginx upstream hostname

The frontend nginx proxies `/api` and `/hubs` to the backend. The upstream hostname depends on which compose is running:

| Compose | Backend service name | nginx `proxy_pass` |
|---|---|---|
| Standalone (`projects/live-documents/`) | `backend` | `http://backend:5000` |
| Root (repo root with Traefik) | `live-documents-backend` | `http://backend:5000` (via network alias) |

In the root compose, `live-documents-backend` has a network alias `backend` so nginx can resolve the hostname:

```yaml
live-documents-backend:
  networks:
    proxy:
      aliases:
        - backend
```

## Traefik Docker API compatibility

Traefik v3.4 failed with `client version 1.24 is too old` on this system (Docker 29.4.2, API 1.54). Fixed by downgrading to `traefik:v2.11`.

## SQLite volume mounts

Bind-mount data **directories**, not files. Mounting to `/data/collabedit.db` creates a directory → `disk I/O error`. Always bind-mount to the parent directory (`/data`). Project data lives under `data/<project>/` at the repo root (gitignored).

## Checklist for adding a new project

1. Add frontend and backend services to `docker-compose.yml` with Traefik labels for sub-path routing
2. Set `VITE_BASE_PATH: /<project>/` and `VITE_API_PREFIX: /<project>` build args on the frontend
3. Add a network alias so the frontend nginx can resolve the backend service name
4. Make sure the SPA router uses base-path-aware routes (via `url()` utility)
5. Mount backend data at `./data/<project>:/data` (or equivalent) so DBs land in the gitignored `data/` directory
