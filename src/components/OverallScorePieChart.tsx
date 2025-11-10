'use client'

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface OverallScorePieChartProps {
  score: number
  title?: string
}

export function OverallScorePieChart({ 
  score,
  title = "Score Global"
}: OverallScorePieChartProps) {
  const remaining = 100 - score
  
  const data = [
    { name: 'Compatible', value: score },
    { name: 'À améliorer', value: remaining }
  ]

  // Couleur dynamique selon le score
  const getColor = (score: number) => {
    if (score >= 80) return '#10b981' // green-500
    if (score >= 60) return '#3b82f6' // blue-500
    if (score >= 40) return '#f59e0b' // amber-500
    return '#ef4444' // red-500
  }

  const COLORS = [getColor(score), '#e5e7eb']

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">
            {data.name}
          </p>
          <p className="text-lg font-bold" style={{ color: data.payload.fill }}>
            {data.value}%
          </p>
        </div>
      )
    }
    return null
  }

  // Label personnalisé au centre
  const renderCenterLabel = ({ cx, cy }: any) => {
    return (
      <text 
        x={cx} 
        y={cy} 
        textAnchor="middle" 
        dominantBaseline="middle"
      >
        <tspan 
          x={cx} 
          dy="-0.5em" 
          className="text-4xl font-bold"
          fill={getColor(score)}
        >
          {score}%
        </tspan>
        <tspan 
          x={cx} 
          dy="1.5em" 
          className="text-sm"
          fill="#6b7280"
        >
          Compatibilité
        </tspan>
      </text>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center justify-center">
          🎯 {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
              label={renderCenterLabel}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
