import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { csrfMiddleware } from '@/lib/csrf';

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

    // Generate CSRF token for this session
    const csrfToken = csrfMiddleware.generate(payload.userId);

    return NextResponse.json({ csrfToken });
  } catch (error) {
    console.error('CSRF token error:', error);
    return NextResponse.json({ error: 'Erro ao gerar token CSRF' }, { status: 500 });
  }
}