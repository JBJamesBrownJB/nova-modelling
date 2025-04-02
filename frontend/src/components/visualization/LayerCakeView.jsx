import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { COLORS } from '../../styles/colors';
import { showTooltip, hideTooltip } from './Graph/TooltipUtils';
import { getNodeRadius } from './Graph/GraphUtils';
import { goalNodeConfig, userNodeConfig, serviceNodeConfig } from './Graph/SimulationConfig';
import { NODE_CONSTANTS } from './shared/constants/nodeConstants';

const LayerCakeContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${COLORS.BACKGROUND};
  overflow-y: auto;
  
  .layer-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
  
  .layer {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
  }
  
  .layer-title {
    position: absolute;
    left: 20px;
    top: 10px;
    font-weight: bold;
    color: ${COLORS.TEXT_SECONDARY};
    font-size: 14px;
  }
  
  .user-layer {
    background-color: ${COLORS.BLUE_50};
  }
  
  .goal-layer {
    background-color: ${COLORS.GREY_50};
  }
  
  .service-layer {
    background-color: ${COLORS.BLUE_50};
  }
  
  .node {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
  }
  
  .goal-node {
    margin: 6px;
  }
  
  .service-node {
    margin: 1px;
    margin-top: 10px;
  }
  
  .user-node {
    margin: 10px;
  }
  
  .node:hover {
    transform: scale(1.1);
  }
  
.node-selected {
    transform: scale(1.1);
    filter: drop-shadow(0 0 4px ${COLORS.PRIMARY});
}
  
  .node-label {
    position: relative;
    margin-top: 4px;
    font-size: 12px;
    text-align: center;
    max-width: 85px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }
  
  .tooltip {
    position: absolute;
    background-color: white;
    border-radius: 4px;
    padding: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    pointer-events: none;
    font-size: 12px;
    z-index: 1000;
    opacity: 0;
  }
`;

function LayerCakeView({ data, selectedNodes, onNodeSelect }) {
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  // Helper to check if a node is selected
  const isNodeSelected = (nodeId) => selectedNodes.includes(nodeId);

  useEffect(() => {
    // Create tooltip if it doesn't exist
    if (!tooltipRef.current) {
      const tooltip = d3.select(containerRef.current)
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
      tooltipRef.current = tooltip;
    }

    // Separate nodes by type
    const userNodes = data.nodes.filter(userNodeConfig.filter);
    const goalNodes = data.nodes.filter(goalNodeConfig.filter);
    const serviceNodes = data.nodes.filter(serviceNodeConfig.filter);

    // Create layers
    const container = d3.select(containerRef.current);
    container.html(''); // Clear previous content

    const layersContainer = container.append('div')
      .attr('class', 'layer-container');

    // Create User Layer
    const userLayer = layersContainer.append('div')
      .attr('class', 'layer user-layer');

    userLayer.append('div')
      .attr('class', 'layer-title')
      .text('Users');

    // Create Goal Layer
    const goalLayer = layersContainer.append('div')
      .attr('class', 'layer goal-layer');

    goalLayer.append('div')
      .attr('class', 'layer-title')
      .text('Goals');

    // Create Service Layer
    const serviceLayer = layersContainer.append('div')
      .attr('class', 'layer service-layer');

    serviceLayer.append('div')
      .attr('class', 'layer-title')
      .text('Services');

    // Render User Nodes
    createUserNodes(userLayer, userNodes);

    // Render Goal Nodes
    createGoalNodes(goalLayer, goalNodes);

    // Render Service Nodes
    createServiceNodes(serviceLayer, serviceNodes);

  }, [data, selectedNodes]);

  // Create User Nodes
  const createUserNodes = (container, nodes) => {
    const nodeGroups = container.selectAll('.user-node')
      .data(nodes)
      .enter()
      .append('div')
      .attr('class', d => `node user-node ${isNodeSelected(d.id) ? 'node-selected' : ''}`)
      .on('click', (event, d) => handleNodeClick(event, d))
      .on('mouseover', (event, d) => {
        showTooltip(tooltipRef.current, d, event.pageX, event.pageY);
      })
      .on('mouseout', () => {
        hideTooltip(tooltipRef.current);
      });

    // Create SVG icon
    nodeGroups.append('svg')
      .attr('width', d => Math.max(18, getNodeRadius(d)))
      .attr('height', d => Math.max(18, getNodeRadius(d)))
      .append('path')
      .attr('d', userNodeConfig.icon)
      // .attr('transform', d => `translate(${0}, ${0}) scale(${getNodeRadius(d)})`)
      .attr('transform', d => `translate(${NODE_CONSTANTS.BASE_RADIUS - 23}, ${NODE_CONSTANTS.BASE_RADIUS - 20}) scale(${getNodeRadius(d) / NODE_CONSTANTS.BASE_RADIUS})`)
      .attr('fill', d => d.npsScore ? d.npsColor : COLORS.NODE_USER_DEFAULT);

    // Add label
    nodeGroups.append('div')
      .attr('class', 'node-label')
      .text(d => d.name || d.id);
  };

  // Create Goal Nodes
  const createGoalNodes = (container, nodes) => {
    const nodeGroups = container.selectAll('.goal-node')
      .data(nodes)
      .enter()
      .append('div')
      .attr('class', d => `node goal-node ${isNodeSelected(d.id) ? 'node-selected' : ''}`)
      .on('click', (event, d) => handleNodeClick(event, d))
      .on('mouseover', (event, d) => {
        showTooltip(tooltipRef.current, d, event.pageX, event.pageY);
      })
      .on('mouseout', () => {
        hideTooltip(tooltipRef.current);
      });

    // Create SVG circle
    nodeGroups.append('svg')
      .attr('width', NODE_CONSTANTS.BASE_RADIUS * 3)
      .attr('height', NODE_CONSTANTS.BASE_RADIUS * 3)
      .append('circle')
      .attr('cx', NODE_CONSTANTS.BASE_RADIUS + 11)
      .attr('cy', NODE_CONSTANTS.BASE_RADIUS + 10)
      .attr('r', d => Math.max(18, getNodeRadius(d)))
      .attr('fill', d => d.npsColor || COLORS.NPS_UNMEASURED);

    // Add label
    nodeGroups.append('div')
      .attr('class', 'node-label')
      .text(d => d.name || d.id);
  };

  // Create Service Nodes
  const createServiceNodes = (container, nodes) => {
    const nodeGroups = container.selectAll('.service-node')
      .data(nodes)
      .enter()
      .append('div')
      .attr('class', d => `node service-node ${isNodeSelected(d.id) ? 'node-selected' : ''}`)
      .on('click', (event, d) => handleNodeClick(event, d))
      .on('mouseover', (event, d) => {
        showTooltip(tooltipRef.current, d, event.pageX, event.pageY);
      })
      .on('mouseout', () => {
        hideTooltip(tooltipRef.current);
      });

    // Create SVG icon
    const svgElement = nodeGroups.append('svg')
      .attr('width', NODE_CONSTANTS.SERVICE_RADIUS * 4.5)
      .attr('height', NODE_CONSTANTS.SERVICE_RADIUS * 3.5);

    svgElement.append('path')
      .attr('d', serviceNodeConfig.icon)
      .attr('transform', `translate(${NODE_CONSTANTS.SERVICE_RADIUS}, ${NODE_CONSTANTS.SERVICE_RADIUS - 10}) scale(${NODE_CONSTANTS.SERVICE_RADIUS / 10})`)
      .attr('fill', d => {
        // Color based on status
        switch (d.status) {
          case 'in_development':
            return COLORS.STATUS_IN_DEVELOPMENT;
          case 'vapour':
          case 'planned':
            return COLORS.STATUS_VAPOUR;
          case 'active':
            return COLORS.STATUS_ACTIVE;
          default:
            return COLORS.STATUS_VAPOUR;
        }
      });

    // Add calendar icon for in-development services
    svgElement.filter(d => d.status === 'in_development')
      .append('path')
      .attr('d', serviceNodeConfig.extraIcon)
      .attr('class', 'planning-icon')
      .attr('fill', 'none')
      .attr('stroke', COLORS.STATUS_IN_DEVELOPMENT_ICON)
      .attr('stroke-width', '2')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('transform', `translate(${NODE_CONSTANTS.BASE_RADIUS + 34}, ${NODE_CONSTANTS.BASE_RADIUS - 20}) scale(0.8)`);

    // Add label
    nodeGroups.append('div')
      .attr('class', 'node-label')
      .text(d => d.name || d.id);
  };

  const handleNodeClick = (event, node) => {
    event.stopPropagation();
    onNodeSelect(node.id, event.ctrlKey);
  };

  return (
    <LayerCakeContainer ref={containerRef}>
      {/* The container will be populated by D3 */}
    </LayerCakeContainer>
  );
}

export default LayerCakeView;
