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

# Vim Editor Basic Usage Tutorial

## Start Vim

Open the terminal and enter the following command to launch the Vim editor:

```bash
vim
# or vim test.txt
```

## Mode switching

Vim has two main modes: command mode and insert mode.

- Command mode: The default startup mode, used for navigation and executing commands.
- Insert mode: Press the `i` key to enter insert mode, where you can enter text.

## Text navigation (text movement)

Navigate text in command mode: Use the arrow keys or `h, j, k, l` to navigate up, down, left, and right.

- `w` : Move forward one word.
- `b` : Move one word backward.
- `0` : Move to the beginning of the line.
- `$` : Move to the end of the line.
- `gg` : Jump to the beginning of the file.
- `G` : Jump to the end of the file.

## Text editing

Edit text in command mode:

- `x` : Deletes the character at the current cursor position.
- `dd` : Delete the current line.
- `yy` : Copy the current line.
- `p` : Paste text.

## Save and Exit

Save and exit in command mode:

- `:w` : Save the file.
- `:q` : Exit Vim.
- `:wq` : Save and exit.
- `:q!` : Force quit (without saving).

## Other commonly used commands

- `:set number` : Displays line numbers.
- `:set nonumber` : Hides line numbers.
- `:find filename` : Finds and opens the file named filename.
- `:help` : Get help documentation.
