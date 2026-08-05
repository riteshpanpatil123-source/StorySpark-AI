# StorySpark AI – AI Creative Studio
## Master REST API Architecture & Specification Contract

---

## Executive Summary
This document provides the complete, enterprise-grade REST API specification for **StorySpark AI – AI Creative Studio**. Designed as a strict contract between frontend (React/Vite) and backend (Node.js/Express) engineering teams, this specification defines API standards, versioning, authentication/authorization headers, error handling formats, pagination schemes, rate limits, and exhaustive endpoint documentation for all platform modules.

---

## 1. API Design Principles
- **RESTful Conventions**: Resources expressed as nouns in lower-case plural forms (e.g., `/api/v1/stories`).
- **Stateless Requests**: Every request carries complete authentication state via Bearer JWT tokens in the `Authorization` header.
- **Idempotency**: All `GET`, `PUT`, and `DELETE` endpoints are guaranteed idempotent. Mutating `POST` requests include optional `X-Idempotency-Key` headers.
- **JSON Standard**: All request and response bodies use strict `application/json` content encoding.

---

## 2. API Versioning Strategy
- **URI Path Versioning**: Base path versioning using `/api/v1/`.
- Major version increments (`/v2/`) occur only for breaking schema updates. Non-breaking field additions remain within `/v1/`.

---

## 3. Base URLs
- **Production API**: `https://api.storyspark.ai/api/v1`
- **Staging API**: `https://staging-api.storyspark.ai/api/v1`
- **Development API**: `http://localhost:5000/api/v1`

---

## 4. Authentication Strategy
- **Access Tokens**: Short-lived JWT (Expiration: 15 minutes) passed via HTTP Header: `Authorization: Bearer <access_token>`.
- **Refresh Tokens**: Long-lived JWT (Expiration: 7 days) stored in secure, `HttpOnly`, `SameSite=Strict`, `Secure` cookies (`refreshToken`).
- **OAuth 2.0 Integration**: Google OAuth idToken verification at `/api/v1/auth/google`.

---

## 5. Authorization Strategy (RBAC)
- **Roles**: `guest`, `user` (Free Tier), `premium` (Pro Tier), `moderator`, `admin`.
- Route protection enforced via Express middleware: `protect()`, `authorize('premium', 'admin')`.

---

## 6. Request Flow Architecture

```
Client Request -> Cloudflare WAF -> Express Gateway -> Helmet & CORS -> Rate Limiter -> JWT Authenticator -> RBAC Middleware -> Express Validator -> MVC Controller -> Service Layer -> MongoDB / Redis Queue
```

---

## 7–9. Unified Response Specifications

### Success Response Format (2xx)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resource retrieved successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Response Format (4xx / 5xx)
```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "code": "INVALID_INPUT_VALIDATION",
    "message": "The requested payload failed validation",
    "details": [
      { "field": "email", "issue": "Must be a valid email address format" }
    ],
    "timestamp": "2026-08-05T21:55:00.000Z",
    "path": "/api/v1/auth/register"
  }
}
```

---

## 10–13. Pagination, Filtering, Sorting & Search Standards

- **Pagination Query Parameters**: `?page=1&limit=20` or cursor marker `?cursor=66b1a1f0e4b0a1a1a1a1a1a3`.
- **Filtering Query Parameters**: `?genre=sci-fi&status=published&isPublic=true`.
- **Sorting Query Parameters**: `?sortBy=createdAt&sortOrder=desc` or `?sort=-createdAt,likeCount`.
- **Search Query Parameter**: `?q=space+opera` (triggers MongoDB Atlas Lucene Search).

---

## 14–15. File & Image Upload Strategy
- **Content-Type**: `multipart/form-data`.
- Upload requests route to Express Multer memory storage, streamed directly to Cloudinary CDN API. Returns Cloudinary asset URL and public ID.

---

## 16. Rate Limiting Limits

| Route Scope | Free Tier Rate Limit | Premium Tier Rate Limit | Window |
| :--- | :--- | :--- | :--- |
| `/auth/login` | 5 attempts | 5 attempts | 15 minutes |
| General REST APIs (`/stories`, etc.) | 100 requests | 500 requests | 15 minutes |
| AI Generation APIs (`/ai/*`) | 5 generations / day | Unlimited (100 / min burst) | 24 hours |

---

## 17–20. Validation, Security & Naming Conventions

- **Input Validation**: `express-validator` middleware verifying type, length, regex, and enums.
- **API Naming**: Resource collections plural `kebab-case` (`/story-chapters`), actions as sub-verbs (`/stories/:id/publish`).
- **HTTP Status Codes**:
  - `200 OK`: Successful read/update.
  - `201 Created`: Successful creation.
  - `202 Accepted`: Asynchronous job enqueued (AI generation).
  - `400 Bad Request`: Input validation failure.
  - `401 Unauthorized`: Missing or expired JWT access token.
  - `403 Forbidden`: Insufficient role permissions.
  - `404 Not Found`: Resource non-existent.
  - `429 Too Many Requests`: Rate limit exceeded.
  - `500 Internal Server Error`: Server exception.

---

## 21. Detailed API Endpoints Specification

*(Exhaustive contracts for all platform modules)*

---

### Module 1: Authentication & User Account APIs

#### `POST /api/v1/auth/register`
- **Purpose**: Register a new user account.
- **Auth Required**: No (Public)
- **Request Body**:
```json
{
  "email": "author@storyspark.ai",
  "username": "storyteller99",
  "password": "SecurePassword123!"
}
```
- **Validation**: `email` valid regex, `username` 3-30 alphanumeric chars, `password` min 8 chars with uppercase, lowercase, number, special char.
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "user": {
      "id": "66b1a1f0e4b0a1a1a1a1a1a1",
      "email": "author@storyspark.ai",
      "username": "storyteller99",
      "role": "user",
      "tier": "free"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

#### `POST /api/v1/auth/login`
- **Purpose**: Authenticate user and issue tokens.
- **Auth Required**: No (Public)
- **Request Body**: `{ "email": "author@storyspark.ai", "password": "SecurePassword123!" }`
- **Response**: Returns Access Token in Body, sets `refreshToken` in HttpOnly Cookie.

#### `POST /api/v1/auth/logout`
- **Purpose**: Revoke session and clear cookies.
- **Auth Required**: Yes (`user`)
- **Response (200 OK)**: Clears refresh token cookie and invalidates session in Redis.

#### `POST /api/v1/auth/refresh-token`
- **Purpose**: Issue new access token using HttpOnly refresh token cookie.
- **Auth Required**: No (Cookie verified)
- **Response**: `{ "accessToken": "new_jwt_token..." }`

#### `POST /api/v1/auth/forgot-password`
- **Purpose**: Request password reset link email.
- **Request Body**: `{ "email": "author@storyspark.ai" }`

#### `POST /api/v1/auth/reset-password`
- **Purpose**: Set new password via token.
- **Request Body**: `{ "resetToken": "token_string", "newPassword": "NewPassword123!" }`

#### `POST /api/v1/auth/verify-email`
- **Purpose**: Confirm user email verification code/token.

#### `POST /api/v1/auth/google`
- **Purpose**: OAuth 2.0 social login via Google idToken.
- **Request Body**: `{ "idToken": "google_oauth_token_string" }`

#### `PATCH /api/v1/users/profile`
- **Purpose**: Update user profile details.
- **Auth Required**: Yes (`user`)
- **Request Body**: `{ "displayName": "Alex Rivers", "bio": "Sci-Fi author", "preferredGenres": ["Sci-Fi"] }`

---

### Module 2: Story Management APIs

#### `POST /api/v1/stories`
- **Purpose**: Create a new story draft or story shell.
- **Auth Required**: Yes (`user`)
- **Request Body**:
```json
{
  "title": "Echoes of Orion",
  "synopsis": "A rogue AI pilot discovers an ancient signal.",
  "genre": "Sci-Fi",
  "categoryId": "66b1a1f0e4b0a1a1a1a1a1f0",
  "tags": ["sci-fi", "ai", "space"]
}
```
- **Response (201 Created)**: Returns created Story object with generated slug.

#### `GET /api/v1/stories`
- **Purpose**: Get paginated list of public stories with filters.
- **Query Params**: `?page=1&limit=20&genre=Sci-Fi&sortBy=createdAt&sortOrder=desc`
- **Response (200 OK)**: Array of story summaries.

#### `GET /api/v1/stories/:id`
- **Purpose**: Fetch complete details of a single story by ID or slug.

#### `PATCH /api/v1/stories/:id`
- **Purpose**: Update story title, synopsis, tags, or cover art.

#### `DELETE /api/v1/stories/:id`
- **Purpose**: Soft delete a story.
- **Auth Required**: Yes (Story Author or Moderator/Admin)

#### `POST /api/v1/stories/:id/publish`
- **Purpose**: Change story status to `published` making it visible in public feeds.

#### `POST /api/v1/stories/:id/chapters`
- **Purpose**: Add a new chapter to an existing story.
- **Request Body**: `{ "chapterNumber": 1, "title": "Chapter 1: The Signal", "content": "Text content..." }`

---

### Module 3: AI Generation Engine APIs

#### `POST /api/v1/ai/generate-story`
- **Purpose**: Asynchronous AI story generation.
- **Auth Required**: Yes (`user`)
- **Request Body**:
```json
{
  "premise": "An explorer discovers a time machine in a basement.",
  "genre": "Sci-Fi",
  "tone": "Suspenseful",
  "length": "short",
  "characterIds": ["66b1a1f0e4b0a1a1a1a1a1c1"],
  "worldId": "66b1a1f0e4b0a1a1a1a1a1w1"
}
```
- **Response (202 Accepted)**:
```json
{
  "success": true,
  "statusCode": 202,
  "message": "AI story generation job queued",
  "data": {
    "jobId": "job_ai_99182312",
    "estimatedTimeSeconds": 12,
    "statusUrl": "/api/v1/ai/jobs/job_ai_99182312"
  }
}
```

#### `POST /api/v1/ai/generate-joke`
- **Purpose**: Generate AI joke by category/topic.
- **Request Body**: `{ "topic": "Programmers", "style": "Dad Joke" }`

#### `POST /api/v1/ai/writing-coach`
- **Purpose**: Get AI feedback, grammar suggestions, and tone analysis on text.
- **Request Body**: `{ "text": "Draft paragraph to analyze..." }`

#### `POST /api/v1/ai/generate-image`
- **Purpose**: Enqueue DALL-E image generation job for story cover or comic panel.
- **Request Body**: `{ "prompt": "Futuristic cyberpunk city at sunset", "aspectRatio": "16:9" }`

#### `POST /api/v1/ai/generate-voice`
- **Purpose**: Synthesize speech audio narration for a story chapter using OpenAI TTS.
- **Request Body**: `{ "chapterId": "66b1a1f0e4b0a1a1a1a1a1ch1", "voice": "alloy" }`

---

### Module 4: Characters & World-Building APIs

#### `POST /api/v1/characters`
- **Purpose**: Save a new character persona.
- **Request Body**: `{ "name": "Kaelen Vane", "archetype": "Rogue Pilot", "personalityTraits": ["Brave", "Cynical"], "backstory": "Ex-military pilot." }`

#### `POST /api/v1/worlds`
- **Purpose**: Create a world lore repository.
- **Request Body**: `{ "name": "Aethelgard", "genre": "Fantasy", "rules": "Magic requires physical sacrifices.", "technologyLevel": "Medieval" }`

---

### Module 5: Community & Interaction APIs

#### `POST /api/v1/stories/:id/like`
- **Purpose**: Idempotent story like toggle.

#### `POST /api/v1/stories/:id/bookmark`
- **Purpose**: Save story to user reading library.

#### `POST /api/v1/stories/:id/comments`
- **Purpose**: Post a comment on a story.
- **Request Body**: `{ "content": "Amazing chapter! Loved the plot twist.", "parentCommentId": null }`

#### `POST /api/v1/users/:id/follow`
- **Purpose**: Follow another author.

---

### Module 6: Subscriptions & Payment APIs

#### `POST /api/v1/subscriptions/create-checkout-session`
- **Purpose**: Create Stripe Checkout session for Pro Tier upgrade.
- **Request Body**: `{ "planId": "pro_monthly" }`
- **Response**: `{ "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_123" }`

#### `POST /api/v1/subscriptions/webhook`
- **Purpose**: Handle Stripe webhooks (payment succeeded, subscription cancelled).

---

### Module 7: Admin & Analytics APIs

#### `GET /api/v1/admin/dashboard/stats`
- **Purpose**: System-wide telemetry (Total users, token usage, active subscriptions).
- **Auth Required**: Yes (`admin`)

#### `GET /api/v1/admin/users`
- **Purpose**: Search and manage user accounts with ban/suspend capabilities.

---
*End of REST API Architecture Specification Document for StorySpark AI – AI Creative Studio*
