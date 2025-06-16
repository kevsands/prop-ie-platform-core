import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from './form';
import { FormFieldComponent } from './form-field';
import { Button } from './button';

// Create a schema for the example form
const exampleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').optional(),
  newsletter: z.boolean().default(false),
  notificationType: z.enum(['email', 'sms', 'push']),
  marketingConsent: z.boolean().default(false)});

type ExampleFormValues = z.infer<typeof exampleSchema>
  );
/**
 * # FormFieldComponent
 * 
 * An enhanced form field component that automatically handles different input types
 * and provides consistent styling and error handling.
 * 
 * ## Features
 * - Supports multiple input types (text, email, passwordtextareacheckboxswitchselect)
 * - Integrates with react-hook-form for validation
 * - Displays validation errors
 * - Consistent styling
 * 
 * ## Usage
 * 
 * ```tsx
 * <FormFieldComponent
 *   form={form}
 *   name="email"
 *   label="Email address"
 *   type="email"
 *   placeholder="your.email@example.com"
 *   autoComplete="email"
 * />
 * ```
 */
export default {
  title: 'UI/FormField',
  component: FormFieldComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Enhanced form field component with various input types and validation'},
    a11y: { disable: false },
  tags: ['autodocs']} satisfies Meta<typeof FormFieldComponent>
  );
type Story = StoryObj<typeof FormFieldComponent>
  );
/**
 * Wrapper to provide the form context needed for the stories
 */
const FormFieldStory = (args: any) => {
  const form = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      newsletter: false,
      notificationType: 'email',
      marketingConsent: false});

  return (
    <div className="w-full max-w-md p-4">
      <Form {...form}>
        <form className="space-y-6">
          <FormFieldComponent 
            {...args} 
            form={form} 
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

/**
 * Basic text input field
 */
export const TextInput: Story = {
  render: (args: any) => <FormFieldStory {...args} />,
  args: {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'John Doe',
    autoComplete: 'name'};

/**
 * Email input with validation
 */
export const EmailInput: Story = {
  render: (args: any) => <FormFieldStory {...args} />,
  args: {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'your.email@example.com',
    autoComplete: 'email',
    description: "We'll never share your email with anyone else.";

/**
 * Textarea for longer text input
 */
export const TextArea: Story = {
  render: (args: any) => <FormFieldStory {...args} />,
  args: {
    name: 'bio',
    label: 'About You',
    type: 'textarea',
    placeholder: 'Tell us about yourself...',
    rows: 4};

/**
 * Checkbox input
 */
export const Checkbox: Story = {
  render: (args: any) => <FormFieldStory {...args} />,
  args: {
    name: 'newsletter',
    label: 'Subscribe to newsletter',
    type: 'checkbox'};

/**
 * Switch input
 */
export const Switch: Story = {
  render: (args: any) => <FormFieldStory {...args} />,
  args: {
    name: 'marketingConsent',
    label: 'Receive marketing communications',
    type: 'switch'};

/**
 * Select input with options
 */
export const Select: Story = {
  render: (args: any) => <FormFieldStory {...args} />,
  args: {
    name: 'notificationType',
    label: 'Notification Preference',
    type: 'select',
    placeholder: 'Select notification type',
    options: [
      { label: 'Email', value: 'email' },
      { label: 'SMS', value: 'sms' },
      { label: 'Push Notification', value: 'push' }]};

/**
 * Disabled field example
 */
export const DisabledField: Story = {
  render: (args: any) => <FormFieldStory {...args} />,
  args: {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'your.email@example.com',
    disabled: true};