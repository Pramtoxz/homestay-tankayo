import { Loader2, Search } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type PaginatedResponse<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
};

type FilterDef = {
    key: string;
    label: string;
    options: { value: string; label: string }[];
};

type SearchPickerDialogProps<T> = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    searchPlaceholder?: string;
    fetchUrl: string;
    extraParams?: Record<string, string>;
    filters?: FilterDef[];
    columns: string[];
    renderRow: (item: T) => React.ReactNode[];
    getRowKey: (item: T) => string | number;
    onSelect: (item: T) => void;
    emptyMessage?: string;
    contentClassName?: string;
    tableMaxHeightClassName?: string;
};

export function SearchPickerDialog<T>({
    open,
    onOpenChange,
    title,
    searchPlaceholder = 'Cari...',
    fetchUrl,
    extraParams,
    filters,
    columns,
    renderRow,
    getRowKey,
    onSelect,
    emptyMessage = 'Tidak ada data.',
    contentClassName = 'sm:max-w-2xl',
    tableMaxHeightClassName = 'max-h-96',
}: SearchPickerDialogProps<T>) {
    const [search, setSearch] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [filterValues, setFilterValues] = React.useState<Record<string, string>>({});
    const [data, setData] = React.useState<T[]>([]);
    const [lastPage, setLastPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const [wasOpen, setWasOpen] = React.useState(open);

    if (open !== wasOpen) {
        setWasOpen(open);

        if (open) {
            setSearch('');
            setPage(1);
            setFilterValues({});
        }
    }

    React.useEffect(() => {
        if (!open) {
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);

            try {
                const activeFilters = Object.fromEntries(Object.entries(filterValues).filter(([, v]) => v));
                const params = new URLSearchParams({ search, page: String(page), ...extraParams, ...activeFilters });
                const response = await fetch(`${fetchUrl}?${params.toString()}`, {
                    headers: { Accept: 'application/json' },
                });

                if (!response.ok) {
                    setData([]);
                    setLastPage(1);
                    setTotal(0);

                    return;
                }

                const json: PaginatedResponse<T> = await response.json();

                setData(json.data);
                setLastPage(json.last_page);
                setTotal(json.total);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [open, search, page, fetchUrl, extraParams, filterValues]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={contentClassName}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder={searchPlaceholder}
                            className="pl-8"
                        />
                    </div>
                    {filters?.map((filter) => (
                        <Select
                            key={filter.key}
                            value={filterValues[filter.key] || 'all'}
                            onValueChange={(v) => {
                                setFilterValues((prev) => ({ ...prev, [filter.key]: v === 'all' ? '' : v }));
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder={filter.label} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua {filter.label}</SelectItem>
                                {filter.options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}
                </div>

                <div className={`${tableMaxHeightClassName} overflow-y-auto rounded-md border`}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableHead key={col}>{col}</TableHead>
                                ))}
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : data.length ? (
                                data.map((item) => (
                                    <TableRow key={getRowKey(item)}>
                                        {renderRow(item).map((cell, i) => (
                                            <TableCell key={i}>{cell}</TableCell>
                                        ))}
                                        <TableCell className="text-right">
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => {
                                                    onSelect(item);
                                                    onOpenChange(false);
                                                }}
                                            >
                                                Pilih
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{total} data ditemukan</span>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Sebelumnya
                        </Button>
                        <span>
                            Halaman {page} dari {Math.max(lastPage, 1)}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={page >= lastPage}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Berikutnya
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
