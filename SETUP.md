# 🚀 Setup Rápido - World Cup Betting Pool

## Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- npm ou yarn

## Passo a Passo Rápido

### 1. Instalação

```bash
# Clone o repositório (se ainda não tiver)
git clone https://github.com/seu-usuario/worldcup-bet.git
cd worldcup-bet

# Instale as dependências
npm install
```

### 2. Configuração do Banco de Dados

```bash
# Crie o banco de dados PostgreSQL
createdb worldcup_bet

# Ou usando psql:
psql -U postgres -c "CREATE DATABASE worldcup_bet;"
```

### 3. Configuração de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas credenciais
```

No arquivo `.env`:
```env
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/worldcup_bet?schema=public"
JWT_SECRET="sua-chave-secreta-aqui"
```

### 4. Inicialização do Banco

```bash
# Gere o cliente Prisma
npm run prisma:generate

# Push do schema para o banco
npm run prisma:push

# Popule o banco com dados iniciais
npm run prisma:seed
```

### 5. Inicie o Servidor

```bash
npm run dev
```

### 6. Acesse a Aplicação

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Credenciais de Teste

Após executar o seed, você terá acesso a:

- **Email**: admin@worldcup.com
- **Senha**: admin123

## Estrutura de Arquivos Criada

```
worldcup-bet/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── scripts/
│   └── seed.ts                # Script para popular dados iniciais
├── src/
│   ├── app/                   # Páginas Next.js (App Router)
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Autenticação (login, register, logout, me)
│   │   │   ├── matches/       # Jogos
│   │   │   ├── predictions/   # Apostas
│   │   │   ├── ranking/       # Ranking
│   │   │   └── export/        # Exportação
│   │   ├── dashboard/         # Dashboard
│   │   ├── export/            # Exportação
│   │   ├── login/             # Login
│   │   ├── matches/           # Jogos
│   │   ├── register/          # Registro
│   │   ├── ranking/           # Ranking
│   │   ├── simulation/        # Simulação
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Home
│   │   └── globals.css        # Estilos globais
│   ├── components/
│   │   ├── Navbar.tsx         # Barra de navegação
│   │   └── MobileNav.tsx      # Navegação mobile
│   ├── lib/
│   │   ├── auth.ts            # Funções de autenticação
│   │   ├── prisma.ts          # Cliente Prisma
│   │   ├── ui.ts              # Utilitários de UI
│   │   ├── utils.ts           # Funções utilitárias
│   │   └── validation.ts      # Validações Joi
│   ├── middleware.ts          # Middleware de proteção de rotas
│   └── types/
│       └── index.ts           # Types TypeScript
├── .env.example               # Exemplo de variáveis de ambiente
├── .gitignore                 # Arquivos ignorados pelo git
├── CLAUDE.md                  # Instruções para Claude Code
├── SETUP.md                   # Este arquivo
├── next.config.js             # Configuração do Next.js
├── next-env.d.ts              # Types do Next.js
├── package.json               # Dependências e scripts
├── postcss.config.js          # Configuração do PostCSS
├── tailwind.config.ts         # Configuração do Tailwind
├── tsconfig.json              # Configuração do TypeScript
└── README.md                  # Documentação principal
```

## Scripts Disponíveis

```bash
npm run dev              # Inicia o servidor de desenvolvimento
npm run build            # Build para produção
npm start                # Inicia o servidor de produção
npm run lint             # Executa o ESLint
npm run prisma:generate  # Gera o cliente Prisma
npm run prisma:push      # Push do schema para o banco
npm run prisma:seed      # Executa o script de seed
```

## Resolução de Problemas

### Erro: "Database URL not found"

Verifique se o arquivo `.env` existe e contém a variável `DATABASE_URL`.

### Erro: "Connection refused"

Certifique-se de que o PostgreSQL está rodando:
```bash
# Linux/Mac
sudo service postgresql start
# ou
brew services start postgresql

# Windows
# Abra o pgAdmin e inicie o serviço
```

### Erro: "Module not found"

Execute:
```bash
npm install
```

### Erro: "Prisma Client"

Execute:
```bash
npm run prisma:generate
```

## Próximos Passos

1. **Desenvolvimento**: Use `npm run dev` para desenvolvimento
2. **Testes**: Crie contas e faça apostas para testar o sistema
3. **Personalização**: Edite o schema Prisma e atualize conforme necessário
4. **Deploy**: Configure as variáveis de ambiente de produção

## Tecnologias

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Autenticação**: JWT com HTTP-only cookies

## Suporte

Para mais informações, consulte:
- [README.md](./README.md) - Documentação completa
- [SPEC.md](./SPEC.md) - Especificação técnica
- [CLAUDE.md](./CLAUDE.md) - Instruções para Claude Code

---

**Dica**: Execute `npm run prisma:seed` novamente para resetar os dados do banco e criar novos jogos para testes.
