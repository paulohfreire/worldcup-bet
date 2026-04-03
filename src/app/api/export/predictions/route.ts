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

    const predictions = await prisma.prediction.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
      orderBy: {
        match: {
          date: 'asc',
        },
      },
    });

    // Generate CSV
    const headers = ['Data', 'Fase', 'Time Casa', 'Time Fora', 'Usuário', 'Palpite Casa', 'Palpite Fora'];
    const rows = predictions.map(pred =>
      `"${new Date(pred.match.date).toLocaleDateString('pt-BR')}","${pred.match.stage}","${pred.match.homeTeam.name}","${pred.match.awayTeam.name}","${pred.user.name}",${pred.homeScore},${pred.awayScore}`
    );

    const csv = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="apostas-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export predictions error:', error);
    return NextResponse.json({ error: 'Erro ao exportar apostas' }, { status: 500 });
  }
}
