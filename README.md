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

## API Overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/subjects`
- `GET/POST/PUT/DELETE /api/tasks`
- `GET /api/schedule`
- `GET /api/insights`
