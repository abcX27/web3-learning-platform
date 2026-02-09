# Setup Guide - Web3 Learning Platform

This guide will help you set up the Web3 Learning Platform development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (v20.10+)
- **Docker Compose** (v2.0+)
- **Node.js** (v18.0+)
- **npm** (v9.0+)
- **Git**

## Quick Start with Docker

The fastest way to get started is using Docker Compose:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd web3-learning-platform
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file and update the following critical variables:

```env
# Generate a strong JWT secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Add your Web3 provider API keys
INFURA_API_KEY=your-infura-api-key
ALCHEMY_API_KEY=your-alchemy-api-key
```

### 3. Start All Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- Redis cache (port 6379)
- MinIO object storage (port 9000, console 9001)
- Backend API (port 4000)
- Frontend (port 3000)
- Nginx reverse proxy (port 80)

### 4. Check Service Health

```bash
# Check all containers are running
docker-compose ps

# Check backend health
curl http://localhost/api/health

# Check frontend
curl http://localhost
```

### 5. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **MinIO Console**: http://localhost:9001 (login: minioadmin/minioadmin)

## Local Development Setup

For active development, you may want to run services locally:

### Backend Development

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Start PostgreSQL and Redis** (using Docker)
   ```bash
   docker-compose up -d postgres redis minio
   ```

3. **Set Up Database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Seed database (optional)
   npm run prisma:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   The backend will be available at http://localhost:4000

### Frontend Development

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:3000

## Database Management

### View Database with Prisma Studio

```bash
cd backend
npm run prisma:studio
```

This opens a GUI at http://localhost:5555 to view and edit database records.

### Create a New Migration

```bash
cd backend
npm run prisma:migrate
```

### Reset Database

```bash
cd backend
npx prisma migrate reset
```

## Testing

### Run Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run property-based tests
npm run test:property

# Run with coverage
npm test -- --coverage
```

### Run Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Common Issues and Solutions

### Issue: Port Already in Use

If you get a "port already in use" error:

```bash
# Find and kill the process using the port
# On Linux/Mac:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Docker Containers Won't Start

```bash
# Stop all containers
docker-compose down

# Remove volumes (WARNING: This deletes all data)
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

### Issue: Database Connection Failed

1. Ensure PostgreSQL container is running:
   ```bash
   docker-compose ps postgres
   ```

2. Check PostgreSQL logs:
   ```bash
   docker-compose logs postgres
   ```

3. Verify DATABASE_URL in .env matches the container configuration

### Issue: Frontend Can't Connect to Backend

1. Check backend is running:
   ```bash
   curl http://localhost:4000/health
   ```

2. Verify NEXT_PUBLIC_API_URL in frontend .env:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| DATABASE_URL | PostgreSQL connection string | - | Yes |
| JWT_SECRET | Secret for JWT tokens | - | Yes |
| REDIS_URL | Redis connection string | redis://redis:6379 | Yes |
| INFURA_API_KEY | Infura API key for blockchain | - | Yes |
| ALCHEMY_API_KEY | Alchemy API key (alternative) | - | No |
| MINIO_* | MinIO configuration | See .env.example | Yes |
| PORT | Backend server port | 4000 | No |
| NODE_ENV | Environment (development/production) | development | No |

### Frontend (.env.local)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:4000 | Yes |

## Production Deployment

### Build for Production

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

### Deploy with Docker

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Start production services
docker-compose up -d
```

### Environment Configuration

For production, ensure you:

1. **Change all default passwords and secrets**
2. **Use strong JWT_SECRET**
3. **Configure proper CORS_ORIGIN**
4. **Set up SSL certificates for Nginx**
5. **Configure proper database backups**
6. **Set up monitoring and logging**

## Monitoring and Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Backend Logs

Backend logs are stored in `backend/logs/`:
- `error.log` - Error logs
- `combined.log` - All logs

## Backup and Restore

### Backup Database

```bash
docker-compose exec postgres pg_dump -U postgres web3_learning > backup.sql
```

### Restore Database

```bash
docker-compose exec -T postgres psql -U postgres web3_learning < backup.sql
```

## Next Steps

After setup is complete:

1. **Review the Requirements**: See `.kiro/specs/web3-learning-platform/requirements.md`
2. **Check the Design**: See `.kiro/specs/web3-learning-platform/design.md`
3. **Follow the Tasks**: See `.kiro/specs/web3-learning-platform/tasks.md`
4. **Start Development**: Begin with Phase 1 tasks

## Getting Help

- Check the [README.md](README.md) for project overview
- Review the [API Documentation](http://localhost:4000/api/docs) (when backend is running)
- Check Docker logs for errors
- Ensure all prerequisites are installed

## Useful Commands

```bash
# Stop all services
docker-compose down

# Restart a service
docker-compose restart backend

# View resource usage
docker stats

# Clean up Docker
docker system prune -a

# Update dependencies
cd backend && npm update
cd frontend && npm update
```

---

**Setup Complete!** 🎉

You're now ready to start developing the Web3 Learning Platform.
