# 🎨 Frontend Agent

## Propósito
Agente especializado em desenvolvimento de componentes React, páginas Next.js, design responsivo e experiência do usuário.

## Responsabilidades

### 1. Layout Components
- **Navbar** (`/src/components/layout/Navbar.tsx`)
  - Logo do projeto
  - Links de navegação: Dashboard, Matches, Ranking, Export
  - Botão de Logout
  - Menu hamburger para mobile
  - Design responsivo (desktop/mobile)

- **ProtectedRoute** (`/src/components/layout/ProtectedRoute.tsx`)
  - Wrapper para páginas autenticadas
  - Redireciona para /login se não autenticado
  - Exibe loading durante verificação

### 2. Match Components
- **MatchCard** (`/src/components/matches/MatchCard.tsx`)
  - Exibir informações do jogo
  - Flags dos times
  - Nomes dos times
  - Data e hora do jogo
  - Placar atual (se disponível)
  - Status do palpite (salvo, não salvo, bloqueado)

- **MatchList** (`/src/components/matches/MatchList.tsx`)
  - Listar jogos agrupados por fase
  - Tabs para diferentes fases (Grupos, Oitavas, Quartas, Semis, Final)
  - Scroll suave entre seções

- **PredictionInput** (`/src/components/matches/PredictionInput.tsx`)
  - Inputs numéricos para placar
  - Validação de entrada (números não-negativos)
  - Botão de salvar
  - Indicador de status (salvo, bloqueado)
  - Feedback visual de erro/sucesso

### 3. Dashboard Components
- **ProgressCard** (`/src/components/dashboard/ProgressCard.tsx`)
  - Exibir progresso de palpites
  - Formato: "X/64 jogos previstos"
  - Barra de progresso visual
  - Cálculo de porcentagem

- **RankingPosition** (`/src/components/dashboard/RankingPosition.tsx`)
  - Exibir posição atual no ranking
  - Pontuação total
  - Comparação com usuários anteriores/próximos

- **NextMatches** (`/src/components/dashboard/NextMatches.tsx`)
  - Listar próximos 5 jogos para prever
  - Data, times, e botão rápido de palpite
  - Link para página completa de jogos

### 4. Ranking Components
- **RankingTable** (`/src/components/ranking/RankingTable.tsx`)
  - Tabela com colunas: #, Nome, Pontos, Exatos, Vencedores
  - Ordenação automática por pontos
  - Highlight para usuário atual
  - Badge para top 3

- **ExportButtons** (`/src/components/ranking/ExportButtons.tsx`)
  - Botão de exportar como PDF
  - Botão de exportar como tabela
  - Feedback de carregamento

### 5. Simulation Components (MVP)
- **KnockoutBracket** (`/src/components/simulation/KnockoutBracket.tsx`)
  - Exibir bracket das fases eliminatórias
  - Baseado em palpites ou resultados reais
  - Simples visualização em formato de lista (MVP)

- **MatchSelector** (`/src/components/simulation/MatchSelector.tsx`)
  - Seletor de vencedor para cada jogo
  - Radio buttons ou dropdown
  - Atualização automática do bracket

### 6. Export Components
- **ExportForm** (`/src/components/export/ExportForm.tsx`)
  - Seletor de tipo: Ranking, Meus Palpites, Simulação
  - Opção de formato: PDF, Tabela

- **ExportPreview** (`/src/components/export/ExportPreview.tsx`)
  - Pré-visualização antes de exportar
  - Opção de confirmar ou cancelar

### 7. Páginas

#### Auth Pages
- **Login** (`/src/app/login/page.tsx`)
  - Formulário de login
  - Campos: email, password
  - Validação de email
  - Botão de entrar
  - Link para registro
  - Mensagens de erro
  - Loading state

- **Register** (`/src/app/register/page.tsx`)
  - Formulário de registro
  - Campos: name, email, password, confirmPassword
  - Validação de senha (mínimo 6 caracteres)
  - Validação de confirmação de senha
  - Botão de registrar
  - Link para login

#### Main Pages
- **Dashboard** (`/src/app/dashboard/page.tsx`)
  - Mensagem de boas-vindas com nome do usuário
  - ProgressCard com estatísticas
  - RankingPosition
  - NextMatches
  - Call-to-action para completar palpites

- **Matches** (`/src/app/matches/page.tsx`)
  - Navbar lateral ou tabs para fases
  - Grupos A-H cada com seus jogos
  - Fases eliminatórias separadas
  - MatchList agrupando jogos
  - Busca/filtro de jogos
  - Scroll suave para seções

- **Simulation** (`/src/app/simulation/page.tsx`)
  - Título "Simulação das Fases Eliminatórias"
  - Seção de Quartas de Final com seletores
  - Seção de Semifinais
  - Seção de Final
  - Exibição do Campeão
  - Botão de salvar/refresh simulação

- **Ranking** (`/src/app/ranking/page.tsx`)
  - Título "Ranking da Bolão"
  - RankingTable
  - ExportButtons
  - Atualização automática em tempo real

- **Export** (`/src/app/export/page.tsx`)
  - Título "Exportar Dados"
  - ExportForm com opções
  - ExportPreview
  - Botão final de download

### 8. Global Styles
- Configurar tema de cores consistentes
- Design system (cores, espaçamentos, tipografia)
- Animações e transições
- Loading states
- Error states
- Empty states

## Ferramentas e Tecnologias

### Stack
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- React Hook Form (opcional)
- Zod (validação)

### Hooks Customizados
```typescript
// useAuth.ts - Gerenciar estado de autenticação
// useMatches.ts - Buscar jogos
// usePredictions.ts - Gerenciar palpites
// useRanking.ts - Buscar ranking
```

## Estrutura de Arquivos
```
/src
  /app
    /login/page.tsx
    /register/page.tsx
    /dashboard/page.tsx
    /matches/page.tsx
    /simulation/page.tsx
    /ranking/page.tsx
    /export/page.tsx
    /layout.tsx
    /globals.css
  /components
    /layout
      Navbar.tsx
      ProtectedRoute.tsx
    /matches
      MatchCard.tsx
      MatchList.tsx
      PredictionInput.tsx
    /dashboard
      ProgressCard.tsx
      RankingPosition.tsx
      NextMatches.tsx
    /ranking
      RankingTable.tsx
      ExportButtons.tsx
    /simulation
      KnockoutBracket.tsx
      MatchSelector.tsx
    /export
      ExportForm.tsx
      ExportPreview.tsx
  /hooks
    useAuth.ts
    useMatches.ts
    usePredictions.ts
    useRanking.ts
  /types
    index.ts (exportar todos os tipos)
```

## Design System

### Cores
```css
/* Cores Primárias */
--primary: #1e3a8a; /* azul escuro */
--primary-light: #3b82f6; /* azul claro */

/* Cores de Status */
--success: #10b981; /* verde */
--warning: #f59e0b; /* amarelo */
--danger: #ef4444; /* vermelho */
--locked: #6b7280; /* cinza */

/* Cores de Background */
--bg-primary: #ffffff;
--bg-secondary: #f3f4f6;
--bg-dark: #1f2937;
```

### Tipografia
- Títulos: font-bold text-2xl (ou maiores)
- Subtítulos: font-semibold text-lg
- Texto normal: font-normal text-base
- Texto pequeno: font-normal text-sm

### Espaçamentos
- Container: max-w-6xl mx-auto px-4
- Cards: p-4, p-6
- Margens: my-4, my-8
- Gaps: gap-4, gap-6

## Responsividade

### Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md)
- Desktop: > 1024px (lg)

### Implementação
```tsx
// Mobile-first approach
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* content */}
</div>

// Hide on mobile, show on desktop
<div className="hidden md:block">
  {/* content */}
</div>
```

## Checklist de Tarefas

### Fase 1: Layout
- [ ] Criar Navbar com menu hamburger
- [ ] Criar ProtectedRoute wrapper
- [ ] Configurar layout global
- [ ] Configurar globals.css com design system

### Fase 2: Auth Pages
- [ ] Criar página de login
- [ ] Criar página de registro
- [ ] Implementar validação de formulários
- [ ] Adicionar error states

### Fase 3: Match Components
- [ ] Criar MatchCard
- [ ] Criar MatchList
- [ ] Criar PredictionInput
- [ ] Implementar validação de inputs

### Fase 4: Dashboard Components
- [ ] Criar ProgressCard
- [ ] Criar RankingPosition
- [ ] Criar NextMatches

### Fase 5: Main Pages
- [ ] Criar Dashboard page
- [ ] Criar Matches page
- [ ] Implementar agrupamento por fase
- [ ] Adicionar scroll suave

### Fase 6: Ranking Components
- [ ] Criar RankingTable
- [ ] Criar ExportButtons
- [ ] Criar Ranking page

### Fase 7: Simulation
- [ ] Criar KnockoutBracket
- [ ] Criar MatchSelector
- [ ] Criar Simulation page

### Fase 8: Export
- [ ] Criar ExportForm
- [ ] Criar ExportPreview
- [ ] Criar Export page

### Fase 9: Polish
- [ ] Implementar loading states
- [ ] Implementar error states
- [ ] Adicionar animações
- [ ] Testar responsividade
- [ ] Otimizar performance

## Convenções de Commit
```
frontend(<scope>): <descrição>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Exemplos de Commits
- `frontend(components): criar componente Navbar responsivo`
- `frontend(pages): implementar página de login`
- `frontend(dashboard): adicionar ProgressCard`
- `frontend(matches): criar PredictionInput com validação`
- `frontend(ranking): implementar RankingTable`

## Comunicação com Outros Agentes
1. Consultar **Backend Agent** sobre estrutura de dados antes de criar componentes
2. Após criar componentes, notificar **Test Agent** para criar testes de UI
3. Após completar páginas, notificar **Git Agent** para criar branch e PR

## Observações Importantes
- Usar Tailwind CSS para estilização
- Implementar design mobile-first
- Sempre adicionar loading states para operações assíncronas
- Validar inputs no frontend antes de enviar para API
- Usar tipos TypeScript estritos
- Manter componentes pequenos e reutilizáveis
- Adicionar mensagens de erro claras para o usuário
- Testar em diferentes tamanhos de tela
- Acessibilidade: usar tags semânticas, ARIA labels onde necessário
