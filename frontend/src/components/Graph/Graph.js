import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;

  .links line {
    stroke-opacity: 0.6;
    stroke-width: 1.5px;
  }

  .nodes circle {
    cursor: pointer;
    stroke: #fff;
    stroke-width: 1.5px;
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
    stroke-width: 3px;
  }
`;

function Graph({ data, onNodeSelect, selectedNode }) {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  
  // Define node colors based on node type
  const nodeColors = {
    'JTBD': '#57C7E3', // Blue
    'User': '#ECB5C9', // Pink
    'Data': '#8DCC93'  // Green
  };
  
  // Define link colors based on relationship type
  const linkColors = {
    'DOES': '#ECB5C9',   // Pink
    'READS': '#F16667',  // Red
    'WRITES': '#569480', // Dark green
    'UPDATES': '#F79767' // Orange
  };

  // Define arrow markers for different relationship types
  const setupArrowMarkers = (svg) => {
    const defs = svg.append('defs');
    
    Object.entries(linkColors).forEach(([type, color]) => {
      defs.append('marker')
        .attr('id', `arrowhead-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .attr('fill', color)
        .style('stroke', 'none');
    });
  };

  useEffect(() => {
    if (!data || !data.nodes || !data.links) return;
    
    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll('*').remove();
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Create SVG element
    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    setupArrowMarkers(svg);
      
    // Add zoom behavior
    const g = svg.append('g');
    
    svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      }));
    
    // Create the force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links)
        .id(d => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1));
    
    // Add links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke', d => linkColors[d.type] || '#999')
      .attr('marker-end', d => `url(#arrowhead-${d.type})`);
    
    // Add nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', d => {
        // Scale node radius based on properties
        if (d.label === 'JTBD') {
          // Normalize complexity between 7-15
          return 7 + (d.complexity ? Math.min(d.complexity / 10, 8) : 0);
        } else if (d.label === 'Data') {
          // Scale data nodes by readers if available
          return 6 + (d.readers ? Math.min(d.readers, 6) : 0);
        }
        return 8; // Default size for other nodes
      })
      .attr('fill', d => nodeColors[d.label] || '#666')
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeSelect(d);
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // Highlight selected node if any
    if (selectedNode) {
      node.classed('selected-node', d => d.id === selectedNode.id);
    }
    
    // Add node labels
    const label = g.append('g')
      .attr('class', 'node-labels')
      .selectAll('text')
      .data(data.nodes)
      .enter().append('text')
      .attr('class', 'node-label')
      .text(d => d.name);
    
    // Add tooltip
    const tooltip = d3.select(tooltipRef.current);
    
    node.on('mouseover', (event, d) => {
      tooltip
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`)
        .style('display', 'inline-block')
        .html(`<strong>${d.label}:</strong> ${d.name}<br/>
               ${d.complexity ? `<strong>Complexity:</strong> ${d.complexity}<br/>` : ''}
               ${d.progress ? `<strong>Progress:</strong> ${d.progress}%<br/>` : ''}
               ${d.readers ? `<strong>Readers:</strong> ${d.readers}<br/>` : ''}`);
    })
    .on('mouseout', () => {
      tooltip.style('display', 'none');
    });
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      
      label
        .attr('x', d => d.x)
        .attr('y', d => d.y + 20);
    });
    
    // Click on background to deselect nodes
    svg.on('click', () => {
      onNodeSelect(null);
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
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      // Keep node fixed where user dragged it
      // d.fx = null;
      // d.fy = null;
    }
    
    return () => {
      simulation.stop();
    };
  }, [data, onNodeSelect, selectedNode]);

  return (
    <GraphContainer>
      <div
        ref={svgRef}
        style={{ width: '100%', height: '100%' }}
      />
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          display: 'none',
          backgroundColor: 'white',
          borderRadius: '4px',
          padding: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
          fontSize: '12px',
          zIndex: 1000
        }}
      />
    </GraphContainer>
  );
}

export default Graph;
