'use client';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CatalogEntry } from '@/types';
import { CatalogCoverImage } from './CatalogCoverImage';

const columns: ColumnDef<CatalogEntry>[] = [
  {
    accessorKey: 'image',
    header: '',
    cell: ({ row }) => (
      <div className="w-16 h-12 rounded-md overflow-hidden border border-border/50 bg-secondary/30">
        <CatalogCoverImage
          imageId={row.original.imageId}
          imageUrl={row.original.imageUrl}
          alt={`${row.original.brand} ${row.original.model}`}
          className="w-full h-full object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
    cell: ({ getValue }) => (
      <span className="font-semibold font-display text-primary text-xs uppercase tracking-wider">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'model',
    header: 'Model',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-foreground">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'boreDiameter',
    header: 'Bore Ø (mm)',
    cell: ({ getValue }) => (
      <span className="font-mono text-sm font-semibold">
        {(getValue() as number).toFixed(2)}
      </span>
    ),
  },
  {
    id: 'TL',
    header: 'TL',
    accessorFn: (row) => row.pistonSpecs.TL,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">
        {(getValue() as number).toFixed(2)}
      </span>
    ),
  },
  {
    id: 'KH',
    header: 'KH',
    accessorFn: (row) => row.pistonSpecs.KH,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">
        {(getValue() as number).toFixed(2)}
      </span>
    ),
  },
  {
    id: 'PIN',
    header: 'PIN',
    accessorFn: (row) => row.pistonSpecs.PIN,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {getValue() as string}
      </span>
    ),
  },
  {
    id: 'bowlDia',
    header: 'Bowl Dia Ø',
    accessorFn: (row) => row.pistonSpecs.bowlDia,
    cell: ({ getValue }) => {
      const v = getValue() as number | undefined;
      return (
        <span className="font-mono text-xs">
          {v != null ? v.toFixed(2) : '—'}
        </span>
      );
    },
  },
  {
    id: 'bowlDepth',
    header: 'Bowl Depth',
    accessorFn: (row) => row.pistonSpecs.bowlDepth,
    cell: ({ getValue }) => {
      const v = getValue() as number | undefined;
      return (
        <span className="font-mono text-xs">
          {v != null ? v.toFixed(2) : '—'}
        </span>
      );
    },
  },
  {
    id: 'ringSize1',
    header: 'Ring 1',
    accessorFn: (row) => row.ringSizes.ring1,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-amber-400 font-semibold">
        {(getValue() as number).toFixed(2)}
      </span>
    ),
  },
  {
    id: 'ringSize2',
    header: 'Ring 2',
    accessorFn: (row) => row.ringSizes.ring2,
    cell: ({ getValue }) => {
      const v = getValue() as number | undefined;
      return (
        <span className="font-mono text-xs text-amber-400/70">
          {v != null ? v.toFixed(2) : '—'}
        </span>
      );
    },
  },
  {
    id: 'note',
    header: 'Note',
    accessorFn: (row) => row.ringSizes.note,
    cell: ({ getValue }) => {
      const v = getValue() as string | undefined;
      return v ? (
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
          {v}
        </span>
      ) : null;
    },
  },
];

interface Props {
  data: CatalogEntry[];
  showActions?: boolean;
  onEdit?: (item: CatalogEntry) => void;
  onDelete?: (item: CatalogEntry) => void;
  onViewDetails?: (item: CatalogEntry) => void;
}

export function CatalogTable({
  data,
  showActions,
  onEdit,
  onDelete,
  onViewDetails,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const allColumns = showActions
    ? [
        ...columns,
        {
          id: 'actions',
          header: 'Actions',
          cell: ({ row }: { row: { original: CatalogEntry } }) => (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onViewDetails?.(row.original)}
                className="text-xs text-primary hover:underline font-medium"
                title="View Details"
              >
                View
              </button>
              <button
                onClick={() => onEdit?.(row.original)}
                className="text-xs text-primary hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(row.original)}
                className="text-xs text-destructive hover:underline"
              >
                Delete
              </button>
            </div>
          ),
        } as ColumnDef<CatalogEntry>,
      ]
    : columns;

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
    initialState: { pagination: { pageSize: 15 } },
  });

  const SortIcon = ({ isSorted }: { isSorted: false | 'asc' | 'desc' }) => {
    if (isSorted === 'asc') return <ChevronUp className="h-3 w-3" />;
    if (isSorted === 'desc') return <ChevronDown className="h-3 w-3" />;
    return <ChevronsUpDown className="h-3 w-3 text-muted-foreground/40" />;
  };

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 border-b border-border/50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap',
                      header.column.getCanSort() &&
                        'cursor-pointer select-none hover:text-foreground transition-colors'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <SortIcon isSorted={header.column.getIsSorted()} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-border/30 transition-colors hover:bg-secondary/20',
                  idx % 2 === 0 ? 'bg-background/40' : 'bg-card/30'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-secondary/20">
        <span className="text-xs text-muted-foreground font-mono">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()} · {data.length} total
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border/50 bg-secondary/40 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border/50 bg-secondary/40 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
