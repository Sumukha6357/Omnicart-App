# Omnicart - Titanium Docker Management
# Standardized Makefile for Prod, Local, and Dev environments

DC=docker-compose
BASE=-f docker-compose.yml
PROD=-f docker-compose.prod.yml
LOCAL=-f docker-compose.local.yml
DEV=-f docker-compose.dev.yml

.PHONY: help prod-up prod-down prod-build prod-stop local-up local-down local-build local-stop dev-up dev-down dev-build dev-stop

help:
	@echo "Titanium Docker Management"
	@echo "Usage: make [env]-[action]"
	@echo ""
	@echo "Actions: up, down, build, stop"
	@echo "Environments: prod, local, dev"

# Production
prod-up:
	$(DC) $(BASE) $(PROD) up -d

prod-down:
	$(DC) $(BASE) $(PROD) down

prod-build:
	$(DC) $(BASE) $(PROD) build --no-cache

prod-stop:
	$(DC) $(BASE) $(PROD) stop

# Local (Docker)
local-up:
	$(DC) $(BASE) $(LOCAL) up -d

local-down:
	$(DC) $(BASE) $(LOCAL) down

local-build:
	$(DC) $(BASE) $(LOCAL) build --no-cache

local-stop:
	$(DC) $(BASE) $(LOCAL) stop

# Development (Hot-reload)
dev-up:
	$(DC) $(BASE) $(DEV) up -d

dev-down:
	$(DC) $(BASE) $(DEV) down

dev-build:
	$(DC) $(BASE) $(DEV) build --no-cache

dev-stop:
	$(DC) $(BASE) $(DEV) stop