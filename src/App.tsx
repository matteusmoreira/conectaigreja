import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { queryClient } from './lib/queryClient'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
                  <span className="text-green-500">✓</span>
                  <span>Supabase Client pronto</span>
                </li>
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
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
