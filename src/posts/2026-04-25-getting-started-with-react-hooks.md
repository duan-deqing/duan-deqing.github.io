---
title:
  en: "Getting Started with React Hooks"
  zh: "React Hooks 入门指南"
excerpt:
  en: "Learn how to use React Hooks to build more elegant and maintainable components."
  zh: "学习如何使用 React Hooks 构建更优雅、可维护的组件。"
category: "tutorial"
readTime:
  en: "5 min read"
  zh: "5 分钟阅读"
author:
  en: "STYLAN"
  zh: "STYLAN"
tags: ["React", "JavaScript", "Hooks"]
featured: true
---

# React Hooks 入门指南

## 什么是 React Hooks？

React Hooks 是 React 16.8 引入的新特性，它允许你在不编写 class 的情况下使用 state 以及其他的 React 特性。

## 为什么使用 Hooks？

在 Hooks 出现之前，如果我们想在组件中使用 state，就必须使用 class 组件。这带来了一些问题：

1. **复杂的组件逻辑**：随着组件功能的增加，生命周期方法中的逻辑会变得越来越复杂
2. **难以复用状态逻辑**：在组件之间复用状态逻辑变得困难
3. **难以理解的 class**：this 绑定、生命周期方法等概念对新手不友好

## 常用 Hooks

### useState

`useState` 是最基础的 Hook，用于在函数组件中添加 state：

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### useEffect

`useEffect` 用于处理副作用，如数据获取、订阅或手动修改 DOM：

```jsx
import { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### useContext

`useContext` 用于在组件树中传递数据，避免逐层传递 props：

```jsx
const ThemeContext = React.createContext("light");

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>I am styled by theme context!</button>;
}
```

## 自定义 Hooks

自定义 Hooks 是复用状态逻辑的一种方式。通过自定义 Hook，你可以将组件逻辑提取到可重用的函数中。

```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
```

## 总结

React Hooks 提供了一种更简洁、更直观的方式来编写 React 组件。通过使用 Hooks，我们可以：

- 在函数组件中使用 state 和其他 React 特性
- 更容易地复用状态逻辑
- 让代码更易于理解和测试

希望这篇文章能帮助你入门 React Hooks！

![娜娜莉](./img/2026-04-25-getting-started-with-react-hooks/134637964_p0.jpg)
