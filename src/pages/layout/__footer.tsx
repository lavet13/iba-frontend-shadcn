import { FC, PropsWithChildren, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
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
  return (
    <RouterLink
      to={to}
      className={({ isActive }) =>
        cn(
          'transition-colors font-semibold whitespace-nowrap font-medium hover:underline underline-offset-4',
          isActive
            ? 'text-foreground hover:text-foreground/90 underline'
            : 'hover:text-foreground/80 text-foreground/60',
          className
        )
      }
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
            <FooterLink to='/resume'>Резюме</FooterLink>
            <FooterLink to='/biography'>Биография</FooterLink>
            <FooterLink to='/essay'>Реферат</FooterLink>
            <FooterLink to='/lib'>Библиотека</FooterLink>
            <FooterLink to='/source'>Ссылки</FooterLink>
            <FooterLink to='/statistic-search'>Отчет о поиске</FooterLink>
            <FooterLink to='/self'>Индивидуальный раздел</FooterLink>
          </nav>
        </div>
        <div className="flex flex-col">
          <h4 className="p-2 scroll-m-20 text-xl font-semibold tracking-tight">
            Другие ссылки
          </h4>
          <Button className='w-fit justify-start px-2' variant='link' asChild>
            <Link to='https://donntu.ru/' target='_blank' rel='noreferrer'>
              ДонНТУ
            </Link>
          </Button>
          <Button className='w-fit justify-start px-2' variant='link' asChild>
            <Link
              to='https://masters.donntu.ru/'
              target='_blank'
              rel='noreferrer'
            >
              Портал магистров
            </Link>
          </Button>
        </div>
        <div className="flex flex-col">
          <h4 className="p-2 scroll-m-20 text-xl font-semibold tracking-tight">
            Связаться
          </h4>
          <Button className='w-fit justify-start ml-2 px-2 py-0 space-x-1 h-9' asChild>
            <Link
              to='https://vk.com/beforeiclosemyeyesforever'
              target='_blank'
              rel='noreferrer'
            >
              <Icons.vkontakte className='w-6 h-6 fill-background transition-colors' />
              <span>Вконтакте</span>
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
