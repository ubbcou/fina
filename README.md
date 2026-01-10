# Fina - 实时财经新闻聚合器 (Financial News Aggregator)

[![Made by AI](https://img.shields.io/badge/Made%20by-AI-lightgrey?style=for-the-badge)](https://github.com/mefengl/made-by-ai)
![Google Gemini](https://img.shields.io/badge/google%20gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)

Fina 是一个强大且直观的实时财经新闻聚合平台。它无缝整合了来自中国领先财经平台的快讯内容，旨在为用户提供一个统一、高效、且无干扰的财经信息获取体验。

![example_1](./docs/example_1.png)

## 🌟 核心特性

- **多源聚合**: 整合来自 **财联社 (CLS)**、**华尔街见闻 (WSCN)**、**金十数据 (Jin10)** 和 **同花顺 (Ths)** 的实时新闻流。
- **实时更新**: 基于高效的 API 轮询机制，确保您在第一时间掌握市场动向。
- **现代化 UI**: 采用 Next.js 15+ 构建，提供丝滑的响应式体验，支持自适应暗色/亮色模式。
- **一键部署**: 内置自定义部署脚本，支持自动化上传及远程服务器（如阿里云）运维管理。

## 🛠️ 技术栈

- **框架**: [Next.js](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: CSS Modules + Vanilla CSS
- **部署**: Node.js SSH/SCP Automation

## 🚀 快速开始

### 1. 环境准备

确保您的本地环境已安装 Node.js 18.x 或更高版本。

### 2. 安装依赖

```bash
npm install
```

### 3. 本地开发

```bash
npm run dev
```
访问 [http://localhost:3000](http://localhost:3000) 即可预览。

### 4. 生产构建

```bash
npm run build
```

## 🌐 自动部署

本项目包含一个自动化部署工具，专门针对私有服务器（如阿里云、腾讯云）进行了优化。

### 配置环境

1. 复制 `.env.example` 并重命名为 `.env`。
2. 填写您的服务器信息：
   ```env
   DEPLOY_SERVER_IP=your_server_ip
   DEPLOY_REMOTE_USER=root
   DEPLOY_REMOTE_PATH=/root/workspace/fina
   DEPLOY_PROJECT_NAME=fina
   DEPLOY_PORT=3000
   ```

### 执行部署

运行以下命令，脚本将自动完成构建、打包、上传、解压及远程服务重启：

```bash
npm run deploy
```

> [!TIP]
> 部署脚本依赖于 SSH 密钥访问。请确保您的 SSH 密钥已添加到远程服务器的 `authorized_keys` 中，或在运行命令时输入密码。

## 📁 项目结构

```text
├── src/
│   ├── app/            # 页面路由与 API
│   ├── lib/api/        # 各财经源数据抓取逻辑 (CLS, Jin10, WSCN, Ths)
│   ├── components/     # UI 组件
│   └── styles/         # 全局及模块样式
├── scripts/
│   └── deploy.js       # 自动化部署脚本
└── public/             # 静态资源
```

## 📄 开源协议

本项目采用 MIT 协议。
