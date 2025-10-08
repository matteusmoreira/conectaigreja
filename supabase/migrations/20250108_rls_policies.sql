-- =====================================================
-- CONECTA IGREJA - RLS POLICIES (ROW LEVEL SECURITY)
-- =====================================================
-- Versão: 1.0.0
-- Data: 2025-01-08
-- Descrição: Políticas de segurança para multitenant
-- =====================================================

-- =====================================================
-- HABILITAR RLS EM TODAS AS TABELAS
-- =====================================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE igrejas ENABLE ROW LEVEL SECURITY;
ALTER TABLE membros_igreja ENABLE ROW LEVEL SECURITY;
ALTER TABLE membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE celulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE membros_celula ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes_financeiras ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS: usuarios
-- =====================================================

-- Usuários podem ver apenas o próprio perfil
CREATE POLICY "Usuários podem ver o próprio perfil"
ON usuarios FOR SELECT
USING (auth.uid() = id);

-- Usuários podem atualizar apenas o próprio perfil
CREATE POLICY "Usuários podem atualizar o próprio perfil"
ON usuarios FOR UPDATE
USING (auth.uid() = id);

-- Usuários podem inserir apenas o próprio perfil
CREATE POLICY "Usuários podem criar o próprio perfil"
ON usuarios FOR INSERT
WITH CHECK (auth.uid() = id);

-- =====================================================
-- POLÍTICAS: igrejas
-- =====================================================

-- Qualquer usuário autenticado pode ver igrejas
CREATE POLICY "Usuários podem ver igrejas"
ON igrejas FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Apenas admins podem criar igrejas (ajustar conforme necessário)
CREATE POLICY "Admins podem criar igrejas"
ON igrejas FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Apenas admins da igreja podem atualizar
CREATE POLICY "Admins podem atualizar sua igreja"
ON igrejas FOR UPDATE
USING (user_is_admin(id));

-- =====================================================
-- POLÍTICAS: membros_igreja
-- =====================================================

-- Usuários podem ver suas próprias associações
CREATE POLICY "Usuários podem ver suas igrejas"
ON membros_igreja FOR SELECT
USING (
    auth.uid() = usuario_id 
    OR user_belongs_to_igreja(igreja_id)
);

-- Admins podem adicionar membros à igreja
CREATE POLICY "Admins podem adicionar membros"
ON membros_igreja FOR INSERT
WITH CHECK (user_is_admin(igreja_id));

-- Admins podem atualizar membros da igreja
CREATE POLICY "Admins podem atualizar membros"
ON membros_igreja FOR UPDATE
USING (user_is_admin(igreja_id));

-- Admins podem remover membros da igreja
CREATE POLICY "Admins podem remover membros"
ON membros_igreja FOR DELETE
USING (user_is_admin(igreja_id));

-- =====================================================
-- POLÍTICAS: membros
-- =====================================================

-- Usuários podem ver membros da mesma igreja
CREATE POLICY "Membros podem ver membros da mesma igreja"
ON membros FOR SELECT
USING (user_belongs_to_igreja(igreja_id));

-- Líderes e admins podem criar membros
CREATE POLICY "Líderes podem criar membros"
ON membros FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM membros_igreja 
        WHERE usuario_id = auth.uid() 
        AND igreja_id = membros.igreja_id 
        AND papel IN ('admin', 'pastor', 'lider')
        AND status = 'ativo'
    )
);

-- Líderes e admins podem atualizar membros
CREATE POLICY "Líderes podem atualizar membros"
ON membros FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM membros_igreja 
        WHERE usuario_id = auth.uid() 
        AND igreja_id = membros.igreja_id 
        AND papel IN ('admin', 'pastor', 'lider')
        AND status = 'ativo'
    )
);

-- Apenas admins podem excluir membros
CREATE POLICY "Admins podem excluir membros"
ON membros FOR DELETE
USING (user_is_admin(igreja_id));

-- =====================================================
-- POLÍTICAS: celulas
-- =====================================================

-- Membros podem ver células da mesma igreja
CREATE POLICY "Membros podem ver células da igreja"
ON celulas FOR SELECT
USING (user_belongs_to_igreja(igreja_id));

-- Líderes e admins podem criar células
CREATE POLICY "Líderes podem criar células"
ON celulas FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM membros_igreja 
        WHERE usuario_id = auth.uid() 
        AND igreja_id = celulas.igreja_id 
        AND papel IN ('admin', 'pastor', 'lider')
        AND status = 'ativo'
    )
);

-- Líderes da célula e admins podem atualizar
CREATE POLICY "Líderes podem atualizar células"
ON celulas FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM membros_igreja 
        WHERE usuario_id = auth.uid() 
        AND igreja_id = celulas.igreja_id 
        AND papel IN ('admin', 'pastor', 'lider')
        AND status = 'ativo'
    )
);

-- Apenas admins podem excluir células
CREATE POLICY "Admins podem excluir células"
ON celulas FOR DELETE
USING (user_is_admin(igreja_id));

-- =====================================================
-- POLÍTICAS: membros_celula
-- =====================================================

-- Membros podem ver participantes das células da igreja
CREATE POLICY "Membros podem ver participantes das células"
ON membros_celula FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM celulas 
        WHERE celulas.id = membros_celula.celula_id 
        AND user_belongs_to_igreja(celulas.igreja_id)
    )
);

-- Líderes podem adicionar membros às células
CREATE POLICY "Líderes podem adicionar membros às células"
ON membros_celula FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM celulas 
        JOIN membros_igreja ON membros_igreja.igreja_id = celulas.igreja_id
        WHERE celulas.id = membros_celula.celula_id 
        AND membros_igreja.usuario_id = auth.uid()
        AND membros_igreja.papel IN ('admin', 'pastor', 'lider')
        AND membros_igreja.status = 'ativo'
    )
);

-- Líderes podem atualizar membros das células
CREATE POLICY "Líderes podem atualizar membros das células"
ON membros_celula FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM celulas 
        JOIN membros_igreja ON membros_igreja.igreja_id = celulas.igreja_id
        WHERE celulas.id = membros_celula.celula_id 
        AND membros_igreja.usuario_id = auth.uid()
        AND membros_igreja.papel IN ('admin', 'pastor', 'lider')
        AND membros_igreja.status = 'ativo'
    )
);

-- Líderes podem remover membros das células
CREATE POLICY "Líderes podem remover membros das células"
ON membros_celula FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM celulas 
        JOIN membros_igreja ON membros_igreja.igreja_id = celulas.igreja_id
        WHERE celulas.id = membros_celula.celula_id 
        AND membros_igreja.usuario_id = auth.uid()
        AND membros_igreja.papel IN ('admin', 'pastor', 'lider')
        AND membros_igreja.status = 'ativo'
    )
);

-- =====================================================
-- POLÍTICAS: categorias_financeiras
-- =====================================================

-- Membros podem ver categorias da igreja
CREATE POLICY "Membros podem ver categorias"
ON categorias_financeiras FOR SELECT
USING (user_belongs_to_igreja(igreja_id));

-- Admins e pastores podem criar categorias
CREATE POLICY "Admins podem criar categorias"
ON categorias_financeiras FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM membros_igreja 
        WHERE usuario_id = auth.uid() 
        AND igreja_id = categorias_financeiras.igreja_id 
        AND papel IN ('admin', 'pastor')
        AND status = 'ativo'
    )
);

-- Admins e pastores podem atualizar categorias
CREATE POLICY "Admins podem atualizar categorias"
ON categorias_financeiras FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM membros_igreja 
        WHERE usuario_id = auth.uid() 
        AND igreja_id = categorias_financeiras.igreja_id 
        AND papel IN ('admin', 'pastor')
        AND status = 'ativo'
    )
);

-- Apenas admins podem excluir categorias
CREATE POLICY "Admins podem excluir categorias"
ON categorias_financeiras FOR DELETE
USING (user_is_admin(igreja_id));

-- =====================================================
-- POLÍTICAS: transacoes_financeiras
-- =====================================================

-- Membros podem ver transações da igreja (ajustar conforme necessário)
CREATE POLICY "Membros podem ver transações"
ON transacoes_financeiras FOR SELECT
USING (user_belongs_to_igreja(igreja_id));

-- Admins e pastores podem criar transações
CREATE POLICY "Admins podem criar transações"
ON transacoes_financeiras FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM membros_igreja 
        WHERE usuario_id = auth.uid() 
        AND igreja_id = transacoes_financeiras.igreja_id 
        AND papel IN ('admin', 'pastor')
        AND status = 'ativo'
    )
);

-- Admins e pastores podem atualizar transações
CREATE POLICY "Admins podem atualizar transações"
ON transacoes_financeiras FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM membros_igreja 
        WHERE usuario_id = auth.uid() 
        AND igreja_id = transacoes_financeiras.igreja_id 
        AND papel IN ('admin', 'pastor')
        AND status = 'ativo'
    )
);

-- Apenas admins podem excluir transações
CREATE POLICY "Admins podem excluir transações"
ON transacoes_financeiras FOR DELETE
USING (user_is_admin(igreja_id));

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================

COMMENT ON POLICY "Usuários podem ver o próprio perfil" ON usuarios IS 'Permite que usuários vejam apenas seu próprio perfil';
COMMENT ON POLICY "Membros podem ver membros da mesma igreja" ON membros IS 'Isolamento por igreja - multitenant';
COMMENT ON POLICY "Líderes podem criar membros" ON membros IS 'Apenas líderes, pastores e admins podem adicionar membros';
