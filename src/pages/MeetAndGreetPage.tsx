import { useState, useEffect } from 'react';
import { MeetAndGreetList } from '@/components/meet-and-greet/MeetAndGreetList';
import { MeetAndGreet, User } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
export function MeetAndGreetPage() {
  const [meetAndGreets, setMeetAndGreets] = useState<MeetAndGreet[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [mgData, staffData] = await Promise.all([
        api<MeetAndGreet[]>('/api/meet-and-greets'),
        api<User[]>('/api/staff'),
      ]);
      setMeetAndGreets(mgData);
      setStaff(staffData);
    } catch (error) {
      toast.error('Failed to fetch data. Please try again.');
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
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  return (
    <MeetAndGreetList
      initialData={meetAndGreets}
      staffList={staff}
      onDataChange={fetchData}
    />
  );
}