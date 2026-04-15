#!/bin/bash
set -e

cd /var/www/html

echo "============================================="
echo "  Clinic SaaS Platform - API Container"
echo "============================================="

# ── 1. Install PHP dependencies ──────────────────────────────────────────────
if [ ! -d "vendor" ] || [ ! -f "vendor/autoload.php" ]; then
    echo "[1/5] Installing Composer dependencies..."
    composer install --no-interaction --optimize-autoloader
else
    echo "[1/5] Composer dependencies already installed."
fi

# ── 2. Create .env if missing ────────────────────────────────────────────────
if [ ! -f ".env" ]; then
    echo "[2/5] Creating .env from .env.example..."
    cp .env.example .env
else
    echo "[2/5] .env already exists."
fi

# ── 3. Generate APP_KEY if not set ───────────────────────────────────────────
if grep -q "^APP_KEY=$" .env 2>/dev/null; then
    echo "[3/5] Generating application key..."
    php artisan key:generate --force
else
    echo "[3/5] APP_KEY already set."
fi

# ── 4. Generate JWT secret if not set ────────────────────────────────────────
if ! grep -q "^JWT_SECRET=" .env 2>/dev/null || grep -q "^JWT_SECRET=$" .env 2>/dev/null; then
    echo "[4/5] Generating JWT secret..."
    php artisan jwt:secret --force 2>/dev/null || echo "  (jwt:secret skipped — run manually if needed)"
else
    echo "[4/5] JWT_SECRET already set."
fi

# ── 5. Ensure Laravel writable directories exist ────────────────────────────
mkdir -p bootstrap/cache storage/framework/cache storage/framework/sessions storage/framework/views
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# ── 6. Wait for PostgreSQL then run migrations ──────────────────────────────
echo "[5/5] Waiting for PostgreSQL..."
MAX_RETRIES=30
RETRY=0
until php artisan db:monitor --databases=pgsql > /dev/null 2>&1 || [ $RETRY -ge $MAX_RETRIES ]; do
    RETRY=$((RETRY + 1))
    echo "  Waiting for database... ($RETRY/$MAX_RETRIES)"
    sleep 2
done

if [ $RETRY -lt $MAX_RETRIES ]; then
    echo "  Database is ready!"

    # Run migrations
    echo "  Running migrations..."
    php artisan migrate --force 2>&1 || echo "  (migrations may have already run)"

    # Seed if plans table is empty
    PLAN_COUNT=$(php artisan tinker --execute="echo \App\Models\Plan::count();" 2>/dev/null || echo "0")
    if [ "$PLAN_COUNT" = "0" ]; then
        echo "  Seeding database..."
        php artisan db:seed --force 2>&1 || echo "  (seeding may have already run)"
    else
        echo "  Database already seeded ($PLAN_COUNT plans found)."
    fi
else
    echo "  WARNING: Database not available after $MAX_RETRIES retries."
    echo "  Migrations skipped. Run manually: docker compose exec api php artisan migrate --seed"
fi

# ── Fix permissions ──────────────────────────────────────────────────────────
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

echo ""
echo "============================================="
echo "  API is ready! Listening on :9000"
echo "============================================="
echo ""

# Execute the CMD (php-fpm)
exec "$@"
