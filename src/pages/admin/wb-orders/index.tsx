import { useInfiniteWbOrders } from '@/features/wb-orders';
import { FC, useEffect, useMemo, useRef } from 'react';
import {
  flexRender,
  getCoreRowModel,
  Table as ReactTable,
  useReactTable,
} from '@tanstack/react-table';
import { columns } from '@/pages/admin/wb-orders/columns';
import { WbOrdersQuery } from '@/gql/graphql';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SonnerSpinner } from '@/components/sonner-spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

type WbOrder = WbOrdersQuery['wbOrders']['edges'][number];

interface TableCellSkeletonProps<TData> {
  table: ReactTable<TData>;
}

const TableCellSkeleton: FC<TableCellSkeletonProps<WbOrder>> = ({ table }) => {
  return (
    <>
      {table.getAllColumns().map((column, index) => {
        if (column.id === 'qrCode') {
          return (
            <TableCell
              className='flex'
              style={{ width: column.getSize() }}
              key={index}
            >
              <Skeleton className='h-12 w-12 rounded-sm' />
            </TableCell>
          );
        }

        return (
          <TableCell
            className='flex'
            style={{ width: column.getSize() }}
            key={index}
          >
            <Skeleton className='h-4 w-12 rounded-sm' />
          </TableCell>
        );
      })}
    </>
  );
};

const WbOrders: FC = () => {
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isPending,
    isFetching,
    isError,
    error,
  } = useInfiniteWbOrders({
    take: 1,
    query: '',
  });

  const flatData = useMemo(
    () => data?.pages.flatMap(page => page.wbOrders.edges) ?? [],
    [data],
  );

  console.log({ data, flatData });

  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  const { rows } = table.getRowModel();
  console.log({ rows });

  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? rows.length + 1 : rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 71,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? element => element?.getBoundingClientRect().height
        : undefined,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= rows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    rows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  if (isPending) {
    return <SonnerSpinner />;
  }

  if (isError) {
    throw error;
  }

  return (
    <div className='md:container'>
      <div
        ref={tableContainerRef}
        className='max-w-fit overflow-auto w-full relative max-h-[700px] rounded-md border'
      >
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <Table
          data-bg-fetching={isFetching && !isFetchingNextPage}
          className='w-full caption-bottom text-sm data-[bg-fetching=true]:opacity-70'
        >
          <TableHeader className='grid sticky top-0 z-[1] bg-background'>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                style={{ display: 'flex', width: '100%' }}
              >
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      className='select-none'
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: header.getSize(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            style={{
              display: 'grid',
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().length !== 0 ? (
              rowVirtualizer.getVirtualItems().map(virtualRow => {
                const row = rows[virtualRow.index];
                const isLoaderRow = virtualRow.index > rows.length - 1;

                if (isLoaderRow) {
                  return (
                    <TableRow
                      key='loader-row'
                      data-index={virtualRow.index}
                      ref={node => rowVirtualizer.measureElement(node)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'absolute',
                        transform: `translateY(${virtualRow.start}px)`,
                        width: '100%',
                      }}
                    >
                      <TableCellSkeleton table={table} />
                    </TableRow>
                  );
                }

                return (
                  <TableRow
                    data-index={virtualRow.index} //needed for dynamic row height measurement
                    key={row.id}
                    ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      position: 'absolute',
                      transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                      width: '100%',
                    }}
                  >
                    {row.getVisibleCells().map(cell => {
                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            display: 'flex',
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='flex justify-center h-12'
                >
                  Нет данных.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WbOrders;
