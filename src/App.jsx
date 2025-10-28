import { useState, useEffect, useCallback, useRef } from 'react';
import JSONInput from './components/JSONInput';
import TreeVisualization from './components/TreeVisualization';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import { generateNodesAndEdges } from './utils/treeGenerator';
import { pathMatches } from './utils/searchUtils';

const sampleJSON = {
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "country": "USA"
    }
  },
  "items": [
    {
      "name": "item1",
      "price": 10.99
    },
    {
      "name": "item2",
      "price": 20.99
    }
  ],
  "tags": ["important", "featured"]
};

function JSONTreeVisualizer() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(sampleJSON, null, 2));
  const [jsonData, setJsonData] = useState(sampleJSON);
  const [error, setError] = useState('');
  const [searchPath, setSearchPath] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [highlightNodeId, setHighlightNodeId] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const reactFlowInstance = useRef(null);

  const handleGenerateTree = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonData(parsed);
      setError('');
      setSearchResult(null);
      setHighlightNodeId(null);
    } catch (e) {
      setError('Invalid JSON format!');
      setJsonData(null);
      setNodes([]);
      setEdges([]);
    }
  };

  useEffect(() => {
    if (jsonData) {
      const { nodes: newNodes, edges: newEdges } = generateNodesAndEdges(jsonData, highlightNodeId, isDark);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [jsonData, highlightNodeId, isDark]);

  const handleSearch = () => {
    if (!searchPath.trim() || !jsonData) {
      setSearchResult(null);
      setHighlightNodeId(null);
      return;
    }

    // Find nodes that match the search path
    const foundNodes = nodes.filter(n => pathMatches(n.data.path, searchPath));

    if (foundNodes.length > 0) {
      const matchedNode = foundNodes[0];
      const nodeId = matchedNode.id;
      setHighlightNodeId(nodeId);
      setSearchResult('match');
      
      // Pan and center the matched node
      if (reactFlowInstance.current) {
        reactFlowInstance.current.fitView({
          padding: 0.3,
          includeHiddenNodes: false,
        });
        
        // Center on the specific node
        setTimeout(() => {
          if (reactFlowInstance.current) {
            reactFlowInstance.current.setCenter(matchedNode.position.x, matchedNode.position.y, {
              zoom: 1.5,
              duration: 500,
            });
          }
        }, 100);
      }
    } else {
      setSearchResult('no-match');
      setHighlightNodeId(null);
    }
  };

  const handleNodeClick = useCallback((event, node) => {
    navigator.clipboard.writeText(node.data.path);
    setToastMessage(`Copied: ${node.data.path}`);
    setShowToast(true);
  }, []);

  const handleHoverInfo = useCallback((info) => {
    setHoverInfo(info);
  }, []);

  const handleClear = () => {
    setJsonInput(JSON.stringify(sampleJSON, null, 2));
    setJsonData(sampleJSON);
    setNodes([]);
    setEdges([]);
    setError('');
    setSearchPath('');
    setSearchResult(null);
    setHighlightNodeId(null);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)}
        isDark={isDark}
      />
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-100px)]">
          <JSONInput
            jsonInput={jsonInput}
            setJsonInput={setJsonInput}
            error={error}
            isDark={isDark}
            handleGenerateTree={handleGenerateTree}
            handleClear={handleClear}
          />

          <TreeVisualization
            nodes={nodes}
            edges={edges}
            searchPath={searchPath}
            setSearchPath={setSearchPath}
            searchResult={searchResult}
            handleSearch={handleSearch}
            hoverInfo={hoverInfo}
            handleNodeClick={handleNodeClick}
            setHoverInfo={handleHoverInfo}
            isDark={isDark}
            reactFlowInstance={reactFlowInstance}
          />
        </div>
      </div>

      <style>{`
        .highlighted-node {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default JSONTreeVisualizer;
