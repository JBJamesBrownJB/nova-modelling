import {
  enhanceWithNpsScores,
  getNpsColor,
  calculateJtbdNps,
  calculateUserNps,
  calculateAverageNps
} from './NpsEnhancementService';

// Mock data setup
const mockGraphData = {
  nodes: [
    { id: 'jtbd1', label: 'JTBD', name: 'Test JTBD 1' },
    { id: 'user1', label: 'User', name: 'Test User 1' },
    { id: 'service1', label: 'Service', name: 'Test Service 1' }
  ],
  links: [
    { source: 'user1', target: 'jtbd1', type: 'DOES', nps: 75 },
    { source: 'user1', target: 'jtbd1', type: 'DOES', nps: 65 }
  ]
};

describe('NpsEnhancementService', () => {
  describe('enhanceWithNpsScores', () => {
    it('should enhance nodes with NPS scores without mutating original data', () => {
      const originalData = JSON.parse(JSON.stringify(mockGraphData));
      const enhancedData = enhanceWithNpsScores(mockGraphData);
      
      // Verify original data wasn't mutated
      expect(mockGraphData).toEqual(originalData);
      
      // Verify JTBD node enhancement
      const jtbd1 = enhancedData.nodes.find(n => n.id === 'jtbd1');
      expect(jtbd1).toHaveProperty('npsScore');
      expect(jtbd1).toHaveProperty('npsColor');
      expect(jtbd1.npsScore).toBe(70); // Average of 75 and 65
      
      // Verify User node enhancement
      const user1 = enhancedData.nodes.find(n => n.id === 'user1');
      expect(user1).toHaveProperty('npsScore');
      expect(user1).toHaveProperty('npsColor');
    });
  });

  describe('getNpsColor', () => {
    it('should return correct colors based on NPS score', () => {
      // Grey for null/undefined
      expect(getNpsColor(null)).toBe('#E0E0E0');
      expect(getNpsColor(undefined)).toBe('#E0E0E0');
      
      // Light Red for low satisfaction
      expect(getNpsColor(-50)).toBe('#FFCDD2');
      expect(getNpsColor(-1)).toBe('#FFCDD2');
      
      // Deep Orange for neutral satisfaction
      expect(getNpsColor(0)).toBe('#FFCCBC');
      expect(getNpsColor(15)).toBe('#FFCCBC');
      expect(getNpsColor(29)).toBe('#FFCCBC');
      
      // Light Orange for good satisfaction
      expect(getNpsColor(30)).toBe('#FFE0B2');
      expect(getNpsColor(50)).toBe('#FFE0B2');
      expect(getNpsColor(69)).toBe('#FFE0B2');
      
      // Light Green for excellent satisfaction
      expect(getNpsColor(70)).toBe('#A5D6A7');
      expect(getNpsColor(85)).toBe('#A5D6A7');
      expect(getNpsColor(100)).toBe('#A5D6A7');
    });
  });

  describe('calculateJtbdNps', () => {
    it('should calculate correct NPS for JTBD nodes', () => {
      const nps = calculateJtbdNps('jtbd1', mockGraphData.links);
      expect(nps).toBe(70); // Average of 75 and 65
    });

    it('should return null when no NPS data available', () => {
      const nps = calculateJtbdNps('nonexistent', mockGraphData.links);
      expect(nps).toBeNull();
    });
  });

  describe('calculateUserNps', () => {
    it('should calculate correct NPS for User nodes', () => {
      const nps = calculateUserNps('user1', mockGraphData.links);
      expect(nps).toBe(70); // Average of 75 and 65
    });

    it('should return null when no NPS data available', () => {
      const nps = calculateUserNps('nonexistent', mockGraphData.links);
      expect(nps).toBeNull();
    });
  });

  describe('calculateAverageNps', () => {
    it('should calculate correct average NPS', () => {
      const edges = [
        { nps: 75 },
        { nps: 65 }
      ];
      expect(calculateAverageNps(edges)).toBe(70);
    });

    it('should return null for empty edge array', () => {
      expect(calculateAverageNps([])).toBeNull();
    });
  });
});
