
'use client';

import * as React from 'react';
import { Moon, Sun, Monitor, Paintbrush } from 'lucide-react';
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

const themes = [
  { name: 'Pink', class: '' }, // Default
  { name: 'Violet', class: 'theme-violet' },
  { name: 'Blue', class: 'theme-blue' },
  { name: 'Green', class: 'theme-green' },
  { name: 'Orange', class: 'theme-orange' },
];

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const [colorTheme, setColorTheme] = React.useState('');

  React.useEffect(() => {
    // On mount, read the theme from localStorage and update state
    const savedTheme = localStorage.getItem('theme') || '';
    setColorTheme(savedTheme);
  }, []);

  const handleColorChange = (newThemeClass: string) => {
    // Remove all possible theme classes
    document.body.classList.remove(...themes.map(t => t.class));
    
    // Add the new one if it's not the default
    if (newThemeClass) {
      document.body.classList.add(newThemeClass);
    }
    
    // Persist and update state
    localStorage.setItem('theme', newThemeClass);
    setColorTheme(newThemeClass);
  };

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span>Theme</span>
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
          <span>Color</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
             <DropdownMenuRadioGroup value={colorTheme} onValueChange={handleColorChange}>
                <DropdownMenuLabel>Accent Color</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {themes.map(theme => (
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
