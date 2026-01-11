import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api-client';
import { useAuth } from '@/lib/auth';
import { Dog, ObservationType, User } from '@shared/types';
const formSchema = z.object({
  dogId: z.string().min(1, 'Please select a dog'),
  observationType: z.enum(['Confidence', 'Socialization', 'Behavior', 'Training Readiness']),
  shift: z.enum(['AM', 'PM']),
  notes: z.string().min(1, 'Notes are required'),
  staffId: z.string().min(1, 'Please select the staff member logging this'),
});
type FormValues = z.infer<typeof formSchema>;
interface ObservationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  staffList: User[];
  dogList: Dog[];
}
export function ObservationForm({
  open,
  onOpenChange,
  onSuccess,
  staffList,
  dogList,
}: ObservationFormProps) {
  const { store, user } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dogId: '',
      observationType: 'Socialization',
      shift: 'AM',
      notes: '',
      staffId: user?.id || '',
    },
  });
  useEffect(() => {
    if (open) {
      form.reset({
        dogId: '',
        observationType: 'Socialization',
        shift: new Date().getHours() < 14 ? 'AM' : 'PM',
        notes: '',
        staffId: user?.id || '',
      });
    }
  }, [open, form, user]);
  const onSubmit = async (values: FormValues) => {
    const selectedDog = dogList.find(d => d.id === values.dogId);
    if (!selectedDog) {
      toast.error("Invalid dog selected.");
      return;
    }
    const payload = { ...values, store, dogName: selectedDog.name };
    try {
      await api('/api/observations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      toast.success('Observation logged successfully!');
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to log observation. Please try again.');
      console.error(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Dog Observation</DialogTitle>
          <DialogDescription>
            Record behavioral and socialization notes for a dog.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="dogId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dog</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a dog" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dogList.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name} ({d.ownerName})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="observationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observation Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(['Confidence', 'Socialization', 'Behavior', 'Training Readiness'] as ObservationType[]).map(o => (
                          <SelectItem key={o} value={o}>{o}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
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
                    <Textarea placeholder="Describe the observation..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logged By</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {staffList.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Observation'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}