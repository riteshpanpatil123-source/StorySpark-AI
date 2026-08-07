import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Public Pages
import { LandingPage } from '@/pages/public/LandingPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { FAQPage } from '@/pages/public/FAQPage';
import { PricingPage } from '@/pages/public/PricingPage';
import { PublicStoriesPage } from '@/pages/public/PublicStoriesPage';
import { PublicStoryReaderPage } from '@/pages/public/PublicStoryReaderPage';
import { CommunityPage } from '@/pages/public/CommunityPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';

// Protected App Pages
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { StoryGeneratorPage } from '@/pages/story/StoryGeneratorPage';
import { StoryLibraryPage } from '@/pages/story/StoryLibraryPage';
import { StoryEditorPage } from '@/pages/story/StoryEditorPage';
import { JokeGeneratorPage } from '@/pages/joke/JokeGeneratorPage';
import { CharacterBuilderPage } from '@/pages/story/CharacterBuilderPage';
import { WorldBuilderPage } from '@/pages/story/WorldBuilderPage';
import { WritingCoachPage } from '@/pages/story/WritingCoachPage';
import { ProfileSettingsPage } from '@/pages/dashboard/ProfileSettingsPage';
import { BillingPage } from '@/pages/dashboard/BillingPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/stories" element={<PublicStoriesPage />} />
        <Route path="/stories/:id" element={<PublicStoryReaderPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/app/dashboard" element={<DashboardPage />} />
          <Route path="/app/story-generator" element={<StoryGeneratorPage />} />
          <Route path="/app/joke-generator" element={<JokeGeneratorPage />} />
          <Route path="/app/character-builder" element={<CharacterBuilderPage />} />
          <Route path="/app/world-builder" element={<WorldBuilderPage />} />
          <Route path="/app/writing-coach" element={<WritingCoachPage />} />
          <Route path="/app/library" element={<StoryLibraryPage />} />
          <Route path="/app/editor/:id" element={<StoryEditorPage />} />
          <Route path="/app/settings" element={<ProfileSettingsPage />} />
          <Route path="/app/profile" element={<ProfileSettingsPage />} />
          <Route path="/app/billing" element={<BillingPage />} />
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
