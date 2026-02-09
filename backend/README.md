# Web3 Learning Platform - Backend API

Backend API server for the Web3 Learning Platform, built with Node.js, Express, TypeScript, and Prisma.

## Prerequisites

- **Node.js**: >= 18.0.0 (LTS recommended)
- **npm**: >= 9.0.0
- **PostgreSQL**: >= 15
- **Redis**: >= 7 (optional, for caching)

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.ts    # Global error handling
│   │   └── requestLogger.ts   # HTTP request logging
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   │   └── logger.ts    # Winston logger configuration
│   └── index.ts         # Application entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # Database migrations
│   └── seed.ts          # Database seeding
├── logs/                # Application logs
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment variables template
└── package.json         # Dependencies and scripts
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` and configure:
- Database connection string
- JWT secret key
- API keys (Infura/Alchemy)
- Other service credentials

### 3. Database Setup

Generate Prisma client:
```bash
npm run prisma:generate
```

Run database migrations:
```bash
npm run prisma:migrate
```

Seed the database (optional):
```bash
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:4000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:property` - Run property-based tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Features Implemented

### ✅ Task 3.1: Express Server Setup

#### Middleware Configuration

1. **Security Middleware (Helmet)**
   - Content Security Policy
   - XSS Protection
   - MIME type sniffing prevention
   - Clickjacking protection

2. **CORS Configuration**
   - Configurable origin
   - Credentials support
   - Custom headers support

3. **Compression**
   - Response compression for better performance
   - Configurable compression level
   - Size threshold (1KB minimum)

4. **Body Parsing**
   - JSON body parser (10MB limit)
   - URL-encoded body parser

#### Error Handling

**Custom Error Class (`AppError`)**
```typescript
throw new AppError(400, 'VALIDATION_ERROR', 'Invalid email format');
```

**Global Error Handler**
- Catches all errors
- Standardized error responses
- Handles Prisma errors
- Handles JWT errors
- Logs errors with Winston
- Different messages for production/development

**Error Response Format**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {},
    "requestId": "req_123456"
  }
}
```

**Supported Error Types**
- `AppError` - Custom application errors
- `Prisma` errors - Database errors
- `JWT` errors - Authentication errors
- `ValidationError` - Input validation errors
- `SyntaxError` - Malformed JSON
- Generic errors - Catch-all

#### Logging System (Winston)

**Log Levels**
- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `http` - HTTP request logs
- `debug` - Debug messages

**Log Transports**
- Console (development only, colorized)
- File: `logs/error.log` (errors only)
- File: `logs/combined.log` (all logs)

**Log Rotation**
- Max file size: 5MB
- Max files: 5
- Automatic rotation

**HTTP Request Logging (Morgan)**
- All HTTP requests logged
- Response time tracking
- Skip health check endpoint
- JSON format in production

#### Health Check Endpoint

```
GET /health
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-02-04T10:00:00.000Z",
    "uptime": 123.456,
    "environment": "development"
  }
}
```

#### Graceful Shutdown

- Handles `SIGTERM` and `SIGINT` signals
- Closes server gracefully
- Logs shutdown process

#### Error Recovery

- Handles unhandled promise rejections
- Handles uncaught exceptions
- Logs errors before exit
- Graceful server shutdown

## API Response Format

All API responses follow a standardized format:

**Success Response**
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Optional success message"
}
```

**Error Response**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

## Environment Variables

See `.env.example` for all available environment variables.

**Required Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

**Optional Variables:**
- `PORT` - Server port (default: 4000)
- `LOG_LEVEL` - Logging level (default: info)
- `CORS_ORIGIN` - Allowed CORS origin
- `REDIS_URL` - Redis connection string
- `INFURA_API_KEY` - Infura API key
- `ALCHEMY_API_KEY` - Alchemy API key

## Testing

### Unit Tests
```bash
npm test
```

### Property-Based Tests
```bash
npm run test:property
```

### Test Coverage
```bash
npm test -- --coverage
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set environment to production:
```bash
export NODE_ENV=production
```

3. Run database migrations:
```bash
npm run prisma:migrate:prod
```

4. Start the server:
```bash
npm start
```

## Docker Support

Build Docker image:
```bash
docker build -t web3-learning-backend .
```

Run container:
```bash
docker run -p 4000:4000 --env-file .env web3-learning-backend
```

## Troubleshooting

### Node.js Version Error

If you see "Prisma only supports Node.js >= 16.13":
1. Check your Node.js version: `node --version`
2. Upgrade to Node.js 18 LTS or later
3. Use nvm: `nvm install 18 && nvm use 18`

### Database Connection Error

1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Ensure database exists
4. Check network connectivity

### Port Already in Use

Change the port in `.env`:
```
PORT=4001
```

## Next Steps

- [ ] Implement authentication routes
- [ ] Add course management endpoints
- [ ] Implement code editor APIs
- [ ] Add challenge system
- [ ] Implement community features
- [ ] Add admin dashboard APIs

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
