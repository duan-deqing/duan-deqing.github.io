/**
 * ============================================================================
 *  generate-rss.js - RSS Feed 生成脚本
 * ============================================================================
 *
 * 【功能说明】
 * 1. 读取所有博客文章
 * 2. 生成 RSS 2.0 格式的 feed（包含完整文章内容）
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
  siteUrl: "https://duan-deqing.github.io", // 替换为你的网站地址
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
 * 将 markdown 转换为简单的 HTML
 */
function markdownToHtml(md) {
  if (!md) return "";
  
  let html = md;
  
  // 移除第一个 h1 标题
  html = html.replace(/^#\s+.*$/m, "").trim();
  
  // 转换标题
  html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");
  
  // 转换粗体和斜体
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  
  // 转换链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // 转换图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  
  // 转换代码块
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    const code = match.replace(/```\w*\n?/g, "").replace(/```$/g, "");
    return `<pre><code>${escapeXml(code)}</code></pre>`;
  });
  
  // 转换行内代码
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  
  // 转换列表
  html = html.replace(/^\s*[-*]\s+(.*$)/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");
  
  // 转换段落
  html = html.replace(/\n\n/g, "</p><p>");
  html = `<p>${html}</p>`;
  
  // 清理空段落
  html = html.replace(/<p>\s*<\/p>/g, "");
  html = html.replace(/<p>\s*(<h[1-6]>)/g, "$1");
  html = html.replace(/(<\/h[1-6]>)\s*<\/p>/g, "$1");
  html = html.replace(/<p>\s*(<ul>)/g, "$1");
  html = html.replace(/(<\/ul>)\s*<\/p>/g, "$1");
  html = html.replace(/<p>\s*(<pre>)/g, "$1");
  html = html.replace(/(<\/pre>)\s*<\/p>/g, "$1");
  
  return html;
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
      const { attributes: data, body: markdownContent } = fm(content);

      const filename = path.basename(filePath, ".md");
      const { date: fileDate, slug } = parseFilename(filename);

      const date = data.date || fileDate;
      const title = data.title || slug;
      const description = data.description || data.excerpt || "";
      const category = data.category || "";
      const tags = data.tags || [];
      
      // 将 markdown 转换为 HTML 作为完整内容
      const htmlContent = markdownToHtml(markdownContent);

      const url = `${siteConfig.siteUrl}/blog/${slug}`;

      posts.push({
        title,
        description,
        content: htmlContent,
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
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
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
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
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
