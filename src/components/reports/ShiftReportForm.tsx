import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api-client';
import { useAuth } from '@/lib/auth';
const formSchema = z.object({
  enrollmentAdds: z.coerce.number().min(0),
  enrollmentDrops: z.coerce.number().min(0),
  enrollmentPauses: z.coerce.number().min(0),
  newVisits: z.coerce.number().min(0),
  returnVisits: z.coerce.number().min(0),
  capacity: z.coerce.number().min(0),
  staffHighlights: z.string().min(1, 'Staff highlights are required.'),
  issues: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;
export function ShiftReportForm({ onSuccess }: { onSuccess?: () => void }) {
  const { store, user } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enrollmentAdds: 0,
      enrollmentDrops: 0,
      enrollmentPauses: 0,
      newVisits: 0,
      returnVisits: 0,
      capacity: 0,
      staffHighlights: '',
      issues: '',
    },
  });
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to submit a report.");
      return;
    }
    const payload = {
      ...values,
      store,
      shiftLeadId: user.id,
      date: new Date().toISOString(),
    };
    try {
      await api('/api/shift-reports', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      toast.success('Shift report submitted successfully!');
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to submit report. Please try again.');
      console.error(error);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Summary</CardTitle>
        <CardDescription>Enter the key metrics from your shift.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField control={form.control} name="enrollmentAdds" render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment Adds</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="enrollmentDrops" render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment Drops</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="enrollmentPauses" render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment Pauses</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField control={form.control} name="newVisits" render={({ field }) => (
                <FormItem>
                  <FormLabel>New Visits</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="returnVisits" render={({ field }) => (
                <FormItem>
                  <FormLabel>Return Visits</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="capacity" render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity Today</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="staffHighlights" render={({ field }) => (
              <FormItem>
                <FormLabel>Staff Highlights</FormLabel>
                <FormControl><Textarea placeholder="Who did great today and why?" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="issues" render={({ field }) => (
              <FormItem>
                <FormLabel>Issues / Notes</FormLabel>
                <FormControl><Textarea placeholder="Any issues, concerns, or general notes..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting} className="ml-auto">
              {form.formState.isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}