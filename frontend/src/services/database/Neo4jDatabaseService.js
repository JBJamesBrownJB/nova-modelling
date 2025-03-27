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

  async addNode(nodeType, properties) {
    const session = this.driver.session();
    try {
      // Create parameters for the query
      const params = {
        props: properties
      };

      // Create the node with the specified type and properties
      const result = await session.run(
        `CREATE (n:${nodeType} $props)
         RETURN n`,
        params
      );

      // Extract the created node data
      const record = result.records[0];
      const node = record.get('n');
      
      // Create node object with the right format
      const createdNode = {
        id: node.identity.toString(),
        label: nodeType,
        ...node.properties
      };

      // Recalculate complexity after adding a node
      await this.recalculateComplexity();
      
      return createdNode;
    } finally {
      await session.close();
    }
  }

  async addRelationship(sourceId, targetId, type) {
    const session = this.driver.session();
    try {
      // Match the source and target nodes and create a relationship between them
      const result = await session.run(
        `MATCH (source), (target)
         WHERE ID(source) = $sourceId AND ID(target) = $targetId
         CREATE (source)-[r:${type}]->(target)
         RETURN r, source, target`,
        { sourceId: neo4j.int(sourceId), targetId: neo4j.int(targetId) }
      );

      // Extract relationship data
      const record = result.records[0];
      const relationship = record.get('r');
      
      // Create relationship object with the right format
      const createdRelationship = {
        id: relationship.identity.toString(),
        source: sourceId,
        target: targetId,
        type: type,
        ...relationship.properties
      };

      // Recalculate complexity after adding a relationship
      await this.recalculateComplexity();
      
      return createdRelationship;
    } finally {
      await session.close();
    }
  }

  async recalculateComplexity() {
    const session = this.driver.session();
    try {
      // Define the constants for the Nova complexity model
      const READ_WEIGHT = 1;     // Simple read operations
      const UPDATE_WEIGHT = 3;    // More complex update operations
      const WRITE_WEIGHT = 5;     // Most complex write operations
      const DATA_NODE_COST = 10;  // Base cost of data node/API
      const TOIL_FACTOR = 1.8;    // 80/20 split between accidental/essential complexity

      // Step 1: Count READ operations for each JTBD
      await session.run(
        `MATCH (j:JTBD)-[r:READS]->(d:Data)
         WITH j, COUNT(r) AS read_count
         SET j.read_count = read_count`
      );

      // Step 2: Count UPDATE operations for each JTBD
      await session.run(
        `MATCH (j:JTBD)-[u:UPDATES]->(d:Data)
         WITH j, COUNT(u) AS update_count
         SET j.update_count = update_count`
      );

      // Step 3: Count WRITE operations for each JTBD
      await session.run(
        `MATCH (j:JTBD)-[w:WRITES]->(d:Data)
         WITH j, COUNT(w) AS write_count
         SET j.write_count = write_count`
      );

      // Step 4: Calculate JTBD base complexity (weighted operation counts)
      await session.run(
        `MATCH (j:JTBD)
         WITH j,
             COALESCE(j.read_count, 0) * ${READ_WEIGHT} AS read_complexity,
             COALESCE(j.update_count, 0) * ${UPDATE_WEIGHT} AS update_complexity,
             COALESCE(j.write_count, 0) * ${WRITE_WEIGHT} AS write_complexity
         WITH j, read_complexity + update_complexity + write_complexity AS base_complexity
         SET j.base_complexity = base_complexity`
      );

      // Step 5: Calculate total complexity including toil factor
      await session.run(
        `MATCH (j:JTBD)
         WITH j, j.base_complexity AS base_complexity
         SET j.complexity = toInteger(base_complexity * ${TOIL_FACTOR})`
      );

      // Get the updated graph data
      return await this.getGraph();
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
