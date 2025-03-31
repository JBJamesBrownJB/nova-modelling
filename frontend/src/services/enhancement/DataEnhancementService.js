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
  const dataWithComplexity = addCalculatedAttributes(enhancedData);
  const dataWithNps = enhanceWithNpsScores(dataWithComplexity);
  const fullyEnhancedData = enhanceWithColors(dataWithNps);
  
  return fullyEnhancedData;
};

/**
 * Adds appropriate colors to all node types
 * @param {Object} data - The graph data object containing nodes and links
 * @returns {Object} - Enhanced data with color properties for all node types
 */
export const enhanceWithColors = (data) => {
  // Create a copy of the data
  const enhancedData = { ...data, nodes: [...data.nodes] };
  
  // Process each node
  enhancedData.nodes = enhancedData.nodes.map(node => {
    // User nodes now get colored by NPS in enhanceWithNpsScores
    // Service nodes use status for coloring directly in the Graph component
    // No additional coloring needed here
    return node;
  });
  
  return enhancedData;
};

/**
 * Enhances nodes with NPS scores and colors
 * @param {Object} data - The graph data object containing nodes and links
 * @returns {Object} - Enhanced data with NPS scores and colors
 */
export const enhanceWithNpsScores = (data) => {
  // Create a copy of the data object
  const enhancedData = { ...data, nodes: [...data.nodes] };
  
  // Process each node
  enhancedData.nodes = enhancedData.nodes.map(node => {
    if (node.label === 'Goal') {
      // Calculate aggregate NPS for Goal nodes based on incoming DOES relationships
      const aggregateNps = calculateAggregateNps(node.id, data.links);
      
      // Return node with NPS data
      return {
        ...node,
        npsScore: aggregateNps,
        npsColor: getNpsColor(aggregateNps)
      };
    } else if (node.label === 'User') {
      // Calculate aggregate NPS for User nodes based on outgoing DOES relationships
      const aggregateNps = calculateUserNps(node.id, data.links);
      
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
export const addCalculatedAttributes = (data) => {
  // Create a copy of the data
  const enhancedData = { ...data, nodes: [...data.nodes] };
  
  // Calculate complexity for each node
  enhancedData.nodes = enhancedData.nodes.map(node => {
    // Calculate node complexity based on node type
    if (node.label === 'Goal') {
      const complexity = calculateNodeComplexity(node, data.links, data.nodes);
      return { ...node, complexity };
    }
    
    if (node.label === 'Service') {
      const dependants = calculateServiceDependants(node, data.links, data.nodes);
      return { ...node, dependants };
    }
    
    if (node.label === 'User') {
      const Importance = calculateUserGoalCount(node, data.links, data.nodes);
      return { ...node, Importance };
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
 * Calculates aggregate NPS for a Goal node from its incoming DOES edges
 * @param {String} GoalId - ID of the Goal node
 * @param {Array} links - All links in the graph
 * @returns {Number|null} - Calculated NPS score or null if no data
 */
export const calculateAggregateNps = (GoalId, links) => {
  // Get all DOES relationships targeting this Goal
  const doesEdges = links.filter(link => 
    (typeof link.target === 'object' ? link.target.id : link.target) === GoalId && 
    link.type === 'DOES'
  );
  
  if (doesEdges.length === 0) return null; // No relationships at all
  
  // Get edges with NPS scores
  const edgesWithNps = doesEdges.filter(link => 
    link.nps !== undefined && 
    link.nps !== null
  );
  
  if (edgesWithNps.length === 0) return null; // No NPS data at all
  
  // Calculate the sum of NPS scores (treat missing values as 0)
  const npsSum = doesEdges.reduce((sum, link) => {
    const npsValue = link.nps !== undefined && link.nps !== null ? link.nps : 0;
    return sum + npsValue;
  }, 0);
  
  // Return the average NPS score
  return Math.round(npsSum / doesEdges.length);
};

/**
 * Calculates aggregate NPS for a User node from its outgoing DOES edges
 * @param {String} userId - ID of the User node
 * @param {Array} links - All links in the graph
 * @returns {Number|null} - Calculated NPS score or null if no data
 */
export const calculateUserNps = (userId, links) => {
  // Get all DOES relationships originating from this User
  const doesEdges = links.filter(link => 
    (typeof link.source === 'object' ? link.source.id : link.source) === userId && 
    link.type === 'DOES'
  );
  
  if (doesEdges.length === 0) return null; // No relationships at all
  
  // Get edges with NPS scores
  const edgesWithNps = doesEdges.filter(link => 
    link.nps !== undefined && 
    link.nps !== null
  );
  
  if (edgesWithNps.length === 0) return null; // No NPS data at all
  
  // Calculate the sum of NPS scores (treat missing values as 0)
  const npsSum = doesEdges.reduce((sum, link) => {
    const npsValue = link.nps !== undefined && link.nps !== null ? link.nps : 0;
    return sum + npsValue;
  }, 0);
  
  // Return the average NPS score
  return Math.round(npsSum / doesEdges.length);
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
  if (node.label !== 'Goal') {
    return 0;
  }
  
  const dependencyWeight = 3; // Default weight
  const dependencyCount = countServiceDependencies(node, links, nodes);
  return dependencyCount * dependencyWeight;
};

/**
 * Counts service dependencies for a Goal node
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
 * Calculates the number of Goals dependent on a service
 * @param {Object} node - The service node
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {Number} - Count of dependent Goals
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
      // Find source node to check if it's a Goal node
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const sourceNode = nodes.find(n => n.id === sourceId);
      
      if (sourceNode && sourceNode.label === 'Goal') {
        dependantCount++;
      }
    }
  });
  
  return dependantCount;
};

/**
 * Calculates the number of Goals a user performs
 * @param {Object} node - The user node
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {Number} - Count of Goals
 */
export const calculateUserGoalCount = (node, links, nodes) => {
  if (node.label !== 'User') {
    return 0; // Only User nodes count Goals
  }

  let GoalCount = 0;
  
  links.forEach(link => {
    if (isUserGoalLink(node, link)) {
      // Find target node to confirm it's a Goal
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      const targetNode = nodes.find(n => n.id === targetId);
      
      if (targetNode && targetNode.label === 'Goal') {
        GoalCount++;
      }
    }
  });
  
  return GoalCount;
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
 * Checks if a link represents a User-Goal relationship
 * @param {Object} node - The node object
 * @param {Object} link - The link object
 * @returns {Boolean} - True if it's a User-Goal link
 */
export const isUserGoalLink = (node, link) => {
  const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
  return sourceId === node.id && link.type === 'DOES';
};
