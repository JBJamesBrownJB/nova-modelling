import {
  calculateNodeComplexity,
  countServiceDependencies,
  calculateServiceDependants,
  calculateUserJtbdCount,
  calculateGraphComplexity,
} from './ComplexityCalculator';

describe('ComplexityCalculator', () => {
  // Test fixtures
  const mockNodes = [
    { id: 'jtbd1', label: 'JTBD', name: 'Test JTBD' },
    { id: 'service1', label: 'Service', name: 'Test Service' },
    { id: 'user1', label: 'User', name: 'Test User' }
  ];
  
  const mockLinks = [
    { source: 'jtbd1', target: 'service1', type: 'DEPENDS_ON' },
    { source: 'user1', target: 'jtbd1', type: 'DOES' }
  ];

  describe('calculateNodeComplexity', () => {
    test('returns 0 for non-JTBD nodes', () => {
      const result = calculateNodeComplexity(
        { id: 'service1', label: 'Service' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(0);
    });

    test('calculates complexity based on service dependencies', () => {
      const result = calculateNodeComplexity(
        { id: 'jtbd1', label: 'JTBD' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(3); // Default weight * 1 dependency
    });

    test('respects custom dependency weight', () => {
      const result = calculateNodeComplexity(
        { id: 'jtbd1', label: 'JTBD' },
        mockLinks,
        mockNodes,
        { dependencyWeight: 5 }
      );
      expect(result).toBe(5); // Custom weight * 1 dependency
    });
  });

  describe('countServiceDependencies', () => {
    test('counts correct number of service dependencies', () => {
      const result = countServiceDependencies(
        { id: 'jtbd1', label: 'JTBD' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(1);
    });

    test('handles nodes with no dependencies', () => {
      const result = countServiceDependencies(
        { id: 'jtbd2', label: 'JTBD' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(0);
    });
  });

  describe('calculateServiceDependants', () => {
    test('counts correct number of JTBD dependants', () => {
      const result = calculateServiceDependants(
        { id: 'service1', label: 'Service' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(1);
    });

    test('returns 0 for non-Service nodes', () => {
      const result = calculateServiceDependants(
        { id: 'jtbd1', label: 'JTBD' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(0);
    });
  });

  describe('calculateUserJtbdCount', () => {
    test('counts correct number of JTBDs for user', () => {
      const result = calculateUserJtbdCount(
        { id: 'user1', label: 'User' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(1);
    });

    test('returns 0 for non-User nodes', () => {
      const result = calculateUserJtbdCount(
        { id: 'jtbd1', label: 'JTBD' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(0);
    });
  });

  describe('calculateGraphComplexity', () => {
    test('updates all node types correctly', () => {
      const result = calculateGraphComplexity(mockNodes, mockLinks);
      
      const jtbdNode = result.find(n => n.label === 'JTBD');
      const serviceNode = result.find(n => n.label === 'Service');
      const userNode = result.find(n => n.label === 'User');

      expect(jtbdNode.complexity).toBe(3);
      expect(jtbdNode.dependency_count).toBe(1);
      expect(serviceNode.dependants).toBe(1);
      expect(userNode.jtbd_count).toBe(1);
    });

    test('maintains immutability', () => {
      const result = calculateGraphComplexity(mockNodes, mockLinks);
      expect(result).not.toBe(mockNodes); // Should be new array
      expect(result[0]).not.toBe(mockNodes[0]); // Should be new objects
    });

    test('handles custom complexity configuration', () => {
      const result = calculateGraphComplexity(mockNodes, mockLinks, { dependencyWeight: 5 });
      const jtbdNode = result.find(n => n.label === 'JTBD');
      expect(jtbdNode.complexity).toBe(5); // Custom weight * 1 dependency
    });
  });

  describe('edge cases', () => {
    test('handles empty arrays', () => {
      const result = calculateGraphComplexity([], []);
      expect(result).toEqual([]);
    });

    test('handles missing links', () => {
      const result = calculateGraphComplexity(mockNodes, []);
      expect(result.every(node => 
        node.complexity === 0 || 
        node.dependants === 0 || 
        node.jtbd_count === 0
      )).toBe(true);
    });

    test('handles malformed links', () => {
      const badLinks = [
        { source: 'missing', target: 'service1', type: 'DEPENDS_ON' }
      ];
      expect(() => calculateGraphComplexity(mockNodes, badLinks))
        .not.toThrow();
    });
  });
});
