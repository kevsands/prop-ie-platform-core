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
    header: 'Name'},
  {
    accessorKey: 'email',
    header: 'Email'},
  {
    accessorKey: 'status',
    header: 'Status'}];

const testData = generateTestData<TestData>(
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active'},
  10
);

describe('DataTable Toolbar', () => {
  it('renders search input when searchColumn is provided', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        searchColumn="name"
        searchPlaceholder="Search names..."
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search names...');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders filter buttons when filters are provided', () => {
    const filters = [
      {
        columnId: 'status',
        title: 'Status',
        options: [
          { id: 'active', label: 'Active', value: 'active' },
          { id: 'inactive', label: 'Inactive', value: 'inactive' }]}];
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        filters={filters}
      />
    );
    
    const filterButton = screen.getByRole('button', { name: /status/i });
    expect(filterButton).toBeInTheDocument();
  });

  it('renders column visibility toggle', () => {
    render(<DataTable columns={columns} data={testData} />);
    
    const columnToggleButton = screen.getByRole('button', { name: /columns/i });
    expect(columnToggleButton).toBeInTheDocument();
    
    fireEvent.click(columnToggleButton);
    
    // Check if column options are rendered
    expect(screen.getByText('Toggle columns')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders export button when exportData is true', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        exportData
        exportFileName="test-export"
      />
    );
    
    const exportButton = screen.getByRole('button', { name: /export/i });
    expect(exportButton).toBeInTheDocument();
  });

  it('renders custom toolbar content', () => {
    const customToolbar = (
      <div data-testid="custom-toolbar">
        <button>Custom Action</button>
      </div>
    );
    
    render(
      <DataTable
        columns={columns}
        data={testData}
        toolbar={customToolbar}
      />
    );
    
    expect(screen.getByTestId('custom-toolbar')).toBeInTheDocument();
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('handles search input changes', async () => {
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
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
  });

  it('handles column visibility changes', () => {
    render(<DataTable columns={columns} data={testData} />);
    
    // Open column visibility menu
    const columnToggleButton = screen.getByRole('button', { name: /columns/i });
    fireEvent.click(columnToggleButton);
    
    // Toggle email column
    const emailToggle = screen.getByRole('checkbox', { name: /email/i });
    fireEvent.click(emailToggle);
    
    // Verify email column is hidden
    expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
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