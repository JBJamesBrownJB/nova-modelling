import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Topbar from './components/Topbar/Topbar';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Graph from './components/Graph/Graph';
import LayerCake from './components/Graph/LayerCake';
import MockDatabaseService from './services/database/MockDatabaseService';
import NodeCreationForm from './components/NodeCreation/NodeCreationForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { enhanceGraphData } from './services/enhancement/DataEnhancementService';

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
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [activeTab, setActiveTab] = useState('progress');

  // Node and relationship types
  const nodeTypes = ['Goal', 'User', 'Service'];
  const relationshipTypes = ['DOES', 'DEPENDS_ON'];

  // Initialize database service
  const dbService = new MockDatabaseService();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get raw data
        const rawData = await dbService.getGraph();
        
        // Process data using the enhancement service
        const enhancedData = enhanceGraphData(rawData);
        
        console.log('Initial graph data loaded:', enhancedData);
        setGraphData(enhancedData);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNodeSelect = (nodeId, isCtrlPressed) => {
    console.log('Node selection:', { nodeId, isCtrlPressed, currentSelection: selectedNodes });
    
    // REVERSED BEHAVIOR: Default is multi-select, Ctrl+click is single-select
    if (isCtrlPressed) {
      // Ctrl+click now selects only this node (replaces selection)
      // If clicking already selected single node, clear selection
      if (selectedNodes.length === 1 && selectedNodes.includes(nodeId)) {
        setSelectedNodes([]);
      } else {
        // Otherwise select only this node
        setSelectedNodes([nodeId]);
      }
    } else {
      // Default click now adds/removes from multi-selection
      // If node is already selected, remove it
      if (selectedNodes.includes(nodeId)) {
        const newSelectedNodes = selectedNodes.filter(id => id !== nodeId);
        setSelectedNodes(newSelectedNodes);
      } else {
        // Add to selection
        setSelectedNodes([...selectedNodes, nodeId]);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        console.log('Escape pressed, clearing selection');
        setSelectedNodes([]);
      }
    };

    // Add keyboard listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getVisibleData = () => {
    if (activeTab === 'progress') {
      // For LayerCake view: show all nodes by default
      if (selectedNodes.length === 0) {
        return graphData;
      }
    } else if (activeTab === 'explore') {
      // For Graph view: show only Goal and User nodes when nothing is selected
      if (selectedNodes.length === 0) {
        const filteredNodes = graphData.nodes.filter(node => 
          node.label === 'Goal' || node.label === 'User'
        );
        return {
          nodes: filteredNodes,
          links: []
        };
      }
    }
  
    // When nodes are selected (for both views)
    const relevantLinks = graphData.links.filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return selectedNodes.includes(sourceId) || selectedNodes.includes(targetId);
    });
  
    const connectedIds = new Set([
      ...selectedNodes,
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

  const handleAddNode = async (nodeType, properties) => {
    setIsLoading(true);
    try {
      await dbService.addNode(nodeType, properties);
      const updatedData = await dbService.getGraph();
      
      // Process the updated data using the enhancement service
      const enhancedData = enhanceGraphData(updatedData);
      
      setGraphData(enhancedData);
      setShowNodeForm(false);
      toast.success(`${nodeType} node added successfully`);
    } catch (error) {
      console.error('Error adding node:', error);
      toast.error('Failed to add node');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = getVisibleData();

  return (
    <AppContainer>
      <Topbar onToggleSidebar={toggleSidebar} />
      <MainContent>
        <Sidebar
          isOpen={sidebarOpen}
          selectedNodes={selectedNodes}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <GraphContainer>
          {isLoading ? (
            <div>Loading graph data...</div>
          ) : (
            <>
              {activeTab === 'explore' ? (
                <Graph
                  data={filteredData}
                  onNodeSelect={(nodeId, isCtrlPressed) => handleNodeSelect(nodeId, isCtrlPressed)}
                  selectedNodes={selectedNodes}
                />
              ) : activeTab === 'progress' ? (
                <LayerCake
                  data={filteredData}
                  onNodeSelect={(nodeId, isCtrlPressed) => handleNodeSelect(nodeId, isCtrlPressed)}
                  selectedNodes={selectedNodes}
                />
              ) : (
                <div>Invalid tab selected</div>
              )}
              <AddNodeButton onClick={() => setShowNodeForm(true)}>+</AddNodeButton>
            </>
          )}
        </GraphContainer>
      </MainContent>
      <Footer />

      <NodeCreationForm
        isOpen={showNodeForm}
        onClose={() => setShowNodeForm(false)}
        onCreateNode={handleAddNode}
        nodeTypes={nodeTypes}
        existingNodes={graphData.nodes}
        relationshipTypes={relationshipTypes}
      />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </AppContainer>
  );
}

export default App;
