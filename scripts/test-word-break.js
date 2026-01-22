/**
 * 测试英文单词不切割功能
 */
import { renderRepoCard } from "../src/cards/repo-custom.js";
import fs from 'fs';

// 测试数据：包含较长英文单词的描述
const englishRepoData = {
    name: "React-Application-Framework",
    nameWithOwner: "Sheyiyuan/React-Application-Framework",
    description: "A comprehensive full-stack development framework built with TypeScript and React for creating modern web applications with advanced features",
    starCount: 2500,
    forkCount: 450,
    primaryLanguage: {
        color: "#3178C6",
        name: "TypeScript",
    },
};

// 测试数据：中英文混合，包含长英文单词
const mixedRepoData = {
    name: "Enterprise-Platform",
    nameWithOwner: "Sheyiyuan/Enterprise-Platform",
    description: "这是一个enterprise-level的应用开发平台，提供comprehensive的功能支持，包括authentication、authorization和sophisticated的数据管理系统。支持高并发场景下的稳定运行。",
    starCount: 1800,
    forkCount: 320,
    primaryLanguage: {
        color: "#3178C6",
        name: "TypeScript",
    },
};

// 测试数据：包含很多长单词的英文描述
const longWordsRepoData = {
    name: "Internationalization-Framework",
    nameWithOwner: "Sheyiyuan/Internationalization-Framework",
    description: "An internationalization and localization framework supporting multilingual applications with comprehensive translation management capabilities and sophisticated formatting utilities",
    starCount: 3200,
    forkCount: 580,
    primaryLanguage: {
        color: "#F7DF1E",
        name: "JavaScript",
    },
};

console.log("=== 测试1: 纯英文描述（长单词） ===");
const svg1 = renderRepoCard(englishRepoData, {
    theme: "transparent",
    tech_stack: "TypeScript,React,Node.js"
});
console.log("✅ 纯英文卡片生成成功");
console.log(`   长度: ${svg1.length} 字符\n`);

console.log("=== 测试2: 中英文混合（包含长英文单词） ===");
const svg2 = renderRepoCard(mixedRepoData, {
    theme: "transparent",
    tech_stack: "TypeScript,React"
});
console.log("✅ 中英文混合卡片生成成功");
console.log(`   长度: ${svg2.length} 字符\n`);

console.log("=== 测试3: 超长英文单词测试 ===");
const svg3 = renderRepoCard(longWordsRepoData, {
    theme: "transparent",
    tech_stack: "JavaScript,i18n"
});
console.log("✅ 超长单词卡片生成成功");
console.log(`   长度: ${svg3.length} 字符\n`);

// 保存测试结果
fs.writeFileSync('test-word-english.svg', svg1);
console.log("📁 已保存: test-word-english.svg");

fs.writeFileSync('test-word-mixed.svg', svg2);
console.log("📁 已保存: test-word-mixed.svg");

fs.writeFileSync('test-word-long.svg', svg3);
console.log("📁 已保存: test-word-long.svg");

console.log("\n✅ 所有测试完成!");
console.log("💡 检查这些文件，确认英文单词没有被切割");
