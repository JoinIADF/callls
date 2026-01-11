import { useState, useEffect } from 'react';
import { EngagementTimeline } from '@/components/engagement/EngagementTimeline';
import { Engagement, User } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
export function EngagementPage() {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [engagementData, staffData] = await Promise.all([
        api<Engagement[]>('/api/engagements'),
        api<User[]>('/api/staff'),
      ]);
      setEngagements(engagementData);
      setStaff(staffData);
    } catch (error) {
      toast.error('Failed to fetch engagement data. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Pet Parent Engagement</h1>
      <EngagementTimeline engagements={engagements} staffList={staff} />
    </div>
  );
}