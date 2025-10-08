import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface MainLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setIsSidebarOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div style={{ 
        marginLeft: isMobile ? '0' : '256px',
        transition: 'margin-left 0.3s ease'
      }}>
        <Header 
          title={title} 
          subtitle={subtitle} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        <main style={{ 
          padding: isMobile ? '16px' : '32px',
          overflowX: 'hidden'
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
