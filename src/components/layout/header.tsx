
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
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, User as UserIcon, Menu } from "lucide-react";
import { Logo } from "../logo";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useState } from "react";
import DashboardSidebar from "./dashboard-sidebar";

const navLinks = [
    { href: "/community", label: "Community" },
    { href: "/ask-doctor", label: "Ask a Doctor" },
    { href: "/ai-chat", label: "Woomania" },
]

export default function Header({ showLogo = true, onMobileMenuClick }: { showLogo?: boolean, onMobileMenuClick?: () => void }) {
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        
        {onMobileMenuClick ? (
           <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMobileMenuClick}>
              <Menu />
           </Button>
        ) : (
            <div className="md:hidden">
              {showLogo && (
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72 bg-card">
                       <DashboardSidebar onLinkClick={() => setMobileMenuOpen(false)} isSheet={true} />
                    </SheetContent>
                </Sheet>
              )}
            </div>
        )}

        {showLogo && (
            <div className="flex-1 md:flex-none">
                 <div className="flex justify-center md:justify-start">
                    <Logo />
                </div>
            </div>
        )}
        
        <nav className="hidden md:flex gap-6 ml-10">
            {navLinks.map(link => (
                 <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">{link.label}</Link>
            ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-4">
              <div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
              <div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
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
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
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
