import { calculateLinkEdgePoints, getNodeFromReference, getNodeRadius } from './GraphUtils';

describe('GraphUtils', () => {
  // Mock getNodeRadius function for testing link calculations
  const mockGetNodeRadius = (node) => {
    if (node.label === 'Goal') return 10;
    if (node.label === 'Service') return 20;
    if (node.label === 'User') return 15;
    return 10; // Default
  };

  // Test nodes with positions
  const mockNodes = [
    { id: 'Goal1', label: 'Goal', x: 100, y: 100 },
    { id: 'service1', label: 'Service', x: 200, y: 100 },
    { id: 'user1', label: 'User', x: 100, y: 200 }
  ];

  describe('getNodeRadius', () => {
    describe('Goal Nodes', () => {
      test('scales Goal nodes based on complexity', () => {
        const baseSize = 10; // Base size for Goal nodes
        
        // Test various complexity values
        const lowComplexity = { label: 'Goal', complexity: 5 };
        const mediumComplexity = { label: 'Goal', complexity: 20 };
        const highComplexity = { label: 'Goal', complexity: 50 };
        const extremeComplexity = { label: 'Goal', complexity: 1000 }; // Test max cap
        
        // Low complexity should add a small amount to radius
        expect(getNodeRadius(lowComplexity)).toBeCloseTo(baseSize + (5 / 1.4));
        
        // Medium complexity adds more
        expect(getNodeRadius(mediumComplexity)).toBeCloseTo(baseSize + (20 / 1.4));
        
        // High complexity adds even more
        expect(getNodeRadius(highComplexity)).toBeCloseTo(baseSize + (50 / 1.4));
        
        // Extreme complexity should cap at maximum (100)
        expect(getNodeRadius(extremeComplexity)).toBeCloseTo(baseSize + 100);
      });
      
      test('handles Goal nodes without complexity value', () => {
        const node = { label: 'Goal' };
        expect(getNodeRadius(node)).toBe(10); // Should return base size only
      });
    });
    
    describe('Service Nodes', () => {
      test('scales Service nodes based on dependant count', () => {
        const baseSize = 20; // Base size for Service nodes
        
        // Test various dependant counts
        const lowDependants = { label: 'Service', dependants: 1 };
        const mediumDependants = { label: 'Service', dependants: 10 };
        const highDependants = { label: 'Service', dependants: 25 };
        const extremeDependants = { label: 'Service', dependants: 100 }; // Test max cap
        
        // Low dependants should add a small amount to radius
        expect(getNodeRadius(lowDependants)).toBe(baseSize + (1 * 3));
        
        // Medium dependants adds more
        expect(getNodeRadius(mediumDependants)).toBe(baseSize + (10 * 3));
        
        // High dependants adds even more
        expect(getNodeRadius(highDependants)).toBe(baseSize + (25 * 3));
        
        // Extreme dependants should cap at maximum (100)
        expect(getNodeRadius(extremeDependants)).toBe(baseSize + 100);
      });
      
      test('handles Service nodes without dependants value', () => {
        const node = { label: 'Service' };
        expect(getNodeRadius(node)).toBe(20); // Should return base size only
      });
    });
    
    describe('User Nodes', () => {
      test('scales User nodes based on Goal count', () => {
        const baseSize = 20; // Base size for User nodes
        
        // Test various Goal counts
        const lowCount = { label: 'User', Importance: 1 };
        const mediumCount = { label: 'User', Importance: 10 };
        const highCount = { label: 'User', Importance: 25 };
        const extremeCount = { label: 'User', Importance: 100 }; // Test max cap
        
        // Low count should add a small amount to radius
        expect(getNodeRadius(lowCount)).toBe(baseSize + (1 * 3));
        
        // Medium count adds more
        expect(getNodeRadius(mediumCount)).toBe(baseSize + (10 * 3));
        
        // High count adds even more
        expect(getNodeRadius(highCount)).toBe(baseSize + (25 * 3));
        
        // Extreme count should cap at maximum (100)
        expect(getNodeRadius(extremeCount)).toBe(baseSize + 100);
      });
      
      test('handles User nodes without Importance value', () => {
        const node = { label: 'User' };
        expect(getNodeRadius(node)).toBe(20); // Should return base size only
      });
    });
    
    test('handles unknown node types with default size', () => {
      const unknownNode = { label: 'Unknown' };
      expect(getNodeRadius(unknownNode)).toBe(10);
    });
    
    test('handles nodes with no label', () => {
      const noLabelNode = { id: 'test' };
      expect(getNodeRadius(noLabelNode)).toBe(10); // Should return default size
    });
  });

  describe('getNodeFromReference', () => {
    test('returns node when given string id', () => {
      const result = getNodeFromReference('Goal1', mockNodes);
      expect(result).toEqual(mockNodes[0]);
    });

    test('returns node when given object reference', () => {
      const result = getNodeFromReference({ id: 'service1' }, mockNodes);
      expect(result).toEqual(mockNodes[1]);
    });

    test('returns null when node not found', () => {
      const result = getNodeFromReference('nonexistent', mockNodes);
      expect(result).toBeNull();
    });
  });

  describe('calculateLinkEdgePoints', () => {
    test('calculates correct edge points for horizontal links (string refs)', () => {
      // Goal -> Service (horizontal)
      const link = { source: 'Goal1', target: 'service1' };
      const result = calculateLinkEdgePoints(link, mockNodes, mockGetNodeRadius);

      // Source: Goal at (100,100) with radius 10
      // Target: Service at (200,100) with radius 20
      // Distance: 100 units horizontally

      // Expected source point: Start from Goal center, move right by its radius
      expect(result.source.x).toBeCloseTo(110); // 100 + 10 (radius)
      expect(result.source.y).toBeCloseTo(100); // Same y

      // Expected target point: End at Service edge, accounting for offset and radius
      expect(result.target.x).toBeCloseTo(177); // 200 - 20 (radius) - 3 (offset)
      expect(result.target.y).toBeCloseTo(100); // Same y
    });

    test('calculates correct edge points for vertical links (string refs)', () => {
      // Goal -> User (vertical)
      const link = { source: 'Goal1', target: 'user1' };
      const result = calculateLinkEdgePoints(link, mockNodes, mockGetNodeRadius);

      // Source: Goal at (100,100) with radius 10
      // Target: User at (100,200) with radius 15
      // Distance: 100 units vertically

      // Expected source point: Start from Goal center, move down by its radius
      expect(result.source.x).toBeCloseTo(100); // Same x
      expect(result.source.y).toBeCloseTo(110); // 100 + 10 (radius)

      // Expected target point: End at User edge, accounting for offset and radius
      expect(result.target.x).toBeCloseTo(100); // Same x
      expect(result.target.y).toBeCloseTo(182); // 200 - 15 (radius) - 3 (offset)
    });

    test('calculates correct edge points for diagonal links (string refs)', () => {
      // User -> Service (diagonal)
      const link = { source: 'user1', target: 'service1' };
      const result = calculateLinkEdgePoints(link, mockNodes, mockGetNodeRadius);

      // Source: User at (100,200) with radius 15
      // Target: Service at (200,100) with radius 20
      // Distance: ~141.42 units diagonally (100^2 + 100^2 = 20000, sqrt = 141.42)

      // Diagonal vector: (100, -100) - magnitude ~141.42
      const dx = 100, dy = -100;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Expected source: Move along diagonal by the radius
      const sourceRatio = 15 / distance;
      expect(result.source.x).toBeCloseTo(100 + dx * sourceRatio);
      expect(result.source.y).toBeCloseTo(200 + dy * sourceRatio);

      // Expected target: End before target by radius + offset
      const targetRatio = (distance - 20 - 3) / distance;
      expect(result.target.x).toBeCloseTo(100 + dx * targetRatio);
      expect(result.target.y).toBeCloseTo(200 + dy * targetRatio);
    });

    test('calculates correct edge points with object references', () => {
      // Using object references instead of string IDs
      const link = { 
        source: { id: 'Goal1' }, 
        target: { id: 'service1' } 
      };
      const result = calculateLinkEdgePoints(link, mockNodes, mockGetNodeRadius);

      // Same as horizontal test
      expect(result.source.x).toBeCloseTo(110);
      expect(result.source.y).toBeCloseTo(100);
      expect(result.target.x).toBeCloseTo(177);
      expect(result.target.y).toBeCloseTo(100);
    });

    test('handles nodes with same position (distance = 0)', () => {
      const samePositionNodes = [
        { id: 'node1', x: 100, y: 100 },
        { id: 'node2', x: 100, y: 100 }
      ];
      const link = { source: 'node1', target: 'node2' };
      
      const result = calculateLinkEdgePoints(link, samePositionNodes, () => 10);
      expect(result).toBeNull();
    });

    test('handles missing nodes', () => {
      const link = { source: 'missing', target: 'service1' };
      const result = calculateLinkEdgePoints(link, mockNodes, mockGetNodeRadius);
      expect(result).toBeNull();
    });

    test('handles nodes with missing coordinates', () => {
      const incompleteNodes = [
        { id: 'node1' }, // No coordinates
        { id: 'node2', x: 100, y: 100 }
      ];
      const link = { source: 'node1', target: 'node2' };
      
      const result = calculateLinkEdgePoints(link, incompleteNodes, () => 10);
      expect(result).toBeNull();
    });

    test('works with different node sizes', () => {
      // Testing that different radii affect the edge points correctly
      const variableSizeGetRadius = (node) => {
        return node.id === 'Goal1' ? 30 : 10; // Goal has large radius, service small
      };

      const link = { source: 'Goal1', target: 'service1' };
      const result = calculateLinkEdgePoints(link, mockNodes, variableSizeGetRadius);

      // Source: Goal at (100,100) with larger radius 30
      expect(result.source.x).toBeCloseTo(130); // 100 + 30 (larger radius)
      expect(result.source.y).toBeCloseTo(100);

      // Target: Service at (200,100) with smaller radius 10
      expect(result.target.x).toBeCloseTo(187); // 200 - 10 (smaller radius) - 3 (offset)
      expect(result.target.y).toBeCloseTo(100);
    });

    test('maintains correct offset in all directions', () => {
      // Test in all cardinal directions to ensure offset is consistent
      const cardinalNodes = [
        { id: 'center', x: 100, y: 100 },
        { id: 'right', x: 200, y: 100 },  // East
        { id: 'left', x: 0, y: 100 },      // West
        { id: 'top', x: 100, y: 0 },       // North
        { id: 'bottom', x: 100, y: 200 }   // South
      ];

      const constantRadius = () => 10;
      
      // East
      const eastLink = { source: 'center', target: 'right' };
      const eastResult = calculateLinkEdgePoints(eastLink, cardinalNodes, constantRadius);
      expect(eastResult.target.x).toBeCloseTo(187); // 200 - 10 - 3
      
      // West
      const westLink = { source: 'center', target: 'left' };
      const westResult = calculateLinkEdgePoints(westLink, cardinalNodes, constantRadius);
      expect(westResult.target.x).toBeCloseTo(13); // 0 + 10 + 3
      
      // North
      const northLink = { source: 'center', target: 'top' };
      const northResult = calculateLinkEdgePoints(northLink, cardinalNodes, constantRadius);
      expect(northResult.target.y).toBeCloseTo(13); // 0 + 10 + 3
      
      // South
      const southLink = { source: 'center', target: 'bottom' };
      const southResult = calculateLinkEdgePoints(southLink, cardinalNodes, constantRadius);
      expect(southResult.target.y).toBeCloseTo(187); // 200 - 10 - 3
    });
  });
});
