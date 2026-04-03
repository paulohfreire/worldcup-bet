export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  flagUrl: string;
  group?: string;
}

export interface Match {
  id: string;
  stage: string;
  group?: string;
  order: number;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  homeScore?: number;
  awayScore?: number;
  nextMatchId?: string;
  nextMatchSlot?: "home" | "away";
  homeTeam?: Team;
  awayTeam?: Team;
}

export interface Prediction {
  id: string;
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  match?: Match;
}

export interface MatchWithTeams extends Match {
  homeTeam: Team;
  awayTeam: Team;
  myPrediction?: Prediction;
}

export interface RankingEntry {
  user: User;
  totalPoints: number;
  exactPredictions: number;
  correctPredictions: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
