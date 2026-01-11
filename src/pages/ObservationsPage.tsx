import { useState, useEffect } from 'react';
import { DogList } from '@/components/observations/DogList';
import { Dog } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
export function ObservationsPage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setLoading(true);
        const dogData = await api<Dog[]>('/api/dogs');
        setDogs(dogData);
      } catch (error) {
        toast.error('Failed to fetch dog list. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDogs();
  }, []);
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-1/4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div>
      <DogList dogs={dogs} />
    </div>
  );
}