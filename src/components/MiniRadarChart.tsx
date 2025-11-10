'use client'

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer
} from 'recharts'

interface MiniRadarChartProps {
  dimensions: Array<{ dimension: string; score: number }>
  size?: number
}

export function MiniRadarChart({ dimensions, size = 200 }: MiniRadarChartProps) {
  const chartData = dimensions.map(dim => ({
    dimension: dim.dimension.substring(0, 8), // Raccourcir les noms
    score: dim.score
  }))

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RadarChart data={chartData}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis 
          dataKey="dimension" 
          tick={{ fill: '#9ca3af', fontSize: 10 }}
        />
        <Radar
          dataKey="score"
          stroke="#ec4899"
          fill="#ec4899"
          fillOpacity={0.5}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
