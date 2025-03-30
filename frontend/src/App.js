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
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState(new Set());

  // Node and relationship types
  const nodeTypes = ['JTBD', 'User', 'Service'];
  const relationshipTypes = ['DOES', 'DEPENDS_ON'];

  // Initialize database service
  const dbService = new MockDatabaseService();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Run initial complexity calculation to ensure all nodes have complexity scores
        await dbService.recalculateComplexity();

        // Get updated data with complexity values
        const updatedData = await dbService.getGraph();
        setGraphData(updatedData);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNodeSelect = (nodeId, isCtrlPressed) => {
    if (isCtrlPressed) {
      // If node is already selected, remove it
      if (selectedNodes.has(nodeId)) {
        const newSelectedNodes = new Set(selectedNodes);
        newSelectedNodes.delete(nodeId);
        setSelectedNodes(newSelectedNodes);
      } else {
        // Add to selection
        const newSelectedNodes = new Set(selectedNodes);
        newSelectedNodes.add(nodeId);
        setSelectedNodes(newSelectedNodes);
      }
    } else {
      // If clicking already selected single node, clear selection
      if (selectedNodes.size === 1 && selectedNodes.has(nodeId)) {
        setSelectedNodes(new Set());
      } else {
        // Otherwise select only this node
        setSelectedNodes(new Set([nodeId]));
      }
    }
  };

  const getVisibleData = () => {
    if (selectedNodes.size === 0) {
      // Show only JTBD and User nodes when nothing is selected
      return {
        nodes: graphData.nodes.filter(node => 
          node.label === 'JTBD' || node.label === 'User'
        ),
        links: []
      };
    }
  
    // Get all connected nodes and links
    const relevantLinks = graphData.links.filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return selectedNodes.has(sourceId) || selectedNodes.has(targetId);
    });
  
    const connectedIds = new Set([
      ...Array.from(selectedNodes),
      ...relevantLinks.map(link => {
        return typeof link.source === 'object' ? link.source.id : link.source;
      }),
      ...relevantLinks.map(link => {
        return typeof link.target === 'object' ? link.target.id : link.target;
      })
    ]);
  
    return {
      nodes: graphData.nodes.filter(node => connectedIds.has(node.id)),
      links: relevantLinks
    };
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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

      // Recalculate complexity after adding node and relationships
      await dbService.recalculateComplexity();

      // Get updated graph data
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

  const filteredData = {
    nodes: graphData.nodes,
    links: graphData.links
  };

  return (
    <AppContainer>
      <Topbar onToggleSidebar={toggleSidebar} />
      <MainContent>
        <Sidebar
          isOpen={sidebarOpen}
          selectedNodes={selectedNodes}
        />
        <GraphContainer>
          {isLoading ? (
            <div>Loading graph data...</div>
          ) : (
            <>
              <Graph
                data={getVisibleData()}
                onNodeSelect={(nodeId, isCtrlPressed) => handleNodeSelect(nodeId, isCtrlPressed)}
                selectedNodes={selectedNodes}
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
