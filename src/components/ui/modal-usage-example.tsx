import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemedButton } from '@/components/themed/themed-button';
import { ThemedText } from '@/components/themed/themed-text';
import { useModal } from '@/hooks/use-modal';

/**
 * Example component showing how to use the global modal system
 *
 * Usage:
 * 1. Import useModal hook
 * 2. Call confirm() or input() functions anywhere
 * 3. Use await to get results
 */
export function ModalUsageExample() {
  const { confirm, input } = useModal();

  const handleConfirmExample = async () => {
    const result = await confirm({
      title: '删除确认',
      message: '确定要删除这个项目吗？这个操作无法撤销。',
      confirmLabel: '删除',
      cancelLabel: '取消',
      isDestructive: true,
    });

    if (result) {
      alert('用户确认删除');
    } else {
      alert('用户取消删除');
    }
  };

  const handleInputExample = async () => {
    const result = await input({
      title: '创建新项目',
      placeholder: '请输入项目名称',
      submitLabel: '创建',
      cancelLabel: '取消',
      initialValue: '',
      validate: (value) => {
        if (value.length < 3) {
          return '项目名称至少需要3个字符';
        }
        if (value.length > 50) {
          return '项目名称不能超过50个字符';
        }
        return null;
      },
      maxLength: 50,
      showCharacterCounter: true,
    });

    if (result) {
      alert(`用户输入: ${result}`);
    } else {
      alert('用户取消输入');
    }
  };

  const handleMultipleModals = async () => {
    // 演示多个弹窗排队
    const promises = [
      confirm({
        title: '第一个确认',
        message: '这是第一个弹窗',
      }),
      confirm({
        title: '第二个确认',
        message: '这是第二个弹窗',
      }),
      input({
        title: '输入框',
        placeholder: '最后一个弹窗',
      }),
    ];

    const results = await Promise.all(promises);
    alert(`结果: ${JSON.stringify(results)}`);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="h4" style={styles.title}>
        全局弹窗系统演示
      </ThemedText>

      <ThemedText style={styles.description}>
        这些按钮演示了如何在任何地方使用全局弹窗系统，无需在组件中声明弹窗组件。
      </ThemedText>

      <View style={styles.buttonContainer}>
        <ThemedButton
          variant="primary"
          label="确认弹窗示例"
          onPress={handleConfirmExample}
          style={styles.button}
        />

        <ThemedButton
          variant="outline"
          label="输入弹窗示例"
          onPress={handleInputExample}
          style={styles.button}
        />

        <ThemedButton
          variant="secondary"
          label="多个弹窗排队"
          onPress={handleMultipleModals}
          style={styles.button}
        />
      </View>

      <View style={styles.codeExample}>
        <ThemedText type="caption" style={styles.codeTitle}>
          代码示例:
        </ThemedText>
        <ThemedText style={styles.code}>
          {`const { confirm, input } = useModal();

// 确认弹窗
const result = await confirm({
  title: '删除确认',
  message: '确定要删除吗？',
  isDestructive: true
});

// 输入弹窗
const text = await input({
  title: '请输入名称',
  placeholder: '输入内容',
  validate: (value) => value.length < 3 ? '至少3个字符' : null
});`}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  button: {
    marginHorizontal: 0,
  },
  codeExample: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 16,
  },
  codeTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  code: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
