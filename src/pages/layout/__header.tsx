import { ModeToggle } from '@/components/mode-toggle';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { FC } from 'react';
import { cn } from '@/lib/utils';
import MobileNav from '@/components/mobile-nav';
import MainNav from '@/components/main-nav';
import { Icons } from '@/components/icons';
import { RainbowButton } from '@/components/ui/rainbow-button';

const Header: FC = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container h-14 flex items-center'>
        <MainNav />
        <MobileNav />
        <div className='flex flex-1 items-center justify-between space-x-2 sm:justify-end'>
          <div className="w-full flex-1 sm:w-auto sm:flex-none">
            <RainbowButton className="text-xs px-2 py-1 sm:text-sm w-full h-7 sm:h-9 sm:px-4 sm:py-2" asChild>
              <Link to="/admin">Админ панелька</Link>
            </RainbowButton>
            {/* <button className='inline-flex items-center justify-center whitespace-nowrap rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2'> */}
            {/*   <span className='absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform-gpu bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-96 dark:bg-black'></span> */}
            {/*   <p>Админ панель</p> */}
            {/* </button> */}
          </div>

          <nav className='flex items-center'>
            <Link
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'w-8 h-8',
              )}
              target='_blank'
              rel='noreferrer'
              to='https://vk.com/id56419815'
            >
              <Icons.vkontakte />
              <span className='sr-only'>VKontakte</span>
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'w-8 h-8',
              )}
              target='_blank'
              rel='noreferrer'
              to='https://t.me/JaBBaRoV_JR'
            >
              <Icons.telegram />
              <span className='sr-only'>Telegram</span>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
