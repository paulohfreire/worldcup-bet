import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(d)} às ${formatTime(d)}`;
}

export function isMatchStarted(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d <= new Date();
}

export function isMatchFinished(date: Date | string, homeScore?: number, awayScore?: number): boolean {
  return isMatchStarted(date) && homeScore !== undefined && awayScore !== undefined;
}

export function calculatePoints(
  predictionHome: number,
  predictionAway: number,
  actualHome?: number,
  actualAway?: number
): number {
  if (actualHome === undefined || actualAway === undefined) {
    return 0;
  }

  // Placar exato: 3 pontos
  if (predictionHome === actualHome && predictionAway === actualAway) {
    return 3;
  }

  // Vencedor correto: 1 ponto
  const predictionWinner = predictionHome > predictionAway ? 'home' : predictionHome < predictionAway ? 'away' : 'draw';
  const actualWinner = actualHome > actualAway ? 'home' : actualHome < actualAway ? 'away' : 'draw';

  if (predictionWinner === actualWinner) {
    return 1;
  }

  return 0;
}

export function getTeamFlagUrl(code: string): string {
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}

export function getStageName(stage: string): string {
  const stageNames: Record<string, string> = {
    'group': 'Fase de Grupos',
    'round16': 'Oitavas de Final',
    'quarter': 'Quartas de Final',
    'semi': 'Semifinais',
    'final': 'Final',
    'third': 'Disputa de 3º Lugar',
  };
  return stageNames[stage] || stage;
}

export function getGroupName(group: string): string {
  return `Grupo ${group}`;
}

export function isPredictionLocked(date: Date | string, homeScore?: number, awayScore?: number): boolean {
  return isMatchStarted(date);
}
