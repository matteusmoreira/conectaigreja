import { ChevronDown, LogOut, User, Menu } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick: () => void
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/auth/login')
  }

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 32px',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        {/* Botão Menu Hamburguer - só aparece no mobile */}
        {isMobile && (
          <button
            onClick={onMenuClick}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#374151',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Menu style={{ width: '24px', height: '24px' }} />
          </button>
        )}

        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <h1 style={{ 
            fontSize: isMobile ? '18px' : '24px', 
            fontWeight: 700, 
            color: '#111827', 
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {title}
          </h1>
          {subtitle && !isMobile && (
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px', marginBottom: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#2563eb',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827', margin: 0 }}>
              {user?.user_metadata?.nome_completo || 'Usuário'}
            </p>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
              {user?.email}
            </p>
          </div>
          <ChevronDown style={{ width: '16px', height: '16px', color: '#6b7280' }} />
        </button>

        {isDropdownOpen && (
          <div style={{
            position: 'absolute',
            right: 0,
            marginTop: '8px',
            width: '224px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            border: '1px solid #e5e7eb',
            padding: '4px 0',
            zIndex: 50
          }}>
            <button
              onClick={() => {
                setIsDropdownOpen(false)
                navigate('/perfil')
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                fontSize: '14px',
                color: '#374151',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <User style={{ width: '16px', height: '16px' }} />
              <span>Meu Perfil</span>
            </button>
            <div style={{ borderTop: '1px solid #f3f4f6', margin: '4px 0' }} />
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                fontSize: '14px',
                color: '#dc2626',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
