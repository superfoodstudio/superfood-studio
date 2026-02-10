import { Suspense } from "react";
import { AdminDashboard } from './AdminDashboard';
import { AdminDashboardSkeleton } from './AdminDashboardSkeleton';
import { QueryErrorBoundary } from '@/components/ui/QueryErrorBoundary';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboard />
      </Suspense>
    </QueryErrorBoundary>
  );
}