'use client';

import { useState } from 'react';
import { useDevelopments, useDeleteDevelopment } from '../../hooks/api-hooks';
import { DevelopmentStatus } from '../../types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { Input } from '../ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DevelopmentList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<DevelopmentStatus | ''>('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch developments with React Query
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useDevelopments(
    { 
      search: search || undefined, 
      status: status || undefined, 
      page, 
      limit 
    },
    {
      // Keep previous data while loading new data (prevents UI jumps)
      keepPreviousData: true,
    }
  );

  // Delete development mutation
  const { mutate: deleteDevelopment, isPending: isDeleting } = useDeleteDevelopment();

  // Handle development deletion
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this development?')) {
      deleteDevelopment(id, {
        onSuccess: () => {
          toast.success('Development deleted successfully');
        },
        onError: (error) => {
          toast.error(`Failed to delete development: ${error.message}`);
        },
      });
    }
  };

  // Status badge color mapping
  const getStatusColor = (status: DevelopmentStatus) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-100 text-blue-800';
      case 'CONSTRUCTION':
        return 'bg-amber-100 text-amber-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'SOLD_OUT':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Developments</h1>
        <Button onClick={() => router.push('/admin/developments/new')}>
          Add New Development
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <Input
            placeholder="Search developments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-1/2">
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as DevelopmentStatus | '')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="PLANNING">Planning</SelectItem>
              <SelectItem value="CONSTRUCTION">Construction</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="SOLD_OUT">Sold Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <p>Error loading developments: {error.message}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && !data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-20 bg-gray-100 rounded-t-lg" />
              <CardContent className="pt-4 space-y-4">
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
                <div className="h-12 bg-gray-100 rounded" />
              </CardContent>
              <CardFooter className="h-12 bg-gray-50 rounded-b-lg" />
            </Card>
          ))}
        </div>
      )}

      {/* Results */}
      {data && data.data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No developments found</p>
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((development) => (
              <Card key={development.id} className="overflow-hidden">
                <div className="relative h-40 bg-gray-100">
                  {development.images && development.images.length > 0 ? (
                    <img
                      src={development.images[0]}
                      alt={development.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No image available
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(development.status)}>
                      {development.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{development.name}</CardTitle>
                  <CardDescription>
                    {development.location.city}, {development.location.county}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      {development.description.length > 120
                        ? `${development.description.substring(0, 120)}...`
                        : development.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Total Units</p>
                        <p>{development.totalUnits}</p>
                      </div>
                      <div>
                        <p className="font-medium">Available</p>
                        <p>{development.availableUnits}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link href={`/admin/developments/${development.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(development.id)}
                    disabled={isDeleting}
                    className="w-full"
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data.pagination && data.pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {data.pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, data.pagination.pages))}
                disabled={page === data.pagination.pages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}