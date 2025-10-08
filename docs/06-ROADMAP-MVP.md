# 🗺️ Roadmap MVP - Conecta Igreja (Supabase Full)

## 🎯 Objetivo do MVP

Entregar um sistema funcional de gestão de igrejas em **8-12 semanas** com os módulos essenciais:
- ✅ Autenticação multitenant
- ✅ Gestão de Membros
- ✅ Gestão de Células
- ✅ Finanças Básicas (dízimos, ofertas, despesas)

---

## 📋 Arquitetura Escolhida

```
┌─────────────────────────────────────────────┐
│      FRONTEND (React + Vite + TypeScript)   │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  @supabase/supabase-js                │ │
│  │  • Auth (login/logout)                │ │
│  │  • Database queries (CRUD)            │ │
│  │  • Storage (uploads)                  │ │
│  │  • Realtime (opcional)                │ │
│  └───────────────────────────────────────┘ │
└─────────────────┬───────────────────────────┘
                  │
                  │ REST API (auto-gerada)
                  │
┌─────────────────▼───────────────────────────┐
│            SUPABASE CLOUD                   │
│  • PostgreSQL (RLS para multitenancy)      │
│  • Auth (JWT automático)                   │
│  • Storage (avatars, documentos)           │
│  • Edge Functions (envio de email)         │
└─────────────────────────────────────────────┘
```

**Por que essa arquitetura?**
- ⚡ **Velocidade**: MVP em 8-12 semanas vs 16-20 semanas
- 💰 **Custo**: $25/mês (Supabase Pro) vs $100+/mês (infraestrutura própria)
- 🔒 **Segurança**: RLS garante isolamento de dados por tenant
- 🚀 **Escalabilidade**: Supabase escala automaticamente

---

## 🏗️ Fases de Desenvolvimento

### **Fase 0: Setup Inicial** (Semana 1)

#### Sprint 0.1: Infraestrutura (2 dias)
- [x] Criar projeto no Supabase
- [x] Configurar domínio (opcional)
- [x] Setup do repositório Git
- [ ] Criar estrutura de pastas frontend
- [ ] Configurar Vite + React + TypeScript
- [ ] Instalar e configurar Tailwind CSS + shadcn/ui
- [ ] Configurar ESLint + Prettier + Husky
- [ ] Criar arquivo de variáveis de ambiente

#### Sprint 0.2: Database Schema (3 dias)
- [ ] Criar migration: Tenants
- [ ] Criar migration: Users e Tenant_Users
- [ ] Criar migration: System_Modules
- [ ] Configurar RLS policies básicas
- [ ] Criar seed de dados de teste
- [ ] Testar isolamento de dados (RLS)

**Entregável:**
- ✅ Projeto Supabase configurado
- ✅ Frontend com estrutura base
- ✅ Schema do banco criado
- ✅ RLS funcionando

---

### **Fase 1: Autenticação e Multitenancy** (Semana 2)

#### Sprint 1.1: UI de Autenticação (2 dias)
- [ ] Criar layout de auth (AuthLayout)
- [ ] Página de Login
- [ ] Página de Registro (cadastro de nova igreja)
- [ ] Página de Esqueci Senha
- [ ] Componente de loading e erro

#### Sprint 1.2: Lógica de Autenticação (3 dias)
- [ ] Criar hook `useAuth`
- [ ] Criar `authService` com Supabase
- [ ] Implementar fluxo de login com tenant
- [ ] Implementar logout
- [ ] Criar `ProtectedRoute` component
- [ ] Implementar refresh token automático
- [ ] Testar isolamento por tenant

**Entregável:**
- ✅ Login funcional com multitenancy
- ✅ Registro de novas igrejas
- ✅ Proteção de rotas
- ✅ Persistência de sessão

**Testes:**
- [ ] Login com tenant válido
- [ ] Login com tenant inválido (rejeita)
- [ ] Usuário de igreja A não acessa dados da igreja B
- [ ] Logout limpa sessão

---

### **Fase 2: Layout e Navegação** (Semana 3)

#### Sprint 2.1: Layout Principal (2 dias)
- [ ] Criar MainLayout (Sidebar + Header + Content)
- [ ] Criar Sidebar component
- [ ] Criar Header component com UserMenu
- [ ] Implementar menu dinâmico (baseado em módulos habilitados)
- [ ] Criar página de Dashboard (placeholder)
- [ ] Responsividade mobile

#### Sprint 2.2: Sistema de Módulos (3 dias)
- [ ] Criar hook `useEnabledModules`
- [ ] Criar hook `useModuleAccess`
- [ ] Implementar roteamento dinâmico
- [ ] Criar página de Settings (habilitar/desabilitar módulos)
- [ ] Implementar lazy loading de módulos
- [ ] Criar componente de "módulo não habilitado"

**Entregável:**
- ✅ Layout responsivo completo
- ✅ Menu dinâmico baseado em módulos
- ✅ Sistema de feature flags funcionando

---

### **Fase 3: Módulo de Membros** (Semanas 4-5)

#### Sprint 3.1: Database Schema Membros (2 dias)
- [ ] Migration: Tabela `members`
- [ ] Migration: Tabela `families`
- [ ] Configurar RLS policies para members
- [ ] Seed de membros de teste
- [ ] Criar índices de performance

#### Sprint 3.2: UI - Listagem (3 dias)
- [ ] Página: MembersListPage
- [ ] Componente: MemberCard (grid view)
- [ ] Componente: MembersTable (table view)
- [ ] Componente: MembersFilters (busca, status, etc)
- [ ] Implementar paginação
- [ ] Implementar ordenação (nome, data cadastro)
- [ ] Toggle entre grid/table view

#### Sprint 3.3: UI - Cadastro/Edição (3 dias)
- [ ] Componente: MemberForm
- [ ] Validação com Zod
- [ ] Upload de foto (avatar)
- [ ] Campos: dados pessoais, contato, endereço
- [ ] Modal de criação
- [ ] Página de edição
- [ ] Feedback de sucesso/erro

#### Sprint 3.4: Lógica e Integração (2 dias)
- [ ] Service: `membersService`
- [ ] Hook: `useMembers` (lista)
- [ ] Hook: `useMemberDetails` (detalhes)
- [ ] Hook: `useCreateMember`
- [ ] Hook: `useUpdateMember`
- [ ] Hook: `useDeleteMember` (soft delete)
- [ ] Cache com React Query

**Entregável:**
- ✅ CRUD completo de membros
- ✅ Upload de foto funcionando
- ✅ Filtros e busca
- ✅ Paginação

**Testes:**
- [ ] Criar membro com dados válidos
- [ ] Validar campos obrigatórios
- [ ] Upload de foto
- [ ] Editar membro
- [ ] Soft delete (marcar como inativo)
- [ ] Buscar membros por nome
- [ ] Filtrar por status

---

### **Fase 4: Módulo de Células** (Semana 6)

#### Sprint 4.1: Database Schema Células (2 dias)
- [ ] Migration: Tabela `cells`
- [ ] Migration: Tabela `cell_members`
- [ ] Migration: Tabela `cell_meetings`
- [ ] Migration: Tabela `cell_attendance`
- [ ] RLS policies
- [ ] Seed de células de teste

#### Sprint 4.2: UI - Células (3 dias)
- [ ] Página: CellsListPage
- [ ] Componente: CellCard
- [ ] Componente: CellForm
- [ ] Página: CellDetailsPage
- [ ] Listar membros da célula
- [ ] Adicionar/remover membros

#### Sprint 4.3: Reuniões e Frequência (3 dias)
- [ ] Página: CellMeetingForm (relatório de reunião)
- [ ] Componente: AttendanceSheet (marcar presença)
- [ ] Listar histórico de reuniões
- [ ] Estatísticas da célula (membros, frequência média)
- [ ] Hooks: `useCells`, `useCellMeetings`, `useAttendance`

**Entregável:**
- ✅ Gestão completa de células
- ✅ Registro de reuniões
- ✅ Controle de frequência
- ✅ Estatísticas básicas

---

### **Fase 5: Módulo de Finanças** (Semana 7-8)

#### Sprint 5.1: Database Schema Finanças (2 dias)
- [ ] Migration: Tabela `transactions`
- [ ] Migration: Tabela `transaction_audit_log`
- [ ] RLS policies
- [ ] Trigger de auditoria automático
- [ ] Seed de transações de teste

#### Sprint 5.2: UI - Lançamentos (3 dias)
- [ ] Página: FinanceDashboardPage
- [ ] Componente: TransactionsList
- [ ] Componente: TransactionForm (entrada/saída)
- [ ] Modal de criação rápida
- [ ] Filtros (tipo, categoria, período)
- [ ] Busca por membro (dízimos/ofertas)

#### Sprint 5.3: Relatórios Financeiros (3 dias)
- [ ] Componente: CashFlowChart (entradas vs saídas)
- [ ] Componente: FinancialSummary (cards com totais)
- [ ] Componente: CategoryBreakdown (gráfico pizza)
- [ ] Filtro por período (mês, trimestre, ano)
- [ ] Exportar relatório (CSV/PDF - via Edge Function)
- [ ] Lista de dzimistas

#### Sprint 5.4: Recibos (2 dias)
- [ ] Geração de recibo (Edge Function + PDF)
- [ ] Template de recibo customizável
- [ ] Envio de recibo por email
- [ ] Histórico de recibos emitidos

**Entregável:**
- ✅ Controle de dízimos e ofertas
- ✅ Controle de despesas
- ✅ Dashboard financeiro com gráficos
- ✅ Emissão de recibos
- ✅ Auditoria completa (nunca deleta)

**Testes:**
- [ ] Lançar entrada (dízimo)
- [ ] Lançar saída (despesa)
- [ ] Cancelar transação (auditoria mantém)
- [ ] Gerar recibo
- [ ] Filtrar por período
- [ ] Exportar relatório

---

### **Fase 6: Dashboard e Melhorias** (Semana 9)

#### Sprint 6.1: Dashboard Central (3 dias)
- [ ] Cards de estatísticas (total membros, células, finanças)
- [ ] Gráfico de crescimento de membros
- [ ] Gráfico de saúde financeira (últimos 6 meses)
- [ ] Lista de aniversariantes do mês
- [ ] Lista de visitantes recentes
- [ ] Ações rápidas (novo membro, novo lançamento)

#### Sprint 6.2: Melhorias de UX (2 dias)
- [ ] Loading states em todas as páginas
- [ ] Empty states (quando não há dados)
- [ ] Mensagens de erro amigáveis
- [ ] Toast notifications (sucesso/erro)
- [ ] Confirmação de ações destrutivas
- [ ] Skeleton loaders

**Entregável:**
- ✅ Dashboard funcional com métricas
- ✅ UX polida e profissional

---

### **Fase 7: Testes e Refinamentos** (Semana 10)

#### Sprint 7.1: Testes (3 dias)
- [ ] Testes de integração (fluxos principais)
- [ ] Testes de RLS (isolamento de tenants)
- [ ] Testes de performance (queries lentas)
- [ ] Testes de responsividade (mobile/tablet)
- [ ] Correção de bugs encontrados

#### Sprint 7.2: Documentação (2 dias)
- [ ] README.md de uso (para pastores/admins)
- [ ] Vídeo tutorial básico (opcional)
- [ ] FAQ
- [ ] Guia de onboarding

**Entregável:**
- ✅ Sistema testado e estável
- ✅ Documentação de uso

---

### **Fase 8: Deploy e Lançamento** (Semana 11-12)

#### Sprint 8.1: Preparação para Produção (3 dias)
- [ ] Configurar ambiente de produção no Supabase
- [ ] Aplicar migrations em produção
- [ ] Configurar backups automáticos
- [ ] Configurar domínio customizado
- [ ] SSL/HTTPS
- [ ] Configurar Sentry (error tracking)

#### Sprint 8.2: Deploy (2 dias)
- [ ] Deploy do frontend (Vercel/Netlify)
- [ ] Configurar variáveis de ambiente produção
- [ ] Testar em produção
- [ ] Setup de CI/CD (GitHub Actions)
- [ ] Monitoramento (Uptime Robot)

#### Sprint 8.3: Onboarding Primeiros Clientes (3 dias)
- [ ] Criar 3-5 tenants de teste (igrejas piloto)
- [ ] Popular com dados reais
- [ ] Treinamento com pastores
- [ ] Coletar feedback
- [ ] Ajustes finais

**Entregável:**
- ✅ Sistema em produção
- ✅ 3-5 igrejas usando
- ✅ Feedback coletado

---

## 📊 Resumo do Timeline

| Fase | Duração | Entregável Principal |
|------|---------|---------------------|
| **Fase 0** | 1 semana | Setup completo |
| **Fase 1** | 1 semana | Autenticação + Multitenancy |
| **Fase 2** | 1 semana | Layout + Sistema de Módulos |
| **Fase 3** | 2 semanas | Módulo de Membros completo |
| **Fase 4** | 1 semana | Módulo de Células completo |
| **Fase 5** | 2 semanas | Módulo de Finanças completo |
| **Fase 6** | 1 semana | Dashboard + UX |
| **Fase 7** | 1 semana | Testes + Documentação |
| **Fase 8** | 2 semanas | Deploy + Onboarding |
| **TOTAL** | **12 semanas** | **MVP Completo** |

---

## 🎯 Critérios de Sucesso do MVP

### Funcionalidades Essenciais
- ✅ 3+ igrejas usando ativamente
- ✅ 100+ membros cadastrados (total)
- ✅ 10+ células gerenciadas
- ✅ 50+ transações financeiras lançadas
- ✅ Zero bugs críticos
- ✅ Tempo de carregamento < 2s

### Métricas de Qualidade
- ✅ RLS 100% funcional (zero vazamento entre tenants)
- ✅ Uptime > 99%
- ✅ Feedback positivo de 80%+ dos usuários piloto
- ✅ Mobile responsivo em 100% das telas

---

## 🚫 Fora do Escopo do MVP

**Funcionalidades adiadas para Fase 2 (pós-MVP):**
- ❌ CRM com Kanban
- ❌ Módulo de Ministérios
- ❌ Módulo de Comunicação (Email/WhatsApp em massa)
- ❌ Módulo de Eventos
- ❌ Relatórios avançados (customizáveis)
- ❌ Carteirinhas digitais
- ❌ Construtor de fluxos (Automator)
- ❌ API Pública para integrações
- ❌ App Mobile (PWA apenas)

**Por que adiar?**
- 🎯 Foco total nos módulos essenciais
- ⚡ MVP mais rápido = feedback mais cedo
- 💰 Validar modelo de negócio antes de investir em features avançadas

---

## 💰 Custo Estimado do MVP

### Desenvolvimento
- **Tempo**: 12 semanas (3 meses)
- **Desenvolvedores**: 1 full-stack (você) ou 2 devs (1 front + 1 back)

### Infraestrutura (Mensal)
| Serviço | Custo |
|---------|-------|
| Supabase Pro | $25/mês |
| Vercel (Frontend) | $0 (hobby) |
| Domínio | $12/ano (~$1/mês) |
| **TOTAL** | **~$26/mês** |

### Após 10 Igrejas
- Ainda cabe no Supabase Pro ($25/mês)
- Estimativa: 1.000 membros, 500 usuários ativos
- Storage: ~1 GB

---

## 🎓 Skills Necessárias

### Frontend
- ✅ React (hooks, context)
- ✅ TypeScript (básico/intermediário)
- ✅ Tailwind CSS
- ✅ React Query
- ✅ React Hook Form + Zod

### Backend/Database
- ✅ SQL básico (Supabase simplifica muito)
- ✅ RLS policies (documentação do Supabase é ótima)
- ⚠️ PostgreSQL intermediário (para queries complexas)

### DevOps
- ✅ Git/GitHub
- ✅ Deploy básico (Vercel faz sozinho)
- ⚠️ Supabase CLI (simples, mas precisa aprender)

**Curva de Aprendizado:**
- 🟢 React + TypeScript: 2-4 semanas (se já souber JavaScript)
- 🟢 Supabase: 1 semana (muito mais simples que NestJS)
- 🟢 Tailwind + shadcn/ui: 3-5 dias

---

## 📚 Recursos de Aprendizado

### Supabase
- [Documentação Oficial](https://supabase.com/docs)
- [Curso Gratuito (YouTube)](https://www.youtube.com/watch?v=7uKQBl9uZ00)
- [Exemplos de RLS](https://supabase.com/docs/guides/auth/row-level-security)

### React + TypeScript
- [React Docs (Beta)](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Tailwind + shadcn/ui
- [Tailwind Docs](https://tailwindcss.com/docs)
- [shadcn/ui Examples](https://ui.shadcn.com/examples)

---

## 🤝 Próximos Passos Imediatos

1. **Criar projeto no Supabase** (5 min)
2. **Setup do frontend** (30 min)
3. **Primeira migration** (Tenants) (20 min)
4. **Testar conexão Supabase ↔ Frontend** (10 min)

**Vamos começar?** 🚀

---

**Documento criado em:** 08/10/2025  
**Versão:** 1.0  
**Autor:** Droid (Factory AI)
