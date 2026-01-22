#!/usr/bin/env node
// @ts-check
// 测试自定义repo卡片功能

import { renderRepoCard } from "../src/cards/repo-custom.js";

// 模拟仓库数据
const mockRepoData = {
    name: "Half-Beat-Player",
    nameWithOwner: "Sheyiyuan/Half-Beat-Player",
    description: "基于 Wails 的跨平台音乐播放器，支持网易云音乐、QQ音乐、酷狗音乐等多个平台。提供简洁美观的用户界面和流畅的播放体验。支持歌词显示、歌单管理、本地音乐库等功能。",
    primaryLanguage: {
        name: "Go",
        color: "#00ADD8"
    },
    isArchived: false,
    isTemplate: false,
    starCount: 123,
    forkCount: 45
};

// 很长仓库名的数据
const longNameRepoData = {
    name: "Awesome-Full-Stack-Web-Development-Framework-With-TypeScript-And-React",
    nameWithOwner: "VeryLongOrganizationName/Awesome-Full-Stack-Web-Development-Framework-With-TypeScript-And-React",
    description: "这是一个功能强大的全栈Web开发框架，集成了最新的TypeScript和React技术栈。",
    primaryLanguage: {
        name: "TypeScript",
        color: "#3178C6"
    },
    isArchived: false,
    isTemplate: false,
    starCount: 1234,
    forkCount: 567
};

// 测试场景1: 基础功能（无自定义）
console.log("=== 测试1: 基础功能（原版） ===");
const svg1 = renderRepoCard(mockRepoData, {
    theme: "transparent",
    hide_border: false
});
console.log("✅ 基础卡片生成成功");
console.log(`   长度: ${svg1.length} 字符\n`);

// 测试场景2: 添加技术栈
console.log("=== 测试2: 添加技术栈 ===");
const svg2 = renderRepoCard(mockRepoData, {
    theme: "transparent",
    tech_stack: "Go,React,TypeScript,Wails,SQLite"
});
console.log("✅ 技术栈卡片生成成功");
console.log(`   长度: ${svg2.length} 字符\n`);

// 测试场景2b: 更多技术栈按钮（测试多行换行）
console.log("=== 测试2b: 更多技术栈按钮 ===");
const svg2b = renderRepoCard(mockRepoData, {
    theme: "transparent",
    tech_stack: "Go,React,TypeScript,JavaScript,Python,Node.js,Docker,Redis,MySQL,MongoDB,Vue"
});
console.log("✅ 更多技术栈卡片生成成功");
console.log(`   长度: ${svg2b.length} 字符\n`);

// 测试场景3: 固定高度
console.log("=== 测试3: 固定高度 ===");
const svg3 = renderRepoCard(mockRepoData, {
    theme: "transparent",
    fixed_height: 200
});
console.log("✅ 固定高度卡片生成成功");
console.log(`   长度: ${svg3.length} 字符\n`);

// 测试场景4: 组合功能
console.log("=== 测试4: 技术栈 + 固定高度 ===");
const svg4 = renderRepoCard(mockRepoData, {
    theme: "transparent",
    tech_stack: "Go,React,Wails",
    fixed_height: 200,
    title_color: "3178C6",
    icon_color: "3178C6"
});
console.log("✅ 组合功能卡片生成成功");
console.log(`   长度: ${svg4.length} 字符\n`);

// 测试场景5: 短标题（测试最小宽度）
console.log("=== 测试5: 短标题 ===");
const shortNameRepoData = {
    ...mockRepoData,
    name: "MyApp",
    nameWithOwner: "Sheyiyuan/MyApp"
};
const svg5a = renderRepoCard(shortNameRepoData, {
    theme: "transparent",
    tech_stack: "React,TypeScript"
});
console.log("✅ 短标题卡片生成成功");
console.log(`   长度: ${svg5a.length} 字符\n`);

// 测试场景6: 中等长度的仓库名（测试动态宽度 - 416px）
console.log("=== 测试6: 中等长度的仓库名 (416px) ===");
const mediumNameRepoData = {
    ...mockRepoData,
    name: "Full-Stack-Web-Development-Framework",
    nameWithOwner: "Sheyiyuan/Full-Stack-Web-Development-Framework"
};
const svg5 = renderRepoCard(mediumNameRepoData, {
    theme: "transparent",
    tech_stack: "JavaScript,TypeScript"
});
console.log("✅ 中等长度卡片生成成功");
console.log(`   长度: ${svg5.length} 字符\n`);

// 测试场景6b: 更长的中等标题（测试动态宽度 - 450px）
console.log("=== 测试6b: 更长的中等标题 (450px) ===");
const longerMediumRepoData = {
    ...mockRepoData,
    name: "Modern-Application-Development-Platform",
    nameWithOwner: "Sheyiyuan/Modern-Application-Development-Platform"
};
const svg5b = renderRepoCard(longerMediumRepoData, {
    theme: "transparent",
    tech_stack: "React,Vue"
});
console.log("✅ 更长中等卡片生成成功");
console.log(`   长度: ${svg5b.length} 字符\n`);

// 测试场景7: 很长的仓库名
console.log("=== 测试7: 很长的仓库名 ===");
const svg6 = renderRepoCard(longNameRepoData, {
    theme: "transparent",
    tech_stack: "TypeScript,React,Node.js,Express,MongoDB"
});
console.log("✅ 长名称卡片生成成功");
console.log(`   长度: ${svg6.length} 字符\n`);

// 保存测试结果
import fs from 'fs';

fs.writeFileSync('test-card-original.svg', svg1);
console.log("📁 已保存: test-card-original.svg (原版, width=400)");

fs.writeFileSync('test-card-techstack.svg', svg2);
console.log("📁 已保存: test-card-techstack.svg (技术栈)");

fs.writeFileSync('test-card-many-techs.svg', svg2b);
console.log("📁 已保存: test-card-many-techs.svg (更多技术栈)");

fs.writeFileSync('test-card-short-name.svg', svg5a);
console.log("📁 已保存: test-card-short-name.svg (短标题)");

fs.writeFileSync('test-card-medium-name.svg', svg5);
console.log("📁 已保存: test-card-medium-name.svg (中等长度, width=416)");

fs.writeFileSync('test-card-longer-medium.svg', svg5b);
console.log("📁 已保存: test-card-longer-medium.svg (更长中等, width=450)");

fs.writeFileSync('test-card-long-name.svg', svg6);
console.log("📁 已保存: test-card-long-name.svg (长仓库名, width=467)");

fs.writeFileSync('test-card-fixed.svg', svg3);
console.log("📁 已保存: test-card-fixed.svg (固定高度)");

fs.writeFileSync('test-card-combined.svg', svg4);
console.log("📁 已保存: test-card-combined.svg (组合功能)");

console.log("\n✅ 所有测试完成!");
console.log("💡 使用浏览器打开 test-card-*.svg 查看效果");
