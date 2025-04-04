import { getNodeRadius } from '../shared/utils/VisualizationUtils';
import { getRelevantEdges } from '../../../services/calculations/CommonUtils';

/**
 * Calculate the edge points where a link should connect to its nodes
 * @param {Object} link - The link object containing source and target
 * @param {Array} nodes - Array of all nodes
 * @returns {Object|null} Edge points or null if invalid
 */
export const calculateLinkEdgePoints = (link, nodes) => {
  const sourceNode = typeof link.source === 'object' ? link.source : nodes.find(n => n.id === link.source);
  const targetNode = typeof link.target === 'object' ? link.target : nodes.find(n => n.id === link.target);

  if (!sourceNode || !targetNode || sourceNode.x === undefined || targetNode.x === undefined) {
    return null;
  }

  // Calculate the distance between nodes
  const dx = targetNode.x - sourceNode.x;
  const dy = targetNode.y - sourceNode.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return null;

  // Get node radii
  const targetRadius = getNodeRadius(targetNode);
  const sourceRadius = getNodeRadius(sourceNode);

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
