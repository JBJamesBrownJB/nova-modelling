import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Topbar from './components/Topbar/Topbar';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Graph from './components/Graph/Graph';
import MockDatabaseService from './services/database/MockDatabaseService';
import NodeCreationForm from './components/NodeCreation/NodeCreationForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const AddNodeButton = styled.button`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #4361ee;
  color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 100;
  
  &:hover {
    background-color: #3a56d4;
    transform: scale(1.05);
  }
  
  &:focus {
    outline: none;
  }
`;

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [filterSettings, setFilterSettings] = useState({
    showJTBD: true,
    showUser: true,
    showData: true,
    showReads: true,
    showWrites: true,
    showUpdates: true,
    showDoes: true
  });

  // Node and relationship types
  const nodeTypes = ['JTBD', 'User', 'Data'];
  const relationshipTypes = ['DOES', 'READS', 'WRITES', 'UPDATES'];

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

  // Handle creating a new node
  const handleCreateNode = async (nodeType, properties, relationships) => {
    try {
      // Create the node
      const newNode = await dbService.addNode(nodeType, properties);
      
      // Add relationships if any
      for (const rel of relationships) {
        if (rel.targetId) {
          await dbService.addRelationship(newNode.id, rel.targetId, rel.type);
        }
      }
      
      // Update graph data
      const updatedGraph = await dbService.getGraph();
      setGraphData(updatedGraph);
      
      // Show success message
      toast.success(`${nodeType} node created successfully!`);
      
      return newNode;
    } catch (error) {
      console.error('Error creating node:', error);
      toast.error('Error creating node');
    }
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
            <>
              <Graph 
                data={filteredData} 
                onNodeSelect={handleNodeSelect}
                selectedNode={selectedNode}
              />
              <AddNodeButton onClick={() => setShowNodeForm(true)}>+</AddNodeButton>
            </>
          )}
        </GraphContainer>
      </MainContent>
      <Footer />
      
      <NodeCreationForm
        isOpen={showNodeForm}
        onClose={() => setShowNodeForm(false)}
        onCreateNode={handleCreateNode}
        nodeTypes={nodeTypes}
        existingNodes={graphData.nodes}
        relationshipTypes={relationshipTypes}
      />
      
      <ToastContainer position="bottom-right" autoClose={3000} />
    </AppContainer>
  );
}

export default App;
