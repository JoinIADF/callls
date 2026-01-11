import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { useAuth } from '@/lib/auth';
import { MeetAndGreet, MeetAndGreetStatus, User } from '@shared/types';
const formSchema = z.object({
  petName: z.string().min(1, 'Pet name is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  greetDateTime: z.date().refine(date => date !== null, { message: "A date and time is required." }),
  status: z.enum(['Attended', 'No-Show', 'Cancelled', 'Rescheduled']),
  converted: z.boolean(),
  staffId: z.string().min(1, 'Please assign a staff member'),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;
interface MeetAndGreetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  meetAndGreet?: MeetAndGreet | null;
  staffList: User[];
}
export function MeetAndGreetForm({
  open,
  onOpenChange,
  onSuccess,
  meetAndGreet,
  staffList,
}: MeetAndGreetFormProps) {
  const { store } = useAuth();
  const isEditing = !!meetAndGreet;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petName: '',
      ownerName: '',
      greetDateTime: new Date(),
      status: 'Attended',
      converted: false,
      staffId: '',
      notes: '',
    },
  });
  useEffect(() => {
    if (open) {
      if (isEditing && meetAndGreet) {
        form.reset({
          ...meetAndGreet,
          greetDateTime: new Date(meetAndGreet.greetDateTime),
        });
      } else {
        form.reset({
          petName: '',
          ownerName: '',
          greetDateTime: new Date(),
          status: 'Attended',
          converted: false,
          staffId: '',
          notes: '',
        });
      }
    }
  }, [meetAndGreet, isEditing, form, open]);
  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      greetDateTime: values.greetDateTime.toISOString(),
      store,
    };
    try {
      if (isEditing) {
        await api(`/api/meet-and-greets/${meetAndGreet?.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        toast.success('Meet & Greet updated successfully!');
      } else {
        await api('/api/meet-and-greets', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast.success('Meet & Greet created successfully!');
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save Meet & Greet. Please try again.');
      console.error(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'New'} Meet & Greet</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details' : 'Add a new record'}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="petName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Buddy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="greetDateTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date & Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(['Attended', 'No-Show', 'Cancelled', 'Rescheduled'] as MeetAndGreetStatus[]).map(
                          (status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Staff</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staffList.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any observations or comments..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="converted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Converted to Enrollment</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}