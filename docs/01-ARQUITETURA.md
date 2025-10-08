# 🏗️ Arquitetura Técnica - Conecta Igreja

## 1. Visão Geral

O **Conecta Igreja** é uma plataforma SaaS multitenant para gestão de igrejas, construída com arquitetura moderna e modular.

### 1.1 Princípios Arquiteturais

- **Multitenancy**: Isolamento completo de dados entre tenants (igrejas)
- **Modularidade**: Sistema de módulos habilitáveis por tenant
- **Escalabilidade**: Arquitetura preparada para crescimento horizontal
- **Segurança**: LGPD compliance, autenticação robusta, isolamento de dados
- **Performance**: Cache distribuído, paginação, lazy loading

---

## 2. Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                     USUÁRIOS FINAIS                          │
│  (Pastores, Líderes, Secretários, Membros)                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTPS (igrejaxyz.conectaigreja.com)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                     CDN / CLOUDFLARE                         │
│              (Cache estático, DDoS protection)               │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                   FRONTEND (React + Vite)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Módulos Lazy Loaded:                                │   │
│  │  • Membros  • CRM  • Finanças  • Células             │   │
│  │  • Ministérios  • Comunicação  • Eventos             │   │
│  │  • Relatórios  • Carteirinhas  • API                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ REST API / WebSocket
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                   BACKEND (NestJS)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middleware Stack:                                   │   │
│  │  1. Tenant Resolver (Subdomínio → TenantID)         │   │
│  │  2. Authentication (JWT)                             │   │
│  │  3. Module Access Control (Feature Flags)           │   │
│  │  4. RBAC Guard (Permissions)                         │   │
│  │  5. Rate Limiting                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Módulos do Sistema:                                 │   │
│  │  • TenantModule  • AuthModule  • MembersModule       │   │
│  │  • FinanceModule  • CRMModule  • CommunicationModule │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────────────────┘
                  │
      ┌───────────┴───────────┬────────────────┐
      │                       │                │
┌─────▼──────┐    ┌──────────▼─────┐   ┌─────▼──────┐
│ PostgreSQL │    │  Redis Cache   │   │  BullMQ    │
│ (Multi-    │    │  (Sessions,    │   │  (Jobs &   │
│  tenant)   │    │   Cache)       │   │   Queues)  │
└────────────┘    └────────────────┘   └────────────┘
      │
      │
┌─────▼──────────────────────────────────────────────┐
│     TENANT SCHEMAS (PostgreSQL)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Igreja A │  │ Igreja B │  │ Igreja C │  ...    │
│  └──────────┘  └──────────┘  └──────────┘         │
└────────────────────────────────────────────────────┘
```

---

## 3. Arquitetura Multitenant

### 3.1 Estratégia: Schema Separado por Tenant

Cada igreja (tenant) possui seu próprio **schema** dentro do mesmo banco PostgreSQL.

**Vantagens:**
- ✅ Isolamento de dados garantido
- ✅ Custo de infraestrutura otimizado
- ✅ Facilita backups e migrações por tenant
- ✅ Performance melhor que tabelas compartilhadas com tenant_id
- ✅ Permite customizações de schema por tenant (futuro)

**Estrutura no PostgreSQL:**
```sql
-- Schema público (dados globais)
public.tenants
public.system_modules
public.users (referência global)

-- Schema por tenant
tenant_igreja_xyz.members
tenant_igreja_xyz.transactions
tenant_igreja_xyz.cells
tenant_igreja_xyz.ministries
...
```

### 3.2 Identificação do Tenant

**Método Principal: Subdomínio**
```
https://igrejaxyz.conectaigreja.com  → Tenant: igrejaxyz
https://primeiraigreja.conectaigreja.com → Tenant: primeiraigreja
```

**Fluxo de Resolução:**
```typescript
// 1. Middleware extrai subdomain do request
const subdomain = extractSubdomain(req.hostname);

// 2. Busca tenant no cache ou DB
const tenant = await tenantService.findBySlug(subdomain);

// 3. Valida se tenant está ativo
if (!tenant.isActive) throw new ForbiddenException();

// 4. Define o schema PostgreSQL para a conexão
await setSearchPath(tenant.dbSchema);

// 5. Injeta tenant no contexto da request
req.tenant = tenant;
```

### 3.3 Isolamento de Dados

**Garantias implementadas:**
1. **Middleware Tenant-Aware**: Toda request passa pelo tenant resolver
2. **Search Path PostgreSQL**: Cada query automaticamente usa o schema correto
3. **Decorators de Validação**: Guards que validam tenant_id em todas as operações
4. **Testes de Isolamento**: Suite de testes automatizados para garantir zero vazamento

**Exemplo de Query Segura:**
```typescript
// Backend (NestJS + TypeORM)
@Injectable()
export class MembersService {
  // O schema já foi definido pelo middleware
  async findAll() {
    // Esta query automaticamente usa: tenant_igreja_xyz.members
    return this.membersRepo.find();
  }
  
  // Proteção adicional com decorator
  @RequireTenant()
  async findOne(id: string) {
    // Valida se o ID pertence ao tenant da request
    return this.membersRepo.findOne({ where: { id } });
  }
}
```

---

## 4. Sistema de Módulos (Feature Flags)

### 4.1 Módulos Disponíveis

| Módulo | Key | Descrição | Fase |
|--------|-----|-----------|------|
| Gestão de Membros | `members` | CRUD de membros, relatórios | MVP |
| CRM | `crm` | Funil de relacionamento (Kanban) | Fase 2 |
| Finanças | `finance` | Dízimos, ofertas, despesas, relatórios | MVP |
| Células | `cells` | Gestão de células, frequência, relatórios | MVP |
| Ministérios | `ministries` | Cadastro, escalas, comunicação | Fase 2 |
| Comunicação | `communication` | Email, WhatsApp, automações | Fase 2 |
| Eventos | `events` | Agenda, inscrições | Fase 2 |
| Relatórios | `reports` | Dashboards, exportação | Fase 2 |
| Carteirinhas | `cards` | Geração de carteirinhas digitais | Fase 3 |
| API Pública | `api` | API REST para integrações | Fase 3 |

### 4.2 Estrutura de Dados

```typescript
// Tabela global: public.system_modules
interface SystemModule {
  id: string;
  key: string; // 'members', 'crm', 'finance'
  name: string;
  description: string;
  icon: string;
  route: string; // '/members', '/crm'
  minPlan: 'basic' | 'pro' | 'premium';
  isActive: boolean;
}

// Tabela global: public.tenant_modules
interface TenantModule {
  id: string;
  tenantId: string;
  moduleKey: string;
  enabled: boolean;
  enabledAt: Date;
  disabledAt?: Date;
  config: Record<string, any>; // Configurações específicas
}
```

### 4.3 Implementação Frontend

**Hook customizado:**
```typescript
// hooks/useModuleAccess.ts
export function useModuleAccess(moduleKey: string): boolean {
  const { tenant } = useTenant();
  return tenant.enabledModules.includes(moduleKey);
}

// hooks/useEnabledModules.ts
export function useEnabledModules() {
  const { tenant } = useTenant();
  const modules = SYSTEM_MODULES.filter(m => 
    tenant.enabledModules.includes(m.key)
  );
  return modules;
}
```

**Roteamento dinâmico:**
```typescript
// App.tsx
function App() {
  const enabledModules = useEnabledModules();
  
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      
      {enabledModules.map(module => (
        <Route 
          key={module.key}
          path={module.route}
          element={
            <Suspense fallback={<ModuleLoader />}>
              <LazyModule moduleKey={module.key} />
            </Suspense>
          }
        />
      ))}
    </Routes>
  );
}

// LazyModule.tsx
const moduleComponents = {
  members: lazy(() => import('@/modules/members')),
  crm: lazy(() => import('@/modules/crm')),
  finance: lazy(() => import('@/modules/finance')),
  // ...
};

function LazyModule({ moduleKey }: { moduleKey: string }) {
  const Component = moduleComponents[moduleKey];
  return <Component />;
}
```

**Menu dinâmico:**
```typescript
// components/Sidebar.tsx
function Sidebar() {
  const enabledModules = useEnabledModules();
  
  return (
    <nav>
      {enabledModules.map(module => (
        <NavLink key={module.key} to={module.route}>
          <Icon name={module.icon} />
          {module.name}
        </NavLink>
      ))}
    </nav>
  );
}
```

### 4.4 Implementação Backend

**Decorator customizado:**
```typescript
// decorators/require-module.decorator.ts
export const RequireModule = (moduleKey: string) => {
  return applyDecorators(
    SetMetadata('module', moduleKey),
    UseGuards(ModuleAccessGuard)
  );
};

// guards/module-access.guard.ts
@Injectable()
export class ModuleAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const requiredModule = this.reflector.get<string>('module', context.getHandler());
    const tenant = request.tenant;
    
    if (!tenant.enabledModules.includes(requiredModule)) {
      throw new ForbiddenException(
        `Module ${requiredModule} is not enabled for this tenant`
      );
    }
    
    return true;
  }
}
```

**Uso nos Controllers:**
```typescript
@Controller('members')
@RequireModule('members')
export class MembersController {
  // Todos os endpoints aqui requerem o módulo 'members' habilitado
  
  @Get()
  async findAll() {
    // ...
  }
}
```

---

## 5. Autenticação e Autorização

### 5.1 Fluxo de Autenticação (JWT)

```
┌─────────┐                                  ┌─────────┐
│ Cliente │                                  │  API    │
└────┬────┘                                  └────┬────┘
     │                                            │
     │  POST /auth/login                          │
     │  { email, password, tenant }               │
     │───────────────────────────────────────────▶│
     │                                            │
     │                                    Valida credenciais
     │                                    Busca tenant
     │                                    Busca permissions
     │                                            │
     │  200 OK                                    │
     │  { accessToken, refreshToken, user }       │
     │◀───────────────────────────────────────────│
     │                                            │
     │  GET /members                              │
     │  Authorization: Bearer {accessToken}       │
     │───────────────────────────────────────────▶│
     │                                            │
     │                                    Valida JWT
     │                                    Extrai tenant
     │                                    Valida módulo
     │                                    Valida permission
     │                                            │
     │  200 OK                                    │
     │  { data: [...] }                           │
     │◀───────────────────────────────────────────│
```

### 5.2 Estrutura do JWT

```typescript
interface JwtPayload {
  sub: string; // userId
  email: string;
  tenantId: string;
  tenantSlug: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}
```

### 5.3 Sistema RBAC (Role-Based Access Control)

**Estrutura de Permissões:**
```
permission = module:resource:action:scope

Exemplos:
- members:members:read:all        → Ver todos os membros
- members:members:update:own      → Editar apenas próprios dados
- finance:transactions:create:all → Criar transações financeiras
- cells:reports:read:group        → Ver relatórios da própria célula
```

**Roles Padrão do Sistema:**
```typescript
const DEFAULT_ROLES = {
  SUPER_ADMIN: {
    name: 'Super Administrador',
    permissions: ['*:*:*:*'], // Acesso total
    isSystem: true
  },
  PASTOR: {
    name: 'Pastor',
    permissions: [
      'members:*:*:all',
      'finance:*:*:all',
      'cells:*:*:all',
      'ministries:*:*:all',
      'crm:*:*:all',
      'reports:*:read:all',
      'settings:*:*:all'
    ],
    isSystem: true
  },
  SECRETARY: {
    name: 'Secretário',
    permissions: [
      'members:members:*:all',
      'members:reports:read:all',
      'events:*:*:all',
      'cells:cells:read:all'
    ],
    isSystem: true
  },
  TREASURER: {
    name: 'Tesoureiro',
    permissions: [
      'finance:*:*:all',
      'finance:reports:read:all',
      'members:members:read:all'
    ],
    isSystem: true
  },
  CELL_LEADER: {
    name: 'Líder de Célula',
    permissions: [
      'members:members:read:all',
      'cells:cells:read:group',
      'cells:cells:update:group',
      'cells:attendance:*:group',
      'cells:reports:*:group'
    ],
    isSystem: true
  },
  MEMBER: {
    name: 'Membro',
    permissions: [
      'members:members:read:own',
      'members:members:update:own',
      'events:events:read:all',
      'events:registrations:create:own'
    ],
    isSystem: true
  }
};
```

**Guard de Permissões:**
```typescript
// decorators/require-permission.decorator.ts
export const RequirePermission = (
  module: string,
  resource: string,
  action: string,
  scope: 'own' | 'group' | 'all' = 'all'
) => {
  return applyDecorators(
    SetMetadata('permission', { module, resource, action, scope }),
    UseGuards(PermissionGuard)
  );
};

// Uso
@Controller('members')
export class MembersController {
  @Get()
  @RequirePermission('members', 'members', 'read', 'all')
  async findAll() {
    // ...
  }
  
  @Patch(':id')
  @RequirePermission('members', 'members', 'update', 'all')
  async update(@Param('id') id: string) {
    // ...
  }
}
```

---

## 6. Banco de Dados

### 6.1 Estrutura de Schemas

```
conecta_igreja_db (PostgreSQL)
│
├── public (schema global)
│   ├── tenants
│   ├── users (referência global)
│   ├── system_modules
│   ├── tenant_modules
│   ├── subscriptions
│   └── audit_logs
│
├── tenant_igreja_abc
│   ├── members
│   ├── families
│   ├── cells
│   ├── ministries
│   ├── transactions
│   ├── events
│   ├── crm_contacts
│   └── ...
│
└── tenant_igreja_xyz
    ├── members
    ├── families
    └── ...
```

### 6.2 Tabelas Globais (public schema)

```sql
-- Tenants (Igrejas)
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL, -- para subdomain
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  logo_url TEXT,
  db_schema VARCHAR(63) NOT NULL UNIQUE, -- tenant_igreja_xyz
  is_active BOOLEAN DEFAULT true,
  subscription_plan VARCHAR(50),
  subscription_status VARCHAR(50),
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_active ON public.tenants(is_active);

-- Usuários (Referência Global)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Usuários por Tenant
CREATE TABLE public.tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  member_id UUID, -- referência para tenant_xxx.members
  roles JSONB DEFAULT '[]', -- ['pastor', 'secretary']
  is_active BOOLEAN DEFAULT true,
  invited_at TIMESTAMP,
  joined_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

CREATE INDEX idx_tenant_users_tenant ON public.tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_user ON public.tenant_users(user_id);

-- Módulos do Sistema
CREATE TABLE public.system_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  route VARCHAR(100),
  min_plan VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  display_order INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Módulos Habilitados por Tenant
CREATE TABLE public.tenant_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  module_key VARCHAR(50) REFERENCES public.system_modules(key),
  enabled BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  enabled_at TIMESTAMP DEFAULT NOW(),
  disabled_at TIMESTAMP,
  UNIQUE(tenant_id, module_key)
);

CREATE INDEX idx_tenant_modules_tenant ON public.tenant_modules(tenant_id);
```

### 6.3 Tabelas por Tenant (Schema Separado)

**Schema: tenant_{slug}**

```sql
-- Membros
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- referência para public.users (se tiver login)
  
  -- Dados Pessoais
  full_name VARCHAR(255) NOT NULL,
  photo_url TEXT,
  gender VARCHAR(20),
  birth_date DATE,
  cpf VARCHAR(14) UNIQUE,
  
  -- Contato
  email VARCHAR(255),
  phone VARCHAR(20),
  mobile VARCHAR(20),
  
  -- Endereço
  address_street VARCHAR(255),
  address_number VARCHAR(20),
  address_complement VARCHAR(100),
  address_neighborhood VARCHAR(100),
  address_city VARCHAR(100),
  address_state VARCHAR(2),
  address_zip VARCHAR(10),
  address_coordinates POINT, -- Para mapa de células
  
  -- Status na Igreja
  status VARCHAR(50) DEFAULT 'visitor', -- visitor, integrating, member, inactive
  baptism_date DATE,
  join_date DATE,
  
  -- Família
  family_id UUID,
  relationship_type VARCHAR(50), -- head, spouse, child
  
  -- LGPD
  consent_data_collection BOOLEAN DEFAULT false,
  consent_communications BOOLEAN DEFAULT false,
  consent_photo_usage BOOLEAN DEFAULT false,
  consent_granted_at TIMESTAMP,
  
  -- Metadados
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_members_status ON members(status) WHERE is_active = true;
CREATE INDEX idx_members_birth_date ON members(birth_date);
CREATE INDEX idx_members_family ON members(family_id);

-- Células
CREATE TABLE cells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES members(id),
  supervisor_id UUID REFERENCES members(id),
  
  -- Localização
  meeting_address VARCHAR(255),
  meeting_coordinates POINT,
  
  -- Horário
  meeting_day_of_week INT, -- 0-6 (domingo-sábado)
  meeting_time TIME,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, paused
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Membros de Células
CREATE TABLE cell_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID REFERENCES cells(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- leader, coleader, member
  joined_at TIMESTAMP DEFAULT NOW(),
  left_at TIMESTAMP,
  UNIQUE(cell_id, member_id, left_at)
);

-- Reuniões de Células
CREATE TABLE cell_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID REFERENCES cells(id) ON DELETE CASCADE,
  meeting_date DATE NOT NULL,
  leader_id UUID REFERENCES members(id),
  
  -- Estatísticas
  total_members INT,
  total_visitors INT,
  total_children INT,
  total_present INT,
  
  -- Conteúdo
  topic VARCHAR(255),
  notes TEXT,
  
  -- Frutos
  conversions INT DEFAULT 0,
  reconciliations INT DEFAULT 0,
  baptisms_spirit INT DEFAULT 0,
  
  created_by UUID REFERENCES members(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Frequência em Reuniões de Células
CREATE TABLE cell_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES cell_meetings(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  is_visitor BOOLEAN DEFAULT false,
  attended BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(meeting_id, member_id)
);

-- Transações Financeiras
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Tipo
  type VARCHAR(20) NOT NULL, -- income, expense
  category VARCHAR(50) NOT NULL, -- tithe, offering, salary, rent, utilities
  
  -- Valores
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Descrição
  description TEXT,
  reference_date DATE NOT NULL,
  
  -- Membro (para dízimos/ofertas)
  member_id UUID REFERENCES members(id),
  is_anonymous BOOLEAN DEFAULT false,
  
  -- Categorização
  cost_center VARCHAR(100), -- ministry, event, general
  cost_center_id UUID,
  
  -- Status
  status VARCHAR(50) DEFAULT 'completed', -- pending, completed, cancelled
  payment_method VARCHAR(50), -- cash, pix, card, transfer
  
  -- Recibo
  receipt_number VARCHAR(50),
  receipt_issued BOOLEAN DEFAULT false,
  receipt_url TEXT,
  
  -- Auditoria (NUNCA DELETE)
  cancelled_at TIMESTAMP,
  cancelled_by UUID,
  cancel_reason TEXT,
  
  created_by UUID REFERENCES members(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_type ON transactions(type, reference_date DESC);
CREATE INDEX idx_transactions_member ON transactions(member_id) WHERE member_id IS NOT NULL;
CREATE INDEX idx_transactions_date ON transactions(reference_date DESC);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Log de Auditoria Financeira
CREATE TABLE transaction_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  event VARCHAR(50) NOT NULL, -- created, updated, cancelled
  before_data JSONB,
  after_data JSONB,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ministérios
CREATE TABLE ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES members(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Membros de Ministérios
CREATE TABLE ministry_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ministry_id UUID REFERENCES ministries(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  left_at TIMESTAMP,
  UNIQUE(ministry_id, member_id, left_at)
);

-- Eventos
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  location VARCHAR(255),
  
  -- Inscrições
  max_attendees INT,
  registration_enabled BOOLEAN DEFAULT false,
  registration_deadline TIMESTAMP,
  
  -- Organização
  organizer_ministry_id UUID REFERENCES ministries(id),
  
  is_public BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inscrições em Eventos
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, cancelled, waitlist
  registered_at TIMESTAMP DEFAULT NOW(),
  cancelled_at TIMESTAMP,
  UNIQUE(event_id, member_id)
);

-- CRM - Contatos (Funil)
CREATE TABLE crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id), -- Pode ser null se ainda não for membro
  
  -- Dados básicos
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  
  -- Estágio no Funil
  stage VARCHAR(50) DEFAULT 'visitor', -- visitor, integrating, member, disciple
  
  -- Origem
  source VARCHAR(100), -- facebook, instagram, friend_referral, event
  first_contact_date DATE,
  
  -- Responsável
  assigned_to UUID REFERENCES members(id),
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CRM - Tarefas
CREATE TABLE crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Responsável
  assigned_to UUID REFERENCES members(id),
  
  -- Prazo
  due_date TIMESTAMP,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
  
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CRM - Interações
CREATE TABLE crm_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL, -- call, whatsapp, email, visit, note
  direction VARCHAR(20), -- inbound, outbound
  
  notes TEXT,
  
  created_by UUID REFERENCES members(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 7. Segurança e LGPD

### 7.1 Conformidade com LGPD

**Requisitos implementados:**

1. **Consentimento Explícito**
```typescript
// Captura de consentimento no cadastro
interface MemberConsent {
  dataCollection: boolean; // Coleta e armazenamento de dados
  communications: boolean; // Receber comunicações
  photoUsage: boolean; // Uso de imagem
  grantedAt: Date;
  ipAddress: string;
}
```

2. **Direito ao Esquecimento**
```typescript
// Anonimização de dados (soft delete)
async anonymizeMember(memberId: string) {
  await db.member.update({
    where: { id: memberId },
    data: {
      full_name: 'Usuário Anônimo',
      email: `anonymized-${uuid()}@deleted.local`,
      phone: null,
      mobile: null,
      cpf: null,
      address_street: null,
      photo_url: null,
      consent_data_collection: false,
      consent_communications: false,
      consent_photo_usage: false,
      deleted_at: new Date()
    }
  });
  
  // Manter apenas dados essenciais para auditoria
  // Ex: transações financeiras (sem nome, apenas ID anônimo)
}
```

3. **Portabilidade de Dados**
```typescript
// Exportação completa dos dados do usuário
async exportMemberData(memberId: string): Promise<UserDataExport> {
  return {
    personal_data: await getMemberData(memberId),
    financial_data: await getMemberTransactions(memberId),
    attendance_data: await getMemberAttendance(memberId),
    interactions: await getCRMInteractions(memberId),
    consents: await getMemberConsents(memberId),
    export_date: new Date().toISOString()
  };
}
```

4. **Segurança de Dados Sensíveis**
```typescript
// Criptografia de campos sensíveis
import { createCipheriv, createDecipheriv } from 'crypto';

// CPF sempre criptografado no banco
const encryptCPF = (cpf: string): string => {
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  return cipher.update(cpf, 'utf8', 'hex') + cipher.final('hex');
};

// Logs de acesso a dados sensíveis
async auditSensitiveDataAccess(userId: string, action: string, resource: string) {
  await db.auditLog.create({
    userId,
    action,
    resource,
    ipAddress: request.ip,
    userAgent: request.headers['user-agent'],
    timestamp: new Date()
  });
}
```

### 7.2 Segurança da Aplicação

**Camadas de Proteção:**

1. **Autenticação**
   - JWT com refresh token rotation
   - Token expiration: 15 minutos (access), 7 dias (refresh)
   - Logout em todos os dispositivos

2. **Autorização**
   - RBAC granular
   - Guards em todos os endpoints
   - Validação de tenant em cada request

3. **Proteção contra Ataques**
```typescript
// Rate Limiting
@UseGuards(ThrottlerGuard)
@Throttle(10, 60) // 10 requests por minuto
@Controller('auth')
export class AuthController {}

// SQL Injection Protection
// TypeORM/Prisma já protege, mas validação adicional:
import { IsUUID, IsEmail, IsString, MaxLength } from 'class-validator';

class CreateMemberDto {
  @IsString()
  @MaxLength(255)
  fullName: string;
  
  @IsEmail()
  email: string;
  
  @IsUUID()
  tenantId: string;
}

// XSS Protection
import helmet from 'helmet';
app.use(helmet());

// CSRF Protection
app.use(csurf({ cookie: true }));
```

4. **Auditoria Completa**
```typescript
// Interceptor global de auditoria
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { user, tenant, method, url, body } = request;
    
    // Log da operação
    this.logger.log({
      userId: user?.id,
      tenantId: tenant?.id,
      method,
      url,
      timestamp: new Date(),
      ipAddress: request.ip
    });
    
    return next.handle();
  }
}
```

---

## 8. Performance e Escalabilidade

### 8.1 Estratégias de Performance

**Frontend:**
```typescript
// 1. Code Splitting por módulo
const MembersModule = lazy(() => import('@/modules/members'));

// 2. Virtualization para listas longas
import { useVirtualizer } from '@tanstack/react-virtual';

// 3. React Query para cache agressivo
const { data } = useQuery({
  queryKey: ['members', filters],
  queryFn: () => api.members.list(filters),
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000 // 10 minutos
});

// 4. Debounce em searches
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const [search, setSearch] = useState('');
const debouncedSearch = useDebouncedValue(search, 500);
```

**Backend:**
```typescript
// 1. Paginação obrigatória
interface PaginationDto {
  page: number = 1;
  pageSize: number = 20;
}

// 2. Cache com Redis
@Injectable()
export class MembersService {
  @Cacheable({ ttl: 300 }) // 5 minutos
  async getStats(tenantId: string) {
    return await this.calculateStats(tenantId);
  }
}

// 3. Índices estratégicos no PostgreSQL
CREATE INDEX CONCURRENTLY idx_members_search 
ON members USING gin(to_tsvector('portuguese', full_name || ' ' || email));

// 4. Queries otimizadas (evitar N+1)
const members = await db.member.findMany({
  include: {
    cell: true, // Eager loading
    family: true
  }
});
```

### 8.2 Escalabilidade Horizontal

**Arquitetura preparada para:**

1. **Load Balancer** na frente de múltiplas instâncias do backend
2. **Sessões stateless** (JWT), sem dependência de memória do servidor
3. **Cache distribuído** (Redis Cluster)
4. **Banco de dados** com read replicas para queries pesadas
5. **Queue distribuída** (BullMQ com Redis)

```
                    ┌─────────────┐
                    │Load Balancer│
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │ API #1  │       │ API #2  │       │ API #3  │
   └────┬────┘       └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                  ┌────────┴────────┐
                  │                 │
            ┌─────▼─────┐    ┌─────▼─────┐
            │PostgreSQL │    │   Redis   │
            │ (Primary) │    │  Cluster  │
            └─────┬─────┘    └───────────┘
                  │
            ┌─────▼─────┐
            │PostgreSQL │
            │(Read Repl)│
            └───────────┘
```

---

## 9. Monitoramento e Observabilidade

### 9.1 Logging Estruturado

```typescript
import { Logger } from 'winston';

// Formato padrão de log
logger.info('Member created', {
  level: 'info',
  timestamp: new Date().toISOString(),
  tenantId: 'tenant-uuid',
  userId: 'user-uuid',
  action: 'member.created',
  resource: 'members',
  resourceId: 'member-uuid',
  metadata: {
    source: 'web',
    duration: 150
  }
});
```

### 9.2 Métricas (Prometheus)

```typescript
import { Counter, Histogram } from 'prom-client';

// Contadores
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total de requests HTTP',
  labelNames: ['method', 'route', 'status_code', 'tenant_id']
});

// Histogramas (latência)
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requests HTTP',
  labelNames: ['method', 'route', 'tenant_id'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

// Uso
httpRequestsTotal.inc({ 
  method: 'GET', 
  route: '/members', 
  status_code: 200,
  tenant_id: tenant.id 
});
```

### 9.3 Error Tracking (Sentry)

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  beforeSend(event, hint) {
    // Remover dados sensíveis
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers['authorization'];
    }
    return event;
  }
});

// Captura de erros com contexto
try {
  await createMember(data);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      tenant_id: tenant.id,
      module: 'members'
    },
    extra: {
      memberData: sanitize(data)
    }
  });
  throw error;
}
```

---

## 10. Deployment e Infraestrutura

### 10.1 Arquitetura de Deploy Sugerida

**Opção 1: Cloud Tradicional (AWS/GCP/Azure)**
```
Frontend:
- Build estático (Vite) → S3/CloudFront ou Vercel

Backend:
- Docker containers → ECS/EKS, GKE, ou AKS
- Auto-scaling baseado em CPU/memória

Database:
- PostgreSQL gerenciado (RDS, Cloud SQL)
- Read replicas para relatórios

Cache:
- Redis gerenciado (ElastiCache, Memorystore)

Storage:
- S3 para fotos, PDFs, backups
```

**Opção 2: Plataforma como Serviço (PaaS)**
```
- Frontend: Vercel ou Netlify
- Backend: Railway.app, Render, ou Fly.io
- Database: Supabase ou Neon (PostgreSQL serverless)
- Cache: Upstash (Redis serverless)
```

### 10.2 Docker Compose (Desenvolvimento)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: conecta_igreja
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/conecta_igreja
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-secret-key
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:3000
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 11. Próximos Passos

1. **Revisão e Aprovação** desta arquitetura
2. **Setup do Ambiente** de desenvolvimento
3. **Implementação do MVP** (Fase 1):
   - Autenticação + Multitenant
   - Sistema de Módulos
   - Módulo de Membros
   - Módulo de Finanças
   - Módulo de Células

---

**Documento criado em:** 08/10/2025  
**Versão:** 1.0  
**Autor:** Droid (Factory AI)
