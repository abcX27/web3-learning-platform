import { User } from '@prisma/client';
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
export declare function registerUser(data: RegisterData): Promise<AuthResponse>;
/**
 * Login user with email and password
 */
export declare function loginUser(data: LoginData): Promise<AuthResponse>;
/**
 * Login or register user with wallet
 */
export declare function walletLogin(data: WalletLoginData): Promise<AuthResponse>;
/**
 * Get user by ID with learning statistics
 */
export declare function getUserById(userId: number): Promise<Omit<User, 'passwordHash'> & {
    stats?: any;
}>;
/**
 * Get user learning statistics
 */
export declare function getUserStats(userId: number): Promise<{
    totalCourses: number;
    completedCourses: number;
    totalChallenges: number;
    completedChallenges: number;
    totalBadges: number;
    totalHours: number;
    courseProgress: {
        courseId: number;
        totalChapters: number;
        completedChapters: number;
        progress: number;
    }[];
}>;
/**
 * Update user profile
 */
export declare function updateUserProfile(userId: number, data: {
    username?: string;
    avatarUrl?: string;
    bio?: string;
}): Promise<Omit<User, 'passwordHash'>>;
//# sourceMappingURL=authService.d.ts.map