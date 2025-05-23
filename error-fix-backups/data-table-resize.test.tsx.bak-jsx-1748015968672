import React from 'react';
import { render, screen } from '@testing-library/react';
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
    size: 200,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 300,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 150,
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

describe('DataTable Column Sizing', () => {
  it('renders columns with specified widths', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Get all header cells
    const headerCells = screen.getAllByRole('columnheader');
    
    // Verify column widths are applied
    expect(headerCells[0]).toHaveStyle({ width: '200px' });
    expect(headerCells[1]).toHaveStyle({ width: '300px' });
    expect(headerCells[2]).toHaveStyle({ width: '150px' });
  });

  it('maintains column widths after data updates', () => {
    const { rerender } = render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Get initial column widths
    const initialHeaderCells = screen.getAllByRole('columnheader');
    const initialWidths = initialHeaderCells.map(cell => cell.style.width);
    
    // Update data
    const newData = [...testData, {
      id: '11',
      name: 'New User',
      email: 'new@example.com',
      status: 'Inactive',
    }];
    
    rerender(
      <DataTable
        columns={columns}
        data={newData}
      />
    );
    
    // Verify column widths are maintained
    const updatedHeaderCells = screen.getAllByRole('columnheader');
    const updatedWidths = updatedHeaderCells.map(cell => cell.style.width);
    expect(updatedWidths).toEqual(initialWidths);
  });

  it('maintains column widths after sorting', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Get initial column widths
    const initialHeaderCells = screen.getAllByRole('columnheader');
    const initialWidths = initialHeaderCells.map(cell => cell.style.width);
    
    // Sort by name
    const nameHeader = screen.getByRole('button', { name: /sort name/i });
    nameHeader.click();
    
    // Verify column widths are maintained
    const updatedHeaderCells = screen.getAllByRole('columnheader');
    const updatedWidths = updatedHeaderCells.map(cell => cell.style.width);
    expect(updatedWidths).toEqual(initialWidths);
  });

  it('maintains column widths after filtering', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        searchColumn="name"
      />
    );
    
    // Get initial column widths
    const initialHeaderCells = screen.getAllByRole('columnheader');
    const initialWidths = initialHeaderCells.map(cell => cell.style.width);
    
    // Filter data
    const searchInput = screen.getByPlaceholderText('Search...');
    searchInput.setAttribute('value', 'John');
    searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Verify column widths are maintained
    const updatedHeaderCells = screen.getAllByRole('columnheader');
    const updatedWidths = updatedHeaderCells.map(cell => cell.style.width);
    expect(updatedWidths).toEqual(initialWidths);
  });

  it('applies column widths to both header and body cells', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Get header cells
    const headerCells = screen.getAllByRole('columnheader');
    const headerWidths = headerCells.map(cell => cell.style.width);
    
    // Get first row cells
    const firstRow = screen.getAllByRole('row')[1]; // Skip header row
    const bodyCells = firstRow.querySelectorAll('td');
    const bodyWidths = Array.from(bodyCells).map(cell => cell.style.width);
    
    // Verify header and body cells have same widths
    expect(bodyWidths).toEqual(headerWidths);
  });
}); 