import { Button } from '@/components/ui/button';
import { CheckIcon, LaptopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/lib/atoms/theme';
import { cn } from '@/lib/utils';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='h-8 w-8' variant='ghost' size='icon'>
          <SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem className="transition-none" onClick={() => setTheme('light')}>
          <SunIcon className='mr-2 size-4' /> Светлая
          <CheckIcon
            className={cn(
              'ml-auto h-4 w-4',
              theme === 'light' ? 'visible' : 'invisible',
            )}
          />
        </DropdownMenuItem>
        <DropdownMenuItem className="transition-none" onClick={() => setTheme('dark')}>
          <MoonIcon className='mr-2 size-4' /> Темная
          <CheckIcon
            className={cn(
              'ml-auto h-4 w-4',
              theme === 'dark' ? 'visible' : 'invisible',
            )}
          />
        </DropdownMenuItem>
        <DropdownMenuItem className="transition-none" onClick={() => setTheme('system')}>
          <LaptopIcon className="mr-2 size-4" /> Системная
          <CheckIcon
            className={cn(
              'ml-2 h-4 w-4',
              theme === 'system' ? 'visible' : 'invisible',
            )}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
