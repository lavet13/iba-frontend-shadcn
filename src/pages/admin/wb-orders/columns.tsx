import { Button } from '@/components/ui/button';
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { WbOrdersQuery } from '@/gql/graphql';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';

type WbOrder = WbOrdersQuery['wbOrders']['edges'][number];

export const columns: ColumnDef<WbOrder>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
  },
  {
    accessorKey: 'name',
    header: 'ФИО',
  },
  {
    accessorKey: 'phone',
    header: 'Телефон',
  },
  {
    accessorKey: 'qrCode',
    cell: props => {
      const qrCodeURL = props.getValue();
      const img = (
        <img
          className='w-12 rounded-sm'
          src={
            qrCodeURL
              ? `/assets/qr-codes/${qrCodeURL}`
              : `/images/no-preview.webp`
          }
          alt='qr-code'
        />
      );
      return img;
    },
  },
  {
    accessorKey: 'orderCode',
    header: 'Код заказа',
  },
  {
    accessorKey: 'wbPhone',
    header: 'Телефон WB',
  },
  {
    accessorKey: 'status',
    header: 'Статус',
  },
  {
    accessorKey: 'createdAt',
    header: 'Создано',
    cell: props =>
      format(new Date(props.getValue() as number), 'dd.MM.yyyy, HH:mm:ss', {
        locale: ru,
      }),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Изменено',
    cell: props =>
      format(new Date(props.getValue() as number), 'dd.MM.yyyy, HH:mm:ss', {
        locale: ru,
      }),
  },
  {
    id: 'actions',
    size: 70,
    enableHiding: false,
    cell: ({ row }) => {
      const { id } = row.original;
      console.log({ id });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Открыть меню</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Действия</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText('payment.id')}
            >
              <Edit />
              Изменить
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-destructive focus:text-destructive focus:bg-destructive/10'
            >
              <Trash />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
