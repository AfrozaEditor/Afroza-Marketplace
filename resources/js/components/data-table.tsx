'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageSizeOptions?: number[];
    initialPageSize?: number;
    searchColumn?: string;
    searchPlaceholder?: string;
    columnVisibility?: VisibilityState;
    setColumnVisibility?: React.Dispatch<React.SetStateAction<VisibilityState>>;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageSizeOptions = [20, 50, 100],
    initialPageSize = 20,
    searchColumn = 'name',
    searchPlaceholder = 'Rechercher...',
    columnVisibility,
    setColumnVisibility,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        columnResizeMode: 'onChange',
        initialState: {
            pagination: {
                pageSize: initialPageSize,
            },
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex: currentPage - 1,
                pageSize,
            },
        },
    });

    const totalPages = Math.ceil(table.getFilteredRowModel().rows.length / pageSize);
    const isMobile = useIsMobile();

    return (
        <div className="w-full">
            <div className="flex items-center gap-3 py-4">
                <Input
                    placeholder={searchPlaceholder}
                    value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value)}
                    className="max-w-lg"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-10">
                            Columns <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="text-sm font-medium capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10 text-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="font-semibold tracking-wider hover:bg-none [&>*]:py-1 [&>*]:text-sm">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="bg-opacity-90 font-bold">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="[&>*:nth-child(even)]:bg-gray-50">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="transition-colors duration-150 hover:bg-gray-100 [&>td]:py-2.5 [&>td]:text-sm"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-16 text-center">
                                    Aucun résultat.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-row items-center justify-between gap-4 py-4">
                <div className="text-muted-foreground text-sm">
                    {!isMobile && 'Affichage de'} {Math.min(table.getFilteredRowModel().rows.length, 1) + (currentPage - 1) * pageSize} à{' '}
                    {Math.min(currentPage * pageSize, table.getFilteredRowModel().rows.length)} sur {table.getFilteredRowModel().rows.length} éléments
                </div>
                <div className="flex items-center gap-4">
                    {!isMobile && (
                        <div className="flex items-center gap-2">
                            <Label htmlFor="page-size" className="text-sm whitespace-nowrap">
                                Par page:
                            </Label>
                            <Select
                                value={String(pageSize)}
                                onValueChange={(value) => {
                                    setPageSize(Number(value));
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger id="page-size" className="h-8 w-16">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {pageSizeOptions.map((size) => (
                                        <SelectItem key={size} value={`${size}`}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="flex items-center">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center text-sm">
                            {currentPage} / {totalPages || 1}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
