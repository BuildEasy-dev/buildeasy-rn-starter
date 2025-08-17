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

// ============================================================================
// FormTextInput
// ============================================================================

export type FormTextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ThemedTextInputProps, 'value' | 'onChangeText' | 'onBlur' | 'ref'> & {
  name: TName;
  control?: Control<TFieldValues>;
};

/**
 * FormTextInput - Text input with form validation
 *
 * Integrates ThemedTextInput with React Hook Form for automatic validation
 * and error handling.
 *
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

// ============================================================================
// FormCheckbox
// ============================================================================

export type FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ThemedCheckboxProps, 'value' | 'onValueChange' | 'ref'> & {
  name: TName;
  control?: Control<TFieldValues>;
};

/**
 * FormCheckbox - Checkbox with form validation
 *
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

// ============================================================================
// FormRadio
// ============================================================================

export type FormRadioProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = string | number,
> = Omit<ThemedRadioProps<TValue>, 'selectedValue' | 'onValueChange' | 'ref'> & {
  name: TName;
  control?: Control<TFieldValues>;
};

/**
 * FormRadio - Radio button with form validation
 *
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

// ============================================================================
// FormSwitch
// ============================================================================

export type FormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ThemedSwitchProps, 'value' | 'onValueChange'> & {
  name: TName;
  control?: Control<TFieldValues>;
};

/**
 * FormSwitch - Switch with form validation
 *
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
