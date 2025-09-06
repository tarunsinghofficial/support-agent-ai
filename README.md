# AI Support Agent

Full-stack application with React frontend and Node.js backend for AI customer support.

## Requirements

- Docker and Docker Compose
- Git

## Setup

1. Clone the repository

```bash
git clone <your-repo-url>
cd cs-agent-app
```

2. Create environment file

```bash
cd server
cp env.example .env
```

3. Edit server/.env file

```bash
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
OPENROUTER_API_KEY=your-api-key
```

4. Start the application

```bash
cd ..
docker compose up
```

5. Open http://localhost in your browser

## Development

Start only the database:

```bash
docker compose up mongodb
```

Run client and server separately:

```bash
# Server
cd server
npm install
npm run dev

# Client
cd client
npm install
npm run dev
```

## API Endpoints

- POST /api/auth/signup - User registration
- POST /api/auth/login - User login
- GET /api/auth/profile - User profile
- POST /api/chat - Send message
- GET /api/health - Health check

## Troubleshooting

MongoDB connection issues:

1. Check MongoDB Atlas IP whitelist
2. Verify connection string in .env
3. Check credentials

Docker issues:

1. Ensure Docker is running
2. Check port availability
3. Rebuild: docker compose up --build
