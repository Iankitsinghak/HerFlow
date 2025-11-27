
"use client";

import {
  Home,
  User,
  Calendar,
  Users,
  MessageSquare,
  CircleHelp,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../logo";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { logout } from "@/lib/auth-client";


const navItems = [
  { href: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
  { href: "/dashboard/profile", icon: <User className="h-5 w-5" />, label: "Profile" },
  { href: "/dashboard/cycle-log", icon: <Calendar className="h-5 w-5" />, label: "Cycle Log" },
  { href: "/community", icon: <Users className="h-5 w-5" />, label: "Community" },
  { href: "/ask-doctor", icon: <CircleHelp className="h-5 w-5" />, label: "Ask a Doctor" },
  { href: "/ai-chat", icon: <MessageSquare className="h-5 w-5" />, label: "Woomania" },
]

interface DashboardSidebarProps {
  onLinkClick?: () => void;
  isSheet?: boolean;
}

export default function DashboardSidebar({ onLinkClick, isSheet = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    const parts = name.split(' ');
    if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const handleLinkClick = (href: string) => {
    if (pathname === href) {
        onLinkClick?.(); // Close sheet even if on the same page
    } else {
        onLinkClick?.();
    }
  };

  const NavLink = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
    <Link
        key={href}
        href={href}
        onClick={() => handleLinkClick(href)}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-muted ${
            pathname === href
            ? "bg-muted text-primary font-semibold"
            : "text-muted-foreground"
        }`}
    >
        {icon}
        {label}
    </Link>
  );

  return (
    <div className="border-r bg-card shadow-sm h-full flex flex-col">
        {isSheet && (
             <div className="flex h-16 items-center border-b px-6">
                <Logo />
            </div>
        )}
        <div className="p-4 border-b">
            <Link href="/dashboard/profile" className="flex items-center gap-3" onClick={() => handleLinkClick('/dashboard/profile')}>
                 <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.photoURL ?? ""} />
                    <AvatarFallback>{getInitials(user?.displayName ?? user?.email)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-sm">{user?.displayName ?? "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
            </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
                {navItems.map((item) => <NavLink key={item.href} {...item} />)}
            </nav>
        </div>
         <div className="mt-auto p-4 border-t">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={() => logout()}>
                <LogOut className="mr-2 h-5 w-5" />
                Log Out
            </Button>
        </div>
    </div>
  );
}
