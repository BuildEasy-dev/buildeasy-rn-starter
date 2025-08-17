import React from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
  type ControllerFieldState,
} from 'react-hook-form';

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  render: (props: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    error?: string;
    status: 'default' | 'error' | 'success';
    helperText?: string;
  }) => React.ReactElement;
};

/**
 * FormField - Generic field wrapper with Controller
 *
 * Provides a generic wrapper around React Hook Form's Controller component
 * with enhanced props for better integration with themed components.
 *
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
