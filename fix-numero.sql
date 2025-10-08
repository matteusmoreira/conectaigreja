-- =====================================================
-- FIX: Adiciona coluna 'numero' na tabela membros
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Adiciona a coluna numero
ALTER TABLE membros 
ADD COLUMN IF NOT EXISTS numero TEXT;

-- Adiciona comentário para documentação
COMMENT ON COLUMN membros.numero IS 'Número do endereço residencial';

-- Verifica se a coluna foi criada com sucesso
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'membros' 
AND column_name = 'numero';
