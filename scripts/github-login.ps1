# GitHub CLI Login Helper para Windows
# Este script facilita o login do GitHub CLI no Windows

Write-Host "🔑 GitHub CLI Login Helper" -ForegroundColor Cyan
Write-Host ""

# Verifica se GitHub CLI está instalado
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue

if (-not $ghInstalled) {
    Write-Host "❌ GitHub CLI não está instalado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instale usando:" -ForegroundColor Yellow
    Write-Host "  winget install --id GitHub.cli" -ForegroundColor Green
    Write-Host "Ou baixe de: https://cli.github.com/" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ GitHub CLI encontrado" -ForegroundColor Green
Write-Host ""

# Verifica se já está logado
try {
    $status = gh auth status 2>&1
    if ($status -match "Logged in") {
        Write-Host "ℹ️  Você já está logado no GitHub!" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Status atual:" -ForegroundColor Yellow
        Write-Host $status -ForegroundColor White
        Write-Host ""
        $response = Read-Host "Quer fazer login com outra conta? (S/N)"
        if ($response -ne "S" -and $response -ne "s") {
            Write-Host "✅ Usando login existente" -ForegroundColor Green
            exit 0
        }
    }
} catch {
    Write-Host "ℹ️  Nenhum login encontrado" -ForegroundColor Cyan
    Write-Host ""
}

# Faz o login
Write-Host "🚀 Iniciando processo de login..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Instruções:" -ForegroundColor Cyan
Write-Host "  1. Selecione GitHub.com" -ForegroundColor White
Write-Host "  2. Selecione 'Login with a web browser'" -ForegroundColor White
Write-Host "  3. Pressione Enter para abrir o navegador" -ForegroundColor White
Write-Host "  4. Copie e cole o código de ativação" -ForegroundColor White
Write-Host "  5. Autorize o aplicativo no GitHub" -ForegroundColor White
Write-Host ""

try {
    gh auth login
    Write-Host ""
    Write-Host "✅ Login realizado com sucesso!" -ForegroundColor Green
    Write-Host ""

    # Mostra o status final
    gh auth status
} catch {
    Write-Host ""
    Write-Host "❌ Erro ao fazer login" -ForegroundColor Red
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Pronto! Você pode agora usar o GitHub CLI no Git Bash também." -ForegroundColor Green
