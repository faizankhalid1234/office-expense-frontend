#!/bin/sh
set -e

cd /app

export HOSTNAME="0.0.0.0"
export PORT="${PORT:-3000}"

echo "[start] DATABASE_URL set: ${DATABASE_URL:+yes}"
echo "[start] Running prisma db push..."
npx prisma db push --config=prisma.config.ts --accept-data-loss

echo "[start] Seeding database (non-fatal)..."
npx tsx prisma/seed.ts || echo "[start] Seed skipped"

echo "[start] Starting Next.js on 0.0.0.0:${PORT}..."
exec npx next start -H 0.0.0.0 -p "$PORT"
