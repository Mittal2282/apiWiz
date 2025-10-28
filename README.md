# JSON Tree Visualizer

A web application for visualizing JSON data as an interactive tree diagram. Built with React and React Flow for exploring and understanding complex JSON structures.

## Overview

This tool provides a split-panel interface with a JSON editor on the left and a tree visualization on the right. JSON data is parsed and rendered as nodes connected by edges, making it easier to navigate nested structures and understand relationships between data points.

## Features

### Editor Panel

- Monaco Editor integration with syntax highlighting
- JSON validation with inline error messages
- Import JSON files from disk
- Format, fold, and unfold document actions
- Sample JSON populated by default
- Reset button to restore initial state

### Visualization Panel

Tree rendering of JSON structure with:

- Color-coded node types: Blue for objects, green for arrays, orange for primitives
- Click nodes to copy their JSON path to clipboard
- Hover over nodes to display path and value information
- Fullscreen mode for focused viewing
- Download tree as PNG image
- Pan and zoom controls
- Mini map for navigation
- Draggable nodes for custom positioning

### Search & Navigation

- Search by JSON path (e.g., `user.address.city`, `items[0].name`)
- Auto-zoom to matched nodes
- Visual highlighting of search results
- Path normalization supports various notations

### UI & Themes

- Dark and light mode toggle
- Responsive grid layout
- Toast notifications for user actions
- Minimalist design with Tailwind CSS

## Installation

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Usage

1. Input JSON in the editor panel (use the import button for files)
2. Click "Generate Tree" to render the visualization
3. Use the search bar to find specific paths in the JSON
4. Hover nodes to inspect path and value details
5. Click nodes to copy their path to clipboard
6. Use fullscreen and download options in the toolbar
7. Toggle dark mode via the navbar control

### Search Examples

- `user` - matches user object
- `user.name` - finds name property
- `user.address.city` - navigates nested objects
- `items[0]` - locates first array element
- `items[0].name` - gets property within array item

## Project Structure

```
src/
├── App.jsx                      # Main component, state management
├── main.jsx                     # React entry point
├── index.css                    # Global styles
├── components/
│   ├── JSONInput.jsx           # Monaco editor wrapper
│   ├── TreeVisualization.jsx   # React Flow rendering
│   ├── Navbar.jsx              # Navigation bar
│   ├── ThemeToggle.jsx         # Dark mode switcher
│   └── Toast.jsx                # Notification system
└── utils/
    ├── treeGenerator.js        # JSON to nodes/edges conversion
    └── searchUtils.js          # Path matching logic
```

## How It Works

### Tree Generation

The app recursively processes JSON values to create node graphs:

- Objects render as blue nodes showing their key
- Arrays render as green nodes showing index notation and length
- Primitives render as orange nodes with their key-value pair
- Each nesting level offsets 250px horizontally
- Children are spaced 100px apart vertically

Nodes carry metadata including their JSON path, node type, and display value. Edges connect parent nodes to children using animated smoothstep lines.

### Search Implementation

Search uses normalized path matching to compare query strings against node paths. It:

- Strips leading `$` or `.` prefixes
- Converts to lowercase for case-insensitive matching
- Splits paths by `.` and `[` delimiters
- Matches segment by segment for partial path queries

### State Management

Component state tracks:

- Raw JSON input string
- Parsed JSON data object
- Validation errors
- Current search query and results
- Highlighted node ID
- Hover information
- Theme preference
- Toast messages and visibility

## Dependencies

- **react** - UI library
- **react-dom** - React DOM bindings
- **reactflow** - Graph visualization
- **@monaco-editor/react** - Code editor
- **tailwindcss** - CSS framework
- **html-to-image** - PNG export
- **vite** - Build tool

## Browser Support

Works in modern browsers that support:

- ES6+ JavaScript
- React 19
- Clipboard API
- Fullscreen API
- CSS Grid

## Build Output

Production build generates:

- `index.html` - Entry HTML file
- `assets/index-[hash].css` - Compiled styles
- `assets/index-[hash].js` - Bundled JavaScript

Bundle size is approximately 112KB gzipped.
