# StorySpark AI – AI Creative Studio
## Production UI/UX Specification & Design System Document

---

## Executive Summary
This document defines the production-ready UI/UX specification, Design System tokens, component guidelines, layout rules, and page wireframe specifications for **StorySpark AI – AI Creative Studio**. Designed with a aesthetic inspired by platforms like Linear, Notion, Canva, and ChatGPT, this specification provides exact color palettes, typography scales, spacing grids, interaction flows, motion choreography, and accessibility guidelines (WCAG 2.1 AA) for frontend development teams.

---

## 1. Design Philosophy
StorySpark AI is built on the philosophy of **"Invisible Intelligence & Creative Flow"**:
- **Clutter-Free Canvas**: The interface steps back to let user creativity take center stage.
- **Micro-Delights**: Subtle Framer Motion animations and glassmorphism highlights respond fluidly to user inputs.
- **Contextual AI Assistance**: AI controls emerge seamlessly when needed (e.g., inline writing assistant popovers) rather than obstructing the writing canvas.

---

## 2. Design Principles
1. **Speed & Responsiveness**: Sub-100ms UI interaction response with immediate optimism and skeleton loaders.
2. **Predictable Navigation**: Universal shortcut keys (Cmd/Ctrl + K Command Palette) and consistent dual-sidebar layouts.
3. **High Visual Contrast & Focus**: Crisp typography contrast ratios (>= 4.5:1 for text) with distinct visual hierarchy.
4. **Accessible First**: Fully keyboard-navigable and screen-reader compliant out of the box.

---

## 3. Brand Identity
- **Primary Archetype**: The Innovator & Creator
- **Tone of Voice**: Inspiring, intelligent, articulate, playful yet professional.
- **Visual Vibe**: Deep obsidian glass dark modes paired with vibrant violet-to-cyan ambient glow gradients.

---

## 4. Color Palette

```
  Primary Indigo-Violet: #6366F1 | Primary Hover: #4F46E5 | Primary Active: #4338CA
  Secondary Cyan Glow:   #06B6D4 | Secondary Hover: #0891B2
  Accent Amber Spark:    #F59E0B | Accent Rose:     #F43F5E
  Dark Background 1:     #090D16 | Dark Surface 2:  #111827 | Dark Card 3: #1F2937
  Light Background 1:    #FAFAFA | Light Surface 2: #FFFFFF | Light Card 3: #F3F4F6
  Dark Border:           #374151 | Light Border:    #E5E7EB
```

| Name | Hex Code | Purpose | Usage |
| :--- | :--- | :--- | :--- |
| `brand-500` | `#6366F1` | Primary Brand Color | Primary Buttons, Active States, Selected Tabs |
| `brand-600` | `#4F46E5` | Hover State | Button Hover, Focused Borders |
| `accent-cyan` | `#06B6D4` | AI Indicator / Spark | AI Generation badges, Prompt Highlights |
| `accent-amber` | `#F59E0B` | Pro / Premium Badges | Pro subscription indicators, Star ratings |
| `bg-dark-900` | `#090D16` | Dark Canvas | Main background in Dark Theme |
| `bg-dark-800` | `#111827` | Dark Surface | Sidebar, Modal headers, Drawer cards |
| `text-primary-dark` | `#F9FAFB` | Primary Text | High-contrast headlines and body |
| `text-secondary-dark` | `#9CA3AF` | Secondary Text | Subtitles, meta-information, timestamps |

---

## 5. Typography System
Font Family: **Inter** (Primary UI) & **Outfit** (Display / Brand Headlines) & **JetBrains Mono** (Code & Prompts).

| Role | Font Family | Size | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display H1** | Outfit | 48px / 3.0rem | 700 (Bold) | 1.1 | -0.02em |
| **Heading H2** | Outfit | 32px / 2.0rem | 600 (SemiBold)| 1.2 | -0.01em |
| **Heading H3** | Outfit | 24px / 1.5rem | 600 (SemiBold)| 1.3 | 0em |
| **Title H4** | Inter | 18px / 1.125rem | 600 (SemiBold)| 1.4 | 0em |
| **Body Base** | Inter | 15px / 0.938rem | 400 (Regular) | 1.5 | 0em |
| **Body Small** | Inter | 13px / 0.813rem | 400 (Regular) | 1.5 | +0.01em |
| **Caption** | Inter | 11px / 0.688rem | 500 (Medium) | 1.4 | +0.02em |
| **Monospace** | JetBrains Mono | 13px / 0.813rem | 400 (Regular) | 1.6 | 0em |

---

## 6. Icon System
- **Provider**: Lucide React Icons (`lucide-react`)
- **Standard Sizes**: 16px (Small), 20px (Medium/Default), 24px (Large Header Icons).
- **Core Icon Set**: `Sparkles` (AI actions), `BookOpen` (Stories), `Laugh` (Jokes), `User` (Characters), `Globe` (Worlds), `Wand2` (Prompt Builder), `Volume2` (Audio), `Image` (Comics/Images), `Settings`, `Search`, `Bell`, `Shield` (Admin).

---

## 7. Spacing System
Base Unit: **4px**

| Token | Pixels | Rem | Common Usage |
| :--- | :--- | :--- | :--- |
| `space-1` | 4px | 0.25rem | Icon gaps, tight badge padding |
| `space-2` | 8px | 0.50rem | Input inner padding (vertical), gap between chips |
| `space-3` | 12px | 0.75rem | Card inner padding (small), list item gaps |
| `space-4` | 16px | 1.00rem | Standard button padding, input horizontal padding |
| `space-6` | 24px | 1.50rem | Card inner padding (large), grid gap |
| `space-8` | 32px | 2.00rem | Section layout gaps, modal margins |
| `space-12` | 48px | 3.00rem | Page section margins |

---

## 8. Grid System & Layout Rules
- **Desktop (1440px+)**: 12-Column Grid | Gutter: 24px | Margin: 32px
- **Laptop (1024px - 1439px)**: 12-Column Grid | Gutter: 20px | Margin: 24px
- **Tablet (768px - 1023px)**: 8-Column Grid | Gutter: 16px | Margin: 16px
- **Mobile (320px - 767px)**: 4-Column Grid | Gutter: 12px | Margin: 12px

---

## 9. Design Tokens (CSS Variables)

```css
:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Outfit', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --color-brand-primary: #6366F1;
  --color-brand-hover: #4F46E5;
  --color-ai-spark: #06B6D4;
  
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-glow: 0 0 20px -3px rgba(99, 102, 241, 0.35);

  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-smooth: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 10–12. Themes (Light vs Dark)

### Dark Theme (Default Studio Mode)
- **Background**: `#090D16` (Obsidian Blue)
- **Surface**: `#111827` (Charcoal)
- **Borders**: `#1F2937`
- **Glow Accent**: `rgba(99, 102, 241, 0.15)` backdrop filter blur glassmorphism.

### Light Theme (Reading & Export Mode)
- **Background**: `#FAFAFA` (Off-white)
- **Surface**: `#FFFFFF` (Pure White)
- **Borders**: `#E5E7EB`
- **Text**: `#111827`

---

## 13. Responsive Breakpoints

| Key | Min Width | Max Width | Target Device |
| :--- | :--- | :--- | :--- |
| `sm` | 640px | 767px | Large Mobile Phones |
| `md` | 768px | 1023px | Tablets (Portrait) |
| `lg` | 1024px | 1279px | Tablets (Landscape) / Laptops |
| `xl` | 1280px | 1535px | Desktop Monitors |
| `2xl` | 1536px | ∞ | Ultrawide Workstations |

---

## 14. Accessibility Guidelines (WCAG 2.1 AA)
1. **Focus Ring**: Custom high-visibility 2px solid `#06B6D4` with `outline-offset: 2px` on all interactive elements during keyboard navigation (`:focus-visible`).
2. **Contrast Ratio**: Body text minimum 4.5:1 against surface background.
3. **Screen Readers**: All icons require `aria-hidden="true"` or matching `sr-only` description spans. All buttons have explicit `aria-label`.
4. **Keyboard Accessibility**: Full support for `Tab`, `Shift+Tab`, `Enter`, `Space`, and `Escape` key interactions across dropdowns, modals, and drawers.

---

## 15. Animation Guidelines (Framer Motion Choreography)

```javascript
// Global Page Transition Spec
export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
};

// Modal Scale-In Spec
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } }
};
```

---

## 16–23. Feedback, States & Container Specs

### Skeleton Screens & Loading States
- Shimmer gradient animation running across card blocks (`linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%)`).

### Toast Notifications
- **Position**: Top Right or Bottom Right (Floating 24px from screen edge).
- **Types**: Success (Green border + check icon), Error (Red border + alert icon), Info (Cyan border + spark icon).

### Modals & Drawers
- **Backdrop**: Semi-transparent dark overlay (`rgba(0, 0, 0, 0.7)` with `backdrop-filter: blur(8px)`).
- **Drawer**: Slides out from right edge (Width: 480px on desktop, 100% on mobile).

---

## 24–35. Reusable Component Specs

### Cards
- **Story Card**: Top cover image (16:9 ratio), category badge top-right, title (H4), author avatar + name, view count + like count footer icons.
- **Hover State**: `-translate-y-1` lift with `--shadow-glow` indigo aura.

### Buttons
- **Primary**: Background `#6366F1`, text white, rounded-md, py-2.5 px-4, font-weight 500.
- **AI Generate Button**: Gradient border (`linear-gradient(to r, #6366F1, #06B6D4)`), sparkling icon animation on hover.

### Command Palette (`Cmd + K`)
- Centered overlay modal with search input, keyboard navigation (`Up/Down` arrows), and categorized shortcut lists (Recent Stories, Create Character, AI Settings).

---

## 36–39. Navigation Systems

### Sidebar Navigation (App Studio)
- **Left Collapsible Sidebar (260px expanded / 72px collapsed)**:
  - Header: StorySpark AI Logo + Workspace Switcher
  - Main Nav Items: `Dashboard`, `Story Studio`, `Joke Studio`, `Character Vault`, `World Vault`, `AI Writing Coach`, `Community`.
  - Footer: User Avatar, Subscription Tier Chip ("Pro"), Settings trigger.

---

## 40. Detailed Page Wireframe Specifications

*(Exhaustive specifications for all required application pages)*

---

### Page: Landing Page (`/`)
- **Purpose**: Convert visitors into registered users through product showcase and AI feature previews.
- **Target User**: Novelists, content creators, students, scriptwriters.
- **Page Layout**: Header Navigation -> Hero Section -> Interactive AI Demo Block -> Feature Grid -> Story-to-Comic Showcase -> Testimonials -> Pricing Preview -> CTA Footer.
- **Wireframe Description**:
  - Top fixed Navbar with blurred background glassmorphism.
  - Hero Section: Center-aligned gradient headline "Ignite Your Imagination with AI", subtext, dual CTAs ("Start Creating Free" primary button, "Watch Demo" video button). Floating glassmorphic preview of the Story Studio editor.
  - Interactive Demo Component: Users can select a Genre (Sci-Fi, Fantasy, Mystery) and click "Spark Sample Story" to watch text stream live.
- **Responsive Behaviour**: Stack feature grid from 3-columns on desktop to 1-column on mobile. Collapse navbar into hamburger drawer on mobile.

---

### Page: Login (`/login`) & Register (`/register`)
- **Purpose**: Authenticate existing users and register new creative accounts.
- **Page Layout**: Split Screen (Left side: Atmospheric AI Generated Art Carousel & Testimonial quote; Right side: Auth Form card).
- **UI Components**:
  - Email & Password input fields with floating labels and inline validation errors.
  - Social Login Buttons (Google OAuth, GitHub OAuth).
  - "Remember Me" checkbox and "Forgot Password?" text link.
- **Accessibility Notes**: Explicit `autocomplete="email"` and `autocomplete="current-password"` attributes.

---

### Page: Dashboard (`/dashboard`)
- **Purpose**: Central hub displaying recent story drafts, quick AI generation launcher cards, usage tokens, and community feeds.
- **Layout**: 3-Column Studio Grid.
  - **Left**: Collapsible Navigation Sidebar.
  - **Center**: Quick Action Launchers ("Generate Story", "Craft Joke", "Create Character", "World Lore"), Recent Drafts Carousel, Activity Chart.
  - **Right**: Token Usage Widget (e.g., 4,500/10,000 AI tokens used), Community Trending Stories list.
- **Empty State**: Friendly illustration "No stories created yet" with prominent "Create Your First Story" button.

---

### Page: Story Generator Studio (`/app/story-generator`)
- **Purpose**: Multi-step AI wizard for generating complete stories, chapter outlines, and plot structures.
- **Layout**: Split View (Left: Input Config Panel 35% width; Right: Live AI Generation Canvas 65% width).
- **Form Controls**:
  - Story Premise (Textarea with character count).
  - Genre Dropdown (Sci-Fi, Fantasy, Horror, Romance, Thriller).
  - Character Select (Multi-select pill chips pulling from Character Vault).
  - World Lore Select (Select dropdown pulling from World Vault).
  - Tone & Writing Style slider (Creativity / Temperature gauge).
- **Generate Button**: Large gradient button with sparkling icon animation. When clicked, streams generated story text into the Right Canvas using real-time typing animation effect.

---

### Page: Story Editor (`/app/editor/:id`)
- **Purpose**: Rich-text story writing canvas with inline AI writing assistant capabilities.
- **Layout**: Full-Screen Focus Mode with Top Toolbar and Floating AI Assistant Menu.
- **UI Components**:
  - WYSIWYG Rich Text Editor canvas (Medium/Notion-like minimalist layout).
  - Floating AI Toolbar (appears on text selection): "Expand Scene", "Rewrite Tone", "Check Grammar", "Generate Character Dialogue", "Convert to Comic Script".
  - Right Sidebar Drawer (Collapsible): Chapter Outline tree view and Writing Coach feedback.

---

### Page: Story-to-Comic & Story-to-Movie Script (`/app/convert/:id`)
- **Purpose**: Transform written text stories into visual comic book panel scripts or formatted screenplay scripts.
- **Layout**: Grid Panel Layout.
  - Top: Story Selector dropdown and Format Switcher ("Comic Book Panels" vs. "Hollywood Script").
  - Content Area: Rendered script cards containing Panel Numbers, Scene Descriptions, Character Dialogue boxes, and AI Image Generation triggers per panel.

---

### Page: AI Character Builder (`/app/characters/new`)
- **Purpose**: Create and save persistent character personas.
- **Layout**: Two-Column Card Layout (Left: Form Inputs; Right: Live Character Card Preview).
- **Form Inputs**: Name, Archetype, Personality Traits (Tag Input), Backstory, Speech Pattern, Avatar Upload / AI Avatar Generator trigger.

---

### Page: Community Feed (`/community`)
- **Purpose**: Browse, read, like, and comment on stories shared by the StorySpark creator community.
- **Layout**: Masonry Grid with Top Filter Bar (Trending, Recent, Top Rated, Genre Filter Chips).
- **Cards**: Interactive Story Cards with author avatars, like button (heart animation), bookmark button, and comment drawer trigger.

---

### Page: Admin Dashboard (`/admin`)
- **Purpose**: System administration, content moderation, user management, and platform telemetry.
- **Layout**: Sidebar Admin Nav + Top Metric Cards (Total Users, Daily Token Volume, Active Subscribers, Reported Content) + Data Tables for User Management with inline action dropdowns (Ban, Suspend, Upgrade Tier).

---

## 41. Responsive & Mobile Navigation Specs
- **Mobile Navbar**: Fixed bottom navigation bar with 5 primary icons (`Home`, `Studio`, `AI Assistant`, `Community`, `Profile`) featuring Framer Motion active icon indicator.

---
*End of UI/UX Specification Document for StorySpark AI – AI Creative Studio*
