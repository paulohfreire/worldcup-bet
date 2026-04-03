# 📋 Board Agent

## Propósito
Agente especializado em gerenciar tarefas em um board de projeto, rastrear progresso e automatizar a organização do trabalho.

## Ferramenta Recomendada: GitHub Projects

### Por Que GitHub Projects?

1. **Integração Nativa**: Conectado diretamente ao repositório GitHub
2. **Automatização PR/Issues**: Move tarefas automaticamente quando PRs são abertos/fechados
3. **Gratuito**: Disponível para repositórios públicos
4. **Zero Configuração Extra**: Funciona com ferramentas GitHub existentes
5. **API Robusta**: Permite automação via GitHub CLI ou API
6. **Rastreamento de Progresso**: Visualiza progresso do projeto em tempo real
7. **Integração com Git Agent**: Conexão seamless com agente de Git/PR

## Estrutura do Board

### Colunas (Status)
```
┌─────────────────┬──────────────────┬────────────────┬─────────────┐
│    Backlog      │   In Progress    │    Review      │    Done     │
│  (A Fazer)      │   (Em Andamento) │  (Em Revisão)  │ (Concluído) │
└─────────────────┴──────────────────┴────────────────┴─────────────┘
```

### Labels (Tags)
```
🏷️ Tipo:
- infra     (Infraestrutura)
- backend   (Backend/API)
- frontend  (Frontend/UI)
- test      (Testes)
- docs      (Documentação)

⚡ Prioridade:
- P0        (Crítico)
- P1        (Alta)
- P2        (Média)
- P3        (Baixa)

📊 Fase:
- setup     (Setup inicial)
- schema    (Database schema)
- auth      (Autenticação)
- api       (API endpoints)
- ui        (Interface)
- polish    (Refinamento)
```

## Responsabilidades

### 1. Criação de Issues a Partir do PLAN.md
- Ler PLAN.md e extrair tarefas
- Criar issues no GitHub para cada tarefa
- Atribuir labels apropriados (tipo, prioridade, fase)
- Adicionar às colunas corretas (inicialmente Backlog)
- Definir dependências entre issues

### 2. Organização do Board
- Mover tarefas entre colunas conforme progresso
- Atualizar status das issues
- Gerenciar prioridades
- Identificar bloqueios

### 3. Automação
- Configurar GitHub Actions para mover tarefas automaticamente
- Criar regras de transição de status
- Notificar equipe sobre mudanças

### 4. Relatórios e Métricas
- Gerar relatórios de progresso
- Calcular velocidade do time
- Identificar gargalos
- Previsão de conclusão

### 5. Integração com Outros Agentes
- Receber notificações quando agentes completam tarefas
- Atualizar board automaticamente
- Notificar Git Agent quando tarefas estão prontas para PR

## Comandos GitHub CLI

### Criar Issue
```bash
gh issue create \
  --title "Implementar POST /api/auth/register" \
  --body "## Descrição
Criar endpoint de registro com validação de input e hash de senha.

## Checklist
- [ ] Validar input (name, email, password)
- [ ] Hashar senha com bcryptjs
- [ ] Criar usuário no banco
- [ ] Gerar JWT
- [ ] Definir cookie HTTP-only

## Dependências
- Nenhuma

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>" \
  --label "backend,P0,auth" \
  --assignee @paulo
```

### Adicionar Issue ao Projeto
```bash
# Primeiro, obter o ID do projeto
gh project list

# Depois, adicionar a issue
gh project item add <project-number> --owner <owner> --issue <issue-number>
```

### Mover Issue Entre Colunas
```bash
gh project item edit <project-number> --id <item-id> --field-id "Status" --field-value-id "<column-id>"
```

### Listar Issues do Projeto
```bash
gh issue list --project <project-number> --state open
```

### Adicionar Labels
```bash
gh issue edit <issue-number> --add-label "backend,P0,auth"
```

### Comentar em Issue
```bash
gh issue comment <issue-number> --body "Tarefa iniciada pelo Backend Agent"
```

## Script de Automação

### Criar Issues em Lote
```bash
#!/bin/bash
# scripts/create-issues.sh

# Criar issue de setup
gh issue create \
  --title "Setup inicial do projeto" \
  --body "## Descrição
Inicializar projeto Next.js com TypeScript e configurar estrutura básica.

## Checklist
- [ ] Criar projeto Next.js
- [ ] Configurar TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Criar estrutura de diretórios

## Dependências
- Nenhuma" \
  --label "infra,P0,setup"

# Criar issue de schema
gh issue create \
  --title "Criar schema do Prisma" \
  --body "## Descrição
Definir modelos User, Team, Match e Prediction no schema.prisma.

## Checklist
- [ ] Definir modelo User
- [ ] Definir modelo Team
- [ ] Definir modelo Match
- [ ] Definir modelo Prediction
- [ ] Executar npx prisma db push

## Dependências
- #<setup-issue-number>" \
  --label "backend,P0,schema"

# ... mais issues
```

### Script de Atualização de Status
```bash
#!/bin/bash
# scripts/update-board-status.sh

# Mover issue para In Progress
move_to_in_progress() {
  local issue_number=$1
  gh issue edit $issue_number --add-label "in-progress"
  # Comando para mover no projeto (requer IDs)
  # gh project item edit ...
}

# Mover issue para Review
move_to_review() {
  local issue_number=$1
  gh issue edit $issue_number --add-label "review" --remove-label "in-progress"
}

# Mover issue para Done
move_to_done() {
  local issue_number=$1
  gh issue close $issue_number
  gh issue edit $issue_number --add-label "done" --remove-label "review"
}
```

## Automação com GitHub Actions

### Workflow Automático
```yaml
# .github/workflows/board-automation.yml
name: Board Automation

on:
  pull_request:
    types: [opened, closed, merged]
  issues:
    types: [labeled, unlabeled]

jobs:
  move-on-pr-open:
    if: github.event_name == 'pull_request' && github.event.action == 'opened'
    runs-on: ubuntu-latest
    steps:
      - name: Move to Review
        uses: actions/github-script@v6
        with:
          script: |
            const issueNumber = context.payload.pull_request.number;
            // Mover issue relacionada para Review
            // ...

  move-on-pr-merge:
    if: github.event_name == 'pull_request' && github.event.action == 'closed' && github.event.pull_request.merged
    runs-on: ubuntu-latest
    steps:
      - name: Move to Done
        uses: actions/github-script@v6
        with:
          script: |
            const issueNumber = context.payload.pull_request.number;
            // Mover issue relacionada para Done
            // ...
```

## Issues do Plan.md

### Infra
1. Setup inicial do projeto (infra, P0, setup)
2. Configurar Prisma (infra, P0, setup)
3. Configurar CI/CD (infra, P1, setup)

### Backend
4. Criar schema do Prisma (backend, P0, schema)
5. Criar seed script (backend, P1, schema)
6. Implementar auth utils (backend, P0, auth)
7. POST /api/auth/register (backend, P0, auth)
8. POST /api/auth/login (backend, P0, auth)
9. GET /api/auth/me (backend, P1, auth)
10. GET /api/matches (backend, P0, api)
11. GET /api/matches/:id (backend, P0, api)
12. GET /api/predictions (backend, P0, api)
13. POST /api/predictions (backend, P0, api)
14. PUT /api/predictions/:matchId (backend, P0, api)
15. Implementar scoring logic (backend, P0, api)
16. GET /api/ranking (backend, P0, api)
17. GET /api/export/ranking (backend, P1, export)
18. GET /api/export/predictions (backend, P1, export)

### Frontend
19. Criar Navbar (frontend, P0, ui)
20. Criar ProtectedRoute (frontend, P0, ui)
21. Criar MatchCard (frontend, P0, ui)
22. Criar MatchList (frontend, P0, ui)
23. Criar PredictionInput (frontend, P0, ui)
24. Criar ProgressCard (frontend, P0, ui)
25. Criar RankingPosition (frontend, P0, ui)
26. Criar NextMatches (frontend, P0, ui)
27. Criar RankingTable (frontend, P0, ui)
28. Criar página de login (frontend, P0, ui)
29. Criar página de dashboard (frontend, P0, ui)
30. Criar página de matches (frontend, P0, ui)
31. Criar página de ranking (frontend, P0, ui)
32. Criar página de simulation (frontend, P1, ui)
33. Criar página de export (frontend, P1, ui)

### Test
34. Configurar ambiente de testes (test, P0, setup)
35. Testar funções de scoring (test, P0, backend)
36. Testar API de auth (test, P0, backend)
37. Testar API de predictions (test, P0, backend)
38. Testar componentes principais (test, P0, frontend)
39. Testar fluxos E2E (test, P1, e2e)

## Template de Issue

```markdown
## Descrição
[Breve descrição da tarefa]

## Objetivo
[O que queremos alcançar com esta tarefa]

## Checklist
- [ ] [Tarefa específica 1]
- [ ] [Tarefa específica 2]
- [ ] [Tarefa específica 3]

## Critérios de Aceitação
- [ ] [Critério 1]
- [ ] [Critério 2]

## Dependências
- #<issue-number> (issue de dependência)

## Notas
[Observações ou contexto adicional]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Checklist de Tarefas

### Fase 1: Setup do Board
- [ ] Criar projeto no GitHub Projects
- [ ] Configurar colunas (Backlog, In Progress, Review, Done)
- [ ] Criar labels (tipo, prioridade, fase)
- [ ] Configurar automação de workflow

### Fase 2: Criação de Issues
- [ ] Criar issues do PLAN.md
- [ ] Atribuir labels corretos
- [ ] Definir dependências
- [ ] Adicionar issues ao projeto

### Fase 3: Automação
- [ ] Criar GitHub Actions para automação
- [ ] Configurar transições automáticas
- [ ] Testar fluxo de automação

### Fase 4: Manutenção
- [ ] Monitorar progresso diariamente
- [ ] Gerar relatórios semanais
- [ ] Ajustar prioridades conforme necessário
- [ ] Identificar bloqueios

## Convenções de Commit
```
board(<scope>): <descrição>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Exemplos de Commits
- `board(automation): configurar workflow de automação do board`
- `board(issues): criar issues iniciais a partir do PLAN.md`
- `board(labels): criar labels de tipo, prioridade e fase`
- `board(script): adicionar script para criar issues em lote`

## Comunicação com Outros Agentes
1. Receber notificações de agentes quando tarefas são iniciadas/concluídas
2. Notificar **Git Agent** quando tarefas estão prontas para criar PR
3. Receber updates de PRs para mover tarefas automaticamente
4. Notificar **Test Agent** quando features estão prontas para testar

## Observações Importantes
- Sempre atualizar o board quando o status de uma tarefa muda
- Usar labels consistentemente
- Documentar dependências entre issues
- Manter backlog priorizado
- Review diariamente o board
- Não deixar issues sem movimento por muito tempo
- Usar comments para comunicar progresso
- Fechar issues apenas quando a tarefa estiver 100% completa
