import React from 'react';
import styled from 'styled-components';
import { FaGithub } from 'react-icons/fa';

const FooterContainer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 8px 20px;
  font-size: 0.8rem;
  color: #6c757d;
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  
  a {
    color: #6c757d;
    text-decoration: none;
    display: flex;
    align-items: center;
    margin-left: 15px;
    
    &:hover {
      color: #4361ee;
      text-decoration: underline;
    }
    
    svg {
      margin-right: 5px;
    }
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #10b981;
    margin-right: 6px;
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterLeft>
        <StatusIndicator>Using mock data</StatusIndicator>
      </FooterLeft>
      
      <FooterRight>
        <span>Nova Modelling Visualization</span>
        <a href="https://github.com/JBJamesBrownJB/nova-modelling" target="_blank" rel="noopener noreferrer">
          <FaGithub />
          GitHub
        </a>
      </FooterRight>
    </FooterContainer>
  );
}

export default Footer;
