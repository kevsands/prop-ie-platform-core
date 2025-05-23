import React from 'react';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export function Table({ className = '', children, ...props }: TableProps) {
  return (
    <table
      className={`w-full text-sm text-left text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </table>
  );
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableHeader({ className = '', children, ...props }: TableHeaderProps) {
  return (
    <thead className={`text-xs text-gray-700 uppercase bg-gray-50 ${className}`} {...props}>
      {children}
    </thead>
  );
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableBody({ className = '', children, ...props }: TableBodyProps) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export function TableRow({ className = '', children, ...props }: TableRowProps) {
  return (
    <tr className={`border-b hover:bg-gray-50 ${className}`} {...props}>
      {children}
    </tr>
  );
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export function TableHead({ className = '', children, ...props }: TableHeadProps) {
  return (
    <th scope="col" className={`px-6 py-3 ${className}`} {...props}>
      {children}
    </th>
  );
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export function TableCell({ className = '', children, ...props }: TableCellProps) {
  return (
    <td className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </td>
  );
}