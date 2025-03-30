import React from 'react';
import styled from 'styled-components';
import { 
  FaChartLine, 
  FaListOl,
  FaClock,
  FaHourglassHalf,
  FaRegClock,
  FaStopwatch,
  FaBusinessTime
} from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: ${props => props.isOpen ? '300px' : '0'};
  height: 100%;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
  }
  
  button {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 5px;
    
    &:hover {
      color: #333;
    }
    
    &:focus {
      outline: none;
    }
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e9ecef;
`;

const Tab = styled.button`
  flex: 1;
  border: none;
  background: ${props => props.active ? '#fff' : '#f8f9fa'};
  padding: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? '#4361ee' : '#6c757d'};
  font-size: 0.8rem;
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: ${props => props.active ? '2px solid #4361ee' : 'none'};
  
  &:hover {
    background-color: ${props => props.active ? '#fff' : '#f1f3f5'};
  }
  
  svg {
    margin-bottom: 5px;
    font-size: 1.1rem;
  }
  
  &:focus {
    outline: none;
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
`;

const SectionTitle = styled.h4`
  margin: 20px 0 10px 0;
  font-size: 0.9rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ControlsSection = styled.div`
  padding: 15px;
  border-top: 1px solid #e9ecef;
  background: #fff;
  
  h4 {
    margin: 0 0 10px 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
  }

  .control-item {
    margin: 8px 0;
    font-size: 0.85rem;
    color: #666;
    display: flex;
    align-items: center;
  }

  kbd {
    background-color: #f1f1f1;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 2px 6px;
    margin: 0 3px;
    font-family: monospace;
    font-size: 11px;
    min-width: 20px;
    text-align: center;
    display: inline-block;
  }
`;

const IconPreview = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin: 10px 0;
  font-size: 0.9rem;
  color: #666;
  
  > div {
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

function Sidebar({ isOpen }) {
  const [activeTab, setActiveTab] = React.useState('progress');

  if (!isOpen) return null;

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>
        <h3>Nova Modelling</h3>
      </SidebarHeader>

      <TabContainer>
        <Tab
          active={activeTab === 'progress'}
          onClick={() => setActiveTab('progress')}
        >
          <FaChartLine />
          Progress
        </Tab>
        <Tab
          active={activeTab === 'priority'}
          onClick={() => setActiveTab('priority')}
        >
          <FaListOl />
          Priority
        </Tab>
        {/* Try each clock icon - uncomment the one you prefer */}
        <Tab
          active={activeTab === 'projection'}
          onClick={() => setActiveTab('projection')}
        >
          <FaClock />
          {/* Regular clock */}
          Projection
        </Tab>
        {/* 
        Alternative options:
        <FaHourglassHalf /> - Hourglass
        <FaRegClock /> - Light clock
        <FaStopwatch /> - Stopwatch
        <FaBusinessTime /> - Business clock
        */}
      </TabContainer>

      <SidebarContent>
        {activeTab === 'progress' && (
          <>
            <SectionTitle>Progress View</SectionTitle>
            <div>Track NPS scores and JTBD completion status</div>
          </>
        )}
        {activeTab === 'priority' && (
          <>
            <SectionTitle>Prioritization View</SectionTitle>
            <div>View and manage JTBD demand and priorities</div>
          </>
        )}
        {activeTab === 'projection' && (
          <>
            <SectionTitle>Projection View</SectionTitle>
            <div>Project completion timelines based on complexity and progress data</div>
          </>
        )}
      </SidebarContent>

      <ControlsSection>
        <h4>Keyboard Shortcuts</h4>
        <div className="control-item">
          <kbd>ESC</kbd> Clear selection
        </div>
        <div className="control-item">
          <kbd>CTRL</kbd> + Click for multi-select
        </div>
        <div className="control-item">
          Drag nodes to reposition
        </div>
        <div className="control-item">
          Scroll to zoom
        </div>
      </ControlsSection>
    </SidebarContainer>
  );
}

export default Sidebar;
