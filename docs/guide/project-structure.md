# 项目结构

以下是项目的核心目录结构及其职责说明：

```tree
src/
├── api/                # API 接口管理
│   ├── system/         # 系统相关接口
│   │   ├── user.ts     # 用户管理接口
│   │   └── role.ts     # 角色管理接口
│   └── common/         # 通用接口
│       ├── upload.ts   # 文件上传接口
│       └── auth.ts     # 认证相关接口
│
├── components/         # 全局通用组件
│   ├── animate/        # 动画组件
│   │   ├── index.tsx   # 组件入口
│   │   └── types.ts    # 类型定义
│   ├── table/          # 增强表格组件
│   └── layout/         # 布局相关组件
│
├── configs/            # 应用配置
│   ├── theme/          # 主题配置
│   │   ├── light.ts    # 浅色主题
│   │   └── dark.ts     # 深色主题
│   └── settings.ts     # 应用全局设置
│
├── hooks/              # 自定义Hooks
│   ├── usePermission.ts # 权限管理Hook
│   └── useTable.ts     # 表格操作Hook
│
├── layouts/            # 页面布局
│   ├── MainLayout/     # 主布局
│   │   ├── index.tsx
│   │   └── Header.tsx
│   └── AuthLayout/     # 认证相关布局
│
├── pages/              # 页面组件
│   ├── Dashboard/      # 仪表盘页面
│   ├── System/         # 系统管理
│   │   ├── UserManage/
│   │   └── RoleManage/
│   └── Exception/      # 异常页面（404等）
│
├── router/             # 路由配置
│   ├── index.tsx       # 路由定义
│   └── guard.tsx       # 路由守卫
│
├── store/              # 状态管理
│   ├── systemStore.ts  # 系统相关状态
│   └── userStore.ts    # 用户相关状态
│
├── styles/             # 全局样式
│   ├── reset.css       # 样式重置
│   └── variables.css   # CSS变量定义
│
├── types/              # 类型定义
│   ├── api/            # API响应类型
│   └── components/     # 组件Props类型
│
└── utils/              # 工具函数
    ├── auth.ts         # 认证相关工具
    └── request.ts      # 封装axios请求
```

## 关键文件说明

1. **入口文件** `src/main.tsx`
   - 初始化React应用
   - 挂载全局配置
   - 注册错误边界

2. **核心配置** `src/configs/`
   - `theme/`: 主题颜色、间距、字体等设计系统配置
   - `settings.ts`: 功能开关、默认参数等全局设置

3. **路由配置** `src/router/`
   - 路由懒加载配置
   - 权限验证逻辑
   - 页面过渡动画配置

4. **状态管理** `src/store/`
   - 使用Zustand管理全局状态
   - 持久化存储配置
   - 业务状态拆分（用户、系统、UI状态等）

## 开发规范

1. **组件命名**
   - PascalCase命名（如`UserAvatar.tsx`）
   - 目录与主组件同名（如`components/UserAvatar/index.tsx`）

2. **文件结构**
   ```tree
   components/
   └── ComponentName/
       ├── index.tsx     # 组件出口
       ├── types.ts      # 类型定义
       ├── style.css     # 组件样式
       └── SubComponent/ # 子组件目录
   ```

3. **代码分割**
   - 路由级代码分割使用`React.lazy`
   - 组件级分割使用动态导入`import()`

4. **提交规范**
   - feat: 新功能
   - fix: bug修复
   - docs: 文档变更
   - refactor: 代码重构
   - chore: 构建/工具变更
