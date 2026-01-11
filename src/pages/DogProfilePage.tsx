import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { Dog, Observation, User } from '@shared/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft, PawPrint, User as UserIcon, Calendar, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function DogProfilePage() {
  const { dogId } = useParams<{ dogId: string }>();
  const [dog, setDog] = useState<Dog | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const staffMap = useMemo(() => new Map(staff.map(s => [s.id, s])), [staff]);
  const dogObservations = useMemo(() => {
    return observations
      .filter(obs => obs.dogId === dogId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [observations, dogId]);
  useEffect(() => {
    const fetchData = async () => {
      if (!dogId) return;
      try {
        setLoading(true);
        const [dogsData, observationsData, staffData] = await Promise.all([
          api<Dog[]>('/api/dogs'),
          api<Observation[]>('/api/observations'),
          api<User[]>('/api/staff'),
        ]);
        const currentDog = dogsData.find(d => d.id === dogId);
        setDog(currentDog || null);
        setObservations(observationsData);
        setStaff(staffData);
      } catch (error) {
        toast.error('Failed to fetch dog profile data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dogId]);
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-40" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }
  if (!dog) {
    return <div>Dog not found.</div>;
  }
  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="mb-4">
        <Link to="/observations">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Dogs
        </Link>
      </Button>
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <Avatar className="h-32 w-32 border-4 border-white shadow-md">
          <AvatarImage src={dog.photoUrl} alt={dog.name} />
          <AvatarFallback className="text-4xl">
            {dog.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="pt-4">
          <h1 className="text-4xl font-bold tracking-tight">{dog.name}</h1>
          <p className="text-xl text-muted-foreground">Owner: {dog.ownerName}</p>
        </div>
      </div>
      <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Observation History</h2>
      {dogObservations.length > 0 ? (
        <div className="space-y-4">
          {dogObservations.map(obs => {
            const staffMember = staffMap.get(obs.staffId);
            return (
              <Card key={obs.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{obs.observationType}</CardTitle>
                      <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(new Date(obs.date), 'MMM d, yyyy')}</span>
                        <span className="flex items-center gap-1">{obs.shift === 'AM' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} {obs.shift} Shift</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{obs.observationType}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90">{obs.notes}</p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground pt-4 border-t">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={staffMember?.avatarUrl} />
                      <AvatarFallback>{staffMember?.name.charAt(0) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <span>Logged by {staffMember?.name ?? 'Unknown'}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <PawPrint className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-muted-foreground">No Observations Logged Yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Use the Quick Add button to log the first one for {dog.name}!</p>
        </div>
      )}
    </div>
  );
}