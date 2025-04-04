/**
 * Get the actual node from a link's source or target reference
 * @param {Object} reference - The source or target reference from the link
 * @param {Array} nodes - Array of all nodes
 * @returns {Object|null} The found node or null
 */
const getNodeFromReference = (reference, nodes) => {
  const id = typeof reference === 'object' ? reference.id : reference;
  return nodes.find(n => n.id === id) || null;
};

/**
 * Calculate the radius of a node based on its type and properties
 * @param {Object} node - The node object
 * @returns {number} The calculated radius
 */
export const getNodeRadius = (node) => {
  // First try to use the nodeSize property which should have been calculated
  // by our VisualizationUtils.calculateNodeSize function
  if (node.nodeSize) {
    return node.nodeSize;
  }
  
  // Fallback to the old property names if nodeSize isn't available
  switch (node.label) {
    case 'Goal':
      // Scale Goal nodes based on their complexity
      return node.complexity || 10; 
    case 'Service':
      // Scale Service nodes based on number of Goal dependants
      return node.dependants || 20;
    case 'User':
      // Scale User nodes based on number of Goals they perform
      // Handle both capital and lowercase 'importance'
      return node.importance || node.Importance || 30;
    default:
      return 10; // Default size
  }
};

/**
 * Calculate the edge points where a link should connect to its nodes
 * @param {Object} link - The link object containing source and target
 * @param {Array} nodes - Array of all nodes
 * @param {Function} nodeRadiusCalculator - Function to calculate node radius
 * @returns {Object|null} Edge points or null if invalid
 */
export const calculateLinkEdgePoints = (link, nodes, nodeRadiusCalculator) => {
  const sourceNode = getNodeFromReference(link.source, nodes);
  const targetNode = getNodeFromReference(link.target, nodes);

  if (!sourceNode || !targetNode || sourceNode.x === undefined || targetNode.x === undefined) {
    return null;
  }

  // Calculate the distance between nodes
  const dx = targetNode.x - sourceNode.x;
  const dy = targetNode.y - sourceNode.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return null;

  // Get node radii
  const targetRadius = nodeRadiusCalculator(targetNode);
  const sourceRadius = nodeRadiusCalculator(sourceNode);

  // Calculate ratios for edge points
  const targetRatio = (distance - targetRadius - 6) / distance;
  const sourceRatio = (sourceRadius) / distance;

  // Calculate edge points
  return {
    source: {
      x: sourceNode.x + dx * sourceRatio,
      y: sourceNode.y + dy * sourceRatio
    },
    target: {
      x: sourceNode.x + dx * targetRatio,
      y: sourceNode.y + dy * targetRatio
    }
  };
};

// Export for testing
export { getNodeFromReference };
