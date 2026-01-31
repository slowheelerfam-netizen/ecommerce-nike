import { PageLayout } from '../../components';

export default function LoadingSale() {
  return (
    <PageLayout title="Sale" description="Loading deals...">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-17 sm:gap-21">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border border-light-200 rounded-xl p-4 animate-pulse">
            <div className="w-full h-48 bg-light-200 rounded-lg" />
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-light-200 rounded w-3/4" />
              <div className="h-3 bg-light-200 rounded w-1/2" />
              <div className="h-5 bg-light-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
