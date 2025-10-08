import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Church, Mail, Lock, User, Check, ArrowRight } from 'lucide-react'

export function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validações
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    const { error } = await signUp(email, password, {
      nome_completo: nome,
    })

    if (error) {
      if (error.message.includes('already registered')) {
        setError('Este email já está cadastrado')
      } else {
        setError('Erro ao criar conta. Tente novamente.')
      }
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/auth/login')
      }, 2000)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 44px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '6px'
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#dcfce7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <Check style={{ width: '40px', height: '40px', color: '#16a34a' }} />
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 12px 0'
          }}>
            Conta criada com sucesso!
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#6b7280',
            margin: '0 0 16px 0'
          }}>
            Verifique seu email para confirmar sua conta.
          </p>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            margin: 0
          }}>
            Redirecionando para o login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px'
      }}>
        {/* Logo e Título */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            backgroundColor: 'white',
            borderRadius: '20px',
            marginBottom: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <Church style={{ width: '40px', height: '40px', color: '#2563eb' }} />
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: 'white',
            margin: '0 0 8px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Conecta Igreja
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.9)',
            margin: 0
          }}>
            Crie sua conta gratuitamente
          </p>
        </div>

        {/* Card de Registro */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#111827',
            margin: '0 0 8px 0'
          }}>
            Começar gratuitamente
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '0 0 24px 0'
          }}>
            Preencha os dados abaixo para criar sua conta
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Nome completo</label>
              <div style={{ position: 'relative' }}>
                <User style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={inputStyle}
                  placeholder="Seu nome"
                  required
                  disabled={loading}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af'
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af'
                }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Confirmar senha</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af'
                }} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#2563eb'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)'
                }
              }}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
              {!loading && <ArrowRight style={{ width: '20px', height: '20px' }} />}
            </button>
          </form>

          <div style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #f3f4f6',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Já tem uma conta?{' '}
              <Link
                to="/auth/login"
                style={{
                  color: '#2563eb',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px'
        }}>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.8)',
            margin: 0
          }}>
            © 2024 Conecta Igreja. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
