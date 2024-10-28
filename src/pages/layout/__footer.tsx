import { FC, ReactNode, useCallback } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Icons } from '@/components/icons';
import {
  NavLink as RouterLink,
  NavLinkProps as RouterLinkProps,
} from 'react-router-dom';
import { cn } from '@/lib/utils';

type NavLinkProps = Omit<RouterLinkProps, 'className'> & {
  children: ReactNode;
  className?: string;
};

export const FooterLink: FC<NavLinkProps> = ({ to, children, className, ...props }) => {
  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <RouterLink
      to={to}
      className={({ isActive }) =>
        cn(
          'inline-flex w-fit transition-colors font-semibold whitespace-nowrap font-medium hover:underline underline-offset-4',
          isActive
            ? 'text-foreground hover:text-foreground/90 underline'
            : 'hover:text-foreground/80 text-foreground/60',
          className
        )
      }
      onClick={handleClick}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

const Footer: FC = () => {
  return (
    <footer className="py-6 md:px-8 md:py-8">
      <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8 min-h-24 max-w-7xl">
        <div className="flex flex-col">
          <h4 className="p-2 scroll-m-20 text-xl font-semibold tracking-tight">
            Ссылки
          </h4>
          <nav className="flex flex-col space-y-2 p-2">
            <FooterLink to='/wb-order'>Wildberries</FooterLink>
          </nav>
        </div>
        <div className="flex flex-col">
          <h4 className="p-2 scroll-m-20 text-xl font-semibold tracking-tight">
            Связаться
          </h4>
          <div className="flex items-center pl-1">
            <Link
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'size-10',
              )}
              target='_blank'
              rel='noreferrer'
              to='https://vk.com/id56419815'
            >
              <Icons.vkontakte className='size-7 fill-foreground transition-colors' />
              <span className='sr-only'>VKontakte</span>
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'size-10',
              )}
              target='_blank'
              rel='noreferrer'
              to='https://t.me/JaBBaRoV_JR'
            >
              <Icons.telegram className="size-6 fill-foreground transition-colors" />
              <span className='sr-only'>Telegram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
