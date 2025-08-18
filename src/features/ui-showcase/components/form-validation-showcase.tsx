import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedButton } from '@/components/themed/themed-button';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  FormProvider,
  FormTextInput,
  FormCheckbox,
  FormRadio,
  FormSwitch,
  useForm,
  zodResolver,
} from '@/components/form';
import { Controller } from 'react-hook-form';
import { ThemedCheckbox } from '@/components/themed';
import { loginSchema, signUpSchema, profileSchema, z } from '@/schemas';

/**
 * Form Validation Showcase
 *
 * Demonstrates React Hook Form + Zod integration with themed components
 * across different form types and validation scenarios.
 */
export function FormValidationShowcase() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'login', title: 'Login' },
    { key: 'signup', title: 'Signup' },
    { key: 'profile', title: 'Profile' },
    { key: 'advanced', title: 'Advanced' },
  ]);

  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const borderColor = useThemeColor('border');

  const renderScene = SceneMap({
    login: LoginFormExample,
    signup: SignUpFormExample,
    profile: ProfileFormExample,
    advanced: AdvancedFormExample,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={[styles.indicator, { backgroundColor: primaryColor }]}
      style={[styles.tabBar, { backgroundColor, borderBottomColor: borderColor }]}
      labelStyle={[styles.tabLabel, { color: textColor }]}
      activeColor={primaryColor}
      inactiveColor={textColor}
      pressColor={primaryColor + '20'}
      scrollEnabled={true}
      tabStyle={styles.tabStyle}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={true}
        lazy={true}
        lazyPreloadDistance={1}
      />
    </ThemedView>
  );
}

// ============================================================================
// Login Form Example
// ============================================================================

function LoginFormExample() {
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = (data: any) => {
    Alert.alert('Login Form Submitted', JSON.stringify(data, null, 2));
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <FormProvider methods={methods}>
        <View style={styles.formContainer}>
          <ThemedText type="h6" weight="semibold" style={styles.formTitle}>
            Login Form
          </ThemedText>

          <FormTextInput
            name="email"
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <FormTextInput
            name="password"
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            showPasswordToggle
            autoComplete="current-password"
          />

          <Controller
            name="rememberMe"
            control={methods.control}
            render={({ field: { onChange, value } }) => (
              <ThemedCheckbox value={!!value} onValueChange={onChange} label="Remember me" />
            )}
          />

          <ThemedButton
            label="Sign In"
            isLoading={methods.formState.isSubmitting}
            onPress={methods.handleSubmit(onSubmit)}
            fullWidth
            style={styles.submitButton}
          />

          <FormStateDisplay formState={methods.formState} />
        </View>
      </FormProvider>
    </ScrollView>
  );
}

// ============================================================================
// Sign Up Form Example
// ============================================================================

function SignUpFormExample() {
  const methods = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      subscribeNewsletter: false,
    },
  });

  const onSubmit = (data: any) => {
    Alert.alert('Sign Up Form Submitted', JSON.stringify(data, null, 2));
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <FormProvider methods={methods}>
        <View style={styles.formContainer}>
          <ThemedText type="h6" weight="semibold" style={styles.formTitle}>
            Sign Up Form
          </ThemedText>

          <View style={styles.rowContainer}>
            <FormTextInput
              name="firstName"
              label="First Name"
              placeholder="John"
              containerStyle={styles.halfWidth}
            />
            <FormTextInput
              name="lastName"
              label="Last Name"
              placeholder="Doe"
              containerStyle={styles.halfWidth}
            />
          </View>

          <FormTextInput
            name="username"
            label="Username"
            placeholder="johndoe"
            autoCapitalize="none"
          />

          <FormTextInput
            name="email"
            label="Email"
            placeholder="john@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <FormTextInput
            name="password"
            label="Password"
            placeholder="Enter a strong password"
            secureTextEntry
            showPasswordToggle
            helperText="Must contain uppercase, lowercase, number, and special character"
          />

          <FormTextInput
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            secureTextEntry
            showPasswordToggle
          />

          <FormCheckbox name="acceptTerms" label="I accept the terms and conditions" />

          <FormCheckbox name="subscribeNewsletter" label="Subscribe to newsletter (optional)" />

          <ThemedButton
            label="Create Account"
            isLoading={methods.formState.isSubmitting}
            onPress={methods.handleSubmit(onSubmit)}
            fullWidth
            style={styles.submitButton}
          />

          <FormStateDisplay formState={methods.formState} />
        </View>
      </FormProvider>
    </ScrollView>
  );
}

// ============================================================================
// Profile Form Example
// ============================================================================

function ProfileFormExample() {
  const methods = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '',
      bio: '',
      location: '',
      website: '',
    },
  });

  const onSubmit = (data: any) => {
    Alert.alert('Profile Form Submitted', JSON.stringify(data, null, 2));
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <FormProvider methods={methods}>
        <View style={styles.formContainer}>
          <ThemedText type="h6" weight="semibold" style={styles.formTitle}>
            Profile Form
          </ThemedText>

          <View style={styles.rowContainer}>
            <FormTextInput name="firstName" label="First Name" containerStyle={styles.halfWidth} />
            <FormTextInput name="lastName" label="Last Name" containerStyle={styles.halfWidth} />
          </View>

          <FormTextInput
            name="email"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormTextInput
            name="phone"
            label="Phone (Optional)"
            placeholder="+1 (555) 123-4567"
            keyboardType="phone-pad"
          />

          <FormTextInput
            name="bio"
            label="Bio (Optional)"
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />

          <FormTextInput name="location" label="Location (Optional)" placeholder="New York, NY" />

          <FormTextInput
            name="website"
            label="Website (Optional)"
            placeholder="https://example.com"
            keyboardType="url"
            autoCapitalize="none"
          />

          <ThemedButton
            label="Update Profile"
            isLoading={methods.formState.isSubmitting}
            onPress={methods.handleSubmit(onSubmit)}
            fullWidth
            style={styles.submitButton}
          />

          <FormStateDisplay formState={methods.formState} />
        </View>
      </FormProvider>
    </ScrollView>
  );
}

// ============================================================================
// Advanced Form Example
// ============================================================================

function AdvancedFormExample() {
  const advancedSchema = signUpSchema.extend({
    plan: z.enum(['basic', 'premium', 'enterprise']),
    notifications: z.boolean(),
    marketingEmails: z.boolean().optional(),
  });

  const methods = useForm({
    resolver: zodResolver(advancedSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      subscribeNewsletter: false,
      plan: 'basic',
      notifications: false,
      marketingEmails: false,
    },
  });

  const watchNotifications = methods.watch('notifications');

  const onSubmit = (data: any) => {
    Alert.alert('Advanced Form Submitted', JSON.stringify(data, null, 2));
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <FormProvider methods={methods}>
        <View style={styles.formContainer}>
          <ThemedText type="h6" weight="semibold" style={styles.formTitle}>
            Advanced Form Features
          </ThemedText>

          <ThemedText type="body2" weight="medium" style={styles.sectionTitle}>
            Plan Selection
          </ThemedText>

          <View style={styles.radioGroup}>
            <FormRadio name="plan" value="basic" label="Basic Plan ($0/month)" />
            <FormRadio name="plan" value="premium" label="Premium Plan ($10/month)" />
            <FormRadio name="plan" value="enterprise" label="Enterprise Plan ($50/month)" />
          </View>

          <ThemedText type="body2" weight="medium" style={styles.sectionTitle}>
            Notification Settings
          </ThemedText>

          <FormSwitch name="notifications" />
          <ThemedText type="caption" style={styles.switchLabel}>
            Enable push notifications
          </ThemedText>

          {/* Conditional field based on notifications toggle */}
          {watchNotifications && (
            <FormCheckbox name="marketingEmails" label="Receive marketing emails" />
          )}

          <ThemedButton
            label="Save Preferences"
            isLoading={methods.formState.isSubmitting}
            onPress={methods.handleSubmit(onSubmit)}
            fullWidth
            style={styles.submitButton}
          />

          <FormStateDisplay formState={methods.formState} />
        </View>
      </FormProvider>
    </ScrollView>
  );
}

// ============================================================================
// Form State Display Component
// ============================================================================

function FormStateDisplay({ formState }: { formState: any }) {
  const hasErrors = Object.keys(formState.errors).length > 0;

  return (
    <View style={styles.formStateContainer}>
      <ThemedText type="caption" weight="medium" style={styles.formStateTitle}>
        Form State:
      </ThemedText>
      <ThemedText type="caption" variant={formState.isValid ? 'success' : 'muted'}>
        Valid: {formState.isValid ? 'Yes' : 'No'}
      </ThemedText>
      <ThemedText type="caption" variant="muted">
        Dirty: {formState.isDirty ? 'Yes' : 'No'}
      </ThemedText>
      <ThemedText type="caption" variant="muted">
        Touched: {Object.keys(formState.touchedFields).length} fields
      </ThemedText>
      {hasErrors && (
        <ThemedText type="caption" variant="error">
          Errors: {Object.keys(formState.errors).length}
        </ThemedText>
      )}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
  },
  tabStyle: {
    width: 'auto',
    minWidth: 80,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  indicator: {
    height: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  formContainer: {
    gap: 16,
  },
  formTitle: {
    marginBottom: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 8,
  },
  formStateContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    gap: 4,
  },
  formStateTitle: {
    marginBottom: 4,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  radioGroup: {
    gap: 8,
    marginBottom: 16,
  },
  switchLabel: {
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
});
