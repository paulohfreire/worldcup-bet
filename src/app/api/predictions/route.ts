import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { predictionSchema } from '@/lib/validation';

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
      where: {
        userId: payload.userId,
      },
      include: {
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

    return NextResponse.json(predictions);
  } catch (error) {
    console.error('Predictions GET error:', error);
    return NextResponse.json({ error: 'Erro ao buscar apostas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const { error, value } = predictionSchema.validate(body);
    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 });
    }

    // Check if match exists and hasn't started
    const match = await prisma.match.findUnique({
      where: { id: value.matchId },
    });

    if (!match) {
      return NextResponse.json({ error: 'Jogo não encontrado' }, { status: 404 });
    }

    if (new Date(match.date) <= new Date()) {
      return NextResponse.json({ error: 'Jogo já começou, aposta não permitida' }, { status: 400 });
    }

    // Upsert prediction
    const prediction = await prisma.prediction.upsert({
      where: {
        userId_matchId: {
          userId: payload.userId,
          matchId: value.matchId,
        },
      },
      update: {
        homeScore: value.homeScore,
        awayScore: value.awayScore,
      },
      create: {
        userId: payload.userId,
        matchId: value.matchId,
        homeScore: value.homeScore,
        awayScore: value.awayScore,
      },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
    });

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Predictions POST error:', error);
    return NextResponse.json({ error: 'Erro ao salvar aposta' }, { status: 500 });
  }
}
