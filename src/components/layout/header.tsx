
"use client";

import { useState } from "react";
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
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    LogOut, 
    User as UserIcon, 
    Menu,
} from "lucide-react";
import { Logo } from "../logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "../ui/sheet";
import DashboardSidebar from "./dashboard-sidebar";


const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/cycle-log", label: "Cycle Log" },
  { href: "/community", label: "Community" },
  { href: "/ask-doctor", label: "Ask a Doctor" },
  { href: "/ai-chat", label: "Woomania" },
  { href: "/learn/products", label: "Health Guide" },
];


export default function Header() {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    const parts = name.split(' ');
    if (parts.length > 1 && parts[1]) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
       {isMobile && user && (
         <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="p-0 w-72 bg-card">
              <DashboardSidebar onLinkClick={() => setMobileMenuOpen(false)} />
            </SheetContent>
        </Sheet>
       )}
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        
        <div className="flex items-center gap-2 md:gap-6">
          {isMobile && user && (
            <Button variant="ghost" size="icon" className="-ml-2" onClick={() => setMobileMenuOpen(true)}>
                <Menu />
            </Button>
          )}
          <Logo />
        </div>
        
        {!isMobile && user && (
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        
        <div className="flex items-center gap-2">
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
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/profile">
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
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
