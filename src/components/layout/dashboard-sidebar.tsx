
'use client';

import {
  Home,
  User,
  Calendar,
  Users,
  MessageSquare,
  CircleHelp,
  LogOut,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../logo';
import { Button } from '../ui/button';
import { logout } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
  { href: '/dashboard/profile', icon: <User className="h-5 w-5" />, label: 'Profile' },
  { href: '/dashboard/cycle-log', icon: <Calendar className="h-5 w-5" />, label: 'Cycle Log' },
  { href: '/community', icon: <Users className="h-5 w-5" />, label: 'Community' },
  { href: '/ask-doctor', icon: <CircleHelp className="h-5 w-5" />, label: 'Ask a Doctor' },
  { href: '/ai-chat', icon: <MessageSquare className="h-5 w-5" />, label: 'Woomania' },
  { href: '/learn/products', icon: <BookOpen className="h-5 w-5" />, label: 'Health Guide' },
];

interface DashboardSidebarProps {
  onLinkClick?: () => void;
}

export default function DashboardSidebar({ onLinkClick }: DashboardSidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    onLinkClick?.();
  };

  const NavLink = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
    <Link
      key={href}
      href={href}
      onClick={handleLinkClick}
      className={cn(
        'flex items-center gap-4 rounded-lg px-4 py-3 text-base transition-all hover:bg-secondary',
        pathname === href
          ? 'bg-secondary text-primary font-semibold'
          : 'text-muted-foreground'
      )}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <div className="border-r bg-card h-full flex flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Logo />
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => <NavLink key={item.href} {...item} />)}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={() => logout()}>
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
