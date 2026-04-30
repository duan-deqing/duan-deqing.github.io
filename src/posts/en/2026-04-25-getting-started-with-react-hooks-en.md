---
title: "Getting Started with React Hooks"
excerpt: "Learn how to use React Hooks to build more elegant and maintainable components."
category: "tutorial"
readTime: "5 min read"
author: "STYLAN"
tags: ["React", "JavaScript", "Hooks"]
featured: true
---

## What are React Hooks?

React Hooks is a new feature introduced in React 16.8 that allows you to use state and other React features without writing a class.

## Why use Hooks?

Before Hooks appeared, if we wanted to use state in a component, we had to use class components. This brought some problems:

1. **Complex component logic**: As component functionality increases, the logic in lifecycle methods becomes more and more complex
2. **Difficult to reuse state logic**: It becomes difficult to reuse state logic between components
3. **Difficult to understand classes**: Concepts like `this` binding and lifecycle methods are not friendly to beginners

## Common Hooks

### useState

`useState` is the most basic Hook, used to add state to function components:

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### useEffect

`useEffect` is used to handle side effects, such as data fetching, subscriptions, or manual DOM manipulation:

```jsx
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### useContext

`useContext` is used to pass data through the component tree without passing props down manually at every level:

```jsx
const ThemeContext = React.createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>I am styled by theme context!</button>;
}
```

## Custom Hooks

Custom Hooks are a way to reuse state logic. Through custom Hooks, you can extract component logic into reusable functions.

```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

## Summary

React Hooks provides a more concise and intuitive way to write React components. By using Hooks, we can:

- Use state and other React features in function components
- Reuse state logic more easily
- Make code easier to understand and test

Hopefully this article helps you get started with React Hooks!