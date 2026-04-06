import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

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

        if (match.homeScore !== null && match.awayScore !== null) {
          if (prediction.homeScore === match.homeScore && prediction.awayScore === match.awayScore) {
            totalPoints += 3;
            exactPredictions++;
            correctPredictions++;
          } else {
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
        posicao: 0, // Will be set after sorting
        nome: user.name,
        email: user.email,
        pontos: totalPoints,
        placares_exatos: exactPredictions,
        vencedores_corretos: correctPredictions,
      };
    }).sort((a, b) => b.pontos - a.pontos)
      .map((entry, index) => ({
        ...entry,
        posicao: index + 1,
      }));

    // Generate CSV
    const headers = ['Posição', 'Nome', 'Email', 'Pontos', 'Placares Exatos', 'Vencedores Corretos'];
    const rows = ranking.map(entry =>
      `${entry.posicao},"${entry.nome}","${entry.email}",${entry.pontos},${entry.placares_exatos},${entry.vencedores_corretos}`
    );

    const csv = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="ranking-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export ranking error:', error);
    return NextResponse.json({ error: 'Erro ao exportar ranking' }, { status: 500 });
  }
}
