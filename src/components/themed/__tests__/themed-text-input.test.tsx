import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedTextInput } from '../themed-text-input';

// Mock the useThemeColor hook
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn((colorName: string, props: any) => {
    const mockColors: Record<string, string> = {
      text: '#11181C',
      placeholder: '#8E8E93',
      border: '#D1D1D6',
      backgroundSecondary: '#F2F2F7',
      backgroundTertiary: '#E5E5EA',
    };

    // If props are provided and contain light/dark values, use them
    if (props && typeof props === 'object') {
      if (props.light && props.dark) {
        // Return light color for testing (could be based on mock scheme)
        return props.light;
      }
    }

    return mockColors[colorName] || '#000000';
  }),
}));

// Mock IconSymbol component
jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: ({ name, size, color }: any) => null,
}));

// Mock ThemedText component
jest.mock('../themed-text', () => ({
  ThemedText: ({ children, ...props }: any) => children,
}));

describe('ThemedTextInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => {
      render(<ThemedTextInput placeholder="Enter text" />);
    }).not.toThrow();
  });

  it('renders with value without crashing', () => {
    expect(() => {
      render(<ThemedTextInput value="test value" placeholder="Enter text" />);
    }).not.toThrow();
  });

  it('renders with custom colors without crashing', () => {
    expect(() => {
      render(
        <ThemedTextInput
          textColor={{ light: '#FF0000', dark: '#00FF00' }}
          placeholderColor={{ light: '#0000FF', dark: '#FFFF00' }}
          placeholder="Enter text"
        />
      );
    }).not.toThrow();
  });

  it('forwards all TextInput props without crashing', () => {
    const onChangeText = jest.fn();
    expect(() => {
      render(
        <ThemedTextInput
          placeholder="Test placeholder"
          value="Test value"
          multiline
          numberOfLines={3}
          onChangeText={onChangeText}
          testID="themed-input"
        />
      );
    }).not.toThrow();
  });

  it('calls useThemeColor with correct parameters for text color', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockUseThemeColor = require('@/hooks/use-theme-color').useThemeColor;

    render(
      <ThemedTextInput textColor={{ light: '#FF0000', dark: '#00FF00' }} placeholder="Test" />
    );

    expect(mockUseThemeColor).toHaveBeenCalledWith('text', { light: '#FF0000', dark: '#00FF00' });
  });

  it('calls useThemeColor with correct parameters for placeholder color', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockUseThemeColor = require('@/hooks/use-theme-color').useThemeColor;

    render(
      <ThemedTextInput
        placeholderColor={{ light: '#0000FF', dark: '#FFFF00' }}
        placeholder="Test"
      />
    );

    expect(mockUseThemeColor).toHaveBeenCalledWith('placeholder', {
      light: '#0000FF',
      dark: '#FFFF00',
    });
  });

  it('calls useThemeColor with default parameters when no colors provided', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockUseThemeColor = require('@/hooks/use-theme-color').useThemeColor;

    render(<ThemedTextInput placeholder="Test" />);

    expect(mockUseThemeColor).toHaveBeenCalledWith('text', { light: '#000000', dark: '#FFFFFF' });
    expect(mockUseThemeColor).toHaveBeenCalledWith('placeholder', {
      light: '#8E8E93',
      dark: '#ABABAB',
    });
  });
});
