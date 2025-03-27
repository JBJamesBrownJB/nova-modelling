import React from 'react';
import styled from 'styled-components';
import { FaBars, FaCog, FaSearch, FaQuestion, FaDatabase } from 'react-icons/fa';

const TopbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1a1a1a;
  color: white;
  height: 50px;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  
  span {
    margin-left: 8px;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
`;

const SearchBox = styled.div`
  position: relative;
  margin-right: 20px;
  
  input {
    padding: 8px 12px 8px 35px;
    border-radius: 4px;
    border: none;
    background-color: #333;
    color: white;
    width: 250px;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      background-color: #444;
    }
  }
  
  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.1rem;
  margin-left: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #333;
    color: white;
  }
  
  &:focus {
    outline: none;
  }
`;

function Topbar({ onToggleSidebar }) {
  return (
    <TopbarContainer>
      <Logo>
        <FaDatabase />
        <span>Nova Modelling</span>
      </Logo>
      
      <Controls>
        <SearchBox>
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search nodes..."
          />
        </SearchBox>
        
        <IconButton onClick={onToggleSidebar} title="Toggle Sidebar">
          <FaBars />
        </IconButton>
        
        <IconButton title="Settings">
          <FaCog />
        </IconButton>
        
        <IconButton title="Help">
          <FaQuestion />
        </IconButton>
      </Controls>
    </TopbarContainer>
  );
}

export default Topbar;
