#!/bin/bash

# Verification script for Web3 Learning Platform setup
# This script checks if all required components are properly configured

set -e

echo "🔍 Verifying Web3 Learning Platform Setup..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        return 1
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is missing"
        return 1
    fi
}

check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is missing"
        return 1
    fi
}

# Track errors
ERRORS=0

# Check prerequisites
echo "📋 Checking Prerequisites..."
check_command "docker" || ((ERRORS++))
check_command "docker-compose" || ((ERRORS++))
check_command "node" || ((ERRORS++))
check_command "npm" || ((ERRORS++))
check_command "git" || ((ERRORS++))
echo ""

# Check Node.js version
echo "📦 Checking Node.js Version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    echo -e "${GREEN}✓${NC} Node.js version is $NODE_VERSION (>= 18 required)"
else
    echo -e "${RED}✗${NC} Node.js version is $NODE_VERSION (>= 18 required)"
    ((ERRORS++))
fi
echo ""

# Check project structure
echo "📁 Checking Project Structure..."
check_directory "backend" || ((ERRORS++))
check_directory "frontend" || ((ERRORS++))
check_directory "nginx" || ((ERRORS++))
check_directory "database" || ((ERRORS++))
check_file "docker-compose.yml" || ((ERRORS++))
check_file ".env.example" || ((ERRORS++))
check_file "README.md" || ((ERRORS++))
echo ""

# Check backend structure
echo "🔧 Checking Backend Structure..."
check_file "backend/package.json" || ((ERRORS++))
check_file "backend/tsconfig.json" || ((ERRORS++))
check_file "backend/Dockerfile" || ((ERRORS++))
check_directory "backend/src" || ((ERRORS++))
check_directory "backend/prisma" || ((ERRORS++))
echo ""

# Check frontend structure
echo "⚛️  Checking Frontend Structure..."
check_file "frontend/package.json" || ((ERRORS++))
check_file "frontend/tsconfig.json" || ((ERRORS++))
check_file "frontend/Dockerfile" || ((ERRORS++))
check_file "frontend/next.config.js" || ((ERRORS++))
check_directory "frontend/src" || ((ERRORS++))
echo ""

# Check configuration files
echo "⚙️  Checking Configuration Files..."
check_file "nginx/nginx.conf" || ((ERRORS++))
check_file "backend/.eslintrc.json" || ((ERRORS++))
check_file "backend/.prettierrc" || ((ERRORS++))
check_file "frontend/.eslintrc.json" || ((ERRORS++))
check_file "frontend/.prettierrc" || ((ERRORS++))
echo ""

# Check environment variables
echo "🔐 Checking Environment Variables..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    
    # Check critical variables
    if grep -q "JWT_SECRET=your-super-secret" .env; then
        echo -e "${YELLOW}⚠${NC}  Warning: JWT_SECRET is still using default value"
    fi
    
    if grep -q "INFURA_API_KEY=your-infura" .env; then
        echo -e "${YELLOW}⚠${NC}  Warning: INFURA_API_KEY is not configured"
    fi
else
    echo -e "${YELLOW}⚠${NC}  .env file not found (copy from .env.example)"
fi
echo ""

# Check Docker
echo "🐳 Checking Docker..."
if docker info &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker daemon is running"
else
    echo -e "${RED}✗${NC} Docker daemon is not running"
    ((ERRORS++))
fi
echo ""

# Check Git
echo "📚 Checking Git Repository..."
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Git repository initialized"
else
    echo -e "${YELLOW}⚠${NC}  Git repository not initialized (run 'git init')"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Setup verification passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Copy .env.example to .env and configure it"
    echo "  2. Run 'docker-compose up -d' to start services"
    echo "  3. Run 'make db-migrate' to set up the database"
    echo "  4. Access the application at http://localhost"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Setup verification failed with $ERRORS error(s)${NC}"
    echo ""
    echo "Please fix the errors above and run this script again."
    echo ""
    exit 1
fi
