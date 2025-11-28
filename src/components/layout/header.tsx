
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    LayoutDashboard, 
    LogOut, 
    User as UserIcon, 
    Menu,
    Home,
    Calendar,
    Users,
    MessageSquare,
    CircleHelp,
    BookOpen
} from "lucide-react";
import { Logo } from "../logo";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { href: "/dashboard", icon: <Home className="h-4 w-4" />, label: "Dashboard" },
  { href: "/dashboard/profile", icon: <UserIcon className="h-4 w-4" />, label: "Profile" },
  { href: "/dashboard/cycle-log", icon: <Calendar className="h-4 w-4" />, label: "Cycle Log" },
  { href: "/community", icon: <Users className="h-4 w-4" />, label: "Community" },
  { href: "/ask-doctor", icon: <CircleHelp className="h-4 w-4" />, label: "Ask a Doctor" },
  { href: "/ai-chat", icon: <MessageSquare className="h-4 w-4" />, label: "Woomania" },
  { href: "/learn/products", icon: <BookOpen className="h-4 w-4" />, label: "Health Guide" },
];


export default function Header({ onMobileMenuClick }: { onMobileMenuClick?: () => void }) {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    const parts = name.split(' ');
    if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center px-4 md:px-6">
        
        {isMobile && onMobileMenuClick && (
           <Button variant="ghost" size="icon" className="mr-2" onClick={onMobileMenuClick}>
              <Menu />
           </Button>
        )}

        <div className="flex-1">
            <div className="flex justify-center md:justify-start">
                <Logo />
            </div>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
                    <AvatarFallback>{getInitials(user.displayName ?? user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName ?? "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {navItems.map(item => (
                         <DropdownMenuItem key={item.href} asChild>
                            <Link href={item.href}>
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
