const DEFAULT_DEPENDENCY_WEIGHT = 3;  

export const calculateNodeComplexity = (node, links, nodes, config = {}) => {
  if (node.label !== 'JTBD') {
    return 0;
  }
  const dependencyWeight = config.dependencyWeight || DEFAULT_DEPENDENCY_WEIGHT;
  const dependencyCount = countServiceDependencies(node, links, nodes);
  return dependencyCount * dependencyWeight;
};

export const countServiceDependencies = (node, links, allNodes) => {
  let dependencyCount = 0;
  
  links.forEach(link => {
    if (isServiceDependencyLink(node, link)) {
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      const targetNode = allNodes.find(n => n.id === targetId);
      
      if (targetNode && targetNode.label === 'Service') {
        dependencyCount++;
      }
    }
  });
  
  return dependencyCount;
};

export const calculateServiceDependants = (node, links, nodes) => {
  if (node.label !== 'Service') {
    return 0; // Only Service nodes have dependants
  }

  let dependantCount = 0;
  
  links.forEach(link => {
    if ((link.target === node.id || 
        (typeof link.target === 'object' && link.target.id === node.id)) &&
        link.type === 'DEPENDS_ON') {
      // Find source node to check if it's a JTBD node
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const sourceNode = nodes.find(n => n.id === sourceId);
      
      if (sourceNode && sourceNode.label === 'JTBD') {
        dependantCount++;
      }
    }
  });
  
  return dependantCount;
};

export const calculateUserJtbdCount = (node, links, nodes) => {
  if (node.label !== 'User') {
    return 0; // Only User nodes have JTBD counts
  }
  let jtbdCount = 0;
  
  links.forEach(link => {
    if (isUserJtbdLink(node, link)) {
      // Find target node to check if it's a JTBD node
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      const targetNode = nodes.find(n => n.id === targetId);
      
      if (targetNode && targetNode.label === 'JTBD') {
        jtbdCount++;
      }
    }
  });
  
  return jtbdCount;
};

export const calculateGraphComplexity = (nodes, links, config = {}) => {
  return nodes.map(node => {
    const updatedNode = { ...node };
    
    if (node.label === 'JTBD') {
      updatedNode.complexity = calculateNodeComplexity(node, links, nodes, config);
      updatedNode.dependency_count = countServiceDependencies(node, links, nodes);
    } else if (node.label === 'Service') {
      updatedNode.dependants = calculateServiceDependants(node, links, nodes);
    } else if (node.label === 'User') {
      updatedNode.jtbd_count = calculateUserJtbdCount(node, links, nodes);
    }
    
    return updatedNode;
  });
};

export const simulateComplexityChanges = (nodes, links, newParams) => {
  return calculateGraphComplexity(nodes, links, newParams);
};

const isServiceDependencyLink = (node, link) => {
  return (link.source === node.id || 
    (typeof link.source === 'object' && link.source.id === node.id)) &&
    link.type === 'DEPENDS_ON';
};

const isUserJtbdLink = (node, link) => {
  return (link.source === node.id || 
    (typeof link.source === 'object' && link.source.id === node.id)) &&
    link.type === 'DOES';
};

// For backwards compatibility with code that expects the class-based API
export default {
  calculateNodeComplexity,
  calculateServiceDependants,
  calculateUserJtbdCount,
  calculateGraphComplexity,
  simulateComplexityChanges
};
