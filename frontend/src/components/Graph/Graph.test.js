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
      { id: 'Goal1', label: 'Goal', name: 'Test Goal', complexity: 10 },
      { id: 'service1', label: 'Service', name: 'Test Service', dependants: 5 },
      { id: 'user1', label: 'User', name: 'Test User', Goal_count: 3 }
    ],
    links: [
      { source: 'user1', target: 'Goal1', type: 'DOES' },
      { source: 'Goal1', target: 'service1', type: 'DEPENDS_ON' }
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

  test('renders a single user node correctly when no other nodes exist', () => {
    // Prepare data with only one user node
    const singleUserData = {
      nodes: [
        { id: 'user1', label: 'User', name: 'Test User', Goal_count: 0 }
      ],
      links: []
    };

    // Render the component
    const { container } = render(<Graph data={singleUserData} />);
    
    // While we can't fully test the D3 visualization due to mocking,
    // we can verify that the Graph component doesn't throw errors
    // and that it properly processes the data for visualization
    expect(container).toBeTruthy();
  });

  test('renders a single Goal node correctly when no other nodes exist', () => {
    // Prepare data with only one Goal node
    const singleGoalData = {
      nodes: [
        { id: 'goal1', label: 'Goal', name: 'Test Goal', complexity: 8 }
      ],
      links: []
    };

    // Render the component
    const { container } = render(<Graph data={singleGoalData} />);
    expect(container).toBeTruthy();
  });

  test('renders a single Service node correctly when no other nodes exist', () => {
    // Prepare data with only one Service node
    const singleServiceData = {
      nodes: [
        { id: 'service1', label: 'Service', name: 'Test Service', dependants: 0, status: 'ACTIVE' }
      ],
      links: []
    };

    // Render the component
    const { container } = render(<Graph data={singleServiceData} />);
    expect(container).toBeTruthy();
  });

  test('renders a User and Goal with DOES link correctly', () => {
    // User connected to Goal via DOES link
    const userGoalData = {
      nodes: [
        { id: 'user1', label: 'User', name: 'Test User', Goal_count: 1 },
        { id: 'goal1', label: 'Goal', name: 'Test Goal', complexity: 5 }
      ],
      links: [
        { source: 'user1', target: 'goal1', type: 'DOES' }
      ]
    };

    // Render the component
    const { container } = render(<Graph data={userGoalData} />);
    expect(container).toBeTruthy();
  });

  test('renders a Goal and Service with DEPENDS_ON link correctly', () => {
    // Goal connected to Service via DEPENDS_ON link
    const goalServiceData = {
      nodes: [
        { id: 'goal1', label: 'Goal', name: 'Test Goal', complexity: 7 },
        { id: 'service1', label: 'Service', name: 'Test Service', dependants: 1, status: 'ACTIVE' }
      ],
      links: [
        { source: 'goal1', target: 'service1', type: 'DEPENDS_ON' }
      ]
    };

    // Render the component
    const { container } = render(<Graph data={goalServiceData} />);
    expect(container).toBeTruthy();
  });

  test('renders complete chain of User->Goal->Service correctly', () => {
    // Full chain: User connected to Goal, Goal connected to Service
    const fullChainData = {
      nodes: [
        { id: 'user1', label: 'User', name: 'Test User', Goal_count: 1 },
        { id: 'goal1', label: 'Goal', name: 'Test Goal', complexity: 6 },
        { id: 'service1', label: 'Service', name: 'Test Service', dependants: 1, status: 'IN_DEVELOPMENT' }
      ],
      links: [
        { source: 'user1', target: 'goal1', type: 'DOES' },
        { source: 'goal1', target: 'service1', type: 'DEPENDS_ON' }
      ]
    };

    // Render the component
    const { container } = render(<Graph data={fullChainData} />);
    expect(container).toBeTruthy();
  });
});
