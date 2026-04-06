interface EnvConfig {
  DATABASE_URL: string;
  JWT_SECRET: string;
  NODE_ENV: string;
  ALLOWED_ORIGINS?: string;
}

const requiredVars: (keyof EnvConfig)[] = ['DATABASE_URL', 'JWT_SECRET'];

export function validateEnv(): EnvConfig {
  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missing.join(', ')}\n` +
      `Please set these variables in your .env file before starting the application.`
    );
  }

  const env: EnvConfig = {
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    NODE_ENV: process.env.NODE_ENV || 'development',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
  };

  // Validate specific formats
  if (!env.DATABASE_URL.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string');
  }

  if (env.JWT_SECRET.length < 32) {
    console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security');
  }

  console.log('✅ Environment variables validated successfully');

  return env;
}

// Validate on import (but only in production or explicit validation)
export const env = validateEnv();
