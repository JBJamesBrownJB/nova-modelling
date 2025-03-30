/**
 * Generates tooltip content based on node type and data
 * @param {Object} node - The node data
 * @returns {string} HTML content for the tooltip
 */
export const generateTooltipContent = (node) => {
  let content = `<strong>${node.name}</strong><br/>`;
  content += `<strong>Type:</strong> ${node.label}<br/>`;

  switch (node.label) {
    case 'JTBD':
      if (node.complexity) {
        content += `<strong>Complexity:</strong> ${node.complexity.toFixed(1)}<br/>`;
      }
      if (node.dependency_count !== undefined) {
        content += `<strong>Service Dependencies:</strong> ${node.dependency_count}<br/>`;
      }
      break;
    case 'Service':
      if (node.dependants !== undefined) {
        content += `<strong>JTBD Dependants:</strong> ${node.dependants}<br/>`;
      }
      break;
    case 'User':
      if (node.jtbd_count !== undefined) {
        content += `<strong>JTBD Count:</strong> ${node.jtbd_count}<br/>`;
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
    .delay(500)
    .duration(500)
    .style('opacity', 0.9);

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
