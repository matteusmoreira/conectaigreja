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
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className={cn('text-3xl font-bold', valueColorClasses[color])}>
            {value}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1 text-sm">
          <span className={cn(
            'font-medium',
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-gray-500">nos últimos 30 dias</span>
        </div>
      )}
    </div>
  )
}
