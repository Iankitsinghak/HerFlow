
'use client';

import { differenceInDays, addDays, parseISO, startOfDay, isSameDay } from 'date-fns';
import type { CycleLog, GroupedCycle } from './cycle-service';


/**
 * Groups raw log entries into distinct menstrual cycles.
 * A new cycle starts with a period day that is at least 10 days after the start of the last period.
 * @param logs - A sorted array of all CycleLog objects for a user (must be sorted by date ascending).
 * @returns An array of cycle objects, with the most recent cycle first.
 */
export function groupLogsIntoCycles(logs: CycleLog[]): GroupedCycle[] {
  if (!logs || logs.length < 1) {
    return [];
  }

  const cycles: GroupedCycle[] = [];
  let currentCycleLogs: CycleLog[] = [];

  // Find all unique period start dates
  const periodStartDates: Date[] = [];
  logs.forEach((log, index) => {
    if (log.isPeriodDay) {
      const logDate = startOfDay(parseISO(log.date));
      const previousLog = logs[index - 1];
      if (!previousLog || !previousLog.isPeriodDay || differenceInDays(logDate, startOfDay(parseISO(previousLog.date))) > 1) {
        // This is a new period start day
        if (periodStartDates.length === 0 || differenceInDays(logDate, periodStartDates[periodStartDates.length - 1]) >= 10) {
           periodStartDates.push(logDate);
        }
      }
    }
  });

  if (periodStartDates.length === 0) {
      return [];
  }


  // Group logs by cycle
  for (let i = 0; i < periodStartDates.length; i++) {
    const cycleStartDate = periodStartDates[i];
    const nextCycleStartDate = periodStartDates[i + 1] || null;

    const cycleLogs = logs.filter(log => {
        const logDate = startOfDay(parseISO(log.date));
        if (nextCycleStartDate) {
            return logDate >= cycleStartDate && logDate < nextCycleStartDate;
        }
        return logDate >= cycleStartDate;
    });

    const periodLogs = cycleLogs.filter(l => l.isPeriodDay);
    if(periodLogs.length === 0) continue;

    const periodEndDate = startOfDay(parseISO(periodLogs[periodLogs.length - 1].date));
    
    cycles.push({
      cycleIndex: i + 1,
      startDate: cycleStartDate,
      endDate: periodEndDate, // This is period end date
      duration: differenceInDays(periodEndDate, cycleStartDate) + 1, // Period duration
      cycleLength: nextCycleStartDate ? differenceInDays(nextCycleStartDate, cycleStartDate) : null,
      logs: cycleLogs,
      symptoms: [...new Set(cycleLogs.flatMap(l => l.symptoms || []))],
    });
  }
  
  return cycles.reverse(); // most recent first
}


/**
 * Prepares cycle length data for the Recharts line chart.
 * @param cycles - An array of cycle objects from groupLogsIntoCycles.
 * @returns Data formatted for the chart.
 */
export function getCycleLengths(cycles: GroupedCycle[]) {
    // cycles are reversed (newest first), so we reverse again for chronological order
    return cycles.slice().reverse()
        .filter(c => c.cycleLength !== null)
        .map((c, index) => ({
            name: `Cycle ${c.cycleIndex}`,
            length: c.cycleLength,
        }));
}

/**
 * Gets the most recent cycle from the list.
 * @param cycles - An array of cycle objects.
 * @returns The latest cycle object, or null.
 */
export function getLatestCycle(cycles: GroupedCycle[]): GroupedCycle | null {
    return cycles.length > 0 ? cycles[0] : null;
}

/**
 * Prepares flow intensity data for the Recharts bar chart from the latest cycle.
 * @param latestCycle - The most recent cycle object.
 * @returns Data formatted for the chart.
 */
export function getFlowData(latestCycle: GroupedCycle | null) {
  if (!latestCycle) return [];

  const flowMap = { light: 1, medium: 2, heavy: 3 };

  return latestCycle.logs
    .filter(log => log.isPeriodDay && log.flow && flowMap[log.flow as keyof typeof flowMap])
    .map((log, index) => ({
      name: `Day ${index + 1}`,
      level: flowMap[log.flow as keyof typeof flowMap],
    }));
}


/**
 * Prepares mood trend data for the Recharts line chart from the latest cycle.
 * @param latestCycle - The most recent cycle object.
 * @returns Data formatted for the chart.
 */
export function getMoodTrend(latestCycle: GroupedCycle | null) {
    if (!latestCycle) return [];

    return latestCycle.logs
        .filter(log => typeof log.mood === 'number' && log.mood >= 1 && log.mood <= 5)
        .map((log, index) => {
            const dayOfCycle = differenceInDays(parseISO(log.date), latestCycle.startDate) + 1;
            return {
                name: `Day ${dayOfCycle}`,
                mood: log.mood,
            }
        });
}

/**
 * Calculates the frequency of each symptom across all cycles.
 * @param cycles - An array of cycle objects.
 * @param limit - The number of top symptoms to return.
 * @returns An array of symptom frequency data for the chart.
 */
export function getSymptomsFrequency(cycles: GroupedCycle[], limit = 5) {
  const symptomCounts: Record<string, number> = {};

  cycles.forEach(cycle => {
    cycle.logs.forEach(log => {
      (log.symptoms || []).forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });
  });

  return Object.entries(symptomCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name, value]) => ({ name, value }))
    .reverse(); // For horizontal bar chart
}


/**
 * Generates human-readable insights based on cycle data.
 * @param cycles - An array of cycle objects.
 * @returns An array of insight strings.
 */
export function getInsightsFromCycles(cycles: GroupedCycle[]): string[] {
    const insights: string[] = [];
    if (cycles.length < 2) {
        return ["Start logging your cycles to unlock personalised insights. ✨"];
    }

    // Insight 1: Cycle stability
    if (cycles.length >= 3) {
        const lastThreeLengths = cycles.slice(0, 3).map(c => c.cycleLength).filter(Boolean) as number[];
        if (lastThreeLengths.length === 3) {
            const min = Math.min(...lastThreeLengths);
            const max = Math.max(...lastThreeLengths);
            if (max - min <= 3) {
                insights.push(`✨ Your last 3 cycles were stable between ${min}–${max} days.`);
            }
        }
    }

    // Insight 2: Heavy flow on day 2
    const heavyDay2Count = cycles.filter(c => {
        const day2Log = c.logs.find(l => differenceInDays(parseISO(l.date), c.startDate) + 1 === 2);
        return day2Log?.flow === 'heavy';
    }).length;
    if (heavyDay2Count >= 2) {
        insights.push("🩸 Heavy flow seems to be common for you on Day 2.");
    }
    
    // Insight 3: Luteal phase tiredness (mood < 3)
    const lutealTiredness = cycles.filter(c => {
       const lutealLogs = c.logs.filter(l => {
           const day = differenceInDays(parseISO(l.date), c.startDate) + 1;
           return day > 16 && day < (c.cycleLength || 28);
       });
       return lutealLogs.some(l => typeof l.mood === 'number' && l.mood < 3);
    }).length;

    if (lutealTiredness / cycles.length > 0.5) {
        insights.push("🌙 You seem to log lower moods more often in the second half of your cycle (luteal phase).");
    }

    // Insight 4: Cramps frequency
    const cyclesWithCramps = cycles.filter(c => c.symptoms.includes('Cramps')).length;
    if (cyclesWithCramps / cycles.length > 0.6) {
        insights.push("😭 Cramps make an appearance in most of your logged cycles.");
    }
    
    // Insight 5: Bloating frequency
    const cyclesWithBloating = cycles.filter(c => c.symptoms.includes('Bloating')).length;
    if (cyclesWithBloating / cycles.length > 0.5) {
        insights.push("😮‍💨 Bloating seems to be a regular guest during your cycles.");
    }

    if (insights.length === 0) {
        return ["Keep logging to discover more patterns about your body! 🌸"];
    }

    return insights;
}
