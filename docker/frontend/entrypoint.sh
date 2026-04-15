#!/bin/sh
set -e

cd /app

echo "============================================="
echo "  Clinic SaaS Platform - Frontend Container"
echo "============================================="

if [ ! -d "node_modules" ]; then
    echo "[1/2] Installing npm dependencies..."
    npm install
else
    echo "[1/2] node_modules already exists."
fi

echo "[2/2] Starting Next.js dev server..."
echo ""

exec "$@"
