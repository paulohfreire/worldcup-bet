import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';
import { authRateLimiter } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Rate limiting by IP address
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `register:${clientIp}`;
    if (!authRateLimiter.isAllowed(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Muitas tentativas de registro. Tente novamente em 15 minutos.' },
        { status: 429 }
      );
    }

    // Validate input
    const { error, value } = registerSchema.validate(body);
    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: value.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(value.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: value.name,
        email: value.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookie
    const response = NextResponse.json({
      user,
      token,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 });
  }
}
