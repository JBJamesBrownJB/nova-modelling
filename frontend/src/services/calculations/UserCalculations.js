/**
 * User metric calculation utilities
 */

import { isUserGoalLink } from '../../services/calculations/nodeConnectionUtils';

/**
 * Calculates the importance of a user based on goal relationships
 * @param {Object} node - The user node to calculate importance for
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {number} - The importance score for the user
 */
export const calculateUserImportance = (node, links, nodes) => {
  if (node.label !== 'User') {
    return 0; // Only User nodes have importance in this context
  }

  // Raw importance is measured by how many goal relationships the user has
  let importanceCount = 0;
  const goalIds = new Set();

  links.forEach(link => {
    if (isUserGoalLink(node, link)) {
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      const targetNode = nodes.find(n => n.id === targetId);

      if (targetNode && targetNode.label === 'Goal') {
        // Count unique goals
        goalIds.add(targetId);
        importanceCount++;
      }
    }
  });

  return importanceCount;
};
