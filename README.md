# Smart Study Scheduler (MERN)

A fully featured Smart Study Scheduler built with:
- MongoDB
- Express.js
- React (Vite)
- Node.js

## Features
- JWT authentication (register/login)
- Subject management
- Study task planner
- Smart schedule generation based on urgency + priority
- Insights dashboard (completion rate, weekly done, subject progress)

## Project Structure
- `server/` Express + MongoDB API
- `client/` React frontend

## Setup

1. Install dependencies:
```bash
npm run install:all
```

2. Configure backend env:
```bash
cd server
copy .env.example .env
```
Update `.env` values if needed.

3. Configure frontend env:
```bash
cd ../client
copy .env.example .env
```

4. Start backend:
```bash
cd ../server
npm run dev
```

5. Start frontend (new terminal):
```bash
cd ../client
npm run dev
```

## Deploying to Vercel

This repo is a monorepo with `server/` and `client/` packages. It now supports full-stack deployment on Vercel:

1. Add `vercel.json` at the repository root.
2. Set the Vercel project root to the repository root.
3. Vercel will build the React frontend from `client/package.json` and deploy the Express backend as a serverless function from `server/api/index.js`.
4. Set the following environment variables in your Vercel project:
   - `MONGODB_URI` — your MongoDB connection string
   - `JWT_SECRET` — a secure JWT secret
   - `CLIENT_URL` — the production frontend URL (for CORS)
   - `VITE_API_URL` — `/api`

The backend API will be available at `/api` on the same Vercel deployment.

If you prefer to host the API separately, set `VITE_API_URL` to the full backend URL instead.

## API Overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/subjects`
- `GET/POST/PUT/DELETE /api/tasks`
- `GET /api/schedule`
- `GET /api/insights`
