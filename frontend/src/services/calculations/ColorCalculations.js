/**
 * Color calculation utilities
 */

import { COLORS } from "../../styles/colors";

/**
 * Gets the appropriate color for an NPS score
 * @param {number|null} score - The NPS score (-100 to 100, or null/undefined)
 * @param {string} [nodeType] - Optional node type for special coloring
 * @returns {string} - Color in hex format
 */
export const getNpsColor = (score, nodeType) => {
  if (score === null || score === undefined){
    if (nodeType && nodeType === 'User') {
      return COLORS.NODE_USER_DEFAULT;
    }
    return COLORS.NPS_UNMEASURED;
  } 
  if (score >= 70) return COLORS.NPS_EXCELLENT;
  if (score >= 30) return COLORS.NPS_GOOD;
  if (score >= 0) return COLORS.NPS_LOW;
  return COLORS.NPS_BAD;
};

/**
 * Gets the appropriate color for a demand level
 * @param {string} demandLevel - The demand level ('high', 'med', 'low', etc.)
 * @returns {string} - Color in hex format
 */
export const getDemandColor = (demandLevel) => {
  const level = typeof demandLevel === 'string' ? demandLevel.toLowerCase() : null;
  
  switch (level) {
    case 'high':
      return COLORS.DEMAND_HIGH || '#FF8A65'; // Orange
    case 'med':
    case 'medium':
      return COLORS.DEMAND_MEDIUM || '#FFD54F'; // Amber
    case 'low':
      return COLORS.DEMAND_LOW || '#81C784'; // Light Green
    case 'none':
      return COLORS.DEMAND_NONE || '#E0E0E0'; // Grey
    default:
      return COLORS.DEMAND_UNKNOWN || '#BDBDBD'; // Light Grey
  }
};
