
'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart as LineChartIcon, BarChart2, PieChart, TrendingUp } from 'lucide-react';
import { GroupedCycle } from '@/lib/cycle-service';
import { useMemo } from 'react';
import { getCycleLengths, getLatestCycle, getFlowData, getMoodTrend, getSymptomsFrequency } from '@/lib/cycle-analytics';

interface CycleGraphsProps {
    cycles: GroupedCycle[];
}

const ChartCard: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode, hasData: boolean }> = ({ title, icon, children, hasData }) => (
    <Card className="hover:scale-[1.01] transition-all duration-200">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-headline">
                {icon}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="h-60">
           {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
           ) : (
             <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                <p>Not enough data yet.<br/>Log a few more cycles to see this chart. 🌸</p>
             </div>
           )}
        </CardContent>
    </Card>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-popover border rounded-md shadow-lg text-popover-foreground text-sm">
          <p className="font-bold">{label}</p>
          {payload.map((p: any, index: number) => (
             <p key={index} style={{ color: p.color }}>{`${p.name}: ${p.value}`}</p>
          ))}
        </div>
      );
    }
    return null;
};

const MoodTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const emojis = ['😭', '😢', '😐', '😊', '😄'];
        const emoji = emojis[value - 1] || '🤔';
        return (
            <div className="p-2 bg-popover border rounded-md shadow-lg text-popover-foreground text-sm flex items-center gap-2">
                <span>{label}:</span>
                <span className="text-xl">{emoji}</span>
                <span className="font-bold">(Mood: {value})</span>
            </div>
        );
    }
    return null;
}


export function CycleGraphs({ cycles }: CycleGraphsProps) {
    const cycleLengthData = useMemo(() => getCycleLengths(cycles), [cycles]);
    const latestCycle = useMemo(() => getLatestCycle(cycles), [cycles]);
    const flowData = useMemo(() => getFlowData(latestCycle), [latestCycle]);
    const moodData = useMemo(() => getMoodTrend(latestCycle), [latestCycle]);
    const symptomsData = useMemo(() => getSymptomsFrequency(cycles, 5), [cycles]);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <ChartCard title="Cycle Length Trend" icon={<TrendingUp className="h-5 w-5 text-primary" />} hasData={cycleLengthData.length > 1}>
                <LineChart data={cycleLengthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: 'Days', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))'} }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}/>
                    <Line type="monotone" dataKey="length" name="Length" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                </LineChart>
            </ChartCard>

            <ChartCard title="Flow Intensity (Latest Cycle)" icon={<BarChart2 className="h-5 w-5 text-primary" />} hasData={flowData.length > 0}>
                <BarChart data={flowData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis 
                        ticks={[1, 2, 3]} 
                        tickFormatter={(value) => ['Light', 'Medium', 'Heavy'][value-1]} 
                        domain={[0, 3.5]}
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.2)' }} />
                    <Bar dataKey="level" name="Flow" fill="hsl(var(--primary) / 0.8)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ChartCard>

            <ChartCard title="Mood Trend (Latest Cycle)" icon={<LineChartIcon className="h-5 w-5 text-primary" />} hasData={moodData.length > 0}>
                <LineChart data={moodData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis domain={[0, 5.5]} ticks={[1,2,3,4,5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<MoodTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}/>
                    <Line type="monotone" dataKey="mood" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
            </ChartCard>

            <ChartCard title="Symptoms Frequency" icon={<PieChart className="h-5 w-5 text-primary" />} hasData={symptomsData.length > 0}>
                <BarChart data={symptomsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}/>
                    <Bar dataKey="value" name="Count" fill="hsl(var(--primary) / 0.7)" layout="vertical" radius={[0, 4, 4, 0]}>
                       <LabelList dataKey="value" position="right" style={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
                    </Bar>
                </BarChart>
            </ChartCard>
        </div>
    );
}
