import { MainLayout } from '@/components/layout/MainLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save } from 'lucide-react'

interface MembroFormData {
  nome_completo: string
  email: string
  telefone: string
  celular: string
  cpf: string
  data_nascimento: string
  sexo: string
  estado_civil: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  data_membresia: string
  cargo: string
  observacoes: string
}

const initialFormData: MembroFormData = {
  nome_completo: '',
  email: '',
  telefone: '',
  celular: '',
  cpf: '',
  data_nascimento: '',
  sexo: '',
  estado_civil: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  data_membresia: '',
  cargo: '',
  observacoes: ''
}

export function MembroForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [formData, setFormData] = useState<MembroFormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEditing)
  const [loadingCep, setLoadingCep] = useState(false)

  useEffect(() => {
    if (isEditing) {
      loadMembro()
    }
  }, [id])

  async function loadMembro() {
    try {
      const { data, error } = await supabase
        .from('membros')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setFormData({
        nome_completo: data.nome_completo || '',
        email: data.email || '',
        telefone: data.telefone || '',
        celular: data.celular || '',
        cpf: data.cpf || '',
        data_nascimento: data.data_nascimento || '',
        sexo: data.sexo || '',
        estado_civil: data.estado_civil || '',
        endereco: data.endereco || '',
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        cidade: data.cidade || '',
        estado: data.estado || '',
        cep: data.cep || '',
        data_membresia: data.data_membresia || '',
        cargo: data.cargo || '',
        observacoes: data.observacoes || ''
      })
    } catch (error) {
      console.error('Erro ao carregar membro:', error)
      alert('Erro ao carregar dados do membro')
      navigate('/membros')
    } finally {
      setLoadingData(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.nome_completo.trim()) {
      alert('Nome completo é obrigatório')
      return
    }

    setLoading(true)

    try {
      const dataToSave = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, ''),
        celular: formData.celular.replace(/\D/g, ''),
        cep: formData.cep.replace(/\D/g, ''),
        ativo: true
      }

      if (isEditing) {
        const { error } = await supabase
          .from('membros')
          .update(dataToSave)
          .eq('id', id)

        if (error) throw error
        alert('Membro atualizado com sucesso!')
      } else {
        const { error } = await supabase
          .from('membros')
          .insert([dataToSave])

        if (error) throw error
        alert('Membro cadastrado com sucesso!')
      }

      navigate('/membros')
    } catch (error: any) {
      console.error('Erro ao salvar membro:', error)
      alert(`Erro ao salvar membro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(field: keyof MembroFormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function formatCPF(value: string) {
    const numbers = value.replace(/\D/g, '')
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14)
  }

  function formatPhone(value: string) {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    }
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15)
  }

  function formatCEP(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9)
  }

  async function buscarCEP(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '')
    
    // Só busca se tiver 8 dígitos
    if (cepLimpo.length !== 8) return

    setLoadingCep(true)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (data.erro) {
        alert('CEP não encontrado!')
        return
      }

      // Preenche os campos automaticamente
      setFormData(prev => ({
        ...prev,
        endereco: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
        complemento: data.complemento || ''
      }))
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      alert('Erro ao buscar CEP. Tente novamente.')
    } finally {
      setLoadingCep(false)
    }
  }

  function handleCepChange(value: string) {
    const formatted = formatCEP(value)
    handleChange('cep', formatted)
    
    // Busca automaticamente quando completar 8 dígitos
    const cepLimpo = formatted.replace(/\D/g, '')
    if (cepLimpo.length === 8) {
      buscarCEP(formatted)
    }
  }

  if (loadingData) {
    return (
      <MainLayout title="Carregando..." subtitle="Aguarde">
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
          Carregando dados do membro...
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
      title={isEditing ? 'Editar Membro' : 'Novo Membro'}
      subtitle={isEditing ? 'Atualize as informações do membro' : 'Cadastre um novo membro da igreja'}
    >
      <button
        onClick={() => navigate('/membros')}
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
              Dados Pessoais
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Nome Completo *</label>
                <input
                  type="text"
                  value={formData.nome_completo}
                  onChange={(e) => handleChange('nome_completo', e.target.value)}
                  style={inputStyle}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  style={inputStyle}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label style={labelStyle}>CPF</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => handleChange('cpf', formatCPF(e.target.value))}
                  style={inputStyle}
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label style={labelStyle}>Telefone</label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', formatPhone(e.target.value))}
                  style={inputStyle}
                  placeholder="(00) 0000-0000"
                />
              </div>

              <div>
                <label style={labelStyle}>Celular</label>
                <input
                  type="text"
                  value={formData.celular}
                  onChange={(e) => handleChange('celular', formatPhone(e.target.value))}
                  style={inputStyle}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label style={labelStyle}>Data de Nascimento</label>
                <input
                  type="date"
                  value={formData.data_nascimento}
                  onChange={(e) => handleChange('data_nascimento', e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Sexo</label>
                <select
                  value={formData.sexo}
                  onChange={(e) => handleChange('sexo', e.target.value)}
                  style={{...inputStyle, backgroundColor: 'white'}}
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Estado Civil</label>
                <select
                  value={formData.estado_civil}
                  onChange={(e) => handleChange('estado_civil', e.target.value)}
                  style={{...inputStyle, backgroundColor: 'white'}}
                >
                  <option value="">Selecione</option>
                  <option value="Solteiro(a)">Solteiro(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Viúvo(a)">Viúvo(a)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
              Endereço
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <label style={labelStyle}>
                  CEP {loadingCep && <span style={{ color: '#2563eb', fontSize: '12px' }}>(Buscando...)</span>}
                </label>
                <input
                  type="text"
                  value={formData.cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  style={{
                    ...inputStyle,
                    backgroundColor: loadingCep ? '#f9fafb' : 'white'
                  }}
                  placeholder="00000-000"
                  disabled={loadingCep}
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
                <label style={labelStyle}>Número</label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => handleChange('numero', e.target.value)}
                  style={inputStyle}
                  placeholder="123"
                />
              </div>

              <div>
                <label style={labelStyle}>Complemento</label>
                <input
                  type="text"
                  value={formData.complemento}
                  onChange={(e) => handleChange('complemento', e.target.value)}
                  style={inputStyle}
                  placeholder="Apt, bloco, etc"
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
                  style={{...inputStyle, backgroundColor: 'white'}}
                >
                  <option value="">Selecione</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="BA">Bahia</option>
                  <option value="PR">Paraná</option>
                  <option value="SC">Santa Catarina</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
              Informações da Igreja
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <label style={labelStyle}>Data de Membresia</label>
                <input
                  type="date"
                  value={formData.data_membresia}
                  onChange={(e) => handleChange('data_membresia', e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Cargo/Função</label>
                <input
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => handleChange('cargo', e.target.value)}
                  style={inputStyle}
                  placeholder="Ex: Pastor, Diácono, Líder, Membro"
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleChange('observacoes', e.target.value)}
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: 'vertical' as const,
                    fontFamily: 'inherit'
                  }}
                  placeholder="Informações adicionais sobre o membro..."
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
            onClick={() => navigate('/membros')}
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
            {loading ? 'Salvando...' : isEditing ? 'Atualizar Membro' : 'Cadastrar Membro'}
          </button>
        </div>
      </form>
    </MainLayout>
  )
}
