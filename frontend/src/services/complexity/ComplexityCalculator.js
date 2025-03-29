/**
 * ComplexityCalculator
 * 
 * Responsible for calculating complexity of nodes based on the Nova Modelling principles.
 * This calculates complexity based on the number of service dependencies for each JTBD,
 * and the number of dependant JTBDs for each Service.
 */
class ComplexityCalculator {
  constructor(config = {}) {
    // Default complexity model constant
    this.dependencyWeight = config.dependencyWeight || 3;  // Weight for each service dependency
  }

  /**
   * Calculate complexity for a single JTBD node based on its service dependencies
   * @param {Object} node - The JTBD node
   * @param {Array} links - All links in the graph
   * @param {Array} nodes - All nodes in the graph
   * @returns {number} - The calculated complexity value
   */
  calculateNodeComplexity(node, links, nodes) {
    if (node.label !== 'JTBD') {
      return 0; // Only JTBD nodes have complexity
    }

    // Count service dependencies
    let dependencyCount = 0;
    
    // Count all relationships from this JTBD node to Service nodes
    links.forEach(link => {
      if ((link.source === node.id || 
          (typeof link.source === 'object' && link.source.id === node.id)) &&
          link.type === 'DEPENDS_ON') {
        // Find target node to check if it's a Service node
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        const targetNode = nodes.find(n => n.id === targetId);
        
        if (targetNode && targetNode.label === 'Service') {
          dependencyCount++;
        }
      }
    });
    
    // Calculate complexity as weighted dependency count
    const complexity = dependencyCount * this.dependencyWeight;
    
    // Store the dependency count for reference
    node.dependency_count = dependencyCount;
    
    return complexity;
  }

  /**
   * Calculate dependants for a Service node based on JTBD nodes that depend on it
   * @param {Object} node - The Service node
   * @param {Array} links - All links in the graph
   * @param {Array} nodes - All nodes in the graph
   * @returns {number} - The calculated dependants count
   */
  calculateServiceDependants(node, links, nodes) {
    if (node.label !== 'Service') {
      return 0; // Only Service nodes have dependants
    }

    // Count JTBD dependants
    let dependantCount = 0;
    
    // Count all relationships from JTBD nodes to this Service node
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
    
    // Store the dependant count
    node.dependants = dependantCount;
    
    return dependantCount;
  }

  /**
   * Calculate the number of JTBDs associated with each User
   * @param {Object} node - The User node
   * @param {Array} links - All links in the graph
   * @param {Array} nodes - All nodes in the graph
   * @returns {number} - The calculated JTBD count
   */
  calculateUserJtbdCount(node, links, nodes) {
    if (node.label !== 'User') {
      return 0; // Only User nodes have JTBD counts
    }

    // Count JTBDs performed by this user
    let jtbdCount = 0;
    
    // Count all DOES relationships from this User to JTBD nodes
    links.forEach(link => {
      if ((link.source === node.id || 
          (typeof link.source === 'object' && link.source.id === node.id)) &&
          link.type === 'DOES') {
        // Find target node to check if it's a JTBD node
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        const targetNode = nodes.find(n => n.id === targetId);
        
        if (targetNode && targetNode.label === 'JTBD') {
          jtbdCount++;
        }
      }
    });
    
    // Store the JTBD count
    node.jtbd_count = jtbdCount;
    
    return jtbdCount;
  }

  /**
   * Calculate complexity for all JTBD nodes and dependants for all Service nodes in the graph
   * @param {Array} nodes - All nodes in the graph
   * @param {Array} links - All links in the graph
   * @returns {Array} - The nodes with updated values
   */
  calculateGraphComplexity(nodes, links) {
    const updatedNodes = [...nodes];
    
    updatedNodes.forEach(node => {
      if (node.label === 'JTBD') {
        node.complexity = this.calculateNodeComplexity(node, links, nodes);
      } else if (node.label === 'Service') {
        node.dependants = this.calculateServiceDependants(node, links, nodes);
      } else if (node.label === 'User') {
        node.jtbd_count = this.calculateUserJtbdCount(node, links, nodes);
      }
    });
    
    return updatedNodes;
  }

  /**
   * Simulate complexity changes by adjusting model parameters
   * @param {Array} nodes - All nodes in the graph
   * @param {Array} links - All links in the graph 
   * @param {Object} newParams - New parameters to simulate with
   * @returns {Array} - The nodes with simulated complexity values
   */
  simulateComplexityChanges(nodes, links, newParams) {
    // Create a temporary calculator with the new parameters
    const tempCalculator = new ComplexityCalculator(newParams);
    
    // Use the temp calculator to calculate new complexity values
    return tempCalculator.calculateGraphComplexity(nodes, links);
  }
}

export default ComplexityCalculator;
