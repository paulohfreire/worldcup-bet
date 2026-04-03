# 🏗️ Infra Agent

## Propósito
Agente especializado em configuração de infraestrutura, setup inicial e configurações de ambiente para o projeto World Cup Betting Pool.

## Responsabilidades

### 1. Setup Inicial do Projeto
- Inicializar projeto Next.js com TypeScript
- Configurar estrutura de diretórios
- Instalar dependências principais (Prisma, bcryptjs, jsonwebtoken, zod, jsPDF)
- Configurar TypeScript strict mode

### 2. Configuração de Ambiente
- Criar arquivo `.env` com todas as variáveis necessárias
- Criar `.env.example` como template
- Configurar .gitignore para arquivos sensíveis

### 3. Configuração do Prisma
- Inicializar Prisma (`npx prisma init`)
- Configurar connection string do PostgreSQL
- Gerar Prisma client
- Configurar script de seed no package.json

### 4. CI/CD
- Criar workflows do GitHub Actions
- Configurar testes automatizados
- Configurar build e deploy
- Configurar linters (ESLint, Prettier)

### 5. Docker (opcional)
- Criar Dockerfile para produção
- Criar docker-compose para desenvolvimento
- Configurar volumes e networks

## Ferramentas e Comandos

### Inicialização
```bash
npx create-next-app@latest worldcup-bet --typescript --tailwind --eslint --app --src-dir
cd worldcup-bet
```

### Instalação de Dependências
```bash
# Core
npm install @prisma/client bcryptjs jsonwebtoken jsPDF

# Dev dependencies
npm install -D prisma @types/bcryptjs @types/jsonwebtoken

# Validation
npm install zod
```

### Prisma Setup
```bash
npx prisma init
npx prisma db push
npx prisma generate
```

## Estrutura de Diretórios a Criar
```
/src
  /app
  /components
  /lib
  /types
  /api
/prisma
/scripts
/public
```

## Checklist de Tarefas

### Fase 1: Setup Básico
- [ ] Criar projeto Next.js
- [ ] Configurar TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Configurar ESLint

### Fase 2: Dependências
- [ ] Instalar Prisma
- [ ] Instalar bcryptjs
- [ ] Instalar jsonwebtoken
- [ ] Instalar jsPDF
- [ ] Instalar zod
- [ ] Instalar tipos TypeScript

### Fase 3: Ambiente
- [ ] Criar .env
- [ ] Criar .env.example
- [ ] Atualizar .gitignore

### Fase 4: Prisma
- [ ] npx prisma init
- [ ] Configurar DATABASE_URL
- [ ] npx prisma generate

### Fase 5: CI/CD
- [ ] Criar workflow de testes
- [ ] Criar workflow de lint
- [ ] Criar workflow de build

### Fase 6: Scripts
- [ ] Adicionar script de seed ao package.json
- [ ] Configurar script de dev
- [ ] Configurar script de build

## Convenções de Commit
```
infra(<scope>): <descrição>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Exemplos de Commits
- `infra(init): inicializar projeto Next.js com TypeScript`
- `infra(prisma): configurar Prisma e connection string`
- `infra(deps): instalar dependências principais`
- `infra(ci): configurar GitHub Actions workflow`

## Comunicação com Outros Agentes
1. Após concluir setup inicial, notificar **Backend Agent** para criar schema
2. Após configurar Prisma, notificar **Backend Agent** para criar seed script
3. Após configurar CI/CD, notificar **Test Agent** para criar testes

## Arquivos Chave a Criar/Modificar
- `package.json`
- `tsconfig.json`
- `.env`
- `.env.example`
- `.gitignore`
- `prisma/schema.prisma` (criação inicial vazia)
- `.github/workflows/*.yml`

## Variáveis de Ambiente Necessárias
```
DATABASE_URL=postgresql://user:password@localhost:5432/worldcup_bet?schema=public
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Observações Importantes
- Sempre usar `--save-dev` para dependências de desenvolvimento
- Nunca commitar o arquivo `.env`
- Verificar se o PostgreSQL está rodando antes de executar comandos do Prisma
- Testar o servidor de desenvolvimento após cada configuração
