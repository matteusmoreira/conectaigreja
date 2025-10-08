# 🗄️ Integração com Supabase - Conecta Igreja

## 1. Visão Geral

O **Supabase** será usado como backend-as-a-service, fornecendo:

- **PostgreSQL gerenciado** com schemas para multitenancy
- **Autenticação** integrada (JWT automático)
- **Row Level Security (RLS)** para isolamento de dados
- **Storage** para fotos, PDFs e arquivos
- **Realtime** para atualizações em tempo real
- **Edge Functions** para lógica serverless (alternativa ao backend tradicional)

---

## 2. Arquitetura com Supabase

### 2.1 Duas Abordagens Possíveis

#### **Opção A: Frontend direto com Supabase (Mais Simples)**
```
┌─────────────────────────────────────────────┐
│           FRONTEND (React + Vite)           │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Supabase Client (@supabase/ssr)     │ │
│  │  • Auth                               │ │
│  │  • Database queries                   │ │
│  │  • Storage                            │ │
│  │  • Realtime subscriptions             │ │
│  └───────────────────────────────────────┘ │
└───────────────────┬─────────────────────────┘
                    │
                    │ HTTPS (API auto-gerada)
                    │
┌───────────────────▼─────────────────────────┐
│              SUPABASE CLOUD                 │
│  ┌────────────────────────────────────┐    │
│  │  PostgreSQL (Multi-schema)         │    │
│  │  • public (tenants, users)         │    │
│  │  • tenant_igreja_abc               │    │
│  │  • tenant_igreja_xyz               │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │  Auth (JWT automático)             │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │  Storage (Buckets)                 │    │
│  │  • avatars                         │    │
│  │  • documents                       │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │  Edge Functions (Deno)             │    │
│  │  • send-email                      │    │
│  │  • generate-report                 │    │
│  │  • whatsapp-webhook                │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

**Vantagens:**
- ✅ Menos código backend (Edge Functions apenas quando necessário)
- ✅ RLS garante segurança no nível do banco
- ✅ Realtime nativo
- ✅ Deploy mais simples

**Desvantagens:**
- ⚠️ Lógica de negócio mais complexa fica no frontend
- ⚠️ Menos controle sobre queries complexas

---

#### **Opção B: Backend NestJS + Supabase (Mais Controle)**
```
┌─────────────────────────────────────────────┐
│           FRONTEND (React + Vite)           │
└───────────────────┬─────────────────────────┘
                    │
                    │ REST API
                    │
┌───────────────────▼─────────────────────────┐
│         BACKEND (NestJS + Supabase)         │
│  ┌────────────────────────────────────┐    │
│  │  Supabase Admin Client             │    │
│  │  (Bypass RLS para operações admin) │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │  Lógica de Negócio                 │    │
│  │  • Validações complexas            │    │
│  │  • Regras de negócio               │    │
│  │  • Integrações externas            │    │
│  └────────────────────────────────────┘    │
└───────────────────┬─────────────────────────┘
                    │
                    │ Supabase Client
                    │
┌───────────────────▼─────────────────────────┐
│              SUPABASE CLOUD                 │
└─────────────────────────────────────────────┘
```

**Vantagens:**
- ✅ Lógica de negócio centralizada
- ✅ Maior controle sobre operações complexas
- ✅ Fácil adicionar serviços externos (Redis, BullMQ)
- ✅ Melhor para auditorias complexas

**Desvantagens:**
- ⚠️ Mais código para manter
- ⚠️ Mais infraestrutura

---

### 2.2 Recomendação para Conecta Igreja

**🎯 Opção Híbrida (Melhor dos dois mundos):**

```
Frontend → Supabase Client (Auth, queries simples, Realtime)
Frontend → NestJS API (Lógica complexa, relatórios, integrações)
NestJS → Supabase Admin Client
```

**Quando usar cada um:**

| Operação | Onde |
|----------|------|
| Login/Logout | Supabase Auth direto |
| Listar membros | Supabase Client (frontend) |
| Criar membro | Supabase Client ou API |
| Relatório financeiro complexo | NestJS API |
| Enviar WhatsApp | NestJS API ou Edge Function |
| Gerar carteirinha PDF | Edge Function |
| Upload de foto | Supabase Storage (direto) |
| Realtime de notificações | Supabase Realtime (direto) |

---

## 3. Multitenancy com Supabase

### 3.1 Estratégia: RLS (Row Level Security)

Ao invés de schemas separados, usar **políticas RLS** por tenant.

**Estrutura:**
```sql
-- Tabela global: tenants
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: members (com tenant_id)
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  -- ... outros campos
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só veem dados do próprio tenant
CREATE POLICY tenant_isolation ON public.members
  FOR ALL
  USING (tenant_id = auth.jwt() ->> 'tenant_id');
```

### 3.2 Como o JWT do Supabase carrega o tenant

```typescript
// Quando o usuário faz login, adicionar tenant_id no JWT
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Após o login, atualizar o JWT com tenant_id
await supabase.rpc('set_user_tenant', { 
  user_id: data.user.id,
  tenant_id: 'uuid-do-tenant' 
});

// O JWT agora contém:
{
  sub: "user-uuid",
  email: "user@example.com",
  tenant_id: "tenant-uuid",
  role: "authenticated"
}
```

### 3.3 Function para associar tenant ao usuário

```sql
-- Function para definir tenant_id no auth.users metadata
CREATE OR REPLACE FUNCTION set_user_tenant(user_id UUID, tenant_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = 
    jsonb_set(
      COALESCE(raw_app_meta_data, '{}'::jsonb),
      '{tenant_id}',
      to_jsonb(tenant_id)
    )
  WHERE id = user_id;
END;
$$;
```

---

## 4. Setup do Projeto com Supabase

### 4.1 Criar Projeto no Supabase

1. Acesse https://supabase.com/dashboard
2. Clique em "New Project"
3. Configure:
   - **Name**: Conecta Igreja
   - **Database Password**: (gere uma senha forte)
   - **Region**: South America (São Paulo)
   - **Pricing Plan**: Free (para desenvolvimento)

4. Anote as credenciais:
   - **Project URL**: `https://xxx.supabase.co`
   - **Anon Key**: `eyJhbGc...` (chave pública)
   - **Service Role Key**: `eyJhbGc...` (chave privada, só backend)

### 4.2 Instalar Supabase CLI

```bash
# Instalar CLI globalmente
npm install -g supabase

# Login
supabase login

# Linkar projeto local
supabase link --project-ref xxx
```

### 4.3 Configurar Frontend

**Instalar dependências:**
```bash
cd frontend
npm install @supabase/supabase-js
```

**Criar cliente Supabase:**
```typescript
// frontend/src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
```

**Variáveis de ambiente (.env.local):**
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 4.4 Configurar Backend (NestJS - Opcional)

**Instalar dependências:**
```bash
cd backend
npm install @supabase/supabase-js
```

**Criar cliente admin:**
```typescript
// backend/src/config/supabase.config.ts
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // Chave privada!
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

**Variáveis de ambiente (.env):**
```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # NUNCA exponha no frontend!
```

---

## 5. Autenticação com Supabase

### 5.1 Fluxo de Login

```typescript
// frontend/src/modules/auth/services/auth.service.ts
import { supabase } from '@/lib/supabase/client';

export const authService = {
  async login(email: string, password: string, tenantSlug: string) {
    // 1. Buscar tenant pelo slug
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single();
    
    if (!tenant) {
      throw new Error('Igreja não encontrada');
    }
    
    // 2. Fazer login
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // 3. Verificar se usuário pertence ao tenant
    const { data: tenantUser } = await supabase
      .from('tenant_users')
      .select('*')
      .eq('user_id', authData.user.id)
      .eq('tenant_id', tenant.id)
      .single();
    
    if (!tenantUser) {
      await supabase.auth.signOut();
      throw new Error('Usuário não tem acesso a esta igreja');
    }
    
    // 4. Atualizar JWT com tenant_id (via RPC)
    await supabase.rpc('set_user_tenant', {
      user_id: authData.user.id,
      tenant_id: tenant.id
    });
    
    return authData;
  },
  
  async logout() {
    await supabase.auth.signOut();
  },
  
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null);
    });
  }
};
```

### 5.2 Hook de Autenticação

```typescript
// frontend/src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { authService } from '@/modules/auth/services/auth.service';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar usuário atual
    authService.getCurrentUser().then(setUser).finally(() => setLoading(false));
    
    // Listener de mudanças
    const { data: { subscription } } = authService.onAuthStateChange(setUser);
    
    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
```

### 5.3 Protected Route

```typescript
// frontend/src/components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingState } from '@/components/common/LoadingState';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
```

---

## 6. Queries com Supabase

### 6.1 CRUD de Membros

```typescript
// frontend/src/modules/members/services/members.service.ts
import { supabase } from '@/lib/supabase/client';
import { Member, CreateMemberDto } from '../types/member.types';

export const membersService = {
  async list(): Promise<Member[]> {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('full_name');
    
    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Member> {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(dto: CreateMemberDto): Promise<Member> {
    // tenant_id é injetado automaticamente via RLS trigger
    const { data, error } = await supabase
      .from('members')
      .insert(dto)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, dto: Partial<CreateMemberDto>): Promise<Member> {
    const { data, error } = await supabase
      .from('members')
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('members')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  }
};
```

### 6.2 Queries Complexas com Joins

```typescript
// Buscar células com membros
const { data: cells } = await supabase
  .from('cells')
  .select(`
    *,
    leader:members!leader_id(id, full_name),
    cell_members(
      member:members(id, full_name, photo_url)
    )
  `)
  .order('name');

// Buscar transações com membro
const { data: transactions } = await supabase
  .from('transactions')
  .select(`
    *,
    member:members(id, full_name)
  `)
  .eq('type', 'income')
  .gte('reference_date', '2024-01-01')
  .order('reference_date', { ascending: false });
```

### 6.3 Realtime Subscriptions

```typescript
// frontend/src/modules/members/hooks/useRealtimeMembers.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Member } from '../types/member.types';

export function useRealtimeMembers() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    // Buscar membros iniciais
    supabase
      .from('members')
      .select('*')
      .then(({ data }) => setMembers(data || []));

    // Inscrever em mudanças
    const channel = supabase
      .channel('members-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMembers(prev => [...prev, payload.new as Member]);
          } else if (payload.eventType === 'UPDATE') {
            setMembers(prev => prev.map(m => 
              m.id === payload.new.id ? payload.new as Member : m
            ));
          } else if (payload.eventType === 'DELETE') {
            setMembers(prev => prev.filter(m => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return members;
}
```

---

## 7. Storage (Upload de Arquivos)

### 7.1 Criar Buckets no Supabase

```sql
-- Criar buckets via SQL Editor no Supabase Dashboard
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('documents', 'documents', false);

-- Política para avatars (público)
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para documents (privado, apenas do tenant)
CREATE POLICY "Tenant members can view documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id')
);
```

### 7.2 Upload de Avatar

```typescript
// frontend/src/modules/members/services/upload.service.ts
import { supabase } from '@/lib/supabase/client';

export const uploadService = {
  async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Retornar URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);
    
    return publicUrl;
  },
  
  async deleteAvatar(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('avatars')
      .remove([path]);
    
    if (error) throw error;
  }
};
```

### 7.3 Componente de Upload

```typescript
// frontend/src/components/common/AvatarUpload.tsx
import { useState } from 'react';
import { uploadService } from '@/modules/members/services/upload.service';

interface AvatarUploadProps {
  userId: string;
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
}

export function AvatarUpload({ userId, currentUrl, onUploadComplete }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const url = await uploadService.uploadAvatar(userId, file);
      onUploadComplete(url);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {currentUrl && <img src={currentUrl} alt="Avatar" className="w-20 h-20 rounded-full" />}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <span>Enviando...</span>}
    </div>
  );
}
```

---

## 8. Edge Functions (Serverless)

### 8.1 Criar Edge Function

```bash
# Criar função
supabase functions new send-email

# Estrutura criada:
# supabase/functions/send-email/index.ts
```

### 8.2 Exemplo: Enviar Email

```typescript
// supabase/functions/send-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { to, subject, html } = await req.json();
    
    // Validar auth
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    // Enviar email via Resend, SendGrid, etc.
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'noreply@conectaigreja.com',
        to,
        subject,
        html
      })
    });
    
    const data = await response.json();
    
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
```

### 8.3 Deploy Edge Function

```bash
# Deploy
supabase functions deploy send-email

# Invocar do frontend
const { data, error } = await supabase.functions.invoke('send-email', {
  body: {
    to: 'usuario@email.com',
    subject: 'Bem-vindo!',
    html: '<h1>Olá!</h1>'
  }
});
```

---

## 9. Migrations com Supabase

### 9.1 Criar Migration

```bash
# Criar nova migration
supabase migration new create_members_table

# Arquivo criado: supabase/migrations/20240108_create_members_table.sql
```

### 9.2 Exemplo de Migration

```sql
-- supabase/migrations/20240108_create_members_table.sql

-- Criar tabela members
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birth_date DATE,
  photo_url TEXT,
  status TEXT DEFAULT 'visitor' CHECK (status IN ('visitor', 'integrating', 'member', 'inactive')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_members_tenant ON public.members(tenant_id);
CREATE INDEX idx_members_status ON public.members(tenant_id, status) WHERE is_active = true;

-- RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Política: usuários só veem membros do próprio tenant
CREATE POLICY tenant_isolation ON public.members
  FOR ALL
  USING (tenant_id::text = auth.jwt() ->> 'tenant_id');

-- Trigger para updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
```

### 9.3 Aplicar Migrations

```bash
# Aplicar localmente
supabase db reset

# Aplicar em produção
supabase db push
```

---

## 10. Custo e Limites do Supabase

### 10.1 Plano Free (Desenvolvimento)
- ✅ 500 MB de banco de dados
- ✅ 1 GB de Storage
- ✅ 2 GB de transferência
- ✅ 50.000 usuários ativos mensais
- ⚠️ Pausa após 7 dias de inatividade

### 10.2 Plano Pro ($25/mês)
- ✅ 8 GB de banco de dados (+ $0.125/GB extra)
- ✅ 100 GB de Storage (+ $0.021/GB extra)
- ✅ 250 GB de transferência (+ $0.09/GB extra)
- ✅ 100.000 usuários ativos mensais (+ $0.00325/usuário extra)
- ✅ Sem pausa
- ✅ Backups diários (7 dias de retenção)

### 10.3 Estimativa de Custo para 10 Igrejas

**Cenário médio:**
- 10 tenants (igrejas)
- 100 membros por igreja = 1.000 membros
- 50 logins/mês por igreja = 500 usuários ativos
- 100 MB de storage por igreja (fotos) = 1 GB

**Custo estimado:** $25/mês (Plano Pro cobre tranquilamente)

---

## 11. Checklist de Setup

- [ ] Criar projeto no Supabase
- [ ] Configurar variáveis de ambiente (frontend + backend)
- [ ] Instalar Supabase CLI
- [ ] Linkar projeto local
- [ ] Criar migrations iniciais (tenants, users, members, etc.)
- [ ] Aplicar migrations
- [ ] Configurar RLS policies
- [ ] Criar buckets de storage
- [ ] Testar autenticação
- [ ] Testar CRUD básico
- [ ] Testar upload de arquivo
- [ ] (Opcional) Criar Edge Functions

---

## 12. Próximos Passos

1. **Decidir**: Usar apenas Supabase Client (Opção A) ou Backend NestJS + Supabase (Opção B)?
2. **Setup inicial**: Criar projeto no Supabase
3. **Migrations**: Criar schema inicial
4. **Auth**: Implementar fluxo de login
5. **Primeiro módulo**: Membros (CRUD completo)

---

**Documento criado em:** 08/10/2025  
**Versão:** 1.0  
**Autor:** Droid (Factory AI)
