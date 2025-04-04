import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { showTooltip, hideTooltip } from '../shared/utils/tooltipUtils';
import { calculateLinkEdgePoints } from './GraphUtils';
import { getNodeRadius } from '../../../services/visualization/VisualizationUtils';
import { COLORS, getNpsColor, LINK_CONSTANTS } from '../../../styles/colors';
import { SIMULATION_CONFIG, goalNodeConfig, userNodeConfig, serviceNodeConfig } from './SimulationConfig';
import { NODE_CONSTANTS } from '../shared/constants/nodeConstants';
import { tooltipStyles } from '../../../styles/tooltips';

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

  .unselected {
    opacity: 0.3;
  }

  .nodes .selected {
    filter: drop-shadow(0 0 4px ${COLORS.GREY_600});
  }

  .fading {
    opacity: 0;
  }

  ${tooltipStyles}
  
  .secondary-node {
    opacity: 0.3;
  }
  
  .secondary-link {
    opacity: 0.2;
    stroke-dasharray: 3, 3;
  }
`;

function Graph({ data, selectedNodes, onNodeSelect }) {
  const svgRef = useRef(null);
  const containerRef = useRef({ width: 0, height: 0 });

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

    // Create markers for each link with its specific color
    data.links.forEach((link, i) => {
      const color = link.nps ? getNpsColor(link.nps) : LINK_CONSTANTS[link.type];
      defs.append('marker')
        .attr('id', `arrowhead-${link.source.id}-${link.target.id}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
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
    dragThreshold: 3, // pixels of movement needed to consider it a drag
    dragStartPosition: { x: 0, y: 0 },
    simulation: null
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
    // Track that we're starting a potential drag
    dragState.dragStartTime = Date.now();
    dragState.isDragging = false;
    dragState.dragStartPosition = { x: event.x, y: event.y };
    dragState.simulation = simulation;

    // Start with node fixed at its current position
    d.fx = d.x;
    d.fy = d.y;

    // Stop simulation immediately
    if (simulation) {
      simulation.stop();
    }
  };

  const dragged = (event, d) => {
    // Calculate distance moved
    const dx = event.x - dragState.dragStartPosition.x;
    const dy = event.y - dragState.dragStartPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If we've moved past the threshold, it's definitely a drag
    if (!dragState.isDragging && distance > dragState.dragThreshold) {
      dragState.isDragging = true;
    }

    // Update position
    d.fx = event.x;
    d.fy = event.y;

    // Only restart simulation if we're definitely dragging
    if (dragState.isDragging && dragState.simulation) {
      dragState.simulation.alpha(0.3).restart(); // Use a moderate alpha for smooth movement
    }
  };

  const dragended = (event, d, simulation) => {
    // If we never actually dragged, treat it as a click
    if (!dragState.isDragging && event.sourceEvent) {
      handleNodeClick(event.sourceEvent, d, simulation);
      return;
    }

    // Reset drag state
    dragState.isDragging = false;

    // Keep selected nodes fixed
    if (selectedNodes.includes(d.id)) {
      // Keep position fixed
    } else {
      // Allow other nodes to move freely
      d.fx = null;
      d.fy = null;
    }

    // Cool down the simulation gently
    if (simulation) {
      simulation.alpha(0.1).alphaTarget(0);
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
        .attr('x', d => -getNodeRadius(d) * (hitAreaMultiplier / 2))
        .attr('y', d => -getNodeRadius(d) * (hitAreaMultiplier / 2))
        .attr('fill', 'rgba(0,0,0,0)')
        .attr('stroke', 'none');
    }

    // Add visible node
    if (nodeShape === 'circle') {
      groups.append('circle')
        .attr('class', d => `circle-node ${selectedNodes.length > 0 ? (selectedNodes.includes(d.id) ? 'selected' : 'unselected') : ''}`)
        .attr('r', d => getNodeRadius(d))
        .attr('fill', getNodeFill);
    } else if (nodeShape === 'path') {
      groups.append('path')
        .attr('class', d => `${nodeType.toLowerCase()}-node ${selectedNodes.length > 0 ? (selectedNodes.includes(d.id) ? 'selected' : 'unselected') : ''}`)
        .attr('d', icon)
        .attr('fill', getNodeFill)
        .attr('transform', 'translate(-12, -12)');
    }

    // Add special icons if needed
    if (extraIconCondition && nodeConfig.extraIcon) {
      groups.filter(extraIconCondition)
        .append('path')
        .attr('class', nodeConfig.extraIconClass)
        .attr('class', d => `${nodeConfig.extraIconClass} ${selectedNodes.length > 0 ? (selectedNodes.includes(d.id) ? 'selected' : 'unselected') : ''}`)
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
  const updateSimulationOnSelection = (simulation, currentSelectedNodes, previousSelectedNodes, width, height) => {
    if (!simulation) return;

    if (JSON.stringify(currentSelectedNodes) !== JSON.stringify(previousSelectedNodes)) {
      // Stop the current simulation
      simulation.stop();

      // Fix positions of newly selected nodes and free previously selected ones
      simulation.nodes().forEach(node => {
        if (currentSelectedNodes.includes(node.id)) {
          node.fx = node.x;
          node.fy = node.y;
        } else {
          // Free ALL non-selected nodes
          node.fx = null;
          node.fy = null;
        }
      });

      // If no nodes are selected, reset forces to create spherical layout
      if (currentSelectedNodes.length === 0) {
        simulation
          .force('charge', d3.forceManyBody().strength(SIMULATION_CONFIG.forces.charge.strength))
          .force('collision', d3.forceCollide().radius(d => getNodeRadius(d) * SIMULATION_CONFIG.forces.collision.radiusMultiplier).strength(SIMULATION_CONFIG.forces.collision.strength))
          .force('x', d3.forceX(width / 2).strength(SIMULATION_CONFIG.forces.positioning.strength))
          .force('y', d3.forceY(height / 2).strength(SIMULATION_CONFIG.forces.positioning.strength));

        simulation
          .alpha(1)
          .alphaTarget(SIMULATION_CONFIG.simulation.alphaTarget)
          .velocityDecay(SIMULATION_CONFIG.simulation.velocityDecay)
          .restart();
        return;
      }

      // Store original parameters
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
          1);
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
    }

    // Use a lower alpha decay to reduce jiggling
    simulation.alphaDecay(SIMULATION_CONFIG.simulation.alphaDecay);
    simulation.alphaTarget(SIMULATION_CONFIG.simulation.alphaTarget);
    simulation.velocityDecay(SIMULATION_CONFIG.simulation.velocityDecay);

    return simulation;
  };

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

    // Store current zoom transform before redrawing
    let currentZoom;
    try {
      const svgNode = d3.select(svgRef.current).select('svg').node();
      if (svgNode) {
        currentZoom = d3.zoomTransform(svgNode);
      }
    } catch (e) {
      console.log('No existing zoom transform found');
    }

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

      // Restore previous zoom transformation if it exists
      if (currentZoom) {
        svg.call(zoom.transform, currentZoom);
      }

      setupArrowMarkers(container);

      const tooltip = d3.select(svgRef.current)
        .append('div')
        .attr('class', 'tooltip');

      const nodesGroup = container.append('g')
        .attr('class', 'nodes');

      // Setup the simulation with focus+context behavior
      const simulation = setupSimulation(data.nodes, data.links, width, height);

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
        .attr('class', d => `node-label ${selectedNodes.length > 0 ? (selectedNodes.includes(d.id) ? 'selected' : 'unselected') : ''}`)
        .text(d => {
          // Truncate long Goal node names
          if (d.label === 'Goal' && d.name.length > NODE_CONSTANTS.LABEL_TRUNCATE_LENGTH) {
            return d.name.substring(0, NODE_CONSTANTS.LABEL_TRUNCATE_LENGTH) + '...';
          }
          return d.name;
        });

      // Add links
      const link = container.append('g')
        .selectAll('line')
        .data(data.links)
        .enter().append('line')
        .attr('class', d => `link ${selectedNodes.length > 0 ? (selectedNodes.includes(d.source.id) && selectedNodes.includes(d.target.id) ? 'selected' : 'unselected') : ''}`)
        .attr('stroke', d => d.nps ? getNpsColor(d.nps) : '#999')
        .attr('stroke-opacity', d => selectedNodes.length > 0 ?
          (selectedNodes.includes(d.source.id) || selectedNodes.includes(d.target.id) ? 1 : 0.3)
          : 1)
        .attr('marker-end', d => `url(#arrowhead-${d.source.id}-${d.target.id})`);

      // Add NPS score labels for DOES relationships
      // First add a background pill/capsule for each label
      const linkLabelBackgrounds = container.append('g')
        .attr('class', 'link-label-backgrounds')
        .selectAll('rect')
        .data(data.links.filter(d => d.type === 'DOES' && d.nps !== undefined && d.nps !== null))
        .enter().append('rect')
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('height', 15)
        .attr('fill', COLORS.BACKGROUND)
        .attr('class', d => `link-label-bg ${selectedNodes.length > 0 ? (selectedNodes.includes(d.source.id) && selectedNodes.includes(d.target.id) ? 'selected' : 'unselected') : ''}`);
      
      // Then add the text labels
      const linkLabels = container.append('g')
        .attr('class', 'link-labels')
        .selectAll('text')
        .data(data.links.filter(d => d.type === 'DOES' && d.nps !== undefined && d.nps !== null))
        .enter().append('text')
        .attr('class', d => `link-label ${selectedNodes.length > 0 ? (selectedNodes.includes(d.source.id) && selectedNodes.includes(d.target.id) ? 'selected' : 'unselected') : ''}`)
        .text(d => `nps ${d.nps}`)
        .attr('font-size', '10px')
        .attr('fill', d => getNpsColor(d.nps))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('pointer-events', 'none');

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

        // Update position of link labels
        // First create a temporary hidden element to measure text width
        const tempText = container.append('text')
          .attr('font-size', '10px')
          .style('visibility', 'hidden');
        
        linkLabels.each(function(d, i) {
          if (!d.sourceEdgeX || !d.targetEdgeX) return;
          
          // Calculate midpoint of the line
          const midX = (d.sourceEdgeX + d.targetEdgeX) / 2;
          const midY = (d.sourceEdgeY + d.targetEdgeY) / 2;
          
          // Calculate angle of the line
          const dx = d.targetEdgeX - d.sourceEdgeX;
          const dy = d.targetEdgeY - d.sourceEdgeY;
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          
          // Measure text to properly size the background
          const labelText = d3.select(this).text();
          tempText.text(labelText);
          const textWidth = tempText.node().getComputedTextLength() + 9; // Add padding
          
          // Get the background element
          const bgElement = d3.select(linkLabelBackgrounds.nodes()[i]);
          
          // Update background size and position
          bgElement
            .attr('width', textWidth)
            .attr('x', midX - textWidth/2)
            .attr('y', midY - 8)
            .attr('transform', `rotate(${angle}, ${midX}, ${midY})`);
          
          // Apply rotation and position to the text
          d3.select(this)
            .attr('x', midX)
            .attr('y', midY)
            .attr('transform', `rotate(${angle}, ${midX}, ${midY})`);
        });
        
        // Remove the temporary text element
        tempText.remove();
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
      updateSimulationOnSelection(simulation, selectedNodes, prevSelectedNodesRef.current, width, height);
      prevSelectedNodesRef.current = selectedNodes;

      // Update link opacity when selection changes
      if (selectedNodes.length > 0) {
        link.attr('stroke-opacity', d =>
          selectedNodes.includes(d.source.id) || selectedNodes.includes(d.target.id) ? 1 : 0.3
        );
      } else {
        link.attr('stroke-opacity', 1);
      }
    }, 300); // Wait 300ms for transition to complete

  }, [data, selectedNodes, onNodeSelect]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onNodeSelect([]);  // This will trigger updateSimulationOnSelection with empty selection
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

  return (
    <GraphContainer ref={svgRef}>
      {/* SVG and tooltip will be added dynamically */}
    </GraphContainer>
  );
}

export default Graph;