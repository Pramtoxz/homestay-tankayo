import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type { Column, ColumnDef, OnChangeFn, SortingState } from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: PaginationMeta;
    sorting?: SortingState;
    onSortingChange?: OnChangeFn<SortingState>;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (perPage: number) => void;
    emptyMessage?: string;
};

export function DataTable<TData, TValue>({
    columns,
    data,
    pagination,
    sorting = [],
    onSortingChange,
    onPageChange,
    onPageSizeChange,
    emptyMessage = 'Tidak ada data.',
}: DataTableProps<TData, TValue>) {
    const offset = pagination ? (pagination.current_page - 1) * pagination.per_page : 0;

    const numberedColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => [
        {
            id: 'no',
            header: () => 'No',
            cell: ({ row }) => offset + row.index + 1,
            enableSorting: false,
            size: 56,
        },
        ...columns,
    ], [columns, offset]);

    const table = useReactTable({
        data,
        columns: numberedColumns,
        state: { sorting },
        onSortingChange,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: !!pagination,
        manualSorting: true,
        pageCount: pagination?.last_page ?? -1,
    });

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className={header.column.id === 'no' ? 'w-14' : undefined}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cell.column.id === 'no' ? 'text-center text-muted-foreground' : undefined}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={numberedColumns.length} className="h-24 text-center">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-muted-foreground">
                        {pagination.total} data ditemukan
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Per halaman</span>
                            <Select
                                value={String(pagination.per_page)}
                                onValueChange={(value) => onPageSizeChange?.(Number(value))}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Halaman {pagination.current_page} dari {pagination.last_page}
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onPageChange?.(1)}
                                disabled={pagination.current_page <= 1}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onPageChange?.(pagination.current_page - 1)}
                                disabled={pagination.current_page <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onPageChange?.(pagination.current_page + 1)}
                                disabled={pagination.current_page >= pagination.last_page}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onPageChange?.(pagination.last_page)}
                                disabled={pagination.current_page >= pagination.last_page}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

type SortableHeaderProps = {
    title: string;
    column: Column<any, unknown>;
    className?: string;
};

export function SortableHeader({ title, column, className }: SortableHeaderProps) {
    return (
        <div className={cn('flex items-center', className)}>
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>{title}</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
    );
}
