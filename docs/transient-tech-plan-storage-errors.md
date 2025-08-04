# 临时技术方案：存储服务错误处理

**状态**: 提案中

**目标**: 为 `@/services/storage/**` 引入健壮的、类型化的错误处理机制，以提高系统的可靠性、可调试性和可维护性。

---

## 1. 方案概述

当前存储服务的错误处理依赖于通用的 `try...catch` 块和 `console.error` 日志记录，这导致了几个问题：

- **错误类型不明确**: 调用方无法区分不同类型的失败（例如，序列化错误 vs. I/O 错误）。
- **静默失败**: `SecureStorage` 在加密密钥管理失败时会降级到一个临时的、非持久化的密钥，这是一个严重的、未被上报的失败。
- **行为不一致**: `set` 操作会抛出异常，而 `get` 操作会返回 `null`，使得“未找到”和“读取失败”无法区分。

本方案通过引入一个自定义的、分层的 `StorageError` 类体系来解决这些问题，确保所有存储操作在失败时都抛出可预测的、类型化的错误。

## 2. 错误类型定义

我们将在 `src/services/storage/errors.ts` 中定义以下错误类：

```typescript
// File: src/services/storage/errors.ts

/**
 * 所有存储相关错误的基类。
 * 包含关键的上下文信息，如存储层级、操作和键。
 */
export class StorageError extends Error {
  public readonly tier: 'preferences' | 'cache' | 'secure' | 'temp' | 'manager';
  public readonly operation: string;
  public readonly key?: string;
  public readonly cause?: Error;

  constructor(
    message: string,
    options: {
      tier: 'preferences' | 'cache' | 'secure' | 'temp' | 'manager';
      operation: string;
      key?: string;
      cause?: Error;
    }
  ) {
    super(message);
    this.name = 'StorageError';
    this.tier = options.tier;
    this.operation = options.operation;
    this.key = options.key;
    this.cause = options.cause;
    // 将原始错误的堆栈信息附加到当前错误
    if (options.cause?.stack) {
      this.stack = `${this.stack}
Caused by: ${options.cause.stack}`;
    }
  }
}

/**
 * 在存储服务初始化失败时抛出，通常是由于加密密钥问题。
 */
export class InitializationError extends StorageError {
  constructor(message: string, options: { tier: 'secure' | 'manager'; cause?: Error }) {
    super(message, { ...options, operation: 'initialize' });
    this.name = 'InitializationError';
  }
}

/**
 * 在加密、解密或密钥管理失败时抛出。
 */
export class EncryptionError extends StorageError {
  constructor(
    message: string,
    options: {
      operation: 'key_generation' | 'key_retrieval' | 'encryption' | 'decryption';
      cause?: Error;
    }
  ) {
    super(message, { ...options, tier: 'secure' });
    this.name = 'EncryptionError';
  }
}

/**
 * 在 `JSON.stringify` 序列化数据失败时抛出。
 */
export class SerializationError extends StorageError {
  constructor(key: string, tier: StorageError['tier'], cause: Error) {
    super(`Failed to serialize value for key "${key}" in tier "${tier}".`, {
      tier,
      operation: 'serialize',
      key,
      cause,
    });
    this.name = 'SerializationError';
  }
}

/**
 * 在 `JSON.parse` 反序列化数据失败时抛出，通常表示数据损坏。
 */
export class DeserializationError extends StorageError {
  constructor(key: string, tier: StorageError['tier'], cause: Error) {
    super(
      `Failed to deserialize value for key "${key}" in tier "${tier}". Data may be corrupted.`,
      {
        tier,
        operation: 'deserialize',
        key,
        cause,
      }
    );
    this.name = 'DeserializationError';
  }
}

/**
 * 在底层的原生 MMKV 读写操作失败时抛出。
 */
export class IOError extends StorageError {
  constructor(
    message: string,
    options: { tier: StorageError['tier']; operation: string; key?: string; cause?: Error }
  ) {
    super(message, options);
    this.name = 'IOError';
  }
}
```

## 3. 实施步骤

### 步骤 1: 创建错误定义文件

1.  创建新文件 `src/services/storage/errors.ts`。
2.  将上述错误类定义代码粘贴到该文件中。
3.  在 `src/services/storage/types.ts` 中导出这些新的错误类型，以便在整个模块中访问。

### 步骤 2: 改造 `mmkv-adapter.ts`

- **`set<T>(key: string, value: T): void`**:
  - 修改 `try...catch` 块。
  - 如果 `JSON.stringify` 失败，捕获错误并 `throw new SerializationError(key, this.options.id, error)`。
  - 如果 `this.mmkv.set` 失败，捕获错误并 `throw new IOError(...)`。
- **`get<T>(key: string, defaultValue?: T): T | null`**:
  - 修改 `try...catch` 块。
  - 如果 `this.mmkv.getString` 失败，`throw new IOError(...)`。
  - 如果 `JSON.parse` 失败，`throw new DeserializationError(key, this.options.id, error)`。
  - **重要**: `get` 方法在“键不存在”时将继续返回 `defaultValue` 或 `null`，但在“读取或解析失败”时将抛出异常。

### 步骤 3: 改造 `secure.ts` (关键变更)

- **`getOrCreateEncryptionKey(): Promise<string>`**:
  - **移除静默失败逻辑**: 删除 `try...catch` 块中的降级逻辑（即生成临时 UUID 作为密钥）。
  - **抛出明确错误**:
    - 当 `SecureStore.getItemAsync` 失败时，`throw new EncryptionError({ operation: 'key_retrieval', cause: error })`。
    - 当 `SecureStore.setItemAsync` 失败时，`throw new EncryptionError({ operation: 'key_generation', cause: error })`。
  - 此更改将确保加密密钥管理失败会立即作为严重错误上报，而不是被隐藏。

### 步骤 4: 改造 `manager.ts`

- **`initialize(): Promise<StorageManager>`**:
  - 在 `createInstance` 方法中，用 `try...catch` 包裹对 `SecureStorage.getInstance()` 的调用。
  - 如果捕获到 `EncryptionError`，则将其包装并重新抛出：`throw new InitializationError('Failed to initialize SecureStorage due to key management failure.', { tier: 'manager', cause: error })`。
  - 这确保了应用启动时如果安全存储无法初始化，会抛出一个明确的 `InitializationError`。

### 步骤 5: 应用层处理

- 在应用入口点（例如 `App.tsx` 或类似的启动文件）调用 `initializeStorage()` 的地方，必须实现一个 `try...catch` 块。
- **示例**:

  ```typescript
  import { initializeStorage, InitializationError } from '@/services/storage';

  useEffect(() => {
    const startApp = async () => {
      try {
        await initializeStorage();
        // ... 继续正常的应用启动流程
      } catch (error) {
        if (error instanceof InitializationError) {
          // 关键存储服务失败，无法继续
          console.error('CRITICAL: Storage initialization failed. App cannot run.', error);
          // TODO: 显示一个全局的、阻塞的错误界面
          // e.g., setGlobalErrorState('Storage Error', 'Please restart the app.');
        } else {
          // 处理其他可能的启动错误
          console.error('An unexpected error occurred during app startup.', error);
        }
      }
    };

    startApp();
  }, []);
  ```

## 4. 预期成果

- **健壮性**: 存储失败将不再是静默的，而是以明确的、类型化的错误形式出现。
- **可调试性**: 错误对象将包含丰富的上下文（层级、操作、键、根本原因），极大地方便了调试和日志分析。
- **可维护性**: 调用方可以编写更智能的错误处理逻辑（例如，重试 `IOError`，或在 `DeserializationError` 时清除损坏的数据）。
- **安全性**: 移除了 `SecureStorage` 的危险降级行为，确保加密存储要么正常工作，要么在启动时就明确失败。

---

## 5. 附录: `expo-secure-store` 失败场景及处理策略

本节详细说明了 `expo-secure-store` 可能失败的常见原因以及推荐的应对策略。这些策略是设计 `EncryptionError` 和 `InitializationError` 的核心依据。

| 失败场景                | 核心问题                                                        | 推荐处理策略                                                                                                                                                        |
| :---------------------- | :-------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1. 设备锁定状态**     | 应用在后台尝试访问仅在设备解锁时可用的数据。                    | **预防为主，优雅降级**：使用正确的 `keychainAccessible` 设置（如 `AFTER_FIRST_UNLOCK`）。若后台操作失败，使用 `AppState` 检查应用状态，并推迟到下次应用激活时重试。 |
| **2. 设备安全设置变更** | 用户移除了 PIN/生物识别，导致 Android Keystore 清除密钥。       | **检测并强制重新认证**：在应用启动时捕获 `InitializationError`。清除所有过时/无法解密的安全数据，并强制用户重新登录。                                               |
| **3. 平台特定错误**     | 特定厂商（如三星、小米）的 Android 系统存在 Keystore 实现缺陷。 | **日志、监控与远程配置**：使用 Sentry 等工具记录详细的设备和错误信息。识别出有问题的设备型号后，通过功能开关（Feature Flag）为其优雅地降级或禁用相关功能。          |
| **4. 数据大小限制**     | 尝试在 `SecureStore` 中存储大于几 KB 的数据。                   | **遵循设计原则**：绝不直接存储大块数据。正确模式是：生成一个随机密钥，用它加密大文件（存放在 `expo-file-system` 中），然后仅将这个**加密密钥**存入 `SecureStore`。  |
| **5. 备份至新设备**     | 用户将应用数据从旧设备恢复到新设备。                            | **检测并强制重新认证**：此场景与“安全设置变更”类似。硬件绑定的密钥无法迁移，导致数据无法解密。应捕获初始化失败，清空数据并引导用户重新登录。                        |
| **6. 系统级失败**       | 磁盘空间已满或操作系统不稳定。                                  | **通知用户并请求操作**：捕获错误，记录日志，并向用户显示明确信息，如“系统存储空间不足，请清理后重启应用”。                                                          |

### 策略详解

#### 场景 1: 设备锁定状态

**措施**:

- **预防**: 保存密钥时使用 `keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY`，这通常是最佳平衡点。
- **反应**: 在后台任务中，如果读取失败，检查 `AppState.currentState`。如果应用不在 `'active'` 状态，则应安排在下次激活时重试，而不是立即视为致命错误。

#### 场景 2 & 5: 安全设置变更 / 备份至新设备

**措施**:

- **检测**: 在应用启动时，`StorageManager.initialize()` 会因为无法获取或使用旧密钥而抛出 `InitializationError`。
- **处理**:
  1.  `catch (error)` 块中检查 `error instanceof InitializationError`。
  2.  调用 `storage.secure.clear()` 清理无法解密的数据。
  3.  强制用户导航至登录页面。
  4.  显示友好提示，例如：“为了您的安全，请重新登录。”或“欢迎使用新设备！请登录以同步您的账户。”

#### 场景 3: 平台特定错误

**措施**:

- **集成错误监控**: 使用 Sentry 等服务，并在 `catch` 块中上报错误，附带 `expo-device` 提供的设备信息。
- **分析**: 在监控后台分析错误报告，寻找特定设备型号或系统的规律。
- **降级**: 如果某个非核心功能（例如，保存一个次要的设置到 `secure` 层）在特定设备上持续失败，可以通过远程配置禁用该功能，避免应用崩溃。

#### 场景 4: 数据大小限制

**措施**:

- **架构层面解决**: 这是设计问题，应在代码审查阶段被发现。`SecureStore` 只用于存储密钥和少量敏感字符串。
- **正确实现**:

  ```typescript
  import * as FileSystem from 'expo-file-system';
  import * as Crypto from 'expo-crypto';
  import * as SecureStore from 'expo-secure-store';

  async function saveLargeData(data: object) {
    const encryptionKey = btoa(String.fromCharCode(...(await Crypto.getRandomBytesAsync(32))));
    // Encrypt `JSON.stringify(data)` using `encryptionKey` (pseudo-code)
    const encryptedData = encrypt(JSON.stringify(data), encryptionKey);
    const filePath = FileSystem.documentDirectory + 'large_data.json.enc';
    await FileSystem.writeAsStringAsync(filePath, encryptedData);
    await SecureStore.setItemAsync('large_data_key', encryptionKey);
  }
  ```

#### 场景 6: 系统级失败

**措施**:

- **捕获 `IOError`**: 这种失败很可能会表现为 `IOError`。
- **通知**: 在 `catch` 块中捕获此错误，并向用户显示一个对话框，建议他们检查设备存储空间并尝试重启应用。
