import jwt from 'jsonwebtoken';

// Validação estrita de JWT_SECRET
function validateJWT_SECRET(): string {
  if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is required in production');
    }
    console.warn('WARNING: JWT_SECRET not set. Set a secure JWT_SECRET in your .env file. DO NOT use in production!');
    // Gerar secret aleatório para desenvolvimento (evita o mesmo secret em todas as máquinas dev)
    const crypto = require('crypto');
    const randomSecret = crypto.randomBytes(32).toString('hex');
    console.warn(`Generated development JWT_SECRET: ${randomSecret}`);
    return randomSecret;
  }

  const secret = process.env.JWT_SECRET;

  // Verificar tamanho mínimo (32 caracteres = 256 bits)
  if (secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET must be at least 32 characters long for security');
    }
    console.warn('WARNING: JWT_SECRET is too short (< 32 characters). This is insecure. Consider using a stronger secret.');
  }

  return secret;
}

let JWT_SECRET: string = validateJWT_SECRET();

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs');
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(password, hashedPassword);
}
