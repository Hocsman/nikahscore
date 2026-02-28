import { Card } from '@/components/ui/card'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className ?? ''}`} />
}

export default function ActionsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-44 mb-2" />
            <Skeleton className="h-5 w-60" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>

        {/* List items */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white dark:bg-gray-800 dark:border-gray-700">
              <div className="p-4 flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="w-8 h-8 rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
