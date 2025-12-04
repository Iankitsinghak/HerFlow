
'use client';

import * as React from 'react';
import { Moon, Sun, Monitor, Paintbrush, Images } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const accentThemes = [
  { name: 'Pink', class: '' }, // Default
  { name: 'Violet', class: 'theme-violet' },
  { name: 'Blue', class: 'theme-blue' },
  { name: 'Green', class: 'theme-green' },
  { name: 'Orange', class: 'theme-orange' },
];

const backgroundThemes = [
    { name: 'Pink', class: 'bg-pink' },
    { name: 'Lavender', class: 'bg-lavender' },
    { name: 'Peach', class: 'bg-peach' },
    { name: 'Mint', class: 'bg-mint' },
    { name: 'Stone', class: 'bg-stone' },
]

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const [accentTheme, setAccentTheme] = React.useState('');
  const [backgroundTheme, setBackgroundTheme] = React.useState('bg-pink');

  React.useEffect(() => {
    // On mount, read the themes from localStorage and update state
    const savedAccent = localStorage.getItem('theme') || '';
    const savedBackground = localStorage.getItem('background-theme') || 'bg-pink';
    setAccentTheme(savedAccent);
    setBackgroundTheme(savedBackground);
  }, []);

  const handleAccentChange = (newThemeClass: string) => {
    // Remove all possible accent theme classes, filtering out empty strings
    document.body.classList.remove(...accentThemes.map(t => t.class).filter(Boolean));
    
    if (newThemeClass) {
      document.body.classList.add(newThemeClass);
    }
    
    localStorage.setItem('theme', newThemeClass);
    setAccentTheme(newThemeClass);
  };

  const handleBackgroundChange = (newThemeClass: string) => {
    document.body.classList.remove(...backgroundThemes.map(t => t.class));
    document.body.classList.add(newThemeClass);
    localStorage.setItem('background-theme', newThemeClass);
    setBackgroundTheme(newThemeClass);
  }

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span>Mode</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Paintbrush className="mr-2 h-4 w-4" />
          <span>Accent</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
             <DropdownMenuRadioGroup value={accentTheme} onValueChange={handleAccentChange}>
                <DropdownMenuLabel>Accent Color</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {accentThemes.map(theme => (
                    <DropdownMenuRadioItem key={theme.name} value={theme.class}>
                        {theme.name}
                    </DropdownMenuRadioItem>
                ))}
             </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Images className="mr-2 h-4 w-4" />
          <span>Background</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
             <DropdownMenuRadioGroup value={backgroundTheme} onValueChange={handleBackgroundChange}>
                <DropdownMenuLabel>Background Color</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {backgroundThemes.map(theme => (
                    <DropdownMenuRadioItem key={theme.name} value={theme.class}>
                        {theme.name}
                    </DropdownMenuRadioItem>
                ))}
             </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </>
  );
}
