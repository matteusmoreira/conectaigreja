-- Adiciona coluna 'numero' (número do endereço) na tabela membros
ALTER TABLE membros 
ADD COLUMN IF NOT EXISTS numero TEXT;

COMMENT ON COLUMN membros.numero IS 'Número do endereço residencial';
