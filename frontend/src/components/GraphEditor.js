import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { dijkstra } from '../algorithm/dijkstra';
import './GraphEditor.css';

const GraphEditor = ({data, graphName, onSaveClick, onBackClick, onDeleteClick}) => {
  const svgRef = useRef();
  // const navigate = useNavigate();

  // constants for creating graph 
  const [numNodes, setNumNodes] = useState(data.nodes.length); 
  const [links, setLinks] = useState(data.links); 
  const [newStart, setNewStart] = useState("Select a node");
  const [newEnd, setNewEnd] = useState("Select a node");
  const [newWeight, setNewWeight] = useState(0); 
  const [directed, setDirected] = useState(true); 

  // constants for visualization 
  const [visited, setVisited] = useState([]); 
  const [path, setPath] = useState([]); 
  const [current, setCurrent] = useState(null); 
  const [dijkstraStart, setDijkstraStart] = useState("A"); 
  const [dijkstraEnd, setDijkstraEnd] = useState("A")

  const handleNumNodeChange = (event) => {
    setNumNodes(event.target.value); 
    setLinks([])
  }

  const handleStartChange = (event) => {
    setNewStart(event.target.value); 
  }

  const handleEndChange = (event) => {
    setNewEnd(event.target.value); 
  }

  const handleLinksChange = (event) => {
    console.log("adding link between...")
    console.log(newStart)
    console.log(newEnd)
    if (newStart !== "Select a node" && newEnd !== "Select a node") {
        addNewLink(newStart, newEnd); 
    }
    console.log("handled links")
  }

  const addNewLink = (startNode, endNode) => {
    if (newWeight >= 0 && directed) {
      const updatedLinks = [...links, { source: startNode, target: endNode, weight: newWeight }];
      setLinks(updatedLinks);
    } else if (newWeight >= 0 && !directed) {
      const updatedLinks = [...links, { source: startNode, target: endNode, weight: newWeight }, 
                           { source: endNode, target: startNode, weight: newWeight }];
      setLinks(updatedLinks);
    } else {
      alert("weight must be nonnegative")
    }     
  }

  const handleClearEdges = (event) => {
    setLinks([]);
  }

  const handleNewWeight = (event) => {
    setNewWeight(event.target.value); 
  }

  const directedChange = (event) => {
    handleClearEdges(); 
    setDirected(event.target.checked);
  }

  const handleDijkstraStart = (event) => {
    setDijkstraStart(event.target.value);
  }

  const handleDijkstraEnd = (event) => {
    setDijkstraEnd(event.target.value); 
  }

  const handleDijkstra = async (event) => {
    const path = await dijkstra(links, dijkstraStart, dijkstraEnd, (updatedVisited, updatedCurrent) => {
        setVisited(updatedVisited);
        setCurrent(updatedCurrent); 
    }); 
    console.log("handeling dijkstras...")
    if (path !== undefined) {
      const pathLinks = [];
      for (const link of path.steps) {
        pathLinks.push({start: link.source, end: link.target}); 
      }
      setPath(pathLinks); 
    } else {
      alert("No path exists")
    }
  }

  const handleReset = () => {
    setVisited([]);
    setPath([]);
    setCurrent(null); 
  }

  const handleSaveClick = () => {
    const nodes = []; 

    if (numNodes <= 26) {
        for (let i = 0; i < numNodes; i++) {
            nodes.push({id: String.fromCharCode(65 + i)});
        }
    }
    onSaveClick({nodes: nodes, links: links}); 
  }

  useEffect(() => {
    const width = 600;
    const height = 400;

    const nodes = []; 

    if (numNodes <= 26) {
        for (let i = 0; i < numNodes; i++) {
            nodes.push({id: String.fromCharCode(65 + i)});
        }
    }
    

    const currLinks = []; 
    for (const element of links) {
        currLinks.push({source: element.source, target: element.target, weight: element.weight})
    }

    // Initialize canvas to hold the graph
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll("*").remove();

    // Define arrow marker
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 25)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#7f8c8d');

    const simulation = d3
      .forceSimulation(nodes)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody())
      .force(
        'link',
        d3.forceLink(currLinks).id((d) => d.id).distance(100)
      )
      .on('tick', ticked);

    const linkSelection = svg
      .selectAll('.link')
      .data(currLinks)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke-width', 1) 
      .attr('marker-end', 'url(#arrow)');

    const nodeSelection = svg
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 10)
      .call(
        d3
          .drag()
          .on('start', dragStart)
          .on('drag', drag)
          .on('end', dragEnd)
      );

      const labelSelection = svg
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text((d) => d.id) // Display the node ID
      .attr('font-size', 10)
      .attr('fill', "white")
      .attr('text-anchor', 'middle') // Center-align the text horizontally
      .attr('dy', 4); // Position the text slightly above the circle

      const linkLabels = svg
        .selectAll('.link-label')
        .data(currLinks)
        .enter()
        .append('text')
        .attr('class', 'link-label')
        .text((d) => d.weight) // Show the weight as text
        .attr('font-size', 12)
        .attr('fill', 'black');

    function ticked() {
      nodeSelection
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);

      linkSelection
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

    labelSelection
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y); // Align the text exactly with the node center
    linkLabels
        .attr('x', (d) => (d.source.x + d.target.x) / 2 + 2)
        .attr('y', (d) => (d.source.y + d.target.y) / 2 + 2);
    }

    function dragStart(event, d) {
      simulation.alphaTarget(0.5).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function drag(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnd(event, d) {
      simulation.alphaTarget(0.1);
      d.fx = null;
      d.fy = null;
    }
    
  }, [numNodes, links]);

  useEffect(() => {
    // Update node and link colors only when visited, path, or current changes
    const svg = d3.select(svgRef.current);

    svg
    .selectAll('circle')
    .attr('fill', d =>
      d.id === current
        ? 'red'
        : visited.includes(d.id)
        ? 'orange'
        : 'steelblue'
    );

  svg
    .selectAll('.link')
    .attr('stroke', d =>
      matches(path, d)
        ? 'green'
        : 'black'
    )
    .attr('stroke-width', d =>
    matches(path, d)
      ? 2
      : 1);

     function matches(path, link) {
        for (const step of path) {
            if (step.start === link.source.id && step.end === link.target.id) {
                return true; 
            }
        }
        return false; 
    }
  }, [numNodes, links, visited, path, current]); 

 
const elements = []; 
elements.push(<option key = {-1}>Select a node</option>)
if (numNodes <= 26) {
    for (let i = 0; i < numNodes; i++) {
        const value = String.fromCharCode(65 + i); 
        elements.push(<option key = {value}>{value}</option>);
    }
}

  return (
    <div className="network-graph-editor">
  <div className="controls-wrapper">
    <div className="node-edit-container">
      <span>Select number of nodes: </span>
      <input
        type="range"
        value={numNodes}
        onChange={handleNumNodeChange}
        max="26"
        min="1"
        className="slider"
      />
      <span className="slider-value">{numNodes}</span>
    </div>
    <div className="edge-edit-container">
      <div>
        <label><input type="checkbox" checked={directed} onChange={directedChange}/> Directed Graph</label>
        <span>Add start of new edge: </span>
        <select
          value={newStart}
          onChange={handleStartChange}
          className="form-input"
        >
          {elements}
        </select>
      </div>
      <div>
        <span>Add end of new edge: </span>
        <select
          value={newEnd}
          onChange={handleEndChange}
          className="form-input"
        >
          {elements}
        </select>
      </div>
      <div>
        <span>Add weight of new edge: </span>
        <input
          type="number"
          value={newWeight}
          onChange={handleNewWeight}
          className="form-input"
          min="0"
        />
      </div>
      <div>
        <button onClick={handleLinksChange} className="form-button">
          Add New Edge
        </button>
        <button onClick={handleClearEdges} className="form-button">
          Clear Edges
        </button>
      </div>
    </div>
    <div className="edge-edit-container">
      <div>
        <span>Add start node: </span>
        <select
          value={dijkstraStart}
          onChange={handleDijkstraStart}
          className="form-input"
        >
          {elements}
        </select>
      </div>
      <div>
        <span>Add end node: </span>
        <select
          value={dijkstraEnd}
          onChange={handleDijkstraEnd}
          className="form-input"
        >
          {elements}
        </select>
      </div>
      <div>
        <button onClick={handleDijkstra} className="form-button">
          Run Dijkstra's
        </button>
        <button onClick={handleReset} className="form-button">
          Reset
        </button>
      </div>
    </div>
    
  </div>

  <div className="svg-container-wrapper">
    <svg ref={svgRef} className="svg-container"></svg>
  </div>
  <div className='navigate-container'>
      <div >
        <button onClick={handleSaveClick} className="form-button">
          Save
        </button>
      </div>
      <div>
        <button onClick={onBackClick} className="form-button">
          Back
        </button>
      </div>
      <div>
      </div>
    </div>
</div>
    
  );
};

export default GraphEditor;