# 🤖 Sistema de Agentes Especializados

## Visão Geral

Este projeto utiliza um sistema de agentes especializados para implementação automatizada do **World Cup Betting Pool**. Cada agente é responsável por uma área específica do projeto, permitindo desenvolvimento paralelo e organizado.

## Agentes Disponíveis

| Agente | Descrição | Comando |
|--------|-----------|---------|
| 🏗️ **Infra Agent** | Setup inicial, infraestrutura e ambiente | `npm run agent:start infra` |
| 🔧 **Backend Agent** | API, lógica de negócio e banco de dados | `npm run agent:start backend` |
| 🎨 **Frontend Agent** | Componentes React e páginas Next.js | `npm run agent:start frontend` |
| 🧪 **Test Agent** | Testes unitários, integração e E2E | `npm run agent:start test` |
| 📋 **Board Agent** | Gerenciamento de tarefas no GitHub Projects | `npm run agent:start board` |
| 🔀 **Git/PR Agent** | Branches, commits e pull requests | `npm run agent:start git` |

## Arquitetura de Trabalho

```
┌─────────────────────────────────────────────────────────────────┐
│                    Orquestrador de Agentes                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   ┌─────────┐        ┌─────────┐        ┌─────────┐
   │  Infra  │        │ Backend │        │ Frontend│
   │  Agent  │        │  Agent  │        │  Agent  │
   └────┬────┘        └────┬────┘        └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
         ┌─────────┐  ┌─────────┐  ┌─────────┐
         │  Test   │  │  Board  │  │   Git   │
         │  Agent  │  │  Agent  │  │  Agent  │
         └─────────┘  └─────────┘  └─────────┘
```

## Fluxo de Trabalho

### 1. Setup Inicial
```bash
# 1. Orquestrador notifica Infra Agent
npm run agent:start infra setup

# 2. Infra Agent configura projeto
# - Cria projeto Next.js
# - Instala dependências
# - Configura Prisma
```

### 2. Criação do Board
```bash
# Board Agent cria issues no GitHub Projects
npm run agent:start board create-issues
```

### 3. Desenvolvimento em Paralelo

#### Backend
```bash
# 1. Git Agent cria branch
npm run agent:start git start-feature backend/auth

# 2. Backend Agent implementa
# - Cria schema Prisma
# - Implementa endpoints de auth

# 3. Git Agent faz commits e PR
npm run agent:start git create-pr
```

#### Frontend
```bash
# 1. Git Agent cria branch
npm run agent:start git start-feature frontend/navbar

# 2. Frontend Agent implementa
# - Cria componentes de layout
# - Implementa páginas

# 3. Git Agent faz commits e PR
npm run agent:start git create-pr
```

#### Testes
```bash
# Test Agent cria e executa testes
npm run agent:start test test:coverage
```

### 4. Integração e Merge
```bash
# Após aprovação do review
npm run agent:start git merge-pr <pr-number>
```

## Comandos dos Agentes

### Infra Agent
```bash
npm run agent:start infra setup      # Setup inicial do projeto
npm run agent:start infra install    # Instalar dependências
npm run agent:start infra prisma-init # Inicializar Prisma
npm run agent:start infra db-push    # Push do schema para o DB
```

### Backend Agent
```bash
npm run agent:start backend create-schema # Criar schema Prisma
npm run agent:start backend db-seed       # Executar seed script
npm run agent:start backend test          # Rodar testes de backend
```

### Frontend Agent
```bash
npm run agent:start frontend dev    # Iniciar servidor de dev
npm run agent:start frontend build  # Build para produção
npm run agent:start frontend lint   # Rodar linter
```

### Test Agent
```bash
npm run agent:start test test            # Rodar todos os testes
npm run agent:start test test:watch      # Modo watch
npm run agent:start test test:coverage   # Com cobertura
npm run agent:start test test:e2e        # Testes E2E
```

### Board Agent
```bash
npm run agent:start board create-issues  # Criar issues do PLAN.md
npm run agent:start board update-status  # Atualizar status das issues
```

### Git Agent
```bash
npm run agent:start git start-feature <branch> # Criar nova branch
npm run agent:start git create-pr              # Criar pull request
npm run agent:start git merge-pr <number>      # Merge PR aprovada
```

## Integração com GitHub Projects

O sistema usa **GitHub Projects** como ferramenta de board de tarefas:

### Vantagens do GitHub Projects

1. **Integração Nativa**: Conectado diretamente ao repositório
2. **Automatização**: PRs movem tarefas automaticamente
3. **Gratuito**: Disponível para repositórios públicos
4. **Zero Configuração Extra**: Funciona com ferramentas GitHub existentes
5. **API Robusta**: Permite automação via GitHub CLI

### Estrutura do Board

```
┌─────────────────┬──────────────────┬────────────────┬─────────────┐
│    Backlog      │   In Progress    │    Review      │    Done     │
│  (A Fazer)      │   (Em Andamento) │  (Em Revisão)  │ (Concluído) │
└─────────────────┴──────────────────┴────────────────┴─────────────┘
```

### Labels

**Tipo:**
- `infra` - Infraestrutura
- `backend` - Backend/API
- `frontend` - Frontend/UI
- `test` - Testes

**Prioridade:**
- `P0` - Crítico
- `P1` - Alta
- `P2` - Média
- `P3` - Baixa

## Configuração do package.json

Adicione os seguintes scripts ao seu `package.json`:

```json
{
  "scripts": {
    "agent:start": "tsx scripts/agent-runner/orchestrator.ts",
    "agent:info": "tsx scripts/agent-runner/orchestrator.ts info"
  }
}
```

## Exemplos de Uso

### Listar todos os agentes
```bash
npm run agent:start
```

### Ver informações de um agente
```bash
npm run agent:start backend
```

### Executar tarefa específica
```bash
npm run agent:start backend create-schema
```

## Comunicação Entre Agentes

Os agentes se comunicam através de:

1. **Arquivos de Estado**: `.agent-reports.json` contém relatórios de execução
2. **GitHub Issues**: Issues servem como comunicação de tarefas
3. **Pull Requests**: PRs comunicam mudanças e revisões
4. **Documentação**: Arquivos `.md` em cada pasta de agente

## Relatórios de Execução

Cada execução de agente gera um relatório em `.agent-reports.json`:

```json
[
  {
    "timestamp": "2026-04-03T14:30:00.000Z",
    "agent": "backend",
    "task": "create-schema",
    "status": "success",
    "message": "Tarefa executada com sucesso"
  }
]
```

## Boas Práticas

### Para Desenvolvedores
1. Sempre verificar o que o agente fez antes de prosseguir
2. Ler os logs e relatórios de execução
3. Testar manualmente as mudanças
4. Review cuidadoso dos PRs

### Para Manutenção
1. Manter as instruções dos agentes atualizadas
2. Adicionar novos comandos quando necessário
3. Documentar mudanças no fluxo de trabalho
4. Monitorar relatórios de execução

## Estendendo o Sistema

### Adicionar Novo Agente

1. Criar pasta em `/agents/<novo-agente>/`
2. Criar arquivo `agent.md` com instruções
3. Adicionar configuração ao `orchestrator.ts`
4. Atualizar este documento

### Adicionar Novo Comando

1. Adicionar comando ao `AGENT_CONFIGS` no `orchestrator.ts`
2. Criar script correspondente se necessário
3. Documentar o comando

## Troubleshooting

### Agente não encontrado
```
Erro: Agente desconhecido: xyz
Solução: Verifique se o agente existe em /agents/xyz/agent.md
```

### Comando não encontrado
```
Erro: Comando "xyz" não encontrado para o agente backend
Solução: Use `npm run agent:start backend` para ver comandos disponíveis
```

### Tarefa falhou
```
Erro ao executar tarefa: [mensagem]
Solução: Verifique .agent-reports.json para detalhes
```

## Recursos

- [PLAN.md](./PLAN.md) - Plano detalhado de implementação
- [SPEC.md](./SPEC.md) - Especificação técnica
- [CLAUDE.md](./CLAUDE.md) - Instruções gerais do projeto

## Contribuindo

Para contribuir com o sistema de agentes:

1. Leia as instruções do agente relevante
2. Faça mudanças conforme necessário
3. Teste as mudanças
4. Documente em um PR
5. Submeta para review

---

**Nota**: Este sistema é uma ferramenta de auxílio. Desenvolvedores devem sempre review e validar o trabalho dos agentes.
