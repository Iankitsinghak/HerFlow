import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s a summary of your activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cycle Log
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Days Until Next Period</div>
            <p className="text-xs text-muted-foreground">
              Based on your recent logs
            </p>
          </CardContent>
          <CardContent>
            <Button asChild>
                <Link href="/dashboard/cycle-log">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Log
                </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Posts</div>
            <p className="text-xs text-muted-foreground">
              2 drafts waiting
            </p>
          </CardContent>
          <CardContent>
          <Button asChild>
                <Link href="/dashboard/blog">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Post
                </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12 New Posts</div>
            <p className="text-xs text-muted-foreground">
              In topics you follow
            </p>
          </CardContent>
          <CardContent>
          <Button asChild variant="secondary">
                <Link href="/community">
                    Join Discussion
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
