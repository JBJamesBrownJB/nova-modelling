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
  }
  
  .nodes path {
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

function Graph({ data, onNodeSelect, selectedNode }) {
  const svgRef = useRef(null);

  // Define node colors based on node type
  const nodeColors = {
    'JTBD': '#57C7E3', // Blue
    'User': '#ECB5C9', // Pink
    'Service': '#8DCC93'  // Green
  };

  // Define link colors based on relationship type
  const linkColors = {
    'DOES': '#ECB5C9',   // Pink
    'DEPENDS_ON': '#F16667'  // Red
  };

  // Define SVG paths for icons
  const userIconPath = "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z";
  const serviceIconPath = "M4,1H20A1,1 0 0,1 21,2V6A1,1 0 0,1 20,7H4A1,1 0 0,1 3,6V2A1,1 0 0,1 4,1M4,9H20A1,1 0 0,1 21,10V14A1,1 0 0,1 20,15H4A1,1 0 0,1 3,14V10A1,1 0 0,1 4,9M4,17H20A1,1 0 0,1 21,18V22A1,1 0 0,1 20,23H4A1,1 0 0,1 3,22V18A1,1 0 0,1 4,17Z";

  // Define arrow markers for different relationship types
  const setupArrowMarkers = (svg) => {
    const defs = svg.append('defs');

    Object.entries(linkColors).forEach(([type, color]) => {
      defs.append('marker')
        .attr('id', `arrowhead-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 2)
        .attr('markerHeight', 2)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .attr('fill', color)
        .style('stroke', 'none');
    });
  };

  //affects line issue TODO
  // Helper function to calculate the radius of each node type
  const getNodeRadius = (d) => {
    switch (d.label) {
      case 'JTBD':
        // Simple linear scaling based on dependency count
        // Min size of 10, grows by 2 pixels per dependency point
        return 10 + (d.complexity ? Math.min(d.complexity / 1.4, 100) : 0);
      case 'Service':
        // Size based on number of dependent JTBDs
        // Min size of 12, grows by 3 pixels per dependent
        return 20 + (d.dependants ? Math.min(d.dependants * 3, 100) : 0);
      case 'User':
        // Scale user icon based on number of JTBDs they perform - using more dramatic scaling
        return 20 + (d.jtbd_count ? Math.min(d.jtbd_count * 3, 100) : 0); // Much more significant growth per JTBD
      default:
        return 8;
    }
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

    // Create tooltip
    const tooltip = d3.select(svgRef.current)
      .append('div')
      .attr('class', 'tooltip');

    // Function to show tooltip
    const showTooltip = (event, d) => {
      tooltip.transition()
        .delay(500)
        .duration(500)
        .style('opacity', 0.9);

      let tooltipContent = `<strong>${d.name}</strong><br/>`;

      if (d.label === 'JTBD') {
        tooltipContent += `<strong>Type:</strong> ${d.label}<br/>`;
        tooltipContent += `${d.complexity ? `<strong>Complexity:</strong> ${d.complexity.toFixed(1)}<br/>` : ''}`;
        tooltipContent += `${d.dependency_count !== undefined ? `<strong>Service Dependencies:</strong> ${d.dependency_count}<br/>` : ''}`;
      } else if (d.label === 'Service') {
        tooltipContent += `<strong>Type:</strong> ${d.label}<br/>`;
        tooltipContent += `${d.dependants !== undefined ? `<strong>JTBD Dependants:</strong> ${d.dependants}<br/>` : ''}`;
      } else if (d.label === 'User') {
        tooltipContent += `<strong>Type:</strong> ${d.label}<br/>`;
        tooltipContent += `${d.jtbd_count !== undefined ? `<strong>JTBD Count:</strong> ${d.jtbd_count}<br/>` : ''}`;
      } else {
        tooltipContent += `<strong>Type:</strong> ${d.label}<br/>`;
      }

      tooltip.html(tooltipContent)
        .style('left', (event.pageX - 270) + 'px')
        .style('top', (event.pageY - 30) + 'px');
    };

    // Function to hide tooltip
    const hideTooltip = () => {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    };

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

    // Create nodes group
    const nodesGroup = g.append('g')
      .attr('class', 'nodes');

    // Add circle nodes for JTBD
    const circleNodes = nodesGroup.selectAll('.circle-node')
      .data(data.nodes.filter(d => d.label === 'JTBD'))
      .enter()
      .append('circle')
      .attr('class', 'circle-node')
      .attr('r', d => getNodeRadius(d))
      .attr('fill', d => nodeColors[d.label] || '#666')
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeSelect(d);
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('mouseover', showTooltip)
      .on('mouseout', hideTooltip);

    // Add user icon nodes
    const userNodes = nodesGroup.selectAll('.user-node')
      .data(data.nodes.filter(d => d.label === 'User'))
      .enter()
      .append('g')
      .attr('class', 'user-node')
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeSelect(d);
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('mouseover', showTooltip)
      .on('mouseout', hideTooltip);

    // Add path for user icon with fixed positioning for consistent centering
    userNodes.append('path')
      .attr('d', userIconPath)
      .attr('fill', nodeColors['User'])
      .attr('transform', 'translate(-12, -12)');

    // Add service icon nodes
    const serviceNodes = nodesGroup.selectAll('.service-node')
      .data(data.nodes.filter(d => d.label === 'Service'))
      .enter()
      .append('g')
      .attr('class', 'service-node')
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeSelect(d);
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('mouseover', showTooltip)
      .on('mouseout', hideTooltip);

    // Add path for service icon with fixed positioning for consistent centering
    serviceNodes.append('path')
      .attr('d', serviceIconPath)
      .attr('fill', nodeColors['Service'])
      .attr('transform', 'translate(-12, -12)');

    // Highlight selected node if any
    if (selectedNode) {
      circleNodes.classed('selected-node', d => d.id === selectedNode.id);
      userNodes.select('path').classed('selected-node', d => d.id === selectedNode.id);
      serviceNodes.select('path').classed('selected-node', d => d.id === selectedNode.id);
    }

    // Add node labels
    const label = g.append('g')
      .attr('class', 'node-labels')
      .selectAll('text')
      .data(data.nodes)
      .enter().append('text')
      .attr('class', 'node-label')
      .text(d => {
        // Truncate long JTBD node names
        if (d.label === 'JTBD' && d.name.length > 20) {
          return d.name.substring(0, 20) + '...';
        }
        return d.name;
      });

    // Add links after nodes to ensure proper layering
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke', d => linkColors[d.type] || '#999')
      .attr('marker-end', d => `url(#arrowhead-${d.type})`);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      // Calculate line endpoints to stop at node boundaries
      link.each(function (d) {
        // Get the source and target nodes
        const sourceNode = data.nodes.find(n => n.id === (typeof d.source === 'object' ? d.source.id : d.source));
        const targetNode = data.nodes.find(n => n.id === (typeof d.target === 'object' ? d.target.id : d.target));

        if (!sourceNode || !targetNode) return;

        // Get positions
        const sourceX = sourceNode.x;
        const sourceY = sourceNode.y;
        const targetX = targetNode.x;
        const targetY = targetNode.y;

        // Calculate total distance between nodes
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return;

        // Get radius for target and source
        let targetRadius = getNodeRadius(targetNode);
        let sourceRadius = getNodeRadius(sourceNode);

        // Calculate the point on the edge of the target node
        const targetRatio = (distance - 3 - targetRadius) / distance;
        const sourceRatio = sourceRadius / distance;

        // Set the endpoint to be at the edge of the target node
        d.targetEdgeX = sourceX + dx * targetRatio;
        d.targetEdgeY = sourceY + dy * targetRatio;

        // Set the start point to be at the edge of the source node
        d.sourceEdgeX = sourceX + dx * sourceRatio;
        d.sourceEdgeY = sourceY + dy * sourceRatio;
      });

      // Update the link positions
      link
        .attr('x1', d => d.sourceEdgeX || d.source.x)
        .attr('y1', d => d.sourceEdgeY || d.source.y)
        .attr('x2', d => d.targetEdgeX || d.target.x)
        .attr('y2', d => d.targetEdgeY || d.target.y);

      circleNodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      // Apply scale transform to user nodes based on their size
      userNodes
        .attr('transform', d => {
          const baseRadius = 20;
          const radius = getNodeRadius(d);
          const scale = radius / baseRadius;
          // Transform with position and scale from center
          return `translate(${d.x},${d.y}) scale(${scale})`;
        });

      // Apply scale transform to service nodes based on their size
      serviceNodes
        .attr('transform', d => {
          const baseRadius = 20;
          const radius = getNodeRadius(d);
          const scale = radius / baseRadius;
          // Transform with position and scale from center
          return `translate(${d.x},${d.y}) scale(${scale})`;
        });

      label
        .attr('x', d => d.x)
        .attr('y', d => {
          // Adjust label position based on node type
          if (d.label === 'User') {
            // Position based on User icon size with constrained scaling
            const baseRadius = 20;
            const radius = getNodeRadius(d);
            // Use square root scaling to dampen the effect for larger nodes
            const scale = Math.sqrt(radius / baseRadius);
            // Fixed base offset plus moderate scaling
            return d.y + 7 + (20 * scale);
          }
          if (d.label === 'Service') {
            // Dynamic positioning based on node size
            const nodeRadius = getNodeRadius(d) * 0.8; // Slightly reduce the offset
            return d.y + 12 + nodeRadius; // Position label below node
          }
          if (d.label === 'JTBD') {
            // Dynamic positioning based on node size
            const nodeRadius = getNodeRadius(d);
            return d.y + nodeRadius + 18; // Position label below node
          }
          return d.y + 25; // Default position
        });
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
    <GraphContainer ref={svgRef}>
      {/* SVG and tooltip will be added dynamically */}
    </GraphContainer>
  );
}

export default Graph;
