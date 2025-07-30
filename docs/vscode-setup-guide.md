# VS Code 开发环境配置指南

## 概述

本文档详细说明了如何配置 VS Code 以获得最佳的 React Native 开发体验。所有配置都经过精心挑选，确保提供必要功能的同时保持简洁。

## 配置文件结构

```
.vscode/
├── settings.json      # 工作区设置
├── launch.json        # 调试配置
├── extensions.json    # 推荐扩展
├── tasks.json         # 任务配置
└── snippets/          # 代码片段
    ├── typescript.json
    └── typescriptreact.json
```

## 1. 工作区设置 (settings.json)

### 精简版配置（推荐）

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.detectIndentation": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.addMissingImports": "explicit",
    "source.organizeImports": "never"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.tsx": "typescriptreact",
    "*.jsx": "javascriptreact"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.expo": true,
    "**/ios/Pods": true,
    "**/android/build": true,
    "pnpm-lock.yaml": true
  },
  "[json][jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "cSpell.words": ["expo", "asyncstorage", "reanimated", "stylesheet", "statusbar", "pressable"],
  "i18n-ally.localesPaths": ["assets/locales"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.disabled": false
}
```

#### 配置说明

1. **统一使用 Prettier 格式化**：所有文件类型都使用 Prettier 进行格式化，保持一致性
2. **固定缩进设置**：强制使用 2 空格缩进，关闭自动检测，确保团队代码风格一致
3. **自动导入**：保存时自动添加缺失的 import 语句，提高开发效率
4. **ESLint 自动修复**：保存时自动修复可修复的 ESLint 问题
5. **TypeScript 版本控制**：使用项目本地的 TypeScript 版本
6. **性能优化**：排除大型文件夹和 pnpm-lock.yaml 文件，提升搜索和文件监视性能
7. **拼写检查白名单**：添加 React Native 常用术语，避免误报拼写错误
8. **国际化支持**：配置 i18n-ally 插件，支持多语言开发（翻译文件放在 `assets/locales` 目录）

#### 为什么选择 Prettier 而不是 ESLint 格式化？

- **职责分离**：Prettier 专注于代码格式化，ESLint 专注于代码质量检查
- **避免冲突**：统一使用一个格式化工具，避免格式化规则冲突
- **更好的格式化**：Prettier 在处理复杂的格式化场景时更加智能和一致

## 2. 调试方式

### 推荐使用命令行调试

对于 Expo 项目，推荐直接使用命令行进行调试，而不使用 VS Code 的调试配置：

```bash
# 启动开发服务器
pnpm start

# 在 iOS 模拟器中运行
pnpm ios

# 在 Android 设备/模拟器中运行
pnpm android
```

### 为什么选择命令行调试？

1. **简单直接** - Expo 的开发工具已经非常完善
2. **更好的集成** - 与 Expo 开发服务器无缝配合
3. **实时重载** - 代码更改自动反映到设备上
4. **丰富的调试工具** - Expo 提供了网页端的调试界面
5. **设备调试** - 可以直接在真机上调试，支持摇一摇打开调试菜单

### 调试技巧

- **Console 调试**: 使用 `console.log()` 在 Metro 终端查看输出
- **React DevTools**: 在浏览器中使用 React 开发者工具
- **Flipper**: 可选择集成 Flipper 进行更高级的调试
- **真机调试**: 扫描二维码在真实设备上测试

## 3. 推荐扩展 (extensions.json)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "msjsdiag.vscode-react-native",
    "yoavbls.pretty-ts-errors",
    "formulahendry.auto-close-tag",
    "formulahendry.auto-rename-tag",
    "mikestead.dotenv",
    "ms-vscode.vscode-typescript-tsdoc",
    "streetsidesoftware.code-spell-checker",
    "lokalise.i18n-ally"
  ]
}
```

#### 扩展说明

**必需扩展：**

- **ESLint** (`dbaeumer.vscode-eslint`) - 代码质量检查
- **Prettier** (`esbenp.prettier-vscode`) - 代码格式化
- **React Native Tools** (`msjsdiag.vscode-react-native`) - 提供 RN 组件智能提示、代码片段和语法高亮

**强烈推荐：**

- **Pretty TypeScript Errors** (`yoavbls.pretty-ts-errors`) - 让 TypeScript 错误更易读
- **Auto Close Tag** (`formulahendry.auto-close-tag`) - 自动闭合 JSX/HTML 标签
- **Auto Rename Tag** (`formulahendry.auto-rename-tag`) - 自动重命名配对的标签
- **DotENV** (`mikestead.dotenv`) - .env 文件语法高亮
- **TSDoc Comment** (`ms-vscode.vscode-typescript-tsdoc`) - TypeScript 文档注释支持
- **Code Spell Checker** (`streetsidesoftware.code-spell-checker`) - 代码拼写检查
- **i18n Ally** (`lokalise.i18n-ally`) - 国际化开发支持，翻译管理

## 4. 任务配置 (tasks.json)

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Expo",
      "type": "shell",
      "command": "pnpm start",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Run iOS",
      "type": "shell",
      "command": "pnpm ios",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Run Android",
      "type": "shell",
      "command": "pnpm android",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Run Web",
      "type": "shell",
      "command": "pnpm web",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Lint Code",
      "type": "shell",
      "command": "pnpm lint",
      "group": "test",
      "presentation": {
        "reveal": "always"
      },
      "problemMatcher": ["$eslint-stylish"]
    },
    {
      "label": "Type Check",
      "type": "shell",
      "command": "pnpm typecheck",
      "group": "test",
      "presentation": {
        "reveal": "always"
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "Format Code",
      "type": "shell",
      "command": "pnpm format",
      "group": "test",
      "presentation": {
        "reveal": "silent"
      },
      "problemMatcher": []
    }
  ]
}
```

#### 任务说明

**构建任务（Build）：**

- **Start Expo** - 启动 Expo 开发服务器（默认构建任务，可用 Cmd+Shift+B 快速启动）
- **Run iOS** - 在 iOS 模拟器中运行
- **Run Android** - 在 Android 设备/模拟器中运行
- **Run Web** - 在网页浏览器中运行

**测试任务（Test）：**

- **Lint Code** - 运行 ESLint 检查代码质量
- **Type Check** - 运行 TypeScript 类型检查
- **Format Code** - 格式化所有代码文件

#### 使用方法

1. **快捷键方式：**
   - `Cmd+Shift+B`（Mac）/ `Ctrl+Shift+B`（Windows/Linux）- 运行默认构建任务（Start Expo）
   - `Cmd+Shift+P` → 输入 "Tasks: Run Task" 选择其他任务

2. **命令面板方式：**
   - 打开命令面板（`Cmd+Shift+P`）
   - 输入 "Tasks: Run Task"
   - 选择要运行的任务

3. **终端集成：**
   - 任务会在 VS Code 集成终端中运行
   - 支持问题匹配器，错误会在问题面板中显示

## 5. 代码片段示例

### TypeScript React 组件片段 (typescriptreact.json)

```json
{
  "React Native Functional Component": {
    "prefix": "rnfc",
    "body": [
      "import React from 'react';",
      "import { View, Text, StyleSheet } from 'react-native';",
      "",
      "interface ${1:ComponentName}Props {",
      "  ${2:// props}",
      "}",
      "",
      "export function ${1:ComponentName}({ ${3:props} }: ${1:ComponentName}Props) {",
      "  return (",
      "    <View style={styles.container}>",
      "      <Text>${1:ComponentName}</Text>",
      "    </View>",
      "  );",
      "}",
      "",
      "const styles = StyleSheet.create({",
      "  container: {",
      "    flex: 1,",
      "  },",
      "});"
    ],
    "description": "Create a React Native functional component with TypeScript"
  },

  "Themed Component": {
    "prefix": "rnthemed",
    "body": [
      "import React from 'react';",
      "import { StyleSheet } from 'react-native';",
      "import { ThemedView } from '@/components/themed-view';",
      "import { ThemedText } from '@/components/themed-text';",
      "",
      "interface ${1:ComponentName}Props {",
      "  ${2:// props}",
      "}",
      "",
      "export function ${1:ComponentName}({ ${3:props} }: ${1:ComponentName}Props) {",
      "  return (",
      "    <ThemedView style={styles.container}>",
      "      <ThemedText>${1:ComponentName}</ThemedText>",
      "    </ThemedView>",
      "  );",
      "}",
      "",
      "const styles = StyleSheet.create({",
      "  container: {",
      "    flex: 1,",
      "  },",
      "});"
    ],
    "description": "Create a themed React Native component"
  }
}
```

## 使用指南

### 1. 安装推荐扩展

打开 VS Code 后，会自动提示安装推荐扩展。或者手动安装：

1. 打开命令面板 (Cmd+Shift+P)
2. 输入 "Extensions: Show Recommended Extensions"
3. 安装所有推荐的扩展

### 2. 使用调试功能

1. 在代码中设置断点
2. 打开调试面板 (Cmd+Shift+D)
3. 选择合适的调试配置（iOS/Android/Expo）
4. 点击开始调试

### 3. 使用任务运行器

1. 打开命令面板 (Cmd+Shift+P)
2. 输入 "Tasks: Run Task"
3. 选择需要运行的任务

快捷键：

- Cmd+Shift+B: 运行默认构建任务（Start Metro）

### 4. 使用代码片段

在 `.tsx` 文件中：

- 输入 `rnfc` 创建函数组件
- 输入 `rnthemed` 创建主题组件

## 故障排除

### ESLint 不工作

1. 确保已安装 ESLint 扩展
2. 重启 VS Code
3. 检查输出面板的 ESLint 日志

### TypeScript 错误

1. 确保使用工作区的 TypeScript 版本
2. 重启 TypeScript 服务器 (Cmd+Shift+P > "TypeScript: Restart TS Server")

### 调试器无法连接

1. 确保 Metro 服务器正在运行
2. 检查端口 8081 是否被占用
3. 清理缓存并重新启动：`npx expo start -c`

## 最佳实践

1. **保持配置精简**：只添加真正需要的配置
2. **使用工作区设置**：将项目特定配置放在 `.vscode/settings.json`
3. **定期更新扩展**：保持扩展最新以获得最佳体验
4. **使用格式化**：依赖自动格式化保持代码一致性
5. **充分利用 IntelliSense**：使用 TypeScript 获得更好的代码提示

## 参考资源

- [VS Code React Native Tools](https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native)
- [VS Code ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [VS Code Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Expo VS Code Guide](https://docs.expo.dev/workflow/vscode/)
