'use client';

import React from 'react';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle} from '@/components/ui/dialog';
import {
  ChevronDown,
  Download,
  FileUp,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  BarChart3,
  TrendingUp,
  Home} from 'lucide-react';
import { Property } from '@/types/models/property';
import { PropertyStatus, PropertyType } from '@/types/enums';
import { formatPrice, formatDate } from '@/utils/format';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyWithAnalytics extends Property {
  views: number;
  inquiries: number;
  reservations: number;
}

interface PropertiesAnalytics {
  totalProperties: number;
  availableProperties: number;
  totalValue: number;
  averagePrice: number;
  occupancyRate: number;
  recentActivity: {
    views: number;
    inquiries: number;
    reservations: number;
  };
}

export default function PropertyAdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [sortingsetSorting] = useState<SortingState>([]);
  const [columnFilterssetColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibilitysetColumnVisibility] = useState<VisibilityState>({});
  const [rowSelectionsetRowSelection] = useState({});
  const [globalFiltersetGlobalFilter] = useState('');
  const [showDeleteDialogsetShowDeleteDialog] = useState(false);
  const [selectedPropertiessetSelectedProperties] = useState<string[]>([]);

  // Fetch properties
  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties?pageSize=1000');
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data = await response.json();

      // Add mock analytics data
      return {
        properties: data.properties.map((p: Property) => ({
          ...p,
          views: Math.floor(Math.random() * 1000),
          inquiries: Math.floor(Math.random() * 50),
          reservations: Math.floor(Math.random() * 10)
        })),
        total: data.total
      };
    }
  });

  // Fetch analytics
  const { data: analytics } = useQuery<PropertiesAnalytics>({
    queryKey: ['properties-analytics'],
    queryFn: async () => {
      // Mock analytics data - replace with actual API call
      const properties = propertiesData?.properties || [];
      const available = properties.filter((p: Property) => p.status === PropertyStatus.Available);
      const totalValue = properties.reduce((sum: number, p: Property) => sum + (p.price || 0), 0);

      return {
        totalProperties: properties.length,
        availableProperties: available.length,
        totalValue,
        averagePrice: properties.length> 0 ? totalValue / properties.length : 0,
        occupancyRate: properties.length> 0 
          ? ((properties.length - available.length) / properties.length) * 100 
          : 0,
        recentActivity: {
          views: properties.reduce((sum: number, p: any) => sum + (p.views || 0), 0),
          inquiries: properties.reduce((sum: number, p: any) => sum + (p.inquiries || 0), 0),
          reservations: properties.reduce((sum: number, p: any) => sum + (p.reservations || 0), 0)
        }
      };
    },
    enabled: !!propertiesData
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (propertyIds: string[]) => {
      const results = await Promise.all(
        propertyIds.map(id =>
          fetch(`/api/properties/${id}`, { method: 'DELETE' })
            .then(res => res.ok)
        )
      );
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast({
        title: 'Properties deleted',
        description: `${selectedProperties.length} properties have been deleted.`
      });
      setShowDeleteDialog(false);
      setSelectedProperties([]);
      setRowSelection({});
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete properties. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Table columns
  const columns: ColumnDef<PropertyWithAnalytics>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false},
    {
      accessorKey: 'name',
      header: 'Property Name',
      cell: ({ row }) => {
        const property = row.original;
        return (
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-gray-400" />
            <div>
              <div className="font-medium">{property.name}</div>
              <div className="text-sm text-gray-600">{property.unitNumber}</div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'development.name',
      header: 'Development',
      cell: ({ row }) => row.original.development?.name || 'N/A'},
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.type.replace(/_/g, ' ')}
        </Badge>
      )},
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusColors: Record<PropertyStatus, string> = {
          [PropertyStatus.Available]: 'bg-green-100 text-green-800',
          [PropertyStatus.Reserved]: 'bg-orange-100 text-orange-800',
          [PropertyStatus.Sold]: 'bg-red-100 text-red-800',
          [PropertyStatus.UnderOffer]: 'bg-purple-100 text-purple-800',
          [PropertyStatus.ComingSoon]: 'bg-blue-100 text-blue-800',
          [PropertyStatus.UnderConstruction]: 'bg-yellow-100 text-yellow-800',
          [PropertyStatus.OffMarket]: 'bg-gray-100 text-gray-800',
          [PropertyStatus.Selling]: 'bg-emerald-100 text-emerald-800',
          [PropertyStatus.SaleAgreed]: 'bg-indigo-100 text-indigo-800',
          [PropertyStatus.ToLet]: 'bg-teal-100 text-teal-800'};

        return (
          <Badge className={statusColors[status as PropertyStatus] || ''}>
            {status.replace(/_/g, ' ')}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => formatPrice(row.original.price)},
    {
      accessorKey: 'bedrooms',
      header: 'Beds'},
    {
      accessorKey: 'bathrooms',
      header: 'Baths'},
    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ row }) => `${row.original.size} sq ft`},
    {
      accessorKey: 'views',
      header: 'Views',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-gray-400" />
          <span>{row.original.views}</span>
        </div>
      )},
    {
      accessorKey: 'inquiries',
      header: 'Inquiries'},
    {
      accessorKey: 'createdAt',
      header: 'Listed',
      cell: ({ row }) => formatDate(row.original.createdAt)},
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const property = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push(`/properties/${property.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/admin/properties/${property.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/admin/properties/${property.id}/analytics`)}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedProperties([property.id]);
                  setShowDeleteDialog(true);
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }];

  const table = useReactTable({
    data: propertiesData?.properties || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter
  });

  // Handle bulk actions
  const handleBulkDelete = () => {
    const selected = table.getFilteredSelectedRowModel().rows.map(
      row => row.original.id
    );
    setSelectedProperties(selected);
    setShowDeleteDialog(true);
  };

  const handleExport = () => {
    // Implement CSV export
    const properties = table.getFilteredRowModel().rows.map(row => row.original);
    const csv = [
      ['Name', 'Development', 'Type', 'Status', 'Price', 'Bedrooms', 'Bathrooms', 'Size'],
      ...properties.map(p => [
        p.name,
        p.development?.name || '',
        p.type,
        p.status,
        p.price,
        p.bedrooms,
        p.bathrooms,
        p.size])].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `properties-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_i: any) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Property Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all properties across your developments
          </p>
        </div>
        <Button onClick={() => router.push('/admin/properties/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Properties
              </CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalProperties}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.availableProperties} available
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(analytics.totalValue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: {formatPrice(analytics.averagePrice)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Occupancy Rate
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.occupancyRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Properties sold or reserved
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Activity
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.recentActivity.views}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.recentActivity.inquiries} inquiries, {analytics.recentActivity.reservations} reservations
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={globalFilter ?? ''}
                onChange={(event: any) => setGlobalFilter(event.target.value)}
                className="pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column: any) => column.getCanHide())
                  .map((column: any) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value: any) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline">
              <FileUp className="mr-2 h-4 w-4" />
              Import
            </Button>
          </div>

          {/* Bulk Actions */}
          {table.getFilteredSelectedRowModel().rows.length> 0 && (
            <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">
                {table.getFilteredSelectedRowModel().rows.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup: any) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header: any) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row: any) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell: any) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete {selectedProperties.length} propert
              {selectedProperties.length === 1 ? 'y' : 'ies'}. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(selectedProperties)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}