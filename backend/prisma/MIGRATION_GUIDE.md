# Database Migration Guide

This guide explains how to set up and run database migrations for the Web3 Learning Platform.

## Quick Start

### Option 1: Using Docker (Recommended)

```bash
# 1. Start PostgreSQL container
docker-compose up -d postgres

# 2. Wait for PostgreSQL to be ready (check health)
docker-compose ps postgres

# 3. Install dependencies (if not already done)
cd backend
npm install

# 4. Generate Prisma Client
npm run prisma:generate

# 5. Run migrations
npm run prisma:migrate

# 6. Seed the database
npm run prisma:seed

# 7. (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### Option 2: Using Local PostgreSQL

```bash
# 1. Ensure PostgreSQL is running locally
# Default connection: postgresql://postgres:password@localhost:5432/web3_learning

# 2. Create database (if not exists)
createdb web3_learning

# 3. Install dependencies
cd backend
npm install

# 4. Generate Prisma Client
npm run prisma:generate

# 5. Run migrations
npm run prisma:migrate

# 6. Seed the database
npm run prisma:seed
```

## Environment Setup

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/web3_learning"

# For Docker
# DATABASE_URL="postgresql://postgres:password@postgres:5432/web3_learning"

# Other required variables
NODE_ENV=development
JWT_SECRET=your-secret-key
PORT=4000
```

## Migration Commands

### Apply Migrations

```bash
# Development (interactive)
npm run prisma:migrate

# Production (non-interactive)
npm run prisma:migrate:prod
```

### Create New Migration

After modifying `schema.prisma`:

```bash
npm run prisma:migrate
# Enter migration name when prompted
```

### Reset Database (Development Only)

⚠️ **Warning**: This will delete all data!

```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Create a new database
3. Apply all migrations
4. Run the seed script

### Check Migration Status

```bash
npx prisma migrate status
```

### Resolve Migration Issues

If a migration fails:

```bash
# Mark as applied (if manually fixed)
npx prisma migrate resolve --applied "20250204000000_init"

# Mark as rolled back
npx prisma migrate resolve --rolled-back "20250204000000_init"
```

## Seed Data

### Run Seed Script

```bash
npm run prisma:seed
```

### What Gets Seeded

- **3 Users**:
  - Admin: `admin@web3learning.com` / `admin123`
  - User 1: `user1@example.com` / `user123`
  - User 2: `user2@example.com` / `user123` (with wallet)

- **3 Courses**:
  - 区块链基础 (Beginner)
  - Solidity 智能合约开发 (Intermediate)
  - DApp 全栈开发 (Advanced)

- **3 Chapters**: Sample content with Markdown and code examples

- **2 Challenges**: Programming exercises with templates

- **8 Badges**: Achievement badges for various milestones

- **2 Posts + 1 Comment**: Sample community content

### Customize Seed Data

Edit `backend/prisma/seed.ts` to add or modify seed data.

## Prisma Studio

View and edit database data in a web interface:

```bash
npm run prisma:studio
```

Opens at: `http://localhost:5555`

## Troubleshooting

### "Database does not exist"

```bash
# Create the database
createdb web3_learning

# Or using psql
psql -U postgres -c "CREATE DATABASE web3_learning;"
```

### "Migration failed to apply"

1. Check PostgreSQL is running:
   ```bash
   docker-compose ps postgres
   # or
   pg_isready -h localhost -p 5432
   ```

2. Check connection string in `.env`

3. Try resetting (development only):
   ```bash
   npx prisma migrate reset
   ```

### "Prisma Client not generated"

```bash
npm run prisma:generate
```

### "Cannot find module '@prisma/client'"

```bash
npm install
npm run prisma:generate
```

### "Seed script fails"

1. Ensure migrations are applied:
   ```bash
   npm run prisma:migrate
   ```

2. Check for data conflicts:
   ```bash
   npm run prisma:studio
   ```

3. Reset and reseed:
   ```bash
   npx prisma migrate reset
   ```

## Production Deployment

### 1. Prepare Environment

```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://user:password@host:5432/dbname"
export NODE_ENV=production
```

### 2. Run Migrations

```bash
npm run prisma:migrate:prod
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. (Optional) Seed Initial Data

```bash
# Only if you want initial data in production
npm run prisma:seed
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Database Migrations
  run: |
    cd backend
    npm install
    npm run prisma:generate
    npm run prisma:migrate:prod
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Docker Compose

The `docker-compose.yml` already includes:
- PostgreSQL service with health checks
- Volume for data persistence
- Init script at `database/init.sql`

## Best Practices

1. ✅ **Always backup production data** before migrations
2. ✅ **Test migrations** in staging environment first
3. ✅ **Use descriptive migration names**
4. ✅ **Never edit applied migrations** - create new ones
5. ✅ **Keep seed data minimal** - only essential data
6. ✅ **Version control** all migration files
7. ✅ **Review generated SQL** before applying
8. ✅ **Use transactions** for complex migrations

## Migration Workflow

### Development

```bash
# 1. Modify schema.prisma
# 2. Create migration
npm run prisma:migrate
# 3. Test changes
npm run prisma:studio
# 4. Commit migration files
git add prisma/migrations/
git commit -m "Add new migration"
```

### Production

```bash
# 1. Pull latest code
git pull origin main

# 2. Backup database
pg_dump -U postgres web3_learning > backup.sql

# 3. Apply migrations
npm run prisma:migrate:prod

# 4. Verify
npm run prisma:studio

# 5. If issues, restore backup
psql -U postgres web3_learning < backup.sql
```

## Additional Resources

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

For issues:
1. Check this guide
2. Review Prisma documentation
3. Check project README
4. Contact development team
