import React, { useState } from 'react';
import styled from 'styled-components';
import FocusContextGraph from './FocusContextGraph';
import Graph from './Graph'; // Original implementation
import VisualizationSelector from './VisualizationSelector';

const GraphContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

/**
 * GraphWrapper component that allows switching between different graph visualization modes
 */
function GraphWrapper(props) {
  const [mode, setMode] = useState('focusContext');

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  // Render the appropriate graph component based on the selected mode
  const renderGraph = () => {
    switch (mode) {
      case 'original':
        return <Graph {...props} />;
      case 'focusContext':
      default:
        return <FocusContextGraph {...props} />;
    }
  };

  return (
    <GraphContainer>
      {renderGraph()}
      <VisualizationSelector 
        activeMode={mode} 
        onModeChange={handleModeChange} 
      />
    </GraphContainer>
  );
}

export default GraphWrapper;
