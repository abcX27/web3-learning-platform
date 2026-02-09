# Architecture Overview - Web3 Learning Platform

This document provides a high-level overview of the Web3 Learning Platform architecture.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │   MetaMask   │  │  Mobile App  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                    Load Balancer Layer                        │
│                   ┌────────▼────────┐                         │
│                   │  Nginx (Port 80) │                        │
│                   └────────┬────────┘                         │
└────────────────────────────┼─────────────────────────────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
┌─────────▼──────────┐              ┌──────────▼─────────┐
│  Application Layer │              │  Application Layer  │
│  ┌──────────────┐  │              │  ┌──────────────┐  │
│  │   Next.js    │  │              │  │   Express    │  │
│  │  (Port 3000) │  │              │  │  (Port 4000) │  │
│  └──────────────┘  │              │  └──────┬───────┘  │
└────────────────────┘              └─────────┼──────────┘
                                              │
                    ┌─────────────────────────┼─────────────────┐
                    │                         │                 │
          ┌─────────▼────────┐    ┌──────────▼────────┐  ┌────▼─────┐
          │   Data Layer      │    │   Cache Layer     │  │  Storage │
          │  ┌────────────┐   │    │  ┌────────────┐  │  │ ┌──────┐ │
          │  │ PostgreSQL │   │    │  │   Redis    │  │  │ │MinIO │ │
          │  │ (Port 5432)│   │    │  │(Port 6379) │  │  │ │(9000)│ │
          │  └────────────┘   │    │  └────────────┘  │  │ └──────┘ │
          └───────────────────┘    └───────────────────┘  └──────────┘
                                              │
                                   ┌──────────▼──────────┐
                                   │  External Services  │
                                   │  ┌──────────────┐   │
                                   │  │Infura/Alchemy│   │
                                   │  │  (Sepolia)   │   │
                                   │  └──────────────┘   │
                                   └─────────────────────┘
```

## Technology Stack

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Code Editor**: Monaco Editor
- **Web3**: Ethers.js v6
- **HTTP Client**: Axios
- **Markdown**: react-markdown

### Backend (Node.js + Express)
- **Runtime**: Node.js 18+
- **Framework**: Express 4
- **Language**: TypeScript
- **ORM**: Prisma
- **Authentication**: JWT + Passport.js
- **Validation**: Joi
- **Logging**: Winston
- **Testing**: Jest + Supertest + fast-check

### Infrastructure
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Storage**: MinIO (S3-compatible)
- **Reverse Proxy**: Nginx
- **Containerization**: Docker + Docker Compose

### Blockchain
- **Network**: Sepolia Testnet
- **Providers**: Infura / Alchemy
- **Compiler**: solc.js

## Directory Structure

```
web3-learning-platform/
├── .github/                    # GitHub Actions workflows
│   └── workflows/
│       └── ci.yml             # CI/CD pipeline
├── backend/                    # Backend application
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Utility functions
│   │   ├── config/            # Configuration
│   │   ├── test/              # Test setup
│   │   └── index.ts           # Entry point
│   ├── prisma/                # Database schema
│   │   ├── schema.prisma      # Prisma schema
│   │   ├── migrations/        # Database migrations
│   │   └── seed.ts            # Seed data
│   ├── logs/                  # Application logs
│   ├── Dockerfile             # Backend Docker image
│   ├── package.json           # Dependencies
│   ├── tsconfig.json          # TypeScript config
│   └── jest.config.js         # Jest config
├── frontend/                   # Frontend application
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   │   ├── (auth)/        # Auth pages group
│   │   │   ├── (dashboard)/   # Dashboard pages group
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Home page
│   │   │   └── globals.css    # Global styles
│   │   ├── components/        # React components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── course/        # Course components
│   │   │   └── editor/        # Editor components
│   │   ├── lib/               # Utility libraries
│   │   ├── store/             # Zustand stores
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   ├── Dockerfile             # Frontend Docker image
│   ├── package.json           # Dependencies
│   ├── next.config.js         # Next.js config
│   ├── tailwind.config.ts     # Tailwind config
│   └── tsconfig.json          # TypeScript config
├── nginx/                      # Nginx configuration
│   └── nginx.conf             # Nginx config file
├── database/                   # Database initialization
│   └── init.sql               # Init script
├── scripts/                    # Utility scripts
│   ├── verify-setup.sh        # Setup verification
│   └── quick-start.sh         # Quick start script
├── docker-compose.yml          # Docker Compose config
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── Makefile                    # Make commands
├── README.md                   # Project overview
├── SETUP.md                    # Setup guide
├── ARCHITECTURE.md             # This file
└── LICENSE                     # MIT License
```

## Data Flow

### User Authentication Flow

```
1. User submits credentials
   ↓
2. Frontend sends POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend queries PostgreSQL
   ↓
5. Backend verifies password (bcrypt)
   ↓
6. Backend generates JWT token
   ↓
7. Backend returns token to frontend
   ↓
8. Frontend stores token (localStorage)
   ↓
9. Frontend includes token in subsequent requests
```

### Course Learning Flow

```
1. User requests course list
   ↓
2. Backend checks Redis cache
   ├─ Cache hit → Return cached data
   └─ Cache miss ↓
3. Backend queries PostgreSQL
   ↓
4. Backend caches result in Redis
   ↓
5. Backend returns course list
   ↓
6. User selects a course
   ↓
7. Backend fetches course details + chapters
   ↓
8. Frontend renders course content (Markdown)
   ↓
9. User marks chapter as complete
   ↓
10. Backend updates Progress table
    ↓
11. Backend invalidates cache
    ↓
12. Backend checks for badge eligibility
    ↓
13. Backend awards badges if criteria met
```

### Code Compilation Flow

```
1. User writes Solidity code in editor
   ↓
2. User clicks "Compile"
   ↓
3. Frontend sends POST /api/editor/compile
   ↓
4. Backend receives code
   ↓
5. Backend validates code size/format
   ↓
6. Backend spawns Web Worker
   ↓
7. Worker compiles code with solc.js
   ↓
8. Worker returns ABI + bytecode
   ↓
9. Backend returns result to frontend
   ↓
10. Frontend displays compilation result
```

### Contract Deployment Flow

```
1. User clicks "Deploy"
   ↓
2. Frontend sends POST /api/editor/deploy
   ↓
3. Backend connects to Sepolia via Infura
   ↓
4. Backend creates transaction
   ↓
5. Backend signs transaction
   ↓
6. Backend sends transaction to network
   ↓
7. Backend waits for confirmation
   ↓
8. Backend returns contract address + tx hash
   ↓
9. Frontend displays deployment result
```

## Security Architecture

### Authentication & Authorization

- **JWT Tokens**: Stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Wallet Signatures**: Ethers.js signature verification
- **Role-Based Access**: USER and ADMIN roles

### API Security

- **Rate Limiting**: Express rate limiter
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **Input Validation**: Joi schemas
- **SQL Injection**: Prevented by Prisma ORM
- **XSS**: DOMPurify sanitization

### Infrastructure Security

- **HTTPS**: SSL/TLS encryption (production)
- **Environment Variables**: Secrets management
- **Docker**: Isolated containers
- **Non-root Users**: Containers run as non-root
- **Health Checks**: Service monitoring

## Scalability Considerations

### Horizontal Scaling

- **Stateless Backend**: Can run multiple instances
- **Load Balancing**: Nginx distributes traffic
- **Session Storage**: Redis for shared sessions
- **Database Pooling**: Connection pool management

### Caching Strategy

- **Redis Cache**: Course lists, user profiles
- **CDN**: Static assets (production)
- **Browser Cache**: Client-side caching
- **Query Optimization**: Database indexes

### Performance Optimization

- **Code Splitting**: Next.js automatic splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Dynamic imports
- **Compression**: Gzip compression
- **Database Indexes**: Optimized queries

## Monitoring & Logging

### Application Logs

- **Winston Logger**: Structured logging
- **Log Levels**: error, warn, info, debug
- **Log Rotation**: Automatic rotation
- **Log Storage**: File system + external service

### Metrics

- **Health Checks**: /health endpoints
- **Response Times**: Request duration logging
- **Error Rates**: Error tracking
- **Resource Usage**: Docker stats

### Error Tracking

- **Sentry Integration**: Optional error tracking
- **Stack Traces**: Detailed error information
- **User Context**: User ID, request ID

## Deployment Architecture

### Development Environment

```
Local Machine
├── Docker Compose
│   ├── PostgreSQL (local)
│   ├── Redis (local)
│   ├── MinIO (local)
│   └── Nginx (local)
├── Backend (npm run dev)
└── Frontend (npm run dev)
```

### Production Environment

```
Cloud Provider (AWS/GCP/Azure)
├── Load Balancer
├── Application Servers (multiple instances)
│   ├── Docker Containers
│   │   ├── Nginx
│   │   ├── Frontend
│   │   └── Backend
├── Managed Database (RDS/Cloud SQL)
├── Managed Cache (ElastiCache/Memorystore)
├── Object Storage (S3/Cloud Storage)
└── Monitoring (CloudWatch/Stackdriver)
```

## API Architecture

### RESTful API Design

- **Resource-based URLs**: `/api/courses`, `/api/users`
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: Proper HTTP status codes
- **JSON Format**: Consistent response format
- **Versioning**: API version in URL (future)

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  }
}
```

## Database Architecture

### Schema Design

- **Normalized Structure**: 3NF normalization
- **Foreign Keys**: Referential integrity
- **Indexes**: Performance optimization
- **Timestamps**: Created/updated tracking
- **Soft Deletes**: Optional soft delete support

### Relationships

- **One-to-Many**: User → Progress, Course → Chapters
- **Many-to-Many**: User ↔ Badges (through UserBadge)
- **Optional**: Chapter → Notes (nullable foreign key)

## Testing Architecture

### Test Pyramid

```
        ┌─────────────┐
        │     E2E     │  ← Few, slow, expensive
        ├─────────────┤
        │ Integration │  ← Some, medium speed
        ├─────────────┤
        │    Unit     │  ← Many, fast, cheap
        └─────────────┘
```

### Testing Strategy

- **Unit Tests**: Individual functions/components
- **Property Tests**: Universal properties (fast-check)
- **Integration Tests**: API endpoints
- **E2E Tests**: User journeys (future)

### Test Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Future Enhancements

### Planned Features

- [ ] Real-time collaboration (WebSockets)
- [ ] Video tutorials integration
- [ ] Mobile app (React Native)
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] AI-powered code suggestions
- [ ] Blockchain certificate issuance (NFTs)

### Scalability Improvements

- [ ] Microservices architecture
- [ ] Message queue (RabbitMQ/Kafka)
- [ ] GraphQL API
- [ ] Kubernetes deployment
- [ ] Multi-region deployment
- [ ] CDN integration

---

**Document Version**: 1.0  
**Last Updated**: 2025-02-04  
**Maintained By**: Development Team
