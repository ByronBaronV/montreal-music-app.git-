# Campus Study Hub

Campus Study Hub is a beginner-friendly full-stack web app for students.
Users can:

- Create an account and login (JWT authentication)
- Manage their own study sessions (full CRUD)
- Manage their own study resources (full CRUD)
- See real-time updates using Socket.io events

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt, Socket.io
- Frontend: React + Vite, Axios, React Router, Socket.io Client

## Run Locally

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

### 2) Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`
Backend default URL: `http://localhost:5000`

## Environment Variables

### backend/.env

- `PORT` - Port for Express server (example: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key used to sign JWT tokens
- `CLIENT_URL` - Frontend URL allowed by CORS

### frontend/.env

- `VITE_API_URL` - Backend base URL (example: `http://localhost:5000`)

## Required Socket.io Events in this project

- `session:created` - Emitted when a study session is created
- `resource:created` - Emitted when a study resource is created

Extra events included:

- `session:updated`
- `resource:updated`
- `session:deleted`
- `resource:deleted`
