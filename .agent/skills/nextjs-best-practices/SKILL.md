---
name: nextjs-best-practices
description: Next.js 项目开发的最佳实践。在开发 Next.js 应用时使用，确保遵循框架的最佳实践和性能优化。
---

# Next.js 最佳实践技能

## 使用场景

- 创建新的 Next.js 组件或页面
- 优化 Next.js 应用性能
- 配置 Next.js 项目
- 使用 Next.js 特定功能

## 核心原则

### 1. 图片优化

- **使用 `next/image`**: 永远使用 Next.js 的 Image 组件而不是 `<img>` 标签

  ```tsx
  import Image from "next/image";

  <Image
    src="/path/to/image.jpg"
    alt="描述"
    width={500}
    height={300}
    priority // 对于首屏图片
  />;
  ```

- **优先级**: 首屏图片使用 `priority` 属性
- **响应式**: 使用 `fill` 和 `sizes` 属性实现响应式图片

### 2. 字体优化

- 使用 `next/font` 加载字体

  ```tsx
  import { Inter } from "next/font/google";

  const inter = Inter({ subsets: ["latin"] });
  ```

### 3. 元数据和 SEO

- 使用 Metadata API 设置页面元数据
  ```tsx
  export const metadata = {
    title: "页面标题",
    description: "页面描述",
  };
  ```

### 4. 数据获取

- **服务端组件**: 默认使用服务端组件获取数据
- **客户端组件**: 只在需要交互时使用 `'use client'`
- **缓存策略**: 合理使用 `revalidate` 和 `cache` 选项

### 5. 路由

- 使用 App Router（推荐）而不是 Pages Router
- 利用文件系统路由
- 使用 `loading.tsx` 和 `error.tsx` 处理加载和错误状态

### 6. 性能优化

- **代码分割**: 使用动态导入 `next/dynamic`
  ```tsx
  const DynamicComponent = dynamic(() => import("./Component"), {
    loading: () => <p>Loading...</p>,
  });
  ```
- **避免客户端 JavaScript**: 尽可能使用服务端组件
- **优化包大小**: 检查和优化依赖

### 7. 环境变量

- 使用 `.env.local` 存储敏感信息
- 公开变量使用 `NEXT_PUBLIC_` 前缀
- 不要将 `.env.local` 提交到版本控制

## 常见陷阱

### ❌ 避免

```tsx
// 不要在服务端组件中使用浏览器 API
const Component = () => {
  const url = window.location.href; // ❌ 错误
  return <div>{url}</div>;
};
```

### ✅ 正确做法

```tsx
"use client"; // 标记为客户端组件

const Component = () => {
  const url = window.location.href; // ✅ 正确
  return <div>{url}</div>;
};
```

## 检查清单

- [ ] 图片使用 `next/image`
- [ ] 字体使用 `next/font`
- [ ] 设置了适当的元数据
- [ ] 区分了服务端和客户端组件
- [ ] 环境变量正确配置
- [ ] 使用了适当的缓存策略
