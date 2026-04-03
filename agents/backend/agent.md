# 🔧 Backend Agent

## Propósito
Agente especializado em desenvolvimento de API, lógica de negócio, autenticação e operações de banco de dados.

## Responsabilidades

### 1. Database Schema (Prisma)
- Definir modelo `User`
- Definir modelo `Team`
- Definir modelo `Match` com estrutura de knockout
- Definir modelo `Prediction` com unique constraint
- Executar `npx prisma db push`
- Gerar Prisma client

### 2. Seed Script
- Criar script de seed para 32 seleções da Copa do Mundo
- Criar script para 48 jogos da fase de grupos
- Criar script para 16 jogos das fases eliminatórias
- Implementar linking da estrutura de knockout (nextMatchId, nextMatchSlot)
- Testar execução do seed script

### 3. Autenticação
- Criar `/src/lib/auth.ts`:
  - `hashPassword()` usando bcryptjs
  - `comparePassword()` para verificação
  - `generateJWT()` para criar tokens
  - `verifyJWT()` para validar tokens
- Criar `/src/lib/cookies.ts`:
  - `setAuthCookie()` para definir cookie HTTP-only
  - `getAuthCookie()` para ler cookie
  - `clearAuthCookie()` para limpar cookie
- Criar `/src/middleware.ts` para proteção de rotas

### 4. API Routes - Autenticação
- `POST /api/auth/register`
  - Validar input (name, email, password)
  - Hashar senha
  - Criar usuário no banco
  - Gerar e retornar JWT
  - Definir cookie HTTP-only

- `POST /api/auth/login`
  - Validar input (email, password)
  - Buscar usuário por email
  - Comparar senha
  - Gerar e retornar JWT
  - Definir cookie HTTP-only

- `POST /api/auth/logout`
  - Limpar cookie

- `GET /api/auth/me`
  - Verificar token do cookie
  - Retornar dados do usuário atual

### 5. API Routes - Matches
- `GET /api/matches`
  - Retornar todos os jogos
  - Opcionalmente filtrar por stage
  - Incluir dados dos times (homeTeam, awayTeam)

- `GET /api/matches/:id`
  - Retornar jogo específico com todos os detalhes

### 6. API Routes - Predictions
- `GET /api/predictions`
  - Retornar todos os palpites do usuário atual
  - Incluir dados dos jogos

- `POST /api/predictions`
  - Validar input (matchId, homeScore, awayScore)
  - Verificar se usuário já tem palpite para este jogo
  - Criar novo palpite
  - Retornar palpite criado

- `PUT /api/predictions/:matchId`
  - **CRUCIAL**: Verificar se jogo já começou (match.date > now)
  - Se já começou, retornar 403 Forbidden
  - Atualizar palpite existente
  - Retornar palpite atualizado

### 7. Sistema de Pontuação
- Criar `/src/lib/scoring.ts`:
  - `calculateExactScorePoints(prediction, match)` → 3 pontos
  - `calculateWinnerPoints(prediction, match)` → 1 ponto
  - `calculateTotalPoints(predictions, matches)` → soma total

### 8. API Route - Ranking
- `GET /api/ranking`
  - Buscar todos os usuários
  - Para cada usuário, calcular pontuação total
  - Contar palpites exatos e vencedores corretos
  - Ordenar por pontos (descendente)
  - Retornar ranking completo

### 9. API Routes - Export
- `GET /api/export/ranking`
  - Retornar dados formatados para exportação de ranking

- `GET /api/export/predictions`
  - Retornar dados formatados para exportação de palpites

## Ferramentas e Comandos

### Prisma
```bash
npx prisma db push
npx prisma generate
npx prisma studio
npx prisma db seed
```

### Tipos de Resposta API
- `200 OK` - Sucesso
- `201 Created` - Recurso criado
- `400 Bad Request` - Input inválido
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Autenticado mas sem permissão (jogo bloqueado)
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro do servidor

## Estrutura de Arquivos
```
/src
  /lib
    auth.ts
    cookies.ts
    scoring.ts
    ranking.ts
    export.ts
  /middleware.ts
  /api
    /auth
      /register/route.ts
      /login/route.ts
      /logout/route.ts
      /me/route.ts
    /matches
      /route.ts
      /[id]/route.ts
    /predictions
      /route.ts
      /[matchId]/route.ts
    /ranking
      /route.ts
    /export
      /ranking/route.ts
      /predictions/route.ts
/prisma
  schema.prisma
  /seed.ts
```

## Regras de Negócio Importantes

### 1. Lock de Predições
```typescript
// Verificar se jogo já começou antes de permitir edição
if (new Date(match.date) <= new Date()) {
  return NextResponse.json(
    { error: "Match has already started, predictions are locked" },
    { status: 403 }
  );
}
```

### 2. Pontuação
```typescript
// Placar exato = 3 pontos
if (prediction.homeScore === match.homeScore && prediction.awayScore === match.awayScore) {
  return 3;
}

// Vencedor correto = 1 ponto
const predWinner = getWinner(prediction.homeScore, prediction.awayScore);
const matchWinner = getWinner(match.homeScore, match.awayScore);
if (predWinner === matchWinner) {
  return 1;
}

// Incorreto = 0 pontos
return 0;
```

### 3. Unique Constraint de Predição
Cada usuário só pode ter um palpite por jogo. Isso é garantido pelo Prisma:
```prisma
model Prediction {
  @@unique([userId, matchId])
}
```

## Checklist de Tarefas

### Fase 1: Schema
- [ ] Definir modelo User
- [ ] Definir modelo Team
- [ ] Definir modelo Match
- [ ] Definir modelo Prediction
- [ ] Executar `npx prisma db push`

### Fase 2: Seed
- [ ] Criar seed.ts com 32 times
- [ ] Criar seed com 48 jogos de grupos
- [ ] Criar seed com 16 jogos de knockout
- [ ] Implementar nextMatchId e nextMatchSlot
- [ ] Testar execução do seed

### Fase 3: Auth Utils
- [ ] Criar auth.ts com funções de hash/verify/JWT
- [ ] Criar cookies.ts
- [ ] Criar middleware.ts

### Fase 4: Auth API
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] POST /api/auth/logout
- [ ] GET /api/auth/me

### Fase 5: Matches API
- [ ] GET /api/matches
- [ ] GET /api/matches/:id

### Fase 6: Predictions API
- [ ] GET /api/predictions
- [ ] POST /api/predictions
- [ ] PUT /api/predictions/:matchId (com validação de lock)

### Fase 7: Scoring
- [ ] Criar scoring.ts
- [ ] Implementar calculateExactScorePoints
- [ ] Implementar calculateWinnerPoints
- [ ] Implementar calculateTotalPoints

### Fase 8: Ranking API
- [ ] Criar ranking.ts
- [ ] Implementar calculateUserRankings
- [ ] GET /api/ranking

### Fase 9: Export API
- [ ] GET /api/export/ranking
- [ ] GET /api/export/predictions

## Convenções de Commit
```
backend(<scope>): <descrição>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Exemplos de Commits
- `backend(schema): definir modelos User, Team, Match, Prediction`
- `backend(seed): criar script de seed para times e jogos`
- `backend(auth): implementar funções de hash e JWT`
- `backend(api): criar endpoint POST /api/auth/register`
- `backend(predictions): implementar lock de predições após início do jogo`

## Comunicação com Outros Agentes
1. Após criar schema, notificar **Frontend Agent** sobre os tipos de dados
2. Após criar API routes, notificar **Frontend Agent** para criar UI
3. Após implementar lógica de negócio, notificar **Test Agent** para criar testes
4. Após completar um módulo, notificar **Git Agent** para criar branch e PR

## Observações Importantes
- Sempre validar inputs usando zod
- Nunca retornar senha ou dados sensíveis
- Usar HTTP-only cookies para JWT (não localStorage)
- Tratar erros adequadamente com mensagens claras
- Documentar cada API route no código
- Testar manualmente cada endpoint antes de considerar completo
