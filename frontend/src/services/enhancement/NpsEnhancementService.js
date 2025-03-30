/**
 * NPS Enhancement Service
 * 
 * A pure functional service for enhancing graph data with NPS scores
 */

import { getNpsColor } from '../../styles/colors';

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
    if (node.label === 'JTBD') {
      // Calculate aggregate NPS for JTBD nodes (from incoming DOES edges)
      const aggregateNps = calculateJtbdNps(node.id, data.links);
      return {
        ...node,
        npsScore: aggregateNps,
        npsColor: getNpsColor(aggregateNps)
      };
    }
    if (node.label === 'User') {
      // Calculate aggregate NPS for User nodes (from outgoing DOES edges)
      const aggregateNps = calculateUserNps(node.id, data.links);
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
 * Calculates aggregate NPS for a JTBD node from its incoming DOES edges
 * @param {String} jtbdId - ID of the JTBD node
 * @param {Array} links - All links in the graph
 * @returns {Number|null} - Calculated NPS score or null if no data
 */
export const calculateJtbdNps = (jtbdId, links) => {
  const doesEdges = links.filter(link => 
    link.target === jtbdId && 
    link.type === 'DOES' && 
    link.nps !== undefined && 
    link.nps !== null
  );
  
  return calculateAverageNps(doesEdges);
};

/**
 * Calculates aggregate NPS for a User node from their outgoing DOES edges
 * @param {String} userId - ID of the User node
 * @param {Array} links - All links in the graph
 * @returns {Number|null} - Calculated NPS score or null if no data
 */
export const calculateUserNps = (userId, links) => {
  const doesEdges = links.filter(link => 
    link.source === userId && 
    link.type === 'DOES' && 
    link.nps !== undefined && 
    link.nps !== null
  );
  
  return calculateAverageNps(doesEdges);
};

/**
 * Helper function to calculate average NPS from a set of edges
 * @param {Array} edges - Array of edges with NPS scores
 * @returns {Number|null} - Average NPS score or null if no data
 */
export const calculateAverageNps = (edges) => {
  if (!edges.length) return null;
  
  const sum = edges.reduce((acc, edge) => acc + edge.nps, 0);
  return Math.round(sum / edges.length);
};
