import { Card } from '@/components/ui/card'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className ?? ''}`} />
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        {/* Welcome skeleton */}
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Stats row skeleton */}
        <Card className="bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4">
            <Skeleton className="h-4 w-24 mb-4" />
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center p-2">
                  <Skeleton className="w-5 h-5 rounded-full mb-2" />
                  <Skeleton className="h-8 w-12 mb-1" />
                  <Skeleton className="h-3 w-10" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Main grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Actions card */}
            <Card className="bg-white dark:bg-gray-800 dark:border-gray-700 p-6">
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                    <Skeleton className="w-5 h-5 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-48 mb-1" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
            </Card>

            <Card className="bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
