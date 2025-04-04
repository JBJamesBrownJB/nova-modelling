/**
 * Demand calculation utilities
 */

import { formatDemandLevel } from './CommonUtils';
import { getRelevantEdges } from '../../services/calculations/nodeConnectionUtils';

/**
 * Calculates aggregate demand information for a node based on its relationships
 * @param {string} nodeId - ID of the node to calculate demand for
 * @param {Array} links - All links in the graph
 * @param {Array} nodes - All nodes in the graph
 * @returns {Object|null} - Object mapping user names to their demand levels, or null if no data
 */
export const calculateAggregateDemand = (nodeId, links, nodes) => {
  const relevantEdges = getRelevantEdges(links, nodeId, 'target', 'DOES');

  if (relevantEdges.length === 0) return null; // No relationships at all

  const edgesWithDemand = relevantEdges.filter(link =>
    link.demand !== undefined &&
    link.demand !== null
  );

  if (edgesWithDemand.length === 0) return null; // No demand data at all

  return edgesWithDemand.reduce((acc, link) => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const sourceNode = nodes.find(n => n.id === sourceId);
    return {
      ...acc,
      [sourceNode.name]: formatDemandLevel(link.demand)
    };
  }, {});
};
