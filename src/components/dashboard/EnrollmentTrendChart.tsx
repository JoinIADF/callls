import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShiftReport } from '@shared/types';
interface EnrollmentTrendChartProps {
  data: ShiftReport[];
}
export function EnrollmentTrendChart({ data }: EnrollmentTrendChartProps) {
  const chartData = useMemo(() => {
    const dailyData: Record<string, { adds: number; drops: number; net: number }> = {};
    data.forEach(report => {
      const day = format(parseISO(report.date), 'yyyy-MM-dd'); // Group by full date to avoid year collisions
      if (!dailyData[day]) {
        dailyData[day] = { adds: 0, drops: 0, net: 0 };
      }
      dailyData[day].adds += report.enrollmentAdds;
      dailyData[day].drops += report.enrollmentDrops;
      dailyData[day].net += report.enrollmentAdds - report.enrollmentDrops;
    });
    return Object.entries(dailyData)
      .map(([date, values]) => ({
        fullDate: date, // Keep original date for sorting
        displayDate: format(parseISO(date), 'MMM d'),
        ...values,
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  }, [data]);
  return (
    <>
      <CardHeader>
        <CardTitle>Enrollment Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="adds" name="Adds" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="drops" name="Drops" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="net" name="Net Change" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </>
  );
}