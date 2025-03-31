import {
  calculateNodeComplexity,
  countServiceDependencies,
  calculateServiceDependants,
  calculateUserGoalCount,
  calculateGraphComplexity,
} from './ComplexityCalculator';

describe('ComplexityCalculator', () => {
  // Test fixtures
  const mockNodes = [
    { id: 'Goal1', label: 'Goal', name: 'Test Goal' },
    { id: 'service1', label: 'Service', name: 'Test Service' },
    { id: 'user1', label: 'User', name: 'Test User' }
  ];
  
  const mockLinks = [
    { source: 'Goal1', target: 'service1', type: 'DEPENDS_ON' },
    { source: 'user1', target: 'Goal1', type: 'DOES' }
  ];

  describe('calculateNodeComplexity', () => {
    test('returns 0 for non-Goal nodes', () => {
      const result = calculateNodeComplexity(
        { id: 'service1', label: 'Service' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(0);
    });

    test('calculates complexity based on service dependencies', () => {
      const result = calculateNodeComplexity(
        { id: 'Goal1', label: 'Goal' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(3); // Default weight * 1 dependency
    });

    test('respects custom dependency weight', () => {
      const result = calculateNodeComplexity(
        { id: 'Goal1', label: 'Goal' },
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
        { id: 'Goal1', label: 'Goal' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(1);
    });

    test('handles nodes with no dependencies', () => {
      const result = countServiceDependencies(
        { id: 'Goal2', label: 'Goal' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(0);
    });
  });

  describe('calculateServiceDependants', () => {
    test('counts correct number of Goal dependants', () => {
      const result = calculateServiceDependants(
        { id: 'service1', label: 'Service' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(1);
    });

    test('returns 0 for non-Service nodes', () => {
      const result = calculateServiceDependants(
        { id: 'Goal1', label: 'Goal' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(0);
    });
  });

  describe('calculateUserGoalCount', () => {
    test('counts correct number of Goals for user', () => {
      const result = calculateUserGoalCount(
        { id: 'user1', label: 'User' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(1);
    });

    test('returns 0 for non-User nodes', () => {
      const result = calculateUserGoalCount(
        { id: 'Goal1', label: 'Goal' },
        mockLinks,
        mockNodes
      );
      expect(result).toBe(0);
    });
  });

  describe('calculateGraphComplexity', () => {
    test('updates all node types correctly', () => {
      const result = calculateGraphComplexity(mockNodes, mockLinks);
      
      const GoalNode = result.find(n => n.label === 'Goal');
      const serviceNode = result.find(n => n.label === 'Service');
      const userNode = result.find(n => n.label === 'User');

      expect(GoalNode.complexity).toBe(3);
      expect(GoalNode.dependency_count).toBe(1);
      expect(serviceNode.dependants).toBe(1);
      expect(userNode.Goal_count).toBe(1);
    });

    test('maintains immutability', () => {
      const result = calculateGraphComplexity(mockNodes, mockLinks);
      expect(result).not.toBe(mockNodes); // Should be new array
      expect(result[0]).not.toBe(mockNodes[0]); // Should be new objects
    });

    test('handles custom complexity configuration', () => {
      const result = calculateGraphComplexity(mockNodes, mockLinks, { dependencyWeight: 5 });
      const GoalNode = result.find(n => n.label === 'Goal');
      expect(GoalNode.complexity).toBe(5); // Custom weight * 1 dependency
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
        node.Goal_count === 0
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
