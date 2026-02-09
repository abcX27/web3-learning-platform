# 认证功能测试指南

## 问题已修复 ✅

**问题**: CORS 配置错误
- 后端 CORS 配置为 `http://localhost:3000`
- 前端运行在 `http://localhost:3002`
- 导致跨域请求被阻止

**解决方案**: 
- 已更新 `backend/.env` 中的 `CORS_ORIGIN=http://localhost:3002`
- 已重启后端服务器

## 测试步骤

### 1. 测试注册功能

1. 打开浏览器访问: http://localhost:3002/register
2. 填写注册表单:
   - 邮箱: test@example.com
   - 用户名: testuser
   - 密码: Test1234
   - 确认密码: Test1234
3. 点击"注册"按钮
4. 应该自动跳转到课程页面 (http://localhost:3002/courses)

### 2. 测试登录功能

1. 打开浏览器访问: http://localhost:3002/login
2. 填写登录表单:
   - 邮箱: test@example.com
   - 密码: Test1234
3. 点击"登录"按钮
4. 应该自动跳转到课程页面

### 3. 测试 MetaMask 登录

**前提条件**: 需要安装 MetaMask 浏览器扩展

1. 打开浏览器访问: http://localhost:3002/login
2. 点击"使用 MetaMask 登录"按钮
3. MetaMask 会弹出连接请求，点击"连接"
4. MetaMask 会弹出签名请求，点击"签名"
5. 应该自动跳转到课程页面

## API 测试

### 使用 PowerShell 测试

```powershell
# 测试注册
$body = @{
    email='apitest@example.com'
    password='Test1234'
    username='apitest'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:4000/api/auth/register' -Method Post -Body $body -ContentType 'application/json'

# 测试登录
$body = @{
    email='apitest@example.com'
    password='Test1234'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:4000/api/auth/login' -Method Post -Body $body -ContentType 'application/json'
```

## 常见问题

### 1. 注册失败 - "该邮箱已被注册"
**原因**: 该邮箱已经存在于数据库中
**解决**: 使用不同的邮箱地址

### 2. 登录失败 - "邮箱或密码错误"
**原因**: 
- 邮箱不存在
- 密码错误
**解决**: 检查邮箱和密码是否正确

### 3. MetaMask 登录失败
**原因**: 
- MetaMask 未安装
- 用户拒绝签名
- 网络问题
**解决**: 
- 安装 MetaMask
- 同意签名请求
- 检查网络连接

### 4. CORS 错误
**症状**: 浏览器控制台显示 CORS 错误
**原因**: 后端 CORS 配置不正确
**解决**: 确保 `backend/.env` 中 `CORS_ORIGIN=http://localhost:3002`

## 验证服务状态

### 检查后端
```powershell
curl http://localhost:4000/health
```
应该返回:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "...",
    "uptime": ...,
    "environment": "development"
  }
}
```

### 检查前端
访问: http://localhost:3002
应该能看到主页

## 调试技巧

### 1. 查看后端日志
后端日志会显示所有 API 请求和错误信息

### 2. 查看浏览器控制台
按 F12 打开开发者工具，查看:
- Console: JavaScript 错误
- Network: API 请求和响应

### 3. 查看数据库
```powershell
cd backend
npx prisma studio
```
这会打开 Prisma Studio，可以查看数据库中的用户数据

## 成功标志

✅ 注册成功后:
- 返回 token
- 自动跳转到课程页面
- 用户信息保存到数据库

✅ 登录成功后:
- 返回 token
- 自动跳转到课程页面
- lastLoginAt 时间更新

✅ MetaMask 登录成功后:
- 签名验证通过
- 返回 token
- 自动跳转到课程页面
- 如果是新用户，自动创建账号

---

**更新时间**: 2026-02-07 15:40
**状态**: ✅ 已修复
