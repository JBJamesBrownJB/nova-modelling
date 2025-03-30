import { 
  enhanceGraphData,
  enhanceWithNpsScores,
  getNpsColor,
  calculateAggregateNps,
  calculateNodeComplexity
} from './DataEnhancementService';

describe('DataEnhancementService', () => {
  // Test data setup
  const mockGraphData = {
    nodes: [
      { id: 'jtbd1', label: 'JTBD', name: 'Test JTBD 1' },
      { id: 'jtbd2', label: 'JTBD', name: 'Test JTBD 2' },
      { id: 'user1', label: 'User', name: 'Test User' },
      { id: 'service1', label: 'Service', name: 'Test Service', status: 'active' }
    ],
    links: [
      { id: 'rel1', source: 'user1', target: 'jtbd1', type: 'DOES', nps: 85 },
      { id: 'rel2', source: 'user1', target: 'jtbd1', type: 'DOES', nps: 75 },
      { id: 'rel3', source: 'user1', target: 'jtbd2', type: 'DOES', nps: 25 },
      { id: 'rel4', source: 'jtbd1', target: 'service1', type: 'DEPENDS_ON' }
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
      // JTBD1 has two DOES edges with NPS 85 and 75, average should be 80
      const result = calculateAggregateNps('jtbd1', mockGraphData.links);
      expect(result).toBe(80);
    });

    it('should handle a single NPS value', () => {
      // JTBD2 has one DOES edge with NPS 25
      const result = calculateAggregateNps('jtbd2', mockGraphData.links);
      expect(result).toBe(25);
    });

    it('should return null if no NPS data is available', () => {
      // service1 has no DOES edges
      const result = calculateAggregateNps('service1', mockGraphData.links);
      expect(result).toBeNull();
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

  describe('enhanceWithNpsScores', () => {
    it('should correctly enhance JTBD nodes with NPS data', () => {
      const enhancedData = enhanceWithNpsScores(mockGraphData);
      
      // Check JTBD1 node (should have high satisfaction color)
      const jtbd1 = enhancedData.nodes.find(n => n.id === 'jtbd1');
      expect(jtbd1.npsScore).toBe(80);
      expect(jtbd1.npsColor).toBe('#81C784'); // Light Green for high satisfaction
      
      // Check JTBD2 node (should have low satisfaction color)
      const jtbd2 = enhancedData.nodes.find(n => n.id === 'jtbd2');
      expect(jtbd2.npsScore).toBe(25);
      expect(jtbd2.npsColor).toBe('#EF9A9A'); // Light Red for low satisfaction
      
      // Non-JTBD nodes should not be modified
      const userNode = enhancedData.nodes.find(n => n.id === 'user1');
      expect(userNode).not.toHaveProperty('npsScore');
      expect(userNode).not.toHaveProperty('npsColor');
    });
  });
});
