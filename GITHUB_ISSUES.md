# Issues do World Cup Betting Pool

## Como usar este arquivo

Este arquivo contém todas as issues que precisam ser criadas no GitHub.

### Opção 1: Usar GitHub CLI (recomendado)

1. Instale o GitHub CLI: https://cli.github.com/
2. Autentique: `gh auth login`
3. Execute: `npm run board:create`

### Opção 2: Criação manual

Para cada issue abaixo:
1. Copie o título e o corpo
2. Acesse: https://github.com/paulohfreire/worldcup-bet/issues/new
3. Cole o título e o corpo
4. Adicione as labels indicadas
5. Crie a issue

---

## 1. Setup inicial do projeto

**Labels:** `infra`, `P0`, `setup`

## Descrição
Inicializar projeto Next.js com TypeScript e configurar estrutura básica.

## Checklist
- [ ] Criar projeto Next.js
- [ ] Configurar TypeScript strict mode
- [ ] Configurar Tailwind CSS
- [ ] Configurar ESLint
- [ ] Criar estrutura de diretórios (src/app, src/components, src/lib, src/types)

## Dependências
- Nenhuma

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

---

## 2. Instalar dependências principais

**Labels:** `infra`, `P0`, `setup`

## Descrição
Instalar todas as dependências necessárias para o projeto.

## Checklist
- [ ] Instalar @prisma/client
- [ ] Instalar bcryptjs e jsonwebtoken
- [ ] Instalar jsPDF para exportação
- [ ] Instalar zod para validação
- [ ] Instalar types TypeScript (bcryptjs, jsonwebtoken)
- [ ] Instalar dependências de dev (prisma, tipos)

## Dependências
- #1 (Setup inicial do projeto)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #1

---

## 3. Configurar Prisma

**Labels:** `infra`, `P0`, `setup`

## Descrição
Inicializar e configurar o Prisma com PostgreSQL.

## Checklist
- [ ] Executar npx prisma init
- [ ] Configurar DATABASE_URL no .env
- [ ] Criar .env.example
- [ ] Executar npx prisma generate
- [ ] Adicionar script de seed ao package.json

## Dependências
- #2 (Instalar dependências principais)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #2

---

## 4. Criar schema do Prisma

**Labels:** `backend`, `P0`, `schema`

## Descrição
Definir modelos User, Team, Match e Prediction no schema.prisma.

## Checklist
- [ ] Definir modelo User (id, name, email, password, role, createdAt)
- [ ] Definir modelo Team (id, name, code, flagUrl, group)
- [ ] Definir modelo Match (id, stage, group, order, homeTeamId, awayTeamId, date, homeScore, awayScore, nextMatchId, nextMatchSlot)
- [ ] Definir modelo Prediction (id, userId, matchId, homeScore, awayScore)
- [ ] Adicionar unique constraint em [userId, matchId]
- [ ] Executar npx prisma db push

## Critérios de Aceitação
- Schema criado com todos os modelos
- Relações entre modelos definidas corretamente
- Banco de dados criado com sucesso

## Dependências
- #3 (Configurar Prisma)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #3

---

## 5. Criar seed script

**Labels:** `backend`, `P1`, `schema`

## Descrição
Criar script de seed para popular o banco com times e jogos da Copa do Mundo.

## Checklist
- [ ] Criar seed.ts com 32 seleções
- [ ] Criar seed para 48 jogos de fase de grupos
- [ ] Criar seed para 16 jogos das fases eliminatórias
- [ ] Implementar nextMatchId e nextMatchSlot para knockout
- [ ] Testar execução do seed script
- [ ] Verificar dados no banco

## Critérios de Aceitação
- 32 times criados no banco
- 64 jogos criados no banco (48 grupos + 16 knockout)
- Estrutura de knockout conectada corretamente

## Dependências
- #4 (Criar schema do Prisma)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #4

---

## 6. Implementar auth utilities

**Labels:** `backend`, `P0`, `auth`

## Descrição
Criar funções utilitárias para autenticação e gerenciamento de cookies.

## Checklist
- [ ] Criar /src/lib/auth.ts com hashPassword(), comparePassword()
- [ ] Criar generateJWT() e verifyJWT()
- [ ] Criar /src/lib/cookies.ts com setAuthCookie(), getAuthCookie(), clearAuthCookie()
- [ ] Criar /src/middleware.ts para proteção de rotas
- [ ] Testar funções de hash/verify
- [ ] Testar geração e verificação de JWT

## Critérios de Aceitação
- Senhas são hashadas corretamente
- JWT é gerado e verificado corretamente
- Middleware protege rotas autenticadas

## Dependências
- #4 (Criar schema do Prisma)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #4

---

## 7. Implementar POST /api/auth/register

**Labels:** `backend`, `P0`, `auth`

## Descrição
Criar endpoint de registro de usuários.

## Checklist
- [ ] Criar /src/app/api/auth/register/route.ts
- [ ] Validar input com zod (name, email, password)
- [ ] Verificar se email já existe
- [ ] Hashar senha com bcryptjs
- [ ] Criar usuário no banco via Prisma
- [ ] Gerar JWT com expiração de 7 dias
- [ ] Definir cookie HTTP-only
- [ ] Retornar usuário (sem senha)

## Critérios de Aceitação
- Usuário pode se registrar com dados válidos
- Email duplicado retorna erro apropriado
- Senha é hashada antes de salvar
- Cookie HTTP-only é definido
- JWT contém dados corretos do usuário

## Dependências
- #6 (Implementar auth utilities)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #6

---

## 8. Implementar POST /api/auth/login

**Labels:** `backend`, `P0`, `auth`

## Descrição
Criar endpoint de login de usuários.

## Checklist
- [ ] Criar /src/app/api/auth/login/route.ts
- [ ] Validar input com zod (email, password)
- [ ] Buscar usuário por email
- [ ] Comparar senha usando bcryptjs
- [ ] Gerar JWT se credenciais válidas
- [ ] Definir cookie HTTP-only
- [ ] Retornar erro se credenciais inválidas

## Critérios de Aceitação
- Usuário pode fazer login com credenciais válidas
- Credenciais inválidas retornam erro 401
- Cookie HTTP-only é definido
- JWT é válido

## Dependências
- #6 (Implementar auth utilities)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #6

---

## 9. Implementar GET /api/matches

**Labels:** `backend`, `P0`, `api`

## Descrição
Criar endpoint para listar todos os jogos.

## Checklist
- [ ] Criar /src/app/api/matches/route.ts
- [ ] Buscar todos os jogos do banco
- [ ] Incluir dados dos times (homeTeam, awayTeam)
- [ ] Opcionalmente filtrar por stage query param
- [ ] Ordenar por data
- [ ] Verificar autenticação
- [ ] Retornar array de jogos

## Critérios de Aceitação
- Todos os jogos são retornados
- Dados dos times incluídos
- Filtragem por stage funciona
- Ordenação por date correta

## Dependências
- #5 (Criar seed script)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #5

---

## 10. Implementar POST /api/predictions

**Labels:** `backend`, `P0`, `api`

## Descrição
Criar endpoint para criar novo palpite.

## Checklist
- [ ] Criar /src/app/api/predictions/route.ts
- [ ] Validar input com zod (matchId, homeScore, awayScore)
- [ ] Verificar autenticação
- [ ] Verificar se usuário já tem palpite para este jogo
- [ ] Verificar se jogo já começou (lock validation)
- [ ] Criar palpite no banco
- [ ] Retornar palpite criado

## Critérios de Aceitação
- Usuário pode criar palpite para jogo futuro
- Palpite duplicado retorna erro
- Jogos já começados retornam erro 403
- Validação de input funciona

## Dependências
- #8 (Implementar GET /api/matches)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #8

---

## 11. Implementar PUT /api/predictions/:matchId

**Labels:** `backend`, `P0`, `api`

## Descrição
Criar endpoint para atualizar palpite existente.

## Checklist
- [ ] Criar /src/app/api/predictions/[matchId]/route.ts
- [ ] Validar input com zod (homeScore, awayScore)
- [ ] Verificar autenticação
- [ ] Buscar palpite existente do usuário
- [ ] **CRUCIAL**: Verificar se jogo já começou (match.date > now)
- [ ] Se já começou, retornar 403 Forbidden
- [ ] Atualizar palpite no banco
- [ ] Retornar palpite atualizado

## Critérios de Aceitação
- Usuário pode atualizar palpite de jogo futuro
- Jogos já começados são bloqueados (403)
- Validação de input funciona
- Apenas próprio usuário pode atualizar seu palpite

## Dependências
- #9 (Implementar POST /api/predictions)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #9

---

## 12. Implementar sistema de pontuação

**Labels:** `backend`, `P0`, `api`

## Descrição
Criar funções para calcular pontos dos palpites.

## Checklist
- [ ] Criar /src/lib/scoring.ts
- [ ] Implementar calculateExactScorePoints() → 3 pontos
- [ ] Implementar calculateWinnerPoints() → 1 ponto
- [ ] Implementar calculateTotalPoints() → soma total
- [ ] Criar testes unitários para cada função
- [ ] Testar com exemplos reais

## Critérios de Aceitação
- Placar exato retorna 3 pontos
- Vencedor correto retorna 1 ponto
- Incorreto retorna 0 pontos
- Testes passam com 100% de cobertura

## Dependências
- #4 (Criar schema do Prisma)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #4

---

## 13. Implementar GET /api/ranking

**Labels:** `backend`, `P0`, `api`

## Descrição
Criar endpoint para retornar ranking dos usuários.

## Checklist
- [ ] Criar /src/lib/ranking.ts
- [ ] Implementar calculateUserRankings()
- [ ] Buscar todos os usuários e palpites
- [ ] Calcular pontuação total para cada usuário
- [ ] Contar palpites exatos e vencedores corretos
- [ ] Ordenar por pontos (descendente)
- [ ] Criar /src/app/api/ranking/route.ts
- [ ] Retornar ranking completo

## Critérios de Aceitação
- Ranking é calculado corretamente
- Ordenação por pontos é correta
- Contagens de exatos/vencedores estão corretas
- Performance adequada

## Dependências
- #11 (Implementar sistema de pontuação)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #11

---

## 14. Criar Navbar responsivo

**Labels:** `frontend`, `P0`, `ui`

## Descrição
Criar componente de navegação com menu hamburger para mobile.

## Checklist
- [ ] Criar /src/components/layout/Navbar.tsx
- [ ] Adicionar logo do projeto
- [ ] Adicionar links: Dashboard, Matches, Ranking, Export
- [ ] Adicionar botão de Logout
- [ ] Implementar menu hamburger para mobile
- [ ] Configurar responsividade (desktop/mobile)
- [ ] Testar em diferentes tamanhos de tela

## Critérios de Aceitação
- Navbar exibida em desktop
- Menu hamburger em mobile
- Links funcionam corretamente
- Logout limpa sessão
- Design responsivo

## Dependências
- Nenhuma

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

---

## 15. Criar página de login

**Labels:** `frontend`, `P0`, `ui`

## Descrição
Criar página de login com validação.

## Checklist
- [ ] Criar /src/app/login/page.tsx
- [ ] Criar formulário com email e password
- [ ] Implementar validação de email
- [ ] Adicionar botão de entrar
- [ ] Adicionar link para registro
- [ ] Exibir mensagens de erro
- [ ] Implementar loading state
- [ ] Redirecionar para dashboard após login

## Critérios de Aceitação
- Formulário exibido corretamente
- Validação de email funciona
- Login com credenciais válidas funciona
- Erros são exibidos claramente
- Redirecionamento após login

## Dependências
- #13 (Criar Navbar responsivo)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #13

---

## 16. Criar página de matches

**Labels:** `frontend`, `P0`, `ui`

## Descrição
Criar página para visualizar e fazer palpites dos jogos.

## Checklist
- [ ] Criar /src/app/matches/page.tsx
- [ ] Criar /src/components/matches/MatchCard.tsx
- [ ] Criar /src/components/matches/MatchList.tsx
- [ ] Criar /src/components/matches/PredictionInput.tsx
- [ ] Implementar agrupamento por fase (grupos, knockout)
- [ ] Adicionar tabs para navegação entre fases
- [ ] Implementar inputs de placar
- [ ] Adicionar botão de salvar
- [ ] Exibir indicador de status (salvo, bloqueado)
- [ ] Implementar validação de inputs

## Critérios de Aceitação
- Todos os jogos são exibidos
- Agrupamento por fase funciona
- Usuário pode fazer palpites
- Jogos bloqueados não são editáveis
- Validação de input funciona
- Status indicado corretamente

## Dependências
- #14 (Criar página de login)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #14

---

## 17. Criar página de ranking

**Labels:** `frontend`, `P0`, `ui`

## Descrição
Criar página para visualizar ranking dos participantes.

## Checklist
- [ ] Criar /src/app/ranking/page.tsx
- [ ] Criar /src/components/ranking/RankingTable.tsx
- [ ] Exibir tabela com colunas: #, Nome, Pontos, Exatos, Vencedores
- [ ] Ordenar automaticamente por pontos
- [ ] Highlight para usuário atual
- [ ] Adicionar badge para top 3
- [ ] Criar /src/components/ranking/ExportButtons.tsx
- [ ] Implementar botões de exportar PDF e tabela

## Critérios de Aceitação
- Tabela exibida corretamente
- Ordenação por pontos funciona
- Usuário atual destacado
- Top 3 com badges
- Exportação funciona

## Dependências
- #14 (Criar página de login)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #14

---

## 18. Configurar ambiente de testes

**Labels:** `test`, `P0`, `setup`

## Descrição
Configurar Jest, React Testing Library e Playwright.

## Checklist
- [ ] Instalar dependências de testes
- [ ] Configurar Jest
- [ ] Configurar Playwright
- [ ] Configurar MSW para mocks
- [ ] Configurar scripts no package.json
- [ ] Criar estrutura de diretórios de testes

## Critérios de Aceitação
- npm test funciona
- npm run test:e2e funciona
- Estrutura de testes criada

## Dependências
- #4 (Criar schema do Prisma)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #4

---

## 19. Criar testes de backend

**Labels:** `test`, `P0`, `backend`

## Descrição
Criar testes unitários e de integração para o backend.

## Checklist
- [ ] Testar funções de auth (hash, compare, JWT)
- [ ] Testar funções de scoring
- [ ] Testar POST /api/auth/register
- [ ] Testar POST /api/auth/login
- [ ] Testar POST /api/predictions (com validação de lock)
- [ ] Testar PUT /api/predictions/:matchId
- [ ] Testar GET /api/ranking
- [ ] Alcançar >70% de cobertura

## Critérios de Aceitação
- Todos os testes passam
- Cobertura >70%
- Testes de validação de lock funcionam

## Dependências
- #16 (Configurar ambiente de testes)
- #10 (Implementar PUT /api/predictions/:matchId)
- #12 (Implementar GET /api/ranking)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

**Depende de:** Issue #16

---

