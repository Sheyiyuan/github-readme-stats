# CI/CD 自动化说明

## 📋 概述

本项目使用 GitHub Actions 自动生成并更新 README 卡片到 [Sheyiyuan/Sheyiyuan](https://github.com/Sheyiyuan/Sheyiyuan) 仓库。

## 🎯 工作流程

### 触发条件

1. **定时触发**: 每天北京时间 00:00 (UTC 16:00)
2. **手动触发**: 在 Actions 页面手动运行
3. **代码变更**: 当相关代码提交到 master 分支时

### 生成的卡片

1. **GitHub Stats** (`github-stats.svg`)
   - 显示用户的 GitHub 统计数据
   - 包含 stars、commits、PRs 等

2. **Top Languages** (`top-langs.svg`)
   - 显示最常用的编程语言
   - 紧凑布局，最多6种语言

3. **Half-Beat-Player** (`half-beat-player.svg`)
   - 项目仓库卡片
   - **带技术栈徽章**: Wails, Go, Vue, TypeScript

4. **tuan-chat-web** (`tuan-chat-web.svg`)
   - 项目仓库卡片
   - **带技术栈徽章**: React, TypeScript, Vite

## ⚙️ 配置要求

### GitHub Secrets

在 **Sheyiyuan/Sheyiyuan** 仓库设置以下 secrets：

| Secret 名称 | 说明                         | 获取方式                                           |
| ----------- | ---------------------------- | -------------------------------------------------- |
| `GH_PAT`    | GitHub Personal Access Token | [创建 PAT](https://github.com/settings/tokens/new) |

**PAT 权限要求**:
- `repo` (完整权限) - 访问仓库
- `workflow` - 触发 workflows

### 目录结构

Sheyiyuan 仓库需要包含以下目录：

```
Sheyiyuan/
├── assets/
│   └── cards/
│       ├── github-stats.svg
│       ├── top-langs.svg
│       ├── half-beat-player.svg
│       └── tuan-chat-web.svg
└── README.md
```

## 🔧 配置文件

### `.github/cards-config.yml`

定义所有卡片的生成参数：

```yaml
# 卡片配置示例
cards:
  - name: github-stats
    filename: github-stats.svg
    endpoint: /api
    params:
      username: Sheyiyuan
      show_icons: true
      theme: transparent
```

完整配置参见 [`.github/cards-config.yml`](.github/cards-config.yml)

### Workflow 文件

- **位置**: `.github/workflows/generate-readme-cards.yml`
- **功能**: 
  - 启动本地 API 服务器
  - 生成所有配置的卡片
  - 检测变更并提交
  - 创建 Release 保存历史

## 🚀 使用方法

### 1. 手动触发

进入 Actions 页面 → 选择 "Generate README Cards" → 点击 "Run workflow"

### 2. 查看执行结果

- 在 Actions 标签页查看运行日志
- 检查 Sheyiyuan 仓库的 assets/cards/ 目录
- 查看 Releases 页面的历史版本

### 3. 在 README 中使用

```markdown
<!-- 使用本地文件 -->
![GitHub Stats](assets/cards/github-stats.svg)
![Top Languages](assets/cards/top-langs.svg)

<!-- 或使用表格布局 -->
<table>
  <tr>
    <td><img src="assets/cards/github-stats.svg" /></td>
    <td><img src="assets/cards/top-langs.svg" /></td>
  </tr>
  <tr>
    <td><img src="assets/cards/half-beat-player.svg" /></td>
    <td><img src="assets/cards/tuan-chat-web.svg" /></td>
  </tr>
</table>
```

## 📝 自定义配置

### 修改卡片参数

编辑 `.github/cards-config.yml`，然后提交变更。工作流会自动使用新配置。

### 添加新卡片

在配置文件中添加新的卡片定义：

```yaml
cards:
  - name: my-new-card
    filename: my-new-card.svg
    endpoint: /api/pin-custom/
    params:
      username: YourUsername
      repo: YourRepo
      tech_stack: Tech1,Tech2,Tech3
```

### 调整定时任务

修改 `.github/workflows/generate-readme-cards.yml` 中的 cron 表达式：

```yaml
on:
  schedule:
    - cron: '0 8 * * *'  # 改为北京时间 16:00 (UTC 8:00)
```

## 🔍 故障排查

### 常见问题

1. **卡片生成失败**
   - 检查 GH_PAT 是否配置正确
   - 查看 Actions 日志中的错误信息
   - 确认 API 服务器是否正常启动

2. **卡片内容未更新**
   - GitHub API 可能返回相同数据
   - 工作流会自动跳过无变更的提交

3. **权限错误**
   - 确保 PAT 包含 `repo` 和 `workflow` 权限
   - 检查目标仓库是否可访问

### 查看详细日志

进入 Actions → 选择失败的运行 → 展开各个步骤查看输出

## 📊 Release 说明

每次成功更新卡片后，会自动创建一个 Release：

- **标签格式**: `cards-YYYYMMDD-HHMMSS`
- **标题**: `README Cards - YYYYMMDD-HHMMSS`
- **附件**: 所有生成的 SVG 文件

这允许你追踪卡片的历史变化，或者回滚到之前的版本。

## 🛠️ 技术细节

### 工作流程

1. Checkout 两个仓库（stats-repo 和 target-repo）
2. 安装 Node.js 和 pnpm
3. 安装依赖
4. 启动 Express API 服务器
5. 调用 API 生成 SVG 文件
6. 检测变更
7. 提交到目标仓库
8. 创建 Release（如有变更）
9. 生成执行摘要

### 使用的 API

- `/api` - GitHub Stats
- `/api/top-langs/` - Top Languages
- `/api/pin-custom/` - **自定义项目卡片**（支持技术栈徽章）

### 特色功能

- **智能缓存**: 仅在内容变化时更新
- **增量提交**: 使用 `[skip ci]` 避免循环触发
- **详细摘要**: 在 Actions 页面显示执行结果
- **历史追踪**: Release 保存每次更新的版本

## 📚 相关链接

- [GitHub README Stats](https://github.com/anuraghazra/github-readme-stats)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [创建 PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

## 📄 许可证

本 CI/CD 配置基于 [GitHub README Stats](https://github.com/anuraghazra/github-readme-stats) 项目，遵循 MIT 许可证。
