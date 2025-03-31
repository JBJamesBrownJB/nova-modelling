import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { showTooltip, hideTooltip } from './TooltipUtils';
import { calculateLinkEdgePoints, getNodeRadius } from './GraphUtils';
import { COLORS } from '../../styles/colors';
import { ICONS } from '../../styles/icons';

const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${COLORS.BACKGROUND};

  .links line {
    stroke-opacity: 0.6;
    stroke-width: 1.5px;
    transition: opacity 0.2s ease-in-out;
  }

  .nodes circle, .nodes path, .node-label {
    transition: opacity 0.2s ease-in-out;
  }

  .nodes circle {
    cursor: pointer;
  }
  
  .nodes path {
    cursor: pointer;
  }
  
  .nodes {
    cursor: pointer;
  }

  .node-label {
    font-size: 12px;
    pointer-events: none;
    text-anchor: middle;
    dy: 0.35em;
    fill: #333;
    font-weight: 500;
  }
  
  .selected-node {
    stroke: #000;
    stroke-width: 1.1px;
  }

  .fading {
    opacity: 0;
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

function Graph({ data, selectedNodes, onNodeSelect }) {
  const svgRef = useRef(null);
  
  const linkColors = {
    'DOES': '#ECB5C9',   // Pink
    'DEPENDS_ON': '#F16667'  // Red
  };

  const getServiceColor = (status) => {
    switch (status) {
      case 'in_development':
        return COLORS.STATUS_IN_DEVELOPMENT;
      case 'vapour':
        return COLORS.STATUS_VAPOUR;
      case 'active':
        return COLORS.STATUS_ACTIVE;
      default:
        return COLORS.STATUS_VAPOUR;
    }
  };

  const setupArrowMarkers = (container) => {
    const defs = container.append('defs');

    Object.entries(linkColors).forEach(([type, color]) => {
      defs.append('marker')
        .attr('id', `arrowhead-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 3)
        .attr('markerHeight', 2)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .attr('fill', color)
        .style('stroke', 'none');
    });
  };

  const handleNodeClick = (event, node) => {
    event.stopPropagation(); 
    onNodeSelect(node.id, event.ctrlKey);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onNodeSelect([]);
      }
    };

    // Add keyboard listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNodeSelect]);

  useEffect(() => {
    if (!data || !data.nodes || !data.links) {
      console.log('No graph data available');
      return;
    }

    console.log('Rendering graph with data:', { 
      nodes: data.nodes.length, 
      links: data.links.length,
      selectedNodes
    });

    // Keep track of current nodes and links for transitions
    const currentNodes = new Set(data.nodes.map(n => n.id));
    const currentLinks = new Set(data.links.map(l => `${l.source}-${l.target}-${l.type}`));

    // Add fade out class to removed elements before removing them
    d3.select(svgRef.current).selectAll('.nodes > g')
      .filter(d => !currentNodes.has(d.id))
      .classed('fading', true);

    d3.select(svgRef.current).selectAll('.links line')
      .filter(d => !currentLinks.has(`${d.source.id}-${d.target.id}-${d.type}`))
      .classed('fading', true);

    d3.select(svgRef.current).selectAll('.node-label')
      .filter(d => !currentNodes.has(d.id))
      .classed('fading', true);

    // Wait for transition to complete before removing elements
    setTimeout(() => {
      d3.select(svgRef.current).selectAll('*').remove();

      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;

      const svg = d3.select(svgRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // Add zoom behavior
      const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          container.attr('transform', event.transform);
        });

      svg.call(zoom);

      // Create a container for all graph elements that will be zoomed
      const container = svg.append('g');

      setupArrowMarkers(container);

      const tooltip = d3.select(svgRef.current)
        .append('div')
        .attr('class', 'tooltip');

      const nodesGroup = container.append('g')
        .attr('class', 'nodes');

      // Add circle nodes for Goal
      const GoalGroups = nodesGroup.selectAll('.Goal-group')
        .data(data.nodes.filter(d => d.label === 'Goal'))
        .enter()
        .append('g')
        .attr('class', 'Goal-group');

      // Add invisible hit area
      GoalGroups.append('circle')
        .attr('class', 'hit-area')
        .attr('r', d => getNodeRadius(d) * 1.25)
        .attr('fill', 'rgba(0,0,0,0)')
        .attr('stroke', 'none');

      // Add visible node
      GoalGroups.append('circle')
        .attr('class', d => `circle-node ${selectedNodes.includes(d.id) ? 'selected-node' : ''}`)
        .attr('r', d => getNodeRadius(d))
        .attr('fill', d => d.npsColor);

      // Add event handlers to the group
      GoalGroups
        .on('mouseover', (event, d) => showTooltip(tooltip, event, d))
        .on('mouseout', () => hideTooltip(tooltip))
        .on('click', (event, d) => handleNodeClick(event, d))
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

      // Add User nodes
      const userGroups = nodesGroup.selectAll('.user-group')
        .data(data.nodes.filter(d => d.label === 'User'))
        .enter()
        .append('g')
        .attr('class', 'user-group');

      // Add invisible hit area
      userGroups.append('circle')
        .attr('class', 'hit-area')
        .attr('r', d => getNodeRadius(d) * 0.3)
        .attr('fill', 'rgba(0,0,0,0)')
        .attr('stroke', 'none');

      // Add visible node
      userGroups.append('path')
        .attr('class', d => `user-node ${selectedNodes.includes(d.id) ? 'selected-node' : ''}`)
        .attr('d', ICONS.USER)
        .attr('fill', d => d.npsScore ? d.npsColor : COLORS.NODE_USER_DEFAULT)
        .attr('transform', 'translate(-12, -12)');

      // Add event handlers to the group
      userGroups
        .on('mouseover', (event, d) => showTooltip(tooltip, event, d))
        .on('mouseout', () => hideTooltip(tooltip))
        .on('click', (event, d) => handleNodeClick(event, d))
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

      // Add Service nodes
      const serviceGroups = nodesGroup.selectAll('.service-group')
        .data(data.nodes.filter(d => d.label === 'Service'))
        .enter()
        .append('g')
        .attr('class', 'service-group');

      // Add invisible rectangular hit area
      serviceGroups.append('rect')
        .attr('class', 'hit-area')
        .attr('width', d => getNodeRadius(d) * 0.5)
        .attr('height', d => getNodeRadius(d) * 0.5)
        .attr('x', d => -getNodeRadius(d) * 0.25)  // Center the rectangle
        .attr('y', d => -getNodeRadius(d) * 0.25)
        .attr('fill', 'rgba(1,1,1,0)')
        .attr('stroke', 'none');

      // Add visible node
      serviceGroups.append('path')
        .attr('class', d => `service-node ${selectedNodes.includes(d.id) ? 'selected-node' : ''}`)
        .attr('d', ICONS.SERVICE)
        //SELECT COLOUR BASED ON STATUS FROM COLORS 
        .attr('fill', (d) => getServiceColor(d.status))
        .attr('transform', 'translate(-12, -12)');

      // Add planning icon for in-development services
      serviceGroups.filter(d => d.status === 'in_development')
        .append('path')
        .attr('class', 'planning-icon')
        .attr('d', ICONS.PLANNING)
        .attr('fill', 'none')
        .attr('stroke', COLORS.STATUS_IN_DEVELOPMENT_ICON)  // Dark orange
        .attr('stroke-width', '2')
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('transform', 'translate(-20.1, 3) scale(0.4)'); // Position in top-right corner

      // Add event handlers to the group
      serviceGroups
        .on('mouseover', (event, d) => showTooltip(tooltip, event, d))
        .on('mouseout', () => hideTooltip(tooltip))
        .on('click', (event, d) => handleNodeClick(event, d))
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

      // Highlight selected nodes
      if (selectedNodes.length > 0) {
        GoalGroups.select('.circle-node').classed('selected-node', d => selectedNodes.includes(d.id));
        userGroups.select('path').classed('selected-node', d => selectedNodes.includes(d.id));
        serviceGroups.select('path').classed('selected-node', d => selectedNodes.includes(d.id));
      }

      // Add node labels
      const label = container.append('g')
        .attr('class', 'node-labels')
        .selectAll('text')
        .data(data.nodes)
        .enter().append('text')
        .attr('class', 'node-label')
        .text(d => {
          // Truncate long Goal node names
          if (d.label === 'Goal' && d.name.length > 20) {
            return d.name.substring(0, 20) + '...';
          }
          return d.name;
        });

      const link = container.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(data.links)
        .enter().append('line')
        .attr('stroke', d => linkColors[d.type] || '#999')
        .attr('marker-end', d => `url(#arrowhead-${d.type})`);

      // Update positions on simulation tick
      const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links)
          .id(d => d.id)
          .distance(d => 4 * getNodeRadius(d.source) + getNodeRadius(d.target))
          .strength(0.9))  // Increased to 0.9 for stronger connections
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('x', d3.forceX(width / 2).strength(0.1))
        .force('y', d3.forceY(height / 2).strength(0.1))
        .on('tick', () => {
          // Update link positions with edge point calculations
          link.each(d => {
            const edgePoints = calculateLinkEdgePoints(d, data.nodes, getNodeRadius);
            Object.assign(d, edgePoints && {
              sourceEdgeX: edgePoints.source.x,
              sourceEdgeY: edgePoints.source.y,
              targetEdgeX: edgePoints.target.x,
              targetEdgeY: edgePoints.target.y
            });
          });

          link
            .attr('x1', d => d.sourceEdgeX || d.source.x)
            .attr('y1', d => d.sourceEdgeY || d.source.y)
            .attr('x2', d => d.targetEdgeX || d.target.x)
            .attr('y2', d => d.targetEdgeY || d.target.y);

          GoalGroups
            .attr('transform', d => `translate(${d.x},${d.y})`);

          userGroups
            .attr('transform', d => {
              const baseRadius = 20;
              const radius = getNodeRadius(d);
              const scale = radius / baseRadius;
              return `translate(${d.x},${d.y}) scale(${scale})`;
            });

          serviceGroups
            .attr('transform', d => {
              const baseRadius = 20;
              const radius = getNodeRadius(d);
              const scale = radius / baseRadius;
              return `translate(${d.x},${d.y}) scale(${scale})`;
            });

          label
            .attr('x', d => d.x)
            .attr('y', d => {
              if (d.label === 'User') {
                const baseRadius = 20;
                const radius = getNodeRadius(d);
                const scale = Math.sqrt(radius / baseRadius);
                return d.y + 7 + (20 * scale);
              }
              if (d.label === 'Service') {
                const nodeRadius = getNodeRadius(d) * 0.8;
                return d.y + 12 + nodeRadius;
              }
              if (d.label === 'Goal') {
                const nodeRadius = getNodeRadius(d);
                return d.y + nodeRadius + 18;
              }
              return d.y + 25;
            });
        });

      // Click on background to deselect nodes
      svg.on('click', (event) => {
        // No-op - keeping the event handler to prevent bubbling
        event.stopPropagation();
      });

      // Drag functions
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
        simulation.alphaTarget(0.3).restart();
      }
      
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return () => {
        simulation.stop();
      };
    }, 200); // Wait for transition to complete
  }, [data, selectedNodes, onNodeSelect]);

  return (
    <GraphContainer ref={svgRef}>
      {/* SVG and tooltip will be added dynamically */}
    </GraphContainer>
  );
}

export default Graph;
