# Portfolio — kimballbradford.com

Multi-project portfolio site running behind Traefik reverse proxy on a single DigitalOcean droplet.

## Architecture

```
                         ┌─────────────┐
                         │   Traefik   │
                         │  :80 / :443 │
                         └──────┬──────┘
                                │
        ┌───────────────────────┼───────────────────┐
        │                       │                   │
        ▼                       ▼                   ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ live-documents  │   │ live-documents  │   │  future project │
│   frontend      │   │   backend       │   │   container     │
│   (nginx:80)    │   │   (dotnet:5000) │   │                 │
└────────┬────────┘   └─────────────────┘   └─────────────────┘
         │
         ▼
  ┌──────────────┐
  │  SQLite      │
  │  (volume)    │
  └──────────────┘
```

## URL Routing

| URL | Target | Service |
|-----|--------|---------|
| `/live-documents/*` | Frontend SPA | live-documents-frontend:80 |
| `/live-documents/api/*` | REST + SignalR API | live-documents-backend:5000 |
| `/live-documents/hubs/*` | SignalR WebSocket | live-documents-backend:5000 |

All requests route through Traefik. Path prefix is stripped before forwarding to the target container.

## Directories

```
kimballbradford-com/
├── AGENTS.md
├── .env                          # Env vars (gitignored)
├── .env.example                  # Template for .env
├── .gitignore
├── .gitmodules
├── docker-compose.yml            # Base — all services + Traefik (HTTP only)
├── docker-compose.prod.yml       # Prod overlay — HTTPS, TLS, Let's Encrypt
├── traefik/
│   ├── .gitkeep
│   └── acme.json                 # Let's Encrypt certs (gitignored)
└── projects/
    └── live-documents/           # Git submodule
        ├── docker-compose.yml    # Standalone dev compose
        ├── frontend/             # Preact SPA
        └── backend/              # ASP.NET Core API
```

## Running

### Local (port 80, no HTTPS)

```bash
cp .env.example .env
# Edit .env: DOMAIN=localhost, COLLABEDIT_JWT_KEY=some-dev-key
docker compose up --build
# Visit: http://localhost/live-documents/
```

### Production (DigitalOcean Droplet, with HTTPS)

```bash
cp .env.example .env
# Edit .env: DOMAIN=kimballbradford.com, ACME_EMAIL=you@example.com, a real JWT key
touch traefik/acme.json && chmod 600 traefik/acme.json

docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

### Standalone dev (per project, no Traefik)

```bash
cd projects/live-documents
docker compose up --build
# Frontend: http://localhost:80
# Backend:  http://localhost:5000
```

Or with the Vite dev server for hot reloading:
```bash
cd projects/live-documents/frontend
npm run dev
```

## Adding a new project

1. Add a git submodule: `git submodule add <url> projects/<project-name>`
2. Add frontend and backend services to `docker-compose.yml` with:
   - Traefik labels for path-based routing (`PathPrefix(/<project-name>)`)
   - Backend APIs under `PathPrefix(/<project-name>/api)`
   - `VITE_API_PREFIX: /<project-name>` build arg for the frontend
3. If the backend needs HTTPS endpoints in production, add label overrides in `docker-compose.prod.yml`.
