# 🔧 GitHub CLI no Windows - Solução para Login no Git Bash

## 🚨 Problema

Quando você tenta usar `gh auth login` no Git Bash, aparece o erro:
```
could not prompt: incorrect function.
You appear to be running in MinTTY without pseudo terminal support.
```

## ✅ Soluções

### Solução 1: Usar PowerShell (Mais Fácil)

1. **Abra o PowerShell** (não o Git Bash)
   - Pressione `Win + X` e selecione "Windows PowerShell"
   - OU digite `powershell` no menu Iniciar

2. **Navegue até o diretório do projeto**
   ```powershell
   cd C:\Users\paulo\Repos\worldcup-bet
   ```

3. **Faça o login no GitHub CLI**
   ```powershell
   gh auth login
   ```

4. **Siga as instruções:**
   - Selecione `GitHub.com`
   - Selecione `Login with a web browser`
   - Pressione Enter para abrir o navegador
   - Copie e cole o código de ativação
   - Autorize o aplicativo

5. **Volte para o Git Bash** e use o gh CLI normalmente

### Solução 2: Usar Command Prompt

1. **Abra o CMD** (Prompt de Comando)
   - Pressione `Win + R`, digite `cmd` e pressione Enter

2. **Siga os mesmos passos da Solução 1** usando o CMD

### Solução 3: Forçar Browser Authentication no Git Bash

Se você quiser continuar usando o Git Bash, pode forçar a autenticação via navegador:

1. **Abra o Git Bash**

2. **Execute com flag de browser:**
   ```bash
   gh auth login --web
   ```

3. Isso deve abrir o navegador automaticamente

4. **Se ainda não funcionar**, tente este comando:
   ```bash
   winpty gh auth login
   ```

### Solução 4: Usar Token de Acesso Manual

1. **Acesse:** https://github.com/settings/tokens
2. **Clique em:** "Generate new token" → "Generate new token (classic)"
3. **Configure o token:**
   - **Note:** "World Cup Bet - CLI"
   - **Expiration:** 90 days (ou sua preferência)
   - **Scopes:** Selecione:
     - ✅ `repo` (control of private repos)
     - ✅ `workflow` (update GitHub Action workflows)
4. **Clique em:** "Generate token"
5. **Copie o token** (você só vai ver uma vez!)

6. **No Git Bash, faça o login manual:**
   ```bash
   # Exportar o token como variável de ambiente
   export GH_TOKEN="seu_token_aqui"

   # Testar se funcionou
   gh auth status
   ```

### Solução 5: Script Wrapper Automático

Crie um script que use o winpty automaticamente:

**Crie o arquivo:** `scripts/gh-wrapper.sh`
```bash
#!/bin/bash
# scripts/gh-wrapper.sh

# Wrapper para GitHub CLI no Git Bash/MinTTY
if command -v winpty &> /dev/null; then
    winpty gh "$@"
else
    gh "$@"
fi
```

**Torne executável:**
```bash
chmod +x scripts/gh-wrapper.sh
```

**Use o wrapper:**
```bash
# Para login
./scripts/gh-wrapper.sh auth login

# Para comandos normais
./scripts/gh-wrapper.sh issue list
```

### Solução 6: Criar Alias no Git Bash

Adicione ao seu arquivo `~/.bashrc` ou `~/.bash_profile`:

```bash
# Adicione estas linhas ao final do arquivo
alias gh='winpty gh'
```

**Recarregue o shell:**
```bash
source ~/.bashrc
```

**Agora use normalmente:**
```bash
gh auth login
gh issue list
```

## 🎯 Recomendação

**A Solução 1 (PowerShell)** é a mais simples e funciona melhor para a maioria dos usuários Windows.

## 🚀 Passo a Passo Recomendado

### 1. Fazer o Login (UMA SÓ VEZ)

Abra o PowerShell e faça o login uma única vez:

```powershell
# Abrir PowerShell
cd C:\Users\paulo\Repos\worldcup-bet
gh auth login
# Siga as instruções no navegador
```

### 2. Usar no Git Bash

Depois de fazer o login no PowerShell, o GitHub CLI vai funcionar normalmente no Git Bash:

```bash
# No Git Bash
gh auth status  # Vai mostrar que está logado
gh issue list   # Vai funcionar normalmente
```

### 3. Criar as Issues

```bash
# No Git Bash
npm run board:create
```

## 📊 Testar se Funcionou

Depois de fazer o login, teste:

```bash
# Verificar status
gh auth status

# Listar issues (se houver)
gh issue list

# Ver repositórios
gh repo list
```

Se os comandos acima funcionarem, você está pronto!

## 🔧 Troubleshooting

### "gh: comando não encontrado"

**Solução:** O GitHub CLI não está instalado
```bash
# Instale via winget
winget install --id GitHub.cli

# OU baixe de: https://cli.github.com/
```

### "Authentication failed"

**Solução:**
1. Verifique se o token ainda é válido
2. Faça login novamente: `gh auth login`
3. Revogue tokens antigos em: https://github.com/settings/tokens

### "winpty: command not found"

**Solução:** O Git Bash não tem winpty instalado
- Use a **Solução 1 (PowerShell)** para fazer o login
- Depois volte ao Git Bash

### O navegador não abre automaticamente

**Solução:**
1. Execute `gh auth login --web`
2. Copie o código de ativação
3. Cole manualmente em: https://github.com/login/device

## 🎉 Resumo

**Problema:** Git Bash/MinTTY não suporta prompts interativos do GitHub CLI

**Solução Rápida:** Abra o PowerShell, faça `gh auth login` uma vez, depois volte ao Git Bash

**Benefício:** Você só precisa fazer isso uma vez. Depois o GitHub CLI funciona normalmente no Git Bash!

---

**Pronto!** Agora você pode usar o GitHub CLI no Windows sem problemas. 🚀
