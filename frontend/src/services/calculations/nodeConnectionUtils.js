const getNodeId = node => typeof node === 'object' ? node.id : node;

const getConnectedNodes = (links, selectedNodes) => {
    const connectedNodeIds = new Set(selectedNodes);

    links.forEach(link => {
        const sourceId = getNodeId(link.source);
        const targetId = getNodeId(link.target);

        if (selectedNodes.includes(sourceId)) connectedNodeIds.add(targetId);
        if (selectedNodes.includes(targetId)) connectedNodeIds.add(sourceId);
    });

    return connectedNodeIds;
};

const isNodeSelected = (nodeId, selectedNodes) => selectedNodes.includes(nodeId);
const isLinkSelected = (link, selectedNodes) => {
    const sourceId = getNodeId(link.source);
    const targetId = getNodeId(link.target);
    return isNodeSelected(sourceId, selectedNodes) || isNodeSelected(targetId, selectedNodes);
};

// Helper to check if a node is connected to any selected node
const isConnectedToSelected = (allNodes, selectedNodes, nodeId) => {
    if (selectedNodes.length === 0) return true;
    if (isNodeSelected(nodeId, selectedNodes)) return true;

    // Check if this node has any connection to selected nodes
    return allNodes.links.some(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return (sourceId === nodeId && isNodeSelected(targetId, selectedNodes)) ||
            (targetId === nodeId && isNodeSelected(sourceId, selectedNodes));
    });
};

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

export { getConnectedNodes, isNodeSelected, isLinkSelected, isConnectedToSelected };