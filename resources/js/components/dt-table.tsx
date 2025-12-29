import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, formatDate } from '@/lib/utils';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface TableColumn<T> {
    title: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    sortable?: boolean;
    className?: string;
}

interface DataTableProps<T> {
    columns: TableColumn<T>[];
    renderActions?: (item: T) => React.ReactNode;
    pageSizeOptions?: number[];
    initialPageSize?: number;
    filteredTickets: T[];
    visibleColumns: Record<string, boolean>;
    handleSort: (key: keyof T) => void;
}

function DataTable<T>({
    columns,
    filteredTickets,
    visibleColumns,
    handleSort,
    renderActions,
    pageSizeOptions = [10, 20, 50, 100],
    initialPageSize = 10,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const totalPages = Math.ceil(filteredTickets.length / pageSize);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredTickets.slice(start, start + pageSize);
    }, [filteredTickets, currentPage, pageSize]);

    return (
        <div className={cn('space-y-4')}>
            <div className="border-border overflow-hidden overflow-x-auto rounded-lg border pb-2 shadow-sm">
                <Table>
                    <TableHeader className="bg-secondary/40">
                        <TableRow>
                            {columns &&
                                columns
                                    .filter((col) => visibleColumns[col.title])
                                    .map((column, index) => (
                                        <TableHead key={index} className={cn(column.className, 'overflow-hidden text-ellipsis whitespace-nowrap')}>
                                            {column.sortable ? (
                                                <button
                                                    onClick={() => handleSort(column.accessor as keyof T)}
                                                    className="ml-2 flex items-center hover:bg-transparent"
                                                >
                                                    {column.title}
                                                    <ArrowUpDown className="ml-2 h-3 w-3" />
                                                </button>
                                            ) : (
                                                column.title
                                            )}
                                        </TableHead>
                                    ))}
                            {renderActions && <TableHead></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + (renderActions ? 1 : 0)} className="text-muted-foreground py-8 text-center">
                                    Aucunne donnée ne correspond à vos critères de recherche
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((item, rowIndex) => (
                                <TableRow key={rowIndex} className="hover:bg-muted/30">
                                    {columns
                                        .filter((col) => visibleColumns[col.title])
                                        .map(({ accessor, className }, colIndex) => {
                                            const cellContent =
                                                typeof accessor === 'function'
                                                    ? accessor(item)
                                                    : typeof accessor === 'string' && typeof item[accessor] !== 'undefined'
                                                      ? accessor === 'created_at'
                                                          ? formatDate(item[accessor] as unknown as string)
                                                          : String(item[accessor])
                                                      : null;

                                            return (
                                                <TableCell
                                                    key={colIndex}
                                                    className={cn('overflow-hidden py-3 pl-4 text-ellipsis whitespace-nowrap', className)}
                                                >
                                                    {cellContent}
                                                </TableCell>
                                            );
                                        })}
                                    {renderActions && <TableCell>{renderActions(item)}</TableCell>}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="text-muted-foreground text-sm">
                    Affichage de {Math.min(filteredTickets.length, 1) + (currentPage - 1) * pageSize} à{' '}
                    {Math.min(currentPage * pageSize, filteredTickets.length)} sur {filteredTickets.length} éléments
                </div>
                <div className="flex items-center gap-4">
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

export default DataTable;
