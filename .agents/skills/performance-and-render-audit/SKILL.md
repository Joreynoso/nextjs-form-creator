---
name: performance-and-render-audit
description: Analyze Next.js components and pages for rendering errors, hydration mismatches, unnecessary re-renders, and performance bottlenecks. Use when asked to "check performance", "find rendering errors", "optimize rendering", or "audit performance".
metadata:
  author: system
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Performance and Render Audit Guidelines

Review React and Next.js files for performance bottlenecks, unnecessary re-renders, and potential rendering errors (like hydration mismatches).

## How It Works

1. Read the specified files (or prompt user for files/pattern if not provided).
2. Analyze the code against the performance and rendering rules defined below.
3. Output findings with specific file and line references, explaining the issue and proposing a fix.

## Guidelines

When auditing code, check for the following common issues:

### 1. Rendering Errors & Hydration Mismatches
- **Window/Document usage in SSR**: Direct use of `window`, `document`, or `localStorage` outside of `useEffect` or without proper checks in Client Components, which causes hydration errors during SSR.
- **Mismatched HTML tags**: Invalid nesting (e.g., `<div>` inside `<p>`, or `<a>` inside `<a>`) that can break hydration.
- **Dynamic Content during SSR**: Using `Math.random()`, `Date.now()`, or other dynamic values directly in the render phase without a `useEffect` to ensure they only run on the client.

### 2. Unnecessary Re-renders
- **Missing Memoization**: Lack of `useMemo` for expensive calculations or `useCallback` for functions passed as props to memoized child components.
- **Inline Objects/Functions**: Passing inline objects or functions as props to child components that rely on referential equality (e.g., `style={{ margin: 10 }}`).
- **State Colocation**: State that is lifted too high and causes unnecessary re-renders in unrelated components. Suggest moving state down when possible.

### 3. Next.js Specific Performance
- **Image Optimization**: Ensure the `next/image` component is used properly with appropriate `width`, `height`, `sizes`, or `fill` props instead of raw `<img>` tags. Use `priority` for above-the-fold images.
- **Link Component**: Ensure `next/link` is used for internal navigation instead of standard `<a>` tags.
- **Font Loading**: Ensure custom fonts are loaded optimally using `next/font`.
- **Server vs Client Components**: Check if `'use client'` is used unnecessarily. Encourage pushing Client Components down the tree to maximize Server Component usage.
- **Heavy Dependencies on Client**: Importing large libraries on the client side when they could be used exclusively on the server.

### 4. React Anti-patterns
- **Missing Keys in Lists**: Not using keys or using array indices as keys when rendering lists of elements.
- **Mutating State Directly**: Directly mutating arrays or objects in state instead of returning new copies.

## Output Format

Report issues in a structured way:
- **File & Line**: `path/to/file.tsx:line_number`
- **Issue Category**: (e.g., Hydration Risk, Performance, Next.js Best Practice)
- **Description**: What is wrong and why it is a problem.
- **Recommendation**: How to fix it (provide a short code snippet if helpful).
