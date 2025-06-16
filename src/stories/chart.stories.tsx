import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ChartWrapper } from '../components/ui/chart-wrapper';
import { MetricCard } from '../components/ui/metric-card';
import {
  Activity,
  ArrowUpRight,
  DollarSign,
  LineChart as LucideLineChart,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const meta: Meta<typeof ChartWrapper> = {
  title: 'UI/Chart',
  component: ChartWrapper,
  parameters: {
    layout: 'centered'},
  tags: ['autodocs'],
  decorators: [
    (Story: any) => (
      <div className="p-6 max-w-4xl mx-auto">
        <Story />
      </div>
    )]};

export default meta;
type Story = StoryObj<typeof ChartWrapper>
  );
// Sample data for charts
const barChartData = [
  { name: 'Jan', revenue: 12000, expenses: 8000, profit: 4000 },
  { name: 'Feb', revenue: 15000, expenses: 10000, profit: 5000 },
  { name: 'Mar', revenue: 18000, expenses: 12000, profit: 6000 },
  { name: 'Apr', revenue: 21000, expenses: 13000, profit: 8000 },
  { name: 'May', revenue: 23000, expenses: 14000, profit: 9000 },
  { name: 'Jun', revenue: 26000, expenses: 16000, profit: 10000 }];

const lineChartData = [
  { date: 'Week 1', sales: 120, visitors: 450, leads: 23 },
  { date: 'Week 2', sales: 150, visitors: 520, leads: 27 },
  { date: 'Week 3', sales: 180, visitors: 600, leads: 31 },
  { date: 'Week 4', sales: 220, visitors: 650, leads: 35 },
  { date: 'Week 5', sales: 250, visitors: 700, leads: 40 },
  { date: 'Week 6', sales: 280, visitors: 750, leads: 45 },
  { date: 'Week 7', sales: 300, visitors: 800, leads: 50 },
  { date: 'Week 8', sales: 320, visitors: 880, leads: 55 }];

const areaChartData = [
  { month: 'Jan', residential: 45, commercial: 30, industrial: 15 },
  { month: 'Feb', residential: 52, commercial: 35, industrial: 18 },
  { month: 'Mar', residential: 58, commercial: 40, industrial: 20 },
  { month: 'Apr', residential: 63, commercial: 45, industrial: 22 },
  { month: 'May', residential: 70, commercial: 50, industrial: 25 },
  { month: 'Jun', residential: 75, commercial: 55, industrial: 28 },
  { month: 'Jul', residential: 82, commercial: 60, industrial: 30 },
  { month: 'Aug', residential: 85, commercial: 62, industrial: 32 }];

const pieChartData = [
  { name: 'Residential', value: 65 },
  { name: 'Commercial', value: 25 },
  { name: 'Industrial', value: 10 }];

const metricTrendData = Array.from({ length: 7 }, (_i: any) => ({
  value: 10 + Math.random() * 50}));

export const BarChart: Story = {
  render: () => (
    <ChartWrapper
      data={barChartData}
      type="bar"
      series={[
        { dataKey: 'revenue', name: 'Revenue' },
        { dataKey: 'expenses', name: 'Expenses' },
        { dataKey: 'profit', name: 'Profit' }]}
      xAxisKey="name"
      height={400}
      formatYAxis={(value: any) => `$${value / 1000}k`}
    />
  )};

export const StackedBarChart: Story = {
  render: () => (
    <ChartWrapper
      data={barChartData}
      type="bar"
      series={[
        { dataKey: 'revenue', name: 'Revenue', stackId: 'stack' },
        { dataKey: 'expenses', name: 'Expenses', stackId: 'stack' },
        { dataKey: 'profit', name: 'Profit', stackId: 'stack' }]}
      xAxisKey="name"
      height={400}
      stacked={true}
      formatYAxis={(value: any) => `$${value / 1000}k`}
    />
  )};

export const HorizontalBarChart: Story = {
  render: () => (
    <ChartWrapper
      data={barChartData}
      type="bar"
      series={[
        { dataKey: 'revenue', name: 'Revenue' },
        { dataKey: 'expenses', name: 'Expenses' }]}
      xAxisKey="name"
      height={400}
      horizontal={true}
      formatYAxis={(value: any) => `$${value / 1000}k`}
    />
  )};

export const LineChartExample: Story = {
  name: 'Line Chart',
  render: () => (
    <ChartWrapper
      data={lineChartData}
      type="line"
      series={[
        { dataKey: 'sales', name: 'Sales' },
        { dataKey: 'leads', name: 'Leads', yAxisId: 'right' }]}
      xAxisKey="date"
      height={400}
      showDots={true}
      secondaryYAxis={true}
      grid={true}
      tooltipFormatter={(valuename: any) => [`${value}`, name]}
    />
  )};

export const AreaChart: Story = {
  render: () => (
    <ChartWrapper
      data={areaChartData}
      type="area"
      series={[
        { dataKey: 'residential', name: 'Residential' },
        { dataKey: 'commercial', name: 'Commercial' },
        { dataKey: 'industrial', name: 'Industrial' }]}
      xAxisKey="month"
      height={400}
      stacked={true}
    />
  )};

export const PieChart: Story = {
  render: () => (
    <ChartWrapper
      data={pieChartData}
      type="pie"
      series={[{ dataKey: 'value' }]}
      xAxisKey="name"
      height={400}
      tooltipFormatter={(value: any) => [`${value}%`, '']}
    />
  )};

export const ComposedChart: Story = {
  render: () => (
    <ChartWrapper
      data={barChartData}
      type="composed"
      series={[
        { dataKey: 'revenue', name: 'Revenue', type: 'bar' },
        { dataKey: 'expenses', name: 'Expenses', type: 'bar' },
        { dataKey: 'profit', name: 'Profit', type: 'line' }]}
      xAxisKey="name"
      height={400}
      showDots={true}
      grid={true}
      formatYAxis={(value: any) => `$${value / 1000}k`}
    />
  )};

export const MetricCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <MetricCard
        title="Total Revenue"
        value="€234,567"
        subtitle="Monthly revenue"
        icon={DollarSign}
        trendValue={12.5}
        trendLabel="vs last month"
        trendData={metricTrendData}
      />

      <MetricCard
        title="New Customers"
        value="1,234"
        subtitle="Last 30 days"
        icon={Users}
        trendValue={-3.2}
        trendLabel="vs last month"
        trendData={metricTrendData}
        trendColor="danger"
      />

      <MetricCard
        title="Properties Sold"
        value="48"
        subtitle="Last 30 days"
        icon={Activity}
        trendValue={8.7}
        trendLabel="vs last month"
        trendData={metricTrendData}
        trendColor="success"
      />

      <MetricCard
        title="Conversion Rate"
        value="3.6%"
        subtitle="Visits to sales"
        icon={LucideLineChart}
        trendValue={0.8}
        trendLabel="vs last month"
        trendData={metricTrendData}
        trendColor="warning"
      />
    </div>
  )};

export const ResponsiveDashboardSample: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value="€234,567"
          subtitle="Monthly revenue"
          trendValue={12.5}
          trendLabel="vs last month"
          trendData={metricTrendData}
          headerAction={<ArrowUpRight className="h-4 w-4 text-green-500" />}
        />

        <MetricCard
          title="New Customers"
          value="1,234"
          subtitle="Last 30 days"
          trendValue={-3.2}
          trendLabel="vs last month"
          trendColor="danger"
          headerAction={<TrendingDown className="h-4 w-4 text-red-500" />}
        />

        <MetricCard
          title="Properties Sold"
          value="48"
          subtitle="Last 30 days"
          trendValue={8.7}
          trendLabel="vs last month"
          trendColor="success"
          headerAction={<TrendingUp className="h-4 w-4 text-green-500" />}
        />

        <MetricCard
          title="Conversion Rate"
          value="3.6%"
          subtitle="Visits to sales"
          trendValue={0.8}
          trendLabel="vs last month"
          trendColor="warning"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartWrapper
              data={barChartData}
              type="bar"
              series={[
                { dataKey: 'revenue', name: 'Revenue' },
                { dataKey: 'expenses', name: 'Expenses' },
                { dataKey: 'profit', name: 'Profit' }]}
              xAxisKey="name"
              height={300}
              formatYAxis={(value: any) => `$${value / 1000}k`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartWrapper
              data={lineChartData}
              type="line"
              series={[
                { dataKey: 'sales', name: 'Sales' },
                { dataKey: 'leads', name: 'Leads', yAxisId: 'right' }]}
              xAxisKey="date"
              height={300}
              showDots={true}
              secondaryYAxis={true}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartWrapper
              data={pieChartData}
              type="pie"
              series={[{ dataKey: 'value' }]}
              xAxisKey="name"
              height={250}
              tooltipFormatter={(value: any) => [`${value}%`, '']}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Property Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartWrapper
              data={areaChartData}
              type="area"
              series={[
                { dataKey: 'residential', name: 'Residential' },
                { dataKey: 'commercial', name: 'Commercial' },
                { dataKey: 'industrial', name: 'Industrial' }]}
              xAxisKey="month"
              height={250}
              stacked={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )};