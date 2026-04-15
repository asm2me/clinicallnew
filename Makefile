# ============================================================================
#  Clinic SaaS Platform - Docker-Only Makefile
#  No PHP, Node, Composer, or npm needed on host. Everything runs in Docker.
# ============================================================================

.PHONY: help up down build fresh migrate seed test shell logs status \
        artisan tinker horizon mobile-install mobile-start

# Default
.DEFAULT_GOAL := help

# ── Help ────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  ╔══════════════════════════════════════════════════════════════╗"
	@echo "  ║           Clinic SaaS Platform  (Docker-Only)              ║"
	@echo "  ╠══════════════════════════════════════════════════════════════╣"
	@echo "  ║  make up          Start all services                       ║"
	@echo "  ║  make down        Stop all services                        ║"
	@echo "  ║  make build       Rebuild Docker images from scratch       ║"
	@echo "  ║  make status      Show running containers                  ║"
	@echo "  ║  make logs        Follow all logs                          ║"
	@echo "  ║  make logs-api    Follow API logs only                     ║"
	@echo "  ║                                                            ║"
	@echo "  ║  make migrate     Run database migrations                  ║"
	@echo "  ║  make seed        Run database seeders                     ║"
	@echo "  ║  make fresh       Drop all + migrate + seed                ║"
	@echo "  ║                                                            ║"
	@echo "  ║  make shell       Shell into API container                 ║"
	@echo "  ║  make tinker      Open Laravel Tinker                      ║"
	@echo "  ║  make artisan     Run artisan (e.g. make artisan c=...)    ║"
	@echo "  ║                                                            ║"
	@echo "  ║  make test        Run backend tests                        ║"
	@echo "  ║  make test-fe     Type-check frontend                      ║"
	@echo "  ║                                                            ║"
	@echo "  ║  make npm c=...   Run npm command in frontend container    ║"
	@echo "  ║  make composer c=...  Run composer in API container        ║"
	@echo "  ╚══════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "  First time?  Just run:  make up"
	@echo "  Everything installs automatically inside Docker."
	@echo ""

# ── Services ────────────────────────────────────────────────────────────────
up:
	docker compose up -d --build
	@echo ""
	@echo "  ✅ All services starting!"
	@echo ""
	@echo "  ┌─────────────────────────────────────────────────────┐"
	@echo "  │  API (Laravel)    →  http://localhost:8000          │"
	@echo "  │  Frontend (Next)  →  http://localhost:3000          │"
	@echo "  │  pgAdmin          →  http://localhost:5050          │"
	@echo "  │  Mailhog          →  http://localhost:8025          │"
	@echo "  │  MinIO Console    →  http://localhost:9001          │"
	@echo "  │  Horizon          →  http://localhost:8000/horizon  │"
	@echo "  └─────────────────────────────────────────────────────┘"
	@echo ""
	@echo "  Watch logs:  make logs"
	@echo ""

down:
	docker compose down

stop:
	docker compose stop

restart:
	docker compose restart

build:
	docker compose build --no-cache

status:
	docker compose ps

# ── Logs ────────────────────────────────────────────────────────────────────
logs:
	docker compose logs -f

logs-api:
	docker compose logs -f api nginx

logs-fe:
	docker compose logs -f frontend

logs-horizon:
	docker compose logs -f horizon

# ── Database ────────────────────────────────────────────────────────────────
migrate:
	docker compose exec api php artisan migrate --force

seed:
	docker compose exec api php artisan db:seed --force

fresh:
	docker compose exec api php artisan migrate:fresh --seed --force

rollback:
	docker compose exec api php artisan migrate:rollback

# ── Laravel Commands (inside Docker) ────────────────────────────────────────
shell:
	docker compose exec api sh

shell-fe:
	docker compose exec frontend sh

tinker:
	docker compose exec api php artisan tinker

# Usage: make artisan c="make:controller FooController"
artisan:
	docker compose exec api php artisan $(c)

# Usage: make composer c="require package/name"
composer:
	docker compose exec api composer $(c)

# Usage: make npm c="install some-package"
npm:
	docker compose exec frontend npm $(c)

# ── Cache ────────────────────────────────────────────────────────────────────
cache-clear:
	docker compose exec api php artisan cache:clear
	docker compose exec api php artisan config:clear
	docker compose exec api php artisan route:clear
	docker compose exec api php artisan view:clear

optimize:
	docker compose exec api php artisan config:cache
	docker compose exec api php artisan route:cache
	docker compose exec api php artisan view:cache
	docker compose exec api php artisan event:cache

# ── Testing ──────────────────────────────────────────────────────────────────
test:
	docker compose exec api php artisan test

test-coverage:
	docker compose exec api php artisan test --coverage-text

test-fe:
	docker compose exec frontend npm run type-check
	docker compose exec frontend npm run lint

# ── Create Tenant (helper) ──────────────────────────────────────────────────
# Usage: make create-tenant name="My Clinic" email="admin@clinic.com" password="secret123"
create-tenant:
	docker compose exec api php artisan tinker --execute="\
		app(\App\Services\TenantService::class)->provision([ \
			'name' => '$(name)', \
			'email' => '$(email)', \
			'password' => '$(password)', \
			'plan' => 'basic', \
		]); \
		echo 'Tenant created!'; \
	"

# ── Reset Everything ────────────────────────────────────────────────────────
nuke:
	@echo "⚠️  This will DELETE all data (volumes, containers, images)."
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	docker compose down -v --rmi local --remove-orphans
	@echo "  All cleared. Run 'make up' to start fresh."

# ── Mobile (requires Node on host OR use Docker) ────────────────────────────
mobile-install:
	docker run --rm -v $(PWD)/mobile:/app -w /app node:20-alpine npm install

mobile-start:
	@echo "  Note: Expo needs host network access for device connections."
	@echo "  If you have Node installed: cd mobile && npm start"
	@echo "  Otherwise use Docker:"
	docker run --rm -it -v $(PWD)/mobile:/app -w /app -p 8081:8081 -p 19000:19000 -p 19001:19001 node:20-alpine sh -c "npm install && npx expo start --tunnel"
