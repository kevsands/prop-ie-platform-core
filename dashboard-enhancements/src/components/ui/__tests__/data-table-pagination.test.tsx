import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '../data-table';
import { ColumnDef } from '@tanstack/react-table';
import { generateTestData } from '@/test-utils';

interface TestData {
  id: string;
  name: string;
  email: string;
  status: string;
}

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
  },
];

const testData = generateTestData<TestData>(
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
  },
  25 // Generate 25 rows to test pagination
);

describe('DataTable Pagination', () => {
  it('renders pagination controls when pagination is enabled', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        pagination
        pageSize={10}
      />
    );
    
    // Check if pagination controls are rendered
    expect(screen.getByRole('button', { name: /first/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /last/i })).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('navigates between pages correctly', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        pagination
        pageSize={10}
      />
    );
    
    // Check initial page
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    
    // Go to next page
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    
    // Go to previous page
    const previousButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(previousButton);
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    
    // Go to last page
    const lastButton = screen.getByRole('button', { name: /last/i });
    fireEvent.click(lastButton);
    expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
    
    // Go to first page
    const firstButton = screen.getByRole('button', { name: /first/i });
    fireEvent.click(firstButton);
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('disables navigation buttons appropriately', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        pagination
        pageSize={10}
      />
    );
    
    // On first page, previous and first buttons should be disabled
    expect(screen.getByRole('button', { name: /first/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    
    // Go to last page
    const lastButton = screen.getByRole('button', { name: /last/i });
    fireEvent.click(lastButton);
    
    // On last page, next and last buttons should be disabled
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /last/i })).toBeDisabled();
  });

  it('changes page size correctly', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        pagination
        pageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
      />
    );
    
    // Open page size dropdown
    const pageSizeSelect = screen.getByRole('combobox');
    fireEvent.click(pageSizeSelect);
    
    // Select new page size
    const option25 = screen.getByRole('option', { name: '25' });
    fireEvent.click(option25);
    
    // Verify page count updated
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });

  it('maintains current page when changing page size', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        pagination
        pageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
      />
    );
    
    // Go to second page
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Change page size
    const pageSizeSelect = screen.getByRole('combobox');
    fireEvent.click(pageSizeSelect);
    const option25 = screen.getByRole('option', { name: '25' });
    fireEvent.click(option25);
    
    // Verify we're still on the second page
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
  });

  it('calls onPaginationChange callback when page or page size changes', () => {
    const onPaginationChange = jest.fn();
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        pagination
        pageSize={10}
        onPaginationChange={onPaginationChange}
      />
    );
    
    // Change page
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(onPaginationChange).toHaveBeenCalledWith(2, 10);
    
    // Change page size
    const pageSizeSelect = screen.getByRole('combobox');
    fireEvent.click(pageSizeSelect);
    const option25 = screen.getByRole('option', { name: '25' });
    fireEvent.click(option25);
    expect(onPaginationChange).toHaveBeenCalledWith(1, 25);
  });

  it('maintains pagination state after data updates', () => {
    const { rerender } = render(
      <DataTable
        columns={columns}
        data={testData}
        pagination
        pageSize={10}
      />
    );
    
    // Go to second page
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Update data
    const newData = [...testData, {
      id: '26',
      name: 'New User',
      email: 'new@example.com',
      status: 'Active',
    }];
    
    rerender(
      <DataTable
        columns={columns}
        data={newData}
        pagination
        pageSize={10}
      />
    );
    
    // Verify we're still on the second page
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
  });

  it('resets to first page when filters are applied', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        pagination
        pageSize={10}
        searchColumn="name"
      />
    );
    
    // Go to second page
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Apply filter
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Verify we're back on the first page
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });
}); 