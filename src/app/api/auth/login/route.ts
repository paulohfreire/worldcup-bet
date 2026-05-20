import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { authRateLimiter } from '@/lib/rateLimit';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutos

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Rate limiting by email
    const rateLimitKey = `login:${body.email}`;
    if (!authRateLimiter.isAllowed(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
        { status: 429 }
      );
    }

    // Validate input
    const { error, value } = loginSchema.validate(body);
    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: value.email },
    });

    if (!user) {
      // Não revelar se email existe
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const remainingTime = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 1000 / 60);
      return NextResponse.json(
        { error: `Conta temporariamente bloqueada. Tente novamente em ${remainingTime} minutos.` },
        { status: 423 }
      );
    }

    // Compare password
    const isPasswordValid = await comparePassword(value.password, user.password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: user.failedLoginAttempts + 1,
          lastFailedLogin: new Date(),
        },
      });

      // Lock account after MAX_LOGIN_ATTEMPTS
      if (user.failedLoginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
        await prisma.user.update({
          where: { id: user.id },
          data: { lockedUntil },
        });

        return NextResponse.json(
          { error: 'Muitas tentativas incorretas. Conta bloqueada por 15 minutos.' },
          { status: 423 }
        );
      }

      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // Successful login - reset failed attempts
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastFailedLogin: null,
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
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 });
  }
}
