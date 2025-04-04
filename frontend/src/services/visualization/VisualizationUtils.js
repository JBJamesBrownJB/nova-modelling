/**
 * Visualization utility functions that transform calculated metrics
 * into visual properties like sizes, buckets, etc.
 */

// Constants for bucketing and sizing
const BUCKET_COUNT = 4;

// Node size constraints by type
export const NODE_SIZES = {
  GOAL: {
    MIN: 10,
    MAX: 25
  },
  USER: {
    MIN: 30,
    MAX: 70
  },
  SERVICE: {
    MIN: 20,
    MAX: 50
  }
};

/**
 * Calculates bucketed size values for nodes based on their attribute values
 * @param {number} value - The value to bucket
 * @param {Array<number>} allValues - All values in the dataset to compare against
 * @param {number} minSize - Minimum size value
 * @param {number} maxSize - Maximum size value
 * @returns {number} - The bucketed size value
 */
export const calculateBucketedSize = (value, allValues, minSize, maxSize) => {
  if (value === null || value === undefined) return minSize;
  if (allValues.length === 0) return minSize;

  // Find min and max values from all values
  const maxVal = Math.max(...allValues);
  const minVal = Math.min(...allValues);

  // If all values are the same, return a mid-point size
  if (minVal === maxVal) return (minSize + maxSize) / 2;

  // Calculate bucket size
  const bucketSize = (maxVal - minVal) / BUCKET_COUNT;

  // Find which bucket the value belongs to
  const bucket = Math.min(Math.floor((value - minVal) / bucketSize), BUCKET_COUNT - 1);

  // Calculate size proportionally based on bucket
  return minSize + (bucket * ((maxSize - minSize) / (BUCKET_COUNT - 1)));
};

/**
 * Maps a node's calculated metrics to an appropriate visual size
 * @param {Object} node - The node object
 * @param {number} metricValue - The calculated metric value (complexity, importance, etc)
 * @param {Array<number>} allMetricValues - All metric values for nodes of the same type
 * @returns {number} - The calculated node size
 */
export const calculateNodeSize = (node, metricValue, allMetricValues) => {
  if (!node || !node.label) return NODE_SIZES.GOAL.MIN;

  switch(node.label) {
    case 'Goal':
      return calculateBucketedSize(
        metricValue,
        allMetricValues,
        NODE_SIZES.GOAL.MIN,
        NODE_SIZES.GOAL.MAX
      );
    case 'User':
      return calculateBucketedSize(
        metricValue,
        allMetricValues,
        NODE_SIZES.USER.MIN,
        NODE_SIZES.USER.MAX
      );
    case 'Service':
      return calculateBucketedSize(
        metricValue,
        allMetricValues,
        NODE_SIZES.SERVICE.MIN,
        NODE_SIZES.SERVICE.MAX
      );
    default:
      return NODE_SIZES.GOAL.MIN;
  }
};
