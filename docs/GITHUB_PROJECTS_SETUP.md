# 🚀 Guia de Configuração do GitHub Projects

Este guia explica como configurar o GitHub Projects para o projeto World Cup Betting Pool e integrá-lo com os agentes especializados.

## Por Que GitHub Projects?

O **GitHub Projects** é a melhor escolha para este projeto porque:

1. **Integração Nativa**: Conectado diretamente ao repositório GitHub
2. **Automação Automática**: PRs movem tarefas automaticamente
3. **Gratuito**: Disponível para repositórios públicos
4. **Zero Configuração Extra**: Funciona com ferramentas GitHub existentes
5. **API Robusta**: Permite automação via GitHub CLI
6. **Rastreamento Visual**: Visualiza progresso do projeto em tempo real

## Passo a Passo de Configuração

### 1. Criar o Projeto

1. Acesse o repositório no GitHub
2. Clique na aba **Projects** (ou **Projects (beta)**)
3. Clique em **New project**
4. Escolha o modelo **Board** (não Table)
5. Nomeie o projeto: `World Cup Betting Pool - Development`
6. Clique em **Create**

### 2. Configurar Colunas

Por padrão, o GitHub Projects cria algumas colunas. Vamos personalizá-las:

1. Clique no título de uma coluna para editá-la
2. Configure as seguintes colunas na ordem:

```
┌─────────────────┬──────────────────┬────────────────┬─────────────┐
│    Backlog      │   In Progress    │    Review      │    Done     │
│  (A Fazer)      │   (Em Andamento) │  (Em Revisão)  │ (Concluído) │
└─────────────────┴──────────────────┴────────────────┴─────────────┘
```

**Para excluir colunas padrão:**
- Clique nas três pontinhas (...) no canto da coluna
- Selecione **Delete column**

**Para adicionar coluna:**
- Clique no botão **+ Add column**
- Digite o nome da coluna
- Pressione Enter

### 3. Criar Labels

Vamos criar labels para categorizar as tarefas. Acesse **Settings > Labels** no repositório:

#### Labels de Tipo
1. Clique em **New label**
2. Nome: `infra`
3. Descrição: `Infraestrutura e setup`
4. Cor: `#0075ca` (azul)
5. Clique em **Create label**

Repita para:
- `backend` (roxo - `#5319e7`) - Backend/API
- `frontend` (verde - `#28a745`) - Frontend/UI
- `test` (amarelo - `#fbca04`) - Testes
- `docs` (cinza - `#6f42c1`) - Documentação

#### Labels de Prioridade
- `P0` (vermelho - `#d73a4a`) - Crítico
- `P1` (laranja - `#e36209`) - Alta
- `P2` (amarelo - `#fbca04`) - Média
- `P3` (azul claro - `#006b75`) - Baixa

#### Labels de Status
- `in-progress` (azul - `#0e8a16`) - Em andamento
- `in-review` (roxo - `#5319e7`) - Em revisão
- `done` (cinza - `#6a737d`) - Concluído

### 4. Criar Issues Automaticamente

Usando o script fornecido:

```bash
# Instalar dependências se necessário
npm install -g tsx

# Executar o script
node scripts/create-issues.js
```

Este script irá:
1. Ler a lista de tarefas definida no script
2. Criar uma issue para cada tarefa
3. Atribuir as labels apropriadas
4. Definir dependências entre issues

### 5. Adicionar Issues ao Projeto

**Opção 1: Manual**
1. Acesse a aba **Issues**
2. Para cada issue, clique nos três pontinhos (...)
3. Selecione **Add to project**
4. Escolha o projeto `World Cup Betting Pool - Development`
5. Arraste para a coluna **Backlog**

**Opção 2: Via GitHub CLI (Automatizado)**

```bash
# Obter o número do projeto
gh project list

# Para cada issue, adicionar ao projeto
gh project item add <project-number> --owner <owner> --issue <issue-number>
```

**Opção 3: Bulk (via script)**

```bash
# Criar script para adicionar issues em lote
# scripts/add-to-project.sh

#!/bin/bash

PROJECT_NUMBER=1  # Substitua pelo número do seu projeto
OWNER=$(gh repo view --json owner --jq '.owner.login')
REPO=$(gh repo view --json name --jq '.name')

# Listar issues abertas
gh issue list --limit 100 --json number --jq '.[].number' | while read issue_number; do
  echo "Adicionando issue #$issue_number ao projeto..."
  gh project item add $PROJECT_NUMBER --owner $OWNER --issue $issue_number 2>/dev/null || true
done

echo "✅ Issues adicionadas ao projeto!"
```

### 6. Configurar Automação

O GitHub Actions configurado em `.github/workflows/board-automation.yml` irá automaticamente:

**Quando uma PR é aberta:**
- Adiciona label `in-review` às issues vinculadas
- Move issues para a coluna **Review**

**Quando uma PR é mergeada:**
- Fecha as issues vinculadas
- Adiciona label `done`
- Posta comentário de conclusão

**Quando um review é feito:**
- Notifica sobre aprovação ou pedido de mudanças

### 7. Configurar Visualização

#### Vistas do Projeto

**Vista de Board (Padrão)**
- Mostra colunas horizontais
- Arraste e solte para mover tarefas

**Vista de Table (Opcional)**
- Clique no ícone de tabela no canto superior direito
- Permite filtrar e ordenar por múltiplos campos

#### Filtros e Agrupamento

1. Clique no ícone de filtros (funil)
2. Adicione filtros como:
   - `Label: backend`
   - `Label: P0`
   - `Assignee: @usuario`

3. Para agrupar por label:
   - Clique no ícone de agrupamento
   - Selecione **Group by: Label**

### 8. Integrar com Workflow dos Agentes

#### Fluxo de Trabalho

```
1. 📋 Board Agent cria issues → Backlog
2. 👤 Desenvolvedor pega issue → In Progress
3. 🔀 Git Agent cria branch → In Progress
4. 🏗️ Agente implementa → In Progress
5. 🔀 Git Agent cria PR → Review (automático via GH Actions)
6. 👥 Reviewer aprova → Review
7. 🔀 Git Agent merge → Done (automático via GH Actions)
8. 📋 Board Agent fecha issue → Done
```

#### Comandos dos Agentes

```bash
# 1. Board Agent cria issues
npm run agent:start board create-issues

# 2. Git Agent inicia feature
./scripts/start-feature.sh backend/auth

# 3. Após implementação, criar PR
./scripts/create-pr.sh "feat(auth): implementar registro" 5

# 4. Após aprovação, merge
./scripts/merge-pr.sh 123
```

### 9. Dashboard e Métricas

O GitHub Projects fornece métricas automáticas:

**Para acessar:**
1. Clique no botão **Insights** no canto superior direito
2. Veja:
   - Tempo médio de conclusão
   - Velocidade do time
   - Tarefas por coluna
   - Gráfico de burndown

**Métricas a monitorar:**
- Tempo médio em **In Progress**
- Tempo médio em **Review**
- Número de tarefas em **Backlog**
- Velocidade (tarefas completadas por semana)

### 10. Melhores Práticas

#### Para Equipe
1. **Manter o board atualizado**: Mova tarefas conforme progresso
2. **Usar labels consistentemente**: Segua a convenção estabelecida
3. **Documentar em issues**: Adicione detalhes e critérios de aceitação
4. **Vincular PRs a issues**: Use `Fixes #<number>` no corpo da PR
5. **Revisar diariamente**: Check-in de 10 minutos para atualizar status

#### Para Agentes
1. **Board Agent**: Criar issues com descrições detalhadas
2. **Git Agent**: Sempre vincular PR a issue
3. **Todos os agentes**: Atualizar status quando tarefa começa/termina

#### Evitar
- Não deixar tarefas estagnadas por muito tempo
- Não misturar tipos de trabalho na mesma issue
- Não criar issues sem critérios de aceitação claros
- Não esquecer de vincular PRs a issues

### 11. Troubleshooting

#### Issues não estão movendo automaticamente

**Problema**: GitHub Actions não está movendo issues.

**Solução**:
1. Verifique se o workflow `board-automation.yml` está rodando
2. Acesse **Actions** tab e verifique logs
3. Verifique se a PR menciona a issue corretamente (`Fixes #<number>`)

#### Labels não estão sendo aplicadas

**Problema**: Labels não aparecem nas issues.

**Solução**:
1. Verifique se as labels existem no repositório
2. Verifique permissões do token do GitHub Actions
3. Ajuste permissões em **Settings > Actions > General**

#### Issues duplicadas

**Problema**: Script criou issues duplicadas.

**Solução**:
1. Exclua as duplicadas manualmente
2. Verifique o script para evitar recriação
3. Adicione verificação de existência antes de criar

## Resumo de Comandos Úteis

```bash
# Listar projetos
gh project list

# Adicionar issue ao projeto
gh project item add <project-number> --issue <issue-number>

# Mover item entre colunas
gh project item edit <project-number> --id <item-id> --field-id "Status" --field-value-id "<column-id>"

# Criar issue via CLI
gh issue create --title "Título" --body "Descrição" --label "backend,P0"

# Listar issues do projeto
gh issue list --project <project-number>

# Fechar issue
gh issue close <issue-number>

# Adicionar label
gh issue edit <issue-number> --add-label "in-review"
```

## Próximos Passos

1. ✅ Criar projeto no GitHub Projects
2. ✅ Configurar colunas
3. ✅ Criar labels
4. ✅ Executar script de criação de issues
5. ✅ Adicionar issues ao projeto
6. ✅ Verificar automação via GitHub Actions
7. ✅ Começar a trabalhar nas tarefas!

---

**Recursos Adicionais:**
- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub CLI Documentation](https://cli.github.com/manual/gh_project)
- [AGENTS.md](../AGENTS.md) - Documentação dos agentes
- [PLAN.md](../PLAN.md) - Plano de implementação
