import React from 'react';
import {
  FormProvider as RHFFormProvider,
  type UseFormReturn,
  type FieldValues,
} from 'react-hook-form';

export type FormProviderProps<TFieldValues extends FieldValues = FieldValues> = {
  children: React.ReactNode;
  methods: UseFormReturn<TFieldValues>;
};

/**
 * FormProvider - Context wrapper for forms
 *
 * Provides form context to child components, enabling them to access
 * form state and methods without prop drilling.
 *
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
