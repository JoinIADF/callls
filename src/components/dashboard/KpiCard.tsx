import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
interface KpiCardProps {
  title: string;
  metric: string;
  description: string;
  icon: React.ElementType;
  color?: string;
}
export function KpiCard({ title, metric, description, icon: Icon, color }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-4 w-4 text-muted-foreground', color)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}