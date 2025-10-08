# 📁 Estrutura de Diretórios - Conecta Igreja

## 1. Visão Geral do Monorepo

```
conecta-igreja/
├── frontend/              # Aplicação React (Vite + TypeScript)
├── backend/               # API NestJS (TypeScript)
├── shared/                # Código compartilhado (tipos, utils)
├── docs/                  # Documentação
├── scripts/               # Scripts de automação
├── .github/               # CI/CD workflows
└── docker-compose.yml     # Ambiente de desenvolvimento
```

---

## 2. Frontend (React + Vite + TypeScript)

```
frontend/
├── public/
│   ├── favicon.ico
│   └── logo.svg
│
├── src/
│   ├── app/                         # Configuração da aplicação
│   │   ├── App.tsx                  # Componente raiz
│   │   ├── AppRoutes.tsx            # Rotas principais
│   │   └── AppProviders.tsx         # Context providers
│   │
│   ├── assets/                      # Assets estáticos
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/                  # Componentes compartilhados
│   │   ├── ui/                      # Componentes base (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   │
│   │   ├── common/                  # Componentes comuns
│   │   │   ├── DataTable/
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── DataTablePagination.tsx
│   │   │   │   └── columns.tsx
│   │   │   │
│   │   │   ├── PageHeader/
│   │   │   │   └── PageHeader.tsx
│   │   │   │
│   │   │   ├── EmptyState/
│   │   │   │   └── EmptyState.tsx
│   │   │   │
│   │   │   ├── LoadingState/
│   │   │   │   └── LoadingState.tsx
│   │   │   │
│   │   │   └── ErrorBoundary/
│   │   │       └── ErrorBoundary.tsx
│   │   │
│   │   └── layout/                  # Componentes de layout
│   │       ├── Sidebar/
│   │       │   ├── Sidebar.tsx
│   │       │   ├── SidebarItem.tsx
│   │       │   └── SidebarMenu.tsx
│   │       │
│   │       ├── Header/
│   │       │   ├── Header.tsx
│   │       │   ├── UserMenu.tsx
│   │       │   └── TenantSwitcher.tsx
│   │       │
│   │       ├── MainLayout/
│   │       │   └── MainLayout.tsx
│   │       │
│   │       └── AuthLayout/
│   │           └── AuthLayout.tsx
│   │
│   ├── modules/                     # Módulos da aplicação (feature-based)
│   │   │
│   │   ├── auth/                    # Módulo de Autenticação
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── ForgotPasswordForm.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useLogin.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   │
│   │   │   ├── stores/
│   │   │   │   └── authStore.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts
│   │   │   │
│   │   │   └── index.tsx            # Entry point do módulo
│   │   │
│   │   ├── members/                 # Módulo de Membros
│   │   │   ├── components/
│   │   │   │   ├── MembersList.tsx
│   │   │   │   ├── MemberCard.tsx
│   │   │   │   ├── MemberForm.tsx
│   │   │   │   ├── MemberFilters.tsx
│   │   │   │   └── MemberDetails/
│   │   │   │       ├── MemberDetailsHeader.tsx
│   │   │   │       ├── MemberDetailsInfo.tsx
│   │   │   │       ├── MemberDetailsFamily.tsx
│   │   │   │       └── MemberDetailsHistory.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useMembers.ts
│   │   │   │   ├── useMemberDetails.ts
│   │   │   │   ├── useCreateMember.ts
│   │   │   │   └── useUpdateMember.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── members.service.ts
│   │   │   │
│   │   │   ├── stores/
│   │   │   │   └── membersStore.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   └── member.types.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── memberValidation.ts
│   │   │   │   └── memberFormatters.ts
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── MembersListPage.tsx
│   │   │   │   ├── MemberDetailsPage.tsx
│   │   │   │   └── MemberCreatePage.tsx
│   │   │   │
│   │   │   └── index.tsx
│   │   │
│   │   ├── finance/                 # Módulo de Finanças
│   │   │   ├── components/
│   │   │   │   ├── TransactionsList.tsx
│   │   │   │   ├── TransactionForm.tsx
│   │   │   │   ├── CashFlowChart.tsx
│   │   │   │   ├── FinancialDashboard.tsx
│   │   │   │   └── ReceiptGenerator.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useTransactions.ts
│   │   │   │   ├── useCashFlow.ts
│   │   │   │   └── useFinancialStats.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── finance.service.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   └── finance.types.ts
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── FinanceDashboardPage.tsx
│   │   │   │   ├── TransactionsListPage.tsx
│   │   │   │   └── ReportsPage.tsx
│   │   │   │
│   │   │   └── index.tsx
│   │   │
│   │   ├── cells/                   # Módulo de Células
│   │   │   ├── components/
│   │   │   │   ├── CellsList.tsx
│   │   │   │   ├── CellCard.tsx
│   │   │   │   ├── CellForm.tsx
│   │   │   │   ├── CellMap.tsx
│   │   │   │   ├── CellMeetingForm.tsx
│   │   │   │   └── AttendanceSheet.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useCells.ts
│   │   │   │   ├── useCellMeetings.ts
│   │   │   │   └── useCellAttendance.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── cells.service.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   └── cell.types.ts
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── CellsListPage.tsx
│   │   │   │   ├── CellDetailsPage.tsx
│   │   │   │   └── CellMapPage.tsx
│   │   │   │
│   │   │   └── index.tsx
│   │   │
│   │   ├── crm/                     # Módulo de CRM (Fase 2)
│   │   │   ├── components/
│   │   │   │   ├── KanbanBoard.tsx
│   │   │   │   ├── KanbanColumn.tsx
│   │   │   │   ├── ContactCard.tsx
│   │   │   │   ├── TasksList.tsx
│   │   │   │   └── InteractionsTimeline.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useContacts.ts
│   │   │   │   ├── useTasks.ts
│   │   │   │   └── useKanban.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── crm.service.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   └── crm.types.ts
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── CRMDashboardPage.tsx
│   │   │   │   └── ContactDetailsPage.tsx
│   │   │   │
│   │   │   └── index.tsx
│   │   │
│   │   ├── ministries/              # Módulo de Ministérios (Fase 2)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── pages/
│   │   │   └── index.tsx
│   │   │
│   │   ├── communication/           # Módulo de Comunicação (Fase 2)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── pages/
│   │   │   └── index.tsx
│   │   │
│   │   ├── events/                  # Módulo de Eventos (Fase 2)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── pages/
│   │   │   └── index.tsx
│   │   │
│   │   ├── reports/                 # Módulo de Relatórios (Fase 2)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── pages/
│   │   │   └── index.tsx
│   │   │
│   │   ├── cards/                   # Módulo de Carteirinhas (Fase 3)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── pages/
│   │   │   └── index.tsx
│   │   │
│   │   └── settings/                # Configurações do Tenant
│   │       ├── components/
│   │       │   ├── GeneralSettings.tsx
│   │       │   ├── ModulesSettings.tsx
│   │       │   ├── UsersSettings.tsx
│   │       │   ├── RolesSettings.tsx
│   │       │   └── IntegrationsSettings.tsx
│   │       │
│   │       ├── hooks/
│   │       │   └── useSettings.ts
│   │       │
│   │       ├── services/
│   │       │   └── settings.service.ts
│   │       │
│   │       ├── types/
│   │       │   └── settings.types.ts
│   │       │
│   │       ├── pages/
│   │       │   └── SettingsPage.tsx
│   │       │
│   │       └── index.tsx
│   │
│   ├── lib/                         # Bibliotecas e configurações
│   │   ├── api/                     # Cliente HTTP
│   │   │   ├── client.ts            # Axios/Fetch config
│   │   │   ├── interceptors.ts      # Request/Response interceptors
│   │   │   └── endpoints.ts         # Endpoints da API
│   │   │
│   │   ├── auth/                    # Utilitários de autenticação
│   │   │   ├── authUtils.ts
│   │   │   └── tokenManager.ts
│   │   │
│   │   ├── query/                   # React Query config
│   │   │   └── queryClient.ts
│   │   │
│   │   └── utils/                   # Utilitários gerais
│   │       ├── cn.ts                # Tailwind class merge
│   │       ├── formatters.ts        # Formatação de dados
│   │       ├── validators.ts        # Validações
│   │       └── dates.ts             # Utilitários de data
│   │
│   ├── hooks/                       # Hooks globais
│   │   ├── useAuth.ts
│   │   ├── useTenant.ts
│   │   ├── useModuleAccess.ts
│   │   ├── usePermission.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── stores/                      # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── tenantStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   │
│   ├── types/                       # Types globais
│   │   ├── api.types.ts
│   │   ├── common.types.ts
│   │   ├── user.types.ts
│   │   └── tenant.types.ts
│   │
│   ├── styles/                      # Estilos globais
│   │   ├── globals.css
│   │   └── tailwind.css
│   │
│   ├── constants/                   # Constantes da aplicação
│   │   ├── routes.ts
│   │   ├── permissions.ts
│   │   ├── modules.ts
│   │   └── status.ts
│   │
│   ├── config/                      # Configurações
│   │   ├── app.config.ts
│   │   └── env.ts
│   │
│   └── main.tsx                     # Entry point
│
├── .env.example                     # Variáveis de ambiente
├── .env.local                       # Variáveis locais (git ignored)
├── .eslintrc.cjs                    # ESLint config
├── .prettierrc                      # Prettier config
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite config
├── tailwind.config.js               # Tailwind config
├── components.json                  # shadcn/ui config
├── package.json
└── README.md
```

---

## 3. Backend (NestJS + TypeScript)

```
backend/
├── src/
│   ├── main.ts                      # Entry point
│   │
│   ├── app.module.ts                # Módulo raiz
│   ├── app.controller.ts            # Controller raiz
│   ├── app.service.ts               # Service raiz
│   │
│   ├── config/                      # Configurações
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   │
│   ├── common/                      # Recursos compartilhados
│   │   │
│   │   ├── decorators/              # Decorators customizados
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── current-tenant.decorator.ts
│   │   │   ├── require-module.decorator.ts
│   │   │   ├── require-permission.decorator.ts
│   │   │   └── public.decorator.ts
│   │   │
│   │   ├── guards/                  # Guards de autorização
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── tenant.guard.ts
│   │   │   ├── module-access.guard.ts
│   │   │   ├── permission.guard.ts
│   │   │   └── roles.guard.ts
│   │   │
│   │   ├── interceptors/            # Interceptors
│   │   │   ├── tenant-context.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   └── audit.interceptor.ts
│   │   │
│   │   ├── filters/                 # Exception filters
│   │   │   ├── http-exception.filter.ts
│   │   │   └── all-exceptions.filter.ts
│   │   │
│   │   ├── pipes/                   # Validation pipes
│   │   │   └── validation.pipe.ts
│   │   │
│   │   ├── middleware/              # Middlewares
│   │   │   ├── tenant-resolver.middleware.ts
│   │   │   └── logger.middleware.ts
│   │   │
│   │   ├── dto/                     # DTOs base
│   │   │   ├── pagination.dto.ts
│   │   │   └── response.dto.ts
│   │   │
│   │   └── interfaces/              # Interfaces comuns
│   │       ├── paginated-result.interface.ts
│   │       └── request-with-user.interface.ts
│   │
│   ├── database/                    # Database management
│   │   ├── migrations/              # Migrations
│   │   │   └── 001_create_tenants.ts
│   │   │
│   │   ├── seeds/                   # Seeds
│   │   │   ├── system-modules.seed.ts
│   │   │   └── default-roles.seed.ts
│   │   │
│   │   ├── entities/                # Entidades globais (TypeORM)
│   │   │   ├── tenant.entity.ts
│   │   │   ├── user.entity.ts
│   │   │   ├── tenant-user.entity.ts
│   │   │   ├── system-module.entity.ts
│   │   │   └── tenant-module.entity.ts
│   │   │
│   │   └── database.module.ts
│   │
│   ├── modules/                     # Módulos da aplicação
│   │   │
│   │   ├── tenant/                  # Gestão de Tenants
│   │   │   ├── tenant.module.ts
│   │   │   ├── tenant.controller.ts
│   │   │   ├── tenant.service.ts
│   │   │   ├── tenant.repository.ts
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── create-tenant.dto.ts
│   │   │   │   ├── update-tenant.dto.ts
│   │   │   │   └── tenant-response.dto.ts
│   │   │   │
│   │   │   └── interfaces/
│   │   │       └── tenant.interface.ts
│   │   │
│   │   ├── auth/                    # Autenticação
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   │
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── auth-response.dto.ts
│   │   │   │
│   │   │   └── interfaces/
│   │   │       ├── jwt-payload.interface.ts
│   │   │       └── auth-result.interface.ts
│   │   │
│   │   ├── users/                   # Usuários
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── update-user.dto.ts
│   │   │   │   └── user-response.dto.ts
│   │   │   │
│   │   │   └── interfaces/
│   │   │       └── user.interface.ts
│   │   │
│   │   ├── members/                 # Módulo de Membros
│   │   │   ├── members.module.ts
│   │   │   ├── members.controller.ts
│   │   │   ├── members.service.ts
│   │   │   ├── members.repository.ts
│   │   │   │
│   │   │   ├── entities/
│   │   │   │   ├── member.entity.ts
│   │   │   │   └── family.entity.ts
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── create-member.dto.ts
│   │   │   │   ├── update-member.dto.ts
│   │   │   │   ├── filter-members.dto.ts
│   │   │   │   └── member-response.dto.ts
│   │   │   │
│   │   │   └── interfaces/
│   │   │       └── member.interface.ts
│   │   │
│   │   ├── finance/                 # Módulo de Finanças
│   │   │   ├── finance.module.ts
│   │   │   ├── finance.controller.ts
│   │   │   ├── finance.service.ts
│   │   │   ├── finance.repository.ts
│   │   │   │
│   │   │   ├── entities/
│   │   │   │   ├── transaction.entity.ts
│   │   │   │   └── transaction-audit-log.entity.ts
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── create-transaction.dto.ts
│   │   │   │   ├── update-transaction.dto.ts
│   │   │   │   ├── filter-transactions.dto.ts
│   │   │   │   └── transaction-response.dto.ts
│   │   │   │
│   │   │   └── services/
│   │   │       ├── transactions.service.ts
│   │   │       ├── cash-flow.service.ts
│   │   │       └── receipts.service.ts
│   │   │
│   │   ├── cells/                   # Módulo de Células
│   │   │   ├── cells.module.ts
│   │   │   ├── cells.controller.ts
│   │   │   ├── cells.service.ts
│   │   │   ├── cells.repository.ts
│   │   │   │
│   │   │   ├── entities/
│   │   │   │   ├── cell.entity.ts
│   │   │   │   ├── cell-member.entity.ts
│   │   │   │   ├── cell-meeting.entity.ts
│   │   │   │   └── cell-attendance.entity.ts
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── create-cell.dto.ts
│   │   │   │   ├── create-meeting.dto.ts
│   │   │   │   └── attendance.dto.ts
│   │   │   │
│   │   │   └── services/
│   │   │       ├── cells.service.ts
│   │   │       ├── meetings.service.ts
│   │   │       └── attendance.service.ts
│   │   │
│   │   ├── crm/                     # Módulo de CRM (Fase 2)
│   │   │   ├── crm.module.ts
│   │   │   ├── crm.controller.ts
│   │   │   ├── crm.service.ts
│   │   │   │
│   │   │   ├── entities/
│   │   │   │   ├── crm-contact.entity.ts
│   │   │   │   ├── crm-task.entity.ts
│   │   │   │   └── crm-interaction.entity.ts
│   │   │   │
│   │   │   └── services/
│   │   │       ├── contacts.service.ts
│   │   │       ├── tasks.service.ts
│   │   │       └── interactions.service.ts
│   │   │
│   │   ├── ministries/              # Módulo de Ministérios (Fase 2)
│   │   ├── communication/           # Módulo de Comunicação (Fase 2)
│   │   ├── events/                  # Módulo de Eventos (Fase 2)
│   │   ├── reports/                 # Módulo de Relatórios (Fase 2)
│   │   └── cards/                   # Módulo de Carteirinhas (Fase 3)
│   │
│   ├── jobs/                        # Background jobs (BullMQ)
│   │   ├── queues/
│   │   │   ├── email.queue.ts
│   │   │   ├── whatsapp.queue.ts
│   │   │   └── reports.queue.ts
│   │   │
│   │   └── processors/
│   │       ├── email.processor.ts
│   │       ├── whatsapp.processor.ts
│   │       └── reports.processor.ts
│   │
│   └── utils/                       # Utilitários
│       ├── logger.ts
│       ├── encryption.ts
│       ├── validators.ts
│       └── formatters.ts
│
├── test/                            # Testes
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .env
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── nest-cli.json
├── package.json
└── README.md
```

---

## 4. Shared (Código Compartilhado)

```
shared/
├── src/
│   ├── types/                       # Types compartilhados
│   │   ├── api.types.ts
│   │   ├── member.types.ts
│   │   ├── finance.types.ts
│   │   └── cell.types.ts
│   │
│   ├── constants/                   # Constantes compartilhadas
│   │   ├── modules.ts
│   │   ├── permissions.ts
│   │   └── status.ts
│   │
│   ├── utils/                       # Utilitários compartilhados
│   │   ├── validators.ts
│   │   └── formatters.ts
│   │
│   └── index.ts                     # Barrel export
│
├── tsconfig.json
├── package.json
└── README.md
```

---

## 5. Convenções de Nomenclatura

### 5.1 Arquivos e Pastas

```
✅ Correto:
- kebab-case para pastas: user-management/
- kebab-case para arquivos: user-profile.tsx
- PascalCase para componentes React: UserProfile.tsx
- camelCase para hooks: useUserProfile.ts
- camelCase para services: userProfile.service.ts
- kebab-case para CSS: user-profile.css

❌ Evitar:
- snake_case: user_profile.tsx
- PascalCase para pastas: UserManagement/
- Abreviações não óbvias: usr-prof.tsx
```

### 5.2 Componentes React

```typescript
// ✅ Correto
export function UserProfile({ userId }: UserProfileProps) {
  return <div>...</div>;
}

// ✅ Também correto (default export para lazy loading)
export default function UserProfile({ userId }: UserProfileProps) {
  return <div>...</div>;
}

// ❌ Evitar
export const UserProfile = ({ userId }: UserProfileProps) => {
  return <div>...</div>;
};
```

### 5.3 Hooks

```typescript
// ✅ Correto - sempre prefixo "use"
export function useUserProfile(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  // ...
  return { user, isLoading, error };
}
```

### 5.4 Services

```typescript
// ✅ Correto - sufixo ".service"
// members.service.ts
export class MembersService {
  async findAll() {}
  async findOne(id: string) {}
  async create(data: CreateMemberDto) {}
  async update(id: string, data: UpdateMemberDto) {}
  async remove(id: string) {}
}
```

### 5.5 Types e Interfaces

```typescript
// ✅ Correto - PascalCase, sufixos descritivos
export interface User {
  id: string;
  name: string;
}

export type UserRole = 'admin' | 'member' | 'guest';

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UserResponseDto {
  user: User;
  token: string;
}
```

---

## 6. Padrões de Organização

### 6.1 Barrel Exports (index.ts)

```typescript
// ✅ Usar barrel exports em cada módulo
// modules/members/index.tsx
export { default } from './pages/MembersListPage';
export * from './hooks/useMembers';
export * from './types/member.types';

// Permite importações limpas:
import MembersModule, { useMembers, Member } from '@/modules/members';
```

### 6.2 Feature-First Structure

```
Cada módulo é auto-contido com:
✅ components/  → Componentes específicos do módulo
✅ hooks/       → Hooks específicos do módulo
✅ services/    → Lógica de negócio
✅ types/       → Types do módulo
✅ pages/       → Páginas do módulo
✅ utils/       → Utilitários do módulo
```

### 6.3 Separation of Concerns

```typescript
// ❌ Evitar: Lógica de negócio no componente
function MembersList() {
  const [members, setMembers] = useState([]);
  
  useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(setMembers);
  }, []);
  
  return <div>{/* ... */}</div>;
}

// ✅ Correto: Separar em hook + service
// hooks/useMembers.ts
export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: () => membersService.findAll()
  });
}

// services/members.service.ts
export const membersService = {
  async findAll() {
    const { data } = await api.get('/members');
    return data;
  }
};

// components/MembersList.tsx
function MembersList() {
  const { data: members, isLoading } = useMembers();
  
  if (isLoading) return <LoadingState />;
  
  return <div>{/* ... */}</div>;
}
```

---

## 7. Path Aliases (TypeScript)

```json
// tsconfig.json (Frontend)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/modules/*": ["./src/modules/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/assets/*": ["./src/assets/*"]
    }
  }
}

// Uso:
import { Button } from '@/components/ui/button';
import { useMembers } from '@/modules/members';
import { api } from '@/lib/api/client';
```

```json
// tsconfig.json (Backend)
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@/common/*": ["src/common/*"],
      "@/modules/*": ["src/modules/*"],
      "@/config/*": ["src/config/*"],
      "@/database/*": ["src/database/*"]
    }
  }
}
```

---

## 8. Git Ignore

```gitignore
# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env.local
frontend/.env.production

# Backend
backend/node_modules/
backend/dist/
backend/.env

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# OS
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/
.nyc_output/
```

---

**Documento criado em:** 08/10/2025  
**Versão:** 1.0  
**Autor:** Droid (Factory AI)
