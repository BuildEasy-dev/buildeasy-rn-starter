# Drawer 通用组件指南

这份文档介绍了新的通用 Drawer 布局组件，它们与业务逻辑解耦，可以在任何项目中重复使用。

## 🧩 组件架构

### 三段式布局组件

```
┌─────────────────────────┐
│     DrawerHeader        │  ← 固定头部（用户信息）
├─────────────────────────┤
│                         │
│     DrawerContent       │  ← 可滚动内容（导航菜单）
│     (Navigation Items)  │
│                         │
├─────────────────────────┤
│     DrawerFooter        │  ← 固定底部（设置/退出）
└─────────────────────────┘
```

## 📋 组件详解

### 1. DrawerHeader - 通用头部组件

**特性**：

- 头像显示（支持在线状态指示）
- 三级文本信息（标题/副标题/说明）
- 背景自定义（颜色/图片）
- 可选操作按钮
- 点击交互支持

**基础用法**：

```tsx
import { DrawerHeader } from '@/components/layout';

<DrawerHeader
  avatar={{ uri: 'https://example.com/avatar.jpg' }}
  title="John Doe"
  subtitle="john.doe@example.com"
  caption="Premium Member"
  showOnlineStatus
  isOnline={true}
  actionIcon="pencil"
  onActionPress={() => console.log('Edit profile')}
  onPress={() => console.log('Go to profile')}
/>;
```

**高级配置**：

```tsx
<DrawerHeader
  avatar={{ uri: 'https://example.com/avatar.jpg' }}
  title="Sarah Wilson"
  subtitle="sarah@company.com"
  caption="Team Lead - Design"
  backgroundColor="#6366F1"
  backgroundImage={require('@/assets/header-bg.jpg')}
  showOnlineStatus
  isOnline={true}
  actionIcon="gear"
  onActionPress={() => router.push('/settings')}
  height={140}
  paddingVertical={24}
/>
```

### 2. DrawerFooter - 通用底部组件

**特性**：

- 多种操作类型（按钮/开关/文本）
- 版本信息显示
- 破坏性操作样式
- 主题适配

**基础用法**：

```tsx
import { DrawerFooter } from '@/components/layout';

<DrawerFooter
  actions={[
    {
      id: 'logout',
      label: 'Sign Out',
      icon: 'arrow.right.square',
      type: 'button',
      destructive: true,
      onPress: handleLogout,
    },
  ]}
  version="v1.0.0"
  copyright="© 2024 Your Company"
/>;
```

**多操作配置**：

```tsx
<DrawerFooter
  actions={[
    {
      id: 'theme',
      label: 'Dark Mode',
      icon: 'moon',
      type: 'switch',
      value: isDarkMode,
      onValueChange: setDarkMode,
    },
    {
      id: 'notifications',
      label: 'Push Notifications',
      icon: 'bell',
      type: 'switch',
      value: notificationsEnabled,
      onValueChange: setNotificationsEnabled,
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: 'questionmark.circle',
      type: 'button',
      onPress: () => router.push('/help'),
    },
    {
      id: 'logout',
      label: 'Sign Out',
      icon: 'arrow.right.square',
      type: 'button',
      destructive: true,
      onPress: handleLogout,
    },
  ]}
  version="v2.1.0"
  copyright="© 2024 BuildEasy"
  showBorder={true}
  backgroundColor="#F8F9FA"
/>
```

### 3. DrawerContent - 重构的内容组件

**新特性**：

- 支持 `headerProps` 和 `footerProps` 使用通用组件
- 保持向后兼容（支持 `header` 和 `footer` 自定义组件）
- 更好的类型安全

**使用通用组件**：

```tsx
import { DrawerContent } from '@/components/layout';

<DrawerContent
  {...props}
  headerProps={{
    avatar: { uri: user.avatar },
    title: user.name,
    subtitle: user.email,
    caption: user.role,
    showOnlineStatus: true,
    isOnline: user.isOnline,
  }}
  footerProps={{
    actions: footerActions,
    version: 'v1.0.0',
  }}
  sections={drawerSections}
/>;
```

**向后兼容模式**：

```tsx
<DrawerContent
  {...props}
  header={<CustomHeaderComponent />}
  footer={<CustomFooterComponent />}
  sections={drawerSections}
/>
```

## 🎨 样式定制

### 主题集成

所有组件都自动集成主题系统：

```tsx
// 自动适配明/暗模式
const textColor = useThemeColor('text');
const backgroundColor = useThemeColor('background');
const tintColor = useThemeColor('tint');
```

### 自定义样式

```tsx
<DrawerHeader
  backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  height={160}
  paddingVertical={32}
/>

<DrawerFooter
  backgroundColor="#1F2937"
  paddingVertical={24}
  showBorder={false}
/>
```

## 📱 响应式适配

### 移动端优化

```tsx
<DrawerHeader
  height={Platform.select({ ios: 120, android: 110 })}
  paddingVertical={Platform.select({ ios: 20, android: 16 })}
/>
```

### 平板端适配

```tsx
<DrawerContent
  headerProps={{
    ...headerConfig,
    height: Platform.isPad ? 160 : 120,
  }}
  footerProps={{
    ...footerConfig,
    paddingVertical: Platform.isPad ? 32 : 20,
  }}
/>
```

## 🔄 完整示例

### 企业级 Drawer 配置

```tsx
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawerContent, createDrawerOptions } from '@/components/layout';

export default function CorporateDrawerLayout() {
  const [settings, setSettings] = React.useState({
    darkMode: false,
    notifications: true,
    autoSync: true,
  });

  const user = {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'Product Manager',
    avatar: 'https://example.com/avatar.jpg',
    isOnline: true,
  };

  const handleLogout = async () => {
    // 处理登出逻辑
    await authService.logout();
    router.replace('/login');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={createDrawerOptions({
          position: 'left',
          width: 320,
          headerShown: false,
        })}
        drawerContent={(props) => (
          <DrawerContent
            {...props}
            headerProps={{
              avatar: { uri: user.avatar },
              title: user.name,
              subtitle: user.email,
              caption: user.role,
              backgroundColor: '#1F2937',
              showOnlineStatus: true,
              isOnline: user.isOnline,
              actionIcon: 'person.circle',
              onActionPress: () => router.push('/profile'),
              onPress: () => router.push('/profile'),
            }}
            footerProps={{
              actions: [
                {
                  id: 'theme',
                  label: 'Dark Mode',
                  icon: 'moon',
                  type: 'switch',
                  value: settings.darkMode,
                  onValueChange: (value) => setSettings((prev) => ({ ...prev, darkMode: value })),
                },
                {
                  id: 'notifications',
                  label: 'Notifications',
                  icon: 'bell',
                  type: 'switch',
                  value: settings.notifications,
                  onValueChange: (value) =>
                    setSettings((prev) => ({ ...prev, notifications: value })),
                },
                {
                  id: 'help',
                  label: 'Help Center',
                  icon: 'questionmark.circle',
                  type: 'button',
                  onPress: () => router.push('/help'),
                },
                {
                  id: 'logout',
                  label: 'Sign Out',
                  icon: 'arrow.right.square',
                  type: 'button',
                  destructive: true,
                  onPress: handleLogout,
                },
              ],
              version: `v${Constants.expoConfig?.version}`,
              copyright: '© 2024 Your Company',
            }}
            sections={[
              {
                key: 'main',
                title: 'Main',
                routes: ['dashboard', 'projects', 'team'],
              },
              {
                key: 'tools',
                title: 'Tools',
                routes: ['analytics', 'reports', 'settings'],
              },
              {
                key: 'account',
                title: 'Account',
                routes: ['profile', 'billing', 'security'],
              },
            ]}
          />
        )}
      >
        {/* 你的屏幕配置 */}
      </Drawer>
    </GestureHandlerRootView>
  );
}
```

## ✨ 优势

### 1. **业务解耦**

- 组件与具体业务逻辑分离
- 可以在不同项目中重复使用
- 易于维护和更新

### 2. **类型安全**

- 完整的 TypeScript 类型定义
- 编译时错误检查
- IntelliSense 自动补全

### 3. **主题集成**

- 自动适配明/暗模式
- 与项目主题系统无缝集成
- 一致的视觉体验

### 4. **灵活配置**

- 丰富的配置选项
- 支持自定义样式
- 响应式布局支持

### 5. **向后兼容**

- 保持现有 API 的兼容性
- 渐进式升级路径
- 降低迁移成本

这样的设计让 Drawer 组件更加通用和可维护，同时为不同的应用场景提供了灵活的配置选项。
