import { Card } from '@/components/ui/card'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className ?? ''}`} />
}

export default function ResultsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-56 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>

        {/* Score card */}
        <Card className="bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 flex items-center gap-6">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-md" />
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar chart */}
          <Card className="bg-white dark:bg-gray-800 dark:border-gray-700 p-6">
            <Skeleton className="h-5 w-40 mb-4" />
            <Skeleton className="h-[250px] w-full rounded" />
          </Card>

          {/* Scores list */}
          <Card className="bg-white dark:bg-gray-800 dark:border-gray-700 p-6">
            <Skeleton className="h-5 w-36 mb-4" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 flex-1 rounded-full" />
                  <Skeleton className="h-4 w-10" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
