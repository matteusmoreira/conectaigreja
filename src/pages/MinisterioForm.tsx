import { MainLayout } from '@/components/layout/MainLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save } from 'lucide-react'

interface MinisterioFormData {
  nome: string
  descricao: string
  lider_id: string
  cor: string
}

interface Membro {
  id: string
  nome_completo: string
}

const initialFormData: MinisterioFormData = {
  nome: '',
  descricao: '',
  lider_id: '',
  cor: '#2563eb'
}

const coresDisponiveis = [
  { nome: 'Azul', valor: '#2563eb' },
  { nome: 'Verde', valor: '#059669' },
  { nome: 'Roxo', valor: '#9333ea' },
  { nome: 'Rosa', valor: '#db2777' },
  { nome: 'Laranja', valor: '#ea580c' },
  { nome: 'Vermelho', valor: '#dc2626' },
  { nome: 'Amarelo', valor: '#eab308' },
  { nome: 'Ciano', valor: '#06b6d4' },
]

export function MinisterioForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [formData, setFormData] = useState<MinisterioFormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEditing)
  const [membros, setMembros] = useState<Membro[]>([])

  useEffect(() => {
    loadMembros()
    if (isEditing) {
      loadMinisterio()
    }
  }, [id])

  async function loadMembros() {
    try {
      const { data, error } = await supabase
        .from('membros')
        .select('id, nome_completo')
        .eq('ativo', true)
        .order('nome_completo')

      if (error) throw error
      setMembros(data || [])
    } catch (error) {
      console.error('Erro ao carregar membros:', error)
    }
  }

  async function loadMinisterio() {
    try {
      const { data, error } = await supabase
        .from('ministerios')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setFormData({
        nome: data.nome || '',
        descricao: data.descricao || '',
        lider_id: data.lider_id || '',
        cor: data.cor || '#2563eb'
      })
    } catch (error) {
      console.error('Erro ao carregar ministério:', error)
      alert('Erro ao carregar dados do ministério')
      navigate('/ministerios')
    } finally {
      setLoadingData(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.nome.trim()) {
      alert('Nome do ministério é obrigatório')
      return
    }

    setLoading(true)

    try {
      const dataToSave = {
        ...formData,
        lider_id: formData.lider_id || null,
        ativo: true
      }

      if (isEditing) {
        const { error } = await supabase
          .from('ministerios')
          .update(dataToSave)
          .eq('id', id)

        if (error) throw error
        alert('Ministério atualizado com sucesso!')
      } else {
        const { error } = await supabase
          .from('ministerios')
          .insert([dataToSave])

        if (error) throw error
        alert('Ministério cadastrado com sucesso!')
      }

      navigate('/ministerios')
    } catch (error: any) {
      console.error('Erro ao salvar ministério:', error)
      alert(`Erro ao salvar ministério: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(field: keyof MinisterioFormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loadingData) {
    return (
      <MainLayout title="Carregando..." subtitle="Aguarde">
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
          Carregando dados do ministério...
        </div>
      </MainLayout>
    )
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '6px'
  }

  return (
    <MainLayout
      title={isEditing ? 'Editar Ministério' : 'Novo Ministério'}
      subtitle={isEditing ? 'Atualize as informações do ministério' : 'Cadastre um novo ministério da igreja'}
    >
      <button
        onClick={() => navigate('/ministerios')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#374151',
          cursor: 'pointer',
          marginBottom: '24px'
        }}
      >
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        Voltar
      </button>

      <form onSubmit={handleSubmit}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
            Informações do Ministério
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Nome do Ministério *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                style={inputStyle}
                placeholder="Ex: Louvor, Infantil, Jovens..."
                required
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                rows={4}
                style={{
                  ...inputStyle,
                  resize: 'vertical' as const,
                  fontFamily: 'inherit'
                }}
                placeholder="Descreva o propósito e atividades do ministério..."
              />
            </div>

            <div>
              <label style={labelStyle}>Líder do Ministério</label>
              <select
                value={formData.lider_id}
                onChange={(e) => handleChange('lider_id', e.target.value)}
                style={{ ...inputStyle, backgroundColor: 'white' }}
              >
                <option value="">Selecione um líder (opcional)</option>
                {membros.map((membro) => (
                  <option key={membro.id} value={membro.id}>
                    {membro.nome_completo}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                Escolha um membro para liderar este ministério
              </p>
            </div>

            <div>
              <label style={labelStyle}>Cor do Ministério</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '8px',
                marginTop: '8px'
              }}>
                {coresDisponiveis.map((cor) => (
                  <button
                    key={cor.valor}
                    type="button"
                    onClick={() => handleChange('cor', cor.valor)}
                    style={{
                      padding: '8px 12px',
                      border: formData.cor === cor.valor ? `2px solid ${cor.valor}` : '1px solid #e5e7eb',
                      borderRadius: '6px',
                      backgroundColor: formData.cor === cor.valor ? `${cor.valor}10` : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: formData.cor === cor.valor ? 600 : 400,
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      backgroundColor: cor.valor,
                      flexShrink: 0
                    }} />
                    {cor.nome}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '8px 0 0 0' }}>
                A cor ajuda a identificar visualmente o ministério
              </p>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: '0 0 8px 0' }}>
                  Pré-visualização
                </h4>
                <div style={{
                  padding: '16px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  borderTop: `4px solid ${formData.cor}`
                }}>
                  <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>
                    {formData.nome || 'Nome do Ministério'}
                  </h5>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    {formData.descricao || 'Descrição do ministério'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          marginTop: '24px',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={() => navigate('/ministerios')}
            style={{
              padding: '10px 24px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            {loading ? 'Salvando...' : isEditing ? 'Atualizar Ministério' : 'Cadastrar Ministério'}
          </button>
        </div>
      </form>
    </MainLayout>
  )
}
