// Abstract database service interface
class DatabaseService {
  async getGraph() {
    throw new Error('Method not implemented');
  }
  
  async executeQuery(query) {
    throw new Error('Method not implemented');
  }

  async addNode(nodeType, properties) {
    throw new Error('Method not implemented');
  }

  async addRelationship(sourceId, targetId, type) {
    throw new Error('Method not implemented');
  }
}

export default DatabaseService;
