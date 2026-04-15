# Clinic SaaS Platform - Makefile

.PHONY: help up down build fresh migrate seed test install shell

# ── Help ──────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  Clinic SaaS Platform"
	@echo "  ─────────────────────────────────────────────"
	@echo "  make install   → First-time project setup"
	@echo "  make up        → Start all services"
	@echo "  make down      → Stop all services"
	@echo "  make build     → Rebuild Docker images"
	@echo "  make fresh     → Fresh migrate + seed"
	@echo "  make migrate   → Run migrations"
	@echo "  make seed      → Run seeders"
	@echo "  make test      → Run all tests"
	@echo "  make shell     → Shell into API container"
	@echo "  make horizon   → Open Horizon dashboard"
	@echo ""

# ── First-time setup ──────────────────────────────────────────────────────────
install:
	cp -n .env.example .env || true
	cp -n backend/.env.example backend/.env || true
	cd backend && composer install
	cd frontend && npm install
	cd mobile && npm install
	docker compose build
	docker compose up -d
	sleep 5
	docker compose exec api php artisan key:generate
	docker compose exec api php artisan migrate --seed
	@echo ""
	@echo "✅ Setup complete!"
	@echo "   API:      http://localhost:8000"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Mailhog:  http://localhost:8025"
	@echo "   MinIO:    http://localhost:9001"

# ── Services ──────────────────────────────────────────────────────────────────
up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build --no-cache

restart:
	docker compose restart

# ── Database ──────────────────────────────────────────────────────────────────
migrate:
	docker compose exec api php artisan migrate

migrate-fresh:
	docker compose exec api php artisan migrate:fresh

seed:
	docker compose exec api php artisan db:seed

fresh: migrate-fresh seed

# ── Testing ───────────────────────────────────────────────────────────────────
test:
	docker compose exec api php artisan test

test-backend:
	docker compose exec api php artisan test --coverage-text

test-frontend:
	cd frontend && npm run type-check && npm run lint

# ── Development ───────────────────────────────────────────────────────────────
shell:
	docker compose exec api sh

shell-nginx:
	docker compose exec nginx sh

logs:
	docker compose logs -f api nginx

horizon:
	@echo "Open: http://localhost:8000/horizon"

# ── Artisan shortcuts ─────────────────────────────────────────────────────────
cache-clear:
	docker compose exec api php artisan cache:clear
	docker compose exec api php artisan config:clear
	docker compose exec api php artisan route:clear
	docker compose exec api php artisan view:clear

optimize:
	docker compose exec api php artisan config:cache
	docker compose exec api php artisan route:cache
	docker compose exec api php artisan view:cache

tinker:
	docker compose exec api php artisan tinker

# ── Mobile ────────────────────────────────────────────────────────────────────
mobile-start:
	cd mobile && npm start

mobile-android:
	cd mobile && npm run android

mobile-ios:
	cd mobile && npm run ios
