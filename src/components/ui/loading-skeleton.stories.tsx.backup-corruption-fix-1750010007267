import React from 'react';
'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { LoadingSkeleton, SkeletonCard, SkeletonText } from './loading-skeleton';
import { Button } from './button';

/**
 * # Loading Skeleton Components
 * 
 * Loading skeletons provide visual placeholders while content is being fetched. 
 * They improve perceived performance and reduce layout shifts.
 * 
 * ## Components
 * - `Skeleton`: Basic skeleton placeholder
 * - `SkeletonText`: Multiple lines of text placeholders
 * - `SkeletonCard`: Card placeholders with optional header, body, and footer
 * - `LoadingSkeleton`: Wrapper that conditionally shows children or skeletons
 * 
 * ## Usage
 * 
 * ```tsx
 * // Basic usage - show skeleton while loading
 * <LoadingSkeleton isLoading={isLoading} variant="card">
 *   <UserCard user={user} />
 * </LoadingSkeleton>
 * 
 * // Grid layout for multiple items
 * <LoadingSkeleton 
 *   variant="card" 
 *   count={3} 
 *   isLoading={isLoading}
 *   layout="grid"
 *   layoutProps={ cols: 'grid-cols-1 md:grid-cols-3' }
 * >
 *   <ProductList products={products} />
 * </LoadingSkeleton>
 * ```
 */
const meta = {
  title: 'UI/LoadingSkeleton',
  component: LoadingSkeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Loading skeleton components for improved UX during data fetching'}},
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'card', 'table', 'form', 'list'],
      description: 'The type of skeleton to display'},
    count: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of skeleton items to display'},
    layout: {
      control: 'select',
      options: ['grid', 'flex', 'block'],
      description: 'Layout for multiple skeleton items'},
    isLoading: {
      control: 'boolean',
      description: 'Whether to show the skeleton or children'}} satisfies Meta<typeof LoadingSkeleton>\n  );
export default meta;
type Story = StoryObj<typeof LoadingSkeleton>\n  );
/**
 * Text skeleton placeholder
 */
export const TextSkeleton: Story = {
  args: {
    variant: 'text',
    count: 1,
    isLoading: true};

/**
 * Card skeleton placeholder
 */
export const CardSkeleton: Story = {
  args: {
    variant: 'card',
    count: 1,
    isLoading: true};

/**
 * Multiple card skeletons in a grid
 */
export const GridCardSkeletons: Story = {
  args: {
    variant: 'card',
    count: 3,
    isLoading: true,
    layout: 'grid',
    layoutProps: { cols: 'grid-cols-1 md:grid-cols-3 gap-6' },
  parameters: {
    viewport: {
      defaultViewport: 'desktop'}};

/**
 * Table skeleton placeholder
 */
export const TableSkeleton: Story = {
  args: {
    variant: 'table',
    count: 1,
    isLoading: true};

/**
 * Form skeleton placeholder
 */
export const FormSkeleton: Story = {
  args: {
    variant: 'form',
    count: 1,
    isLoading: true};

/**
 * List skeleton placeholder
 */
export const ListSkeleton: Story = {
  args: {
    variant: 'list',
    count: 1,
    isLoading: true};

/**
 * Demo with loading toggle
 */
export const LoadingDemo: Story = {
  render: (args: any) => {
    const [isLoadingsetIsLoading] = useState(true);

    // Toggle loading state automatically for demo
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    // Mock data that would be loaded from an API
    const items = [
      { id: 1, title: 'Property in Dublin', description: 'Beautiful 3-bedroom house in Dublin', price: '€450,000' },
      { id: 2, title: 'Apartment in Cork', description: 'Modern 2-bedroom apartment in Cork city', price: '€320,000' },
      { id: 3, title: 'Cottage in Galway', description: 'Charming cottage in Galway countryside', price: '€280,000' }];

    return (
      <div className="w-full max-w-4xl p-4">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Property Listings</h2>
          <Button onClick={() => setIsLoading(!isLoading)}>
            {isLoading ? 'Show Content' : 'Show Skeleton'}
          </Button>
        </div>

        <LoadingSkeleton
          variant="card"
          count={3}
          isLoading={isLoading}
          layout="grid"
          layoutProps={ cols: 'grid-cols-1 md:grid-cols-3 gap-6' }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-bold text-blue-600">{item.price}</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </LoadingSkeleton>
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop'}};