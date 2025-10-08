import { MainLayout } from '@/components/layout/MainLayout'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { Users, UserCheck, DollarSign, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function Dashboard() {
  const [stats, setStats] = useState({
    totalMembros: 0,
    membrosAtivos: 0,
    saldoPeriodo: 0,
    totalCelulas: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      // Buscar total de membros
      const { count: totalMembros } = await supabase
        .from('membros')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true)

      // Buscar membros ativos (com data de membresia)
      const { count: membrosAtivos } = await supabase
        .from('membros')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true)
        .not('data_membresia', 'is', null)

      // Buscar total de células ativas
      const { count: totalCelulas } = await supabase
        .from('celulas')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true)

      // Buscar saldo do período (últimos 30 dias)
      const dataLimite = new Date()
      dataLimite.setDate(dataLimite.getDate() - 30)

      const { data: transacoes } = await supabase
        .from('transacoes_financeiras')
        .select('tipo, valor')
        .gte('data_transacao', dataLimite.toISOString().split('T')[0])
        .eq('status', 'confirmada')

      let saldo = 0
      transacoes?.forEach((t) => {
        if (t.tipo === 'receita') {
          saldo += Number(t.valor)
        } else {
          saldo -= Number(t.valor)
        }
      })

      setStats({
        totalMembros: totalMembros || 0,
        membrosAtivos: membrosAtivos || 0,
        saldoPeriodo: saldo,
        totalCelulas: totalCelulas || 0,
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const percentualAtivos = stats.totalMembros > 0
    ? Math.round((stats.membrosAtivos / stats.totalMembros) * 100)
    : 0

  return (
    <MainLayout 
      title="Dashboard Executivo" 
      subtitle="Visão geral dos principais indicadores da igreja"
    >
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total de Membros"
          value={loading ? '...' : stats.totalMembros}
          subtitle="Membros cadastrados"
          icon={Users}
          color="blue"
        />
        
        <MetricCard
          title="Membros Ativos"
          value={loading ? '...' : `${percentualAtivos}%`}
          subtitle={`${stats.membrosAtivos} de ${stats.totalMembros} membros`}
          icon={UserCheck}
          color="green"
        />
        
        <MetricCard
          title="Saldo do Período"
          value={loading ? '...' : `R$ ${stats.saldoPeriodo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtitle="Últimos 30 dias"
          icon={DollarSign}
          color="green"
        />
        
        <MetricCard
          title="Células Ativas"
          value={loading ? '...' : stats.totalCelulas}
          subtitle="Grupos pequenos"
          icon={Heart}
          color="purple"
        />
      </div>

      {/* Ações Rápidas */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px', margin: 0 }}>
          Ações Rápidas
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <button
            onClick={() => window.location.href = '/membros'}
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>Cadastrar Membro</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Adicione um novo membro</div>
          </button>
          
          <button
            onClick={() => window.location.href = '/membros'}
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>Ver Membros</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Lista completa de membros</div>
          </button>
          
          <button
            onClick={() => window.location.href = '/celulas'}
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>Gerenciar Células</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Células e grupos pequenos</div>
          </button>
          
          <button
            onClick={() => window.location.href = '/financas'}
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>Lançar Transação</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Receitas e despesas</div>
          </button>
        </div>
      </div>
    </MainLayout>
  )
}
