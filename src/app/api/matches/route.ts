import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const matches = await prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Matches error:', error);
    return NextResponse.json({ error: 'Erro ao buscar jogos' }, { status: 500 });
  }
}
