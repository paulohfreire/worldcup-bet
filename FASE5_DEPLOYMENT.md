# Fase 5: Deployment - Plano de Implementação

## Contexto

Esta fase prepara a aplicação para deployment em produção usando containers Docker, Prisma migrations, e CI/CD pipeline. Estas mudanças permitem deployment consistente e escalável.

## Objetivos

1. ✅ Criar Dockerfile para containerização da aplicação
2. ✅ Criar docker-compose.yml para orquestração de serviços
3. ✅ Configurar Next.js para output standalone (já feito na Fase 1)
4. ✅ Implementar Prisma migrations (em vez de db push)
5. ✅ Criar templates de environment para staging/produção
6. ✅ Configurar CI/CD pipeline no GitHub Actions
7. ✅ Documentar processo de deployment

---

## Tarefa 5.1: Criar Dockerfile

### Novo Arquivo: `Dockerfile`

**Implementação:**
```dockerfile
# Build stage
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Benefícios:**
- Multi-stage build para imagem final pequena
- Build otimizado com caching de dependencies
- Security best practices (non-root user)
- Imagem Alpine leve

---

## Tarefa 5.2: Criar docker-compose.yml

### Novo Arquivo: `docker-compose.yml`

**Implementação:**
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - JWT_SECRET=${JWT_SECRET}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  db:
    image: postgres:15-alpine
    container_name: worldcup_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:
```

### Novo Arquivo: `docker-compose.dev.yml`

**Implementação:**
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:devpassword@db:5432/worldcup_dev
      - JWT_SECRET=dev-jwt-secret-change-in-production
      - ALLOWED_ORIGINS=http://localhost:3000
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    command: npm run dev
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    container_name: worldcup_dev_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: worldcup_dev
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_dev_data:
```

---

## Tarefa 5.3: Implementar Prisma Migrations

### Criar Migration Inicial

**Comando:**
```bash
npx prisma migrate dev --name init --create-only
```

### Arquivo: `prisma/migrations/.../migration.sql`

**Conteúdo:**
```sql
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "flagUrl" TEXT NOT NULL,
    "group" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "group" TEXT,
    "order" INTEGER NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "nextMatchId" TEXT,
    "nextMatchSlot" TEXT,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "awayScore" INTEGER NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Match_nextMatchId_idx" ON "Match"("nextMatchId");

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_userId_matchId_key" ON "Prediction"("userId", "matchId");

-- CreateIndex
CREATE INDEX "Prediction_userId_idx" ON "Prediction"("userId");

-- CreateIndex
CREATE INDEX "Prediction_matchId_idx" ON "Prediction"("matchId");

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_matchId_fkey" FOREIGN KEY("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY("homeTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY("awayTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_nextMatchId_fkey" FOREIGN KEY("nextMatchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_matchId_fkey" FOREIGN KEY("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### Atualizar `package.json`

**Adicionar scripts:**
```json
{
  "scripts": {
    "docker:build": "docker-compose build",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "docker:dev": "docker-compose -f docker-compose.dev.yml up",
    "prisma:migrate:dev": "prisma migrate dev",
    "prisma:migrate:deploy": "prisma migrate deploy",
    "prisma:migrate:reset": "prisma migrate reset --force",
    "prisma:generate": "prisma generate",
    "db:seed": "npx prisma db seed"
  }
}
```

---

## Tarefa 5.4: Criar Environment Templates

### Novo Arquivo: `.env.production`

```env
# Production Environment Configuration
NODE_ENV=production

# Database
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}

# JWT Secret - MUST be set (generate with: openssl rand -base64 32)
JWT_SECRET=your-production-jwt-secret-minimum-32-characters-long

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database Credentials (for docker-compose)
POSTGRES_PASSWORD=your-secure-postgres-password
POSTGRES_DB=worldcup_production
```

### Novo Arquivo: `.env.staging`

```env
# Staging Environment Configuration
NODE_ENV=production

# Database
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}

# JWT Secret
JWT_SECRET=your-staging-jwt-secret-minimum-32-characters

# CORS Origins
ALLOWED_ORIGINS=https://staging.yourdomain.com

# Database Credentials
POSTGRES_PASSWORD=staging-postgres-password
POSTGRES_DB=worldcup_staging
```

### Novo Arquivo: `.env.docker`

```env
# Docker Environment Configuration
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:devpassword@db:5432/worldcup_dev

# JWT Secret
JWT_SECRET=dev-jwt-secret-not-for-production

# CORS Origins
ALLOWED_ORIGINS=http://localhost:3000

# Database Credentials
POSTGRES_PASSWORD=devpassword
POSTGRES_DB=worldcup_dev
```

### Atualizar `.dockerignore`

**Novo arquivo:**
```dockerignore
# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage
.nyc_output

# Next.js
.next/
out/
build
dist

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.staging

# Git
.git
.gitignore
.github

# Documentation
*.md
!README.md

# IDE
.vscode
.idea
*.swp
*.swo
*~

# Docker
Dockerfile
docker-compose*.yml
.dockerignore
```

---

## Tarefa 5.5: Configurar CI/CD Pipeline

### Novo Arquivo: `.github/workflows/deploy.yml`

**Implementação:**
```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Build Docker image
        run: docker build -t worldcup-bet:${{ github.sha }} .

  deploy-production:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build Docker image
        run: |
          docker build -t ghcr.io/paulohfreire/worldcup-bet:latest .
          docker tag worldcup-bet:latest ghcr.io/paulohfreire/worldcup-bet:${{ github.sha }}

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Push to Registry
        run: |
          docker push ghcr.io/paulohfreire/worldcup-bet:latest
          docker push ghcr.io/paulohfreire/worldcup-bet:${{ github.sha }}

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script: |
            cd /app/worldcup-bet
            docker-compose pull
            docker-compose up -d --build
            docker system prune -f

      - name: Run database migrations
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script: |
            cd /app/worldcup-bet
            docker-compose exec -T app npx prisma migrate deploy
```

### Novo Arquivo: `.github/workflows/deploy-staging.yml`

**Implementação:**
```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - staging
  workflow_dispatch:

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build Docker image
        run: |
          docker build -t ghcr.io/paulohfreire/worldcup-bet:staging .
          docker tag worldcup-bet:staging ghcr.io/paulohfreire/worldcup-bet:staging-${{ github.sha }}

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Push to Registry
        run: |
          docker push ghcr.io/paulohfreire/worldcup-bet:staging
          docker push ghcr.io/paulohfreire/worldcup-bet:staging-${{ github.sha }}

      - name: Deploy to staging server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /app/worldcup-bet-staging
            docker-compose pull
            docker-compose up -d --build
            docker system prune -f

      - name: Run database migrations
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /app/worldcup-bet-staging
            docker-compose exec -T app npx prisma migrate deploy
```

---

## Tarefa 5.6: Criar Scripts de Deployment

### Novo Arquivo: `scripts/deploy-production.sh`

**Implementação:**
```bash
#!/bin/bash

set -e

echo "🚀 Starting deployment to production..."

# Load environment variables
if [ -f .env.production ]; then
  export $(cat .env.production | xargs)
else
  echo "❌ .env.production not found"
  exit 1
fi

# Build Docker image
echo "📦 Building Docker image..."
docker-compose -f docker-compose.yml build

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose -f docker-compose.yml run --rm app npx prisma migrate deploy

# Seed database (optional, only for first deployment)
if [ "$SEED_DATABASE" = "true" ]; then
  echo "🌱 Seeding database..."
  docker-compose -f docker-compose.yml run --rm app npx prisma db seed
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.yml down

# Start new containers
echo "▶️  Starting new containers..."
docker-compose -f docker-compose.yml up -d

echo "✅ Deployment to production completed!"
echo "🔍 Check logs with: docker-compose logs -f"
```

### Novo Arquivo: `scripts/deploy-staging.sh`

**Implementação:**
```bash
#!/bin/bash

set -e

echo "🚀 Starting deployment to staging..."

# Load environment variables
if [ -f .env.staging ]; then
  export $(cat .env.staging | xargs)
else
  echo "❌ .env.staging not found"
  exit 1
fi

# Build Docker image
echo "📦 Building Docker image..."
docker-compose -f docker-compose.yml build

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose -f docker-compose.yml run --rm app npx prisma migrate deploy

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.yml down

# Start new containers
echo "▶️  Starting new containers..."
docker-compose -f docker-compose.yml up -d

echo "✅ Deployment to staging completed!"
echo "🔍 Check logs with: docker-compose logs -f"
```

---

## Tarefa 5.7: Documentar Deployment

### Atualizar `README.md`

**Adicionar seção "Deployment":**
```markdown
## Deployment

### Development with Docker

```bash
# Build and start services
docker-compose -f docker-compose.dev.yml up

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Production Deployment

#### Manual Deployment

```bash
# Create .env.production file
cp .env.production.example .env.production

# Edit .env.production with your configuration
nano .env.production

# Deploy
bash scripts/deploy-production.sh
```

#### Automated Deployment (CI/CD)

The application uses GitHub Actions for automated deployment:

- **Staging**: Push to `staging` branch
- **Production**: Push to `main` branch

#### Required GitHub Secrets

For CI/CD deployment, configure these secrets in your repository:

- `DEPLOY_HOST`: Production server hostname
- `DEPLOY_USER`: SSH username for production server
- `DEPLOY_SSH_KEY`: SSH private key for production server
- `STAGING_HOST`: Staging server hostname
- `STAGING_USER`: SSH username for staging server
- `STAGING_SSH_KEY`: SSH private key for staging server
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Environment Variables

#### Required Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens (minimum 32 characters)
- `NODE_ENV`: Environment mode (`development` or `production`)

#### Optional Variables

- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins
- `POSTGRES_PASSWORD`: PostgreSQL password (for docker-compose)
- `POSTGRES_DB`: PostgreSQL database name (for docker-compose)

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name describe_change

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset --force
```

### Monitoring

#### Check Application Health

```bash
# Health check endpoint
curl http://localhost:3000/api/health

# Docker container status
docker-compose ps

# View logs
docker-compose logs -f app
```

#### Database Connection

```bash
# Connect to database
docker-compose exec db psql -U postgres -d worldcup_production

# Check database size
docker-compose exec db psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('worldcup_production'));"

# Backup database
docker-compose exec db pg_dump -U postgres worldcup_production > backup.sql
```

### Scaling

#### Vertical Scaling

Edit `docker-compose.yml` to increase resources:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

#### Horizontal Scaling

For horizontal scaling, consider using a load balancer:

```yaml
services:
  app:
    deploy:
      replicas: 3
    # ... other config
```

### Rollback

```bash
# Stop current version
docker-compose down

# Pull previous version (if tagged)
docker pull ghcr.io/paulohfreire/worldcup-bet:previous-tag

# Start previous version
docker-compose up -d
```
```

### Criar Novo Arquivo: `DEPLOYMENT.md`

**Conteúdo:**
```markdown
# Deployment Guide

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- PostgreSQL 15+
- Node.js 18+ (for local development)
- SSH access to production server (for CI/CD)
- GitHub account (for CI/CD)

## Quick Start

### Local Development with Docker

```bash
# Clone repository
git clone https://github.com/paulohfreire/worldcup-bet.git
cd worldcup-bet

# Create environment file
cp .env.docker .env

# Start services
docker-compose up

# Access application
open http://localhost:3000
```

## Production Deployment

### Option 1: Manual Deployment

1. **Prepare Server**

```bash
# SSH into server
ssh user@yourserver.com

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo apt-get install docker-compose-plugin

# Clone repository
git clone https://github.com/paulohfreire/worldcup-bet.git
cd worldcup-bet
```

2. **Configure Environment**

```bash
# Copy environment template
cp .env.production.example .env.production

# Edit configuration
nano .env.production
```

Required changes:
- Set secure `JWT_SECRET` (generate: `openssl rand -base64 32`)
- Set `DATABASE_URL` with proper connection string
- Set `ALLOWED_ORIGINS` with your domain(s)

3. **Deploy Application**

```bash
# Make deploy script executable
chmod +x scripts/deploy-production.sh

# Run deployment
./scripts/deploy-production.sh
```

### Option 2: CI/CD Deployment

1. **Configure GitHub Secrets**

Go to: Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

| Secret Name | Description | Required |
|-------------|-------------|-----------|
| `DEPLOY_HOST` | Production server hostname | Yes |
| `DEPLOY_USER` | SSH username for production server | Yes |
| `DEPLOY_SSH_KEY` | SSH private key for production server | Yes |
| `STAGING_HOST` | Staging server hostname | Yes (optional) |
| `STAGING_USER` | SSH username for staging server | Yes (optional) |
| `STAGING_SSH_KEY` | SSH private key for staging server | Yes (optional) |

2. **Enable Workflows**

The workflows are automatically enabled when pushing to the repository.

3. **Deploy**

- **Staging**: Push to `staging` branch
- **Production**: Push to `main` branch

```bash
# Deploy to staging
git checkout staging
git merge feature-branch
git push origin staging

# Deploy to production
git checkout main
git merge staging
git push origin main
```

## Database Setup

### Initial Migration

```bash
# Create initial migration
npx prisma migrate dev --name init

# Apply migration
npx prisma migrate deploy
```

### Seed Database

```bash
# Run seed script
npx prisma db seed
```

### Backup Database

```bash
# Backup from container
docker-compose exec db pg_dump -U postgres worldcup_production > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup to remote location
docker-compose exec db pg_dump -U postgres worldcup_production | gzip > backup.sql.gz
```

### Restore Database

```bash
# Restore from backup
docker-compose exec -T db psql -U postgres worldcup_production < backup.sql

# Restore from gzipped backup
gunzip < backup.sql.gz | docker-compose exec -T db psql -U postgres worldcup_production
```

## Troubleshooting

### Application Won't Start

```bash
# Check logs
docker-compose logs app

# Check container status
docker-compose ps

# Restart containers
docker-compose restart
```

### Database Connection Issues

```bash
# Check if database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Test connection
docker-compose exec db psql -U postgres -d worldcup_production -c "SELECT 1"
```

### Migration Failures

```bash
# Reset database (development only)
docker-compose down -v
docker-compose up -d
docker-compose exec app npx prisma migrate reset --force

# Resolve migration conflicts
npx prisma migrate resolve --applied "migration-name"
```

### Out of Memory Issues

```bash
# Check Docker stats
docker stats

# Increase memory limit in docker-compose.yml
services:
  app:
    mem_limit: 2g
```

## Monitoring

### Health Checks

```bash
# Application health
curl http://yourdomain.com/api/health

# Database health
docker-compose exec db pg_isready -U postgres
```

### Log Monitoring

```bash
# Follow application logs
docker-compose logs -f app

# Follow database logs
docker-compose logs -f db

# Export logs to file
docker-compose logs > app.log
```

### Performance Monitoring

Consider setting up:
- [New Relic](https://newrelic.com/) for APM
- [Sentry](https://sentry.io/) for error tracking
- [Grafana](https://grafana.com/) for metrics
- [Prometheus](https://prometheus.io/) for monitoring

## Security Best Practices

1. **Always use HTTPS in production**
2. **Rotate secrets regularly** (especially JWT_SECRET)
3. **Use strong passwords** for database
4. **Enable firewall** on server
5. **Regular updates** of Docker images
6. **Backup database** regularly
7. **Monitor logs** for suspicious activity
8. **Use SSH keys** instead of passwords

## Support

For issues or questions:
- GitHub Issues: https://github.com/paulohfreire/worldcup-bet/issues
- Email: support@example.com
```

---

## Ordem de Implementação

1. ✅ Criar `Dockerfile` - Containerização da aplicação
2. ✅ Criar `docker-compose.yml` - Orquestração de serviços
3. ✅ Criar `docker-compose.dev.yml` - Ambiente de desenvolvimento
4. ✅ Criar `.dockerignore` - Otimizar Docker build
5. ✅ Criar migration inicial do Prisma
6. ✅ Atualizar `package.json` - Adicionar scripts de Docker/migrations
7. ✅ Criar environment templates (.env.production, .env.staging, .env.docker)
8. ✅ Criar CI/CD workflows (.github/workflows/deploy.yml, deploy-staging.yml)
9. ✅ Criar scripts de deployment (deploy-production.sh, deploy-staging.sh)
10. ✅ Criar `DEPLOYMENT.md` - Documentação completa
11. ✅ Atualizar `README.md` - Adicionar seção de deployment

---

## Testes de Verificação

### 1. Testar Build Local
```bash
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
curl http://localhost:3000/api/health
```

### 2. Testar Production Build
```bash
docker-compose build
docker-compose up
curl http://localhost:3000/api/health
```

### 3. Testar Migrations
```bash
docker-compose run --rm app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

### 4. Testar CI/CD Pipeline
```bash
git checkout -b test-deploy
git commit --allow-empty -m "Test CI/CD"
git push origin test-deploy
# Verificar Actions tab no GitHub
```

### 5. Testar Deployment Manual
```bash
bash scripts/deploy-production.sh
docker-compose ps
curl http://localhost:3000/api/health
```

---

## Checklist de Conclusão

- [ ] Dockerfile criado e testado
- [ ] docker-compose.yml criado e testado
- [ ] docker-compose.dev.yml criado e testado
- [ ] .dockerignore criado
- [ ] Migration inicial do Prisma criada
- [ ] Scripts de Docker adicionados ao package.json
- [ ] Environment templates criados (.env.production, .env.staging, .env.docker)
- [ ] CI/CD workflow para produção criado
- [ ] CI/CD workflow para staging criado
- [ ] Scripts de deployment criados (deploy-production.sh, deploy-staging.sh)
- [ ] DEPLOYMENT.md criado com documentação completa
- [ ] README.md atualizado com seção de deployment
- [ ] Health check endpoint implementado (/api/health)
- [ ] Build local com Docker funciona
- [ ] Migrations funcionam corretamente
- [ ] CI/CD pipeline funciona no GitHub
- [ ] Documentação completa e clara

---

## Arquivos Envolvidos

### Novos Arquivos:
- `Dockerfile`
- `docker-compose.yml`
- `docker-compose.dev.yml`
- `.dockerignore`
- `.env.production`
- `.env.staging`
- `.env.docker`
- `.github/workflows/deploy.yml`
- `.github/workflows/deploy-staging.yml`
- `scripts/deploy-production.sh`
- `scripts/deploy-staging.sh`
- `DEPLOYMENT.md`
- `prisma/migrations/*/migration.sql` (migration files)

### Arquivos a Modificar:
- `package.json` - Adicionar scripts de Docker e migrations
- `README.md` - Adicionar seção de deployment
- `src/app/api/health/route.ts` - Criar se não existir
