import React from 'react';
import { render } from '@testing-library/react';
import Graph from './Graph';

// Create a simplified mock that just enables the tests to run
jest.mock('d3', () => {
  return {
    select: () => ({
      selectAll: () => ({ remove: () => ({}) }),
      append: () => ({
        attr: () => ({
          append: () => ({
            attr: () => ({})
          }),
          call: () => ({})
        })
      })
    }),
    zoom: () => ({
      scaleExtent: () => ({
        on: () => ({})
      })
    }),
    forceSimulation: () => ({
      force: () => ({
        force: () => ({})
      }),
      nodes: () => ({}),
      on: () => ({})
    }),
    forceManyBody: () => ({ strength: () => ({}) }),
    forceCenter: () => ({}),
    forceX: () => ({ strength: () => ({}) }),
    forceY: () => ({ strength: () => ({}) }),
    forceLink: () => ({
      id: () => ({ distance: () => ({}) })
    })
  };
});

// Mock useRef to return a valid SVG element
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useRef: () => ({
      current: {
        clientWidth: 800,
        clientHeight: 600
      }
    }),
    useEffect: jest.fn().mockImplementation(fn => fn())
  };
});

describe('Graph Component', () => {
  const mockData = {
    nodes: [
      { id: 'jtbd1', label: 'JTBD', name: 'Test JTBD', complexity: 10 },
      { id: 'service1', label: 'Service', name: 'Test Service', dependants: 5 },
      { id: 'user1', label: 'User', name: 'Test User', jtbd_count: 3 }
    ],
    links: [
      { source: 'user1', target: 'jtbd1', type: 'DOES' },
      { source: 'jtbd1', target: 'service1', type: 'DEPENDS_ON' }
    ]
  };

  test('renders without crashing', () => {
    // This test just verifies the component renders without throwing
    expect(() => render(<Graph data={mockData} />)).not.toThrow();
  });

  test('handles null data gracefully', () => {
    // Should not throw an error when data is null
    expect(() => render(<Graph data={null} />)).not.toThrow();
  });

  test('handles empty data gracefully', () => {
    // Should not throw an error when data is empty
    expect(() => render(<Graph data={{}} />)).not.toThrow();
    expect(() => render(<Graph data={{ nodes: [], links: [] }} />)).not.toThrow();
  });
});
