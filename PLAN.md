# World Cup Betting Pool - Implementation Plan

## Project Overview
Fullstack web application using Next.js App Router, PostgreSQL, and Prisma for managing a World Cup betting pool among friends.

---

## Agent Architecture

### 1. Infrastructure Agent (`/infra`)
**Purpose:** Project setup, configuration, and infrastructure management

**Responsibilities:**
- Initialize Next.js project with TypeScript
- Install and configure dependencies
- Set up Prisma and database connection
- Configure environment variables (.env, .env.example)
- Set up CI/CD workflows (GitHub Actions)
- Docker configuration (if needed)
- Folder structure setup

**Commands:**
- `npx create-next-app@latest`
- `npm install` / `npm install --save-dev`
- `npx prisma init`
- `npx prisma db push`

---

### 2. Backend Agent (`/backend`)
**Purpose:** API routes, database operations, authentication, and business logic

**Responsibilities:**
- Create Prisma schema (User, Team, Match, Prediction)
- Write seed script for teams and matches
- Implement auth utilities (bcryptjs, JWT)
- Create auth API routes (register, login, logout, me)
- Build matches API (GET all, GET by id)
- Build predictions API (GET, POST, PUT)
- Implement lock validation (no edits after match start)
- Create scoring logic (exact=3pts, winner=1pt)
- Build ranking API
- Implement export API routes

**Key Files:**
- `/prisma/schema.prisma`
- `/prisma/seed.ts`
- `/src/lib/auth.ts`
- `/src/lib/cookies.ts`
- `/src/lib/scoring.ts`
- `/src/lib/ranking.ts`
- `/src/lib/export.ts`
- `/src/middleware.ts`
- All `/src/api/` routes

---

### 3. Frontend Agent (`/frontend`)
**Purpose:** UI components, pages, and user interface

**Responsibilities:**
- Create layout components (Navbar, ProtectedRoute)
- Build match components (MatchCard, MatchList, PredictionInput)
- Build dashboard components (ProgressCard, RankingPosition, NextMatches)
- Build ranking components (RankingTable, ExportButtons)
- Build simulation components (KnockoutBracket, MatchSelector)
- Build export components (ExportForm, ExportPreview)
- Create all pages (login, register, dashboard, matches, simulation, ranking, export)
- Implement responsive design (desktop + mobile)
- Form validation and error handling

**Key Files:**
- All `/src/components/` files
- All `/src/app/` page files

---

### 4. Task Board Agent (`/board`)
**Purpose:** Organize tasks in a project management board

**Recommended Tool: GitHub Projects**

**Why GitHub Projects:**
- Native integration with GitHub repository
- Automatically links PRs to issues/tasks
- Free for public repositories
- No external tool setup required
- Built-in automation (move tasks when PR opened/closed)
- Works seamlessly with Git/PR Agent

**Board Structure:**

| Column | Description |
|--------|-------------|
| Backlog | Tasks not yet started |
| In Progress | Currently working on |
| Review | Ready for code review |
| Done | Completed and merged |

**Automation Rules:**
- Move to Review when PR is opened
- Move to Done when PR is merged
- Move back to In Progress if PR needs changes

**Commands:**
- `gh issue create` - Create task from PLAN.md items
- `gh project item add` - Add item to project
- `gh project item edit` - Move item between columns

---

### 5. Git/PR Agent (`/git`)
**Purpose:** Manage git operations, commits, branches, and pull requests

**Responsibilities:**
- Create feature branches from main
- Commit changes with conventional commit messages
- Push branches to remote
- Create pull requests with descriptions
- Link PRs to GitHub Project tasks
- Update PRs based on review feedback
- Merge approved PRs
- Clean up merged branches

**Branch Naming Convention:**
- `infra/setup` - Infrastructure tasks
- `backend/auth` - Authentication features
- `backend/api-matches` - Matches API
- `backend/api-predictions` - Predictions API
- `frontend/dashboard` - Dashboard page
- `frontend/matches` - Matches page
- etc.

**Commit Message Format:**
```
<type>(<scope>): <description>

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`

**PR Template:**
```markdown
## Summary
- [Bullet point describing changes]

## Test plan
- [ ] Code compiles without errors
- [ ] Manual testing completed
- [ ] Changes follow the plan in PLAN.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**Commands:**
- `git checkout -b <branch-name>`
- `git add` / `git commit -m "message"`
- `git push -u origin <branch-name>`
- `gh pr create` - Create pull request

---



## Execution Order (from spec)
1. Setup project
2. Prisma schema
3. Seed script
4. Auth
5. Matches API
6. Predictions API
7. UI
8. Scoring
9. Ranking
10. Simulation
11. Export

---

## Agent Task Breakdown

### Infrastructure Agent Tasks

| Task | Priority | Dependencies |
|------|----------|--------------|
| Initialize Next.js project with TypeScript | P0 | - |
| Install dependencies (Prisma, bcryptjs, jsonwebtoken, zod, jsPDF) | P0 | Init project |
| Configure .env and .env.example | P0 | Install deps |
| Initialize Prisma | P0 | Install deps |
| Create folder structure (/src/app, /components, /lib, /types, /api) | P1 | Init project |

### Backend Agent Tasks

| Task | Priority | Dependencies |
|------|----------|--------------|
| Create Prisma schema (User, Team, Match, Prediction) | P0 | Prisma init |
| Run `npx prisma db push` | P0 | Schema created |
| Create seed script for 32 World Cup teams | P1 | Schema created |
| Create seed script for 48 group stage matches | P1 | Teams seeded |
| Create seed script for 16 knockout matches (R16, QF, SF, Final) | P1 | Teams seeded |
| Link knockout structure (nextMatchId, nextMatchSlot) | P1 | Knockout matches created |
| Create auth utilities (hash, compare, JWT) | P0 | Schema created |
| Create cookie utilities (set, get, clear) | P0 | Auth utilities |
| POST /api/auth/register | P0 | Auth utilities |
| POST /api/auth/login | P0 | Auth utilities |
| POST /api/auth/logout | P1 | Auth utilities |
| GET /api/auth/me | P1 | Auth utilities |
| Create middleware for route protection | P0 | Auth utilities |
| GET /api/matches | P0 | Matches seeded |
| GET /api/matches/:id | P0 | Matches seeded |
| GET /api/predictions | P0 | Schema created |
| POST /api/predictions | P0 | Schema created |
| PUT /api/predictions/:matchId (with lock validation) | P0 | POST predictions |
| Create scoring utilities (exact=3, winner=1) | P0 | Schema created |
| Create ranking utilities | P0 | Scoring utilities |
| GET /api/ranking | P0 | Ranking utilities |
| GET /api/export/ranking | P1 | Ranking API |
| GET /api/export/predictions | P1 | Predictions API |

### Frontend Agent Tasks

| Task | Priority | Dependencies |
|------|----------|--------------|
| Create Navbar component (desktop + mobile hamburger) | P0 | - |
| Create ProtectedRoute wrapper component | P0 | - |
| Create MatchCard component | P0 | - |
| Create MatchList component | P0 | MatchCard |
| Create PredictionInput component | P0 | - |
| Create ProgressCard component | P0 | - |
| Create RankingPosition component | P0 | - |
| Create NextMatches component | P0 | - |
| Create RankingTable component | P0 | - |
| Create ExportButtons component | P1 | - |
| Create KnockoutBracket component | P1 | - |
| Create MatchSelector component | P1 | - |
| Create ExportForm component | P1 | - |
| Create ExportPreview component | P2 | - |
| Create login page | P0 | - |
| Create register page | P0 | - |
| Create dashboard page | P0 | Dashboard components |
| Create matches page | P0 | Match components |
| Create simulation page | P1 | Simulation components |
| Create ranking page | P0 | Ranking components |
| Create export page | P1 | Export components |

### Git/PR Agent Tasks

| Task | When |
|------|------|
| Create `infra/setup` branch | Start of project |
| Commit and push infra setup changes | After infra tasks |
| Create PR for infra setup | Ready for review |
| Create `backend/auth` branch | Start of auth implementation |
| Commit and push auth changes | After auth tasks |
| Create PR for auth | Ready for review |
| ... (repeat for each feature branch) | ... |
| Merge approved PRs to main | After review approved |
| Delete merged branches | After merge |

---

## Phase 1: Project Setup

### 1.1 Initialize Next.js Project
- Create Next.js project with TypeScript
- Install dependencies: Prisma, bcryptjs, jsonwebtoken, joi/zod, jsPDF (for export)
- Configure environment variables (.env)
- Set up project folder structure

### 1.2 Configure Prisma
- Initialize Prisma (`npx prisma init`)
- Set up PostgreSQL connection string
- Generate Prisma client

---

## Phase 2: Database Schema & Seed

### 2.1 Create Prisma Schema
- Define `User` model
- Define `Team` model
- Define `Match` model with knockout linking (nextMatchId, nextMatchSlot)
- Define `Prediction` model with unique constraint
- Run `npx prisma db push`

### 2.2 Create Seed Script
- Create `/prisma/seed.ts` or `/scripts/seed.ts`
- Insert World Cup teams (32 teams with flags)
- Insert group stage matches (48 matches)
- Insert knockout matches (16 matches: R16, QF, SF, Final, 3rd place)
- Link knockout structure (nextMatchId/nextMatchSlot)
- Add seed script to package.json

---

## Phase 3: Authentication

### 3.1 Auth Utilities
- Create `/src/lib/auth.ts`:
  - Hash password with bcryptjs
  - Compare password
  - Generate JWT
  - Verify JWT
- Create `/src/lib/cookies.ts`:
  - Set HTTP-only cookie
  - Get/clear cookie functions

### 3.2 Auth Middleware
- Create `/src/middleware.ts`
- Verify JWT from cookies
- Protect routes (dashboard, matches, ranking, export, simulation)
- Redirect to login if unauthenticated

### 3.3 Auth API Routes
- `POST /api/auth/register` - Create user, return token
- `POST /api/auth/login` - Verify credentials, return token
- `POST /api/auth/logout` - Clear cookie
- `GET /api/auth/me` - Return current user from token

---

## Phase 4: Matches API

### 4.1 Match Types
- Create `/src/types/match.ts` - Match type definitions

### 4.2 Matches API Routes
- `GET /api/matches` - Return all matches, optionally filtered by stage
- `GET /api/matches/:id` - Return single match with team details

---

## Phase 5: Predictions API

### 5.1 Prediction Types
- Create `/src/types/prediction.ts` - Prediction type definitions

### 5.2 Prediction API Routes
- `GET /api/predictions` - Return user's predictions
- `POST /api/predictions` - Create new prediction
- `PUT /api/predictions/:matchId` - Update prediction (validate not locked)

### 5.3 Lock Validation
- Check match date before allowing prediction update
- Return 403 if match has started

---

## Phase 6: Scoring System

### 6.1 Scoring Utilities
- Create `/src/lib/scoring.ts`:
  - `calculateExactScorePoints(prediction, actualResult)` - 3 points
  - `calculateWinnerPoints(prediction, actualResult)` - 1 point
  - `calculateTotalPoints(predictions)` - Sum all points

---

## Phase 7: Ranking API

### 7.1 Ranking Utilities
- Create `/src/lib/ranking.ts`:
  - `calculateUserRankings()` - Aggregate points per user
  - Count exact scores and correct winners

### 7.2 Ranking API Route
- `GET /api/ranking` - Return sorted ranking table

---

## Phase 8: UI Components

### 8.1 Layout Components
- `/src/components/layout/Navbar.tsx` - Navigation with mobile hamburger
- `/src/components/layout/ProtectedRoute.tsx` - Auth wrapper for pages

### 8.2 Match Components
- `/src/components/matches/MatchCard.tsx` - Single match with prediction inputs
- `/src/components/matches/MatchList.tsx` - List of matches grouped by stage
- `/src/components/matches/PredictionInput.tsx` - Score inputs with save button

### 8.3 Dashboard Components
- `/src/components/dashboard/ProgressCard.tsx` - Matches predicted vs total
- `/src/components/dashboard/RankingPosition.tsx` - Current rank
- `/src/components/dashboard/NextMatches.tsx` - Upcoming matches to predict

### 8.4 Ranking Components
- `/src/components/ranking/RankingTable.tsx` - Leaderboard table
- `/src/components/ranking/ExportButtons.tsx` - PDF/table export options

### 8.5 Simulation Components
- `/src/components/simulation/KnockoutBracket.tsx` - Simple form-based bracket
- `/src/components/simulation/MatchSelector.tsx` - Select winner for each match

### 8.6 Export Components
- `/src/components/export/ExportForm.tsx` - Export type selector
- `/src/components/export/ExportPreview.tsx` - Preview before export

---

## Phase 9: Pages

### 9.1 Auth Pages
- `/src/app/login/page.tsx` - Login form with validation
- `/src/app/register/page.tsx` - Registration form with password confirmation

### 9.2 Dashboard Page
- `/src/app/dashboard/page.tsx`:
  - Welcome message with user name
  - Progress card (X/64 matches predicted)
  - Current ranking position
  - Next matches to predict

### 9.3 Matches Page
- `/src/app/matches/page.tsx`:
  - Group stage matches (A-H)
  - Knockout stages (R16, QF, SF, Final)
  - Each match: flags, team names, score inputs, save button
  - Status indicators: saved ✔, locked 🔒

### 9.4 Simulation Page
- `/src/app/simulation/page.tsx`:
  - Quarter finals section with winner selection
  - Semi finals section
  - Final section
  - Champion display
  - Save simulation button

### 9.5 Ranking Page
- `/src/app/ranking/page.tsx`:
  - Ranking table: #, Name, Points, Exact, Winner
  - Export PDF button
  - Export Table button

### 9.6 Export Page
- `/src/app/export/page.tsx`:
  - Export type radio buttons (Ranking, My Predictions, Full Simulation)
  - Export as PDF button
  - Export as Table button
  - Optional preview

---

## Phase 10: Export Functionality

### 10.1 Export API Routes
- `GET /api/export/ranking` - Generate ranking export
- `GET /api/export/predictions` - Generate user predictions export

### 10.2 Export Utilities
- `/src/lib/export.ts`:
  - `generatePDF(data, type)` - Use jsPDF
  - `generateTable(data, type)` - HTML table for CSV

---

## Critical Files Structure

```
/src
  /app
    /login/page.tsx
    /register/page.tsx
    /dashboard/page.tsx
    /matches/page.tsx
    /simulation/page.tsx
    /ranking/page.tsx
    /export/page.tsx
  /components
    /layout/Navbar.tsx
    /layout/ProtectedRoute.tsx
    /matches/MatchCard.tsx
    /matches/MatchList.tsx
    /matches/PredictionInput.tsx
    /dashboard/ProgressCard.tsx
    /dashboard/RankingPosition.tsx
    /dashboard/NextMatches.tsx
    /ranking/RankingTable.tsx
    /ranking/ExportButtons.tsx
    /simulation/KnockoutBracket.tsx
    /simulation/MatchSelector.tsx
    /export/ExportForm.tsx
    /export/ExportPreview.tsx
  /lib
    auth.ts
    cookies.ts
    scoring.ts
    ranking.ts
    export.ts
  /types
    match.ts
    prediction.ts
    user.ts
  /api
    /auth
      /register/route.ts
      /login/route.ts
      /logout/route.ts
      /me/route.ts
    /matches
      /route.ts
      /[id]/route.ts
    /predictions
      /route.ts
      /[matchId]/route.ts
    /ranking
      /route.ts
    /export
      /ranking/route.ts
      /predictions/route.ts
/prisma
  schema.prisma
  /seed.ts
middleware.ts
```

---

## Verification

### Testing Checklist

1. **Setup**
   - [ ] Next.js dev server runs (`npm run dev`)
   - [ ] Prisma connects to database
   - [ ] Seed script executes successfully

2. **Auth**
   - [ ] Register creates new user
   - [ ] Login with valid credentials works
   - [ ] Invalid credentials rejected
   - [ ] Protected routes redirect to login
   - [ ] Logout clears session

3. **Matches**
   - [ ] All matches display grouped by stage
   - [ ] Team flags and names visible
   - [ ] Match dates shown

4. **Predictions**
   - [ ] User can save prediction for editable match
   - [ ] Locked match cannot be edited
   - [ ] Prediction persists on refresh
   - [ ] Validation: scores must be non-negative integers

5. **Scoring**
   - [ ] Exact score = 3 points
   - [ ] Correct winner = 1 point
   - [ ] Incorrect = 0 points

6. **Ranking**
   - [ ] Ranking table displays correctly
   - [ ] Points calculated accurately
   - [ ] Sort order is descending by points
   - [ ] Exact/winner counts correct

7. **Simulation**
   - [ ] Knockout bracket displays
   - [ ] Winners can be selected
   - [ ] Progression through stages works

8. **Export**
   - [ ] PDF export generates file
   - [ ] Table export generates data
   - [ ] Both ranking and predictions export work

9. **Responsive Design**
   - [ ] Desktop navigation works
   - [ ] Mobile hamburger menu works
   - [ ] Layout adapts to mobile screens
