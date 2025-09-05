import { Suspense } from "react";
import { AdminDashboard } from './AdminDashboard';
import { AdminDashboardSkeleton } from './AdminDashboardSkeleton';

export const dynamic = 'force-dynamic';

// Server component for admin authentication
export default function AdminPage() {
  // TODO: Add server-side authentication check here
  // For now, we'll let the client component handle auth with Relay
  
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboard />
    </Suspense>
  );
}