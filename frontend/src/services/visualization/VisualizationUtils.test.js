import { calculateBucketedSize, getNodeRadius, NODE_SIZES } from './VisualizationUtils';

describe('VisualizationUtils', () => {
  describe('calculateBucketedSize', () => {
    it('should return minSize for null or undefined values', () => {
      expect(calculateBucketedSize(null, [1, 2, 3], 10, 20)).toBe(10);
      expect(calculateBucketedSize(undefined, [1, 2, 3], 10, 20)).toBe(10);
    });

    it('should return minSize for empty allValues array', () => {
      expect(calculateBucketedSize(5, [], 10, 20)).toBe(10);
    });

    it('should return mid-point size when all values are the same', () => {
      expect(calculateBucketedSize(5, [5, 5, 5], 10, 20)).toBe(15);
    });

    it('should correctly bucket values', () => {
      const values = [0, 25, 50, 75, 100];
      expect(calculateBucketedSize(0, values, 10, 50)).toBe(10);
      expect(calculateBucketedSize(25, values, 10, 50)).toBe(20);
      expect(calculateBucketedSize(50, values, 10, 50)).toBe(30);
      expect(calculateBucketedSize(75, values, 10, 50)).toBe(40);
      expect(calculateBucketedSize(100, values, 10, 50)).toBe(50);
    });
  });

  describe('getNodeRadius', () => {
    it('should return nodeSize if present', () => {
      const node = { nodeSize: 15, label: 'Goal' };
      expect(getNodeRadius(node)).toBe(15);
    });

    describe('Goal nodes', () => {
      it('should scale based on complexity', () => {
        const node = { label: 'Goal', complexity: 50 };
        const result = getNodeRadius(node);
        expect(result).toBeGreaterThanOrEqual(NODE_SIZES.GOAL.MIN);
        expect(result).toBeLessThanOrEqual(NODE_SIZES.GOAL.MAX);
      });

      it('should return MIN size when no complexity', () => {
        const node = { label: 'Goal' };
        expect(getNodeRadius(node)).toBe(NODE_SIZES.GOAL.MIN);
      });
    });

    describe('Service nodes', () => {
      it('should scale based on dependants', () => {
        const node = { label: 'Service', dependants: 10 };
        const result = getNodeRadius(node);
        expect(result).toBeGreaterThanOrEqual(NODE_SIZES.SERVICE.MIN);
        expect(result).toBeLessThanOrEqual(NODE_SIZES.SERVICE.MAX);
      });

      it('should return MIN size when no dependants', () => {
        const node = { label: 'Service' };
        expect(getNodeRadius(node)).toBe(NODE_SIZES.SERVICE.MIN);
      });
    });

    describe('User nodes', () => {
      it('should scale based on importance', () => {
        const node = { label: 'User', importance: 5 };
        const result = getNodeRadius(node);
        expect(result).toBeGreaterThanOrEqual(NODE_SIZES.USER.MIN);
        expect(result).toBeLessThanOrEqual(NODE_SIZES.USER.MAX);
      });

      it('should handle both importance and Importance properties', () => {
        const node1 = { label: 'User', importance: 5 };
        const node2 = { label: 'User', Importance: 5 };
        expect(getNodeRadius(node1)).toBe(getNodeRadius(node2));
      });

      it('should return MIN size when no importance', () => {
        const node = { label: 'User' };
        expect(getNodeRadius(node)).toBe(NODE_SIZES.USER.MIN);
      });
    });

    it('should return default MIN size for unknown node types', () => {
      const node = { label: 'Unknown' };
      expect(getNodeRadius(node)).toBe(10);
    });
  });
});
