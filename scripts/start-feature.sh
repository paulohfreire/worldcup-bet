#!/bin/bash

# Script para criar uma nova branch de feature
# Uso: ./scripts/start-feature.sh <tipo>/<descrição>
# Exemplo: ./scripts/start-feature.sh backend/auth

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ -z "$1" ]; then
    echo -e "${RED}❌ Uso: ./start-feature.sh <tipo>/<descrição>${NC}"
    echo ""
    echo "Exemplos:"
    echo "  ./start-feature.sh backend/auth"
    echo "  ./start-feature.sh frontend/navbar"
    echo "  ./start-feature.sh test/scoring"
    exit 1
fi

BRANCH_NAME=$1

# Validar formato do branch
if [[ ! $BRANCH_NAME =~ ^[a-z]+/[a-z0-9-]+$ ]]; then
    echo -e "${RED}❌ Formato de branch inválido${NC}"
    echo "Use: <tipo>/<descrição>"
    echo "Tipos válidos: infra, backend, frontend, test"
    exit 1
fi

# Extrair tipo do branch
BRANCH_TYPE=$(echo $BRANCH_NAME | cut -d'/' -f1)

# Verificar se o tipo é válido
if [[ ! "infra backend frontend test" =~ $BRANCH_TYPE ]]; then
    echo -e "${RED}❌ Tipo de branch inválido: $BRANCH_TYPE${NC}"
    echo "Tipos válidos: infra, backend, frontend, test"
    exit 1
fi

echo -e "${YELLOW}🔄 Atualizando branch main...${NC}"
git checkout main
git pull origin main

echo -e "${YELLOW}🌿 Criando nova branch: $BRANCH_NAME${NC}"
git checkout -b $BRANCH_NAME

echo -e "${GREEN}✅ Branch $BRANCH_NAME criada com sucesso!${NC}"
echo ""
echo -e "${YELLOW}📝 Lembre-se:${NC}"
echo "   1. Mover issue correspondente para 'In Progress' no GitHub Projects"
echo "   2. Começar a implementação"
echo "   3. Fazer commits com mensagens convencionais"
echo "   4. Push com: git push -u origin $BRANCH_NAME"
echo ""
