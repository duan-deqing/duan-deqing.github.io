---
title:
  en: "Vim Editor Basic Usage Tutorial"
  zh: "Vim编辑器基础使用教程"
excerpt:
  en: "Vim Basic Text Editor Usage Guide."
  zh: "Linux基础文本编辑器Vim使用指南"
category: "Tutorials"
readTime:
  en: "3 min read"
  zh: "3 分钟阅读"
author:
  en: "STYLAN"
  zh: "STYLAN"
tags: ["Tutorial", "Tools"]
featured: false # 是否精选
---

# Vim 编辑器基础使用教程

## 启动 Vim

打开终端，并输入以下命令启动 Vim 编辑器

```bash
vim
# 或者 vim text.txt
```

## 模式切换

Vim 有两种主要的模式：命令模式和插入模式。

- 命令模式：默认启动后的模式，用于导航和执行命令。
- 插入模式：按下 `i` 键进入插入模式，可以输入文本。

## 文本导航（文本移动）

在命令模式下进行文本导航：使用箭头键或 `h, j, k, l `进行上下左右导航。

- `w`：向前移动一个单词。
- `b`：向后移动一个单词。
- `0`：移动到行首。
- `$`：移动到行尾。
- `gg`：跳转到文件开头。
- `G`：跳转到文件末尾。

## 文本编辑

在命令模式下进行文本编辑：

- `x`：删除当前光标所在处的字符。
- `dd`：删除当前行。
- `yy`：复制当前行。
- `p`：粘贴文本。

## 保存和退出

在命令模式下保存和退出：

- `:w`：保存文件。
- `:q`：退出 Vim。
- `:wq`：保存并退出。
- `:q!`：强制退出（不保存）。

## 其他常用命令

- `:set number`：显示行号。
- `:set nonumber`：隐藏行号。
- `:find filename`：查找并打开名为 filename 的文件。
- `:help`：获取帮助文档。
