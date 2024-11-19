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
import { Column, ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArrowDown, ArrowUp, Edit, MoreHorizontal, Trash } from 'lucide-react';

type WbOrder = WbOrdersQuery['wbOrders']['edges'][number];

export const columnTranslations: Record<string, string> = {
  id: 'ID',
  name: 'ФИО',
  phone: 'Телефон',
  qrCode: 'QR-код',
  orderCode: 'Код заказа',
  wbPhone: 'Телефон WB',
  status: 'Статус',
  createdAt: 'Создано',
  updatedAt: 'Изменено',
  actions: 'Действия',
};

export const columns: ColumnDef<WbOrder>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return <SortableHeader title='ID' column={column} />;
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <SortableHeader title='ФИО' column={column} />;
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => {
      return <SortableHeader title='Телефон' column={column} />;
    },
  },
  {
    accessorKey: 'qrCode',
    header: 'QR-код',
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
    header: ({ column }) => {
      return <SortableHeader title='Код заказа' column={column} />;
    },
  },
  {
    accessorKey: 'wbPhone',
    header: ({ column }) => {
      return <SortableHeader title='Телефон WB' column={column} />;
    },
  },
  {
    accessorKey: 'status',
    header: 'Статус',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableHeader title='Создано' column={column} />,
    cell: props =>
      format(new Date(props.getValue() as number), 'dd.MM.yyyy, HH:mm:ss', {
        locale: ru,
      }),
    sortingFn: (rowA, rowB) =>
      rowA.original.createdAt -
      rowB.original.createdAt,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <SortableHeader title="Изменено" column={column} />,
    cell: props =>
      format(new Date(props.getValue() as number), 'dd.MM.yyyy, HH:mm:ss', {
        locale: ru,
      }),
    sortingFn: (rowA, rowB) => {
    return rowA.original.updatedAt -
      rowB.original.updatedAt;
    }
  },
  {
    id: 'actions',
    size: 70,
    enableHiding: false,
    cell: ({ row }) => {
      const { id } = row.original;

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
            <DropdownMenuItem className='text-destructive focus:text-destructive focus:bg-destructive/10'>
              <Trash />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface SortableHeaderProps<TData> {
  title: string;
  column: Column<TData, unknown>;
}

function SortableHeader<TData>({ title, column }: SortableHeaderProps<TData>) {
  const isSorted = column.getIsSorted() as 'asc' | 'desc' | false;

  return (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(isSorted === 'asc')}
    >
      {title}
      {isSorted ? (
        isSorted === 'asc' ? (
          <ArrowUp className='ml-2 h-4 w-4' />
        ) : (
          <ArrowDown className='ml-2 h-4 w-4' />
        )
      ) : null}
    </Button>
  );
}
