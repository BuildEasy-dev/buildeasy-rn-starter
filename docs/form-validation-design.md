# Form Validation Design

## Overview

Integration of React Hook Form with Zod validation for type-safe, performant form handling in React Native.

## Architecture

### Core Stack

- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **@hookform/resolvers** - Bridge between RHF and Zod
- **Existing themed components** - UI layer (unchanged)

### Key Design Principles

1. **Zero Breaking Changes** - Existing components remain untouched
2. **Progressive Adoption** - Forms can be migrated incrementally
3. **Type Safety** - Full TypeScript inference from schema to UI
4. **Performance First** - Leverage existing memo optimizations

## Component Integration

### Compatibility Matrix

| Component       | RHF Compatibility | Required Props           | Notes               |
| --------------- | ----------------- | ------------------------ | ------------------- |
| ThemedTextInput | ✅ Full           | ref, value, onChangeText | Native error states |
| ThemedCheckbox  | ✅ Full           | value, onValueChange     | Boolean handling    |
| ThemedRadio     | ✅ Full           | value, onValueChange     | Group support       |
| ThemedSwitch    | ✅ Full           | value, onValueChange     | Toggle states       |
| ThemedButton    | ✅ Full           | onPress, isLoading       | Submit handling     |

### Integration Pattern

```tsx
// Wrapper approach - no component modifications needed
<Controller
  name="email"
  control={control}
  render={({ field, fieldState }) => (
    <ThemedTextInput
      {...field}
      status={fieldState.error ? 'error' : 'default'}
      helperText={fieldState.error?.message}
    />
  )}
/>
```

## Project Structure

```
src/
  components/
    form/
      ├── form-provider.tsx    # Context wrapper
      ├── form-field.tsx        # Generic field wrapper
      ├── typed-inputs.tsx      # Type-safe input components
      └── index.ts
    themed/                     # Existing components (unchanged)
  schemas/
    ├── common.schema.ts        # Shared validation rules
    └── [feature].schema.ts     # Feature-specific schemas
  hooks/
    └── use-form.ts            # Custom form hooks
```

## Implementation Strategy

### Phase 1: Foundation

- Install dependencies
- Create form wrapper components
- Establish schema patterns

### Phase 2: Migration

- Start with authentication forms
- Move to settings/profile forms
- Complex forms last (multi-step, dynamic)

### Phase 3: Enhancement

- Custom validation rules
- Field arrays for dynamic forms
- Conditional validation logic

## Validation Patterns

### Schema Definition

```tsx
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number().min(18).optional(),
});
```

### Form Usage

```tsx
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onBlur', // Optimize for mobile
});
```

## Performance Considerations

### Optimizations

- **Lazy validation** - Validate on blur, not on every keystroke
- **Memoized components** - Already implemented in themed components
- **Controlled updates** - RHF minimizes re-renders
- **Async validation** - Debounce API checks

### Mobile-Specific

- **Keyboard handling** - Maintain keyboard state during validation
- **Focus management** - Proper field navigation
- **Error display** - Non-blocking error messages

## Error Handling

### Display Strategy

1. **Inline errors** - Use existing `helperText` prop
2. **Field status** - Leverage `status` prop for visual feedback
3. **Summary errors** - Optional form-level error display

### User Experience

- Show errors on blur, not during typing
- Clear errors on valid input
- Preserve form data on navigation

## Type Safety

### End-to-End Types

```tsx
// Schema defines the shape
type FormData = z.infer<typeof schema>;

// Components receive typed data
const onSubmit = (data: FormData) => {
  // data is fully typed
};
```

## Migration Guide

### Before (Manual Validation)

```tsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const validate = () => {
  if (!email.includes('@')) {
    setError('Invalid email');
    return false;
  }
  return true;
};
```

### After (RHF + Zod)

```tsx
const form = useForm({
  resolver: zodResolver(schema),
});

// Validation is automatic
<FormTextInput name="email" control={form.control} />;
```

## Benefits Summary

### Developer Experience

- **Type inference** - No manual type definitions
- **Declarative validation** - Schema as single source of truth
- **Minimal boilerplate** - Wrapper components handle integration

### User Experience

- **Fast validation** - No UI blocking
- **Consistent errors** - Unified error handling
- **Accessible** - Built-in ARIA attributes

### Maintenance

- **Centralized schemas** - Easy to update validation rules
- **Testable** - Schemas can be unit tested
- **Reusable** - Share validation across platforms

## Showcase Design

### Purpose

Demonstrate form validation capabilities through interactive examples that developers can test and reference.

### Structure

```
src/features/ui-showcase/components/form-validation-showcase.tsx  # Main showcase component
app/(drawer)/form-validation.tsx                                  # Navigation entry point
```

### Implementation Files

#### Core Showcase Component

```tsx
// src/features/ui-showcase/components/form-validation-showcase.tsx
export function FormValidationShowcase() {
  // Multiple form examples with tabs
}
```

#### Navigation Entry

```tsx
// app/(drawer)/form-validation.tsx
import { FormValidationShowcase } from '@/features/ui-showcase/components/form-validation-showcase';

export default function FormValidationScreen() {
  return <FormValidationShowcase />;
}
```

#### Drawer Integration

The form validation screen will be accessible through the drawer navigation menu, alongside other showcase examples. The drawer entry will be added to the existing drawer layout configuration.

### Showcase Components

#### 1. Basic Forms

- **Login Form** - Email/password with validation
- **Sign Up Form** - Multi-field validation with password strength
- **Contact Form** - Text areas, optional fields

#### 2. Advanced Patterns

- **Multi-Step Form** - Wizard with step validation
- **Dynamic Fields** - Add/remove fields with array validation
- **Conditional Logic** - Show/hide fields based on values

#### 3. Input Types Gallery

- Text inputs with various keyboards
- Checkboxes and radio groups
- Switches with dependent validation
- Date/time pickers with range validation

#### 4. Validation Scenarios

- **Async Validation** - Username availability check
- **Cross-Field Validation** - Password confirmation
- **Custom Rules** - Business logic validation
- **File Upload** - Size and type validation

### Interactive Features

#### Live Validation Display

```tsx
<ValidationPanel>
  - Schema visualization - Real-time error states - Form data preview - Submission results
</ValidationPanel>
```

#### Configuration Options

- Toggle validation modes (onChange/onBlur/onSubmit)
- Switch between error display styles
- Enable/disable animations
- Test with different locales

### Code Examples

Each showcase includes:

1. **View Code** - Expandable code snippets
2. **Copy Schema** - One-click schema copying
3. **API Reference** - Links to relevant docs
4. **Best Practices** - Contextual tips

### User Testing Features

#### Stress Testing

- Long forms with 20+ fields
- Rapid input changes
- Network latency simulation
- Large data validation

#### Accessibility Testing

- Screen reader announcements
- Keyboard navigation
- Focus management
- Error announcement

### Visual Design

#### Layout

- Split view: Form | Validation State
- Tabbed sections for different examples
- Sticky navigation for quick access
- Mobile-responsive design

#### Theming

- Light/dark mode examples
- Custom theme validation states
- Error color customization
- Success state animations

## Conclusion

The integration of React Hook Form + Zod with existing themed components provides a robust, type-safe form solution without requiring any changes to the current component library. The wrapper approach ensures backward compatibility while delivering modern form handling capabilities. The showcase implementation will serve as both a testing ground and a comprehensive reference for developers.
