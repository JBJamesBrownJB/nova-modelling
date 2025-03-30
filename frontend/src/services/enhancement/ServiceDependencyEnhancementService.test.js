import {
  enhanceWithServiceDependencies,
  calculateServiceDependants,
  calculateUserJtbdCount,
  isUserJtbdLink
} from './ServiceDependencyEnhancementService';

// Mock data setup
const mockGraphData = {
  nodes: [
    { id: 'service1', label: 'Service', name: 'Test Service 1' },
    { id: 'jtbd1', label: 'JTBD', name: 'Test JTBD 1' },
    { id: 'jtbd2', label: 'JTBD', name: 'Test JTBD 2' },
    { id: 'user1', label: 'User', name: 'Test User 1' }
  ],
  links: [
    { source: 'jtbd1', target: 'service1', type: 'USES' },
    { source: 'jtbd2', target: 'service1', type: 'USES' },
    { source: 'user1', target: 'jtbd1', type: 'DOES' },
    { source: 'user1', target: 'jtbd2', type: 'DOES' }
  ]
};

describe('ServiceDependencyEnhancementService', () => {
  describe('enhanceWithServiceDependencies', () => {
    it('should enhance nodes with dependency metrics without mutating original data', () => {
      const originalData = JSON.parse(JSON.stringify(mockGraphData));
      const enhancedData = enhanceWithServiceDependencies(mockGraphData);
      
      // Verify original data wasn't mutated
      expect(mockGraphData).toEqual(originalData);
      
      // Verify Service node enhancement
      const service1 = enhancedData.nodes.find(n => n.id === 'service1');
      expect(service1).toHaveProperty('dependantCount');
      expect(service1.dependantCount).toBe(2); // Two JTBDs use this service
      
      // Verify User node enhancement
      const user1 = enhancedData.nodes.find(n => n.id === 'user1');
      expect(user1).toHaveProperty('jtbdCount');
      expect(user1.jtbdCount).toBe(2); // User does two JTBDs
    });
  });

  describe('calculateServiceDependants', () => {
    it('should calculate correct number of dependent JTBDs', () => {
      const service1 = mockGraphData.nodes.find(n => n.id === 'service1');
      const count = calculateServiceDependants(service1, mockGraphData.links, mockGraphData.nodes);
      expect(count).toBe(2);
    });

    it('should return 0 when no dependants exist', () => {
      const nonexistentService = { id: 'nonexistent', label: 'Service' };
      const count = calculateServiceDependants(nonexistentService, mockGraphData.links, mockGraphData.nodes);
      expect(count).toBe(0);
    });
  });

  describe('calculateUserJtbdCount', () => {
    it('should calculate correct number of JTBDs for a user', () => {
      const user1 = mockGraphData.nodes.find(n => n.id === 'user1');
      const count = calculateUserJtbdCount(user1, mockGraphData.links, mockGraphData.nodes);
      expect(count).toBe(2);
    });

    it('should return 0 when user has no JTBDs', () => {
      const nonexistentUser = { id: 'nonexistent', label: 'User' };
      const count = calculateUserJtbdCount(nonexistentUser, mockGraphData.links, mockGraphData.nodes);
      expect(count).toBe(0);
    });
  });

  describe('isUserJtbdLink', () => {
    it('should correctly identify User-JTBD links', () => {
      const user1 = mockGraphData.nodes.find(n => n.id === 'user1');
      const link = mockGraphData.links[2]; // User-JTBD DOES link
      expect(isUserJtbdLink(user1, link)).toBe(true);
    });

    it('should return false for non-JTBD links', () => {
      const user1 = mockGraphData.nodes.find(n => n.id === 'user1');
      const nonJtbdLink = { source: 'user1', target: 'service1', type: 'OTHER' };
      expect(isUserJtbdLink(user1, nonJtbdLink)).toBe(false);
    });
  });
});
