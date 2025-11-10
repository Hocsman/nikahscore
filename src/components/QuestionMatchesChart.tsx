'use client'

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuestionMatchesData {
  perfect_matches: number
  good_matches: number
  minor_differences: number
  major_differences: number
}

interface QuestionMatchesChartProps {
  matches: QuestionMatchesData
  title?: string
}

export function QuestionMatchesChart({ 
  matches,
  title = "Répartition des Réponses"
}: QuestionMatchesChartProps) {
  const chartData = [
    {
      name: 'Parfait',
      value: matches.perfect_matches,
      color: '#10b981', // green-500
      description: 'Réponses identiques'
    },
    {
      name: 'Bon',
      value: matches.good_matches,
      color: '#3b82f6', // blue-500
      description: 'Très similaires'
    },
    {
      name: 'Mineur',
      value: matches.minor_differences,
      color: '#f59e0b', // amber-500
      description: 'Légères différences'
    },
    {
      name: 'Majeur',
      value: matches.major_differences,
      color: '#ef4444', // red-500
      description: 'Différences importantes'
    }
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {data.description}
          </p>
          <p className="text-lg font-bold" style={{ color: data.color }}>
            {data.value} questions
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📈 {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              label={{ 
                value: 'Nombre de questions', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#6b7280', fontSize: 12 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
