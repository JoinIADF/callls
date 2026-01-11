import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CalendarPlus, MessageSquarePlus, ClipboardEdit, DogIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MeetAndGreetForm } from './meet-and-greet/MeetAndGreetForm';
import { EngagementForm } from './engagement/EngagementForm';
import { ObservationForm } from './observations/ObservationForm';
import { api } from '@/lib/api-client';
import { User, Dog } from '@shared/types';
import { toast } from 'sonner';
export function QuickAdd() {
  const [isMeetAndGreetFormOpen, setIsMeetAndGreetFormOpen] = useState(false);
  const [isEngagementFormOpen, setIsEngagementFormOpen] = useState(false);
  const [isObservationFormOpen, setIsObservationFormOpen] = useState(false);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [dogList, setDogList] = useState<Dog[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staff, dogs] = await Promise.all([
          api<User[]>('/api/staff'),
          api<Dog[]>('/api/dogs'),
        ]);
        setStaffList(staff);
        setDogList(dogs);
      } catch (error) {
        toast.error('Failed to load data for forms.');
        console.error(error);
      }
    };

    if (isMeetAndGreetFormOpen || isEngagementFormOpen || isObservationFormOpen) {
      fetchData();
    }
  }, [isMeetAndGreetFormOpen, isEngagementFormOpen, isObservationFormOpen]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform duration-200"
          >
            <Plus className="h-8 w-8" />
            <span className="sr-only">Quick Add</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mb-2">
          <DropdownMenuLabel>Quick Add</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsMeetAndGreetFormOpen(true)}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            <span>New Meet & Greet</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsEngagementFormOpen(true)}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            <span>Log Engagement</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsObservationFormOpen(true)}>
            <DogIcon className="mr-2 h-4 w-4" />
            <span>Log Observation</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/shift-report')}>
            <ClipboardEdit className="mr-2 h-4 w-4" />
            <span>New Shift Report</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <MeetAndGreetForm
        open={isMeetAndGreetFormOpen}
        onOpenChange={setIsMeetAndGreetFormOpen}
        staffList={staffList}
      />
      <EngagementForm
        open={isEngagementFormOpen}
        onOpenChange={setIsEngagementFormOpen}
        staffList={staffList}
      />
      <ObservationForm
        open={isObservationFormOpen}
        onOpenChange={setIsObservationFormOpen}
        staffList={staffList}
        dogList={dogList}
      />
    </>
  );
}