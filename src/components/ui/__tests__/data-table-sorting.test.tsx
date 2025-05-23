import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '../data-table';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { generateTestData } from '@/test-utils';

interface TestData {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
}

const columns: ColumnDef<TestData>[] = [
  {
    accessorKey: 'name',
    header: 'Name'},
  {
    accessorKey: 'email',
    header: 'Email'},
  {
    accessorKey: 'status',
    header: 'Status'},
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => row.original.createdAt.toLocaleDateString()}];

const testData = generateTestData<TestData>(
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
    createdAt: new Date('2024-01-01')},
  10
);

describe('DataTable Sorting', () => {
  it('renders sortable columns with sort indicators', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Check if sortable columns have sort indicators
    const sortableHeaders = screen.getAllByRole('button', { name: /sort/i });
    expect(sortableHeaders).toHaveLength(4); // All columns are sortable
  });

  it('handles ascending sort', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Click name column header to sort ascending
    const nameHeader = screen.getByRole('button', { name: /sort name/i });
    fireEvent.click(nameHeader);
    
    // Verify sort indicator shows ascending
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    
    // Verify data is sorted
    const rows = screen.getAllByRole('row').slice(1); // Skip header row
    const firstRowName = rows[0].querySelector('td')?.textContent || '';
    const lastRowName = rows[rows.length - 1].querySelector('td')?.textContent || '';
    expect(firstRowName.localeCompare(lastRowName)).toBeLessThan(0);
  });

  it('handles descending sort', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Click name column header twice to sort descending
    const nameHeader = screen.getByRole('button', { name: /sort name/i });
    fireEvent.click(nameHeader);
    fireEvent.click(nameHeader);
    
    // Verify sort indicator shows descending
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    
    // Verify data is sorted
    const rows = screen.getAllByRole('row').slice(1);
    const firstRowName = rows[0].querySelector('td')?.textContent || '';
    const lastRowName = rows[rows.length - 1].querySelector('td')?.textContent || '';
    expect(firstRowName.localeCompare(lastRowName)).toBeGreaterThan(0);
  });

  it('handles multi-column sort', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Sort by name first
    const nameHeader = screen.getByRole('button', { name: /sort name/i });
    fireEvent.click(nameHeader);
    
    // Then sort by email while holding shift
    const emailHeader = screen.getByRole('button', { name: /sort email/i });
    fireEvent.click(emailHeader, { shiftKey: true });
    
    // Verify both columns show sort indicators
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    expect(emailHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('calls onSortingChange when sort changes', () => {
    const onSortingChange = jest.fn();
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        onSortingChange={onSortingChange}
      />
    );
    
    // Sort by name
    const nameHeader = screen.getByRole('button', { name: /sort name/i });
    fireEvent.click(nameHeader);
    
    expect(onSortingChange).toHaveBeenCalledWith([
      { id: 'name', desc: false }
    ]);
  });

  it('maintains sort state across page changes', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        pagination
        pageSize={5}
      />
    );
    
    // Sort by name
    const nameHeader = screen.getByRole('button', { name: /sort name/i });
    fireEvent.click(nameHeader);
    
    // Go to next page
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Verify sort indicator is still present
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('handles custom sort functions', () => {
    const customSortFn = (rowA: any, rowB: any) => {
      return rowA.original.status.localeCompare(rowB.original.status);
    };
    
    const customColumns: ColumnDef<TestData>[] = [
      ...columns,
      {
        accessorKey: 'status',
        header: 'Status',
        sortingFn: customSortFn}];
    
    render(
      <DataTable
        columns={customColumns}
        data={testData}
      />
    );
    
    // Sort by status
    const statusHeader = screen.getByRole('button', { name: /sort status/i });
    fireEvent.click(statusHeader);
    
    // Verify data is sorted using custom function
    const rows = screen.getAllByRole('row').slice(1);
    const statuses = rows.map(row => row.querySelectorAll('td')[3].textContent || '');
    expect(statuses).toEqual([...statuses].sort());
  });
}); 