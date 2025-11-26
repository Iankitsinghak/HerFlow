import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockLogs = [
  { id: 1, startDate: "2024-04-15", endDate: "2024-04-19", duration: 5, symptoms: ["Cramps", "Bloating"] },
  { id: 2, startDate: "2024-03-17", endDate: "2024-03-21", duration: 5, symptoms: ["Headache"] },
  { id: 3, startDate: "2024-02-18", endDate: "2024-02-22", duration: 5, symptoms: ["Cramps", "Fatigue"] },
];

export default function CycleLogPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Cycle Log</h1>
          <p className="text-muted-foreground">
            Track and manage your menstrual cycle history.
          </p>
        </div>
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Log
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Cycle Log</DialogTitle>
                    <DialogDescription>
                        Enter the details of your cycle.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start-date" className="text-right">Start Date</Label>
                        <Input id="start-date" type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="end-date" className="text-right">End Date</Label>
                        <Input id="end-date" type="date" className="col-span-3" />
                    </div>
                </div>
                <Button>Save Log</Button>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log History</CardTitle>
          <CardDescription>A record of your past cycles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Symptoms</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.startDate}</TableCell>
                  <TableCell>{log.endDate}</TableCell>
                  <TableCell>{log.duration} days</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {log.symptoms.map(symptom => <Badge key={symptom} variant="secondary">{symptom}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
