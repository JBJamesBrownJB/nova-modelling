import { 
  enhanceGraphData,
  enhanceWithNpsScores,
  enhanceWithComplexity,
  enhanceWithColors,
  getNpsColor,
  calculateAggregateNps,
  calculateNodeComplexity,
  calculateUserNps
} from './DataEnhancementService';

describe('DataEnhancementService', () => {
  // Test data setup
  const mockGraphData = {
    nodes: [
      { id: 'jtbd1', label: 'JTBD', name: 'Test JTBD 1' },
      { id: 'jtbd2', label: 'JTBD', name: 'Test JTBD 2' },
      { id: 'jtbd3', label: 'JTBD', name: 'Test JTBD 3' },
      { id: 'jtbd4', label: 'JTBD', name: 'Test JTBD 4' },
      { id: 'user1', label: 'User', name: 'Test User 1' },
      { id: 'user2', label: 'User', name: 'Test User 2' },
      { id: 'user3', label: 'User', name: 'Test User 3' },
      { id: 'user4', label: 'User', name: 'Test User 4 (Mixed NPS)' },
      { id: 'service1', label: 'Service', name: 'Test Service 1', status: 'active' },
      { id: 'service2', label: 'Service', name: 'Test Service 2', status: 'in_development' }
    ],
    links: [
      { id: 'rel1', source: 'user1', target: 'jtbd1', type: 'DOES', nps: 85 },
      { id: 'rel2', source: 'user1', target: 'jtbd1', type: 'DOES', nps: 75 },
      { id: 'rel3', source: 'user1', target: 'jtbd2', type: 'DOES', nps: 25 },
      { id: 'rel4', source: 'jtbd1', target: 'service1', type: 'DEPENDS_ON' },
      { id: 'rel5', source: 'user2', target: 'jtbd3', type: 'DOES' }, // No NPS data
      // Mixed NPS data scenario - one with score, one without
      { id: 'rel6', source: 'user3', target: 'jtbd4', type: 'DOES', nps: 50 },
      { id: 'rel7', source: 'user3', target: 'jtbd4', type: 'DOES' }, // No NPS data
      // User with mixed NPS values
      { id: 'rel8', source: 'user4', target: 'jtbd1', type: 'DOES', nps: 60 },
      { id: 'rel9', source: 'user4', target: 'jtbd2', type: 'DOES' }, // No NPS data
      { id: 'rel10', source: 'user4', target: 'jtbd3', type: 'DOES', nps: null } // Explicit null
    ]
  };

  describe('enhanceGraphData', () => {
    it('should enhance data without mutating the original', () => {
      const originalData = JSON.parse(JSON.stringify(mockGraphData));
      const enhancedData = enhanceGraphData(mockGraphData);
      
      // Verify original data wasn't mutated
      expect(mockGraphData).toEqual(originalData);
      
      // Verify the enhanced data has the expected properties
      const jtbd1 = enhancedData.nodes.find(n => n.id === 'jtbd1');
      expect(jtbd1).toHaveProperty('npsScore');
      expect(jtbd1).toHaveProperty('npsColor');
      expect(jtbd1).toHaveProperty('complexity');
    });

    it('should correctly apply colors to all node types', () => {
      const enhancedData = enhanceGraphData(mockGraphData);
      
      // Check all node types have appropriate coloring
      enhancedData.nodes.forEach(node => {
        if (node.label === 'JTBD') {
          expect(node).toHaveProperty('npsColor');
        } else if (node.label === 'User') {
          expect(node).toHaveProperty('npsColor');
        } else if (node.label === 'Service') {
          expect(node).toHaveProperty('status');
        }
      });
    });
  });

  describe('getNpsColor', () => {
    it('should return correct colors based on NPS score', () => {
      // Grey for null/undefined
      expect(getNpsColor(null)).toBe('#BDBDBD');
      expect(getNpsColor(undefined)).toBe('#BDBDBD');
      
      // Light Red for low satisfaction
      expect(getNpsColor(-50)).toBe('#EF9A9A');
      expect(getNpsColor(0)).toBe('#EF9A9A');
      expect(getNpsColor(29)).toBe('#EF9A9A');
      
      // Light Orange for medium satisfaction
      expect(getNpsColor(30)).toBe('#FFB74D');
      expect(getNpsColor(50)).toBe('#FFB74D');
      expect(getNpsColor(69)).toBe('#FFB74D');
      
      // Light Green for high satisfaction
      expect(getNpsColor(70)).toBe('#81C784');
      expect(getNpsColor(85)).toBe('#81C784');
      expect(getNpsColor(100)).toBe('#81C784');
    });
  });

  describe('calculateAggregateNps', () => {
    it('should correctly calculate average NPS for a JTBD node', () => {
      // JTBD1 has three DOES edges with NPS 85, 75, and 60 (from user4), average should be 73
      const result = calculateAggregateNps('jtbd1', mockGraphData.links);
      expect(result).toBe(73); // (85 + 75 + 60) / 3 = 73.33, rounded to 73
    });

    it('should handle a single NPS value', () => {
      // JTBD2 has two DOES edges with NPS 25 and one without NPS, average should be 13
      const result = calculateAggregateNps('jtbd2', mockGraphData.links);
      expect(result).toBe(13); // (25 + 0) / 2 = 12.5, rounded to 13
    });

    it('should return null if no NPS data is available', () => {
      // JTBD3 has a DOES relationship but no NPS score
      const result = calculateAggregateNps('jtbd3', mockGraphData.links);
      expect(result).toBeNull();
    });
    
    it('should treat missing NPS scores as 0 when calculating the average', () => {
      // JTBD4 has two DOES edges: one with NPS 50 and one without NPS score
      // The one without score should be treated as 0, making the average 25
      const result = calculateAggregateNps('jtbd4', mockGraphData.links);
      expect(result).toBe(25); // (50 + 0) / 2 = 25
    });
  });

  describe('calculateNodeComplexity', () => {
    it('should return 0 for non-JTBD nodes', () => {
      const userNode = mockGraphData.nodes.find(n => n.id === 'user1');
      const result = calculateNodeComplexity(userNode, mockGraphData.links, mockGraphData.nodes);
      expect(result).toBe(0);
    });

    it('should calculate complexity based on service dependencies', () => {
      const jtbdNode = mockGraphData.nodes.find(n => n.id === 'jtbd1');
      // jtbd1 has one service dependency with weight 3, so complexity should be 3
      const result = calculateNodeComplexity(jtbdNode, mockGraphData.links, mockGraphData.nodes);
      expect(result).toBe(3);
    });
  });

  describe('calculateUserNps', () => {
    it('should correctly calculate average NPS for a User node with all NPS values', () => {
      // User1 has three DOES edges with NPS 85, 75, and 25, average should be 62
      const result = calculateUserNps('user1', mockGraphData.links);
      expect(result).toBe(62); // (85 + 75 + 25) / 3 = 61.67, rounded to 62
    });

    it('should return null if no NPS data is available for a User', () => {
      // User2 has one DOES edge but no NPS score
      const result = calculateUserNps('user2', mockGraphData.links);
      expect(result).toBeNull();
    });

    it('should treat missing NPS scores as 0 when calculating User NPS average', () => {
      // User3 has two DOES edges: one with NPS 50 and one without NPS score
      // The one without score should be treated as 0, making the average 25
      const result = calculateUserNps('user3', mockGraphData.links);
      expect(result).toBe(25); // (50 + 0) / 2 = 25
    });
    
    it('should handle mixed NPS values (defined, undefined, null) for a User', () => {
      // User4 has three DOES edges: one with NPS 60, one without NPS, one with null NPS
      // Both missing and null values should be treated as 0, making the average 20
      const result = calculateUserNps('user4', mockGraphData.links);
      expect(result).toBe(20); // (60 + 0 + 0) / 3 = 20
    });
  });

  describe('enhanceWithNpsScores', () => {
    it('should correctly enhance JTBD nodes with NPS data', () => {
      const enhancedData = enhanceWithNpsScores(mockGraphData);
      
      // Check JTBD1 node (should have high satisfaction color)
      const jtbd1 = enhancedData.nodes.find(n => n.id === 'jtbd1');
      expect(jtbd1.npsScore).toBe(73);
      expect(jtbd1.npsColor).toBe('#81C784'); // Light Green for high satisfaction
      
      // Check JTBD2 node (should have low satisfaction color)
      const jtbd2 = enhancedData.nodes.find(n => n.id === 'jtbd2');
      expect(jtbd2.npsScore).toBe(13);
      expect(jtbd2.npsColor).toBe('#EF9A9A'); // Light Red for low satisfaction
      
      // Check JTBD3 node (should have default color for null NPS)
      const jtbd3 = enhancedData.nodes.find(n => n.id === 'jtbd3');
      expect(jtbd3.npsScore).toBeNull();
      expect(jtbd3.npsColor).toBe('#BDBDBD'); // Grey for unmeasured
      
      // Check JTBD4 node (should treat missing NPS as 0)
      const jtbd4 = enhancedData.nodes.find(n => n.id === 'jtbd4');
      expect(jtbd4.npsScore).toBe(25); // (50 + 0) / 2 = 25
      expect(jtbd4.npsColor).toBe('#EF9A9A'); // Light Red for low satisfaction
    });
    
    it('should correctly enhance User nodes with NPS data', () => {
      const enhancedData = enhanceWithNpsScores(mockGraphData);
      
      // Check User1 node (should have medium satisfaction color)
      const user1 = enhancedData.nodes.find(n => n.id === 'user1');
      expect(user1.npsScore).toBe(62);
      expect(user1.npsColor).toBe('#FFB74D'); // Orange for medium satisfaction
      
      // Check User2 node (should have default color for null NPS)
      const user2 = enhancedData.nodes.find(n => n.id === 'user2');
      expect(user2.npsScore).toBeNull();
      expect(user2.npsColor).toBe('#BDBDBD'); // Grey for unmeasured
      
      // Check User3 node (should have low satisfaction color for mixed data)
      const user3 = enhancedData.nodes.find(n => n.id === 'user3');
      expect(user3.npsScore).toBe(25);
      expect(user3.npsColor).toBe('#EF9A9A'); // Light Red for low satisfaction
    });
  });

  describe('User node coloring', () => {
    it('should apply NPS-based colors to User nodes', () => {
      const enhancedData = enhanceGraphData(mockGraphData);
      
      // Get the user nodes
      const user1 = enhancedData.nodes.find(n => n.id === 'user1');
      const user2 = enhancedData.nodes.find(n => n.id === 'user2');
      const user3 = enhancedData.nodes.find(n => n.id === 'user3');
      const user4 = enhancedData.nodes.find(n => n.id === 'user4');
      
      // All users should have npsColor properties
      expect(user1).toHaveProperty('npsColor'); 
      expect(user2).toHaveProperty('npsColor');
      expect(user3).toHaveProperty('npsColor');
      expect(user4).toHaveProperty('npsColor');
      
      // User1 should have medium satisfaction color (Orange)
      expect(user1.npsColor).toBe('#FFB74D');
      
      // User2 should have default color for null NPS (Grey)
      expect(user2.npsColor).toBe('#BDBDBD');
      
      // User3 should have low satisfaction color (Light Red)
      expect(user3.npsColor).toBe('#EF9A9A');
      
      // User4 should have low satisfaction color (Light Red)
      expect(user4.npsColor).toBe('#EF9A9A');
    });
  });
});
