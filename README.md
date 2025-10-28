# JSON Tree Visualizer

An interactive web application that visualizes JSON data as a hierarchical tree structure using React Flow.

## Features

### ✅ Mandatory Features (Implemented)

1. **JSON Input & Parsing**
   - Text area for pasting/typing JSON data
   - JSON validation with error messages
   - "Generate Tree" button
   - Sample JSON as placeholder
   - Clear/Reset functionality

2. **Tree Visualization using React Flow**
   - Hierarchical node tree displaying JSON structure
   - Color-coded node types:
     - **Blue/Purple** (#6366f1): Objects
     - **Green** (#10b981): Arrays
     - **Orange/Yellow** (#f59e0b): Primitives (strings, numbers, booleans, null)
   - Parent-child connections with lines
   - Smooth tree layout

3. **Search Functionality**
   - Search by JSON path (e.g., `user.address.city`, `items[0].name`)
   - Highlights matching nodes with red border
   - Shows "Match found" or "No match found" messages
   - Real-time search results

### ✅ Optional Features (Implemented)

1. **Zoom Controls**
   - Zoom In button
   - Zoom Out button
   - Fit View button
   - Integrated with React Flow's control panel

2. **Pan & Drag**
   - Full canvas panning support
   - Drag to navigate the tree
   - Smooth interaction

3. **Interactive Features**
   - Hover nodes to see path and value information
   - Click nodes to copy their JSON path to clipboard
   - Visual feedback on interactions

4. **Dark/Light Mode Toggle**
   - Beautiful theme switcher
   - Smooth transitions
   - Persists throughout the application

5. **Additional UI Elements**
   - Mini map for navigation
   - Background grid
   - Responsive layout
   - Clean, minimalistic design

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Usage

1. **Input JSON**: Paste or type your JSON data in the left panel
2. **Generate Tree**: Click the "Generate Tree" button to visualize your JSON
3. **Search**: Enter a path in the search bar (e.g., `user.name`) and click "Search"
4. **Explore**: 
   - Use zoom controls to adjust view
   - Drag to pan around the tree
   - Hover nodes to see details
   - Click nodes to copy their path
5. **Toggle Theme**: Use the dark/light mode toggle in the top right

## Examples

### Sample JSON Paths
- `user` - Find the user object
- `user.name` - Find the name property
- `user.address.city` - Find the city in address
- `items[0]` - Find first array item
- `items[0].name` - Find name in first item

## Technologies Used

- **React** - UI framework
- **React Flow** - Tree visualization
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **JavaScript** - Language

## Project Structure

```
apiWiz_assignment/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── public/
├── package.json
├── vite.config.js
└── README.md
```

## Key Features Explained

### Tree Generation Algorithm
The application uses a recursive algorithm to traverse the JSON structure and create nodes at appropriate positions. Each level of nesting is positioned 200px to the right, creating a clear hierarchical visualization.

### Node Types
- **Object nodes**: Blue background, display object keys
- **Array nodes**: Green background, show array indices and length
- **Primitive nodes**: Orange background, display key-value pairs

### Search Implementation
The search function filters nodes by path, allowing users to quickly locate specific data within complex JSON structures. Matching nodes are highlighted with a red border.

## License

This project is created as an assignment for APIWiz.

## Author

Built with ❤️ using React and React Flow
