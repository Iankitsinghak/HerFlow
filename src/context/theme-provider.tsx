
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import * as React from 'react';

const THEMES = ['theme-violet', 'theme-blue', 'theme-green', 'theme-orange'];

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme && THEMES.includes(theme)) {
      document.body.classList.add(theme);
    }
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
