import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/forms/Button'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Conecta Igreja</h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {user?.user_metadata?.nome_completo || user?.email}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo ao Dashboard! 🎉
          </h2>
          <p className="text-muted-foreground">
            Sistema de gerenciamento para igrejas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Membros</h3>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">0</p>
            <p className="text-sm text-muted-foreground">Total de membros cadastrados</p>
          </div>

          {/* Card 2 */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Células</h3>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">0</p>
            <p className="text-sm text-muted-foreground">Células ativas</p>
          </div>

          {/* Card 3 */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Finanças</h3>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">R$ 0,00</p>
            <p className="text-sm text-muted-foreground">Saldo atual</p>
          </div>
        </div>

        <div className="mt-8 bg-card p-6 rounded-lg border">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            🚀 Sistema Configurado com Sucesso!
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-500">✓</span>
              <span>Autenticação funcionando</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-500">✓</span>
              <span>Banco de dados configurado</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-500">✓</span>
              <span>RLS policies aplicadas</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-500">⏳</span>
              <span>Aguardando criação dos módulos</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
