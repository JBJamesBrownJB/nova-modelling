/**
 * Data Enhancement Service
 * 
 * A pure functional service for enhancing graph data with calculated properties
 * such as NPS scores and complexity metrics.
 */

export const enhanceGraphData = (data) => {
  // Create a deep copy to avoid mutation
  const enhancedData = JSON.parse(JSON.stringify(data));
  
  // Apply enhancements in sequence
  const dataWithComplexity = enhanceWithComplexity(enhancedData);
  const fullyEnhancedData = enhanceWithNpsScores(dataWithComplexity);
  
  return fullyEnhancedData;
};

/**
 * Enhances nodes with NPS scores and colors
 * @param {Object} data - The graph data object containing nodes and links
 * @returns {Object} - Enhanced data with NPS scores and colors
 */
export const enhanceWithNpsScores = (data) => {
  // Create a copy of the data object
  const enhancedData = { ...data, nodes: [...data.nodes] };
  
  // Process each JTBD node
  enhancedData.nodes = enhancedData.nodes.map(node => {
    if (node.label === 'JTBD') {
      // Calculate aggregate NPS
      const aggregateNps = calculateAggregateNps(node.id, data.links);
      
      // Return node with NPS data
      return {
        ...node,
        npsScore: aggregateNps,
        npsColor: getNpsColor(aggregateNps)
      };
    }
    return node;
  });
  
  return enhancedData;
};

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
    // Calculate node complexity based on node type
    if (node.label === 'JTBD') {
      const complexity = calculateNodeComplexity(node, data.links, data.nodes);
      return { ...node, complexity };
    }
    
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

// NPS CALCULATION FUNCTIONS

/**
 * Maps NPS score to a color based on satisfaction level
 * @param {Number|null} npsScore - The NPS score
 * @returns {String} - HEX color code
 */
export const getNpsColor = (npsScore) => {
  if (npsScore === null || npsScore === undefined) return '#BDBDBD'; // Material Light Grey for unmeasured
  if (npsScore >= 70) return '#81C784';  // Material Light Green for high satisfaction
  if (npsScore >= 30) return '#FFB74D';  // Material Light Orange for medium satisfaction
  return '#EF9A9A';  // Material Light Red for low satisfaction
};

/**
 * Calculates aggregate NPS for a JTBD node from its incoming DOES edges
 * @param {String} jtbdId - ID of the JTBD node
 * @param {Array} links - All links in the graph
 * @returns {Number|null} - Calculated NPS score or null if no data
 */
export const calculateAggregateNps = (jtbdId, links) => {
  const doesEdges = links.filter(link => 
    link.target === jtbdId && 
    link.type === 'DOES' && 
    link.nps !== undefined && 
    link.nps !== null
  );
  
  if (doesEdges.length === 0) return null; // No NPS data available
  
  // Calculate average NPS
  const totalNps = doesEdges.reduce((sum, edge) => sum + edge.nps, 0);
  return Math.round(totalNps / doesEdges.length);
};

// COMPLEXITY CALCULATION FUNCTIONS

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
 * Calculates the number of JTBDs dependent on a service
 * @param {Object} node - The service node
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {Number} - Count of dependent JTBDs
 */
export const calculateServiceDependants = (node, links, nodes) => {
  if (node.label !== 'Service') {
    return 0; // Only Service nodes have dependants
  }

  let dependantCount = 0;
  
  links.forEach(link => {
    if ((link.target === node.id || 
        (typeof link.target === 'object' && link.target.id === node.id)) &&
        link.type === 'DEPENDS_ON') {
      // Find source node to check if it's a JTBD node
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const sourceNode = nodes.find(n => n.id === sourceId);
      
      if (sourceNode && sourceNode.label === 'JTBD') {
        dependantCount++;
      }
    }
  });
  
  return dependantCount;
};

/**
 * Calculates the number of JTBDs a user performs
 * @param {Object} node - The user node
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {Number} - Count of JTBDs
 */
export const calculateUserJtbdCount = (node, links, nodes) => {
  if (node.label !== 'User') {
    return 0; // Only User nodes count JTBDs
  }

  let jtbdCount = 0;
  
  links.forEach(link => {
    if (isUserJtbdLink(node, link)) {
      // Find target node to confirm it's a JTBD
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      const targetNode = nodes.find(n => n.id === targetId);
      
      if (targetNode && targetNode.label === 'JTBD') {
        jtbdCount++;
      }
    }
  });
  
  return jtbdCount;
};

// HELPER FUNCTIONS

/**
 * Checks if a link represents a service dependency for a node
 * @param {Object} node - The node object
 * @param {Object} link - The link object
 * @returns {Boolean} - True if it's a service dependency link
 */
export const isServiceDependencyLink = (node, link) => {
  const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
  return sourceId === node.id && link.type === 'DEPENDS_ON';
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
