import { MainLayout } from '@/components/layout/MainLayout'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Membro {
  id: string
  nome_completo: string
  email: string
  telefone: string
  celular: string
  data_nascimento: string
  sexo: string
  estado_civil: string
  data_membresia: string
  cargo: string
  ativo: boolean
  created_at: string
}

export function Membros() {
  const navigate = useNavigate()
  const [membros, setMembros] = useState<Membro[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadMembros()
  }, [])

  async function loadMembros() {
    try {
      const { data, error } = await supabase
        .from('membros')
        .select('*')
        .eq('ativo', true)
        .order('nome_completo')

      if (error) throw error
      setMembros(data || [])
    } catch (error) {
      console.error('Erro ao carregar membros:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir este membro?')) return

    try {
      const { error } = await supabase
        .from('membros')
        .update({ ativo: false })
        .eq('id', id)

      if (error) throw error
      
      setMembros(membros.filter(m => m.id !== id))
      alert('Membro excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir membro:', error)
      alert('Erro ao excluir membro')
    }
  }

  const filteredMembros = membros.filter(m =>
    m.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.telefone?.includes(searchTerm) ||
    m.celular?.includes(searchTerm)
  )

  return (
    <MainLayout title="Membros" subtitle="Gestão completa dos membros da igreja">
      {/* Header com busca e botão de adicionar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Campo de busca */}
        <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
          <Search style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            width: '20px',
            height: '20px'
          }} />
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* Botão de adicionar */}
        <button
          onClick={() => navigate('/membros/novo')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          <Plus style={{ width: '20px', height: '20px' }} />
          Novo Membro
        </button>
      </div>

      {/* Tabela de membros */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
            Carregando membros...
          </div>
        ) : filteredMembros.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              {searchTerm ? 'Nenhum membro encontrado' : 'Nenhum membro cadastrado'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/membros/novo')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cadastrar Primeiro Membro
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Nome
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Email
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Telefone
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Cargo
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembros.map((membro) => (
                  <tr key={membro.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                      {membro.nome_completo}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                      {membro.email || '-'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                      {membro.celular || membro.telefone || '-'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                      {membro.cargo || '-'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => navigate(`/membros/${membro.id}`)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Ver detalhes"
                        >
                          <Eye style={{ width: '16px', height: '16px' }} />
                        </button>
                        <button
                          onClick={() => navigate(`/membros/${membro.id}/editar`)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#f0fdf4',
                            color: '#059669',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Editar"
                        >
                          <Edit style={{ width: '16px', height: '16px' }} />
                        </button>
                        <button
                          onClick={() => handleDelete(membro.id)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Excluir"
                        >
                          <Trash2 style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumo */}
      {!loading && filteredMembros.length > 0 && (
        <div style={{ marginTop: '16px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
          Mostrando {filteredMembros.length} {filteredMembros.length === 1 ? 'membro' : 'membros'}
          {searchTerm && ` de ${membros.length} total`}
        </div>
      )}
    </MainLayout>
  )
}
