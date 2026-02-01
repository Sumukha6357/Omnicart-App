# Omnicart

## Environment files

This repo uses separate env files for Docker and local development:

- `.env.docker` for Docker Compose
- `.env.local` for running locally
- `.env.example` as a template

### Docker Compose

```sh
docker compose up
```

Compose loads `.env.docker` automatically via `env_file` in `docker-compose.yml`.

### Local development

Copy `.env.local` to `.env` (or load it in your shell) before running the backend or frontend locally:

```sh
copy .env.local .env
```
