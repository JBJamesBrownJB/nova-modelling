import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaPlus } from 'react-icons/fa';

const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
  
  button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #999;
    padding: 5px;
    
    &:hover {
      color: #333;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    font-size: 0.9rem;
    color: #555;
  }
  
  input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
    
    &:focus {
      outline: none;
      border-color: #4361ee;
      box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f1f3f5;
  color: #495057;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const CreateButton = styled(Button)`
  background-color: #4361ee;
  color: white;
  
  &:hover {
    background-color: #3a56d4;
  }
`;

const ColorPreview = styled.div`
  width: 100%;
  height: 30px;
  margin-top: 6px;
  border-radius: 4px;
  background-color: ${props => props.color};
  border: 1px solid #ddd;
`;

const RelationshipList = styled.div`
  margin-top: 16px;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
`;

const RelationshipItem = styled.div`
  padding: 8px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const AddRelationshipButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: 2px dashed #ddd;
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  justify-content: center;
  margin-top: 12px;
  cursor: pointer;
  color: #6c757d;
  transition: all 0.2s;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    border-color: #4361ee;
    color: #4361ee;
  }
`;

function NodeCreationForm({ isOpen, onClose, onCreateNode, nodeTypes, existingNodes, relationshipTypes }) {
  const [nodeType, setNodeType] = useState(nodeTypes[0]);
  const [name, setName] = useState('');
  const [properties, setProperties] = useState({});
  const [relationships, setRelationships] = useState([]);
  
  if (!isOpen) return null;
  
  // Get node color based on node type
  const getNodeColor = (type) => {
    switch (type) {
      case 'JTBD': return '#57C7E3';
      case 'User': return '#ECB5C9';
      case 'Data': return '#8DCC93';
      default: return '#D9D9D9';
    }
  };
  
  // Handle property change
  const handlePropertyChange = (key, value) => {
    setProperties({
      ...properties,
      [key]: value
    });
  };
  
  // Handle adding a new relationship
  const handleAddRelationship = () => {
    setRelationships([
      ...relationships,
      {
        id: Date.now(),
        sourceId: '', // Will be the new node
        targetId: '',
        type: relationshipTypes[0]
      }
    ]);
  };
  
  // Handle updating a relationship
  const handleRelationshipChange = (id, field, value) => {
    setRelationships(relationships.map(rel => {
      if (rel.id === id) {
        return { ...rel, [field]: value };
      }
      return rel;
    }));
  };
  
  // Handle removing a relationship
  const handleRemoveRelationship = (id) => {
    setRelationships(relationships.filter(rel => rel.id !== id));
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Create the node
    const nodeProps = {
      name,
      ...properties
    };
    
    // For JTBD nodes, add default progress if not specified
    if (nodeType === 'JTBD' && !nodeProps.progress) {
      nodeProps.progress = 0;
    }
    
    const newNode = await onCreateNode(nodeType, nodeProps, relationships);
    
    // Reset form
    setName('');
    setProperties({});
    setRelationships([]);
    onClose();
  };
  
  return (
    <FormOverlay>
      <FormContainer>
        <FormHeader>
          <h2>Create New {nodeType}</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </FormHeader>
        
        <FormGroup>
          <label>Node Type</label>
          <select 
            value={nodeType}
            onChange={(e) => setNodeType(e.target.value)}
          >
            {nodeTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <ColorPreview color={getNodeColor(nodeType)} />
        </FormGroup>
        
        <FormGroup>
          <label>Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter ${nodeType} name`}
            required
          />
        </FormGroup>
        
        {nodeType === 'JTBD' && (
          <>
            <FormGroup>
              <label>Progress (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={properties.progress || 0}
                onChange={(e) => handlePropertyChange('progress', parseInt(e.target.value, 10))}
                placeholder="Enter progress percentage"
              />
            </FormGroup>
            
            <FormGroup>
              <label>Complexity</label>
              <input 
                type="number" 
                min="0" 
                value={properties.complexity || ''}
                onChange={(e) => handlePropertyChange('complexity', parseInt(e.target.value, 10))}
                placeholder="Enter complexity score"
              />
            </FormGroup>
          </>
        )}
        
        {nodeType === 'Data' && (
          <FormGroup>
            <label>Readers</label>
            <input 
              type="number" 
              min="0"
              value={properties.readers || ''}
              onChange={(e) => handlePropertyChange('readers', parseInt(e.target.value, 10))}
              placeholder="Number of readers"
            />
          </FormGroup>
        )}
        
        <h3>Relationships</h3>
        {relationships.length > 0 && (
          <RelationshipList>
            {relationships.map(rel => (
              <RelationshipItem key={rel.id}>
                <div>
                  <select
                    value={rel.type}
                    onChange={(e) => handleRelationshipChange(rel.id, 'type', e.target.value)}
                  >
                    {relationshipTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {' to '}
                  <select
                    value={rel.targetId}
                    onChange={(e) => handleRelationshipChange(rel.id, 'targetId', e.target.value)}
                  >
                    <option value="">Select target node</option>
                    {existingNodes.map(node => (
                      <option key={node.id} value={node.id}>{node.name} ({node.label})</option>
                    ))}
                  </select>
                </div>
                <button onClick={() => handleRemoveRelationship(rel.id)}>
                  <FaTimes />
                </button>
              </RelationshipItem>
            ))}
          </RelationshipList>
        )}
        
        <AddRelationshipButton type="button" onClick={handleAddRelationship}>
          <FaPlus /> Add Relationship
        </AddRelationshipButton>
        
        <ButtonGroup>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <CreateButton onClick={handleSubmit} disabled={!name}>Create {nodeType}</CreateButton>
        </ButtonGroup>
      </FormContainer>
    </FormOverlay>
  );
}

export default NodeCreationForm;
