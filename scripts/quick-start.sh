#!/bin/bash

# Quick start script for Web3 Learning Platform
# This script sets up and starts the entire platform

set -e

echo "🚀 Web3 Learning Platform - Quick Start"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1/5:${NC} Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo -e "${GREEN}✓${NC} Prerequisites check passed"
echo ""

# Step 2: Set up environment variables
echo -e "${BLUE}Step 2/5:${NC} Setting up environment variables..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✓${NC} Created .env file from .env.example"
    echo -e "${YELLOW}⚠${NC}  Please edit .env and configure:"
    echo "   - JWT_SECRET (use a strong random string)"
    echo "   - INFURA_API_KEY (get from https://infura.io)"
    echo "   - ALCHEMY_API_KEY (optional, get from https://alchemy.com)"
    echo ""
    read -p "Press Enter to continue after editing .env, or Ctrl+C to exit..."
else
    echo -e "${GREEN}✓${NC} .env file already exists"
fi
echo ""

# Step 3: Build Docker images
echo -e "${BLUE}Step 3/5:${NC} Building Docker images..."
echo "This may take a few minutes on first run..."
docker-compose build
echo -e "${GREEN}✓${NC} Docker images built successfully"
echo ""

# Step 4: Start services
echo -e "${BLUE}Step 4/5:${NC} Starting services..."
docker-compose up -d
echo -e "${GREEN}✓${NC} All services started"
echo ""

# Step 5: Wait for services to be ready
echo -e "${BLUE}Step 5/5:${NC} Waiting for services to be ready..."
echo "Waiting for PostgreSQL..."
until docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; do
    sleep 1
done
echo -e "${GREEN}✓${NC} PostgreSQL is ready"

echo "Waiting for backend..."
until curl -s http://localhost:4000/health &> /dev/null; do
    sleep 1
done
echo -e "${GREEN}✓${NC} Backend is ready"

echo "Waiting for frontend..."
until curl -s http://localhost:3000 &> /dev/null; do
    sleep 1
done
echo -e "${GREEN}✓${NC} Frontend is ready"
echo ""

# Success message
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Web3 Learning Platform is running!${NC}"
echo ""
echo "Access the application:"
echo "  🌐 Frontend:      http://localhost"
echo "  🔌 Backend API:   http://localhost/api"
echo "  📦 MinIO Console: http://localhost:9001"
echo ""
echo "Useful commands:"
echo "  docker-compose logs -f        # View logs"
echo "  docker-compose ps             # Check status"
echo "  docker-compose down           # Stop services"
echo "  make help                     # See all available commands"
echo ""
echo "Next steps:"
echo "  1. Run database migrations: make db-migrate"
echo "  2. Seed initial data: make db-seed"
echo "  3. Open http://localhost in your browser"
echo ""
