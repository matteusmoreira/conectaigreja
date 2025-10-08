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
import { cn } from '@/utils/cn'

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

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
          <Church className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-gray-900">Conecta Igreja</h1>
          <p className="text-xs text-gray-500">Sistema Administrativo</p>
        </div>
      </div>

      {/* Menu Principal */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-4 mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu Principal
          </p>
        </div>
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* API & Desenvolvimento */}
        <div className="mt-8 px-4 mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            API & Desenvolvimento
          </p>
        </div>
        <nav className="px-3 space-y-1">
          {apiItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
