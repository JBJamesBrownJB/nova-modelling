import DatabaseService from './DatabaseService';
import mockData from '../../data/mockData';

class MockDatabaseService extends DatabaseService {
  constructor() {
    super();
    this.data = mockData;
  }
  
  async getGraph() {
    return this.data;
  }
  
  async executeQuery(query) {
    console.log('Mock executing query:', query);
    // Always return the full mock data for now
    return this.data;
  }

  // Generate a unique ID based on node type
  generateUniqueId(prefix) {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    return `${prefix}_${timestamp}_${randomNum}`;
  }

  // Add a new node to the mock database
  async addNode(nodeType, properties) {
    const nodeId = this.generateUniqueId(nodeType.toLowerCase());
    const newNode = {
      id: nodeId,
      label: nodeType,
      ...properties
    };
    this.data.nodes.push(newNode);
    
    // Recalculate complexity if needed
    await this.recalculateComplexity();
    
    return newNode;
  }

  // Add a relationship between nodes
  async addRelationship(sourceId, targetId, type) {
    const relationshipId = this.generateUniqueId('rel');
    const newRelationship = {
      id: relationshipId,
      source: sourceId,
      target: targetId,
      type: type
    };
    this.data.links.push(newRelationship);
    
    // Recalculate complexity since relationships have changed
    await this.recalculateComplexity();
    
    return newRelationship;
  }

  // Recalculate complexity for all JTBD nodes based on service dependencies
  async recalculateComplexity() {
    // Nova complexity model constants
    const DEPENDENCY_WEIGHT = 3;  // Weight for each service dependency
    const SERVICE_NODE_COST = 10; // Base cost of service/API
    const TOIL_FACTOR = 1.8;  // 80/20 split between accidental/essential complexity
    
    // Process each JTBD node
    this.data.nodes.forEach(node => {
      if (node.label === 'JTBD') {
        // Count service dependencies
        let dependencyCount = 0;
        
        // Count all relationships from this JTBD node to Service nodes
        this.data.links.forEach(link => {
          if (link.source === node.id || link.source.id === node.id) {
            // Find target node to check if it's a Service node
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            const targetNode = this.data.nodes.find(n => n.id === targetId);
            
            if (targetNode && targetNode.label === 'Service' && link.type === 'DEPENDS_ON') {
              dependencyCount++;
            }
          }
        });
        
        // Calculate base complexity (weighted dependency count)
        const baseComplexity = dependencyCount * DEPENDENCY_WEIGHT;
        
        // Calculate total complexity including toil factor
        const totalComplexity = Math.round(baseComplexity * TOIL_FACTOR);
        
        // Update the node's complexity property
        node.complexity = totalComplexity;
        
        // Store the dependency count as well for reference
        node.dependency_count = dependencyCount;
      }
    });
    
    return this.data;
  }
}

export default MockDatabaseService;
