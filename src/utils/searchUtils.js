// Normalize different path formats to a common format
export const normalizePath = (path) => {
  if (!path) return '';
  
  // Remove leading $ or . 
  let normalized = path.trim();
  if (normalized.startsWith('$')) {
    normalized = normalized.substring(1);
  }
  if (normalized.startsWith('.')) {
    normalized = normalized.substring(1);
  }
  
  // Replace [0] with [0] etc (array indices)
  // The path is already in our format from treeGenerator
  
  return normalized.toLowerCase();
};

// Check if a path matches the search query
export const pathMatches = (path, searchQuery) => {
  if (!searchQuery || !path) return false;
  
  const normalizedPath = normalizePath(path);
  const normalizedQuery = normalizePath(searchQuery);
  
  // Split by . and [ for more accurate matching
  const pathSegments = normalizedPath.split(/[.[\]]+/).filter(Boolean);
  const querySegments = normalizedQuery.split(/[.[\]]+/).filter(Boolean);
  
  // Check if all query segments are present in the path
  return querySegments.every(segment => 
    pathSegments.some(p => p.includes(segment))
  );
};

