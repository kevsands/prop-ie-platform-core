import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '../data-table';
import { ColumnDef } from '@tanstack/react-table';
import { generateTestData } from '@/test-utils';
import { Filter } from 'lucide-react';

interface TestData {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: 'admin' | 'user' | 'guest';
}

const columns: ColumnDef<TestData>[] = [
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
  },
  {
    accessorKey: 'role',
    header: 'Role',
    accessorFn: (row) => row.role,
  },
];

const testData = generateTestData<TestData>(
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    role: 'admin',
  },
  10
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

const roleFilter = {
  columnId: 'role',
  title: 'Role',
  options: [
    { id: 'admin', label: 'Admin', value: 'admin', icon: Filter },
    { id: 'user', label: 'User', value: 'user', icon: Filter },
    { id: 'guest', label: 'Guest', value: 'guest', icon: Filter },
  ],
};

describe('DataTable Filtering', () => {
  it('renders search input when searchColumn is provided', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        searchColumn="name"
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();
  });

  it('filters data based on search input', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        searchColumn="name"
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Verify filtered results
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('renders column filters when filters prop is provided', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        filters={[statusFilter, roleFilter]}
      />
    );
    
    expect(screen.getByRole('button', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /role/i })).toBeInTheDocument();
  });

  it('filters data based on column filter selection', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        filters={[statusFilter]}
      />
    );
    
    // Open status filter
    const statusButton = screen.getByRole('button', { name: /status/i });
    fireEvent.click(statusButton);
    
    // Select active status
    const activeOption = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeOption);
    
    // Verify filtered results
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.queryByText('Inactive')).not.toBeInTheDocument();
  });

  it('clears column filter when clear button is clicked', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        filters={[statusFilter]}
      />
    );
    
    // Open status filter
    const statusButton = screen.getByRole('button', { name: /status/i });
    fireEvent.click(statusButton);
    
    // Select active status
    const activeOption = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeOption);
    
    // Clear filter
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    
    // Verify all statuses are shown
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('combines multiple column filters', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        filters={[statusFilter, roleFilter]}
      />
    );
    
    // Apply status filter
    const statusButton = screen.getByRole('button', { name: /status/i });
    fireEvent.click(statusButton);
    const activeOption = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeOption);
    
    // Apply role filter
    const roleButton = screen.getByRole('button', { name: /role/i });
    fireEvent.click(roleButton);
    const adminOption = screen.getByRole('button', { name: /admin/i });
    fireEvent.click(adminOption);
    
    // Verify filtered results
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('combines search and column filters', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        searchColumn="name"
        filters={[statusFilter]}
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
    
    // Verify filtered results
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('calls onFilterChange callback when filters change', () => {
    const onFilterChange = jest.fn();
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        filters={[statusFilter]}
        onFilterChange={onFilterChange}
      />
    );
    
    // Apply status filter
    const statusButton = screen.getByRole('button', { name: /status/i });
    fireEvent.click(statusButton);
    const activeOption = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeOption);
    
    expect(onFilterChange).toHaveBeenCalled();
  });

  it('maintains filter state after data updates', () => {
    const { rerender } = render(
      <DataTable
        columns={columns}
        data={testData}
        filters={[statusFilter]}
      />
    );
    
    // Apply status filter
    const statusButton = screen.getByRole('button', { name: /status/i });
    fireEvent.click(statusButton);
    const activeOption = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeOption);
    
    // Update data
    const newData = [...testData, {
      id: '11',
      name: 'New User',
      email: 'new@example.com',
      status: 'inactive',
      role: 'user',
    }];
    
    rerender(
      <DataTable
        columns={columns}
        data={newData}
        filters={[statusFilter]}
      />
    );
    
    // Verify filter is still applied
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.queryByText('Inactive')).not.toBeInTheDocument();
  });

  it('shows empty state when no results match filters', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        filters={[statusFilter]}
      />
    );
    
    // Apply non-matching filter
    const statusButton = screen.getByRole('button', { name: /status/i });
    fireEvent.click(statusButton);
    const pendingOption = screen.getByRole('button', { name: /pending/i });
    fireEvent.click(pendingOption);
    
    // Verify empty state
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
}); 