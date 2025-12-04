
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import * as React from 'react';

const ACCENT_THEMES = ['theme-violet', 'theme-blue', 'theme-green', 'theme-orange'];
const BACKGROUND_THEMES = ['bg-pink', 'bg-lavender', 'bg-peach', 'bg-mint', 'bg-stone'];


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    // Apply accent theme from local storage
    const accentTheme = localStorage.getItem('theme');
    if (accentTheme && ACCENT_THEMES.includes(accentTheme)) {
      document.body.classList.add(accentTheme);
    }

    // Apply background theme from local storage
    const backgroundTheme = localStorage.getItem('background-theme');
    if (backgroundTheme && BACKGROUND_THEMES.includes(backgroundTheme)) {
        document.body.classList.add(backgroundTheme);
    } else {
        // Apply default if none is set
        document.body.classList.add('bg-pink');
    }
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
