#!/bin/bash

# Script para configurar GitHub CLI no Git Bash do Windows
# Resolve problemas de interação com terminal

set -e

echo "🔧 Configurando GitHub CLI para Git Bash..."
echo ""

# Verifica se GitHub CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI não está instalado!"
    echo ""
    echo "Para instalar, abra o PowerShell e execute:"
    echo "  winget install --id GitHub.cli"
    echo ""
    echo "Ou baixe de: https://cli.github.com/"
    exit 1
fi

echo "✅ GitHub CLI encontrado"
echo ""

# Verifica se winpty está disponível
if command -v winpty &> /dev/null; then
    echo "✅ winpty disponível - Criando wrapper..."
    echo ""
else
    echo "⚠️  winpty não encontrado - Usando fallback..."
    echo ""
fi

# Verifica se já está logado
echo "Verificando status de login..."
if gh auth status &> /dev/null; then
    echo "✅ Você já está logado!"
    echo ""
    gh auth status
else
    echo "ℹ️  Nenhum login encontrado"
    echo ""
    echo "Para fazer login:"
    echo ""
    echo "1️⃣  Abra o PowerShell (não o Git Bash)"
    echo "2️⃣  Execute: pwsh scripts/github-login.ps1"
    echo "3️⃣  Siga as instruções no navegador"
    echo "4️⃣  Depois volte ao Git Bash e use normalmente"
    echo ""
    echo "OU execute:"
    echo "  npm run gh:login"
    echo ""
fi

# Verifica se o wrapper funciona
echo "Testando comando gh..."
if gh --version &> /dev/null; then
    echo "✅ GitHub CLI está funcionando!"
    echo ""
    echo "Comandos disponíveis:"
    echo "  gh auth status     - Ver status de login"
    echo "  gh issue list     - Listar issues"
    echo "  npm run board:create - Criar issues do projeto"
    echo ""
else
    echo "❌ GitHub CLI não está funcionando corretamente"
    exit 1
fi

echo "🎉 Configuração concluída!"
