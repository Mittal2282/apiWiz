import { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { toPng } from 'html-to-image';

function TreeVisualization({
  nodes,
  edges,
  searchPath,
  setSearchPath,
  searchResult,
  handleSearch,
  hoverInfo,
  handleNodeClick,
  setHoverInfo,
  isDark,
  reactFlowInstance,
}) {
  const flowWrapperRef = useRef(null);
  const reactFlowRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onInit = useCallback((rfInstance) => {
    if (reactFlowInstance) {
      reactFlowInstance.current = rfInstance;
    }
    // Store the instance for image download
    reactFlowRef.current = rfInstance;
  }, [reactFlowInstance]);

  const handleMouseEnter = useCallback((event, node) => {
    setHoverInfo(node.data);
  }, [setHoverInfo]);

  const handleMouseLeave = useCallback(() => {
    setHoverInfo(null);
  }, [setHoverInfo]);

  const [internalNodes, setInternalNodes, onNodesChangeInternal] = useNodesState(nodes);
  const [internalEdges, setInternalEdges, onEdgesChangeInternal] = useEdgesState(edges);

  // Sync external nodes/edges changes to internal state
  useEffect(() => {
    setInternalNodes(nodes);
  }, [nodes, setInternalNodes]);

  useEffect(() => {
    setInternalEdges(edges);
  }, [edges, setInternalEdges]);

  const memoizedNodes = useMemo(() => internalNodes, [internalNodes]);
  const memoizedEdges = useMemo(() => internalEdges, [internalEdges]);

  const handleDownloadImage = async () => {
    if (nodes.length === 0) {
      alert('Please generate a tree first');
      return;
    }

    try {
      // Get the React Flow instance
      const rfInstance = reactFlowRef.current;
      if (!rfInstance) {
        alert('Flow not initialized');
        return;
      }

      // Fit view to show all nodes before capturing
      rfInstance.fitView({ padding: 0.2, duration: 0 });
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get the viewport container
      const flowContainer = document.querySelector('.react-flow__viewport');
      if (!flowContainer) {
        throw new Error('Could not find React Flow viewport');
      }

      // Hide controls and minimap temporarily
      const controls = document.querySelector('.react-flow__controls');
      const minimap = document.querySelector('.react-flow__minimap');
      const attribution = document.querySelector('.react-flow__attribution');
      
      if (controls) controls.style.display = 'none';
      if (minimap) minimap.style.display = 'none';
      if (attribution) attribution.style.display = 'none';

      const dataUrl = await toPng(flowContainer, {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        pixelRatio: 2,
        quality: 1,
        cacheBust: true,
      });

      // Restore controls and minimap
      if (controls) controls.style.display = '';
      if (minimap) minimap.style.display = '';
      if (attribution) attribution.style.display = '';

      const link = document.createElement('a');
      link.download = `json-tree-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
      
      // Restore controls and minimap in case of error
      const controls = document.querySelector('.react-flow__controls');
      const minimap = document.querySelector('.react-flow__minimap');
      const attribution = document.querySelector('.react-flow__attribution');
      if (controls) controls.style.display = '';
      if (minimap) minimap.style.display = '';
      if (attribution) attribution.style.display = '';
    }
  };

  const handleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await flowWrapperRef.current?.requestFullscreen();
        setIsFullscreen(true);
        // Force layout recalculation on entering fullscreen
        setTimeout(() => {
          if (reactFlowRef.current) {
            reactFlowRef.current.fitView();
          }
        }, 100);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
        // Force layout recalculation on exiting fullscreen
        setTimeout(() => {
          if (reactFlowRef.current) {
            reactFlowRef.current.fitView();
          }
        }, 100);
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        // Force layout recalculation when exiting fullscreen
        setTimeout(() => {
          if (reactFlowRef.current) {
            reactFlowRef.current.fitView();
          }
        }, 200);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [reactFlowInstance]);

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} border rounded ${isDark ? 'border-gray-700' : 'border-gray-200'} p-3 flex flex-col h-full`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">Tree Visualization</h2>
        {nodes.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleFullscreen}
              className={`px-2 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-800 text-white'
              }`}
              title="Toggle fullscreen"
            >
              {isFullscreen ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Exit
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" />
                  </svg>
                  Fullscreen
                </>
              )}
            </button>
            <button
              onClick={handleDownloadImage}
              className={`px-2 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-800 text-white'
              }`}
              title="Download tree as PNG image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download
            </button>
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchPath}
            onChange={(e) => setSearchPath(e.target.value)}
            placeholder="Search by path (e.g., user.address.city or items[0].name)"
            className={`flex-1 px-2 py-1 border rounded text-xs ${
              isDark ? 'bg-gray-900 text-white border-gray-600' : 'bg-gray-50 border-gray-300'
            }`}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-800 text-white'
            }`}
          >
            Search
          </button>
        </div>
        {searchResult === 'match' && (
          <div className="mt-1 text-green-500 text-xs">✓ Match found!</div>
        )}
        {searchResult === 'no-match' && (
          <div className="mt-1 text-red-500 text-xs">✗ No match found</div>
        )}
      </div>

      <div className={`mb-2 px-2 py-1.5 min-h-[48px] flex flex-col justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-300'} rounded text-[10px]`}>
        {hoverInfo ? (
          <>
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.734.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L7 9.214l.254.868a1 1 0 11-.992 1.736l-1.234-.708v2.5a1 1 0 11-2 0v-2.5a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm12 0a1 1 0 011.364-.372l1.234.708v-2.5a1 1 0 112 0v2.5a.996.996 0 01.52.878l-1.234.708a1 1 0 11-.992-1.736l.254-.868-1.254-.868a1 1 0 01-.372-1.364zM10 13.549a1 1 0 01.996.908l.004.05v2.51a1 1 0 11-2 0v-2.51a1 1 0 01.996-.909z" clipRule="evenodd" />
              </svg>
              <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`}><strong>Path:</strong> {hoverInfo.path}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`}><strong>Value:</strong> {hoverInfo.value}</span>
            </div>
          </>
        ) : (
          <div className={`flex items-center gap-2 text-center justify-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px]">Hover over nodes to see details</span>
          </div>
        )}
      </div>

      <div className={`flex-1 border ${isDark ? 'border-gray-600' : 'border-gray-300'} rounded overflow-hidden`} ref={flowWrapperRef} style={{ minHeight: '200px' }}>
        {nodes.length > 0 ? (
          <ReactFlowProvider>
            <ReactFlow
              ref={reactFlowRef}
              nodes={memoizedNodes}
              edges={memoizedEdges}
              onNodeClick={handleNodeClick}
              onNodeMouseEnter={handleMouseEnter}
              onNodeMouseLeave={handleMouseLeave}
              onInit={onInit}
              onNodesChange={onNodesChangeInternal}
              onEdgesChange={onEdgesChangeInternal}
              nodesDraggable={true}
              nodesConnectable={false}
              elementsSelectable={true}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              defaultEdgeOptions={{
                type: 'smoothstep',
                animated: true,
                style: { stroke: isDark ? '#6b7280' : '#000000', strokeWidth: 2 }
              }}
              className={isDark ? 'bg-gray-900' : 'bg-white'}
              style={{ width: '100%', height: '100%' }}
            >
              <Background color={isDark ? '#4b5563' : '#e5e7eb'} gap={12} />
              <Controls />
              <MiniMap 
                maskColor={isDark ? '#111827' : '#f9fafb'}
                nodeColor={(node) => {
                  if (node.data.type === 'object') return '#6366f1';
                  if (node.data.type === 'array') return '#10b981';
                  return '#f59e0b';
                }}
              />
            </ReactFlow>
          </ReactFlowProvider>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Generate a tree to visualize
          </div>
        )}
      </div>

      <div className={`mt-2 text-[10px] flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <span>Drag nodes to reposition | Click nodes to copy | Hover for details | Colors: Blue=Object, Green=Array, Orange=Primitive</span>
      </div>
    </div>
  );
}

export default TreeVisualization;

