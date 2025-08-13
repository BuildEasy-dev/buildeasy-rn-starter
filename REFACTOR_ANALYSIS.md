# Feed & Photos 功能复用代码分析

## 概述

对 `src/features/feed/` 和 `src/features/photos/` 进行了深度分析，识别出大量可复用的公共代码模式。

## 已完成

- ✅ 创建 `src/utils/` 通用工具目录
- ✅ 实现时间工具函数 (`src/utils/time.ts`)

## 发现的可复用模式

### 1. 用户信息接口 🔄

**当前状态**: 重复定义

- **Feed**: `author` 字段 - `{name, username, avatar?, verified?}`
- **Photos**: `user` 字段 - `{id, username, name, avatar?, verified?}`

**建议**: 创建统一的 `User` 接口

```typescript
interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  verified?: boolean;
}
```

### 2. 统计数据接口 🔄

**当前状态**: 类似但不一致

- **Feed**: `{likes, reposts, replies, views?}`
- **Photos**: `{likes, comments, shares?}`

**建议**: 创建灵活的 `PostStats` 接口

```typescript
interface PostStats {
  likes: number;
  comments?: number;
  reposts?: number;
  replies?: number;
  shares?: number;
  views?: number;
}
```

### 3. Feed状态管理Hook 🔄

**当前状态**: 高度相似的状态管理逻辑

- 两个hooks都管理: `posts[], loading, error, refreshing, hasMore`
- 相同的分页加载模式
- 相同的刷新逻辑

**建议**: 创建通用 `useFeedState<T>` Hook

### 4. 乐观更新模式 🔄

**当前状态**: 完全相同的实现模式

- 立即更新UI状态
- API调用失败时回滚
- 相同的错误处理逻辑

**建议**: 抽取 `optimisticUpdate()` 工具函数

### 5. API模拟逻辑 🔄

**当前状态**: 重复的延迟模拟

- `setTimeout(resolve, 1500)` - 数据加载延迟
- `setTimeout(resolve, 200)` - 交互操作延迟

**建议**: 创建 `simulateApiCall()` 工具函数

### 6. 时间戳处理 ✅

**状态**: 已完成

- 创建了 `src/utils/time.ts` 工具函数
- 包含相对时间、日期格式化等功能

## 推荐的重构步骤

### Phase 1: 核心接口统一

1. 创建 `src/types/common.ts` - 通用接口定义
2. 定义统一的 User, PostStats 接口
3. 更新两个功能使用新接口

### Phase 2: 状态管理抽象

1. 创建 `src/hooks/use-feed-state.ts` - 通用Feed状态管理
2. 实现泛型 `useFeedState<T>` Hook
3. 重构两个功能使用通用Hook

### Phase 3: API工具抽象

1. 创建 `src/utils/api.ts` - API模拟工具
2. 创建 `src/utils/optimistic-updates.ts` - 乐观更新工具
3. 重构现有API调用使用新工具

### Phase 4: 组件层面优化

1. 识别可复用的UI组件模式
2. 抽取通用交互组件
3. 统一样式和行为

## 预期收益

- **代码减少**: 预计减少 40-50% 重复代码
- **一致性**: 统一的用户体验和API行为
- **可维护性**: 修改一处即可影响所有功能
- **可扩展性**: 新功能可快速复用现有模式
- **类型安全**: TypeScript类型复用减少错误

## 风险评估

- **低风险**: 接口统一和工具函数抽取
- **中风险**: Hook重构需要仔细测试状态逻辑
- **建议**: 逐步重构，每阶段充分测试

## 下一步行动

建议从 Phase 1 开始，逐步实施重构计划。每个阶段完成后进行充分测试再进入下一阶段。
