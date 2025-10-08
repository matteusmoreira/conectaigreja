# 🛠️ Stack de Tecnologias - Conecta Igreja

## 1. Resumo Executivo

```
Frontend:  React 18 + TypeScript + Vite
Backend:   NestJS + TypeScript
Database:  PostgreSQL 15
Cache:     Redis 7
Queue:     BullMQ
Styling:   Tailwind CSS + shadcn/ui
State:     Zustand + React Query
Auth:      JWT
```

---

## 2. Frontend Stack

### 2.1 Core

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **React** | 18.3+ | Framework consolidado, grande ecossistema, hooks modernos |
| **TypeScript** | 5.5+ | Type safety, melhor DX, menos bugs em produção |
| **Vite** | 5.4+ | Build ultra-rápido, HMR instantâneo, melhor que CRA |

**Instalação:**
```bash
npm create vite@latest frontend -- --template react-ts
```

### 2.2 UI Framework

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **shadcn/ui** | latest | Componentes modernos, customizáveis, Tailwind-based, copy-paste friendly |
| **Tailwind CSS** | 3.4+ | Utility-first, rápido, menor CSS final, DX excelente |
| **Radix UI** | 1.1+ | Primitivos acessíveis (usado pelo shadcn/ui) |
| **Lucide React** | 0.300+ | Ícones modernos, leves, tree-shakeable |

**Instalação:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

npx shadcn-ui@latest init
npx shadcn-ui@latest add button input dialog select table
```

**Por que shadcn/ui ao invés de Material-UI ou Ant Design?**
- ✅ Menor bundle size (copy-paste, não biblioteca inteira)
- ✅ Totalmente customizável (código no seu projeto)
- ✅ Design moderno e acessível
- ✅ Tailwind-based (consistência de estilo)
- ✅ Sem conflito de estilos globais

### 2.3 Estado e Data Fetching

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Zustand** | 4.5+ | Estado global simples, sem boilerplate, TypeScript-first |
| **React Query (TanStack Query)** | 5.0+ | Cache inteligente, refetch automático, otimistic updates |
| **React Hook Form** | 7.51+ | Forms performáticos, fácil validação, menos re-renders |
| **Zod** | 3.22+ | Validação type-safe, integra perfeitamente com RHF |

**Instalação:**
```bash
npm install zustand @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
```

**Exemplo de uso:**
```typescript
// Store (Zustand)
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null })
}));

// Data Fetching (React Query)
import { useQuery, useMutation } from '@tanstack/react-query';

export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: () => api.members.list(),
    staleTime: 5 * 60 * 1000 // 5 min
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMemberDto) => api.members.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    }
  });
}

// Form (React Hook Form + Zod)
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const memberSchema = z.object({
  fullName: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\d{10,11}$/, 'Telefone inválido')
});

type MemberForm = z.infer<typeof memberSchema>;

function MemberForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<MemberForm>({
    resolver: zodResolver(memberSchema)
  });
  
  const onSubmit = (data: MemberForm) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('fullName')} />
      {errors.fullName && <span>{errors.fullName.message}</span>}
    </form>
  );
}
```

### 2.4 Roteamento

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **React Router** | 6.22+ | Padrão da indústria, declarativo, code splitting fácil |

**Instalação:**
```bash
npm install react-router-dom
```

### 2.5 Bibliotecas Específicas

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| **@tanstack/react-table** | 8.11+ | Tabelas avançadas (sorting, filtering, pagination) |
| **@tanstack/react-virtual** | 3.0+ | Virtualização de listas longas |
| **date-fns** | 3.0+ | Manipulação de datas (mais leve que moment) |
| **recharts** | 2.10+ | Gráficos para dashboards |
| **react-dropzone** | 14.2+ | Upload de arquivos |
| **qrcode.react** | 3.1+ | Geração de QR codes |
| **react-pdf** | 7.7+ | Visualização de PDFs |
| **@react-pdf/renderer** | 3.0+ | Geração de PDFs |
| **React Flow** | 11.10+ | Construtor de fluxos (Fase 3) |

**Instalação:**
```bash
npm install @tanstack/react-table @tanstack/react-virtual
npm install date-fns recharts
npm install react-dropzone qrcode.react
npm install react-pdf @react-pdf/renderer
npm install reactflow
```

### 2.6 Utilitários

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| **clsx** | 2.1+ | Conditional classes |
| **tailwind-merge** | 2.2+ | Merge Tailwind classes |
| **axios** | 1.6+ | HTTP client |

**Instalação:**
```bash
npm install clsx tailwind-merge axios
```

**Helper function (cn):**
```typescript
// lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Uso:
<div className={cn(
  'px-4 py-2',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50'
)} />
```

---

## 3. Backend Stack

### 3.1 Database (Supabase)

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Supabase** | latest | PostgreSQL gerenciado, Auth, Storage, Realtime, Edge Functions |
| **@supabase/supabase-js** | 2.x+ | Cliente oficial JavaScript/TypeScript |

**Instalação:**
```bash
npm install @supabase/supabase-js
npm install -g supabase  # CLI
```

**Configuração:**
```typescript
// Frontend
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Backend (se usar NestJS)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Admin access
);
```

### 3.2 Backend API (Opcional - NestJS)

> **Nota**: Com Supabase, o backend tradicional é **opcional**. Você pode usar apenas Edge Functions ou manter NestJS para lógica complexa.

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **NestJS** | 10.0+ | Arquitetura modular, TypeScript-first, escalável, DI nativo |
| **TypeScript** | 5.5+ | Type safety, produtividade, menos bugs |
| **Node.js** | 20 LTS | Runtime estável e performático |

**Instalação:**
```bash
npm i -g @nestjs/cli
nest new backend
```

**Configuração:**
```typescript
// database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false, // NUNCA true em produção
  logging: process.env.NODE_ENV === 'development'
};
```

### 3.3 Autenticação

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **@nestjs/jwt** | 10.0+ | JWT tokens para auth stateless |
| **@nestjs/passport** | 10.0+ | Estratégias de autenticação |
| **bcrypt** | 5.1+ | Hash de senhas seguro |

**Instalação:**
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcrypt
npm install -D @types/bcrypt @types/passport-jwt
```

**Exemplo:**
```typescript
// auth.service.ts
import * as bcrypt from 'bcrypt';

async hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async validatePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

async login(user: User) {
  const payload = {
    sub: user.id,
    email: user.email,
    tenantId: user.tenantId
  };
  
  return {
    access_token: this.jwtService.sign(payload),
    refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' })
  };
}
```

### 3.4 Validação

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **class-validator** | 0.14+ | Validação via decorators |
| **class-transformer** | 0.5+ | Transform plain objects para classes |

**Instalação:**
```bash
npm install class-validator class-transformer
```

**Exemplo:**
```typescript
// create-member.dto.ts
import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  fullName: string;
  
  @IsEmail()
  email: string;
  
  @IsString()
  @IsOptional()
  phone?: string;
}

// No controller:
@Post()
async create(@Body() createMemberDto: CreateMemberDto) {
  return this.membersService.create(createMemberDto);
}
```

### 3.5 Cache

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Redis** | 7+ | Cache distribuído, pub/sub, queues |
| **@nestjs/cache-manager** | 2.0+ | Abstração de cache para NestJS |

**Instalação:**
```bash
npm install @nestjs/cache-manager cache-manager
npm install cache-manager-redis-yet
```

**Configuração:**
```typescript
// app.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT)
          }
        }),
        ttl: 300 // 5 minutos padrão
      })
    })
  ]
})
export class AppModule {}

// Uso:
@Injectable()
export class MembersService {
  @Inject(CACHE_MANAGER)
  private cacheManager: Cache;
  
  async getStats(tenantId: string) {
    const cacheKey = `tenant:${tenantId}:stats`;
    
    let stats = await this.cacheManager.get(cacheKey);
    if (stats) return stats;
    
    stats = await this.calculateStats(tenantId);
    await this.cacheManager.set(cacheKey, stats, 300);
    
    return stats;
  }
}
```

### 3.6 Background Jobs

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **BullMQ** | 5.0+ | Queue moderna, Redis-based, scheduler, retries |
| **@nestjs/bull** | 10.0+ | Integração NestJS com Bull |

**Instalação:**
```bash
npm install @nestjs/bull bull
```

**Exemplo:**
```typescript
// email.queue.ts
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}
  
  async sendWelcomeEmail(userId: string, email: string) {
    await this.emailQueue.add('welcome', {
      userId,
      email
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });
  }
}

// email.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('email')
export class EmailProcessor {
  @Process('welcome')
  async handleWelcomeEmail(job: Job) {
    const { email } = job.data;
    // Enviar email
    console.log(`Sending welcome email to ${email}`);
    await this.mailerService.send({ ... });
  }
}
```

### 3.7 Logging e Monitoring

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Winston** | 3.11+ | Logging estruturado, múltiplos transportes |
| **Prom-client** | 15.0+ | Métricas para Prometheus |
| **@sentry/node** | 7.0+ | Error tracking e performance monitoring |

**Instalação:**
```bash
npm install winston nest-winston
npm install prom-client
npm install @sentry/node
```

### 3.8 Documentação API

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **@nestjs/swagger** | 7.0+ | Geração automática de OpenAPI/Swagger |

**Instalação:**
```bash
npm install @nestjs/swagger
```

**Configuração:**
```typescript
// main.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Conecta Igreja API')
  .setDescription('API REST para gestão de igrejas')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

**Uso nos DTOs:**
```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({ description: 'Nome completo do membro', example: 'João Silva' })
  @IsString()
  fullName: string;
  
  @ApiProperty({ description: 'Email do membro', example: 'joao@email.com' })
  @IsEmail()
  email: string;
}
```

### 3.9 Email

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **@nestjs-modules/mailer** | 1.9+ | Envio de emails com templates |
| **nodemailer** | 6.9+ | Transport de emails |

**Instalação:**
```bash
npm install @nestjs-modules/mailer nodemailer
npm install -D @types/nodemailer
```

### 3.10 Cron Jobs

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **@nestjs/schedule** | 4.0+ | Tarefas agendadas (cron, intervals, timeouts) |

**Instalação:**
```bash
npm install @nestjs/schedule
```

**Exemplo:**
```typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyReport() {
    console.log('Gerando relatório diário...');
    // Lógica aqui
  }
  
  @Cron('0 0 * * 0') // Todo domingo à meia-noite
  async handleWeeklyReport() {
    console.log('Gerando relatório semanal...');
  }
}
```

---

## 4. Infraestrutura e DevOps

### 4.1 Containerização

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Docker** | 24+ | Ambientes consistentes, fácil deploy |
| **Docker Compose** | 2.20+ | Orquestração local multi-container |

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
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
      JWT_SECRET: your-secret-key-change-in-production
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

### 4.2 CI/CD

| Tecnologia | Justificativa |
|------------|---------------|
| **GitHub Actions** | CI/CD nativo GitHub, gratuito para repositórios públicos |

**.github/workflows/ci.yml:**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: cd frontend && npm ci
      
      - name: Lint
        run: cd frontend && npm run lint
      
      - name: Type check
        run: cd frontend && npm run type-check
      
      - name: Test
        run: cd frontend && npm run test
      
      - name: Build
        run: cd frontend && npm run build
  
  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        run: cd backend && npm ci
      
      - name: Lint
        run: cd backend && npm run lint
      
      - name: Type check
        run: cd backend && npm run build
      
      - name: Test
        run: cd backend && npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
```

### 4.3 Testes

#### Frontend

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Vitest** | 1.0+ | Test runner rápido, integrado com Vite |
| **React Testing Library** | 14.0+ | Testes focados no comportamento do usuário |
| **MSW** | 2.0+ | Mock Service Worker para testes de API |

**Instalação:**
```bash
npm install -D vitest @vitest/ui
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D msw
```

#### Backend

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Jest** | 29.0+ | Framework de testes completo |
| **Supertest** | 6.3+ | Testes de API HTTP |

**Instalação:**
```bash
npm install -D @nestjs/testing jest supertest
npm install -D @types/jest @types/supertest
```

---

## 5. Ferramentas de Desenvolvimento

### 5.1 Code Quality

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **ESLint** | 8.50+ | Linting JavaScript/TypeScript |
| **Prettier** | 3.0+ | Formatação consistente de código |
| **Husky** | 8.0+ | Git hooks (pre-commit, pre-push) |
| **lint-staged** | 15.0+ | Lint apenas arquivos staged |

**Instalação:**
```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D husky lint-staged
```

**package.json:**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  },
  "scripts": {
    "prepare": "husky install"
  }
}
```

**.husky/pre-commit:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

### 5.2 Versionamento e Commits

| Tecnologia | Justificativa |
|------------|---------------|
| **Conventional Commits** | Commits padronizados, geração de changelog automática |
| **Commitlint** | Valida mensagens de commit |

**Instalação:**
```bash
npm install -D @commitlint/config-conventional @commitlint/cli
```

**commitlint.config.js:**
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']
    ]
  }
};
```

**Exemplos de commits válidos:**
```
feat(members): add member creation form
fix(auth): resolve JWT token expiration issue
docs(readme): update installation instructions
refactor(cells): extract cell service logic
test(finance): add transaction tests
chore(deps): update dependencies
```

---

## 6. Deployment Recomendado

### 6.1 Plataformas

#### Opção 1: Vercel + Railway (Mais Simples)

| Serviço | Plataforma | Custo Inicial |
|---------|-----------|---------------|
| Frontend | Vercel | Gratuito |
| Backend | Railway | $5/mês |
| PostgreSQL | Railway | $5/mês |
| Redis | Upstash | Gratuito (limited) |

**Vantagens:**
- Deploy automático via Git
- Zero configuração de infraestrutura
- SSL automático
- Logs integrados

#### Opção 2: AWS (Mais Escalável)

| Serviço | AWS Service | Custo Estimado |
|---------|-------------|----------------|
| Frontend | S3 + CloudFront | ~$5/mês |
| Backend | ECS/Fargate | ~$30/mês |
| PostgreSQL | RDS (t3.micro) | ~$15/mês |
| Redis | ElastiCache | ~$15/mês |

**Vantagens:**
- Máximo controle
- Escalabilidade ilimitada
- Compliance enterprise

---

## 7. Monitoramento e Observabilidade

### 7.1 Ferramentas Recomendadas

| Ferramenta | Uso | Custo |
|-----------|-----|-------|
| **Sentry** | Error tracking, performance | Grátis até 5k events/mês |
| **Vercel Analytics** | Performance frontend | Grátis (plano Hobby) |
| **Axiom** | Logs estruturados | Grátis até 0.5GB/mês |
| **Uptime Robot** | Monitoring uptime | Grátis até 50 monitors |

---

## 8. Package.json Completo

### Frontend

```json
{
  "name": "conecta-igreja-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.5.0",
    
    "react-hook-form": "^7.51.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    
    "axios": "^1.6.5",
    
    "@tanstack/react-table": "^8.11.0",
    "@tanstack/react-virtual": "^3.0.0",
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0",
    "react-dropzone": "^14.2.0",
    "qrcode.react": "^3.1.0",
    
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "@vitejs/plugin-react": "^4.2.1",
    
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    
    "prettier": "^3.2.4",
    "prettier-plugin-tailwindcss": "^0.5.11",
    
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    
    "typescript": "^5.3.3",
    "vite": "^5.0.11"
  }
}
```

### Backend

```json
{
  "name": "conecta-igreja-backend",
  "version": "1.0.0",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "migration:generate": "typeorm migration:generate",
    "migration:run": "typeorm migration:run",
    "migration:revert": "typeorm migration:revert"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    
    "@nestjs/typeorm": "^10.0.1",
    "typeorm": "^0.3.17",
    "pg": "^8.11.3",
    
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "bcrypt": "^5.1.1",
    
    "@nestjs/cache-manager": "^2.2.0",
    "cache-manager": "^5.3.2",
    "cache-manager-redis-yet": "^4.1.2",
    
    "@nestjs/bull": "^10.0.1",
    "bull": "^4.12.0",
    
    "@nestjs/schedule": "^4.0.0",
    
    "class-validator": "^0.14.1",
    "class-transformer": "^0.5.1",
    
    "@nestjs/swagger": "^7.2.0",
    
    "winston": "^3.11.0",
    "nest-winston": "^1.9.4",
    
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@nestjs/schematics": "^10.1.0",
    "@nestjs/testing": "^10.3.0",
    
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.5",
    "@types/bcrypt": "^5.0.2",
    "@types/passport-jwt": "^4.0.0",
    
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    
    "eslint": "^8.56.0",
    "prettier": "^3.2.4",
    
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "ts-jest": "^29.1.1",
    "supertest": "^6.3.4",
    "@types/supertest": "^6.0.2",
    
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}
```

---

**Documento criado em:** 08/10/2025  
**Versão:** 1.0  
**Autor:** Droid (Factory AI)
