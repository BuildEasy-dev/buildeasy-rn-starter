/**
 * Form field components
 * @fileoverview Generic form field wrapper with enhanced validation props
 */

import React from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
  type ControllerFieldState,
} from 'react-hook-form';

/**
 * Props for the FormField component
 * @template TFieldValues - The form values type
 * @template TName - The field name type
 */
export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  /**
   * Render function for the form field
   * @param props - The render props including field state and validation status
   * @param props.field - The field props from Controller
   * @param props.fieldState - The field state from Controller
   * @param props.error - The error message if any
   * @param props.status - The validation status ('default' | 'error' | 'success')
   * @param props.helperText - The helper text to display
   * @returns The rendered form field element
   */
  render: (props: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    error?: string;
    status: 'default' | 'error' | 'success';
    helperText?: string;
  }) => React.ReactElement;
};

/**
 * Generic field wrapper with Controller
 * @description Provides a generic wrapper around React Hook Form's Controller component
 * with enhanced props for better integration with themed components
 * @template TFieldValues - The form values type
 * @template TName - The field name type
 * @param props - The form field properties
 * @returns The rendered form field with validation
 * @example
 * ```tsx
 * <FormField
 *   control={control}
 *   name="email"
 *   render={({ field, status, helperText }) => (
 *     <ThemedTextInput
 *       {...field}
 *       status={status}
 *       helperText={helperText}
 *     />
 *   )}
 * />
 * ```
 */
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ render, ...props }: FormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      {...props}
      render={({ field, fieldState }) => {
        const error = fieldState.error?.message;
        const status = fieldState.error ? 'error' : 'default';
        const helperText = error || undefined;

        return render({
          field,
          fieldState,
          error,
          status,
          helperText,
        });
      }}
    />
  );
}
