#!/usr/bin/env node

/**
 * Script para criar issues no GitHub a partir do PLAN.md
 * Versão final que usa --body-file para evitar problemas com caracteres especiais
 *
 * Uso:
 *   node scripts/create-issues-final.js
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Locais comuns do GitHub CLI no Windows
const GITHUB_CLI_PATHS = [
  'gh',
  '/mnt/c/Users/$USER/AppData/Local/Programs/GitHub CLI/gh.exe',
  '/mnt/c/Program Files/GitHub CLI/gh.exe',
  'C:\\Users\\$USER\\AppData\\Local\\Programs\\GitHub CLI\\gh.exe',
  'C:\\Program Files\\GitHub CLI\\gh.exe',
  process.env.USERPROFILE ? join(process.env.USERPROFILE, 'AppData', 'Local', 'Programs', 'GitHub CLI', 'gh.exe') : null,
].filter(Boolean);

// Encontrar o GitHub CLI
function findGitHubCLI() {
  try {
    spawnSync('gh', ['--version'], { stdio: 'pipe', timeout: 5000 });
    return 'gh';
  } catch (error) {
    // gh não está no PATH
  }

  for (const path of GITHUB_CLI_PATHS) {
    if (path === 'gh') continue;

    let testPath = path;
    if (path.includes('$USER')) {
      const username = process.env.USER || process.env.USERNAME || 'paulo';
      testPath = path.replace(/\$USER/g, username);
    }

    if (existsSync(testPath)) {
      console.log(`✅ GitHub CLI encontrado em: ${testPath}`);
      return testPath;
    }
  }

  return null;
}

// Verificar autenticação
function checkGitHubAuth(ghPath) {
  try {
    const result = spawnSync(ghPath, ['auth', 'status'], {
      stdio: 'pipe',
      encoding: 'utf-8',
      timeout: 5000
    });

    if (result.stderr && result.stderr.includes('not logged')) {
      return false;
    }

    return !result.error;
  } catch (error) {
    return false;
  }
}

// Lista de tarefas
const TASKS = [
  {
    title: 'Setup inicial do projeto',
    body: `## Descrição
Inicializar projeto Next.js com TypeScript e configurar estrutura básica.

## Checklist
- [ ] Criar projeto Next.js
- [ ] Configurar TypeScript strict mode
- [ ] Configurar Tailwind CSS
- [ ] Configurar ESLint
- [ ] Criar estrutura de diretórios (src/app, src/components, src/lib, src/types)

## Dependências
- Nenhuma

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['infra', 'P0', 'setup'],
    agent: 'infra'
  },
  {
    title: 'Instalar dependências principais',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['infra', 'P0', 'setup'],
    agent: 'infra',
    dependsOn: 1
  },
  {
    title: 'Configurar Prisma',
    body: `## Descrição
Inicializar e configurar o Prisma com PostgreSQL.

## Checklist
- [ ] Executar npx prisma init
- [ ] Configurar DATABASE_URL no .env
- [ ] Criar .env.example
- [ ] Executar npx prisma generate
- [ ] Adicionar script de seed ao package.json

## Dependências
- #2 (Instalar dependências principais)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['infra', 'P0', 'setup'],
    agent: 'infra',
    dependsOn: 2
  },
  {
    title: 'Criar schema do Prisma',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['backend', 'P0', 'schema'],
    agent: 'backend',
    dependsOn: 3
  },
  {
    title: 'Criar seed script',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['backend', 'P1', 'schema'],
    agent: 'backend',
    dependsOn: 4
  },
  {
    title: 'Implementar auth utilities',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['backend', 'P0', 'auth'],
    agent: 'backend',
    dependsOn: 4
  },
  {
    title: 'Implementar POST /api/auth/register',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['backend', 'P0', 'auth'],
    agent: 'backend',
    dependsOn: 6
  },
  {
    title: 'Implementar POST /api/auth/login',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['backend', 'P0', 'auth'],
    agent: 'backend',
    dependsOn: 6
  },
  {
    title: 'Implementar GET /api/matches',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['backend', 'P0', 'api'],
    agent: 'backend',
    dependsOn: 5
  },
  {
    title: 'Implementar POST /api/predictions',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['backend', 'P0', 'api'],
    agent: 'backend',
    dependsOn: 8
  },
  {
    title: 'Implementar PUT /api/predictions/:matchId',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['backend', 'P0', 'api'],
    agent: 'backend',
    dependsOn: 9
  },
  {
    title: 'Implementar sistema de pontuação',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['backend', 'P0', 'api'],
    agent: 'backend',
    dependsOn: 4
  },
  {
    title: 'Implementar GET /api/ranking',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['backend', 'P0', 'api'],
    agent: 'backend',
    dependsOn: 11
  },
  {
    title: 'Criar Navbar responsivo',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['frontend', 'P0', 'ui'],
    agent: 'frontend'
  },
  {
    title: 'Criar página de login',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['frontend', 'P0', 'ui'],
    agent: 'frontend',
    dependsOn: 13
  },
  {
    title: 'Criar página de matches',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['frontend', 'P0', 'ui'],
    agent: 'frontend',
    dependsOn: 14
  },
  {
    title: 'Criar página de ranking',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['frontend', 'P0', 'ui'],
    agent: 'frontend',
    dependsOn: 14
  },
  {
    title: 'Configurar ambiente de testes',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['test', 'P0', 'setup'],
    agent: 'test',
    dependsOn: 4
  },
  {
    title: 'Criar testes de backend',
    body: `## Descrição
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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`,
    labels: ['test', 'P0', 'backend'],
    agent: 'test',
    dependsOn: 16
  }
];

/**
 * Cria uma issue usando arquivo temporário para o corpo
 */
function createIssue(ghPath, task, index) {
  try {
    const bodyWithDeps = task.dependsOn
      ? `${task.body}\n\n---\n\n**Depends on:** #${task.dependsOn}`
      : task.body;

    const labelString = task.labels.join(',');

    // Criar arquivo temporário para o corpo
    const tempDir = tmpdir();
    const bodyFile = join(tempDir, `issue-body-${Date.now()}.txt`);
    writeFileSync(bodyFile, bodyWithDeps, 'utf-8');

    try {
      const args = [
        'issue', 'create',
        '--title', task.title,
        '--body-file', bodyFile,
        '--label', labelString
      ];

      console.log(`🔄 Criando issue "${task.title}"...`);

      const result = spawnSync(ghPath, args, {
        stdio: 'pipe',
        encoding: 'utf-8',
        timeout: 30000
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.status !== 0) {
        throw new Error(`Exit code: ${result.status}\nStderr: ${result.stderr}`);
      }

      const output = result.stdout.trim();
      const lines = output.split('\n').filter(line => line.trim().length > 0);
      const issueUrl = lines[lines.length - 1];

      console.log(`✅ Issue #${index + 1} criada: ${task.title}`);
      console.log(`   ${issueUrl}`);

      // Extrair número da issue da URL
      const match = issueUrl?.match(/\/issues\/(\d+)/);
      return match ? parseInt(match[1]) : null;
    } finally {
      // Remover arquivo temporário
      try {
        unlinkSync(bodyFile);
      } catch (error) {
        // Ignorar erro ao remover arquivo temporário
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao criar issue "${task.title}":`, error.message);
    return null;
  }
}

/**
 * Gera arquivo Markdown para criação manual
 */
function generateMarkdownFile(tasks) {
  let content = `# Issues do World Cup Betting Pool

## Como usar este arquivo

Este arquivo contém todas as issues que precisam ser criadas no GitHub.

### Opção 1: Usar GitHub CLI (recomendado)

1. Instale o GitHub CLI: https://cli.github.com/
2. Autentique: \`gh auth login\`
3. Execute: \`npm run board:create\`

### Opção 2: Criação manual

Para cada issue abaixo:
1. Copie o título e o corpo
2. Acesse: https://github.com/paulohfreire/worldcup-bet/issues/new
3. Cole o título e o corpo
4. Adicione as labels indicadas
5. Crie a issue

---

`;

  tasks.forEach((task, index) => {
    content += `## ${index + 1}. ${task.title}\n\n`;
    content += `**Labels:** ${task.labels.map(l => `\`${l}\``).join(', ')}\n\n`;
    content += task.body + '\n\n';
    if (task.dependsOn) {
      content += `**Depende de:** Issue #${task.dependsOn}\n\n`;
    }
    content += '---\n\n';
  });

  return content;
}

/**
 * Função principal
 */
async function main() {
  console.log('\n🚀 Gerando issues do PLAN.md para o GitHub...\n');

  // Encontrar GitHub CLI
  console.log('🔍 Procurando GitHub CLI...');
  const ghPath = findGitHubCLI();

  if (!ghPath) {
    console.log('❌ GitHub CLI não encontrado nos seguintes locais:');
    GITHUB_CLI_PATHS.forEach(path => {
      console.log(`   - ${path}`);
    });
    console.log('\nGerando arquivo de issues para criação manual...\n');

    const markdownContent = generateMarkdownFile(TASKS);
    const outputFile = join(process.cwd(), 'GITHUB_ISSUES.md');

    writeFileSync(outputFile, markdownContent, 'utf-8');

    console.log(`✅ Arquivo GITHUB_ISSUES.md gerado com sucesso!`);
    console.log(`   Localização: ${outputFile}`);
    console.log('\n📋 Próximos passos:');
    console.log('   1. Abra o arquivo GITHUB_ISSUES.md');
    console.log('   2. Siga as instruções para criar as issues manualmente\n');
    return;
  }

  console.log(`✅ GitHub CLI encontrado: ${ghPath}\n`);

  // Verificar autenticação
  console.log('🔐 Verificando autenticação...');
  const isAuthenticated = checkGitHubAuth(ghPath);

  if (!isAuthenticated) {
    console.log('⚠️  GitHub CLI não está autenticado\n');
    console.log('Para autenticar:');
    console.log('   1. Abra o PowerShell');
    console.log('   2. Execute: npm run gh:login');
    console.log('   3. Depois execute este script novamente\n');
    return;
  }

  console.log('✅ GitHub CLI autenticado\n');
  console.log('Criando issues automaticamente...\n');

  const createdIssues = [];

  for (let i = 0; i < TASKS.length; i++) {
    const task = TASKS[i];
    console.log(`\n[${i + 1}/${TASKS.length}] Processando: ${task.title}`);

    if (task.dependsOn && !createdIssues.includes(task.dependsOn)) {
      console.log(`⏳  Aguardando dependência #${task.dependsOn}...`);
    }

    const issueNumber = createIssue(ghPath, task, i);

    if (issueNumber) {
      createdIssues.push(issueNumber);
    }

    // Delay para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ ${createdIssues.length} issues criadas com sucesso!`);
  console.log('='.repeat(60));
  console.log('\n📋 Próximos passos:');
  console.log('   1. Acesse o repositório no GitHub');
  console.log('   2. Crie um projeto no GitHub Projects');
  console.log('   3. Adicione as issues ao projeto');
  console.log('   4. Comece a trabalhar nas tarefas!\n');
}

// Executar
main().catch(console.error);
