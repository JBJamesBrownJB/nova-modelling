// Tooltip utilities for displaying node information
export const showTooltip = (tooltip, node, x, y) => {
  if (!tooltip) return;
  
  let content = `<strong>${node.name || node.id}</strong><br/>`;
  content += `Type: ${node.label}<br/>`;
  
  // Add NPS information for Goals
  if (node.label === 'Goal' && node.npsScore !== undefined) {
    content += `NPS Score: ${node.npsScore}<br/>`;
  }
  
  // Add status information for Services
  if (node.label === 'Service' && node.status) {
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
  
  tooltip
    .html(content)
    .style('left', `${x + 15}px`)
    .style('top', `${y - 28}px`)
    .transition()
    .duration(200)
    .style('opacity', 0.9);
};

export const hideTooltip = (tooltip) => {
  if (!tooltip) return;
  
  tooltip
    .transition()
    .duration(200)
    .style('opacity', 0);
};
