import { useState, useEffect, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays, startOfMonth, endOfMonth } from 'date-fns';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ConversionChart } from '@/components/dashboard/ConversionChart';
import { EnrollmentTrendChart } from '@/components/dashboard/EnrollmentTrendChart';
import { BarChart, CheckCircle, Users, XCircle, MessageSquareWarning, ThumbsUp } from 'lucide-react';
import { api } from '@/lib/api-client';
import { MeetAndGreet, Engagement, ShiftReport, StoreLocation } from '@shared/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
export function ManagerDashboardPage() {
  const [allMeetAndGreets, setAllMeetAndGreets] = useState<MeetAndGreet[]>([]);
  const [allEngagements, setAllEngagements] = useState<Engagement[]>([]);
  const [allShiftReports, setAllShiftReports] = useState<ShiftReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeFilter, setStoreFilter] = useState<StoreLocation | 'all'>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mgData, engagementData, reportData] = await Promise.all([
          api<MeetAndGreet[]>('/api/meet-and-greets'),
          api<Engagement[]>('/api/engagements'),
          api<ShiftReport[]>('/api/shift-reports'),
        ]);
        setAllMeetAndGreets(mgData);
        setAllEngagements(engagementData);
        setAllShiftReports(reportData);
      } catch (error) {
        toast.error("Failed to load dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const filteredData = useMemo(() => {
    const filterByStore = <T extends { store: StoreLocation }>(items: T[]) =>
      storeFilter === 'all' ? items : items.filter(item => item.store === storeFilter);
    const filterByDate = <T extends { createdAt?: string; greetDateTime?: string; date?: string }>(items: T[]) => {
      if (!dateRange?.from) return items;
      const from = dateRange.from;
      const to = dateRange.to || from;
      return items.filter(item => {
        const itemDateStr = item.createdAt || item.greetDateTime || item.date;
        if (!itemDateStr) return false;
        const itemDate = new Date(itemDateStr);
        return itemDate >= from && itemDate <= to;
      });
    };
    const meetAndGreets = filterByDate(filterByStore(allMeetAndGreets));
    const engagements = filterByDate(filterByStore(allEngagements));
    const shiftReports = filterByDate(filterByStore(allShiftReports));
    return { meetAndGreets, engagements, shiftReports };
  }, [allMeetAndGreets, allEngagements, allShiftReports, storeFilter, dateRange]);
  const kpiData = useMemo(() => {
    const attendedGreets = filteredData.meetAndGreets.filter(mg => mg.status === 'Attended');
    const totalScheduled = filteredData.meetAndGreets.filter(mg => ['Attended', 'No-Show'].includes(mg.status));
    const convertedCount = attendedGreets.filter(mg => mg.converted).length;
    const noShowCount = filteredData.meetAndGreets.filter(mg => mg.status === 'No-Show').length;
    const conversionRate = attendedGreets.length > 0 ? Math.round((convertedCount / attendedGreets.length) * 100) : 0;
    const noShowRate = totalScheduled.length > 0 ? Math.round((noShowCount / totalScheduled.length) * 100) : 0;
    const totalAdds = filteredData.shiftReports.reduce((sum, r) => sum + r.enrollmentAdds, 0);
    const totalDrops = filteredData.shiftReports.reduce((sum, r) => sum + r.enrollmentDrops, 0);
    const netEnrollment = totalAdds - totalDrops;
    const praiseCount = filteredData.engagements.filter(e => e.feedbackCategory === 'Praise').length;
    const concernCount = filteredData.engagements.filter(e => e.feedbackCategory === 'Concern').length;
    const positiveFeedbackRatio = (praiseCount + concernCount) > 0 ? Math.round((praiseCount / (praiseCount + concernCount)) * 100) : 100;
    return { conversionRate, noShowRate, netEnrollment, positiveFeedbackRatio, praiseCount, concernCount };
  }, [filteredData]);
  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <DashboardHeader
        storeFilter={storeFilter}
        setStoreFilter={setStoreFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        data={{ ...filteredData }}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="M&G Conversion Rate" metric={`${kpiData.conversionRate}%`} description="Of attended greets" icon={CheckCircle} color="text-green-500" />
        <KpiCard title="No-Show Rate" metric={`${kpiData.noShowRate}%`} description="For scheduled greets" icon={XCircle} color="text-red-500" />
        <KpiCard title="Net Enrollment" metric={`${kpiData.netEnrollment > 0 ? '+' : ''}${kpiData.netEnrollment}`} description="Adds vs. Drops" icon={Users} color="text-blue-500" />
        <KpiCard title="Positive Feedback" metric={`${kpiData.positiveFeedbackRatio}%`} description={`${kpiData.praiseCount} Praise vs. ${kpiData.concernCount} Concerns`} icon={ThumbsUp} color="text-yellow-500" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <ConversionChart data={filteredData.meetAndGreets} />
        </Card>
        <Card>
          <EnrollmentTrendChart data={filteredData.shiftReports} />
        </Card>
      </div>
    </div>
  );
}