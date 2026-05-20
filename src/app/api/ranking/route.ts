import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verificar se há autenticação para mostrar predições do usuário atual
    let currentUserId: string | null = null;
    const token = request.cookies.get('token')?.value;

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        currentUserId = payload.userId;
      }
    }

    const users = await prisma.user.findMany({
      include: {
        predictions: {
          include: {
            match: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const ranking = users.map(user => {
      let totalPoints = 0;
      let exactPredictions = 0;
      let correctPredictions = 0;
      const totalPredictions = user.predictions.length;

      user.predictions.forEach(prediction => {
        const match = prediction.match;

        if (match.homeScore !== null && match.awayScore !== null) {
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

      // Anonimizar dados sensíveis para ranking público
      // Se o usuário atual for o dono dos dados, mostrar email completo
      const isCurrentUser = user.id === currentUserId;

      return {
        id: user.id,
        name: user.name,
        email: isCurrentUser ? user.email : null, // Só mostra email para o próprio usuário
        totalPoints,
        exactPredictions,
        correctPredictions,
        totalPredictions,
        accuracy: totalPredictions > 0 ? Math.round((correctPredictions / totalPredictions) * 100) : 0,
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);

    return NextResponse.json({
      ranking,
      isCurrentUserAuthenticated: !!currentUserId,
      currentUserRank: currentUserId ? ranking.findIndex(u => u.id === currentUserId) : -1,
    });
  } catch (error) {
    console.error('Ranking error:', error);
    return NextResponse.json({ error: 'Erro ao buscar ranking' }, { status: 500 });
  }
}
