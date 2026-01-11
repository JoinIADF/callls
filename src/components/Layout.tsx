import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { QuickAdd } from './QuickAdd';
import { Toaster } from '@/components/ui/sonner';
export function Layout() {
  return (
    <div className="min-h-screen bg-muted/40">
      <AppHeader />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <QuickAdd />
      <Toaster richColors position="top-right" />
    </div>
  );
}