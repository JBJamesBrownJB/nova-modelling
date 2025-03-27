# Nova Modelling Visualization

A D3.js and React-based visualization tool for Nova Modelling, providing an interactive force-directed graph similar to Neo4j Bloom.

## Features

- Interactive force-directed graph visualization
- Node filtering by type (JTBD, User, Data)
- Relationship filtering by type (DOES, READS, WRITES, UPDATES)
- Node details panel
- Pan and zoom capabilities
- Mock database implementation for development

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Implementation Details

### Data Structure

The visualization uses the following data structure:

```javascript
{
  nodes: [
    { id: 'jtbd1', label: 'JTBD', name: 'Diagnose Patient', ... },
    { id: 'user1', label: 'User', name: 'Doctor', ... },
    { id: 'data1', label: 'Data', name: 'Patient List', ... }
  ],
  links: [
    { id: 'rel1', source: 'user1', target: 'jtbd1', type: 'DOES' },
    { id: 'rel2', source: 'jtbd1', target: 'data1', type: 'READS' },
    ...
  ]
}
```

### Database Integration

The app currently uses a mock database service. To connect to a real Neo4j database:

1. Update the `App.js` file to use `Neo4jDatabaseService` instead of `MockDatabaseService`
2. Provide connection details in the constructor

```javascript
// Initialize real Neo4j database service
const dbService = new Neo4jDatabaseService(
  'neo4j://localhost:7687',  // URI
  'neo4j',                   // Username
  'password'                 // Password
);
```

## Extending the Visualization

### Adding New Node Types

To add new node types:

1. Update the `nodeColors` object in `Graph.js`
2. Add new filter options in `Sidebar.js`
3. Update the mock data or Neo4j query to include the new node types

### Adding New Relationship Types

To add new relationship types:

1. Update the `linkColors` object in `Graph.js`
2. Add new filter options in `Sidebar.js`
3. Update the mock data or Neo4j query to include the new relationship types
