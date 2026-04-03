# 🗄️ GUIA COMPLETA - Configuração do Banco de Dados

## 🎯 Objetivo

Configurar o PostgreSQL para funcionar com o World Cup Betting Pool.

---

## 📋 VERIFICAÇÃO - PostgreSQL Está Instalado?

### Windows

#### Método 1: Verificar via PowerShell
```powershell
# Abrir PowerShell e executar:
psql --version
```

**Se funcionar:** PostgreSQL está instalado
**Se der erro:** Precisa instalar

#### Método 2: Verificar via Serviços
```powershell
# Pressione Win+R, digite: services.msc
# Procure por: "postgresql-x64"
```

**Se encontrar:** PostgreSQL está instalado
**Se não encontrar:** Precisa instalar

### Instalar PostgreSQL no Windows (se necessário)

#### Opção 1: Usando winget (Recomendado)
```powershell
winget install postgresql
```

#### Opção 2: Baixar instalador
1. Acesse: https://www.postgresql.org/download/windows/
2. Baixe o instalador mais recente
3. Execute o instalador
4. Configure:
   - Port: 5432 (padrão)
   - Password: Crie uma senha para o usuário postgres
   - Port: 5432
   - Locale: Portuguese_Brazil.1252

---

## 🔧 CONFIGURAÇÃO - Criar Banco de Dados

### Passo 1: Acessar PostgreSQL

#### Via pgAdmin (Mais Fácil)
1. Abra o pgAdmin (instalado com PostgreSQL)
2. Clique com botão direito em "Servers"
3. Selecione "Create" → "Server"
4. Preencha:
   - **Name:** Localhost
   - **Host:** localhost
   - **Port:** 5432
   - **Maintenance database:** postgres
   - **Username:** postgres
   - **Password:** (senha que você definiu na instalação)
5. Clique em "Save"

#### Via Terminal (Alternativa)
```bash
# No Git Bash
psql -U postgres -h localhost -p 5432

# Vai pedir senha do usuário postgres
```

### Passo 2: Criar o Banco de Dados

#### Via pgAdmin
1. Expanda "Servers" → "Localhost" → "Databases"
2. Clique com botão direito em "Databases"
3. Selecione "Create" → "Database"
4. Preencha:
   - **Database:** worldcup_bet
   - **Owner:** postgres
5. Clique em "Save"

#### Via Terminal
```sql
-- Conectado ao PostgreSQL, execute:
CREATE DATABASE worldcup_bet;
```

### Passo 3: Verificar Se Foi Criado
```bash
# Via terminal
psql -U postgres -h localhost -d worldcup_bet -c "SELECT current_database();"

# Deve retornar:
#  current_database
# -------------------
#  worldcup_bet
```

---

## 📝 CRIAÇÃO DO ARQUIVO .env

### Passo 1: Copiar o Template
```bash
# No diretório do projeto
cp .env.example .env
```

### Passo 2: Editar o Arquivo .env

Abra o arquivo `.env` no seu editor favorito e configure:

#### CREDENCIAIS DO POSTGRESQL

```env
# Formato básico
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"

# Exemplo real (SUBSTITUA com suas credenciais):
DATABASE_URL="postgresql://postgres:sua_senha_aqui@localhost:5432/worldcup_bet?schema=public"
```

#### COMPONENTES DO DATABASE_URL:
- `postgresql://` - Protocolo do banco
- `postgres` - Nome do usuário (padrão)
- `sua_senha_aqui` - Senha do usuário postgres
- `@localhost` - Host do banco (local)
- `:5432` - Porta padrão do PostgreSQL
- `/worldcup_bet` - Nome do banco de dados
- `?schema=public` - Schema padrão do PostgreSQL

#### JWT SECRET
```env
# Chave secreta para tokens JWT
# Use uma string longa e aleatória
JWT_SECRET="sua_chave_secreta_muito_longa_e_aleatoria_123456789"
```

### Exemplo Completo do Arquivo .env:
```env
# Database
DATABASE_URL="postgresql://postgres:minha_senha_segura@localhost:5432/worldcup_bet?schema=public"

# JWT Secret (troque isso em produção!)
JWT_SECRET="worldcup-bet-secret-key-2024-very-long-and-secure-random-string-12345"
```

---

## 🚀 INICIALIZAÇÃO DO BANCO

### Passo 1: Verificar Configuração
```bash
# Verificar se o arquivo .env existe
cat .env

# Deve mostrar algo como:
# DATABASE_URL="postgresql://..."
# JWT_SECRET="..."
```

### Passo 2: Gerar Cliente Prisma
```bash
npm run prisma:generate
```

**O que isso faz:**
- Gera o cliente TypeScript do Prisma
- Cria tipos para seus modelos
- Prepara o Prisma para se comunicar com o banco

**Sucesso esperado:**
```
✔ Generated Prisma Client (5.22.0) to .\node_modules\.prisma\client
✔ Generated Prisma Client (5.22.0) to .\node_modules\.prisma\client in 28ms
```

### Passo 3: Enviar Schema para o Banco
```bash
npm run prisma:push
```

**O que isso faz:**
- Cria as tabelas no banco de dados
- Configura as relações entre tabelas
- Adiciona constraints (unique, foreign keys)

**Sucesso esperado:**
```
🚀 Starting migration...
Migration 20240403_000000_init done in 2.3s

The following migration(s) have been created and applied:
migration 20240403_000000_init
```

### Passo 4: Verificar Tabelas Criadas
```sql
-- Conecte ao banco e execute:
\c worldcup_bet

-- Listar tabelas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Deve mostrar:
--  Team
--  User
--  Match
--  Prediction
```

---

## 🌱 POPULAR O BANCO COM DADOS

### Passo 1: Executar Script de Seed
```bash
npm run prisma:seed
```

**O que isso faz:**
- Cria 32 seleções nacionais
- Cria jogos de exemplo da Copa do Mundo
- Cria um usuário admin de teste

**Sucesso esperado:**
```
🌱 Iniciando seed do banco de dados...
🗑️  Dados existentes limpos
⚽ 32 times criados
📅 12 jogos criados
👤 Usuário administrador criado (admin@worldcup.com / admin123)
✅ Seed concluído com sucesso!
```

### Passo 2: Verificar Dados Inseridos
```sql
-- Verificar times
SELECT COUNT(*) FROM "Team";

-- Deve retornar: 32 (ou número definido no seed)

-- Verificar usuário admin
SELECT name, email, role FROM "User" WHERE email = 'admin@worldcup.com';

-- Deve mostrar: Administrador | admin@worldcup.com | admin

-- Verificar jogos
SELECT COUNT(*) FROM "Match";

-- Deve retornar: 12 (ou número definido no seed)
```

---

## 🧪 TESTAR CONEXÃO COM O BANCO

### Teste 1: Verificar Conexão
```bash
# Node.js script para testar conexão
node -e "
const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();

client.\$connect()
  .then(() => {
    console.log('✅ Conexão com PostgreSQL bem-sucedida!');
    return client.\$disconnect();
  })
  .catch(err => {
    console.error('❌ Erro de conexão:', err.message);
  });
"
```

### Teste 2: Verificar Tabelas via Prisma
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();

async function test() {
  try {
    const teamCount = await client.team.count();
    const userCount = await client.user.count();
    const matchCount = await client.match.count();

    console.log('✅ Tabelas acessíveis:');
    console.log(\`   - Times: \${teamCount}\`);
    console.log(\`   - Usuários: \${userCount}\`);
    console.log(\`   - Jogos: \${matchCount}\`);

    if (teamCount > 0) {
      console.log('✅ Seed executado com sucesso!');
    } else {
      console.log('⚠️  Seed ainda não foi executado');
    }
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await client.\$disconnect();
  }
}

test();
"
```

---

## 🚨 SOLUÇÃO DE PROBLEMAS COMUNS

### Problema: "Connection refused"
**Sintoma:** `Error: Connection refused` ao executar `prisma:push`

**Soluções:**

1. **Verificar se PostgreSQL está rodando:**
   ```powershell
   # Abra Services.msc
   # Procure por "postgresql-x64-15"
   # Status deve ser "Running"
   ```

2. **Iniciar o PostgreSQL:**
   ```powershell
   # Via pgAdmin: Server → Start
   # OU
   # Via Services.msc: postgresql → Start
   ```

3. **Verificar porta:**
   ```bash
   # No PostgreSQL, a porta padrão é 5432
   # Verifique no pgAdmin: Properties → Connection → Port
   ```

### Problema: "Password authentication failed"
**Sintoma:** `Error: password authentication failed for user "postgres"`

**Soluções:**

1. **Verificar senha no .env:**
   ```bash
   cat .env
   # A senha deve ser exatamente a mesma da instalação
   ```

2. **Redefinir senha do PostgreSQL:**
   ```sql
   -- Conectado como postgres, execute:
   ALTER USER postgres PASSWORD 'nova_senha';
   ```

3. **Atualizar .env com nova senha:**
   ```env
   DATABASE_URL="postgresql://postgres:nova_senha@localhost:5432/worldcup_bet?schema=public"
   ```

### Problema: "Database does not exist"
**Sintoma:** `Error: database "worldcup_bet" does not exist`

**Solução:**

1. **Criar o banco:**
   ```sql
   CREATE DATABASE worldcup_bet;
   ```

2. **Verificar se criou:**
   ```bash
   psql -U postgres -h localhost -l | grep worldcup_bet
   ```

### Problema: "Schema doesn't exist"
**Sintoma:** `Error: Schema "public" doesn't exist`

**Solução:**

```sql
-- Conectado ao banco, execute:
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO postgres;
```

---

## 📋 CHECKLIST DE CONFIGURAÇÃO

### Instalação
- [ ] PostgreSQL instalado
- [ ] PostgreSQL está rodando (Services.msc)
- [ ] Senha do usuário postgres conhecida
- [ ] Porta 5432 confirmada

### Criação do Banco
- [ ] Conectado ao PostgreSQL (pgAdmin ou terminal)
- [ ] Banco de dados "worldcup_bet" criado
- [ ] Schema "public" existe
- [ ] Permissões concedidas

### Arquivo .env
- [ ] Arquivo .env criado (cp .env.example .env)
- [ ] DATABASE_URL configurado corretamente
- [ ] JWT_SECRET definido
- [ ] Nenhum espaço ou caractere especial no início

### Inicialização
- [ ] Cliente Prisma gerado (prisma:generate)
- [ ] Schema enviado ao banco (prisma:push)
- [ ] Seed executado (prisma:seed)
- [ ] 32+ times criados
- [ ] 10+ jogos criados
- [ ] Usuário admin criado

### Testes
- [ ] Conexão com banco bem-sucedida
- [ ] Tabelas acessíveis via Prisma
- [ ] Dados de seed presentes no banco
- [ ] Sem erros na inicialização

---

## 🎯 COMANDOS RÁPIDOS

### Tudo em Um Comando:
```bash
# Inicialização completa (se .env estiver configurado)
npm run prisma:generate && npm run prisma:push && npm run prisma:seed
```

### Verificar Status:
```bash
# Verificar se o banco existe
psql -U postgres -h localhost -l | grep worldcup_bet

# Verificar tabelas
psql -U postgres -h localhost -d worldcup_bet -c "\dt"

# Verificar dados de times
psql -U postgres -h localhost -d worldcup_bet -c "SELECT COUNT(*) FROM \"Team\";"
```

---

## 📚 FERRAMENTAS ÚTEIS

### pgAdmin
- Interface gráfica para PostgreSQL
- Mais fácil que terminal para iniciantes
- Disponível em: https://www.pgadmin.org/download/

### DBeaver
- Alternativa gratuita ao pgAdmin
- Interface mais moderna
- Disponível em: https://dbeaver.io/

### Prisma Studio
- Interface web para visualizar banco
- Para visualizar dados de forma interativa
- Execute: `npx prisma studio`

---

## 🚀 PRÓXIMO PASSO APÓS CONFIGURAÇÃO

Depois de configurar e testar o banco:

1. **Iniciar a aplicação:**
   ```bash
   npm install
   npm run dev
   ```

2. **Acessar no navegador:**
   ```
   http://localhost:3000
   ```

3. **Testar login:**
   ```
   Email: admin@worldcup.com
   Senha: admin123
   ```

4. **Começar o desenvolvimento:**
   - Acesse o GitHub Projects
   - Escolha uma issue do Backlog
   - Comece a implementar!

---

## 🎉 RESUMO FINAL

**Para configurar o banco em 10 minutos:**

```bash
# 1. Verificar se PostgreSQL está rodando
# (Abrir Services.msc e procurar postgresql)

# 2. Criar banco via pgAdmin
# (Clicar: Create → Database → worldcup_bet)

# 3. Criar e editar .env
cp .env.example .env
# (Edite com suas credenciais)

# 4. Inicializar tudo
npm run prisma:generate
npm run prisma:push
npm run prisma:seed

# 5. Testar
npm run dev
# Acesse: http://localhost:3000
```

**É isso!** Agora você tem um banco de dados totalmente configurado e populado com dados iniciais! 🚀
