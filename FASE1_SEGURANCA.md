# Fase 1: Segurança Crítica - Plano de Implementação

## Contexto

Esta fase implementa melhorias de segurança críticas para tornar a aplicação apta para produção. As alterações nesta fase são essenciais antes de qualquer deployment.

## Objetivos

1. ✅ Remover JWT secret fallback inseguro
2. ✅ Implementar rate limiting para prevenir ataques de força bruta
3. ✅ Configurar CORS para controle de acesso
4. ✅ Validar environment variables na startup da aplicação

---

## Tarefa 1.1: Remover JWT Secret Fallback Inseguro

### Arquivo: `src/lib/auth.ts`

**Problema atual:**
```typescript
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
```

**Solução:**
```typescript
let JWT_SECRET: string;

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is required in production');
  }
  console.warn('WARNING: JWT_SECRET not set, using development fallback. DO NOT use in production!');
  JWT_SECRET = 'dev-fallback-secret-key-change-me';
} else {
  JWT_SECRET = process.env.JWT_SECRET;
}
```

**Benefícios:**
- Impede deployment acidental sem JWT_SECRET configurado
- Mantém fallback apenas para desenvolvimento
- Mensagens de erro claras

---

## Tarefa 1.2: Implementar Rate Limiting

### Novo Arquivo: `src/lib/rateLimit.ts`

**Implementação:**
```typescript
// Simple in-memory rate limiter using LRU cache
type RateLimitStore = Map<string, { count: number; resetTime: number }>;

export class RateLimiter {
  private store: RateLimitStore = new Map();
  private cleanupInterval: NodeJS.Timeout;
  private windowMs: number;
  private maxRequests: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (now > value.resetTime) {
        this.store.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Create singleton instances
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 requests per 15 minutes
export const apiRateLimiter = new RateLimiter(100, 60 * 1000); // 100 requests per minute
export const exportRateLimiter = new RateLimiter(5, 60 * 1000); // 5 exports per minute
```

### Arquivo: `src/app/api/auth/login/route.ts`

**Adicionar rate limiting:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, generateToken, comparePassword } from '@/lib/auth';
import { authRateLimiter } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Rate limiting by email
    const rateLimitKey = `login:${email}`;
    if (!authRateLimiter.isAllowed(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
        { status: 429 }
      );
    }

    // ... rest of the code
  } catch (error) {
    // ... error handling
  }
}
```

### Arquivo: `src/app/api/auth/register/route.ts`

**Aplicar mesma lógica de rate limiting**

---

## Tarefa 1.3: Configurar CORS

### Arquivo: `next.config.js`

**Configuração:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  async headers() {
    const headers = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin'
      },
    ];

    // Add CORS headers for API routes
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

    return [
      {
        source: '/api/:path*',
        headers: [
          ...headers,
          {
            key: 'Access-Control-Allow-Origin',
            value: allowedOrigins.join(', ')
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400'
          }
        ]
      },
      {
        source: '/(.*)',
        headers
      }
    ];
  }
};

module.exports = nextConfig;
```

---

## Tarefa 1.4: Validar Environment Variables

### Novo Arquivo: `src/lib/env.ts`

**Implementação:**
```typescript
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
```

### Arquivo: `src/middleware.ts`

**Adicionar validação no início:**
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { validateEnv } from '@/lib/env';

// Validate env on middleware load
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error);
  // In production, this will prevent the app from starting
  if (process.env.NODE_ENV === 'production') {
    throw error;
  }
}

// ... rest of middleware code
```

### Atualizar API Routes

Adicionar validação nos principais endpoints:
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/predictions/route.ts`

---

## Ordem de Implementação

1. ✅ Criar `src/lib/env.ts` - Base para validação
2. ✅ Atualizar `src/lib/auth.ts` - Remover fallback JWT
3. ✅ Criar `src/lib/rateLimit.ts` - Implementar rate limiter
4. ✅ Atualizar `src/app/api/auth/login/route.ts` - Adicionar rate limiting
5. ✅ Atualizar `src/app/api/auth/register/route.ts` - Adicionar rate limiting
6. ✅ Atualizar `next.config.js` - Configurar CORS e security headers
7. ✅ Atualizar `src/middleware.ts` - Adicionar validação de env
8. ✅ Atualizar `.env.example` - Adicionar novas variáveis

---

## Testes de Verificação

### 1. Testar JWT Secret Validation
```bash
# Sem JWT_SECRET em produção
NODE_ENV=production npm run dev
# Deve falhar com erro claro
```

### 2. Testar Rate Limiting
```bash
# Tentar fazer mais de 5 logins em 15 minutos com mesmo email
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}' \
  # Repetir 6 vezes - a 6ª deve retornar 429
```

### 3. Testar CORS Headers
```bash
# Verificar headers de resposta
curl -I http://localhost:3000/api/matches
# Deve conter Access-Control-Allow-Origin, X-Frame-Options, etc.
```

### 4. Testar Environment Validation
```bash
# Remover DATABASE_URL do .env
# Tentar rodar app - deve falhar com erro claro
```

---

## Checklist de Conclusão

- [ ] JWT_SECRET obrigatório em produção (sem fallback inseguro)
- [ ] Rate limiting ativo em endpoints de auth (5 tentativas/15min)
- [ ] Rate limiting configurado para API geral (100 req/min)
- [ ] CORS configurado com ALLOWED_ORIGINS
- [ ] Security headers configurados (X-Frame-Options, X-Content-Type-Options)
- [ ] Environment variables validadas na startup
- [ ] Mensagens de erro claras e em português
- [ ] .env.example atualizado com novas variáveis
- [ ] Documentação atualizada

---

## Arquivos Envolvidos

### Novos Arquivos:
- `src/lib/env.ts`
- `src/lib/rateLimit.ts`

### Arquivos a Modificar:
- `src/lib/auth.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/middleware.ts`
- `next.config.js`
- `.env.example`
