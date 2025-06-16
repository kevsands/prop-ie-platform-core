import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, User, Calendar, Search, Info, AlertCircle } from 'lucide-react';

import { Form } from '../components/ui/form';
import { Button } from '../components/ui/button';
import { FormFieldComponent } from '../components/ui/form-field';

// Form schema with zod
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters."),
  email: z.string().email({
    message: "Please enter a valid email address."),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters."),
  confirmPassword: z.string(),
  bio: z.string().max(200).optional(),
  age: z.number().min(18, {
    message: "You must be at least 18 years old.").max(120),
  birthDate: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions."),
  notificationPreference: z.enum(["email", "sms", "push", "none"]),
  timezone: z.string(),
  privacyLevel: z.number().min(1).max(5),
  verificationCode: z.string().length(6, {
    message: "Verification code must be 6 digits."
  }),
  darkMode: z.boolean().optional()}).refine((data: any) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"]});

// Component for wrapping form fields in a story
const FormExample = ({ children, onSubmit }: { children: React.ReactNode, onSubmit?: (values: any) => void }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      bio: "",
      age: 30,
      birthDate: "",
      agreeToTerms: false,
      notificationPreference: "email",
      timezone: "",
      privacyLevel: 3,
      verificationCode: "",
      darkMode: false});

  // Function to handle form submission
  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit?.(values);
  }

  // Add form context for the form fields
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 w-full max-w-md mx-auto">
        {React.Children.map(children, (child: any) => {
          // @ts-ignore
          if (child?.type === FormFieldComponent) {
            return React.cloneElement(child as React.ReactElement, { form });
          }
          return child;
        })}
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Form>
  );
};

const meta: Meta<typeof FormFieldComponent> = {
  title: 'UI/FormField',
  component: FormFieldComponent,
  parameters: {
    layout: 'centered'},
  tags: ['autodocs'],
  decorators: [
    (Story: any) => (
      <div className="p-6 max-w-md mx-auto">
        <Story />
      </div>
    )]};

export default meta;
type Story = StoryObj<typeof FormFieldComponent>\n  );
// Create a mock form for Storybook stories
const mockForm = {
  control: {},
  formState: { errors: {} } as any;

export const TextInput: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="username"
        label="Username"
        type="text"
        placeholder="Enter your username"
        required
        autoComplete="username"
      />
    </FormExample>
  )};

export const TextInputWithIcons: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="username"
        label="Username"
        type="text"
        placeholder="Enter your username"
        required
        leadingIcon={<User size={16} />}
      />
    </FormExample>
  )};

export const EmailInput: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        required
        leadingIcon={<Mail size={16} />}
        autoComplete="email"
      />
    </FormExample>
  )};

export const PasswordInput: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        required
        leadingIcon={<Lock size={16} />}
        autoComplete="new-password"
      />
    </FormExample>
  )};

export const NumberInput: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="age"
        label="Age"
        type="number"
        placeholder="30"
        required
        min={18}
        max={120}
      />
    </FormExample>
  )};

export const DateInput: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="birthDate"
        label="Birth Date"
        type="date"
        required
        leadingIcon={<Calendar size={16} />}
      />
    </FormExample>
  )};

export const TextArea: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="bio"
        label="Bio"
        type="textarea"
        placeholder="Tell us about yourself"
        rows={4}
      />
    </FormExample>
  )};

export const CheckboxInput: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="agreeToTerms"
        label="I agree to the terms and conditions"
        type="checkbox"
        required
      />
    </FormExample>
  )};

export const SwitchInput: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="darkMode"
        label="Enable Dark Mode"
        type="switch"
      />
    </FormExample>
  )};

export const RadioInput: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="notificationPreference"
        label="Notification Preference"
        type="radio"
        options={[
          { label: "Email", value: "email", description: "Get notified via email" },
          { label: "SMS", value: "sms", description: "Get notified via text message" },
          { label: "Push", value: "push", description: "Get notified via app" },
          { label: "None", value: "none", description: "Don't receive notifications", disabled: true }]}
      />
    </FormExample>
  )};

export const SelectInput: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="timezone"
        label="Time Zone"
        type="select"
        placeholder="Select your timezone"
        required
        options={[
          { label: "Pacific Time", value: "pt", group: "North America" },
          { label: "Mountain Time", value: "mt", group: "North America" },
          { label: "Central Time", value: "ct", group: "North America" },
          { label: "Eastern Time", value: "et", group: "North America" },
          { label: "Western European Time", value: "wet", group: "Europe" },
          { label: "Central European Time", value: "cet", group: "Europe" },
          { label: "Eastern European Time", value: "eet", group: "Europe" },
          { label: "Japan Standard Time", value: "jst", group: "Asia" },
          { label: "Australian Eastern Time", value: "aet", group: "Australia" }]}
      />
    </FormExample>
  )};

export const SliderInput: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="privacyLevel"
        label="Privacy Level"
        type="slider"
        min={1}
        max={5}
        step={1}
        sliderSteps={[1, 2, 3, 45]}
        description="Choose your privacy level from 1 (Public) to 5 (Private)"
      />
    </FormExample>
  )};

export const OtpInput: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="verificationCode"
        label="Verification Code"
        type="otp"
        otpLength={6}
        description="Enter the 6-digit code sent to your phone"
      />
    </FormExample>
  )};

export const WithDescription: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        description="We'll never share your email with anyone else."
        leadingIcon={<Mail size={16} />}
        required
      />
    </FormExample>
  )};

export const WithHelpText: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        help="Password should be at least 8 characters long and include letters, numbers, and special characters."
        leadingIcon={<Lock size={16} />}
        required
      />
    </FormExample>
  )};

export const WithError: Story = {
  render: () => (
    <FormExample>
      <FormFieldComponent
        form={mockForm}
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        leadingIcon={<Mail size={16} />}
        error="Please enter a valid email address"
        aria-invalid={true}
        required
      />
    </FormExample>
  )};

export const CompleteRegistrationForm: Story = {
  render: () => (
    <div className="p-6 bg-white rounded-lg shadow-sm border max-w-md mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
        <p className="text-muted-foreground mt-1">Enter your information to get started</p>
      </div>
      
      <FormExample>
        <FormFieldComponent
          form={mockForm}
          name="username"
          label="Username"
          type="text"
          placeholder="johndoe"
          required
          leadingIcon={<User size={16} />}
        />
        
        <FormFieldComponent
          form={mockForm}
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          leadingIcon={<Mail size={16} />}
        />
        
        <FormFieldComponent
          form={mockForm}
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          leadingIcon={<Lock size={16} />}
          help="At least 8 characters"
        />
        
        <FormFieldComponent
          form={mockForm}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          required
          leadingIcon={<Lock size={16} />}
        />
        
        <FormFieldComponent
          form={mockForm}
          name="bio"
          label="Bio"
          type="textarea"
          placeholder="Tell us about yourself"
          rows={3}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={mockForm}
            name="age"
            label="Age"
            type="number"
            placeholder="30"
            min={18}
            max={120}
            required
          />
          
          <FormFieldComponent
            form={mockForm}
            name="birthDate"
            label="Birth Date"
            type="date"
            leadingIcon={<Calendar size={16} />}
          />
        </div>
        
        <FormFieldComponent
          form={mockForm}
          name="timezone"
          label="Time Zone"
          type="select"
          placeholder="Select your timezone"
          options={[
            { label: "Pacific Time (PT)", value: "pt" },
            { label: "Mountain Time (MT)", value: "mt" },
            { label: "Central Time (CT)", value: "ct" },
            { label: "Eastern Time (ET)", value: "et" }]}
        />
        
        <FormFieldComponent
          form={mockForm}
          name="notificationPreference"
          label="Notification Preference"
          type="radio"
          options={[
            { label: "Email", value: "email" },
            { label: "SMS", value: "sms" },
            { label: "Push Notifications", value: "push" }]}
        />
        
        <FormFieldComponent
          form={mockForm}
          name="privacyLevel"
          label="Privacy Level"
          type="slider"
          min={1}
          max={5}
          step={1}
          description="Choose your privacy level"
        />
        
        <FormFieldComponent
          form={mockForm}
          name="agreeToTerms"
          label="I agree to the terms and conditions"
          type="checkbox"
          required
        />
      </FormExample>
    </div>
  )};