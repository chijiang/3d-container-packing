# 📦 3D 集装箱装箱可视化系统

一个基于 Next.js 和 React Three Fiber 的智能集装箱装箱方案展示系统，可以美观地将各种尺寸的货物在集装箱内的堆放方案以 3D 形式呈现出来。

## ✨ 功能特性

- 🎨 **3D 可视化** - 使用 React Three Fiber 实现美观的 3D 集装箱渲染
- 📦 **智能装箱** - 基于贪心算法的自动装箱算法，计算最优放置位置
- 🎛️ **交互操作** - 支持旋转、缩放、平移 3D 视图
- 📊 **实时统计** - 显示装箱率、已装箱体积、未装箱货物等统计信息
- 🎯 **自定义货物** - 支持添加自定义尺寸和颜色的货物
- 🏷️ **多规格集装箱** - 支持 20 英尺和 40 英尺标准集装箱
- 🎪 **预设模板** - 提供预设货物尺寸，快速添加常用货物

## 🛠️ 技术栈

- **Next.js 14+** - React 框架（App Router）
- **TypeScript** - 类型安全
- **React Three Fiber** - React 的 Three.js 渲染器
- **@react-three/drei** - Three.js 的实用组件库
- **Three.js** - 3D 图形库
- **Tailwind CSS** - 样式框架

## 📦 安装

### 环境要求

- Node.js 18.x 或更高版本
- pnpm（推荐）、npm 或 yarn

### 克隆或下载项目

```bash
cd ~/clawd/projects/3d-container-packing
```

### 安装依赖

```bash
pnpm install
# 或
npm install
# 或
yarn install
```

## 🚀 快速开始

### 启动开发服务器

```bash
pnpm dev
# 或
npm run dev
# 或
yarn dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
pnpm build
# 或
npm run build
# 或
yarn build
```

### 运行生产版本

```bash
pnpm start
# 或
npm start
# 或
yarn start
```

## 📖 使用说明

### 基本流程

1. **选择集装箱**
   - 在左侧面板选择 20 英尺或 40 英尺集装箱

2. **添加货物**
   - 使用"添加货物"表单输入货物信息
   - 或点击"添加示例"快速加载预设货物
   - 可以自定义货物名称、尺寸和颜色

3. **自动装箱**
   - 点击"🚀 自动装箱"按钮
   - 系统会自动计算最优的货物摆放方案
   - 3D 视图会实时展示装箱结果

4. **查看统计**
   - 右侧面板显示装箱统计信息
   - 包括：已装箱数量、体积、空间利用率等

### 3D 视图操作

- **旋转** - 按住鼠标左键拖动
- **缩放** - 使用鼠标滚轮
- **平移** - 按住鼠标右键拖动

## 🏗️ 项目结构

```
3d-container-packing/
├── app/
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 主页面
├── components/
│   ├── BoxItem.tsx         # 单个货物 3D 渲染组件
│   ├── Container3D.tsx      # 集装箱 3D 渲染组件
│   ├── CargoForm.tsx        # 货物添加表单
│   └── StatsPanel.tsx       # 统计信息面板
├── lib/
│   └── packingAlgorithm.ts  # 装箱算法实现
├── types.ts                # TypeScript 类型定义
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 装箱算法说明

本项目使用简化的 3D 装箱算法：

- **算法类型**：贪心算法
- **排序策略**：按体积从大到小排序
- **旋转优化**：尝试 6 种旋转方向，选择最优位置
- **冲突检测**：确保货物之间不重叠

> 注意：这是一个基础实现，可用于演示和简单场景。复杂的生产环境可能需要更高级的算法。

## 📝 开发说明

### 添加新功能

1. 编辑 `components/` 目录下的组件文件
2. 在 `types.ts` 中添加新类型定义
3. 在 `lib/packingAlgorithm.ts` 中扩展装箱逻辑
4. 在 `app/page.tsx` 中整合新组件

### 代码风格

- 使用 TypeScript 进行类型定义
- 遵循 React 函数组件和 Hooks 最佳实践
- 使用 Tailwind CSS 进行样式开发

## 🐛 常见问题

### Q: 3D 视图无法加载？
A: 确保浏览器支持 WebGL，并检查网络连接（Three.js 可能需要加载外部资源）。

### Q: 装箱率很低？
A: 本项目使用基础贪心算法，对于特殊尺寸的货物可能不是最优解。可以尝试调整货物尺寸或更换更大的集装箱。

### Q: 如何导出装箱方案？
A: 当前版本支持 3D 视图浏览。导出功能可以作为未来扩展添加。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，欢迎联系。

---

**Made with ❤️ using Next.js + React Three Fiber**
