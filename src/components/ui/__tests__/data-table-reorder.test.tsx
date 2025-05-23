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

describe('DataTable Column Order', () => {
  it('renders columns in the specified order', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Get all header cells
    const headerCells = screen.getAllByRole('columnheader');
    
    // Verify column order
    expect(headerCells[0]).toHaveTextContent('Name');
    expect(headerCells[1]).toHaveTextContent('Email');
    expect(headerCells[2]).toHaveTextContent('Status');
  });

  it('maintains column order after data updates', () => {
    const { rerender } = render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Get initial column order
    const initialHeaders = screen.getAllByRole('columnheader');
    const initialOrder = initialHeaders.map(header => header.textContent);
    
    // Update data
    const newData = [...testData, {
      id: '11',
      name: 'New User',
      email: 'new@example.com',
      status: 'Inactive'}];
    
    rerender(
      <DataTable
        columns={columns}
        data={newData}
      />
    );
    
    // Verify column order is maintained
    const updatedHeaders = screen.getAllByRole('columnheader');
    const updatedOrder = updatedHeaders.map(header => header.textContent);
    expect(updatedOrder).toEqual(initialOrder);
  });

  it('maintains column order after sorting', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Get initial column order
    const initialHeaders = screen.getAllByRole('columnheader');
    const initialOrder = initialHeaders.map(header => header.textContent);
    
    // Sort by name
    const nameHeader = screen.getByRole('button', { name: /sort name/i });
    fireEvent.click(nameHeader);
    
    // Verify column order is maintained
    const updatedHeaders = screen.getAllByRole('columnheader');
    const updatedOrder = updatedHeaders.map(header => header.textContent);
    expect(updatedOrder).toEqual(initialOrder);
  });

  it('maintains column order after filtering', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        searchColumn="name"
      />
    );
    
    // Get initial column order
    const initialHeaders = screen.getAllByRole('columnheader');
    const initialOrder = initialHeaders.map(header => header.textContent);
    
    // Filter data
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Verify column order is maintained
    const updatedHeaders = screen.getAllByRole('columnheader');
    const updatedOrder = updatedHeaders.map(header => header.textContent);
    expect(updatedOrder).toEqual(initialOrder);
  });

  it('maintains column order after column visibility changes', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
      />
    );
    
    // Get initial column order
    const initialHeaders = screen.getAllByRole('columnheader');
    const initialOrder = initialHeaders.map(header => header.textContent);
    
    // Toggle column visibility
    const visibilityButton = screen.getByRole('button', { name: /columns/i });
    fireEvent.click(visibilityButton);
    
    const emailCheckbox = screen.getByRole('menuitemcheckbox', { name: /email/i });
    fireEvent.click(emailCheckbox);
    
    // Verify column order is maintained for visible columns
    const updatedHeaders = screen.getAllByRole('columnheader');
    const updatedOrder = updatedHeaders.map(header => header.textContent);
    expect(updatedOrder).toEqual(initialOrder.filter(text => text !== 'Email'));
  });

  it('maintains column order after pagination', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        pagination
        pageSize={5}
      />
    );
    
    // Get initial column order
    const initialHeaders = screen.getAllByRole('columnheader');
    const initialOrder = initialHeaders.map(header => header.textContent);
    
    // Go to next page
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Verify column order is maintained
    const updatedHeaders = screen.getAllByRole('columnheader');
    const updatedOrder = updatedHeaders.map(header => header.textContent);
    expect(updatedOrder).toEqual(initialOrder);
  });
}); 