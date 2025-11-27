
"use client";

import {
  Home,
  User,
  Calendar,
  BookOpen,
  Users,
  MessageSquare,
  CircleHelp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../logo";

const navItems = [
  { href: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
  { href: "/dashboard/profile", icon: <User className="h-5 w-5" />, label: "Profile" },
  { href: "/dashboard/cycle-log", icon: <Calendar className="h-5 w-5" />, label: "Cycle Log" },
  { href: "/dashboard/blog", icon: <BookOpen className="h-5 w-5" />, label: "My Blog Posts" },
];

const mainNavItems = [
    { href: "/community", icon: <Users className="h-5 w-5" />, label: "Community" },
    { href: "/ask-doctor", icon: <CircleHelp className="h-5 w-5" />, label: "Ask a Doctor" },
    { href: "/ai-chat", icon: <MessageSquare className="h-5 w-5" />, label: "Aura" },
]

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="border-r bg-card shadow-sm h-full">
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-16 items-center border-b px-6">
                <Logo />
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                    <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dashboard</p>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-muted ${
                                pathname === item.href
                                ? "bg-muted text-primary font-semibold"
                                : "text-muted-foreground"
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                    <p className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main Menu</p>
                     {mainNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-muted ${
                                pathname === item.href
                                ? "bg-muted text-primary font-semibold"
                                : "text-muted-foreground"
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    </div>
  );
}
