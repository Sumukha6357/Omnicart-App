# Omnicart

## Environment files

This repo uses separate env files for Docker and local development:

- `.env.docker` for Docker Compose
- `.env.local` for running locally
- `.env.example` as a template

## Docker setup (root)

```sh
docker compose up
```

Root Dockerfiles:

- `docker/api.Dockerfile`
- `docker/web.Dockerfile`

Compose variants:

- `docker-compose.yml` or `docker-compose.local.yml` for local containerized stack
- `docker-compose.dev.yml` for live-reload development containers
- `docker-compose.prod.yml` for production-style containers/images

### Commands

```sh
# Local (default)
docker compose up --build

# Explicit local
docker compose -f docker-compose.local.yml up --build

# Dev (hot reload)
docker compose -f docker-compose.dev.yml up --build

# Prod-style
docker compose -f docker-compose.prod.yml up --build -d
```

### Local development

Copy `.env.local` to `.env` (or load it in your shell) before running the backend or frontend locally:

```sh
copy .env.local .env
```
