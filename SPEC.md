# 🧠 Technical Specification — World Cup Betting Pool (MVP)

## 1. Overview
Fullstack web application for managing a World Cup betting pool among friends.

Users can:
- Register and log in
- Predict match scores
- Simulate knockout stages
- View rankings
- Export data (PDF/table)

---

## 2. Architecture

- Frontend: Next.js (App Router)
- Backend: Next.js API Routes
- Database: PostgreSQL
- ORM: Prisma

---

## 3. Project Structure

/src
  /app
  /components
  /lib
  /services
  /types

/prisma
/scripts

---

## 4. Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())

  predictions Prediction[]
}

model Team {
  id        String @id @default(uuid())
  name      String
  code      String
  flagUrl   String
  group     String?
}

model Match {
  id              String   @id @default(uuid())
  stage           String
  group           String?
  order           Int
  homeTeamId      String
  awayTeamId      String
  date            DateTime

  homeScore       Int?
  awayScore       Int?

  nextMatchId     String?
  nextMatchSlot   String?

  predictions     Prediction[]
}

model Prediction {
  id          String @id @default(uuid())
  userId      String
  matchId     String

  homeScore   Int
  awayScore   Int

  user        User   @relation(fields: [userId], references: [id])
  match       Match  @relation(fields: [matchId], references: [id])

  @@unique([userId, matchId])
}
```

---

## 5. API Endpoints

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

---

## 6. Scoring Logic

- Exact score → 3 points
- Correct winner → 1 point
- Otherwise → 0

---

## 7. Ranking Logic

- Sum all points per user
- Sort descending

---

## 8. Auth Strategy

- JWT stored in HTTP-only cookies
- Middleware protects routes

---

## 9. Prediction Lock Rule

Users cannot edit predictions after match start time.

---

## 10. Simulation

- Handled in frontend (MVP)
- Derived from predictions

---

## 11. Seed Script

- Insert teams
- Insert matches
- Link knockout structure

---

## 12. Execution Order

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

## 13. Acceptance Criteria

- Auth works
- Matches visible
- Predictions saved
- Ranking correct
- Export works
- Responsive UI

---

## 14. Future Improvements

- Multiple pools
- Invitations
- Advanced scoring
- Live updates
- Notifications

