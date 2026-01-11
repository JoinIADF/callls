import { useState, useEffect } from 'react';
import { ShiftReportForm } from '@/components/reports/ShiftReportForm';
import { ShiftReportList } from '@/components/reports/ShiftReportList';
import { ShiftReport, User } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
export function ShiftReportPage() {
  const [reports, setReports] = useState<ShiftReport[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportData, staffData] = await Promise.all([
        api<ShiftReport[]>('/api/shift-reports'),
        api<User[]>('/api/staff'),
      ]);
      setReports(reportData);
      setStaff(staffData);
    } catch (error) {
      toast.error('Failed to fetch shift reports.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Shift Lead Daily Report</h1>
          <p className="text-muted-foreground">
            Fill out the summary for your shift.
          </p>
        </div>
        <ShiftReportForm onSuccess={fetchData} />
      </div>
      <Separator />
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Reports</h2>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <ShiftReportList reports={reports} staffList={staff} />
        )}
      </div>
    </div>
  );
}