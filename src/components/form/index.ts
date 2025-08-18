/**
 * Form components exports
 * @fileoverview Central export point for all form-related components, hooks, and utilities
 */

/**
 * Form Provider component
 * @description Context wrapper for React Hook Form integration
 */
export { FormProvider, type FormProviderProps } from './form-provider';

/**
 * Form Field component
 * @description Generic form field wrapper with validation
 */
export { FormField, type FormFieldProps } from './form-field';

/**
 * Typed Input Components
 * @description Form input components with automatic validation and theming
 */
export {
  FormTextInput,
  FormCheckbox,
  FormRadio,
  FormSwitch,
  type FormTextInputProps,
  type FormCheckboxProps,
  type FormRadioProps,
  type FormSwitchProps,
} from './form-inputs';

/**
 * React Hook Form types
 * @description Re-exported useful types from react-hook-form for convenience
 */
export type {
  UseFormReturn,
  FieldValues,
  FieldPath,
  Control,
  UseFormProps,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';

/**
 * React Hook Form hooks
 * @description Re-exported essential hooks from react-hook-form
 */
export { useForm, useFormContext, useController, useWatch } from 'react-hook-form';

/**
 * Zod integration
 * @description Re-exported Zod library and resolver for form validation
 */
export { z } from 'zod';
export { zodResolver } from '@hookform/resolvers/zod';

/**
 * Form layout components
 * @description Components for structuring form layouts
 */
export { FormGroup, FormRow, type FormGroupProps, type FormRowProps } from './form-layout';

/**
 * Validation schemas
 * @description Re-exported Zod schemas for form validation
 */
export * from './form-schema';
