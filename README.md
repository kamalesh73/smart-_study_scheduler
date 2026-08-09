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

This repo is a monorepo with `server/` and `client/` packages. For a frontend-only deployment on Vercel, keep the React app in `client/` and point it to a separately hosted backend API.

1. Add `vercel.json` at the repository root.
2. Set the Vercel project root to the repository root.
3. Vercel will build the React frontend from `client/package.json` and serve it as a static app.
4. Set `VITE_API_URL` in your Vercel project to the full backend URL (for example, your Render service URL plus `/api`).

If you prefer to host the API separately, keep the backend on Render or another Node hosting platform and point the frontend to that URL.

## Deploying to Render

The backend is already structured as a standard Node.js/Express service and can be deployed to Render as a Web Service.

1. Create a new Web Service in Render and connect this repository.
2. Render will read [render.yaml](render.yaml) automatically.
3. Set the following environment variables in Render:
   - `MONGODB_URI` — your MongoDB connection string
   - `JWT_SECRET` — a secure JWT secret
   - `CLIENT_URL` — your deployed frontend URL (for CORS)
4. Use the Render service URL as the value for `VITE_API_URL` in your Vercel frontend project.

The health check endpoint is `/api/health`, so Render can verify that the server starts correctly.

## API Overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/subjects`
- `GET/POST/PUT/DELETE /api/tasks`
- `GET /api/schedule`
- `GET /api/insights`
