# 📋 Como Configurar o Board de Tarefas

Este guia explica como configurar e usar o sistema de gerenciamento de tarefas do projeto World Cup Betting Pool.

## 🎯 Visão Geral

O projeto usa **GitHub Issues** e **GitHub Projects** para gerenciar as tarefas. Isso permite:
- Rastreamento de progresso em tempo real
- Integração direta com o código (commits, PRs)
- Colaboração fácil entre desenvolvedores
- Automação de workflows

## 🔧 Configuração Inicial

### Opção 1: Usar GitHub CLI (Recomendado)

1. **Instale o GitHub CLI**
   ```bash
   # Windows (via winget)
   winget install --id GitHub.cli

   # macOS (via Homebrew)
   brew install gh

   # Linux
   # Verifique https://cli.github.com/ para instruções específicas
   ```

2. **Autentique-se**
   ```bash
   gh auth login
   ```
   Siga as instruções na tela. Você precisará selecionar:
   - GitHub.com
   - Login with a web browser

3. **Verifique a autenticação**
   ```bash
   gh auth status
   ```

4. **Execute o script de criação de issues**
   ```bash
   npm run board:create
   ```

   O script vai:
   - Detectar automaticamente se o gh CLI está instalado e autenticado
   - Criar todas as issues do PLAN.md
   - Atribuir labels corretos
   - Definir dependências entre issues

### Opção 2: Criação Manual

Se não quiser usar o GitHub CLI:

1. **Execute o script para gerar o arquivo de issues**
   ```bash
   npm run board:create
   ```

2. **Abra o arquivo gerado**
   ```bash
   cat GITHUB_ISSUES.md
   # ou abra no seu editor de texto favorito
   ```

3. **Siga as instruções do arquivo** para criar cada issue manualmente no GitHub

## 📦 Estrutura do Board

### Labels (Tags)

#### Tipo de Tarefa
- `infra` - Infraestrutura e setup
- `backend` - Backend e APIs
- `frontend` - Frontend e UI
- `test` - Testes

#### Prioridade
- `P0` - Crítica (deve ser feita primeiro)
- `P1` - Alta
- `P2` - Média
- `P3` - Baixa

#### Fase do Projeto
- `setup` - Setup inicial
- `schema` - Schema do banco de dados
- `auth` - Autenticação
- `api` - APIs e endpoints
- `ui` - Interface do usuário

### Colunas do Board

O board tem 4 colunas principais:

1. **Backlog** - Tarefas ainda não iniciadas
2. **In Progress** - Tarefas atualmente em desenvolvimento
3. **Review** - Tarefas prontas para code review
4. **Done** - Tarefas concluídas e merged

## 🚀 Workflow de Trabalho

### 1. Selecionar uma Tarefa

- Escolha uma issue do Backlog
- Verifique se as dependências estão resolvidas
- Mova para "In Progress"

### 2. Trabalhar na Tarefa

- Crie uma branch para a tarefa
  ```bash
  git checkout -b feature/<numero-da-issue>-<descricao-curta>
  ```

- Desenvolva a funcionalidade

- Commit com mensagem descritiva
  ```bash
  git commit -m "Implementar POST /api/auth/register

  - Adiciona validação de input
  - Hasha senha com bcryptjs
  - Cria usuário no banco
  - Gera JWT e define cookie

  Fixes #<numero-da-issue>"
  ```

### 3. Abrir Pull Request

- Push da branch
  ```bash
  git push origin feature/<numero-da-issue>-<descricao-curta>
  ```

- Abra PR no GitHub
- Adicione `fixes #<numero-da-issue>` na descrição
- Mova issue para "Review"

### 4. Code Review

- Aguardar review do time
- Fazer correções se necessário
- Aprovar PR

### 5. Merge

- Merge do PR (preferencialmente squash merge)
- Issue será movida automaticamente para "Done"

## 🎯 Comandos Úteis

### Criar Issues
```bash
npm run board:create          # Detecção automática do gh CLI
npm run board:create:auto     # Forçar uso do gh CLI
```

### Ver Informações do Board Agent
```bash
npm run agent:info
```

### Listar Issues do Repositório
```bash
gh issue list --state open
```

### Filtrar por Label
```bash
gh issue list --label "backend"
gh issue list --label "P0"
```

## 🔄 Automação

O sistema pode ser configurado para automação total:

### Automação de Status

Configurar GitHub Actions para mover issues automaticamente:

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
            // Lógica para mover issue para Review
```

## 📊 Monitoramento

### Status do Projeto

```bash
# Ver quantas issues por label
gh issue list --label "P0" --state open | wc -l
gh issue list --label "in-progress" --state open | wc -l
gh issue list --label "done" --state closed | wc -l
```

### Progresso por Agente

```bash
# Backend
gh issue list --label "backend" --state open
gh issue list --label "backend" --state closed

# Frontend
gh issue list --label "frontend" --state open
gh issue list --label "frontend" --state closed
```

## 🐛 Troubleshooting

### Erro: "GitHub CLI não encontrado"

**Solução:** Instale o GitHub CLI
```bash
# Windows
winget install --id GitHub.cli

# macOS
brew install gh
```

### Erro: "not logged in to GitHub"

**Solução:** Autentique-se
```bash
gh auth login
```

### Issues não estão sendo criadas

**Solução:**
1. Verifique se o gh CLI está instalado: `gh --version`
2. Verifique se está autenticado: `gh auth status`
3. Tente criar uma issue manualmente: `gh issue create --title "Test"`

### Script gera arquivo mas não cria issues

**Solução:** Use o arquivo GITHUB_ISSUES.md gerado para criar as issues manualmente, ou instale o gh CLI.

## 📚 Recursos Adicionais

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub Issues Documentation](https://docs.github.com/en/issues)

## 🤝 Contribuindo

Para adicionar novas tarefas:

1. Atualize o arquivo `scripts/create-issues-fixed.js`
2. Adicione a nova tarefa ao array `TASKS`
3. Execute `npm run board:create` novamente
4. As issues existentes não serão duplicadas

---

**Nota:** Este sistema é uma ferramenta de auxílio. Desenvolvedores devem sempre review e validar o trabalho gerado.
