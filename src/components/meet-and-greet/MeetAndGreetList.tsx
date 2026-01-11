import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Filter, MoreHorizontal } from 'lucide-react';
import { MeetAndGreet, MeetAndGreetStatus, User } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { MeetAndGreetForm } from './MeetAndGreetForm';
import { DateRange } from 'react-day-picker';
interface MeetAndGreetListProps {
  initialData: MeetAndGreet[];
  staffList: User[];
  onDataChange: () => void;
}
const statusColors: Record<MeetAndGreetStatus, string> = {
  Attended: 'bg-blue-100 text-blue-800',
  'No-Show': 'bg-red-100 text-red-800',
  Cancelled: 'bg-gray-100 text-gray-800',
  Rescheduled: 'bg-yellow-100 text-yellow-800',
};
export function MeetAndGreetList({ initialData, staffList, onDataChange }: MeetAndGreetListProps) {
  const [selectedRecord, setSelectedRecord] = useState<MeetAndGreet | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>();
  const staffMap = useMemo(() => new Map(staffList.map((s) => [s.id, s.name])), [staffList]);
  const filteredData = useMemo(() => {
    return initialData
      .filter((item) => (statusFilter === 'all' ? true : item.status === statusFilter))
      .filter((item) => (staffFilter === 'all' ? true : item.staffId === staffFilter))
      .filter((item) => {
        if (!dateFilter?.from) return true;
        const itemDate = new Date(item.greetDateTime);
        if (dateFilter.to) {
          return itemDate >= dateFilter.from && itemDate <= dateFilter.to;
        }
        return itemDate.toDateString() === dateFilter.from.toDateString();
      })
      .sort((a, b) => new Date(b.greetDateTime).getTime() - new Date(a.greetDateTime).getTime());
  }, [initialData, statusFilter, staffFilter, dateFilter]);
  const handleEdit = (record: MeetAndGreet) => {
    setSelectedRecord(record);
    setIsFormOpen(true);
  };
  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedRecord(null);
  };
  const handleFormSuccess = () => {
    handleFormClose();
    onDataChange();
  };
  const clearFilters = () => {
    setStatusFilter('all');
    setStaffFilter('all');
    setDateFilter(undefined);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Meet & Greet Tracker</CardTitle>
          <div className="mt-4 flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {(Object.keys(statusColors) as MeetAndGreetStatus[]).map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={staffFilter} onValueChange={setStaffFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                {staffList.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !dateFilter && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter?.from ? (
                    dateFilter.to ? (
                      <>
                        {format(dateFilter.from, 'LLL dd, y')} - {format(dateFilter.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateFilter.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant="ghost" onClick={clearFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pet & Owner</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Converted</TableHead>
                <TableHead>Assigned Staff</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((mg) => (
                  <TableRow key={mg.id}>
                    <TableCell>
                      <div className="font-medium">{mg.petName}</div>
                      <div className="text-sm text-muted-foreground">{mg.ownerName}</div>
                    </TableCell>
                    <TableCell>{format(new Date(mg.greetDateTime), 'PPpp')}</TableCell>
                    <TableCell>
                      <Badge className={cn('font-semibold', statusColors[mg.status])}>
                        {mg.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={mg.converted ? 'default' : 'secondary'} className={mg.converted ? 'bg-green-600' : ''}>
                        {mg.converted ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>{staffMap.get(mg.staffId) || 'Unknown'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(mg)}>Edit</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isFormOpen && (
        <MeetAndGreetForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSuccess={handleFormSuccess}
          staffList={staffList}
          meetAndGreet={selectedRecord}
        />
      )}
    </>
  );
}