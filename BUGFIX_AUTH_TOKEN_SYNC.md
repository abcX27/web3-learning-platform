# Bug 修复：认证 Token 同步问题

**问题日期**: 2026-02-07  
**严重程度**: 高  
**状态**: ✅ 已修复

## 🐛 问题描述

用户登录后访问个人中心时，会自动退出并跳转到登录页面。

### 症状

1. 用户成功登录
2. 访问个人中心 (`/profile`)
3. API 请求失败（401 Unauthorized）
4. 自动跳转到登录页面

## 🔍 根本原因

### 问题 1: Token 存储不一致

登录和注册页面中的 token 设置逻辑错误：

```typescript
// ❌ 错误的方式
setAuthToken(response.data.token);  // 只设置到 localStorage
setUser(response.data.user);         // 只设置 user，没有 token
```

这导致：
- `localStorage.auth_token` 有值
- Zustand store 中的 `token` 为 `null`
- Zustand persist 存储的数据不完整

### 问题 2: setUser 方法签名

Zustand store 中的 `setUser` 方法需要两个参数：

```typescript
setUser: (user: User, token: string) => void
```

但登录/注册页面只传了一个参数（user），导致 token 没有被存储到 Zustand store。

### 问题 3: Token 获取优先级

`getAuthToken()` 函数优先从 `localStorage.auth_token` 获取，但如果页面刷新后，Zustand store 会从 persist 恢复，而 persist 中没有 token。

## ✅ 修复方案

### 1. 修复登录页面

**文件**: `frontend/src/app/(auth)/login/page.tsx`

```typescript
// ✅ 正确的方式
if (response.success && response.data) {
  // Set user and token together in Zustand store
  setUser(response.data.user, response.data.token);
  router.push('/courses');
}
```

**改动**:
- ✅ 移除 `setAuthToken` 调用
- ✅ 同时传入 user 和 token 到 `setUser`
- ✅ Zustand store 内部会调用 `setAuthToken`

### 2. 修复注册页面

**文件**: `frontend/src/app/(auth)/register/page.tsx`

```typescript
// ✅ 正确的方式
if (response.success && response.data) {
  // Set user and token together in Zustand store
  setUser(response.data.user, response.data.token);
  router.push('/courses');
}
```

**改动**:
- ✅ 移除 `setAuthToken` 调用
- ✅ 同时传入 user 和 token 到 `setUser`

### 3. 改进 Token 获取逻辑

**文件**: `frontend/src/lib/api.ts`

```typescript
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try to get from localStorage first
  const token = localStorage.getItem('auth_token');
  if (token) return token;
  
  // Fallback to Zustand store (for persisted state)
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.token || null;
    }
  } catch (e) {
    // Ignore parse errors
  }
  
  return null;
}
```

**改进点**:
- ✅ 优先从 `auth_token` 获取
- ✅ 回退到 Zustand persist 存储
- ✅ 错误处理

### 4. 改进 401 错误处理

**文件**: `frontend/src/lib/api.ts`

```typescript
// Handle 401 Unauthorized
if (error.response?.status === 401) {
  clearAuthToken();
  // Clear auth store
  if (typeof window !== 'undefined') {
    // Import dynamically to avoid circular dependency
    import('@/store/authStore').then(({ useAuthStore }) => {
      useAuthStore.getState().logout();
    });
    // Redirect to login page
    window.location.href = '/login';
  }
}
```

**改进点**:
- ✅ 清除 localStorage token
- ✅ 清除 Zustand store 状态
- ✅ 重定向到登录页面

## 🧪 测试验证

### 测试场景 1: 新用户注册

1. ✅ 访问注册页面
2. ✅ 填写注册信息
3. ✅ 提交注册
4. ✅ Token 和 user 正确存储
5. ✅ 跳转到课程页面
6. ✅ 访问个人中心正常

### 测试场景 2: 用户登录

1. ✅ 访问登录页面
2. ✅ 填写登录信息
3. ✅ 提交登录
4. ✅ Token 和 user 正确存储
5. ✅ 跳转到课程页面
6. ✅ 访问个人中心正常

### 测试场景 3: 页面刷新

1. ✅ 用户登录
2. ✅ 刷新页面
3. ✅ 从 Zustand persist 恢复状态
4. ✅ Token 正确获取
5. ✅ 访问个人中心正常

### 测试场景 4: Token 过期

1. ✅ 用户登录
2. ✅ Token 过期
3. ✅ 访问个人中心
4. ✅ API 返回 401
5. ✅ 清除所有认证状态
6. ✅ 重定向到登录页面

## 📊 数据流

### 修复前

```
登录成功
  ↓
setAuthToken(token)  →  localStorage.auth_token = token
  ↓
setUser(user)  →  Zustand store.user = user, store.token = null ❌
  ↓
Zustand persist  →  auth-storage = { user, token: null } ❌
  ↓
访问 /profile
  ↓
getAuthToken()  →  从 localStorage.auth_token 获取 ✓
  ↓
API 请求  →  Authorization: Bearer token ✓
  ↓
页面刷新
  ↓
Zustand 恢复  →  从 auth-storage 恢复 { user, token: null } ❌
  ↓
getAuthToken()  →  从 localStorage.auth_token 获取 ✓
  ↓
但如果 localStorage.auth_token 被清除...
  ↓
getAuthToken()  →  返回 null ❌
  ↓
API 请求失败  →  401 Unauthorized ❌
```

### 修复后

```
登录成功
  ↓
setUser(user, token)  →  Zustand store = { user, token } ✓
  ↓
内部调用 setAuthToken(token)  →  localStorage.auth_token = token ✓
  ↓
Zustand persist  →  auth-storage = { user, token } ✓
  ↓
访问 /profile
  ↓
getAuthToken()  →  从 localStorage.auth_token 获取 ✓
  ↓
API 请求  →  Authorization: Bearer token ✓
  ↓
页面刷新
  ↓
Zustand 恢复  →  从 auth-storage 恢复 { user, token } ✓
  ↓
getAuthToken()  →  优先从 localStorage.auth_token，回退到 auth-storage ✓
  ↓
API 请求  →  Authorization: Bearer token ✓
```

## 🎯 关键改进

1. **统一的 Token 设置**: 通过 `setUser(user, token)` 统一设置
2. **完整的状态持久化**: Zustand persist 包含完整的认证信息
3. **健壮的 Token 获取**: 多重回退机制
4. **完整的登出逻辑**: 清除所有认证状态

## 📝 后续建议

### 短期

1. **添加 Token 过期时间检查**:
   - 在 JWT payload 中包含过期时间
   - 在发送请求前检查是否过期

2. **实现 Token 刷新**:
   - 添加 refresh token 机制
   - 自动刷新即将过期的 token

3. **改进错误提示**:
   - 401 时显示友好提示
   - 区分不同的认证错误

### 长期

1. **统一状态管理**:
   - 只使用 Zustand persist
   - 移除 localStorage.auth_token

2. **添加状态同步**:
   - 监听 localStorage 变化
   - 多标签页同步登录状态

3. **实现自动重试**:
   - 401 时尝试刷新 token
   - 刷新成功后重试原请求

## 📚 相关文件

- `frontend/src/app/(auth)/login/page.tsx` - 登录页面
- `frontend/src/app/(auth)/register/page.tsx` - 注册页面
- `frontend/src/lib/api.ts` - API 客户端
- `frontend/src/store/authStore.ts` - 认证状态管理

## 🎉 修复结果

- ✅ 登录后 token 正确存储
- ✅ 个人中心可以正常访问
- ✅ 页面刷新后状态保持
- ✅ Token 过期时正确处理
- ✅ 认证状态完全同步

---

**修复人员**: Kiro AI  
**修复日期**: 2026-02-07  
**测试状态**: ✅ 通过  
**优先级**: 高
