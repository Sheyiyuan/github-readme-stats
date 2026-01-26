# CI/CD 自动化说明

## 概述

本项目使用 GitHub Actions 自动生成并更新 README 卡片，并部署到 GitHub Pages。

## 工作流程

### 触发条件

1. **定时触发**: 每天北京时间 00:00 (UTC 16:00)
2. **手动触发**: 在 Actions 页面手动运行
3. **代码变更**: 当相关代码提交到 master 分支时

### 生成的卡片

所有卡片配置在 [`.github/cards-config.yml`](.github/cards-config.yml) 中定义，当前包括：

- GitHub Stats (github-stats.svg) - GitHub 统计数据
- Top Languages (top-langs.svg) - 常用编程语言
- Half-Beat-Player (half-beat-player.svg) - 项目卡片，带技术栈徽章
- tuan-chat-web (tuan-chat-web.svg) - 项目卡片，带技术栈徽章
- Anan-s-Sketchbook-Chat-Box (anan-s-sketchbook-chat-box.svg) - 项目卡片
- ShyeriMeme (shyerimeme.svg) - 项目卡片

## 配置要求

### GitHub Secrets

需要在本仓库设置以下密钥：

| Secret 名称 | 说明                         | 获取方式                                           |
| ----------- | ---------------------------- | -------------------------------------------------- |
| `GH_PAT`    | GitHub Personal Access Token | [创建 PAT](https://github.com/settings/tokens/new) |

PAT 权限要求：
- `public_repo` - 读取公开仓库
- `read:user` - 读取用户信息

### 配置文件结构

`.github/cards-config.yml` - 定义所有卡片的生成参数：

```yaml
# 服务器配置
server:
  base_url: http://localhost:9000

# 卡片配置
cards:
  - name: github-stats
    filename: github-stats.svg
    endpoint: /api
    params:
      username: Sheyiyuan
      show_icons: true
      theme: transparent
```

`.github/workflows/generate-readme-cards.yml` - GitHub Actions 工作流：
- 启动本地 API 服务器
- 生成所有配置的卡片
- 部署到 GitHub Pages

## 使用方法

### 手动触发

1. 进入 Actions 页面
2. 选择 "Generate README Cards" workflow
3. 点击 "Run workflow"
4. 等待执行完成

### 查看结果

- 访问 `https://sheyiyuan.github.io/github-readme-stats/` 查看所有卡片
- 在 Actions 标签页查看运行日志
- 检查执行摘要了解生成详情

### 在 README 中使用

```markdown
<!-- 使用 GitHub Pages 链接 -->
![GitHub Stats](https://sheyiyuan.github.io/github-readme-stats/github-stats.svg)
![Top Languages](https://sheyiyuan.github.io/github-readme-stats/top-langs.svg)

<!-- 使用表格布局 -->
<table>
  <tr>
    <td><img src="https://sheyiyuan.github.io/github-readme-stats/github-stats.svg" /></td>
    <td><img src="https://sheyiyuan.github.io/github-readme-stats/top-langs.svg" /></td>
  </tr>
  <tr>
    <td><img src="https://sheyiyuan.github.io/github-readme-stats/half-beat-player.svg" /></td>
    <td><img src="https://sheyiyuan.github.io/github-readme-stats/tuan-chat-web.svg" /></td>
  </tr>
</table>
```

## 自定义配置

### 修改卡片参数

编辑 `.github/cards-config.yml`，修改现有卡片的参数：

```yaml
cards:
  - name: github-stats
    params:
      username: YourUsername  # 修改用户名
      title_color: FF6B6B    # 修改标题颜色
      text_color: 4A5568     # 修改文字颜色
```

提交变更后，工作流会自动使用新配置生成卡片。

### 添加新卡片

在配置文件中添加新的卡片定义：

```yaml
cards:
  - name: my-repo
    filename: my-repo.svg
    endpoint: /api/pin-custom/
    params:
      username: YourUsername
      repo: YourRepo
      tech_stack: React,TypeScript,Node.js
      theme: transparent
```

### 调整定时任务

修改 `.github/workflows/generate-readme-cards.yml` 中的 cron 表达式：

```yaml
on:
  schedule:
    - cron: '0 8 * * *'  # 改为北京时间 16:00 (UTC 8:00)
```

> 注意：定时任务使用 UTC 时间，需要根据时区进行换算。

## 故障排查

### 常见问题

**1. 卡片生成失败**
- 检查 GH_PAT 是否配置正确
- 查看 Actions 日志中的错误信息
- 确认 API 服务器是否正常启动

**2. 卡片内容未更新**
- GitHub API 可能返回缓存数据
- 工作流会自动跳过无变更的提交
- 可以手动触发强制更新

**3. 权限错误**
- 确保 PAT 包含 `public_repo` 和 `read:user` 权限
- 检查 token 是否过期

**4. 定时任务未执行**
- Fork 的仓库默认禁用定时任务
- 需要转为独立仓库或手动启用（参见 README 中的说明）

### 查看日志

进入 Actions → 选择运行记录 → 展开各步骤查看详细输出

## 技术细节

### 工作流程

1. Checkout 仓库代码
2. 安装 Node.js (v22) 和 pnpm (v9)
3. 安装项目依赖
4. 读取 cards-config.yml 配置
5. 启动 Express API 服务器（端口 9000）
6. 循环生成所有配置的卡片
7. 部署到 gh-pages 分支
8. 生成索引页面（index.html）
9. 输出执行摘要

### 使用的 API 端点

- `/api` - GitHub 用户统计信息
- `/api/top-langs/` - 常用编程语言统计
- `/api/pin-custom/` - 自定义项目卡片（支持技术栈徽章）

### 特色功能

- 智能缓存：仅在内容变化时更新
- 自动索引：生成展示所有卡片的网页
- 详细摘要：在 Actions 页面显示执行结果
- 透明背景：卡片支持透明背景适配不同主题

## 相关链接

- [GitHub README Stats 原项目](https://github.com/anuraghazra/github-readme-stats)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [创建 Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [在线预览](https://sheyiyuan.github.io/github-readme-stats/)

## 许可证

基于 [GitHub README Stats](https://github.com/anuraghazra/github-readme-stats) 项目，遵循 MIT 许可证。

