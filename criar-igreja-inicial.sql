-- =====================================================
-- CRIAR IGREJA INICIAL
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Cria a igreja padrão
INSERT INTO igrejas (
    nome,
    slug,
    cnpj,
    telefone,
    email,
    site,
    endereco,
    cidade,
    estado,
    cep,
    logo_url,
    ativo
) VALUES (
    'Minha Igreja',
    'minha-igreja',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Verifica se a igreja foi criada
SELECT id, nome, slug, ativo, created_at
FROM igrejas
WHERE slug = 'minha-igreja';
