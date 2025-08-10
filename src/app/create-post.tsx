import React, { useState } from 'react';
import { TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { ModalWrapper } from '@/components/layout';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedText } from '@/components/themed/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const borderColor = useThemeColor('border');

  const hasContent = title.trim() || content.trim();
  const canPublish = title.trim() && content.trim();

  const handleCancel = () => {
    if (hasContent) {
      Alert.alert(
        'Discard Post?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const handlePublish = () => {
    if (!canPublish) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }
    Alert.alert('Success', 'Post published successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ModalWrapper
      headerTitle="Create Post"
      headerLeft={{
        variant: 'cancel',
        onPress: handleCancel,
      }}
      headerRight={{
        variant: 'save',
        text: 'Publish',
        disabled: !canPublish,
        onPress: handlePublish,
      }}
      scrollable={false}
    >
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ThemedText style={{ marginBottom: 12, fontWeight: '600' }}>Title</ThemedText>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: borderColor,
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            marginBottom: 20,
          }}
          placeholder="Enter post title..."
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        <ThemedText style={{ marginBottom: 12, fontWeight: '600' }}>Content</ThemedText>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: borderColor,
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            minHeight: 200,
            textAlignVertical: 'top',
            flex: 1,
          }}
          placeholder="Share your thoughts..."
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={500}
        />

        <ThemedView
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <ThemedText style={{ opacity: 0.6 }}>{content.length}/500</ThemedText>
        </ThemedView>
      </ThemedView>
    </ModalWrapper>
  );
}
