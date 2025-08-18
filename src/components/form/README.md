# Form Module

A comprehensive form library built on React Hook Form with TypeScript support and theme integration.

## Quick Start

```tsx
import { FormProvider, FormTextInput, useForm, zodResolver, z } from '@/components/form';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

function MyForm() {
  const methods = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <FormProvider methods={methods}>
      <FormTextInput name="email" label="Email" />
      <FormTextInput name="name" label="Name" />
    </FormProvider>
  );
}
```

## Components

### Core Components

- **FormProvider** - Context wrapper for form state
- **FormField** - Generic field wrapper with validation
- **FormTextInput** - Text input with validation
- **FormCheckbox** - Checkbox with validation
- **FormRadio** - Radio button with validation
- **FormSwitch** - Switch toggle with validation

### Layout Components

- **FormGroup** - Groups related fields with optional title/description
- **FormRow** - Horizontal layout for side-by-side elements

## Features

- **Type-safe** - Full TypeScript support with generic types
- **Theme-aware** - Automatic light/dark mode adaptation
- **Validation** - Built-in Zod schema validation
- **Error handling** - Automatic error display and status
- **Context-aware** - Works with or without FormProvider
- **Pre-built schemas** - Common validation patterns included

## Validation Schemas

Pre-built schemas for common use cases:

```tsx
import { emailSchema, passwordSchema, nameSchema } from '@/components/form';

const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});
```

Available schemas: email, password, phone, name, username, url, age, birthDate, terms acceptance, and more.

## Architecture

- Built on React Hook Form for performance
- Uses Zod for schema validation
- Integrates with themed components
- Supports both controlled and context-based usage
- Graceful fallbacks when context is missing
