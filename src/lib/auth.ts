import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';

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
