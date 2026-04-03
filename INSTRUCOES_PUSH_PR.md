# 📝 Instruções para Push e Pull Request

## ✅ Branch já criado

**Nome do branch:** `feat/update-seed-2026-fix-match-page`
**Commits criados:** 3 commits atômicos

### Commits criados:

1. **feat(atualizar): Adicionar dados da Copa do Mundo 2026 ao seed**
   - 48 seleções em 12 grupos (A-L)
   - 99 jogos na fase de grupos
   - Usuário admin criado

2. **feat(adicionar): Criar arquivo de funções helper da API**
   - Arquivo: `src/lib/api.ts`
   - Funções: `getMatches()`, `getPredictions()`, `submitPrediction()`

3. **fix(corrigir): Resolver erro de Hooks na página de matches**
   - Criou componente `MatchCard` separado
   - Melhorou visibilidade com `text-gray-900`

---

## 🔑 Passo 1: Autenticar no GitHub

### Opção A: Usar Personal Access Token (Recomendado)

1. **Criar um Personal Access Token:**
   - Acesse: https://github.com/settings/tokens
   - Clique em: "Generate new token" → "Generate new token (classic)"
   - Dê um nome: "worldcup-bet dev"
   - Marque os scopes:
     - ✅ `repo` (control de repositórios completos)
   - Clique em: "Generate token"
   - **COPIE** o token (ele só aparece uma vez!)

2. **Configurar credenciais Git:**
   ```bash
   # No terminal, execute:
   git config --global credential.helper store

   # No primeiro push, use o token como senha
   # Username: seu_email@exemplo.com
   # Password: <cole_o_token_aqui>
   ```

### Opção B: Usar SSH (Mais seguro)

1. **Gerar chave SSH:**
   ```bash
   ssh-keygen -t ed25519 -C "seu_email@exemplo.com"
   ```

2. **Adicionar chave ao GitHub:**
   - Copie a chave pública:
     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```
   - Vá para: https://github.com/settings/keys
   - Clique em: "New SSH key"
   - Cole a chave pública
   - Dê um nome: "worldcup-bet dev"
   - Clique em: "Add SSH key"

3. **Mudar remote para SSH:**
   ```bash
   git remote set-url origin git@github.com:paulohfreire/worldcup-bet.git
   ```

---

## 🚀 Passo 2: Fazer Push do Branch

```bash
# Verificar se está no branch correto
git branch

# Fazer push
git push -u origin feat/update-seed-2026-fix-match-page
```

**Se pedir senha/credenciais:**
- **Username:** seu email do GitHub
- **Password:** seu Personal Access Token (não a senha do GitHub!)

---

## 📋 Passo 3: Criar Pull Request

### Opção A: Via interface web (Mais fácil)

1. Acesse: https://github.com/paulohfreire/worldcup-bet
2. GitHub vai detectar o novo branch e mostrar um banner:
   - "feat/update-seed-2026-fix-match-page had recent pushes"
3. Clique em: "Compare & pull request"
4. Preencha:

**Título:**
```
feat: Atualizar seed para Copa 2026 e corrigir página de matches
```

**Descrição:**
```markdown
## Resumo

Atualiza o banco de dados com informações reais da Copa do Mundo 2026 e corrige problemas na página de matches.

## Mudanças

### 📊 Banco de Dados
- Atualizou `scripts/seed.ts` com dados reais do TheSportsDB
- 48 seleções participantes (12 grupos A-L)
- 99 jogos da fase de grupos (rodadas 1, 2 e 3)
- Usuário admin: admin@worldcup.com / admin123

### 🔧 Frontend
- Criou `src/lib/api.ts` com funções helper da API
- Corrigiu erro de Hooks na página de matches criando componente `MatchCard`
- Melhorou visibilidade dos inputs de placar com `text-gray-900`

### Commits
- `feat(atualizar): Adicionar dados da Copa do Mundo 2026 ao seed`
- `feat(adicionar): Criar arquivo de funções helper da API`
- `fix(corrigir): Resolver erro de Hooks na página de matches`

## Testes

- [ ] Seed executado com sucesso
- [ ] Página de matches carrega sem erros
- [ ] Inputs de placar são visíveis e funcionais
- [ ] Predições podem ser salvas
- [ ] Times e jogos aparecem corretamente

## Issue Relacionada
N/A

## Checklist
- [ ] Segui os padrões de código do projeto
- [ ] Fiz commits atômicos com mensagens descritivas
- [ ] Testei as mudanças localmente
```

5. Clique em: **"Create pull request"**

### Opção B: Via GitHub CLI (se instalar depois)

```bash
# Instalar GitHub CLI
winget install --id GitHub.cli

# Fazer login
gh auth login

# Criar PR
gh pr create \
  --title "feat: Atualizar seed para Copa 2026 e corrigir página de matches" \
  --body-file .pr-info.md \
  --base main
```

---

## ✅ Verificação

Após criar o PR, verifique:
1. **CI/CD** (se configurado): Os testes estão passando?
2. **Files changed**: Verifique se todas as mudanças estão corretas
3. **Review**: Peça para alguém revisar o código
4. **Merge**: Quando aprovado, faça o merge

---

## 🔗 Links Úteis

- Branch no GitHub: https://github.com/paulohfreire/worldcup-bet/tree/feat/update-seed-2026-fix-match-page
- Criar Token: https://github.com/settings/tokens
- Configurar SSH: https://docs.github.com/pt/authentication/connecting-to-github-with-ssh

---

## 🎉 Pronto!

Depois de fazer o push e criar a PR, seu código estará pronto para ser revisado e mergeado!
