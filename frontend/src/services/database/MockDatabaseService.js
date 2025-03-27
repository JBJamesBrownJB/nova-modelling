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
}

export default MockDatabaseService;
