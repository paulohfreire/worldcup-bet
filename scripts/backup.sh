#!/bin/bash

# Script de backup automatizado do PostgreSQL
# Uso: ./scripts/backup.sh [env=production|staging]

set -e

# Configurações
ENV="${1:-development}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
RETENTION_DAYS=7
MAX_BACKUPS=14

# Cores do backup por ambiente
if [ "$ENV" = "production" ]; then
  DB_NAME="worldcup_production"
  BACKUP_RETENTION=30
elif [ "$ENV" = "staging" ]; then
  DB_NAME="worldcup_staging"
  BACKUP_RETENTION=14
else
  DB_NAME="worldcup_bet"
  BACKUP_RETENTION=7
fi

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

echo "🗄️  Iniciando backup do PostgreSQL ($ENV)..."
echo "📅 Timestamp: $TIMESTAMP"
echo "🗄️  Banco: $DB_NAME"

# Obter DATABASE_URL se existir, senão usar defaults
if [ -z "$DATABASE_URL" ]; then
  # Tentar carregar do .env.$ENV se existir
  if [ -f ".env.$ENV" ]; then
    export $(grep -v '^#' .env.$ENV | xargs)
  fi

  # Extrair informações da DATABASE_URL se disponível
  if [ -n "$DATABASE_URL" ]; then
    # Parse DATABASE_URL para obter host, porta e usuário
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_USER=$(echo $DATABASE_URL | sed -n 's/.*\/\/\([^:]*\):.*/\1/p')
  else
    echo "⚠️  DATABASE_URL não definido, usando defaults locais"
    DB_HOST="localhost"
    DB_PORT="5432"
    DB_USER="postgres"
  fi
fi

# Nome do arquivo de backup
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

echo "💾 Criando backup..."

# Executar backup
if [ "$ENV" = "production" ] || [ "$ENV" = "staging" ]; then
  # Em produção/staging, usa docker exec
  CONTAINER_NAME="${ENV}-db-1"
  docker exec "$CONTAINER_NAME" pg_dump -U postgres "$DB_NAME" | gzip > "$BACKUP_FILE"
else
  # Em desenvolvimento, usa pg_dump direto
  pg_dump -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" "$DB_NAME" | gzip > "$BACKUP_FILE"
fi

# Verificar se backup foi criado com sucesso
if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Erro: Arquivo de backup não foi criado"
  exit 1
fi

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "✅ Backup criado: $BACKUP_FILE ($BACKUP_SIZE)"

# Limpar backups antigos
echo "🧹 Limpando backups antigos..."

find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -type f -mtime +${BACKUP_RETENTION} -delete

# Verificar número de backups restantes
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -type f | wc -l)

if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS" ]; then
  echo "🗑️  Removendo backups extras ($BACKUP_COUNT/$MAX_BACKUPS mantidos)..."
  find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -type f -printf '%T@ %p\n' | \
    sort -n | head -n -$(($BACKUP_COUNT - MAX_BACKUPS)) | cut -d' ' -f2- | xargs rm -f
fi

# Lista backups restantes
echo "📋 Backups disponíveis:"
ls -lh "$BACKUP_DIR" | grep "${DB_NAME}.*\.sql\.gz" | tail -5

echo "🎉 Backup concluído com sucesso!"

# Notificar sobre backup em produção
if [ "$ENV" = "production" ]; then
  # Opcional: Enviar notificação (SLACK, EMAIL, etc.)
  # curl -X POST "$SLACK_WEBHOOK" -d "{\"text\": \"✅ Backup do banco $DB_NAME criado: $BACKUP_FILE\"}"
  :
fi

exit 0