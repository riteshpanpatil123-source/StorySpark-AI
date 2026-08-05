# StorySpark AI – AI Creative Studio
## System Architecture & Technical Specification Document

---

## Executive Summary
**StorySpark AI – AI Creative Studio** is a multi-tenant, enterprise-grade creative SaaS platform designed to scale seamlessly up to 100,000+ active users. The system provides an end-to-end suite for AI story generation, joke crafting, character and world-building, writing coaching, grammar verification, story visualization (Story-to-Comic, Story-to-Movie Script, AI Image Generation), AI audio narration, community interactions, and analytics.

This document serves as the master technical blueprint for the engineering, DevOps, and security teams.

---

## 1. High Level Architecture

### Purpose
To provide a decoupled, fault-tolerant, modular system design that separates user interface components, core RESTful business logic, isolated AI processing services, caching layers, database persistent storage, and background processing workers.

### Architecture Diagram
```mermaid
graph TD
    Client[React + Vite Frontend Client] --> CDN[Cloudflare CDN / WAF]
    CDN --> Gateway[Express API Gateway / Reverse Proxy]
    Gateway --> AuthMiddleware[JWT Auth & RBAC Middleware]
    AuthMiddleware --> Controllers[Express MVC Controllers]
    
    Controllers --> Cache[Redis Caching Layer]
    Controllers --> DB[(MongoDB Atlas Primary & Secondary)]
    Controllers --> Queue[BullMQ / Redis Job Queue]
    
    Queue --> AIWorker[AI Processing Service Worker]
    Queue --> MediaWorker[Media & Storage Worker]
    
    AIWorker --> OpenAI[OpenAI API GPT-4o / DALL-E / Audio]
    MediaWorker --> Cloudinary[Cloudinary CDN Storage]
    
    Controllers --> WS[WebSockets / SSE Server]
    WS --> Client
```

### Flow
1. User requests hit Cloudflare CDN/WAF for DNS resolution, SSL termination, and DDoS mitigation.
2. Web traffic routes to the Node.js/Express API Gateway.
3. Express middleware handles Rate Limiting, Helmet security headers, CORS verification, and JWT Authentication.
4. Synchronous business requests interact directly with MVC Controllers, querying Redis cache or MongoDB Atlas.
5. Long-running AI generation tasks (Story Generation, Comic Scripting, Image Gen, Audio Narration) are offloaded asynchronously to Redis BullMQ.
6. Isolated AI Worker services execute prompt processing, call OpenAI APIs, validate outputs, and persist results to MongoDB and Cloudinary.
7. Real-time notifications and progress updates are pushed to the client via WebSockets / Server-Sent Events (SSE).

### Advantages
- Decouples client-side latency from long-running LLM and media generation.
- Horizontal scaling capability for both web servers and AI job workers.
- Resilience: AI provider timeouts or failures do not crash core REST services.

### Best Practices
- Keep API endpoints idempotent where possible.
- Enforce strict timeouts on all downstream AI and database network calls.

### Possible Improvements
- Future transition from single Express API gateway to an API Gateway solution (e.g., Kong, AWS API Gateway) if microservice decomposition occurs.

---

## 2. System Components

### Purpose
To define the discrete micro-units and services that make up the StorySpark AI platform.

### Architecture Diagram
```mermaid
graph LR
    subgraph Client Layer
        ReactApp[Single Page App - SPA]
    end
    subgraph Application Layer
        API[Node.js / Express Web Application]
        Workers[Background Worker Services]
    end
    subgraph Data & Storage Layer
        Mongo[(MongoDB Atlas Cluster)]
        Redis[(Redis Cache & Queue Store)]
        CloudinaryStore[Cloudinary Media Asset Store]
    end
    subgraph External Provider Layer
        OpenAIProvider[OpenAI APIs]
    end

    ReactApp --> API
    API --> Mongo
    API --> Redis
    Workers --> Redis
    Workers --> OpenAIProvider
    Workers --> CloudinaryStore
    Workers --> Mongo
```

### Flow
- **Client Layer**: Manages UI state (Redux Toolkit), forms (React Hook Form), and REST requests (Axios).
- **Application Layer**: Processes client requests, validates JWT tokens, manages queues, and handles business rules.
- **Worker Layer**: Consumes jobs from Redis queues, executes OpenAI prompt pipelines, formats media assets.
- **Data & Storage Layer**: Houses relational-like document models, caching layers, and media file distribution.

### Advantages
- Clear separation of concerns between presentation, orchestration, compute, and persistence.
- Sub-system failures remain isolated.

### Best Practices
- Every component must expose health check endpoints (`/healthz`, `/readyz`).

### Possible Improvements
- Containerize components via Docker and orchestrate using Kubernetes (EKS/GKE) as user traffic scales past 100k active users.

---

## 3. Frontend Architecture

### Purpose
To deliver a responsive, rich, fast, and secure Single Page Application (SPA) built with React, Vite, Tailwind CSS, Framer Motion, Redux Toolkit, and Axios.

### Architecture Diagram
```mermaid
graph TD
    AppRoot[App Container / Routes] --> AuthGuard[Protected Route Guard]
    AuthGuard --> Pages[Page Components]
    Pages --> UIComp[Reusable UI Components]
    Pages --> Hooks[Custom React Hooks]
    Pages --> RTK[Redux Toolkit Store]
    
    RTK --> Slices[Auth, Story, AI, Community Slices]
    Hooks --> AxiosInstance[Axios HTTP Client + Interceptors]
    AxiosInstance --> BackendAPI[Backend REST API]
```

### Flow
1. React Router parses route requests, running navigation guards to verify JWT state.
2. Pages invoke Redux actions or custom hooks.
3. Custom hooks handle API communications using a centralized Axios instance configured with request/response interceptors (handling auto token refresh and error notifications).
4. State is stored immutably in Redux Toolkit slices. UI re-renders smoothly driven by Framer Motion transitions and styled with Tailwind CSS.

### Advantages
- Vite provides instant HMR and optimized production bundles.
- Redux Toolkit provides predictable state management across multi-step AI wizard workflows.

### Best Practices
- Lazy load routes with `React.lazy` and `Suspense`.
- Implement component-level error boundaries to prevent full app crashes.

### Possible Improvements
- Implement Next.js SSR/SSG for public community stories to maximize SEO indexing.

---

## 4. Backend Architecture

### Purpose
To provide a clean, maintainable MVC structure in Node.js and Express.js with robust middle-layer controls.

### Architecture Diagram
```mermaid
graph TD
    ClientReq[Client Request] --> ExpressRouter[Express Router]
    ExpressRouter --> HelmetMw[Helmet & Security Headers]
    HelmetMw --> RateLimiter[Rate Limiter Middleware]
    RateLimiter --> CorsMw[CORS Middleware]
    CorsMw --> AuthMw[JWT Auth & RBAC Middleware]
    AuthMw --> ValidatorMw[Express Validator / Schema Check]
    ValidatorMw --> Controller[MVC Controller]
    Controller --> Service[Business Service Layer]
    Service --> Model[Mongoose Data Model]
    Service --> QueueProducer[Queue Producer]
    Controller --> ExpressRes[JSON Response]
```

### Flow
1. Incoming requests enter Express middleware pipeline (Security -> Rate Limiting -> CORS -> Auth -> Schema Validation).
2. Controller extracts validated request data and calls corresponding Service logic.
3. Service executes business logic, database queries via Mongoose, or dispatches background jobs.
4. Response is formatted uniformly standard HTTP status codes.

### Advantages
- Strictly enforced MVC pattern keeps controllers thin and business logic reusable in Services.
- High throughput Node.js non-blocking asynchronous event loop.

### Best Practices
- Never execute CPU-heavy tasks or direct AI model calls directly inside the HTTP request/response cycle.

### Possible Improvements
- Migrate codebase to TypeScript for compile-time safety across data contracts.

---

## 5. API Architecture

### Purpose
To establish standard RESTful API conventions, request/response formats, pagination, and API versioning.

### Request & Response Specification
- **Base URL**: `https://api.storyspark.ai/api/v1`
- **Standard Success Response**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resource retrieved successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```
- **Standard Error Response**:
```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Validation failed",
    "details": [
      { "field": "genre", "issue": "Genre is required" }
    ]
  }
}
```

### Flow
1. Request paths are grouped by domain resource (`/auth`, `/users`, `/stories`, `/characters`, `/worlds`, `/ai`, `/community`).
2. API Versioning (`/v1/`) allows backwards-compatible evolution of endpoints.

### Advantages
- Predictable structure simplifies frontend consumption and third-party integration.

### Best Practices
- Use standard HTTP methods: `GET` (read), `POST` (create), `PUT`/`PATCH` (update), `DELETE` (remove).

### Possible Improvements
- Add OpenAPI/Swagger specification generation via annotations or schema extractors.

---

## 6. AI Service Architecture

### Purpose
To isolate all OpenAI API integrations from business logic through a decoupled AI Orchestration Subsystem.

### Architecture Diagram
```mermaid
graph TD
    BizService[Business Logic Service] --> AIServiceFacade[AI Orchestration Facade]
    AIServiceFacade --> PromptBuilder[Prompt Builder Component]
    AIServiceFacade --> ContextManager[Context Manager]
    AIServiceFacade --> SafetyLayer[Safety & Content Moderator]
    
    PromptBuilder --> Templates[Prompt Templates Library]
    
    AIServiceFacade --> OpenAIClient[OpenAI API Client Wrapper]
    OpenAIClient --> RetryStrategy[Exponential Backoff Retry Engine]
    
    RetryStrategy --> OpenAIAPI[OpenAI API GPT-4o]
    OpenAIAPI --> ResponseVal[Response Validator & JSON Parser]
    ResponseVal --> OutputFormatter[Output Formatter Component]
    OutputFormatter --> BizService
```

### Components
1. **Prompt Builder**: Merges user parameters into predefined structural templates.
2. **Prompt Templates**: Version-controlled prompt strings optimized for JSON responses.
3. **Context Manager**: Truncates and injects character/world memory into the context window without exceeding model token limits.
4. **Safety Layer**: Scans user inputs and generated text using OpenAI Moderation API to prevent toxic or prohibited generation.
5. **Response Validator**: Validates AI outputs against JSON schemas before returning to services.
6. **Retry Strategy**: Implements jittered exponential backoff for HTTP 429 (Rate Limit) and HTTP 5xx errors.
7. **Output Formatter**: Normalizes raw LLM output into clean JSON ready for DB storage.

### Advantages
- Business logic is completely agnostic of the underlying AI provider.
- Swapping OpenAI for Claude, Mistral, or Llama 3 requires modifying only this isolated module.

### Best Practices
- Set strict `temperature` and `top_p` parameters based on feature requirements (e.g., lower temperature for grammar checks, higher for creative stories).

### Possible Improvements
- Add fallback provider mechanism (e.g., fallback to Anthropic Claude 3.5 if OpenAI is degraded).

---

## 7. Authentication Flow

### Purpose
To provide secure user authentication using short-lived JWT access tokens and long-lived HTTP-Only cookie refresh tokens.

### Architecture Diagram
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend
    participant API as Express API
    participant DB as MongoDB Atlas
    participant Redis

    User->>Frontend: Submit Email & Password
    Frontend->>API: POST /api/v1/auth/login
    API->>DB: Find User by Email
    DB-->>API: User Document (Hashed Pass)
    API->>API: Compare Password (Bcrypt)
    API->>API: Sign Access JWT (15 min) & Refresh JWT (7 days)
    API->>Redis: Store Refresh Token ID (Whitelist)
    API-->>Frontend: Return Access Token (Body) + Refresh Token (HttpOnly Cookie)
    Frontend->>Frontend: Save Access Token in Redux Memory
    
    Note over Frontend, API: Token Refresh Flow
    Frontend->>API: Request with Expired Access Token
    API-->>Frontend: 401 Unauthorized (Token Expired)
    Frontend->>API: POST /api/v1/auth/refresh-token (Cookies Sent)
    API->>Redis: Verify Refresh Token in Whitelist
    API-->>Frontend: New Access Token (Body)
```

### Flow & Security Principles
- Access tokens expire in 15 minutes and live exclusively in JavaScript memory (Redux State), never in `localStorage` or `sessionStorage` (mitigating XSS theft).
- Refresh tokens expire in 7 days, stored in an `HttpOnly`, `SameSite=Strict`, `Secure` cookie.
- Token revocation is enforced by tracking active refresh tokens in Redis.

### Advantages
- Protects against both XSS token theft and CSRF token submission exploits.

### Best Practices
- Implement token rotation on every refresh request.

### Possible Improvements
- Implement OAuth 2.0 / Social Logins (Google, Apple, GitHub).

---

## 8. Authorization Flow

### Purpose
To enforce Role-Based Access Control (RBAC) across standard users, premium subscribers, moderators, and administrators.

### Architecture Diagram
```mermaid
graph TD
    Req[Incoming Request] --> JwtAuth[JWT Authenticator]
    JwtAuth --> ExtractUser[Extract User & Role from Payload]
    ExtractUser --> RBACCheck{Check Required Permission}
    
    RBACCheck -- Authorized --> Controller[Execute Controller]
    RBACCheck -- Unauthorized --> ErrRes[Return 403 Forbidden]
```

### Roles & Permissions Matrix
| Feature / Endpoint | Free User | Premium User | Moderator | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Read Public Stories | Yes | Yes | Yes | Yes |
| Create Story (Basic) | Yes (5/day) | Unlimited | Yes | Yes |
| Story-to-Comic / Movie | No | Yes | Yes | Yes |
| AI Voice Narration | No | Yes | Yes | Yes |
| Delete Any User Story | No | No | Yes | Yes |
| System Admin Panel | No | No | No | Yes |

### Best Practices
- Enforce permissions at the API route middleware level using `authorizeRoles('admin', 'moderator')`.

---

## 9. Database Architecture

### Purpose
To store persistent application data using MongoDB Atlas with Mongoose ORM, strict schema validation, indexes, and document relationship mapping.

### Entity Relationship Diagram (MongoDB Schemas)
```mermaid
erDiagram
    USER ||--o{ STORY : creates
    USER ||--o{ CHARACTER : owns
    USER ||--o{ WORLD : owns
    USER ||--o{ NOTIFICATION : receives
    STORY ||--o{ STORY_CHAPTER : contains
    STORY ||--o{ COMMENT : receives
    STORY ||--o{ LIKE : receives
    USER ||--o{ LIKE : gives

    USER {
        ObjectId _id PK
        string username
        string email
        string passwordHash
        string role
        string tier
        datetime createdAt
    }

    STORY {
        ObjectId _id PK
        ObjectId userId FK
        string title
        string synopsis
        string genre
        string status
        boolean isPublic
        number viewCount
        datetime createdAt
    }

    CHARACTER {
        ObjectId _id PK
        ObjectId userId FK
        string name
        string archetype
        string personalityTraits
        string backstory
    }

    WORLD {
        ObjectId _id PK
        ObjectId userId FK
        string name
        string rules
        string lore
    }
```

### Indexing Strategy
- `User`: Unique index on `email` and `username`.
- `Story`: Compound index on `{ userId: 1, createdAt: -1 }`, text index on `{ title: "text", synopsis: "text" }`.
- `Comment`: Index on `{ storyId: 1, createdAt: -1 }`.

### Advantages
- MongoDB document flexibility allows rich story, character, and world structure nesting while supporting fast horizontal sharding.

### Best Practices
- Use Mongoose schema-level validation and custom validators to maintain data sanity.

---

## 10. File Storage Architecture

### Purpose
To handle user file uploads and AI-generated image/audio media assets using Multer and Cloudinary CDN.

### Architecture Diagram
```mermaid
graph TD
    ClientUpload[Upload Request - Multipart/Form-Data] --> ExpressMulter[Multer Memory Storage Middleware]
    ExpressMulter --> FileValidation[File Type & Size Validator]
    FileValidation --> CloudinarySDK[Cloudinary Upload API]
    CloudinarySDK --> CDNStore[Cloudinary Global CDN]
    CDNStore --> DBStore[Save Public URL & Asset ID in MongoDB]
```

### Flow
1. Files arrive at API endpoint as `multipart/form-data`.
2. Multer streams file bytes directly into memory buffer (no server disk writes).
3. Express middleware validates file MIME type (e.g., `image/png`, `audio/mpeg`) and max size limits (e.g., 10MB).
4. Cloudinary SDK uploads buffer, returning secure HTTPS URLs and CDN asset metadata.

### Advantages
- Zero local disk space usage on application servers.
- Automatic image optimization, WebP formatting, and responsive thumbnail delivery via Cloudinary.

---

## 11. Image Generation Flow

### Purpose
To generate visual assets for AI stories, comics, characters, and cover art.

### Architecture Diagram
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client
    participant API
    participant Queue as Redis Queue
    participant Worker
    participant OpenAI as OpenAI DALL-E 3
    participant Cloudinary
    participant DB

    User->>Client: Request Image Generation (Prompt/Style)
    Client->>API: POST /api/v1/ai/generate-image
    API->>Queue: Push Image Job (UserId, Prompt, Style)
    API-->>Client: 202 Accepted (Job ID)
    Queue->>Worker: Consume Image Job
    Worker->>OpenAI: Generate Image (DALL-E 3)
    OpenAI-->>Worker: Temporary Image URL
    Worker->>Cloudinary: Fetch Temp URL & Save to Cloudinary
    Cloudinary-->>Worker: Permanent CDN URL
    Worker->>DB: Save Image Asset metadata
    Worker->>Client: Send WebSocket Event (Job Completed + URL)
```

---

## 12. Voice Narration Generation Flow

### Purpose
To transform generated story text into high-quality audio narrations using OpenAI TTS.

### Architecture Diagram
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client
    participant API
    participant Queue as Redis Queue
    participant Worker
    participant OpenAI as OpenAI Audio TTS
    participant Cloudinary
    participant DB

    User->>Client: Click "Generate Audio Narration"
    Client->>API: POST /api/v1/ai/generate-audio
    API->>Queue: Push Audio Job (StoryId, VoiceId)
    API-->>Client: 202 Accepted (Job ID)
    Queue->>Worker: Consume Audio Job
    Worker->>OpenAI: Request Speech Synthesis (TTS-1-HD)
    OpenAI-->>Worker: Audio Stream Buffer (.mp3)
    Worker->>Cloudinary: Upload Buffer to Cloudinary Audio Bucket
    Cloudinary-->>Worker: Audio CDN URL
    Worker->>DB: Attach Audio URL to Story Model
    Worker->>Client: Notify Client via WebSockets
```

---

## 13. Story Generation Pipeline

### Purpose
To orchestrate multi-step story creation including outline generation, chapter generation, character integration, and formatting.

### Flow Step-by-Step
```mermaid
graph TD
    A[User Inputs: Genre, Premise, Characters, Length] --> B[Pipeline Trigger]
    B --> C[Step 1: Safety & Moderation Check]
    C --> D[Step 2: Generate Story Outline & Chapter Prompts]
    D --> E[Step 3: Sequential Chapter LLM Calls]
    E --> F[Step 4: Grammar & Style Polishing Pass]
    F --> G[Step 5: Output Schema Validation]
    G --> H[Step 6: DB Persistence & Cache Invalidation]
    H --> I[Step 7: Render in Client UI]
```

---

## 14. Prompt Engineering Pipeline

### Purpose
To standardize, manage, and secure prompts delivered to OpenAI LLMs.

### Pipeline Architecture
1. **Template Selection**: Load prompt template based on task (e.g., `STORY_GEN_V2`, `JOKE_GEN_V1`, `COMIC_SCRIPT_V3`).
2. **Variable Injection**: Inject user prompt, selected tone, character specs, world lore into template markers.
3. **Instruction Guardrails**: System instructions enforcing structured JSON output schema format.
4. **Token Truncation**: Truncate overflowing context window elements while prioritizing core story premise.

---

## 15. Story Save Pipeline

### Purpose
To reliably persist user-created stories, updates, drafts, and associated media metadata.

### Flow
1. **Client Auto-Save**: Client debounces story edit events every 3 seconds, issuing `PATCH /api/v1/stories/:id/draft`.
2. **Validation**: Express validator confirms schema compliance.
3. **Atomic DB Operation**: Mongoose executes `findOneAndUpdate()` with optimistic locking version keys (`__v`).
4. **Cache Invalidation**: Redis keys related to user drafts and public feeds are invalidated.

---

## 16. Analytics Pipeline

### Purpose
To collect, aggregate, and display user engagement, system usage, and AI token consumption metrics.

### Architecture Diagram
```mermaid
graph LR
    UserAction[User Event / AI Generation] --> EventBus[Express Event Emitter]
    EventBus --> RedisQueue[Analytics Queue]
    RedisQueue --> Aggregator[Analytics Aggregator Worker]
    Aggregator --> MongoAnalytics[(MongoDB Analytics Collection)]
    MongoAnalytics --> AdminDashboard[Admin Analytics API]
```

### Metrics Tracked
- Total Token Usage (Input vs. Output Tokens per user/tier).
- Image & Audio generation counts and cost metrics.
- Active daily/monthly users (DAU/MAU).
- Story view counts, likes, and shares.

---

## 17. Community Module Architecture

### Purpose
To enable social engagement via story sharing, commenting, liking, bookmarks, and user profiles.

### Key Components
- **Public Feed Service**: Provides paginated, cached queries for trending, recent, and top-rated stories.
- **Interactions Service**: Manages idempotent Likes, Bookmarks, and nested Comments.
- **Moderation Service**: Allows users to report inappropriate stories; flags content automatically if reported > 5 times.

---

## 18. Notification System

### Purpose
To deliver real-time and asynchronous alerts to users regarding AI job completions, community likes, and system updates.

### Diagram
```mermaid
graph TD
    Trigger[System / Social / AI Job Event] --> NotifService[Notification Service]
    NotifService --> DB[Save to Notification Collection]
    NotifService --> WS[Socket.io Real-Time Push]
    WS --> OnlineUser[User Active Client]
```

---

## 19. Search Architecture

### Purpose
To provide high-performance text search across public stories, characters, and user profiles.

### Strategy
- Use **MongoDB Atlas Search** (powered by Apache Lucene) or MongoDB Text Indexes.
- Compound indexing on `title`, `synopsis`, `tags`, and `genre`.
- Query autocomplete, stemming, and fuzzy search matching.

---

## 20. Security Architecture

### Purpose
To protect user data, guard against cyber attacks, and enforce enterprise-level security protocols.

### Defense Mechanisms
1. **JWT Auth & Refresh Token Rotation**: Mitigates session hijacking.
2. **Password Hashing**: Bcrypt with salt rounds = 12.
3. **Role-Based Access Control (RBAC)**: Strict permission boundaries.
4. **Input Sanitization**: Express-mongo-sanitize & XSS-Clean to prevent Mongo Injection and XSS attacks.
5. **CORS Configuration**: Restricts origin strictly to approved client domain (`https://storyspark.ai`).
6. **Rate Limiting**: `express-rate-limit` prevents brute-force login attempts (5 requests/15 min) and API abuse (100 requests/15 min).
7. **Secure HTTP Headers**: Helmet middleware enforcing HSTS, CSP, X-Frame-Options, and Referrer-Policy.
8. **Secrets Management**: Environment variables injected securely via Vault or Cloud Provider Secrets Manager.

---

## 21. Error Handling Strategy

### Purpose
To capture, format, log, and respond to application runtime errors gracefully without leaking sensitive internal details.

### Implementation
- **Custom Error Class**:
```javascript
class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```
- **Global Error Middleware**: Intercepts unhandled errors, formats JSON response, and logs details to Winston/Sentry.

---

## 22. Logging Strategy

### Purpose
To provide centralized, structured logging for auditing, debugging, and system analysis.

### Stack
- **Winston Logger** + **Morgan HTTP Request Logger**.
- Log Levels: `error`, `warn`, `info`, `http`, `debug`.
- Output: Standard JSON output to stdout (for container logging aggregators like Datadog or ELK).

---

## 23. Monitoring Strategy

### Purpose
To monitor system availability, performance metrics, API response latencies, and error rates in real-time.

### Metrics & Tooling
- **Health Checks**: `/api/v1/health` verifying MongoDB connection state, Redis ping, and memory usage.
- **Application Performance Monitoring (APM)**: New Relic or Datadog tracking transaction traces and slow database queries.
- **Uptime Monitoring**: UptimeRobot checking system ping every 60 seconds.

---

## 24. Caching Strategy

### Purpose
To reduce database load and reduce API response latencies for read-heavy operations.

### Caching Layers
```mermaid
graph LR
    Client --> API
    API --> RedisCache{Key in Redis?}
    RedisCache -- Hit --> ReturnCache[Return JSON Data]
    RedisCache -- Miss --> FetchDB[Query MongoDB]
    FetchDB --> SetCache[Store in Redis TTL: 5-15 min]
    SetCache --> ReturnCache
```

### Cached Entities
- Public Trending Stories feed (TTL: 15 mins).
- User Profile summaries (TTL: 10 mins).
- AI Prompt Templates (TTL: 1 hour).

---

## 25. Scalability Strategy

### Purpose
To ensure the application scales seamlessly from 1,000 to 100,000+ active users.

### Architectural Blueprint
- **Stateless App Servers**: Node.js Express servers store no session state locally; scaled horizontally behind Cloudflare / AWS ALB.
- **Database Scaling**: MongoDB Atlas auto-scaling replica set (1 Primary, 2 Secondaries) with read preference directed to secondaries for analytics queries.
- **Asynchronous Task Offloading**: High CPU/AI operations offloaded to Redis job queue workers.
- **Asset Offloading**: Static assets and media served exclusively via Cloudinary CDN.

---

## 26. Folder Structure

### Frontend Structure (React + Vite)
```
client/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/        # Button, Input, Modal, Loader
│   │   ├── layout/        # Navbar, Sidebar, Footer
│   │   └── ui/            # Framer Motion animated components
│   ├── features/
│   │   ├── auth/          # Login, Register, AuthSlice
│   │   ├── story/         # StoryEditor, StoryCard, StorySlice
│   │   ├── character/     # CharacterBuilder
│   │   └── ai/            # AI Generator forms
│   ├── hooks/             # custom hooks (useAuth, useAI)
│   ├── pages/             # Route views
│   ├── services/          # Axios instance & API calls
│   ├── store/             # Redux Store configuration
│   ├── utils/             # Formatters, constants, helpers
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

### Backend Structure (Node.js + Express MVC)
```
server/
├── src/
│   ├── config/            # DB, Redis, Cloudinary configs
│   ├── controllers/       # Auth, Story, User, AI controllers
│   ├── middlewares/       # Auth, Error, RateLimit, Validate
│   ├── models/            # Mongoose Schemas (User, Story, etc.)
│   ├── routes/            # Express Route definitions
│   ├── services/          # Business logic & AI Orchestration
│   │   └── ai/            # PromptBuilder, Safety, OpenAI client
│   ├── utils/             # AppError, Logger, AsyncHandler
│   ├── workers/           # BullMQ Queue Processors
│   ├── app.js             # Express app setup
│   └── server.js          # Entry point & HTTP server
├── .env.example
├── package.json
└── Dockerfile
```

---

## 27. Coding Standards

### Standards & Formatting
- **Linter & Formatter**: ESLint + Prettier configuration.
- **Code Patterns**: Clean code principles, DRY (Don't Repeat Yourself), single-responsibility principle for services.
- **Async Code**: Async/await over raw Promises or callbacks; all async route handlers wrapped in `asyncHandler`.

---

## 28. Naming Conventions

### Standard Conventions
- **Variables & Functions**: `camelCase` (e.g., `generateStoryOutline`)
- **Classes & Components**: `PascalCase` (e.g., `StoryCard`, `PromptBuilder`)
- **Database Models**: `PascalCase` singular (e.g., `User`, `Story`, `Character`)
- **Database Collections**: `lowercase` plural (e.g., `users`, `stories`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_TOKEN_LIMIT`, `JWT_SECRET`)
- **Files**: `kebab-case` or `camelCase` matching standard framework idioms.

---

## 29. Environment Variables

### Backend `.env.example`
```env
# Application
PORT=5000
NODE_ENV=production
CLIENT_URL=https://storyspark.ai

# Authentication
JWT_SECRET=super_secret_jwt_access_key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=super_secret_refresh_key
REFRESH_TOKEN_EXPIRES_IN=7d

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/storyspark?retryWrites=true&w=majority
REDIS_URL=redis://default:pass@redis-host:6379

# Storage
CLOUDINARY_CLOUD_NAME=storyspark
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=secret_key

# AI Provider
OPENAI_API_KEY=sk-proj-openai-api-key
OPENAI_ORG_ID=org-12345
```

---

## 30. Deployment Architecture

### Deployment Setup
```mermaid
graph TD
    Github[GitHub Main Branch] --> CI[GitHub Actions CI/CD Pipeline]
    CI --> Test[Run Linting & Automated Tests]
    Test --> Build[Build Frontend Artifacts & Docker Images]
    
    Build --> DeployFE[Deploy Client to Vercel / Cloudflare Pages]
    Build --> DeployBE[Deploy Express Container to AWS ECS / Render]
    
    DeployFE --> GlobalCDN[Global CDN Distribution]
    DeployBE --> LoadBalancer[AWS Application Load Balancer]
    LoadBalancer --> ECS[ECS Container Service / EC2 Instances]
```

---

## 31. Production Infrastructure

### Production Specs (100,000+ Active Users)
- **CDN / WAF**: Cloudflare Enterprise (DDoS protection, SSL termination, Edge Caching).
- **Frontend Hosting**: Vercel Enterprise or Cloudflare Pages with Global CDN distribution.
- **Backend Application Nodes**: AWS ECS Fargate or Docker containers running behind AWS Application Load Balancer (Auto-scaling cluster: min 2 nodes, max 10 nodes).
- **Database**: MongoDB Atlas M30 Cluster (Auto-scaling storage and RAM, automated continuous backups).
- **Cache & Queue**: Redis Enterprise / AWS ElastiCache cluster with multi-AZ replication.

---

## 32. CI/CD Pipeline

### Pipeline Workflow (GitHub Actions)
1. **Trigger**: Push or Pull Request to `main` branch.
2. **Lint & Test**: Run ESLint, Jest unit tests, and integration test suite.
3. **Build**: Build React production bundle and Docker image for Node.js API server.
4. **Security Scan**: Execute `npm audit` and Trivy container vulnerability scanning.
5. **Deploy Stage**: Automated zero-downtime rolling deployment to staging environment.
6. **Production Deploy**: Manual approval gate triggering zero-downtime production deployment.

---

## 33. Future Scalability Plan

### Strategic Evolution Path
1. **Microservices Migration**: Decouple the isolated AI Generation Engine into an independent Python/FastAPI microservice if advanced ML model hosting (e.g., self-hosted Llama 3 / ComfyUI) becomes required.
2. **Multi-Region Database Replication**: Enable MongoDB Atlas multi-region write nodes to lower database latency for international users.
3. **GraphQL / gRPC Integration**: Introduce GraphQL endpoints for complex, deeply nested UI data fetching requirements in story studio views.
4. **Vector Database Integration**: Implement Pinecone / Qdrant for semantic search, retrieval-augmented generation (RAG) over user world-building lore and story history.

---
*End of Architecture Document for StorySpark AI – AI Creative Studio*
