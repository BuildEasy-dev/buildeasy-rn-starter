/**
 * Typed form input components
 * @fileoverview Form input components with automatic validation and theming integration
 */

import React, { forwardRef } from 'react';
import {
  Controller,
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import {
  ThemedTextInput,
  type ThemedTextInputProps,
  ThemedCheckbox,
  type ThemedCheckboxProps,
  ThemedRadio,
  type ThemedRadioProps,
  ThemedSwitch,
  type ThemedSwitchProps,
} from '@/components/themed';

/**
 * Props for the FormTextInput component
 * @template TFieldValues - The form values type
 * @template TName - The field name type
 */
export type FormTextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ThemedTextInputProps, 'value' | 'onChangeText' | 'onBlur' | 'ref'> & {
  /** The name of the form field */
  name: TName;
  /** Optional form control - uses context if not provided */
  control?: Control<TFieldValues>;
};

/**
 * Text input with form validation
 * @description Integrates ThemedTextInput with React Hook Form for automatic validation
 * and error handling
 * @template TFieldValues - The form values type
 * @template TName - The field name type
 * @param props - The form text input properties
 * @param ref - The forwarded ref
 * @returns The text input component with form validation
 * @example
 * ```tsx
 * <FormTextInput
 *   name="email"
 *   control={control}
 *   label="Email"
 *   keyboardType="email-address"
 * />
 * ```
 */
export const FormTextInput = forwardRef<
  React.ElementRef<typeof ThemedTextInput>,
  FormTextInputProps
>(function FormTextInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, control, ...props }: FormTextInputProps<TFieldValues, TName>, ref: any) {
  const methods = useFormContext<TFieldValues>();
  const actualControl = control || methods?.control;

  if (!actualControl) {
    throw new Error('FormTextInput must be used within FormProvider or with control prop');
  }

  return (
    <Controller
      name={name}
      control={actualControl}
      render={({ field: { onChange, onBlur, value, ref: fieldRef }, fieldState: { error } }) => (
        <ThemedTextInput
          ref={(instance) => {
            fieldRef(instance);
            if (ref) {
              if (typeof ref === 'function') {
                ref(instance);
              } else {
                ref.current = instance;
              }
            }
          }}
          value={value || ''}
          onChangeText={onChange}
          onBlur={onBlur}
          status={error ? 'error' : 'default'}
          helperText={error?.message || props.helperText}
          {...props}
        />
      )}
    />
  );
});

/**
 * Props for the FormCheckbox component
 * @template TFieldValues - The form values type
 * @template TName - The field name type
 */
export type FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ThemedCheckboxProps, 'value' | 'onValueChange' | 'ref'> & {
  /** The name of the form field */
  name: TName;
  /** Optional form control - uses context if not provided */
  control?: Control<TFieldValues>;
};

/**
 * Checkbox with form validation
 * @description Integrates ThemedCheckbox with React Hook Form for boolean field validation
 * @template TFieldValues - The form values type
 * @template TName - The field name type
 * @param props - The form checkbox properties
 * @param ref - The forwarded ref
 * @returns The checkbox component with form validation
 * @example
 * ```tsx
 * <FormCheckbox
 *   name="acceptTerms"
 *   control={control}
 *   label="I accept the terms and conditions"
 * />
 * ```
 */
export const FormCheckbox = forwardRef<React.ElementRef<typeof ThemedCheckbox>, FormCheckboxProps>(
  function FormCheckbox<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  >({ name, control, ...props }: FormCheckboxProps<TFieldValues, TName>, ref: any) {
    const methods = useFormContext<TFieldValues>();
    const actualControl = control || methods?.control;

    if (!actualControl) {
      throw new Error('FormCheckbox must be used within FormProvider or with control prop');
    }

    return (
      <Controller
        name={name}
        control={actualControl}
        render={({ field: { onChange, value } }) => (
          <ThemedCheckbox ref={ref} value={!!value} onValueChange={onChange} {...props} />
        )}
      />
    );
  }
);

/**
 * Props for the FormRadio component
 * @template TFieldValues - The form values type
 * @template TName - The field name type
 * @template TValue - The value type for the radio button
 */
export type FormRadioProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = string | number,
> = Omit<ThemedRadioProps<TValue>, 'selectedValue' | 'onValueChange' | 'ref'> & {
  /** The name of the form field */
  name: TName;
  /** Optional form control - uses context if not provided */
  control?: Control<TFieldValues>;
};

/**
 * Radio button with form validation
 * @description Integrates ThemedRadio with React Hook Form for single-choice field validation
 * @template TFieldValues - The form values type
 * @template TName - The field name type
 * @template TValue - The value type for the radio button
 * @param props - The form radio properties
 * @param ref - The forwarded ref
 * @returns The radio button component with form validation
 * @example
 * ```tsx
 * <FormRadio
 *   name="gender"
 *   control={control}
 *   value="male"
 *   label="Male"
 * />
 * <FormRadio
 *   name="gender"
 *   control={control}
 *   value="female"
 *   label="Female"
 * />
 * ```
 */
export const FormRadio = forwardRef<React.ElementRef<typeof ThemedRadio>, FormRadioProps>(
  function FormRadio<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue extends string | number = string | number,
  >({ name, control, value, ...props }: FormRadioProps<TFieldValues, TName, TValue>, ref: any) {
    const methods = useFormContext<TFieldValues>();
    const actualControl = control || methods?.control;

    if (!actualControl) {
      throw new Error('FormRadio must be used within FormProvider or with control prop');
    }

    return (
      <Controller
        name={name}
        control={actualControl}
        render={({ field: { onChange, value: fieldValue } }) => (
          <ThemedRadio
            ref={ref}
            value={value}
            selectedValue={fieldValue}
            onValueChange={onChange}
            {...props}
          />
        )}
      />
    );
  }
);

/**
 * Props for the FormSwitch component
 * @template TFieldValues - The form values type
 * @template TName - The field name type
 */
export type FormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ThemedSwitchProps, 'value' | 'onValueChange'> & {
  /** The name of the form field */
  name: TName;
  /** Optional form control - uses context if not provided */
  control?: Control<TFieldValues>;
};

/**
 * Switch with form validation
 * @description Integrates ThemedSwitch with React Hook Form for boolean toggle field validation
 * @template TFieldValues - The form values type
 * @template TName - The field name type
 * @param props - The form switch properties
 * @returns The switch component with form validation
 * @example
 * ```tsx
 * <FormSwitch
 *   name="notifications"
 *   control={control}
 * />
 * ```
 */
export function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, control, ...props }: FormSwitchProps<TFieldValues, TName>) {
  const methods = useFormContext<TFieldValues>();
  const actualControl = control || methods?.control;

  if (!actualControl) {
    throw new Error('FormSwitch must be used within FormProvider or with control prop');
  }

  return (
    <Controller
      name={name}
      control={actualControl}
      render={({ field: { onChange, value } }) => (
        <ThemedSwitch value={!!value} onValueChange={onChange} {...props} />
      )}
    />
  );
}
