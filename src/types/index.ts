// Tipos globais da aplicação

export interface Usuario {
  id: string
  email: string
  nome_completo: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Igreja {
  id: string
  nome: string
  cnpj: string | null
  telefone: string | null
  email: string | null
  endereco: string | null
  created_at: string
  updated_at: string
}

export interface MembroIgreja {
  id: string
  igreja_id: string
  usuario_id: string
  papel: 'admin' | 'lider' | 'membro'
  status: 'ativo' | 'inativo'
  created_at: string
  updated_at: string
}
