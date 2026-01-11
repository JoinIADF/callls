import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Download, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { StoreLocation, MeetAndGreet, Engagement, ShiftReport } from '@shared/types';
import { toast } from 'sonner';
interface DashboardHeaderProps {
  storeFilter: StoreLocation | 'all';
  setStoreFilter: (value: StoreLocation | 'all') => void;
  dateRange: DateRange | undefined;
  setDateRange: (value: DateRange | undefined) => void;
  data: {
    meetAndGreets: MeetAndGreet[];
    engagements: Engagement[];
    shiftReports: ShiftReport[];
  };
}
export function DashboardHeader({
  storeFilter,
  setStoreFilter,
  dateRange,
  setDateRange,
  data,
}: DashboardHeaderProps) {
  const handleExport = async () => {
    try {
      const { default: Papa } = await import('papaparse');
      const mgCsv = Papa.unparse(data.meetAndGreets);
      const engagementCsv = Papa.unparse(data.engagements);
      const reportCsv = Papa.unparse(data.shiftReports);
      const createBlob = (csv: string) => new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const download = (blob: Blob, filename: string) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      download(createBlob(mgCsv), 'meet_and_greets.csv');
      download(createBlob(engagementCsv), 'engagements.csv');
      download(createBlob(reportCsv), 'shift_reports.csv');
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data.');
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Key performance indicators for your store(s).
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={storeFilter} onValueChange={(value) => setStoreFilter(value as StoreLocation | 'all')}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <Building className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select Store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            <SelectItem value="Ellisville">Ellisville</SelectItem>
            <SelectItem value="Rock Hill">Rock Hill</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full sm:w-[280px] justify-start text-left font-normal',
                !dateRange && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
          </PopoverContent>
        </Popover>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}