import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: string
    isPositive?: boolean
  }
  color?: 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'gray'
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  pink: 'bg-pink-50 text-pink-600',
  orange: 'bg-orange-50 text-orange-600',
  gray: 'bg-gray-50 text-gray-600',
}

const valueColorClasses = {
  blue: 'text-gray-900',
  green: 'text-green-600',
  purple: 'text-purple-600',
  pink: 'text-pink-600',
  orange: 'text-orange-600',
  gray: 'text-gray-900',
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'gray',
}: MetricCardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      padding: '24px',
      transition: 'all 0.3s ease',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)'
    }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280', marginBottom: '4px', margin: 0 }}>
            {title}
          </p>
          <h3 style={{ 
            fontSize: '32px', 
            fontWeight: 700, 
            color: valueColorClasses[color] === 'text-gray-900' ? '#111827' : 
                   valueColorClasses[color] === 'text-green-600' ? '#059669' :
                   valueColorClasses[color] === 'text-purple-600' ? '#9333ea' :
                   valueColorClasses[color] === 'text-pink-600' ? '#db2777' :
                   valueColorClasses[color] === 'text-orange-600' ? '#ea580c' : '#111827',
            margin: 0,
            lineHeight: 1.2
          }}>
            {value}
          </h3>
          {subtitle && (
            <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color === 'blue' ? '#eff6ff' :
                          color === 'green' ? '#f0fdf4' :
                          color === 'purple' ? '#faf5ff' :
                          color === 'pink' ? '#fdf2f8' :
                          color === 'orange' ? '#fff7ed' : '#f9fafb'
        }}>
          <Icon style={{ 
            width: '24px', 
            height: '24px',
            color: color === 'blue' ? '#2563eb' :
                   color === 'green' ? '#059669' :
                   color === 'purple' ? '#9333ea' :
                   color === 'pink' ? '#db2777' :
                   color === 'orange' ? '#ea580c' : '#6b7280'
          }} />
        </div>
      </div>
      
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
          <span style={{
            fontWeight: 500,
            color: trend.isPositive ? '#059669' : '#dc2626'
          }}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span style={{ color: '#9ca3af' }}>nos últimos 30 dias</span>
        </div>
      )}
    </div>
  )
}
