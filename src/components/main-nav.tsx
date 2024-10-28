import { cn } from '@/lib/utils';
import { FC, ReactNode, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  NavLink as RouterLink,
  NavLinkProps as RouterLinkProps,
} from 'react-router-dom';
import { Icons } from '@/components/icons';

type NavLinkProps = Omit<RouterLinkProps, 'className'> & {
  children: ReactNode;
  className?: string;
};

export const NavLink: FC<NavLinkProps> = ({ to, children, className, ...props }) => {
  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0 })
  }, []);

  return (
    <RouterLink
      to={to}
      className={({ isActive }) =>
        cn(
          'transition-colors font-semibold whitespace-nowrap',
          isActive
            ? 'text-foreground hover:text-foreground/90'
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

const MainNav: FC = () => {
  return (
    <div className='hidden md:flex'>
      <Link
        to='/'
        className={cn('mr-2 flex items-center space-x-2 lg:mr-3 xl:mr-6')}
        onClick={() => window.scrollTo({ top: 0 })}
      >
        <Icons.logo className="h-6 w-6" />
        <span className='hidden font-bold xl:inline-block'>Джаббаров</span>
      </Link>
      <nav className='flex items-center space-x-3 text-sm lg:space-x-4 xl:space-x-6'>
        <NavLink to='/wb-order'>Wildberries</NavLink>
      </nav>
    </div>
  );
};

export default MainNav;
