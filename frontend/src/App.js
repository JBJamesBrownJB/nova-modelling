import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Topbar from './components/Topbar/Topbar';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Graph from './components/Graph/Graph';
import MockDatabaseService from './services/database/MockDatabaseService';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #f8f9fa;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const GraphContainer = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterSettings, setFilterSettings] = useState({
    showJTBD: true,
    showUser: true,
    showData: true,
    showReads: true,
    showWrites: true,
    showUpdates: true,
    showDoes: true
  });

  // Initialize database service
  const dbService = new MockDatabaseService();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await dbService.getGraph();
        setGraphData(data);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };

  const handleFilterChange = (newSettings) => {
    setFilterSettings({ ...filterSettings, ...newSettings });
  };

  // Apply filters to graph data
  const filteredData = {
    nodes: graphData.nodes.filter(node => {
      if (node.label === 'JTBD' && !filterSettings.showJTBD) return false;
      if (node.label === 'User' && !filterSettings.showUser) return false;
      if (node.label === 'Data' && !filterSettings.showData) return false;
      return true;
    }),
    links: graphData.links.filter(link => {
      if (link.type === 'READS' && !filterSettings.showReads) return false;
      if (link.type === 'WRITES' && !filterSettings.showWrites) return false;
      if (link.type === 'UPDATES' && !filterSettings.showUpdates) return false;
      if (link.type === 'DOES' && !filterSettings.showDoes) return false;
      return true;
    })
  };

  return (
    <AppContainer>
      <Topbar onToggleSidebar={toggleSidebar} />
      <MainContent>
        <Sidebar 
          isOpen={sidebarOpen} 
          selectedNode={selectedNode} 
          filterSettings={filterSettings}
          onFilterChange={handleFilterChange}
        />
        <GraphContainer>
          {isLoading ? (
            <div>Loading graph data...</div>
          ) : (
            <Graph 
              data={filteredData} 
              onNodeSelect={handleNodeSelect}
              selectedNode={selectedNode}
            />
          )}
        </GraphContainer>
      </MainContent>
      <Footer />
    </AppContainer>
  );
}

export default App;
