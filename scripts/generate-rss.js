/**
 * ============================================================================
 *  generate-rss.js - RSS Feed 生成脚本
 * ============================================================================
 *
 * 【功能说明】
 * 1. 读取所有博客文章
 * 2. 生成 RSS 2.0 格式的 feed
 * 3. 输出到 public/rss.xml
 *
 * 【使用方式】
 * node scripts/generate-rss.js
 * ============================================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fm from "front-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

// 站点配置
const siteConfig = {
  title: "STYLAN Blog",
  description: "Thoughts, tutorials and insights about web development",
  siteUrl: "https://duan-deqing@foxmail.com", // 替换为你的网站地址
  language: "zh",
  author: {
    name: "STYLAN",
    email: "duan-deqing@foxmail.com",
    link: "https://github.com/duan-deqing",
  },
};

/**
 * 从文件名中解析日期和 slug
 */
function parseFilename(filename) {
  const cleanFilename = filename.replace(/-en$/, "");
  const match = cleanFilename.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  if (match) {
    return {
      date: match[1],
      slug: match[2],
    };
  }
  return {
    date: "",
    slug: cleanFilename,
  };
}

/**
 * 读取指定目录下的所有 markdown 文件
 */
function getMarkdownFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

/**
 * 转义 XML 特殊字符
 */
function escapeXml(str) {
  if (!str) return "";
  // 如果是对象，尝试获取中文或英文值
  if (typeof str === "object") {
    str = str.zh || str.en || JSON.stringify(str);
  }
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * 生成 RSS Feed
 */
async function generateRSS() {
  // 读取中文文章
  const zhDir = path.join(rootDir, "src", "posts");
  const enDir = path.join(rootDir, "src", "posts", "en");

  const zhFiles = getMarkdownFiles(zhDir);
  const enFiles = getMarkdownFiles(enDir);

  const allFiles = [
    ...zhFiles.map((f) => ({ path: f, lang: "zh" })),
    ...enFiles.map((f) => ({ path: f, lang: "en" })),
  ];

  const posts = [];

  for (const { path: filePath, lang } of allFiles) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const { attributes: data } = fm(content);

      const filename = path.basename(filePath, ".md");
      const { date: fileDate, slug } = parseFilename(filename);

      const date = data.date || fileDate;
      const title = data.title || slug;
      const description = data.description || data.excerpt || "";
      const category = data.category || "";
      const tags = data.tags || [];

      const url = `${siteConfig.siteUrl}/blog/${slug}`;

      posts.push({
        title,
        description,
        date: new Date(date),
        link: url,
        category,
        tags,
        lang,
        slug,
      });
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }

  // 按日期降序排序
  posts.sort((a, b) => b.date - a.date);

  // 生成 RSS XML
  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.link)}</link>
      <guid isPermaLink="true">${escapeXml(post.link)}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${post.date.toUTCString()}</pubDate>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
      <author>${escapeXml(siteConfig.author.email)} (${escapeXml(
        siteConfig.author.name
      )})</author>
    </item>
  `
    )
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${escapeXml(siteConfig.siteUrl)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${siteConfig.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>STYLAN Blog RSS Generator</generator>
    <atom:link href="${escapeXml(
      siteConfig.siteUrl
    )}/rss.xml" rel="self" type="application/rss+xml"/>
    <copyright>© ${new Date().getFullYear()} STYLAN. All rights reserved.</copyright>
    <image>
      <url>${escapeXml(siteConfig.siteUrl)}/favicon.ico</url>
      <title>${escapeXml(siteConfig.title)}</title>
      <link>${escapeXml(siteConfig.siteUrl)}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  // 输出到 public 目录
  const outputPath = path.join(rootDir, "public", "rss.xml");
  fs.writeFileSync(outputPath, rssXml, "utf-8");

  console.log(`✅ RSS feed generated at ${outputPath}`);
  console.log(`📝 Total posts: ${posts.length}`);
}

// 执行生成
generateRSS().catch(console.error);
