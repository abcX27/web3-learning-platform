# Test profile API
Write-Host "Testing /api/auth/me endpoint..." -ForegroundColor Cyan

# First, login to get a token
Write-Host "`nStep 1: Login to get token..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "Test1234"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    
    if ($loginResponse.success) {
        Write-Host "✓ Login successful!" -ForegroundColor Green
        $token = $loginResponse.data.token
        Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    } else {
        Write-Host "✗ Login failed!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Login error: $_" -ForegroundColor Red
    exit 1
}

# Test /api/auth/me with token
Write-Host "`nStep 2: Test /api/auth/me with token..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $meResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/me" -Method Get -Headers $headers
    
    if ($meResponse.success) {
        Write-Host "✓ /api/auth/me successful!" -ForegroundColor Green
        Write-Host "`nUser Info:" -ForegroundColor Cyan
        Write-Host "  Username: $($meResponse.data.user.username)"
        Write-Host "  Email: $($meResponse.data.user.email)"
        Write-Host "  Role: $($meResponse.data.user.role)"
        
        if ($meResponse.data.user.stats) {
            Write-Host "`nStats:" -ForegroundColor Cyan
            Write-Host "  Total Courses: $($meResponse.data.user.stats.totalCourses)"
            Write-Host "  Completed Courses: $($meResponse.data.user.stats.completedCourses)"
            Write-Host "  Total Challenges: $($meResponse.data.user.stats.totalChallenges)"
            Write-Host "  Completed Challenges: $($meResponse.data.user.stats.completedChallenges)"
            Write-Host "  Total Badges: $($meResponse.data.user.stats.totalBadges)"
            Write-Host "  Total Hours: $($meResponse.data.user.stats.totalHours)"
        }
    } else {
        Write-Host "✗ /api/auth/me failed!" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ /api/auth/me error: $_" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`nTest completed!" -ForegroundColor Cyan
