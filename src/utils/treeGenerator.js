export const generateNodesAndEdges = (data, highlightNodeId, isDark = false) => {
  if (!data) return { nodes: [], edges: [] };
  
  const nodes = [];
  const edges = [];
  let nodeIdCounter = 0;
  const nodePositions = new Map();
  
  const createNode = (label, type, path, value, x, y) => {
    const id = `node-${nodeIdCounter++}`;
    let bgColor = '#f59e0b';
    
    if (type === 'object') bgColor = '#6366f1';
    else if (type === 'array') bgColor = '#10b981';
    
    return {
      id,
      type: 'default',
      position: { x, y },
      data: { label, type, path, value },
      style: {
        background: bgColor,
        color: '#fff',
        border: id === highlightNodeId ? '4px solid #f59e0b' : '2px solid #fff',
        borderRadius: '8px',
        padding: '8px 12px',
        fontWeight: 500,
        fontSize: '14px',
        minWidth: '80px',
        textAlign: 'center',
        boxShadow: id === highlightNodeId ? '0 0 20px rgba(245, 158, 11, 0.5)' : 'none',
      },
      className: id === highlightNodeId ? 'highlighted-node' : '',
    };
  };

  const processValue = (key, value, path, parentId, level, xOffset = 0) => {
    const x = level * 250; // Horizontal spacing between levels
    const y = xOffset; // Vertical position (will be adjusted for siblings)
    
    let nodeType = 'primitive';
    let label = `${key}: ${String(value)}`;
    let displayValue = value;

    if (Array.isArray(value)) {
      nodeType = 'array';
      label = `${key} [${value.length}]`;
      displayValue = `Array[${value.length}]`;
    } else if (typeof value === 'object' && value !== null) {
      nodeType = 'object';
      label = key;
      displayValue = 'Object';
    }

    const node = createNode(label, nodeType, path, displayValue, x, y);
    nodes.push(node);
    nodePositions.set(path, y);

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        animated: true,
        style: {
          stroke: isDark ? '#6b7280' : '#000000',
          strokeWidth: 2,
        },
        type: 'smoothstep',
      });
    }

    let nextYOffset = y + 100; // Space for next node vertically
    
    // Process children horizontally at the same Y level
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, idx) => {
          nextYOffset = processValue(`[${idx}]`, item, `${path}[${idx}]`, node.id, level + 1, nextYOffset);
        });
      } else {
        Object.entries(value).forEach(([k, v]) => {
          nextYOffset = processValue(k, v, `${path}.${k}`, node.id, level + 1, nextYOffset);
        });
      }
    }
    
    return nextYOffset;
  };

  if (Array.isArray(data)) {
    let startY = 100;
    data.forEach((item, idx) => {
      startY = processValue(`[${idx}]`, item, `[${idx}]`, null, 0, startY);
    });
  } else if (typeof data === 'object' && data !== null) {
    let startY = 100;
    Object.entries(data).forEach(([key, value]) => {
      startY = processValue(key, value, key, null, 0, startY);
    });
  }

  // Center the tree horizontally by finding the min X and adjusting
  if (nodes.length > 0) {
    const minX = Math.min(...nodes.map(n => n.position.x));
    const maxX = Math.max(...nodes.map(n => n.position.x));
    const centerX = (minX + maxX) / 2;
    const offsetX = 400 - centerX;
    
    nodes.forEach(node => {
      node.position.x += offsetX;
    });
  }

  return { nodes, edges };
};

