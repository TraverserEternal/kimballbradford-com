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
portfolio/
├── AGENTS.md
├── .env                     # Production env vars (gitignored)
├── .env.example             # Template for .env
├── .gitignore
├── .gitmodules
├── docker-compose.prod.yml  # Production — all services + Traefik
├── traefik/
│   └── acme.json            # Let's Encrypt certs (auto-created, gitignored)
└── projects/
    └── live-documents/      # Git submodule
        ├── docker-compose.yml     # Standalone dev compose
        ├── frontend/              # Preact SPA
        └── backend/               # ASP.NET Core API
```

## Development

Each project runs independently using its own `docker-compose.yml`:

```bash
# Dev mode — standalone, hot reload, no Traefik
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

## Production (DigitalOcean Droplet)

### First-time setup

```bash
# On the droplet
git clone https://github.com/kimballbradford/portfolio.git
cd portfolio
git submodule update --init
cp .env.example .env
# Edit .env with your domain, email, and secrets
touch traefik/acme.json && chmod 600 traefik/acme.json

docker compose -f docker-compose.prod.yml up --build -d
```

### Submodule URLs

The `projects/live-documents` submodule points to `https://github.com/kimballbradford/CollabEdit.git`. Before deploying, push the CollabEdit repo to GitHub and update `.gitmodules` if the URL differs.

### Add a new project

1. Add a new git submodule: `git submodule add <url> projects/<project-name>`
2. Add frontend and backend services to `docker-compose.prod.yml` with:
   - Traefik labels for path-based routing (`PathPrefix(/<project-name>)`)
   - The backend APIs under `PathPrefix(/<project-name>/api)`
   - `VITE_API_PREFIX: /<project-name>` build arg for the frontend
3. Add to this file's URL routing table
