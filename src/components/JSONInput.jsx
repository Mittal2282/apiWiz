import { useRef } from 'react';
import Editor from '@monaco-editor/react';

function JSONInput({
  jsonInput,
  setJsonInput,
  error,
  isDark,
  handleGenerateTree,
  handleClear,
}) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor settings
    editor.updateOptions({
      fontSize: 14,
      lineNumbers: 'on',
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true,
      suggest: {
        snippetsPreventQuickSuggestions: false,
      },
    });

    // Configure JSON language features
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemaValidation: 'error',
      schemaRequest: 'error',
      allowComments: false,
      trailingCommas: 'error',
    });

    // Add custom JSON schema if needed
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
    });
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const handleFoldAll = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.foldAll').run();
    }
  };

  const handleUnfoldAll = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.unfoldAll').run();
    }
  };

  const handleChange = (value) => {
    setJsonInput(value || '');
  };

  const handleImportFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      // Validate JSON
      JSON.parse(text);
      setJsonInput(text);
      // Clear file input
      event.target.value = '';
    } catch (error) {
      alert('Invalid JSON file!');
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} border rounded ${isDark ? 'border-gray-700' : 'border-gray-200'} flex flex-col h-full`}>
      <div className={`p-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
        <div className="flex justify-between items-center mb-1.5">
          <h2 className="text-base font-semibold">JSON Editor</h2>
          <div className="flex gap-2">
            <button
              onClick={handleImportFile}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-700 hover:bg-gray-800 text-white'
              }`}
              title="Import JSON file"
            >
              Import
            </button>
            <button
              onClick={handleFormat}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-700 hover:bg-gray-800 text-white'
              }`}
              title="Format JSON"
            >
              Format
            </button>
            <button
              onClick={handleFoldAll}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-700 hover:bg-gray-800 text-white'
              }`}
              title="Fold All"
            >
              Fold
            </button>
            <button
              onClick={handleUnfoldAll}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-700 hover:bg-gray-800 text-white'
              }`}
              title="Unfold All"
            >
              Unfold
            </button>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,application/json"
          className="hidden"
        />
        <div className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Ctrl+Space for autocomplete
        </div>
      </div>
      
      <div className="flex-1 relative" style={{ minHeight: '200px' }}>
        <Editor
          height="100%"
          language="json"
          value={jsonInput}
          theme={isDark ? 'vs-dark' : 'light'}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          options={{
            automaticLayout: true,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            minimap: { enabled: true },
            lineNumbers: 'on',
            folding: true,
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            tabSize: 2,
            insertSpaces: true,
          }}
        />
      </div>

      {error && (
        <div className={`px-3 py-1.5 border-l-4 border-red-500 ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}>
          <div className={`text-xs ${isDark ? 'text-red-400' : 'text-red-700'}`}>{error}</div>
        </div>
      )}

      <div className={`flex gap-2 p-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
        <button
          onClick={handleGenerateTree}
          className={`flex-1 px-4 py-2 font-medium text-sm rounded transition-colors ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-700 hover:bg-gray-800 text-white'
          }`}
        >
          Generate Tree
        </button>
        <button
          onClick={handleClear}
          className={`px-4 py-2 font-medium text-sm rounded transition-colors ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-700 hover:bg-gray-800 text-white'
          }`}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default JSONInput;

