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
import { Input } from '@/components/ui/input';
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
import { EngagementFeedbackCategory, EngagementMilestone, User } from '@shared/types';
const formSchema = z.object({
  parentName: z.string().min(1, 'Parent name is required'),
  milestone: z.enum(['1 Month', '6 Months', '1 Year', 'Anniversary', 'Other']),
  feedbackCategory: z.enum(['Concern', 'Praise', 'Suggestion']),
  notes: z.string().min(1, 'Notes are required'),
  staffId: z.string().min(1, 'Please select the staff member logging this'),
});
type FormValues = z.infer<typeof formSchema>;
interface EngagementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  staffList: User[];
}
export function EngagementForm({
  open,
  onOpenChange,
  onSuccess,
  staffList,
}: EngagementFormProps) {
  const { store, user } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName: '',
      milestone: '1 Month',
      feedbackCategory: 'Praise',
      notes: '',
      staffId: user?.id || '',
    },
  });
  useEffect(() => {
    if (open) {
      form.reset({
        parentName: '',
        milestone: '1 Month',
        feedbackCategory: 'Praise',
        notes: '',
        staffId: user?.id || '',
      });
    }
  }, [open, form, user]);
  const onSubmit = async (values: FormValues) => {
    const payload = { ...values, store };
    try {
      await api('/api/engagements', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      toast.success('Engagement logged successfully!');
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to log engagement. Please try again.');
      console.error(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Pet Parent Engagement</DialogTitle>
          <DialogDescription>
            Record milestones, feedback, and other interactions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="milestone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestone</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(['1 Month', '6 Months', '1 Year', 'Anniversary', 'Other'] as EngagementMilestone[]).map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="feedbackCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(['Praise', 'Concern', 'Suggestion'] as EngagementFeedbackCategory[]).map(f => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
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
                    <Textarea placeholder="Describe the interaction..." {...field} />
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
                {form.formState.isSubmitting ? 'Saving...' : 'Save Log'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}