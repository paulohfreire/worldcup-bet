# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

World Cup Betting Pool (MVP) - A fullstack web application for managing a World Cup betting pool among friends. Built with Next.js App Router, PostgreSQL, and Prisma.

## Tech Stack

- **Frontend**: Next.js (App Router)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT stored in HTTP-only cookies

## Database Schema (Prisma)

### Core Models

- **User**: id, name, email, password, role (default: "user"), createdAt
- **Team**: id, name, code, flagUrl, group
- **Match**: id, stage, group, order, homeTeamId, awayTeamId, date, homeScore, awayScore, nextMatchId, nextMatchSlot
- **Prediction**: id, userId, matchId, homeScore, awayScore (unique constraint on [userId, matchId])

### Knockout Structure

Matches link to next matches via `nextMatchId` and `nextMatchSlot` (home/away position) for bracket simulation.

## Scoring System

- Exact score → 3 points
- Correct winner → 1 point
- Incorrect → 0 points

## Key Business Rules

1. **Prediction Lock**: Users cannot edit predictions after match start time
2. **Ranking**: Sum of all points per user, sorted descending
3. **Auth Middleware**: Protected routes require valid JWT

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Matches
- GET /api/matches
- GET /api/matches/:id

### Predictions
- GET /api/predictions
- POST /api/predictions
- PUT /api/predictions/:matchId

### Ranking
- GET /api/ranking

### Export
- GET /api/export/ranking
- GET /api/export/predictions

## Page Structure

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Welcome, progress, next matches
- `/matches` - All matches grouped by stage, with prediction inputs
- `/simulation` - Knockout stage bracket simulation (simple form for MVP)
- `/ranking` - Leaderboard with export options
- `/export` - Export ranking/predictions as PDF or table

## Navigation

Global navigation includes: Logo, Dashboard, Matches, Ranking, Export, Logout (desktop) / hamburger menu (mobile)

## Seed Script

Located in `/scripts/seed.ts` - inserts teams, matches, and links knockout structure.

## Development Commands

```
npm install           # Install dependencies
npm run dev           # Start development server
npm run build         # Build for production
npm run lint          # Run ESLint
npx prisma generate   # Generate Prisma client
npx prisma db push    # Push schema to database
npx prisma db seed    # Run seed script
```

## Simulation (Knockout Stages)

For MVP, simulation is handled in the frontend derived from predictions. Simple form-based interface rather than visual bracket.
