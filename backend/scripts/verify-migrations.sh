#!/bin/bash

# Verify Prisma Migrations Setup
# This script checks if all migration files are in place and valid

set -e

echo "🔍 Verifying Prisma Migration Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must run from backend directory${NC}"
    exit 1
fi

# Check if prisma directory exists
if [ ! -d "prisma" ]; then
    echo -e "${RED}❌ Error: prisma directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prisma directory found${NC}"

# Check if schema.prisma exists
if [ ! -f "prisma/schema.prisma" ]; then
    echo -e "${RED}❌ Error: schema.prisma not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ schema.prisma found${NC}"

# Check if migrations directory exists
if [ ! -d "prisma/migrations" ]; then
    echo -e "${RED}❌ Error: migrations directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ migrations directory found${NC}"

# Check if migration_lock.toml exists
if [ ! -f "prisma/migrations/migration_lock.toml" ]; then
    echo -e "${RED}❌ Error: migration_lock.toml not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ migration_lock.toml found${NC}"

# Check if initial migration exists
if [ ! -d "prisma/migrations/20250204000000_init" ]; then
    echo -e "${RED}❌ Error: Initial migration not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Initial migration directory found${NC}"

# Check if migration.sql exists
if [ ! -f "prisma/migrations/20250204000000_init/migration.sql" ]; then
    echo -e "${RED}❌ Error: migration.sql not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ migration.sql found${NC}"

# Check if seed.ts exists
if [ ! -f "prisma/seed.ts" ]; then
    echo -e "${YELLOW}⚠️  Warning: seed.ts not found${NC}"
else
    echo -e "${GREEN}✅ seed.ts found${NC}"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Warning: node_modules not found. Run 'npm install'${NC}"
else
    echo -e "${GREEN}✅ node_modules found${NC}"
fi

# Check if @prisma/client is installed
if [ ! -d "node_modules/@prisma/client" ]; then
    echo -e "${YELLOW}⚠️  Warning: @prisma/client not installed. Run 'npm install'${NC}"
else
    echo -e "${GREEN}✅ @prisma/client installed${NC}"
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  Warning: DATABASE_URL environment variable not set${NC}"
    echo -e "${YELLOW}   Check your .env file${NC}"
else
    echo -e "${GREEN}✅ DATABASE_URL is set${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Migration setup verification complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Ensure PostgreSQL is running: docker-compose up -d postgres"
echo "2. Generate Prisma Client: npm run prisma:generate"
echo "3. Run migrations: npm run prisma:migrate"
echo "4. Seed database: npm run prisma:seed"
echo ""
