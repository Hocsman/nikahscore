'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'

interface CoupleRadarChartProps {
  creatorName: string
  partnerName: string
  creatorScores: {
    category: string
    score: number
  }[]
  partnerScores: {
    category: string
    score: number
  }[]
}

export default function CoupleRadarChart({ 
  creatorName, 
  partnerName, 
  creatorScores, 
  partnerScores 
}: CoupleRadarChartProps) {
  
  // Fusionner les données pour le graphique
  const chartData = creatorScores.map((item, index) => ({
    category: item.category,
    [creatorName]: item.score,
    [partnerName]: partnerScores[index]?.score || 0
  }))

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar
            name={creatorName}
            dataKey={creatorName}
            stroke="#9333ea"
            fill="#9333ea"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name={partnerName}
            dataKey={partnerName}
            stroke="#ec4899"
            fill="#ec4899"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
