# 快速开始

## 环境准备

- Node.js 16.x 或更高版本
- npm 或 pnpm

## 安装

```bash
# 克隆仓库
git clone https://github.com/zhaozhongwenzzw/blog-nest-react.git

# 进入项目目录
cd blog-nest-react

# 安装依赖
pnpm install
```

## 开发

```bash
# 启动开发服务器
pnpm dev
```

启动后，打开浏览器访问开发服务器显示的地址（默认为本地开发环境）。

## 构建

```bash
# 构建生产环境版本
pnpm build
```

## 项目配置

主要配置文件位于 `src/configs` 目录下，包括：

- `theme` - 主题配置
- `configProvider` - 全局应用配置

可以根据需要修改这些配置文件来定制应用的外观和行为。 