# Data Storage

## Architecture

```
Host filesystem             Container
                  bind mount
./data/live-documents/ ───────► /data/
                                   │
                               SQLite
                           collabedit.db
```

All persistent data lives under `data/<project>/` at the repo root. Each project's backend container mount its data directory at `/data` inside the container. SQLite connection strings use `Data Source=/data/<name>.db` so the database file lands on the bind mount without interfering with the app's own `/app` directory.

## Why bind mounts instead of named volumes

Docker **named volumes** copy the image's directory contents into the volume on first use. **Bind mounts** do not — they overlay the host path directly, hiding whatever the image had at that mount point.

This is why we mount to `/data` (a directory the app doesn't use for its own files) rather than `/app` (where the compiled binaries live). Mounting a host directory to `/app` would hide the published `.dll` files, causing `dotnet CollabEdit.Api.dll` to fail with "The application does not exist".

## Directory layout

```
repo-root/
├── data/
│   ├── live-documents/
│   │   └── collabedit.db         ← SQLite database
│   └── future-project/           ← same pattern
│       └── project.db
├── docker-compose.yml            ← mount: ./data/live-documents:/data
└── projects/
    └── live-documents/
        └── docker-compose.yml    ← mount: ${LIVE_DOCS_DATA_DIR:-./data}:/data
```

## How paths resolve

| Where you run compose | Mount source resolves to | DB ends up at |
|---|---|---|
| Repo root (`./docker-compose.yml`) | `./data/live-documents/` (relative to repo root) | `<repo>/data/live-documents/collabedit.db` |
| Standalone submodule clone (`docker compose up`) | `./data/` (relative to submodule root) | `<clone>/data/collabedit.db` |
| Standalone *inside* umbrella repo (`projects/live-documents/`) | `./data/` (relative to `projects/live-documents/`) | `<repo>/projects/live-documents/data/collabedit.db` |

The last case uses a separate DB from the root compose. If you need them to share, pass `LIVE_DOCS_DATA_DIR`:

```bash
cd projects/live-documents
LIVE_DOCS_DATA_DIR=../../data/live-documents docker compose up
# → DB lands at <repo>/data/live-documents/collabedit.db
```

## Submodule env var

The standalone compose file uses a variable with a default:

```yaml
volumes:
  - ${LIVE_DOCS_DATA_DIR:-./data}:/data
```

- **Default** (`./data`): works as-is for standalone clones. Data stays local to the clone.
- **Override** (`../../data/live-documents`): shares data with the umbrella repo's project directory.

## SQLite connection string

All compose files pass the connection string via environment variable:

```yaml
environment:
  - ConnectionStrings:Default=Data Source=/data/collabedit.db
```

The path is always absolute (`/data/...`) because the mount target is `/data`. This ensures the DB file lands on the bind mount regardless of the container's working directory.

## Common pitfalls

- **Mounting to a file instead of a directory**: `./data/live-documents/collabedit.db:/data/collabedit.db` creates a *directory* at that path, causing SQLite to fail with `disk I/O error`. Always mount to `/data`, not `/data/collabedit.db`.
- **Mounting to `/app`**: Shadows the compiled app binaries. Bind mounts don't copy image contents like named volumes do. Use `/data` instead.
- **Missing `data/` directory**: Docker creates it on first mount, but it will be owned by root. If the container runs as a non-root user and can't write, pre-create it: `mkdir -p data/live-documents`.

## Backup and restore

Since data is just files on the host filesystem, backup is straightforward:

```bash
# Backup
rsync -avz ./data/ user@backup-server:backups/kimballbradford-data/

# Restore
rsync -avz user@backup-server:backups/kimballbradford-data/ ./data/

# Download from production
rsync -avz user@droplet:~/kimballbradford-com/data/ ./data/

# Upload to production (stop services first)
ssh user@droplet 'cd ~/kimballbradford-com && docker compose stop live-documents-backend'
rsync -avz ./data/ user@droplet:~/kimballbradford-com/data/
ssh user@droplet 'cd ~/kimballbradford-com && docker compose start live-documents-backend'
```

## gitignore

Both the root repo and each submodule have `data/` in their `.gitignore`:

| Location | File | Purpose |
|---|---|---|
| Root repo | `.gitignore` | Ignores `data/` at repo root |
| Submodule | `projects/live-documents/.gitignore` | Ignores `data/` inside standalone clones |

## Adding a new project

1. Add a mount in the project's `docker-compose.yml`:
   ```yaml
   volumes:
     - ${DATA_DIR:-./data}:/data
   ```
2. In the root compose, mount `./data/<project>:/data` with the appropriate connection string.
3. Add `data/` to the project's `.gitignore` if not already present.
