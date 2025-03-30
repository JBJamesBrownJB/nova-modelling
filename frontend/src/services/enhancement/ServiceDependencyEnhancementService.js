/**
 * Service Dependency Enhancement Service
 * 
 * A pure functional service for enhancing graph data with service dependency metrics
 */

/**
 * Enhances nodes with service dependency metrics
 * @param {Object} data - The graph data object containing nodes and links
 * @returns {Object} - Enhanced data with dependency metrics
 */
export const enhanceWithServiceDependencies = (data) => {
  // Create a copy of the data
  const enhancedData = { ...data, nodes: [...data.nodes] };
  
  // Calculate dependency metrics for each node
  enhancedData.nodes = enhancedData.nodes.map(node => {
    if (node.label === 'Service') {
      const dependantCount = calculateServiceDependants(node, data.links, data.nodes);
      return { ...node, dependantCount };
    }
    
    if (node.label === 'User') {
      const jtbdCount = calculateUserJtbdCount(node, data.links, data.nodes);
      return { ...node, jtbdCount };
    }
    
    return node;
  });
  
  return enhancedData;
};

/**
 * Calculates the number of JTBDs dependent on a service
 * @param {Object} node - The service node
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {Number} - Count of dependent JTBDs
 */
export const calculateServiceDependants = (node, links, nodes) => {
  const dependantJtbds = new Set();
  
  links.forEach(link => {
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    
    if (targetId === node.id && link.type === 'USES') {
      const sourceNode = nodes.find(n => n.id === sourceId);
      if (sourceNode && sourceNode.label === 'JTBD') {
        dependantJtbds.add(sourceId);
      }
    }
  });
  
  return dependantJtbds.size;
};

/**
 * Calculates the number of JTBDs a user performs
 * @param {Object} node - The user node
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {Number} - Count of JTBDs
 */
export const calculateUserJtbdCount = (node, links, nodes) => {
  const userJtbds = new Set();
  
  links.forEach(link => {
    if (isUserJtbdLink(node, link)) {
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      const targetNode = nodes.find(n => n.id === targetId);
      
      if (targetNode && targetNode.label === 'JTBD') {
        userJtbds.add(targetId);
      }
    }
  });
  
  return userJtbds.size;
};

/**
 * Checks if a link represents a User-JTBD relationship
 * @param {Object} node - The node object
 * @param {Object} link - The link object
 * @returns {Boolean} - True if it's a User-JTBD link
 */
export const isUserJtbdLink = (node, link) => {
  const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
  return sourceId === node.id && link.type === 'DOES';
};
