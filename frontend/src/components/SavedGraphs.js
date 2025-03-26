import React, { useState } from 'react';
import './SavedGraphs.css'

const SavedGraphs = ({ graphs, fetchGraphByName, doCreate, doHome }) => {
    // console.log("SavedGraph")
    const [graphName, setGraphName] = useState("");
    const handleCreateClick = () => {
        doCreate(graphName); 
    }

    return (
        <div>
        <h2>Saved Graphs</h2>
        <div className='page-container'>
        <div className="saved-graphs-container">
        <ul>
          {graphs.map((graph) => (
            <li key={graph.name} className='graph-item'>
              <button onClick={() => fetchGraphByName(graph.name)}>
                {graph.name}
              </button>
            </li>
          ))}
        </ul>
        </div>
        <div className='graph-input-section'>
            <input type="text" value={graphName} onChange={(e) => setGraphName(e.target.value)}
            className="graph-input" placeholder="Enter new graph name"></input>
        <button onClick={handleCreateClick} className='create-button'>Create</button></div>
        <button onClick={doHome} className='create-button'>Home</button>
        </div>
        </div>
    );

}

export default SavedGraphs;