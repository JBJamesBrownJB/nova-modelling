import DatabaseService from './DatabaseService';
import neo4j from 'neo4j-driver';

class Neo4jDatabaseService extends DatabaseService {
  constructor(uri, username, password) {
    super();
    this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
  }
  
  async getGraph() {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (n)
        OPTIONAL MATCH (n)-[r]->(m)
        RETURN n, r, m LIMIT 1000`
      );
      
      return this._processGraphData(result);
    } finally {
      await session.close();
    }
  }
  
  async executeQuery(query) {
    const session = this.driver.session();
    try {
      const result = await session.run(query);
      return this._processGraphData(result);
    } finally {
      await session.close();
    }
  }
  
  _processGraphData(result) {
    const nodes = new Map();
    const links = [];
    
    result.records.forEach(record => {
      const sourceNode = record.get('n');
      const relationship = record.get('r');
      const targetNode = record.get('m');
      
      if (sourceNode && !nodes.has(sourceNode.identity.toString())) {
        nodes.set(
          sourceNode.identity.toString(), 
          {
            id: sourceNode.identity.toString(),
            label: sourceNode.labels[0],
            ...sourceNode.properties
          }
        );
      }
      
      if (targetNode && !nodes.has(targetNode.identity.toString())) {
        nodes.set(
          targetNode.identity.toString(), 
          {
            id: targetNode.identity.toString(),
            label: targetNode.labels[0],
            ...targetNode.properties
          }
        );
      }
      
      if (relationship && sourceNode && targetNode) {
        links.push({
          id: relationship.identity.toString(),
          source: sourceNode.identity.toString(),
          target: targetNode.identity.toString(),
          type: relationship.type,
          ...relationship.properties
        });
      }
    });
    
    return {
      nodes: Array.from(nodes.values()),
      links
    };
  }
  
  async close() {
    await this.driver.close();
  }
}

export default Neo4jDatabaseService;
