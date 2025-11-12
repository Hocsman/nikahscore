'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'

interface ResultsChartRadarProps {
  axisScores: Record<string, number>
}

export default function ResultsChartRadar({ axisScores }: ResultsChartRadarProps) {
  // Transformer les données pour Recharts
  const data = Object.entries(axisScores).map(([axis, score]) => ({
    axis,
    score,
    fullMark: 100
  }))

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Activity className="h-5 w-5" />
          Graphique Radar de Compatibilité
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Vue d'ensemble visuelle de vos scores par dimension
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="axis" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
            />
            <Radar 
              name="Score" 
              dataKey="score" 
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Plus la zone violette est grande, meilleure est votre compatibilité globale.</p>
        </div>
      </CardContent>
    </Card>
  )
}
