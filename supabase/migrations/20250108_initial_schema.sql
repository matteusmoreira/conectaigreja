-- =====================================================
-- CONECTA IGREJA - SCHEMA INICIAL
-- =====================================================
-- Versão: 1.0.0
-- Data: 2025-01-08
-- Descrição: Schema inicial com suporte a multitenant
-- =====================================================

-- Habilitar extensões necessárias (se necessário)
-- CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para buscas de texto (opcional)

-- =====================================================
-- TABELA: usuarios
-- Estende auth.users com dados do perfil
-- =====================================================
CREATE TABLE usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    nome_completo TEXT,
    avatar_url TEXT,
    telefone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE usuarios IS 'Perfil estendido dos usuários do sistema';

-- =====================================================
-- TABELA: igrejas
-- Representa cada organização (tenant) no sistema
-- =====================================================
CREATE TABLE igrejas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cnpj TEXT UNIQUE,
    telefone TEXT,
    email TEXT,
    site TEXT,
    endereco TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    logo_url TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE igrejas IS 'Organizações (tenants) do sistema - cada igreja é isolada';

-- Índices para performance
CREATE INDEX idx_igrejas_slug ON igrejas(slug);
CREATE INDEX idx_igrejas_ativo ON igrejas(ativo);

-- =====================================================
-- TABELA: membros_igreja
-- Relação entre usuários e igrejas (multitenant)
-- =====================================================
CREATE TYPE papel_igreja AS ENUM ('admin', 'pastor', 'lider', 'membro');
CREATE TYPE status_membro AS ENUM ('ativo', 'inativo', 'visitante');

CREATE TABLE membros_igreja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    igreja_id UUID NOT NULL REFERENCES igrejas(id) ON DELETE CASCADE,
    papel papel_igreja NOT NULL DEFAULT 'membro',
    status status_membro NOT NULL DEFAULT 'ativo',
    data_entrada DATE,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(usuario_id, igreja_id)
);

COMMENT ON TABLE membros_igreja IS 'Relação usuário-igreja com papéis e permissões';

-- Índices
CREATE INDEX idx_membros_igreja_usuario ON membros_igreja(usuario_id);
CREATE INDEX idx_membros_igreja_igreja ON membros_igreja(igreja_id);
CREATE INDEX idx_membros_igreja_status ON membros_igreja(status);

-- =====================================================
-- TABELA: membros
-- Cadastro completo de membros da igreja
-- =====================================================
CREATE TYPE estado_civil AS ENUM ('solteiro', 'casado', 'divorciado', 'viuvo');
CREATE TYPE sexo AS ENUM ('masculino', 'feminino');

CREATE TABLE membros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    igreja_id UUID NOT NULL REFERENCES igrejas(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    
    -- Dados Pessoais
    nome_completo TEXT NOT NULL,
    data_nascimento DATE,
    sexo sexo,
    estado_civil estado_civil,
    cpf TEXT UNIQUE,
    rg TEXT,
    
    -- Contato
    email TEXT,
    telefone TEXT,
    celular TEXT,
    
    -- Endereço
    endereco TEXT,
    bairro TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    
    -- Informações Eclesiásticas
    data_batismo DATE,
    data_membresia DATE,
    cargo TEXT,
    
    -- Outros
    foto_url TEXT,
    observacoes TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE membros IS 'Cadastro completo de membros da igreja';

-- Índices
CREATE INDEX idx_membros_igreja ON membros(igreja_id);
CREATE INDEX idx_membros_usuario ON membros(usuario_id);
CREATE INDEX idx_membros_nome ON membros(nome_completo);
CREATE INDEX idx_membros_ativo ON membros(ativo);

-- =====================================================
-- TABELA: celulas
-- Pequenos grupos/células da igreja
-- =====================================================
CREATE TYPE dia_semana AS ENUM ('domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado');

CREATE TABLE celulas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    igreja_id UUID NOT NULL REFERENCES igrejas(id) ON DELETE CASCADE,
    lider_id UUID REFERENCES membros(id) ON DELETE SET NULL,
    
    nome TEXT NOT NULL,
    descricao TEXT,
    
    -- Local e Horário
    endereco TEXT,
    bairro TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    dia_reuniao dia_semana,
    horario_reuniao TIME,
    
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE celulas IS 'Células/Pequenos grupos da igreja';

-- Índices
CREATE INDEX idx_celulas_igreja ON celulas(igreja_id);
CREATE INDEX idx_celulas_lider ON celulas(lider_id);
CREATE INDEX idx_celulas_ativo ON celulas(ativo);

-- =====================================================
-- TABELA: membros_celula
-- Relação entre membros e células
-- =====================================================
CREATE TABLE membros_celula (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    celula_id UUID NOT NULL REFERENCES celulas(id) ON DELETE CASCADE,
    membro_id UUID NOT NULL REFERENCES membros(id) ON DELETE CASCADE,
    data_entrada DATE NOT NULL DEFAULT CURRENT_DATE,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(celula_id, membro_id)
);

COMMENT ON TABLE membros_celula IS 'Membros participantes de cada célula';

-- Índices
CREATE INDEX idx_membros_celula_celula ON membros_celula(celula_id);
CREATE INDEX idx_membros_celula_membro ON membros_celula(membro_id);

-- =====================================================
-- TABELA: categorias_financeiras
-- Categorias para receitas e despesas
-- =====================================================
CREATE TYPE tipo_categoria AS ENUM ('receita', 'despesa');

CREATE TABLE categorias_financeiras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    igreja_id UUID NOT NULL REFERENCES igrejas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    tipo tipo_categoria NOT NULL,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(igreja_id, nome, tipo)
);

COMMENT ON TABLE categorias_financeiras IS 'Categorias de receitas e despesas';

-- Índices
CREATE INDEX idx_categorias_igreja ON categorias_financeiras(igreja_id);
CREATE INDEX idx_categorias_tipo ON categorias_financeiras(tipo);

-- =====================================================
-- TABELA: transacoes_financeiras
-- Movimentações financeiras (receitas e despesas)
-- =====================================================
CREATE TYPE tipo_transacao AS ENUM ('receita', 'despesa');
CREATE TYPE forma_pagamento AS ENUM ('dinheiro', 'pix', 'cartao_credito', 'cartao_debito', 'transferencia', 'cheque');
CREATE TYPE status_transacao AS ENUM ('pendente', 'confirmada', 'cancelada');

CREATE TABLE transacoes_financeiras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    igreja_id UUID NOT NULL REFERENCES igrejas(id) ON DELETE CASCADE,
    categoria_id UUID REFERENCES categorias_financeiras(id) ON DELETE SET NULL,
    membro_id UUID REFERENCES membros(id) ON DELETE SET NULL,
    
    tipo tipo_transacao NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(12, 2) NOT NULL,
    
    data_transacao DATE NOT NULL,
    forma_pagamento forma_pagamento,
    status status_transacao NOT NULL DEFAULT 'confirmada',
    
    observacoes TEXT,
    comprovante_url TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE transacoes_financeiras IS 'Movimentações financeiras da igreja';

-- Índices
CREATE INDEX idx_transacoes_igreja ON transacoes_financeiras(igreja_id);
CREATE INDEX idx_transacoes_categoria ON transacoes_financeiras(categoria_id);
CREATE INDEX idx_transacoes_membro ON transacoes_financeiras(membro_id);
CREATE INDEX idx_transacoes_data ON transacoes_financeiras(data_transacao);
CREATE INDEX idx_transacoes_tipo ON transacoes_financeiras(tipo);
CREATE INDEX idx_transacoes_status ON transacoes_financeiras(status);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_igrejas_updated_at BEFORE UPDATE ON igrejas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_membros_igreja_updated_at BEFORE UPDATE ON membros_igreja
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_membros_updated_at BEFORE UPDATE ON membros
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_celulas_updated_at BEFORE UPDATE ON celulas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias_financeiras
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transacoes_updated_at BEFORE UPDATE ON transacoes_financeiras
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO HELPER: Obter igreja_id do usuário atual
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_igreja_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT igreja_id 
        FROM membros_igreja 
        WHERE usuario_id = auth.uid() 
        AND status = 'ativo'
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_igreja_id IS 'Retorna o igreja_id do usuário autenticado';

-- =====================================================
-- FUNÇÃO: Verificar se usuário pertence à igreja
-- =====================================================
CREATE OR REPLACE FUNCTION user_belongs_to_igreja(igreja_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM membros_igreja 
        WHERE usuario_id = auth.uid() 
        AND igreja_id = igreja_uuid 
        AND status = 'ativo'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÃO: Verificar se usuário é admin da igreja
-- =====================================================
CREATE OR REPLACE FUNCTION user_is_admin(igreja_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM membros_igreja 
        WHERE usuario_id = auth.uid() 
        AND igreja_id = igreja_uuid 
        AND papel IN ('admin', 'pastor')
        AND status = 'ativo'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DADOS INICIAIS: Categorias padrão
-- =====================================================
-- Nota: Estas categorias serão criadas automaticamente
-- para cada nova igreja através de triggers ou aplicação
