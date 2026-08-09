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
cd mern_smart_study_scheduler
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

This repo is a monorepo with `server/` and `client/` packages. Vercel should deploy only the `client` frontend package because the Express backend is not configured as Vercel serverless functions.

1. Add `vercel.json` at the repository root.
2. Set the Vercel project root to the repository root and let Vercel detect `client/package.json` via `vercel.json`.
3. Ensure the build command runs from `client/package.json` and the static output directory is `dist`.

If you want to deploy the backend too, host the Express server separately and point the frontend to that API URL.

## API Overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/subjects`
- `GET/POST/PUT/DELETE /api/tasks`
- `GET /api/schedule`
- `GET /api/insights`
