import { useMemo } from 'react';
import { format } from 'date-fns';
import { ShiftReport, User } from '@shared/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
interface ShiftReportListProps {
  reports: ShiftReport[];
  staffList: User[];
}
export function ShiftReportList({ reports, staffList }: ShiftReportListProps) {
  const staffMap = useMemo(() => new Map(staffList.map(s => [s.id, s.name])), [staffList]);
  const sortedReports = useMemo(() =>
    [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [reports]
  );
  if (sortedReports.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-muted-foreground">No Reports Submitted Yet</h3>
        <p className="text-sm text-muted-foreground mt-1">The first submitted report will appear here.</p>
      </div>
    );
  }
  return (
    <Accordion type="single" collapsible className="w-full">
      {sortedReports.map(report => (
        <AccordionItem value={report.id} key={report.id}>
          <AccordionTrigger>
            <div className="flex justify-between items-center w-full pr-4">
              <div className="flex flex-col items-start">
                <span className="font-semibold">{format(new Date(report.date), 'MMMM d, yyyy')}</span>
                <span className="text-sm text-muted-foreground">
                  by {staffMap.get(report.shiftLeadId) || 'Unknown'}
                </span>
              </div>
              <Badge variant="outline">{report.store}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-4 bg-muted/50 rounded-md">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="font-medium">Enrollment Adds: <span className="font-normal">{report.enrollmentAdds}</span></div>
                <div className="font-medium">Enrollment Drops: <span className="font-normal">{report.enrollmentDrops}</span></div>
                <div className="font-medium">Enrollment Pauses: <span className="font-normal">{report.enrollmentPauses}</span></div>
                <div className="font-medium">New Visits: <span className="font-normal">{report.newVisits}</span></div>
                <div className="font-medium">Return Visits: <span className="font-normal">{report.returnVisits}</span></div>
                <div className="font-medium">Capacity: <span className="font-normal">{report.capacity}</span></div>
              </div>
              <div>
                <h4 className="font-semibold">Staff Highlights</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.staffHighlights}</p>
              </div>
              {report.issues && (
                <div>
                  <h4 className="font-semibold">Issues / Notes</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.issues}</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}