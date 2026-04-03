import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        predictions: {
          include: {
            match: true,
          },
        },
      },
    });

    const ranking = users.map(user => {
      let totalPoints = 0;
      let exactPredictions = 0;
      let correctPredictions = 0;

      user.predictions.forEach(prediction => {
        const match = prediction.match;

        if (match.homeScore !== undefined && match.awayScore !== undefined) {
          // Exact score: 3 points
          if (prediction.homeScore === match.homeScore && prediction.awayScore === match.awayScore) {
            totalPoints += 3;
            exactPredictions++;
            correctPredictions++;
          } else {
            // Correct winner: 1 point
            const predWinner = prediction.homeScore > prediction.awayScore ? 'home' :
              prediction.homeScore < prediction.awayScore ? 'away' : 'draw';
            const actualWinner = match.homeScore > match.awayScore ? 'home' :
              match.homeScore < match.awayScore ? 'away' : 'draw';

            if (predWinner === actualWinner) {
              totalPoints += 1;
              correctPredictions++;
            }
          }
        }
      });

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        totalPoints,
        exactPredictions,
        correctPredictions,
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);

    return NextResponse.json(ranking);
  } catch (error) {
    console.error('Ranking error:', error);
    return NextResponse.json({ error: 'Erro ao buscar ranking' }, { status: 500 });
  }
}
