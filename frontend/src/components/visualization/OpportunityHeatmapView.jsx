import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { COLORS } from '../../styles/colors';

const OpportunityContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${COLORS.BACKGROUND};
  padding: 20px;
  
  .matrix-cell {
    cursor: pointer;
    transition: opacity 0.2s;
    &:hover {
      opacity: 0.8;
    }
  }
  
  .axis-label {
    font-size: 12px;
    fill: ${COLORS.TEXT_SECONDARY};
  }

  .tooltip {
    position: absolute;
    padding: 8px;
    background: ${COLORS.BACKGROUND};
    border: 1px solid ${COLORS.BORDER};
    border-radius: 4px;
    pointer-events: none;
    font-size: 12px;
    color: ${COLORS.TEXT_PRIMARY};
  }
`;

const OpportunityHeatmapView = ({ data, selectedNodes, onNodeSelect }) => {
  const svgRef = useRef();
  
  useEffect(() => {
    console.log('Received data:', data); // Debug data
    
    if (!data || !data.nodes || !data.links) {
      console.log('Missing data structure:', { data });
      return;
    }

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();
    
    const users = data.nodes.filter(node => node.label === 'User');
    const goals = data.nodes.filter(node => node.label === 'Goal');
    
    console.log('Users:', users.length, 'Goals:', goals.length); // Debug logging
    
    if (!users.length || !goals.length) {
      console.log('No users or goals found in data:', data.nodes); // Debug logging
      return;
    }

    const margin = { top: 50, right: 50, bottom: 100, left: 120 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleBand()
      .domain(goals.map(d => d.name || d.id))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleBand()
      .domain(users.map(d => d.name || d.id))
      .range([0, height])
      .padding(0.1);

    // Create color scales for different metrics
    const opportunityColorScale = d3.scaleSequential()
      .domain([0, 1])
      .interpolator(d3.interpolateViridis);

    // Calculate matrix data
    const matrixData = users.flatMap(user => {
      return goals.map(goal => {
        const link = data.links.find(l => {
          const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
          const targetId = typeof l.target === 'object' ? l.target.id : l.target;
          return (sourceId === user.id && targetId === goal.id) ||
                 (sourceId === goal.id && targetId === user.id);
        });

        if (!link) return { user, goal, score: 0 };

        // Calculate opportunity score based on demand and NPS
        const demandValue = {
          'high': 1,
          'med': 0.66,
          'low': 0.33,
          'none': 0,
          'unknown': 0.5
        }[link.demand || 'unknown'];

        // NPS ranges from -100 to +100, normalize to 0-1 and invert
        // (lower satisfaction = higher opportunity)
        const npsScore = goal.nps != null ? 1 - ((goal.nps + 100) / 200) : 0.5;

        // Combined score (50% demand, 50% inverse NPS)
        const score = (demandValue * 0.5) + (npsScore * 0.5);

        return { user, goal, score, demand: link.demand, nps: goal.nps };
      });
    });

    // Draw cells
    svg.selectAll('rect')
      .data(matrixData)
      .enter()
      .append('rect')
      .attr('class', 'matrix-cell')
      .attr('x', d => xScale(d.goal.name || d.goal.id))
      .attr('y', d => yScale(d.user.name || d.user.id))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => opportunityColorScale(d.score))
      .on('mouseover', (event, d) => {
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');

        tooltip.html(`
          <strong>${d.user.name || d.user.id}</strong> → <strong>${d.goal.name || d.goal.id}</strong><br/>
          Demand: ${d.demand || 'Unknown'}<br/>
          NPS: ${d.nps ?? 'Unknown'}<br/>
          Opportunity Score: ${(d.score * 100).toFixed(1)}%
        `);
      })
      .on('mouseout', () => {
        d3.selectAll('.tooltip').remove();
      })
      .on('click', (event, d) => {
        onNodeSelect(d.goal.id);
      });

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('fill', COLORS.TEXT_PRIMARY)
      .text('User-Goal Opportunity Matrix');

    // Add legend
    const legendWidth = 200;
    const legendHeight = 20;
    
    const legendScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
      .tickFormat(d => `${(d * 100).toFixed(0)}%`);

    const legend = svg.append('g')
      .attr('transform', `translate(${width - legendWidth},${-40})`);

    const legendGradient = legend.append('defs')
      .append('linearGradient')
      .attr('id', 'opportunity-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    legendGradient.selectAll('stop')
      .data(d3.range(0, 1.1, 0.1))
      .enter()
      .append('stop')
      .attr('offset', d => `${d * 100}%`)
      .attr('stop-color', d => opportunityColorScale(d));

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#opportunity-gradient)');

    legend.append('g')
      .attr('transform', `translate(0,${legendHeight})`)
      .call(legendAxis);

  }, [data, selectedNodes]);

  return (
    <OpportunityContainer>
      <svg ref={svgRef}></svg>
    </OpportunityContainer>
  );
};

export default OpportunityHeatmapView;
