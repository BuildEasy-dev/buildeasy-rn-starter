/**
 * Form provider component
 * @fileoverview Context wrapper for React Hook Form integration
 */

import React from 'react';
import {
  FormProvider as RHFFormProvider,
  type UseFormReturn,
  type FieldValues,
} from 'react-hook-form';

/**
 * Props for the FormProvider component
 * @template TFieldValues - The form values type
 */
export type FormProviderProps<TFieldValues extends FieldValues = FieldValues> = {
  /** The child components that will have access to form context */
  children: React.ReactNode;
  /** The form methods from useForm hook */
  methods: UseFormReturn<TFieldValues>;
};

/**
 * Context wrapper for forms
 * @description Provides form context to child components, enabling them to access
 * form state and methods without prop drilling
 * @template TFieldValues - The form values type
 * @param props - The form provider properties
 * @param props.children - The child components
 * @param props.methods - The form methods from useForm hook
 * @returns The form provider component with context
 * @example
 * ```tsx
 * const methods = useForm<FormData>({
 *   resolver: zodResolver(schema)
 * });
 *
 * <FormProvider methods={methods}>
 *   <FormTextInput name="email" />
 * </FormProvider>
 * ```
 */
export function FormProvider<TFieldValues extends FieldValues = FieldValues>({
  children,
  methods,
}: FormProviderProps<TFieldValues>) {
  return <RHFFormProvider {...methods}>{children}</RHFFormProvider>;
}
