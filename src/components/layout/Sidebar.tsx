import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Heart,
  MessageCircle,
  Calendar,
  DollarSign,
  Mail,
  FileText,
  CreditCard,
  Settings,
  Code,
  BookOpen,
  Church,
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Membros', path: '/membros' },
  { icon: Heart, label: 'Ministérios', path: '/ministerios' },
  { icon: MessageCircle, label: 'Células', path: '/celulas' },
  { icon: DollarSign, label: 'Finanças', path: '/financas' },
  { icon: Mail, label: 'Comunicação', path: '/comunicacao' },
  { icon: Calendar, label: 'Programação', path: '/programacao' },
  { icon: FileText, label: 'Relatórios', path: '/relatorios' },
  { icon: CreditCard, label: 'Carteirinhas', path: '/carteirinhas' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
]

const apiItems = [
  { icon: Code, label: 'Portal do Desenvolvedor', path: '/developer' },
  { icon: BookOpen, label: 'Documentação da API', path: '/api-docs' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 39,
            display: window.innerWidth < 768 ? 'block' : 'none'
          }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: '256px',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
        transform: window.innerWidth < 768 ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s ease'
      }}>
      {/* Logo */}
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#111827',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Church style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Conecta Igreja
          </h1>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
            Sistema Administrativo
          </p>
        </div>
      </div>

      {/* Menu Principal */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
        <div style={{ padding: '0 16px 8px 16px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: 0
          }}>
            Menu Principal
          </p>
        </div>
        <nav style={{ padding: '0 12px' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  marginBottom: '4px',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#2563eb' : '#374151',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '#f9fafb'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Icon style={{ width: '20px', height: '20px' }} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* API & Desenvolvimento */}
        <div style={{ padding: '32px 16px 8px 16px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: 0
          }}>
            API & Desenvolvimento
          </p>
        </div>
        <nav style={{ padding: '0 12px' }}>
          {apiItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  marginBottom: '4px',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#2563eb' : '#374151',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '#f9fafb'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Icon style={{ width: '20px', height: '20px' }} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
    </>
  )
}
