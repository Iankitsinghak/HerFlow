
import {
  differenceInDays,
  addDays,
  parseISO,
  startOfDay,
  isSameDay,
} from 'date-fns';
import type { FieldValue } from 'firebase/firestore';

export interface CycleLog {
  id?: string;
  userId: string;
  date: string; // ISO String
  isPeriodDay: boolean;
  symptoms?: string[];
  flow?: 'light' | 'medium' | 'heavy';
  mood?: number;
  notes?: string;
  createdAt: FieldValue;
  updatedAt?: FieldValue;
}

export interface GroupedCycle {
  cycleIndex: number;
  startDate: Date;
  endDate: Date; // End of period
  duration: number; // Period duration
  cycleLength: number | null; // Full cycle length
  symptoms: string[];
  logs: CycleLog[];
}

/**
 * Finds all unique period start dates from a list of logs.
 * A start date is a period day that is not preceded by another period day.
 * @param logs - A sorted array of CycleLog objects.
 * @returns An array of Date objects representing period start dates.
 */
function findPeriodStartDates(logs: CycleLog[]): Date[] {
  const periodStartDates: Date[] = [];
  if (!logs || logs.length === 0) {
    return periodStartDates;
  }

  for (let i = 0; i < logs.length; i++) {
    const currentLog = logs[i];
    if (currentLog.isPeriodDay) {
      const prevLog = logs[i - 1];
      const isFirstDayOfPeriod = !prevLog || !prevLog.isPeriodDay || differenceInDays(parseISO(currentLog.date), parseISO(prevLog.date)) > 1;
      if (isFirstDayOfPeriod) {
        periodStartDates.push(startOfDay(parseISO(currentLog.date)));
      }
    }
  }
  return periodStartDates;
}

/**
 * Calculates the average length of the last 3 menstrual cycles.
 * @param logs - A sorted array of all cycle logs for a user.
 * @returns The average cycle length in days, or a default of 28.
 */
export function calculateAverageCycleLength(logs: CycleLog[]): number {
  const periodStartDates = findPeriodStartDates(logs);
  if (periodStartDates.length < 2) {
    return 28; // Default if not enough data
  }

  const cycleLengths: number[] = [];
  for (let i = 1; i < periodStartDates.length; i++) {
    const diff = differenceInDays(periodStartDates[i], periodStartDates[i-1]);
    cycleLengths.push(diff);
  }

  if (cycleLengths.length === 0) {
    return 28;
  }

  const recentLengths = cycleLengths.slice(-3);
  const total = recentLengths.reduce((sum, length) => sum + length, 0);
  return Math.round(total / recentLengths.length);
}

/**
 * Finds the start date of the user's most recent period.
 * @param logs - A sorted array of all cycle logs for a user.
 * @returns The most recent period start date as a Date object, or null.
 */
export function findLastPeriodStart(logs: CycleLog[]): Date | null {
  const periodStartDates = findPeriodStartDates(logs);
  return periodStartDates.length > 0 ? periodStartDates[periodStartDates.length - 1] : null;
}

/**
 * Estimates the start date of the next period.
 * @param logs - A sorted array of all cycle logs for a user.
 * @returns The estimated date of the next period as a Date object, or null.
 */
export function estimateNextPeriodDate(logs: CycleLog[]): Date | null {
  const lastPeriodStart = findLastPeriodStart(logs);
  if (!lastPeriodStart) {
    return null;
  }
  const averageCycleLength = calculateAverageCycleLength(logs);
  return addDays(lastPeriodStart, averageCycleLength);
}

/**
 * Calculates the current day number within the menstrual cycle.
 * @param logs - A sorted array of all cycle logs for a user.
 * @returns The current cycle day (e.g., 1, 14, 28), or null.
 */
export function getCurrentCycleDay(logs: CycleLog[]): number | null {
  const lastPeriodStart = findLastPeriodStart(logs);
  if (!lastPeriodStart) {
    return null;
  }
  return differenceInDays(new Date(), lastPeriodStart) + 1;
}

/**
 * Determines the current phase of the menstrual cycle.
 * @param logs - A sorted array of all cycle logs for a user.
 * @returns A string representing the current phase, or "Unknown".
 */
export function getCurrentCyclePhase(logs: CycleLog[]): string {
  const cycleDay = getCurrentCycleDay(logs);
  if (cycleDay === null) {
    return 'Unknown';
  }
  
  // Use a fallback average cycle length if calculation isn't possible
  const avgCycleLength = calculateAverageCycleLength(logs) || 28;

  if (cycleDay <= 5) return 'Menstrual';
  if (cycleDay <= 13) return 'Follicular';
  if (cycleDay <= 16) return 'Ovulation';
  if (cycleDay <= avgCycleLength) return 'Luteal';
  
  return 'Unknown'; // If cycle day is beyond average, we're in a new cycle but waiting for log
}

/**
 * Gets a brief description for a given cycle phase.
 * @param phase - The name of the cycle phase.
 * @returns A descriptive string for the phase.
 */
export function getPhaseInfo(phase: string): string {
    switch (phase) {
        case 'Menstrual':
            return "This is your period. The uterine lining is shedding. It's common to feel tired or have cramps.";
        case 'Follicular':
            return "After your period, your body prepares to release an egg. Energy levels may start to rise.";
        case 'Ovulation':
            return "Your ovary releases an egg. This is your most fertile time. You might feel a peak in energy.";
        case 'Luteal':
            return "The second half of your cycle. If the egg isn't fertilized, you may experience PMS symptoms as hormone levels decline.";
        default:
            return "Your cycle information is being calculated. Log your period to get started.";
    }
}


/**
 * Groups raw, daily log entries into distinct, consecutive period cycles. (Legacy)
 * If only one log exists (from onboarding), it uses the estimated period duration.
 * @param logs - A sorted array of CycleLog objects.
 * @param userProfile - The user's profile data, containing onboarding estimates.
 * @returns An array of GroupedCycle objects.
 */
export function groupLogsIntoCyclesLegacy(logs: CycleLog[], userProfile?: { periodDuration?: string }): GroupedCycle[] {
    if (!logs || logs.length === 0) return [];

    const periodStartDates = findPeriodStartDates(logs);
    if (periodStartDates.length === 0) return [];

    const cycles: GroupedCycle[] = [];

    periodStartDates.forEach((startDate, index) => {
        const nextStartDate = periodStartDates[index + 1] || null;
        
        const cycleLogs = logs.filter(log => {
            const logDate = startOfDay(parseISO(log.date));
            if (nextStartDate) {
                return logDate >= startDate && logDate < nextStartDate;
            }
            return logDate >= startDate;
        });

        const periodLogs = cycleLogs.filter(l => l.isPeriodDay);
        if (periodLogs.length === 0) return;

        // Find the last consecutive period day
        let endDate = startOfDay(parseISO(periodLogs[0].date));
        for (let i = 1; i < periodLogs.length; i++) {
            const currentPeriodDay = startOfDay(parseISO(periodLogs[i].date));
            const prevPeriodDay = startOfDay(parseISO(periodLogs[i-1].date));
            if (differenceInDays(currentPeriodDay, prevPeriodDay) > 1) {
                // Gap detected, so the period ended on the previous log
                endDate = prevPeriodDay;
                break;
            }
            endDate = currentPeriodDay;
        }

        let duration = differenceInDays(endDate, startDate) + 1;
        
        // If this is the most recent cycle and has only one period day logged, use onboarding estimate
        if (!nextStartDate && periodLogs.length === 1 && userProfile?.periodDuration) {
            let durationEstimate = 5; // default
            try {
                const parsed = parseInt(userProfile.periodDuration.replace('+', ''), 10);
                if (!isNaN(parsed)) {
                    durationEstimate = parsed;
                }
            } catch {}
             // We show the estimate, but the "real" end date is still just the start date
             duration = durationEstimate;
        }
        
        cycles.push({
            cycleIndex: cycles.length + 1,
            startDate,
            endDate,
            duration,
            logs: cycleLogs,
            cycleLength: nextStartDate ? differenceInDays(nextStartDate, startDate) : null,
            symptoms: [...new Set(cycleLogs.flatMap(l => l.symptoms || []))],
        });
    });

    return cycles.reverse(); // Show most recent first
}
