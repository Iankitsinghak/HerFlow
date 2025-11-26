
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingData {
  name?: string;
  ageRange?: string;
  country?: string;
  periodStatus?: string;
  cycleLength?: string;
  periodDuration?: string;
  lastPeriodDate?: string;
  focusAreas?: string[];
  doctorComfort?: string;
  sharingPreference?: string;
  showReminders?: boolean;
  email?: string;
  password?: string;
}

interface OnboardingContextType {
  onboardingData: OnboardingData;
  setOnboardingData: (data: OnboardingData) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  return (
    <OnboardingContext.Provider value={{ onboardingData, setOnboardingData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

// This component is no longer needed in the root layout, but we keep it
// in case it's used elsewhere for its provider logic. We can rename it to
// avoid confusion.
export function OnboardingWrapper({ children }: { children: ReactNode }) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}
