import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../styles/colors';

const VisualizationSelectorContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: ${COLORS.BACKGROUND};
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const VisualizationButton = styled.button`
  background-color: ${props => props.active ? COLORS.PRIMARY : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  text-align: left;
  
  &:hover {
    background-color: ${props => props.active ? COLORS.PRIMARY : '#e0e0e0'};
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 8px;
  color: #333;
`;

const Description = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  margin-bottom: 8px;
`;

/**
 * A component that allows switching between different graph visualization modes
 */
function VisualizationSelector({ activeMode, onModeChange }) {
  const modes = [
    {
      id: 'original',
      name: 'Original',
      description: 'The original implementation'
    },
    {
      id: 'focusContext',
      name: 'Focus+Context',
      description: 'Selected nodes centered with stronger forces, others pushed outward'
    }
  ];

  return (
    <VisualizationSelectorContainer>
      <Title>Visualization Mode</Title>
      <Description>Select a layout algorithm</Description>
      {modes.map(mode => (
        <VisualizationButton
          key={mode.id}
          active={activeMode === mode.id}
          onClick={() => onModeChange(mode.id)}
          title={mode.description}
        >
          {mode.name}
        </VisualizationButton>
      ))}
    </VisualizationSelectorContainer>
  );
}

export default VisualizationSelector;
