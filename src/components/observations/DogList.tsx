import { useState, useMemo } from 'react';
import { Dog } from '@shared/types';
import { Input } from '@/components/ui/input';
import { DogProfileCard } from './DogProfileCard';
import { Search } from 'lucide-react';
interface DogListProps {
  dogs: Dog[];
}
export function DogList({ dogs }: DogListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredDogs = useMemo(() => {
    if (!searchTerm) return dogs;
    return dogs.filter(dog =>
      dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dogs, searchTerm]);
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dog Profiles</h1>
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by dog or owner name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      {filteredDogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDogs.map(dog => (
            <DogProfileCard key={dog.id} dog={dog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
          <h3 className="text-lg font-medium text-muted-foreground">No Dogs Found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            No dogs match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}