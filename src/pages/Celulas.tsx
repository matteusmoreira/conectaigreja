import { MainLayout } from '@/components/layout/MainLayout'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Users, MapPin, Calendar, Clock, Edit, Trash2 } from 'lucide-react'

interface Celula {
  id: string
  nome: string
  descricao: string
  lider_id: string
  endereco: string
  bairro: string
  cidade: string
  estado: string
  dia_reuniao: string
  horario_reuniao: string
  ativo: boolean
  lider?: {
    nome_completo: string
  }
  membros_count?: number
}

export function Celulas() {
  const navigate = useNavigate()
  const [celulas, setCelulas] = useState<Celula[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCelulas()
  }, [])

  async function loadCelulas() {
    try {
      // Busca células com informações do líder
      const { data: celulasData, error } = await supabase
        .from('celulas')
        .select(`
          *,
          lider:membros!celulas_lider_id_fkey(nome_completo)
        `)
        .eq('ativo', true)
        .order('nome')

      if (error) throw error

      // Busca contagem de membros de cada célula
      const celulasComContagem = await Promise.all(
        (celulasData || []).map(async (celula) => {
          const { count } = await supabase
            .from('membros_celula')
            .select('*', { count: 'exact', head: true })
            .eq('celula_id', celula.id)

          return {
            ...celula,
            membros_count: count || 0
          }
        })
      )

      setCelulas(celulasComContagem)
    } catch (error) {
      console.error('Erro ao carregar células:', error)
      alert('Erro ao carregar células')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, nome: string) {
    if (!confirm(`Tem certeza que deseja excluir a célula "${nome}"?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('celulas')
        .update({ ativo: false })
        .eq('id', id)

      if (error) throw error

      alert('Célula excluída com sucesso!')
      loadCelulas()
    } catch (error: any) {
      console.error('Erro ao excluir célula:', error)
      alert(`Erro ao excluir célula: ${error.message}`)
    }
  }

  const filteredCelulas = celulas.filter(celula =>
    celula.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    celula.bairro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    celula.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const diasSemana: { [key: string]: string } = {
    domingo: 'Domingo',
    segunda: 'Segunda',
    terca: 'Terça',
    quarta: 'Quarta',
    quinta: 'Quinta',
    sexta: 'Sexta',
    sabado: 'Sábado'
  }

  return (
    <MainLayout
      title="Células"
      subtitle="Gerencie os pequenos grupos da igreja"
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Buscar células..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
        />

        <button
          onClick={() => navigate('/celulas/novo')}
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
            cursor: 'pointer'
          }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          Nova Célula
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
          Carregando células...
        </div>
      ) : filteredCelulas.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <Users style={{ width: '48px', height: '48px', color: '#d1d5db', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>
            Nenhuma célula encontrada
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>
            {searchTerm ? 'Tente buscar por outro termo' : 'Comece cadastrando sua primeira célula'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/celulas/novo')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <Plus style={{ width: '18px', height: '18px' }} />
              Nova Célula
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filteredCelulas.map((celula) => (
            <div
              key={celula.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    margin: 0,
                    flex: 1
                  }}>
                    {celula.nome}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 500
                  }}>
                    <Users style={{ width: '14px', height: '14px' }} />
                    {celula.membros_count}
                  </div>
                </div>
                {celula.descricao && (
                  <p style={{
                    fontSize: '14px',
                    margin: 0,
                    opacity: 0.9,
                    lineHeight: 1.5
                  }}>
                    {celula.descricao}
                  </p>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                {/* Líder */}
                {celula.lider && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                    padding: '10px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: '#2563eb',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 600,
                      flexShrink: 0
                    }}>
                      {celula.lider.nome_completo.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginBottom: '2px'
                      }}>
                        Líder
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#111827',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {celula.lider.nome_completo}
                      </div>
                    </div>
                  </div>
                )}

                {/* Local */}
                {(celula.bairro || celula.cidade) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '10px'
                  }}>
                    <MapPin style={{
                      width: '16px',
                      height: '16px',
                      color: '#6b7280',
                      marginTop: '2px',
                      flexShrink: 0
                    }} />
                    <span style={{
                      fontSize: '14px',
                      color: '#374151',
                      lineHeight: 1.5
                    }}>
                      {[celula.bairro, celula.cidade, celula.estado].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                {/* Dia da Reunião */}
                {celula.dia_reuniao && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px'
                  }}>
                    <Calendar style={{
                      width: '16px',
                      height: '16px',
                      color: '#6b7280',
                      flexShrink: 0
                    }} />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      {diasSemana[celula.dia_reuniao] || celula.dia_reuniao}
                    </span>
                  </div>
                )}

                {/* Horário */}
                {celula.horario_reuniao && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <Clock style={{
                      width: '16px',
                      height: '16px',
                      color: '#6b7280',
                      flexShrink: 0
                    }} />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      {celula.horario_reuniao.substring(0, 5)}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{
                padding: '12px 20px',
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => navigate(`/celulas/editar/${celula.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#374151',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  <Edit style={{ width: '14px', height: '14px' }} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(celula.id, celula.nome)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: 'white',
                    border: '1px solid #fee2e2',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  )
}
