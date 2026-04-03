#!/bin/bash

# Script para mergear uma pull request
# Uso: ./merge-pr.sh <pr-number>
# Exemplo: ./merge-pr.sh 123

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ -z "$1" ]; then
    echo -e "${RED}❌ Uso: ./merge-pr.sh <pr-number>${NC}"
    echo ""
    echo "Exemplo:"
    echo "  ./merge-pr.sh 123"
    exit 1
fi

PR_NUMBER=$1

echo -e "${YELLOW}🔍 Verificando status da PR #$PR_NUMBER...${NC}"

# Obter decisão de review
REVIEW_DECISION=$(gh pr view $PR_NUMBER --json reviewDecision --jq '.reviewDecision')

if [ "$REVIEW_DECISION" = "APPROVED" ]; then
    echo -e "${GREEN}✅ PR está aprovada${NC}"
else
    echo -e "${YELLOW}⚠️  Status do review: $REVIEW_DECISION${NC}"

    # Perguntar se quer continuar
    read -p "Deseja continuar mesmo assim? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}❌ Merge cancelado${NC}"
        exit 0
    fi
fi

echo -e "${YELLOW}🔀 Fazendo merge da PR #$PR_NUMBER...${NC}"

# Merge com squash e delete branch
gh pr merge $PR_NUMBER --squash --delete-branch

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PR #$PR_NUMBER mergeada com sucesso!${NC}"

    echo -e "${YELLOW}🔄 Atualizando branch main local...${NC}"
    git checkout main
    git pull origin main

    echo -e "${GREEN}✅ Branch main atualizada${NC}"
    echo ""
    echo -e "${YELLOW}📋 Lembre-se:${NC}"
    echo "   1. Mover issue correspondente para 'Done' no GitHub Projects"
    echo "   2. Notificar equipe sobre a mudança"
    echo ""
else
    echo -e "${RED}❌ Erro ao mergear PR${NC}"
    exit 1
fi
