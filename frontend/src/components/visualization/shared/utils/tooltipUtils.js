// Tooltip utilities for displaying node information

/**
 * Generates tooltip content based on node type and data
 * @param {Object} node - The node data
 * @returns {string} HTML content for the tooltip
 */
export const generateTooltipContent = (node) => {
  let content = `<strong>${node.name || node.id}</strong><br/>`;
  content += `Type: ${node.label}<br/>`;

  switch (node.label) {
    case 'Goal':
      if (node.complexity) {
        content += `<strong>Complexity Score:</strong> ${node.complexity.toFixed(1)}<br/>`;
      }
      if (node.npsScore !== undefined) {
        content += `<strong>NPS Score:</strong> ${node.npsScore}<br/>`;
      }
      if (node.demand) {
        content += '<br/><strong>User Demand:</strong><br/>';
        Object.entries(node.demand).forEach(([role, level]) => {
          content += `&nbsp;&nbsp;${role}: <span class="demand-level demand-${level}">${level}</span><br/>`;
        });
      }
      break;
    case 'Service':
      if (node.dependants !== undefined) {
        content += `<strong>Goal Dependency Score:</strong> ${node.dependants}<br/>`;
      }
      if (node.status) {
        let displayStatus = '';
        switch(node.status) {
          case 'active':
            displayStatus = 'Active';
            break;
          case 'in_development':
            displayStatus = 'In Development';
            break;
          case 'planned':
          case 'vapour':
            displayStatus = 'Planned';
            break;
          default:
            displayStatus = node.status;
        }
        content += `Status: ${displayStatus}<br/>`;
      }
      break;
    case 'User':
      if (node.Importance !== undefined || node.importance !== undefined) {
        content += `<strong>User Importance Score:</strong> ${node.Importance || node.importance}<br/>`;
      }
      if (node.npsScore !== undefined) {
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
  if (!tooltip) return;

  tooltip
    .html(generateTooltipContent(node))
    .style('left', `${event.pageX - 290}px`)
    .style('top', `${event.pageY - 28}px`)
    .transition()
    .delay(200)
    .duration(200)
    .style('opacity', 0.9);
};

/**
 * Hides the tooltip
 * @param {Object} tooltip - D3 tooltip selection
 */
export const hideTooltip = (tooltip) => {
  if (!tooltip) return;
  
  tooltip
    .transition()
    .duration(200)
    .style('opacity', 0);
};
