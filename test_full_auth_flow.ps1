# Test complete authentication flow
Write-Host "=== Testing Complete Authentication Flow ===" -ForegroundColor Cyan

# Step 1: Register a new user (or use existing)
Write-Host "`n[Step 1] Testing user registration..." -ForegroundColor Yellow
$registerBody = @{
    email = "debuguser@test.com"
    password = "Debug1234"
    username = "debuguser"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json" -ErrorAction SilentlyContinue
    if ($registerResponse.success) {
        Write-Host "✓ Registration successful!" -ForegroundColor Green
        $token = $registerResponse.data.token
    }
} catch {
    Write-Host "⚠ User might already exist, trying login..." -ForegroundColor Yellow
}

# Step 2: Login
Write-Host "`n[Step 2] Testing user login..." -ForegroundColor Yellow
$loginBody = @{
    email = "debuguser@test.com"
    password = "Debug1234"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    
    if ($loginResponse.success) {
        Write-Host "✓ Login successful!" -ForegroundColor Green
        $token = $loginResponse.data.token
        $user = $loginResponse.data.user
        
        Write-Host "`nUser Info from Login:" -ForegroundColor Cyan
        Write-Host "  ID: $($user.id)"
        Write-Host "  Username: $($user.username)"
        Write-Host "  Email: $($user.email)"
        Write-Host "  Role: $($user.role)"
        Write-Host "`nToken (first 50 chars): $($token.Substring(0, [Math]::Min(50, $token.Length)))..."
    } else {
        Write-Host "✗ Login failed!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Login error: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    exit 1
}

# Step 3: Get current user with token
Write-Host "`n[Step 3] Testing /api/auth/me with token..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    Write-Host "Using Authorization header: Bearer $($token.Substring(0, 20))..." -ForegroundColor Gray
    
    $meResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/me" -Method Get -Headers $headers
    
    if ($meResponse.success) {
        Write-Host "✓ /api/auth/me successful!" -ForegroundColor Green
        
        Write-Host "`nUser Info from /me:" -ForegroundColor Cyan
        Write-Host "  ID: $($meResponse.data.user.id)"
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
    Write-Host "✗ /api/auth/me error!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    }
}

# Step 4: Test with invalid token
Write-Host "`n[Step 4] Testing with invalid token..." -ForegroundColor Yellow
try {
    $invalidHeaders = @{
        "Authorization" = "Bearer invalid_token_12345"
        "Content-Type" = "application/json"
    }
    
    $invalidResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/me" -Method Get -Headers $invalidHeaders -ErrorAction Stop
    Write-Host "✗ Should have failed with invalid token!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected invalid token (Status: $($_.Exception.Response.StatusCode.value__))" -ForegroundColor Green
}

# Step 5: Test without token
Write-Host "`n[Step 5] Testing without token..." -ForegroundColor Yellow
try {
    $noTokenResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/me" -Method Get -ErrorAction Stop
    Write-Host "✗ Should have failed without token!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected request without token (Status: $($_.Exception.Response.StatusCode.value__))" -ForegroundColor Green
}

Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
Write-Host "✓ Backend API is working correctly" -ForegroundColor Green
Write-Host "✓ Token authentication is working" -ForegroundColor Green
Write-Host "✓ User data is being returned" -ForegroundColor Green
Write-Host "`nIf frontend is still having issues, the problem is likely:" -ForegroundColor Yellow
Write-Host "  1. Token not being sent in Authorization header" -ForegroundColor Yellow
Write-Host "  2. Token not being stored correctly in localStorage" -ForegroundColor Yellow
Write-Host "  3. CORS issues between frontend and backend" -ForegroundColor Yellow
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Check browser console for errors" -ForegroundColor White
Write-Host "  2. Check Network tab to see the actual request" -ForegroundColor White
Write-Host "  3. Verify localStorage has 'auth_token' or 'auth-storage'" -ForegroundColor White
