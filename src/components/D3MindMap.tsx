import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SmartNote } from '../types';

interface D3MindMapProps {
  note: SmartNote;
}

export const D3MindMap: React.FC<D3MindMapProps> = ({ note }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove();

    const width = svgRef.current.clientWidth || 700;
    const height = 450;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Build nodes & links from note data
    const nodesData: Array<{ id: string; name: string; group: string; val: number }> = [
      { id: 'core', name: note.title, group: 'core', val: 30 },
    ];

    const linksData: Array<{ source: string; target: string }> = [];

    // Add key points
    (note.keyPoints || []).slice(0, 5).forEach((pt, idx) => {
      const id = `kp_${idx}`;
      nodesData.push({ id, name: pt, group: 'insight', val: 20 });
      linksData.push({ source: 'core', target: id });
    });

    // Add action items
    (note.actionItems || []).slice(0, 4).forEach((act, idx) => {
      const id = `act_${idx}`;
      nodesData.push({ id, name: `Task: ${act.task}`, group: 'action', val: 15 });
      linksData.push({ source: 'core', target: id });
    });

    const simulation = d3
      .forceSimulation(nodesData as any)
      .force(
        'link',
        d3.forceLink(linksData).id((d: any) => d.id).distance(110)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Links
    const link = g
      .append('g')
      .selectAll('line')
      .data(linksData)
      .join('line')
      .attr('stroke', '#475569')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // Node groups
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodesData)
      .join('g')
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended) as any
      );

    // Node circles
    node
      .append('circle')
      .attr('r', (d: any) => (d.group === 'core' ? 26 : 18))
      .attr('fill', (d: any) =>
        d.group === 'core' ? '#6366f1' : d.group === 'action' ? '#10b981' : '#8b5cf6'
      )
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    // Node labels
    node
      .append('text')
      .text((d: any) => (d.name.length > 28 ? d.name.slice(0, 26) + '...' : d.name))
      .attr('x', 24)
      .attr('y', 4)
      .attr('fill', '#f8fafc')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .style('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0,0,0,0.8)');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [note]);

  return (
    <div className="relative w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
      <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300 flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        <span>Interactive D3 Force Graph (Drag nodes or scroll to zoom)</span>
      </div>
      <svg ref={svgRef} className="w-full h-[450px] cursor-grab active:cursor-grabbing" />
    </div>
  );
};
