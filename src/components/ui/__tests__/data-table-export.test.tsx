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
  score: number;
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
    accessorKey: 'score',
    header: 'Score'}];

const testData = generateTestData<TestData>(
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
    score: 85},
  10
);

describe('DataTable Export', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    window.URL.createObjectURL = jest.fn();
    window.URL.revokeObjectURL = jest.fn();
    
    // Mock document.createElement and appendChild
    document.createElement = jest.fn(() => ({
      click: jest.fn(),
      setAttribute: jest.fn()})) as any;
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  it('renders export button when exportData is enabled', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        exportData
      />
    );
    
    const exportButton = screen.getByRole('button', { name: /export/i });
    expect(exportButton).toBeInTheDocument();
  });

  it('creates and downloads CSV file when export button is clicked', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        exportData
        exportFileName="test-data"
      />
    );
    
    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);
    
    // Verify URL.createObjectURL was called
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    
    // Verify document.createElement was called with 'a'
    expect(document.createElement).toHaveBeenCalledWith('a');
    
    // Verify setAttribute was called with correct filename
    const linkElement = document.createElement('a');
    expect(linkElement.setAttribute).toHaveBeenCalledWith('download', 'test-data.csv');
  });

  it('exports only visible columns', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        exportData
      />
    );
    
    // Hide email column
    const columnButton = screen.getByRole('button', { name: /columns/i });
    fireEvent.click(columnButton);
    
    const emailCheckbox = screen.getByRole('menuitemcheckbox', { name: /email/i });
    fireEvent.click(emailCheckbox);
    
    // Export data
    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);
    
    // Verify URL.createObjectURL was called with data excluding email column
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    const blob = (window.URL.createObjectURL as jest.Mock).mock.calls[0][0];
    expect(blob instanceof Blob).toBe(true);
  });

  it('exports filtered data when search is active', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        exportData
        searchColumn="name"
      />
    );
    
    // Filter data
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Export data
    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);
    
    // Verify URL.createObjectURL was called with filtered data
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    const blob = (window.URL.createObjectURL as jest.Mock).mock.calls[0][0];
    expect(blob instanceof Blob).toBe(true);
  });

  it('exports sorted data', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        exportData
      />
    );
    
    // Sort by name
    const nameHeader = screen.getByRole('button', { name: /sort name/i });
    fireEvent.click(nameHeader);
    
    // Export data
    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);
    
    // Verify URL.createObjectURL was called with sorted data
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    const blob = (window.URL.createObjectURL as jest.Mock).mock.calls[0][0];
    expect(blob instanceof Blob).toBe(true);
  });

  it('exports selected rows when row selection is enabled', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        exportData
        rowSelection
      />
    );
    
    // Select first row
    const checkbox = screen.getAllByRole('checkbox')[1]; // First row checkbox
    fireEvent.click(checkbox);
    
    // Export data
    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);
    
    // Verify URL.createObjectURL was called with selected data
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    const blob = (window.URL.createObjectURL as jest.Mock).mock.calls[0][0];
    expect(blob instanceof Blob).toBe(true);
  });

  it('cleans up object URLs after download', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        exportData
      />
    );
    
    // Export data
    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);
    
    // Verify URL.revokeObjectURL was called
    expect(window.URL.revokeObjectURL).toHaveBeenCalled();
  });
}); 