# Verify Prisma Migrations Setup
# This script checks if all migration files are in place and valid

Write-Host "🔍 Verifying Prisma Migration Setup..." -ForegroundColor Cyan
Write-Host ""

$ErrorCount = 0
$WarningCount = 0

# Check if we're in the backend directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Must run from backend directory" -ForegroundColor Red
    exit 1
}

# Check if prisma directory exists
if (-not (Test-Path "prisma")) {
    Write-Host "❌ Error: prisma directory not found" -ForegroundColor Red
    $ErrorCount++
} else {
    Write-Host "✅ Prisma directory found" -ForegroundColor Green
}

# Check if schema.prisma exists
if (-not (Test-Path "prisma/schema.prisma")) {
    Write-Host "❌ Error: schema.prisma not found" -ForegroundColor Red
    $ErrorCount++
} else {
    Write-Host "✅ schema.prisma found" -ForegroundColor Green
}

# Check if migrations directory exists
if (-not (Test-Path "prisma/migrations")) {
    Write-Host "❌ Error: migrations directory not found" -ForegroundColor Red
    $ErrorCount++
} else {
    Write-Host "✅ migrations directory found" -ForegroundColor Green
}

# Check if migration_lock.toml exists
if (-not (Test-Path "prisma/migrations/migration_lock.toml")) {
    Write-Host "❌ Error: migration_lock.toml not found" -ForegroundColor Red
    $ErrorCount++
} else {
    Write-Host "✅ migration_lock.toml found" -ForegroundColor Green
}

# Check if initial migration exists
if (-not (Test-Path "prisma/migrations/20250204000000_init")) {
    Write-Host "❌ Error: Initial migration not found" -ForegroundColor Red
    $ErrorCount++
} else {
    Write-Host "✅ Initial migration directory found" -ForegroundColor Green
}

# Check if migration.sql exists
if (-not (Test-Path "prisma/migrations/20250204000000_init/migration.sql")) {
    Write-Host "❌ Error: migration.sql not found" -ForegroundColor Red
    $ErrorCount++
} else {
    Write-Host "✅ migration.sql found" -ForegroundColor Green
}

# Check if seed.ts exists
if (-not (Test-Path "prisma/seed.ts")) {
    Write-Host "⚠️  Warning: seed.ts not found" -ForegroundColor Yellow
    $WarningCount++
} else {
    Write-Host "✅ seed.ts found" -ForegroundColor Green
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Warning: node_modules not found. Run 'npm install'" -ForegroundColor Yellow
    $WarningCount++
} else {
    Write-Host "✅ node_modules found" -ForegroundColor Green
}

# Check if @prisma/client is installed
if (-not (Test-Path "node_modules/@prisma/client")) {
    Write-Host "⚠️  Warning: @prisma/client not installed. Run 'npm install'" -ForegroundColor Yellow
    $WarningCount++
} else {
    Write-Host "✅ @prisma/client installed" -ForegroundColor Green
}

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
    Write-Host "⚠️  Warning: DATABASE_URL environment variable not set" -ForegroundColor Yellow
    Write-Host "   Check your .env file" -ForegroundColor Yellow
    $WarningCount++
} else {
    Write-Host "✅ DATABASE_URL is set" -ForegroundColor Green
}

Write-Host ""

if ($ErrorCount -gt 0) {
    Write-Host "❌ Verification failed with $ErrorCount error(s)" -ForegroundColor Red
    exit 1
} elseif ($WarningCount -gt 0) {
    Write-Host "⚠️  Verification completed with $WarningCount warning(s)" -ForegroundColor Yellow
} else {
    Write-Host "🎉 Migration setup verification complete!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Ensure PostgreSQL is running: docker-compose up -d postgres"
Write-Host "2. Generate Prisma Client: npm run prisma:generate"
Write-Host "3. Run migrations: npm run prisma:migrate"
Write-Host "4. Seed database: npm run prisma:seed"
Write-Host ""
