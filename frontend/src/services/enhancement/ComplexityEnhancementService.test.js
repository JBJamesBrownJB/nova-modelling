import {
  enhanceWithComplexity,
  calculateNodeComplexity,
  countServiceDependencies,
  isServiceDependencyLink
} from './ComplexityEnhancementService';

// Mock data setup
const mockGraphData = {
  nodes: [
    { id: 'jtbd1', label: 'JTBD', name: 'Test JTBD 1' },
    { id: 'service1', label: 'Service', name: 'Test Service 1' },
    { id: 'service2', label: 'Service', name: 'Test Service 2' }
  ],
  links: [
    { source: 'jtbd1', target: 'service1', type: 'USES' },
    { source: 'jtbd1', target: 'service2', type: 'USES' }
  ]
};

describe('ComplexityEnhancementService', () => {
  describe('enhanceWithComplexity', () => {
    it('should enhance JTBD nodes with complexity without mutating original data', () => {
      const originalData = JSON.parse(JSON.stringify(mockGraphData));
      const enhancedData = enhanceWithComplexity(mockGraphData);
      
      // Verify original data wasn't mutated
      expect(mockGraphData).toEqual(originalData);
      
      // Verify JTBD node enhancement
      const jtbd1 = enhancedData.nodes.find(n => n.id === 'jtbd1');
      expect(jtbd1).toHaveProperty('complexity');
      expect(jtbd1.complexity).toBe(6); // 2 services * weight of 3
    });

    it('should not add complexity to non-JTBD nodes', () => {
      const enhancedData = enhanceWithComplexity(mockGraphData);
      const service1 = enhancedData.nodes.find(n => n.id === 'service1');
      expect(service1.complexity).toBe(undefined);
    });
  });

  describe('calculateNodeComplexity', () => {
    it('should calculate correct complexity for JTBD nodes', () => {
      const jtbd1 = mockGraphData.nodes.find(n => n.id === 'jtbd1');
      const complexity = calculateNodeComplexity(jtbd1, mockGraphData.links, mockGraphData.nodes);
      expect(complexity).toBe(6); // 2 services * weight of 3
    });

    it('should return 0 for non-JTBD nodes', () => {
      const service1 = mockGraphData.nodes.find(n => n.id === 'service1');
      const complexity = calculateNodeComplexity(service1, mockGraphData.links, mockGraphData.nodes);
      expect(complexity).toBe(0);
    });
  });

  describe('countServiceDependencies', () => {
    it('should count correct number of service dependencies', () => {
      const jtbd1 = mockGraphData.nodes.find(n => n.id === 'jtbd1');
      const count = countServiceDependencies(jtbd1, mockGraphData.links, mockGraphData.nodes);
      expect(count).toBe(2);
    });

    it('should return 0 when no dependencies exist', () => {
      const nonexistentNode = { id: 'nonexistent', label: 'JTBD' };
      const count = countServiceDependencies(nonexistentNode, mockGraphData.links, mockGraphData.nodes);
      expect(count).toBe(0);
    });
  });

  describe('isServiceDependencyLink', () => {
    it('should correctly identify service dependency links', () => {
      const jtbd1 = mockGraphData.nodes.find(n => n.id === 'jtbd1');
      const link = mockGraphData.links[0];
      expect(isServiceDependencyLink(jtbd1, link)).toBe(true);
    });

    it('should return false for non-dependency links', () => {
      const jtbd1 = mockGraphData.nodes.find(n => n.id === 'jtbd1');
      const nonDependencyLink = { source: 'service1', target: 'jtbd1', type: 'OTHER' };
      expect(isServiceDependencyLink(jtbd1, nonDependencyLink)).toBe(false);
    });
  });
});
