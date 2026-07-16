// @ts-check

import { Card } from "../common/Card.js";
import { getCardColors } from "../common/color.js";

/**
 * Render a contribution activity graph SVG.
 *
 * @param {{totalContributions: number, weeks: Array}} contributions Contribution data.
 * @param {object} options Rendering options.
 * @param {string=} options.title Card title.
 * @param {boolean=} options.hide_title Hide the title.
 * @param {boolean=} options.hide_border Hide the border.
 * @param {string=} options.title_color Title color.
 * @param {string=} options.text_color Text color.
 * @param {string=} options.bg_color Background color.
 * @param {string=} options.border_color Border color.
 * @param {string=} options.theme Theme name.
 * @returns {string} Rendered SVG.
 */
const renderContributionsCard = (contributions, options = {}) => {
  const {
    title,
    hide_title,
    hide_border,
    title_color,
    text_color,
    bg_color,
    border_color,
    theme: themeName,
  } = options;

  const defaultTitle = "Contribution Graph";
  const colors = getCardColors({
    title_color,
    text_color,
    bg_color,
    border_color,
    theme: themeName || "default",
  });

  const CELL_SIZE = 11;
  const CELL_GAP = 2;
  const LABEL_WIDTH = 30;
  const DAYS = 7;
  const GRAPH_W = 53 * (CELL_SIZE + CELL_GAP);
  const TOTAL_W = LABEL_WIDTH + GRAPH_W + 30;
  const TITLE_H = hide_title ? 0 : 45;
  const LEGEND_H = 25;
  const GRAPH_H = DAYS * (CELL_SIZE + CELL_GAP);
  const TOTAL_H = TITLE_H + GRAPH_H + LEGEND_H + 10;

  const weeks = contributions.weeks || [];
  const totalContributions = contributions.totalContributions || 0;

  // Blue scale matching #3178C6 brand color
  const LEVEL_COLORS = ["#ebedf0", "#c8d9f0", "#7aadde", "#3178C6", "#1a4f8a"];

  const getLevel = (count) => {
    if (count <= 0) return 0;
    if (count <= 3) return 1;
    if (count <= 7) return 2;
    if (count <= 15) return 3;
    return 4;
  };

  let cells = "";
  for (let day = 0; day < DAYS; day++) {
    for (let week = 0; week < weeks.length; week++) {
      const w = weeks[week];
      if (!w || !w.contributionDays) continue;
      const dayData = w.contributionDays[day];
      if (!dayData) continue;
      const count = dayData.contributionCount || 0;
      const level = getLevel(count);
      const x = LABEL_WIDTH + week * (CELL_SIZE + CELL_GAP);
      const y = day * (CELL_SIZE + CELL_GAP);
      cells += `<rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="2" fill="${LEVEL_COLORS[level]}">
        <title>${count} contributions on ${dayData.date}</title>
      </rect>\n`;
    }
  }

  // Day labels
  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
  let dayLabelSvg = "";
  for (let d = 0; d < DAYS; d++) {
    if (!dayLabels[d]) continue;
    const y = d * (CELL_SIZE + CELL_GAP) + CELL_SIZE - 3;
    dayLabelSvg += `<text x="0" y="${y}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="10" fill="${colors.textColor}">${dayLabels[d]}</text>\n`;
  }

  // Month labels
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let monthLabelSvg = "";
  let lastMonth = -1;
  for (let w = 0; w < weeks.length; w++) {
    const firstDay = weeks[w]?.contributionDays?.[0];
    if (!firstDay) continue;
    const date = new Date(firstDay.date + "T12:00:00Z");
    const month = date.getMonth();
    if (month !== lastMonth) {
      lastMonth = month;
      const x = LABEL_WIDTH + w * (CELL_SIZE + CELL_GAP);
      monthLabelSvg += `<text x="${x}" y="-6" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="10" fill="${colors.textColor}">${months[month]}</text>\n`;
    }
  }

  // Footer: total + legend
  const footerY = GRAPH_H + 14;
  const legendX = TOTAL_W - 30 - LEVEL_COLORS.length * (CELL_SIZE + 3);
  let footerSvg = `<text x="0" y="${footerY + 1}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="11" fill="${colors.textColor}">${totalContributions} contributions in the last year</text>`;
  footerSvg += `<text x="${legendX - 32}" y="${footerY + 8}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="10" fill="${colors.textColor}">Less</text>`;
  for (let lv = 0; lv < LEVEL_COLORS.length; lv++) {
    const lx = legendX + lv * (CELL_SIZE + 3);
    footerSvg += `<rect x="${lx}" y="${footerY}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="2" fill="${LEVEL_COLORS[lv]}" />`;
  }
  footerSvg += `<text x="${legendX + LEVEL_COLORS.length * (CELL_SIZE + 3) + 3}" y="${footerY + 8}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="10" fill="${colors.textColor}">More</text>`;

  const body = `
    <svg x="15" y="0">
      ${monthLabelSvg}
      ${dayLabelSvg}
      ${cells}
      ${footerSvg}
    </svg>
  `;

  const card = new Card({
    width: TOTAL_W + 30,
    height: TOTAL_H + 15,
    border_radius: 6,
    colors,
    customTitle: title,
    defaultTitle,
  });
  card.setHideBorder(!!hide_border);
  card.setHideTitle(!!hide_title);

  return card.render(body);
};

export { renderContributionsCard };
