import { COLORS } from "../../styles/colors";
import {
  calculateAggregateNps,
  calculateUserNps,
  calculateAggregateDemand,
  calculateNodeComplexity,
  calculateServiceDependants,
  calculateUserImportance,
  getRelevantEdges
} from "../calculations";
import { getNpsColor } from "../calculations/ColorCalculations";
import { calculateNodeSize } from "../../components/visualization/shared/utils/VisualizationUtils";

export const enhanceGraphData = (data) => {
  const enhancedData = JSON.parse(JSON.stringify(data));

  const dataWithComplexity = addCalculatedAttributes(enhancedData);
  const dataWithNps = enhanceWithNpsScores(dataWithComplexity);
  const dataWithDemand = enhanceWithDemand(dataWithNps);

  return dataWithDemand;
};

const formatDemandLevel = demand => ({
  'high': 'High',
  'med': 'Medium',
  'low': 'Low',
  'none': 'None',
  'unknown': 'Unknown'
})[demand] || demand;

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

export const enhanceWithDemand = (data) => {
  const enhancedData = { ...data, nodes: [...data.nodes] };

  enhancedData.nodes = enhancedData.nodes.map(node => {
    if (node.label === 'Goal') {
      const aggregateDemand = calculateAggregateDemand(node.id, data.links, data.nodes);

      return {
        ...node,
        demand: aggregateDemand
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
      
      // Get all complexity values for goals
      const allComplexityValues = data.nodes
        .filter(n => n.label === 'Goal')
        .map(goalNode => calculateNodeComplexity(goalNode, data.links, data.nodes))
        .filter(val => val !== null);
      
      // Calculate node size based on complexity
      const nodeSize = calculateNodeSize(node, complexity, allComplexityValues);
      
      return { ...node, complexity, nodeSize };
    }

    if (node.label === 'Service') {
      const dependants = calculateServiceDependants(node, data.links, data.nodes);
      
      // Get all dependant values for services
      const allDependantValues = data.nodes
        .filter(n => n.label === 'Service')
        .map(serviceNode => calculateServiceDependants(serviceNode, data.links, data.nodes));
      
      // Calculate node size based on dependants
      const nodeSize = calculateNodeSize(node, dependants, allDependantValues);
      
      return { ...node, dependants, nodeSize };
    }

    if (node.label === 'User') {
      const importance = calculateUserImportance(node, data.links, data.nodes);
      
      // Get all importance values for users
      const allImportanceValues = data.nodes
        .filter(n => n.label === 'User')
        .map(userNode => calculateUserImportance(userNode, data.links, data.nodes));
      
      // Calculate node size based on importance
      const nodeSize = calculateNodeSize(node, importance, allImportanceValues);
      
      return { ...node, importance, nodeSize };
    }

    return node;
  });

  return enhancedData;
};
