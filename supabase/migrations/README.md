# 🗄️ Migrations do Banco de Dados

Este diretório contém as migrations SQL para configurar o banco de dados do Conecta Igreja no Supabase.

## 📋 Ordem de Execução

Execute as migrations **nesta ordem exata**:

1. `20250108_initial_schema.sql` - Cria tabelas, índices, triggers e funções
2. `20250108_rls_policies.sql` - Configura políticas de segurança (RLS)

## 🚀 Como Aplicar no Supabase

### Método 1: SQL Editor (Recomendado)

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard
2. Vá em **SQL Editor** no menu lateral
3. Clique em **New Query**
4. Copie e cole o conteúdo de `20250108_initial_schema.sql`
5. Clique em **Run** (ou pressione `Ctrl+Enter`)
6. Aguarde a execução completar ✅
7. Repita o processo com `20250108_rls_policies.sql`

### Método 2: Supabase CLI (Alternativo)

Se você tiver o Supabase CLI instalado:

```bash
# Aplicar todas as migrations
supabase db push

# Ou aplicar individualmente
supabase db execute --file supabase/migrations/20250108_initial_schema.sql
supabase db execute --file supabase/migrations/20250108_rls_policies.sql
```

## ✅ Verificação

Após aplicar as migrations, verifique se tudo foi criado corretamente:

### Verificar Tabelas

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Você deve ver:
- `usuarios`
- `igrejas`
- `membros_igreja`
- `membros`
- `celulas`
- `membros_celula`
- `categorias_financeiras`
- `transacoes_financeiras`

### Verificar RLS

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

Todas as tabelas devem ter `rowsecurity = true` ✅

### Verificar Políticas

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## 🎯 Estrutura do Schema

### Tabelas Principais

- **usuarios**: Perfis dos usuários (estende auth.users)
- **igrejas**: Organizações (tenants)
- **membros_igreja**: Relação usuário-igreja com papéis

### Tabelas de Features

- **membros**: Cadastro completo de membros
- **celulas**: Pequenos grupos/células
- **membros_celula**: Relação membro-célula
- **categorias_financeiras**: Categorias de receitas/despesas
- **transacoes_financeiras**: Movimentações financeiras

## 🔐 Segurança (RLS)

O sistema implementa **Row Level Security** para garantir isolamento entre igrejas (multitenant):

- ✅ Cada igreja só vê seus próprios dados
- ✅ Usuários só acessam dados das igrejas que pertencem
- ✅ Permissões baseadas em papéis (admin, pastor, líder, membro)
- ✅ Proteção em todas as operações (SELECT, INSERT, UPDATE, DELETE)

## 📊 Tipos ENUM

O schema define vários tipos ENUM para garantir consistência:

- `papel_igreja`: admin, pastor, lider, membro
- `status_membro`: ativo, inativo, visitante
- `estado_civil`: solteiro, casado, divorciado, viuvo
- `sexo`: masculino, feminino
- `dia_semana`: domingo, segunda, terca, quarta, quinta, sexta, sabado
- `tipo_categoria`: receita, despesa
- `tipo_transacao`: receita, despesa
- `forma_pagamento`: dinheiro, pix, cartao_credito, cartao_debito, transferencia, cheque
- `status_transacao`: pendente, confirmada, cancelada

## 🔧 Funções Auxiliares

### `get_user_igreja_id()`
Retorna o `igreja_id` do usuário autenticado.

```sql
SELECT get_user_igreja_id();
```

### `user_belongs_to_igreja(igreja_uuid)`
Verifica se o usuário pertence a uma igreja.

```sql
SELECT user_belongs_to_igreja('uuid-da-igreja');
```

### `user_is_admin(igreja_uuid)`
Verifica se o usuário é admin da igreja.

```sql
SELECT user_is_admin('uuid-da-igreja');
```

## 🆘 Troubleshooting

### Erro: "extension does not exist"
Execute:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### Erro: "relation already exists"
As tabelas já foram criadas. Use `DROP TABLE` para recomeçar (⚠️ cuidado com dados):
```sql
DROP TABLE IF EXISTS transacoes_financeiras CASCADE;
DROP TABLE IF EXISTS categorias_financeiras CASCADE;
DROP TABLE IF EXISTS membros_celula CASCADE;
DROP TABLE IF EXISTS celulas CASCADE;
DROP TABLE IF EXISTS membros CASCADE;
DROP TABLE IF EXISTS membros_igreja CASCADE;
DROP TABLE IF EXISTS igrejas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
```

### Erro em Políticas RLS
Para recriar todas as políticas:
```sql
-- Remover todas as políticas
DROP POLICY IF EXISTS "..." ON table_name;

-- Depois executar novamente o arquivo de RLS
```

## 📝 Próximos Passos

Após aplicar as migrations:

1. ✅ Criar dados de teste (igreja, usuários)
2. ✅ Testar autenticação
3. ✅ Verificar isolamento entre igrejas
4. ✅ Começar desenvolvimento do frontend

## 🤝 Contribuindo

Ao criar novas migrations:

1. Use nomenclatura: `YYYYMMDD_descricao.sql`
2. Documente as alterações neste README
3. Teste localmente antes de aplicar em produção
4. Mantenha migrations atômicas e reversíveis
