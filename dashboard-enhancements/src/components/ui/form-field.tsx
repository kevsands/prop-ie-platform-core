'use client';

import React from 'react';
import { UseFormReturn, ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';

// Types
type Option = { 
  label: string; 
  value: string; 
  disabled?: boolean;
  description?: string;
  group?: string;
};

type FormFieldComponentProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'date' | 
         'datetime-local' | 'textarea' | 'checkbox' | 'switch' | 'select' | 
         'radio' | 'slider' | 'otp';
  autoComplete?: string;
  className?: string;
  options?: Option[];
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  sliderSteps?: number[];
  otpLength?: number;
  otpType?: 'numeric' | 'alphanumeric';
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  renderOption?: (option: Option) => React.ReactNode;
  help?: string | React.ReactNode;
  error?: string;
  labelClassName?: string;
  inputClassName?: string;
  id?: string;
};

/**
 * Enhanced form field component that automatically handles different input types
 * and provides consistent styling, accessibility and error handling
 * 
 * @example
 * <FormFieldComponent
 *   form={form}
 *   name="email"
 *   label="Email address"
 *   type="email"
 *   placeholder="your.email@example.com"
 *   autoComplete="email"
 *   required
 * />
 */
export function FormFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  form,
  name,
  label,
  description,
  placeholder,
  type = 'text',
  autoComplete,
  className,
  options = [],
  rows = 3,
  disabled = false,
  required = false,
  min,
  max,
  step,
  sliderSteps,
  otpLength = 6,
  otpType = 'numeric',
  leadingIcon,
  trailingIcon,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired = required,
  renderOption,
  help,
  error,
  labelClassName = '',
  inputClassName = '',
  id: customId,
  ...props
}: FormFieldComponentProps<TFieldValues, TName> & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  // Generate consistent IDs for accessibility
  const fieldId = customId || `field-${name}`;
  const helpId = `${fieldId}-help`;
  const errorId = `${fieldId}-error`;
  
  // Group options by their group property if present
  const groupedOptions: Record<string, Option[]> = {};
  const ungroupedOptions: Option[] = [];
  
  options.forEach(option => {
    if (option.group) {
      if (!groupedOptions[option.group]) {
        groupedOptions[option.group] = [];
      }
      groupedOptions[option.group].push(option);
    } else {
      ungroupedOptions.push(option);
    }
  });
  
  // Render different form controls based on type
  const renderFormControl = ({ field }: { field: any }) => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={inputClassName}
            aria-describedby={description ? helpId : undefined}
            aria-required={ariaRequired}
            aria-invalid={form.formState.errors[name] ? true : ariaInvalid}
            {...field}
            {...props}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              aria-describedby={description ? helpId : undefined}
              aria-required={ariaRequired}
              className={inputClassName}
            />
            {label && (
              <Label 
                htmlFor={fieldId}
                className={`text-sm font-normal cursor-pointer ${labelClassName}`}
              >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
          </div>
        );
      
      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={fieldId}
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              aria-describedby={description ? helpId : undefined}
              aria-required={ariaRequired}
              className={inputClassName}
            />
            {label && (
              <Label 
                htmlFor={fieldId}
                className={`text-sm font-normal cursor-pointer ${labelClassName}`}
              >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
          </div>
        );
      
      case 'select':
        return (
          <div className="relative">
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={fieldId}
                className={inputClassName}
                aria-describedby={description ? helpId : undefined}
                aria-required={ariaRequired}
                aria-invalid={form.formState.errors[name] ? true : ariaInvalid}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(groupedOptions).length > 0 ? (
                  Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                    <SelectGroup key={groupName}>
                      <SelectLabel>{groupName}</SelectLabel>
                      {groupOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          disabled={option.disabled}
                        >
                          {renderOption ? renderOption(option) : option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))
                ) : null}
                
                {ungroupedOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {renderOption ? renderOption(option) : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'radio':
        return (
          <RadioGroup
            defaultValue={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
            className="space-y-1"
            aria-describedby={description ? helpId : undefined}
            aria-required={ariaRequired}
          >
            {options.map((option) => (
              <div className="flex items-center space-x-2" key={option.value}>
                <RadioGroupItem 
                  value={option.value} 
                  id={`${fieldId}-${option.value}`}
                  disabled={option.disabled}
                  className={inputClassName}
                />
                <Label 
                  htmlFor={`${fieldId}-${option.value}`}
                  className={`text-sm font-normal cursor-pointer ${labelClassName}`}
                >
                  {option.label}
                </Label>
                {option.description && (
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                )}
              </div>
            ))}
          </RadioGroup>
        );

      case 'slider':
        const sliderValue = typeof field.value === 'number' ? [field.value] : [0];
        return (
          <Slider
            value={sliderValue}
            min={min}
            max={max}
            step={step}
            onValueChange={(values) => field.onChange(values[0])}
            disabled={disabled}
            aria-describedby={description ? helpId : undefined}
            aria-labelledby={label ? fieldId : undefined}
            className={inputClassName}
            {...(sliderSteps && { 
              marks: sliderSteps.map(value => ({ value, label: value.toString() })) 
            })}
          />
        );
      
      case 'otp':
        return (
          <InputOTP 
            maxLength={otpLength}
            value={field.value || ''}
            onChange={field.onChange}
            disabled={disabled}
            render={({ slots }) => (
              <InputOTPGroup className="gap-2">
                {slots.map((slot, index) => (
                  <InputOTPSlot 
                    key={index} 
                    {...slot} 
                    index={index}
                    className={inputClassName}
                  />
                ))}
              </InputOTPGroup>
            )}
          />
        );
      
      default:
        return (
          <div className="relative">
            {leadingIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {leadingIcon}
              </div>
            )}
            <Input
              id={fieldId}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
              required={required}
              className={`${inputClassName} ${leadingIcon ? 'pl-10' : ''} ${trailingIcon ? 'pr-10' : ''}`}
              aria-describedby={description ? helpId : undefined}
              aria-required={ariaRequired}
              aria-invalid={form.formState.errors[name] ? true : ariaInvalid}
              {...field}
              {...props}
            />
            {trailingIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {trailingIcon}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {/* Only show label for non-checkbox/switch types, as they handle their own labels */}
          {label && type !== 'checkbox' && type !== 'switch' && (
            <FormLabel 
              htmlFor={fieldId}
              className={labelClassName}
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            {renderFormControl({ field } as any)}
          </FormControl>
          {description && (
            <FormDescription id={helpId}>
              {description}
            </FormDescription>
          )}
          {help && !description && (
            <p id={helpId} className="text-sm text-muted-foreground mt-1">{help}</p>
          )}
          <FormMessage id={errorId} />
        </FormItem>
      )}
    />
  );
}

export default FormFieldComponent;