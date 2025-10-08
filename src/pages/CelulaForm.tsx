import { MainLayout } from '@/components/layout/MainLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save } from 'lucide-react'

interface CelulaFormData {
  nome: string
  descricao: string
  lider_id: string
  endereco: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  dia_reuniao: string
  horario_reuniao: string
}

interface Membro {
  id: string
  nome_completo: string
}

const initialFormData: CelulaFormData = {
  nome: '',
  descricao: '',
  lider_id: '',
  endereco: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  dia_reuniao: '',
  horario_reuniao: ''
}

export function CelulaForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [formData, setFormData] = useState<CelulaFormData>(initialFormData)
  const [membros, setMembros] = useState<Membro[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEditing)
  const [igrejaId, setIgrejaId] = useState<string | null>(null)

  useEffect(() => {
    loadIgrejaId()
    loadMembros()
    if (isEditing) {
      loadCelula()
    }
  }, [id])

  async function loadIgrejaId() {
    try {
      const { data: igrejas } = await supabase
        .from('igrejas')
        .select('id')
        .limit(1)
        .single()

      if (igrejas) {
        setIgrejaId(igrejas.id)
      }
    } catch (error) {
      console.error('Erro ao buscar igreja:', error)
    }
  }

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

  async function loadCelula() {
    try {
      const { data, error } = await supabase
        .from('celulas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setFormData({
        nome: data.nome || '',
        descricao: data.descricao || '',
        lider_id: data.lider_id || '',
        endereco: data.endereco || '',
        bairro: data.bairro || '',
        cidade: data.cidade || '',
        estado: data.estado || '',
        cep: data.cep || '',
        dia_reuniao: data.dia_reuniao || '',
        horario_reuniao: data.horario_reuniao || ''
      })
    } catch (error) {
      console.error('Erro ao carregar célula:', error)
      alert('Erro ao carregar dados da célula')
      navigate('/celulas')
    } finally {
      setLoadingData(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.nome.trim()) {
      alert('Nome é obrigatório')
      return
    }

    if (!igrejaId) {
      alert('Erro ao identificar a igreja. Por favor, recarregue a página.')
      return
    }

    setLoading(true)

    try {
      const dataToSave = {
        ...formData,
        igreja_id: igrejaId,
        lider_id: formData.lider_id || null,
        descricao: formData.descricao || null,
        endereco: formData.endereco || null,
        bairro: formData.bairro || null,
        cidade: formData.cidade || null,
        estado: formData.estado || null,
        cep: formData.cep || null,
        dia_reuniao: formData.dia_reuniao || null,
        horario_reuniao: formData.horario_reuniao || null,
        ativo: true
      }

      if (isEditing) {
        const { error } = await supabase
          .from('celulas')
          .update(dataToSave)
          .eq('id', id)

        if (error) throw error
        alert('Célula atualizada com sucesso!')
      } else {
        const { error } = await supabase
          .from('celulas')
          .insert([dataToSave])

        if (error) throw error
        alert('Célula cadastrada com sucesso!')
      }

      navigate('/celulas')
    } catch (error: any) {
      console.error('Erro ao salvar célula:', error)
      alert(`Erro ao salvar célula: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(field: keyof CelulaFormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loadingData) {
    return (
      <MainLayout title="Carregando..." subtitle="Aguarde">
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
          Carregando dados da célula...
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
      title={isEditing ? 'Editar Célula' : 'Nova Célula'}
      subtitle={isEditing ? 'Atualize as informações da célula' : 'Cadastre uma nova célula'}
    >
      <button
        onClick={() => navigate('/celulas')}
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
          overflow: 'hidden'
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
              Informações Básicas
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Nome da Célula *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  style={inputStyle}
                  placeholder="Ex: Célula Atos"
                  required
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: 'vertical' as const,
                    fontFamily: 'inherit'
                  }}
                  placeholder="Descrição da célula..."
                />
              </div>

              <div>
                <label style={labelStyle}>Líder</label>
                <select
                  value={formData.lider_id}
                  onChange={(e) => handleChange('lider_id', e.target.value)}
                  style={{ ...inputStyle, backgroundColor: 'white' }}
                >
                  <option value="">Selecione um líder</option>
                  {membros.map(membro => (
                    <option key={membro.id} value={membro.id}>
                      {membro.nome_completo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
              Local de Reunião
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <label style={labelStyle}>CEP</label>
                <input
                  type="text"
                  value={formData.cep}
                  onChange={(e) => handleChange('cep', e.target.value)}
                  style={inputStyle}
                  placeholder="00000-000"
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Endereço</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => handleChange('endereco', e.target.value)}
                  style={inputStyle}
                  placeholder="Rua, avenida, etc"
                />
              </div>

              <div>
                <label style={labelStyle}>Bairro</label>
                <input
                  type="text"
                  value={formData.bairro}
                  onChange={(e) => handleChange('bairro', e.target.value)}
                  style={inputStyle}
                  placeholder="Nome do bairro"
                />
              </div>

              <div>
                <label style={labelStyle}>Cidade</label>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => handleChange('cidade', e.target.value)}
                  style={inputStyle}
                  placeholder="Nome da cidade"
                />
              </div>

              <div>
                <label style={labelStyle}>Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleChange('estado', e.target.value)}
                  style={{ ...inputStyle, backgroundColor: 'white' }}
                >
                  <option value="">Selecione</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="BA">Bahia</option>
                  <option value="PR">Paraná</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="CE">Ceará</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
              Horário de Reunião
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <label style={labelStyle}>Dia da Semana</label>
                <select
                  value={formData.dia_reuniao}
                  onChange={(e) => handleChange('dia_reuniao', e.target.value)}
                  style={{ ...inputStyle, backgroundColor: 'white' }}
                >
                  <option value="">Selecione</option>
                  <option value="domingo">Domingo</option>
                  <option value="segunda">Segunda-feira</option>
                  <option value="terca">Terça-feira</option>
                  <option value="quarta">Quarta-feira</option>
                  <option value="quinta">Quinta-feira</option>
                  <option value="sexta">Sexta-feira</option>
                  <option value="sabado">Sábado</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Horário</label>
                <input
                  type="time"
                  value={formData.horario_reuniao}
                  onChange={(e) => handleChange('horario_reuniao', e.target.value)}
                  style={inputStyle}
                />
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
            onClick={() => navigate('/celulas')}
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
            {loading ? 'Salvando...' : isEditing ? 'Atualizar Célula' : 'Cadastrar Célula'}
          </button>
        </div>
      </form>
    </MainLayout>
  )
}
