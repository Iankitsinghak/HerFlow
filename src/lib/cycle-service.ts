
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
  createdAt: FieldValue;
}

export interface GroupedCycle {
  startDate: Date;
  endDate: Date;
  duration: number | string; // Can be a number or a string like "4-5"
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

  if (cycleDay <= 5) return 'Menstrual';
  if (cycleDay <= 13) return 'Follicular';
  if (cycleDay <= 16) return 'Ovulation';
  if (cycleDay <= calculateAverageCycleLength(logs)) return 'Luteal'; // Use average length
  
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
 * Groups raw, daily log entries into distinct, consecutive period cycles.
 * If only one log exists (from onboarding), it uses the estimated period duration.
 * @param logs - A sorted array of CycleLog objects.
 * @param userProfile - The user's profile data, containing onboarding estimates.
 * @returns An array of GroupedCycle objects.
 */
export function groupLogsIntoCycles(logs: CycleLog[], userProfile?: { periodDuration?: string }): GroupedCycle[] {
    if (!logs || logs.length === 0) return [];

    // Special case: if there's only one period day log, it's likely from onboarding.
    const periodDays = logs.filter(log => log.isPeriodDay);
    if (periodDays.length === 1 && userProfile?.periodDuration) {
        const singleLog = periodDays[0];
        const startDate = startOfDay(parseISO(singleLog.date));
        
        // Estimate end date from periodDuration string (e.g., "4-5" -> 4 days)
        const durationEstimate = parseInt(userProfile.periodDuration, 10);
        const endDate = addDays(startDate, Math.max(0, durationEstimate - 1));

        return [{
            startDate: startDate,
            endDate: endDate,
            duration: userProfile.periodDuration, // Use the string from onboarding, e.g., "4-5"
            symptoms: logs.flatMap(l => l.symptoms || []),
            logs: logs
        }];
    }

    const cycles: GroupedCycle[] = [];
    let currentCycleLogs: CycleLog[] = [];
    let periodStartDate: Date | null = null;

    for (const log of logs) {
        if (log.isPeriodDay) {
            if (!periodStartDate) {
                // This is the start of a new period cycle
                periodStartDate = startOfDay(parseISO(log.date));
            }
            currentCycleLogs.push(log);
        } else {
            // It's not a period day
            if (periodStartDate) {
                // A period was in progress, but now it has ended. Finalize the cycle.
                const periodLogs = currentCycleLogs.filter(l => l.isPeriodDay);
                const startDate = periodStartDate;
                const endDate = startOfDay(parseISO(periodLogs[periodLogs.length - 1].date));
                const allSymptoms = [...new Set(currentCycleLogs.flatMap(l => l.symptoms || []))];
                
                cycles.push({
                    startDate,
                    endDate,
                    duration: differenceInDays(endDate, startDate) + 1,
                    symptoms: allSymptoms,
                    logs: currentCycleLogs
                });

                // Reset for the next cycle
                periodStartDate = null;
                currentCycleLogs = [log]; // Start new "cycle" of logs (might be just symptoms)
            } else {
                 currentCycleLogs.push(log);
            }
        }
    }

    // After the loop, if there's a cycle still in progress, add it.
    if (periodStartDate && currentCycleLogs.some(l => l.isPeriodDay)) {
        const periodLogs = currentCycleLogs.filter(l => l.isPeriodDay);
        const startDate = periodStartDate;
        const endDate = startOfDay(parseISO(periodLogs[periodLogs.length - 1].date));
        const allSymptoms = [...new Set(currentCycleLogs.flatMap(l => l.symptoms || []))];

        cycles.push({
            startDate,
            endDate,
            duration: differenceInDays(endDate, startDate) + 1,
            symptoms: allSymptoms,
            logs: currentCycleLogs
        });
    }

    return cycles.reverse(); // Show most recent first
}
