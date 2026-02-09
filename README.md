# Web3 Learning Platform

A comprehensive Web3 learning platform that helps developers learn blockchain and Web3 development from scratch. The platform includes knowledge learning, practical exercises, code examples, and an online editor.

## Features

- 🎓 **Systematic Learning Path**: Structured courses from beginner to advanced
- 💻 **Online Code Editor**: Write and test Solidity and JavaScript code in the browser
- 🏆 **Achievement System**: Earn badges and compete on leaderboards
- 👥 **Community Features**: Discussion forum and note-taking system
- 🔐 **Web3 Authentication**: Support for MetaMask wallet login
- 🐳 **Docker Deployment**: Easy deployment with Docker Compose

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **UI**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Code Editor**: Monaco Editor
- **Web3**: Ethers.js v6

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 4
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: JWT + Passport.js
- **Storage**: MinIO (S3-compatible)

### DevOps
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions

## Project Structure

```
web3-learning-platform/
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/          # Next.js 14 App Router
│   │   ├── components/   # React components
│   │   ├── lib/          # Utility libraries
│   │   ├── store/        # Zustand state management
│   │   └── types/        # TypeScript type definitions
│   ├── public/           # Static assets
│   ├── Dockerfile
│   └── package.json
├── backend/              # Express backend application
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions
│   │   └── config/       # Configuration files
│   ├── prisma/           # Prisma schema and migrations
│   ├── Dockerfile
│   └── package.json
├── nginx/                # Nginx configuration
│   └── nginx.conf
├── docker-compose.yml    # Docker Compose configuration
├── .env.example          # Environment variables template
└── README.md

```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/web3-learning-platform.git
   cd web3-learning-platform
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   docker-compose exec backend npm run prisma:migrate
   ```

5. **Seed initial data (optional)**
   ```bash
   docker-compose exec backend npm run prisma:seed
   ```

6. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost/api
   - MinIO Console: http://localhost:9001

### Local Development

#### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

#### Backend Development

```bash
cd backend
npm install
npm run dev
```

The backend API will be available at http://localhost:4000

## Environment Variables

See `.env.example` for all required environment variables.

### Key Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `REDIS_URL`: Redis connection string
- `INFURA_API_KEY`: Infura API key for blockchain interaction
- `MINIO_*`: MinIO storage configuration

## Docker Services

The application uses the following Docker services:

- **nginx**: Reverse proxy (port 80/443)
- **frontend**: Next.js application (port 3000)
- **backend**: Express API (port 4000)
- **postgres**: PostgreSQL database (port 5432)
- **redis**: Redis cache (port 6379)
- **minio**: Object storage (port 9000/9001)

## API Documentation

API documentation is available at `/api/docs` when running the backend server.

## Testing

### Run all tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Run property-based tests
```bash
cd backend
npm run test:property
```

## Deployment

### Production Deployment

1. Update environment variables for production
2. Build Docker images:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```
3. Start services:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### CI/CD

The project uses GitHub Actions for continuous integration and deployment. See `.github/workflows/` for configuration.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Code editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- Blockchain interaction via [Ethers.js](https://docs.ethers.org/)

## Support

For support, email support@web3learning.com or join our Discord community.

---

**Version**: 1.0.0  
**Last Updated**: 2025-02-04
