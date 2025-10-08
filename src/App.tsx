import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

// Auth Pages
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { ForgotPassword } from './pages/auth/ForgotPassword'

// App Pages
import { Dashboard } from './pages/Dashboard'
import { Membros } from './pages/Membros'
import { MembroForm } from './pages/MembroForm'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rota raiz redireciona para dashboard ou login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Rotas de Autenticação */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            
            {/* Rotas Protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/membros"
              element={
                <ProtectedRoute>
                  <Membros />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/membros/novo"
              element={
                <ProtectedRoute>
                  <MembroForm />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/membros/:id/editar"
              element={
                <ProtectedRoute>
                  <MembroForm />
                </ProtectedRoute>
              }
            />
            
            {/* Rota 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
