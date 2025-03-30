/**
 * Complexity Enhancement Service
 * 
 * A pure functional service for enhancing graph data with complexity metrics
 */

/**
 * Enhances nodes with complexity scores based on dependencies
 * @param {Object} data - The graph data object containing nodes and links
 * @returns {Object} - Enhanced data with complexity values
 */
export const enhanceWithComplexity = (data) => {
  // Create a copy of the data
  const enhancedData = { ...data, nodes: [...data.nodes] };
  
  // Calculate complexity for each node
  enhancedData.nodes = enhancedData.nodes.map(node => {
    if (node.label === 'JTBD') {
      const complexity = calculateNodeComplexity(node, data.links, data.nodes);
      return { ...node, complexity };
    }
    return node;
  });
  
  return enhancedData;
};

/**
 * Calculates complexity for a node based on its dependencies
 * @param {Object} node - The node object
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {Number} - Calculated complexity
 */
export const calculateNodeComplexity = (node, links, nodes) => {
  if (node.label !== 'JTBD') {
    return 0;
  }
  
  const dependencyWeight = 3; // Default weight
  const dependencyCount = countServiceDependencies(node, links, nodes);
  return dependencyCount * dependencyWeight;
};

/**
 * Counts service dependencies for a JTBD node
 * @param {Object} node - The node object
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {Number} - Count of service dependencies
 */
export const countServiceDependencies = (node, links, allNodes) => {
  let dependencyCount = 0;
  
  links.forEach(link => {
    if (isServiceDependencyLink(node, link)) {
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      const targetNode = allNodes.find(n => n.id === targetId);
      
      if (targetNode && targetNode.label === 'Service') {
        dependencyCount++;
      }
    }
  });
  
  return dependencyCount;
};

/**
 * Checks if a link represents a service dependency for a node
 * @param {Object} node - The node object
 * @param {Object} link - The link object
 * @returns {Boolean} - True if it's a service dependency link
 */
export const isServiceDependencyLink = (node, link) => {
  const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
  return sourceId === node.id && link.type === 'USES';
};
