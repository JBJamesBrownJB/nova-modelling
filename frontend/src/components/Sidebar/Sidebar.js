import React from 'react';
import styled from 'styled-components';
import { 
  FaChartLine, 
  FaListOl,
  FaClock,
  FaUser,
  FaServer,
  FaCircle
} from 'react-icons/fa';
import { COLORS } from '../../styles/colors';
import { ICONS } from '../../styles/icons';

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

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  margin-bottom: 8px;
`;

const ColorDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const ColorSquare = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background-color: ${props => props.color};
  position: relative;
  
  ${props => props.icon && `
    &:after {
      content: '';
      position: absolute;
      top: -3px;
      right: -3px;
      width: 10px;
      height: 10px;
      border: 2px solid #E67E22;
      border-radius: 50%;
    }
  `}
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
        <Tab
          active={activeTab === 'projection'}
          onClick={() => setActiveTab('projection')}
        >
          <FaClock />
          Projection
        </Tab>
      </TabContainer>

      <SidebarContent>
        {activeTab === 'progress' && (
          <>
            <SectionTitle>Progress View</SectionTitle>
            <div>
              <p>
                Progress means enabling users to achieve their goals effectively. It's not about code changes, velocity, or features. It's about helping users achieve their goals and receiving positive feedback.
                Your product is successful when it helps all users accomplish their goals with positive outcomes.
              </p>
              <p>
                Progress is measured through <strong>Net Promoter Scores (NPS)</strong> from users for the Goals they engage with.
              </p>
              
              <SectionTitle>Node Types</SectionTitle>
              
              <LegendItem>
                <FaCircle style={{ color: COLORS.NODE_GOAL_DEFAULT }} />
                <span><strong>Goal</strong> - Goals users aim to achieve</span>
              </LegendItem>
              
              <LegendItem>
                <FaUser style={{ color: COLORS.NODE_USER_DEFAULT }} />
                <span><strong>User</strong> - Users of your product</span>
              </LegendItem>
              
              <LegendItem>
                <FaServer style={{ color: COLORS.STATUS_VAPOUR }} />
                <span><strong>Services</strong> - Architectural components</span>
              </LegendItem>
              
              <SectionTitle>Node Sizes</SectionTitle>
              <ul style={{ fontSize: '0.85rem', paddingLeft: '20px', margin: '5px 0' }}>
                <li><strong>User</strong>: Larger = more goals</li>
                <li><strong>Goal</strong>: Larger = more complex</li>
                <li><strong>Service</strong>: Larger = supports more goals</li>
              </ul>
              
              <SectionTitle>NPS Colors</SectionTitle>
              <LegendItem>
                <ColorDot color="#81C784" />
                <span><strong>High</strong>: NPS 70-100</span>
              </LegendItem>
              <LegendItem>
                <ColorDot color="#FFB74D" />
                <span><strong>Medium</strong>: NPS 30-69</span>
              </LegendItem>
              <LegendItem>
                <ColorDot color="#EF9A9A" />
                <span><strong>Low</strong>: NPS below 30</span>
              </LegendItem>
              <LegendItem>
                <ColorDot color="#BDBDBD" />
                <span><strong>Unmeasured</strong>: No NPS data</span>
              </LegendItem>
              
              <SectionTitle>Service Status</SectionTitle>
              <LegendItem>
                <ColorSquare color={COLORS.STATUS_ACTIVE} />
                <span><strong>Active</strong>: Live service</span>
              </LegendItem>
              <LegendItem>
                <svg width="22" height="22" viewBox="2 0 26 25" style={{ marginRight: '-6px' }}>
                  <path
                    d={ICONS.PLANNING}
                    fill="none"
                    stroke={COLORS.STATUS_IN_DEVELOPMENT_ICON}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span><strong>In Development</strong></span>
              </LegendItem>
              <LegendItem>
                <ColorSquare color={COLORS.STATUS_VAPOUR} />
                <span><strong>Vaporware 😶‍🌫️</strong></span>
              </LegendItem>
            </div>
          </>
        )}

        {activeTab === 'priority' && (
          <>
            <SectionTitle>Priority View</SectionTitle>
            <div>Visualize and prioritize Goals based on complexity and impact</div>
          </>
        )}

        {activeTab === 'projection' && (
          <>
            <SectionTitle>Projection View</SectionTitle>
            <div>Forecast project timelines and resource requirements</div>
          </>
        )}
      </SidebarContent>

      <ControlsSection>
        <h4>Keyboard Controls</h4>
        <div className="control-item">
          <kbd>Click</kbd> to add/remove nodes from selection
        </div>
        <div className="control-item">
          <kbd>Ctrl</kbd> + Click to select only one node
        </div>
        <div className="control-item">
          <kbd>Esc</kbd> to clear selection
        </div>
      </ControlsSection>
    </SidebarContainer>
  );
}

export default Sidebar;
