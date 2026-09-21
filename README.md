# AI Engineer Quiz

> 北京职工职业技能大赛 · 人工智能工程技术人员竞赛（2026）｜初赛备考
>
> 比赛日期：**2026-09-24（周四）**
>
> 在线地址：https://ai-engineer-quiz.vercel.app

## 项目简介

面向 AI 工程岗位的备考 & 日常刷题站点，包含：

- **理论题库**：300 题（单选 / 多选 / 判断），覆盖 AI 基础、机器学习、深度学习、自然语言处理、计算机视觉、国产芯片与框架
- **代码题库**：6 套样题（数据处理、模型训练、推理部署等）
- **AI 工程基础**：Linux / Python / SQL / Git / 命令行速查
- **模拟考试**：随机抽题 + 倒计时 + 错题回顾
- **个人中心**：收藏、错题本、刷题进度（本地存储）

## 技术栈

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [lucide-react](https://lucide.dev/) 图标
- 静态导出 (`output: 'export'`)，可部署到 Vercel / GitHub Pages / 自托管

## 本地开发

```bash
npm install
npm run dev          # 开发模式 http://localhost:3000
npm run build        # 构建静态产物到 out/
```

## 目录结构

```
code/
├── src/
│   ├── app/                # Next.js App Router 页面
│   ├── components/         # 公共组件
│   ├── data/               # 题库 JSON
│   └── lib/                # 工具函数
├── scripts/                # 题库提取与构建脚本
├── PRD.md                  # 产品需求文档
└── package.json
```

## 数据来源

理论题与代码题源自 2026 年北京市职工职业技能大赛（人工智能工程技术人员）公开题库资料，仅供学习备考使用。

## License

MIT