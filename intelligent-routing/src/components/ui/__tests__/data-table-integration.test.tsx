import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { DataTable } from '../data-table';
import { ColumnDef } from '@tanstack/react-table';
import { generateTestData } from '@/test-utils';
import { Filter, Download } from 'lucide-react';
import { Badge } from '../badge';

interface TestData {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: 'admin' | 'user' | 'guest';
  score: number;
  details?: {
    department: string;
    joinDate: string;
  };
}

const StatusBadge = ({ status }: { status: TestData['status'] }) => (
  <Badge variant={status === 'active' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'}>
    {status}
  </Badge>
);

const columns: ColumnDef<TestData, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    accessorFn: (row) => row.name,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    accessorFn: (row) => row.email,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    accessorFn: (row) => row.status,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    accessorFn: (row) => row.role,
  },
  {
    accessorKey: 'score',
    header: 'Score',
    accessorFn: (row) => row.score,
  },
];

const testData = generateTestData<TestData>(
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    role: 'admin',
    score: 85,
    details: {
      department: 'Engineering',
      joinDate: '2024-01-01',
    },
  },
  25
);

const statusFilter = {
  columnId: 'status',
  title: 'Status',
  options: [
    { id: 'active', label: 'Active', value: 'active', icon: Filter },
    { id: 'inactive', label: 'Inactive', value: 'inactive', icon: Filter },
    { id: 'pending', label: 'Pending', value: 'pending', icon: Filter },
  ],
};

const ExpandedRow = ({ row }: { row: TestData }) => (
  <div data-testid="expanded-row">
    <div>Department: {row.details?.department}</div>
    <div>Join Date: {row.details?.joinDate}</div>
  </div>
);

describe('DataTable Integration', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL for export tests
    window.URL.createObjectURL = jest.fn();
    window.URL.revokeObjectURL = jest.fn();
  });

  it('handles complex filtering, sorting, and pagination together', () => {
    render(
      <DataTable<TestData, unknown>
        columns={columns}
        data={testData}
        searchColumn="name"
        filters={[statusFilter]}
        pagination
        pageSize={10}
      />
    );
    
    // Apply search filter
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Apply status filter
    const statusButton = screen.getByRole('button', { name: /status/i });
    fireEvent.click(statusButton);
    const activeOption = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeOption);
    
    // Sort by score
    const scoreHeader = screen.getByRole('button', { name: /sort score/i });
    fireEvent.click(scoreHeader);
    
    // Verify filtered, sorted results
    const rows = screen.getAllByRole('row').slice(1); // Skip header row
    const firstRow = within(rows[0]);
    expect(firstRow.getByText('John Doe')).toBeInTheDocument();
    expect(firstRow.getByText('85')).toBeInTheDocument();
    
    // Navigate to next page
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Verify pagination state is maintained with filters
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
  });

  it('maintains state across feature interactions with row selection', () => {
    const onSelectedRowsChange = jest.fn();
    
    render(
      <DataTable<TestData, unknown>
        columns={columns}
        data={testData}
        rowSelection
        searchColumn="name"
        filters={[statusFilter]}
        pagination
        pageSize={10}
        onSelectedRowsChange={onSelectedRowsChange}
      />
    );
    
    // Select first row
    const firstCheckbox = screen.getAllByRole('checkbox')[1]; // Skip header checkbox
    fireEvent.click(firstCheckbox);
    
    // Apply filter
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Sort by score
    const scoreHeader = screen.getByRole('button', { name: /sort score/i });
    fireEvent.click(scoreHeader);
    
    // Verify selection is maintained
    expect(firstCheckbox).toBeChecked();
    expect(onSelectedRowsChange).toHaveBeenCalled();
  });

  it('handles complex interactions with row expansion', () => {
    render(
      <DataTable<TestData, unknown>
        columns={columns}
        data={testData}
        expandable
        expandedRow={ExpandedRow}
        searchColumn="name"
        filters={[statusFilter]}
        pagination
        pageSize={10}
      />
    );
    
    // Expand first row
    const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0];
    fireEvent.click(expandButton);
    
    // Apply filter
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Sort by score
    const scoreHeader = screen.getByRole('button', { name: /sort score/i });
    fireEvent.click(scoreHeader);
    
    // Verify expanded state is maintained
    expect(screen.getByTestId('expanded-row')).toBeInTheDocument();
    expect(screen.getByText('Department: Engineering')).toBeInTheDocument();
  });

  it('combines export with complex filtering and selection', () => {
    render(
      <DataTable<TestData, unknown>
        columns={columns}
        data={testData}
        exportData
        rowSelection
        searchColumn="name"
        filters={[statusFilter]}
        pagination
        pageSize={10}
      />
    );
    
    // Select some rows
    const firstCheckbox = screen.getAllByRole('checkbox')[1];
    const secondCheckbox = screen.getAllByRole('checkbox')[2];
    fireEvent.click(firstCheckbox);
    fireEvent.click(secondCheckbox);
    
    // Apply filters
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    const statusButton = screen.getByRole('button', { name: /status/i });
    fireEvent.click(statusButton);
    const activeOption = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeOption);
    
    // Export data
    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);
    
    // Verify export was called with correct data
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    const blob = (window.URL.createObjectURL as jest.Mock).mock.calls[0][0];
    expect(blob instanceof Blob).toBe(true);
  });

  it('handles column visibility with complex interactions', () => {
    render(
      <DataTable<TestData, unknown>
        columns={columns}
        data={testData}
        searchColumn="name"
        filters={[statusFilter]}
        pagination
        pageSize={10}
      />
    );
    
    // Hide email column
    const columnButton = screen.getByRole('button', { name: /columns/i });
    fireEvent.click(columnButton);
    
    const emailCheckbox = screen.getByRole('menuitemcheckbox', { name: /email/i });
    fireEvent.click(emailCheckbox);
    
    // Apply filter
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Sort by score
    const scoreHeader = screen.getByRole('button', { name: /sort score/i });
    fireEvent.click(scoreHeader);
    
    // Verify column visibility is maintained
    expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('maintains state across all features during data updates', () => {
    const { rerender } = render(
      <DataTable<TestData, unknown>
        columns={columns}
        data={testData}
        expandable
        expandedRow={ExpandedRow}
        rowSelection
        searchColumn="name"
        filters={[statusFilter]}
        pagination
        pageSize={10}
      />
    );
    
    // Set up complex state
    const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0];
    fireEvent.click(expandButton);
    
    const firstCheckbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(firstCheckbox);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    const statusButton = screen.getByRole('button', { name: /status/i });
    fireEvent.click(statusButton);
    const activeOption = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeOption);
    
    // Update data
    const newData = [...testData, {
      id: '26',
      name: 'New User',
      email: 'new@example.com',
      status: 'active' as const,
      role: 'user' as const,
      score: 90,
      details: {
        department: 'Design',
        joinDate: '2024-02-01',
      },
    }];
    
    rerender(
      <DataTable<TestData, unknown>
        columns={columns}
        data={newData}
        expandable
        expandedRow={ExpandedRow}
        rowSelection
        searchColumn="name"
        filters={[statusFilter]}
        pagination
        pageSize={10}
      />
    );
    
    // Verify all states are maintained
    expect(screen.getByTestId('expanded-row')).toBeInTheDocument();
    expect(firstCheckbox).toBeChecked();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('New User')).not.toBeInTheDocument(); // Filtered out
  });
}); 