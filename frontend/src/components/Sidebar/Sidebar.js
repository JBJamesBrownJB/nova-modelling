import React from 'react';
import styled from 'styled-components';
import { FaTimes, FaFilter, FaTable, FaProjectDiagram, FaChartBar } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: ${props => props.isOpen ? '300px' : '0'};
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
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
  padding: 15px;
  flex: 1;
  overflow-y: auto;
`;

const SectionTitle = styled.h4`
  margin: 20px 0 10px 0;
  font-size: 0.9rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NodeDetailCard = styled.div`
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 15px;
  margin-bottom: 15px;
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 1.1rem;
    color: #333;
  }
  
  .node-type {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: 12px;
    background-color: ${props => {
      if (props.nodeType === 'JTBD') return '#e3f2fd';
      if (props.nodeType === 'User') return '#f8e3eb';
      if (props.nodeType === 'Service') return '#e6f4ea';
      return '#f1f3f5';
    }};
    color: ${props => {
      if (props.nodeType === 'JTBD') return '#0d47a1';
      if (props.nodeType === 'User') return '#b31b5b';
      if (props.nodeType === 'Service') return '#1e8449';
      return '#495057';
    }};
  }
  
  .detail-item {
    display: flex;
    margin-bottom: 8px;
    font-size: 0.9rem;
    
    .label {
      font-weight: 500;
      width: 120px;
      color: #6c757d;
    }
    
    .value {
      flex: 1;
      color: #212529;
    }
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  
  input {
    margin-right: 8px;
  }
  
  .color-box {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    margin-right: 8px;
    display: inline-block;
  }
`;

function Sidebar({ isOpen, selectedNode, filterSettings, onFilterChange }) {
  const [activeTab, setActiveTab] = React.useState('filter');
  
  if (!isOpen) return null;
  
  const handleFilterChange = (setting, value) => {
    onFilterChange({ [setting]: value });
  };
  
  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>
        <h3>Graph Explorer</h3>
      </SidebarHeader>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'filter'} 
          onClick={() => setActiveTab('filter')}
        >
          <FaFilter />
          <span>Filter</span>
        </Tab>
        <Tab 
          active={activeTab === 'details'} 
          onClick={() => setActiveTab('details')}
        >
          <FaTable />
          <span>Details</span>
        </Tab>
        <Tab 
          active={activeTab === 'explore'} 
          onClick={() => setActiveTab('explore')}
        >
          <FaProjectDiagram />
          <span>Explore</span>
        </Tab>
        <Tab 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')}
        >
          <FaChartBar />
          <span>Stats</span>
        </Tab>
      </TabContainer>
      
      <SidebarContent>
        {activeTab === 'filter' && (
          <>
            <SectionTitle>Nodes</SectionTitle>
            <CheckboxLabel>
              <input 
                type="checkbox" 
                checked={filterSettings.showJTBD}
                onChange={(e) => handleFilterChange('showJTBD', e.target.checked)}
              />
              <span className="color-box" style={{ backgroundColor: '#57C7E3' }}></span>
              JTBD
            </CheckboxLabel>
            <CheckboxLabel>
              <input 
                type="checkbox" 
                checked={filterSettings.showUser}
                onChange={(e) => handleFilterChange('showUser', e.target.checked)}
              />
              <span className="color-box" style={{ backgroundColor: '#ECB5C9' }}></span>
              User
            </CheckboxLabel>
            <CheckboxLabel>
              <input 
                type="checkbox" 
                checked={filterSettings.showService}
                onChange={(e) => handleFilterChange('showService', e.target.checked)}
              />
              <span className="color-box" style={{ backgroundColor: '#8DCC93' }}></span>
              Service
            </CheckboxLabel>
            
            <SectionTitle>Relationships</SectionTitle>
            <CheckboxLabel>
              <input 
                type="checkbox" 
                checked={filterSettings.showDoes}
                onChange={(e) => handleFilterChange('showDoes', e.target.checked)}
              />
              <span className="color-box" style={{ backgroundColor: '#ECB5C9' }}></span>
              DOES
            </CheckboxLabel>
            <CheckboxLabel>
              <input 
                type="checkbox" 
                checked={filterSettings.showDependsOn}
                onChange={(e) => handleFilterChange('showDependsOn', e.target.checked)}
              />
              <span className="color-box" style={{ backgroundColor: '#F16667' }}></span>
              DEPENDS_ON
            </CheckboxLabel>
          </>
        )}
        
        {activeTab === 'details' && selectedNode && (
          <NodeDetailCard nodeType={selectedNode.label}>
            <h3>{selectedNode.name}</h3>
            <div className="node-type">{selectedNode.label}</div>
            
            {selectedNode.label === 'JTBD' && (
              <>
                <div className="detail-item">
                  <div className="label">Progress:</div>
                  <div className="value">{selectedNode.progress || 0}%</div>
                </div>
                <div className="detail-item">
                  <div className="label">Complexity:</div>
                  <div className="value">{selectedNode.complexity || 'N/A'}</div>
                </div>
              </>
            )}
            
            {selectedNode.label === 'Service' && (
              <div className="detail-item">
                <div className="label">JTBD Dependants:</div>
                <div className="value">{selectedNode.dependants || 'N/A'}</div>
              </div>
            )}
          </NodeDetailCard>
        )}
        
        {activeTab === 'details' && !selectedNode && (
          <div style={{ textAlign: 'center', color: '#6c757d', marginTop: 30 }}>
            Select a node to view its details
          </div>
        )}
        
        {activeTab === 'explore' && (
          <div style={{ textAlign: 'center', color: '#6c757d', marginTop: 30 }}>
            Exploration features coming soon
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div style={{ textAlign: 'center', color: '#6c757d', marginTop: 30 }}>
            Statistical analysis coming soon
          </div>
        )}
      </SidebarContent>
    </SidebarContainer>
  );
}

export default Sidebar;
