export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  email: string;
  username: string;
  avatarUrl?: string;
  walletAddress?: string;
  role: Role;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserProfile extends User {
  stats: {
    coursesCompleted: number;
    challengesCompleted: number;
    learningHours: number;
    badgesEarned: number;
  };
  progress: CourseProgress[];
}

export interface CourseProgress {
  courseId: number;
  courseTitle: string;
  completedChapters: number;
  totalChapters: number;
  percentage: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

export interface WalletLoginData {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
