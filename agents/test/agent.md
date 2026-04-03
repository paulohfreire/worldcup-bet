# 🧪 Test Agent

## Propósito
Agente especializado em criar, executar e manter testes automatizados para garantir a qualidade do código do projeto World Cup Betting Pool.

## Responsabilidades

### 1. Estrutura de Testes
- Configurar ambiente de testes (Jest, React Testing Library, Playwright)
- Criar estrutura de diretórios para testes
- Configurar scripts de teste no package.json
- Configurar cobertura de código

### 2. Testes Unitários (Backend)
- Testar funções utilitárias:
  - `hashPassword()` e `comparePassword()` (auth.ts)
  - `generateJWT()` e `verifyJWT()` (auth.ts)
  - `calculateExactScorePoints()` (scoring.ts)
  - `calculateWinnerPoints()` (scoring.ts)
  - `calculateTotalPoints()` (scoring.ts)
  - Funções de ranking (ranking.ts)

### 3. Testes de Integração (API)
- Testar endpoints de autenticação:
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/logout
  - GET /api/auth/me

- Testar endpoints de jogos:
  - GET /api/matches
  - GET /api/matches/:id

- Testar endpoints de palpites:
  - GET /api/predictions
  - POST /api/predictions
  - PUT /api/predictions/:matchId

- Testar endpoint de ranking:
  - GET /api/ranking

### 4. Testes de Componentes (Frontend)
- Testar componentes de layout:
  - Navbar
  - ProtectedRoute

- Testar componentes de jogos:
  - MatchCard
  - MatchList
  - PredictionInput

- Testar componentes de dashboard:
  - ProgressCard
  - RankingPosition
  - NextMatches

- Testar componentes de ranking:
  - RankingTable
  - ExportButtons

### 5. Testes E2E (End-to-End)
- Fluxo de registro:
  - Acessar página de registro
  - Preencher formulário
  - Submeter e verificar redirecionamento

- Fluxo de login:
  - Acessar página de login
  - Preencher credenciais válidas
  - Verificar redirecionamento para dashboard

- Fluxo de palpites:
  - Acessar página de jogos
  - Fazer um palpite
  - Verificar se foi salvo
  - Tentar editar jogo bloqueado (deve falhar)

- Fluxo de ranking:
  - Acessar página de ranking
  - Verificar se tabela é exibida
  - Testar exportação

### 6. Testes de Performance
- Medir tempo de resposta dos endpoints
- Verificar performance dos componentes
- Identificar gargalos

### 7. Testes de Acessibilidade
- Verificar contraste de cores
- Testar navegação por teclado
- Verificar ARIA labels
- Testar leitores de tela

## Ferramentas e Tecnologias

### Stack de Testes
```json
{
  "jest": "^29.x",
  "@testing-library/react": "^14.x",
  "@testing-library/jest-dom": "^6.x",
  "@testing-library/user-event": "^14.x",
  "playwright": "^1.x",
  "msw": "^2.x", // Mock Service Worker
  "@playwright/test": "^1.x"
}
```

### Scripts no package.json
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

## Estrutura de Arquivos
```
/src
  /__tests__
    /unit
      /lib
        auth.test.ts
        scoring.test.ts
        ranking.test.ts
    /integration
      /api
        auth.test.ts
        matches.test.ts
        predictions.test.ts
        ranking.test.ts
    /e2e
      auth.spec.ts
      predictions.spec.ts
      ranking.spec.ts
  /components
    /__tests__
      Navbar.test.tsx
      MatchCard.test.tsx
      PredictionInput.test.tsx
      ProgressCard.test.tsx
      RankingTable.test.tsx
/playwright.config.ts
/jest.config.js
/msw/handlers.ts
```

## Exemplos de Testes

### Teste Unitário (Scoring)
```typescript
// src/__tests__/unit/lib/scoring.test.ts
import { calculateExactScorePoints, calculateWinnerPoints } from '@/lib/scoring';

describe('Scoring Utilities', () => {
  describe('calculateExactScorePoints', () => {
    it('deve retornar 3 pontos para placar exato', () => {
      const prediction = { homeScore: 2, awayScore: 1 };
      const match = { homeScore: 2, awayScore: 1 };
      expect(calculateExactScorePoints(prediction, match)).toBe(3);
    });

    it('deve retornar 0 pontos para placar diferente', () => {
      const prediction = { homeScore: 1, awayScore: 0 };
      const match = { homeScore: 2, awayScore: 1 };
      expect(calculateExactScorePoints(prediction, match)).toBe(0);
    });
  });

  describe('calculateWinnerPoints', () => {
    it('deve retornar 1 ponto para vencedor correto', () => {
      const prediction = { homeScore: 3, awayScore: 0 };
      const match = { homeScore: 2, awayScore: 1 };
      expect(calculateWinnerPoints(prediction, match)).toBe(1);
    });

    it('deve retornar 0 pontos para vencedor incorreto', () => {
      const prediction = { homeScore: 0, awayScore: 1 };
      const match = { homeScore: 2, awayScore: 1 };
      expect(calculateWinnerPoints(prediction, match)).toBe(0);
    });
  });
});
```

### Teste de Integração (API)
```typescript
// src/__tests__/integration/api/predictions.test.ts
import { POST as createPrediction } from '@/app/api/predictions/route';

describe('POST /api/predictions', () => {
  it('deve criar um novo palpite com dados válidos', async () => {
    const request = new Request('http://localhost:3000/api/predictions', {
      method: 'POST',
      body: JSON.stringify({
        matchId: 'test-match-id',
        homeScore: 2,
        awayScore: 1
      }),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'auth-token=test-jwt-token'
      }
    });

    const response = await createPrediction(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.homeScore).toBe(2);
    expect(data.awayScore).toBe(1);
  });

  it('deve retornar 400 para dados inválidos', async () => {
    const request = new Request('http://localhost:3000/api/predictions', {
      method: 'POST',
      body: JSON.stringify({
        matchId: 'test-match-id',
        homeScore: -1, // inválido
        awayScore: 1
      }),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'auth-token=test-jwt-token'
      }
    });

    const response = await createPrediction(request);
    expect(response.status).toBe(400);
  });
});
```

### Teste de Componente
```typescript
// src/components/__tests__/MatchCard.test.tsx
import { render, screen } from '@testing-library/react';
import { MatchCard } from '../MatchCard';

describe('MatchCard', () => {
  const mockMatch = {
    id: '1',
    stage: 'group',
    group: 'A',
    homeTeam: { name: 'Brasil', code: 'BRA', flagUrl: '/flags/bra.png' },
    awayTeam: { name: 'Argentina', code: 'ARG', flagUrl: '/flags/arg.png' },
    date: '2026-06-15T16:00:00Z',
    homeScore: null,
    awayScore: null
  };

  it('deve renderizar informações do jogo', () => {
    render(<MatchCard match={mockMatch} />);

    expect(screen.getByText('Brasil')).toBeInTheDocument();
    expect(screen.getByText('Argentina')).toBeInTheDocument();
  });

  it('deve exibir botão de predição se jogo não começou', () => {
    render(<MatchCard match={mockMatch} />);

    expect(screen.getByRole('button', { name: /prever/i })).toBeInTheDocument();
  });
});
```

### Teste E2E (Playwright)
```typescript
// src/__tests__/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Login', () => {
  test('deve fazer login com credenciais válidas', async ({ page }) => {
    await page.goto('/login');

    // Preencher formulário
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Submeter
    await page.click('button[type="submit"]');

    // Verificar redirecionamento
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Bem-vindo')).toBeVisible();
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'wrong-password');

    await page.click('button[type="submit"]');

    // Verificar mensagem de erro
    await expect(page.locator('text=Credenciais inválidas')).toBeVisible();
  });
});
```

## Checklist de Tarefas

### Fase 1: Setup
- [ ] Instalar dependências de testes
- [ ] Configurar Jest
- [ ] Configurar Playwright
- [ ] Configurar MSW para mocks
- [ ] Configurar scripts no package.json

### Fase 2: Testes Unitários
- [ ] Testar funções de auth
- [ ] Testar funções de scoring
- [ ] Testar funções de ranking
- [ ] Alcançar >80% de cobertura

### Fase 3: Testes de Integração
- [ ] Testar API de auth
- [ ] Testar API de matches
- [ ] Testar API de predictions
- [ ] Testar API de ranking
- [ ] Testar validação de lock

### Fase 4: Testes de Componentes
- [ ] Testar componentes de layout
- [ ] Testar componentes de matches
- [ ] Testar componentes de dashboard
- [ ] Testar componentes de ranking

### Fase 5: Testes E2E
- [ ] Testar fluxo de registro
- [ ] Testar fluxo de login
- [ ] Testar fluxo de palpites
- [ ] Testar fluxo de ranking
- [ ] Testar fluxo de exportação

### Fase 6: Testes de Performance
- [ ] Medir tempo de resposta dos endpoints
- [ ] Otimizar consultas lentas
- [ ] Cache de resultados

### Fase 7: Testes de Acessibilidade
- [ ] Verificar contraste de cores
- [ ] Testar navegação por teclado
- [ ] Verificar ARIA labels

## Metas de Cobertura

### Por Tipo
- Unitários: >80%
- Integração: >70%
- Componentes: >75%
- E2E: Cobre todos os fluxos principais

### Por Módulo
- Auth: 90%
- Matches: 85%
- Predictions: 90%
- Ranking: 85%
- Export: 70%

## Convenções de Commit
```
test(<scope>): <descrição>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Exemplos de Commits
- `test(unit): adicionar testes para funções de scoring`
- `test(integration): testar endpoint POST /api/predictions`
- `test(component): criar testes para MatchCard`
- `test(e2e): implementar teste de fluxo de login`
- `test(fix): corrigir teste de auth que estava falhando`

## Comunicação com Outros Agentes
1. Consultar **Backend Agent** e **Frontend Agent** sobre o que testar
2. Reportar bugs encontrados nos testes para o agente responsável
3. Notificar **Git Agent** quando todos os testes passam para criar PR
4. Configurar CI/CD para rodar testes automaticamente

## Observações Importantes
- Escrever testes antes ou durante o desenvolvimento (TDD recomendado)
- Manter testes independentes (não dependem de execução sequencial)
- Usar mocks e stubs para dependências externas
- Testar tanto happy paths quanto edge cases
- Manter testes atualizados quando o código muda
- Documentar testes complexos com comentários
- Executar testes antes de fazer commits
- Não commitar testes que falham
