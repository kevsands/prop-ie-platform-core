'use client';

import { useState } from 'react';
import { useForm, UseFormProps, FieldValues, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/components/ui/toast';

/**
 * Custom hook that combines form handling with toast notifications
 * 
 * @param schema - Zod validation schema
 * @param options - React Hook Form options
 * @returns Form methods, submission handler and loading state
 * 
 * @example
 * const { form, handleSubmit, isSubmitting } = useFormWithToast({
 *   schema: loginSchema,
 *   defaultValues: { email: '', password: '' }
 * });
 * 
 * const onSubmit = handleSubmit(async (data: any) => {
 *   // Form data is already validated by Zod
 *   const result = await api.login(data);
 *   return { success: 'Login successful!' };
 * });
 */
export function useFormWithToast<TSchema extends z.ZodType<any, any, any>, TValues extends FieldValues>({
  schema,
  ...options
}: UseFormProps<TValues> & {
  schema: TSchema
}) {
  type FormValues = z.infer<TSchema>
  );
  const [isSubmittingsetIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    ...options});

  /**
   * Enhanced submission handler with toast notifications
   * Returns a function that handles form submission with built-in
   * loading state management and error/success toasts
   */
  const handleSubmit = (
    onSubmit: (data: FormValues) => Promise<{ success?: string } | void>
  ) => {
    return form.handleSubmit(async (data: any) => {
      setIsSubmitting(true);

      try {
        const result = await onSubmit(data);

        if (result?.success) {
          toast.success({ 
            title: 'Success',
            description: result.success 
          });
        }

        return result;
      } catch (error: any) {
        toast.error({ 
          title: 'Error',
          description: error.message || 'An error occurred' 
        });
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return {
    form,
    handleSubmit,
    isSubmitting};
}

export default useFormWithToast;