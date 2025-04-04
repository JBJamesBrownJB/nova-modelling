/**
 * Common utility functions shared across calculation modules
 */

/**
 * Filters relevant edges based on connection point and relationship type
 * @param {Array} links - All links in the graph
 * @param {string} nodeId - ID of the node to filter for
 * @param {string} connectionPoint - Either 'source' or 'target'
 * @param {string} relationshipType - Type of relationship to filter for (e.g., 'DOES', 'DEPENDS_ON')
 * @returns {Array} - Filtered links that match the criteria
 */
export const getRelevantEdges = (links, nodeId, connectionPoint, relationshipType) => links.filter(link => {
  const pointId = typeof link[connectionPoint] === 'object' ?
    link[connectionPoint].id : link[connectionPoint];
  return pointId === nodeId && link.type === relationshipType;
});

/**
 * Formats demand level string to a more readable format
 * @param {string} demand - Raw demand value ('high', 'med', 'low', 'none', 'unknown')
 * @returns {string} - Formatted demand value ('High', 'Medium', 'Low', 'None', 'Unknown')
 */
export const formatDemandLevel = demand => ({
  'high': 'High',
  'med': 'Medium',
  'low': 'Low',
  'none': 'None',
  'unknown': 'Unknown'
})[demand] || demand;

/**
 * Checks if a link represents a service dependency
 * @param {Object} node - The node to check dependencies for
 * @param {Object} link - The link to check
 * @returns {boolean} - True if the link represents a service dependency
 */
export const isServiceDependencyLink = (node, link) => {
  return (typeof link.source === 'object' ? link.source.id === node.id : link.source === node.id) && 
         link.type === 'DEPENDS_ON';
};

/**
 * Checks if a link represents a user-goal relationship
 * @param {Object} node - The node to check
 * @param {Object} link - The link to check
 * @returns {boolean} - True if the link represents a user-goal relationship
 */
export const isUserGoalLink = (node, link) => {
  return (typeof link.source === 'object' ? link.source.id === node.id : link.source === node.id) && 
         link.type === 'DOES';
};
