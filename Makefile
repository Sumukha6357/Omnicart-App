# ==============================
# Project Docker Operations
# ==============================

DC = docker compose
BASE = -f docker-compose.yml
DEV = -f docker-compose.dev.yml
PROD = -f docker-compose.prod.yml
LOCAL = -f docker-compose.local.yml

# Default service for generic exec target
SERVICE ?= backend

# ==============================
# ENVIRONMENTS
# ==============================

dev:
	$(DC) $(BASE) $(DEV) up -d --build

prod:
	$(DC) $(BASE) $(PROD) up -d --build

local:
	$(DC) $(BASE) $(LOCAL) up -d --build

# ==============================
# BASIC OPERATIONS
# ==============================

up:
	$(DC) $(BASE) up -d

build:
	$(DC) $(BASE) build

down:
	$(DC) $(BASE) down

stop:
	$(DC) $(BASE) stop

start:
	$(DC) $(BASE) start

restart:
	$(DC) $(BASE) down
	$(DC) $(BASE) up -d --build

# ==============================
# LOGGING & DEBUGGING
# ==============================

logs:
	$(DC) $(BASE) logs -f

logs-dev:
	$(DC) $(BASE) $(DEV) logs -f

logs-prod:
	$(DC) $(BASE) $(PROD) logs -f

logs-local:
	$(DC) $(BASE) $(LOCAL) logs -f

ps:
	$(DC) $(BASE) ps

# Generic shell into a service (default: backend)
exec:
	$(DC) $(BASE) exec $(SERVICE) sh

# Convenience shells for common services in this repo
exec-backend:
	$(DC) $(BASE) exec backend sh

exec-web:
	$(DC) $(BASE) exec web sh

exec-db:
	$(DC) $(BASE) exec db sh

exec-redis:
	$(DC) $(BASE) exec redis sh

# ==============================
# CLEAN & REBUILD
# ==============================

rebuild:
	$(DC) $(BASE) down --remove-orphans
	$(DC) $(BASE) up -d --build

rebuild-no-cache:
	$(DC) $(BASE) build --no-cache
	$(DC) $(BASE) up -d

reset:
	$(DC) $(BASE) down --rmi local --volumes --remove-orphans

clean:
	docker system prune -f

clean-all:
	docker system prune -a --volumes -f

# ==============================
# IMAGE OPERATIONS
# ==============================

images:
	docker images

pull:
	$(DC) $(BASE) pull

push:
	$(DC) $(BASE) push

# ==============================
# HEALTH CHECK
# ==============================

status:
	$(DC) $(BASE) ps

top:
	$(DC) $(BASE) top

stats:
	docker stats

# ==============================
# QUICK RUN TARGETS
# ==============================

run-dev: dev
run-local: local
run-prod: prod

.PHONY: dev prod local up build down stop start restart logs logs-dev logs-prod logs-local ps exec exec-backend exec-web exec-db exec-redis rebuild rebuild-no-cache reset clean clean-all images pull push status top stats run-dev run-local run-prod