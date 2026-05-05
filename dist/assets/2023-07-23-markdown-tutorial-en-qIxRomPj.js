var e=`---
title: "Markdown Tutorial: From Basics to GitHub Open Source Contributions"
excerpt: "A comprehensive guide to Markdown syntax, editors, and advanced features for GitHub."
category: "tutorial"
readTime: "10 min read"
author: "duan-deqing"
tags: ["Markdown", "Tutorial", "Documentation"]
featured: false
---

# Markdown Tutorial: From Basics to GitHub Open Source Contributions

Welcome to the world of Markdown! Whether you're a developer just getting into programming or a contributor ready to make your mark on open source projects on GitHub, mastering Markdown is an essential skill. It allows you to quickly format plain text and focus on content creation. This tutorial will take you from the most basic syntax to advanced formatting techniques used on GitHub.

## Basic Markdown Syntax (Most Commonly Used)

### 1. Headings

Markdown supports headings from level 1 to 6, indicated by \`#\` symbols. The number of \`#\` symbols represents the heading level.

\`\`\`markdown
# Heading 1

## Heading 2

### Heading 3

###### Heading 6
\`\`\`

💡 **Best Practice**: Always leave a space between the \`#\` and the heading text. This is standard Markdown syntax.

### 2. Paragraphs, Line Breaks, and Horizontal Rules

- **Paragraphs**: Simply leave a blank line to create a new paragraph.
- **Line Breaks**: Add **two or more spaces** at the end of the current line, then press Enter.
- **Horizontal Rules**: Use three or more consecutive asterisks \`***\` or hyphens \`---\`.

\`\`\`markdown
This is the first line.  
This is the second line (the previous line has two spaces at the end for a hard line break).

This is another paragraph (there's a blank line above).

---
Above is a horizontal rule.
\`\`\`

### 3. Text Styles

You can add bold, italic, or strikethrough effects to text.

\`\`\`markdown
This is **bold** text.
This is *italic* text.
This is ***bold and italic*** text.
This is ~~strikethrough~~ text.
\`\`\`

### 4. Lists

Lists come in unordered and ordered varieties, and can be nested through indentation.

\`\`\`markdown
- Unordered list item 1
- Unordered list item 2
  - Nested sub-item (preceded by two to four spaces)
  - Another sub-item

1. Ordered list item 1
2. Ordered list item 2
   1. Nested ordered sub-item
\`\`\`

### 5. Links

Links come in inline and reference styles. For directly displayed URLs, most parsers also support automatic linking.

\`\`\`markdown
This is an inline link to [GitHub](https://github.com).
This is a reference link: see [Markdown官网][1].
[1]: https://daringfireball.net/projects/markdown/
Direct URL: https://bing.com
\`\`\`

**Rendered Result:**

- This is an inline link to [GitHub](https://github.com).
- This is a reference link: see [Markdown官网][1].
- [1]: https://daringfireball.net/projects/markdown/
- Direct URL: https://bing.com

### 6. Images

Image syntax is similar to links, but with an exclamation mark \`!\` at the beginning. You can also add a "title" that appears on hover.

\`\`\`markdown
![Octocat placeholder](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png "Cute GitHub Logo")
\`\`\`

**Rendered Result:**

![Octocat placeholder](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png "Cute GitHub Logo")

### 7. Blockquotes

When you need to quote someone or emphasize content, use \`>\`. Blockquotes can be nested and can contain other Markdown elements (like lists or code).

\`\`\`markdown
> This is a blockquote.
>
> > This is nested blockquote content.
>
> - You can also use lists in blockquotes.
\`\`\`

### 8. Inline Code and Code Blocks

Code is the core of developer documentation. Inline code is wrapped with single backticks; multi-line code blocks use triple backticks.

\`\`\`\`markdown
Type \`npm install\` in the terminal to install dependencies.

Here's a JavaScript code snippet:
\`\`\`javascript
function greet(name) {
  console.log("Hello, " + name);
}
\`\`\`
\`\`\`\`

Here's a JavaScript code snippet:

\`\`\`javascript
function greet(name) {
  console.log("Hello, " + name);
}
\`\`\`

💡 **Best Practice**: When using code blocks, always specify the language identifier after the first set of backticks (e.g., \`javascript\`, \`python\`, \`bash\`). This not only enables syntax highlighting but also makes it immediately clear to readers.

## Common Patterns in GitHub Open Source Projects (GFM Features)

GitHub Flavored Markdown (GFM) extends basic syntax, specifically tailored for code hosting and team collaboration.

### 1. Task Lists

Commonly used in Issues or Pull Requests for tracking to-do items in open source projects. Checkboxes visually display progress.

\`\`\`markdown
- [x] Improve documentation structure
- [x] Fix homepage bug
- [ ] Write test cases
\`\`\`

**Rendered Result:**

- [x] Improve documentation structure
- [x] Fix homepage bug
- [ ] Write test cases

### 2. Tables

Used for organized display of parameter descriptions or data comparisons. Use \`:\` to control alignment.

\`\`\`markdown
| Left-aligned | Center-aligned | Right-aligned |
| :--- | :---: | ---: |
| Parameter A | \`string\` | Required |
| Parameter B | \`number\` | Optional |
\`\`\`

**Rendered Result:**

| **Left-aligned** | **Center-aligned** | **Right-aligned** |
| ---------------- | ------------------ | ----------------- |
| Parameter A      | \`string\`           | Required          |
| Parameter B      | \`number\`           | Optional          |

💡 **Best Practice**: The number of alignment hyphens \`-\` is unlimited, but at least one is needed. Keep the code-level alignment to improve source readability.

### 3. Footnotes

Used for supplementary explanations without interrupting the main content flow. Widely supported in GitHub's Markdown.

\`\`\`markdown
This is a technical term that needs explanation[^1].

[^1]: Here is the detailed explanation and supplementary information for this term.
\`\`\`

**Rendered Result:**

This is a technical term that needs explanation[^1].

[^1]: Here is the detailed explanation and supplementary information for this term.

### 4. Automatic Links and Emoji

GitHub automatically recognizes plain text URLs or email addresses as links. Additionally, specific shortcuts allow quick insertion of emoji, adding friendliness to communication.

\`\`\`markdown
Visit my blog: https://example.com
Hello! :smile: :rocket:
\`\`\`

**Rendered Result:** Visit my blog: https://example.com Hello! :smile: :rocket:

### 5. Mentions and References

GitHub-specific social and version control collaboration syntax.

- \`@username\`: Notify a developer.
- \`#123\`: Link to Issue or PR #123 in the current repository.
- \`a1b2c3d\`: Write a commit hash directly, and GitHub will automatically convert it to a link to that commit.

**Rendered Result:** *(These features require no additional syntax; simply typing them in text will be captured by GitHub's parser.)*

### 6. Badges

In \`README.md\`, projects often use badges to display build status, license, etc. Usually used in combination with \`shields.io\`.

\`\`\`markdown
![license](https://img.shields.io/badge/license-MIT-blue)
\`\`\`

**Rendered Result:** *(A blue badge with white text showing the MIT license)*![license](https://img.shields.io/badge/license-MIT-blue)
**Note**: Badges are essentially images generated online (using the image syntax above), with text and colors changed through parameters.

### 7. Details (Collapsible Blocks)

READMEs for open source projects can sometimes be very long. Using collapsible blocks can hide large sections of logs, configuration code, or Q&A.

\`\`\`\`markdown
<details>
  <summary>Click to view detailed configuration code</summary>
  
  \`\`\`json
  {
    "version": "1.0.0",
    "description": "Awesome project"
  }
  \`\`\`
</details>
\`\`\`\`

**Rendered Result:** ▶ Click to view detailed configuration code *(Expands to show the code block inside when clicked)*

### 8. Advice on HTML

GitHub allows the use of some safe HTML tags (like \`<kbd>\` for keyboard shortcuts, \`<br>\` for forced line breaks, \`<details>\`, etc.).

**Advice**: Unless Markdown cannot achieve it (like collapsible blocks, center alignment, specific colors), try to use pure Markdown to ensure the best portability of documentation across different platforms.

## Advanced Techniques (Less Common Extended Content)

### 1. Mathematical Formulas

Use \`LaTeX\` syntax to write mathematical formulas. GitHub now natively supports this. Use \`$formula$\` for inline and \`$$formula$$\` for block-level.

\`\`\`markdown
The famous mass-energy equation is $E = mc^2$.

$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$
\`\`\`

**Rendered Result:**

$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

### 2. Diagrams (Mermaid)

Draw diagrams using code. GitHub natively supports Mermaid syntax. Commonly used for flowcharts or architecture diagrams.

\`\`\`\`txt
\`\`\`mermaid
graph TD;
    A[Client] --> B{Logged in?};
    B -- Yes --> C[Profile Page];
    B -- No --> D[Login Page];
\`\`\`
\`\`\`\`

**Rendered Result:**

\`\`\`mermaid
graph TD;
    A[Client] --> B{Logged in?};
    B -- Yes --> C[Profile Page];
    B -- No --> D[Login Page];
\`\`\`

### 3. Internal Anchors and Navigation

Used for navigation within long documents. Typically, GitHub automatically generates invisible anchors for all headings (converting headings to lowercase and replacing spaces with hyphens).

\`\`\`markdown
Click here to jump back to [Table of Contents](#table-of-contents).
Or use HTML to set a custom anchor <a name="my-anchor"></a>
\`\`\`

**Rendered Result:** [Table of Contents](#basic-markdown-syntax-most-commonly-used)

### 4. Admonitions

Special blocks used in documentation to attract reader attention. GitHub recently officially launched support for these.

\`\`\`markdown
> [!NOTE]
> This is a note providing useful background information.

> [!WARNING]
> This is a warning alerting you to potential risks.
\`\`\`

### 5. Other Specific Parser Extensions

- **Definition Lists**: \`Term \\n : Definition\` (supported by some parsers, not natively supported in GFM).
- **Superscript and Subscript**: Use \`^superscript^\` and \`~subscript~\` (recommend using HTML \`<sup>\` and \`<sub>\` directly for compatibility).
- **Highlight Marking**: Use \`==highlighted content==\` (requires Typora or Markdown Preview Enhanced plugin support).

## Recommended Reading and Tools

You've now mastered the core secrets of Markdown! Theory combined with practice makes perfect. Here are some highly recommended resources:

- **Official and Authoritative Specifications**:
  - [GitHub Flavored Markdown (GFM) Official Documentation](https://github.github.com/gfm/) - The ultimate reference for writing open source project documentation.
  - [Markdown Official Syntax Guide (John Gruber)](https://www.markdownguide.org/) - The original document from Markdown's creator.
- **Recommended Editors**:
  - [VS Code](https://code.visualstudio.com/) - Extremely powerful with plugins, the top choice for developers.
  - [Typora](https://typora.io/) - The ultimate "What You See Is What You Get" Markdown writing experience.
  - [Obsidian](https://obsidian.md/) - A networked knowledge management tool based on Markdown.
- **Online Practice and Tools**:
  - [Dillinger](https://dillinger.io/) - Online Markdown editing and real-time previewer.
  - [Shields.io](https://shields.io/) - Create custom badges for your open source projects.

Now, open your editor, create a \`README.md\`, and start your creative and open source journey!
`;export{e as default};
//# sourceMappingURL=2023-07-23-markdown-tutorial-en-qIxRomPj.js.map