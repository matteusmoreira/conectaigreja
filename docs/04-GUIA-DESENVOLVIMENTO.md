# 🚀 Guia de Desenvolvimento - Conecta Igreja

## 1. Setup Inicial do Ambiente

### 1.1 Pré-requisitos

```bash
# Verifique as versões instaladas:
node --version    # v20.x ou superior
npm --version     # v10.x ou superior
git --version     # v2.x ou superior
docker --version  # v24.x ou superior (opcional, mas recomendado)
```

### 1.2 Clonar e Instalar

```bash
# Clone o repositório
git clone https://github.com/sua-org/conecta-igreja.git
cd conecta-igreja

# Instalar dependências do frontend
cd frontend
npm install

# Instalar dependências do backend
cd ../backend
npm install

# Voltar para a raiz
cd ..
```

### 1.3 Configurar Variáveis de Ambiente

**Frontend (.env.local):**
```bash
# frontend/.env.local
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Conecta Igreja
VITE_APP_VERSION=1.0.0
```

**Backend (.env):**
```bash
# backend/.env
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/conecta_igreja
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=conecta_igreja

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email (opcional para desenvolvimento)
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your-mailtrap-user
MAIL_PASSWORD=your-mailtrap-password
MAIL_FROM=noreply@conectaigreja.com

# Sentry (opcional)
SENTRY_DSN=

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 1.4 Subir Infraestrutura (Docker Compose)

```bash
# Na raiz do projeto
docker-compose up -d postgres redis

# Verificar se subiram corretamente
docker-compose ps
```

### 1.5 Rodar Migrations

```bash
cd backend
npm run migration:run
```

### 1.6 Seed Inicial (Dados de Teste)

```bash
# Criar seed para módulos do sistema e tenant de teste
npm run seed:run
```

---

## 2. Workflow de Desenvolvimento

### 2.1 Rodar o Projeto Localmente

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev

# Deve rodar em: http://localhost:3000
# Swagger docs: http://localhost:3000/api/docs
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# Deve rodar em: http://localhost:5173
```

### 2.2 Estrutura de Branches

```
main          → Produção (apenas via PR aprovado)
develop       → Desenvolvimento (base para features)
feature/*     → Novas funcionalidades
fix/*         → Correções de bugs
hotfix/*      → Correções urgentes em produção
```

**Exemplo de workflow:**
```bash
# Criar nova feature
git checkout develop
git pull origin develop
git checkout -b feature/members-crud

# Trabalhar na feature...
git add .
git commit -m "feat(members): add member CRUD endpoints"
git push origin feature/members-crud

# Abrir PR no GitHub: feature/members-crud → develop
```

### 2.3 Padrão de Commits (Conventional Commits)

```
tipo(escopo): descrição curta

[corpo opcional]

[rodapé opcional]
```

**Tipos permitidos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `style`: Formatação (sem alteração de lógica)
- `refactor`: Refatoração de código
- `test`: Adição/alteração de testes
- `chore`: Tarefas de manutenção

**Exemplos:**
```bash
feat(members): add member registration form
fix(auth): resolve token refresh issue
docs(readme): update installation steps
refactor(cells): extract cell service logic
test(finance): add transaction validation tests
chore(deps): update dependencies to latest versions
```

---

## 3. Adicionando um Novo Módulo (Exemplo: Ministérios)

### 3.1 Backend

#### 3.1.1 Criar Estrutura

```bash
cd backend/src/modules
nest generate module ministries
nest generate controller ministries
nest generate service ministries
```

#### 3.1.2 Criar Entity

```typescript
// backend/src/modules/ministries/entities/ministry.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Member } from '../../members/entities/member.entity';

@Entity('ministries')
export class Ministry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => Member)
  leader: Member;

  @Column({ name: 'leader_id' })
  leaderId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### 3.1.3 Criar DTOs

```typescript
// create-ministry.dto.ts
import { IsString, IsUUID, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMinistryDto {
  @ApiProperty({ example: 'Louvor e Adoração' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Ministério responsável pelos cultos', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'uuid-do-lider' })
  @IsUUID()
  leaderId: string;
}

// update-ministry.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateMinistryDto } from './create-ministry.dto';

export class UpdateMinistryDto extends PartialType(CreateMinistryDto) {}
```

#### 3.1.4 Implementar Service

```typescript
// ministries.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ministry } from './entities/ministry.entity';
import { CreateMinistryDto, UpdateMinistryDto } from './dto';

@Injectable()
export class MinistriesService {
  constructor(
    @InjectRepository(Ministry)
    private ministriesRepository: Repository<Ministry>
  ) {}

  async findAll(): Promise<Ministry[]> {
    return this.ministriesRepository.find({
      where: { isActive: true },
      relations: ['leader']
    });
  }

  async findOne(id: string): Promise<Ministry> {
    const ministry = await this.ministriesRepository.findOne({
      where: { id },
      relations: ['leader']
    });
    
    if (!ministry) {
      throw new NotFoundException(`Ministry with ID ${id} not found`);
    }
    
    return ministry;
  }

  async create(createMinistryDto: CreateMinistryDto): Promise<Ministry> {
    const ministry = this.ministriesRepository.create(createMinistryDto);
    return this.ministriesRepository.save(ministry);
  }

  async update(id: string, updateMinistryDto: UpdateMinistryDto): Promise<Ministry> {
    await this.findOne(id); // Valida se existe
    await this.ministriesRepository.update(id, updateMinistryDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const ministry = await this.findOne(id);
    ministry.isActive = false;
    await this.ministriesRepository.save(ministry);
  }
}
```

#### 3.1.5 Implementar Controller

```typescript
// ministries.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MinistriesService } from './ministries.service';
import { CreateMinistryDto, UpdateMinistryDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RequireModule } from '@/common/decorators/require-module.decorator';

@ApiTags('Ministries')
@ApiBearerAuth()
@Controller('ministries')
@UseGuards(JwtAuthGuard)
@RequireModule('ministries')
export class MinistriesController {
  constructor(private readonly ministriesService: MinistriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all ministries' })
  findAll() {
    return this.ministriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ministry by ID' })
  findOne(@Param('id') id: string) {
    return this.ministriesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new ministry' })
  create(@Body() createMinistryDto: CreateMinistryDto) {
    return this.ministriesService.create(createMinistryDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ministry' })
  update(@Param('id') id: string, @Body() updateMinistryDto: UpdateMinistryDto) {
    return this.ministriesService.update(id, updateMinistryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ministry (soft delete)' })
  remove(@Param('id') id: string) {
    return this.ministriesService.remove(id);
  }
}
```

#### 3.1.6 Registrar no Module

```typescript
// ministries.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinistriesController } from './ministries.controller';
import { MinistriesService } from './ministries.service';
import { Ministry } from './entities/ministry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ministry])],
  controllers: [MinistriesController],
  providers: [MinistriesService],
  exports: [MinistriesService]
})
export class MinistriesModule {}
```

#### 3.1.7 Criar Migration

```bash
npm run migration:generate -- src/database/migrations/CreateMinistriesTable
npm run migration:run
```

---

### 3.2 Frontend

#### 3.2.1 Criar Estrutura de Pastas

```bash
cd frontend/src/modules
mkdir -p ministries/{components,hooks,services,types,pages}
```

#### 3.2.2 Criar Types

```typescript
// types/ministry.types.ts
export interface Ministry {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  leader: {
    id: string;
    fullName: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMinistryDto {
  name: string;
  description?: string;
  leaderId: string;
}

export interface UpdateMinistryDto {
  name?: string;
  description?: string;
  leaderId?: string;
}
```

#### 3.2.3 Criar Service

```typescript
// services/ministries.service.ts
import { api } from '@/lib/api/client';
import { Ministry, CreateMinistryDto, UpdateMinistryDto } from '../types/ministry.types';

export const ministriesService = {
  async list(): Promise<Ministry[]> {
    const { data } = await api.get('/ministries');
    return data;
  },

  async getById(id: string): Promise<Ministry> {
    const { data } = await api.get(`/ministries/${id}`);
    return data;
  },

  async create(dto: CreateMinistryDto): Promise<Ministry> {
    const { data } = await api.post('/ministries', dto);
    return data;
  },

  async update(id: string, dto: UpdateMinistryDto): Promise<Ministry> {
    const { data } = await api.patch(`/ministries/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/ministries/${id}`);
  }
};
```

#### 3.2.4 Criar Hooks

```typescript
// hooks/useMinistries.ts
import { useQuery } from '@tanstack/react-query';
import { ministriesService } from '../services/ministries.service';

export function useMinistries() {
  return useQuery({
    queryKey: ['ministries'],
    queryFn: () => ministriesService.list()
  });
}

// hooks/useMinistry.ts
export function useMinistry(id: string) {
  return useQuery({
    queryKey: ['ministries', id],
    queryFn: () => ministriesService.getById(id),
    enabled: !!id
  });
}

// hooks/useCreateMinistry.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateMinistryDto } from '../types/ministry.types';

export function useCreateMinistry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMinistryDto) => ministriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
    }
  });
}

// hooks/useUpdateMinistry.ts
export function useUpdateMinistry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMinistryDto }) =>
      ministriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
    }
  });
}

// hooks/useDeleteMinistry.ts
export function useDeleteMinistry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ministriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
    }
  });
}
```

#### 3.2.5 Criar Componentes

```typescript
// components/MinistryCard.tsx
import { Ministry } from '../types/ministry.types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

interface MinistryCardProps {
  ministry: Ministry;
  onEdit: (ministry: Ministry) => void;
  onDelete: (id: string) => void;
}

export function MinistryCard({ ministry, onEdit, onDelete }: MinistryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ministry.name}</CardTitle>
        <CardDescription>{ministry.description}</CardDescription>
        <p className="text-sm text-muted-foreground">
          Líder: {ministry.leader.fullName}
        </p>
      </CardHeader>
      <CardFooter className="gap-2">
        <Button variant="outline" onClick={() => onEdit(ministry)}>
          Editar
        </Button>
        <Button variant="destructive" onClick={() => onDelete(ministry.id)}>
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}
```

```typescript
// components/MinistryForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreateMinistryDto } from '../types/ministry.types';

const ministrySchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().optional(),
  leaderId: z.string().uuid('Selecione um líder')
});

interface MinistryFormProps {
  onSubmit: (data: CreateMinistryDto) => void;
  defaultValues?: Partial<CreateMinistryDto>;
}

export function MinistryForm({ onSubmit, defaultValues }: MinistryFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateMinistryDto>({
    resolver: zodResolver(ministrySchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Nome</label>
        <Input id="name" {...register('name')} />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="description">Descrição</label>
        <Textarea id="description" {...register('description')} />
      </div>

      <div>
        <label htmlFor="leaderId">Líder</label>
        <Input id="leaderId" {...register('leaderId')} />
        {errors.leaderId && <span className="text-red-500">{errors.leaderId.message}</span>}
      </div>

      <Button type="submit">Salvar</Button>
    </form>
  );
}
```

#### 3.2.6 Criar Página

```typescript
// pages/MinistriesListPage.tsx
import { useState } from 'react';
import { useMinistries, useCreateMinistry, useDeleteMinistry } from '../hooks';
import { MinistryCard } from '../components/MinistryCard';
import { MinistryForm } from '../components/MinistryForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';

export default function MinistriesListPage() {
  const { data: ministries, isLoading } = useMinistries();
  const createMinistry = useCreateMinistry();
  const deleteMinistry = useDeleteMinistry();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = async (data: CreateMinistryDto) => {
    await createMinistry.mutateAsync(data);
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este ministério?')) {
      await deleteMinistry.mutateAsync(id);
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Ministérios"
        description="Gerencie os ministérios da igreja"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Novo Ministério</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Ministério</DialogTitle>
              </DialogHeader>
              <MinistryForm onSubmit={handleCreate} />
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {ministries?.map((ministry) => (
          <MinistryCard
            key={ministry.id}
            ministry={ministry}
            onEdit={() => {}}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
```

#### 3.2.7 Registrar Rota

```typescript
// app/AppRoutes.tsx
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const MinistriesPage = lazy(() => import('@/modules/ministries/pages/MinistriesListPage'));

export function AppRoutes() {
  return (
    <Routes>
      {/* ... outras rotas ... */}
      
      <Route path="/ministries" element={<MinistriesPage />} />
    </Routes>
  );
}
```

---

## 4. Boas Práticas

### 4.1 TypeScript

```typescript
// ✅ Sempre tipar adequadamente
interface User {
  id: string;
  name: string;
}

function getUser(id: string): Promise<User> {
  return api.get(`/users/${id}`);
}

// ❌ Evitar any
function getUser(id: any): any {
  return api.get(`/users/${id}`);
}
```

### 4.2 React

```typescript
// ✅ Function components com TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ✅ Custom hooks
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}
```

### 4.3 NestJS

```typescript
// ✅ Injeção de dependências
@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    private readonly emailService: EmailService
  ) {}
}

// ✅ Exception handling
async findOne(id: string): Promise<Member> {
  const member = await this.membersRepository.findOne({ where: { id } });
  
  if (!member) {
    throw new NotFoundException(`Member with ID ${id} not found`);
  }
  
  return member;
}
```

### 4.4 Segurança

```typescript
// ✅ Nunca commitar secrets
// Use variáveis de ambiente
const secret = process.env.JWT_SECRET;

// ✅ Validar todas as entradas
@Post()
async create(@Body() dto: CreateMemberDto) {
  // class-validator já valida automaticamente
  return this.service.create(dto);
}

// ✅ Hash de senhas
import * as bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
```

---

## 5. Debugging

### 5.1 Frontend (Chrome DevTools)

```typescript
// Adicionar breakpoints no código
debugger;

// Console útil
console.log('Data:', data);
console.table(members);
console.error('Error:', error);
```

### 5.2 Backend (VS Code)

**launch.json:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeArgs": [
        "-r",
        "ts-node/register",
        "-r",
        "tsconfig-paths/register"
      ],
      "args": [
        "${workspaceFolder}/backend/src/main.ts"
      ],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

---

## 6. Testes

### 6.1 Testes de Service (Backend)

```typescript
// members.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';

describe('MembersService', () => {
  let service: MembersService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockRepository
        }
      ]
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  it('should return all members', async () => {
    const members = [{ id: '1', fullName: 'João' }];
    mockRepository.find.mockResolvedValue(members);

    expect(await service.findAll()).toEqual(members);
    expect(mockRepository.find).toHaveBeenCalled();
  });
});
```

### 6.2 Testes de Componente (Frontend)

```typescript
// MinistryCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MinistryCard } from './MinistryCard';

describe('MinistryCard', () => {
  const mockMinistry = {
    id: '1',
    name: 'Louvor',
    description: 'Ministério de louvor',
    leader: { id: '2', fullName: 'João Silva' }
  };

  it('should render ministry information', () => {
    render(
      <MinistryCard
        ministry={mockMinistry}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Louvor')).toBeInTheDocument();
    expect(screen.getByText('Ministério de louvor')).toBeInTheDocument();
    expect(screen.getByText('Líder: João Silva')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    
    render(
      <MinistryCard
        ministry={mockMinistry}
        onEdit={onEdit}
        onDelete={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    expect(onEdit).toHaveBeenCalledWith(mockMinistry);
  });
});
```

---

## 7. Deploy

### 7.1 Build de Produção

**Frontend:**
```bash
cd frontend
npm run build

# Output: frontend/dist/
```

**Backend:**
```bash
cd backend
npm run build

# Output: backend/dist/
```

### 7.2 Variáveis de Produção

**Backend (.env.production):**
```bash
NODE_ENV=production
DATABASE_URL=sua-connection-string-producao
JWT_SECRET=secret-super-seguro-de-producao
REDIS_URL=redis-producao
SENTRY_DSN=seu-sentry-dsn
```

---

**Documento criado em:** 08/10/2025  
**Versão:** 1.0  
**Autor:** Droid (Factory AI)
