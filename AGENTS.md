# kimballbradford.com

Multi-project portfolio site. Single DigitalOcean droplet, all behind Traefik reverse proxy.

## Architecture

```
Traefik (:80 / :443)
  ├── /live-documents/*       → live-documents-frontend:80  (nginx, Preact SPA)
  ├── /live-documents/api/*   → live-documents-backend:5000 (ASP.NET Core)
  └── /live-documents/hubs/*  → live-documents-backend:5000 (SignalR WebSocket)
```

All routes through Traefik. Path prefix stripped before forwarding. API/hubs routes have priority 20 vs frontend's 10.

## Quickstart

```bash
cp .env.example .env   # ⚠ .env.example does NOT exist — hand-craft from .env
# DOMAIN=localhost, COLLABEDIT_JWT_KEY=key-32+bytes
docker compose up --build
# → http://localhost/live-documents/
```

**Production:**
```bash
cp .env.example .env
# DOMAIN=kimballbradford.com, ACME_EMAIL=you@example.com, CF_DNS_API_TOKEN=...
touch traefik/acme.json && chmod 600 traefik/acme.json
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

**Standalone dev (no Traefik, per-project):**
```bash
cd projects/live-documents
docker compose up --build
# Frontend :80, Backend :5000

# Or Vite dev server with hot reload:
cd projects/live-documents/frontend && npm run dev   # :5173
```

## Key files

| Path | Purpose |
|------|---------|
| `docker-compose.yml` | Base — all services + Traefik (HTTP only) |
| `docker-compose.prod.yml` | Prod overlay — HTTPS via Let's Encrypt + Cloudflare DNS challenge |
| `routing.md` | Deep dive on SPA base path, nginx upstream, Traefix quirks |
| `traefik/acme.json` | Let's Encrypt certs (gitignored, `chmod 600`) |
| `.env` | `DOMAIN`, `COLLABEDIT_JWT_KEY`, `ACME_EMAIL`, `CF_DNS_API_TOKEN` |

## Hard-earned quirks

- **Traefik v2.11 pinned**: v3.4 failed with `client version 1.24 is too old` on this system (Docker 29.4.2, API 1.54).
- **SQLite volume:** Mount volumes to the *directory* (`/app`), not the file. Mounting to `/app/collabedit.db` creates a directory → `disk I/O error`.
- **SPA base path:** `VITE_BASE_PATH` build arg sets Vite's `base` so assets resolve under the sub-path. Routes use a `url()` utility to prepend the base path. See `routing.md` for details.
- **nginx upstream:** In standalone compose the backend is `backend:5000`; in root compose it resolves via network alias `backend` → `live-documents-backend`.

## Submodule

`projects/live-documents` = `https://github.com/kimballbradford/CollabEdit.git`. Run `git submodule update --init --recursive` after clone. The submodule has its own `AGENTS.md` with CollabEdit internals.

## Adding a project

1. `git submodule add <url> projects/<name>`
2. Add frontend & backend services to `docker-compose.yml` with Traefik labels (`PathPrefix(/<name>)`), `VITE_BASE_PATH: /<name>/`, and a network alias on the backend for nginx.
3. Override `entrypoints=websecure` + `tls.certresolver=letsencrypt` in `docker-compose.prod.yml` if the backend needs HTTPS.
