/**
 * Formats demand level string to a more readable format
 * @param {string} demand - Raw demand value ('high', 'med', 'low', 'none', 'unknown')
 * @returns {string} - Formatted demand value ('High', 'Medium', 'Low', 'None', 'Unknown')
 */
export const formatDemandLevel = demand => ({
  'high': 'High',
  'med': 'Medium',
  'low': 'Low',
  'none': 'None',
  'unknown': 'Unknown'
})[demand] || demand;
