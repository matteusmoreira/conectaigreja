-- Execute este SQL no Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Adiciona coluna complemento na tabela membros
ALTER TABLE membros ADD COLUMN IF NOT EXISTS complemento TEXT;

-- Verifica se a coluna foi criada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'membros' 
ORDER BY ordinal_position;
