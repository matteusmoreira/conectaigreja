import { MainLayout } from '@/components/layout/MainLayout'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Plus, Edit, Trash2, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Ministerio {
  id: string
  nome: string
  descricao: string
  lider_id: string
  cor: string
  ativo: boolean
  created_at: string
  lider?: {
    nome_completo: string
  }
}

export function Ministerios() {
  const navigate = useNavigate()
  const [ministerios, setMinisterios] = useState<Ministerio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    loadMinisterios()
  }, [])

  async function loadMinisterios() {
    try {
      const { data, error } = await supabase
        .from('ministerios')
        .select(`
          *,
          lider:lider_id (
            nome_completo
          )
        `)
        .eq('ativo', true)
        .order('nome')

      if (error) throw error
      setMinisterios(data || [])
    } catch (error) {
      console.error('Erro ao carregar ministérios:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir este ministério?')) return

    try {
      const { error } = await supabase
        .from('ministerios')
        .update({ ativo: false })
        .eq('id', id)

      if (error) throw error
      
      setMinisterios(ministerios.filter(m => m.id !== id))
      alert('Ministério excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir ministério:', error)
      alert('Erro ao excluir ministério')
    }
  }

  const filteredMinisterios = ministerios.filter(m =>
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <MainLayout title="Ministérios" subtitle="Gestão dos ministérios da igreja">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        marginBottom: '20px',
        gap: '12px',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <div style={{ flex: 1, minWidth: isMobile ? '100%' : '300px', position: 'relative' }}>
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
            placeholder="Buscar ministério..."
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

        <button
          onClick={() => navigate('/ministerios/novo')}
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
          Novo Ministério
        </button>
      </div>

      {loading ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '48px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          Carregando ministérios...
        </div>
      ) : filteredMinisterios.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '48px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            {searchTerm ? 'Nenhum ministério encontrado' : 'Nenhum ministério cadastrado'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/ministerios/novo')}
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
              Cadastrar Primeiro Ministério
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {filteredMinisterios.map((ministerio) => (
            <div
              key={ministerio.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '24px',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundColor: ministerio.cor || '#2563eb'
                }}
              />

              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#111827',
                margin: '0 0 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: ministerio.cor ? `${ministerio.cor}20` : '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Users style={{
                    width: '18px',
                    height: '18px',
                    color: ministerio.cor || '#2563eb'
                  }} />
                </div>
                {ministerio.nome}
              </h3>

              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 16px 0',
                lineHeight: 1.5,
                minHeight: '42px'
              }}>
                {ministerio.descricao || 'Sem descrição'}
              </p>

              {ministerio.lider && (
                <div style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  marginBottom: '16px',
                  padding: '8px 12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px'
                }}>
                  <strong style={{ color: '#374151' }}>Líder:</strong> {ministerio.lider.nome_completo}
                </div>
              )}

              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #f3f4f6'
              }}>
                <button
                  onClick={() => navigate(`/ministerios/${ministerio.id}/editar`)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: '#f0fdf4',
                    color: '#059669',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dcfce7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                >
                  <Edit style={{ width: '14px', height: '14px' }} />
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(ministerio.id)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredMinisterios.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
          Mostrando {filteredMinisterios.length} {filteredMinisterios.length === 1 ? 'ministério' : 'ministérios'}
          {searchTerm && ` de ${ministerios.length} total`}
        </div>
      )}
    </MainLayout>
  )
}
