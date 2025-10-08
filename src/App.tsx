import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { queryClient } from './lib/queryClient'
import { useSupabaseConnection } from './hooks/useSupabaseConnection'

function AppContent() {
  const { isConnected, isLoading, error } = useSupabaseConnection()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Conecta Igreja
        </h1>
        <p className="text-muted-foreground">
          Sistema de gerenciamento para igrejas
        </p>
        
        <div className="mt-8 p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-semibold mb-2">🚀 Projeto Iniciado!</h2>
          <p className="text-sm text-muted-foreground">
            A estrutura básica foi configurada com sucesso.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>React + TypeScript + Vite</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Tailwind CSS configurado</span>
            </li>
            <li className="flex items-center gap-2">
              {isLoading ? (
                <span className="text-yellow-500">⏳</span>
              ) : isConnected ? (
                <span className="text-green-500">✓</span>
              ) : (
                <span className="text-red-500">✗</span>
              )}
              <span>
                Supabase Client {isLoading ? 'conectando...' : isConnected ? 'conectado' : 'erro'}
              </span>
            </li>
            {error && (
              <li className="flex items-start gap-2 text-red-500 text-xs">
                <span>⚠️</span>
                <span>Erro: {error}</span>
              </li>
            )}
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>React Query configurado</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>React Router configurado</span>
            </li>
          </ul>
        </div>

        {isConnected && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200 font-medium">
              ✅ Conexão com Supabase estabelecida com sucesso!
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              URL: {import.meta.env.VITE_SUPABASE_URL}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
