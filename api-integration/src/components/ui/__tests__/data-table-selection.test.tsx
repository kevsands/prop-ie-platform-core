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
  10
);

describe('DataTable Row Selection', () => {
  it('renders selection checkboxes when rowSelection is enabled', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection
      />
    );
    
    // Check if header checkbox is rendered
    expect(screen.getByRole('checkbox', { name: /select all/i })).toBeInTheDocument();
    
    // Check if row checkboxes are rendered
    const rowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
    expect(rowCheckboxes).toHaveLength(testData.length);
  });

  it('handles single row selection', () => {
    const onSelectedRowsChange = jest.fn();
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection
        onSelectedRowsChange={onSelectedRowsChange}
      />
    );
    
    // Select first row
    const firstRowCheckbox = screen.getAllByRole('checkbox', { name: /select row/i })[0];
    fireEvent.click(firstRowCheckbox);
    
    expect(onSelectedRowsChange).toHaveBeenCalledWith([testData[0]]);
    expect(firstRowCheckbox).toBeChecked();
  });

  it('handles select all functionality', () => {
    const onSelectedRowsChange = jest.fn();
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection
        onSelectedRowsChange={onSelectedRowsChange}
      />
    );
    
    // Select all rows
    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    fireEvent.click(selectAllCheckbox);
    
    expect(onSelectedRowsChange).toHaveBeenCalledWith(testData);
    
    // Verify all row checkboxes are checked
    const rowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
    rowCheckboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });
  });

  it('handles deselect all functionality', () => {
    const onSelectedRowsChange = jest.fn();
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection
        onSelectedRowsChange={onSelectedRowsChange}
      />
    );
    
    // Select all rows first
    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    fireEvent.click(selectAllCheckbox);
    
    // Then deselect all
    fireEvent.click(selectAllCheckbox);
    
    expect(onSelectedRowsChange).toHaveBeenCalledWith([]);
    
    // Verify all row checkboxes are unchecked
    const rowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
    rowCheckboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it('maintains selection state across page changes', () => {
    const onSelectedRowsChange = jest.fn();
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection
        pagination
        pageSize={5}
        onSelectedRowsChange={onSelectedRowsChange}
      />
    );
    
    // Select first row on first page
    const firstRowCheckbox = screen.getAllByRole('checkbox', { name: /select row/i })[0];
    fireEvent.click(firstRowCheckbox);
    
    // Go to next page
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Go back to first page
    const previousButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(previousButton);
    
    // Verify selection is maintained
    expect(firstRowCheckbox).toBeChecked();
  });

  it('handles selection with filtered data', () => {
    const onSelectedRowsChange = jest.fn();
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection
        searchColumn="name"
        onSelectedRowsChange={onSelectedRowsChange}
      />
    );
    
    // Filter data
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Select filtered row
    const filteredRowCheckbox = screen.getAllByRole('checkbox', { name: /select row/i })[0];
    fireEvent.click(filteredRowCheckbox);
    
    // Clear filter
    fireEvent.change(searchInput, { target: { value: '' } });
    
    // Verify selection is maintained
    expect(filteredRowCheckbox).toBeChecked();
  });

  it('handles selection with sorted data', () => {
    const onSelectedRowsChange = jest.fn();
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection
        onSelectedRowsChange={onSelectedRowsChange}
      />
    );
    
    // Select first row
    const firstRowCheckbox = screen.getAllByRole('checkbox', { name: /select row/i })[0];
    fireEvent.click(firstRowCheckbox);
    
    // Sort by name
    const nameHeader = screen.getByRole('button', { name: /sort name/i });
    fireEvent.click(nameHeader);
    
    // Verify selection is maintained
    expect(firstRowCheckbox).toBeChecked();
  });

  it('handles selection with custom row click handler', () => {
    const onRowClick = jest.fn();
    const onSelectedRowsChange = jest.fn();
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection
        onRowClick={onRowClick}
        onSelectedRowsChange={onSelectedRowsChange}
      />
    );
    
    // Click row
    const row = screen.getByText('John Doe').closest('tr');
    fireEvent.click(row!);
    
    // Click checkbox
    const checkbox = screen.getAllByRole('checkbox', { name: /select row/i })[0];
    fireEvent.click(checkbox);
    
    // Verify both handlers are called
    expect(onRowClick).toHaveBeenCalledWith(testData[0]);
    expect(onSelectedRowsChange).toHaveBeenCalledWith([testData[0]]);
  });
}); 