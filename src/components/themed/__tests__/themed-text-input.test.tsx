import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedTextInput } from '../themed-text-input';

// Mock the useThemeColor hook
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn((props: any, colorName: string) => {
    const mockColors: Record<string, string> = {
      text: '#11181C',
      placeholder: '#8E8E93',
    };
    return props.light || props.dark || mockColors[colorName] || '#000000';
  }),
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
          lightColor="#FF0000"
          darkColor="#00FF00"
          placeholderLightColor="#0000FF"
          placeholderDarkColor="#FFFF00"
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

    render(<ThemedTextInput lightColor="#FF0000" darkColor="#00FF00" placeholder="Test" />);

    expect(mockUseThemeColor).toHaveBeenCalledWith({ light: '#FF0000', dark: '#00FF00' }, 'text');
  });

  it('calls useThemeColor with correct parameters for placeholder color', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockUseThemeColor = require('@/hooks/use-theme-color').useThemeColor;

    render(
      <ThemedTextInput
        placeholderLightColor="#0000FF"
        placeholderDarkColor="#FFFF00"
        placeholder="Test"
      />
    );

    expect(mockUseThemeColor).toHaveBeenCalledWith(
      { light: '#0000FF', dark: '#FFFF00' },
      'placeholder'
    );
  });

  it('calls useThemeColor with default parameters when no colors provided', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockUseThemeColor = require('@/hooks/use-theme-color').useThemeColor;

    render(<ThemedTextInput placeholder="Test" />);

    expect(mockUseThemeColor).toHaveBeenCalledWith({}, 'text');
    expect(mockUseThemeColor).toHaveBeenCalledWith({}, 'placeholder');
  });
});
