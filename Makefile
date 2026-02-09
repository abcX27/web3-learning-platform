.PHONY: help install dev build start stop restart logs clean test

# Default target
help:
	@echo "Web3 Learning Platform - Available Commands:"
	@echo ""
	@echo "  make install    - Install all dependencies"
	@echo "  make dev        - Start development environment"
	@echo "  make build      - Build all Docker images"
	@echo "  make start      - Start all services"
	@echo "  make stop       - Stop all services"
	@echo "  make restart    - Restart all services"
	@echo "  make logs       - View logs from all services"
	@echo "  make clean      - Clean up containers and volumes"
	@echo "  make test       - Run all tests"
	@echo "  make db-migrate - Run database migrations"
	@echo "  make db-seed    - Seed database with initial data"
	@echo "  make db-studio  - Open Prisma Studio"
	@echo ""

# Install dependencies
install:
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ Dependencies installed"

# Start development environment
dev:
	@echo "Starting development environment..."
	docker-compose up -d postgres redis minio
	@echo "✅ Database services started"
	@echo "Run 'cd backend && npm run dev' and 'cd frontend && npm run dev' in separate terminals"

# Build Docker images
build:
	@echo "Building Docker images..."
	docker-compose build
	@echo "✅ Images built"

# Start all services
start:
	@echo "Starting all services..."
	docker-compose up -d
	@echo "✅ All services started"
	@echo "Frontend: http://localhost"
	@echo "Backend: http://localhost/api"
	@echo "MinIO Console: http://localhost:9001"

# Stop all services
stop:
	@echo "Stopping all services..."
	docker-compose down
	@echo "✅ All services stopped"

# Restart all services
restart:
	@echo "Restarting all services..."
	docker-compose restart
	@echo "✅ All services restarted"

# View logs
logs:
	docker-compose logs -f

# Clean up
clean:
	@echo "Cleaning up containers and volumes..."
	docker-compose down -v
	@echo "✅ Cleanup complete"

# Run tests
test:
	@echo "Running backend tests..."
	cd backend && npm test
	@echo "Running frontend tests..."
	cd frontend && npm test
	@echo "✅ Tests complete"

# Database migrations
db-migrate:
	@echo "Running database migrations..."
	docker-compose exec backend npm run prisma:migrate
	@echo "✅ Migrations complete"

# Seed database
db-seed:
	@echo "Seeding database..."
	docker-compose exec backend npm run prisma:seed
	@echo "✅ Database seeded"

# Open Prisma Studio
db-studio:
	@echo "Opening Prisma Studio..."
	cd backend && npm run prisma:studio

# Health check
health:
	@echo "Checking service health..."
	@curl -s http://localhost/health || echo "❌ Services not responding"
	@curl -s http://localhost/api/health || echo "❌ Backend not responding"
	@echo "✅ Health check complete"
