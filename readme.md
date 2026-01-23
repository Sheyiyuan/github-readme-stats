<div align="center">
  <h1>GitHub README 统计卡片</h1>
  <p>在你的 README 中展示动态生成的 GitHub 统计数据！支持自定义排名图标、透明背景、多语言等</p>
</div>

---

## 目录

- [目录](#目录)
- [快速开始](#快速开始)
  - [步骤 1：Fork 本仓库](#步骤-1fork-本仓库)
  - [步骤 2：配置 GitHub Token](#步骤-2配置-github-token)
  - [步骤 3：启用 GitHub Pages](#步骤-3启用-github-pages)
  - [步骤 4：修改配置](#步骤-4修改配置)
  - [步骤 5：触发生成](#步骤-5触发生成)
  - [本地测试（可选）](#本地测试可选)
- [GitHub 统计卡片](#github-统计卡片)
  - [隐藏特定统计数据](#隐藏特定统计数据)
  - [显示图标](#显示图标)
  - [自定义主题](#自定义主题)
  - [自定义选项](#自定义选项)
    - [排名图标风格](#排名图标风格)
- [自定义仓库卡片（带技术栈）](#自定义仓库卡片带技术栈)
  - [功能特性](#功能特性)
  - [使用方法](#使用方法)
  - [支持的技术栈](#支持的技术栈)
- [最常用语言卡片](#最常用语言卡片)
  - [基础使用](#基础使用)
  - [布局选项](#布局选项)
  - [隐藏特定语言](#隐藏特定语言)
- [所有示例](#所有示例)
  - [使用 Markdown](#使用-markdown)
  - [使用 HTML](#使用-html)
  - [对齐卡片](#对齐卡片)
- [致谢](#致谢)
- [许可证](#许可证)

---

## 快速开始

### 步骤 1：Fork 本仓库

点击右上角的 `Fork` 按钮，将本仓库 fork 到你的账号下。

### 步骤 2：配置 GitHub Token

1. 生成 Personal Access Token：
   - 访问 https://github.com/settings/tokens
   - 点击 `Generate new token (classic)`
   - 勾选以下权限：
     - `public_repo` - 读取公开仓库
     - `read:user` - 读取用户信息
   - 生成并复制 token

2. 添加到仓库密钥：
   - 进入你 fork 的仓库
   - Settings → Secrets and variables → Actions
   - 点击 `New repository secret`
   - Name: `GH_PAT`
   - Value: 粘贴你的 token

### 步骤 3：启用 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 `gh-pages` 分支
3. 点击 Save

### 步骤 4：修改配置

编辑 `.github/workflows/generate-readme-cards.yml` 文件，将所有 `Sheyiyuan` 替换为你的 GitHub 用户名，并根据需要修改卡片参数。

### 步骤 5：触发生成

1. 进入 Actions 页面
2. 选择 `Generate README Cards` workflow
3. 点击 `Run workflow`
4. 等待执行完成后，访问 `https://你的用户名.github.io/github-readme-stats/` 查看效果

### 本地测试（可选）

```bash
# 安装依赖
pnpm install

# 创建 .env 文件
echo "PAT_1=your_github_token" > .env

# 启动本地服务器
node express.js

# 访问测试
http://localhost:9000/api?username=你的用户名
```

---

## GitHub 统计卡片

### 隐藏特定统计数据

如果想隐藏某些统计数据，可以在 `.github/cards-config.yml` 中配置，或修改 `.github/workflows/generate-readme-cards.yml` 中的 API 参数。

在 API 调用中添加 `hide` 参数：

```bash
?username=Sheyiyuan&hide=stars,commits
```

可选值：`stars`, `commits`, `prs`, `issues`, `contribs`

### 显示图标

默认已启用图标显示（`show_icons=true`）。如需关闭：

```bash
?username=Sheyiyuan&show_icons=false
```

### 自定义主题

卡片支持自定义颜色配置。当前配置使用透明背景和蓝色调：

```bash
?username=Sheyiyuan
&show_icons=true
&hide_border=true
&locale=cn
&bg_color=00000000
&title_color=3178C6
&text_color=666666
&icon_color=3178C6
&hide_rank=true
```

**参数说明：**

- `bg_color` - 背景颜色（`00000000` 表示透明）
- `title_color` - 标题颜色
- `text_color` - 文本颜色
- `icon_color` - 图标颜色
- `hide_border` - 隐藏边框
- `locale` - 语言（`cn` 表示中文）
- `hide_rank` - 隐藏排名

### 自定义选项

| 参数          | 说明             | 默认值    | 可选值                                              |
| ------------- | ---------------- | --------- | --------------------------------------------------- |
| `hide`        | 隐藏特定统计数据 | -         | `stars,commits,prs,issues,contribs`                 |
| `show_icons`  | 显示图标         | `false`   | `true`, `false`                                     |
| `hide_border` | 隐藏边框         | `false`   | `true`, `false`                                     |
| `hide_rank`   | 隐藏排名         | `false`   | `true`, `false`                                     |
| `rank_icon`   | 排名图标风格     | `default` | `default`, `github`, `percentile`, `star`, 或自定义 |
| `locale`      | 语言设置         | `en`      | `cn`, `en`, `ja`, `es` 等                           |
| `bg_color`    | 背景颜色         | `FFFEFE`  | 16进制颜色（无 `#`）                                |
| `title_color` | 标题颜色         | `2F80ED`  | 16进制颜色（无 `#`）                                |
| `text_color`  | 文本颜色         | `434D58`  | 16进制颜色（无 `#`）                                |
| `icon_color`  | 图标颜色         | `4C71F2`  | 16进制颜色（无 `#`）                                |

#### 排名图标风格

**内置风格：**
- `default` - 显示字母等级（S、A、B、C）
- `github` - GitHub 徽标
- `percentile` - 百分位数显示（Top X%）
- `star` - 彩色星星（按等级显示不同颜色）

**自定义按等级图标：**

在 `assets/rank-icons/` 目录下创建新文件夹，并为每个等级添加不同的图标：

```bash
assets/rank-icons/
  your-style/
    S.svg     # 或 .png, .jpg, .webp
    A+.svg
    A.svg
    # ... 共 9 个等级
```

使用方法：
```
?rank_icon=your-style
```

**全局统一图标（所有等级使用同一图标）：**

使用 `global/` 前缀，所有等级将显示相同的图标：

```bash
assets/rank-icons/
  global/
    default.png   # 默认图标
    fire.svg      # 火焰图标
    trophy.svg    # 奖杯图标
    # 添加你自己的图标...
```

使用方法：
```
?rank_icon=global/default   # 所有等级都显示默认图标
?rank_icon=global/fire      # 所有等级都显示火焰
```

详见 [assets/rank-icons/README.md](assets/rank-icons/README.md)

---

## 自定义仓库卡片（带技术栈）

### 功能特性

- 显示仓库名称、描述和统计数据
- 自定义技术栈徽章
- 支持透明背景和自定义颜色
- 可控制描述行数

### 使用方法

```markdown
![Half-Beat-Player](https://sheyiyuan.github.io/github-readme-stats/half-beat-player.svg)
```

**效果预览：**

![Half-Beat-Player](https://sheyiyuan.github.io/github-readme-stats/half-beat-player.svg)

**API 参数示例：**

```bash
/api/pin-custom/?username=Sheyiyuan
&repo=Half-Beat-Player
&hide_border=true
&bg_color=00000000
&title_color=3178C6
&text_color=666666
&icon_color=3178C6
&show_owner=false
&tech_stack=Wails,Go,Vue,TypeScript
&description_lines_count=3
```

**参数说明：**

| 参数                      | 说明                   | 默认值   |
| ------------------------- | ---------------------- | -------- |
| `username`                | GitHub 用户名          | 必填     |
| `repo`                    | 仓库名称               | 必填     |
| `tech_stack`              | 技术栈列表（逗号分隔） | -        |
| `description_lines_count` | 描述显示行数           | `3`      |
| `show_owner`              | 显示所有者信息         | `true`   |
| `hide_border`             | 隐藏边框               | `false`  |
| `bg_color`                | 背景颜色               | `FFFEFE` |
| `title_color`             | 标题颜色               | `2F80ED` |
| `text_color`              | 文本颜色               | `434D58` |
| `icon_color`              | 图标颜色               | `586069` |

### 支持的技术栈

支持主流编程语言和框架，包括但不限于：

**前端框架：** React, Vue, Angular, Svelte, Next.js, Nuxt.js, Vite

**后端语言：** Go, Python, Java, Node.js, Rust, C++, C#, PHP

**移动开发：** Flutter, React Native, Swift, Kotlin

**工具链：** Docker, Kubernetes, Wails, Electron, TypeScript, JavaScript

更多支持的技术请查看源代码中的 `languageColors.json`。

---

## 最常用语言卡片

### 基础使用

```markdown
![Top Languages](https://sheyiyuan.github.io/github-readme-stats/top-langs.svg)
```

**效果预览：**

![Top Languages](https://sheyiyuan.github.io/github-readme-stats/top-langs.svg)

### 布局选项

支持多种布局模式：

**紧凑布局（默认）：**
```bash
?username=Sheyiyuan&layout=compact
```

**普通布局：**
```bash
?username=Sheyiyuan
```

### 隐藏特定语言

可以隐藏不想显示的语言：

```bash
?username=Sheyiyuan&hide=html,css,dockerfile
```

**当前配置参数：**

```bash
?username=Sheyiyuan
&hide_border=true
&layout=compact
&langs_count=8
&locale=cn
&hide=html,css,dockerfile,shell,powershell
&size_weight=0.5
&count_weight=0.5
&bg_color=00000000
&title_color=3178C6
&text_color=666666
```

**参数说明：**

| 参数           | 说明         | 默认值    |
| -------------- | ------------ | --------- |
| `layout`       | 布局类型     | `default` |
| `langs_count`  | 显示语言数量 | `5`       |
| `hide`         | 隐藏特定语言 | -         |
| `size_weight`  | 代码量权重   | `1`       |
| `count_weight` | 仓库数量权重 | `0`       |

---

## 所有示例

### 使用 Markdown

```markdown
<!-- GitHub 统计卡片 -->
![GitHub Stats](https://sheyiyuan.github.io/github-readme-stats/github-stats.svg)

<!-- 语言统计卡片 -->
![Top Languages](https://sheyiyuan.github.io/github-readme-stats/top-langs.svg)

<!-- 项目卡片 -->
![Half-Beat-Player](https://sheyiyuan.github.io/github-readme-stats/half-beat-player.svg)
![Tuan-Chat-Web](https://sheyiyuan.github.io/github-readme-stats/tuan-chat-web.svg)
```

### 使用 HTML

```html
<!-- GitHub 统计卡片 -->
<img src="https://sheyiyuan.github.io/github-readme-stats/github-stats.svg" alt="GitHub Stats">

<!-- 语言统计卡片 -->
<img src="https://sheyiyuan.github.io/github-readme-stats/top-langs.svg" alt="Top Languages">

<!-- 项目卡片 -->
<img src="https://sheyiyuan.github.io/github-readme-stats/half-beat-player.svg" alt="Half Beat Player">
<img src="https://sheyiyuan.github.io/github-readme-stats/tuan-chat-web.svg" alt="Tuan Chat Web">
```

### 对齐卡片

使用 HTML 实现卡片对齐：

```html
<div align="center">
  <img src="https://sheyiyuan.github.io/github-readme-stats/github-stats.svg" alt="GitHub Stats" height="180">
  <img src="https://sheyiyuan.github.io/github-readme-stats/top-langs.svg" alt="Top Languages" height="180">
</div>
```

---

## 致谢

本项目基于 [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats) 进行二次开发，感谢原作者的优秀工作。

主要改进：
- 添加自定义仓库卡片（支持技术栈徽章）
- 改用 GitHub Pages 部署，无需 Vercel
- 自动化生成和部署流程
- 支持透明背景和自定义颜色

---

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

<div align="center">
  <p>自动生成和更新 | 由 GitHub Actions 驱动</p>
  <p>
    <a href="https://sheyiyuan.github.io/github-readme-stats/">在线预览</a>
  </p>
</div>
