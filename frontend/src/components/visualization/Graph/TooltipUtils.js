/**
 * Generates tooltip content based on node type and data
 * @param {Object} node - The node data
 * @returns {string} HTML content for the tooltip
 */
export const generateTooltipContent = (node) => {
  let content = `<strong>${node.name}</strong><br/>`;
  content += `<strong>Type:</strong> ${node.label}<br/>`;

  switch (node.label) {
    case 'Goal':
      if (node.complexity) {
        content += `<strong>Complexity Score:</strong> ${node.complexity.toFixed(1)}<br/>`;
        content += `<strong>NPS Score:</strong> ${node.npsScore}<br/>`;
      }
      break;
    case 'Service':
      if (node.dependants !== undefined) {
        content += `<strong>Goal Dependency Score:</strong> ${node.dependants}<br/>`;
      }
      break;
    case 'User':
      if (node.Importance !== undefined) {
        content += `<strong>User Importance Score:</strong> ${node.Importance}<br/>`;
        content += `<strong>NPS Score:</strong> ${node.npsScore}<br/>`;
      }
      break;
  }

  return content;
};

/**
 * Shows the tooltip with the provided content
 * @param {Object} tooltip - D3 tooltip selection
 * @param {Event} event - Mouse event
 * @param {Object} node - Node data
 */
export const showTooltip = (tooltip, event, node) => {
  tooltip.transition()
    .delay(200)
    .duration(200)
    .style('opacity', 1);

  tooltip.html(generateTooltipContent(node))
    .style('left', (event.pageX - 270) + 'px')
    .style('top', (event.pageY - 30) + 'px');
};

/**
 * Hides the tooltip
 * @param {Object} tooltip - D3 tooltip selection
 */
export const hideTooltip = (tooltip) => {
  tooltip.transition()
    .duration(200)
    .style('opacity', 0);
};
