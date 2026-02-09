# Prisma Database Migrations

This directory contains the Prisma schema, migrations, and seed data for the Web3 Learning Platform.

## Directory Structure

```
prisma/
├── schema.prisma           # Database schema definition
├── migrations/             # Database migration files
│   ├── migration_lock.toml # Migration provider lock file
│   └── 20250204000000_init/
│       └── migration.sql   # Initial migration SQL
├── seed.ts                 # Seed data for development
└── README.md              # This file
```

## Prerequisites

- PostgreSQL 15+ running (via Docker or locally)
- Node.js 18+ installed
- Environment variables configured (see `.env.example`)

## Database Setup

### 1. Start PostgreSQL (using Docker)

```bash
# From project root
docker-compose up -d postgres
```

### 2. Generate Prisma Client

```bash
cd backend
npm run prisma:generate
```

This generates the Prisma Client based on your schema.

### 3. Run Migrations

#### Development Environment

```bash
npm run prisma:migrate
```

This will:
- Apply all pending migrations
- Generate Prisma Client
- Prompt for migration name if creating new migrations

#### Production Environment

```bash
npm run prisma:migrate:prod
```

This applies migrations without prompting (for CI/CD).

### 4. Seed the Database

```bash
npm run prisma:seed
```

This will populate the database with:
- **3 Users**: 1 admin, 2 regular users
- **3 Courses**: Beginner, Intermediate, Advanced levels
- **3 Chapters**: Sample course content
- **2 Challenges**: Programming exercises
- **8 Badges**: Achievement badges
- **2 Posts**: Community discussions
- **1 Comment**: Sample comment

#### Test Credentials

After seeding, you can login with:

**Admin Account:**
- Email: `admin@web3learning.com`
- Password: `admin123`

**User Account:**
- Email: `user1@example.com`
- Password: `user123`

## Common Commands

### View Database in Prisma Studio

```bash
npm run prisma:studio
```

Opens a web interface at `http://localhost:5555` to browse and edit data.

### Create a New Migration

```bash
# After modifying schema.prisma
npm run prisma:migrate
```

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

⚠️ **Warning**: This will:
1. Drop the database
2. Create a new database
3. Apply all migrations
4. Run seed script

### Check Migration Status

```bash
npx prisma migrate status
```

### Format Schema File

```bash
npx prisma format
```

## Migration Files

### Initial Migration (20250204000000_init)

The initial migration creates all tables with:

**Tables:**
- `users` - User accounts and profiles
- `courses` - Course information
- `chapters` - Course chapters with content
- `progress` - User learning progress
- `challenges` - Programming challenges
- `challenge_submits` - Challenge submissions
- `posts` - Community posts
- `comments` - Post comments
- `notes` - User notes
- `badges` - Achievement badges
- `user_badges` - User badge associations

**Enums:**
- `Role` - USER, ADMIN
- `Level` - BEGINNER, INTERMEDIATE, ADVANCED
- `Difficulty` - EASY, MEDIUM, HARD
- `BadgeLevel` - BRONZE, SILVER, GOLD

**Indexes:**
- Performance indexes on frequently queried fields
- Unique indexes for email, username, wallet addresses
- Foreign key indexes for relationships

## Seed Data Details

### Users

1. **Admin User**
   - Full platform access
   - Can manage courses, users, and content

2. **Regular Users**
   - One with email/password auth
   - One with wallet address (MetaMask)

### Courses

1. **区块链基础** (Blockchain Basics)
   - Level: BEGINNER
   - Duration: 120 minutes
   - 2 chapters with Markdown content

2. **Solidity 智能合约开发** (Solidity Smart Contract Development)
   - Level: INTERMEDIATE
   - Duration: 240 minutes
   - 1 chapter with code examples

3. **DApp 全栈开发** (Full-Stack DApp Development)
   - Level: ADVANCED
   - Duration: 360 minutes
   - Not yet published

### Challenges

1. **Hello World 合约**
   - Difficulty: EASY
   - Basic Solidity contract
   - Includes template and test cases

2. **简单存储合约**
   - Difficulty: EASY
   - Storage contract with getter/setter
   - Includes template and solution

### Badges

Achievement badges for:
- Course completion (1, 5, 10 courses)
- Challenge completion (1, 10, 30 challenges)
- Learning streaks (7 days)
- Community participation (10 posts/comments)

## Troubleshooting

### Migration Failed

```bash
# Check migration status
npx prisma migrate status

# If needed, mark migration as applied
npx prisma migrate resolve --applied "20250204000000_init"
```

### Database Connection Error

1. Check PostgreSQL is running:
   ```bash
   docker-compose ps postgres
   ```

2. Verify DATABASE_URL in `.env`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/web3_learning"
   ```

3. Test connection:
   ```bash
   npx prisma db pull
   ```

### Seed Script Fails

1. Ensure migrations are applied:
   ```bash
   npm run prisma:migrate
   ```

2. Check for existing data conflicts:
   ```bash
   npm run prisma:studio
   ```

3. Reset and reseed:
   ```bash
   npx prisma migrate reset
   ```

## Best Practices

1. **Always backup production data** before running migrations
2. **Test migrations** in development/staging first
3. **Use descriptive migration names** when creating new migrations
4. **Never edit applied migrations** - create new ones instead
5. **Keep seed data minimal** - only essential development data
6. **Version control** all migration files

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

## Support

For issues or questions:
1. Check the [Prisma GitHub Issues](https://github.com/prisma/prisma/issues)
2. Review project documentation
3. Contact the development team
