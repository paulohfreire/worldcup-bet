// API helper functions for making requests to the backend

export async function getMatches(): Promise<any[]> {
  const response = await fetch('/api/matches');
  if (!response.ok) {
    throw new Error('Failed to fetch matches');
  }
  return response.json();
}

export async function getPredictions(): Promise<any[]> {
  const response = await fetch('/api/predictions');
  if (!response.ok) {
    throw new Error('Failed to fetch predictions');
  }
  return response.json();
}

export async function submitPrediction(matchId: string, homeScore: number, awayScore: number): Promise<any> {
  const response = await fetch('/api/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      matchId,
      homeScore,
      awayScore,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit prediction');
  }

  return response.json();
}
