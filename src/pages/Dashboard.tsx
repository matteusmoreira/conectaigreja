import { MainLayout } from '@/components/layout/MainLayout'
import { MetricCard } from '@/components/dashboard/MetricCard'
import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  Heart,
  Droplet,
} from 'lucide-react'

export function Dashboard() {
  return (
    <MainLayout 
      title="Dashboard Executivo" 
      subtitle="Visão geral dos principais indicadores da igreja"
    >

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total de Membros"
          value="0"
          subtitle="+0 nos últimos 30 dias"
          icon={Users}
          color="gray"
        />
        
        <MetricCard
          title="Membros Ativos"
          value="0%"
          subtitle="0 de 0 membros"
          icon={UserCheck}
          color="green"
        />
        
        <MetricCard
          title="Saldo do Período"
          value="R$ 0,00"
          subtitle="Receitas: R$ 0,00"
          icon={DollarSign}
          color="green"
        />
        
        <MetricCard
          title="Taxa de Crescimento"
          value="0,0%"
          subtitle="Baseado nos últimos 30 dias"
          icon={TrendingUp}
          color="blue"
        />
        
        <MetricCard
          title="Ministérios Ativos"
          value="0/0"
          subtitle="0% engajados"
          icon={Heart}
          color="purple"
        />
        
        <MetricCard
          title="Taxa de Batismo"
          value="0%"
          subtitle="0 membros batizados"
          icon={Droplet}
          color="pink"
        />
      </div>

      {/* Tabs de Navegação */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-8">
            <button className="border-b-2 border-blue-600 py-4 px-1 text-sm font-medium text-blue-600">
              Membros
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Financeiro
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Ministérios
            </button>
          </nav>
        </div>
      </div>

      {/* Seção de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crescimento de Membros */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Crescimento de Membros
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Evolução do número de membros ao longo do tempo
          </p>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Gráfico será implementado</p>
              <p className="text-gray-400 text-xs mt-1">Aguardando dados de membros</p>
            </div>
          </div>
        </div>

        {/* Distribuição por Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Distribuição por Status
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Proporção de membros ativos, inativos e visitantes
          </p>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Nenhum membro atribuído a ministérios</p>
              <p className="text-gray-400 text-xs mt-1">Configure ministérios e atribua membros para ver a distribuição</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
