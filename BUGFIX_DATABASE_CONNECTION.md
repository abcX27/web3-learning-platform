# Database Connection Issue Fix

## Date: 2026-02-09

## Problem Summary

Users encountered two critical issues:
1. **Profile page error**: "加载个人资料失败" (Failed to load profile)
2. **Login page error**: Database connection error - "Can't reach database server at 'localhost:5432'"

## Root Cause Analysis

### Primary Issue: Corrupted Prisma Schema
The Prisma schema file was accidentally overwritten when running `prisma db pull` command, which:
- Replaced PascalCase model names (e.g., `User`, `Course`) with lowercase table names (e.g., `users`, `courses`)
- Removed the `@@map()` directives that map models to database tables
- Caused TypeScript compilation errors (48 errors across 3 files)
- Prevented the backend from starting properly

### Secondary Issue: Port Conflict
- A zombie Node.js process was occupying port 4000
- Prevented new backend instances from starting
- Process ID: 19076

## Solution Steps

### 1. Restored Correct Prisma Schema
Recreated the proper `backend/prisma/schema.prisma` file with:
- PascalCase model names (`User`, `Course`, `Chapter`, etc.)
- Proper `@@map()` directives to map to snake_case table names
- Correct field mappings using `@map()` (e.g., `passwordHash` → `password_hash`)
- All relations and indexes properly defined

**Key Schema Structure**:
```prisma
model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  passwordHash  String?   @map("password_hash")
  username      String    @unique
  // ... other fields
  
  @@map("users")  // Maps to 'users' table in database
}
```

### 2. Regenerated Prisma Client
```bash
cd backend
npx prisma generate
```

### 3. Recompiled TypeScript
```bash
npm run build
```

### 4. Killed Zombie Process
```bash
# Found process using port 4000
netstat -ano | findstr :4000
# Output: PID 19076

# Terminated the process
taskkill /F /PID 19076
```

### 5. Restarted Backend Server
```bash
npm run dev
```

## Files Modified

### backend/prisma/schema.prisma
- **Status**: Completely rewritten
- **Changes**: Restored proper model definitions with correct mappings
- **Models**: User, Course, Chapter, Progress, Challenge, ChallengeSubmit, Post, Comment, Note, Badge, UserBadge

### backend/src/utils/validation.ts
- **Status**: Previously modified (still valid)
- **Changes**: Added `.allow('', null)` to optional fields for profile update validation

## Verification

### Backend Status
✅ Server started successfully on port 4000
✅ Database connection established
✅ All API endpoints available
✅ No TypeScript compilation errors

### Expected Behavior
- Profile page should load user data correctly
- Login/register should work without database errors
- All CRUD operations should function properly

## Prevention Measures

### DO NOT Run These Commands
❌ `npx prisma db pull` - This will overwrite your schema with database structure
❌ `npx prisma introspect` - Same as db pull

### Safe Commands
✅ `npx prisma generate` - Regenerate Prisma Client
✅ `npx prisma migrate dev` - Create and apply migrations
✅ `npx prisma migrate deploy` - Apply migrations in production
✅ `npx prisma studio` - View database in GUI
✅ `npx prisma validate` - Validate schema file

## Lessons Learned

1. **Never use `prisma db pull` on an existing project** - It's meant for reverse-engineering databases, not maintaining existing schemas

2. **Always check for zombie processes** before debugging connection issues:
   ```bash
   netstat -ano | findstr :<PORT>
   taskkill /F /PID <PID>
   ```

3. **Keep schema backups** - Consider version control or regular backups of critical files

4. **Prisma model naming convention**:
   - Use PascalCase for model names in schema
   - Use `@@map("table_name")` to map to database tables
   - Use `@map("column_name")` to map fields to columns

## Testing Checklist

After applying this fix, verify:
- [ ] Backend starts without errors
- [ ] Can access `/api/auth/me` endpoint
- [ ] Can login with existing credentials
- [ ] Profile page loads correctly
- [ ] Can edit and save profile information
- [ ] Course list displays properly
- [ ] No console errors in browser

## Status
✅ Database connection restored
✅ Prisma schema corrected
✅ Backend server running
✅ All TypeScript errors resolved
✅ Port conflict resolved

## Related Issues
- BUGFIX_UI_IMPROVEMENTS.md - Profile edit validation fixes
- BUGFIX_AUTH_TOKEN_SYNC.md - Authentication token synchronization
- BUGFIX_PROFILE_LOGOUT.md - Profile page logout issues
