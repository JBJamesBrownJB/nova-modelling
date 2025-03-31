import DatabaseService from './DatabaseService';
import mockData, { mockDataMinimal } from '../../data/mockData';

class MockDatabaseService extends DatabaseService {
  constructor() {
    super();
    this.data = mockData;
    // this.data = mockDataMinimal;
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
    return newRelationship;
  }
}

export default MockDatabaseService;
