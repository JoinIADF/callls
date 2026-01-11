import {
  Calendar,
  HeartHandshake,
  FileText,
  LayoutDashboard,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { UserRole } from '@shared/types';
type NavItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
  roles: UserRole[];
};
const navItems: NavItem[] = [
  {
    title: 'Meet & Greet',
    description: 'Track and convert M&G appointments.',
    href: '/meet-and-greet',
    icon: Calendar,
    color: 'text-blue-500',
    roles: ['front-desk', 'shift-lead', 'manager', 'owner'],
  },
  {
    title: 'Pet Parent Engagement',
    description: 'Log parent milestones and feedback.',
    href: '/engagement',
    icon: HeartHandshake,
    color: 'text-pink-500',
    roles: ['front-desk', 'shift-lead', 'manager', 'owner'],
  },
  {
    title: 'Observations',
    description: 'Log behavioral notes for dogs.',
    href: '/observations',
    icon: Eye,
    color: 'text-green-500',
    roles: ['front-desk', 'shift-lead', 'manager', 'owner'],
  },
  {
    title: 'Shift Lead Report',
    description: 'Submit daily shift summaries.',
    href: '/shift-report',
    icon: FileText,
    color: 'text-yellow-500',
    roles: ['shift-lead', 'manager', 'owner'],
  },
  {
    title: 'Manager Dashboard',
    description: 'View KPIs and performance metrics.',
    href: '/manager-dashboard',
    icon: LayoutDashboard,
    color: 'text-indigo-500',
    roles: ['manager', 'owner'],
  },
];
export function HomePage() {
  const { user } = useAuth();
  if (!user) {
    // In a real app, this would be a login page or a redirect.
    return <div>Please log in.</div>;
  }
  const accessibleNavItems = navItems.filter((item) => item.roles.includes(user.role));
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">
          Select a module to get started.
        </p>
      </motion.div>
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {accessibleNavItems.map((item) => (
          <motion.div
            key={item.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Link to={item.href} className={cn("group block", item.href === '#' && "cursor-not-allowed")}>
              <Card className={cn("h-full transition-all duration-200 ease-in-out", item.href !== '#' && "hover:shadow-lg hover:-translate-y-1", item.href === '#' && "bg-muted/50")}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <item.icon className={cn('h-8 w-8', item.color, item.href === '#' && "opacity-50")} />
                    {item.href !== '#' && <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className={cn("text-lg font-semibold", item.href === '#' && "text-muted-foreground")}>{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}