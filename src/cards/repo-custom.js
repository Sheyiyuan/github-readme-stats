// @ts-check
// 基于 repo.js 的自定义版本，添加技术栈显示功能

import { Card } from "../common/Card.js";
import { getCardColors } from "../common/color.js";
import { kFormatter } from "../common/fmt.js";
import { encodeHTML } from "../common/html.js";
import { I18n } from "../common/I18n.js";
import { icons } from "../common/icons.js";
import { parseEmojis, parseArray } from "../common/ops.js";
import {
  flexLayout,
  measureText,
  iconWithLabel,
  createLanguageNode,
} from "../common/render.js";
import { repoCardLocales } from "../translations.js";

const ICON_SIZE = 16;
const DESCRIPTION_MAX_LINES = 3;

// 技术栈颜色映射
const TECH_COLORS = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Go: "#00ADD8",
  Python: "#3776AB",
  React: "#61DAFB",
  Vue: "#4FC08D",
  Wails: "#00ADD8",
  Gin: "#00ADD8",
  FastAPI: "#009688",
  PostgreSQL: "#316192",
  MySQL: "#4479A1",
  Redis: "#DC382D",
  MongoDB: "#47A248",
  SQLite: "#003B57",
  Docker: "#2496ED",
  "Node.js": "#339933",
};

const getBadgeSVG = (label, textColor) => `
  <g data-testid="badge" class="badge" transform="translate(320, -18)">
    <rect stroke="${textColor}" stroke-width="1" width="70" height="20" x="-12" y="-14" ry="10" rx="10"></rect>
    <text
      x="23" y="-5"
      alignment-baseline="central"
      dominant-baseline="central"
      text-anchor="middle"
      fill="${textColor}"
    >
      ${label}
    </text>
  </g>
`;

/**
 * 生成技术栈标签
 * @param {string[]} techStack - 技术栈数组
 * @param {object} colors - 颜色配置
 * @param {number} cardWidth - 卡片动态宽度
 * @returns {string} 技术栈SVG
 */
const createTechStackNodes = (techStack, colors, cardWidth) => {
  if (!techStack || techStack.length === 0) {
    return "";
  }

  const gap = 10;
  const padding = 16; // 按钮内部左右padding
  const fontSize = 11;
  const leftMargin = 25;
  const maxWidth = cardWidth - leftMargin - leftMargin; // 可用宽度
  const lineHeight = 28; // 每行高度（22按钮 + 6间距）

  // 估算技术名称的渲染宽度
  const getTechWidth = (tech) => {
    let width = 0;
    for (let char of tech) {
      if (/[\u4e00-\u9fa5]/.test(char)) {
        width += fontSize * 1.2; // 中文字符
      } else if (/[a-zA-Z]/.test(char)) {
        width += fontSize * 0.65; // 英文字母（增大估算）
      } else if (/[0-9]/.test(char)) {
        width += fontSize * 0.6; // 数字
      } else {
        width += fontSize * 0.55; // 其他字符
      }
    }
    return Math.ceil(width + padding * 2); // 加上左右padding
  };

  let currentX = 0;
  let currentY = 0;
  let lines = 0;

  const nodes = techStack
    .map((tech) => {
      const techColor = TECH_COLORS[tech] || colors.iconColor;
      const techWidth = getTechWidth(tech);
      const newX = currentX + techWidth;

      // 参考简介的换行逻辑：检查右边距是否小于左边距
      if (currentX > 0) {
        // 不是行首
        const textWidthAfterAdding = newX;
        const rightMargin = maxWidth - textWidthAfterAdding;

        // 如果右边距 < 左边距，换行
        if (rightMargin < leftMargin) {
          currentX = 0;
          currentY += lineHeight;
          lines++;
        }
      }

      const x = currentX;
      const y = currentY;
      currentX += techWidth + gap;

      return `
      <g transform="translate(${x}, ${y})">
        <rect fill="${techColor}" opacity="0.1" width="${techWidth}" height="22" rx="11"/>
        <text x="${techWidth / 2}" y="15" text-anchor="middle" fill="${techColor}" 
              font-size="11" font-weight="500" class="tech-label">
          ${encodeHTML(tech)}
        </text>
      </g>
    `;
    })
    .join("");

  return { nodes, totalHeight: (lines + 1) * lineHeight };
};

/**
 * Renders repository card details with custom tech stack.
 *
 * @param {import("../fetchers/types").RepositoryData} repo Repository data.
 * @param {Partial<import("./types").RepoCardOptions> & {tech_stack?: string, fixed_height?: number}} options Card options.
 * @returns {string} Repository card SVG object.
 */
const renderRepoCard = (repo, options = {}) => {
  const {
    name,
    nameWithOwner,
    description,
    primaryLanguage,
    isArchived,
    isTemplate,
    starCount,
    forkCount,
  } = repo;
  const {
    hide_border = false,
    title_color,
    icon_color,
    text_color,
    bg_color,
    show_owner = false,
    theme = "default_repocard",
    border_radius,
    border_color,
    locale,

    tech_stack, // 新增：技术栈参数
    fixed_height, // 新增：固定高度参数
  } = options;

  const header = show_owner ? nameWithOwner : name;
  const langName = (primaryLanguage && primaryLanguage.name) || "Unspecified";
  const langColor = (primaryLanguage && primaryLanguage.color) || "#333";

  // 计算标题宽度（字体大小约18px）
  const titleFontSize = 18;
  const iconWidth = 16 + 8; // 图标宽度 + 间距
  let titleTextWidth = 0;
  for (let char of header) {
    if (/[\u4e00-\u9fa5]/.test(char)) {
      titleTextWidth += titleFontSize * 1.1;
    } else if (/[a-zA-Z]/.test(char)) {
      titleTextWidth += titleFontSize * 0.55;
    } else if (/[0-9]/.test(char)) {
      titleTextWidth += titleFontSize * 0.5;
    } else if (char === "-" || char === "_") {
      titleTextWidth += titleFontSize * 0.35;
    } else {
      titleTextWidth += titleFontSize * 0.5;
    }
  }

  const leftMargin = 25;
  const rightMargin = 25;
  const maxContentWidth = 417; // 简介的最大宽度
  const minCardWidth = 400; // 最小卡片宽度

  // 标题文本的最大宽度（减去图标）不应超过maxContentWidth
  const maxTitleTextWidth = maxContentWidth - iconWidth;

  // 如果标题文本宽度超过最大值，需要截断
  const finalTitleTextWidth = Math.min(titleTextWidth, maxTitleTextWidth);

  // 计算需要的卡片宽度：max(标题宽度 + 边距, 最小宽度)
  const requiredWidthForTitle = Math.ceil(
    iconWidth + finalTitleTextWidth + leftMargin + rightMargin,
  );
  const cardWidth = Math.max(requiredWidthForTitle, minCardWidth);

  // 标题最大宽度（减去图标和边距）
  const maxTitleWidth = maxContentWidth - iconWidth;

  const desc = parseEmojis(description || "No description provided");

  // 基于像素宽度的智能换行（支持中英文混合，不切割英文单词）
  const fontSize = 13; // 实际字体大小
  const ellipsisWidth = 3 * (fontSize * 0.5); // "..." 的宽度约19.5px

  // 估算字符宽度的函数（与标题使用相同的系数）
  const getCharWidth = (char) => {
    if (/[\u4e00-\u9fa5]/.test(char)) {
      return fontSize * 1.1; // 中文字符，与标题一致
    } else if (/[a-zA-Z]/.test(char)) {
      return fontSize * 0.55; // 英文字母，与标题一致
    } else if (/[0-9]/.test(char)) {
      return fontSize * 0.5; // 数字，与标题一致
    } else if (char === "-" || char === "_") {
      return fontSize * 0.35; // 横线/下划线，与标题一致
    } else {
      return fontSize * 0.5; // 其他标点符号
    }
  };

  // 计算字符串的总宽度
  const getTextWidth = (text) => {
    let width = 0;
    for (let char of text) {
      width += getCharWidth(char);
    }
    return width;
  };

  let lines = [];
  let words = [];
  let currentWord = "";

  // 将文本分割成单词和非单词（中文字符、标点等）
  for (let i = 0; i < desc.length; i++) {
    const char = desc[i];

    if (/[a-zA-Z0-9]/.test(char)) {
      // 英文字母或数字，累积到当前单词
      currentWord += char;
    } else {
      // 非英文字母数字，先保存当前单词（如果有）
      if (currentWord) {
        words.push({ text: currentWord, isWord: true });
        currentWord = "";
      }
      // 保存当前字符
      words.push({ text: char, isWord: false });
    }
  }
  // 保存最后一个单词
  if (currentWord) {
    words.push({ text: currentWord, isWord: true });
  }

  // 按照宽度进行换行，控制右边距接近目标值
  // 简化的换行逻辑：类似标题的处理方式
  let currentLine = "";
  let currentWidth = 0;
  let wordIndex = 0;
  const maxLineWidth = cardWidth - leftMargin - rightMargin; // 每行的最大宽度

  while (wordIndex < words.length && lines.length < DESCRIPTION_MAX_LINES) {
    const word = words[wordIndex];
    const wordWidth = getTextWidth(word.text);
    const newWidth = currentWidth + wordWidth;

    // 最后一行需要为省略号预留空间
    const isLastLine = lines.length === DESCRIPTION_MAX_LINES - 1;
    const effectiveMaxWidth = isLastLine
      ? maxLineWidth - ellipsisWidth
      : maxLineWidth;

    // 判断是否超出最大宽度
    if (newWidth > effectiveMaxWidth && currentLine.length > 0) {
      // 超出了，需要换行
      const isPunctuation = /[，、。！？；：]/.test(word.text);

      if (word.isWord) {
        // 英文单词：整个移到下一行
        lines.push(currentLine.trimEnd());
        currentLine = word.text;
        currentWidth = wordWidth;
      } else if (
        isPunctuation &&
        currentWidth + wordWidth <= effectiveMaxWidth + 10
      ) {
        // 标点符号：如果略微超出（10px内），仍然加到当前行
        currentLine += word.text;
        lines.push(currentLine);
        currentLine = "";
        currentWidth = 0;
      } else if (word.text === " ") {
        // 空格：直接换行，不保留空格
        lines.push(currentLine.trimEnd());
        currentLine = "";
        currentWidth = 0;
      } else {
        // 中文字符等：移到下一行
        lines.push(currentLine.trimEnd());
        currentLine = word.text;
        currentWidth = wordWidth;
      }
    } else {
      // 没超出，直接添加
      currentLine += word.text;
      currentWidth = newWidth;
    }

    wordIndex++;
  }

  // 处理最后一行
  if (currentLine.trim()) {
    if (lines.length >= DESCRIPTION_MAX_LINES) {
      // 已经达到最大行数，截断最后一行并加省略号
      lines[lines.length - 1] = lines[lines.length - 1].trimEnd() + "...";
    } else {
      lines.push(currentLine.trim());
      // 如果还有未处理的单词，添加省略号
      if (wordIndex < words.length) {
        lines[lines.length - 1] += "...";
      }
    }
  } else if (lines.length > 0) {
    // currentLine 为空，但还有未处理的单词
    if (wordIndex < words.length || lines.length >= DESCRIPTION_MAX_LINES) {
      if (!lines[lines.length - 1].endsWith("...")) {
        lines[lines.length - 1] = lines[lines.length - 1].trimEnd() + "...";
      }
    }
  }

  const multiLineDescription = lines.filter((line) => line.length > 0);

  // 强制限制为最多3行
  const descriptionLinesCount = Math.min(
    multiLineDescription.length,
    DESCRIPTION_MAX_LINES,
  );

  const descriptionSvg = multiLineDescription
    .map((line) => `<tspan dy="1.2em" x="25">${encodeHTML(line)}</tspan>`)
    .join("");

  // 解析技术栈
  const techStackArray = tech_stack ? parseArray(tech_stack) : [];
  const hasTechStack = techStackArray.length > 0;

  const i18n = new I18n({
    locale,
    translations: repoCardLocales,
  });

  // returns theme based colors with proper overrides and defaults
  const colors = getCardColors({
    title_color,
    icon_color,
    text_color,
    bg_color,
    border_color,
    theme,
  });

  // 生成技术栈并获取高度
  const techStackResult = hasTechStack
    ? createTechStackNodes(techStackArray, colors, cardWidth)
    : { nodes: "", totalHeight: 0 };

  // 动态计算卡片高度：
  // 标题栏: ~55px
  // 描述: descriptionLinesCount 行，每行约16px行高
  // 技术栈: techStackResult.totalHeight
  // Star/Fork行: ~20px
  // 上下边距和间距: ~35px (顶部) + 15px (底部)
  const titleHeight = 55;
  const descriptionHeight = descriptionLinesCount * 16; // 每行描述16px
  const techStackGap = hasTechStack ? 8 : 0; // 技术栈上方间距
  const starForkGap = 12; // Star/Fork上方间距
  const starForkHeight = 20; // Star/Fork行高度
  const bottomPadding = 15; // 底部padding

  const calculatedHeight =
    titleHeight +
    descriptionHeight +
    techStackGap +
    techStackResult.totalHeight +
    starForkGap +
    starForkHeight +
    bottomPadding;

  const height = fixed_height || calculatedHeight;

  // 当有技术栈时，不显示主要语言
  const svgLanguage =
    primaryLanguage && !hasTechStack
      ? createLanguageNode(langName, langColor)
      : "";

  const totalStars = kFormatter(starCount);
  const totalForks = kFormatter(forkCount);
  const svgStars = iconWithLabel(
    icons.star,
    totalStars,
    "stargazers",
    ICON_SIZE,
  );
  const svgForks = iconWithLabel(
    icons.fork,
    totalForks,
    "forkcount",
    ICON_SIZE,
  );

  const starAndForkCount = flexLayout({
    items: [svgLanguage, svgStars, svgForks].filter((item) => item), // 过滤空项
    sizes: [
      svgLanguage ? measureText(langName, 12) : 0,
      ICON_SIZE + measureText(`${totalStars}`, 12),
      ICON_SIZE + measureText(`${totalForks}`, 12),
    ].filter((_, i) => [svgLanguage, svgStars, svgForks][i]), // 过滤对应的尺寸
    gap: 25,
  }).join("");

  // 标题截断：精确计算，预留省略号宽度
  let displayTitle = header;
  if (titleTextWidth > maxTitleWidth) {
    const ellipsisWidth = 3 * (titleFontSize * 0.5); // "..." 约27px
    const availableWidth = maxTitleWidth - ellipsisWidth;
    let truncatedWidth = 0;
    let truncatedLength = 0;

    for (let char of header) {
      let charWidth = 0;
      if (/[\u4e00-\u9fa5]/.test(char)) {
        charWidth = titleFontSize * 1.1;
      } else if (/[a-zA-Z]/.test(char)) {
        charWidth = titleFontSize * 0.55;
      } else if (/[0-9]/.test(char)) {
        charWidth = titleFontSize * 0.5;
      } else if (char === "-" || char === "_") {
        charWidth = titleFontSize * 0.35;
      } else {
        charWidth = titleFontSize * 0.5;
      }

      if (truncatedWidth + charWidth > availableWidth) {
        break;
      }
      truncatedWidth += charWidth;
      truncatedLength++;
    }

    displayTitle = header.slice(0, truncatedLength) + "...";
  }

  const card = new Card({
    defaultTitle: displayTitle,
    titlePrefixIcon: icons.contribs,
    width: cardWidth,
    height,
    border_radius,
    colors,
  });

  card.disableAnimations();
  card.setHideBorder(hide_border);
  card.setHideTitle(false);
  card.setCSS(`
    .description { font: 400 13px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${colors.textColor} }
    .gray { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${colors.textColor} }
    .icon { fill: ${colors.iconColor} }
    .badge { font: 600 11px 'Segoe UI', Ubuntu, Sans-Serif; }
    .badge rect { opacity: 0.2 }
    .tech-label { font: 500 11px 'Segoe UI', Ubuntu, Sans-Serif; }
  `);

  // 使用相对内容区域的位置计算（内容区域从 Y=55 开始，即标题下方）
  // 描述文本起始位置：标题下方留 10px 间距
  const descriptionY = 10;

  // 技术栈位置：描述文本下方，每行描述 16px + 8px 间距
  const techStackY = descriptionY + descriptionHeight + techStackGap;

  // Star/Fork 位置：技术栈下方 + 间距，如果没有技术栈则在描述下方
  const starForkY = hasTechStack
    ? techStackY + techStackResult.totalHeight + starForkGap
    : descriptionY + descriptionHeight + starForkGap;

  const techStackSVG = hasTechStack
    ? `
    <g transform="translate(25, ${techStackY})">
      ${techStackResult.nodes}
    </g>
  `
    : "";

  return card.render(`
    ${
      isTemplate
        ? // @ts-ignore
          getBadgeSVG(i18n.t("repocard.template"), colors.textColor)
        : isArchived
          ? // @ts-ignore
            getBadgeSVG(i18n.t("repocard.archived"), colors.textColor)
          : ""
    }

    <text class="description" x="25" y="${descriptionY}">
      ${descriptionSvg}
    </text>

    ${techStackSVG}

    <g transform="translate(30, ${starForkY})">
      ${starAndForkCount}
    </g>
  `);
};

export { renderRepoCard };
export default renderRepoCard;
