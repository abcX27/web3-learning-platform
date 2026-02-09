export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  template: string;
  testCases: TestCase[];
  solution: string;
  createdAt: string;
  updatedAt: string;
  isPassed?: boolean;
}

export interface TestCase {
  name: string;
  input?: any;
  expected: any;
}

export interface ChallengeSubmit {
  id: number;
  userId: number;
  challengeId: number;
  code: string;
  passed: boolean;
  submittedAt: string;
}

export interface ChallengeSubmitRequest {
  code: string;
}

export interface ChallengeSubmitResponse {
  submitId: number;
  passed: boolean;
  testResults: TestResult[];
  message: string;
}

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}
