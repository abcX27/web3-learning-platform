import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import logger from '../utils/logger';

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, username } = req.body;

    logger.info(`Registration attempt for email: ${email}`);

    const result = await authService.registerUser({
      email,
      password,
      username,
    });

    logger.info(`User registered successfully: ${result.user.id}`);

    res.status(201).json({
      success: true,
      data: result,
      message: '注册成功',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login user with email and password
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    logger.info(`Login attempt for email: ${email}`);

    const result = await authService.loginUser({
      email,
      password,
    });

    logger.info(`User logged in successfully: ${result.user.id}`);

    res.json({
      success: true,
      data: result,
      message: '登录成功',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login with wallet
 * POST /api/auth/wallet-login
 */
export async function walletLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { walletAddress, signature, message } = req.body;

    logger.info(`Wallet login attempt for address: ${walletAddress}`);

    const result = await authService.walletLogin({
      walletAddress,
      signature,
      message,
    });

    logger.info(`User logged in with wallet successfully: ${result.user.id}`);

    res.json({
      success: true,
      data: result,
      message: '钱包登录成功',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user information
 * GET /api/auth/me
 */
export async function getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      return next(new Error('User not authenticated'));
    }

    const user = await authService.getUserById(req.user.userId);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user profile
 * PUT /api/auth/profile
 */
export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      return next(new Error('User not authenticated'));
    }

    const { username, avatarUrl, bio } = req.body;

    const user = await authService.updateUserProfile(req.user.userId, {
      username,
      avatarUrl,
      bio,
    });

    logger.info(`User profile updated: ${user.id}`);

    res.json({
      success: true,
      data: { user },
      message: '个人资料更新成功',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 */
export async function logout(req: Request, res: Response): Promise<void> {
  // In a JWT-based system, logout is typically handled client-side
  // by removing the token. However, we can log the event.
  
  if (req.user) {
    logger.info(`User logged out: ${req.user.userId}`);
  }

  res.json({
    success: true,
    message: '登出成功',
  });
}
