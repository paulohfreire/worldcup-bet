import { randomBytes, createHash } from 'crypto';

// CSRF Token management
const CSRF_SECRET = process.env.CSRF_SECRET || randomBytes(32).toString('hex');

export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

export function validateCSRFToken(token: string): boolean {
  if (!token || token.length !== 64) {
    return false;
  }

  // Verificar se é um hex string válido
  return /^[0-9a-f]{64}$/i.test(token);
}

export function generateCSRFMiddleware() {
  const tokens = new Map<string, { token: string; expiresAt: number }>();

  return {
    generate: (sessionId: string): string => {
      const token = generateCSRFToken();
      tokens.set(sessionId, {
        token,
        expiresAt: Date.now() + 60 * 60 * 1000, // 1 hora
      });
      return token;
    },

    validate: (sessionId: string, token: string): boolean => {
      const stored = tokens.get(sessionId);
      if (!stored) {
        return false;
      }

      if (Date.now() > stored.expiresAt) {
        tokens.delete(sessionId);
        return false;
      }

      return stored.token === token;
    },

    invalidate: (sessionId: string): void => {
      tokens.delete(sessionId);
    },

    // Limpar tokens expirados periodicamente
    cleanup: (): void => {
      const now = Date.now();
      for (const [sessionId, data] of tokens.entries()) {
        if (now > data.expiresAt) {
          tokens.delete(sessionId);
        }
      }
    },
  };
}

// Cleanup interval (limpa tokens expirados a cada 10 minutos)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const csrfMiddleware = generateCSRFMiddleware();
    csrfMiddleware.cleanup();
  }, 10 * 60 * 1000);
}

export const csrfMiddleware = generateCSRFMiddleware();