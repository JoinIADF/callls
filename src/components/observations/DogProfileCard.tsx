import { Dog } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from 'react-router-dom';
interface DogProfileCardProps {
  dog: Dog;
}
export function DogProfileCard({ dog }: DogProfileCardProps) {
  return (
    <Link to={`/dogs/${dog.id}`} className="group">
      <Card className="overflow-hidden transition-all duration-200 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1 h-full flex flex-col">
        <CardHeader className="p-0">
          <AspectRatio ratio={4 / 3}>
            <img
              src={dog.photoUrl || `https://avatar.iran.liara.run/username?username=${dog.name}`}
              alt={dog.name}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-semibold text-lg">{dog.name}</h3>
          <p className="text-sm text-muted-foreground">Owner: {dog.ownerName}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full" variant="outline">
            View History
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}