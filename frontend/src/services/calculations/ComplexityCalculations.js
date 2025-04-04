/**
 * Complexity calculation utilities
 */

/**
 * Calculates the complexity of a node based on its service dependencies
 * @param {Object} node - The node to calculate complexity for
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {number|null} - The raw complexity value or null if not applicable
 */
export const calculateNodeComplexity = (node, links, nodes) => {
  if (node.label !== 'Goal') {
    return null;
  }

  // Just return the raw count of service dependencies
  return countServiceDependencies(node, links, nodes);
};

/**
 * Counts the number of service dependencies for a node
 * @param {Object} node - The node to count dependencies for
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {number} - The number of service dependencies
 */
export const countServiceDependencies = (node, links, allNodes) => {
  let dependencyCount = 0;

  links.forEach(link => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    
    if (sourceId === node.id && link.type === 'DEPENDS_ON') {
      // Check if target is a Service node
      const targetNode = allNodes.find(n => n.id === targetId);
      if (targetNode && targetNode.label === 'Service') {
        dependencyCount++;
      }
    }
  });

  return dependencyCount;
};
