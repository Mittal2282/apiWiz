# Architecture & Implementation Details

## Component Structure

The application is built as a single-page application with the following main components:

### Main Component: `JSONTreeVisualizer`
Located in `src/App.jsx`, this is the primary component that manages the application state and renders the UI.

### Key Sub-Components

1. **FlowControls** - Custom controls panel with zoom and fit view buttons
2. **React Flow Elements**:
   - Background - Grid pattern
   - Controls - Default zoom/pan controls
   - MiniMap - Navigation overview
   - Custom nodes - With color-coded styling

## State Management

The application uses React's `useState` and `useEffect` hooks for state management:

- `jsonInput` - Raw JSON string from textarea
- `jsonData` - Parsed JSON object
- `error` - JSON parsing error message
- `searchPath` - Current search query
- `searchResult` - Search result status
- `highlightNodeId` - Currently highlighted node ID
- `hoverInfo` - Information for hover tooltip
- `isDark` - Theme mode flag
- `nodes` - React Flow node array
- `edges` - React Flow edge array

## Tree Generation Algorithm

The tree generation uses a recursive approach:

```javascript
processValue(key, value, path, parentId, level, startY) {
  1. Create node at current position
  2. Calculate x-position based on nesting level (level * 200)
  3. Calculate y-position based on accumulated height
  4. If value is object/array, recursively process children
  5. Return updated y-position for next node
}
```

### Node Positioning
- Horizontal: Each nesting level adds 200px to x-axis
- Vertical: Nodes are positioned 80px apart on y-axis
- Starting position: Y starts at 50px from top

## Color Coding

- **Objects** (#6366f1 - Indigo): Represent object keys in JSON
- **Arrays** (#10b981 - Green): Represent array indices and length
- **Primitives** (#f59e0b - Amber): Represent string, number, boolean, null values

## Search Implementation

The search function:
1. Converts search path to lowercase for case-insensitive matching
2. Filters nodes where path includes the search query
3. Highlights first match with red border
4. Shows appropriate success/failure message

## Interactive Features

### 1. Node Click Handler
```javascript
handleNodeClick(event, node) {
  navigator.clipboard.writeText(node.data.path)
  alert(`Path copied: ${node.data.path}`)
}
```

### 2. Hover Tooltip
Displays node information including:
- Full JSON path
- Node value

### 3. Theme Toggle
- Toggles `dark` class on root HTML element
- Applies conditional Tailwind classes based on theme
- Smooth transitions via CSS

### 4. Zoom Controls
Uses React Flow's `useReactFlow` hook:
- `zoomIn()` - Increases zoom by 0.2
- `zoomOut()` - Decreases zoom by 0.2
- `fitView({ padding: 0.2 })` - Fits all nodes in viewport

## Styling

The application uses Tailwind CSS v4 with:
- Utility-first approach
- Responsive design (grid layout with 2 columns on large screens)
- Dark mode support via class-based theming
- Custom animations for highlighted nodes

## Key Technologies

### React Flow
- `ReactFlow` - Main component
- `Background` - Grid pattern
- `Controls` - Zoom/pan controls
- `MiniMap` - Navigation overview
- `Panel` - Custom control panel
- `useReactFlow` - Hook for programmatic control

### React Hooks Used
- `useState` - Component state
- `useEffect` - Side effects (tree generation, theme application)
- `useCallback` - Memoized tree generation function

### Browser APIs
- `navigator.clipboard` - Copy path to clipboard
- `JSON.parse/stringify` - JSON parsing

## Error Handling

1. **JSON Validation**: Try-catch block in `handleGenerateTree()`
2. **Search Handling**: Returns 'no-match' when no results found
3. **UI Feedback**: Error messages displayed in red text below input

## Performance Considerations

- Tree generation is memoized with `useCallback`
- Dependencies: `highlightNodeId` (re-runs when highlighting changes)
- Node updates use functional setState to avoid stale closures

## Accessibility Features

- Keyboard support: Enter key triggers search
- Semantic HTML elements
- Color contrast meets WCAG guidelines
- Clear visual feedback for all interactions

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires support for:
  - ES6+ features
  - React 19
  - Clipboard API
  - CSS Grid

## Build Output

Production build creates optimized assets:
- `index.html` - Entry HTML
- `index-[hash].css` - Compiled CSS (~20KB gzipped: 4.79KB)
- `index-[hash].js` - Compiled JS (~348KB gzipped: 111.67KB)

Total bundle size: ~116.46KB (gzipped)

