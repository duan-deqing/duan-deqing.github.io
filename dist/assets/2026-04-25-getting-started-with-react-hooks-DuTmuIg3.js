var e=`---\r
title:\r
  en: "Getting Started with React Hooks"\r
  zh: "React Hooks 入门指南"\r
excerpt:\r
  en: "Learn how to use React Hooks to build more elegant and maintainable components."\r
  zh: "学习如何使用 React Hooks 构建更优雅、可维护的组件。"\r
category: "tutorial"\r
readTime:\r
  en: "5 min read"\r
  zh: "5 分钟阅读"\r
author:\r
  en: "STYLAN"\r
  zh: "STYLAN"\r
tags: ["React", "JavaScript", "Hooks"]\r
featured: true\r
---\r
\r
# React Hooks 入门指南\r
\r
## 什么是 React Hooks？\r
\r
React Hooks 是 React 16.8 引入的新特性，它允许你在不编写 class 的情况下使用 state 以及其他的 React 特性。\r
\r
## 为什么使用 Hooks？\r
\r
在 Hooks 出现之前，如果我们想在组件中使用 state，就必须使用 class 组件。这带来了一些问题：\r
\r
1. **复杂的组件逻辑**：随着组件功能的增加，生命周期方法中的逻辑会变得越来越复杂\r
2. **难以复用状态逻辑**：在组件之间复用状态逻辑变得困难\r
3. **难以理解的 class**：this 绑定、生命周期方法等概念对新手不友好\r
\r
## 常用 Hooks\r
\r
### useState\r
\r
\`useState\` 是最基础的 Hook，用于在函数组件中添加 state：\r
\r
\`\`\`jsx\r
import { useState } from "react";\r
\r
function Counter() {\r
  const [count, setCount] = useState(0);\r
\r
  return (\r
    <div>\r
      <p>You clicked {count} times</p>\r
      <button onClick={() => setCount(count + 1)}>Click me</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### useEffect\r
\r
\`useEffect\` 用于处理副作用，如数据获取、订阅或手动修改 DOM：\r
\r
\`\`\`jsx\r
import { useState, useEffect } from "react";\r
\r
function Example() {\r
  const [count, setCount] = useState(0);\r
\r
  useEffect(() => {\r
    document.title = \`You clicked \${count} times\`;\r
  });\r
\r
  return (\r
    <div>\r
      <p>You clicked {count} times</p>\r
      <button onClick={() => setCount(count + 1)}>Click me</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### useContext\r
\r
\`useContext\` 用于在组件树中传递数据，避免逐层传递 props：\r
\r
\`\`\`jsx\r
const ThemeContext = React.createContext("light");\r
\r
function ThemedButton() {\r
  const theme = useContext(ThemeContext);\r
  return <button className={theme}>I am styled by theme context!</button>;\r
}\r
\`\`\`\r
\r
## 自定义 Hooks\r
\r
自定义 Hooks 是复用状态逻辑的一种方式。通过自定义 Hook，你可以将组件逻辑提取到可重用的函数中。\r
\r
\`\`\`jsx\r
function useWindowSize() {\r
  const [size, setSize] = useState({\r
    width: window.innerWidth,\r
    height: window.innerHeight,\r
  });\r
\r
  useEffect(() => {\r
    const handleResize = () => {\r
      setSize({\r
        width: window.innerWidth,\r
        height: window.innerHeight,\r
      });\r
    };\r
\r
    window.addEventListener("resize", handleResize);\r
    return () => window.removeEventListener("resize", handleResize);\r
  }, []);\r
\r
  return size;\r
}\r
\`\`\`\r
\r
## 总结\r
\r
React Hooks 提供了一种更简洁、更直观的方式来编写 React 组件。通过使用 Hooks，我们可以：\r
\r
- 在函数组件中使用 state 和其他 React 特性\r
- 更容易地复用状态逻辑\r
- 让代码更易于理解和测试\r
\r
希望这篇文章能帮助你入门 React Hooks！\r
\r
![娜娜莉](./img/2026-04-25-getting-started-with-react-hooks/134637964_p0.jpg)\r
`;export{e as default};
//# sourceMappingURL=2026-04-25-getting-started-with-react-hooks-DuTmuIg3.js.map