import { ModeToggle } from '@/components/mode-toggle';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { FC } from 'react';
import { cn } from '@/lib/utils';
import MobileNav from '@/components/mobile-nav';
import MainNav from '@/components/main-nav';
import { Icons } from '@/components/icons';

const Header: FC = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container h-14 flex items-center'>
        <MainNav />
        <MobileNav />
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <div className='hidden lg:flex flex-1 lg:w-auto lg:flex-none'>
            <Button className='px-2' variant='link' asChild>
              <Link to='https://donntu.ru/' target='_blank' rel='noreferrer'>
                ДонНТУ
              </Link>
            </Button>
            <Button className='px-2' variant='link' asChild>
              <Link
                to='https://masters.donntu.ru/'
                target='_blank'
                rel='noreferrer'
              >
                Портал магистров
              </Link>
            </Button>
          </div>
          <nav className='w-full lg:w-auto flex justify-end items-center'>
            <Link
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'w-8 h-8',
              )}
              target='_blank'
              rel='noreferrer'
              to='https://vk.com/beforeiclosemyeyesforever'
            >
              <Icons.vkontakte className='w-5 h-5 fill-foreground transition-colors' />
              <span className='sr-only'>VKontakte</span>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
