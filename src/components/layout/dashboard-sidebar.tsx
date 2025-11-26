"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "../logo";
import {
  Home,
  User,
  Calendar,
  BookOpen,
  Users,
  MessageSquare,
  PanelLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { logout } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", icon: <Home />, label: "Dashboard" },
  { href: "/dashboard/profile", icon: <User />, label: "Profile" },
  { href: "/dashboard/cycle-log", icon: <Calendar />, label: "Cycle Log" },
  { href: "/dashboard/blog", icon: <BookOpen />, label: "My Blog Posts" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:block border-r bg-card shadow-sm">
        <div className="flex h-full max-h-screen flex-col gap-2 w-64">
            <div className="flex h-16 items-center border-b px-6">
                <Logo />
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
                                pathname === item.href
                                ? "bg-muted text-primary"
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
