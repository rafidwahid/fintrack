# Fintrack - Credit Card Management System

Fintrack is a comprehensive credit card management system that helps users track and manage their credit card statements, transactions, and bank information.

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v16 or higher)
- Yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd fintrack/backend
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:

```
DATABASE_URL="postgresql://card_user:card_user_password@localhost:5445/credit_statements"
REDIS_PASSWORD=your_redis_password
REDIS_PORT=6379
```

### Running the Application

#### Using Docker (Recommended)

1. Start all services:

```bash
make up
```

2. Build services (if needed):

```bash
make build
```

3. View logs:

```bash
make logs
```

4. Stop services:

```bash
make down
```

#### Development Mode

Run the application in development mode:

```bash
make dev
```

### Database Management

The application uses PostgreSQL as the primary database and Redis for session management.

#### Database Seeding

To seed the database with initial bank data:

```bash
npx prisma db seed
```

## 📁 Project Structure

```
backend/
├── src/              # Source code
├── prisma/          # Database schema and migrations
├── data/            # Data files (e.g., banks.json)
├── test/            # Test files
├── uploads/         # File uploads directory
├── docker-compose.yml
├── Makefile
└── package.json
```

## 🛠️ Available Commands

- `make up` - Start all services in background
- `make down` - Stop and remove all services
- `make build` - Build or rebuild services
- `make logs` - View logs for all services
- `make redis-cli` - Connect to Redis CLI
- `make restart` - Restart all services
- `make clean` - Remove all containers, networks, and volumes
- `make dev` - Run in development mode

## 🔧 Technology Stack

- **Backend Framework**: NestJS
- **Database**: PostgreSQL
- **Cache**: Redis
- **ORM**: Prisma
- **Containerization**: Docker
- **Package Manager**: Yarn

## 📝 API Documentation

API documentation is available at `/api/docs` when running the application.

## 🧪 Testing

To run tests:

```bash
yarn test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
