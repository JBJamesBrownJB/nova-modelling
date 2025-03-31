/**
 * Data Enhancement Service
 * 
 * A pure functional service for enhancing graph data with calculated properties
 * such as NPS scores and complexity metrics.
 */

import { color } from "d3";
import { COLORS } from "../../styles/colors";

// Node sizing configuration constants
const BUCKET_COUNT = 4; // Number of buckets for quantized sizing

// Size range for Goal nodes (complexity)
const GOAL_MIN_SIZE = 10;
const GOAL_MAX_SIZE = 25;

// Size range for User nodes (importance)
const USER_MIN_SIZE = 30;
const USER_MAX_SIZE = 70;

// Size range for Service nodes (dependants)
const SERVICE_MIN_SIZE = 20;
const SERVICE_MAX_SIZE = 50;

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
        npsColor: getNpsColor(aggregateNps, node.label)
      };
    } else if (node.label === 'User') {
      // Calculate aggregate NPS for User nodes based on outgoing DOES relationships
      const aggregateNps = calculateUserNps(node.id, data.links);
      
      // Return node with NPS data
      return {
        ...node,
        npsScore: aggregateNps,
        npsColor: getNpsColor(aggregateNps, 'User')
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
      const Importance = calculateUserImportance(node, data.links, data.nodes);
      return { ...node, Importance };
    }
    
    return node;
  });
  
  return enhancedData;
};

// NPS CALCULATION FUNCTIONS
export const getNpsColor = (npsScore) => {
  if (npsScore === null || npsScore === undefined) return COLORS.NPS_UNMEASURED; 
  if (npsScore >= 70) return COLORS.NPS_EXCELLENT;  
  if (npsScore >= 30) return COLORS.NPS_GOOD;  
  if (npsScore >= 0) return COLORS.NPS_LOW;  
  return COLORS.NPS_BAD;  
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
  
  // Calculate raw complexity based on service dependencies
  const dependencyWeight = 3; // Default weight
  const dependencyCount = countServiceDependencies(node, links, nodes);
  const rawComplexity = dependencyCount * dependencyWeight;

  // Get all Goal nodes to determine min/max complexity
  const goalNodes = nodes.filter(n => n.label === 'Goal');
  
  // Calculate raw complexity for all Goal nodes
  const complexityValues = goalNodes.map(goalNode => {
    const depCount = countServiceDependencies(goalNode, links, nodes);
    return depCount * dependencyWeight;
  });
  
  // Find min and max complexity (handle edge cases)
  const minComplexity = Math.min(...complexityValues) || 0;
  const maxComplexity = Math.max(...complexityValues) || 0;
  
  // If all nodes have the same complexity, return a default value
  if (minComplexity === maxComplexity) {
    return GOAL_MIN_SIZE; // Default size for uniform complexity
  }
  
  // Define buckets with corresponding complexity values
  const bucketSize = (GOAL_MAX_SIZE - GOAL_MIN_SIZE) / (BUCKET_COUNT - 1);
  
  // Calculate which bucket this node's complexity falls into
  const complexityRange = maxComplexity - minComplexity;
  const normalizedComplexity = (rawComplexity - minComplexity) / complexityRange; // 0 to 1
  const bucketIndex = Math.min(Math.floor(normalizedComplexity * BUCKET_COUNT), BUCKET_COUNT - 1);
  
  // Map bucket index to a specific size
  return GOAL_MIN_SIZE + (bucketIndex * bucketSize);
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
 * @returns {Number} - Quantized score based on dependent Goals
 */
export const calculateServiceDependants = (node, links, nodes) => {
  if (node.label !== 'Service') {
    return 0; // Only Service nodes have dependants
  }

  // Calculate raw dependant count
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

  // Get all Service nodes to determine min/max dependants
  const serviceNodes = nodes.filter(n => n.label === 'Service');
  
  // Calculate raw dependant counts for all Service nodes
  const dependantValues = serviceNodes.map(serviceNode => {
    let count = 0;
    links.forEach(link => {
      if ((link.target === serviceNode.id || 
          (typeof link.target === 'object' && link.target.id === serviceNode.id)) &&
          link.type === 'DEPENDS_ON') {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const sourceNode = nodes.find(n => n.id === sourceId);
        if (sourceNode && sourceNode.label === 'Goal') {
          count++;
        }
      }
    });
    return count;
  });
  
  // Find min and max dependants (handle edge cases)
  const minDependants = Math.min(...dependantValues) || 0;
  const maxDependants = Math.max(...dependantValues) || 0;
  
  // If all nodes have the same dependant count, return a default value
  if (minDependants === maxDependants) {
    return SERVICE_MIN_SIZE; // Default size for uniform dependants
  }
  
  // Define buckets with corresponding dependant values
  const bucketSize = (SERVICE_MAX_SIZE - SERVICE_MIN_SIZE) / (BUCKET_COUNT - 1);
  
  // Calculate which bucket this node's dependant count falls into
  const dependantRange = maxDependants - minDependants;
  const normalizedDependants = (dependantCount - minDependants) / dependantRange; // 0 to 1
  const bucketIndex = Math.min(Math.floor(normalizedDependants * BUCKET_COUNT), BUCKET_COUNT - 1);
  
  // Map bucket index to a specific size
  return SERVICE_MIN_SIZE + (bucketIndex * bucketSize);
};

/**
 * Calculates the number of Goals a user performs
 * @param {Object} node - The user node
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {Number} - Calculated importance based on Goal count
 */
export const calculateUserImportance = (node, links, nodes) => {
  if (node.label !== 'User') {
    return 0; // Only User nodes count Goals
  }

  // Calculate raw importance based on Goals performed
  let goalCount = 0;
  
  links.forEach(link => {
    if (isUserGoalLink(node, link)) {
      // Find target node to confirm it's a Goal
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      const targetNode = nodes.find(n => n.id === targetId);
      
      if (targetNode && targetNode.label === 'Goal') {
        goalCount++;
      }
    }
  });
  
  // Get all User nodes to determine min/max importance
  const userNodes = nodes.filter(n => n.label === 'User');
  
  // Calculate raw importance for all User nodes
  const importanceValues = userNodes.map(userNode => {
    let count = 0;
    links.forEach(link => {
      if (isUserGoalLink(userNode, link)) {
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        const targetNode = nodes.find(n => n.id === targetId);
        if (targetNode && targetNode.label === 'Goal') {
          count++;
        }
      }
    });
    return count;
  });
  
  // Find min and max importance (handle edge cases)
  const minImportance = Math.min(...importanceValues) || 0;
  const maxImportance = Math.max(...importanceValues) || 0;
  
  // If all nodes have the same importance, return a default value
  if (minImportance === maxImportance) {
    return USER_MIN_SIZE; // Default size for uniform importance
  }
  
  // Define buckets with corresponding importance values
  const bucketSize = (USER_MAX_SIZE - USER_MIN_SIZE) / (BUCKET_COUNT - 1);
  
  // Calculate which bucket this node's importance falls into
  const importanceRange = maxImportance - minImportance;
  const normalizedImportance = (goalCount - minImportance) / importanceRange; // 0 to 1
  const bucketIndex = Math.min(Math.floor(normalizedImportance * BUCKET_COUNT), BUCKET_COUNT - 1);
  
  // Map bucket index to a specific size
  return USER_MIN_SIZE + (bucketIndex * bucketSize);
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
