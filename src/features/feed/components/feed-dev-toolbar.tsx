import React from 'react';
import { StyleSheet, Switch, Modal, Pressable } from 'react-native';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface FeedDebugModalProps {
  visible: boolean;
  onClose: () => void;
  debugEmptyState: boolean;
  debugErrorState: boolean;
  onToggleEmptyState: () => void;
  onToggleErrorState: () => void;
}

interface FeedDebugButtonProps {
  onPress: () => void;
}

export function FeedDebugButton({ onPress }: FeedDebugButtonProps) {
  const tintColor = useThemeColor('tint');

  // Only show in development
  if (!__DEV__) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.debugButton, pressed && { opacity: 0.7 }]}
    >
      <IconSymbol name="gearshape" size={20} color={tintColor} />
    </Pressable>
  );
}

export function FeedDebugModal({
  visible,
  onClose,
  debugEmptyState,
  debugErrorState,
  onToggleEmptyState,
  onToggleErrorState,
}: FeedDebugModalProps) {
  const backgroundColor = useThemeColor('background');
  const modalBackgroundColor = useThemeColor('tint');
  const textColor = useThemeColor('background');
  const switchTrackColor = useThemeColor('background');
  const switchThumbColor = useThemeColor('text');

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <ThemedView style={[styles.modal, { backgroundColor }]}>
          <Pressable>
            <ThemedView style={[styles.modalHeader, { backgroundColor: modalBackgroundColor }]}>
              <ThemedText style={[styles.modalTitle, { color: textColor }]}>
                🛠️ Debug Controls
              </ThemedText>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <IconSymbol name="xmark" size={18} color={textColor} />
              </Pressable>
            </ThemedView>

            <ThemedView style={styles.modalContent}>
              <ThemedView style={styles.control}>
                <ThemedText style={styles.label}>Empty State</ThemedText>
                <Switch
                  value={debugEmptyState}
                  onValueChange={onToggleEmptyState}
                  trackColor={{ false: switchTrackColor, true: modalBackgroundColor }}
                  thumbColor={switchThumbColor}
                  ios_backgroundColor={switchTrackColor}
                />
              </ThemedView>

              <ThemedView style={styles.control}>
                <ThemedText style={styles.label}>Error State</ThemedText>
                <Switch
                  value={debugErrorState}
                  onValueChange={onToggleErrorState}
                  trackColor={{ false: switchTrackColor, true: modalBackgroundColor }}
                  thumbColor={switchThumbColor}
                  ios_backgroundColor={switchTrackColor}
                />
              </ThemedView>
            </ThemedView>
          </Pressable>
        </ThemedView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  debugButton: {
    padding: 8,
    borderRadius: 6,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});
