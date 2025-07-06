import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '../data-table';
import { ColumnDef } from '@tanstack/react-table';
import { generateTestData } from '@/test-utils';
import { Badge } from '../badge';
import { Button } from '../button';

interface TestData {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  score: number;
}

const StatusBadge = ({ status }: { status: TestData['status'] }) => {
  const variants = {
    active: 'default',
    inactive: 'destructive',
    pending: 'secondary',
  } as const;

  return (
    <Badge variant={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const ScoreCell = ({ score }: { score: number }) => {
  const color = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
  return <span className={color}>{score}%</span>;
};

const ActionCell = ({ row }: { row: TestData }) => (
  <div className="flex gap-2">
    <Button variant="outline" size="sm">
      Edit
    </Button>
    <Button variant="outline" size="sm">
      Delete
    </Button>
  </div>
);

const columns: ColumnDef<TestData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => <ScoreCell score={row.original.score} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionCell row={row.original} />,
  },
];

const testData = generateTestData<TestData>(
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    score: 85,
  },
  10
);

describe('DataTable Custom Cell Rendering', () => {
  it('renders custom status badges with correct variants', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Check if status badges are rendered with correct variants
    const activeBadge = screen.getByText('Active');
    expect(activeBadge).toHaveClass('bg-default');
    
    // Find and check other status badges
    const inactiveBadge = screen.getByText('Inactive');
    expect(inactiveBadge).toHaveClass('bg-destructive');
    
    const pendingBadge = screen.getByText('Pending');
    expect(pendingBadge).toHaveClass('bg-secondary');
  });

  it('renders score cells with correct color classes', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Check if score cells are rendered with correct colors
    const highScore = screen.getByText('85%');
    expect(highScore).toHaveClass('text-green-600');
    
    const mediumScore = screen.getByText('65%');
    expect(mediumScore).toHaveClass('text-yellow-600');
    
    const lowScore = screen.getByText('45%');
    expect(lowScore).toHaveClass('text-red-600');
  });

  it('renders action buttons in action cells', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Check if action buttons are rendered
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    
    expect(editButtons).toHaveLength(testData.length);
    expect(deleteButtons).toHaveLength(testData.length);
    
    // Check button variants
    editButtons.forEach(button => {
      expect(button).toHaveClass('variant-outline');
    });
    
    deleteButtons.forEach(button => {
      expect(button).toHaveClass('variant-outline');
    });
  });

  it('maintains custom cell rendering after sorting', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Sort by status
    const statusHeader = screen.getByRole('button', { name: /sort status/i });
    fireEvent.click(statusHeader);
    
    // Verify custom cell rendering is maintained
    expect(screen.getByText('Active')).toHaveClass('bg-default');
    expect(screen.getByText('85%')).toHaveClass('text-green-600');
    expect(screen.getAllByRole('button', { name: /edit/i })).toHaveLength(testData.length);
  });

  it('maintains custom cell rendering after filtering', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        searchColumn="name"
      />
    );
    
    // Filter data
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Verify custom cell rendering is maintained
    expect(screen.getByText('Active')).toHaveClass('bg-default');
    expect(screen.getByText('85%')).toHaveClass('text-green-600');
    expect(screen.getAllByRole('button', { name: /edit/i })).toHaveLength(1);
  });

  it('maintains custom cell rendering after pagination', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        pagination
        pageSize={5}
      />
    );
    
    // Go to next page
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Verify custom cell rendering is maintained
    expect(screen.getByText('Active')).toHaveClass('bg-default');
    expect(screen.getByText('85%')).toHaveClass('text-green-600');
    expect(screen.getAllByRole('button', { name: /edit/i })).toHaveLength(5);
  });

  it('handles custom cell rendering with row selection', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection
      />
    );
    
    // Verify custom cell rendering works with row selection
    expect(screen.getByText('Active')).toHaveClass('bg-default');
    expect(screen.getByText('85%')).toHaveClass('text-green-600');
    expect(screen.getAllByRole('button', { name: /edit/i })).toHaveLength(testData.length);
    
    // Check if checkboxes are rendered
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(testData.length + 1); // +1 for header checkbox
  });
}); 