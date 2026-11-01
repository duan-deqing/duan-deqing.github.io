---
title: "Vim Editor Basic Usage Tutorial"
date: "2026-05-08"
category: tutorial
duration: 3min
tags: [Tutorial, Tools]
excerpt: "Vim Basic Text Editor Usage Guide."
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
