-- Adiciona coluna complemento na tabela membros
ALTER TABLE membros ADD COLUMN IF NOT EXISTS complemento TEXT;

-- Adiciona comentário na coluna
COMMENT ON COLUMN membros.complemento IS 'Complemento do endereço (apartamento, bloco, etc)';
