var e=`---\r
title: "Getting Started with React Hooks"\r
excerpt: "Learn how to use React Hooks to build more elegant and maintainable components."\r
category: "tutorial"\r
readTime: "5 min read"\r
author: "STYLAN"\r
tags: ["React", "JavaScript", "Hooks"]\r
featured: true\r
---\r
\r
## What are React Hooks?\r
\r
React Hooks is a new feature introduced in React 16.8 that allows you to use state and other React features without writing a class.\r
\r
## Why use Hooks?\r
\r
Before Hooks appeared, if we wanted to use state in a component, we had to use class components. This brought some problems:\r
\r
1. **Complex component logic**: As component functionality increases, the logic in lifecycle methods becomes more and more complex\r
2. **Difficult to reuse state logic**: It becomes difficult to reuse state logic between components\r
3. **Difficult to understand classes**: Concepts like \`this\` binding and lifecycle methods are not friendly to beginners\r
\r
## Common Hooks\r
\r
### useState\r
\r
\`useState\` is the most basic Hook, used to add state to function components:\r
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
\`useEffect\` is used to handle side effects, such as data fetching, subscriptions, or manual DOM manipulation:\r
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
\`useContext\` is used to pass data through the component tree without passing props down manually at every level:\r
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
## Custom Hooks\r
\r
Custom Hooks are a way to reuse state logic. Through custom Hooks, you can extract component logic into reusable functions.\r
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
## Summary\r
\r
React Hooks provides a more concise and intuitive way to write React components. By using Hooks, we can:\r
\r
- Use state and other React features in function components\r
- Reuse state logic more easily\r
- Make code easier to understand and test\r
\r
Hopefully this article helps you get started with React Hooks!\r
\r
![娜娜莉](./img/2026-04-25-getting-started-with-react-hooks/134637964_p0.jpg)\r
`;export{e as default};
//# sourceMappingURL=2026-04-25-getting-started-with-react-hooks-en-Bcik4kg0.js.map