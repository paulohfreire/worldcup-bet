import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const healthChecks = {
    database: false,
    jwtSecret: false,
    environment: process.env.NODE_ENV || 'unknown'
  };

  try {
    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.warn('Health check: JWT_SECRET not set');
    } else if (process.env.JWT_SECRET.length < 32) {
      console.warn('Health check: JWT_SECRET too short');
    } else {
      healthChecks.jwtSecret = true;
    }

    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    healthChecks.database = true;

    const isHealthy = healthChecks.database && healthChecks.jwtSecret;

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks: healthChecks,
      details: {
        database: healthChecks.database ? 'connected' : 'disconnected',
        jwtSecret: healthChecks.jwtSecret ? 'configured' : 'missing or weak',
        environment: healthChecks.environment
      }
    }, { status: isHealthy ? 200 : 503 });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: healthChecks,
      details: {
        database: 'disconnected',
        jwtSecret: healthChecks.jwtSecret ? 'configured' : 'missing or weak',
        environment: healthChecks.environment,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 503 });
  }
}
