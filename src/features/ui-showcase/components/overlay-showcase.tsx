import { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemedButton } from '@/components/themed/themed-button';
import { ThemedOverlay } from '@/components/themed/themed-overlay';
import { ThemedSelectionOverlay } from '@/components/themed/themed-selection-overlay';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { ConfirmOverlay } from '@/components/ui/confirm-overlay';
import { ActionSheetOverlay } from '@/components/ui/action-sheet-overlay';

/**
 * Overlay Component Showcase
 * Demonstrates different variants and sizes of ThemedOverlay component
 */
export const OverlayShowcase = () => {
  const [basicOverlayVisible, setBasicOverlayVisible] = useState(false);
  const [customOverlayVisible, setCustomOverlayVisible] = useState(false);
  const [noCloseOverlayVisible, setNoCloseOverlayVisible] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [topNotificationVisible, setTopNotificationVisible] = useState(false);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [sizeDemoVisible, setSizeDemoVisible] = useState<{
    variant: 'center';
    size: 'small' | 'medium' | 'large';
  } | null>(null);
  const [selectionVisible, setSelectionVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('option1');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [destructiveConfirmVisible, setDestructiveConfirmVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [actionSheetSectionsVisible, setActionSheetSectionsVisible] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.section}>
        <ThemedText type="h6" style={styles.firstSubTitle}>
          Basic Usage
        </ThemedText>
        <ThemedButton
          onPress={() => setBasicOverlayVisible(true)}
          label="Show Basic Overlay"
          variant="primary"
          size="medium"
        />

        <ThemedOverlay visible={basicOverlayVisible} onClose={() => setBasicOverlayVisible(false)}>
          <ThemedText type="h5" style={styles.overlayTitle}>
            Basic Overlay
          </ThemedText>
          <ThemedText style={styles.overlayContent}>
            This is a simple overlay example. Click the background to close.
          </ThemedText>
          <ThemedButton
            onPress={() => setBasicOverlayVisible(false)}
            label="Close"
            variant="primary"
            size="medium"
            style={styles.overlayButton}
          />
        </ThemedOverlay>
      </View>

      <View style={styles.section}>
        <ThemedText type="h6" style={styles.subTitle}>
          Custom Style
        </ThemedText>
        <ThemedButton
          onPress={() => setCustomOverlayVisible(true)}
          label="Show Custom Overlay"
          variant="primary"
          size="medium"
        />

        <ThemedOverlay
          visible={customOverlayVisible}
          onClose={() => setCustomOverlayVisible(false)}
          lightColor="#f8f9fa"
          darkColor="#2d3748"
          backdropOpacity={0.7}
          animationDuration={500}
          contentContainerStyle={styles.customContent}
        >
          <ThemedText type="h5" style={styles.customOverlayTitle}>
            Custom Overlay
          </ThemedText>
          <ThemedText style={styles.overlayContent}>
            This overlay uses custom background colors, opacity, and animation duration.
          </ThemedText>
          <ThemedButton
            onPress={() => setCustomOverlayVisible(false)}
            label="Close"
            variant="primary"
            size="medium"
            style={styles.overlayButton}
          />
        </ThemedOverlay>
      </View>

      <View style={styles.section}>
        <ThemedText type="h6" style={styles.subTitle}>
          Disabled Backdrop Close
        </ThemedText>
        <ThemedButton
          onPress={() => setNoCloseOverlayVisible(true)}
          label="Show Forced Action Overlay"
          variant="primary"
          size="medium"
        />

        <ThemedOverlay
          visible={noCloseOverlayVisible}
          onClose={() => setNoCloseOverlayVisible(false)}
          closeOnBackdropPress={false}
        >
          <ThemedText type="h5" style={styles.overlayTitle}>
            Forced Action Overlay
          </ThemedText>
          <ThemedText style={styles.overlayContent}>
            This overlay has disabled backdrop press closing. You must use the button to close it.
          </ThemedText>
          <ThemedButton
            onPress={() => setNoCloseOverlayVisible(false)}
            label="Confirm and Close"
            variant="primary"
            size="medium"
            style={styles.overlayButton}
          />
        </ThemedOverlay>
      </View>

      {/* Variant Examples */}
      <View style={styles.section}>
        <ThemedText type="h6" style={styles.subTitle}>
          Overlay Variants
        </ThemedText>

        <View style={styles.buttonRow}>
          <ThemedButton
            onPress={() => setBottomSheetVisible(true)}
            label="Bottom Sheet"
            variant="secondary"
            size="small"
            style={styles.variantButton}
          />
          <ThemedButton
            onPress={() => setTopNotificationVisible(true)}
            label="Top Notification"
            variant="secondary"
            size="small"
            style={styles.variantButton}
          />
        </View>

        <View style={styles.buttonRow}>
          <ThemedButton
            onPress={() => setFullscreenVisible(true)}
            label="Fullscreen"
            variant="secondary"
            size="small"
            style={styles.variantButton}
          />
          <ThemedButton
            onPress={() => setAlertVisible(true)}
            label="Alert Dialog"
            variant="danger"
            size="small"
            style={styles.variantButton}
          />
        </View>

        {/* Bottom Sheet */}
        <ThemedOverlay
          visible={bottomSheetVisible}
          onClose={() => setBottomSheetVisible(false)}
          variant="bottom"
          animationSpeed="fast"
        >
          <ThemedText type="h5" style={styles.sheetTitle}>
            Bottom Sheet
          </ThemedText>
          <ThemedText style={styles.overlayContent}>
            This is a bottom sheet overlay that slides up from the bottom. Perfect for action sheets
            and mobile-friendly menus.
          </ThemedText>
          <View style={styles.buttonRow}>
            <ThemedButton
              onPress={() => setBottomSheetVisible(false)}
              label="Action 1"
              variant="outline"
              size="medium"
              style={styles.sheetButton}
            />
            <ThemedButton
              onPress={() => setBottomSheetVisible(false)}
              label="Action 2"
              variant="outline"
              size="medium"
              style={styles.sheetButton}
            />
          </View>
          <ThemedButton
            onPress={() => setBottomSheetVisible(false)}
            label="Close"
            variant="primary"
            size="medium"
            style={styles.overlayButton}
          />
        </ThemedOverlay>

        {/* Top Notification */}
        <ThemedOverlay
          visible={topNotificationVisible}
          onClose={() => setTopNotificationVisible(false)}
          variant="top"
          animationSpeed="fast"
          backdropOpacity={0.3}
        >
          <ThemedText type="h6" style={styles.notificationTitle}>
            🔔 Notification
          </ThemedText>
          <ThemedText style={styles.notificationContent}>
            This is a top notification overlay. Great for alerts and status messages.
          </ThemedText>
          <ThemedButton
            onPress={() => setTopNotificationVisible(false)}
            label="Dismiss"
            variant="ghost"
            size="small"
            style={styles.notificationButton}
          />
        </ThemedOverlay>

        {/* Fullscreen Modal */}
        <ThemedOverlay
          visible={fullscreenVisible}
          onClose={() => setFullscreenVisible(false)}
          variant="fullscreen"
          animationSpeed="normal"
        >
          <View style={styles.fullscreenContent}>
            <View style={styles.fullscreenHeader}>
              <ThemedText type="h4" style={styles.fullscreenTitle}>
                Fullscreen Modal
              </ThemedText>
              <ThemedButton
                onPress={() => setFullscreenVisible(false)}
                label="✕"
                variant="ghost"
                size="small"
                style={styles.closeButton}
              />
            </View>
            <View style={styles.fullscreenBody}>
              <ThemedText style={styles.fullscreenText}>
                This is a fullscreen overlay perfect for detailed views, forms, or immersive
                content. It takes up the entire screen and provides a dedicated space for complex
                interactions.
              </ThemedText>
              <ThemedText style={styles.fullscreenText}>
                You can add any content here including forms, lists, images, or other complex
                components.
              </ThemedText>
            </View>
            <View style={styles.fullscreenFooter}>
              <ThemedButton
                onPress={() => setFullscreenVisible(false)}
                label="Cancel"
                variant="outline"
                size="large"
                style={styles.fullscreenButton}
              />
              <ThemedButton
                onPress={() => setFullscreenVisible(false)}
                label="Save"
                variant="primary"
                size="large"
                style={styles.fullscreenButton}
              />
            </View>
          </View>
        </ThemedOverlay>

        {/* Alert Dialog */}
        <ThemedOverlay
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
          variant="alert"
          size="small"
          animationSpeed="fast"
          closeOnBackdropPress={false}
        >
          <ThemedText type="h6" style={styles.alertTitle}>
            ⚠️ Confirm Action
          </ThemedText>
          <ThemedText style={styles.alertContent}>
            Are you sure you want to delete this item? This action cannot be undone.
          </ThemedText>
          <View style={styles.alertButtons}>
            <ThemedButton
              onPress={() => setAlertVisible(false)}
              label="Cancel"
              variant="outline"
              size="medium"
              style={styles.alertButton}
            />
            <ThemedButton
              onPress={() => setAlertVisible(false)}
              label="Delete"
              variant="danger"
              size="medium"
              style={styles.alertButton}
            />
          </View>
        </ThemedOverlay>
      </View>

      {/* Size Examples */}
      <View style={styles.section}>
        <ThemedText type="h6" style={styles.subTitle}>
          Size Variants
        </ThemedText>

        <View style={styles.buttonRow}>
          <ThemedButton
            onPress={() => setSizeDemoVisible({ variant: 'center', size: 'small' })}
            label="Small"
            variant="outline"
            size="small"
            style={styles.variantButton}
          />
          <ThemedButton
            onPress={() => setSizeDemoVisible({ variant: 'center', size: 'medium' })}
            label="Medium"
            variant="outline"
            size="small"
            style={styles.variantButton}
          />
        </View>

        <ThemedButton
          onPress={() => setSizeDemoVisible({ variant: 'center', size: 'large' })}
          label="Large Size Modal"
          variant="outline"
          size="medium"
          style={styles.fullWidthButton}
        />

        {/* Size Demo Overlay */}
        <ThemedOverlay
          visible={!!sizeDemoVisible}
          onClose={() => setSizeDemoVisible(null)}
          variant={sizeDemoVisible?.variant || 'center'}
          size={sizeDemoVisible?.size || 'medium'}
        >
          <ThemedText type="h5" style={styles.overlayTitle}>
            {sizeDemoVisible?.size?.toUpperCase()} Size
          </ThemedText>
          <ThemedText style={styles.overlayContent}>
            This overlay demonstrates the &apos;{sizeDemoVisible?.size}&apos; size variant.
            Different sizes offer different padding and width constraints.
          </ThemedText>
          <ThemedButton
            onPress={() => setSizeDemoVisible(null)}
            label="Close"
            variant="primary"
            size="medium"
            style={styles.overlayButton}
          />
        </ThemedOverlay>
      </View>

      {/* Selection Overlay Example */}
      <View style={styles.section}>
        <ThemedText type="h6" style={styles.subTitle}>
          Selection Overlay
        </ThemedText>
        <ThemedButton
          onPress={() => setSelectionVisible(true)}
          label={`Selected: ${selectedValue}`}
          variant="outline"
          size="medium"
          style={styles.fullWidthButton}
        />

        <ThemedSelectionOverlay
          visible={selectionVisible}
          onClose={() => setSelectionVisible(false)}
          title="Choose an Option"
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
            { value: 'option4', label: 'Option 4' },
          ]}
          selectedValue={selectedValue}
          onSelect={(value) => {
            setSelectedValue(value);
            setSelectionVisible(false);
          }}
        />
      </View>

      {/* Confirm Overlay Examples */}
      <View style={styles.section}>
        <ThemedText type="h6" style={styles.subTitle}>
          Confirm Overlay
        </ThemedText>
        <View style={styles.buttonRow}>
          <ThemedButton
            onPress={() => setConfirmVisible(true)}
            label="Normal Confirm"
            variant="primary"
            size="medium"
            style={styles.variantButton}
          />
          <ThemedButton
            onPress={() => setDestructiveConfirmVisible(true)}
            label="Delete Confirm"
            variant="danger"
            size="medium"
            style={styles.variantButton}
          />
        </View>

        {/* Normal Confirmation */}
        <ConfirmOverlay
          visible={confirmVisible}
          onClose={() => setConfirmVisible(false)}
          onConfirm={() => {
            alert('Action confirmed!');
          }}
          title="Confirm Action"
          message="Are you sure you want to proceed with this action?"
          confirmLabel="Proceed"
          cancelLabel="Cancel"
        />

        {/* Destructive Confirmation */}
        <ConfirmOverlay
          visible={destructiveConfirmVisible}
          onClose={() => setDestructiveConfirmVisible(false)}
          onConfirm={() => {
            alert('Item deleted!');
          }}
          title="Delete Item"
          message="Are you sure you want to delete this item? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Keep"
          isDestructive={true}
        />
      </View>

      {/* Action Sheet Overlay Examples */}
      <View style={styles.section}>
        <ThemedText type="h6" style={styles.subTitle}>
          Action Sheet Overlay
        </ThemedText>
        <View style={styles.buttonRow}>
          <ThemedButton
            onPress={() => setActionSheetVisible(true)}
            label="Basic Actions"
            variant="primary"
            size="medium"
            style={styles.variantButton}
          />
          <ThemedButton
            onPress={() => setActionSheetSectionsVisible(true)}
            label="With Subtitle"
            variant="secondary"
            size="medium"
            style={styles.variantButton}
          />
        </View>

        {/* Basic Action Sheet */}
        <ActionSheetOverlay
          visible={actionSheetVisible}
          onClose={() => setActionSheetVisible(false)}
          onAction={(actionId) => {
            alert(`Selected action: ${actionId}`);
          }}
          title="Choose an Action"
          actions={[
            { id: 'edit', label: 'Edit', icon: 'pencil' },
            { id: 'share', label: 'Share', icon: 'square.and.arrow.up' },
            { id: 'copy', label: 'Copy Link', icon: 'doc' },
            { id: 'download', label: 'Download', icon: 'square.and.arrow.down' },
            { id: 'delete', label: 'Delete', icon: 'trash', isDestructive: true },
          ]}
        />

        {/* Action Sheet with Subtitles */}
        <ActionSheetOverlay
          visible={actionSheetSectionsVisible}
          onClose={() => setActionSheetSectionsVisible(false)}
          onAction={(actionId) => {
            alert(`Selected action: ${actionId}`);
          }}
          title="File Options"
          subtitle="Select what you'd like to do with this file"
          actions={[
            { id: 'rename', label: 'Rename', icon: 'pencil', subtitle: 'Change the file name' },
            {
              id: 'move',
              label: 'Move to Folder',
              icon: 'folder',
              subtitle: 'Organize your files',
            },
            { id: 'duplicate', label: 'Duplicate', icon: 'doc' },
            { id: 'share-link', label: 'Share Link', icon: 'square.and.arrow.up' },
            { id: 'export', label: 'Export', icon: 'square.and.arrow.down' },
            { id: 'archive', label: 'Archive', icon: 'archivebox' },
            { id: 'delete', label: 'Delete Permanently', icon: 'trash', isDestructive: true },
          ]}
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  firstSubTitle: {
    marginTop: 0,
    marginBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  subTitle: {
    marginBottom: 12,
  },
  overlayTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  overlayContent: {
    marginBottom: 8,
    textAlign: 'center',
  },
  overlayButton: {
    marginTop: 16,
  },
  customContent: {
    borderRadius: 16,
    padding: 24,
    minWidth: '85%',
  },
  customOverlayTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  // Variant styles
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  variantButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  fullWidthButton: {
    marginBottom: 8,
  },
  // Bottom sheet styles
  sheetTitle: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sheetButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  // Top notification styles
  notificationTitle: {
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  notificationContent: {
    marginBottom: 12,
    textAlign: 'center',
  },
  notificationButton: {
    alignSelf: 'center',
  },
  // Fullscreen styles
  fullscreenContent: {
    flex: 1,
    padding: 20,
  },
  fullscreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
  },
  fullscreenTitle: {
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
  },
  fullscreenBody: {
    flex: 1,
    justifyContent: 'center',
  },
  fullscreenText: {
    marginBottom: 16,
    lineHeight: 24,
  },
  fullscreenFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  fullscreenButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  // Alert styles
  alertTitle: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  alertContent: {
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  alertButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alertButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
