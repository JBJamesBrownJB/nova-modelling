/**
 * Service metric calculation utilities
 */

/**
 * Calculates the number of goals that depend on a service
 * @param {Object} node - The service node to calculate dependants for
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {number} - The number of goal dependants
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

  return dependantCount;
};
