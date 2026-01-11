import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MeetAndGreet } from '@shared/types';
interface ConversionChartProps {
  data: MeetAndGreet[];
}
export function ConversionChart({ data }: ConversionChartProps) {
  const chartData = useMemo(() => {
    const converted = data.filter(mg => mg.converted).length;
    const attendedNotConverted = data.filter(mg => mg.status === 'Attended' && !mg.converted).length;
    const noShow = data.filter(mg => mg.status === 'No-Show').length;
    const cancelled = data.filter(mg => mg.status === 'Cancelled').length;
    return [
      { name: 'Converted', value: converted, fill: 'var(--color-converted)' },
      { name: 'Attended (No Sale)', value: attendedNotConverted, fill: 'var(--color-attended)' },
      { name: 'No-Show', value: noShow, fill: 'var(--color-noShow)' },
      { name: 'Cancelled', value: cancelled, fill: 'var(--color-cancelled)' },
    ];
  }, [data]);
  return (
    <>
      <style>{`
        :root {
          --color-converted: #22c55e;
          --color-attended: #3b82f6;
          --color-noShow: #ef4444;
          --color-cancelled: #6b7280;
        }
      `}</style>
      <CardHeader>
        <CardTitle>Meet & Greet Outcomes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Bar dataKey="value" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </>
  );
}