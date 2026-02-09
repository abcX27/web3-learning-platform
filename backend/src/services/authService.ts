import bcrypt from 'bcrypt';
import { ethers } from 'ethers';
import { PrismaClient, User } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { generateToken, TokenPayload } from '../utils/jwt';

const prisma = new PrismaClient();

/**
 * User registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

/**
 * User login data
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Wallet login data
 */
export interface WalletLoginData {
  walletAddress: string;
  signature: string;
  message: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

/**
 * Register a new user with email and password
 */
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const { email, password, username } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new AppError(400, 'EMAIL_EXISTS', '该邮箱已被注册');
    }
    if (existingUser.username === username) {
      throw new AppError(400, 'USERNAME_EXISTS', '该用户名已被使用');
    }
  }

  // Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      role: 'USER',
    },
  });

  // Generate JWT token
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  const token = generateToken(tokenPayload);

  // Remove password hash from response
  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
}

/**
 * Login user with email and password
 */
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const { email, password } = data;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    throw new AppError(401, 'INVALID_CREDENTIALS', '邮箱或密码错误');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', '邮箱或密码错误');
  }

  // Update last login time
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate JWT token
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  const token = generateToken(tokenPayload);

  // Remove password hash from response
  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
}

/**
 * Login or register user with wallet
 */
export async function walletLogin(data: WalletLoginData): Promise<AuthResponse> {
  const { walletAddress, signature, message } = data;

  // Verify wallet signature with ethers.js
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new AppError(401, 'INVALID_SIGNATURE', '签名验证失败');
    }
  } catch (error) {
    throw new AppError(401, 'INVALID_SIGNATURE', '签名验证失败');
  }

  // Check if user exists with this wallet address
  let user = await prisma.user.findUnique({
    where: { walletAddress: walletAddress.toLowerCase() },
  });

  if (!user) {
    // Create new user with wallet address
    // Generate a unique username based on wallet address
    const username = `user_${walletAddress.slice(2, 10)}`;
    // Generate a placeholder email for wallet users
    const email = `${walletAddress.toLowerCase()}@wallet.local`;

    user = await prisma.user.create({
      data: {
        walletAddress: walletAddress.toLowerCase(),
        username,
        email, // Required by Prisma schema
        role: 'USER',
      },
    });
  }

  // Update last login time
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate JWT token
  const tokenPayload: TokenPayload = {
    userId: user.id,
    walletAddress: user.walletAddress || undefined,
    role: user.role,
  };
  const token = generateToken(tokenPayload);

  // Remove password hash from response (if any)
  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
}

/**
 * Get user by ID with learning statistics
 */
export async function getUserById(userId: number): Promise<Omit<User, 'passwordHash'> & { stats?: any }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', '用户不存在');
  }

  // Get learning statistics
  const stats = await getUserStats(userId);

  const { passwordHash: _, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    stats,
  };
}

/**
 * Get user learning statistics
 */
export async function getUserStats(userId: number) {
  // Get all progress records for the user
  const progressRecords = await prisma.progress.findMany({
    where: { userId },
    include: {
      chapter: {
        include: {
          course: true,
        },
      },
    },
  });

  // Calculate unique courses
  const uniqueCourseIds = new Set(progressRecords.map(p => p.chapter.courseId));
  const totalCourses = uniqueCourseIds.size;

  // Calculate completed courses (all chapters completed)
  const courseCompletionMap = new Map<number, { total: number; completed: number }>();
  progressRecords.forEach(p => {
    const courseId = p.chapter.courseId;
    if (!courseCompletionMap.has(courseId)) {
      courseCompletionMap.set(courseId, { total: 0, completed: 0 });
    }
    const stats = courseCompletionMap.get(courseId)!;
    stats.total++;
    if (p.completed) {
      stats.completed++;
    }
  });

  let completedCourses = 0;
  courseCompletionMap.forEach(stats => {
    if (stats.total > 0 && stats.completed === stats.total) {
      completedCourses++;
    }
  });

  // Get challenge statistics
  const challengeSubmissions = await prisma.challengeSubmit.findMany({
    where: { userId },
    orderBy: { submittedAt: 'desc' },
  });

  const uniqueChallengeIds = new Set(challengeSubmissions.map(s => s.challengeId));
  const totalChallenges = uniqueChallengeIds.size;

  const passedChallengeIds = new Set(
    challengeSubmissions.filter(s => s.passed).map(s => s.challengeId)
  );
  const completedChallenges = passedChallengeIds.size;

  // Get total badges earned
  const totalBadges = await prisma.userBadge.count({
    where: { userId },
  });

  // Calculate total learning hours (estimate: each completed chapter = 1 hour)
  const totalHours = progressRecords.filter(p => p.completed).length;

  // Get course progress details
  const courseProgress = Array.from(courseCompletionMap.entries()).map(([courseId, stats]) => ({
    courseId,
    totalChapters: stats.total,
    completedChapters: stats.completed,
    progress: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
  }));

  return {
    totalCourses,
    completedCourses,
    totalChallenges,
    completedChallenges,
    totalBadges,
    totalHours,
    courseProgress,
  };
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: number,
  data: {
    username?: string;
    avatarUrl?: string;
    bio?: string;
  }
): Promise<Omit<User, 'passwordHash'>> {
  // Check if username is already taken
  if (data.username) {
    const existingUser = await prisma.user.findFirst({
      where: {
        username: data.username,
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      throw new AppError(400, 'USERNAME_EXISTS', '该用户名已被使用');
    }
  }

  // Update user
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
