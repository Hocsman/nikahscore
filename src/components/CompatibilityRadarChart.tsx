'use client'

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DimensionScore {
  dimension: string
  score: number
}

interface CompatibilityRadarChartProps {
  dimensions: DimensionScore[]
  title?: string
  height?: number
}

export function CompatibilityRadarChart({ 
  dimensions, 
  title = "Analyse par Dimensions",
  height = 400 
}: CompatibilityRadarChartProps) {
  // Préparer les données pour le radar chart
  const chartData = dimensions.map(dim => ({
    dimension: dim.dimension,
    score: dim.score,
    fullMark: 100
  }))

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">
            {data.dimension}
          </p>
          <p className="text-sm">
            <span className="font-medium text-pink-600">Score: </span>
            <span className="text-gray-700 dark:text-gray-300">{data.score}%</span>
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
          📊 {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart data={chartData}>
            <PolarGrid 
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis 
              dataKey="dimension" 
              tick={{ 
                fill: '#6b7280', 
                fontSize: 12,
                fontWeight: 500
              }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              tickCount={6}
            />
            <Radar
              name="Compatibilité"
              dataKey="score"
              stroke="#ec4899"
              fill="#ec4899"
              fillOpacity={0.6}
              strokeWidth={2}
              animationDuration={1000}
              animationBegin={0}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
