import React from 'react';
import './WelcomePage.css'

const WelcomePage = ({onBack}) => {
    // console.log("Welcome!")
    return (
        <div className='welcome-div'>
          <section className="welcome-heading">Welcome to GraphVis!</section>
      
          <section className = "welcome-container">
            <h1 className = "description-heading">About</h1>
            <h3 className="description">
              GraphVis is a tool to help you build graphs and visualize graph algorithms. 
            </h3>
            <h1 className="instructions-heading">How to use GraphVis</h1>
            <ol className="instructions-list">
              <li>Select the number of nodes using the slider</li>
              <li>Add edges by selecting a start node, end node, and edge weight</li>
              <li>Run Dijkstra's Algorithm by selecting a start node and end node</li>
              <li>Make sure to save your graph if you want to access it again!</li>
            </ol>
          </section>
      
          <button onClick={onBack} className="get-started-button">Get Started</button>
        </div>
      )
}

export default WelcomePage; 