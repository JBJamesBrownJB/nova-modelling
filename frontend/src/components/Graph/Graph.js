import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { showTooltip, hideTooltip } from './TooltipUtils';
import { calculateLinkEdgePoints, getNodeRadius } from './GraphUtils';
import { COLORS } from '../../styles/colors';
import { ICONS } from '../../styles/icons';

// Node rendering constants
const NODE_CONSTANTS = {
  BASE_RADIUS: 20,
  GOAL_HIT_AREA_MULTIPLIER: 1.25,
  USER_HIT_AREA_MULTIPLIER: 0.3,
  SERVICE_HIT_AREA_MULTIPLIER: 0.5,
  LINK_STRENGTH: 0.9,
  CHARGE_STRENGTH: -400,
  POSITIONING_STRENGTH: 0.07,
  LABEL_TRUNCATE_LENGTH: 20
};

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

  // Drag event handlers
  const dragstarted = (event, d, simulation) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  const dragged = (event, d) => {
    d.fx = event.x;
    d.fy = event.y;
  };

  const dragended = (event, d, simulation) => {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };

  // Create a reusable function for node creation
  const createNodeGroups = (parent, nodeConfig, tooltip, simulation) => {
    const { nodeType, filter, hitAreaShape, hitAreaMultiplier, nodeShape, icon, getNodeFill, extraIconCondition } = nodeConfig;
    
    // Create groups
    const groups = parent.selectAll(`.${nodeType.toLowerCase()}-group`)
      .data(data.nodes.filter(filter))
      .enter()
      .append('g')
      .attr('class', `${nodeType.toLowerCase()}-group`);
      
    // Add hit area
    if (hitAreaShape === 'circle') {
      groups.append('circle')
        .attr('class', 'hit-area')
        .attr('r', d => getNodeRadius(d) * hitAreaMultiplier)
        .attr('fill', 'rgba(0,0,0,0)')
        .attr('stroke', 'none');
    } else if (hitAreaShape === 'rect') {
      groups.append('rect')
        .attr('class', 'hit-area')
        .attr('width', d => getNodeRadius(d) * hitAreaMultiplier)
        .attr('height', d => getNodeRadius(d) * hitAreaMultiplier)
        .attr('x', d => -getNodeRadius(d) * (hitAreaMultiplier/2))
        .attr('y', d => -getNodeRadius(d) * (hitAreaMultiplier/2))
        .attr('fill', 'rgba(0,0,0,0)')
        .attr('stroke', 'none');
    }
    
    // Add visible node
    if (nodeShape === 'circle') {
      groups.append('circle')
        .attr('class', d => `circle-node ${selectedNodes.includes(d.id) ? 'selected-node' : ''}`)
        .attr('r', d => getNodeRadius(d))
        .attr('fill', getNodeFill);
    } else if (nodeShape === 'path') {
      groups.append('path')
        .attr('class', d => `${nodeType.toLowerCase()}-node ${selectedNodes.includes(d.id) ? 'selected-node' : ''}`)
        .attr('d', icon)
        .attr('fill', getNodeFill)
        .attr('transform', 'translate(-12, -12)');
    }
    
    // Add special icons if needed
    if (extraIconCondition && nodeConfig.extraIcon) {
      groups.filter(extraIconCondition)
        .append('path')
        .attr('class', nodeConfig.extraIconClass)
        .attr('d', nodeConfig.extraIcon)
        .attr('fill', nodeConfig.extraIconFill || 'none')
        .attr('stroke', nodeConfig.extraIconStroke || 'none')
        .attr('stroke-width', nodeConfig.extraIconStrokeWidth || '0')
        .attr('stroke-linecap', nodeConfig.extraIconStrokeLinecap || 'butt')
        .attr('stroke-linejoin', nodeConfig.extraIconStrokeLinejoin || 'miter')
        .attr('transform', nodeConfig.extraIconTransform || '');
    }
    
    // Add event handlers
    groups
      .on('mouseover', (event, d) => showTooltip(tooltip, event, d))
      .on('mouseout', () => hideTooltip(tooltip))
      .on('click', (event, d) => handleNodeClick(event, d))
      .call(d3.drag()
        .on('start', (event, d) => dragstarted(event, d, simulation))
        .on('drag', dragged)
        .on('end', (event, d) => dragended(event, d, simulation)));
        
    return groups;
  };

  // Get label Y position based on node type
  const getLabelYPosition = (d) => {
    switch (d.label) {
      case 'User': {
        const baseRadius = NODE_CONSTANTS.BASE_RADIUS;
        const radius = getNodeRadius(d);
        const scale = Math.sqrt(radius / baseRadius);
        return d.y + 7 + (20 * scale);
      }
      case 'Service': {
        const nodeRadius = getNodeRadius(d) * 0.8;
        return d.y + 12 + nodeRadius;
      }
      case 'Goal': {
        const nodeRadius = getNodeRadius(d);
        return d.y + nodeRadius + 18;
      }
      default:
        return d.y + 25;
    }
  };

  // Setup the simulation with appropriate forces
  const setupSimulation = (nodes, links, width, height) => {
    return d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(d => 4 * getNodeRadius(d.source) + getNodeRadius(d.target))
        .strength(NODE_CONSTANTS.LINK_STRENGTH))
      .force('charge', d3.forceManyBody().strength(NODE_CONSTANTS.CHARGE_STRENGTH))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(NODE_CONSTANTS.POSITIONING_STRENGTH))
      .force('y', d3.forceY(height / 2).strength(NODE_CONSTANTS.POSITIONING_STRENGTH));
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

      // Setup the simulation
      const simulation = setupSimulation(data.nodes, data.links, width, height);

      // Configuration objects for different node types
      const goalNodeConfig = {
        nodeType: 'Goal',
        filter: d => d.label === 'Goal',
        hitAreaShape: 'circle',
        hitAreaMultiplier: NODE_CONSTANTS.GOAL_HIT_AREA_MULTIPLIER,
        nodeShape: 'circle',
        getNodeFill: d => d.npsColor
      };

      const userNodeConfig = {
        nodeType: 'User',
        filter: d => d.label === 'User',
        hitAreaShape: 'circle',
        hitAreaMultiplier: NODE_CONSTANTS.USER_HIT_AREA_MULTIPLIER,
        nodeShape: 'path',
        icon: ICONS.USER,
        getNodeFill: d => d.npsScore ? d.npsColor : COLORS.NODE_USER_DEFAULT
      };

      const serviceNodeConfig = {
        nodeType: 'Service',
        filter: d => d.label === 'Service',
        hitAreaShape: 'rect',
        hitAreaMultiplier: NODE_CONSTANTS.SERVICE_HIT_AREA_MULTIPLIER,
        nodeShape: 'path',
        icon: ICONS.SERVICE,
        getNodeFill: d => getServiceColor(d.status),
        extraIconCondition: d => d.status === 'in_development',
        extraIconClass: 'planning-icon',
        extraIcon: ICONS.PLANNING,
        extraIconFill: 'none',
        extraIconStroke: COLORS.STATUS_IN_DEVELOPMENT_ICON,
        extraIconStrokeWidth: '2',
        extraIconStrokeLinecap: 'round',
        extraIconStrokeLinejoin: 'round',
        extraIconTransform: 'translate(-20.1, 3) scale(0.4)'
      };

      // Create node groups using the centralized function
      const GoalGroups = createNodeGroups(nodesGroup, goalNodeConfig, tooltip, simulation);
      const userGroups = createNodeGroups(nodesGroup, userNodeConfig, tooltip, simulation);
      const serviceGroups = createNodeGroups(nodesGroup, serviceNodeConfig, tooltip, simulation);

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
          if (d.label === 'Goal' && d.name.length > NODE_CONSTANTS.LABEL_TRUNCATE_LENGTH) {
            return d.name.substring(0, NODE_CONSTANTS.LABEL_TRUNCATE_LENGTH) + '...';
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

      // Update link positions with edge point calculations
      const updateLinkPositions = () => {
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
      };

      // Update node positions with appropriate transforms
      const updateNodePositions = () => {
        GoalGroups
          .attr('transform', d => `translate(${d.x},${d.y})`);

        const getScaledTransform = (d) => {
          const baseRadius = NODE_CONSTANTS.BASE_RADIUS;
          const radius = getNodeRadius(d);
          const scale = radius / baseRadius;
          return `translate(${d.x},${d.y}) scale(${scale})`;
        };

        userGroups
          .attr('transform', getScaledTransform);

        serviceGroups
          .attr('transform', getScaledTransform);
      };

      // Update label positions based on node type
      const updateLabelPositions = () => {
        label
          .attr('x', d => d.x)
          .attr('y', getLabelYPosition);
      };

      // Update positions on simulation tick
      simulation.on('tick', () => {
        updateLinkPositions();
        updateNodePositions();
        updateLabelPositions();
      });

      // Click on background to deselect nodes
      svg.on('click', (event) => {
        // No-op - keeping the event handler to prevent bubbling
        event.stopPropagation();
      });
    }, 300); // Wait 300ms for transition to complete

  }, [data, selectedNodes, onNodeSelect]);

  return (
    <GraphContainer ref={svgRef}>
      {/* SVG and tooltip will be added dynamically */}
    </GraphContainer>
  );
}

export default Graph;
