import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { showTooltip, hideTooltip } from './TooltipUtils';
import { calculateLinkEdgePoints, getNodeRadius } from './GraphUtils';
import { COLORS } from '../../styles/colors';
import { ICONS } from '../../styles/icons';

// ============================================================================
// SIMULATION CONFIGURATION
// ============================================================================
// Adjust these values to control the physics and behavior of the graph
const SIMULATION_CONFIG = {
  // Base force parameters
  forces: {
    // Link forces - control how nodes are connected by links
    link: {
      strength: 0.9,                // Base link strength (0-1), higher = more rigid connections
      selectedMultiplier: 1.5,      // Multiplier for links connected to selected nodes
      distance: {
        selected: 3.8                 // Link distance multiplier for selected connections
      }
    },
    
    // Charge forces - control node repulsion/attraction
    charge: {
      strength: -400,              // Base repulsion strength, negative = repel
      selectedMultiplier: 2.5,      // Multiplier for selected nodes
      connectedMultiplier: 1.2,     // Multiplier for nodes connected to selected
      contextMultiplier: 0.5        // Multiplier for background nodes
    },
    
    // Collision detection - prevents nodes from overlapping
    collision: {
      radiusMultiplier: 1.2,       // How much extra space around nodes
      strength: 0.8                // How strongly to enforce collision (0-1)
    },
    
    // Positioning forces - keep graph centered or control expansion
    positioning: {
      strength: 0.07,              // Base positioning force strength
      minStrength: 0.005           // Minimal strength for selected mode
    }
  },
  
  // Simulation behavior
  simulation: {
    alphaDecay: 0.03,             // How quickly simulation cools down (higher = faster stabilization)
    alphaTarget: 0,                // Target cooling value (0 = complete stop)
    restartStrength: 0.1,          // Alpha value when restarting simulation
    nodeFixedDamping: 0.0,         // How strongly fixed nodes resist movement
    velocityDecay: 0.4,           // How quickly node velocity decays (lower = faster movement)
    initialStabilizationSpeed: 0.012, // Initial alpha for faster initial layout (0-1)
    fastCooling: {                // Fast cooling parameters for quick stabilization
      velocityDecay: 0.2,         // Lower value = faster movement during fast cooling
      alphaDecay: 0.06,           // Higher value = faster cooling
      iterations: 100             // Number of rapid iterations to run
    }
  },
  
  // Timing configuration
  timing: {
    restartDelay: 500,            // Delay before simulation restarts after selection (ms)
    stabilizationDelay: 300,      // Delay before initial stabilization starts (ms)
    dragInitiationDelay: 100      // Delay before deciding if it's a drag operation (ms)
  }
};

// Legacy constants - maintained for compatibility
const NODE_CONSTANTS = {
  BASE_RADIUS: 20,
  GOAL_HIT_AREA_MULTIPLIER: 1.25,
  USER_HIT_AREA_MULTIPLIER: 0.3,
  SERVICE_HIT_AREA_MULTIPLIER: 0.5,
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
  
  .secondary-node {
    opacity: 0.3;
  }
  
  .secondary-link {
    opacity: 0.2;
    stroke-dasharray: 3, 3;
  }
`;

function FocusContextGraph({ data, selectedNodes, onNodeSelect }) {
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

  // Utility functions for node and link ID handling
  const getNodeId = node => typeof node === 'object' ? node.id : node;

  const getConnectedNodes = (links, selectedNodes) => {
    const connectedNodeIds = new Set(selectedNodes);
    
    links.forEach(link => {
      const sourceId = getNodeId(link.source);
      const targetId = getNodeId(link.target);
      
      if (selectedNodes.includes(sourceId)) connectedNodeIds.add(targetId);
      if (selectedNodes.includes(targetId)) connectedNodeIds.add(sourceId);
    });
    
    return connectedNodeIds;
  };

  const isNodeSelected = (nodeId, selectedNodes) => selectedNodes.includes(nodeId);
  const isLinkSelected = (link, selectedNodes) => {
    const sourceId = getNodeId(link.source);
    const targetId = getNodeId(link.target);
    return isNodeSelected(sourceId, selectedNodes) || isNodeSelected(targetId, selectedNodes);
  };

  // Setup arrow markers for links
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

  // Track drag state
  const dragState = {
    dragStartTime: 0,
    isDragging: false,
    initialDragDone: false
  };

  const handleNodeClick = (event, node, simulation) => {
    event.stopPropagation(); 
  
    // Stop any ongoing simulation activity immediately to prevent movement
    if (simulation) {
      simulation.stop();
      
      // Fix all nodes in their current positions
      simulation.nodes().forEach(n => {
        n.fx = n.x;
        n.fy = n.y;
      });
    }
    
    onNodeSelect(node.id, event.ctrlKey);
  };

  // Drag event handlers
  const dragstarted = (event, d, simulation) => {
    dragState.dragStartTime = Date.now();
    dragState.isDragging = false;
    dragState.initialDragDone = false;

    // Start with node fixed at its current position
    d.fx = d.x;
    d.fy = d.y;
    
    if (!event.active) {
      simulation.alphaTarget(0.3).restart();
    }
  };

  const dragged = (event, d) => {
    const timeSinceStart = Date.now() - dragState.dragStartTime;
    
    // Wait for delay before allowing drag
    if (!dragState.initialDragDone && timeSinceStart > SIMULATION_CONFIG.timing.dragInitiationDelay) {
      dragState.initialDragDone = true;
      dragState.isDragging = true;
    }

    // Only update position if we're past the initial delay
    if (dragState.initialDragDone) {
      d.fx = event.x;
      d.fy = event.y;
    }
  };

  const dragended = (event, d, simulation) => {
    // If we never started dragging, treat it as a click
    if (!dragState.isDragging) {
      handleNodeClick(event.sourceEvent, d, simulation);
      return;
    }
    
    // Reset drag state
    dragState.isDragging = false;
    dragState.initialDragDone = false;
    
    // Free the node and let it settle
    d.fx = null;
    d.fy = null;
    
    if (!event.active) {
      simulation.alphaTarget(0);
    }
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
      .on('click', (event, d) => handleNodeClick(event, d, simulation))
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

  // Track previous selection state for smoother transitions
  const prevSelectedNodesRef = useRef([]);

  // Update the simulation when nodes are selected to maintain stable positions
  const updateSimulationOnSelection = (simulation, currentSelectedNodes, previousSelectedNodes) => {
    // Don't do anything if the simulation isn't initialized yet
    if (!simulation) return;

    // Only apply when selection changes
    if (JSON.stringify(currentSelectedNodes) !== JSON.stringify(previousSelectedNodes)) {
      // Stop the current simulation
      simulation.stop();
      
      // Fix positions of newly selected nodes and free previously selected ones
      simulation.nodes().forEach(node => {
        if (currentSelectedNodes.includes(node.id)) {
          // Fix this node in place
          node.fx = node.x;
          node.fy = node.y;
        } else if (previousSelectedNodes && previousSelectedNodes.includes(node.id)) {
          // Free previously selected nodes
          node.fx = null;
          node.fy = null;
        }
      });
      
      // Store original simulation parameters
      const originalVelocityDecay = simulation.velocityDecay();
      const originalAlphaDecay = simulation.alphaDecay();
      
      // Apply fast cooling parameters
      simulation.velocityDecay(SIMULATION_CONFIG.simulation.fastCooling.velocityDecay)
               .alphaDecay(SIMULATION_CONFIG.simulation.fastCooling.alphaDecay);
      
      // Run rapid iterations to quickly reach a more stable state
      for (let i = 0; i < SIMULATION_CONFIG.simulation.fastCooling.iterations; i++) {
        simulation.tick();
      }
      
      // Restore original parameters and restart with lower alpha
      simulation.velocityDecay(originalVelocityDecay)
               .alphaDecay(originalAlphaDecay)
               .alpha(SIMULATION_CONFIG.simulation.restartStrength)
               .restart();
    }
  };

  // Setup the simulation with focus+context forces
  const setupSimulation = (nodes, links, width, height) => {
    // Find connected nodes if we have selection
    const connectedNodeIds = selectedNodes.length > 0 ? 
      getConnectedNodes(data.links, selectedNodes) : 
      new Set();
    
    // Create the simulation with appropriate forces based on selection state
    const simulation = d3.forceSimulation(nodes);
    
    // Always apply link forces - stronger for exploration mode to maintain cohesion
    simulation.force('link', d3.forceLink(links)
      .id(d => d.id)
      .distance(d => {
        // Base distance that's more consistent regardless of node types
        const baseDistance = 50;
        return baseDistance * (isLinkSelected(d, selectedNodes) ? 
          SIMULATION_CONFIG.forces.link.distance.selected : 
          SIMULATION_CONFIG.forces.link.distance.base);
      })
      .strength(d => {
        // Stronger links for connections to selected nodes
        return isLinkSelected(d, selectedNodes) ?
          SIMULATION_CONFIG.forces.link.strength * SIMULATION_CONFIG.forces.link.selectedMultiplier :
          SIMULATION_CONFIG.forces.link.strength;
      }));

    // Apply charge forces - repulsion between nodes
    simulation.force('charge', d3.forceManyBody()
      .strength(d => {
        if (isNodeSelected(d.id, selectedNodes)) {
          return SIMULATION_CONFIG.forces.charge.strength * SIMULATION_CONFIG.forces.charge.selectedMultiplier;
        }
        if (connectedNodeIds.has(d.id)) {
          return SIMULATION_CONFIG.forces.charge.strength * SIMULATION_CONFIG.forces.charge.connectedMultiplier;
        }
        return SIMULATION_CONFIG.forces.charge.strength * SIMULATION_CONFIG.forces.charge.contextMultiplier;
      }));
    
    // Apply collision detection to prevent overlap
    simulation.force('collision', d3.forceCollide()
      .radius(d => getNodeRadius(d) * SIMULATION_CONFIG.forces.collision.radiusMultiplier)
      .strength(SIMULATION_CONFIG.forces.collision.strength));
    
    // Fix positions of selected nodes to prevent them from moving
    if (selectedNodes.length > 0) {
      // Fix the positions of selected nodes
      nodes.forEach(node => {
        if (selectedNodes.includes(node.id)) {
          // Only fix if the node already has a position
          if (node.x && node.y) {
            node.fx = node.x;
            node.fy = node.y;
          }
        } else {
          // Allow other nodes to move freely
          node.fx = null;
          node.fy = null;
        }
      });
    }
    
    if (selectedNodes.length === 0) {
      // When no nodes are selected, use central gravity to keep everything visible
      simulation
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('x', d3.forceX(width / 2).strength(SIMULATION_CONFIG.forces.positioning.strength))
        .force('y', d3.forceY(height / 2).strength(SIMULATION_CONFIG.forces.positioning.strength));
    } else {
      // When nodes are selected, we want a very different behavior:
      // 1. No central attraction to screen center
      // 2. Selected nodes should stay fixed
      // 3. Connected nodes should expand outward but not too far
      
      // Remove any central forces - we don't want pull toward center
      simulation.force('center', null);
      
      // Very minimal positioning forces to prevent nodes from flying too far
      // but allowing them to expand into available space
      simulation.force('x', d3.forceX(width / 2).strength(SIMULATION_CONFIG.forces.positioning.minStrength));
      simulation.force('y', d3.forceY(height / 2).strength(SIMULATION_CONFIG.forces.positioning.minStrength));
      
      // We don't need a radial force anymore since we're using fixed positions
      // for selected nodes and stronger repulsion to push connected nodes outward
      simulation.force('radial', null);
    }
    
    // Use a lower alpha decay to reduce jiggling
    simulation.alphaDecay(SIMULATION_CONFIG.simulation.alphaDecay); 
    simulation.alphaTarget(SIMULATION_CONFIG.simulation.alphaTarget);
    simulation.velocityDecay(SIMULATION_CONFIG.simulation.velocityDecay);
    
    return simulation;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onNodeSelect([]);
      }
      
      // Preview neighboring nodes with 'S' key (second-hop preview)
      if (event.key === 's' || event.key === 'S') {
        // Find second-hop nodes if we have selection
        if (selectedNodes.length > 0) {
          const secondaryNodeIds = new Set();
          const secondaryLinkIds = new Set();
          
          // First get direct connections (first hop)
          const firstHopNodeIds = new Set();
          
          data.links.forEach(link => {
            const sourceId = getNodeId(link.source);
            const targetId = getNodeId(link.target);
            
            if (selectedNodes.includes(sourceId)) firstHopNodeIds.add(targetId);
            if (selectedNodes.includes(targetId)) firstHopNodeIds.add(sourceId);
          });
          
          // Then get second hop connections
          data.links.forEach(link => {
            const sourceId = getNodeId(link.source);
            const targetId = getNodeId(link.target);
            
            if (firstHopNodeIds.has(sourceId) && !selectedNodes.includes(targetId)) {
              secondaryNodeIds.add(targetId);
              secondaryLinkIds.add(`${sourceId}-${targetId}`);
            }
            if (firstHopNodeIds.has(targetId) && !selectedNodes.includes(sourceId)) {
              secondaryNodeIds.add(sourceId);
              secondaryLinkIds.add(`${sourceId}-${targetId}`);
            }
          });
          
          // Show the secondary nodes/links with reduced opacity
          d3.selectAll('.nodes > g')
            .filter(d => secondaryNodeIds.has(d.id))
            .classed('secondary-node', true)
            .attr('hidden', null);
            
          d3.selectAll('.links line')
            .filter(d => {
              const sourceId = getNodeId(d.source);
              const targetId = getNodeId(d.target);
              return secondaryLinkIds.has(`${sourceId}-${targetId}`) || secondaryLinkIds.has(`${targetId}-${sourceId}`);
            })
            .classed('secondary-link', true)
            .attr('hidden', null);
        }
      }
    };
    
    const handleKeyUp = (event) => {
      // Hide second-hop nodes when 'S' key is released
      if (event.key === 's' || event.key === 'S') {
        d3.selectAll('.secondary-node').attr('hidden', 'true');
        d3.selectAll('.secondary-link').attr('hidden', 'true');
      }
    };

    // Add keyboard listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onNodeSelect, selectedNodes, data]);

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

      // Setup the simulation with focus+context behavior
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
      const goalGroups = createNodeGroups(nodesGroup, goalNodeConfig, tooltip, simulation);
      const userGroups = createNodeGroups(nodesGroup, userNodeConfig, tooltip, simulation);
      const serviceGroups = createNodeGroups(nodesGroup, serviceNodeConfig, tooltip, simulation);

      // Find all nodes directly connected to selected nodes for styling
      const connectedNodeIds = new Set();
      if (selectedNodes.length > 0) {
        data.links.forEach(link => {
          const sourceId = getNodeId(link.source);
          const targetId = getNodeId(link.target);
          
          if (selectedNodes.includes(sourceId)) connectedNodeIds.add(targetId);
          if (selectedNodes.includes(targetId)) connectedNodeIds.add(sourceId);
        });
        
        // Highlight selected and connected nodes
        nodesGroup.selectAll('g')
          .classed('selected-node', d => selectedNodes.includes(d.id))
          .classed('primary-node', d => connectedNodeIds.has(d.id))
          .classed('context-node', d => !selectedNodes.includes(d.id) && !connectedNodeIds.has(d.id));
      }

      // Highlight selected nodes
      if (selectedNodes.length > 0) {
        goalGroups.select('.circle-node').classed('selected-node', d => selectedNodes.includes(d.id));
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
        goalGroups
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

      // Update simulation on selection changes
      updateSimulationOnSelection(simulation, selectedNodes, prevSelectedNodesRef.current);
      prevSelectedNodesRef.current = selectedNodes;
    }, 300); // Wait 300ms for transition to complete

  }, [data, selectedNodes, onNodeSelect]);

  return (
    <GraphContainer ref={svgRef}>
      {/* SVG and tooltip will be added dynamically */}
    </GraphContainer>
  );
}

export default FocusContextGraph;
