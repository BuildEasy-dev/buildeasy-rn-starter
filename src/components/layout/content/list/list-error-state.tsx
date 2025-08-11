import React from 'react';
import { ViewStyle } from 'react-native';
import { ErrorState } from '@/components/layout/common';

export interface ListErrorStateProps {
  error?: Error | string | null;
  message?: string;
  onRetry?: () => void;
  containerStyle?: ViewStyle;
}

/**
 * List-specific error state component.
 * Wraps the common ErrorState with list-optimized defaults.
 */
export function ListErrorState({ error, message, onRetry, containerStyle }: ListErrorStateProps) {
  return (
    <ErrorState
      error={error}
      message={message}
      onRetry={onRetry}
      fullScreen={false}
      containerStyle={containerStyle}
    />
  );
}
