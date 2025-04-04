/**
 * NPS (Net Promoter Score) calculation utilities
 */

import { getRelevantEdges } from '../../services/calculations/nodeConnectionUtils';

/**
 * Calculates aggregate NPS score for a node based on its relationships
 * @param {string} nodeId - ID of the node to calculate NPS for
 * @param {Array} links - All links in the graph
 * @param {string} connectionPoint - Either 'source' or 'target', defaults to 'target'
 * @param {string} relationshipType - Type of relationship to consider, defaults to 'DOES'
 * @returns {number|null} - Average NPS score or null if no data available
 */
export const calculateAggregateNps = (nodeId, links, connectionPoint = 'target', relationshipType = 'DOES') => {
  const relevantEdges = getRelevantEdges(links, nodeId, connectionPoint, relationshipType);

  if (relevantEdges.length === 0) return null; // No relationships at all

  const edgesWithNps = relevantEdges.filter(link =>
    link.nps !== undefined &&
    link.nps !== null
  );

  if (edgesWithNps.length === 0) return null; // No NPS data at all

  const npsSum = edgesWithNps.reduce((sum, link) => {
    const npsValue = link.nps !== undefined && link.nps !== null ? link.nps : 0;
    return sum + npsValue;
  }, 0);

  return Math.round(npsSum / edgesWithNps.length);
};

/**
 * Calculates the aggregate NPS score for a user based on their goal relationships
 * @param {string} userId - ID of the user to calculate NPS for
 * @param {Array} links - All links in the graph
 * @returns {number|null} - Average NPS score or null if no data available
 */
export const calculateUserNps = (userId, links) => {
  return calculateAggregateNps(userId, links, 'source', 'DOES');
};
