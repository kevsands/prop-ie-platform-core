"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Filter,
  MoreHorizontal,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
  Header,
  HeaderGroup,
  Cell,
  Table as TableInstance,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Input } from "./input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Skeleton } from "./skeleton";
import { Badge } from "./badge";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export type DataTableFilterOption = {
  id: string;
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export interface DataTableFilterProps<TData> {
  columnId: string;
  title: string;
  options: DataTableFilterOption[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  filters?: DataTableFilterProps<TData>[];
  rowSelection?: boolean;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (row: TData) => void;
  loading?: boolean;
  loadingRowCount?: number;
  emptyStateMessage?: React.ReactNode;
  toolbar?: React.ReactNode;
  exportFileName?: string;
  exportData?: boolean;
  className?: string;
  hasStickyHeader?: boolean;
  noHeader?: boolean;
  headerClassName?: string;
  onSelectedRowsChange?: (rows: TData[]) => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onFilterChange?: (filters: ColumnFiltersState) => void;
  initialSorting?: SortingState;
  dense?: boolean;
  zebra?: boolean;
  showRowHover?: boolean;
  expandable?: boolean;
  expandedRow?: (props: { row: TData }) => React.ReactNode;
  onRowExpand?: (row: TData, expanded: boolean) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder = "Search...",
  filters,
  rowSelection = false,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onRowClick,
  loading = false,
  loadingRowCount = 5,
  emptyStateMessage = "No results found",
  toolbar,
  exportFileName,
  exportData = false,
  className,
  hasStickyHeader = false,
  noHeader = false,
  headerClassName,
  onSelectedRowsChange,
  onPaginationChange,
  onSortingChange,
  onFilterChange,
  initialSorting,
  dense = false,
  zebra = false,
  showRowHover = true,
  expandable = false,
  expandedRow,
  onRowExpand,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting || []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [rowSelectionState, setRowSelectionState] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  
  // Create table instance
  const table: TableInstance<TData> = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    onSortingChange: (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    onColumnFiltersChange: (updaterOrValue: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)) => {
      const newColumnFilters = typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue;
      setColumnFilters(newColumnFilters);
      onFilterChange?.(newColumnFilters);
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelectionState,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection: rowSelectionState,
      columnVisibility,
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    enableRowSelection: rowSelection,
    initialState: {
      pagination: pagination ? { pageSize } : undefined,
    },
  });
  
  // Handle pagination changes
  useEffect(() => {
    if (pagination && onPaginationChange) {
      const { pageIndex, pageSize: currentPageSize } = table.getState().pagination;
      onPaginationChange(pageIndex + 1, currentPageSize);
    }
  }, [
    pagination,
    onPaginationChange,
    table.getState().pagination.pageIndex,
    table.getState().pagination.pageSize,
  ]);
  
  // Handle selected rows change
  useEffect(() => {
    if (rowSelection && onSelectedRowsChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectedRowsChange(selectedRows);
    }
  }, [rowSelection, onSelectedRowsChange, table, rowSelectionState]);

  // Export table data to CSV
  const exportToCSV = () => {
    if (!exportData) return;
    
    const visibleColumns = table.getAllColumns().filter(column => column.getIsVisible());
    const headers = visibleColumns.map(column => column.id).join(',');
    
    const csvRows = [headers];
    
    table.getFilteredRowModel().rows.forEach(row => {
      const rowData = visibleColumns.map(column => {
        const cell = row.getAllCells().find(cell => cell.column.id === column.id);
        if (!cell) return '';
        
        // Get the cell's displayed value
        let cellValue = cell.getValue() as string;
        
        // Handle different types of data
        if (cellValue === null || cellValue === undefined) {
          cellValue = '';
        } else if (typeof cellValue === 'object') {
          cellValue = JSON.stringify(cellValue);
        }
        
        // Escape commas and quotes
        cellValue = cellValue.toString().replace(/"/g, '""');
        if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
          cellValue = `"${cellValue}"`;
        }
        
        return cellValue;
      }).join(',');
      
      csvRows.push(rowData);
    });
    
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${exportFileName || 'export'}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (searchColumn) {
      table.getColumn(searchColumn)?.setFilterValue(value);
    } else {
      setGlobalFilter(value);
    }
  };

  // Add proper type imports
  const handleRowClick = (row: Row<TData>) => {
    onRowClick?.(row.original);
  };

  const handleColumnVisibilityChange = (column: Column<TData, unknown>) => {
    column.toggleVisibility();
  };

  const handleHeaderClick = (headerGroup: HeaderGroup<TData>) => {
    // ... existing code ...
  };

  const handleHeaderContextMenu = (header: Header<TData, unknown>) => {
    // ... existing code ...
  };

  const handleRowContextMenu = (row: Row<TData>) => {
    // ... existing code ...
  };

  const handleCellContextMenu = (cell: Cell<TData, unknown>) => {
    // ... existing code ...
  };

  const handleRowExpand = (row: Row<TData>) => {
    const rowId = row.id;
    const newExpanded = !expandedRows[rowId];
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: newExpanded
    }));
    onRowExpand?.(row.original, newExpanded);
  };

  // Render loading state
  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Table Header */}
        <div className="flex items-center justify-between gap-2 py-4">
          <Skeleton className="h-9 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
        
        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {rowSelection && <TableHead className="w-10"><Skeleton className="h-4 w-4" /></TableHead>}
                {columns.map((column, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: loadingRowCount }).map((_, index) => (
                <TableRow key={index}>
                  {rowSelection && <TableCell><Skeleton className="h-4 w-4" /></TableCell>}
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between py-4">
            <Skeleton className="h-8 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Table Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          {searchColumn && (
            <div className="w-full md:max-w-xs">
              <Input
                placeholder={searchPlaceholder}
                value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
          )}
          
          {/* Custom filters */}
          {filters && filters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <DataTableFilter
                  key={filter.columnId}
                  table={table}
                  filter={filter}
                />
              ))}
            </div>
          )}
          
          {/* Custom toolbar */}
          {toolbar}
        </div>
        
        <div className="flex gap-2">
          {exportData && (
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="ml-auto h-8 gap-1 px-2 lg:gap-2 lg:px-3"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">Export</span>
            </Button>
          )}
          
          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 px-2 lg:gap-2 lg:px-3">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline-block">Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(
                  (column: Column<TData, unknown>) =>
                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                )
                .map((column: Column<TData, unknown>) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
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
      </div>
      
      {/* Table */}
      <div className="rounded-md border">
        <Table className={dense ? "data-table-dense" : ""}>
          {!noHeader && (
            <TableHeader className={cn(
              hasStickyHeader && "sticky top-0 z-10 bg-card border-b",
              headerClassName
            )}>
              <TableRow className="hover:bg-transparent">
                {expandable && <TableHead className="w-[50px]" />}
                {rowSelection && (
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={table.getIsAllRowsSelected()}
                      onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
                  <React.Fragment key={headerGroup.id}>
                    {headerGroup.headers.map((header: Header<TData, unknown>) => (
                      <TableHead
                        key={header.id}
                        className={cn(
                          header.column.getCanSort() && "cursor-pointer select-none",
                          header.column.columnDef.meta?.className
                        )}
                        onClick={() => header.column.getCanSort() && header.column.toggleSorting()}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center gap-2">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="ml-2">
                                {header.column.getIsSorted() === "desc" ? (
                                  <ArrowDown className="h-4 w-4" />
                                ) : header.column.getIsSorted() === "asc" ? (
                                  <ArrowUp className="h-4 w-4" />
                                ) : (
                                  <ArrowUpDown className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {loading ? (
              Array.from({ length: loadingRowCount }).map((_, index) => (
                <TableRow key={index}>
                  {rowSelection && <TableCell><Skeleton className="h-4 w-4" /></TableCell>}
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row<TData>) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      showRowHover && "hover:bg-muted/50",
                      zebra && row.index % 2 === 0 && "bg-muted/50",
                      dense && "h-8",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {expandable && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowExpand(row);
                          }}
                          aria-label={expandedRows[row.id] ? "Collapse row" : "Expand row"}
                        >
                          {expandedRows[row.id] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    )}
                    {rowSelection && (
                      <TableCell>
                        <Checkbox
                          checked={row.getIsSelected()}
                          onCheckedChange={(value) => row.toggleSelected(!!value)}
                          aria-label="Select row"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          cell.column.columnDef.meta?.className,
                          dense && "py-1"
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandable && expandedRows[row.id] && expandedRow && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length + (rowSelection ? 2 : 1)}>
                        {expandedRow({ row: row.original })}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowSelection ? 1 : 0)}
                  className="h-24 text-center"
                >
                  {emptyStateMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col-reverse items-center justify-between gap-4 py-2 md:flex-row">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2">
              <p className="whitespace-nowrap text-sm text-muted-foreground">
                Rows per page
              </p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-16">
                  <SelectValue placeholder={String(table.getState().pagination.pageSize)} />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((option) => (
                    <SelectItem key={option} value={`${option}`}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface DataTableFilterComponentProps<TData> {
  table: TableInstance<TData>;
  filter: DataTableFilterProps<TData>;
}

export function DataTableFilter<TData>({
  table,
  filter,
}: DataTableFilterComponentProps<TData>) {
  const { columnId, title, options } = filter;
  const column = table.getColumn(columnId) as Column<TData, unknown>;
  const filterValue = column?.getFilterValue() as string | undefined;

  const handleFilterChange = (option: DataTableFilterOption) => {
    column?.setFilterValue(option.value);
  };
  
  const clearFilter = () => {
    column?.setFilterValue(undefined);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1 px-2 lg:gap-2 lg:px-3",
            filterValue && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <Filter className="h-3.5 w-3.5" />
          <span className="truncate">{title}</span>
          {filterValue && (
            <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal lg:ml-2">
              {filterValue}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="flex items-center justify-between p-4">
          <p className="text-sm font-medium">{title}</p>
          {filterValue && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs" onClick={clearFilter}>
              Clear
            </Button>
          )}
        </div>
        <div className="grid gap-1 p-2">
          {options.map((option) => {
            const Icon = option.icon;
            const isActive = filterValue === option.value;
            
            return (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                className={cn(
                  "justify-start",
                  isActive && "bg-primary/5"
                )}
                onClick={() => handleFilterChange(option)}
              >
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{option.label}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}