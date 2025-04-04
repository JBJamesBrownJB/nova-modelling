# Nova Modelling Visualization

 [Live Demo 🚀](https://nova-modelling.surge.sh)

A D3.js and React-based visualization tool for Nova Modelling, providing an interactive force-directed graph similar to Neo4j Bloom.

## Features

- Interactive force-directed graph visualization
- Node filtering by type (Goal, User, Data)
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

### Testing

The project uses Jest and React Testing Library for unit tests. You can run tests using the following commands:

```bash
# Run tests once
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

Test files are co-located with their implementation files and follow the naming convention `*.test.js`. For example:
- `ComplexityCalculator.js` has its tests in `ComplexityCalculator.test.js`

When writing new features, aim to:
1. Write tests before implementing the feature (TDD)
2. Keep test coverage high
3. Test both happy paths and edge cases
4. Use descriptive test names that explain the behavior being tested

## Implementation Details

### Data Structure

The visualization uses the following data structure:

```javascript
{
  nodes: [
    { id: 'Goal1', label: 'Goal', name: 'Diagnose Patient', ... },
    { id: 'user1', label: 'User', name: 'Doctor', ... },
    { id: 'data1', label: 'Data', name: 'Patient List', ... }
  ],
  links: [
    { id: 'rel1', source: 'user1', target: 'Goal1', type: 'DOES' },
    { id: 'rel2', source: 'Goal1', target: 'data1', type: 'READS' },
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
