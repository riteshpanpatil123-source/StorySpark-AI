// User Interfaces
export type UserRole = 'guest' | 'user' | 'premium' | 'moderator' | 'admin';
export type UserTier = 'free' | 'pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  role: UserRole;
  tier: UserTier;
  isEmailVerified: boolean;
  totalStories?: number;
  totalLikes?: number;
  createdAt: string;
}

export interface UserProfile extends User {
  bio?: string;
  preferredGenres?: string[];
  websiteUrl?: string;
}

// Story & Chapter Interfaces
export type StoryStatus = 'draft' | 'published' | 'archived';

export interface Story {
  id: string;
  userId: string;
  authorName?: string;
  authorAvatar?: string;
  title: string;
  slug: string;
  synopsis: string;
  genre: string;
  content?: string;
  tags: string[];
  coverImageUrl?: string;
  status: StoryStatus;
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  ratingAverage: number;
  ratingCount: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoryChapter {
  id: string;
  storyId: string;
  chapterNumber: number;
  title: string;
  content: string;
  summary?: string;
  audioNarrationUrl?: string;
  wordCount: number;
  createdAt: string;
}

// Joke Interfaces
export interface Joke {
  id: string;
  userId: string;
  setup: string;
  punchline: string;
  category: string;
  ratingAverage: number;
  ratingCount: number;
  isPublic: boolean;
  createdAt: string;
}

// Character & World Interfaces
export interface Character {
  id: string;
  userId: string;
  name: string;
  archetype: string;
  avatarUrl?: string;
  personalityTraits: string[];
  backstory: string;
  speechPattern?: string;
  isPublic: boolean;
  createdAt: string;
}

export interface World {
  id: string;
  userId: string;
  name: string;
  genre: string;
  description: string;
  rules: string;
  magicSystem?: string;
  technologyLevel?: string;
  isPublic: boolean;
  createdAt: string;
}

// AI Service Interfaces
export interface AIGenerateStoryPayload {
  premise: string;
  genre: string;
  tone: string;
  length: 'short' | 'medium' | 'long';
  title?: string;
  setting?: string;
  characters?: string;
  language?: string;
  targetAudience?: string;
  additionalInstructions?: string;
  characterIds?: string[];
  worldId?: string;
}

export interface AIGenerateJokePayload {
  topic: string;
  style: string;
}

export interface AIWritingCoachPayload {
  text: string;
}

export interface AIWritingCoachResponse {
  grammarIssues: { issue: string; suggestion: string }[];
  readabilityScore: number;
  passiveVoiceCount?: number;
  toneAnalysis: string;
  improvements: string[];
  optimizedText?: string;
}

// Notification Interface
export interface NotificationItem {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'ai_job_complete' | 'system';
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

// Subscription Interface
export interface Subscription {
  id: string;
  userId: string;
  planId: 'free' | 'pro_monthly' | 'pro_yearly';
  status: 'active' | 'past_due' | 'canceled';
  currentPeriodEnd: string;
}

// API Response Wrappers
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  error: {
    code: string;
    message: string;
    details?: { field: string; issue: string }[];
    timestamp: string;
  };
}
