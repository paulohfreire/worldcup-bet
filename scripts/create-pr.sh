#!/bin/bash

# Script para criar uma pull request
# Uso: ./create-pr.sh <pr-title> <issue-number>
# Exemplo: ./create-pr.sh "feat(auth): implementar registro" 5

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ -z "$1" ] || [ -z "$2" ]; then
    echo -e "${RED}❌ Uso: ./create-pr.sh <pr-title> <issue-number>${NC}"
    echo ""
    echo "Exemplo:"
    echo "  ./create-pr.sh \"feat(auth): implementar registro\" 5"
    exit 1
fi

PR_TITLE=$1
ISSUE_NUMBER=$2
CURRENT_BRANCH=$(git branch --show-current)

# Verificar se não está na main
if [ "$CURRENT_BRANCH" = "main" ]; then
    echo -e "${RED}❌ Você está na branch main. Crie uma feature branch primeiro.${NC}"
    exit 1
fi

echo -e "${YELLOW}📤 Verificando se branch existe no remoto...${NC}"

# Verificar se branch existe no remoto
if ! git rev-parse --verify origin/$CURRENT_BRANCH >/dev/null 2>&1; then
    echo -e "${YELLOW}📤 Branch não existe no remoto. Fazendo push...${NC}"
    git push -u origin $CURRENT_BRANCH
else
    echo -e "${GREEN}✅ Branch já existe no remoto${NC}"
fi

echo -e "${YELLOW}📝 Criando pull request...${NC}"

# Criar PR usando gh CLI
PR_BODY="## Summary
Implementação descrita na issue #$ISSUE_NUMBER

## Changes
- Descrição das mudanças principais

## Test Plan
- [ ] Código compila sem erros (\`npm run build\`)
- [ ] Lint passa sem erros (\`npm run lint\`)
- [ ] Testes passam (\`npm test\`)
- [ ] Teste manual realizado
- [ ] Segue o plano em PLAN.md
- [ ] Não introduz regressões

## Related Issues
Fixes #$ISSUE_NUMBER

🤖 Generated with [Claude Code](https://claude.com/claude-code)"

# Criar PR
gh pr create \
  --title "$PR_TITLE" \
  --body "$PR_BODY" \
  --base main \
  --head $CURRENT_BRANCH

if [ $? -eq 0 ]; then
    # Obter número da PR
    PR_NUMBER=$(gh pr list --head $CURRENT_BRANCH --json number --jq '.[0].number')

    echo -e "${GREEN}✅ PR #$PR_NUMBER criada com sucesso!${NC}"
    echo -e "${YELLOW}📋 Issue #$ISSUE_NUMBER vinculada à PR${NC}"
    echo ""
    echo -e "${YELLOW}🔗 Link da PR:${NC}"
    echo "   $(gh pr view $PR_NUMBER --web 2>&1 | grep -o 'https://github.com/[^ ]*' || echo 'PR aberta no GitHub')"
    echo ""
    echo -e "${YELLOW}📝 Próximos passos:${NC}"
    echo "   1. Aguardar review"
    echo "   2. Implementar feedback se necessário"
    echo "   3. Aguardar aprovação"
    echo "   4. Mergear com: ./merge-pr.sh $PR_NUMBER"
    echo ""
else
    echo -e "${RED}❌ Erro ao criar PR${NC}"
    exit 1
fi
