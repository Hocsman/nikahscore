import { Card } from '@/components/ui/card'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className ?? ''}`} />
}

export default function PremiumLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <Skeleton className="h-8 w-56 mx-auto mb-2" />
          <Skeleton className="h-5 w-80 mx-auto" />
        </div>

        {/* Current plan badge */}
        <div className="flex justify-center">
          <Skeleton className="h-8 w-44 rounded-full" />
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-white dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-24" />
                <div className="flex items-baseline gap-1">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-px w-full" />
                <div className="space-y-3">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded-full" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
