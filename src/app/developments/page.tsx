/**
 * Developments Listing Page
 * Shows all available property developments from developer-managed data
 */
import React from 'react';
import { Metadata } from 'next';
import DevelopmentsListClient from '@/components/developments/DevelopmentsListClient';

export const metadata: Metadata = {
  title: 'Developments | Prop.ie',
  description: 'Browse our property developments across Ireland',
};

export default function DevelopmentsPage() {
  return <DevelopmentsListClient />;
}