'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Siren,
  BarChart2,
  Settings,
  ChevronLeft,
} from 'lucide-react';
import { TwinViewIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/map', label: 'Map View', icon: Map },
  { href: '/alerts', label: 'Alerts', icon: Siren },
  { href: '/reports', label: 'Reports', icon: BarChart2 },
];

export function Sidebar({ isExpanded, setExpanded }: { isExpanded: boolean, setExpanded: (isExpanded: boolean) => void }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  const handleLinkClick = () => {
    if (isMobile) {
      setExpanded(false);
    }
  }

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-10 flex-col border-r bg-card transition-all duration-300",
      isMobile ? "flex w-72" : "hidden sm:flex",
      isExpanded ? 'w-64' : 'w-20'
    )}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <TwinViewIcon className="h-6 w-6" />
            <span className={cn('font-headline text-lg', !isExpanded && 'sr-only')}>TwinView</span>
          </Link>
          {!isMobile && (
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8" onClick={() => setExpanded(!isExpanded)}>
              <ChevronLeft className={cn("h-4 w-4 transition-transform", !isExpanded && "rotate-180")} />
            </Button>
          )}
        </div>
        <div className="flex-1">
          <nav className={cn("grid items-start text-sm font-medium", isExpanded ? "px-2 lg:px-4" : "px-2 justify-center")}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname === item.href && 'bg-muted text-primary',
                  !isExpanded && "justify-center"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className={cn(!isExpanded && 'sr-only')}>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className={cn("grid items-start text-sm font-medium", isExpanded ? "px-2 lg:px-4" : "px-2 justify-center")}>
            <Link
                href="/settings"
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname === '/settings' && 'bg-muted text-primary',
                  !isExpanded && "justify-center"
                )}
              >
                <Settings className="h-4 w-4" />
                <span className={cn(!isExpanded && 'sr-only')}>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
