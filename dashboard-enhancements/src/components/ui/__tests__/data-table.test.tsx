import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DataTable } from '../data-table';
import { ColumnDef } from '@tanstack/react-table';
import { generateTestData } from '@/test-utils';

// Test data type
interface TestData {
  id: string;
  name: string;
  email: string;
  status: string;
}

// Test columns configuration
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

// Test data
const testData = generateTestData<TestData>(
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
  },
  10
);

describe('DataTable', () => {
  it('renders the table with data', () => {
    render(<DataTable columns={columns} data={testData} />);
    
    // Check if table headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    
    // Check if data is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    render(<DataTable columns={columns} data={testData} searchColumn="name" />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });
  });

  it('handles pagination', () => {
    render(<DataTable columns={columns} data={testData} pagination />);
    
    // Check if pagination controls are rendered
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    
    // Test pagination
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Verify page change
    expect(screen.getByText('Page 2 of')).toBeInTheDocument();
  });

  it('handles row selection', () => {
    const onSelectedRowsChange = jest.fn();
    render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection
        onSelectedRowsChange={onSelectedRowsChange}
      />
    );
    
    const checkbox = screen.getByRole('checkbox', { name: /select row/i });
    fireEvent.click(checkbox);
    
    expect(onSelectedRowsChange).toHaveBeenCalledWith([testData[0]]);
  });

  it('handles column visibility toggle', () => {
    render(<DataTable columns={columns} data={testData} />);
    
    const columnToggleButton = screen.getByRole('button', { name: /columns/i });
    fireEvent.click(columnToggleButton);
    
    // Check if column visibility menu is rendered
    expect(screen.getByText('Toggle columns')).toBeInTheDocument();
    
    // Toggle a column
    const emailToggle = screen.getByRole('checkbox', { name: /email/i });
    fireEvent.click(emailToggle);
    
    // Verify column is hidden
    expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
  });

  it('handles row click', () => {
    const onRowClick = jest.fn();
    render(
      <DataTable
        columns={columns}
        data={testData}
        onRowClick={onRowClick}
      />
    );
    
    const row = screen.getByText('John Doe').closest('tr');
    fireEvent.click(row!);
    
    expect(onRowClick).toHaveBeenCalledWith(testData[0]);
  });

  it('renders empty state', () => {
    render(<DataTable columns={columns} data={[]} />);
    
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<DataTable columns={columns} data={testData} loading />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles custom filters', () => {
    const filters = [
      {
        columnId: 'status',
        title: 'Status',
        options: [
          { id: 'active', label: 'Active', value: 'active' },
          { id: 'inactive', label: 'Inactive', value: 'inactive' },
        ],
      },
    ];
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        filters={filters}
      />
    );
    
    const filterButton = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(filterButton);
    
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('handles export functionality', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        exportData
        exportFileName="test-export"
      />
    );
    
    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);
    
    // Check if download link is created
    const downloadLink = document.querySelector('a[download]');
    expect(downloadLink).toHaveAttribute('download', 'test-export.csv');
  });
}); 