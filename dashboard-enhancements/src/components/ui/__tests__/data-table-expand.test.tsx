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
  details?: {
    role: string;
    department: string;
    joinDate: string;
  };
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
    details: {
      role: 'Developer',
      department: 'Engineering',
      joinDate: '2024-01-01',
    },
  },
  10
);

const ExpandedRow = ({ row }: { row: TestData }) => (
  <div data-testid="expanded-row">
    <div>Role: {row.details?.role}</div>
    <div>Department: {row.details?.department}</div>
    <div>Join Date: {row.details?.joinDate}</div>
  </div>
);

describe('DataTable Row Expansion', () => {
  it('renders expand buttons when expandable is enabled', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        expandable
        expandedRow={ExpandedRow}
      />
    );
    
    // Check if expand buttons are rendered
    const expandButtons = screen.getAllByRole('button', { name: /expand row/i });
    expect(expandButtons).toHaveLength(testData.length);
  });

  it('expands and collapses rows when clicking expand button', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        expandable
        expandedRow={ExpandedRow}
      />
    );
    
    // Click expand button on first row
    const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0];
    fireEvent.click(expandButton);
    
    // Verify expanded content is shown
    expect(screen.getByTestId('expanded-row')).toBeInTheDocument();
    expect(screen.getByText('Role: Developer')).toBeInTheDocument();
    
    // Click expand button again to collapse
    fireEvent.click(expandButton);
    
    // Verify expanded content is hidden
    expect(screen.queryByTestId('expanded-row')).not.toBeInTheDocument();
  });

  it('maintains expanded state after data updates', () => {
    const { rerender } = render(
      <DataTable
        columns={columns}
        data={testData}
        expandable
        expandedRow={ExpandedRow}
      />
    );
    
    // Expand first row
    const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0];
    fireEvent.click(expandButton);
    
    // Update data
    const newData = [...testData, {
      id: '11',
      name: 'New User',
      email: 'new@example.com',
      status: 'Inactive',
      details: {
        role: 'Designer',
        department: 'Design',
        joinDate: '2024-02-01',
      },
    }];
    
    rerender(
      <DataTable
        columns={columns}
        data={newData}
        expandable
        expandedRow={ExpandedRow}
      />
    );
    
    // Verify expanded state is maintained
    expect(screen.getByTestId('expanded-row')).toBeInTheDocument();
  });

  it('maintains expanded state after sorting', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        expandable
        expandedRow={ExpandedRow}
      />
    );
    
    // Expand first row
    const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0];
    fireEvent.click(expandButton);
    
    // Sort by name
    const nameHeader = screen.getByRole('button', { name: /sort name/i });
    fireEvent.click(nameHeader);
    
    // Verify expanded state is maintained
    expect(screen.getByTestId('expanded-row')).toBeInTheDocument();
  });

  it('maintains expanded state after filtering', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        expandable
        expandedRow={ExpandedRow}
        searchColumn="name"
      />
    );
    
    // Expand first row
    const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0];
    fireEvent.click(expandButton);
    
    // Filter data
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Verify expanded state is maintained
    expect(screen.getByTestId('expanded-row')).toBeInTheDocument();
  });

  it('maintains expanded state after pagination', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        expandable
        expandedRow={ExpandedRow}
        pagination
        pageSize={5}
      />
    );
    
    // Expand first row
    const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0];
    fireEvent.click(expandButton);
    
    // Go to next page
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Go back to first page
    const previousButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(previousButton);
    
    // Verify expanded state is maintained
    expect(screen.getByTestId('expanded-row')).toBeInTheDocument();
  });

  it('handles multiple expanded rows', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        expandable
        expandedRow={ExpandedRow}
      />
    );
    
    // Expand first row
    const firstExpandButton = screen.getAllByRole('button', { name: /expand row/i })[0];
    fireEvent.click(firstExpandButton);
    
    // Expand second row
    const secondExpandButton = screen.getAllByRole('button', { name: /expand row/i })[1];
    fireEvent.click(secondExpandButton);
    
    // Verify both rows are expanded
    const expandedRows = screen.getAllByTestId('expanded-row');
    expect(expandedRows).toHaveLength(2);
  });

  it('calls onRowExpand callback when expanding rows', () => {
    const onRowExpand = jest.fn();
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        expandable
        expandedRow={ExpandedRow}
        onRowExpand={onRowExpand}
      />
    );
    
    // Expand first row
    const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0];
    fireEvent.click(expandButton);
    
    expect(onRowExpand).toHaveBeenCalledWith(testData[0], true);
    
    // Collapse row
    fireEvent.click(expandButton);
    
    expect(onRowExpand).toHaveBeenCalledWith(testData[0], false);
  });
}); 