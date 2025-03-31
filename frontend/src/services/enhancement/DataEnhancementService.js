import { COLORS } from "../../styles/colors";

const BUCKET_COUNT = 4; 

const GOAL_MIN_SIZE = 10;
const GOAL_MAX_SIZE = 25;

const USER_MIN_SIZE = 30;
const USER_MAX_SIZE = 70;

const SERVICE_MIN_SIZE = 20;
const SERVICE_MAX_SIZE = 50;

export const enhanceGraphData = (data) => {
  const enhancedData = JSON.parse(JSON.stringify(data));
  
  const dataWithComplexity = addCalculatedAttributes(enhancedData);
  const dataWithNps = enhanceWithNpsScores(dataWithComplexity);
  const fullyEnhancedData = enhanceWithColors(dataWithNps);
  
  return fullyEnhancedData;
};

export const enhanceWithColors = (data) => {
  const enhancedData = { ...data, nodes: [...data.nodes] };
  
  enhancedData.nodes = enhancedData.nodes.map(node => {
    return node;
  });
  
  return enhancedData;
};

export const enhanceWithNpsScores = (data) => {
  const enhancedData = { ...data, nodes: [...data.nodes] };
  
  enhancedData.nodes = enhancedData.nodes.map(node => {
    if (node.label === 'Goal') {
      const aggregateNps = calculateAggregateNps(node.id, data.links);
      
      return {
        ...node,
        npsScore: aggregateNps,
        npsColor: getNpsColor(aggregateNps, node.label)
      };
    } else if (node.label === 'User') {
      const aggregateNps = calculateUserNps(node.id, data.links);
      
      return {
        ...node,
        npsScore: aggregateNps,
        npsColor: getNpsColor(aggregateNps, 'User')
      };
    }
    return node;
  });
  
  return enhancedData;
};

export const addCalculatedAttributes = (data) => {
  const enhancedData = { ...data, nodes: [...data.nodes] };
  
  enhancedData.nodes = enhancedData.nodes.map(node => {
    if (node.label === 'Goal') {
      const complexity = calculateNodeComplexity(node, data.links, data.nodes);
      return { ...node, complexity };
    }
    
    if (node.label === 'Service') {
      const dependants = calculateServiceDependants(node, data.links, data.nodes);
      return { ...node, dependants };
    }
    
    if (node.label === 'User') {
      const Importance = calculateUserImportance(node, data.links, data.nodes);
      return { ...node, Importance };
    }
    
    return node;
  });
  
  return enhancedData;
};

export const getNpsColor = (npsScore) => {
  if (npsScore === null || npsScore === undefined) return COLORS.NPS_UNMEASURED; 
  if (npsScore >= 70) return COLORS.NPS_EXCELLENT;  
  if (npsScore >= 30) return COLORS.NPS_GOOD;  
  if (npsScore >= 0) return COLORS.NPS_LOW;  
  return COLORS.NPS_BAD;  
};

export const calculateAggregateNps = (nodeId, links, connectionPoint = 'target', relationshipType = 'DOES') => {
  const relevantEdges = links.filter(link => {
    const pointId = typeof link[connectionPoint] === 'object' ? 
      link[connectionPoint].id : link[connectionPoint];
    return pointId === nodeId && link.type === relationshipType;
  });
  
  if (relevantEdges.length === 0) return null; // No relationships at all
  
  const edgesWithNps = relevantEdges.filter(link => 
    link.nps !== undefined && 
    link.nps !== null
  );
  
  if (edgesWithNps.length === 0) return null; // No NPS data at all
  
  const npsSum = relevantEdges.reduce((sum, link) => {
    const npsValue = link.nps !== undefined && link.nps !== null ? link.nps : 0;
    return sum + npsValue;
  }, 0);
  
  return Math.round(npsSum / relevantEdges.length);
};

export const calculateUserNps = (userId, links) => {
  return calculateAggregateNps(userId, links, 'source', 'DOES');
};

export const calculateNodeComplexity = (node, links, nodes) => {
  if (node.label !== 'Goal') {
    return 0;
  }
  
  const dependencyCount = countServiceDependencies(node, links, nodes);
  const rawComplexity = dependencyCount;

  const goalNodes = nodes.filter(n => n.label === 'Goal');
  
  const complexityValues = goalNodes.map(goalNode => {
    const depCount = countServiceDependencies(goalNode, links, nodes);
    return depCount;
  });
  
  return calculateBucketedSize(rawComplexity, complexityValues, GOAL_MIN_SIZE, GOAL_MAX_SIZE);
};

export const calculateServiceDependants = (node, links, nodes) => {
  if (node.label !== 'Service') {
    return 0; // Only Service nodes have dependants
  }

  // Calculate raw dependant count
  let dependantCount = 0;
  
  links.forEach(link => {
    if ((link.target === node.id || 
        (typeof link.target === 'object' && link.target.id === node.id)) &&
        link.type === 'DEPENDS_ON') {
      // Find source node to check if it's a Goal node
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const sourceNode = nodes.find(n => n.id === sourceId);
      
      if (sourceNode && sourceNode.label === 'Goal') {
        dependantCount++;
      }
    }
  });

  // Get all Service nodes to determine min/max dependants
  const serviceNodes = nodes.filter(n => n.label === 'Service');
  
  // Calculate raw dependant counts for all Service nodes
  const dependantValues = serviceNodes.map(serviceNode => {
    let count = 0;
    links.forEach(link => {
      if ((link.target === serviceNode.id || 
          (typeof link.target === 'object' && link.target.id === serviceNode.id)) &&
          link.type === 'DEPENDS_ON') {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const sourceNode = nodes.find(n => n.id === sourceId);
        if (sourceNode && sourceNode.label === 'Goal') {
          count++;
        }
      }
    });
    return count;
  });
  
  // Return bucketed size
  return calculateBucketedSize(dependantCount, dependantValues, SERVICE_MIN_SIZE, SERVICE_MAX_SIZE);
};

export const calculateUserImportance = (node, links, nodes) => {
  if (node.label !== 'User') {
    return 0; // Only User nodes count Goals
  }

  let goalCount = 0;
  
  links.forEach(link => {
    if (isUserGoalLink(node, link)) {
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      const targetNode = nodes.find(n => n.id === targetId);
      
      if (targetNode && targetNode.label === 'Goal') {
        goalCount++;
      }
    }
  });
  
  const userNodes = nodes.filter(n => n.label === 'User');
  
  const importanceValues = userNodes.map(userNode => {
    let count = 0;
    links.forEach(link => {
      if (isUserGoalLink(userNode, link)) {
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        const targetNode = nodes.find(n => n.id === targetId);
        if (targetNode && targetNode.label === 'Goal') {
          count++;
        }
      }
    });
    return count;
  });
  
  return calculateBucketedSize(goalCount, importanceValues, USER_MIN_SIZE, USER_MAX_SIZE);
};

export const isServiceDependencyLink = (node, link) => {
  const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
  return sourceId === node.id && link.type === 'DEPENDS_ON';
};

export const isUserGoalLink = (node, link) => {
  const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
  return sourceId === node.id && link.type === 'DOES';
};

export const calculateBucketedSize = (value, allValues, minSize, maxSize) => {
  const minValue = Math.min(...allValues) || 0;
  const maxValue = Math.max(...allValues) || 0;
  
  if (minValue === maxValue) {
    return minSize; // Default size for uniform values
  }
  
  const bucketSize = (maxSize - minSize) / (BUCKET_COUNT - 1);
  
  const valueRange = maxValue - minValue;
  const normalizedValue = (value - minValue) / valueRange; // 0 to 1
  const bucketIndex = Math.min(Math.floor(normalizedValue * BUCKET_COUNT), BUCKET_COUNT - 1);
  
  return minSize + (bucketIndex * bucketSize);
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
